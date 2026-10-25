/**
 * QUANTUM CUT — Interactive Physics Laboratory Simulators & 3D Apparatus Visualizers
 */

class PhysicsSimulators {
    constructor() {
        this.activeSimulators = {};
    }

    /**
     * Determines which simulator to mount for a given lesson
     */
    getSimulatorForLesson(lesson) {
        if (!lesson) return null;
        const slug = (lesson.slug || '').toLowerCase();
        const title = (lesson.title_fa || '').toLowerCase();

        if (slug.includes('density') || slug.includes('volume') || title.includes('چگالی') || title.includes('اندازه‌گیری')) {
            return 'density';
        }
        if (slug.includes('circuit') || slug.includes('electricity') || slug.includes('current') || title.includes('الکتریسیته') || title.includes('مدار')) {
            return 'circuit';
        }
        if (slug.includes('newton') || slug.includes('force') || slug.includes('motion') || title.includes('نیرو') || title.includes('حرکت') || title.includes('شتاب')) {
            return 'newton';
        }
        if (slug.includes('pressure') || slug.includes('fluid') || title.includes('فشار') || title.includes('شاره')) {
            return 'pressure';
        }
        if (slug.includes('light') || slug.includes('refraction') || slug.includes('lens') || title.includes('نور') || title.includes('شکست') || title.includes('عدسی')) {
            return 'optics';
        }
        return null;
    }

    /**
     * Mounts simulator into DOM container
     */
    mount(type, containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;

        if (type === 'density') {
            this.renderDensitySim(el);
        } else if (type === 'circuit') {
            this.renderCircuitSim(el);
        } else if (type === 'newton') {
            this.renderNewtonSim(el);
        } else if (type === 'pressure') {
            this.renderPressureSim(el);
        } else if (type === 'optics') {
            this.renderOpticsSim(el);
        }
    }

