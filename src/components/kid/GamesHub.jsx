import React from 'react';
import { ArrowLeft, Volume2, Layers, Sparkles, ArrowRight } from 'lucide-react';
import Link from '../common/Link';
import BalloonPopGame from './BalloonPopGame';
import VowelQuestGame from './VowelQuestGame';
import ShapeMatchGame from './ShapeMatchGame';
export default function GamesHub({ game, lang }) {
  const de=lang==='de';
  const games=[['balon',Volume2,de?'Höre den Buchstaben':'Sesi dinle, harfi bul',de?'Tippe den passenden Buchstaben an.':'Doğru harfin balonuna dokun.'],['sekil',Layers,de?'Formen-Memory':'Şekil eşleştirme',de?'Finde Buchstaben und ihre Wortformen.':'Harflerin birleşik biçimlerini bul.'],['hareke',Sparkles,de?'Vokal-Werkstatt':'Hareke atölyesi',de?'Unterscheide Fetha, Kesra und Damme.':'Üstün, esre ve ötreyi ayırt et.']];
  return <div className="page-shell kid-learning"><div className="lesson-topline"><Link className="text-link" to={game?'/cocuk/oyunlar':'/cocuk'}><ArrowLeft size={17}/>{de?'Zurück':'Geri dön'}</Link></div><p className="eyebrow">{de?'ENTDECKEN & WIEDERHOLEN':'KEŞFET VE PEKİŞTİR'}</p><h1>{de?'Deine Spielecke':'Oyun atölyesi'}</h1><p className="muted">{de?'Hier kannst du frei üben. Lernsterne erhältst du in den Aufgaben deines Lernwegs.':'Burada serbestçe alıştırma yapabilirsin. Öğrenme yıldızlarını macerandaki görevleri tamamlayarak kazanırsın.'}</p>
  {!game?<div className="games-grid">{games.map(([id,Icon,title,desc])=><Link key={id} to={`/cocuk/oyunlar/${id}`} className="game-choice"><Icon size={32}/><h2>{title}</h2><p>{desc}</p><span>{de?'Spielen':'Oyna'}<ArrowRight size={18}/></span></Link>)}</div>:game==='balon'?<BalloonPopGame lang={lang}/>:game==='sekil'?<ShapeMatchGame lang={lang}/>:game==='hareke'?<VowelQuestGame lang={lang}/>:<p>{de?'Spiel nicht gefunden.':'Oyun bulunamadı.'}</p>}
  </div>;
}
