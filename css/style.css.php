<?php
/**
 * QUANTUM CUT — Observatory Design System (Pure PHP Edition)
 * ------------------------------------------------------------------
 * "THE UNIVERSE IS OUR LABORATORY"
 *
 * One stylesheet, two complete themes, zero standalone CSS files.
 * Every colour is a semantic token resolved at runtime, so the light
 * and dark themes stay in sync across the public portal, the student
 * dashboard and the administration deck.
 */
declare(strict_types=1);
header('Content-Type: text/css; charset=utf-8');
header('Cache-Control: public, max-age=300');
?>
/* ==================================================================
   01 · DESIGN TOKENS
   ================================================================== */
:root {
    /* Type */
    --font-fa: 'Vazirmatn', 'Vazir', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --font-en: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, 'Courier New', monospace;

    /* Legacy aliases kept for existing components */
    --primary: #0b74d8;
    --primary-hover: #095eb0;
    --success: #0f9d63;
    --warning: #b45309;
    --danger: #dc2626;
    --duo-green: #059669;
    --duo-green-border: #047857;
    --duo-yellow: #d97706;
    --duo-blue: #0284c7;
    --duo-red: #e11d48;
    --duo-purple: #7c3aed;
    --duo-purple-border: #6d28d9;

    /* PhET apparatus palette */
    --phet-navy: #0b2a4a;
    --phet-blue: #0284c7;
    --phet-blue-hover: #0369a1;
    --phet-dark-bg: #060b16;
    --phet-card-bg: #0b1424;
    --phet-border: #1b2b45;
    --phet-border-active: #38bdf8;

    /* Geometry */
    --radius-xs: 8px;
    --radius-sm: 12px;
    --radius: 16px;
    --radius-lg: 22px;
    --radius-xl: 30px;
    --shell: 1280px;
    --header-h: 64px;

    /* Motion */
    --ease-out: cubic-bezier(.16, 1, .3, 1);
    --ease-spring: cubic-bezier(.34, 1.56, .64, 1);
    --dur-fast: .16s;
    --dur: .28s;
    --dur-slow: .6s;
}

/* ---------- DEEP SPACE (DARK) ---------- */
html.dark {
    color-scheme: dark;
    --bg: #050912;
    --bg-2: #070e1b;
    --bg-deep: #03060d;
    --surface: #0b1424;
    --surface-2: #0f1b2e;
    --surface-3: #15243c;
    --surface-glass: rgba(11, 20, 36, .78);
    --surface-glass-strong: rgba(6, 12, 23, .92);
    --line: rgba(140, 172, 226, .14);
    --line-strong: rgba(140, 172, 226, .28);
    --ink: #eef4ff;
    --ink-2: #c6d5ec;
    --muted: #8ea4c4;
    --muted-2: #6e83a3;
    --accent: #38bdf8;
    --accent-soft: rgba(56, 189, 248, .14);
    --accent-line: rgba(56, 189, 248, .38);
    --accent-2: #818cf8;
    --accent-2-soft: rgba(129, 140, 248, .14);
    --accent-3: #a78bfa;
    --accent-3-soft: rgba(167, 139, 250, .14);
    --accent-ink: #04121c;
    --ok: #34d399;
    --ok-soft: rgba(52, 211, 153, .13);
    --warn: #fbbf24;
    --warn-soft: rgba(251, 191, 36, .13);
    --danger: #fb7185;
    --danger-soft: rgba(251, 113, 133, .13);
    --glow: 0 0 0 1px rgba(56, 189, 248, .22), 0 18px 50px -22px rgba(56, 189, 248, .55);
    --card-shadow: 0 1px 0 rgba(255, 255, 255, .04) inset, 0 24px 60px -34px rgba(0, 0, 0, .9);
    --hero-veil: radial-gradient(90% 70% at 15% 0%, rgba(56, 189, 248, .16), transparent 62%),
                 radial-gradient(70% 60% at 88% 8%, rgba(129, 140, 248, .18), transparent 60%),
                 radial-gradient(60% 50% at 50% 100%, rgba(167, 139, 250, .10), transparent 70%);
    --grid-line: rgba(140, 178, 240, .055);
    --selection: #38bdf8;
    --scrollbar: #1b2b45;
}

/* ---------- SCIENTIFIC WHITE (LIGHT) ---------- */
html.light {
    color-scheme: light;
    --bg: #f4f7fc;
    --bg-2: #eaf1fb;
    --bg-deep: #ffffff;
    --surface: #ffffff;
    --surface-2: #f7faff;
    --surface-3: #edf3fc;
    --surface-glass: rgba(255, 255, 255, .82);
    --surface-glass-strong: rgba(255, 255, 255, .94);
    --line: rgba(14, 44, 90, .10);
    --line-strong: rgba(14, 44, 90, .20);
    --ink: #081527;
    --ink-2: #22374f;
    --muted: #5a7192;
    --muted-2: #7489a6;
    --accent: #0b74d8;
    --accent-soft: rgba(11, 116, 216, .09);
    --accent-line: rgba(11, 116, 216, .32);
    --accent-2: #4f46e5;
    --accent-2-soft: rgba(79, 70, 229, .08);
    --accent-3: #7c3aed;
    --accent-3-soft: rgba(124, 58, 237, .08);
    --accent-ink: #ffffff;
    --ok: #0f9d63;
    --ok-soft: rgba(15, 157, 99, .10);
    --warn: #b45309;
    --warn-soft: rgba(180, 83, 9, .10);
    --danger: #dc2626;
    --danger-soft: rgba(220, 38, 38, .09);
    --glow: 0 0 0 1px rgba(11, 116, 216, .16), 0 18px 45px -28px rgba(11, 116, 216, .55);
    --card-shadow: 0 1px 2px rgba(10, 37, 74, .05), 0 22px 48px -34px rgba(10, 37, 74, .40);
    --hero-veil: radial-gradient(90% 70% at 12% 0%, rgba(11, 116, 216, .10), transparent 60%),
                 radial-gradient(70% 60% at 90% 6%, rgba(79, 70, 229, .10), transparent 60%),
                 radial-gradient(60% 50% at 50% 100%, rgba(124, 58, 237, .06), transparent 72%);
    --grid-line: rgba(14, 44, 90, .055);
    --selection: #0b74d8;
    --scrollbar: #c7d6ea;
}

/* ==================================================================
   02 · BASE
   ================================================================== */
* { font-variant-ligatures: normal; text-rendering: optimizeLegibility; }

html, body {
    max-width: 100vw;
    overflow-x: hidden;
    background-color: var(--bg);
}

body {
    direction: rtl;
    text-align: right;
    font-family: var(--font-fa);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: 0;
    width: 100%;
    transition: background-color var(--dur) var(--ease-out), color var(--dur) var(--ease-out);
}

body, button, input, textarea, select { font-family: var(--font-fa); }

::selection { background: var(--selection); color: #04121c; }

h1, h2, h3, h4 { letter-spacing: -.015em; line-height: 1.4; }

a { color: inherit; text-decoration: none; }

:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 6px;
}

/* Persian numerals opt-in */
.fa-num {
    font-feature-settings: "ss01" on;
    -webkit-font-feature-settings: "ss01" on;
}

/* Scientific / Latin isolation */
[dir="ltr"], .font-en, .en-text {
    font-family: var(--font-en) !important;
    direction: ltr;
}
.font-mono, code, pre, kbd, .academic-mono, .sci-term, .math-term {
    font-family: var(--font-mono) !important;
    direction: ltr;
    unicode-bidi: isolate;
    font-feature-settings: "tnum" 1;
}
.quant-unit, .qc-num {
    font-family: var(--font-mono);
    font-feature-settings: "tnum" 1;
    direction: ltr;
    unicode-bidi: isolate;
}

