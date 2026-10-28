/**
 * QUANTUM CUT — Live Physics Laboratory & Synchronized Classroom Broadcasting Component
 * Allows teachers across Iran to conduct live experiments while students watch and interact in real-time.
 * Powered by Starlette WebSockets with SQLite WAL cross-worker event bus and postMessage canvas synchronization.
 */

class LiveLabComponent {
    constructor() {
        this.currentRoom = null;
        this.socket = null;
        this.userRole = 'student'; // 'teacher' or 'student'
        this.userName = 'دانش‌آموز';
        this.simIframe = null;
        this.laserOverlay = null;
        this.pingTimer = null;
        this.syncPoller = null;
        this.lastSyncTime = 0;
        this.votedPollIndex = null;
    }

    async render(container, roomCode = null) {
        if (!container) return;
        const user = window.store.currentUser;
        this.userRole = (user && (user.role === 'teacher' || user.role === 'admin')) ? 'teacher' : 'student';
        this.userName = (user && user.full_name) || (this.userRole === 'teacher' ? 'دبیر فیزیک' : 'دانش‌آموز سمپاد');

        if (roomCode) {
            await this.joinRoom(container, roomCode);
        } else {
            await this.renderLobby(container);
        }
    }

    async renderLobby(container) {
        this.cleanupSession();
        let rooms = [];
        try {
            const res = await fetch('/api/live-lab/rooms');
            if (res.ok) {
                const data = await res.json();
                rooms = data.rooms || [];
            }
        } catch (e) {
            console.warn('Could not fetch active rooms:', e);
        }

        container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
            <!-- Academic Institutional Banner -->
            <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        <span>پخش زنده و همگام آزمایشگاه‌های فیزیک سمپاد (Live Physics Classroom)</span>
                    </div>

                    ${this.userRole === 'teacher' ? `
                    <button onclick="window.liveLab.openCreateModal()" 
                        class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>شروع پخش زنده آزمایشگاه (ویژه دبیران)</span>
                    </button>
                    ` : `
                    <button onclick="window.liveLab.openCreateModal()" 
                        class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="radio" class="w-4 h-4 text-rose-500"></i>
                        <span>ایجاد کلاس آزمایشی</span>
                    </button>
                    `}
                </div>

                <div>
                    <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        آزمایشگاه زنده دبیر و کلاس‌های برخط فیزیک
                    </h1>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                        دبیران گرامی متغیرها و دستگاه‌های آزمایشگاهی را تغییر می‌دهند و دانش‌آموزان سراسر کشور به صورت لحظه‌ای و زنده حرکت متحرک، بردارها و نمودارها را با نرخ همگام‌سازی بالا مشاهده می‌نمایند.
                    </p>
                </div>

                <!-- Quick Join Form -->
                <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300">ورود مستقیم با شناسه کلاس:</span>
                    <div class="flex items-center gap-2">
                        <input id="quick-room-code-input" type="text" placeholder="مثال: SMP-404" 
                            class="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs uppercase font-bold outline-none focus:border-blue-500 w-36">
                        <button onclick="window.liveLab.joinFromInput()" 
                            class="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5">
                            <span>ورود به کلاس</span>
                            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Active Classrooms Grid -->
            <div class="space-y-4">
                <div class="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span class="flex items-center gap-2">
                        <i data-lucide="radio" class="w-4 h-4 text-rose-500"></i>
                        <span>کلاس‌های در حال پخش زنده (${rooms.length}):</span>
                    </span>
                    <button onclick="window.liveLab.render(document.getElementById('app-main-content'))" class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        <i data-lucide="rotate-cw" class="w-3 h-3"></i>
                        <span>بروزرسانی لیست</span>
                    </button>
                </div>

                ${rooms.length === 0 ? `
                <div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <i data-lucide="radio" class="w-10 h-10 text-slate-400 mx-auto opacity-50"></i>
                    <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">در حال حاضر کلاسی در حال پخش زنده نیست</h4>
                    <p class="text-xs text-slate-500 max-w-sm mx-auto">می‌توانید با دکمه بالا یک کلاس پخش زنده جدید بسازید یا وارد کلاس دائمی نمونه شوید.</p>
                    <button onclick="window.store.setView('live-lab', { id: 'SMP-404' })" 
                        class="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs inline-flex items-center gap-2">
                        <span>ورود به آزمایشگاه دائمی سینماتیک سمپاد (SMP-404)</span>
                    </button>
                </div>
                ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${rooms.map(r => `
                    <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition-all space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-[10px] border border-rose-200 dark:border-rose-900">
                                <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                <span>زنده</span>
                            </span>
                            <span class="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">${r.room_code}</span>
                        </div>

                        <div>
                            <h3 class="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">${r.title}</h3>
                            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                                <i data-lucide="user-check" class="w-3.5 h-3.5 text-blue-500"></i>
                                <span>${r.teacher_name}</span>
                                <span>•</span>
                                <span>پایه ${r.grade === 9 ? 'نهم' : r.grade === 8 ? 'هشتم' : 'هفتم'}</span>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-500"></i>
                                <span>${r.viewers_count} دانش‌آموز حاضر</span>
                            </span>
                            <button onclick="window.store.setView('live-lab', { id: '${r.room_code}' })" 
                                class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1">
                                <span>ورود به کلاس</span>
                                <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                    `).join('')}
                </div>
                `}
            </div>
        </div>

        <!-- Create Classroom Modal -->
        <div id="live-lab-create-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <i data-lucide="radio" class="w-4 h-4 text-rose-500"></i>
                        <span>ایجاد پخش زنده آزمایشگاه فیزیک</span>
                    </h3>
                    <button onclick="window.liveLab.closeCreateModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <div class="space-y-3 text-xs">
                    <div>
                        <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">موضوع و عنوان جلسه تدریس:</label>
                        <input id="create-room-title" type="text" placeholder="مثال: اثبات رابطه سرعت و شتاب ثابت در حرکت مستقیم" 
                            class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 font-sans">
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">انتخاب آزمایشگاه پایه:</label>
                        <select id="create-room-sim" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 font-sans">
                            <option value="motion-1d">حرکت بر روی خط راست: نمودار مکان، سرعت و شتاب (PhET همگام)</option>
                            <option value="energy-skate-park">پایستگی انرژی مکانیکی و اصطکاک (اسکیت‌پارک)</option>
                            <option value="circuit-dc">مدارهای الکتریکی مستقیم و قانون اهم (DC Circuit)</option>
                            <option value="coulombs-law">قانون کولن و برهم‌کنش بارهای الکتریکی</option>
                            <option value="density">چگالی و اصل غوطه‌وری ارشمیدس</option>
                        </select>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">نام دبیر / مدرس:</label>
                        <input id="create-room-teacher" type="text" value="${this.userName}" 
                            class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button onclick="window.liveLab.closeCreateModal()" class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800">انصراف</button>
                    <button onclick="window.liveLab.submitCreateRoom()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5">
                        <i data-lucide="radio" class="w-4 h-4"></i>
                        <span>ایجاد و شروع پخش</span>
                    </button>
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    openCreateModal() {
        const m = document.getElementById('live-lab-create-modal');
        if (m) m.classList.remove('hidden');
    }

    closeCreateModal() {
        const m = document.getElementById('live-lab-create-modal');
        if (m) m.classList.add('hidden');
    }

    async submitCreateRoom() {
        const title = document.getElementById('create-room-title')?.value?.trim();
        const simId = document.getElementById('create-room-sim')?.value || 'motion-1d';
        const teacher = document.getElementById('create-room-teacher')?.value?.trim() || this.userName;

        if (!title) {
            alert('لطفاً عنوان جلسه آزمایش را وارد فرمایید.');
            return;
        }

        try {
            const res = await fetch('/api/live-lab/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, sim_id: simId, teacher_name: teacher, grade: 9 })
            });

            if (res.ok) {
                const data = await res.json();
                this.closeCreateModal();
                this.userRole = 'teacher';
                window.store.setView('live-lab', { id: data.room_code });
            } else {
                alert('خطا در ایجاد اتاق پخش زنده.');
            }
        } catch (e) {
            console.error('Error creating room:', e);
            alert('خطای ارتباط با سرور.');
        }
    }

