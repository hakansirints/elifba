import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, Volume2, Check } from 'lucide-react';
import { LETTERS } from '../../data/alphabetData.js';
import { playAudioFile, stopCurrentAudio } from '../../utils/audioPlayer.js';
import { assetUrl } from '../../utils/urls.js';

/**
 * Child-friendly Makhraj metadata matching the simplified cartoon cross-section image (506x512).
 * Coordinate space: width 506, height 512.
 * NO Turkish phonetic letter names (no "Elif", "Ba", "Ta") are shown.
 */
const CHILD_MAKHRAJ_DATA = {
  1: { // ا - Elif
    organCategory: 'bogaz',
    zoneName: { tr: 'Boğaz Dibi (Ses Telleri)', de: 'Tiefe Kehle' },
    desc: {
      tr: 'Ses boğazın en dibinden, ses tellerinden engelsiz rahat bir nefes gibi çıkar.',
      de: 'Der Laut strömt frei aus der tiefen Kehle heraus.',
    },
    point: { x: 428, y: 435 },
    organLabel: { tr: 'Boğaz Dibi', de: 'Tiefe Kehle' },
  },
  2: { // ب - Bâ
    organCategory: 'dudak',
    zoneName: { tr: 'İki Dudak (Kapanıp Açılma)', de: 'Beide Lippen' },
    desc: {
      tr: 'İki dudak birbirine tatlıca yapışır ve aniden açılarak sesi patlatır.',
      de: 'Beide Lippen schließen sich und öffnen sich mit leichtem Druck.',
    },
    point: { x: 75, y: 255 },
    organLabel: { tr: 'İki Dudak', de: 'Lippen' },
  },
  3: { // ت - Tâ
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Üst Ön Diş Dipleri', de: 'Zungenspitze & oberer Zahnansatz' },
    desc: {
      tr: 'Dilin ucu üstteki ön iki dişin etlerine (diş diplerine) tık diye dokunur.',
      de: 'Die Zungenspitze tippt an den Ansatz der oberen Schneidezähne.',
    },
    point: { x: 125, y: 215 },
    organLabel: { tr: 'Dil Ucu & Diş Dibi', de: 'Zahnansatz' },
  },
  4: { // ث - Sâ (Peltek)
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Üst Ön Diş Uçları (Peltek İnce)', de: 'Zungenspitze & Zahnkanten (Peltek)' },
    desc: {
      tr: 'Dilinin ucunu ön dişlerinin arasından hafifçe dışarı çıkar ve tatlıca fısılda.',
      de: 'Die Zungenspitze schaut leicht zwischen den Zähnen hervor (Lispellaut).',
    },
    point: { x: 92, y: 245 },
    organLabel: { tr: 'Peltek (Diş Uçları)', de: 'Zahnkanten' },
  },
  5: { // ج - Cîm
    organCategory: 'damak',
    zoneName: { tr: 'Dil Ortası & Üst Damak', de: 'Zungenmitte & Gaumen' },
    desc: {
      tr: 'Dilinin ortası tavandaki sert damağa kuvvetlice yapışıp ayrılır.',
      de: 'Die Zungenmitte drückt gegen den oberen Gaumen und löst sich.',
    },
    point: { x: 260, y: 220 },
    organLabel: { tr: 'Dil Ortası & Damak', de: 'Gaumen' },
  },
  6: { // ح - Hâ
    organCategory: 'bogaz',
    zoneName: { tr: 'Boğaz Ortası (Ferah Nefes)', de: 'Mittlere Kehle' },
    desc: {
      tr: 'Boğazının tam ortasından, adeta cama buğu yapar gibi yumuşacık bir nefesle çıkar.',
      de: 'Sanfter Hauchlaut aus der Mitte der Kehle, wie beim Anhauchen eines Spiegels.',
    },
    point: { x: 420, y: 350 },
    organLabel: { tr: 'Boğaz Ortası', de: 'Mittlere Kehle' },
  },
  7: { // خ - Hı (Kalın)
    organCategory: 'bogaz',
    zoneName: { tr: 'Boğaz Üstü & Küçük Dil (Hırıltılı Kalın)', de: 'Oberer Rachen (Rau)' },
    desc: {
      tr: 'Boğazının en üstünden, küçük dilin arkasından hafif hırıltılı ve tok çıkar.',
      de: 'Rauer, dunkler Reibelaut aus dem oberen Rachen beim Gaumenzäpfchen.',
    },
    point: { x: 405, y: 250 },
    organLabel: { tr: 'Boğaz Üstü', de: 'Oberer Rachen' },
  },
  8: { // د - Dâl
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Üst Ön Diş Dipleri', de: 'Zungenspitze & oberer Zahnansatz' },
    desc: {
      tr: 'Dil ucu üst diş diplerine vurur; net ve tıkırtılı bir sestir.',
      de: 'Die Zungenspitze tippt fest gegen den oberen Zahnansatz.',
    },
    point: { x: 125, y: 215 },
    organLabel: { tr: 'Dil Ucu & Diş Dibi', de: 'Zahnansatz' },
  },
  9: { // ذ - Zâl (Peltek)
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Diş Uçları (Peltek İnce)', de: 'Zungenspitze & Zahnkanten' },
    desc: {
      tr: 'Dil ucunu ön dişlerin ucuna hafifçe değdir; arı gibi ama peltek vızıldar.',
      de: 'Zungenspitze sanft an den Schneidezahnspitzen; stimmhafter Lispellaut.',
    },
    point: { x: 92, y: 245 },
    organLabel: { tr: 'Peltek (Diş Uçları)', de: 'Zahnkanten' },
  },
  10: { // ر - Râ
    organCategory: 'dil',
    zoneName: { tr: 'Dil Sırtı & Üst Diş Eti (Titrek Köprü)', de: 'Zungenrücken & Zahndamm' },
    desc: {
      tr: 'Dilinin ucunun arkası üst diş etine pır pır diye titreyerek dokunur.',
      de: 'Der Zungenrücken vibriert sanft am oberen Zahndamm.',
    },
    point: { x: 175, y: 235 },
    organLabel: { tr: 'Dil Sırtı & Diş Eti', de: 'Zahndamm' },
  },
  11: { // ز - Zê
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Alt Ön Dişler (Keskin Arı Vızıltısı)', de: 'Zungenspitze & untere Zähne' },
    desc: {
      tr: 'Dilinin ucunu alt ön dişlerine yaklaştır; keskin bir arı gibi vızıldat.',
      de: 'Zungenspitze an den unteren Zähnen; scharfer, summender Laut.',
    },
    point: { x: 110, y: 270 },
    organLabel: { tr: 'Alt Ön Dişler', de: 'Untere Zähne' },
  },
  12: { // س - Sîn
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Alt Ön Dişler (İnce Islık)', de: 'Zungenspitze & untere Zähne' },
    desc: {
      tr: 'Dil ucu alt dişlere yaklaşır; hava incecik ve keskin bir ıslık gibi süzülür.',
      de: 'Zungenspitze an den unteren Zähnen; zarter, zischender S-Laut.',
    },
    point: { x: 110, y: 270 },
    organLabel: { tr: 'Alt Ön Dişler', de: 'Untere Zähne' },
  },
  13: { // ش - Şîn
    organCategory: 'damak',
    zoneName: { tr: 'Dil Ortası & Geniş Damak (Rüzgar Yayılışı)', de: 'Zungenmitte & Gaumen' },
    desc: {
      tr: 'Dilin ortası damağa doğru yayılır, hava ağzının içine püfür püfür yayılır.',
      de: 'Zungenmitte breitet sich zum Gaumen aus mit weiter Luftströmung.',
    },
    point: { x: 260, y: 220 },
    organLabel: { tr: 'Dil Ortası & Damak', de: 'Gaumen' },
  },
  14: { // ص - Sâd (Kalın)
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu Alt Dişler + Dil Arkası Kalkık (Kalın S)', de: 'Zungenspitze & Gaumenerhebung' },
    desc: {
      tr: 'Dil ucu alt dişlere yaslanırken dilin arkası damağa kalkar; ağız içi dolgunlaşır.',
      de: 'Zungenspitze unten, während sich der Zungenrücken für einen dunklen Klang hebt.',
    },
    point: { x: 110, y: 270 },
    organLabel: { tr: 'Alt Dişler (Kalın S)', de: 'Dunkles S' },
  },
  15: { // ض - Dâd (En Özel Harf)
    organCategory: 'dil',
    zoneName: { tr: 'Dil Yan Kenarları & Üst Azı Dişleri', de: 'Zungenränder & Backenzähne' },
    desc: {
      tr: 'Dilinin sağ veya sol yan kenarını üst azı dişlerine yaslayarak uzat.',
      de: 'Die Zungenränder drücken seitlich an die oberen Backenzähne.',
    },
    point: { x: 210, y: 220 },
    organLabel: { tr: 'Dil Yanı & Azı Dişler', de: 'Backenzähne' },
  },
  16: { // ط - Tı (Kalın)
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Üst Diş Dipleri (Kalın Tok T)', de: 'Zungenspitze & Zahndamm (Dunkel)' },
    desc: {
      tr: 'Dil ucu üst diş diplerine değer, dilin ortası tavana doğru kubbe gibi kabarır.',
      de: 'Zungenspitze am Zahndamm; die Zunge wölbt sich voll für ein dunkles T.',
    },
    point: { x: 125, y: 215 },
    organLabel: { tr: 'Dil Ucu (Kalın T)', de: 'Dunkles T' },
  },
  17: { // ظ - Zı (Kalın Peltek)
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu Diş Uçları (Hem Peltek Hem Kalın)', de: 'Zahnspitzen (Dunkel & Peltek)' },
    desc: {
      tr: 'Dil ucunu dişlerin arasına uzat, dilinin arkasını da kaldır; hem peltek hem kalındır.',
      de: 'Zungenspitze an den Zahnspitzen mit angehobenem Zungenrücken.',
    },
    point: { x: 92, y: 245 },
    organLabel: { tr: 'Kalın Peltek', de: 'Dunkel-Peltek' },
  },
  18: { // ع - Ayn
    organCategory: 'bogaz',
    zoneName: { tr: 'Boğaz Ortası (Tok Ses)', de: 'Mittlere Kehle' },
    desc: {
      tr: 'Boğazının tam ortasındaki kasları tatlıca sıkarak derinden ve tokça söyle.',
      de: 'Aus der mittleren Kehle mit leichter Muskelverengung.',
    },
    point: { x: 420, y: 350 },
    organLabel: { tr: 'Boğaz Ortası', de: 'Mittlere Kehle' },
  },
  19: { // غ - Gayn (Kalın)
    organCategory: 'bogaz',
    zoneName: { tr: 'Boğaz Üstü (Kalın ve Yumuşak)', de: 'Oberer Rachen' },
    desc: {
      tr: 'Boğazının ağza en yakın üst kısmından, suyla gargara yapar gibi yumuşak ve kalın akar.',
      de: 'Ein weicher, gurgelnder Laut aus dem oberen Rachenraum.',
    },
    point: { x: 405, y: 250 },
    organLabel: { tr: 'Boğaz Üstü', de: 'Oberer Rachen' },
  },
  20: { // ف - Fê
    organCategory: 'dudak',
    zoneName: { tr: 'Üst Ön Dişler & Alt Dudak', de: 'Obere Zähne & Unterlippe' },
    desc: {
      tr: 'Üst iki ön dişinin ucunu alt dudağının iç tarafına hafifçe dokundur.',
      de: 'Die oberen Schneidezähne berühren sanft die Unterlippe.',
    },
    point: { x: 95, y: 255 },
    organLabel: { tr: 'Üst Diş & Alt Dudak', de: 'Zähne & Lippe' },
  },
  21: { // ق - Kâf (Kalın)
    organCategory: 'damak',
    zoneName: { tr: 'Dil Kökü & Küçük Dil (Kalın K)', de: 'Zungenwurzel & Zäpfchen' },
    desc: {
      tr: 'Dilinin en arka kökü, küçük dil hizasındaki yumuşak tavana tokmak gibi vurur.',
      de: 'Hinterste Zungenwurzel schlägt gegen den weichen Gaumen beim Zäpfchen.',
    },
    point: { x: 355, y: 235 },
    organLabel: { tr: 'Dil Kökü & Küçük Dil', de: 'Gaumenzäpfchen' },
  },
  22: { // ك - Kef (İnce)
    organCategory: 'damak',
    zoneName: { tr: 'Dil Arkası & Ön Damak (İnce K)', de: 'Hintere Zunge & harter Gaumen' },
    desc: {
      tr: 'Kâf harfinin birazcık önünde, damağın sert kısmından incecik ve hafif nefesle çıkar.',
      de: 'Etwas weiter vorn am harten Gaumen; hell und zart.',
    },
    point: { x: 295, y: 215 },
    organLabel: { tr: 'Ön Damak (İnce K)', de: 'Harter Gaumen' },
  },
  23: { // ل - Lâm
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu Kenarları & Üst Diş Etleri', de: 'Zungenränder & Zahndamm' },
    desc: {
      tr: 'Dilinin ucunun iki yanı üst diş etlerine genişçe dokunup ayrılır.',
      de: 'Die vorderen Zungenränder berühren breit den oberen Zahndamm.',
    },
    point: { x: 160, y: 220 },
    organLabel: { tr: 'Dil Yanları & Diş Eti', de: 'Zahndamm' },
  },
  24: { // م - Mîm
    organCategory: 'dudak',
    zoneName: { tr: 'İki Dudak Kapanışı & Geniz (Burun)', de: 'Beide Lippen & Nase' },
    desc: {
      tr: 'İki dudak yumuşakça kapanır; sesin tatlı bir kısmı burnundan (genizden) uğuldar.',
      de: 'Beide Lippen schließen sich; der Ton summt durch die Nase.',
    },
    point: { x: 75, y: 255 },
    organLabel: { tr: 'Dudaklar & Geniz', de: 'Lippen & Nase' },
  },
  25: { // ن - Nûn
    organCategory: 'dil',
    zoneName: { tr: 'Dil Ucu & Üst Diş Eti + Geniz (Gunne)', de: 'Zungenspitze & Nase' },
    desc: {
      tr: 'Dil ucun üst diş etine değer; sesin yarısı burun boşluğundan (genizden) gelir.',
      de: 'Zungenspitze am Zahndamm; der Laut schwingt durch die Nase.',
    },
    point: { x: 145, y: 225 },
    organLabel: { tr: 'Dil Ucu & Geniz', de: 'Zungenspitze & Nase' },
  },
  26: { // و - Vâv
    organCategory: 'dudak',
    zoneName: { tr: 'Dudaklar (Öne Yuvarlama)', de: 'Lippenrundung' },
    desc: {
      tr: 'Dudaklarını düdük çalar gibi öne doğru yuvarlakça büz.',
      de: 'Die Lippen trichterförmig nach vorn runden.',
    },
    point: { x: 65, y: 255 },
    organLabel: { tr: 'Yuvarlak Dudak', de: 'Runde Lippen' },
  },
  27: { // ه - Hê
    organCategory: 'bogaz',
    zoneName: { tr: 'Boğaz Dibi (Göğüsten Derin Nefes)', de: 'Tiefe Kehle' },
    desc: {
      tr: 'Boğazın en dibinden, göğsünden gelen rahatlatıcı derin bir oh sesi gibidir.',
      de: 'Ein sanfter Hauch direkt aus der tiefsten Kehle.',
    },
    point: { x: 428, y: 435 },
    organLabel: { tr: 'Boğaz Dibi', de: 'Tiefe Kehle' },
  },
  28: { // لا - Lâmelif
    organCategory: 'damak',
    zoneName: { tr: 'Lâm ve Elif Birleşimi', de: 'Lam-Alif Verbindung' },
    desc: {
      tr: 'Lâm harfinin dil ucu mahreci ile Elif harfinin boğaz mahrecinin birleşimidir.',
      de: 'Verbindung der Laute von Lam und Alif.',
    },
    point: { x: 160, y: 220 },
    organLabel: { tr: 'Lâm + Elif', de: 'Lam + Alif' },
  },
  29: { // ى - Yâ
    organCategory: 'damak',
    zoneName: { tr: 'Dil Ortası & Sert Damak (Akıcı İnce)', de: 'Zungenmitte & Gaumen' },
    desc: {
      tr: 'Dilinin ortası tavana doğru yaklaşır; yumuşacık ve akıcı bir y sesi akar.',
      de: 'Die Zungenmitte nähert sich dem Gaumen wie j in "ja".',
    },
    point: { x: 260, y: 220 },
    organLabel: { tr: 'Dil Ortası & Damak', de: 'Gaumen' },
  },
};

