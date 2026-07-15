'use client';

import Lenis from 'lenis';
import { BookOpen, Calendar, X, Phone, MapPin, Mail, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SiteContent } from '../types';
import PaymentModal, { calcCardPrice } from '../../app/PaymentModal';

import { isBookExpired, categorizeBooks } from '../lib/siteUtils';

type SiteLandingPageProps = {
  content: SiteContent;
};

export function SiteLandingPage({ content }: SiteLandingPageProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showPastBooks, setShowPastBooks] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (progress) => Math.min(1, 1.001 - Math.pow(2, -10 * progress)),
      smoothWheel: true,
    });

    let frameHandle = 0;

    function raf(time: number) {
      // Only run Lenis if no modals are open
      if (!paymentModalOpen && !isImageModalOpen) {
        lenis.raf(time);
      }
      frameHandle = requestAnimationFrame(raf);
    }

    frameHandle = requestAnimationFrame(raf);

    // Show/hide scroll to top button
    function toggleScrollTop() {
      setShowScrollTop(window.scrollY > 400);
    }

    window.addEventListener('scroll', toggleScrollTop);
    toggleScrollTop(); // Check initial position

    return () => {
      cancelAnimationFrame(frameHandle);
      lenis.destroy();
      window.removeEventListener('scroll', toggleScrollTop);
    };
  }, [paymentModalOpen, isImageModalOpen]);

  // Disable scroll when image modal is open
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { currentMonth, nextMonth, future, past } = categorizeBooks(content.books, new Date(), mounted);
  const nextOpenMonth = currentMonth[0] || nextMonth[0] || future[0];
  const registrationClosed = !nextOpenMonth;

  const openImageModal = (imageSrc: string) => {
    setModalImageSrc(imageSrc);
    setIsImageModalOpen(true);
  };

  const openRegistration = () => {
    if (registrationClosed) return;
    setPaymentModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderBookList = (books: typeof content.books, sectionTitle: string, subtitle: string, isPastMonth: boolean) => {
    if (books.length === 0) return null;

    return (
      <div className="mt-16">
        <div className="mb-8 text-center border-t border-slate-100 pt-12">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-0.5 w-8 bg-slate-300" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              {sectionTitle}
            </span>
            <div className="h-0.5 w-8 bg-slate-300" />
          </div>
          <h2 className="mb-2 text-4xl font-bold" style={{ color: '#0e1f3e' }}>
            {sectionTitle}
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((selection) => (
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
                  onClick={isPastMonth ? undefined : openRegistration}
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
          ))}
        </div>
      </div>
    );
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
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        courseName={content.siteName}
        cashPrice={content.priceLabel}
        cardPrice={calcCardPrice(content.priceLabel)}
        stripeLink={content.registrationLink}
      />
      <header className="py-8 shadow-premium" style={{ backgroundColor: '#ca3433' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src="/exceed-logo.png" alt="Exceed Learning Center" className="h-16 object-contain" />
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

            {renderBookList(currentMonth, "This Month's Book", "Our current read — join the discussion!", false)}
            {renderBookList(nextMonth, "Next Month's Book", "Get a head start on next month's read.", false)}
            {renderBookList(future, "Future Reading", "A look ahead at the titles we'll be exploring together.", false)}

            {/* Previously Read (Toggleable, List view, no images) */}
            {past.length > 0 && (
              <div className="mt-16 text-center">
                <div className="mb-8 flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setShowPastBooks(!showPastBooks)}
                    className="inline-flex items-center gap-3 rounded-full bg-white border border-slate-200 hover:border-[#ca3433] px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ color: '#0e1f3e' }}
                  >
                    <BookOpen className="h-4 w-4 text-[#ca3433]" />
                    <span>{showPastBooks ? 'Hide Past Books Read' : 'View Past Books Read'}</span>
                  </button>
                </div>

                {showPastBooks && (
                  <div className="animate-fadeIn mx-auto max-w-4xl text-left">
                    <div className="mb-8 text-center">
                      <h2 className="text-2xl font-bold" style={{ color: '#0e1f3e' }}>
                        Previously Read Books
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        A list of the titles our adult readers have completed.
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg divide-y divide-slate-100">
                      {past.map((book) => (
                        <div
                          key={book.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex-1">
                            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                              {book.monthLabel}
                            </span>
                            <h4 className="mt-2 text-lg font-bold" style={{ color: '#0e1f3e' }}>
                              {book.title}
                            </h4>
                            {book.author && (
                              <p className="text-sm text-slate-500">
                                by {book.author}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 sm:mt-0 text-left sm:text-right text-xs font-semibold text-slate-400">
                            <div>Schedule: {book.schedule}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  href="mailto:adultsprograms@exceedlearningcenterny.com" 
                  className="text-xl font-bold tracking-tight underline decoration-2 underline-offset-4 transition-colors hover:text-white/80"
                >
                  adultsprograms@exceedlearningcenterny.com
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <img src="/exceed-logo.png" alt="Exceed Learning Center" className="mx-auto mb-4 h-12 object-contain opacity-80" />
            <p className="text-sm text-white">{content.footerText}</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full bg-[#ca3433] p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#af2d2c] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ca3433] focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
