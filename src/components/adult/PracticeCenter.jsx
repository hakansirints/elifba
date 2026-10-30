import React, { useState, useEffect } from 'react';
import { 
  Volume2, Check, X, RotateCcw, Award, Sparkles, BookOpen, 
  HelpCircle, ChevronRight, BookmarkCheck, ArrowRight, Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARABIC_LETTERS, VOWELS_DATA, VIDEOS_DATA } from '../../data/lettersData';
import { playAudioFile, sfx } from '../../utils/audioPlayer';

export default function PracticeCenter({ lang = 'tr', onOpenVideo, onJumpToPage }) {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz', 'vowels', 'flashcards', 'tracker'
  
  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Tracker state
  const [memorizedList, setMemorizedList] = useState(() => {
    try {
      const saved = localStorage.getItem('memorized_duas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMemorized = (id) => {
    const next = memorizedList.includes(id) 
      ? memorizedList.filter(item => item !== id)
      : [...memorizedList, id];
    setMemorizedList(next);
    try {
      localStorage.setItem('memorized_duas', JSON.stringify(next));
    } catch {}
  };

  // Generate a new quiz question
  const generateQuestion = () => {
    const correct = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
    // Pick 3 random wrong letters
    const wrongs = ARABIC_LETTERS.filter(l => l.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [correct, ...wrongs].sort(() => 0.5 - Math.random());
    
    setCurrentQuestion({ correct, options });
    setSelectedOption(null);
    setIsAnswered(false);

    // Auto play question sound
    setTimeout(() => {
      playAudioFile(correct.audio);
    }, 200);
  };

  useEffect(() => {
    if (activeTab === 'quiz' && !currentQuestion) {
      generateQuestion();
    }
  }, [activeTab]);

  const handleSelectAnswer = (option) => {
    if (isAnswered) return;
    setSelectedOption(option.id);
    setIsAnswered(true);
    setQuizTotal(prev => prev + 1);

    if (option.id === currentQuestion.correct.id) {
      setQuizScore(prev => prev + 1);
      sfx.playSuccess();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sfx.playTryAgain();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Practice Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {lang === 'de' ? 'Koran-Übungszentrum' : 'Kur\'an Pratik & Test Merkezi'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'de'
              ? 'Festigen Sie Ihr Wissen durch Hörübungen, Vokaltests und Lernkarten.'
              : 'Duyarak tanıma testleri, hareke egzersizleri ve ezber takip çizelgesi.'}
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'quiz' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'de' ? 'Hörtest' : 'Harf Testi'}
          </button>
          <button
            onClick={() => setActiveTab('vowels')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'vowels' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'de' ? 'Vokale' : 'Hareke Egzersizi'}
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'flashcards' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'de' ? 'Lernkarten' : 'Harf Kartları'}
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'tracker' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'de' ? 'Memorierung' : 'Ezber Takibi'}
          </button>
        </div>
      </div>

      {/* 1. QUIZ TAB */}
      {activeTab === 'quiz' && currentQuestion && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm flex flex-col items-center text-center space-y-6">
          
          {/* Score Header */}
          <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500">
            <span>{lang === 'de' ? 'Frage' : 'Soru'}: {quizTotal + (isAnswered ? 0 : 1)}</span>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span>{lang === 'de' ? 'Punkte' : 'Skor'}: {quizScore} / {quizTotal}</span>
            </div>
          </div>

          {/* Sound Prompt */}
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={() => playAudioFile(currentQuestion.correct.audio)}
              className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all group"
              title="Sesi Tekrar Dinle"
            >
              <Volume2 className="w-12 h-12 group-hover:animate-pulse" />
            </button>
            <p className="text-sm font-medium text-slate-600">
              {lang === 'de'
                ? 'Hören Sie den Ton und wählen Sie den richtigen arabischen Buchstaben:'
                : 'Sesi dinleyin ve doğru Arapça harfi seçin:'}
            </p>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentQuestion.correct.id;
              
              let btnClass = "bg-slate-50 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800";
              if (isAnswered) {
                if (isCorrect) {
                  btnClass = "bg-emerald-500 border-2 border-emerald-600 text-white shadow-md animate-pulse";
                } else if (isSelected) {
                  btnClass = "bg-rose-500 border-2 border-rose-600 text-white shadow-md";
                } else {
                  btnClass = "bg-slate-50 border-2 border-slate-200 opacity-40 text-slate-400";
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer(opt)}
                  disabled={isAnswered}
                  className={`h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center transition-all ${btnClass}`}
                >
                  <span className="text-4xl sm:text-5xl font-quran leading-none mb-1">
                    {opt.char}
                  </span>
                  {isAnswered && (
                    <span className="text-xs font-semibold">
                      {lang === 'de' ? opt.nameDe : opt.nameTr}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Question */}
          {isAnswered && (
            <div className="w-full max-w-md pt-4 flex flex-col items-center gap-3 animate-pop">
              <div className="text-sm font-semibold">
                {selectedOption === currentQuestion.correct.id ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <Check className="w-5 h-5" />
                    {lang === 'de' ? 'Richtig! Ausgezeichnet!' : 'Doğru! Harika bir dinleme!'}
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1.5">
                    <X className="w-5 h-5" />
                    {lang === 'de' ? `Falsch. Richtige Antwort: ${currentQuestion.correct.nameDe}` : `Yanlış. Doğru cevap: ${currentQuestion.correct.nameTr}`}
                  </span>
                )}
              </div>

              <button
                onClick={generateQuestion}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{lang === 'de' ? 'Nächste Frage' : 'Sonraki Soru'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* 2. VOWELS (HAREKELER) TAB */}
      {activeTab === 'vowels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VOWELS_DATA.map((vowel) => (
              <div 
                key={vowel.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-base">
                      {lang === 'de' ? vowel.nameDe : vowel.nameTr}
                    </h3>
                    <span className="text-3xl text-emerald-600 font-quran">
                      {vowel.symbol}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {lang === 'de' ? vowel.descDe : vowel.descTr}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {lang === 'de' ? 'Beispiele zum Anhören:' : 'Sesli Örnekler:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {vowel.examples.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => playAudioFile(ex.sound)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition flex flex-col items-center group active:scale-95"
                      >
                        <span className="text-2xl font-quran text-slate-800 group-hover:text-emerald-700">
                          {ex.char}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium mt-1">
                          {ex.textTr}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Jump to book page */}
                <button
                  onClick={() => onJumpToPage && onJumpToPage(vowel.pageNumber)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === 'de' ? `Buchseite ${vowel.pageNumber} öffnen` : `${vowel.pageNumber}. Kitap Sayfasını Aç`}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FLASHCARDS TAB */}
      {activeTab === 'flashcards' && (
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-sm flex items-center justify-between text-xs text-slate-500">
            <span>{cardIndex + 1} / {ARABIC_LETTERS.length}</span>
            <span>{lang === 'de' ? 'Klicken zum Umdrehen' : 'Tıkla ve kartı çevir'}</span>
          </div>

          {/* Flashcard Component */}
          {(() => {
            const letter = ARABIC_LETTERS[cardIndex];
            return (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-sm h-80 rounded-3xl bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 p-8 shadow-xl flex flex-col items-center justify-between cursor-pointer hover:border-emerald-500 transition-all select-none text-center relative"
              >
                {!isFlipped ? (
                  // Front: Letter in Large Calligraphy
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-7xl sm:text-8xl font-quran text-slate-800 drop-shadow-sm mb-4">
                      {letter.char}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {lang === 'de' ? 'Aussprache anhören' : 'Okunuşunu dinle'}
                    </span>
                  </div>
                ) : (
                  // Back: Details, Pronunciation & Meaning
                  <div className="flex-1 flex flex-col items-center justify-center space-y-3 animate-pop">
                    <h3 className="text-2xl font-bold text-emerald-700">
                      {lang === 'de' ? letter.nameDe : letter.nameTr}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {lang === 'de' ? `Eigenschaft: ${letter.soundHintDe}` : `Mahreç / Özellik: ${letter.soundHintTr}`}
                    </p>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      Harf Sırası: #{letter.id}
                    </span>
                  </div>
                )}

                {/* Audio button inside card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudioFile(letter.audio);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{lang === 'de' ? 'Anhören' : 'Telaffuz'}</span>
                </button>
              </div>
            );
          })()}

          {/* Card Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCardIndex((prev) => (prev > 0 ? prev - 1 : ARABIC_LETTERS.length - 1));
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold transition"
            >
              {lang === 'de' ? 'Vorherige' : 'Önceki'}
            </button>
            <button
              onClick={() => {
                setCardIndex((prev) => (prev < ARABIC_LETTERS.length - 1 ? prev + 1 : 0));
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition"
            >
              {lang === 'de' ? 'Nächste' : 'Sonraki'}
            </button>
          </div>
        </div>
      )}

      {/* 4. TRACKER TAB */}
      {activeTab === 'tracker' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {lang === 'de' ? 'Namaz-Suren & Gebete Lernfortschritt' : 'Namaz Sureleri ve Duaları Ezber Çizelgesi'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'de'
                  ? `${memorizedList.length} von ${VIDEOS_DATA.length} auswendig gelernt`
                  : `${VIDEOS_DATA.length} duadan ${memorizedList.length} tanesi ezberlendi`}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-36 sm:w-48 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${(memorizedList.length / VIDEOS_DATA.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VIDEOS_DATA.map((item) => {
              const isChecked = memorizedList.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isChecked 
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMemorized(item.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                        isChecked 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'bg-white border-slate-300 hover:border-emerald-500'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <div>
                      <span className="font-bold text-sm block">
                        {lang === 'de' ? item.titleDe : item.titleTr}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        p.{item.pageNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onOpenVideo && (
                      <button
                        onClick={() => onOpenVideo(item)}
                        className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition"
                        title="Videolu Anlatımı İzle"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onJumpToPage && (
                      <button
                        onClick={() => onJumpToPage(item.pageNumber)}
                        className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                        title="Kitap Sayfasına Git"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
