// 추억 우체국 service worker: the app opens offline after the first visit.
// - Pages and other plain files: network first, so a new deploy shows up on the next open; cached copy offline.
// - Build files under /_expo/ and /assets/ have a content hash in their names: cache first.
// - Google Fonts: cache first (the CSS is refreshed in the background).
// - Everything else on other hosts (the weather API) is left alone.
const CACHE = 'memorypost-v1';
const FONT_CSS = 'https://fonts.googleapis.com';
const FONT_FILES = 'https://fonts.gstatic.com';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const put = (key, res) => {
  // The host answers unknown paths with the page itself; never store that under a file's name.
  const html = (res.headers.get('content-type') || '').includes('text/html');
  if (html && key !== '/') return res;
  if (res.ok || res.type === 'opaque') {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(key, copy));
  }
  return res;
};

const networkFirst = (req, key) => fetch(req).then((res) => put(key, res)).catch(() => caches.match(key));
const cacheFirst = (req) => caches.match(req).then((hit) => hit || fetch(req).then((res) => put(req, res)));
const staleWhileRevalidate = (req) =>
  caches.match(req).then((hit) => {
    const fresh = fetch(req).then((res) => put(req, res));
    return hit || fresh;
  });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === FONT_FILES) return e.respondWith(cacheFirst(req));
  if (url.origin === FONT_CSS) return e.respondWith(staleWhileRevalidate(req));
  if (url.origin !== location.origin) return;

  // Every route is the same single page (index.html), so keep one copy of it.
  if (req.mode === 'navigate') return e.respondWith(networkFirst(req, '/'));
  if (url.pathname.startsWith('/_expo/') || url.pathname.startsWith('/assets/')) return e.respondWith(cacheFirst(req));
  e.respondWith(networkFirst(req, req));
});
