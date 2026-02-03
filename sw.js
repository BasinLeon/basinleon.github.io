const CACHE_NAME = 'nexus-v1';
const ASSETS = [
  '/',
  '/crm_dashboard.html',
  '/crm_assets/style.css',
  '/crm_assets/app.js',
  '/leads_enriched_final.csv'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
