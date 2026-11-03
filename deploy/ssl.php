<?php
/**
 * SSL Initialization & Management Helper (PHP CLI Edition)
 * Physics Association Platform - Shahid Beheshti 2 High School
 * 
 * Usage:
 *   php deploy/ssl.php your-domain.com admin-email@example.com
 */

declare(strict_types=1);

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die("Access Denied: CLI only.\n");
}

$domain = $argv[1] ?? null;
$email  = $argv[2] ?? null;

if (!$domain || !$email) {
    echo "Usage: php deploy/ssl.php <domain> <admin-email>\n";
    echo "Example: php deploy/ssl.php physics.sampad.ir admin@sampad.ir\n";
    exit(1);
}

echo "==========================================================\n";
echo " Initializing SSL for domain: {$domain}\n";
echo " Contact Email: {$email}\n";
echo "==========================================================\n";

$cmd = sprintf(
    'certbot certonly --webroot -w %s -d %s --email %s --rsa-key-size 4096 --agree-tos --non-interactive',
    escapeshellarg('/var/www/certbot'),
    escapeshellarg($domain),
    escapeshellarg($email)
);

echo "Running command: {$cmd}\n";
passthru($cmd, $returnVar);

if ($returnVar === 0) {
    echo "[OK] SSL Certificate generated successfully for {$domain}.\n";
} else {
    echo "[INFO] Certbot exited with code {$returnVar}. If running on shared cPanel/DirectAdmin, install SSL via your hosting control panel.\n";
}
