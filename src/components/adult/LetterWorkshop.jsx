import React, {useCallback,useEffect,useReducer,useRef,useState} from 'react';
import {ArrowRight,Check,Eraser,Volume2} from 'lucide-react';
import {createMiniLesson} from '../../data/bookActivities';
import {letterName} from '../../data/alphabetData';
import {activityRoundReducer,newActivityRound} from '../../utils/activityRound';
import {playAudioFile,stopCurrentAudio,sfx} from '../../utils/audioPlayer';
import {Buddy,Feedback,Finish,Glyph} from './ActivityPrimitives';

function DrawingPad({letter,lang,onChange}) {
  const canvasRef=useRef(null),paths=useRef([]),current=useRef(null);
  const [paper,setPaper]=useState(false),[drawn,setDrawn]=useState(false),de=lang==='de';
  const render=()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const rect=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2);
    if(!rect.width||!rect.height)return;
    const w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    const ctx=canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,rect.width,rect.height);
    ctx.strokeStyle=getComputedStyle(canvas).color;ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';
    for(const path of [...paths.current,...(current.current?[current.current.points]:[])]){
      if(!path.length)continue;
      if(path.length===1){ctx.beginPath();ctx.arc(path[0][0]*rect.width,path[0][1]*rect.height,3,0,Math.PI*2);ctx.fill();continue;}
      ctx.beginPath();path.forEach(([x,y],i)=>i?ctx.lineTo(x*rect.width,y*rect.height):ctx.moveTo(x*rect.width,y*rect.height));ctx.stroke();
    }
  };
  useEffect(()=>{const observer=new ResizeObserver(render);observer.observe(canvasRef.current);render();return()=>observer.disconnect();},[]);
  useEffect(()=>{onChange(drawn||paper);},[drawn,paper,onChange]);
  const point=e=>{const r=e.currentTarget.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];};
  const start=e=>{
    if(e.button!==0||current.current)return;
    e.currentTarget.setPointerCapture(e.pointerId);current.current={id:e.pointerId,points:[point(e)]};render();
  };
  const move=e=>{if(current.current?.id!==e.pointerId)return;current.current.points.push(point(e));render();};
  const end=e=>{if(current.current?.id!==e.pointerId)return;paths.current.push(current.current.points);current.current=null;setDrawn(true);render();};
  return <div className="activity-drawing"><div className="activity-canvas-wrap"><span className="activity-trace-guide" lang="ar" dir="rtl" aria-hidden="true">{letter.char}</span><canvas ref={canvasRef} aria-label={de?'Freies Zeichenfeld; alternativ auf Papier zeichnen und unten bestätigen.':'Serbest çizim alanı; kâğıtta çizip aşağıdaki kutuyla da onaylayabilirsin.'} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}/></div>
    <div className="activity-pencil-tools"><button className="activity-btn" onClick={()=>{paths.current=[];current.current=null;setDrawn(false);render();}}><Eraser size={16}/>{de?'Löschen':'Temizle'}</button><label><input type="checkbox" checked={paper} onChange={e=>setPaper(e.target.checked)}/>{de?'Auf Papier gezeichnet':'Kâğıtta çizdim'}</label></div>
  </div>;
}

