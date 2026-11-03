<?php
/**
 * QUANTUM CUT — Master REST API Gateway (PHP Edition)
 */

declare(strict_types=1);

// 1. CORS & Security Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. Load Core Modules & Controllers
require_once __DIR__ . '/../backend/config.php';
require_once __DIR__ . '/../backend/database.php';
require_once __DIR__ . '/../backend/auth.php';
require_once __DIR__ . '/../backend/controllers/SystemController.php';
require_once __DIR__ . '/../backend/controllers/AuthController.php';
require_once __DIR__ . '/../backend/controllers/CurriculumController.php';
require_once __DIR__ . '/../backend/controllers/ExamController.php';
require_once __DIR__ . '/../backend/controllers/CompetitionController.php';
require_once __DIR__ . '/../backend/controllers/GamificationController.php';
require_once __DIR__ . '/../backend/controllers/AdminController.php';
require_once __DIR__ . '/../backend/controllers/AiController.php';
require_once __DIR__ . '/../backend/controllers/LiveLabController.php';

// 3. Resolve Request URI & Method
$rawUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($rawUri, PHP_URL_PATH);
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$isHeadRequest = ($method === 'HEAD');
if ($isHeadRequest) {
    $method = 'GET';
}

// Normalize API path (strip /api prefix if present)
$path = preg_replace('#^/api#', '', $path);
$path = '/' . trim($path, '/');

// Parse JSON Body
$rawInput = file_get_contents('php://input');
$input = [];
if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
if (!empty($_POST)) {
    $input = array_merge($input, $_POST);
}

