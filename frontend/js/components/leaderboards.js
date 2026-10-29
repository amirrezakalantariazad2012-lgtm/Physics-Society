/**
 * QUANTUM CUT — Futuristic Scientific Leaderboard & Achievements Arena
 */
async function renderLeaderboardsView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="text-center py-16">
        <div class="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <span class="text-xs text-slate-400 mt-3 block font-mono">CALCULATING QUANTUM XP STANDINGS...</span>
    </div>
    `;

    try {
        const data = await window.api.getLeaderboards();
        const list = data.leaderboard || [];
        const currentUser = window.store.currentUser;

        container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-6 space-y-8">
            <!-- Header Banner -->
            <div class="text-center space-y-2 relative overflow-hidden py-4">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-1">
                    <i data-lucide="award" class="w-3.5 h-3.5 text-cyan-400"></i>
                    <span>LEAGUE OF RESEARCHERS • رتبه‌بندی کشوری</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">جدول افتخارات و رتبه‌بندی نخبگان فیزیک</h1>
                <p class="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">محاسبه برخط بر مبنای دفترکل امتیازات تجربه (XP)، حل چالش‌های مفهومی و برتری در لیگ‌های کوانتومی</p>
            </div>

            <!-- Top 3 Holographic Podium -->
            ${list.length >= 3 ? `
            <div class="grid grid-cols-3 gap-3 sm:gap-4 items-end pt-10 pb-6 text-center">
                <!-- 2nd Place: Silver -->
                <div class="quantum-card p-4 sm:p-5 border-cyan-500/20 shadow-xl space-y-2 h-[190px] sm:h-[210px] flex flex-col justify-end relative group">
                    <div class="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl bg-slate-800 text-slate-300 border border-slate-600 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">۲</div>
                    <span class="font-bold text-xs sm:text-sm text-white block truncate">${list[1].display_name}</span>
                    <span class="text-[10px] sm:text-[11px] text-slate-400 block">${list[1].grade_title_fa || 'پایه هفتم'}</span>
                    <span class="text-xs sm:text-sm font-black text-cyan-400 font-mono">${list[1].total_xp} XP</span>
                </div>
                
                <!-- 1st Place: Gold Champion -->
                <div class="quantum-card p-5 sm:p-6 border-amber-500/50 shadow-2xl space-y-2.5 h-[230px] sm:h-[260px] flex flex-col justify-end relative group bg-gradient-to-t from-slate-900/90 via-amber-950/20 to-slate-900/90">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <i data-lucide="crown" class="w-5 h-5 text-amber-400 animate-pulse"></i>
                    </div>
                    <div class="w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center shadow-lg shadow-amber-500/30">۱</div>
                    <span class="font-black text-sm sm:text-base text-white block truncate">${list[0].display_name}</span>
                    <span class="text-[11px] text-amber-300/80 block">${list[0].grade_title_fa || 'پایه نهم'} • پیشتاز لیگ</span>
                    <span class="text-sm sm:text-base font-black text-amber-400 font-mono tracking-tight">${list[0].total_xp} XP</span>
                </div>

                <!-- 3rd Place: Bronze -->
                <div class="quantum-card p-4 sm:p-5 border-amber-800/30 shadow-xl space-y-2 h-[170px] sm:h-[190px] flex flex-col justify-end relative group">
                    <div class="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl bg-amber-950 text-amber-500 border border-amber-800 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">۳</div>
                    <span class="font-bold text-xs sm:text-sm text-white block truncate">${list[2].display_name}</span>
                    <span class="text-[10px] sm:text-[11px] text-slate-400 block">${list[2].grade_title_fa || 'پایه هشتم'}</span>
                    <span class="text-xs sm:text-sm font-black text-cyan-400 font-mono">${list[2].total_xp} XP</span>
                </div>
            </div>
            ` : ''}

            <!-- Full Ranked List -->
            <div class="quantum-card overflow-hidden divide-y divide-slate-800/80">
                <div class="p-3.5 bg-slate-950/80 flex items-center justify-between text-[11px] font-bold text-slate-400 px-5 font-mono">
                    <span>رتبه و مشخصات داوطلب</span>
                    <div class="flex items-center gap-6">
                        <span>استمرار</span>
                        <span>مجموع XP</span>
                    </div>
                </div>

                ${list.map(s => {
                    const isSelf = currentUser && currentUser.id === s.id;
                    return `
                    <div class="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-800/40 transition-colors ${isSelf ? 'bg-cyan-950/30 border-r-4 border-cyan-400' : ''}">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center font-mono shrink-0 ${s.rank <= 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
                                ${s.rank}
                            </span>
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-xs sm:text-sm text-white truncate">${s.display_name}</span>
                                    ${isSelf ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-400/30">شما</span>' : ''}
                                </div>
                                <span class="text-[10px] sm:text-xs text-slate-400">سطح ${s.current_level} • ${s.grade_title_fa || 'دانش‌آموز'}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-5 sm:gap-7 shrink-0">
                            <span class="flex items-center gap-1 text-xs text-orange-400 font-mono font-bold" title="روزهای استمرار مطالعه">
                                <i data-lucide="flame" class="w-3.5 h-3.5 fill-orange-400"></i>
                                <span>${s.streak || 0}</span>
                            </span>
                            <span class="text-xs sm:text-sm font-black text-cyan-300 font-mono min-w-[70px] text-left">
                                ${s.total_xp} <span class="text-[10px] text-slate-400">XP</span>
                            </span>
                        </div>
                    </div>
                    `;
                }).join('')}
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
    <div class="text-center py-16">
        <div class="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <span class="text-xs text-slate-400 mt-3 block font-mono">LOADING SCIENTIFIC ACHIEVEMENTS...</span>
    </div>
    `;

    try {
        const badges = await window.api.getBadges();

        container.innerHTML = `
        <div class="max-w-5xl mx-auto px-4 py-6 space-y-8">
            <div class="text-center space-y-2">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-1">
                    <i data-lucide="medal" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>QUANTUM ACHIEVEMENTS • تالار افتخارات</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">نشان‌ها و مدال‌های افتخار فیزیک</h1>
                <p class="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">با حل آزمایش‌ها، پشتکار روزانه در درسنامه‌ها و درخشش در مسابقات، مدال‌های ویژه را آنلاک کنید</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${badges.map(b => `
                <div class="quantum-card p-5 space-y-3.5 transition-all ${b.is_unlocked ? 'border-emerald-500/40 bg-slate-900/90 shadow-emerald-500/10' : 'opacity-65 border-slate-800 bg-slate-950/60'}">
                    <div class="flex items-center gap-3.5">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${b.is_unlocked ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-800 text-slate-500 border border-slate-700'}">
                            <i data-lucide="${b.icon || 'star'}" class="w-6 h-6"></i>
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-bold text-sm text-white truncate">${b.title_fa}</h3>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${b.is_unlocked ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
                                ${b.is_unlocked ? 'دستاورد کسب شد ✓' : 'قفل شده'}
                            </span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed min-h-[36px]">${b.description_fa}</p>
                    <div class="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 font-mono">
                        <span class="text-amber-400 font-bold">+${b.xp_bonus} XP</span>
                        ${b.awarded_at ? `<span class="text-slate-500">${window.formatPersianDate ? window.formatPersianDate(b.awarded_at) : ''}</span>` : '<span class="text-slate-600">در انتظار تکمیل</span>'}
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