/* Persian body text must never fall back to a monospace face */
[dir="rtl"], .font-fa, .font-sans, body, button, input, textarea, select {
    font-family: var(--font-fa);
    letter-spacing: normal !important;
}

/* Scrollbars */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
    background: var(--scrollbar);
    border-radius: 9999px;
    border: 2px solid var(--bg);
}
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

/* Skip link */
.qc-skip {
    position: fixed;
    inset-inline-start: 50%;
    top: -60px;
    transform: translateX(50%);
    z-index: 200;
    padding: 10px 18px;
    border-radius: 9999px;
    background: var(--accent);
    color: var(--accent-ink);
    font-size: 12px;
    font-weight: 800;
    transition: top var(--dur) var(--ease-out);
}
.qc-skip:focus { top: 12px; }

/* ==================================================================
   03 · APP SHELL / ATMOSPHERE
   ================================================================== */
.qc-atmosphere {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: var(--hero-veil);
}

.qc-grid-veil {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
        linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(120% 90% at 50% 0%, #000 20%, transparent 78%);
    -webkit-mask-image: radial-gradient(120% 90% at 50% 0%, #000 20%, transparent 78%);
    opacity: .9;
}

#physics-particles-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    opacity: .55;
}
html.light #physics-particles-canvas { opacity: .5; }

#app-main-content {
    position: relative;
    z-index: 10;
    width: 100%;
    animation: qc-view-in var(--dur-slow) var(--ease-out) both;
}

@keyframes qc-view-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: none; }
}

html[data-transition="out"] #app-main-content { opacity: .35; transform: translateY(6px); }

/* Scroll progress */
.qc-scroll-progress {
    position: fixed;
    top: 0;
    inset-inline-start: 0;
    height: 2px;
    width: 100%;
    transform: scaleX(0);
    transform-origin: right center;
    background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3));
    z-index: 90;
    pointer-events: none;
}

/* ==================================================================
   04 · TYPOGRAPHY PRIMITIVES
   ================================================================== */
.qc-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--muted);
}
.qc-eyebrow::before {
    content: "";
    width: 22px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent));
}

.qc-display {
    font-size: clamp(1.9rem, 1.1rem + 3.4vw, 3.7rem);
    font-weight: 900;
    line-height: 1.24;
    letter-spacing: -.02em;
    color: var(--ink);
}
.qc-display .qc-gradient-text {
    background: linear-gradient(96deg, var(--accent) 0%, var(--accent-2) 52%, var(--accent-3) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.qc-h2 {
    font-size: clamp(1.35rem, .95rem + 1.4vw, 1.9rem);
    font-weight: 900;
    line-height: 1.4;
    color: var(--ink);
}

.qc-lede {
    font-size: clamp(.9rem, .85rem + .28vw, 1.02rem);
    line-height: 2;
    color: var(--muted);
    max-width: 62ch;
}

.qc-prose { font-size: .9rem; line-height: 2; color: var(--ink-2); }
.qc-prose-fa { line-height: 2.05; }

/* Section rhythm */
.qc-section { position: relative; padding-block: clamp(2.6rem, 1.6rem + 3vw, 4.6rem); }
.qc-section--tight { padding-block: clamp(1.8rem, 1.2rem + 1.6vw, 2.8rem); }
.qc-shell { width: 100%; max-width: var(--shell); margin-inline: auto; padding-inline: 1rem; }
@media (min-width: 640px) { .qc-shell { padding-inline: 1.5rem; } }
@media (min-width: 1024px) { .qc-shell { padding-inline: 2rem; } }

.qc-section-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.6rem;
}
.qc-section-head__index {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .16em;
    color: var(--accent);
    opacity: .85;
}

/* Hairline divider */
.qc-hr {
    height: 1px;
    border: 0;
    background: linear-gradient(90deg, transparent, var(--line-strong), transparent);
}

/* ==================================================================
   05 · SURFACES, CARDS, PANELS
   ================================================================== */
.qc-card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--card-shadow);
    transition: transform var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out),
                box-shadow var(--dur) var(--ease-out), background-color var(--dur) var(--ease-out);
    overflow: hidden;
}
.qc-card--p { padding: clamp(1.05rem, .85rem + .7vw, 1.65rem); }
.qc-card--glass { background: var(--surface-glass); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
.qc-card--hover:hover, a.qc-card:hover, button.qc-card:hover {
    transform: translateY(-3px);
    border-color: var(--accent-line);
    box-shadow: var(--glow), var(--card-shadow);
}
.qc-card--flat { box-shadow: none; }
.qc-card--sunken { background: var(--surface-2); box-shadow: none; }

/* Instrument panel: the "lab equipment" surface */
.qc-panel {
    position: relative;
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: var(--radius);
}
.qc-panel__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .75rem;
    padding: .7rem 1rem;
    border-bottom: 1px solid var(--line);
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .12em;
    color: var(--muted);
    text-transform: uppercase;
}

/* Corner ticks — observatory HUD signature */
.qc-ticks::before,
.qc-ticks::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: var(--accent-line);
    border-style: solid;
    pointer-events: none;
}
.qc-ticks::before { top: 8px; inset-inline-start: 8px; border-width: 1px 0 0 1px; }
.qc-ticks::after { bottom: 8px; inset-inline-end: 8px; border-width: 0 1px 1px 0; }

/* Glass (legacy-compatible) */
.qc-glass,
.quantum-glass,
.glass-modal,
.cyber-card-glass,
.quantum-hud-panel {
    background: var(--surface-glass);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--line);
}
.glass-modal { border-radius: var(--radius-lg); }

/* Legacy academic cards re-themed */
.academic-panel,
.academic-card,
.physics-card-3d,
.grade-theme-7, .grade-theme-8, .grade-theme-9 {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--card-shadow);
    transition: all var(--dur) var(--ease-out);
}
.academic-card:hover,
.physics-card-3d:hover,
.grade-theme-7:hover, .grade-theme-8:hover, .grade-theme-9:hover {
    transform: translateY(-3px);
    border-color: var(--accent-line);
    box-shadow: var(--glow), var(--card-shadow);
}
.academic-hero-glow { background: var(--hero-veil); }

/* Formula surface */
.formula-card,
.katex-card {
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: .9rem 1.1rem;
    font-family: var(--font-mono);
    direction: ltr;
    text-align: center;
    overflow-x: auto;
}

/* ==================================================================
   06 · BUTTONS
   ================================================================== */
