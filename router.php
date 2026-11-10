<?php
/**
 * QUANTUM CUT — Local PHP Development Router (100% Pure PHP Edition)
 * Run with: php -S 127.0.0.1:8000 router.php
 */

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri = is_string($uri) ? rawurldecode($uri) : '/';

// 0. Hardening: never serve dotfiles, private folders or storage artefacts.
$blockedPrefixes = ['/.git', '/.backup', '/.github', '/backend', '/data', '/deploy'];
foreach ($blockedPrefixes as $prefix) {
    if ($uri === $prefix || str_starts_with($uri, $prefix . '/')) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Not found';
        exit;
    }
}

$blockedExtensions = ['env', 'db', 'sqlite', 'sqlite3', 'db-wal', 'db-shm', 'log', 'ini', 'bak', 'sql', 'tar', 'gz', 'zip', 'sh', 'yml', 'yaml', 'lock'];
foreach ($blockedExtensions as $blockedExt) {
    if (strtolower(pathinfo($uri, PATHINFO_EXTENSION)) === $blockedExt) {
        // Study materials may legitimately be ZIP archives, served only through the gateway.
        if (!str_starts_with($uri, '/uploads/')) {
            http_response_code(404);
            header('Content-Type: text/plain; charset=utf-8');
            echo 'Not found';
            exit;
        }
    }
}

// 1. Direct API Routes
if (str_starts_with($uri, '/api')) {
    require __DIR__ . '/api/index.php';
    exit;
}

// 1b. Uploaded study materials are streamed through the PHP gateway
if (str_starts_with($uri, '/uploads/')) {
    $_GET['f'] = substr($uri, strlen('/uploads/'));
    require __DIR__ . '/uploads.php';
    exit;
}

// 2. Backward compatibility: legacy .html / .js / .css links resolve to .php
$filePath = __DIR__ . $uri;
if (!is_file($filePath)) {
    if (is_file($filePath . '.php')) {
        require $filePath . '.php';
        exit;
    }
    if (str_starts_with($uri, '/simulators/') && str_ends_with($uri, '.html')) {
        $simPhp = __DIR__ . substr($uri, 0, -5) . '.php';
        if (is_file($simPhp)) {
            require $simPhp;
            exit;
        }
    }
}

// 3. PHP entry scripts only (application code never lives behind static requests)
if (is_file($filePath)) {
    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

    if ($ext === 'php' && $filePath !== __DIR__ . '/index.php' && $filePath !== __DIR__ . '/router.php') {
        require $filePath;
        exit;
    }

    // Allow-list of genuinely public static assets.
    $publicAssets = ['svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'otf', 'apk', 'pdf', 'md', 'txt', 'csv'];
    if (!in_array($ext, $publicAssets, true)) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Not found';
        exit;
    }

    $mimes = [
        'json' => 'application/json',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'otf' => 'font/otf',
        'apk' => 'application/vnd.android.package-archive',
        'pdf' => 'application/pdf',
        'md' => 'text/markdown; charset=utf-8',
        'txt' => 'text/plain; charset=utf-8',
        'csv' => 'text/csv; charset=utf-8',
    ];

    header('X-Content-Type-Options: nosniff');
    header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
    readfile($filePath);
    exit;
}

// 4. Fallback to Single Page Application
require __DIR__ . '/index.php';
