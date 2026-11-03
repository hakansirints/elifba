import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Headphones, Layers, Pencil, Puzzle, RotateCcw, Search, Sparkles, Star, Timer, Trophy, Volume2, VolumeX, X } from 'lucide-react';
import ReaderDialog from './ReaderDialog';
import ActivityRound from './ActivityRound';
import AllLettersBoard from './AllLettersBoard';
import PositionWorkshop from './PositionWorkshop';
import BalloonWorkshop from './BalloonWorkshop';
import MakhrajWorkshop from './MakhrajWorkshop';
import ElifbaMark from '../common/ElifbaMark';
import {CardConfetti,Feedback,Glyph} from './ActivityPrimitives';
import { activitiesForPage, activityKey, createPairs, MEMORY_LEVELS } from '../../data/bookActivities';
import { LETTERS, letterName } from '../../data/alphabetData';
import { memoryReducer, newMemoryGame, performMonteSwap } from '../../utils/memoryGame';
import { playAudioFile, stopCurrentAudio, sfx } from '../../utils/audioPlayer';

const formatTimer = secs => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

function RehalBookIcon(props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" {...props}>
      {/* Wooden Rehal Legs (X structure) */}
      <path d="M26 80L72 44M74 80L28 44" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.95"/>
      {/* Wooden Rehal hinge & arch curve */}
      <path d="M42 63C47 59 53 59 58 63" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* Open Book Left Page */}
      <path d="M50 41C41 37 31 37 22 41C20.5 41.5 19.5 42.8 19.5 44.5L19.5 61C19.5 62.5 20.8 63.5 22 63C31 59 41 59 50 63Z" fill="var(--activity-card, #ffffff)" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"/>
      {/* Open Book Right Page */}
      <path d="M50 41C59 37 69 37 78 41C79.5 41.5 80.5 42.8 80.5 44.5L80.5 61C80.5 62.5 79.2 63.5 78 63C69 59 59 59 50 63Z" fill="var(--activity-card, #ffffff)" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"/>
      {/* Book spine line */}
      <line x1="50" y1="41" x2="50" y2="63" stroke="currentColor" strokeWidth="2.2"/>
      {/* Radiant Rays of Light (Nur) */}
      <path d="M50 19V27M37 23L42 29M63 23L58 29" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
      <circle cx="50" cy="32" r="2.8" fill="currentColor"/>
    </svg>
  );
}

const MEMORY_BEST_TIMES_KEY = 'elifba_memory_best_times_v1';

function loadBestTimes(count) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(MEMORY_BEST_TIMES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    const list = data[count];
    return Array.isArray(list) ? list.filter(n => typeof n === 'number' && n > 0).slice(0, 3) : [];
  } catch (e) {
    return [];
  }
}

function recordBestTime(count, timeInSecs) {
  if (!timeInSecs || timeInSecs <= 0) return [];
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(MEMORY_BEST_TIMES_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const current = Array.isArray(data[count]) ? data[count] : [];
    const updated = [...current, timeInSecs].sort((a, b) => a - b).slice(0, 3);
    data[count] = updated;
    window.localStorage.setItem(MEMORY_BEST_TIMES_KEY, JSON.stringify(data));
    return updated;
  } catch (e) {
    return [];
  }
}

