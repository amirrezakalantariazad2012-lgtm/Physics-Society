/**
 * Main Single Page Application Router & State Orchestrator
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // 0. Initialize Scientific Particle Canvas
    initParticleCanvas();

    // 1. Check for stored token and fetch current user
    if (window.api.token) {
        try {
            const user = await window.api.getCurrentUser();
            window.store.setUser(user);
            if (user && user.must_change_password) {
                openForcedPasswordModal();
            }
        } catch (e) {
            console.warn('Session expired or invalid:', e);
            window.api.setToken(null);
            window.store.setUser(null);
        }
    }

    // 2. Setup hash routing listener
    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('view-changed', () => renderCurrentView());
    window.addEventListener('user-changed', () => {
        updateNavbar();
        renderCurrentView();
    });
    window.addEventListener('auth-expired', () => {
        const hadUser = !!window.store.currentUser;
        window.store.setUser(null);
        if (hadUser) {
            window.store.setView('landing');
        }
    });

    // 3. Initial Route
    handleRouting();
});

// Particle Canvas Implementation
function initParticleCanvas() {
    const canvas = document.getElementById('physics-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 22000), 55);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1,
            color: i % 3 === 0 ? 'rgba(59, 130, 246, 0.7)' : (i % 3 === 1 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(14, 165, 233, 0.6)')
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 115) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.16 * (1 - dist / 115)})`;
                    ctx.lineWidth = 0.75;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

function updateNavbar() {
    const navContainer = document.getElementById('navbar-container');
    if (navContainer && window.renderNavbar) {
        navContainer.innerHTML = window.renderNavbar();
        if (window.lucide) window.lucide.createIcons();
    }
}
window.updateNavbar = updateNavbar;

function handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'landing';
    const parts = hash.split('/');
    const viewName = parts[0];
    const viewId = parts[1] || null;

    window.store.currentView = viewName;
    window.store.viewParams = { id: viewId };
    updateNavbar();
    renderCurrentView();
}

async function renderCurrentView() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    const view = window.store.currentView;
    const params = window.store.viewParams;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'login') {
        openAuthModal('login');
        return;
    } else if (view === 'register') {
        openAuthModal('register');
        return;
    } else if (view === 'landing') {
        await renderLandingView(mainContainer);
    } else if (view === 'dashboard') {
        if (!window.store.currentUser) {
            openAuthModal('login');
            return;
        }
        if (window.store.currentUser.must_change_password) {
            openForcedPasswordModal();
            return;
        }
        await renderDashboardView(mainContainer);
    } else if (view === 'curriculum') {
        await renderCurriculumView(mainContainer, params.id);
    } else if (view === 'chapter') {
        await renderChapterDetailView(mainContainer, params.id);
    } else if (view === 'lesson') {
        await loadAndStartLesson(mainContainer, params.id);
    } else if (view === 'exam') {
        await loadAndStartExam(mainContainer, params.id);
    } else if (view === 'competitions') {
        if (window.renderCompetitionsView) {
            await window.renderCompetitionsView('app-main-content');
        }
    } else if (view === 'leaderboards') {
        if (window.renderLeaderboardsView) {
            await window.renderLeaderboardsView('app-main-content');
        }
    } else if (view === 'simulators') {
        await renderSimulatorsCatalogView(mainContainer, params.id || 'density');
    } else if (view === 'badges') {
        if (window.renderBadgesView) {
            await window.renderBadgesView('app-main-content');
        }
    } else if (view === 'admin') {
        if (!window.store.currentUser || window.store.currentUser.role !== 'admin') {
            openAuthModal('login');
            return;
        }
        if (window.store.currentUser.must_change_password) {
            openForcedPasswordModal();
            return;
        }
        window.currentAdminViews = new window.AdminViews('app-main-content');
        window.currentAdminViews.render();
    } else {
        await renderLandingView(mainContainer);
    }

    if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// VIEW: LANDING PAGE
// ==========================================
async function renderLandingView(container) {
    let stats = { students_count: 0, questions_count: 360, exams_count: 12, competitions_count: 1 };
    try {
        stats = await window.api.getPublicStats();
    } catch (e) {}

    container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-16 sm:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div class="space-y-6 text-right">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold cyber-glow-cyan">
                        <i data-lucide="atom" class="w-4 h-4 text-cyan-400"></i>
                        <span>انجمن فیزیک شهید بهشتی دو دوره اول</span>
                    </div>

                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        یادگیری عمیق فیزیک، <br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">لیگ‌های کوانتومی و هوش مصنوعی</span>
                    </h1>

                    <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                        پلتفرم تخصصی آموزش فیزیک پایه‌های هفتم، هشتم و نهم بر پایه کتاب‌های رسمی و کتب تکمیلی استعدادهای درخشان. همراه با شبیه‌سازهای آزمایشگاهی، تصحیح هوشمند، لیگ‌های هفتگی و گیمیفیکیشن.
                    </p>

                    <div class="flex flex-wrap items-center gap-4 pt-4">
                        <button onclick="window.store.setView('curriculum')" class="btn-duo-green text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg flex items-center gap-2">
                            <span>شروع یادگیری فیزیک</span>
                            <i data-lucide="arrow-left" class="w-4 h-4"></i>
                        </button>
                        <button onclick="window.store.setView('competitions')" class="btn-duo-yellow text-slate-900 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm flex items-center gap-2">
                            <i data-lucide="trophy" class="w-4 h-4 text-amber-700"></i>
                            <span>مسابقه هفتگی</span>
                        </button>
                    </div>

                    <!-- Mini Highlights -->
                    <div class="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                        <div class="flex items-center gap-2">
                            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>
                            <span>۳۶۰+ سؤال تستی و تشریحی</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i data-lucide="cpu" class="w-4 h-4 text-blue-500"></i>
                            <span>تصحیح هوشمند AI</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i data-lucide="award" class="w-4 h-4 text-amber-500"></i>
                            <span>مدال‌ها و استمرار</span>
                        </div>
                    </div>
                </div>

                <!-- Hero Graphic / Illustration -->
                <div class="relative">
                    <div class="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-emerald-600/10 p-8 border border-slate-200 dark:border-slate-800 relative flex flex-col justify-center items-center text-center space-y-6">
                        <div class="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 animate-pulse">
                            <i data-lucide="atom" class="w-14 h-14"></i>
                        </div>
                        <div class="space-y-2">
                            <h3 class="text-xl font-bold text-slate-800 dark:text-white">آزمایشگاه مجازی فیزیک سمپاد</h3>
                            <p class="text-xs text-slate-500 max-w-xs">نیرو، کار، انرژی، مغناطیس، الکتریسیته، نور، فشار و ماشین‌ها در محیطی مدرن</p>
                        </div>
                        <!-- Mini Card badges -->
                        <div class="flex items-center gap-3">
                            <span class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm">پایه هفتم</span>
                            <span class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm">پایه هشتم</span>
                            <span class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm">پایه نهم</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 3 Grades Selection Grid -->
    <section class="py-12 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div class="text-center space-y-2">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white">پایه‌های تحصیلی و سرفصل‌های آموزشی</h2>
                <p class="text-xs text-slate-500">پایه مورد نظر خود را جهت مشاهده کتاب‌های درسی و دروس تعاملی انتخاب کنید</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Grade 7 -->
                <div onclick="window.store.currentUser && window.store.currentUser.role === 'student' ? window.store.setView('curriculum', { id: window.store.currentUser.grade_id }) : window.store.setView('curriculum', { id: 1 })" class="physics-card-3d bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer space-y-4 relative overflow-hidden">
                    ${window.store.currentUser && window.store.currentUser.grade_id === 1 ? '<span class="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-400/30">پایه شما</span>' : ''}
                    <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-500 flex items-center justify-center font-black text-xl">
                        ۷
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-800 dark:text-white">پایه هفتم</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">اندازه‌گیری و ابزارها • انرژی و تبدیل‌های آن • منابع انرژی • گرما و بهینه‌سازی مصرف</p>
                    </div>
                    <div class="flex items-center justify-between text-xs font-bold text-blue-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>۲ کتاب • ۴ فصل جامع فیزیک</span>
                        <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    </div>
                </div>

                <!-- Grade 8 -->
                <div onclick="window.store.currentUser && window.store.currentUser.role === 'student' ? window.store.setView('curriculum', { id: window.store.currentUser.grade_id }) : window.store.setView('curriculum', { id: 2 })" class="physics-card-3d bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer space-y-4 relative overflow-hidden">
                    ${window.store.currentUser && window.store.currentUser.grade_id === 2 ? '<span class="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-400/30">پایه شما</span>' : ''}
                    <div class="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-400 flex items-center justify-center font-black text-xl">
                        ۸
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-800 dark:text-white">پایه هشتم</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">الکتریسیته ساکن و جاری • مغناطیس و قطب‌ها • نور و بازتاب • شکست نور و عدسی‌ها</p>
                    </div>
                    <div class="flex items-center justify-between text-xs font-bold text-indigo-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>۲ کتاب • ۴ فصل جامع فیزیک</span>
                        <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    </div>
                </div>

                <!-- Grade 9 -->
                <div onclick="window.store.currentUser && window.store.currentUser.role === 'student' ? window.store.setView('curriculum', { id: window.store.currentUser.grade_id }) : window.store.setView('curriculum', { id: 3 })" class="physics-card-3d bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer space-y-4 relative overflow-hidden">
                    ${window.store.currentUser && window.store.currentUser.grade_id === 3 ? '<span class="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold border border-purple-400/30">پایه شما</span>' : ''}
                    <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-400 flex items-center justify-center font-black text-xl">
                        ۹
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-800 dark:text-white">پایه نهم</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">حرکت، تندی و شتاب • نیرو و قوانین نیوتون • فشار جامدات و شاره‌ها • ماشین‌ها و اهرم‌ها</p>
                    </div>
                    <div class="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>۲ کتاب • ۴ فصل جامع فیزیک</span>
                        <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
}

// ==========================================
// VIEW: STUDENT DASHBOARD (DEDICATED 7, 8, 9)
// ==========================================
async function renderDashboardView(container) {
    container.innerHTML = `<div class="text-center py-12"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>`;
    try {
        const data = await window.api.getDashboard();
        const s = data.student;

        // Determine student's grade (7, 8, or 9)
        let gradeNum = 7;
        let gradeId = 1;
        if (s.grade_title_fa) {
            if (s.grade_title_fa.includes('هشتم')) { gradeNum = 8; gradeId = 2; }
            else if (s.grade_title_fa.includes('نهم')) { gradeNum = 9; gradeId = 3; }
        }

        // Fetch student's books from real DB
        let books = [];
        try {
            books = await window.api.getBooks(gradeId);
        } catch (e) {
            console.warn('Could not fetch grade books:', e);
        }

        // Distinct scientific themes & labs for each grade
        const gradeConfigs = {
            7: {
                themeClass: 'grade-theme-7',
                heroGradient: 'from-amber-600 via-orange-700 to-slate-900 border-amber-500/30',
                gradeBadge: 'پایه هفتم — کاوشگر ماده، اندازه‌گیری و انرژی',
                badgeIcon: 'flame',
                accentColor: 'amber',
                formula: '$$W = F \\cdot d \\quad , \\quad E_k = \\frac{1}{2}m v^2 \\quad , \\quad Q = mc\\Delta T$$',
                labTitle: 'میز کار آزمایشگاه هفتم: اندازه‌گیری، چگالی و تبدیل انرژی',
                labDesc: 'بررسی دقیق یکاهای استاندارد SI، رابطه چگالی $\\rho = \\frac{m}{V}$، تبدیلات انرژی پتانسیل گرانشی و جنبشی، و سازوکار انتقال گرما (رسانش، همرفت، تابش).',
                labActionText: 'ورود به شبیه‌ساز پایستگی انرژی',
                labSimChapterId: books[0] ? books[0].id : 1
            },
            8: {
                themeClass: 'grade-theme-8',
                heroGradient: 'from-blue-600 via-cyan-700 to-slate-900 border-cyan-500/30',
                gradeBadge: 'پایه هشتم — پژوهشگر بارهای الکتریکی، مغناطیس و نور',
                badgeIcon: 'zap',
                accentColor: 'cyan',
                formula: '$$V = I \\cdot R \\quad , \\quad \\theta_i = \\theta_r \\quad , \\quad n = \\frac{c}{v}$$',
                labTitle: 'میز کار آزمایشگاه هشتم: مدار الکتریکی و شکست نور در عدسی‌ها',
                labDesc: 'کاوش قانون اهم، مقاومت معادل مدارهای متوالی و موازی، اثر متقابل قطب‌های مغناطیسی، تشکیل تصویر در آینه‌های کروی و پدیده شکست نور در منشور.',
                labActionText: 'ورود به شبیه‌ساز مدار و اپتیک',
                labSimChapterId: books[0] ? books[0].id : 2
            },
            9: {
                themeClass: 'grade-theme-9',
                heroGradient: 'from-purple-700 via-indigo-800 to-slate-900 border-purple-500/30',
                gradeBadge: 'پایه نهم — نخبه مکانیک کلاسیک، دینامیک نیوتون و فشار',
                badgeIcon: 'orbit',
                accentColor: 'purple',
                formula: '$$F_{net} = m \\cdot a \\quad , \\quad P = \\rho g h \\quad , \\quad v = \\frac{\\Delta x}{\\Delta t}$$',
                labTitle: 'رصدخانه تخصصی نهم: بردار نیرو، قوانین نیوتون و فشار شاره‌ها',
                labDesc: 'تحلیل برداری سینماتیک حرکت، قوانین اول تا سوم نیوتون و نیروی اصطکاک، فشار در عمق مایعات، قانون پاسکال و مزیت مکانیکی قرقره‌ها و اهرم‌ها.',
                labActionText: 'ورود به شبیه‌ساز حرکت و نیرو',
                labSimChapterId: books[0] ? books[0].id : 3
            }
        };

        const cfg = gradeConfigs[gradeNum] || gradeConfigs[7];

        container.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <!-- Dedicated Scientific Hero Header -->
            <div class="bg-gradient-to-r ${cfg.heroGradient} rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold mb-2">
                            <i data-lucide="${cfg.badgeIcon}" class="w-3.5 h-3.5 text-amber-300"></i>
                            <span>${cfg.gradeBadge}</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black">${s.full_name}</h1>
                        <span class="text-xs text-white/80 mt-1 inline-block">${s.grade_title_fa} • رتبه ${s.rank} انجمن فیزیک شهید بهشتی دو</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                            <span class="text-[11px] text-white/70 block">سطح علمی</span>
                            <span class="text-lg font-black font-sans">سطح ${s.current_level}</span>
                        </div>
                        <div class="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                            <span class="text-[11px] text-white/70 block">مجموع امتیاز</span>
                            <span class="text-lg font-black font-sans">${s.total_xp} XP</span>
                        </div>
                    </div>
                </div>

                <!-- Daily Streak Banner -->
                <div class="flex items-center justify-between p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 text-xs">
                    <div class="flex items-center gap-3">
                        <i data-lucide="flame" class="w-6 h-6 text-orange-400 streak-flame-active fill-orange-400 shrink-0"></i>
                        <div>
                            <span class="font-bold block text-sm">${s.current_streak} روز استمرار یادگیری در فیزیک!</span>
                            <span class="text-white/80 text-[11px]">با تمرین مستمر، نشان‌های افتخار و مدال‌های سمپاد را باز کنید.</span>
                        </div>
                    </div>
                    <button onclick="window.store.setView('curriculum')" class="btn-duo-green text-white font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap shadow-sm">
                        ادامه مطالعه سرفصل‌ها
                    </button>
                </div>
            </div>

            <!-- Grade Scientific Focus Spotlight & Formulas -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                            <i data-lucide="microscope" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-base text-slate-900 dark:text-white">${cfg.labTitle}</h3>
                            <span class="text-xs text-slate-400">سرفصل‌های تخصصی فیزیک دوره اول متوسطه</span>
                        </div>
                    </div>
                    <button onclick="window.store.setView('curriculum')" class="btn-duo-blue text-white font-bold text-xs px-4 py-2 rounded-xl whitespace-nowrap">
                        ${cfg.labActionText}
                    </button>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${cfg.labDesc}</p>
                <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-center font-mono text-sm text-cyan-300 katex-ltr-container overflow-x-auto">
                    ${cfg.formula}
                </div>
            </div>

            <!-- Nexora AI Physics Assistant Interactive Banner -->
            <div class="p-6 rounded-3xl bg-gradient-to-r from-violet-950/70 via-indigo-950/70 to-slate-900 border border-violet-500/40 cyber-glow-violet space-y-4">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/25 animate-pulse">
                            <i data-lucide="sparkles" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="font-extrabold text-white text-base">معلم همراه هوش مصنوعی نکسورا (Nexora AI)</h3>
                                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 font-mono">آنلاین • آماده پاسخگویی</span>
                            </div>
                            <p class="text-xs text-slate-300 mt-0.5">پاسخگویی مفهومی، اثبات فرمول‌ها و رفع اشکال گام‌به‌گام فیزیک ${s.grade_title_fa}</p>
                        </div>
                    </div>
                    <button onclick="window.toggleAiTutorModal()" class="btn-duo-green text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg whitespace-nowrap">
                        <i data-lucide="message-square" class="w-4 h-4"></i>
                        <span>گفتگو با معلم هوشمند</span>
                    </button>
                </div>
                <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                    <span class="text-[11px] text-slate-400 font-bold self-center">پرسش سریع:</span>
                    <button onclick="window.toggleAiTutorModal(); window.askQuickTutor('چگالی چطور محاسبه می‌شود و چرا بعضی اجسام روی آب شناور می‌مانند؟')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 text-[11px] transition-colors">
                        🔍 چگالی و شناوری در آب
                    </button>
                    <button onclick="window.toggleAiTutorModal(); window.askQuickTutor('قانون دوم نیوتون و رابطه نیرو، جرم و شتاب را با یک مثال توضیح بده')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-violet-300 border border-violet-800/40 text-[11px] transition-colors">
                        ⚡ قانون دوم نیوتون (F=ma)
                    </button>
                    <button onclick="window.toggleAiTutorModal(); window.askQuickTutor('کار و توان چیست و یکای آن‌ها در SI چیست؟')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-800/40 text-[11px] transition-colors">
                        ⚙️ کار، انرژی و توان
                    </button>
                </div>
            </div>

            <!-- Grade Dedicated Textbooks (Standard National & Sampad Supplementary) -->
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <i data-lucide="book-marked" class="w-5 h-5 text-blue-500"></i>
                        <span>منابع درسی رسمی شما (${s.grade_title_fa})</span>
                    </h3>
                    <span class="text-xs text-slate-400">دسترسی اختصاصی طبق پایه تحصیلی</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${books.map(b => `
                    <div onclick="window.store.setView('curriculum')" class="physics-card-3d bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-2xl flex items-center justify-center ${b.book_type === 'sampad' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'bg-blue-900/40 text-blue-400 border border-blue-500/30'}">
                                    <i data-lucide="book" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <h4 class="font-black text-base text-slate-800 dark:text-white">${b.title_fa}</h4>
                                    <span class="text-[11px] text-slate-400">${b.publisher_fa || 'آموزش و پرورش'} • سال ${b.academic_year || '۱۴۰۴-۱۴۰۵'}</span>
                                </div>
                            </div>
                            <span class="text-[11px] font-bold px-2.5 py-1 rounded-full ${b.book_type === 'sampad' ? 'bg-purple-950/70 text-purple-300 border border-purple-700/50' : 'bg-blue-950/70 text-blue-300 border border-blue-700/50'}">
                                ${b.book_type === 'sampad' ? 'تکمیلی سمپاد' : 'کتاب رسمی'}
                            </span>
                        </div>
                        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                            <span class="text-slate-400 flex items-center gap-1.5">
                                <i data-lucide="layers" class="w-4 h-4 text-emerald-400"></i>
                                <span>${b.chapter_count} فصل آموزشی</span>
                            </span>
                            <span class="text-blue-500 dark:text-blue-400 font-bold flex items-center gap-1">
                                <span>مشاهده فصل‌ها</span>
                                <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                            </span>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>

            <!-- Active Competition Widget -->
            ${data.active_competition ? `
            <div class="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                        <i data-lucide="trophy" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-amber-700 dark:text-amber-300 block">مسابقه فعال هفته</span>
                        <h3 class="font-bold text-base text-slate-800 dark:text-white">${data.active_competition.title_fa}</h3>
                    </div>
                </div>
                <button onclick="window.store.setView('competitions')" class="btn-duo-yellow text-slate-900 font-bold px-6 py-2.5 rounded-xl text-xs whitespace-nowrap shadow-sm">
                    ورود به مسابقه
                </button>
            </div>
            ` : ''}

            <!-- Recent Exams and Notifications Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Exam Attempts -->
                <div class="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
                            <i data-lucide="file-check" class="w-4 h-4 text-emerald-500"></i>
                            <span>نتایج آزمون‌های اخیر شما</span>
                        </h3>
                    </div>

                    <div class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${data.recent_exams.length === 0 ? '<p class="text-xs text-slate-400 py-4">هنوز در آزمونی شرکت نکرده‌اید.</p>' : data.recent_exams.map(e => `
                        <div class="py-3 flex items-center justify-between text-xs">
                            <div>
                                <span class="font-bold text-slate-800 dark:text-white block">${e.title_fa}</span>
                                <span class="text-[11px] text-slate-400">${window.formatPersianDate(e.date)}</span>
                            </div>
                            <div class="text-left font-sans">
                                <span class="font-bold ${e.is_passed ? 'text-emerald-500' : 'text-rose-500'} text-sm">${e.score} / ${e.total_points}</span>
                                <span class="text-[10px] text-slate-400 block">${e.percentage}٪</span>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Notifications -->
                <div class="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 class="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
                        <i data-lucide="bell" class="w-4 h-4 text-amber-400"></i>
                        <span>پیام‌ها و اعلان‌های آموزشی</span>
                    </h3>
                    <div class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${data.notifications.length === 0 ? '<p class="text-xs text-slate-400 py-4">پیام جدیدی وجود ندارد.</p>' : data.notifications.map(n => `
                        <div class="py-3 space-y-1 text-xs">
                            <span class="font-bold text-slate-800 dark:text-white block">${n.title_fa}</span>
                            <p class="text-slate-600 dark:text-slate-300 text-[11px]">${n.message_fa}</p>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500">${e.message}</div>`;
    }
}

// ==========================================
// VIEW: CURRICULUM BROWSER
// ==========================================
async function renderCurriculumView(container, gradeId = null) {
    container.innerHTML = `<div class="text-center py-12"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>`;
    try {
        const grades = await window.api.getGrades();
        const user = window.store.currentUser;

        // Strict Grade Scoping: If user is a student, lock strictly to their registered grade
        let activeGradeId;
        let isGradeLocked = false;
        if (user && user.role === 'student' && user.grade_id) {
            activeGradeId = user.grade_id;
            isGradeLocked = true;
        } else {
            activeGradeId = gradeId || (grades[0] ? grades[0].id : 1);
        }

        const books = await window.api.getBooks(activeGradeId);
        const currentGradeObj = grades.find(g => g.id == activeGradeId) || { title_fa: 'پایه تحصیلی' };

        const isPhysicsCh = (chNum) => {
            if (activeGradeId == 1) return [2, 8, 9, 10].includes(chNum);
            if (activeGradeId == 2) return [9, 10, 14, 15].includes(chNum);
            if (activeGradeId == 3) return [4, 5, 8, 9].includes(chNum);
            return false;
        };

        let booksHtml = '';
        for (let b of books) {
            let chapters = await window.api.getChapters(b.id);
            // Permanently display ONLY physics chapters across books
            const filtered = chapters.filter(ch => isPhysicsCh(ch.chapter_number));
            if (filtered.length > 0) chapters = filtered;
            chapters.sort((a, b) => a.chapter_number - b.chapter_number);

            booksHtml += `
            <div class="space-y-4">
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl flex items-center justify-center ${b.book_type === 'sampad' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30'}">
                            <i data-lucide="book" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-extrabold text-lg text-slate-800 dark:text-white">${b.title_fa}</h3>
                            <span class="text-xs text-slate-400">${b.publisher_fa || 'آموزش و پرورش'} • سال تحصیلی ${b.academic_year || '۱۴۰۴-۱۴۰۵'}</span>
                        </div>
                    </div>
                    <span class="text-xs px-3 py-1 rounded-full font-bold ${b.book_type === 'sampad' ? 'bg-purple-950/60 text-purple-300 border border-purple-700/50' : 'bg-blue-950/60 text-blue-300 border border-blue-700/50'}">
                        ${b.book_type === 'sampad' ? 'کتاب تکمیلی سمپاد (استعدادهای درخشان)' : 'کتاب رسمی آموزش و پرورش'}
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    ${chapters.map(ch => {
                        const isPhys = isPhysicsCh(ch.chapter_number);
                        return `
                        <div onclick="window.store.setView('chapter', { id: ${ch.id} })" 
                            class="physics-card-3d bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-cyan-500/40 dark:border-cyan-500/30 hover:border-cyan-400 cyber-glow-cyan shadow-sm cursor-pointer space-y-3.5 transition-all">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 font-mono">
                                        فصل ${ch.chapter_number}
                                    </span>
                                    <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                                        <i data-lucide="zap" class="w-3 h-3 text-cyan-400 fill-cyan-400"></i>
                                        فصل تخصصی فیزیک
                                    </span>
                                </div>
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                                    <i data-lucide="bookmark" class="w-3.5 h-3.5 text-cyan-400"></i>
                                    <span>${ch.source_pages || ''}</span>
                                </span>
                            </div>

                            <h4 class="font-black text-lg text-slate-800 dark:text-white leading-snug">${ch.title_fa}</h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${ch.description_fa || ''}</p>

                            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                <span class="text-slate-400 flex items-center gap-1.5">
                                    <i data-lucide="play-circle" class="w-4 h-4 text-emerald-500"></i>
                                    <span>${ch.lesson_count} درس تعاملی</span>
                                </span>
                                <span class="text-slate-400 flex items-center gap-1.5 font-sans">
                                    <i data-lucide="help-circle" class="w-4 h-4 text-indigo-400"></i>
                                    <span>${ch.mcq_count} تست • ${ch.written_count} تشریحی</span>
                                </span>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
            `;
        }

        container.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <!-- Header section based on grade locking -->
            ${isGradeLocked ? `
            <div class="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/50 border border-blue-500/30 backdrop-blur-md shadow-lg">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/30">
                            ${activeGradeId == 1 ? '۷' : (activeGradeId == 2 ? '۸' : '۹')}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                                    پایه تحصیلی اختصاصی شما
                                </span>
                                <span class="text-xs text-slate-400">• ۲ منبع آموزشی کامل (فصول تخصصی فیزیک)</span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-black text-white mt-1">
                                برنامه درسی فیزیک ${currentGradeObj.title_fa}
                            </h2>
                            <p class="text-xs text-slate-300 mt-0.5">مطابق سرفصل‌های کتاب رسمی آموزش و پرورش و کتاب علوم تکمیلی سمپاد</p>
                        </div>
                    </div>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold self-start sm:self-center">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                        <span>ثبت‌نام رسمی در این پایه</span>
                    </span>
                </div>
            </div>
            ` : `
            <!-- Grade Switcher Tabs (For Admin or Guest) -->
            <div class="flex flex-col items-center justify-center gap-4 text-center">
                <div class="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
                    ${grades.map(g => `
                    <button onclick="window.store.setView('curriculum', { id: ${g.id} })" class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${g.id == activeGradeId ? 'btn-duo-blue text-white shadow-md' : 'text-slate-300 hover:text-white'}">
                        ${g.title_fa}
                    </button>
                    `).join('')}
                </div>
                ${!user ? `
                <p class="text-xs text-slate-400">
                    دانش‌آموز عزیز؛ برای ذخیره پیشرفت درسی و شرکت در آزمون‌ها، لطفاً <button onclick="window.openAuthModal('login')" class="text-blue-400 font-bold hover:underline">وارد شوید</button> یا <button onclick="window.openAuthModal('register')" class="text-blue-400 font-bold hover:underline">ثبت‌نام کنید</button>.
                </p>
                ` : ''}
            </div>
            `}

            <!-- Books & Chapters -->
            <div class="space-y-12">
                ${booksHtml}
            </div>
        </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500">${e.message}</div>`;
    }
}

// ==========================================
// VIEW: CHAPTER DETAIL & LESSON LIST
// ==========================================
async function renderChapterDetailView(container, chapterId) {
    container.innerHTML = `<div class="text-center py-12"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>`;
    try {
        const ch = await window.api.getChapter(chapterId);

        container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <!-- Chapter Hero -->
            <div class="physics-card-3d bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div class="flex items-center justify-between text-xs text-slate-500">
                    <span class="font-bold text-blue-500">پایه ${ch.grade_number} • ${ch.book_title_fa}</span>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <i data-lucide="bookmark" class="w-3.5 h-3.5 text-blue-400"></i>
                        <span>${ch.source_pages || ''}</span>
                    </span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">فصل ${ch.chapter_number}: ${ch.title_fa}</h1>
                <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${ch.description_fa || ''}</p>

                ${ch.objectives_fa ? `
                <div class="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                    <span class="font-bold text-blue-800 dark:text-blue-300 block mb-1">اهداف یادگیری فصل:</span>
                    <div class="whitespace-pre-line leading-relaxed">${ch.objectives_fa}</div>
                </div>
                ` : ''}
            </div>

            <!-- Lessons Progression Path -->
            <div class="space-y-4">
                <h3 class="font-bold text-lg text-slate-800 dark:text-white">دروس تعاملی فصل (مسیر یادگیری):</h3>
                <div class="space-y-3">
                    ${ch.lessons.map(l => {
                        const simType = window.physicsSimulators ? window.physicsSimulators.getSimulatorForLesson(l) : null;
                        return `
                    <div class="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all">
                        <div class="flex items-center gap-4">
                            <div class="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${l.is_completed ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/40' : 'bg-blue-950/50 text-blue-400 border border-blue-500/40'}">
                                <i data-lucide="${l.is_completed ? 'check' : 'play'}" class="w-5 h-5"></i>
                            </div>
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <h4 class="font-bold text-sm text-slate-800 dark:text-white">${l.title_fa}</h4>
                                    ${simType ? `
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                                        <i data-lucide="atom" class="w-3 h-3 text-cyan-400"></i>
                                        <span>آزمایشگاه مجازی</span>
                                    </span>
                                    ` : ''}
                                </div>
                                <span class="text-xs text-slate-400 font-sans block">مدت: ${l.estimated_minutes} دقیقه • پاداش: +${l.xp_reward} XP</span>
                            </div>
                        </div>

                        <button onclick="window.store.setView('lesson', { id: ${l.id} })" class="${l.is_completed ? 'btn-duo-blue' : 'btn-duo-green'} text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm whitespace-nowrap">
                            ${l.is_completed ? 'مرور مجدد' : 'شروع درس'}
                        </button>
                    </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Chapter Examination Card -->
            ${ch.exam_id ? `
            <div class="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">ارزیابی پایان فصل</span>
                    <h3 class="font-bold text-lg text-slate-900 dark:text-white">${ch.exam_title_fa}</h3>
                    <p class="text-xs text-slate-500 mt-1">آزمون جامع شامل سؤالات تستی و تشریحی با تصحیح هوشمند هوش مصنوعی</p>
                </div>
                <button onclick="window.store.setView('exam', { id: ${ch.exam_id} })" class="btn-duo-green text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md whitespace-nowrap">
                    شرکت در آزمون فصل
                </button>
            </div>
            ` : ''}
        </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500">${e.message}</div>`;
    }
}

// ==========================================
// VIEW: INTERACTIVE LESSON RUNNER
// ==========================================
async function loadAndStartLesson(container, lessonId) {
    container.innerHTML = `<div class="text-center py-16"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>`;
    try {
        const lesson = await window.api.getLesson(lessonId);
        window.currentDuolingoPlayer = new window.DuolingoPlayer(lesson, 'app-main-content');
        window.currentDuolingoPlayer.render();
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500">${e.message}</div>`;
    }
}

// ==========================================
// VIEW: EXAMINATION RUNNER
// ==========================================
async function loadAndStartExam(container, examId) {
    if (!window.store.currentUser) {
        openAuthModal('login');
        return;
    }

    container.innerHTML = `<div class="text-center py-16"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>`;
    try {
        const examStartData = await window.api.startExam(examId);
        window.currentExamRunner = new window.ExamRunner(examStartData, 'app-main-content');
        window.currentExamRunner.render();
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500">${e.message}</div>`;
    }
}

// ==========================================
// AUTH MODAL, FORCED PASSWORD CHANGE & HELPERS
// ==========================================
function openAuthModal(mode = 'login') {
    const existing = document.getElementById('auth-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'auth-modal-backdrop';
    backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto';

    backdrop.innerHTML = `
    <div class="bg-slate-900 border border-blue-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white my-8 relative">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <i data-lucide="${mode === 'login' ? 'log-in' : 'user-plus'}" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-lg font-black text-white" id="auth-modal-title">
                        ${mode === 'login' ? 'ورود به سامانه انجمن فیزیک' : 'ثبت‌نام رسمی دانش‌آموز'}
                    </h3>
                    <span class="text-xs text-slate-400">انجمن فیزیک شهید بهشتی دو دوره اول</span>
                </div>
            </div>
            <button onclick="document.getElementById('auth-modal-backdrop').remove()" class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <div id="auth-error-banner" class="hidden p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
            <i data-lucide="alert-circle" class="w-4 h-4 text-rose-400 shrink-0"></i>
            <span id="auth-error-message"></span>
        </div>

        <form id="auth-form" onsubmit="handleAuthSubmit(event, '${mode}')" class="space-y-4 text-xs font-semibold">
            ${mode === 'register' ? `
            <div>
                <label class="block text-slate-300 mb-1.5">نام و نام خانوادگی:</label>
                <div class="relative">
                    <input type="text" id="auth-fullname" required placeholder="مثال: امیررضا علوی"
                        class="w-full p-3 pl-10 rounded-xl border border-slate-700 bg-slate-800/90 text-white outline-none focus:border-blue-500 transition-colors" />
                    <i data-lucide="user" class="w-4 h-4 absolute left-3 top-3.5 text-slate-400"></i>
                </div>
            </div>

            <div>
                <label class="block text-slate-300 mb-2">انتخاب پایه تحصیلی شما:</label>
                <input type="hidden" id="auth-grade" value="1" />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3" id="grade-selector-cards">
                    <div onclick="selectAuthGrade(1)" id="grade-card-1" class="cursor-pointer p-3 rounded-2xl border-2 border-amber-500 bg-amber-500/20 text-center transition-all opacity-100 shadow-md">
                        <span class="block font-black text-sm text-white">پایه هفتم</span>
                        <span class="text-[10px] text-amber-300 block mt-1">گرما، انرژی و اندازه‌گیری</span>
                    </div>
                    <div onclick="selectAuthGrade(2)" id="grade-card-2" class="cursor-pointer p-3 rounded-2xl border border-slate-700 bg-slate-800/60 text-center transition-all opacity-60 hover:opacity-100">
                        <span class="block font-black text-sm text-white">پایه هشتم</span>
                        <span class="text-[10px] text-blue-300 block mt-1">الکتریسیته، مغناطیس و نور</span>
                    </div>
                    <div onclick="selectAuthGrade(3)" id="grade-card-3" class="cursor-pointer p-3 rounded-2xl border border-slate-700 bg-slate-800/60 text-center transition-all opacity-60 hover:opacity-100">
                        <span class="block font-black text-sm text-white">پایه نهم</span>
                        <span class="text-[10px] text-purple-300 block mt-1">حرکت، نیرو و فشار</span>
                    </div>
                </div>
            </div>
            ` : ''}

            <div>
                <label class="block text-slate-300 mb-1.5">نام کاربری:</label>
                <div class="relative">
                    <input type="text" id="auth-username" required placeholder="نام کاربری (حداقل ۳ کاراکتر)"
                        class="w-full p-3 pl-10 rounded-xl border border-slate-700 bg-slate-800/90 text-white font-mono outline-none focus:border-blue-500 transition-colors" />
                    <i data-lucide="at-sign" class="w-4 h-4 absolute left-3 top-3.5 text-slate-400"></i>
                </div>
            </div>

            <div>
                <label class="block text-slate-300 mb-1.5">رمز عبور:</label>
                <div class="relative">
                    <input type="password" id="auth-password" required placeholder="••••••••"
                        ${mode === 'register' ? 'oninput="updatePasswordStrength(this.value, \'auth-reg-strength\')"' : ''}
                        class="w-full p-3 pl-10 rounded-xl border border-slate-700 bg-slate-800/90 text-white font-mono outline-none focus:border-blue-500 transition-colors" />
                    <button type="button" onclick="togglePasswordVisibility('auth-password', this)" class="absolute left-3 top-3 text-slate-400 hover:text-white transition-colors" title="نمایش/پنهان‌سازی رمز">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
                ${mode === 'register' ? '<div id="auth-reg-strength" class="mt-2"></div>' : ''}
            </div>

            <div class="pt-2">
                <button type="submit" id="auth-submit-btn" class="btn-duo-green w-full text-white font-black py-3 rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2">
                    <i data-lucide="${mode === 'login' ? 'arrow-left' : 'check'}" class="w-4 h-4"></i>
                    <span>${mode === 'login' ? 'ورود به حساب کاربری' : 'تکمیل ثبت‌نام و شروع یادگیری'}</span>
                </button>
            </div>
        </form>

        <!-- Quick Test Account Helpers for Easy Verification -->
        ${mode === 'login' ? `
        <div class="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 space-y-2">
            <span class="font-bold text-slate-300 block">حساب‌های کاربری پیش‌فرض سامانه:</span>
            <div class="flex flex-wrap gap-2">
                <button type="button" onclick="fillQuickAuth('admin', 'AdminPhysics1405!')" class="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 hover:bg-blue-900/60 transition-colors">
                    مدیر سیستم: admin / AdminPhysics1405!
                </button>
                <button type="button" onclick="fillQuickAuth('student_beheshti', 'Student1405!')" class="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 hover:bg-amber-900/60 transition-colors">
                    دانش‌آموز پایه ۷: student_beheshti
                </button>
                <button type="button" onclick="fillQuickAuth('AR_2012', 'Student1405!')" class="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:bg-purple-900/60 transition-colors">
                    دانش‌آموز پایه ۹: AR_2012
                </button>
            </div>
        </div>
        ` : ''}

        <div class="text-center pt-3 border-t border-slate-800 text-xs">
            ${mode === 'login' ? `
            <span class="text-slate-400">دانش‌آموز جدید هستید؟</span>
            <button onclick="openAuthModal('register')" class="text-blue-400 font-bold hover:underline mr-1">ثبت‌نام کنید</button>
            ` : `
            <span class="text-slate-400">قبلاً حساب کاربری ساخته‌اید؟</span>
            <button onclick="openAuthModal('login')" class="text-blue-400 font-bold hover:underline mr-1">وارد شوید</button>
            `}
        </div>
    </div>
    `;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();
}

function selectAuthGrade(gradeNum) {
    const input = document.getElementById('auth-grade');
    if (input) input.value = gradeNum;

    [1, 2, 3].forEach(g => {
        const card = document.getElementById(`grade-card-${g}`);
        if (!card) return;
        if (g === gradeNum) {
            const color = g === 1 ? 'amber' : (g === 2 ? 'blue' : 'purple');
            card.className = `cursor-pointer p-3 rounded-2xl border-2 border-${color}-500 bg-${color}-500/20 text-center transition-all opacity-100 shadow-md`;
        } else {
            card.className = 'cursor-pointer p-3 rounded-2xl border border-slate-700 bg-slate-800/60 text-center transition-all opacity-60 hover:opacity-100';
        }
    });
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPw = input.type === 'password';
    input.type = isPw ? 'text' : 'password';
    btn.innerHTML = `<i data-lucide="${isPw ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
    if (window.lucide) window.lucide.createIcons();
}

function updatePasswordStrength(val, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!val) {
        container.innerHTML = '';
        return;
    }
    let score = 0;
    if (val.length >= 8) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[a-zA-Z]/.test(val) && /[^a-zA-Z0-9]/.test(val)) score++;

    let levelClass = 'strength-weak';
    let label = 'ضعیف';
    let labelColor = 'text-rose-400';
    if (score === 2) {
        levelClass = 'strength-medium';
        label = 'متوسط';
        labelColor = 'text-amber-400';
    } else if (score >= 3) {
        levelClass = 'strength-strong';
        label = 'قوی و امن';
        labelColor = 'text-emerald-400';
    }

    container.innerHTML = `
    <div class="${levelClass}">
        <div class="flex items-center justify-between text-[11px] ${labelColor} font-bold mb-1">
            <span>قدرت رمز عبور: ${label}</span>
            <span>${val.length}/8 کاراکتر</span>
        </div>
        <div class="strength-track">
            <div class="strength-seg seg-1"></div>
            <div class="strength-seg seg-2"></div>
            <div class="strength-seg seg-3"></div>
        </div>
    </div>
    `;
}

function fillQuickAuth(u, p) {
    const uInput = document.getElementById('auth-username');
    const pInput = document.getElementById('auth-password');
    if (uInput) uInput.value = u;
    if (pInput) pInput.value = p;
}

// ==========================================
// FORCED PASSWORD CHANGE MODAL
// ==========================================
function openForcedPasswordModal() {
    const existing = document.getElementById('forced-pw-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'forced-pw-modal-backdrop';
    // Non-dismissible: no close button, no backdrop click dismissal
    backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md';

    backdrop.innerHTML = `
    <div class="bg-slate-900 border-2 border-amber-500/50 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white relative">
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <i data-lucide="shield-alert" class="w-6 h-6"></i>
            </div>
            <div>
                <h3 class="text-lg font-black text-white">تغییر اجباری رمز عبور پیش‌فرض</h3>
                <span class="text-xs text-amber-300">الزام امنیتی سامانه انجمن فیزیک</span>
            </div>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
            حساب کاربری مدیر با رمز عبور پیش‌فرض فعال شده است. جهت حفاظت از اطلاعات و فعال‌سازی دسترسی به پنل مدیریت، تعیین یک رمز عبور جدید امن (حداقل ۸ کاراکتر) الزامی می‌باشد.
        </p>

        <form id="forced-pw-form" onsubmit="handleForcedPasswordSubmit(event)" class="space-y-4 text-xs font-semibold">
            <div id="forced-pw-error" class="hidden p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 animate-shake"></div>

            <div>
                <label class="block text-slate-300 mb-1">رمز عبور فعلی (پیش‌فرض: admin):</label>
                <div class="relative">
                    <input type="password" id="forced-curr-pw" required placeholder="رمز عبور فعلی"
                        class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono outline-none focus:border-amber-400" />
                    <button type="button" onclick="togglePasswordVisibility('forced-curr-pw', this)" class="absolute left-3 top-3 text-slate-400 hover:text-white">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div>
                <label class="block text-slate-300 mb-1">رمز عبور جدید (حداقل ۸ کاراکتر):</label>
                <div class="relative">
                    <input type="password" id="forced-new-pw" required minlength="8" placeholder="رمز عبور جدید و امن"
                        oninput="updatePasswordStrength(this.value, 'forced-strength-container')"
                        class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono outline-none focus:border-amber-400" />
                    <button type="button" onclick="togglePasswordVisibility('forced-new-pw', this)" class="absolute left-3 top-3 text-slate-400 hover:text-white">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
                <div id="forced-strength-container" class="mt-2"></div>
            </div>

            <div>
                <label class="block text-slate-300 mb-1">تکرار رمز عبور جدید:</label>
                <div class="relative">
                    <input type="password" id="forced-confirm-pw" required minlength="8" placeholder="تکرار رمز عبور جدید"
                        class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white font-mono outline-none focus:border-amber-400" />
                    <button type="button" onclick="togglePasswordVisibility('forced-confirm-pw', this)" class="absolute left-3 top-3 text-slate-400 hover:text-white">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div class="pt-2">
                <button type="submit" id="forced-submit-btn" class="btn-duo-green w-full text-white font-black py-3 rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2">
                    <i data-lucide="key" class="w-4 h-4"></i>
                    <span>ثبت رمز جدید و ورود به پنل</span>
                </button>
            </div>
        </form>
    </div>
    `;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();
}

async function handleForcedPasswordSubmit(e) {
    e.preventDefault();
    const currPass = document.getElementById('forced-curr-pw').value;
    const newPass = document.getElementById('forced-new-pw').value;
    const confirmPass = document.getElementById('forced-confirm-pw').value;
    const errBox = document.getElementById('forced-pw-error');
    const submitBtn = document.getElementById('forced-submit-btn');

    if (newPass !== confirmPass) {
        errBox.textContent = 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد.';
        errBox.classList.remove('hidden');
        return;
    }
    if (newPass.length < 8) {
        errBox.textContent = 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.';
        errBox.classList.remove('hidden');
        return;
    }
    if (newPass === currPass) {
        errBox.textContent = 'رمز عبور جدید نمی‌تواند با رمز عبور فعلی یکسان باشد.';
        errBox.classList.remove('hidden');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> در حال ذخیره...`;

    try {
        const res = await window.api.changePassword(currPass, newPass, confirmPass);
        window.api.setToken(res.access_token);
        window.store.setUser(res.user);

        const modal = document.getElementById('forced-pw-modal-backdrop');
        if (modal) modal.remove();

        if (res.user.role === 'admin') {
            window.store.setView('admin');
        } else {
            window.store.setView('dashboard');
        }
    } catch (err) {
        errBox.textContent = err.message || 'خطا در ثبت رمز عبور جدید.';
        errBox.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="key" class="w-4 h-4"></i><span>ثبت رمز جدید و ورود به پنل</span>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

async function handleAuthSubmit(e, mode) {
    e.preventDefault();
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;
    const errBox = document.getElementById('auth-error-banner');
    const errMsg = document.getElementById('auth-error-message');
    const submitBtn = document.getElementById('auth-submit-btn');

    errBox.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> در حال بررسی...`;

    try {
        let res;
        if (mode === 'login') {
            res = await window.api.login(username, password);
        } else {
            const fullName = document.getElementById('auth-fullname').value.trim();
            const gradeId = parseInt(document.getElementById('auth-grade').value) || 1;
            res = await window.api.register({
                username: username,
                password: password,
                full_name: fullName,
                grade_id: gradeId
            });
        }

        window.api.setToken(res.access_token);
        window.store.setUser(res.user);

        const modal = document.getElementById('auth-modal-backdrop');
        if (modal) modal.remove();

        if (res.user.must_change_password) {
            openForcedPasswordModal();
            return;
        }

        if (res.user.role === 'admin') {
            window.store.setView('admin');
        } else {
            window.store.setView('dashboard');
        }
    } catch (err) {
        errMsg.textContent = err.message || 'خطا در احراز هویت. لطفاً اطلاعات را بررسی کنید.';
        errBox.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="${mode === 'login' ? 'arrow-left' : 'check'}" class="w-4 h-4"></i><span>${mode === 'login' ? 'ورود به حساب کاربری' : 'تکمیل ثبت‌نام و شروع یادگیری'}</span>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

function logout() {
    window.api.setToken(null);
    window.store.setUser(null);
    window.store.setView('landing');
}

window.openAuthModal = openAuthModal;
window.handleAuthSubmit = handleAuthSubmit;
window.openForcedPasswordModal = openForcedPasswordModal;
window.handleForcedPasswordSubmit = handleForcedPasswordSubmit;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updatePasswordStrength = updatePasswordStrength;
window.selectAuthGrade = selectAuthGrade;
window.fillQuickAuth = fillQuickAuth;
window.logout = logout;

// Nexora Markdown & Scientific Text Display Engine
function renderNexoraMarkdown(text) {
    if (!text) return '';
    let s = String(text);
    // 1. Strip think / reasoning blocks
    s = s.replace(/<think>[\s\S]*?(<\/think>|$)/gi, "")
         .replace(/<thinking>[\s\S]*?(<\/thinking>|$)/gi, "")
         .replace(/<reasoning>[\s\S]*?(<\/reasoning>|$)/gi, "")
         .replace(/<thought>[\s\S]*?(<\/thought>|$)/gi, "")
         .replace(/<s>[\s\S]*?(<\/s>|$)/gi, "");
    s = s.replace(/^Here'?s a thinking process:[\s\S]*?\n\n/gi, "");
    s = s.replace(/^Okay, the user (asks|wants|is asking)[\s\S]*?\n\n/gi, "");

    // 2. Code blocks with copy button
    s = s.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (m, lang, code) => {
        return `<div class="my-3 rounded-2xl bg-black/60 border border-slate-700/80 overflow-hidden dir-ltr text-left" dir="ltr">
            <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/80 text-[11px] font-mono text-slate-400 border-b border-slate-700">
                <span>${lang || 'code'}</span>
                <button type="button" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText); this.innerText='کپی شد!'" class="text-cyan-400 hover:text-cyan-300 font-sans">کپی</button>
            </div>
            <pre class="p-3 text-[12px] font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>`;
    });

    // 3. Inline code
    s = s.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/50 text-cyan-300 font-mono text-[11px] dir-ltr inline-block" dir="ltr">$1</code>');

    // 4. Headings
    s = s.replace(/^### (.*$)/gim, '<h4 class="text-sm font-extrabold text-cyan-400 mt-2 mb-1">$1</h4>');
    s = s.replace(/^## (.*$)/gim, '<h3 class="text-base font-black text-violet-300 mt-3 mb-1.5">$1</h3>');
    s = s.replace(/^# (.*$)/gim, '<h2 class="text-lg font-black text-white mt-3.5 mb-2">$1</h2>');

    // 5. Bold & Italic
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-cyan-200">$1</strong>');
    s = s.replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>');

    // 6. Bullet lists
    s = s.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="mr-4 list-disc text-slate-200 my-0.5">$1</li>');

    // 7. Line breaks
    s = s.replace(/\n\n+/g, '<br/><br/>');
    s = s.replace(/\n/g, '<br/>');

    return s;
}

// ==========================================
// AI COPILOT & PAGE CONTEXT CONTROLLER
// ==========================================

function getCurrentPageContext() {
    const view = window.store?.currentView || { name: 'dashboard' };
    let summary = `نمای ${view.name}`;
    let chapterId = null;
    let lessonId = null;
    let questionId = null;
    let snippet = '';

    if (view.name === 'lesson') {
        const titleEl = document.querySelector('h1, h2');
        const lessonTitle = titleEl ? titleEl.innerText.trim() : 'درسنامه فیزیک';
        summary = `درس: ${lessonTitle}`;
        lessonId = view.params?.id || null;
        const mainContent = document.getElementById('app-main-content');
        if (mainContent) {
            snippet = mainContent.innerText.slice(0, 1200).replace(/\s+/g, ' ');
        }
    } else if (view.name === 'chapter') {
        const titleEl = document.querySelector('h1');
        const chTitle = titleEl ? titleEl.innerText.trim() : 'فصل فیزیک';
        summary = `فصل: ${chTitle}`;
        chapterId = view.params?.id || null;
    } else if (view.name === 'exam') {
        summary = 'آزمون پایان فصل فیزیک';
        const qPrompt = document.querySelector('.exam-question-prompt, h2');
        if (qPrompt) snippet = qPrompt.innerText.slice(0, 400);
    } else if (document.getElementById('comp-active-modal')) {
        summary = 'میدان رقابت و لیگ کوانتومی';
        const modal = document.getElementById('comp-active-modal');
        if (modal) snippet = modal.innerText.slice(0, 400);
    } else if (view.name === 'curriculum') {
        summary = 'سرفصل‌های فیزیک پایه';
    } else if (view.name === 'competitions') {
        summary = 'تالار مسابقات و لیگ‌های کوانتومی';
    } else if (view.name === 'admin') {
        summary = 'پنل مدیریت آموزشی';
    } else if (view.name === 'dashboard') {
        summary = 'داشبورد دانش‌آموز';
    }

    return { view_name: view.name, summary, chapterId, lessonId, questionId, snippet };
}

function updateAiTutorContextBadge() {
    const badge = document.getElementById('ai-current-page-text');
    if (!badge) return;
    const ctx = getCurrentPageContext();
    badge.textContent = `📍 ${ctx.summary}`;
}

function askAboutCurrentPage() {
    const ctx = getCurrentPageContext();
    const input = document.getElementById('ai-tutor-input');
    if (!input) return;
    
    toggleAiTutorModal(true);
    
    if (ctx.view_name === 'lesson') {
        input.value = `نکات مهم و فرمول‌های کلیدی مبحث «${ctx.summary}» را به صورت گام‌به‌گام و مفهومی توضیح بده.`;
    } else if (ctx.view_name === 'chapter') {
        input.value = `خلاصه‌ای از مهم‌ترین مفاهیم و اهداف آموزشی ${ctx.summary} را بیان کن.`;
    } else if (ctx.view_name === 'competitions' || document.getElementById('comp-active-modal')) {
        input.value = `برای پاسخ‌دهی دقیق و سریع به پرسش‌های این بخش چه نکات و روش حل سریعی پیشنهاد می‌کنی؟`;
    } else {
        input.value = `در این بخش از سامانه (${ctx.summary})، به عنوان همراه من چه راهنمایی یا سرفصل فیزیکی رو پیشنهاد می‌کنی؟`;
    }
    input.focus();
}

let isCopilotMinimized = false;
function minimizeAiCopilot() {
    const modal = document.getElementById('ai-tutor-modal');
    const chatBody = document.getElementById('ai-tutor-chat-body');
    const contextBar = document.getElementById('ai-copilot-context-bar');
    const form = document.getElementById('ai-tutor-form');
    if (!modal) return;

    isCopilotMinimized = !isCopilotMinimized;
    if (isCopilotMinimized) {
        modal.style.height = '58px';
        if (chatBody) chatBody.classList.add('hidden');
        if (contextBar) contextBar.classList.add('hidden');
        if (form) form.classList.add('hidden');
    } else {
        modal.style.height = '';
        if (chatBody) chatBody.classList.remove('hidden');
        if (contextBar) contextBar.classList.remove('hidden');
        if (form) form.classList.remove('hidden');
    }
}

function toggleAiTutorModal(forceState) {
    const modal = document.getElementById('ai-tutor-modal');
    const floatingBtn = document.getElementById('ai-tutor-floating-container');
    if (!modal) return;

    const isHidden = modal.classList.contains('hidden');
    const shouldOpen = (typeof forceState === 'boolean') ? forceState : isHidden;

    if (shouldOpen) {
        modal.classList.remove('hidden');
        if (floatingBtn) floatingBtn.classList.add('hidden');
        if (isCopilotMinimized) minimizeAiCopilot();
        updateAiTutorContextBadge();

        const user = window.store?.currentUser;
        const gradeLabel = document.getElementById('ai-tutor-grade-label');
        if (gradeLabel && user?.grade_id) {
            const gNum = user.grade_id === 1 ? 'هفتم' : user.grade_id === 2 ? 'هشتم' : 'نهم';
            gradeLabel.textContent = `همراه فیزیک پایه ${gNum} • مطلع از صفحه جاری`;
        }
        document.getElementById('ai-tutor-input')?.focus();
    } else {
        modal.classList.add('hidden');
        if (floatingBtn) floatingBtn.classList.remove('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
}

window.addEventListener('view-changed', () => {
    updateAiTutorContextBadge();
});

function askQuickTutor(query) {
    toggleAiTutorModal(true);
    const input = document.getElementById('ai-tutor-input');
    if (input) {
        input.value = query;
        handleAiTutorSubmit(new Event('submit'));
    }
}

async function handleAiTutorSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('ai-tutor-input');
    const chatBody = document.getElementById('ai-tutor-chat-body');
    const submitBtn = document.getElementById('ai-tutor-submit-btn');
    const modelSelector = document.getElementById('ai-model-selector');
    if (!input || !chatBody) return;

    const query = input.value.trim();
    if (!query) return;

    const chosenModel = modelSelector ? modelSelector.value : 'auto';

    // Append user question
    const userMsg = document.createElement('div');
    userMsg.className = 'p-3 rounded-2xl bg-gradient-to-r from-violet-950/80 to-indigo-950/80 border border-violet-500/40 text-cyan-200 text-xs self-end mr-auto max-w-[85%] shadow-md';
    userMsg.textContent = query;
    chatBody.appendChild(userMsg);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'p-3 rounded-2xl bg-slate-800/80 border border-cyan-500/30 text-slate-300 text-xs flex items-center gap-2 max-w-[85%] cyber-glow-cyan';
    loadingMsg.innerHTML = `<span class="animate-spin inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></span> <span>موتور هوش مصنوعی نکسورا در حال پردازش علمی...</span>`;
    chatBody.appendChild(loadingMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (submitBtn) submitBtn.disabled = true;

    try {
        const pageCtx = getCurrentPageContext();
        let fullContext = pageCtx.summary;
        if (pageCtx.snippet) {
            fullContext += `\nمتن صفحه:\n${pageCtx.snippet}`;
        }

        const gradeId = window.store?.currentUser?.grade_id || 1;
        const res = await window.api.askAiTutor({
            grade_id: gradeId,
            chapter_id: pageCtx.chapterId,
            lesson_id: pageCtx.lessonId,
            question_id: pageCtx.questionId,
            student_query: query,
            page_context: fullContext,
            preferred_model: chosenModel !== 'auto' ? chosenModel : null
        });

        loadingMsg.remove();

        const tutorMsg = document.createElement('div');
        tutorMsg.className = 'p-4 rounded-2xl bg-slate-900/95 border border-violet-500/40 text-slate-100 text-xs space-y-2.5 cyber-glow-violet max-w-[95%] shadow-xl';
        
        const renderedText = renderNexoraMarkdown(res.response_fa);
        const usedModelLabel = res.model_used ? `<span class="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">${res.model_used.replace(':free', '')}</span>` : '';

        tutorMsg.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <div class="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <i data-lucide="sparkles" class="w-4 h-4 text-cyan-400"></i>
                    <span>پاسخ معلم هوشمند:</span>
                </div>
                ${usedModelLabel}
            </div>
            <div class="leading-relaxed text-slate-200 text-xs space-y-2">
                ${renderedText}
            </div>
            ${res.related_formulas && res.related_formulas.length ? `
            <div class="p-2.5 rounded-xl bg-black/50 border border-cyan-900/60">
                <span class="text-[10px] font-bold text-cyan-400 block mb-1">فرمول‌های مرتبط:</span>
                <div class="flex flex-wrap gap-2 font-mono text-cyan-300 dir-ltr katex-ltr-isolated text-xs" dir="ltr">
                    ${res.related_formulas.join(' &nbsp;|&nbsp; ')}
                </div>
            </div>` : ''}
            ${res.key_hints && res.key_hints.length ? `
            <div class="p-2.5 rounded-xl bg-amber-950/25 border border-amber-800/40">
                <span class="text-[10px] font-bold text-amber-400 block mb-1">سرنخ‌های کلیدی:</span>
                <ul class="list-disc list-inside space-y-1 text-amber-200/90 text-[10px]">
                    ${res.key_hints.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>` : ''}
            ${res.suggested_followups && res.suggested_followups.length ? `
            <div class="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                <span class="font-bold text-slate-300 block mb-1">پرسش برای تفکر بیشتر:</span>
                ${res.suggested_followups.map(f => `<p class="text-violet-300/90">💭 ${f}</p>`).join('')}
            </div>` : ''}
            <div class="flex justify-end pt-1">
                <button type="button" onclick="navigator.clipboard.writeText(this.closest('.p-4').querySelector('.leading-relaxed').innerText); this.innerHTML='<i data-lucide=\\'check\\' class=\\'w-3 h-3\\'></i> کپی شد'" class="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                    <i data-lucide="copy" class="w-3 h-3"></i>
                    <span>کپی پاسخ</span>
                </button>
            </div>
        `;
        chatBody.appendChild(tutorMsg);
        window.store?.playSound('correct');
        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) setTimeout(window.renderMathInPage, 40);
    } catch (err) {
        loadingMsg.remove();
        const errMsg = document.createElement('div');
        errMsg.className = 'p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs';
        errMsg.textContent = `خطا در دریافت پاسخ: ${err.message}`;
        chatBody.appendChild(errMsg);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

async function renderSimulatorsCatalogView(container, activeSim = 'density') {
    const validSims = ['density', 'circuit', 'newton', 'pressure', 'optics'];
    if (!validSims.includes(activeSim)) activeSim = 'density';

    const simTabs = [
        { id: 'density', title: 'چگالی و ارشمیدس', grade: 'پایه هفتم', icon: 'droplets', desc: 'بررسی جرم، حجم و نیروی شناوری ارشمیدس در آب' },
        { id: 'circuit', title: 'مدار و قانون اهم', grade: 'پایه هشتم', icon: 'zap', desc: 'محاسبه رابطه ولتاژ، مقاومت و شدت جریان الکتریکی' },
        { id: 'pressure', title: 'فشار شاره‌ها و عمق', grade: 'پایه نهم', icon: 'gauge', desc: 'تغییرات فشار با عمق مایع، چگالی و شتاب گرانش' },
        { id: 'newton', title: 'قانون دوم نیوتون', grade: 'پایه نهم', icon: 'activity', desc: 'بررسی شتاب، نیروی پیشران، جرم و اصطکاک سطح' },
        { id: 'optics', title: 'شکست نور و اسنل', grade: 'پایه هشتم', icon: 'eye', desc: 'محاسبه زاویه تابش، شکست و ضریب شکست در محیط‌های مختلف' },
    ];

    container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xs font-bold cyber-glow-cyan">
                <i data-lucide="flask-conical" class="w-4 h-4 text-teal-400"></i>
                <span>آزمایشگاه مجازی فیزیک شهید بهشتی دو</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">شبیه‌سازهای تعاملی و آزمایشگاه فیزیک</h1>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                پارامترهای فیزیکی را تغییر دهید، نمودارهای زنده را بررسی کنید و قوانین بنیادین علوم را به صورت تجربی لمس نمایید.
            </p>
        </div>

        <!-- Simulator Selector Tabs -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            ${simTabs.map(s => `
                <button onclick="window.renderSimulatorsCatalogView(document.getElementById('app-main-content'), '${s.id}')"
                    class="p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${s.id === activeSim 
                        ? 'bg-teal-500/10 border-teal-500 text-teal-400 font-bold shadow-md shadow-teal-500/10' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-teal-500/50'}">
                    <div class="flex items-center justify-between mb-1">
                        <i data-lucide="${s.icon}" class="w-4 h-4 text-teal-400"></i>
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">${s.grade}</span>
                    </div>
                    <span class="text-xs font-bold block truncate">${s.title}</span>
                </button>
            `).join('')}
        </div>

        <!-- Mount Point for the Simulator -->
        <div id="catalog-sim-mount-point" class="w-full"></div>
    </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    if (window.physicsSimulators) {
        window.physicsSimulators.mount(activeSim, 'catalog-sim-mount-point');
    }
}

window.renderSimulatorsCatalogView = renderSimulatorsCatalogView;
window.renderNexoraMarkdown = renderNexoraMarkdown;
window.toggleAiTutorModal = toggleAiTutorModal;
window.minimizeAiCopilot = minimizeAiCopilot;
window.askAboutCurrentPage = askAboutCurrentPage;
window.getCurrentPageContext = getCurrentPageContext;
window.updateAiTutorContextBadge = updateAiTutorContextBadge;
window.askQuickTutor = askQuickTutor;
window.handleAiTutorSubmit = handleAiTutorSubmit;
