# Yapay Zekâ Nasıl Düşünür?

Yapay zekânın nasıl çalıştığını Türkçe, etkileşimli deneylerle anlatan ücretsiz site.
Adres: https://devoniq.github.io/yz-nasil/

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Ana sayfa |
| `1-parcalama.html` | Deney 1: Metin nasıl parçalanır (gerçek tokenizer, `lib/o200k_base.js`) |
| `2-sonraki-kelime.html` | Deney 2: Minik dil modeli, olasılıklar, yaratıcılık ayarı |
| `3-zaman.html` | Deney 3: Soru → cevap zaman çizelgesi |
| `4-uydurma.html` | Deney 4: Uydurma oyunu |
| `ortak.css`, `ortak.js` | Ortak görünüm, tema düğmesi, mini testler |
| `sw.js`, `manifest.webmanifest` | Çevrimdışı çalışma ve telefona yükleme |

## Değişiklik yayınlamak
```
git add -A
git commit -m "Açıklama"
git push
```
GitHub Pages 1-2 dakika içinde günceller. Sayfa eklendiyse `sw.js` içindeki listeye ekleyip `SURUM` değerini artır.

## Kendi alan adına taşıma (ileride)
1. Alan adını al (ör. ornek.com.tr).
2. Alan adı firmasının DNS panelinde `www` için CNAME kaydı ekle: `devoniq.github.io`
   (çıplak alan adı için GitHub'ın 4 A kaydı: 185.199.108.153, .109.153, .110.153, .111.153).
3. GitHub → depo → Settings → Pages → Custom domain alanına alan adını yaz, "Enforce HTTPS"i işaretle.
4. Sayfalardaki `og:image` adreslerini yeni alan adıyla değiştir (paylaşım önizlemesi için).

Eski `devoniq.github.io/yz-nasil` adresi yeni alan adına kendiliğinden yönlenir. Site göreli bağlantılarla yazıldığı için başka bir değişiklik gerekmez.

## Lisanslar
Parçalayıcı: gpt-tokenizer (MIT) — `lib/LICENSE-gpt-tokenizer.txt`
