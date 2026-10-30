import { assetUrl } from '../utils/urls';
import React from 'react';
import { ArrowUpRight, BookOpen, GraduationCap, Sprout, ArrowRight, Headphones, Globe, Bookmark } from 'lucide-react';
import Link from './common/Link';
import { LESSONS } from '../data/learningData';
export default function Portal({ lang, store }) {
  const de=lang==='de';
  const cards=[
    {id:'book',to:'/e-kitap',icon:BookOpen,eyebrow:de?'LESEN & ENTDECKEN':'OKU VE KEŞFET',title:de?'Das interaktive E-Book':'İnteraktif e-Kitap',description:de?'69 Originalseiten. Lesen, antippen und die Aufnahmen hören.':'69 orijinal sayfa. Kitabı aç, örneklere dokun ve kaynak kayıtları dinle.',cta:de?'Buch öffnen':'Kitabı aç',detail:de?'Freies Lesen · Seiten umblättern':'Serbest okuma · Sayfa çevirme'},
    {id:'adult',to:'/yetiskin',icon:GraduationCap,eyebrow:de?'SCHRITT FÜR SCHRITT':'ADIM ADIM ÖĞREN',title:de?'Zeit für deinen Lernweg':'Kendi hızında öğren',description:de?'Kleine Lektionen, gezielte Übungen und Wiederholungen für deinen Alltag.':'Kısa dersler, anlaşılır alıştırmalar ve öğrendiklerini pekiştiren tekrarlar.',cta:de?'Lernweg starten':'Öğrenmeye başla',detail:de?`${LESSONS.length} Lektionen · Persönlicher Fortschritt`:`${LESSONS.length} ders · Kişisel ilerleme`},
    {id:'kid',to:'/cocuk',icon:Sprout,eyebrow:de?'SPIELERISCH LERNEN':'OYNA VE ÖĞREN',title:de?'Ein kleines Abenteuer':'Küçük adımlarla keşfet',description:de?'Buchstaben hören, Formen entdecken und mit kurzen Aufgaben Sterne sammeln.':'Harfleri dinle, şekilleri keşfet ve kısa görevlerle öğrenme yolunda ilerle.',cta:de?'Abenteuer starten':'Maceraya başla',detail:de?'Kurze Aufgaben · Getrennte Profile':'Kısa görevler · Ayrı profiller'},
  ];
  return <div className="page-shell portal">
    <section className="portal-intro"><div className="portal-copy"><p className="eyebrow"><span className="small-line"/>{de?'EIN BUCH. DREI LERNWEGE.':'BİR KİTAP. ÜÇ ÖĞRENME YOLU.'}</p><h1>{de?<>Jeder Anfang<br/>beginnt mit <em>Elif.</em></>:<>Her güzel başlangıç<br/>bir <em>Elif’le.</em></>}</h1><p className="intro-text">{de?'Entdecke die Buchstaben des Korans. Wähle den Weg, der zu dir passt, und lerne in deinem Tempo.':"Kur’an harflerini tanı, sesleri keşfet. Sana uygun yolu seç ve kendi hızında öğrenmeye başla."}</p>
      <div className="intro-tags"><span><Headphones size={16}/>{de?'Originalaufnahmen':'Kaynak sesler'}</span><span><Globe size={16}/>Türkçe / Deutsch</span><span><Bookmark size={16}/>{de?'Ohne Anmeldung':'Üyelik gerektirmez'}</span></div>
      {store.lastVisit?.path && <Link to={store.lastVisit.path} className="continue-link">{de?'Dort weitermachen, wo du aufgehört hast':'Kaldığın yerden devam et'}<ArrowRight size={17}/></Link>}</div>
      <div className="book-feature"><img src={assetUrl('assets/book/pages/page-01.jpg')} alt={de?'Cover des Originalbuches Kur’an Öğreniyorum':'Kur’an Öğreniyorum kitabının orijinal kapağı'}/><span className="book-caption">DİTİB · {de?'Türkisch und Deutsch':'Türkçe ve Almanca'}</span></div></section>
    <section aria-label={de?'Wähle deinen Lernweg':'Öğrenme yolunu seç'} className="portal-cards">{cards.map(({id,to,icon:Icon,eyebrow,title,description,cta,detail})=><Link key={id} to={to} className={`path-card path-${id}`}><div className="path-card-top"><span className="path-icon"><Icon size={25}/></span><ArrowUpRight size={22}/></div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="path-description">{description}</p><span className="card-detail">{detail}</span><span className="card-cta">{cta}<ArrowRight size={19}/></span></Link>)}</section>
    <footer className="portal-footer"><span>{de?'Ein gemeinsames Buch, für verschiedene Lerntempi.':'Aynı kaynak, farklı öğrenme ritimleri.'}</span><a href="https://elifba.ditib-akademie.de/" target="_blank" rel="noreferrer">{de?'Originalmaterial ansehen':'Orijinal kaynağı incele'}<ArrowUpRight size={14}/></a></footer>
  </div>;
}

