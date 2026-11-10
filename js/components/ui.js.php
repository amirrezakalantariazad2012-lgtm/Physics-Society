<?php
/**
 * QUANTUM CUT — Observatory UI Layer (Pure PHP Edition)
 * ------------------------------------------------------------------
 * Theme engine · command palette · toasts · scroll telemetry,
 * breadcrumbs, reveal-on-scroll and count-up instruments.
 * No framework, no standalone .js file.
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
(function () {
    'use strict';

    const root = document.documentElement;
    const STORE_KEY = 'theme';
    const MEDIA = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

    /* ==============================================================
       1 · THEME ENGINE
       ============================================================== */
    function storedTheme() {
        try {
            const v = localStorage.getItem(STORE_KEY);
            return (v === 'light' || v === 'dark') ? v : null;
        } catch (e) { return null; }
    }

    function systemTheme() {
        return (MEDIA && MEDIA.matches) ? 'light' : 'dark';
    }

    function currentTheme() {
        return root.classList.contains('light') ? 'light' : 'dark';
    }

    function paintTheme(theme, persist) {
        const isLight = theme === 'light';
        root.classList.toggle('light', isLight);
        root.classList.toggle('dark', !isLight);
        root.setAttribute('data-theme', theme);
        root.style.colorScheme = theme;

        const meta = document.getElementById('meta-theme-color');
        if (meta) meta.setAttribute('content', isLight ? '#f4f7fc' : '#070d18');

        if (persist) {
            try { localStorage.setItem(STORE_KEY, theme); } catch (e) {}
        }

        if (window.store) window.store.theme = theme;

        document.querySelectorAll('[data-qc-theme-toggle]').forEach(function (btn) {
            const target = isLight ? 'dark' : 'light';
            btn.setAttribute('aria-label', isLight ? 'فعال‌سازی پوسته فضای عمیق' : 'فعال‌سازی پوسته آزمایشگاه روشن');
            btn.setAttribute('title', isLight ? 'پوسته تاریک (فضای عمیق)' : 'پوسته روشن (آزمایشگاهی)');
            btn.setAttribute('data-theme-target', target);
            const icon = btn.querySelector('[data-theme-icon]');
            if (icon) icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
            const label = btn.querySelector('[data-theme-label]');
            if (label) label.textContent = isLight ? 'پوسته تاریک' : 'پوسته روشن';
        });

        if (window.lucide) window.lucide.createIcons();
        window.dispatchEvent(new CustomEvent('qc-theme-changed', { detail: { theme: theme } }));
    }

    function applyTheme(theme, persist) {
        paintTheme(theme === 'light' ? 'light' : 'dark', persist !== false);
    }

    function toggleTheme() {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        if (window.store && typeof window.store.playSound === 'function') {
            // soft confirmation chime, reused from the existing audio engine
            try { window.store.playSound('correct'); } catch (e) {}
        }
        if (window.qcToast) {
            window.qcToast(next === 'light' ? 'پوسته آزمایشگاه روشن فعال شد' : 'پوسته فضای عمیق فعال شد', 'ok', 2200);
        }
        return next;
    }

    function initTheme() {
        let theme = storedTheme();
        let forced = null;
        try {
            const q = new URLSearchParams(window.location.search).get('theme');
            if (q === 'light' || q === 'dark') forced = q;
        } catch (e) {}
        if (forced) theme = forced;
        paintTheme(theme || currentTheme() || systemTheme(), false);

        if (MEDIA) {
            const onChange = function (ev) {
                if (!storedTheme()) paintTheme(ev.matches ? 'light' : 'dark', false);
            };
            if (MEDIA.addEventListener) MEDIA.addEventListener('change', onChange);
            else if (MEDIA.addListener) MEDIA.addListener(onChange);
        }

        document.addEventListener('click', function (ev) {
            const btn = ev.target.closest('[data-qc-theme-toggle]');
            if (!btn) return;
            ev.preventDefault();
            toggleTheme();
        });
    }

    window.qcTheme = {
        get: currentTheme,
        system: systemTheme,
        apply: applyTheme,
        toggle: toggleTheme,
        init: initTheme
    };
    // Backwards compatible entry point used by the navbar / legacy handlers
    window.toggleTheme = toggleTheme;

    /* ==============================================================
       2 · TOASTS
       ============================================================== */
    const TOAST_ICONS = { ok: 'check-circle-2', warn: 'alert-triangle', danger: 'alert-octagon', info: 'info' };

    function toast(message, type, ms) {
        const host = document.getElementById('qc-toast-host');
        if (!host || !message) return null;
        type = TOAST_ICONS[type] ? type : 'info';

        const el = document.createElement('div');
        el.className = 'qc-toast qc-toast--' + type;
        el.innerHTML =
            '<i data-lucide="' + TOAST_ICONS[type] + '" class="w-4 h-4 shrink-0"></i>' +
            '<span class="leading-6"></span>';
        el.querySelector('span').textContent = String(message);
        host.appendChild(el);
        if (window.lucide) window.lucide.createIcons();

        const life = ms || (type === 'danger' ? 5200 : 3200);
        setTimeout(function () {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-8px) scale(.98)';
            setTimeout(function () { el.remove(); }, 260);
        }, life);
        return el;
    }
    window.qcToast = toast;

    /* ==============================================================
       2b · SAFE RENDERING HELPERS
       ============================================================== */
    const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

    function qcEscape(value) {
        return String(value === null || value === undefined ? '' : value)
            .replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
    }

    function qcSafeUrl(value) {
        const url = String(value || '').trim();
        if (!url) return '';
        if (/^(https?:|\/)/i.test(url) && !/^\/\//.test(url)) return url;
        if (/^[a-z0-9._~%-]+(\/[a-z0-9._~%?=&+\/-]*)?$/i.test(url)) return url;
        return '';
    }

    window.qcEscape = qcEscape;
    window.escapeHtml = qcEscape;
    window.qcSafeUrl = qcSafeUrl;

    /* ==============================================================
       3 · COMMAND PALETTE
       ============================================================== */
    const NAV_TARGETS = [
        { view: 'landing', label: 'صفحه اصلی', hint: 'خانه', icon: 'home', group: 'پرتال' },
        { view: 'dashboard', label: 'داشبورد من', hint: 'پیشرفت علمی', icon: 'layout-dashboard', group: 'پرتال' },
        { view: 'curriculum', label: 'سرفصل‌ها و نقشه یادگیری', hint: 'فیزیک هفتم، هشتم، نهم', icon: 'book-open', group: 'یادگیری' },
        { view: 'materials', label: 'درسنامه‌ها و جزوات', hint: 'جزوه، فرمول‌نامه، نمونه سؤال', icon: 'file-text', group: 'یادگیری' },
        { view: 'adaptive-exam', label: 'آزمون تطبیقی (CAT)', hint: 'مدل راش و شاخص تتا', icon: 'target', group: 'سنجش' },
        { view: 'competitions', label: 'لیگ‌ها و مسابقات', hint: 'جام سرعت، المپیاد', icon: 'trophy', group: 'آرنا' },
        { view: 'leaderboards', label: 'جدول رتبه‌بندی', hint: 'رتبه‌های برتر', icon: 'bar-chart-3', group: 'آرنا' },
        { view: 'badges', label: 'مدال‌ها و دستاوردها', hint: 'نشان‌های علمی', icon: 'medal', group: 'آرنا' },
        { view: 'duel', label: 'دوئل ۱ به ۱ کوانتومی', hint: 'ریتینگ ELO', icon: 'swords', group: 'آرنا' },
        { view: 'guilds', label: 'خاندان‌های علمی', hint: 'ماکسول، نیوتون، بوهر، فاینمن', icon: 'shield', group: 'آرنا' },
        { view: 'simulators', label: 'آزمایشگاه‌های PhET', hint: '۲۹ شبیه‌ساز تعاملی', icon: 'flask-conical', group: 'آزمایشگاه' },
        { view: 'sensor-lab', label: 'آزمایشگاه سنسوری موبایل', hint: 'شتاب‌سنج، ژیروسکوپ، FFT', icon: 'smartphone', group: 'آزمایشگاه' },
        { view: 'data-logger', label: 'برازش خطی داده‌ها', hint: 'رگرسیون و ضریب R²', icon: 'line-chart', group: 'آزمایشگاه' },
        { view: 'live-lab', label: 'کلاس زنده دبیر', hint: 'پخش زنده و کوئیز آنی', icon: 'radio', group: 'دبیران' },
        { view: 'teacher-heatmap', label: 'ماتریس کج‌فهمی‌ها', hint: 'نقشه حرارتی خطاهای مفهومی', icon: 'flame', group: 'دبیران' },
        { view: 'handwriting-grader', label: 'تصحیح دست‌نوشته با AI', hint: 'بارم‌بندی چهارگانه', icon: 'scan-text', group: 'دبیران' },
        { view: 'printable-exam', label: 'آزمون‌ساز چاپی A4', hint: 'سربرگ رسمی سمپاد', icon: 'printer', group: 'دبیران' },
        { view: 'admin', label: 'پنل مدیریت', hint: 'مدیریت محتوا و کاربران', icon: 'shield-check', group: 'مدیریت', adminOnly: true }
    ];

    let paletteState = { open: false, index: 0, items: [] };

    function paletteTargets() {
        const user = window.store ? window.store.currentUser : null;
        return NAV_TARGETS.filter(function (t) { return !t.adminOnly || (user && user.role === 'admin'); });
    }

    function openPalette() {
        if (paletteState.open) return;
        const host = document.getElementById('qc-palette-host');
        if (!host) return;
        paletteState.open = true;
        paletteState.index = 0;

        host.innerHTML =
            '<div class="qc-palette" data-palette-overlay>' +
                '<div class="qc-palette__box" role="dialog" aria-modal="true" aria-label="جستجوی سریع سامانه">' +
                    '<div class="qc-palette__input">' +
                        '<i data-lucide="search" class="w-4 h-4 text-[var(--muted)]"></i>' +
                        '<input type="text" id="qc-palette-input" placeholder="جستجوی صفحه، آزمایشگاه یا ابزار…" autocomplete="off" spellcheck="false" />' +
                        '<span class="qc-kbd">ESC</span>' +
                    '</div>' +
                    '<div class="qc-palette__list" id="qc-palette-list"></div>' +
                '</div>' +
            '</div>';

        const input = document.getElementById('qc-palette-input');
        renderPalette('');
        input.addEventListener('input', function () { renderPalette(this.value); });
        input.addEventListener('keydown', onPaletteKey);
        host.querySelector('[data-palette-overlay]').addEventListener('click', function (e) {
            if (e.target === this) closePalette();
        });
        setTimeout(function () { input.focus(); }, 30);
        if (window.lucide) window.lucide.createIcons();
    }

    function renderPalette(query) {
        const list = document.getElementById('qc-palette-list');
        if (!list) return;
        const q = (query || '').trim().toLowerCase();
        const items = paletteTargets().filter(function (t) {
            if (!q) return true;
            return (t.label + ' ' + t.hint + ' ' + t.group).toLowerCase().includes(q);
        });
        paletteState.items = items;
        if (paletteState.index >= items.length) paletteState.index = 0;

        if (!items.length) {
            list.innerHTML = '<div class="qc-empty" style="border:0;background:transparent;padding:1.6rem .8rem;">' +
                '<i data-lucide="search-x" class="w-6 h-6"></i>' +
                '<span class="qc-empty__title">نتیجه‌ای یافت نشد</span>' +
                '<span class="qc-empty__text">عبارت دیگری را امتحان کنید.</span></div>';
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        let lastGroup = '';
        list.innerHTML = items.map(function (t, i) {
            let head = '';
            if (t.group !== lastGroup) {
                head = '<div class="px-2 pt-2 pb-1 text-[10px] font-mono text-[var(--muted-2)] tracking-wider">' + t.group.toUpperCase() + '</div>';
                lastGroup = t.group;
            }
            return head +
                '<button type="button" class="qc-palette__item' + (i === paletteState.index ? ' is-cursor' : '') + '" data-palette-view="' + t.view + '">' +
                    '<i data-lucide="' + t.icon + '" class="w-4 h-4 text-[var(--accent)]"></i>' +
                    '<span class="font-bold">' + t.label + '</span>' +
                    '<span class="qc-palette__hint">' + t.hint + '</span>' +
                    '<i data-lucide="corner-down-left" class="w-3 h-3 text-[var(--muted-2)]"></i>' +
                '</button>';
        }).join('');

        list.querySelectorAll('[data-palette-view]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const view = btn.getAttribute('data-palette-view');
                closePalette();
                if (window.store) window.store.setView(view);
            });
        });
        if (window.lucide) window.lucide.createIcons();
        const cursor = list.querySelector('.is-cursor');
        if (cursor && cursor.scrollIntoView) cursor.scrollIntoView({ block: 'nearest' });
    }

    function onPaletteKey(ev) {
        const items = paletteState.items;
        if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            paletteState.index = Math.min(paletteState.index + 1, Math.max(items.length - 1, 0));
            renderPalette(ev.target.value);
        } else if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            paletteState.index = Math.max(paletteState.index - 1, 0);
            renderPalette(ev.target.value);
        } else if (ev.key === 'Enter') {
            ev.preventDefault();
            const t = items[paletteState.index];
            if (t) { closePalette(); window.store.setView(t.view); }
        } else if (ev.key === 'Escape') {
            closePalette();
        }
    }

    function closePalette() {
        const host = document.getElementById('qc-palette-host');
        if (host) host.innerHTML = '';
        paletteState.open = false;
    }

    window.openCommandPalette = openPalette;
    window.closeCommandPalette = closePalette;

    document.addEventListener('keydown', function (ev) {
        const tag = (ev.target && ev.target.tagName) || '';
        const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || (ev.target && ev.target.isContentEditable);
        if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
            ev.preventDefault();
            paletteState.open ? closePalette() : openPalette();
            return;
        }
        if (ev.key === 'Escape' && paletteState.open) {
            closePalette();
            return;
        }
        if (ev.key === '/' && !typing) {
            ev.preventDefault();
            openPalette();
        }
    });

    /* ==============================================================
       4 · BREADCRUMBS
       ============================================================== */
    const VIEW_LABELS = {
        landing: 'صفحه اصلی',
        dashboard: 'داشبورد من',
        curriculum: 'سرفصل‌ها',
        materials: 'درسنامه‌ها',
        chapter: 'فصل',
        lesson: 'درسنامه تعاملی',
        exam: 'آزمون',
        competitions: 'مسابقات و لیگ‌ها',
        leaderboards: 'جدول رتبه‌بندی',
        badges: 'مدال‌ها',
        simulators: 'آزمایشگاه PhET',
        'live-lab': 'کلاس زنده',
        duel: 'دوئل کوانتومی',
        guilds: 'خاندان‌های علمی',
        'adaptive-exam': 'آزمون تطبیقی',
        'sensor-lab': 'آزمایشگاه سنسوری',
        'data-logger': 'برازش داده‌ها',
        'handwriting-grader': 'تصحیح دست‌نوشته',
        'teacher-heatmap': 'ماتریس کج‌فهمی',
        'printable-exam': 'آزمون‌ساز چاپی',
        admin: 'پنل مدیریت'
    };

    function renderBreadcrumbs() {
        const host = document.getElementById('qc-breadcrumbs');
        if (!host || !window.store) return;
        const view = window.store.currentView || 'landing';
        const params = window.store.viewParams || {};
        if (view === 'landing' || view === 'login' || view === 'register') {
            host.style.display = 'none';
            host.innerHTML = '';
            return;
        }
        host.style.display = '';

        const parts = ['<a href="#landing" data-qc-nav="landing"><i data-lucide="home" class="w-3 h-3"></i> خانه</a>'];
        if (view === 'chapter' || view === 'lesson' || view === 'exam') {
            parts.push('<span class="sep">/</span><a href="#curriculum" data-qc-nav="curriculum">سرفصل‌ها</a>');
        }
        if (view === 'lesson' || view === 'exam') {
            parts.push('<span class="sep">/</span><a href="#curriculum" data-qc-nav="curriculum">مسیر یادگیری</a>');
        }
        const label = VIEW_LABELS[view] || 'صفحه';
        parts.push('<span class="sep">/</span><span class="current">' + label + (params.id ? ' #' + String(params.id) : '') + '</span>');
        host.innerHTML = parts.join('');
        host.querySelectorAll('[data-qc-nav]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                window.store.setView(a.getAttribute('data-qc-nav'));
            });
        });
        if (window.lucide) window.lucide.createIcons();
    }
    window.qcRenderBreadcrumbs = renderBreadcrumbs;

    /* ==============================================================
       5 · REVEAL, COUNT-UP & SCROLL TELEMETRY
       ============================================================== */
    let revealObserver = null;

    function ensureObserver() {
        if (revealObserver || !('IntersectionObserver' in window)) return;
        revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                revealObserver.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    }

    function scanReveals(scope) {
        const area = scope || document.getElementById('app-main-content') || document.body;
        if (!area) return;
        ensureObserver();
        const nodes = area.querySelectorAll('.qc-reveal:not(.is-in)');
        if (!revealObserver) {
            nodes.forEach(function (n) { n.classList.add('is-in'); });
            return;
        }
        nodes.forEach(function (n) { revealObserver.observe(n); });
        scanCounters(area);
    }
    window.qcRevealScan = scanReveals;

    function scanCounters(scope) {
        const area = scope || document;
        area.querySelectorAll('[data-countup]:not([data-countup-done])').forEach(function (el) {
            const target = parseFloat(el.getAttribute('data-countup')) || 0;
            const useFa = el.getAttribute('data-locale') === 'fa';
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = 1100;
            const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            el.setAttribute('data-countup-done', '1');

            const paint = function (value) {
                const rounded = Math.round(value);
                const text = useFa ? rounded.toLocaleString('fa-IR') : String(rounded);
                el.textContent = prefix + text + suffix;
            };
            if (reduce) { paint(target); return; }

            const start = performance.now();
            const tick = function (now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                paint(target * eased);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }
    window.qcScanCounters = scanCounters;

    function initScrollTelemetry() {
        const bar = document.getElementById('qc-scroll-progress');
        const topBtn = document.getElementById('qc-back-to-top');
        const header = document.querySelector('.qc-header');
        let raf = null;

        const paint = function () {
            const doc = document.documentElement;
            const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
            const ratio = Math.min(Math.max(window.scrollY / max, 0), 1);
            if (bar) bar.style.transform = 'scaleX(' + ratio + ')';
            if (topBtn) topBtn.classList.toggle('is-on', window.scrollY > 620);
            if (header) header.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
            raf = null;
        };
        const onScroll = function () { if (!raf) raf = requestAnimationFrame(paint); };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        paint();

        if (topBtn) {
            topBtn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    /* ==============================================================
       6 · BOOT
       ============================================================== */
    function boot() {
        initTheme();
        initScrollTelemetry();
        renderBreadcrumbs();
        scanReveals();

        window.addEventListener('view-changed', function () {
            renderBreadcrumbs();
            setTimeout(function () {
                scanReveals();
                renderBreadcrumbs();
            }, 60);
        });
        window.addEventListener('qc-theme-changed', function () { renderBreadcrumbs(); });

        const main = document.getElementById('app-main-content');
        if (main && window.MutationObserver) {
            let t = null;
            new MutationObserver(function () {
                if (t) clearTimeout(t);
                t = setTimeout(function () { scanReveals(main); }, 90);
            }).observe(main, { childList: true, subtree: true });
        }
    }

    window.qcUI = {
        boot: boot,
        toast: toast,
        palette: openPalette,
        reveal: scanReveals
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
