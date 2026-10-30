import React, { useState } from 'react';
import { 
  ArrowLeft, Volume2, Play, Star, Sparkles, Trophy, 
  Gamepad2, CheckCircle2, Video, Heart, HelpCircle
} from 'lucide-react';
import { playAudioFile, sfx } from '../../utils/audioPlayer';
import TopicGameModal from './TopicGameModal';

export default function KidLessonView({ 
  topic, 
  onBack, 
  lang = 'tr', 
  onOpenVideo,
  onAddStar,
  isCompleted = false,
  onMarkCompleted 
}) {
  const [activeItemId, setActiveItemId] = useState(null);
  const [showGameModal, setShowGameModal] = useState(false);

  if (!topic) return null;

  const handleCardClick = (item, idx) => {
    setActiveItemId(idx);
    sfx.playPop();
    if (item.audio) {
      playAudioFile(item.audio, {
        onEnd: () => setActiveItemId(null),
        onError: () => setActiveItemId(null)
      });
    }
  };

  const handleGameComplete = (topicId, points) => {
    if (onAddStar && !isCompleted) onAddStar(3);
    if (onMarkCompleted) onMarkCompleted(topicId);
    setShowGameModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-pop">
      
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-kid font-bold text-sm shadow-sm border border-slate-200 transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'de' ? 'Zurück zur Karte' : 'Haritaya Dön'}</span>
        </button>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-kid font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'de' ? 'Gemeistert!' : 'Tamamlandı!'}</span>
            </span>
          )}

          <button
            onClick={() => setShowGameModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-kid font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{lang === 'de' ? 'Lektions-Spiel spielen!' : 'Konu Oyununu Oyna!'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header Card */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${topic.color} text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6`}>
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-yellow-100 text-xs font-kid font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ders #{topic.order}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-kid tracking-tight drop-shadow-sm">
            {lang === 'de' ? topic.titleDe : topic.titleTr}
          </h2>
          <p className="text-white/90 text-sm sm:text-base font-medium max-w-xl">
            {lang === 'de' ? topic.subtitleDe : topic.subtitleTr}
          </p>
        </div>

        <div className="text-6xl sm:text-7xl filter drop-shadow z-10 shrink-0">
          {topic.icon}
        </div>
      </div>

      {/* Friendly Mascot Speech Bubble */}
      <div className="flex items-start gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-3xl border-2 border-amber-200/90 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-md">
          🐥
        </div>
        <div className="space-y-1">
          <span className="font-kid font-bold text-xs text-amber-700 block">
            Elifcan Diyor ki:
          </span>
          <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
            {lang === 'de' ? topic.mascotTipDe : topic.mascotTipTr}
          </p>
        </div>
      </div>

      {/* Interactive Item Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-kid font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
            <span>🔊 Dokun ve Sesini Dinle:</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {topic.items?.length || 0} kart
          </span>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {topic.items?.map((item, idx) => {
            const isActive = activeItemId === idx;

            return (
              <button
                key={idx}
                onClick={() => handleCardClick(item, idx)}
                className={`group relative min-h-[120px] sm:min-h-[140px] rounded-3xl p-3 flex flex-col items-center justify-between transition-all duration-200 cursor-pointer border-2 active:scale-95 ${
                  isActive 
                    ? 'bg-amber-300 border-amber-400 shadow-xl scale-105 ring-4 ring-amber-300/60 rotate-1' 
                    : 'bg-white border-slate-200/90 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Sound icon badge */}
                <div className="w-full flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] font-mono font-bold">#{idx + 1}</span>
                  <Volume2 className={`w-3.5 h-3.5 ${isActive ? 'text-amber-800 animate-pulse' : 'text-slate-300 group-hover:text-amber-500'}`} />
                </div>

                {/* Character or Name */}
                {item.char ? (
                  <span className={`text-4xl sm:text-5xl font-quran text-slate-800 leading-none drop-shadow-sm transition-transform ${
                    isActive ? 'scale-125' : 'group-hover:scale-110'
                  }`}>
                    {item.char}
                  </span>
                ) : (
                  <span className="text-3xl my-1">{item.icon || '📖'}</span>
                )}

                {/* Transliteration / Hint */}
                <div className="w-full text-center">
                  <span className="font-kid font-bold text-xs sm:text-sm text-slate-700 block truncate">
                    {item.soundText || (lang === 'de' ? item.nameDe : item.nameTr)}
                  </span>
                </div>

                {/* Video Play Button if video attached */}
                {item.video && onOpenVideo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVideo({
                        file: item.video,
                        caption: item.nameTr,
                        titleTr: item.nameTr,
                        titleDe: item.nameDe
                      });
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-amber-500 text-white shadow hover:scale-110 transition"
                    title="Videolu Anlatımı İzle"
                  >
                    <Video className="w-3 h-3" />
                  </button>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Big Golden Challenge Button at the End of the Topic */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border-4 border-amber-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-900 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-kid font-bold uppercase tracking-wider text-amber-900">
            <Trophy className="w-4 h-4" />
            <span>{lang === 'de' ? 'Bereit für die Herausforderung?' : 'Konuyu Bitirdin mi?'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-kid">
            {lang === 'de' ? topic.game?.titleDe : topic.game?.titleTr}
          </h3>
          <p className="text-xs sm:text-sm text-amber-950/80 font-medium max-w-lg">
            {lang === 'de' ? topic.game?.instructionsDe : topic.game?.instructionsTr}
          </p>
        </div>

        <button
          onClick={() => setShowGameModal(true)}
          className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-kid font-bold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition flex items-center gap-3 shrink-0 animate-bounce-soft"
        >
          <Gamepad2 className="w-6 h-6 text-yellow-300" />
          <span>{lang === 'de' ? 'Spiel starten! ⭐' : 'Oyunu Başlat & Yıldız Kazan! ⭐'}</span>
        </button>
      </div>

      {/* Game Modal */}
      {showGameModal && (
        <TopicGameModal
          topic={topic}
          onClose={() => setShowGameModal(false)}
          lang={lang}
          onCompleteTopic={handleGameComplete}
        />
      )}

    </div>
  );
}
