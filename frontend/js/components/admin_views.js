/**
 * Administration Portal Component (CMS, Question Bank, Review Center, AI Config, Validation)
 */
class AdminViews {
    constructor(containerId) {
        this.containerId = containerId;
        this.activeTab = 'overview'; // 'overview', 'validation', 'questions', 'reviews', 'ai', 'textbooks', 'students'
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <!-- Admin Top Bar -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <div class="flex items-center gap-2 text-rose-600 font-bold text-xs mb-1">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                        <span>پنل مدیریت انجمن فیزیک شهید بهشتی دو دوره اول</span>
                    </div>
                    <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">پنل جامع مدیریت آموزشی</h1>
                </div>

                <!-- Admin Tabs Navigation (Responsive Horizontal Scroll on Mobile) -->
                <div class="flex items-center sm:flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold overflow-x-auto no-scrollbar w-full sm:w-auto">
                    <button onclick="window.currentAdminViews.switchTab('overview')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'overview' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        داشبورد
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('validation')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'validation' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        اعتبارسنجی سؤالات
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('questions')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'questions' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        بانک سؤالات
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('reviews')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'reviews' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        مرکز بازبینی و تصحیح
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('competitions')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'competitions' ? 'bg-white dark:bg-slate-900 text-cyan-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        مدیریت لیگ‌ها و مسابقات
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('ai')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'ai' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        تنظیمات هوش مصنوعی
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('textbooks')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'textbooks' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        کتاب‌ها و استخراج PDF
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('students')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'students' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}">
                        دانش‌آموزان
                    </button>
                </div>
            </div>

