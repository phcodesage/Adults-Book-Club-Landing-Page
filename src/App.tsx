import { BookOpen, Calendar, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Lenis from 'lenis';

type BookSelection = {
  monthLabel: string;
  monthIndex: number;
  year: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  author: string;
  schedule: string;
};

const registrationLink = 'https://buy.stripe.com/eVq00caOo1ZM1lD50ndfG00';

const adultBookSelections: BookSelection[] = [
  {
    monthLabel: 'JANUARY 2026',
    monthIndex: 0,
    year: 2026,
    imageSrc: '/the-mind-gut-connection.jpg',
    imageAlt: 'The Mind-Gut Connection book cover',
    title: '"Mind - Gut Connection"',
    author: 'Dr. Emeran Mayer',
    schedule: 'Jan 12 & 26, 6pm',
  },
  {
    monthLabel: 'FEBRUARY 2026',
    monthIndex: 1,
    year: 2026,
    imageSrc: '/the-book-of-joy.jpg',
    imageAlt: 'The Book of Joy book cover',
    title: '"The Book of Joy"',
    author: 'Dalai Lama & Desmond Tutu',
    schedule: 'Feb 9 & 23, 6pm',
  },
  {
    monthLabel: 'MARCH 2026',
    monthIndex: 2,
    year: 2026,
    imageSrc: '/atlas-of-the-heart.jpg',
    imageAlt: 'Atlas of the Heart book cover',
    title: '"Atlas of the Heart"',
    author: 'Brené Brown',
    schedule: 'Mar 9 & 30, 6pm',
  },
  {
    monthLabel: 'APRIL 2026',
    monthIndex: 3,
    year: 2026,
    imageSrc: '/grit.jpg',
    imageAlt: 'Grit book cover',
    title: '"Grit"',
    author: 'Angela Duckworth',
    schedule: 'Apr 13 & 27, 6pm',
  },
  {
    monthLabel: 'MAY 2026',
    monthIndex: 4,
    year: 2026,
    imageSrc: '/the-sacred-rest.jpg',
    imageAlt: 'Sacred Rest book cover',
    title: '"Sacred Rest"',
    author: 'Sandra Dalton-Smith',
    schedule: 'May 11 & 25, 6pm',
  },
  {
    monthLabel: 'JUNE 2026',
    monthIndex: 5,
    year: 2026,
    imageSrc: '/set-bounderies-find-peace.jpg',
    imageAlt: 'Set Boundaries, Find Peace book cover',
    title: '"Set Boundaries, Find Peace"',
    author: 'Nedra Glover Tawwab',
    schedule: 'Jun 8 & 29, 6pm',
  },
  {
    monthLabel: 'JULY 2026',
    monthIndex: 6,
    year: 2026,
    imageSrc: '/good-inside.jpg',
    imageAlt: 'Good Inside book cover',
    title: '"Good Inside"',
    author: 'Dr. Becky Kennedy',
    schedule: 'Jul 13 & 27, 6pm',
  },
  {
    monthLabel: 'AUGUST 2026',
    monthIndex: 7,
    year: 2026,
    imageSrc: '/braving-the-wilderness.jpg',
    imageAlt: 'Braving the Wilderness book cover',
    title: '"Braving the Wilderness"',
    author: 'Brené Brown',
    schedule: 'Aug 10 & 31, 6pm',
  },
  {
    monthLabel: 'SEPTEMBER 2026',
    monthIndex: 8,
    year: 2026,
    imageSrc: '/money-magic.webp',
    imageAlt: 'Money Magic book cover',
    title: '"Money Magic"',
    author: 'Laurence Kotlikoff',
    schedule: 'Sep 14 & 28, 6pm',
  },
  {
    monthLabel: 'OCTOBER 2026',
    monthIndex: 9,
    year: 2026,
    imageSrc: '/the-lean-startup.jpg',
    imageAlt: 'The Lean Startup book cover',
    title: '"The Lean Startup"',
    author: 'Eric Ries',
    schedule: 'Oct 12 & 26, 6pm',
  },
  {
    monthLabel: 'NOVEMBER 2026',
    monthIndex: 10,
    year: 2026,
    imageSrc: '/the-desciplined-pursuit-of-less.jpg',
    imageAlt: 'Essentialism book cover',
    title: '"Essentialism"',
    author: 'Greg McKeown',
    schedule: 'Nov 9 & 30, 6pm',
  },
  {
    monthLabel: 'DECEMBER 2026',
    monthIndex: 11,
    year: 2026,
    imageSrc: '/your-best-year-ever.jpg',
    imageAlt: 'Your Best Year Ever book cover',
    title: '"Your Best Year Ever"',
    author: 'Michael Hyatt',
    schedule: 'Dec 14 & 28, 6pm',
  },
];

function hasMonthPassed(year: number, monthIndex: number) {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(year, monthIndex + 1, 1);

  return nextMonthStart <= currentMonthStart;
}

function App() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (isImageModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isImageModalOpen]);

  const nextOpenMonth = adultBookSelections.find(
    (selection) => !hasMonthPassed(selection.year, selection.monthIndex)
  );
  const registrationClosed = !nextOpenMonth;

  const openImageModal = (imageSrc: string) => {
    setModalImageSrc(imageSrc);
    setIsImageModalOpen(true);
  };

  const openRegistration = () => {
    window.open(registrationLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="min-h-screen bg-overlay"
      style={{
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="py-8 shadow-premium" style={{ backgroundColor: '#ca3433' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src="/Exceed-learning-center-1920w.png"
              alt="Exceed Learning Center"
              className="h-16 object-contain"
            />
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="text-white" size={40} />
              <h1 className="text-4xl font-bold text-white tracking-wide text-shadow-soft">ADULTS BOOK CLUB</h1>
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
              <h2 className="mb-2 text-5xl font-bold" style={{ color: '#0e1f3e' }}>Adults</h2>
              <div className="mx-auto mt-4 h-1 w-24" style={{ backgroundColor: '#ca3433' }}></div>
            </div>

            <div className="my-8 flex justify-center">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-md">
                <img
                  src="/adults-book-club.jpg"
                  alt="Adults reading books together"
                  className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
                  onClick={() => openImageModal('/adults-book-club.jpg')}
                />
              </div>
            </div>

            <div className="mb-12 mt-8 text-center">
              <p className="mb-3 text-2xl font-bold" style={{ color: '#0e1f3e' }}>
                $50 Monthly
              </p>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em]" style={{ color: '#0e1f3e' }}>
                {registrationClosed
                  ? 'All listed 2026 sessions have closed.'
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
                {registrationClosed ? 'Registration Closed' : 'Join Now'}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {adultBookSelections.map((selection) => {
                const isPastMonth = hasMonthPassed(selection.year, selection.monthIndex);

                return (
                  <div
                    key={selection.monthLabel}
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
                        {isPastMonth ? 'Registration Closed' : 'Reserve Your Spot'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 rounded-lg p-6 text-center shadow-md" style={{ backgroundColor: 'rgba(247, 224, 224, 0.95)' }}>
              <p className="text-lg italic" style={{ color: '#0e1f3e' }}>
                Connect with fellow readers,
                gain fresh perspectives, and
                share how the book's themes
                truly relate to your life.
                It's where great reading helps
                you Ignite Your Brilliance!
              </p>
            </div>
          </div>
        </div>
      </main>

      {isImageModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
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

      <footer className="mt-12 py-8 shadow-premium" style={{ backgroundColor: '#0e1f3e' }}>
        <div className="container mx-auto px-4 text-center">
          <img
            src="/Exceed-learning-center-1920w.png"
            alt="Exceed Learning Center"
            className="mx-auto mb-4 h-12 object-contain opacity-80"
          />
          <p className="text-sm text-white">
            Join us for engaging conversations and meaningful connections
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
