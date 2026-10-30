import { assetUrl } from './utils/urls';
import React, { useEffect, useRef, useState } from 'react';
import Header from './components/common/Header';
import Portal from './components/Portal';
import BookReader from './components/adult/BookReader';
import CurriculumView from './components/adult/CurriculumView';
import VideoGallery from './components/adult/VideoGallery';
import PracticeCenter from './components/adult/PracticeCenter';
import VideoModal from './components/common/VideoModal';
import MediaStatus from './components/common/MediaStatus';
import Link from './components/common/Link';
import LearningHub from './components/learning/LearningHub';
import LessonRunner from './components/learning/LessonRunner';
import BasicKnowledge from './components/learning/BasicKnowledge';
import GamesHub from './components/kid/GamesHub';
import LetterGarden from './components/kid/LetterGarden';
import { LESSONS } from './data/learningData';
import { useRoute, navigate, safeReturn } from './utils/navigation';
import { createProfile, emptyStore, readStore, saveAttempt, STORE_KEY } from './utils/learningStore';
import { stopCurrentAudio, sfx } from './utils/audioPlayer';

export default function App() {
  const route=useRoute(),path=route.split('?')[0].replace(/\/$/,'')||'/';
  const query=new URLSearchParams(route.split('?')[1]||'');
  const [store,setStore]=useState(()=>{try{return readStore(window.localStorage);}catch{return emptyStore();}});
  const [pages,setPages]=useState(null),[loadError,setLoadError]=useState(false),[retry,setRetry]=useState(0);
  const [storageError,setStorageError]=useState(false),[video,setVideo]=useState(null);
  const contentRef=useRef(null);
  const section=path==='/e-kitap'||path.startsWith('/e-kitap/')?'book':path==='/yetiskin'||path.startsWith('/yetiskin/')?'adult':path==='/cocuk'||path.startsWith('/cocuk/')?'kid':'home';
  const de=store.lang==='de',lang=store.lang;
  const profile=store.profiles[section==='kid'?store.activeChildId:'adult'];
  useEffect(()=>{
    const controller=new AbortController();setLoadError(false);
    fetch(assetUrl('data/pages_metadata.json'),{signal:controller.signal}).then(r=>{if(!r.ok)throw Error(r.status);return r.json();})
      .then(data=>{if(!Array.isArray(data)||data.length!==74)throw Error('Invalid book data');setPages(data);})
      .catch(e=>{if(e.name!=='AbortError')setLoadError(true);});
    return ()=>controller.abort();
  },[retry]);
  useEffect(()=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(store));setStorageError(false);}catch{setStorageError(true);}},[store]);
  useEffect(()=>{document.documentElement.lang=lang;sfx.enabled=store.effects!==false;},[lang,store.effects]);
  const theme=store.theme==='dark'?'dark':'light';
  const setTheme=next=>setStore(s=>({...s,theme:next,reader:{...s.reader,preferences:{...s.reader.preferences,theme:next}}}));
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;},[theme]);
  useEffect(()=>{
    stopCurrentAudio();window.speechSynthesis?.cancel();setVideo(null);
    if(path!=='/'&&['adult','kid','book'].includes(section))setStore(s=>({...s,lastVisit:{path:route,at:Date.now()}}));
    contentRef.current?.focus({preventScroll:true});
  },[route]);
  const matchPage=path.match(/^\/e-kitap\/sayfa\/(\d+)$/);
  const currentPage=Math.max(6,matchPage?Number(matchPage[1]):store.reader.page);
  const validPage=currentPage>=1&&currentPage<=74;
  useEffect(()=>{if(section==='book'&&validPage)setStore(s=>s.reader.page===currentPage?s:{...s,reader:{...s.reader,page:currentPage}});},[section,currentPage,validPage]);
  const jumpToPage=(n,returnPath)=>navigate(`/e-kitap/sayfa/${n}${returnPath?`?return=${encodeURIComponent(returnPath)}`:''}`);
  const openVideo=v=>{stopCurrentAudio();setVideo(v);};
  const addProfile=name=>{
    if(Object.values(store.profiles).filter(p=>p.kind==='kid').length>=6)return false;
    const id=`child-${Date.now()}`;
    stopCurrentAudio();setStore(s=>({...s,activeChildId:id,profiles:{...s.profiles,[id]:createProfile(id,name,'kid')}}));return true;
  };
  const lessonMatch=path.match(/^\/(yetiskin\/ders|cocuk\/gorev)\/([a-z0-9-]+)$/);
  const lesson=lessonMatch?LESSONS.find(l=>l.id===lessonMatch[2]):null;
  const isKnown=path==='/'||path==='/e-kitap'||Boolean(matchPage&&validPage)||['/yetiskin','/yetiskin/mufredat','/yetiskin/videolar','/yetiskin/temel-bilgiler','/yetiskin/tekrar','/yetiskin/ilerleme','/yetiskin/pratik','/cocuk','/cocuk/harfler','/cocuk/ebeveyn','/cocuk/videolar','/cocuk/temel-bilgiler','/cocuk/oyunlar','/cocuk/oyunlar/balon','/cocuk/oyunlar/sekil','/cocuk/oyunlar/hareke'].includes(path)||Boolean(lesson);
  let content;
  if(!isKnown)content=<div className="page-shell empty-panel"><h1>{de?'Seite nicht gefunden':'Sayfa bulunamadı'}</h1><p>{de?'Wähle einen Lernweg auf der Startseite.':'Ana sayfadan bir öğrenme yolu seçebilirsin.'}</p><Link to="/" className="button button-primary">{de?'Zur Startseite':'Ana sayfaya dön'}</Link></div>;
  else if(path==='/')content=<Portal lang={lang} store={store}/>;
  else if(loadError)content=<div className="page-shell empty-panel" role="alert"><h1>{de?'Materialien konnten nicht geladen werden':'İçerikler yüklenemedi'}</h1><p>{de?'Prüfe deine Verbindung und versuche es erneut.':'Bağlantını kontrol edip yeniden deneyebilirsin.'}</p><button className="button button-primary" onClick={()=>setRetry(n=>n+1)}>{de?'Erneut versuchen':'Tekrar dene'}</button></div>;
  else if(!pages)content=<div className="page-shell empty-panel" role="status">{de?'Lernmaterialien werden geladen…':'Öğrenme içerikleri yükleniyor…'}</div>;
  else if(lesson)content=<LessonRunner key={`${profile.id}:${lesson.id}:${query.get('review')||''}`} lesson={lesson} pages={pages} lang={lang} kind={section==='kid'?'kid':'adult'} record={profile.records[lesson.id]} reviewIds={query.has('review')?profile.records[lesson.id]?.pending:undefined} onResult={(id,result)=>setStore(s=>saveAttempt(s,profile.id,id,result))}/>;
  else if(section==='book')content=<BookReader pagesData={pages} currentPage={currentPage} onPageChange={n=>jumpToPage(n,safeReturn(query.get('return')))} onOpenVideo={openVideo} lang={lang} reader={store.reader} onReaderChange={patch=>setStore(s=>({...s,theme:patch.preferences?.theme==='dark'?'dark':patch.preferences?.theme?'light':s.theme,reader:{...s.reader,...patch}}))}/>;
  else if(path.endsWith('/mufredat'))content=<CurriculumView lang={lang} onJumpToPage={n=>jumpToPage(n,path)} onOpenVideo={openVideo}/>;
  else if(path.endsWith('/temel-bilgiler'))content=<BasicKnowledge pages={pages} lang={lang} kind={section==='kid'?'kid':'adult'}/>;
  else if(path.endsWith('/videolar'))content=<VideoGallery lang={lang} onJumpToPage={n=>jumpToPage(n,path)} onOpenVideo={openVideo} memorized={profile.memorized||[]} onToggleMemorized={id=>setStore(s=>{const p=s.profiles[profile.id],ids=p.memorized||[];return {...s,profiles:{...s.profiles,[p.id]:{...p,memorized:ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]}}};})}/>;
  else if(path==='/yetiskin/pratik')content=<PracticeCenter lang={lang} onJumpToPage={n=>jumpToPage(n,path)} onOpenVideo={openVideo}/>;
  else if(path==='/cocuk/harfler')content=<LetterGarden lang={lang}/>;
  else if(path.startsWith('/cocuk/oyunlar'))content=<GamesHub key={path} game={path.split('/')[3]} lang={lang}/>;
  else content=<LearningHub kind={section==='kid'?'kid':'adult'} lang={lang} profile={profile} store={store} view={path.endsWith('/ebeveyn')?'parents':path.endsWith('/tekrar')?'review':path.endsWith('/ilerleme')?'progress':'path'} onSelectProfile={id=>{stopCurrentAudio();setStore(s=>({...s,activeChildId:id}));}} onAddProfile={addProfile} onRenameProfile={(id,name)=>setStore(s=>({...s,profiles:{...s.profiles,[id]:{...s.profiles[id],name}}}))}/>;
  return <div className={`platform section-${section}`}><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();contentRef.current?.focus();}}>{de?'Zum Inhalt':'İçeriğe geç'}</a>{section!=='book'&&<Header section={section} path={path} theme={theme} setTheme={setTheme} lang={lang} setLang={next=>setStore(s=>({...s,lang:next}))} effects={store.effects!==false} setEffects={next=>setStore(s=>({...s,effects:next}))} stars={profile?.stars||0}/>}
    {storageError&&<p className="storage-warning" role="alert">{de?'Dein Browser konnte den Fortschritt nicht speichern. Lasse diese Seite geöffnet.':'Tarayıcın ilerlemeyi kaydedemedi. Bu sayfayı açık tut.'}</p>}
    <main id="main-content" ref={contentRef} tabIndex={-1}>{content}</main><MediaStatus lang={lang} bookMode={section==='book'} theme={store.reader.preferences?.theme||'light'} onOpenVideo={openVideo} onSpeedChange={speed=>setStore(s=>({...s,reader:{...s.reader,preferences:{...s.reader.preferences,speed}}}))}/>
    {video&&<VideoModal video={video} lang={lang} onClose={()=>setVideo(null)} onJumpToPage={n=>{setVideo(null);jumpToPage(n,section==='kid'?'/cocuk/videolar':'/yetiskin/videolar');}}/>}
  </div>;
}

