---
layout: null
permalink: /sw.js
---
/* Tres Gatos · service worker (app instalable y lectura sin conexión).
   La versión cambia sola con cada publicación del sitio. */
const VERSION = 'tg-{{ site.time | date: "%Y%m%d%H%M%S" }}';
const BASE = '{{ "/" | relative_url }}';
const BASICOS = [
  BASE,
  BASE + 'offline.html',
  BASE + 'posts.json',
  BASE + 'assets/css/estilos.css',
  BASE + 'assets/js/app.js',
  BASE + 'assets/img/iconos.svg',
  BASE + 'assets/img/logo/logo-negro.svg',
  BASE + 'assets/img/logo/logo-blanco.svg',
  BASE + 'assets/img/logo/marca-negro.svg',
  BASE + 'assets/fonts/staatliches.woff2',
  BASE + 'assets/fonts/crimson-pro-400.woff2',
  BASE + 'assets/fonts/crimson-pro-600.woff2',
  BASE + 'assets/fonts/crimson-pro-400-italic.woff2',
  BASE + 'assets/img/texturas/brochazo.png',
  BASE + 'assets/img/texturas/panel.png',
  BASE + 'assets/img/texturas/borde.png',
  BASE + 'assets/img/texturas/desgaste.png',
  BASE + 'assets/img/texturas/grano.png',
  BASE + 'assets/img/texturas/vetas.png'
];
const MAX_IMAGENES = 80;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('tg-') && k !== VERSION && k !== 'tg-imagenes').map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function recortar(nombre, max) {
  const c = await caches.open(nombre);
  const ks = await c.keys();
  for (let i = 0; i < ks.length - max; i++) await c.delete(ks[i]);
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Páginas y posts.json: primero la red (contenido fresco), si falla, la copia guardada.
  if (req.mode === 'navigate' || url.pathname.endsWith('posts.json')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copia = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copia));
        return res;
      }).catch(async () => (await caches.match(req)) || (req.mode === 'navigate' ? caches.match(BASE + 'offline.html') : Response.error()))
    );
    return;
  }

  // Imágenes: primero la copia guardada (rápido), si no existe, la red.
  if (req.destination === 'image') {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) {
          const copia = res.clone();
          caches.open('tg-imagenes').then((c) => c.put(req, copia)).then(() => recortar('tg-imagenes', MAX_IMAGENES));
        }
        return res;
      }))
    );
    return;
  }

  // Resto (CSS, JS, fuentes): copia guardada y actualización en segundo plano.
  e.respondWith(
    caches.match(req).then((hit) => {
      const red = fetch(req).then((res) => {
        if (res.ok) { const copia = res.clone(); caches.open(VERSION).then((c) => c.put(req, copia)); }
        return res;
      }).catch(() => hit);
      return hit || red;
    })
  );
});
