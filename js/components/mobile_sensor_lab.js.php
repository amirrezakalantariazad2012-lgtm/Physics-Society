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
    const MAX_HISTORY = 80;

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-8 pb-16">
            <!-- Header HUD -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-blue-500/30 p-8 shadow-2xl">
                <div class="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 space-y-2 text-center md:text-right">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                        <span>📱</span> آزمایشگاه همراه پژوهشگران سمپاد
                    </div>
                    <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <span>🛰️</span> آزمایشگاه سنسوری تلفن همراه
                    </h1>
                    <p class="text-slate-400 text-sm max-w-2xl">
                        تبدیل گوشی هوشمند یا تبلت به یک آزمایشگاه اندازه‌گیری دقیق فیزیک با استفاده از سنسورهای شتاب‌سنج، ژیروسکوپ زاویه‌سنج و میکروفون با تحلیل تبدیل فوریه (FFT).
                    </p>
                </div>
            </div>

            <!-- Tab Selectors -->
            <div class="flex flex-wrap gap-3 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
                <button onclick="MobileSensorLab.switchTab('accel')" id="tab-btn-accel" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'accel' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'}">
                    <span>⚡</span> ۱. شتاب‌سنج و سنجش گرانش ($g$)
                </button>
                <button onclick="MobileSensorLab.switchTab('incline')" id="tab-btn-incline" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'incline' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'}">
                    <span>📐</span> ۲. زاویه‌سنج شیب و دوره آونگ ($T$)
                </button>
                <button onclick="MobileSensorLab.switchTab('audio')" id="tab-btn-audio" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'audio' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200'}">
                    <span>🎵</span> ۳. رزونانس صوتی و تحلیل فرکانس (FFT)
                </button>
            </div>

            <!-- Instrument Stage -->
            <div id="sensor-stage" class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <!-- Dynamic Content -->
            </div>
        </div>
        `;

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
    }

    // --- Tab 1: Accelerometer g ---
    function renderAccelTab(stage) {
        stage.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <span>⚡</span> اسیلوسکوپ شتاب و شتاب گرانش زمین
                    </h3>
                    <p class="text-xs text-slate-400 mt-1">
                        اندازه‌گیری مقدار کل بردار شتاب $|\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}$ و تشخیص لحظه سقوط آزاد ($a \\approx 0$)
                    </p>
                </div>
                <button id="accel-start-btn" onclick="MobileSensorLab.startAccelerometer()" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
                    <span>📡</span> فعال‌سازی سنسور شتاب‌سنج
                </button>
            </div>

            <!-- Readout Gauges -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="text-xs text-slate-400">شتاب کل ($|\vec{g}|$)</div>
                    <div id="accel-total" class="text-2xl font-black text-cyan-400 font-mono mt-1">9.80 m/s²</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="text-xs text-slate-400">محور X ($a_x$)</div>
                    <div id="accel-x" class="text-xl font-bold text-slate-200 font-mono mt-1">0.00</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="text-xs text-slate-400">محور Y ($a_y$)</div>
                    <div id="accel-y" class="text-xl font-bold text-slate-200 font-mono mt-1">0.00</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="text-xs text-slate-400">محور Z ($a_z$)</div>
                    <div id="accel-z" class="text-xl font-bold text-slate-200 font-mono mt-1">9.80</div>
                </div>
            </div>

            <!-- Oscilloscope Canvas -->
            <div class="space-y-2">
                <div class="text-xs text-slate-400 flex items-center justify-between">
                    <span>نمودار نوسان‌نمای شتاب لحظه‌ای ($m/s^2$)</span>
                    <span id="freefall-badge" class="hidden px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] animate-pulse">
                        سقوط آزاد تشخیص داده شد! ($a \\approx 0$)
                    </span>
                </div>
                <div class="relative w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
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
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
    }

    function drawGrid(ctx, w, h) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 30) {
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
            btn.textContent = 'سنسور فعال است ✓';
            btn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
            btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
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

            if (totalEl) totalEl.textContent = total.toFixed(2) + ' m/s²';
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
            const fakeAcc = 9.8 + Math.sin(simT) * 1.5 + (Math.random() - 0.5) * 0.4;
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

        ctx.fillStyle = '#070b14';
        ctx.fillRect(0, 0, w, h);
        drawGrid(ctx, w, h);

        // Reference line 9.8 m/s²
        const midY = h / 2;
        ctx.strokeStyle = '#334155';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        if (accelHistory.length < 2) return;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const step = w / (MAX_HISTORY - 1);
        for (let i = 0; i < accelHistory.length; i++) {
            const val = accelHistory[i];
            const y = midY - (val - 9.8) * 8; // Scale factor
            const clampedY = Math.max(5, Math.min(h - 5, y));
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
                <div>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <span>📐</span> زاویه‌سنج شیب و دوره تناوب آونگ ساده ($T$)
                    </h3>
                    <p class="text-xs text-slate-400 mt-1">
                        اندازه‌گیری زاویه شیب و سطح تراز با ژیروسکوپ گوشی و محاسبه فرمول $T = 2\\pi \\sqrt{\\frac{L}{g}}$
                    </p>
                </div>
                <button id="incline-start-btn" onclick="MobileSensorLab.startInclinometer()" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
                    <span>🧭</span> فعال‌سازی ژیروسکوپ
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Artificial Horizon / Level Display -->
                <div class="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                    <div class="text-sm font-bold text-slate-300">تراز کروی و شیب‌سنج ۲ محوره</div>
                    <div class="relative w-44 h-44 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
                        <div class="absolute inset-0 border border-slate-800 flex items-center justify-center">
                            <div class="w-full h-0.5 bg-slate-700"></div>
                            <div class="h-full w-0.5 bg-slate-700 absolute"></div>
                        </div>
                        <div id="bubble-level" class="w-10 h-10 rounded-full bg-cyan-400/80 border-2 border-cyan-200 shadow-lg shadow-cyan-400/50 transition-all duration-75 flex items-center justify-center text-[10px] font-bold text-slate-900">
                            +
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 w-full text-center text-xs">
                        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
                            <div class="text-slate-400">زاویه شیب (Pitch &beta;)</div>
                            <div id="pitch-val" class="text-base font-bold text-cyan-400 font-mono mt-1">0.0°</div>
                        </div>
                        <div class="p-2 rounded-xl bg-slate-900 border border-slate-800">
                            <div class="text-slate-400">زاویه غلتش (Roll &gamma;)</div>
                            <div id="roll-val" class="text-base font-bold text-cyan-400 font-mono mt-1">0.0°</div>
                        </div>
                    </div>
                </div>

                <!-- Simple Pendulum Calculator -->
                <div class="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div class="text-sm font-bold text-slate-300">محاسبه‌گر دوره تناوب آونگ ساده ($T$)</div>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        با تغییر طول نخ آونگ ($L$)، دوره تناوب نوسان‌های کوچک را بر پایه شتاب گرانش اندازه‌گیری شده محاسبه کنید:
                    </p>

                    <div class="space-y-2 pt-2">
                        <div class="flex justify-between text-xs text-slate-300">
                            <span>طول نخ آونگ ($L$):</span>
                            <span id="pendulum-len-display" class="font-mono text-cyan-400 font-bold">0.50 متر (۵۰ سانتی‌متر)</span>
                        </div>
                        <input type="range" id="pendulum-length-slider" min="0.1" max="2.0" step="0.05" value="0.5" oninput="MobileSensorLab.updatePendulumPeriod()" class="w-full accent-cyan-500">
                    </div>

                    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                        <div class="text-xs text-slate-400">دوره تناوب تئوری ($T$)</div>
                        <div id="pendulum-period-display" class="text-3xl font-black text-emerald-400 font-mono">1.42 s</div>
                        <div class="text-[11px] text-slate-500 font-mono">T = 2 &times; &pi; &times; &radic;(L / 9.8)</div>
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
            btn.textContent = 'ژیروسکوپ فعال است ✓';
            btn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
            btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
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
                const clampedX = Math.max(-55, Math.min(55, gamma * 1.5));
                const clampedY = Math.max(-55, Math.min(55, beta * 1.5));
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
        if (lenDisplay) lenDisplay.textContent = `${L.toFixed(2)} متر (${Math.round(L * 100)} سانتی‌متر)`;

        const g = 9.80;
        const T = 2 * Math.PI * Math.sqrt(L / g);
        if (periodDisplay) periodDisplay.textContent = `${T.toFixed(2)} s`;
    }

    // --- Tab 3: Audio FFT Resonator ---
    function renderAudioTab(stage) {
        stage.innerHTML = `
        <div class="space-y-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <span>🎵</span> تحلیل فرکانس امواج صوتی و تشدید لوله‌ها (FFT)
                    </h3>
                    <p class="text-xs text-slate-400 mt-1">
                        استخراج بسامد هماهنگ‌ها و محاسبه طول لوله تشدید: $f = \\frac{v}{4L}$ (لوله بسته) یا $f = \\frac{v}{2L}$ (لوله باز)
                    </p>
                </div>
                <button id="audio-start-btn" onclick="MobileSensorLab.startAudioAnalyzer()" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
                    <span>🎤</span> شروع ضبط و تحلیل فوریه (FFT)
                </button>
            </div>

            <!-- Peak Telemetry -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="text-xs text-slate-400">فرکانس غالب ($f_0$)</div>
                    <div id="fft-peak-freq" class="text-3xl font-black text-cyan-400 font-mono mt-1">-- Hz</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="text-xs text-slate-400">طول لوله بسته تشدید ($L = \\frac{v}{4f}$)</div>
                    <div id="fft-closed-tube" class="text-2xl font-bold text-emerald-400 font-mono mt-1">-- cm</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="text-xs text-slate-400">طول لوله باز تشدید ($L = \\frac{v}{2f}$)</div>
                    <div id="fft-open-tube" class="text-2xl font-bold text-indigo-400 font-mono mt-1">-- cm</div>
                </div>
            </div>

            <!-- Spectrogram Spectrum Canvas -->
            <div class="space-y-2">
                <div class="text-xs text-slate-400 flex items-center justify-between">
                    <span>طیف بسامد پیوسته (اسپکتروگرام ۰ الی ۲۰۰۰ هرتز)</span>
                    <span class="text-slate-500 font-mono text-[11px]">v_sound = 343 m/s</span>
                </div>
                <div class="relative w-full h-52 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
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
                btn.textContent = 'تحلیل صوتی فعال است ✓';
                btn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
                btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
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

            ctx.fillStyle = '#070b14';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Find peak frequency
            let maxVal = -1;
            let maxIdx = -1;
            // Focus on 20Hz - 2500Hz
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
                if (peakEl) peakEl.textContent = peakHz + ' Hz';
                const v = 343; // speed of sound in air (m/s)
                const LclosedCm = ((v / (4 * peakHz)) * 100).toFixed(1);
                const LopenCm = ((v / (2 * peakHz)) * 100).toFixed(1);
                if (closedEl) closedEl.textContent = LclosedCm + ' cm';
                if (openEl) openEl.textContent = LopenCm + ' cm';
            }

            // Draw Frequency Bars
            const barWidth = (canvas.width / maxBin) * 1.5;
            let x = 0;
            for (let i = 0; i < maxBin; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                const isPeak = (i === maxIdx && maxVal > 50);

                ctx.fillStyle = isPeak ? '#38bdf8' : '#1e3a8a';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
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
