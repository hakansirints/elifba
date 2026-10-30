import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Sparkles, Star, Award, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARABIC_LETTERS } from '../../data/lettersData';
import { playAudioFile, sfx } from '../../utils/audioPlayer';

export default function MemoryMatchGame({ lang = 'tr', onAddStar }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices
  const [matched, setMatched] = useState([]); // ids
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize game
  const initGame = () => {
    // Pick 6 random letters
    const selected = ARABIC_LETTERS.slice(0).sort(() => 0.5 - Math.random()).slice(0, 6);
    // Duplicate for pairs
    const deck = [...selected, ...selected]
      .sort(() => 0.5 - Math.random())
      .map((item, idx) => ({
        ...item,
        uniqueKey: `${item.id}-${idx}`,
      }));

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].id)) {
      return;
    }

    const card = cards[index];
    sfx.playPop();
    playAudioFile(card.audio);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.id === secondCard.id) {
        // Matched!
        setTimeout(() => {
          sfx.playSuccess();
          const nextMatched = [...matched, firstCard.id];
          setMatched(nextMatched);
          setFlipped([]);

          if (nextMatched.length === 6) {
            setIsWon(true);
            if (onAddStar) onAddStar(3);
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 }
            });
          }
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setFlipped([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Game Header */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/80 p-4 sm:p-6 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-kid text-slate-800">
            {lang === 'de' ? 'Koran-Memory Spiel 🃏' : 'Harf Hafıza Kartları 🃏'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {lang === 'de'
              ? 'Finde die gleichen Buchstabenpaare und höre ihre Stimme!'
              : 'Aynı harf çiftlerini bul, seslerini dinle ve hafızanı güçlendir!'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-2xl text-purple-700 font-kid font-bold text-sm">
            <Trophy className="w-4 h-4 text-purple-600" />
            <span>{moves} {lang === 'de' ? 'Züge' : 'Hamle'}</span>
          </div>

          <button
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-kid font-bold transition"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'de' ? 'Neu' : 'Yenile'}</span>
          </button>
        </div>
      </div>

      {/* Victory Celebration Banner */}
      {isWon && (
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-pop">
          <div className="text-4xl">🎉 🌟 🏆</div>
          <h3 className="text-2xl font-extrabold font-kid">
            {lang === 'de' ? 'Toll gemacht! Du hast alle Paare gefunden!' : 'Tebrikler! Tüm Harf Çiftlerini Buldun!'}
          </h3>
          <p className="text-sm font-medium text-emerald-50">
            {lang === 'de'
              ? `In nur ${moves} Zügen geschafft. +3 Sterne erhalten!`
              : `Sadece ${moves} hamlede başardın. +3 Parlayan Yıldız kazandın!`}
          </p>
          <button
            onClick={initGame}
            className="px-6 py-2.5 rounded-full bg-white text-emerald-700 font-kid font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition"
          >
            {lang === 'de' ? 'Noch einmal spielen' : 'Tekrar Oyna'}
          </button>
        </div>
      )}

      {/* Cards Grid: 12 cards (4x3 or 3x4) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => {
          const isCardFlipped = flipped.includes(index) || matched.includes(card.id);
          const isCardMatched = matched.includes(card.id);

          return (
            <button
              key={card.uniqueKey}
              onClick={() => handleCardClick(index)}
              className={`h-28 sm:h-36 rounded-3xl border-2 transition-all duration-300 transform active:scale-95 flex items-center justify-center p-3 select-none ${
                isCardMatched
                  ? 'bg-gradient-to-br from-amber-300 to-yellow-400 border-yellow-400 shadow-md ring-4 ring-yellow-300/50'
                  : isCardFlipped
                  ? 'bg-white border-emerald-400 shadow-lg scale-105'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 hover:scale-102 hover:shadow-md cursor-pointer'
              }`}
            >
              {isCardFlipped ? (
                <div className="flex flex-col items-center justify-center animate-pop text-slate-800">
                  <span className="text-4xl sm:text-5xl font-quran leading-none drop-shadow-sm">
                    {card.char}
                  </span>
                  <span className="text-xs font-kid font-bold text-slate-600 mt-1">
                    {lang === 'de' ? card.nameDe : card.nameTr}
                  </span>
                  {isCardMatched && (
                    <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700 mt-0.5" />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/80">
                  <span className="text-2xl sm:text-3xl">🌙</span>
                  <span className="text-[10px] font-kid font-bold mt-1 text-white/60">
                    DİTİB
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
