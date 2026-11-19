// Yapay Zekâ Nasıl Düşünür? — tüm sayfaların ortak davranışları.
// Bu site hiçbir veri toplamaz: yazdıklarınız tarayıcınızdan dışarı çıkmaz.

const YZ = (() => {
  // --- Küçük saklama yardımcıları (gizli pencerede çalışmayabilir, sorun değil) ---
  const sakla = {
    al(k){ try { return localStorage.getItem(k); } catch { return null; } },
    koy(k, v){ try { localStorage.setItem(k, v); } catch {} },
  };

  const azHareket = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Açık / koyu tema düğmesi ---
  const GUNES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const AY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
  function koyuMu(){
    const t = document.documentElement.dataset.theme;
    if (t) return t === "dark";
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function temaDugmesi(){
    const d = document.querySelector(".tema-dugme");
    if (!d) return;
    const ciz = () => {
      const k = koyuMu();
      d.innerHTML = k ? GUNES : AY;
      d.setAttribute("aria-label", k ? "Açık temaya geç" : "Koyu temaya geç");
      d.title = d.getAttribute("aria-label");
    };
    ciz();
    d.addEventListener("click", () => {
      const yeni = koyuMu() ? "light" : "dark";
      document.documentElement.dataset.theme = yeni;
      sakla.koy("tema", yeni);
      ciz();
      document.dispatchEvent(new CustomEvent("tema-degisti"));
    });
  }

  // --- Mini test ---
  // <script type="application/json" class="test-veri" data-modul="1">[{soru, secenekler:[], dogru:0, aciklama}]</script>
  function testleriKur(){
    document.querySelectorAll("script.test-veri").forEach(el => {
      const sorular = JSON.parse(el.textContent);
      const modul = el.dataset.modul;
      const kap = document.createElement("div");
      kap.className = "test";
      let cevaplanan = 0, dogruSayisi = 0;
      const sonuc = document.createElement("p");
      sonuc.className = "test-sonuc";
      sonuc.setAttribute("aria-live", "polite");

      sorular.forEach((s, i) => {
        const kutu = document.createElement("div");
        kutu.className = "test-soru";
        const p = document.createElement("p");
        p.className = "soru";
        p.textContent = `${i + 1}. ${s.soru}`;
        const sec = document.createElement("div");
        sec.className = "secenekler";
        const gb = document.createElement("p");
        gb.className = "geri-bildirim";
        gb.setAttribute("aria-live", "polite");
        // Şıkları karıştır: doğru cevap hep aynı yerde olmasın.
        const sira = s.secenekler.map((_, j) => j);
        for (let a = sira.length - 1; a > 0; a--) { const b = Math.floor(Math.random() * (a + 1)); [sira[a], sira[b]] = [sira[b], sira[a]]; }
        sira.forEach(j => {
          const metin = s.secenekler[j];
          const b = document.createElement("button");
          b.type = "button";
          b.className = "secenek";
          b.textContent = metin;
          b.addEventListener("click", () => {
            sec.querySelectorAll("button").forEach(x => x.disabled = true);
            sec.children[sira.indexOf(s.dogru)].classList.add("dogru");
            const bildi = j === s.dogru;
            if (!bildi) b.classList.add("yanlis");
            gb.textContent = (bildi ? "✓ Doğru! " : "✗ Tam değil. ") + s.aciklama;
            cevaplanan++; if (bildi) dogruSayisi++;
            if (cevaplanan === sorular.length) {
              sonuc.textContent = `Sonuç: ${sorular.length} sorudan ${dogruSayisi} doğru. ` +
                (dogruSayisi === sorular.length ? "Harika! 🎉" : "Deneye bir daha göz atabilirsin.");
              sakla.koy("tamam-" + modul, "1");
            }
          });
          sec.appendChild(b);
        });
        kutu.append(p, sec, gb);
        kap.appendChild(kutu);
      });
      kap.appendChild(sonuc);
      el.after(kap);
    });
  }

  // --- Çevrimdışı çalışma ---
  function hizmetCalisani(){
    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  // Sayı biçimi: 1.234 / 0,8
  const sayi = (n, b = 0) => n.toLocaleString("tr-TR", {minimumFractionDigits: b, maximumFractionDigits: b});

  // --- Deney listesi: ana sayfa, etiketler ve ileri/geri bağlantıları buradan üretilir ---
  // Yeni deney eklemek için: listeye bir satır ekle (hazir: true), sayfada <body data-sayfa="id"> kullan.
  const BOLUMLER = [
    {ad: "Temeller", alt: "Yapay zekâ metni nasıl görür ve cevabı nasıl kurar?"},
    {ad: "Makine nasıl öğrenir?", alt: "Bir bilgisayar programı “öğrenmeyi” nasıl başarır?"},
    {ad: "Günlük hayatta yapay zekâ", alt: "Yapay zekâyı daha iyi kullanmak için bilmen gerekenler."},
    {ad: "Bilinçli kullanım", alt: "Yanılmamak, kandırılmamak ve kendini korumak için."},
  ];
  const MODULLER = [
    {id: "1", d: "1-parcalama.html", b: 0, sure: 5, ad: "Metin nasıl parçalanır?",
      ozet: "Yapay zekâ kelimeleri değil, “token” denen parçaları görür. Yazdığın cümlenin nasıl bölündüğünü izle."},
    {id: "anlam", d: "anlam-haritasi.html", b: 0, sure: 6, ad: "Kelimeler nasıl sayıya dönüşür?",
      ozet: "Anlamı yakın kelimeler haritada yan yana durur. Kelimelerin “adresini” keşfet."},
    {id: "2", d: "2-sonraki-kelime.html", b: 0, sure: 7, ad: "Sonraki kelime nasıl seçilir?",
      ozet: "Olasılıklar, zar atmak ve “yaratıcılık” ayarı. Minik bir dil modeliyle kendi cümleni kur."},
    {id: "dikkat", d: "dikkat.html", b: 0, sure: 5, ad: "Model neye dikkat eder?",
      ozet: "“O” kelimesi kimi kastediyor? Modelin bir kelimeyi anlamak için hangi kelimelere baktığını gör."},
    {id: "3", d: "3-zaman.html", b: 0, sure: 5, ad: "Soruyu sorduktan sonra ne oluyor?",
      ozet: "Cevap neden kelime kelime akıyor? Bekleme, okuma ve yazma aşamalarını zaman çizelgesinde gör."},
    {id: "sinir", d: "sinir-agi.html", b: 1, sure: 8, ad: "Canlı sinir ağı",
      ozet: "Noktaları yerleştir, küçük bir yapay sinir ağının onları ayırmayı öğrenişini canlı izle."},
    {id: "egit", d: "kendi-modelin.html", b: 1, sure: 8, ad: "Kendi modelini eğit",
      ozet: "Birkaç şekil çiz, modele öğret, sonra yeni çizimini tahmin etmesini izle."},
    {id: "geribildirim", d: "iyi-cevap.html", b: 1, sure: 6, ad: "İyi cevabı sen seç",
      ozet: "Sohbet botları nasıl kibar ve yardımsever olmayı öğrenir? Öğretmenlik sırası sende."},
    {id: "soru", d: "soru-sorma.html", b: 2, sure: 7, ad: "İyi soru sorma sanatı",
      ozet: "Aynı istek, iki farklı yazım, iki farklı cevap. Parçaları birleştirerek iyi bir istek kur."},
    {id: "resim", d: "resim-uretme.html", b: 2, sure: 5, ad: "Resim üreten yapay zekâ",
      ozet: "Resim, gürültüden adım adım nasıl ortaya çıkar? Kaydırıcıyla izle."},
    {id: "onyargi", d: "onyargi.html", b: 2, sure: 6, ad: "Yapay zekâ neden önyargılı olabilir?",
      ozet: "Eğitim verisini değiştir, modelin kararlarının nasıl çarpıklaştığını gör."},
    {id: "4", d: "4-uydurma.html", b: 3, sure: 6, ad: "Yapay zekâ neden uydurur?",
      ozet: "Bir oyunda yapay zekânın yerine geç ve var olmayan bir şey hakkında inandırıcı bir cevap üret."},
    {id: "kim", d: "insan-mi-yz-mi.html", b: 3, sure: 5, ad: "İnsan mı yazdı, yapay zekâ mı?",
      ozet: "Metinleri oku, kimin yazdığını tahmin et. Ayırt etmek sandığından zor."},
    {id: "gizlilik", d: "gizlilik.html", b: 3, sure: 5, ad: "Yapay zekâya ne yazmamalı?",
      ozet: "Şifre, kimlik numarası, sağlık bilgisi… Senaryolarla güvenli kullanımı öğren."},
  ];
  const hazirlar = () => MODULLER.filter(m => !m.taslak);

  function sayfaParcalari(){
    const id = document.body.dataset.sayfa;
    if (!id) return;
    const liste = hazirlar();
    const i = liste.findIndex(m => m.id === id);
    if (i < 0) return;
    const m = liste[i];
    const et = document.querySelector(".etiket[data-oto]");
    if (et) et.textContent = `${BOLUMLER[m.b].ad} · Deney ${i + 1} / ${liste.length} · yaklaşık ${m.sure} dakika`;
    const nav = document.querySelector(".ileri-geri[data-oto]");
    if (nav) {
      const once = liste[i - 1], sonra = liste[i + 1];
      nav.innerHTML =
        (once ? `<a href="${once.d}"><small>← Önceki deney</small>${once.ad}</a>` : "") +
        (sonra ? `<a class="sonraki" href="${sonra.d}"><small>Sonraki deney →</small>${sonra.ad}</a>`
               : `<a class="sonraki" href="./"><small>Hepsini bitirdin! 🎉</small>Ana sayfaya dön</a>`);
    }
  }

  // Alt bilgiye ek kaynak bağlantıları
  function altBilgi(){
    const f = document.querySelector("footer.alt");
    if (!f || f.querySelector(".ek-baglanti")) return;
    const p = document.createElement("p"); p.className = "ek-baglanti";
    p.innerHTML = '<a href="./">Tüm deneyler</a> · <a href="sozluk.html">Sözlük</a> · <a href="ogretmenler.html">Öğretmenler için</a>';
    f.prepend(p);
  }

  document.addEventListener("DOMContentLoaded", () => {
    altBilgi();
    temaDugmesi();
    sayfaParcalari();
    testleriKur();
    hizmetCalisani();
  });

  return { sakla, azHareket, sayi, BOLUMLER, MODULLER, hazirlar };
})();
