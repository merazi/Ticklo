const CACHE_NAME = "ticklo-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/styles/styles.css",
    "/js/main.js",
    "/img/logo_light.png",
    "/sounds/Ticklo-Notification.ogg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
