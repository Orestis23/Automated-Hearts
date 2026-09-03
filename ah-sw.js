/* Automated Hearts runtime cache — Round 1098
   Intentionally no bulk precache: first visits stay light. Static resources are cached
   only after the browser actually requests them. */
const CACHE_PREFIX = 'automated-hearts-';
const CACHE_NAME = `${CACHE_PREFIX}runtime-v1098`;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

const cacheableResponse = (response) => response && (response.ok || response.type === 'opaque');

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreVary: false });
  if (cached) return cached;
  const response = await fetch(request);
  if (cacheableResponse(response)) cache.put(request, response.clone()).catch(() => {});
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreVary: false });
  const network = fetch(request).then((response) => {
    if (cacheableResponse(response)) cache.put(request, response.clone()).catch(() => {});
    return response;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (cacheableResponse(response)) cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch (_) {
    return (await cache.match(request, { ignoreVary: false })) || Response.error();
  }
}

async function cacheAssistedNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreVary: false });
  const network = fetch(request).then((response) => {
    if (cacheableResponse(response)) cache.put(request, response.clone()).catch(() => {});
    return response;
  }).catch(() => null);

  /* First visits still use the network. Repeat visits stop waiting on a slow
     connection after a short grace period while the cache updates in the background. */
  if (!cached) return (await network) || Response.error();
  let timer;
  const timeout = new Promise((resolve) => { timer = setTimeout(() => resolve(null), 900); });
  const response = await Promise.race([network, timeout]);
  clearTimeout(timer);
  return response || cached;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  /* Do not interfere with unrelated third-party requests. Browser HTTP caching still applies. */
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(cacheAssistedNavigation(request));
    return;
  }

  const path = url.pathname.toLowerCase();
  if (/\.(?:webp|png|jpe?g|gif|svg|ico|woff2?|ttf|otf)$/.test(path) || path.includes('/models/') || path.includes('/vendor/')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (/\.(?:css|js)$/.test(path)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (/\.html$/.test(path)) {
    event.respondWith(networkFirst(request));
  }
});
