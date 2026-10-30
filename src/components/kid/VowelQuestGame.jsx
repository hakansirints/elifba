import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Trophy, Star, Sparkles, Check, X, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOWELS_DATA } from '../../data/lettersData';
import { playAudioFile, sfx, stopCurrentAudio } from '../../utils/audioPlayer';

export default function VowelQuestGame({ lang = 'tr', onAddStar }) {
  const audioTimer = useRef(null);
  const [selectedVowelTab, setSelectedVowelTab] = useState('all'); // 'all', 'fetha', 'kesra', 'damme'
  const [currentQuest, setCurrentQuest] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredId, setAnsweredId] = useState(null);

  // Pool of all vowel examples
  const allExamples = VOWELS_DATA.flatMap(v => v.examples.map(ex => ({ ...ex, vowelId: v.id, vowelName: lang === 'de' ? v.nameDe : v.nameTr })));

  const startNextQuest = () => {
    clearTimeout(audioTimer.current);
    stopCurrentAudio();
    let pool = allExamples;
    if (selectedVowelTab !== 'all') {
      pool = allExamples.filter(ex => ex.vowelId === selectedVowelTab);
    }
    const correct = pool[Math.floor(Math.random() * pool.length)];
    // Pick 2 wrong options from pool
    const wrong = pool.filter(ex => ex.char !== correct.char)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    
    const options = [correct, ...wrong].sort(() => 0.5 - Math.random());
    setCurrentQuest({ correct, options });
    setAnsweredId(null);

    // Audio starts from the learner's explicit listen action.
  };

  useEffect(() => {
    startNextQuest();
    return () => { clearTimeout(audioTimer.current); stopCurrentAudio(); };
  }, [selectedVowelTab, lang]);

  const handleSelect = (opt) => {
    if (answeredId) return;
    setAnsweredId(opt.char);

    if (opt.char === currentQuest.correct.char) {
      sfx.playSuccess();
      setScore(s => s + 10);
      if (onAddStar) onAddStar(1);
      confetti({ disableForReducedMotion: true, particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else {
      sfx.playTryAgain();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-kid font-bold uppercase tracking-wider mb-2">
            {lang === 'de' ? 'Vokal-Abenteuer' : 'Hareke Macerası'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-kid">
            {lang === 'de' ? 'Finde den richtigen Vokal! 🌟' : 'Doğru Harekeli Harfi Seç! 🌟'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 max-w-md font-medium mt-1">
            {lang === 'de'
              ? 'Höre den Laut (z.B. "E", "I", "U") und wähle die passende Karte!'
              : 'Sesi dinle ve doğru harekeli harfi seç. İstediğin kadar tekrar edebilirsin.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-yellow-200 font-kid font-bold text-lg border border-white/30">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span>{score} {lang === 'de' ? 'Punkte' : 'Puan'}</span>
          </div>
        </div>
      </div>

      {/* Vowel Filter Pills */}
      <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'all', labelTr: 'Hepsi (Karışık)', labelDe: 'Alle Vokale' },
          { id: 'fetha', labelTr: 'Üstün (Fetha َ)', labelDe: 'Fetha َ' },
          { id: 'kesra', labelTr: 'Esre (Kesra ِ)', labelDe: 'Kesra ِ' },
          { id: 'damme', labelTr: 'Ötre (Damme ُ)', labelDe: 'Damme ُ' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedVowelTab(tab.id)}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-kid font-bold text-xs sm:text-sm transition ${
              selectedVowelTab === tab.id
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'de' ? tab.labelDe : tab.labelTr}
          </button>
        ))}
      </div>

      {/* Quest Stage */}
      {currentQuest && (
        <div className="bg-white rounded-3xl border-2 border-slate-200/80 p-6 sm:p-10 shadow-md flex flex-col items-center space-y-8 text-center">
          
          {/* Sound Prompt */}
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={() => playAudioFile(currentQuest.correct.sound)}
              aria-label={lang === 'de' ? 'Aufnahme anhören' : 'Kaydı dinle'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center group"
            >
              <Volume2 className="w-12 h-12 group-hover:scale-110 transition" />
            </button>
            <span className="font-kid font-bold text-sm text-slate-500">
              {lang === 'de' ? 'Klicken, um den Laut nochmals zu hören' : 'Sesi tekrar dinlemek için tıkla'}
            </span>
          </div>

          {/* 3 Large Option Cards */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-lg">
            {currentQuest.options.map((opt, i) => {
              const isSelected = answeredId === opt.char;
              const isCorrect = opt.char === currentQuest.correct.char;

              let style = "bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 hover:scale-105 text-slate-800";
              if (answeredId) {
                if (isCorrect) {
                  style = "bg-emerald-500 border-2 border-emerald-600 text-white shadow-lg animate-pulse";
                } else if (isSelected) {
                  style = "bg-rose-500 border-2 border-rose-600 text-white shadow-lg";
                } else {
                  style = "bg-slate-50 border-slate-200 opacity-40 text-slate-400";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  disabled={!!answeredId}
                  className={`h-32 sm:h-40 rounded-3xl flex flex-col items-center justify-center transition-all ${style}`}
                >
                  <span className="text-5xl sm:text-6xl font-quran drop-shadow-sm mb-2">
                    {opt.char}
                  </span>
                  {answeredId && (
                    <span className="text-xs font-kid font-bold">
                      {lang === 'de' ? opt.textDe : opt.textTr}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {answeredId && (
            <div className="w-full max-w-xs animate-pop">
              <button
                onClick={startNextQuest}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-kid font-bold text-base shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>{lang === 'de' ? 'Nächste Runde' : 'Sonraki Tur'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