            <!-- Tab Content Container -->
            <div id="admin-tab-content">
                <div class="text-center py-12"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        this.loadTabContent();
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        this.render();
    }

    async loadTabContent() {
        const target = document.getElementById('admin-tab-content');
        if (!target) return;

        if (this.activeTab === 'overview') {
            const data = await window.api.getAdminOverview();
            target.innerHTML = `
            <div class="space-y-6">
                <!-- Stats Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span class="text-xs text-slate-400 font-bold block mb-1">دانش‌آموزان ثبت‌نامی</span>
                        <span class="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${data.total_students}</span>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span class="text-xs text-slate-400 font-bold block mb-1">کل پرسش‌های فعال</span>
                        <span class="text-3xl font-extrabold text-blue-600 font-mono">${data.total_questions}</span>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span class="text-xs text-slate-400 font-bold block mb-1">آزمون‌های برگزار شده</span>
                        <span class="text-3xl font-extrabold text-indigo-600 font-mono">${data.total_attempts}</span>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span class="text-xs text-slate-400 font-bold block mb-1">پاسخ‌های در صف بازبینی دبیر</span>
                        <span class="text-3xl font-extrabold text-amber-600 font-mono">${data.pending_written_reviews}</span>
                    </div>
                </div>

                <!-- Admin Quick Command Deck -->
                <div class="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-cyan-500/30 cyber-glow-cyan space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="terminal" class="w-5 h-5 text-cyan-400"></i>
                            <h3 class="text-sm font-extrabold text-white">مرکز فرماندهی و دسترسی‌های سریع مدیر (Admin Control Deck)</h3>
                        </div>
                        <span class="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">مدیریت انجمن فیزیک</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <button onclick="window.currentAdminViews.switchTab('competitions'); setTimeout(() => window.currentAdminViews.openCreateCompetitionModal(), 200)" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/30 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-cyan-300 group-hover:text-white">➕ ساخت مسابقه یا چالش</span>
                                <span class="text-[11px] text-slate-400">لیگ هفتگی، ماهانه یا سرعتی</span>
                            </div>
                            <i data-lucide="trophy" class="w-5 h-5 text-cyan-400"></i>
                        </button>
                        <button onclick="window.currentAdminViews.switchTab('competitions')" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-violet-500/30 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-violet-300 group-hover:text-white">⚖️ داوری پاسخ‌های مسابقات</span>
                                <span class="text-[11px] text-slate-400">بررسی، نمره‌دهی و بازخورد</span>
                            </div>
                            <i data-lucide="clipboard-check" class="w-5 h-5 text-violet-400"></i>
                        </button>
                        <button onclick="window.currentAdminViews.switchTab('ai')" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-emerald-500/30 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-emerald-300 group-hover:text-white">⚡ پایش هوش مصنوعی نکسورا</span>
                                <span class="text-[11px] text-slate-400">تست تاخیر و مدل‌های آزاد</span>
                            </div>
                            <i data-lucide="cpu" class="w-5 h-5 text-emerald-400"></i>
                        </button>
                        <button onclick="window.currentAdminViews.switchTab('questions')" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/30 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-amber-300 group-hover:text-white">📚 بانک سؤالات و تولید AI</span>
                                <span class="text-[11px] text-slate-400">مدیریت ۱,۴۰۸ سؤال فعال</span>
                            </div>
                            <i data-lucide="help-circle" class="w-5 h-5 text-amber-400"></i>
                        </button>
                    </div>
                </div>

                <!-- Recent Activity Logs -->
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 class="font-bold text-base text-slate-800 dark:text-white">رویدادها و گزارش‌های امنیتی اخیر (Audit Logs)</h3>
                    <div class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${data.recent_logs.map(l => `
                        <div class="py-3 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">${l.action}</span>
                                <span class="text-slate-600 dark:text-slate-300">موجودیت: ${l.target_entity} (شناسه: ${l.target_id || '-'})</span>
                            </div>
                            <span class="text-slate-400 font-mono">${window.formatPersianTime(l.created_at)}</span>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            `;
        } else if (this.activeTab === 'validation') {
            const reports = await window.api.getValidationReport();
            const allPassed = reports.every(r => r.is_fully_compliant);

            target.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h2 class="text-lg font-bold text-slate-800 dark:text-white">گزارش خودکار انطباق محتوای آموزشی و بانک سؤالات</h2>
                        <p class="text-xs text-slate-500">بررسی حد نصاب الزامی: حداقل ۲۰ سؤال چهارگزینه‌ای معتبر و ۱۰ سؤال تشریحی بارم‌بندی‌شده به ازای تک‌تک فصل‌ها</p>
                    </div>
                    <div class="px-4 py-2 rounded-xl text-xs font-bold ${allPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
                        ${allPassed ? 'تأیید کامل تمامی ۱۲ فصل (PASS)' : 'عدم انطباق برخی فصول'}
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                                <th class="p-3">پایه</th>
                                <th class="p-3">فصل</th>
                                <th class="p-3">عنوان فصل فیزیک</th>
                                <th class="p-3 text-center">چهارگزینه‌ای (حداقل ۲۰)</th>
                                <th class="p-3 text-center">تشریحی (حداقل ۱۰)</th>
                                <th class="p-3 text-center">وضعیت انطباق</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                            ${reports.map(r => `
                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td class="p-3 font-bold">پایه ${r.grade_number}</td>
                                <td class="p-3">فصل ${r.chapter_number}</td>
                                <td class="p-3 font-bold">${r.chapter_title_fa}</td>
                                <td class="p-3 text-center font-mono font-bold ${r.actual_valid_mcq_count >= 20 ? 'text-emerald-600' : 'text-rose-600'}">
                                    ${r.actual_valid_mcq_count} / ۲۰
                                </td>
                                <td class="p-3 text-center font-mono font-bold ${r.actual_valid_written_count >= 10 ? 'text-emerald-600' : 'text-rose-600'}">
                                    ${r.actual_valid_written_count} / ۱۰
                                </td>
                                <td class="p-3 text-center">
                                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${r.is_fully_compliant ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                                        <i data-lucide="${r.is_fully_compliant ? 'check' : 'x'}" class="w-3.5 h-3.5"></i>
                                        ${r.is_fully_compliant ? 'تأیید شد' : 'ناقص'}
                                    </span>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `;
        } else if (this.activeTab === 'questions') {
            const data = await window.api.getQuestions({ limit: 50 });
            target.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="font-bold text-base text-slate-800 dark:text-white">فهرست و جستجوی بانک سؤالات (${data.total} پرسش ثبت شده)</h3>
                </div>

                <div class="space-y-3">
                    ${data.questions.map(q => `
                    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded font-bold text-[11px] ${q.question_type === 'mcq' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">
                                    ${q.question_type === 'mcq' ? 'تستی' : 'تشریحی'}
                                </span>
                                <span class="text-slate-500 font-semibold">${q.chapter_title_fa} (پایه ${q.grade_number})</span>
                            </div>
                            <span class="text-slate-400 font-mono text-[11px]">${q.points} نمره</span>
                        </div>
                        <p class="text-xs font-semibold text-slate-800 dark:text-white leading-relaxed">${q.prompt_fa}</p>
                        ${q.source_ref ? `<span class="text-[11px] text-slate-400 block">مرجع: ${q.source_ref}</span>` : ''}
                    </div>
                    `).join('')}
                </div>
            </div>
            `;
        } else if (this.activeTab === 'reviews') {
            const queue = await window.api.getWrittenQueue();
            target.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                    <h3 class="font-bold text-base text-slate-800 dark:text-white">صف بازبینی و تصحیح نمرات تشریحی توسط دبیر</h3>
                    <p class="text-xs text-slate-500 mt-1">مشاهده پیشنهاد هوش مصنوعی، تأیید یا ویرایش نمره با ثبت در دفترچه ممیزی (Audit)</p>
                </div>

                <div class="space-y-4">
                    ${queue.length === 0 ? '<p class="text-xs text-slate-400 py-6 text-center">هیچ پاسخی در صف بازبینی نیست.</p>' : queue.map(item => `
                    <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-slate-700 dark:text-slate-200">${item.student_name} • ${item.exam_title_fa}</span>
                            <span class="px-2.5 py-1 rounded-full font-bold ${item.review_status === 'pending_review' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">
                                وضعیت: ${item.review_status === 'pending_review' ? 'نیازمند بررسی دبیر' : 'تأیید شده'}
                            </span>
                        </div>

                        <div class="text-xs space-y-1">
                            <div class="font-bold text-slate-800 dark:text-white">سؤال: ${item.question_prompt_fa}</div>
                            <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span class="font-bold block mb-1">پاسخ دانش‌آموز:</span>
                                ${item.student_response_text || 'بدون پاسخ'}
                            </div>
                            <div class="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">
                                <span class="font-bold block mb-1">پاسخ مرجع کتاب درسی:</span>
                                ${item.reference_answer_fa}
                            </div>
                        </div>

                        <div class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                            <div class="font-bold text-slate-700 dark:text-slate-200">
                                نمره پیشنهادی هوش مصنوعی: <span class="font-mono text-blue-600">${item.ai_score}</span> از ${item.max_score}
                            </div>
                            <button onclick="window.currentAdminViews.openOverrideModal(${item.student_answer_id}, ${item.final_score}, ${item.max_score})" class="btn-duo-blue text-white font-bold px-4 py-1.5 rounded-xl text-xs">
                                ویرایش و اعمال نظر دبیر
                            </button>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            `;
        } else if (this.activeTab === 'ai') {
            const aiConf = await window.api.getAiConfig();
            target.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-2xl">
                <div>
                    <h3 class="font-bold text-lg text-slate-800 dark:text-white">پیکربندی ارائه‌دهنده هوش مصنوعی (AI Provider)</h3>
                    <p class="text-xs text-slate-500 mt-1">پشتیبانی مستقل از انواع ارائه‌دهندگان (OpenAI, DeepSeek, OpenRouter, Ollama و Mock آزمایشی)</p>
                </div>

                <form onsubmit="window.currentAdminViews.saveAiConfig(event)" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 mb-1">نوع ارائه‌دهنده (Provider):</label>
                        <select id="ai-provider" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                            <option value="mock" ${aiConf.provider_name === 'mock' ? 'selected' : ''}>شبیه‌ساز داخلی (Mock - بدون نیاز به اینترنت و کلید)</option>
                            <option value="openai" ${aiConf.provider_name === 'openai' ? 'selected' : ''}>OpenAI (سازگار با ChatGPT)</option>
                            <option value="openrouter" ${aiConf.provider_name === 'openrouter' ? 'selected' : ''}>OpenRouter (دسترسی به تمام مدل‌ها)</option>
                            <option value="deepseek" ${aiConf.provider_name === 'deepseek' ? 'selected' : ''}>DeepSeek API</option>
                            <option value="ollama" ${aiConf.provider_name === 'ollama' ? 'selected' : ''}>Ollama (مدل محلی روی سرور)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 mb-1">نشانی پایه API (Base URL):</label>
                        <input type="text" id="ai-base-url" value="${aiConf.base_url}" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                    </div>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 mb-1">شناسه مدل عمومی (Default Model Name):</label>
                        <input type="text" id="ai-model-name" value="${aiConf.model_name}" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                    </div>

                    <!-- Task Specific Model Routing -->
                    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                        <span class="text-xs font-bold text-violet-600 dark:text-violet-400 block">مسیریابی وظیفه‌محور مدل‌ها (Task-Specific Model Routing)</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-slate-500 text-[11px] mb-1">مدل معلم هوشمند (Tutoring):</label>
                                <input type="text" id="ai-tutoring-model" value="${aiConf.tutoring_model || aiConf.model_name}" class="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs" />
                            </div>
                            <div>
                                <label class="block text-slate-500 text-[11px] mb-1">مدل تصحیح تشریحی (Grading):</label>
                                <input type="text" id="ai-grading-model" value="${aiConf.grading_model || aiConf.model_name}" class="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs" />
                            </div>
                            <div>
                                <label class="block text-slate-500 text-[11px] mb-1">مدل تولید سؤال (Generation):</label>
                                <input type="text" id="ai-generation-model" value="${aiConf.generation_model || aiConf.model_name}" class="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs" />
                            </div>
                            <div>
                                <label class="block text-slate-500 text-[11px] mb-1">مدل تحلیل اشتباهات (Explanation):</label>
                                <input type="text" id="ai-explanation-model" value="${aiConf.explanation_model || aiConf.model_name}" class="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 mb-1">کلید دسترسی (API Key) - نگهداری امن در سرور:</label>
                        <input type="password" id="ai-api-key" placeholder="${aiConf.api_key_masked}" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                    </div>

                    <div class="flex items-center gap-3 pt-4">
                        <button type="submit" class="btn-duo-green text-white font-bold px-6 py-2.5 rounded-xl shadow-sm">
                            ذخیره تنظیمات
                        </button>
                        <button type="button" onclick="window.currentAdminViews.runAiConnectionTest()" class="btn-duo-blue text-white font-bold px-6 py-2.5 rounded-xl shadow-sm">
                            تست اتصال زنده
                        </button>
                    </div>
                </form>

                <div id="ai-test-result" class="hidden p-4 rounded-2xl text-xs font-semibold"></div>
            </div>
            `;
        } else if (this.activeTab === 'textbooks') {
            const grades = await window.api.getGrades();
            let allBooks = [];
            for (let g of grades) {
                const bks = await window.api.getBooks(g.id);
                allBooks = allBooks.concat(bks);
            }

            target.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                    <h3 class="font-bold text-base text-slate-800 dark:text-white">مدیریت کتاب‌های درسی و بارگذاری دستی PDF</h3>
                    <p class="text-xs text-slate-500 mt-1">وضعیت پردازش ۶ منبع رسمی و سمپاد، استخراج خودکار سرفصل‌ها و آپلود جایگزین</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${allBooks.map(b => `
                    <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-slate-800 dark:text-white">${b.title_fa}</span>
                            <span class="px-2 py-0.5 rounded-full font-bold ${b.source_status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                ${b.source_status === 'completed' ? 'پردازش شده' : 'در انتظار'}
                            </span>
                        </div>
                        <div class="text-[11px] text-slate-400 space-y-1">
                            <div>کد منبع: <span class="font-mono">${b.code}</span></div>
                            <div>تعداد صفحات: ${b.page_count} صفحه</div>
                            <div>ناشر: ${b.publisher_fa}</div>
                        </div>

                        <!-- Manual PDF Upload Form -->
                        <form onsubmit="window.currentAdminViews.uploadManualPdf(event, ${b.id})" class="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                            <input type="file" name="pdf_file" accept=".pdf" required class="text-xs text-slate-400 file:px-2 file:py-1 file:rounded-lg file:border-0 file:bg-slate-200 file:text-xs" />
                            <button type="submit" class="btn-duo-blue text-white px-3 py-1 rounded-lg text-xs font-bold">
                                آپلود PDF
                            </button>
                        </form>
                    </div>
                    `).join('')}
                </div>
            </div>
            `;
        } else if (this.activeTab === 'competitions') {
            await this.renderCompetitionsManagement(target);
        } else if (this.activeTab === 'students') {
            const students = await window.api.getStudents();
            target.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <h3 class="font-bold text-base text-slate-800 dark:text-white">مدیریت حساب‌های کاربری دانش‌آموزان</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                                <th class="p-3">نام و نام خانوادگی</th>
                                <th class="p-3">نام کاربری</th>
                                <th class="p-3">پایه تحصیلی</th>
                                <th class="p-3">امتیاز (XP)</th>
                                <th class="p-3">استمرار (روز)</th>
                                <th class="p-3">وضعیت</th>
                                <th class="p-3 text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            ${students.map(s => `
                            <tr>
                                <td class="p-3 font-bold text-slate-800 dark:text-white">${s.full_name}</td>
                                <td class="p-3 font-mono text-slate-500">${s.username}</td>
                                <td class="p-3">${s.grade_title_fa}</td>
                                <td class="p-3 font-mono font-bold text-blue-600">${s.total_xp}</td>
                                <td class="p-3 font-mono text-orange-500">${s.streak}</td>
                                <td class="p-3">
                                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${s.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
                                        ${s.is_active ? 'فعال' : 'مسدود'}
                                    </span>
                                </td>
                                <td class="p-3 text-center">
                                    <button onclick="window.currentAdminViews.toggleStudent(${s.id})" class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600">
                                        ${s.is_active ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                                    </button>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    openOverrideModal(answerId, currentScore, maxScore) {
        const modal = document.createElement('div');
        modal.id = 'override-score-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 class="font-bold text-base text-slate-800 dark:text-white">ویرایش نمره پاسخ تشریحی</h3>
            <form onsubmit="window.currentAdminViews.submitOverride(event, ${answerId})" class="space-y-4 text-xs font-semibold">
                <div>
                    <label class="block text-slate-600 dark:text-slate-300 mb-1">نمره جدید (حداکثر ${maxScore}):</label>
                    <input type="number" step="0.25" min="0" max="${maxScore}" id="override-new-score" value="${currentScore}" required
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                </div>
                <div>
                    <label class="block text-slate-600 dark:text-slate-300 mb-1">دلیل تغییر نمره (جهت ثبت در دفترچه ممیزی):</label>
                    <textarea id="override-reason" rows="3" required placeholder="توضیح دلیل اصلاح نمره..."
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"></textarea>
                </div>
                <div class="flex items-center justify-end gap-2 pt-2">
                    <button type="button" onclick="document.getElementById('override-score-modal').remove()" class="px-4 py-2 rounded-xl text-slate-500">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-green text-white font-bold px-6 py-2 rounded-xl">
                        ثبت تغییر نمره
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
    }

    async submitOverride(e, answerId) {
        e.preventDefault();
        const score = parseFloat(document.getElementById('override-new-score').value);
        const reason = document.getElementById('override-reason').value.trim();

        try {
            await window.api.overrideGrade(answerId, score, reason);
            alert('نمره با موفقیت اصلاح شد.');
            document.getElementById('override-score-modal').remove();
            this.loadTabContent();
        } catch (err) {
            alert(err.message);
        }
    }

    async saveAiConfig(e) {
        e.preventDefault();
        const payload = {
            provider_name: document.getElementById('ai-provider').value,
            base_url: document.getElementById('ai-base-url').value,
            model_name: document.getElementById('ai-model-name').value,
            tutoring_model: document.getElementById('ai-tutoring-model')?.value || document.getElementById('ai-model-name').value,
            grading_model: document.getElementById('ai-grading-model')?.value || document.getElementById('ai-model-name').value,
            generation_model: document.getElementById('ai-generation-model')?.value || document.getElementById('ai-model-name').value,
            explanation_model: document.getElementById('ai-explanation-model')?.value || document.getElementById('ai-model-name').value,
            api_key: document.getElementById('ai-api-key').value,
            timeout_seconds: 45,
            max_retries: 2
        };

        try {
            await window.api.updateAiConfig(payload);
            alert('تنظیمات هوش مصنوعی با موفقیت ذخیره شد.');
        } catch (err) {
            alert(err.message);
        }
    }

    async runAiConnectionTest() {
        const box = document.getElementById('ai-test-result');
        box.className = 'p-4 rounded-2xl text-xs font-semibold bg-slate-100 text-slate-600 block';
        box.innerText = 'در حال برقراری ارتباط آزمایشی با سرویس هوش مصنوعی...';

        try {
            const res = await window.api.testAiConnection();
            if (res.success) {
                box.className = 'p-4 rounded-2xl text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 block';
                box.innerHTML = `✓ ${res.message_fa} (زمان پاسخ: ${res.latency_ms} میلی‌ثانیه)`;
            } else {
                box.className = 'p-4 rounded-2xl text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 block';
                box.innerHTML = `✕ ${res.message_fa}`;
            }
        } catch (err) {
            box.className = 'p-4 rounded-2xl text-xs font-semibold bg-rose-100 text-rose-800 block';
            box.innerText = err.message;
        }
    }

    async toggleStudent(userId) {
        if (!confirm('آیا از تغییر وضعیت این کاربر اطمینان دارید؟')) return;
        try {
            await window.api.toggleStudentStatus(userId);
            this.loadTabContent();
        } catch (err) {
            alert(err.message);
        }
    }

    async uploadManualPdf(e, bookId) {
        e.preventDefault();
        const form = e.target;
        const fileInput = form.querySelector('input[type="file"]');
        if (!fileInput.files[0]) return;

        const formData = new FormData();
        formData.append('book_id', bookId);
        formData.append('file', fileInput.files[0]);

        try {
            const res = await window.api.uploadTextbook(formData);
            alert(res.message_fa);
            this.loadTabContent();
        } catch (err) {
            alert(err.message);
        }
    }
    async renderCompetitionsManagement(target) {
        const comps = await window.api.getCompetitions().catch(() => []);

        target.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                    <h3 class="font-extrabold text-lg text-slate-800 dark:text-white">مدیریت مسابقات و لیگ‌های کوانتومی</h3>
                    <p class="text-xs text-slate-400 mt-1">تعریف مراحل لیگ هفتگی، جام‌های ماهانه، تعیین زمان آزمون، نمره منفی و تصحیح پاسخ‌ها</p>
                </div>
                <button onclick="window.currentAdminViews.openCreateCompetitionModal()" class="btn-duo-green text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    <span>تعریف مسابقه / مرحله جدید</span>
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-right text-xs">
                    <thead>
                        <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                            <th class="p-3">عنوان رقابت</th>
                            <th class="p-3">نوع لیگ</th>
                            <th class="p-3">پایه</th>
                            <th class="p-3">مدت (دقیقه)</th>
                            <th class="p-3">نمره منفی</th>
                            <th class="p-3">شرکت‌کننده</th>
                            <th class="p-3">وضعیت</th>
                            <th class="p-3 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${comps.length === 0 ? `
                        <tr><td colspan="8" class="p-6 text-center text-slate-400">هنوز مسابقه‌ای ثبت نشده است. با دکمه بالا اولین مسابقه را ایجاد نمایید.</td></tr>
                        ` : comps.map(c => `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td class="p-3 font-bold text-slate-800 dark:text-white">${c.title_fa}</td>
                            <td class="p-3">
                                <span class="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${c.league_type === 'monthly' ? 'bg-fuchsia-950/60 text-fuchsia-300' : 'bg-cyan-950/60 text-cyan-300'}">
                                    ${c.league_type === 'monthly' ? 'جام ماهانه' : (c.league_type === 'speed_cup' ? 'جام سرعت' : 'لیگ هفتگی')}
                                </span>
                            </td>
                            <td class="p-3 text-slate-500">${c.grade_title_fa}</td>
                            <td class="p-3 font-mono">${c.duration_minutes || 45} دقیقه</td>
                            <td class="p-3 font-mono">${c.has_negative_marking ? 'دارد (۳۳٪)' : 'ندارد'}</td>
                            <td class="p-3 font-mono font-bold text-cyan-500">${c.participant_count}</td>
                            <td class="p-3">
                                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${c.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : (c.is_closed ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300')}">
                                    ${c.is_active ? 'فعال' : (c.is_closed ? 'پایان یافته' : 'در انتظار')}
                                </span>
                            </td>
                            <td class="p-3 text-center">
                                <div class="flex items-center justify-center gap-1.5 flex-wrap">
                                    <button onclick="window.currentAdminViews.openSubmissionsModal(${c.id})" 
                                        class="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold hover:scale-105 transition-all">
                                        پاسخ‌نامه‌ها (${c.participant_count})
                                    </button>
                                    <button onclick="window.currentAdminViews.openPublishSolutionModal(${c.id})" 
                                        title="ثبت یا ویرایش راهنمای حل تشریحی رسمی برای داوطلبان"
                                        class="px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-900 transition-all">
                                        ${c.solutions_published ? '✓ پاسخ منتشر شده' : '🔑 انتشار پاسخ رسمی'}
                                    </button>
                                    <button onclick="window.currentAdminViews.toggleCompetitionClosed(${c.id}, ${c.is_closed})" 
                                        class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:text-amber-500">
                                        ${c.is_closed ? 'بازگشایی' : 'بستن'}
                                    </button>
                                    <button onclick="window.currentAdminViews.deleteCompetition(${c.id})" 
                                        class="px-2 py-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-bold">
                                        حذف
                                    </button>
                                </div>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    }

    async openCreateCompetitionModal() {
        const modal = document.createElement('div');
        modal.id = 'admin-create-comp-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md';

        modal.innerHTML = `
        <div class="bg-slate-900 border border-cyan-500/40 cyber-glow-cyan w-full max-w-xl rounded-3xl p-6 sm:p-8 text-white space-y-5 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <i data-lucide="trophy" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-base text-white">تعریف مرحله جدید در لیگ کوانتومی</h3>
                        <span class="text-[10px] text-cyan-400 font-sans">Quantum League Engine</span>
                    </div>
                </div>
                <button onclick="document.getElementById('admin-create-comp-modal').remove()" class="p-1.5 text-slate-400 hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Quick Preset Buttons -->
            <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-cyan-500/30 space-y-2">
                <span class="text-[11px] text-cyan-300 font-bold block">⚡ قالب‌های آماده برای ایجاد سریع رقابت:</span>
                <div class="flex flex-wrap gap-1.5">
                    <button type="button" onclick="window.applyCompPreset('weekly_7')" class="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">لیگ هفتگی پایه ۷</button>
                    <button type="button" onclick="window.applyCompPreset('weekly_8')" class="px-2.5 py-1 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 text-[10px] font-bold">لیگ هفتگی پایه ۸</button>
                    <button type="button" onclick="window.applyCompPreset('weekly_9')" class="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold">لیگ هفتگی پایه ۹</button>
                    <button type="button" onclick="window.applyCompPreset('speed_cup')" class="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-[10px] font-bold">⏱️ جام سرعت فوتونی</button>
                    <button type="button" onclick="window.applyCompPreset('sampad_olympiad')" class="px-2.5 py-1 rounded-lg bg-fuchsia-950/80 hover:bg-fuchsia-900 border border-fuchsia-500/40 text-fuchsia-300 text-[10px] font-bold">🔬 المپیاد سمپاد (پلاسما)</button>
                </div>
            </div>

            <form onsubmit="window.currentAdminViews.handleCreateCompetitionSubmit(event)" class="space-y-4 text-xs font-semibold">
                <div>
                    <label class="block text-slate-300 mb-1">عنوان مسابقه / مرحله لیگ:</label>
                    <input type="text" name="title_fa" required placeholder="مثال: مرحله سوم لیگ فیزیک هشتم — مبحث الکتریسیته"
                        class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-400" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-300 mb-1">نوع لیگ:</label>
                        <select name="league_type" class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-400">
                            <option value="weekly">لیگ هفتگی (Weekly League)</option>
                            <option value="monthly">جام ماهانه (Monthly Masters)</option>
                            <option value="speed_cup">جام سرعت (Speed Cup)</option>
                            <option value="challenge">چالش زمان‌دار سفارشی استاد</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-300 mb-1">پایه هدف:</label>
                        <select name="grade_id" class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-400">
                            <option value="">تمامی پایه‌ها (عمومی)</option>
                            <option value="1">پایه هفتم</option>
                            <option value="2">پایه هشتم</option>
                            <option value="3">پایه نهم</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="block text-slate-300 mb-1">مدت زمان (دقیقه):</label>
                        <input type="number" name="duration_minutes" value="45" min="5" max="180" required
                            class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-400 font-mono" />
                    </div>
                    <div>
                        <label class="block text-slate-300 mb-1">تعداد سؤالات:</label>
                        <input type="number" name="question_count" value="10" min="5" max="40" required
                            class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-400 font-mono" />
                    </div>
                    <div>
                        <label class="block text-slate-300 mb-1">سطح دشواری (Tier):</label>
                        <select name="league_tier" class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-400">
                            <option value="quantum">کوانتوم (پیشرفته)</option>
                            <option value="photon">فوتون (متوسط)</option>
                            <option value="plasma">پلاسما (المپیادی)</option>
                        </select>
                    </div>
                </div>

                <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div>
                        <span class="block text-slate-200 font-bold">اعمال نمره منفی در آزمون</span>
                        <span class="text-[11px] text-slate-400">کسر یک‌سوم نمره به ازای هر پاسخ تستی نادرست</span>
                    </div>
                    <input type="checkbox" name="has_negative_marking" value="true" class="w-4 h-4 text-cyan-400 rounded focus:ring-cyan-500" />
                </div>

                <div>
                    <label class="block text-slate-300 mb-1">توضیحات و راهنمای شرکت در مسابقه:</label>
                    <textarea name="description_fa" rows="2" placeholder="سرفصل‌ها و نکات قابل توجه برای دانش‌آموزان..."
                        class="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-400"></textarea>
                </div>

                <div class="pt-2 flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('admin-create-comp-modal').remove()" 
                        class="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-green text-white font-bold px-6 py-2.5 rounded-xl shadow-md">
                        ایجاد و فعال‌سازی رقابت
                    </button>
                </div>
            </form>
        </div>
        `;

        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async handleCreateCompetitionSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const payload = {
            title_fa: formData.get('title_fa'),
            description_fa: formData.get('description_fa'),
            league_type: formData.get('league_type'),
            league_tier: formData.get('league_tier'),
            grade_id: formData.get('grade_id') ? parseInt(formData.get('grade_id')) : null,
            duration_minutes: parseInt(formData.get('duration_minutes') || 45),
            question_count: parseInt(formData.get('question_count') || 10),
            has_negative_marking: formData.get('has_negative_marking') === 'true',
            negative_ratio: 0.33
        };

        try {
            const res = await window.api.adminCreateCompetition(payload);
            alert(res.message_fa);
            const m = document.getElementById('admin-create-comp-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert(err.message);
        }
    }

    async openSubmissionsModal(compId) {
        try {
            const data = await window.api.adminGetCompetitionSubmissions(compId);
            const modal = document.createElement('div');
            modal.id = 'admin-submissions-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md';

            modal.innerHTML = `
            <div class="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 sm:p-8 text-white space-y-5 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <h3 class="font-black text-lg text-white">پاسخ‌نامه‌های ثبت‌شده: ${data.title_fa}</h3>
                        <span class="text-xs text-slate-400">مجموع ارسال‌ها: ${data.total_submissions} دانش‌آموز</span>
                    </div>
                    <button onclick="document.getElementById('admin-submissions-modal').remove()" class="p-1.5 text-slate-400 hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <div class="divide-y divide-slate-800">
                    ${data.submissions.length === 0 ? `
                    <p class="py-8 text-center text-slate-400 text-xs">هیچ پاسخی برای این مسابقه ارسال نشده است.</p>
                    ` : data.submissions.map(s => `
                    <div class="py-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="font-bold text-white text-sm">${s.full_name} (${s.display_name})</span>
                                <span class="text-xs text-slate-400 block">${s.grade_title_fa} • زمان: ${s.time_spent_seconds || 0} ثانیه</span>
                            </div>
                            <div class="text-left font-mono">
                                <span class="text-base font-black text-cyan-400">${s.score} نمره</span>
                                <span class="text-[11px] text-slate-400 block">${s.status === 'reviewed' ? 'تایید استاد' : 'تصحیح خودکار'}</span>
                            </div>
                        </div>

                        <!-- Manual Teacher Override Form -->
                        <form onsubmit="window.currentAdminViews.handleGradeSubmissionSubmit(event, ${data.competition_id}, ${s.submission_id})" 
                            class="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-wrap items-center gap-3 text-xs">
                            <div class="flex items-center gap-1.5">
                                <label class="text-slate-300">نمره نهایی:</label>
                                <input type="number" step="0.5" name="score" value="${s.score}" required
                                    class="w-20 p-2 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-center outline-none focus:border-cyan-400" />
                            </div>
                            <div class="flex-1 min-w-[200px]">
                                <input type="text" name="feedback" value="${s.feedback_fa || ''}" placeholder="بازخورد تشریحی دبیر برای دانش‌آموز..."
                                    class="w-full p-2 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:border-cyan-400" />
                            </div>
                            <button type="submit" class="btn-duo-green text-white font-bold px-4 py-2 rounded-xl text-xs">
                                ثبت نمره و بازخورد
                            </button>
                        </form>
                    </div>
                    `).join('')}
                </div>
            </div>
            `;

            document.body.appendChild(modal);
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            alert(err.message);
        }
    }

    async handleGradeSubmissionSubmit(e, compId, subId) {
        e.preventDefault();
        const form = e.target;
        const score = parseFloat(form.querySelector('input[name="score"]').value);
        const feedback = form.querySelector('input[name="feedback"]').value;

        try {
            const res = await window.api.adminGradeCompetitionSubmission(compId, subId, score, feedback);
            alert(res.message_fa);
        } catch (err) {
            alert(err.message);
        }
    }

    async openPublishSolutionModal(compId) {
        const solutionText = prompt('متن راهنمای حل تشریحی و کلید نهایی طراح سؤال را جهت انتشار وارد کنید:');
        if (!solutionText) return;
        try {
            await window.api.adminUpdateCompetition(compId, {
                solutions_published: true,
                official_solution_fa: solutionText
            });
            alert('پاسخ تشریحی رسمی با موفقیت منتشر گردید و برای دانش‌آموزان در دسترس قرار گرفت.');
            this.loadTabContent();
        } catch (err) {
            alert(err.message);
        }
    }

    async toggleCompetitionClosed(compId, currentlyClosed) {
        if (!confirm(`آیا از ${currentlyClosed ? 'بازگشایی مجدد' : 'بستن مهلت'} این مسابقه اطمینان دارید؟`)) return;
        try {
            await window.api.adminUpdateCompetition(compId, { is_closed: !currentlyClosed });
            this.loadTabContent();
        } catch (err) {
            alert(err.message);
        }
    }

    async deleteCompetition(compId) {
        if (!confirm('آیا از حذف کامل این رقابت اطمینان دارید؟')) return;
        try {
            await window.api.adminDeleteCompetition(compId);
            this.loadTabContent();
        } catch (err) {
            alert(err.message);
        }
    }
}

window.applyCompPreset = function(preset) {
    const modal = document.getElementById('admin-create-comp-modal');
    if (!modal) return;
    const form = modal.querySelector('form');
    if (!form) return;

    if (preset === 'weekly_7') {
        if (form.title_fa) form.title_fa.value = 'لیگ هفتگی فیزیک هفتم — انرژی، دماسنجی و گرما';
        if (form.league_type) form.league_type.value = 'weekly';
        if (form.grade_id) form.grade_id.value = '1';
        if (form.duration_minutes) form.duration_minutes.value = 40;
        if (form.question_count) form.question_count.value = 10;
        if (form.league_tier) form.league_tier.value = 'quantum';
        if (form.has_negative_marking) form.has_negative_marking.checked = true;
        if (form.description_fa) form.description_fa.value = 'مسابقه استاندارد فیزیک پایه هفتم شامل پایستگی انرژی، انرژی جنبشی، تبدیل یکاهای دما و گرما.';
    } else if (preset === 'weekly_8') {
        if (form.title_fa) form.title_fa.value = 'لیگ هفتگی فیزیک هشتم — مبحث الکتریسیته و مغناطیس';
        if (form.league_type) form.league_type.value = 'weekly';
        if (form.grade_id) form.grade_id.value = '2';
        if (form.duration_minutes) form.duration_minutes.value = 45;
        if (form.question_count) form.question_count.value = 10;
        if (form.league_tier) form.league_tier.value = 'quantum';
        if (form.has_negative_marking) form.has_negative_marking.checked = true;
        if (form.description_fa) form.description_fa.value = 'سؤالات تستی و تشریحی مفهوم بار الکتریکی، مدار الکتریکی، قانون اهم و میدان‌های مغناطیسی.';
    } else if (preset === 'weekly_9') {
        if (form.title_fa) form.title_fa.value = 'لیگ هفتگی فیزیک نهم — قوانین نیوتون، نیرو و فشار';
        if (form.league_type) form.league_type.value = 'weekly';
        if (form.grade_id) form.grade_id.value = '3';
        if (form.duration_minutes) form.duration_minutes.value = 45;
        if (form.question_count) form.question_count.value = 12;
        if (form.league_tier) form.league_tier.value = 'plasma';
        if (form.has_negative_marking) form.has_negative_marking.checked = true;
        if (form.description_fa) form.description_fa.value = 'تحلیل دینامیکی حرکت، اصطکاک، فشار در شاره‌ها و بالابر هیدرولیکی.';
    } else if (preset === 'speed_cup') {
        if (form.title_fa) form.title_fa.value = 'جام سرعت فوتون — ماراتن سریع روابط و محاسبات فیزیک';
        if (form.league_type) form.league_type.value = 'speed_cup';
        if (form.grade_id) form.grade_id.value = '';
        if (form.duration_minutes) form.duration_minutes.value = 15;
        if (form.question_count) form.question_count.value = 8;
        if (form.league_tier) form.league_tier.value = 'photon';
        if (form.has_negative_marking) form.has_negative_marking.checked = false;
        if (form.description_fa) form.description_fa.value = 'آزمون سرعتی جهت سنجش تسلط فوری بر روابط فیزیکی؛ زمان ثبت سریع‌تر باعث رتبه بالاتر می‌شود.';
    } else if (preset === 'sampad_olympiad') {
        if (form.title_fa) form.title_fa.value = 'المپیاد کوانتوم پلاسما — چالش استعدادهای درخشان (سمپاد)';
        if (form.league_type) form.league_type.value = 'monthly';
        if (form.grade_id) form.grade_id.value = '';
        if (form.duration_minutes) form.duration_minutes.value = 75;
        if (form.question_count) form.question_count.value = 15;
        if (form.league_tier) form.league_tier.value = 'plasma';
        if (form.has_negative_marking) form.has_negative_marking.checked = true;
        if (form.description_fa) form.description_fa.value = 'مسائل سطح بالا و المپیادی ترکیبی، منطبق با سرفصل‌های علوم تکمیلی سمپاد.';
    }
};

window.AdminViews = AdminViews;
