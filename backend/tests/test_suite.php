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
require_once __DIR__ . '/../controllers/GamificationController.php';

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

// ==========================================
// ADVANCED 10-FEATURE SCIENTIFIC TEST SUITE
// ==========================================
require_once __DIR__ . '/../controllers/GuildController.php';
require_once __DIR__ . '/../controllers/DuelController.php';
require_once __DIR__ . '/../controllers/AdaptiveExamController.php';
require_once __DIR__ . '/../controllers/TeacherDeckController.php';

// 1. Database Advanced Schema & Guilds
DB::ensureAdvancedSchema();
$guildCount = (int) DB::fetchColumn("SELECT COUNT(*) FROM guilds");
assertTest("Scientific Guilds Seeded (Maxwell, Newton, Bohr, Feynman)", $guildCount >= 4);

$maxwell = DB::fetchOne("SELECT * FROM guilds WHERE slug = 'maxwell'");
assertTest("Maxwell Guild Details & Theme Color", !empty($maxwell) && $maxwell['theme_color'] === '#22d3ee');

// 2. Quantum Duel Table & ELO Leaderboard
$duelTableCols = DB::fetchAll("PRAGMA table_info(quantum_duels)");
assertTest("Quantum Duels Table Schema Verified", count($duelTableCols) >= 10);

ob_start();
DuelController::getLeaderboard();
$duelLbRaw = ob_get_clean();
$duelLb = json_decode($duelLbRaw, true);
assertTest("Quantum Duel Leaderboard Endpoint", !empty($duelLb) && isset($duelLb['leaders']));

// 3. AI Handwritten Grader Partial Credit Rubric
$gradeResult = AiService::gradeHandwrittenSolution(
    "گلوله‌ای با تندی ۱۰ متر بر ثانیه پرتاب شد.",
    "v = 10 m/s\nE = 1/2 * m * v^2\nE = 0.5 * 2 * 100 = 100 J",
    20.0
);
assertTest("AI Handwritten Solution Partial Credit Total", $gradeResult['total_score'] > 0 && $gradeResult['total_score'] <= 20.0);
assertTest("AI Handwritten Rubric 4-Criteria Breakdown", count($gradeResult['criteria_breakdown']) === 4);
assertTest("AI Handwritten Formula Identification Score", isset($gradeResult['criteria_breakdown']['formula']['score']));

// 4. Multi-Tier Olympiad Physics Hint Engine
$hintTier1 = AiService::getOlympiadHint("مقاومت معادل مدار پل وتستون را محاسبه کنید.", 1);
assertTest("Olympiad Hint Engine Tier 1 (Conceptual)", $hintTier1['tier'] === 1 && !empty($hintTier1['hint_text']));
$hintTier4 = AiService::getOlympiadHint("مقاومت معادل مدار پل وتستون را محاسبه کنید.", 4);
assertTest("Olympiad Hint Engine Tier 4 (Analytic)", $hintTier4['tier'] === 4 && $hintTier4['next_tier'] === null);

// 5. Adaptive Exam Controller (CAT / IRT Rasch Model)
$catSessionCols = DB::fetchAll("PRAGMA table_info(adaptive_test_sessions)");
assertTest("Adaptive Test Sessions Table Schema Verified", count($catSessionCols) >= 8);

// 6. Teacher Misconception Heatmap Diagnostic Deck
ob_start();
Auth::setSessionUser($adminUser); // Authenticate as admin/teacher
TeacherDeckController::getMisconceptionHeatmap();
$heatmapRaw = ob_get_clean();
$heatmapData = json_decode($heatmapRaw, true);
assertTest("Teacher Misconception Heatmap Diagnostic Data", !empty($heatmapData) && isset($heatmapData['matrix']));
assertTest("Teacher Diagnosed Misconceptions Count", ($heatmapData['total_diagnosed_misconceptions'] ?? 0) >= 5);

// 7. Printable SAMPAD Standard Exam Generator
ob_start();
TeacherDeckController::generatePrintableExam([
    'title' => 'آزمون هماهنگ فیزیک پایه نهم سمپاد',
    'grade_title' => 'پایه نهم سمپاد',
    'questions_count' => 6,
    'include_answer_key' => true
]);
$examSheetRaw = ob_get_clean();
$examSheetData = json_decode($examSheetRaw, true);
assertTest("Printable Standard Exam Generator Output", !empty($examSheetData['exam_meta']) && count($examSheetData['questions']) >= 3);
assertTest("Printable Exam SAMPAD Official Header", str_contains($examSheetData['exam_meta']['school_name'] ?? '', 'شهید بهشتی ۲'));

