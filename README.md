# Elif-Ba

DİTİB Kur’an Öğreniyorum kitabının orijinal sayfalarını ve seslerini kullanan Türkçe / Almanca React/Vite uygulaması.

## e-Kitap ve etkinlik çekmecesi

Site doğrudan e-Kitaba açılır ve bu tarayıcıdaki son sayfayı hatırlar. Yetişkin/çocuk menüleri ve ayrı öğrenme ekranları kaldırılmıştır. Eski `/yetiskin` adresleri ilgili kitap sayfasına (14, 15 veya 16), eski `/cocuk` adresleri son okunan sayfaya yönlenir.

İlk girişte **Etkinliklerle keşfet** veya **Sadece oku ve dinle** seçilir. **Okuma ayarları → Etkinlikleri göster** tercihi sonradan değiştirilebilir. Kapatıldığında oyun düğmeleri gizlenir; orijinal kitap, ses/video alanları, notlar ve yer imleri çalışmayı sürdürür. Sepya, Su Yeşili ve Karanlık modları ile Türkçe/Almanca dil seçimi korunur.

Pilot etkinlikler yalnız şu sayfalarda görünür:

- **14:** Mini Ders, Dinle ve bul, Eşini bul, Harf Atölyesi.
- **15:** Nokta dedektifi, Dinle ve bul, Eşini bul, Harf Atölyesi.
- **16:** Tabloda harfi bul, Dinle ve bul, Eşini bul, Harf Atölyesi.

Çift sayfada iki sayfada da etkinlik varsa çekmecede sayfa seçilir. Mini Ders, seçilen tek harf için tanıma → dinleme → şekli ayırt etme adımlarından oluşur. Harf seçicisi ve sıradaki harf düğmesi basılı alfabe sırasını izler. Diğer soru turları altı sorudur. Seçim cevabı otomatik değerlendirmez; Kontrol et düğmesi kullanılır. Yanlışta şekil ipucu ve yeniden deneme sunulur; ilk denemede bulunanların sayısı ayrıca tutulur. Harf Atölyesi dinleme → serbest çizim → harfi bulma akışıdır; çizim otomatik puanlanmaz. Kâğıtta çizim seçeneği de vardır. Hafıza oyununda başlangıçta 6 çift (12 kart), isteğe göre 8 veya 10 çift (16/20 kart) bulunur. Kartlar kapalı başlar; eşleşmeyen iki kart 1,1 saniye sonra kendiliğinden kapanır, eşleşenler aynı yerlerinde açık kalır. Yeni tur veya çekmeceyi kapatma bekleyen zamanlayıcıyı temizler. Etkinlikler otomatik başlamaz, süre sınırı yoktur, soru ve hafıza oyunu seçenekleri yeni turda karıştırılır. Dinleme sorularında kayıt başlamadan seçenekler açılmaz. Tamamlanan çalışmalar cihazda saklanır; tekrar oynanabilir. Oyun alanı sabit yüksekliktedir; soru, geri bildirim ve kart değişimleri boyutu oynatmaz. Masaüstünde yatay; telefonda dikey ve yatay yerleşir. 16. sayfanın on satırı, basılı sıra korunarak ikişer satırlık beş panelde gösterilir; kaydırma yerine satır seçimi kullanılır. Doğru cevap ve eşleşmeler kısa melodi, kitap-hilal simgesi ve yıldızlarla kutlanır. Ses düğmesi mevcut ses efekti tercihini kaydeder; azaltılmış hareket tercihinde animasyonlar kapatılır. Çekmece kapatıldığında ses durur, odak düğmeye döner; sayfa ve yakınlaştırma korunur. Klavye odağı çekmecede tutulur, Escape ile kapanır.

69 orijinal kitap sayfası (kaynak numaraları 6–74), kaynak dizini, ses/video alanları, arama, yer imleri, notlar, yakınlaştırma, tek/çift sayfa ve kâğıt kıvrılma animasyonu korunur. Kitap sırası değiştirilmez.

