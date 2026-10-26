/**
 * Timed Examination Runner Component
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

        // 1. Restore answers from localStorage to prevent data loss on reload or disconnect
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

    updateTimerDisplay() {
        const timerEl = document.getElementById('exam-timer-display');
        if (timerEl) {
            const m = Math.floor(this.remainingSeconds / 60);
            const s = this.remainingSeconds % 60;
            timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            if (this.remainingSeconds <= 300) {
                timerEl.classList.add('text-rose-500', 'animate-pulse');
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
                banner.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400 inline"></i> <span>هشدار امنیتی: خروج از برگه آزمون (${this.blurCount} بار) در سامانه ثبت گردید!</span>`;
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

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const q = this.questions[this.currentIndex];
        const currentAns = this.answers[q.id];

        container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-6 space-y-4">
            <!-- Anti-Cheat Focus Warning Banner -->
            <div id="exam-anticheat-banner" class="hidden p-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-2 animate-shake">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400"></i>
                <span>هشدار امنیتی کوانتوم: خروج از تب آزمون در سامانه ثبت گردید!</span>
            </div>

            <!-- Header with Timer -->
            <div class="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h2 class="font-bold text-lg text-slate-800 dark:text-white">${this.title}</h2>
                    <span class="text-xs text-slate-500 dark:text-slate-400">سؤال ${this.currentIndex + 1} از ${this.questions.length}</span>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono font-bold text-sm">
                        <i data-lucide="clock" class="w-4 h-4 text-blue-500"></i>
                        <span id="exam-timer-display">--:--</span>
                    </div>
                    <button onclick="window.currentExamRunner.confirmSubmit()" class="btn-duo-green text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm">
                        ثبت و پایان آزمون
                    </button>
                </div>
            </div>

            <!-- Main Question Area -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Question Details -->
                <div class="md:col-span-3 space-y-6">
                    <div class="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${q.question_type === 'mcq' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600' : 'bg-purple-100 dark:bg-purple-950 text-purple-600'}">
                                ${q.question_type === 'mcq' ? 'چهارگزینه‌ای' : 'تشریحی / مسأله فیزیک'} (${q.points} نمره)
                            </span>
                            <span class="text-xs text-slate-400">سطح: ${q.difficulty === 'hard' ? 'سخت' : q.difficulty === 'easy' ? 'آسان' : 'متوسط'}</span>
                        </div>

                        <p class="text-base font-semibold text-slate-800 dark:text-white leading-relaxed mb-6">
                            ${q.prompt_fa}
                        </p>

                        <!-- Options or Textarea -->
                        ${q.question_type === 'mcq' ? `
                        <div class="space-y-3">
                            ${q.options.map(opt => `
                            <label class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${currentAns.selected_option_key === opt.option_key ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'}">
                                <input type="radio" name="opt_${q.id}" value="${opt.option_key}" 
                                    ${currentAns.selected_option_key === opt.option_key ? 'checked' : ''} 
                                    onchange="window.currentExamRunner.selectOption('${q.id}', '${opt.option_key}')"
                                    class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                <span class="font-bold text-xs w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">${opt.option_key}</span>
                                <span class="text-sm font-medium">${opt.text_fa}</span>
                            </label>
                            `).join('')}
                        </div>
                        ` : `
                        <div>
                            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                                پاسخ تشریحی و استدلال علمی خود را بنویسید (استفاده از فرمول، یکا و مفاهیم الزامی است):
                            </label>
                            <textarea rows="6" 
                                oninput="window.currentExamRunner.setWrittenText('${q.id}', this.value)"
                                placeholder="پاسخ را به همراه روابط فیزیکی بنویسید..."
                                class="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm outline-none leading-relaxed">${currentAns.written_response_text || ''}</textarea>
                        </div>
                        `}
                    </div>

                    <!-- Navigation Controls -->
                    <div class="flex items-center justify-between">
                        <button onclick="window.currentExamRunner.prevQuestion()" 
                            ${this.currentIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="btn-duo-blue text-white"'}
                            class="px-5 py-2.5 rounded-xl font-bold text-sm">
                            سؤال قبلی
                        </button>
                        <button onclick="window.currentExamRunner.nextQuestion()" 
                            ${this.currentIndex === this.questions.length - 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="btn-duo-blue text-white"'}
                            class="px-5 py-2.5 rounded-xl font-bold text-sm">
                            سؤال بعدی
                        </button>
                    </div>
                </div>

                <!-- Question Grid Navigator -->
                <div class="md:col-span-1">
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                        <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">نقشه سؤالات</h4>
                        <div class="grid grid-cols-4 gap-2">
                            ${this.questions.map((item, idx) => {
                                const ans = this.answers[item.id];
                                const hasAns = ans && (ans.selected_option_key || (ans.written_response_text && ans.written_response_text.trim()));
                                const isCurrent = idx === this.currentIndex;
                                return `
                                <button onclick="window.currentExamRunner.jumpTo(${idx})"
                                    class="w-full aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all ${isCurrent ? 'ring-2 ring-blue-500 font-extrabold' : ''} ${hasAns ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                                    ${idx + 1}
                                </button>
                                `;
                            }).join('')}
                        </div>
                        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> پاسخ‌داده</span>
                            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 inline-block"></span> بدون‌پاسخ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    selectOption(questionId, key) {
        this.answers[questionId].selected_option_key = key;
        this.saveAnswersToStorage();
        this.render();
    }

    setWrittenText(questionId, text) {
        this.answers[questionId].written_response_text = text;
        this.saveAnswersToStorage();
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

    confirmSubmit() {
        const answeredCount = Object.values(this.answers).filter(a => a.selected_option_key || (a.written_response_text && a.written_response_text.trim())).length;
        const total = this.questions.length;
        if (confirm(`آیا از ثبت نهایی آزمون اطمینان دارید؟ (${answeredCount} از ${total} سؤال پاسخ داده شده است)`)) {
            this.submitExam();
        }
    }

    async submitExam() {
        clearInterval(this.timerInterval);
        localStorage.removeItem(`quantum_exam_start_${this.attemptId}`);
        localStorage.removeItem('quantum_exam_answers_' + this.attemptId);
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
        <div class="text-center py-20 space-y-4">
            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">در حال تصحیح خودکار و ارزیابی هوشمند پاسخ‌ها...</h3>
            <p class="text-xs text-slate-500">لطفاً چند لحظه شکیبا باشید.</p>
        </div>
        `;

        try {
            const answersArray = Object.values(this.answers);
            const result = await window.api.submitExam(this.attemptId, answersArray);
            this.renderResults(result);
        } catch (e) {
            alert(e.message);
        }
    }

    renderResults(res) {
        const container = document.getElementById(this.containerId);
        if (res.is_passed) {
            window.store.playSound('celebrate');
        } else {
            window.store.playSound('wrong');
        }

        container.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <!-- Score Card -->
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
                <div class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${res.is_passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}">
                    <i data-lucide="${res.is_passed ? 'check-circle' : 'alert-circle'}" class="w-8 h-8"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white">${res.exam_title_fa}</h2>
                <div class="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                    ${res.final_score} <span class="text-lg font-normal text-slate-400">/ ${res.total_possible_points}</span>
                </div>
                <div class="inline-block px-4 py-1.5 rounded-full text-xs font-bold ${res.is_passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                    ${res.is_passed ? 'قبول شدید (تبریک!)' : 'نیاز به مرور و تمرین بیشتر'} (${res.percentage}٪)
                </div>
                <p class="text-sm text-slate-600 dark:text-slate-300">${res.feedback_fa || ''}</p>
            </div>

            <!-- Detailed Question Breakdown -->
            <div class="space-y-4">
                <h3 class="font-bold text-lg text-slate-800 dark:text-white">بررسی تفصیلی پاسخ‌ها</h3>
                ${res.questions.map((q, idx) => `
                <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border ${q.is_correct ? 'border-emerald-200 dark:border-emerald-900' : 'border-slate-200 dark:border-slate-800'} shadow-sm space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-500">سؤال ${idx + 1} (${q.final_score} از ${q.max_score} نمره)</span>
                        <span class="text-xs font-bold px-2.5 py-1 rounded-full ${q.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
                            ${q.is_correct ? 'صحیح' : 'نادرست یا ناقص'}
                        </span>
                    </div>
                    <p class="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">${q.prompt_fa}</p>

                    ${q.question_type === 'mcq' ? `
                    <div class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div>پاسخ شما: <span class="font-bold font-mono">${q.selected_option_key || 'پاسخ داده نشده'}</span></div>
                        <div>گزینه صحیح: <span class="font-bold font-mono text-emerald-600">${q.correct_option_key || '-'}</span></div>
                        ${q.explanation_fa ? `<div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-2">${q.explanation_fa}</div>` : ''}
                    </div>
                    ` : `
                    <div class="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span class="font-bold block mb-1">پاسخ ارسالی شما:</span>
                            ${q.written_response_text || 'بدون پاسخ'}
                        </div>
                        <div class="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200">
                            <span class="font-bold block mb-1">پاسخ مرجع کتاب درسی:</span>
                            ${q.reference_answer_fa || '-'}
                        </div>
                        <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                            <span class="font-bold block mb-1">بازخورد ارزیابی هوشمند:</span>
                            ${q.feedback_fa || '-'}
                        </div>
                    </div>
                    `}
                </div>
                `).join('')}
            </div>

            <!-- Back Action -->
            <div class="text-center pt-4">
                <button onclick="window.store.setView('curriculum')" class="btn-duo-blue text-white font-bold px-8 py-3.5 rounded-2xl shadow-md text-sm">
                    بازگشت به برنامه درسی
                </button>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }
}

window.ExamRunner = ExamRunner;
