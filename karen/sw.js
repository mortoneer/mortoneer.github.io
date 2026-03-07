const CACHE = 'karen-v2';
const FILES = [
  './',
  './index.html',
  './show.html',
  './app.mjs',
  './show.mjs',
  './ui.mjs',
  './scenes.mjs',
  './states.mjs',
  './serial.mjs',
  './firebase.mjs',
  './style.css',
  './show.css'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
