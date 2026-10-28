/**
 * Timed Examination Runner Component (SAMPAD & Olympiad High-Precision Grade)
 * Features:
 * - Persistent countdown timer with warning states
 * - Interactive Question Palette with 4 visual states (Answered, Flagged, Unanswered, Current)
 * - Flag / Bookmark questions for review (علامت‌گذاری برای بازبینی)
 * - In-exam Quick Physics Formula Sheet modal (فرمول‌نامه سریع فیزیک)
 * - Keyboard shortcuts (1-4 / A-D) for instantaneous MCQ selection
 * - "پاک کردن گزینه" (Deselect option) button for negative-marking protection
 * - Written question physics symbol toolbar (ρ, g, Δ, λ, Ω, μ, m/s², N, J, W, Pa, fractions, square roots)
 * - Real-time live KaTeX / MathJax preview for descriptive written answers
 * - Pre-submission audit modal with answered/unanswered/flagged summary
 * - Comprehensive analytics results screen with filterable review (all, incorrect, correct)
 */
class ExamRunner {
    constructor(examData, containerId) {
        this.attemptId = examData.attempt_id;
        this.examId = examData.exam_id;
        this.title = examData.title_fa;
        this.durationMinutes = examData.duration_minutes;
        this.questions = examData.questions || [];
        this.containerId = containerId;

        this.currentIndex = 0;
        this.answers = {}; // question_id -> { selected_option_key, written_response_text }
        this.flagged = new Set();
        this.resultFilter = 'all'; // 'all', 'incorrect', 'correct'

        // Persistent Exam Timer calculation across page reloads/exits
        const startKey = `quantum_exam_start_${this.attemptId}`;
        let startedAt = parseInt(localStorage.getItem(startKey), 10);
        if (!startedAt) {
            startedAt = Date.now();
            localStorage.setItem(startKey, startedAt.toString());
        }
        this.startedAt = startedAt;
        this.totalSeconds = this.durationMinutes * 60;
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        this.remainingSeconds = Math.max(0, this.totalSeconds - elapsed);
        this.blurCount = 0;
        this.timerInterval = null;

        this.initAnswers();
        this.initFlagged();
        this.setupKeyboardShortcuts();
        this.startTimer();
    }

    initAnswers() {
        this.questions.forEach(q => {
            this.answers[q.id] = {
                question_id: q.id,
                selected_option_key: null,
                written_response_text: ''
            };
        });

        // Restore cached answers from localStorage
        try {
            const saved = localStorage.getItem('quantum_exam_answers_' + this.attemptId);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    Object.keys(parsed).forEach(qid => {
                        if (this.answers[qid]) {
                            this.answers[qid] = parsed[qid];
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('Failed to restore cached exam answers:', e);
        }
    }

    initFlagged() {
        try {
            const savedFlags = localStorage.getItem('quantum_exam_flagged_' + this.attemptId);
            if (savedFlags) {
                const parsed = JSON.parse(savedFlags);
                if (Array.isArray(parsed)) {
                    this.flagged = new Set(parsed);
                }
            }
        } catch (e) {
            console.warn('Failed to restore flagged questions:', e);
        }
    }

    saveFlaggedToStorage() {
        try {
            localStorage.setItem('quantum_exam_flagged_' + this.attemptId, JSON.stringify(Array.from(this.flagged)));
        } catch (e) {
            console.warn('Failed to save flagged questions:', e);
        }
    }

    toggleFlag(questionId) {
        if (this.flagged.has(questionId)) {
            this.flagged.delete(questionId);
        } else {
            this.flagged.add(questionId);
        }
        this.saveFlaggedToStorage();
        this.render();
    }

    setupKeyboardShortcuts() {
        this.keyHandler = (e) => {
            // Ignore when typing inside a textarea or text input
            if (['TEXTAREA', 'INPUT'].includes(e.target.tagName)) return;

            const q = this.questions[this.currentIndex];
            if (!q) return;

            if (q.question_type === 'mcq' && q.options) {
                const keyMap = {
                    '1': 'الف', 'a': 'الف', 'A': 'الف',
                    '2': 'ب', 'b': 'ب', 'B': 'ب',
                    '3': 'ج', 'c': 'ج', 'C': 'ج',
                    '4': 'د', 'd': 'د', 'D': 'د'
                };
                if (keyMap[e.key]) {
                    const optKey = keyMap[e.key];
                    const optExists = q.options.some(o => o.option_key === optKey);
                    if (optExists) {
                        e.preventDefault();
                        this.selectOption(q.id, optKey);
                    }
                }
            }

            // Quick navigation with Arrow keys
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                this.nextQuestion();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                this.prevQuestion();
            } else if (e.key.toLowerCase() === 'f') {
                this.toggleFlag(q.id);
            }
        };

        window.removeEventListener('keydown', this.keyHandler);
        window.addEventListener('keydown', this.keyHandler);
    }

    destroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.keyHandler) window.removeEventListener('keydown', this.keyHandler);
    }