    // =========================================================================
    // 1. DENSITY & BUOYANCY SIMULATOR (شبیه‌ساز چگالی و غوطه‌وری ارشمیدس)
    // =========================================================================
    renderDensitySim(container) {
        let mass = 120; // grams
        let volume = 100; // cm3

        const update = () => {
            const density = mass / volume; // g/cm3
            const densityKgM3 = Math.round(density * 1000);

            // Water density is 1.0 g/cm3
            let state = '';
            let stateColor = '';
            let blockY = 0; // % from top of water
            let submergedPercent = 0;

            if (density < 0.98) {
                submergedPercent = Math.round(density * 100);
                state = `شناور روی سطح آب (نیروی شناوری = وزن جسم)`;
                stateColor = 'text-cyan-400';
                blockY = 20 - (100 - submergedPercent) * 0.15;
            } else if (density <= 1.02) {
                submergedPercent = 100;
                state = `غوطه‌ور معلق در آب (چگالی جسم برابر چگالی آب است)`;
                stateColor = 'text-amber-400';
                blockY = 50;
            } else {
                submergedPercent = 100;
                state = `ته‌نشین شده در کف ظرف (نیروی وزن > نیروی شناوری ارشمیدس)`;
                stateColor = 'text-rose-400';
                blockY = 78;
            }

            const valM = document.getElementById('sim-density-m-val');
            const valV = document.getElementById('sim-density-v-val');
            const valD = document.getElementById('sim-density-d-val');
            const stateEl = document.getElementById('sim-density-state');
            const blockEl = document.getElementById('sim-density-block');

            if (valM) valM.innerText = `${mass} g`;
            if (valV) valV.innerText = `${volume} cm³`;
            if (valD) valD.innerText = `${density.toFixed(2)} g/cm³ (${densityKgM3} kg/m³)`;
            if (stateEl) {
                stateEl.innerText = state;
                stateEl.className = `font-bold text-xs ${stateColor}`;
            }
            if (blockEl) {
                blockEl.style.top = `${blockY}%`;
                blockEl.style.transform = `translate(-50%, -50%) scale(${0.7 + (volume / 500) * 0.6})`;
            }
        };

        container.innerHTML = `
        <div class="p-6 rounded-3xl bg-slate-900 border border-blue-500/30 text-white space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                    <h4 class="font-extrabold text-base text-cyan-300">آزمایشگاه مجازی چگالی و اصل شناوری</h4>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    آب خالص: ρ = ۱٫۰۰ g/cm³
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <!-- Controls -->
                <div class="space-y-5">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">جرم جسم (m):</span>
                            <span id="sim-density-m-val" class="text-blue-400 font-bold">120 g</span>
                        </div>
                        <input type="range" min="10" max="400" value="120" id="sim-density-m-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">حجم جسم (V):</span>
                            <span id="sim-density-v-val" class="text-indigo-400 font-bold">100 cm³</span>
                        </div>
                        <input type="range" min="20" max="400" value="100" id="sim-density-v-slider" class="physics-slider w-full" />
                    </div>

                    <!-- Material Presets -->
                    <div class="space-y-1.5">
                        <span class="text-xs text-slate-400 block font-bold">مواد آزمایشی استاندارد کتاب:</span>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="mat-cork" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">چوب پنبه (۰٫۲۴)</button>
                            <button id="mat-wood" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">چوب راش (۰٫۷۰)</button>
                            <button id="mat-alu" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">آلومینیوم (۲٫۷۰)</button>
                            <button id="mat-iron" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">آهن (۷٫۸۰)</button>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-400">چگالی محاسبه‌شده (ρ = m/V):</span>
                            <span id="sim-density-d-val" class="font-extrabold text-amber-400">1.20 g/cm³</span>
                        </div>
                        <div class="flex justify-between text-xs pt-1 border-t border-slate-700/50">
                            <span class="text-slate-400">وضعیت فیزیکی:</span>
                            <span id="sim-density-state" class="font-bold text-xs text-rose-400">ته‌نشین شده در کف</span>
                        </div>
                    </div>
                </div>

                <!-- Physical Beaker Animation Area -->
                <div class="relative h-64 w-full max-w-[240px] mx-auto rounded-b-3xl border-4 border-t-0 border-slate-400/60 bg-gradient-to-b from-transparent via-cyan-900/30 to-blue-900/60 overflow-hidden shadow-inner">
                    <!-- Water Level -->
                    <div class="absolute inset-x-0 bottom-0 top-[18%] bg-cyan-500/25 border-t-2 border-cyan-300/80 backdrop-blur-xs flex items-center justify-center">
                        <!-- Volume scale markers -->
                        <div class="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-[9px] text-cyan-200/60 font-sans">
                            <span>- 500 mL</span>
                            <span>- 400 mL</span>
                            <span>- 300 mL</span>
                            <span>- 200 mL</span>
                            <span>- 100 mL</span>
                        </div>

                        <!-- Physics Block -->
                        <div id="sim-density-block" class="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300 shadow-lg flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300">
                            جسم
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const mSlider = document.getElementById('sim-density-m-slider');
        const vSlider = document.getElementById('sim-density-v-slider');

        if (mSlider) mSlider.addEventListener('input', (e) => { mass = parseFloat(e.target.value); update(); });
        if (vSlider) vSlider.addEventListener('input', (e) => { volume = parseFloat(e.target.value); update(); });

        document.getElementById('mat-cork')?.addEventListener('click', () => { mass = 24; volume = 100; mSlider.value = 24; vSlider.value = 100; update(); });
        document.getElementById('mat-wood')?.addEventListener('click', () => { mass = 70; volume = 100; mSlider.value = 70; vSlider.value = 100; update(); });
        document.getElementById('mat-alu')?.addEventListener('click', () => { mass = 270; volume = 100; mSlider.value = 270; vSlider.value = 100; update(); });
        document.getElementById('mat-iron')?.addEventListener('click', () => { mass = 390; volume = 50; mSlider.value = 390; vSlider.value = 50; update(); });

        update();
    }

    // =========================================================================
    // 2. OHM'S LAW & CIRCUIT SIMULATOR (شبیه‌ساز مدار الکتریکی و قانون اهم)
    // =========================================================================
    renderCircuitSim(container) {
        let voltage = 12; // Volts
        let resistance = 6; // Ohms
        let isSwitchOn = true;

        const update = () => {
            const current = isSwitchOn ? (voltage / resistance) : 0;
            const power = isSwitchOn ? (voltage * current) : 0;

            const vVal = document.getElementById('sim-ohm-v-val');
            const rVal = document.getElementById('sim-ohm-r-val');
            const iVal = document.getElementById('sim-ohm-i-val');
            const pVal = document.getElementById('sim-ohm-p-val');
            const bulb = document.getElementById('sim-ohm-bulb');
            const wires = document.querySelectorAll('.circuit-wire');

            if (vVal) vVal.innerText = `${voltage} V`;
            if (rVal) rVal.innerText = `${resistance} Ω`;
            if (iVal) iVal.innerText = `${current.toFixed(2)} A`;
            if (pVal) pVal.innerText = `${power.toFixed(1)} W`;

            if (bulb) {
                if (isSwitchOn) {
                    const brightness = Math.min(1, power / 40);
                    bulb.style.filter = `drop-shadow(0 0 ${15 + brightness * 25}px rgba(251, 191, 36, ${0.4 + brightness * 0.6}))`;
                    bulb.style.fill = `rgb(251, ${Math.round(191 + brightness * 60)}, 36)`;
                } else {
                    bulb.style.filter = 'none';
                    bulb.style.fill = '#475569';
                }
            }

            wires.forEach(w => {
                if (isSwitchOn) {
                    w.classList.add('circuit-wire-active');
                    w.style.animationDuration = `${Math.max(0.3, 2.5 - current * 0.4)}s`;
                } else {
                    w.classList.remove('circuit-wire-active');
                }
            });
        };

        container.innerHTML = `
        <div class="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                    <h4 class="font-extrabold text-base text-amber-300">آزمایشگاه مدار الکتریکی و قانون اهم (V = I × R)</h4>
                </div>
                <button id="sim-ohm-switch-btn" class="px-4 py-1 rounded-full text-xs font-bold transition-all bg-emerald-600 text-white border border-emerald-400">
                    کلید: وصل (روشن)
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div class="space-y-5">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">ولتاژ باتری (اختلاف پتانسیل V):</span>
                            <span id="sim-ohm-v-val" class="text-blue-400 font-bold">12 V</span>
                        </div>
                        <input type="range" min="1.5" max="24" step="0.5" value="12" id="sim-ohm-v-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">مقاومت الکتریکی لامپ (R):</span>
                            <span id="sim-ohm-r-val" class="text-indigo-400 font-bold">6 Ω</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value="6" id="sim-ohm-r-slider" class="physics-slider w-full" />
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
                            <span class="text-[11px] text-slate-400 block mb-0.5">شدت جریان (I = V/R)</span>
                            <span id="sim-ohm-i-val" class="text-xl font-black text-cyan-400">2.00 A</span>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
                            <span class="text-[11px] text-slate-400 block mb-0.5">توان مصرفی (P = V×I)</span>
                            <span id="sim-ohm-p-val" class="text-xl font-black text-amber-400">24.0 W</span>
                        </div>
                    </div>
                </div>

                <!-- Schematic SVG -->
                <div class="p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center">
                    <svg viewBox="0 0 280 200" class="w-full max-w-[260px] h-auto">
                        <!-- Wires -->
                        <rect x="40" y="30" width="200" height="140" fill="none" stroke="#60a5fa" stroke-width="4" rx="16" class="circuit-wire" />
                        
                        <!-- Battery -->
                        <g transform="translate(30, 80)">
                            <rect x="0" y="0" width="20" height="40" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="4" />
                            <line x1="10" y1="8" x2="10" y2="20" stroke="#f87171" stroke-width="2" />
                            <line x1="4" y1="14" x2="16" y2="14" stroke="#f87171" stroke-width="2" />
                            <line x1="4" y1="30" x2="16" y2="30" stroke="#60a5fa" stroke-width="2" />
                            <text x="-8" y="24" fill="#93c5fd" font-size="10" font-weight="bold">باتری</text>
                        </g>

                        <!-- Bulb -->
                        <g transform="translate(130, 20)">
                            <circle id="sim-ohm-bulb" cx="10" cy="10" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
                            <text x="3" y="14" fill="#0f172a" font-size="10" font-weight="bold">R</text>
                        </g>

                        <!-- Ammeter -->
                        <g transform="translate(230, 80)">
                            <circle cx="10" cy="20" r="14" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
                            <text x="6" y="24" fill="#22d3ee" font-size="11" font-weight="bold">A</text>
                            <text x="28" y="24" fill="#94a3b8" font-size="9">آمپرمتر</text>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        `;

        const vSlider = document.getElementById('sim-ohm-v-slider');
        const rSlider = document.getElementById('sim-ohm-r-slider');
        const swBtn = document.getElementById('sim-ohm-switch-btn');

        if (vSlider) vSlider.addEventListener('input', (e) => { voltage = parseFloat(e.target.value); update(); });
        if (rSlider) rSlider.addEventListener('input', (e) => { resistance = parseFloat(e.target.value); update(); });

        if (swBtn) swBtn.addEventListener('click', () => {
            isSwitchOn = !isSwitchOn;
            swBtn.innerText = isSwitchOn ? 'کلید: وصل (روشن)' : 'کلید: قطع (خاموش)';
            swBtn.className = isSwitchOn 
                ? 'px-4 py-1 rounded-full text-xs font-bold transition-all bg-emerald-600 text-white border border-emerald-400'
                : 'px-4 py-1 rounded-full text-xs font-bold transition-all bg-rose-600 text-white border border-rose-400';
            update();
        });

        update();
    }

    // =========================================================================
    // 3. NEWTON'S 2ND LAW & FORCE SIMULATOR (شبیه‌ساز قانون دوم نیوتون و اصطکاک)
    // =========================================================================
    renderNewtonSim(container) {
        let force = 60; // Newtons
        let mass = 10; // kg
        let frictionCoeff = 0.2; // mu

        const update = () => {
            const friction = Math.round(frictionCoeff * mass * 9.8); // F_k = mu * m * g
            const fNet = Math.max(0, force - friction);
            const accel = fNet / mass;

            const fVal = document.getElementById('sim-newt-f-val');
            const mVal = document.getElementById('sim-newt-m-val');
            const fNetVal = document.getElementById('sim-newt-fnet-val');
            const aVal = document.getElementById('sim-newt-a-val');
            const fArrow = document.getElementById('sim-newt-f-arrow');

            if (fVal) fVal.innerText = `${force} N`;
            if (mVal) mVal.innerText = `${mass} kg`;
            if (fNetVal) fNetVal.innerText = `${fNet} N (نیروی اصطکاک: ${friction} N)`;
            if (aVal) aVal.innerText = `${accel.toFixed(2)} m/s²`;

            if (fArrow) {
                fArrow.style.width = `${Math.min(180, 20 + force * 1.5)}px`;
            }
        };

        container.innerHTML = `
        <div class="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <h4 class="font-extrabold text-base text-emerald-300">شبیه‌ساز قانون دوم نیوتون (F_net = m × a)</h4>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    g = ۹٫۸ m/s²
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div class="space-y-5">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">نیروی پیشران اعمالی (F):</span>
                            <span id="sim-newt-f-val" class="text-emerald-400 font-bold">60 N</span>
                        </div>
                        <input type="range" min="0" max="150" step="5" value="60" id="sim-newt-f-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">جرم جسم متحرک (m):</span>
                            <span id="sim-newt-m-val" class="text-blue-400 font-bold">10 kg</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value="10" id="sim-newt-m-slider" class="physics-slider w-full" />
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-400">نیروی خالص (F_net = F - f_k):</span>
                            <span id="sim-newt-fnet-val" class="font-extrabold text-amber-400">40 N</span>
                        </div>
                        <div class="flex justify-between text-xs pt-1 border-t border-slate-700/50">
                            <span class="text-slate-400">شتاب ایجاد شده (a = F/m):</span>
                            <span id="sim-newt-a-val" class="font-extrabold text-emerald-400 text-sm">4.00 m/s²</span>
                        </div>
                    </div>
                </div>

                <!-- Interactive Cart Simulation View -->
                <div class="relative h-48 w-full rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col justify-end p-6 overflow-hidden">
                    <!-- Surface line -->
                    <div class="w-full h-1 bg-slate-600 relative">
                        <!-- Wheels & Cart -->
                        <div class="absolute bottom-1 right-12 flex flex-col items-center">
                            <!-- Force Arrow -->
                            <div class="flex items-center gap-1 mb-1">
                                <div id="sim-newt-f-arrow" class="h-2 bg-emerald-500 rounded-full transition-all"></div>
                                <span class="text-[10px] text-emerald-400 font-bold">F</span>
                            </div>
                            <!-- Box Body -->
                            <div class="w-20 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400 flex items-center justify-center text-xs font-bold shadow-lg">
                                m = <span id="sim-newt-cart-m" class="mr-1">10</span> kg
                            </div>
                            <!-- Wheels -->
                            <div class="flex justify-between w-16 -mt-2">
                                <div class="w-4 h-4 rounded-full bg-slate-400 border border-slate-900"></div>
                                <div class="w-4 h-4 rounded-full bg-slate-400 border border-slate-900"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const fSlider = document.getElementById('sim-newt-f-slider');
        const mSlider = document.getElementById('sim-newt-m-slider');
        const cartM = document.getElementById('sim-newt-cart-m');

        if (fSlider) fSlider.addEventListener('input', (e) => { force = parseFloat(e.target.value); update(); });
        if (mSlider) mSlider.addEventListener('input', (e) => { 
            mass = parseFloat(e.target.value); 
            if (cartM) cartM.innerText = mass;
            update(); 
        });

        update();
    }

