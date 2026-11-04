<?php
/**
 * QUANTUM CUT — Automated PHP Test Suite
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../services/GamificationService.php';
require_once __DIR__ . '/../services/ExamService.php';
require_once __DIR__ . '/../services/AiService.php';
require_once __DIR__ . '/../services/MobileAppService.php';
require_once __DIR__ . '/../controllers/AdminController.php';
require_once __DIR__ . '/../controllers/CompetitionController.php';
require_once __DIR__ . '/../controllers/CurriculumController.php';

$totalTests = 0;
$passedTests = 0;
$failedTests = 0;

function assertTest(string $name, bool $condition, string $details = ''): void {
    global $totalTests, $passedTests, $failedTests;
    $totalTests++;
    if ($condition) {
        $passedTests++;
        echo " [PASS] $name\n";
    } else {
        $failedTests++;
        echo " [FAIL] $name: $details\n";
    }
}

echo "========================================================\n";
echo "   QUANTUM CUT — PHP TEST SUITE (PHP " . PHP_VERSION . ")\n";
echo "========================================================\n\n";

// 1. Database Connection & Schema Test
try {
    $db = DB::getConnection();
    assertTest("Database PDO Connection", $db instanceof PDO);
    $qCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM questions");
    assertTest("Database Question Bank Seeded", $qCount >= 300, "Found $qCount questions");
    $chCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM chapters");
    assertTest("Curriculum Chapters Available", $chCount >= 12, "Found $chCount chapters");
} catch (Exception $e) {
    assertTest("Database Connection", false, $e->getMessage());
}

// 2. Auth Tests: Admin & Student Login
$adminUser = DB::fetchOne("SELECT * FROM users WHERE LOWER(username) = 'admin'");
assertTest("Admin User Record Exists", !empty($adminUser));
$verifyQuantumCut = Auth::verifyPassword('QUANTUM CUT', $adminUser['hashed_password'], 'QUANTUM CUT');
assertTest("Login with 'QUANTUM CUT' Credentials", $verifyQuantumCut);
$verifyAdmin = Auth::verifyPassword('admin', $adminUser['hashed_password'], 'admin');
assertTest("Login with 'admin' Credentials", $verifyAdmin);

$studentUser = DB::fetchOne("SELECT * FROM users WHERE LOWER(username) = 'student_beheshti'");
assertTest("Student User Record Exists", !empty($studentUser));
$verifyStudent = Auth::verifyPassword('Student1405!', $studentUser['hashed_password'], 'student_beheshti');
assertTest("Student Password Verification", $verifyStudent);

// 3. JWT Token Generation & Verification
$adminToken = Auth::createToken(['sub' => 'admin', 'role' => 'admin']);
assertTest("JWT Token Generation", !empty($adminToken) && substr_count($adminToken, '.') === 2);
$payload = Auth::verifyToken($adminToken);
assertTest("JWT Token Signature Verification", $payload !== null && $payload['sub'] === 'admin');
$expiredCheck = Auth::verifyToken('invalid.token.here');
assertTest("JWT Invalid Token Rejection", $expiredCheck === null);

// 4. Curriculum Tests
$grades = DB::fetchAll("SELECT * FROM grades ORDER BY number ASC");
assertTest("Grades List (7th, 8th, 9th)", count($grades) === 3);

$g7Books = DB::fetchAll("SELECT * FROM books WHERE grade_id = :gid", ['gid' => $grades[0]['id']]);
assertTest("Grade 7 Textbooks (Official + Sampad)", count($g7Books) >= 2);

$lessons = DB::fetchAll("SELECT * FROM lessons");
assertTest("Bite-sized Lessons Exist", count($lessons) >= 40, "Found " . count($lessons) . " lessons");

// Test Chapter & Lesson Detail Payload Integrity
ob_start();
CurriculumController::getChapterDetail(1);
$chDetailRaw = ob_get_clean();
$chDetail = json_decode($chDetailRaw, true);
assertTest("Curriculum Chapter Detail JSON Structure", !empty($chDetail['lessons']) && count($chDetail['lessons']) > 0);

ob_start();
CurriculumController::getLessonDetail(1);
$lesDetailRaw = ob_get_clean();
$lesDetail = json_decode($lesDetailRaw, true);
assertTest("Curriculum Lesson Detail JSON Blocks", !empty($lesDetail['content_blocks']) && !empty($lesDetail['exercises']));

$exercises = DB::fetchAll("SELECT * FROM exercises");
assertTest("Interactive Exercises Exist", count($exercises) >= 50, "Found " . count($exercises) . " exercises");

// 5. Exam Engine & Automated Grading Test
$exam = DB::fetchOne("SELECT * FROM examinations WHERE is_active = 1 LIMIT 1");
assertTest("Active Examination Available", !empty($exam));

if ($exam && $studentUser) {
    $attempt = ExamService::startAttempt((int) $exam['id'], (int) $studentUser['id']);
    assertTest("Start Exam Attempt Session", !empty($attempt['id']) && $attempt['status'] === 'in_progress');

    $examQs = DB::fetchAll("SELECT eq.question_id FROM examination_questions eq WHERE eq.exam_id = :eid", ['eid' => $exam['id']]);
    $sampleAnswers = [];
    foreach ($examQs as $eq) {
        $correctOpt = DB::fetchOne("SELECT option_key FROM question_options WHERE question_id = :qid AND is_correct = 1", ['qid' => $eq['question_id']]);
        if ($correctOpt) {
            $sampleAnswers[] = [
                'question_id' => (int) $eq['question_id'],
                'selected_option_key' => $correctOpt['option_key']
            ];
        }
    }

    $submitted = ExamService::submitAttempt((int) $attempt['id'], (int) $studentUser['id'], $sampleAnswers);
    assertTest("Submit Exam & Auto Score Calculation", (float) $submitted['final_score'] > 0);
    assertTest("Exam Attempt Marked Reviewed/Passed", in_array($submitted['status'], ['reviewed', 'grading'], true));
}

// 6. Gamification Engine Test
$xpAward = GamificationService::awardXp((int) $studentUser['id'], 25, 'test_unit', 'تست موتور امتیازدهی', 'test_ref_' . time());
assertTest("XP Award Transaction Recorded", $xpAward !== null && $xpAward['amount'] === 25);

$streak = GamificationService::recordStreak((int) $studentUser['id']);
assertTest("Daily Streak Recording", $streak >= 1);

$level = GamificationService::calculateLevel(350);
assertTest("XP Level Computation (350 XP -> Level 3)", $level === 3);

// 7. Nexora AI Engine Test
$cleanCheck = AiService::cleanOutput("<think>Let's consider Newton's law</think>پاسخ مسئله این است:");
assertTest("AI Output Cleaning (<think> Stripping)", !str_contains($cleanCheck, '<think>') && str_contains($cleanCheck, 'پاسخ'));

$tutorRes = AiService::askTutor("شتاب چیست؟");
assertTest("Nexora Socratic Guidance Generated", !empty($tutorRes['guidance_fa']) && !empty($tutorRes['suggested_followups']));
assertTest("Nexora AI Model Name GPT Oss 120B", str_contains($tutorRes['model_name'], 'GPT Oss 120B') || str_contains($tutorRes['model_used'], '120B'));

// 8. Live Lab Room Lifecycle Test
DB::query("CREATE TABLE IF NOT EXISTS live_lab_rooms (
    room_code VARCHAR(32) PRIMARY KEY,
    title_fa VARCHAR(128) NOT NULL,
    teacher_name VARCHAR(128) NOT NULL,
    sim_id VARCHAR(64),
    sim_title VARCHAR(128),
    is_locked BOOLEAN DEFAULT 0,
    is_streaming BOOLEAN DEFAULT 0,
    viewers_count INTEGER DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME
)");
$testRoomCode = 'TEST99';
DB::insert('live_lab_rooms', [
    'room_code' => $testRoomCode,
    'title_fa' => 'آزمایشگاه تستی فیزیک',
    'teacher_name' => 'استاد تست',
    'sim_id' => 'balancing-act',
    'created_at' => date('Y-m-d H:i:s'),
    'updated_at' => date('Y-m-d H:i:s')
]);
$foundRoom = DB::fetchOne("SELECT * FROM live_lab_rooms WHERE room_code = :c", ['c' => $testRoomCode]);
assertTest("Live Lab Room Creation & Lookup", $foundRoom !== null && $foundRoom['room_code'] === $testRoomCode);
DB::delete('live_lab_rooms', 'room_code = :c', ['c' => $testRoomCode]);
$deletedRoom = DB::fetchOne("SELECT * FROM live_lab_rooms WHERE room_code = :c", ['c' => $testRoomCode]);
assertTest("Live Lab Room Teardown", $deletedRoom === null);

// 9. Mobile App & APK Delivery Service
$mobileService = new \App\Services\MobileAppService();
$mobileConfig = $mobileService->getAppConfig();
assertTest("Mobile App Package ID", $mobileConfig['package_name'] === 'ir.sampad.physicssociety');
assertTest("Mobile App Standalone APK File Exists", $mobileConfig['apk_available'] === true && $mobileConfig['apk_size_bytes'] > 50000);
$manifest = $mobileService->generateWebManifest();
assertTest("Web App Manifest Generation", !empty($manifest['start_url']) && $manifest['display'] === 'standalone');

// 10. Admin Controller & Curriculum Lifecycle Test
$_SERVER['HTTP_AUTHORIZATION'] = "Bearer $adminToken";
$testBook = DB::fetchOne("SELECT id FROM books LIMIT 1");
if ($testBook) {
    $tempChId = DB::insert('chapters', [
        'book_id' => $testBook['id'],
        'chapter_number' => 999,
        'title_fa' => 'فصل آزمایشی مدیر',
        'slug' => 'chapter-test-crud',
        'description_fa' => 'فصل تستی برای بررسی CRUD',
        'estimated_minutes' => 120,
        'order_index' => 999,
        'is_published' => 1
    ]);
    assertTest("Admin Create Chapter Insertion", $tempChId > 0);

    $tempLesId = DB::insert('lessons', [
        'chapter_id' => $tempChId,
        'title_fa' => 'درس آزمایشی تست',
        'slug' => 'lesson-test-crud',
        'order_index' => 1,
        'content_blocks' => json_encode(['intro' => 'تست'], JSON_UNESCAPED_UNICODE),
        'xp_reward' => 20
    ]);
    assertTest("Admin Create Lesson Insertion", $tempLesId > 0);

    DB::delete('lessons', 'id = :id', ['id' => $tempLesId]);
    $deletedLes = DB::fetchOne("SELECT id FROM lessons WHERE id = :id", ['id' => $tempLesId]);
    assertTest("Admin Delete Lesson", $deletedLes === null);

    DB::delete('chapters', 'id = :id', ['id' => $tempChId]);
    $deletedCh = DB::fetchOne("SELECT id FROM chapters WHERE id = :id", ['id' => $tempChId]);
    assertTest("Admin Delete Chapter", $deletedCh === null);
}

// Student Details & Profile Integrity
$sDetails = DB::fetchOne(
    "SELECT u.id, u.username, u.full_name, p.total_xp, p.current_level
     FROM users u
     LEFT JOIN student_profiles p ON p.user_id = u.id
     WHERE u.role = 'student' LIMIT 1"
);
assertTest("Student Details Query Integrity", $sDetails !== null && !empty($sDetails['username']));

// 100% PHP Simulators Architecture Integrity
$phpSims = glob(__DIR__ . '/../../simulators/phet/*.php');
$htmlSims = glob(__DIR__ . '/../../simulators/phet/*.html');
assertTest("PhET Simulators Converted to 100% PHP (29 Sims)", count($phpSims) === 29);
assertTest("Zero Legacy HTML Simulators Remaining", count($htmlSims) === 0);

// 100% Pure PHP Codebase Integrity
$jsFiles = glob(__DIR__ . '/../../js/*.js');
$cssFiles = glob(__DIR__ . '/../../css/*.css');
assertTest("Zero Legacy JS Code Files (All Converted to PHP)", count($jsFiles) === 0);
assertTest("Zero Legacy CSS Code Files (All Converted to PHP)", count($cssFiles) === 0);

echo "\n--------------------------------------------------------\n";
echo "SUMMARY: Total: $totalTests | Passed: $passedTests | Failed: $failedTests\n";
if ($failedTests === 0) {
    echo "SUCCESS: 100% of tests PASSED!\n";
} else {
    echo "WARNING: Some tests failed.\n";
}
echo "========================================================\n";
