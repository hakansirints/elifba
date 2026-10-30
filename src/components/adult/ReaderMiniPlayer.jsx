import React, { useLayoutEffect, useRef, useState } from 'react';
import { GripVertical, Play, Pause, X, RotateCcw, LocateFixed, Volume2, Video } from 'lucide-react';
import { playAudioFile, stopCurrentAudio, toggleCurrentAudio, seekCurrentAudio, setGlobalPlaybackSpeed } from '../../utils/audioPlayer';
import { clampPlayerPosition, placeReaderPlayer } from '../../utils/readerMedia';

const rectOf = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
const clock = value => `${Math.floor((value || 0) / 60)}:${String(Math.floor((value || 0) % 60)).padStart(2, '0')}`;

export default function ReaderMiniPlayer({ state, lang, onSpeedChange, theme, onOpenVideo }) {
  const de = lang === 'de', player = useRef(null), drag = useRef(null), manual = useRef(false), point = useRef({ x: 16, y: 90 });
  const [position, setPosition] = useState(point.current);
  const place = useRef(null);
  const updatePosition = next => { point.current = next; setPosition(next); };
  useLayoutEffect(() => {
    manual.current = false;
    const positionPlayer = () => {
      if (!player.current) return;
      const bookEl = document.querySelector('.reader-book'), stageEl = document.querySelector('.reader-stage');
      if (!bookEl || !stageEl) return;
      const book = rectOf(bookEl), stage = rectOf(stageEl), viewport = { width: innerWidth, height: innerHeight };
      const available = Math.max(book.x - stage.x - 32, viewport.width - book.x - book.width - 32);
      player.current.style.width = `${available >= 220 ? Math.min(264, available) : Math.min(300, innerWidth - 24)}px`;
      const size = { width: player.current.offsetWidth, height: player.current.offsetHeight };
      if (manual.current) { updatePosition(clampPlayerPosition(point.current, size, viewport)); return; }
      const sheet = [...document.querySelectorAll('.reader-sheet')].find(el => el.querySelector('img')?.alt.endsWith(` ${state.anchor?.page}`));
      const sr = sheet ? rectOf(sheet) : null, bounds = state.anchor?.bounds;
      const anchor = sr && bounds ? { x: sr.x + bounds.x * sr.width, y: sr.y + bounds.y * sr.height, width: bounds.width * sr.width, height: bounds.height * sr.height } : null;
      const obstacles = [...document.querySelectorAll('.reader-bottom,.reader-home,.reader-focus-toggle,.reader-sidebar,.reader-settings,.reader-edge')].map(el => ({ ...rectOf(el), kind: el.classList.contains('reader-bottom') ? 'dock' : 'control' })).filter(r => r.width && r.height);
      updatePosition(placeReaderPlayer({ viewport, size, stage, book, anchor, obstacles }));
    };
    let frame;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(positionPlayer); };
    place.current = () => { manual.current = false; positionPlayer(); };
    const observer = new ResizeObserver(schedule);
    for (const el of [player.current, document.querySelector('.reader-stage'), document.querySelector('.reader-book')]) if (el) observer.observe(el);
    const viewport = document.querySelector('.reader-viewport');
    viewport?.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    positionPlayer();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); viewport?.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [state.url, state.anchor]);

  const moveBy = (dx, dy) => {
    manual.current = true;
    updatePosition(clampPlayerPosition({ x: point.current.x + dx, y: point.current.y + dy }, { width: player.current.offsetWidth, height: player.current.offsetHeight }, { width: innerWidth, height: innerHeight }));
  };
  const startDrag = e => {
    if (e.button !== 0) return;
    manual.current = true;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, origin: { ...point.current } };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const moveDrag = e => {
    const d = drag.current; if (!d || d.id !== e.pointerId) return;
    updatePosition(clampPlayerPosition({ x: d.origin.x + e.clientX - d.x, y: d.origin.y + e.clientY - d.y }, { width: player.current.offsetWidth, height: player.current.offsetHeight }, { width: innerWidth, height: innerHeight }));
  };
  const label = state.status === 'error' ? (de ? 'Audio konnte nicht geladen werden' : 'Ses yüklenemedi') : state.status === 'loading' ? (de ? 'Audio wird geladen…' : 'Ses yükleniyor…') : state.label || (de ? 'Originalaufnahme' : 'Kaynak ses');
  const retry = () => playAudioFile(state.url, { label: state.label, speed: state.speed, presentation: state.presentation || 'reader', anchor: state.anchor, video: state.video });
  return <aside ref={player} className="reader-mini-player reader-glass" data-theme={theme} aria-label={de ? 'Verschiebbarer Audioplayer' : 'Taşınabilir ses oynatıcı'} style={{ left: position.x, top: position.y }}>
    <div className="mini-player-heading">
      <button className="mini-drag-handle" aria-label={de ? 'Player verschieben. Pfeiltasten bewegen den Player.' : 'Oynatıcıyı taşı. Ok tuşlarıyla da taşıyabilirsin.'} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onKeyDown={e => { if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); const step = e.shiftKey ? 48 : 16; moveBy(e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0, e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0); } }}><GripVertical size={17} /></button>
      <div className="mini-player-caption"><small><Volume2 size={11} />{de ? 'AUDIO' : 'SESLENDİRME'}</small><span role="status">{label}</span></div>
      {state.video && <button className="mini-glass-action" onClick={() => onOpenVideo?.(state.video)} aria-label={de ? 'Video öffnen' : 'Videoyu aç'}><Video size={15} /></button>}
      <button className="mini-glass-action" onClick={stopCurrentAudio} aria-label={de ? 'Wiedergabe beenden' : 'Oynatmayı bitir'}><X size={15} /></button>
    </div>
    <div className="mini-player-transport">
      <button className="mini-glass-action mini-play-toggle" disabled={state.status === 'loading'} onClick={state.status === 'error' ? retry : toggleCurrentAudio} aria-label={state.status === 'error' ? (de ? 'Erneut versuchen' : 'Tekrar dene') : state.status === 'paused' ? (de ? 'Fortsetzen' : 'Devam et') : (de ? 'Pausieren' : 'Duraklat')}>{state.status === 'error' ? <RotateCcw size={16} /> : state.status === 'paused' ? <Play size={16} /> : <Pause size={16} />}</button>
      <span className="mini-player-time">{clock(state.currentTime)} <span>/ {clock(state.duration)}</span></span>
      <select className="mini-speed mini-glass-action" aria-label={de ? 'Audiotempo' : 'Seslendirme hızı'} value={state.speed || 1} onChange={e => { const speed = Number(e.target.value); setGlobalPlaybackSpeed(speed); onSpeedChange?.(speed); }}>{[.5,.75,1,1.25,1.5,2].map(speed => <option key={speed} value={speed}>{speed}×</option>)}</select>
      <button className="mini-glass-action" onClick={() => place.current?.()} aria-label={de ? 'Freien Platz finden' : 'Boş alana yerleştir'}><LocateFixed size={15} /></button>
    </div>
    <input className="mini-audio-progress" type="range" min="0" max={state.duration || 1} step=".1" value={Math.min(state.currentTime || 0, state.duration || 1)} disabled={!state.duration} aria-label={de ? 'Wiedergabeposition' : 'Kayıtta ilerle'} onChange={e => seekCurrentAudio(Number(e.target.value))} />
  </aside>;
}
