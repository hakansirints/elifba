import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy, Star, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import RafiMascot from '../common/RafiMascot';
import { sfx } from '../../utils/audioPlayer';
import { QUIZ_15_QUESTIONS } from '../../data/page15Quiz';

export { QUIZ_15_QUESTIONS };

export default function Page15QuizWorkshop({ lang = 'tr', speed = 1, onBack, onFinish, backLabel }) {
  const de = lang === 'de';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [mascotMood, setMascotMood] = useState('idle'); // 'idle' | 'success' | 'fail'

  const currentQ = QUIZ_15_QUESTIONS[currentIndex];

  const handleSelect = (option) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(option);

    if (option.correct) {
      sfx.playStar();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      const points = 100 + (newStreak > 1 ? (newStreak - 1) * 20 : 0);
      setScore(s => s + points);
      setCorrectCount(c => c + 1);
      setMascotMood('success');
    } else {
      sfx.playPop();
      setStreak(0);
      setMascotMood('fail');
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_15_QUESTIONS.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setMascotMood('idle');
    } else {
      setIsDone(true);
      onFinish?.({ correct: correctCount + (selectedOption?.correct ? 0 : 0), total: 10 });
    }
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setIsDone(false);
    setIsAnswered(false);
    setMascotMood('idle');
  };

  if (isDone) {
    const stars = correctCount >= 9 ? 3 : correctCount >= 6 ? 2 : 1;
    return (
      <div className="kahoot-finish-screen">
        <div className="kahoot-finish-card">
          <div className="kahoot-finish-mascot">
            <RafiMascot state="success" />
          </div>

          <div className="kahoot-stars-row">
            {[1, 2, 3].map(starNum => (
              <span
                key={starNum}
                className={`kahoot-star ${starNum <= stars ? 'is-earned' : 'is-empty'}`}
              >
                ★
              </span>
            ))}
          </div>

          <h3 className="kahoot-finish-title">
            {stars === 3
              ? (de ? 'Großartig! Du bist ein Harf-Meister!' : 'Muhteşem! Tam bir Harf Kâşifisin!')
              : stars === 2
              ? (de ? 'Sehr gut gemacht! Fast perfekt!' : 'Çok Başarılı! Neredeyse Kusursuz!')
              : (de ? 'Guter Versuch! Übung macht den Meister!' : 'Güzel Gayret! Tekrar deneyerek yıldızları topla!')}
          </h3>

          <p className="kahoot-finish-desc">
            {de
              ? `Du hast ${correctCount} von 10 Fragen richtig beantwortet.`
              : `10 sorudan ${correctCount} tanesini doğru bildin.`}
          </p>

          <div className="kahoot-stats-grid">
            <div className="kahoot-stat-box">
              <span className="kahoot-stat-val text-emerald-400">{correctCount}</span>
              <span className="kahoot-stat-lbl">{de ? 'Richtig' : 'Doğru'}</span>
            </div>
            <div className="kahoot-stat-box">
              <span className="kahoot-stat-val text-rose-400">{10 - correctCount}</span>
              <span className="kahoot-stat-lbl">{de ? 'Falsch' : 'Yanlış'}</span>
            </div>
            <div className="kahoot-stat-box">
              <span className="kahoot-stat-val text-amber-400">{score}</span>
              <span className="kahoot-stat-lbl">{de ? 'Punkte' : 'Toplam Puan'}</span>
            </div>
            <div className="kahoot-stat-box">
              <span className="kahoot-stat-val text-indigo-400">{maxStreak}x</span>
              <span className="kahoot-stat-lbl">{de ? 'Beste Serie' : 'En İyi Seri'}</span>
            </div>
          </div>

          <div className="kahoot-finish-actions">
            <button
              type="button"
              className="kahoot-btn kahoot-btn-primary"
              onClick={handleReplay}
            >
              <RotateCcw size={18} />
              <span>{de ? 'Nochmal spielen' : 'Yeniden Oyna'}</span>
            </button>
            <button
              type="button"
              className="kahoot-btn kahoot-btn-secondary"
              onClick={onBack}
            >
              <span>{backLabel || (de ? 'Zum Buch' : 'Kitaba Dön')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kahoot-quiz-arena">
      {/* Quiz Top Status Bar */}
      <div className="kahoot-hud-bar">
        <button
          type="button"
          className="kahoot-hud-btn"
          onClick={onBack}
          aria-label={de ? 'Zurück' : 'Geri'}
        >
          <ArrowLeft size={16} />
          <span>{backLabel || (de ? 'Buch' : 'Kitaba Dön')}</span>
        </button>

        {/* Question Counter Pill */}
        <div className="kahoot-progress-pill">
          <span className="kahoot-progress-num">{currentIndex + 1}</span>
          <span className="kahoot-progress-total">/ 10</span>
        </div>

        {/* Score & Streak */}
        <div className="kahoot-score-hud">
          {streak > 1 && (
            <span className="kahoot-streak-badge animate-bounce">
              🔥 {streak}x {de ? 'Serie' : 'Seri'}
            </span>
          )}
          <span className="kahoot-score-val">
            ⭐ {score}
          </span>
        </div>
      </div>

      {/* Question Card Box */}
      <div className="kahoot-question-box">
        <div className="kahoot-question-content">
          <span className="kahoot-q-eyebrow">
            {de ? `FRAGE ${currentIndex + 1}` : `SORU ${currentIndex + 1}`}
          </span>
          <h2 className="kahoot-question-text">
            {de ? currentQ.questionDe : currentQ.questionTr}
          </h2>
        </div>

        {/* Mini Mascot reaction indicator */}
        <div className="kahoot-mascot-indicator">
          <RafiMascot state={mascotMood} className="w-14 h-14" />
        </div>
      </div>

      {/* Kahoot 4-Color Answer Tiles Grid */}
      <div className="kahoot-tiles-grid">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOption?.id === opt.id;
          let tileStateClass = '';
          if (isAnswered) {
            if (opt.correct) {
              tileStateClass = 'is-correct';
            } else if (isSelected && !opt.correct) {
              tileStateClass = 'is-wrong';
            } else {
              tileStateClass = 'is-dimmed';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              className={`kahoot-tile kahoot-tile-${opt.color} ${tileStateClass}`}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
            >
              <div className="kahoot-tile-shape">{opt.shape}</div>

              {opt.char && (
                <span className="kahoot-tile-arabic arabic-font">
                  {opt.char}
                </span>
              )}

              <span className="kahoot-tile-text">
                {de ? opt.textDe : opt.textTr}
              </span>

              {isAnswered && opt.correct && (
                <span className="kahoot-tile-badge badge-correct">
                  <Check size={18} strokeWidth={3} />
                </span>
              )}
              {isAnswered && isSelected && !opt.correct && (
                <span className="kahoot-tile-badge badge-wrong">
                  <X size={18} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Feedback Banner & Next Button */}
      {isAnswered && (
        <div className={`kahoot-feedback-drawer ${selectedOption?.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
          <div className="kahoot-feedback-info">
            <span className="kahoot-feedback-title">
              {selectedOption?.correct
                ? (de ? 'Richtig! Ausgezeichnet!' : 'Doğru Cevap! Harikasın!')
                : (de ? 'Leider falsch!' : 'Yanlış Cevap!')}
            </span>
            <p className="kahoot-feedback-hint">
              {de ? currentQ.ruleHintDe : currentQ.ruleHintTr}
            </p>
          </div>

          <button
            type="button"
            className="kahoot-next-btn"
            onClick={handleNext}
            autoFocus
          >
            <span>{currentIndex < 9 ? (de ? 'Nächste Frage' : 'Sonraki Soru') : (de ? 'Ergebnis sehen' : 'Sonuçları Gör')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
