/**
 * QUANTUM CUT — Futuristic Scientific Desktop Shell & Navigation Suite
 * Features:
 *  - Fixed Scientific Desktop Sidebar with categorized tools and telemetry
 *  - High-Tech HUD Top Bar with active breadcrumb, status and quick actions
 *  - Mobile Slide-out Drawer & Bottom Dock
 *  - Zero regressions: preserves all auth, view change, and modal triggers
 */

let isMobileDrawerOpen = false;
let isDesktopSidebarCollapsed = false;

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

function toggleDesktopSidebar() {
    isDesktopSidebarCollapsed = !isDesktopSidebarCollapsed;
    const sidebar = document.getElementById('quantum-desktop-sidebar');
    const mainContent = document.getElementById('app-main-content');
    const topBar = document.getElementById('quantum-desktop-topbar');
    
    if (sidebar) {
        if (isDesktopSidebarCollapsed) {
            sidebar.classList.add('collapsed');
            sidebar.style.width = '5rem';
        } else {
            sidebar.classList.remove('collapsed');
            sidebar.style.width = '16rem';
        }
    }
    if (mainContent) {
        mainContent.style.marginRight = isDesktopSidebarCollapsed ? '5rem' : '16rem';
    }
    if (topBar) {
        topBar.style.marginRight = isDesktopSidebarCollapsed ? '5rem' : '16rem';
    }
}

function getViewMetadata(viewName) {
    const map = {
        'landing': { title: 'پرتال مرکزی QUANTUM CUT', category: 'صفحه اصلی' },
        'dashboard': { title: 'میز کار پژوهشی دانش‌آموز', category: 'فضای شخصی' },
        'curriculum': { title: 'سرفصل‌ها و درسنامه‌های فیزیک', category: 'آموزش تخصصی' },
        'materials': { title: 'بانک جزوات، خلاصه‌درس و فرمول‌ها', category: 'منابع آموزشی' },
        'chapter': { title: 'نقشه یادگیری فصل و مباحث', category: 'سرفصل' },
        'lesson': { title: 'درسنامه تعاملی و تمرین مفهومی', category: 'آموزش گام‌به‌گام' },
        'exam': { title: 'تالار سنجش، تمرین و آزمون', category: 'سنجش علمی' },
        'competitions': { title: 'لیگ‌های المپیاد و مسابقات هفتگی', category: 'مسابقات کوانتوم' },
        'leaderboards': { title: 'جدول رده‌بندی و افتخارات کشوری', category: 'لیدربورد' },
        'badges': { title: 'مدال‌ها و نشان‌های پژوهشگری', category: 'گیمیفیکیشن' },
        'simulators': { title: 'آزمایشگاه‌های تعاملی مجازی PhET', category: 'شبیه‌سازها' },
        'live-lab': { title: 'کلاس پخش زنده آزمایشگاهی دبیر', category: 'آزمایشگاه زنده' },
        'admin': { title: 'مرکز کنترل و مدیریت آموزشگاه', category: 'پنل مدیریت' },
    };
    return map[viewName] || { title: 'سامانه انجمن فیزیک سمپاد', category: 'QUANTUM CUT' };
}

