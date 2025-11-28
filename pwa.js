// Service Worker simple
const CACHE_NAME = 'finanzas-maritimas-v1';

self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});