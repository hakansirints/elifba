import React, { useEffect, useReducer, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Headphones, Pencil, RotateCcw, Search, Sparkles, Star, Trophy, Volume2, VolumeX, X } from 'lucide-react';
import ReaderDialog from './ReaderDialog';
import ActivityRound from './ActivityRound';
import LetterWorkshop from './LetterWorkshop';
import ElifbaMark from '../common/ElifbaMark';
import {Feedback,Glyph} from './ActivityPrimitives';
import { activitiesForPage, activityKey, createPairs, MEMORY_LEVELS } from '../../data/bookActivities';
import { LETTERS, letterName } from '../../data/alphabetData';
import { memoryReducer, newMemoryGame } from '../../utils/memoryGame';
import { stopCurrentAudio, sfx } from '../../utils/audioPlayer';

function Pairs({page,lang,onFinish}) {
  const de=lang==='de',[pairCount,setPairCount]=useState(6),[state,dispatch]=useReducer(memoryReducer,null,()=>newMemoryGame(createPairs(page)));
  const previousMatches=useRef(0),finished=useRef(false),rootRef=useRef(null),replayRef=useRef(null);
  const done=state.feedback==='complete',matchedPairs=state.matched.length/2;
  useEffect(()=>{
    if(state.feedback!=='mismatch')return;
    const timer=setTimeout(()=>dispatch({type:'conceal'}),1100);return()=>clearTimeout(timer);
  },[state.feedback]);
  useEffect(()=>{
    if(state.matched.length<=previousMatches.current)return;
    previousMatches.current=state.matched.length;
    if(done){sfx.playSuccess();if(!finished.current){finished.current=true;onFinish({correct:pairCount,total:pairCount});}replayRef.current?.focus({preventScroll:true});}
    else {sfx.playStar();rootRef.current?.querySelector('.memory-card:not(:disabled)')?.focus({preventScroll:true});}
  },[state.matched]);
  const restart=count=>{previousMatches.current=0;finished.current=false;setPairCount(count);dispatch({type:'restart',cards:createPairs(page,Math.random,count)});};
  const flip=key=>{
    if(state.open.length===2||state.matched.includes(key)||state.open.includes(key))return;
    sfx.playFlip();dispatch({type:'flip',key});
  };
  return <div className="memory-game activity-game-frame" ref={rootRef}>
    <div className="memory-toolbar"><label>{de?'Paare':'Çift sayısı'}<select aria-label={de?'Anzahl der Paare':'Çift sayısı'} value={pairCount} onChange={e=>restart(Number(e.target.value))}>{MEMORY_LEVELS.map(n=><option key={n} value={n}>{n} {de?'Paare':'çift'}</option>)}</select></label><span className="memory-meter"><Star size={16} fill="currentColor"/>{matchedPairs} / {pairCount} <span className="memory-turns">· {state.turns} {de?'Versuche':'deneme'}</span></span><button ref={replayRef} className="activity-btn" onClick={()=>restart(pairCount)} aria-label={de?'Neu mischen':'Kartları yeniden karıştır'}><RotateCcw size={17}/></button></div>
    <div className={`activity-pairs pairs-${pairCount}`} style={{'--memory-cols':pairCount}} aria-label={de?'Buchstaben-Memory':'Harf hafıza kartları'}>{state.cards.map((c,i)=>{const matched=state.matched.includes(c.key),open=state.open.includes(c.key)||matched;return <button className={`memory-card ${open?'is-open':''} ${matched?'is-matched':''}`} key={c.key} aria-label={open?`${letterName(c.letter,lang)}${matched?(de?' · gefunden':' · eşleşti'):''}`:(de?`Karte ${i+1} öffnen`:`${i+1}. kartı aç`)} aria-pressed={open} aria-disabled={state.open.length===2||open} disabled={matched} onClick={()=>flip(c.key)}><span className="memory-card-inner"><span className="memory-face memory-back" aria-hidden="true"><Star fill="currentColor"/><small>{i+1}</small></span><span className="memory-face memory-front" aria-hidden={!open}><Glyph letter={c.letter}/>{matched&&<span className="memory-check"><Check size={16}/></span>}</span></span></button>;})}</div>
    <Feedback tone={done?'complete':state.feedback==='match'?'match':state.feedback==='mismatch'?'encourage':'ready'} reward={matchedPairs} title={done?(de?'Alle Paare gefunden!':'Bütün çiftleri buldun!'):state.feedback==='match'?(de?'Ein Stern für dich!':'Bir yıldız daha senin!'):state.feedback==='mismatch'?(de?'Merke dir die Plätze!':'Yerlerini aklında tut!'):state.feedback==='pick'?(de?'Wo ist die gleiche Form?':'Acaba eşi nerede?'):(de?'Los geht’s, Karten entdecken!':'Haydi, kartları keşfet!')} detail={done?(de?'Du kannst eine neue Runde spielen.':'Bir tur daha oynayabilirsin.'):state.feedback==='mismatch'?(de?'Die Karten drehen sich gleich zurück.':'Kartlar birazdan yeniden kapanacak.'):(de?'Zwei Karten nacheinander öffnen.':'Sırayla iki kartı çevir.')}>
      {done&&<button className="activity-btn activity-primary" onClick={()=>restart(pairCount)}><RotateCcw size={17}/>{de?'Noch mal':'Yeniden'}</button>}
    </Feedback>
  </div>;
}
export default function ActivityDrawer({pages,lang,speed,progress,onFinish,onClose,effects=true,onEffectsChange}) {
  const de=lang==='de',[page,setPage]=useState(pages[0]),[session,setSession]=useState(null),[run,setRun]=useState(0),[targetId,setTargetId]=useState(1);
  useEffect(()=>()=>stopCurrentAudio(),[]);
  const back=()=>{stopCurrentAudio();setSession(null);};
  const list=activitiesForPage(page),active=list.find(a=>a.id===session);
  return <ReaderDialog labelledBy="activity-drawer-title" onClose={onClose} className="activity-drawer-backdrop"><header className="activity-drawer-header"><div className="activity-brand"><ElifbaMark/><div><p className="activity-eyebrow">{de?'KLEINE BUCHSTABEN-ENTDECKER':'KÜÇÜK HARF KÂŞİFLERİ'}</p><h2 id="activity-drawer-title">{de?'Elif-Ba · Entdecken':'Elif-Ba · Keşfet'} · {de?'Seite':'Sayfa'} {page}</h2></div></div><div className="activity-header-actions"><button className="activity-btn" aria-label={effects?(de?'Spielklänge ausschalten':'Etkinlik seslerini kapat'):(de?'Spielklänge einschalten':'Etkinlik seslerini aç')} aria-pressed={effects} onClick={()=>{sfx.enabled=!effects;onEffectsChange?.(!effects);}}>{effects?<Volume2 size={19}/>:<VolumeX size={19}/>}</button><button className="activity-btn" onClick={onClose} aria-label={de?'Aktivitäten schließen':'Etkinlik çekmecesini kapat'}><X size={19}/><span className="activity-close-label">{de?'Schließen':'Kapat'}</span></button></div></header>
    <div className="activity-drawer-body"><div className="activity-session-heading">{active?<><button className="activity-btn" aria-label={de?'Aktivitäten':'Etkinlikler'} onClick={back}><ArrowLeft size={17}/><span>{de?'Aktivitäten':'Etkinlikler'}</span></button><h3>{active[lang]}</h3></>:<span className="activity-invite"><Sparkles size={19}/>{de?'Welches Spiel spielen wir?':'Hangi oyunu oynayalım?'}</span>}{active&&['recognize','trace'].includes(session)&&<label className="activity-letter-picker"><span className="sr-only">{de?'Übungsbuchstabe':'Çalışacağın harf'}</span><select aria-label={de?'Übungsbuchstabe':'Çalışacağın harf'} value={targetId} onChange={e=>{stopCurrentAudio();setTargetId(Number(e.target.value));}}>{LETTERS.map(l=><option key={l.id} value={l.id}>{l.char} · {letterName(l,lang)}</option>)}</select></label>}{pages.length>1&&<label className="activity-page-picker"><span className="sr-only">{de?'Aktivitätsseite':'Etkinlik sayfası'}</span><select value={page} onChange={e=>{back();setPage(Number(e.target.value));}}>{pages.map(n=><option key={n} value={n}>{de?'Seite':'Sayfa'} {n}</option>)}</select></label>}</div>
      {active?(session==='pairs'?<Pairs key={`${page}-${run}`} page={page} lang={lang} onFinish={result=>onFinish(page,session,result)}/>:session==='trace'?<LetterWorkshop key={`${page}-${run}-${targetId}`} page={page} targetId={targetId} lang={lang} speed={speed} onBack={back} onReplay={()=>setRun(n=>n+1)} onNextLetter={()=>setTargetId(LETTERS[(LETTERS.findIndex(l=>l.id===targetId)+1)%LETTERS.length].id)} onFinish={result=>onFinish(page,session,result)}/>:<ActivityRound key={`${page}-${run}-${targetId}`} page={page} targetId={targetId} onNextLetter={()=>setTargetId(LETTERS[(LETTERS.findIndex(l=>l.id===targetId)+1)%LETTERS.length].id)} mode={session} lang={lang} speed={speed} onBack={back} onReplay={()=>setRun(n=>n+1)} onFinish={result=>onFinish(page,session,result)}/>):<div className="activity-cards">{list.map(a=>{const Icon=a.id==='listen'?Headphones:a.id==='pairs'?Copy:a.id==='trace'?Pencil:Search,complete=progress.completed?.includes(activityKey(page,a.id));return <button className="activity-card" data-accent={a.id==='listen'?'sky':a.id==='pairs'?'berry':a.id==='trace'?'mint':'sun'} key={a.id} onClick={()=>{stopCurrentAudio();setSession(a.id);setRun(n=>n+1);}}><span className="activity-card-icon"><Icon size={30}/></span><strong>{a[lang]}</strong><span>{a.hint[lang]}</span><small>{complete?<><CheckCircle2 size={16}/>{de?'Noch einmal spielen':'Yeniden oyna'}</>:<>{de?'Los geht’s':'Haydi başla'}<ArrowRight size={16}/></>}</small></button>;})}</div>}
    </div><footer className="activity-drawer-footer"><span><Trophy size={13}/>{de?'In deinem Tempo · ohne Zeitlimit':'Kendi hızında · süre sınırı yok'}</span><span>{de?'Originalbuch 14–16':'Kitap 14–16'}</span></footer>
  </ReaderDialog>;
}
