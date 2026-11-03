<?php
/**
 * QUANTUM CUT — Physics Educational Platform
 * Global Configuration and Environment Parser
 */

declare(strict_types=1);

date_default_timezone_set('Asia/Tehran');

class Config {
    private static array $env = [];
    private static bool $loaded = false;

    public static function init(): void {
        if (self::$loaded) return;

        // Search for .env in current and parent directories
        $envPaths = [
            __DIR__ . '/../.env',
            __DIR__ . '/.env',
            dirname(__DIR__, 2) . '/.env'
        ];

        foreach ($envPaths as $path) {
            if (file_exists($path) && is_readable($path)) {
                $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '' || str_starts_with($line, '#')) continue;
                    if (strpos($line, '=') !== false) {
                        [$key, $value] = explode('=', $line, 2);
                        $key = trim($key);
                        $value = trim($value);
                        $value = trim($value, '"\'');
                        self::$env[$key] = $value;
                    }
                }
                break;
            }
        }
        self::$loaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed {
        self::init();
        if (isset(self::$env[$key])) {
            return self::$env[$key];
        }
        $val = getenv($key);
        if ($val !== false) {
            return $val;
        }
        return $default;
    }

    public static function getInt(string $key, int $default = 0): int {
        return (int) self::get($key, $default);
    }

    public static function getBool(string $key, bool $default = false): bool {
        $val = strtolower((string) self::get($key, $default ? 'true' : 'false'));
        return in_array($val, ['1', 'true', 'on', 'yes'], true);
    }

    public static function getDatabaseDsn(): string {
        $dbUrl = self::get('DATABASE_URL', 'sqlite:///./physics_platform.db');
        
        // SQLite support
        if (str_starts_with($dbUrl, 'sqlite:///')) {
            $path = substr($dbUrl, 10);
            if (!str_starts_with($path, '/') && !preg_match('/^[a-zA-Z]:/', $path)) {
                $root = dirname(__DIR__);
                $path = $root . '/' . ltrim($path, './');
            }
            return 'sqlite:' . $path;
        }

        // MySQL / MariaDB support
        if (str_starts_with($dbUrl, 'mysql:') || str_starts_with($dbUrl, 'mysql://')) {
            $parsed = parse_url($dbUrl);
            $host = $parsed['host'] ?? '127.0.0.1';
            $port = $parsed['port'] ?? 3306;
            $db = ltrim($parsed['path'] ?? 'physics_db', '/');
            return "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";
        }

        // Default SQLite local file fallback
        $root = dirname(__DIR__);
        return 'sqlite:' . $root . '/physics_platform.db';
    }

    public static function getDbUser(): ?string {
        $dbUrl = self::get('DATABASE_URL', '');
        if (str_starts_with($dbUrl, 'mysql://') || str_starts_with($dbUrl, 'postgresql://')) {
            $parsed = parse_url($dbUrl);
            return $parsed['user'] ?? null;
        }
        return self::get('DB_USER', null);
    }

    public static function getDbPassword(): ?string {
        $dbUrl = self::get('DATABASE_URL', '');
        if (str_starts_with($dbUrl, 'mysql://') || str_starts_with($dbUrl, 'postgresql://')) {
            $parsed = parse_url($dbUrl);
            return $parsed['pass'] ?? null;
        }
        return self::get('DB_PASS', null);
    }

    public static function getSecretKey(): string {
        return self::get('SECRET_KEY', 'quantum-cut-super-secret-key-3249723984723984729384723984723894723');
    }

    public static function getUploadDir(): string {
        $dir = self::get('UPLOAD_DIR', './data/uploads');
        if (!str_starts_with($dir, '/') && !preg_match('/^[a-zA-Z]:/', $dir)) {
            $dir = dirname(__DIR__) . '/' . ltrim($dir, './');
        }
        if (!file_exists($dir)) {
            @mkdir($dir, 0777, true);
        }
        return $dir;
    }
}

Config::init();
