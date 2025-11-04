import { BookOpen, Calendar, X } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7e0e0' }}>
      <header className="py-6" style={{ backgroundColor: '#ca3433' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="text-white" size={40} />
            <h1 className="text-4xl font-bold text-white tracking-wide">ADULTS BOOK CLUB</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ borderTop: '4px solid #0e1f3e' }}>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-2" style={{ color: '#0e1f3e' }}>Adults</h2>
              <div className="w-24 h-1 mx-auto mt-4" style={{ backgroundColor: '#ca3433' }}></div>
            </div>

            <div className="flex justify-center my-8">
              <div className="w-full aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                <img
                  src="/adults-book-club.webp"
                  alt="Adults reading books together"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setModalImageSrc('/adults-book-club.webp');
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
                className="inline-block px-8 py-4 text-xl font-semibold text-white rounded-lg shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: '#ca3433' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Now
              </a>
            </div>

            <div className="space-y-10 mt-12">
              <div className="bg-white border-2 rounded-lg p-6 shadow-md" style={{ borderColor: '#0e1f3e' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-white p-2 rounded" style={{ backgroundColor: '#ca3433' }} size={40} />
                  <h3 className="text-2xl font-bold" style={{ color: '#ca3433' }}>NOVEMBER</h3>
                </div>
                <div className="flex items-start gap-6 ml-14">
                  <div className="flex-shrink-0">
                    <img
                      src="/living-life-as-a-thank-you.jpg"
                      alt="Living Life as a Thank You book cover"
                      className="w-24 h-32 object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setModalImageSrc('/living-life-as-a-thank-you.jpg');
                        setIsImageModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold mb-3" style={{ color: '#0e1f3e' }}>
                      "Living Life as a Thank You"
                    </p>
                    <div className="flex items-center gap-2 text-lg" style={{ color: '#0e1f3e' }}>
                      <span className="font-medium">Meetings:</span>
                      <span>Nov. 11 and Nov 25, 6pm</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 rounded-lg p-6 shadow-md" style={{ borderColor: '#0e1f3e' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-white p-2 rounded" style={{ backgroundColor: '#ca3433' }} size={40} />
                  <h3 className="text-2xl font-bold" style={{ color: '#ca3433' }}>DECEMBER</h3>
                </div>
                <div className="flex items-start gap-6 ml-14">
                  <div className="flex-shrink-0">
                    <img
                      src="/the-magic-of-believing-1.jpg"
                      alt="The Magic of Believing book cover"
                      className="w-24 h-32 object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition-opacity"
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
                      <span>Dec 15 and Dec 29, at 6pm</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 rounded-lg p-6 shadow-md opacity-75" style={{ borderColor: '#0e1f3e' }}>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-white p-2 rounded" style={{ backgroundColor: '#ca3433' }} size={40} />
                  <h3 className="text-2xl font-bold" style={{ color: '#ca3433' }}>ADDITIONAL & OPTIONAL</h3>
                </div>
                <div className="flex items-start gap-6 ml-14">
                  <div className="flex-shrink-0">
                    <img
                      src="/hostage-book-cover.png"
                      alt="Hostage by Eli Sharabi book cover"
                      className="w-24 h-32 object-cover rounded shadow-md cursor-pointer hover:opacity-80 transition-opacity"
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

            <div className="mt-10 text-center p-6 rounded-lg" style={{ backgroundColor: '#f7e0e0' }}>
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
          <div className="relative max-w-2xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={modalImageSrc}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <footer className="py-6 mt-12" style={{ backgroundColor: '#0e1f3e' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm">
            Join us for engaging conversations and meaningful connections
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
