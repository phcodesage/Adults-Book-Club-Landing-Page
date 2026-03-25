'use client';

import Lenis from 'lenis';
import { BookOpen, Calendar, X, Phone, MapPin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SiteContent } from '../types';

function hasMonthPassed(year: number, monthIndex: number) {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(year, monthIndex + 1, 1);

  return nextMonthStart <= currentMonthStart;
}

type SiteLandingPageProps = {
  content: SiteContent;
};

export function SiteLandingPage({ content }: SiteLandingPageProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (progress) => Math.min(1, 1.001 - Math.pow(2, -10 * progress)),
      smoothWheel: true,
    });

    let frameHandle = 0;

    function raf(time: number) {
      lenis.raf(time);
      frameHandle = requestAnimationFrame(raf);
    }

    frameHandle = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameHandle);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (isImageModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isImageModalOpen]);

  const nextOpenMonth = content.books.find((selection) => !hasMonthPassed(selection.year, selection.monthIndex));
  const registrationClosed = !nextOpenMonth;

  const openImageModal = (imageSrc: string) => {
    setModalImageSrc(imageSrc);
    setIsImageModalOpen(true);
  };

  const openRegistration = () => {
    window.open(content.registrationLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="min-h-screen bg-overlay"
      style={{
        backgroundImage: `url(${content.heroImageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="py-8 shadow-premium" style={{ backgroundColor: '#ca3433' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={content.logoSrc} alt="Exceed Learning Center" className="h-16 object-contain" />
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="text-white" size={40} />
              <h1 className="text-center text-4xl font-bold tracking-wide text-shadow-soft text-white">
                {content.siteName}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        <div
          className="animate-fadeIn overflow-hidden rounded-lg bg-white shadow-premium backdrop-blur-soft"
          style={{ borderTop: '4px solid #0e1f3e' }}
        >
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-5xl font-bold" style={{ color: '#0e1f3e' }}>
                {content.sectionTitle}
              </h2>
              <div className="mx-auto mt-4 h-1 w-24" style={{ backgroundColor: '#ca3433' }}></div>
            </div>

            <div className="my-8 flex justify-center">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-md">
                <img
                  src={content.heroImageSrc}
                  alt={content.heroImageAlt}
                  className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
                  onClick={() => openImageModal(content.heroImageSrc)}
                />
              </div>
            </div>

            <div className="mb-12 mt-8 text-center">
              <p className="mb-3 text-2xl font-bold" style={{ color: '#0e1f3e' }}>
                {content.priceLabel}
              </p>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em]" style={{ color: '#0e1f3e' }}>
                {registrationClosed
                  ? 'All listed sessions have closed.'
                  : `Registration is open for ${nextOpenMonth.monthLabel}.`}
              </p>
              <button
                type="button"
                onClick={openRegistration}
                disabled={registrationClosed}
                className={`inline-flex rounded-lg px-8 py-4 text-xl font-semibold transition-smooth ${
                  registrationClosed
                    ? 'cursor-not-allowed bg-slate-300 text-slate-600 shadow-none'
                    : 'text-white shadow-premium hover:scale-105 hover:shadow-premium-hover'
                }`}
                style={registrationClosed ? undefined : { backgroundColor: '#ca3433' }}
              >
                {registrationClosed ? content.registrationClosedLabel : content.registrationCtaLabel}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.books.map((selection) => {
                const isPastMonth = hasMonthPassed(selection.year, selection.monthIndex);

                return (
                  <div
                    key={selection.id}
                    className={`overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 ${
                      isPastMonth
                        ? 'bg-slate-100/95 opacity-60 grayscale'
                        : 'bg-white hover:-translate-y-1 hover:shadow-2xl'
                    }`}
                    style={{ borderColor: isPastMonth ? 'rgba(14, 31, 62, 0.28)' : '#0e1f3e' }}
                  >
                    <div className="relative">
                      <img
                        src={selection.imageSrc}
                        alt={selection.imageAlt}
                        className={`h-64 w-full object-cover transition-opacity ${
                          isPastMonth ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:opacity-90'
                        }`}
                        onClick={isPastMonth ? undefined : () => openImageModal(selection.imageSrc)}
                        aria-disabled={isPastMonth}
                      />
                      <div
                        className="absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-bold text-white"
                        style={{ backgroundColor: isPastMonth ? '#64748b' : '#ca3433' }}
                      >
                        {selection.monthLabel}
                      </div>
                      {isPastMonth && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
                          <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-800">
                            Month Passed
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-bold" style={{ color: '#0e1f3e' }}>
                        {selection.title}
                      </h3>
                      <p className="mb-2 text-sm" style={{ color: '#666' }}>
                        by {selection.author}
                      </p>
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                        <Calendar size={16} style={{ color: '#ca3433' }} />
                        <span>{selection.schedule}</span>
                      </div>
                      <button
                        type="button"
                        onClick={openRegistration}
                        disabled={isPastMonth}
                        className={`mt-4 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-smooth ${
                          isPastMonth
                            ? 'cursor-not-allowed bg-slate-300 text-slate-600 shadow-none'
                            : 'text-white shadow-premium hover:scale-[1.02] hover:shadow-premium-hover'
                        }`}
                        style={isPastMonth ? undefined : { backgroundColor: '#ca3433' }}
                      >
                        {isPastMonth ? content.cardClosedLabel : content.cardCtaLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-10 rounded-lg p-6 text-center shadow-md"
              style={{ backgroundColor: 'rgba(247, 224, 224, 0.95)' }}
            >
              <p className="text-lg italic leading-relaxed" style={{ color: '#0e1f3e' }}>
                {content.introQuote}
              </p>
            </div>
          </div>
        </div>
      </main>

      {isImageModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div className="relative flex h-full w-full items-center justify-center">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:text-gray-300"
                aria-label="Close modal"
              >
                <X size={32} />
              </button>
              <img
                src={modalImageSrc}
                alt="Enlarged view"
                className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              />
            </div>
          </div>,
          document.body
        )}

      <footer className="mt-12 py-10 shadow-premium" style={{ backgroundColor: '#0e1f3e' }}>
        <div className="container mx-auto px-4">
          <div className="mb-10 grid grid-cols-1 gap-8 border-b border-white/10 pb-10 md:grid-cols-3">
            <div className="flex items-center justify-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/5 shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: '#ca3433' }}>
                <Phone className="text-white" size={30} />
              </div>
              <div className="text-white">
                <p className="text-sm font-bold uppercase tracking-wider opacity-90">PHONE NUMBER:</p>
                <p className="text-xl font-bold tracking-tight">+1 (516) 226-3114</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/5 shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: '#ca3433' }}>
                <MapPin className="text-white" size={30} />
              </div>
              <div className="text-white">
                <p className="text-sm font-bold uppercase tracking-wider opacity-90">OUR LOCATION:</p>
                <p className="text-xl font-bold tracking-tight">1360 Willis Ave., Albertson NY 11507</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/5 shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: '#ca3433' }}>
                <Mail className="text-white" size={30} />
              </div>
              <div className="text-white">
                <p className="text-sm font-bold uppercase tracking-wider opacity-90">EMAIL ADDRESS:</p>
                <a 
                  href="mailto:info@exceedlearningcenter.com" 
                  className="text-xl font-bold tracking-tight underline decoration-2 underline-offset-4 transition-colors hover:text-white/80"
                >
                  Email us directly [+]
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <img src={content.logoSrc} alt="Exceed Learning Center" className="mx-auto mb-4 h-12 object-contain opacity-80" />
            <p className="text-sm text-white">{content.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
