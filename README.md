# Türkiye Dioramaları

Three.js ile yapılmış, sinematik kameralı low-poly Türkiye dioramaları. Altı sahne: Kadıköy İskelesi, Galata, Kiraz Sokak (yağmurlu gece), Göreme, Bursa (Ulu Cami ve Koza Han), Ramazan'da Sultanahmet Meydanı (Sultanahmet Camii ile Ayasofya karşı karşıya). Sahnelerde eklemli, animasyonlu insanlar yürüyor, oturuyor, sohbet ediyor, alışveriş yapıyor; araçlar şeritlerde birbirini takip edip ışıkta duruyor.

## Çalıştırma

Tarayıcı ES modüllerini `file://` üzerinden yüklemediği için `index.html` çift tıklanarak açılmaz. Klasörde küçük bir sunucu başlatın:

```bash
npx serve .
# ya da
python -m http.server 8080
```

Ardından `http://localhost:3000` (serve) ya da `http://localhost:8080` (python) adresini açın. Three.js r160 jsDelivr üzerinden yüklenir; internet bağlantısı gerekir.

`main` dalına her push, `.github/workflows/pages.yml` ile GitHub Pages'e dağıtır (depo ayarlarında Pages → Source: GitHub Actions seçili olmalı).

## Kontroller

- Alttaki şerit: sahne seçimi · Sürükle / tekerlek: serbest kamera (C sinematik moda döner)
- ← →: sahne değiştir · Boşluk: duraklat · F: tam ekran
- `#s1` … `#s6` ile belirli sahneden başlar; `?debug=1` ile konsolda `__dio.overlaps(i)` çakışma raporu ve `__dio.soak(sn)` kalabalık testi çalışır

## Yapı

| Dosya | İçerik |
|---|---|
| `index.html` | Arayüz, stil, importmap |
| `js/main.js` | Renderer, kontur efekti, sinematik kamera, sahne geçişleri, arka planda sahne kurma, debug araçları |
| `js/kit.js` | Yardımcılar, malzemeler, ilkel geometriler, doku üretimi, statik geometriyi birleştirme (`bake`) |
| `js/people.js` | Instanced chibi insanlar: vertex shader'da eklemli uzuvlar (kalça/diz, omuz/dirsek, boyun), 18 duruş (yürü, koş, otur, telefon, sohbet, selfie, balık tut…), yol takibi, takip/yan adım/itme ile çakışma önleme, `chat()` grupları |
| `js/props.js` | Binalar, pencereler, dükkânlar, ağaçlar, sokak mobilyası, hayvanlar |
| `js/dyn.js` | `Lane` şeritli trafik (takip mesafesi, kırmızı ışıkta durma), `signal` ışık döngüsü, tramvay, vapur, kuşlar, bayraklar, su, partiküller, ışık |
| `js/scenes/*.js` | Her sahnenin tanımı (kamera planları, yerleşim, insan yolları) |

Yeni sahne eklemek için `js/scenes/` altına bir dosya yazıp `js/main.js` içindeki `DEFS` listesine eklemek yeterli.
