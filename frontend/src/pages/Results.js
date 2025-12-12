import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { result, imagePreview, filename } = location.state || {};
  
  // Redirect if no result data
  useEffect(() => {
    if (!result) {
      navigate('/upload');
    }
  }, [result, navigate]);
  
  if (!result) return null;
  
  const isReal = result.label === 'REAL';
  const confidence = result.confidence;
  // probabilities[0] = AI (FAKE), probabilities[1] = REAL
  const probAI = (result.probabilities[0] * 100).toFixed(1);
  const probReal = (result.probabilities[1] * 100).toFixed(1);
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* Background effects - color changes based on result */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`
          absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[200px]
          ${isReal ? 'bg-emerald-600/10' : 'bg-rose-600/10'}
        `}></div>
        <div className={`
          absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px]
          ${isReal ? 'bg-teal-600/5' : 'bg-orange-600/5'}
        `}></div>
      </div>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Result Badge */}
          <div className="text-center mb-8">
            <div className={`
              inline-flex items-center gap-3 px-6 py-3 rounded-full
              font-syne font-bold text-lg
              ${isReal 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }
            `}>
              <span className="text-2xl">{isReal ? '✓' : '⚠'}</span>
              {isReal ? 'AUTHENTIC IMAGE' : 'AI-GENERATED'}
            </div>
          </div>

          {/* Main Result Card */}
          <div className="glass rounded-3xl p-8 sm:p-10 mb-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              
              {/* Image Preview */}
              <div className="relative">
                <div className={`
                  absolute -inset-2 rounded-2xl blur-xl opacity-40
                  ${isReal 
                    ? 'bg-gradient-to-br from-emerald-600/30 to-teal-500/30' 
                    : 'bg-gradient-to-br from-rose-600/30 to-orange-500/30'
                  }
                `}></div>
                
                <div className={`
                  relative p-1 rounded-2xl
                  ${isReal 
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10' 
                    : 'bg-gradient-to-br from-rose-500/20 to-orange-500/10'
                  }
                `}>
                  <img
                    src={imagePreview}
                    alt="Analyzed"
                    className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                  />
                  
                  {/* Result overlay badge */}
                  <div className={`
                    absolute top-4 right-4 px-4 py-2 rounded-lg font-syne font-bold text-sm
                    backdrop-blur-md
                    ${isReal 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-rose-500/90 text-white'
                    }
                  `}>
                    {result.label}
                  </div>
                </div>
                
                {/* Filename */}
                <p className="text-center text-white/40 text-sm mt-4 truncate">
                  {filename}
                </p>
              </div>

              {/* Result Details */}
              <div className="space-y-8">
                {/* Confidence Score */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-white/60 text-sm font-medium">Confidence</span>
                    <span className={`
                      font-syne font-bold text-4xl
                      ${isReal ? 'text-emerald-400' : 'text-rose-400'}
                    `}>
                      {confidence}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`
                        h-full rounded-full transition-all duration-1000 ease-out
                        ${isReal 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                          : 'bg-gradient-to-r from-rose-500 to-orange-400'
                        }
                      `}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>

                {/* Probability Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-syne font-semibold text-white/80">Probability Breakdown</h3>
                  
                  {/* Real probability */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-medium">Real Image</span>
                      <span className="text-white/60">{probReal}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500/70 rounded-full transition-all duration-1000"
                        style={{ width: `${probReal}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* AI probability */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-rose-400 font-medium">AI-Generated</span>
                      <span className="text-white/60">{probAI}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500/70 rounded-full transition-all duration-1000"
                        style={{ width: `${probAI}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Verdict */}
                <div className={`
                  p-5 rounded-xl border
                  ${isReal 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : 'bg-rose-500/5 border-rose-500/20'
                  }
                `}>
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isReal ? 'bg-emerald-500/20' : 'bg-rose-500/20'}
                    `}>
                      <span className="text-xl">{isReal ? '🔒' : '🤖'}</span>
                    </div>
                    <div>
                      <h4 className={`font-syne font-semibold mb-1 ${isReal ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isReal ? 'Likely Authentic' : 'Likely AI-Generated'}
                      </h4>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {isReal 
                          ? 'This image appears to be an authentic photograph or naturally created image.'
                          : 'This image shows characteristics consistent with AI-generated content.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/upload')}
              className="group px-8 py-4 rounded-xl font-syne font-semibold
                bg-purple-600 hover:bg-purple-700
                transition-all duration-300 hover:-translate-y-1 
                hover:shadow-[0_20px_40px_rgba(147,51,234,0.3)]
                flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Analyze Another
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-xl font-syne font-semibold
                bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                transition-all duration-300
                flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back Home
            </button>
          </div>

        </div>
      </main>

      {/* Footer accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
    </div>
  );
}
