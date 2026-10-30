import React from 'react';
import { BookOpen, GraduationCap, Sprout, Home, Globe, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import Link from './Link';
export default function Header({ section, path, lang, setLang, effects, setEffects, theme, setTheme, stars = 0 }) {
  const de = lang==='de';
  const main = [
    {to:'/e-kitap',id:'book',icon:BookOpen,label:de?'E-Book':'e-Kitap'},
    {to:'/yetiskin',id:'adult',icon:GraduationCap,label:de?'Erwachsene':'Yetişkin'},
    {to:'/cocuk',id:'kid',icon:Sprout,label:de?'Kinder':'Çocuk'},
  ];
  const sub = section==='adult' ? [
    ['/yetiskin',de?'Mein Lernweg':'Öğrenme yolum'],['/yetiskin/mufredat',de?'Themen im Buch':'Kitap konuları'],
    ['/yetiskin/tekrar',de?'Wiederholen':'Tekrar'],['/yetiskin/videolar',de?'Suren & Gebete':'Sure ve dualar'],['/yetiskin/ilerleme',de?'Fortschritt':'İlerlemem'],
    ['/yetiskin/temel-bilgiler',de?'Grundwissen':'Temel bilgiler'],
  ] : section==='kid' ? [
    ['/cocuk',de?'Mein Abenteuer':'Maceram'],['/cocuk/harfler',de?'Buchstaben':'Harfler'],['/cocuk/oyunlar',de?'Spiele':'Oyunlar'],
    ['/cocuk/videolar',de?'Suren & Gebete':'Sure ve dualar'],['/cocuk/ebeveyn',de?'Eltern & Profile':'Ebeveyn ve profiller'],
    ['/cocuk/temel-bilgiler',de?'Grundwissen':'Temel bilgiler'],
  ] : [];
  return <header className={`platform-header ${section==='kid'?'kid-header':''}`}>
    <div className="header-main">
      <Link to="/" className="brand" aria-label={de?'Elif-Ba Startseite':'Elif-Ba ana sayfa'}><span className="brand-symbol"><BookOpen size={23}/></span><span>Elif-Ba<small>{de?'Den Koran lesen lernen':"Kur’an okumayı öğreniyorum"}</small></span></Link>
      <nav className="section-nav" aria-label={de?'Bereiche':'Bölümler'}>
        <Link to="/" className={section==='home'?'selected':''} aria-label={de?'Startseite':'Ana sayfa'}><Home size={18}/></Link>
        {main.map(({to,id,icon:Icon,label})=><Link key={id} to={to} aria-current={section===id?'page':undefined} className={section===id?'selected':''}><Icon size={18}/><span>{label}</span></Link>)}
      </nav>
      <div className="header-settings"><button className="icon-button theme-toggle" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={theme==='dark'?(de?'Heller Modus':'Açık moda geç'):(de?'Dunkler Modus':'Koyu moda geç')} aria-pressed={theme==='dark'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button>
        {section==='kid' && <span className="star-chip" aria-label={de?`${stars} Sterne`:`${stars} yıldız`}>★ {stars}</span>}
        <button className="icon-button" onClick={()=>setEffects(!effects)} aria-label={de?(effects?'Toneffekte ausschalten':'Toneffekte einschalten'):(effects?'Ses efektlerini kapat':'Ses efektlerini aç')} aria-pressed={effects}>{effects?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
        <button className="language-button" onClick={()=>setLang(de?'tr':'de')} aria-label={de?'Türkçeye geç':'Auf Deutsch wechseln'}><Globe size={16}/>{de?'DE':'TR'}</button>
      </div>
    </div>
    {sub.length>0 && <nav className="sub-nav" aria-label={de?'Bereichsmenü':'Bölüm menüsü'}>{sub.map(([to,label])=><Link key={to} to={to} aria-current={path===to?'page':undefined} className={path===to?'active':''}>{label}</Link>)}</nav>}
  </header>;
}
