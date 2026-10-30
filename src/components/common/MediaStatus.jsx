import React, { useSyncExternalStore } from 'react';
import { Volume2, Square, RotateCcw, Play, Pause } from 'lucide-react';
import { subscribeAudio, getAudioSnapshot, stopCurrentAudio, playAudioFile, toggleCurrentAudio } from '../../utils/audioPlayer';
import ReaderMiniPlayer from '../adult/ReaderMiniPlayer';
export default function MediaStatus({ lang, bookMode = false, onSpeedChange, theme = 'light', onOpenVideo }) {
  const state = useSyncExternalStore(subscribeAudio, getAudioSnapshot);
  if (state.status === 'idle') return null;
  if (bookMode && state.presentation === 'quiet' && state.status !== 'error') return null;
  if (bookMode) return <ReaderMiniPlayer state={state} lang={lang} onSpeedChange={onSpeedChange} theme={theme} onOpenVideo={onOpenVideo} />;
  const de = lang === 'de';
  return <aside className={`media-status ${state.status==='error' ? 'media-error' : ''}`} aria-label={de?'Audiowiedergabe':'Ses oynatma'}>
    <Volume2 size={18}/><span role="status">{state.status==='error' ? (de?'Audio konnte nicht gestartet werden.':'Ses başlatılamadı.') : state.status==='loading' ? (de?'Audio wird geladen…':'Ses yükleniyor…') : (state.label || (de?'Originalaufnahme läuft':'Kaynak kayıt çalıyor'))}</span>
    {state.status==='error' && <button onClick={()=>playAudioFile(state.url,{label:state.label})}><RotateCcw size={16}/>{de?'Erneut versuchen':'Tekrar dene'}</button>}
    {['playing','paused'].includes(state.status)&&<button onClick={toggleCurrentAudio} aria-label={state.status==='paused'?(de?'Fortsetzen':'Devam et'):(de?'Pausieren':'Duraklat')}>{state.status==='paused'?<Play size={14}/>:<Pause size={14}/>}</button>}
    <button onClick={stopCurrentAudio}><Square size={14}/>{de?'Stoppen':'Durdur'}</button>
  </aside>;
}
