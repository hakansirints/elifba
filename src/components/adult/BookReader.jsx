import ThemePicker from '../common/ThemePicker';
import { assetUrl } from '../../utils/urls';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight, PanelLeft, ZoomIn, ZoomOut, Bookmark, Maximize2, Minimize2, SlidersHorizontal, X, Columns2, File, Focus, Eye, Sun, Moon, Coffee, Volume2, BookOpen, CircleHelp, Sparkles, Gamepad2 } from 'lucide-react';
import { ARABIC_LETTERS } from '../../data/curriculumData';
import { playAudioFile, stopCurrentAudio, setGlobalPlaybackSpeed, subscribeAudio, getAudioSnapshot } from '../../utils/audioPlayer';
import { READER_DEFAULTS } from '../../utils/readerTools';
import { isQuickLetterAudio } from '../../utils/readerMedia';
import ActivityDrawer from './ActivityDrawer';
import ReaderWelcome from './ReaderWelcome';
import { activitiesForPage, finishActivity } from '../../data/bookActivities';
import PaperCurl from './PaperCurl';
import ReaderGuide from './ReaderGuide';
import ReaderSidebar from './ReaderSidebar';
import BookHotspot from './BookHotspot';
import '../../styles/reader.css';
import '../../styles/book-activities.css';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ASPECT = 561.26 / 788.03;
function Control({ label, children, ...props }) {
  return <button type="button" className="reader-control" aria-label={label} data-tip={label} {...props}>{children}</button>;
}

