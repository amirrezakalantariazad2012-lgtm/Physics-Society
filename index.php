<?php
/**
 * QUANTUM CUT — Physics Educational Platform (Pure PHP Edition)
 * Observatory Shell · Main Single Page Application Host & Web Entrypoint
 *
 * "THE UNIVERSE IS OUR LABORATORY"
 */

declare(strict_types=1);

require_once __DIR__ . '/backend/config.php';

// Production OWASP Security & Anti-Cache Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
// Sensors and the audio-resonance lab rely on microphone access from this origin.
header("Permissions-Policy: geolocation=(), microphone=(self), camera=(self)");
header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");
header("Content-Type: text/html; charset=UTF-8");

$appBuild = '2027.01.observatory.1';
$assetVer = '5.0.0';
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#070d18" id="meta-theme-color">
    <meta name="color-scheme" content="dark light">
    <meta name="description" content="انجمن فیزیک شهید بهشتی دو دوره اول — پرتال تخصصی آموزش فیزیک، آزمایشگاه‌های تعاملی، لیگ‌های علمی، آزمون تطبیقی و دستیار هوشمند سقراطی برای پایه‌های هفتم، هشتم و نهم.">
    <meta name="application-name" content="انجمن فیزیک شهید بهشتی دو">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="fa_IR">
    <meta property="og:title" content="انجمن فیزیک شهید بهشتی دو دوره اول — کیهان، آزمایشگاه ماست">
    <meta property="og:description" content="پرتال علمی آموزش فیزیک، آزمایشگاه‌های تعاملی PhET، لیگ‌های کوانتومی و سنجش تشریحی هوشمند.">
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
    <link rel="apple-touch-icon" href="/assets/favicon.svg">
    <title>انجمن فیزیک شهید بهشتی دو دوره اول — پرتال علمی فیزیک</title>

    <!-- Theme bootstrap: stored preference → system preference → deep space -->
    <script>
        (function () {
            var root = document.documentElement;
            var theme = null;
            try {
                var forced = new URLSearchParams(window.location.search).get('theme');
                if (forced === 'light' || forced === 'dark') theme = forced;
                else theme = localStorage.getItem('theme');
            } catch (e) {}
            if (theme !== 'light' && theme !== 'dark') {
                theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
            }
            root.classList.toggle('dark', theme === 'dark');
            root.classList.toggle('light', theme === 'light');
            root.setAttribute('data-theme', theme);
            root.style.colorScheme = theme;
            // Calm the visuals on constrained devices
            try {
                var nav = navigator;
                var lowPower = (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) ||
                    (nav.deviceMemory && nav.deviceMemory <= 2) ||
                    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
                if (lowPower) root.classList.add('qc-low-power');
            } catch (e) {}
        })();
    </script>

    <!-- Tailwind runtime (utility layout engine) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
                            400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
                            800: '#1e40af', 900: '#1e3a8a'
                        },
                        duo: {
                            green: '#0f9d63', greenDark: '#0b8051',
                            yellow: '#d97706', yellowDark: '#b45309',
                            blue: '#0b74d8', blueDark: '#095eb0',
                            red: '#e11d48', redDark: '#be123c'
                        }
                    },
                    fontFamily: {
                        sans: ['Vazirmatn', 'Vazir', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
                        en: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
                    }
                }
            }
        }
    </script>

    <!-- Typography: Vazirmatn (Persian) · Inter (Latin) · JetBrains Mono (units & math) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">

    <!-- KaTeX — offline-first scientific formula rendering -->
    <link rel="stylesheet" href="/assets/katex/katex.min.css.php">
    <script src="/assets/katex/katex.min.js.php"></script>
    <script src="/assets/katex/auto-render.min.js.php"></script>

    <!-- Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Observatory Design System -->
    <link rel="stylesheet" href="/css/style.css.php?v=<?= $assetVer ?>">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "انجمن فیزیک شهید بهشتی دو دوره اول",
        "alternateName": "SAMPAD Physics Society",
        "description": "پلتفرم آموزش تعاملی فیزیک، آزمایشگاه‌های مجازی و لیگ‌های علمی دوره اول متوسطه",
        "inLanguage": "fa-IR"
    }
    </script>
