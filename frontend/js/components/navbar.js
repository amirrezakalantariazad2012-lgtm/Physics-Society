/**
 * QUANTUM CUT — Responsive RTL Navbar & Mobile Dock Component
 * Supports: Desktop Navbar, Mobile Adaptive Header, Slide-down Drawer, and Mobile Bottom Navigation Dock.
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
    const user = window.store.currentUser;
    const isDark = window.store.theme === 'dark';
    const currentView = window.store.currentView?.name || 'dashboard';

    const isTabActive = (tabName) => currentView === tabName;

    return `
    <header class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-14 sm:h-16">
                <!-- Brand / Logo -->
                <div class="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onclick="window.store.setView('landing')">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                        <i data-lucide="atom" class="w-5 h-5 text-cyan-200"></i>
                    </div>
                    <div class="flex flex-col text-right">
                        <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight">انجمن فیزیک شهید بهشتی دو دوره اول</span>
                        <span class="text-[9px] text-cyan-400 font-mono hidden sm:block">SAMPAD PHYSICS SOCIETY • ROUND 1</span>
                    </div>
                </div>

                <!-- Nav Links for Desktop -->
                <nav class="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                    <a href="#curriculum" onclick="window.store.setView('curriculum')" class="transition-colors flex items-center gap-1.5 ${isTabActive('curriculum') ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400'}">
                        <i data-lucide="book-open" class="w-4 h-4 text-cyan-400"></i>
                        <span>آموزش فیزیک</span>
                    </a>
                    <a href="#simulators" onclick="window.store.setView('simulators')" class="transition-colors flex items-center gap-1.5 ${isTabActive('simulators') ? 'text-teal-400 font-bold' : 'hover:text-teal-400'}">
                        <i data-lucide="flask-conical" class="w-4 h-4 text-teal-400"></i>
                        <span>آزمایشگاه فیزیک</span>
                    </a>
                    <a href="#competitions" onclick="window.store.setView('competitions')" class="transition-colors flex items-center gap-1.5 ${isTabActive('competitions') ? 'text-amber-400 font-bold' : 'hover:text-amber-400'}">
                        <i data-lucide="trophy" class="w-4 h-4 text-amber-400"></i>
                        <span>لیگ‌ها و مسابقات</span>
                    </a>
                    <a href="#leaderboards" onclick="window.store.setView('leaderboards')" class="transition-colors flex items-center gap-1.5 ${isTabActive('leaderboards') ? 'text-indigo-400 font-bold' : 'hover:text-indigo-400'}">
                        <i data-lucide="award" class="w-4 h-4 text-indigo-400"></i>
                        <span>جدول امتیازات</span>
                    </a>
                    <a href="#badges" onclick="window.store.setView('badges')" class="transition-colors flex items-center gap-1.5 ${isTabActive('badges') ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}">
                        <i data-lucide="medal" class="w-4 h-4 text-emerald-400"></i>
                        <span>مدال‌ها</span>
                    </a>
                    ${user && user.role === 'admin' ? `
                    <a href="#admin" onclick="window.store.setView('admin')" class="text-rose-500 font-bold hover:underline flex items-center gap-1.5">
                        <i data-lucide="shield-alert" class="w-4 h-4"></i>
                        <span>پنل مدیریت</span>
                    </a>
                    ` : ''}
                </nav>

                <!-- User Stats & Actions -->
                <div class="flex items-center gap-1.5 sm:gap-3">
                    <!-- Theme Toggle -->
                    <button onclick="window.store.toggleTheme()" class="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors" title="تغییر تم">
                        <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 sm:w-5 h-4 sm:h-5"></i>
                    </button>

                    ${user ? `
                    <!-- Compact Mobile Stats Pill -->
                    <div class="flex sm:hidden items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono font-bold text-amber-300">
                        <span class="flex items-center gap-0.5 text-orange-400">
                            <i data-lucide="flame" class="w-3.5 h-3.5 fill-orange-400"></i>
                            <span>${user.current_streak || 0}</span>
                        </span>
                        <span class="text-slate-500">•</span>
                        <span class="flex items-center gap-0.5 text-amber-300">
                            <i data-lucide="zap" class="w-3.5 h-3.5 fill-amber-300"></i>
                            <span>${user.total_xp || 0}</span>
                        </span>
                    </div>

                    <!-- Desktop Streak & XP -->
                    <div class="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-900" title="استمرار روزانه">
                        <i data-lucide="flame" class="w-4 h-4 text-orange-500 streak-flame-active fill-orange-500"></i>
                        <span>${user.current_streak || 0} روز</span>
                    </div>

                    <div class="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900" title="امتیاز تجربه (XP)">
                        <i data-lucide="zap" class="w-4 h-4 text-amber-500 fill-amber-500"></i>
                        <span>${user.total_xp || 0} XP</span>
                    </div>

                    <!-- User Menu Button -->
                    <button onclick="window.store.setView('dashboard')" class="hidden sm:flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            ${user.display_name ? user.display_name.charAt(0) : 'د'}
                        </div>
                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">${user.display_name}</span>
                    </button>

                    <!-- Mobile Menu Hamburger Button -->
                    <button type="button" onclick="window.toggleMobileDrawer()" class="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors md:hidden" title="منوی امکانات">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </button>

                    <!-- Desktop Logout Button -->
                    <button onclick="logout()" class="hidden md:inline-flex p-2 text-slate-400 hover:text-rose-500 transition-colors" title="خروج از حساب">
                        <i data-lucide="log-out" class="w-5 h-5"></i>
                    </button>
                    ` : `
                    <!-- Guest Actions -->
                    <button onclick="openAuthModal('login')" class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-400 px-2.5 py-1.5">
                        ورود
                    </button>
                    <button onclick="openAuthModal('register')" class="btn-duo-green text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-sm">
                        عضویت
                    </button>
                    <button type="button" onclick="window.toggleMobileDrawer()" class="p-1.5 rounded-xl text-slate-400 hover:text-white md:hidden">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </button>
                    `}
                </div>
            </div>
        </div>

        <!-- Mobile Slide-Down Drawer Menu -->
        <div id="mobile-nav-drawer" class="hidden md:hidden border-t border-slate-800 bg-slate-900/98 px-4 py-5 space-y-4 shadow-2xl">
            ${user ? `
            <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    ${user.display_name ? user.display_name.charAt(0) : 'د'}
                </div>
                <div class="min-w-0 flex-1">
                    <span class="block font-bold text-white text-xs truncate">${user.display_name}</span>
                    <span class="text-[10px] text-slate-400">${user.grade_title_fa || 'دانش‌آموز'} • سطح ${user.current_level || 1}</span>
                </div>
                <button onclick="logout()" class="text-[11px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg bg-rose-950/60 border border-rose-800/40">
                    خروج
                </button>
            </div>
            ` : ''}

            <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button onclick="window.store.setView('curriculum'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-right flex items-center gap-2 text-cyan-300">
                    <i data-lucide="book-open" class="w-4 h-4"></i>
                    <span>سرفصل‌های فیزیک</span>
                </button>
                <button onclick="window.store.setView('simulators'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-right flex items-center gap-2 text-teal-300">
                    <i data-lucide="flask-conical" class="w-4 h-4"></i>
                    <span>آزمایشگاه فیزیک</span>
                </button>
                <button onclick="window.store.setView('competitions'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-right flex items-center gap-2 text-amber-300">
                    <i data-lucide="trophy" class="w-4 h-4"></i>
                    <span>لیگ‌ها و مسابقات</span>
                </button>
                <button onclick="window.store.setView('leaderboards'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-right flex items-center gap-2 text-indigo-300">
                    <i data-lucide="award" class="w-4 h-4"></i>
                    <span>جدول امتیازات</span>
                </button>
                <button onclick="window.store.setView('badges'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-right flex items-center gap-2 text-emerald-300">
                    <i data-lucide="medal" class="w-4 h-4"></i>
                    <span>نشان‌ها و مدال‌ها</span>
                </button>
            </div>

            ${user && user.role === 'admin' ? `
            <button onclick="window.store.setView('admin'); window.toggleMobileDrawer(false)" class="w-full p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
                <span class="flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-rose-400"></i>
                    <span>ورود به پنل جامع مدیریت آموزشی</span>
                </span>
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            ` : ''}

            <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <a href="/api/docs" target="_blank" class="hover:text-cyan-400">مستندات سرور API</a>
                <span>انجمن فیزیک شهید بهشتی دو</span>
            </div>
        </div>
    </header>

    <!-- Mobile Persistent Bottom Navigation Dock (App Bar) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl flex items-center justify-around py-1.5 px-1 shadow-2xl">
        <button onclick="window.store.setView('curriculum')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('curriculum') ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}">
            <i data-lucide="book-open" class="w-4 h-4 mb-0.5 ${isTabActive('curriculum') ? 'text-cyan-400' : ''}"></i>
            <span class="text-[10px]">فیزیک</span>
        </button>

        <button onclick="window.store.setView('competitions')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('competitions') ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}">
            <i data-lucide="trophy" class="w-4 h-4 mb-0.5 ${isTabActive('competitions') ? 'text-amber-400' : ''}"></i>
            <span class="text-[10px]">لیگ‌ها</span>
        </button>

        <button onclick="window.toggleAiTutorModal(true)" class="relative -top-2 flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30 hover:scale-105 transition-all">
            <i data-lucide="bot" class="w-5 h-5"></i>
            <span class="text-[9px] font-bold">هوش‌مصنوعی</span>
        </button>

        <button onclick="window.store.setView('leaderboards')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('leaderboards') ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'}">
            <i data-lucide="award" class="w-4 h-4 mb-0.5 ${isTabActive('leaderboards') ? 'text-indigo-400' : ''}"></i>
            <span class="text-[10px]">رتبه‌ها</span>
        </button>

        <button onclick="window.store.currentUser ? window.store.setView('dashboard') : openAuthModal('login')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('dashboard') ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}">
            <i data-lucide="user" class="w-4 h-4 mb-0.5 ${isTabActive('dashboard') ? 'text-emerald-400' : ''}"></i>
            <span class="text-[10px]">پروفایل</span>
        </button>
    </nav>
    `;
}

window.renderNavbar = renderNavbar;
window.toggleMobileDrawer = toggleMobileDrawer;
