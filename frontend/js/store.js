/**
 * Global App Store, Sound Effects & Utilities
 */
class AppStore {
    constructor() {
        this.currentUser = null;
        this.currentView = 'landing'; // 'landing', 'dashboard', 'curriculum', 'lesson', 'exam', 'competition', 'leaderboard', 'badges', 'admin'
        this.viewParams = {};
        this.grades = [];
        this.selectedGrade = null;
        this.theme = localStorage.getItem('theme') || 'dark';
        this.initTheme();
    }

    initTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.initTheme();
        if (window.updateNavbar) {
            window.updateNavbar();
        }
    }

    setUser(user) {
        this.currentUser = user;
        window.dispatchEvent(new CustomEvent('user-changed', { detail: user }));
    }

    async refreshUser() {
        if (!window.api || !window.api.token) return null;
        try {
            const user = await window.api.getMe();
            if (user) {
                this.currentUser = user;
                window.dispatchEvent(new CustomEvent('user-changed', { detail: user }));
                return user;
            }
        } catch (e) {
            console.warn('Could not refresh user profile:', e);
        }
        return null;
    }

    showXpToast(amount, reason = 'موفقیت علمی') {
        try {
            let container = document.getElementById('xp-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'xp-toast-container';
                container.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-amber-400/80 text-amber-300 shadow-2xl shadow-amber-500/25 text-xs font-bold font-sans animate-bounce-in transition-all duration-300';
            toast.innerHTML = `
                <span class="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-black">⚡</span>
                <span class="text-sm font-black text-amber-300 font-mono">+${amount} XP</span>
                <span class="text-slate-400 text-[11px]">•</span>
                <span class="text-white text-xs">${reason}</span>
            `;

            container.appendChild(toast);
            this.playSound('correct');

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px) scale(0.95)';
                setTimeout(() => toast.remove(), 300);
            }, 3200);
        } catch (err) {
            console.warn('XP toast error:', err);
        }
    }

    setView(view, params = {}) {
        this.currentView = view;
        this.viewParams = params;
        window.location.hash = view + (params.id ? `/${params.id}` : '');
        window.dispatchEvent(new CustomEvent('view-changed', { detail: { view, params } }));
    }

    // Web Audio API Synthesized Sound Effects (zero external mp3 file dependencies!)
    playSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'correct') {
                // Happy high chime
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.4);
            } else if (type === 'wrong') {
                // Low thud
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            } else if (type === 'celebrate') {
                // Level up fanfare
                [0, 0.1, 0.2, 0.35].forEach((t, i) => {
                    const freqs = [440, 554.37, 659.25, 880];
                    const noteOsc = ctx.createOscillator();
                    const noteGain = ctx.createGain();
                    noteOsc.connect(noteGain);
                    noteGain.connect(ctx.destination);
                    noteOsc.frequency.setValueAtTime(freqs[i], ctx.currentTime + t);
                    noteGain.gain.setValueAtTime(0.25, ctx.currentTime + t);
                    noteGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + 0.25);
                    noteOsc.start(ctx.currentTime + t);
                    noteOsc.stop(ctx.currentTime + t + 0.25);
                });
            }
        } catch (e) {
            console.warn('Audio playback unavailable:', e);
        }
    }
}

window.store = new AppStore();

// Persian Date Helper
window.formatPersianDate = function(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(d);
    } catch (e) {
        return dateStr;
    }
};

window.formatPersianTime = function(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        return new Intl.DateTimeFormat('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(d);
    } catch (e) {
        return dateStr;
    }
};
