import React, {useEffect,useRef} from 'react';
import {ArrowRight,RotateCcw,Star} from 'lucide-react';
import ElifbaMark from '../common/ElifbaMark';

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
