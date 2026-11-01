import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, RotateCcw, Sparkles, Star, Timer, Trophy, Volume2 } from 'lucide-react';
import { CardConfetti, Feedback, Glyph } from './ActivityPrimitives';
import {
  createTrainQuestions,
  createChameleonQuestions,
  createDetectiveQuestions,
  createPuzzleQuestions,
  POSITION_META,
} from '../../data/letterPositions';
import { playAudioFile, stopCurrentAudio, sfx } from '../../utils/audioPlayer';

const formatTimer = secs => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

function RailwayBarrier({ isOpen }) {
  return (
    <div className={`railway-barrier ${isOpen ? 'is-open' : 'is-closed'}`} aria-hidden="true">
      <svg viewBox="0 0 64 86" className="barrier-svg" fill="none">
        {/* Ground Foundation Base */}
        <rect x="36" y="72" width="22" height="14" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="2" />

        {/* Vertical Barrier Post */}
        <rect x="42" y="32" width="10" height="42" fill="#e5e7eb" stroke="#4b5563" strokeWidth="2" />

        {/* Signal Warning Light Box */}
        <rect x="38" y="20" width="18" height="14" rx="3" fill="#1f2937" stroke="#111827" strokeWidth="1.5" />
        {/* Red Stop Light (Glows when closed) */}
        <circle cx="43" cy="27" r="3.5" fill={isOpen ? '#4b5563' : '#ef4444'} className={!isOpen ? 'barrier-light-red' : ''} />
        {/* Green Go Light (Glows when open) */}
        <circle cx="51" cy="27" r="3.5" fill={isOpen ? '#10b981' : '#4b5563'} className={isOpen ? 'barrier-light-green' : ''} />

        {/* Pivot Center Pin */}
        <circle cx="47" cy="46" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />

        {/* Rotating Barrier Arm (Pivot at x=47, y=46) */}
        <g
          className={`barrier-arm-group ${isOpen ? 'arm-open' : 'arm-closed'}`}
          style={{
            transformOrigin: '47px 46px',
            transformBox: 'view-box',
            transition: 'transform 0.65s cubic-bezier(0.34, 1.35, 0.64, 1)',
            transform: isOpen ? 'rotate(84deg)' : 'rotate(0deg)',
          }}
        >
          {/* Barrier Arm: White beam with red diagonal warning stripes */}
          <rect x="2" y="43" width="46" height="6" rx="1.5" fill="#ffffff" stroke="#b91c1c" strokeWidth="1.5" />
          <rect x="6" y="44" width="7" height="4" fill="#dc2626" />
          <rect x="19" y="44" width="7" height="4" fill="#dc2626" />
          <rect x="32" y="44" width="7" height="4" fill="#dc2626" />
          <circle cx="3" cy="46" r="2.5" fill="#fbbf24" />
        </g>
      </svg>
    </div>
  );
}

