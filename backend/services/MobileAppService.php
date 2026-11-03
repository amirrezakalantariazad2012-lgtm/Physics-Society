<?php
/**
 * Mobile App & Android Packaging Service (Pure PHP)
 * Physics Association Platform - Shahid Beheshti 2 High School
 */

declare(strict_types=1);

namespace App\Services;

class MobileAppService
{
    private string $rootDir;

    public function __construct(?string $rootDir = null)
    {
        $this->rootDir = $rootDir ?? realpath(__DIR__ . '/../..');
    }

    /**
     * Get mobile app configuration and metadata
     */
    public function getAppConfig(): array
    {
        $apkPath = $this->rootDir . '/downloads/physics-society.apk';
        $apkExists = file_exists($apkPath);
        $apkSize = $apkExists ? filesize($apkPath) : 0;

        return [
            'app_id' => 'ir.sampad.physicssociety',
            'app_name' => 'انجمن فیزیک - علامه حلی / شهید بهشتی ۲',
            'package_name' => 'ir.sampad.physicssociety',
            'version_code' => 220,
            'version_name' => '2.2.0',
            'min_sdk' => 21,
            'target_sdk' => 34,
            'orientation' => 'portrait',
            'offline_capable' => true,
            'download_url' => '/downloads/physics-society.apk',
            'apk_available' => $apkExists,
            'apk_size_bytes' => $apkSize,
            'apk_size_formatted' => $apkSize > 0 ? round($apkSize / (1024 * 1024), 2) . ' MB' : '0 MB',
            'updated_at' => $apkExists ? date('Y-m-d H:i:s', (int)filemtime($apkPath)) : date('Y-m-d H:i:s'),
        ];
    }

    /**
     * Generate dynamic PWA Web App Manifest in PHP
     */
    public function generateWebManifest(): array
    {
        return [
            'name' => 'سامانه جامع فیزیک شهید بهشتی ۲',
            'short_name' => 'انجمن فیزیک',
            'start_url' => '/',
            'display' => 'standalone',
            'background_color' => '#030712',
            'theme_color' => '#0ea5e9',
            'dir' => 'rtl',
            'lang' => 'fa-IR',
            'icons' => [
                [
                    'src' => '/assets/quantum-cut-logo.svg',
                    'sizes' => 'any',
                    'type' => 'image/svg+xml',
                    'purpose' => 'any maskable'
                ],
                [
                    'src' => '/assets/favicon.svg',
                    'sizes' => '48x48 72x72 96x96 128x128 256x256',
                    'type' => 'image/svg+xml'
                ]
            ]
        ];
    }
}
