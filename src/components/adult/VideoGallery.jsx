import { assetUrl } from '../../utils/urls';
import React, { useState } from 'react';
import { Play, BookOpen, Volume2, Search, Check } from 'lucide-react';
import { VIDEOS_DATA } from '../../data/curriculumData';
import { playAudioFile } from '../../utils/audioPlayer';
const suraIds=['fatiha','fil','kureys','maun','kevser','kafirun','nasr','tebbet','ihlas','felak','nas','ayetelkursi'];
export default function VideoGallery({ onOpenVideo, onJumpToPage, lang='tr', memorized=[],onToggleMemorized }) {
  const de=lang==='de';const [search,setSearch]=useState(''),[filter,setFilter]=useState('all');
  const filtered=VIDEOS_DATA.filter(v=>{
    const title=de?v.titleDe:v.titleTr;
    return title.toLocaleLowerCase(de?'de':'tr').includes(search.toLocaleLowerCase(de?'de':'tr'))&&(filter==='all'||(filter==='sura'?suraIds.includes(v.id):!suraIds.includes(v.id)));
  });
  return <div className="page-shell media-library"><p className="eyebrow">{de?'ZUHÖREN, FOLGEN, VERSTEHEN':'DİNLE, TAKİP ET, ANLA'}</p><h1>{de?'Suren und Gebete':'Sure ve dualar'}</h1><p className="intro-text">{de?'20 Originalvideos mit visueller Lesehilfe. Arabische Lesung und Bedeutung sind getrennt zugänglich.':'Görsel takip içeren 20 kaynak video. Arapça okunuş ile Türkçe ve Almanca anlam kayıtlarını ayrı ayrı açabilirsin.'}</p>
    <div className="library-controls"><label className="library-search"><Search size={18}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={de?'Sure oder Gebet suchen…':'Sure veya dua ara…'} aria-label={de?'Sure oder Gebet suchen':'Sure veya dua ara'}/></label><div className="library-filters">{[['all',de?'Alle':'Tümü'],['sura',de?'Suren':'Sureler'],['dua',de?'Gebete':'Dualar']].map(([id,title])=><button key={id} className={filter===id?'active':''} onClick={()=>setFilter(id)} aria-pressed={filter===id}>{title}</button>)}</div></div>
    <div className="library-grid">{filtered.map(v=><article className="library-card" key={v.id}><button className="library-preview" onClick={()=>onOpenVideo(v)} aria-label={`${de?'Arabische Lesung als Video ansehen':'Arapça okunuş videosunu izle'}: ${de?v.titleDe:v.titleTr}`}><img src={assetUrl(`assets/book/pages/page-${String(v.pageNumber).padStart(2,'0')}.jpg`)} alt="" loading="lazy"/><span className="preview-play"><Play size={22}/></span><span className="preview-caption">{de?'Arabische Lesung · Video':'Arapça okunuş · Video'}</span></button><div className="library-card-body"><h2>{de?v.titleDe:v.titleTr}</h2><div className="library-meanings">{v.audioTr&&<button onClick={()=>playAudioFile(v.audioTr,{label:`${v.titleTr} · Türkçe anlam`})}><Volume2 size={15}/>Türkçe anlam</button>}{v.audioDe&&<button onClick={()=>playAudioFile(v.audioDe,{label:`${v.titleDe} · Deutsche Bedeutung`})}><Volume2 size={15}/>Deutsche Bedeutung</button>}</div><div className="library-card-bottom"><button onClick={()=>onJumpToPage(v.pageNumber)}><BookOpen size={15}/>{de?'Im Buch':'Kitapta gör'}</button>{onToggleMemorized&&<button className={memorized.includes(v.id)?'memorized':''} aria-pressed={memorized.includes(v.id)} onClick={()=>onToggleMemorized(v.id)}><Check size={15}/>{memorized.includes(v.id)?(de?'Selbst gelernt':'Ezberledim'):(de?'Als gelernt merken':'Ezberime ekle')}</button>}</div></div></article>)}</div>
    {!filtered.length&&<div className="empty-panel" role="status"><h2>{de?'Kein Ergebnis':'Sonuç bulunamadı'}</h2><button className="button button-white" onClick={()=>{setSearch('');setFilter('all');}}>{de?'Alle anzeigen':'Tümünü göster'}</button></div>}
    <p className="muted small library-note">{de?'Die Lernmarkierung ist eine Selbsteinschätzung und bewertet nicht die Aussprache.':'Ezber işareti kendi değerlendirmendir; telaffuzunun doğruluğunu ölçmez.'}</p>
  </div>;
}
