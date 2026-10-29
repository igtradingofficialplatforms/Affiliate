// Minimal service worker. Network-first; do not cache account or payment data.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) return;
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
