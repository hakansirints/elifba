import React, { useEffect, useRef, useState } from 'react';
import { normalizeTheme } from './utils/themes';
import { assetUrl } from './utils/urls';
import BookReader from './components/adult/BookReader';
import VideoModal from './components/common/VideoModal';
import MediaStatus from './components/common/MediaStatus';
import Link from './components/common/Link';
import { useRoute, navigate } from './utils/navigation';
import { emptyStore, readStore, STORE_KEY } from './utils/learningStore';
import { stopCurrentAudio, sfx } from './utils/audioPlayer';

export default function App() {
  const route=useRoute(),path=route.split('?')[0].replace(/\/$/,'')||'/';
  const [store,setStore]=useState(()=>{try{return readStore(window.localStorage);}catch{return emptyStore();}});
  const [pages,setPages]=useState(null),[loadError,setLoadError]=useState(false),[retry,setRetry]=useState(0);
  const [storageError,setStorageError]=useState(false),[video,setVideo]=useState(null);
  const contentRef=useRef(null),de=store.lang==='de',lang=store.lang;
  const match=path.match(/^\/e-kitap\/sayfa\/(\d+)$/),legacy=/^\/(yetiskin|cocuk)(\/|$)/.test(path);
  const entry=path==='/'||path==='/e-kitap'||legacy;
  const currentPage=entry?Math.max(6,store.reader.page):match?Number(match[1]):6;
  const known=entry||Boolean(match&&currentPage>=6&&currentPage<=74);
  useEffect(()=>{
    if(!entry)return;
    const oldPage=path.startsWith('/yetiskin')?(path.endsWith('/pratik')?16:/\/(gruplar|sesler)$/.test(path)?15:14):currentPage;
    navigate(`/e-kitap/sayfa/${oldPage}`,{replace:true});
  },[entry,path,currentPage]);
  useEffect(()=>{
    const controller=new AbortController();setLoadError(false);
    fetch(assetUrl('data/pages_metadata.json'),{signal:controller.signal}).then(r=>{if(!r.ok)throw Error(r.status);return r.json();})
      .then(data=>{if(!Array.isArray(data)||data.length!==74)throw Error('Invalid book data');setPages(data);})
      .catch(e=>{if(e.name!=='AbortError')setLoadError(true);});
    return()=>controller.abort();
  },[retry]);
  useEffect(()=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(store));setStorageError(false);}catch{setStorageError(true);}},[store]);
  useEffect(()=>{document.documentElement.lang=lang;sfx.enabled=store.effects!==false;},[lang,store.effects]);
  const theme=normalizeTheme(store.theme);
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme==='dark'?'dark':'light';},[theme]);
  useEffect(()=>{
    stopCurrentAudio();window.speechSynthesis?.cancel();setVideo(null);
    if(known&&!entry)setStore(s=>({...s,lastVisit:{path,at:Date.now()},reader:{...s.reader,page:currentPage}}));
    contentRef.current?.focus({preventScroll:true});
  },[route]);
  const updateReader=patch=>setStore(s=>({...s,theme:patch.preferences?.theme?normalizeTheme(patch.preferences.theme):s.theme,reader:{...s.reader,...patch}}));
  const openVideo=v=>{stopCurrentAudio();setVideo(v);};
  let content;
  if(!known)content=<div className="page-shell empty-panel"><h1>{de?'Seite nicht gefunden':'Sayfa bulunamadı'}</h1><Link to="/e-kitap" className="button button-primary">{de?'Zum Buch':'Kitaba dön'}</Link></div>;
  else if(loadError)content=<div className="page-shell empty-panel" role="alert"><h1>{de?'Materialien konnten nicht geladen werden':'İçerikler yüklenemedi'}</h1><p>{de?'Prüfe deine Verbindung und versuche es erneut.':'Bağlantını kontrol edip yeniden deneyebilirsin.'}</p><button className="button button-primary" onClick={()=>setRetry(n=>n+1)}>{de?'Erneut versuchen':'Tekrar dene'}</button></div>;
  else if(!pages)content=<div className="page-shell empty-panel" role="status">{de?'Dein Buch wird geladen…':'Kitabın yükleniyor…'}</div>;
  else content=<BookReader pagesData={pages} currentPage={currentPage} onPageChange={n=>navigate(`/e-kitap/sayfa/${n}`)} onOpenVideo={openVideo} lang={lang} reader={store.reader} onReaderChange={updateReader} effects={store.effects} onEffectsChange={effects=>setStore(s=>({...s,effects}))} onLangChange={lang=>setStore(s=>({...s,lang}))}/>;
  return <div className="platform section-book"><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();contentRef.current?.focus();}}>{de?'Zum Inhalt':'İçeriğe geç'}</a>
    {storageError&&<p className="storage-warning" role="alert">{de?'Dein Browser konnte die Daten nicht speichern.':'Tarayıcın tercihlerini kaydedemedi.'}</p>}
    <main id="main-content" ref={contentRef} tabIndex={-1}>{content}</main><MediaStatus lang={lang} bookMode theme={theme} onOpenVideo={openVideo} onSpeedChange={speed=>updateReader({preferences:{...store.reader.preferences,speed}})}/>
    {video&&<VideoModal video={video} lang={lang} onClose={()=>setVideo(null)} onJumpToPage={n=>{setVideo(null);navigate(`/e-kitap/sayfa/${n}`);}}/>}
  </div>;
}