function Pairs({page,lang,speed=1,onFinish}) {
  const de=lang==='de',[pairCount,setPairCount]=useState(6),[state,dispatch]=useReducer(memoryReducer,null,()=>newMemoryGame(createPairs(page)));
  const [intro,setIntro]=useState('reveal'); // 'reveal' | 'closing' | 'ready'
  const [roundId,setRoundId]=useState(0);
  const [confettiKeys,setConfettiKeys]=useState([]);
  const [seconds,setSeconds]=useState(0);
  const [bestTimes, setBestTimes] = useState(() => loadBestTimes(6));
  const previousMatches=useRef(0),finished=useRef(false),rootRef=useRef(null),replayRef=useRef(null);
  const done=state.feedback==='complete',matchedPairs=state.matched.length/2;

  useEffect(() => {
    let interval = null;
    if (intro === 'ready' && !done) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [intro, done]);

  // Saygı ve sükûnet ile: Kartlar açılır, harfler incelenir ("Bismillah"), ardından sakince kapanır.
  useEffect(() => {
    let tReady = null;
    setIntro('reveal');

    // 1. Harfleri tanıma ve aklında tutma aşaması (2300ms)
    const tClose = setTimeout(() => {
      setIntro('closing');
      sfx.playFlip();

      // 2. Kartların kapanışı ve oyuna başlama
      tReady = setTimeout(() => {
        setIntro('ready');
      }, 450);
    }, 2300);

    return () => {
      clearTimeout(tClose);
      if (tReady) clearTimeout(tReady);
    };
  }, [roundId]);

  useEffect(()=>{
    if(state.feedback!=='mismatch')return;
    const timer=setTimeout(()=>dispatch({type:'conceal'}),1100);return()=>clearTimeout(timer);
  },[state.feedback]);
  useEffect(()=>{
    if(state.matched.length<=previousMatches.current)return;
    const newlyMatched = state.matched.slice(previousMatches.current);
    previousMatches.current=state.matched.length;
    setConfettiKeys(newlyMatched);
    const confTimer = setTimeout(()=>setConfettiKeys([]),800);
    if(done){
      sfx.playSuccess();
      if(!finished.current){
        finished.current=true;
        onFinish({correct:pairCount,total:pairCount});
        const currentSecs = Math.max(seconds, 1);
        const updatedBest = recordBestTime(pairCount, currentSecs);
        setBestTimes(updatedBest);
      }
      replayRef.current?.focus({preventScroll:true});
    } else {
      sfx.playStar();
      rootRef.current?.querySelector('.memory-card:not(:disabled)')?.focus({preventScroll:true});
    }
    return ()=>clearTimeout(confTimer);
  },[state.matched,done,pairCount,seconds]);
  const restart=count=>{
    previousMatches.current=0;
    finished.current=false;
    setConfettiKeys([]);
    setSeconds(0);
    setPairCount(count);
    setBestTimes(loadBestTimes(count));
    const newCards = createPairs(page,Math.random,count);
    dispatch({type:'restart',cards:newCards});
    setRoundId(n => n + 1);
  };
  const flip=key=>{
    if(intro!=='ready'||state.open.length===2||state.matched.includes(key)||state.open.includes(key))return;
    sfx.playFlip();
    const card=state.cards.find(c=>c.key===key);
    if(card?.letter?.audio){
      playAudioFile(card.letter.audio,{label:letterName(card.letter,lang),speed,presentation:'activity'});
    }
    dispatch({type:'flip',key});
  };
  const isCardOpen = c => intro==='reveal' || state.open.includes(c.key) || state.matched.includes(c.key);
  return <div className="memory-game activity-game-frame" ref={rootRef}>
    <div className="memory-toolbar">
      <label>{de?'Paare':'Çift sayısı'}
        <select aria-label={de?'Anzahl der Paare':'Çift sayısı'} value={pairCount} onChange={e=>restart(Number(e.target.value))}>
          {MEMORY_LEVELS.map(n=><option key={n} value={n}>{n} {de?'Paare':'çift'}</option>)}
        </select>
      </label>
      <div className="memory-stats">
        <span className="memory-meter"><Star size={16} fill="currentColor"/>{matchedPairs} / {pairCount} <span className="memory-turns">· {state.turns} {de?'Versuche':'deneme'}</span></span>
        <span className="activity-timer-badge" aria-label={de?`Zeit: ${formatTimer(seconds)}`:`Süre: ${formatTimer(seconds)}`}><Timer size={14}/><span>{formatTimer(seconds)}</span></span>
        {bestTimes.length > 0 && (
          <span className="memory-best-badge" title={de ? `Top 3 Zeiten: ${bestTimes.map((s, idx) => `${idx + 1}. ${formatTimer(s)}`).join(' · ')}` : `En iyi 3 süre: ${bestTimes.map((s, idx) => `${idx + 1}. ${formatTimer(s)}`).join(' · ')}`}>
            <Trophy size={13}/>
            <span>{formatTimer(bestTimes[0])}</span>
          </span>
        )}
      </div>
      <button ref={replayRef} className="activity-btn" onClick={()=>restart(pairCount)} aria-label={de?'Neu mischen':'Kartları yeniden karıştır'}>
        <RotateCcw size={17}/>
      </button>
    </div>
    <div className={`activity-pairs pairs-${pairCount}`} style={{'--memory-cols':pairCount}} aria-label={de?'Buchstaben-Memory':'Harf hafıza kartları'}>{state.cards.map((c,i)=>{const matched=state.matched.includes(c.key),open=isCardOpen(c),hasConfetti=confettiKeys.includes(c.key);return <button className={`memory-card ${open?'is-open':''} ${intro==='reveal'?'is-intro-reveal':''} ${matched?'is-matched':''} ${hasConfetti?'has-confetti':''}`} key={c.key} style={{'--card-i':i}} aria-label={open?`${letterName(c.letter,lang)}${matched?(de?' · gefunden':' · eşleşti'):''}`:(de?`Karte ${i+1} öffnen`:`${i+1}. kartı aç`)} aria-pressed={open} aria-disabled={intro!=='ready'||state.open.length===2||open} disabled={intro!=='ready'||matched} onClick={()=>flip(c.key)}><span className="memory-card-inner"><span className="memory-face memory-back" aria-hidden="true"><RehalBookIcon/><small>{i+1}</small></span><span className="memory-face memory-front" aria-hidden={!open}><Glyph letter={c.letter}/>{matched&&<span className="memory-check"><Check size={16}/></span>}</span></span>{hasConfetti&&<CardConfetti/>}</button>;})}</div>
    <Feedback
      tone={done?'complete':intro!=='ready'?'ready':state.feedback==='match'?'match':state.feedback==='mismatch'?'encourage':'ready'}
      reward={matchedPairs}
      title={
        done
          ? (de?`Alle Paare in ${formatTimer(seconds)} gefunden!`:`Bütün çiftleri ${formatTimer(seconds)} sürede buldun!`)
          : intro==='reveal'
          ? (de?'Bismillah · Buchstaben einprägen':'Bismillah · Harflerin yerlerine dikkatle bak')
          : intro==='closing'
          ? (de?'Bismillah, finde die Paare!':'Bismillah, haydi eşlerini bul!')
          : state.feedback==='match'
          ? (de?'Ein Stern für dich!':'Bir yıldız daha senin!')
          : state.feedback==='mismatch'
          ? (de?'Yerlerini aklında tut!':'Yerlerini aklında tut!')
          : state.feedback==='pick'
          ? (de?'Wo ist die gleiche Form?':'Acaba eşi nerede?')
          : (de?'Los geht’s, Karten entdecken!':'Haydi, kartları keşfet!')
      }
      detail={
        done
          ? (bestTimes.length > 0
              ? (de
                  ? `🏆 Beste 3 Zeiten: ${bestTimes.map((s, idx) => `${idx + 1}. ${formatTimer(s)}`).join('   ·   ')}`
                  : `🏆 En İyi 3 Süre: ${bestTimes.map((s, idx) => `${idx + 1}. ${formatTimer(s)}`).join('   ·   ')}`)
              : (de ? 'Du kannst eine neue Runde spielen.' : 'Bir tur daha oynayabilirsin.'))
          : intro==='reveal'
          ? (de?'Schau dir die Buchstaben in Ruhe an, gleich wenden sich die Karten.':'Harflere sükunetle bak ve aklında tut, birazdan kartlar ters çevrilecek.')
          : intro==='closing'
          ? (de?'Öffne nacheinander zwei Karten mit Bedacht.':'Sırayla iki kart açarak aynı harfleri eşleştir.')
          : state.feedback==='mismatch'
          ? (de?'Die Karten drehen sich gleich zurück.':'Kartlar birazdan yeniden kapanacak.')
          : (de?'Zwei Karten nacheinander öffnen.':'Sırayla iki kartı çevir.')
      }
    >
      {done&&<button className="activity-btn activity-primary" onClick={()=>restart(pairCount)}><RotateCcw size={17}/>{de?'Noch mal':'Yeniden'}</button>}
    </Feedback>
  </div>;
}
export default function ActivityDrawer({pages,lang,speed,progress,onFinish,onClose,effects=true,onEffectsChange,initialSession=null,initialPage=null}) {
  const de=lang==='de',[page,setPage]=useState(initialPage||pages[0]),[session,setSession]=useState(initialSession),[run,setRun]=useState(0),[targetId,setTargetId]=useState('random');
  useEffect(()=>()=>stopCurrentAudio(),[]);
  const back=()=>{stopCurrentAudio();setSession(null);};
  const list=activitiesForPage(page),active=list.find(a=>a.id===session);
  const resolvedTarget = typeof targetId === 'number' ? targetId : LETTERS[Math.floor(Math.random() * LETTERS.length)].id;
  return <ReaderDialog labelledBy="activity-drawer-title" onClose={onClose} className="activity-drawer-backdrop"><header className="activity-drawer-header"><div className="activity-brand"><ElifbaMark/><div><p className="activity-eyebrow">{de?'KLEINE BUCHSTABEN-ENTDECKER':'KÜÇÜK HARF KÂŞİFLERİ'}</p><h2 id="activity-drawer-title">{de?'Elif-Ba · Entdecken':'Elif-Ba · Keşfet'} · {de?'Seite':'Sayfa'} {page}</h2></div></div><div className="activity-header-actions"><button className="activity-btn" aria-label={effects?(de?'Spielklänge ausschalten':'Etkinlik seslerini kapat'):(de?'Spielklänge einschalten':'Etkinlik seslerini aç')} aria-pressed={effects} onClick={()=>{sfx.enabled=!effects;onEffectsChange?.(!effects);}}>{effects?<Volume2 size={19}/>:<VolumeX size={19}/>}</button><button className="activity-btn" onClick={onClose} aria-label={de?'Aktivitäten schließen':'Etkinlik çekmecesini kapat'}><X size={19}/><span className="activity-close-label">{de?'Schließen':'Kapat'}</span></button></div></header>
    <div className="activity-drawer-body">
      {session !== 'trace' && session !== 'balloon' && session !== 'makhraj' && !['train', 'chameleon', 'detective', 'puzzle'].includes(session) && (
        <div className="activity-session-heading">
          {active ? (
            <>
              <button className="activity-btn" aria-label={de ? 'Aktivitäten' : 'Etkinlikler'} onClick={back}>
                <ArrowLeft size={17}/><span>{de ? 'Aktivitäten' : 'Etkinlikler'}</span>
              </button>
              <h3>{active[lang]}</h3>
            </>
          ) : (
            <span className="activity-invite"><Sparkles size={19}/>{de ? 'Welches Spiel spielen wir?' : 'Hangi oyunu oynayalım?'}</span>
          )}
          {active && session === 'recognize' && (
            <label className="activity-letter-picker">
              <span className="sr-only">{de ? 'Übungsbuchstabe' : 'Çalışacağın harf'}</span>
              <select aria-label={de ? 'Übungsbuchstabe' : 'Çalışacağın harf'} value={targetId} onChange={e => { stopCurrentAudio(); const val = e.target.value; setTargetId(val === 'random' ? val : Number(val)); }}>
                <option value="random">🎲 {de ? 'Zufällige Buchstaben' : 'Rastgele Harfler'}</option>
                <optgroup label={de ? 'Buchstaben' : 'Harfler'}>
                  {LETTERS.map(l => <option key={l.id} value={l.id}>{l.char} · {letterName(l, lang)}</option>)}
                </optgroup>
              </select>
            </label>
          )}
        </div>
      )}
      {active ? (
        session === 'balloon' ? (
          <BalloonWorkshop
            key={`balloon-${page}-${run}`}
            lang={lang}
            speed={speed}
            onBack={back}
            onFinish={result => onFinish(page, session, result)}
          />
        ) : session === 'makhraj' ? (
          <MakhrajWorkshop
            key={`makhraj-${page}-${run}`}
            lang={lang}
            speed={speed}
            onBack={back}
            onFinish={result => onFinish(page, session, result)}
          />
        ) : ['train', 'chameleon', 'detective', 'puzzle'].includes(session) ? (
          <PositionWorkshop
            key={`pos-${page}-${session}-${run}`}
            mode={session}
            page={page}
            lang={lang}
            speed={speed}
            onBack={back}
            onFinish={result => onFinish(page, session, result)}
          />
        ) : session === 'trace' ? (
          <AllLettersBoard key={`all-${page}-${run}`} lang={lang} speed={speed} onBack={back} onFinish={result => onFinish(page, session, result)} />
        ) : session === 'pairs' ? (
          <Pairs key={`${page}-${run}`} page={page} lang={lang} speed={speed} onFinish={result => onFinish(page, session, result)} />
        ) : (
          <ActivityRound
            key={`${page}-${run}-${targetId}`}
            page={page}
            targetId={resolvedTarget}
            onNextLetter={() => {
              if (targetId === 'random') {
                setRun(n => n + 1);
              } else {
                setTargetId(LETTERS[(LETTERS.findIndex(l => l.id === targetId) + 1) % LETTERS.length].id);
              }
            }}
            mode={session}
            lang={lang}
            speed={speed}
            onBack={back}
            onReplay={() => setRun(n => n + 1)}
            onFinish={result => onFinish(page, session, result)}
          />
        )
      ) : (
        <div className="activity-cards">
          {list.filter(a => !(page === 14 && ['balloon', 'listen'].includes(a.id))).map(a => {
            const Icon = a.id === 'balloon' ? Sparkles
              : a.id === 'makhraj' ? Volume2
              : a.id === 'listen' ? Headphones
              : a.id === 'pairs' ? Copy
              : a.id === 'trace' ? Sparkles
              : a.id === 'puzzle' ? Puzzle
              : a.id === 'train' ? Layers
              : a.id === 'chameleon' ? Sparkles
              : Search;
            const accent = a.id === 'balloon' ? 'berry'
              : a.id === 'makhraj' ? 'sky'
              : a.id === 'listen' || a.id === 'train' ? 'sky'
              : a.id === 'pairs' || a.id === 'chameleon' ? 'berry'
              : a.id === 'trace' || a.id === 'puzzle' ? 'mint'
              : 'sun';
            const complete = progress.completed?.includes(activityKey(page, a.id));
            return (
              <button
                className="activity-card"
                data-accent={accent}
                key={a.id}
                onClick={() => { stopCurrentAudio(); setSession(a.id); setRun(n => n + 1); }}
              >
                <span className="activity-card-icon"><Icon size={30} /></span>
                <strong>{a[lang]}</strong>
                <span>{a.hint[lang]}</span>
                <small>{complete ? <><CheckCircle2 size={16} />{de ? 'Noch einmal spielen' : 'Yeniden oyna'}</> : <>{de ? 'Los geht’s' : 'Haydi başla'}<ArrowRight size={16} /></>}</small>
              </button>
            );
          })}
        </div>
      )}
    </div>
  </ReaderDialog>;
}
