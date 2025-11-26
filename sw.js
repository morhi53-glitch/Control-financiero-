const CACHE_NAME = 'finmar-v1';
const ASSETS = ['./','./index.html','./manifest.json','./css/style.css','./js/app.js','./js/pwa.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
