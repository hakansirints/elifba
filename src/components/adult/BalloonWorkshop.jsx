import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Headphones, Play, RotateCcw, Sparkles, Star, Timer, Volume2 } from 'lucide-react';
import { LETTERS } from '../../data/alphabetData.js';
import { playAudioFile, stopCurrentAudio, sfx } from '../../utils/audioPlayer.js';
import { Finish, Glyph } from './ActivityPrimitives.jsx';

const BALLOON_COLORS = [
  { bg: 'radial-gradient(circle at 32% 26%, #ff7b7b 0%, #ef4444 32%, #b91c1c 72%, #7f1d1d 100%)' },
  { bg: 'radial-gradient(circle at 32% 26%, #60a5fa 0%, #3b82f6 32%, #1d4ed8 72%, #172554 100%)' },
  { bg: 'radial-gradient(circle at 32% 26%, #34d399 0%, #10b981 32%, #047857 72%, #064e3b 100%)' },
  { bg: 'radial-gradient(circle at 32% 26%, #fde047 0%, #f59e0b 32%, #d97706 72%, #78350f 100%)' },
  { bg: 'radial-gradient(circle at 32% 26%, #c084fc 0%, #8b5cf6 32%, #6d28d9 72%, #4c1d95 100%)' },
  { bg: 'radial-gradient(circle at 32% 26%, #f472b6 0%, #ec4899 32%, #be185d 72%, #831843 100%)' },
];

const LOCAL_CONFETTI_PIECES = [
  { x: -38, y: -48, rot: 45, color: '#f59e0b' },
  { x: 35, y: -52, rot: -60, color: '#10b981' },
  { x: -55, y: -12, rot: 120, color: '#3b82f6' },
  { x: 55, y: -18, rot: -45, color: '#ec4899' },
  { x: -32, y: 38, rot: 80, color: '#8b5cf6' },
  { x: 38, y: 34, rot: -90, color: '#f97316' },
  { x: 0, y: -60, rot: 15, color: '#fbbf24' },
  { x: -48, y: -32, rot: -75, color: '#14b8a6' },
  { x: 48, y: -38, rot: 100, color: '#a855f7' },
  { x: 0, y: 48, rot: -30, color: '#ef4444' },
];

const TOTAL_ROUNDS = 6;
// 1-minute (60 seconds) continuous learning workshop
const GAME_DURATION_SEC = 60;
// Balloon rises smoothly across the arena (approx 8.8 seconds from bottom to top)
const RISE_SPEED_PERCENT_PER_SEC = 14;
// Spawn a single balloon every 1.45 seconds to keep 5-6 balloons active at all times
const SPAWN_INTERVAL_MS = 1450;
// 6 Dedicated spaced lanes cycling across the arena ensure zero horizontal collision
const LANES = [14, 58, 28, 74, 43, 88];

