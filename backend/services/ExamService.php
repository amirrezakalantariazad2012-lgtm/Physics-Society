<?php
/**
 * QUANTUM CUT — Exam Evaluation & Automated Scoring Engine
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/GamificationService.php';

class ExamService {
    public static function startAttempt(int $examId, int $userId): array {
        $exam = DB::fetchOne("SELECT * FROM examinations WHERE id = :id AND is_active = 1", ['id' => $examId]);
        if (!$exam) {
            throw new Exception("آزمون مورد نظر یافت نشد یا غیرفعال است.");
        }

        $prevAttempts = (int) DB::fetchColumn(
            "SELECT COUNT(*) FROM examination_attempts WHERE exam_id = :eid AND user_id = :uid",
            ['eid' => $examId, 'uid' => $userId]
        );

        $attemptId = DB::insert('examination_attempts', [
            'exam_id' => $examId,
            'user_id' => $userId,
            'attempt_number' => $prevAttempts + 1,
            'started_at' => date('Y-m-d H:i:s'),
            'status' => 'in_progress',
            'total_possible_points' => (float) $exam['total_points']
        ]);

        return DB::fetchOne("SELECT * FROM examination_attempts WHERE id = :id", ['id' => $attemptId]);
    }

    public static function submitAttempt(int $attemptId, int $userId, array $answers): array {
        $attempt = DB::fetchOne(
            "SELECT a.*, e.duration_minutes, e.passing_score, e.title_fa AS exam_title
             FROM examination_attempts a
             JOIN examinations e ON e.id = a.exam_id
             WHERE a.id = :id AND a.user_id = :uid",
            ['id' => $attemptId, 'uid' => $userId]
        );

        if (!$attempt) {
            throw new Exception("شناسه آزمون نامعتبر است.");
        }

        if ($attempt['status'] !== 'in_progress') {
            return $attempt; // Idempotent return
        }

        $answersMap = [];
        foreach ($answers as $ans) {
            if (isset($ans['question_id'])) {
                $answersMap[(int) $ans['question_id']] = $ans;
            }
        }

        $examQuestions = DB::fetchAll(
            "SELECT eq.*, q.question_type, q.prompt_fa
             FROM examination_questions eq
             JOIN questions q ON q.id = eq.question_id
             WHERE eq.exam_id = :eid
             ORDER BY eq.order_index ASC",
            ['eid' => $attempt['exam_id']]
        );

        $autoScore = 0.0;
        $totalPossible = 0.0;

        foreach ($examQuestions as $eq) {
            $qId = (int) $eq['question_id'];
            $qPoints = (float) $eq['points'];
            $totalPossible += $qPoints;

            $userAns = $answersMap[$qId] ?? [];
            $selectedOpt = $userAns['selected_option_key'] ?? null;
            $writtenText = $userAns['written_response_text'] ?? '';

            $isCorrect = false;
            $scored = 0.0;
            $feedback = '';

            if ($eq['question_type'] === 'mcq') {
                $correctOpt = DB::fetchOne(
                    "SELECT option_key, explanation_fa FROM question_options WHERE question_id = :qid AND is_correct = 1",
                    ['qid' => $qId]
                );

                if ($correctOpt && $selectedOpt !== null && trim((string)$selectedOpt) === trim((string)$correctOpt['option_key'])) {
                    $isCorrect = true;
                    $scored = $qPoints;
                    $feedback = 'پاسخ صحیح است.';
                    $autoScore += $qPoints;
                } else {
                    $exp = $correctOpt['explanation_fa'] ?? '';
                    $correctKey = $correctOpt['option_key'] ?? '-';
                    $feedback = "پاسخ نادرست است. گزینه درست: $correctKey. $exp";
                }
            } else {
                // Written question baseline evaluation
                if (mb_strlen(trim($writtenText)) > 15) {
                    $scored = round($qPoints * 0.75, 2);
                    $feedback = "پاسخ تشریحی دریافت شد و نمره اولیه ثبت گردید.";
                    $autoScore += $scored;
                } else {
                    $feedback = "پاسخ ناقص یا بسیار کوتاه است.";
                }
            }

            DB::insert('student_answers', [
                'attempt_id' => $attemptId,
                'question_id' => $qId,
                'selected_option_key' => $selectedOpt,
                'written_response_text' => $writtenText,
                'auto_score' => $scored,
                'final_score' => $scored,
                'max_score' => $qPoints,
                'is_correct' => $isCorrect ? 1 : 0,
                'review_status' => 'auto',
                'feedback_fa' => $feedback
            ]);
        }

        $finalScore = round($autoScore, 2);
        $percentage = round(($finalScore / max(1.0, $totalPossible)) * 100.0, 1);
        $isPassed = ($finalScore >= (float) $attempt['passing_score']);

        $now = date('Y-m-d H:i:s');
        $status = 'reviewed';

        // Server-side anti-cheat: check if exceeded duration
        $startedTs = strtotime($attempt['started_at']);
        $elapsedSeconds = time() - $startedTs;
        $maxAllowed = (((int) $attempt['duration_minutes']) * 60) + 180; // 3 min grace
        $feedbackMsg = "آزمون با موفقیت ثبت شد. نمره کل: $finalScore از $totalPossible ({$percentage}٪)";

        if ($elapsedSeconds > $maxAllowed) {
            $status = 'expired';
            $isPassed = false;
            $feedbackMsg = "آزمون خارج از مهلت زمانی مجاز ارسال شده است و به عنوان منقضی ثبت گردید.";
        }

        DB::update('examination_attempts', [
            'submitted_at' => $now,
            'auto_graded_score' => $finalScore,
            'final_score' => $finalScore,
            'total_possible_points' => round($totalPossible, 2),
            'percentage' => $percentage,
            'is_passed' => $isPassed ? 1 : 0,
            'status' => $status,
            'feedback_fa' => $feedbackMsg
        ], 'id = :id', ['id' => $attemptId]);

        GamificationService::recordStreak($userId);
        $earnedXp = $isPassed ? (int) ($finalScore * 5) : max(10, (int) ($finalScore * 2));
        GamificationService::awardXp(
            $userId,
            $earnedXp,
            $isPassed ? 'exam_passed' : 'exam_participation',
            "آزمون فیزیک: {$attempt['exam_title']} (نمره: $finalScore)",
            "exam_attempt_{$attemptId}"
        );

        return DB::fetchOne("SELECT * FROM examination_attempts WHERE id = :id", ['id' => $attemptId]);
    }
}