.qc-btn {
    --btn-bg: var(--accent);
    --btn-ink: var(--accent-ink);
    --btn-line: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    padding: .68rem 1.15rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--btn-line);
    background: var(--btn-bg);
    color: var(--btn-ink);
    font-size: .8rem;
    font-weight: 800;
    line-height: 1.2;
    cursor: pointer;
    white-space: nowrap;
    transition: transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out),
                background-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
    user-select: none;
}
.qc-btn:hover { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 10px 24px -16px var(--accent); }
.qc-btn:active { transform: translateY(0) scale(.99); }
.qc-btn:disabled, .qc-btn[disabled] { opacity: .55; cursor: not-allowed; transform: none; filter: none; box-shadow: none; }
.qc-btn--lg { padding: .85rem 1.5rem; font-size: .88rem; border-radius: var(--radius); }
.qc-btn--sm { padding: .45rem .8rem; font-size: .72rem; border-radius: 10px; }
.qc-btn--ghost {
    --btn-bg: transparent;
    --btn-ink: var(--ink-2);
    --btn-line: var(--line-strong);
}
.qc-btn--ghost:hover { --btn-bg: var(--surface-2); border-color: var(--accent-line); color: var(--ink); }
.qc-btn--soft {
    --btn-bg: var(--accent-soft);
    --btn-ink: var(--accent);
    --btn-line: var(--accent-line);
}
.qc-btn--violet { --btn-bg: var(--accent-2); --btn-ink: #fff; }
.qc-btn--ok { --btn-bg: var(--ok); --btn-ink: #04140d; }
.qc-btn--ok.qc-btn--soft { --btn-bg: var(--ok-soft); --btn-ink: var(--ok); --btn-line: transparent; }
.qc-btn--warn { --btn-bg: var(--warn); --btn-ink: #1b1203; }
.qc-btn--danger { --btn-bg: var(--danger); --btn-ink: #1d0409; }
.qc-btn--block { width: 100%; }

.qc-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: var(--surface-2);
    color: var(--muted);
    cursor: pointer;
    transition: all var(--dur-fast) var(--ease-out);
}
.qc-icon-btn:hover { color: var(--ink); border-color: var(--accent-line); background: var(--accent-soft); }

/* Legacy button classes re-themed (keeping every existing handler intact) */
.btn-duo-blue, .btn-phet-primary, .btn-duo-green, .btn-duo-yellow, .btn-duo-purple {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .45rem;
    color: #fff;
    border: 1px solid transparent;
    transition: all var(--dur-fast) var(--ease-out);
    font-weight: 800;
}
.btn-duo-blue, .btn-phet-primary { background-color: #0b74d8; box-shadow: 0 4px 14px rgba(11, 116, 216, .22); }
.btn-duo-blue:hover, .btn-phet-primary:hover { background-color: #095eb0; transform: translateY(-1px); }
.btn-duo-green { background-color: #0f9d63; box-shadow: 0 4px 14px rgba(15, 157, 99, .22); }
.btn-duo-green:hover { background-color: #0b8051; transform: translateY(-1px); }
.btn-duo-yellow { background-color: #d97706; box-shadow: 0 4px 14px rgba(217, 119, 6, .22); }
.btn-duo-yellow:hover { background-color: #b45309; transform: translateY(-1px); }
.btn-duo-purple { background-color: #334155; box-shadow: 0 4px 14px rgba(51, 65, 85, .18); }
.btn-duo-purple:hover { background-color: #1e293b; transform: translateY(-1px); }
html.light .btn-duo-purple { background-color: #334155; }

/* ==================================================================
   07 · CHIPS, BADGES, STATUS
   ================================================================== */
.qc-chip {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding: .28rem .65rem;
    border-radius: 9999px;
    border: 1px solid var(--line-strong);
    background: var(--surface-2);
    color: var(--ink-2);
    font-size: .68rem;
    font-weight: 700;
    line-height: 1.4;
}
.qc-chip--accent { background: var(--accent-soft); border-color: var(--accent-line); color: var(--accent); }
.qc-chip--violet { background: var(--accent-2-soft); border-color: rgba(129, 140, 248, .32); color: var(--accent-2); }
.qc-chip--ok { background: var(--ok-soft); border-color: transparent; color: var(--ok); }
.qc-chip--warn { background: var(--warn-soft); border-color: transparent; color: var(--warn); }
.qc-chip--danger { background: var(--danger-soft); border-color: transparent; color: var(--danger); }
.qc-chip--mono { font-family: var(--font-mono); letter-spacing: .04em; }

.qc-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex: none; }
.qc-dot--live { background: var(--ok); box-shadow: 0 0 0 0 rgba(52, 211, 153, .6); animation: qc-live 2.4s ease-out infinite; }
@keyframes qc-live {
    0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, .5); }
    70% { box-shadow: 0 0 0 9px rgba(52, 211, 153, 0); }
    100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
}

.academic-badge {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding: .22rem .6rem;
    border-radius: 9999px;
    font-size: .66rem;
    font-weight: 800;
    border: 1px solid var(--accent-line);
    background: var(--accent-soft);
    color: var(--accent);
}

/* ==================================================================
   08 · FORMS
   ================================================================== */
.qc-field { display: block; }
.qc-label {
    display: block;
    margin-bottom: .4rem;
    font-size: .72rem;
    font-weight: 800;
    color: var(--ink-2);
}
.qc-input,
.qc-select,
.qc-textarea {
    width: 100%;
    padding: .72rem .9rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line-strong);
    background: var(--surface-2);
    color: var(--ink);
    font-size: .82rem;
    line-height: 1.6;
    outline: none;
    transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);
}
.qc-input::placeholder, .qc-textarea::placeholder { color: var(--muted-2); }
.qc-input:hover, .qc-select:hover, .qc-textarea:hover { border-color: var(--accent-line); }
.qc-input:focus, .qc-select:focus, .qc-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
    background: var(--surface);
}
.qc-input:disabled, .qc-select:disabled, .qc-textarea:disabled { opacity: .6; cursor: not-allowed; }
.qc-input--error { border-color: var(--danger); box-shadow: 0 0 0 3px var(--danger-soft); }
.qc-help { margin-top: .35rem; font-size: .68rem; color: var(--muted); }
.qc-error { margin-top: .35rem; font-size: .7rem; font-weight: 700; color: var(--danger); }

.qc-fieldset { border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem; }
.qc-legend { font-size: .72rem; font-weight: 800; color: var(--muted); padding-inline: .4rem; }

/* Password strength */
.strength-track { display: flex; gap: 4px; height: 4px; width: 100%; margin-top: 6px; }
.strength-seg { flex: 1; height: 100%; border-radius: 9999px; background: var(--line-strong); transition: background-color .25s ease; }
.strength-weak .seg-1 { background: var(--danger); }
.strength-medium .seg-1, .strength-medium .seg-2 { background: var(--warn); }
.strength-strong .seg-1, .strength-strong .seg-2, .strength-strong .seg-3 { background: var(--ok); }

/* ==================================================================
   09 · TABLES, TABS, PAGINATION, EMPTY STATES
   ================================================================== */
.qc-table-wrap {
    width: 100%;
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
}
.qc-table { width: 100%; border-collapse: collapse; font-size: .78rem; min-width: 620px; }
.qc-table thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--surface-2);
    color: var(--muted);
    font-size: .68rem;
    font-weight: 800;
    letter-spacing: .04em;
    text-align: right;
    padding: .7rem .9rem;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
}
.qc-table tbody td {
    padding: .7rem .9rem;
    border-bottom: 1px solid var(--line);
    color: var(--ink-2);
    vertical-align: middle;
}
.qc-table tbody tr:last-child td { border-bottom: 0; }
.qc-table tbody tr { transition: background-color var(--dur-fast) ease; }
.qc-table tbody tr:hover { background: var(--surface-2); }
.qc-table .qc-table__num { font-family: var(--font-mono); direction: ltr; unicode-bidi: isolate; }

.qc-tabs {
    display: inline-flex;
    gap: .25rem;
    padding: .3rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--surface-2);
    overflow-x: auto;
    scrollbar-width: none;
}
.qc-tabs::-webkit-scrollbar { display: none; }
.qc-tab {
    padding: .5rem .9rem;
    border-radius: 9px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--muted);
    font-size: .74rem;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
    transition: all var(--dur-fast) var(--ease-out);
}
.qc-tab:hover { color: var(--ink); background: var(--surface); }
.qc-tab[aria-selected="true"], .qc-tab.is-active {
    background: var(--accent);
    color: var(--accent-ink);
    box-shadow: 0 6px 18px -12px var(--accent);
}

.qc-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .6rem;
    padding: 2.6rem 1.2rem;
    text-align: center;
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius);
    color: var(--muted);
    background: var(--surface-2);
}
.qc-empty__title { font-size: .92rem; font-weight: 800; color: var(--ink); }
.qc-empty__text { font-size: .75rem; max-width: 42ch; line-height: 1.9; }

