<?php
/**
 * QUANTUM CUT — PWA Offline Service Worker (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
header('Service-Worker-Allowed: /');
?>
const CACHE_NAME = 'physics-society-v2.2-offline';
const PRECACHE_ASSETS = [
    '/',
    '/index.php',
    '/css/style.css.php',
    '/js/app.js.php',
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
    '/assets/favicon.svg',
    '/assets/quantum-cut-logo.svg',
    '/api/system/version'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('Some assets could not be pre-cached:', err);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Cache-first strategy for static assets, network-first for live API
    const url = new URL(event.request.url);
    const isApi = url.pathname.startsWith('/api/');

    if (isApi) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then((cached) => {
                        if (cached) return cached;
                        return new Response(
                            JSON.stringify({ offline: true, detail: 'دسترسی آفلاین: داده‌ها پس از اتصال همگام‌سازی خواهند شد.' }),
                            { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
                        );
                    });
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    }
                    return response;
                });
            })
        );
    }
});
