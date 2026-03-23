/**
 * siteStorage.ts
 *
 * All persistence is now backed by the Express + MongoDB API server
 * running at localhost:3001 (proxied through Vite at /api).
 *
 * localStorage is still used for:
 *   - Country-lookup cache (ephemeral, per-device)
 *   - Visit debounce flag (ephemeral, per-session)
 */

import { defaultMediaLibrary, defaultSiteContent } from '../data/defaultSiteContent';
import { createId } from './siteUtils';
import type { AnalyticsVisit, DeviceType, MediaItem, SiteContent } from '../types';

// ─── Country / Visit helpers (still browser-side) ────────────────────────────

const localKeys = {
  countryCache: 'adults-book-club:country-cache',
  recentVisit: 'adults-book-club:recent-visit',
} as const;

const countryCacheTtlMs = 1000 * 60 * 60 * 24 * 7;
const visitDebounceMs = 15000;

type CountryCache = { country: string; cachedAt: string };
type RecentVisitCache = { path: string; trackedAt: number };

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — ignore
  }
}

function detectDeviceType(userAgent: string): DeviceType {
  if (/tablet|ipad|playbook|silk|(android(?!.*mobi))/i.test(userAgent)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Opera Mini/i.test(userAgent)) return 'Mobile';
  return 'Desktop';
}

function getLocaleCountryFallback() {
  const region = navigator.language.split('-')[1];
  return region ? region.toUpperCase() : 'Unknown';
}

async function resolveVisitorCountry(): Promise<string> {
  const cached = readLocal<CountryCache | null>(localKeys.countryCache, null);

  if (cached) {
    const ageMs = Date.now() - new Date(cached.cachedAt).getTime();
    if (ageMs < countryCacheTtlMs) return cached.country;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch('https://ipwho.is/', { signal: controller.signal });
    if (!response.ok) throw new Error('Country lookup failed');
    const payload = (await response.json()) as { country?: string; success?: boolean };
    const country =
      payload.success === false
        ? getLocaleCountryFallback()
        : payload.country?.trim() || getLocaleCountryFallback();

    writeLocal<CountryCache>(localKeys.countryCache, { country, cachedAt: new Date().toISOString() });
    return country;
  } catch {
    return cached?.country ?? getLocaleCountryFallback();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function shouldTrackVisit(path: string): boolean {
  try {
    const raw = sessionStorage.getItem(localKeys.recentVisit);
    const recent: RecentVisitCache | null = raw ? JSON.parse(raw) : null;

    if (recent && recent.path === path && Date.now() - recent.trackedAt < visitDebounceMs) {
      return false;
    }

    sessionStorage.setItem(
      localKeys.recentVisit,
      JSON.stringify({ path, trackedAt: Date.now() } satisfies RecentVisitCache)
    );
    return true;
  } catch {
    return true;
  }
}

// ─── Media helpers ────────────────────────────────────────────────────────────

function getMediaType(mimeType: string): MediaItem['type'] | null {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return null;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unsupported file format'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${init?.method ?? 'GET'} ${path} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Connection Status ────────────────────────────────────────────────────────

export async function getDbStatus(): Promise<'connected' | 'disconnected' | 'error'> {
  try {
    const data = await apiFetch<{ status: string }>('/api/status');
    return data.status as 'connected' | 'disconnected' | 'error';
  } catch {
    return 'error';
  }
}

// ─── CMS Content ──────────────────────────────────────────────────────────────

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const data = await apiFetch<SiteContent | null>('/api/content');
    return data ?? defaultSiteContent;
  } catch {
    console.warn('[siteStorage] Could not load content from API, using defaults.');
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const body = JSON.stringify(content);

  try {
    await apiFetch('/api/content', { method: 'PUT', body });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('(405)') || message.includes('(403)')) {
      await apiFetch('/api/content', { method: 'POST', body });
      return;
    }

    throw error;
  }
}

// ─── Media Library ────────────────────────────────────────────────────────────

export async function getMediaLibrary(): Promise<MediaItem[]> {
  try {
    const data = await apiFetch<MediaItem[]>('/api/media');
    // If DB is empty, seed with the default library
    if (!data.length) {
      await apiFetch('/api/media', { method: 'POST', body: JSON.stringify(defaultMediaLibrary) });
      return defaultMediaLibrary;
    }
    return data;
  } catch {
    console.warn('[siteStorage] Could not load media from API, using defaults.');
    return defaultMediaLibrary;
  }
}

export async function uploadMediaFiles(fileList: FileList | File[]): Promise<MediaItem[]> {
  const files = Array.from(fileList).filter((f) => getMediaType(f.type));

  const newItems: MediaItem[] = await Promise.all(
    files.map(async (file) => {
      const mediaType = getMediaType(file.type)!;
      return {
        id: createId('media'),
        name: file.name,
        src: await fileToDataUrl(file),
        type: mediaType,
        origin: 'upload' as const,
        uploadedAt: new Date().toISOString(),
      };
    })
  );

  return apiFetch<MediaItem[]>('/api/media', { method: 'POST', body: JSON.stringify(newItems) });
}

export async function replaceMediaItem(
  mediaId: string,
  file: File
): Promise<{ previousItem: MediaItem; nextItem: MediaItem; mediaLibrary: MediaItem[] } | null> {
  const mediaType = getMediaType(file.type);
  if (!mediaType) throw new Error('Unsupported media type');

  const src = await fileToDataUrl(file);

  return apiFetch<{ previousItem: MediaItem; nextItem: MediaItem; mediaLibrary: MediaItem[] }>(
    `/api/media/${mediaId}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        name: file.name,
        src,
        type: mediaType,
        origin: 'upload',
        uploadedAt: new Date().toISOString(),
      }),
    }
  );
}

export async function deleteMediaItem(mediaId: string): Promise<MediaItem[]> {
  return apiFetch<MediaItem[]>(`/api/media/${mediaId}`, { method: 'DELETE' });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalyticsVisits(): Promise<AnalyticsVisit[]> {
  try {
    return await apiFetch<AnalyticsVisit[]>('/api/analytics');
  } catch {
    console.warn('[siteStorage] Could not load analytics from API.');
    return [];
  }
}

export async function recordSiteVisit(path: string): Promise<AnalyticsVisit | null> {
  if (!shouldTrackVisit(path)) return null;

  const visit: AnalyticsVisit = {
    id: createId('visit'),
    path,
    deviceType: detectDeviceType(navigator.userAgent),
    country: await resolveVisitorCountry(),
    visitedAt: new Date().toISOString(),
  };

  try {
    await apiFetch('/api/analytics', { method: 'POST', body: JSON.stringify(visit) });
  } catch {
    console.warn('[siteStorage] Could not record visit to API.');
  }

  return visit;
}
