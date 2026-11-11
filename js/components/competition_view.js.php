<?php
/**
 * QUANTUM CUT — Client Script (Pure PHP Edition)
 * Observatory Competitions & Multi-Tier League Arena
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
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
        <div class="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <span class="text-xs text-[var(--muted)] mt-3 block font-bold">بارگذاری لیگ‌های کوانتومی...</span>
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
            <div class="qc-empty space-y-3">
                <i data-lucide="trophy" class="w-12 h-12 text-[var(--muted)] mx-auto"></i>
                <h3 class="font-bold text-[var(--ink)] text-base">در حال حاضر رقابت فعالی در این لیگ ثبت نشده است</h3>
                <p class="text-xs text-[var(--muted)]">مراحل جدید لیگ هفتگی و ماهانه توسط اساتید و داوران در حال تنظیم می‌باشد.</p>
            </div>
            `;
        } else {
            compsHtml = comps.map(c => {
                const tierName = c.league_tier === 'plasma' ? 'سطح پلاسما' : (c.league_tier === 'photon' ? 'سطح فوتون' : 'سطح کوانتوم');

                return `
                <div class="qc-card qc-card--p space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="qc-chip ${c.is_active ? 'qc-chip--ok' : (c.is_closed ? '' : 'qc-chip--warn')}">
                                ${c.is_active ? '⚡ در حال برگزاری (فعال)' : (c.is_closed ? '🏁 پایان یافته' : '⏳ به زودی')}
                            </span>
                            <span class="qc-chip qc-chip--accent">
                                ${tierName}
                            </span>
                            ${c.has_negative_marking ? `
                            <span class="qc-chip qc-chip--danger" title="نمره منفی برای گزینه‌های نادرست فعال است">
                                نمره منفی فعال (${Math.round(c.negative_ratio * 100)}٪)
                            </span>
                            ` : ''}
                        </div>
                        <span class="text-xs font-semibold text-[var(--muted)]">${c.grade_title_fa}</span>
                    </div>

                    <div>
                        <h3 class="text-base sm:text-lg font-black text-[var(--ink)] mb-1 flex items-center gap-2">
                            <span>${c.title_fa}</span>
                            ${c.theme_fa ? `<span class="text-xs font-normal text-[var(--accent)] font-sans">• ${c.theme_fa}</span>` : ''}
                        </h3>
                        <p class="text-xs text-[var(--muted)] leading-relaxed">${c.description_fa || ''}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)] pt-3 border-t border-[var(--line)]">
                        <span class="flex items-center gap-1.5 text-[var(--ink-2)]">
                            <i data-lucide="timer" class="w-4 h-4 text-[var(--accent)]"></i>
                            زمان آزمون: ${c.duration_minutes || 45} دقیقه
                        </span>
                        <span class="flex items-center gap-1.5 text-[var(--ink-2)]">
                            <i data-lucide="calendar" class="w-4 h-4 text-[var(--accent-2)]"></i>
                            مهلت: ${window.formatPersianDate ? window.formatPersianDate(c.ends_at) : new Date(c.ends_at).toLocaleDateString('fa-IR')}
                        </span>
                        <span class="flex items-center gap-1.5 text-[var(--ink-2)]">
                            <i data-lucide="users" class="w-4 h-4 text-[var(--ok)]"></i>
                            ${c.participant_count} داوطلب
                        </span>
                    </div>

                    <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            ${c.user_submitted ? `
                            <span class="qc-chip qc-chip--ok">
                                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                                پاسخ شما ثبت شد • امتیاز: ${c.user_score}
                            </span>
                            ` : `
                            <span class="text-xs text-[var(--muted)]">جایزه نفر اول: ۱۵۰ XP و مدال قهرمانی کوانتوم</span>
                            `}
                        </div>

                        <div class="flex items-center gap-2">
                            <button type="button" onclick="openCompetitionModal(${c.id})" 
                                class="qc-btn qc-btn--sm">
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
            <div class="qc-card qc-card--p space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-base font-black text-[var(--ink)]">جدول رده‌بندی فصل لیگ فیزیک</h3>
                        <span class="text-xs text-[var(--accent)] font-mono">Official Quantum Championship Standings</span>
                    </div>
                    <span class="qc-chip qc-chip--mono">
                        مجموع امتیازات کل مراحل
                    </span>
                </div>

                <div class="qc-table-wrap">
                    <table class="qc-table">
                        <thead>
                            <tr>
                                <th>رتبه</th>
                                <th>نام دانش‌پژوه</th>
                                <th>پایه</th>
                                <th class="text-center">تعداد رقابت‌ها</th>
                                <th class="text-left pl-2">مجموع امتیاز</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${list.length === 0 ? `
                            <tr><td colspan="5" class="py-8 text-center text-[var(--muted)]">هنوز آماری برای این لیگ ثبت نشده است.</td></tr>
                            ` : list.map(item => `
                            <tr>
                                <td>
                                    <span class="w-6 h-6 rounded-full font-bold inline-flex items-center justify-center ${item.rank === 1 ? 'bg-[var(--warn)] text-slate-950 shadow-sm' : (item.rank === 2 ? 'bg-slate-300 text-slate-900' : (item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-[var(--surface-2)] text-[var(--muted)]'))}">
                                        ${item.rank}
                                    </span>
                                </td>
                                <td class="font-bold text-[var(--ink)]">${item.display_name}</td>
                                <td class="text-[var(--muted)]">${item.grade_title_fa}</td>
                                <td class="text-center font-mono">${item.competitions_entered}</td>
                                <td class="text-left pl-2 font-mono font-bold text-[var(--accent)] text-sm">${item.total_score}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            `;
        }

        container.innerHTML = `
        <div class="qc-adapt qc-shell qc-section space-y-6">
            <!-- Hero Header -->
            <div class="qc-telemetry-hud p-6 sm:p-8">
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-line)] text-[var(--accent)] text-xs font-bold">
                            <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                            <span>لیگ‌ها و چالش‌های علمی انجمن فیزیک سمپاد</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span class="p-2.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--accent)] shadow-sm">
                                <i data-lucide="trophy" class="w-6 h-6"></i>
                            </span>
                            <span>میدان رقابت و لیگ‌های فیزیک</span>
                        </h1>
                        <p class="text-[var(--muted)] text-xs sm:text-sm max-w-xl leading-relaxed">
                            با حل مسائل چالش‌برانگیز در زمان مشخص، سرعت عمل و دقت علمی خود را محک بزنید و در صدر تالار افتخارات قرار گیرید.
                        </p>
                    </div>

                    <!-- Navigation Tabs: Leagues vs Standings -->
                    <div class="qc-tabs p-1.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-xs font-bold shrink-0">
                        <button type="button" onclick="renderCompetitionsView('${containerId}', 'leagues', '${selectedLeagueType}')" 
                            class="qc-tab ${activeTab === 'leagues' ? 'is-active' : ''}">
                            رقابت‌های فعال
                        </button>
                        <button type="button" onclick="renderCompetitionsView('${containerId}', 'standings', '${selectedLeagueType}')" 
                            class="qc-tab ${activeTab === 'standings' ? 'is-active' : ''}">
                            رده‌بندی کل فصل
                        </button>
                    </div>
                </div>

                <!-- League Type Filter Chips -->
                <div class="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-[var(--line)]">
                    ${leagueTypes.map(lt => `
                    <button type="button" onclick="renderCompetitionsView('${containerId}', '${activeTab}', '${lt.id}')"
                        class="qc-chip ${selectedLeagueType === lt.id ? 'qc-chip--accent' : ''} cursor-pointer">
                        ${lt.title}
                    </button>
                    `).join('')}
                </div>
            </div>

            <!-- Content Area -->
            ${activeTab === 'standings' ? standingsHtml : `
            <div class="space-y-4">
                ${compsHtml}
            </div>
            `}
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) {
            setTimeout(window.renderMathInPage, 60);
        }
    } catch (e) {
        container.innerHTML = `<div class="qc-empty"><span class="qc-empty__title">${e.message}</span></div>`;
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
        modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md';

        const canTakeExam = !comp.is_closed && !comp.user_submission && comp.questions.length > 0;
        const durationMins = comp.duration_minutes || 45;
        activeCompTotalSeconds = durationMins * 60;

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

        const cacheKey = `quantum_comp_${compId}`;
        const cachedAnswers = canTakeExam ? JSON.parse(localStorage.getItem(cacheKey) || '{}') : {};

        modalDiv.innerHTML = `
        <div class="qc-card qc-card--p w-full max-w-2xl max-h-[92vh] overflow-y-auto space-y-5 relative">
            <!-- Anti-Cheat Focus Warning Banner -->
            <div id="comp-blur-warning" class="hidden p-3 rounded-xl bg-[var(--danger-soft)] border border-[var(--danger)] text-[var(--danger)] text-xs font-bold flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                <span id="comp-blur-text">هشدار: خروج از صفحه آزمون ثبت شد! لطفاً تب را تغییر ندهید.</span>
            </div>

            <div class="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="qc-chip qc-chip--accent">
                            ${comp.league_type === 'speed_cup' ? 'جام سرعت' : (comp.league_type === 'monthly' ? 'جام ماهانه' : 'لیگ هفتگی')}
                        </span>
                        ${comp.has_negative_marking ? `
                        <span class="qc-chip qc-chip--danger">
                            نمره منفی (${Math.round(comp.negative_ratio * 100)}٪)
                        </span>
                        ` : ''}
                    </div>
                    <h3 class="font-black text-lg text-[var(--ink)]">${comp.title_fa}</h3>
                    <span class="text-xs text-[var(--muted)]">مهلت پایان: ${window.formatPersianDate ? window.formatPersianDate(comp.ends_at) : new Date(comp.ends_at).toLocaleDateString('fa-IR')}</span>
                </div>
                <button type="button" onclick="closeCompetitionModal()" class="qc-icon-btn">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>

            <!-- Live Timer Card (If taking exam) -->
            ${canTakeExam ? `
            <div class="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
                        <i data-lucide="clock" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="text-[10px] text-[var(--muted)] block">زمان باقی‌مانده آزمون:</span>
                        <span id="comp-countdown" class="text-lg font-black font-mono text-[var(--accent)] tracking-wider">
                            ${Math.floor(activeCompSecondsLeft / 60)}:00
                        </span>
                    </div>
                </div>

                <div class="text-left">
                    <span class="text-[10px] text-[var(--ok)] font-semibold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse"></span>
                        ذخیره خودکار پاسخ‌ها فعال است
                    </span>
                    <span class="text-[10px] text-[var(--muted)]">سرعت عمل ملاک شکست تساوی است</span>
                </div>
            </div>
            ` : ''}

            ${comp.description_fa ? `<p class="text-xs text-[var(--muted)] leading-relaxed">${comp.description_fa}</p>` : ''}

            <!-- Questions Form if not submitted and active -->
            ${canTakeExam ? `
            <form id="comp-submit-form" onsubmit="handleCompetitionSubmit(event, ${comp.id})" class="space-y-4">
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-xs text-[var(--ink-2)]">پرسش‌های این مرحله (${comp.questions.length} سؤال):</h4>
                    <span class="text-[10px] text-[var(--muted)] font-mono">Auto-saved to LocalStorage</span>
                </div>

                ${comp.questions.map((q, idx) => {
                    const savedVal = cachedAnswers[String(q.id)] || '';
                    return `
                    <div class="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="qc-chip qc-chip--mono">
                                سؤال ${idx + 1}
                            </span>
                            <span class="text-xs text-[var(--muted)] font-mono">${q.points} نمره</span>
                        </div>

                        <p class="text-xs sm:text-sm font-bold text-[var(--ink)] leading-relaxed">${q.prompt_fa}</p>

                        ${q.question_type === 'mcq' ? `
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            ${q.options.map(opt => `
                            <label class="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent-line)] cursor-pointer text-xs transition-colors">
                                <input type="radio" name="comp_q_${q.id}" value="${opt.option_key}" 
                                    ${savedVal === opt.option_key ? 'checked' : ''}
                                    onchange="saveCompAnswerLocally(${comp.id}, ${q.id}, '${opt.option_key}')"
                                    class="text-[var(--accent)] focus:ring-[var(--accent)]" />
                                <span class="font-bold text-[var(--accent)] font-mono">${opt.option_key}:</span>
                                <span class="text-[var(--ink-2)]">${opt.text_fa}</span>
                            </label>
                            `).join('')}
                        </div>
                        ` : `
                        <textarea name="comp_q_${q.id}" rows="3" placeholder="پاسخ تشریحی خود را اینجا بنویسید..."
                            oninput="saveCompAnswerLocally(${comp.id}, ${q.id}, this.value)"
                            class="qc-textarea text-xs">${savedVal}</textarea>
                        `}
                    </div>
                    `;
                }).join('')}

                <div class="text-center pt-2">
                    <button type="submit" class="qc-btn qc-btn--lg qc-btn--block">
                        <i data-lucide="send" class="w-4 h-4"></i>
                        <span>ارسال نهایی پاسخ‌ها و ثبت در لیگ</span>
                    </button>
                </div>
            </form>
            ` : ''}

            <!-- Official Solution if published -->
            ${comp.solutions_published && comp.official_solution_fa ? `
            <div class="p-4 rounded-xl bg-[var(--ok-soft)] border border-[var(--ok)] text-[var(--ink)] text-xs space-y-1.5">
                <span class="font-black text-[var(--ok)] flex items-center gap-1.5 text-xs">
                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                    پاسخ تشریحی و راهنمای رسمی طراح سؤالات:
                </span>
                <p class="leading-relaxed text-justify">${comp.official_solution_fa}</p>
            </div>
            ` : ''}

            <!-- Leaderboard -->
            <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-[var(--ink)]">جدول برترین‌های این رقابت:</h4>
                    <span class="text-[10px] text-[var(--muted)]">امتیاز بالاتر • زمان کمتر</span>
                </div>

                <div class="space-y-1.5 max-h-52 overflow-y-auto">
                    ${board.length === 0 ? '<p class="text-xs text-[var(--muted)] py-3 text-center">هنوز پاسخی در این رقابت ثبت نشده است.</p>' : board.map(b => `
                    <div class="flex items-center justify-between p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--line)] text-xs">
                        <div class="flex items-center gap-2.5">
                            <span class="w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${b.rank === 1 ? 'bg-[var(--warn)] text-slate-950 font-bold' : (b.rank === 2 ? 'bg-slate-300 text-slate-900' : (b.rank === 3 ? 'bg-amber-700 text-white' : 'bg-[var(--surface)] text-[var(--muted)]'))}">
                                ${b.rank}
                            </span>
                            <span class="font-bold text-[var(--ink)]">${b.display_name}</span>
                            <span class="text-[var(--muted)] text-[10px]">(${b.grade_title_fa})</span>
                        </div>
                        <div class="flex items-center gap-3">
                            ${b.time_spent_seconds ? `
                            <span class="text-[10px] text-[var(--muted)] font-mono">${b.time_spent_seconds} s</span>
                            ` : ''}
                            <span class="font-black text-[var(--accent)] font-mono text-xs">
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
        if (window.renderMathInPage) {
            setTimeout(window.renderMathInPage, 60);
        }

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

    const display = document.getElementById('comp-countdown');
    if (display) {
        const m = Math.floor(activeCompSecondsLeft / 60);
        const s = activeCompSecondsLeft % 60;
        display.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    activeCompInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeCompStartTime) / 1000);
        activeCompSecondsLeft = Math.max(0, activeCompTotalSeconds - elapsed);

        const display = document.getElementById('comp-countdown');
        if (display) {
            const m = Math.floor(activeCompSecondsLeft / 60);
            const s = activeCompSecondsLeft % 60;
            display.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
            if (activeCompSecondsLeft <= 120) {
                display.classList.add('text-[var(--danger)]', 'animate-pulse');
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
        const cached = JSON.parse(localStorage.getItem(`quantum_comp_${compId}`) || '{}');
        Object.assign(answers, cached);
    }

    const startKey = `quantum_comp_start_${compId}`;
    const startedAt = parseInt(localStorage.getItem(startKey) || activeCompStartTime || Date.now(), 10);
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));

    try {
        const res = await window.api.submitCompetition(compId, answers, elapsedSeconds);
        localStorage.removeItem(`quantum_comp_${compId}`);
        localStorage.removeItem(`quantum_comp_start_${compId}`);
        localStorage.removeItem(`quantum_comp_blur_${compId}`);

        if (window.store && window.store.playSound) {
            window.store.playSound('celebrate');
        }

        const xpAwarded = res.xp_earned || 50;
        if (window.store && window.store.showXpToast) {
            window.store.showXpToast(xpAwarded, 'شرکت در لیگ و مسابقه کوانتومی');
        }
        if (window.store && window.store.refreshUser) {
            await window.store.refreshUser();
        }

        alert(`تبریک! ${res.message_fa}\nامتیاز آزمون: ${res.score}\nزمان صرف‌شده: ${elapsedSeconds} ثانیه\nامتیاز تجربه: +${xpAwarded} XP`);
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