export default function BookReader({ pagesData, currentPage = 6, onPageChange, onOpenVideo, lang = 'tr', reader = { bookmarks: [], notes: {}, preferences: READER_DEFAULTS }, onReaderChange = () => {}, onLangChange, effects=true, onEffectsChange }) {
  const de = lang === 'de', total = pagesData.length, page = pagesData[currentPage - 1];
  const preferences = { ...READER_DEFAULTS, ...reader.preferences };
  const [guide, setGuide] = useState(false), [zoom, setZoom] = useState(1), [pageWidth, setPageWidth] = useState(440), [wide, setWide] = useState(innerWidth >= 1000);
  const [compactStage, setCompactStage] = useState(innerWidth < 800);
  const [activitiesOpen,setActivitiesOpen]=useState(false);
  const activitiesTrigger=useRef(null);
  const [shimmerActive, setShimmerActive] = useState(false);
  const shimmerTimer = useRef(null);
  const [turn, setTurn] = useState(null), [failed, setFailed] = useState({}), [imageVersion, setImageVersion] = useState(0);
  const [panel, setPanel] = useState(false), [tab, setTab] = useState('contents'), [settings, setSettings] = useState(false), [focus, setFocus] = useState(false), [fullscreen, setFullscreen] = useState(false);
  const [draft, setDraft] = useState(String(currentPage)), [scrub, setScrub] = useState(null), [fullscreenError, setFullscreenError] = useState('');
  const viewportRef = useRef(null), pageRef = useRef(null), gesture = useRef(null), pointers = useRef(new Map()), pinch = useRef(null), settingsRef = useRef(null), settingsTrigger = useRef(null), panelTrigger = useRef(null);
  const zoomRef = useRef(1), zoomAnchor = useRef(null), turning = useRef(false);
  const audio = useSyncExternalStore(subscribeAudio, getAudioSnapshot);
  const floatingAudio = audio.status !== 'idle' && audio.presentation !== 'activity' && (audio.presentation !== 'quiet' || audio.status === 'error');
  const spread = preferences.spread && wide && currentPage < total, step = preferences.spread && wide ? 2 : 1;
  const visible = spread && currentPage < total ? [page, pagesData[currentPage]] : [page];
  const activityPages=visible.filter(p=>activitiesForPage(p.page_number).length).map(p=>p.page_number);
  const hasActivities=preferences.activitiesEnabled===true&&activityPages.length>0;
  const closeActivities=()=>{stopCurrentAudio();setActivitiesOpen(false);};
  useEffect(()=>{setActivitiesOpen(false);stopCurrentAudio();},[currentPage,preferences.activitiesEnabled,spread]);
  useEffect(() => {
    if (hasActivities) {
      setShimmerActive(true);
      if (shimmerTimer.current) clearTimeout(shimmerTimer.current);
      shimmerTimer.current = setTimeout(() => {
        setShimmerActive(false);
      }, 3600);
    } else {
      setShimmerActive(false);
      if (shimmerTimer.current) clearTimeout(shimmerTimer.current);
    }
    return () => {
      if (shimmerTimer.current) clearTimeout(shimmerTimer.current);
    };
  }, [currentPage, hasActivities]);
  const updatePreferences = patch => onReaderChange({ preferences: { ...preferences, ...patch } });
  const toggleBookmark = useCallback(() => onReaderChange({ bookmarks: reader.bookmarks.includes(currentPage) ? reader.bookmarks.filter(n => n !== currentPage) : [...reader.bookmarks, currentPage] }), [currentPage, reader.bookmarks, onReaderChange]);
  const closePanel = () => { setPanel(false); panelTrigger.current?.focus(); };
  const togglePanel = () => { setFocus(false); setSettings(false); setPanel(v => !v); };

  const go = useCallback(n => {
    const target = clamp(n, 6, total);
    if (!Number.isInteger(target) || target === currentPage || turning.current) return;
    stopCurrentAudio();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { onPageChange(target); return; }
    turning.current = true;
    const direction = target > currentPage ? 'next' : 'previous';
    setTurn({ from: visible, to: spread ? [pagesData[target - 1], pagesData[target] || null] : [pagesData[target - 1]], target, direction, start: currentPage });
  }, [currentPage, total, visible, spread, pagesData, onPageChange]);

  const completeTurn = () => {
    if (!turning.current || !turn) return;
    onPageChange(turn.target); setTurn(null); turning.current = false;
  };
  useEffect(() => {
    setDraft(String(currentPage)); setScrub(null); setFailed({});
    for (const p of [pagesData[currentPage - 2], pagesData[currentPage], pagesData[currentPage + 1]]) if (p && p.page_number >= 6) { const image = new Image(); image.src = assetUrl(p.image); }
    if (turn && currentPage !== turn.start) { setTurn(null); turning.current = false; }
  }, [currentPage, pagesData]);
  useEffect(() => { setGlobalPlaybackSpeed(preferences.speed); }, [preferences.speed]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const resize = () => {
      setWide(innerWidth >= 1000);
      const count = preferences.spread && innerWidth >= 1000 ? 2 : 1;
      setCompactStage(viewport.clientWidth < 800);
      const reserve = floatingAudio && viewport.clientWidth < 800 ? 150 : 0;
      setPageWidth(Math.max(100, Math.min(900, (viewport.clientWidth - (viewport.clientWidth < 600 ? 32 : 128)) / count, (viewport.clientHeight - 206 - reserve - (hasActivities ? 64 : 0)) * ASPECT)));
    };
    const observer = new ResizeObserver(resize); observer.observe(viewport); resize();
    window.addEventListener('resize', resize);
    return () => { observer.disconnect(); window.removeEventListener('resize', resize); };
  }, [preferences.spread, floatingAudio, hasActivities]);

  const changeZoom = useCallback((next, x, y) => {
    if (turning.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    zoomAnchor.current = { x, y, fx: (x - rect.left) / rect.width, fy: (y - rect.top) / rect.height };
    zoomRef.current = clamp(next, 0.5, 3); setZoom(zoomRef.current);
  }, []);
  const zoomCenter = next => { const r = viewportRef.current.getBoundingClientRect(); changeZoom(next, r.left + r.width / 2, r.top + r.height / 2); };
  const fitWidth = () => zoomCenter(clamp((viewportRef.current.clientWidth - 48) / (pageWidth * visible.length), 0.5, 3));
  useLayoutEffect(() => {
    const anchor = zoomAnchor.current; if (!anchor) return;
    const rect = pageRef.current.getBoundingClientRect(), viewport = viewportRef.current;
    viewport.scrollLeft += rect.left + rect.width * anchor.fx - anchor.x;
    viewport.scrollTop += rect.top + rect.height * anchor.fy - anchor.y;
    zoomAnchor.current = null;
  }, [zoom]);
  useEffect(() => {
    const viewport = viewportRef.current;
    const wheel = e => {
      e.preventDefault();
      const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewport.clientHeight : 1);
      changeZoom(zoomRef.current * Math.exp(-clamp(delta, -160, 160) * 0.0025), e.clientX, e.clientY);
    };
    viewport.addEventListener('wheel', wheel, { passive: false });
    return () => viewport.removeEventListener('wheel', wheel);
  }, [changeZoom]);
  const toggleFullscreen = async () => {
    setFullscreenError('');
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else throw Error('unavailable'); }
    catch { setFullscreenError(de ? 'Vollbild ist in diesem Browser nicht verfügbar.' : 'Bu tarayıcıda tam ekran açılamadı.'); }
  };
  useEffect(() => {
    const changed = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', changed); return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  useEffect(() => {
    if (!settings) return;
    settingsRef.current?.querySelector('button')?.focus();
    const outside = e => { if (!settingsRef.current?.contains(e.target) && !settingsTrigger.current?.contains(e.target)) setSettings(false); };
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, [settings]);
  useEffect(() => {
    const keyboard = e => {
      if(document.querySelector('[aria-modal="true"]'))return;
      if (e.key === 'Escape') { setSettings(false); setPanel(false); setFocus(false); return; }
      if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input,textarea,select,[role="dialog"]') || document.querySelector('[aria-modal="true"]')) return;
      if (['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', 'Home', 'End'].includes(e.key)) {
        if (e.target.closest('[role="tablist"]')) return;
        e.preventDefault(); go(e.key === 'Home' ? 6 : e.key === 'End' ? total : currentPage + (['ArrowRight', 'PageDown'].includes(e.key) ? step : -step));
      }
      if (['+', '=', '-', '0'].includes(e.key)) { e.preventDefault(); zoomCenter(e.key === '0' ? 1 : zoomRef.current + (e.key === '-' ? -0.15 : 0.15)); }
      if (e.key.toLowerCase() === 'b') { e.preventDefault(); toggleBookmark(); }
      if (e.key.toLowerCase() === 'f') { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener('keydown', keyboard); return () => window.removeEventListener('keydown', keyboard);
  });
  const commitPage = () => { const n = Number(draft); if (Number.isInteger(n) && n >= 6 && n <= total) go(n); else setDraft(String(currentPage)); };

  const titleFor = (h, p, i) => {
    if (h.type === 'goto_page') return `${de ? 'Gehe zu Seite' : 'Şu sayfaya git:'} ${h.target_page}`;
    if (h.type === 'video') return `${de ? 'Video ansehen' : 'Videoyu izle'}: ${h.caption || p.page_number}`;
    const letter = p.page_number === 14 ? ARABIC_LETTERS.find(l => h.audio_path === l.audio) : null;
    if (letter) return `${de ? letter.nameDe : letter.nameTr} · ${de ? 'Aussprache anhören' : 'sesini dinle'}`;
    const purpose = h.audio_path?.includes('/turkish/') ? 'Türkçe' : h.audio_path?.includes('/german/') ? 'Deutsch' : (de ? 'Arabische Aufnahme' : 'Arapça okunuş');
    return `${purpose} · ${de ? 'Seite' : 'sayfa'} ${p.page_number}, ${de ? 'Beispiel' : 'örnek'} ${i + 1}`;
  };
  const playSpot = (h, p, i) => {
    if (h.type === 'goto_page') go(h.target_page);
    else if (h.type === 'video') onOpenVideo({ file: h.video_path, caption: h.caption, pageNumber: p.page_number });
    else playAudioFile(h.audio_path, { label: titleFor(h, p, i), speed: preferences.speed, presentation: isQuickLetterAudio(h, p.page_number) ? 'quiet' : 'reader', anchor: { page: p.page_number, bounds: h.bounds } });
  };
  const pointerDown = e => {
    if ((e.pointerType === 'mouse' && e.button !== 0) || turning.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const midX = (p1.x + p2.x) / 2, midY = (p1.y + p2.y) / 2;
      const rect = pageRef.current.getBoundingClientRect();
      pinch.current = {
        dist: Math.max(20, dist),
        zoom: zoomRef.current,
        fx: (midX - rect.left) / rect.width,
        fy: (midY - rect.top) / rect.height,
      };
      if (gesture.current) { gesture.current.moved = true; gesture.current.pinched = true; }
      return;
    }
    if (pointers.current.size === 1) {
      gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: viewportRef.current.scrollLeft, top: viewportRef.current.scrollTop, moved: false, pinched: false };
    }
  };
  const pointerMove = e => {
    if (pointers.current.has(e.pointerId)) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    if (pointers.current.size >= 2 && pinch.current) {
      const [p1, p2] = [...pointers.current.values()];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const midX = (p1.x + p2.x) / 2, midY = (p1.y + p2.y) / 2;
      const next = clamp(pinch.current.zoom * (dist / pinch.current.dist), 0.5, 3);
      zoomAnchor.current = { x: midX, y: midY, fx: pinch.current.fx, fy: pinch.current.fy };
      if (Math.abs(next - zoomRef.current) > 0.001) {
        zoomRef.current = next;
        setZoom(next);
      } else {
        const rect = pageRef.current.getBoundingClientRect(), viewport = viewportRef.current;
        viewport.scrollLeft += rect.left + rect.width * pinch.current.fx - midX;
        viewport.scrollTop += rect.top + rect.height * pinch.current.fy - midY;
        zoomAnchor.current = null;
      }
      return;
    }
    const g = gesture.current; if (!g || g.id !== e.pointerId || g.pinched) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (Math.hypot(dx, dy) > 8) {
      g.moved = true;
      if (!e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.setPointerCapture?.(e.pointerId);
      if (zoomRef.current > 1) { viewportRef.current.scrollLeft = g.left - dx; viewportRef.current.scrollTop = g.top - dy; }
    }
  };
  const pointerUp = (e, cancelled = false) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 1) {
      const [remId, remPos] = [...pointers.current.entries()][0];
      gesture.current = { id: remId, x: remPos.x, y: remPos.y, left: viewportRef.current.scrollLeft, top: viewportRef.current.scrollTop, moved: true, pinched: true };
      return;
    }
    const g = gesture.current; if (!g) return;
    if (!cancelled && g.id === e.pointerId && g.moved && !g.pinched && zoomRef.current <= 1 && Math.abs(e.clientX - g.x) > 50 && Math.abs(e.clientX - g.x) > Math.abs(e.clientY - g.y) * 1.4) go(currentPage + (e.clientX < g.x ? step : -step));
    window.setTimeout(() => { if (gesture.current === g) gesture.current = null; }, 0);
  };
  const saved = reader.bookmarks.includes(currentPage);
  return <section className={`book-reader reader-theme-${preferences.theme} ${panel ? 'has-panel' : ''} ${focus ? 'reader-focus' : ''} ${activitiesOpen&&hasActivities?'has-activity-drawer':''}`} aria-label={de ? 'Interaktives E-Book' : 'İnteraktif e-Kitap'}>
    {guide&&<ReaderGuide onClose={()=>setGuide(false)} lang={lang}/>}
    <h1 className="sr-only">{de ? 'Interaktives E-Book' : 'İnteraktif e-Kitap'}</h1>
    {panel && <><button className="reader-panel-scrim" onClick={closePanel} aria-label={de ? 'Navigation schließen' : 'Paneli kapat'} /><ReaderSidebar tab={tab} setTab={setTab} pages={pagesData.slice(5)} currentPage={currentPage} reader={reader} onReaderChange={onReaderChange} go={go} close={closePanel} lang={lang} /></>}
    <div className={`reader-stage ${hasActivities ? 'has-activities' : ''} ${floatingAudio ? 'has-floating-audio' : ''} ${floatingAudio && compactStage ? 'has-player-reserve' : ''}`} onPointerMove={e => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--glass-light-x', `${(e.clientX - rect.left) / rect.width * 100}%`); }}>
      <button className="reader-home reader-glass" onClick={togglePanel} aria-label={de?'Buchinhalt öffnen':'Kitap dizinini aç'}><BookOpen size={17}/><span>Elif-Ba</span></button>
      <div className="reader-top-tools"><button className="reader-guide-trigger reader-glass" onClick={()=>setGuide(true)} aria-label={de?'E-Book-Anleitung':'e-Kitap kullanım kılavuzu'}><CircleHelp size={18}/></button><ThemePicker theme={preferences.theme} onChange={theme=>updatePreferences({theme})} lang={lang}/><button className="reader-focus-toggle reader-glass" onClick={() => { setFocus(v => !v); setPanel(false); setSettings(false); }} aria-pressed={focus} aria-label={focus ? (de ? 'Steuerung anzeigen' : 'Kontrolleri göster') : (de ? 'Fokusmodus' : 'Odak modu')}><Focus size={17} /><span>{focus ? (de ? 'Steuerung anzeigen' : 'Kontrolleri göster') : (de ? 'Fokus' : 'Odak')}</span></button></div>
      <div className="reader-viewport" ref={viewportRef} aria-describedby="reader-help">
        <div className="reader-desk" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={e => pointerUp(e, false)} onPointerCancel={e => pointerUp(e, true)} onClickCapture={e => { if (gesture.current?.moved) { e.preventDefault(); e.stopPropagation(); } }} style={{ '--page-width': `${pageWidth}px`, '--reader-zoom': zoom, '--page-height': `${pageWidth / ASPECT}px`, '--page-count': visible.length }}>
          <div className={`reader-book ${spread ? 'reader-spread' : ''} ${turn ? 'is-turning' : ''}`} onDragStart={e => e.preventDefault()} style={{ '--page-brightness': preferences.brightness }}>
            {visible.map((p, index) => {
              const hasPageActivities = activitiesForPage(p.page_number).length > 0;
              return (
                <div className={`reader-sheet ${hasPageActivities ? 'has-page-activities' : ''}`} ref={index === 0 ? pageRef : undefined} key={`${p.page_number}-${currentPage}`}>
                  <img src={`${assetUrl(p.image)}${imageVersion ? `?v=${imageVersion}` : ''}`} alt={`${de ? 'Originalbuch, Seite' : 'Orijinal kitap, sayfa'} ${p.page_number}`} draggable="false" onError={() => setFailed(v => ({ ...v, [p.page_number]: true }))} onLoad={() => setFailed(v => ({ ...v, [p.page_number]: false }))} />
                  {failed[p.page_number] ? <div className="image-error" role="alert"><p>{de ? 'Seite konnte nicht geladen werden.' : 'Sayfa yüklenemedi.'}</p><button className="button button-white" onClick={() => setImageVersion(v => v + 1)}>{de ? 'Erneut versuchen' : 'Tekrar dene'}</button></div> : p.hotspots.filter(h => ['audio', 'video', 'goto_page'].includes(h.type)).map((h, i) => <BookHotspot key={`${p.page_number}-${h.id}-${i}`} hotspot={h} pageImage={`${assetUrl(p.image)}${imageVersion ? `?v=${imageVersion}` : ''}`} label={titleFor(h, p, i)} audio={audio} disabled={Boolean(turn)} onActivate={() => playSpot(h, p, i)} />)}
                </div>
              );
            })}
            {turn && <div className={`reader-curl-spread ${spread ? '' : `curl-single curl-${turn.direction}`}`}><PaperCurl from={turn.from} to={turn.to} direction={turn.direction} single={!spread} onComplete={completeTurn} /></div>}
          </div>
        </div>
      </div>
      <button className="reader-edge reader-edge-prev reader-glass" onClick={() => go(currentPage - step)} disabled={currentPage === 6 || Boolean(turn)} aria-label={de ? 'Vorherige Seite' : 'Önceki sayfa'}><ChevronLeft size={23} /></button>
      <button className="reader-edge reader-edge-next reader-glass" onClick={() => go(currentPage + step)} disabled={currentPage + visible.length > total || Boolean(turn)} aria-label={de ? 'Nächste Seite' : 'Sonraki sayfa'}><ChevronRight size={23} /></button>
      <div className="reader-bottom">
        <div className="reader-scrubber"><label htmlFor="reader-position">{de ? 'Buchposition' : 'Kitaptaki konum'} <span>{Math.round((currentPage - 5) / (total - 5) * 100)}%</span></label><input id="reader-position" type="range" min="6" max={total} value={scrub ?? currentPage} onChange={e => setScrub(Number(e.target.value))} onPointerUp={e => { go(Number(e.currentTarget.value)); setScrub(null); }} onKeyUp={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) { go(Number(e.currentTarget.value)); setScrub(null); } }} onBlur={e => { if (scrub !== null) { go(Number(e.currentTarget.value)); setScrub(null); } }} aria-valuetext={`${de ? 'Seite' : 'Sayfa'} ${scrub ?? currentPage}`} />{scrub !== null && <div className="reader-scrub-preview"><img src={assetUrl(pagesData[scrub - 1].thumbnail)} alt="" /><span>{de ? 'Seite' : 'Sayfa'} {scrub}</span></div>}</div>
        <div className="reader-dock reader-glass" role="toolbar" aria-label={de ? 'Lesewerkzeuge' : 'Okuma araçları'}>
          <button ref={panelTrigger} className="reader-control reader-panel-trigger" onClick={togglePanel} aria-label={de ? 'Inhalt und Buchnavigation' : 'Dizin ve kitap gezinmesi'} aria-expanded={panel} aria-controls="reader-sidebar" data-tip={de ? 'Buchnavigation' : 'Dizin ve kitap gezinmesi'}><PanelLeft size={19} /><span>{de ? 'Inhalt' : 'Dizin'}</span></button>
          <span className="reader-dock-divider" />
          <div className="reader-page-navigation"><Control label={de ? 'Vorherige Seite' : 'Önceki sayfa'} onClick={() => go(currentPage - step)} disabled={currentPage === 6 || Boolean(turn)}><ChevronLeft size={19} /></Control><form onSubmit={e => { e.preventDefault(); commitPage(); }}><input value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitPage} inputMode="numeric" aria-label={de ? 'Seitennummer' : 'Sayfa numarası'} /><span>/ {total}</span></form><Control label={de ? 'Nächste Seite' : 'Sonraki sayfa'} onClick={() => go(currentPage + step)} disabled={currentPage + visible.length > total || Boolean(turn)}><ChevronRight size={19} /></Control></div>
          <span className="reader-dock-divider" />
          <div className="reader-zoom-tools"><Control label={de ? 'Verkleinern' : 'Uzaklaştır'} onClick={() => zoomCenter(zoom - .15)} disabled={zoom <= .5}><ZoomOut size={18} /></Control><button className="reader-zoom-readout" onClick={() => zoomCenter(1)} aria-label={de ? 'An Seite anpassen' : 'Sayfaya sığdır'}>{Math.round(zoom * 100)}%</button><Control label={de ? 'Vergrößern' : 'Yakınlaştır'} onClick={() => zoomCenter(zoom + .15)} disabled={zoom >= 3}><ZoomIn size={18} /></Control></div>
          <Control label={saved ? (de ? 'Lesezeichen entfernen' : 'Yer imini kaldır') : (de ? 'Lesezeichen setzen' : 'Yer imi ekle')} onClick={toggleBookmark} aria-pressed={saved}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></Control>
          <button className="reader-control reader-layout-trigger" onClick={() => updatePreferences({ spread: !preferences.spread })} aria-pressed={spread} disabled={!wide} aria-label={de ? 'Doppelseite' : 'Çift sayfa'} data-tip={de ? 'Doppelseite' : 'Çift sayfa'}><Columns2 size={18} /></button>
          <Control label={fullscreen ? (de ? 'Vollbild verlassen' : 'Tam ekrandan çık') : (de ? 'Vollbild' : 'Tam ekran')} onClick={toggleFullscreen}>{fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</Control>
          <button ref={settingsTrigger} className="reader-control" aria-label={de ? 'Leseeinstellungen' : 'Okuma ayarları'} aria-expanded={settings} aria-controls="reader-settings" data-tip={de ? 'Leseeinstellungen' : 'Okuma ayarları'} onClick={() => setSettings(v => !v)}><SlidersHorizontal size={18} /></button>
          <span className="reader-dock-divider" />
          <button
            ref={activitiesTrigger}
            className={`reader-control reader-learn-play-btn ${hasActivities ? 'is-active' : 'is-disabled'} ${shimmerActive ? 'is-shimmering' : ''}`}
            disabled={!hasActivities}
            onClick={() => {
              if (!hasActivities) return;
              stopCurrentAudio();
              setPanel(false);
              setSettings(false);
              setActivitiesOpen(true);
            }}
            aria-haspopup="dialog"
            aria-expanded={activitiesOpen}
            aria-label={de ? 'Spielen & Lernen' : 'Eğlen & Öğren'}
            data-tip={hasActivities ? (de ? 'Spielen & Lernen' : 'Eğlen & Öğren') : (de ? 'Keine Spiele auf dieser Seite' : 'Bu sayfada etkinlik yok')}
          >
            <Gamepad2 size={18} className="learn-play-icon" />
            <span className="learn-play-text">{de ? 'Spielen & Lernen' : 'Eğlen & Öğren'}</span>
            {hasActivities && (
              <span className="learn-play-badge">
                {activityPages.reduce((n, p) => n + activitiesForPage(p).length, 0)}
              </span>
            )}
          </button>
        </div>
        {settings && <div id="reader-settings" className="reader-settings reader-glass" ref={settingsRef} role="dialog" aria-label={de ? 'Leseeinstellungen' : 'Okuma ayarları'} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setSettings(false); settingsTrigger.current?.focus(); } }}><div className="reader-settings-title"><h2>{de ? 'Leseeinstellungen' : 'Okuma ayarları'}</h2><Control label={de ? 'Schließen' : 'Kapat'} onClick={() => { setSettings(false); settingsTrigger.current?.focus(); }}><X size={17} /></Control></div>
          <fieldset><legend>{de ? 'Hintergrund' : 'Okuma zemini'}</legend><div className="reader-options">{[['aqua', Sun, de ? 'Wassergrün' : 'Su Yeşili'], ['sepia', Coffee, de ? 'Sepia' : 'Sepya'], ['dark', Moon, de ? 'Dunkel' : 'Karanlık']].map(([value, Icon, label]) => <button key={value} onClick={() => updatePreferences({ theme: value })} aria-pressed={preferences.theme === value}><Icon size={17} />{label}</button>)}</div></fieldset>
          <fieldset><legend>{de ? 'Seitenansicht' : 'Sayfa görünümü'}</legend><div className="reader-options"><button onClick={() => updatePreferences({ spread: false })} aria-pressed={!preferences.spread}><File size={17} />{de ? 'Einzelseite' : 'Tek sayfa'}</button><button onClick={() => updatePreferences({ spread: true })} disabled={!wide} aria-pressed={preferences.spread && wide}><Columns2 size={17} />{de ? 'Doppelseite' : 'Çift sayfa'}</button></div>{!wide && <p>{de ? 'Doppelseiten sind auf breiten Bildschirmen verfügbar.' : 'Çift sayfa geniş ekranlarda kullanılabilir.'}</p>}</fieldset>
          <div className="reader-fit-options"><button onClick={() => zoomCenter(1)}><BookOpen size={16} />{de ? 'Ganze Seite' : 'Sayfaya sığdır'}</button><button onClick={fitWidth}><Eye size={16} />{de ? 'Seitenbreite' : 'Genişliğe sığdır'}</button></div>
          <label className="reader-settings-row"><span><ZoomIn size={16} />{de ? 'Zoom' : 'Yakınlaştırma'} · {Math.round(zoom * 100)}%</span><input type="range" min=".5" max="3" step=".05" value={zoom} onChange={e => zoomCenter(Number(e.target.value))} /></label>
          <label className="reader-settings-row"><span><Sun size={16} />{de ? 'Seitenhelligkeit' : 'Sayfa parlaklığı'}</span><input type="range" min=".7" max="1" step=".05" value={preferences.brightness} onChange={e => updatePreferences({ brightness: Number(e.target.value) })} /></label>
          <label className="reader-settings-row"><span><Volume2 size={16} />{de ? 'Audiotempo' : 'Seslendirme hızı'}</span><select value={preferences.speed} onChange={e => updatePreferences({ speed: Number(e.target.value) })}>{[.5, .75, 1, 1.25, 1.5, 2].map(value => <option value={value} key={value}>{value}×</option>)}</select></label>
          <label className="reader-activity-toggle"><span>{de?'Aktivitäten anzeigen':'Etkinlikleri göster'}</span><input type="checkbox" checked={preferences.activitiesEnabled===true} onChange={e=>updatePreferences({activitiesEnabled:e.target.checked})}/></label>
          <p className="reader-shortcuts">{de?'Kurze Spiele auf passenden Buchseiten. Die Buchaufnahmen bleiben auch ohne Aktivitäten verfügbar.':'Uygun sayfalarda kısa oyunları açar. Gizlediğinde kitabın ses kayıtları kullanılmaya devam eder.'}</p>
          <label className="reader-settings-row"><span>{de?'Sprache':'Dil'}</span><select value={lang} onChange={e=>onLangChange?.(e.target.value)}><option value="tr">Türkçe</option><option value="de">Deutsch</option></select></label>
          <label className="reader-activity-toggle"><span>{de?'Klangeffekte':'Ses efektleri'}</span><input type="checkbox" checked={effects} onChange={e=>onEffectsChange?.(e.target.checked)}/></label>
          <p className="reader-shortcuts">← → {de ? 'Blättern' : 'Sayfa çevir'} · + − {de ? 'Zoom' : 'Yakınlaştır'} · B {de ? 'Lesezeichen' : 'Yer imi'} · F {de ? 'Vollbild' : 'Tam ekran'}</p>
        </div>}
      </div>
      <p id="reader-help" className="reader-help">{de ? 'Mausrad / Pinch: Zoom · Ziehen: Blättern / Verschieben · 0: ganze Seite' : (compactStage ? 'Yana kaydır: sayfa çevir · İki parmakla: büyüt / küçült' : 'Tekerlek / iki parmak: yakınlaştır · Sürükle: sayfa çevir / gezin · 0: sayfaya sığdır')}</p>
      <span className="sr-only" role="status" aria-live="polite">{de ? 'Seite' : 'Sayfa'} {currentPage}{visible.length === 2 ? `–${currentPage + 1}` : ''} / {total}</span>
      {fullscreenError && <p className="reader-notice" role="status">{fullscreenError}<button onClick={() => setFullscreenError('')} aria-label={de ? 'Schließen' : 'Kapat'}><X size={15} /></button></p>}
    </div>
    {preferences.activitiesEnabled===null&&<ReaderWelcome lang={lang} onChoose={activitiesEnabled=>updatePreferences({activitiesEnabled})}/>}
    {activitiesOpen&&hasActivities&&<ActivityDrawer pages={activityPages} lang={lang} speed={preferences.speed} progress={reader.activityProgress||{completed:[],attempts:[]}} effects={effects} onEffectsChange={onEffectsChange} onFinish={(p,id,result)=>onReaderChange({activityProgress:finishActivity(reader.activityProgress,p,id,result)})} onClose={closeActivities}/>}
  </section>;
}
