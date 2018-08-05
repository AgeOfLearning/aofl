const CACHE_PREFIX = 'aofljs-app';
const CACHE_VERSION = '__version__placeholder__';
const CACHE_NAME = CACHE_PREFIX + '-' + CACHE_VERSION;
const assets = [__assets__placeholder__];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(assets))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
      .catch((e) => {
        return fetch(event.request.url);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
    .then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName.indexOf(CACHE_PREFIX) === 0 && cacheName !== CACHE_NAME) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});
