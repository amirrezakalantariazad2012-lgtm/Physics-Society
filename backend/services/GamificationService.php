<?php
/**
 * QUANTUM CUT — Gamification & Progression Engine
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';

class GamificationService {
    public const LEVEL_THRESHOLDS = [
        [1, "دانش‌پژوه مقدماتی", 0],
        [2, "کاوشگر نیرو و حرکت", 100],
        [3, "پژوهشگر انرژی", 250],
        [4, "استاد الکتریسیته", 500],
        [5, "متخصص نور و امواج", 900],
        [6, "فیزیک‌دان تجربی", 1500],
        [7, "محقق ارشد فیزیک", 2300],
        [8, "استاد مکانیک کوانتوم و نسبیت", 3500],
        [9, "نخبه فیزیک کوانتوم", 5000],
    ];

    public static function calculateLevel(int $xp): int {
        $lvl = 1;
        foreach (self::LEVEL_THRESHOLDS as [$l, $title, $minXp]) {
            if ($xp >= $minXp) {
                $lvl = $l;
            } else {
                break;
            }
        }
        return $lvl;
    }

    /**
     * Idempotent XP awarding with duplicate prevention
     */
    public static function awardXp(
        int $userId,
        int $amount,
        string $activityType,
        string $descFa,
        ?string $refId = null
    ): ?array {
        if ($amount <= 0) return null;

        if ($refId !== null) {
            $existing = DB::fetchOne(
                "SELECT id FROM xp_transactions WHERE user_id = :uid AND activity_type = :type AND reference_id = :ref",
                ['uid' => $userId, 'type' => $activityType, 'ref' => $refId]
            );
            if ($existing) {
                return null; // Already awarded
            }
        }

        // Insert transaction
        $txId = DB::insert('xp_transactions', [
            'user_id' => $userId,
            'amount' => $amount,
            'activity_type' => $activityType,
            'reference_id' => $refId,
            'description_fa' => $descFa,
            'created_at' => date('Y-m-d H:i:s')
        ]);

        // Update profile
        $profile = DB::fetchOne("SELECT * FROM student_profiles WHERE user_id = :uid", ['uid' => $userId]);
        if ($profile) {
            $newXp = ((int) $profile['total_xp']) + $amount;
            $newLevel = self::calculateLevel($newXp);
            $oldLevel = (int) $profile['current_level'];

            DB::update('student_profiles', [
                'total_xp' => $newXp,
                'current_level' => $newLevel,
                'updated_at' => date('Y-m-d H:i:s')
            ], 'user_id = :uid', ['uid' => $userId]);

            if ($newLevel > $oldLevel) {
                DB::insert('notifications', [
                    'user_id' => $userId,
                    'title_fa' => 'ارتقای سطح فیزیک!',
                    'message_fa' => "آفرین! شما به سطح $newLevel ارتقا یافتید.",
                    'notification_type' => 'badge',
                    'is_read' => 0,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }
        }

        self::checkBadges($userId);

        return [
            'id' => $txId,
            'user_id' => $userId,
            'amount' => $amount,
            'activity_type' => $activityType,
            'description_fa' => $descFa
        ];
    }

    /**
     * Daily learning streak tracking
     */
    public static function recordStreak(int $userId): int {
        $today = date('Y-m-d');
        $profile = DB::fetchOne("SELECT * FROM student_profiles WHERE user_id = :uid", ['uid' => $userId]);
        if (!$profile) return 0;

        $existing = DB::fetchOne(
            "SELECT * FROM learning_streaks WHERE user_id = :uid AND activity_date = :dt",
            ['uid' => $userId, 'dt' => $today]
        );

        if ($existing) {
            DB::update('learning_streaks', [
                'activity_count' => ((int) $existing['activity_count']) + 1
            ], 'id = :id', ['id' => $existing['id']]);
            return (int) $profile['current_streak'];
        }

        DB::insert('learning_streaks', [
            'user_id' => $userId,
            'activity_date' => $today,
            'activity_count' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ]);

        $yesterday = date('Y-m-d', strtotime('-1 day'));
        $hadYesterday = DB::fetchOne(
            "SELECT 1 FROM learning_streaks WHERE user_id = :uid AND activity_date = :yd",
            ['uid' => $userId, 'yd' => $yesterday]
        );

        $currentStreak = $hadYesterday ? (((int) $profile['current_streak']) + 1) : 1;
        $maxStreak = max((int) $profile['max_streak'], $currentStreak);

        DB::update('student_profiles', [
            'current_streak' => $currentStreak,
            'max_streak' => $maxStreak,
            'last_activity_date' => $today,
            'updated_at' => date('Y-m-d H:i:s')
        ], 'user_id = :uid', ['uid' => $userId]);

        if (in_array($currentStreak, [3, 7, 14, 30], true)) {
            self::awardXp(
                $userId,
                $currentStreak * 10,
                'streak_bonus',
                "پاداش استمرار یادگیری ($currentStreak روز متوالی)",
                "streak_{$currentStreak}_{$today}"
            );
        }

        return $currentStreak;
    }

    /**
     * Unlock eligible badges
     */
    public static function checkBadges(int $userId): void {
        $profile = DB::fetchOne("SELECT * FROM student_profiles WHERE user_id = :uid", ['uid' => $userId]);
        if (!$profile) return;

        $badges = DB::fetchAll("SELECT * FROM badges WHERE is_active = 1");
        $unlockedIds = array_column(
            DB::fetchAll("SELECT badge_id FROM student_badges WHERE user_id = :uid", ['uid' => $userId]),
            'badge_id'
        );

        foreach ($badges as $b) {
            $bId = (int) $b['id'];
            if (in_array($bId, $unlockedIds, true)) continue;

            $eligible = false;
            $crit = $b['criteria_type'];
            $thresh = (int) $b['criteria_threshold'];

            if ($crit === 'first_lesson') {
                $completed = (int) DB::fetchColumn(
                    "SELECT COUNT(*) FROM student_progress WHERE user_id = :uid AND is_completed = 1",
                    ['uid' => $userId]
                );
                $eligible = ($completed >= $thresh);
            } elseif ($crit === 'streak_3') {
                $eligible = ((int) $profile['max_streak'] >= 3);
            } elseif ($crit === 'streak_7') {
                $eligible = ((int) $profile['max_streak'] >= 7);
            } elseif ($crit === 'xp_500') {
                $eligible = ((int) $profile['total_xp'] >= 500);
            } elseif ($crit === 'competition_participant') {
                $subs = (int) DB::fetchColumn(
                    "SELECT COUNT(*) FROM competition_submissions WHERE user_id = :uid",
                    ['uid' => $userId]
                );
                $eligible = ($subs >= $thresh);
            }

            if ($eligible) {
                DB::insert('student_badges', [
                    'user_id' => $userId,
                    'badge_id' => $bId,
                    'awarded_at' => date('Y-m-d H:i:s')
                ]);
                DB::insert('notifications', [
                    'user_id' => $userId,
                    'title_fa' => 'نشان افتخار جدید!',
                    'message_fa' => "تبریک! نشان افتخار «{$b['title_fa']}» را کسب نمودید.",
                    'notification_type' => 'badge',
                    'is_read' => 0,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }
        }
    }
}
