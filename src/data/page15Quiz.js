/**
 * Sayfa 15 - 10 Soruluk Kahoot Tarzı İnteraktif Harf Testi Veri Seti
 * Müfredat:
 * - 28 Harf + Lamelif (لا) durumu
 * - 7 Kalın harf (خ, ص, ض, ط, ظ, غ, ق)
 * - Özel harf "Ra" (ر) harekeye göre kalın/ince
 * - 3 Peltek harf (ث, ذ, ظ)
 * - Kendinden sonra birleşmeyen 6 harf (ا, د, ذ, ر, ز, و)
 */

export const QUIZ_15_QUESTIONS = [
  {
    id: 1,
    questionTr: "Kur'an-ı Kerîm alfabesinde toplam kaç harf vardır?",
    questionDe: "Wie viele Buchstaben hat das Alphabet des edlen Koran insgesamt?",
    ruleHintTr: "Sayfa 15: Kur'an-ı Kerîm alfabesi 28 harften oluşmaktadır.",
    ruleHintDe: "Seite 15: Das Koran-Alphabet besteht aus 28 Buchstaben.",
    options: [
      { id: 'A', textTr: '26 Harf', textDe: '26 Buchstaben', color: 'red', shape: '▲' },
      { id: 'B', textTr: '28 Harf', textDe: '28 Buchstaben', color: 'blue', shape: '◆', correct: true },
      { id: 'C', textTr: '29 Harf', textDe: '29 Buchstaben', color: 'yellow', shape: '●' },
      { id: 'D', textTr: '30 Harf', textDe: '30 Buchstaben', color: 'green', shape: '■' }
    ]
  },
  {
    id: 2,
    questionTr: "Lamelif (لا) tek başına bağımsız bir harf midir?",
    questionDe: "Ist das Lam-Alif (لا) ein eigenständiger Buchstabe?",
    ruleHintTr: "لا kendi başına bir harf olmayıp ل ve ا harflerinin birleştirilmesinden oluşur.",
    ruleHintDe: "Das لا ist kein eigenständiger Buchstabe, sondern aus ل und ا zusammengesetzt.",
    options: [
      { id: 'A', textTr: 'Hayır, Lam (ل) ve Elif (ا) birleşimidir', textDe: 'Nein, aus Lam (ل) und Alif (ا) zusammengesetzt', color: 'red', shape: '▲', correct: true },
      { id: 'B', textTr: 'Evet, alfabenin 29. harfidir', textDe: 'Ja, es ist der 29. Buchstabe', color: 'blue', shape: '◆' },
      { id: 'C', textTr: 'Evet, noktalı bir harftir', textDe: 'Ja, ein Buchstabe mit Punkten', color: 'yellow', shape: '●' },
      { id: 'D', textTr: 'Hayır, bir hareke işaretidir', textDe: 'Nein, ein Vokalzeichen', color: 'green', shape: '■' }
    ]
  },
  {
    id: 3,
    questionTr: "Kur'an alfabesinde kaç tane KALIN okunan harf vardır?",
    questionDe: "Wie viele DUNKLE (dicke) Buchstaben gibt es im Koran-Alphabet?",
    ruleHintTr: "28 harften kırmızı renkte olan 7 tanesi kalındır: خ, ص, ض, ط, ظ, غ, ق.",
    ruleHintDe: "7 von ihnen (in Rot) haben eine dunkle oder dumpfe Aussprache.",
    options: [
      { id: 'A', textTr: '5 Tane', textDe: '5 Buchstaben', color: 'red', shape: '▲' },
      { id: 'B', textTr: '7 Tane', textDe: '7 Buchstaben', color: 'blue', shape: '◆', correct: true },
      { id: 'C', textTr: '9 Tane', textDe: '9 Buchstaben', color: 'yellow', shape: '●' },
      { id: 'D', textTr: '11 Tane', textDe: '11 Buchstaben', color: 'green', shape: '■' }
    ]
  },
  {
    id: 4,
    questionTr: "Aşağıdaki harflerden hangisi KALIN okunan 7 harften biridir?",
    questionDe: "Welcher Buchstabe gehört zu den 7 DUNKELN (dicken) Buchstaben?",
    ruleHintTr: "Kalın harfler: خ, ص, ض, ط, ظ, غ, ق. 'Sad' (ص) bu gruptadır.",
    ruleHintDe: "Dunkle Buchstaben: خ, ص, ض, ط, ظ, غ, ق. 'Sad' (ص) gehört dazu.",
    options: [
      { id: 'A', char: 'ب', textTr: 'Be (ب)', textDe: 'Ba (ب)', color: 'red', shape: '▲' },
      { id: 'B', char: 'ت', textTr: 'Te (ت)', textDe: 'Ta (ت)', color: 'blue', shape: '◆' },
      { id: 'C', char: 'ص', textTr: 'Sad (ص)', textDe: 'Sad (ص)', color: 'yellow', shape: '●', correct: true },
      { id: 'D', char: 'د', textTr: 'Dal (د)', textDe: 'Dal (د)', color: 'green', shape: '■' }
    ]
  },
  {
    id: 5,
    questionTr: "Aşağıdaki harflerden hangisi İNCE okunan bir harftir?",
    questionDe: "Welcher dieser Buchstaben wird HELL (dünn) ausgesprochen?",
    ruleHintTr: "Tı (ط), Kaf (ق) ve Hı (خ) kalındır; Cim (ج) ise ince okunan bir harftir.",
    ruleHintDe: "Ta (ط), Qaf (ق) und Cha (خ) sind dunkel; Dschim (ج) ist hell.",
    options: [
      { id: 'A', char: 'ط', textTr: 'Tı (ط)', textDe: 'Ta (ط)', color: 'red', shape: '▲' },
      { id: 'B', char: 'ق', textTr: 'Kaf (ق)', textDe: 'Qaf (ق)', color: 'blue', shape: '◆' },
      { id: 'C', char: 'خ', textTr: 'Hı (خ)', textDe: 'Cha (خ)', color: 'yellow', shape: '●' },
      { id: 'D', char: 'ج', textTr: 'Cim (ج)', textDe: 'Dschim (ج)', color: 'green', shape: '■', correct: true }
    ]
  },
  {
    id: 6,
    questionTr: "Özel harf 'Ra' (ر) nasıl okunur?",
    questionDe: "Wie wird der besondere Buchstabe „Ra” (ر) ausgesprochen?",
    ruleHintTr: "Yeşil renkte olan 'Ra' (ر) harfi, aldığı harekeye göre kalın ya da ince sesle okunur.",
    ruleHintDe: "Das „Ra” (ر) wird je nach Vokalisation dunkel oder hell ausgesprochen.",
    options: [
      { id: 'A', textTr: 'Her zaman kalın sesle okunur', textDe: 'Immer dunkel ausgesprochen', color: 'red', shape: '▲' },
      { id: 'B', textTr: 'Her zaman ince sesle okunur', textDe: 'Immer hell ausgesprochen', color: 'blue', shape: '◆' },
      { id: 'C', textTr: 'Aldığı harekeye göre kalın veya ince okunur', textDe: 'Je nach Vokalisation dunkel oder hell', color: 'yellow', shape: '●', correct: true },
      { id: 'D', textTr: 'Sadece kelime başında okunur', textDe: 'Nur am Wortanfang ausgesprochen', color: 'green', shape: '■' }
    ]
  },
  {
    id: 7,
    questionTr: "Kur'an alfabesinde kaç tane PELTEK harf vardır?",
    questionDe: "Wie viele LISPELLAUTE gibt es im Koran-Alphabet?",
    ruleHintTr: "Kur'an alfabesinde üç tane peltek harf vardır: ث - ذ - ظ.",
    ruleHintDe: "Im Koran gibt es 3 Lispellaute: ث, ذ und ظ.",
    options: [
      { id: 'A', textTr: '2 Tane', textDe: '2 Lispellaute', color: 'red', shape: '▲' },
      { id: 'B', textTr: '3 Tane (ث - ذ - ظ)', textDe: '3 Lispellaute (ث - ذ - ظ)', color: 'blue', shape: '◆', correct: true },
      { id: 'C', textTr: '4 Tane', textDe: '4 Lispellaute', color: 'yellow', shape: '●' },
      { id: 'D', textTr: '5 Tane', textDe: '5 Lispellaute', color: 'green', shape: '■' }
    ]
  },
  {
    id: 8,
    questionTr: "Aşağıdakilerden hangisi PELTEK okunan 3 harften biridir?",
    questionDe: "Welcher Buchstabe gehört zu den 3 Lispellauten?",
    ruleHintTr: "Dil ön dişlerin arasına hafifçe çıkar: ث (Se), ذ (Zel), ظ (Zı).",
    ruleHintDe: "Die Zungenspitze tritt zwischen die Zähne: ث, ذ, ظ.",
    options: [
      { id: 'A', char: 'ث', textTr: 'Se (ث - Peltek)', textDe: 'Tha (ث - Lispellaut)', color: 'red', shape: '▲', correct: true },
      { id: 'B', char: 'س', textTr: 'Sin (س - Keskin)', textDe: 'Sin (س - scharf)', color: 'blue', shape: '◆' },
      { id: 'C', char: 'ز', textTr: 'Ze (ز - Keskin)', textDe: 'Zay (ز - scharf)', color: 'yellow', shape: '●' },
      { id: 'D', char: 'ص', textTr: 'Sad (ص - Islıklı)', textDe: 'Sad (ص)', color: 'green', shape: '■' }
    ]
  },
  {
    id: 9,
    questionTr: "Kendinden sonraki harfle BİRLEŞMEYEN kaç harf vardır?",
    questionDe: "Wie viele Buchstaben verbinden sich NICHT nach links (folgend)?",
    ruleHintTr: "Kendinden sonra gelen harflerle birleşmeyen 6 harf vardır: ا - د - ذ - ر - ز - و.",
    ruleHintDe: "6 Buchstaben verbinden sich nicht mit den folgenden: ا, د, ذ, ر, ز, و.",
    options: [
      { id: 'A', textTr: '4 Harf', textDe: '4 Buchstaben', color: 'red', shape: '▲' },
      { id: 'B', textTr: '5 Harf', textDe: '5 Buchstaben', color: 'blue', shape: '◆' },
      { id: 'C', textTr: '6 Harf', textDe: '6 Buchstaben', color: 'yellow', shape: '●', correct: true },
      { id: 'D', textTr: '7 Harf', textDe: '7 Buchstaben', color: 'green', shape: '■' }
    ]
  },
  {
    id: 10,
    questionTr: "Aşağıdakilerden hangisi kendinden sonra gelen harfle BİRLEŞMEZ?",
    questionDe: "Welcher dieser Buchstaben verbindet sich NICHT mit dem folgenden?",
    ruleHintTr: "ا, د, ذ, ر, ز, و harfleri arkasına el vermez. 'Dal' (د) bunlardan biridir.",
    ruleHintDe: "ا, د, ذ, ر, ز, و verbinden sich nicht nach links. 'Dal' (د) gehört dazu.",
    options: [
      { id: 'A', char: 'ب', textTr: 'Be (ب - Birleşir)', textDe: 'Ba (ب - verbindet sich)', color: 'red', shape: '▲' },
      { id: 'B', char: 'د', textTr: 'Dal (د - Birleşmez)', textDe: 'Dal (د - verbindet nicht)', color: 'blue', shape: '◆', correct: true },
      { id: 'C', char: 'ك', textTr: 'Kef (ك - Birleşir)', textDe: 'Kaf (ك - verbindet sich)', color: 'yellow', shape: '●' },
      { id: 'D', char: 'م', textTr: 'Mim (م - Birleşir)', textDe: 'Mim (م - verbindet sich)', color: 'green', shape: '■' }
    ]
  }
];
