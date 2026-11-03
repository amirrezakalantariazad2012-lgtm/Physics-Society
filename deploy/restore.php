<?php
/**
 * Database & Media Restoration Script (PHP CLI Edition)
 * Physics Association Platform - Shahid Beheshti 2 High School
 * 
 * Usage:
 *   php deploy/restore.php path/to/physics_backup_YYYYMMDD_HHMMSS.tar.gz
 *   php deploy/restore.php --force path/to/physics_backup_...
 */

declare(strict_types=1);

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die("Access Denied: CLI only.\n");
}

$args = array_values(array_filter(array_slice($argv, 1), fn($a) => !str_starts_with($a, '--')));
$force = in_array('--force', $argv, true);

if (count($args) < 1) {
    echo "Usage: php deploy/restore.php [--force] /path/to/physics_backup_*.tar.gz\n";
    exit(1);
}

$archivePath = realpath($args[0]);
if (!$archivePath || !file_exists($archivePath)) {
    echo "Error: Backup file does not exist: {$args[0]}\n";
    exit(1);
}

$rootDir = realpath(__DIR__ . '/..');
echo "==========================================================\n";
echo " RESTORING PHYSICS PLATFORM FROM BACKUP (PHP CLI)\n";
echo " Archive: {$archivePath}\n";
echo " Root:    {$rootDir}\n";
echo "==========================================================\n";

if (!$force) {
    echo "Are you sure you want to overwrite current database and media? (y/N): ";
    $handle = fopen("php://stdin", "r");
    $line = trim((string)fgets($handle));
    fclose($handle);
    if (strtolower($line) !== 'y') {
        echo "Restoration aborted by user.\n";
        exit(0);
    }
}

$tempDir = sys_get_temp_dir() . '/physics_restore_' . uniqid();
mkdir($tempDir, 0755, true);

register_shutdown_function(function() use ($tempDir) {
    if (is_dir($tempDir)) {
        $it = new RecursiveDirectoryIterator($tempDir, RecursiveIteratorIterator::CHILD_FIRST);
        $files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($files as $file) {
            if ($file->isDir()) {
                @rmdir($file->getRealPath());
            } else {
                @unlink($file->getRealPath());
            }
        }
        @rmdir($tempDir);
    }
});

try {
    echo "[1/3] Unpacking backup archive...\n";
    $phar = new PharData($archivePath);
    $phar->extractTo($tempDir);

    // Find extracted database
    echo "[2/3] Restoring database...\n";
    $dbFile = null;
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($tempDir));
    foreach ($it as $file) {
        if ($file->getFilename() === 'physics_platform.db') {
            $dbFile = $file->getRealPath();
            break;
        }
    }

    if ($dbFile && file_exists($dbFile)) {
        copy($dbFile, $rootDir . '/physics_platform.db');
        echo "  [OK] SQLite database restored to {$rootDir}/physics_platform.db\n";
    }

    // Check for media archive
    echo "[3/3] Restoring media files and textbooks...\n";
    $mediaFile = null;
    foreach ($it as $file) {
        if (str_contains($file->getFilename(), 'media_data.tar')) {
            $mediaFile = $file->getRealPath();
            break;
        }
    }

    if ($mediaFile && file_exists($mediaFile)) {
        $mediaPhar = new PharData($mediaFile);
        $mediaPhar->extractTo($rootDir . '/data');
        echo "  [OK] Media archive restored to {$rootDir}/data\n";
    }

    echo "==========================================================\n";
    echo " Restoration completed successfully!\n";
    echo "==========================================================\n";
} catch (\Throwable $e) {
    echo "Error during restore: " . $e->getMessage() . "\n";
    exit(1);
}
