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

  // Real images from 140k Real and Fake Faces dataset
  const realImages = [
    '00168.jpg', '01425.jpg', '02462.jpg', '03553.jpg', '08721.jpg',
    '09569.jpg', '10549.jpg', '11495.jpg', '12390.jpg', '13510.jpg',
    '14212.jpg', '16131.jpg', '16328.jpg', '16344.jpg', '19288.jpg',
    '22229.jpg', '25854.jpg', '26247.jpg', '27254.jpg', '27833.jpg',
    '31964.jpg', '32089.jpg', '32246.jpg', '33969.jpg', '34237.jpg',
    '34880.jpg', '39067.jpg', '40260.jpg', '40623.jpg', '41215.jpg',
    '41938.jpg', '43353.jpg', '46306.jpg', '49433.jpg', '50629.jpg',
    '52198.jpg', '52971.jpg', '53697.jpg', '53754.jpg', '54187.jpg',
    '57012.jpg', '57045.jpg', '61453.jpg', '61945.jpg', '63436.jpg',
    '63793.jpg', '64135.jpg', '67540.jpg', '69252.jpg', '69335.jpg'
  ];

  // AI-generated (fake) images from 140k Real and Fake Faces dataset
  const fakeImages = [
    '0TFRQPXR1X.jpg', '1NFGLXUFYS.jpg', '2TOCMQKPQM.jpg', '4RQPF1PWZW.jpg', '4W11OUXXJQ.jpg',
    '584TLVNMB5.jpg', '59E68NDUTY.jpg', '5GXE1SSNM0.jpg', '62PBAUAJFG.jpg', '6AARXSFB1D.jpg',
    '7ZYC2UHV1R.jpg', '977VOO6HS3.jpg', 'AXCMF459N5.jpg', 'BOP21MV1KF.jpg', 'DZGRZ5WU1D.jpg',
    'FGNSN769OA.jpg', 'FLZVRNSDZ9.jpg', 'HWPHD8TIN5.jpg', 'ISV6FVY6CY.jpg', 'IVUJ2Y82RQ.jpg',
    'JZHYA672BI.jpg', 'KNSACM68SD.jpg', 'KRWUG1T9ZN.jpg', 'LG5LG2XB5H.jpg', 'LRZUHETR9J.jpg',
    'NO5NYDZOKD.jpg', 'OUOMPZ1AZF.jpg', 'OZ3LUW3MBG.jpg', 'P3LVJLBQXW.jpg', 'PE592GEU4P.jpg',
    'PY6ZWSWD0H.jpg', 'QK9VLCVIBE.jpg', 'RFDE8JGZ0P.jpg', 'SDC1M1UT7J.jpg', 'SREXRD97AY.jpg',
    'SYU7G3BAM7.jpg', 'TDJE6TXNN8.jpg', 'TUA3HESX88.jpg', 'UVA5KOI5OG.jpg', 'V21P2X29OG.jpg',
    'WRGISUG7OV.jpg', 'WWLKGXCZEX.jpg', 'X7WSSVM2DL.jpg', 'XNLDCFA367.jpg', 'YF2DOWHO4G.jpg',
    'YLHLUR6QNU.jpg', 'Z4V1SQBEOG.jpg', 'Z8UA13AG4N.jpg', 'Z9X8WZU3KS.jpg', 'ZIPN2T1YFA.jpg'
  ];

  // Combine into sampleImages array with proper paths
  const sampleImages = [
    ...realImages.map(img => ({ url: `/game-images/real/${img}`, isAI: false })),
    ...fakeImages.map(img => ({ url: `/game-images/fake/${img}`, isAI: true }))
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
