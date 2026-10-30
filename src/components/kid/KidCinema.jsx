import React, { useState } from 'react';
import { Play, Star, Sparkles, Trophy, Video, Award } from 'lucide-react';
import { VIDEOS_DATA } from '../../data/curriculumData';
import { sfx } from '../../utils/audioPlayer';

export default function KidCinema({ lang = 'tr', onOpenVideo, onAddStar }) {
  const [watchedList, setWatchedList] = useState(() => {
    try {
      const saved = localStorage.getItem('kid_watched_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleWatch = (video) => {
    if (!watchedList.includes(video.id)) {
      const next = [...watchedList, video.id];
      setWatchedList(next);
      try {
        localStorage.setItem('kid_watched_videos', JSON.stringify(next));
      } catch {}
      if (onAddStar) onAddStar(2);
      sfx.playStar();
    }
    if (onOpenVideo) {
      onOpenVideo(video);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-kid font-bold uppercase tracking-wider mb-2">
            {lang === 'de' ? 'Koran-Kinderkino 🎬' : 'Sure ve Dua Sineması 🎬'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-kid">
            {lang === 'de' ? 'Lerne Suren mit bunten Videos! ✨' : 'Renkli Videolarla Sureleri Öğren! ✨'}
          </h2>
          <p className="text-xs sm:text-sm text-pink-50 max-w-lg font-medium mt-1">
            {lang === 'de'
              ? 'Schau dir jedes Video an, lies mit Tajweed mit und sammle goldene Sterne!'
              : 'Her videoyu izle, tecvitli okunuşu takip et ve her sure için 2 altın yıldız kazan!'}
          </p>
        </div>

        {/* Watched count */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl text-yellow-200 font-kid font-bold border border-white/30">
          <Star className="w-6 h-6 fill-yellow-300 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span>{watchedList.length} / {VIDEOS_DATA.length} {lang === 'de' ? 'Gesehen' : 'İzlendi'}</span>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {VIDEOS_DATA.map((video) => {
          const isWatched = watchedList.includes(video.id);

          return (
            <div
              key={video.id}
              onClick={() => handleWatch(video)}
              className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-pink-400 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 active:scale-95"
            >
              {/* Card Thumbnail Area */}
              <div className="h-32 sm:h-36 bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center relative p-3 text-white">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-300 drop-shadow-md">
                  {video.icon || '📖'}
                </span>

                {/* Play Button Icon */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-70 group-hover:opacity-100 transition">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-md">
                    <Play className="w-5 h-5 fill-purple-700 ml-0.5" />
                  </div>
                </div>

                {/* Star Stamp if watched */}
                {isWatched && (
                  <span className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-yellow-400 text-slate-900 text-[10px] font-kid font-bold shadow animate-pop">
                    <Star className="w-3 h-3 fill-slate-900 text-slate-900" />
                    <span>Hafız!</span>
                  </span>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-3.5 text-center space-y-1">
                <h4 className="font-kid font-bold text-slate-800 text-sm sm:text-base group-hover:text-purple-600 transition">
                  {lang === 'de' ? video.titleDe : video.titleTr}
                </h4>
                <span className="text-[11px] text-slate-400 font-medium block">
                  {lang === 'de' ? 'Klicken zum Starten' : 'İzlemek için dokun'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
