import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, Trophy, Star, Sparkles, Check, RotateCcw, 
  ArrowRight, Award, Zap, Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAudioFile, sfx } from '../../utils/audioPlayer';

export default function TopicGameModal({ topic, onClose, lang = 'tr', onCompleteTopic }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Generate 4-5 tailored questions based on topic type
  useEffect(() => {
    if (!topic) return;

    let qList = [];
    const items = topic.items || [];

    if (topic.id === 'letters' || topic.id === 'fetha' || topic.id === 'kesra' || topic.id === 'damme' || topic.id === 'cezim' || topic.id === 'sedde' || topic.id === 'tenvin') {
      // Sound recognition rounds
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(5, items.length));

      qList = selected.map((item) => {
        const wrongPool = items.filter(x => (x.char || x.nameTr) !== (item.char || item.nameTr));
        const wrongOpts = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [item, ...wrongOpts].sort(() => 0.5 - Math.random());
        return {
          type: 'sound',
          audio: item.audio,
          correct: item,
          options,
          promptTr: `"${item.soundText || item.nameTr}" sesini veren doğru kart hangisidir?`,
          promptDe: `Welche Karte hat den Laut "${item.soundText || item.nameDe}"?`
        };
      });
    } else if (topic.id === 'shapes') {
      // Shape matching rounds
      const shuffled = [...items].sort(() => 0.5 - Math.random()).slice(0, 4);
      qList = shuffled.map((item) => {
        const wrongOpts = items.filter(x => x.base !== item.base).sort(() => 0.5 - Math.random()).slice(0, 2);
        const options = [item, ...wrongOpts].sort(() => 0.5 - Math.random());
        return {
          type: 'shape',
          audio: item.audio,
          correct: item,
          options,
          promptTr: `Müstakil "${item.base}" harfinin kelime içindeki şekli hangisidir?`,
          promptDe: `Wie sieht der Buchstabe "${item.base}" im Wort aus?`
        };
      });
    } else if (topic.id === 'duas') {
      // Dua quiz
      qList = [
        {
          promptTr: 'Namazda ilk rekatta Fâtiha\'dan önce okunan ve "Sübhânekellâhümme" ile başlayan dua hangisidir?',
          promptDe: 'Welches Gebet beginnt mit "Subhânekellâhumme"?',
          correct: { nameTr: 'Sübhâneke Duâsı', nameDe: 'Subhâneke Gebet' },
          options: [
            { nameTr: 'Sübhâneke Duâsı', nameDe: 'Subhâneke Gebet' },
            { nameTr: 'Et-Tahiyyâtu', nameDe: 'Et-Tahiyyâtu' },
            { nameTr: 'Allâhumme Salli', nameDe: 'Allâhumme Salli' }
          ]
        },
        {
          promptTr: 'Namazın oturuşlarında okunan ve Peygamberimizin Miraç\'taki selamlaşmasını anlatan dua hangisidir?',
          promptDe: 'Welches Gebet wird beim Sitzen im Gebet gesprochen?',
          correct: { nameTr: 'Et-Tahiyyâtu', nameDe: 'Et-Tahiyyâtu' },
          options: [
            { nameTr: 'Et-Tahiyyâtu', nameDe: 'Et-Tahiyyâtu' },
            { nameTr: 'Rabbenâ Âtinâ', nameDe: 'Rabbenâ Âtinâ' },
            { nameTr: 'Kunût Duâsı', nameDe: 'Qunût-Gebet' }
          ]
        },
        {
          promptTr: 'Vitir namazının son rekatında tekbir alınıp okunan özel dualar hangileridir?',
          promptDe: 'Welche Bittgebete werden im Witr-Gebet gesprochen?',
          correct: { nameTr: 'Kunût Duaları', nameDe: 'Qunût-Gebete' },
          options: [
            { nameTr: 'Kunût Duaları', nameDe: 'Qunût-Gebete' },
            { nameTr: 'Sübhâneke', nameDe: 'Subhâneke' },
            { nameTr: 'Allâhumme Bârik', nameDe: 'Allâhumme Bârik' }
          ]
        }
      ];
    } else if (topic.id === 'surahs') {
      // Surahs quiz
      qList = [
        {
          promptTr: 'Her namaz rekatında mutlaka okunan ve "Kur\'an\'ın Anası" sayılan sure hangisidir?',
          promptDe: 'Welche Sure wird in jeder Gebetseinheit gesprochen?',
          correct: { nameTr: 'Fâtiha Sûresi', nameDe: 'Sure Fâtiha' },
          options: [
            { nameTr: 'Fâtiha Sûresi', nameDe: 'Sure Fâtiha' },
            { nameTr: 'İhlâs Sûresi', nameDe: 'Sure Ichlâs' },
            { nameTr: 'Kevser Sûresi', nameDe: 'Sure Kewser' }
          ]
        },
        {
          promptTr: 'Allah\'ın bir olduğunu ("De ki: O Allah birdir") anlatan tevhid suresi hangisidir?',
          promptDe: 'Welche Sure erklärt die Einheit Allahs (Tawhid)?',
          correct: { nameTr: 'İhlâs Sûresi', nameDe: 'Sure Ichlâs' },
          options: [
            { nameTr: 'İhlâs Sûresi', nameDe: 'Sure Ichlâs' },
            { nameTr: 'Felak Sûresi', nameDe: 'Sure Felaq' },
            { nameTr: 'Nâs Sûresi', nameDe: 'Sure Nâs' }
          ]
        },
        {
          promptTr: 'Kabe\'yi yıkmaya gelen fil ordusunun Ebabil kuşlarıyla bozguna uğratılmasını anlatan sure?',
          promptDe: 'Welche Sure erzählt von der Elefanten-Armee?',
          correct: { nameTr: 'Fîl Sûresi', nameDe: 'Sure Fîl' },
          options: [
            { nameTr: 'Fîl Sûresi', nameDe: 'Sure Fîl' },
            { nameTr: 'Kureyş Sûresi', nameDe: 'Sure Quraysch' },
            { nameTr: 'Tebbet Sûresi', nameDe: 'Sure Tebbet' }
          ]
        }
      ];
    } else if (topic.id === 'farz') {
      // 32 Farz quiz
      qList = [
        {
          promptTr: 'İslam\'ın şartları kaç tanedir?',
          promptDe: 'Wie viele Säulen hat der Islam?',
          correct: { nameTr: '5 Tane', nameDe: '5 Säulen' },
          options: [
            { nameTr: '5 Tane', nameDe: '5 Säulen' },
            { nameTr: '6 Tane', nameDe: '6 Säulen' },
            { nameTr: '4 Tane', nameDe: '4 Säulen' }
          ]
        },
        {
          promptTr: 'Abdestin farzları kaç tanedir?',
          promptDe: 'Wie viele Pflichten hat die Gebetswaschung?',
          correct: { nameTr: '4 Tane', nameDe: '4 Pflichten' },
          options: [
            { nameTr: '4 Tane', nameDe: '4 Pflichten' },
            { nameTr: '3 Tane', nameDe: '3 Pflichten' },
            { nameTr: '5 Tane', nameDe: '5 Pflichten' }
          ]
        },
        {
          promptTr: 'İmanın şartları kaç tanedir?',
          promptDe: 'Wie viele Säulen hat der Glaube (Iman)?',
          correct: { nameTr: '6 Tane', nameDe: '6 Säulen' },
          options: [
            { nameTr: '6 Tane', nameDe: '6 Säulen' },
            { nameTr: '5 Tane', nameDe: '5 Säulen' },
            { nameTr: '7 Tane', nameDe: '7 Säulen' }
          ]
        }
      ];
    }

    setQuestions(qList);
    setRound(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsGameOver(false);

    // Play first question audio if present
    if (qList[0]?.audio) {
      setTimeout(() => playAudioFile(qList[0].audio), 300);
    }
  }, [topic]);

  const currentQ = questions[round];

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const isCorrect = (opt.char && opt.char === currentQ.correct.char) ||
                      (opt.nameTr && opt.nameTr === currentQ.correct.nameTr) ||
                      (opt.soundText && opt.soundText === currentQ.correct.soundText);

    setSelectedAnswer(opt);

    if (isCorrect) {
      sfx.playSuccess();
      setScore(s => s + 10);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else {
      sfx.playTryAgain();
    }
  };

  const handleNextRound = () => {
    if (round + 1 < questions.length) {
      setRound(r => r + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      const nextQ = questions[round + 1];
      if (nextQ?.audio) {
        setTimeout(() => playAudioFile(nextQ.audio), 250);
      }
    } else {
      // Game Over
      setIsGameOver(true);
      sfx.playSuccess();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      if (onCompleteTopic && score >= questions.length * 10 * 0.8) {
        onCompleteTopic(topic.id, score);
      }
    }
  };

  if (!topic || questions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-pop">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Game Modal Header */}
        <div className={`p-4 sm:p-5 bg-gradient-to-r ${topic.color} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow">{topic.icon}</span>
            <div>
              <span className="text-[11px] font-kid font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                {lang === 'de' ? 'Konu Sonu Oyunu' : 'Konu Sonu Mücadelesi'}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold font-kid leading-tight mt-0.5">
                {lang === 'de' ? topic.game?.titleDe : topic.game?.titleTr}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl font-kid font-bold text-yellow-200">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>{score}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center space-y-6">
          
          {!isGameOver ? (
            <>
              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 rounded-full transition-all ${
                      i === round
                        ? 'w-8 bg-amber-400'
                        : i < round
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Sound replay button if audio question */}
              {currentQ.audio && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => playAudioFile(currentQ.audio)}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white shadow-lg hover:scale-110 active:scale-95 transition flex items-center justify-center group"
                  >
                    <Volume2 className="w-10 h-10 group-hover:animate-pulse" />
                  </button>
                  <span className="text-xs font-kid font-bold text-slate-500">
                    {lang === 'de' ? 'Ton anhören' : 'Sesi Tekrar Dinle'}
                  </span>
                </div>
              )}

              {/* Question Prompt */}
              <h4 className="text-base sm:text-xl font-extrabold font-kid text-slate-800 max-w-md">
                {lang === 'de' ? currentQ.promptDe : currentQ.promptTr}
              </h4>

              {/* Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full max-w-md">
                {currentQ.options.map((opt, idx) => {
                  const isOptSelected = selectedAnswer === opt;
                  const isCorrect = (opt.char && opt.char === currentQ.correct.char) ||
                                    (opt.nameTr && opt.nameTr === currentQ.correct.nameTr) ||
                                    (opt.soundText && opt.soundText === currentQ.correct.soundText);

                  let btnStyle = "bg-slate-50 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800";
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-500 border-2 border-emerald-600 text-white shadow-lg animate-pulse";
                    } else if (isOptSelected) {
                      btnStyle = "bg-rose-500 border-2 border-rose-600 text-white shadow-lg";
                    } else {
                      btnStyle = "bg-slate-50 border-2 border-slate-200 opacity-30 text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswered}
                      className={`h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center p-2 transition-all font-kid font-bold ${btnStyle}`}
                    >
                      {opt.char ? (
                        <span className="text-4xl sm:text-5xl font-quran leading-none mb-1">
                          {opt.char}
                        </span>
                      ) : (
                        <span className="text-sm sm:text-base leading-tight">
                          {lang === 'de' ? opt.nameDe : opt.nameTr}
                        </span>
                      )}
                      {isAnswered && opt.soundText && (
                        <span className="text-xs font-semibold mt-1">
                          {opt.soundText}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {isAnswered && (
                <div className="w-full max-w-xs animate-pop pt-2">
                  <button
                    onClick={handleNextRound}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-kid font-bold text-base shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <span>{round + 1 < questions.length ? (lang === 'de' ? 'Weiter' : 'Sonraki Soru') : (lang === 'de' ? 'Ergebnis sehen' : 'Sonucu Gör')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Game Over Celebration Screen
            <div className="space-y-5 animate-pop py-4">
              <div className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center text-5xl mx-auto shadow-inner animate-bounce-soft">
                🏆
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-kid text-slate-800">
                  {score >= questions.length*8 ? (lang === 'de' ? 'Aufgabe geschafft!' : 'Görevi tamamladın!') : (lang === 'de' ? 'Noch einmal üben' : 'Biraz daha tekrar edelim')}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {lang === 'de'
                    ? `${score / 10} von ${questions.length} richtig. Abschluss ab 80%.`
                    : `${questions.length} soruda ${score / 10} doğru. Tamamlama için en az %80 doğru gerekir.`}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-amber-500 text-3xl">
                ⭐⭐⭐
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-kid font-bold text-base shadow-md transition"
                >
                  {lang === 'de' ? 'Zurück zur Karte' : 'Haritaya Dön'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
