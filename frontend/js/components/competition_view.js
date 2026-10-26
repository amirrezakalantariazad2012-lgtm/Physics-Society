/**
 * QUANTUM CUT — Advanced Competitions & Multi-Tier League Arena
 * Supports: Weekly Leagues, Monthly Masters, Seasonal Tournaments, Live Timers,
 * LocalStorage Auto-Save, Anti-Cheat Focus Tracking, and Tie-breaking by Speed.
 */

let activeCompInterval = null;
let activeCompSecondsLeft = 0;
let activeCompTotalSeconds = 0;
let activeCompStartTime = 0;
let activeCompBlurCount = 0;

async function renderCompetitionsView(containerId, activeTab = 'leagues', selectedLeagueType = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="text-center py-16">
        <div class="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <span class="text-xs text-slate-400 mt-3 block font-bold">بارگذاری لیگ‌های کوانتومی...</span>
    </div>
    `;

    try {
        const comps = await window.api.getCompetitions(selectedLeagueType || null);
        const standingsData = (activeTab === 'standings') 
            ? await window.api.getLeagueStandings(selectedLeagueType || 'weekly').catch(() => ({ standings: [] }))
            : null;

        const leagueTypes = [
            { id: '', title: 'همه چالش‌ها' },
            { id: 'weekly', title: 'لیگ هفتگی (Weekly)' },
            { id: 'monthly', title: 'جام ماهانه کوانتومی (Masters)' },
            { id: 'speed_cup', title: 'جام سرعت (Speed Cup)' }
        ];

        let compsHtml = '';
        if (comps.length === 0) {
            compsHtml = `
            <div class="text-center py-16 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-3">
                <i data-lucide="trophy" class="w-12 h-12 text-slate-600 mx-auto"></i>
                <h3 class="font-bold text-white text-lg">در حال حاضر رقابت فعالی در این لیگ ثبت نشده است</h3>
                <p class="text-xs text-slate-400">مراحل جدید لیگ هفتگی و ماهانه توسط اساتید و داوران در حال تنظیم می‌باشد.</p>
            </div>
            `;
        } else {
            compsHtml = comps.map(c => {
                const tierColor = c.league_tier === 'plasma' 
                    ? 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40'
                    : (c.league_tier === 'photon' ? 'border-amber-500/40 text-amber-300 bg-amber-950/40' : 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40');

                const tierName = c.league_tier === 'plasma' ? 'سطح پلاسما' : (c.league_tier === 'photon' ? 'سطح فوتون' : 'سطح کوانتوم');

                return `
                <div class="physics-card bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl space-y-4 relative overflow-hidden">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full text-xs font-bold ${c.is_active ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' : (c.is_closed ? 'bg-slate-800 text-slate-400' : 'bg-amber-950/60 text-amber-300')}">
                                ${c.is_active ? '⚡ در حال برگزاری (فعال)' : (c.is_closed ? '🏁 پایان یافته' : '⏳ به زودی')}
                            </span>
                            <span class="px-3 py-1 rounded-full text-xs font-bold border ${tierColor}">
                                ${tierName}
                            </span>
                            ${c.has_negative_marking ? `
                            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40" title="نمره منفی برای گزینه‌های نادرست فعال است">
                                نمره منفی فعال (${Math.round(c.negative_ratio * 100)}٪)
                            </span>
                            ` : ''}
                        </div>
                        <span class="text-xs font-semibold text-slate-400">${c.grade_title_fa}</span>
                    </div>

                    <div>
                        <h3 class="text-xl font-black text-white mb-1.5 flex items-center gap-2">
                            <span>${c.title_fa}</span>
                            ${c.theme_fa ? `<span class="text-xs font-normal text-cyan-400 font-sans">• ${c.theme_fa}</span>` : ''}
                        </h3>
                        <p class="text-xs text-slate-300 leading-relaxed">${c.description_fa || ''}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-5 text-xs text-slate-400 pt-3 border-t border-slate-800">
                        <span class="flex items-center gap-1.5 text-slate-300">
                            <i data-lucide="timer" class="w-4 h-4 text-cyan-400"></i>
                            زمان آزمون: ${c.duration_minutes || 45} دقیقه
                        </span>
                        <span class="flex items-center gap-1.5 text-slate-300">
                            <i data-lucide="calendar" class="w-4 h-4 text-blue-400"></i>
                            مهلت: ${window.formatPersianDate ? window.formatPersianDate(c.ends_at) : new Date(c.ends_at).toLocaleDateString('fa-IR')}
                        </span>
                        <span class="flex items-center gap-1.5 text-slate-300">
                            <i data-lucide="users" class="w-4 h-4 text-emerald-400"></i>
                            ${c.participant_count} داوطلب
                        </span>
                    </div>

                    <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            ${c.user_submitted ? `
                            <span class="text-xs font-bold text-emerald-300 bg-emerald-950/50 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 inline-flex items-center gap-1.5">
                                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
                                پاسخ شما ثبت شد • امتیاز: ${c.user_score}
                            </span>
                            ` : `
                            <span class="text-xs text-slate-400">جایزه نفر اول: ۱۵۰ XP و مدال قهرمانی کوانتوم</span>
                            `}
                        </div>

                        <div class="flex items-center gap-2">
                            <button onclick="openCompetitionModal(${c.id})" 
                                class="btn-duo-yellow text-slate-900 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md hover:scale-105 transition-all">
                                ${c.is_active && !c.user_submitted ? '⚡ ورود به میدان رقابت' : 'مشاهده کارنامه و جدول لیگ'}
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }

        // Render Standings Table if tab is 'standings'
        let standingsHtml = '';
        if (activeTab === 'standings' && standingsData) {
            const list = standingsData.standings || [];
            standingsHtml = `
            <div class="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-black text-white">جدول رده‌بندی فصل لیگ فیزیک</h3>
                        <span class="text-xs text-cyan-400 font-sans">Official Quantum Championship Standings</span>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                        مجموع امتیازات کل مراحل
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs text-slate-300">
                        <thead>
                            <tr class="border-b border-slate-800 text-slate-400 font-bold">
                                <th class="pb-3 pr-2">رتبه</th>
                                <th class="pb-3">نام دانش‌پژوه</th>
                                <th class="pb-3">پایه</th>
                                <th class="pb-3 text-center">تعداد رقابت‌ها</th>
                                <th class="pb-3 text-left pl-2">مجموع امتیاز مسابقات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            ${list.length === 0 ? `
                            <tr><td colspan="5" class="py-8 text-center text-slate-500">هنوز آماری برای این لیگ ثبت نشده است.</td></tr>
                            ` : list.map(item => `
                            <tr class="hover:bg-slate-800/40 transition-colors">
                                <td class="py-3 pr-2">
                                    <span class="w-6 h-6 rounded-full font-bold inline-flex items-center justify-center ${item.rank === 1 ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20' : (item.rank === 2 ? 'bg-slate-300 text-slate-900' : (item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'))}">
                                        ${item.rank}
                                    </span>
                                </td>
                                <td class="py-3 font-bold text-white">${item.display_name}</td>
                                <td class="py-3 text-slate-400">${item.grade_title_fa}</td>
                                <td class="py-3 text-center font-mono">${item.competitions_entered}</td>
                                <td class="py-3 text-left pl-2 font-mono font-bold text-cyan-400 text-sm">${item.total_score}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `;
        }

        container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <!-- Hero Header -->
            <div class="text-center space-y-3">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold cyber-glow-cyan">
                    <i data-lucide="zap" class="w-4 h-4 text-cyan-400 fill-cyan-400"></i>
                    <span>لیگ‌ها و چالش‌های علمی انجمن فیزیک شهید بهشتی دو دوره اول</span>
                </div>
                <h1 class="text-3xl sm:text-4xl font-extrabold text-white">میدان رقابت و لیگ‌های فیزیک</h1>
                <p class="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    با حل مسائل چالش‌برانگیز در زمان مشخص، سرعت عمل و دقت علمی خود را محک بزنید، مدال‌های ویژه کوانتوم دریافت کنید و در صدر تالار افتخارات قرار گیرید.
                </p>

                <!-- Navigation Tabs: Leagues vs Standings -->
                <div class="flex justify-center pt-2">
                    <div class="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
                        <button onclick="renderCompetitionsView('${containerId}', 'leagues', '${selectedLeagueType}')" 
                            class="px-5 py-2 rounded-xl transition-all ${activeTab === 'leagues' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}">
                            رقابت‌های فعال
                        </button>
                        <button onclick="renderCompetitionsView('${containerId}', 'standings', '${selectedLeagueType}')" 
                            class="px-5 py-2 rounded-xl transition-all ${activeTab === 'standings' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}">
                            رده‌بندی کل فصل (Standings)
                        </button>
                    </div>
                </div>

                <!-- League Type Filter Chips -->
                <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
                    ${leagueTypes.map(lt => `
                    <button onclick="renderCompetitionsView('${containerId}', '${activeTab}', '${lt.id}')"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${selectedLeagueType === lt.id ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'}">
                        ${lt.title}
                    </button>
                    `).join('')}
                </div>
            </div>

            <!-- Content Area -->
            ${activeTab === 'standings' ? standingsHtml : `
            <div class="space-y-6">
                ${compsHtml}
            </div>
            `}
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500 font-bold">${e.message}</div>`;
    }
}

async function openCompetitionModal(compId) {
    if (activeCompInterval) {
        clearInterval(activeCompInterval);
        activeCompInterval = null;
    }

    try {
        const comp = await window.api.getCompetition(compId);
        const board = await window.api.getCompetitionLeaderboard(compId).catch(() => []);

        const existingModal = document.getElementById('comp-active-modal');
        if (existingModal) existingModal.remove();

        const modalDiv = document.createElement('div');
        modalDiv.id = 'comp-active-modal';
        modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md';

        const canTakeExam = !comp.is_closed && !comp.user_submission && comp.questions.length > 0;
        const durationMins = comp.duration_minutes || 45;
        activeCompTotalSeconds = durationMins * 60;

        // Persistent Competition Start Time & Anti-Cheat tracking across reloads/exits
        const startKey = `quantum_comp_start_${compId}`;
        let startedAt = parseInt(localStorage.getItem(startKey), 10);
        if (canTakeExam && !startedAt) {
            startedAt = Date.now();
            localStorage.setItem(startKey, startedAt.toString());
        } else if (!startedAt) {
            startedAt = Date.now();
        }

        activeCompStartTime = startedAt;
        const elapsedSecs = Math.floor((Date.now() - startedAt) / 1000);
        activeCompSecondsLeft = Math.max(0, activeCompTotalSeconds - elapsedSecs);
        activeCompBlurCount = parseInt(localStorage.getItem(`quantum_comp_blur_${compId}`) || '0', 10);

        if (canTakeExam && activeCompSecondsLeft <= 0) {
            alert('⚠️ زمان مجاز شما برای شرکت در این رقابت به پایان رسیده است! پاسخ‌های قبلی شما به صورت خودکار ارسال خواهد شد.');
            autoSubmitExpiredCompetition(compId);
            return;
        }

        // Load cached answers from LocalStorage if taking exam
        const cacheKey = `quantum_comp_${compId}`;
        const cachedAnswers = canTakeExam ? JSON.parse(localStorage.getItem(cacheKey) || '{}') : {};

        modalDiv.innerHTML = `
        <div class="bg-slate-900 text-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-cyan-500/40 cyber-glow-cyan shadow-2xl max-h-[92vh] overflow-y-auto space-y-6 relative">
            
            <!-- Anti-Cheat Focus Warning Banner -->
            <div id="comp-blur-warning" class="hidden p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center gap-2 animate-shake">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400"></i>
                <span id="comp-blur-text">هشدار: خروج از صفحه آزمون ثبت شد! لطفاً تب را تغییر ندهید.</span>
            </div>

            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-500/40">
                            ${comp.league_type === 'speed_cup' ? 'جام سرعت' : (comp.league_type === 'monthly' ? 'جام ماهانه' : 'لیگ هفتگی')}
                        </span>
                        ${comp.has_negative_marking ? `
                        <span class="text-[11px] px-2 py-0.5 rounded-full bg-rose-950/50 text-rose-300 border border-rose-500/30">
                            نمره منفی (${Math.round(comp.negative_ratio * 100)}٪)
                        </span>
                        ` : ''}
                    </div>
                    <h3 class="font-black text-xl text-white">${comp.title_fa}</h3>
                    <span class="text-xs text-slate-400">مهلت پایان: ${window.formatPersianDate ? window.formatPersianDate(comp.ends_at) : new Date(comp.ends_at).toLocaleDateString('fa-IR')}</span>
                </div>
                <button onclick="closeCompetitionModal()" class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Live Timer Card (If taking exam) -->
            ${canTakeExam ? `
            <div class="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <i data-lucide="clock" class="w-4 h-4 animate-spin" style="animation-duration: 6s;"></i>
                    </div>
                    <div>
                        <span class="text-[11px] text-slate-400 block">زمان باقی‌مانده آزمون:</span>
                        <span id="comp-countdown" class="text-lg font-black font-mono text-cyan-300 tracking-wider">
                            ${Math.floor(activeCompSecondsLeft / 60)}:00
                        </span>
                    </div>
                </div>

                <div class="text-left">
                    <span class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ذخیره خودکار پاسخ‌ها فعال است
                    </span>
                    <span class="text-[10px] text-slate-400">سرعت عمل ملاک شکست تساوی است</span>
                </div>
            </div>
            ` : ''}

            ${comp.description_fa ? `<p class="text-xs text-slate-300 leading-relaxed">${comp.description_fa}</p>` : ''}

            <!-- Questions Form if not submitted and active -->
            ${canTakeExam ? `
            <form id="comp-submit-form" onsubmit="handleCompetitionSubmit(event, ${comp.id})" class="space-y-6">
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-sm text-cyan-300">پرسش‌های این مرحله (${comp.questions.length} سؤال):</h4>
                    <span class="text-xs text-slate-400 font-mono">Auto-saved to LocalStorage</span>
                </div>

                ${comp.questions.map((q, idx) => {
                    const savedVal = cachedAnswers[String(q.id)] || '';
                    return `
                    <div class="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3.5">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-black px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                سؤال ${idx + 1}
                            </span>
                            <span class="text-xs text-slate-400 font-mono">${q.points} نمره</span>
                        </div>

                        <p class="text-sm font-bold text-white leading-relaxed">${q.prompt_fa}</p>

                        ${q.question_type === 'mcq' ? `
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            ${q.options.map(opt => `
                            <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:border-cyan-500/60 cursor-pointer text-xs transition-colors">
                                <input type="radio" name="comp_q_${q.id}" value="${opt.option_key}" 
                                    ${savedVal === opt.option_key ? 'checked' : ''}
                                    onchange="saveCompAnswerLocally(${comp.id}, ${q.id}, '${opt.option_key}')"
                                    class="text-cyan-400 focus:ring-cyan-500" />
                                <span class="font-bold text-cyan-300 font-sans">${opt.option_key}:</span>
                                <span class="text-slate-200">${opt.text_fa}</span>
                            </label>
                            `).join('')}
                        </div>
                        ` : `
                        <textarea name="comp_q_${q.id}" rows="3" placeholder="پاسخ تشریحی خود را اینجا بنویسید..."
                            oninput="saveCompAnswerLocally(${comp.id}, ${q.id}, this.value)"
                            class="w-full p-3 text-xs rounded-xl border border-slate-700 bg-slate-900/90 text-white outline-none focus:border-cyan-500 transition-colors">${savedVal}</textarea>
                        `}
                    </div>
                    `;
                }).join('')}

                <div class="text-center pt-2">
                    <button type="submit" class="btn-duo-green text-white font-black px-10 py-3.5 rounded-2xl text-sm shadow-lg hover:scale-105 transition-all">
                        🚀 ارسال نهایی پاسخ‌ها و ثبت در لیگ
                    </button>
                </div>
            </form>
            ` : ''}

            <!-- Official Solution if published -->
            ${comp.solutions_published && comp.official_solution_fa ? `
            <div class="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                <span class="font-black text-emerald-300 flex items-center gap-1.5 text-sm">
                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                    پاسخ تشریحی و راهنمای رسمی طراح سؤالات:
                </span>
                <p class="leading-relaxed text-justify">${comp.official_solution_fa}</p>
            </div>
            ` : ''}

            <!-- Leaderboard -->
            <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between">
                    <h4 class="font-black text-sm text-white">جدول برترین‌های این رقابت:</h4>
                    <span class="text-[11px] text-slate-400">امتیاز بالاتر • زمان کمتر</span>
                </div>

                <div class="space-y-2 max-h-56 overflow-y-auto">
                    ${board.length === 0 ? '<p class="text-xs text-slate-400 py-3 text-center">هنوز پاسخی در این رقابت ثبت نشده است.</p>' : board.map(b => `
                    <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                        <div class="flex items-center gap-3">
                            <span class="w-6 h-6 rounded-full font-bold flex items-center justify-center ${b.rank === 1 ? 'bg-amber-400 text-slate-900 shadow-sm shadow-amber-400/20' : (b.rank === 2 ? 'bg-slate-300 text-slate-900' : (b.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-700 text-slate-300'))}">
                                ${b.rank}
                            </span>
                            <span class="font-bold text-white">${b.display_name}</span>
                            <span class="text-slate-400 text-[11px]">(${b.grade_title_fa})</span>
                        </div>
                        <div class="flex items-center gap-3">
                            ${b.time_spent_seconds ? `
                            <span class="text-[11px] text-slate-400 font-mono">${b.time_spent_seconds} ثانیه</span>
                            ` : ''}
                            <span class="font-black text-cyan-400 font-mono text-sm">
                                ${b.score} نمره
                            </span>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(modalDiv);
        if (window.lucide) window.lucide.createIcons();

        // Start Live Timer and Anti-Cheat if active
        if (canTakeExam) {
            startCompetitionCountdown(compId);
            setupAntiCheatFocusTracking(compId);
        }

    } catch (e) {
        alert(e.message);
    }
}

function startCompetitionCountdown(compId) {
    if (activeCompInterval) clearInterval(activeCompInterval);

    // Immediate display update
    const display = document.getElementById('comp-countdown');
    if (display) {
        const m = Math.floor(activeCompSecondsLeft / 60);
        const s = activeCompSecondsLeft % 60;
        display.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    activeCompInterval = setInterval(() => {
        // Enforce true elapsed time against start timestamp to prevent tab sleep hacks
        const elapsed = Math.floor((Date.now() - activeCompStartTime) / 1000);
        activeCompSecondsLeft = Math.max(0, activeCompTotalSeconds - elapsed);

        const display = document.getElementById('comp-countdown');
        if (display) {
            const m = Math.floor(activeCompSecondsLeft / 60);
            const s = activeCompSecondsLeft % 60;
            display.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
            if (activeCompSecondsLeft <= 120) {
                display.classList.add('text-rose-400', 'animate-pulse');
            }
        }

        if (activeCompSecondsLeft <= 0) {
            clearInterval(activeCompInterval);
            activeCompInterval = null;
            alert('⚠️ زمان مجاز آزمون به پایان رسید! پاسخ‌های شما به طور خودکار ارسال خواهند شد.');
            const form = document.getElementById('comp-submit-form');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            } else {
                autoSubmitExpiredCompetition(compId);
            }
        }
    }, 1000);
}

function setupAntiCheatFocusTracking(compId) {
    const warning = document.getElementById('comp-blur-warning');
    const warningText = document.getElementById('comp-blur-text');

    const handleFocusLoss = () => {
        if (!document.getElementById('comp-active-modal')) return;
        activeCompBlurCount++;
        localStorage.setItem(`quantum_comp_blur_${compId}`, activeCompBlurCount.toString());
        if (warning && warningText) {
            warning.classList.remove('hidden');
            warningText.textContent = `⚠️ اخطار امنیتی: خروج از برگه آزمون یا تغییر تب (${activeCompBlurCount} بار) در لاگ سامانه ثبت شد!`;
            if (window.store && window.store.playSound) {
                window.store.playSound('incorrect');
            }
            setTimeout(() => {
                if (warning) warning.classList.add('hidden');
            }, 6000);
        }
    };

    window.addEventListener('blur', handleFocusLoss, { once: false });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) handleFocusLoss();
    });

    // Anti-cheat: Block right-click context menu
    const modal = document.getElementById('comp-active-modal');
    if (modal) {
        modal.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (warning && warningText) {
                warning.classList.remove('hidden');
                warningText.textContent = '🔒 راست‌کلیک در محیط آزمون به دلایل امنیتی غیرفعال است.';
                setTimeout(() => { if (warning) warning.classList.add('hidden'); }, 3000);
            }
        });
    }

    // Anti-cheat: Block devtools & inspect shortcuts
    const keyHandler = (e) => {
        if (!document.getElementById('comp-active-modal')) {
            window.removeEventListener('keydown', keyHandler);
            return;
        }
        if (e.key === 'F12' || (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 'i' || e.key === 'j'))) {
            e.preventDefault();
            if (warning && warningText) {
                warning.classList.remove('hidden');
                warningText.textContent = '🔒 کلیدهای میانبر و ابزارهای توسعه در حین آزمون مسدود هستند.';
                setTimeout(() => { if (warning) warning.classList.add('hidden'); }, 3000);
            }
        }
    };
    window.addEventListener('keydown', keyHandler);
}

