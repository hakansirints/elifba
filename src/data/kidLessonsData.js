// Çocuk Modu: Tam İnteraktif Müfredat ve Konu Sonu Oyunları Verisi

export const KID_TOPICS = [
  {
    id: 'letters',
    order: 1,
    icon: '🔤',
    titleTr: 'Kur\'an Harfleri Dünyası',
    titleDe: 'Die Welt der Buchstaben',
    subtitleTr: '28 sevimli harfi tanıyalım ve seslerini dinleyelim!',
    subtitleDe: 'Lerne die 28 arabischen Buchstaben kennen!',
    badge: 'Harf Kaşifi',
    color: 'from-amber-400 via-orange-400 to-rose-400',
    mascotTipTr: 'Merhaba minik dostum! Ben Elifcan. Kur\'an-ı Kerim sağdan sola doğru okunur. Hadi harflerin üzerine dokun ve seslerini dinle!',
    mascotTipDe: 'Hallo kleiner Entdecker! Das arabische Alphabet wird von rechts nach links gelesen. Tippe auf die Buchstaben und höre ihre Laute!',
    items: [
      { char: 'ا', nameTr: 'Elif', nameDe: 'Alif', audio: 'assets/audio/arabic/arp01.mp3', hint: 'Düz bir çizgi gibidir.' },
      { char: 'ب', nameTr: 'Bâ', nameDe: 'Ba', audio: 'assets/audio/arabic/arp02.mp3', hint: 'Altında bir noktası vardır.' },
      { char: 'ت', nameTr: 'Tâ', nameDe: 'Ta', audio: 'assets/audio/arabic/arp03.mp3', hint: 'Üzerinde iki gülen göz (nokta) vardır.' },
      { char: 'ث', nameTr: 'Sâ (Peltek)', nameDe: 'Tha', audio: 'assets/audio/arabic/arp04.mp3', hint: 'Üzerinde 3 noktası vardır, dili dişlerin arasına alarak söylenir.' },
      { char: 'ج', nameTr: 'Cîm', nameDe: 'Dschim', audio: 'assets/audio/arabic/arp05.mp3', hint: 'Karnında bir noktası olan neşeli harf!' },
      { char: 'ح', nameTr: 'Hâ', nameDe: 'Ha', audio: 'assets/audio/arabic/arp06.mp3', hint: 'Noktası yoktur, temiz boğazdan çıkar.' },
      { char: 'خ', nameTr: 'Hı', nameDe: 'Cha', audio: 'assets/audio/arabic/arp07.mp3', hint: 'Tepesinde bir noktası olan kalın harf.' },
      { char: 'د', nameTr: 'Dâl', nameDe: 'Dal', audio: 'assets/audio/arabic/arp08.mp3', hint: 'Bükülmüş sevimli bir kol gibi.' },
      { char: 'ذ', nameTr: 'Zâl (Peltek)', nameDe: 'Dhal', audio: 'assets/audio/arabic/arp09.mp3', hint: 'Tepesinde noktası olan peltek harf.' },
      { char: 'ر', nameTr: 'Râ', nameDe: 'Ra', audio: 'assets/audio/arabic/arp10.mp3', hint: 'Kaydırak gibi aşağı doğru süzülür.' },
      { char: 'ز', nameTr: 'Zê', nameDe: 'Zay', audio: 'assets/audio/arabic/arp11.mp3', hint: 'Kaydırağın tepesinde noktası var!' },
      { char: 'س', nameTr: 'Sîn', nameDe: 'Sin', audio: 'assets/audio/arabic/arp12.mp3', hint: '3 dişli sevimli tarak gibi.' },
      { char: 'ش', nameTr: 'Şîn', nameDe: 'Schin', audio: 'assets/audio/arabic/arp13.mp3', hint: 'Tarak üzerinde 3 pırlanta noktası var!' },
      { char: 'ص', nameTr: 'Sâd', nameDe: 'Sad', audio: 'assets/audio/arabic/arp14.mp3', hint: 'Kalın ve tok bir ses.' },
      { char: 'ض', nameTr: 'Dâd', nameDe: 'Dad', audio: 'assets/audio/arabic/arp15.mp3', hint: 'Kur\'an\'a has en özel harflerden biri.' },
      { char: 'ط', nameTr: 'Tı', nameDe: 'Ta', audio: 'assets/audio/arabic/arp16.mp3', hint: 'Direği olan güçlü kalın harf.' },
      { char: 'ظ', nameTr: 'Zı', nameDe: 'Za', audio: 'assets/audio/arabic/arp17.mp3', hint: 'Direğinin yanında noktası var.' },
      { char: 'ع', nameTr: 'Ayn', nameDe: 'Ain', audio: 'assets/audio/arabic/arp18.mp3', hint: 'Boğazın tam ortasından gülümser.' },
      { char: 'غ', nameTr: 'Gayn', nameDe: 'Ghain', audio: 'assets/audio/arabic/arp19.mp3', hint: 'Boğazdan çıkan kalın harf.' },
      { char: 'ف', nameTr: 'Fê', nameDe: 'Fa', audio: 'assets/audio/arabic/arp20.mp3', hint: 'Üstünde bir noktası olan ince harf.' },
      { char: 'ق', nameTr: 'Kâf', nameDe: 'Qaf', audio: 'assets/audio/arabic/arp21.mp3', hint: 'Üzerinde 2 noktası olan güçlü kalın harf.' },
      { char: 'ك', nameTr: 'Kef', nameDe: 'Kaf', audio: 'assets/audio/arabic/arp22.mp3', hint: 'İçinde minik bir hediye taşıyan ince harf.' },
      { char: 'ل', nameTr: 'Lâm', nameDe: 'Lam', audio: 'assets/audio/arabic/arp23.mp3', hint: 'Baston gibi kıvrılan harf.' },
      { char: 'م', nameTr: 'Mîm', nameDe: 'Mim', audio: 'assets/audio/arabic/arp24.mp3', hint: 'Dudakları kapatarak okunan harf.' },
      { char: 'ن', nameTr: 'Nûn', nameDe: 'Nun', audio: 'assets/audio/arabic/arp25.mp3', hint: 'Çanağın içinde bir elmas taşıyor.' },
      { char: 'و', nameTr: 'Vâv', nameDe: 'Waw', audio: 'assets/audio/arabic/arp26.mp3', hint: 'Yuvarlak başlı sevimli harf.' },
      { char: 'ه', nameTr: 'Hê', nameDe: 'Ha', audio: 'assets/audio/arabic/arp27.mp3', hint: 'Kelebek gibi yumuşak bir H sesi.' },
      { char: 'لا', nameTr: 'Lâmelif', nameDe: 'Lam-Alif', audio: 'assets/audio/arabic/arp28.mp3', hint: 'Lâm ile Elif el ele tutuşmuş!' },
      { char: 'ى', nameTr: 'Yâ', nameDe: 'Ya', audio: 'assets/audio/arabic/arp29.mp3', hint: 'Kuğu gibi süzülen harf.' }
    ],
    game: {
      type: 'balloon_pop',
      titleTr: 'Harf Balonlarını Patlat!',
      titleDe: 'Lass die Ballons platzen!',
      instructionsTr: 'Duyduğun harfi taşıyan balona hemen dokun ve patlat!',
      instructionsDe: 'Höre den Buchstaben und tippe schnell auf den richtigen Ballon!'
    }
  },
  {
    id: 'shapes',
    order: 2,
    icon: '🧩',
    titleTr: 'Harflerin Şekil Değişimi',
    titleDe: 'Formen der Buchstaben',
    subtitleTr: 'Harfler kelime içinde başta, ortada ve sonda el ele tutuşur!',
    subtitleDe: 'Buchstaben am Anfang, in der Mitte und am Ende.',
    badge: 'Şekil Dedektifi',
    color: 'from-blue-400 via-indigo-400 to-purple-500',
    mascotTipTr: 'Harfler arkadaş canlısıdır! Birbirlerine bağlanırken ellerini uzatırlar ve şekilleri biraz değişir. Bakalım hangilerini tanıyabileceksin?',
    mascotTipDe: 'Wenn Buchstaben sich verbinden, ändern sie leicht ihre Form. Kannst du sie wiedererkennen?',
    items: [
      { char: 'بـ ـبـ ـب', base: 'ب', nameTr: 'Bâ (Başta, Ortada, Sonda)', nameDe: 'Ba', audio: 'assets/audio/arabic/arp02.mp3', hint: 'Noktası hep altındadır.' },
      { char: 'تـ ـتـ ـت', base: 'ت', nameTr: 'Tâ (Başta, Ortada, Sonda)', nameDe: 'Ta', audio: 'assets/audio/arabic/arp03.mp3', hint: 'İki noktası hep üstündedir.' },
      { char: 'جـ ـجـ ـج', base: 'ج', nameTr: 'Cîm (Başta, Ortada, Sonda)', nameDe: 'Dschim', audio: 'assets/audio/arabic/arp05.mp3', hint: 'Kuyruğu gider, noktası kalır.' },
      { char: 'سـ ـسـ ـس', base: 'س', nameTr: 'Sîn (Başta, Ortada, Sonda)', nameDe: 'Sin', audio: 'assets/audio/arabic/arp12.mp3', hint: '3 dişi hep korunur.' },
      { char: 'عـ ـعـ ـع', base: 'ع', nameTr: 'Ayn (Başta, Ortada, Sonda)', nameDe: 'Ain', audio: 'assets/audio/arabic/arp18.mp3', hint: 'Ortada ve sonda içi dolar.' },
      { char: 'كـ ـكـ ـك', base: 'ك', nameTr: 'Kef (Başta, Ortada, Sonda)', nameDe: 'Kaf', audio: 'assets/audio/arabic/arp22.mp3', hint: 'Başta ve ortada şekli değişir.' },
      { char: 'مـ ـمـ ـم', base: 'م', nameTr: 'Mîm (Başta, Ortada, Sonda)', nameDe: 'Mim', audio: 'assets/audio/arabic/arp24.mp3', hint: 'Yuvarlak başı el uzatır.' },
      { char: 'يـ ـيـ ـي', base: 'ى', nameTr: 'Yâ (Başta, Ortada, Sonda)', nameDe: 'Ya', audio: 'assets/audio/arabic/arp29.mp3', hint: 'Başta ve ortada iki noktası altındadır.' }
    ],
    game: {
      type: 'shape_match',
      titleTr: 'Şekil Eşleştirme Yapbozu',
      titleDe: 'Formen-Puzzle',
      instructionsTr: 'Müstakil halini gördüğün harfin kelime içindeki doğru şeklini bul!',
      instructionsDe: 'Finde die passende Form des Buchstabens!'
    }
  },
  {
    id: 'fetha',
    order: 3,
    icon: '🚀',
    titleTr: 'Üstün (Fetha َ)',
    titleDe: 'Fetha (Üstün َ)',
    subtitleTr: 'Harflerin tepesine konan şapka: "E" ve "A" sesi verir!',
    subtitleDe: 'Der Laut "E" und "A" über den Buchstaben.',
    badge: 'Üstün Pilotu',
    color: 'from-emerald-400 via-teal-400 to-cyan-500',
    mascotTipTr: 'Üstün, harfin üzerine konan minik eğik bir çizgidir. İnce harfleri "E", kalın harfleri "A" sesiyle neşeyle okutur!',
    mascotTipDe: 'Fetha ist ein schräger Strich über dem Buchstaben. Dünne Buchstaben klingen wie "E", dicke wie "A"!',
    items: [
      { char: 'اَ', soundText: 'E', audio: 'assets/audio/arabic/arp01_2.mp3', isThin: true },
      { char: 'بَ', soundText: 'Be', audio: 'assets/audio/arabic/arp02_1.mp3', isThin: true },
      { char: 'تَ', soundText: 'Te', audio: 'assets/audio/arabic/arp03_1.mp3', isThin: true },
      { char: 'ثَ', soundText: 'Se', audio: 'assets/audio/arabic/arp04_1.mp3', isThin: true },
      { char: 'جَ', soundText: 'Ce', audio: 'assets/audio/arabic/arp05_1.mp3', isThin: true },
      { char: 'حَ', soundText: 'Ha', audio: 'assets/audio/arabic/arp06_1.mp3', isThin: false },
      { char: 'خَ', soundText: 'Ha (Kalın)', audio: 'assets/audio/arabic/arp07_1.mp3', isThin: false },
      { char: 'دَ', soundText: 'De', audio: 'assets/audio/arabic/arp08_1.mp3', isThin: true },
      { char: 'رَ', soundText: 'Ra', audio: 'assets/audio/arabic/arp10_1.mp3', isThin: false },
      { char: 'سَ', soundText: 'Se', audio: 'assets/audio/arabic/arp12_1.mp3', isThin: true },
      { char: 'صَ', soundText: 'Sa', audio: 'assets/audio/arabic/arp14_1.mp3', isThin: false },
      { char: 'طَ', soundText: 'Ta', audio: 'assets/audio/arabic/arp16_1.mp3', isThin: false }
    ],
    game: {
      type: 'sound_target',
      titleTr: 'Üstün Roketi Hedef Oyunu',
      titleDe: 'Fetha-Rakete',
      instructionsTr: 'Sesi dinle, roketi doğru üstünlü harfe yönlendir!',
      instructionsDe: 'Höre den Laut und ziele auf den richtigen Buchstaben!'
    }
  },
  {
    id: 'kesra',
    order: 4,
    icon: '🌊',
    titleTr: 'Esre (Kesra ِ)',
    titleDe: 'Kesra (Esre ِ)',
    subtitleTr: 'Harflerin altına konur: "İ" ve "I" sesi verir!',
    subtitleDe: 'Der Laut "I" unter den Buchstaben.',
    badge: 'Esre Dalgıcı',
    color: 'from-blue-400 via-sky-400 to-indigo-500',
    mascotTipTr: 'Esre harfin tam altına konur. İnce harfleri "İ", kalın harfleri "I-İ" arası güzel bir sesle okutur!',
    mascotTipDe: 'Kesra steht unter dem Buchstaben und erzeugt den "I"-Laut.',
    items: [
      { char: 'اِ', soundText: 'İ', audio: 'assets/audio/arabic/arp01_4.mp3', isThin: true },
      { char: 'بِ', soundText: 'Bi', audio: 'assets/audio/arabic/arp02_3.mp3', isThin: true },
      { char: 'تِ', soundText: 'Ti', audio: 'assets/audio/arabic/arp03_3.mp3', isThin: true },
      { char: 'ثِ', soundText: 'Si', audio: 'assets/audio/arabic/arp04_3.mp3', isThin: true },
      { char: 'جِ', soundText: 'Ci', audio: 'assets/audio/arabic/arp05_3.mp3', isThin: true },
      { char: 'حِ', soundText: 'Hı', audio: 'assets/audio/arabic/arp06_3.mp3', isThin: false },
      { char: 'دِ', soundText: 'Di', audio: 'assets/audio/arabic/arp08_3.mp3', isThin: true },
      { char: 'رِ', soundText: 'Ri', audio: 'assets/audio/arabic/arp10_3.mp3', isThin: true },
      { char: 'سِ', soundText: 'Si', audio: 'assets/audio/arabic/arp12_3.mp3', isThin: true },
      { char: 'طِ', soundText: 'Tı', audio: 'assets/audio/arabic/arp16_3.mp3', isThin: false }
    ],
    game: {
      type: 'sound_target',
      titleTr: 'Deniz Altı Esre Avı',
      titleDe: 'Unterwasser-Kesra',
      instructionsTr: 'Sesi dinle, denizdeki doğru esreli harfi seç!',
      instructionsDe: 'Höre den Ton und wähle die richtige Muschel!'
    }
  },
  {
    id: 'damme',
    order: 5,
    icon: '🎈',
    titleTr: 'Ötre (Damme ُ)',
    titleDe: 'Damme (Ötre ُ)',
    subtitleTr: 'Harfin tepesindeki minik vav: "Ü" ve "U" sesi verir!',
    subtitleDe: 'Der Laut "U" und "Ü" über dem Buchstaben.',
    badge: 'Ötre Ustası',
    color: 'from-purple-400 via-pink-400 to-rose-400',
    mascotTipTr: 'Ötre dudaklarımızı büzerek çıkardığımız sevimli bir sestir! İnce harfleri "Ü", kalın harfleri "U" yapar!',
    mascotTipDe: 'Damme rundet die Lippen und erzeugt ein "U" oder "Ü"!',
    items: [
      { char: 'اُ', soundText: 'Ü', audio: 'assets/audio/arabic/arp01_6.mp3', isThin: true },
      { char: 'بُ', soundText: 'Bü', audio: 'assets/audio/arabic/arp02_5.mp3', isThin: true },
      { char: 'تُ', soundText: 'Tü', audio: 'assets/audio/arabic/arp03_5.mp3', isThin: true },
      { char: 'ثُ', soundText: 'Sü', audio: 'assets/audio/arabic/arp04_5.mp3', isThin: true },
      { char: 'جُ', soundText: 'Cü', audio: 'assets/audio/arabic/arp05_5.mp3', isThin: true },
      { char: 'خُ', soundText: 'Hu', audio: 'assets/audio/arabic/arp07_5.mp3', isThin: false },
      { char: 'دُ', soundText: 'Dü', audio: 'assets/audio/arabic/arp08_5.mp3', isThin: true },
      { char: 'صُ', soundText: 'Su', audio: 'assets/audio/arabic/arp14_5.mp3', isThin: false },
      { char: 'كُ', soundText: 'Kü', audio: 'assets/audio/arabic/arp22_5.mp3', isThin: true },
      { char: 'مُ', soundText: 'Mü', audio: 'assets/audio/arabic/arp24_5.mp3', isThin: true }
    ],
    game: {
      type: 'sound_target',
      titleTr: 'Ötre Balonlarını Yakala',
      titleDe: 'Damme-Ballonjagd',
      instructionsTr: 'Sesi dinle ("Bü", "Tü", "Su"...), doğru ötreli harfi bul!',
      instructionsDe: 'Höre den Laut und finde den richtigen Buchstaben!'
    }
  },
  {
    id: 'cezim',
    order: 6,
    icon: '🛑',
    titleTr: 'Cezim (Sükûn ْ - Tutturucu)',
    titleDe: 'Dschezm (Sükûn ْ)',
    subtitleTr: 'Harfleri birbirine kenetleyen sihirli halka!',
    subtitleDe: 'Verbindet zwei Buchstaben ohne Vokal.',
    badge: 'Cezim Kenetleyici',
    color: 'from-amber-500 via-orange-500 to-red-500',
    mascotTipTr: 'Cezim harfin üzerine konan küçük bir yuvarlaktır (ْ). Kendinden önceki harfe sıkıca tutunur ve sesi durdurur: Eb, Et, El, Kul!',
    mascotTipDe: 'Dschezm ist ein kleiner Kreis über dem Buchstaben. Er stoppt den Laut und verbindet zwei Buchstaben!',
    items: [
      { char: 'اَبْ', soundText: 'Eb', audio: 'assets/audio/arabic/arp01_11.mp3', hint: 'Elif üstün + Be cezim' },
      { char: 'اَتْ', soundText: 'Et', audio: 'assets/audio/arabic/arp02_11.mp3', hint: 'Elif üstün + Te cezim' },
      { char: 'اَثْ', soundText: 'Es', audio: 'assets/audio/arabic/arp03_11.mp3', hint: 'Elif üstün + Se cezim' },
      { char: 'اَجْ', soundText: 'Ec', audio: 'assets/audio/arabic/arp04_10.mp3', hint: 'Elif üstün + Cim cezim' },
      { char: 'اَحْ', soundText: 'Eh', audio: 'assets/audio/arabic/arp05_11.mp3', hint: 'Elif üstün + Ha cezim' },
      { char: 'اَخْ', soundText: 'Eh (Kalın)', audio: 'assets/audio/arabic/arp06_10.mp3', hint: 'Elif üstün + Hı cezim' }
    ],
    game: {
      type: 'cezim_train',
      titleTr: 'Cezim Treni Vagon Bağlama',
      titleDe: 'Dschezm-Zug',
      instructionsTr: 'Sesi dinle ("Eb", "Et", "Ec"..), doğru vagonu bağla!',
      instructionsDe: 'Höre den Laut und hänge den richtigen Waggon an!'
    }
  },
  {
    id: 'sedde',
    order: 7,
    icon: '⚡',
    titleTr: 'Şedde (ّ - Çift Okutucu)',
    titleDe: 'Schedde (ّ - Verdoppelung)',
    subtitleTr: 'Harfe süper güç verir: Harfi iki kere okutur!',
    subtitleDe: 'Verdoppelt die Aussprache des Buchstabens.',
    badge: 'Şedde Şampiyonu',
    color: 'from-rose-500 via-pink-500 to-purple-600',
    mascotTipTr: 'Şedde harfin üzerindeki küçük martı (w) gibidir. Üzerine konduğu harfi birincisi cezimli, ikincisi harekeli gibi iki kere okutur: Ebbe, İnne, Rabbi!',
    mascotTipDe: 'Schedde sieht wie ein "w" aus und verdoppelt die Kraft des Buchstabens!',
    items: [
      { char: 'اَبَّ', soundText: 'Ebbe', audio: 'assets/audio/arabic/arp01_13.mp3', hint: 'Eb + Be = Ebbe' },
      { char: 'اَتَّ', soundText: 'Ette', audio: 'assets/audio/arabic/arp02_13.mp3', hint: 'Et + Te = Ette' },
      { char: 'اَثَّ', soundText: 'Esse', audio: 'assets/audio/arabic/arp03_13.mp3', hint: 'Es + Se = Esse' },
      { char: 'اَجَّ', soundText: 'Ecce', audio: 'assets/audio/arabic/arp04_12.mp3', hint: 'Ec + Ce = Ecce' },
      { char: 'اَحَّ', soundText: 'Ehha', audio: 'assets/audio/arabic/arp05_13.mp3', hint: 'Eh + Ha = Ehha' },
      { char: 'اَخَّ', soundText: 'Ehha (Kalın)', audio: 'assets/audio/arabic/arp06_12.mp3', hint: 'Eh + Hı = Ehha' }
    ],
    game: {
      type: 'sedde_drum',
      titleTr: 'Şedde Davulu Ritim Oyunu',
      titleDe: 'Schedde-Trommel',
      instructionsTr: 'Güçlü şeddeli sesi dinle ("Ebbe", "Ette"..), doğru davula vur!',
      instructionsDe: 'Höre den doppelten Laut und schlage die richtige Trommel!'
    }
  },
  {
    id: 'tenvin',
    order: 8,
    icon: '🧺',
    titleTr: 'Tenvin (ً  ٍ  ٌ - İki Hareke)',
    titleDe: 'Tenwin (ً  ٍ  ٌ)',
    subtitleTr: 'İki Üstün (En/An), İki Esre (İn/In), İki Ötre (Ün/Un)!',
    subtitleDe: 'Erzeugt die Endungen "-en", "-in" und "-un".',
    badge: 'Tenvin Ustası',
    color: 'from-amber-400 via-yellow-400 to-lime-500',
    mascotTipTr: 'Harekeler çift olunca gizli bir "N" sesi gelir! İki üstün "EN", iki esre "İN", iki ötre "ÜN" diye okunur.',
    mascotTipDe: 'Zwei Vokalzeichen fügen am Wortende den Klang "N" hinzu!',
    items: [
      { char: 'اً', soundText: 'En', audio: 'assets/audio/arabic/arp01_15.mp3', hint: 'İki Üstün = En' },
      { char: 'بً', soundText: 'Ben', audio: 'assets/audio/arabic/arp02_15.mp3', hint: 'İki Üstün = Ben' },
      { char: 'تً', soundText: 'Ten', audio: 'assets/audio/arabic/arp03_15.mp3', hint: 'İki Üstün = Ten' },
      { char: 'ٍ', soundText: 'İn', audio: 'assets/audio/arabic/arp04_14.mp3', hint: 'İki Esre = İn' },
      { char: 'بٍ', soundText: 'Bin', audio: 'assets/audio/arabic/arp05_15.mp3', hint: 'İki Esre = Bin' },
      { char: 'ٌ', soundText: 'Ün', audio: 'assets/audio/arabic/arp06_14.mp3', hint: 'İki Ötre = Ün' }
    ],
    game: {
      type: 'tenvin_basket',
      titleTr: 'Tenvin Sepeti Yakalama',
      titleDe: 'Tenwin-Korb',
      instructionsTr: 'Düşen sesi dinle ("En", "İn" veya "Ün"), doğru sepete at!',
      instructionsDe: 'Fange den Laut im richtigen Korb!'
    }
  },
  {
    id: 'duas',
    order: 9,
    icon: '🤲',
    titleTr: 'Namaz Duaları Köyü',
    titleDe: 'Die Welt der Gebete',
    subtitleTr: 'Sübhâneke, Tahiyyât, Salli-Bârik ve Kunût dualarını öğrenelim!',
    subtitleDe: 'Lerne die wichtigsten Gebete für das Gebet!',
    badge: 'Dua Hafızı',
    color: 'from-teal-500 via-emerald-500 to-green-600',
    mascotTipTr: 'Namazda okuduğumuz duaları güzelce öğrenelim! Hem çizgi film gibi videolarını izleyebilir hem de seslerini dinleyebilirsin.',
    mascotTipDe: 'Lerne die Gebete mit anschaulichen Videos und Audioaufnahmen!',
    items: [
      { id: 'subhaneke', nameTr: 'Sübhâneke Duâsı', nameDe: 'Subhâneke Gebet', audio: 'assets/audio/turkish/subhaneketr.mp3', video: 'assets/videos/subhaneke.mp4', icon: '🤲' },
      { id: 'tahiyyat', nameTr: 'Et-Tahiyyâtu Duâsı', nameDe: 'Et-Tahiyyâtu Gebet', audio: 'assets/audio/turkish/ettahiyyatutr.mp3', video: 'assets/videos/tahiyyat.mp4', icon: '🕊️' },
      { id: 'salli', nameTr: 'Allâhumme Salli', nameDe: 'Allâhumme Salli', audio: 'assets/audio/turkish/sallitr.mp3', video: 'assets/videos/sallison2.mp4', icon: '🌹' },
      { id: 'barik', nameTr: 'Allâhumme Bârik', nameDe: 'Allâhumme Bârik', audio: 'assets/audio/turkish/bariktr.mp3', video: 'assets/videos/barikson2.mp4', icon: '🌿' },
      { id: 'rabbenaatina', nameTr: 'Rabbenâ Âtinâ', nameDe: 'Rabbenâ Âtinâ', audio: 'assets/audio/turkish/rabbenaatinatr.mp3', video: 'assets/videos/rabbenaatina.mp4', icon: '🤲' },
      { id: 'kunut1', nameTr: 'Kunût Duâsı 1', nameDe: 'Qunût-Gebet 1', audio: 'assets/audio/turkish/kunut1tr.mp3', video: 'assets/videos/Kunut_1_1.mp4', icon: '🌙' }
    ],
    game: {
      type: 'dua_quiz',
      titleTr: 'Dua Bilgesi Bilgi Oyunu',
      titleDe: 'Gebets-Meister',
      instructionsTr: 'Hangi duanın ne zaman okunduğunu bil ve yıldızları topla!',
      instructionsDe: 'Beantworte die Fragen zu den Gebeten!'
    }
  },
  {
    id: 'surahs',
    order: 10,
    icon: '✨',
    titleTr: 'Kısa Sureler Vadisi',
    titleDe: 'Kurze Suren des Korans',
    subtitleTr: 'Fâtiha, İhlâs, Felak, Nâs, Kevser ve diğer namaz sureleri!',
    subtitleDe: 'Fâtiha, Ichlâs, Felaq, Nâs und weitere Suren.',
    badge: 'Sure Yıldızı',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
    mascotTipTr: 'Namaz sureleri bizim en güzel yoldaşımızdır! Her surenin tecvitli videosunu izle ve sesli okunuşunu takip et.',
    mascotTipDe: 'Schaue dir die animierten Lehrvideos an und lerne die Suren auswendig!',
    items: [
      { id: 'fatiha', nameTr: 'Fâtiha Sûresi', nameDe: 'Sure Fâtiha', audio: 'assets/audio/turkish/fatihatr.mp3', video: 'assets/videos/fatiha2.mp4', icon: '📖' },
      { id: 'ihlas', nameTr: 'İhlâs Sûresi', nameDe: 'Sure Ichlâs', audio: 'assets/audio/turkish/ihlastr.mp3', video: 'assets/videos/ihlas.mp4', icon: '💎' },
      { id: 'felak', nameTr: 'Felak Sûresi', nameDe: 'Sure Felaq', audio: 'assets/audio/turkish/felaktr.mp3', video: 'assets/videos/felak.mp4', icon: '🌅' },
      { id: 'nas', nameTr: 'Nâs Sûresi', nameDe: 'Sure Nâs', audio: 'assets/audio/turkish/nastr.mp3', video: 'assets/videos/nas.mp4', icon: '🌟' },
      { id: 'kevser', nameTr: 'Kevser Sûresi', nameDe: 'Sure Kewser', audio: 'assets/audio/turkish/kevsertr.mp3', video: 'assets/videos/kevserson2.mp4', icon: '🌊' },
      { id: 'fil', nameTr: 'Fîl Sûresi', nameDe: 'Sure Fîl', audio: 'assets/audio/turkish/filtr.mp3', video: 'assets/videos/fil.mp4', icon: '🐘' },
      { id: 'ayetelkursi', nameTr: 'Âyetü\'l-Kürsî', nameDe: 'Âyetul-Kursî', audio: 'assets/audio/turkish/ayetelkursitr.mp3', video: 'assets/videos/ayetelkursi.mp4', icon: '✨' }
    ],
    game: {
      type: 'sura_quiz',
      titleTr: 'Sure Dedektifi Oyunu',
      titleDe: 'Suren-Detektiv',
      instructionsTr: 'Sure ile ilgili ipuçlarını dinle, doğru sureyi tahmin et!',
      instructionsDe: 'Errate die richtige Sure anhand der Hinweise!'
    }
  },
  {
    id: 'farz',
    order: 11,
    icon: '🕋',
    titleTr: '32 Farz & Dini Bilgiler',
    titleDe: '32 Hauptpflichten',
    subtitleTr: 'İslam\'ın şartları, İmanın şartları, Abdest ve Namaz farzları!',
    subtitleDe: 'Säulen des Islam, des Glaubens und der Reinigung.',
    badge: 'Bilgi Şampiyonu',
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    mascotTipTr: 'Dinimizin temel bilgilerini öğrenmek çok eğlenceli! İslam\'ın 5, İmanın 6, Abdestin 4 şartını sesli olarak dinle ve öğren!',
    mascotTipDe: 'Lerne die 5 Säulen des Islam, die 6 Säulen des Glaubens und die Gebetswaschung!',
    items: [
      { id: 'islam', nameTr: 'İslam\'ın Şartları (5)', nameDe: '5 Säulen des Islam', audio: 'assets/audio/turkish/islam.mp3', count: 5, icon: '🕌' },
      { id: 'iman', nameTr: 'İmanın Şartları (6)', nameDe: '6 Glaubensartikel', audio: 'assets/audio/turkish/iman.mp3', count: 6, icon: '⭐' },
      { id: 'abdest', nameTr: 'Abdestin Farzları (4)', nameDe: '4 Pflichten der Gebetswaschung', audio: 'assets/audio/turkish/abdest.mp3', count: 4, icon: '💧' },
      { id: 'gusul', nameTr: 'Guslün Farzları (3)', nameDe: '3 Pflichten der Ganzkörperwaschung', audio: 'assets/audio/turkish/gusul.mp3', count: 3, icon: '🚿' },
      { id: 'teyemmum', nameTr: 'Teyemmümün Farzları (2)', nameDe: '2 Pflichten der Ersatzreinigung', audio: 'assets/audio/turkish/teyemmum.mp3', count: 2, icon: '🏜️' },
      { id: 'namaz', nameTr: 'Namazın Farzları (12)', nameDe: '12 Pflichten des Ritualgebets', audio: 'assets/audio/arabic/namaz1.mp3', count: 12, icon: '🕋' }
    ],
    game: {
      type: 'farz_wheel',
      titleTr: 'Bilgi Çarkıfeleği',
      titleDe: 'Wissensrad',
      instructionsTr: 'Dini bilgiler sorularına doğru cevap ver, altın madalyayı kazan!',
      instructionsDe: 'Drehe das Rad und beantworte die Fragen!'
    }
  }
];
