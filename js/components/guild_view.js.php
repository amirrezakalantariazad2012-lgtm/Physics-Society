<?php
/**
 * QUANTUM CUT — School Guilds & House Cup Component (Pure PHP Edition)
 * Observatory Scientific Guilds & House Cup
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
        <div class="qc-adapt qc-shell qc-section space-y-6">
            <!-- House Cup Trophy Banner -->
            <div class="qc-telemetry-hud p-6 sm:p-8">
                <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="space-y-2 text-center md:text-right">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--warn-soft)] border border-[var(--warn)] text-[var(--warn)] text-xs font-bold">
                            <span>🏆</span> جام سالانه خاندان‌های علمی سمپاد
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black text-[var(--ink)] tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <span class="p-2.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--warn)] shadow-sm">
                                <i data-lucide="shield" class="w-6 h-6"></i>
                            </span>
                            <span>خاندان‌های علمی و رقابت تیمی</span>
                        </h1>
                        <p class="text-[var(--muted)] text-xs sm:text-sm max-w-xl leading-relaxed">
                            به یکی از چهار خاندان تاریخی فیزیک ملحق شوید. با حل مسائل، شرکت در دوئل‌ها و آزمایشگاه‌ها، امتیاز خاندان خود را ارتقا دهید.
                        </p>
                    </div>

                    <div id="my-guild-status-badge" class="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-center min-w-[200px]">
                        <div class="text-[11px] text-[var(--muted)]">خاندان شما</div>
                        <div class="text-base font-bold text-[var(--accent)] mt-1">در حال بررسی...</div>
                    </div>
                </div>
            </div>

            <!-- Guilds Deck Grid -->
            <div id="guilds-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="col-span-full text-center py-12">
                    <div class="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>

            <!-- House Cup Leaderboard -->
            <div class="qc-card qc-card--p space-y-4">
                <h3 class="text-base sm:text-lg font-black text-[var(--ink)] flex items-center gap-2">
                    <i data-lucide="zap" class="w-5 h-5 text-[var(--warn)]"></i>
                    <span>نمودار امتیازات و سلطه علمی خاندان‌ها</span>
                </h3>
                <div id="guilds-progress-bars" class="space-y-3 pt-2">
                    <!-- Dynamic Bars -->
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
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
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error('Error loading guilds:', e);
        }
    }

    function renderMyGuildBadge() {
        const badgeEl = document.getElementById('my-guild-status-badge');
        if (!badgeEl) return;

        if (myGuildData) {
            badgeEl.innerHTML = `
                <div class="text-[11px] text-[var(--muted)]">خاندان متعهد شما</div>
                <div class="text-base font-black mt-1 flex items-center justify-center gap-1.5" style="color: ${myGuildData.theme_color}">
                    <span>⭐</span> <span>${myGuildData.name}</span>
                </div>
                <div class="text-[10px] text-[var(--muted)] font-mono mt-0.5">${myGuildData.member_count} پژوهشگر هم‌پیمان</div>
            `;
        } else {
            badgeEl.innerHTML = `
                <div class="text-[11px] text-[var(--muted)]">خاندان شما</div>
                <div class="text-xs font-bold text-[var(--warn)] mt-1">هنوز انتخاب نشده</div>
                <div class="text-[10px] text-[var(--muted)] mt-0.5">یکی از خاندان‌های زیر را برگزینید</div>
            `;
        }
    }

    function renderGuildCards() {
        const grid = document.getElementById('guilds-cards-grid');
        if (!grid) return;

        grid.innerHTML = allGuilds.map(g => {
            const isMy = myGuildData && myGuildData.id === g.id;
            const color = g.theme_color || 'var(--accent)';
            const iconMap = {
                'maxwell': '⚡',
                'newton': '🍎',
                'bohr': '⚛️',
                'feynman': '🔥'
            };
            const icon = iconMap[g.slug] || '🏛️';

            return `
            <div class="qc-guild-card flex flex-col justify-between" style="--guild-color: ${color}; ${isMy ? 'border-color: ' + color + '; box-shadow: 0 0 20px ' + color + '33;' : ''}">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm" style="background-color: ${color}18; border: 1px solid ${color}33;">
                            ${icon}
                        </div>
                        <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full" style="background-color: ${color}15; color: ${color};">
                            ${g.total_points || 0} XP
                        </span>
                    </div>

                    <div>
                        <h4 class="text-base font-black text-[var(--ink)]">${g.name}</h4>
                        <p class="text-xs text-[var(--muted)] mt-1 leading-relaxed min-h-[36px]">${g.motto_fa || ''}</p>
                    </div>

                    <div class="pt-2 text-xs text-[var(--muted)] flex items-center justify-between border-t border-[var(--line)]">
                        <span>اعضای فعال:</span>
                        <span class="font-bold text-[var(--ink-2)]">${g.member_count || 0} دانش‌پژوه</span>
                    </div>
                </div>

                <div class="pt-4">
                    ${isMy ? `
                        <div class="w-full py-2 rounded-xl text-center text-xs font-bold border" style="background-color: ${color}18; color: ${color}; border-color: ${color}33;">
                            ✓ خاندان پیمان‌بسته شما
                        </div>
                    ` : `
                        <button type="button" onclick="ScientificGuilds.joinGuild(${g.id})" class="qc-btn qc-btn--ghost qc-btn--sm qc-btn--block">
                            <span>پیوستن به این خاندان ⚔️</span>
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
            const color = g.theme_color || 'var(--accent)';

            return `
            <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-[var(--ink)]">${g.name}</span>
                    <span class="text-[var(--muted)] font-mono">${g.total_points || 0} امتیاز (${pct}%)</span>
                </div>
                <div class="w-full h-2.5 rounded-full bg-[var(--surface-2)] overflow-hidden border border-[var(--line)]">
                    <div class="h-full rounded-full transition-all duration-1000" style="width: ${pct}%; background-color: ${color}; box-shadow: 0 0 8px ${color}66;"></div>
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
