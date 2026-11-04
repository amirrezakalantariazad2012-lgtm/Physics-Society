<?php
/**
 * QUANTUM CUT — Real-Time 1v1 Quantum Duel Controller
 * ELO Rating System & Real-Time Matchmaker (Pure PHP 8.3)
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

class DuelController {
    public static function findMatch(array $input): void {
        DB::ensureAdvancedSchema();
        $user = Auth::getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['detail' => 'نیاز به احراز هویت است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $gradeId = (int)($input['grade_id'] ?? 7);

        // 1. Look for existing open duel created by someone else
        $openDuel = DB::fetchOne(
            "SELECT * FROM quantum_duels 
             WHERE status = 'waiting' AND player1_id != :uid AND grade_id = :gid
             ORDER BY created_at ASC LIMIT 1",
            ['uid' => $user['id'], 'gid' => $gradeId]
        );

        if ($openDuel) {
            // Join as player 2
            DB::update('quantum_duels', [
                'player2_id' => $user['id'],
                'status' => 'in_progress'
            ], 'id = :id', ['id' => $openDuel['id']]);

            $p1 = DB::fetchOne("SELECT u.full_name, sp.elo_rating FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = :id", ['id' => $openDuel['player1_id']]);
            $questions = json_decode($openDuel['questions_json'], true);

            echo json_encode([
                'status' => 'matched',
                'duel_code' => $openDuel['duel_code'],
                'role' => 'player2',
                'opponent' => [
                    'name' => $p1['full_name'] ?? 'رقیب کوانتومی',
                    'elo' => $p1['elo_rating'] ?? 1200
                ],
                'questions' => $questions
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // 2. No open duel, create a new waiting room
        // Pick 3 random physics questions
        $questionsRaw = DB::fetchAll(
            "SELECT id, prompt_fa, options_json, correct_answer, time_limit_seconds, points
             FROM questions
             WHERE question_type = 'mcq'
             ORDER BY RANDOM() LIMIT 3"
        );

        if (empty($questionsRaw)) {
            // Fallback seed question if questions table is sparse
            $questionsRaw = [
                [
                    'id' => 99901,
                    'prompt_fa' => 'اگر جرم جسمی ۲ برابر و سرعت آن نصف شود، انرژی جنبشی آن چه تغییری می‌کند؟',
                    'options_json' => json_encode(['نصف می‌شود', 'ثابت می‌ماند', '۲ برابر می‌شود', '۴ برابر می‌شود'], JSON_UNESCAPED_UNICODE),
                    'correct_answer' => 'نصف می‌شود'
                ],
                [
                    'id' => 99902,
                    'prompt_fa' => 'کدام کمیت فیزیکی حاصل‌ضرب نیرو در جابه‌جایی در راستای نیرو است؟',
                    'options_json' => json_encode(['کار مکانیکی', 'توان', 'تکانه', 'فشار'], JSON_UNESCAPED_UNICODE),
                    'correct_answer' => 'کار مکانیکی'
                ],
                [
                    'id' => 99903,
                    'prompt_fa' => 'یکای استاندارد مقاومت الکتریکی در دستگاه بین‌المللی SI چیست؟',
                    'options_json' => json_encode(['اهم (Ω)', 'ولت (V)', 'آمپر (A)', 'وات (W)'], JSON_UNESCAPED_UNICODE),
                    'correct_answer' => 'اهم (Ω)'
                ]
            ];
        }

        $duelCode = 'QD-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));

        DB::insert('quantum_duels', [
            'duel_code' => $duelCode,
            'player1_id' => $user['id'],
            'grade_id' => $gradeId,
            'questions_json' => json_encode($questionsRaw, JSON_UNESCAPED_UNICODE),
            'status' => 'waiting'
        ]);

        echo json_encode([
            'status' => 'waiting',
            'duel_code' => $duelCode,
            'role' => 'player1',
            'message' => 'اتاق دوئل ایجاد شد. در انتظار حریف...',
            'questions' => $questionsRaw
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function state(string $code): void {
        DB::ensureAdvancedSchema();
        $user = Auth::getCurrentUser();
        $duel = DB::fetchOne("SELECT * FROM quantum_duels WHERE duel_code = :c", ['c' => $code]);
        if (!$duel) {
            http_response_code(404);
            echo json_encode(['detail' => 'دوئل یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $p1 = DB::fetchOne("SELECT u.full_name, sp.elo_rating FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = :id", ['id' => $duel['player1_id']]);
        $p2 = $duel['player2_id'] ? DB::fetchOne("SELECT u.full_name, sp.elo_rating FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id WHERE u.id = :id", ['id' => $duel['player2_id']]) : null;

        $winnerName = null;
        if ($duel['winner_id']) {
            $w = DB::fetchOne("SELECT full_name FROM users WHERE id = :id", ['id' => $duel['winner_id']]);
            $winnerName = $w['full_name'] ?? null;
        }

        echo json_encode([
            'duel_code' => $duel['duel_code'],
            'status' => $duel['status'],
            'player1' => ['name' => $p1['full_name'] ?? 'بازیکن ۱', 'elo' => $p1['elo_rating'] ?? 1200, 'score' => (float)$duel['p1_score'], 'submitted' => !empty($duel['p1_answers_json'])],
            'player2' => $p2 ? ['name' => $p2['full_name'], 'elo' => $p2['elo_rating'] ?? 1200, 'score' => (float)$duel['p2_score'], 'submitted' => !empty($duel['p2_answers_json'])] : null,
            'winner_id' => $duel['winner_id'],
            'winner_name' => $winnerName,
            'elo_change_p1' => (int)$duel['elo_change_p1'],
            'elo_change_p2' => (int)$duel['elo_change_p2'],
            'my_role' => ($user && $user['id'] === $duel['player1_id']) ? 'player1' : 'player2'
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function submit(array $input): void {
        DB::ensureAdvancedSchema();
        $user = Auth::getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['detail' => 'نیاز به احراز هویت است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $code = trim((string)($input['duel_code'] ?? ''));
        $answers = $input['answers'] ?? []; // map: question_id => student_answer
        $timeSpent = (float)($input['time_spent'] ?? 15.0);

        $duel = DB::fetchOne("SELECT * FROM quantum_duels WHERE duel_code = :c", ['c' => $code]);
        if (!$duel) {
            http_response_code(404);
            echo json_encode(['detail' => 'دوئل یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $questions = json_decode($duel['questions_json'], true);
        $score = 0;
        foreach ($questions as $q) {
            $qId = $q['id'];
            $ans = trim((string)($answers[$qId] ?? ''));
            if ($ans === trim((string)$q['correct_answer'])) {
                $score += 1;
            }
        }

        $isP1 = ($user['id'] === $duel['player1_id']);
        if ($isP1) {
            DB::update('quantum_duels', [
                'p1_score' => $score,
                'p1_time' => $timeSpent,
                'p1_answers_json' => json_encode($answers, JSON_UNESCAPED_UNICODE)
            ], 'id = :id', ['id' => $duel['id']]);
        } else {
            DB::update('quantum_duels', [
                'p2_score' => $score,
                'p2_time' => $timeSpent,
                'p2_answers_json' => json_encode($answers, JSON_UNESCAPED_UNICODE)
            ], 'id = :id', ['id' => $duel['id']]);
        }

        // Reload duel state
        $duel = DB::fetchOne("SELECT * FROM quantum_duels WHERE id = :id", ['id' => $duel['id']]);

        // If both submitted, resolve duel & ELO rating
        if (!empty($duel['p1_answers_json']) && !empty($duel['p2_answers_json']) && $duel['status'] !== 'completed') {
            self::resolveDuel($duel);
            $duel = DB::fetchOne("SELECT * FROM quantum_duels WHERE id = :id", ['id' => $duel['id']]);
        }

        echo json_encode([
            'status' => 'submitted',
            'my_score' => $score,
            'duel_completed' => ($duel['status'] === 'completed'),
            'winner_id' => $duel['winner_id']
        ], JSON_UNESCAPED_UNICODE);
    }

    private static function resolveDuel(array $duel): void {
        $p1Id = (int)$duel['player1_id'];
        $p2Id = (int)$duel['player2_id'];

        $s1 = (float)$duel['p1_score'];
        $s2 = (float)$duel['p2_score'];
        $t1 = (float)$duel['p1_time'];
        $t2 = (float)$duel['p2_time'];

        $winnerId = null;
        if ($s1 > $s2) {
            $winnerId = $p1Id;
        } elseif ($s2 > $s1) {
            $winnerId = $p2Id;
        } else {
            // Tiebreaker: faster time
            $winnerId = ($t1 <= $t2) ? $p1Id : $p2Id;
        }

        // ELO Calculation
        $elo1 = (int)DB::fetchColumn("SELECT elo_rating FROM student_profiles WHERE user_id = :id", ['id' => $p1Id]) ?: 1200;
        $elo2 = (int)DB::fetchColumn("SELECT elo_rating FROM student_profiles WHERE user_id = :id", ['id' => $p2Id]) ?: 1200;

        $k = 32;
        $expected1 = 1.0 / (1.0 + pow(10, ($elo2 - $elo1) / 400.0));
        $expected2 = 1.0 - $expected1;

        $actual1 = ($winnerId === $p1Id) ? 1.0 : (($winnerId === null) ? 0.5 : 0.0);
        $actual2 = 1.0 - $actual1;

        $dElo1 = (int)round($k * ($actual1 - $expected1));
        $dElo2 = (int)round($k * ($actual2 - $expected2));

        // Update ratings
        DB::query("UPDATE student_profiles SET elo_rating = MAX(800, elo_rating + :delo) WHERE user_id = :id", ['delo' => $dElo1, 'id' => $p1Id]);
        DB::query("UPDATE student_profiles SET elo_rating = MAX(800, elo_rating + :delo) WHERE user_id = :id", ['delo' => $dElo2, 'id' => $p2Id]);

        // Award XP
        DB::query("UPDATE student_profiles SET total_xp = total_xp + :xp WHERE user_id = :id", ['xp' => ($winnerId === $p1Id ? 100 : 40), 'id' => $p1Id]);
        DB::query("UPDATE student_profiles SET total_xp = total_xp + :xp WHERE user_id = :id", ['xp' => ($winnerId === $p2Id ? 100 : 40), 'id' => $p2Id]);

        DB::update('quantum_duels', [
            'status' => 'completed',
            'winner_id' => $winnerId,
            'elo_change_p1' => $dElo1,
            'elo_change_p2' => $dElo2,
            'completed_at' => date('Y-m-d H:i:s')
        ], 'id = :id', ['id' => $duel['id']]);
    }

    public static function getLeaderboard(): void {
        self::leaderboard();
    }

    public static function leaderboard(): void {
        DB::ensureAdvancedSchema();
        $leaders = DB::fetchAll(
            "SELECT u.full_name, u.username, sp.elo_rating, sp.total_xp, sp.current_level,
                    g.name AS guild_name, g.theme_color AS guild_color
             FROM student_profiles sp
             JOIN users u ON u.id = sp.user_id
             LEFT JOIN guilds g ON g.id = sp.guild_id
             ORDER BY sp.elo_rating DESC, sp.total_xp DESC
             LIMIT 25"
        );

        echo json_encode([
            'status' => 'success',
            'leaders' => $leaders
        ], JSON_UNESCAPED_UNICODE);
    }
}
