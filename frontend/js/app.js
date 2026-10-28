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
        const activeView = window.store.currentView;
        if (['dashboard', 'leaderboards', 'badges', 'landing'].includes(activeView)) {
            renderCurrentView();
        }
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
    } else if (view === 'materials') {
        await renderStudyMaterialsView(mainContainer, params.id);
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
    } else if (view === 'live-lab') {
        if (window.liveLab) {
            await window.liveLab.render(mainContainer, params.id || null);
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
    if (window.renderMathInPage) window.renderMathInPage(mainContainer);
}

// ==========================================
// VIEW: LANDING PAGE
// ==========================================
// ==========================================
// VIEW: ACADEMIC ENTERPRISE LANDING PAGE (MIT Physics & CERN Inspired)
// ==========================================
async function renderLandingView(container) {
    let stats = { students_count: 0, questions_count: 360, exams_count: 12, competitions_count: 1 };
    try {
        stats = await window.api.getPublicStats();
    } catch (e) {}

    container.innerHTML = `
    <!-- Institutional Accreditation Top Bar -->
    <div class="border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur py-2.5 px-4 sm:px-8">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="font-bold text-slate-800 dark:text-slate-200">دبیرستان استعدادهای درخشان شهید بهشتی دو • دوره اول</span>
                <span class="hidden sm:inline text-slate-400 dark:text-slate-600">|</span>
                <span class="hidden sm:inline text-[11px] text-sky-600 dark:text-sky-400 font-mono tracking-wide">SAMPAD DEPARTMENT OF EXPERIMENTAL PHYSICS</span>
            </div>
            <div class="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span>سامانه مصوب آموزشی سمپاد</span>
                <span>•</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">ورژن سراسری ۲.۱</span>
            </div>
        </div>
    </div>

    <!-- Main Academic Hero Section -->
    <section class="relative overflow-hidden py-12 sm:py-20 academic-hero-glow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                
                <!-- Left/Text Column (RTL) -->
                <div class="lg:col-span-7 space-y-6 text-right">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-sm">
                        <i data-lucide="atom" class="w-4 h-4 text-blue-500"></i>
                        <span>پرتال تخصصی آموزش، آزمایشگاه‌های تعاملی و سنجش فیزیک</span>
                    </div>

                    <h1 class="text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 dark:text-white leading-[1.25] tracking-tight">
                        یادگیری مفهومی فیزیک، <br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 dark:from-blue-400 dark:via-sky-300 dark:to-teal-300">
                            آزمایشگاه‌های استاندارد PhET و سنجش تشریحی
                        </span>
                    </h1>

                    <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                        سامانه جامع آموزش علوم تجربی و فیزیک دوره‌ اول متوسطه و مدارس استعدادهای درخشان (سمپاد) — پایه‌های هفتم، هشتم و نهم. منطبق با کتاب‌های درسی رسمی وزارت آموزش و پرورش و کتب تکمیلی فیزیک سمپاد، همراه با ۲۷ آزمایشگاه رسمی دانشگاه کلرادو، لیگ‌های علمی هفتگی و آزمون‌ساز هوشمند.
                    </p>

                    <!-- Academic Primary Action Buttons -->
                    <div class="flex flex-wrap items-center gap-3 pt-2">
                        <button onclick="window.store.setView('curriculum')" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]">
                            <i data-lucide="book-open" class="w-4 h-4"></i>
                            <span>سرفصل‌ها و نقشه یادگیری</span>
                        </button>
                        
                        <button onclick="window.store.setView('simulators')" class="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-teal-300 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition-all">
                            <i data-lucide="flask-conical" class="w-4 h-4 text-teal-500"></i>
                            <span>آزمایشگاه‌های ۲۷گانه PhET</span>
                        </button>

                        <button onclick="window.store.setView('live-lab')" class="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]">
                            <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                            <i data-lucide="radio" class="w-4 h-4"></i>
                            <span>پخش زنده کلاس دبیر</span>
                        </button>

                        <a href="/downloads/physics-society.apk" download="PhysicsSociety-SAMPAD.apk" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                           title="دانلود مستقیم اپلیکیشن اندروید (APK)">
                            <i data-lucide="smartphone" class="w-4 h-4"></i>
                            <span>دانلود اپلیکیشن اندروید (APK)</span>
                        </a>

                        <button onclick="window.store.setView('competitions')" class="px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm border border-amber-300 dark:border-amber-800/80 flex items-center gap-2 transition-all">
                            <i data-lucide="trophy" class="w-4 h-4 text-amber-500"></i>
                            <span>لیگ المپیاد</span>
                        </button>
                    </div>

                    <!-- Academic Telemetry Badges Strip -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                            <span class="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 font-mono block">۲۷</span>
                            <span class="text-[11px] text-slate-500 dark:text-slate-400">آزمایشگاه تعاملی بومی</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                            <span class="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">۵۰۰+</span>
                            <span class="text-[11px] text-slate-500 dark:text-slate-400">مسئله تشریحی و تستی</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                            <span class="text-lg sm:text-xl font-black text-teal-600 dark:text-teal-400 font-mono block">۳ پایه</span>
                            <span class="text-[11px] text-slate-500 dark:text-slate-400">هفتم، هشتم، نهم سمپاد</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                            <span class="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono block">۱۰۰٪</span>
                            <span class="text-[11px] text-slate-500 dark:text-slate-400">انطباق با کتب درسی</span>
                        </div>
                    </div>
                </div>

                <!-- Right/Academic Terminal Showcase Column -->
                <div class="lg:col-span-5">
                    <div class="academic-panel rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
                        <!-- Terminal Header -->
                        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
                                <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
                                <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                                <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-2">PHYSICS APPARATUS MONITOR</span>
                            </div>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 font-mono">
                                LIVE ONLINE
                            </span>
                        </div>

                        <!-- Scientific Formulas Matrix -->
                        <div class="space-y-2.5">
                            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-center">
                                <span class="text-[10px] text-slate-400 block mb-1 font-mono">KINEMATICS & DYNAMICS (معادلات حرکت سمپاد)</span>
                                <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-sky-300 academic-mono katex-ltr-container" dir="ltr">
                                    $$x(t) = \\frac{1}{2}at^2 + v_0t + x_0 \\quad \\Longleftrightarrow \\quad \\vec{F} = m\\vec{a}$$
                                </div>
                            </div>
                            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-center">
                                <span class="text-[10px] text-slate-400 block mb-1 font-mono">ENERGY & PRESSURE (پایستگی انرژی و فشار)</span>
                                <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-teal-300 academic-mono katex-ltr-container" dir="ltr">
                                    $$K = \\frac{1}{2}mv^2 + mgh \\quad , \\quad P = \\rho gh + P_0$$
                                </div>
                            </div>
                        </div>

                        <!-- Direct Launch Links to Core Labs -->
                        <div class="pt-2 space-y-2">
                            <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">دسترسی سریع به آزمایشگاه‌های شاخص:</span>
                            <div class="grid grid-cols-2 gap-2 text-xs font-bold">
                                <button onclick="window.store.setView('simulators', { id: 'motion-1d' })" class="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-slate-800/80 dark:hover:bg-slate-750 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300 text-right flex items-center justify-between group transition-all">
                                    <span class="truncate">حرکت خط راست (سینماتیک)</span>
                                    <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i>
                                </button>
                                <button onclick="window.store.setView('simulators', { id: 'energy-skate-park' })" class="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-slate-800/80 dark:hover:bg-slate-750 border border-teal-200 dark:border-slate-700 text-teal-700 dark:text-teal-300 text-right flex items-center justify-between group transition-all">
                                    <span class="truncate">پایستگی انرژی (اسکیت)</span>
                                    <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i>
                                </button>
                                <button onclick="window.store.setView('simulators', { id: 'circuit-dc' })" class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800/80 dark:hover:bg-slate-750 border border-amber-200 dark:border-slate-700 text-amber-700 dark:text-amber-300 text-right flex items-center justify-between group transition-all">
                                    <span class="truncate">مدار الکتریکی DC</span>
                                    <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i>
                                </button>
                                <button onclick="window.store.setView('simulators', { id: 'density' })" class="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800/80 dark:hover:bg-slate-750 border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-right flex items-center justify-between group transition-all">
                                    <span class="truncate">چگالی و غوطه‌وری</span>
                                    <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- 3 Academic Grade Departments Grid -->
    <section class="py-14 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div class="text-center space-y-2 max-w-2xl mx-auto">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                    <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-blue-500"></i>
                    <span>دپارتمان‌های آموزشی دوره اول متوسطه</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">سرفصل‌های تحصیلی و آزمایشگاه‌های تخصصی</h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">کتاب‌های درسی وزارتی علوم تجربی به همراه کتاب‌های تکمیلی سمپاد (سازمان ملی پرورش استعدادهای درخشان)</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Grade 7 Card -->
                <div onclick="window.store.currentUser && window.store.currentUser.role === 'student' ? window.store.setView('curriculum', { id: window.store.currentUser.grade_id }) : window.store.setView('curriculum', { id: 1 })" 
                     class="academic-card p-6 cursor-pointer space-y-5 relative overflow-hidden group">
                    <div class="flex items-center justify-between">
                        <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                            ۷
                        </div>
                        <span class="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 font-mono">
                            GRADE 07
                        </span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            پایه هفتم • فیزیک و اندازه‌گیری
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            فصل ۲: اندازه‌گیری و چگالی • فصل ۳ و ۱۰: جنبش ذرات، دما و گرما • فصل ۸: کار، انرژی و پایستگی مکانیکی
                        </p>
                    </div>
                    <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span>ورود به سرفصل‌ها و درسنامه‌ها</span>
                        <i data-lucide="chevron-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                    </div>
                </div>

                <!-- Grade 8 Card -->
                <div onclick="window.store.currentUser && window.store.currentUser.role === 'student' ? window.store.setView('curriculum', { id: window.store.currentUser.grade_id }) : window.store.setView('curriculum', { id: 2 })" 
                     class="academic-card p-6 cursor-pointer space-y-5 relative overflow-hidden group">
                    <div class="flex items-center justify-between">
                        <div class="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                            ۸
                        </div>
                        <span class="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 font-mono">
                            GRADE 08
                        </span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            پایه هشتم • الکتریسیته، مغناطیس و نور
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            فصل ۹: بار الکتریکی، قانون کولن و اهم • فصل ۱۰: مغناطیس و القا • فصل ۱۴ و ۱۵: بازتاب، شکست نور و عدسی‌ها
                        </p>
                    </div>
                    <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                        <span>ورود به سرفصل‌ها و درسنامه‌ها</span>
                        <i data-lucide="chevron-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                    </div>
                </div>

                <!-- Grade 9 Card -->
                <div onclick="window.store.currentUser && window.store.currentUser.role === 'student' ? window.store.setView('curriculum', { id: window.store.currentUser.grade_id }) : window.store.setView('curriculum', { id: 3 })" 
                     class="academic-card p-6 cursor-pointer space-y-5 relative overflow-hidden group">
                    <div class="flex items-center justify-between">
                        <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                            ۹
                        </div>
                        <span class="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 font-mono">
                            GRADE 09
                        </span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            پایه نهم • سینماتیک، دینامیک، فشار و فضا
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            فصل ۴: حرکت و نمودارهای x-t, v-t, a-t • فصل ۵: قوانین نیوتون و اصطکاک • فصل ۸: فشار شاره‌ها • فصل ۹: ماشین‌ها • فصل ۱۰: فضا
                        </p>
                    </div>
                    <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <span>ورود به سرفصل‌ها و درسنامه‌ها</span>
                        <i data-lucide="chevron-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Institutional Quality & Pedagogical Framework -->
    <section class="py-14">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div class="text-center space-y-2 max-w-xl mx-auto">
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase font-mono">PEDAGOGICAL STANDARDS</span>
                <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">چهار اصل حاکم بر طراحی علمی پلتفرم</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        ۱
                    </div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">یادگیری کاوش‌محور (Inquiry)</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        دانش‌آموز ابتدا با متغیرها در شبیه‌ساز آزمایشگاهی کار می‌کند و سپس رابطه تحلیلی و فرمول حاکم را استخراج می‌نماید.
                    </p>
                </div>

                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                        ۲
                    </div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">تفکیک نرده‌ای و برداری</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        حل ریشه‌ای بدفهمی‌های رایج دانش‌آموزان در تمایز مسافت با جابه‌جایی، تندی با سرعت و ارتباط جهت شتاب با تندشوندگی.
                    </p>
                </div>

                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        ۳
                    </div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">تحلیل هندسی ۳ نمودار</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        درک شهودی مفهوم شیب مماس (مشتق لحظه‌ای) و مساحت زیر منحنی (انتگرال جابه‌جایی و تغییر سرعت) به سبک آزمون‌های سمپاد.
                    </p>
                </div>

                <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                        ۴
                    </div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">سنجه ارزیابی روبیک</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        تصحیح سوالات تشریحی بر اساس ۴ مؤلفه استاندارد: استخراج داده‌های اولیه، فرمول، جایگذاری با یکا و استنتاج نهایی.
                    </p>
                </div>
            </div>
        </div>
    </section>
    `;

    if (window.renderMathInPage) {
        setTimeout(() => window.renderMathInPage(container), 30);
    }
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
                heroGradient: 'from-slate-900 via-slate-900/95 to-slate-950 border-slate-800',
                gradeBadge: 'پایه هفتم — کاوشگر ماده، اندازه‌گیری و انرژی',
                badgeIcon: 'flame',
                accentColor: 'sky',
                formula: '$$W = F \\cdot d \\quad , \\quad E_k = \\frac{1}{2}m v^2 \\quad , \\quad Q = mc\\Delta T$$',
                labTitle: 'میز کار آزمایشگاه هفتم: اندازه‌گیری، چگالی و تبدیل انرژی (PhET)',
                labDesc: 'بررسی دقیق یکاهای استاندارد SI، رابطه چگالی $\\rho = \\frac{m}{V}$، تبدیلات انرژی پتانسیل گرانشی و جنبشی، و سازوکار انتقال گرما (رسانش، همرفت، تابش).',
                labActionText: 'ورود به آزمایشگاه PhET',
                simId: 'density'
            },
            8: {
                themeClass: 'grade-theme-8',
                heroGradient: 'from-slate-900 via-slate-900/95 to-slate-950 border-slate-800',
                gradeBadge: 'پایه هشتم — پژوهشگر بارهای الکتریکی، مغناطیس و نور',
                badgeIcon: 'zap',
                accentColor: 'sky',
                formula: '$$V = I \\cdot R \\quad , \\quad \\theta_i = \\theta_r \\quad , \\quad n = \\frac{c}{v}$$',
                labTitle: 'میز کار آزمایشگاه هشتم: مدار الکتریکی و شکست نور در عدسی‌ها (PhET)',
                labDesc: 'کاوش قانون اهم، مقاومت معادل مدارهای متوالی و موازی، اثر متقابل قطب‌های مغناطیسی، تشکیل تصویر در آینه‌های کروی و پدیده شکست نور در منشور.',
                labActionText: 'ورود به آزمایشگاه PhET',
                simId: 'circuit-dc'
            },
            9: {
                themeClass: 'grade-theme-9',
                heroGradient: 'from-slate-900 via-slate-900/95 to-slate-950 border-slate-800',
                gradeBadge: 'پایه نهم — نخبه مکانیک کلاسیک، دینامیک نیوتون و فشار',
                badgeIcon: 'orbit',
                accentColor: 'sky',
                formula: '$$F_{net} = m \\cdot a \\quad , \\quad P = \\rho g h \\quad , \\quad v = \\frac{\\Delta x}{\\Delta t}$$',
                labTitle: 'رصدخانه تخصصی نهم: بردار نیرو، قوانین نیوتون و فشار شاره‌ها (PhET)',
                labDesc: 'تحلیل برداری سینماتیک حرکت، قوانین اول تا سوم نیوتون و نیروی اصطکاک، فشار در عمق مایعات، قانون پاسکال و مزیت مکانیکی قرقره‌ها و اهرم‌ها.',
                labActionText: 'ورود به آزمایشگاه PhET',
                simId: 'forces-motion'
            }
        };

        const cfg = gradeConfigs[gradeNum] || gradeConfigs[7];

        container.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <!-- Dedicated Scientific Hero Header -->
            <div class="bg-gradient-to-r ${cfg.heroGradient} rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 backdrop-blur-md border border-sky-800/80 text-sky-300 text-xs font-bold mb-2 shadow-sm">
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
                    <button onclick="window.store.setView('simulators', { id: '${cfg.simId}' })" class="btn-duo-blue text-white font-bold text-xs px-4 py-2 rounded-xl whitespace-nowrap shadow-md hover:scale-105 transition-all">
                        ${cfg.labActionText}
                    </button>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${cfg.labDesc}</p>
                <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-center font-mono text-sm text-cyan-300 katex-ltr-container overflow-x-auto">
                    ${cfg.formula}
                </div>
            </div>

            <!-- Nexora AI Physics Assistant Interactive Banner -->
            <div class="p-6 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-4">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                        <div class="w-12 h-12 rounded-2xl bg-sky-950/80 text-sky-400 border border-sky-800/80 flex items-center justify-center shadow-md">
                            <i data-lucide="sparkles" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="font-extrabold text-white text-base font-sans">معلم همراه هوش مصنوعی نکسورا (Nexora AI)</h3>
                                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 font-sans font-medium">آنلاین • آماده پاسخگویی</span>
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
        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) window.renderMathInPage(container);
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
            if (activeGradeId == 3) return [4, 5, 8, 9, 10].includes(chNum);
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
                            class="physics-card-3d bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-800 hover:border-sky-500/60 shadow-xl shadow-sm cursor-pointer space-y-3.5 transition-all">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black px-3 py-1 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-800/80 font-bold">
                                        فصل ${ch.chapter_number}
                                    </span>
                                    <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                                        <i data-lucide="zap" class="w-3 h-3 text-sky-400 fill-sky-400"></i>
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

            <!-- Supplementary Study Materials Banner -->
            <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <i data-lucide="book-marked" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="font-extrabold text-sm text-white">درسنامه‌ها، خلاصه‌ها و جزوات متفرقه فیزیک</h4>
                        <p class="text-xs text-emerald-300/80">دریافت فایل جزوات دبیران، فرمول‌نامه‌های سریع و نمونه سؤالات امتحانی به همراه پاسخ تشریحی</p>
                    </div>
                </div>
                <button onclick="window.store.setView('materials')" class="btn-duo-green text-white font-bold text-xs px-4 py-2.5 rounded-xl self-start sm:self-auto shrink-0 shadow-sm flex items-center gap-1.5 hover:scale-105 transition-all">
                    <span>مشاهده جزوات و درسنامه‌ها</span>
                    <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                </button>
            </div>

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
                        const simType = window.physicsSimulators ? window.physicsSimulators.getSimulatorForLesson(l, ch) : null;
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
                                    <button onclick="event.stopPropagation(); window.store.setView('simulators', { id: '${simType}' })" title="انتقال به آزمایشگاه مجازی این درس" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-teal-950/70 hover:bg-teal-900 border border-teal-600/50 text-teal-300 hover:text-teal-100 text-[11px] font-bold transition-all shadow-sm cursor-pointer">
                                        <i data-lucide="atom" class="w-3.5 h-3.5 text-teal-400"></i>
                                        <span>آزمایشگاه مجازی</span>
                                    </button>
                                    ` : ''}
                                </div>
                                <span class="text-xs text-slate-400 font-sans block">مدت: ${l.estimated_minutes} دقیقه • پاداش: +${l.xp_reward} XP</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <button onclick="window.store.setView('lesson', { id: ${l.id} })" class="${l.is_completed ? 'btn-duo-blue' : 'btn-duo-green'} text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm whitespace-nowrap hover:scale-105 transition-all">
                                ${l.is_completed ? 'مرور مجدد' : 'شروع درس'}
                            </button>
                        </div>
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
            if (!username || !password) {
                throw new Error('لطفاً نام کاربری و رمز عبور را وارد کنید.');
            }
            res = await window.api.login(username, password);
        } else {
            const fullNameInput = document.getElementById('auth-fullname');
            const fullName = fullNameInput ? fullNameInput.value.trim() : '';
            if (!fullName || fullName.length < 2) {
                throw new Error('لطفاً نام و نام خانوادگی خود را کامل وارد کنید (حداقل ۲ کاراکتر).');
            }
            if (!username || username.length < 3) {
                throw new Error('نام کاربری باید حداقل ۳ کاراکتر باشد.');
            }
            if (!password || password.length < 6) {
                throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد.');
            }
            const gradeId = parseInt(document.getElementById('auth-grade')?.value) || 1;
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

async function renderSimulatorsCatalogView(container, activeSim = 'density', currentMode = 'native', gradeFilter = 'all') {
    const simCatalog = window.physicsSimulators ? window.physicsSimulators.catalog : [];
    const activeLab = simCatalog.find(s => s.id === activeSim) || simCatalog[0] || {
        id: 'density', title: 'چگالی و ارشمیدس', gradeTitle: 'پایه هفتم', grade: 7,
        desc: 'بررسی جرم، حجم و نیروی شناوری ارشمیدس', formula: '\\rho = m/V', goals: []
    };

    let labProgress = null;
    if (window.api && window.api.token) {
        try {
            labProgress = await window.api.getLabProgress();
            if (window.physicsSimulators) {
                window.physicsSimulators.userLabProgress = labProgress;
            }
        } catch (e) {
            console.warn('Could not load lab progress in catalog view:', e);
        }
    }

    const completedCount = labProgress ? labProgress.completed_labs_count : 0;
    const totalXp = labProgress ? labProgress.total_lab_xp : 0;
    const progressPct = simCatalog.length > 0 ? Math.round((completedCount / simCatalog.length) * 100) : 0;

    container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        <!-- PhET Official Standard Header (MIT & CERN Academic Portal Standard) -->
        <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/95 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-sky-950/80 border border-blue-200 dark:border-sky-500/30 text-blue-700 dark:text-sky-300 text-xs font-bold font-sans">
                    <i data-lucide="flask-conical" class="w-4 h-4 text-blue-600 dark:text-sky-400"></i>
                    <span>پلتفرم تخصصی آزمایشگاه‌های تعاملی فیزیک — استاندارد بین‌المللی PhET</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.openLabToolboxModal('caliper')" 
                        class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-sans flex items-center gap-2 shadow-sm transition-colors">
                        <i data-lucide="wrench" class="w-4 h-4"></i>
                        <span>جعبه ابزار آزمایشگاهی</span>
                    </button>
                    <button onclick="window.physicsSimulators.openLabToolboxModal('report')" 
                        class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold font-sans flex items-center gap-2 transition-colors">
                        <i data-lucide="file-text" class="w-4 h-4 text-blue-600 dark:text-sky-400"></i>
                        <span>دفترچه گزارش کار</span>
                    </button>
                </div>
            </div>

            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-sans">
                آزمایشگاه تخصصی و شبیه‌سازهای تعاملی فیزیک
            </h1>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-sans">
                محیط استاندارد آموزش تجربی و شبیه‌سازی دقیق فیزیک؛ متغیرها را آزادانه تغییر دهید، فرضیه‌سازی کنید و با ابزارهای علمی داده‌ها را تحلیل و ثبت نمایید.
            </p>

            <!-- Unified PhET Grade Filter Tabs (Academic Light/Dark Contrast) -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div class="flex flex-wrap items-center gap-2 text-xs font-sans">
                    <button onclick="window.renderSimulatorsCatalogView(document.getElementById('app-main-content'), '${activeSim}', '${currentMode}', 'all')"
                        class="px-4 py-2 rounded-xl transition-colors font-sans ${gradeFilter === 'all' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 font-medium'}">
                        همه آزمایش‌ها (${simCatalog.length})
                    </button>
                    <button onclick="window.renderSimulatorsCatalogView(document.getElementById('app-main-content'), '${activeSim}', '${currentMode}', '7')"
                        class="px-4 py-2 rounded-xl transition-colors font-sans ${gradeFilter === '7' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 font-medium'}">
                        پایه هفتم (${simCatalog.filter(s => s.grade === 7 && s.gradeKey !== 'space').length})
                    </button>
                    <button onclick="window.renderSimulatorsCatalogView(document.getElementById('app-main-content'), '${activeSim}', '${currentMode}', '8')"
                        class="px-4 py-2 rounded-xl transition-colors font-sans ${gradeFilter === '8' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 font-medium'}">
                        پایه هشتم (${simCatalog.filter(s => s.grade === 8 && s.gradeKey !== 'space').length})
                    </button>
                    <button onclick="window.renderSimulatorsCatalogView(document.getElementById('app-main-content'), '${activeSim}', '${currentMode}', '9')"
                        class="px-4 py-2 rounded-xl transition-colors font-sans ${gradeFilter === '9' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 font-medium'}">
                        پایه نهم (${simCatalog.filter(s => s.grade === 9 && s.gradeKey !== 'space').length})
                    </button>
                    <button onclick="window.renderSimulatorsCatalogView(document.getElementById('app-main-content'), '${activeSim}', '${currentMode}', 'space')"
                        class="px-4 py-2 rounded-xl transition-colors font-sans ${gradeFilter === 'space' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 font-medium'}">
                        نجوم و فضا (${simCatalog.filter(s => s.gradeKey === 'space').length})
                    </button>
                </div>

                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans">
                    <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400"></span>
                    <span>${simCatalog.length} آزمایشگاه تعاملی و رسمی PhET دانشگاه کلرادو (۱۰۰٪ استاندارد و آفلاین)</span>
                </div>
            </div>
        </div>

        <!-- Student Lab Progress Strip (Academic Light/Dark Theme) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm space-y-3 font-sans">
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-sky-950 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-sky-500/30 flex items-center justify-center font-bold">
                        <i data-lucide="award" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-medium font-sans">کارنامه فعالیت‌های آزمایشگاهی شما:</span>
                        <span class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="font-mono text-blue-600 dark:text-sky-400">${totalXp} XP</span>
                            <span class="text-xs text-slate-600 dark:text-slate-300 font-normal font-sans">امتیاز کسب‌شده در گزارش کار و فعالیت‌های علمی</span>
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-5 text-xs font-sans">
                    <div class="text-right">
                        <span class="text-slate-500 dark:text-slate-400 text-[10px] block font-sans">آزمایش‌های تکمیل‌شده:</span>
                        <span class="text-slate-800 dark:text-slate-200 text-sm font-sans font-bold"><span class="font-mono text-blue-600 dark:text-sky-400">${completedCount}</span> از <span class="font-mono">${simCatalog.length}</span></span>
                    </div>
                    <div class="text-right">
                        <span class="text-slate-500 dark:text-slate-400 text-[10px] block font-sans">درصد تکمیل:</span>
                        <span class="text-blue-600 dark:text-sky-300 font-mono text-sm font-bold">${progressPct}%</span>
                    </div>
                </div>
            </div>

            <!-- Progress track -->
            <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden">
                <div class="h-full bg-blue-600 dark:bg-sky-500 rounded-full transition-all duration-500" 
                    style="width: ${Math.min(100, progressPct)}%"></div>
            </div>
        </div>

        <!-- Experiment Selector Grid (Academic Standard Clean Cards) -->
        <div class="space-y-3 font-sans">
            <div class="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 font-sans">
                <span>انتخاب آزمایش از سرفصل دروس فیزیک:</span>
                <span>${simCatalog.filter(s => {
                    if (gradeFilter === 'all') return true;
                    if (gradeFilter === 'space') return s.gradeKey === 'space';
                    return s.grade.toString() === gradeFilter && s.gradeKey !== 'space';
                }).length} آزمایش در دسترس</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                ${simCatalog.filter(s => {
                    if (gradeFilter === 'all') return true;
                    if (gradeFilter === 'space') return s.gradeKey === 'space';
                    return s.grade.toString() === gradeFilter && s.gradeKey !== 'space';
                }).map(s => {
                    const isSelected = s.id === activeSim;
                    const isCompleted = labProgress && labProgress.completed_sim_ids && labProgress.completed_sim_ids.includes(s.id);
                    return `
                    <button onclick="window.renderSimulatorsCatalogView(document.getElementById('app-main-content'), '${s.id}', '${currentMode}', '${gradeFilter}')"
                        class="p-3 rounded-2xl border text-right transition-all flex flex-col justify-between group font-sans ${isSelected 
                            ? 'bg-blue-50 dark:bg-slate-900 border-blue-600 dark:border-sky-500 text-blue-900 dark:text-white ring-2 ring-blue-500/30 dark:ring-sky-500/40 shadow-md' 
                            : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm'}">
                        <div class="flex items-center justify-between mb-2">
                            <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${isSelected ? 'text-blue-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-sky-400'} transition-colors">
                                <i data-lucide="${s.icon || 'atom'}" class="w-3.5 h-3.5"></i>
                            </span>
                            <div class="flex items-center gap-1">
                                ${isCompleted ? `
                                <span class="text-[9px] px-1.5 py-0.5 rounded-md font-sans font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 flex items-center gap-0.5">
                                    <i data-lucide="check" class="w-2.5 h-2.5"></i>
                                    <span>انجام‌شده</span>
                                </span>
                                ` : ''}
                                <span class="text-[10px] px-2 py-0.5 rounded-md font-sans font-semibold text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-sky-950/90 border border-blue-200 dark:border-sky-800/80">
                                    PhET
                                </span>
                                <span class="text-[10px] px-2 py-0.5 rounded-md font-sans font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60">
                                    ${s.gradeTitle}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span class="text-xs font-bold block truncate font-sans leading-tight ${isSelected ? 'text-blue-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}">${s.title}</span>
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-1 font-sans">${s.topic}</span>
                        </div>
                    </button>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- Mount Point for the Active Simulator Apparatus -->
        <div id="catalog-sim-mount-point" class="w-full"></div>
    </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    if (window.renderMathInPage) window.renderMathInPage(container);

    if (window.physicsSimulators) {
        window.physicsSimulators.mount(activeSim, 'catalog-sim-mount-point', currentMode);
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

// ==========================================
// VIEW: SUPPLEMENTARY STUDY MATERIALS & PAMPHLETS
// ==========================================
async function renderStudyMaterialsView(container, activeGradeId = null) {
    container.innerHTML = `<div class="text-center py-16"><div class="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>`;
    
    try {
        const user = window.store.currentUser;
        let selectedGrade = activeGradeId ? parseInt(activeGradeId) : (user && user.grade_id ? user.grade_id : null);
        let selectedCategory = null;

        const loadMaterials = async () => {
            const materials = await window.api.getStudyMaterials(selectedGrade, selectedCategory);
            renderContent(materials);
        };

        const renderContent = (materials) => {
            const categoryLabels = {
                pamphlet: { title: 'جزوه و درسنامه کامل', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
                summary: { title: 'خلاصه درس و فرمول‌نامه', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
                exam_sample: { title: 'نمونه سؤال با پاسخ', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
                slide: { title: 'اسلاید آموزشی', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
                other: { title: 'سایر منابع', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
            };

            container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <!-- Hero Header -->
                <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-10 border border-slate-800 shadow-xl text-white space-y-4">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        <i data-lucide="book-marked" class="w-4 h-4 text-emerald-400"></i>
                        <span>بانک تخصصی درسنامه‌ها و جزوات متفرقه فیزیک</span>
                    </div>

                    <h1 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                        درسنامه‌ها، خلاصه‌ها و نمونه سؤالات تکمیلی
                    </h1>

                    <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                        دسترسی رایگان به جزوات طلایی تدریس دبیران، فرمول‌نامه‌های سریع، خلاصه فصول کتب رسمی و سمپاد، و نمونه سؤالات امتحانات نوبت اول و دوم به همراه پاسخ‌های تشریحی.
                    </p>

                    <div class="flex flex-wrap items-center gap-3 pt-2 text-xs">
                        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                            <i data-lucide="file-check" class="w-4 h-4 text-emerald-400"></i>
                            <span>تأیید شده توسط دبیران سمپاد</span>
                        </div>
                        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                            <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i>
                            <span>دانلود مستقیم و سریع فایل‌ها</span>
                        </div>
                    </div>
                </div>

                <!-- Filter Strip -->
                <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <!-- Grade Switcher -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
                        <span class="text-slate-400 text-xs shrink-0 pl-1">پایه:</span>
                        <button id="mat-grade-all" class="px-3 py-2 rounded-xl transition-all ${selectedGrade === null ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            همه پایه‌ها
                        </button>
                        <button id="mat-grade-7" class="px-3 py-2 rounded-xl transition-all ${selectedGrade === 1 ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            پایه هفتم
                        </button>
                        <button id="mat-grade-8" class="px-3 py-2 rounded-xl transition-all ${selectedGrade === 2 ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            پایه هشتم
                        </button>
                        <button id="mat-grade-9" class="px-3 py-2 rounded-xl transition-all ${selectedGrade === 3 ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            پایه نهم
                        </button>
                    </div>

                    <!-- Category Switcher -->
                    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
                        <span class="text-slate-400 text-xs shrink-0 pl-1">موضوع:</span>
                        <button id="mat-cat-all" class="px-3 py-2 rounded-xl transition-all ${selectedCategory === null ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            همه
                        </button>
                        <button id="mat-cat-pamphlet" class="px-3 py-2 rounded-xl transition-all ${selectedCategory === 'pamphlet' ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            جزوات
                        </button>
                        <button id="mat-cat-summary" class="px-3 py-2 rounded-xl transition-all ${selectedCategory === 'summary' ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            فرمول‌نامه
                        </button>
                        <button id="mat-cat-exam_sample" class="px-3 py-2 rounded-xl transition-all ${selectedCategory === 'exam_sample' ? 'bg-sky-600 text-white shadow-sm font-bold border border-sky-500' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                            نمونه سؤال
                        </button>
                    </div>
                </div>

                <!-- Materials Cards Grid -->
                <div id="materials-grid-container">
                    ${materials.length === 0 ? `
                    <div class="text-center py-16 space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
                        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                            <i data-lucide="folder-open" class="w-8 h-8"></i>
                        </div>
                        <div class="space-y-1">
                            <h3 class="font-bold text-slate-800 dark:text-white text-base">درسنامه‌ای برای این فیلتر یافت نشد</h3>
                            <p class="text-xs text-slate-400">لطفاً فیلترهای پایه یا موضوع را تغییر دهید یا به زودی مجدداً سر بزنید.</p>
                        </div>
                    </div>
                    ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${materials.map(m => {
                            const cat = categoryLabels[m.category] || categoryLabels.other;
                            const sizeStr = m.file_size_bytes > 0 
                                ? (m.file_size_bytes > 1024 * 1024 ? (m.file_size_bytes / (1024 * 1024)).toFixed(1) + ' مگابایت' : Math.round(m.file_size_bytes / 1024) + ' کیلوبایت')
                                : 'فایل تکمیلی';
                            return `
                            <div class="group flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all space-y-5">
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between gap-2">
                                        <span class="px-2.5 py-1 rounded-xl text-[11px] font-bold border ${cat.color}">
                                            ${cat.title}
                                        </span>
                                        <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                                            ${m.grade_title_fa}
                                        </span>
                                    </div>

                                    <h3 class="font-black text-base text-slate-900 dark:text-white leading-snug group-hover:text-emerald-500 transition-colors">
                                        ${m.title_fa}
                                    </h3>

                                    ${m.description_fa ? `
                                    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                                        ${m.description_fa}
                                    </p>
                                    ` : ''}

                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                                        <div class="flex items-center gap-1.5">
                                            <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-500"></i>
                                            <span>مؤلف: <strong class="text-slate-700 dark:text-slate-200 font-semibold">${m.author_name || 'دبیرخانه فیزیک'}</strong></span>
                                        </div>
                                        <div class="flex items-center justify-between text-[11px] pt-1">
                                            <span class="flex items-center gap-1">
                                                <i data-lucide="hard-drive" class="w-3.5 h-3.5 text-slate-400"></i>
                                                <span>حجم: ${sizeStr}</span>
                                            </span>
                                            <span class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                                <span>${m.download_count} دانلود</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    ${m.file_url ? (
                                        m.file_exists_on_disk !== false ? `
                                        <a href="${m.file_url}" target="_blank" onclick="window.api.incrementMaterialDownload(${m.id})"
                                            class="w-full py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                                            <i data-lucide="download" class="w-4 h-4"></i>
                                            <span>مشاهده و دریافت فایل</span>
                                        </a>
                                        ` : `
                                        <button onclick="alert('این فایل در حال بازبینی و به‌روزرسانی توسط دبیر محترم است.')" class="w-full py-2.5 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs flex items-center justify-center gap-2">
                                            <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
                                            <span>فایل در حال به‌روزرسانی دبیر</span>
                                        </button>
                                        `
                                    ) : `
                                    <button onclick="window.showComingSoon('فایل ضمیمه این جزوه')" class="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs">
                                        فایل در دست آماده‌سازی
                                    </button>
                                    `}
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                    `}
                </div>
            </div>
            `;

            // Bind filter button events
            const bindClick = (id, fn) => {
                const el = document.getElementById(id);
                if (el) el.onclick = fn;
            };

            bindClick('mat-grade-all', () => { selectedGrade = null; loadMaterials(); });
            bindClick('mat-grade-7', () => { selectedGrade = 1; loadMaterials(); });
            bindClick('mat-grade-8', () => { selectedGrade = 2; loadMaterials(); });
            bindClick('mat-grade-9', () => { selectedGrade = 3; loadMaterials(); });

            bindClick('mat-cat-all', () => { selectedCategory = null; loadMaterials(); });
            bindClick('mat-cat-pamphlet', () => { selectedCategory = 'pamphlet'; loadMaterials(); });
            bindClick('mat-cat-summary', () => { selectedCategory = 'summary'; loadMaterials(); });
            bindClick('mat-cat-exam_sample', () => { selectedCategory = 'exam_sample'; loadMaterials(); });

            if (window.lucide) window.lucide.createIcons();
        };

        await loadMaterials();
    } catch (err) {
        container.innerHTML = `
        <div class="max-w-md mx-auto my-12 p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-3">
            <i data-lucide="alert-triangle" class="w-8 h-8 text-rose-500 mx-auto"></i>
            <h3 class="font-bold text-rose-700 dark:text-rose-300">خطا در دریافت درسنامه‌ها</h3>
            <p class="text-xs text-rose-600 dark:text-rose-400">${err.message}</p>
        </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }
}

window.renderStudyMaterialsView = renderStudyMaterialsView;

