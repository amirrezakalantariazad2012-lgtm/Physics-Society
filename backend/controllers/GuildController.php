<?php
/**
 * QUANTUM CUT — School Guilds & House Cup Controller
 * Pure PHP 8.3 Architecture
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

class GuildController {
    public static function list(): void {
        DB::ensureAdvancedSchema();
        $guilds = DB::fetchAll(
            "SELECT g.*, 
                (SELECT COUNT(*) FROM student_profiles sp WHERE sp.guild_id = g.id) AS active_members,
                (SELECT COALESCE(SUM(sp.total_xp), 0) FROM student_profiles sp WHERE sp.guild_id = g.id) AS live_points
             FROM guilds g
             ORDER BY live_points DESC"
        );

        echo json_encode([
            'status' => 'success',
            'guilds' => $guilds
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function myGuild(): void {
        DB::ensureAdvancedSchema();
        $user = Auth::getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['detail' => 'نیاز به احراز هویت است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $profile = DB::fetchOne("SELECT * FROM student_profiles WHERE user_id = :id", ['id' => $user['id']]);
        if (!$profile || empty($profile['guild_id'])) {
            echo json_encode([
                'has_guild' => false,
                'guild' => null
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $guild = DB::fetchOne("SELECT * FROM guilds WHERE id = :gid", ['gid' => $profile['guild_id']]);
        $teammates = DB::fetchAll(
            "SELECT u.full_name, u.username, sp.total_xp, sp.current_level, sp.elo_rating
             FROM student_profiles sp
             JOIN users u ON u.id = sp.user_id
             WHERE sp.guild_id = :gid
             ORDER BY sp.total_xp DESC
             LIMIT 10",
            ['gid' => $profile['guild_id']]
        );

        echo json_encode([
            'has_guild' => true,
            'guild' => $guild,
            'teammates' => $teammates,
            'my_elo' => $profile['elo_rating'] ?? 1200
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function join(array $input): void {
        DB::ensureAdvancedSchema();
        $user = Auth::getCurrentUser();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['detail' => 'نیاز به احراز هویت است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $guildId = (int)($input['guild_id'] ?? 0);
        $guild = DB::fetchOne("SELECT * FROM guilds WHERE id = :id", ['id' => $guildId]);
        if (!$guild) {
            http_response_code(404);
            echo json_encode(['detail' => 'خاندان علمی مورد نظر یافت نشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        DB::update('student_profiles', ['guild_id' => $guildId], 'user_id = :uid', ['uid' => $user['id']]);

        // Award welcome bonus 50 XP
        DB::query("UPDATE student_profiles SET total_xp = total_xp + 50 WHERE user_id = :uid", ['uid' => $user['id']]);

        echo json_encode([
            'status' => 'success',
            'message' => "شما با افتخار به {$guild['name']} پیوستید! ۵۰ کوانتوم XP به شما اهدا شد.",
            'guild' => $guild
        ], JSON_UNESCAPED_UNICODE);
    }
}
