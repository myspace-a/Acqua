const CACHE_NAME = 'tracker-acqua-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/storage.js',
  './js/water.js',
  './js/backup.js',
  './js/main.js',
  './lib/xlsx.full.min.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installa e metti in cache i file
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Attiva e rimuovi vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Intercetta le richieste: prima cache, poi rete
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
