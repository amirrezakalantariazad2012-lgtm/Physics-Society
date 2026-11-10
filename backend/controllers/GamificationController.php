<?php
/**
 * QUANTUM CUT — Gamification Dashboard & Leaderboard Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../services/GamificationService.php';

class GamificationController {
    public static function dashboard(): void {
        $user = Auth::requireAuth();
        $userId = (int) $user['id'];

        $profile = DB::fetchOne("SELECT * FROM student_profiles WHERE user_id = :uid", ['uid' => $userId]);
        $totalXp = (int) ($profile['total_xp'] ?? 0);
        $currentLevel = (int) ($profile['current_level'] ?? 1);
        $currentStreak = (int) ($profile['current_streak'] ?? 0);
        $maxStreak = (int) ($profile['max_streak'] ?? 0);

        // Next level XP
        $nextXp = 5000;
        foreach (GamificationService::LEVEL_THRESHOLDS as [$l, $t, $minXp]) {
            if ($minXp > $totalXp) {
                $nextXp = $minXp;
                break;
            }
        }

        // Recent exams
        $recentExams = DB::fetchAll(
            "SELECT a.id AS attempt_id, e.title_fa, a.final_score AS score, a.total_possible_points AS total_points,
                    a.percentage, a.is_passed, a.started_at AS date
             FROM examination_attempts a
             JOIN examinations e ON e.id = a.exam_id
             WHERE a.user_id = :uid
             ORDER BY a.started_at DESC
             LIMIT 5",
            ['uid' => $userId]
        );

        // Active competition
        $now = date('Y-m-d H:i:s');
        $activeComp = DB::fetchOne(
            "SELECT id, title_fa, theme_fa, ends_at FROM competitions
             WHERE is_published = 1 AND is_closed = 0 AND ends_at >= :now
             ORDER BY ends_at ASC LIMIT 1",
            ['now' => $now]
        );

        // Badges count
        $unlockedBadgesCount = (int) DB::fetchColumn(
            "SELECT COUNT(*) FROM student_badges WHERE user_id = :uid",
            ['uid' => $userId]
        );

        // Rank
        $userRank = (int) DB::fetchColumn(
            "SELECT COUNT(*) + 1 FROM student_profiles WHERE total_xp > :xp",
            ['xp' => $totalXp]
        );

        // Lessons completed count
        $completedLessonsCount = (int) DB::fetchColumn(
            "SELECT COUNT(*) FROM student_progress WHERE user_id = :uid AND is_completed = 1",
            ['uid' => $userId]
        );

        // Latest in-app notices for the learner dashboard.
        $notifications = DB::fetchAll(
            "SELECT id, title_fa, message_fa, is_read, notification_type, link_url, created_at
             FROM notifications WHERE user_id = :uid
             ORDER BY created_at DESC LIMIT 6",
            ['uid' => $userId]
        );

        $formattedUser = Auth::formatUser($user);

        echo json_encode([
            // Canonical student record consumed by the dashboard view
            'student' => array_merge($formattedUser, [
                'rank' => $userRank,
                'current_streak' => $currentStreak,
                'longest_streak' => $maxStreak,
                'total_xp' => $totalXp,
                'level' => $currentLevel,
                'next_level_xp' => $nextXp,
                'badges_count' => $unlockedBadgesCount,
                'completed_lessons' => $completedLessonsCount
            ]),
            // Backwards-compatible flat fields
            'user' => $formattedUser,
            'total_xp' => $totalXp,
            'current_level' => $currentLevel,
            'next_level_xp' => $nextXp,
            'current_streak' => $currentStreak,
            'max_streak' => $maxStreak,
            'rank' => $userRank,
            'unlocked_badges_count' => $unlockedBadgesCount,
            'completed_lessons_count' => $completedLessonsCount,
            'recent_exams' => $recentExams,
            'notifications' => $notifications,
            'active_competition' => $activeComp
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function leaderboards(): void {
        $gradeId = isset($_GET['grade_id']) ? (int) $_GET['grade_id'] : null;

        $sql = "SELECT u.id, u.full_name, u.display_name, u.username, p.total_xp, p.current_level, p.current_streak,
                       g.title_fa AS grade_title
                FROM users u
                JOIN student_profiles p ON p.user_id = u.id
                LEFT JOIN grades g ON g.id = p.grade_id
                WHERE u.role = 'student'";
        $params = [];

        if ($gradeId) {
            $sql .= " AND p.grade_id = :gid";
            $params['gid'] = $gradeId;
        }

        $sql .= " ORDER BY p.total_xp DESC LIMIT 50";
        $topUsers = DB::fetchAll($sql, $params);

        $results = [];
        $rank = 1;
        foreach ($topUsers as $u) {
            $results[] = [
                'rank' => $rank++,
                'id' => (int) $u['id'],
                'full_name' => $u['full_name'],
                'display_name' => $u['display_name'] ?? $u['full_name'],
                'username' => $u['username'],
                'grade_title' => $u['grade_title'] ?? 'دوره اول',
                'total_xp' => (int) $u['total_xp'],
                'current_level' => (int) $u['current_level'],
                'current_streak' => (int) $u['current_streak']
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function badges(): void {
        $user = Auth::getCurrentUser();
        $badges = DB::fetchAll("SELECT * FROM badges WHERE is_active = 1");

        $unlockedIds = [];
        if ($user) {
            $unlockedIds = array_column(
                DB::fetchAll("SELECT badge_id FROM student_badges WHERE user_id = :uid", ['uid' => $user['id']]),
                'badge_id'
            );
        }

        $results = [];
        foreach ($badges as $b) {
            $results[] = [
                'id' => (int) $b['id'],
                'code' => $b['code'],
                'title_fa' => $b['title_fa'],
                'description_fa' => $b['description_fa'],
                'icon' => $b['icon'],
                'category' => $b['category'],
                'xp_bonus' => (int) $b['xp_bonus'],
                'is_unlocked' => in_array((int) $b['id'], $unlockedIds, true)
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
    }

    public static function xpHistory(): void {
        $user = Auth::requireAuth();
        $history = DB::fetchAll(
            "SELECT * FROM xp_transactions WHERE user_id = :uid ORDER BY created_at DESC LIMIT 50",
            ['uid' => $user['id']]
        );
        echo json_encode($history, JSON_UNESCAPED_UNICODE);
    }

    public static function labProgress(): void {
        $user = Auth::requireAuth();
        $records = DB::fetchAll(
            "SELECT * FROM xp_transactions WHERE user_id = :uid AND activity_type = 'lab_experiment' ORDER BY created_at DESC",
            ['uid' => $user['id']]
        );

        // reference_id is written as lab_{simType}_{YYYYMMDD}: derive the distinct lab list.
        $simIds = [];
        $totalXp = 0;
        foreach ($records as $record) {
            $totalXp += (int) ($record['amount'] ?? 0);
            $ref = (string) ($record['reference_id'] ?? '');
            if (preg_match('/^lab_(.+)_\d{8}$/', $ref, $m)) {
                $simIds[$m[1]] = true;
            }
        }

        echo json_encode([
            'completed_count' => count($records),
            'completed_labs_count' => count($simIds),
            'total_lab_xp' => $totalXp,
            'completed_sim_ids' => array_keys($simIds),
            'recent_labs' => $records
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function recordLabActivity(array $input): void {
        $user = Auth::requireAuth();
        $simType = $input['sim_type'] ?? 'phet';
        $labTitle = $input['lab_title_fa'] ?? 'شبیه‌ساز فیزیک';
        $xpAmount = (int) ($input['xp_amount'] ?? 20);

        GamificationService::awardXp(
            (int) $user['id'],
            $xpAmount,
            'lab_experiment',
            "انجام آزمایش علمی در شبیه‌ساز: $labTitle",
            "lab_{$simType}_" . date('Ymd')
        );

        GamificationService::recordStreak((int) $user['id']);

        echo json_encode([
            'success' => true,
            'xp_awarded' => $xpAmount,
            'message' => 'امتیاز آزمایش با موفقیت به کارنامه شما اضافه شد.'
        ], JSON_UNESCAPED_UNICODE);
    }
}