const ORGAN_FILTERS = [
  { id: 'all', tr: '✨ Hepsi', de: '✨ Alle' },
  { id: 'dudak', tr: '👄 Dudak', de: '👄 Lippen' },
  { id: 'dil', tr: '👅 Dil', de: '👅 Zunge' },
  { id: 'damak', tr: '🏛️ Damak', de: '🏛️ Gaumen' },
  { id: 'bogaz', tr: '🧣 Boğaz', de: '🧣 Kehle' },
];

export default function MakhrajWorkshop({ lang = 'tr', speed = 1, onBack }) {
  const de = lang === 'de';
  const [selectedId, setSelectedId] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [isVoicing, setIsVoicing] = useState(false);

  const audioToken = useRef(0);
  const selectedLetter = LETTERS.find(l => l.id === selectedId) || LETTERS[0];
  const meta = CHILD_MAKHRAJ_DATA[selectedId] || CHILD_MAKHRAJ_DATA[1];

  const playSound = (slow = false) => {
    audioToken.current++;
    const token = audioToken.current;
    setIsVoicing(true);
    const playbackRate = slow ? 0.72 : speed;

    playAudioFile(selectedLetter.audio, {
      label: selectedLetter.char,
      speed: playbackRate,
      presentation: 'activity',
      onEnd: () => {
        if (audioToken.current === token) setIsVoicing(false);
      },
      onError: () => {
        if (audioToken.current === token) setIsVoicing(false);
      },
    });
  };

  const handleSelectLetter = id => {
    stopCurrentAudio();
    setSelectedId(id);
    setIsVoicing(false);
  };

  useEffect(() => {
    playSound(isSlowMotion);
    return () => {
      audioToken.current++;
      stopCurrentAudio();
    };
  }, [selectedId, isSlowMotion]);

  // Filter letters based on active organ button
  const filteredLetters = LETTERS.filter(l => {
    if (selectedFilter === 'all') return true;
    const itemMeta = CHILD_MAKHRAJ_DATA[l.id];
    return itemMeta?.organCategory === selectedFilter;
  });

  const profileImgUrl = assetUrl('assets/images/mahrec-profile.png');

  return (
    <div className="activity-game-frame makhraj-workshop-frame">
      {/* Top Header */}
      <div className="activity-round-meta">
        <button className="activity-btn" onClick={onBack} aria-label={de ? 'Zurück' : 'Geri'}>
          <ArrowLeft size={16} />
          <span>{de ? 'Aktivitäten' : 'Etkinlikler'}</span>
        </button>
        <span className="makhraj-meta-heading">
          {de ? 'Artikulation & Mundhöhle der Buchstaben' : 'Harflerin Ağız & Boğaz Çıkış Yerleri'}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            className={`activity-btn ${!isSlowMotion ? 'activity-primary' : ''}`}
            onClick={() => {
              setIsSlowMotion(false);
              playSound(false);
            }}
            title={de ? 'Normale Geschwindigkeit' : 'Normal Hız (1.0x)'}
          >
            <Volume2 size={16} />
            <span>1.0x</span>
          </button>
          <button
            className={`activity-btn ${isSlowMotion ? 'activity-primary' : ''}`}
            onClick={() => {
              setIsSlowMotion(true);
              playSound(true);
            }}
            title={de ? 'Verlangsamt' : 'Ağır Çekim (0.75x)'}
          >
            <Play size={15} />
            <span>0.75x</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Left Cartoon Diagram & Right Letters Palette */}
      <div className="makhraj-content-grid">
        {/* LEFT PANE: Child-friendly cartoon mouth diagram */}
        <div className="makhraj-visual-card">
          {/* 1. SIMPLIFIED CARTOON PROFILE STAGE (DISPLAYED AT THE TOP) */}
          <div className="makhraj-anatomy-stage child-friendly-stage">
            <div className="cartoon-profile-wrapper">
              {/* Reference image: child cartoon side-cutaway */}
              <img
                src={profileImgUrl}
                alt="Çocuk dostu ağız ve mahreç profili"
                className="cartoon-profile-base-img"
              />

              {/* Interactive SVG overlay matching 506x512 coordinates */}
              <svg
                viewBox="0 0 506 512"
                className="cartoon-profile-overlay"
                aria-hidden="true"
              >
                <defs>
                  <filter id="makhraj-child-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Visible Lower Teeth Row (Alt Dişler) */}
                <g id="makhraj-lower-teeth" className="cartoon-lower-teeth" opacity="0.95">
                  <path
                    d="M 136 248 C 140 240, 160 240, 166 248 C 172 256, 170 270, 165 273 C 158 276, 140 276, 134 270 C 130 264, 132 253, 136 248 Z"
                    fill="#fbf8ee"
                    stroke="#5a3825"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 166 248 C 172 240, 196 240, 204 248 C 212 256, 210 270, 203 273 C 195 276, 174 276, 166 270 Z"
                    fill="#fbf8ee"
                    stroke="#5a3825"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 204 248 C 210 242, 238 242, 246 250 C 254 258, 250 270, 242 273 C 232 276, 212 276, 204 270 Z"
                    fill="#fbf8ee"
                    stroke="#5a3825"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 100 273 C 140 280, 200 280, 250 273"
                    fill="none"
                    stroke="#df7b62"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </g>

                {/* Pulsing Target Point & Concentric Ripples (NO obstructive label text) */}
                {meta.point && (
                  <g
                    className="cartoon-pulse-target"
                    transform={`translate(${meta.point.x}, ${meta.point.y})`}
                  >
                    {/* Concentric ripple rings */}
                    <circle className="cartoon-wave wave-1" r="14" />
                    <circle className="cartoon-wave wave-2" r="26" />
                    <circle className="cartoon-wave wave-3" r="38" />

                    {/* Central glowing core pin: Emerald Green */}
                    <circle cx="0" cy="0" r="10" fill="#10b981" filter="url(#makhraj-child-glow)" />
                    <circle cx="0" cy="0" r="5" fill="#ffffff" />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* 2. EXPLANATION CONTAINER (DISPLAYED UNDER THE MODEL WITH LARGER FONT) */}
          <div className="makhraj-explanation-bottom">
            <span className="makhraj-large-char" dir="rtl">
              {selectedLetter.char}
            </span>
            <div className="makhraj-title-group">
              <span className="makhraj-zone-badge">{meta.zoneName[lang]}</span>
              <p className="makhraj-desc-text">{meta.desc[lang]}</p>
            </div>
            <button
              className={`activity-btn makhraj-replay-btn ${isVoicing ? 'is-speaking' : ''}`}
              onClick={() => playSound(isSlowMotion)}
              aria-label={de ? 'Laut anhören' : 'Sesi tekrar dinle'}
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

        {/* RIGHT PANE: Arabic Letters Palette (NO Turkish names!) */}
        <div className="makhraj-letters-card">
          {/* Organ Filter Pills */}
          <div className="makhraj-organ-filters">
            {ORGAN_FILTERS.map(f => (
              <button
                key={f.id}
                className={`makhraj-organ-btn ${selectedFilter === f.id ? 'is-active' : ''}`}
                onClick={() => setSelectedFilter(f.id)}
              >
                {f[lang]}
              </button>
            ))}
          </div>

          <div className="makhraj-palette-header">
            <h4>{de ? 'Buchstabe berühren:' : 'İncelemek için harfe dokun:'}</h4>
            <small>
              {de
                ? `${filteredLetters.length} Buchstaben angezeigt`
                : `${filteredLetters.length} harf listelendi`}
            </small>
          </div>

          {/* Grid of only Arabic letter glyphs */}
          <div className="makhraj-alphabet-grid" dir="rtl">
            {filteredLetters.map(l => {
              const isSelected = l.id === selectedId;
              return (
                <button
                  key={l.id}
                  className={`makhraj-letter-cell ${isSelected ? 'is-active' : ''}`}
                  onClick={() => handleSelectLetter(l.id)}
                  aria-pressed={isSelected}
                  aria-label={l.char}
                >
                  <span className="makhraj-cell-char">{l.char}</span>
                  {isSelected && (
                    <span className="makhraj-cell-check">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
