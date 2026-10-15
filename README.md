# Türkiye Dioramaları

Three.js ile yapılmış, sinematik kameralı low-poly Türkiye dioramaları. Altı sahne var: Kadıköy İskelesi, Galata, Kiraz Sokak (yağmurlu gece), Göreme, Bursa (Ulu Cami ve Koza Han), Ramazan'da Sultanahmet. Sahnelerde yürüyen, oturan ve alışveriş yapan animasyonlu insanlar dolaşıyor.

## Çalıştırma

Tarayıcı ES modüllerini `file://` üzerinden yüklemediği için `index.html` çift tıklanarak açılmaz. Klasörde küçük bir sunucu başlatın:

```bash
npx serve .
# ya da
python -m http.server 8080
```

Ardından tarayıcıda `http://localhost:3000` (serve) ya da `http://localhost:8080` (python) adresini açın. Three.js r160 jsDelivr üzerinden yüklenir, bu yüzden internet bağlantısı gerekir.

## Kontroller

- Alttaki şerit: sahne seçimi
- Sürükle / tekerlek: serbest kamera (C ile sinematik moda dönülür)
- ← →: sahne değiştir · Boşluk: duraklat · F: tam ekran
- Adres sonuna `#s1` … `#s6` eklenirse o sahneden başlar

## Yapı

| Dosya | İçerik |
|---|---|
| `index.html` | Arayüz, stil, importmap |
| `js/main.js` | Renderer, kontur efekti, sinematik kamera, sahne geçişleri, sahneleri arka planda kurma |
| `js/kit.js` | Yardımcılar, malzemeler, ilkel geometriler, doku üretimi, statik geometriyi birleştirme (`bake`) |
| `js/people.js` | Instanced, vertex shader'da animasyonlu chibi insanlar (yürü/otur/bak/fotoğraf/şemsiye…), yol takibi, çarpışmadan kaçınma |
| `js/props.js` | Binalar, pencereler, dükkânlar, ağaçlar, sokak mobilyası, hayvanlar |
| `js/dyn.js` | Araçlar, tramvay, vapur, kuşlar, bayraklar, su, partiküller, ışık |
| `js/scenes/*.js` | Her sahnenin tanımı (kamera planları, yerleşim, insan yolları) |

Yeni sahne eklemek için `js/scenes/` altına bir dosya yazıp `js/main.js` içindeki `DEFS` listesine eklemek yeterli.
