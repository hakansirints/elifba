import React, { useLayoutEffect, useRef, useState } from 'react';
import { Play, Pause, X, RotateCcw, Video } from 'lucide-react';
import { playAudioFile, stopCurrentAudio, toggleCurrentAudio, seekCurrentAudio, setGlobalPlaybackSpeed } from '../../utils/audioPlayer';
import { clampPlayerPosition, placeReaderPlayer } from '../../utils/readerMedia';

const rectOf = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
const clock = value => `${Math.floor((value || 0) / 60)}:${String(Math.floor((value || 0) % 60)).padStart(2, '0')}`;

export default function ReaderMiniPlayer({ state, lang, onSpeedChange, theme, onOpenVideo }) {
  const de = lang === 'de', player = useRef(null), point = useRef({ x: 16, y: 90 });
  const [position, setPosition] = useState(point.current);
  const updatePosition = next => { point.current = next; setPosition(next); };

  useLayoutEffect(() => {
    const positionPlayer = () => {
      if (!player.current) return;
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        // Mobile layout is docked at bottom via CSS
        return;
      }
      const viewport = { width: innerWidth, height: innerHeight };

      const activeHotspot = document.querySelector('.book-hotspot.hotspot-active');
      const sheet = [...document.querySelectorAll('.reader-sheet')].find(el => el.querySelector('img')?.alt.endsWith(` ${state.anchor?.page}`));
      const sr = sheet ? rectOf(sheet) : null;
      const bounds = state.anchor?.bounds;
      const anchor = activeHotspot ? rectOf(activeHotspot) : (sr && bounds ? {
        x: sr.x + bounds.x * sr.width,
        y: sr.y + bounds.y * sr.height,
        width: bounds.width * sr.width,
        height: bounds.height * sr.height,
      } : null);

      const dockEl = document.querySelector('.reader-bottom');
      const dockRect = dockEl ? rectOf(dockEl) : null;
      const bottomNavLimit = dockRect?.y ? dockRect.y - 8 : viewport.height - 16;
      const pageBottomLimit = sr ? sr.y + sr.height - 8 : viewport.height - 16;
      const maxSafeY = Math.min(bottomNavLimit, pageBottomLimit);

      const playerWidth = Math.min(Math.max(280, anchor ? anchor.width : 320), Math.min(480, viewport.width - 24));
      player.current.style.width = `${playerWidth}px`;
      const playerHeight = player.current.offsetHeight || 42;

      if (anchor) {
        const gap = 8;
        const rawX = anchor.x + (anchor.width - playerWidth) / 2;
        const clampedX = Math.max(12, Math.min(rawX, viewport.width - playerWidth - 12));

        const belowY = anchor.y + anchor.height + gap;
        let targetY;
        if (belowY + playerHeight > maxSafeY) {
          targetY = anchor.y - playerHeight - gap;
        } else {
          targetY = belowY;
        }
        targetY = Math.max(12, Math.min(targetY, viewport.height - playerHeight - 12));

        updatePosition({ x: Math.round(clampedX), y: Math.round(targetY) });
      } else {
        const bookEl = document.querySelector('.reader-book'), stageEl = document.querySelector('.reader-stage');
        const book = bookEl ? rectOf(bookEl) : { x: 0, y: 0, width: viewport.width, height: viewport.height };
        const stage = stageEl ? rectOf(stageEl) : book;
        const size = { width: playerWidth, height: playerHeight };
        const obstacles = [...document.querySelectorAll('.reader-bottom,.reader-home,.reader-focus-toggle,.reader-sidebar,.reader-settings,.reader-edge')].map(el => ({ ...rectOf(el), kind: el.classList.contains('reader-bottom') ? 'dock' : 'control' })).filter(r => r.width && r.height);
        updatePosition(placeReaderPlayer({ viewport, size, stage, book, anchor: null, obstacles }));
      }
    };
    let frame;
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(positionPlayer); };
    const observer = new ResizeObserver(schedule);
    for (const el of [player.current, document.querySelector('.reader-stage'), document.querySelector('.reader-book')]) if (el) observer.observe(el);
    const viewport = document.querySelector('.reader-viewport');
    viewport?.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    positionPlayer();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); viewport?.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [state.url, state.anchor]);

  const retry = () => playAudioFile(state.url, { label: state.label, speed: state.speed, presentation: state.presentation || 'reader', anchor: state.anchor, video: state.video });

  return (
    <aside
      ref={player}
      className="reader-mini-player reader-glass"
      data-theme={theme}
      aria-label={de ? 'Audioplayer' : 'Ses oynatıcı'}
      style={{ left: position.x, top: position.y }}
    >
      <button
        className="mini-glass-action mini-close-btn"
        onClick={stopCurrentAudio}
        aria-label={de ? 'Wiedergabe beenden' : 'Oynatmayı bitir'}
        title={de ? 'Schließen' : 'Kapat'}
      >
        <X size={15} />
      </button>

      <button
        className="mini-glass-action mini-play-toggle"
        disabled={state.status === 'loading'}
        onClick={state.status === 'error' ? retry : toggleCurrentAudio}
        aria-label={
          state.status === 'error'
            ? (de ? 'Erneut versuchen' : 'Tekrar dene')
            : state.status === 'paused'
            ? (de ? 'Fortsetzen' : 'Devam et')
            : (de ? 'Pausieren' : 'Duraklat')
        }
      >
        {state.status === 'error' ? <RotateCcw size={15} /> : state.status === 'paused' ? <Play size={15} /> : <Pause size={15} />}
      </button>

      <span className="mini-player-time">
        {clock(state.currentTime)} <span>/ {clock(state.duration)}</span>
      </span>

      <input
        className="mini-audio-progress"
        type="range"
        min="0"
        max={state.duration || 1}
        step=".1"
        value={Math.min(state.currentTime || 0, state.duration || 1)}
        disabled={!state.duration}
        aria-label={de ? 'Wiedergabeposition' : 'Kayıtta ilerle'}
        onChange={e => seekCurrentAudio(Number(e.target.value))}
      />

      <select
        className="mini-speed mini-glass-action"
        aria-label={de ? 'Audiotempo' : 'Seslendirme hızı'}
        value={state.speed || 1}
        onChange={e => {
          const speed = Number(e.target.value);
          setGlobalPlaybackSpeed(speed);
          onSpeedChange?.(speed);
        }}
      >
        {[.5, .75, 1, 1.25, 1.5, 2].map(speed => (
          <option key={speed} value={speed}>{speed}×</option>
        ))}
      </select>

      {state.video && (
        <button
          className="mini-glass-action"
          onClick={() => onOpenVideo?.(state.video)}
          aria-label={de ? 'Video öffnen' : 'Videoyu aç'}
        >
          <Video size={14} />
        </button>
      )}
    </aside>
  );
}
