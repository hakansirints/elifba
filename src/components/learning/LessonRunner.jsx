import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw, Volume2, Lightbulb } from 'lucide-react';
import { lessonContent, makeQuestions, shuffle } from '../../data/learningData';
import { playAudioFile, stopCurrentAudio, getAudioSnapshot } from '../../utils/audioPlayer';
import SourceSample from './SourceSample';
import Link from '../common/Link';

export default function LessonRunner({ lesson, pages, lang, kind, record, onResult, reviewIds }) {
  const de=lang==='de', kid=kind==='kid';
  const samples=lessonContent(lesson,pages);
  const [stage,setStage]=useState('learn');
  const [questions,setQuestions]=useState([]);
  const [round,setRound]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [selected,setSelected]=useState(null);
  const [heard,setHeard]=useState(false);
  const [hint,setHint]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const committed=useRef(false);
  const wasMastered=useRef(Boolean(record?.mastered));
  const stageHeading=useRef(null);
  const question=questions[round];
  const back=kid?'/cocuk':'/yetiskin';
  const lessonPath=kid?`/cocuk/gorev/${lesson.id}`:`/yetiskin/ders/${lesson.id}`;
  useEffect(()=>()=>{stopCurrentAudio();window.speechSynthesis?.cancel();},[]);
  useEffect(()=>{stopCurrentAudio();setSpeaking(false);window.speechSynthesis?.cancel();},[lang]);
  useEffect(()=>{if(stage!=='learn')stageHeading.current?.focus();},[stage,round]);
  const play = (s, options={}) => {window.speechSynthesis?.cancel();setSpeaking(false);playAudioFile(s.audio,{label:lesson.title[lang],...options});};
  const speak = () => {
    stopCurrentAudio();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text=de?'Tippe auf eine Karte und höre zu. Höre dann die Frage und wähle die passende Karte.':'Bir karta dokun ve dinle. Sonra sorudaki sesi dinleyip aynı kartı bul.';
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang=de?'de-DE':'tr-TR';utterance.rate=0.85;
    utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>setSpeaking(false);setSpeaking(true);window.speechSynthesis.speak(utterance);
  };
  const start=()=>{
    stopCurrentAudio();window.speechSynthesis?.cancel();setSpeaking(false);
    const targets=reviewIds?.length?samples.filter(s=>reviewIds.includes(s.id)):samples;
    const qs=makeQuestions(samples,5);
    if(reviewIds?.length&&targets.length)qs.forEach((q,i)=>{
      const target=targets[i%targets.length];q.target=target;q.correctId=target.id;
      q.options=shuffle([target,...shuffle(samples.filter(s=>s.id!==target.id)).slice(0,3)]);
    });
    setQuestions(qs);setAnswers([]);setRound(0);setSelected(null);setHeard(false);setHint(false);
    wasMastered.current=Boolean(record?.mastered);committed.current=false;setStage('quiz');
  };
  const choose=(sample)=>{
    if(selected || (!heard&&lesson.category!=='shapes') || getAudioSnapshot().status==='error')return;
    const correct=sample.id===question.correctId;
    setSelected(sample.id);setAnswers(a=>[...a,{id:question.target.id,correct,assisted:hint}]);stopCurrentAudio();
  };
  const result=()=>({correct:answers.filter(a=>a.correct&&!a.assisted).length,total:questions.length,
    wrongIds:[...new Set(answers.filter(a=>!a.correct||a.assisted).map(a=>a.id))],
    correctIds:[...new Set(answers.filter(a=>a.correct&&!a.assisted).map(a=>a.id))]});
  const next=()=>{
    stopCurrentAudio();
    if(round+1<questions.length){setRound(r=>r+1);setSelected(null);setHeard(false);setHint(false);}
    else {if(!committed.current){committed.current=true;onResult(lesson.id,result());}setStage('result');}
  };
  if(samples.length<2)return <div className="page-shell"><p role="alert">{de?'Diese Lektion ist noch nicht verfügbar.':'Bu ders henüz kullanılamıyor.'}</p><Link to={back}>{de?'Zurück':'Geri dön'}</Link></div>;
  const summary=stage==='result'?result():null;
  const passed=summary&&summary.correct/summary.total>=0.8;
  return <div className={`page-shell lesson-shell ${kid?'kid-learning':''}`}>
    <div className="lesson-topline"><Link to={back} className="text-link"><ArrowLeft size={17}/>{de?'Zum Lernweg':'Öğrenme yoluna dön'}</Link><Link className="text-link" to={`/e-kitap/sayfa/${lesson.page}?return=${encodeURIComponent(lessonPath)}`}><BookOpen size={17}/>{de?'Im Buch ansehen':'Kitapta gör'} · {lesson.page}</Link></div>
    <div className="lesson-heading"><p className="eyebrow">{kid?(de?'DEIN KLEINER LERNSCHRITT':'BUGÜNÜN KÜÇÜK ADIMI'):(de?'DEIN LERNWEG':'ÖĞRENME YOLUN')}</p><h1>{lesson.title[lang]}</h1><p>{de?'Originalmaterial, mit Zeit zum Zuhören und Wiederholen.':'Kaynak örneklerle dinle, karşılaştır ve tekrar et.'}</p></div>
    <ol className="lesson-steps" aria-label={de?'Lektionsschritte':'Ders adımları'}>{['learn','quiz','result'].map((s,i)=><li key={s} className={stage===s?'current':''} aria-current={stage===s?'step':undefined}><span>{i+1}</span>{[de?'Entdecken':'Öğren',de?'Ausprobieren':'Dene',de?'Ergebnis':'Sonuç'][i]}</li>)}</ol>
    {stage==='learn' && <>
      <section className="explanation-panel"><Lightbulb size={25}/><div><h2>{de?'Darauf achtest du':'Neye dikkat edeceğiz?'}</h2><p>{lesson.explanation[lang]}</p></div>{kid&&<button className="button button-white" onClick={speak} disabled={!('speechSynthesis' in window)}><Volume2 size={18}/>{speaking?(de?'Wird vorgelesen…':'Yönerge okunuyor…'):(de?'Anleitung hören':'Yönergeyi dinle')}</button>}</section>
      <div className="section-title"><h2>{de?'Tippen und zuhören':'Dokun ve dinle'}</h2><span>{de?'Du kannst jeden Laut wiederholen.':'Her kaydı yeniden dinleyebilirsin.'}</span></div>
      <div className="sample-grid" dir="rtl">{samples.map((s,i)=><button className="sample-card" key={s.id} onClick={()=>play(s)} aria-label={`${de?'Anhören':'Dinle'}: ${s.label?.[lang] || i+1}`}><SourceSample sample={s} form={lesson.category==='shapes'} lang={lang}/><span className="sample-label" dir="ltr"><Volume2 size={16}/>{s.label?.[lang] || (de?`Beispiel ${i+1}`:`Örnek ${i+1}`)}</span></button>)}</div>
      <div className="lesson-bottom"><p>{de?'Die Übung prüft das Erkennen von Lauten und Formen.':'Alıştırma, ses ve şekilleri tanımayı ölçer.'}</p><button className="button button-primary" onClick={start}>{reviewIds?.length?(de?'Wiederholung starten':'Tekrarı başlat'):(de?'Ich bin bereit':'Hazırım, deneyelim')}<ArrowRight size={18}/></button></div>
    </>}
    {stage==='quiz'&&question&&<section className="quiz-panel" aria-label={de?'Übung':'Alıştırma'}>
      <div className="quiz-top"><span>{de?'Frage':'Soru'} {round+1} / {questions.length}</span><div className="round-dots">{questions.map((q,i)=><span key={q.id} className={i===round?'now':i<round?'done':''}/>)}</div></div>
      <h2 ref={stageHeading} tabIndex={-1}>{lesson.category==='shapes'?(de?'Welche Formen passen zu diesem Buchstaben?':'Bu harfin birleşik biçimleri hangisi?'):(de?'Höre zu. Welche Karte passt?':'Sesi dinle. Hangi kartla eşleşiyor?')}</h2>
      {lesson.category==='shapes'?<div className="question-letter font-quran" lang="ar">{question.target.char}</div>:<button className="listen-target" onClick={()=>play(question.target,{onEnd:()=>setHeard(true),onError:()=>setHeard(false)})}><Volume2 size={32}/><span>{heard?(de?'Noch einmal hören':'Tekrar dinle'):(de?'Aufnahme anhören':'Kaydı dinle')}</span></button>}
      {!heard&&lesson.category!=='shapes'&&<p className="muted small">{de?'Höre die Aufnahme bis zum Ende, dann wähle eine Karte.':'Önce kaydı sonuna kadar dinle, sonra bir kart seç.'}</p>}
      <div className="answer-grid" dir="rtl">{question.options.map((s,i)=><button key={s.id} disabled={Boolean(selected)||(!heard&&lesson.category!=='shapes')} className={`answer-card ${selected&&(s.id===question.correctId?'correct':s.id===selected?'incorrect':'')} ${hint&&s.id===question.correctId?'hinted':''}`} onClick={()=>choose(s)} aria-label={de?`Antwort ${i+1}`:`Cevap ${i+1}`}><SourceSample sample={s} form={lesson.category==='shapes'} lang={lang}/></button>)}</div>
      <div className="quiz-feedback" role="status">{selected?(selected===question.correctId?(hint?(de?'Mit Hilfe gefunden. Übe diesen Laut noch einmal.':'İpucuyla buldun. Bu örneği bir kez daha çalışalım.'):(de?'Richtig zugeordnet.':'Doğru eşleştirdin.')):(de?'Die grün markierte Karte passt. Du kannst sie noch einmal hören.':'Yeşil kart doğru eşleşme. Doğru örneği yeniden dinleyebilirsin.')):hint?(de?'Die passende Karte ist umrandet. Dies zählt als unterstützte Antwort.':'Doğru kart işaretlendi. Bu soru yardımlı deneme olarak kaydolur.'):' '}</div>
      <div className="quiz-actions">{!selected?<button className="text-link" onClick={()=>setHint(true)} disabled={!heard&&lesson.category!=='shapes'}><Lightbulb size={17}/>{de?'Hinweis zeigen':'İpucu göster'}</button>:<button className="button button-white" onClick={()=>play(question.target)}><Volume2 size={17}/>{de?'Richtiges Beispiel hören':'Doğru örneği dinle'}</button>}{selected&&<button className="button button-primary" onClick={next}>{round===questions.length-1?(de?'Ergebnis ansehen':'Sonucu gör'):(de?'Weiter':'Sonraki')}<ArrowRight size={18}/></button>}</div>
    </section>}
    {stage==='result'&&<section className="result-panel"><span className={`result-symbol ${passed?'success':''}`}>{passed?<Check size={38}/>:<RotateCcw size={32}/>}</span><p className="eyebrow">{de?'DEIN ERGEBNIS':'DENEMENİN SONUCU'}</p><h2 ref={stageHeading} tabIndex={-1}>{passed?(de?'Ein Schritt geschafft!':'Bir adım daha öğrendin!'):(de?'Mit Wiederholung wird es leichter.':'Tekrarla daha da kolaylaşacak.' )}</h2><p className="result-score">{summary.correct} <span>/ {summary.total}</span></p><p>{de?'Richtige Antworten ohne Hilfe':'Yardımsız doğru cevap'}</p><p className="muted">{passed?(kid?(wasMastered.current?(de?'Dein Fortschritt bleibt gespeichert.':'İlerlemen korunuyor. Bu görev için yıldızını daha önce aldın.'):(de?'3 Sterne für den ersten Abschluss.':'İlk kez tamamladığın bu görev için 3 yıldız kazandın.')):(de?'Dein Fortschritt ist gespeichert. Wiederhole die Lektion morgen.':'İlerlemen kaydedildi. Yarın kısa bir tekrar yapabilirsin.')):(de?'Abschluss ab 4 von 5 richtigen Antworten ohne Hilfe. Die Beispiele bleiben in deiner Wiederholung.':'Tamamlamak için 5 soruda en az 4 yardımsız doğru gerekir. Örnekler tekrar listende kalacak.')}</p><div className="result-actions"><button className="button button-white" onClick={()=>{setStage('learn');setSelected(null);}}><RotateCcw size={17}/>{de?'Noch einmal lernen':'Yeniden çalış'}</button><Link className="button button-primary" to={back}>{de?'Zum Lernweg':'Öğrenme yoluna dön'}<ArrowRight size={17}/></Link></div></section>}
  </div>;
}
