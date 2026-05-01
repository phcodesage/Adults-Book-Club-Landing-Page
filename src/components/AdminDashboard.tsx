'use client';

import {
  ArrowLeft,
  BarChart3,
  BookImage,
  Copy,
  FilePenLine,
  Globe2,
  ImagePlus,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
  Upload,
  CreditCard,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { defaultSiteContent } from '../data/defaultSiteContent';
import { MONTH_NAMES, createId, createMonthLabel, getFilenameFromPath, isBookExpired } from '../lib/siteUtils';
import type { AnalyticsVisit, BookSelection, MediaItem, SiteContent } from '../types';
import PaymentsDashboard from './PaymentsDashboard';

type AdminSection = 'analytics' | 'cms' | 'payments';
type CmsView = 'content' | 'media';

type DbStatus = 'connected' | 'disconnected' | 'error' | 'loading';

type AdminDashboardProps = {
  content: SiteContent;
  mediaLibrary: MediaItem[];
  visits: AnalyticsVisit[];
  dbStatus: DbStatus;
  onBackToSite: () => void;
  onLogout: () => void;
  onSaveContent: (content: SiteContent) => Promise<void>;
  onUploadMedia: (files: FileList | null) => Promise<void>;
  onReplaceMedia: (mediaId: string, file: File | null) => Promise<void>;
  onDeleteMedia: (mediaId: string) => void;
};

const deviceIcons = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
} as const;

function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: typeof Globe2;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-white">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'url';
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
      />
    </label>
  );
}

function ImageSourceField({
  label,
  value,
  onChange,
  mediaLibrary,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mediaLibrary: MediaItem[];
}) {
  const imageOptions = mediaLibrary.filter((mediaItem) => mediaItem.type === 'image');

  return (
    <div className="space-y-3">
      <Field label={label} value={value} onChange={onChange} />
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Pick From Gallery
        </span>
        <select
          value=""
          onChange={(event) => {
            if (!event.target.value) {
              return;
            }

            onChange(event.target.value);
          }}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
        >
          <option value="">Choose media</option>
          {imageOptions.map((mediaItem) => (
            <option key={mediaItem.id} value={mediaItem.src}>
              {mediaItem.name}
            </option>
          ))}
        </select>
      </label>
      {value && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <img src={value} alt={label} className="h-40 w-full object-cover" />
        </div>
      )}
    </div>
  );
}

function MediaPreview({ mediaItem }: { mediaItem: MediaItem }) {
  if (mediaItem.type === 'video') {
    return (
      <video
        src={mediaItem.src}
        controls
        preload="metadata"
        className="h-48 w-full border-b border-slate-200 bg-slate-950 object-cover"
      />
    );
  }

  return (
    <img
      src={mediaItem.src}
      alt={mediaItem.name}
      className="h-48 w-full border-b border-slate-200 object-cover"
    />
  );
}

const dbStatusConfig: Record<DbStatus, { label: string; dot: string }> = {
  connected: { label: 'MongoDB connected', dot: 'bg-emerald-400' },
  loading:   { label: 'Connecting…',       dot: 'bg-amber-400 animate-pulse' },
  disconnected: { label: 'DB disconnected', dot: 'bg-slate-400' },
  error:     { label: 'DB error',          dot: 'bg-rose-400' },
};

