import { BookOpen, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Lenis from 'lenis';

function App() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  // Prevent scrolling when modal is open
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

  return (
    <div className="min-h-screen bg-overlay" style={{
      backgroundImage: 'url(/bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
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

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="bg-white rounded-lg shadow-premium overflow-hidden animate-fadeIn backdrop-blur-soft" style={{ borderTop: '4px solid #0e1f3e' }}>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-2" style={{ color: '#0e1f3e' }}>Adults</h2>
              <div className="w-24 h-1 mx-auto mt-4" style={{ backgroundColor: '#ca3433' }}></div>
            </div>

            <div className="flex justify-center my-8">
              <div className="w-full aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                <img
                  src="/adults-book-club.jpg"
                  alt="Adults reading books together"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setModalImageSrc('/adults-book-club.jpg');
                    setIsImageModalOpen(true);
                  }}
                />
              </div>
            </div>

            <div className="text-center mt-8 mb-12">
              <p className="text-2xl font-bold mb-3" style={{ color: '#0e1f3e' }}>
                $50 Monthly
              </p>
              <a
                href="https://buy.stripe.com/eVq00caOo1ZM1lD50ndfG00"
                className="inline-block px-8 py-4 text-xl font-semibold text-white rounded-lg shadow-premium transition-smooth hover:scale-105 hover:shadow-premium-hover"
                style={{ backgroundColor: '#ca3433' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Now
              </a>
            </div>

            {/* Books Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {/* January 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/the-mind-gut-connection.jpg"
                    alt="The Mind-Gut Connection book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/the-mind-gut-connection.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    JANUARY 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Mind – Gut Connection"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Dr. Emeran Mayer
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Jan 12 & 26, 6pm</span>
                  </div>
                </div>
              </div>

              {/* February 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/the-book-of-joy.jpg"
                    alt="The Book of Joy book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/the-book-of-joy.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    FEBRUARY 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "The Book of Joy"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Dalai Lama & Desmond Tutu
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Feb 9 & 23, 6pm</span>
                  </div>
                </div>
              </div>

              {/* March 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/atlas-of-the-heart.jpg"
                    alt="Atlas of the Heart book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/atlas-of-the-heart.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    MARCH 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Atlas of the Heart"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Brené Brown
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Mar 9 & 30, 6pm</span>
                  </div>
                </div>
              </div>

              {/* April 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/grit.jpg"
                    alt="Grit book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/grit.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    APRIL 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Grit"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Angela Duckworth
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Apr 13 & 27, 6pm</span>
                  </div>
                </div>
              </div>

              {/* May 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/the-sacred-rest.jpg"
                    alt="Sacred Rest book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/the-sacred-rest.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    MAY 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Sacred Rest"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Sandra Dalton-Smith
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>May 11 & 25, 6pm</span>
                  </div>
                </div>
              </div>

              {/* June 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/set-bounderies-find-peace.jpg"
                    alt="Set Boundaries, Find Peace book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/set-bounderies-find-peace.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    JUNE 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Set Boundaries, Find Peace"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Nedra Glover Tawwab
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Jun 8 & 29, 6pm</span>
                  </div>
                </div>
              </div>

              {/* July 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/good-inside.jpg"
                    alt="Good Inside book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/good-inside.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    JULY 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Good Inside"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Dr. Becky Kennedy
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Jul 13 & 27, 6pm</span>
                  </div>
                </div>
              </div>

              {/* August 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/braving-the-wilderness.jpg"
                    alt="Braving the Wilderness book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/braving-the-wilderness.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    AUGUST 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Braving the Wilderness"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Brené Brown
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Aug 10 & 31, 6pm</span>
                  </div>
                </div>
              </div>

              {/* September 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/money-magic.webp"
                    alt="Money Magic book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/money-magic.webp');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    SEPTEMBER 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Money Magic"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Laurence Kotlikoff
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Sep 14 & 28, 6pm</span>
                  </div>
                </div>
              </div>

              {/* October 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/the-lean-startup.jpg"
                    alt="The Lean Startup book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/the-lean-startup.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    OCTOBER 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "The Lean Startup"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Eric Ries
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Oct 12 & 26, 6pm</span>
                  </div>
                </div>
              </div>

              {/* November 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/the-desciplined-pursuit-of-less.jpg"
                    alt="Essentialism book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/the-desciplined-pursuit-of-less.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    NOVEMBER 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Essentialism"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Greg McKeown
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Nov 9 & 30, 6pm</span>
                  </div>
                </div>
              </div>

              {/* December 2026 */}
              <div className="bg-white border-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#0e1f3e' }}>
                <div className="relative">
                  <img
                    src="/your-best-year-ever.jpg"
                    alt="Your Best Year Ever book cover"
                    className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setModalImageSrc('/your-best-year-ever.jpg');
                      setIsImageModalOpen(true);
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-bold" style={{ backgroundColor: '#ca3433' }}>
                    DECEMBER 2026
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0e1f3e' }}>
                    "Your Best Year Ever"
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#666' }}>
                    by Michael Hyatt
                  </p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#0e1f3e' }}>
                    <Calendar size={16} style={{ color: '#ca3433' }} />
                    <span>Dec 14 & 28, 6pm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center p-6 rounded-lg shadow-md" style={{ backgroundColor: 'rgba(247, 224, 224, 0.95)' }}>
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

      {/* Image Modal - using createPortal to render outside Lenis container */}
      {isImageModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 z-10"
              aria-label="Close modal"
            >
              <X size={32} />
            </button>
            <img
              src={modalImageSrc}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>,
        document.body
      )}

      <footer className="py-8 mt-12 shadow-premium" style={{ backgroundColor: '#0e1f3e' }}>
        <div className="container mx-auto px-4 text-center">
          <img
            src="/Exceed-learning-center-1920w.png"
            alt="Exceed Learning Center"
            className="h-12 object-contain mx-auto mb-4 opacity-80"
          />
          <p className="text-white text-sm">
            Join us for engaging conversations and meaningful connections
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