// 4. Exception Handler
try {
    // ROUTE MATCHING

    // --- System ---
    if ($path === '/system/health' && $method === 'GET') {
        SystemController::health();
        exit;
    }
    if ($path === '/system/version' && $method === 'GET') {
        SystemController::version();
        exit;
    }
    if ($path === '/system/stats' && $method === 'GET') {
        SystemController::stats();
        exit;
    }
    if (($path === '/system/mobile' || $path === '/mobile/config') && $method === 'GET') {
        SystemController::mobileConfig();
        exit;
    }
    if ($path === '/manifest.json' && $method === 'GET') {
        SystemController::webManifest();
        exit;
    }
    if (($path === '/download/apk' || $path === '/system/download/apk') && $method === 'GET') {
        SystemController::downloadApk();
        exit;
    }

    // --- Authentication ---
    if ($path === '/auth/register' && $method === 'POST') {
        AuthController::register($input);
        exit;
    }
    if ($path === '/auth/login' && $method === 'POST') {
        AuthController::login($input);
        exit;
    }
    if ($path === '/auth/me' && $method === 'GET') {
        AuthController::me();
        exit;
    }
    if ($path === '/auth/profile' && $method === 'PUT') {
        AuthController::updateProfile($input);
        exit;
    }
    if ($path === '/auth/change-password' && $method === 'POST') {
        AuthController::changePassword($input);
        exit;
    }

    // --- Curriculum ---
    if ($path === '/curriculum/grades' && $method === 'GET') {
        CurriculumController::getGrades();
        exit;
    }
    if (preg_match('#^/curriculum/grades/(\d+)/books$#', $path, $m) && $method === 'GET') {
        CurriculumController::getBooksByGrade((int) $m[1]);
        exit;
    }
    if (preg_match('#^/curriculum/books/(\d+)/chapters$#', $path, $m) && $method === 'GET') {
        CurriculumController::getChaptersByBook((int) $m[1]);
        exit;
    }
    if (preg_match('#^/curriculum/chapters/(\d+)$#', $path, $m) && $method === 'GET') {
        CurriculumController::getChapterDetail((int) $m[1]);
        exit;
    }
    if (preg_match('#^/curriculum/lessons/(\d+)$#', $path, $m) && $method === 'GET') {
        CurriculumController::getLessonDetail((int) $m[1]);
        exit;
    }
    if ($path === '/curriculum/exercises/submit' && $method === 'POST') {
        CurriculumController::submitExercise($input);
        exit;
    }
    if (preg_match('#^/curriculum/lessons/(\d+)/complete$#', $path, $m) && $method === 'POST') {
        CurriculumController::completeLesson((int) $m[1]);
        exit;
    }
    if ($path === '/curriculum/study-materials' && $method === 'GET') {
        CurriculumController::getStudyMaterials();
        exit;
    }
    if ($path === '/curriculum/study-materials/upload' && $method === 'POST') {
        CurriculumController::uploadStudyMaterial();
        exit;
    }
    if ($path === '/curriculum/study-materials' && $method === 'POST') {
        CurriculumController::createStudyMaterial($input);
        exit;
    }
    if (preg_match('#^/curriculum/study-materials/(\d+)$#', $path, $m) && $method === 'PUT') {
        CurriculumController::updateStudyMaterial((int) $m[1], $input);
        exit;
    }
    if (preg_match('#^/curriculum/study-materials/(\d+)$#', $path, $m) && $method === 'DELETE') {
        CurriculumController::deleteStudyMaterial((int) $m[1]);
        exit;
    }
    if (preg_match('#^/curriculum/study-materials/(\d+)/increment-download$#', $path, $m) && $method === 'POST') {
        CurriculumController::incrementDownload((int) $m[1]);
        exit;
    }
    if ($path === '/curriculum/study-materials/cleanup-orphaned' && $method === 'POST') {
        CurriculumController::cleanupOrphaned();
        exit;
    }

    // --- Examinations ---
    if ($path === '/exams' && $method === 'GET') {
        ExamController::listExams();
        exit;
    }
    if ($path === '/exams/my-history' && $method === 'GET') {
        ExamController::getMyHistory();
        exit;
    }
    if (preg_match('#^/exams/(\d+)$#', $path, $m) && $method === 'GET') {
        ExamController::getExamInfo((int) $m[1]);
        exit;
    }
    if (preg_match('#^/exams/(\d+)/start$#', $path, $m) && $method === 'POST') {
        ExamController::startExam((int) $m[1]);
        exit;
    }
    if ($path === '/exams/submit' && $method === 'POST') {
        ExamController::submitExam($input);
        exit;
    }
    if (preg_match('#^/exams/attempts/(\d+)$#', $path, $m) && $method === 'GET') {
        ExamController::getAttemptDetail((int) $m[1]);
        exit;
    }

    // --- Competitions & Leagues ---
    if ($path === '/competitions' && $method === 'GET') {
        CompetitionController::listCompetitions();
        exit;
    }
    if ($path === '/competitions/leagues/standings' && $method === 'GET') {
        CompetitionController::getStandings();
        exit;
    }
    if (preg_match('#^/competitions/(\d+)$#', $path, $m) && $method === 'GET') {
        CompetitionController::getCompetition((int) $m[1]);
        exit;
    }
    if (preg_match('#^/competitions/(\d+)/submit$#', $path, $m) && $method === 'POST') {
        CompetitionController::submitCompetition((int) $m[1], $input);
        exit;
    }
    if (preg_match('#^/competitions/(\d+)/leaderboard$#', $path, $m) && $method === 'GET') {
        CompetitionController::getLeaderboard((int) $m[1]);
        exit;
    }
    // Admin Competitions
    if ($path === '/competitions/admin/create' && $method === 'POST') {
        CompetitionController::adminCreate($input);
        exit;
    }
    if (preg_match('#^/competitions/admin/(\d+)$#', $path, $m) && $method === 'PUT') {
        CompetitionController::adminUpdate((int) $m[1], $input);
        exit;
    }
    if (preg_match('#^/competitions/admin/(\d+)$#', $path, $m) && $method === 'DELETE') {
        CompetitionController::adminDelete((int) $m[1]);
        exit;
    }
    if (preg_match('#^/competitions/admin/(\d+)/submissions$#', $path, $m) && $method === 'GET') {
        CompetitionController::adminGetSubmissions((int) $m[1]);
        exit;
    }
    if (preg_match('#^/competitions/admin/(\d+)/submissions/(\d+)/grade$#', $path, $m) && $method === 'POST') {
        CompetitionController::adminGradeSubmission((int) $m[1], (int) $m[2], $input);
        exit;
    }

    // --- Gamification ---
    if ($path === '/gamification/dashboard' && $method === 'GET') {
        GamificationController::dashboard();
        exit;
    }
    if ($path === '/gamification/leaderboards' && $method === 'GET') {
        GamificationController::leaderboards();
        exit;
    }
    if ($path === '/gamification/badges' && $method === 'GET') {
        GamificationController::badges();
        exit;
    }
    if ($path === '/gamification/xp-history' && $method === 'GET') {
        GamificationController::xpHistory();
        exit;
    }
    if ($path === '/gamification/lab-progress' && $method === 'GET') {
        GamificationController::labProgress();
        exit;
    }
    if ($path === '/gamification/lab-activity' && $method === 'POST') {
        GamificationController::recordLabActivity($input);
        exit;
    }

    // --- Admin Deck ---
    if ($path === '/admin/overview' && $method === 'GET') {
        AdminController::overview();
        exit;
    }
    if ($path === '/admin/validation-report' && $method === 'GET') {
        AdminController::validationReport();
        exit;
    }
    if ($path === '/admin/questions' && $method === 'GET') {
        AdminController::getQuestions();
        exit;
    }
    if ($path === '/admin/questions' && $method === 'POST') {
        AdminController::createQuestion($input);
        exit;
    }
    if (preg_match('#^/admin/questions/(\d+)$#', $path, $m) && $method === 'DELETE') {
        AdminController::deleteQuestion((int) $m[1]);
        exit;
    }
    if ($path === '/admin/curriculum/tree' && $method === 'GET') {
        AdminController::getCurriculumTree();
        exit;
    }
    if ($path === '/admin/curriculum/chapters' && $method === 'POST') {
        AdminController::createChapter($input);
        exit;
    }
    if (preg_match('#^/admin/curriculum/chapters/(\d+)$#', $path, $m) && $method === 'DELETE') {
        AdminController::deleteChapter((int) $m[1]);
        exit;
    }
    if ($path === '/admin/curriculum/lessons' && $method === 'POST') {
        AdminController::createLesson($input);
        exit;
    }
    if (preg_match('#^/admin/curriculum/lessons/(\d+)$#', $path, $m) && $method === 'DELETE') {
        AdminController::deleteLesson((int) $m[1]);
        exit;
    }
    if ($path === '/admin/textbooks/upload' && $method === 'POST') {
        AdminController::uploadTextbook();
        exit;
    }
    if (preg_match('#^/admin/textbooks/(\d+)/process$#', $path, $m) && $method === 'POST') {
        AdminController::processTextbook((int) $m[1]);
        exit;
    }
    if ($path === '/admin/reviews/written-queue' && $method === 'GET') {
        AdminController::getWrittenQueue();
        exit;
    }
    if ($path === '/admin/reviews/override' && $method === 'POST') {
        AdminController::overrideGrade($input);
        exit;
    }
    if ($path === '/admin/ai/config' && $method === 'GET') {
        AdminController::getAiConfig();
        exit;
    }
    if ($path === '/admin/ai/config' && $method === 'POST') {
        AdminController::updateAiConfig($input);
        exit;
    }
    if ($path === '/admin/ai/test-connection' && $method === 'POST') {
        AdminController::testAiConnection();
        exit;
    }
    if ($path === '/admin/students' && $method === 'GET') {
        AdminController::getStudents();
        exit;
    }
    if ($path === '/admin/students/create' && $method === 'POST') {
        AdminController::createStudent($input);
        exit;
    }
    if (preg_match('#^/admin/students/(\d+)/reset-password$#', $path, $m) && $method === 'POST') {
        AdminController::resetStudentPassword((int) $m[1], $input);
        exit;
    }
    if (preg_match('#^/admin/students/(\d+)/adjust-xp$#', $path, $m) && $method === 'POST') {
        AdminController::adjustStudentXp((int) $m[1], $input);
        exit;
    }
    if (preg_match('#^/admin/students/(\d+)/toggle-status$#', $path, $m) && $method === 'POST') {
        AdminController::toggleStudentStatus((int) $m[1]);
        exit;
    }
    if (preg_match('#^/admin/students/(\d+)$#', $path, $m) && $method === 'DELETE') {
        AdminController::deleteStudent((int) $m[1]);
        exit;
    }
    if (preg_match('#^/admin/students/(\d+)/details$#', $path, $m) && $method === 'GET') {
        AdminController::getStudentDetails((int) $m[1]);
        exit;
    }
    if (preg_match('#^/admin/students/(\d+)$#', $path, $m) && $method === 'PUT') {
        AdminController::updateStudent((int) $m[1], $input);
        exit;
    }
    if (preg_match('#^/admin/students/(\d+)/attempts/(\d+)$#', $path, $m) && $method === 'DELETE') {
        AdminController::resetStudentExamAttempt((int) $m[1], (int) $m[2]);
        exit;
    }

    // --- Nexora AI ---
    if ($path === '/ai/tutor' && $method === 'POST') {
        AiController::tutor($input);
        exit;
    }
    if ($path === '/ai/explain-mistake' && $method === 'POST') {
        AiController::explainMistake($input);
        exit;
    }

    // --- Live Lab ---
    if ($path === '/live-lab/rooms' && $method === 'GET') {
        LiveLabController::listRooms();
        exit;
    }
    if ($path === '/live-lab/rooms' && $method === 'POST') {
        LiveLabController::createRoom($input);
        exit;
    }
    if (preg_match('#^/live-lab/rooms/([^/]+)$#', $path, $m) && $method === 'GET') {
        LiveLabController::getRoom($m[1]);
        exit;
    }
    if (preg_match('#^/live-lab/rooms/([^/]+)$#', $path, $m) && $method === 'DELETE') {
        LiveLabController::closeRoom($m[1]);
        exit;
    }
    if (preg_match('#^/live-lab/rooms/([^/]+)/change-simulator$#', $path, $m) && $method === 'POST') {
        LiveLabController::changeSimulator($m[1], $input);
        exit;
    }
    if (preg_match('#^/live-lab/rooms/([^/]+)/toggle-lock$#', $path, $m) && $method === 'POST') {
        LiveLabController::toggleLock($m[1], $input);
        exit;
    }
    if (preg_match('#^/live-lab/rooms/([^/]+)/clear-chat$#', $path, $m) && $method === 'POST') {
        LiveLabController::clearChat($m[1]);
        exit;
    }
    if (preg_match('#^/live-lab/rooms/([^/]+)/vote$#', $path, $m) && $method === 'POST') {
        LiveLabController::vote($m[1], $input);
        exit;
    }

    // Default Not Found
    http_response_code(404);
    echo json_encode([
        'detail' => 'مسیریابی نامعتبر در API: ' . $path,
        'path' => $path
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'detail' => 'خطای غیرمنتظره در سرور: ' . $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}
