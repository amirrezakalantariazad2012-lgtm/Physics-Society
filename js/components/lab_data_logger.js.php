<?php
/**
 * QUANTUM CUT — Lab Data Logger & Linear Regression Component (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Lab Data Logger & Least Squares Linear Regression Grapher
 */
const LabDataLogger = (function() {
    let experimentPreset = 'hooke';
    let dataPoints = [
        { x: 0.02, y: 0.5 },
        { x: 0.04, y: 1.0 },
        { x: 0.06, y: 1.55 },
        { x: 0.08, y: 2.02 },
        { x: 0.10, y: 2.5 }
    ];

    const PRESETS = {
        'hooke': {
            title: 'قانون هوک (سنجش ثابت فنر)',
            xLabel: 'تغییر طول فنر x (متر)',
            yLabel: 'نیروی وارد بر فنر F (نیوتون)',
            constName: 'ثابت فنر (k)',
            constUnit: 'N/m',
            formula: 'F = k \\cdot x',
            points: [
                { x: 0.02, y: 0.5 },
                { x: 0.04, y: 1.0 },
                { x: 0.06, y: 1.55 },
                { x: 0.08, y: 2.02 },
                { x: 0.10, y: 2.5 }
            ]
        },
        'ohm': {
            title: 'قانون اهم (اندازه‌گیری مقاومت الکتریکی)',
            xLabel: 'شدت جریان I (آمپر)',
            yLabel: 'اختلاف پتانسیل V (ولت)',
            constName: 'مقاومت الکتریکی (R)',
            constUnit: 'Ω',
            formula: 'V = R \\cdot I',
            points: [
                { x: 0.1, y: 2.2 },
                { x: 0.2, y: 4.3 },
                { x: 0.3, y: 6.6 },
                { x: 0.4, y: 8.8 },
                { x: 0.5, y: 11.0 }
            ]
        },
        'density': {
            title: 'محاسبه چگالی بر پایه جرم و حجم',
            xLabel: 'حجم جسم V (سانتی‌متر مکعب)',
            yLabel: 'جرم جسم m (گرم)',
            constName: 'چگالی (ρ)',
            constUnit: 'g/cm³',
            formula: 'm = \\rho \\cdot V',
            points: [
                { x: 10, y: 27 },
                { x: 20, y: 53.5 },
                { x: 30, y: 81 },
                { x: 40, y: 107.8 },
                { x: 50, y: 135 }
            ]
        },
        'gravity': {
            title: 'سقوط آزاد و شتاب گرانش (v بر حسب t)',
            xLabel: 'زمان حرکت t (ثانیه)',
            yLabel: 'تندی متحرک v (متر بر ثانیه)',
            constName: 'شتاب گرانش (g)',
            constUnit: 'm/s²',
            formula: 'v = g \\cdot t',
            points: [
                { x: 0.2, y: 1.95 },
                { x: 0.4, y: 3.92 },
                { x: 0.6, y: 5.89 },
                { x: 0.8, y: 7.85 },
                { x: 1.0, y: 9.81 }
            ]
        }
    };

    function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8 pb-16">
            <!-- Header HUD -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/30 p-8 shadow-2xl">
                <div class="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                            <span>📊</span> جعبه‌ابزار تحلیل داده‌های تجربی فیزیک
                        </div>
                        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span>📈</span> ثبت داده‌ها و برازش خطی <bdi class="sci-term text-cyan-300 font-mono">(Linear Regression)</bdi>
                        </h1>
                        <p class="text-slate-400 text-sm max-w-xl">
                            نقاط تجربی آزمایشگاه را وارد کنید، شیب خط، عرض از مبدأ و ضریب تعیین <bdi class="sci-term text-cyan-300 font-mono">(R&sup2;)</bdi> را به‌صورت خودکار استخراج کرده و خطای آزمایش را اعتبارسنجی کنید.
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <button onclick="LabDataLogger.exportCSV()" class="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm transition-all flex items-center gap-2">
                            <span>📥</span> خروجی اکسل (CSV)
                        </button>
                    </div>
                </div>
            </div>

            <!-- Experiment Selectors -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                ${Object.keys(PRESETS).map(key => `
                    <button onclick="LabDataLogger.loadPreset('${key}')" class="p-4 rounded-2xl border text-right transition-all ${experimentPreset === key ? 'bg-teal-600/20 border-teal-500 text-teal-300 font-bold shadow-lg shadow-teal-500/10' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}">
                        <div class="text-xs text-slate-500">آزمایش پیشنهادی</div>
                        <div class="text-sm font-semibold mt-1">${PRESETS[key].title}</div>
                    </button>
                `).join('')}
            </div>

            <!-- Main Work Area: Table (Left) + Plot (Right) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Data Points Table (5 cols) -->
                <div class="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <span>📋</span> جدول داده‌های آزمایشگاهی
                        </h3>
                        <button onclick="LabDataLogger.addRow()" class="px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 text-xs font-bold border border-teal-500/40 transition-all">
                            + افزودن نقطه
                        </button>
                    </div>

                    <div class="overflow-x-auto max-h-72 overflow-y-auto">
                        <table class="w-full text-right text-xs">
                            <thead class="text-slate-400 border-b border-slate-800 sticky top-0 bg-slate-900">
                                <tr>
                                    <th class="py-2 px-2 text-center">#</th>
                                    <th class="py-2 px-2 text-center" id="th-x-label">محور X</th>
                                    <th class="py-2 px-2 text-center" id="th-y-label">محور Y</th>
                                    <th class="py-2 px-2 text-center">حذف</th>
                                </tr>
                            </thead>
                            <tbody id="data-points-tbody" class="divide-y divide-slate-800">
                                <!-- Dynamic Rows -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Calculated Physics Parameter Box -->
                    <div id="regression-summary-box" class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <!-- Dynamic Summary -->
                    </div>
                </div>

                <!-- Regression Canvas Plot (7 cols) -->
                <div class="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h3 class="text-base font-bold text-white flex items-center gap-2">
                            <span>📈</span> نمودار برازش کمترین مربعات خطی
                        </h3>
                        <span id="equation-badge" class="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 font-mono text-xs font-bold">
                            y = mx + c
                        </span>
                    </div>

                    <div class="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                        <canvas id="regression-canvas" class="w-full h-full block"></canvas>
                    </div>
                </div>
            </div>
        </div>
        `;

        updateView();
    }

    function loadPreset(key) {
        if (!PRESETS[key]) return;
        experimentPreset = key;
        dataPoints = JSON.parse(JSON.stringify(PRESETS[key].points));
        render('app-root');
    }

    function updateView() {
        renderTable();
        const reg = calculateRegression();
        renderSummary(reg);
        drawPlot(reg);
    }

    function renderTable() {
        const p = PRESETS[experimentPreset];
        const thX = document.getElementById('th-x-label');
        const thY = document.getElementById('th-y-label');
        const tbody = document.getElementById('data-points-tbody');

        if (thX) thX.textContent = p.xLabel;
        if (thY) thY.textContent = p.yLabel;
        if (!tbody) return;

        tbody.innerHTML = dataPoints.map((pt, idx) => `
            <tr>
                <td class="py-2 px-2 text-center font-mono text-slate-500">${idx + 1}</td>
                <td class="py-2 px-2">
                    <input type="number" step="any" value="${pt.x}" onchange="LabDataLogger.updatePoint(${idx}, 'x', this.value)" class="w-full text-center bg-slate-950 border border-slate-800 rounded-lg p-1.5 font-mono text-xs text-white focus:border-teal-500">
                </td>
                <td class="py-2 px-2">
                    <input type="number" step="any" value="${pt.y}" onchange="LabDataLogger.updatePoint(${idx}, 'y', this.value)" class="w-full text-center bg-slate-950 border border-slate-800 rounded-lg p-1.5 font-mono text-xs text-white focus:border-teal-500">
                </td>
                <td class="py-2 px-2 text-center">
                    <button onclick="LabDataLogger.removeRow(${idx})" class="text-red-400 hover:text-red-300 font-bold px-2 py-1">×</button>
                </td>
            </tr>
        `).join('');
    }

    function updatePoint(idx, axis, val) {
        dataPoints[idx][axis] = parseFloat(val) || 0;
        const reg = calculateRegression();
        renderSummary(reg);
        drawPlot(reg);
    }

    function addRow() {
        const last = dataPoints[dataPoints.length - 1] || { x: 0, y: 0 };
        dataPoints.push({ x: Number((last.x + 0.1).toFixed(2)), y: Number((last.y + 1.0).toFixed(2)) });
        updateView();
    }

    function removeRow(idx) {
        if (dataPoints.length <= 2) {
            alert('حداقل دو نقطه برای برازش خطی لازم است.');
            return;
        }
        dataPoints.splice(idx, 1);
        updateView();
    }

    function calculateRegression() {
        const n = dataPoints.length;
        if (n < 2) return { m: 0, c: 0, r2: 0 };

        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
        for (const pt of dataPoints) {
            sumX += pt.x;
            sumY += pt.y;
            sumXY += (pt.x * pt.y);
            sumXX += (pt.x * pt.x);
            sumYY += (pt.y * pt.y);
        }

        const denom = (n * sumXX - sumX * sumX);
        if (Math.abs(denom) < 1e-10) return { m: 0, c: 0, r2: 0 };

        const m = (n * sumXY - sumX * sumY) / denom;
        const c = (sumY - m * sumX) / n;

        // R^2
        const numR = (n * sumXY - sumX * sumY);
        const denR = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        const r = denR > 0 ? (numR / denR) : 0;
        const r2 = r * r;

        return { m, c, r2 };
    }

    function renderSummary(reg) {
        const box = document.getElementById('regression-summary-box');
        const eqBadge = document.getElementById('equation-badge');
        const p = PRESETS[experimentPreset];

        if (eqBadge) {
            eqBadge.textContent = `y = ${reg.m.toFixed(3)}x ${reg.c >= 0 ? '+' : '-'} ${Math.abs(reg.c).toFixed(3)} | R² = ${reg.r2.toFixed(4)}`;
        }

        if (!box) return;

        box.innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
                <span class="text-slate-400">شیب خط <bdi class="sci-term">(m)</bdi>:</span>
                <span class="font-bold text-white font-mono mr-1 sci-term">${reg.m.toFixed(3)}</span>
            </div>
            <div>
                <span class="text-slate-400">عرض از مبدأ <bdi class="sci-term">(c)</bdi>:</span>
                <span class="font-bold text-white font-mono mr-1 sci-term">${reg.c.toFixed(3)}</span>
            </div>
            <div>
                <span class="text-slate-400">ضریب تعیین <bdi class="sci-term">(R&sup2;)</bdi>:</span>
                <span class="font-bold text-emerald-400 font-mono mr-1 sci-term">${reg.r2.toFixed(4)}</span>
            </div>
            <div>
                <span class="text-slate-400">اعتبار تجربی:</span>
                <span class="font-bold ${reg.r2 > 0.98 ? 'text-teal-400' : 'text-amber-400'} mr-1">${reg.r2 > 0.98 ? 'عالی ✓' : 'قابل قبول'}</span>
            </div>
        </div>

        <div class="pt-2 border-t border-slate-800 text-center">
            <div class="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <span>کمیت فیزیکی استخراج شده</span>
                <bdi class="sci-term text-cyan-400 font-mono">(${p.constName})</bdi>
            </div>
            <div class="text-xl font-black text-cyan-400 font-mono mt-0.5 lcd-display">
                <span class="sci-term">${reg.m.toFixed(2)} ${p.constUnit}</span>
            </div>
        </div>
        `;
    }

    function drawPlot(reg) {
        const canvas = document.getElementById('regression-canvas');
        if (!canvas) return;

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#070b14';
        ctx.fillRect(0, 0, w, h);

        const margin = 40;
        const plotW = w - margin * 2;
        const plotH = h - margin * 2;

        const xs = dataPoints.map(p => p.x);
        const ys = dataPoints.map(p => p.y);
        const minX = Math.min(0, ...xs);
        const maxX = Math.max(...xs) * 1.15 || 1;
        const minY = Math.min(0, ...ys);
        const maxY = Math.max(...ys) * 1.15 || 1;

        function toPx(x, y) {
            const px = margin + ((x - minX) / (maxX - minX)) * plotW;
            const py = (h - margin) - ((y - minY) / (maxY - minY)) * plotH;
            return { px, py };
        }

        // Draw Axes & Grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const gx = margin + (i / 5) * plotW;
            ctx.beginPath();
            ctx.moveTo(gx, margin);
            ctx.lineTo(gx, h - margin);
            ctx.stroke();

            const gy = margin + (i / 5) * plotH;
            ctx.beginPath();
            ctx.moveTo(margin, gy);
            ctx.lineTo(w - margin, gy);
            ctx.stroke();
        }

        // Axes lines
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, h - margin);
        ctx.lineTo(w - margin, h - margin);
        ctx.stroke();

        // Best fit trendline
        const p1 = toPx(minX, reg.m * minX + reg.c);
        const p2 = toPx(maxX, reg.m * maxX + reg.c);

        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#2dd4bf';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Experimental points
        for (const pt of dataPoints) {
            const { px, py } = toPx(pt.x, pt.y);
            ctx.fillStyle = '#f59e0b';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    function exportCSV() {
        const p = PRESETS[experimentPreset];
        let csv = `x (${p.xLabel}),y (${p.yLabel})\n`;
        for (const pt of dataPoints) {
            csv += `${pt.x},${pt.y}\n`;
        }
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `physics_lab_${experimentPreset}.csv`;
        link.click();
    }

    return {
        render,
        loadPreset,
        updatePoint,
        addRow,
        removeRow,
        exportCSV
    };
})();

window.LabDataLogger = LabDataLogger;
