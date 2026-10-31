import React, { useEffect, useRef } from 'react';

export default function ReaderDialog({ children, labelledBy, onClose, className='' }) {
  const ref=useRef(null), close=useRef(onClose); close.current=onClose;
  useEffect(()=>{
    const previous=document.activeElement;
    const nodes=[...document.querySelectorAll('#main-content, .reader-mini-player')];
    // The dialog lives inside main, so only its reader siblings become inert.
    const reader=ref.current.closest('.book-reader');
    const backgrounds=reader ? [...reader.children].filter(el=>!el.contains(ref.current)) : nodes;
    const prior=backgrounds.map(el=>el.inert); backgrounds.forEach(el=>{el.inert=true;});
    ref.current.querySelector('button,input,select')?.focus({preventScroll:true});
    const outsidePlayer=document.querySelector('.reader-mini-player'); const wasInert=outsidePlayer?.inert;
    if(outsidePlayer)outsidePlayer.inert=true;
    return ()=>{backgrounds.forEach((el,i)=>{el.inert=prior[i];});if(outsidePlayer)outsidePlayer.inert=wasInert;if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[]);
  return <div className={`reader-dialog-backdrop ${className}`} onClick={e=>{if(e.target===e.currentTarget)close.current?.();}}>
    <section ref={ref} className="reader-dialog" role="dialog" aria-modal="true" aria-labelledby={labelledBy} onKeyDown={e=>{
      e.stopPropagation();
      if(e.key==='Escape'){e.preventDefault();close.current?.();}
      if(e.key==='Tab'){
        const items=[...ref.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href]')].filter(el=>el.getClientRects().length);
        if(!items.length){e.preventDefault();return;}
        if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus();}
        else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus();}
      }
    }}>{children}</section>
  </div>;
}
