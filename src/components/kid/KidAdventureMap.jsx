import React from 'react';
import { Star, Trophy, Sparkles, CheckCircle2, Lock, ArrowRight, Play } from 'lucide-react';
import { KID_TOPICS } from '../../data/kidLessonsData';

export default function KidAdventureMap({ 
  onSelectTopic, 
  completedTopics = [], 
  lang = 'tr' 
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 select-none">
      
      {/* Adventure Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-yellow-100 text-xs font-kid font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'de' ? 'Koran-Abenteuer' : 'Kur\'an Öğrenme Yolu'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-kid tracking-tight drop-shadow-sm">
            {lang === 'de' ? 'Das magische Abenteuer 🗺️' : 'Büyük Elif-Ba Macerası 🗺️'}
          </h2>
          <p className="text-white/90 text-sm sm:text-base font-medium max-w-xl">
            {lang === 'de'
              ? 'Reise von Insel zu Insel, meistere die Lektionen und schließe die Spiele ab!'
              : 'Harflerden surelere kadar her adayı keşfet, dersleri dinle ve konu sonundaki oyunları kazanarak ilerle!'}
          </p>
        </div>

        {/* Mascot Avatar */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-center shrink-0 z-10">
          <span className="text-5xl animate-bounce-soft">🐥</span>
          <span className="text-xs font-kid font-bold text-white mt-1">Rehber Elifcan</span>
        </div>
      </div>

      {/* Adventure Road Nodes */}
      <div className="relative py-4 space-y-6">
        
        {/* Connecting wavy road line */}
        <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-3 sm:w-4 bg-gradient-to-b from-amber-300 via-rose-300 to-indigo-300 rounded-full -z-0 opacity-40 border-2 border-dashed border-white/60" />

        {KID_TOPICS.map((topic, index) => {
          const isDone = completedTopics.includes(topic.id);
          const isEven = index % 2 === 0;

          return (
            <div 
              key={topic.id}
              className={`relative z-10 flex items-center ${
                isEven ? 'justify-start sm:justify-start' : 'justify-end sm:justify-end'
              }`}
            >
              <div 
                onClick={() => onSelectTopic(topic)}
                className={`group w-full max-w-md bg-white rounded-3xl p-5 border-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl transform hover:-translate-y-1 active:scale-95 ${
                  isDone 
                    ? 'border-emerald-300 ring-2 ring-emerald-300/40 bg-gradient-to-br from-white to-emerald-50/30' 
                    : 'border-slate-200/90 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Left: Round Node Icon */}
                  <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${topic.color} text-white flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0 relative`}>
                    <span className="text-3xl filter drop-shadow">
                      {topic.icon}
                    </span>
                    <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-kid font-bold flex items-center justify-center shadow">
                      #{topic.order}
                    </span>
                  </div>

                  {/* Center: Title & Subtitle */}
                  <div className="flex-1 space-y-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-kid font-bold text-slate-800 text-base sm:text-lg group-hover:text-amber-600 transition leading-snug">
                        {lang === 'de' ? topic.titleDe : topic.titleTr}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                      {lang === 'de' ? topic.subtitleDe : topic.subtitleTr}
                    </p>

                    {/* Game badge info */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-kid font-bold">
                      <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <span>🎮 {lang === 'de' ? topic.game?.titleDe : topic.game?.titleTr}</span>
                      </span>

                      {isDone && (
                        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'de' ? 'Gemeistert' : 'Kazanıldı'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Arrow / Star */}
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-amber-400 group-hover:text-white text-slate-400 transition">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                  </div>

                </div>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
