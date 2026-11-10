<?php
/**
 * QUANTUM CUT — PWA Offline Service Worker (Pure PHP Edition)
 * v5 · Observatory release
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
header('Service-Worker-Allowed: /');
header('Cache-Control: no-cache, must-revalidate');
?>
const CACHE_NAME = 'physics-society-v5-observatory';
const CACHE_PREFIX = 'physics-society-';

const PRECACHE_ASSETS = [
    '/',
    '/index.php',
    '/css/style.css.php',
    '/js/store.js.php',
    '/js/api.js.php',
    '/js/components/ui.js.php',
    '/js/components/navbar.js.php',
    '/js/components/physics_simulators.js.php',
    '/js/components/pvp_duel_view.js.php',
    '/js/components/guild_view.js.php',
    '/js/components/adaptive_exam_view.js.php',
    '/js/components/mobile_sensor_lab.js.php',
    '/js/components/lab_data_logger.js.php',
    '/js/components/handwriting_grader_view.js.php',
    '/js/components/olympiad_hint_modal.js.php',
    '/js/components/teacher_heatmap_view.js.php',
    '/js/components/printable_exam_view.js.php',
    '/js/app.js.php',
    '/assets/favicon.svg',
    '/assets/quantum-cut-logo.svg',
    '/api/system/version'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Individual failures must not abort the installation.
            return Promise.all(
                PRECACHE_ASSETS.map((url) => cache.add(url).catch(() => null))
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.map((key) => (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) ? caches.delete(key) : null)
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Live API: network first, graceful offline envelope.
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).catch(() => caches.match(request).then((cached) => cached || new Response(
                JSON.stringify({ offline: true, detail: 'دسترسی آفلاین: داده‌ها پس از اتصال همگام‌سازی خواهند شد.' }),
                { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            )))
        );
        return;
    }

    // Navigations: network first so a redeploy is picked up immediately.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put('/', copy)).catch(() => null);
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
        );
        return;
    }

    // Static assets: stale-while-revalidate (fast + self-updating).
    event.respondWith(
        caches.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => null);
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});
