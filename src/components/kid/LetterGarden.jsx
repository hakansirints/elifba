import React, { useState } from 'react';
import { Volume2, Star, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARABIC_LETTERS } from '../../data/lettersData';
import { playAudioFile, sfx } from '../../utils/audioPlayer';

export default function LetterGarden({ lang = 'tr', onAddStar }) {
  const [visitedLetters, setVisitedLetters] = useState(new Set());
  const [activeLetterId, setActiveLetterId] = useState(null);

  const handleLetterClick = (letter) => {
    setActiveLetterId(letter.id);
    sfx.playPop();
    playAudioFile(letter.audio, {
      onEnd: () => setActiveLetterId(null)
    });

    if (!visitedLetters.has(letter.id)) {
      const next = new Set(visitedLetters);
      next.add(letter.id);
      setVisitedLetters(next);
      if (onAddStar) onAddStar(1);

      // Check if all 29 completed
      if (next.size === ARABIC_LETTERS.length) {
        sfx.playSuccess();
        confetti({ disableForReducedMotion: true, particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Cheerful Header */}
      <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-yellow-100 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? '28 Buchstaben und die Verbindung Lam-Alif' : '28 harf ve lâmelif birleşimi'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-kid drop-shadow-sm">
            {lang === 'de' ? 'Der Zaubergarten der Buchstaben 🌸' : 'Harf Dünyası ve Bahçesi 🌸'}
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl font-medium">
            {lang === 'de'
              ? 'Tippe auf einen Buchstaben, um die Originalaufnahme zu hören. Lernsterne gibt es im Lernweg.'
              : 'Kaynak kaydı dinlemek için bir harfe dokun. Öğrenme yıldızlarını macerandaki görevlerde kazanabilirsin.'}
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-center shrink-0 z-10">
          <div className="flex items-center gap-1.5 text-yellow-200 font-extrabold text-2xl">
            <Star className="w-7 h-7 fill-yellow-300 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{visitedLetters.size} / {ARABIC_LETTERS.length}</span>
          </div>
          <span className="text-xs text-white/80 font-bold mt-1">
            {lang === 'de' ? 'Entdeckt' : 'Öğrenildi'}
          </span>
        </div>
      </div>

      {/* 29 Letters Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {ARABIC_LETTERS.map((letter) => {
          const isVisited = visitedLetters.has(letter.id);
          const isActive = activeLetterId === letter.id;

          return (
            <button
              key={letter.id}
              onClick={() => handleLetterClick(letter)}
              className={`group relative h-36 sm:h-40 rounded-3xl p-3 flex flex-col items-center justify-between transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-xl ${
                isActive 
                  ? 'bg-gradient-to-b from-yellow-300 to-amber-400 scale-105 ring-4 ring-yellow-400 rotate-1' 
                  : `bg-gradient-to-b ${letter.color} hover:-translate-y-1`
              } text-white`}
            >
              {/* Star Badge */}
              <div className="w-full flex items-center justify-between text-xs">
                <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-bold">
                  {letter.id}
                </span>
                {isVisited && (
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300 animate-pulse" />
                )}
              </div>

              {/* Arabic Letter Calligraphy */}
              <span className={`text-5xl sm:text-6xl font-quran drop-shadow-md transition-transform group-hover:scale-110 ${
                isActive ? 'scale-125 animate-wiggle' : ''
              }`}>
                {letter.char}
              </span>

              {/* Letter Name */}
              <div className="w-full text-center">
                <span className="font-kid font-bold text-sm sm:text-base tracking-wide drop-shadow-sm block">
                  {lang === 'de' ? letter.nameDe : letter.nameTr}
                </span>
              </div>

              {/* Sound ripple animation when clicked */}
              {isActive && (
                <span className="absolute inset-0 rounded-3xl border-4 border-yellow-300 animate-ping pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
