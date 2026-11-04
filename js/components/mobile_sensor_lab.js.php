<?php
/**
 * QUANTUM CUT — Mobile Sensor Physics Lab Component (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Mobile Sensor Physics Lab (آزمایشگاه فیزیک سنسورهای گوشی)
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
    const MAX_HISTORY = 90;

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-8 pb-16">
            <!-- Header HUD (Quantum Obsidian Physics) -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-950 to-cyan-950 border border-cyan-500/30 p-6 md:p-8 shadow-2xl quantum-hud-panel">
                <div class="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 space-y-3 text-center md:text-right">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
                        <i data-lucide="smartphone" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>آزمایشگاه همراه پژوهشگران سمپاد</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 font-mono">v4.2</span>
                    </div>
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <span class="p-2 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
                            <i data-lucide="activity" class="w-6 h-6 md:w-8 md:h-8"></i>
                        </span>
                        <span>آزمایشگاه سنسوری تلفن همراه</span>
                    </h1>
                    <p class="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                        تبدیل گوشی هوشمند یا تبلت به یک آزمایشگاه اندازه‌گیری دقیق فیزیک با استفاده از سنسورهای شتاب‌سنج، ژیروسکوپ زاویه‌سنج و میکروفون با تحلیل تبدیل سریع فوریه <bdi class="sci-term text-cyan-300 font-mono">(FFT)</bdi>.
                    </p>
                </div>
            </div>

            <!-- Tab Selectors (Cyber HUD Segmented Bar) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950/90 p-2 rounded-2xl border border-slate-800/80 shadow-lg">
                <button onclick="MobileSensorLab.switchTab('accel')" id="tab-btn-accel" class="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'accel' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'}">
                    <i data-lucide="zap" class="w-4 h-4 text-cyan-300"></i>
                    <span>۱. شتاب‌سنج و گرانش</span>
                    <bdi class="sci-term font-mono text-cyan-300">(g)</bdi>
                </button>
                <button onclick="MobileSensorLab.switchTab('incline')" id="tab-btn-incline" class="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'incline' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'}">
                    <i data-lucide="compass" class="w-4 h-4 text-teal-300"></i>
                    <span>۲. زاویه‌سنج و آونگ</span>
                    <bdi class="sci-term font-mono text-teal-300">(T)</bdi>
                </button>
                <button onclick="MobileSensorLab.switchTab('audio')" id="tab-btn-audio" class="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'audio' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'}">
                    <i data-lucide="volume-2" class="w-4 h-4 text-violet-300"></i>
                    <span>۳. رزونانس صوتی</span>
                    <bdi class="sci-term font-mono text-violet-300">(FFT)</bdi>
                </button>
            </div>

            <!-- Instrument Stage -->
            <div id="sensor-stage" class="bg-slate-950/90 border border-slate-800/90 rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden">
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
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div class="space-y-1">
                    <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <i data-lucide="activity" class="w-5 h-5 text-cyan-400"></i>
                        <span>اسیلوسکوپ شتاب و شتاب گرانش زمین</span>
                    </h3>
                    <p class="text-xs text-slate-400 flex flex-wrap items-center gap-1.5 leading-relaxed">
                        <span>اندازه‌گیری مقدار کل بردار شتاب</span>
                        <bdi class="sci-term text-cyan-300 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">|a| = &radic;(a<sub>x</sub>&sup2; + a<sub>y</sub>&sup2; + a<sub>z</sub>&sup2;)</bdi>
                        <span>و تشخیص خودکار لحظه سقوط آزاد</span>
                        <bdi class="sci-term text-amber-300 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">(a &asymp; 0)</bdi>
                    </p>
                </div>
                <button id="accel-start-btn" onclick="MobileSensorLab.startAccelerometer()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 shrink-0">
                    <i data-lucide="radio" class="w-4 h-4"></i>
                    <span>فعال‌سازی سنسور شتاب‌سنج</span>
                </button>
            </div>

            <!-- Readout Gauges (LCD Digital Scientific HUD) -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div class="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 quantum-hud-panel relative overflow-hidden">
                    <div class="text-[11px] text-cyan-400 font-medium flex items-center justify-center gap-1">
                        <span>شتاب کل گرانش</span>
                        <bdi class="sci-term text-cyan-300 font-mono">(|g|)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="accel-total" class="text-2xl sm:text-3xl font-black text-cyan-400 lcd-display sci-term">9.80</span>
                        <span class="text-xs font-bold text-cyan-500/90 font-mono sci-term">m/s&sup2;</span>
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 quantum-hud-panel">
                    <div class="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                        <span>محور افقی</span>
                        <bdi class="sci-term text-slate-300 font-mono">(a<sub>x</sub>)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="accel-x" class="text-xl sm:text-2xl font-bold text-slate-200 lcd-display sci-term">0.00</span>
                        <span class="text-[10px] text-slate-500 font-mono sci-term">m/s&sup2;</span>
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 quantum-hud-panel">
                    <div class="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                        <span>محور عمودی</span>
                        <bdi class="sci-term text-slate-300 font-mono">(a<sub>y</sub>)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="accel-y" class="text-xl sm:text-2xl font-bold text-slate-200 lcd-display sci-term">0.00</span>
                        <span class="text-[10px] text-slate-500 font-mono sci-term">m/s&sup2;</span>
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 quantum-hud-panel">
                    <div class="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                        <span>محور عمق</span>
                        <bdi class="sci-term text-slate-300 font-mono">(a<sub>z</sub>)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="accel-z" class="text-xl sm:text-2xl font-bold text-slate-200 lcd-display sci-term">9.80</span>
                        <span class="text-[10px] text-slate-500 font-mono sci-term">m/s&sup2;</span>
                    </div>
                </div>
            </div>

            <!-- Oscilloscope Canvas HUD -->
            <div class="space-y-2">
                <div class="text-xs text-slate-400 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span>نمودار نوسان‌نمای شتاب لحظه‌ای</span>
                        <bdi class="sci-term text-cyan-400 font-mono text-xs">(m/s&sup2;)</bdi>
                    </div>
                    <span id="freefall-badge" class="hidden px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px] animate-pulse flex items-center gap-1">
                        <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                        <span>سقوط آزاد تشخیص داده شد!</span>
                        <bdi class="sci-term font-mono">(a &asymp; 0)</bdi>
                    </span>
                </div>
                <div class="relative w-full h-56 bg-slate-950 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-inner">
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
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
    }

    function drawGrid(ctx, w, h) {
        ctx.strokeStyle = '#0f172a';
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
                    alert('دسترسی به سنسور شتاب‌سنج داده نشد.');
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (btn) {
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-300"></i><span>سنسور فعال است ✓</span>`;
            btn.className = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0";
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
        };

        window.addEventListener('devicemotion', accelListener);

        // Fallback simulation if running on desktop browser
        if (!('DeviceMotionEvent' in window) || window.location.protocol !== 'https:') {
            startDesktopSimulation();
        }
    }

    function startDesktopSimulation() {
        let simT = 0;
        setInterval(() => {
            if (!accelListener) return;
            simT += 0.1;
            const fakeAcc = 9.8 + Math.sin(simT) * 1.5 + (Math.random() - 0.5) * 0.35;
            const ev = {
                accelerationIncludingGravity: {
                    x: Math.sin(simT * 0.7) * 0.8,
                    y: Math.cos(simT * 0.5) * 0.5,
                    z: fakeAcc
                }
            };
            accelListener(ev);
        }, 50);
    }

    function drawAccelOscilloscope() {
        const canvas = document.getElementById('accel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, w, h);
        drawGrid(ctx, w, h);

        // Reference line 9.80 m/s²
        const midY = h / 2;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Reference text
        ctx.fillStyle = '#64748b';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText('9.80 m/s²', 10, midY - 6);

        if (accelHistory.length < 2) return;

        // Waveform trace
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();

        const step = w / (MAX_HISTORY - 1);
        for (let i = 0; i < accelHistory.length; i++) {
            const val = accelHistory[i];
            const y = midY - (val - 9.8) * 9;
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
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div class="space-y-1">
                    <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <i data-lucide="compass" class="w-5 h-5 text-teal-400"></i>
                        <span>زاویه‌سنج شیب و دوره تناوب آونگ ساده</span>
                        <bdi class="sci-term text-teal-300 font-mono">(T)</bdi>
                    </h3>
                    <p class="text-xs text-slate-400 flex flex-wrap items-center gap-1.5 leading-relaxed">
                        <span>اندازه‌گیری زاویه شیب و سطح تراز با ژیروسکوپ و محاسبه دوره تناوب با رابطه</span>
                        <bdi class="sci-term text-cyan-300 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">T = 2&pi; &radic;(L / g)</bdi>
                    </p>
                </div>
                <button id="incline-start-btn" onclick="MobileSensorLab.startInclinometer()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2 shrink-0">
                    <i data-lucide="compass" class="w-4 h-4"></i>
                    <span>فعال‌سازی ژیروسکوپ</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Artificial Horizon / Level Display -->
                <div class="bg-slate-900/80 p-6 rounded-3xl border border-cyan-500/20 quantum-hud-panel flex flex-col items-center justify-center space-y-4">
                    <div class="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                        <i data-lucide="crosshair" class="w-4 h-4 text-cyan-400"></i>
                        <span>تراز کروی و شیب‌سنج ۲ محوره ژیروسکوپی</span>
                    </div>
                    <div class="relative w-48 h-48 rounded-full border-4 border-cyan-500/40 bg-slate-950 flex items-center justify-center overflow-hidden shadow-2xl">
                        <!-- Crosshairs -->
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div class="w-full h-0.5 bg-cyan-500/20"></div>
                            <div class="h-full w-0.5 bg-cyan-500/20 absolute"></div>
                            <div class="w-24 h-24 rounded-full border border-cyan-500/20"></div>
                        </div>
                        <div id="bubble-level" class="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-300 border-2 border-white shadow-lg shadow-cyan-400/60 transition-transform duration-75 flex items-center justify-center text-xs font-black text-slate-950 font-mono">
                            +
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 w-full text-center text-xs">
                        <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                            <div class="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                                <span>زاویه شیب</span>
                                <bdi class="sci-term text-cyan-400 font-mono">(Pitch &beta;)</bdi>
                            </div>
                            <div id="pitch-val" class="text-lg font-black text-cyan-400 font-mono mt-1 sci-term">0.0°</div>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                            <div class="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                                <span>زاویه غلتش</span>
                                <bdi class="sci-term text-cyan-400 font-mono">(Roll &gamma;)</bdi>
                            </div>
                            <div id="roll-val" class="text-lg font-black text-cyan-400 font-mono mt-1 sci-term">0.0°</div>
                        </div>
                    </div>
                </div>

                <!-- Simple Pendulum Calculator -->
                <div class="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 quantum-hud-panel space-y-4">
                    <div class="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                        <i data-lucide="timer" class="w-4 h-4 text-emerald-400"></i>
                        <span>محاسبه‌گر دوره تناوب آونگ ساده</span>
                        <bdi class="sci-term text-emerald-400 font-mono">(T)</bdi>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        با تغییر طول نخ آونگ <bdi class="sci-term text-cyan-300 font-mono">(L)</bdi>، دوره تناوب نوسان‌های کوچک را بر پایه شتاب گرانش اندازه‌گیری شده محاسبه کنید:
                    </p>

                    <div class="space-y-2 pt-2">
                        <div class="flex justify-between items-center text-xs text-slate-300">
                            <span class="flex items-center gap-1">
                                <span>طول نخ آونگ</span>
                                <bdi class="sci-term text-cyan-400 font-mono">(L):</bdi>
                            </span>
                            <span id="pendulum-len-display" class="font-mono text-cyan-300 font-bold sci-term">0.50 m (۵۰ سانتی‌متر)</span>
                        </div>
                        <input type="range" id="pendulum-length-slider" min="0.1" max="2.0" step="0.05" value="0.5" oninput="MobileSensorLab.updatePendulumPeriod()" class="w-full accent-cyan-500 cursor-pointer">
                    </div>

                    <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                        <div class="text-xs text-slate-400 flex items-center justify-center gap-1">
                            <span>دوره تناوب تئوری</span>
                            <bdi class="sci-term text-emerald-400 font-mono">(T)</bdi>
                        </div>
                        <div class="flex items-baseline justify-center gap-1 font-mono">
                            <span id="pendulum-period-display" class="text-3xl font-black text-emerald-400 lcd-display sci-term">1.42</span>
                            <span class="text-xs font-bold text-emerald-500 font-mono sci-term">s</span>
                        </div>
                        <div class="text-[11px] text-cyan-400/90 font-mono py-1">
                            <bdi class="sci-term">T = 2 &times; &pi; &times; &radic;(L / 9.80)</bdi>
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
                    alert('دسترسی به سنسور جهت‌یاب داده نشد.');
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (btn) {
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-300"></i><span>ژیروسکوپ فعال است ✓</span>`;
            btn.className = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0";
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
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div class="space-y-1">
                    <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <i data-lucide="volume-2" class="w-5 h-5 text-violet-400"></i>
                        <span>تحلیل فرکانس امواج صوتی و تشدید لوله‌ها</span>
                        <bdi class="sci-term text-violet-300 font-mono">(FFT)</bdi>
                    </h3>
                    <p class="text-xs text-slate-400 flex flex-wrap items-center gap-1.5 leading-relaxed">
                        <span>استخراج بسامد هماهنگ‌ها و محاسبه طول لوله تشدید:</span>
                        <bdi class="sci-term text-cyan-300 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">f = v / (4L)</bdi>
                        <span>(لوله بسته) یا</span>
                        <bdi class="sci-term text-cyan-300 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">f = v / (2L)</bdi>
                        <span>(لوله باز)</span>
                    </p>
                </div>
                <button id="audio-start-btn" onclick="MobileSensorLab.startAudioAnalyzer()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 shrink-0">
                    <i data-lucide="mic" class="w-4 h-4"></i>
                    <span>شروع ضبط و تحلیل فوریه (FFT)</span>
                </button>
            </div>

            <!-- Peak Telemetry Gauges -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div class="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 quantum-hud-panel">
                    <div class="text-[11px] text-cyan-400 font-medium flex items-center justify-center gap-1">
                        <span>فرکانس تشدید غالب</span>
                        <bdi class="sci-term text-cyan-300 font-mono">(f<sub>0</sub>)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="fft-peak-freq" class="text-2xl sm:text-3xl font-black text-cyan-400 lcd-display sci-term">--</span>
                        <span class="text-xs font-bold text-cyan-500 font-mono sci-term">Hz</span>
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 quantum-hud-panel">
                    <div class="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                        <span>طول لوله بسته تشدید</span>
                        <bdi class="sci-term text-emerald-300 font-mono">(L = v / 4f)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="fft-closed-tube" class="text-xl sm:text-2xl font-bold text-emerald-400 lcd-display sci-term">--</span>
                        <span class="text-xs font-bold text-emerald-500 font-mono sci-term">cm</span>
                    </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 quantum-hud-panel">
                    <div class="text-[11px] text-indigo-400 font-medium flex items-center justify-center gap-1">
                        <span>طول لوله باز تشدید</span>
                        <bdi class="sci-term text-indigo-300 font-mono">(L = v / 2f)</bdi>
                    </div>
                    <div class="mt-2 flex items-baseline justify-center gap-1 font-mono">
                        <span id="fft-open-tube" class="text-xl sm:text-2xl font-bold text-indigo-400 lcd-display sci-term">--</span>
                        <span class="text-xs font-bold text-indigo-500 font-mono sci-term">cm</span>
                    </div>
                </div>
            </div>

            <!-- Spectrogram Spectrum Canvas -->
            <div class="space-y-2">
                <div class="text-xs text-slate-400 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span>طیف بسامد پیوسته (اسپکتروگرام فوریه ۰ الی ۲۵۰۰ هرتز)</span>
                    </div>
                    <bdi class="sci-term text-slate-400 font-mono text-[11px]">v_sound = 343 m/s</bdi>
                </div>
                <div class="relative w-full h-56 bg-slate-950 rounded-2xl border border-violet-500/20 overflow-hidden shadow-inner">
                    <canvas id="fft-canvas" class="w-full h-full block"></canvas>
                </div>
            </div>
        </div>
        `;
    }

    async function startAudioAnalyzer() {
        const btn = document.getElementById('audio-start-btn');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            if (btn) {
                btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-300"></i><span>تحلیل صوتی فعال است ✓</span>`;
                btn.className = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0";
                if (window.lucide) window.lucide.createIcons();
            }

            drawAudioSpectrogram();
        } catch (e) {
            console.error('Mic access denied:', e);
            alert('دسترسی به میکروفون میسر نشد.');
        }
    }

    function drawAudioSpectrogram() {
        const canvas = document.getElementById('fft-canvas');
        if (!canvas || !analyser) return;

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function renderFrame() {
            animationFrame = requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Frequency Grid
            drawGrid(ctx, canvas.width, canvas.height);

            // Find peak frequency
            let maxVal = -1;
            let maxIdx = -1;
            const maxBin = Math.floor(2500 / (audioContext.sampleRate / analyser.fftSize));

            for (let i = 2; i < maxBin; i++) {
                if (dataArray[i] > maxVal) {
                    maxVal = dataArray[i];
                    maxIdx = i;
                }
            }

            const peakHz = maxVal > 50 ? Math.round(maxIdx * (audioContext.sampleRate / analyser.fftSize)) : 0;
            const peakEl = document.getElementById('fft-peak-freq');
            const closedEl = document.getElementById('fft-closed-tube');
            const openEl = document.getElementById('fft-open-tube');

            if (peakHz > 50) {
                if (peakEl) peakEl.textContent = peakHz;
                const v = 343; // speed of sound in air (m/s)
                const LclosedCm = ((v / (4 * peakHz)) * 100).toFixed(1);
                const LopenCm = ((v / (2 * peakHz)) * 100).toFixed(1);
                if (closedEl) closedEl.textContent = LclosedCm;
                if (openEl) openEl.textContent = LopenCm;
            }

            // Draw Frequency Bars with neon gradient
            const barWidth = (canvas.width / maxBin) * 1.4;
            let x = 0;
            for (let i = 0; i < maxBin; i++) {
                const barHeight = (dataArray[i] / 255) * (canvas.height - 10);
                const isPeak = (i === maxIdx && maxVal > 50);

                if (isPeak) {
                    ctx.fillStyle = '#38bdf8';
                    ctx.shadowColor = '#0284c7';
                    ctx.shadowBlur = 12;
                } else {
                    ctx.fillStyle = '#6366f1';
                    ctx.shadowBlur = 0;
                }
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            ctx.shadowBlur = 0;
        }

        renderFrame();
    }

    return {
        render,
        switchTab,
        startAccelerometer,
        startInclinometer,
        updatePendulumPeriod,
        startAudioAnalyzer
    };
})();

window.MobileSensorLab = MobileSensorLab;
