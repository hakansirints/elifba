import React, { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../../utils/urls';

// Each animation owns its renderer; removing the frame also releases its RAF loop.
const DOCUMENT = `<!doctype html><html><head><style>html,body,#curl{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}.curl-page{background:#fffde8;box-shadow:inset 0 0 18px #383a2020}.curl-page img{display:block;width:100%;height:100%}</style></head><body><div id="curl"></div><script src="${assetUrl('vendor/page-flip/page-flip.browser.js')}"></script><script>
addEventListener('message',async event=>{
 if(event.source!==parent||event.data?.type!=='reader-curl')return;
 const c=event.data;let started=false;
 const finish=()=>parent.postMessage({type:'reader-curl-complete',token:c.token},c.origin);
 const items=await Promise.all(c.pages.map(src=>new Promise(resolve=>{
  const page=document.createElement('div');page.className='curl-page';
  if(!src)return resolve(page);
  const image=new Image();image.onload=()=>resolve(page);image.onerror=finish;image.src=src;page.append(image);
 })));
 const flip=new St.PageFlip(document.getElementById('curl'),{width:innerWidth/2,height:innerHeight,size:'fixed',autoSize:false,usePortrait:false,startPage:c.direction==='next'?0:2,showCover:false,drawShadow:true,maxShadowOpacity:.35,flippingTime:1100,useMouseEvents:false,showPageCorners:false,mobileScrollSupport:false});
 flip.on('flip',e=>{if(started&&e.data===(c.direction==='next'?2:0))finish()});
 flip.on('init',()=>{parent.postMessage({type:'reader-curl-ready',token:c.token},c.origin);requestAnimationFrame(()=>{started=true;c.direction==='next'?flip.flipNext('bottom'):flip.flipPrev('bottom')})});
 flip.loadFromHTML(items);
},{once:true});
</script></body></html>`;

export default function PaperCurl({ from, to, direction, single, onComplete }) {
 const [ready,setReady]=useState(false);
 const frame=useRef(null),complete=useRef(onComplete),token=useRef(Math.random().toString(36));complete.current=onComplete;
 useEffect(()=>{
  const listener=event=>{if(event.source!==frame.current?.contentWindow||event.data?.token!==token.current)return;if(event.data.type==='reader-curl-ready')setReady(true);if(event.data.type==='reader-curl-complete')complete.current();};
  const timeout=setTimeout(()=>complete.current(),4500);window.addEventListener('message',listener);
  return()=>{clearTimeout(timeout);window.removeEventListener('message',listener);};
 },[]);
 let oldSpread=from,newSpread=to;
 if(single){oldSpread=direction==='next'?[null,from[0]]:[from[0],null];newSpread=direction==='next'?[null,to[0]]:[to[0],null];}
 const pages=(direction==='next'?[...oldSpread,...newSpread]:[...newSpread,...oldSpread]).map(p=>p?assetUrl(p.image):null);
 return <iframe style={{opacity:ready?1:0}} className="reader-paper-curl" title="" aria-hidden="true" tabIndex={-1} ref={frame} srcDoc={DOCUMENT} onLoad={()=>frame.current?.contentWindow.postMessage({type:'reader-curl',token:token.current,pages,direction,origin:location.origin},location.origin)}/>;
}
