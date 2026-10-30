# Elif-Ba

DİTİB Kur’an Öğreniyorum kaynaklarını kullanan, Türkçe ve Almanca üç bölümlü React/Vite uygulaması.

## Bölümler

- `/`: e-Kitap, yetişkin ve çocuk eğitimi için ortak giriş.
- `/e-kitap`: 69 orijinal sayfa (kaynak numaraları 6–74); sayfa üzerindeki ses/video alanları ve son sayfayı hatırlama. Soldan açılan dizin, tam metin arama, sayfa görselleri, yer imleri ve cihazda kaydedilen sayfa notları. Fare tekeriyle %50–300 yakınlaştırma, sayfaya/genişliğe sığdırma, sürükleyerek gezinme, tek/çift sayfa, tam ekran ve odak modu. Sayfa geçişinde köşeden kâğıt kıvrılması kullanılır; hareket azaltma tercihinde animasyon kapatılır. Açık/sepya/koyu zemin, sayfa parlaklığı ve ses hızı kaydedilir. `← →` sayfa çevirir, `0` sayfaya sığdırır, `B` yer imini, `F` tam ekranı değiştirir.
- `/yetiskin`: 28 kısa ders; dinleme, 5 soruluk deneme, sonuç, tekrar ve ilerleme.
- `/cocuk`: aynı kaynaklara bağlı küçük görevler, sesli yönerge, ayrı çocuk profilleri ve yalnız ilk başarılı tamamlamada yıldız.
- `/cocuk/oyunlar`: balonla harf bulma, harflerin birleşik biçimlerini eşleştirme ve hareke oyunu.
- `/yetiskin/videolar` ve `/cocuk/videolar`: 20 kaynak video, ayrı Türkçe/Almanca anlam kayıtları ve öz değerlendirme olarak ezber işareti.

## Çalıştırma

Windows’ta `SiteyiAc.cmd` dosyasına çift tıkla. Yerel sunucu başlar ve site varsayılan tarayıcıda açılır. Siteyi kullanırken açılan pencereyi açık tut; kapatmak için `Ctrl+C` kullan. Node.js ve proje bağımlılıkları yüklü olmalıdır.

`index.html` dosyasını doğrudan açmak uygulamayı çalıştırmaz: React/JSX kodunun Vite tarafından işlenmesi, kitap verilerinin ve medyanın HTTP üzerinden sunulması gerekir. Doğrudan dosya açılışında bu nedenle başlatma yönergesi gösterilir.

```powershell
npm install
npm run dev
```

Geliştirme adresi varsayılan olarak `http://localhost:3000`.

```powershell
npm run check:content
npm test
npm run build
npm run check:dist
npm run preview -- --port 3001
```

Üretim önizlemesi çalışırken HTTP kontrolü:

```powershell
node scripts/verify-dist.mjs http://localhost:3001
```

## İçerik ve ilerleme

E-kitapta harf kartları üzerine gelindiğinde köşe işaretleri görünür. Tek tek dokunulan kısa Arapça harf/okuma örnekleri oynatıcı açmadan çalar. Uzun ses kayıtları sürüklenebilir cam mini oynatıcıda dinlenir. Sure ve ayetlerdeki video alanları orijinal MP4 dosyasını cam video penceresinde açar; oynat/duraklat, zaman çizelgesi, ses, hız, tam ekran ve desteklenen tarayıcılarda resim içinde resim kontrolleri bulunur. Mini oynatıcı boş kenarları tercih eder; dar ekranlarda kitapla alt kontroller arasında yer ayrılır. Tutamacı sürükleyerek veya odaktayken ok tuşlarıyla taşıyabilir, nişangâh düğmesiyle yeniden boş alana yerleştirebilirsin.

`data/pages_metadata.json` kitabın sayfa/medya eşleştirmelerini içerir. `src/data/learningData.js` dersleri bu kaynak alanlarına bağlar. Kelime veya birkaç okunuş içeren kaynak kayıtlar, aynı kaynak görseliyle birlikte sunulur; bunlar tek hecelik kayıt gibi gösterilmez.

İlerleme tarayıcıdaki `elifba:learning:v2` kaydında profile göre saklanır. Başarı için beş soruda en az dört yardımsız doğru gerekir. İpucuyla yanıtlanan sorular tekrar listesine girer. Eski ezber işaretleri öz değerlendirme olarak taşınır; eski çocuk tamamlamaları ölçülmüş başarıya dönüştürülmez.

Çocuk yönergesi tarayıcının konuşma sentezini kullanır. Ses ve okunuş örnekleri yerel kaynak dosyalarıdır. Oyun sesleri görünür dinleme düğmesinden başlatılır. İlerleme cihazlar arasında eşitlenmez.

## Yayın paketi

`npm run build`, `scripts/runtime-assets.mjs` ile kullanılan medya dosyalarını belirler ve yalnızca bunları, sayfa verilerini ve uygulamayı `dist/` içine kopyalar. Yaklaşık 438 MiB medya açılışta topluca indirilmez. Eski Flash dosyaları, kullanılmayan görseller, eski tanıtım sayfaları, geliştirme belgeleri ve önbellekler yayınlanmaz. Kaynak kapak yalnız ana sayfada kullanılır.

Doğrudan ders ve kitap bağlantıları için statik sunucu, mevcut dosyaları normal sunmalı ve diğer yolları `index.html` dosyasına yönlendirmelidir. `public/_redirects` ve Apache için `public/.htaccess` örnekleri pakete dahil edilir. MP4 dosyalarında byte-range istekleri desteklenmelidir.

## Kapsam

İlk çalışan sürüm; harfler, birleşik biçimler, harekeler ve kitabın diğer okuma kuralları için 28 ders içerir. Temel bilgiler 7 sesli kaynak kartında; sure ve dualar video kütüphanesinde sunulur. Kapsamlı pedagojik inceleme, segment bazlı ezber alıştırmaları, gerçek cihaz/pilot çalışması, hesaplar ve çevrimdışı paketler sonraki aşamalardır.

- [Orijinal kaynak](https://elifba.ditib-akademie.de/)

## GitHub Pages

Hedef: https://hakansirints.github.io/elifba/

Kaynak kod `main`, derlenmiş yayın paketi `gh-pages` dalındadır. Depo ayarlarında Pages kaynağı **Deploy from a branch → gh-pages → / (root)** olarak seçilir. Güncellemek için değişiklikleri commit ettikten sonra `npm run publish:pages` çalıştırılır; betik testleri ve medya kontrolünü çalıştırır, `/elifba/` taban yoluyla derler ve iki dalı gönderir. Pages sürümünde doğrudan kitap ve ders bağlantılarının yenilenebilmesi için `#/e-kitap/sayfa/61` biçiminde adresler kullanılır. Yerel geliştirmede normal yollar kullanılır.

Site geneli açık/koyu modu üstteki güneş/ay düğmesinden seçilir ve cihazda saklanır. e-Kitap içindeki soru işareti, yalnız okuyucunun özelliklerini anlatan kullanım kılavuzunu açar. Mobilde tek sayfa, dokunma ve sürükleme hareketleri, açılır dizin ve ekran boyutuna uyarlanan cam kontroller kullanılır. İlk beş eski tanıtım sayfası okuyucuya dahil değildir; kalan sayfaların kaynak numaraları ders ve medya eşleştirmeleri için korunur.
