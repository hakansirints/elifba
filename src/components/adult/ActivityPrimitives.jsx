import React, {useEffect,useRef} from 'react';
import {ArrowRight,RotateCcw,Star} from 'lucide-react';
import ElifbaMark from '../common/ElifbaMark';

export const CONFETTI_PIECES = [
  { x: 0, y: -26, rot: 45, color: '#f59e0b', delay: 0 },
  { x: 18, y: -20, rot: -30, color: '#10b981', delay: 20 },
  { x: 25, y: 0, rot: 90, color: '#3b82f6', delay: 40 },
  { x: 18, y: 20, rot: 15, color: '#ec4899', delay: 10 },
  { x: 0, y: 26, rot: -60, color: '#f59e0b', delay: 30 },
  { x: -18, y: 20, rot: 75, color: '#10b981', delay: 50 },
  { x: -25, y: 0, rot: -45, color: '#6366f1', delay: 15 },
  { x: -18, y: -20, rot: 120, color: '#ec4899', delay: 35 },
  { x: 12, y: -24, rot: 60, color: '#eab308', delay: 25 },
  { x: -12, y: -24, rot: -75, color: '#06b6d4', delay: 45 },
  { x: 20, y: 18, rot: -15, color: '#8b5cf6', delay: 5 },
  { x: -20, y: 18, rot: 160, color: '#a855f7', delay: 20 },
];

export function CardConfetti() {
  return (
    <span className="card-confetti" aria-hidden="true">
      {CONFETTI_PIECES.map((piece, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            '--tx': `${piece.x}px`,
            '--ty': `${piece.y}px`,
            '--rot': `${piece.rot}deg`,
            '--bg': piece.color,
            '--delay': `${piece.delay}ms`,
          }}
        />
      ))}
    </span>
  );
}

export function Glyph({letter}) {
  return <span className="activity-glyph" lang="ar" dir="rtl">{letter.char}</span>;
}
export function Buddy({happy=false}) {
  return <span className={`activity-buddy ${happy?'is-happy':''}`} aria-hidden="true"><ElifbaMark decorative/></span>;
}
export function Feedback({tone='ready',title,detail,children,reward=0}) {
  const happy=['correct','match','complete'].includes(tone);
  return <div className={`activity-feedback feedback-${tone}`}>
    <div className="activity-reward" key={`${tone}-${reward}`}><Buddy happy={happy}/>{happy&&<span className="reward-burst" aria-hidden="true">{[0,1,2,3,4,5].map(n=><Star key={n} fill="currentColor" style={{'--spark':n}}/>)}</span>}</div>
    <div className="feedback-copy" role="status" aria-live="polite"><strong>{title}</strong>{detail&&<p>{detail}</p>}</div>
    <div className="feedback-actions">{children}</div>
  </div>;
}
export function Finish({lang,correct,total,onBack,onReplay,onNextLetter,writing=false}) {
  const de=lang==='de',headingRef=useRef(null);
  useEffect(()=>{headingRef.current?.focus({preventScroll:true});},[]);
  return <div className="activity-finish"><div className="finish-mascot"><Buddy happy/><div className="finish-stars" aria-hidden="true">{[0,1,2].map(n=><Star key={n} fill="currentColor"/>)}</div></div><div>
    <h3 ref={headingRef} tabIndex={-1}>{de?'Du bist ein Buchstaben-Entdecker!':'Sen bir harf kâşifisin!'}</h3>
    <p>{writing?(de?'Du hast gehört, gezeichnet und die Form erkannt. Danke fürs Üben!':'Dinledin, çizdin ve şeklini tanıdın. Emeğine sağlık!'):(de?`${total} Aufgaben geschafft, ${correct} gleich erkannt. Danke fürs Üben!`:`${total} adımı tamamladın, ${correct} tanesini ilk denemede buldun. Emeğine sağlık!`)}</p>
    <div className="activity-actions">{onNextLetter&&<button className="activity-btn activity-primary" onClick={onNextLetter}>{de?'Nächster Buchstabe':'Sıradaki harf'}<ArrowRight size={17}/></button>}<button className={`activity-btn ${onNextLetter?'':'activity-primary'}`} onClick={onReplay}><RotateCcw size={17}/>{de?'Noch eine Runde':'Bir tur daha'}</button><button className="activity-btn" onClick={onBack}>{de?'Aktivitäten':'Etkinlikler'}</button></div>
  </div></div>;
}
