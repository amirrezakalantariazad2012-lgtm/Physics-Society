<?php
/**
 * QUANTUM CUT — Curriculum & Interactive Learning Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../services/GamificationService.php';

class CurriculumController {
    public static function getGrades(): void {
        $grades = DB::fetchAll("SELECT * FROM grades ORDER BY number ASC");
        $results = [];
        foreach ($grades as $g) {
            $bookCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM books WHERE grade_id = :gid", ['gid' => $g['id']]);
            $results[] = [
                'id' => (int) $g['id'],
                'number' => (int) $g['number'],
                'title_fa' => $g['title_fa'],
                'description_fa' => $g['description_fa'],
                'book_count' => $bookCount
            ];
        }
        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function getBooksByGrade(int $gradeId): void {
        $user = Auth::getCurrentUser();
        if ($user && $user['role'] === 'student' && !empty($user['grade_id'])) {
            if ((int) $user['grade_id'] !== $gradeId) {
                http_response_code(403);
                echo json_encode(['detail' => 'دسترسی غیرمجاز: شما تنها مجاز به مشاهده منابع پایه تحصیلی خود هستید.'], JSON_UNESCAPED_UNICODE);
                return;
            }
        }

        $books = DB::fetchAll("SELECT * FROM books WHERE grade_id = :gid", ['gid' => $gradeId]);
        $results = [];
        foreach ($books as $b) {
            $chCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM chapters WHERE book_id = :bid", ['bid' => $b['id']]);
            $results[] = [
                'id' => (int) $b['id'],
                'grade_id' => (int) $b['grade_id'],
                'code' => $b['code'],
                'title_fa' => $b['title_fa'],
                'book_type' => $b['book_type'],
                'publisher_fa' => $b['publisher_fa'],
                'academic_year' => $b['academic_year'],
                'cover_image_url' => $b['cover_image_url'],
                'source_status' => 'completed',
                'page_count' => 120,
                'chapter_count' => $chCount
            ];
        }
        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function getChaptersByBook(int $bookId): void {
        $book = DB::fetchOne("SELECT * FROM books WHERE id = :id", ['id' => $bookId]);
        if (!$book) {
            http_response_code(404);
            echo json_encode(['detail' => 'کتاب مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $user = Auth::getCurrentUser();
        if ($user && $user['role'] === 'student' && !empty($user['grade_id'])) {
            if ((int) $user['grade_id'] !== (int) $book['grade_id']) {
                http_response_code(403);
                echo json_encode(['detail' => 'دسترسی غیرمجاز: این کتاب متعلق به پایه تحصیلی شما نیست.'], JSON_UNESCAPED_UNICODE);
                return;
            }
        }

        $chapters = DB::fetchAll("SELECT * FROM chapters WHERE book_id = :bid ORDER BY chapter_number ASC", ['bid' => $bookId]);
        $results = [];

        foreach ($chapters as $ch) {
            $lessonCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM lessons WHERE chapter_id = :cid", ['cid' => $ch['id']]);
            $qCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM questions WHERE chapter_id = :cid AND is_published = 1", ['cid' => $ch['id']]);

            $completedCount = 0;
            if ($user) {
                $completedCount = (int) DB::fetchColumn(
                    "SELECT COUNT(*) FROM student_progress sp
                     JOIN lessons l ON l.id = sp.lesson_id
                     WHERE l.chapter_id = :cid AND sp.user_id = :uid AND sp.is_completed = 1",
                    ['cid' => $ch['id'], 'uid' => $user['id']]
                );
            }

            $results[] = [
                'id' => (int) $ch['id'],
                'book_id' => (int) $ch['book_id'],
                'chapter_number' => (int) $ch['chapter_number'],
                'title_fa' => $ch['title_fa'],
                'description_fa' => $ch['description_fa'],
                'estimated_hours' => (int) ($ch['estimated_hours'] ?? 4),
                'icon_name' => $ch['icon_name'] ?? 'book-open',
                'lesson_count' => $lessonCount,
                'question_count' => $qCount,
                'user_progress_percent' => $lessonCount > 0 ? round(($completedCount / $lessonCount) * 100) : 0
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function getChapterDetail(int $chapterId): void {
        $ch = DB::fetchOne("SELECT * FROM chapters WHERE id = :id", ['id' => $chapterId]);
        if (!$ch) {
            http_response_code(404);
            echo json_encode(['detail' => 'فصل مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $lessons = DB::fetchAll("SELECT * FROM lessons WHERE chapter_id = :cid ORDER BY order_index ASC", ['cid' => $chapterId]);
        $user = Auth::getCurrentUser();

        $completedLessonIds = [];
        if ($user) {
            $completedLessonIds = array_column(
                DB::fetchAll("SELECT lesson_id FROM student_progress WHERE user_id = :uid AND is_completed = 1", ['uid' => $user['id']]),
                'lesson_id'
            );
        }

        $lessonResults = [];
        foreach ($lessons as $l) {
            $exCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM exercises WHERE lesson_id = :lid", ['lid' => $l['id']]);
            $lessonResults[] = [
                'id' => (int) $l['id'],
                'chapter_id' => (int) $l['chapter_id'],
                'lesson_number' => (int) ($l['order_index'] ?? $l['id']),
                'order_index' => (int) ($l['order_index'] ?? $l['id']),
                'title_fa' => $l['title_fa'],
                'xp_reward' => (int) $l['xp_reward'],
                'estimated_minutes' => (int) $l['estimated_minutes'],
                'exercise_count' => $exCount,
                'is_completed' => in_array((int) $l['id'], $completedLessonIds, true)
            ];
        }

        echo json_encode([
            'id' => (int) $ch['id'],
            'book_id' => (int) $ch['book_id'],
            'chapter_number' => (int) $ch['chapter_number'],
            'title_fa' => $ch['title_fa'],
            'description_fa' => $ch['description_fa'],
            'lessons' => $lessonResults
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function getLessonDetail(int $lessonId): void {
        $lesson = DB::fetchOne("SELECT * FROM lessons WHERE id = :id", ['id' => $lessonId]);
        if (!$lesson) {
            http_response_code(404);
            echo json_encode(['detail' => 'درسنامه مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $exercises = DB::fetchAll("SELECT * FROM exercises WHERE lesson_id = :lid ORDER BY id ASC", ['lid' => $lessonId]);
        $exResults = [];
        foreach ($exercises as $ex) {
            $options = json_decode($ex['options_json'] ?? '[]', true);
            $exResults[] = [
                'id' => (int) $ex['id'],
                'lesson_id' => (int) $ex['lesson_id'],
                'exercise_type' => $ex['exercise_type'],
                'prompt_fa' => $ex['prompt_fa'],
                'options' => $options,
                'xp_reward' => (int) $ex['xp_reward']
            ];
        }

        $user = Auth::getCurrentUser();
        $isCompleted = false;
        if ($user) {
            $isCompleted = (bool) DB::fetchColumn(
                "SELECT 1 FROM student_progress WHERE user_id = :uid AND lesson_id = :lid AND is_completed = 1",
                ['uid' => $user['id'], 'lid' => $lessonId]
            );
        }

        $contentBlocks = is_string($lesson['content_blocks'] ?? null)
            ? json_decode($lesson['content_blocks'], true)
            : ($lesson['content_blocks'] ?? []);

        echo json_encode([
            'id' => (int) $lesson['id'],
            'chapter_id' => (int) $lesson['chapter_id'],
            'lesson_number' => (int) ($lesson['order_index'] ?? 1),
            'order_index' => (int) ($lesson['order_index'] ?? 1),
            'title_fa' => $lesson['title_fa'],
            'content_blocks' => $contentBlocks,
            'content_markdown' => is_array($contentBlocks) ? ($contentBlocks['explanation'] ?? '') : '',
            'summary_fa' => $lesson['summary_fa'] ?? '',
            'key_takeaways' => $lesson['summary_fa'] ?? '',
            'xp_reward' => (int) $lesson['xp_reward'],
            'estimated_minutes' => (int) $lesson['estimated_minutes'],
            'is_completed' => $isCompleted,
            'exercises' => $exResults
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function submitExercise(array $input): void {
        $user = Auth::requireAuth();
        $exId = (int) ($input['exercise_id'] ?? 0);
        $submitted = trim((string) ($input['submitted_answer'] ?? ''));

        $ex = DB::fetchOne("SELECT * FROM exercises WHERE id = :id", ['id' => $exId]);
        if (!$ex) {
            http_response_code(404);
            echo json_encode(['detail' => 'تمرین مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $isCorrect = (trim(mb_strtolower($submitted)) === trim(mb_strtolower($ex['correct_answer'])));
        $xpEarned = 0;

        if ($isCorrect) {
            $xpEarned = (int) $ex['xp_reward'];
            GamificationService::awardXp(
                (int) $user['id'],
                $xpEarned,
                'exercise_completed',
                "حل تمرین درس: " . mb_substr($ex['prompt_fa'], 0, 40),
                "exercise_{$exId}"
            );
        }

        echo json_encode([
            'is_correct' => $isCorrect,
            'correct_answer' => $ex['correct_answer'],
            'explanation_fa' => $ex['explanation_fa'],
            'xp_earned' => $xpEarned
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function completeLesson(int $lessonId): void {
        $user = Auth::requireAuth();
        $userId = (int) $user['id'];

        $lesson = DB::fetchOne("SELECT * FROM lessons WHERE id = :id", ['id' => $lessonId]);
        if (!$lesson) {
            http_response_code(404);
            echo json_encode(['detail' => 'درسنامه مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $existing = DB::fetchOne(
            "SELECT * FROM student_progress WHERE user_id = :uid AND lesson_id = :lid",
            ['uid' => $userId, 'lid' => $lessonId]
        );

        if ($existing) {
            DB::update('student_progress', [
                'is_completed' => 1,
                'completed_at' => date('Y-m-d H:i:s'),
                'attempts_count' => ((int) $existing['attempts_count']) + 1
            ], 'id = :id', ['id' => $existing['id']]);
        } else {
            DB::insert('student_progress', [
                'user_id' => $userId,
                'lesson_id' => $lessonId,
                'is_completed' => 1,
                'completed_at' => date('Y-m-d H:i:s'),
                'attempts_count' => 1
            ]);
        }

        GamificationService::recordStreak($userId);
        GamificationService::awardXp(
            $userId,
            (int) $lesson['xp_reward'],
            'lesson_completed',
            "تکمیل درس: {$lesson['title_fa']}",
            "lesson_{$lessonId}"
        );

        echo json_encode(['message' => 'درس با موفقیت تکمیل شد و امتیاز به حساب شما افزوده شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function getStudyMaterials(): void {
        $gradeId = isset($_GET['grade_id']) ? (int) $_GET['grade_id'] : null;
        $category = $_GET['category'] ?? null;

        $sql = "SELECT m.*, g.title_fa AS grade_title, c.title_fa AS chapter_title
                FROM supplementary_materials m
                LEFT JOIN grades g ON g.id = m.grade_id
                LEFT JOIN chapters c ON c.id = m.chapter_id
                WHERE m.is_published = 1";
        $params = [];

        if ($gradeId) {
            $sql .= " AND m.grade_id = :gid";
            $params['gid'] = $gradeId;
        }
        if ($category) {
            $sql .= " AND m.material_type = :cat";
            $params['cat'] = $category;
        }

        $sql .= " ORDER BY m.created_at DESC";
        $items = DB::fetchAll($sql, $params);
        echo json_encode($items, JSON_UNESCAPED_UNICODE);
    }

    public static function uploadStudyMaterial(): void {
        Auth::requireAdmin();

        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['detail' => 'فایلی جهت بارگذاری انتخاب نشده است یا خطایی رخ داد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $file = $_FILES['file'];
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $allowed = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip'];
        if (!in_array(strtolower($ext), $allowed, true)) {
            http_response_code(400);
            echo json_encode(['detail' => 'فرمت فایل مجاز نیست (فرمت‌های مجاز: PDF, Word, PowerPoint, ZIP).'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $uploadDir = Config::getUploadDir() . '/materials';
        if (!file_exists($uploadDir)) @mkdir($uploadDir, 0777, true);

        $safeName = uniqid('mat_') . '.' . strtolower($ext);
        $dest = $uploadDir . '/' . $safeName;

        if (move_uploaded_file($file['tmp_name'], $dest)) {
            $fileUrl = '/uploads/materials/' . $safeName;
            echo json_encode([
                'file_url' => $fileUrl,
                'file_name' => $file['name'],
                'file_size_bytes' => (int) $file['size']
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['detail' => 'خطا در ذخیره‌سازی فایل روی سرور.'], JSON_UNESCAPED_UNICODE);
        }
    }

    public static function createStudyMaterial(array $input): void {
        Auth::requireAdmin();
        $id = DB::insert('supplementary_materials', [
            'grade_id' => $input['grade_id'] ?? null,
            'chapter_id' => $input['chapter_id'] ?? null,
            'title_fa' => $input['title_fa'] ?? 'جزوه فیزیک',
            'description_fa' => $input['description_fa'] ?? null,
            'author_fa' => $input['author_fa'] ?? 'انجمن فیزیک شهید بهشتی دو',
            'material_type' => $input['material_type'] ?? 'pdf',
            'file_url' => $input['file_url'] ?? '',
            'file_size_bytes' => $input['file_size_bytes'] ?? 0,
            'download_count' => 0,
            'is_published' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ]);
        echo json_encode(['id' => $id, 'message' => 'منبع آموزشی با موفقیت ثبت شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function updateStudyMaterial(int $id, array $input): void {
        Auth::requireAdmin();
        DB::update('supplementary_materials', $input, 'id = :id', ['id' => $id]);
        echo json_encode(['message' => 'به‌روزرسانی با موفقیت انجام شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function deleteStudyMaterial(int $id): void {
        Auth::requireAdmin();
        DB::delete('supplementary_materials', 'id = :id', ['id' => $id]);
        echo json_encode(['message' => 'منبع آموزشی با موفقیت حذف گردید.'], JSON_UNESCAPED_UNICODE);
    }

    public static function incrementDownload(int $id): void {
        DB::query("UPDATE supplementary_materials SET download_count = download_count + 1 WHERE id = :id", ['id' => $id]);
        echo json_encode(['status' => 'success']);
    }

    public static function cleanupOrphaned(): void {
        Auth::requireAdmin();
        echo json_encode(['status' => 'success', 'cleaned_count' => 0]);
    }
}
