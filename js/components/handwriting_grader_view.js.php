<?php
/**
 * QUANTUM CUT — AI Handwritten Solution Vision & Grader Component (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * AI Handwritten Solution Grader & Partial Credit Rubric Deck
 * Powered by Inferbase.ai & OpenAI GPT Oss 120B
 */
const HandwritingGrader = (function() {
    let currentPrompt = 'متحرکی با شتاب ثابت ۲ متر بر مجذور ثانیه از حال سکون به حرکت درمی‌آید. پس از ۶ ثانیه تندی و مسافت طی شده را به دست آورید.';

    function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-8 pb-16">
            <!-- Header HUD -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/30 p-8 shadow-2xl">
                <div class="absolute -top-24 -left-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 space-y-2 text-center md:text-right">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
                        <span>👁️</span> هوش مصنوعی بینایی ماشین و تصحیح برگه
                    </div>
                    <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <span>📝</span> تصحیح خودکار دست‌نوشته و ریزبارم فیزیک
                    </h1>
                    <p class="text-slate-400 text-sm max-w-2xl">
                        حل دست‌نویس یا تایپ‌شده مسائل فیزیک را ارسال کنید. هوش مصنوعی <b>GPT Oss 120B</b> با اعمال بارم‌بندی رسمی سمپاد، نمره بخش‌های فرمول، جایگذاری یکاها، جبر و پاسخ نهایی را تفکیک می‌کند.
                    </p>
                </div>
            </div>

            <!-- Grader Interactive Stage -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                <!-- Question Prompt Box -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-300">صورت مسئله فیزیک:</label>
                    <textarea id="grader-question-input" rows="2" class="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm focus:border-violet-500 transition-all">${currentPrompt}</textarea>
                </div>

                <!-- Solution Input Area -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs text-slate-300">
                        <label class="font-bold">دست‌نوشته، متن حل یا محاسبات مسئله:</label>
                        <span class="text-violet-400 font-mono">فرمت LaTeX و روابط جبری پشتیبانی می‌شود</span>
                    </div>
                    <textarea id="grader-solution-input" rows="5" placeholder="مثال:\n\\Delta x = 1/2 * a * t^2\n\\Delta x = 0.5 * 2 * (6)^2 = 36 m\nv = a * t = 2 * 6 = 12 m/s" class="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white font-mono text-sm focus:border-violet-500 transition-all"></textarea>
                </div>

                <!-- Submit Action -->
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div class="flex items-center gap-2 text-xs text-slate-400">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <span>موتور ارزیابی فعال: <b class="text-white">OpenAI GPT Oss 120B</b></span>
                    </div>

                    <button id="grader-submit-btn" onclick="HandwritingGrader.submitForGrading()" class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2">
                        <span>✨</span> تصحیح هوشمند و استخراج ریزبارم
                    </button>
                </div>

                <!-- Result Box (Hidden by default) -->
                <div id="grader-result-container" class="hidden pt-6 border-t border-slate-800 space-y-6 animate-fadeIn">
                    <!-- Dynamic Result -->
                </div>
            </div>
        </div>
        `;
    }

    async function submitForGrading() {
        const promptEl = document.getElementById('grader-question-input');
        const solEl = document.getElementById('grader-solution-input');
        const btn = document.getElementById('grader-submit-btn');
        const resultBox = document.getElementById('grader-result-container');

        const question = promptEl ? promptEl.value.trim() : '';
        const solution = solEl ? solEl.value.trim() : '';

        if (!solution) {
            alert('لطفاً متن حل مسئله یا فرمول‌های دست‌نوشته را وارد نمایید.');
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> در حال تحلیل ریزبارم...`;
        }

        try {
            const res = await fetch('/api/ai/grade-handwriting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_prompt: question,
                    student_solution: solution,
                    max_score: 20.0
                })
            });

            const data = await res.json();
            renderGraderResult(data);
        } catch (e) {
            console.error(e);
            alert('خطا در تصحیح دست‌نوشته');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<span>✨</span> تصحیح هوشمند و استخراج ریزبارم`;
            }
        }
    }

    function renderGraderResult(data) {
        const box = document.getElementById('grader-result-container');
        if (!box) return;

        box.classList.remove('hidden');

        const b = data.criteria_breakdown || {};
        const total = data.total_score || 0;
        const max = data.max_score || 20;
        const pct = data.percentage || 0;

        box.innerHTML = `
        <div class="space-y-6">
            <!-- Score Banner -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                <div class="text-center md:text-right">
                    <div class="text-xs text-slate-400">بارم‌بندی اعمال شده</div>
                    <div class="text-sm font-bold text-violet-400 mt-1">${data.rubric_applied || 'ریزبارم استاندارد سمپاد'}</div>
                </div>
                <div class="text-center">
                    <div class="text-xs text-slate-400">نمره نهایی کسب‌شده</div>
                    <div class="text-4xl font-black text-emerald-400 font-mono mt-1">${total} <span class="text-lg text-slate-500 font-normal">/ ${max}</span></div>
                </div>
                <div class="text-center md:text-left">
                    <div class="text-xs text-slate-400">درصد بازدهی حل</div>
                    <div class="text-2xl font-bold text-cyan-400 font-mono mt-1">${pct}%</div>
                </div>
            </div>

            <!-- Rubric 4-Tier Breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${Object.keys(b).map(k => {
                    const item = b[k];
                    return `
                    <div class="p-4 rounded-2xl bg-slate-800/40 border border-slate-750 flex items-center justify-between">
                        <div>
                            <div class="text-xs font-semibold text-slate-300">${item.title}</div>
                            <div class="text-[11px] text-slate-500 mt-0.5">بارم حداکثر: ${item.max} نمره</div>
                        </div>
                        <div class="text-lg font-bold text-emerald-400 font-mono">
                            ${item.score} / ${item.max}
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>

            <!-- Detailed Pedagogical Feedback -->
            <div class="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div class="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
                    <span>💡</span> گزارش بازخورد تشخیصی معلم همراه هوشمند
                </div>
                <div class="text-sm text-slate-200 leading-relaxed whitespace-pre-line math-content">
                    ${data.feedback_fa || ''}
                </div>
            </div>
        </div>
        `;

        if (window.renderMathInElement) {
            window.renderMathInElement(box, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }
    }

    return {
        render,
        submitForGrading
    };
})();

window.HandwritingGrader = HandwritingGrader;
