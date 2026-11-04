<?php
/**
 * QUANTUM CUT — Real-Time 1v1 Quantum Duel PvP Component (Pure PHP Edition)
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
        <div class="max-w-6xl mx-auto space-y-8 pb-16">
            <!-- Header HUD -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
                <div class="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                            میدان نبرد بلادرنگ نخبگان فیزیک
                        </div>
                        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span>⚔️</span> دوئل کوانتومی ۱ به ۱
                        </h1>
                        <p class="text-slate-400 text-sm max-w-xl">
                            در نبردهای سرعتی ۳۰ تا ۶۰ ثانیه‌ای با همکلاسی‌های سمپادی رقابت کنید، ریتینگ کوانتومی <bdi class="sci-term text-cyan-300 font-mono">(ELO)</bdi> خود را ارتقا دهید و برای خاندان علمی خود امتیاز کسب کنید.
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <button onclick="QuantumDuel.showLeaderboard()" class="px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg">
                            <span>🏆</span> رده‌بندی برترین دوئلیست‌ها
                        </button>
                    </div>
                </div>
            </div>

            <!-- Duel Arena Container -->
            <div id="duel-arena-content" class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl backdrop-blur-md">
                ${renderLobbyView()}
            </div>
        </div>
        `;
    }

    function renderLobbyView() {
        return `
        <div class="max-w-xl mx-auto text-center space-y-8 py-8">
            <div class="relative mx-auto w-36 h-36 flex items-center justify-center">
                <div class="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-dashed animate-spin" style="animation-duration: 20s;"></div>
                <div class="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 via-cyan-500 to-indigo-700 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/20">
                    ⚛️
                </div>
            </div>

            <div class="space-y-3">
                <h3 class="text-2xl font-bold text-white">آماده ورود به میدان نبرد هستید؟</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                    سیستم مچ‌میکینگ هوشمند، هم‌رزمانی با ریتینگ نزدیک به شما را انتخاب می‌کند. سرعت پاسخگویی و دقت در روابط فیزیک تعیین‌کننده برنده خواهد بود.
                </p>
            </div>

            <div class="grid grid-cols-3 gap-3 text-right">
                <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-750 text-center">
                    <div class="text-xs text-slate-400">تعداد سوالات</div>
                    <div class="text-lg font-bold text-cyan-400 mt-1">۳ مسئله</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-750 text-center">
                    <div class="text-xs text-slate-400">مهلت پاسخ</div>
                    <div class="text-lg font-bold text-amber-400 mt-1">۶۰ ثانیه</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-750 text-center">
                    <div class="text-xs text-slate-400">جایزه برد</div>
                    <div class="text-lg font-bold text-emerald-400 mt-1"><bdi class="sci-term">+32 ELO</bdi></div>
                </div>
            </div>

            <button onclick="QuantumDuel.startMatchmaking()" class="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3">
                <span>⚡</span> جستجوی حریف و شروع دوئل
            </button>
        </div>
        `;
    }

    async function startMatchmaking() {
        const arena = document.getElementById('duel-arena-content');
        if (!arena) return;

        arena.innerHTML = `
        <div class="max-w-md mx-auto text-center space-y-8 py-12">
            <div class="relative w-40 h-40 mx-auto flex items-center justify-center">
                <div class="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping"></div>
                <div class="absolute inset-2 rounded-full border-2 border-indigo-400/40 border-t-cyan-400 animate-spin"></div>
                <div class="text-5xl">📡</div>
            </div>

            <div class="space-y-2">
                <h3 class="text-xl font-bold text-white">در حال اسکن فرکانس‌های کوانتومی...</h3>
                <p class="text-slate-400 text-sm">در حال جستجوی حریف هم‌تراز در سرور دبیرستان شهید بهشتی ۲...</p>
            </div>

            <button onclick="QuantumDuel.cancelMatchmaking()" class="px-6 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-sm">
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
                // Poll for opponent
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
        <div class="space-y-8">
            <!-- Versus Telemetry Bar -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <!-- Player 1 (You) -->
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xl text-indigo-400">
                        🛡️
                    </div>
                    <div>
                        <div class="text-sm font-bold text-white">شما</div>
                        <div class="text-xs text-indigo-400 font-mono"><bdi class="sci-term">ELO: 1200+</bdi></div>
                    </div>
                </div>

                <!-- Timer / Match Status -->
                <div class="text-center">
                    <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">زمان باقی‌مانده</div>
                    <div id="duel-timer" class="text-3xl font-extrabold text-cyan-400 font-mono lcd-display sci-term">00:60</div>
                </div>

                <!-- Player 2 (Opponent) -->
                <div class="flex items-center justify-end gap-3">
                    <div class="text-left">
                        <div class="text-sm font-bold text-white">${opponent.name}</div>
                        <div class="text-xs text-rose-400 font-mono"><bdi class="sci-term">ELO: ${opponent.elo}</bdi></div>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-xl text-red-400">
                        ⚔️
                    </div>
                </div>
            </div>

            <!-- Questions Deck -->
            <div class="space-y-6">
                ${questions.map((q, idx) => `
                    <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-750 space-y-4">
                        <div class="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-700/50">
                            <span>مسئله شماره ${idx + 1} از ${questions.length}</span>
                            <span class="text-cyan-400 font-bold">${q.points || 10} امتیاز کوانتومی</span>
                        </div>
                        <div class="text-base text-white font-medium leading-relaxed math-content">
                            ${q.prompt_fa || q.prompt}
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            ${renderOptions(q)}
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Submit Button -->
            <button onclick="QuantumDuel.submitDuel()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2">
                <span>🚀</span> ثبت نهایی پاسخ‌ها و محاسبه ELO
            </button>
        </div>
        `;

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
                    timerEl.classList.add('text-red-500', 'animate-pulse');
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
            <button type="button" onclick="QuantumDuel.selectOption(${q.id}, '${opt.key || opt.id}', this)" class="duel-opt-btn p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700 text-slate-200 text-sm text-right transition-all flex items-center gap-3">
                <span class="w-6 h-6 rounded-lg bg-slate-800 border border-slate-600 text-xs flex items-center justify-center font-bold text-cyan-400">${opt.key || ''}</span>
                <span class="flex-1">${opt.text_fa || opt.text || ''}</span>
            </button>
        `).join('');
    }

    function selectOption(qId, key, btn) {
        userAnswers[qId] = key;
        const parent = btn.parentElement;
        parent.querySelectorAll('.duel-opt-btn').forEach(b => {
            b.classList.remove('bg-indigo-600/40', 'border-indigo-400', 'text-white');
            b.classList.add('bg-slate-900/60', 'border-slate-700', 'text-slate-200');
        });
        btn.classList.add('bg-indigo-600/40', 'border-indigo-400', 'text-white');
    }

    async function submitDuel() {
        if (timerInterval) clearInterval(timerInterval);
        const timeSpent = Math.min(60, (Date.now() - startTime) / 1000);

        const arena = document.getElementById('duel-arena-content');
        if (arena) {
            arena.innerHTML = `
            <div class="py-16 text-center space-y-4">
                <div class="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 class="text-xl font-bold text-white">در حال پردازش داوری کوانتومی و محاسبه ریتینگ ELO...</h3>
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
            <div class="w-24 h-24 mx-auto rounded-3xl ${isWin ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30' : 'bg-gradient-to-tr from-amber-600 to-red-500 text-white shadow-amber-500/30'} flex items-center justify-center text-5xl shadow-2xl">
                ${isWin ? '🏆' : '⚡'}
            </div>

            <div class="space-y-2">
                <h2 class="text-3xl font-extrabold text-white">${isWin ? 'پیروزی درخشان در دوئل کوانتومی!' : 'پایان رقابت نزدیک'}</h2>
                <p class="text-slate-400 text-sm">عملکرد محاسباتی و زمان‌بندی شما با موفقیت ثبت شد.</p>
            </div>

            <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div>
                    <div class="text-xs text-slate-400">امتیاز شما</div>
                    <div class="text-2xl font-bold text-white mt-1">${res.my_score} از ۳</div>
                </div>
                <div>
                    <div class="text-xs text-slate-400">تغییر ELO</div>
                    <div class="text-2xl font-bold ${isWin ? 'text-emerald-400' : 'text-amber-400'} mt-1 font-mono"><bdi class="sci-term">${eloDelta}</bdi></div>
                </div>
                <div>
                    <div class="text-xs text-slate-400">زمان صرف شده</div>
                    <div class="text-2xl font-bold text-cyan-400 mt-1 font-mono"><bdi class="sci-term">${Math.round(timeSpent)} s</bdi></div>
                </div>
            </div>

            <div class="flex items-center justify-center gap-4 pt-4">
                <button onclick="QuantumDuel.startMatchmaking()" class="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all">
                    دوئل مجدد ⚔️
                </button>
                <button onclick="QuantumDuel.showLeaderboard()" class="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-medium text-sm transition-all">
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
            <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        `;

        try {
            const res = await fetch('/api/duel/leaderboard');
            const data = await res.json();
            const leaders = data.leaders || [];

            arena.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <span>🏆</span> تالار افتخارات دوئلیست‌های برتر
                    </h3>
                    <button onclick="QuantumDuel.render('app-root')" class="text-xs text-indigo-400 hover:underline">
                        بازگشت به لابی ←
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-sm">
                        <thead class="text-xs text-slate-400 border-b border-slate-800">
                            <tr>
                                <th class="py-3 px-4">رتبه</th>
                                <th class="py-3 px-4">دانش‌پژوه</th>
                                <th class="py-3 px-4">خاندان علمی</th>
                                <th class="py-3 px-4 text-center">ریتینگ ELO</th>
                                <th class="py-3 px-4 text-center">مجموع XP</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            ${leaders.map((u, i) => `
                                <tr class="hover:bg-slate-800/30">
                                    <td class="py-3 px-4 font-bold ${i === 0 ? 'text-amber-400' : (i === 1 ? 'text-slate-300' : (i === 2 ? 'text-amber-600' : 'text-slate-500'))}">
                                        ${i === 0 ? '🥇 ۱' : (i === 1 ? '🥈 ۲' : (i === 2 ? '🥉 ۳' : i + 1))}
                                    </td>
                                    <td class="py-3 px-4 font-semibold text-white">${u.full_name || u.username}</td>
                                    <td class="py-3 px-4">
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style="background-color: ${u.guild_color ? u.guild_color + '22' : '#334155'}; color: ${u.guild_color || '#94a3b8'};">
                                            ${u.guild_name || 'بدون خاندان'}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-center font-bold text-cyan-400 font-mono">${u.elo_rating || 1200}</td>
                                    <td class="py-3 px-4 text-center text-slate-300 font-mono">${u.total_xp || 0}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `;
        } catch (e) {
            console.error(e);
            arena.innerHTML = `<div class="text-center text-red-400">خطا در بارگذاری جدول رده‌بندی</div>`;
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