.qc-skeleton {
    border-radius: 10px;
    background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 37%, var(--surface-2) 63%);
    background-size: 400% 100%;
    animation: qc-shimmer 1.5s ease-in-out infinite;
}
@keyframes qc-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

.qc-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid var(--line-strong);
    border-top-color: var(--accent);
    animation: qc-spin .8s linear infinite;
}
@keyframes qc-spin { to { transform: rotate(360deg); } }

.qc-loading { display: flex; flex-direction: column; align-items: center; gap: .9rem; padding: 4rem 1rem; color: var(--muted); font-size: .78rem; }

/* ==================================================================
   10 · MODALS, DROPDOWNS, TOASTS, TOOLTIPS
   ================================================================== */
.qc-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(3, 8, 18, .72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    overflow-y: auto;
}
html.light .qc-overlay { background: rgba(12, 27, 48, .38); }
.qc-modal {
    width: 100%;
    max-width: 560px;
    background: var(--surface);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-xl);
    box-shadow: 0 40px 90px -40px rgba(0, 0, 0, .75);
    overflow: hidden;
    animation: qc-modal-in .32s var(--ease-out) both;
    margin-block: 1.5rem;
}
@keyframes qc-modal-in {
    from { opacity: 0; transform: translateY(16px) scale(.985); }
    to { opacity: 1; transform: none; }
}
.qc-modal__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.15rem 1.35rem;
    border-bottom: 1px solid var(--line);
    background: var(--surface-2);
}
.qc-modal__body { padding: 1.35rem; }
.qc-modal__foot {
    display: flex;
    flex-wrap: wrap;
    gap: .6rem;
    justify-content: flex-start;
    padding: 1rem 1.35rem;
    border-top: 1px solid var(--line);
    background: var(--surface-2);
}

.qc-menu {
    position: absolute;
    z-index: 50;
    min-width: 240px;
    padding: .4rem;
    border-radius: var(--radius);
    border: 1px solid var(--line-strong);
    background: var(--surface-glass-strong);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 28px 60px -30px rgba(0, 0, 0, .7);
    animation: qc-menu-in .18s var(--ease-out) both;
}
@keyframes qc-menu-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.qc-menu__item {
    display: flex;
    align-items: flex-start;
    gap: .65rem;
    width: 100%;
    padding: .6rem .7rem;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: var(--ink-2);
    text-align: right;
    cursor: pointer;
    transition: all var(--dur-fast) ease;
}
.qc-menu__item:hover, .qc-menu__item:focus-visible {
    background: var(--accent-soft);
    border-color: var(--accent-line);
    color: var(--ink);
}

.qc-toast-host {
    position: fixed;
    top: 1rem;
    inset-inline: 0;
    z-index: 120;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    pointer-events: none;
}
.qc-toast {
    display: flex;
    align-items: center;
    gap: .6rem;
    max-width: min(92vw, 460px);
    padding: .65rem 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line-strong);
    background: var(--surface-glass-strong);
    backdrop-filter: blur(16px);
    color: var(--ink);
    font-size: .76rem;
    font-weight: 700;
    box-shadow: 0 18px 40px -22px rgba(0, 0, 0, .6);
    pointer-events: auto;
    animation: qc-toast-in .3s var(--ease-spring) both;
}
.qc-toast--ok { border-color: rgba(52, 211, 153, .4); }
.qc-toast--warn { border-color: rgba(251, 191, 36, .4); }
.qc-toast--danger { border-color: rgba(251, 113, 133, .45); }
@keyframes qc-toast-in { from { opacity: 0; transform: translateY(-10px) scale(.97); } to { opacity: 1; transform: none; } }

/* ==================================================================
   11 · NAVIGATION
   ================================================================== */
.qc-header {
    position: sticky;
    top: 0;
    z-index: 40;
    width: 100%;
    background: var(--surface-glass);
    backdrop-filter: blur(22px) saturate(1.3);
    -webkit-backdrop-filter: blur(22px) saturate(1.3);
    border-bottom: 1px solid var(--line);
    transition: box-shadow var(--dur) var(--ease-out), background-color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
}
.qc-header[data-scrolled="true"] {
    box-shadow: 0 22px 50px -34px rgba(0, 0, 0, .7);
    background: var(--surface-glass-strong);
}
.qc-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .75rem;
    height: var(--header-h);
    width: 100%;
    max-width: var(--shell);
    margin-inline: auto;
    padding-inline: 1rem;
}
@media (min-width: 640px) { .qc-header__inner { padding-inline: 1.5rem; } }

.qc-brand { display: inline-flex; align-items: center; gap: .65rem; min-width: 0; cursor: pointer; }
.qc-brand__mark {
    position: relative;
    width: 38px;
    height: 38px;
    flex: none;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #fff;
    background: linear-gradient(145deg, var(--accent) 0%, var(--accent-2) 58%, var(--accent-3) 100%);
    box-shadow: 0 10px 24px -12px var(--accent), inset 0 1px 0 rgba(255, 255, 255, .35);
}
.qc-brand__mark::after {
    content: "";
    position: absolute;
    inset: -5px;
    border-radius: 16px;
    border: 1px solid var(--accent-line);
    opacity: .6;
    pointer-events: none;
}
.qc-brand__text { display: flex; flex-direction: column; line-height: 1.25; min-width: 0; text-align: right; }
.qc-brand__title { font-size: .82rem; font-weight: 900; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qc-brand__sub {
    font-family: var(--font-mono);
    font-size: .56rem;
    letter-spacing: .16em;
    color: var(--accent);
    direction: ltr;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.qc-nav { display: none; align-items: center; gap: .1rem; }
@media (min-width: 1280px) { .qc-nav { display: flex; } }
.qc-nav__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: .38rem;
    padding: .5rem .7rem;
    border-radius: 10px;
    color: var(--muted);
    font-size: .76rem;
    font-weight: 700;
    white-space: nowrap;
    transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease;
    background: transparent;
    border: 0;
    cursor: pointer;
}
.qc-nav__link:hover { color: var(--ink); background: var(--surface-2); }
.qc-nav__link[aria-current="page"], .qc-nav__link.is-active {
    color: var(--accent);
    background: var(--accent-soft);
}
.qc-nav__link[aria-current="page"]::after {
    content: "";
    position: absolute;
    bottom: -2px;
    inset-inline: 30%;
    height: 2px;
    border-radius: 2px;
    background: var(--accent);
}

.qc-nav-drop { position: relative; }
.qc-nav-drop__menu {
    position: absolute;
    top: calc(100% + 10px);
    inset-inline-end: 0;
    width: 300px;
    padding: .45rem;
    border-radius: var(--radius);
    border: 1px solid var(--line-strong);
    background: var(--surface-glass-strong);
    backdrop-filter: blur(22px);
    box-shadow: 0 30px 70px -36px rgba(0, 0, 0, .8);
    display: grid;
    gap: .1rem;
    z-index: 50;
}
.qc-nav-drop__menu[hidden] { display: none; }

.qc-actions { display: flex; align-items: center; gap: .35rem; }

.qc-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(145deg, var(--accent-2), var(--accent-3));
    color: #fff;
    font-size: .74rem;
    font-weight: 900;
    border: 1px solid rgba(255, 255, 255, .25);
    flex: none;
}

