<?php
/**
 * QUANTUM CUT — Client Script (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
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

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = document.documentElement.classList.contains('qc-low-power');
    if (reduceMotion || lowPower) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let motes = [];
    let running = true;
    let rafId = null;

    const palette = () => (document.documentElement.classList.contains('light')
        ? { mote: ['rgba(11,116,216,.55)', 'rgba(79,70,229,.45)', 'rgba(124,58,237,.40)'], link: '11,116,216', star: 'rgba(20,52,96,.28)' }
        : { mote: ['rgba(56,189,248,.85)', 'rgba(129,140,248,.75)', 'rgba(167,139,250,.65)'], link: '96,165,250', star: 'rgba(214,232,255,.55)' });

    function build() {
        const area = width * height;
        const starCount = Math.min(Math.floor(area / 16000), 130);
        const moteCount = Math.min(Math.floor(area / 26000), 46);

        stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.25 + 0.25,
            a: Math.random() * 0.55 + 0.15,
            tw: Math.random() * Math.PI * 2
        }));

        motes = Array.from({ length: moteCount }, (_, i) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            r: Math.random() * 1.7 + 0.8,
            color: palette().mote[i % 3]
        }));
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        build();
    }

    const ORBITS = [
        { cx: 0.78, cy: 0.24, rx: 0.34, ry: 0.14, rot: -0.38, speed: 0.00012, phase: 0 },
        { cx: 0.2, cy: 0.72, rx: 0.26, ry: 0.1, rot: 0.45, speed: 0.00009, phase: 1.7 }
    ];

    let t0 = performance.now();

    function frame(now) {
        if (!running) return;
        const t = now - t0;
        ctx.clearRect(0, 0, width, height);
        const p = palette();

        // Star field with slow twinkle
        for (const s of stars) {
            const alpha = s.a * (0.65 + 0.35 * Math.sin(t * 0.0009 + s.tw));
            ctx.beginPath();
            ctx.fillStyle = p.star;
            ctx.globalAlpha = alpha;
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Orbital arcs — the "instrument" signature
        for (const orb of ORBITS) {
            const cx = width * orb.cx;
            const cy = height * orb.cy;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(orb.rot);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${p.link},0.12)`;
            ctx.lineWidth = 1;
            ctx.ellipse(0, 0, width * orb.rx, height * orb.ry, 0, 0, Math.PI * 2);
            ctx.stroke();

            const angle = t * orb.speed + orb.phase;
            const ex = Math.cos(angle) * width * orb.rx;
            const ey = Math.sin(angle) * height * orb.ry;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${p.link},0.55)`;
            ctx.arc(ex, ey, 2.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Drifting scientific motes with constellation links
        for (let i = 0; i < motes.length; i++) {
            const m = motes[i];
            m.x += m.vx;
            m.y += m.vy;
            if (m.x < -20) m.x = width + 20;
            if (m.x > width + 20) m.x = -20;
            if (m.y < -20) m.y = height + 20;
            if (m.y > height + 20) m.y = -20;

            ctx.beginPath();
            ctx.fillStyle = m.color;
            ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < motes.length; j++) {
                const n = motes[j];
                const dx = m.x - n.x;
                const dy = m.y - n.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 128) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${p.link},${(0.1 * (1 - dist / 128)).toFixed(3)})`;
                    ctx.lineWidth = 0.7;
                    ctx.moveTo(m.x, m.y);
                    ctx.lineTo(n.x, n.y);
                    ctx.stroke();
                }
            }
        }

        rafId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', () => {
        window.clearTimeout(window.__qcCanvasResize);
        window.__qcCanvasResize = window.setTimeout(resize, 180);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!running) {
            running = true;
            t0 = performance.now();
            rafId = requestAnimationFrame(frame);
        }
    });

    window.addEventListener('qc-theme-changed', () => {
        const p2 = palette();
        motes.forEach((m, i) => { m.color = p2.mote[i % 3]; });
    });

    rafId = requestAnimationFrame(frame);
}

function updateNavbar() {
    const navContainer = document.getElementById('navbar-container');
    if (!navContainer || !window.renderNavbar) return;
    navContainer.innerHTML = window.renderNavbar();
    if (window.lucide) window.lucide.createIcons();
    if (window.qcRenderBreadcrumbs) window.qcRenderBreadcrumbs();
    if (window.qcTheme && typeof window.qcTheme.get === 'function') {
        // Repaint the toggle icons for the active theme
        document.querySelectorAll('[data-qc-theme-toggle] [data-theme-icon]').forEach(icon => {
            icon.setAttribute('data-lucide', window.qcTheme.get() === 'light' ? 'moon' : 'sun');
        });
        if (window.lucide) window.lucide.createIcons();
    }
}
window.updateNavbar = updateNavbar;

function handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'landing';
    const parts = hash.split('/');
    const viewName = parts[0] || 'landing';
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
    const params = window.store.viewParams || {};

    mainContainer.dataset.module = view;

    // Laboratory modules authored for the deep-space palette are re-mapped onto
    // the light theme by the compatibility layer instead of being restyled.
    const ADAPTED_MODULES = [
        'adaptive-exam', 'guilds', 'duel', 'sensor-lab', 'data-logger',
        'handwriting-grader', 'teacher-heatmap', 'printable-exam',
        'competitions'
    ];
    mainContainer.classList.toggle('qc-adapt', ADAPTED_MODULES.includes(view));

    mainContainer.setAttribute('aria-busy', 'true');
    document.documentElement.classList.add('qc-route-changing');

    if (!['lesson', 'exam', 'chapter'].includes(view)) {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    try {
        if (view === 'login') {
            openAuthModal('login');
        } else if (view === 'register') {
            openAuthModal('register');
        } else if (view === 'landing') {
            await renderLandingView(mainContainer);
        } else if (view === 'dashboard') {
            if (!window.store.currentUser) {
                openAuthModal('login');
            } else if (window.store.currentUser.must_change_password) {
                openForcedPasswordModal();
            } else {
                await renderDashboardView(mainContainer);
            }
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
            if (window.renderCompetitionsView) await window.renderCompetitionsView('app-main-content');
        } else if (view === 'leaderboards') {
            if (window.renderLeaderboardsView) await window.renderLeaderboardsView('app-main-content');
        } else if (view === 'live-lab') {
            if (window.liveLab) await window.liveLab.render(mainContainer, params.id || null);
        } else if (view === 'simulators') {
            await renderSimulatorsCatalogView(mainContainer, params.id || 'density');
        } else if (view === 'badges') {
            if (window.renderBadgesView) await window.renderBadgesView('app-main-content');
        } else if (view === 'duel') {
            if (window.QuantumDuel) await window.QuantumDuel.render('app-main-content');
        } else if (view === 'guilds') {
            if (window.ScientificGuilds) await window.ScientificGuilds.render('app-main-content');
        } else if (view === 'adaptive-exam') {
            if (window.AdaptiveExam) await window.AdaptiveExam.render('app-main-content');
        } else if (view === 'sensor-lab') {
            if (window.MobileSensorLab) await window.MobileSensorLab.render('app-main-content');
        } else if (view === 'data-logger') {
            if (window.LabDataLogger) await window.LabDataLogger.render('app-main-content');
        } else if (view === 'handwriting-grader') {
            if (window.HandwritingGrader) await window.HandwritingGrader.render('app-main-content');
        } else if (view === 'teacher-heatmap') {
            if (window.TeacherHeatmap) await window.TeacherHeatmap.render('app-main-content');
        } else if (view === 'printable-exam') {
            if (window.PrintableExamView) await window.PrintableExamView.render('app-main-content');
        } else if (view === 'admin') {
            if (!window.store.currentUser || window.store.currentUser.role !== 'admin') {
                openAuthModal('login');
            } else if (window.store.currentUser.must_change_password) {
                openForcedPasswordModal();
            } else {
                window.currentAdminViews = new window.AdminViews('app-main-content');
                window.currentAdminViews.render();
            }
        } else {
            await renderLandingView(mainContainer);
        }
    } catch (err) {
        console.error('[router]', err);
        mainContainer.innerHTML = `
        <div class="qc-shell qc-section">
            <div class="qc-empty">
                <i data-lucide="satellite-dish" class="w-8 h-8 text-[var(--danger)]"></i>
                <span class="qc-empty__title">بارگذاری این بخش ممکن نشد</span>
                <span class="qc-empty__text">${(err && err.message) ? err.message : 'خطای نامشخص در ارتباط با سرور'}</span>
                <button type="button" class="qc-btn qc-btn--soft qc-btn--sm" onclick="window.store.setView('landing')">بازگشت به صفحه اصلی</button>
            </div>
        </div>`;
    }

    mainContainer.removeAttribute('aria-busy');
    document.documentElement.classList.remove('qc-route-changing');
    if (window.lucide) window.lucide.createIcons();
    if (window.renderMathInPage) window.renderMathInPage(mainContainer);
    if (window.qcRenderBreadcrumbs) window.qcRenderBreadcrumbs();
    if (window.qcRevealScan) window.qcRevealScan(mainContainer);
}

// ==========================================
// VIEW: LANDING PAGE
// ==========================================
// ==========================================
// VIEW: ACADEMIC ENTERPRISE LANDING PAGE (MIT Physics & CERN Inspired)
// ==========================================
async function renderLandingView(container) {
    let stats = { total_students: 0, total_questions: 0, total_lessons: 0, total_exams: 0 };
    try {
        const remote = await window.api.getPublicStats();
        stats = Object.assign(stats, remote || {});
    } catch (e) {
        console.warn('Public statistics unavailable:', e);
    }

    const faNum = (n) => {
        const value = Number(n) || 0;
        try { return value.toLocaleString('fa-IR'); } catch (e) { return String(value); }
    };

    const labCatalog = (window.physicsSimulators && Array.isArray(window.physicsSimulators.catalog))
        ? window.physicsSimulators.catalog : [];
    const labByKey = (key) => labCatalog.find(s => s.id === key || (s.key === key));
    const featureds = [
        { sim: labByKey('interactive-spring') || labByKey('hookes-law') || labCatalog[0], icon: 'waves', formula: 'F = -k x', label: 'قانون هوک' },
        { icon: 'orbit', formula: 'F = G \\frac{m_1 m_2}{r^2}', label: 'گرانش و مدارها' },
        { icon: 'zap', formula: 'V = I R', label: 'مدار و قانون اهم' },
        { icon: 'droplets', formula: '\\rho = \\frac{m}{V}', label: 'چگالی و شناوری' }
    ];
    const labTargets = ['projectile-motion', 'circuit-dc', 'density', 'wave-on-a-string'];
    const showcase = labTargets.map(id => labCatalog.find(s => s.id === id || (s.aliases || []).includes(id))).filter(Boolean);
    const showcaseList = showcase.length ? showcase : labCatalog.slice(0, 4);

    const user = window.store.currentUser;
    const faCount = (labCatalog.length || 28).toLocaleString('fa-IR');

    container.innerHTML = `
    <!-- Institutional accreditation strip -->
    <div class="border-b border-[var(--line)] bg-[var(--surface-glass)] backdrop-blur">
        <div class="qc-shell flex flex-col sm:flex-row items-center justify-between gap-2 py-2 text-[11px]">
            <div class="flex items-center gap-2 min-w-0">
                <span class="qc-dot qc-dot--live text-[var(--ok)]"></span>
                <span class="font-bold text-[var(--ink-2)] truncate">دبیرستان استعدادهای درخشان شهید بهشتی دو · دوره اول</span>
                <span class="hidden md:inline text-[var(--line-strong)]">|</span>
                <span class="hidden md:inline font-mono text-[9.5px] tracking-[.16em] text-[var(--muted)]" dir="ltr">SAMPAD · DEPARTMENT OF EXPERIMENTAL PHYSICS</span>
            </div>
            <div class="flex items-center gap-2 shrink-0 font-mono text-[10px] text-[var(--muted)]">
                <span>سال تحصیلی ۱۴۰۴–۱۴۰۵</span>
                <span class="qc-chip qc-chip--ok" style="font-size:9.5px;">نسخه ۵ · آفلاین‌پذیر</span>
            </div>
        </div>
    </div>

    <!-- HERO -->
    <section class="qc-hero">
      <div class="qc-container-pad max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="qc-hero-grid grid grid-cols-1 lg:grid-cols-[1.06fr_.94fr] gap-8 lg:gap-12 items-center py-9 sm:py-14 lg:py-16">

          <div class="space-y-6 text-right">
            <div class="qc-eyebrow qc-reveal">THE UNIVERSE IS OUR LABORATORY</div>

            <h1 class="qc-display qc-reveal" data-delay="1">
              کیهان، <span class="qc-gradient-text">آزمایشگاه ماست.</span>
            </h1>

            <p class="qc-lede qc-reveal" data-delay="2" style="max-width:56ch;">
              پرتال علمی انجمن فیزیک شهید بهشتی دو؛ از اندازه‌گیری چگالی تا ترازهای کوانتومی.
              درسنامه‌های تعاملی، آزمایشگاه‌های استاندارد، آزمون تطبیقی و سنجش تشریحی هوشمند —
              همه در یک محیط پژوهشی یکپارچه برای پایه‌های هفتم، هشتم و نهم.
            </p>

            <div class="flex flex-wrap items-center gap-2.5 qc-reveal" data-delay="3">
              <button type="button" class="qc-btn qc-btn--lg" onclick="window.store.setView('curriculum')">
                <i data-lucide="book-open" class="w-4 h-4"></i>
                <span>شروع مسیر یادگیری</span>
              </button>
              <button type="button" class="qc-btn qc-btn--lg qc-btn--ghost" onclick="window.store.setView('simulators')">
                <i data-lucide="flask-conical" class="w-4 h-4 text-[var(--accent)]"></i>
                <span>ورود به آزمایشگاه</span>
              </button>
              <button type="button" class="qc-btn qc-btn--lg qc-btn--soft" onclick="window.toggleAiTutorModal(true)">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                <span>پرسش از معلم هوشمند</span>
              </button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 qc-reveal" data-delay="4">
              <div class="qc-stat" style="padding:.8rem .85rem;">
                <div class="qc-stat__value qc-stat__value--accent"><span data-countup="${Number(stats.total_lessons) || 0}" data-locale="fa">۰</span></div>
                <div class="qc-stat__label">درسنامه تعاملی</div>
              </div>
              <div class="qc-stat" style="padding:.8rem .85rem;">
                <div class="qc-stat__value"><span data-countup="${Number(stats.total_questions) || 0}" data-locale="fa">۰</span></div>
                <div class="qc-stat__label">مسئله و سنجه</div>
              </div>
              <div class="qc-stat" style="padding:.8rem .85rem;">
                <div class="qc-stat__value"><span data-countup="${Number(stats.total_students) || 0}" data-locale="fa">۰</span></div>
                <div class="qc-stat__label">پژوهشگر دانش‌آموز</div>
              </div>
              <div class="qc-stat" style="padding:.8rem .85rem;">
                <div class="qc-stat__value">${faCount}</div>
                <div class="qc-stat__label">آزمایشگاه PhET</div>
              </div>
            </div>
          </div>

          <!-- Instrument console -->
          <div class="qc-card qc-card--glass qc-ticks qc-reveal" data-delay="2" style="padding:1rem;">
            <div class="qc-panel__head" style="padding-inline:.35rem;border:0;">
              <span class="flex items-center gap-2">
                <span class="qc-dot qc-dot--live text-[var(--ok)]"></span>
                <span>PHYSICS LAB CONSOLE</span>
              </span>
              <span class="font-mono text-[9px] text-[var(--muted)]">LIVE TELEMETRY</span>
            </div>

            <div class="flex items-center justify-center py-2">
              <div class="qc-orbit" style="max-width:220px;">
                <span class="qc-orbit__ring"></span>
                <span class="qc-orbit__ring"></span>
                <span class="qc-orbit__ring"></span>
                <span class="qc-orbit__core"></span>
                <span class="qc-orbit__label" style="top:6%;right:2%;">1s</span>
                <span class="qc-orbit__label" style="bottom:8%;left:0;">2p</span>
                <span class="qc-orbit__label" style="top:48%;right:-2%;">3d</span>
              </div>
            </div>

            <div class="space-y-2">
              <div class="qc-panel" style="padding:.6rem .75rem;">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-mono text-[9px] tracking-wider text-[var(--muted)]">KINEMATICS · DYNAMICS</span>
                  <span class="qc-chip qc-chip--accent" style="font-size:9px;">SAMPAD</span>
                </div>
                <div id="hero-formula-kinematics" class="katex-ltr-container text-sm" dir="ltr" style="min-height:30px;display:flex;align-items:center;justify-content:center;"></div>
              </div>
              <div class="qc-panel" style="padding:.6rem .75rem;">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-mono text-[9px] tracking-wider text-[var(--muted)]">ENERGY · PRESSURE</span>
                  <span class="qc-chip qc-chip--violet" style="font-size:9px;">LAB</span>
                </div>
                <div id="hero-formula-energy" class="katex-ltr-container text-sm" dir="ltr" style="min-height:30px;display:flex;align-items:center;justify-content:center;"></div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 mt-2">
              <div class="qc-readout">
                <span class="qc-readout__label">λ (طول موج)</span>
                <span class="qc-readout__value" style="font-size:.85rem;">532 nm</span>
              </div>
              <div class="qc-readout">
                <span class="qc-readout__label">g (گرانش)</span>
                <span class="qc-readout__value" style="font-size:.85rem;">9.81 m/s²</span>
              </div>
              <div class="qc-readout">
                <span class="qc-readout__label">h (ثابت پلانک)</span>
                <span class="qc-readout__value" style="font-size:.85rem;">6.63e-34</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-[var(--line)]">
              <button type="button" class="qc-btn qc-btn--sm qc-btn--soft" onclick="window.store.setView('live-lab')">
                <span class="qc-dot qc-dot--live text-[var(--danger)]"></span>
                <span>کلاس زنده</span>
              </button>
              <a href="/downloads/physics-society.apk" download="PhysicsSociety-SAMPAD.apk" target="_blank" rel="noopener noreferrer" class="qc-btn qc-btn--sm qc-btn--ghost">
                <i data-lucide="smartphone" class="w-3.5 h-3.5"></i>
                <span>اپلیکیشن اندروید</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="qc-spectrum" aria-hidden="true"></div>
    </section>

    <!-- RESEARCH PROGRAMMES -->
    <section class="qc-section">
      <div class="qc-shell">
        <div class="qc-section-head">
          <div class="space-y-1.5">
            <span class="qc-section-head__index">01 — ACADEMIC PROGRAMMES</span>
            <h2 class="qc-h2">سه دپارتمان، سه میدان پژوهش</h2>
            <p class="qc-lede" style="max-width:60ch;">سرفصل‌های رسمی علوم تجربی به‌همراه کتب تکمیلی سمپاد، مرتب‌شده بر اساس منطق مفهومی فیزیک.</p>
          </div>
          <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.store.setView('curriculum')">
            <span>نقشه کامل سرفصل‌ها</span>
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${[
            { n: '۷', gid: 1, title: 'ماده، اندازه‌گیری و انرژی', short: 'GRADE 07', topics: 'اندازه‌گیری و چگالی · جنبش ذرات و گرما · کار، انرژی و پایستگی', icon: 'flame', accent: 'var(--accent)' },
            { n: '۸', gid: 2, title: 'الکتریسیته، مغناطیس و نور', short: 'GRADE 08', topics: 'بار الکتریکی و قانون کولن · مغناطیس و القا · بازتاب، شکست و عدسی‌ها', icon: 'zap', accent: 'var(--accent-2)' },
            { n: '۹', gid: 3, title: 'مکانیک، فشار و فضا', short: 'GRADE 09', topics: 'سینماتیک و نمودارها · قوانین نیوتون و اصطکاک · فشار شاره‌ها و ماشین‌ها', icon: 'orbit', accent: 'var(--accent-3)' }
          ].map((card, i) => `
          <article class="qc-card qc-card--hover qc-card--p qc-reveal" data-delay="${i + 1}" role="button" tabindex="0"
                   onclick="window.store.setView('curriculum', { id: ${card.gid} })"
                   onkeydown="if(event.key==='Enter'){window.store.setView('curriculum',{id:${card.gid}})}">
            <div class="flex items-start justify-between">
              <span class="grid place-items-center w-12 h-12 rounded-2xl font-black text-xl" style="color:${card.accent};background:var(--surface-2);border:1px solid var(--line);">${card.n}</span>
              <span class="qc-chip qc-chip--mono" style="font-size:9px;">${card.short}</span>
            </div>
            <h3 class="mt-4 text-base font-black text-[var(--ink)]">${card.title}</h3>
            <p class="mt-2 text-[11.5px] leading-[2] text-[var(--muted)]">${card.topics}</p>
            <div class="flex items-center justify-between mt-4 pt-3 border-t border-[var(--line)] text-[11px] font-bold" style="color:${card.accent};">
              <span>ورود به سرفصل‌ها و درسنامه‌ها</span>
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <!-- SIGNATURE LABORATORIES -->
    <section class="qc-section qc-section--tight" style="background:linear-gradient(180deg,transparent,var(--surface-2),transparent);border-block:1px solid var(--line);">
      <div class="qc-shell">
        <div class="qc-section-head">
          <div class="space-y-1.5">
            <span class="qc-section-head__index">02 — INSTRUMENTATION</span>
            <h2 class="qc-h2">آزمایشگاه‌های شاخص</h2>
            <p class="qc-lede" style="max-width:60ch;">متغیرها را تغییر دهید، داده ثبت کنید و رابطه حاکم را خودتان استخراج کنید.</p>
          </div>
          <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.store.setView('simulators')">
            <span>همه ${faCount} آزمایشگاه</span>
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${showcaseList.map((sim, i) => `
          <button type="button" class="qc-card qc-card--hover qc-card--p text-right qc-reveal" data-delay="${i + 1}"
                  onclick="window.store.setView('simulators', { id: '${sim.id}' })">
            <div class="flex items-center justify-between">
              <span class="qc-feature__icon"><i data-lucide="${sim.icon || 'flask-conical'}" class="w-4 h-4"></i></span>
              <span class="qc-chip" style="font-size:9px;">${sim.gradeTitle || ('پایه ' + (sim.grade || 7))}</span>
            </div>
            <h3 class="mt-3 text-[13px] font-black text-[var(--ink)] leading-snug line-clamp-2">${sim.title || 'آزمایشگاه تعاملی'}</h3>
            <p class="mt-1.5 text-[10.5px] leading-[1.9] text-[var(--muted)] line-clamp-2">${sim.topic || sim.desc || ''}</p>
            <div class="mt-3 pt-2.5 border-t border-[var(--line)] flex items-center justify-between">
              <span class="text-[10px] text-[var(--accent)] overflow-hidden font-mono qc-formula" dir="ltr">${sim.formula || 'f(x) = y'}</span>
              <i data-lucide="arrow-up-left" class="w-3.5 h-3.5 text-[var(--muted)]"></i>
            </div>
          </button>`).join('')}
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
          ${featureds.map(f => `
          <div class="qc-panel" style="padding:.6rem .8rem;">
            <div class="flex items-center gap-1.5 mb-1">
              <i data-lucide="${f.icon}" class="w-3.5 h-3.5 text-[var(--accent)]"></i>
              <span class="text-[10px] font-bold text-[var(--muted)]">${f.label}</span>
            </div>
            <div class="text-[11px] text-[var(--ink-2)] font-mono" dir="ltr"><span class="qc-formula qc-formula--mini">${f.formula}</span></div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- PEDAGOGICAL FRAMEWORK -->
    <section class="qc-section">
      <div class="qc-shell">
        <div class="qc-section-head">
          <div class="space-y-1.5">
            <span class="qc-section-head__index">03 — SCIENTIFIC METHOD</span>
            <h2 class="qc-h2">چهار اصل حاکم بر طراحی علمی</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${[
            { i: 'compass', t: 'یادگیری کاوش‌محور', d: 'دانش‌آموز ابتدا با متغیرها کار می‌کند، سپس رابطه تحلیلی را استخراج می‌کند.', c: 'var(--accent)', idx: '01' },
            { i: 'move-3d', t: 'تفکیک نرده‌ای و برداری', d: 'رفع بدفهمی‌های رایج: مسافت/جابه‌جایی، تندی/سرعت و جهت شتاب.', c: 'var(--accent-2)', idx: '02' },
            { i: 'line-chart', t: 'تحلیل هندسی نمودارها', d: 'درک شهودی شیب مماس و مساحت زیر منحنی در آزمون‌های سمپاد.', c: 'var(--accent-3)', idx: '03' },
            { i: 'clipboard-check', t: 'سنجه ارزیابی روبیک', d: 'تصحیح تشریحی بر چهار مؤلفه: داده، فرمول، جایگذاری و استنتاج.', c: 'var(--ok)', idx: '04' }
          ].map((f, i) => `
          <article class="qc-card qc-card--p qc-reveal" data-delay="${i + 1}">
            <div class="flex items-center justify-between">
              <span class="qc-feature__icon" style="color:${f.c};">
                <i data-lucide="${f.i}" class="w-4 h-4"></i>
              </span>
              <span class="font-mono text-[10px] text-[var(--muted-2)]">${f.idx}</span>
            </div>
            <h3 class="mt-3 text-[13px] font-black text-[var(--ink)]">${f.t}</h3>
            <p class="mt-1.5 text-[11px] leading-[1.95] text-[var(--muted)]">${f.d}</p>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <!-- ARENA & AI -->
    <section class="qc-section qc-section--tight">
      <div class="qc-shell">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article class="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] p-5 sm:p-7 qc-reveal" style="background:linear-gradient(135deg,var(--accent-3-soft),var(--surface) 62%);">
            <div class="flex items-center gap-2">
              <span class="qc-chip qc-chip--violet"><i data-lucide="sparkles" class="w-3.5 h-3.5"></i> NEXORA COPILOT</span>
              <span class="qc-chip qc-chip--mono" style="font-size:9px;">GPT OSS 120B</span>
            </div>
            <h2 class="qc-h2 mt-4">پرسش‌هایت را از یک معلم سقراطی بپرس</h2>
            <p class="qc-lede mt-2" style="max-width:52ch;">دستیار هوشمند، زمینه صفحه جاری را می‌شناسد؛ فرمول‌ها، اثبات‌ها و رفع اشکال را گام‌به‌گام توضیح می‌دهد و پاسخ نهایی را مستقیم لو نمی‌دهد.</p>
            <div class="flex flex-wrap gap-2 mt-4">
              <button type="button" class="qc-btn" onclick="window.toggleAiTutorModal(true)"><i data-lucide="message-square" class="w-4 h-4"></i> شروع گفتگو</button>
              <button type="button" class="qc-btn qc-btn--ghost" onclick="window.store.setView('handwriting-grader')"><i data-lucide="scan-text" class="w-4 h-4"></i> تصحیح دست‌نوشته</button>
            </div>
            <div class="mt-4 pt-3 border-t border-[var(--line)]">
              <div class="qc-wave">
                <svg viewBox="0 0 320 60" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0,30 C30,4 52,56 84,30 C116,4 138,56 170,30 C202,4 224,56 256,30 C288,4 304,44 320,30" />
                </svg>
              </div>
            </div>
          </article>

          <article class="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] p-5 sm:p-7 qc-reveal" data-delay="1" style="background:linear-gradient(135deg,var(--warn-soft),var(--surface) 62%);">
            <div class="flex items-center gap-2">
              <span class="qc-chip qc-chip--warn"><i data-lucide="trophy" class="w-3.5 h-3.5"></i> QUANTUM ARENA</span>
              <span class="qc-chip qc-chip--mono" style="font-size:9px;">ELO 1200</span>
            </div>
            <h2 class="qc-h2 mt-4">در آرنای علمی، دانشت را به چالش بکش</h2>
            <p class="qc-lede mt-2" style="max-width:52ch;">دوئل‌های ۶۰ ثانیه‌ای ۱ به ۱، خاندان‌های علمی و لیگ‌های هفتگی؛ با ریتینگ ELO، سامانه ضدتقلب و جدول رتبه‌بندی زنده.</p>
            <div class="flex flex-wrap gap-2 mt-4">
              <button type="button" class="qc-btn qc-btn--warn" onclick="window.store.setView('duel')"><i data-lucide="swords" class="w-4 h-4"></i> ورود به دوئل</button>
              <button type="button" class="qc-btn qc-btn--ghost" onclick="window.store.setView('leaderboards')"><i data-lucide="bar-chart-3" class="w-4 h-4"></i> جدول رتبه‌بندی</button>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2">
              ${[['ماکسول', 'امواج و الکترومغناطیس'], ['نیوتون', 'نیرو و گرانش'], ['بوهر', 'ترازهای کوانتومی']].map(g => `
              <div class="qc-panel text-center" style="padding:.55rem .3rem;">
                <span class="block text-[11px] font-black text-[var(--ink)]">${g[0]}</span>
                <span class="block text-[9px] text-[var(--muted)] mt-0.5">${g[1]}</span>
              </div>`).join('')}
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="qc-section qc-section--tight">
      <div class="qc-shell">
        <div class="qc-card qc-ticks qc-reveal" style="padding:clamp(1.4rem,1rem+1.6vw,2.4rem);background:linear-gradient(120deg,var(--surface),var(--surface-2));">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div class="space-y-2">
              <span class="qc-eyebrow">JOIN THE OBSERVATORY</span>
              <h2 class="qc-h2">${user ? 'مسیر پژوهشی خود را ادامه بده، ' + (user.display_name || 'پژوهشگر') : 'به جمع پژوهشگران فیزیک بپیوند'}</h2>
              <p class="qc-lede" style="max-width:58ch;">${user ? 'آزمون تطبیقی بعدی، آزمایشگاه پیشنهادی و پیشرفت هفتگی شما آماده است.' : 'با ساخت حساب دانش‌آموزی، پیشرفت درسی، مدال‌ها و سابقه آزمایشگاهی شما به‌صورت دائمی ذخیره می‌شود.'}</p>
            </div>
            <div class="flex flex-wrap gap-2 shrink-0">
              ${user
                ? `<button type="button" class="qc-btn qc-btn--lg" onclick="window.store.setView('dashboard')"><i data-lucide="layout-dashboard" class="w-4 h-4"></i> داشبورد من</button>`
                : `<button type="button" class="qc-btn qc-btn--lg" onclick="window.openAuthModal('register')"><i data-lucide="user-plus" class="w-4 h-4"></i> ثبت‌نام دانش‌آموزی</button>
                   <button type="button" class="qc-btn qc-btn--lg qc-btn--ghost" onclick="window.openAuthModal('login')">ورود به حساب</button>`}
              <a href="/downloads/physics-society.apk" download="PhysicsSociety-SAMPAD.apk" target="_blank" rel="noopener noreferrer" class="qc-btn qc-btn--lg qc-btn--soft">
                <i data-lucide="download" class="w-4 h-4"></i> نسخه اندروید
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;

    if (window.katex) {
        // Render the compact formula strips on the laboratory cards
        container.querySelectorAll('.qc-formula').forEach(el => {
            if (el.getAttribute('data-rendered') === '1') return;
            const raw = (el.textContent || '').trim();
            if (!raw) return;
            el.setAttribute('data-rendered', '1');
            try {
                window.katex.render(raw, el, { displayMode: false, throwOnError: false });
            } catch (e) {
                console.warn('Mini formula render notice:', e);
            }
        });
        try {
            const kEl = container.querySelector('#hero-formula-kinematics');
            if (kEl) {
                window.katex.render(String.raw`x(t) = \tfrac{1}{2}at^2 + v_0t + x_0 \;\;\Longleftrightarrow\;\; \vec{F} = m\vec{a}`, kEl, { displayMode: true, throwOnError: false });
            }
            const eEl = container.querySelector('#hero-formula-energy');
            if (eEl) {
                window.katex.render(String.raw`K = \tfrac{1}{2}mv^2 + mgh \quad,\quad P = \rho gh + P_0`, eEl, { displayMode: true, throwOnError: false });
            }
        } catch (err) {
            console.warn('Hero KaTeX render notice:', err);
        }
    }

    if (window.lucide) window.lucide.createIcons();
    if (window.qcRevealScan) window.qcRevealScan(container);
    if (window.renderMathInPage) setTimeout(() => window.renderMathInPage(container), 30);
}


// ==========================================
// VIEW: STUDENT DASHBOARD (DEDICATED 7, 8, 9)
// ==========================================
async function renderDashboardView(container) {
    container.innerHTML = `<div class="qc-shell qc-loading"><div class="qc-spinner"></div><span>در حال دریافت پرونده علمی…</span></div>`;

    try {
        const data = await window.api.getDashboard();
        const s = data.student || data.user || {};
        const rank = (data.rank !== undefined && data.rank !== null) ? data.rank : (s.rank || '—');
        const totalXp = Number(data.total_xp || s.total_xp || 0);
        const level = Number(data.current_level || s.current_level || 1);
        const streak = Number(data.current_streak || s.current_streak || 0);
        const nextXp = Math.max(Number(data.next_level_xp) || 1000, totalXp, 1);
        const xpPercent = Math.min(100, Math.round((totalXp / nextXp) * 100));
        const exams = Array.isArray(data.recent_exams) ? data.recent_exams : [];
        const notes = Array.isArray(data.notifications) ? data.notifications : [];
        const badges = Number(data.unlocked_badges_count || 0);
        const lessonsDone = Number(data.completed_lessons_count || 0);

        let gradeNum = 7;
        let gradeId = Number(s.grade_id) || 1;
        if (s.grade_title_fa && s.grade_title_fa.includes('هشتم')) gradeNum = 8;
        else if (s.grade_title_fa && s.grade_title_fa.includes('نهم')) gradeNum = 9;
        else if (gradeId === 2) gradeNum = 8;
        else if (gradeId === 3) gradeNum = 9;

        let books = [];
        try { books = await window.api.getBooks(gradeId); } catch (e) { console.warn('books unavailable', e); }

        const cfg = {
            7: {
                badge: 'پایه هفتم — کاوشگر ماده، اندازه‌گیری و انرژی',
                icon: 'flame',
                formula: 'W = F \\cdot d \\quad,\\quad E_k = \\tfrac{1}{2}mv^2 \\quad,\\quad Q = mc\\Delta T',
                labTitle: 'میز کار هفتم: چگالی، فشار و تبدیل انرژی',
                labDesc: 'یکاهای SI، رابطه چگالی، پایستگی انرژی مکانیکی و سازوکارهای انتقال گرما (رسانش، همرفت، تابش).',
                simId: 'density'
            },
            8: {
                badge: 'پایه هشتم — پژوهشگر بار الکتریکی، مغناطیس و نور',
                icon: 'zap',
                formula: 'V = I R \\quad,\\quad \\theta_i = \\theta_r \\quad,\\quad n = \\frac{c}{v}',
                labTitle: 'میز کار هشتم: مدار الکتریکی و شکست نور',
                labDesc: 'قانون اهم، مقاومت معادل مدارهای متوالی و موازی، میدان مغناطیسی و تشکیل تصویر در عدسی‌ها.',
                simId: 'circuit-dc'
            },
            9: {
                badge: 'پایه نهم — نخبه مکانیک کلاسیک، دینامیک و فشار',
                icon: 'orbit',
                formula: '\\vec{F}_{net} = m\\vec{a} \\quad,\\quad P = \\rho g h \\quad,\\quad v = \\frac{\\Delta x}{\\Delta t}',
                labTitle: 'میز کار نهم: بردار نیرو، قوانین نیوتون و فشار شاره‌ها',
                labDesc: 'سینماتیک برداری، قوانین سه‌گانه نیوتون و اصطکاک، فشار در عمق مایعات و مزیت مکانیکی ماشین‌ها.',
                simId: 'forces-motion'
            }
        }[gradeNum];

        const quickActions = [
            { icon: 'book-open', label: 'سرفصل‌ها', view: 'curriculum', color: 'var(--accent)' },
            { icon: 'target', label: 'آزمون تطبیقی', view: 'adaptive-exam', color: 'var(--ok)' },
            { icon: 'flask-conical', label: 'آزمایشگاه', view: 'simulators', color: 'var(--accent-2)' },
            { icon: 'swords', label: 'دوئل ۱v۱', view: 'duel', color: 'var(--warn)' },
            { icon: 'bar-chart-3', label: 'رتبه‌بندی', view: 'leaderboards', color: 'var(--accent-3)' },
            { icon: 'sparkles', label: 'معلم هوشمند', action: 'ai', color: 'var(--accent-3)' }
        ];

        const days = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
        const streakDays = days.map((d, i) => ({ d, on: i < Math.min(streak, 7) }));

        container.innerHTML = `
        <div class="qc-shell qc-section space-y-6">

          <!-- Student observatory header -->
          <section class="qc-card qc-ticks overflow-hidden qc-reveal" style="padding:clamp(1.1rem,1rem+1vw,1.8rem);">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div class="flex items-center gap-4 min-w-0">
                <div class="relative grid place-items-center w-16 h-16 rounded-2xl shrink-0" style="background:linear-gradient(145deg,var(--accent),var(--accent-2));color:#fff;box-shadow:0 18px 36px -22px var(--accent);">
                  <span class="text-2xl font-black">${(s.display_name || s.full_name || 'د').charAt(0)}</span>
                  <span class="absolute -bottom-1.5 -left-1.5 qc-chip qc-chip--mono" style="font-size:9px;background:var(--surface);border-color:var(--line-strong);">LVL ${level}</span>
                </div>
                <div class="min-w-0">
                  <span class="qc-chip qc-chip--accent" style="font-size:9.5px;"><i data-lucide="${cfg.icon}" class="w-3 h-3"></i> ${cfg.badge}</span>
                  <h1 class="qc-h2 mt-2 truncate">${window.qcEscape(s.full_name || s.display_name || 'دانش‌آموز')}</h1>
                  <p class="text-[11px] text-[var(--muted)] mt-1">
                    ${s.grade_title_fa || ('پایه ' + gradeNum)} · رتبه <span class="font-bold text-[var(--ink-2)]">${rank}</span> در انجمن فیزیک
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2.5 w-full lg:w-auto">
                <div class="qc-readout text-center">
                  <span class="qc-readout__label">امتیاز کل</span>
                  <span class="qc-readout__value" style="font-size:1rem;">${totalXp.toLocaleString('fa-IR')}</span>
                </div>
                <div class="qc-readout text-center">
                  <span class="qc-readout__label">استمرار</span>
                  <span class="qc-readout__value" style="font-size:1rem;color:var(--warn);">${streak} روز</span>
                </div>
                <div class="qc-readout text-center">
                  <span class="qc-readout__label">درس‌های کامل</span>
                  <span class="qc-readout__value" style="font-size:1rem;color:var(--ok);">${lessonsDone}</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mt-5 pt-4 border-t border-[var(--line)] items-center">
              <div>
                <div class="flex items-center justify-between text-[10.5px] mb-1.5">
                  <span class="font-bold text-[var(--ink-2)]">مسیر تا سطح ${level + 1}</span>
                  <span class="font-mono text-[var(--accent)]" dir="ltr">${totalXp} / ${nextXp} XP</span>
                </div>
                <div class="h-2 rounded-full overflow-hidden" style="background:var(--surface-3);">
                  <div class="h-full rounded-full" style="width:${xpPercent}%;background:linear-gradient(90deg,var(--accent),var(--accent-2));"></div>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                ${streakDays.map(d => `
                <span class="grid place-items-center w-7 h-7 rounded-lg text-[10px] font-bold" style="${d.on ? 'background:var(--warn-soft);border:1px solid var(--warn);color:var(--warn);' : 'background:var(--surface-2);border:1px solid var(--line);color:var(--muted-2);'}">${d.d}</span>`).join('')}
                <span class="text-[9.5px] text-[var(--muted)] mr-1">۷ روز اخیر</span>
              </div>
            </div>
          </section>

          <!-- Quick actions -->
          <section class="grid grid-cols-3 sm:grid-cols-6 gap-2.5 qc-reveal" data-delay="1">
            ${quickActions.map(a => `
            <button type="button" class="qc-card qc-card--hover text-center" style="padding:.85rem .4rem;"
              onclick="${a.action === 'ai' ? "window.toggleAiTutorModal(true)" : `window.store.setView('${a.view}')`}">
              <i data-lucide="${a.icon}" class="w-5 h-5 mx-auto" style="color:${a.color};"></i>
              <span class="block mt-2 text-[10.5px] font-bold text-[var(--ink-2)]">${a.label}</span>
            </button>`).join('')}
          </section>

          <!-- Grade lab spotlight -->
          <section class="qc-card qc-card--p qc-reveal" data-delay="2">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div class="flex items-start gap-3">
                <span class="qc-feature__icon"><i data-lucide="microscope" class="w-4 h-4"></i></span>
                <div>
                  <h2 class="text-sm font-black text-[var(--ink)]">${cfg.labTitle}</h2>
                  <p class="text-[11px] text-[var(--muted)] mt-1 leading-[1.9] max-w-2xl">${cfg.labDesc}</p>
                </div>
              </div>
              <button type="button" class="qc-btn qc-btn--sm shrink-0" onclick="window.store.setView('simulators', { id: '${cfg.simId}' })">
                <i data-lucide="play" class="w-3.5 h-3.5"></i> ورود به آزمایشگاه
              </button>
            </div>
            <div class="mt-4 p-3 rounded-xl text-center overflow-x-auto katex-ltr-container" dir="ltr"
                 style="background:var(--surface-2);border:1px solid var(--line);font-family:var(--font-mono);font-size:.86rem;color:var(--accent);">
              $${cfg.formula}$$
            </div>
          </section>

          <!-- Active competition -->
          ${data.active_competition ? `
          <section class="qc-card qc-card--p qc-reveal" data-delay="2" style="border-color:rgba(251,191,36,.35);background:linear-gradient(120deg,var(--warn-soft),var(--surface));">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="grid place-items-center w-11 h-11 rounded-xl" style="background:var(--warn);color:#1b1203;">
                  <i data-lucide="trophy" class="w-5 h-5"></i>
                </span>
                <div>
                  <span class="qc-chip qc-chip--warn" style="font-size:9px;">مسابقه فعال هفته</span>
                  <h3 class="text-sm font-black text-[var(--ink)] mt-1">${window.qcEscape(data.active_competition.title_fa)}</h3>
                </div>
              </div>
              <button type="button" class="qc-btn qc-btn--warn qc-btn--sm" onclick="window.store.setView('competitions')">ورود به مسابقه</button>
            </div>
          </section>` : ''}

          <!-- Textbooks -->
          <section class="space-y-3 qc-reveal" data-delay="2">
            <div class="qc-section-head" style="margin-bottom:.4rem;">
              <div>
                <span class="qc-section-head__index">RESOURCES</span>
                <h2 class="text-sm font-black text-[var(--ink)] mt-1">منابع درسی رسمی شما (${s.grade_title_fa || ('پایه ' + gradeNum)})</h2>
              </div>
              <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.store.setView('curriculum')">همه فصل‌ها</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${books.length ? books.map(b => `
              <div class="qc-card qc-card--hover qc-card--p" role="button" tabindex="0" onclick="window.store.setView('curriculum')">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="qc-feature__icon"><i data-lucide="book" class="w-4 h-4"></i></span>
                    <div class="min-w-0">
                      <h3 class="text-[12.5px] font-black text-[var(--ink)] truncate">${window.qcEscape(b.title_fa)}</h3>
                      <p class="text-[10px] text-[var(--muted)] mt-0.5">${window.qcEscape(b.publisher_fa || 'آموزش و پرورش')} · ${b.academic_year || '۱۴۰۴–۱۴۰۵'}</p>
                    </div>
                  </div>
                  <span class="qc-chip ${b.book_type === 'sampad' ? 'qc-chip--violet' : 'qc-chip--accent'}" style="font-size:9px;">
                    ${b.book_type === 'sampad' ? 'تکمیلی سمپاد' : 'کتاب رسمی'}
                  </span>
                </div>
                <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--line)] text-[10.5px]">
                  <span class="text-[var(--muted)]"><i data-lucide="layers" class="w-3.5 h-3.5 inline"></i> ${Number(b.chapter_count) > 0 ? Number(b.chapter_count).toLocaleString('fa-IR') + ' فصل آموزشی' : 'منبع مرجع تکمیلی'}</span>
                  <span class="font-bold text-[var(--accent)]">مشاهده فصل‌ها ←</span>
                </div>
              </div>`).join('') : `<div class="qc-empty md:col-span-2"><i data-lucide="book-x" class="w-7 h-7"></i><span class="qc-empty__title">منبعی برای این پایه ثبت نشده است</span></div>`}
            </div>
          </section>

          <!-- Exams + notifications -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-3 qc-reveal" data-delay="3">
            <div class="qc-card qc-card--p">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-[13px] font-black text-[var(--ink)] flex items-center gap-2"><i data-lucide="file-check" class="w-4 h-4 text-[var(--ok)]"></i> نتایج آزمون‌های اخیر</h3>
                <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.store.setView('adaptive-exam')">آزمون جدید</button>
              </div>
              ${exams.length ? `
              <div class="qc-table-wrap" style="border:0;">
                <table class="qc-table" style="min-width:0;">
                  <thead><tr><th>آزمون</th><th>تاریخ</th><th>درصد</th><th>وضعیت</th></tr></thead>
                  <tbody>
                    ${exams.map(e => `
                    <tr>
                      <td class="text-[11px] font-bold text-[var(--ink)]">${window.qcEscape(e.title_fa)}</td>
                      <td class="text-[10px] text-[var(--muted)] whitespace-nowrap">${window.formatPersianDate(e.date)}</td>
                      <td class="qc-table__num font-bold">${Number(e.percentage || 0).toLocaleString('fa-IR')}٪</td>
                      <td><span class="qc-chip ${e.is_passed ? 'qc-chip--ok' : 'qc-chip--danger'}" style="font-size:9px;">${e.is_passed ? 'قبول' : 'نیازمند مرور'}</span></td>
                    </tr>`).join('')}
                  </tbody>
                </table>
              </div>` : `<div class="qc-empty" style="padding:1.6rem .8rem;"><i data-lucide="clipboard-list" class="w-6 h-6"></i><span class="qc-empty__title">هنوز آزمونی ثبت نشده است</span><span class="qc-empty__text">با آزمون تطبیقی، سطح فعلی خود را بسنجید.</span></div>`}
            </div>

            <div class="qc-card qc-card--p">
              <h3 class="text-[13px] font-black text-[var(--ink)] flex items-center gap-2 mb-3"><i data-lucide="bell" class="w-4 h-4 text-[var(--warn)]"></i> اعلان‌های آموزشی</h3>
              ${notes.length ? `
              <div class="space-y-2">
                ${notes.map(n => `
                <div class="p-3 rounded-xl" style="background:var(--surface-2);border:1px solid var(--line);">
                  <span class="block text-[11.5px] font-black text-[var(--ink)]">${window.qcEscape(n.title_fa)}</span>
                  <p class="text-[10.5px] text-[var(--muted)] mt-1 leading-[1.9]">${window.qcEscape(n.message_fa || '')}</p>
                </div>`).join('')}
              </div>` : `<div class="qc-empty" style="padding:1.6rem .8rem;"><i data-lucide="bell-off" class="w-6 h-6"></i><span class="qc-empty__title">اعلان جدیدی وجود ندارد</span></div>`}

              <div class="grid grid-cols-2 gap-2 mt-3">
                <div class="qc-readout text-center"><span class="qc-readout__label">مدال‌های کسب‌شده</span><span class="qc-readout__value" style="font-size:1rem;color:var(--warn);">${badges}</span></div>
                <button type="button" class="qc-btn qc-btn--soft qc-btn--sm" onclick="window.store.setView('badges')">مشاهده ویترین مدال‌ها</button>
              </div>
            </div>
          </section>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) window.renderMathInPage(container);
        if (window.qcRevealScan) window.qcRevealScan(container);
    } catch (e) {
        container.innerHTML = `
        <div class="qc-shell qc-section">
          <div class="qc-empty">
            <i data-lucide="satellite-dish" class="w-8 h-8 text-[var(--danger)]"></i>
            <span class="qc-empty__title">دریافت پرونده علمی ممکن نشد</span>
            <span class="qc-empty__text">${e.message}</span>
            <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('landing')">بازگشت</button>
          </div>
        </div>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

// ==========================================
// VIEW: CURRICULUM BROWSER
// ==========================================
async function renderCurriculumView(container, gradeId = null) {
    container.innerHTML = `<div class="qc-shell qc-loading"><div class="qc-spinner"></div><span>در حال بارگذاری نقشه یادگیری…</span></div>`;

    try {
        const grades = await window.api.getGrades();
        const user = window.store.currentUser;

        let activeGradeId = gradeId ? parseInt(gradeId, 10) : (user && user.grade_id ? Number(user.grade_id) : (grades[0] ? grades[0].id : 1));
        const activeGrade = grades.find(g => Number(g.id) === Number(activeGradeId)) || { id: activeGradeId, title_fa: 'پایه تحصیلی', number: activeGradeId };
        const isRegisteredGrade = Boolean(user && user.grade_id && Number(user.grade_id) === Number(activeGradeId));

        let books = [];
        let accessDenied = false;
        let loadError = null;
        try {
            books = await window.api.getBooks(activeGradeId);
        } catch (err) {
            if (String(err.message || '').includes('403') || String(err.message || '').includes('دسترسی')) {
                accessDenied = true;
            } else {
                loadError = err;
            }
        }

        const isPhysicsCh = (chNum) => {
            if (Number(activeGradeId) === 1) return [2, 8, 9, 10].includes(chNum);
            if (Number(activeGradeId) === 2) return [9, 10, 14, 15].includes(chNum);
            if (Number(activeGradeId) === 3) return [4, 5, 8, 9, 10].includes(chNum);
            return true;
        };

        const faNum = (n) => { try { return Number(n || 0).toLocaleString('fa-IR'); } catch (e) { return String(n); } };
        let totalChapters = 0;
        let completedChapters = 0;
        const bookBlocks = [];

        for (const b of books) {
            let chapters = [];
            try { chapters = await window.api.getChapters(b.id); } catch (e) { chapters = []; }
            const filtered = chapters.filter(ch => isPhysicsCh(Number(ch.chapter_number)));
            chapters = filtered.length ? filtered : chapters;
            chapters.sort((a, b2) => a.chapter_number - b2.chapter_number);
            totalChapters += chapters.length;
            completedChapters += chapters.filter(ch => Number(ch.user_progress_percent) >= 100).length;

            bookBlocks.push(`
            <section class="space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--line)]">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="qc-feature__icon"><i data-lucide="book" class="w-4 h-4"></i></span>
                  <div class="min-w-0">
                    <h2 class="text-[13.5px] font-black text-[var(--ink)] truncate">${window.qcEscape(b.title_fa)}</h2>
                    <p class="text-[10.5px] text-[var(--muted)] mt-0.5">${window.qcEscape(b.publisher_fa || 'آموزش و پرورش')} · سال تحصیلی ${b.academic_year || '۱۴۰۴–۱۴۰۵'}</p>
                  </div>
                </div>
                <span class="qc-chip ${b.book_type === 'sampad' ? 'qc-chip--violet' : 'qc-chip--accent'}" style="font-size:9.5px;">
                  ${b.book_type === 'sampad' ? 'کتاب تکمیلی سمپاد' : 'کتاب رسمی آموزش و پرورش'}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${chapters.map((ch, i) => {
                    const progress = Math.max(0, Math.min(100, Number(ch.user_progress_percent) || 0));
                    const qCount = Number(ch.question_count || ((Number(ch.mcq_count) || 0) + (Number(ch.written_count) || 0))) || 0;
                    return `
                    <article class="qc-card qc-card--hover qc-card--p qc-reveal" data-delay="${(i % 4) + 1}" role="button" tabindex="0"
                             onclick="window.store.setView('chapter', { id: ${ch.id} })"
                             onkeydown="if(event.key==='Enter'){window.store.setView('chapter',{id:${ch.id}})}">
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex flex-wrap items-center gap-1.5">
                          <span class="qc-chip qc-chip--accent qc-chip--mono" style="font-size:9.5px;">فصل ${faNum(ch.chapter_number)}</span>
                          <span class="qc-chip" style="font-size:9px;"><i data-lucide="atom" class="w-3 h-3 text-[var(--accent)]"></i> فیزیک</span>
                          ${progress >= 100 ? '<span class="qc-chip qc-chip--ok" style="font-size:9px;"><i data-lucide="check" class="w-3 h-3"></i> تکمیل‌شده</span>' : ''}
                        </div>
                        ${ch.source_pages ? `<span class="qc-chip qc-chip--mono" style="font-size:9px;white-space:nowrap;">${ch.source_pages}</span>` : ''}
                      </div>

                      <h3 class="mt-3 text-[14px] font-black text-[var(--ink)] leading-snug">${window.qcEscape(ch.title_fa)}</h3>
                      <p class="mt-1.5 text-[11px] leading-[1.95] text-[var(--muted)] line-clamp-2">${window.qcEscape(ch.description_fa || '')}</p>

                      ${progress > 0 ? `
                      <div class="mt-3">
                        <div class="flex items-center justify-between text-[9.5px] mb-1">
                          <span class="text-[var(--muted)]">پیشرفت شما</span>
                          <span class="font-mono text-[var(--ok)]">${progress}%</span>
                        </div>
                        <div class="h-1.5 rounded-full overflow-hidden" style="background:var(--surface-3);">
                          <div class="h-full rounded-full" style="width:${progress}%;background:var(--ok);"></div>
                        </div>
                      </div>` : ''}

                    <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--line)] text-[10.5px]">
                        <span class="flex items-center gap-1 text-[var(--muted)]"><i data-lucide="play-circle" class="w-3.5 h-3.5 text-[var(--accent)]"></i> ${faNum(ch.lesson_count)} درس تعاملی</span>
                        <span class="flex items-center gap-1 text-[var(--muted)]"><i data-lucide="help-circle" class="w-3.5 h-3.5 text-[var(--accent-2)]"></i> ${faNum(qCount)} سنجه</span>
                        <span class="font-bold text-[var(--accent)]">ورود ←</span>
                      </div>
                    </article>`;
                }).join('')}
              </div>
            </section>`);
        }

        container.innerHTML = `
        <div class="qc-shell qc-section space-y-6">
          <header class="space-y-4 qc-reveal">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span class="qc-eyebrow">CURRICULUM MAP</span>
                <h1 class="qc-h2 mt-1.5">نقشه یادگیری فیزیک</h1>
                <p class="text-[11.5px] text-[var(--muted)] mt-1">سرفصل‌های تخصصی فیزیک، منطبق بر کتاب رسمی و کتب تکمیلی سمپاد</p>
              </div>
              <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.store.setView('materials')">
                <i data-lucide="file-text" class="w-3.5 h-3.5"></i> درسنامه‌ها و جزوات
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div class="qc-tabs" role="tablist" aria-label="انتخاب پایه">
                ${grades.map(g => `
                <button type="button" role="tab" aria-selected="${Number(g.id) === Number(activeGradeId)}"
                        class="qc-tab ${Number(g.id) === Number(activeGradeId) ? 'is-active' : ''}"
                        onclick="window.store.setView('curriculum', { id: ${g.id} })">
                  ${g.title_fa}
                  ${user && Number(user.grade_id) === Number(g.id) ? '<span class="ms-1 text-[9px] opacity-80">• پایه شما</span>' : ''}
                </button>`).join('')}
              </div>
              <span class="qc-chip qc-chip--mono" style="font-size:9.5px;">${faNum(totalChapters)} فصل فیزیک</span>
              ${user ? `<span class="qc-chip qc-chip--ok" style="font-size:9.5px;">${faNum(completedChapters)} فصل تکمیل‌شده</span>` : ''}
            </div>
          </header>

          ${!user ? `
          <div class="qc-card qc-card--p qc-reveal" style="border-color:var(--accent-line);background:linear-gradient(120deg,var(--accent-soft),var(--surface));">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p class="text-[11.5px] text-[var(--ink-2)] leading-[1.9]">
                برای ذخیره پیشرفت درسی، شرکت در آزمون‌ها و دریافت مدال، وارد حساب دانش‌آموزی خود شوید.
              </p>
              <div class="flex gap-2 shrink-0">
                <button type="button" class="qc-btn qc-btn--sm" onclick="window.openAuthModal('login')">ورود</button>
                <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.openAuthModal('register')">ثبت‌نام</button>
              </div>
            </div>
          </div>` : ''}

          <div class="qc-card qc-card--p qc-ticks qc-reveal" style="background:linear-gradient(120deg,var(--surface),var(--surface-2));">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="grid place-items-center w-12 h-12 rounded-2xl font-black text-xl shrink-0" style="background:var(--accent-soft);color:var(--accent);border:1px solid var(--accent-line);">
                  ${activeGrade.number ? Number(activeGrade.number).toLocaleString('fa-IR') : (Number(activeGradeId) === 1 ? '۷' : Number(activeGradeId) === 2 ? '۸' : '۹')}
                </span>
                <div>
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="qc-chip ${isRegisteredGrade ? 'qc-chip--ok' : 'qc-chip--accent'}" style="font-size:9px;">
                      ${isRegisteredGrade ? 'پایه ثبت‌نامی شما' : 'مطالعه آزاد سرفصل‌ها'}
                    </span>
                    <span class="qc-chip qc-chip--mono" style="font-size:9px;">${books.length} منبع · ${faNum(totalChapters)} فصل</span>
                  </div>
                  <h2 class="text-[15px] font-black text-[var(--ink)] mt-1.5">برنامه درسی فیزیک ${activeGrade.title_fa}</h2>
                </div>
              </div>
              ${user && user.grade_id && Number(user.grade_id) !== Number(activeGradeId) ? `
              <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('curriculum', { id: ${user.grade_id} })">بازگشت به پایه من</button>` : ''}
            </div>
          </div>

          ${accessDenied ? `
          <div class="qc-empty">
            <i data-lucide="lock" class="w-8 h-8 text-[var(--warn)]"></i>
            <span class="qc-empty__title">دسترسی به این پایه محدود است</span>
            <span class="qc-empty__text">سامانه تنها اجازه مطالعه منابع پایه ثبت‌نامی شما را می‌دهد. برای مشاهده این پایه، از حساب کاربری مربوط به آن استفاده کنید.</span>
            <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('curriculum', { id: ${user && user.grade_id ? user.grade_id : 1} })">بازگشت به پایه من</button>
          </div>` : ''}

          ${loadError ? `
          <div class="qc-empty">
            <i data-lucide="satellite-dish" class="w-8 h-8 text-[var(--danger)]"></i>
            <span class="qc-empty__title">بارگذاری منابع ممکن نشد</span>
            <span class="qc-empty__text">${loadError.message}</span>
          </div>` : ''}

          ${!accessDenied && !loadError && books.length === 0 ? `
          <div class="qc-empty">
            <i data-lucide="book-x" class="w-8 h-8"></i>
            <span class="qc-empty__title">منبعی برای این پایه ثبت نشده است</span>
            <span class="qc-empty__text">به‌زودی منابع این پایه از سوی دبیرخانه منتشر می‌شود.</span>
          </div>` : ''}

          <div class="space-y-7">${bookBlocks.join('')}</div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.qcRevealScan) window.qcRevealScan(container);
        if (window.renderMathInPage) window.renderMathInPage(container);
    } catch (e) {
        container.innerHTML = `
        <div class="qc-shell qc-section">
          <div class="qc-empty">
            <i data-lucide="satellite-dish" class="w-8 h-8 text-[var(--danger)]"></i>
            <span class="qc-empty__title">بارگذاری سرفصل‌ها ممکن نشد</span>
            <span class="qc-empty__text">${e.message}</span>
            <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('landing')">بازگشت</button>
          </div>
        </div>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

// ==========================================
// VIEW: CHAPTER DETAIL & LESSON LIST
// ==========================================
async function renderChapterDetailView(container, chapterId) {
    container.innerHTML = `<div class="qc-shell qc-loading"><div class="qc-spinner"></div><span>در حال بارگذاری فصل…</span></div>`;

    if (!chapterId) {
        container.innerHTML = `<div class="qc-shell qc-section"><div class="qc-empty"><i data-lucide="compass" class="w-8 h-8"></i><span class="qc-empty__title">فصلی انتخاب نشده است</span><button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('curriculum')">بازگشت به سرفصل‌ها</button></div></div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    try {
        const ch = await window.api.getChapter(chapterId);
        const lessons = Array.isArray(ch.lessons) ? ch.lessons : [];
        const faNum = (n) => { try { return Number(n || 0).toLocaleString('fa-IR'); } catch (e) { return String(n); } };
        const totalMinutes = lessons.reduce((sum, l) => sum + (Number(l.estimated_minutes) || 0), 0);
        const completed = lessons.filter(l => l.is_completed).length;

        container.innerHTML = `
        <div class="qc-shell qc-section space-y-5">
          <header class="qc-card qc-card--p qc-ticks qc-reveal">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="qc-chip qc-chip--accent qc-chip--mono" style="font-size:9.5px;">فصل ${faNum(ch.chapter_number)}</span>
              ${ch.grade_number ? `<span class="qc-chip qc-chip--mono" style="font-size:9px;">GRADE ${faNum(ch.grade_number)}</span>` : ''}
              ${ch.book_title_fa ? `<span class="qc-chip" style="font-size:9px;">${ch.book_title_fa}</span>` : ''}
              ${ch.source_pages ? `<span class="qc-chip" style="font-size:9px;">${ch.source_pages}</span>` : ''}
            </div>
            <h1 class="qc-h2 mt-3">${window.qcEscape(ch.title_fa)}</h1>
            <p class="qc-lede mt-2" style="max-width:66ch;">${window.qcEscape(ch.description_fa || '')}</p>

            <div class="grid grid-cols-3 gap-2 mt-4">
              <div class="qc-readout"><span class="qc-readout__label">درس تعاملی</span><span class="qc-readout__value" style="font-size:.95rem;">${faNum(lessons.length)}</span></div>
              <div class="qc-readout"><span class="qc-readout__label">زمان تقریبی</span><span class="qc-readout__value" style="font-size:.95rem;">${faNum(totalMinutes)} <span style="font-size:.6rem;color:var(--muted)">دقیقه</span></span></div>
              <div class="qc-readout"><span class="qc-readout__label">تکمیل‌شده</span><span class="qc-readout__value" style="font-size:.95rem;color:var(--ok);">${faNum(completed)}</span></div>
            </div>

            ${ch.objectives_fa ? `
            <div class="mt-4 p-3.5 rounded-xl" style="background:var(--accent-soft);border:1px solid var(--accent-line);">
              <span class="block text-[11px] font-black text-[var(--accent)] mb-1">اهداف یادگیری فصل</span>
              <div class="text-[11.5px] leading-[2] text-[var(--ink-2)] whitespace-pre-line">${window.qcEscape(ch.objectives_fa)}</div>
            </div>` : ''}

            ${ch.prerequisites_fa ? `
            <div class="mt-2.5 p-3.5 rounded-xl" style="background:var(--surface-2);border:1px solid var(--line);">
              <span class="block text-[11px] font-black text-[var(--muted)] mb-1">پیش‌نیازها</span>
              <div class="text-[11px] leading-[1.95] text-[var(--ink-2)] whitespace-pre-line">${window.qcEscape(ch.prerequisites_fa)}</div>
            </div>` : ''}
          </header>

          <section class="space-y-3">
            <div class="qc-section-head" style="margin-bottom:.2rem;">
              <div>
                <span class="qc-section-head__index">LEARNING PATH</span>
                <h2 class="text-sm font-black text-[var(--ink)] mt-1">دروس تعاملی فصل</h2>
              </div>
              <span class="qc-chip qc-chip--mono" style="font-size:9.5px;">${faNum(lessons.length)} درس · ${faNum(ch.question_count || 0)} سنجه</span>
            </div>

            <div class="space-y-2.5">
              ${lessons.length ? lessons.map((l, i) => {
                  const simType = window.physicsSimulators ? window.physicsSimulators.getSimulatorForLesson(l, ch) : null;
                  return `
                  <div class="qc-card qc-card--hover qc-card--p qc-reveal" data-delay="${(i % 4) + 1}">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div class="flex items-start gap-3 min-w-0">
                        <span class="grid place-items-center w-9 h-9 rounded-xl shrink-0 text-[11px] font-black" style="${l.is_completed ? 'background:var(--ok-soft);color:var(--ok);border:1px solid var(--ok);' : 'background:var(--accent-soft);color:var(--accent);border:1px solid var(--accent-line);'}">
                          ${l.is_completed ? '<i data-lucide="check" class="w-4 h-4"></i>' : faNum(i + 1)}
                        </span>
                        <div class="min-w-0">
                          <h3 class="text-[12.5px] font-black text-[var(--ink)]">${window.qcEscape(l.title_fa)}</h3>
                          <div class="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-[var(--muted)]">
                            <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>${faNum(l.estimated_minutes)} دقیقه</span>
                            <span class="flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3 text-[var(--warn)]"></i>+${faNum(l.xp_reward)} XP</span>
                            <span class="flex items-center gap-1"><i data-lucide="pencil-line" class="w-3 h-3"></i>${faNum(l.exercise_count)} تمرین</span>
                            ${l.is_completed ? '<span class="qc-chip qc-chip--ok" style="font-size:8.5px;">تکمیل‌شده</span>' : ''}
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        ${simType ? `
                        <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.store.setView('simulators', { id: '${simType}' })">
                          <i data-lucide="flask-conical" class="w-3.5 h-3.5"></i> آزمایشگاه
                        </button>` : ''}
                        <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('lesson', { id: ${l.id} })">
                          ${l.is_completed ? 'مرور درس' : 'شروع درس'} <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    </div>
                  </div>`;
              }).join('') : `
              <div class="qc-empty">
                <i data-lucide="book-x" class="w-8 h-8"></i>
                <span class="qc-empty__title">درسی برای این فصل ثبت نشده است</span>
              </div>`}
            </div>
          </section>

          ${ch.exam_id ? `
          <section class="qc-card qc-card--p qc-reveal" style="border-color:var(--accent-line);background:linear-gradient(120deg,var(--accent-soft),var(--surface));">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="qc-chip qc-chip--accent" style="font-size:9px;">ارزیابی پایان فصل</span>
                <h3 class="text-[14px] font-black text-[var(--ink)] mt-2">${window.qcEscape(ch.exam_title_fa || 'آزمون جامع فصل')}</h3>
                <p class="text-[11px] text-[var(--muted)] mt-1">سؤالات تستی و تشریحی با تصحیح هوشمند و بارم‌بندی استاندارد</p>
              </div>
              <button type="button" class="qc-btn qc-btn--lg shrink-0" onclick="window.store.setView('exam', { id: ${ch.exam_id} })">
                <i data-lucide="play" class="w-4 h-4"></i> شرکت در آزمون فصل
              </button>
            </div>
          </section>` : ''}
        </div>`;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) window.renderMathInPage(container);
        if (window.qcRevealScan) window.qcRevealScan(container);
    } catch (e) {
        container.innerHTML = `
        <div class="qc-shell qc-section">
          <div class="qc-empty">
            <i data-lucide="book-x" class="w-8 h-8 text-[var(--danger)]"></i>
            <span class="qc-empty__title">فصل مورد نظر یافت نشد</span>
            <span class="qc-empty__text">${e.message}</span>
            <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('curriculum')">بازگشت به سرفصل‌ها</button>
          </div>
        </div>`;
        if (window.lucide) window.lucide.createIcons();
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
    const isRegister = mode === 'register';

    const backdrop = document.createElement('div');
    backdrop.id = 'auth-modal-backdrop';
    backdrop.className = 'qc-overlay';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    backdrop.innerHTML = `
    <div class="qc-modal" style="max-width:860px;">
      <div class="grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr]">

        <!-- Observatory panel -->
        <aside class="relative hidden lg:flex flex-col justify-between p-7 overflow-hidden qc-dark-island"
               style="background:linear-gradient(160deg,#07101f,#0b1730 58%,#12133a);color:#eaf3ff;">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="qc-brand__mark" style="width:34px;height:34px;"><i data-lucide="atom" class="w-4 h-4"></i></span>
              <div>
                <div class="text-[12px] font-black">انجمن فیزیک شهید بهشتی دو</div>
                <div class="font-mono text-[8.5px] tracking-[.18em] text-[#7dd3fc]">SAMPAD PHYSICS SOCIETY</div>
              </div>
            </div>

            <h2 class="mt-8 text-[22px] font-black leading-[1.45]">
              کیهان،<br><span style="background:linear-gradient(96deg,#38bdf8,#818cf8,#a78bfa);-webkit-background-clip:text;background-clip:text;color:transparent;">آزمایشگاه ماست.</span>
            </h2>
            <p class="mt-3 text-[11px] leading-[2] text-[#a9c1de]">
              حساب دانش‌آموزی شما، پیشرفت درس‌به‌درس، مدال‌ها، سابقه آزمایشگاهی و رتبه علمی را به‌صورت دائمی ذخیره می‌کند.
            </p>

            <div class="mt-6 space-y-2.5">
              ${[
                ['book-open', 'درسنامه‌های تعاملی و نقشه یادگیری'],
                ['flask-conical', 'آزمایشگاه‌های استاندارد PhET با ثبت داده'],
                ['target', 'آزمون تطبیقی با تخمین توانمندی'],
                ['sparkles', 'معلم هوشمند سقراطی در کنار شما']
              ].map(x => `
              <div class="flex items-center gap-2.5 text-[10.5px] text-[#c6d8ee]">
                <span class="grid place-items-center w-7 h-7 rounded-lg" style="background:rgba(56,189,248,.14);border:1px solid rgba(56,189,248,.32);color:#7dd3fc;">
                  <i data-lucide="${x[0]}" class="w-3.5 h-3.5"></i>
                </span>
                <span>${x[1]}</span>
              </div>`).join('')}
            </div>
          </div>

          <div class="mt-8">
            <div class="qc-orbit" style="max-width:150px;margin-inline:0;">
              <span class="qc-orbit__ring"></span>
              <span class="qc-orbit__ring"></span>
              <span class="qc-orbit__ring"></span>
              <span class="qc-orbit__core"></span>
            </div>
            <div class="mt-4 flex items-center justify-between text-[9px] font-mono text-[#7f9ec4]" dir="ltr">
              <span>λ = h / p</span><span>F = G m₁m₂ / r²</span>
            </div>
          </div>
        </aside>

        <!-- Form panel -->
        <section class="p-5 sm:p-7">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="qc-eyebrow">${isRegister ? 'ACCOUNT CREATION' : 'SECURE SIGN-IN'}</span>
              <h3 class="text-[17px] font-black text-[var(--ink)] mt-1.5">${isRegister ? 'ثبت‌نام دانش‌آموزی' : 'ورود به پرتال علمی'}</h3>
              <p class="text-[10.5px] text-[var(--muted)] mt-1">${isRegister ? 'برای شروع مسیر پژوهشی، اطلاعات زیر را تکمیل کنید.' : 'با نام کاربری و رمز عبور خود وارد شوید.'}</p>
            </div>
            <button type="button" onclick="document.getElementById('auth-modal-backdrop').remove()" class="qc-icon-btn" aria-label="بستن">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <div class="qc-tabs mt-4 w-full" role="tablist">
            <button type="button" class="qc-tab ${!isRegister ? 'is-active' : ''}" role="tab" aria-selected="${!isRegister}" onclick="openAuthModal('login')">ورود</button>
            <button type="button" class="qc-tab ${isRegister ? 'is-active' : ''}" role="tab" aria-selected="${isRegister}" onclick="openAuthModal('register')">ثبت‌نام</button>
          </div>

          <div id="auth-error-banner" class="hidden mt-3 p-3 rounded-xl animate-shake" style="background:var(--danger-soft);border:1px solid var(--danger);color:var(--danger);">
            <div class="flex items-center gap-2 text-[11px] font-bold">
              <i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>
              <span id="auth-error-message"></span>
            </div>
          </div>

          <form id="auth-form" onsubmit="handleAuthSubmit(event, '${isRegister ? 'register' : 'login'}')" class="mt-4 space-y-3.5" novalidate>
            ${isRegister ? `
            <div class="qc-field">
              <label class="qc-label" for="auth-fullname">نام و نام خانوادگی</label>
              <input type="text" id="auth-fullname" required placeholder="مثال: امیررضا علوی" autocomplete="name" class="qc-input" />
            </div>

            <div class="qc-field">
              <label class="qc-label">پایه تحصیلی</label>
              <input type="hidden" id="auth-grade" value="1" />
              <div class="grid grid-cols-3 gap-2" id="grade-selector-cards">
                <button type="button" onclick="selectAuthGrade(1)" id="grade-card-1" class="p-2.5 rounded-xl text-center transition-all is-active" style="border:1px solid var(--accent);background:var(--accent-soft);">
                  <span class="block text-[11.5px] font-black text-[var(--ink)]">هفتم</span>
                  <span class="block text-[9px] text-[var(--muted)] mt-0.5">گرما و انرژی</span>
                </button>
                <button type="button" onclick="selectAuthGrade(2)" id="grade-card-2" class="p-2.5 rounded-xl text-center transition-all" style="background:var(--surface-2);border:1px solid var(--line);">
                  <span class="block text-[11px] font-bold text-[var(--ink-2)]">هشتم</span>
                  <span class="block text-[9px] text-[var(--muted)] mt-0.5">الکتریسیته و نور</span>
                </button>
                <button type="button" onclick="selectAuthGrade(3)" id="grade-card-3" class="p-2.5 rounded-xl text-center transition-all" style="background:var(--surface-2);border:1px solid var(--line);">
                  <span class="block text-[11px] font-bold text-[var(--ink-2)]">نهم</span>
                  <span class="block text-[9px] text-[var(--muted)] mt-0.5">حرکت و نیرو</span>
                </button>
              </div>
            </div>` : ''}

            <div class="qc-field">
              <label class="qc-label" for="auth-username">نام کاربری</label>
              <div class="relative">
                <input type="text" id="auth-username" required placeholder="نام کاربری خود را وارد کنید" autocomplete="username" class="qc-input" style="padding-inline-start:2.2rem;" dir="ltr" />
                <i data-lucide="at-sign" class="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-[var(--muted)]" style="inset-inline-start:.75rem;"></i>
              </div>
            </div>

            <div class="qc-field">
              <label class="qc-label" for="auth-password">رمز عبور</label>
              <div class="relative">
                <input type="password" id="auth-password" required placeholder="${isRegister ? 'حداقل ۸ کاراکتر شامل عدد و نماد' : '••••••••'}" autocomplete="${isRegister ? 'new-password' : 'current-password'}" class="qc-input" style="padding-inline-start:2.2rem;${isRegister ? "padding-inline-end:2.2rem;" : ''}" dir="ltr"
                  ${isRegister ? 'oninput="updatePasswordStrength(this.value, \'auth-reg-strength\')"' : ''} />
                <button type="button" onclick="togglePasswordVisibility('auth-password', this)" class="absolute top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--accent)]" style="inset-inline-end:.7rem;" aria-label="نمایش رمز عبور">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </div>
              <div id="auth-reg-strength" class="mt-1.5"></div>
            </div>

            ${isRegister ? `
            <label class="flex items-start gap-2 text-[10px] leading-[1.9] text-[var(--muted)] cursor-pointer">
              <input type="checkbox" id="auth-terms" class="mt-1 accent-[var(--accent)]" checked />
              <span>با <a href="/docs/STUDENT_GUIDE.md" target="_blank" rel="noopener noreferrer" class="text-[var(--accent)] font-bold underline">آیین‌نامه آموزشی</a> و قواعد استفادهٔ علمی سامانه موافقم.</span>
            </label>` : `
            <div class="flex items-center justify-between text-[10px]">
              <label class="flex items-center gap-1.5 text-[var(--muted)] cursor-pointer"><input type="checkbox" class="accent-[var(--accent)]" checked /> مرا به خاطر بسپار</label>
              <span class="text-[var(--muted-2)]">بازیابی رمز از طریق دبیر انجام می‌شود</span>
            </div>`}

            <button type="submit" id="auth-submit-btn" class="qc-btn qc-btn--block qc-btn--lg" style="margin-top:.35rem;">
              <i data-lucide="${isRegister ? 'user-plus' : 'log-in'}" class="w-4 h-4"></i>
              <span>${isRegister ? 'تکمیل ثبت‌نام و شروع یادگیری' : 'ورود به حساب کاربری'}</span>
            </button>
          </form>

          <div class="mt-4 pt-3 border-t border-[var(--line)] text-center text-[10.5px] text-[var(--muted)]">
            ${isRegister ? 'قبلاً ثبت‌نام کرده‌اید؟' : 'دانش‌آموز جدید هستید؟'}
            <button type="button" onclick="openAuthModal('${isRegister ? 'login' : 'register'}')" class="font-black text-[var(--accent)] hover:underline">${isRegister ? 'وارد شوید' : 'ثبت‌نام کنید'}</button>
          </div>
        </section>
      </div>
    </div>`;

    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', (ev) => {
        if (ev.target === backdrop) backdrop.remove();
    });
    document.addEventListener('keydown', function onEsc(ev) {
        if (ev.key === 'Escape') {
            const el = document.getElementById('auth-modal-backdrop');
            if (el) el.remove();
            document.removeEventListener('keydown', onEsc);
        }
    });
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
        const first = document.getElementById(isRegister ? 'auth-fullname' : 'auth-username');
        if (first) first.focus();
    }, 60);
}

function selectAuthGrade(gradeNum) {
    const input = document.getElementById('auth-grade');
    if (input) input.value = gradeNum;

    [1, 2, 3].forEach(g => {
        const card = document.getElementById('grade-card-' + g);
        if (!card) return;
        const on = g === gradeNum;
        card.style.background = on ? 'var(--accent-soft)' : 'var(--surface-2)';
        card.style.border = on ? '1px solid var(--accent)' : '1px solid var(--line)';
        card.style.boxShadow = on ? '0 10px 24px -18px var(--accent)' : 'none';
        const title = card.querySelector('span');
        if (title) title.className = on ? 'block text-[11.5px] font-black text-[var(--ink)]' : 'block text-[11px] font-bold text-[var(--ink-2)]';
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
    if (!val) { container.innerHTML = ''; return; }

    let score = 0;
    if (val.length >= 8) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[a-z]/i.test(val) && /[^a-zA-Z0-9]/.test(val)) score++;
    if (val.length >= 12) score++;

    const level = score >= 4 ? 'strong' : score >= 3 ? 'medium' : 'weak';
    const klass = level === 'strong' ? 'strength-strong' : level === 'medium' ? 'strength-medium' : 'strength-weak';
    const label = level === 'strong' ? 'قوی و امن' : level === 'medium' ? 'متوسط' : 'ضعیف';
    const color = level === 'strong' ? 'var(--ok)' : level === 'medium' ? 'var(--warn)' : 'var(--danger)';

    container.innerHTML = `
    <div class="${klass}">
      <div class="flex items-center justify-between text-[10px] font-bold mb-1" style="color:${color};">
        <span>قدرت رمز عبور: ${label}</span>
        <span class="font-mono">${val.length} / 8+</span>
      </div>
      <div class="strength-track">
        <div class="strength-seg seg-1"></div>
        <div class="strength-seg seg-2"></div>
        <div class="strength-seg seg-3"></div>
      </div>
    </div>`;
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
    backdrop.className = 'qc-overlay';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    backdrop.innerHTML = `
    <div class="qc-modal" style="max-width:520px;">
      <div class="qc-modal__head" style="border-bottom-color:rgba(251,191,36,.4);">
        <div class="flex items-center gap-3">
          <span class="grid place-items-center w-11 h-11 rounded-xl shrink-0" style="background:var(--warn-soft);color:var(--warn);border:1px solid rgba(251,191,36,.4);">
            <i data-lucide="shield-alert" class="w-5 h-5"></i>
          </span>
          <div>
            <h2 class="text-[15px] font-black text-[var(--ink)]">تغییر اجباری گذرواژه</h2>
            <p class="text-[10.5px] text-[var(--warn)] mt-0.5">الزام امنیتی — پیش از ورود به پرتال</p>
          </div>
        </div>
      </div>

      <div class="qc-modal__body space-y-4">
        <p class="text-[11px] leading-[2] text-[var(--ink-2)] p-3 rounded-xl" style="background:var(--surface-2);border:1px solid var(--line);">
          حساب مدیریتی شما با رمز پیش‌فرض فعال است. برای حفاظت از داده‌های آموزشی، تعیین گذرواژه‌ای جدید با حداقل ۸ کاراکتر الزامی است.
        </p>

        <form id="forced-pw-form" onsubmit="handleForcedPasswordSubmit(event)" class="space-y-3">
          <div id="forced-pw-error" class="hidden p-2.5 rounded-lg animate-shake text-[11px] font-bold" style="background:var(--danger-soft);border:1px solid var(--danger);color:var(--danger);"></div>

          <div class="qc-field">
            <label class="qc-label" for="forced-curr-pw">گذرواژه فعلی</label>
            <div class="relative">
              <input type="password" id="forced-curr-pw" required placeholder="گذرواژه فعلی" autocomplete="current-password" class="qc-input" dir="ltr" />
              <button type="button" onclick="togglePasswordVisibility('forced-curr-pw', this)" class="absolute top-1/2 -translate-y-1/2 text-[var(--muted)]" style="inset-inline-end:.7rem;" aria-label="نمایش گذرواژه">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="qc-field">
            <label class="qc-label" for="forced-new-pw">گذرواژه جدید</label>
            <div class="relative">
              <input type="password" id="forced-new-pw" required minlength="8" placeholder="حداقل ۸ کاراکتر" autocomplete="new-password" class="qc-input" dir="ltr"
                oninput="updatePasswordStrength(this.value, 'forced-strength-container')" />
              <button type="button" onclick="togglePasswordVisibility('forced-new-pw', this)" class="absolute top-1/2 -translate-y-1/2 text-[var(--muted)]" style="inset-inline-end:.7rem;" aria-label="نمایش گذرواژه">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
            <div id="forced-strength-container" class="mt-1.5"></div>
          </div>

          <div class="qc-field">
            <label class="qc-label" for="forced-confirm-pw">تکرار گذرواژه جدید</label>
            <div class="relative">
              <input type="password" id="forced-confirm-pw" required minlength="8" placeholder="تکرار گذرواژه جدید" autocomplete="new-password" class="qc-input" dir="ltr" />
              <button type="button" onclick="togglePasswordVisibility('forced-confirm-pw', this)" class="absolute top-1/2 -translate-y-1/2 text-[var(--muted)]" style="inset-inline-end:.7rem;" aria-label="نمایش گذرواژه">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <button type="submit" id="forced-submit-btn" class="qc-btn qc-btn--block qc-btn--lg">
            <i data-lucide="key" class="w-4 h-4"></i>
            <span>ثبت گذرواژه جدید و ورود به پرتال</span>
          </button>
        </form>
      </div>
    </div>`;

    document.body.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => { const el = document.getElementById('forced-curr-pw'); if (el) el.focus(); }, 60);
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
    const viewName = (window.store && window.store.currentView) || 'landing';
    const viewParams = (window.store && window.store.viewParams) || {};
    let summary = 'صفحه اصلی پرتال';
    let chapterId = null;
    let lessonId = null;
    let questionId = null;
    let snippet = '';

    const pageTitle = () => {
        const el = document.querySelector('#app-main-content h1');
        return el ? el.innerText.trim().replace(/\s+/g, ' ') : '';
    };

    if (viewName === 'lesson') {
        summary = 'درس: ' + (pageTitle() || 'درسنامه تعاملی فیزیک');
        lessonId = viewParams.id || null;
        const mainContent = document.getElementById('app-main-content');
        if (mainContent) snippet = mainContent.innerText.slice(0, 1200).replace(/\s+/g, ' ');
    } else if (viewName === 'chapter') {
        summary = 'فصل: ' + (pageTitle() || 'فصل فیزیک');
        chapterId = viewParams.id || null;
        const mainContent = document.getElementById('app-main-content');
        if (mainContent) snippet = mainContent.innerText.slice(0, 900).replace(/\s+/g, ' ');
    } else if (viewName === 'exam') {
        summary = 'آزمون پایان فصل فیزیک';
        const qPrompt = document.querySelector('.exam-question-prompt, #app-main-content h2');
        if (qPrompt) snippet = qPrompt.innerText.slice(0, 400);
    } else if (document.getElementById('comp-active-modal')) {
        summary = 'میدان رقابت و لیگ کوانتومی';
        const modal = document.getElementById('comp-active-modal');
        if (modal) snippet = modal.innerText.slice(0, 400);
    } else if (viewName === 'curriculum') {
        summary = 'سرفصل‌های فیزیک پایه';
    } else if (viewName === 'materials') {
        summary = 'درسنامه‌ها و جزوات فیزیک';
    } else if (viewName === 'simulators') {
        summary = 'آزمایشگاه تعاملی PhET';
    } else if (viewName === 'competitions' || viewName === 'duel' || viewName === 'guilds') {
        summary = 'آرنای رقابت کوانتومی';
    } else if (viewName === 'dashboard') {
        summary = 'داشبورد دانش‌آموز';
    } else if (viewName === 'admin') {
        summary = 'پنل مدیریت آموزشی';
    } else if (viewName === 'adaptive-exam') {
        summary = 'آزمون تطبیقی (IRT)';
    } else if (viewName === 'live-lab') {
        summary = 'کلاس زنده دبیر';
    } else {
        summary = 'صفحه ' + viewName;
    }

    return { view_name: viewName, summary, chapterId, lessonId, questionId, snippet };
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
    userMsg.className = 'qc-chat-bubble--user';
    userMsg.textContent = query;
    chatBody.appendChild(userMsg);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'qc-chat-bubble--bot flex items-center gap-2';
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
        tutorMsg.className = 'qc-chat-bubble--bot space-y-2.5';
        
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
        errMsg.className = 'p-3 rounded-xl text-xs font-bold';
        errMsg.style.background = 'var(--danger-soft)';
        errMsg.style.border = '1px solid var(--danger)';
        errMsg.style.color = 'var(--danger)';
        errMsg.textContent = `خطا در دریافت پاسخ: ${err.message}`;
        chatBody.appendChild(errMsg);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

async function renderSimulatorsCatalogView(container, activeSim = 'density', currentMode = 'native', gradeFilter = 'all') {
    const simCatalog = window.physicsSimulators ? window.physicsSimulators.catalog : [];
    const normalizedSimId = (activeSim === 'energy-skate-park') ? 'energy-skate' : activeSim;
    const activeLab = simCatalog.find(s => s.id === normalizedSimId || s.id === activeSim || (s.aliases && s.aliases.includes(activeSim))) || simCatalog[0] || {
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
async function renderStudyMaterialsView(initialFilter = null) {
    // Supports both renderStudyMaterialsView(container, gradeId) — used by the
    // router — and a direct grade filter call from the UI.
    let container = document.getElementById('app-view');
    let activeGradeId = initialFilter;
    const firstArg = arguments.length > 0 ? arguments[0] : null;
    if (firstArg && typeof firstArg === 'object' && firstArg.nodeType === 1) {
        container = firstArg;
        activeGradeId = arguments.length > 1 ? arguments[1] : null;
    }
    if (!container) container = document.getElementById('app-inner');
    if (!container) return;

    container.innerHTML = `<div class="qc-loading"><div class="qc-spinner"></div><div>در حال بارگذاری بانک منابع…</div></div>`;

    try {
        const user = window.store.currentUser;
        let selectedGrade = activeGradeId ? parseInt(activeGradeId, 10) : (user && user.grade_id ? Number(user.grade_id) : null);
        let selectedCategory = null;

        const categoryMeta = {
            pamphlet: { title: 'جزوه و درسنامه', icon: 'book-open', tone: 'accent' },
            summary: { title: 'خلاصه و فرمول‌نامه', icon: 'sigma', tone: 'ok' },
            exam_sample: { title: 'نمونه سؤال با پاسخ', icon: 'clipboard-check', tone: 'warn' },
            slide: { title: 'اسلاید آموزشی', icon: 'presentation', tone: 'violet' },
            other: { title: 'سایر منابع', icon: 'file', tone: 'muted' }
        };

        const faNum = (n) => { try { return Number(n || 0).toLocaleString('fa-IR'); } catch (e) { return String(n); } };

        const sizeLabel = (bytes) => {
            const b = Number(bytes) || 0;
            if (!b) return 'فایل تکمیلی';
            if (b > 1024 * 1024) return (b / (1024 * 1024)).toFixed(1) + ' مگابایت';
            return Math.max(1, Math.round(b / 1024)) + ' کیلوبایت';
        };

        const chipClass = (kind) => {
            if (kind === 'violet') return 'qc-chip--violet';
            if (kind === 'ok') return 'qc-chip--ok';
            if (kind === 'warn') return 'qc-chip--warn';
            if (kind === 'accent') return 'qc-chip--accent';
            return '';
        };

        const renderLibrary = (materials) => {
            container.innerHTML = `
            <div class="qc-shell qc-section space-y-5">
              <header class="space-y-4 qc-reveal">
                <div class="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span class="qc-eyebrow">RESOURCE LIBRARY</span>
                    <h1 class="qc-h2 mt-1.5">درسنامه‌ها، خلاصه‌ها و نمونه سؤال‌ها</h1>
                    <p class="qc-lede mt-2" style="max-width:64ch;">جزوات دبیران، فرمول‌نامه‌های سریع، خلاصه فصول و نمونه سؤالات امتحانی با پاسخ تشریحی — تأییدشده توسط دبیرخانه فیزیک.</p>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="qc-chip qc-chip--ok" style="font-size:9.5px;"><i data-lucide="badge-check" class="w-3.5 h-3.5"></i> تأیید دبیران سمپاد</span>
                    <span class="qc-chip qc-chip--mono" style="font-size:9.5px;">${faNum(materials.length)} فایل</span>
                  </div>
                </div>

                <div class="qc-card qc-card--p" style="padding:.8rem;">
                  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      <span class="text-[10px] font-bold text-[var(--muted)] shrink-0">پایه:</span>
                      <div class="qc-tabs" id="mat-grade-tabs">
                        ${[['', 'همه پایه‌ها'], ['1', 'پایه هفتم'], ['2', 'پایه هشتم'], ['3', 'پایه نهم']].map(g => `
                        <button type="button" class="qc-tab ${String(selectedGrade || '') === g[0] ? 'is-active' : ''}" data-grade="${g[0]}">${g[1]}</button>`).join('')}
                      </div>
                    </div>

                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                      <span class="text-[10px] font-bold text-[var(--muted)] shrink-0">نوع:</span>
                      <div class="qc-tabs" id="mat-category-tabs">
                        ${[['', 'همه'], ['pamphlet', 'جزوه'], ['summary', 'فرمول‌نامه'], ['exam_sample', 'نمونه سؤال'], ['slide', 'اسلاید']].map(c => `
                        <button type="button" class="qc-tab ${String(selectedCategory || '') === c[0] ? 'is-active' : ''}" data-category="${c[0]}">${c[1]}</button>`).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              ${materials.length === 0 ? `
              <div class="qc-empty">
                <i data-lucide="folder-open" class="w-9 h-9"></i>
                <span class="qc-empty__title">منبعی برای این فیلتر یافت نشد</span>
                <span class="qc-empty__text">فیلتر پایه یا نوع منبع را تغییر دهید، یا به‌زودی دوباره سر بزنید.</span>
                <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" id="mat-reset-filters">حذف فیلترها</button>
              </div>` : `
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                ${materials.map((m, i) => {
                    const meta = categoryMeta[m.category] || categoryMeta.other;
                    const ready = Boolean(m.file_url) && m.file_exists_on_disk !== false;
                    return `
                    <article class="qc-card qc-card--p qc-reveal flex flex-col justify-between gap-4" data-delay="${(i % 4) + 1}">
                      <div class="space-y-3">
                        <div class="flex items-center justify-between gap-2">
                          <span class="qc-chip ${chipClass(meta.tone)}" style="font-size:9px;">
                            <i data-lucide="${meta.icon}" class="w-3 h-3"></i> ${meta.title}
                          </span>
                          <span class="qc-chip qc-chip--mono" style="font-size:9px;">${window.qcEscape(m.grade_title_fa || 'عمومی')}</span>
                        </div>

                        <h3 class="text-[13.5px] font-black text-[var(--ink)] leading-snug">${window.qcEscape(m.title_fa)}</h3>
                        ${m.description_fa ? `<p class="text-[11px] leading-[1.95] text-[var(--muted)] line-clamp-3">${window.qcEscape(m.description_fa)}</p>` : ''}

                        <div class="pt-2.5 border-t border-[var(--line)] space-y-1.5 text-[10.5px] text-[var(--muted)]">
                          <div class="flex items-center gap-1.5">
                            <i data-lucide="user-check" class="w-3.5 h-3.5 text-[var(--ok)]"></i>
                            <span>مؤلف: <strong class="text-[var(--ink-2)]">${window.qcEscape(m.author_name || 'دبیرخانه فیزیک')}</strong></span>
                          </div>
                          <div class="flex items-center justify-between">
                            <span class="flex items-center gap-1"><i data-lucide="hard-drive" class="w-3.5 h-3.5"></i>${sizeLabel(m.file_size_bytes)}</span>
                            <span class="flex items-center gap-1 font-mono font-bold text-[var(--ok)]"><i data-lucide="download" class="w-3.5 h-3.5"></i>${faNum(m.download_count)}</span>
                          </div>
                        </div>
                      </div>

                      ${m.file_url ? (ready ? `
                      <a href="${window.qcSafeUrl(m.file_url)}" target="_blank" rel="noopener noreferrer" onclick="window.api.incrementMaterialDownload(${m.id})" class="qc-btn qc-btn--ok qc-btn--block qc-btn--sm">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i> مشاهده و دریافت فایل
                      </a>` : `
                      <button type="button" class="qc-btn qc-btn--warn qc-btn--block qc-btn--sm" onclick="window.qcToast('این فایل در حال بازبینی و به‌روزرسانی توسط دبیر است.', 'warn')">
                        <i data-lucide="clock" class="w-3.5 h-3.5"></i> در حال به‌روزرسانی
                      </button>`) : `
                      <button type="button" class="qc-btn qc-btn--ghost qc-btn--block qc-btn--sm" onclick="window.showComingSoon ? window.showComingSoon('فایل ضمیمه این جزوه') : window.qcToast('این فایل به‌زودی منتشر می‌شود.', 'info')">
                        فایل در دست آماده‌سازی
                      </button>`}
                    </article>`;
                }).join('')}
              </div>`}
            </div>`;

            container.querySelectorAll('#mat-grade-tabs [data-grade]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const v = btn.getAttribute('data-grade');
                    selectedGrade = v ? parseInt(v, 10) : null;
                    load();
                });
            });
            container.querySelectorAll('#mat-category-tabs [data-category]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const v = btn.getAttribute('data-category');
                    selectedCategory = v || null;
                    load();
                });
            });
            const reset = container.querySelector('#mat-reset-filters');
            if (reset) reset.addEventListener('click', () => {
                selectedGrade = null;
                selectedCategory = null;
                load();
            });

            if (window.lucide) window.lucide.createIcons();
            if (window.qcRevealScan) window.qcRevealScan(container);
        };

        const load = async () => {
            const materials = await window.api.getStudyMaterials(selectedGrade, selectedCategory);
            renderLibrary(Array.isArray(materials) ? materials : []);
        };

        await load();
    } catch (err) {
        container.innerHTML = `
        <div class="qc-shell qc-section">
          <div class="qc-empty">
            <i data-lucide="alert-triangle" class="w-8 h-8 text-[var(--danger)]"></i>
            <span class="qc-empty__title">دریافت درسنامه‌ها ممکن نشد</span>
            <span class="qc-empty__text">${err.message}</span>
            <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('curriculum')">بازگشت به سرفصل‌ها</button>
          </div>
        </div>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

window.renderStudyMaterialsView = renderStudyMaterialsView;

