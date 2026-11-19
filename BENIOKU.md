# Yapay Zekâ Nasıl Düşünür?

Yapay zekânın nasıl çalıştığını Türkçe, etkileşimli deneylerle anlatan ücretsiz site.
Adres: https://devoniq.github.io/yz-nasil/

## Dosyalar
Deney listesi, bölümler ve sıra **`ortak.js` içindeki `MODULLER`** dizisinden yönetilir. Ana sayfa kartları, "Deney X / Y" etiketleri ve ileri/geri bağlantıları buradan otomatik oluşur.

| Bölüm | Dosya | Deney |
|---|---|---|
| Temeller | `1-parcalama.html` | Metin nasıl parçalanır (gerçek tokenizer, `lib/o200k_base.js`) |
| | `anlam-haritasi.html` | Kelimeler nasıl sayıya dönüşür (embedding) |
| | `2-sonraki-kelime.html` | Sonraki kelime, olasılık, sıcaklık (minik n-gram modeli) |
| | `dikkat.html` | Dikkat mekanizması |
| | `3-zaman.html` | Soru → cevap zaman çizelgesi |
| Makine nasıl öğrenir | `sinir-agi.html` | Tarayıcıda eğitilen gerçek sinir ağı |
| | `kendi-modelin.html` | Çizim tanıyan model (en yakın komşu) |
| | `iyi-cevap.html` | İnsan geri bildirimi (RLHF) oyunu |
| Günlük hayat | `soru-sorma.html` | İyi istem yazma |
| | `resim-uretme.html` | Difüzyon: gürültüden resme |
| | `onyargi.html` | Kurt/köpek önyargı deneyi |
| Bilinçli kullanım | `4-uydurma.html` | Uydurma oyunu |
| | `insan-mi-yz-mi.html` | İnsan mı yapay zekâ mı + sahte içerik |
| | `gizlilik.html` | Yapay zekâya ne yazılmaz |
| Ek | `sozluk.html`, `ogretmenler.html` | Sözlük, öğretmen ders planları |

Ortak: `ortak.css`, `ortak.js` (tema, testler, deney listesi), `sw.js` + `manifest.webmanifest` (çevrimdışı/PWA).

## Yeni deney eklemek
1. Var olan bir deney sayfasını kopyala, `<body data-sayfa="yeni-id">` yap.
2. `ortak.js` → `MODULLER` listesine bir satır ekle (id, dosya, bölüm, süre, ad, özet).
3. `sw.js` içindeki listeye dosyayı ekle, `SURUM` değerini artır.
4. `ogretmenler.html` → `PLANLAR` içine kazanım ve tartışma sorularını ekle.

## Değişiklik yayınlamak
```
git add -A
git commit -m "Açıklama"
git push
```
GitHub Pages 1-2 dakika içinde günceller.

## Kendi alan adına taşıma (ileride)
1. Alan adını al (ör. ornek.com.tr).
2. Alan adı firmasının DNS panelinde `www` için CNAME kaydı ekle: `devoniq.github.io`
   (çıplak alan adı için GitHub'ın 4 A kaydı: 185.199.108.153, .109.153, .110.153, .111.153).
3. GitHub → depo → Settings → Pages → Custom domain alanına alan adını yaz, "Enforce HTTPS"i işaretle.
4. Sayfalardaki `og:image` adreslerini yeni alan adıyla değiştir (paylaşım önizlemesi için).

Eski `devoniq.github.io/yz-nasil` adresi yeni alan adına kendiliğinden yönlenir. Site göreli bağlantılarla yazıldığı için başka bir değişiklik gerekmez.

## Lisanslar
Parçalayıcı: gpt-tokenizer (MIT) — `lib/LICENSE-gpt-tokenizer.txt`
