<?php
/**
 * QUANTUM CUT — Computerized Adaptive Testing (CAT / IRT) Component (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Computerized Adaptive Testing (CAT) & IRT Theta Aptitude Estimator
 */
const AdaptiveExam = (function() {
    let session = null;
    let currentQuestion = null;
    let selectedOption = null;

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-8 pb-16">
            <!-- Header HUD -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/30 p-8 shadow-2xl">
                <div class="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 space-y-2 text-center md:text-right">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        <span>🎯</span> مدل پاسخ‌گویی به پرسش (IRT Rasch Model)
                    </div>
                    <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <span>📐</span> آزمون تطبیقی هوشمند <bdi class="sci-term text-cyan-300 font-mono">(CAT)</bdi>
                    </h1>
                    <p class="text-slate-400 text-sm max-w-2xl">
                        این سیستم با هر پاسخ شما، برآورد توانایی علمی <bdi class="sci-term text-cyan-300 font-mono">(&theta;)</bdi> را به‌صورت بلادرنگ کالیبره کرده و سوال بعدی را دقیقاً در مرز توانمندی ذهنی شما انتخاب می‌کند.
                    </p>
                </div>
            </div>

            <!-- Main Stage -->
            <div id="cat-stage-container" class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl backdrop-blur-md">
                ${renderIntroView()}
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

    function renderIntroView() {
        return `
        <div class="max-w-xl mx-auto text-center space-y-8 py-8">
            <div class="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-5xl shadow-xl shadow-emerald-500/10 text-emerald-400">
                🎯
            </div>

            <div class="space-y-3">
                <h3 class="text-2xl font-bold text-white">سنجش دقیق استعداد فیزیک بدون اتلاف وقت</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                    برخلاف آزمون‌های سنتی که برای همه سوالات یکسان دارند، آزمون تطبیقی با ۶ الی ۱۰ سوال، شاخص استعداد علمی شما را در مقیاس <bdi class="sci-term text-cyan-300 font-mono">&theta; &isin; [-3.0, +3.0]</bdi> با خطای استاندارد حداقلی تخمین می‌زند.
                </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div class="text-xs text-slate-400">الگوریتم</div>
                    <div class="text-sm font-bold text-cyan-400 mt-1 font-mono">1PL Rasch</div>
                </div>
                <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div class="text-xs text-slate-400">تعداد سوال</div>
                    <div class="text-sm font-bold text-amber-400 mt-1">۶ الی ۸ مسئله</div>
                </div>
                <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div class="text-xs text-slate-400">شاخص توانایی</div>
                    <div class="text-sm font-bold text-emerald-400 mt-1 font-mono">Theta Index</div>
                </div>
                <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div class="text-xs text-slate-400">هدف</div>
                    <div class="text-sm font-bold text-indigo-400 mt-1">تشخیص المپیاد</div>
                </div>
            </div>

            <button onclick="AdaptiveExam.startSession()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-lg shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3">
                <span>⚡</span> آغاز آزمون تطبیقی
            </button>
        </div>
        `;
    }

    async function startSession() {
        const stage = document.getElementById('cat-stage-container');
        if (!stage) return;

        stage.innerHTML = `
        <div class="py-16 text-center space-y-4">
            <div class="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-slate-400 text-sm">در حال کالیبراسیون مدل IRT و انتخاب اولین مسئله...</p>
        </div>
        `;

        try {
            const res = await fetch('/api/exam/adaptive-start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade_id: 7 })
            });

            const data = await res.json();
            if (data.status === 'in_progress') {
                session = {
                    session_id: data.session_id,
                    theta: data.theta || 0.0,
                    question_number: data.question_number || 1
                };
                currentQuestion = data.question;
                renderQuestion();
            } else {
                alert(data.detail || 'خطا در آغاز آزمون تطبیقی');
                render('app-root');
            }
        } catch (e) {
            console.error(e);
            alert('خطای اتصال به سرور آزمون تطبیقی');
            render('app-root');
        }
    }

    function renderQuestion() {
        const stage = document.getElementById('cat-stage-container');
        if (!stage || !currentQuestion) return;

        selectedOption = null;
        const theta = session.theta || 0.0;
        const thetaPct = Math.min(100, Math.max(0, Math.round(((theta + 3.0) / 6.0) * 100)));

        stage.innerHTML = `
        <div class="space-y-8 animate-fadeIn">
            <!-- Theta Gauge HUD -->
            <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400">مسئله شماره ${session.question_number} (کالیبراسیون سختی: <span class="font-mono text-cyan-400">${currentQuestion.difficulty_b || 0.0}</span>)</span>
                    <span class="font-mono font-bold text-emerald-400">توانایی برآورد شده: &theta; = ${theta.toFixed(2)}</span>
                </div>
                <div class="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500 transition-all duration-700" style="width: ${thetaPct}%;"></div>
                </div>
                <div class="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>مبتدی (-3)</span>
                    <span>متوسط (0)</span>
                    <span>پیشرفته (+1.5)</span>
                    <span>نابغه المپیاد (+3)</span>
                </div>
            </div>

            <!-- Question Card -->
            <div class="space-y-6">
                <div class="text-lg md:text-xl text-white font-medium leading-relaxed math-content p-4 rounded-2xl bg-slate-800/30 border border-slate-800">
                    ${currentQuestion.prompt_fa || currentQuestion.prompt}
                </div>

                <!-- Options -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${renderOptions(currentQuestion)}
                </div>
            </div>

            <!-- Submit Answer Button -->
            <button id="cat-submit-btn" disabled onclick="AdaptiveExam.submitAnswer()" class="w-full py-4 rounded-2xl bg-slate-800 text-slate-500 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-not-allowed">
                <span>ثبت پاسخ و کالیبراسیون بعدی</span> ➔
            </button>
        </div>
        `;

        if (window.renderMathInElement) {
            window.renderMathInElement(stage, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }
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
                { key: 'a', text: 'گزینه ۱' },
                { key: 'b', text: 'گزینه ۲' },
                { key: 'c', text: 'گزینه ۳' },
                { key: 'd', text: 'گزینه ۴' }
            ];
        }

        return opts.map(opt => `
            <button type="button" onclick="AdaptiveExam.selectOption('${opt.key || opt.id}', this)" class="cat-opt-btn p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700 text-slate-200 text-sm text-right transition-all flex items-center gap-3">
                <span class="w-8 h-8 rounded-xl bg-slate-800 border border-slate-600 text-xs flex items-center justify-center font-bold text-emerald-400">${opt.key || ''}</span>
                <span class="flex-1">${opt.text_fa || opt.text || ''}</span>
            </button>
        `).join('');
    }

    function selectOption(key, btn) {
        selectedOption = key;
        const parent = btn.parentElement;
        parent.querySelectorAll('.cat-opt-btn').forEach(b => {
            b.classList.remove('bg-emerald-600/30', 'border-emerald-400', 'text-white');
            b.classList.add('bg-slate-900/60', 'border-slate-700', 'text-slate-200');
        });
        btn.classList.add('bg-emerald-600/30', 'border-emerald-400', 'text-white');

        const submitBtn = document.getElementById('cat-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
            submitBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'text-white', 'shadow-lg', 'shadow-emerald-600/30');
        }
    }

    async function submitAnswer() {
        if (!selectedOption) return;

        const stage = document.getElementById('cat-stage-container');
        if (stage) {
            stage.innerHTML = `
            <div class="py-16 text-center space-y-4">
                <div class="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p class="text-slate-400 text-sm">محاسبه درست‌نمایی بیشینه (MLE) و تنظیم تراز سختی...</p>
            </div>
            `;
        }

        try {
            const res = await fetch('/api/exam/adaptive-next', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: session.session_id,
                    question_id: currentQuestion.id,
                    answer: selectedOption
                })
            });

            const data = await res.json();
            if (data.status === 'completed') {
                showReport(data);
            } else if (data.status === 'in_progress') {
                session.theta = data.theta;
                session.question_number = data.question_number;
                currentQuestion = data.question;
                renderQuestion();
            } else {
                alert(data.detail || 'خطا در ارزیابی پاسخ');
            }
        } catch (e) {
            console.error(e);
            alert('خطا در ارتباط با آزمون تطبیقی');
        }
    }

    function showReport(report) {
        const stage = document.getElementById('cat-stage-container');
        if (!stage) return;

        const theta = report.final_theta || 0.0;
        const label = report.aptitude_label || 'متوسط متمایل به پیشرفته';

        stage.innerHTML = `
        <div class="max-w-xl mx-auto text-center space-y-6 py-6 animate-fadeIn">
            <div class="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-white flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/20">
                🏆
            </div>

            <div class="space-y-2">
                <h2 class="text-3xl font-extrabold text-white">کارنامه تحلیلی تطبیقی (IRT)</h2>
                <p class="text-slate-400 text-sm">ارزیابی پارامتر توانمندی علمی بر پایه مدل Rasch</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div class="text-xs text-slate-400 uppercase tracking-widest">تراز برآورد شده فیزیک (&theta;)</div>
                <div class="text-5xl font-black text-emerald-400 font-mono tracking-tight">${theta.toFixed(2)}</div>
                <div class="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold">
                    ${label}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-right">
                <div class="p-4 rounded-2xl bg-slate-800/40 border border-slate-750 text-center">
                    <div class="text-xs text-slate-400">تعداد سوالات کالیبره شده</div>
                    <div class="text-xl font-bold text-white mt-1">${report.total_questions || 6} مسئله</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-800/40 border border-slate-750 text-center">
                    <div class="text-xs text-slate-400">پاسخ‌های صحیح</div>
                    <div class="text-xl font-bold text-cyan-400 mt-1">${report.correct_count || 0} مورد</div>
                </div>
            </div>

            <div class="flex items-center justify-center gap-4 pt-4">
                <button onclick="AdaptiveExam.render('app-root')" class="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all">
                    آزمون مجدد 🎯
                </button>
            </div>
        </div>
        `;
    }

    return {
        render,
        startSession,
        selectOption,
        submitAnswer
    };
})();

window.AdaptiveExam = AdaptiveExam;