</head>
<body class="min-h-screen flex flex-col font-sans antialiased">

    <a href="#app-main-content" class="qc-skip">پرش به محتوای اصلی</a>

    <!-- Cosmic background layers -->
    <div class="qc-atmosphere" aria-hidden="true"></div>
    <div class="qc-grid-veil" aria-hidden="true"></div>
    <canvas id="physics-particles-canvas" aria-hidden="true"></canvas>
    <div class="qc-scroll-progress" id="qc-scroll-progress" aria-hidden="true"></div>

    <!-- Top navigation (rendered by the navbar component) -->
    <div id="navbar-container" class="relative z-40 w-full"></div>

    <!-- Main content container (SPA views render here) -->
    <main id="app-main-content" class="flex-1 w-full relative z-10 pb-24 md:pb-8" tabindex="-1"></main>

    <!-- Observatory footer -->
    <footer class="qc-footer">
        <div class="qc-shell">
            <div class="qc-footer__grid">
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <span class="qc-brand__mark" aria-hidden="true">
                            <i data-lucide="atom" class="w-5 h-5"></i>
                        </span>
                        <div>
                            <div class="text-sm font-black text-[var(--ink)]">انجمن فیزیک شهید بهشتی دو</div>
                            <div class="qc-eyebrow mt-1" style="font-size:9px;letter-spacing:.2em;">SAMPAD PHYSICS SOCIETY</div>
                        </div>
                    </div>
                    <p class="text-xs leading-[2] text-[var(--muted)] max-w-md">
                        پرتال علمی آموزش فیزیک، آزمایشگاه‌های تعاملی، سنجش تشریحی هوشمند و لیگ‌های کوانتومی برای پایه‌های هفتم، هشتم و نهم دوره اول متوسطه؛ طراحی‌شده بر پایه سرفصل‌های رسمی وزارت آموزش و پرورش و کتب تکمیلی استعدادهای درخشان.
                    </p>
                    <div class="qc-spectrum max-w-xs" aria-hidden="true"></div>
                    <p class="text-[11px] leading-relaxed text-[var(--muted-2)] font-mono" dir="ltr" style="text-align:right;">
                        &#955; · λ = c / ν &nbsp;|&nbsp; E = hν &nbsp;|&nbsp; F = ma
                    </p>
                </div>

                <div>
                    <h3 class="qc-footer__title">یادگیری</h3>
                    <ul class="space-y-1">
                        <li><a class="qc-footer__link" href="#curriculum"><i data-lucide="book-open" class="w-3.5 h-3.5"></i>سرفصل‌های فیزیک</a></li>
                        <li><a class="qc-footer__link" href="#materials"><i data-lucide="file-text" class="w-3.5 h-3.5"></i>درسنامه‌ها و فرمول‌نامه‌ها</a></li>
                        <li><a class="qc-footer__link" href="#adaptive-exam"><i data-lucide="target" class="w-3.5 h-3.5"></i>آزمون تطبیقی (CAT)</a></li>
                        <li><a class="qc-footer__link" href="#leaderboards"><i data-lucide="bar-chart-3" class="w-3.5 h-3.5"></i>جدول رتبه‌بندی</a></li>
                        <li><a class="qc-footer__link" href="#badges"><i data-lucide="medal" class="w-3.5 h-3.5"></i>مدال‌ها و دستاوردها</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="qc-footer__title">آزمایشگاه و آرنا</h3>
                    <ul class="space-y-1">
                        <li><a class="qc-footer__link" href="#simulators"><i data-lucide="flask-conical" class="w-3.5 h-3.5"></i>آزمایشگاه‌های PhET</a></li>
                        <li><a class="qc-footer__link" href="#sensor-lab"><i data-lucide="smartphone" class="w-3.5 h-3.5"></i>آزمایشگاه سنسوری</a></li>
                        <li><a class="qc-footer__link" href="#data-logger"><i data-lucide="line-chart" class="w-3.5 h-3.5"></i>برازش خطی داده‌ها</a></li>
                        <li><a class="qc-footer__link" href="#duel"><i data-lucide="swords" class="w-3.5 h-3.5"></i>دوئل ۱ به ۱ کوانتومی</a></li>
                        <li><a class="qc-footer__link" href="#guilds"><i data-lucide="shield" class="w-3.5 h-3.5"></i>خاندان‌های علمی</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="qc-footer__title">سامانه و منابع</h3>
                    <ul class="space-y-1">
                        <li><a class="qc-footer__link" href="#live-lab"><i data-lucide="radio" class="w-3.5 h-3.5"></i>کلاس زنده دبیر</a></li>
                        <li><a class="qc-footer__link" href="#teacher-heatmap"><i data-lucide="flame" class="w-3.5 h-3.5"></i>ماتریس کج‌فهمی‌ها</a></li>
                        <li><a class="qc-footer__link" href="/downloads/physics-society.apk" download="PhysicsSociety-SAMPAD.apk" target="_blank" rel="noopener noreferrer"><i data-lucide="download" class="w-3.5 h-3.5"></i>اپلیکیشن اندروید (APK)</a></li>
                        <li><a class="qc-footer__link" href="/api/system/health" target="_blank" rel="noopener noreferrer"><i data-lucide="activity" class="w-3.5 h-3.5"></i>وضعیت سلامت API</a></li>
                        <li><a class="qc-footer__link" href="/docs/STUDENT_GUIDE.md" target="_blank" rel="noopener noreferrer"><i data-lucide="life-buoy" class="w-3.5 h-3.5"></i>راهنمای دانش‌آموز</a></li>
                    </ul>
                </div>
            </div>

            <div class="qc-footer__bottom">
                <span>© انجمن فیزیک شهید بهشتی دو دوره اول — تمامی حقوق محفوظ است.</span>
                <div class="flex flex-wrap items-center gap-3">
                    <span class="qc-chip qc-chip--ok qc-chip--mono">
                        <span class="qc-dot qc-dot--live"></span>
                        PHP <?= PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION ?> · ONLINE
                    </span>
                    <span class="qc-chip qc-chip--mono">BUILD <?= htmlspecialchars($appBuild, ENT_QUOTES, 'UTF-8') ?></span>
                    <span class="qc-chip qc-chip--mono">سال تحصیلی ۱۴۰۴–۱۴۰۵</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Floating AI tutor trigger -->
    <div id="ai-tutor-floating-container" class="fixed bottom-24 md:bottom-6 left-3 sm:left-6 z-40">
        <button id="ai-tutor-btn" onclick="window.toggleAiTutorModal(true)"
            class="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl qc-copilot text-[var(--ink)] transition-transform duration-300 hover:-translate-y-1">
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
                <span class="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping"></span>
                <span class="relative inline-flex h-3 w-3 rounded-full bg-[var(--accent)]"></span>
            </span>
            <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(145deg,var(--accent-2),var(--accent-3));">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
            </span>
            <span class="text-right leading-tight">
                <span class="block text-[11px] font-black">معلم هوشمند فیزیک</span>
                <span class="block text-[9px] font-mono text-[var(--accent)]" dir="ltr">NEXORA · GPT OSS 120B</span>
            </span>
        </button>
    </div>

    <!-- AI tutor floating copilot window -->
    <div id="ai-tutor-modal" class="hidden fixed bottom-0 md:bottom-5 left-0 right-0 md:left-5 md:right-auto z-50 w-full md:w-[430px] md:max-w-[calc(100vw-1.5rem)] h-[86vh] md:h-[600px] max-h-[94vh] md:max-h-[calc(100vh-4rem)] rounded-t-3xl md:rounded-3xl qc-copilot flex flex-col overflow-hidden transition-all duration-300">
        <div class="md:hidden w-10 h-1 rounded-full mx-auto my-1.5 shrink-0" style="background:var(--line-strong);"></div>

        <div class="px-3.5 py-3 border-b border-[var(--line)] flex items-center justify-between gap-2 shrink-0 select-none">
            <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0" style="background:linear-gradient(145deg,var(--accent-2),var(--accent-3));">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                </div>
                <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                        <h3 class="font-black text-[13px] text-[var(--ink)] truncate">دستیار علمی سامانه</h3>
                        <span class="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--accent-soft)] border border-[var(--accent-line)] text-[var(--accent)] font-mono font-bold" dir="ltr">GPT OSS 120B</span>
                    </div>
                    <p class="text-[10px] text-[var(--muted)] truncate" id="ai-tutor-grade-label">موتور Inferbase AI · آگاه از صفحه جاری</p>
                </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
                <select id="ai-model-selector" title="انتخاب مدل هوش مصنوعی" class="qc-select" style="width:auto;padding:.28rem .4rem;font-size:9.5px;">
                    <option value="openai-gpt-oss-120b" selected>GPT OSS 120B</option>
                    <option value="auto">مسیریاب خودکار</option>
                    <option value="deepseek-v3-2">DeepSeek V3.2</option>
                </select>
                <button type="button" onclick="window.minimizeAiCopilot()" title="کوچک‌نمایی" class="qc-icon-btn" style="width:28px;height:28px;">
                    <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                </button>
                <button type="button" onclick="window.toggleAiTutorModal(false)" title="بستن" class="qc-icon-btn" style="width:28px;height:28px;">
                    <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>

        <div id="ai-copilot-context-bar" class="px-3.5 py-2 border-b border-[var(--line)] flex items-center justify-between gap-2 shrink-0 text-[11px]">
            <div class="flex items-center gap-1.5 text-[var(--muted)] truncate">
                <i data-lucide="compass" class="w-3.5 h-3.5 text-[var(--accent)] shrink-0"></i>
                <span class="truncate font-semibold" id="ai-current-page-text">زمینه: در حال بارگذاری صفحه…</span>
            </div>
            <button type="button" onclick="window.askAboutCurrentPage()"
                class="shrink-0 px-2.5 py-1 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-line)] text-[var(--accent)] text-[10px] font-bold flex items-center gap-1 transition-transform hover:scale-105">
                <span>پرسش از این صفحه</span>
            </button>
        </div>

        <div id="ai-tutor-chat-body" class="p-3.5 overflow-y-auto flex-1 space-y-3 text-xs flex flex-col">
            <div class="qc-chat-bubble--bot">
                سلام! من دستیار علمی همراه شما در سامانه انجمن فیزیک شهید بهشتی دو هستم.
                این پنجره شناور است تا هم‌زمان با مطالعه درسنامه، آزمایش یا مسابقه، پرسش‌های مفهومی خود را بپرسید.
            </div>

            <div class="space-y-1.5 pt-1">
                <span class="text-[10px] text-[var(--muted)] font-bold block">موضوعات پیشنهادی:</span>
                <div class="flex flex-wrap gap-1.5">
                    <button onclick="window.askQuickTutor('چگالی چطور محاسبه می‌شود و یکای آن چیست؟')" class="qc-chip qc-chip--accent" style="cursor:pointer;font-size:10px;">چگالی و یکای SI</button>
                    <button onclick="window.askQuickTutor('قانون دوم نیوتون را با مثال توضیح بده')" class="qc-chip qc-chip--violet" style="cursor:pointer;font-size:10px;">قانون دوم نیوتون</button>
                    <button onclick="window.askQuickTutor('تفاوت جرم و وزن در سطح ماه و زمین چیست؟')" class="qc-chip" style="cursor:pointer;font-size:10px;">جرم و وزن</button>
                    <button onclick="window.askQuickTutor('اصل پاسکال و بالابر هیدرولیکی چگونه کار می‌کند؟')" class="qc-chip qc-chip--ok" style="cursor:pointer;font-size:10px;">فشار و اصل پاسکال</button>
                </div>
            </div>
        </div>

        <form id="ai-tutor-form" onsubmit="window.handleAiTutorSubmit(event)" class="p-2.5 border-t border-[var(--line)] flex items-center gap-2 shrink-0">
            <input type="text" id="ai-tutor-input" placeholder="پرسش خود را بنویسید…" class="qc-input" style="padding:.55rem .75rem;font-size:.76rem;">
            <button type="submit" id="ai-tutor-submit-btn" class="qc-btn" style="padding:.55rem .9rem;">
                <span>ارسال</span>
                <i data-lucide="send" class="w-3.5 h-3.5"></i>
            </button>
        </form>
    </div>

    <!-- Utilities -->
    <button type="button" id="qc-back-to-top" class="qc-top-btn" title="بازگشت به بالا" aria-label="بازگشت به بالای صفحه">
        <i data-lucide="arrow-up" class="w-4 h-4"></i>
    </button>
    <div id="qc-toast-host" class="qc-toast-host" role="status" aria-live="polite"></div>
    <div id="qc-palette-host"></div>

    <!-- Build fingerprint (single reload, no loops) -->
    <script>
        (function () {
            var CURRENT_APP_BUILD = '<?= $appBuild ?>';
            try {
                var lastBuild = localStorage.getItem('phy_build_tag');
                localStorage.setItem('phy_build_tag', CURRENT_APP_BUILD);
                if (lastBuild && lastBuild !== CURRENT_APP_BUILD) {
                    localStorage.setItem('phy_build_last_reload', String(Date.now()));
                    if ('caches' in window) {
                        caches.keys().then(function (names) { names.forEach(function (n) { caches.delete(n); }); });
                    }
                }
            } catch (e) {}
        })();
    </script>

    <!-- Core scripts -->
    <script src="/js/store.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/api.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/ui.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/navbar.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/physics_simulators.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/live_lab_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/duolingo_player.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/exam_runner.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/competition_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/leaderboards.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/admin_views.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/pvp_duel_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/guild_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/adaptive_exam_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/mobile_sensor_lab.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/lab_data_logger.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/handwriting_grader_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/olympiad_hint_modal.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/teacher_heatmap_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/components/printable_exam_view.js.php?v=<?= $assetVer ?>"></script>
    <script src="/js/app.js.php?v=<?= $assetVer ?>"></script>

    <!-- Scientific formula renderer -->
    <script>
        function renderMathInPage(targetEl) {
            targetEl = targetEl || document.body;
            if (!targetEl) return;
            if (window.renderMathInElement) {
                try {
                    window.renderMathInElement(targetEl, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '\\[', right: '\\]', display: true }
                        ],
                        throwOnError: false,
                        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
                    });
                } catch (e) {
                    console.warn('Math rendering notice:', e);
                }
            }
            if (window.katex && targetEl) {
                targetEl.querySelectorAll('.katex-ltr-container, .academic-mono').forEach(function (el) {
                    if (el.querySelector('.katex')) return;
                    var raw = el.textContent.trim();
                    if (raw.startsWith('$$') && raw.endsWith('$$')) raw = raw.slice(2, -2).trim();
                    else if (raw.startsWith('$') && raw.endsWith('$')) raw = raw.slice(1, -1).trim();
                    if (raw && (raw.includes('\\') || raw.includes('^') || raw.includes('_') || raw.includes('='))) {
                        try {
                            window.katex.render(raw, el, { displayMode: true, throwOnError: false });
                        } catch (err) {
                            console.warn('KaTeX fallback error:', err);
                        }
                    }
                });
            }
        }
        window.renderMathInPage = renderMathInPage;
        window.renderScientificFormulas = renderMathInPage;

        window.addEventListener('view-changed', function () { setTimeout(renderMathInPage, 80); });
        window.addEventListener('user-changed', function () { setTimeout(renderMathInPage, 100); });

        document.addEventListener('DOMContentLoaded', function () {
            renderMathInPage();
            var mainApp = document.getElementById('app-main-content');
            if (mainApp && window.MutationObserver) {
                var t = null;
                var observer = new MutationObserver(function () {
                    if (t) clearTimeout(t);
                    t = setTimeout(function () { renderMathInPage(mainApp); }, 60);
                });
                observer.observe(mainApp, { childList: true, subtree: true });
            }
        });

        // PWA offline support
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').catch(function (err) {
                    console.log('SW registration note:', err);
                });
            });
        }
    </script>

    <noscript>
        <div style="padding:2rem;text-align:center;font-family:Vazirmatn,sans-serif;">
            برای استفاده از پرتال تعاملی فیزیک، لطفاً جاوااسکریپت مرورگر خود را فعال کنید.
        </div>
    </noscript>
</body>
</html>
