<?php
/**
 * QUANTUM CUT — Secure Study Material Download Gateway (Pure PHP Edition)
 * ------------------------------------------------------------------
 * Streams files stored under data/uploads through PHP so that the
 * application never exposes the storage tree directly, and so that
 * uploads keep working on Apache, Nginx and the PHP development server.
 */

declare(strict_types=1);

require_once __DIR__ . '/backend/config.php';

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: private, max-age=300');

$requested = isset($_GET['f']) ? (string) $_GET['f'] : '';
$requested = str_replace(["\0", '\\'], ['', '/'], $requested);
$requested = ltrim($requested, '/');

if ($requested === '') {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'درخواست نامعتبر است.';
    exit;
}

$allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip'];
$extension = strtolower(pathinfo($requested, PATHINFO_EXTENSION));
if (!in_array($extension, $allowedExtensions, true)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'نوع فایل مجاز نیست.';
    exit;
}

$baseDir = realpath(Config::getUploadDir());
if ($baseDir === false) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'مسیر فایل‌های بارگذاری‌شده یافت نشد.';
    exit;
}

$target = realpath($baseDir . DIRECTORY_SEPARATOR . $requested);
if ($target === false || !is_file($target) || !str_starts_with($target, $baseDir . DIRECTORY_SEPARATOR)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'فایل مورد نظر یافت نشد.';
    exit;
}

$mimeMap = [
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt' => 'application/vnd.ms-powerpoint',
    'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip' => 'application/zip',
];

$mime = $mimeMap[$extension] ?? 'application/octet-stream';
$filename = basename($target);
$disposition = in_array($extension, ['pdf'], true) ? 'inline' : 'attachment';

header('Content-Type: ' . $mime);
header('Content-Length: ' . (string) filesize($target));
header(
    'Content-Disposition: ' . $disposition . "; filename*=UTF-8''" .
    rawurlencode($filename) . '; filename="' . preg_replace('/[^A-Za-z0-9._-]/', '_', $filename) . '"'
);

if ($_SERVER['REQUEST_METHOD'] === 'HEAD') {
    exit;
}

$handle = fopen($target, 'rb');
if ($handle === false) {
    http_response_code(500);
    exit;
}
while (!feof($handle)) {
    $chunk = fread($handle, 8192);
    if ($chunk === false) break;
    echo $chunk;
    @ob_flush();
    flush();
}
fclose($handle);
