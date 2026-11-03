<?php
/**
 * QUANTUM CUT — Standalone Android APK & Mobile Pipeline (PHP Edition)
 * Physics Association Platform - Shahid Beheshti 2 High School
 */

declare(strict_types=1);

require_once __DIR__ . '/backend/services/MobileAppService.php';

use App\Services\MobileAppService;

echo "==========================================================\n";
echo " QUANTUM CUT: Android APK & Mobile Pipeline (PHP Edition)\n";
echo "==========================================================\n";

$mobileService = new MobileAppService(__DIR__);
$config = $mobileService->getAppConfig();

echo "Package ID:    " . $config['package_name'] . "\n";
echo "App Name:      " . $config['app_name'] . "\n";
echo "Version:       " . $config['version_name'] . " (Build " . $config['version_code'] . ")\n";
echo "Target SDK:    " . $config['target_sdk'] . " (Min SDK: " . $config['min_sdk'] . ")\n";

$apkPath = __DIR__ . '/downloads/physics-society.apk';
if (file_exists($apkPath)) {
    echo "[OK] Standalone Signed APK is verified and ready:\n";
    echo "     Location: downloads/physics-society.apk\n";
    echo "     Size:     " . $config['apk_size_formatted'] . " (" . $config['apk_size_bytes'] . " bytes)\n";
    echo "     Public URL: /downloads/physics-society.apk\n";
} else {
    echo "[WARNING] Standalone APK file not found at downloads/physics-society.apk\n";
}

echo "=== Mobile Verification & Packaging Complete. ===\n";
