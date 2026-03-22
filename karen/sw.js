const CACHE = 'karen-v10';
const SOUND_CACHE = 'karen-sounds-v1';
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
  './wifi.mjs',
  './firebase.mjs',
  './sounds.mjs',
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
      Promise.all(keys.filter(k => k !== CACHE && k !== SOUND_CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // Cache Google Drive sound files separately
  if (url.hostname === 'drive.google.com' || url.hostname === 'drive.usercontent.google.com') {
    e.respondWith(
      caches.open(SOUND_CACHE).then(cache =>
        cache.match(e.request).then(response => 
          response || fetch(e.request).then(res => {
            cache.put(e.request, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

// Preload sounds from scenes
self.addEventListener('message', e => {
  if (e.data.type === 'CACHE_SOUNDS') {
    e.waitUntil(
      caches.open(SOUND_CACHE).then(cache => 
        Promise.all(e.data.urls.map(url => 
          fetch(url).then(res => cache.put(url, res)).catch(() => {})
        ))
      )
    );
  }
});
