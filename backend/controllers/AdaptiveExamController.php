<?php
/**
 * QUANTUM CUT — Computerized Adaptive Testing (CAT) Controller
 * Item Response Calibration & Quantum Aptitude Index (Pure PHP 8.3)
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

class AdaptiveExamController {
    public const MAX_ADAPTIVE_QUESTIONS = 5;

    public static function start(array $input): void {
        DB::ensureAdvancedSchema();
        $user = Auth::getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['detail' => 'نیاز به احراز هویت است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $gradeId = (int)($input['grade_id'] ?? 7);

        // Fetch medium difficulty starter question
        $starter = DB::fetchOne(
            "SELECT id, prompt_fa, options_json, correct_answer, points, difficulty, chapter_id
             FROM questions
             WHERE question_type = 'mcq' AND (difficulty = 'medium' OR points BETWEEN 1.0 AND 1.5)
             ORDER BY RANDOM() LIMIT 1"
        );

        if (!$starter) {
            $starter = DB::fetchOne("SELECT id, prompt_fa, options_json, correct_answer, points, difficulty, chapter_id FROM questions WHERE question_type = 'mcq' ORDER BY RANDOM() LIMIT 1");
        }

        $sessionId = DB::insert('adaptive_test_sessions', [
            'user_id' => $user['id'],
            'grade_id' => $gradeId,
            'current_theta' => 0.0,
            'status' => 'in_progress',
            'questions_history_json' => json_encode([$starter['id']], JSON_UNESCAPED_UNICODE),
            'total_questions' => 1,
            'correct_count' => 0
        ]);

        echo json_encode([
            'status' => 'started',
            'session_id' => $sessionId,
            'step' => 1,
            'max_steps' => self::MAX_ADAPTIVE_QUESTIONS,
            'current_theta' => 0.0,
            'aptitude_badge' => 'در حال کالیبراسیون...',
            'question' => [
                'id' => $starter['id'],
                'prompt_fa' => $starter['prompt_fa'],
                'options' => json_decode($starter['options_json'] ?? '[]', true),
                'difficulty' => $starter['difficulty'] ?? 'medium'
            ]
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function next(array $input): void {
        DB::ensureAdvancedSchema();
        $user = Auth::getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['detail' => 'نیاز به احراز هویت است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $sessionId = (int)($input['session_id'] ?? 0);
        $qId = (int)($input['question_id'] ?? 0);
        $studentAnswer = trim((string)($input['answer'] ?? ''));

        $session = DB::fetchOne("SELECT * FROM adaptive_test_sessions WHERE id = :id AND user_id = :uid", ['id' => $sessionId, 'uid' => $user['id']]);
        if (!$session || $session['status'] !== 'in_progress') {
            http_response_code(400);
            echo json_encode(['detail' => 'نشست آزمون نامعتبر یا منقضی شده است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $question = DB::fetchOne("SELECT * FROM questions WHERE id = :id", ['id' => $qId]);
        if (!$question) {
            http_response_code(404);
            echo json_encode(['detail' => 'سوال مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $isCorrect = ($studentAnswer === trim((string)$question['correct_answer']));
        $history = json_decode($session['questions_history_json'] ?? '[]', true);
        if (!in_array($qId, $history, true)) {
            $history[] = $qId;
        }

        $theta = (float)$session['current_theta'];
        $correctCount = (int)$session['correct_count'] + ($isCorrect ? 1 : 0);

        // Adaptive update formula:
        // Item difficulty b: easy = -0.8, medium = 0.0, hard = +0.8
        $diff = $question['difficulty'] ?? 'medium';
        $b = match($diff) {
            'hard' => 0.8,
            'easy' => -0.8,
            default => 0.0
        };

        // Probability of correct response under Rasch model
        $prob = 1.0 / (1.0 + exp(-($theta - $b)));

        if ($isCorrect) {
            $theta += 0.45 * (1.0 - $prob);
        } else {
            $theta -= 0.45 * $prob;
            // Record misconception for teacher diagnostics
            if (!empty($question['chapter_id'])) {
                $ch = DB::fetchOne("SELECT title_fa FROM chapters WHERE id = :id", ['id' => $question['chapter_id']]);
                DB::query(
                    "INSERT INTO student_misconceptions (user_id, chapter_id, topic_name, misconception_text, error_count)
                     VALUES (:uid, :cid, :t, :m, 1)
                     ON CONFLICT(id) DO UPDATE SET error_count = error_count + 1",
                    [
                        'uid' => $user['id'],
                        'cid' => $question['chapter_id'],
                        't' => $ch['title_fa'] ?? 'فیزیک پایه',
                        'm' => "پاسخ اشتباه به سوال: {$question['prompt_fa']}"
                    ]
                );
            }
        }

        $totalDone = count($history);

        // Check if session reached end
        if ($totalDone >= self::MAX_ADAPTIVE_QUESTIONS) {
            $aptitude = match(true) {
                $theta >= 0.8 => 'استاد کوانتومی (سطح المپیاد کشوری)',
                $theta >= 0.2 => 'پژوهشگر فوتونی پیشرفته سمپاد',
                $theta >= -0.3 => 'دانش‌پژوه استاندارد فیزیک',
                default => 'نیازمند تثبیت و مرور مفاهیم پایه'
            };

            DB::update('adaptive_test_sessions', [
                'current_theta' => $theta,
                'status' => 'completed',
                'questions_history_json' => json_encode($history, JSON_UNESCAPED_UNICODE),
                'total_questions' => $totalDone,
                'correct_count' => $correctCount,
                'final_aptitude_label' => $aptitude,
                'completed_at' => date('Y-m-d H:i:s')
            ], 'id = :id', ['id' => $sessionId]);

            // Award adaptive XP bonus
            $xpEarned = 50 + ($correctCount * 25);
            DB::query("UPDATE student_profiles SET total_xp = total_xp + :xp WHERE user_id = :uid", ['xp' => $xpEarned, 'uid' => $user['id']]);

            echo json_encode([
                'status' => 'completed',
                'correct' => $isCorrect,
                'correct_answer' => $question['correct_answer'],
                'explanation' => $question['explanation_fa'] ?? 'تحلیل مفهومی بر اساس قوانین فیزیک ثبت شد.',
                'final_theta' => round($theta, 2),
                'correct_count' => $correctCount,
                'total_questions' => $totalDone,
                'aptitude_badge' => $aptitude,
                'xp_earned' => $xpEarned,
                'message' => "آزمون تطبیقی با موفقیت به پایان رسید. شاخص توانایی شما: {$aptitude}"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Pick next tailored question matching new theta
        $targetDifficulty = match(true) {
            $theta > 0.4 => 'hard',
            $theta < -0.4 => 'easy',
            default => 'medium'
        };

        $placeholders = implode(',', array_fill(0, count($history), '?'));
        $sql = "SELECT id, prompt_fa, options_json, correct_answer, points, difficulty, chapter_id
                FROM questions
                WHERE question_type = 'mcq' AND id NOT IN ($placeholders)
                ORDER BY CASE WHEN difficulty = ? THEN 0 ELSE 1 END, RANDOM()
                LIMIT 1";

        $params = array_merge($history, [$targetDifficulty]);
        $stmt = DB::getConnection()->prepare($sql);
        $stmt->execute($params);
        $nextQ = $stmt->fetch();

        if (!$nextQ) {
            // If exhausted matching difficulty, pick any unasked question
            $stmt2 = DB::getConnection()->prepare("SELECT id, prompt_fa, options_json, correct_answer, points, difficulty, chapter_id FROM questions WHERE id NOT IN ($placeholders) LIMIT 1");
            $stmt2->execute($history);
            $nextQ = $stmt2->fetch();
        }

        DB::update('adaptive_test_sessions', [
            'current_theta' => $theta,
            'questions_history_json' => json_encode($history, JSON_UNESCAPED_UNICODE),
            'total_questions' => $totalDone,
            'correct_count' => $correctCount
        ], 'id = :id', ['id' => $sessionId]);

        echo json_encode([
            'status' => 'in_progress',
            'last_correct' => $isCorrect,
            'last_explanation' => $question['explanation_fa'] ?? null,
            'step' => $totalDone + 1,
            'max_steps' => self::MAX_ADAPTIVE_QUESTIONS,
            'current_theta' => round($theta, 2),
            'target_difficulty' => $targetDifficulty,
            'question' => [
                'id' => $nextQ['id'],
                'prompt_fa' => $nextQ['prompt_fa'],
                'options' => json_decode($nextQ['options_json'] ?? '[]', true),
                'difficulty' => $nextQ['difficulty'] ?? 'medium'
            ]
        ], JSON_UNESCAPED_UNICODE);
    }
}
