<?php
/**
 * QUANTUM CUT — School Guilds & House Cup Component (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Scientific Guilds & House Cup (خاندان‌های علمی و جام دانشمندان)
 */
const ScientificGuilds = (function() {
    let myGuildData = null;
    let allGuilds = [];

    async function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8 pb-16">
            <!-- House Cup Trophy Banner -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/30 p-8 shadow-2xl">
                <div class="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                            <span>🏆</span> جام سالانه خاندان‌های علمی سمپاد
                        </div>
                        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span>🏛️</span> خاندان‌های علمی و رقابت تیمی
                        </h1>
                        <p class="text-slate-400 text-sm max-w-xl">
                            به یکی از چهار خاندان تاریخی فیزیک ملحق شوید. با شرکت در آزمون‌ها، دوئل‌ها و حل شبیه‌سازها، امتیاز خاندان خود را در صدر جدول جام سمپاد بنشانید.
                        </p>
                    </div>

                    <div id="my-guild-status-badge" class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[200px]">
                        <div class="text-xs text-slate-400">خاندان شما</div>
                        <div class="text-lg font-bold text-cyan-400 mt-1">در حال بررسی...</div>
                    </div>
                </div>
            </div>

            <!-- Guilds Deck Grid -->
            <div id="guilds-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="col-span-full text-center py-12">
                    <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>

            <!-- House Cup Leaderboard -->
            <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>⚡</span> نمودار امتیازات و سلطه علمی خاندان‌ها
                </h3>
                <div id="guilds-progress-bars" class="space-y-4">
                    <!-- Dynamic Bars -->
                </div>
            </div>
        </div>
        `;

        await loadData();
    }

    async function loadData() {
        try {
            const [gRes, mRes] = await Promise.all([
                fetch('/api/guilds/list').then(r => r.json()),
                fetch('/api/guilds/my').then(r => r.json()).catch(() => null)
            ]);

            allGuilds = gRes.guilds || [];
            myGuildData = mRes && mRes.guild ? mRes.guild : null;

            renderMyGuildBadge();
            renderGuildCards();
            renderProgressBars();
        } catch (e) {
            console.error('Error loading guilds:', e);
        }
    }

    function renderMyGuildBadge() {
        const badgeEl = document.getElementById('my-guild-status-badge');
        if (!badgeEl) return;

        if (myGuildData) {
            badgeEl.innerHTML = `
                <div class="text-xs text-slate-400">خاندان متعهد شما</div>
                <div class="text-lg font-bold mt-1 flex items-center justify-center gap-2" style="color: ${myGuildData.theme_color}">
                    <span>⭐</span> ${myGuildData.name}
                </div>
                <div class="text-xs text-slate-500 mt-1">${myGuildData.member_count} پژوهشگر هم‌پیمان</div>
            `;
        } else {
            badgeEl.innerHTML = `
                <div class="text-xs text-slate-400">خاندان شما</div>
                <div class="text-sm font-bold text-amber-400 mt-1">هنوز انتخاب نشده</div>
                <div class="text-xs text-slate-500 mt-1">یکی از خاندان‌های زیر را برگزینید</div>
            `;
        }
    }

    function renderGuildCards() {
        const grid = document.getElementById('guilds-cards-grid');
        if (!grid) return;

        const maxPoints = Math.max(1, ...allGuilds.map(g => g.total_points || 0));

        grid.innerHTML = allGuilds.map(g => {
            const isMy = myGuildData && myGuildData.id === g.id;
            const color = g.theme_color || '#3b82f6';
            const iconMap = {
                'maxwell': '⚡',
                'newton': '🍎',
                'bohr': '⚛️',
                'feynman': '🔥'
            };
            const icon = iconMap[g.slug] || '🏛️';

            return `
            <div class="relative overflow-hidden rounded-3xl bg-slate-900 border ${isMy ? 'border-2 shadow-2xl' : 'border-slate-800 hover:border-slate-700'} p-6 flex flex-col justify-between transition-all group hover:-translate-y-1" style="${isMy ? 'border-color: ' + color + '; box-shadow: 0 0 25px ' + color + '33;' : ''}">
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg" style="background-color: ${color}22; border: 1px solid ${color}44;">
                            ${icon}
                        </div>
                        <span class="text-xs font-mono font-bold px-3 py-1 rounded-full" style="background-color: ${color}15; color: ${color};">
                            ${g.total_points || 0} XP
                        </span>
                    </div>

                    <div>
                        <h4 class="text-xl font-extrabold text-white">${g.name}</h4>
                        <p class="text-xs text-slate-400 mt-2 leading-relaxed min-h-[40px]">${g.motto_fa || ''}</p>
                    </div>

                    <div class="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800">
                        <span>اعضای فعال:</span>
                        <span class="font-bold text-white">${g.member_count || 0} دانش‌پژوه</span>
                    </div>
                </div>

                <div class="pt-6">
                    ${isMy ? `
                        <div class="w-full py-2.5 rounded-xl text-center text-xs font-bold border" style="background-color: ${color}20; color: ${color}; border-color: ${color}40;">
                            ✓ خاندان پیمان‌بسته شما
                        </div>
                    ` : `
                        <button onclick="ScientificGuilds.joinGuild(${g.id})" class="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700 hover:border-slate-600">
                            پیوستن به این خاندان ⚔️
                        </button>
                    `}
                </div>
            </div>
            `;
        }).join('');
    }

    function renderProgressBars() {
        const container = document.getElementById('guilds-progress-bars');
        if (!container) return;

        const maxPoints = Math.max(100, ...allGuilds.map(g => g.total_points || 0));

        container.innerHTML = allGuilds.map(g => {
            const pct = Math.min(100, Math.round(((g.total_points || 0) / maxPoints) * 100));
            const color = g.theme_color || '#3b82f6';

            return `
            <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-white">${g.name}</span>
                    <span class="text-slate-400 font-mono">${g.total_points || 0} امتیاز (${pct}%)</span>
                </div>
                <div class="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div class="h-full rounded-full transition-all duration-1000" style="width: ${pct}%; background-color: ${color}; box-shadow: 0 0 10px ${color}88;"></div>
                </div>
            </div>
            `;
        }).join('');
    }

    async function joinGuild(guildId) {
        try {
            const res = await fetch('/api/guilds/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guild_id: guildId })
            });

            const data = await res.json();
            if (data.status === 'success') {
                await loadData();
            } else {
                alert(data.detail || 'خطا در پیوستن به خاندان');
            }
        } catch (e) {
            console.error(e);
            alert('خطا در ارتباط با سرور');
        }
    }

    return {
        render,
        joinGuild
    };
})();

window.ScientificGuilds = ScientificGuilds;