function BookEditorCard({
  book,
  updateBook,
  updateBookMonth,
  updateBookYear,
  removeBook,
  mediaLibrary,
}: {
  book: BookSelection;
  updateBook: (id: string, patch: Partial<BookSelection>) => void;
  updateBookMonth: (id: string, month: number) => void;
  updateBookYear: (id: string, year: number) => void;
  removeBook: (id: string) => void;
  mediaLibrary: MediaItem[];
}) {
  return (
    <div key={book.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{book.monthLabel}</p>
          <h3 className="mt-2 text-2xl text-slate-900">{book.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => removeBook(book.id)}
          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Month</span>
          <select
            value={String(book.monthIndex)}
            onChange={(event) => updateBookMonth(book.id, Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
          >
            {MONTH_NAMES.map((monthName, monthIndex) => (
              <option key={monthName} value={monthIndex}>
                {monthName}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Year"
          value={String(book.year)}
          onChange={(value) => updateBookYear(book.id, Number(value) || book.year)}
          type="number"
        />

        <Field label="Title" value={book.title} onChange={(value) => updateBook(book.id, { title: value })} />
        <Field label="Author" value={book.author} onChange={(value) => updateBook(book.id, { author: value })} />
        <Field label="Schedule" value={book.schedule} onChange={(value) => updateBook(book.id, { schedule: value })} />
        <Field label="Alt Text" value={book.imageAlt} onChange={(value) => updateBook(book.id, { imageAlt: value })} />
      </div>

      <div className="mt-5">
        <ImageSourceField
          label="Book Cover Source"
          value={book.imageSrc}
          onChange={(value) => updateBook(book.id, { imageSrc: value })}
          mediaLibrary={mediaLibrary}
        />
      </div>
    </div>
  );
}

export function AdminDashboard({
  content,
  mediaLibrary,
  visits,
  dbStatus,
  onBackToSite,
  onLogout,
  onSaveContent,
  onUploadMedia,
  onReplaceMedia,
  onDeleteMedia,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('analytics');
  const [activeCmsView, setActiveCmsView] = useState<CmsView>('content');
  const [draft, setDraft] = useState(content);
  const [uploadMessage, setUploadMessage] = useState('Upload images or videos for the media library.');
  const [saveMessage, setSaveMessage] = useState('Changes are saved to MongoDB and persist across sessions.');
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [replacingMediaId, setReplacingMediaId] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    if (!copiedMediaId) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopiedMediaId(null), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [copiedMediaId]);

  const totalVisits = visits.length;
  const deviceSummary = (['Desktop', 'Mobile', 'Tablet'] as const).map((deviceType) => {
    const total = visits.filter((visit) => visit.deviceType === deviceType).length;
    const share = totalVisits ? Math.round((total / totalVisits) * 100) : 0;

    return {
      deviceType,
      total,
      share,
    };
  });
  const visitsByCountry = Object.entries(
    visits.reduce<Record<string, number>>((accumulator, visit) => {
      const country = visit.country || 'Unknown';
      accumulator[country] = (accumulator[country] ?? 0) + 1;
      return accumulator;
    }, {})
  ).sort((left, right) => right[1] - left[1]);
  const latestVisit = visits[0];
  const mediaUsageCounts = [draft.logoSrc, draft.heroImageSrc, ...draft.books.map((book) => book.imageSrc)].reduce<
    Record<string, number>
  >((accumulator, source) => {
    accumulator[source] = (accumulator[source] ?? 0) + 1;
    return accumulator;
  }, {});
  const filteredMediaLibrary =
    mediaFilter === 'all' ? mediaLibrary : mediaLibrary.filter((mediaItem) => mediaItem.type === mediaFilter);

  const updateDraft = <Key extends keyof SiteContent>(key: Key, value: SiteContent[Key]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  };

  const updateBook = (bookId: string, patch: Partial<BookSelection>) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      books: currentDraft.books.map((book) => (book.id === bookId ? { ...book, ...patch } : book)),
    }));
  };

  const updateBookMonth = (bookId: string, monthIndex: number) => {
    const targetBook = draft.books.find((book) => book.id === bookId);

    if (!targetBook) {
      return;
    }

    updateBook(bookId, {
      monthIndex,
      monthLabel: createMonthLabel(monthIndex, targetBook.year),
    });
  };

  const updateBookYear = (bookId: string, year: number) => {
    const targetBook = draft.books.find((book) => book.id === bookId);

    if (!targetBook) {
      return;
    }

    updateBook(bookId, {
      year,
      monthLabel: createMonthLabel(targetBook.monthIndex, year),
    });
  };

  const addBook = () => {
    const lastBook = draft.books[draft.books.length - 1];
    const nextMonthIndex = lastBook ? (lastBook.monthIndex + 1) % 12 : 0;
    const nextYear = lastBook ? lastBook.year + (lastBook.monthIndex === 11 ? 1 : 0) : new Date().getFullYear();

    setDraft((currentDraft) => ({
      ...currentDraft,
      books: [
        ...currentDraft.books,
        {
          id: createId('book'),
          monthLabel: createMonthLabel(nextMonthIndex, nextYear),
          monthIndex: nextMonthIndex,
          year: nextYear,
          imageSrc: currentDraft.heroImageSrc,
          imageAlt: 'Book cover',
          title: 'New Book Title',
          author: 'Author Name',
          schedule: 'Meeting dates',
        },
      ],
    }));
  };

  const removeBook = (bookId: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      books: currentDraft.books.filter((book) => book.id !== bookId),
    }));
  };

  const activeBooks = draft.books.filter((book) => !isBookExpired(book.year, book.monthIndex));
  const pastBooks = draft.books.filter((book) => isBookExpired(book.year, book.monthIndex));

  const prunePastBooks = () => {
    if (!window.confirm(`Are you sure you want to remove all ${pastBooks.length} past books? This cannot be undone.`)) {
      return;
    }
    setDraft((currentDraft) => ({
      ...currentDraft,
      books: activeBooks,
    }));
  };

  const handleSave = async () => {
    await onSaveContent(draft);
    setSaveMessage(`Saved to MongoDB at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  const handleReset = async () => {
    setDraft(defaultSiteContent);
    await onSaveContent(defaultSiteContent);
    setSaveMessage('Content reset to the original seeded version.');
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    setIsUploading(true);

    try {
      await onUploadMedia(files);
      setUploadMessage(`${files.length} image${files.length > 1 ? 's' : ''} uploaded.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaReplace = async (mediaId: string, file: File | null) => {
    if (!file) {
      return;
    }

    setReplacingMediaId(mediaId);

    try {
      await onReplaceMedia(mediaId, file);
      setUploadMessage(`Media item replaced successfully.`);
    } finally {
      setReplacingMediaId(null);
    }
  };

  const copyMediaPath = async (mediaItem: MediaItem) => {
    try {
      await navigator.clipboard.writeText(mediaItem.src);
      setCopiedMediaId(mediaItem.id);
    } catch {
      setUploadMessage(`Copy failed for ${mediaItem.name}.`);
    }
  };

  const openCmsView = (nextView: CmsView) => {
    setActiveSection('cms');
    setActiveCmsView(nextView);
  };

  return (
    <div className="min-h-screen bg-[#f7f3ef] text-slate-900">
      <div className="min-h-screen md:pl-72">
        <aside className="sticky top-0 z-40 flex w-full flex-col bg-[#10213f] px-5 py-6 text-white shadow-xl md:fixed md:inset-y-0 md:left-0 md:w-72 md:overflow-y-auto">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20"
          >
            <ArrowLeft size={18} />
            Back To Site
          </button>

          <div className="flex flex-1 items-center justify-center py-10">
            <div className="grid w-full gap-4">
              <button
                type="button"
                onClick={() => setActiveSection('analytics')}
                className={`rounded-3xl px-5 py-4 text-left transition ${
                  activeSection === 'analytics' ? 'bg-white text-slate-900 shadow-lg' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} />
                  <div>
                    <p className="font-semibold">Analytics</p>
                    <p className={`text-xs ${activeSection === 'analytics' ? 'text-slate-500' : 'text-white/70'}`}>
                      Visits by device and country
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => openCmsView('content')}
                className={`rounded-3xl px-5 py-4 text-left transition ${
                  activeSection === 'cms' ? 'bg-white text-slate-900 shadow-lg' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FilePenLine size={20} />
                  <div>
                    <p className="font-semibold">CMS Editor</p>
                    <p className={`text-xs ${activeSection === 'cms' ? 'text-slate-500' : 'text-white/70'}`}>
                      Content and media management
                    </p>
                  </div>
                </div>
              </button>

              <div
                className={`ml-4 grid gap-2 overflow-hidden border-l border-white/15 pl-4 transition-all ${
                  activeSection === 'cms' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <button
                  type="button"
                  onClick={() => openCmsView('content')}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeSection === 'cms' && activeCmsView === 'content'
                      ? 'bg-white/20 text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Content Editor
                </button>
                <button
                  type="button"
                  onClick={() => openCmsView('media')}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeSection === 'cms' && activeCmsView === 'media'
                      ? 'bg-white/20 text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Media Library
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveSection('payments')}
                className={`rounded-3xl px-5 py-4 text-left transition ${
                  activeSection === 'payments' ? 'bg-white text-slate-900 shadow-lg' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={20} />
                  <div>
                    <p className="font-semibold">Payments</p>
                    <p className={`text-xs ${activeSection === 'payments' ? 'text-slate-500' : 'text-white/70'}`}>
                      Zelle payment management
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* MongoDB Status Badge */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3">
            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dbStatusConfig[dbStatus].dot}`} />
            <span className="text-xs font-semibold text-white/70">{dbStatusConfig[dbStatus].label}</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <main className="px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl">
            {activeSection === 'analytics' ? (
              <div className="space-y-6">
                <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ca3433]">Analytics</p>
                  <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h1 className="text-4xl text-slate-900">Site traffic overview</h1>
                      <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        This dashboard records visits from the public site and groups them by device type and visitor country.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                      {latestVisit
                        ? `Latest visit: ${new Date(latestVisit.visitedAt).toLocaleString()}`
                        : 'No visits recorded yet'}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <StatCard label="Total Page Visits" value={String(totalVisits)} Icon={Globe2} />
                  <StatCard label="Countries Reached" value={String(visitsByCountry.length)} Icon={BarChart3} />
                  <StatCard
                    label="Devices Tracked"
                    value={String(deviceSummary.filter((device) => device.total > 0).length)}
                    Icon={Monitor}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <BarChart3 size={20} className="text-[#ca3433]" />
                      <h2 className="text-2xl text-slate-900">Device split</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {deviceSummary.map((item) => {
                        const Icon = deviceIcons[item.deviceType];

                        return (
                          <div key={item.deviceType} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-center justify-between">
                              <div className="rounded-2xl bg-white p-3 shadow-sm">
                                <Icon size={22} className="text-slate-900" />
                              </div>
                              <span className="text-sm font-semibold text-slate-500">{item.share}%</span>
                            </div>
                            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                              {item.deviceType}
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">{item.total}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <Globe2 size={20} className="text-[#ca3433]" />
                      <h2 className="text-2xl text-slate-900">Visits by country</h2>
                    </div>
                    <div className="space-y-4">
                      {visitsByCountry.length ? (
                        visitsByCountry.map(([country, total]) => {
                          const share = totalVisits ? Math.round((total / totalVisits) * 100) : 0;

                          return (
                            <div key={country}>
                              <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-700">{country}</span>
                                <span className="text-slate-500">
                                  {total} visit{total === 1 ? '' : 's'}
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100">
                                <div
                                  className="h-2 rounded-full bg-[#ca3433]"
                                  style={{ width: `${Math.max(share, total ? 8 : 0)}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                          Open the public site to start recording visits.
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <Monitor size={20} className="text-[#ca3433]" />
                    <h2 className="text-2xl text-slate-900">Recent visits</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          <th className="pb-3 pr-4">Time</th>
                          <th className="pb-3 pr-4">Path</th>
                          <th className="pb-3 pr-4">Device</th>
                          <th className="pb-3 pr-4">Country</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visits.slice(0, 10).map((visit) => (
                          <tr key={visit.id} className="text-sm text-slate-700">
                            <td className="py-3 pr-4">{new Date(visit.visitedAt).toLocaleString()}</td>
                            <td className="py-3 pr-4">{visit.path}</td>
                            <td className="py-3 pr-4">{visit.deviceType}</td>
                            <td className="py-3 pr-4">{visit.country}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!visits.length && <div className="py-8 text-sm text-slate-500">No visit data yet.</div>}
                  </div>
                </section>
              </div>
            ) : activeSection === 'payments' ? (
              <PaymentsDashboard />
            ) : activeSection === 'cms' && activeCmsView === 'content' ? (
              <div className="space-y-6">
                <div className="sticky top-4 z-30 -mx-1 rounded-[2rem] bg-[#f7f3ef]/90 px-1 pb-2 pt-1 backdrop-blur">
                  <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ca3433]">CMS Editor</p>
                        <h1 className="mt-3 text-4xl text-slate-900">Manage site content</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                          Update copy, book cards, and content structure here. Media management now lives in its own CMS subtree.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                        >
                          Reset Seed Content
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="rounded-2xl bg-[#ca3433] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#af2d2c]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">{saveMessage}</p>
                  </div>
                </div>

                <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                  <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <FilePenLine size={20} className="text-[#ca3433]" />
                      <h2 className="text-2xl text-slate-900">Core content</h2>
                    </div>
                    <div className="grid gap-5">
                      <Field label="Site Title" value={draft.siteName} onChange={(value) => updateDraft('siteName', value)} />
                      <Field
                        label="Section Heading"
                        value={draft.sectionTitle}
                        onChange={(value) => updateDraft('sectionTitle', value)}
                      />
                      <Field label="Price Label" value={draft.priceLabel} onChange={(value) => updateDraft('priceLabel', value)} />
                      <Field
                        label="Registration Link"
                        value={draft.registrationLink}
                        onChange={(value) => updateDraft('registrationLink', value)}
                        type="url"
                      />
                      <Field
                        label="Primary CTA Label"
                        value={draft.registrationCtaLabel}
                        onChange={(value) => updateDraft('registrationCtaLabel', value)}
                      />
                      <Field
                        label="Closed CTA Label"
                        value={draft.registrationClosedLabel}
                        onChange={(value) => updateDraft('registrationClosedLabel', value)}
                      />
                      <Field
                        label="Card CTA Label"
                        value={draft.cardCtaLabel}
                        onChange={(value) => updateDraft('cardCtaLabel', value)}
                      />
                      <Field
                        label="Card Closed Label"
                        value={draft.cardClosedLabel}
                        onChange={(value) => updateDraft('cardClosedLabel', value)}
                      />
                      <TextAreaField
                        label="Quote / Intro Copy"
                        value={draft.introQuote}
                        onChange={(value) => updateDraft('introQuote', value)}
                        rows={5}
                      />
                      <TextAreaField
                        label="Footer Copy"
                        value={draft.footerText}
                        onChange={(value) => updateDraft('footerText', value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <BookImage size={20} className="text-[#ca3433]" />
                      <h2 className="text-2xl text-slate-900">Brand and hero media</h2>
                    </div>
                    <div className="grid gap-5">
                      <ImageSourceField
                        label="Logo Source"
                        value={draft.logoSrc}
                        onChange={(value) => updateDraft('logoSrc', value)}
                        mediaLibrary={mediaLibrary}
                      />
                      <ImageSourceField
                        label="Hero Image Source"
                        value={draft.heroImageSrc}
                        onChange={(value) => updateDraft('heroImageSrc', value)}
                        mediaLibrary={mediaLibrary}
                      />
                      <Field
                        label="Hero Image Alt Text"
                        value={draft.heroImageAlt}
                        onChange={(value) => updateDraft('heroImageAlt', value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <FilePenLine size={20} className="text-[#ca3433]" />
                      <h2 className="text-2xl text-slate-900">Book cards</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {pastBooks.length > 0 && (
                        <button
                          type="button"
                          onClick={prunePastBooks}
                          className="rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                        >
                          Prune {pastBooks.length} Past Book{pastBooks.length > 1 ? 's' : ''}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={addBook}
                        className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                      >
                        Add Book
                      </button>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Active Books */}
                    <div className="space-y-5">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Active Books ({activeBooks.length})
                      </h3>
                      {activeBooks.length > 0 ? (
                        activeBooks.map((book) => (
                          <BookEditorCard 
                            key={book.id} 
                            book={book} 
                            updateBook={updateBook}
                            updateBookMonth={updateBookMonth}
                            updateBookYear={updateBookYear}
                            removeBook={removeBook}
                            mediaLibrary={mediaLibrary}
                          />
                        ))
                      ) : (
                        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                          No active books. Add one to show on the site!
                        </div>
                      )}
                    </div>

                    {/* Past Books */}
                    {pastBooks.length > 0 && (
                      <div className="space-y-5 opacity-75">
                        <h3 className="text-lg font-bold text-slate-500 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                          Past / Expired Books ({pastBooks.length})
                        </h3>
                        {pastBooks.map((book) => (
                          <BookEditorCard 
                            key={book.id} 
                            book={book} 
                            updateBook={updateBook}
                            updateBookMonth={updateBookMonth}
                            updateBookYear={updateBookYear}
                            removeBook={removeBook}
                            mediaLibrary={mediaLibrary}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : activeSection === 'cms' ? (
              <div className="space-y-6">
                <div className="sticky top-4 z-30 -mx-1 rounded-[2rem] bg-[#f7f3ef]/90 px-1 pb-2 pt-1 backdrop-blur">
                  <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ca3433]">CMS Editor / Media Library</p>
                        <h1 className="mt-3 text-4xl text-slate-900">Manage media assets</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                          Browse every image and video used by the site, then add, replace, or remove assets from this dedicated media view.
                        </p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                        <Upload size={16} />
                        {isUploading ? 'Uploading...' : 'Add New Media'}
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            void handleMediaUpload(event.target.files);
                            event.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">{uploadMessage}</p>
                  </div>
                </div>

                <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <ImagePlus size={20} className="text-[#ca3433]" />
                        <h2 className="text-2xl text-slate-900">Media library</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setMediaFilter('all')}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            mediaFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          All ({mediaLibrary.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaFilter('image')}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            mediaFilter === 'image'
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Images ({mediaLibrary.filter((mediaItem) => mediaItem.type === 'image').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaFilter('video')}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            mediaFilter === 'video'
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Videos ({mediaLibrary.filter((mediaItem) => mediaItem.type === 'video').length})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredMediaLibrary.map((mediaItem) => (
                      <div key={mediaItem.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                        <MediaPreview mediaItem={mediaItem} />
                        <div className="space-y-4 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{mediaItem.name || getFilenameFromPath(mediaItem.src)}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  {mediaItem.type}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  {mediaItem.origin === 'seeded' ? 'Seeded asset' : 'Uploaded asset'}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  {mediaUsageCounts[mediaItem.src] ? `In use ${mediaUsageCounts[mediaItem.src]}x` : 'Unused'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-500">
                            {getFilenameFromPath(mediaItem.src)}
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900">
                              <Upload size={16} />
                              {replacingMediaId === mediaItem.id ? 'Replacing...' : 'Replace'}
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(event) => {
                                  void handleMediaReplace(mediaItem.id, event.target.files?.[0] ?? null);
                                  event.target.value = '';
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                void copyMediaPath(mediaItem);
                              }}
                              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                            >
                              <Copy size={16} />
                              {copiedMediaId === mediaItem.id ? 'Copied' : 'Copy Path'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteMedia(mediaItem.id)}
                              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!filteredMediaLibrary.length && (
                    <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                      No media items in this filter yet.
                    </div>
                  )}
                </section>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Section</h2>
                  <p className="text-gray-600">Choose a section from the sidebar to get started.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
