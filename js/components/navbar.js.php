<?php
/**
 * QUANTUM CUT — Observatory Navigation (Pure PHP Edition)
 * ------------------------------------------------------------------
 * Institutional header, grouped command menus, theme switcher,
 * mobile drawer and the mobile laboratory dock.
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
let isMobileDrawerOpen = false;

function toggleMobileDrawer(forceState) {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!drawer) return;
    isMobileDrawerOpen = (typeof forceState === 'boolean') ? forceState : !isMobileDrawerOpen;
    drawer.classList.toggle('hidden', !isMobileDrawerOpen);
    const burger = document.getElementById('qc-burger');
    if (burger) burger.setAttribute('aria-expanded', isMobileDrawerOpen ? 'true' : 'false');
    if (window.lucide) window.lucide.createIcons();
}

function closeAllDropdowns() {
    ['lab-dropdown-menu', 'arena-dropdown-menu', 'teacher-dropdown-menu', 'profile-dropdown-menu'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('hidden', 'hidden');
    });
    document.querySelectorAll('[data-qc-drop-trigger]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
}

function toggleNavDropdown(id, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const el = document.getElementById(id);
    if (!el) return;
    const isOpen = !el.hasAttribute('hidden');
    closeAllDropdowns();
    if (!isOpen) {
        el.removeAttribute('hidden');
        const trigger = document.querySelector('[data-qc-drop-trigger="' + id + '"]');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }
    if (window.lucide) window.lucide.createIcons();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.qc-nav-drop') && !e.target.closest('[data-profile-wrapper]')) {
        closeAllDropdowns();
    }
});

function renderNavbar() {
    const user = window.store ? window.store.currentUser : null;
    const theme = (window.store && window.store.theme) || 'dark';
    const rawView = window.store ? window.store.currentView : 'landing';
    const currentView = typeof rawView === 'string' ? rawView : ((rawView && rawView.name) || 'landing');
    const isActive = (v) => currentView === v ? 'is-active' : '';
    const anyActive = (list) => list.includes(currentView);
    const inLab = anyActive(['simulators', 'sensor-lab', 'data-logger']);
    const inArena = anyActive(['duel', 'guilds', 'competitions', 'leaderboards', 'badges']);
    const inTeacher = anyActive(['live-lab', 'teacher-heatmap', 'printable-exam', 'handwriting-grader', 'admin']);

    const labMenu = `
        <div id="lab-dropdown-menu" class="qc-nav-drop__menu" hidden>
            <button type="button" onclick="window.store.setView('simulators'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="flask-conical" class="w-4 h-4 text-[var(--accent)] mt-0.5"></i>
                <span><span class="block text-xs font-black">آزمایشگاه‌های تعاملی PhET</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">شبیه‌سازهای استاندارد هفتم، هشتم و نهم</span></span>
            </button>
            <button type="button" onclick="window.store.setView('sensor-lab'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="smartphone" class="w-4 h-4 text-[var(--accent-2)] mt-0.5"></i>
                <span><span class="block text-xs font-black">آزمایشگاه سنسوری تلفن همراه</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">شتاب‌سنج، ژیروسکوپ و تحلیل طیف صوتی</span></span>
            </button>
            <button type="button" onclick="window.store.setView('data-logger'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="line-chart" class="w-4 h-4 text-[var(--ok)] mt-0.5"></i>
                <span><span class="block text-xs font-black">ثبت داده و برازش خطی</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">رگرسیون کمترین مربعات و ضریب تعیین R²</span></span>
            </button>
        </div>`;

    const arenaMenu = `
        <div id="arena-dropdown-menu" class="qc-nav-drop__menu" hidden>
            <button type="button" onclick="window.store.setView('duel'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="swords" class="w-4 h-4 text-[var(--accent)] mt-0.5"></i>
                <span><span class="block text-xs font-black">دوئل ۱ به ۱ کوانتومی</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">نبرد سرعتی زنده با ریتینگ ELO</span></span>
            </button>
            <button type="button" onclick="window.store.setView('guilds'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="shield" class="w-4 h-4 text-[var(--warn)] mt-0.5"></i>
                <span><span class="block text-xs font-black">خاندان‌های علمی سمپاد</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">ماکسول، نیوتون، بوهر و فاینمن</span></span>
            </button>
            <button type="button" onclick="window.store.setView('competitions'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="trophy" class="w-4 h-4 text-[var(--warn)] mt-0.5"></i>
                <span><span class="block text-xs font-black">لیگ‌ها و مسابقات</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">جام سرعت، المپیاد و جدول امتیازات</span></span>
            </button>
            <button type="button" onclick="window.store.setView('leaderboards'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="bar-chart-3" class="w-4 h-4 text-[var(--ok)] mt-0.5"></i>
                <span><span class="block text-xs font-black">جدول رتبه‌بندی</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">رتبه‌های برتر هر پایه تحصیلی</span></span>
            </button>
        </div>`;

    const teacherMenu = `
        <div id="teacher-dropdown-menu" class="qc-nav-drop__menu" hidden>
            <button type="button" onclick="window.store.setView('live-lab'); closeAllDropdowns()" class="qc-menu__item">
                <span class="qc-dot qc-dot--live mt-2"></span>
                <span><span class="block text-xs font-black">کلاس زنده دبیر</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">پخش زنده، شبیه‌ساز مشترک و کوئیز آنی</span></span>
            </button>
            <button type="button" onclick="window.store.setView('teacher-heatmap'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="flame" class="w-4 h-4 text-[var(--warn)] mt-0.5"></i>
                <span><span class="block text-xs font-black">ماتریس کج‌فهمی‌های فیزیک</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">نقشه حرارتی خطاهای مفهومی دانش‌آموزان</span></span>
            </button>
            <button type="button" onclick="window.store.setView('handwriting-grader'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="scan-text" class="w-4 h-4 text-[var(--accent-3)] mt-0.5"></i>
                <span><span class="block text-xs font-black">تصحیح دست‌نوشته با هوش مصنوعی</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">بارم‌بندی چهارمرحله‌ای استاندارد سمپاد</span></span>
            </button>
            <button type="button" onclick="window.store.setView('printable-exam'); closeAllDropdowns()" class="qc-menu__item">
                <i data-lucide="printer" class="w-4 h-4 text-[var(--ok)] mt-0.5"></i>
                <span><span class="block text-xs font-black">آزمون‌ساز چاپی A4</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">سربرگ رسمی سمپاد و کلید تصحیح</span></span>
            </button>
            ${user && user.role === 'admin' ? `
            <button type="button" onclick="window.store.setView('admin'); closeAllDropdowns()" class="qc-menu__item" style="background:var(--danger-soft);border-color:rgba(251,113,133,.28);">
                <i data-lucide="shield-check" class="w-4 h-4 text-[var(--danger)] mt-0.5"></i>
                <span><span class="block text-xs font-black">پنل مدیریت سامانه</span><span class="block text-[10px] text-[var(--muted)] mt-0.5">کاربران، محتوا، سؤالات و تنظیمات</span></span>
            </button>` : ''}
        </div>`;

    const streak = (user && user.current_streak) || 0;
    const xp = (user && user.total_xp) || 0;

    return `
    <header class="qc-header">
        <div class="qc-header__inner">
            <div class="qc-brand" role="button" tabindex="0" onclick="window.store.setView('landing')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.store.setView('landing')}">
                <span class="qc-brand__mark" aria-hidden="true">
                    <i data-lucide="atom" class="w-5 h-5"></i>
                </span>
                <span class="qc-brand__text">
                    <span class="qc-brand__title">انجمن فیزیک شهید بهشتی دو</span>
                    <span class="qc-brand__sub">SAMPAD · PHYSICS SOCIETY</span>
                </span>
            </div>

            <nav class="qc-nav" aria-label="ناوبری اصلی">
                <button type="button" class="qc-nav__link ${isActive('curriculum')}" onclick="window.store.setView('curriculum')">
                    <i data-lucide="book-open" class="w-3.5 h-3.5"></i><span>آموزش فیزیک</span>
                </button>

                <div class="qc-nav-drop">
                    <button type="button" data-qc-drop-trigger="lab-dropdown-menu" aria-expanded="false" aria-haspopup="true" onclick="toggleNavDropdown('lab-dropdown-menu', event)" class="qc-nav__link ${inLab ? 'is-active' : ''}">
                        <i data-lucide="flask-conical" class="w-3.5 h-3.5"></i><span>آزمایشگاه‌ها</span>
                        <i data-lucide="chevron-down" class="w-3 h-3"></i>
                    </button>
                    ${labMenu}
                </div>

                <div class="qc-nav-drop">
                    <button type="button" data-qc-drop-trigger="arena-dropdown-menu" aria-expanded="false" aria-haspopup="true" onclick="toggleNavDropdown('arena-dropdown-menu', event)" class="qc-nav__link ${inArena ? 'is-active' : ''}">
                        <i data-lucide="swords" class="w-3.5 h-3.5"></i><span>آرنای رقابت</span>
                        <i data-lucide="chevron-down" class="w-3 h-3"></i>
                    </button>
                    ${arenaMenu}
                </div>

                <button type="button" class="qc-nav__link ${isActive('adaptive-exam')}" onclick="window.store.setView('adaptive-exam')">
                    <i data-lucide="target" class="w-3.5 h-3.5"></i><span>آزمون تطبیقی</span>
                </button>

                <div class="qc-nav-drop">
                    <button type="button" data-qc-drop-trigger="teacher-dropdown-menu" aria-expanded="false" aria-haspopup="true" onclick="toggleNavDropdown('teacher-dropdown-menu', event)" class="qc-nav__link ${inTeacher ? 'is-active' : ''}">
                        <i data-lucide="radio" class="w-3.5 h-3.5"></i><span>میز کار دبیران</span>
                        <i data-lucide="chevron-down" class="w-3 h-3"></i>
                    </button>
                    ${teacherMenu}
                </div>
            </nav>

            <div class="qc-actions">
                <button type="button" onclick="window.openCommandPalette()" class="qc-icon-btn hidden sm:inline-flex" title="جستجوی سریع (Ctrl+K)" aria-label="جستجوی سریع">
                    <i data-lucide="search" class="w-4 h-4"></i>
                </button>

                <button type="button" data-qc-theme-toggle class="qc-icon-btn" aria-label="تغییر پوسته" title="تغییر پوسته">
                    <i data-theme-icon data-lucide="${theme === 'light' ? 'moon' : 'sun'}" class="w-4 h-4"></i>
                </button>

                <button type="button" onclick="window.toggleAiTutorModal(true)" class="qc-btn qc-btn--sm hidden md:inline-flex" style="background:linear-gradient(140deg,var(--accent-2),var(--accent-3));color:#fff;">
                    <span class="qc-dot qc-dot--live" style="color:#fff"></span>
                    <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                    <span class="hidden lg:inline">نکسورا AI</span>
                </button>

                ${user ? `
                <div class="hidden 2xl:flex items-center gap-1.5">
                    <span class="qc-chip qc-chip--warn qc-chip--mono" title="استمرار روزانه مطالعه">
                        <i data-lucide="flame" class="w-3.5 h-3.5"></i>${streak}
                    </span>
                    <span class="qc-chip qc-chip--accent qc-chip--mono" title="امتیاز تجربه">
                        <i data-lucide="zap" class="w-3.5 h-3.5"></i>${xp} XP
                    </span>
                </div>

                <div class="relative" data-profile-wrapper>
                    <button type="button" class="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--surface-2)] transition-colors" onclick="toggleNavDropdown('profile-dropdown-menu', event)" aria-label="حساب کاربری">
                        <span class="qc-avatar">${(user.display_name || 'د').charAt(0)}</span>
                        <span class="hidden xl:block text-[11px] font-bold text-[var(--ink-2)] max-w-[110px] truncate">${user.display_name || user.username}</span>
                        <i data-lucide="chevron-down" class="w-3 h-3 text-[var(--muted)] hidden xl:block"></i>
                    </button>
                    <div id="profile-dropdown-menu" class="qc-nav-drop__menu" style="inset-inline-end:0;inset-inline-start:auto;width:250px;" hidden>
                        <div class="px-3 py-2.5 border-b border-[var(--line)] mb-1">
                            <div class="text-xs font-black text-[var(--ink)] truncate">${user.display_name || user.username}</div>
                            <div class="text-[10px] text-[var(--muted)] font-mono mt-0.5">${user.grade_title_fa || 'دوره اول'} · LVL ${user.current_level || 1}</div>
                        </div>
                        <button type="button" onclick="window.store.setView('dashboard'); closeAllDropdowns()" class="qc-menu__item">
                            <i data-lucide="layout-dashboard" class="w-4 h-4 text-[var(--accent)]"></i><span class="text-xs font-bold">داشبورد من</span>
                        </button>
                        <button type="button" onclick="window.store.setView('badges'); closeAllDropdowns()" class="qc-menu__item">
                            <i data-lucide="medal" class="w-4 h-4 text-[var(--warn)]"></i><span class="text-xs font-bold">مدال‌ها و دستاوردها</span>
                        </button>
                        ${user.role === 'admin' ? `
                        <button type="button" onclick="window.store.setView('admin'); closeAllDropdowns()" class="qc-menu__item">
                            <i data-lucide="shield-check" class="w-4 h-4 text-[var(--danger)]"></i><span class="text-xs font-bold">پنل مدیریت</span>
                        </button>` : ''}
                        <button type="button" onclick="closeAllDropdowns(); logout()" class="qc-menu__item">
                            <i data-lucide="log-out" class="w-4 h-4 text-[var(--danger)]"></i><span class="text-xs font-bold">خروج از حساب</span>
                        </button>
                    </div>
                </div>
                ` : `
                <button type="button" onclick="window.openAuthModal('login')" class="qc-btn qc-btn--ghost qc-btn--sm">ورود</button>
                <button type="button" onclick="window.openAuthModal('register')" class="qc-btn qc-btn--sm"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i><span class="hidden sm:inline">عضویت</span></button>
                `}

                <button type="button" id="qc-burger" onclick="window.toggleMobileDrawer()" class="qc-icon-btn lg:hidden" aria-expanded="false" aria-controls="mobile-nav-drawer" aria-label="منوی امکانات">
                    <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
            </div>
        </div>

        <div id="qc-breadcrumbs" class="qc-breadcrumbs" style="display:none" aria-label="مسیر صفحه"></div>

        <div id="mobile-nav-drawer" class="hidden lg:hidden border-t border-[var(--line)] px-4 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <button type="button" onclick="window.openCommandPalette(); window.toggleMobileDrawer(false)" class="w-full flex items-center gap-2.5 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] text-xs font-bold">
                <i data-lucide="search" class="w-4 h-4"></i>
                <span>جستجوی سریع در سامانه…</span>
                <span class="qc-kbd ms-auto">Ctrl K</span>
            </button>

            <a href="/downloads/physics-society.apk" download="PhysicsSociety-SAMPAD.apk" target="_blank" rel="noopener noreferrer"
               class="w-full p-3 rounded-xl flex items-center justify-between text-[11px] font-bold text-white"
               style="background:linear-gradient(120deg,var(--accent),var(--accent-2) 60%,var(--accent-3));">
                <span class="flex items-center gap-2"><i data-lucide="smartphone" class="w-4 h-4"></i>دانلود اپلیکیشن اندروید (APK)</span>
                <span class="font-mono text-[10px] opacity-80">v5</span>
            </a>

            <div class="flex items-center justify-between p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-2)]">
                <span class="flex items-center gap-2 text-[11px] font-bold text-[var(--ink-2)]">
                    <i data-lucide="palette" class="w-4 h-4 text-[var(--accent)]"></i>
                    <span data-theme-label>${theme === 'light' ? 'پوسته تاریک' : 'پوسته روشن'}</span>
                </span>
                <button type="button" data-qc-theme-toggle class="qc-btn qc-btn--soft qc-btn--sm">
                    <i data-theme-icon data-lucide="${theme === 'light' ? 'moon' : 'sun'}" class="w-3.5 h-3.5"></i>
                    <span>تغییر</span>
                </button>
            </div>

            ${user ? `
            <div class="flex items-center gap-3 p-3 rounded-xl border border-[var(--line)] bg-[var(--surface-2)]">
                <span class="qc-avatar">${(user.display_name || 'د').charAt(0)}</span>
                <div class="min-w-0 flex-1">
                    <span class="block font-black text-[var(--ink)] text-xs truncate">${user.display_name || user.username}</span>
                    <span class="block text-[10px] text-[var(--muted)] font-mono mt-0.5">${user.grade_title_fa || 'دانش‌آموز'} · LVL ${user.current_level || 1} · ${xp} XP</span>
                </div>
                <button type="button" onclick="logout()" class="text-[10px] font-bold text-[var(--danger)] px-2.5 py-1 rounded-lg border border-[var(--danger)]">خروج</button>
            </div>` : ''}

            <div class="grid grid-cols-2 gap-2 text-[11px] font-bold">
                ${drawerLink('book-open', 'سرفصل‌های فیزیک', 'curriculum')}
                ${drawerLink('file-text', 'درسنامه‌ها و جزوات', 'materials')}
                ${drawerLink('flask-conical', 'آزمایشگاه PhET', 'simulators')}
                ${drawerLink('smartphone', 'آزمایشگاه سنسوری', 'sensor-lab')}
                ${drawerLink('line-chart', 'برازش داده‌ها', 'data-logger')}
                ${drawerLink('target', 'آزمون تطبیقی (CAT)', 'adaptive-exam')}
                ${drawerLink('swords', 'دوئل ۱ به ۱', 'duel')}
                ${drawerLink('shield', 'خاندان‌های علمی', 'guilds')}
                ${drawerLink('trophy', 'لیگ‌ها و مسابقات', 'competitions')}
                ${drawerLink('bar-chart-3', 'جدول رتبه‌بندی', 'leaderboards')}
                ${drawerLink('scan-text', 'تصحیح دست‌نوشته AI', 'handwriting-grader')}
                ${drawerLink('printer', 'آزمون‌ساز چاپی A4', 'printable-exam')}
                <button type="button" onclick="window.store.setView('live-lab'); window.toggleMobileDrawer(false)" class="col-span-2 p-3 rounded-xl text-right flex items-center gap-2.5 border" style="background:var(--danger-soft);border-color:rgba(251,113,133,.3);color:var(--danger);">
                    <span class="qc-dot qc-dot--live"></span>
                    <i data-lucide="video" class="w-4 h-4"></i>
                    <span>کلاس زنده و آزمایشگاه مشترک دبیر</span>
                </button>
                ${user && user.role === 'admin' ? `
                <button type="button" onclick="window.store.setView('admin'); window.toggleMobileDrawer(false)" class="col-span-2 p-3 rounded-xl text-right flex items-center justify-between font-bold border" style="background:var(--surface-2);border-color:var(--line-strong);color:var(--ink);">
                    <span class="flex items-center gap-2"><i data-lucide="shield-check" class="w-4 h-4 text-[var(--danger)]"></i>پنل جامع مدیریت</span>
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                </button>` : ''}
            </div>
        </div>
    </header>

    <nav class="qc-dock" aria-label="ناوبری سریع">
        <button type="button" onclick="window.store.setView('curriculum')" class="qc-dock__item ${isActive('curriculum')}">
            <i data-lucide="book-open" class="w-4 h-4"></i><span>آموزش</span>
        </button>
        <button type="button" onclick="window.store.setView('simulators')" class="qc-dock__item ${isActive('simulators')}">
            <i data-lucide="flask-conical" class="w-4 h-4"></i><span>آزمایشگاه</span>
        </button>
        <button type="button" onclick="window.toggleAiTutorModal(true)" class="qc-dock__center" aria-label="دستیار هوشمند">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
        </button>
        <button type="button" onclick="window.store.setView('duel')" class="qc-dock__item ${isActive('duel')}">
            <i data-lucide="swords" class="w-4 h-4"></i><span>دوئل</span>
        </button>
        <button type="button" onclick="window.store.currentUser ? window.store.setView('dashboard') : window.openAuthModal('login')" class="qc-dock__item ${isActive('dashboard')}">
            <i data-lucide="user" class="w-4 h-4"></i><span>پروفایل</span>
        </button>
    </nav>
    `;
}

function drawerLink(icon, label, view) {
    return `<button type="button" onclick="window.store.setView('${view}'); window.toggleMobileDrawer(false)" class="p-3 rounded-xl text-right flex items-center gap-2 border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-2)] hover:border-[var(--accent-line)] hover:text-[var(--ink)] transition-colors">
        <i data-lucide="${icon}" class="w-4 h-4 text-[var(--accent)]"></i>
        <span class="truncate">${label}</span>
    </button>`;
}

window.renderNavbar = renderNavbar;
window.toggleMobileDrawer = toggleMobileDrawer;
window.toggleNavDropdown = toggleNavDropdown;
window.closeAllDropdowns = closeAllDropdowns;
window.drawerLink = drawerLink;
