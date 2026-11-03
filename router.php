<?php
/**
 * QUANTUM CUT — Local PHP Development Router
 * Run with: php -S 127.0.0.1:8000 router.php
 */

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// 1. Direct API Routes
if (str_starts_with($uri, '/api')) {
    require __DIR__ . '/api/index.php';
    exit;
}

// 2. Direct Static Files
$filePath = __DIR__ . $uri;
if (is_file($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'svg' => 'image/svg+xml',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'apk' => 'application/vnd.android.package-archive',
            'html' => 'text/html; charset=UTF-8',
            'pdf' => 'application/pdf',
        ];

        if (isset($mimes[$ext])) {
            header('Content-Type: ' . $mimes[$ext]);
        }
        readfile($filePath);
        exit;
    }

// 3. Fallback to Single Page Application
require __DIR__ . '/index.php';
