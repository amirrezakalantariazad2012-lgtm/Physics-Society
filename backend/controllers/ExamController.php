<?php
/**
 * QUANTUM CUT — Exam Engine Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../services/ExamService.php';

class ExamController {
    public static function listExams(): void {
        $gradeId = isset($_GET['grade_id']) ? (int) $_GET['grade_id'] : null;
        $chapterId = isset($_GET['chapter_id']) ? (int) $_GET['chapter_id'] : null;

        $sql = "SELECT e.* FROM examinations e WHERE e.is_active = 1";
        $params = [];
        if ($gradeId) {
            $sql .= " AND e.grade_id = :gid";
            $params['gid'] = $gradeId;
        }
        if ($chapterId) {
            $sql .= " AND e.chapter_id = :cid";
            $params['cid'] = $chapterId;
        }

        $exams = DB::fetchAll($sql, $params);
        $results = [];
        foreach ($exams as $e) {
            $qCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM examination_questions WHERE exam_id = :eid", ['eid' => $e['id']]);
            $results[] = [
                'id' => (int) $e['id'],
                'title_fa' => $e['title_fa'],
                'description_fa' => $e['description_fa'],
                'exam_mode' => $e['exam_mode'],
                'duration_minutes' => (int) $e['duration_minutes'],
                'total_points' => (float) $e['total_points'],
                'passing_score' => (float) $e['passing_score'],
                'grade_id' => (int) $e['grade_id'],
                'chapter_id' => $e['chapter_id'] !== null ? (int) $e['chapter_id'] : null,
                'question_count' => $qCount
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function getMyHistory(): void {
        $user = Auth::requireAuth();
        $attempts = DB::fetchAll(
            "SELECT a.*, e.title_fa AS exam_title_fa
             FROM examination_attempts a
             JOIN examinations e ON e.id = a.exam_id
             WHERE a.user_id = :uid
             ORDER BY a.started_at DESC",
            ['uid' => $user['id']]
        );

        $results = [];
        foreach ($attempts as $a) {
            $results[] = [
                'attempt_id' => (int) $a['id'],
                'exam_id' => (int) $a['exam_id'],
                'exam_title_fa' => $a['exam_title_fa'],
                'started_at' => $a['started_at'],
                'submitted_at' => $a['submitted_at'],
                'final_score' => (float) $a['final_score'],
                'total_points' => (float) $a['total_possible_points'],
                'percentage' => (float) $a['percentage'],
                'is_passed' => (bool) $a['is_passed'],
                'status' => $a['status']
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function getExamInfo(int $examId): void {
        $e = DB::fetchOne("SELECT * FROM examinations WHERE id = :id", ['id' => $examId]);
        if (!$e) {
            http_response_code(404);
            echo json_encode(['detail' => 'آزمون مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $questions = DB::fetchAll(
            "SELECT q.*, eq.points AS exam_points, eq.order_index
             FROM examination_questions eq
             JOIN questions q ON q.id = eq.question_id
             WHERE eq.exam_id = :eid
             ORDER BY eq.order_index ASC",
            ['eid' => $examId]
        );

        $qResults = [];
        foreach ($questions as $q) {
            $options = [];
            if ($q['question_type'] === 'mcq') {
                $opts = DB::fetchAll(
                    "SELECT id, option_key, text_fa FROM question_options WHERE question_id = :qid ORDER BY option_key ASC",
                    ['qid' => $q['id']]
                );
                foreach ($opts as $o) {
                    $options[] = [
                        'id' => (int) $o['id'],
                        'option_key' => $o['option_key'],
                        'text_fa' => $o['text_fa']
                    ];
                }
            }

            $qResults[] = [
                'id' => (int) $q['id'],
                'question_type' => $q['question_type'],
                'prompt_fa' => $q['prompt_fa'],
                'points' => (float) $q['exam_points'],
                'time_limit_seconds' => (int) $q['time_limit_seconds'],
                'options' => $options
            ];
        }

        echo json_encode([
            'id' => (int) $e['id'],
            'title_fa' => $e['title_fa'],
            'description_fa' => $e['description_fa'],
            'exam_mode' => $e['exam_mode'],
            'duration_minutes' => (int) $e['duration_minutes'],
            'total_points' => (float) $e['total_points'],
            'passing_score' => (float) $e['passing_score'],
            'grade_id' => (int) $e['grade_id'],
            'questions' => $qResults
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function startExam(int $examId): void {
        $user = Auth::requireAuth();
        try {
            $attempt = ExamService::startAttempt($examId, (int) $user['id']);
            echo json_encode([
                'attempt_id' => (int) $attempt['id'],
                'exam_id' => (int) $attempt['exam_id'],
                'started_at' => $attempt['started_at'],
                'duration_minutes' => (int) DB::fetchColumn("SELECT duration_minutes FROM examinations WHERE id = :id", ['id' => $examId]),
                'status' => $attempt['status']
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $ex) {
            http_response_code(400);
            echo json_encode(['detail' => $ex->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public static function submitExam(array $input): void {
        $user = Auth::requireAuth();
        $attemptId = (int) ($input['attempt_id'] ?? 0);
        $answers = $input['answers'] ?? [];

        try {
            $attempt = ExamService::submitAttempt($attemptId, (int) $user['id'], $answers);
            echo json_encode([
                'attempt_id' => (int) $attempt['id'],
                'final_score' => (float) $attempt['final_score'],
                'total_possible_points' => (float) $attempt['total_possible_points'],
                'percentage' => (float) $attempt['percentage'],
                'is_passed' => (bool) $attempt['is_passed'],
                'status' => $attempt['status'],
                'feedback_fa' => $attempt['feedback_fa']
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $ex) {
            http_response_code(400);
            echo json_encode(['detail' => $ex->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public static function getAttemptDetail(int $attemptId): void {
        $user = Auth::requireAuth();
        $attempt = DB::fetchOne(
            "SELECT a.*, e.title_fa AS exam_title_fa
             FROM examination_attempts a
             JOIN examinations e ON e.id = a.exam_id
             WHERE a.id = :id AND (a.user_id = :uid OR :is_admin = 1)",
            ['id' => $attemptId, 'uid' => $user['id'], 'is_admin' => $user['role'] === 'admin' ? 1 : 0]
        );

        if (!$attempt) {
            http_response_code(404);
            echo json_encode(['detail' => 'نتیجه آزمون یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $answers = DB::fetchAll(
            "SELECT sa.*, q.prompt_fa, q.question_type
             FROM student_answers sa
             JOIN questions q ON q.id = sa.question_id
             WHERE sa.attempt_id = :aid",
            ['aid' => $attemptId]
        );

        echo json_encode([
            'attempt' => $attempt,
            'answers' => $answers
        ], JSON_UNESCAPED_UNICODE);
    }
}
