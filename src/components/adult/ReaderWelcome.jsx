import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import ReaderDialog from './ReaderDialog';
import { Buddy } from './ActivityPrimitives';

export default function ReaderWelcome({lang,onChoose}) {
  const de=lang==='de';
  return <ReaderDialog labelledBy="reader-welcome-title" className="reader-welcome"><Buddy state="idle"/><p className="activity-eyebrow">ELİF-BA · {de?'WILLKOMMEN':'HOŞ GELDİN'}</p><h2 id="reader-welcome-title">{de?'Wie möchtest du dein Buch entdecken?':'Kitabını nasıl keşfetmek istersin?'}</h2><p>{de?'Auf passenden Seiten warten kurze Spiele und Übungen. Du kannst deine Wahl jederzeit in den Leseeinstellungen ändern.':'Uygun sayfalarda kısa oyunlar ve etkinlikler seni bekliyor. Tercihini istediğin zaman Okuma ayarları’ndan değiştirebilirsin.'}</p><div className="reader-welcome-choices"><button className="activity-btn activity-primary" onClick={()=>onChoose(true)}><Sparkles size={19}/>{de?'Mit Aktivitäten entdecken':'Etkinliklerle keşfet'}</button><button className="activity-btn" onClick={()=>onChoose(false)}><BookOpen size={19}/>{de?'Nur lesen und hören':'Sadece oku ve dinle'}</button></div><small>{de?'Deine Wahl wird in diesem Browser gespeichert.':'Tercihin bu tarayıcıda hatırlanır.'}</small></ReaderDialog>;
}