function renderNavbar() {
    const user = window.store ? window.store.currentUser : null;
    const isDark = window.store ? window.store.theme === 'dark' : true;
    const rawView = window.store ? window.store.currentView : 'dashboard';
    const currentView = typeof rawView === 'string' ? rawView : (rawView?.name || 'dashboard');
    const isLanding = currentView === 'landing';
    const meta = getViewMetadata(currentView);

    const isTabActive = (tabName) => currentView === tabName;

    // Helper to generate a desktop sidebar navigation link
    const renderSidebarLink = (id, label, iconName, badge = null, customClass = '') => `
        <a href="#${id}" onclick="window.store.setView('${id}')" 
           class="sidebar-link ${isTabActive(id) ? 'active' : ''} ${customClass}">
            <i data-lucide="${iconName}" class="w-4 h-4 shrink-0 ${isTabActive(id) ? 'text-cyan-400' : 'text-slate-400'}"></i>
            <span class="truncate text-xs font-semibold flex-1">${label}</span>
            ${badge ? badge : ''}
        </a>
    `;

    return `
    <!-- =========================================================================
         1. FIXED SCIENTIFIC DESKTOP SIDEBAR (Visible on Desktop lg and above)
         ========================================================================= -->
    <aside id="quantum-desktop-sidebar" class="desktop-sidebar hidden lg:flex select-none">
        <!-- Sidebar Header: Logo & Branding -->
        <div class="p-4 border-b border-cyan-500/15">
            <div class="flex items-center gap-3 cursor-pointer group" onclick="window.store.setView('landing')">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all shrink-0">
                    <div class="w-full h-full rounded-[15px] bg-slate-950/90 flex items-center justify-center">
                        <i data-lucide="atom" class="w-5 h-5 text-cyan-300 group-hover:rotate-45 transition-transform duration-500"></i>
                    </div>
                </div>
                <div class="flex flex-col min-w-0">
                    <div class="flex items-center gap-1.5">
                        <span class="font-black text-sm text-white tracking-wider font-mono">QUANTUM CUT</span>
                        <span class="text-[9px] px-1.5 py-0.2 rounded-md bg-cyan-500/15 text-cyan-300 font-mono border border-cyan-400/30">v2.2</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium truncate">فیزیک استعدادهای درخشان ۲</span>
                </div>
            </div>
        </div>

        <!-- Navigation Scrollable Area -->
        <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
            
            <!-- Group: Academy & Learning -->
            <div class="space-y-1">
                <div class="px-2 pb-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono tracking-wider flex items-center justify-between">
                    <span>آموزش و آزمایشگاه</span>
                    <i data-lucide="graduation-cap" class="w-3 h-3 text-cyan-500/60"></i>
                </div>
                ${renderSidebarLink('curriculum', 'سرفصل‌های فیزیک', 'book-open')}
                ${renderSidebarLink('materials', 'درسنامه‌ها و جزوات', 'file-text')}
                ${renderSidebarLink('simulators', 'آزمایشگاه PhET', 'flask-conical', '<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono">29</span>')}
                ${renderSidebarLink('live-lab', 'کلاس زنده دبیر', 'radio', '<span class="flex h-2 w-2 relative shrink-0"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>', 'text-rose-400 hover:text-rose-300')}
            </div>

            <!-- Group: Assessment & Competitions -->
            <div class="space-y-1">
                <div class="px-2 pb-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono tracking-wider flex items-center justify-between">
                    <span>لیگ‌ها و سنجش</span>
                    <i data-lucide="sparkles" class="w-3 h-3 text-amber-500/60"></i>
                </div>
                ${renderSidebarLink('competitions', 'مسابقات و لیگ‌ها', 'trophy', '<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 font-mono">زنده</span>')}
                ${renderSidebarLink('leaderboards', 'جدول رتبه‌بندی', 'award')}
                ${renderSidebarLink('badges', 'نشان‌ها و دستاوردها', 'medal')}
            </div>

            <!-- Group: Workspace & Admin -->
            <div class="space-y-1">
                <div class="px-2 pb-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono tracking-wider flex items-center justify-between">
                    <span>فضای کاربری</span>
                    <i data-lucide="cpu" class="w-3 h-3 text-violet-500/60"></i>
                </div>
                ${user ? renderSidebarLink('dashboard', 'داشبورد دانش‌آموز', 'layout-dashboard') : ''}
                ${user && user.role === 'admin' ? renderSidebarLink('admin', 'پنل مدیریت جامع', 'shield-alert', '<span class="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-mono">ADMIN</span>', 'text-rose-400 hover:text-rose-300') : ''}
                ${!user ? `
                <button onclick="openAuthModal('login')" class="w-full sidebar-link text-cyan-400 hover:text-cyan-300">
                    <i data-lucide="log-in" class="w-4 h-4 text-cyan-400"></i>
                    <span class="text-xs font-semibold">ورود به حساب کاربری</span>
                </button>
                <button onclick="openAuthModal('register')" class="w-full sidebar-link text-emerald-400 hover:text-emerald-300">
                    <i data-lucide="user-plus" class="w-4 h-4 text-emerald-400"></i>
                    <span class="text-xs font-semibold">عضویت دانش‌پژوه</span>
                </button>
                ` : ''}
            </div>

        </div>

        <!-- Sidebar Footer: Telemetry & Profile Pod -->
        <div class="p-3 border-t border-cyan-500/15 bg-slate-950/60 space-y-2">
            <!-- Direct Android Download Pill -->
            <a href="/downloads/physics-society.apk" 
               download="PhysicsSociety-SAMPAD.apk"
               target="_blank" 
               rel="noopener noreferrer"
               class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 hover:from-cyan-900/80 hover:to-blue-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold flex items-center justify-between transition-all group">
                <span class="flex items-center gap-2">
                    <i data-lucide="smartphone" class="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform"></i>
                    <span class="text-[11px]">دانلود اپلیکیشن اندروید</span>
                </span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 font-mono">APK</span>
            </a>

            ${user ? `
            <!-- Authenticated User Card -->
            <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0 cursor-pointer" onclick="window.store.setView('dashboard')">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        ${user.display_name ? user.display_name.charAt(0) : 'د'}
                    </div>
                    <div class="flex flex-col min-w-0">
                        <span class="text-xs font-bold text-white truncate">${user.display_name}</span>
                        <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span class="text-amber-400 font-mono font-bold">${user.total_xp || 0} XP</span>
                            <span>•</span>
                            <span class="text-orange-400 font-mono">🔥 ${user.current_streak || 0}</span>
                        </div>
                    </div>
                </div>
                <button onclick="logout()" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors" title="خروج از حساب">
                    <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                </button>
            </div>
            ` : ''}
        </div>
    </aside>

    <!-- =========================================================================
         2. DESKTOP & MOBILE TOP BAR HUD
         ========================================================================= -->
    <header id="quantum-desktop-topbar" class="desktop-topbar w-full">
        <div class="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            
            <!-- Right Section: Breadcrumb & Mobile Logo -->
            <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                <!-- Mobile Logo (screens < lg) -->
                <div class="flex items-center gap-2 lg:hidden cursor-pointer shrink-0" onclick="window.store.setView('landing')">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
                        <i data-lucide="atom" class="w-4 h-4 text-cyan-200"></i>
                    </div>
                    <span class="font-black text-xs text-white tracking-wider font-mono">QUANTUM CUT</span>
                </div>

                <!-- Desktop Breadcrumb HUD -->
                <div class="hidden lg:flex items-center gap-2 text-xs">
                    <span class="text-slate-500 font-mono text-[11px]">${meta.category}</span>
                    <i data-lucide="chevron-left" class="w-3 h-3 text-slate-600"></i>
                    <h2 class="font-bold text-slate-200 text-xs">${meta.title}</h2>
                    <span class="mx-2 text-slate-700">|</span>
                    <span class="telemetry-chip">
                        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        QUANTUM NODE OK
                    </span>
                </div>
            </div>

            <!-- Left Section: Quick Tools & Actions -->
            <div class="flex items-center gap-2 shrink-0">
                
                <!-- Floating AI Tutor Trigger Button -->
                <button onclick="window.toggleAiTutorModal(true)" 
                        class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 via-blue-950 to-violet-950 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-cyan-500/20 transition-all hover:scale-[1.02]">
                    <i data-lucide="bot" class="w-4 h-4 text-cyan-400"></i>
                    <span class="hidden sm:inline">دستیار هوشمند نکسورا</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 font-mono border border-cyan-400/30">AI</span>
                </button>

                <!-- Theme Toggle -->
                <button onclick="window.store.toggleTheme()" 
                        class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors" 
                        title="تغییر حالت روز و شب">
                    <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 h-4"></i>
                </button>

                ${user ? `
                <!-- User Chip (Compact on mobile) -->
                <button onclick="window.store.setView('dashboard')" class="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-800/60 transition-colors">
                    <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold text-xs flex items-center justify-center">
                        ${user.display_name ? user.display_name.charAt(0) : 'د'}
                    </div>
                    <span class="text-xs font-bold text-slate-200 hidden md:inline truncate max-w-[100px]">${user.display_name}</span>
                </button>
                ` : `
                <!-- Guest Actions -->
                <button onclick="openAuthModal('login')" class="text-xs font-bold text-slate-300 hover:text-cyan-400 px-2.5 py-1.5 rounded-lg transition-colors">
                    ورود
                </button>
                <button onclick="openAuthModal('register')" class="btn-quantum-primary text-xs font-bold px-3 py-1.5 rounded-xl">
                    عضویت
                </button>
                `}

                <!-- Mobile Hamburger Button (< lg) -->
                <button type="button" onclick="window.toggleMobileDrawer()" 
                        class="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors lg:hidden shrink-0" 
                        title="منوی ناوبری">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>

            </div>

        </div>

        <!-- Mobile Drawer Container -->
        <div id="mobile-nav-drawer" class="hidden lg:hidden border-t border-cyan-500/20 bg-slate-950/98 px-4 py-4 space-y-3 shadow-2xl backdrop-blur-2xl">
            <a href="/downloads/physics-society.apk" 
               download="PhysicsSociety-SAMPAD.apk"
               target="_blank" 
               rel="noopener noreferrer"
               class="w-full p-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-cyan-600/30">
                <span class="flex items-center gap-2">
                    <i data-lucide="smartphone" class="w-4 h-4"></i>
                    <span>دانلود مستقیم اپلیکیشن اندروید (APK)</span>
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">v2.2</span>
            </a>

            ${user ? `
            <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    ${user.display_name ? user.display_name.charAt(0) : 'د'}
                </div>
                <div class="min-w-0 flex-1">
                    <span class="block font-bold text-white text-xs truncate">${user.display_name}</span>
                    <span class="text-[10px] text-slate-400">${user.grade_title_fa || 'دانش‌آموز'} • سطح ${user.current_level || 1} • ${user.total_xp || 0} XP</span>
                </div>
                <button onclick="logout()" class="text-[11px] text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/40 font-bold">
                    خروج
                </button>
            </div>
            ` : ''}

            <div class="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button onclick="window.store.setView('curriculum'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-cyan-300">
                    <i data-lucide="book-open" class="w-4 h-4 text-cyan-400"></i>
                    <span>سرفصل‌های فیزیک</span>
                </button>
                <button onclick="window.store.setView('materials'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-emerald-300">
                    <i data-lucide="file-text" class="w-4 h-4 text-emerald-400"></i>
                    <span>درسنامه‌ها و جزوات</span>
                </button>
                <button onclick="window.store.setView('simulators'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-teal-300">
                    <i data-lucide="flask-conical" class="w-4 h-4 text-teal-400"></i>
                    <span>آزمایشگاه PhET</span>
                </button>
                <button onclick="window.store.setView('competitions'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-amber-300">
                    <i data-lucide="trophy" class="w-4 h-4 text-amber-400"></i>
                    <span>لیگ‌ها و مسابقات</span>
                </button>
                <button onclick="window.store.setView('live-lab'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl bg-rose-950/50 hover:bg-rose-900/50 text-right flex items-center gap-2 text-rose-300 border border-rose-800/60 font-bold col-span-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <i data-lucide="radio" class="w-4 h-4 text-rose-400"></i>
                    <span>ورود به کلاس زنده آزمایشگاه (Live Classroom)</span>
                </button>
                <button onclick="window.store.setView('leaderboards'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-indigo-300">
                    <i data-lucide="award" class="w-4 h-4 text-indigo-400"></i>
                    <span>جدول امتیازات</span>
                </button>
                <button onclick="window.store.setView('badges'); window.toggleMobileDrawer(false)" class="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-right flex items-center gap-2 text-emerald-300">
                    <i data-lucide="medal" class="w-4 h-4 text-emerald-400"></i>
                    <span>نشان‌ها و مدال‌ها</span>
                </button>
            </div>

            ${user && user.role === 'admin' ? `
            <button onclick="window.store.setView('admin'); window.toggleMobileDrawer(false)" class="w-full p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
                <span class="flex items-center gap-2">
                    <i data-lucide="shield-alert" class="w-4 h-4 text-rose-400"></i>
                    <span>ورود به پنل جامع مدیریت آموزشی</span>
                </span>
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            ` : ''}

            <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <a href="/api/docs" target="_blank" class="hover:text-cyan-400">مستندات Swagger API</a>
                <span>پلتفرم فیزیک سمپاد • بهشتی ۲</span>
            </div>
        </div>
    </header>

    <!-- =========================================================================
         3. MOBILE PERSISTENT BOTTOM NAVIGATION DOCK (< md)
         ========================================================================= -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-cyan-500/20 backdrop-blur-2xl flex items-center justify-around py-2 px-1 shadow-2xl">
        <button onclick="window.store.setView('curriculum')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('curriculum') ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}">
            <i data-lucide="book-open" class="w-4 h-4 mb-0.5 ${isTabActive('curriculum') ? 'text-cyan-400' : ''}"></i>
            <span class="text-[10px]">آموزش</span>
        </button>

        <button onclick="window.store.setView('competitions')" class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${isTabActive('competitions') ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}">
            <i data-lucide="trophy" class="w-4 h-4 mb-0.5 ${isTabActive('competitions') ? 'text-amber-400' : ''}"></i>
            <span class="text-[10px]">لیگ‌ها</span>
        </button>

        <!-- Center AI Button with Quantum Glow -->
        <button onclick="window.toggleAiTutorModal(true)" class="relative -top-3 flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all">
            <i data-lucide="bot" class="w-5 h-5"></i>
            <span class="text-[9px] font-black">نکسورا</span>
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
window.toggleDesktopSidebar = toggleDesktopSidebar;