function TrainLocomotive({ isDeparting }) {
  return (
    <div className={`train-locomotive ${isDeparting ? 'is-chugging' : ''}`} aria-hidden="true">
      {/* Animated Steam Smoke Puffs */}
      <div className="loco-smoke">
        <span className="smoke-bubble s1"></span>
        <span className="smoke-bubble s2"></span>
        <span className="smoke-bubble s3"></span>
      </div>

      {/* Handcrafted detailed Locomotive SVG (RTL: Head facing right →) */}
      <svg viewBox="0 0 125 86" className="loco-svg" fill="none">
        {/* Cowcatcher / Front plow on the right */}
        <polygon points="112,66 124,76 102,76" fill="#d97706" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />

        {/* Headlight on the right front */}
        <rect x="105" y="36" width="10" height="12" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
        <polygon points="115,38 125,32 125,52 115,46" fill="#fef08a" opacity="0.65" />

        {/* Boiler cylinder */}
        <rect x="46" y="32" width="62" height="34" rx="7" fill="#047857" stroke="#065f46" strokeWidth="2.5" />

        {/* Boiler golden accent bands */}
        <line x1="64" y1="32" x2="64" y2="66" stroke="#fbbf24" strokeWidth="2.5" />
        <line x1="84" y1="32" x2="84" y2="66" stroke="#fbbf24" strokeWidth="2.5" />

        {/* Smokestack / Chimney */}
        <path d="M90 32 L86 16 L100 16 L96 32 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />

        {/* Steam Dome */}
        <path d="M70 32 C70 24 80 24 80 32 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />

        {/* Engineer Cab on the left side of locomotive */}
        <path d="M14 18 L49 18 L49 66 L14 66 Z" fill="#065f46" stroke="#047857" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Cab Curved Roof */}
        <path d="M10 18 C10 14 53 14 53 18 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />

        {/* Cab Window */}
        <rect x="22" y="24" width="20" height="18" rx="3" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        {/* Friendly Driver Silhouette */}
        <circle cx="32" cy="33" r="5" fill="#f59e0b" />

        {/* Steel Chassis base */}
        <rect x="6" y="64" width="112" height="10" rx="3" fill="#1f2937" stroke="#111827" strokeWidth="2" />

        {/* Coupler hitch to wagons on left */}
        <rect x="0" y="66" width="8" height="6" rx="2" fill="#4b5563" />

        {/* Large Locomotive Wheels with Spokes - lowest point touches y=86 */}
        <circle cx="32" cy="74" r="12" fill="#b45309" stroke="#1f2937" strokeWidth="3" className="train-wheel" />
        <circle cx="32" cy="74" r="4" fill="#fbbf24" />

        <circle cx="72" cy="76" r="10" fill="#b45309" stroke="#1f2937" strokeWidth="2.5" className="train-wheel" />
        <circle cx="72" cy="76" r="3.5" fill="#fbbf24" />

        <circle cx="98" cy="76" r="10" fill="#b45309" stroke="#1f2937" strokeWidth="2.5" className="train-wheel" />
        <circle cx="98" cy="76" r="3.5" fill="#fbbf24" />

        {/* Piston drive rod */}
        <line x1="32" y1="74" x2="98" y2="76" stroke="#f3f4f6" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function PositionWorkshop({ mode, page = 17, lang, speed = 1, onBack, onFinish }) {
  const de = lang === 'de';

  const [questions, setQuestions] = useState(() => {
    if (mode === 'train') return createTrainQuestions(Math.random, 6);
    if (mode === 'chameleon') return createChameleonQuestions(Math.random, 6);
    if (mode === 'detective') return createDetectiveQuestions(Math.random, 6);
    if (mode === 'puzzle') return createPuzzleQuestions(Math.random, 6);
    return [];
  });

  const [index, setIndex] = useState(0);
  const [selectedCorrect, setSelectedCorrect] = useState(null);
  const [wrongOption, setWrongOption] = useState(null);
  const [isResolved, setIsResolved] = useState(false);
  const [firstTry, setFirstTry] = useState(true);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [confetti, setConfetti] = useState(false);

  // Train animation states
  const [trainDeparting, setTrainDeparting] = useState(false);
  const [trainArriving, setTrainArriving] = useState(false);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingOption, setDraggingOption] = useState(null);

  const audioTimer = useRef(null);
  const wrongTimerRef = useRef(null);
  const advanceTimerRef = useRef(null);
  const finishReported = useRef(false);
  const dropTargetRef = useRef(null);
  const touchStartRef = useRef(null);

  const currentQ = questions[index];
  const total = questions.length;

  // Live timer
  useEffect(() => {
    let interval = null;
    if (!done) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [done]);

  // Delayed audio on question load (0.5s delay)
  useEffect(() => {
    if (done || !currentQ) return;
    clearTimeout(audioTimer.current);

    const letter = currentQ.letter || currentQ.baseLetter;
    if (letter?.audio) {
      audioTimer.current = setTimeout(() => {
        playAudioFile(letter.audio, {
          label: de ? letter.nameDe : letter.nameTr,
          speed,
          presentation: 'activity',
        });
      }, 500);
    }

    return () => {
      clearTimeout(audioTimer.current);
      stopCurrentAudio();
    };
  }, [index, done, mode, de, speed]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(wrongTimerRef.current);
      clearTimeout(advanceTimerRef.current);
      clearTimeout(audioTimer.current);
      stopCurrentAudio();
    };
  }, []);

  const handleRestart = () => {
    stopCurrentAudio();
    clearTimeout(audioTimer.current);
    clearTimeout(wrongTimerRef.current);
    clearTimeout(advanceTimerRef.current);
    finishReported.current = false;
    setIndex(0);
    setSelectedCorrect(null);
    setWrongOption(null);
    setIsResolved(false);
    setFirstTry(true);
    setScore(0);
    setDone(false);
    setSeconds(0);
    setConfetti(false);
    setTrainDeparting(false);
    setTrainArriving(false);
    setIsDragOver(false);

    if (mode === 'train') setQuestions(createTrainQuestions(Math.random, 6));
    else if (mode === 'chameleon') setQuestions(createChameleonQuestions(Math.random, 6));
    else if (mode === 'detective') setQuestions(createDetectiveQuestions(Math.random, 6));
    else if (mode === 'puzzle') setQuestions(createPuzzleQuestions(Math.random, 6));
  };

  const handleChoose = option => {
    if (isResolved || wrongOption) return;

    let isCorrect = false;
    let optKey = option;
    if (mode === 'detective') {
      optKey = option.id || option;
      isCorrect = optKey === currentQ.correctId;
    } else {
      isCorrect = option === currentQ.correctForm;
    }

    if (isCorrect) {
      // Correct!
      setIsResolved(true);
      setSelectedCorrect(optKey);
      setWrongOption(null);
      setConfetti(true);
      try {
        sfx.playCorrect();
      } catch (e) {}

      const letter = currentQ?.letter || currentQ?.baseLetter;
      if (letter?.audio) {
        try {
          playAudioFile(letter.audio, {
            label: de ? letter.nameDe : letter.nameTr,
            speed,
            presentation: 'activity',
          });
        } catch (e) {}
      }

      if (firstTry) {
        setScore(s => s + 1);
      }

      // If Train mode: Barrier opens immediately (via isOpen={isResolved}),
      // then train departs to the right after the barrier is fully raised!
      if (mode === 'train') {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = setTimeout(() => {
          setTrainDeparting(true);
          // After departing animation (1.25s), advance to next question
          advanceTimerRef.current = setTimeout(() => {
            handleAutoAdvance();
          }, 1250);
        }, 700);
      }
    } else {
      // Wrong!
      // Do NOT reveal the correct answer!
      // Highlight the wrong choice for 1s, then reset
      setWrongOption(optKey);
      setFirstTry(false);
      try {
        sfx.playTryAgain();
      } catch (e) {}

      clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => {
        setWrongOption(null);
      }, 1000);
    }
  };

  const handleAutoAdvance = () => {
    setConfetti(false);
    if (index + 1 < total) {
      setIndex(i => i + 1);
      setSelectedCorrect(null);
      setWrongOption(null);
      setIsResolved(false);
      setFirstTry(true);
      setTrainDeparting(false);
      setTrainArriving(true);
      setTimeout(() => setTrainArriving(false), 950);
    } else {
      setDone(true);
      sfx.playSuccess();
      if (!finishReported.current) {
        finishReported.current = true;
        onFinish?.({ correct: score + (firstTry ? 1 : 0), total });
      }
    }
  };

  const handleNextClick = () => {
    clearTimeout(advanceTimerRef.current);
    if (mode === 'train' && !trainDeparting) {
      setTrainDeparting(true);
      setTimeout(() => {
        handleAutoAdvance();
      }, 900);
    } else {
      handleAutoAdvance();
    }
  };

  const playLetterAudio = () => {
    const letter = currentQ?.letter || currentQ?.baseLetter;
    if (letter?.audio) {
      playAudioFile(letter.audio, {
        label: de ? letter.nameDe : letter.nameTr,
        speed,
        presentation: 'activity',
      });
    }
  };

  // Drag & drop handlers for desktop mouse
  const handleDragStart = (e, opt) => {
    if (isResolved || wrongOption) return;
    const val = typeof opt === 'object' ? opt.id : opt;
    e.dataTransfer.setData('text/plain', val);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingOption(val);
  };

  const handleDragEnd = () => {
    setDraggingOption(null);
    setIsDragOver(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    if (isResolved) return;
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    if (isResolved) return;
    const val = e.dataTransfer.getData('text/plain');
    if (val) {
      handleChoose(val);
    }
  };

  // Touch drag & drop support for mobile and tablets
  const handleTouchStart = (e, opt) => {
    if (isResolved || wrongOption) return;
    const touch = e.touches[0];
    const val = typeof opt === 'object' ? opt.id : opt;
    touchStartRef.current = {
      val,
      startX: touch.clientX,
      startY: touch.clientY,
      hasMoved: false,
    };
  };

  const handleTouchMove = e => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.startX);
    const dy = Math.abs(touch.clientY - touchStartRef.current.startY);
    if (dx > 10 || dy > 10) {
      touchStartRef.current.hasMoved = true;
    }
    // Check if hovering over drop target
    if (dropTargetRef.current) {
      const rect = dropTargetRef.current.getBoundingClientRect();
      const isInside =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;
      setIsDragOver(isInside);
    }
  };

  const handleTouchEnd = e => {
    if (!touchStartRef.current) return;
    const { val, hasMoved } = touchStartRef.current;
    touchStartRef.current = null;
    setIsDragOver(false);

    const touch = e.changedTouches[0];
    if (hasMoved && dropTargetRef.current) {
      const rect = dropTargetRef.current.getBoundingClientRect();
      const isInside =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;
      if (isInside) {
        handleChoose(val);
        return;
      }
    }

    // If tapped without dragging, onClick handles it
  };

  if (!currentQ || done) {
    return (
      <div className="position-workshop activity-game-frame">
        <div className="all-letters-congrats">
          <div className="congrats-trophy-badge">
            <Trophy size={32} />
          </div>
          <h2>{de ? 'Großartig gemacht!' : 'Harika Başardın!'}</h2>
          <div className="all-letters-completion-time">
            <Timer size={16} />
            <span>{de ? `Zeit: ${formatTimer(seconds)}` : `Süre: ${formatTimer(seconds)}`}</span>
          </div>
          <p>
            {de
              ? `Du hast ${score} von ${total} Sternen gesammelt!`
              : `${total} sorudan ${score} yıldız topladın!`}{' '}
            {de
              ? 'Die Buchstabenformen sitzen jetzt viel besser!'
              : 'Harflerin başta, ortada ve sonda yazılışlarını harika kavradın!'}
          </p>
          <div className="activity-actions" style={{ marginTop: '16px', justifyContent: 'center' }}>
            <button className="activity-btn activity-primary" onClick={handleRestart}>
              <RotateCcw size={17} /> {de ? 'Nochmal spielen' : 'Yeniden Oyna'}
            </button>
            <button className="activity-btn" onClick={onBack}>
              <ArrowLeft size={17} /> {de ? 'Zu den Aktivitäten' : 'Etkinlikler'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="position-workshop activity-game-frame">
      {/* Top Toolbar */}
      <div className="all-letters-top-bar">
        <div className="all-letters-top-left">
          <button className="activity-btn" onClick={onBack} aria-label={de ? 'Zurück' : 'Geri'}>
            <ArrowLeft size={17} />
            <span>{de ? 'Aktivitäten' : 'Etkinlikler'}</span>
          </button>
          <h3 className="all-letters-title">
            {mode === 'train' && (de ? 'Buchstaben-Zug' : 'Harf Treni')}
            {mode === 'chameleon' && (de ? 'Buchstaben-Chamäleon' : 'Harf Bukalemunu')}
            {mode === 'detective' && (de ? 'Formen-Detektiv' : 'Harf Dedektifi')}
            {mode === 'puzzle' && (de ? 'Buchstaben-Puzzle' : 'Eksik Parçayı Tamamla')}
          </h3>
        </div>
        <div className="all-letters-top-right">
          <span className="activity-timer-badge">
            <Timer size={14} />
            <span>{formatTimer(seconds)}</span>
          </span>
          <span className="all-letters-counter">
            <Star size={14} fill="currentColor" style={{ color: 'var(--play-pop)' }} /> {score} / {total}
          </span>
          <button className="activity-btn" onClick={handleRestart} aria-label={de ? 'Neu starten' : 'Yeniden başlat'}>
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="position-workspace">
        {/* MODE 1: HARF TRENİ (TRAIN WAGON GAME) */}
        {mode === 'train' && (
          <div className="train-game-container">
            <div className="train-instruction">
              <div className="train-header-row">
                <span className="train-badge">
                  {currentQ.letter.char}
                </span>
                <button
                  className="activity-btn"
                  onClick={playLetterAudio}
                  style={{ padding: '3px 9px', minHeight: '28px', fontSize: '12px' }}
                >
                  <Volume2 size={14} /> {de ? 'Hören' : 'Dinle'}
                </button>
              </div>
              <p className="train-instruction-text">
                {de
                  ? `Ziehe das Kärtchen für die [${POSITION_META[currentQ.missingPos]?.de}] auf den Waggon oder klicke es an!`
                  : `[${POSITION_META[currentQ.missingPos]?.tr}] yazılış kartını vagonun üzerine taşı veya tıkla!`}
              </p>
            </div>

            {/* Continuous Train Track & Full Train Scene */}
            <div className="train-track-wrap">
              {/* Railroad track running under all wheels across full width */}
              <div className="train-track-ties" aria-hidden="true">
                <div className="train-track-rail top-rail"></div>
                <div className="train-track-sleepers"></div>
                <div className="train-track-rail bot-rail"></div>
              </div>

              {/* Train Track Stage: Train + Crossing Barrier */}
              <div className="train-track-scene">
                {/* Connected Train (RTL: Locomotive on RIGHT, pulling wagons to the left) */}
                <div
                  className={`train-composition rtl-flow ${trainDeparting ? 'is-departing' : ''} ${
                    trainArriving ? 'is-arriving' : ''
                  }`}
                >
                  {/* 1. RIGHT FRONT: THE LOCOMOTIVE (Baş kısım önde ve bağlı) */}
                  <TrainLocomotive isDeparting={trainDeparting} />

                {/* Coupler hitch */}
                <div className="train-coupler-chain" aria-hidden="true">
                  <span></span>
                </div>

                {/* 2. FIRST WAGON: BAŞTA (Anfangsform) */}
                <div
                  className={`train-wagon-car ${
                    currentQ.missingPos === 'initial' ? 'is-target-wagon' : ''
                  } ${currentQ.missingPos === 'initial' && isResolved ? 'is-wagon-filled' : ''} ${
                    currentQ.missingPos === 'initial' && isDragOver ? 'is-drag-hover' : ''
                  }`}
                  ref={currentQ.missingPos === 'initial' ? dropTargetRef : null}
                  onDragOver={currentQ.missingPos === 'initial' ? handleDragOver : undefined}
                  onDragLeave={currentQ.missingPos === 'initial' ? handleDragLeave : undefined}
                  onDrop={currentQ.missingPos === 'initial' ? handleDrop : undefined}
                >
                  {/* Roof position tag */}
                  <div className="wagon-roof-tag">
                    <span>{de ? 'Başta' : 'Başta'}</span>
                  </div>

                  {/* CARGO: Letter Card sitting ON TOP of the wagon flatbed */}
                  <div className="wagon-cargo-bed">
                    {currentQ.missingPos === 'initial' ? (
                      isResolved ? (
                        <div className="wagon-cargo-card is-solved-card">
                          <span className="activity-glyph">{currentQ.correctForm}</span>
                          {confetti && <CardConfetti />}
                        </div>
                      ) : (
                        <div className="wagon-cargo-slot">
                          <span className="wagon-slot-q">?</span>
                          <small className="wagon-slot-label">{de ? 'Hier ablegen' : 'Buraya bırak'}</small>
                        </div>
                      )
                    ) : (
                      <div className="wagon-cargo-card">
                        <span className="activity-glyph">{currentQ.wagons.initial}</span>
                      </div>
                    )}
                  </div>

                  {/* Wagon Chassis / Flatbed Platform */}
                  <div className="wagon-chassis">
                    <div className="wagon-flatbed-beam"></div>
                    <div className="wagon-wheels-truck">
                      <span className="wagon-wheel"></span>
                      <span className="wagon-wheel"></span>
                    </div>
                  </div>
                </div>

                {/* Coupler hitch */}
                <div className="train-coupler-chain" aria-hidden="true">
                  <span></span>
                </div>

                {/* 3. SECOND WAGON: ORTADA (Mittelform) */}
                <div
                  className={`train-wagon-car ${
                    currentQ.missingPos === 'medial' ? 'is-target-wagon' : ''
                  } ${currentQ.missingPos === 'medial' && isResolved ? 'is-wagon-filled' : ''} ${
                    currentQ.missingPos === 'medial' && isDragOver ? 'is-drag-hover' : ''
                  }`}
                  ref={currentQ.missingPos === 'medial' ? dropTargetRef : null}
                  onDragOver={currentQ.missingPos === 'medial' ? handleDragOver : undefined}
                  onDragLeave={currentQ.missingPos === 'medial' ? handleDragLeave : undefined}
                  onDrop={currentQ.missingPos === 'medial' ? handleDrop : undefined}
                >
                  <div className="wagon-roof-tag">
                    <span>{de ? 'Ortada' : 'Ortada'}</span>
                  </div>

                  <div className="wagon-cargo-bed">
                    {currentQ.missingPos === 'medial' ? (
                      isResolved ? (
                        <div className="wagon-cargo-card is-solved-card">
                          <span className="activity-glyph">{currentQ.correctForm}</span>
                          {confetti && <CardConfetti />}
                        </div>
                      ) : (
                        <div className="wagon-cargo-slot">
                          <span className="wagon-slot-q">?</span>
                          <small className="wagon-slot-label">{de ? 'Hier ablegen' : 'Buraya bırak'}</small>
                        </div>
                      )
                    ) : (
                      <div className="wagon-cargo-card">
                        <span className="activity-glyph">{currentQ.wagons.medial}</span>
                      </div>
                    )}
                  </div>

                  <div className="wagon-chassis">
                    <div className="wagon-flatbed-beam"></div>
                    <div className="wagon-wheels-truck">
                      <span className="wagon-wheel"></span>
                      <span className="wagon-wheel"></span>
                    </div>
                  </div>
                </div>

                {/* Coupler hitch */}
                <div className="train-coupler-chain" aria-hidden="true">
                  <span></span>
                </div>

                {/* 4. THIRD WAGON: SONDA (Endform) */}
                <div
                  className={`train-wagon-car ${
                    currentQ.missingPos === 'final' ? 'is-target-wagon' : ''
                  } ${currentQ.missingPos === 'final' && isResolved ? 'is-wagon-filled' : ''} ${
                    currentQ.missingPos === 'final' && isDragOver ? 'is-drag-hover' : ''
                  }`}
                  ref={currentQ.missingPos === 'final' ? dropTargetRef : null}
                  onDragOver={currentQ.missingPos === 'final' ? handleDragOver : undefined}
                  onDragLeave={currentQ.missingPos === 'final' ? handleDragLeave : undefined}
                  onDrop={currentQ.missingPos === 'final' ? handleDrop : undefined}
                >
                  <div className="wagon-roof-tag">
                    <span>{de ? 'Sonda' : 'Sonda'}</span>
                  </div>

                  <div className="wagon-cargo-bed">
                    {currentQ.missingPos === 'final' ? (
                      isResolved ? (
                        <div className="wagon-cargo-card is-solved-card">
                          <span className="activity-glyph">{currentQ.correctForm}</span>
                          {confetti && <CardConfetti />}
                        </div>
                      ) : (
                        <div className="wagon-cargo-slot">
                          <span className="wagon-slot-q">?</span>
                          <small className="wagon-slot-label">{de ? 'Hier ablegen' : 'Buraya bırak'}</small>
                        </div>
                      )
                    ) : (
                      <div className="wagon-cargo-card">
                        <span className="activity-glyph">{currentQ.wagons.final}</span>
                      </div>
                    )}
                  </div>

                  <div className="wagon-chassis">
                    <div className="wagon-flatbed-beam"></div>
                    <div className="wagon-wheels-truck">
                      <span className="wagon-wheel"></span>
                      <span className="wagon-wheel"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Railway Crossing Barrier placed in front of the locomotive (on the right) */}
              <RailwayBarrier isOpen={isResolved} />
            </div>
          </div>

            {/* Draggable & Clickable Option Cards */}
            <div className="position-options-grid">
              {currentQ.options.map((opt, i) => {
                const isThisWrong = wrongOption === opt;
                const isThisCorrect = isResolved && selectedCorrect === opt;
                let btnCls = 'activity-letter position-option-card draggable-card';
                if (isThisCorrect) btnCls += ' is-correct';
                else if (isThisWrong) btnCls += ' is-incorrect shake-wrong';

                return (
                  <button
                    key={i}
                    className={btnCls}
                    disabled={isResolved || wrongOption !== null}
                    onClick={() => handleChoose(opt)}
                    draggable={!isResolved && wrongOption === null}
                    onDragStart={e => handleDragStart(e, opt)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={e => handleTouchStart(e, opt)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    aria-label={`Harf seçeneği: ${opt}`}
                  >
                    <span className="activity-glyph">{opt}</span>
                    {isThisCorrect && (
                      <span className="answer-check">
                        <Check size={16} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 2: HARF BUKALEMUNU (4 HALİ TAMAMLA) */}
        {mode === 'chameleon' && (
          <div className="chameleon-game-container">
            <div className="chameleon-prompt">
              <div className="chameleon-header-badge">
                <span className="chameleon-badge-icon">🦎</span>
                <div>
                  <strong>
                    {currentQ.letter.char}
                  </strong>
                  <p>
                    {de
                      ? `Ziehe das [${POSITION_META[currentQ.targetPos]?.de}]-Kärtchen in das leere Fach oder klicke es an!`
                      : `[${POSITION_META[currentQ.targetPos]?.tr}] kıyafetini boş yuvaya taşı veya tıkla!`}
                  </p>
                </div>
                <button
                  className="activity-btn"
                  onClick={playLetterAudio}
                  style={{ marginLeft: 'auto', padding: '6px 12px' }}
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>

            {/* 4-Forms Wardrobe (RTL: Yalnız -> Başta -> Ortada -> Sonda) */}
            <div className="chameleon-wardrobe rtl-flow">
              {['isolated', 'initial', 'medial', 'final'].map(pos => {
                const isTarget = pos === currentQ.targetPos;
                const meta = POSITION_META[pos];
                const isTargetSolved = isTarget && isResolved;

                return (
                  <div
                    key={pos}
                    className={`chameleon-slot ${isTarget ? 'is-target' : 'is-revealed'} ${
                      isTargetSolved ? 'is-matched-slot' : ''
                    } ${isTarget && isDragOver ? 'is-drag-hover' : ''} ${
                      isTarget && wrongOption ? 'shake-slot-wrong' : ''
                    }`}
                    ref={isTarget ? dropTargetRef : null}
                    onDragOver={isTarget ? handleDragOver : undefined}
                    onDragLeave={isTarget ? handleDragLeave : undefined}
                    onDrop={isTarget ? handleDrop : undefined}
                  >
                    <span className="chameleon-slot-label">
                      {meta.icon} {meta[lang] || meta.tr}
                    </span>
                    <div className="chameleon-slot-display">
                      {isTarget ? (
                        isTargetSolved ? (
                          <span className="activity-glyph">{currentQ.correctForm}</span>
                        ) : (
                          <div className="chameleon-drop-prompt">
                            <span className="chameleon-slot-placeholder">?</span>
                            <small>{de ? 'Hier ablegen' : 'Buraya bırak'}</small>
                          </div>
                        )
                      ) : (
                        <span className="activity-glyph">{currentQ.forms[pos]}</span>
                      )}
                      {confetti && isTarget && <CardConfetti />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Draggable & Clickable Options */}
            <div className="position-options-grid">
              {currentQ.options.map((opt, i) => {
                const isThisWrong = wrongOption === opt;
                const isThisCorrect = isResolved && selectedCorrect === opt;
                let btnCls = 'activity-letter position-option-card draggable-card';
                if (isThisCorrect) btnCls += ' is-correct';
                else if (isThisWrong) btnCls += ' is-incorrect shake-wrong';

                return (
                  <button
                    key={i}
                    className={btnCls}
                    disabled={isResolved || wrongOption !== null}
                    onClick={() => handleChoose(opt)}
                    draggable={!isResolved && wrongOption === null}
                    onDragStart={e => handleDragStart(e, opt)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={e => handleTouchStart(e, opt)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    aria-label={`Bukalemun kıyafeti: ${opt}`}
                  >
                    <span className="activity-glyph">{opt}</span>
                    {isThisCorrect && (
                      <span className="answer-check">
                        <Check size={16} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 3: HARF DEDEKTİFİ (POZİSYONU BUL) */}
        {mode === 'detective' && (
          <div className="detective-game-container">
            <div className="detective-clue-card">
              <div className="detective-badge-top">
                🔍 {de ? 'Dedektiv-Aufgabe: Wo steht dieser Buchstabe?' : 'Dedektif Görevi: Bu harf nerede duruyor?'}
              </div>
              <div className="detective-lens-row">
                <div className="detective-lens">
                  <span className="activity-glyph detective-glyph">{currentQ.displayedGlyph}</span>
                  {confetti && <CardConfetti />}
                </div>
                <button
                  className="activity-btn detective-audio-btn"
                  onClick={playLetterAudio}
                  aria-label={de ? 'Aussprache anhören' : 'Harfin sesini dinle'}
                  title={de ? 'Aussprache anhören' : 'Harfin sesini dinle'}
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>

            {/* 4 Position Buttons */}
            <div className="detective-buttons-grid">
              {currentQ.options.map(opt => {
                const isThisWrong = wrongOption === opt.id;
                const isThisCorrect = isResolved && selectedCorrect === opt.id;
                let btnCls = 'detective-pos-btn';
                if (isThisCorrect) btnCls += ' is-correct';
                else if (isThisWrong) btnCls += ' is-incorrect shake-wrong';

                const meta = POSITION_META[opt.id];
                return (
                  <button
                    key={opt.id}
                    className={btnCls}
                    disabled={isResolved || wrongOption !== null}
                    onClick={() => handleChoose(opt)}
                  >
                    <span className="detective-btn-icon">{meta.icon}</span>
                    <strong className="detective-btn-title">{opt[lang] || opt.tr}</strong>
                    <span className="detective-btn-sub">{opt.subtitle}</span>
                    {isThisCorrect && (
                      <span className="answer-check">
                        <Check size={16} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 4: EKSİK PARÇAYI TAMAMLA (HARF YAPBOZU) */}
        {mode === 'puzzle' && (
          <div className="puzzle-game-container">
            <div className="puzzle-word-card">
              <div className="puzzle-word-header">
                🧩{' '}
                <span>
                  {de ? 'Vervollständige das Wort:' : 'Kelime yapbozunu tamamla:'}{' '}
                  <strong>{currentQ.wordItem.word}</strong> ({de ? currentQ.wordItem.meaningDe : currentQ.wordItem.meaningTr})
                </span>
              </div>

              {/* Connected Word Slots (RTL) */}
              <div
                className="puzzle-word-slots rtl-flow"
                ref={dropTargetRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {currentQ.wordItem.letters.map((slot, i) => {
                  const isMissing = i === currentQ.missingIndex;
                  return (
                    <div
                      key={i}
                      className={`puzzle-slot ${isMissing ? 'is-missing-slot' : ''} ${
                        isMissing && isResolved ? 'is-solved' : ''
                      } ${isMissing && isDragOver ? 'is-drag-hover' : ''}`}
                    >
                      <span className="puzzle-slot-role">{POSITION_META[slot.pos]?.[lang] || POSITION_META[slot.pos]?.tr}</span>
                      <div className="puzzle-slot-content">
                        {isMissing ? (
                          isResolved ? (
                            <span className="activity-glyph">{currentQ.correctForm}</span>
                          ) : (
                            <div className="puzzle-missing-mark">?</div>
                          )
                        ) : (
                          <span className="activity-glyph">{slot.form}</span>
                        )}
                        {confetti && isMissing && <CardConfetti />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Puzzle Options */}
            <div className="position-options-grid">
              {currentQ.options.map((opt, i) => {
                const isThisWrong = wrongOption === opt;
                const isThisCorrect = isResolved && selectedCorrect === opt;
                let btnCls = 'activity-letter position-option-card draggable-card';
                if (isThisCorrect) btnCls += ' is-correct';
                else if (isThisWrong) btnCls += ' is-incorrect shake-wrong';

                return (
                  <button
                    key={i}
                    className={btnCls}
                    disabled={isResolved || wrongOption !== null}
                    onClick={() => handleChoose(opt)}
                    draggable={!isResolved && wrongOption === null}
                    onDragStart={e => handleDragStart(e, opt)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={e => handleTouchStart(e, opt)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    aria-label={`Yapboz parçası: ${opt}`}
                  >
                    <span className="activity-glyph">{opt}</span>
                    {isThisCorrect && (
                      <span className="answer-check">
                        <Check size={16} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Feedback Area */}
      <Feedback
        tone={isResolved ? 'match' : (!firstTry || wrongOption) ? 'encourage' : 'ready'}
        reward={score}
        title={
          isResolved
            ? mode === 'train'
              ? de
                ? 'Super! Der Zug fährt ab!'
                : 'Tebrikler! Vagon bağlandı, tren kalkıyor!'
              : de
              ? 'Ausgezeichnet!'
              : 'Tebrikler, Tam İsabet!'
            : !firstTry || wrongOption
            ? de
              ? 'Schau noch einmal genau hin!'
              : 'Tekrar dene, harfin kollarına dikkat et!'
            : de
            ? 'Wähle oder ziehe die passende Form!'
            : 'Uygun parçayı seç veya sürükleyip yuvaya bırak!'
        }
        detail={
          isResolved
            ? mode === 'train'
              ? de
                ? 'Gleich kommt der nächste Zug angefahren.'
                : 'Tren hareket ediyor, birazdan yeni vagonlar gelecek.'
              : de
              ? 'Toll gemacht! Drücke auf Weiter für die nächste Frage.'
              : 'Harika yerleşti! Sıradaki soruya geçebilirsin.'
            : wrongOption
            ? de
              ? 'Diese Form passt hier nicht. Versuche es gleich noch einmal!'
              : 'Bu şekil buraya uymadı. Şimdi tekrar deneyebilirsin!'
            : !firstTry
            ? de
              ? 'Versuche es noch einmal, du schaffst das!'
              : 'Şimdi tekrar deneyebilirsin! Doğru şekli bulana kadar dene.'
            : de
            ? 'Kärtchen anklicken oder mit dem Finger auf das leere Feld ziehen.'
            : 'Karta dokunabilir ya da parmağınla tutup yuvaya bırakabilirsin.'
        }
      >
        {isResolved && (
          <button className="activity-btn activity-primary" onClick={handleNextClick}>
            {de ? 'Weiter' : 'Sonraki'}
          </button>
        )}
      </Feedback>
    </div>
  );
}