    joinFromInput() {
        const code = document.getElementById('quick-room-code-input')?.value?.trim();
        if (code) {
            window.store.setView('live-lab', { id: code });
        }
    }

    async joinRoom(container, roomCode) {
        this.cleanupSession();
        let details = null;
        try {
            const res = await fetch(`/api/live-lab/rooms/${roomCode}`);
            if (res.ok) {
                details = await res.json();
            } else {
                alert(`اتاق پخش زنده با کد ${roomCode} یافت نشد.`);
                this.renderLobby(container);
                return;
            }
        } catch (e) {
            console.error('Error fetching room details:', e);
            alert('خطا در بارگذاری اطلاعات کلاس.');
            return;
        }

        this.currentRoom = details;
        this.lastSyncTime = Date.now() / 1000;
        this.votedPollIndex = null;

        const simUrl = (details.sim_id === 'motion-1d' || details.sim_id === 'kinematics-1d') 
            ? '/simulators/phet/kinematics-1d.html' 
            : `/simulators/phet/${details.sim_id}.html`;
            
        const buster = Date.now();
        const iframeSrc = `${simUrl}?v=${buster}&live=1&role=${this.userRole}`;

        container.innerHTML = `
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5 font-sans">
            <!-- Room Header Strip -->
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-md shadow-rose-500/50"></span>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h2 class="font-black text-sm sm:text-base text-slate-900 dark:text-white">${details.title}</h2>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold">
                                پخش زنده برخط
                            </span>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold font-mono">
                                ${details.room_code}
                            </span>
                        </div>
                        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span class="font-medium text-blue-600 dark:text-teal-400">مدرس: ${details.teacher_name}</span>
                            <span>•</span>
                            <span id="live-participants-badge" class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${details.viewers_count} دانش‌آموز متصل</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center flex-wrap gap-2">
                    ${this.userRole === 'student' ? `
                    <button onclick="window.liveLab.sendRaiseHand()" 
                        id="btn-raise-hand"
                        class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105">
                        <i data-lucide="hand" class="w-3.5 h-3.5"></i>
                        <span>✋ اجازه / دست بلند کردن</span>
                    </button>
                    ` : ''}

                    <button onclick="navigator.clipboard.writeText('${details.room_code}'); alert('کد اتاق کپی شد: ${details.room_code}')" 
                        class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                        <span>کپی شناسه</span>
                    </button>

                    <button onclick="window.store.setView('live-lab')" 
                        class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-1.5">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>خروج از کلاس</span>
                    </button>
                </div>
            </div>

            <!-- Main Live Stage (Viewport + Telemetry / Notes / Q&A) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                <!-- Left: Synchronized Simulator Viewport -->
                <div class="lg:col-span-8 space-y-3">
                    <div id="live-stage-wrapper" class="relative w-full h-[540px] sm:h-[620px] rounded-2xl bg-white border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden select-none">
                        
                        <!-- Teacher Controls Overlay (If role is teacher) -->
                        ${this.userRole === 'teacher' ? `
                        <div class="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur text-white border border-slate-700 text-xs shadow-xl">
                            <div class="flex items-center gap-2 font-bold text-emerald-400">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>شما کنترل‌کننده پخش زنده این جلسه هستید</span>
                            </div>
                            <div class="flex items-center flex-wrap gap-2">
                                <button onclick="window.liveLab.promptAddTeacherNote()" class="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="edit-3" class="w-3 h-3"></i>
                                    <span>نکته تخته</span>
                                </button>
                                <button onclick="window.liveLab.promptStartPoll()" class="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="help-circle" class="w-3 h-3"></i>
                                    <span>طرح پرسش</span>
                                </button>
                                <button onclick="window.liveLab.clearTeacherNotes()" class="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="trash-2" class="w-3 h-3"></i>
                                    <span>پاک‌کردن تخته</span>
                                </button>
                            </div>
                        </div>
                        ` : `
                        <div class="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold border border-slate-700 flex items-center gap-1.5 shadow">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>همگام با آزمایش دبیر در زمان واقعی</span>
                        </div>
                        `}

                        <!-- Glowing Laser Pointer Overlay -->
                        <div id="live-laser-pointer" class="hidden absolute pointer-events-none z-30 w-5 h-5 rounded-full bg-rose-600 shadow-lg shadow-rose-500 ring-4 ring-rose-400/60 -translate-x-1/2 -translate-y-1/2 transition-all duration-75"></div>

                        <!-- Iframe Viewport -->
                        <iframe 
                            id="live-sync-iframe"
                            src="${iframeSrc}"
                            class="w-full h-full border-0 bg-white"
                            allow="fullscreen"
                            loading="eager">
                        </iframe>
                    </div>

                    <!-- Live Parameter Telemetry Strip -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">مکان متحرک x(t):</span>
                            <span id="tele-pos" class="font-mono text-sm sm:text-base font-black text-blue-600 dark:text-blue-400">0.0 m</span>
                        </div>
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">سرعت متحرک v(t):</span>
                            <span id="tele-vel" class="font-mono text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">0.0 m/s</span>
                        </div>
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">شتاب متحرک a(t):</span>
                            <span id="tele-acc" class="font-mono text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">0.0 m/s²</span>
                        </div>
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">زمان سپری‌شده (t):</span>
                            <span id="tele-time" class="font-mono text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">0.00 s</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Teacher Chalkboard, Quick Poll & Classroom Chat -->
                <div class="lg:col-span-4 space-y-4">
                    
                    <!-- Interactive Classroom Poll Widget -->
                    <div id="live-poll-card" class="${details.active_poll ? '' : 'hidden'} rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-850 border border-amber-300 dark:border-amber-700/60 p-4 space-y-3 shadow-sm">
                        <div class="flex items-center justify-between border-b border-amber-200 dark:border-amber-800/60 pb-2">
                            <div class="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                                <i data-lucide="help-circle" class="w-4 h-4 text-amber-600"></i>
                                <span>پرسش کلاسی دبیر (نظرسنجی زنده)</span>
                            </div>
                            <span id="live-poll-total" class="font-mono text-[10px] bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded text-amber-800 dark:text-amber-200 font-bold">0 رأی</span>
                        </div>
                        <p id="live-poll-question" class="text-xs font-extrabold text-slate-900 dark:text-white leading-relaxed">
                            ${details.active_poll?.question || ''}
                        </p>
                        <div id="live-poll-options" class="space-y-1.5">
                            <!-- Injected dynamically -->
                        </div>
                    </div>

                    <!-- Teacher Live Chalkboard / Notes -->
                    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
                        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                            <h4 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="book-open" class="w-4 h-4 text-blue-600 dark:text-teal-400"></i>
                                <span>تخته نکات و فرمول‌های دبیر</span>
                            </h4>
                            <span class="text-[10px] font-mono text-slate-400">CHALKBOARD</span>
                        </div>
                        
                        <div id="live-teacher-notes-list" class="space-y-2 text-xs max-h-44 overflow-y-auto pr-1">
                            ${details.teacher_notes && details.teacher_notes.length > 0 
                                ? details.teacher_notes.map(n => `
                                    <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                                        ${n}
                                    </div>
                                `).join('') 
                                : '<p class="text-slate-400 text-[11px] py-2 text-center">هنوز یادداشتی از سوی دبیر ارسال نشده است.</p>'}
                        </div>
                    </div>

                    <!-- Live Classroom Q&A Chat -->
                    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm flex flex-col h-[360px]">
                        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                            <h4 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="message-square" class="w-4 h-4 text-emerald-500"></i>
                                <span>پرسش و پاسخ زنده کلاسی</span>
                            </h4>
                            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">زنده</span>
                        </div>

                        <!-- Chat messages stream -->
                        <div id="live-chat-messages-container" class="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                            <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-[11px]">
                                به کلاس زنده فیزیک خوش آمدید! پرسش‌های علمی خود را مطرح کنید.
                            </div>
                            ${(details.chat_history || []).map(c => this.formatChatMessageHtml(c)).join('')}
                        </div>

                        <!-- Chat input -->
                        <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                            <input id="live-chat-input" type="text" placeholder="پرسش علمی از دبیر..." 
                                onkeydown="if(event.key === 'Enter') window.liveLab.sendChatMessage()"
                                class="flex-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-blue-500">
                            <button onclick="window.liveLab.sendChatMessage()" class="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
                                <i data-lucide="send" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        this.simIframe = document.getElementById('live-sync-iframe');
        this.laserOverlay = document.getElementById('live-laser-pointer');

        if (details.active_poll) {
            this.renderPollUI(details.active_poll, details.poll_votes || {});
        }

        // Connect WebSocket
        this.connectWebSocket(details.room_code);

        // Listen for postMessage from the iframe (when teacher interacts with simulation)
        this.setupIframeMessageBridge();

        // Start fallback synchronization poller
        this.startSyncPoller(details.room_code);
    }

    cleanupSession() {
        if (this.socket) {
            try { this.socket.close(); } catch (e) {}
            this.socket = null;
        }
        if (this.pingTimer) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
        if (this.syncPoller) {
            clearInterval(this.syncPoller);
            this.syncPoller = null;
        }
        this.currentRoom = null;
    }

    connectWebSocket(roomCode) {
        if (this.socket) {
            try { this.socket.close(); } catch (e) {}
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/live-lab/ws/${roomCode}?role=${this.userRole}&name=${encodeURIComponent(this.userName)}`;

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log(`[LiveLab] Connected to Live Lab WebSocket: ${roomCode}`);
            // Heartbeat ping every 8s
            if (this.pingTimer) clearInterval(this.pingTimer);
            this.pingTimer = setInterval(() => {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({ type: 'ping' }));
                }
            }, 8000);
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleIncomingSocketMessage(data);
            } catch (e) {
                console.warn('[LiveLab] Socket message parse error:', e);
            }
        };

        this.socket.onclose = () => {
            console.log('[LiveLab] Live Lab WebSocket disconnected, attempting reconnect...');
            if (this.pingTimer) clearInterval(this.pingTimer);
            // Attempt seamless reconnect after 2s if still in the same room
            setTimeout(() => {
                if (this.currentRoom && this.currentRoom.room_code === roomCode) {
                    this.connectWebSocket(roomCode);
                }
            }, 2000);
        };
    }

    startSyncPoller(roomCode) {
        if (this.syncPoller) clearInterval(this.syncPoller);
        this.syncPoller = setInterval(async () => {
            if (!this.currentRoom || this.currentRoom.room_code !== roomCode) return;
            try {
                const res = await fetch(`/api/live-lab/rooms/${roomCode}/sync?since=${this.lastSyncTime}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.updated_at && data.updated_at > this.lastSyncTime) {
                        this.lastSyncTime = data.updated_at;
                        if (data.current_state) this.updateTelemetry(data.current_state);
                        if (data.active_poll) {
                            this.renderPollUI(data.active_poll, data.poll_votes || {});
                        }
                    }
                    if (data.new_messages && data.new_messages.length > 0) {
                        data.new_messages.forEach(m => this.appendChatMessage(m));
                    }
                }
            } catch (e) {
                // Ignore background sync errors silently
            }
        }, 1200);
    }

    setupIframeMessageBridge() {
        window.addEventListener('message', (event) => {
            if (!event.data || typeof event.data !== 'object') return;
            const msg = event.data;

            // 1. Teacher simulation state update
            if (msg.type === 'TEACHER_SIM_STATE_UPDATE' && this.userRole === 'teacher') {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: 'state_update',
                        payload: msg.payload
                    }));
                }
                this.updateTelemetry(msg.payload);
            }

            // 2. Teacher laser pointer move inside simulator
            if (msg.type === 'TEACHER_LASER_MOVE' && this.userRole === 'teacher') {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: 'laser_pointer',
                        x: msg.payload.x,
                        y: msg.payload.y,
                        active: msg.payload.active
                    }));
                }
            }
        });
    }

    handleIncomingSocketMessage(data) {
        const type = data.type;

        // 1. Welcome or State Sync
        if (type === 'welcome' || type === 'state_sync') {
            const payload = data.payload || data.state;
            if (payload) {
                this.updateTelemetry(payload);
                if (this.simIframe && this.simIframe.contentWindow) {
                    this.simIframe.contentWindow.postMessage({
                        type: 'SYNC_SIM_STATE',
                        payload: payload
                    }, '*');
                }
            }
            if (data.notes && Array.isArray(data.notes)) {
                this.refreshNotesList(data.notes);
            }
            if (data.active_poll) {
                this.renderPollUI(data.active_poll, data.poll_votes || {});
            }
        }

        // 2. Viewers count update
        if (data.viewers_count !== undefined) {
            const badge = document.getElementById('live-participants-badge');
            if (badge) {
                badge.textContent = `${data.viewers_count} دانش‌آموز متصل`;
            }
        }

        // 3. Laser Pointer
        if (type === 'laser_pointer' && this.laserOverlay) {
            if (data.active === false) {
                this.laserOverlay.classList.add('hidden');
            } else {
                this.laserOverlay.style.left = `${(data.x || 0.5) * 100}%`;
                this.laserOverlay.style.top = `${(data.y || 0.5) * 100}%`;
                this.laserOverlay.classList.remove('hidden');
            }
        }

        // 4. Teacher Note
        if (type === 'teacher_note_added') {
            const notesList = document.getElementById('live-teacher-notes-list');
            if (notesList && data.note) {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800/70 border border-blue-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 leading-relaxed text-[11px] animate-fade-in';
                noteDiv.textContent = data.note;
                notesList.prepend(noteDiv);
                if (window.renderMathInPage) window.renderMathInPage(noteDiv);
                if (window.store && window.store.playSound) window.store.playSound('correct');
            }
        }

        // 5. Notes Cleared
        if (type === 'notes_cleared') {
            const notesList = document.getElementById('live-teacher-notes-list');
            if (notesList) {
                notesList.innerHTML = '<p class="text-slate-400 text-[11px] py-2 text-center">تخته نکات توسط دبیر پاک شد.</p>';
            }
        }

        // 6. Poll Launched
        if (type === 'poll_started') {
            this.votedPollIndex = null;
            this.renderPollUI(data, data.votes || {});
            if (window.store && window.store.playSound) window.store.playSound('correct');
        }

        // 7. Poll Votes Updated
        if (type === 'poll_update') {
            this.updatePollBars(data.votes, data.total);
        }

        // 8. Student Raised Hand
        if (type === 'student_raised_hand') {
            if (window.store && window.store.playSound) window.store.playSound('ding');
            this.appendChatMessage({
                sender: 'سیستم کلاس',
                role: 'system',
                message: `✋ ${data.sender} دست خود را جهت پرسش یا اجازه بلند کرد.`,
                time: ''
            });
        }

        // 9. Chat Message
        if (type === 'chat_message') {
            this.appendChatMessage(data);
        }
    }

    renderPollUI(pollData, votes) {
        const card = document.getElementById('live-poll-card');
        const qEl = document.getElementById('live-poll-question');
        const optsContainer = document.getElementById('live-poll-options');
        const totalEl = document.getElementById('live-poll-total');
        if (!card || !qEl || !optsContainer) return;

        card.classList.remove('hidden');
        qEl.textContent = pollData.question || 'پرسش کلاسی:';
        
        const total = Object.values(votes).reduce((a, b) => a + Number(b), 0);
        if (totalEl) totalEl.textContent = `${total} پاسخ`;

        optsContainer.innerHTML = (pollData.options || []).map((opt, idx) => {
            const count = Number(votes[idx] || 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isVoted = this.votedPollIndex === idx;

            return `
            <button onclick="window.liveLab.submitVote(${idx})" 
                ${this.votedPollIndex !== null ? 'disabled' : ''}
                class="w-full relative overflow-hidden text-right p-2 rounded-xl border text-xs font-bold transition-all ${isVoted 
                    ? 'border-amber-500 bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-400'}">
                <div class="absolute inset-y-0 right-0 bg-amber-200/50 dark:bg-amber-600/30 transition-all duration-300" style="width: ${pct}%"></div>
                <div class="relative z-10 flex items-center justify-between">
                    <span>${opt}</span>
                    <span class="font-mono text-[11px] text-slate-600 dark:text-slate-300">${pct}% (${count})</span>
                </div>
            </button>
            `;
        }).join('');
    }

    updatePollBars(votes, total) {
        const card = document.getElementById('live-poll-card');
        if (!card || card.classList.contains('hidden')) return;
        const totalEl = document.getElementById('live-poll-total');
        if (totalEl) totalEl.textContent = `${total} پاسخ`;

        const buttons = document.querySelectorAll('#live-poll-options button');
        buttons.forEach((btn, idx) => {
            const count = Number(votes[idx] || 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const bar = btn.querySelector('div');
            const pctSpan = btn.querySelector('span:last-child');
            if (bar) bar.style.width = `${pct}%`;
            if (pctSpan) pctSpan.textContent = `${pct}% (${count})`;
        });
    }

    submitVote(optionIdx) {
        if (this.votedPollIndex !== null) return;
        this.votedPollIndex = optionIdx;
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'poll_vote',
                option_index: optionIdx
            }));
        } else if (this.currentRoom) {
            fetch(`/api/live-lab/rooms/${this.currentRoom.room_code}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ option_index: optionIdx })
            });
        }
        if (window.store && window.store.playSound) window.store.playSound('click');
    }

    sendRaiseHand() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'raise_hand' }));
        }
        const btn = document.getElementById('btn-raise-hand');
        if (btn) {
            btn.classList.add('opacity-50', 'pointer-events-none');
            btn.innerHTML = '<span>دست شما بلند شد ✔</span>';
            setTimeout(() => {
                if (btn) {
                    btn.classList.remove('opacity-50', 'pointer-events-none');
                    btn.innerHTML = '<i data-lucide="hand" class="w-3.5 h-3.5"></i><span>✋ اجازه / دست بلند کردن</span>';
                    if (window.lucide) window.lucide.createIcons();
                }
            }, 6000);
        }
    }

    updateTelemetry(payload) {
        if (!payload) return;
        const pos = document.getElementById('tele-pos');
        const vel = document.getElementById('tele-vel');
        const acc = document.getElementById('tele-acc');
        const time = document.getElementById('tele-time');

        if (pos && payload.curX !== undefined) pos.textContent = `${Number(payload.curX).toFixed(1)} m`;
        if (vel && payload.curV !== undefined) vel.textContent = `${Number(payload.curV).toFixed(1)} m/s`;
        if (acc && payload.curA !== undefined) acc.textContent = `${Number(payload.curA).toFixed(1)} m/s²`;
        if (time && payload.curT !== undefined) time.textContent = `${Number(payload.curT).toFixed(2)} s`;
    }

    formatChatMessageHtml(data) {
        const isMe = data.sender === this.userName;
        const isTeacher = data.role === 'teacher';
        const isSystem = data.role === 'system';

        if (isSystem) {
            return `
            <div class="p-2 rounded-xl text-[11px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-center">
                ${data.message}
            </div>
            `;
        }

        return `
        <div class="p-2 rounded-xl text-[11px] leading-relaxed ${isTeacher 
            ? 'bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200' 
            : isMe 
                ? 'bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 mr-3' 
                : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 ml-3'}">
            <div class="flex items-center justify-between mb-1 text-[10px] font-bold">
                <span class="flex items-center gap-1 ${isTeacher ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}">
                    ${isTeacher ? '<i data-lucide="award" class="w-3 h-3"></i> دبیر: ' : ''}${data.sender}
                </span>
                <span class="text-slate-400 font-mono">${data.time || ''}</span>
            </div>
            <div>${data.message}</div>
        </div>
        `;
    }

    appendChatMessage(data) {
        const chatContainer = document.getElementById('live-chat-messages-container');
        if (chatContainer) {
            const div = document.createElement('div');
            div.innerHTML = this.formatChatMessageHtml(data);
            chatContainer.appendChild(div.firstElementChild);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    sendChatMessage() {
        const inp = document.getElementById('live-chat-input');
        const text = inp?.value?.trim();
        if (text) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: 'chat_message',
                    message: text
                }));
            } else if (this.currentRoom) {
                fetch(`/api/live-lab/rooms/${this.currentRoom.room_code}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sender: this.userName,
                        role: this.userRole,
                        message: text
                    })
                });
            }
            inp.value = '';
        }
    }

    promptAddTeacherNote() {
        const note = prompt('نکته آموزشی یا فرمول مورد نظر خود را جهت درج روی تخته زنده وارد فرمایید:');
        if (note && note.trim()) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: 'teacher_note',
                    note: note.trim()
                }));
            } else if (this.currentRoom) {
                fetch(`/api/live-lab/rooms/${this.currentRoom.room_code}/note`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ note: note.trim() })
                });
            }
        }
    }

    clearTeacherNotes() {
        if (confirm('آیا از پاک کردن تمامی نکات تخته اطمینان دارید؟')) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'clear_notes' }));
            }
        }
    }

    promptStartPoll() {
        const q = prompt('متن پرسش کلاسی را وارد فرمایید:', 'اگر علامت شتاب و سرعت یکسان باشد، نوع حرکت چگونه است؟');
        if (!q || !q.trim()) return;
        const opt1 = prompt('گزینه ۱:', 'تندشونده') || 'تندشونده';
        const opt2 = prompt('گزینه ۲:', 'کندشونده') || 'کندشونده';
        const opt3 = prompt('گزینه ۳:', 'یکنواخت') || 'یکنواخت';
        const opt4 = prompt('گزینه ۴:', 'ساکن') || 'ساکن';

        const pollPayload = {
            question: q.trim(),
            options: [opt1.trim(), opt2.trim(), opt3.trim(), opt4.trim()]
        };

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'start_poll',
                ...pollPayload
            }));
        } else if (this.currentRoom) {
            fetch(`/api/live-lab/rooms/${this.currentRoom.room_code}/poll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollPayload)
            });
        }
    }

    refreshNotesList(notes) {
        const notesList = document.getElementById('live-teacher-notes-list');
        if (!notesList) return;
        if (!notes || notes.length === 0) {
            notesList.innerHTML = '<p class="text-slate-400 text-[11px] py-2 text-center">هنوز یادداشتی از سوی دبیر ارسال نشده است.</p>';
            return;
        }
        notesList.innerHTML = notes.map(n => `
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                ${n}
            </div>
        `).join('');
        if (window.renderMathInPage) window.renderMathInPage(notesList);
    }
}

window.liveLab = new LiveLabComponent();
