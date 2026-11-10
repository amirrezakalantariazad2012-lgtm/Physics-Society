<?php
/**
 * QUANTUM CUT — Printable SAMPAD Standard Exam View (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Printable Standard Exam Generator with Official SAMPAD Header
 */
const PrintableExamView = (function() {
    let examData = null;

    function openModal() {
        let modal = document.getElementById('printable-exam-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'printable-exam-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-8 text-right max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xl text-blue-400">
                        🖨️
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">سامانه صدور برگه آزمون استاندارد سمپاد</h3>
                        <div class="text-xs text-slate-400">قالب رسمی امتحانات هماهنگ با سربرگ مصوب و کلید تصحیح</div>
                    </div>
                </div>

                <button onclick="PrintableExamView.closeModal()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg">
                    ×
                </button>
            </div>

            <!-- Controls Form -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="text-xs text-slate-300 font-bold">عنوان آزمون:</label>
                    <input id="pe-title" type="text" value="آزمون هماهنگ فیزیک سمپاد — نوبت اول" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white mt-1">
                </div>
                <div>
                    <label class="text-xs text-slate-300 font-bold">پایه تحصیلی:</label>
                    <select id="pe-grade" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white mt-1">
                        <option value="پایه هفتم دوره اول متوسطه استعدادهای درخشان">پایه هفتم سمپاد</option>
                        <option value="پایه هشتم دوره اول متوسطه استعدادهای درخشان">پایه هشتم سمپاد</option>
                        <option value="پایه نهم دوره اول متوسطه استعدادهای درخشان" selected>پایه نهم سمپاد</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-slate-300 font-bold">تعداد مسائل:</label>
                    <select id="pe-count" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white mt-1">
                        <option value="4">۴ مسئله تحلیلی</option>
                        <option value="6" selected>۶ مسئله استاندارد</option>
                        <option value="8">۸ مسئله جامع</option>
                    </select>
                </div>
            </div>

            <div class="flex items-center justify-between pt-2">
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" id="pe-key" checked class="rounded border-slate-700 accent-blue-500">
                    <span>پیوست کلید تصحیح و پاسخنامه تشریحی در انتهای برگه</span>
                </label>

                <button onclick="PrintableExamView.generateExam()" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
                    <span>⚡</span> تولید و بارگذاری پیش‌نمایش
                </button>
            </div>

            <!-- Preview Box -->
            <div id="pe-preview-area" class="border border-slate-800 rounded-2xl p-4 bg-slate-950/60 min-h-[200px]">
                <div class="text-center py-12 text-slate-500 text-xs">
                    روی دکمه «تولید و بارگذاری پیش‌نمایش» کلیک کنید تا برگه آزمون با سربرگ رسمی سمپاد شکل گیرد.
                </div>
            </div>
        </div>
        `;
    }

    function closeModal() {
        const modal = document.getElementById('printable-exam-modal');
        if (modal) modal.remove();
    }

    async function generateExam() {
        const preview = document.getElementById('pe-preview-area');
        if (!preview) return;

        const title = document.getElementById('pe-title')?.value || 'آزمون هماهنگ فیزیک سمپاد';
        const grade = document.getElementById('pe-grade')?.value || 'پایه نهم سمپاد';
        const count = parseInt(document.getElementById('pe-count')?.value || '6', 10);
        const includeKey = document.getElementById('pe-key')?.checked || false;

        preview.innerHTML = `
        <div class="text-center py-12">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div class="text-xs text-slate-400">در حال تولید و فرمت‌بندی برگه آزمون...</div>
        </div>
        `;

        try {
            const res = await fetch('/api/teacher/printable-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    grade_title: grade,
                    questions_count: count,
                    duration_minutes: 75,
                    include_answer_key: includeKey
                })
            });

            examData = await res.json();
            renderPrintableSheet(preview, examData);
        } catch (e) {
            console.error(e);
            preview.innerHTML = `<div class="text-center text-red-400 text-xs py-8">خطا در تولید برگه آزمون</div>`;
        }
    }

    function renderPrintableSheet(container, data) {
        const meta = data.exam_meta || {};
        const questions = data.questions || [];
        const includeKey = data.include_answer_key;

        container.innerHTML = `
        <div class="space-y-4">
            <!-- Action Bar -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <span class="text-xs text-emerald-400 font-bold">✓ برگه آزمون استاندارد آماده چاپ است</span>
                <button onclick="PrintableExamView.printDocument()" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2">
                    <span>🖨️</span> چاپ برگه (یا خروجی PDF)
                </button>
            </div>

            <!-- Print Sheet Simulation (A4 Look) -->
            <div id="printable-a4-sheet" class="bg-white text-slate-900 p-8 rounded-xl font-sans text-right shadow-2xl space-y-6">
                <!-- SAMPAD Official Header -->
                <div class="border-2 border-slate-900 p-4 rounded-lg space-y-3">
                    <div class="flex items-center justify-between text-xs font-bold border-b border-slate-300 pb-2">
                        <div class="text-right">
                            <div>جمهوری اسلامی ایران</div>
                            <div>وزارت آموزش و پرورش</div>
                            <div>سازمان ملی پرورش استعدادهای درخشان</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm font-extrabold">${meta.school_name || 'دبیرستان استعدادهای درخشان شهید بهشتی ۲'}</div>
                            <div class="text-base font-black text-blue-900 mt-1">${meta.title}</div>
                        </div>
                        <div class="text-left font-mono">
                            <div>سال تحصیلی: ${meta.academic_year}</div>
                            <div>نوبت: ${meta.exam_date}</div>
                            <div>مدت: ${meta.duration_minutes} دقیقه</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-2 text-xs pt-1">
                        <div><b>نام و نام‌خانوادگی:</b> ..........................</div>
                        <div><b>شماره داوطلبی:</b> ..........................</div>
                        <div><b>پایه:</b> ${meta.grade_title}</div>
                        <div><b>بارم کل:</b> ۲۰ نمره</div>
                    </div>
                </div>

                <!-- Questions List -->
                <div class="space-y-6 text-sm">
                    ${questions.map(q => `
                        <div class="border-b border-slate-200 pb-4 space-y-2">
                            <div class="flex items-start justify-between gap-4">
                                <div class="font-bold flex-1 leading-relaxed">
                                    <span class="inline-block w-6 text-blue-800 font-mono">${q.number}.</span>
                                    <span>${q.prompt}</span>
                                </div>
                                <span class="text-xs font-mono font-bold text-slate-600 min-w-[50px] text-left">(${q.points} نمره)</span>
                            </div>

                            ${q.options && Object.keys(q.options).length > 0 ? `
                                <div class="grid grid-cols-2 gap-2 text-xs pr-6 pt-1 text-slate-700">
                                    ${Object.keys(q.options).map(k => `
                                        <div><b>(${k})</b> ${q.options[k]}</div>
                                    `).join('')}
                                </div>
                            ` : ''}

                            <!-- Scratch / Solution Box -->
                            <div class="h-16 border border-dashed border-slate-300 rounded mt-2 p-1 text-[10px] text-slate-400">
                                محل محاسبات و درج فرمول...
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Detachable Answer Key (Optional) -->
                ${includeKey ? `
                    <div class="pt-6 border-t-2 border-dashed border-slate-400 space-y-4">
                        <div class="text-xs font-bold text-center text-slate-700">--- محل برش: پاسخنامه و کلید تصحیح همکاران گرامی ---</div>
                        <div class="bg-slate-50 p-4 rounded border border-slate-300 space-y-3">
                            <div class="text-xs font-bold text-blue-900">کلید و بارم‌بندی تفکیکی آزمون:</div>
                            <div class="grid grid-cols-2 gap-2 text-xs">
                                ${questions.map(q => `
                                    <div class="p-2 bg-white border border-slate-200 rounded">
                                        <b>سوال ${q.number} (گزینه ${q.answer_key}):</b> ${q.explanation}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        `;

        if (window.renderMathInElement) {
            window.renderMathInElement(container, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }
    }

    function printDocument() {
        const sheet = document.getElementById('printable-a4-sheet');
        if (!sheet) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="fa" dir="rtl">
            <head>
                <meta charset="utf-8">
                <title>برگه آزمون فیزیک سمپاد</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
                <style>
                    body { font-family: 'Vazirmatn', sans-serif; direction: rtl; margin: 20mm; color: #111; }
                    @page { size: A4; margin: 15mm; }
                    table, tr, td, th { border-collapse: collapse; }
                </style>
            </head>
            <body>
                ${sheet.outerHTML}
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="qc-shell qc-section space-y-4">
          <header class="qc-card qc-card--p qc-ticks">
            <span class="qc-eyebrow">SAMPAD EXAM PRESS</span>
            <h1 class="qc-h2 mt-2">آزمون‌ساز استاندارد چاپی A4</h1>
            <p class="qc-lede mt-2" style="max-width:64ch;">تولید برگه امتحان هماهنگ با سربرگ رسمی سازمان ملی پرورش استعدادهای درخشان، شناسه امنیتی، بارکد، محل محاسبات و کلید تصحیح جداشونده.</p>
            <div class="flex flex-wrap gap-2 mt-4">
              <button type="button" class="qc-btn qc-btn--lg" onclick="window.PrintableExamView.openModal()">
                <i data-lucide="printer" class="w-4 h-4"></i> ساخت برگه آزمون
              </button>
              <button type="button" class="qc-btn qc-btn--ghost" onclick="window.store.setView('competitions')">
                <i data-lucide="trophy" class="w-4 h-4"></i> لیگ‌ها و مسابقات
              </button>
            </div>
          </header>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${[
                ['file-text', 'سربرگ رسمی', 'قالب مصوب امتحانات هماهنگ با فیلدهای شناسنامه آزمون'],
                ['calculator', 'محل محاسبات', 'کادر اختصاصی حل مسئله و بارم‌بندی چهارمرحله‌ای'],
                ['scissors', 'کلید تصحیح جدا', 'پاسخ‌نامه تشریحی مستقل برای دبیر']
            ].map(x => `
            <div class="qc-card qc-card--p">
              <span class="qc-feature__icon"><i data-lucide="${x[0]}" class="w-4 h-4"></i></span>
              <h3 class="mt-3 text-[12.5px] font-black text-[var(--ink)]">${x[1]}</h3>
              <p class="mt-1.5 text-[11px] leading-[1.95] text-[var(--muted)]">${x[2]}</p>
            </div>`).join('')}
          </div>
        </div>`;

        if (window.lucide) window.lucide.createIcons();
    }

    return {
        render,
        openModal,
        closeModal,
        generateExam,
        printDocument
    };
})();

window.PrintableExamView = PrintableExamView;
