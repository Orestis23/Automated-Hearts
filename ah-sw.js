/* Automated Hearts Round 1107 — retire legacy service-worker cache. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
/* Intentionally no fetch interception. Vite/HTTP caching owns delivery now. */
