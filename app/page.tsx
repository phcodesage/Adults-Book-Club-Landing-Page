import { defaultSiteContent } from '@/src/data/defaultSiteContent';
import { SiteLandingPage } from '@/src/components/SiteLandingPage';
import type { SiteContent } from '@/src/types';
import { connectToDatabase } from '@/lib/mongodb';

async function getSiteContent(): Promise<SiteContent> {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection('siteContent').findOne({ _id: 'singleton' as unknown as never });
    if (!doc) return defaultSiteContent;

    const { _id, ...content } = doc;
    void _id;
    return content as SiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export default async function HomePage() {
  const content = await getSiteContent();
  return <SiteLandingPage content={content} />;
}
