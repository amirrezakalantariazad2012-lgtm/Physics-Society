/**
 * QUANTUM CUT — Responsive RTL Navbar & Mobile Dock Component
 * Fully adaptive across Mobile, Tablet, Laptop & Desktop.
 * Prevents horizontal overflow, supports Light/Dark theme, and clean SAMPAD branding.
 */

let isMobileDrawerOpen = false;

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

function renderNavbar() {
    const user = window.store ? window.store.currentUser : null;
    const isDark = window.store ? window.store.theme === 'dark' : false;
    const rawView = window.store ? window.store.currentView : 'dashboard';
    const currentView = typeof rawView === 'string' ? rawView : (rawView?.name || 'dashboard');

    const isTabActive = (tabName) => currentView === tabName;

    return `
    <header class="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors shadow-sm">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
            <div class="flex items-center justify-between h-14 sm:h-16 gap-2 w-full">
                <!-- Brand / Logo -->
                <div class="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0 min-w-0" onclick="window.store.setView('landing')">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
                        <i data-lucide="atom" class="w-5 h-5 text-cyan-200"></i>
                    </div>
                    <div class="flex flex-col text-right min-w-0">
                        <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-none">انجمن فیزیک شهید بهشتی دو</span>
                        <span class="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono hidden xl:block truncate">SAMPAD PHYSICS SOCIETY • ROUND 1</span>
                    </div>
                </div>

                <!-- Nav Links for Desktop (XL Screens: All 7 tabs) -->
                <nav class="hidden xl:flex items-center gap-1 text-xs font-medium shrink-0">
                    <a href="#curriculum" onclick="window.store.setView('curriculum')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('curriculum') ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/80 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'}">
                        <i data-lucide="book-open" class="w-3.5 h-3.5 ${isTabActive('curriculum') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}"></i>
                        <span>آموزش فیزیک</span>
                    </a>
                    <a href="#materials" onclick="window.store.setView('materials')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('materials') ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/80 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'}">
                        <i data-lucide="file-text" class="w-3.5 h-3.5 ${isTabActive('materials') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}"></i>
                        <span>درسنامه‌ها</span>
                    </a>
                    <a href="#simulators" onclick="window.store.setView('simulators')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('simulators') ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800/80 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'}">
                        <i data-lucide="flask-conical" class="w-3.5 h-3.5 ${isTabActive('simulators') ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}"></i>
                        <span>آزمایشگاه PhET</span>
                    </a>
                    <a href="#live-lab" onclick="window.store.setView('live-lab')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${isTabActive('live-lab') ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800/80 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'}">
                        <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <i data-lucide="radio" class="w-3.5 h-3.5 ${isTabActive('live-lab') ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}"></i>
                        <span>کلاس زنده دبیر</span>
                    </a>
                    <a href="#competitions" onclick="window.store.setView('competitions')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('competitions') ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800/80 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'}">
                        <i data-lucide="trophy" class="w-3.5 h-3.5 ${isTabActive('competitions') ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}"></i>
                        <span>لیگ‌ها</span>
                    </a>
                    <a href="#leaderboards" onclick="window.store.setView('leaderboards')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('leaderboards') ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/80 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'}">
                        <i data-lucide="award" class="w-3.5 h-3.5 ${isTabActive('leaderboards') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}"></i>
                        <span>امتیازات</span>
                    </a>
                    <a href="#badges" onclick="window.store.setView('badges')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('badges') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'}">
                        <i data-lucide="medal" class="w-3.5 h-3.5 ${isTabActive('badges') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}"></i>
                        <span>مدال‌ها</span>
                    </a>
                    ${user && user.role === 'admin' ? `
                    <a href="#admin" onclick="window.store.setView('admin')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('admin') ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800/80 shadow-sm' : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-200 dark:hover:bg-rose-950/40'}">
                        <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-rose-500"></i>
                        <span>مدیریت</span>
                    </a>
                    ` : ''}
                </nav>

                <!-- Nav Links for Medium Screens (LG screens: Core 4 tabs + More button) -->
                <nav class="hidden lg:flex xl:hidden items-center gap-1 text-xs font-medium shrink-0">
                    <a href="#curriculum" onclick="window.store.setView('curriculum')" class="flex items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${isTabActive('curriculum') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}">
                        <span>آموزش</span>
                    </a>
                    <a href="#simulators" onclick="window.store.setView('simulators')" class="flex items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${isTabActive('simulators') ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}">
                        <span>آزمایشگاه</span>
                    </a>
                    <a href="#live-lab" onclick="window.store.setView('live-lab')" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('live-lab') ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        <span>کلاس زنده</span>
                    </a>
                    <a href="#competitions" onclick="window.store.setView('competitions')" class="flex items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${isTabActive('competitions') ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}">
                        <span>مسابقات</span>
                    </a>
                    ${user && user.role === 'admin' ? `
                    <a href="#admin" onclick="window.store.setView('admin')" class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all ${isTabActive('admin') ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'text-rose-600 hover:bg-rose-50 font-bold'}">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-rose-500"></i>
                        <span>مدیریت</span>
                    </a>
                    ` : ''}
                    <button type="button" onclick="window.toggleMobileDrawer()" class="flex items-center gap-1 px-2 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold">
                        <span>بیشتر</span>
                        <i data-lucide="chevron-down" class="w-3 h-3"></i>
                    </button>
                </nav>

                <!-- User Stats & Actions -->
                <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <!-- Theme Toggle -->
                    <button onclick="window.store.toggleTheme()" class="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors" title="تغییر تم">
                        <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 sm:w-5 h-4 sm:h-5"></i>
                    </button>

                    ${user ? `
                    <!-- Desktop Streak & XP (Only on wide screens) -->
                    <div class="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-900" title="استمرار روزانه">
                        <i data-lucide="flame" class="w-3.5 h-3.5 text-orange-500 fill-orange-500"></i>
                        <span>${user.current_streak || 0} روز</span>
                    </div>

                    <div class="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900" title="امتیاز تجربه (XP)">
                        <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500 fill-amber-500"></i>
                        <span>${user.total_xp || 0}</span>
                    </div>

                    <!-- User Profile Button -->
                    <button onclick="window.store.setView('dashboard')" class="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            ${user.display_name ? user.display_name.charAt(0) : 'د'}
                        </div>
                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline">${user.display_name}</span>
                    </button>

                    <!-- Desktop Logout Button -->
                    <button onclick="logout()" class="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="خروج از حساب">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                    </button>
                    ` : `
                    <!-- Guest Actions -->
                    <button onclick="openAuthModal('login')" class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-500 px-2 py-1.5 rounded-lg">
                        ورود
                    </button>
                    <button onclick="openAuthModal('register')" class="btn-duo-green text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                        عضویت
                    </button>
                    `}

                    <!-- Mobile/Tablet Hamburger Button (Visible on screens < lg) -->
                    <button type="button" onclick="window.toggleMobileDrawer()" class="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden shrink-0" title="منوی امکانات">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile/Tablet Slide-Down Drawer Menu -->
        <div id="mobile-nav-drawer" class="hidden lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-4 py-4 space-y-3 shadow-xl">
            <a href="/downloads/physics-society.apk" 
               download="PhysicsSociety-SAMPAD.apk"
               target="_blank" 
               rel="noopener noreferrer"
               class="w-full p-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-md">
                <span class="flex items-center gap-2">
                    <i data-lucide="smartphone" class="w-4 h-4"></i>
                    <span>دانلود مستقیم اپلیکیشن اندروید (APK)</span>
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">v2.2</span>
            </a>

            ${user ? `
            <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    ${user.display_name ? user.display_name.charAt(0) : 'د'}
                </div>
                <div class="min-w-0 flex-1">
                    <span class="block font-bold text-slate-800 dark:text-white text-xs truncate">${user.display_name}</span>
                    <span class="text-[10px] text-slate-500 dark:text-slate-400">${user.grade_title_fa || 'دانش‌آموز'} • سطح ${user.current_level || 1} • ${user.total_xp || 0} XP</span>
                </div>
                <button onclick="logout()" class="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/40 font-bold">
                    خروج
                </button>
            </div>
            ` : ''}

            <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button onclick="window.store.setView('curriculum'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 text-slate-800 dark:text-cyan-300">
                    <i data-lucide="book-open" class="w-4 h-4 text-blue-600"></i>
                    <span>سرفصل‌های فیزیک</span>
                </button>
                <button onclick="window.store.setView('materials'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 text-slate-800 dark:text-emerald-300">
                    <i data-lucide="file-text" class="w-4 h-4 text-emerald-600"></i>
                    <span>درسنامه‌ها و جزوات</span>
                </button>
                <button onclick="window.store.setView('simulators'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 text-slate-800 dark:text-teal-300">
                    <i data-lucide="flask-conical" class="w-4 h-4 text-teal-600"></i>
                    <span>آزمایشگاه PhET</span>
                </button>
                <button onclick="window.store.setView('competitions'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 text-slate-800 dark:text-amber-300">
                    <i data-lucide="trophy" class="w-4 h-4 text-amber-600"></i>
                    <span>لیگ‌ها و مسابقات</span>
                </button>
                <button onclick="window.store.setView('live-lab'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-right flex items-center gap-2 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold col-span-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <i data-lucide="radio" class="w-4 h-4 text-rose-600"></i>
                    <span>ورود به آزمایشگاه زنده دبیر (Live Classroom)</span>
                </button>
                <button onclick="window.store.setView('leaderboards'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 text-slate-800 dark:text-indigo-300">
                    <i data-lucide="award" class="w-4 h-4 text-indigo-600"></i>
                    <span>جدول امتیازات</span>
                </button>
                <button onclick="window.store.setView('badges'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right flex items-center gap-2 text-slate-800 dark:text-emerald-300">
                    <i data-lucide="medal" class="w-4 h-4 text-emerald-600"></i>
                    <span>نشان‌ها و مدال‌ها</span>
                </button>
            </div>

            ${user && user.role === 'admin' ? `
            <button onclick="window.store.setView('admin'); window.toggleMobileDrawer(false)" class="w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-between">
                <span class="flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-rose-600"></i>
                    <span>ورود به پنل جامع مدیریت آموزشی</span>
                </span>
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            ` : ''}

            <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <a href="/api/docs" target="_blank" class="hover:text-blue-600">مستندات سرور API</a>
                <span>انجمن فیزیک شهید بهشتی دو</span>
            </div>
        </div>
    </header>

    <!-- Mobile Persistent Bottom Navigation Dock (App Bar) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl flex items-center justify-around py-1.5 px-1 shadow-2xl">
        <button onclick="window.store.setView('curriculum')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('curriculum') ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}">
            <i data-lucide="book-open" class="w-4 h-4 mb-0.5 ${isTabActive('curriculum') ? 'text-blue-600 dark:text-cyan-400' : ''}"></i>
            <span class="text-[10px]">فیزیک</span>
        </button>

        <button onclick="window.store.setView('competitions')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('competitions') ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}">
            <i data-lucide="trophy" class="w-4 h-4 mb-0.5 ${isTabActive('competitions') ? 'text-amber-600 dark:text-amber-400' : ''}"></i>
            <span class="text-[10px]">لیگ‌ها</span>
        </button>

        <button onclick="window.toggleAiTutorModal(true)" class="relative -top-2 flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">
            <i data-lucide="bot" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold">هوش‌مصنوعی</span>
        </button>

        <button onclick="window.store.setView('leaderboards')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('leaderboards') ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}">
            <i data-lucide="award" class="w-4 h-4 mb-0.5 ${isTabActive('leaderboards') ? 'text-indigo-600 dark:text-indigo-400' : ''}"></i>
            <span class="text-[10px]">رتبه‌ها</span>
        </button>

        <button onclick="window.store.currentUser ? window.store.setView('dashboard') : openAuthModal('login')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('dashboard') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}">
            <i data-lucide="user" class="w-4 h-4 mb-0.5 ${isTabActive('dashboard') ? 'text-emerald-600 dark:text-emerald-400' : ''}"></i>
            <span class="text-[10px]">پروفایل</span>
        </button>
    </nav>
    `;
}

window.renderNavbar = renderNavbar;
window.toggleMobileDrawer = toggleMobileDrawer;