Kaynak eşleştirme notu: 16. sayfanın 6-F hücresindeki basılı harf **Sad**, eski medya alanı ise Dad sesidir. Yeni etkinlik tablosu basılı Sad harfini ve doğrulanmış Sad kaydını kullanır; orijinal kaynak verisi değiştirilmez.

Özgün Elif-Ba logosu `src/graphics/elifba-mark.svg` içindedir: açık kitap, hilal ve yıldızlardan oluşur; Duolingo logosu veya karakteri kullanılmaz. Aynı simge ilk girişte, etkinliklerde ve tarayıcı sekmesinde kullanılır.

## Çalıştırma

Windows’ta `SiteyiAc.cmd` dosyasına çift tıkla veya:

```powershell
npm install
npm run dev
```

Varsayılan yerel adres `http://localhost:3000`. `index.html` dosyasını doğrudan açmak yerine Vite sunucusunu kullan.

```powershell
npm run check:content
npm test
npm run build
npm run check:dist
npm run preview -- --port 3001
```

Üretim önizlemesinin HTTP kontrolü:

```powershell
node scripts/verify-dist.mjs http://localhost:3001
```

## Veri ve ilerleme

- `src/data/bookActivities.js`: sayfa–etkinlik eşleştirmesi, altı soruluk turlar, eşleştirme desteleri ve ilerleme doğrulama.
- `src/data/alphabetData.js`: kaynak harfler, şekil/ses açıklamaları, benzer harf grupları ve sayfa 16 sırası.
- `src/components/adult/ActivityDrawer.jsx`: etkinlik listesi ve hafıza oyunu; `ActivityRound.jsx` Mini Ders/soru turlarını, `LetterWorkshop.jsx` çizim atölyesini yönetir. Klasör adı eski dosya düzeninden kalır; ayrı yetişkin ekranı yoktur.
- `src/components/adult/ReaderWelcome.jsx`: ilk giriş tercihi.
- `src/components/adult/ReaderDialog.jsx`: modal odak yönetimi ve klavye kapanışı.
- `src/styles/book-activities.css`: üç renk moduna uyumlu opak çekmece yüzeyleri.
- `data/pages_metadata.json`: orijinal kitap sayfaları ve medya alanları.
- `src/utils/learningStore.js`: cihazdaki ayarlar, notlar ve etkinlik ilerlemesi.

Aynı `elifba:learning:v2` anahtarı kullanılır. Eski yetişkin/çocuk profilleri kaldırılırken kitap notları, yer imleri, sayfa ve tercihler korunur. Eski kayıtlarda etkinlik tercihi kararsız (`null`) başlar; ilk girişte yapılan açık/kapalı seçim sonraki girişlerde korunur. Tamamlanan etkinlik kimlikleri ve son 30 tur `reader.activityProgress` altında saklanır. İlerleme cihazlar arasında eşitlenmez.

## Yayın paketi

`npm run build`, uygulamayla birlikte e-kitap medyasını ve sayfa verilerini `dist/` içine paketler. Medya açılışta topluca indirilmez. Flash ve geliştirme dosyaları yayın paketine alınmaz. Statik sunucu, uygulama yollarını `index.html` dosyasına yönlendirmeli; MP4 byte-range isteklerini desteklemelidir.

