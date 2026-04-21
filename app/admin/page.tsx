'use client';

import { useEffect, useState } from 'react';
import { AdminDashboard } from '@/src/components/AdminDashboard';
import AdminLogin from '@/src/components/AdminLogin';
import { defaultSiteContent } from '@/src/data/defaultSiteContent';
import {
  deleteMediaItem,
  getAnalyticsVisits,
  getDbStatus,
  getMediaLibrary,
  getSiteContent,
  replaceMediaItem,
  recordSiteVisit,
  saveSiteContent,
  uploadMediaFiles,
} from '@/src/lib/siteStorage';
import type { AnalyticsVisit, MediaItem, SiteContent } from '@/src/types';

type DbStatus = 'connected' | 'disconnected' | 'error' | 'loading';

function clearDeletedMediaReferences(content: SiteContent, deletedMedia: MediaItem) {
  const deletedHeroImage = content.heroImageSrc === deletedMedia.src;
  return {
    ...content,
    logoSrc: content.logoSrc === deletedMedia.src ? defaultSiteContent.logoSrc : content.logoSrc,
    heroImageSrc: deletedHeroImage ? defaultSiteContent.heroImageSrc : content.heroImageSrc,
    heroImageAlt: deletedHeroImage ? defaultSiteContent.heroImageAlt : content.heroImageAlt,
    books: content.books.map((book, index) => {
      if (book.imageSrc !== deletedMedia.src) return book;
      const fallbackBook = defaultSiteContent.books[index];
      return {
        ...book,
        imageSrc: fallbackBook?.imageSrc ?? defaultSiteContent.heroImageSrc,
        imageAlt: fallbackBook?.imageAlt ?? 'Book cover',
      };
    }),
  };
}

function replaceMediaReferences(content: SiteContent, previousSource: string, nextMedia: MediaItem) {
  const replacedHeroImage = content.heroImageSrc === previousSource;
  return {
    ...content,
    logoSrc: content.logoSrc === previousSource ? nextMedia.src : content.logoSrc,
    heroImageSrc: replacedHeroImage ? nextMedia.src : content.heroImageSrc,
    heroImageAlt: replacedHeroImage ? nextMedia.name : content.heroImageAlt,
    books: content.books.map((book) =>
      book.imageSrc === previousSource
        ? { ...book, imageSrc: nextMedia.src, imageAlt: nextMedia.name }
        : book
    ),
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [visits, setVisits] = useState<AnalyticsVisit[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus>('loading');

  // Check authentication status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/verify');
        const result = await response.json();
        setIsAuthenticated(result.success);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  // Load data from MongoDB via API routes (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let cancelled = false;

    async function loadData() {
      setDbStatus('loading');
      const status = await getDbStatus();
      if (cancelled) return;

      if (status !== 'connected') {
        setDbStatus(status);
        return;
      }

      setDbStatus('connected');
      const [content, media, analyticsVisits] = await Promise.all([
        getSiteContent(),
        getMediaLibrary(),
        getAnalyticsVisits(),
      ]);

      if (cancelled) return;
      setSiteContent(content);
      setMediaLibrary(media);
      setVisits(analyticsVisits);
    }

    void loadData();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Record visit for the admin page itself (skip — admin visits aren't tracked)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    void recordSiteVisit('/').then((visit) => {
      if (visit) setVisits((prev) => [visit, ...prev]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSaveContent = async (content: SiteContent) => {
    await saveSiteContent(content);
    setSiteContent(content);
  };

  const handleUploadMedia = async (files: FileList | null) => {
    if (!files?.length) return;
    const nextLibrary = await uploadMediaFiles(files);
    setMediaLibrary(nextLibrary);
  };

  const handleDeleteMedia = async (mediaId: string) => {
    const mediaToDelete = mediaLibrary.find((item) => item.id === mediaId);
    if (!mediaToDelete) return;
    const nextLibrary = await deleteMediaItem(mediaId);
    const nextContent = clearDeletedMediaReferences(siteContent, mediaToDelete);
    await saveSiteContent(nextContent);
    setMediaLibrary(nextLibrary);
    setSiteContent(nextContent);
  };

  const handleReplaceMedia = async (mediaId: string, file: File | null) => {
    if (!file) return;
    const replacement = await replaceMediaItem(mediaId, file);
    if (!replacement) return;
    const nextContent = replaceMediaReferences(siteContent, replacement.previousItem.src, replacement.nextItem);
    await saveSiteContent(nextContent);
    setMediaLibrary(replacement.mediaLibrary);
    setSiteContent(nextContent);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setIsAuthenticated(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f7f3ef] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#05264d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#05264d] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Show admin dashboard if authenticated
  return (
    <AdminDashboard
      content={siteContent}
      mediaLibrary={mediaLibrary}
      visits={visits}
      dbStatus={dbStatus}
      onBackToSite={handleBackToHome}
      onLogout={handleLogout}
      onSaveContent={handleSaveContent}
      onUploadMedia={handleUploadMedia}
      onReplaceMedia={handleReplaceMedia}
      onDeleteMedia={handleDeleteMedia}
    />
  );
}
