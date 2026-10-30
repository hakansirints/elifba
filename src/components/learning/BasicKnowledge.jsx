import React from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import SourceSample from './SourceSample';
import Link from '../common/Link';
import { playAudioFile } from '../../utils/audioPlayer';
import { BASIC_TOPICS } from '../../data/learningData';

export default function BasicKnowledge({ pages,lang,kind }) {
  const de=lang==='de';const returnPath=kind==='kid'?'/cocuk/temel-bilgiler':'/yetiskin/temel-bilgiler';
  return <div className="page-shell"><p className="eyebrow">{de?'LESEN UND ZUHÖREN':'OKU VE DİNLE'}</p><h1>{de?'Die 32 Hauptpflichten':'32 Farz ve temel bilgiler'}</h1><p className="intro-text">{de?'Die Erklärungen des Originalbuchs zum Glauben, zur Reinigung und zum Ritualgebet. Wähle eine Karte und höre die zugehörige Aufnahme.':'İman, temizlik ve namaz hakkında kaynak kitabın açıklamaları. Bir karttaki maddeleri oku ve aynı açıklamayı kayıttan dinle.'}</p><div className="knowledge-grid">{BASIC_TOPICS.map(t=>{
    const page=de?t.pageDe:t.page;const file=de?t.fileDe:t.file;const spot=pages[page-1].hotspots.find(h=>h.audio_file===file);const title=de?t.de:t.tr;
    return <section key={t.file} className="knowledge-card"><div className="section-title"><h2>{title}</h2><span className="knowledge-count">{t.count}</span></div>{spot&&<SourceSample lang={lang} sample={{bounds:spot.bounds,page,label:{tr:title,de:title}}}/>}<div className="knowledge-actions">{spot&&<button className="button button-primary" onClick={()=>playAudioFile(spot.audio_path,{label:title})}><Volume2 size={16}/>{de?'Erklärung hören':'Anlatımı dinle'}</button>}<Link className="text-link" to={`/e-kitap/sayfa/${page}?return=${encodeURIComponent(returnPath)}`}><BookOpen size={16}/>{de?'Im Buch':'Kitapta gör'} · {page}</Link></div></section>;
  })}</div></div>;
}
