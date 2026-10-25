/**
 * Responsive RTL Navbar Component with Student Stats (Streak, XP, Level)
 */
function renderNavbar() {
    const user = window.store.currentUser;
    const isDark = window.store.theme === 'dark';

    return `
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Brand / Logo -->
                <div class="flex items-center gap-3 cursor-pointer" onclick="window.store.setView('landing')">
                    <img src="/assets/quantum-cut-logo.svg" alt="QUANTUM CUT" class="h-9 w-auto hidden sm:block">
                    <div class="flex items-center gap-2.5 sm:hidden">
                        <img src="/assets/favicon.svg" alt="QC" class="w-8 h-8">
                        <span class="font-black text-sm text-white tracking-widest font-sans">QUANTUM CUT</span>
                    </div>
                </div>

                <!-- Nav Links for Desktop -->
                <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <a href="#curriculum" onclick="window.store.setView('curriculum')" class="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                        <i data-lucide="book-open" class="w-4 h-4 text-cyan-400"></i>
                        <span>آموزش فیزیک</span>
                    </a>
                    <a href="#competitions" onclick="window.store.setView('competitions')" class="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                        <i data-lucide="trophy" class="w-4 h-4 text-amber-400"></i>
                        <span>لیگ‌ها و مسابقات</span>
                    </a>
                    <a href="#leaderboards" onclick="window.store.setView('leaderboards')" class="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                        <i data-lucide="award" class="w-4 h-4 text-indigo-400"></i>
                        <span>جدول امتیازات</span>
                    </a>
                    <a href="#badges" onclick="window.store.setView('badges')" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <i data-lucide="medal" class="w-4 h-4 text-emerald-400"></i>
                        <span>مدال‌ها</span>
                    </a>
                    ${user && user.role === 'admin' ? `
                    <a href="#admin" onclick="window.store.setView('admin')" class="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1.5">
                        <i data-lucide="shield-alert" class="w-4 h-4"></i>
                        <span>پنل مدیریت</span>
                    </a>
                    ` : ''}
                </nav>

                <!-- User Stats & Actions -->
                <div class="flex items-center gap-3">
                    <!-- Theme Toggle -->
                    <button onclick="window.store.toggleTheme()" class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors" title="تغییر تم">
                        <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                    </button>

                    ${user ? `
                    ${user.must_change_password ? `
                    <button onclick="window.openForcedPasswordModal()" class="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 animate-pulse" title="تغییر رمز عبور پیش‌فرض اجباری است">
                        <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span class="hidden sm:inline">تغییر رمز اجباری</span>
                    </button>
                    ` : ''}

                    <!-- Streak -->
                    <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-900" title="استمرار روزانه">
                        <i data-lucide="flame" class="w-4 h-4 text-orange-500 streak-flame-active fill-orange-500"></i>
                        <span>${user.current_streak || 0} روز</span>
                    </div>

                    <!-- XP -->
                    <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900" title="امتیاز تجربه (XP)">
                        <i data-lucide="zap" class="w-4 h-4 text-amber-500 fill-amber-500"></i>
                        <span>${user.total_xp || 0} XP</span>
                    </div>

                    <!-- User Menu Button -->
                    <div class="relative">
                        <button onclick="window.store.setView('dashboard')" class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                                ${user.display_name ? user.display_name.charAt(0) : 'د'}
                            </div>
                            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">${user.display_name}</span>
                        </button>
                    </div>

                    <!-- Logout Button -->
                    <button onclick="logout()" class="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="خروج از حساب">
                        <i data-lucide="log-out" class="w-5 h-5"></i>
                    </button>
                    ` : `
                    <!-- Login / Register Buttons -->
                    <button onclick="openAuthModal('login')" class="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 px-3 py-1.5">
                        ورود
                    </button>
                    <button onclick="openAuthModal('register')" class="btn-duo-green text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                        عضویت دانش‌آموز
                    </button>
                    `}
                </div>
            </div>
        </div>
    </header>
    `;
}

window.renderNavbar = renderNavbar;