/* Breadcrumbs */
.qc-breadcrumbs {
    display: flex;
    align-items: center;
    gap: .4rem;
    width: 100%;
    max-width: var(--shell);
    margin-inline: auto;
    padding: .55rem 1rem;
    font-size: .68rem;
    color: var(--muted);
    border-top: 1px solid var(--line);
    overflow-x: auto;
    scrollbar-width: none;
}
.qc-breadcrumbs::-webkit-scrollbar { display: none; }
@media (min-width: 640px) { .qc-breadcrumbs { padding-inline: 1.5rem; } }
.qc-breadcrumbs a { color: var(--muted); transition: color var(--dur-fast) ease; white-space: nowrap; }
.qc-breadcrumbs a:hover { color: var(--accent); }
.qc-breadcrumbs .sep { opacity: .5; }
.qc-breadcrumbs .current { color: var(--ink-2); font-weight: 700; white-space: nowrap; }

/* Mobile dock */
.qc-dock {
    position: fixed;
    bottom: 0;
    inset-inline: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: .35rem .25rem calc(.35rem + env(safe-area-inset-bottom, 0px));
    background: var(--surface-glass-strong);
    backdrop-filter: blur(22px);
    border-top: 1px solid var(--line);
}
@media (min-width: 768px) { .qc-dock { display: none; } }
.qc-dock__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .18rem;
    padding: .3rem .6rem;
    border-radius: 10px;
    color: var(--muted);
    font-size: .6rem;
    font-weight: 700;
    background: transparent;
    border: 0;
    cursor: pointer;
    transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease;
}
.qc-dock__item.is-active { color: var(--accent); background: var(--accent-soft); }
.qc-dock__center {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    margin-top: -20px;
    border-radius: 16px;
    color: #fff;
    background: linear-gradient(145deg, var(--accent), var(--accent-2) 65%, var(--accent-3));
    box-shadow: 0 14px 30px -14px var(--accent);
    border: 1px solid rgba(255, 255, 255, .3);
    cursor: pointer;
    transition: transform var(--dur-fast) var(--ease-out);
}
.qc-dock__center:hover { transform: translateY(-2px) scale(1.03); }

/* ==================================================================
   12 · SCIENTIFIC GRAPHICS
   ================================================================== */
.qc-orbit {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    max-width: 460px;
    margin-inline: auto;
}
.qc-orbit__ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid var(--accent-line);
    transform: rotate(-18deg);
    animation: qc-orbit-spin 46s linear infinite;
}
.qc-orbit__ring:nth-child(2) { inset: 12%; border-color: rgba(129, 140, 248, .3); transform: rotate(28deg); animation-duration: 34s; animation-direction: reverse; }
.qc-orbit__ring:nth-child(3) { inset: 25%; border-color: rgba(167, 139, 250, .26); transform: rotate(-6deg); animation-duration: 26s; }
.qc-orbit__ring::after {
    content: "";
    position: absolute;
    top: -3px;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 14px var(--accent);
}
@keyframes qc-orbit-spin { to { transform: rotate(360deg); } }
.qc-orbit__core {
    width: 34%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle at 34% 30%, rgba(255, 255, 255, .9), var(--accent) 28%, var(--accent-2) 62%, #1b1247 100%);
    box-shadow: 0 0 60px -8px var(--accent), inset -6px -8px 20px rgba(0, 0, 0, .35);
    animation: qc-breathe 7s ease-in-out infinite;
}
@keyframes qc-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035); } }
.qc-orbit__label {
    position: absolute;
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: .14em;
    color: var(--muted);
    direction: ltr;
}

.qc-wave {
    width: 100%;
    height: 60px;
    display: block;
    overflow: visible;
}
.qc-wave path {
    fill: none;
    stroke: var(--accent);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-dasharray: 5 4;
    animation: qc-dash 18s linear infinite;
    opacity: .75;
}
@keyframes qc-dash { to { stroke-dashoffset: -360; } }

.qc-spectrum {
    display: flex;
    height: 4px;
    border-radius: 9999px;
    overflow: hidden;
    background: linear-gradient(90deg,
        #7c3aed 0%, #4f46e5 18%, #0b74d8 36%, #0ea5b7 52%,
        #22c55e 68%, #eab308 82%, #f97316 92%, #ef4444 100%);
}
html.dark .qc-spectrum { filter: saturate(1.15) brightness(1.08); }

.qc-readout {
    display: grid;
    gap: .15rem;
    padding: .7rem .9rem;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    border: 1px solid var(--line);
}
.qc-readout__label { font-size: .62rem; color: var(--muted); font-weight: 700; }
.qc-readout__value {
    font-family: var(--font-mono);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--ink);
    direction: ltr;
    unicode-bidi: isolate;
}
.qc-readout__value--accent { color: var(--accent); }

/* Compact formula strips used on laboratory cards */
.qc-formula {
    display: inline-block;
    direction: ltr;
    max-width: 100%;
    overflow: hidden;
    line-height: 1.2;
    text-align: left;
    unicode-bidi: isolate;
}
.qc-formula .katex { font-size: .8rem !important; }
.qc-formula--mini .katex { font-size: .74rem !important; }
.qc-mini-formula { white-space: nowrap; }

/* Stat block */
.qc-stat {
    position: relative;
    padding: 1rem 1.1rem;
    border-radius: var(--radius);
    border: 1px solid var(--line);
    background: var(--surface);
    overflow: hidden;
    transition: border-color var(--dur) ease, transform var(--dur) var(--ease-out);
}
.qc-stat:hover { border-color: var(--accent-line); transform: translateY(-2px); }
.qc-stat__value {
    font-family: var(--font-mono);
    font-size: clamp(1.4rem, 1rem + 1vw, 1.85rem);
    font-weight: 700;
    color: var(--ink);
    line-height: 1.1;
    direction: ltr;
    unicode-bidi: isolate;
    display: flex;
    align-items: baseline;
    gap: .2rem;
}
.qc-stat__value--accent { color: var(--accent); }
.qc-stat__label { margin-top: .3rem; font-size: .7rem; color: var(--muted); font-weight: 600; line-height: 1.6; }
.qc-stat__spark {
    position: absolute;
    inset-inline-end: -10px;
    bottom: -12px;
    width: 90px;
    height: 54px;
    opacity: .5;
}

/* Hero */
.qc-hero { position: relative; overflow: hidden; border-bottom: 1px solid var(--line); }
.qc-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--hero-veil);
    pointer-events: none;
}
.qc-hero__inner {
    position: relative;
    display: grid;
    gap: 2rem;
    padding-block: clamp(2rem, 1rem + 4vw, 4.5rem);
}
@media (min-width: 1024px) {
    .qc-hero__inner { grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr); align-items: center; gap: 3rem; }
}

/* Feature row */
.qc-feature {
    display: flex;
    gap: .85rem;
    padding: 1rem;
    border-radius: var(--radius);
    border: 1px solid var(--line);
    background: var(--surface);
    transition: all var(--dur) var(--ease-out);
}
.qc-feature:hover { border-color: var(--accent-line); transform: translateY(-2px); }
.qc-feature__icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    flex: none;
    border-radius: 10px;
    background: var(--accent-soft);
    color: var(--accent);
    border: 1px solid var(--accent-line);
}

/* ==================================================================
   13 · FOOTER
   ================================================================== */
.qc-footer {
    position: relative;
    z-index: 10;
    margin-top: auto;
    border-top: 1px solid var(--line);
    background: linear-gradient(180deg, transparent, var(--bg-2));
}
.qc-footer__grid {
    display: grid;
    gap: 2rem;
    padding-block: clamp(2rem, 1.4rem + 2vw, 3.2rem) 1.6rem;
}
@media (min-width: 768px) { .qc-footer__grid { grid-template-columns: 1.6fr 1fr 1fr 1.2fr; } }
.qc-footer__title { font-size: .74rem; font-weight: 900; color: var(--ink); margin-bottom: .8rem; letter-spacing: .02em; }
.qc-footer__link {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding-block: .22rem;
    font-size: .74rem;
    color: var(--muted);
    transition: color var(--dur-fast) ease, transform var(--dur-fast) ease;
}
.qc-footer__link:hover { color: var(--accent); transform: translateX(-2px); }
.qc-footer__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: .75rem;
    padding-block: 1rem 4.2rem;
    border-top: 1px solid var(--line);
    font-size: .68rem;
    color: var(--muted-2);
}

