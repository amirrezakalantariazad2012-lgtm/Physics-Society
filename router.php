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

// 2. Backward compatibility: if an old .html simulator link is accessed, resolve to .php
if (str_starts_with($uri, '/simulators/') && str_ends_with($uri, '.html')) {
    $phpUri = substr($uri, 0, -5) . '.php';
    if (is_file(__DIR__ . $phpUri)) {
        require __DIR__ . $phpUri;
        exit;
    }
}

// 3. Direct PHP Script Execution (e.g. /simulators/phet/*.php)
$filePath = __DIR__ . $uri;
if (is_file($filePath)) {
    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    
    if ($ext === 'php' && $filePath !== __DIR__ . '/index.php' && $filePath !== __DIR__ . '/router.php') {
        require $filePath;
        exit;
    }

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
        'pdf' => 'application/pdf',
    ];

    if (isset($mimes[$ext])) {
        header('Content-Type: ' . $mimes[$ext]);
    }
    readfile($filePath);
    exit;
}

// 4. Fallback to Single Page Application
require __DIR__ . '/index.php';