// 8. Service Worker PWA Offline File
$swFile = __DIR__ . '/../../sw.js.php';
assertTest("PWA 100% Offline Service Worker (sw.js.php)", file_exists($swFile) && str_contains(file_get_contents($swFile), 'CACHE_NAME'));

// 9. Observatory redesign — data contracts restored for the public portal
try {
    ob_start();
    CurriculumController::getChaptersByBook(1);
    $chapterList = json_decode(ob_get_clean(), true);
    $firstChapter = is_array($chapterList) && !empty($chapterList) ? $chapterList[0] : [];
    assertTest('Chapter Cards Expose Question Breakdown', isset($firstChapter['mcq_count'], $firstChapter['written_count'], $firstChapter['question_count']));
    assertTest('Chapter Cards Expose Source Page Reference', array_key_exists('source_pages', $firstChapter));

    ob_start();
    CurriculumController::getChapterDetail((int) ($firstChapter['id'] ?? 1));
    $chapterDetail = json_decode(ob_get_clean(), true);
    assertTest('Chapter Detail Exposes Learning Objectives', isset($chapterDetail['objectives_fa']));
    assertTest('Chapter Detail Exposes Grade & Book Context', isset($chapterDetail['book_title_fa'], $chapterDetail['grade_number']));
    assertTest('Chapter Detail Exposes Attached Exam', array_key_exists('exam_id', (array) $chapterDetail));

    $_GET = ['grade_id' => '1', 'category' => 'pamphlet'];
    ob_start();
    CurriculumController::getStudyMaterials();
    $materials = json_decode(ob_get_clean(), true);
    assertTest('Study Materials Endpoint Returns Rows', is_array($materials));
    if (is_array($materials) && !empty($materials)) {
        assertTest('Study Materials Use Persisted Schema Columns', isset($materials[0]['category'], $materials[0]['author_name']));
        assertTest('Study Materials Expose Grade Title', isset($materials[0]['grade_title_fa']));
    }
    $_GET = [];

    Auth::setSessionUser($studentUser);
    ob_start();
    GamificationController::dashboard();
    $dashboard = json_decode(ob_get_clean(), true);
    assertTest('Student Dashboard Contract Includes Profile', isset($dashboard['student']['full_name'], $dashboard['student']['rank']));
    assertTest('Student Dashboard Contract Includes Notifications', array_key_exists('notifications', (array) $dashboard));
    assertTest('Student Dashboard Keeps Flat Compatibility Fields', isset($dashboard['total_xp'], $dashboard['recent_exams']));
} catch (Throwable $e) {
    assertTest('Observatory data contracts', false, $e->getMessage());
}

// 10. Upload gateway hardening
$gatewayFile = __DIR__ . '/../../uploads.php';
$gatewaySrc = file_exists($gatewayFile) ? file_get_contents($gatewayFile) : '';
assertTest('Upload Gateway Streams Through PHP', $gatewaySrc !== '' && str_contains($gatewaySrc, 'realpath'));
assertTest('Upload Gateway Enforces Extension Allow-list', str_contains($gatewaySrc, "'pdf'"));

// 11. Observatory design system file
$styleFile = __DIR__ . '/../../css/style.css.php';
$styleSrc = file_exists($styleFile) ? file_get_contents($styleFile) : '';
assertTest('Dual Theme Tokens Present (dark + light)', str_contains($styleSrc, 'html.dark') && str_contains($styleSrc, 'html.light'));
assertTest('Reduced Motion Preference Honoured', str_contains($styleSrc, 'prefers-reduced-motion'));

$uiFile = __DIR__ . '/../../js/components/ui.js.php';
assertTest('Theme Engine & Command Palette Shipped', file_exists($uiFile) && str_contains(file_get_contents($uiFile), 'qc-theme-changed'));

$swSrc = file_exists($swFile) ? file_get_contents($swFile) : '';
assertTest('Service Worker Precaches Observatory UI Layer', str_contains($swSrc, '/js/components/ui.js.php'));

$routerSrc = file_exists(__DIR__ . '/../../router.php') ? file_get_contents(__DIR__ . '/../../router.php') : '';
assertTest('Dev Router Blocks Private Storage Paths', str_contains($routerSrc, "'/backend'") && str_contains($routerSrc, "'env'"));

echo "\n--------------------------------------------------------\n";
echo "SUMMARY: Total: $totalTests | Passed: $passedTests | Failed: $failedTests\n";
if ($failedTests === 0) {
    echo "SUCCESS: 100% of tests PASSED!\n";
} else {
    echo "WARNING: Some tests failed.\n";
}
echo "========================================================\n";