/* ==================================================================
   14 · AI COPILOT
   ================================================================== */
.qc-copilot {
    background: var(--surface-glass-strong);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--line-strong);
    box-shadow: 0 40px 90px -44px rgba(0, 0, 0, .85);
}
.qc-chat-bubble--user {
    align-self: flex-start;
    background: linear-gradient(140deg, var(--accent-2), var(--accent-3));
    color: #fff;
    border-radius: 16px 16px 4px 16px;
    padding: .6rem .85rem;
    font-size: .74rem;
    max-width: 86%;
    line-height: 1.9;
    box-shadow: 0 12px 26px -18px var(--accent-2);
}
.qc-chat-bubble--bot {
    background: var(--surface-2);
    border: 1px solid var(--line);
    color: var(--ink-2);
    border-radius: 16px 16px 16px 4px;
    padding: .75rem .9rem;
    font-size: .74rem;
    max-width: 94%;
    line-height: 1.95;
}

/* ==================================================================
   15 · ANIMATIONS & REVEAL
   ================================================================== */
.qc-reveal { opacity: 0; transform: translateY(18px); transition: opacity .7s var(--ease-out), transform .7s var(--ease-out); }
.qc-reveal.is-in { opacity: 1; transform: none; }
.qc-reveal[data-delay="1"] { transition-delay: .07s; }
.qc-reveal[data-delay="2"] { transition-delay: .14s; }
.qc-reveal[data-delay="3"] { transition-delay: .21s; }
.qc-reveal[data-delay="4"] { transition-delay: .28s; }
.qc-reveal[data-delay="5"] { transition-delay: .35s; }

@keyframes float-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.animate-float { animation: float-gentle 5s ease-in-out infinite; }
@keyframes rotate-slow { to { transform: rotate(360deg); } }
.animate-rotate-slow { animation: rotate-slow 26s linear infinite; }
@keyframes pulse-ring {
    0% { transform: scale(.95); opacity: .8; }
    50% { transform: scale(1.15); opacity: .3; }
    100% { transform: scale(.95); opacity: .8; }
}
.animate-pulse-ring { animation: pulse-ring 3s cubic-bezier(.4, 0, .6, 1) infinite; }
@keyframes quantum-pulse {
    0%, 100% { transform: scale(1); opacity: .85; }
    50% { transform: scale(1.02); opacity: 1; }
}
.animate-quantum-pulse { animation: quantum-pulse 3.4s cubic-bezier(.4, 0, .6, 1) infinite; }
@keyframes radar-sweep { to { transform: rotate(360deg); } }
.animate-radar-sweep { animation: radar-sweep 5s linear infinite; }
@keyframes flame-pulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(249, 115, 22, .4)); }
    50% { transform: scale(1.12); filter: drop-shadow(0 0 8px rgba(249, 115, 22, .8)); }
}
.streak-flame-active { animation: flame-pulse 2.2s infinite ease-in-out; }
@keyframes shake-x {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
}
.animate-shake { animation: shake-x .4s ease-in-out; }
@keyframes electron-dash { to { stroke-dashoffset: -40; } }
.circuit-wire-active { stroke-dasharray: 6 6; animation: electron-dash 1.2s linear infinite; }
@keyframes hologram-scan { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }

.hologram-grid, .quantum-grid-bg {
    background-image:
        linear-gradient(var(--grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 32px 32px;
}

/* Legacy glows mapped to tokens (no theme leakage) */
.cyber-glow-cyan, .cyber-glow-blue, .cyber-glow-violet,
.quantum-glow-cyan, .quantum-glow-violet, .quantum-glow-amber, .quantum-glow-rose {
    box-shadow: var(--glow);
}

.telemetry-dot { position: relative; }
.telemetry-dot::after {
    content: "";
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
    animation: pulse-ring 2s infinite;
}

.lcd-display {
    font-family: var(--font-mono) !important;
    font-feature-settings: "tnum" 1;
    letter-spacing: .05em;
}

.anti-cheat-protected, .qc-no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.touch-manipulation { touch-action: manipulation; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 5rem); }

/* Back to top */
.qc-top-btn {
    position: fixed;
    bottom: 5rem;
    inset-inline-start: 1rem;
    z-index: 30;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: 1px solid var(--line-strong);
    background: var(--surface-glass-strong);
    backdrop-filter: blur(14px);
    color: var(--muted);
    opacity: 0;
    transform: translateY(10px);
    pointer-events: none;
    transition: all var(--dur) var(--ease-out);
}
.qc-top-btn.is-on { opacity: 1; transform: none; pointer-events: auto; }
.qc-top-btn:hover { color: var(--accent); border-color: var(--accent-line); }
@media (min-width: 768px) {
    .qc-footer__bottom { padding-bottom: 2.6rem; }
    .qc-top-btn { bottom: 1.5rem; inset-inline-start: 1.5rem; }
}

/* Command palette */
.qc-palette { position: fixed; inset: 0; z-index: 110; display: flex; justify-content: center; padding: 12vh 1rem 1rem; background: rgba(3, 8, 18, .6); backdrop-filter: blur(8px); }
html.light .qc-palette { background: rgba(12, 27, 48, .32); }
.qc-palette__box {
    width: 100%;
    max-width: 560px;
    height: max-content;
    max-height: 68vh;
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-strong);
    background: var(--surface);
    box-shadow: 0 50px 110px -50px rgba(0, 0, 0, .85);
    overflow: hidden;
    animation: qc-modal-in .26s var(--ease-out) both;
}
.qc-palette__input {
    display: flex;
    align-items: center;
    gap: .6rem;
    padding: .85rem 1rem;
    border-bottom: 1px solid var(--line);
}
.qc-palette__input input {
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    font-size: .86rem;
    font-family: var(--font-fa);
}
.qc-palette__list { overflow-y: auto; padding: .4rem; }
.qc-palette__item {
    display: flex;
    align-items: center;
    gap: .65rem;
    width: 100%;
    padding: .55rem .7rem;
    border-radius: 10px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--ink-2);
    text-align: right;
    font-size: .78rem;
    cursor: pointer;
}
.qc-palette__item.is-cursor, .qc-palette__item:hover { background: var(--accent-soft); border-color: var(--accent-line); color: var(--ink); }
.qc-palette__hint { margin-inline-start: auto; font-family: var(--font-mono); font-size: .6rem; color: var(--muted-2); }
.qc-kbd {
    display: inline-grid;
    place-items: center;
    min-width: 20px;
    padding: 0 .3rem;
    height: 20px;
    border-radius: 5px;
    border: 1px solid var(--line-strong);
    background: var(--surface-2);
    font-family: var(--font-mono);
    font-size: .6rem;
    color: var(--muted);
}

