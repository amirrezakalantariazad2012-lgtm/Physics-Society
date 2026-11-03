<?php
/**
 * QUANTUM CUT — Quantum Competitions & League Arena Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../services/GamificationService.php';

class CompetitionController {
    public static function listCompetitions(): void {
        $user = Auth::getCurrentUser();
        $leagueType = $_GET['league_type'] ?? null;
        $gradeId = isset($_GET['grade_id']) ? (int) $_GET['grade_id'] : null;

        $sql = "SELECT c.*, g.title_fa AS grade_title_fa
                FROM competitions c
                LEFT JOIN grades g ON g.id = c.grade_id
                WHERE c.is_published = 1";
        $params = [];

        if ($leagueType) {
            $sql .= " AND c.league_type = :lt";
            $params['lt'] = $leagueType;
        }
        if ($gradeId) {
            $sql .= " AND (c.grade_id = :gid OR c.grade_id IS NULL)";
            $params['gid'] = $gradeId;
        }

        $sql .= " ORDER BY c.starts_at DESC";
        $competitions = DB::fetchAll($sql, $params);
        $now = date('Y-m-d H:i:s');
        $results = [];

        foreach ($competitions as $c) {
            $isActive = ($c['starts_at'] <= $now && $now <= $c['ends_at']) && !(bool) $c['is_closed'];
            $pCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM competition_submissions WHERE competition_id = :cid", ['cid' => $c['id']]);

            $userSub = null;
            if ($user) {
                $userSub = DB::fetchOne(
                    "SELECT * FROM competition_submissions WHERE competition_id = :cid AND user_id = :uid",
                    ['cid' => $c['id'], 'uid' => $user['id']]
                );
            }

            $results[] = [
                'id' => (int) $c['id'],
                'grade_id' => $c['grade_id'] !== null ? (int) $c['grade_id'] : null,
                'grade_title_fa' => $c['grade_title_fa'] ?? 'تمامی پایه‌ها (عمومی)',
                'title_fa' => $c['title_fa'],
                'description_fa' => $c['description_fa'],
                'theme_fa' => $c['theme_fa'],
                'league_type' => $c['league_type'] ?? 'weekly',
                'league_tier' => $c['league_tier'] ?? 'quantum',
                'duration_minutes' => (int) ($c['duration_minutes'] ?? 45),
                'has_negative_marking' => (bool) ($c['has_negative_marking'] ?? false),
                'status' => $c['status'] ?? 'active',
                'starts_at' => $c['starts_at'],
                'ends_at' => $c['ends_at'],
                'is_active' => $isActive,
                'is_closed' => (bool) $c['is_closed'] || ($now > $c['ends_at']),
                'solutions_published' => (bool) ($c['solutions_published'] ?? false),
                'participant_count' => $pCount,
                'user_submitted' => ($userSub !== null),
                'user_score' => $userSub ? (float) $userSub['score'] : null,
                'user_rank' => $userSub ? ($userSub['final_rank'] !== null ? (int) $userSub['final_rank'] : null) : null
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function getCompetition(int $id): void {
        $c = DB::fetchOne("SELECT * FROM competitions WHERE id = :id", ['id' => $id]);
        if (!$c) {
            http_response_code(404);
            echo json_encode(['detail' => 'مسابقه مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $questions = DB::fetchAll(
            "SELECT q.*, cq.points AS comp_points, cq.order_index
             FROM competition_questions cq
             JOIN questions q ON q.id = cq.question_id
             WHERE cq.competition_id = :cid
             ORDER BY cq.order_index ASC",
            ['cid' => $id]
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
                'points' => (float) $q['comp_points'],
                'time_limit_seconds' => (int) $q['time_limit_seconds'],
                'options' => $options
            ];
        }

        echo json_encode([
            'id' => (int) $c['id'],
            'title_fa' => $c['title_fa'],
            'description_fa' => $c['description_fa'],
            'duration_minutes' => (int) ($c['duration_minutes'] ?? 45),
            'has_negative_marking' => (bool) ($c['has_negative_marking'] ?? false),
            'starts_at' => $c['starts_at'],
            'ends_at' => $c['ends_at'],
            'official_solution_fa' => (bool) ($c['solutions_published'] ?? false) ? $c['official_solution_fa'] : null,
            'questions' => $qResults
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function submitCompetition(int $id, array $input): void {
        $user = Auth::requireAuth();
        $userId = (int) $user['id'];

        $comp = DB::fetchOne("SELECT * FROM competitions WHERE id = :id", ['id' => $id]);
        if (!$comp) {
            http_response_code(404);
            echo json_encode(['detail' => 'مسابقه یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $now = date('Y-m-d H:i:s');
        if ($now > $comp['ends_at'] || (bool) $comp['is_closed']) {
            http_response_code(400);
            echo json_encode(['detail' => 'مهلت ارسال پاسخ در این رقابت به پایان رسیده است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $answers = $input['answers'] ?? [];
        $timeSpent = max(1, (int) ($input['time_spent_seconds'] ?? 0));
        $maxTimeAllowed = (((int) ($comp['duration_minutes'] ?? 45)) * 60) + 120;
        $timeSpent = min($timeSpent, $maxTimeAllowed);

        $compQuestions = DB::fetchAll(
            "SELECT cq.*, q.question_type FROM competition_questions cq
             JOIN questions q ON q.id = cq.question_id
             WHERE cq.competition_id = :cid",
            ['cid' => $id]
        );

        $totalScore = 0.0;
        $hasNeg = (bool) ($comp['has_negative_marking'] ?? false);
        $negRatio = (float) ($comp['negative_ratio'] ?? 0.33);

        foreach ($compQuestions as $cq) {
            $qId = (int) $cq['question_id'];
            $qPoints = (float) $cq['points'];
            $userAns = $answers[$qId] ?? null;

            if ($userAns === null || $userAns === '') continue;

            $correctOpt = DB::fetchOne(
                "SELECT option_key FROM question_options WHERE question_id = :qid AND is_correct = 1",
                ['qid' => $qId]
            );

            if ($correctOpt && trim((string)$userAns) === trim((string)$correctOpt['option_key'])) {
                $totalScore += $qPoints;
            } else {
                if ($hasNeg) {
                    $totalScore -= round($qPoints * $negRatio, 2);
                }
            }
        }

        $totalScore = max(0.0, round($totalScore, 2));

        $existing = DB::fetchOne(
            "SELECT id FROM competition_submissions WHERE competition_id = :cid AND user_id = :uid",
            ['cid' => $id, 'uid' => $userId]
        );

        if ($existing) {
            DB::update('competition_submissions', [
                'answers_json' => json_encode($answers),
                'submitted_at' => $now,
                'time_spent_seconds' => $timeSpent,
                'score' => $totalScore
            ], 'id = :id', ['id' => $existing['id']]);
            $subId = $existing['id'];
        } else {
            $subId = DB::insert('competition_submissions', [
                'competition_id' => $id,
                'user_id' => $userId,
                'answers_json' => json_encode($answers),
                'submitted_at' => $now,
                'time_spent_seconds' => $timeSpent,
                'score' => $totalScore
            ]);
        }

        GamificationService::recordStreak($userId);
        GamificationService::awardXp(
            $userId,
            (int) ($comp['xp_participation'] ?? 20),
            'competition_reward',
            "شرکت در رقابت کوانتومی: {$comp['title_fa']}",
            "comp_{$id}_{$userId}"
        );

        echo json_encode([
            'submission_id' => $subId,
            'score' => $totalScore,
            'time_spent_seconds' => $timeSpent,
            'message' => 'پاسخ‌های شما با موفقیت در آرنای کوانتوم ثبت شد!'
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function getLeaderboard(int $id): void {
        $subs = DB::fetchAll(
            "SELECT s.*, u.full_name, u.display_name, u.username, p.current_level, p.total_xp
             FROM competition_submissions s
             JOIN users u ON u.id = s.user_id
             LEFT JOIN student_profiles p ON p.user_id = u.id
             WHERE s.competition_id = :cid
             ORDER BY s.score DESC, s.time_spent_seconds ASC, s.submitted_at ASC",
            ['cid' => $id]
        );

        $results = [];
        $rank = 1;
        foreach ($subs as $s) {
            $results[] = [
                'rank' => $rank++,
                'user_id' => (int) $s['user_id'],
                'full_name' => $s['full_name'],
                'display_name' => $s['display_name'] ?? $s['full_name'],
                'username' => $s['username'],
                'score' => (float) $s['score'],
                'time_spent_seconds' => (int) $s['time_spent_seconds'],
                'level' => (int) ($s['current_level'] ?? 1),
                'submitted_at' => $s['submitted_at']
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function getStandings(): void {
        $leagueType = $_GET['league_type'] ?? 'weekly';
        $topStudents = DB::fetchAll(
            "SELECT u.id, u.full_name, u.display_name, u.username, p.total_xp, p.current_level, p.current_streak, g.title_fa AS grade_title
             FROM users u
             JOIN student_profiles p ON p.user_id = u.id
             LEFT JOIN grades g ON g.id = p.grade_id
             WHERE u.role = 'student'
             ORDER BY p.total_xp DESC
             LIMIT 20"
        );

        $rank = 1;
        $results = [];
        foreach ($topStudents as $st) {
            $results[] = [
                'rank' => $rank++,
                'user_id' => (int) $st['id'],
                'full_name' => $st['full_name'],
                'display_name' => $st['display_name'] ?? $st['full_name'],
                'username' => $st['username'],
                'grade_title' => $st['grade_title'] ?? 'دوره اول',
                'points' => (int) $st['total_xp'],
                'level' => (int) $st['current_level'],
                'streak' => (int) $st['current_streak']
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    // Admin Competition Handlers
    public static function adminCreate(array $input): void {
        Auth::requireAdmin();
        $id = DB::insert('competitions', [
            'title_fa' => $input['title_fa'] ?? 'مسابقه جدید فیزیک',
            'description_fa' => $input['description_fa'] ?? null,
            'theme_fa' => $input['theme_fa'] ?? 'چالش هفتگی فیزیک',
            'league_type' => $input['league_type'] ?? 'weekly',
            'league_tier' => $input['league_tier'] ?? 'quantum',
            'grade_id' => $input['grade_id'] ?? null,
            'duration_minutes' => $input['duration_minutes'] ?? 45,
            'has_negative_marking' => (int) ($input['has_negative_marking'] ?? 0),
            'starts_at' => $input['starts_at'] ?? date('Y-m-d H:i:s'),
            'ends_at' => $input['ends_at'] ?? date('Y-m-d H:i:s', strtotime('+7 days')),
            'is_published' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ]);
        echo json_encode(['id' => $id, 'message' => 'مسابقه با موفقیت تعریف شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function adminUpdate(int $id, array $input): void {
        Auth::requireAdmin();
        DB::update('competitions', $input, 'id = :id', ['id' => $id]);
        echo json_encode(['message' => 'مسابقه به‌روزرسانی شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function adminDelete(int $id): void {
        Auth::requireAdmin();
        DB::delete('competitions', 'id = :id', ['id' => $id]);
        echo json_encode(['message' => 'مسابقه با موفقیت حذف شد.'], JSON_UNESCAPED_UNICODE);
    }

    public static function adminGetSubmissions(int $id): void {
        Auth::requireAdmin();
        $subs = DB::fetchAll(
            "SELECT s.*, u.full_name, u.username
             FROM competition_submissions s
             JOIN users u ON u.id = s.user_id
             WHERE s.competition_id = :cid
             ORDER BY s.submitted_at DESC",
            ['cid' => $id]
        );
        echo json_encode($subs, JSON_UNESCAPED_UNICODE);
    }

    public static function adminGradeSubmission(int $compId, int $subId, array $input): void {
        Auth::requireAdmin();
        $score = (float) ($input['score'] ?? 0);
        $feedback = trim((string)($input['feedback_fa'] ?? ''));

        $sub = DB::fetchOne("SELECT * FROM competition_submissions WHERE id = :id AND competition_id = :cid", ['id' => $subId, 'cid' => $compId]);
        if (!$sub) {
            http_response_code(404);
            echo json_encode(['detail' => 'پاسخنامه مسابقه یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        DB::update('competition_submissions', [
            'score' => $score,
            'feedback_fa' => $feedback,
            'is_graded' => 1,
            'graded_at' => date('Y-m-d H:i:s')
        ], 'id = :id', ['id' => $subId]);

        echo json_encode(['message_fa' => 'نمره و بازخورد داور با موفقیت ثبت شد.'], JSON_UNESCAPED_UNICODE);
    }
}
