import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ArrowRight, Check, Eraser, RotateCcw, Volume2 } from 'lucide-react';
import { createMiniLesson } from '../../data/bookActivities';
import { LETTERS, letterName } from '../../data/alphabetData';
import { activityRoundReducer, newActivityRound } from '../../utils/activityRound';
import { playAudioFile, stopCurrentAudio, sfx } from '../../utils/audioPlayer';
import { drawCalligraphicPath, evaluateDrawing } from '../../utils/drawingEvaluation';
import { Buddy, Feedback, Finish, Glyph } from './ActivityPrimitives';
import AllLettersBoard from './AllLettersBoard';

function DrawingPad({ letter, lang, onDrawnChange, onEvalResult, resetKey }) {
  const canvasRef = useRef(null), guideRef = useRef(null), paths = useRef([]), current = useRef(null);
  const [paper, setPaper] = useState(false);
  const [evalState, setEvalState] = useState(null);
  const de = lang === 'de';

  const render = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (!rect.width || !rect.height) return;
    const w = Math.round(rect.width * ratio), h = Math.round(rect.height * ratio);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const inkColor = getComputedStyle(canvas).color || '#1e382b';
    const nibSize = Math.max(7, Math.round(rect.width * 0.022));
    const allStrokes = [...paths.current, ...(current.current ? [current.current.points] : [])];

    for (const stroke of allStrokes) {
      if (!stroke || stroke.length === 0) continue;
      const points = stroke.map(([nx, ny]) => [nx * rect.width, ny * rect.height]);
      drawCalligraphicPath(ctx, points, inkColor, nibSize, -0.65);
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(render);
    if (canvasRef.current) observer.observe(canvasRef.current);
    render();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    paths.current = [];
    current.current = null;
    setPaper(false);
    setEvalState(null);
    onDrawnChange(false);
    onEvalResult(null);
    render();
  }, [resetKey, letter.id]);

  const clear = () => {
    paths.current = [];
    current.current = null;
    setEvalState(null);
    onDrawnChange(paper);
    onEvalResult(paper ? { correct: true, paper: true } : null);
    render();
  };

  const point = e => {
    const r = e.currentTarget.getBoundingClientRect();
    return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))];
  };

  const start = e => {
    if (e.button !== 0 || current.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    current.current = { id: e.pointerId, points: [point(e)] };
    render();
  };

  const move = e => {
    if (current.current?.id !== e.pointerId) return;
    current.current.points.push(point(e));
    render();
  };

  const end = e => {
    if (current.current?.id !== e.pointerId) return;
    paths.current.push(current.current.points);
    current.current = null;
    onDrawnChange(true);

    const rect = canvasRef.current?.getBoundingClientRect();
    const guideFont = guideRef.current ? window.getComputedStyle(guideRef.current).font : '';
    const res = evaluateDrawing(letter.char, paths.current, rect?.width || 400, rect?.height || 300, guideFont);
    setEvalState(res);
    onEvalResult(res);
    render();
  };

  const handlePaperToggle = checked => {
    setPaper(checked);
    onDrawnChange(checked || paths.current.length > 0);
    if (checked) {
      const res = { correct: true, score: 100, paper: true };
      setEvalState(res);
      onEvalResult(res);
    } else {
      const rect = canvasRef.current?.getBoundingClientRect();
      const guideFont = guideRef.current ? window.getComputedStyle(guideRef.current).font : '';
      const res = paths.current.length > 0 ? evaluateDrawing(letter.char, paths.current, rect?.width || 400, rect?.height || 300, guideFont) : null;
      setEvalState(res);
      onEvalResult(res);
    }
  };

  const borderClass = evalState?.correct ? 'is-drawing-correct' : evalState?.correct === false ? 'is-drawing-wrong' : '';

  return (
    <div className="activity-drawing">
      <div className={`activity-canvas-wrap ${borderClass}`}>
        <span ref={guideRef} className="activity-trace-guide" lang="ar" dir="rtl" aria-hidden="true">{letter.char}</span>
        <canvas
          ref={canvasRef}
          aria-label={de ? 'Freies Zeichenfeld mit Kaligraphiefeder' : 'Arapça kaligrafik fırçalı serbest çizim alanı'}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onLostPointerCapture={end}
        />
      </div>
      <div className="activity-pencil-tools">
        <button className="activity-btn" onClick={clear}>
          <Eraser size={16} />{de ? 'Löschen' : 'Temizle'}
        </button>
        <label>
          <input
            type="checkbox"
            checked={paper}
            onChange={e => handlePaperToggle(e.target.checked)}
          />
          {de ? 'Auf Papier gezeichnet' : 'Kâğıtta çizdim'}
        </label>
      </div>
    </div>
  );
}