/* KaTeX isolation */
.katex, .katex * { font-family: KaTeX_Main, KaTeX_Math, var(--font-mono), sans-serif !important; }
.katex-ltr-container, .katex, .katex-display {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate;
}
.katex-display {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
    padding: .4rem 0;
    -webkit-overflow-scrolling: touch;
}
.katex-display::-webkit-scrollbar { height: 4px; }
.katex-display::-webkit-scrollbar-thumb { background: var(--accent-line); border-radius: 4px; }
html.dark .katex { color: #c7dbff; }
html.light .katex { color: #123b6d; }

/* Lab sliders */
input[type=range].physics-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 9999px;
    background: var(--surface-3);
    border: 1px solid var(--line);
    outline: none;
    transition: background .2s;
}
input[type=range].physics-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent);
    border: 3px solid var(--bg);
    box-shadow: 0 0 10px var(--accent-line);
    cursor: pointer;
    transition: transform .15s, background .15s;
}
input[type=range].physics-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
input[type=range].physics-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent);
    border: 3px solid var(--bg);
    cursor: pointer;
}
input[type=range].physics-slider::-moz-range-track { background: var(--surface-3); height: 8px; border-radius: 9999px; }

/* Mobile refinements */
@media (max-width: 430px) {
    .qc-brand__title {
        font-size: .72rem;
        white-space: normal;
        line-height: 1.25;
        max-width: 150px;
    }
    .qc-brand__sub { display: none; }
    .qc-header__inner { gap: .4rem; }
    .qc-actions { gap: .25rem; }
}

@media (max-width: 640px) {
    h1 { word-break: break-word; }
    table, pre, code { max-width: 100%; }
    .qc-card { border-radius: var(--radius); }
    .qc-display { line-height: 1.34; }
    .qc-lede { line-height: 1.95; }
}

/* ==================================================================
   16 · LEGACY MODULE COMPATIBILITY
   Dark-authored laboratory modules are re-mapped onto the light theme
   without touching their behaviour. Exact class tokens only, so that
   properly themed components are never overridden.
   ================================================================== */
html.light .qc-adapt,
html.light .qc-adapt * { --qc-adapt-on: 1; }

html.light .qc-adapt [class~="bg-slate-950"],
html.light .qc-adapt [class~="bg-slate-950/95"],
html.light .qc-adapt [class~="bg-slate-950/90"],
html.light .qc-adapt [class~="bg-slate-950/80"],
html.light .qc-adapt [class~="bg-slate-950/70"],
html.light .qc-adapt [class~="bg-slate-950/60"],
html.light .qc-adapt [class~="bg-slate-900"],
html.light .qc-adapt [class~="bg-slate-900/95"],
html.light .qc-adapt [class~="bg-slate-900/90"],
html.light .qc-adapt [class~="bg-slate-900/80"],
html.light .qc-adapt [class~="bg-slate-900/70"],
html.light .qc-adapt [class~="bg-slate-900/60"],
html.light .qc-adapt [class~="bg-slate-900/50"] {
    background-color: var(--surface) !important;
}
html.light .qc-adapt [class~="bg-slate-800"],
html.light .qc-adapt [class~="bg-slate-800/95"],
html.light .qc-adapt [class~="bg-slate-800/90"],
html.light .qc-adapt [class~="bg-slate-800/80"],
html.light .qc-adapt [class~="bg-slate-800/70"],
html.light .qc-adapt [class~="bg-slate-800/60"],
html.light .qc-adapt [class~="bg-slate-800/50"],
html.light .qc-adapt [class~="bg-slate-800/40"] {
    background-color: var(--surface-2) !important;
}
html.light .qc-adapt [class~="border-slate-800"],
html.light .qc-adapt [class~="border-slate-800/80"],
html.light .qc-adapt [class~="border-slate-800/60"],
html.light .qc-adapt [class~="border-slate-700"],
html.light .qc-adapt [class~="border-slate-700/80"],
html.light .qc-adapt [class~="border-slate-700/60"],
html.light .qc-adapt [class~="border-slate-900"] {
    border-color: var(--line) !important;
}

html.light .qc-adapt [class~="text-white"]:where(:not([class*="bg-blue-"]):not([class*="bg-cyan-"]):not([class*="bg-sky-"]):not([class*="bg-indigo-"]):not([class*="bg-violet-"]):not([class*="bg-purple-"]):not([class*="bg-emerald-"]):not([class*="bg-green-"]):not([class*="bg-teal-"]):not([class*="bg-amber-"]):not([class*="bg-orange-"]):not([class*="bg-rose-"]):not([class*="bg-red-"]):not([class*="bg-gradient"]):not([class*="btn-"]):not(.btn-duo-blue):not(.btn-duo-green):not(.btn-duo-yellow):not(.btn-phet-primary)) {
    color: var(--ink) !important;
}
html.light .qc-adapt [class~="text-slate-100"],
html.light .qc-adapt [class~="text-slate-200"],
html.light .qc-adapt [class~="text-slate-300"] { color: var(--ink-2) !important; }
html.light .qc-adapt [class~="text-slate-400"]:where(:not([class*="from-"] *)),
html.light .qc-adapt [class~="text-slate-500"]:where(:not([class*="from-"] *)) { color: var(--muted) !important; }
html.light .qc-adapt [class~="text-slate-600"]:where(:not([class*="from-"] *)) { color: var(--ink-2) !important; }
html.light .qc-adapt [class~="text-white/80"],
html.light .qc-adapt [class~="text-white/70"],
html.light .qc-adapt [class~="text-white/60"] { color: var(--muted) !important; }

/* Gradient "hero" bands keep their luminous identity in both themes: restore
   white text for anything living inside a gradient container. */
/* Dark hero bands keep their glass chips readable instead of turning them white */
html.light .qc-adapt [class*="from-"] :is([class~="bg-slate-800"], [class~="bg-slate-800/80"], [class~="bg-slate-800/70"], [class~="bg-slate-800/60"], [class~="bg-slate-800/50"], [class~="bg-slate-900"], [class~="bg-slate-900/80"], [class~="bg-slate-900/70"], [class~="bg-slate-900/60"], [class~="bg-slate-950"], [class~="bg-slate-950/60"]),
html.light .qc-adapt [class*="via-"] :is([class~="bg-slate-800"], [class~="bg-slate-800/80"], [class~="bg-slate-800/60"], [class~="bg-slate-900"], [class~="bg-slate-900/60"]) {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.22) !important;
    color: #f5f9ff !important;
}

