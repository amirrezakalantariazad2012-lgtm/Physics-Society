<?php
/**
 * QUANTUM CUT — Teacher Misconception Heatmap Diagnostic Deck (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Teacher Misconception Heatmap Diagnostic Deck
 */
const TeacherHeatmap = (function() {
    let heatmapData = null;

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8 pb-16">
            <!-- Header HUD -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 p-8 shadow-2xl">
                <div class="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                            <span>🧠</span> ابزار تشخیصی کج‌فهمی‌های رایج فیزیک
                        </div>
                        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span>📊</span> ماتریس حرارتی کج‌فهمی‌های دانش‌آموزان
                        </h1>
                        <p class="text-slate-400 text-sm max-w-xl">
                            شناسایی ریشه‌ای اشتباهات پرتکرار مفهومی دانش‌آموزان سمپاد در مباحث نیرو، شتاب، فشار، پایستگی انرژی و الکتریسیته همراه با صدور تکالیف ترمیمی هوشمند.
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <button onclick="PrintableExamView.openModal()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                            <span>🖨️</span> صدور برگه آزمون چاپی سمپاد
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Bar -->
            <div id="heatmap-stats-bar" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
                    <div class="text-xs text-slate-400">کل کج‌فهمی‌های ثبت شده</div>
                    <div id="stat-total-diag" class="text-3xl font-black text-white mt-1 font-mono">--</div>
                </div>
                <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
                    <div class="text-xs text-slate-400">تکرار خطاهای مفهومی</div>
                    <div id="stat-total-errors" class="text-3xl font-black text-rose-400 mt-1 font-mono">--</div>
                </div>
                <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
                    <div class="text-xs text-slate-400">مباحث بحرانی (نیازمند بازآموزی)</div>
                    <div id="stat-high-risk" class="text-3xl font-black text-amber-400 mt-1 font-mono">--</div>
                </div>
            </div>

            <!-- Heatmap Matrix Table -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <span>🔥</span> نقشه پراکندگی خطاهای شناختی بر اساس سرفصل‌های کتاب
                    </h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-sm">
                        <thead class="text-xs text-slate-400 border-b border-slate-800">
                            <tr>
                                <th class="py-3 px-4">مبحث درسی</th>
                                <th class="py-3 px-4">کج‌فهمی و باور نادرست شایع</th>
                                <th class="py-3 px-4 text-center">تعداد تکرار خطا</th>
                                <th class="py-3 px-4 text-center">سطح بحران</th>
                                <th class="py-3 px-4 text-center">اقدام ترمیمی</th>
                            </tr>
                        </thead>
                        <tbody id="heatmap-tbody" class="divide-y divide-slate-800/60">
                            <tr>
                                <td colspan="5" class="py-12 text-center text-slate-500">
                                    <div class="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    در حال بارگذاری ماتریس حرارتی...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;

        await loadHeatmap();
    }

    async function loadHeatmap() {
        try {
            const res = await fetch('/api/teacher/misconception-heatmap');
            const data = await res.json();
            heatmapData = data;

            document.getElementById('stat-total-diag').textContent = data.total_diagnosed_misconceptions || '۰';
            document.getElementById('stat-total-errors').textContent = data.total_error_instances || '۰';
            document.getElementById('stat-high-risk').textContent = data.high_risk_concepts || '۰';

            renderTable(data.matrix || []);
        } catch (e) {
            console.error(e);
            const tbody = document.getElementById('heatmap-tbody');
            if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-400 py-6">خطا در بارگذاری داده‌ها</td></tr>`;
        }
    }

    function renderTable(list) {
        const tbody = document.getElementById('heatmap-tbody');
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-slate-500 py-6">هیچ کج‌فهمی ثبت نشده است.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(item => {
            const isCritical = item.severity === 'critical';
            const isModerate = item.severity === 'moderate';

            const badgeBg = isCritical ? 'bg-red-500/10 text-red-400 border-red-500/20' : (isModerate ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20');

            return `
            <tr class="hover:bg-slate-800/30 transition-all">
                <td class="py-3 px-4 font-bold text-white">${item.topic}</td>
                <td class="py-3 px-4 text-xs text-slate-300 leading-relaxed max-w-md">${item.misconception}</td>
                <td class="py-3 px-4 text-center font-mono font-bold text-rose-400">${item.error_count} بار</td>
                <td class="py-3 px-4 text-center">
                    <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg}">
                        ${item.severity_label}
                    </span>
                </td>
                <td class="py-3 px-4 text-center">
                    ${item.remedy_assigned ? `
                        <span class="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                            ✓ تکلیف صادر شد
                        </span>
                    ` : `
                        <button onclick="TeacherHeatmap.assignRemedy(${item.id})" class="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold border border-indigo-500/40 transition-all">
                            تولید تکلیف ترمیمی 🎯
                        </button>
                    `}
                </td>
            </tr>
            `;
        }).join('');
    }

    async function assignRemedy(id) {
        try {
            const res = await fetch('/api/teacher/misconception-remedy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ misconception_id: id })
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message);
                await loadHeatmap();
            } else {
                alert(data.detail || 'خطا در تخصیص تکلیف ترمیمی');
            }
        } catch (e) {
            console.error(e);
            alert('خطای اتصال به سرور');
        }
    }

    return {
        render,
        assignRemedy
    };
})();

window.TeacherHeatmap = TeacherHeatmap;
