'use client';

import { useEffect, useState } from 'react';
import { AdminDashboard } from '@/src/components/AdminDashboard';
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
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [visits, setVisits] = useState<AnalyticsVisit[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus>('loading');

  // Load data from MongoDB via API routes
  useEffect(() => {
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
  }, []);

  // Record visit for the admin page itself (skip — admin visits aren't tracked)
  useEffect(() => {
    void recordSiteVisit('/').then((visit) => {
      if (visit) setVisits((prev) => [visit, ...prev]);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <AdminDashboard
      content={siteContent}
      mediaLibrary={mediaLibrary}
      visits={visits}
      dbStatus={dbStatus}
      onBackToSite={() => { window.location.href = '/'; }}
      onLogout={() => { window.location.href = '/'; }}
      onSaveContent={handleSaveContent}
      onUploadMedia={handleUploadMedia}
      onReplaceMedia={handleReplaceMedia}
      onDeleteMedia={handleDeleteMedia}
    />
  );
}
