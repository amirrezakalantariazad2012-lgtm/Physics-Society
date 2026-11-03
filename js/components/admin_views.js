/**
 * Administration Portal Component (CMS, Question Bank, Review Center, AI Config, Validation)
 */
class AdminViews {
    constructor(containerId) {
        this.containerId = containerId;
        this.activeTab = 'overview'; // 'overview', 'curriculum', 'materials', 'validation', 'questions', 'reviews', 'competitions', 'ai', 'textbooks', 'students'
        this.curriculumGradeFilter = null;
        this.materialsGradeFilter = null;
        this.materialsCategoryFilter = null;
        this.studentGradeFilter = null;
        this.studentStatusFilter = null;
        this.studentSearchQuery = '';
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <!-- Admin Top Bar -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div>
                    <div class="flex items-center gap-2 text-rose-600 font-bold text-xs mb-1">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                        <span>پنل مدیریت انجمن فیزیک شهید بهشتی دو دوره اول</span>
                    </div>
                    <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">پنل جامع مدیریت آموزشی</h1>
                </div>

                <!-- Admin Tabs Navigation (Responsive Horizontal Scroll on Mobile) -->
                <div class="flex items-center sm:flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs font-bold overflow-x-auto no-scrollbar w-full sm:w-auto">
                    <button onclick="window.currentAdminViews.switchTab('overview')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'overview' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        داشبورد
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('curriculum')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'curriculum' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        سرفصل‌ها و درسنامه‌ساز
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('materials')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'materials' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        درسنامه‌ها و جزوات متفرقه
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('competitions')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'competitions' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        مدیریت لیگ‌ها و مسابقات
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('questions')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'questions' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        بانک سؤالات
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('reviews')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'reviews' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        مرکز بازبینی و تصحیح
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('validation')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'validation' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        اعتبارسنجی سؤالات
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('ai')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'ai' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        تنظیمات هوش مصنوعی
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('textbooks')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'textbooks' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
                        کتاب‌ها و استخراج PDF
                    </button>
                    <button onclick="window.currentAdminViews.switchTab('students')" class="shrink-0 px-3 py-2 rounded-xl transition-all ${this.activeTab === 'students' ? 'bg-sky-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
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
                    <div class="bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-xl">
                        <span class="text-xs text-slate-400 font-bold block mb-1">دانش‌آموزان ثبت‌نامی</span>
                        <span class="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">${data.total_students}</span>
                    </div>
                    <div class="bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-xl">
                        <span class="text-xs text-slate-400 font-bold block mb-1">کل پرسش‌های فعال</span>
                        <span class="text-3xl font-extrabold text-blue-600 font-mono">${data.total_questions}</span>
                    </div>
                    <div class="bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-xl">
                        <span class="text-xs text-slate-400 font-bold block mb-1">آزمون‌های برگزار شده</span>
                        <span class="text-3xl font-extrabold text-indigo-600 font-mono">${data.total_attempts}</span>
                    </div>
                    <div class="bg-slate-900/95 p-6 rounded-3xl border border-slate-800 shadow-xl">
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
                        <span class="text-[11px] px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-800/80 text-sky-300 font-sans font-medium">مدیریت انجمن فیزیک</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                        <button onclick="window.currentAdminViews.switchTab('curriculum'); setTimeout(() => window.currentAdminViews.openCreateChapterModal(), 200)" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-purple-500/40 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-purple-300 group-hover:text-white">📖 سرفصل‌ها و درسنامه‌ساز</span>
                                <span class="text-[11px] text-slate-400">طراحی فصول و دروس بدون کد</span>
                            </div>
                            <i data-lucide="book-plus" class="w-5 h-5 text-purple-400"></i>
                        </button>
                        <button onclick="window.currentAdminViews.switchTab('materials'); setTimeout(() => window.currentAdminViews.openCreateMaterialModal(), 200)" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-emerald-500/40 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-emerald-300 group-hover:text-white">📄 بارگذاری جزوه و درسنامه</span>
                                <span class="text-[11px] text-slate-400">بانک درسنامه‌های متفرقه</span>
                            </div>
                            <i data-lucide="file-plus" class="w-5 h-5 text-emerald-400"></i>
                        </button>
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
                        <button onclick="window.currentAdminViews.switchTab('ai')" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-teal-500/30 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-teal-300 group-hover:text-white">⚡ پایش هوش مصنوعی نکسورا</span>
                                <span class="text-[11px] text-slate-400">تست تاخیر و مدل‌های آزاد</span>
                            </div>
                            <i data-lucide="cpu" class="w-5 h-5 text-teal-400"></i>
                        </button>
                        <button onclick="window.currentAdminViews.switchTab('questions')" class="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/30 text-right flex items-center justify-between transition-all group">
                            <div>
                                <span class="block text-xs font-black text-amber-300 group-hover:text-white">📚 بانک سؤالات و طراحی نو</span>
                                <span class="text-[11px] text-slate-400">طراحی تستی و تشریحی</span>
                            </div>
                            <i data-lucide="help-circle" class="w-5 h-5 text-amber-400"></i>
                        </button>
                    </div>
                </div>

                <!-- Recent Activity Logs -->
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 class="font-bold text-base text-slate-800 dark:text-white">رویدادها و گزارش‌های امنیتی اخیر (Audit Logs)</h3>
                    <div class="divide-y divide-slate-100 dark:divide-slate-800">
                        ${(data.recent_logs && data.recent_logs.length > 0) ? data.recent_logs.map(l => `
                        <div class="py-3 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">${l.action}</span>
                                <span class="text-slate-600 dark:text-slate-300">موجودیت: ${l.target_entity} (شناسه: ${l.target_id || '-'})</span>
                            </div>
                            <span class="text-slate-400 font-mono">${window.formatPersianTime ? window.formatPersianTime(l.created_at) : (l.created_at || '-')}</span>
                        </div>
                        `).join('') : '<div class="py-4 text-center text-xs text-slate-400">هیچ رویداد جدیدی ثبت نشده است.</div>'}
                    </div>
                </div>
            </div>
            `;
        } else if (this.activeTab === 'validation') {
            const rawReports = await window.api.getValidationReport();
            const reports = Array.isArray(rawReports) ? rawReports : (rawReports && Array.isArray(rawReports.reports) ? rawReports.reports : []);
            const allPassed = reports.length > 0 && reports.every(r => r.is_fully_compliant);

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
                            ${reports.length === 0 ? `
                            <tr>
                                <td colspan="6" class="p-6 text-center text-slate-400">اطلاعات اعتبارسنجی در دسترس نیست.</td>
                            </tr>
                            ` : reports.map(r => `
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
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h3 class="font-bold text-base text-slate-800 dark:text-white">فهرست و جستجوی بانک سؤالات (${data.total} پرسش ثبت شده)</h3>
                        <p class="text-xs text-slate-500 mt-0.5">شامل سؤالات استاندارد چهارگزینه‌ای و مسائل تشریحی به تفکیک پایه‌ها و فصول</p>
                    </div>
                    <button onclick="window.currentAdminViews.openCreateQuestionModal()" class="btn-duo-blue text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 transition-all">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>➕ طراح سؤال جدید (بدون کدنویسی)</span>
                    </button>
                </div>

                <div class="space-y-3">
                    ${(data.questions && data.questions.length > 0) ? data.questions.map(q => `
                    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all space-y-2">
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded font-bold text-[11px] ${q.question_type === 'mcq' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'}">
                                    ${q.question_type === 'mcq' ? 'تستی' : 'تشریحی'}
                                </span>
                                <span class="text-slate-500 font-semibold">${q.chapter_title_fa || 'فصل فیزیک'} (پایه ${q.grade_number || '-'})</span>
                                <span class="text-[10px] text-slate-400 font-sans font-medium">سطح: ${q.difficulty === 'hard' ? 'سخت' : q.difficulty === 'easy' ? 'آسان' : 'متوسط'}</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-slate-500 font-sans text-[11px] font-bold"><span class="font-mono">${q.points || 1}</span> نمره</span>
                                <button onclick="window.currentAdminViews.deleteQuestion(${q.id}, '${(q.prompt_fa || '').substring(0, 35).replace(/'/g, "\\'")}')" class="text-rose-500 hover:text-rose-700 p-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1" title="حذف دائمی این سؤال">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    <span class="hidden sm:inline">حذف</span>
                                </button>
                            </div>
                        </div>
                        <p class="text-xs font-semibold text-slate-800 dark:text-white leading-relaxed text-justify">${q.prompt_fa || ''}</p>
                        ${q.source_ref ? `<span class="text-[11px] text-slate-400 block font-sans">مرجع: <span class="font-mono">${q.source_ref}</span></span>` : ''}
                    </div>
                    `).join('') : '<div class="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">هیچ سؤالی در بانک اطلاعاتی یافت نشد.</div>'}
                </div>
            </div>
            `;
        } else if (this.activeTab === 'reviews') {
            const rawQueue = await window.api.getWrittenQueue();
            const queue = Array.isArray(rawQueue) ? rawQueue : (rawQueue && Array.isArray(rawQueue.items) ? rawQueue.items : []);
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
        } else if (this.activeTab === 'curriculum') {
            await this.renderCurriculumManagement(target);
        } else if (this.activeTab === 'competitions') {
            await this.renderCompetitionsManagement(target);
        } else if (this.activeTab === 'materials') {
            await this.renderMaterialsManagement(target);
        } else if (this.activeTab === 'students') {
            await this.renderStudentsManagement(target);
        }

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) {
            setTimeout(window.renderMathInPage, 60);
        }
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
                                <span class="px-2.5 py-0.5 rounded-full font-sans text-[11px] font-bold ${c.league_type === 'monthly' ? 'bg-fuchsia-950/60 text-fuchsia-300' : 'bg-cyan-950/60 text-cyan-300'}">
                                    ${c.league_type === 'monthly' ? 'جام ماهانه' : (c.league_type === 'speed_cup' ? 'جام سرعت' : 'لیگ هفتگی')}
                                </span>
                            </td>
                            <td class="p-3 text-slate-500">${c.grade_title_fa}</td>
                            <td class="p-3 font-sans"><span class="font-mono">${c.duration_minutes || 45}</span> دقیقه</td>
                            <td class="p-3 font-sans">${c.has_negative_marking ? 'دارد (۳۳٪)' : 'ندارد'}</td>
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
                    ${(!data.submissions || data.submissions.length === 0) ? `
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

    async renderMaterialsManagement(target) {
        const gradeId = this.materialsGradeFilter;
        const category = this.materialsCategoryFilter;
        let materials = [];
        try {
            materials = await window.api.getStudyMaterials(gradeId, category);
        } catch (e) {
            console.error('Failed to load study materials:', e);
            materials = [];
        }

        this.lastLoadedMaterials = materials;
        const orphanedList = materials.filter(m => m.file_url && m.file_exists_on_disk === false);

        const categoryLabels = {
            pamphlet: { title: 'جزوه و درسنامه کامل', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
            summary: { title: 'خلاصه درس و فرمول‌نامه', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
            exam_sample: { title: 'نمونه سؤال امتحانی', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
            slide: { title: 'اسلاید و ارائه کلاسی', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
            other: { title: 'سایر منابع و فایل‌ها', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
        };

        const totalDownloads = materials.reduce((acc, m) => acc + (m.download_count || 0), 0);

        target.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                    <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-1">
                        <i data-lucide="folder-git-2" class="w-4 h-4"></i>
                        <span>سامانه مدیریت محتوای متفرقه فیزیک</span>
                    </div>
                    <h3 class="font-extrabold text-lg text-slate-800 dark:text-white">مدیریت درسنامه‌ها، جزوات و فایل‌های متفرقه</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">بارگذاری جزوات دبیران، خلاصه‌های درسی، فرمول‌نامه‌ها، نمونه سؤالات امتحانی و فایل‌های تکمیلی فیزیک</p>
                </div>
                <button onclick="window.currentAdminViews.openCreateMaterialModal()" class="btn-duo-green text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-md hover:scale-105 transition-all">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    <span>➕ بارگذاری جزوه یا فایل جدید</span>
                </button>
            </div>

            <!-- Legacy Orphaned File Alert Ribbon -->
            ${orphanedList.length > 0 ? `
            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-700 dark:text-amber-300">
                <div class="flex items-center gap-2.5 text-xs font-bold">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-500 shrink-0"></i>
                    <span>توجه: تعداد ${orphanedList.length} فایل از دوره‌های پیشین روی دیسک سرور یافت نشدند. می‌توانید فایل جدید را جایگزین کنید یا رکوردهای بدون فایل را با یک کلیک پاکسازی فرمایید.</span>
                </div>
                <button onclick="window.currentAdminViews.cleanupOrphanedMaterials()" class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                    <span>پاکسازی رکوردهای فاقد فایل</span>
                </button>
            </div>
            ` : ''}

            <!-- Stats Ribbon -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span class="text-[11px] text-slate-400 font-bold block mb-1">کل فایل‌ها و جزوات</span>
                    <span class="text-2xl font-black text-slate-800 dark:text-white font-mono">${materials.length}</span>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span class="text-[11px] text-slate-400 font-bold block mb-1">مجموع دفعات دانلود</span>
                    <span class="text-2xl font-black text-emerald-500 font-mono">${totalDownloads}</span>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span class="text-[11px] text-slate-400 font-bold block mb-1">پایه هفتم و هشتم</span>
                    <span class="text-2xl font-black text-cyan-500 font-mono">${materials.filter(m => m.grade_id === 1 || m.grade_id === 2).length}</span>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span class="text-[11px] text-slate-400 font-bold block mb-1">پایه نهم و عمومی</span>
                    <span class="text-2xl font-black text-violet-500 font-mono">${materials.filter(m => m.grade_id === 3 || !m.grade_id).length}</span>
                </div>
            </div>

            <!-- Filter Controls -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <!-- Grade Filters -->
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
                    <span class="text-slate-400 text-[11px] shrink-0 pl-1">پایه:</span>
                    <button onclick="window.currentAdminViews.filterMaterialsByGrade(null)" 
                        class="px-3 py-1.5 rounded-xl transition-all ${this.materialsGradeFilter === null ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        همه
                    </button>
                    <button onclick="window.currentAdminViews.filterMaterialsByGrade(1)" 
                        class="px-3 py-1.5 rounded-xl transition-all ${this.materialsGradeFilter === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        هفتم
                    </button>
                    <button onclick="window.currentAdminViews.filterMaterialsByGrade(2)" 
                        class="px-3 py-1.5 rounded-xl transition-all ${this.materialsGradeFilter === 2 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        هشتم
                    </button>
                    <button onclick="window.currentAdminViews.filterMaterialsByGrade(3)" 
                        class="px-3 py-1.5 rounded-xl transition-all ${this.materialsGradeFilter === 3 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        نهم
                    </button>
                </div>

                <!-- Category Filters -->
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
                    <span class="text-slate-400 text-[11px] shrink-0 pl-1">دسته:</span>
                    <button onclick="window.currentAdminViews.filterMaterialsByCategory(null)" 
                        class="px-2.5 py-1.5 rounded-xl transition-all ${this.materialsCategoryFilter === null ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        همه
                    </button>
                    <button onclick="window.currentAdminViews.filterMaterialsByCategory('pamphlet')" 
                        class="px-2.5 py-1.5 rounded-xl transition-all ${this.materialsCategoryFilter === 'pamphlet' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        جزوه
                    </button>
                    <button onclick="window.currentAdminViews.filterMaterialsByCategory('summary')" 
                        class="px-2.5 py-1.5 rounded-xl transition-all ${this.materialsCategoryFilter === 'summary' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        خلاصه/فرمول
                    </button>
                    <button onclick="window.currentAdminViews.filterMaterialsByCategory('exam_sample')" 
                        class="px-2.5 py-1.5 rounded-xl transition-all ${this.materialsCategoryFilter === 'exam_sample' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}">
                        نمونه سؤال
                    </button>
                </div>
            </div>

            <!-- Materials Cards Grid -->
            ${materials.length === 0 ? `
            <div class="py-16 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div class="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <i data-lucide="file-text" class="w-7 h-7"></i>
                </div>
                <div class="space-y-1">
                    <h4 class="font-bold text-slate-800 dark:text-white text-sm">هیچ درسنامه یا جزوه‌ای در این دسته‌بندی یافت نشد</h4>
                    <p class="text-xs text-slate-400">با کلیک روی دکمه «بارگذاری جزوه یا فایل جدید» نخستین محتوا را اضافه فرمایید.</p>
                </div>
                <button onclick="window.currentAdminViews.openCreateMaterialModal()" class="btn-duo-green text-white font-bold px-4 py-2 rounded-xl text-xs">
                    بارگذاری فایل جدید
                </button>
            </div>
            ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${materials.map(m => {
                    const catInfo = categoryLabels[m.category] || categoryLabels.other;
                    const sizeStr = m.file_size_bytes > 0 
                        ? (m.file_size_bytes > 1024 * 1024 ? (m.file_size_bytes / (1024 * 1024)).toFixed(1) + ' مگابایت' : Math.round(m.file_size_bytes / 1024) + ' کیلوبایت')
                        : 'فایل آنلاین';
                    return `
                    <div class="flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 hover:shadow-md transition-all space-y-4">
                        <div class="space-y-2.5">
                            <div class="flex items-center justify-between gap-2">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catInfo.color}">
                                    ${catInfo.title}
                                </span>
                                <span class="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                                    ${m.grade_title_fa}
                                </span>
                            </div>

                            <h4 class="font-extrabold text-sm text-slate-800 dark:text-white leading-snug">${m.title_fa}</h4>

                            <!-- File health badge -->
                            <div class="pt-0.5">
                                ${m.file_url ? (
                                    m.file_exists_on_disk !== false
                                        ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold"><i data-lucide="check-circle" class="w-3 h-3"></i> فایل موجود و فعال در سرور</span>`
                                        : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-[10px] font-bold"><i data-lucide="alert-circle" class="w-3 h-3"></i> ⚠️ فایل روی دیسک مفقود است</span>`
                                ) : `<span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px]">بدون فایل ضمیمه</span>`}
                            </div>
                            
                            ${m.description_fa ? `
                            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                ${m.description_fa}
                            </p>
                            ` : ''}

                            <div class="pt-2 text-[11px] text-slate-400 space-y-1">
                                <div class="flex items-center gap-1.5">
                                    <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500"></i>
                                    <span>مؤلف: <strong class="text-slate-700 dark:text-slate-300">${m.author_name || 'دبیرخانه فیزیک'}</strong></span>
                                </div>
                                <div class="flex items-center justify-between pt-1 text-[10px]">
                                    <span class="flex items-center gap-1">
                                        <i data-lucide="hard-drive" class="w-3.5 h-3.5"></i>
                                        <span>${sizeStr}</span>
                                    </span>
                                    <span class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                        <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                        <span>${m.download_count} دریافت</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
                            ${m.file_url ? (
                                m.file_exists_on_disk !== false ? `
                                <a href="${m.file_url}" target="_blank" onclick="window.api.incrementMaterialDownload(${m.id})"
                                    class="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all">
                                    <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                                    <span>مشاهده / دانلود</span>
                                </a>
                                ` : `
                                <button onclick="window.currentAdminViews.openEditMaterialModal(${m.id})"
                                    class="flex-1 py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all">
                                    <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i>
                                    <span>جایگزینی فایل مفقود</span>
                                </button>
                                `
                            ) : `
                            <span class="text-xs text-slate-400 italic">بدون لینک ضمیمه</span>
                            `}
                            <button onclick="window.currentAdminViews.openEditMaterialModal(${m.id})" 
                                class="p-1.5 rounded-xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold transition-colors" title="ویرایش اطلاعات یا تغییر فایل">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="window.currentAdminViews.deleteStudyMaterial(${m.id}, '${(m.title_fa || m.title || '').replace(/'/g, "\\'")}')" 
                                class="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors" title="حذف جزوه">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
            `}
        </div>
        `;
    }

    filterMaterialsByGrade(gradeId) {
        this.materialsGradeFilter = gradeId;
        this.loadTabContent();
    }

    filterMaterialsByCategory(cat) {
        this.materialsCategoryFilter = cat;
        this.loadTabContent();
    }

    openCreateMaterialModal() {
        const modal = document.createElement('div');
        modal.id = 'admin-create-material-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-xl text-slate-900 dark:text-white space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <i data-lucide="file-plus" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">بارگذاری درسنامه، جزوه یا فایل آموزشی جدید</h3>
                        <span class="text-[10px] text-emerald-600 dark:text-emerald-400">بانک محتوای متفرقه فیزیک</span>
                    </div>
                </div>
                <button onclick="document.getElementById('admin-create-material-modal').remove()" class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form onsubmit="window.currentAdminViews.handleCreateMaterialSubmit(event)" class="space-y-4 text-xs font-semibold">
                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">عنوان درسنامه یا جزوه: *</label>
                    <input type="text" name="title_fa" required placeholder="مثال: جزوه طلایی الکتریسیته ساکن و جاری به همراه ۵۰ تست تکمیلی"
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">پایه تحصیلی:</label>
                        <select name="grade_id" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500">
                            <option value="">تمامی پایه‌ها (عمومی)</option>
                            <option value="1">پایه هفتم</option>
                            <option value="2">پایه هشتم</option>
                            <option value="3">پایه نهم</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">دسته‌بندی محتوا:</label>
                        <select name="category" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500">
                            <option value="pamphlet">جزوه و درسنامه کامل</option>
                            <option value="summary">خلاصه درس و فرمول‌نامه</option>
                            <option value="exam_sample">نمونه سؤال امتحانی با پاسخ تشریحی</option>
                            <option value="slide">اسلاید و ارائه کلاسی</option>
                            <option value="other">سایر منابع و فایل‌های متفرقه</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">نام مؤلف، گردآورنده یا دبیر:</label>
                    <input type="text" name="author_name" placeholder="مثال: دبیرخانه انجمن فیزیک یا نام دبیر محترم"
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">توضیحات و سرفصل‌های فایل:</label>
                    <textarea name="description_fa" rows="2" placeholder="توضیح کوتاه درباره مباحث، فصل‌های تحت پوشش، نکات مهم..."
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"></textarea>
                </div>

                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span class="block text-slate-700 dark:text-slate-300 font-bold">فایل ضمیمه:</span>
                    
                    <div>
                        <label class="block text-slate-500 text-[11px] mb-1">بارگذاری مستقیم فایل (PDF، Docx، عکس یا زیپ):</label>
                        <input type="file" name="material_file" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.png,.jpg,.jpeg"
                            class="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600" />
                    </div>

                    <div class="flex items-center gap-2 my-1 text-slate-400 text-[11px]">
                        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        <span>یا</span>
                        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                    </div>

                    <div>
                        <label class="block text-slate-500 text-[11px] mb-1">لینک مستقیم یا اینترنتی فایل (اختیاری):</label>
                        <input type="url" name="file_url" placeholder="https://example.com/file.pdf"
                            class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono outline-none focus:border-emerald-500" />
                    </div>
                </div>

                <div id="material-upload-progress" class="hidden p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال بارگذاری فایل و ثبت اطلاعات...</span>
                </div>

                <div class="pt-2 flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('admin-create-material-modal').remove()" 
                        class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                        انصراف
                    </button>
                    <button type="submit" id="material-submit-btn" class="btn-duo-green text-white font-bold px-6 py-2.5 rounded-xl shadow-md">
                        ذخیره و انتشار درسنامه
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async handleCreateMaterialSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const progressBox = document.getElementById('material-upload-progress');
        const submitBtn = document.getElementById('material-submit-btn');
        if (progressBox) progressBox.classList.remove('hidden');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const titleFa = formData.get('title_fa');
            const gradeIdVal = formData.get('grade_id');
            const gradeId = gradeIdVal ? parseInt(gradeIdVal) : null;
            const category = formData.get('category') || 'pamphlet';
            const authorName = formData.get('author_name');
            const descriptionFa = formData.get('description_fa');
            const fileInput = form.querySelector('input[name="material_file"]');
            let fileUrl = formData.get('file_url') || null;
            let originalFilename = null;
            let fileSizeBytes = 0;

            if (fileInput && fileInput.files && fileInput.files[0]) {
                const uploadData = new FormData();
                uploadData.append('file', fileInput.files[0]);
                const uploadRes = await window.api.uploadStudyMaterialFile(uploadData);
                fileUrl = uploadRes.file_url;
                originalFilename = uploadRes.original_filename;
                fileSizeBytes = uploadRes.file_size_bytes;
            }

            const payload = {
                title_fa: titleFa,
                description_fa: descriptionFa,
                grade_id: gradeId,
                author_name: authorName,
                category: category,
                file_url: fileUrl,
                original_filename: originalFilename,
                file_size_bytes: fileSizeBytes
            };

            await window.api.createStudyMaterial(payload);
            alert('درسنامه / جزوه با موفقیت ثبت و منتشر گردید.');
            const m = document.getElementById('admin-create-material-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در ثبت درسنامه: ' + err.message);
            if (progressBox) progressBox.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    async deleteStudyMaterial(id, title) {
        if (!confirm(`آیا از حذف درسنامه "${title}" اطمینان دارید؟`)) return;
        try {
            await window.api.deleteStudyMaterial(id);
            alert('درسنامه با موفقیت حذف گردید.');
            this.loadTabContent();
        } catch (err) {
            alert('خطا در حذف: ' + err.message);
        }
    }

    openEditMaterialModal(id) {
        const mat = (this.lastLoadedMaterials || []).find(m => m.id === id);
        if (!mat) return;

        const modal = document.createElement('div');
        modal.id = 'admin-edit-material-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-xl text-slate-900 dark:text-white space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </div>
                    <h3 class="font-extrabold text-base">ویرایش جزوه و جایگزینی فایل</h3>
                </div>
                <button onclick="document.getElementById('admin-edit-material-modal').remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form onsubmit="window.currentAdminViews.handleEditMaterialSubmit(event, ${id})" class="space-y-4 text-xs font-bold">
                <div>
                    <label class="block text-slate-500 text-[11px] mb-1">عنوان درسنامه یا جزوه: *</label>
                    <input type="text" name="title_fa" required value="${(mat.title_fa || '').replace(/"/g, '&quot;')}"
                        class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-500 text-[11px] mb-1">پایه تحصیلی:</label>
                        <select name="grade_id" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs">
                            <option value="" ${!mat.grade_id ? 'selected' : ''}>عمومی (تمامی پایه‌ها)</option>
                            <option value="1" ${mat.grade_id === 1 ? 'selected' : ''}>پایه هفتم</option>
                            <option value="2" ${mat.grade_id === 2 ? 'selected' : ''}>پایه هشتم</option>
                            <option value="3" ${mat.grade_id === 3 ? 'selected' : ''}>پایه نهم</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-slate-500 text-[11px] mb-1">دسته‌بندی محتوا:</label>
                        <select name="category" class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs">
                            <option value="pamphlet" ${mat.category === 'pamphlet' ? 'selected' : ''}>جزوه و درسنامه کامل</option>
                            <option value="summary" ${mat.category === 'summary' ? 'selected' : ''}>خلاصه درس و فرمول‌نامه</option>
                            <option value="exam_sample" ${mat.category === 'exam_sample' ? 'selected' : ''}>نمونه سؤال امتحانی</option>
                            <option value="slide" ${mat.category === 'slide' ? 'selected' : ''}>اسلاید و ارائه کلاسی</option>
                            <option value="other" ${mat.category === 'other' ? 'selected' : ''}>سایر منابع</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-slate-500 text-[11px] mb-1">نام مؤلف یا گردآورنده:</label>
                    <input type="text" name="author_name" value="${(mat.author_name || '').replace(/"/g, '&quot;')}"
                        class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs" />
                </div>

                <div>
                    <label class="block text-slate-500 text-[11px] mb-1">توضیحات و سرفصل‌ها:</label>
                    <textarea name="description_fa" rows="2"
                        class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs resize-none">${mat.description_fa || ''}</textarea>
                </div>

                <!-- File Replacement Section -->
                <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span class="block text-xs font-bold text-slate-700 dark:text-slate-200">فایل ضمیمه درسنامه:</span>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400">
                        ${mat.file_url ? `فایل فعلی: <code class="font-mono text-blue-600 dark:text-blue-400">${mat.original_filename || mat.file_url}</code>` : 'در حال حاضر فایلی ضمیمه نشده است.'}
                    </div>

                    <div>
                        <label class="block text-slate-500 text-[11px] mb-1">بارگذاری فایل جایگزین (PDF, Word, PowerPoint تا ۵۰ مگابایت):</label>
                        <input type="file" name="material_file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.zip,.rar"
                            class="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs" />
                    </div>
                </div>

                <div id="material-edit-progress" class="hidden p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال ذخیره تغییرات و جایگزینی فایل...</span>
                </div>

                <div class="pt-2 flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('admin-edit-material-modal').remove()" 
                        class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                        انصراف
                    </button>
                    <button type="submit" id="material-edit-submit-btn" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
                        ذخیره تغییرات
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async handleEditMaterialSubmit(e, id) {
        e.preventDefault();
        const form = e.target;
        const progressBox = document.getElementById('material-edit-progress');
        const submitBtn = document.getElementById('material-edit-submit-btn');
        if (progressBox) progressBox.classList.remove('hidden');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const titleFa = formData.get('title_fa');
            const gradeIdVal = formData.get('grade_id');
            const gradeId = gradeIdVal ? parseInt(gradeIdVal) : null;
            const category = formData.get('category') || 'pamphlet';
            const authorName = formData.get('author_name');
            const descriptionFa = formData.get('description_fa');
            const fileInput = form.querySelector('input[name="material_file"]');

            const payload = {
                title_fa: titleFa,
                description_fa: descriptionFa,
                grade_id: gradeId,
                author_name: authorName,
                category: category
            };

            if (fileInput && fileInput.files && fileInput.files[0]) {
                const uploadData = new FormData();
                uploadData.append('file', fileInput.files[0]);
                const uploadRes = await window.api.uploadStudyMaterialFile(uploadData);
                payload.file_url = uploadRes.file_url;
                payload.original_filename = uploadRes.original_filename;
                payload.file_size_bytes = uploadRes.file_size_bytes;
            }

            await window.api.updateStudyMaterial(id, payload);
            alert('اطلاعات و فایل درسنامه با موفقیت به‌روزرسانی شد.');
            const m = document.getElementById('admin-edit-material-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در به‌روزرسانی: ' + err.message);
            if (progressBox) progressBox.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    async cleanupOrphanedMaterials() {
        if (!confirm('آیا از پاکسازی رکوردهای فاقد فایل فیزیکی از پایگاه‌داده اطمینان دارید؟')) return;
        try {
            const res = await window.api.cleanupOrphanedMaterials();
            alert(res.message_fa || 'پاکسازی با موفقیت انجام شد.');
            this.loadTabContent();
        } catch (err) {
            alert('خطا در پاکسازی: ' + err.message);
        }
    }

    // ========================================================
    // ZERO-CODE CURRICULUM MANAGEMENT (فصول و درسنامه‌ها)
    // ========================================================

    async renderCurriculumManagement(target) {
        target.innerHTML = `<div class="text-center py-12"><div class="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div><p class="text-xs text-slate-500 mt-2 font-bold">در حال بارگذاری ساختار سرفصل‌ها و درسنامه‌ها...</p></div>`;

        try {
            const tree = await window.api.getCurriculumTree();
            this.curriculumTreeCache = tree;

            const filteredTree = this.curriculumGradeFilter
                ? tree.filter(g => g.id === this.curriculumGradeFilter)
                : tree;

            const totalChapters = tree.reduce((acc, g) => acc + g.books.reduce((bAcc, b) => bAcc + b.chapters.length, 0), 0);
            const totalLessons = tree.reduce((acc, g) => acc + g.books.reduce((bAcc, b) => bAcc + b.chapters.reduce((cAcc, c) => cAcc + c.lessons.length, 0), 0), 0);

            target.innerHTML = `
            <div class="space-y-6">
                <!-- Header & Action Deck -->
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div>
                            <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs mb-1">
                                <i data-lucide="sparkles" class="w-4 h-4"></i>
                                <span>سامانه مدیریت محتوای آموزشی بدون نیاز به کدنویسی (Zero-Code Curriculum CMS)</span>
                            </div>
                            <h2 class="text-xl font-black text-slate-900 dark:text-white">طراحی و مدیریت سرفصل‌ها و درسنامه‌ها</h2>
                            <p class="text-xs text-slate-500 mt-1">تعداد کل فصول ثبت‌شده: <strong class="text-purple-600 font-mono">${totalChapters}</strong> فصل | تعداد کل درسنامه‌ها: <strong class="text-emerald-500 font-mono">${totalLessons}</strong> درسنامه</p>
                        </div>

                        <div class="flex items-center gap-2 flex-wrap">
                            <button onclick="window.currentAdminViews.openCreateChapterModal()" class="btn-duo-blue text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 hover:scale-105 transition-all">
                                <i data-lucide="folder-plus" class="w-4 h-4"></i>
                                <span>➕ ایجاد فصل جدید</span>
                            </button>
                            <button onclick="window.currentAdminViews.openCreateLessonModal()" class="btn-duo-green text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 hover:scale-105 transition-all">
                                <i data-lucide="file-plus" class="w-4 h-4"></i>
                                <span>➕ ایجاد درسنامه جدید</span>
                            </button>
                        </div>
                    </div>

                    <!-- Grade Filter Pills -->
                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
                        <button onclick="window.currentAdminViews.filterCurriculumByGrade(null)" class="px-3.5 py-1.5 rounded-xl transition-all ${this.curriculumGradeFilter === null ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                            همه پایه‌ها (${totalChapters} فصل)
                        </button>
                        ${tree.map(g => {
                            const gChCount = g.books.reduce((acc, b) => acc + b.chapters.length, 0);
                            return `
                            <button onclick="window.currentAdminViews.filterCurriculumByGrade(${g.id})" class="px-3.5 py-1.5 rounded-xl transition-all ${this.curriculumGradeFilter === g.id ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                                ${g.title_fa} (${gChCount} فصل)
                            </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Tree Hierarchy List -->
                <div class="space-y-6">
                    ${filteredTree.map(g => `
                    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-black">
                                    ${g.number}
                                </div>
                                <div>
                                    <h3 class="font-black text-lg text-slate-900 dark:text-white">${g.title_fa || g.title || ''}</h3>
                                    <span class="text-xs text-slate-400">${(g.books || []).map(b => b.title_fa || b.title || '').join(' • ')}</span>
                                </div>
                            </div>
                            <button onclick="window.currentAdminViews.openCreateChapterModal(${g.id})" class="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                                <span>افزودن فصل به پایه ${g.number || ''}</span>
                            </button>
                        </div>

                        <!-- Chapters List -->
                        <div class="grid grid-cols-1 gap-4">
                            ${(g.books || []).flatMap(b => b.chapters || []).map(ch => `
                            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <span class="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs">
                                                فصل ${ch.chapter_number}
                                            </span>
                                            <h4 class="font-black text-base text-slate-900 dark:text-white">${ch.title_fa}</h4>
                                        </div>
                                        ${ch.description_fa ? `<p class="text-xs text-slate-500 mt-1">${ch.description_fa}</p>` : ''}
                                    </div>

                                    <div class="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                                        <span class="text-xs text-slate-400 font-sans font-semibold"><span class="font-mono">${ch.estimated_minutes}</span> دقیقه</span>
                                        <span class="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">${ch.lessons.length} درسنامه</span>
                                        <span class="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">${ch.questions_count} سؤال</span>
                                        
                                        <button onclick="window.currentAdminViews.openCreateLessonModal(${ch.id})" class="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1" title="افزودن درسنامه به این فصل">
                                            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                                            <span>افزودن درسنامه</span>
                                        </button>
                                        <button onclick="window.currentAdminViews.deleteChapter(${ch.id}, '${(ch.title_fa || ch.title || '').replace(/'/g, "\\'")}')" class="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all" title="حذف کامل این فصل">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Lessons inside this Chapter -->
                                <div class="space-y-2">
                                    ${ch.lessons.length === 0 ? `
                                    <div class="text-center py-4 text-xs text-slate-400 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                        هنوز درسنامه‌ای برای این فصل ثبت نشده است. با دکمه «افزودن درسنامه» اولین درسنامه را بسازید.
                                    </div>
                                    ` : `
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                        ${ch.lessons.map(les => `
                                        <div class="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-purple-400 transition-all flex flex-col justify-between space-y-2 shadow-2xs">
                                            <div class="space-y-1">
                                                <div class="flex items-center justify-between text-[11px]">
                                                    <span class="font-sans font-bold text-slate-400">درس <span class="font-mono">${les.order_index}</span></span>
                                                    <div class="flex items-center gap-1">
                                                        <span class="font-mono text-amber-500 font-bold">⚡ +${les.xp_reward} XP</span>
                                                        ${les.simulator_type ? `<span class="px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-600 text-[10px] font-bold">🔬 ${les.simulator_type}</span>` : ''}
                                                    </div>
                                                </div>
                                                <h5 class="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">${les.title_fa}</h5>
                                                ${les.summary_fa ? `<p class="text-[11px] text-slate-500 line-clamp-2">${les.summary_fa}</p>` : ''}
                                            </div>

                                            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
                                                <span class="text-slate-400 font-sans">⏱️ <span class="font-mono">${les.estimated_minutes}</span> دقیقه</span>
                                                <button onclick="window.currentAdminViews.deleteLesson(${les.id}, '${(les.title_fa || les.title || '').replace(/'/g, "\\'")}')" class="text-rose-500 hover:text-rose-700 p-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1" title="حذف درسنامه">
                                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                                    <span>حذف</span>
                                                </button>
                                            </div>
                                        </div>
                                        `).join('')}
                                    </div>
                                    `}
                                </div>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            target.innerHTML = `<div class="p-6 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold text-center">خطا در بارگذاری سرفصل‌ها: ${err.message}</div>`;
        }
    }

    filterCurriculumByGrade(gradeId) {
        this.curriculumGradeFilter = gradeId;
        this.loadTabContent();
    }

    // Modal: Create Chapter
    openCreateChapterModal(defaultGradeId = null) {
        const modal = document.createElement('div');
        modal.id = 'admin-create-chapter-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-lg text-slate-900 dark:text-white space-y-5 shadow-2xl animate-scale-up">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
                        <i data-lucide="folder-plus" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">ایجاد فصل جدید در کتاب درسی (بدون کدنویسی)</h3>
                        <span class="text-[10px] text-purple-600 dark:text-purple-400">سامانه محتوای آموزشی کوانتوم</span>
                    </div>
                </div>
                <button onclick="document.getElementById('admin-create-chapter-modal').remove()" class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form onsubmit="window.currentAdminViews.handleCreateChapterSubmit(event)" class="space-y-4 text-xs font-semibold">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">پایه تحصیلی: *</label>
                        <select name="grade_id" required class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500">
                            <option value="1" ${defaultGradeId === 1 ? 'selected' : ''}>پایه هفتم</option>
                            <option value="2" ${defaultGradeId === 2 ? 'selected' : ''}>پایه هشتم</option>
                            <option value="3" ${defaultGradeId === 3 ? 'selected' : ''}>پایه نهم</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">شماره فصل: *</label>
                        <input type="number" name="chapter_number" min="1" max="25" value="1" required
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">عنوان فصل: *</label>
                    <input type="text" name="title_fa" required placeholder="مثال: فیزیک و اندازه‌گیری / الکتریسیته و مغناطیس"
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500" />
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">زمان مطالعه برآورد شده (دقیقه):</label>
                    <input type="number" name="estimated_minutes" min="15" max="300" value="45"
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-500" />
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">توضیحات و اهداف آموزشی فصل:</label>
                    <textarea name="description_fa" rows="3" placeholder="مباحث کلیدی، مفاهیم و اهداف یادگیری این فصل..."
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 leading-relaxed"></textarea>
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onclick="document.getElementById('admin-create-chapter-modal').remove()" class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-blue text-white font-black px-6 py-2.5 rounded-xl shadow-md">
                        ثبت و ایجاد فصل
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async handleCreateChapterSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const payload = {
            grade_id: parseInt(form.grade_id.value, 10),
            chapter_number: parseInt(form.chapter_number.value, 10),
            title_fa: form.title_fa.value.trim(),
            description_fa: form.description_fa.value.trim(),
            estimated_minutes: parseInt(form.estimated_minutes.value, 10) || 45
        };

        try {
            await window.api.createChapter(payload);
            alert('فصل جدید با موفقیت ایجاد گردید.');
            const m = document.getElementById('admin-create-chapter-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در ثبت فصل: ' + err.message);
        }
    }

    async deleteChapter(id, title) {
        if (!confirm(`آیا از حذف کامل فصل "${title}" و تمامی درسنامه‌های مرتبط با آن اطمینان دارید؟`)) return;
        try {
            await window.api.deleteChapter(id);
            alert('فصل با موفقیت حذف گردید.');
            this.loadTabContent();
        } catch (err) {
            alert('خطا در حذف فصل: ' + err.message);
        }
    }

    // Modal: Create Lesson
    async openCreateLessonModal(defaultChapterId = null) {
        const tree = this.curriculumTreeCache || await window.api.getCurriculumTree();
        const allChapters = [];
        tree.forEach(g => {
            g.books.forEach(b => {
                b.chapters.forEach(ch => {
                    allChapters.push({
                        id: ch.id,
                        gradeNumber: g.number,
                        title: `پایه ${g.number} - فصل ${ch.chapter_number}: ${ch.title_fa}`
                    });
                });
            });
        });

        const modal = document.createElement('div');
        modal.id = 'admin-create-lesson-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-slate-900 dark:text-white space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <i data-lucide="file-plus" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">طراحی درسنامه تعاملی جدید (بدون کدنویسی)</h3>
                        <span class="text-[10px] text-emerald-600 dark:text-emerald-400">سامانه محتوای استاندارد دولینگو فیزیک</span>
                    </div>
                </div>
                <button onclick="document.getElementById('admin-create-lesson-modal').remove()" class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form onsubmit="window.currentAdminViews.handleCreateLessonSubmit(event)" class="space-y-4 text-xs font-semibold">
                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">انتخاب فصل درسی: *</label>
                    <select name="chapter_id" required class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500">
                        ${allChapters.map(c => `
                        <option value="${c.id}" ${defaultChapterId === c.id ? 'selected' : ''}>${c.title}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="sm:col-span-2">
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">عنوان درسنامه: *</label>
                        <input type="text" name="title_fa" required placeholder="مثال: مفهوم کار، انرژی جنبشی و پایستگی انرژی"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">شماره ترتیب درس:</label>
                        <input type="number" name="order_index" min="1" max="20" value="1"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-emerald-500" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">زمان مطالعه (دقیقه):</label>
                        <input type="number" name="estimated_minutes" min="5" max="90" value="15"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">پاداش امتیاز (XP):</label>
                        <input type="number" name="xp_reward" min="10" max="100" value="25"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-emerald-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">ضمیمه شبیه‌ساز آزمایشگاه فیزیک:</label>
                    <select name="simulator_type" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500">
                        <option value="none">بدون آزمایشگاه شبیه‌ساز</option>
                        <option value="gravity">سقوط آزاد و شتاب گرانش (Gravity & Motion)</option>
                        <option value="optics">اپتیک، شکست نور و آینه‌ها (Optics & Light)</option>
                        <option value="circuit">مدار الکتریکی، مقاومت و قانون اهم (Circuits & Ohm)</option>
                        <option value="waves">موج، دامنه و فرکانس نوسان (Waves & Frequency)</option>
                        <option value="thermodynamics">گرما، دماسنجی و انبساط حرارتی (Heat & Temperature)</option>
                    </select>
                </div>

                <!-- Structured Blocks Accordion -->
                <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span class="block text-xs font-black text-purple-600 dark:text-purple-400">بخش‌های آموزشی درسنامه (پخش در پخش‌کننده تعاملی):</span>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">۱. جرقه ذهنی و مقدمه (Intro):</label>
                        <textarea name="intro" rows="2" placeholder="یک سوال شگفت‌انگیز یا پدیده روزمره برای ایجاد انگیزه..."
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"></textarea>
                    </div>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">۲. تشریح مفاهیم و قوانین فیزیکی (Theory):</label>
                        <textarea name="explanation" rows="4" placeholder="توضیح مفهومی قوانین فیزیک با بیان شیوا و روان..."
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"></textarea>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">۳. فرمول و روابط فیزیکی:</label>
                            <input type="text" name="formula" placeholder="مثال: $W = F \\cdot d \\cdot \\cos(\\theta)$"
                                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-purple-500" />
                        </div>
                        <div>
                            <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">۴. تعاریف کلیدی (Definitions):</label>
                            <input type="text" name="definition" placeholder="تعریف دقیق علمی و یکاهای مربوطه..."
                                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">۵. آزمایشگاه و فعالیت تجربی (Experiment):</label>
                        <textarea name="experiment" rows="2" placeholder="توصیف آزمایش تجربی یا دستورکار آزمایشگاهی..."
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"></textarea>
                    </div>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">۶. اشتباهات رایج مفهومی (Misconception):</label>
                        <input type="text" name="misconception" placeholder="اشتباه رایجی که دانش‌آموزان در این مبحث مرتکب می‌شوند..."
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500" />
                    </div>

                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">۷. جمع‌بندی درسنامه (Summary):</label>
                        <textarea name="summary_fa" rows="2" placeholder="خلاصه ۳ خطی نکات کلیدی این درسنامه..."
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"></textarea>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onclick="document.getElementById('admin-create-lesson-modal').remove()" class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-green text-white font-black px-6 py-2.5 rounded-xl shadow-md">
                        ثبت و انتشار درسنامه
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async handleCreateLessonSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const payload = {
            chapter_id: parseInt(form.chapter_id.value, 10),
            title_fa: form.title_fa.value.trim(),
            order_index: parseInt(form.order_index.value, 10) || 1,
            estimated_minutes: parseInt(form.estimated_minutes.value, 10) || 15,
            xp_reward: parseInt(form.xp_reward.value, 10) || 25,
            simulator_type: form.simulator_type.value,
            intro: form.intro.value.trim() || null,
            explanation: form.explanation.value.trim() || null,
            formula: form.formula.value.trim() || null,
            definition: form.definition.value.trim() || null,
            experiment: form.experiment.value.trim() || null,
            misconception: form.misconception.value.trim() || null,
            summary_fa: form.summary_fa.value.trim() || null
        };

        try {
            await window.api.createLesson(payload);
            alert('درسنامه تعاملی جدید با موفقیت ثبت و به فصل مربوطه اضافه گردید.');
            const m = document.getElementById('admin-create-lesson-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در ثبت درسنامه: ' + err.message);
        }
    }

    async deleteLesson(id, title) {
        if (!confirm(`آیا از حذف درسنامه "${title}" اطمینان دارید؟`)) return;
        try {
            await window.api.deleteLesson(id);
            alert('درسنامه با موفقیت حذف گردید.');
            this.loadTabContent();
        } catch (err) {
            alert('خطا در حذف درسنامه: ' + err.message);
        }
    }

    // ========================================================
    // ZERO-CODE QUESTION BUILDER (طراح سؤالات بدون کدنویسی)
    // ========================================================

    async openCreateQuestionModal() {
        const tree = this.curriculumTreeCache || await window.api.getCurriculumTree();
        const allChapters = [];
        tree.forEach(g => {
            g.books.forEach(b => {
                b.chapters.forEach(ch => {
                    allChapters.push({
                        id: ch.id,
                        gradeId: g.id,
                        title: `پایه ${g.number} - فصل ${ch.chapter_number}: ${ch.title_fa}`
                    });
                });
            });
        });

        const modal = document.createElement('div');
        modal.id = 'admin-create-question-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/40 rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-slate-900 dark:text-white space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <i data-lucide="help-circle" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">طراح هوشمند سؤال جدید (بدون کدنویسی)</h3>
                        <span class="text-[10px] text-blue-600 dark:text-blue-400">بانک سؤالات رسمی و استاندارد انجمن فیزیک</span>
                    </div>
                </div>
                <button onclick="document.getElementById('admin-create-question-modal').remove()" class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form onsubmit="window.currentAdminViews.handleCreateQuestionSubmit(event)" class="space-y-4 text-xs font-semibold">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">فصل و پایه تحصیلی: *</label>
                        <select name="chapter_id" id="question-chapter-select" required class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                            ${allChapters.map(c => `<option value="${c.id}" data-grade="${c.gradeId}">${c.title}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">نوع سؤال: *</label>
                        <select name="question_type" id="question-type-select" onchange="window.currentAdminViews.toggleQuestionTypeFields(this.value)" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                            <option value="mcq">چهارگزینه‌ای استاندارد (تستی)</option>
                            <option value="written">تشریحی / مسأله تحلیلی فیزیک</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">سطح دشواری: *</label>
                        <select name="difficulty" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                            <option value="easy">آسان و مفاهیم پایه‌ای</option>
                            <option value="medium" selected>متوسط و استاندارد امتحانی</option>
                            <option value="hard">سخت و المپیادی (سمپاد)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">بارم / نمره سؤال: *</label>
                        <input type="number" step="0.25" min="0.5" max="10" name="points" value="1.0" required
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-blue-500" />
                    </div>
                </div>

                <!-- Prompt -->
                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">متن صورت سؤال: *</label>
                    <textarea name="prompt_fa" rows="4" required placeholder="صورت مسأله فیزیک را تایپ کنید. برای فرمول‌ها از $...$ استفاده نمایید..."
                        oninput="window.currentAdminViews.updateQuestionPromptPreview(this.value)"
                        class="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 leading-relaxed"></textarea>
                    
                    <!-- Live KaTeX Preview -->
                    <div class="p-3 rounded-xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700 mt-2 text-xs">
                        <span class="text-[10px] text-blue-500 font-bold block mb-1">پیش‌نمایش زنده صورت سؤال:</span>
                        <div id="create-q-preview" class="text-slate-800 dark:text-slate-200 min-h-[24px] italic text-slate-400">پیش‌نمایش...</div>
                    </div>
                </div>

                <!-- MCQ Options Section -->
                <div id="mcq-options-container" class="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <span class="block text-xs font-black text-blue-600 dark:text-blue-400">۴ گزینه تستی (گزینه صحیح را با دکمه رادیویی علامت بزنید):</span>
                    
                    ${['الف', 'ب', 'ج', 'د'].map((key, idx) => `
                    <div class="flex items-center gap-3">
                        <label class="flex items-center gap-1.5 cursor-pointer shrink-0">
                            <input type="radio" name="correct_key" value="${key}" ${idx === 0 ? 'checked' : ''} class="w-4 h-4 text-blue-600" />
                            <span class="font-mono font-black text-xs w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">${key}</span>
                        </label>
                        <input type="text" name="option_${key}" required placeholder="متن گزینه ${key}..."
                            class="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs" />
                    </div>
                    `).join('')}

                    <div class="pt-2">
                        <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">تحلیل و تشریح پاسخ صحیح (جهت نمایش در کارنامه):</label>
                        <textarea name="mcq_explanation" rows="2" placeholder="استدلال فیزیکی، فرمول حاکم و دلیل رد سایر گزینه‌ها..."
                            class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs"></textarea>
                    </div>
                </div>

                <!-- Written Question Section -->
                <div id="written-options-container" class="hidden space-y-3 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60">
                    <span class="block text-xs font-black text-purple-600 dark:text-purple-400">تنظیمات مسأله تشریحی و رابریک تصحیح هوشمند:</span>
                    <div>
                        <label class="block text-slate-600 dark:text-slate-300 text-[11px] mb-1">پاسخ مرجع کتاب درسی (Reference Answer): *</label>
                        <textarea name="reference_answer_fa" rows="3" placeholder="پاسخ کامل، گام‌به‌گام به همراه روابط و یکاهای SI..."
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500 text-xs leading-relaxed"></textarea>
                    </div>
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">منبع سؤال (کتاب درسی، نمونه دولتی، سمپاد یا المپیاد):</label>
                    <input type="text" name="source_ref" placeholder="مثال: کتاب علوم تجربی نهم - صفحه ۵۴ / آزمون ورودی مدارس تیزهوشان"
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 font-mono text-xs" />
                </div>

                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onclick="document.getElementById('admin-create-question-modal').remove()" class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-blue text-white font-black px-6 py-2.5 rounded-xl shadow-md">
                        ثبت و افزودن به بانک سؤالات
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    toggleQuestionTypeFields(type) {
        const mcqBox = document.getElementById('mcq-options-container');
        const writtenBox = document.getElementById('written-options-container');
        if (type === 'mcq') {
            if (mcqBox) mcqBox.classList.remove('hidden');
            if (writtenBox) writtenBox.classList.add('hidden');
        } else {
            if (mcqBox) mcqBox.classList.add('hidden');
            if (writtenBox) writtenBox.classList.remove('hidden');
        }
    }

    updateQuestionPromptPreview(text) {
        const prev = document.getElementById('create-q-preview');
        if (prev) {
            prev.innerHTML = text.trim() ? text : 'پیش‌نمایش...';
            if (window.renderMathInPage) window.renderMathInPage(prev);
        }
    }

    async handleCreateQuestionSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const qType = form.question_type.value;
        const chapterSelect = form.chapter_id;
        const selectedOpt = chapterSelect.options[chapterSelect.selectedIndex];
        const gradeId = parseInt(selectedOpt.getAttribute('data-grade') || '1', 10);
        const chapterId = parseInt(chapterSelect.value, 10);
        const points = parseFloat(form.points.value) || 1.0;
        const difficulty = form.difficulty.value;
        const promptFa = form.prompt_fa.value.trim();
        const sourceRef = form.source_ref.value.trim() || null;

        const payload = {
            grade_id: gradeId,
            chapter_id: chapterId,
            question_type: qType,
            difficulty: difficulty,
            prompt_fa: promptFa,
            points: points,
            source_ref: sourceRef
        };

        if (qType === 'mcq') {
            const correctKey = form.correct_key.value;
            const explanation = form.mcq_explanation.value.trim() || null;
            payload.options = ['الف', 'ب', 'ج', 'د'].map(k => ({
                option_key: k,
                text_fa: (form[`option_${k}`].value || '').trim(),
                is_correct: k === correctKey,
                explanation_fa: k === correctKey ? explanation : null
            }));
        } else {
            payload.reference_answer_fa = form.reference_answer_fa.value.trim() || 'پاسخ تشریحی بر اساس مفاهیم کتاب درسی';
        }

        try {
            await window.api.createQuestion(payload);
            alert('سؤال جدید با موفقیت به بانک سؤالات اضافه شد.');
            const m = document.getElementById('admin-create-question-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در ثبت سؤال: ' + err.message);
        }
    }

    // ========================================================
    // COMPREHENSIVE STUDENT MANAGEMENT SUITE (PENTAGON-GRADE)
    // ========================================================

    async renderStudentsManagement(target) {
        target.innerHTML = `<div class="text-center py-12"><div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div><p class="text-xs text-slate-500 mt-2 font-bold">در حال بارگذاری لیست کامل دانش‌آموزان...</p></div>`;

        try {
            const params = {};
            if (this.studentGradeFilter) params.grade_id = this.studentGradeFilter;
            if (this.studentStatusFilter !== null && this.studentStatusFilter !== undefined) params.is_active = this.studentStatusFilter;
            if (this.studentSearchQuery) params.search = this.studentSearchQuery;

            const rawStudents = await window.api.getStudents(params).catch(() => []);
            const students = Array.isArray(rawStudents) ? rawStudents : (rawStudents && Array.isArray(rawStudents.students) ? rawStudents.students : []);

            const totalStudents = students.length;
            const activeStudents = students.filter(s => s.is_active).length;
            const totalXp = students.reduce((sum, s) => sum + (s.total_xp || 0), 0);
            const avgXp = totalStudents > 0 ? Math.round(totalXp / totalStudents) : 0;
            const maxStreak = students.reduce((max, s) => Math.max(max, s.streak || 0), 0);

            target.innerHTML = `
            <div class="space-y-6">
                <!-- Header Card & Quick Actions -->
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div>
                            <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs mb-1">
                                <i data-lucide="shield" class="w-4 h-4"></i>
                                <span>سامانه جامع نظارت و کنترل دانش‌آموزان (Full Student Control Suite)</span>
                            </div>
                            <h2 class="text-xl font-black text-slate-900 dark:text-white">مدیریت حساب‌ها، مشخصات، رمز عبور، امتیازها و آزمون‌ها</h2>
                            <p class="text-xs text-slate-500 mt-1">کنترل کامل دانش‌آموز: ویرایش مشخصات، تغییر پایه، بازنشانی مستقیم کلمه عبور، اهدای امتیاز/تجربه، مشاهده کارنامه و ریست کردن تلاش آزمون</p>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <button onclick="window.currentAdminViews.openCreateStudentModal()" class="btn-duo-green text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 hover:scale-105 transition-all">
                                <i data-lucide="user-plus" class="w-4 h-4"></i>
                                <span>➕ ثبت‌نام دانش‌آموز جدید</span>
                            </button>
                            <button onclick="window.currentAdminViews.loadTabContent()" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" title="به‌روزرسانی جدول">
                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Mini KPI Stats -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span class="text-[11px] text-slate-400 font-bold block">کل دانش‌آموزان</span>
                            <span class="text-xl font-black text-slate-800 dark:text-white font-sans"><span class="font-mono">${totalStudents}</span> نفر</span>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                            <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">دانش‌آموزان فعال</span>
                            <span class="text-xl font-black text-emerald-600 font-sans"><span class="font-mono">${activeStudents}</span> نفر</span>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                            <span class="text-[11px] text-blue-600 dark:text-blue-400 font-bold block">میانگین امتیاز (XP)</span>
                            <span class="text-xl font-black text-blue-600 font-mono">${avgXp}</span>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
                            <span class="text-[11px] text-orange-600 dark:text-orange-400 font-bold block">بیشترین استمرار</span>
                            <span class="text-xl font-black text-orange-500 font-sans">🔥 <span class="font-mono">${maxStreak}</span> روز</span>
                        </div>
                    </div>

                    <!-- Filters & Search Toolbar -->
                    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
                        <!-- Search Box -->
                        <div class="relative flex-1">
                            <i data-lucide="search" class="w-4 h-4 absolute right-3.5 top-3 text-slate-400"></i>
                            <input type="text" id="student-search-input" value="${this.studentSearchQuery || ''}"
                                onkeydown="if(event.key==='Enter') window.currentAdminViews.searchStudents(this.value)"
                                placeholder="جستجو بر اساس نام، نام خانوادگی، نام کاربری یا کد دانش‌آموزی... (کلید Enter)"
                                class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold" />
                        </div>

                        <!-- Grade Filter Pills -->
                        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
                            <button onclick="window.currentAdminViews.filterStudentsByGrade(null)" class="px-3 py-1.5 rounded-xl transition-all ${this.studentGradeFilter === null ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                                همه پایه‌ها
                            </button>
                            <button onclick="window.currentAdminViews.filterStudentsByGrade(1)" class="px-3 py-1.5 rounded-xl transition-all ${this.studentGradeFilter === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                                پایه هفتم
                            </button>
                            <button onclick="window.currentAdminViews.filterStudentsByGrade(2)" class="px-3 py-1.5 rounded-xl transition-all ${this.studentGradeFilter === 2 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                                پایه هشتم
                            </button>
                            <button onclick="window.currentAdminViews.filterStudentsByGrade(3)" class="px-3 py-1.5 rounded-xl transition-all ${this.studentGradeFilter === 3 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                                پایه نهم
                            </button>
                        </div>

                        <!-- Status Filter Pills -->
                        <div class="flex items-center gap-1.5 text-xs font-bold">
                            <button onclick="window.currentAdminViews.filterStudentsByStatus(null)" class="px-3 py-1.5 rounded-xl transition-all ${this.studentStatusFilter === null ? 'bg-slate-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}">
                                همه
                            </button>
                            <button onclick="window.currentAdminViews.filterStudentsByStatus(true)" class="px-3 py-1.5 rounded-xl transition-all ${this.studentStatusFilter === true ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}">
                                فعال
                            </button>
                            <button onclick="window.currentAdminViews.filterStudentsByStatus(false)" class="px-3 py-1.5 rounded-xl transition-all ${this.studentStatusFilter === false ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}">
                                مسدود
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Students Table -->
                <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-right text-xs">
                            <thead>
                                <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50/75 dark:bg-slate-800/50 text-slate-400 font-extrabold">
                                    <th class="p-3.5">دانش‌آموز</th>
                                    <th class="p-3.5">پایه تحصیلی</th>
                                    <th class="p-3.5">تجربه (XP) و سطح</th>
                                    <th class="p-3.5">استمرار</th>
                                    <th class="p-3.5">آزمون‌ها</th>
                                    <th class="p-3.5">وضعیت</th>
                                    <th class="p-3.5 text-center">جعبه ابزار کنترل کامل</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                ${students.length === 0 ? `
                                <tr>
                                    <td colspan="7" class="p-12 text-center text-slate-400">
                                        <i data-lucide="user-x" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
                                        <p class="font-bold">دانش‌آموزی با این مشخصات یافت نشد.</p>
                                    </td>
                                </tr>
                                ` : students.map(s => `
                                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                    <td class="p-3.5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                                                ${(s.full_name || s.username).charAt(0)}
                                            </div>
                                            <div>
                                                <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                    <span>${s.full_name || s.username}</span>
                                                    ${s.student_number ? `<span class="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">کد: ${s.student_number}</span>` : ''}
                                                </div>
                                                <div class="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                                                    <span>@${s.username}</span>
                                                    ${s.email ? `<span class="text-slate-400 text-[10px]">(${s.email})</span>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                                            ${s.grade_title_fa || 'نامشخص'}
                                        </span>
                                    </td>
                                    <td class="p-3.5">
                                        <div class="space-y-0.5">
                                            <div class="font-mono font-extrabold text-blue-600 dark:text-blue-400">${(s.total_xp || 0).toLocaleString('fa-IR')} XP</div>
                                            <div class="text-[10px] text-slate-400 font-bold">سطح ${s.level}</div>
                                        </div>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-mono font-bold text-orange-500 flex items-center gap-1">
                                            🔥 ${s.streak} روز
                                        </span>
                                    </td>
                                    <td class="p-3.5">
                                        <div class="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                            <span class="font-bold text-emerald-600">${s.passed_count || 0}</span> / ${s.attempts_count || 0} تلاش
                                        </div>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${s.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'}">
                                            ${s.is_active ? 'فعال' : 'مسدود'}
                                        </span>
                                    </td>
                                    <td class="p-3.5 text-center">
                                        <div class="flex items-center justify-center gap-1.5 flex-wrap">
                                            <button onclick="window.currentAdminViews.openEditStudentModal(${s.id})" title="ویرایش کامل مشخصات و پایه"
                                                class="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
                                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="window.currentAdminViews.openResetPasswordModal(${s.id}, '${s.username}')" title="بازنشانی مستقیم کلمه عبور"
                                                class="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all">
                                                <i data-lucide="key" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="window.currentAdminViews.openAdjustXpModal(${s.id}, '${s.username}', ${s.total_xp})" title="اهدای امتیاز یا کسر XP"
                                                class="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all">
                                                <i data-lucide="award" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="window.currentAdminViews.openStudentExamHistoryModal(${s.id}, '${(s.full_name || s.username).replace(/'/g, "\\'")}')" title="سوابق آزمون و ریست تلاش"
                                                class="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all">
                                                <i data-lucide="file-text" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="window.currentAdminViews.toggleStudent(${s.id})" title="${s.is_active ? 'مسدودسازی' : 'فعال‌سازی'}"
                                                class="p-1.5 rounded-lg ${s.is_active ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'} transition-all">
                                                <i data-lucide="${s.is_active ? 'user-x' : 'user-check'}" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="window.currentAdminViews.deleteStudentConfirm(${s.id}, '${s.username}', '${(s.full_name || s.username).replace(/'/g, "\\'")}')" title="حذف دائم حساب"
                                                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `;
        } catch (err) {
            target.innerHTML = `<div class="p-6 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold">خطا در بارگذاری دانش‌آموزان: ${err.message}</div>`;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    searchStudents(query) {
        this.studentSearchQuery = query.trim();
        this.loadTabContent();
    }

    filterStudentsByGrade(gradeId) {
        this.studentGradeFilter = gradeId;
        this.loadTabContent();
    }

    filterStudentsByStatus(status) {
        this.studentStatusFilter = status;
        this.loadTabContent();
    }

    openCreateStudentModal() {
        const modal = document.createElement('div');
        modal.id = 'admin-create-student-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8 text-right">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                    <i data-lucide="user-plus" class="w-5 h-5"></i>
                    <span>ثبت‌نام مستقیم دانش‌آموز جدید</span>
                </div>
                <button type="button" onclick="document.getElementById('admin-create-student-modal').remove()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>

            <form onsubmit="window.currentAdminViews.submitCreateStudent(event)" class="space-y-4 text-xs font-semibold">
                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">نام و نام خانوادگی دانش‌آموز: <span class="text-rose-500">*</span></label>
                    <input type="text" id="student-create-name" required placeholder="مثال: آرتین رضوانی"
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">نام کاربری یکتا: <span class="text-rose-500">*</span></label>
                        <input type="text" id="student-create-username" required placeholder="مثال: artin_rezvani"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">کلمه عبور ورود: <span class="text-rose-500">*</span></label>
                        <input type="password" id="student-create-pass" required placeholder="حداقل ۴ کاراکتر" minlength="4"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">پایه تحصیلی: <span class="text-rose-500">*</span></label>
                        <select id="student-create-grade" required class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                            <option value="1">پایه هفتم (علوم تجربی - بخش فیزیک)</option>
                            <option value="2">پایه هشتم (علوم تجربی - بخش فیزیک)</option>
                            <option value="3" selected>پایه نهم (علوم تجربی - بخش فیزیک)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">کد دانش‌آموزی (اختیاری):</label>
                        <input type="text" id="student-create-num" placeholder="مثال: 14030912"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">ایمیل (اختیاری):</label>
                        <input type="email" id="student-create-email" placeholder="student@example.com"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono text-left" dir="ltr" />
                    </div>
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">امتیاز تجربه اولیه (XP):</label>
                        <input type="number" id="student-create-xp" min="0" value="50"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                    </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onclick="document.getElementById('admin-create-student-modal').remove()" class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-green text-white font-black px-6 py-2.5 rounded-xl shadow-md">
                        ثبت و ایجاد حساب دانش‌آموز
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async submitCreateStudent(e) {
        e.preventDefault();
        const payload = {
            full_name: document.getElementById('student-create-name').value.trim(),
            username: document.getElementById('student-create-username').value.trim().toLowerCase(),
            password: document.getElementById('student-create-pass').value.trim(),
            grade_id: parseInt(document.getElementById('student-create-grade').value),
            student_number: document.getElementById('student-create-num')?.value.trim() || null,
            email: document.getElementById('student-create-email')?.value.trim() || null,
            initial_xp: parseInt(document.getElementById('student-create-xp')?.value || '0')
        };

        try {
            const res = await window.api.createStudent(payload);
            alert(res.message_fa || 'دانش‌آموز با موفقیت ایجاد شد.');
            const m = document.getElementById('admin-create-student-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در ثبت دانش‌آموز: ' + err.message);
        }
    }

    async openEditStudentModal(userId) {
        try {
            const data = await window.api.getStudentDetails(userId);
            const prof = data.profile || {};

            const modal = document.createElement('div');
            modal.id = 'admin-edit-student-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto';
            modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8 text-right">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm">
                        <i data-lucide="edit-3" class="w-5 h-5"></i>
                        <span>ویرایش مشخصات کامل دانش‌آموز (@${data.username})</span>
                    </div>
                    <button type="button" onclick="document.getElementById('admin-edit-student-modal').remove()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                </div>

                <form onsubmit="window.currentAdminViews.submitUpdateStudent(event, ${data.id})" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-700 dark:text-slate-300 mb-1">نام و نام خانوادگی:</label>
                        <input type="text" id="student-edit-name" required value="${data.full_name || ''}"
                            class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-slate-700 dark:text-slate-300 mb-1">نام کاربری:</label>
                            <input type="text" id="student-edit-username" required value="${data.username || ''}"
                                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                        </div>
                        <div>
                            <label class="block text-slate-700 dark:text-slate-300 mb-1">پایه تحصیلی:</label>
                            <select id="student-edit-grade" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                                <option value="1" ${prof.grade_id === 1 ? 'selected' : ''}>پایه هفتم</option>
                                <option value="2" ${prof.grade_id === 2 ? 'selected' : ''}>پایه هشتم</option>
                                <option value="3" ${prof.grade_id === 3 ? 'selected' : ''}>پایه نهم</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-slate-700 dark:text-slate-300 mb-1">ایمیل:</label>
                            <input type="email" id="student-edit-email" value="${data.email || ''}" placeholder="ایمیل دانش‌آموز"
                                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono text-left" dir="ltr" />
                        </div>
                        <div>
                            <label class="block text-slate-700 dark:text-slate-300 mb-1">کد دانش‌آموزی:</label>
                            <input type="text" id="student-edit-num" value="${prof.student_number || ''}" placeholder="کد دانش‌آموزی"
                                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                            <label class="block text-slate-500 mb-1">مجموع امتیاز (XP):</label>
                            <input type="number" id="student-edit-xp" min="0" value="${prof.total_xp || 0}"
                                class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                        </div>
                        <div>
                            <label class="block text-slate-500 mb-1">سطح (Level):</label>
                            <input type="number" id="student-edit-level" min="1" value="${prof.current_level || 1}"
                                class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                        </div>
                        <div>
                            <label class="block text-slate-500 mb-1">استمرار (Streak):</label>
                            <input type="number" id="student-edit-streak" min="0" value="${prof.current_streak || 0}"
                                class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-1">
                        <input type="checkbox" id="student-edit-active" ${data.is_active ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                        <label for="student-edit-active" class="text-xs text-slate-700 dark:text-slate-300 font-bold">حساب کاربری فعال است (در صورت برداشتن تیک، دانش‌آموز مسدود می‌شود)</label>
                    </div>

                    <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" onclick="document.getElementById('admin-edit-student-modal').remove()" class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                            انصراف
                        </button>
                        <button type="submit" class="btn-duo-blue text-white font-black px-6 py-2.5 rounded-xl shadow-md">
                            ذخیره تغییرات مشخصات
                        </button>
                    </div>
                </form>
            </div>
            `;
            document.body.appendChild(modal);
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            alert('خطا در دریافت اطلاعات دانش‌آموز: ' + err.message);
        }
    }

    async submitUpdateStudent(e, userId) {
        e.preventDefault();
        const payload = {
            full_name: document.getElementById('student-edit-name').value.trim(),
            username: document.getElementById('student-edit-username').value.trim().toLowerCase(),
            email: document.getElementById('student-edit-email')?.value.trim() || null,
            grade_id: parseInt(document.getElementById('student-edit-grade').value),
            student_number: document.getElementById('student-edit-num')?.value.trim() || null,
            total_xp: parseInt(document.getElementById('student-edit-xp')?.value || '0'),
            current_level: parseInt(document.getElementById('student-edit-level')?.value || '1'),
            current_streak: parseInt(document.getElementById('student-edit-streak')?.value || '0'),
            is_active: document.getElementById('student-edit-active').checked
        };

        try {
            const res = await window.api.updateStudent(userId, payload);
            alert(res.message_fa || 'مشخصات دانش‌آموز به‌روزرسانی شد.');
            const m = document.getElementById('admin-edit-student-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در ذخیره تغییرات: ' + err.message);
        }
    }

    openResetPasswordModal(userId, username) {
        const modal = document.createElement('div');
        modal.id = 'admin-reset-pw-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-right">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
                    <i data-lucide="key" class="w-5 h-5"></i>
                    <span>بازنشانی مستقیم رمز عبور</span>
                </div>
                <button type="button" onclick="document.getElementById('admin-reset-pw-modal').remove()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>

            <div class="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/50 text-xs text-amber-800 dark:text-amber-300">
                در حال تنظیم کلمه عبور جدید برای کاربر <strong class="font-mono">@${username}</strong> هستید. نیاز به رمز قبلی نیست و تغییر بلافاصله اعمال می‌شود.
            </div>

            <form onsubmit="window.currentAdminViews.submitResetPassword(event, ${userId})" class="space-y-4 text-xs font-semibold">
                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">کلمه عبور جدید (حداقل ۴ کاراکتر):</label>
                    <input type="password" id="student-new-pw" required minlength="4" placeholder="رمز عبور جدید..."
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                </div>
                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">تکرار کلمه عبور جدید:</label>
                    <input type="password" id="student-new-pw-confirm" required minlength="4" placeholder="تکرار رمز عبور جدید..."
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                </div>

                <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onclick="document.getElementById('admin-reset-pw-modal').remove()" class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-yellow text-slate-900 font-black px-6 py-2.5 rounded-xl shadow-md">
                        ثبت رمز عبور جدید
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async submitResetPassword(e, userId) {
        e.preventDefault();
        const p1 = document.getElementById('student-new-pw').value.trim();
        const p2 = document.getElementById('student-new-pw-confirm').value.trim();
        if (p1 !== p2) {
            alert('کلمه عبور و تکرار آن یکسان نیستند.');
            return;
        }

        try {
            const res = await window.api.resetStudentPassword(userId, p1);
            alert(res.message_fa || 'رمز عبور با موفقیت تغییر یافت.');
            const m = document.getElementById('admin-reset-pw-modal');
            if (m) m.remove();
        } catch (err) {
            alert('خطا در تغییر رمز عبور: ' + err.message);
        }
    }

    openAdjustXpModal(userId, username, currentXp) {
        const modal = document.createElement('div');
        modal.id = 'admin-adjust-xp-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm';
        modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-right">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black text-sm">
                    <i data-lucide="award" class="w-5 h-5"></i>
                    <span>اهدای امتیاز / کسر تجربه (@${username})</span>
                </div>
                <button type="button" onclick="document.getElementById('admin-adjust-xp-modal').remove()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>

            <div class="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200/50 text-xs text-purple-800 dark:text-purple-300">
                امتیاز فعلی دانش‌آموز: <strong class="font-mono text-sm">${(currentXp || 0).toLocaleString('fa-IR')} XP</strong>
            </div>

            <form onsubmit="window.currentAdminViews.submitAdjustXp(event, ${userId})" class="space-y-4 text-xs font-semibold">
                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">مقدار تغییر امتیاز (مثبت برای پاداش، منفی برای کسر):</label>
                    <input type="number" id="student-adjust-amount" required value="50" step="5"
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono" />
                </div>

                <!-- Quick Action Chips -->
                <div class="flex items-center gap-1.5 flex-wrap">
                    <button type="button" onclick="document.getElementById('student-adjust-amount').value = 50; document.getElementById('student-adjust-reason').value = 'پاداش فعالیت کلاسی و پاسخ به پرسش دبیر'" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] hover:bg-purple-100 hover:text-purple-700">
                        +۵۰ کلاسی
                    </button>
                    <button type="button" onclick="document.getElementById('student-adjust-amount').value = 100; document.getElementById('student-adjust-reason').value = 'حل تمرین تشریحی پیشرفته و آزمایش مجازی فیزیک'" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] hover:bg-purple-100 hover:text-purple-700">
                        +۱۰۰ حل تمرین
                    </button>
                    <button type="button" onclick="document.getElementById('student-adjust-amount').value = 250; document.getElementById('student-adjust-reason').value = 'رتبه برتر در مسابقه لیگ فیزیک کوانتومی'" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] hover:bg-purple-100 hover:text-purple-700">
                        +۲۵۰ رتبه لیگ
                    </button>
                    <button type="button" onclick="document.getElementById('student-adjust-amount').value = -50; document.getElementById('student-adjust-reason').value = 'کسر امتیاز به دلیل عدم انجام تکلیف در مهلت مقرر'" class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] hover:bg-rose-100">
                        -۵۰ جریمه
                    </button>
                </div>

                <div>
                    <label class="block text-slate-700 dark:text-slate-300 mb-1">دلیل تغییر امتیاز (جهت ثبت در سوابق و کارنامه):</label>
                    <textarea id="student-adjust-reason" rows="2" required placeholder="توضیح دلیل اهدای امتیاز..."
                        class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white">پاداش فعالیت کلاسی و حل تمرین فیزیک</textarea>
                </div>

                <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onclick="document.getElementById('admin-adjust-xp-modal').remove()" class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                        انصراف
                    </button>
                    <button type="submit" class="btn-duo-purple text-white font-black px-6 py-2.5 rounded-xl shadow-md">
                        ثبت و اعمال تغییر امتیاز
                    </button>
                </div>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) window.lucide.createIcons();
    }

    async submitAdjustXp(e, userId) {
        e.preventDefault();
        const amount = parseInt(document.getElementById('student-adjust-amount').value);
        const reason = document.getElementById('student-adjust-reason').value.trim();

        try {
            const res = await window.api.adjustStudentXP(userId, amount, reason);
            alert(res.message_fa || 'امتیاز با موفقیت اعمال گردید.');
            const m = document.getElementById('admin-adjust-xp-modal');
            if (m) m.remove();
            this.loadTabContent();
        } catch (err) {
            alert('خطا در اعمال امتیاز: ' + err.message);
        }
    }

    async openStudentExamHistoryModal(userId, studentName) {
        try {
            const data = await window.api.getStudentDetails(userId);
            const attempts = data.exam_attempts || [];
            const badges = data.badges || [];
            const xpLogs = data.xp_history || [];

            const modal = document.createElement('div');
            modal.id = 'admin-student-history-modal';
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto';
            modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8 text-right max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                            <i data-lucide="file-text" class="w-5 h-5"></i>
                            <span>کارنامه، سوابق آزمون‌ها و ریست تلاش — ${studentName}</span>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">مشاهده ریز نمرات، درصد قبولی و امکان بازگشایی آزمون برای دانش‌آموز در صورت بروز مشکل</p>
                    </div>
                    <button type="button" onclick="document.getElementById('admin-student-history-modal').remove()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                </div>

                <!-- Exam Attempts Section -->
                <div class="space-y-3">
                    <h4 class="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        <i data-lucide="award" class="w-4 h-4 text-blue-500"></i>
                        <span>سوابق آزمون‌های ثبت‌شده (${attempts.length} آزمون)</span>
                    </h4>

                    ${attempts.length === 0 ? `
                    <div class="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p class="text-xs font-bold">هنوز آزمونی توسط این دانش‌آموز ثبت نشده است.</p>
                    </div>
                    ` : `
                    <div class="space-y-2.5">
                        ${attempts.map(a => `
                        <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="space-y-1">
                                <div class="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-2">
                                    <span>${a.exam_title}</span>
                                    ${a.chapter_title ? `<span class="text-[10px] bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-normal">فصل: ${a.chapter_title}</span>` : ''}
                                </div>
                                <div class="text-[11px] text-slate-400 flex items-center gap-3">
                                    <span>تاریخ: ${a.started_at ? new Date(a.started_at).toLocaleDateString('fa-IR') : 'نامشخص'}</span>
                                    <span>وضعیت: <strong>${a.status === 'graded' ? 'تصحیح شده' : a.status}</strong></span>
                                </div>
                            </div>

                            <div class="flex items-center gap-4 self-end sm:self-auto">
                                <div class="text-left font-mono">
                                    <div class="text-sm font-extrabold ${a.is_passed ? 'text-emerald-600' : 'text-rose-600'}">
                                        ${a.score} / ${a.total_points} نمره (${Math.round(a.percentage || 0)}%)
                                    </div>
                                    <div class="text-[10px] font-bold ${a.is_passed ? 'text-emerald-500' : 'text-rose-500'}">
                                        ${a.is_passed ? '✓ قبول شده' : '✕ نیاز به تلاش مجدد'}
                                    </div>
                                </div>

                                <button onclick="window.currentAdminViews.resetStudentAttempt(${userId}, ${a.id}, '${studentName.replace(/'/g, "\\'")}')"
                                    class="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 border border-amber-200 dark:border-amber-800/50 text-[11px] font-bold flex items-center gap-1 transition-all" title="حذف این تلاش تا دانش‌آموز بتواند دوباره آزمون دهد">
                                    <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                                    <span>مجاز کردن آزمون مجدد</span>
                                </button>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                    `}
                </div>

                <!-- Badges Earned Section -->
                ${badges.length > 0 ? `
                <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4 class="font-extrabold text-xs text-slate-700 dark:text-slate-300">مدال‌ها و نشان‌های افتخار (${badges.length})</h4>
                    <div class="flex items-center gap-2 flex-wrap">
                        ${badges.map(b => `
                        <div class="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 flex items-center gap-1.5 text-xs">
                            <span>🏅</span>
                            <span class="font-bold text-purple-800 dark:text-purple-300">${b.title_fa || 'مدال فیزیک'}</span>
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Recent XP Logs -->
                ${xpLogs.length > 0 ? `
                <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4 class="font-extrabold text-xs text-slate-700 dark:text-slate-300">آخرین تراکنش‌های امتیاز و تجربه</h4>
                    <div class="max-h-40 overflow-y-auto space-y-1.5 text-[11px]">
                        ${xpLogs.map(x => `
                        <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                            <span class="text-slate-600 dark:text-slate-300">${x.description_fa}</span>
                            <span class="font-mono font-bold ${x.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}">${x.amount >= 0 ? '+' : ''}${x.amount} XP</span>
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onclick="document.getElementById('admin-student-history-modal').remove()" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200">
                        بستن
                    </button>
                </div>
            </div>
            `;
            document.body.appendChild(modal);
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            alert('خطا در دریافت سوابق دانش‌آموز: ' + err.message);
        }
    }

    async resetStudentAttempt(userId, attemptId, studentName) {
        if (!confirm(`آیا از حذف این تلاش آزمون و بازگشایی آزمون مجدد برای «${studentName}» اطمینان دارید؟`)) return;

        try {
            const res = await window.api.resetStudentExamAttempt(userId, attemptId);
            alert(res.message_fa || 'تلاش آزمون با موفقیت حذف گردید.');
            const m = document.getElementById('admin-student-history-modal');
            if (m) m.remove();
            this.openStudentExamHistoryModal(userId, studentName);
            this.loadTabContent();
        } catch (err) {
            alert('خطا در ریست آزمون: ' + err.message);
        }
    }

    async deleteStudentConfirm(userId, username, fullName) {
        if (!confirm(`⚠️ هشدار امنیتی:\n\nآیا از حذف دائمی حساب کاربری دانش‌آموز «${fullName}» (@${username}) اطمینان دارید؟\nتمام امتیازها، سوابق شرکت در آزمون‌ها، تمرین‌ها و پاسخ‌ها برای همیشه پاک خواهند شد.`)) return;

        try {
            const res = await window.api.deleteStudent(userId);
            alert(res.message_fa || 'حساب کاربری دانش‌آموز حذف شد.');
            this.loadTabContent();
        } catch (err) {
            alert('خطا در حذف حساب کاربری: ' + err.message);
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

window.showComingSoon = function(title, description = '') {
    const existing = document.getElementById('coming-soon-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'coming-soon-toast';
    toast.className = 'fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-slate-900/95 text-white border border-cyan-500/40 shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-sm animate-bounce';
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
        </div>
        <div class="text-right">
            <span class="block text-xs font-bold text-cyan-300">به زودی (Coming Soon)</span>
            <span class="text-[11px] text-slate-300">${title} ${description ? '— ' + description : 'در نسخه بعدی سامانه فعال خواهد شد.'}</span>
        </div>
    `;
    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
        if (toast && toast.parentNode) toast.remove();
    }, 3500);
};
