const CACHE_NAME = 'wineshop-v1';
const ASSETS = [
    './',
    './index.html',
    './css/estilos_wineshop.css',
    './js/main.js',
    './js/geo.js',
    './db.json'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});