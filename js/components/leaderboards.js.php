<?php
/**
 * QUANTUM CUT — Client Script (Pure PHP Edition)
 */
declare(strict_types=1);
header('Content-Type: application/javascript; charset=utf-8');
?>
/**
 * Leaderboards and Badges Component
 */
async function renderLeaderboardsView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="qc-shell qc-loading"><div class="qc-spinner"></div><span>در حال دریافت جدول رتبه‌بندی…</span></div>`;

    try {
        const raw = await window.api.getLeaderboards();
        const list = Array.isArray(raw) ? raw : (Array.isArray(raw.leaderboard) ? raw.leaderboard : []);
        const me = window.store.currentUser;
        const faNum = (n) => { try { return Number(n || 0).toLocaleString('fa-IR'); } catch (e) { return String(n); } };
        const gradeOf = (s) => s.grade_title_fa || s.grade_title || 'دوره اول';

        const podium = list.slice(0, 3);
        const order = podium.length >= 3 ? [podium[1], podium[0], podium[2]] : podium;

        container.innerHTML = `
        <div class="qc-shell qc-section space-y-6">
          <header class="flex flex-wrap items-end justify-between gap-3 qc-reveal">
            <div>
              <span class="qc-eyebrow">LEADERBOARD</span>
              <h1 class="qc-h2 mt-1.5">جدول رتبه‌بندی دانش‌آموزان</h1>
              <p class="qc-lede mt-2" style="max-width:60ch;">رتبه‌بندی بر پایه مجموع امتیاز تجربه (XP) کسب‌شده در درسنامه‌ها، آزمون‌ها و مسابقات علمی.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="qc-chip qc-chip--mono" style="font-size:9.5px;">${faNum(list.length)} پژوهشگر</span>
              <button type="button" class="qc-btn qc-btn--ghost qc-btn--sm" onclick="window.store.setView('competitions')">
                <i data-lucide="trophy" class="w-3.5 h-3.5"></i> لیگ‌ها
              </button>
            </div>
          </header>

          ${list.length === 0 ? `
          <div class="qc-empty">
            <i data-lucide="award" class="w-8 h-8"></i>
            <span class="qc-empty__title">هنوز رتبه‌ای ثبت نشده است</span>
            <span class="qc-empty__text">با تکمیل درسنامه‌ها و شرکت در آزمون‌ها، اولین امتیاز خود را ثبت کنید.</span>
            <button type="button" class="qc-btn qc-btn--sm" onclick="window.store.setView('curriculum')">شروع یادگیری</button>
          </div>` : `
          <section class="grid grid-cols-3 gap-2.5 items-end qc-reveal" data-delay="1">
            ${order.map((s, idx) => {
                const rank = Number(s.rank) || (idx + 1);
                const isFirst = rank === 1;
                return `
                <article class="qc-card text-center flex flex-col justify-end gap-1.5" style="padding:${isFirst ? '1.4rem 1rem 1.1rem' : '1rem .7rem'};min-height:${isFirst ? '210px' : '170px'};${isFirst ? 'border-color:rgba(251,191,36,.45);' : ''}">
                  ${isFirst ? '<i data-lucide="crown" class="w-5 h-5 mx-auto" style="color:var(--warn)"></i>' : ''}
                  <span class="mx-auto grid place-items-center w-8 h-8 rounded-full text-[11px] font-black"
                        style="${isFirst ? 'background:var(--warn);color:#1b1203;' : 'background:var(--surface-2);border:1px solid var(--line);color:var(--ink-2);'}">${faNum(rank)}</span>
                  <span class="block text-[12px] font-black text-[var(--ink)] truncate">${window.qcEscape(s.display_name || s.full_name || 'دانش‌آموز')}</span>
                  <span class="block text-[10px] text-[var(--muted)] truncate">${gradeOf(s)}</span>
                  <span class="block font-mono text-[12px] font-bold" style="color:var(--accent);">${faNum(s.total_xp)} XP</span>
                </article>`;
            }).join('')}
          </section>

          <section class="qc-card qc-card--p qc-reveal" data-delay="2">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-[13px] font-black text-[var(--ink)]">رتبه‌بندی کامل</h2>
              <span class="qc-chip qc-chip--ok" style="font-size:9px;"><span class="qc-dot qc-dot--live"></span> به‌روزرسانی زنده</span>
            </div>
            <div class="qc-table-wrap" style="border:0;">
              <table class="qc-table" style="min-width:640px;">
                <thead>
                  <tr><th style="width:64px;">رتبه</th><th>پژوهشگر</th><th>پایه</th><th>سطح</th><th>استمرار</th><th style="text-align:left;">امتیاز</th></tr>
                </thead>
                <tbody>
                  ${list.map(s => {
                      const isMe = me && Number(me.id) === Number(s.id);
                      return `
                      <tr ${isMe ? 'style="background:var(--accent-soft);"' : ''}>
                        <td>
                          <span class="inline-grid place-items-center w-6 h-6 rounded-lg text-[10px] font-bold"
                                style="${Number(s.rank) <= 3 ? 'background:var(--warn-soft);color:var(--warn);' : 'background:var(--surface-2);color:var(--muted);'}">${faNum(s.rank)}</span>
                        </td>
                        <td>
                          <span class="text-[11.5px] font-bold text-[var(--ink)]">${window.qcEscape(s.display_name || s.full_name || 'دانش‌آموز')}</span>
                          ${isMe ? '<span class="qc-chip qc-chip--accent ms-1" style="font-size:8px;">شما</span>' : ''}
                        </td>
                        <td class="text-[10.5px]">${gradeOf(s)}</td>
                        <td class="qc-table__num">${faNum(s.current_level)}</td>
                        <td class="qc-table__num" style="color:var(--warn);">${faNum(s.current_streak ?? s.streak)} روز</td>
                        <td class="qc-table__num font-bold" style="text-align:left;color:var(--accent);">${faNum(s.total_xp)}</td>
                      </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </section>`}
        </div>`;

        if (window.lucide) window.lucide.createIcons();
        if (window.qcRevealScan) window.qcRevealScan(container);
    } catch (e) {
        container.innerHTML = `<div class="qc-shell qc-section"><div class="qc-empty"><i data-lucide="satellite-dish" class="w-8 h-8 text-[var(--danger)]"></i><span class="qc-empty__title">دریافت جدول رتبه‌بندی ممکن نشد</span><span class="qc-empty__text">${e.message}</span></div></div>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

async function renderBadgesView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="qc-shell qc-loading"><div class="qc-spinner"></div><span>در حال دریافت ویترین مدال‌ها…</span></div>`;

    try {
        const raw = await window.api.getBadges();
        const badges = Array.isArray(raw) ? raw : (Array.isArray(raw.badges) ? raw.badges : []);
        const unlocked = badges.filter(b => b.is_unlocked).length;
        const faNum = (n) => { try { return Number(n || 0).toLocaleString('fa-IR'); } catch (e) { return String(n); } };
        const percent = badges.length ? Math.round((unlocked / badges.length) * 100) : 0;

        container.innerHTML = `
        <div class="qc-shell qc-section space-y-5">
          <header class="flex flex-wrap items-end justify-between gap-3 qc-reveal">
            <div>
              <span class="qc-eyebrow">ACHIEVEMENTS</span>
              <h1 class="qc-h2 mt-1.5">نشان‌ها و مدال‌های افتخار</h1>
              <p class="qc-lede mt-2" style="max-width:60ch;">با استمرار در مطالعه، حل تمرین‌های سخت و حضور در مسابقات، مدال‌های ویژه پژوهشگری را باز کنید.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="qc-chip qc-chip--ok qc-chip--mono">${faNum(unlocked)} از ${faNum(badges.length)}</span>
              <span class="qc-chip qc-chip--mono">${faNum(percent)}٪</span>
            </div>
          </header>

          <section class="qc-card qc-card--p qc-reveal" data-delay="1">
            <div class="flex items-center justify-between text-[10.5px] mb-1.5">
              <span class="font-bold text-[var(--ink-2)]">پیشرفت ویترین مدال‌ها</span>
              <span class="font-mono text-[var(--ok)]">${faNum(percent)}%</span>
            </div>
            <div class="h-2 rounded-full overflow-hidden" style="background:var(--surface-3);">
              <div class="h-full rounded-full" style="width:${percent}%;background:linear-gradient(90deg,var(--ok),var(--accent));"></div>
            </div>
          </section>

          ${badges.length === 0 ? `
          <div class="qc-empty">
            <i data-lucide="medal" class="w-8 h-8"></i>
            <span class="qc-empty__title">مدالی تعریف نشده است</span>
          </div>` : `
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${badges.map((b, i) => `
            <article class="qc-card qc-card--p qc-reveal ${b.is_unlocked ? '' : 'qc-card--hover'}" data-delay="${(i % 4) + 1}"
                     style="${b.is_unlocked ? 'border-color:rgba(52,211,153,.38);' : 'background:var(--surface-2);'}">
              <div class="flex items-start gap-3">
                <span class="grid place-items-center w-11 h-11 rounded-xl shrink-0"
                      style="${b.is_unlocked ? 'background:var(--ok-soft);color:var(--ok);border:1px solid rgba(52,211,153,.35);' : 'background:var(--surface-2);color:var(--muted-2);border:1px solid var(--line);'}">
                  <i data-lucide="${b.icon || 'star'}" class="w-5 h-5"></i>
                </span>
                <div class="min-w-0">
                  <h2 class="text-[12.5px] font-black text-[var(--ink)]">${window.qcEscape(b.title_fa)}</h2>
                  <span class="qc-chip ${b.is_unlocked ? 'qc-chip--ok' : ''} mt-1" style="font-size:8.5px;">
                    ${b.is_unlocked ? 'دریافت‌شده' : 'قفل'}
                  </span>
                </div>
              </div>
              <p class="mt-3 text-[11px] leading-[1.95] text-[var(--muted)]">${window.qcEscape(b.description_fa || '')}</p>
              <div class="mt-3 pt-2.5 border-t border-[var(--line)] flex items-center justify-between text-[10px]">
                <span class="text-[var(--muted)]">${b.category || 'دستاورد علمی'}</span>
                <span class="font-mono font-bold" style="color:var(--warn);">+${faNum(b.xp_bonus)} XP</span>
              </div>
            </article>`).join('')}
          </section>`}
        </div>`;

        if (window.lucide) window.lucide.createIcons();
        if (window.qcRevealScan) window.qcRevealScan(container);
    } catch (e) {
        container.innerHTML = `<div class="qc-shell qc-section"><div class="qc-empty"><i data-lucide="medal" class="w-8 h-8 text-[var(--danger)]"></i><span class="qc-empty__title">دریافت مدال‌ها ممکن نشد</span><span class="qc-empty__text">${e.message}</span></div></div>`;
        if (window.lucide) window.lucide.createIcons();
    }
}

window.renderLeaderboardsView = renderLeaderboardsView;
window.renderBadgesView = renderBadgesView;
