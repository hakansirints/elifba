import React from 'react';
import { BookOpen, Video, Volume2, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { SECTIONS_DATA, VIDEOS_DATA } from '../../data/curriculumData';
import { playAudioFile } from '../../utils/audioPlayer';

export default function CurriculumView({ onJumpToPage, onOpenVideo, lang = 'tr' }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'de' ? 'Themen des Originalbuchs' : 'Kaynak kitabın konu rehberi'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'de' ? 'Koran-Lernprogramm & Themenübersicht' : 'Kur\'an Öğrenme Programı ve Konu Rehberi'}
          </h2>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            {lang === 'de'
              ? '4 umfassende Teile: Von den arabischen Buchstaben über Vokalzeichen bis zu den Gebetssuren mit Tajweed-Erklärungen.'
              : 'Harflerden harekelere, tecvit kurallarından namaz sure ve dualarına kadar 4 ana bölümden oluşan sistematik eğitim.'}
          </p>
        </div>
        
        {/* Background decorative accent */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS_DATA.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {lang === 'de' ? section.titleDe : section.titleTr}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {lang === 'de' ? `Seiten ${section.badge}` : `Sayfa ${section.badge}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onJumpToPage(section.startPage)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition group"
              >
                <span>{lang === 'de' ? 'Öffnen' : 'Aç'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            {/* Topics List */}
            <div className="p-4 sm:p-5 flex-1 divide-y divide-slate-100 space-y-1">
              {[...section.topics].sort((a,b)=>a.page-b.page).map((topic, tIdx) => {
                // Check if this topic has a video
                const relatedVideo = VIDEOS_DATA.find(v => v.pageNumber === topic.page);

                return (
                  <div
                    key={tIdx}
                    className="pt-2 first:pt-0 flex items-center justify-between gap-3 group py-1.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm text-slate-700 font-medium group-hover:text-emerald-700 transition">
                        {lang === 'de' ? topic.nameDe : topic.nameTr}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {relatedVideo && (
                        <button
                          onClick={() => onOpenVideo(relatedVideo)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                          title="Tecvitli Videoyu İzle"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onJumpToPage(topic.page)}
                        className="px-2 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 text-xs font-mono font-semibold transition"
                        title={lang === 'de' ? `Gehe zu Seite ${topic.page}` : `${topic.page}. sayfaya git`}
                      >
                        p.{topic.page}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
