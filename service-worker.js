// --- SERVICE WORKER V1.2 ---
// Increment this version number (e.g., v1.3) whenever you update style.css or your images.
const CACHE_NAME = 'sacred-steps-cache-v1.2';

// --- THE OFFLINE ASSETS LIST ---
// This tells the app exactly which files to 'save' to the phone for offline use.
const urlsToCache = [
  './',                  // Main App (index.html)
  './index.html',
  './poc-version.html',
  './logo.png',          // App Icon
  './css/style.css',     // All design rules
  './js/app.js',         // (Future) External JavaScript
  // Leaflet Map Files (Cached locally)
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  // Your Site Photos (Essential for offline viewing)
  './assets/images/jerusalem.jpg',
  './assets/images/capernaum.jpg',
  './assets/images/sea-of-galilee.jpg'
  // ADD ALL YOUR REMAINING SITE PHOTOS HERE!
];

// --- 1. INSTALLATION EVENT ---
// This runs once when the user first visits the app with internet.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Sacred Steps: Caching all offline assets.');
        return cache.addAll(urlsToCache);
      })
  );
});

// --- 2. ACTIVATION EVENT ---
// This runs when a new Service Worker version is detected. It cleans up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Sacred Steps: Removing outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// --- 3. FETCH EVENT (THE OFFLINE MAGIC) ---
// Every time the app asks for an image or file, this script intercepts the request.
// It tries to find the file in the phone's cache first. If it's there (offline), it loads it.
// If it's NOT in the cache, it tries the internet (online).
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit: return the cached file (works offline)
        if (response) {
          return response;
        }
        // Cache miss: go to the network (works online)
        return fetch(event.request);
      })
  );
});
