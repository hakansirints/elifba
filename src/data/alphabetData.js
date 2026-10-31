import { ARABIC_LETTERS } from './curriculumData.js';

export const COURSE_VERSION = 'alphabet-14-16-v1';
export const BOOK_PARTS = [
  { tr: '1. Bölüm: Elifba ve Kur’an Harfleri', de: '1. Teil: Elifba und die Koranbuchstaben', active: true },
  { tr: '2. Bölüm: Namaz Duaları ve Tesbihât', de: '2. Teil: Gebete und Tesbihât', active: false },
];
export const STEPS = [
  { id: 'tanima', tr: 'Harfleri tanı', de: 'Buchstaben kennenlernen', page: 14 },
  { id: 'gruplar', tr: 'Harf grupları', de: 'Buchstabengruppen', page: 15 },
  { id: 'sesler', tr: 'Dinle ve seslendir', de: 'Hören und nachsprechen', page: 15 },
  { id: 'pratik', tr: 'Pratik yap', de: 'Üben', page: 16 },
];
export const THICK_IDS = [7, 14, 15, 16, 17, 19, 21];
export const LISP_IDS = [4, 9, 17];
export const NON_JOIN_IDS = [1, 8, 9, 10, 11, 26];

// Descriptions are teaching aids; the local recordings remain the pronunciation model.
const details = [
  ['Dik bir çizgi. Kaynakta hemze (ء) ile birlikte gösterilir.', 'Harf adını kayıttan dinle. Elif ile hemzenin ayrıntılı okuma kuralları ileride ele alınacak.', 'Ein senkrechter Strich; die Vorlage zeigt auch Hamza (ء).', 'Höre den Buchstabennamen. Die Leseregeln für Alif und Hamza folgen später.'],
  ['Tek nokta gövdenin altında.', 'İki dudağı kapatıp açarak çıkar. Türkçedeki b sesine yakındır.', 'Ein Punkt unter der Form.', 'Beide Lippen schließen und öffnen; ähnlich dem deutschen b.'],
  ['Üstte yan yana iki nokta.', 'Dil ucu üst ön dişlerin diplerine dokunur. İnce bir sestir.', 'Zwei Punkte oben.', 'Die Zungenspitze berührt den Ansatz der oberen Schneidezähne. Ein heller Laut.'],
  ['Üstte üç nokta. Be ve Te ile aynı gövde.', 'Dil ucunu üst ön dişlerin ucuna hafifçe yaklaştır; hava aralıktan geçsin. Peltektir; düz s gibi söyleme.', 'Drei Punkte oben; dieselbe Grundform wie Ba und Ta.', 'Die Zungenspitze leicht an die oberen Schneidezahnspitzen bringen und Luft vorbeiströmen lassen; kein gewöhnliches s.'],
  ['Açık kıvrımın içinde, altta bir nokta.', 'Dilin orta bölgesi üst damağa yaklaşır. Türkçedeki c sesine yakındır.', 'Ein Punkt unten im offenen Bogen.', 'Die Zungenmitte nähert sich dem Gaumen; höre den Dsch-Laut der Aufnahme.'],
  ['Cim ile aynı gövde, noktasız.', 'Boğazın orta bölgesinden nefesli çıkar. He ile aynı değildir; boğazını sıkmadan kaydı taklit et.', 'Dieselbe Grundform wie Dschim, ohne Punkt.', 'Ein behauchter Laut aus der mittleren Kehle. Vom Ha (ه) unterscheiden; ohne Druck nachsprechen.'],
  ['Ha ile aynı gövde, üstte bir nokta.', 'Boğazın ağza yakın bölümünden hırıltılı ve kalın çıkar. Ha ve He kayıtlarıyla karşılaştır.', 'Dieselbe Grundform wie Ha, mit einem Punkt oben.', 'Ein dunkler Reibelaut aus dem oberen Rachen; mit ح und ه vergleichen.'],
  ['Kısa, köşeli kıvrım; noktasız.', 'Dil ucu üst ön dişlerin diplerine dokunur. Türkçedeki d sesine yakındır.', 'Eine kurze eckige Form ohne Punkt.', 'Die Zungenspitze berührt den Ansatz der oberen Schneidezähne; ähnlich d.'],
  ['Dal gövdesinin üstünde bir nokta.', 'Dil ucu üst ön dişlerin uçlarına hafifçe dokunur; sesli, peltek çıkar. Ze ile karıştırma.', 'Die Dal-Form mit einem Punkt oben.', 'Die Zungenspitze leicht an die oberen Schneidezahnspitzen legen; ein stimmhafter Interdentallaut, kein z.'],
  ['Aşağıya inen kıvrım; noktasız.', 'Dil ucu üst diş etlerine yaklaşır. Kaydı dinle; Ra, yerine göre kalın veya ince okunur.', 'Ein abwärts laufender Bogen ohne Punkt.', 'Die Zungenspitze nähert sich dem oberen Zahndamm. Ra wird je nach Lesesituation dunkel oder hell.'],
  ['Ra ile aynı gövde, üstte bir nokta.', 'Dil ucu alt ön dişlere yaklaşırken sesli bir z sesi çıkar. Zal gibi peltek değildir.', 'Die Ra-Form mit einem Punkt oben.', 'Die Zungenspitze nähert sich den unteren Schneidezähnen; ein stimmhafter s-Laut, kein Interdentallaut.'],
  ['Dişli gövde; noktasız.', 'Dil ucu alt ön dişlere yaklaşır; hava ince bir aralıktan geçer. İnce s sesini dinle.', 'Eine gezackte Form ohne Punkte.', 'Die Zungenspitze nähert sich den unteren Schneidezähnen; ein heller stimmloser s-Laut.'],
  ['Sin gövdesinin üstünde üç nokta.', 'Dilin orta bölgesi üst damağa yaklaşır. Türkçedeki ş sesine yakındır.', 'Die Sin-Form mit drei Punkten oben.', 'Die Zungenmitte nähert sich dem Gaumen; ähnlich dem deutschen sch.'],
  ['Kapalı oval gövde ve uzanan kuyruk; noktasız.', 'Sin ile benzer çıkış bölgesindedir; dilin arkası yükselir ve ses kalınlaşır. Sin ile sırayla dinle.', 'Ein geschlossenes Oval mit Auslauf, ohne Punkt.', 'Ähnliche Lautstelle wie Sin, aber mit angehobenem Zungenrücken und dunklem Klang. Abwechselnd hören.'],
  ['Sad gövdesinin üstünde bir nokta.', 'Dilin yan kenarı üst azı dişlerine dayanır. Türkçedeki d ile tam karşılanmaz; modeli yavaşça dinle.', 'Die Sad-Form mit einem Punkt oben.', 'Ein Zungenrand berührt die oberen Backenzähne. Kein gewöhnliches d; die Aufnahme langsam nachsprechen.'],
  ['Oval gövdeden yukarı uzanan dik çizgi; noktasız.', 'Dil ucu üst ön dişlerin diplerine dokunur; dilin arka bölümü yükselir. Te’den daha kalındır.', 'Eine ovale Form mit senkrechtem Strich, ohne Punkt.', 'Die Zungenspitze berührt den oberen Zahnansatz; der Zungenrücken hebt sich. Dunkler als Ta (ت).'],
  ['Tı gövdesinin üstünde bir nokta.', 'Dil ucu üst ön dişlerin uçlarına yaklaşır. Hem peltek hem kalındır; Zal ile karşılaştır.', 'Die Ta-Form (ط) mit einem Punkt oben.', 'Die Zungenspitze nähert sich den oberen Zahnspitzen. Dunkel und interdental; mit Dhal vergleichen.'],
  ['Üstü açık kıvrım; noktasız.', 'Boğazın orta bölgesinden sesli çıkar. Türkçede tam karşılığı yoktur; Elif diye okumadan kaydı taklit et.', 'Ein oben offener Bogen ohne Punkt.', 'Ein stimmhafter Laut aus der mittleren Kehle ohne genaue deutsche Entsprechung. Nicht als Alif lesen.'],
  ['Ayn gövdesinin üstünde bir nokta.', 'Boğazın ağza yakın bölümünden sesli ve kalın çıkar. Hı ile aynı bölgeye yakın olsa da sesi farklıdır.', 'Die Ain-Form mit einem Punkt oben.', 'Ein stimmhafter dunkler Reibelaut aus dem oberen Rachen. Von Cha unterscheiden.'],
  ['Küçük baş ve uzanan gövde; üstte bir nokta.', 'Üst ön dişlerin uçları alt dudağın iç kısmına hafifçe dokunur. İnce f sesidir.', 'Ein kleiner Kopf mit Auslauf und einem Punkt oben.', 'Die oberen Schneidezahnspitzen berühren leicht die untere Lippe; ähnlich f.'],
  ['Üstte iki nokta, aşağıya kıvrılan gövde.', 'Dilin en arka bölümü üst damağın arkasına yaklaşır. Kalındır; ince Kef ile karşılaştır.', 'Zwei Punkte oben und eine abgerundete Form.', 'Der hinterste Zungenbereich nähert sich dem hinteren Gaumen. Dunkel; mit Kaf (ك) vergleichen.'],
  ['Dik gövde ve içte küçük işaret; noktasız.', 'Dilin arka bölümü damağa dokunur; Kaf’a göre biraz daha öndedir. İnce çıkar.', 'Eine hohe Form mit kleinem inneren Zeichen, ohne Punkt.', 'Der hintere Zungenbereich berührt den Gaumen etwas weiter vorn als bei Qaf. Ein heller Laut.'],
  ['Uzun dik çizgi, altta kıvrılan kuyruk.', 'Dilin uç ve ön yanları üst diş etlerine dokunur. Harf adını kayıttaki gibi söyle.', 'Ein langer Strich mit unterem Bogen.', 'Zungenspitze und vordere Zungenränder berühren den oberen Zahndamm. Den Namen nachsprechen.'],
  ['Küçük yuvarlak baş ve aşağı inen kuyruk.', 'İki dudak kapanır. Türkçedeki m sesine yakındır; sesi kayıttan takip et.', 'Ein kleiner runder Kopf mit abwärts laufendem Strich.', 'Beide Lippen schließen sich; ähnlich m. Der Aufnahme folgen.'],
  ['Çanak biçimi, üstte bir nokta.', 'Dil ucu üst diş etlerine dokunur; sesin genizden gelen kısmını dinle.', 'Eine Schalenform mit einem Punkt oben.', 'Die Zungenspitze berührt den oberen Zahndamm; auf den nasalen Klang achten.'],
  ['Küçük baş ve aşağı kıvrılan kuyruk; noktasız.', 'Dudakları yuvarlayarak çıkar. Türkçedeki v ile bire bir aynı değildir; kaynak sesi örnek al.', 'Ein kleiner Kopf mit unterem Bogen, ohne Punkt.', 'Die Lippen runden. Kein deutsches w; den Laut aus der Aufnahme übernehmen.'],
  ['Halkalı gövde; kitapta iki yazılış birlikte gösterilir.', 'Boğazın derin bölümünden nefesli çıkar. Ha (ح) ve Hı (خ) ile ayrı ayrı dinle.', 'Eine Schleifenform; das Buch zeigt zwei Schreibweisen.', 'Ein behauchter Laut aus der tiefen Kehle. Mit ح und خ einzeln vergleichen.'],
  ['Lâm (ل) ile Elif’in (ا) birleşimi: لا.', 'Ayrı bir alfabe harfi değildir. Kaydın ardından “Lâmelif” adını söyle; 28 harfe ekleme.', 'Die Verbindung von Lam (ل) und Alif (ا): لا.', 'Kein eigener Alphabetbuchstabe. „Lam-Alif“ nachsprechen und nicht zu den 28 Buchstaben addieren.'],
  ['Kitaptaki Yâ biçimi ى; ي biçimini de görebilirsin.', 'Dilin orta bölgesi damağa yaklaşır. Türkçedeki y sesine yakındır. Bu kartta kitaptaki biçimi tanı.', 'Die Ya-Form der Vorlage ist ى; auch die Form ي kommt vor.', 'Die Zungenmitte nähert sich dem Gaumen; ähnlich j in „ja“. Hier die Buchform kennenlernen.'],
];
export const LETTERS = ARABIC_LETTERS.map((l, i) => ({ ...l,
  shape: { tr: details[i][0], de: details[i][2] }, sound: { tr: details[i][1], de: details[i][3] },
  kind: l.id === 28 ? 'ligature' : THICK_IDS.includes(l.id) ? 'thick' : l.id === 10 ? 'variable' : 'thin',
  lisp: LISP_IDS.includes(l.id), nonJoin: NON_JOIN_IDS.includes(l.id),
}));
export const letterById = id => LETTERS.find(l => l.id === id);
export const letterName = (l, lang) => lang === 'de' ? l.nameDe : l.nameTr;
export const KIND_LABELS = {
  thick: { tr: 'Kalın', de: 'Dunkel' }, thin: { tr: 'İnce', de: 'Hell' },
  variable: { tr: 'Yerine göre kalın / ince', de: 'Je nach Lesesituation' }, ligature: { tr: 'Harf birleşimi', de: 'Verbindung' },
};
export const SHAPE_GROUPS = [
  { ids: [1], tr: 'Elif', de: 'Alif', hint: { tr: 'Dik çizgiyi tanı; hemze de yanında gösterilir.', de: 'Den senkrechten Strich erkennen; daneben steht Hamza.' } },
  { ids: [2,3,4], tr: 'Be · Te · Se', de: 'Ba · Ta · Tha', hint: { tr: 'Aynı gövde: altta bir, üstte iki, üstte üç nokta.', de: 'Dieselbe Form: ein Punkt unten, zwei oder drei oben.' } },
  { ids: [5,6,7], tr: 'Cim · Ha · Hı', de: 'Dschim · Ha · Cha', hint: { tr: 'Nokta içeride/altta, nokta yok, nokta üstte.', de: 'Punkt innen/unten, kein Punkt, Punkt oben.' } },
  { ids: [8,9], tr: 'Dal · Zal', de: 'Dal · Dhal', hint: { tr: 'Zal’ın üstünde bir nokta var; Dal noktasız.', de: 'Dhal hat einen Punkt oben; Dal hat keinen.' } },
  { ids: [10,11], tr: 'Ra · Ze', de: 'Ra · Zay', hint: { tr: 'Ze’nin üstünde bir nokta var; Ra noktasız.', de: 'Zay hat einen Punkt oben; Ra hat keinen.' } },
  { ids: [12,13], tr: 'Sin · Şin', de: 'Sin · Schin', hint: { tr: 'Şin’in üstünde üç nokta var; Sin noktasız.', de: 'Schin hat drei Punkte oben; Sin hat keine.' } },
  { ids: [14,15], tr: 'Sad · Dad', de: 'Sad · Dad', hint: { tr: 'İkisi de kalın. Dad’ın üstünde bir nokta var.', de: 'Beide sind dunkel. Dad hat einen Punkt oben.' } },
  { ids: [16,17], tr: 'Tı · Zı', de: 'Ta · Za', hint: { tr: 'İkisi de kalın. Zı’nın üstünde bir nokta var; ayrıca peltektir.', de: 'Beide sind dunkel. Za hat einen Punkt oben und ist interdental.' } },
  { ids: [18,19], tr: 'Ayn · Gayn', de: 'Ain · Ghain', hint: { tr: 'Gayn’ın üstünde bir nokta var; Ayn noktasız.', de: 'Ghain hat einen Punkt oben; Ain hat keinen.' } },
  { ids: [20,21], tr: 'Fe · Kaf', de: 'Fa · Qaf', hint: { tr: 'Fe’de bir, Kaf’ta iki üst nokta. Alt gövdeleri de farklıdır.', de: 'Fa hat einen, Qaf zwei Punkte oben; auch die unteren Formen unterscheiden sich.' } },
  { ids: [22,23], tr: 'Kef · Lâm', de: 'Kaf · Lam', hint: { tr: 'Kef’in iç işaretine, Lâm’ın uzun ve sade çizgisine bak.', de: 'Auf das innere Zeichen bei Kaf und die einfache lange Form bei Lam achten.' } },
  { ids: [24,25,26,27,28,29], tr: 'Son sıra', de: 'Die letzte Reihe', hint: { tr: 'Mim, Nun, Vav, He, Lâmelif ve Yâ. Her birinin gövdesini ayrı tanı.', de: 'Mim, Nun, Waw, Ha, Lam-Alif und Ya. Jede Form einzeln erkennen.' } },
];
// Page 16 cell 6-F shows Sad; its old audio hotspot mistakenly links Dad. Use the printed Sad.
// Page 16, rows 1–10; each row follows the printed A→F order from right to left.
export const BOOK_ROWS = [
  [3,2,5,1,4,6], [9,8,11,7,10,12], [15,14,17,13,16,18], [21,20,23,19,22,24],
  [27,26,29,25,28,9], [10,5,4,6,16,14], [8,7,3,11,12,24], [1,2,14,21,29,13],
  [27,26,22,25,17,18], [23,19,20,10,26,28],
];
export const ACTIVITY_MODES = [
  { id: 'name', tr: 'Adından harfi bul', de: 'Name → Buchstabe', description: { tr: 'Harf adını oku, doğru şekli seç.', de: 'Den Namen lesen und die richtige Form wählen.' } },
  { id: 'recognize', tr: 'Harfin adını hatırla', de: 'Buchstabe → Name', description: { tr: 'Harf şeklini gör, adını bul.', de: 'Die Form sehen und den Namen finden.' } },
  { id: 'listen', tr: 'Dinlediğin harfi bul', de: 'Hören → Buchstabe', description: { tr: 'Kaydı dinle, duyduğun harfi seç.', de: 'Die Aufnahme hören und den Buchstaben wählen.' } },
  { id: 'similar', tr: 'Benzerleri ayırt et', de: 'Ähnliche Formen', description: { tr: 'Noktaları ve gövdeyi karşılaştır.', de: 'Punkte und Grundform vergleichen.' } },
  { id: 'groups', tr: 'Grubunu bul', de: 'Gruppen zuordnen', description: { tr: 'Kalın, ince, peltek ve birleşme bilgini dene.', de: 'Helle, dunkle, interdentale und nicht verbindende Buchstaben erkennen.' } },
  { id: 'mixed', tr: 'Karma değerlendirme', de: 'Gemischte Übung', description: { tr: 'Farklı etkinliklerden 15 soru ile kendini dene.', de: '15 Fragen aus verschiedenen Übungen.' } },
];
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
const boolOptions = [{ id: 'yes', tr: 'Evet', de: 'Ja' }, { id: 'no', tr: 'Hayır', de: 'Nein' }];
export function questionPool(mode) {
  if (mode === 'mixed') return ['name','recognize','listen','similar','groups'].flatMap(questionPool);
  if (mode === 'groups') return LETTERS.filter(l => l.id !== 28).flatMap(l => [
    { id: `kind-${l.id}`, mode, letterId: l.id, prompt: { tr: 'Bu harfin ses grubu hangisi?', de: 'Zu welcher Klanggruppe gehört dieser Buchstabe?' }, correctId: l.kind,
      options: ['thick','thin','variable'].map(id => ({ id, ...KIND_LABELS[id] })), explanation: KIND_LABELS[l.kind] },
    ...['lisp','nonJoin'].map(type => ({ id: `${type}-${l.id}`, mode, letterId: l.id,
      prompt: type === 'lisp' ? { tr: 'Bu harf peltek mi?', de: 'Ist dieser Laut interdental?' } : { tr: 'Bu harf kendisinden SONRAKİ harfle birleşmez mi?', de: 'Gehört dieser Buchstabe zu den sechs, die sich NICHT mit dem folgenden verbinden?' },
      correctId: l[type] ? 'yes' : 'no', options: boolOptions,
      explanation: type === 'lisp' ? { tr: 'Peltek harfler: ث ذ ظ.', de: 'Interdentale Laute: ث ذ ظ.' } : { tr: 'Sonraki harfle birleşmeyenler: ا د ذ ر ز و. Öncekine bağlanabilirler.', de: 'Keine Verbindung zum folgenden Buchstaben: ا د ذ ر ز و. Eine Verbindung zum vorherigen ist möglich.' },
    })),
  ]);
  return LETTERS.filter(l => mode !== 'similar' || SHAPE_GROUPS.some(g => g.ids.length > 1 && g.ids.length < 6 && g.ids.includes(l.id))).map(l => {
    const group = SHAPE_GROUPS.find(g => g.ids.includes(l.id));
    const candidates = mode === 'similar' ? group.ids.map(letterById) : LETTERS;
    const other = shuffle(candidates.filter(x => x.id !== l.id)).slice(0,3);
    return { id: `${mode}-${l.id}`, mode, letterId: l.id, correctId: String(l.id),
      options: shuffle([l,...other]).map(x => ({ id: String(x.id), letterId: x.id })),
      explanation: l.shape,
    };
  });
}
export function makeSession(mode, reviewIds) {
  const pool = questionPool(mode);
  const selected = reviewIds ? pool.filter(q => reviewIds.includes(q.id)) : pool;
  return shuffle(selected).slice(0, reviewIds ? selected.length : mode === 'mixed' ? 15 : 12);
}