    // =========================================================================
    // 4. HYDROSTATIC PRESSURE SIMULATOR (شبیه‌ساز فشار شاره‌ها و عمق)
    // =========================================================================
    renderPressureSim(container) {
        let depth = 4; // meters
        let density = 1000; // kg/m3 (water)

        const update = () => {
            const g = 9.8;
            const pGauge = Math.round(density * g * depth); // Pa
            const pTotal = pGauge + 100000; // + P0 (100 kPa)

            const hVal = document.getElementById('sim-press-h-val');
            const pVal = document.getElementById('sim-press-p-val');
            const pTotVal = document.getElementById('sim-press-ptot-val');
            const probe = document.getElementById('sim-press-probe');

            if (hVal) hVal.innerText = `${depth} متر`;
            if (pVal) pVal.innerText = `${(pGauge / 1000).toFixed(1)} kPa (${pGauge} Pa)`;
            if (pTotVal) pTotVal.innerText = `${(pTotal / 1000).toFixed(1)} kPa`;

            if (probe) {
                probe.style.top = `${15 + (depth / 10) * 75}%`;
            }
        };

        container.innerHTML = `
        <div class="p-6 rounded-3xl bg-slate-900 border border-blue-500/30 text-white space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-blue-400 animate-ping"></span>
                    <h4 class="font-extrabold text-base text-blue-300">شبیه‌ساز فشار درون شاره‌ها (P = ρ × g × h)</h4>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    P_0 هوا = ۱۰۰ kPa
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div class="space-y-5">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">عمق از سطح مایع (h):</span>
                            <span id="sim-press-h-val" class="text-blue-400 font-bold">4 متر</span>
                        </div>
                        <input type="range" min="0" max="10" step="0.5" value="4" id="sim-press-h-slider" class="physics-slider w-full" />
                    </div>

                    <!-- Fluid Selection -->
                    <div class="space-y-1.5">
                        <span class="text-xs text-slate-400 block font-bold">نوع مایع:</span>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="fluid-water" class="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold">آب (۱۰۰۰ kg/m³)</button>
                            <button id="fluid-oil" class="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">روغن (۸۰۰ kg/m³)</button>
                            <button id="fluid-mercury" class="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">جیوه (۱۳۶۰۰ kg/m³)</button>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-400">فشار ناشی از مایع (P = ρgh):</span>
                            <span id="sim-press-p-val" class="font-extrabold text-cyan-400 text-sm">39.2 kPa</span>
                        </div>
                        <div class="flex justify-between text-xs pt-1 border-t border-slate-700/50">
                            <span class="text-slate-400">فشار کل (P_total = P_0 + ρgh):</span>
                            <span id="sim-press-ptot-val" class="font-extrabold text-amber-400 text-sm">139.2 kPa</span>
                        </div>
                    </div>
                </div>

                <!-- Tank Visual -->
                <div class="relative h-60 w-full max-w-[220px] mx-auto rounded-b-3xl border-4 border-t-0 border-slate-600 bg-gradient-to-b from-cyan-900/20 via-blue-900/40 to-blue-950 overflow-hidden">
                    <div class="absolute inset-0 bg-blue-500/20"></div>
                    <div id="sim-press-probe" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-200">
                        <div class="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-slate-900">
                            P
                        </div>
                        <span class="text-[10px] text-amber-300 font-bold bg-slate-900/80 px-1.5 py-0.5 rounded">حسگر فشار</span>
                    </div>
                </div>
            </div>
        </div>
        `;

        const hSlider = document.getElementById('sim-press-h-slider');
        if (hSlider) hSlider.addEventListener('input', (e) => { depth = parseFloat(e.target.value); update(); });

        document.getElementById('fluid-water')?.addEventListener('click', () => { density = 1000; update(); });
        document.getElementById('fluid-oil')?.addEventListener('click', () => { density = 800; update(); });
        document.getElementById('fluid-mercury')?.addEventListener('click', () => { density = 13600; update(); });

        update();
    }

