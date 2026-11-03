<?php
/**
 * QUANTUM CUT — Database Connection & Query Orchestrator
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

class DB {
    private static ?PDO $pdo = null;

    public static function getConnection(): PDO {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $dsn = Config::getDatabaseDsn();
        $user = Config::getDbUser();
        $pass = Config::getDbPassword();

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            self::$pdo = new PDO($dsn, $user, $pass, $options);
            
            if (str_starts_with($dsn, 'sqlite:')) {
                self::$pdo->exec("PRAGMA foreign_keys = ON;");
                @self::$pdo->exec("PRAGMA journal_mode = WAL;");
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'detail' => 'خطا در اتصال به پایگاه داده: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        self::ensureSchema();
        return self::$pdo;
    }

    public static function query(string $sql, array $params = []): PDOStatement {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll(string $sql, array $params = []): array {
        return self::query($sql, $params)->fetchAll();
    }

    public static function fetchOne(string $sql, array $params = []): ?array {
        $res = self::query($sql, $params)->fetch();
        return $res === false ? null : $res;
    }

    public static function fetchColumn(string $sql, array $params = [], int $col = 0): mixed {
        return self::query($sql, $params)->fetchColumn($col);
    }

    public static function execute(string $sql, array $params = []): int {
        return self::query($sql, $params)->rowCount();
    }

    public static function insert(string $table, array $data): int {
        $keys = array_keys($data);
        $fields = implode(', ', array_map(fn($k) => "`$k`", $keys));
        $placeholders = implode(', ', array_map(fn($k) => ":$k", $keys));
        $sql = "INSERT INTO `$table` ($fields) VALUES ($placeholders)";
        self::query($sql, $data);
        return (int) self::getConnection()->lastInsertId();
    }

    public static function update(string $table, array $data, string $where, array $whereParams = []): int {
        $setClauses = [];
        $params = [];
        foreach ($data as $key => $val) {
            $setClauses[] = "`$key` = :set_$key";
            $params["set_$key"] = $val;
        }
        foreach ($whereParams as $k => $v) {
            $params[$k] = $v;
        }
        $sql = "UPDATE `$table` SET " . implode(', ', $setClauses) . " WHERE $where";
        return self::execute($sql, $params);
    }

    public static function delete(string $table, string $where, array $whereParams = []): int {
        $sql = "DELETE FROM `$table` WHERE $where";
        return self::execute($sql, $whereParams);
    }

    public static function beginTransaction(): bool {
        return self::getConnection()->beginTransaction();
    }

    public static function commit(): bool {
        return self::getConnection()->commit();
    }

    public static function rollBack(): bool {
        return self::getConnection()->rollBack();
    }

    /**
     * Verifies and auto-creates core tables if initializing a new empty database
     */
    private static function ensureSchema(): void {
        try {
            // Check if users table exists
            $exists = self::$pdo->query("SELECT 1 FROM users LIMIT 1");
            if ($exists !== false) {
                // Ensure must_change_password column exists
                $cols = self::$pdo->query("PRAGMA table_info(users)")->fetchAll();
                $colNames = array_column($cols, 'name');
                if (!in_array('must_change_password', $colNames, true)) {
                    @self::$pdo->exec("ALTER TABLE users ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT 0");
                }
                return;
            }
        } catch (Exception) {
            // Table doesn't exist, will be created below
        }

        // Schema initialization (fallback if database was completely fresh)
        $schemaSql = <<<SQL
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(64) UNIQUE NOT NULL,
            email VARCHAR(128) UNIQUE,
            hashed_password VARCHAR(256) NOT NULL,
            role VARCHAR(32) DEFAULT 'student' NOT NULL,
            full_name VARCHAR(128) NOT NULL,
            display_name VARCHAR(64),
            is_active BOOLEAN DEFAULT 1 NOT NULL,
            must_change_password BOOLEAN DEFAULT 0 NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS student_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            grade_id INTEGER REFERENCES grades(id) ON DELETE SET NULL,
            student_number VARCHAR(32),
            total_xp INTEGER DEFAULT 0 NOT NULL,
            current_level INTEGER DEFAULT 1 NOT NULL,
            current_streak INTEGER DEFAULT 0 NOT NULL,
            max_streak INTEGER DEFAULT 0 NOT NULL,
            last_activity_date VARCHAR(16),
            bio TEXT,
            avatar_url VARCHAR(256),
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number INTEGER UNIQUE NOT NULL,
            title_fa VARCHAR(64) NOT NULL,
            description_fa TEXT
        );

        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
            code VARCHAR(32) UNIQUE NOT NULL,
            title_fa VARCHAR(128) NOT NULL,
            book_type VARCHAR(32) DEFAULT 'standard' NOT NULL,
            publisher_fa VARCHAR(128) DEFAULT 'وزارت آموزش و پرورش' NOT NULL,
            academic_year VARCHAR(32) DEFAULT '1404-1405' NOT NULL,
            cover_image_url VARCHAR(256)
        );

        CREATE TABLE IF NOT EXISTS chapters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
            chapter_number INTEGER NOT NULL,
            title_fa VARCHAR(128) NOT NULL,
            description_fa TEXT,
            estimated_hours INTEGER DEFAULT 4,
            icon_name VARCHAR(64) DEFAULT 'book-open'
        );

        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
            lesson_number INTEGER NOT NULL,
            title_fa VARCHAR(128) NOT NULL,
            content_markdown TEXT NOT NULL,
            key_takeaways TEXT,
            xp_reward INTEGER DEFAULT 30,
            estimated_minutes INTEGER DEFAULT 20
        );

        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
            exercise_type VARCHAR(32) DEFAULT 'mcq' NOT NULL,
            prompt_fa TEXT NOT NULL,
            options_json TEXT,
            correct_answer TEXT NOT NULL,
            explanation_fa TEXT,
            xp_reward INTEGER DEFAULT 10
        );

        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
            book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
            chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
            question_type VARCHAR(32) NOT NULL,
            difficulty VARCHAR(16) DEFAULT 'medium',
            prompt_fa TEXT NOT NULL,
            points REAL DEFAULT 1.0,
            time_limit_seconds INTEGER DEFAULT 90,
            source_ref VARCHAR(128),
            is_published BOOLEAN DEFAULT 1,
            is_ai_generated BOOLEAN DEFAULT 0,
            review_status VARCHAR(32) DEFAULT 'approved',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS question_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            option_key VARCHAR(8) NOT NULL,
            text_fa TEXT NOT NULL,
            is_correct BOOLEAN DEFAULT 0 NOT NULL,
            explanation_fa TEXT
        );

        CREATE TABLE IF NOT EXISTS examinations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grade_id INTEGER NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
            chapter_id INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
            title_fa VARCHAR(128) NOT NULL,
            description_fa TEXT,
            exam_mode VARCHAR(32) DEFAULT 'practice' NOT NULL,
            duration_minutes INTEGER DEFAULT 45 NOT NULL,
            total_points REAL DEFAULT 20.0 NOT NULL,
            passing_score REAL DEFAULT 12.0 NOT NULL,
            is_active BOOLEAN DEFAULT 1 NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS examination_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
            question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            order_index INTEGER DEFAULT 1,
            points REAL DEFAULT 1.0
        );

        CREATE TABLE IF NOT EXISTS examination_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            attempt_number INTEGER DEFAULT 1 NOT NULL,
            started_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            submitted_at DATETIME,
            auto_graded_score REAL DEFAULT 0.0,
            ai_proposed_score REAL DEFAULT 0.0,
            final_score REAL DEFAULT 0.0,
            total_possible_points REAL DEFAULT 20.0,
            percentage REAL DEFAULT 0.0,
            is_passed BOOLEAN DEFAULT 0 NOT NULL,
            status VARCHAR(32) DEFAULT 'in_progress' NOT NULL,
            feedback_fa TEXT
        );

        CREATE TABLE IF NOT EXISTS student_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            attempt_id INTEGER NOT NULL REFERENCES examination_attempts(id) ON DELETE CASCADE,
            question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            selected_option_key VARCHAR(8),
            written_response_text TEXT,
            auto_score REAL DEFAULT 0.0,
            ai_score REAL DEFAULT 0.0,
            final_score REAL DEFAULT 0.0,
            max_score REAL DEFAULT 1.0,
            is_correct BOOLEAN DEFAULT 0,
            review_status VARCHAR(32) DEFAULT 'auto',
            feedback_fa TEXT,
            ai_analysis_json TEXT
        );

        CREATE TABLE IF NOT EXISTS competitions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grade_id INTEGER REFERENCES grades(id) ON DELETE SET NULL,
            title_fa VARCHAR(128) NOT NULL,
            description_fa TEXT,
            theme_fa VARCHAR(128),
            league_type VARCHAR(32) DEFAULT 'weekly' NOT NULL,
            league_tier VARCHAR(32) DEFAULT 'quantum' NOT NULL,
            duration_minutes INTEGER DEFAULT 45 NOT NULL,
            has_negative_marking BOOLEAN DEFAULT 0 NOT NULL,
            negative_ratio REAL DEFAULT 0.33 NOT NULL,
            status VARCHAR(32) DEFAULT 'active' NOT NULL,
            starts_at DATETIME NOT NULL,
            ends_at DATETIME NOT NULL,
            is_published BOOLEAN DEFAULT 1,
            is_closed BOOLEAN DEFAULT 0,
            solutions_published BOOLEAN DEFAULT 0,
            official_solution_fa TEXT,
            xp_first_place INTEGER DEFAULT 150,
            xp_second_place INTEGER DEFAULT 100,
            xp_third_place INTEGER DEFAULT 70,
            xp_participation INTEGER DEFAULT 20,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS competition_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            competition_id INTEGER NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
            question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            order_index INTEGER DEFAULT 1,
            points REAL DEFAULT 10.0
        );

        CREATE TABLE IF NOT EXISTS competition_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            competition_id INTEGER NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            answers_json TEXT NOT NULL,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            time_spent_seconds INTEGER DEFAULT 0,
            score REAL DEFAULT 0.0,
            final_rank INTEGER,
            feedback_fa TEXT
        );

        CREATE TABLE IF NOT EXISTS xp_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount INTEGER NOT NULL,
            activity_type VARCHAR(64) NOT NULL,
            reference_id VARCHAR(64),
            description_fa VARCHAR(256) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS levels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            level_number INTEGER UNIQUE NOT NULL,
            title_fa VARCHAR(64) NOT NULL,
            min_xp INTEGER NOT NULL,
            badge_icon VARCHAR(64)
        );

        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code VARCHAR(64) UNIQUE NOT NULL,
            title_fa VARCHAR(128) NOT NULL,
            description_fa TEXT NOT NULL,
            icon VARCHAR(64) NOT NULL,
            category VARCHAR(32) DEFAULT 'general',
            xp_bonus INTEGER DEFAULT 50,
            criteria_type VARCHAR(64) NOT NULL,
            criteria_threshold INTEGER DEFAULT 1,
            is_active BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS student_badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
            awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS learning_streaks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            activity_date VARCHAR(16) NOT NULL,
            activity_count INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS student_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
            is_completed BOOLEAN DEFAULT 0,
            completed_at DATETIME,
            attempts_count INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title_fa VARCHAR(128) NOT NULL,
            message_fa TEXT NOT NULL,
            notification_type VARCHAR(32) DEFAULT 'system',
            is_read BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            action VARCHAR(64) NOT NULL,
            target_entity VARCHAR(64),
            target_id VARCHAR(64),
            details TEXT,
            ip_address VARCHAR(45),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ai_provider_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider_name VARCHAR(64) DEFAULT 'openrouter' NOT NULL,
            api_key_masked VARCHAR(64) DEFAULT '***',
            api_key_encrypted TEXT,
            base_url VARCHAR(256) DEFAULT 'https://openrouter.ai/api/v1',
            model_name VARCHAR(128) DEFAULT 'poolside/laguna-s-2.1:free',
            timeout_seconds INTEGER DEFAULT 35,
            max_retries INTEGER DEFAULT 3,
            temperature REAL DEFAULT 0.35,
            is_active BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS supplementary_materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            grade_id INTEGER REFERENCES grades(id) ON DELETE SET NULL,
            chapter_id INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
            title_fa VARCHAR(256) NOT NULL,
            description_fa TEXT,
            author_fa VARCHAR(128) DEFAULT 'انجمن فیزیک شهید بهشتی دو',
            material_type VARCHAR(32) DEFAULT 'pdf',
            file_url VARCHAR(512) NOT NULL,
            file_size_bytes INTEGER DEFAULT 0,
            download_count INTEGER DEFAULT 0,
            is_published BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
SQL;
        self::$pdo->exec($schemaSql);
    }
}
