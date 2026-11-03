<?php
/**
 * QUANTUM CUT — Authentication Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

class AuthController {
    public static function register(array $input): void {
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';
        $fullName = trim($input['full_name'] ?? '');
        $gradeId = isset($input['grade_id']) ? (int) $input['grade_id'] : null;
        $studentNumber = trim($input['student_number'] ?? '');
        $email = trim($input['email'] ?? '') ?: null;

        if (mb_strlen($username) < 3) {
            http_response_code(422);
            echo json_encode(['detail' => 'نام کاربری باید حداقل ۳ کاراکتر باشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (mb_strlen($password) < 4) {
            http_response_code(422);
            echo json_encode(['detail' => 'رمز عبور باید حداقل ۴ کاراکتر باشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (empty($fullName)) {
            http_response_code(422);
            echo json_encode(['detail' => 'نام و نام خانوادگی الزامی است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $existing = DB::fetchOne("SELECT id FROM users WHERE LOWER(username) = LOWER(:u)", ['u' => $username]);
        if ($existing) {
            http_response_code(400);
            echo json_encode(['detail' => 'این نام کاربری قبلاً در سامانه ثبت شده است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $hashed = Auth::hashPassword($password);
        $userId = DB::insert('users', [
            'username' => $username,
            'email' => $email,
            'hashed_password' => $hashed,
            'role' => 'student',
            'full_name' => $fullName,
            'display_name' => explode(' ', $fullName)[0],
            'is_active' => 1,
            'must_change_password' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        DB::insert('student_profiles', [
            'user_id' => $userId,
            'grade_id' => $gradeId,
            'student_number' => $studentNumber,
            'total_xp' => 50, // Welcome XP
            'current_level' => 1,
            'current_streak' => 1,
            'max_streak' => 1,
            'last_activity_date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        ]);

        $user = DB::fetchOne("SELECT u.*, p.grade_id, p.total_xp, p.current_level, p.current_streak FROM users u JOIN student_profiles p ON p.user_id = u.id WHERE u.id = :id", ['id' => $userId]);
        $token = Auth::createToken(['sub' => $user['username'], 'role' => 'student']);

        echo json_encode([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::formatUser($user)
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function login(array $input): void {
        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($username) || empty($password)) {
            http_response_code(401);
            echo json_encode(['detail' => 'نام کاربری یا رمز عبور اشتباه است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $user = DB::fetchOne(
            "SELECT u.*, p.grade_id, p.total_xp, p.current_level, p.current_streak, p.max_streak, p.student_number, p.avatar_url,
                    g.title_fa AS grade_title_fa
             FROM users u
             LEFT JOIN student_profiles p ON p.user_id = u.id
             LEFT JOIN grades g ON g.id = p.grade_id
             WHERE LOWER(u.username) = LOWER(:u)",
            ['u' => $username]
        );

        // Fallback for QUANTUM CUT alias
        if (!$user && in_array(strtolower($username), ['quantum cut', 'quantumcut'], true)) {
            $user = DB::fetchOne(
                "SELECT u.*, p.grade_id, p.total_xp, p.current_level, p.current_streak, p.max_streak, p.student_number, p.avatar_url,
                        g.title_fa AS grade_title_fa
                 FROM users u
                 LEFT JOIN student_profiles p ON p.user_id = u.id
                 LEFT JOIN grades g ON g.id = p.grade_id
                 WHERE LOWER(u.username) = 'admin'"
            );
        }

        if (!$user) {
            http_response_code(401);
            echo json_encode(['detail' => 'نام کاربری یا رمز عبور اشتباه است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $valid = Auth::verifyPassword($password, $user['hashed_password'], $user['username']);
        if (!$valid) {
            http_response_code(401);
            echo json_encode(['detail' => 'نام کاربری یا رمز عبور اشتباه است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (!(bool) $user['is_active']) {
            http_response_code(403);
            echo json_encode(['detail' => 'حساب کاربری شما غیرفعال شده است. لطفاً با مدیر سامانه تماس بگیرید.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $token = Auth::createToken(['sub' => $user['username'], 'role' => $user['role']]);

        echo json_encode([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::formatUser($user)
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function me(): void {
        $user = Auth::requireAuth();
        echo json_encode(Auth::formatUser($user), JSON_UNESCAPED_UNICODE);
    }

    public static function updateProfile(array $input): void {
        $user = Auth::requireAuth();
        $userId = (int) $user['id'];

        $updateUser = [];
        if (isset($input['full_name'])) $updateUser['full_name'] = trim($input['full_name']);
        if (isset($input['display_name'])) $updateUser['display_name'] = trim($input['display_name']);
        if (isset($input['email'])) $updateUser['email'] = trim($input['email']) ?: null;

        if ($updateUser) {
            $updateUser['updated_at'] = date('Y-m-d H:i:s');
            DB::update('users', $updateUser, 'id = :id', ['id' => $userId]);
        }

        $updateProfile = [];
        if (isset($input['bio'])) $updateProfile['bio'] = trim($input['bio']);
        if (isset($input['student_number'])) $updateProfile['student_number'] = trim($input['student_number']);
        if (isset($input['avatar_url'])) $updateProfile['avatar_url'] = trim($input['avatar_url']);

        if ($updateProfile) {
            $updateProfile['updated_at'] = date('Y-m-d H:i:s');
            DB::update('student_profiles', $updateProfile, 'user_id = :id', ['id' => $userId]);
        }

        $fresh = DB::fetchOne(
            "SELECT u.*, p.grade_id, p.total_xp, p.current_level, p.current_streak, p.max_streak, p.student_number, p.avatar_url,
                    g.title_fa AS grade_title_fa
             FROM users u
             LEFT JOIN student_profiles p ON p.user_id = u.id
             LEFT JOIN grades g ON g.id = p.grade_id
             WHERE u.id = :id",
            ['id' => $userId]
        );

        echo json_encode(Auth::formatUser($fresh), JSON_UNESCAPED_UNICODE);
    }

    public static function changePassword(array $input): void {
        $user = Auth::requireAuth();
        $curr = $input['current_password'] ?? '';
        $new = $input['new_password'] ?? '';
        $confirm = $input['confirm_password'] ?? '';

        if ($new !== $confirm) {
            http_response_code(400);
            echo json_encode(['detail' => 'تکرار رمز عبور جدید مطابقت ندارد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (mb_strlen($new) < 4) {
            http_response_code(400);
            echo json_encode(['detail' => 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (!Auth::verifyPassword($curr, $user['hashed_password'], $user['username'])) {
            http_response_code(400);
            echo json_encode(['detail' => 'رمز عبور فعلی نادرست است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $newHash = Auth::hashPassword($new);
        DB::update('users', [
            'hashed_password' => $newHash,
            'must_change_password' => 0,
            'updated_at' => date('Y-m-d H:i:s')
        ], 'id = :id', ['id' => (int) $user['id']]);

        echo json_encode(['message' => 'رمز عبور با موفقیت به‌روزرسانی شد.'], JSON_UNESCAPED_UNICODE);
    }
}
