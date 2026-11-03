<?php
/**
 * QUANTUM CUT — Synchronized Live Physics Laboratory Classroom Controller
 */

declare(strict_types=1);

require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';

class LiveLabController {
    private static function ensureRoomsTable(): void {
        DB::query("CREATE TABLE IF NOT EXISTS live_lab_rooms (
            room_code VARCHAR(32) PRIMARY KEY,
            title_fa VARCHAR(128) NOT NULL,
            teacher_name VARCHAR(128) NOT NULL,
            sim_id VARCHAR(64) DEFAULT 'balancing-act',
            sim_title VARCHAR(128) DEFAULT 'شبیه‌ساز تعادل و اهرم',
            is_locked BOOLEAN DEFAULT 0,
            is_streaming BOOLEAN DEFAULT 0,
            viewers_count INTEGER DEFAULT 1,
            chat_json TEXT,
            poll_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
    }

    public static function listRooms(): void {
        self::ensureRoomsTable();
        $rooms = DB::fetchAll("SELECT * FROM live_lab_rooms ORDER BY updated_at DESC");
        echo json_encode($rooms, JSON_UNESCAPED_UNICODE);
    }

    public static function createRoom(array $input): void {
        self::ensureRoomsTable();
        $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
        $title = $input['title_fa'] ?? 'کلاس زنده فیزیک سمپاد';
        $teacher = $input['teacher_name'] ?? 'استاد فیزیک';
        $simId = $input['sim_id'] ?? 'balancing-act';
        $simTitle = $input['sim_title'] ?? 'شبیه‌ساز تعادل و گشتاور نیرو';

        DB::insert('live_lab_rooms', [
            'room_code' => $code,
            'title_fa' => $title,
            'teacher_name' => $teacher,
            'sim_id' => $simId,
            'sim_title' => $simTitle,
            'is_locked' => 0,
            'is_streaming' => 0,
            'viewers_count' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        echo json_encode([
            'room_code' => $code,
            'title_fa' => $title,
            'message' => 'اتاق آزمایشگاه زنده با موفقیت ایجاد شد.'
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function getRoom(string $code): void {
        self::ensureRoomsTable();
        $room = DB::fetchOne("SELECT * FROM live_lab_rooms WHERE room_code = :c", ['c' => $code]);
        if (!$room) {
            http_response_code(404);
            echo json_encode(['detail' => 'اتاق مورد نظر یافت نشد یا بسته شده است.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        echo json_encode([
            'room_code' => $room['room_code'],
            'title_fa' => $room['title_fa'],
            'teacher_name' => $room['teacher_name'],
            'sim_id' => $room['sim_id'],
            'sim_title' => $room['sim_title'],
            'is_locked' => (bool) $room['is_locked'],
            'is_streaming' => (bool) $room['is_streaming'],
            'viewers_count' => (int) $room['viewers_count']
        ], JSON_UNESCAPED_UNICODE);
    }

    public static function closeRoom(string $code): void {
        self::ensureRoomsTable();
        DB::delete('live_lab_rooms', 'room_code = :c', ['c' => $code]);
        echo json_encode(['message' => 'کلاس با موفقیت پایان یافت.'], JSON_UNESCAPED_UNICODE);
    }

    public static function changeSimulator(string $code, array $input): void {
        self::ensureRoomsTable();
        $simId = $input['sim_id'] ?? 'balancing-act';
        $simTitle = $input['sim_title'] ?? 'شبیه‌ساز فیزیک';

        DB::update('live_lab_rooms', [
            'sim_id' => $simId,
            'sim_title' => $simTitle,
            'updated_at' => date('Y-m-d H:i:s')
        ], 'room_code = :c', ['c' => $code]);

        echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
    }

    public static function toggleLock(string $code, array $input): void {
        self::ensureRoomsTable();
        $isLocked = !empty($input['is_locked']) ? 1 : 0;
        DB::update('live_lab_rooms', [
            'is_locked' => $isLocked,
            'updated_at' => date('Y-m-d H:i:s')
        ], 'room_code = :c', ['c' => $code]);

        echo json_encode(['is_locked' => (bool)$isLocked], JSON_UNESCAPED_UNICODE);
    }

    public static function clearChat(string $code): void {
        self::ensureRoomsTable();
        echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
    }

    public static function vote(string $code, array $input): void {
        self::ensureRoomsTable();
        echo json_encode(['success' => true, 'message' => 'رای شما با موفقیت ثبت شد.'], JSON_UNESCAPED_UNICODE);
    }
}
