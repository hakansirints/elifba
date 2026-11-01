import { ARABIC_LETTERS } from './curriculumData.js';
import { shuffle } from './alphabetData.js';

export const LETTER_POSITIONS = [
  { id: 1, letterId: 1, nameTr: 'Elif', nameDe: 'Alif', audio: 'assets/audio/arabic/arp01.mp3', isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا', nonJoin: true },
  { id: 2, letterId: 2, nameTr: 'Bâ', nameDe: 'Ba', audio: 'assets/audio/arabic/arp02.mp3', isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب', nonJoin: false },
  { id: 3, letterId: 3, nameTr: 'Tâ', nameDe: 'Ta', audio: 'assets/audio/arabic/arp03.mp3', isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت', nonJoin: false },
  { id: 4, letterId: 4, nameTr: 'Sâ', nameDe: 'Tha', audio: 'assets/audio/arabic/arp04.mp3', isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث', nonJoin: false },
  { id: 5, letterId: 5, nameTr: 'Cîm', nameDe: 'Dschim', audio: 'assets/audio/arabic/arp05.mp3', isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج', nonJoin: false },
  { id: 6, letterId: 6, nameTr: 'Hâ', nameDe: 'Ha', audio: 'assets/audio/arabic/arp06.mp3', isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح', nonJoin: false },
  { id: 7, letterId: 7, nameTr: 'Hı', nameDe: 'Cha', audio: 'assets/audio/arabic/arp07.mp3', isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ', nonJoin: false },
  { id: 8, letterId: 8, nameTr: 'Dâl', nameDe: 'Dal', audio: 'assets/audio/arabic/arp08.mp3', isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد', nonJoin: true },
  { id: 9, letterId: 9, nameTr: 'Zâl', nameDe: 'Dhal', audio: 'assets/audio/arabic/arp09.mp3', isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ', nonJoin: true },
  { id: 10, letterId: 10, nameTr: 'Râ', nameDe: 'Ra', audio: 'assets/audio/arabic/arp10.mp3', isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر', nonJoin: true },
  { id: 11, letterId: 11, nameTr: 'Zê', nameDe: 'Zay', audio: 'assets/audio/arabic/arp11.mp3', isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز', nonJoin: true },
  { id: 12, letterId: 12, nameTr: 'Sîn', nameDe: 'Sin', audio: 'assets/audio/arabic/arp12.mp3', isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس', nonJoin: false },
  { id: 13, letterId: 13, nameTr: 'Şîn', nameDe: 'Schin', audio: 'assets/audio/arabic/arp13.mp3', isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش', nonJoin: false },
  { id: 14, letterId: 14, nameTr: 'Sâd', nameDe: 'Sad', audio: 'assets/audio/arabic/arp14.mp3', isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص', nonJoin: false },
  { id: 15, letterId: 15, nameTr: 'Dâd', nameDe: 'Dad', audio: 'assets/audio/arabic/arp15.mp3', isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض', nonJoin: false },
  { id: 16, letterId: 16, nameTr: 'Tı', nameDe: 'Ta', audio: 'assets/audio/arabic/arp16.mp3', isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط', nonJoin: false },
  { id: 17, letterId: 17, nameTr: 'Zı', nameDe: 'Za', audio: 'assets/audio/arabic/arp17.mp3', isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ', nonJoin: false },
  { id: 18, letterId: 18, nameTr: 'Ayn', nameDe: 'Ain', audio: 'assets/audio/arabic/arp18.mp3', isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع', nonJoin: false },
  { id: 19, letterId: 19, nameTr: 'Gayn', nameDe: 'Ghain', audio: 'assets/audio/arabic/arp19.mp3', isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ', nonJoin: false },
  { id: 20, letterId: 20, nameTr: 'Fê', nameDe: 'Fa', audio: 'assets/audio/arabic/arp20.mp3', isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف', nonJoin: false },
  { id: 21, letterId: 21, nameTr: 'Kâf', nameDe: 'Qaf', audio: 'assets/audio/arabic/arp21.mp3', isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق', nonJoin: false },
  { id: 22, letterId: 22, nameTr: 'Kef', nameDe: 'Kaf', audio: 'assets/audio/arabic/arp22.mp3', isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك', nonJoin: false },
  { id: 23, letterId: 23, nameTr: 'Lâm', nameDe: 'Lam', audio: 'assets/audio/arabic/arp23.mp3', isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل', nonJoin: false },
  { id: 24, letterId: 24, nameTr: 'Mîm', nameDe: 'Mim', audio: 'assets/audio/arabic/arp24.mp3', isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم', nonJoin: false },
  { id: 25, letterId: 25, nameTr: 'Nûn', nameDe: 'Nun', audio: 'assets/audio/arabic/arp25.mp3', isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن', nonJoin: false },
  { id: 26, letterId: 26, nameTr: 'Vâv', nameDe: 'Waw', audio: 'assets/audio/arabic/arp26.mp3', isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو', nonJoin: true },
  { id: 27, letterId: 27, nameTr: 'Hê', nameDe: 'Ha', audio: 'assets/audio/arabic/arp27.mp3', isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه', nonJoin: false },
  { id: 28, letterId: 29, nameTr: 'Yâ', nameDe: 'Ya', audio: 'assets/audio/arabic/arp29.mp3', isolated: 'ى', initial: 'يـ', medial: 'ـيـ', final: 'ـى', nonJoin: false },
];

export const POSITION_WORDS = [
  {
    id: 'ktb',
    word: 'كَتَبَ',
    reading: 'Ketabe',
    meaningTr: 'Yazdı',
    meaningDe: 'Er schrieb',
    letters: [
      { pos: 'initial', form: 'كـ', letterId: 22, nameTr: 'Kef', nameDe: 'Kaf' },
      { pos: 'medial', form: 'ـتـ', letterId: 3, nameTr: 'Tâ', nameDe: 'Ta' },
      { pos: 'final', form: 'ـب', letterId: 2, nameTr: 'Bâ', nameDe: 'Ba' },
    ],
  },
  {
    id: 'jls',
    word: 'جَلَسَ',
    reading: 'Celese',
    meaningTr: 'Oturdu',
    meaningDe: 'Er saß',
    letters: [
      { pos: 'initial', form: 'جـ', letterId: 5, nameTr: 'Cîm', nameDe: 'Dschim' },
      { pos: 'medial', form: 'ـلـ', letterId: 23, nameTr: 'Lâm', nameDe: 'Lam' },
      { pos: 'final', form: 'ـس', letterId: 12, nameTr: 'Sîn', nameDe: 'Sin' },
    ],
  },
  {
    id: 'sjd',
    word: 'سَجَدَ',
    reading: 'Secede',
    meaningTr: 'Secde etti',
    meaningDe: 'Er warf sich nieder',
    letters: [
      { pos: 'initial', form: 'سـ', letterId: 12, nameTr: 'Sîn', nameDe: 'Sin' },
      { pos: 'medial', form: 'ـجـ', letterId: 5, nameTr: 'Cîm', nameDe: 'Dschim' },
      { pos: 'final', form: 'ـد', letterId: 8, nameTr: 'Dâl', nameDe: 'Dal' },
    ],
  },
  {
    id: 'hmd',
    word: 'حَمَدَ',
    reading: 'Hamede',
    meaningTr: 'Övdü / Şükretti',
    meaningDe: 'Er lobpreiste',
    letters: [
      { pos: 'initial', form: 'حـ', letterId: 6, nameTr: 'Hâ', nameDe: 'Ha' },
      { pos: 'medial', form: 'ـمـ', letterId: 24, nameTr: 'Mîm', nameDe: 'Mim' },
      { pos: 'final', form: 'ـد', letterId: 8, nameTr: 'Dâl', nameDe: 'Dal' },
    ],
  },
  {
    id: 'nzr',
    word: 'نَظَرَ',
    reading: 'Nazara',
    meaningTr: 'Baktı',
    meaningDe: 'Er schaute',
    letters: [
      { pos: 'initial', form: 'نـ', letterId: 25, nameTr: 'Nûn', nameDe: 'Nun' },
      { pos: 'medial', form: 'ـظـ', letterId: 17, nameTr: 'Zı', nameDe: 'Za' },
      { pos: 'final', form: 'ـر', letterId: 10, nameTr: 'Râ', nameDe: 'Ra' },
    ],
  },
  {
    id: 'xlq',
    word: 'خَلَقَ',
    reading: 'Halaka',
    meaningTr: 'Yarattı',
    meaningDe: 'Er erschuf',
    letters: [
      { pos: 'initial', form: 'خـ', letterId: 7, nameTr: 'Hı', nameDe: 'Cha' },
      { pos: 'medial', form: 'ـلـ', letterId: 23, nameTr: 'Lâm', nameDe: 'Lam' },
      { pos: 'final', form: 'ـق', letterId: 21, nameTr: 'Kâf', nameDe: 'Qaf' },
    ],
  },
  {
    id: 'dxl',
    word: 'دَخَلَ',
    reading: 'Dehale',
    meaningTr: 'Girdi',
    meaningDe: 'Er trat ein',
    letters: [
      { pos: 'initial', form: 'د', letterId: 8, nameTr: 'Dâl', nameDe: 'Dal' },
      { pos: 'medial', form: 'خـ', letterId: 7, nameTr: 'Hı', nameDe: 'Cha' },
      { pos: 'final', form: 'ـل', letterId: 23, nameTr: 'Lâm', nameDe: 'Lam' },
    ],
  },
  {
    id: 'tlb',
    word: 'طَلَبَ',
    reading: 'Talebe',
    meaningTr: 'İstedi / Talep etti',
    meaningDe: 'Er verlangte',
    letters: [
      { pos: 'initial', form: 'طـ', letterId: 16, nameTr: 'Tı', nameDe: 'Ta' },
      { pos: 'medial', form: 'ـلـ', letterId: 23, nameTr: 'Lâm', nameDe: 'Lam' },
      { pos: 'final', form: 'ـب', letterId: 2, nameTr: 'Bâ', nameDe: 'Ba' },
    ],
  },
  {
    id: 'gfr',
    word: 'غَفَرَ',
    reading: 'Gafara',
    meaningTr: 'Bağışladı',
    meaningDe: 'Er vergab',
    letters: [
      { pos: 'initial', form: 'غـ', letterId: 19, nameTr: 'Gayn', nameDe: 'Ghain' },
      { pos: 'medial', form: 'ـفـ', letterId: 20, nameTr: 'Fê', nameDe: 'Fa' },
      { pos: 'final', form: 'ـر', letterId: 10, nameTr: 'Râ', nameDe: 'Ra' },
    ],
  },
  {
    id: 'sbr',
    word: 'صَبَرَ',
    reading: 'Sabara',
    meaningTr: 'Sabretti',
    meaningDe: 'Er hatte Geduld',
    letters: [
      { pos: 'initial', form: 'صـ', letterId: 14, nameTr: 'Sâd', nameDe: 'Sad' },
      { pos: 'medial', form: 'ـبـ', letterId: 2, nameTr: 'Bâ', nameDe: 'Ba' },
      { pos: 'final', form: 'ـر', letterId: 10, nameTr: 'Râ', nameDe: 'Ra' },
    ],
  },
  {
    id: 'rzq',
    word: 'رَزَقَ',
    reading: 'Razaka',
    meaningTr: 'Rızık verdi',
    meaningDe: 'Er versorgte',
    letters: [
      { pos: 'initial', form: 'ر', letterId: 10, nameTr: 'Râ', nameDe: 'Ra' },
      { pos: 'medial', form: 'ز', letterId: 11, nameTr: 'Zê', nameDe: 'Zay' },
      { pos: 'final', form: 'ـق', letterId: 21, nameTr: 'Kâf', nameDe: 'Qaf' },
    ],
  },
  {
    id: 'zkr',
    word: 'ذَكَرَ',
    reading: 'Zekere',
    meaningTr: 'Andı / Hatırladı',
    meaningDe: 'Er gedachte',
    letters: [
      { pos: 'initial', form: 'ذ', letterId: 9, nameTr: 'Zâl', nameDe: 'Dhal' },
      { pos: 'medial', form: 'كـ', letterId: 22, nameTr: 'Kef', nameDe: 'Kaf' },
      { pos: 'final', form: 'ـر', letterId: 10, nameTr: 'Râ', nameDe: 'Ra' },
    ],
  },
];

export const POSITION_META = {
  initial: { id: 'initial', tr: 'Başta', de: 'Anfang', icon: '🚂', badge: '1. Vagon (Başta)' },
  medial: { id: 'medial', tr: 'Ortada', de: 'Mitte', icon: '🚃', badge: '2. Vagon (Ortada)' },
  final: { id: 'final', tr: 'Sonda', de: 'Ende', icon: '🏁', badge: '3. Vagon (Sonda)' },
  isolated: { id: 'isolated', tr: 'Yalnız', de: 'Allein', icon: '🌟', badge: 'Tek Başına' },
};

/**
 * 1. Harf Treni: Missing wagon position matching
 */
export function createTrainQuestions(random = Math.random, count = 6) {
  const candidates = LETTER_POSITIONS.filter(l => !l.nonJoin);
  const chosenLetters = shuffle(candidates, random).slice(0, count);
  const positions = ['initial', 'medial', 'final'];

  return chosenLetters.map((letter, i) => {
    const missingPos = positions[i % positions.length];
    const correctForm = letter[missingPos];

    // Options: The 4 positional forms of this letter
    const options = shuffle([letter.isolated, letter.initial, letter.medial, letter.final], random);

    return {
      id: `train-${letter.id}-${missingPos}-${i}`,
      mode: 'train',
      letter,
      missingPos,
      correctForm,
      options,
      wagons: {
        initial: letter.initial,
        medial: letter.medial,
        final: letter.final,
      },
    };
  });
}

/**
 * 2. Harf Bukalemunu: Complete the 4-form letter family
 */
export function createChameleonQuestions(random = Math.random, count = 6) {
  const letters = shuffle(LETTER_POSITIONS, random).slice(0, count);
  const posKeys = ['isolated', 'initial', 'medial', 'final'];

  return letters.map((letter, i) => {
    const targetPos = posKeys[i % posKeys.length];
    const correctForm = letter[targetPos];

    // Pick 3 distractors from other letters at targetPos
    const others = LETTER_POSITIONS.filter(l => l.id !== letter.id);
    const shuffledOthers = shuffle(others, random);
    const distractors = [];
    for (const other of shuffledOthers) {
      const form = other[targetPos];
      if (form !== correctForm && !distractors.includes(form)) {
        distractors.push(form);
        if (distractors.length === 3) break;
      }
    }
    const options = shuffle([correctForm, ...distractors], random);

    return {
      id: `chameleon-${letter.id}-${targetPos}-${i}`,
      mode: 'chameleon',
      letter,
      targetPos,
      correctForm,
      options,
      forms: {
        isolated: letter.isolated,
        initial: letter.initial,
        medial: letter.medial,
        final: letter.final,
      },
    };
  });
}

/**
 * 3. Harf Dedektifi: Where is this letter placed? (Başta / Ortada / Sonda / Yalnız)
 */
export function createDetectiveQuestions(random = Math.random, count = 6) {
  const letters = shuffle(LETTER_POSITIONS, random).slice(0, count);
  const posKeys = ['isolated', 'initial', 'medial', 'final'];

  return letters.map((letter, i) => {
    const targetPos = posKeys[i % posKeys.length];
    const displayedGlyph = letter[targetPos];

    return {
      id: `detective-${letter.id}-${targetPos}-${i}`,
      mode: 'detective',
      letter,
      targetPos,
      displayedGlyph,
      correctId: targetPos,
      options: [
        { id: 'initial', tr: 'Başta', de: 'Anfang', subtitle: letter.nonJoin ? 'Öne bağlanmaz' : 'Sola bağlanır' },
        { id: 'medial', tr: 'Ortada', de: 'Mitte', subtitle: letter.nonJoin ? 'Sağdan bağlanır' : 'İki yana bağlanır' },
        { id: 'final', tr: 'Sonda', de: 'Ende', subtitle: 'Sağdan bağlanır' },
        { id: 'isolated', tr: 'Yalnız', de: 'Allein', subtitle: 'Tek başına' },
      ],
    };
  });
}

/**
 * 4. Eksik Parçayı Tamamla (Harf Yapbozu): Complete missing slot in 3-letter word
 */
export function createPuzzleQuestions(random = Math.random, count = 6) {
  const chosenWords = shuffle(POSITION_WORDS, random).slice(0, count);

  return chosenWords.map((item, i) => {
    const missingIndex = i % 3; // 0=initial, 1=medial, 2=final
    const targetLetter = item.letters[missingIndex];
    const correctForm = targetLetter.form;
    const baseLetter = LETTER_POSITIONS.find(l => l.letterId === targetLetter.letterId) || LETTER_POSITIONS[0];

    // The options are the 4 variants of this letter (initial, medial, final, isolated)
    // If some variants are identical (e.g. non-joining letter), fill up to 4 using other letters
    const variants = [baseLetter.initial, baseLetter.medial, baseLetter.final, baseLetter.isolated];
    const unique = [...new Set(variants)];
    if (unique.length < 4) {
      for (const other of shuffle(LETTER_POSITIONS, random)) {
        const candidate = other[targetLetter.pos];
        if (!unique.includes(candidate)) {
          unique.push(candidate);
          if (unique.length === 4) break;
        }
      }
    }
    const options = shuffle(unique.slice(0, 4), random);

    return {
      id: `puzzle-${item.id}-${missingIndex}-${i}`,
      mode: 'puzzle',
      wordItem: item,
      missingIndex,
      targetLetter,
      baseLetter,
      correctForm,
      options,
    };
  });
}