    updateTimerDisplay() {
        const timerEl = document.getElementById('exam-timer-display');
        const timerBox = document.getElementById('exam-timer-box');
        if (timerEl) {
            const m = Math.floor(this.remainingSeconds / 60);
            const s = this.remainingSeconds % 60;
            timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

            if (timerBox) {
                if (this.remainingSeconds <= 60) {
                    timerBox.className = 'flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/40 font-mono font-black text-sm animate-pulse';
                } else if (this.remainingSeconds <= 300) {
                    timerBox.className = 'flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/40 font-mono font-black text-sm';
                } else {
                    timerBox.className = 'flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono font-bold text-sm';
                }
            }
        }
    }

    setupAntiCheat() {
        const handleBlur = () => {
            if (!document.getElementById('exam-timer-display')) return;
            this.blurCount++;
            const banner = document.getElementById('exam-anticheat-banner');
            if (banner) {
                banner.classList.remove('hidden');
                banner.innerHTML = `
                    <div class="flex items-center gap-2">
                        <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400"></i>
                        <span>ثبت در کارنامه امنیتی: خروج غیرمجاز از برگه آزمون (${this.blurCount} بار)</span>
                    </div>
                `;
                if (window.lucide) window.lucide.createIcons();
                setTimeout(() => { if (banner) banner.classList.add('hidden'); }, 6000);
            }
        };

        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) handleBlur();
        });
    }

    startTimer() {
        this.updateTimerDisplay();
        this.setupAntiCheat();

        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startedAt) / 1000);
            this.remainingSeconds = Math.max(0, this.totalSeconds - elapsed);
            this.updateTimerDisplay();

            if (this.remainingSeconds <= 0) {
                clearInterval(this.timerInterval);
                alert('⚠️ مهلت زمانی آزمون به پایان رسید! آزمون به طور خودکار ثبت می‌شود.');
                this.submitExam();
            }
        }, 1000);
    }

    getStats() {
        let answered = 0;
        let flaggedCount = 0;
        this.questions.forEach(q => {
            const ans = this.answers[q.id];
            const hasAns = ans && (ans.selected_option_key || (ans.written_response_text && ans.written_response_text.trim()));
            if (hasAns) answered++;
            if (this.flagged.has(q.id)) flaggedCount++;
        });
        const total = this.questions.length;
        const unanswered = Math.max(0, total - answered);
        const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
        return { answered, unanswered, flaggedCount, total, percent };
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const q = this.questions[this.currentIndex];
        if (!q) return;

        const currentAns = this.answers[q.id] || { selected_option_key: null, written_response_text: '' };
        const isFlagged = this.flagged.has(q.id);
        const stats = this.getStats();

        container.innerHTML = `
        <div class="max-w-5xl mx-auto px-4 py-6 space-y-4">
            <!-- Anti-Cheat Banner -->
            <div id="exam-anticheat-banner" class="hidden p-3 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-bold animate-shake"></div>

            <!-- Sticky Top HUD / Exam Header -->
            <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg sticky top-20 z-30 transition-all">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">آزمون استاندارد فیزیک</span>
                            <span class="text-xs font-extrabold text-slate-500 dark:text-slate-400">سؤال ${this.currentIndex + 1} از ${stats.total}</span>
                        </div>
                        <h2 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1">${this.title}</h2>
                    </div>

                    <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <!-- Quick Formula Sheet Button -->
                        <button onclick="window.currentExamRunner.openFormulaModal()" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/40 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-bold transition-all" title="فرمول‌نامه سریع فیزیک">
                            <i data-lucide="file-text" class="w-4 h-4"></i>
                            <span class="hidden sm:inline">فرمول‌نامه سریع</span>
                        </button>

                        <!-- Timer Box -->
                        <div id="exam-timer-box" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono font-bold text-sm">
                            <i data-lucide="clock" class="w-4 h-4 text-blue-500"></i>
                            <span id="exam-timer-display">--:--</span>
                        </div>

                        <!-- Submit Button -->
                        <button onclick="window.currentExamRunner.confirmSubmit()" class="btn-duo-green text-white font-black px-4 py-2 rounded-xl text-xs shadow-md">
                            ثبت و پایان
                        </button>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="mt-3">
                    <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex">
                        <div class="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 transition-all duration-300 rounded-full" style="width: ${stats.percent}%"></div>
                    </div>
                    <div class="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                        <span>پیشرفت: ${stats.answered} از ${stats.total} (${stats.percent}٪)</span>
                        ${stats.flaggedCount > 0 ? `<span class="text-amber-500 font-bold flex items-center gap-1">🚩 ${stats.flaggedCount} نشان‌شده</span>` : ''}
                    </div>
                </div>
            </div>

            <!-- Main Question Area -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                <!-- Question Details & Form -->
                <div class="lg:col-span-3 space-y-4">
                    <div class="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <!-- Top Metadata & Flag Toggle -->
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="px-3 py-1 rounded-full text-xs font-black ${q.question_type === 'mcq' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400'}">
                                    ${q.question_type === 'mcq' ? 'چهارگزینه‌ای استاندارد' : 'تشریحی / مسأله فیزیک'} (${q.points} نمره)
                                </span>
                                <span class="text-xs px-2.5 py-0.5 rounded-lg font-bold ${q.difficulty === 'hard' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40' : q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'}">
                                    سطح: ${q.difficulty === 'hard' ? 'سخت و المپیادی' : q.difficulty === 'easy' ? 'مبتدی و آسان' : 'متوسط'}
                                </span>
                            </div>

                            <!-- Flag for Review Button -->
                            <button onclick="window.currentExamRunner.toggleFlag(${q.id})" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${isFlagged ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-600 dark:text-amber-300 shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500'}">
                                <i data-lucide="flag" class="w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}"></i>
                                <span>${isFlagged ? 'نشان‌شده برای بازبینی' : 'علامت‌گذاری برای بازبینی'}</span>
                            </button>
                        </div>

                        <!-- Question Prompt -->
                        <div class="space-y-3">
                            <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed text-justify">
                                ${q.prompt_fa}
                            </h3>
                            ${q.source_ref ? `<div class="text-[11px] text-slate-400 font-medium">منبع: ${q.source_ref}</div>` : ''}
                        </div>

                        <!-- Answer Input Options -->
                        ${q.question_type === 'mcq' ? `
                        <div class="space-y-3 pt-2">
                            ${(q.options || []).map((opt, oIdx) => {
                                const isSelected = currentAns.selected_option_key === opt.option_key;
                                return `
                                <label class="flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm' : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'}">
                                    <input type="radio" name="opt_${q.id}" value="${opt.option_key}"
                                        ${isSelected ? 'checked' : ''}
                                        onchange="window.currentExamRunner.selectOption('${q.id}', '${opt.option_key}')"
                                        class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                    <span class="font-mono font-bold text-xs w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}">
                                        ${opt.option_key}
                                    </span>
                                    <span class="text-sm font-semibold flex-1 leading-relaxed">${opt.text_fa}</span>
                                    <span class="text-[10px] text-slate-400 font-sans hidden sm:inline">[کلید <span class="font-mono">${oIdx + 1}</span>]</span>
                                </label>
                                `;
                            }).join('')}

                            ${currentAns.selected_option_key ? `
                            <div class="pt-2 text-left">
                                <button onclick="window.currentExamRunner.clearCurrentOption(${q.id})" class="text-xs text-rose-500 hover:text-rose-600 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all inline-flex items-center gap-1">
                                    <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
                                    <span>پاک کردن گزینه انتخاب‌شده (حذف پاسخ)</span>
                                </button>
                            </div>
                            ` : ''}
                        </div>
                        ` : `
                        <!-- Written Question Toolbar & Live KaTeX Preview -->
                        <div class="space-y-3 pt-2">
                            <!-- Physics Symbol Bar -->
                            <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                                <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                    <span>درج سریع نمادها و یکاهای فیزیک:</span>
                                    <span class="text-[10px] text-blue-500 font-sans">روی نماد کلیک کنید</span>
                                </div>
                                <div class="flex flex-wrap gap-1.5">
                                    ${[
                                        { label: 'ρ (چگالی)', val: '\\rho' },
                                        { label: 'g (گرانش)', val: 'g' },
                                        { label: 'Δ (تغییرات)', val: '\\Delta ' },
                                        { label: 'λ (طول‌موج)', val: '\\lambda' },
                                        { label: 'Ω (اهم)', val: '\\Omega' },
                                        { label: 'μ (میکرو)', val: '\\mu' },
                                        { label: 'θ (زاویه)', val: '\\theta' },
                                        { label: 'π', val: '\\pi' },
                                        { label: 'm/s²', val: '\\text{m/s}^2' },
                                        { label: 'kg/m³', val: '\\text{kg/m}^3' },
                                        { label: 'N (نیوتون)', val: '\\text{N}' },
                                        { label: 'J (ژول)', val: '\\text{J}' },
                                        { label: 'Pa (پاسکال)', val: '\\text{Pa}' },
                                        { label: 'W (وات)', val: '\\text{W}' },
                                        { label: 'کسر (a/b)', val: '\\frac{a}{b}' },
                                        { label: 'رادیکال √x', val: '\\sqrt{x}' },
                                        { label: 'توان x²', val: 'x^2' },
                                        { label: '≈ تقریبی', val: '\\approx ' }
                                    ].map(sym => `
                                        <button type="button" onclick="window.currentExamRunner.insertSymbol('${sym.val.replace(/\\/g, '\\\\')}')" class="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-slate-600 text-[11px] font-mono text-slate-700 dark:text-slate-200 transition-all shadow-2xs">
                                            ${sym.label}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Textarea -->
                            <div>
                                <textarea id="written-answer-input" rows="7"
                                    oninput="window.currentExamRunner.setWrittenText('${q.id}', this.value)"
                                    placeholder="پاسخ را با تشریح مراحل، روابط فیزیکی، جایگذاری اعداد و یکاها بنویسید..."
                                    class="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none leading-relaxed font-sans">${currentAns.written_response_text || ''}</textarea>
                                
                                <div class="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                                    <span>نکته: فرمول‌ها را درون $...$ بنویسید تا به صورت ریاضی نمایش داده شوند.</span>
                                    <span id="written-char-count">${(currentAns.written_response_text || '').length} کاراکتر</span>
                                </div>
                            </div>

                            <!-- Live MathJax / KaTeX Render Preview -->
                            <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 space-y-2">
                                <div class="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                                    <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                                    <span>پیش‌نمایش ریاضی و استدلال علمی پاسخ شما:</span>
                                </div>
                                <div id="written-math-preview" class="text-sm text-slate-800 dark:text-slate-200 min-h-[40px] leading-relaxed break-words">
                                    ${currentAns.written_response_text ? currentAns.written_response_text : '<span class="text-xs text-slate-400 italic">به محض تایپ، فرمول‌ها و استدلال شما در اینجا زنده نمایش می‌یابند...</span>'}
                                </div>
                            </div>
                        </div>
                        `}
                    </div>

                    <!-- Bottom Nav Controls -->
                    <div class="flex items-center justify-between pt-2">
                        <button onclick="window.currentExamRunner.prevQuestion()"
                            ${this.currentIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="btn-duo-blue text-white"'}
                            class="px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm">
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            <span>سؤال قبلی</span>
                        </button>

                        <span class="text-xs text-slate-400 font-sans hidden sm:inline">سؤال <span class="font-mono">${this.currentIndex + 1}</span> از <span class="font-mono">${stats.total}</span></span>

                        <button onclick="window.currentExamRunner.nextQuestion()"
                            ${this.currentIndex === this.questions.length - 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="btn-duo-blue text-white"'}
                            class="px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm">
                            <span>سؤال بعدی</span>
                            <i data-lucide="chevron-left" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Right Side: Interactive Question Palette (نقشه هوشمند سؤالات) -->
                <div class="lg:col-span-1 space-y-4">
                    <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-48 space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div class="flex items-center gap-2">
                                <i data-lucide="layout-grid" class="w-4 h-4 text-blue-500"></i>
                                <h4 class="text-xs font-black text-slate-800 dark:text-white">نقشه سؤالات آزمون</h4>
                            </div>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">${stats.answered}/${stats.total}</span>
                        </div>

                        <!-- 4-State Question Grid -->
                        <div class="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
                            ${this.questions.map((item, idx) => {
                                const ans = this.answers[item.id];
                                const hasAns = ans && (ans.selected_option_key || (ans.written_response_text && ans.written_response_text.trim()));
                                const isFlag = this.flagged.has(item.id);
                                const isCurrent = idx === this.currentIndex;

                                let stateClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700';
                                if (hasAns && !isFlag) {
                                    stateClass = 'bg-emerald-500 text-white font-bold shadow-2xs';
                                } else if (isFlag) {
                                    stateClass = 'bg-amber-400 text-amber-950 font-black border-2 border-amber-500 shadow-2xs';
                                }

                                if (isCurrent) {
                                    stateClass += ' ring-4 ring-cyan-400 scale-105 z-10';
                                }

                                return `
                                <button onclick="window.currentExamRunner.jumpTo(${idx})"
                                    class="relative w-full aspect-square rounded-2xl text-xs font-bold flex items-center justify-center transition-all ${stateClass}"
                                    title="سؤال ${idx + 1} (${hasAns ? 'پاسخ‌داده' : 'بدون پاسخ'}${isFlag ? ' - نشان‌شده' : ''})">
                                    <span>${idx + 1}</span>
                                    ${isFlag ? `<span class="absolute -top-1 -right-1 text-[10px]">🚩</span>` : ''}
                                </button>
                                `;
                            }).join('')}
                        </div>

                        <!-- Legend -->
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <div class="flex items-center justify-between">
                                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> پاسخ‌داده</span>
                                <span class="font-bold text-emerald-600">${stats.answered}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> نشان بازبینی 🚩</span>
                                <span class="font-bold text-amber-500">${stats.flaggedCount}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 inline-block"></span> بدون‌پاسخ</span>
                                <span class="font-bold text-slate-400">${stats.unanswered}</span>
                            </div>
                        </div>

                        <!-- Final Submit Trigger inside palette -->
                        <div class="pt-2">
                            <button onclick="window.currentExamRunner.confirmSubmit()" class="w-full btn-duo-green text-white font-black py-2.5 rounded-2xl text-xs shadow-md">
                                اتمام و تحویل برگه
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formula Sheet Modal Placeholder -->
        <div id="exam-formula-modal-container"></div>

        <!-- Confirmation Modal Placeholder -->
        <div id="exam-submit-modal-container"></div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) window.renderMathInPage(container);
    }

    selectOption(questionId, key) {
        if (!this.answers[questionId]) {
            this.answers[questionId] = { question_id: questionId, selected_option_key: null, written_response_text: '' };
        }
        this.answers[questionId].selected_option_key = key;
        this.saveAnswersToStorage();
        this.render();
    }

    clearCurrentOption(questionId) {
        if (this.answers[questionId]) {
            this.answers[questionId].selected_option_key = null;
            this.saveAnswersToStorage();
            this.render();
        }
    }

    setWrittenText(questionId, text) {
        if (!this.answers[questionId]) {
            this.answers[questionId] = { question_id: questionId, selected_option_key: null, written_response_text: '' };
        }
        this.answers[questionId].written_response_text = text;
        this.saveAnswersToStorage();

        // Update char counter
        const charEl = document.getElementById('written-char-count');
        if (charEl) charEl.innerText = `${text.length} کاراکتر`;

        // Update live preview
        const prevEl = document.getElementById('written-math-preview');
        if (prevEl) {
            prevEl.innerHTML = text.trim() ? text : '<span class="text-xs text-slate-400 italic">به محض تایپ، فرمول‌ها و استدلال شما در اینجا زنده نمایش می‌یابند...</span>';
            if (window.renderMathInPage) window.renderMathInPage(prevEl);
        }
    }

    insertSymbol(sym) {
        const textarea = document.getElementById('written-answer-input');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const oldVal = textarea.value;

        // Insert LaTeX formatted block if contains math symbol
        const insertText = sym.startsWith('\\') ? `$${sym}$` : sym;
        const newVal = oldVal.substring(0, start) + insertText + oldVal.substring(end);
        textarea.value = newVal;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + insertText.length;

        const q = this.questions[this.currentIndex];
        if (q) {
            this.setWrittenText(q.id, newVal);
        }
    }

    saveAnswersToStorage() {
        try {
            localStorage.setItem('quantum_exam_answers_' + this.attemptId, JSON.stringify(this.answers));
        } catch (e) {
            console.warn('Failed to save exam answers to localStorage:', e);
        }
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.render();
        }
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.render();
        }
    }

    jumpTo(idx) {
        this.currentIndex = idx;
        this.render();
    }

    // Formula Sheet Modal
    openFormulaModal() {
        const modalContainer = document.getElementById('exam-formula-modal-container');
        if (!modalContainer) return;

        modalContainer.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
                <!-- Modal Header -->
                <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
                    <div class="flex items-center gap-2">
                        <div class="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 flex items-center justify-center font-bold">
                            <i data-lucide="file-text" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="font-extrabold text-base text-slate-900 dark:text-white">فرمول‌نامه رسمی فیزیک دوره اول متوسطه</h3>
                            <span class="text-xs text-slate-500">مرجع سریع روابط، تعاریف و یکاهای استاندارد SI</span>
                        </div>
                    </div>
                    <button onclick="window.currentExamRunner.closeFormulaModal()" class="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Modal Body with Formulas -->
                <div class="p-6 overflow-y-auto space-y-6 text-sm">
                    <!-- Section 1: چگالی و ماده -->
                    <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-2">
                        <h4 class="font-black text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <span>⚖️ چگالی، جرم و حجم (پایه هفتم)</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            <div>رابطه چگالی: $\\rho = \\frac{m}{V}$</div>
                            <div>تبدیل یکا: $1 \\text{ g/cm}^3 = 1000 \\text{ kg/m}^3$</div>
                            <div>وزن جسم: $W = m \\cdot g \\quad (g \\approx 9.8 \\text{ N/kg})$</div>
                            <div>حجم استوانه: $V = \\pi r^2 h$</div>
                        </div>
                    </div>

                    <!-- Section 2: حرکت و نیرو -->
                    <div class="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                        <h4 class="font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                            <span>🚀 حرکت، سرعت، شتاب و قوانین نیوتون (پایه نهم)</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            <div>تندی و سرعت متوسط: $v_{\\text{av}} = \\frac{\\Delta x}{\\Delta t}$</div>
                            <div>شتاب متوسط: $a = \\frac{\\Delta v}{\\Delta t} = \\frac{v_2 - v_1}{t_2 - t_1}$</div>
                            <div>قانون دوم نیوتون: $F_{\\text{net}} = m \\cdot a$</div>
                            <div>نیروی اصطکاک جنبشی: $f_k = \\mu_k \\cdot F_N$</div>
                        </div>
                    </div>

                    <!-- Section 3: فشار و شاره‌ها -->
                    <div class="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-2">
                        <h4 class="font-black text-amber-700 dark:text-amber-300 flex items-center gap-2">
                            <span>💧 فشار در جامدات و مایعات (پایه نهم)</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            <div>تعریف عمومی فشار: $P = \\frac{F}{A} \\quad (1 \\text{ Pa} = 1 \\text{ N/m}^2)$</div>
                            <div>فشار مایعات ساکن: $P = \\rho \\cdot g \\cdot h$</div>
                            <div>فشار کل (با جو): $P_{\\text{total}} = P_0 + \\rho g h$</div>
                            <div>اصل پاسکال: $\\frac{F_1}{A_1} = \\frac{F_2}{A_2}$</div>
                        </div>
                    </div>

                    <!-- Section 4: الکتریسیته و مغناطیس -->
                    <div class="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/60 space-y-2">
                        <h4 class="font-black text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
                            <span>⚡ الکتریسیته و مدارهای الکتریکی (پایه هشتم)</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            <div>قانون اهم: $V = I \\cdot R \\quad (1 \\ \\Omega = 1 \\text{ V/A})$</div>
                            <div>شدت جریان الکتریکی: $I = \\frac{q}{t}$</div>
                            <div>توان مصرفی: $P = V \\cdot I = R \\cdot I^2$</div>
                            <div>انرژی الکتریکی: $E = P \\cdot t$</div>
                        </div>
                    </div>

                    <!-- Section 5: کار و انرژی و گرما -->
                    <div class="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-2">
                        <h4 class="font-black text-purple-700 dark:text-purple-300 flex items-center gap-2">
                            <span>🔥 کار، انرژی، توان و گرما (پایه‌های هفتم و هشتم)</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            <div>کار نیروی ثابت: $W = F \\cdot d \\cdot \\cos(\\theta)$</div>
                            <div>انرژی جنبشی: $K = \\frac{1}{2} m v^2$</div>
                            <div>انرژی پتانسیل گرانشی: $U = m \\cdot g \\cdot h$</div>
                            <div>پایستگی انرژی مکانیکی: $E_1 = E_2 \\implies K_1 + U_1 = K_2 + U_2$</div>
                            <div>گرمای مبادله‌شده: $Q = m \\cdot c \\cdot \\Delta T$</div>
                            <div>تعادل گرمایی: $Q_1 + Q_2 = 0$</div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-left">
                    <button onclick="window.currentExamRunner.closeFormulaModal()" class="btn-duo-blue text-white font-bold px-6 py-2 rounded-xl text-xs">
                        متوجه شدم و بازگشت به آزمون
                    </button>
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) window.renderMathInPage(modalContainer);
    }

    closeFormulaModal() {
        const modalContainer = document.getElementById('exam-formula-modal-container');
        if (modalContainer) modalContainer.innerHTML = '';
    }

    // Confirmation Modal before submitting
    confirmSubmit() {
        const stats = this.getStats();
        const submitModalContainer = document.getElementById('exam-submit-modal-container');
        if (!submitModalContainer) return;

        submitModalContainer.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-scale-up">
                <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center mx-auto">
                    <i data-lucide="check-check" class="w-7 h-7"></i>
                </div>

                <div class="text-center space-y-1">
                    <h3 class="text-lg font-black text-slate-900 dark:text-white">ارزیابی وضعیت و ثبت نهایی آزمون</h3>
                    <p class="text-xs text-slate-500">وضعیت پاسخ‌دهی شما به شرح زیر است:</p>
                </div>

                <!-- Stats Summary Badges -->
                <div class="grid grid-cols-3 gap-2 text-center">
                    <div class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <span class="block text-xl font-black text-emerald-600 font-mono">${stats.answered}</span>
                        <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">پاسخ‌داده</span>
                    </div>
                    <div class="p-3 rounded-2xl ${stats.unanswered > 0 ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400'}">
                        <span class="block text-xl font-black font-mono">${stats.unanswered}</span>
                        <span class="text-[11px] font-bold">بدون‌پاسخ</span>
                    </div>
                    <div class="p-3 rounded-2xl ${stats.flaggedCount > 0 ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400'}">
                        <span class="block text-xl font-black font-mono">${stats.flaggedCount}</span>
                        <span class="text-[11px] font-bold">نشان‌دار 🚩</span>
                    </div>
                </div>

                ${stats.unanswered > 0 ? `
                <div class="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 text-rose-500"></i>
                    <span>هشدار: شما ${stats.unanswered} سؤال پاسخ‌نداده دارید!</span>
                </div>
                ` : `
                <div class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4 shrink-0 text-emerald-500"></i>
                    <span>عالی! به تمامی سؤالات پاسخ داده‌اید.</span>
                </div>
                `}

                <!-- Action Buttons -->
                <div class="space-y-2 pt-2">
                    <button onclick="window.currentExamRunner.closeSubmitModal(); window.currentExamRunner.submitExam()" class="w-full btn-duo-green text-white font-black py-3 rounded-2xl text-sm shadow-md">
                        تأیید قطعی و تحویل پاسخ‌نامه
                    </button>
                    ${stats.flaggedCount > 0 ? `
                    <button onclick="window.currentExamRunner.jumpToFirstFlagged()" class="w-full py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-xs transition-all">
                        بازبینی سؤالات نشان‌دار (🚩)
                    </button>
                    ` : ''}
                    <button onclick="window.currentExamRunner.closeSubmitModal()" class="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-all">
                        بازگشت و ادامه آزمون
                    </button>
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    closeSubmitModal() {
        const submitModalContainer = document.getElementById('exam-submit-modal-container');
        if (submitModalContainer) submitModalContainer.innerHTML = '';
    }

    jumpToFirstFlagged() {
        this.closeSubmitModal();
        for (let i = 0; i < this.questions.length; i++) {
            if (this.flagged.has(this.questions[i].id)) {
                this.jumpTo(i);
                break;
            }
        }
    }

    async submitExam() {
        this.destroy();
        localStorage.removeItem(`quantum_exam_start_${this.attemptId}`);
        localStorage.removeItem('quantum_exam_answers_' + this.attemptId);
        localStorage.removeItem('quantum_exam_flagged_' + this.attemptId);

        const container = document.getElementById(this.containerId);
        container.innerHTML = `
        <div class="text-center py-20 space-y-4 max-w-md mx-auto">
            <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white">در حال تصحیح خودکار و ارزیابی هوشمند پاسخ‌ها...</h3>
            <p class="text-xs text-slate-500 leading-relaxed">تحلیل هوش مصنوعی بر اساس رابریک‌های کتاب درسی و محاسبه نمرات در حال انجام است. لطفاً چند لحظه شکیبا باشید.</p>
        </div>
        `;

        try {
            const answersArray = Object.values(this.answers);
            const result = await window.api.submitExam(this.attemptId, answersArray);
            if (window.store && window.store.refreshUser) {
                await window.store.refreshUser();
            }
            if (result.xp_earned && window.store && window.store.showXpToast) {
                window.store.showXpToast(result.xp_earned, `آزمون «${result.exam_title_fa}»`);
            }
            this.renderResults(result);
        } catch (e) {
            alert('خطا در ثبت آزمون: ' + e.message);
        }
    }

    setResultFilter(filter) {
        this.resultFilter = filter;
        if (this.lastResult) {
            this.renderResults(this.lastResult);
        }
    }

    renderResults(res) {
        this.lastResult = res;
        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (res.is_passed) {
            if (window.store && window.store.playSound) window.store.playSound('celebrate');
        } else {
            if (window.store && window.store.playSound) window.store.playSound('wrong');
        }

        const totalQ = res.questions.length;
        const correctCount = res.questions.filter(q => q.is_correct).length;
        const wrongCount = Math.max(0, totalQ - correctCount);

        const filteredQuestions = res.questions.filter(q => {
            if (this.resultFilter === 'correct') return q.is_correct;
            if (this.resultFilter === 'incorrect') return !q.is_correct;
            return true;
        });

        container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <!-- Score Card -->
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
                <div class="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${res.is_passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} shadow-md">
                    <i data-lucide="${res.is_passed ? 'check-circle' : 'alert-circle'}" class="w-10 h-10"></i>
                </div>

                <div class="space-y-1">
                    <h2 class="text-2xl font-black text-slate-800 dark:text-white">${res.exam_title_fa}</h2>
                    <p class="text-xs text-slate-500">کارنامه ارزیابی علمی و تحلیلی</p>
                </div>

                <div class="flex items-center justify-center gap-6 py-2">
                    <div class="text-center">
                        <span class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">${res.final_score}</span>
                        <span class="text-sm font-normal text-slate-400 font-mono"> / ${res.total_possible_points}</span>
                        <span class="block text-xs font-bold text-slate-500 mt-1">نمره نهایی</span>
                    </div>
                    <div class="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
                    <div class="text-center">
                        <span class="text-4xl sm:text-5xl font-black ${res.is_passed ? 'text-emerald-500' : 'text-rose-500'} font-sans"><span class="font-mono">${res.percentage}</span>%</span>
                        <span class="block text-xs font-bold text-slate-500 mt-1">درصد کسب‌شده</span>
                    </div>
                </div>

                <div class="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2 rounded-full text-xs font-black ${res.is_passed ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'}">
                    <span>${res.is_passed ? 'تبریک! نمره قبولی را کسب کردید 🎉' : 'نیاز به مرور مباحث و تمرین مجدد 💡'}</span>
                    <span class="font-sans text-amber-500">• ⚡ +<span class="font-mono">${res.xp_earned || 0}</span> XP دریافت شد</span>
                </div>

                ${res.feedback_fa ? `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify max-w-2xl mx-auto">
                    ${res.feedback_fa}
                </div>
                ` : ''}
            </div>

            <!-- Filter Controls for Question Breakdown -->
            <div class="flex items-center justify-between flex-wrap gap-3">
                <h3 class="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
                    <i data-lucide="clipboard-list" class="w-5 h-5 text-blue-500"></i>
                    <span>تحلیل تفصیلی و پاسخ‌نامه تشریحی سؤالات</span>
                </h3>

                <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                    <button onclick="window.currentExamRunner.setResultFilter('all')" class="px-3 py-1.5 rounded-lg transition-all ${this.resultFilter === 'all' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'}">
                        همه سؤالات (${totalQ})
                    </button>
                    <button onclick="window.currentExamRunner.setResultFilter('incorrect')" class="px-3 py-1.5 rounded-lg transition-all ${this.resultFilter === 'incorrect' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'}">
                        نادرست‌ها (${wrongCount}) ❌
                    </button>
                    <button onclick="window.currentExamRunner.setResultFilter('correct')" class="px-3 py-1.5 rounded-lg transition-all ${this.resultFilter === 'correct' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'}">
                        صحیح‌ها (${correctCount}) ✔️
                    </button>
                </div>
            </div>

            <!-- Question Review Cards -->
            <div class="space-y-4">
                ${filteredQuestions.map((q, idx) => `
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border ${q.is_correct ? 'border-emerald-200 dark:border-emerald-900/60' : 'border-rose-200 dark:border-rose-900/60'} shadow-sm space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-500">سؤال ${idx + 1} (${q.final_score} از ${q.max_score} نمره)</span>
                        <span class="text-xs font-black px-3 py-1 rounded-full ${q.is_correct ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'}">
                            ${q.is_correct ? 'صحیح ✔️' : 'نادرست یا ناقص ❌'}
                        </span>
                    </div>

                    <p class="text-sm font-bold text-slate-900 dark:text-white leading-relaxed text-justify">${q.prompt_fa}</p>

                    ${q.question_type === 'mcq' ? `
                    <div class="text-xs space-y-2 pt-2">
                        <div class="flex items-center gap-2">
                            <span class="text-slate-500">پاسخ شما:</span>
                            <span class="font-black font-mono px-2 py-0.5 rounded-md ${q.is_correct ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' : 'bg-rose-100 text-rose-700 dark:bg-rose-950'}">
                                ${q.selected_option_key || 'بدون پاسخ'}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-slate-500">گزینه صحیح مرجع:</span>
                            <span class="font-black font-mono text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60">
                                ${q.correct_option_key || '-'}
                            </span>
                        </div>
                        ${q.explanation_fa ? `
                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed text-justify mt-2">
                            <span class="font-bold block mb-1 text-slate-900 dark:text-white">تحلیل و تشریح علمی:</span>
                            ${q.explanation_fa}
                        </div>
                        ` : ''}
                    </div>
                    ` : `
                    <div class="text-xs space-y-2 pt-2">
                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span class="font-bold block mb-1 text-slate-600 dark:text-slate-400">پاسخ ارسالی شما:</span>
                            <div class="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">${q.written_response_text || 'بدون پاسخ'}</div>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200">
                            <span class="font-bold block mb-1">پاسخ مرجع کتاب درسی و رابریک:</span>
                            <div class="leading-relaxed">${q.reference_answer_fa || '-'}</div>
                        </div>
                        ${q.feedback_fa ? `
                        <div class="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span class="font-bold block mb-1 text-slate-600 dark:text-slate-400">بازخورد ارزیابی هوشمند:</span>
                            <div class="text-slate-700 dark:text-slate-300 leading-relaxed">${q.feedback_fa}</div>
                        </div>
                        ` : ''}
                    </div>
                    `}
                </div>
                `).join('')}
            </div>

            <!-- Back to Curriculum Navigation -->
            <div class="text-center pt-6">
                <button onclick="window.store.setView('curriculum')" class="btn-duo-blue text-white font-black px-10 py-4 rounded-2xl shadow-lg text-sm">
                    بازگشت به برنامه درسی و مباحث
                </button>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) window.renderMathInPage(container);
    }
}

window.ExamRunner = ExamRunner;
