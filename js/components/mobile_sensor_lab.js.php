<?php
/**
 * QUANTUM CUT — Mobile Sensor Physics Lab Component (Pure PHP Edition)
 * Observatory Mission Control & Physics Sensor Telemetry
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Mobile Sensor Physics Lab (آزمایشگاه سنجش تجربی و سنسورهای همراه)
 * 1. Accelerometer g & Free Fall Oscilloscope
 * 2. Inclinometer Bubble Level & Pendulum Period
 * 3. Audio FFT Resonance Spectrogram
 */
const MobileSensorLab = (function() {
    let activeTab = 'accel'; // 'accel', 'incline', 'audio'
    let accelListener = null;
    let orientListener = null;
    let audioContext = null;
    let analyser = null;
    let microphone = null;
    let animationFrame = null;
    let accelHistory = [];
    let isSimulating = false;
    let simInterval = null;
    const MAX_HISTORY = 100;

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="qc-adapt qc-shell qc-section space-y-6">
            <!-- Telemetry Header HUD -->
            <div class="qc-telemetry-hud p-6 sm:p-8">
                <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="space-y-2 text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-line)] text-[var(--accent)] text-xs font-bold">
                            <i data-lucide="satellite" class="w-3.5 h-3.5"></i>
                            <span>آزمایشگاه سنجش تجربی همراه</span>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-mono">v5.0</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight flex items-center gap-3">
                            <span class="p-2.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--accent)] shadow-sm">
                                <i data-lucide="activity" class="w-6 h-6"></i>
                            </span>
                            <span>آزمایشگاه سنسوری تلفن همراه و تله‌متری</span>
                        </h1>
                        <p class="text-[var(--muted)] text-xs sm:text-sm max-w-2xl leading-relaxed">
                            تبدیل تلفن همراه یا رایانه به یک آزمایشگاه اندازه‌گیری دقیق فیزیک با سنسورهای شتاب‌سنج، ژیروسکوپ زاویه‌سنج، محاسبه‌گر دوره آونگ و تحلیل تبدیل سریع فوریه <bdi class="sci-term text-[var(--accent)] font-mono">(FFT)</bdi>.
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button type="button" onclick="MobileSensorLab.toggleSimulation()" id="sim-toggle-btn" class="qc-btn qc-btn--ghost qc-btn--sm">
                            <i data-lucide="play-circle" class="w-4 h-4 text-[var(--accent)]"></i>
                            <span id="sim-toggle-text">شبیه‌سازی زنده (Demo)</span>
                        </button>
                        <button type="button" onclick="window.store.setView('simulators')" class="qc-btn qc-btn--sm">
                            <i data-lucide="flask-conical" class="w-3.5 h-3.5"></i>
                            <span>شبیه‌سازهای PhET</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Segmented Instrument Switcher -->
            <div class="qc-tabs w-full grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                <button type="button" onclick="MobileSensorLab.switchTab('accel')" id="tab-btn-accel" class="qc-tab ${activeTab === 'accel' ? 'is-active' : ''} flex items-center justify-center gap-2 py-3">
                    <i data-lucide="zap" class="w-4 h-4 text-[var(--accent)]"></i>
                    <span>۱. شتاب‌سنج و گرانش</span>
                    <bdi class="sci-term font-mono">(g)</bdi>
                </button>
                <button type="button" onclick="MobileSensorLab.switchTab('incline')" id="tab-btn-incline" class="qc-tab ${activeTab === 'incline' ? 'is-active' : ''} flex items-center justify-center gap-2 py-3">
                    <i data-lucide="compass" class="w-4 h-4 text-[var(--accent-2)]"></i>
                    <span>۲. زاویه‌سنج و آونگ</span>
                    <bdi class="sci-term font-mono">(T)</bdi>
                </button>
                <button type="button" onclick="MobileSensorLab.switchTab('audio')" id="tab-btn-audio" class="qc-tab ${activeTab === 'audio' ? 'is-active' : ''} flex items-center justify-center gap-2 py-3">
                    <i data-lucide="volume-2" class="w-4 h-4 text-[var(--accent-3)]"></i>
                    <span>۳. رزونانس صوتی</span>
                    <bdi class="sci-term font-mono">(FFT)</bdi>
                </button>
            </div>

            <!-- Instrument Stage -->
            <div id="sensor-stage" class="qc-card qc-card--p space-y-6">
                <!-- Dynamic Content Loaded Below -->
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        renderActiveTab();
    }

    function switchTab(tab) {
        stopAllSensors();
        activeTab = tab;
        render('app-root');
    }

    function stopAllSensors() {
        if (accelListener) {
            window.removeEventListener('devicemotion', accelListener);
            accelListener = null;
        }
        if (orientListener) {
            window.removeEventListener('deviceorientation', orientListener);
            orientListener = null;
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(() => {});
            audioContext = null;
        }
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        if (simInterval) {
            clearInterval(simInterval);
            simInterval = null;
            isSimulating = false;
        }
    }

    function renderActiveTab() {
        const stage = document.getElementById('sensor-stage');
        if (!stage) return;

        if (activeTab === 'accel') {
            renderAccelTab(stage);
        } else if (activeTab === 'incline') {
            renderInclineTab(stage);
        } else if (activeTab === 'audio') {
            renderAudioTab(stage);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // --- Tab 1: Accelerometer g ---
    function renderAccelTab(stage) {
        stage.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
                <div class="space-y-1">
                    <h3 class="text-base sm:text-lg font-black text-[var(--ink)] flex items-center gap-2">
                        <i data-lucide="activity" class="w-5 h-5 text-[var(--accent)]"></i>
                        <span>اسیلوسکوپ شتاب و شتاب گرانش زمین</span>
                    </h3>
                    <p class="text-xs text-[var(--muted)] flex flex-wrap items-center gap-2 leading-relaxed">
                        <span>اندازه‌گیری مقدار کل بردار شتاب</span>
                        <bdi class="sci-term px-2 py-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--line)] font-mono text-[var(--accent)] font-bold">|a| = √(ax² + ay² + az²)</bdi>
                        <span>و تشخیص خودکار سقوط آزاد</span>
                        <bdi class="sci-term px-2 py-0.5 rounded-md bg-[var(--warn-soft)] text-[var(--warn)] font-mono font-bold">(a ≈ 0)</bdi>
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" id="accel-start-btn" onclick="MobileSensorLab.startAccelerometer()" class="qc-btn qc-btn--sm">
                        <i data-lucide="radio" class="w-4 h-4"></i>
                        <span>فعال‌سازی سنسور فیزیکی</span>
                    </button>
                    <button type="button" onclick="MobileSensorLab.triggerFreeFallSim()" class="qc-btn qc-btn--ghost qc-btn--sm" title="شبیه‌سازی سقوط آزاد">
                        <i data-lucide="arrow-down" class="w-3.5 h-3.5 text-[var(--warn)]"></i>
                        <span>سقوط آزاد آزمایشی</span>
                    </button>
                </div>
            </div>

            <!-- Readout Gauges (LCD Digital Scientific HUD) -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] relative overflow-hidden">
                    <div class="text-[11px] text-[var(--accent)] font-bold flex items-center justify-center gap-1">
                        <span>شتاب کل گرانش</span>
                        <bdi class="sci-term font-mono">(|g|)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1.5 font-mono">
                        <span id="accel-total" class="text-2xl sm:text-3xl font-black text-[var(--accent)] qc-lcd qc-lcd-cyan">9.80</span>
                        <span class="text-xs font-bold text-[var(--muted)] font-mono">m/s²</span>
                    </div>
                    <div class="mt-2 text-[10px] text-[var(--muted)]">ثقل گرانشی زمین</div>
                </div>

                <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--muted)] font-bold flex items-center justify-center gap-1">
                        <span>محور افقی</span>
                        <bdi class="sci-term font-mono">(ax)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1.5 font-mono">
                        <span id="accel-x" class="text-xl sm:text-2xl font-bold text-[var(--ink)] qc-lcd">0.00</span>
                        <span class="text-[10px] text-[var(--muted)] font-mono">m/s²</span>
                    </div>
                    <div class="mt-2 text-[10px] text-[var(--muted)]">مولفه عرضی X</div>
                </div>

                <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--muted)] font-bold flex items-center justify-center gap-1">
                        <span>محور عمودی</span>
                        <bdi class="sci-term font-mono">(ay)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1.5 font-mono">
                        <span id="accel-y" class="text-xl sm:text-2xl font-bold text-[var(--ink)] qc-lcd">0.00</span>
                        <span class="text-[10px] text-[var(--muted)] font-mono">m/s²</span>
                    </div>
                    <div class="mt-2 text-[10px] text-[var(--muted)]">مولفه طولی Y</div>
                </div>

                <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--muted)] font-bold flex items-center justify-center gap-1">
                        <span>محور عمود بر صفحه</span>
                        <bdi class="sci-term font-mono">(az)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1.5 font-mono">
                        <span id="accel-z" class="text-xl sm:text-2xl font-bold text-[var(--ink)] qc-lcd">9.80</span>
                        <span class="text-[10px] text-[var(--muted)] font-mono">m/s²</span>
                    </div>
                    <div class="mt-2 text-[10px] text-[var(--muted)]">مولفه نرمال Z</div>
                </div>
            </div>

            <!-- Oscilloscope Canvas HUD -->
            <div class="space-y-2">
                <div class="text-xs text-[var(--muted)] flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-[var(--ink-2)]">نمودار نوسان‌نمای شتاب لحظه‌ای</span>
                        <bdi class="sci-term text-[var(--accent)] font-mono text-xs">(m/s²)</bdi>
                    </div>
                    <span id="freefall-badge" class="hidden px-2.5 py-1 rounded-full bg-[var(--warn-soft)] text-[var(--warn)] border border-[var(--warn)] font-bold text-[11px] animate-pulse flex items-center gap-1">
                        <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                        <span>سقوط آزاد تشخیص داده شد!</span>
                        <bdi class="sci-term font-mono">(a ≈ 0)</bdi>
                    </span>
                </div>
                <div class="qc-scope-screen relative w-full h-64 overflow-hidden">
                    <canvas id="accel-canvas" class="w-full h-full block"></canvas>
                </div>
            </div>
        </div>
        `;

        initAccelCanvas();
    }

    function initAccelCanvas() {
        const canvas = document.getElementById('accel-canvas');
        if (!canvas) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.floor(rect.width || 800);
        canvas.height = Math.floor(rect.height || 256);
        drawAccelOscilloscope();
    }

    function drawGrid(ctx, w, h) {
        const isLight = document.documentElement.classList.contains('light');
        ctx.strokeStyle = isLight ? 'rgba(14, 44, 90, 0.08)' : 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 32) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 32) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    async function startAccelerometer() {
        const btn = document.getElementById('accel-start-btn');
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const response = await DeviceMotionEvent.requestPermission();
                if (response !== 'granted') {
                    alert('دسترسی به سنسور شتاب‌سنج توسط کاربر رد شد.');
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (btn) {
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-[var(--ok)]"></i><span>سنسور فعال است ✓</span>`;
            btn.classList.add('qc-btn--ok');
            if (window.lucide) window.lucide.createIcons();
        }

        accelHistory = [];

        accelListener = function(event) {
            const acc = event.accelerationIncludingGravity || event.acceleration;
            if (!acc) return;

            const ax = acc.x || 0;
            const ay = acc.y || 0;
            const az = acc.z || 9.8;
            const total = Math.sqrt(ax * ax + ay * ay + az * az);

            updateAccelUI(total, ax, ay, az);
        };

        window.addEventListener('devicemotion', accelListener);

        // Fallback simulation if running on desktop browser
        if (!('DeviceMotionEvent' in window) || window.location.protocol !== 'https:') {
            startDesktopSimulation();
        }
    }

    function updateAccelUI(total, ax, ay, az) {
        const totalEl = document.getElementById('accel-total');
        const xEl = document.getElementById('accel-x');
        const yEl = document.getElementById('accel-y');
        const zEl = document.getElementById('accel-z');
        const ffEl = document.getElementById('freefall-badge');

        if (totalEl) totalEl.textContent = total.toFixed(2);
        if (xEl) xEl.textContent = ax.toFixed(2);
        if (yEl) yEl.textContent = ay.toFixed(2);
        if (zEl) zEl.textContent = az.toFixed(2);

        if (ffEl) {
            if (total < 2.0) {
                ffEl.classList.remove('hidden');
            } else {
                ffEl.classList.add('hidden');
            }
        }

        accelHistory.push(total);
        if (accelHistory.length > MAX_HISTORY) accelHistory.shift();

        drawAccelOscilloscope();
    }

    function toggleSimulation() {
        if (isSimulating) {
            if (simInterval) clearInterval(simInterval);
            simInterval = null;
            isSimulating = false;
            const txt = document.getElementById('sim-toggle-text');
            if (txt) txt.textContent = 'شبیه‌سازی زنده (Demo)';
        } else {
            isSimulating = true;
            const txt = document.getElementById('sim-toggle-text');
            if (txt) txt.textContent = 'توقف شبیه‌سازی ⏸';
            startDesktopSimulation();
        }
    }

    function startDesktopSimulation() {
        let simT = 0;
        if (simInterval) clearInterval(simInterval);
        simInterval = setInterval(() => {
            simT += 0.12;
            const fakeAcc = 9.80 + Math.sin(simT * 1.5) * 1.8 + (Math.random() - 0.5) * 0.4;
            const ax = Math.sin(simT * 0.8) * 1.2;
            const ay = Math.cos(simT * 0.6) * 0.9;
            const total = Math.sqrt(ax * ax + ay * ay + fakeAcc * fakeAcc);

            updateAccelUI(total, ax, ay, fakeAcc);
        }, 50);
    }

    function triggerFreeFallSim() {
        if (!isSimulating) toggleSimulation();
        let count = 0;
        const ffTimer = setInterval(() => {
            count++;
            const total = 0.15 + Math.random() * 0.2;
            updateAccelUI(total, 0.05, 0.05, total);
            if (count > 25) clearInterval(ffTimer);
        }, 40);
    }

    function drawAccelOscilloscope() {
        const canvas = document.getElementById('accel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const isLight = document.documentElement.classList.contains('light');

        ctx.fillStyle = isLight ? '#ffffff' : '#070e1b';
        ctx.fillRect(0, 0, w, h);
        drawGrid(ctx, w, h);

        // Reference line 9.80 m/s²
        const midY = h / 2;
        ctx.strokeStyle = isLight ? '#cbd5e1' : '#1e293b';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Reference text
        ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText('g = 9.80 m/s²', 12, midY - 6);

        if (accelHistory.length < 2) {
            // Draw placeholder baseline
            ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, midY);
            ctx.lineTo(w, midY);
            ctx.stroke();
            return;
        }

        // Waveform trace with glow
        ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = isLight ? 'rgba(2, 132, 199, 0.4)' : '#06b6d4';
        ctx.shadowBlur = isLight ? 4 : 10;
        ctx.beginPath();

        const step = w / (MAX_HISTORY - 1);
        for (let i = 0; i < accelHistory.length; i++) {
            const val = accelHistory[i];
            const y = midY - (val - 9.8) * 10;
            const clampedY = Math.max(8, Math.min(h - 8, y));
            if (i === 0) {
                ctx.moveTo(0, clampedY);
            } else {
                ctx.lineTo(i * step, clampedY);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // --- Tab 2: Inclinometer & Pendulum ---
    function renderInclineTab(stage) {
        stage.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
                <div class="space-y-1">
                    <h3 class="text-base sm:text-lg font-black text-[var(--ink)] flex items-center gap-2">
                        <i data-lucide="compass" class="w-5 h-5 text-[var(--accent-2)]"></i>
                        <span>زاویه‌سنج شیب و دوره تناوب آونگ ساده</span>
                        <bdi class="sci-term font-mono text-[var(--accent-2)]">(T)</bdi>
                    </h3>
                    <p class="text-xs text-[var(--muted)] flex flex-wrap items-center gap-2 leading-relaxed">
                        <span>اندازه‌گیری زاویه شیب و سطح تراز با ژیروسکوپ و محاسبه دوره تناوب با رابطه</span>
                        <bdi class="sci-term px-2 py-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--line)] font-mono text-[var(--accent-2)] font-bold">T = 2π √(L / g)</bdi>
                    </p>
                </div>
                <button type="button" id="incline-start-btn" onclick="MobileSensorLab.startInclinometer()" class="qc-btn qc-btn--sm">
                    <i data-lucide="compass" class="w-4 h-4"></i>
                    <span>فعال‌سازی ژیروسکوپ</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Artificial Horizon / Level Display -->
                <div class="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex flex-col items-center justify-center space-y-4">
                    <div class="text-xs sm:text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                        <i data-lucide="crosshair" class="w-4 h-4 text-[var(--accent-2)]"></i>
                        <span>تراز حبابی و شیب‌سنج ۲ محوره</span>
                    </div>
                    <div class="relative w-48 h-48 rounded-full border-4 border-[var(--accent-2-soft)] bg-[var(--surface)] flex items-center justify-center overflow-hidden shadow-lg">
                        <!-- Crosshairs -->
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div class="w-full h-0.5 bg-[var(--line-strong)]"></div>
                            <div class="h-full w-0.5 bg-[var(--line-strong)] absolute"></div>
                            <div class="w-24 h-24 rounded-full border border-[var(--line-strong)]"></div>
                        </div>
                        <div id="bubble-level" class="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] border-2 border-white shadow-md transition-transform duration-75 flex items-center justify-center text-xs font-black text-white font-mono">
                            +
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 w-full text-center text-xs">
                        <div class="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                            <div class="text-[11px] text-[var(--muted)] flex items-center justify-center gap-1">
                                <span>زاویه شیب</span>
                                <bdi class="sci-term font-mono text-[var(--accent-2)]">(Pitch β)</bdi>
                            </div>
                            <div id="pitch-val" class="text-lg font-black text-[var(--accent-2)] font-mono mt-1 qc-lcd">0.0°</div>
                        </div>
                        <div class="p-3 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                            <div class="text-[11px] text-[var(--muted)] flex items-center justify-center gap-1">
                                <span>زاویه غلتش</span>
                                <bdi class="sci-term font-mono text-[var(--accent-2)]">(Roll γ)</bdi>
                            </div>
                            <div id="roll-val" class="text-lg font-black text-[var(--accent-2)] font-mono mt-1 qc-lcd">0.0°</div>
                        </div>
                    </div>
                </div>

                <!-- Simple Pendulum Calculator -->
                <div class="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] space-y-4">
                    <div class="text-xs sm:text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                        <i data-lucide="timer" class="w-4 h-4 text-[var(--ok)]"></i>
                        <span>محاسبه‌گر تناوب آونگ ساده</span>
                        <bdi class="sci-term font-mono text-[var(--ok)]">(T)</bdi>
                    </div>
                    <p class="text-xs text-[var(--muted)] leading-relaxed">
                        با تغییر طول نخ آونگ <bdi class="sci-term font-mono text-[var(--accent)]">(L)</bdi>، زمان یک رفت‌وبرگشت کامل را بر مبنای گرانش اندازه بگیرید:
                    </p>

                    <div class="space-y-2 pt-2">
                        <div class="flex justify-between items-center text-xs text-[var(--ink-2)]">
                            <span class="flex items-center gap-1">
                                <span>طول نخ آونگ</span>
                                <bdi class="sci-term font-mono text-[var(--accent)]">(L):</bdi>
                            </span>
                            <span id="pendulum-len-display" class="font-mono text-[var(--accent)] font-bold">0.50 m (۵۰ سانتی‌متر)</span>
                        </div>
                        <input type="range" id="pendulum-length-slider" min="0.1" max="2.0" step="0.05" value="0.5" oninput="MobileSensorLab.updatePendulumPeriod()" class="w-full accent-[var(--accent)] cursor-pointer">
                    </div>

                    <div class="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-center space-y-2">
                        <div class="text-xs text-[var(--muted)] flex items-center justify-center gap-1">
                            <span>دوره تناوب تئوری</span>
                            <bdi class="sci-term font-mono text-[var(--ok)]">(T)</bdi>
                        </div>
                        <div class="flex items-baseline justify-center gap-1 font-mono">
                            <span id="pendulum-period-display" class="text-3xl font-black text-[var(--ok)] qc-lcd qc-lcd-green">1.42</span>
                            <span class="text-xs font-bold text-[var(--muted)] font-mono">s</span>
                        </div>
                        <div class="text-[11px] text-[var(--accent)] font-mono py-1">
                            <bdi class="sci-term">T = 2 × π × √(L / 9.80)</bdi>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    async function startInclinometer() {
        const btn = document.getElementById('incline-start-btn');
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response !== 'granted') {
                    alert('دسترسی به سنسور جهت‌یاب توسط کاربر رد شد.');
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (btn) {
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-[var(--ok)]"></i><span>ژیروسکوپ فعال است ✓</span>`;
            btn.classList.add('qc-btn--ok');
            if (window.lucide) window.lucide.createIcons();
        }

        orientListener = function(event) {
            const beta = event.beta || 0;   // Pitch [-180, 180]
            const gamma = event.gamma || 0; // Roll [-90, 90]

            const pitchEl = document.getElementById('pitch-val');
            const rollEl = document.getElementById('roll-val');
            const bubbleEl = document.getElementById('bubble-level');

            if (pitchEl) pitchEl.textContent = beta.toFixed(1) + '°';
            if (rollEl) rollEl.textContent = gamma.toFixed(1) + '°';

            if (bubbleEl) {
                const clampedX = Math.max(-60, Math.min(60, gamma * 1.5));
                const clampedY = Math.max(-60, Math.min(60, beta * 1.5));
                bubbleEl.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
            }
        };

        window.addEventListener('deviceorientation', orientListener);

        // Fallback simulation for desktop
        if (!('DeviceOrientationEvent' in window)) {
            let simBeta = 0;
            let simGamma = 0;
            document.addEventListener('mousemove', (e) => {
                if (!orientListener) return;
                const normX = (e.clientX / window.innerWidth - 0.5) * 60;
                const normY = (e.clientY / window.innerHeight - 0.5) * 60;
                orientListener({ beta: normY, gamma: normX });
            });
        }
    }

    function updatePendulumPeriod() {
        const slider = document.getElementById('pendulum-length-slider');
        const lenDisplay = document.getElementById('pendulum-len-display');
        const periodDisplay = document.getElementById('pendulum-period-display');
        if (!slider) return;

        const L = parseFloat(slider.value);
        if (lenDisplay) lenDisplay.textContent = `${L.toFixed(2)} m (${Math.round(L * 100)} سانتی‌متر)`;

        const g = 9.80;
        const T = 2 * Math.PI * Math.sqrt(L / g);
        if (periodDisplay) periodDisplay.textContent = T.toFixed(2);
    }

    // --- Tab 3: Audio FFT Resonator ---
    function renderAudioTab(stage) {
        stage.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
                <div class="space-y-1">
                    <h3 class="text-base sm:text-lg font-black text-[var(--ink)] flex items-center gap-2">
                        <i data-lucide="volume-2" class="w-5 h-5 text-[var(--accent-3)]"></i>
                        <span>تحلیل فرکانس امواج صوتی و تشدید لوله‌ها</span>
                        <bdi class="sci-term font-mono text-[var(--accent-3)]">(FFT)</bdi>
                    </h3>
                    <p class="text-xs text-[var(--muted)] flex flex-wrap items-center gap-2 leading-relaxed">
                        <span>استخراج بسامد هماهنگ‌ها و محاسبه طول لوله تشدید:</span>
                        <bdi class="sci-term px-2 py-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--line)] font-mono text-[var(--accent)] font-bold">f = v / (4L)</bdi>
                        <span>(لوله بسته) یا</span>
                        <bdi class="sci-term px-2 py-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--line)] font-mono text-[var(--accent)] font-bold">f = v / (2L)</bdi>
                        <span>(لوله باز)</span>
                    </p>
                </div>
                <button type="button" id="audio-start-btn" onclick="MobileSensorLab.startAudioAnalyzer()" class="qc-btn qc-btn--sm">
                    <i data-lucide="mic" class="w-4 h-4"></i>
                    <span>شروع ضبط و تحلیل فوریه (FFT)</span>
                </button>
            </div>

            <!-- Peak Telemetry Gauges -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--accent)] font-bold flex items-center justify-center gap-1">
                        <span>فرکانس تشدید غالب</span>
                        <bdi class="sci-term font-mono">(f0)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="fft-peak-freq" class="text-2xl sm:text-3xl font-black text-[var(--accent)] qc-lcd qc-lcd-cyan">--</span>
                        <span class="text-xs font-bold text-[var(--muted)] font-mono">Hz</span>
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--ok)] font-bold flex items-center justify-center gap-1">
                        <span>طول لوله بسته تشدید</span>
                        <bdi class="sci-term font-mono text-[var(--ok)]">(L = v / 4f)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="fft-closed-tube" class="text-xl sm:text-2xl font-bold text-[var(--ok)] qc-lcd qc-lcd-green">--</span>
                        <span class="text-xs font-bold text-[var(--muted)] font-mono">cm</span>
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--accent-2)] font-bold flex items-center justify-center gap-1">
                        <span>طول لوله باز تشدید</span>
                        <bdi class="sci-term font-mono text-[var(--accent-2)]">(L = v / 2f)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="fft-open-tube" class="text-xl sm:text-2xl font-bold text-[var(--accent-2)] qc-lcd">--</span>
                        <span class="text-xs font-bold text-[var(--muted)] font-mono">cm</span>
                    </div>
                </div>
            </div>

            <!-- Spectrogram Spectrum Canvas -->
            <div class="space-y-2">
                <div class="text-xs text-[var(--muted)] flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-[var(--ink-2)]">طیف بسامد پیوسته (اسپکتروگرام فوریه ۰ الی ۲۵۰۰ هرتز)</span>
                    </div>
                    <bdi class="sci-term text-[var(--muted)] font-mono text-[11px]">v_sound = 343 m/s</bdi>
                </div>
                <div class="qc-scope-screen relative w-full h-60 overflow-hidden">
                    <canvas id="audio-fft-canvas" class="w-full h-full block"></canvas>
                </div>
            </div>
        </div>
        `;

        initAudioCanvas();
    }

    function initAudioCanvas() {
        const canvas = document.getElementById('audio-fft-canvas');
        if (!canvas) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.floor(rect.width || 800);
        canvas.height = Math.floor(rect.height || 240);
        const ctx = canvas.getContext('2d');
        const isLight = document.documentElement.classList.contains('light');
        ctx.fillStyle = isLight ? '#ffffff' : '#070e1b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
    }

    async function startAudioAnalyzer() {
        const btn = document.getElementById('audio-start-btn');
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            microphone = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            microphone.connect(analyser);

            if (btn) {
                btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-[var(--ok)]"></i><span>تحلیل صوتی فعال است ✓</span>`;
                btn.classList.add('qc-btn--ok');
                if (window.lucide) window.lucide.createIcons();
            }

            drawAudioSpectrogram();
        } catch (e) {
            console.warn('Microphone unavailable, starting simulated audio spectrum:', e);
            startSimulatedAudio();
            if (btn) {
                btn.innerHTML = `<span>شبیه‌سازی صوتی فعال شد ✓</span>`;
                btn.classList.add('qc-btn--soft');
            }
        }
    }

    function startSimulatedAudio() {
        const bufferLength = 128;
        const dataArray = new Uint8Array(bufferLength);
        let phase = 0;

        function loop() {
            phase += 0.08;
            for (let i = 0; i < bufferLength; i++) {
                const harmonic1 = Math.sin(phase * 2 + i * 0.15);
                const harmonic2 = Math.sin(phase * 4 + i * 0.3) * 0.5;
                dataArray[i] = Math.max(0, Math.min(255, Math.floor((harmonic1 + harmonic2 + 1) * 80)));
            }

            const peakFreq = 440 + Math.floor(Math.sin(phase) * 50);
            renderFftTelemetry(peakFreq);
            renderFftBars(dataArray, bufferLength);
            animationFrame = requestAnimationFrame(loop);
        }
        loop();
    }

    function drawAudioSpectrogram() {
        if (!analyser) return;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function renderFrame() {
            analyser.getByteFrequencyData(dataArray);

            let maxVal = 0;
            let maxIndex = 0;
            for (let i = 5; i < Math.min(bufferLength, 300); i++) {
                if (dataArray[i] > maxVal) {
                    maxVal = dataArray[i];
                    maxIndex = i;
                }
            }

            const nyquist = audioContext.sampleRate / 2;
            const peakFreq = Math.round(maxIndex * (nyquist / bufferLength));

            if (maxVal > 30) {
                renderFftTelemetry(peakFreq);
            }

            renderFftBars(dataArray, Math.min(bufferLength, 180));
            animationFrame = requestAnimationFrame(renderFrame);
        }

        renderFrame();
    }

    function renderFftTelemetry(peakFreq) {
        const peakEl = document.getElementById('fft-peak-freq');
        const closedEl = document.getElementById('fft-closed-tube');
        const openEl = document.getElementById('fft-open-tube');

        if (peakEl) peakEl.textContent = peakFreq;

        if (peakFreq > 20) {
            const v = 343; // m/s
            const L_closed = (v / (4 * peakFreq)) * 100;
            const L_open = (v / (2 * peakFreq)) * 100;
            if (closedEl) closedEl.textContent = L_closed.toFixed(1);
            if (openEl) openEl.textContent = L_open.toFixed(1);
        }
    }

    function renderFftBars(dataArray, count) {
        const canvas = document.getElementById('audio-fft-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const isLight = document.documentElement.classList.contains('light');

        ctx.fillStyle = isLight ? '#ffffff' : '#070e1b';
        ctx.fillRect(0, 0, w, h);
        drawGrid(ctx, w, h);

        const barWidth = (w / count) * 1.5;
        let x = 0;

        for (let i = 0; i < count; i++) {
            const barHeight = (dataArray[i] / 255) * h;
            const hue = isLight ? (200 + i * 0.4) : (180 + i * 0.6);
            ctx.fillStyle = `hsl(${hue}, 85%, ${isLight ? '45%' : '60%'})`;
            ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
            x += barWidth;
        }
    }

    return {
        render,
        switchTab,
        startAccelerometer,
        toggleSimulation,
        triggerFreeFallSim,
        startInclinometer,
        updatePendulumPeriod,
        startAudioAnalyzer
    };
})();

window.MobileSensorLab = MobileSensorLab;