export default function BalloonWorkshop({ lang = 'tr', speed = 1, onBack, onFinish, backLabel }) {
  const de = lang === 'de';
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SEC);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  // Active target & balloons state
  const [targetLetter, setTargetLetter] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [poppedInfo, setPoppedInfo] = useState(null); // { id, x, y }
  const [shakingId, setShakingId] = useState(null);

  const arenaRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const lastSpawnTimeRef = useRef(0);
  const lastLaneIdxRef = useRef(0);
  const audioToken = useRef(0);
  const submitted = useRef(false);

  // Synchronous game refs to eliminate race conditions
  const balloonsRef = useRef([]);
  const targetLetterRef = useRef(null);
  const timeLeftRef = useRef(GAME_DURATION_SEC);
  const scoreRef = useRef(score);
  const wrongRef = useRef(wrong);
  const doneRef = useRef(done);

  // Keep refs in sync
  targetLetterRef.current = targetLetter;
  scoreRef.current = score;
  wrongRef.current = wrong;
  doneRef.current = done;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioToken.current++;
      stopCurrentAudio();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Helper to pronounce target letter
  const playTargetAudio = useCallback((letter) => {
    if (!letter) return;
    audioToken.current++;
    const token = audioToken.current;
    setTimeout(() => {
      if (audioToken.current === token) {
        playAudioFile(letter.audio, {
          label: letter.char,
          speed,
          presentation: 'activity',
        });
      }
    }, 180);
  }, [speed]);

  // Helper to spawn exactly 1 balloon into the next lane
  const spawnBalloon = useCallback((now, forcedTarget = false) => {
    if (doneRef.current) return;

    // Cycle to next lane among LANES
    lastLaneIdxRef.current = (lastLaneIdxRef.current + 1) % LANES.length;
    const laneX = LANES[lastLaneIdxRef.current];

    const currentTarget = targetLetterRef.current;
    if (!currentTarget) return;

    // If there is currently NO active target balloon in flight, force this one to be the target
    const hasActiveTargetInFlight = balloonsRef.current.some(
      b => b.isTarget && !b.popped && b.y > -10
    );
    const isTarget = forcedTarget || !hasActiveTargetInFlight;

    let letter = currentTarget;
    if (!isTarget) {
      const distractors = LETTERS.filter(l => l.id !== currentTarget.id);
      letter = distractors[Math.floor(Math.random() * distractors.length)];
    }

    const newBalloon = {
      id: `b-${now}-${Math.random().toString(36).slice(2, 6)}`,
      letter,
      isTarget,
      laneX,
      y: 106, // Starts just below the visible arena bottom
      speed: RISE_SPEED_PERCENT_PER_SEC,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleX: 0,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      popped: false,
      escaped: false,
    };

    balloonsRef.current.push(newBalloon);
  }, []);

  // Start game when user clicks "Oyunu Başlat" on the intro screen
  const startGame = useCallback(() => {
    sfx.playPop();
    setStarted(true);

    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
    const initialTarget = shuffled[0];
    setTargetLetter(initialTarget);
    targetLetterRef.current = initialTarget;

    const now = performance.now();
    lastSpawnTimeRef.current = now;
    lastTimeRef.current = now;

    // Distractors for initial batch
    const distractors = LETTERS.filter(l => l.id !== initialTarget.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);

    // Initial 5 staggered balloons (lanes 0..4) at heights 18, 35, 52, 69, 86
    const initialBalloons = [
      {
        id: `b-init-0`,
        letter: shuffledDistractors[0] || initialTarget,
        isTarget: false,
        laneX: LANES[0],
        y: 18,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[0],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-1`,
        letter: shuffledDistractors[1] || initialTarget,
        isTarget: false,
        laneX: LANES[1],
        y: 35,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[1],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-2`,
        letter: shuffledDistractors[2] || initialTarget,
        isTarget: false,
        laneX: LANES[2],
        y: 52,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[2],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-3`,
        letter: initialTarget,
        isTarget: true,
        laneX: LANES[3],
        y: 69,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[3],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-4`,
        letter: shuffledDistractors[3] || initialTarget,
        isTarget: false,
        laneX: LANES[4],
        y: 86,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[4],
        popped: false,
        escaped: false,
      },
    ];

    lastLaneIdxRef.current = 4; // next will be lane 5 (88%)
    balloonsRef.current = initialBalloons;
    setBalloons([...initialBalloons]);

    setTimeout(() => {
      playTargetAudio(initialTarget);
    }, 450);
  }, [playTargetAudio]);

  // 1-MINUTE (60s) COUNTDOWN TIMER
  useEffect(() => {
    if (!started || done) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setDone(true);
          doneRef.current = true;
          sfx.playSuccess();
          if (!submitted.current) {
            submitted.current = true;
            onFinish?.({
              correct: scoreRef.current,
              total: Math.max(scoreRef.current + wrongRef.current, 1),
            });
          }
          return 0;
        }
        timeLeftRef.current = prev - 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, done, onFinish]);

  // CONTINUOUS 60FPS RAF LOOP: Smooth continuous rising stream with NO game resets
  useEffect(() => {
    if (!started || done) return;

    lastTimeRef.current = performance.now();

    const tick = (now) => {
      if (doneRef.current) return;

      const deltaSec = Math.min((now - (lastTimeRef.current || now)) / 1000, 0.1);
      lastTimeRef.current = now;

      // Regular spawn interval: continuously send 1 balloon every 1.45 seconds (5-6 balloons active)
      if (now - lastSpawnTimeRef.current >= SPAWN_INTERVAL_MS) {
        lastSpawnTimeRef.current = now;
        spawnBalloon(now);
      }

      let targetEscaped = false;

      // Move existing balloons upwards
      balloonsRef.current = balloonsRef.current
        .filter(b => b.y > -22) // Remove balloons once they fully exit top
        .map(b => {
          if (b.popped) return b;

          const nextY = b.y - b.speed * deltaSec;
          const wobble = Math.sin(now * 0.003 + b.wobblePhase) * 5; // Subtle 5px wobble

          // Check if unpopped target balloon sailed past the top
          if (b.isTarget && nextY < -15 && !b.escaped) {
            targetEscaped = true;
            return { ...b, y: nextY, wobbleX: wobble, escaped: true };
          }

          return { ...b, y: nextY, wobbleX: wobble };
        });

      setBalloons([...balloonsRef.current]);

      // If target balloon escaped without being caught: DO NOT count as error!
      // Simply pick/announce next target cleanly and reset streak
      if (targetEscaped) {
        setStreak(0);

        const candidates = LETTERS.filter(l => l.id !== targetLetterRef.current?.id);
        const nextTarget = candidates[Math.floor(Math.random() * candidates.length)];
        setTargetLetter(nextTarget);
        targetLetterRef.current = nextTarget;

        setTimeout(() => {
          if (!doneRef.current) {
            playTargetAudio(nextTarget);
          }
        }, 800);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [started, done, spawnBalloon, playTargetAudio]);

  const listen = () => {
    if (!targetLetter) return;
    audioToken.current++;
    playAudioFile(targetLetter.audio, {
      label: targetLetter.char,
      speed,
      presentation: 'activity',
    });
  };

  const handleBalloonClick = (balloon, e) => {
    if (balloon.popped || doneRef.current) return;

    if (balloon.isTarget) {
      // Confetti burst right on the clicked balloon
      const arenaEl = arenaRef.current;
      const clickedEl = e.currentTarget;
      if (clickedEl && arenaEl) {
        const cRect = clickedEl.getBoundingClientRect();
        const aRect = arenaEl.getBoundingClientRect();
        setPoppedInfo({
          id: balloon.id,
          x: cRect.left - aRect.left + cRect.width / 2,
          y: cRect.top - aRect.top + cRect.height / 2,
        });
      }

      // Mark this balloon as popped (other balloons continue floating smoothly!)
      balloonsRef.current = balloonsRef.current.map(b =>
        b.id === balloon.id ? { ...b, popped: true } : b
      );
      setBalloons([...balloonsRef.current]);

      // Pop & star sound effect - NO voice audio is played on click!
      sfx.playPop();
      sfx.playStar();

      setScore(s => s + 1);
      scoreRef.current += 1;
      setStreak(st => st + 1);

      // Select new target letter
      const candidates = LETTERS.filter(l => l.id !== balloon.letter.id);
      const nextTarget = candidates[Math.floor(Math.random() * candidates.length)];
      setTargetLetter(nextTarget);
      targetLetterRef.current = nextTarget;

      // Announce next target letter after confetti clears
      setTimeout(() => {
        if (!doneRef.current) {
          playTargetAudio(nextTarget);
        }
      }, 750);

      // Clear burst confetti after 700ms
      setTimeout(() => {
        setPoppedInfo(null);
      }, 700);
    } else {
      // Wrong balloon clicked: count as wrong click!
      setWrong(w => w + 1);
      wrongRef.current += 1;
      setShakingId(balloon.id);
      sfx.playTryAgain();
      setStreak(0);

      setTimeout(() => {
        balloonsRef.current = balloonsRef.current.map(b =>
          b.id === balloon.id ? { ...b, popped: true } : b
        );
        setBalloons([...balloonsRef.current]);
        setShakingId(null);
      }, 350);
    }
  };

  const restart = () => {
    setStarted(true);
    setTimeLeft(GAME_DURATION_SEC);
    timeLeftRef.current = GAME_DURATION_SEC;
    setScore(0);
    setWrong(0);
    setStreak(0);
    setDone(false);
    doneRef.current = false;
    submitted.current = false;

    const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
    const initialTarget = shuffled[0];
    setTargetLetter(initialTarget);
    targetLetterRef.current = initialTarget;

    const now = performance.now();
    lastSpawnTimeRef.current = now;
    lastTimeRef.current = now;

    const distractors = LETTERS.filter(l => l.id !== initialTarget.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);

    const initialBalloons = [
      {
        id: `b-init-0`,
        letter: shuffledDistractors[0] || initialTarget,
        isTarget: false,
        laneX: LANES[0],
        y: 18,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[0],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-1`,
        letter: shuffledDistractors[1] || initialTarget,
        isTarget: false,
        laneX: LANES[1],
        y: 35,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[1],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-2`,
        letter: shuffledDistractors[2] || initialTarget,
        isTarget: false,
        laneX: LANES[2],
        y: 52,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[2],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-3`,
        letter: initialTarget,
        isTarget: true,
        laneX: LANES[3],
        y: 69,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[3],
        popped: false,
        escaped: false,
      },
      {
        id: `b-init-4`,
        letter: shuffledDistractors[3] || initialTarget,
        isTarget: false,
        laneX: LANES[4],
        y: 86,
        speed: RISE_SPEED_PERCENT_PER_SEC,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleX: 0,
        color: BALLOON_COLORS[4],
        popped: false,
        escaped: false,
      },
    ];

    lastLaneIdxRef.current = 4;
    balloonsRef.current = initialBalloons;
    setBalloons([...initialBalloons]);

    setTimeout(() => {
      playTargetAudio(initialTarget);
    }, 450);
  };

  if (done) {
    return (
      <Finish
        lang={lang}
        correct={score}
        total={Math.max(score + wrong, 1)}
        backLabel={backLabel}
        onBack={onBack}
        onReplay={restart}
      />
    );
  }

  if (!started) {
    return (
      <div className="activity-game-frame balloon-workshop-frame balloon-intro-frame">
        {/* Top Header Row with Back Button */}
        <div className="activity-round-meta balloon-top-meta">
          <button className="activity-btn" onClick={onBack} aria-label={de ? 'Zurück' : 'Geri'}>
            <ArrowLeft size={16} />
            <span>{backLabel || (de ? 'Aktivitäten' : 'Etkinlikler')}</span>
          </button>
        </div>

        {/* Informative Intro Container */}
        <div className="balloon-intro-content">
          <div className="balloon-intro-hero">
            <span className="balloon-intro-badge">
              <Sparkles size={14} />
              <span>{de ? 'KLEINE BUCHSTABEN-ENTDECKER' : 'KÜÇÜK HARF KÂŞİFLERİ'}</span>
            </span>
            <h2 className="balloon-intro-title">
              {de ? 'Fliegende Ballons · Wie wird gespielt?' : 'Uçan Balonlar · Nasıl Oynanır?'}
            </h2>
            <p className="balloon-intro-subtitle">
              {de
                ? 'Höre den Buchstaben, finde den passenden Ballon und sammle Sterne!'
                : 'Sesi dikkatle dinle, gökyüzünde yükselen doğru harfi yakala ve puanları topla!'}
            </p>
          </div>

          {/* 3 Step Instruction Cards */}
          <div className="balloon-intro-steps">
            <div className="balloon-intro-step-card">
              <div className="balloon-step-icon-wrap step-icon-audio">
                <Headphones size={22} />
              </div>
              <div className="balloon-step-body">
                <strong>{de ? '1. Sesi Dinle' : '1. Sesi Dinle'}</strong>
                <p>
                  {de
                    ? 'Das Spiel sagt dir einen arabischen Buchstaben vor. Mit dem Lautsprecher kannst du ihn erneut hören.'
                    : 'Hedef harf seslendirilir. İstediğin an hoparlör butonuna basarak sesi tekrar dinleyebilirsin.'}
                </p>
              </div>
            </div>

            <div className="balloon-intro-step-card">
              <div className="balloon-step-icon-wrap step-icon-balloon">
                <span className="balloon-step-emoji" aria-hidden="true">🎈</span>
              </div>
              <div className="balloon-step-body">
                <strong>{de ? '2. Balonu Patlat' : '2. Balonu Patlat'}</strong>
                <p>
                  {de
                    ? 'Lasse den Ballon mit dem richtigen Buchstaben platzen, bevor er den Himmel verlässt.'
                    : 'Gökyüzünde süzülen balonlar arasından duyduğun harfi bul ve kaybolmadan tıkla!'}
                </p>
              </div>
            </div>

            <div className="balloon-intro-step-card">
              <div className="balloon-step-icon-wrap step-icon-timer">
                <Timer size={22} />
              </div>
              <div className="balloon-step-body">
                <strong>{de ? '3. 60 Saniye' : '3. 60 Saniye'}</strong>
                <p>
                  {de
                    ? 'Du hast 60 Sekunden Zeit. Finde so viele Buchstaben wie möglich und erreiche die Bestnote!'
                    : '60 saniye boyunca hızlı ve dikkatli ol; seriler yaparak en yüksek puana ulaş!'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Area: Big Start Button */}
          <div className="balloon-intro-actions">
            <button
              type="button"
              className="balloon-start-btn"
              onClick={startGame}
              autoFocus
            >
              <Play size={20} fill="currentColor" />
              <span>{de ? 'Oyunu Başlat' : 'Oyunu Başlat'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-game-frame balloon-workshop-frame">
      {/* Top Header: Etkinlikler, Ses Açıklama Kapsülü (ortada), İlerleme & Skor (sağda) */}
      <div className="activity-round-meta balloon-top-meta">
        <button className="activity-btn" onClick={onBack} aria-label={de ? 'Zurück' : 'Geri'}>
          <ArrowLeft size={16} />
          <span>{backLabel || (de ? 'Aktivitäten' : 'Etkinlikler')}</span>
        </button>

        {/* Ses Butonu ve Açıklama: Etkinlikler ile İlerleme Barı arasında */}
        <div className="balloon-header-sound-pill">
          <button
            className="activity-btn activity-primary balloon-compact-speaker"
            onClick={listen}
            aria-label={de ? 'Zielbuchstaben anhören' : 'Hedef harfi dinle'}
            title={de ? 'Zielbuchstaben anhören' : 'Hedef harfi dinle'}
          >
            <Volume2 size={18} />
          </button>
          <span className="balloon-header-sound-text">
            {de ? 'Höre den Buchstaben & fange den Ballon!' : 'Sesi dinle, uçan balonu yakala!'}
          </span>
        </div>

        {/* İlerleme ve Skor Grubu */}
        <div className="balloon-header-progress-group">
          {/* İlerleme barının SOLUNDA: Yakalanan ve Hatalı Tıklama Göstergesi */}
          <div className="balloon-score-pills" aria-label={de ? 'Ergebnis' : 'Skor'}>
            <span className="balloon-stat-pill caught" title={de ? 'Gefangene Ballons' : 'Yakalanan Balonlar'}>
              <span className="stat-emoji">🎈</span>
              <span className="stat-text">{de ? 'Yakalanan' : 'Yakalanan'}:</span>
              <strong className="stat-val">{score}</strong>
            </span>
            <span className="balloon-stat-pill wrong" title={de ? 'Falsche Klicks' : 'Hatalı Tıklamalar'}>
              <span className="stat-emoji">❌</span>
              <span className="stat-text">{de ? 'Hatalı' : 'Hatalı'}:</span>
              <strong className="stat-val">{wrong}</strong>
            </span>
          </div>

          <span className="balloon-round-indicator" style={{ minWidth: '52px', fontWeight: 800 }}>
            ⏱️ {timeLeft}s
          </span>
          <progress value={GAME_DURATION_SEC - timeLeft} max={GAME_DURATION_SEC} />
          <span className="activity-stars">
            <Star size={15} />
            {score}
          </span>
          {streak > 1 && (
            <span className="stat-badge emerald" style={{ fontSize: '11px', padding: '2px 8px' }}>
              🔥 {streak}x
            </span>
          )}
        </div>
      </div>

      {/* Main Sky Area with Rising Balloons - Expands to fill the entire rest of the frame */}
      <div className="balloon-sky-arena" ref={arenaRef}>
        {/* Sevimli Çizim Tarzı Güneş */}
        <div className="cartoon-sky-sun" aria-hidden="true">
          <div className="cartoon-sun-core" />
          <div className="cartoon-sun-rays" />
        </div>

        {/* Arada Sahneden Süzülerek Geçen Sevimli Kuşlar */}
        <div className="cartoon-bird-group bird-group-1" aria-hidden="true">
          <div className="cartoon-bird-item bird-lead">
            <svg viewBox="0 0 34 18" width="34" height="18" className="cartoon-bird-svg">
              <path d="M 2,6 Q 9,0 17,11 Q 25,0 32,6 Q 24,12 17,12 Q 10,12 2,6 Z" />
            </svg>
          </div>
          <div className="cartoon-bird-item bird-sub">
            <svg viewBox="0 0 34 18" width="24" height="13" className="cartoon-bird-svg">
              <path d="M 2,6 Q 9,0 17,11 Q 25,0 32,6 Q 24,12 17,12 Q 10,12 2,6 Z" />
            </svg>
          </div>
        </div>

        <div className="cartoon-bird-group bird-group-2" aria-hidden="true">
          <div className="cartoon-bird-item">
            <svg viewBox="0 0 34 18" width="30" height="16" className="cartoon-bird-svg">
              <path d="M 2,6 Q 9,0 17,11 Q 25,0 32,6 Q 24,12 17,12 Q 10,12 2,6 Z" />
            </svg>
          </div>
        </div>

        {/* Sağa Sola Yavaşça Süzülen Sevimli Çizim Tarzı Bulutlar */}
        <div className="cartoon-cloud cloud-slot-1" aria-hidden="true">
          <svg className="cartoon-cloud-svg" viewBox="0 0 140 70" width="140" height="70">
            <path
              d="M 25,60 A 20,20 0 0,1 25,25 A 25,25 0 0,1 70,12 A 30,30 0 0,1 115,28 A 20,20 0 0,1 115,60 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <div className="cartoon-cloud cloud-slot-2" aria-hidden="true">
          <svg className="cartoon-cloud-svg" viewBox="0 0 170 85" width="170" height="85">
            <path
              d="M 30,72 A 24,24 0 0,1 30,30 A 30,30 0 0,1 85,15 A 36,36 0 0,1 140,34 A 24,24 0 0,1 140,72 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <div className="cartoon-cloud cloud-slot-3" aria-hidden="true">
          <svg className="cartoon-cloud-svg" viewBox="0 0 120 60" width="120" height="60">
            <path
              d="M 20,52 A 18,18 0 0,1 20,22 A 22,22 0 0,1 60,10 A 26,26 0 0,1 100,24 A 18,18 0 0,1 100,52 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <div className="cartoon-cloud cloud-slot-4" aria-hidden="true">
          <svg className="cartoon-cloud-svg" viewBox="0 0 150 75" width="150" height="75">
            <path
              d="M 26,65 A 22,22 0 0,1 26,27 A 27,27 0 0,1 75,13 A 32,32 0 0,1 124,30 A 22,22 0 0,1 124,65 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* Rising Balloons (Positions driven smoothly from bottom to top via JS) */}
        {balloons.map(b => {
          const isPopped = b.popped;
          const isShaking = shakingId === b.id;

          return (
            <button
              key={b.id}
              className={`rising-balloon-live ${isPopped ? 'is-popped' : ''} ${isShaking ? 'is-shaking' : ''}`}
              style={{
                left: `${b.laneX}%`,
                top: `${b.y}%`,
                transform: `translateX(${b.wobbleX || 0}px)${isPopped ? ' scale(1.4)' : ''}`,
                '--balloon-bg': b.color.bg,
              }}
              onClick={e => handleBalloonClick(b, e)}
              disabled={isPopped}
              aria-label={b.letter.char}
            >
              <div className="balloon-body">
                <span className="balloon-glyph">
                  <Glyph letter={b.letter} />
                </span>
                <span className="balloon-knot" aria-hidden="true" />
                <svg className="balloon-curled-ribbon" viewBox="0 0 28 65" width="28" height="65" aria-hidden="true">
                  <path
                    d="M 14 0 C 3 11, 25 18, 14 28 C 3 38, 25 45, 14 55 C 8 60, 20 63, 14 65"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>
          );
        })}

        {/* LOCAL CONFETTI: Explodes EXACTLY on / over the clicked balloon's position */}
        {poppedInfo && (
          <div
            className="balloon-local-confetti"
            style={{
              left: `${poppedInfo.x}px`,
              top: `${poppedInfo.y}px`,
            }}
            aria-hidden="true"
          >
            <div className="balloon-burst-ring" />
            {LOCAL_CONFETTI_PIECES.map((piece, i) => (
              <span
                key={i}
                className="balloon-confetti-particle"
                style={{
                  '--tx': `${piece.x}px`,
                  '--ty': `${piece.y}px`,
                  '--rot': `${piece.rot}deg`,
                  '--bg': piece.color,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
