import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Guess() {
  const navigate = useNavigate();
  
  const [currentGuess, setCurrentGuess] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [imageLoading, setImageLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // Sample images for the guessing game - replace with backend API later
  const sampleImages = [
    { 
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      isAI: false,
    },
    { 
      url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=500',
      isAI: false,
    },
    { 
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
      isAI: true,
    },
    { 
      url: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=500',
      isAI: true,
    }
  ];

  const startGame = () => {
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setCurrentGuess(randomImage);
    setFeedback(null);
    setImageLoading(true);
    setGameStarted(true);
  };

  const handleGuess = (guessedAI) => {
    const isCorrect = guessedAI === currentGuess.isAI;
    setFeedback({
      correct: isCorrect,
      message: isCorrect 
        ? "🎉 Correct!" 
        : `❌ Wrong! This was ${currentGuess.isAI ? 'AI-generated' : 'a real photo'}`
    });
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const nextImage = () => {
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setCurrentGuess(randomImage);
    setFeedback(null);
    setImageLoading(true);
  };

  const closeGame = () => {
    setGameStarted(false);
    setCurrentGuess(null);
    setFeedback(null);
  };

  const resetGame = () => {
    setScore({ correct: 0, total: 0 });
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setCurrentGuess(randomImage);
    setFeedback(null);
    setImageLoading(true);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Main Content - Start Screen */}
      <main className="relative pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto px-6 text-center">
          
          <div className="text-7xl mb-8">🎮</div>
          
          <h1 className="font-syne text-4xl sm:text-5xl font-extrabold mb-4">
            Real or AI?
          </h1>
          
          <p className="text-white/50 text-lg mb-8">
            Test your skills - can you spot the AI-generated images?
          </p>

          <p className="text-white/30 text-sm mb-10 max-w-sm mx-auto">
            You'll be shown images one by one. Guess whether each image is real or AI-generated.
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl font-syne font-semibold text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(147,51,234,0.3)] transition-all duration-300"
            >
              Start Game
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>

          {/* Previous Score */}
          {score.total > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10">
              <p className="text-white/40 text-sm">
                Last session: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}% accuracy)
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Game Modal Popup */}
      {gameStarted && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100]"
          onClick={closeGame}
          style={{ animation: 'fadeIn 0.3s ease' }}
        >
          <div 
            className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl p-6 max-w-lg w-[90%] relative"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease' }}
          >
            <button 
              onClick={closeGame}
              className="absolute top-4 right-5 text-white/50 hover:text-white text-3xl leading-none transition-colors"
            >
              ×
            </button>
            
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-syne text-2xl font-bold">Real or AI?</h2>
              <div className="bg-white/10 px-4 py-2 rounded-full font-mono text-sm">
                {score.correct}/{score.total}
              </div>
            </div>

            {currentGuess && (
              <div className="space-y-5">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-zinc-800">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img 
                    src={currentGuess.url} 
                    alt="Guess if AI or Real" 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                  />
                  {feedback && (
                    <div className={`absolute bottom-0 left-0 right-0 py-4 px-4 font-syne font-semibold text-center ${
                      feedback.correct 
                        ? 'bg-gradient-to-t from-emerald-600/90 to-transparent' 
                        : 'bg-gradient-to-t from-red-600/90 to-transparent'
                    }`}>
                      {feedback.message}
                    </div>
                  )}
                </div>

                {!feedback ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleGuess(false)}
                      className="py-4 px-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-syne font-semibold text-white flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(46,204,113,0.3)] transition-all duration-300"
                    >
                      📷 Real Photo
                    </button>
                    <button 
                      onClick={() => handleGuess(true)}
                      className="py-4 px-5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl font-syne font-semibold text-white flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(155,89,182,0.3)] transition-all duration-300"
                    >
                      🤖 AI Generated
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={nextImage}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl font-syne font-semibold text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(147,51,234,0.3)] transition-all duration-300"
                    >
                      Next Image →
                    </button>
                    <button 
                      onClick={resetGame}
                      className="py-4 px-6 bg-white/10 hover:bg-white/20 rounded-xl font-syne font-semibold text-white transition-all duration-300"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
