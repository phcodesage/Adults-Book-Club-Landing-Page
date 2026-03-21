import { defaultSiteContent } from '@/src/data/defaultSiteContent';
import { SiteLandingPage } from '@/src/components/SiteLandingPage';
import type { SiteContent } from '@/src/types';

async function getSiteContent(): Promise<SiteContent> {
  try {
    // Use absolute URL for server-side fetch in Next.js
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/content`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch content');
    const data = (await res.json()) as SiteContent | null;
    return data ?? defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export default async function HomePage() {
  const content = await getSiteContent();
  return <SiteLandingPage content={content} />;
}
