<?php
/**
 * QUANTUM CUT — Responsive Obsidian Quantum HUD Navbar & Mobile Dock
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Responsive RTL Navbar & Mobile HUD Dock Component
 * Fully adaptive across Mobile, Tablet, Laptop & 4K Screens.
 * Deep Obsidian Quantum Physics Theme with Clean BiDi Isolation.
 */

let isMobileDrawerOpen = false;
let isLabDropdownOpen = false;
let isArenaDropdownOpen = false;
let isTeacherDropdownOpen = false;

function toggleMobileDrawer(forceState) {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!drawer) return;
    isMobileDrawerOpen = (typeof forceState === 'boolean') ? forceState : !isMobileDrawerOpen;
    if (isMobileDrawerOpen) {
        drawer.classList.remove('hidden');
    } else {
        drawer.classList.add('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
}

function closeAllDropdowns() {
    ['lab-dropdown-menu', 'arena-dropdown-menu', 'teacher-dropdown-menu'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

function toggleNavDropdown(menuId, event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById(menuId);
    if (!menu) return;
    const isCurrentlyOpen = !menu.classList.contains('hidden');
    closeAllDropdowns();
    if (!isCurrentlyOpen) {
        menu.classList.remove('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-wrapper')) {
        closeAllDropdowns();
    }
});

function renderNavbar() {
    const user = window.store ? window.store.currentUser : null;
    const isDark = window.store ? window.store.theme === 'dark' : true;
    const rawView = window.store ? window.store.currentView : 'dashboard';
    const currentView = typeof rawView === 'string' ? rawView : (rawView?.name || 'dashboard');

    const isTabActive = (tabName) => currentView === tabName;
    const isAnyActive = (tabs) => tabs.includes(currentView);

    return `
    <header class="w-full bg-slate-950/85 backdrop-blur-2xl border-b border-cyan-500/20 sticky top-0 z-40 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.65)]">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
            <div class="flex items-center justify-between h-14 sm:h-16 gap-2 w-full">
                <!-- Brand / Logo with Holographic Glow -->
                <div class="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 min-w-0" onclick="window.store.setView('landing')">
                    <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/30 shrink-0 group">
                        <i data-lucide="atom" class="w-5 h-5 text-cyan-200 group-hover:rotate-180 transition-transform duration-700"></i>
                    </div>
                    <div class="flex flex-col text-right min-w-0">
                        <span class="font-black text-xs sm:text-sm text-white tracking-tight truncate max-w-[140px] xs:max-w-[200px] sm:max-w-xs md:max-w-none">
                            انجمن فیزیک شهید بهشتی دو
                        </span>
                        <span dir="ltr" class="sci-term text-[9px] text-cyan-400 font-mono tracking-widest truncate hidden sm:block">
                            SAMPAD PHYSICS SOCIETY • ROUND 1
                        </span>
                    </div>
                </div>

                <!-- Nav Links for Desktop & Laptop (Grouped Segmented Pills) -->
                <nav class="hidden xl:flex items-center gap-1.5 text-xs font-semibold shrink-0">
                    <!-- 1. Learning & Curriculum -->
                    <a href="#curriculum" onclick="window.store.setView('curriculum')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${isTabActive('curriculum') ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">
                        <i data-lucide="book-open" class="w-3.5 h-3.5 ${isTabActive('curriculum') ? 'text-cyan-400' : 'text-slate-400'}"></i>
                        <span>آموزش فیزیک</span>
                    </a>

                    <!-- 2. Labs Dropdown -->
                    <div class="relative nav-dropdown-wrapper">
                        <button type="button" onclick="toggleNavDropdown('lab-dropdown-menu', event)" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${isAnyActive(['simulators', 'sensor-lab', 'data-logger']) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">
                            <i data-lucide="flask-conical" class="w-3.5 h-3.5 text-cyan-400"></i>
                            <span>آزمایشگاه‌ها</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400"></i>
                        </button>
                        <div id="lab-dropdown-menu" class="hidden absolute top-full mt-2 right-0 w-64 bg-slate-950/95 border border-cyan-500/30 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                            <button onclick="window.store.setView('simulators'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-cyan-950/40 hover:border-cyan-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="box" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">شبیه‌سازهای تعاملی PhET</div>
                                    <div class="text-[10px] text-slate-400">۲۹ آزمایشگاه فیزیک هفتم، هشتم و نهم</div>
                                </div>
                            </button>
                            <button onclick="window.store.setView('sensor-lab'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-cyan-950/40 hover:border-cyan-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="smartphone" class="w-4 h-4 text-blue-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">آزمایشگاه سنسوری تلفن همراه</div>
                                    <div class="text-[10px] text-slate-400">شتاب‌سنج، ژیروسکوپ و طیف‌سنج صوت</div>
                                </div>
                            </button>
                            <button onclick="window.store.setView('data-logger'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-cyan-950/40 hover:border-cyan-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="line-chart" class="w-4 h-4 text-teal-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">برازش خطی و تحلیل خطاها</div>
                                    <div class="text-[10px] text-slate-400">رگرسیون خطی با ضریب R²</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- 3. Competition & Duels Arena -->
                    <div class="relative nav-dropdown-wrapper">
                        <button type="button" onclick="toggleNavDropdown('arena-dropdown-menu', event)" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${isAnyActive(['duel', 'guilds', 'competitions', 'leaderboards']) ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">
                            <i data-lucide="swords" class="w-3.5 h-3.5 text-amber-400"></i>
                            <span>آرنای رقابت</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400"></i>
                        </button>
                        <div id="arena-dropdown-menu" class="hidden absolute top-full mt-2 right-0 w-64 bg-slate-950/95 border border-amber-500/30 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                            <button onclick="window.store.setView('duel'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-amber-950/40 hover:border-amber-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="zap" class="w-4 h-4 text-cyan-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">دوئل ۱ به ۱ کوانتومی</div>
                                    <div class="text-[10px] text-slate-400">نبرد سرعتی زنده همراه رتبه‌بندی ELO</div>
                                </div>
                            </button>
                            <button onclick="window.store.setView('guilds'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-amber-950/40 hover:border-amber-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="shield" class="w-4 h-4 text-amber-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">خاندان‌های علمی سمپاد</div>
                                    <div class="text-[10px] text-slate-400">ماکسول، نیوتون، بوهر، فاینمن</div>
                                </div>
                            </button>
                            <button onclick="window.store.setView('competitions'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-amber-950/40 hover:border-amber-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="trophy" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">لیگ‌ها و جدول امتیازات</div>
                                    <div class="text-[10px] text-slate-400">رتبه‌بندی فصلی و مدال‌های المپیادی</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- 4. Adaptive Exam (CAT) -->
                    <a href="#adaptive-exam" onclick="window.store.setView('adaptive-exam')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${isTabActive('adaptive-exam') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">
                        <i data-lucide="target" class="w-3.5 h-3.5 text-emerald-400"></i>
                        <span>آزمون تطبیقی (CAT)</span>
                    </a>

                    <!-- 5. Teacher & Deck Dropdown -->
                    <div class="relative nav-dropdown-wrapper">
                        <button type="button" onclick="toggleNavDropdown('teacher-dropdown-menu', event)" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${isAnyActive(['live-lab', 'teacher-heatmap', 'printable-exam', 'handwriting-grader', 'admin']) ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">
                            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            <i data-lucide="radio" class="w-3.5 h-3.5 text-rose-400"></i>
                            <span>میز کار دبیران</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400"></i>
                        </button>
                        <div id="teacher-dropdown-menu" class="hidden absolute top-full mt-2 right-0 w-72 bg-slate-950/95 border border-rose-500/30 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                            <button onclick="window.store.setView('live-lab'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-rose-950/40 hover:border-rose-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="video" class="w-4 h-4 text-rose-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">کلاس زنده دبیر (Live Classroom)</div>
                                    <div class="text-[10px] text-slate-400">پخش زنده، شبیه‌ساز مشترک و کوئیز آنی</div>
                                </div>
                            </button>
                            <button onclick="window.store.setView('teacher-heatmap'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-rose-950/40 hover:border-rose-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="flame" class="w-4 h-4 text-amber-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">ماتریس کج‌فهمی‌های فیزیک</div>
                                    <div class="text-[10px] text-slate-400">نقشه حرارتی خطاهای مفهومی دانش‌آموزان</div>
                                </div>
                            </button>
                            <button onclick="window.store.setView('handwriting-grader'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-rose-950/40 hover:border-rose-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="scan-text" class="w-4 h-4 text-violet-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">تصحیح دست‌نوشته با هوش مصنوعی</div>
                                    <div class="text-[10px] text-slate-400">بارم‌بندی ۴ مرحله‌ای با GPT Oss 120B</div>
                                </div>
                            </button>
                            <button onclick="window.store.setView('printable-exam'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl hover:bg-rose-950/40 hover:border-rose-500/30 border border-transparent flex items-center gap-2.5 text-slate-200">
                                <i data-lucide="printer" class="w-4 h-4 text-teal-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs font-bold">آزمون‌ساز استاندارد چاپی A4</div>
                                    <div class="text-[10px] text-slate-400">سربرگ رسمی سمپاد و پاسخ‌نامه کلیدی</div>
                                </div>
                            </button>
                            ${user && user.role === 'admin' ? `
                            <button onclick="window.store.setView('admin'); closeAllDropdowns()" class="w-full text-right p-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 font-bold">
                                <i data-lucide="shield-check" class="w-4 h-4 text-rose-400 shrink-0"></i>
                                <div>
                                    <div class="text-xs">پنل مدیریت کل سیستم</div>
                                    <div class="text-[10px] text-rose-400/80">ویرایش سوالات، کاربران و محتوا</div>
                                </div>
                            </button>
                            ` : ''}
                        </div>
                    </div>
                </nav>

                <!-- Medium Screens Navigation (LG) -->
                <nav class="hidden lg:flex xl:hidden items-center gap-1.5 text-xs font-semibold shrink-0">
                    <a href="#curriculum" onclick="window.store.setView('curriculum')" class="px-2.5 py-1.5 rounded-xl ${isTabActive('curriculum') ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:text-white'}">
                        آموزش
                    </a>
                    <a href="#simulators" onclick="window.store.setView('simulators')" class="px-2.5 py-1.5 rounded-xl ${isTabActive('simulators') ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:text-white'}">
                        آزمایشگاه
                    </a>
                    <a href="#duel" onclick="window.store.setView('duel')" class="px-2.5 py-1.5 rounded-xl ${isTabActive('duel') ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300 hover:text-white'}">
                        دوئل ۱v۱
                    </a>
                    <a href="#live-lab" onclick="window.store.setView('live-lab')" class="px-2.5 py-1.5 rounded-xl ${isTabActive('live-lab') ? 'bg-rose-500/20 text-rose-300' : 'text-slate-300 hover:text-white'}">
                        کلاس زنده
                    </a>
                    <button type="button" onclick="window.toggleMobileDrawer()" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800">
                        <span>همه امکانات</span>
                        <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
                    </button>
                </nav>

                <!-- Right Side: AI Button, Gamification Badges, User Controls -->
                <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    <!-- Nexora AI Copilot Trigger Button (Quantum Glowing) -->
                    <button onclick="window.toggleAiTutorModal(true)" class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 border border-cyan-400/30 transition-all transform hover:scale-105 active:scale-95">
                        <span class="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></span>
                        <i data-lucide="bot" class="w-3.5 h-3.5"></i>
                        <span class="hidden sm:inline">نکسورا AI</span>
                    </button>

                    ${user ? `
                    <!-- Streak Flame Badge -->
                    <div class="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-950/40 text-orange-400 text-xs font-bold border border-orange-500/30 shadow-inner" title="استمرار روزانه مطالعه">
                        <i data-lucide="flame" class="w-3.5 h-3.5 text-orange-500 fill-orange-500"></i>
                        <span class="sci-term font-mono">${user.current_streak || 0}</span>
                        <span class="text-[10px]">روز</span>
                    </div>

                    <!-- XP Points Badge -->
                    <div class="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/40 text-amber-300 text-xs font-bold border border-amber-500/30 shadow-inner" title="امتیاز تجربه (XP)">
                        <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-400 fill-amber-400"></i>
                        <span class="sci-term font-mono">${user.total_xp || 0}</span>
                        <span class="text-[10px]">XP</span>
                    </div>

                    <!-- User Profile Avatar Pill -->
                    <button onclick="window.store.setView('dashboard')" class="flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl hover:bg-slate-900 border border-slate-800 transition-all shrink-0">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-md border border-cyan-400/40">
                            ${user.display_name ? user.display_name.charAt(0) : 'د'}
                        </div>
                        <span class="text-xs font-bold text-slate-200 max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline">${user.display_name}</span>
                    </button>

                    <!-- Logout Button -->
                    <button onclick="logout()" class="hidden sm:inline-flex p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-xl hover:bg-slate-900" title="خروج از حساب">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                    </button>
                    ` : `
                    <!-- Guest Actions -->
                    <button onclick="openAuthModal('login')" class="text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-slate-900 transition-colors">
                        ورود
                    </button>
                    <button onclick="openAuthModal('register')" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition-all">
                        عضویت
                    </button>
                    `}

                    <!-- Hamburger Button for Small Screens -->
                    <button type="button" onclick="window.toggleMobileDrawer()" class="p-2 rounded-xl text-slate-300 hover:bg-slate-900 border border-slate-800 lg:hidden shrink-0" title="منوی امکانات">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile/Tablet Holographic Slide-Down Menu Drawer -->
        <div id="mobile-nav-drawer" class="hidden lg:hidden border-t border-cyan-500/20 bg-slate-950/98 px-4 py-4 space-y-4 shadow-2xl backdrop-blur-2xl">
            <!-- Android APK Download Banner -->
            <a href="/downloads/physics-society.apk" 
               download="PhysicsSociety-SAMPAD.apk"
               target="_blank" 
               rel="noopener noreferrer"
               class="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
                <span class="flex items-center gap-2">
                    <i data-lucide="smartphone" class="w-4 h-4 text-cyan-200"></i>
                    <span>دانلود مستقیم اپلیکیشن اختصاصی اندروید (APK)</span>
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">v4.2</span>
            </a>

            ${user ? `
            <!-- User Status Card -->
            <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-black flex items-center justify-center text-sm shadow-md border border-cyan-400/40">
                    ${user.display_name ? user.display_name.charAt(0) : 'د'}
                </div>
                <div class="min-w-0 flex-1">
                    <span class="block font-bold text-white text-xs truncate">${user.display_name}</span>
                    <span class="text-[10px] text-cyan-400 font-mono">${user.grade_title_fa || 'دانش‌آموز'} • سطح ${user.current_level || 1} • ${user.total_xp || 0} XP</span>
                </div>
                <button onclick="logout()" class="text-[11px] text-rose-400 hover:text-rose-300 px-3 py-1 rounded-xl bg-rose-950/50 border border-rose-800/40 font-bold">
                    خروج
                </button>
            </div>
            ` : ''}

            <!-- Grid Menu Links -->
            <div class="grid grid-cols-2 gap-2 text-xs font-bold">
                <button onclick="window.store.setView('curriculum'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-cyan-300">
                    <i data-lucide="book-open" class="w-4 h-4 text-cyan-400"></i>
                    <span>سرفصل‌های فیزیک</span>
                </button>
                <button onclick="window.store.setView('materials'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-emerald-300">
                    <i data-lucide="file-text" class="w-4 h-4 text-emerald-400"></i>
                    <span>درسنامه‌ها و جزوات</span>
                </button>
                <button onclick="window.store.setView('simulators'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-teal-300">
                    <i data-lucide="box" class="w-4 h-4 text-teal-400"></i>
                    <span>آزمایشگاه PhET</span>
                </button>
                <button onclick="window.store.setView('sensor-lab'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-blue-300">
                    <i data-lucide="smartphone" class="w-4 h-4 text-blue-400"></i>
                    <span>آزمایشگاه سنسورها</span>
                </button>
                <button onclick="window.store.setView('duel'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-cyan-300">
                    <i data-lucide="zap" class="w-4 h-4 text-cyan-400"></i>
                    <span>دوئل ۱ به ۱ کوانتومی</span>
                </button>
                <button onclick="window.store.setView('guilds'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-amber-300">
                    <i data-lucide="shield" class="w-4 h-4 text-amber-400"></i>
                    <span>خاندان‌های سمپاد</span>
                </button>
                <button onclick="window.store.setView('adaptive-exam'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-emerald-300">
                    <i data-lucide="target" class="w-4 h-4 text-emerald-400"></i>
                    <span>آزمون تطبیقی (CAT)</span>
                </button>
                <button onclick="window.store.setView('competitions'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-amber-300">
                    <i data-lucide="trophy" class="w-4 h-4 text-amber-400"></i>
                    <span>لیگ‌ها و امتیازات</span>
                </button>
                <button onclick="window.store.setView('data-logger'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-teal-300">
                    <i data-lucide="line-chart" class="w-4 h-4 text-teal-400"></i>
                    <span>برازش خطی و نمودار</span>
                </button>
                <button onclick="window.store.setView('handwriting-grader'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-violet-300">
                    <i data-lucide="scan-text" class="w-4 h-4 text-violet-400"></i>
                    <span>تصحیح دست‌نوشته AI</span>
                </button>
                <button onclick="window.store.setView('live-lab'); window.toggleMobileDrawer(false)" class="p-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 text-right flex items-center gap-2.5 text-rose-300 border border-rose-500/30 col-span-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <i data-lucide="video" class="w-4 h-4 text-rose-400"></i>
                    <span>ورود به آزمایشگاه و کلاس زنده دبیر (Live Classroom)</span>
                </button>
                <button onclick="window.store.setView('teacher-heatmap'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-amber-300 col-span-2">
                    <i data-lucide="flame" class="w-4 h-4 text-amber-400"></i>
                    <span>ماتریس تشخیصی کج‌فهمی‌های فیزیک دبیران</span>
                </button>
                <button onclick="window.store.setView('printable-exam'); window.toggleMobileDrawer(false)" class="p-3 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-teal-300 col-span-2">
                    <i data-lucide="printer" class="w-4 h-4 text-teal-400"></i>
                    <span>آزمون‌ساز استاندارد چاپی A4 سمپاد</span>
                </button>
            </div>

            ${user && user.role === 'admin' ? `
            <button onclick="window.store.setView('admin'); window.toggleMobileDrawer(false)" class="w-full p-3 rounded-2xl bg-rose-950/50 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
                <span class="flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-rose-400"></i>
                    <span>ورود به پنل جامع مدیریت آموزشی سمپاد</span>
                </span>
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            ` : ''}
        </div>
    </header>

    <!-- Mobile Persistent Bottom Navigation Dock (Quantum Obsidian HUD) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-cyan-500/20 backdrop-blur-2xl flex items-center justify-around py-2 px-1 shadow-[0_-4px_30px_rgba(0,0,0,0.8)]">
        <button onclick="window.store.setView('curriculum')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('curriculum') ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}">
            <i data-lucide="book-open" class="w-4 h-4 mb-0.5 ${isTabActive('curriculum') ? 'text-cyan-400' : ''}"></i>
            <span class="text-[10px]">آموزش</span>
        </button>

        <button onclick="window.store.setView('duel')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('duel') ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}">
            <i data-lucide="swords" class="w-4 h-4 mb-0.5 ${isTabActive('duel') ? 'text-amber-400' : ''}"></i>
            <span class="text-[10px]">دوئل</span>
        </button>

        <!-- Floating Quantum Center AI Button -->
        <button onclick="window.toggleAiTutorModal(true)" class="relative -top-3 flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 text-white shadow-xl shadow-cyan-500/40 border border-cyan-300/40 hover:scale-105 active:scale-95 transition-all">
            <i data-lucide="bot" class="w-5 h-5"></i>
            <span class="text-[8px] font-black mt-0.5">نکسورا</span>
        </button>

        <button onclick="window.store.setView('sensor-lab')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('sensor-lab') ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'}">
            <i data-lucide="smartphone" class="w-4 h-4 mb-0.5 ${isTabActive('sensor-lab') ? 'text-blue-400' : ''}"></i>
            <span class="text-[10px]">سنسور</span>
        </button>

        <button onclick="window.store.currentUser ? window.store.setView('dashboard') : openAuthModal('login')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('dashboard') ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}">
            <i data-lucide="user" class="w-4 h-4 mb-0.5 ${isTabActive('dashboard') ? 'text-emerald-400' : ''}"></i>
            <span class="text-[10px]">پروفایل</span>
        </button>
    </nav>
    `;
}

window.renderNavbar = renderNavbar;
window.toggleMobileDrawer = toggleMobileDrawer;
window.toggleNavDropdown = toggleNavDropdown;
window.closeAllDropdowns = closeAllDropdowns;
