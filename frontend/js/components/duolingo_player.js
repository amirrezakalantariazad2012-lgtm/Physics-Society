/**
 * Duolingo-Inspired Multi-Step Interactive Lesson Player
 */
class DuolingoPlayer {
    constructor(lesson, containerId) {
        this.lesson = lesson;
        this.containerId = containerId;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.steps = [];
        this.selectedOption = null;
        this.isAnswerChecked = false;
        this.isCorrect = false;
        this.xpEarned = 0;

        this.buildSteps();
    }

    buildSteps() {
        const blocks = this.lesson.content_blocks || {};
        this.steps = [];

        // Step 1: Engaging Introduction
        if (blocks.intro) {
            this.steps.push({
                type: 'intro',
                title: 'مقدمه و جرقه ذهنی',
                content: blocks.intro,
                icon: 'sparkles'
            });
        }

        // Step 2: Conceptual Explanation & Definitions
        if (blocks.explanation) {
            this.steps.push({
                type: 'theory',
                title: 'مفاهیم و قوانین فیزیکی',
                content: blocks.explanation,
                definition: blocks.definition,
                formula: blocks.formula,
                icon: 'lightbulb'
            });
        }

        // Step 3: Experiment & Real-World Application
        if (blocks.experiment) {
            this.steps.push({
                type: 'experiment',
                title: 'آزمایشگاه و شبیه‌سازی تجربی',
                content: blocks.experiment,
                icon: 'flask-conical'
            });
        }

        // Step 3.5: Interactive Physics Simulator (if available for topic)
        if (window.physicsSimulators) {
            const simType = window.physicsSimulators.getSimulatorForLesson(this.lesson);
            if (simType) {
                this.steps.push({
                    type: 'simulator',
                    simType: simType,
                    title: 'آزمایشگاه مجازی و شبیه‌ساز فیزیک',
                    icon: 'atom'
                });
            }
        }

        // Step 4: Misconception
        if (blocks.misconception) {
            this.steps.push({
                type: 'misconception',
                title: 'اشتباه رایج و هشدار علمی',
                content: blocks.misconception,
                icon: 'alert-triangle'
            });
        }

        // Step 5+: Interactive Exercises
        const exercises = this.lesson.exercises || [];
        exercises.forEach((ex, idx) => {
            this.steps.push({
                type: 'exercise',
                title: `تمرین تعاملی ${idx + 1}`,
                exercise: ex,
                icon: 'check-circle-2'
            });
        });

        // Final Step: Summary
        this.steps.push({
            type: 'summary',
            title: 'خلاصه و جمع‌بندی درس',
            content: this.lesson.summary_fa || 'درس با موفقیت به پایان رسید.',
            icon: 'award'
        });

        this.totalSteps = this.steps.length;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const currentStepObj = this.steps[this.currentStep];
        const progressPercent = Math.round(((this.currentStep + 1) / this.totalSteps) * 100);

        let stepHtml = '';
        if (currentStepObj.type === 'intro') {
            stepHtml = `
            <div class="space-y-6 text-center max-w-xl mx-auto py-8">
                <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                    <i data-lucide="sparkles" class="w-8 h-8"></i>
                </div>
                <h3 class="text-2xl font-bold text-slate-800 dark:text-white">${this.lesson.title_fa}</h3>
                <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-base leading-relaxed text-justify">
                    ${currentStepObj.content}
                </div>
            </div>
            `;
        } else if (currentStepObj.type === 'theory') {
            stepHtml = `
            <div class="space-y-6 max-w-2xl mx-auto py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                        <i data-lucide="book-open" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">${currentStepObj.title}</h3>
                </div>
                <div class="text-slate-700 dark:text-slate-200 text-base leading-relaxed text-justify space-y-4">
                    <p>${currentStepObj.content}</p>
                    ${currentStepObj.definition ? `
                    <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border-r-4 border-blue-500 text-blue-900 dark:text-blue-200">
                        <span class="font-bold block mb-1">تعریف علمی:</span>
                        ${currentStepObj.definition}
                    </div>
                    ` : ''}
                    ${currentStepObj.formula ? `
                    <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-center text-lg text-slate-800 dark:text-slate-100">
                        ${currentStepObj.formula}
                    </div>
                    ` : ''}
                </div>
            </div>
            `;
        } else if (currentStepObj.type === 'simulator') {
            stepHtml = `
            <div class="space-y-4 max-w-2xl mx-auto py-2">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
                        <i data-lucide="atom" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-black text-slate-800 dark:text-white">${currentStepObj.title}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">با تغییر متغیرهای فیزیکی، پدیده‌ها و فرمول‌ها را به صورت تجربی و ملموس آزمایش کنید</p>
                    </div>
                </div>
                <div id="duo-sim-mount-point" class="w-full"></div>
            </div>
            `;
        } else if (currentStepObj.type === 'experiment') {
            stepHtml = `
            <div class="space-y-6 max-w-2xl mx-auto py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                        <i data-lucide="flask-conical" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">${currentStepObj.title}</h3>
                </div>
                <div class="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 text-base leading-relaxed text-justify">
                    ${currentStepObj.content}
                </div>
            </div>
            `;
        } else if (currentStepObj.type === 'misconception') {
            stepHtml = `
            <div class="space-y-6 max-w-2xl mx-auto py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center">
                        <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-xl font-bold text-rose-700 dark:text-rose-400">${currentStepObj.title}</h3>
                </div>
                <div class="p-6 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-slate-700 dark:text-slate-200 text-base leading-relaxed text-justify">
                    ${currentStepObj.content}
                </div>
            </div>
            `;
        } else if (currentStepObj.type === 'exercise') {
            const ex = currentStepObj.exercise;
            stepHtml = `
            <div class="space-y-6 max-w-xl mx-auto py-4">
                <div class="text-center">
                    <span class="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
                        تمرین تعاملی
                    </span>
                    <h4 class="text-lg font-bold text-slate-800 dark:text-white leading-relaxed">
                        ${ex.prompt_fa}
                    </h4>
                </div>

                ${ex.exercise_type === 'mcq' || ex.exercise_type === 'true_false' ? `
                <div class="grid grid-cols-1 gap-3 pt-2">
                    ${ex.options_json.map((opt, i) => `
                    <button onclick="window.currentDuolingoPlayer.selectOption(${i})" 
                        id="duo-opt-${i}"
                        class="duo-option w-full p-4 rounded-xl border-2 text-right font-medium text-slate-700 dark:text-slate-200 transition-all ${this.selectedOption === i ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'}">
                        <span class="inline-flex w-7 h-7 rounded-lg items-center justify-center border border-slate-300 dark:border-slate-600 text-xs ml-3 font-bold">
                            ${i + 1}
                        </span>
                        ${opt}
                    </button>
                    `).join('')}
                </div>
                ` : `
                <div class="pt-2">
                    <input type="text" id="duo-input-ans" 
                        placeholder="پاسخ خود را اینجا بنویسید..." 
                        oninput="window.currentDuolingoPlayer.setInputValue(this.value)"
                        class="w-full p-4 text-center rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-lg font-bold outline-none" />
                </div>
                `}
            </div>
            `;
        } else if (currentStepObj.type === 'summary') {
            stepHtml = `
            <div class="space-y-6 text-center max-w-lg mx-auto py-8">
                <div class="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center animate-bounce">
                    <i data-lucide="award" class="w-10 h-10"></i>
                </div>
                <h3 class="text-2xl font-bold text-slate-800 dark:text-white">آفرین! درس با موفقیت تکمیل شد</h3>
                <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">${currentStepObj.content}</p>
                <div class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-bold">
                    <i data-lucide="zap" class="w-5 h-5 text-amber-500 fill-amber-500"></i>
                    <span>+${this.lesson.xp_reward || 25} امتیاز تجربه (XP) کسب کردید</span>
                </div>
            </div>
            `;
        }

        container.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-6">
            <!-- Progress Header -->
            <div class="flex items-center gap-4 mb-6">
                <button onclick="window.store.setView('curriculum')" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                <div class="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-emerald-500 to-green-400 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
                </div>
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">${this.currentStep + 1} / ${this.totalSteps}</span>
            </div>

            <!-- Content Area -->
            <div class="min-h-[380px] flex flex-col justify-center bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                ${stepHtml}

                <!-- Feedback Banner for Exercises -->
                <div id="duo-feedback-banner" class="hidden mt-6 p-4 rounded-2xl flex items-center justify-between"></div>
            </div>

            <!-- Bottom Action Footer -->
            <div class="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
                <div>
                    ${this.currentStep > 0 && currentStepObj.type !== 'summary' ? `
                    <button onclick="window.currentDuolingoPlayer.prevStep()" class="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm">
                        قبلی
                    </button>
                    ` : '<div></div>'}
                </div>

                <div>
                    ${currentStepObj.type === 'exercise' ? `
                    <button id="duo-check-btn" onclick="window.currentDuolingoPlayer.checkExercise()" 
                        class="btn-duo-green text-white font-bold px-8 py-3 rounded-2xl shadow-md text-sm ${this.selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''}">
                        بررسی پاسخ
                    </button>
                    ` : currentStepObj.type === 'summary' ? `
                    <button onclick="window.currentDuolingoPlayer.finishLesson()" class="btn-duo-green text-white font-bold px-8 py-3.5 rounded-2xl shadow-md text-sm flex items-center gap-2">
                        <span>بازگشت به برنامه درسی</span>
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    </button>
                    ` : `
                    <button onclick="window.currentDuolingoPlayer.nextStep()" class="btn-duo-blue text-white font-bold px-8 py-3 rounded-2xl shadow-md text-sm flex items-center gap-2">
                        <span>ادامه</span>
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    </button>
                    `}
                </div>
            </div>
        </div>
        `;

        if (window.lucide) {
            window.lucide.createIcons();
        }

        if (currentStepObj.type === 'simulator') {
            setTimeout(() => {
                if (window.physicsSimulators) {
                    window.physicsSimulators.mount(currentStepObj.simType, 'duo-sim-mount-point');
                }
            }, 60);
        }

        if (window.renderMathInPage) {
            setTimeout(window.renderMathInPage, 60);
        }
    }

    selectOption(idx) {
        if (this.isAnswerChecked) return;
        this.selectedOption = idx;
        const btn = document.getElementById('duo-check-btn');
        if (btn) btn.classList.remove('opacity-50', 'cursor-not-allowed');

        document.querySelectorAll('.duo-option').forEach((el, i) => {
            if (i === idx) {
                el.className = 'duo-option w-full p-4 rounded-xl border-2 text-right font-medium transition-all border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300';
            } else {
                el.className = 'duo-option w-full p-4 rounded-xl border-2 text-right font-medium transition-all border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200';
            }
        });
    }

    setInputValue(val) {
        if (this.isAnswerChecked) return;
        this.selectedOption = val.trim();
        const btn = document.getElementById('duo-check-btn');
        if (btn) {
            if (this.selectedOption) {
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    async checkExercise() {
        if (this.isAnswerChecked || this.selectedOption === null) return;
        const currentStepObj = this.steps[this.currentStep];
        const ex = currentStepObj.exercise;

        try {
            const res = await window.api.submitExercise(ex.id, this.selectedOption);
            this.isAnswerChecked = true;
            this.isCorrect = res.is_correct;

            const banner = document.getElementById('duo-feedback-banner');
            const checkBtn = document.getElementById('duo-check-btn');

            if (res.is_correct) {
                window.store.playSound('correct');
                banner.className = 'mt-6 p-4 rounded-2xl flex items-center justify-between bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200';
                banner.innerHTML = `
                    <div class="flex items-center gap-3">
                        <i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-600"></i>
                        <div>
                            <span class="font-bold block">عالی بود! پاسخ کاملاً صحیح است.</span>
                            <span class="text-xs text-emerald-700 dark:text-emerald-300">${res.explanation_fa}</span>
                        </div>
                    </div>
                `;
            } else {
                window.store.playSound('wrong');
                banner.className = 'mt-6 p-5 rounded-2xl flex flex-col gap-3 bg-rose-950/40 border border-rose-800 text-rose-200 shadow-lg';
                banner.innerHTML = `
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-3">
                            <i data-lucide="x-circle" class="w-6 h-6 text-rose-500 shrink-0 mt-0.5"></i>
                            <div>
                                <span class="font-bold text-base block text-rose-300">پاسخ نادرست بود</span>
                                <span class="text-xs text-rose-200/90 leading-relaxed">${res.explanation_fa || 'پاسخ ارسالی با اصول علمی این مبحث تطابق ندارد.'}</span>
                            </div>
                        </div>
                        <button id="duo-ai-help-btn" onclick="window.currentDuolingoPlayer.askAIWhyWrong()" 
                            class="shrink-0 px-3.5 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 text-violet-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm">
                            <i data-lucide="bot" class="w-4 h-4 text-violet-400"></i>
                            <span>تحلیل هوشمند کج‌فهمی (AI)</span>
                        </button>
                    </div>
                    <div id="duo-ai-analysis-container" class="hidden mt-2 pt-3 border-t border-rose-900/50"></div>
                `;
            }

            banner.classList.remove('hidden');

            // Change button to Continue
            checkBtn.innerText = 'ادامه';
            checkBtn.className = 'btn-duo-blue text-white font-bold px-8 py-3 rounded-2xl shadow-md text-sm';
            checkBtn.onclick = () => this.nextStep();

            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            alert(e.message);
        }
    }

    async askAIWhyWrong() {
        const container = document.getElementById('duo-ai-analysis-container');
        const btn = document.getElementById('duo-ai-help-btn');
        if (!container) return;

        if (btn) {
            btn.innerHTML = `<span class="animate-spin inline-block w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full ml-1.5"></span> در حال تحلیل هوشمند...`;
            btn.disabled = true;
        }

        const currentStepObj = this.steps[this.currentStep];
        const ex = currentStepObj.exercise;
        const currentGradeId = window.store?.user?.grade_id || 1;

        try {
            const aiData = await window.api.askAiTutor({
                grade_id: currentGradeId,
                chapter_id: this.lesson.chapter_id,
                lesson_id: this.lesson.id,
                student_query: `در تمرین «${ex.prompt_fa}»، پاسخ من اشتباه شد. لطفاً علت کج‌فهمی علمی، رابطه فیزیکی و نکته کلیدی را توضیح دهید.`
            });

            container.classList.remove('hidden');
            container.innerHTML = `
                <div class="p-4 rounded-xl bg-slate-900/90 border border-violet-500/40 shadow-inner space-y-3">
                    <div class="flex items-center gap-2 text-violet-400 font-bold text-xs">
                        <i data-lucide="sparkles" class="w-4 h-4 text-violet-400"></i>
                        <span>تحلیل معلم هوشمند فیزیک:</span>
                    </div>
                    <p class="text-xs text-slate-200 leading-relaxed">${aiData.response_fa}</p>
                    ${aiData.related_formulas && aiData.related_formulas.length ? `
                    <div class="p-2.5 rounded-lg bg-black/40 border border-violet-900/50">
                        <span class="text-[11px] font-bold text-cyan-400 block mb-1">فرمول‌های مرتبط:</span>
                        <div class="flex flex-wrap gap-2 text-xs font-mono text-cyan-300 dir-ltr katex-ltr-isolated" dir="ltr">
                            ${aiData.related_formulas.join(' &nbsp;|&nbsp; ')}
                        </div>
                    </div>` : ''}
                    ${aiData.key_hints && aiData.key_hints.length ? `
                    <ul class="text-[11px] text-amber-300/90 list-disc list-inside space-y-1">
                        ${aiData.key_hints.map(h => `<li>${h}</li>`).join('')}
                    </ul>` : ''}
                </div>
            `;
            if (btn) btn.classList.add('hidden');
            if (window.lucide) window.lucide.createIcons();
            if (window.renderMathInPage) setTimeout(window.renderMathInPage, 50);
        } catch (err) {
            container.classList.remove('hidden');
            container.innerHTML = `<span class="text-xs text-rose-300">خطا در دریافت تحلیل هوشمند: ${err.message}</span>`;
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<i data-lucide="bot" class="w-4 h-4 text-violet-400"></i><span>تلاش مجدد تحلیل</span>`;
            }
        }
    }

    nextStep() {
        this.selectedOption = null;
        this.isAnswerChecked = false;
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            if (this.currentStep === this.totalSteps - 1) {
                window.store.playSound('celebrate');
                // Complete lesson on server
                window.api.completeLesson(this.lesson.id);
            }
            this.render();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.selectedOption = null;
            this.isAnswerChecked = false;
            this.currentStep--;
            this.render();
        }
    }

    finishLesson() {
        window.store.setView('curriculum');
    }
}

window.DuolingoPlayer = DuolingoPlayer;