html.light .qc-adapt [class*="from-"] [class~="text-white"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-100"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-200"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-300"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-400"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-700"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-800"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-900"],
html.light .qc-adapt [class*="from-"] [class~="text-slate-950"],
html.light .qc-adapt [class*="via-"] [class~="text-slate-900"],
html.light .qc-adapt [class*="via-"] [class~="text-slate-800"],
html.light .qc-adapt [class*="via-"] [class~="text-white"],
html.light .qc-adapt [class~="text-white"][class*="from-"],
html.light .qc-adapt [class~="text-white"][class*="via-"],
html.light .qc-adapt [class~="text-white"][class*="bg-gradient"] {
    color: #f4f9ff !important;
}

/* Gradient "hero" bands intentionally stay deep-space in both themes */
[data-qc-island],
.qc-dark-island { color-scheme: dark; }
html.light .qc-dark-island [class~="text-white"],
html.light .qc-dark-island [class~="text-slate-100"],
html.light .qc-dark-island [class~="text-slate-200"] { color: #f2f7ff !important; }
html.light .qc-dark-island [class~="text-slate-300"],
html.light .qc-dark-island [class~="text-slate-400"] { color: #c2d4ec !important; }
html.light .qc-dark-island [class~="text-slate-500"] { color: #9fb4d0 !important; }

/* Restore legibility for white text placed on gradient bands */
html.light .qc-adapt [class*="from-"][class~="text-white"],
html.light .qc-adapt [class*="via-"][class~="text-white"],
html.light .qc-adapt [class*="to-"][class~="text-white"] { color: #f2f7ff !important; }

/* Pastel accent text authored for dark surfaces must darken on light surfaces. */
html.light .qc-adapt :is([class~="text-cyan-200"], [class~="text-cyan-300"], [class~="text-cyan-400"], [class~="text-sky-200"], [class~="text-sky-300"], [class~="text-sky-400"], [class~="text-teal-200"], [class~="text-teal-300"], [class~="text-teal-400"]):where(:not([class*="from-"] *)):where(:not([class*="via-"] *)) {
    color: #0e7490 !important;
}
html.light .qc-adapt :is([class~="text-blue-200"], [class~="text-blue-300"], [class~="text-blue-400"], [class~="text-indigo-200"], [class~="text-indigo-300"], [class~="text-indigo-400"]):where(:not([class*="from-"] *)):where(:not([class*="via-"] *)) {
    color: #1d4ed8 !important;
}
html.light .qc-adapt :is([class~="text-violet-200"], [class~="text-violet-300"], [class~="text-violet-400"], [class~="text-purple-200"], [class~="text-purple-300"], [class~="text-purple-400"], [class~="text-fuchsia-300"], [class~="text-fuchsia-400"]):where(:not([class*="from-"] *)):where(:not([class*="via-"] *)) {
    color: #6d28d9 !important;
}
html.light .qc-adapt :is([class~="text-emerald-200"], [class~="text-emerald-300"], [class~="text-emerald-400"], [class~="text-green-200"], [class~="text-green-300"], [class~="text-green-400"]):where(:not([class*="from-"] *)):where(:not([class*="via-"] *)) {
    color: #047857 !important;
}
html.light .qc-adapt :is([class~="text-amber-200"], [class~="text-amber-300"], [class~="text-amber-400"], [class~="text-yellow-300"], [class~="text-yellow-400"], [class~="text-orange-300"], [class~="text-orange-400"]):where(:not([class*="from-"] *)):where(:not([class*="via-"] *)) {
    color: #b45309 !important;
}
html.light .qc-adapt :is([class~="text-rose-200"], [class~="text-rose-300"], [class~="text-rose-400"], [class~="text-red-300"], [class~="text-red-400"], [class~="text-pink-300"], [class~="text-pink-400"]):where(:not([class*="from-"] *)):where(:not([class*="via-"] *)) {
    color: #be123c !important;
}

/* Form controls inside adapted modules */
html.light .qc-adapt input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
html.light .qc-adapt textarea,
html.light .qc-adapt select {
    background-color: var(--surface-2) !important;
    color: var(--ink) !important;
    border-color: var(--line-strong) !important;
}
html.light .qc-adapt input::placeholder,
html.light .qc-adapt textarea::placeholder { color: var(--muted-2) !important; }

/* ==================================================================
   16.5 · TELEMETRY, OSCILLOSCOPE & MISSION CONTROL HUD
   ================================================================== */
.qc-telemetry-hud {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: background-color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out);
}
.qc-telemetry-hud::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at 80% 20%, var(--accent-soft) 0%, transparent 60%),
                radial-gradient(circle at 20% 80%, var(--accent-2-soft) 0%, transparent 60%);
    opacity: 0.7;
}

.qc-scope-screen {
    position: relative;
    background: var(--surface-2);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: inset 0 2px 12px rgba(0, 0, 0, 0.4);
}
.qc-scope-screen::after {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.08),
        rgba(0, 0, 0, 0.08) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
    opacity: 0.35;
}

.qc-lcd {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 900;
    letter-spacing: 0.05em;
    direction: ltr;
    unicode-bidi: isolate;
}
html.dark .qc-lcd-cyan { color: #38bdf8; text-shadow: 0 0 12px rgba(56, 189, 248, 0.65); }
html.light .qc-lcd-cyan { color: #0284c7; text-shadow: none; }
html.dark .qc-lcd-green { color: #34d399; text-shadow: 0 0 12px rgba(52, 211, 153, 0.65); }
html.light .qc-lcd-green { color: #059669; text-shadow: none; }
html.dark .qc-lcd-amber { color: #fbbf24; text-shadow: 0 0 12px rgba(251, 191, 36, 0.65); }
html.light .qc-lcd-amber { color: #d97706; text-shadow: none; }

/* Bento Grid System */
.qc-bento-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.25rem;
}
@media (min-width: 640px) {
    .qc-bento-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
@media (min-width: 1024px) {
    .qc-bento-grid {
        grid-template-columns: repeat(12, minmax(0, 1fr));
    }
}

.qc-bento-col-12 { grid-column: span 12 / span 12; }
.qc-bento-col-8 { grid-column: span 12 / span 12; }
.qc-bento-col-6 { grid-column: span 12 / span 12; }
.qc-bento-col-4 { grid-column: span 12 / span 12; }

@media (min-width: 1024px) {
    .qc-bento-col-8 { grid-column: span 8 / span 8; }
    .qc-bento-col-6 { grid-column: span 6 / span 6; }
    .qc-bento-col-4 { grid-column: span 4 / span 4; }
}

/* Activity Heatmap Grid */
.qc-heat-grid {
    display: grid;
    grid-template-columns: repeat(15, minmax(0, 1fr));
    gap: 4px;
}
.qc-heat-cell {
    aspect-ratio: 1;
    border-radius: 4px;
    background: var(--surface-3);
    border: 1px solid var(--line);
    transition: transform var(--dur-fast) ease, background-color var(--dur-fast) ease;
}
.qc-heat-cell:hover {
    transform: scale(1.2);
    z-index: 2;
}
.qc-heat-cell.is-lvl-1 { background: rgba(56, 189, 248, 0.35); border-color: rgba(56, 189, 248, 0.5); }
.qc-heat-cell.is-lvl-2 { background: rgba(56, 189, 248, 0.65); border-color: rgba(56, 189, 248, 0.8); }
.qc-heat-cell.is-lvl-3 { background: #38bdf8; border-color: #38bdf8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.6); }

/* Guild Elemental Cards */
.qc-guild-card {
    position: relative;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 1.5rem;
    transition: all var(--dur) var(--ease-out);
    overflow: hidden;
}
.qc-guild-card::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    background: var(--guild-color, var(--accent));
}
.qc-guild-card:hover {
    transform: translateY(-4px);
    border-color: var(--guild-color, var(--accent));
    box-shadow: 0 16px 36px -18px var(--guild-color, var(--accent));
}

/* ==================================================================
   17 · PRINT
   ================================================================== */
@media print {
    #navbar-container, #qc-breadcrumbs, footer, .qc-footer, #ai-tutor-modal,
    #ai-tutor-floating-container, canvas#physics-particles-canvas,
    .qc-atmosphere, .qc-grid-veil, .qc-top-btn, .qc-scroll-progress, .no-print {
        display: none !important;
    }
    html, body {
        background: #ffffff !important;
        color: #000000 !important;
        background-image: none !important;
    }
    #app-main-content { animation: none !important; }
    body * { visibility: hidden; }
    #printable-a4-sheet, #printable-a4-sheet * { visibility: visible; }
    #printable-a4-sheet {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        box-shadow: none !important;
        border: none !important;
    }
}

/* ==================================================================
   18 · MOTION PREFERENCES
   ================================================================== */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .001ms !important;
        scroll-behavior: auto !important;
    }
    .qc-reveal { opacity: 1 !important; transform: none !important; }
    #physics-particles-canvas { display: none !important; }
}

/* Low-power / low-memory devices: calmer visuals */
html.qc-low-power .qc-orbit__ring,
html.qc-low-power .animate-rotate-slow,
html.qc-low-power .animate-radar-sweep,
html.qc-low-power .qc-wave path { animation: none !important; }
html.qc-low-power #physics-particles-canvas { display: none; }
