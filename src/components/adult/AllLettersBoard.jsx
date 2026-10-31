import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles, Star, Trophy, Volume2 } from 'lucide-react';
import { LETTERS, letterName } from '../../data/alphabetData';
import { performMonteSwap } from '../../utils/memoryGame';
import { playAudioFile, stopCurrentAudio, sfx } from '../../utils/audioPlayer';
import { Buddy, CardConfetti, Feedback, Glyph } from './ActivityPrimitives';

function shuffleList(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function AllLettersBoard({ lang = 'tr', speed = 1, onBack, onFinish }) {
  const de = lang === 'de';
  const [stage, setStage] = useState(1); // 1 = sequential cards with random targets, 2 = mixed & dynamic shuffling
  const [stageComplete, setStageComplete] = useState(false);
  const [cards, setCards] = useState(() => LETTERS);
  const [foundIds, setFoundIds] = useState(() => new Set());
  const [target, setTarget] = useState(() => LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  const [confettiCardId, setConfettiCardId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [stars, setStars] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [heard, setHeard] = useState(false);
  const [roundKey, setRoundKey] = useState(0);

  const audioToken = useRef(0);
  const autoTimer = useRef(null);
  const cardRefs = useRef(new Map());
  const prevRectsRef = useRef(null);

  const clearTimers = () => {
    if (autoTimer.current) { clearTimeout(autoTimer.current); autoTimer.current = null; }
  };

  useEffect(() => {
    return () => {
      audioToken.current++;
      stopCurrentAudio();
      clearTimers();
    };
  }, []);

  const listen = () => {
    if (!target) return;
    clearTimers();
    const token = ++audioToken.current;
    setAudioError(false);
    const audio = playAudioFile(target.audio, {
      label: letterName(target, lang),
      speed,
      presentation: 'activity',
      onError: () => {
        if (audioToken.current === token) setAudioError(true);
      },
    });
    audio?.addEventListener('playing', () => {
      if (audioToken.current === token) setHeard(true);
    }, { once: true });
  };

  // FLIP animation for Stage 2 card repositioning
  useLayoutEffect(() => {
    const prevRects = prevRectsRef.current;
    if (!prevRects || prevRects.size === 0) return;
    prevRectsRef.current = null;

    const cardsToMove = [];
    cardRefs.current.forEach((el, id) => {
      if (!el) return;
      const prev = prevRects.get(id);
      if (!prev) return;
      const current = el.getBoundingClientRect();
      const dx = prev.left - current.left;
      const dy = prev.top - current.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const rot = (dx > 0 ? 4 : -4) * (0.8 + Math.random() * 0.4);
        cardsToMove.push({ el, dx, dy, rot });
      }
    });

    if (cardsToMove.length === 0) return;

    // INVERT: Position element at previous slot
    cardsToMove.forEach(({ el, dx, dy, rot }) => {
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.07)`;
      el.style.transition = 'none';
      el.style.zIndex = '25';
      el.style.boxShadow = '0 10px 24px rgba(0,0,0,0.25)';
    });

    if (typeof document !== 'undefined') {
      document.body.getBoundingClientRect();
    }

    // PLAY: Animate smoothly to new position
    let rafId = 0;
    if (typeof requestAnimationFrame !== 'undefined') {
      rafId = requestAnimationFrame(() => {
        cardsToMove.forEach(({ el }) => {
          el.style.transition = 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms ease';
          el.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
          el.style.boxShadow = '';
        });
      });
    }

    const timer = setTimeout(() => {
      cardsToMove.forEach(({ el }) => {
        el.style.transform = '';
        el.style.transition = '';
        el.style.zIndex = '';
        el.style.boxShadow = '';
      });
    }, 450);

    return () => {
      if (rafId && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [cards]);

  // Capture current positions for FLIP
  const captureRects = () => {
    const rects = new Map();
    cardRefs.current.forEach((el, id) => {
      if (el) rects.set(id, el.getBoundingClientRect());
    });
    prevRectsRef.current = rects;
  };

  // Switch to Stage 1: Cards in canonical order, random target question, cards deactivate on find
  const startStage1 = () => {
    clearTimers();
    audioToken.current++;
    stopCurrentAudio();
    setStage(1);
    setStageComplete(false);
    setCards(LETTERS);
    setFoundIds(new Set());
    setConfettiCardId(null);
    setWrongId(null);
    const initialTarget = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    setTarget(initialTarget);
    setRoundKey(k => k + 1);
  };

  // Switch to Stage 2: Shuffled cards, dynamic Monte swaps, cards deactivate on find
  const startStage2 = () => {
    clearTimers();
    audioToken.current++;
    stopCurrentAudio();
    setStage(2);
    setStageComplete(false);
    const shuffled = shuffleList(LETTERS);
    setCards(shuffled);
    setFoundIds(new Set());
    setConfettiCardId(null);
    setWrongId(null);
    const initialTarget = shuffled[Math.floor(Math.random() * shuffled.length)];
    setTarget(initialTarget);
    setRoundKey(k => k + 1);
  };

  // Auto-play sound 1s after target changes
  useEffect(() => {
    if (stageComplete || !target) return;
    setHeard(false);
    setWrongId(null);
    clearTimers();
    autoTimer.current = setTimeout(() => {
      listen();
    }, 1000);
    return () => clearTimers();
  }, [target?.id, roundKey, stageComplete]);

  // Handle letter click
  const choose = l => {
    if (stageComplete || foundIds.has(l.id)) return;

    if (l.id === target.id) {
      // Correct answer!
      clearTimers();
      setWrongId(null);
      setConfettiCardId(l.id);
      setStars(s => s + 1);
      sfx.playStar();

      const nextFound = new Set([...foundIds, l.id]);
      setFoundIds(nextFound);

      // Dismiss confetti after 650ms
      setTimeout(() => {
        setConfettiCardId(cid => (cid === l.id ? null : cid));
      }, 650);

      if (stage === 1) {
        // Stage 1: Cards don't move. Pick next target randomly from remaining
        const remaining = LETTERS.filter(x => !nextFound.has(x.id));
        if (remaining.length > 0) {
          const nextTarget = remaining[Math.floor(Math.random() * remaining.length)];
          setTarget(nextTarget);
        } else {
          setStageComplete(true);
          sfx.playSuccess();
          onFinish?.({ correct: stars + 1, total: 29 });
        }
      } else {
        // Stage 2: Remaining cards dynamically swap positions
        const remaining = cards.filter(c => !nextFound.has(c.id));
        if (remaining.length > 0) {
          captureRects();
          sfx.playFlip();
          const nextCards = performMonteSwap(cards);
          setCards(nextCards);
          const nextTarget = remaining[Math.floor(Math.random() * remaining.length)];
          setTarget(nextTarget);
        } else {
          setStageComplete(true);
          sfx.playSuccess();
          onFinish?.({ correct: stars + 1, total: 29 });
        }
      }
    } else {
      // Wrong answer!
      setWrongId(l.id);
      sfx.playMismatch();
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const progressCount = foundIds.size;

  const feedbackTitle = stageComplete
    ? (stage === 1 ? (de ? '1. Stufe gemeistert!' : 'Harika! 1. Aşamayı tamamladın!') : (de ? 'Alle Buchstaben gemeistert!' : 'Tebrikler! Bütün harfleri tamamladın!'))
    : wrongId
    ? (de ? 'Schauen wir noch einmal.' : 'Birlikte yeniden bakalım.')
    : (de ? 'Welchen Buchstaben hörst du?' : 'Hangi harfi duydun?');

  const feedbackDetail = stageComplete
    ? (stage === 1 ? (de ? 'Bereit für Stufe 2 mit gemischten Karten?' : '2. Aşamada harfler karışacak, hazır mısın?') : (de ? 'Tolle Leistung! Du kennst alle Buchstaben.' : 'Harika bir başarı! Bütün harfleri tanıdın.'))
    : wrongId
    ? (de ? 'Höre noch einmal genau hin.' : 'Sesi tekrar dinle ve doğru harfe dokun.')
    : (stage === 1
      ? (de ? 'Finde den gehörten Buchstaben in der Reihe!' : 'Duyduğun harfi tabloda bul ve dokun!')
      : (de ? 'Finde den Buchstaben zwischen den wandernden Karten!' : 'Sesi dinle, yer değiştiren kartlar arasından bul!'));

  return (
    <div className="activity-round activity-game-frame all-letters-frame">
      {/* Merged top bar: Back, Title, Stage Tabs, Stars/Count, Restart */}
      <div className="all-letters-top-bar">
        <div className="all-letters-top-left">
          <button className="activity-btn" onClick={onBack} aria-label={de ? 'Aktivitäten' : 'Etkinlikler'}>
            <ArrowLeft size={17} />
            <span>{de ? 'Aktivitäten' : 'Etkinlikler'}</span>
          </button>
          <h3 className="all-letters-title">{de ? 'Alle Buchstaben' : 'Bütün Harfler'}</h3>
        </div>

        <div className="all-letters-stages" role="tablist" aria-label={de ? 'Übungsstufen' : 'Etkinlik Aşamaları'}>
          <button
            role="tab"
            aria-selected={stage === 1}
            className={stage === 1 ? 'active' : ''}
            onClick={startStage1}
          >
            1. {de ? 'Sıralı Harfler' : 'Sıralı Harfler'}
          </button>
          <button
            role="tab"
            aria-selected={stage === 2}
            className={stage === 2 ? 'active' : ''}
            onClick={startStage2}
          >
            2. {de ? 'Karışık & Dinamik' : 'Karışık & Dinamik'}
          </button>
        </div>

        <div className="all-letters-top-right">
          <span className="activity-stars">
            <Star size={16} fill="currentColor" />{stars}
          </span>
          <span className="all-letters-counter">
            {progressCount} / 29
          </span>
          <button className="activity-btn" onClick={stage === 1 ? startStage1 : startStage2} aria-label={de ? 'Neu starten' : 'Yeniden başlat'}>
            <RotateCcw size={15} />
            <span>{de ? 'Yeniden' : 'Yeniden'}</span>
          </button>
        </div>
      </div>

      <div className="activity-workspace all-letters-workspace">
        {/* Compact prompt column */}
        <section className="activity-prompt all-letters-prompt">
          <Buddy happy={stageComplete || Boolean(confettiCardId)} />
          <h3>
            {stageComplete
              ? (de ? 'Glückwunsch!' : 'Tebrikler!')
              : stage === 1
              ? (de ? 'Sıradaki harfi bul ve dokun!' : 'Sıradaki harfi bul ve dokun!')
              : (de ? 'Duyduğun harfi tabloda bul!' : 'Duyduğun harfi tabloda bul!')}
          </h3>
          {!stageComplete && (
            <button className="activity-btn activity-primary all-letters-listen-btn" onClick={listen}>
              <Volume2 size={18} />{de ? 'Dinle' : 'Dinle'}
            </button>
          )}
          {audioError && <p className="activity-audio-error" role="alert">{de ? 'Bitte erneut anhören.' : 'Ses açılamadı, yeniden dokun.'}</p>}
        </section>

        {/* 29-letter grid */}
        <div className="activity-board all-letters-board-scroll">
          {stageComplete ? (
            <div className="all-letters-congrats">
              <div className="congrats-trophy-badge">
                <Trophy size={32} />
              </div>
              <h2>
                {stage === 1
                  ? (de ? '1. Stufe erfolgreich beendet!' : '1. Aşama Başarıyla Tamamlandı!')
                  : (de ? 'Alle 29 Buchstaben gemeistert!' : '29 Harfin Tamamını Başarıyla Buldun!')}
              </h2>
              <p>
                {stage === 1
                  ? (de ? 'Du hast alle Buchstaben gefunden. Jetzt kannst du Stufe 2 mit gemischten Karten spielen!' : 'Sıralı 29 harfin tamamını başarıyla buldun! Şimdi kartların yer değiştirdiği 2. Aşamaya geçebilirsin.')
                  : (de ? 'Hervorragende Leistung! Du hast auch alle gemischten Buchstaben gefunden.' : 'Harika! Karışan ve yer değiştiren kartlar arasında da bütün harfleri eksiksiz buldun.')}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {stage === 1 ? (
                  <button className="activity-btn activity-primary" onClick={startStage2} style={{ minHeight: 42, padding: '0 20px', fontSize: 14 }}>
                    <Sparkles size={16} />{de ? '2. Stufe starten (Gemischt)' : '2. Aşamaya Geç (Karışık Mod) 🚀'}
                  </button>
                ) : (
                  <button className="activity-btn activity-primary" onClick={startStage1} style={{ minHeight: 42, padding: '0 20px', fontSize: 14 }}>
                    <RotateCcw size={16} />{de ? 'Baştan Oyna' : 'Baştan Oyna 🔄'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="all-letters-grid" dir="rtl" aria-label={de ? 'Alle 29 Buchstaben' : 'Bütün harflerin kartı'}>
              {cards.map(l => {
                const isFound = foundIds.has(l.id);
                const hasConfetti = confettiCardId === l.id;
                const isWrong = wrongId === l.id;

                return (
                  <button
                    key={l.id}
                    ref={el => {
                      if (el) cardRefs.current.set(l.id, el);
                      else cardRefs.current.delete(l.id);
                    }}
                    className={`activity-letter ${isFound ? 'is-deactivated' : ''} ${hasConfetti ? 'has-confetti' : ''} ${isWrong ? 'is-incorrect' : ''}`}
                    disabled={isFound || stageComplete}
                    onClick={() => choose(l)}
                    aria-label={`${letterName(l, lang)}${isFound ? (de ? ' (bulundu)' : ' (bulundu)') : ''}`}
                  >
                    <Glyph letter={l} />
                    {isFound && (
                      <span className="deactivated-badge" aria-hidden="true">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                    {hasConfetti && <CardConfetti />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Feedback
        tone={stageComplete ? 'complete' : wrongId ? 'encourage' : 'ready'}
        reward={stars}
        title={feedbackTitle}
        detail={feedbackDetail}
      >
        {!stageComplete && (
          <button className="activity-btn activity-sound" onClick={listen} aria-label={de ? 'Buchstaben hören' : 'Harfi dinle'}>
            <Volume2 size={18} />
          </button>
        )}
        {stageComplete ? (
          stage === 1 ? (
            <button className="activity-btn activity-primary" onClick={startStage2}>
              {de ? 'Weiter zu Stufe 2' : '2. Aşamaya Geç'}<ArrowRight size={17} />
            </button>
          ) : (
            <button className="activity-btn activity-primary" onClick={startStage1}>
              <RotateCcw size={16} />{de ? 'Erneut spielen' : 'Yeniden Oyna'}
            </button>
          )
        ) : null}
      </Feedback>
    </div>
  );
}
