import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Trophy, Star, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARABIC_LETTERS } from '../../data/lettersData';
import { playAudioFile, sfx, stopCurrentAudio } from '../../utils/audioPlayer';

const BALLOON_COLORS = [
  'from-rose-400 to-red-500 shadow-rose-300',
  'from-amber-400 to-orange-500 shadow-amber-300',
  'from-emerald-400 to-teal-500 shadow-emerald-300',
  'from-sky-400 to-blue-500 shadow-sky-300',
  'from-purple-400 to-indigo-500 shadow-purple-300',
  'from-pink-400 to-rose-500 shadow-pink-300'
];

export default function BalloonPopGame({ lang = 'tr', onAddStar }) {
  const timers = useRef([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (fn, ms) => { timers.current.push(setTimeout(fn,ms)); };
  const [targetLetter, setTargetLetter] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [poppedId, setPoppedId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [round, setRound] = useState(1);

  // Start new round
  const startNewRound = () => {
    clearTimers();
    stopCurrentAudio();
    // Pick 1 target
    const target = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
    // Pick 3 or 4 wrong options
    const others = ARABIC_LETTERS.filter(l => l.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const roundBalloons = [target, ...others]
      .sort(() => 0.5 - Math.random())
      .map((letter, idx) => ({
        ...letter,
        instanceId: `${letter.id}-${Date.now()}-${idx}`,
        color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
        floatDelay: (idx * 0.2).toFixed(1)
      }));

    setTargetLetter(target);
    setBalloons(roundBalloons);
    setPoppedId(null);
    setWrongId(null);

    // The learner starts audio with the visible replay button. Browsers may
    // reject playback started by a timer after navigation.
  };

  useEffect(() => {
    startNewRound();
    return () => { clearTimers(); stopCurrentAudio(); };
  }, []);

  const handleBalloonClick = (balloon) => {
    if (poppedId) return; // Prevent double clicks during round transition

    if (balloon.id === targetLetter.id) {
      // Correct!
      setPoppedId(balloon.instanceId);
      sfx.playPop();
      sfx.playSuccess();
      setScore(prev => prev + 10 + streak * 2);
      setStreak(prev => prev + 1);
      if (onAddStar) onAddStar(1);

      confetti({ disableForReducedMotion: true,
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Next round after brief celebration
      later(() => {
        setRound(r => r + 1);
        startNewRound();
      }, 900);
    } else {
      // Wrong balloon
      setWrongId(balloon.instanceId);
      setStreak(0);
      sfx.playTryAgain();
      later(() => {
        setWrongId(null);
      }, 600);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Game Header Bar */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/80 p-4 sm:p-6 shadow-md flex items-center justify-between flex-wrap gap-4">
        
        {/* Score & Streak */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-kid font-bold text-slate-800 text-lg sm:text-xl">
              {score} {lang === 'de' ? 'Punkte' : 'Puan'}
            </span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-2xl text-rose-600 font-kid font-bold text-sm animate-bounce-soft">
              <span>🔥 {streak}x Kombo!</span>
            </div>
          )}
        </div>

        {/* Round Counter & Restart */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-kid font-bold text-slate-500">
            {lang === 'de' ? `Runde ${round}` : `Tur ${round}`}
          </span>
          <button
            onClick={() => { setScore(0); setStreak(0); setRound(1); startNewRound(); }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Prompt Box */}
      {targetLetter && (
        <div className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 rounded-3xl p-6 text-white shadow-lg text-center space-y-3 relative overflow-hidden">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-kid font-bold uppercase tracking-wider">
              {lang === 'de' ? 'Höre & Finde den Ballon!' : 'Sesi Dinle ve Doğru Balonu Patlat!'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-kid">
              {lang === 'de'
                ? `Welcher Ballon ist "${targetLetter.nameDe}"?`
                : `Hangi balon "${targetLetter.nameTr}" harfi?`}
            </h3>
          </div>

          {/* Sound Replay Button */}
          <button
            onClick={() => playAudioFile(targetLetter.audio)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-indigo-600 font-kid font-bold text-sm shadow-md hover:bg-yellow-300 hover:text-indigo-900 active:scale-95 transition-all group"
          >
            <Volume2 className="w-5 h-5 group-hover:scale-110 transition" />
            <span>{lang === 'de' ? 'Ton nochmals anhören 🔊' : 'Sesi Tekrar Çal 🔊'}</span>
          </button>
        </div>
      )}

      {/* Balloons Stage */}
      <div className="relative min-h-[340px] sm:min-h-[420px] bg-gradient-to-b from-sky-100 via-blue-50 to-emerald-50 rounded-3xl border-2 border-sky-200/80 p-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8 overflow-hidden">
        
        {/* Floating clouds background decoration */}
        <div className="absolute top-4 left-6 text-4xl opacity-40 select-none pointer-events-none">☁️</div>
        <div className="absolute top-12 right-10 text-5xl opacity-40 select-none pointer-events-none">☁️</div>
        <div className="absolute bottom-8 left-16 text-3xl opacity-30 select-none pointer-events-none">☁️</div>

        {/* Balloons */}
        {balloons.map((balloon) => {
          const isPopped = poppedId === balloon.instanceId;
          const isWrong = wrongId === balloon.instanceId;

          return (
            <button
              key={balloon.instanceId}
              onClick={() => handleBalloonClick(balloon)}
              style={{ animationDelay: `${balloon.floatDelay}s` }}
              className={`relative flex flex-col items-center justify-center w-28 h-36 sm:w-32 sm:h-44 transition-all duration-300 cursor-pointer ${
                isPopped ? 'scale-150 opacity-0 pointer-events-none' : ''
              } ${
                isWrong ? 'animate-wiggle ring-4 ring-rose-400' : 'animate-bounce-soft hover:scale-105 active:scale-95'
              }`}
            >
              {/* Balloon Bubble Body */}
              <div className={`w-28 h-32 sm:w-32 sm:h-36 rounded-[50%] bg-gradient-to-br ${balloon.color} shadow-lg flex items-center justify-center text-white relative`}>
                
                {/* Highlight reflection shine */}
                <div className="absolute top-3 left-4 w-5 h-8 rounded-full bg-white/40 rotate-[-25deg]" />
                
                {/* Arabic Letter */}
                <span className="text-5xl sm:text-6xl font-quran drop-shadow-md select-none">
                  {balloon.char}
                </span>
              </div>

              {/* Balloon Knot and String */}
              <div className="w-2.5 h-2 bg-slate-400 rounded-b" />
              <div className="w-0.5 h-6 bg-slate-300/80" />
            </button>
          );
        })}

      </div>

    </div>
  );
}
