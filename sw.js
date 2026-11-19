// Çevrimdışı çalışma: sayfaları önbelleğe alır. Önce ağ, olmazsa önbellek.
const SURUM = "yz-v4";
const KABUK = ["./", "index.html", "1-parcalama.html", "2-sonraki-kelime.html", "3-zaman.html", "4-uydurma.html",
  "kendi-modelin.html", "sinir-agi.html", "soru-sorma.html", "anlam-haritasi.html", "dikkat.html", "iyi-cevap.html",
  "resim-uretme.html", "onyargi.html",
  "ortak.css", "ortak.js", "manifest.webmanifest", "ikon.svg", "ikon-192.png", "ikon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const kopya = r.clone(); caches.open(SURUM).then(c => c.put(e.request, kopya)); }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
