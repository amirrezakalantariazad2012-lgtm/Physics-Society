/**
 * QUANTUM CUT — Socratic Multi-Step Interactive Lesson Player
 * Fully preserved logic, elevated with deep-space cyberpunk UI
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
                title: 'مقدمه و جرقه مفهومی',
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
                <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <i data-lucide="sparkles" class="w-8 h-8"></i>
                </div>
                <h3 class="text-2xl font-black text-white tracking-tight">${this.lesson.title_fa}</h3>
                <div class="p-6 rounded-2xl bg-slate-950/70 border border-cyan-500/20 text-slate-200 text-sm sm:text-base leading-relaxed text-justify shadow-inner">
                    ${currentStepObj.content}
                </div>
            </div>
            `;
        } else if (currentStepObj.type === 'theory') {
            stepHtml = `
            <div class="space-y-6 max-w-2xl mx-auto py-4">
                <div class="flex items-center gap-3 border-b border-cyan-500/15 pb-3">
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shadow-md shadow-cyan-500/20">
                        <i data-lucide="book-open" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-lg sm:text-xl font-black text-white">${currentStepObj.title}</h3>
                </div>
                <div class="text-slate-200 text-sm sm:text-base leading-relaxed text-justify space-y-4">
                    <p class="leading-loose">${currentStepObj.content}</p>
                    ${currentStepObj.definition ? `
                    <div class="p-4 rounded-xl bg-cyan-950/40 border-r-4 border-cyan-400 text-cyan-200 border border-cyan-500/20">
                        <span class="font-bold block mb-1 text-cyan-300">تعریف علمی:</span>
                        ${currentStepObj.definition}
                    </div>
                    ` : ''}
                    ${currentStepObj.formula ? `
                    <div class="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 font-mono text-center text-lg text-cyan-300 shadow-md">
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
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shadow-md shadow-cyan-500/20">
                        <i data-lucide="atom" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-lg sm:text-xl font-black text-white">${currentStepObj.title}</h3>
                        <p class="text-xs text-slate-400">با تغییر متغیرهای فیزیکی، پدیده‌ها و فرمول‌ها را به صورت تجربی و ملموس آزمایش کنید</p>
                    </div>
                </div>
                <div id="duo-sim-mount-point" class="w-full"></div>
            </div>
            `;
        } else if (currentStepObj.type === 'experiment') {
            stepHtml = `
            <div class="space-y-6 max-w-2xl mx-auto py-4">
                <div class="flex items-center gap-3 border-b border-emerald-500/15 pb-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
                        <i data-lucide="flask-conical" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-lg sm:text-xl font-black text-white">${currentStepObj.title}</h3>
                </div>
                <div class="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100 text-sm sm:text-base leading-relaxed text-justify">
                    ${currentStepObj.content}
                </div>
            </div>
            `;
        } else if (currentStepObj.type === 'misconception') {
            stepHtml = `
            <div class="space-y-6 max-w-2xl mx-auto py-4">
                <div class="flex items-center gap-3 border-b border-rose-500/20 pb-3">
                    <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-md">
                        <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-lg sm:text-xl font-black text-rose-300">${currentStepObj.title}</h3>
                </div>
                <div class="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-100 text-sm sm:text-base leading-relaxed text-justify">
                    ${currentStepObj.content}
                </div>
            </div>
            `;
        } else if (currentStepObj.type === 'exercise') {
            const ex = currentStepObj.exercise;
            stepHtml = `
            <div class="space-y-6 max-w-xl mx-auto py-4">
                <div class="text-center">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono mb-2">
                        <i data-lucide="zap" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>CONCEPTUAL CHECK • تمرین مفهومی</span>
                    </span>
                    <h4 class="text-base sm:text-lg font-bold text-white leading-relaxed mt-2">
                        ${ex.prompt_fa}
                    </h4>
                </div>

                ${ex.exercise_type === 'mcq' || ex.exercise_type === 'true_false' ? `
                <div class="grid grid-cols-1 gap-3 pt-2">
                    ${ex.options_json.map((opt, i) => `
                    <button onclick="window.currentDuolingoPlayer.selectOption(${i})" 
                        id="duo-opt-${i}"
                        class="duo-option w-full p-4 rounded-2xl border text-right font-medium transition-all ${this.selectedOption === i ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-lg shadow-cyan-500/20' : 'border-slate-800 hover:border-slate-700 bg-slate-900/80 text-slate-200'}">
                        <span class="inline-flex w-7 h-7 rounded-xl items-center justify-center border ${this.selectedOption === i ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-slate-700 bg-slate-800 text-slate-400'} text-xs ml-3 font-mono font-bold">
                            ${i + 1}
                        </span>
                        <span class="text-xs sm:text-sm">${opt}</span>
                    </button>
                    `).join('')}
                </div>
                ` : `
                <div class="pt-2">
                    <input type="text" id="duo-input-ans" 
                        placeholder="پاسخ خود را اینجا بنویسید..." 
                        oninput="window.currentDuolingoPlayer.setInputValue(this.value)"
                        class="w-full p-4 text-center rounded-2xl border border-cyan-500/30 focus:border-cyan-400 bg-slate-950/80 text-white text-base sm:text-lg font-bold outline-none shadow-inner" />
                </div>
                `}
            </div>
            `;
        } else if (currentStepObj.type === 'summary') {
            stepHtml = `
            <div class="space-y-6 text-center max-w-lg mx-auto py-8">
                <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
                    <i data-lucide="award" class="w-10 h-10"></i>
                </div>
                <h3 class="text-2xl font-black text-white">تبریک! درسنامه با موفقیت تکمیل شد</h3>
                <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">${currentStepObj.content}</p>
                <div class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono text-sm shadow-md">
                    <i data-lucide="zap" class="w-5 h-5 text-amber-400 fill-amber-400"></i>
                    <span>+${this.lesson.xp_reward || 25} XP AWARDED</span>
                </div>
            </div>
            `;
        }

        container.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-6">
            <!-- Progress Header -->
            <div class="flex items-center gap-4 mb-6">
                <button onclick="window.store.setView('curriculum')" class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors" title="خروج از درسنامه">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                <div class="flex-1 bg-slate-900 border border-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                    <div class="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-cyan-500/50" style="width: ${progressPercent}%"></div>
                </div>
                <span class="text-xs font-mono font-bold text-cyan-400">${this.currentStep + 1} / ${this.totalSteps}</span>
            </div>

            <!-- Content Area -->
            <div class="min-h-[380px] flex flex-col justify-center quantum-card p-6 sm:p-10 relative">
                ${stepHtml}

                <!-- Feedback Banner for Exercises -->
                <div id="duo-feedback-banner" class="hidden mt-6 p-4 rounded-2xl flex items-center justify-between"></div>
            </div>

            <!-- Bottom Action Footer -->
            <div class="mt-6 flex items-center justify-between border-t border-slate-800 pt-6">
                <div>
                    ${this.currentStep > 0 && currentStepObj.type !== 'summary' ? `
                    <button onclick="window.currentDuolingoPlayer.prevStep()" class="btn-quantum-secondary px-5 py-2.5 rounded-xl text-xs sm:text-sm">
                        قبلی
                    </button>
                    ` : '<div></div>'}
                </div>

                <div>
                    ${currentStepObj.type === 'exercise' ? `
                    <button id="duo-check-btn" onclick="window.currentDuolingoPlayer.checkExercise()" 
                        class="btn-quantum-primary text-slate-950 font-black px-8 py-3 rounded-2xl text-xs sm:text-sm ${this.selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''}">
                        بررسی پاسخ
                    </button>
                    ` : currentStepObj.type === 'summary' ? `
                    <button onclick="window.currentDuolingoPlayer.finishLesson()" class="btn-quantum-primary text-slate-950 font-black px-8 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
                        <span>بازگشت به برنامه درسی</span>
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    </button>
                    ` : `
                    <button onclick="window.currentDuolingoPlayer.nextStep()" class="btn-quantum-primary text-slate-950 font-black px-8 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
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
                el.className = 'duo-option w-full p-4 rounded-2xl border text-right font-medium transition-all border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-lg shadow-cyan-500/20';
            } else {
                el.className = 'duo-option w-full p-4 rounded-2xl border text-right font-medium transition-all border-slate-800 hover:border-slate-700 bg-slate-900/80 text-slate-200';
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
                const gainedXp = res.xp_earned || 10;
                if (window.store && window.store.showXpToast) {
                    window.store.showXpToast(gainedXp, 'پاسخ صحیح به تمرین');
                }
                if (window.store && window.store.refreshUser) {
                    window.store.refreshUser();
                }
                banner.className = 'mt-6 p-4 rounded-2xl flex items-center justify-between bg-emerald-950/70 border border-emerald-500/50 text-emerald-200';
                banner.innerHTML = `
                    <div class="flex items-center gap-3">
                        <i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-400 shrink-0"></i>
                        <div>
                            <span class="font-bold block text-sm">عالی بود! پاسخ کاملاً صحیح است (+${gainedXp} XP)</span>
                            <span class="text-xs text-emerald-300/90">${res.explanation_fa || ''}</span>
                        </div>
                    </div>
                `;
            } else {
                window.store.playSound('incorrect');
                banner.className = 'mt-6 p-4 rounded-2xl flex items-center justify-between bg-rose-950/70 border border-rose-500/50 text-rose-200';
                banner.innerHTML = `
                    <div class="flex items-center gap-3">
                        <i data-lucide="alert-circle" class="w-6 h-6 text-rose-400 shrink-0"></i>
                        <div>
                            <span class="font-bold block text-sm">پاسخ نادرست بود؛ اما یادگیری در بازبینی اشتباه است!</span>
                            <span class="text-xs text-rose-300/90">${res.explanation_fa || 'دوباره به مفهوم درس مراجعه کنید.'}</span>
                        </div>
                    </div>
                `;
            }

            banner.classList.remove('hidden');
            if (checkBtn) {
                checkBtn.innerText = 'ادامه درس';
                checkBtn.onclick = () => this.nextStep();
            }

            if (window.lucide) window.lucide.createIcons();
            if (window.renderMathInPage) window.renderMathInPage(banner);
        } catch (e) {
            console.error('Error submitting exercise:', e);
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.selectedOption = null;
            this.isAnswerChecked = false;
            this.isCorrect = false;
            this.render();
            window.store.playSound('click');
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.selectedOption = null;
            this.isAnswerChecked = false;
            this.isCorrect = false;
            this.render();
            window.store.playSound('click');
        }
    }

    async finishLesson() {
        try {
            await window.api.completeLesson(this.lesson.id);
            if (window.store && window.store.showXpToast) {
                window.store.showXpToast(this.lesson.xp_reward || 25, 'تکمیل موفقیت‌آمیز درسنامه فیزیک');
            }
            if (window.store && window.store.refreshUser) {
                await window.store.refreshUser();
            }
        } catch (e) {
            console.warn('Lesson completion sync notice:', e);
        }
        window.store.setView('curriculum');
    }
}

window.DuolingoPlayer = DuolingoPlayer;
