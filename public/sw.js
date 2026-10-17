const CACHE_NAME = 'misincol-pdm-cache-v2';
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/img/misincol.png',
  '/img/6ccf873cb76d7a5e6651271758e7ce81.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CRITICAL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET, chrome-extension, or dev websockets
  if (
    event.request.method !== 'GET' ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:' ||
    url.protocol === 'chrome-extension:'
  ) {
    return;
  }

  // 1. Cache-First para assets inmutables (JS, CSS, imágenes, fuentes)
  // Permite arranque instantáneo (<15ms) en redes débiles o sin conexión
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/img/') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 2. Network-with-Timeout (1200ms) para navegación y documentos HTML
  // Si la red es lenta o se cuelga, responde de inmediato con la versión en caché
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      new Promise((resolve) => {
        let didTimeOut = false;
        const timer = setTimeout(() => {
          didTimeOut = true;
          caches.match('/index.html').then((cached) => {
            if (cached) resolve(cached);
          });
        }, 1200);

        fetch(event.request)
          .then((response) => {
            clearTimeout(timer);
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
            }
            if (!didTimeOut) resolve(response);
          })
          .catch(() => {
            clearTimeout(timer);
            caches.match('/index.html').then((cached) => {
              if (cached) resolve(cached);
              else resolve(new Response('Modo sin conexión', { status: 200, headers: { 'Content-Type': 'text/plain' } }));
            });
          });
      })
    );
    return;
  }

  // 3. Estrategia por defecto: Red con fallback a caché
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
