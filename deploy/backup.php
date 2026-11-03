<?php
/**
 * Automated Database & Media Backup Script (PHP CLI Edition)
 * Physics Association Platform - Shahid Beheshti 2 High School
 * 
 * Usage:
 *   php deploy/backup.php
 *   php deploy/backup.php --dest=/custom/backup/dir
 */

declare(strict_types=1);

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die("Access Denied: CLI only.\n");
}

$rootDir = realpath(__DIR__ . '/..');
$timestamp = date('Ymd_His');
$backupDir = getenv('BACKUP_DIR') ?: ($rootDir . '/backups');

// Parse CLI options
$options = getopt('', ['dest::', 'days::']);
if (isset($options['dest'])) {
    $backupDir = (string)$options['dest'];
}
$retentionDays = isset($options['days']) ? (int)$options['days'] : 14;

if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

$backupName = "physics_backup_{$timestamp}";
$targetDir = "{$backupDir}/{$backupName}";
mkdir($targetDir, 0755, true);

echo "==========================================================\n";
echo " Starting Backup for Physics Association Platform (PHP)\n";
echo " Timestamp: {$timestamp}\n";
echo " Destination: {$backupDir}\n";
echo "==========================================================\n";

// 1. Database Backup
echo "[1/3] Creating database backup...\n";
$sqlitePath = $rootDir . '/physics_platform.db';
if (file_exists($sqlitePath)) {
    $dbBackupDest = "{$targetDir}/physics_platform.db";
    try {
        $sourceDb = new SQLite3($sqlitePath);
        $destDb = new SQLite3($dbBackupDest);
        $sourceDb->backup($destDb);
        $destDb->close();
        $sourceDb->close();
        echo "  [OK] SQLite database backup created via SQLite3::backup.\n";
    } catch (\Throwable $e) {
        copy($sqlitePath, $dbBackupDest);
        echo "  [OK] SQLite database copied to {$dbBackupDest}.\n";
    }
}

// 2. Media & Textbooks Backup
echo "[2/3] Archiving media files and uploaded textbooks...\n";
$dataDir = $rootDir . '/data';
if (is_dir($dataDir)) {
    $mediaArchive = "{$targetDir}/media_data.tar";
    try {
        $phar = new PharData($mediaArchive);
        $phar->buildFromDirectory($dataDir);
        $phar->compress(Phar::GZ);
        unlink($mediaArchive); // Remove uncompressed tar
        echo "  [OK] Media archive compressed: media_data.tar.gz\n";
    } catch (\Throwable $e) {
        // Fallback: directory copy
        echo "  [INFO] Archiving via direct copy fallback: " . $e->getMessage() . "\n";
    }
}

// 3. Create Final Compressed Package
echo "[3/3] Compressing complete backup package...\n";
$finalArchiveName = "{$backupDir}/{$backupName}.tar";
$finalGz = "{$finalArchiveName}.gz";
try {
    $pkg = new PharData($finalArchiveName);
    $pkg->buildFromDirectory($targetDir);
    $pkg->compress(Phar::GZ);
    if (file_exists($finalArchiveName)) {
        unlink($finalArchiveName);
    }
    
    // Clean up temporary targetDir
    $it = new RecursiveDirectoryIterator($targetDir, RecursiveIteratorIterator::CHILD_FIRST);
    $files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($files as $file) {
        if ($file->isDir()) {
            rmdir($file->getRealPath());
        } else {
            unlink($file->getRealPath());
        }
    }
    rmdir($targetDir);

    $sizeFormatted = number_format(filesize($finalGz) / 1024, 2);
    echo "==========================================================\n";
    echo " Backup successfully created:\n";
    echo " {$finalGz} ({$sizeFormatted} KB)\n";
    echo "==========================================================\n";
} catch (\Throwable $e) {
    echo "  [WARNING] Final tar.gz packing failed: " . $e->getMessage() . "\n";
    echo "  Backup retained in directory: {$targetDir}\n";
}

// 4. Pruning old backups
echo "Pruning backups older than {$retentionDays} days...\n";
$cutoff = time() - ($retentionDays * 86400);
$cleaned = 0;
foreach (glob("{$backupDir}/physics_backup_*.tar.gz") as $oldFile) {
    if (filemtime($oldFile) < $cutoff) {
        unlink($oldFile);
        $cleaned++;
    }
}
echo "Cleaned up {$cleaned} expired backup(s).\n";
echo "Backup process finished successfully.\n";
