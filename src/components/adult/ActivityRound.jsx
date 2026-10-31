import React, {useEffect,useReducer,useRef,useState} from 'react';
import {ArrowRight,Check,ChevronLeft,ChevronRight,Star,Volume2} from 'lucide-react';
import {BOOK_ROW_PAGES,createMiniLesson,createQuestions} from '../../data/bookActivities';
import {letterById,letterName} from '../../data/alphabetData';
import {activityRoundReducer,newActivityRound} from '../../utils/activityRound';
import {playAudioFile,stopCurrentAudio,sfx} from '../../utils/audioPlayer';
import {Buddy,Feedback,Finish,Glyph} from './ActivityPrimitives';

export default function ActivityRound({page,mode,lang,speed,targetId,onFinish,onBack,onReplay,onNextLetter}) {
  const de=lang==='de',mini=mode==='recognize';
  const [questions]=useState(()=>mini?createMiniLesson(page,targetId):createQuestions(page,mode));
  const [state,dispatch]=useReducer(activityRoundReducer,undefined,newActivityRound);
  const [audioError,setAudioError]=useState(false);
  const [rowPage,setRowPage]=useState(()=>Math.max(0,BOOK_ROW_PAGES.findIndex(p=>p.rows.flat().includes(questions[0].letter.id))));
  const headingRef=useRef(null),actionRef=useRef(null),audioToken=useRef(0),submitted=useRef(false);
  const q=questions[state.index],letter=q.letter,kind=q.kind||mode;
  const right=state.checked&&state.selected===letter.id,wrong=state.checked&&!right,requiresAudio=kind==='listen';
  useEffect(()=>{headingRef.current?.focus({preventScroll:true});},[state.index]);
  useEffect(()=>{if(state.checked)actionRef.current?.focus({preventScroll:true});},[state.checked]);
  useEffect(()=>()=>{audioToken.current++;stopCurrentAudio();},[]);
  const listen=()=>{
    const token=++audioToken.current;setAudioError(false);
    const audio=playAudioFile(letter.audio,{label:letterName(letter,lang),speed,presentation:'activity',onError:()=>{if(audioToken.current===token){setAudioError(true);dispatch({type:'audioError'});}}});
    audio?.addEventListener('playing',()=>{if(audioToken.current===token)dispatch({type:'heard'});},{once:true});
  };
  const choose=id=>dispatch({type:'choose',id,requiresAudio});
  const act=()=>{
    if(wrong){dispatch({type:'retry',target:letter.id});return;}
    if(!state.checked){
      if(state.selected===null||requiresAudio&&!state.heard)return;
      audioToken.current++;stopCurrentAudio();
      dispatch({type:'check',target:letter.id,requiresAudio});
      if(state.selected===letter.id)sfx.playStar();
      return;
    }
    audioToken.current++;stopCurrentAudio();
    if(state.index===questions.length-1&&!submitted.current){submitted.current=true;sfx.playSuccess();onFinish({correct:state.correct,total:questions.length});}
    const nextLetter=questions[state.index+1]?.letter.id;
    if(nextLetter&&!BOOK_ROW_PAGES[rowPage].rows.flat().includes(nextLetter))setRowPage(BOOK_ROW_PAGES.findIndex(p=>p.rows.flat().includes(nextLetter)));
    setAudioError(false);dispatch({type:'next',target:letter.id,total:questions.length});
  };
  if(state.done)return <Finish lang={lang} correct={state.correct} total={questions.length} onBack={onBack} onReplay={onReplay} onNextLetter={mini?onNextLetter:undefined}/>;
  const title=kind==='listen'?(de?'Welchen Buchstaben hörst du?':'Hangi harfi duydun?'):['grid','shape'].includes(kind)?(de?'Finde die gleiche Form.':'Aynı harfi bul.'):(de?`Wo ist ${letterName(letter,lang)}?`:`${letterName(letter,lang)} harfini bul.`);
  const detail=wrong?letter.shape[lang]:right?`${letter.char} · ${letterName(letter,lang)}`:requiresAudio&&!state.heard?(de?'Erst anhören, dann wählen.':'Önce kaydı dinle, sonra seç.'):state.selected!==null?(de?'Mit „Prüfen“ bestätigen.':'Kontrol et düğmesine dokun.'):(de?'Nimm dir Zeit.':'Acele etmeden seçebilirsin.');
  return <div className="activity-round activity-game-frame">
    <div className="activity-round-meta"><span>{mini?(de?['Erkennen','Hören','Unterscheiden'][state.index]:['Tanı','Dinle','Ayırt et'][state.index]):(de?'Entdeckung':'Keşif')} · {state.index+1} / {questions.length}</span><progress value={state.index+(right?1:0)} max={questions.length} aria-label={de?'Fortschritt':'Etkinlik ilerlemesi'}/><span className="activity-stars"><Star size={15}/>{state.correct}</span></div>
    <div className="activity-workspace"><section className="activity-prompt"><Buddy happy={right}/><h3 ref={headingRef} tabIndex={-1}>{title}</h3>
      {['grid','shape'].includes(kind)?<div className="activity-target"><Glyph letter={letter}/></div>:kind==='listen'?<button className="activity-btn activity-primary" onClick={listen}><Volume2 size={20}/>{de?'Anhören':'Dinle'}</button>:<span className="activity-prompt-hint">{letter.shape[lang]}</span>}
      {audioError&&<p className="activity-audio-error" role="alert">{de?'Bitte erneut anhören.':'Ses açılamadı, yeniden dokun.'}</p>}
    </section><div className="activity-board">
      {kind==='grid'?<><div className="activity-grid-pager"><button className="activity-btn" aria-label={de?'Vorherige Reihen':'Önceki satırlar'} disabled={rowPage===0} onClick={()=>setRowPage(n=>n-1)}><ChevronLeft size={18}/></button><label><span className="sr-only">{de?'Buchreihen':'Kitaptaki satırlar'}</span><select value={rowPage} onChange={e=>setRowPage(Number(e.target.value))}>{BOOK_ROW_PAGES.map((p,n)=><option key={n} value={n}>{de?'Reihen':'Satır'} {p.start+1}–{p.start+2}</option>)}</select></label><button className="activity-btn" aria-label={de?'Nächste Reihen':'Sonraki satırlar'} disabled={rowPage===4} onClick={()=>setRowPage(n=>n+1)}><ChevronRight size={18}/></button></div><div className="activity-book-grid" aria-label={de?'Buchstabenfeld der Seite 16':'Sayfa 16 harf tablosu'}>{BOOK_ROW_PAGES[rowPage].rows.map((row,r)=><div key={`${rowPage}-${r}`} dir="rtl"><small>{BOOK_ROW_PAGES[rowPage].start+r+1}</small>{row.map((id,c)=><button className={`activity-letter ${state.selected===id?'is-selected':''} ${right&&id===letter.id?'is-correct':''} ${wrong&&state.selected===id?'is-incorrect':''}`} key={c} aria-label={de?`Reihe ${BOOK_ROW_PAGES[rowPage].start+r+1}, Spalte ${'ABCDEF'[c]}`:`Satır ${BOOK_ROW_PAGES[rowPage].start+r+1}, sütun ${'ABCDEF'[c]}`} aria-pressed={state.selected===id} disabled={state.checked} onClick={()=>choose(id)}><Glyph letter={letterById(id)}/></button>)}</div>)}</div></>:<div className="activity-options" dir="rtl" style={{'--option-count':q.options.length}}>{q.options.map(l=><button className={`activity-letter ${state.selected===l.id?'is-selected':''} ${right&&l.id===letter.id?'is-correct':''} ${wrong&&state.selected===l.id?'is-incorrect':''}`} key={l.id} disabled={state.checked||(requiresAudio&&!state.heard)} onClick={()=>choose(l.id)} aria-label={letterName(l,lang)} aria-pressed={state.selected===l.id}><Glyph letter={l}/>{right&&l.id===letter.id&&<Check className="answer-check" size={20}/>}</button>)}</div>}
    </div></div>
    <Feedback tone={right?'correct':wrong?'encourage':'ready'} reward={state.index} title={right?(de?'Super gefunden!':'Harika buldun!'):wrong?(de?'Schauen wir noch einmal.':'Birlikte yeniden bakalım.'):(de?'Du schaffst das!':'Haydi, sen bulabilirsin!')} detail={detail}>
      {state.checked&&<button className="activity-btn activity-sound" onClick={listen} aria-label={de?'Buchstaben hören':'Harfi dinle'}><Volume2 size={18}/></button>}
      <button ref={actionRef} className="activity-btn activity-primary" disabled={!state.checked&&(state.selected===null||requiresAudio&&!state.heard)} onClick={act}>{wrong?(de?'Noch einmal':'Yeniden dene'):right?(state.index===questions.length-1?(de?'Fertig':'Bitir'):(de?'Weiter':'Devam')):(de?'PRÜFEN':'KONTROL ET')}{right&&<ArrowRight size={17}/>}</button>
    </Feedback>
  </div>;
}
