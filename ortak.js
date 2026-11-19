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

  document.addEventListener("DOMContentLoaded", () => {
    temaDugmesi();
    testleriKur();
    hizmetCalisani();
  });

  return { sakla, azHareket, sayi };
})();
