<?php
/**
 * QUANTUM CUT — Multi-Tier Olympiad Physics Hint Engine (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Multi-Tier Olympiad Physics Hint Engine
 * Powered by Inferbase.ai & OpenAI GPT Oss 120B
 */
const OlympiadHintEngine = (function() {
    let currentTier = 1;
    let currentProblemPrompt = '';

    function openModal(prompt) {
        currentProblemPrompt = prompt || 'مسئله المپیاد فیزیک سمپاد';
        currentTier = 1;

        let modal = document.getElementById('olympiad-hint-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'olympiad-hint-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn';
            document.body.appendChild(modal);
        }

        renderModalContent();
        fetchHint(1);
    }

    function closeModal() {
        const modal = document.getElementById('olympiad-hint-modal');
        if (modal) modal.remove();
    }

    function renderModalContent() {
        const modal = document.getElementById('olympiad-hint-modal');
        if (!modal) return;

        modal.innerHTML = `
        <div class="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl text-amber-400">
                        💡
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">راهنمای چندمرحله‌ای المپیاد فیزیک</h3>
                        <div class="text-xs text-amber-400/80">هدایت سقراطی بدون لو دادن پاسخ نهایی</div>
                    </div>
                </div>

                <button onclick="OlympiadHintEngine.closeModal()" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg">
                    ×
                </button>
            </div>

            <!-- Tier Step Indicators -->
            <div class="grid grid-cols-4 gap-2 text-center text-xs">
                ${[1, 2, 3, 4].map(t => `
                    <div id="tier-step-${t}" class="p-2.5 rounded-xl border transition-all ${t === currentTier ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : (t < currentTier ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-950/40 border-slate-800 text-slate-600')}">
                        <span>سطح ${t}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Hint Display Box -->
            <div id="hint-display-box" class="min-h-[160px] p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div class="flex items-center justify-center py-8">
                    <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>

            <!-- Footer Navigation -->
            <div class="flex items-center justify-between pt-2">
                <div class="text-xs text-slate-500 font-mono">
                    موتور: GPT Oss 120B
                </div>
                <div class="flex items-center gap-3">
                    <button id="next-tier-btn" onclick="OlympiadHintEngine.unlockNextTier()" class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2">
                        <span>قفل‌گشایی سطح بعدی</span> ➔
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    async function fetchHint(tier) {
        currentTier = tier;
        const box = document.getElementById('hint-display-box');
        const nextBtn = document.getElementById('next-tier-btn');

        if (box) {
            box.innerHTML = `
            <div class="flex flex-col items-center justify-center py-8 space-y-3 text-center">
                <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <div class="text-xs text-slate-400">استخراج راهنمایی سطح ${tier} از مدل فیزیک...</div>
            </div>
            `;
        }

        try {
            const res = await fetch('/api/ai/olympiad-hint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question_prompt: currentProblemPrompt,
                    tier: tier
                })
            });

            const data = await res.json();
            if (box) {
                box.innerHTML = `
                <div class="space-y-3 animate-fadeIn">
                    <div class="text-xs font-bold text-amber-400 uppercase tracking-wider">${data.tier_title}</div>
                    <div class="text-sm text-slate-200 leading-relaxed whitespace-pre-line math-content">${data.hint_text}</div>
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

            if (nextBtn) {
                if (data.next_tier) {
                    nextBtn.classList.remove('hidden');
                    nextBtn.onclick = () => fetchHint(data.next_tier);
                } else {
                    nextBtn.classList.add('hidden');
                }
            }
        } catch (e) {
            console.error(e);
            if (box) box.innerHTML = `<div class="text-red-400 text-xs text-center">خطا در دریافت راهنمایی</div>`;
        }
    }

    function unlockNextTier() {
        if (currentTier < 4) {
            fetchHint(currentTier + 1);
        }
    }

    return {
        openModal,
        closeModal,
        unlockNextTier
    };
})();

window.OlympiadHintEngine = OlympiadHintEngine;
