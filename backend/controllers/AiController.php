<?php
/**
 * QUANTUM CUT — Nexora AI Educational Controller
 * Powered by Inferbase.ai & OpenAI GPT Oss 120B
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../services/AiService.php';

class AiController {
    public static function tutor(array $input): void {
        $user = Auth::getCurrentUser();
        $message = trim((string)($input['student_query'] ?? $input['message'] ?? $input['query'] ?? $input['prompt'] ?? ''));
        $gradeId = isset($input['grade_id']) ? (int) $input['grade_id'] : ($user['grade_id'] ?? null);
        $chapterId = isset($input['chapter_id']) ? (int) $input['chapter_id'] : null;
        $history = $input['conversation_history'] ?? [];
        $preferredModel = $input['preferred_model'] ?? null;

        if (empty($message)) {
            http_response_code(422);
            echo json_encode(['detail' => 'متن پرسش الزامی است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $context = $input['page_context'] ?? null;
        if ($chapterId && empty($context)) {
            $ch = DB::fetchOne("SELECT c.title_fa, b.title_fa AS book_title FROM chapters c JOIN books b ON b.id = c.book_id WHERE c.id = :id", ['id' => $chapterId]);
            if ($ch) {
                $context = "فصل {$ch['title_fa']} از کتاب {$ch['book_title']}";
            }
        }

        $result = AiService::askTutor($message, $context, $gradeId ? (int)$gradeId : null, $history, $preferredModel);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    public static function explainMistake(array $input): void {
        $prompt = $input['question_prompt'] ?? '';
        $userAns = $input['user_answer'] ?? '';
        $correctAns = $input['correct_answer'] ?? '';

        $query = "سوال: $prompt\nپاسخ انتخابی دانش‌آموز: $userAns\nپاسخ صحیح مسئله: $correctAns\nلطفاً به صورت علمی، دقیق و با ذکر فرمول فیزیک توضیح دهید چرا پاسخ دانش‌آموز اشتباه است و چگونه به پاسخ صحیح می‌رسیم.";

        $result = AiService::askTutor($query);
        echo json_encode([
            'response_fa' => $result['response_fa'],
            'explanation_fa' => $result['guidance_fa'],
            'model_used' => $result['model_used'],
            'model_name' => $result['model_name'],
            'key_physics_concept' => 'تحلیل کج‌فهمی‌های فیزیک بر پایه مدل ' . $result['model_name'],
            'related_formulas' => $result['related_formulas'] ?? []
        ], JSON_UNESCAPED_UNICODE);
    }
}
