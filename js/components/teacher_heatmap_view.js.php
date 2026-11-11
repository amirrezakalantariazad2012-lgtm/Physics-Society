<?php
/**
 * QUANTUM CUT — Teacher Misconception Heatmap Diagnostic Deck (Pure PHP Edition)
 * Observatory Teacher Diagnostic & Cognitive Error Heatmap
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
        <div class="qc-adapt qc-shell qc-section space-y-6">
            <!-- Header HUD -->
            <div class="qc-telemetry-hud p-6 sm:p-8">
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--danger-soft)] border border-[var(--danger)] text-[var(--danger)] text-xs font-bold">
                            <span>🧠</span> ابزار تشخیصی کج‌فهمی‌های رایج فیزیک
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span class="p-2.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--danger)] shadow-sm">
                                <i data-lucide="flame" class="w-6 h-6"></i>
                            </span>
                            <span>ماتریس حرارتی کج‌فهمی‌های دانش‌آموزان</span>
                        </h1>
                        <p class="text-[var(--muted)] text-xs sm:text-sm max-w-xl leading-relaxed">
                            شناسایی ریشه‌ای اشتباهات پرتکرار مفهومی دانش‌آموزان در مباحث نیرو، شتاب، فشار، پایستگی انرژی و الکتریسیته همراه با صدور تکالیف ترمیمی هوشمند.
                        </p>
                    </div>

                    <div class="flex items-center gap-2.5 shrink-0">
                        <button type="button" onclick="PrintableExamView.openModal()" class="qc-btn qc-btn--sm">
                            <i data-lucide="printer" class="w-4 h-4"></i>
                            <span>صدور برگه آزمون چاپی A4</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Bar -->
            <div id="heatmap-stats-bar" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="qc-stat">
                    <div class="text-xs text-[var(--muted)]">کل کج‌فهمی‌های شناسایی‌شده</div>
                    <div id="stat-total-diag" class="text-2xl sm:text-3xl font-black text-[var(--ink)] mt-1.5 font-mono">--</div>
                    <div class="qc-stat__label">ماتریس مفهومی کتب درسی</div>
                </div>
                <div class="qc-stat">
                    <div class="text-xs text-[var(--muted)]">تکرار خطاهای مفهومی ثبت‌شده</div>
                    <div id="stat-total-errors" class="text-2xl sm:text-3xl font-black text-[var(--danger)] mt-1.5 font-mono">--</div>
                    <div class="qc-stat__label">در آزمون‌ها و تمرینات هفتگی</div>
                </div>
                <div class="qc-stat">
                    <div class="text-xs text-[var(--muted)]">مباحث بحرانی (نیازمند بازآموزی)</div>
                    <div id="stat-high-risk" class="text-2xl sm:text-3xl font-black text-[var(--warn)] mt-1.5 font-mono">--</div>
                    <div class="qc-stat__label">اولویت تدریس جبرانی دبیر</div>
                </div>
            </div>

            <!-- Heatmap Matrix Table -->
            <div class="qc-card qc-card--p space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                    <h3 class="text-base font-black text-[var(--ink)] flex items-center gap-2">
                        <i data-lucide="grid" class="w-5 h-5 text-[var(--accent)]"></i>
                        <span>نقشه پراکندگی خطاهای شناختی بر اساس سرفصل‌های کتاب</span>
                    </h3>
                </div>

                <div class="qc-table-wrap">
                    <table class="qc-table">
                        <thead>
                            <tr>
                                <th>مبحث درسی</th>
                                <th>کج‌فهمی و باور نادرست شایع</th>
                                <th class="text-center">تعداد تکرار خطا</th>
                                <th class="text-center">سطح بحران</th>
                                <th class="text-center">اقدام ترمیمی</th>
                            </tr>
                        </thead>
                        <tbody id="heatmap-tbody">
                            <tr>
                                <td colspan="5" class="py-12 text-center text-[var(--muted)]">
                                    <div class="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    در حال بارگذاری ماتریس حرارتی...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
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
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error(e);
            const tbody = document.getElementById('heatmap-tbody');
            if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="text-center text-[var(--danger)] py-6">خطا در بارگذاری داده‌ها</td></tr>`;
        }
    }

    function renderTable(list) {
        const tbody = document.getElementById('heatmap-tbody');
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-[var(--muted)] py-6">هیچ کج‌فهمی ثبت نشده است.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(item => {
            const isCritical = item.severity === 'critical';
            const isModerate = item.severity === 'moderate';

            const chipClass = isCritical ? 'qc-chip--danger' : (isModerate ? 'qc-chip--warn' : 'qc-chip--ok');

            return `
            <tr>
                <td class="font-bold text-[var(--ink)]">${item.topic}</td>
                <td class="text-xs text-[var(--muted)] leading-relaxed max-w-md">${item.misconception}</td>
                <td class="text-center font-mono font-bold text-[var(--danger)]">${item.error_count} بار</td>
                <td class="text-center">
                    <span class="qc-chip ${chipClass}">
                        ${item.severity_label}
                    </span>
                </td>
                <td class="text-center">
                    ${item.remedy_assigned ? `
                        <span class="text-xs text-[var(--ok)] font-bold flex items-center justify-center gap-1">
                            ✓ تکلیف صادر شد
                        </span>
                    ` : `
                        <button type="button" onclick="TeacherHeatmap.assignRemedy(${item.id})" class="qc-btn qc-btn--ghost qc-btn--sm">
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