export default function LetterWorkshop({ page, targetId, lang, speed, onFinish, onBack, onReplay, onNextLetter }) {
  const de = lang === 'de';
  const resolvedTarget = (typeof targetId === 'number' && LETTERS.some(l => l.id === targetId))
    ? targetId
    : LETTERS[Math.floor(Math.random() * LETTERS.length)].id;

  const [q] = useState(() => createMiniLesson(page, resolvedTarget)[2] || { letter: LETTERS[0], options: LETTERS.slice(0, 4) });
  const letter = q.letter;

  const [tab, setTab] = useState(targetId === 'all' ? 'all' : 'listen');
  const [heard, setHeard] = useState(false);
  const [error, setError] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [drawChecked, setDrawChecked] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [done, setDone] = useState(false);
  const [answer, dispatch] = useReducer(activityRoundReducer, undefined, newActivityRound);

  const token = useRef(0);
  const finished = useRef(false);
  const heading = useRef(null);
  const autoAudioTimer = useRef(null);

  const right = answer.checked && answer.selected === letter.id;
  const wrong = answer.checked && !right;

  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [tab]);

  useEffect(() => () => {
    token.current++;
    stopCurrentAudio();
    if (autoAudioTimer.current) clearTimeout(autoAudioTimer.current);
  }, []);

  const listen = () => {
    if (autoAudioTimer.current) clearTimeout(autoAudioTimer.current);
    const id = ++token.current;
    setError(false);
    const audio = playAudioFile(letter.audio, {
      label: letterName(letter, lang),
      speed,
      presentation: 'activity',
      onError: () => {
        if (token.current === id) { setError(true); setHeard(false); }
      },
    });
    audio?.addEventListener('playing', () => {
      if (token.current === id) setHeard(true);
    }, { once: true });
  };

  // Auto-play audio exactly 1 second after entering listen tab
  useEffect(() => {
    if (tab === 'listen' && !heard) {
      autoAudioTimer.current = setTimeout(() => {
        listen();
      }, 1000);
      return () => {
        if (autoAudioTimer.current) clearTimeout(autoAudioTimer.current);
      };
    }
  }, [tab, heard, letter.id]);

  const changeTab = next => {
    token.current++;
    stopCurrentAudio();
    setError(false);
    setTab(next);
  };

  const handleDrawnChange = useCallback(value => {
    setDrawn(value);
    if (!value) {
      setEvalResult(null);
      setDrawChecked(false);
    }
  }, []);

  const handleEvalResult = useCallback(res => {
    setEvalResult(res);
  }, []);

  const chooseOption = id => {
    if (right) return;
    dispatch({ type: 'selectAndCheck', id, target: letter.id });
    if (id === letter.id) sfx.playStar();
  };

  const act = () => {
    if (tab === 'listen') {
      if (heard) changeTab('trace');
      return;
    }
    if (tab === 'trace') {
      if (!drawn) return;
      if (!drawChecked) {
        setDrawChecked(true);
        if (evalResult?.correct) {
          sfx.playStar();
        }
        return;
      }
      if (evalResult?.correct) {
        changeTab('find');
        return;
      }
      setResetKey(k => k + 1);
      setDrawn(false);
      setEvalResult(null);
      setDrawChecked(false);
      return;
    }
    if (wrong) {
      dispatch({ type: 'retry', target: letter.id });
      return;
    }
    if (!answer.checked) {
      if (answer.selected === null) return;
      dispatch({ type: 'check', target: letter.id });
      if (answer.selected === letter.id) sfx.playStar();
      return;
    }
    if (!finished.current) {
      finished.current = true;
      onFinish({ correct: answer.correct, total: 1 });
      sfx.playSuccess();
      setDone(true);
    }
  };

  if (tab === 'all') {
    return (
      <div className="activity-workshop-all">
        <nav className="activity-stations" style={{ marginBottom: 12 }} aria-label={de ? 'Werkstattschritte' : 'Atölye adımları'}>
          <button className="activity-btn" onClick={() => changeTab('listen')}>{de ? '← Zurück zur Werkstatt' : '← Atölyeye Dön'}</button>
        </nav>
        <AllLettersBoard lang={lang} speed={speed} onBack={() => changeTab('listen')} />
      </div>
    );
  }

  if (done) {
    return <Finish lang={lang} correct={answer.correct} total={1} writing onBack={onBack} onReplay={onReplay} onNextLetter={onNextLetter} />;
  }

  const tabs = [
    { id: 'listen', tr: 'Dinle', de: 'Hören' },
    { id: 'trace', tr: 'Çiz', de: 'Zeichnen' },
    { id: 'find', tr: 'Bul', de: 'Finden' },
    { id: 'all', tr: 'Bütün Harfler', de: 'Alle Buchstaben' },
  ];

  const allowTrace = heard;
  const allowFind = heard && drawChecked && evalResult?.correct;

  const isDrawingCorrect = drawChecked && evalResult?.correct;
  const isDrawingWrong = drawChecked && evalResult && !evalResult.correct;

  const traceFeedbackTitle = !drawn
    ? (de ? 'Probiere es in Ruhe.' : 'Şekli kaligrafik fırçayla izle.')
    : isDrawingCorrect
    ? (de ? 'Super gezeichnet!' : 'Harika çizdin! Tebrikler!')
    : isDrawingWrong
    ? (de ? 'Schöner Versuch!' : 'Güzel deneme! Biraz daha tamamlayalım.')
    : (de ? 'Zeichnung prüfen.' : 'Çizimini kontrol et.');

  const traceFeedbackDetail = isDrawingCorrect
    ? (de ? 'Sehr schön! Du hast die Buchstabenform toll getroffen.' : 'Harika çizdin! Harfin şeklini ve hatlarını çok güzel tamamladın.')
    : isDrawingWrong
    ? (evalResult?.reason === 'incomplete'
      ? (de ? 'Zeichne noch etwas weiter, um die Form zu vervollständigen.' : 'Harfin çizgilerini biraz daha takip edip tamamlamayı dene.')
      : (de ? 'Versuche, noch etwas näher an der Vorlage zu bleiben.' : 'Örnek çizginin üzerinden geçerek harfi tamamlamayı dene.'))
    : (de ? 'Prüfe deine Zeichnung mit dem Button unten.' : 'Çizimini tamamladıktan sonra Kontrol Et butonuna dokun.');

  const buttonLabel = tab === 'listen'
    ? (de ? 'JETZT ZEICHNEN' : 'ÇİZMEYE GEÇ')
    : tab === 'trace'
    ? (isDrawingCorrect
      ? (de ? 'BUCHSTABEN FINDEN' : 'HARFİ BUL')
      : isDrawingWrong
      ? (de ? 'YENİDEN ÇİZ' : 'YENİDEN ÇİZ')
      : (de ? 'ÇİZİMİ KONTROL ET' : 'KONTROL ET'))
    : wrong
    ? (de ? 'NOCH EINMAL' : 'YENİDEN DENE')
    : right
    ? (de ? 'BİTİR' : 'BİTİR')
    : (de ? 'KONTROL ET' : 'KONTROL ET');

  return (
    <div className="activity-game-frame activity-workshop">
      <nav className="activity-stations" aria-label={de ? 'Werkstattschritte' : 'Atölye adımları'}>
        {tabs.map(t => (
          <button
            key={t.id}
            className="activity-btn"
            aria-pressed={tab === t.id}
            disabled={(t.id === 'trace' && !allowTrace) || (t.id === 'find' && !allowFind)}
            onClick={() => changeTab(t.id)}
          >
            {t[lang]}
          </button>
        ))}
      </nav>

      <div className="activity-workspace">
        <section className="activity-prompt">
          <Buddy happy={right || isDrawingCorrect} />
          <h3 ref={heading} tabIndex={-1}>
            {tab === 'listen'
              ? (de ? 'Höre den Buchstaben.' : 'Harfin adını dinle.')
              : tab === 'trace'
              ? (de ? 'Zeichne die Form nach.' : 'Şeklini kaligrafik fırçayla izle.')
              : (de ? 'Finde die gleiche Form.' : 'Şimdi aynı harfi bul.')}
          </h3>
          {tab === 'listen' ? (
            <>
              <div className="activity-target"><Glyph letter={letter} /></div>
              <button className="activity-btn activity-primary" onClick={listen}>
                <Volume2 size={20} />{de ? 'Anhören' : 'Dinle'} · {letterName(letter, lang)}
              </button>
            </>
          ) : (
            <span className="activity-prompt-hint">
              {tab === 'trace' ? letter.shape[lang] : (de ? 'Erinnere dich an deine Zeichnung.' : 'Çizdiğin şekli hatırla.')}
            </span>
          )}
          {error && <p className="activity-audio-error" role="alert">{de ? 'Bitte erneut anhören.' : 'Ses açılamadı, yeniden dokun.'}</p>}
        </section>

        <div className="activity-board">
          {tab === 'listen' ? (
            <div className="activity-listen-preview">
              <Glyph letter={letter} />
              <strong>{letterName(letter, lang)}</strong>
              <p>{letter.shape[lang]}</p>
            </div>
          ) : null}

          <div className="activity-drawing-slot" hidden={tab !== 'trace'}>
            <DrawingPad
              letter={letter}
              lang={lang}
              onDrawnChange={handleDrawnChange}
              onEvalResult={handleEvalResult}
              resetKey={resetKey}
            />
          </div>

          {tab === 'find' && (
            <div className="activity-options" dir="rtl" style={{ '--option-count': q.options.length }}>
              {q.options.map(l => (
                <button
                  key={l.id}
                  className={`activity-letter ${answer.selected === l.id ? 'is-selected' : ''} ${right && l.id === letter.id ? 'is-correct' : ''} ${wrong && answer.selected === l.id ? 'is-incorrect' : ''}`}
                  aria-label={letterName(l, lang)}
                  aria-pressed={answer.selected === l.id}
                  disabled={right}
                  onClick={() => chooseOption(l.id)}
                >
                  <Glyph letter={l} />
                  {right && l.id === letter.id && <Check className="answer-check" size={20} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Feedback
        tone={
          tab === 'trace'
            ? (isDrawingCorrect ? 'correct' : isDrawingWrong ? 'encourage' : 'ready')
            : tab === 'find' && right
            ? 'correct'
            : tab === 'find' && wrong
            ? 'encourage'
            : 'ready'
        }
        title={
          tab === 'trace'
            ? traceFeedbackTitle
            : tab === 'find'
            ? (right ? (de ? 'Super gefunden!' : 'Harika buldun!') : wrong ? (de ? 'Schauen wir noch einmal.' : 'Birlikte yeniden bakalım.') : (de ? 'Welche Form passt?' : 'Hangisi aynı harf?'))
            : (heard ? (de ? 'Gut zugehört!' : 'Güzel dinledin!') : (de ? 'Wir hören gemeinsam.' : 'Birlikte dinleyelim.'))
        }
        detail={
          tab === 'trace'
            ? traceFeedbackDetail
            : wrong
            ? letter.shape[lang]
            : tab === 'listen'
            ? (de ? 'Erst anhören, dann weiter.' : 'Önce kaydı dinle, sonra devam et.')
            : (de ? 'Wähle den richtigen Buchstaben.' : 'Doğru harfe dokun.')
        }
      >
        {!(tab === 'find' && !answer.checked) && (
          <button
            className="activity-btn activity-primary"
            disabled={tab === 'listen' ? !heard : tab === 'trace' ? !drawn : !answer.checked && answer.selected === null}
            onClick={act}
          >
            {buttonLabel}
            <ArrowRight size={17} />
          </button>
        )}
      </Feedback>
    </div>
  );
}