export default function LetterWorkshop({page,targetId,lang,speed,onFinish,onBack,onReplay,onNextLetter}) {
  const de=lang==='de',[q]=useState(()=>createMiniLesson(page,targetId)[2]),letter=q.letter;
  const [tab,setTab]=useState('listen'),[heard,setHeard]=useState(false),[error,setError]=useState(false),[drawn,setDrawn]=useState(false),[reviewed,setReviewed]=useState(false),[done,setDone]=useState(false);
  const [answer,dispatch]=useReducer(activityRoundReducer,undefined,newActivityRound);
  const token=useRef(0),finished=useRef(false),heading=useRef(null);
  const drawingChanged=useCallback(value=>{setDrawn(value);setReviewed(false);},[]);
  const right=answer.checked&&answer.selected===letter.id,wrong=answer.checked&&!right;
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[tab]);
  useEffect(()=>()=>{token.current++;stopCurrentAudio();},[]);
  const listen=()=>{
    const id=++token.current;setError(false);
    const audio=playAudioFile(letter.audio,{label:letterName(letter,lang),speed,presentation:'activity',onError:()=>{if(token.current===id){setError(true);setHeard(false);}}});
    audio?.addEventListener('playing',()=>{if(token.current===id)setHeard(true);},{once:true});
  };
  const changeTab=next=>{token.current++;stopCurrentAudio();setError(false);setTab(next);};
  const act=()=>{
    if(tab==='listen'){if(heard)changeTab('trace');return;}
    if(tab==='trace'){
      if(!drawn)return;
      if(!reviewed){setReviewed(true);return;}
      changeTab('find');return;
    }
    if(wrong){dispatch({type:'retry',target:letter.id});return;}
    if(!answer.checked){if(answer.selected===null)return;dispatch({type:'check',target:letter.id});if(answer.selected===letter.id)sfx.playStar();return;}
    if(!finished.current){finished.current=true;onFinish({correct:answer.correct,total:1});sfx.playSuccess();setDone(true);}
  };
  if(done)return <Finish lang={lang} correct={answer.correct} total={1} writing onBack={onBack} onReplay={onReplay} onNextLetter={onNextLetter}/>;
  const tabs=[{id:'listen',tr:'Dinle',de:'Hören'},{id:'trace',tr:'Çiz',de:'Zeichnen'},{id:'find',tr:'Bul',de:'Finden'}];
  const allowTrace=heard,allowFind=heard&&reviewed;
  const buttonLabel=tab==='listen'?(de?'JETZT ZEICHNEN':'ÇİZMEYE GEÇ'):tab==='trace'?(reviewed?(de?'BUCHSTABEN FINDEN':'HARFİ BUL'):(de?'ICH HABE GEZEICHNET':'ÇİZDİM')):wrong?(de?'NOCH EINMAL':'YENİDEN DENE'):right?(de?'FERTIG':'BİTİR'):(de?'PRÜFEN':'KONTROL ET');
  return <div className="activity-game-frame activity-workshop">
    <nav className="activity-stations" aria-label={de?'Werkstattschritte':'Atölye adımları'}>{tabs.map(t=><button key={t.id} className="activity-btn" aria-pressed={tab===t.id} disabled={t.id==='trace'&&!allowTrace||t.id==='find'&&!allowFind} onClick={()=>changeTab(t.id)}>{t[lang]}</button>)}</nav>
    <div className="activity-workspace"><section className="activity-prompt"><Buddy happy={right}/><h3 ref={heading} tabIndex={-1}>{tab==='listen'?(de?'Höre den Buchstaben.':'Harfin adını dinle.'):tab==='trace'?(de?'Zeichne die Form nach.':'Şeklini parmağınla izle.'):(de?'Finde die gleiche Form.':'Şimdi aynı harfi bul.')}</h3>
      {tab==='listen'?<><div className="activity-target"><Glyph letter={letter}/></div><button className="activity-btn activity-primary" onClick={listen}><Volume2 size={20}/>{de?'Anhören':'Dinle'} · {letterName(letter,lang)}</button></>:<span className="activity-prompt-hint">{tab==='trace'?letter.shape[lang]:(de?'Erinnere dich an deine Zeichnung.':'Çizdiğin şekli hatırla.')}</span>}
      {error&&<p className="activity-audio-error" role="alert">{de?'Bitte erneut anhören.':'Ses açılamadı, yeniden dokun.'}</p>}
    </section><div className="activity-board">
      {tab==='listen'?<div className="activity-listen-preview"><Glyph letter={letter}/><strong>{letterName(letter,lang)}</strong><p>{letter.shape[lang]}</p></div>:null}
      <div className="activity-drawing-slot" hidden={tab!=='trace'}><DrawingPad letter={letter} lang={lang} onChange={drawingChanged}/></div>
      {tab==='find'&&<div className="activity-options" dir="rtl" style={{'--option-count':q.options.length}}>{q.options.map(l=><button key={l.id} className={`activity-letter ${answer.selected===l.id?'is-selected':''} ${right&&l.id===letter.id?'is-correct':''} ${wrong&&answer.selected===l.id?'is-incorrect':''}`} aria-label={letterName(l,lang)} aria-pressed={answer.selected===l.id} disabled={answer.checked} onClick={()=>dispatch({type:'choose',id:l.id})}><Glyph letter={l}/>{right&&l.id===letter.id&&<Check className="answer-check" size={20}/>}</button>)}</div>}
    </div></div>
    <Feedback tone={tab==='find'&&right?'correct':tab==='find'&&wrong?'encourage':'ready'} title={tab==='trace'?(reviewed?(de?'Schau genau hin.':'Örnekle karşılaştır.'):de?'Probiere es in Ruhe.':'Şekli izlemeyi dene.'):tab==='find'?(right?(de?'Super gefunden!':'Harika buldun!'):wrong?(de?'Schauen wir noch einmal.':'Birlikte yeniden bakalım.'):(de?'Welche Form passt?':'Hangisi aynı harf?')):(heard?(de?'Gut zugehört!':'Güzel dinledin!'):(de?'Wir hören gemeinsam.':'Birlikte dinleyelim.'))} detail={tab==='trace'?(de?'Du beurteilst deine Zeichnung selbst.':'Çizimini kendin değerlendir; puan verilmiyor.'):wrong?letter.shape[lang]:tab==='listen'?(de?'Erst anhören, dann weiter.':'Önce kaydı dinle, sonra devam et.'):(de?'Wähle und drücke „Prüfen“.':'Seç ve Kontrol et düğmesine dokun.')}>
      <button className="activity-btn activity-primary" disabled={tab==='listen'?!heard:tab==='trace'?!drawn:!answer.checked&&answer.selected===null} onClick={act}>{buttonLabel}<ArrowRight size={17}/></button>
    </Feedback>
  </div>;
}
