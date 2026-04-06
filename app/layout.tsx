import { defaultSiteContent } from '@/src/data/defaultSiteContent';
import type { SiteContent } from '@/src/types';
import './globals.css';

async function getSiteContent(): Promise<SiteContent> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/content`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch content');
    const data = (await res.json()) as SiteContent | null;
    return data ?? defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function generateMetadata() {
  const content = await getSiteContent();
  return {
    title: content.siteName,
    description: content.introQuote,
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
