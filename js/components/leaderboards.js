/**
 * Leaderboards and Badges Component
 */
async function renderLeaderboardsView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="text-center py-12">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
    `;

    try {
        const data = await window.api.getLeaderboards();
        const list = data.leaderboard || [];

        container.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-8 space-y-8">
            <div class="text-center space-y-2">
                <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                    <i data-lucide="award" class="w-6 h-6"></i>
                </div>
                <h1 class="text-2xl font-extrabold text-slate-800 dark:text-white">جدول رده‌بندی دانش‌آموزان</h1>
                <p class="text-xs text-slate-500">رتبه‌بندی بر اساس مجموع امتیازات تجربه (XP) کسب شده در درس‌ها، آزمون‌ها و مسابقات</p>
            </div>

            <!-- Top 3 Podium if >= 3 students -->
            ${list.length >= 3 ? `
            <div class="grid grid-cols-3 gap-3 items-end pt-8 pb-4 text-center">
                <!-- 2nd Place -->
                <div class="bg-white dark:bg-slate-900/95 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-md space-y-2 h-[170px] flex flex-col justify-end">
                    <span class="w-7 h-7 mx-auto rounded-full bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center">۲</span>
                    <span class="font-bold text-xs text-slate-800 dark:text-white block truncate">${list[1].display_name}</span>
                    <span class="text-[11px] text-slate-400 block">${list[1].grade_title_fa}</span>
                    <span class="text-xs font-bold text-sky-400 font-sans font-bold">${list[1].total_xp} XP</span>
                </div>
                <!-- 1st Place -->
                <div class="bg-white dark:bg-slate-900/95 rounded-3xl p-4 border border-amber-500/50 shadow-md space-y-2 h-[200px] flex flex-col justify-end relative">
                    <i data-lucide="crown" class="w-6 h-6 text-amber-500 absolute -top-3 left-1/2 -translate-x-1/2"></i>
                    <span class="w-8 h-8 mx-auto rounded-full bg-amber-400 text-slate-900 font-black text-sm flex items-center justify-center shadow">۱</span>
                    <span class="font-extrabold text-sm text-slate-900 dark:text-white block truncate">${list[0].display_name}</span>
                    <span class="text-[11px] text-slate-400 block">${list[0].grade_title_fa}</span>
                    <span class="text-sm font-black text-amber-500 font-sans">${list[0].total_xp} XP</span>
                </div>
                <!-- 3rd Place -->
                <div class="bg-white dark:bg-slate-900/95 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-md space-y-2 h-[150px] flex flex-col justify-end">
                    <span class="w-7 h-7 mx-auto rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">۳</span>
                    <span class="font-bold text-xs text-slate-800 dark:text-white block truncate">${list[2].display_name}</span>
                    <span class="text-[11px] text-slate-400 block">${list[2].grade_title_fa}</span>
                    <span class="text-xs font-bold text-sky-400 font-sans font-bold">${list[2].total_xp} XP</span>
                </div>
            </div>
            ` : ''}

            <!-- Full Ranked List -->
            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                ${list.map(s => `
                <div class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center font-sans ${s.rank <= 3 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                            ${s.rank}
                        </span>
                        <div>
                            <span class="font-bold text-sm text-slate-800 dark:text-white block">${s.display_name}</span>
                            <span class="text-xs text-slate-400">سطح ${s.current_level} • ${s.grade_title_fa}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="flex items-center gap-1 text-xs text-orange-500 font-bold" title="روزهای استمرار">
                            <i data-lucide="flame" class="w-3.5 h-3.5 fill-orange-500"></i>
                            ${s.streak}
                        </span>
                        <span class="text-sm font-black text-sky-400 font-sans font-bold">
                            ${s.total_xp} XP
                        </span>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500 font-bold">${e.message}</div>`;
    }
}

async function renderBadgesView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="text-center py-12">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
    `;

    try {
        const badges = await window.api.getBadges();

        container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <div class="text-center space-y-2">
                <div class="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                    <i data-lucide="medal" class="w-6 h-6"></i>
                </div>
                <h1 class="text-2xl font-extrabold text-slate-800 dark:text-white">نشان‌ها و مدال‌های افتخار</h1>
                <p class="text-xs text-slate-500">با استمرار در مطالعه، حل تمرین‌های سخت و شرکت در مسابقات مدال‌های ویژه کسب کنید</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                ${badges.map(b => `
                <div class="p-6 rounded-3xl border transition-all ${b.is_unlocked ? 'bg-slate-900/95 border-emerald-700/60 shadow-xl' : 'bg-slate-900/40 border-slate-800 opacity-60'}">
                    <div class="flex items-center gap-4 mb-3">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center ${b.is_unlocked ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60' : 'bg-slate-800 text-slate-500 border border-slate-700'}">
                            <i data-lucide="${b.icon || 'star'}" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-sm text-slate-800 dark:text-white">${b.title_fa}</h3>
                            <span class="text-[11px] font-bold ${b.is_unlocked ? 'text-emerald-600' : 'text-slate-400'}">
                                ${b.is_unlocked ? 'دریافت شده ✓' : 'قفل است'}
                            </span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">${b.description_fa}</p>
                    <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>پاداش: +${b.xp_bonus} XP</span>
                        ${b.awarded_at ? `<span>${window.formatPersianDate(b.awarded_at)}</span>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    } catch (e) {
        container.innerHTML = `<div class="p-6 text-center text-rose-500 font-bold">${e.message}</div>`;
    }
}

window.renderLeaderboardsView = renderLeaderboardsView;
window.renderBadgesView = renderBadgesView;