    // =========================================================================
    // 5. OPTICS & REFRACTION SIMULATOR (شبیه‌ساز شکست نور و قانون اسنل)
    // =========================================================================
    renderOpticsSim(container) {
        let theta1 = 45; // degrees
        let n2 = 1.52; // glass

        const update = () => {
            const rad1 = (theta1 * Math.PI) / 180;
            const sinTheta2 = Math.sin(rad1) / n2;
            const theta2 = Math.asin(sinTheta2) * (180 / Math.PI);

            const t1Val = document.getElementById('sim-opt-t1-val');
            const t2Val = document.getElementById('sim-opt-t2-val');
            const ray1 = document.getElementById('sim-opt-ray1');
            const ray2 = document.getElementById('sim-opt-ray2');

            if (t1Val) t1Val.innerText = `${theta1}°`;
            if (t2Val) t2Val.innerText = `${theta2.toFixed(1)}°`;

            if (ray1 && ray2) {
                // Ray 1 coordinates
                const x1 = 140 - Math.tan(rad1) * 70;
                ray1.setAttribute('x1', x1);
                ray1.setAttribute('y1', 20);
                ray1.setAttribute('x2', 140);
                ray1.setAttribute('y2', 90);

                // Ray 2 coordinates
                const rad2 = (theta2 * Math.PI) / 180;
                const x2 = 140 + Math.tan(rad2) * 70;
                ray2.setAttribute('x1', 140);
                ray2.setAttribute('y1', 90);
                ray2.setAttribute('x2', x2);
                ray2.setAttribute('y2', 160);
            }
        };

        container.innerHTML = `
        <div class="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 text-white space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-purple-400 animate-ping"></span>
                    <h4 class="font-extrabold text-base text-purple-300">شبیه‌ساز شکست نور و قانون اسنل (n₁ sinθ₁ = n₂ sinθ₂)</h4>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                    محیط ۱: هوا (n₁ = ۱٫۰۰)
                </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div class="space-y-5">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">زاویه تابش نسبت به خط عمود (θ₁):</span>
                            <span id="sim-opt-t1-val" class="text-purple-400 font-bold">45°</span>
                        </div>
                        <input type="range" min="0" max="75" step="1" value="45" id="sim-opt-t1-slider" class="physics-slider w-full" />
                    </div>

                    <div class="space-y-1.5">
                        <span class="text-xs text-slate-400 block font-bold">محیط شفاف دوم (n₂):</span>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="opt-glass" class="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold">شیشه (۱٫۵۲)</button>
                            <button id="opt-water" class="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">آب (۱٫۳۳)</button>
                            <button id="opt-diamond" class="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">الماس (۲٫۴۲)</button>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-400">زاویه شکست محاسبه‌شده (θ₂):</span>
                            <span id="sim-opt-t2-val" class="font-extrabold text-cyan-400 text-sm">27.7°</span>
                        </div>
                        <p class="text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                            پرتو نور هنگام ورود از محیط رقیق (هوا) به غلیظ به خط عمود نزدیک می‌شود.
                        </p>
                    </div>
                </div>

                <!-- Optics Ray Schematic -->
                <div class="p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center">
                    <svg viewBox="0 0 280 180" class="w-full max-w-[260px] h-auto">
                        <!-- Upper medium: Air -->
                        <rect x="20" y="20" width="240" height="70" fill="rgba(30, 41, 59, 0.4)" />
                        <text x="30" y="40" fill="#94a3b8" font-size="10">هوا (n₁ = ۱)</text>

                        <!-- Lower medium: Glass/Water -->
                        <rect x="20" y="90" width="240" height="70" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" stroke-width="1" />
                        <text x="30" y="110" fill="#a5b4fc" font-size="10">محیط دوم</text>

                        <!-- Normal Line (Dashed) -->
                        <line x1="140" y1="20" x2="140" y2="160" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.5" />
                        <text x="145" y="32" fill="#64748b" font-size="9">خط عمود</text>

                        <!-- Incident Ray (Yellow) -->
                        <line id="sim-opt-ray1" x1="80" y1="20" x2="140" y2="90" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" />

                        <!-- Refracted Ray (Cyan) -->
                        <line id="sim-opt-ray2" x1="140" y1="90" x2="180" y2="160" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
        </div>
        `;

        const tSlider = document.getElementById('sim-opt-t1-slider');
        if (tSlider) tSlider.addEventListener('input', (e) => { theta1 = parseFloat(e.target.value); update(); });

        document.getElementById('opt-glass')?.addEventListener('click', () => { n2 = 1.52; update(); });
        document.getElementById('opt-water')?.addEventListener('click', () => { n2 = 1.33; update(); });
        document.getElementById('opt-diamond')?.addEventListener('click', () => { n2 = 2.42; update(); });

        update();
    }
}

window.physicsSimulators = new PhysicsSimulators();
