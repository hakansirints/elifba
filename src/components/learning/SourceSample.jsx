import { assetUrl } from '../../utils/urls';
import React from 'react';
export default function SourceSample({ sample, form = false, lang = 'tr' }) {
  if (sample.char) return <span className="sample-arabic font-quran" lang="ar" dir="rtl">{form && sample.form ? sample.form : sample.char}</span>;
  const b = sample.bounds;
  if (!b) return null;
  return <span className="source-sample" role="img" aria-label={`${sample.label?.[lang] || ''}, ${lang==='de'?'Seite':'sayfa'} ${sample.page}`} style={{ aspectRatio: `${b.width * 561.26} / ${b.height * 788.03}` }}>
    <img src={assetUrl(`assets/book/pages/page-${String(sample.page).padStart(2,'0')}.jpg`)} alt="" draggable="false" style={{ width:`${100/b.width}%`,maxWidth:'none',height:`${100/b.height}%`,left:`${-b.x/b.width*100}%`,top:`${-b.y/b.height*100}%` }}/>
  </span>;
}
