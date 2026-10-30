import { ARABIC_LETTERS } from './curriculumData.js';

const def = (id, tr, de, page, trText, deText, extra = {}) => ({ id, title: { tr, de }, page,
  explanation: { tr: trText, de: deText }, ...extra });
export const LESSONS = [
  def('harfler-01', 'İlk harfler', 'Die ersten Buchstaben', 14,
    'Be, Te, Se ve Cim harflerini dinle. Şekillerine ve noktalarına dikkat et.',
    'Höre Ba, Ta, Tha und Dschim. Achte auf Form und Punkte.', { letterIds: [2, 3, 4, 5], category: 'letters' }),
  def('harfler-02', 'Benzer harfleri ayıralım', 'Ähnliche Buchstaben unterscheiden', 14,
    'Ha, Hı, Dal ve Zal seslerini dinle. Benzer şekillerin sesleri farklı olabilir.',
    'Höre Ha, Cha, Dal und Dhal. Ähnliche Formen können unterschiedliche Laute haben.', { letterIds: [6, 7, 8, 9], category: 'letters' }),
  def('harfler-03', 'Harflerle devam', 'Weitere Buchstaben', 14,
    'Ra, Ze, Sin ve Şin harflerinin seslerini karşılaştır.',
    'Vergleiche Ra, Zay, Sin und Schin.', { letterIds: [10, 11, 12, 13], category: 'letters' }),
  def('harfler-04', 'Kalın harfler', 'Die dunklen Laute', 14,
    'Sad, Dad, Tı ve Zı seslerini kaynak kayıttan dinle ve karşılaştır.',
    'Höre und vergleiche Sad, Dad, Ta und Za mit den Originalaufnahmen.', { letterIds: [14, 15, 16, 17], category: 'letters' }),
  def('harfler-05', 'Yeni sesler', 'Neue Laute', 14,
    'Ayn, Gayn, Fe ve Kaf harflerini dinle; benzer sesleri yeniden karşılaştır.',
    'Höre Ain, Ghain, Fa und Qaf und vergleiche die Laute.', { letterIds: [18, 19, 20, 21], category: 'letters' }),
  def('harfler-06', 'Harfleri tamamlayalım', 'Das Alphabet ergänzen', 14,
    'Kef, Lam, Mim ve Nun harflerini sesleriyle tanı.',
    'Lerne Kaf, Lam, Mim und Nun mit ihren Lauten.', { letterIds: [22, 23, 24, 25], category: 'letters' }),
  def('harfler-07', 'Elif, Vav, He ve Ye', 'Alif, Waw, Ha und Ya', 14,
    'Kaynakta 28 harf ve ayrıca lâmelif birleşimi gösterilir. Lâmelif, Lam ve Elif birleşimidir.',
    'Die Vorlage zeigt 28 Buchstaben und zusätzlich Lam-Alif, die Verbindung aus Lam und Alif.', { letterIds: [1, 26, 27, 29], category: 'letters' }),
  def('sekiller-01', 'Harflerin birleşen biçimleri', 'Verbundene Buchstaben', 17,
    'Be, Te, Cim ve Sin harfleri kelime içinde farklı biçimlerde görünür. Yalın harfin eşini bul.',
    'Ba, Ta, Dschim und Sin verändern im Wort ihre Form. Finde die passende Form.', { category: 'shapes' }),
  def('ustun-01', 'Üstün: ilk dört ses', 'Fetha: die ersten vier Laute', 18,
    'Üstün, harfin üstündeki eğik çizgidir. Be, Te, Se ve Cim harflerinin üstünlü seslerini dinle ve ayırt et.',
    'Fetha ist ein schräger Strich über dem Buchstaben. Höre und unterscheide Ba, Ta, Tha und Dschim mit Fetha.',
    { files: ['arp02_1.mp3','arp03_1.mp3','arp04_1.mp3','arp05_1.mp3'], chars: ['بَ','تَ','ثَ','جَ'], category: 'vowels' }),
  def('esre-01', 'Esre: alttaki işaret', 'Kesra: das Zeichen darunter', 20,
    'Esre, harfin altındaki eğik çizgidir. Aynı dört harfi bu kez esre ile dinle.',
    'Kesra ist ein schräger Strich unter dem Buchstaben. Höre die vier Buchstaben jetzt mit Kesra.',
    { files: ['arp02_3.mp3','arp03_3.mp3','arp04_3.mp3','arp05_3.mp3'], chars: ['بِ','تِ','ثِ','جِ'], category: 'vowels' }),
  def('otre-01', 'Ötre: küçük vav', 'Damme: das kleine Waw', 22,
    'Ötre, harfin üstündeki küçük vav biçimindeki işarettir. Kaynak sesleri dikkatle dinle.',
    'Damme ist ein kleines Waw über dem Buchstaben. Höre die Originalaufnahmen aufmerksam.',
    { files: ['arp02_5.mp3','arp03_5.mp3','arp04_5.mp3','arp05_5.mp3'], chars: ['بُ','تُ','ثُ','جُ'], category: 'vowels' }),
  def('med-01', 'Med: harekesiz elif', 'Medd: das Dehnungs-Alif', 24,
    'Harekesiz elif, önceki üstünlü harfin sesini uzatır. Kaynaktaki dört kelimeyi dinle ve görseliyle eşleştir.',
    'Das Dehnungs-Alif verlängert den vorausgehenden Fetha-Laut. Ordne die vier Wörter ihren Aufnahmen zu.', { sampleCount: 4, category: 'reading' }),
  def('med-02', 'Med: harekesiz ye', 'Medd: das Dehnungs-Ya', 25,
    'Harekesiz ye, önceki esreli sesi uzatır. Kaynaktaki örnekleri dinleyerek takip et.',
    'Das Dehnungs-Ya verlängert den vorausgehenden Kesra-Laut. Folge den Beispielen der Vorlage.', { sampleCount: 4, category: 'reading' }),
  def('med-03', 'Med: harekesiz vav', 'Medd: das Dehnungs-Waw', 26,
    'Harekesiz vav, önceki ötreli sesi uzatır. Kelimeleri kayıttaki okunuşlarıyla eşleştir.',
    'Das Dehnungs-Waw verlängert den vorausgehenden Damme-Laut. Ordne die Wörter ihren Aufnahmen zu.', { sampleCount: 4, category: 'reading' }),
  def('cezim-01', 'Cezim: sesleri birleştir', 'Dschezm: Laute verbinden', 28,
    'Cezimli harf önceki harfe bağlanır. Her kaynak kartında üç okunuş birlikte bulunur; kaydın tamamını dinle.',
    'Dschezm verbindet den Buchstaben mit dem vorherigen. Jede Karte enthält drei Lesebeispiele; höre die ganze Aufnahme.', { sampleCount: 4, category: 'reading' }),
  def('sedde-01', 'Şedde: çift okuma', 'Schedde: Verdoppelung', 30,
    'Şedde, üzerinde bulunduğu harfi çift okutur. Her karttaki okunuş grubunu kaynaktan takip et.',
    'Schedde verdoppelt den Buchstaben. Folge jeweils der ganzen Beispielgruppe.', { sampleCount: 4, category: 'reading' }),
  def('tenvin-01', 'Tenvin: iki üstün', 'Tenwin: Doppel-Fetha', 32,
    'İki üstün, kelimenin sonuna n sesi katar. Kartlardaki kelimeleri kaynak kaydıyla dinle.',
    'Doppel-Fetha fügt am Wortende einen n-Laut hinzu. Höre die Wörter mit den Originalaufnahmen.', { sampleCount: 4, category: 'reading' }),
  def('tenvin-02', 'Tenvin: iki esre', 'Tenwin: Doppel-Kesra', 33,
    'İki esreyi kelimelerin altında bul. Örnekleri dinle ve aynı kelimeyi seç.',
    'Finde Doppel-Kesra unter den Buchstaben. Höre und wähle das passende Wort.', { sampleCount: 4, category: 'reading' }),
  def('tenvin-03', 'Tenvin: iki ötre', 'Tenwin: Doppel-Damme', 34,
    'İki ötreyi kelimelerin üstünde bul. Örneklerin sonundaki sesi dinle.',
    'Finde Doppel-Damme über den Buchstaben und höre auf den letzten Laut.', { sampleCount: 4, category: 'reading' }),
  def('yuvarlak-te-01', 'Yuvarlak te', 'Das runde Te', 34,
    'Yuvarlak te, durulduğunda he gibi; okumaya devam edildiğinde te gibi okunur. Kaynağın alt bölümündeki örnekleri dinle.',
    'Das runde Te wird beim Anhalten wie Ha und beim Weiterlesen wie Ta gelesen. Höre die Beispiele im unteren Teil der Vorlage.',
    { files: ['arp31_5.mp3','arp32_5.mp3','arp33_5.mp3','arp34_5.mp3'], category: 'rules' }),
  def('ceker-01', 'Uzatma ve çeker işareti', 'Das Dehnungszeichen', 35,
    'Harfin üstündeki veya altındaki çeker işareti, harekeyi uzatarak okutur. Kaynaktaki örnekleri dinleyerek karşılaştır.',
    'Das Dehnungszeichen über oder unter dem Buchstaben verlängert den Vokal. Vergleiche die Beispiele der Vorlage.', { sampleCount: 4, category: 'rules' }),
  def('uzatan-harfler-01', 'Elif yerine geçen harfler', 'Buchstaben anstelle des Dehnungs-Alif', 36,
    'Bazı kelimelerde harekesiz vav ve ye, uzatan elif görevini yapar. Kelimelerin kaynakta gösterilen yazılışını takip et.',
    'In manchen Wörtern übernehmen Waw und Ya die Funktion des Dehnungs-Alif. Folge der Schreibweise und den Originalaufnahmen.', { sampleCount: 4, category: 'rules' }),
  def('hemze-01', 'Hemzeyi tanıyalım', 'Das Hemze kennenlernen', 37,
    'Hemze tek başına veya elif, vav ve ye üzerinde yazılabilir. Kelimelerdeki hemzeyi bul ve kaydı dinle.',
    'Hemze kann allein oder auf Alif, Waw und Ya stehen. Finde es in den Wörtern und höre die Aufnahmen.', { sampleCount: 4, category: 'rules' }),
  def('uzun-he-01', 'Kelime sonundaki he', 'He am Wortende', 38,
    'Kelime sonundaki zamir he, önceki harfin durumuna göre uzatılır veya kısa okunur. Kuralı 38. sayfada, dinleme örneklerini 39. sayfada bulabilirsin.',
    'Das Pronomen-He am Wortende wird je nach vorherigem Buchstaben verlängert oder kurz gelesen. Die Regel steht auf Seite 38, die Hörbeispiele auf Seite 39.', { samplePage: 39, sampleCount: 4, category: 'rules' }),
  def('med-isareti-01', 'Med işaretini takip et', 'Dem Medd-Zeichen folgen', 40,
    'Kaynak kitap, med işaretini dört elif miktarı uzatma ile açıklar. İşaretli kelimelerin okunuşunu kayıttan takip et.',
    'Das Originalbuch erklärt dieses Medd-Zeichen als Verlängerung um vier Alif-Längen. Folge den markierten Wörtern in der Aufnahme.', { sampleCount: 4, category: 'rules' }),
  def('lafzatullah-01', 'Allah kelimesinin okunuşu', 'Die Aussprache des Wortes Allah', 41,
    'Allah kelimesinden önceki hareke üstün veya ötre ise lam kalın, esre ise ince okunur. Kaydın tamamını dinleyerek örnekleri karşılaştır.',
    'Nach Fetha oder Damme wird das Lam im Wort Allah dunkel, nach Kesra hell ausgesprochen. Vergleiche die vollständigen Aufnahmen.', { sampleCount: 4, category: 'rules' }),
  def('mukattaa-01', 'Tek tek okunan harfler', 'Einzeln gelesene Buchstaben', 42,
    'Hurûf-u mukattaa, bitişik yazılsa da tek tek okunur. Her karttaki harf grubunu kaynak kaydıyla birlikte takip et.',
    'Die Mukattaa-Buchstaben werden einzeln gelesen, auch wenn sie verbunden geschrieben sind. Folge jeder Buchstabengruppe mit der Aufnahme.', { sampleCount: 4, category: 'rules' }),
  def('elif-lam-01', 'Elif-lam takısı', 'Der Artikel El', 43,
    'Elif-lam takısının okunuşu, önceki ve sonraki harflere göre değişir. Kaynaktaki açıklamayı oku; örneklerin bütününü dinle ve eşleştir.',
    'Die Lesung des Artikels El hängt von den benachbarten Buchstaben ab. Lies die Erklärung im Buch und ordne die vollständigen Beispiele zu.', { sampleCount: 4, category: 'rules' }),
];
export const SHAPES = [
  { id: 'shape-be', char: 'ب', form: 'بـ ـبـ ـب', letterId: 2 },
  { id: 'shape-te', char: 'ت', form: 'تـ ـتـ ـت', letterId: 3 },
  { id: 'shape-cim', char: 'ج', form: 'جـ ـجـ ـج', letterId: 5 },
  { id: 'shape-sin', char: 'س', form: 'سـ ـسـ ـس', letterId: 12 },
];
export function orderedAudio(page) {
  const spots = page?.hotspots?.filter(h => h.type === 'audio' && h.audio_path?.includes('/arabic/')) || [];
  // Cluster rows within 1% of page height, then follow the source right to left.
  const rows = [];
  for (const h of [...spots].sort((a,b) => a.bounds.y-b.bounds.y)) {
    let row = rows.find(r => Math.abs(r.y-h.bounds.y) < 0.012);
    if (!row) { row = { y: h.bounds.y, items: [] }; rows.push(row); }
    row.items.push(h);
  }
  return rows.flatMap(r => r.items.sort((a,b) => b.bounds.x-a.bounds.x));
}
export function lessonContent(lesson, pages) {
  if (lesson.letterIds) return lesson.letterIds.map(id => {
    const l = ARABIC_LETTERS.find(x => x.id === id);
    return { id: `letter-${id}`, char: l.char, label: { tr: l.nameTr, de: l.nameDe }, audio: l.audio, page: 14 };
  });
  if (lesson.category === 'shapes') return SHAPES.map(s => ({ ...s, audio: ARABIC_LETTERS.find(l => l.id === s.letterId).audio, page: 17 }));
  const sourcePage = lesson.samplePage || lesson.page;
  const page = pages.find(p => p.page_number === sourcePage);
  const all = orderedAudio(page);
  const spots = lesson.files ? lesson.files.map(f => all.find(h => h.audio_file === f)) : all.slice(0,lesson.sampleCount);
  return spots.filter(Boolean).map((s,i) => {
    const letter = lesson.chars?.[i] && ARABIC_LETTERS.find(l=>l.char===lesson.chars[i].replace(/[\u064b-\u065f]/g,''));
    return { id: `page-${sourcePage}-${s.id}`, char: lesson.chars?.[i], audio: s.audio_path,
      page: sourcePage, bounds: s.bounds, label: letter ? { tr: letter.nameTr, de: letter.nameDe } : { tr: `Örnek ${i+1}`, de: `Beispiel ${i+1}` } };
  });
}
export function shuffle(items) {
  const a = [...items];
  for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
export function makeQuestions(items, count = 5) {
  if (items.length < 2) return [];
  const targets = shuffle(items);
  return Array.from({ length: count }, (_,i) => {
    const correct = targets[i % targets.length];
    return { id: `q-${i}-${correct.id}`, correctId: correct.id, target: correct,
      options: shuffle([correct, ...shuffle(items.filter(s => s.id!==correct.id)).slice(0,3)]) };
  });
}

export const BASIC_TOPICS=[
  {tr:'İslam’ın şartları',de:'Die fünf Säulen des Islam',count:5,file:'islam.mp3',fileDe:'islamde.mp3',page:68,pageDe:69},
  {tr:'İmanın şartları',de:'Die sechs Glaubensartikel',count:6,file:'iman.mp3',fileDe:'imande.mp3',page:68,pageDe:69},
  {tr:'Abdestin farzları',de:'Die Pflichten der Gebetswaschung',count:4,file:'abdest.mp3',fileDe:'abdestde.mp3',page:68,pageDe:69},
  {tr:'Guslün farzları',de:'Die Pflichten der Ganzkörperwaschung',count:3,file:'gusul.mp3',fileDe:'gusulde.mp3',page:68,pageDe:69},
  {tr:'Teyemmümün farzları',de:'Die Pflichten der Ersatzwaschung',count:2,file:'teyemmum.mp3',fileDe:'teyemmumde.mp3',page:68,pageDe:69},
  {tr:'Namazdan önceki farzlar',de:'Voraussetzungen vor dem Ritualgebet',count:6,file:'namaz1.mp3',fileDe:'namaz1de.mp3',page:70,pageDe:71},
  {tr:'Namazın içindeki farzlar',de:'Die inneren Pflichten des Ritualgebets',count:6,file:'namaz2.mp3',fileDe:'namaz2de.mp3',page:70,pageDe:71},
];
