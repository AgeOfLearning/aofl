/* global workbox */
workbox.setConfig({
  debug: false,
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.cleanupOutdatedCaches();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
