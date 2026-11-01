import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Headphones, Layers, Pencil, Puzzle, RotateCcw, Search, Sparkles, Star, Timer, Trophy, Volume2, VolumeX, X } from 'lucide-react';
import ReaderDialog from './ReaderDialog';
import ActivityRound from './ActivityRound';
import AllLettersBoard from './AllLettersBoard';
import PositionWorkshop from './PositionWorkshop';
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

function Pairs({page,lang,speed=1,onFinish}) {
  const de=lang==='de',[pairCount,setPairCount]=useState(6),[state,dispatch]=useReducer(memoryReducer,null,()=>newMemoryGame(createPairs(page)));
  const [intro,setIntro]=useState('reveal'); // 'reveal' | 'swapping' | 'closing' | 'ready'
  const [roundId,setRoundId]=useState(0);
  const [confettiKeys,setConfettiKeys]=useState([]);
  const [seconds,setSeconds]=useState(0);
  const previousMatches=useRef(0),finished=useRef(false),rootRef=useRef(null),replayRef=useRef(null);
  const cardRefs=useRef(new Map()),prevRectsRef=useRef(null),cardsRef=useRef(state.cards);
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

  cardsRef.current=state.cards;

  const doSwap = () => {
    const rects = new Map();
    cardRefs.current.forEach((el, key) => {
      if (el) rects.set(key, el.getBoundingClientRect());
    });
    prevRectsRef.current = rects;
    sfx.playFlip();

    const nextCards = performMonteSwap(cardsRef.current);
    cardsRef.current = nextCards;
    dispatch({ type: 'shuffle', cards: nextCards });
  };

  useLayoutEffect(() => {
    const prevRects = prevRectsRef.current;
    if (!prevRects || prevRects.size === 0) return;
    prevRectsRef.current = null;

    const cardsToMove = [];
    cardRefs.current.forEach((el, key) => {
      if (!el) return;
      const prev = prevRects.get(key);
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

    // INVERT: Position element visually at previous spot before paint
    cardsToMove.forEach(({ el, dx, dy, rot }) => {
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.07)`;
      el.style.transition = 'none';
      el.style.zIndex = '25';
      el.style.boxShadow = '0 12px 28px rgba(0,0,0,0.28)';
    });

    // Force reflow
    if (typeof document !== 'undefined') {
      document.body.getBoundingClientRect();
    }

    // PLAY: Animate smoothly to new slot
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
  }, [state.cards]);

  // "Bul karayı al parayı" 3-round rapid position swap sequence
  useEffect(() => {
    let t0, t1, t2, tClose, tReady;
    setIntro('reveal');

    // 1. Reveal phase: cards open for 1200ms
    t0 = setTimeout(() => {
      setIntro('swapping');

      // Swap 1
      doSwap();

      // Swap 2
      t1 = setTimeout(() => {
        doSwap();

        // Swap 3
        t2 = setTimeout(() => {
          doSwap();

          // Settle, then close cards
          tClose = setTimeout(() => {
            setIntro('closing');
            sfx.playFlip();

            // Ready for interactive game
            tReady = setTimeout(() => {
              setIntro('ready');
            }, 420);
          }, 450);
        }, 520);
      }, 520);
    }, 1300);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tClose);
      clearTimeout(tReady);
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
    if(done){sfx.playSuccess();if(!finished.current){finished.current=true;onFinish({correct:pairCount,total:pairCount});}replayRef.current?.focus({preventScroll:true});}
    else {sfx.playStar();rootRef.current?.querySelector('.memory-card:not(:disabled)')?.focus({preventScroll:true});}
    return ()=>clearTimeout(confTimer);
  },[state.matched,done,pairCount]);
  const restart=count=>{
    previousMatches.current=0;
    finished.current=false;
    setConfettiKeys([]);
    setSeconds(0);
    setPairCount(count);
    const newCards = createPairs(page,Math.random,count);
    cardsRef.current = newCards;
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
  const isCardOpen = c => intro==='reveal' || intro==='swapping' || state.open.includes(c.key) || state.matched.includes(c.key);
  return <div className="memory-game activity-game-frame" ref={rootRef}>
    <div className="memory-toolbar"><label>{de?'Paare':'Çift sayısı'}<select aria-label={de?'Anzahl der Paare':'Çift sayısı'} value={pairCount} onChange={e=>restart(Number(e.target.value))}>{MEMORY_LEVELS.map(n=><option key={n} value={n}>{n} {de?'Paare':'çift'}</option>)}</select></label><div className="memory-stats"><span className="memory-meter"><Star size={16} fill="currentColor"/>{matchedPairs} / {pairCount} <span className="memory-turns">· {state.turns} {de?'Versuche':'deneme'}</span></span><span className="activity-timer-badge" aria-label={de?`Zeit: ${formatTimer(seconds)}`:`Süre: ${formatTimer(seconds)}`}><Timer size={14}/><span>{formatTimer(seconds)}</span></span></div><button ref={replayRef} className="activity-btn" onClick={()=>restart(pairCount)} aria-label={de?'Neu mischen':'Kartları yeniden karıştır'}><RotateCcw size={17}/></button></div>
    <div className={`activity-pairs pairs-${pairCount} ${intro==='swapping'?'is-cards-swapping':''}`} style={{'--memory-cols':pairCount}} aria-label={de?'Buchstaben-Memory':'Harf hafıza kartları'}>{state.cards.map((c,i)=>{const matched=state.matched.includes(c.key),open=isCardOpen(c),hasConfetti=confettiKeys.includes(c.key);return <button ref={el=>{if(el)cardRefs.current.set(c.key,el);else cardRefs.current.delete(c.key);}} className={`memory-card ${open?'is-open':''} ${intro==='reveal'?'is-intro-reveal':''} ${intro==='swapping'?'is-shuffling':''} ${matched?'is-matched':''} ${hasConfetti?'has-confetti':''}`} key={c.key} style={{'--card-i':i}} aria-label={open?`${letterName(c.letter,lang)}${matched?(de?' · gefunden':' · eşleşti'):''}`:(de?`Karte ${i+1} öffnen`:`${i+1}. kartı aç`)} aria-pressed={open} aria-disabled={intro!=='ready'||state.open.length===2||open} disabled={intro!=='ready'||matched} onClick={()=>flip(c.key)}><span className="memory-card-inner"><span className="memory-face memory-back" aria-hidden="true"><RehalBookIcon/><small>{i+1}</small></span><span className="memory-face memory-front" aria-hidden={!open}><Glyph letter={c.letter}/>{matched&&<span className="memory-check"><Check size={16}/></span>}</span></span>{hasConfetti&&<CardConfetti/>}</button>;})}</div>
    <Feedback tone={done?'complete':intro!=='ready'?'ready':state.feedback==='match'?'match':state.feedback==='mismatch'?'encourage':'ready'} reward={matchedPairs} title={done?(de?`Alle Paare in ${formatTimer(seconds)} gefunden!`:`Bütün çiftleri ${formatTimer(seconds)} sürede buldun!`):intro==='reveal'?(de?'Merke dir die Buchstaben!':'Harflerin yerlerine dikkatle bak!'):intro==='swapping'?(de?'Bul karayı al parayı! Karten mischen sich...':'Bul karayı al parayı! Harfler hızla yer değiştiriyor...'):intro==='closing'?(de?'Jetzt geht’s los!':'Kartlar kapandı, haydi başla!'):state.feedback==='match'?(de?'Ein Stern für dich!':'Bir yıldız daha senin!'):state.feedback==='mismatch'?(de?'Merke dir die Plätze!':'Yerlerini aklında tut!'):state.feedback==='pick'?(de?'Wo ist die gleiche Form?':'Acaba eşi nerede?'):(de?'Los geht’s, Karten entdecken!':'Haydi, kartları keşfet!')} detail={done?(de?'Du kannst eine neue Runde spielen.':'Bir tur daha oynayabilirsin.'):intro==='reveal'?(de?'Schau genau hin, gleich beginnen die Karten zu wandern!':'Harflere dikkatle bak, birazdan hızla yer değiştirecekler!'):intro==='swapping'?(de?'Verfolge die Positionen der Buchstaben mit den Augen!':'Gözünü ayırma, harflerin yeni yerlerini takip et!'):intro==='closing'?(de?'Finde die Paare an ihren neuen Plätzen.':'Bakalım yer değiştiren harflerin yeni yerlerini bulabilecek misin?'):state.feedback==='mismatch'?(de?'Die Karten drehen sich gleich zurück.':'Kartlar birazdan yeniden kapanacak.'):(de?'Zwei Karten nacheinander öffnen.':'Sırayla iki kartı çevir.')}>
      {done&&<button className="activity-btn activity-primary" onClick={()=>restart(pairCount)}><RotateCcw size={17}/>{de?'Noch mal':'Yeniden'}</button>}
    </Feedback>
  </div>;
}
export default function ActivityDrawer({pages,lang,speed,progress,onFinish,onClose,effects=true,onEffectsChange}) {
  const de=lang==='de',[page,setPage]=useState(pages[0]),[session,setSession]=useState(null),[run,setRun]=useState(0),[targetId,setTargetId]=useState('random');
  useEffect(()=>()=>stopCurrentAudio(),[]);
  const back=()=>{stopCurrentAudio();setSession(null);};
  const list=activitiesForPage(page),active=list.find(a=>a.id===session);
  const resolvedTarget = typeof targetId === 'number' ? targetId : LETTERS[Math.floor(Math.random() * LETTERS.length)].id;
  return <ReaderDialog labelledBy="activity-drawer-title" onClose={onClose} className="activity-drawer-backdrop"><header className="activity-drawer-header"><div className="activity-brand"><ElifbaMark/><div><p className="activity-eyebrow">{de?'KLEINE BUCHSTABEN-ENTDECKER':'KÜÇÜK HARF KÂŞİFLERİ'}</p><h2 id="activity-drawer-title">{de?'Elif-Ba · Entdecken':'Elif-Ba · Keşfet'} · {de?'Seite':'Sayfa'} {page}</h2></div></div><div className="activity-header-actions"><button className="activity-btn" aria-label={effects?(de?'Spielklänge ausschalten':'Etkinlik seslerini kapat'):(de?'Spielklänge einschalten':'Etkinlik seslerini aç')} aria-pressed={effects} onClick={()=>{sfx.enabled=!effects;onEffectsChange?.(!effects);}}>{effects?<Volume2 size={19}/>:<VolumeX size={19}/>}</button><button className="activity-btn" onClick={onClose} aria-label={de?'Aktivitäten schließen':'Etkinlik çekmecesini kapat'}><X size={19}/><span className="activity-close-label">{de?'Schließen':'Kapat'}</span></button></div></header>
    <div className="activity-drawer-body">
      {session !== 'trace' && !['train', 'chameleon', 'detective', 'puzzle'].includes(session) && (
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
        ['train', 'chameleon', 'detective', 'puzzle'].includes(session) ? (
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
          {list.map(a => {
            const Icon = a.id === 'listen' ? Headphones
              : a.id === 'pairs' ? Copy
              : a.id === 'trace' ? Sparkles
              : a.id === 'puzzle' ? Puzzle
              : a.id === 'train' ? Layers
              : a.id === 'chameleon' ? Sparkles
              : Search;
            const accent = a.id === 'listen' || a.id === 'train' ? 'sky'
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
    </div><footer className="activity-drawer-footer"><span><Trophy size={13}/>{de?'In deinem Tempo · ohne Zeitlimit':'Kendi hızında · süre sınırı yok'}</span><span>{de ? (page === 17 ? 'Originalbuch 17' : 'Originalbuch 14–16') : (page === 17 ? 'Kitap 17' : 'Kitap 14–16')}</span></footer>
  </ReaderDialog>;
}
