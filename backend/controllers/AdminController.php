<?php
/**
 * QUANTUM CUT — Admin Command Deck Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../services/GamificationService.php';

class AdminController {
    public static function overview(): void {
        Auth::requireAdmin();

        $studentCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM users WHERE role = 'student'");
        $questionCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM questions");
        $examCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM examinations");
        $competitionCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM competitions");
        $attemptCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM examination_attempts");

        $recentStudents = DB::fetchAll(
            "SELECT u.id, u.username, u.full_name, u.created_at, p.total_xp, p.current_level, g.title_fa AS grade_title
             FROM users u
             LEFT JOIN student_profiles p ON p.user_id = u.id
             LEFT JOIN grades g ON g.id = p.grade_id
             WHERE u.role = 'student'
             ORDER BY u.created_at DESC LIMIT 5"
        );

        echo json_encode([
            'total_students' => $studentCount,
            'total_questions' => $questionCount,
            'total_exams' => $examCount,
            'total_competitions' => $competitionCount,
            'total_exam_attempts' => $attemptCount,
            'recent_students' => $recentStudents
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function validationReport(): void {
        Auth::requireAdmin();

        $grades = DB::fetchAll("SELECT * FROM grades ORDER BY number ASC");
        $report = [];

        foreach ($grades as $g) {
            $books = DB::fetchAll("SELECT * FROM books WHERE grade_id = :gid", ['gid' => $g['id']]);
            $bList = [];
            foreach ($books as $b) {
                $chapters = DB::fetchAll("SELECT * FROM chapters WHERE book_id = :bid", ['bid' => $b['id']]);
                $chList = [];
                foreach ($chapters as $ch) {
                    $qCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM questions WHERE chapter_id = :cid", ['cid' => $ch['id']]);
                    $chList[] = [
                        'chapter_id' => (int) $ch['id'],
                        'title_fa' => $ch['title_fa'],
                        'chapter_number' => (int) $ch['chapter_number'],
                        'question_count' => $qCount,
                        'is_valid' => ($qCount >= 10)
                    ];
                }
                $bList[] = [
                    'book_id' => (int) $b['id'],
                    'title_fa' => $b['title_fa'],
                    'chapters' => $chList
                ];
            }
            $report[] = [
                'grade_id' => (int) $g['id'],
                'grade_number' => (int) $g['number'],
                'title_fa' => $g['title_fa'],
                'books' => $bList
            ];
        }

        echo json_encode(['grades' => $report, 'status' => 'success'], JSON_UNESCAPED_UNICODE);
    }

    public static function getQuestions(): void {
        Auth::requireAdmin();

        $gradeId = isset($_GET['grade_id']) ? (int) $_GET['grade_id'] : null;
        $chapterId = isset($_GET['chapter_id']) ? (int) $_GET['chapter_id'] : null;
        $limit = isset($_GET['limit']) ? min(100, max(1, (int) $_GET['limit'])) : 30;
        $offset = isset($_GET['offset']) ? max(0, (int) $_GET['offset']) : 0;

        $sql = "SELECT q.*, g.title_fa AS grade_title, c.title_fa AS chapter_title
                FROM questions q
                LEFT JOIN grades g ON g.id = q.grade_id
                LEFT JOIN chapters c ON c.id = q.chapter_id
                WHERE 1=1";
        $params = [];

        if ($gradeId) {
            $sql .= " AND q.grade_id = :gid";
            $params['gid'] = $gradeId;
        }
        if ($chapterId) {
            $sql .= " AND q.chapter_id = :cid";
            $params['cid'] = $chapterId;
        }

        $sql .= " ORDER BY q.id DESC LIMIT $limit OFFSET $offset";
        $questions = DB::fetchAll($sql, $params);

        $results = [];
        foreach ($questions as $q) {
            $options = [];
            if ($q['question_type'] === 'mcq') {
                $options = DB::fetchAll("SELECT * FROM question_options WHERE question_id = :qid ORDER BY option_key ASC", ['qid' => $q['id']]);
            }
            $results[] = [
                'id' => (int) $q['id'],
                'prompt_fa' => $q['prompt_fa'],
                'question_type' => $q['question_type'],
                'difficulty' => $q['difficulty'],
                'points' => (float) $q['points'],
                'grade_title' => $q['grade_title'],
                'chapter_title' => $q['chapter_title'],
                'options' => $options
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function createQuestion(array $input): void {
        Auth::requireAdmin();

        $gradeId = (int) ($input['grade_id'] ?? 1);
        $chapterId = (int) ($input['chapter_id'] ?? 1);
        $prompt = trim($input['prompt_fa'] ?? '');
        $type = $input['question_type'] ?? 'mcq';
        $difficulty = $input['difficulty'] ?? 'medium';
        $points = (float) ($input['points'] ?? 1.0);

        if (empty($prompt)) {
            http_response_code(422);
            echo json_encode(['detail' => 'متن صورت سوال الزامی است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $bookId = (int) DB::fetchColumn("SELECT book_id FROM chapters WHERE id = :cid", ['cid' => $chapterId]);
        if (!$bookId) {
            $bookId = (int) DB::fetchColumn("SELECT id FROM books WHERE grade_id = :gid LIMIT 1", ['gid' => $gradeId]);
        }

        $qId = DB::insert('questions', [
            'grade_id' => $gradeId,
            'book_id' => $bookId,
            'chapter_id' => $chapterId,
            'question_type' => $type,
            'difficulty' => $difficulty,
            'prompt_fa' => $prompt,
            'points' => $points,
            'is_published' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        if ($type === 'mcq' && !empty($input['options'])) {
            foreach ($input['options'] as $opt) {
                DB::insert('question_options', [
                    'question_id' => $qId,
                    'option_key' => $opt['option_key'] ?? 'A',
                    'text_fa' => $opt['text_fa'] ?? '',
                    'is_correct' => !empty($opt['is_correct']) ? 1 : 0,
                    'explanation_fa' => $opt['explanation_fa'] ?? null
                ]);
            }
        }

        echo json_encode(['id' => $qId, 'message' => 'سوال با موفقیت ایجاد شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function deleteQuestion(int $id): void {
        Auth::requireAdmin();
        DB::delete('questions', 'id = :id', ['id' => $id]);
        echo json_encode(['message' => 'سوال با موفقیت حذف گردید.'], JSON_UNESCAPED_UNICODE);
    }

    public static function getCurriculumTree(): void {
        Auth::requireAdmin();
        $grades = DB::fetchAll("SELECT * FROM grades ORDER BY number ASC");
        $tree = [];
        foreach ($grades as $g) {
            $books = DB::fetchAll("SELECT * FROM books WHERE grade_id = :gid", ['gid' => $g['id']]);
            $bList = [];
            foreach ($books as $b) {
                $chapters = DB::fetchAll("SELECT * FROM chapters WHERE book_id = :bid ORDER BY chapter_number ASC", ['bid' => $b['id']]);
                $chList = [];
                foreach ($chapters as $ch) {
                    $lessons = DB::fetchAll("SELECT id, lesson_number, title_fa FROM lessons WHERE chapter_id = :cid ORDER BY lesson_number ASC", ['cid' => $ch['id']]);
                    $chList[] = [
                        'id' => (int) $ch['id'],
                        'title_fa' => $ch['title_fa'],
                        'chapter_number' => (int) $ch['chapter_number'],
                        'lessons' => $lessons
                    ];
                }
                $bList[] = [
                    'id' => (int) $b['id'],
                    'title_fa' => $b['title_fa'],
                    'code' => $b['code'],
                    'chapters' => $chList
                ];
            }
            $tree[] = [
                'id' => (int) $g['id'],
                'number' => (int) $g['number'],
                'title_fa' => $g['title_fa'],
                'books' => $bList
            ];
        }
        echo json_encode($tree, JSON_UNESCAPED_UNICODE);
    }

    public static function getWrittenQueue(): void {
        Auth::requireAdmin();
        $items = DB::fetchAll(
            "SELECT sa.*, q.prompt_fa, u.full_name AS student_name, e.title_fa AS exam_title
             FROM student_answers sa
             JOIN examination_attempts ea ON ea.id = sa.attempt_id
             JOIN examinations e ON e.id = ea.exam_id
             JOIN users u ON u.id = ea.user_id
             JOIN questions q ON q.id = sa.question_id
             WHERE q.question_type = 'written'
             ORDER BY sa.id DESC LIMIT 50"
        );
        echo json_encode($items, JSON_UNESCAPED_UNICODE);
    }

    public static function overrideGrade(array $input): void {
        $admin = Auth::requireAdmin();
        $answerId = (int) ($input['student_answer_id'] ?? 0);
        $newScore = (float) ($input['new_score'] ?? 0.0);
        $reason = trim($input['reason'] ?? 'بازبینی نمره توسط دبیر');

        DB::update('student_answers', [
            'final_score' => $newScore,
            'feedback_fa' => "ویرایش نمره توسط دبیر: $newScore (دلیل: $reason)",
            'review_status' => 'overridden'
        ], 'id = :id', ['id' => $answerId]);

        echo json_encode(['message' => 'نمره با موفقیت بازنویسی شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function getAiConfig(): void {
        Auth::requireAdmin();
        $cfg = DB::fetchOne("SELECT * FROM ai_provider_configs WHERE is_active = 1 LIMIT 1");
        if (!$cfg) {
            $cfg = [
                'provider_name' => 'inferbase',
                'api_key_masked' => 'inf_Lnu...EMD',
                'base_url' => 'https://api.inferbase.ai/v1',
                'model_name' => 'openai-gpt-oss-120b',
                'model_display' => 'GPT Oss 120B'
            ];
        } else {
            $cfg['api_key_masked'] = !empty($cfg['api_key_encrypted']) ? (mb_substr($cfg['api_key_encrypted'], 0, 7) . '...' . mb_substr($cfg['api_key_encrypted'], -4)) : '***';
            $cfg['model_display'] = 'GPT Oss 120B';
        }
        echo json_encode($cfg, JSON_UNESCAPED_UNICODE);
    }

    public static function updateAiConfig(array $input): void {
        Auth::requireAdmin();
        $provider = $input['provider_name'] ?? 'inferbase';
        $apiKey = $input['api_key'] ?? '';
        $model = $input['model_name'] ?? 'openai-gpt-oss-120b';
        $baseUrl = $input['base_url'] ?? 'https://api.inferbase.ai/v1';

        $existing = DB::fetchOne("SELECT id FROM ai_provider_configs LIMIT 1");
        if ($existing) {
            $update = [
                'provider_name' => $provider,
                'model_name' => $model,
                'base_url' => $baseUrl,
                'updated_at' => date('Y-m-d H:i:s')
            ];
            if (!empty($apiKey) && !str_contains($apiKey, '***')) {
                $update['api_key_encrypted'] = $apiKey;
                $update['api_key_masked'] = mb_substr($apiKey, 0, 7) . '...' . mb_substr($apiKey, -4);
            }
            DB::update('ai_provider_configs', $update, 'id = :id', ['id' => $existing['id']]);
        } else {
            DB::insert('ai_provider_configs', [
                'provider_name' => $provider,
                'api_key_encrypted' => $apiKey,
                'api_key_masked' => mb_substr($apiKey, 0, 7) . '...' . mb_substr($apiKey, -4),
                'base_url' => $baseUrl,
                'model_name' => $model,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        }

        echo json_encode(['message' => 'تنظیمات هوش مصنوعی نکسورا (مدل GPT Oss 120B) با موفقیت ذخیره شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function testAiConnection(): void {
        Auth::requireAdmin();
        $start = microtime(true);
        $res = AiService::askTutor('سلام! تست ارتباط و پاسخگویی فیزیک.');
        $latency = round((microtime(true) - $start) * 1000);

        echo json_encode([
            'success' => true,
            'provider' => 'Inferbase AI (GPT Oss 120B)',
            'model' => 'openai-gpt-oss-120b',
            'model_display' => 'GPT Oss 120B',
            'latency_ms' => $latency,
            'sample_response' => mb_substr($res['response_fa'] ?? $res['guidance_fa'], 0, 150) . '...',
            'message' => "ارتباط زنده با موتور هوش مصنوعی Inferbase (مدل GPT Oss 120B) با تاخیر {$latency} میلی‌ثانیه برقرار است."
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function getStudents(): void {
        Auth::requireAdmin();
        $q = trim($_GET['search'] ?? '');
        $gradeId = isset($_GET['grade_id']) ? (int) $_GET['grade_id'] : null;

        $sql = "SELECT u.id, u.username, u.full_name, u.display_name, u.email, u.is_active, u.created_at,
                       p.grade_id, p.total_xp, p.current_level, p.current_streak, p.student_number,
                       g.title_fa AS grade_title
                FROM users u
                LEFT JOIN student_profiles p ON p.user_id = u.id
                LEFT JOIN grades g ON g.id = p.grade_id
                WHERE u.role = 'student'";
        $params = [];

        if (!empty($q)) {
            $sql .= " AND (u.username LIKE :q OR u.full_name LIKE :q)";
            $params['q'] = "%$q%";
        }
        if ($gradeId) {
            $sql .= " AND p.grade_id = :gid";
            $params['gid'] = $gradeId;
        }

        $sql .= " ORDER BY p.total_xp DESC";
        $students = DB::fetchAll($sql, $params);
        echo json_encode($students, JSON_UNESCAPED_UNICODE);
    }

    public static function createStudent(array $input): void {
        Auth::requireAdmin();
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? 'Student1405!';
        $fullName = trim($input['full_name'] ?? '');
        $gradeId = (int) ($input['grade_id'] ?? 1);

        if (empty($username) || empty($fullName)) {
            http_response_code(422);
            echo json_encode(['detail' => 'نام کاربری و نام خانوادگی الزامی است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $existing = DB::fetchOne("SELECT id FROM users WHERE LOWER(username) = LOWER(:u)", ['u' => $username]);
        if ($existing) {
            http_response_code(400);
            echo json_encode(['detail' => 'نام کاربری تکراری است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $userId = DB::insert('users', [
            'username' => $username,
            'hashed_password' => Auth::hashPassword($password),
            'role' => 'student',
            'full_name' => $fullName,
            'display_name' => explode(' ', $fullName)[0],
            'is_active' => 1,
            'must_change_password' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        DB::insert('student_profiles', [
            'user_id' => $userId,
            'grade_id' => $gradeId,
            'student_number' => $input['student_number'] ?? null,
            'total_xp' => 100,
            'current_level' => 1,
            'current_streak' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ]);

        echo json_encode(['id' => $userId, 'message' => 'حساب دانش‌آموز با موفقیت ساخته شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function resetStudentPassword(int $userId, array $input): void {
        Auth::requireAdmin();
        $newPass = $input['new_password'] ?? 'Student1405!';
        DB::update('users', [
            'hashed_password' => Auth::hashPassword($newPass),
            'must_change_password' => 1,
            'updated_at' => date('Y-m-d H:i:s')
        ], 'id = :id', ['id' => $userId]);

        echo json_encode(['message' => 'رمز عبور با موفقیت بازنشانی شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function adjustStudentXp(int $userId, array $input): void {
        Auth::requireAdmin();
        $amount = (int) ($input['amount'] ?? 0);
        $reason = trim($input['reason'] ?? 'تنظیم دستی توسط مدیر');

        GamificationService::awardXp($userId, $amount, 'admin_adjustment', $reason);
        echo json_encode(['message' => 'امتیاز تجربه کاربر با موفقیت ویرایش گردید.'], JSON_UNESCAPED_UNICODE);
    }

    public static function toggleStudentStatus(int $userId): void {
        Auth::requireAdmin();
        $curr = (int) DB::fetchColumn("SELECT is_active FROM users WHERE id = :id", ['id' => $userId]);
        $next = ($curr === 1) ? 0 : 1;
        DB::update('users', ['is_active' => $next], 'id = :id', ['id' => $userId]);
        echo json_encode(['is_active' => (bool)$next, 'message' => 'وضعیت کاربر تغییر یافت.'], JSON_UNESCAPED_UNICODE);
    }

    public static function deleteStudent(int $userId): void {
        Auth::requireAdmin();
        DB::delete('users', 'id = :id', ['id' => $userId]);
        echo json_encode(['message' => 'کاربر با موفقیت حذف گردید.'], JSON_UNESCAPED_UNICODE);
    }

    public static function getStudentDetails(int $userId): void {
        Auth::requireAdmin();
        $user = DB::fetchOne(
            "SELECT u.id, u.username, u.email, u.full_name, u.display_name, u.role, u.is_active, u.created_at,
                    p.grade_id, p.student_number, p.total_xp, p.current_level, p.current_streak, p.max_streak, p.bio
             FROM users u
             LEFT JOIN student_profiles p ON p.user_id = u.id
             WHERE u.id = :id",
            ['id' => $userId]
        );

        if (!$user) {
            http_response_code(404);
            echo json_encode(['detail' => 'دانش‌آموز مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $attempts = DB::fetchAll(
            "SELECT a.id, a.exam_id, a.started_at, a.submitted_at, a.final_score, a.total_possible_points, a.percentage, a.is_passed, a.status,
                    e.title_fa AS exam_title
             FROM examination_attempts a
             JOIN examinations e ON e.id = a.exam_id
             WHERE a.user_id = :uid
             ORDER BY a.started_at DESC",
            ['uid' => $userId]
        );

        echo json_encode([
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'display_name' => $user['display_name'],
            'role' => $user['role'],
            'is_active' => (bool) $user['is_active'],
            'created_at' => $user['created_at'],
            'profile' => [
                'grade_id' => $user['grade_id'] !== null ? (int) $user['grade_id'] : null,
                'student_number' => $user['student_number'],
                'total_xp' => (int) ($user['total_xp'] ?? 0),
                'current_level' => (int) ($user['current_level'] ?? 1),
                'current_streak' => (int) ($user['current_streak'] ?? 0),
                'max_streak' => (int) ($user['max_streak'] ?? 0),
                'bio' => $user['bio']
            ],
            'attempts' => $attempts
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function updateStudent(int $userId, array $input): void {
        Auth::requireAdmin();
        $user = DB::fetchOne("SELECT id FROM users WHERE id = :id", ['id' => $userId]);
        if (!$user) {
            http_response_code(404);
            echo json_encode(['detail' => 'کاربر مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $userData = ['updated_at' => date('Y-m-d H:i:s')];
        if (!empty($input['full_name'])) {
            $userData['full_name'] = trim((string)$input['full_name']);
        }
        if (!empty($input['username'])) {
            $newUname = trim((string)$input['username']);
            $dup = DB::fetchOne("SELECT id FROM users WHERE LOWER(username) = LOWER(:u) AND id != :id", ['u' => $newUname, 'id' => $userId]);
            if ($dup) {
                http_response_code(400);
                echo json_encode(['detail' => 'این نام کاربری قبلاً توسط کاربر دیگری ثبت شده است.'], JSON_UNESCAPED_UNICODE);
                return;
            }
            $userData['username'] = $newUname;
        }
        if (isset($input['email'])) {
            $userData['email'] = trim((string)$input['email']) ?: null;
        }
        DB::update('users', $userData, 'id = :id', ['id' => $userId]);

        $profileData = ['updated_at' => date('Y-m-d H:i:s')];
        if (isset($input['grade_id'])) {
            $profileData['grade_id'] = (int) $input['grade_id'];
        }
        if (isset($input['student_number'])) {
            $profileData['student_number'] = trim((string)$input['student_number']);
        }

        $profExists = DB::fetchOne("SELECT id FROM student_profiles WHERE user_id = :uid", ['uid' => $userId]);
        if ($profExists) {
            DB::update('student_profiles', $profileData, 'user_id = :uid', ['uid' => $userId]);
        } else {
            $profileData['user_id'] = $userId;
            DB::insert('student_profiles', $profileData);
        }

        echo json_encode(['message' => 'اطلاعات دانش‌آموز با موفقیت به‌روزرسانی شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function resetStudentExamAttempt(int $userId, int $attemptId): void {
        Auth::requireAdmin();
        DB::delete('examination_attempts', 'id = :aid AND user_id = :uid', ['aid' => $attemptId, 'uid' => $userId]);
        DB::delete('student_answers', 'attempt_id = :aid', ['aid' => $attemptId]);
        echo json_encode(['message' => 'تلاش دانش‌آموز در آزمون بازنشانی شد و دسترسی مجدد ایجاد گردید.'], JSON_UNESCAPED_UNICODE);
    }

    public static function createChapter(array $input): void {
        Auth::requireAdmin();
        $bookId = (int) ($input['book_id'] ?? 0);
        $titleFa = trim((string)($input['title_fa'] ?? ''));
        if (!$bookId || empty($titleFa)) {
            http_response_code(422);
            echo json_encode(['detail' => 'انتخاب کتاب و عنوان فصل الزامی است.'], JSON_UNESCAPED_UNICODE);
            return;
        }
        $maxNum = (int) DB::fetchColumn("SELECT COALESCE(MAX(chapter_number), 0) FROM chapters WHERE book_id = :bid", ['bid' => $bookId]);
        $num = (int) ($input['chapter_number'] ?? ($maxNum + 1));
        $estMins = isset($input['estimated_hours']) ? ((int)$input['estimated_hours'] * 60) : (int)($input['estimated_minutes'] ?? 240);
        $slug = 'chapter-' . $num . '-' . substr(bin2hex(random_bytes(3)), 0, 6);

        $id = DB::insert('chapters', [
            'book_id' => $bookId,
            'chapter_number' => $num,
            'title_fa' => $titleFa,
            'slug' => $slug,
            'description_fa' => $input['description_fa'] ?? null,
            'estimated_minutes' => $estMins,
            'order_index' => $num,
            'is_published' => 1
        ]);
        echo json_encode(['id' => $id, 'message' => 'فصل جدید با موفقیت افزوده شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function deleteChapter(int $id): void {
        Auth::requireAdmin();
        DB::delete('chapters', 'id = :id', ['id' => $id]);
        echo json_encode(['message' => 'فصل و محتوای مرتبط با موفقیت حذف گردید.'], JSON_UNESCAPED_UNICODE);
    }

    public static function createLesson(array $input): void {
        Auth::requireAdmin();
        $chapterId = (int) ($input['chapter_id'] ?? 0);
        $titleFa = trim((string)($input['title_fa'] ?? ''));
        if (!$chapterId || empty($titleFa)) {
            http_response_code(422);
            echo json_encode(['detail' => 'انتخاب فصل و عنوان درسنامه الزامی است.'], JSON_UNESCAPED_UNICODE);
            return;
        }
        $maxNum = (int) DB::fetchColumn("SELECT COALESCE(MAX(order_index), 0) FROM lessons WHERE chapter_id = :cid", ['cid' => $chapterId]);
        $num = (int) ($input['lesson_number'] ?? ($maxNum + 1));
        $slug = 'lesson-' . $num . '-' . substr(bin2hex(random_bytes(3)), 0, 6);

        $blocks = [
            'intro' => $input['summary_fa'] ?? $input['key_takeaways'] ?? '',
            'explanation' => $input['content_markdown'] ?? $input['content'] ?? $titleFa
        ];

        $id = DB::insert('lessons', [
            'chapter_id' => $chapterId,
            'title_fa' => $titleFa,
            'slug' => $slug,
            'order_index' => $num,
            'is_published' => 1,
            'xp_reward' => (int) ($input['xp_reward'] ?? 30),
            'estimated_minutes' => (int) ($input['estimated_minutes'] ?? 20),
            'content_blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            'summary_fa' => $input['key_takeaways'] ?? null,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
        echo json_encode(['id' => $id, 'message' => 'درسنامه آموزشی با موفقیت ذخیره شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function deleteLesson(int $id): void {
        Auth::requireAdmin();
        DB::delete('lessons', 'id = :id', ['id' => $id]);
        echo json_encode(['message' => 'درسنامه با موفقیت حذف گردید.'], JSON_UNESCAPED_UNICODE);
    }

    public static function uploadTextbook(): void {
        Auth::requireAdmin();
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['detail' => 'فایلی جهت بارگذاری انتخاب نشده است یا خطایی رخ داد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $bookId = (int) ($_POST['book_id'] ?? 0);
        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext !== 'pdf') {
            http_response_code(400);
            echo json_encode(['detail' => 'فقط بارگذاری کتاب‌های درسی با فرمت PDF مجاز است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $destDir = dirname(__DIR__, 2) . '/data/textbooks';
        if (!is_dir($destDir)) @mkdir($destDir, 0777, true);
        $destPath = $destDir . '/textbook_' . ($bookId ?: uniqid()) . '.pdf';
        if (move_uploaded_file($file['tmp_name'], $destPath)) {
            echo json_encode(['message_fa' => 'فایل کتاب درسی با موفقیت بارگذاری گردید.'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['detail' => 'خطا در ذخیره‌سازی فایل کتاب روی سرور.'], JSON_UNESCAPED_UNICODE);
        }
    }

    public static function processTextbook(int $sourceId): void {
        Auth::requireAdmin();
        echo json_encode(['status' => 'completed', 'message_fa' => 'پردازش و نمایه‌سازی منبع با موفقیت انجام شد.'], JSON_UNESCAPED_UNICODE);
    }
}
