import { BookOpen, Calendar } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7e0e0' }}>
      <header className="py-6" style={{ backgroundColor: '#ca3433' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="text-white" size={40} />
            <h1 className="text-4xl font-bold text-white tracking-wide">BOOK CLUB</h1>
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
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center mt-8 mb-12">
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
                <div className="ml-14">
                  <p className="text-xl font-semibold mb-3" style={{ color: '#0e1f3e' }}>
                    "Living Life as a Thank You"
                  </p>
                  <div className="flex items-center gap-2 text-lg" style={{ color: '#0e1f3e' }}>
                    <span className="font-medium">Meetings:</span>
                    <span>Nov. 11 and Nov 25, 6pm</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 rounded-lg p-6 shadow-md" style={{ borderColor: '#0e1f3e' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="text-white p-2 rounded" style={{ backgroundColor: '#ca3433' }} size={40} />
                  <h3 className="text-2xl font-bold" style={{ color: '#ca3433' }}>DECEMBER</h3>
                </div>
                <div className="ml-14">
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

            <div className="mt-10 text-center p-6 rounded-lg" style={{ backgroundColor: '#f7e0e0' }}>
              <p className="text-lg italic" style={{ color: '#0e1f3e' }}>
                Share your takeaways, learn from others' insights, and ignite your brilliance through shared literary journeys.
              </p>
            </div>
          </div>
        </div>
      </main>

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