function saveCompAnswerLocally(compId, questionId, value) {
    const cacheKey = `quantum_comp_${compId}`;
    const answers = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    answers[String(questionId)] = value;
    localStorage.setItem(cacheKey, JSON.stringify(answers));
}

function closeCompetitionModal() {
    if (activeCompInterval) {
        clearInterval(activeCompInterval);
        activeCompInterval = null;
    }
    const modal = document.getElementById('comp-active-modal');
    if (modal) modal.remove();
}

async function autoSubmitExpiredCompetition(compId) {
    const cacheKey = `quantum_comp_${compId}`;
    const answers = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    const startKey = `quantum_comp_start_${compId}`;
    const startedAt = parseInt(localStorage.getItem(startKey) || Date.now(), 10);
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
    try {
        await window.api.submitCompetition(compId, answers, elapsedSeconds);
    } catch (e) {
        console.warn('Auto submit competition notice:', e);
    } finally {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(startKey);
        localStorage.removeItem(`quantum_comp_blur_${compId}`);
        closeCompetitionModal();
        renderCompetitionsView('app-main-content');
    }
}

async function handleCompetitionSubmit(e, compId) {
    if (e && e.preventDefault) e.preventDefault();
    if (activeCompInterval) {
        clearInterval(activeCompInterval);
        activeCompInterval = null;
    }

    const form = document.getElementById('comp-submit-form') || (e ? e.target : null);
    const answers = {};

    if (form && form.elements) {
        const formData = new FormData(form);
        for (let [key, val] of formData.entries()) {
            const qId = key.replace('comp_q_', '');
            answers[qId] = val;
        }
    } else {
        // Fallback to local storage
        const cached = JSON.parse(localStorage.getItem(`quantum_comp_${compId}`) || '{}');
        Object.assign(answers, cached);
    }

    const startKey = `quantum_comp_start_${compId}`;
    const startedAt = parseInt(localStorage.getItem(startKey) || activeCompStartTime || Date.now(), 10);
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));

    try {
        const res = await window.api.submitCompetition(compId, answers, elapsedSeconds);
        // Clear local storage for this competition
        localStorage.removeItem(`quantum_comp_${compId}`);
        localStorage.removeItem(`quantum_comp_start_${compId}`);
        localStorage.removeItem(`quantum_comp_blur_${compId}`);

        if (window.store && window.store.playSound) {
            window.store.playSound('celebrate');
        }

        alert(`تبریک! ${res.message_fa}\nامتیاز کسب‌شده: ${res.score}\nزمان صرف‌شده: ${elapsedSeconds} ثانیه`);
        closeCompetitionModal();
        renderCompetitionsView('app-main-content');
    } catch (err) {
        alert(err.message);
    }
}

window.renderCompetitionsView = renderCompetitionsView;
window.openCompetitionModal = openCompetitionModal;
window.closeCompetitionModal = closeCompetitionModal;
window.handleCompetitionSubmit = handleCompetitionSubmit;
window.saveCompAnswerLocally = saveCompAnswerLocally;
window.autoSubmitExpiredCompetition = autoSubmitExpiredCompetition;
