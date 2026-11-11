<?php
/**
 * QUANTUM CUT — Computerized Adaptive Testing (CAT / IRT) Component (Pure PHP Edition)
 * Observatory Adaptive Testing & IRT Theta Aptitude Estimator
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
        <div class="qc-adapt qc-shell qc-section space-y-6">
            <!-- Header HUD -->
            <div class="qc-telemetry-hud p-6 sm:p-8">
                <div class="relative z-10 space-y-2 text-center md:text-right">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ok-soft)] border border-[var(--ok)] text-[var(--ok)] text-xs font-bold">
                        <span>🎯</span> مدل پاسخ‌گویی به پرسش (IRT Rasch Model)
                    </div>
                    <h1 class="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight flex items-center justify-center md:justify-start gap-3">
                        <span class="p-2.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--ok)] shadow-sm">
                            <i data-lucide="target" class="w-6 h-6"></i>
                        </span>
                        <span>آزمون تطبیقی هوشمند <bdi class="sci-term text-[var(--accent)] font-mono">(CAT)</bdi></span>
                    </h1>
                    <p class="text-[var(--muted)] text-xs sm:text-sm max-w-2xl leading-relaxed">
                        این سیستم با هر پاسخ شما، برآورد توانایی علمی <bdi class="sci-term text-[var(--accent)] font-mono">(θ)</bdi> را به‌صورت بلادرنگ کالیبره کرده و سوال بعدی را دقیقاً در مرز توانمندی ذهنی شما انتخاب می‌کند.
                    </p>
                </div>
            </div>

            <!-- Main Stage -->
            <div id="cat-stage-container" class="qc-card qc-card--p">
                ${renderIntroView()}
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();

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
        <div class="max-w-xl mx-auto text-center space-y-6 py-6">
            <div class="w-20 h-20 mx-auto rounded-3xl bg-[var(--ok-soft)] border border-[var(--ok)] flex items-center justify-center text-4xl shadow-lg text-[var(--ok)]">
                🎯
            </div>

            <div class="space-y-2">
                <h3 class="text-xl font-black text-[var(--ink)]">سنجش دقیق توانایی علمی بدون اتلاف وقت</h3>
                <p class="text-[var(--muted)] text-xs leading-relaxed">
                    برخلاف آزمون‌های سنتی که سوالات یکسانی دارند، آزمون تطبیقی با ۶ الی ۸ سوال، شاخص استعداد علمی شما را در مقیاس <bdi class="sci-term font-mono text-[var(--accent)]">θ ∈ [-3.0, +3.0]</bdi> با خطای حداقلی تخمین می‌زند.
                </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div class="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--muted)]">الگوریتم</div>
                    <div class="text-xs font-bold text-[var(--accent)] mt-1 font-mono">1PL Rasch</div>
                </div>
                <div class="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--muted)]">تعداد سوال</div>
                    <div class="text-xs font-bold text-[var(--warn)] mt-1">۶ الی ۸ مسئله</div>
                </div>
                <div class="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--muted)]">شاخص خروجی</div>
                    <div class="text-xs font-bold text-[var(--ok)] mt-1 font-mono">Theta Index</div>
                </div>
                <div class="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <div class="text-[11px] text-[var(--muted)]">جامعه هدف</div>
                    <div class="text-xs font-bold text-[var(--accent-2)] mt-1">پژوهشگران سمپاد</div>
                </div>
            </div>

            <button type="button" onclick="AdaptiveExam.startSession()" class="qc-btn qc-btn--lg qc-btn--block">
                <i data-lucide="zap" class="w-4 h-4"></i>
                <span>آغاز آزمون تطبیقی</span>
            </button>
        </div>
        `;
    }

    async function startSession() {
        const stage = document.getElementById('cat-stage-container');
        if (!stage) return;

        stage.innerHTML = `
        <div class="py-12 text-center space-y-3">
            <div class="w-10 h-10 border-4 border-[var(--ok)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-[var(--muted)] text-xs">در حال کالیبراسیون مدل IRT و انتخاب اولین مسئله...</p>
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
        <div class="space-y-6 animate-fadeIn">
            <!-- Theta Gauge HUD -->
            <div class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] space-y-2.5">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-[var(--muted)]">مسئله شماره ${session.question_number} (کالیبراسیون سختی: <span class="font-mono text-[var(--accent)]">${currentQuestion.difficulty_b || 0.0}</span>)</span>
                    <span class="font-mono font-bold text-[var(--ok)]">توانایی برآورد شده: θ = ${theta.toFixed(2)}</span>
                </div>
                <div class="relative w-full h-2.5 bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--line)]">
                    <div class="h-full bg-gradient-to-r from-[var(--accent)] via-[var(--ok)] to-[var(--accent-2)] transition-all duration-700" style="width: ${thetaPct}%;"></div>
                </div>
                <div class="flex justify-between text-[10px] text-[var(--muted)] font-mono">
                    <span>مبتدی (-3)</span>
                    <span>متوسط (0)</span>
                    <span>پیشرفته (+1.5)</span>
                    <span>المپیاد (+3)</span>
                </div>
            </div>

            <!-- Question Card -->
            <div class="space-y-4">
                <div class="text-sm md:text-base text-[var(--ink)] font-medium leading-relaxed math-content p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)]">
                    ${currentQuestion.prompt_fa || currentQuestion.prompt}
                </div>

                <!-- Options -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${renderOptions(currentQuestion)}
                </div>
            </div>

            <!-- Submit Answer Button -->
            <button type="button" id="cat-submit-btn" disabled onclick="AdaptiveExam.submitAnswer()" class="qc-btn qc-btn--lg qc-btn--block">
                <span>ثبت پاسخ و کالیبراسیون مرحله بعد</span> ➔
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
            <button type="button" onclick="AdaptiveExam.selectOption('${opt.key || opt.id}', this)" class="cat-opt-btn p-3.5 rounded-xl bg-[var(--surface)] hover:border-[var(--accent-line)] border border-[var(--line)] text-[var(--ink-2)] text-xs text-right transition-all flex items-center gap-3">
                <span class="w-7 h-7 rounded-lg bg-[var(--surface-2)] border border-[var(--line)] text-xs flex items-center justify-center font-bold text-[var(--ok)] font-mono">${opt.key || ''}</span>
                <span class="flex-1">${opt.text_fa || opt.text || ''}</span>
            </button>
        `).join('');
    }

    function selectOption(key, btn) {
        selectedOption = key;
        const parent = btn.parentElement;
        parent.querySelectorAll('.cat-opt-btn').forEach(b => {
            b.classList.remove('bg-[var(--ok-soft)]', 'border-[var(--ok)]', 'text-[var(--ink)]');
            b.classList.add('bg-[var(--surface)]', 'border-[var(--line)]', 'text-[var(--ink-2)]');
        });
        btn.classList.add('bg-[var(--ok-soft)]', 'border-[var(--ok)]', 'text-[var(--ink)]');

        const submitBtn = document.getElementById('cat-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }

    async function submitAnswer() {
        if (!selectedOption) return;

        const stage = document.getElementById('cat-stage-container');
        if (stage) {
            stage.innerHTML = `
            <div class="py-12 text-center space-y-3">
                <div class="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p class="text-[var(--muted)] text-xs">محاسبه درست‌نمایی بیشینه (MLE) و تنظیم تراز سختی...</p>
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
            <div class="w-20 h-20 mx-auto rounded-3xl bg-[var(--ok-soft)] text-[var(--ok)] border border-[var(--ok)] flex items-center justify-center text-4xl shadow-lg">
                🏆
            </div>

            <div class="space-y-1.5">
                <h2 class="text-2xl font-black text-[var(--ink)]">کارنامه تحلیلی آزمون تطبیقی (IRT)</h2>
                <p class="text-[var(--muted)] text-xs">ارزیابی پارامتر توانمندی علمی بر پایه مدل Rasch</p>
            </div>

            <div class="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] space-y-3">
                <div class="text-[11px] text-[var(--muted)] uppercase tracking-widest font-mono">تراز برآورد شده فیزیک (θ)</div>
                <div class="text-4xl font-black text-[var(--ok)] font-mono qc-lcd qc-lcd-green tracking-tight">${theta.toFixed(2)}</div>
                <div class="inline-block px-3.5 py-1 rounded-full bg-[var(--ok-soft)] text-[var(--ok)] text-xs font-bold border border-[var(--ok)]">
                    ${label}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-right">
                <div class="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-center">
                    <div class="text-[11px] text-[var(--muted)]">تعداد سوالات آزمون</div>
                    <div class="text-base font-bold text-[var(--ink)] mt-1 font-mono">${report.total_questions || 6} مسئله</div>
                </div>
                <div class="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-center">
                    <div class="text-[11px] text-[var(--muted)]">پاسخ‌های صحیح</div>
                    <div class="text-base font-bold text-[var(--accent)] mt-1 font-mono">${report.correct_count || 0} مورد</div>
                </div>
            </div>

            <div class="flex items-center justify-center gap-3 pt-2">
                <button type="button" onclick="AdaptiveExam.render('app-root')" class="qc-btn qc-btn--sm">
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
