import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Main Content */}
      <main className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Section */}
            <div className="space-y-8">
              {/* Main Heading */}
              <h1 className="font-syne text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight">
                ForReal
              </h1>
              
              {/* Description */}
              <p className="text-lg sm:text-xl text-white/50 max-w-md leading-relaxed">
              AI trying to trick you?  Scan images of faces to see who's truely real and who's not. Upload, check, or play-spot the AI before it spots you!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate('/upload')}
                  className="group flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-7 py-4 rounded-xl font-syne font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(147,51,234,0.3)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                
                <button
                  onClick={() => navigate('/guess')}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-7 py-4 rounded-xl font-syne font-semibold transition-all duration-300"
                >
                  <span className="text-xl">🎮</span>
                  Guess: Real or AI?
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-10 pt-6 border-t border-white/5">
                <div>
                  <div className="font-syne text-3xl font-bold">98%</div>
                  <div className="text-xs text-white/40 tracking-wide">Accuracy Rate</div>
                </div>
                <div>
                  <div className="font-syne text-3xl font-bold">&lt;2s</div>
                  <div className="text-xs text-white/40 tracking-wide">Detection Time</div>
                </div>
                <div>
                  <div className="font-syne text-3xl font-bold">1.2L+</div>
                  <div className="text-xs text-white/40 tracking-wide">Training Images</div>
                </div>
              </div>
            </div>

            {/* Right Section - Hero Image */}
            <div className="relative lg:scale-110 lg:translate-x-8">
              {/* Main image container */}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-blue-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                
                {/* Image frame */}
                <div className="relative bg-gradient-to-br from-forreal-gray to-black p-1 rounded-2xl">
                  <div className="relative overflow-hidden rounded-xl">
                    {/* Your hero image */}
                    <img 
                      src="/hero.jpeg"
                      alt="AI meets Human - Digital hand reaching towards human hand"
                      className="w-full h-auto object-cover aspect-[1.05/1] lg:aspect-[5/4.5]"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-pink-400/60 rounded-full animate-pulse"
                          style={{
                            left: `${20 + i * 12}%`,
                            top: `${40 + (i % 3) * 10}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
    </div>
  );
}
