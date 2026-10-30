import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { SHAPES, shuffle } from '../../data/learningData';
import { playAudioFile, stopCurrentAudio } from '../../utils/audioPlayer';
import { ARABIC_LETTERS } from '../../data/curriculumData';
export default function ShapeMatchGame({ lang }) {
  const [deck,setDeck]=useState(()=>shuffle(SHAPES.flatMap(s=>[{...s,key:s.id+'-base',text:s.char},{...s,key:s.id+'-form',text:s.form}])));
  const [open,setOpen]=useState([]),[matched,setMatched]=useState([]),[moves,setMoves]=useState(0);
  const timer=useRef(null);const de=lang==='de';
  useEffect(()=>()=>{clearTimeout(timer.current);stopCurrentAudio();},[]);
  const select=(card)=>{
    if(open.length===2||open.includes(card.key)||matched.includes(card.id))return;
    playAudioFile(ARABIC_LETTERS.find(l=>l.id===card.letterId).audio);
    const next=[...open,card.key];setOpen(next);
    if(next.length===2){setMoves(m=>m+1);const a=deck.find(c=>c.key===next[0]);timer.current=setTimeout(()=>{if(a.id===card.id)setMatched(m=>[...m,card.id]);setOpen([]);},900);}
  };
  const restart=()=>{clearTimeout(timer.current);stopCurrentAudio();setDeck(shuffle(deck));setOpen([]);setMatched([]);setMoves(0);};
  return <section className="shape-game"><div className="section-title"><div><h2>{de?'Finde die verbundenen Formen':'Birleşen şekillerin eşini bul'}</h2><p>{de?'Verbinde den einzelnen Buchstaben mit seinen Wortformen.':'Yalın harfi, kelime içindeki biçimleriyle eşleştir.'}</p></div><button className="button button-white" onClick={restart}><RotateCcw size={17}/>{de?'Neu starten':'Yeniden başlat'}</button></div><p role="status">{matched.length} / 4 {de?'Paare':'eşleşme'} · {moves} {de?'Versuche':'deneme'} {matched.length===4&&<strong> · {de?'Alle Formen gefunden!':'Bütün eşleri buldun!'}</strong>}</p><div className="shape-grid">{deck.map((card,i)=>{const visible=open.includes(card.key)||matched.includes(card.id);return <button key={card.key} onClick={()=>select(card)} className={`shape-card ${matched.includes(card.id)?'matched':''}`} disabled={matched.includes(card.id)} aria-label={visible?card.text:(de?`Karte ${i+1} öffnen`:`${i+1}. kartı aç`)}><span className={visible?'font-quran':''} lang={visible?'ar':undefined}>{visible?card.text:i+1}</span>{matched.includes(card.id)&&<Check size={16}/>}</button>;})}</div></section>;
}