Mevcut GitHub Pages hedefi: [elifba](https://hakansirints.github.io/elifba/). Yayın komutu `npm run publish:pages`; kaynak `main`, derlenmiş paket `gh-pages` dalındadır. Pages sürümünde taban yol `/elifba/` ve hash yönlendirmesi kullanılır. Yerel geliştirmede normal yollar kullanılır.


## Üç renk modu

Sepya, Su Yeşili ve Karanlık modları korunur. Eski açık mod seçimi Su Yeşili’ne taşınır; tema e-kitap ile ortak kaydedilir.

## CSS + SVG cam kırılması

Önceki Liquid Glass isteminin global aurora animasyonu, 24 px yüzey bulanıklığı, kart büyütmesi, 1 px maskeli dekoratif halkası ve tüm navigasyon/modallara yayılan stil katmanı kaldırılmıştır. Yeni uygulama buton ve kartlara ayrılan bağımsız CSS + SVG kodudur.

- `src/styles/site-palettes.css`: cam efektinden bağımsız üç renk paleti.
- `src/styles/glass-refraction.css`: `.refract-card` ve `.refract-btn`; arka planı kıran ayrı pseudo katman, yumuşak kenar geçişi ve kenar gölgeleri.
- `src/graphics/glass-filters.svg`: sıfırdan yazılan vektör X/Y normal haritaları, `feDisplacementMap`, yükseklik alanı ve `feSpecularLighting`. Kart ölçeği 14, buton ölçeği 7 pikseldir.
- `src/components/common/GlassFilters.jsx`: yerel SVG tanımlarını uygulamada bir kere kurar.
- `examples/glass-refraction.html`: normal cam ve SVG kırılmasını aynı ızgara üzerinde karşılaştıran, gerçek harf sesi de içeren bağımsız örnek. Yerel geliştirme adresi `/examples/glass-refraction.html`.

### Düz HTML entegrasyonu

Önce renk paletini veya kendi `--site-*` değişkenlerini, sonra `glass-refraction.css` dosyasını yükle. `glass-filters.svg` içeriğini `<body>` içine bir kez yapıştır; filtre tanımlarını `display:none` ile gizleme. Kartlara `.refract-card`, kontrollere `.refract-btn` ekle. Bir render döngüsü veya yeni paket gerekmez. CSS’te `--glass-radius`, `--glass-bevel`, `--glass-fill` ve `--glass-filter` ayarlanabilir. Yer değiştirme miktarı SVG’deki `scale` özniteliğidir; CSS değişkeni SVG özniteliğini kendiliğinden değiştirmez.

R/G kanalları X/Y yer değiştirmesini kontrol eder; 0.5 nötrdür. İki yönlü vektör gradyanı kenarlarda eğilme üretir, merkezde nötr kalır. Ayrı bir yükseklik alanı ışığa bakan kenarları aydınlatır. Filtre yalnız pseudo-elementin **backdrop** katmanındadır; ön plandaki harf ve kontrol yazıları filtrelenmez. Önceki sayfa çapında hareketli arka plan bulunmaz.

Kırılma düzlemi `--glass-lens-inset` ile çerçeveden içeri alınır (kart: 10 px, buton: 6 px). Bu mesafe, SVG'nin en büyük yer değiştirmesi (`scale / 2`) ve bulanıklık payından büyük kalmalıdır; aksi halde filtre butonun kendi parlak kenarını örnekleyip köşelerde çapraz çizgiler üretir. Kenar parlamasını yalnız `::after` katmanı çizer; ana yüzeyde ikinci bir iç parlama halkası bulunmaz.

### İncelenen kaynaklar ve sınırlar

- [Liquid-Glass-Element kaynak kodu](https://github.com/occupiedbyhim/Liquid-Glass-Element/blob/main/preview/app.js): kenar normalleri, kırılma ve aydınlatmayı CSS bulanıklığından ayırır. Asıl uygulama WebGL shader kullanır. Buradaki CSS + SVG sürümü o WebGL ışın/normal hesabının bire bir eşdeğeri değildir.
- [FreeFrontend derlemesi](https://freefrontend.com/css-liquid-glass/): CSS/SVG örneklerini ve displacement yaklaşımlarını karşılaştırmak için incelendi; örnek kodları kopyalanmadı.
- [W3C feDisplacementMap](https://www.w3.org/TR/filter-effects-1/#feDisplacementMapElement): yer değiştirme kanal ve ölçek mantığı.

SVG `backdrop-filter: url(...)` desteği tarayıcıya göre değişir. CSS `@supports` yalnız sözdizimini sınar; görsel uygulamayı kanıtlamaz. Filtre desteklenmediğinde renkli yüzey, normal bulanıklık/kenarlık ve net harfler kalır. Yoğun mobil ızgaralarda SVG kırılması etkinleştirilmez. Hareketi/şeffaflığı azaltma ve zorunlu kontrast tercihleri desteklenir. Fiziksel Safari/iPhone ölçümü yapılmamıştır.
