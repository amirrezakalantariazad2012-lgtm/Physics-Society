<?php
/**
 * QUANTUM CUT — Real-Time 1v1 Quantum Duel PvP Component (Pure PHP Edition)
 * Observatory Arena & ELO Rating System
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Quantum Duel 1v1 PvP View & Real-time ELO Engine
 */
const QuantumDuel = (function() {
    let currentDuel = null;
    let pollInterval = null;
    let timerInterval = null;
    let secondsLeft = 60;
    let userAnswers = {};
    let startTime = 0;

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="qc-adapt qc-shell qc-section space-y-6">
            <!-- Header HUD -->
            <div class="qc-telemetry-hud p-6 sm:p-8">
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-line)] text-[var(--accent)] text-xs font-bold">
                            <span class="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping"></span>
                            <span>میدان رقابت بلادرنگ نخبگان فیزیک</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span class="p-2.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--accent)] shadow-sm">
                                <i data-lucide="swords" class="w-6 h-6"></i>
                            </span>
                            <span>دوئل کوانتومی ۱ به ۱</span>
                        </h1>
                        <p class="text-[var(--muted)] text-xs sm:text-sm max-w-xl leading-relaxed">
                            در نبردهای سرعتی ۳۰ تا ۶۰ ثانیه‌ای با همکلاسی‌های سمپادی رقابت کنید، ریتینگ کوانتومی <bdi class="sci-term text-[var(--accent)] font-mono">(ELO)</bdi> خود را ارتقا دهید و برای خاندان علمی خود امتیاز کسب کنید.
                        </p>
                    </div>

                    <div class="flex items-center gap-2.5 shrink-0">
                        <button type="button" onclick="QuantumDuel.showLeaderboard()" class="qc-btn qc-btn--ghost qc-btn--sm">
                            <i data-lucide="trophy" class="w-4 h-4 text-[var(--warn)]"></i>
                            <span>رده‌بندی دوئلیست‌ها</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Duel Arena Container -->
            <div id="duel-arena-content" class="qc-card qc-card--p">
                ${renderLobbyView()}
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    function renderLobbyView() {
        return `
        <div class="max-w-xl mx-auto text-center space-y-6 py-6">
            <div class="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div class="absolute inset-0 rounded-full border-2 border-[var(--accent)] border-dashed animate-spin" style="animation-duration: 20s;"></div>
                <div class="w-24 h-24 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-4xl shadow-lg">
                    ⚛️
                </div>
            </div>

            <div class="space-y-2">
                <h3 class="text-xl font-black text-[var(--ink)]">آماده ورود به میدان نبرد هستید؟</h3>
                <p class="text-[var(--muted)] text-xs leading-relaxed">
                    سیستم مچ‌میکینگ هوشمند، هم‌رزمانی با ریتینگ نزدیک به شما را انتخاب می‌کند. سرعت پاسخگویی و دقت در روابط فیزیک تعیین‌کننده برنده خواهد بود.
                </p>
            </div>

            <div class="grid grid-cols-3 gap-3 text-right">
                <div class="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-center">
                    <div class="text-[11px] text-[var(--muted)]">تعداد سوالات</div>
                    <div class="text-base font-bold text-[var(--accent)] mt-1">۳ مسئله</div>
                </div>
                <div class="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-center">
                    <div class="text-[11px] text-[var(--muted)]">مهلت پاسخ</div>
                    <div class="text-base font-bold text-[var(--warn)] mt-1">۶۰ ثانیه</div>
                </div>
                <div class="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-center">
                    <div class="text-[11px] text-[var(--muted)]">جایزه برد</div>
                    <div class="text-base font-bold text-[var(--ok)] mt-1 font-mono"><bdi class="sci-term">+32 ELO</bdi></div>
                </div>
            </div>

            <button type="button" onclick="QuantumDuel.startMatchmaking()" class="qc-btn qc-btn--lg qc-btn--block">
                <i data-lucide="zap" class="w-4 h-4"></i>
                <span>جستجوی حریف و شروع دوئل</span>
            </button>
        </div>
        `;
    }

    async function startMatchmaking() {
        const arena = document.getElementById('duel-arena-content');
        if (!arena) return;

        arena.innerHTML = `
        <div class="max-w-md mx-auto text-center space-y-6 py-10">
            <div class="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div class="absolute inset-0 rounded-full border-4 border-[var(--accent-soft)] animate-ping"></div>
                <div class="absolute inset-2 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin"></div>
                <div class="text-4xl">📡</div>
            </div>

            <div class="space-y-1.5">
                <h3 class="text-lg font-black text-[var(--ink)]">در حال اسکن فرکانس‌های کوانتومی...</h3>
                <p class="text-[var(--muted)] text-xs">در حال جستجوی حریف هم‌تراز در سرور دبیرستان شهید بهشتی ۲...</p>
            </div>

            <button type="button" onclick="QuantumDuel.cancelMatchmaking()" class="qc-btn qc-btn--ghost qc-btn--sm">
                انصراف از جستجو
            </button>
        </div>
        `;

        try {
            const res = await fetch('/api/duel/find', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade_id: 7 })
            });

            const data = await res.json();

            if (data.status === 'matched') {
                launchDuel(data);
            } else if (data.status === 'waiting') {
                currentDuel = data;
                pollInterval = setInterval(async () => {
                    const sRes = await fetch('/api/duel/state/' + data.duel_code);
                    const sData = await sRes.json();
                    if (sData.status === 'in_progress') {
                        clearInterval(pollInterval);
                        launchDuel(sData);
                    }
                }, 2000);
            } else {
                alert(data.detail || 'خطا در برقراری اتصال دوئل');
                render('app-root');
            }
        } catch (e) {
            console.error(e);
            alert('خطای ارتباط با سرور دوئل');
            render('app-root');
        }
    }

    function cancelMatchmaking() {
        if (pollInterval) clearInterval(pollInterval);
        render('app-root');
    }

    function launchDuel(duelData) {
        currentDuel = duelData;
        secondsLeft = 60;
        userAnswers = {};
        startTime = Date.now();

        const arena = document.getElementById('duel-arena-content');
        if (!arena) return;

        const questions = duelData.questions || [];
        const opponent = duelData.opponent || { name: 'حریف ناشناس', elo: 1200 };

        arena.innerHTML = `
        <div class="space-y-6">
            <!-- Versus Telemetry Bar -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                <!-- Player 1 (You) -->
                <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-line)] flex items-center justify-center text-xl text-[var(--accent)]">
                        🛡️
                    </div>
                    <div>
                        <div class="text-xs font-black text-[var(--ink)]">شما</div>
                        <div class="text-[11px] text-[var(--accent)] font-mono"><bdi class="sci-term">ELO: 1200+</bdi></div>
                    </div>
                </div>

                <!-- Timer / Match Status -->
                <div class="text-center">
                    <div class="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-0.5">زمان باقی‌مانده</div>
                    <div id="duel-timer" class="text-2xl font-black text-[var(--accent)] font-mono qc-lcd qc-lcd-cyan">00:60</div>
                </div>

                <!-- Player 2 (Opponent) -->
                <div class="flex items-center justify-end gap-3">
                    <div class="text-left">
                        <div class="text-xs font-black text-[var(--ink)]">${opponent.name}</div>
                        <div class="text-[11px] text-[var(--danger)] font-mono"><bdi class="sci-term">ELO: ${opponent.elo}</bdi></div>
                    </div>
                    <div class="w-11 h-11 rounded-xl bg-[var(--danger-soft)] border border-[var(--danger)] flex items-center justify-center text-xl text-[var(--danger)]">
                        ⚔️
                    </div>
                </div>
            </div>

            <!-- Questions Deck -->
            <div class="space-y-4">
                ${questions.map((q, idx) => `
                    <div class="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] space-y-3">
                        <div class="flex items-center justify-between text-xs text-[var(--muted)] pb-2 border-b border-[var(--line)]">
                            <span class="font-bold text-[var(--ink-2)]">مسئله شماره ${idx + 1} از ${questions.length}</span>
                            <span class="text-[var(--accent)] font-bold font-mono"><bdi class="sci-term">${q.points || 10} XP</bdi></span>
                        </div>
                        <div class="text-sm text-[var(--ink)] font-medium leading-relaxed math-content">
                            ${q.prompt_fa || q.prompt}
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            ${renderOptions(q)}
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Submit Button -->
            <button type="button" onclick="QuantumDuel.submitDuel()" class="qc-btn qc-btn--lg qc-btn--block">
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>ثبت نهایی پاسخ‌ها و محاسبه ریتینگ</span>
            </button>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        if (window.renderMathInElement) {
            window.renderMathInElement(arena, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }

        // Start Countdown Timer
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsLeft--;
            const timerEl = document.getElementById('duel-timer');
            if (timerEl) {
                const s = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
                timerEl.textContent = '00:' + s;
                if (secondsLeft <= 10) {
                    timerEl.classList.add('text-[var(--danger)]', 'animate-pulse');
                }
            }
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                submitDuel();
            }
        }, 1000);
    }

    function renderOptions(q) {
        let opts = [];
        try {
            opts = typeof q.options_json === 'string' ? JSON.parse(q.options_json) : (q.options_json || []);
        } catch (e) {
            opts = [];
        }

        if (!opts || opts.length === 0) {
            opts = [
                { key: 'a', text: 'گزینه الف' },
                { key: 'b', text: 'گزینه ب' },
                { key: 'c', text: 'گزینه ج' },
                { key: 'd', text: 'گزینه د' }
            ];
        }

        return opts.map(opt => `
            <button type="button" onclick="QuantumDuel.selectOption(${q.id}, '${opt.key || opt.id}', this)" class="duel-opt-btn p-3 rounded-xl bg-[var(--surface)] hover:border-[var(--accent-line)] border border-[var(--line)] text-[var(--ink-2)] text-xs text-right transition-all flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-[var(--surface-2)] border border-[var(--line)] text-xs flex items-center justify-center font-bold text-[var(--accent)] font-mono">${opt.key || ''}</span>
                <span class="flex-1">${opt.text_fa || opt.text || ''}</span>
            </button>
        `).join('');
    }

    function selectOption(qId, key, btn) {
        userAnswers[qId] = key;
        const parent = btn.parentElement;
        parent.querySelectorAll('.duel-opt-btn').forEach(b => {
            b.classList.remove('bg-[var(--accent-soft)]', 'border-[var(--accent)]', 'text-[var(--ink)]');
            b.classList.add('bg-[var(--surface)]', 'border-[var(--line)]', 'text-[var(--ink-2)]');
        });
        btn.classList.add('bg-[var(--accent-soft)]', 'border-[var(--accent)]', 'text-[var(--ink)]');
    }

    async function submitDuel() {
        if (timerInterval) clearInterval(timerInterval);
        const timeSpent = Math.min(60, (Date.now() - startTime) / 1000);

        const arena = document.getElementById('duel-arena-content');
        if (arena) {
            arena.innerHTML = `
            <div class="py-12 text-center space-y-3">
                <div class="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 class="text-base font-black text-[var(--ink)]">در حال پردازش داوری کوانتومی و محاسبه ریتینگ ELO...</h3>
            </div>
            `;
        }

        try {
            const res = await fetch('/api/duel/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    duel_code: currentDuel.duel_code,
                    answers: userAnswers,
                    time_spent: timeSpent
                })
            });

            const data = await res.json();
            showResultModal(data, timeSpent);
        } catch (e) {
            console.error(e);
            alert('خطا در ارسال نتیجه');
        }
    }

    function showResultModal(res, timeSpent) {
        const arena = document.getElementById('duel-arena-content');
        if (!arena) return;

        const isWin = res.my_score >= 2;
        const eloDelta = isWin ? '+32' : '-12';

        arena.innerHTML = `
        <div class="max-w-xl mx-auto text-center space-y-6 py-6 animate-fadeIn">
            <div class="w-20 h-20 mx-auto rounded-3xl ${isWin ? 'bg-[var(--ok-soft)] text-[var(--ok)] border border-[var(--ok)]' : 'bg-[var(--warn-soft)] text-[var(--warn)] border border-[var(--warn)]'} flex items-center justify-center text-4xl shadow-lg">
                ${isWin ? '🏆' : '⚡'}
            </div>

            <div class="space-y-1.5">
                <h2 class="text-2xl font-black text-[var(--ink)]">${isWin ? 'پیروزی درخشان در دوئل کوانتومی!' : 'پایان رقابت نزدیک'}</h2>
                <p class="text-[var(--muted)] text-xs">عملکرد محاسباتی و زمان‌بندی شما با موفقیت ثبت شد.</p>
            </div>

            <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                <div>
                    <div class="text-[11px] text-[var(--muted)]">امتیاز شما</div>
                    <div class="text-xl font-bold text-[var(--ink)] mt-1 font-mono">${res.my_score} از ۳</div>
                </div>
                <div>
                    <div class="text-[11px] text-[var(--muted)]">تغییر ELO</div>
                    <div class="text-xl font-bold ${isWin ? 'text-[var(--ok)]' : 'text-[var(--warn)]'} mt-1 font-mono"><bdi class="sci-term">${eloDelta}</bdi></div>
                </div>
                <div>
                    <div class="text-[11px] text-[var(--muted)]">زمان صرف شده</div>
                    <div class="text-xl font-bold text-[var(--accent)] mt-1 font-mono"><bdi class="sci-term">${Math.round(timeSpent)} s</bdi></div>
                </div>
            </div>

            <div class="flex items-center justify-center gap-3 pt-2">
                <button type="button" onclick="QuantumDuel.startMatchmaking()" class="qc-btn qc-btn--sm">
                    دوئل مجدد ⚔️
                </button>
                <button type="button" onclick="QuantumDuel.showLeaderboard()" class="qc-btn qc-btn--ghost qc-btn--sm">
                    مشاهده لیدربورد 🏆
                </button>
            </div>
        </div>
        `;
    }

    async function showLeaderboard() {
        const arena = document.getElementById('duel-arena-content');
        if (!arena) return;

        arena.innerHTML = `
        <div class="text-center py-8">
            <div class="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        `;

        try {
            const res = await fetch('/api/duel/leaderboard');
            const data = await res.json();
            const leaders = data.leaders || [];

            arena.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                    <h3 class="text-base font-black text-[var(--ink)] flex items-center gap-2">
                        <span>🏆</span> تالار افتخارات دوئلیست‌های برتر
                    </h3>
                    <button type="button" onclick="QuantumDuel.render('app-root')" class="qc-btn qc-btn--ghost qc-btn--sm">
                        بازگشت به لابی ←
                    </button>
                </div>

                <div class="qc-table-wrap">
                    <table class="qc-table">
                        <thead>
                            <tr>
                                <th>رتبه</th>
                                <th>دانش‌پژوه</th>
                                <th>خاندان علمی</th>
                                <th class="text-center">ریتینگ ELO</th>
                                <th class="text-center">مجموع XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${leaders.map((u, i) => `
                                <tr>
                                    <td class="font-bold ${i === 0 ? 'text-[var(--warn)]' : (i === 1 ? 'text-[var(--muted)]' : (i === 2 ? 'text-[var(--accent-2)]' : ''))}">
                                        ${i === 0 ? '🥇 ۱' : (i === 1 ? '🥈 ۲' : (i === 2 ? '🥉 ۳' : i + 1))}
                                    </td>
                                    <td class="font-bold text-[var(--ink)]">${u.full_name || u.username}</td>
                                    <td>
                                        <span class="qc-chip qc-chip--mono" style="border-color:${u.guild_color || 'var(--line)'};color:${u.guild_color || 'var(--ink)'};">
                                            ${u.guild_name || 'بدون خاندان'}
                                        </span>
                                    </td>
                                    <td class="text-center font-bold text-[var(--accent)] font-mono">${u.elo_rating || 1200}</td>
                                    <td class="text-center font-mono">${u.total_xp || 0}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `;
        } catch (e) {
            console.error(e);
            arena.innerHTML = `<div class="qc-empty"><span class="qc-empty__title">خطا در دریافت جدول رده‌بندی</span></div>`;
        }
    }

    return {
        render,
        startMatchmaking,
        cancelMatchmaking,
        selectOption,
        submitDuel,
        showLeaderboard
    };
})();

window.QuantumDuel = QuantumDuel;
