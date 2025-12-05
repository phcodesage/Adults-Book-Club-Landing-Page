import { BookOpen, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';
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

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-premium overflow-hidden animate-fadeIn backdrop-blur-soft" style={{ borderTop: '4px solid #0e1f3e' }}>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-2" style={{ color: '#0e1f3e' }}>Adults</h2>
              <div className="w-24 h-1 mx-auto mt-4" style={{ backgroundColor: '#ca3433' }}></div>
            </div>

            <div className="flex justify-center my-8">
              <div className="w-full aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                <img
                  src="/adults-book-club.png"
                  alt="Adults reading books together"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setModalImageSrc('/adults-book-club.png');
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

            <div className="space-y-10 mt-12">
              {/* January Book Club */}
              <div className="bg-white border-2 rounded-lg p-6 card-premium" style={{ borderColor: '#0e1f3e' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-white p-2 rounded" style={{ backgroundColor: '#ca3433' }} size={40} />
                  <h3 className="text-2xl font-bold" style={{ color: '#ca3433' }}>JANUARY</h3>
                </div>
                <div className="flex items-start gap-6 ml-14">
                  <div className="flex-shrink-0">
                    <img
                      src="/salt,sugar&fat.jpg"
                      alt="Salt, Sugar, Fat book cover"
                      className="w-24 h-32 object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition-smooth"
                      onClick={() => {
                        setModalImageSrc('/salt,sugar&fat.jpg');
                        setIsImageModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold mb-3" style={{ color: '#0e1f3e' }}>
                      "Salt, Sugar, Fat"
                    </p>
                    <div className="flex items-center gap-2 text-lg" style={{ color: '#0e1f3e' }}>
                      <span className="font-medium">Meetings:</span>
                      <span>Jan 12 and Jan 26, at 6pm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* December Book Club */}
              <div className="bg-white border-2 rounded-lg p-6 card-premium" style={{ borderColor: '#0e1f3e' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-white p-2 rounded" style={{ backgroundColor: '#ca3433' }} size={40} />
                  <h3 className="text-2xl font-bold" style={{ color: '#ca3433' }}>DECEMBER</h3>
                </div>
                <div className="flex items-start gap-6 ml-14">
                  <div className="flex-shrink-0">
                    <img
                      src="/the-magic-of-believing-1.jpg"
                      alt="The Magic of Believing book cover"
                      className="w-24 h-32 object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition-smooth"
                      onClick={() => {
                        setModalImageSrc('/the-magic-of-believing-1.jpg');
                        setIsImageModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold mb-3" style={{ color: '#0e1f3e' }}>
                      "The Magic of Believing"
                    </p>
                    <div className="flex items-center gap-2 text-lg" style={{ color: '#0e1f3e' }}>
                      <span className="font-medium">Meetings:</span>
                      <span>Dec 8 and Dec 29, at 6pm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional & Optional */}
              <div className="bg-white border-2 rounded-lg p-6 card-premium opacity-75" style={{ borderColor: '#0e1f3e' }}>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-white p-2 rounded" style={{ backgroundColor: '#ca3433' }} size={40} />
                  <h3 className="text-2xl font-bold" style={{ color: '#ca3433' }}>ADDITIONAL & OPTIONAL</h3>
                </div>
                <div className="flex items-start gap-6 ml-14">
                  <div className="flex-shrink-0">
                    <img
                      src="/hostage-book-cover.png"
                      alt="Hostage by Eli Sharabi book cover"
                      className="w-24 h-32 object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition-smooth"
                      onClick={() => {
                        setModalImageSrc('/hostage-book-cover.png');
                        setIsImageModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold mb-2" style={{ color: '#0e1f3e' }}>
                      "Hostage"
                    </p>
                    <p className="text-lg mb-3" style={{ color: '#0e1f3e' }}>
                      by Eli Sharabi
                    </p>
                    <div className="flex items-center gap-2 text-lg" style={{ color: '#0e1f3e' }}>
                      <span className="font-medium">Status:</span>
                      <span className="italic">Additional and optional reading</span>
                    </div>
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

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
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
        </div>
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
