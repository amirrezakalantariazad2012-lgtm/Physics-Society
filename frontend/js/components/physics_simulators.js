/**
 * Physics Laboratory Simulators Catalog & Interactive Workbench
 * Physics Society of Shahid Beheshti 2 (Grades 7, 8, 9)
 * Full Scientific & Mathematical Fidelity - SAMPAD & National Curriculum Standard
 */

const SIMULATOR_CATALOG = [
    // --- GRADE 7 (پایه هفتم) ---
    {
        id: 'density',
        title: 'چگالی، حجم جابجاشده و شناوری ارشمیدس',
        grade: 7,
        gradeKey: 'grade_7',
        gradeTitle: 'پایه هفتم',
        gradeLabel: 'پایه هفتم',
        category: 'ماده و جرم',
        topic: 'فصل ۲: اندازه‌گیری و چگالی',
        icon: 'flask-conical',
        desc: 'محاسبه چگالی با استوانه مدرج، قانون شناوری ارشمیدس، تغییر ارتفاع مایع و وزن ظاهری اجسام در مایعات مختلف.',
        description: 'محاسبه چگالی با استوانه مدرج، قانون شناوری ارشمیدس، تغییر ارتفاع مایع و وزن ظاهری اجسام در مایعات مختلف.',
        formula: '\\rho = \\frac{m}{V} \\quad , \\quad F_b = \\rho_{\\text{fluid}} \\cdot V_{\\text{submerged}} \\cdot g',
        badge: 'سمپاد پایه هفتم — اندازه‌گیری تجربی',
        goals: [
            'اندازه‌گیری حجم به روش جابجایی مایع و خوانش استوانه مدرج',
            'آزمودن شرایط غوطه‌وری، شناوری و ته‌نشینی بر اساس چگالی جسم و مایع',
            'محاسبه وزن ظاهری و نیروی شناوری ارشمیدس با دینامومتر فنری'
        ],
        phetSlug: 'density',
        nativeSim: 'renderDensitySim'
    },
    {
        id: 'calorimetry',
        title: 'دماسنجی، تعادل گرمایی و گرمایش بونزن',
        grade: 7,
        gradeKey: 'grade_7',
        gradeTitle: 'پایه هفتم',
        gradeLabel: 'پایه هفتم',
        category: 'گرما و ترمودینامیک',
        topic: 'فصل ۱۴: گرما و تعادل حرارتی',
        icon: 'flame',
        desc: 'تبادل گرما در گرماسنج (Q = mcΔT)، دمای تعادل مخلوط‌ها و نمودار پلاتوی نقطه جوش آب با چراغ بونزن.',
        description: 'تبادل گرما در گرماسنج (Q = mcΔT)، دمای تعادل مخلوط‌ها و نمودار پلاتوی نقطه جوش آب با چراغ بونزن.',
        formula: 'Q = mc\\Delta T \\quad , \\quad T_{eq} = \\frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2}',
        badge: 'سمپاد پایه هفتم — گرما و انرژی',
        goals: [
            'محاسبه دمای تعادل مخلوط آب و فلزات مختلف بر مبنای ظرفیت گرمایی ویژه',
            'مشاهده منحنی افزایش دما برحسب زمان تحت گرمایش چراغ بونزن',
            'تحلیل پلاتوی نقطه جوش در ۱۰۰ درجه و عدم افزایش دما هنگام گذار فاز'
        ],
        phetSlug: 'energy-forms-and-changes',
        nativeSim: 'renderCalorimetrySim'
    },
    {
        id: 'energy',
        title: 'پایستگی و تبدیلات انرژی مکانیکی',
        grade: 7,
        gradeKey: 'grade_7',
        gradeTitle: 'پایه هفتم',
        gradeLabel: 'پایه هفتم',
        category: 'انرژی و کار',
        topic: 'فصل ۸: کار و انرژی مکانیکی',
        icon: 'activity',
        desc: 'تبدیل انرژی پتانسیل گرانشی به جنبشی، اثر اصطکاک و تولید گرما و پایستگی کامل انرژی کل مکانیکی.',
        description: 'تبدیل انرژی پتانسیل گرانشی به جنبشی، اثر اصطکاک و تولید گرما و پایستگی کامل انرژی کل مکانیکی.',
        formula: 'E_M = E_k + U_g = \\frac{1}{2}mv^2 + mgh = \\text{ثابت} \\quad (\\Delta E_M = -W_f)',
        badge: 'سمپاد پایه هفتم — کار و توان',
        goals: [
            'مشاهده تبدیل مداوم انرژی پتانسیل به جنبشی در مسیر نوسان اسکیت‌باز',
            'بررسی پایستگی انرژی کل مکانیکی در نبود اصطکاک',
            'تحلیل اثر اصطکاک بر اتلاف انرژی مکانیکی و تبدیل آن به انرژی درونی حرارتی'
        ],
        phetSlug: 'energy-skate-park-basics',
        nativeSim: 'renderEnergySim'
    },
    {
        id: 'levers',
        title: 'اهرم‌ها، گشتاور نیرو و مزیت مکانیکی',
        grade: 7,
        gradeKey: 'grade_7',
        gradeTitle: 'پایه هفتم',
        gradeLabel: 'پایه هفتم',
        category: 'ماشین‌های ساده',
        topic: 'فصل ۹: ماشین‌های ساده و اهرم',
        icon: 'scale',
        desc: 'سه نوع اهرم (نوع اول، دوم و سوم)، تعادل گشتاورها (F₁d₁ = F₂d₂) و مزیت مکانیکی اهرم‌ها.',
        description: 'سه نوع اهرم (نوع اول، دوم و سوم)، تعادل گشتاورها (F₁d₁ = F₂d₂) و مزیت مکانیکی اهرم‌ها.',
        formula: '\\Sigma \\tau = 0 \\implies F_1 d_1 = F_2 d_2 \\quad , \\quad A = \\frac{R}{E} = \\frac{d_E}{d_R}',
        badge: 'سمپاد پایه هفتم — ماشین‌های ساده',
        goals: [
            'تحلیل شرایط تعادل دورانی و برابری گشتاور ساعتگرد و پادساعتگرد',
            'بررسی تغییر مزیت مکانیکی در اهرم‌های نوع ۱، نوع ۲ و نوع ۳',
            'آزمودن رابطه معکوس بین نیروی محرک و جابجایی تکیه‌گاه'
        ],
        phetSlug: 'balancing-act',
        nativeSim: 'renderLeversSim'
    },

    // --- GRADE 8 (پایه هشتم) ---
    {
        id: 'circuit',
        title: 'مدار الکتریکی، قانون اهم و اتصالات سری/موازی',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'الکتریسیته جاری',
        topic: 'فصل ۹: الکتریسیته جاری و مدار',
        icon: 'zap',
        desc: 'قانون اهم (V = IR)، مقاومت معادل، اتصالات متوالی و موازی با کلیدهای مستقل سوختن/باز کردن لامپ‌ها.',
        description: 'قانون اهم (V = IR)، مقاومت معادل، اتصالات متوالی و موازی با کلیدهای مستقل سوختن/باز کردن لامپ‌ها.',
        formula: 'V = IR \\quad , \\quad R_{\\text{series}} = R_1 + R_2 \\quad , \\quad \\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2}',
        badge: 'سمپاد پایه هشتم — مدارهای الکتریکی',
        goals: [
            'تحلیل قانون اهم با تنظیم ولتاژ منبع و مشاهده تغییرات شدت جریان آمپرمتر',
            'مقایسه مقاومت معادل در آرایش متوالی (افزایش مقاومت) و موازی (کاهش مقاومت)',
            'مشاهده خاموش شدن کل حلقه با باز کردن لامپ در سری در برابر استقلال شاخه‌ها در موازی'
        ],
        phetSlug: 'circuit-construction-kit-dc',
        nativeSim: 'renderCircuitSim'
    },
    {
        id: 'electrostatics',
        title: 'الکتریسیته ساکن، القا و الکتروسکوپ طلایی',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'الکتریسیته ساکن',
        topic: 'فصل ۹: بار الکتریکی و الکتروسکوپ',
        icon: 'sparkles',
        desc: 'تمایز دقیق باردار کردن به روش القا (موقتی) و تماس مستقیم (دائمی)، اتصال به زمین و انحراف تیغه‌ها.',
        description: 'تمایز دقیق باردار کردن به روش القا (موقتی) و تماس مستقیم (دائمی)، اتصال به زمین و انحراف تیغه‌ها.',
        formula: 'F_e = k \\frac{|q_1 q_2|}{r^2} \\quad , \\quad \\theta_{\\text{leaves}} \\propto q^2',
        badge: 'سمپاد پایه هشتم — الکتریسیته ساکن',
        goals: [
            'مشاهده انحراف تیغه‌های الکتروسکوپ هنگام نزدیک شدن میله باردار بدون تماس (القا)',
            'تحلیل دائمی شدن بار پس از تماس مستقیم میله با کلاهک فلزی الکتروسکوپ',
            'آزمودن تخلیه کامل بار با لمس کلاهک و اتصال به زمین (ارت)'
        ],
        phetSlug: 'balloons-and-static-electricity',
        nativeSim: 'renderElectrostaticsSim'
    },
    {
        id: 'optics',
        title: 'شکست نور، پاشندگی منشور و آینه‌های کروی',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'نور و اپتیک',
        topic: 'فصل ۱۴ و ۱۵: نور، شکست و بازتاب',
        icon: 'eye',
        desc: 'قانون شکست اسنل، زاویه حد و بازتاب کلی، تجزیه نور سفید در منشور به ۷ رنگ و ردیابی پرتو در آینه مقعر.',
        description: 'قانون شکست اسنل، زاویه حد و بازتاب کلی، تجزیه نور سفید در منشور به ۷ رنگ و ردیابی پرتو در آینه مقعر.',
        formula: 'n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2 \\quad , \\quad \\sin \\theta_c = \\frac{n_2}{n_1} \\quad , \\quad \\frac{1}{f} = \\frac{1}{p} + \\frac{1}{q}',
        badge: 'سمپاد پایه هشتم — اپتیک و هندسه نور',
        goals: [
            'اثبات زاویه‌ای قانون اسنل در گذر نور از هوا به آب و شیشه',
            'مشاهده پدیده بازتاب داخلی کلی در زاویه‌های تابش فراتر از زاویه حد',
            'مشاهده پاشندگی نور سفید به طیف پیوسته هفت رنگ در منشور مثلثی'
        ],
        phetSlug: 'bending-light',
        nativeSim: 'renderOpticsSim'
    },
    {
        id: 'magnetism',
        title: 'مغناطیس، خطوط میدان و سیملوله الکترومغناطیسی',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'مغناطیس',
        topic: 'فصل ۱۰: مغناطیس و الکترومغناطیس',
        icon: 'compass',
        desc: 'خطوط میدان آهنربای میله‌ای، عقربه قطب‌نما و آهنربای الکتریکی با هسته آهنی و قاعده دست راست.',
        description: 'خطوط میدان آهنربای میله‌ای، عقربه قطب‌نما و آهنربای الکتریکی با هسته آهنی و قاعده دست راست.',
        formula: 'B = \\mu \\frac{N I}{L} \\quad , \\quad \\vec{F} = q(\\vec{v} \\times \\vec{B})',
        badge: 'سمپاد پایه هشتم — مغناطیس سمپاد',
        goals: [
            'ردیابی بردار میدان مغناطیسی در نقاط مختلف فضا به کمک عقربه قطب‌نما',
            'بررسی عملکرد سیملوله حامل جریان و تقویت میدان به کمک هسته آهنی',
            'آزمودن وارونگی قطب‌های N و S با معکوس کردن جهت جریان الکتریکی'
        ],
        phetSlug: 'faradays-electromagnetic-lab',
        nativeSim: 'renderMagnetismSim'
    },

    // --- GRADE 9 (پایه نهم) ---
    {
        id: 'newton',
        title: 'قانون دوم نیوتون، اصطکاک و ریل هوا',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'حرکت و دینامیک',
        topic: 'فصل ۵: نیرو و قوانین نیوتون',
        icon: 'move',
        desc: 'آستانه اصطکاک ایستایی حداکثر، انتقال به اصطکاک جنبشی، شتاب (a = F_net/m) و ترمز خودرو.',
        description: 'آستانه اصطکاک ایستایی حداکثر، انتقال به اصطکاک جنبشی، شتاب (a = F_net/m) و ترمز خودرو.',
        formula: 'F_{\\text{net}} = m \\cdot a \\quad , \\quad f_{s,\\max} = \\mu_s N \\quad , \\quad f_k = \\mu_k N',
        badge: 'سمپاد پایه نهم — دینامیک نیوتونی',
        goals: [
            'درک تجربی آستانه حرکت و عدم جابجایی جسم تا زمان غلبه بر اصطکاک ایستایی',
            'اثبات رابطه مستقیم شتاب با نیروی خالص و رابطه معکوس با جرم روی ریل هوا',
            'تحلیل فرآیند کاهش سرعت و توقف متحرک تحت نیروی ترمز اصطکاکی'
        ],
        phetSlug: 'forces-and-motion-basics',
        nativeSim: 'renderNewtonSim'
    },
    {
        id: 'hooke',
        title: 'قانون هوک، فنر کشسانی و نوسانگر',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'نیرو و کشسانی',
        topic: 'فصل ۵: نیروی کشسانی و قانون هوک',
        icon: 'git-commit',
        desc: 'رابطه خطی نیرو و تغییر طول فنر (F = kΔx)، رسم شیب خط k، انرژی کشسانی و نوسان هماهنگ.',
        description: 'رابطه خطی نیرو و تغییر طول فنر (F = kΔx)، رسم شیب خط k، انرژی کشسانی و نوسان هماهنگ.',
        formula: 'F = k \\Delta x \\quad , \\quad U_e = \\frac{1}{2} k (\\Delta x)^2 \\quad , \\quad T = 2\\pi \\sqrt{\\frac{m}{k}}',
        badge: 'سمپاد پایه نهم — کشسانی و ارتعاش',
        goals: [
            'رسم نمودار همزمان نیرو برحسب تغییر طول و استخراج شیب به عنوان ثابت فنر (k)',
            'محاسبه انرژی پتانسیل کشسانی ذخیره شده در فنر',
            'مشاهده حرکت نوسانی هماهنگ ساده وزنه متصل به فنر'
        ],
        phetSlug: 'masses-and-springs',
        nativeSim: 'renderHookeSim'
    },
    {
        id: 'pressure',
        title: 'فشار در شاره‌ها، لوله U شکل و بالابر پاسکال',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'فشار و شاره‌ها',
        topic: 'فصل ۸: فشار مایعات و هیدرولیک',
        icon: 'droplets',
        desc: 'فشار در عمق (P = ρgh)، مانومتر لوله U شکل با دو مایع امتزاج‌ناپذیر و اصل بالابر هیدرولیکی پاسکال.',
        description: 'فشار در عمق (P = ρgh)، مانومتر لوله U شکل با دو مایع امتزاج‌ناپذیر و اصل بالابر هیدرولیکی پاسکال.',
        formula: 'P = \\rho g h \\quad , \\quad \\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\quad , \\quad \\rho_1 h_1 = \\rho_2 h_2',
        badge: 'سمپاد پایه نهم — هیدرواستاتیک',
        goals: [
            'بررسی افزایش خطی فشار هیدرواستاتیک با افزایش عمق مایع',
            'تعیین چگالی مایع مجهول در لوله U شکل بر مبنای برابری فشار در سطح هم‌تراز',
            'کاربرد اصل پاسکال در بالابر هیدرولیک و افزایش متناظر نیرو به نسبت مساحت پیستون‌ها'
        ],
        phetSlug: 'under-pressure',
        nativeSim: 'renderPressureSim'
    },
    {
        id: 'solid_pressure',
        title: 'فشار در جامدات و سطح تماس در ماسه',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'فشار و نیرو',
        topic: 'فصل ۸: فشار جامدات و سطح مقطع',
        icon: 'box',
        desc: 'فشار ناشی از وزن قالب در وجوه مختلف (P = F/A) و عمق فرورفتگی متناظر در بستر ماسه.',
        description: 'فشار ناشی از وزن قالب در وجوه مختلف (P = F/A) و عمق فرورفتگی متناظر در بستر ماسه.',
        formula: 'P = \\frac{F}{A} = \\frac{m g}{A} \\quad , \\quad \\Delta h_{\\text{sink}} \\propto P',
        badge: 'سمپاد پایه نهم — فشار جامدات',
        goals: [
            'بررسی رابطه عکس فشار با مساحت سطح اتکا برای یک جسم با وزن ثابت',
            'آزمایش قرارگیری قالب مستطیلی روی سه وجه با مساحت‌های ۲۰۰، ۱۰۰ و ۵۰ سانتی‌متر مربع',
            'سنجش عمق فرورفتگی در ماسه به عنوان معیاری عینی از مقدار فشار وارد شده'
        ],
        phetSlug: 'states-of-matter-basics',
        nativeSim: 'renderSolidPressureSim'
    },
    {
        id: 'waves',
        title: 'امواج مکانیکی، صوت و پدیده تشدید',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'امواج و ارتعاشات',
        topic: 'فصل ۴ و ۵: امواج مکانیکی و صوت',
        icon: 'radio',
        desc: 'موج عرضی در طناب و موج طولی صوتی، رابطه تندی با بسامد و طول موج (v = λf) و هماهنگ‌های صوتی.',
        description: 'موج عرضی در طناب و موج طولی صوتی، رابطه تندی با بسامد و طول موج (v = λf) و هماهنگ‌های صوتی.',
        formula: 'v = \\lambda \\cdot f \\quad , \\quad f_n = n \\frac{v}{2L} \\quad , \\quad v = \\sqrt{\\frac{T}{\\mu}}',
        badge: 'سمپاد پایه نهم — امواج و صوت',
        goals: [
            'مشاهده انتشار موج عرضی و جابجایی عمودی ذره‌ها نسبت به راستای انتشار',
            'بررسی انتشار موج طولی صوتی و تشکیل نواحی تراکم و انبساط در لوله صوتی',
            'مشاهده گره‌ها، شکم‌ها و هارمونیک‌های مختلف در حالت تشدید'
        ],
        phetSlug: 'wave-on-a-string',
        nativeSim: 'renderWavesSim'
    }
];

class PhysicsSimulators {
    constructor() {
        this.catalog = SIMULATOR_CATALOG;
        this.currentLiveState = null;
        this.activeSimType = null;
        this.activeMode = 'native';
        this.stopwatchState = { running: false, elapsed: 0, interval: null, laps: [] };
    }

    getSimulatorForLesson(lessonId, chapterTitle = '') {
        let title = '';
        if (lessonId && typeof lessonId === 'object') {
            title = ((lessonId.title || '') + ' ' + (lessonId.chapter_title || '') + ' ' + (lessonId.description || '')).toLowerCase();
        } else {
            title = ((lessonId || '') + ' ' + (chapterTitle || '')).toLowerCase();
        }
        if (title.includes('چگالی') || title.includes('ارشمیدس') || title.includes('اندازه‌گیری') || title.includes('حجم')) return 'density';
        if (title.includes('دما') || title.includes('گرما') || title.includes('حرارت') || title.includes('گرماسنج') || title.includes('کالری')) return 'calorimetry';
        if (title.includes('انرژی') || title.includes('پایستگی') || title.includes('جنبشی') || title.includes('پتانسیل')) return 'energy';
        if (title.includes('اهرم') || title.includes('گشتاور') || title.includes('ماشین') || title.includes('قرقره')) return 'levers';
        if (title.includes('مدار') || title.includes('اهم') || title.includes('الکتریسیته جاری') || title.includes('مقاومت') || title.includes('جریان') || title.includes('ولتاژ')) return 'circuit';
        if (title.includes('مغناطیس') || title.includes('آهنربا') || title.includes('سیملوله') || title.includes('قطب‌نما') || title.includes('الکترومغناطیس')) return 'magnetism';
        if (title.includes('ساکن') || title.includes('بار الکتریکی') || title.includes('الکتروسکوپ') || (title.includes('القا') && !title.includes('مغناطیس') && !title.includes('آهنربا'))) return 'electrostatics';
        if (title.includes('شکست') || title.includes('نور') || title.includes('منشور') || title.includes('آینه') || title.includes('اپتیک') || title.includes('بازتاب')) return 'optics';
        if (title.includes('نیوتون') || title.includes('شتاب') || title.includes('حرکت') || title.includes('اصطکاک') || title.includes('دینامیک')) return 'newton';
        if (title.includes('هوک') || title.includes('فنر') || title.includes('کشسانی')) return 'hooke';
        if (title.includes('شاره') || title.includes('پاسکال') || title.includes('هیدرولیک') || title.includes('مایع') || title.includes('مانومتر')) return 'pressure';
        if (title.includes('جامد') || title.includes('سطح تماس') || title.includes('فشار در جامدات')) return 'solid_pressure';
        if (title.includes('موج') || title.includes('صوت') || title.includes('ارتعاش') || title.includes('بسامد') || title.includes('فرکانس')) return 'waves';
        return 'density';
    }

    mount(type, containerId, mode = 'native') {
        const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        if (!container) return;

        this.activeSimType = type;
        this.activeMode = mode;
        const labDef = SIMULATOR_CATALOG.find(s => s.id === type) || SIMULATOR_CATALOG[0];

        if (mode === 'phet') {
            this.renderPhetSim(container, labDef);
            return;
        }

        switch (type) {
            case 'density': this.renderDensitySim(container); break;
            case 'calorimetry': this.renderCalorimetrySim(container); break;
            case 'energy': this.renderEnergySim(container); break;
            case 'levers': this.renderLeversSim(container); break;
            case 'circuit': this.renderCircuitSim(container); break;
            case 'electrostatics': this.renderElectrostaticsSim(container); break;
            case 'optics': this.renderOpticsSim(container); break;
            case 'magnetism': this.renderMagnetismSim(container); break;
            case 'newton': this.renderNewtonSim(container); break;
            case 'hooke': this.renderHookeSim(container); break;
            case 'pressure': this.renderPressureSim(container); break;
            case 'solid_pressure': this.renderSolidPressureSim(container); break;
            case 'waves': this.renderWavesSim(container); break;
            default: this.renderDensitySim(container); break;
        }

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) setTimeout(() => window.renderMathInPage(container), 50);
    }

    // =========================================================================
    // 1. DENSITY & ARCHIMEDES (پایه هفتم: چگالی، جابجایی مایع و شناوری ارشمیدس)
    // =========================================================================
    renderDensitySim(container) {
        let mass = 150; // g
        let volume = 100; // cm3
        let liquidDensity = 1.0; // g/cm3
        let liquidName = 'آب خالص';
        let liquidColor = 'rgba(6,182,212,0.35)';
        let suspensionMode = 'free'; // 'free' or 'spring'

        const update = () => {
            const solidDensity = mass / volume;
            const solidDensityKg = Math.round(solidDensity * 1000);
            const liquidDensityKg = Math.round(liquidDensity * 1000);
            const weightN = (mass / 1000) * 9.8;

            let submergedPercent = 0;
            let statusText = '';
            let statusColor = '';
            let blockYPercent = 20;
            let apparentWeightN = 0;
            let displacedVolume = 0;
            let buoyantForceN = 0;

            if (suspensionMode === 'spring') {
                submergedPercent = 100;
                displacedVolume = volume;
                buoyantForceN = (displacedVolume * liquidDensity / 1000) * 9.8;
                apparentWeightN = Math.max(0, weightN - buoyantForceN);
                statusText = `آویزان از نیروسنج در مایع (وزن ظاهری = ${apparentWeightN.toFixed(2)} N)`;
                statusColor = 'text-amber-400';
                blockYPercent = 46;
            } else {
                if (solidDensity < liquidDensity - 0.005) {
                    submergedPercent = Math.min(99, Math.round((solidDensity / liquidDensity) * 100));
                    displacedVolume = Math.round((submergedPercent / 100) * volume);
                    buoyantForceN = weightN;
                    apparentWeightN = 0;
                    statusText = `شناور روی سطح مایع (نیروی شناوری F_B = وزن جسم W = ${weightN.toFixed(2)} N)`;
                    statusColor = 'text-cyan-400';
                    blockYPercent = 18 - (100 - submergedPercent) * 0.15;
                } else if (Math.abs(solidDensity - liquidDensity) <= 0.005) {
                    submergedPercent = 100;
                    displacedVolume = volume;
                    buoyantForceN = weightN;
                    apparentWeightN = 0;
                    statusText = `غوطه‌ور معلق در عمق مایع (چگالی جسم = چگالی مایع)`;
                    statusColor = 'text-amber-400';
                    blockYPercent = 48;
                } else {
                    submergedPercent = 100;
                    displacedVolume = volume;
                    buoyantForceN = (displacedVolume * liquidDensity / 1000) * 9.8;
                    apparentWeightN = Math.max(0, weightN - buoyantForceN);
                    statusText = `ته‌نشین شده در کف استوانه (وزن جسم > نیروی شناوری ارشمیدس)`;
                    statusColor = 'text-rose-400';
                    blockYPercent = 75;
                }
            }

            const baseVol = 250;
            const totalVol = baseVol + displacedVolume;
            const liquidLevelPercent = Math.min(96, Math.max(20, (totalVol / 500) * 100));

            this.currentLiveState = {
                labId: 'density',
                title: 'آزمایش چگالی، استوانه مدرج و نیروی شناوری ارشمیدس',
                params: {
                    'مایع آزمایشی': `${liquidName} (ρ = ${liquidDensity} g/cm³)`,
                    'جرم جسم (m)': `${mass} گرم`,
                    'حجم اولیه جسم (V)': `${volume} سانتی‌متر مکعب (mL)`,
                    'چگالی محاسبه‌شده جسم (ρ = m/V)': `${solidDensity.toFixed(2)} g/cm³ (${solidDensityKg} kg/m³)`,
                    'حجم مایع جابجا شده (ΔV)': `${displacedVolume} mL`,
                    'سطح نهایی استوانه مدرج': `${totalVol} mL`,
                    'نیروی شناوری ارشمیدس (F_B)': `${buoyantForceN.toFixed(2)} نیوتون`,
                    'نیروی وزن واقعی در هوا (W)': `${weightN.toFixed(2)} نیوتون`,
                    'وزن ظاهری (W_apparent)': `${apparentWeightN.toFixed(2)} نیوتون`,
                    'وضعیت فیزیکی': statusText
                }
            };

            const mVal = document.getElementById('sim-dens-m-val');
            const vVal = document.getElementById('sim-dens-v-val');
            const dVal = document.getElementById('sim-dens-d-val');
            const fbVal = document.getElementById('sim-dens-fb-val');
            const wAppVal = document.getElementById('sim-dens-wapp-val');
            const statusEl = document.getElementById('sim-dens-status');
            const blockEl = document.getElementById('sim-dens-block');
            const vDeltaEl = document.getElementById('sim-dens-vdelta');
            const liqCol = document.getElementById('sim-dens-liquid-col');
            const dynoVal = document.getElementById('sim-dens-dyno-val');
            const dynoBox = document.getElementById('sim-dens-dyno-box');

            if (mVal) mVal.innerText = `${mass} g`;
            if (vVal) vVal.innerText = `${volume} cm³`;
            if (dVal) dVal.innerText = `${solidDensity.toFixed(2)} g/cm³ (${solidDensityKg} kg/m³)`;
            if (fbVal) fbVal.innerText = `${buoyantForceN.toFixed(2)} N`;
            if (wAppVal) wAppVal.innerText = `${apparentWeightN.toFixed(2)} N (وزن در هوا: ${weightN.toFixed(2)} N)`;
            if (vDeltaEl) vDeltaEl.innerText = `حجم جابجاشده: ${displacedVolume} mL (سطح نهایی: ${totalVol} mL)`;
            if (statusEl) {
                statusEl.innerText = statusText;
                statusEl.className = `font-bold text-xs ${statusColor}`;
            }

            if (liqCol) {
                liqCol.style.height = `${liquidLevelPercent}%`;
                liqCol.style.backgroundColor = liquidColor;
            }

            if (blockEl) {
                blockEl.style.top = `${blockYPercent}%`;
                const scale = Math.min(1.25, Math.max(0.75, 0.75 + (volume / 400) * 0.5));
                blockEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }

            if (dynoBox) dynoBox.style.display = suspensionMode === 'spring' ? 'flex' : 'none';
            if (dynoVal) dynoVal.innerText = `${apparentWeightN.toFixed(2)} N`;
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 text-white space-y-6 shadow-2xl">
            <!-- Header Bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                    <h4 class="font-black text-base text-cyan-300">کارگاه چگالی، استوانه مدرج و نیروی شناوری ارشمیدس</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">پایه هفتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>ثبت در گزارش کار</span>
                    </button>
                    <button id="claim-lab-xp-density" onclick="window.claimLabXp('density', 'چگالی و ارشمیدس')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <!-- Experiment Mode Switcher -->
            <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="text-slate-400 font-bold">حالت آزمایشگاه:</span>
                <button id="dens-mode-free" class="px-3.5 py-1.5 rounded-xl bg-cyan-600 text-white font-bold border border-cyan-400 transition-all">
                    شناوری آزاد در مایع (ترازوی کف)
                </button>
                <button id="dens-mode-spring" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
                    آویزان از نیروسنج فنری (وزن ظاهری W - F_B)
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1.5">انتخاب مایع درون استوانه مدرج:</label>
                        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                            <button id="liq-water" class="dens-liq-btn p-2 rounded-xl bg-cyan-600 text-white font-bold border border-cyan-400 transition-all text-center">آب خالص (۱٫۰۰)</button>
                            <button id="liq-salt" class="dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">آب‌نمک (۱٫۲۰)</button>
                            <button id="liq-oil" class="dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">روغن مایع (۰٫۹۲)</button>
                            <button id="liq-alcohol" class="dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">الکل (۰٫۷۹)</button>
                            <button id="liq-mercury" class="dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">جیوه (۱۳٫۶)</button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1.5">اجسام آزمایشی کتاب درسی علوم هفتم:</label>
                        <div class="flex flex-wrap gap-1.5 text-xs">
                            <button id="mat-cork" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">چوب‌پنبه (۰٫۲۴)</button>
                            <button id="mat-wood" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">چوب راش (۰٫۷۰)</button>
                            <button id="mat-ice" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">یخ (۰٫۹۲)</button>
                            <button id="mat-alu" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">آلومینیوم (۲٫۷۰)</button>
                            <button id="mat-iron" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">آهن (۷٫۸۷)</button>
                            <button id="mat-gold" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">طلا (۱۹٫۳)</button>
                        </div>
                    </div>

                    <div class="space-y-3 pt-1">
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1.5">
                                <span class="text-slate-300">جرم جسم با ترازوی دیجیتال (m):</span>
                                <span id="sim-dens-m-val" class="text-cyan-400 font-mono font-bold">150 g</span>
                            </div>
                            <input type="range" min="10" max="600" value="150" id="sim-dens-m-slider" class="physics-slider w-full" />
                        </div>
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-1.5">
                                <span class="text-slate-300">حجم هندسی جسم (V):</span>
                                <span id="sim-dens-v-val" class="text-indigo-400 font-mono font-bold">100 cm³</span>
                            </div>
                            <input type="range" min="20" max="400" value="100" id="sim-dens-v-slider" class="physics-slider w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">چگالی جسم (ρ = m/V):</span>
                            <span id="sim-dens-d-val" class="text-xs sm:text-sm font-black text-amber-400 font-mono">1.50 g/cm³</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">نیروی شناوری (F_B):</span>
                            <span id="sim-dens-fb-val" class="text-xs sm:text-sm font-black text-emerald-400 font-mono">0.98 N</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 col-span-2 sm:col-span-1">
                            <span class="text-[10px] text-slate-400 block mb-0.5">وزن ظاهری (W - F_B):</span>
                            <span id="sim-dens-wapp-val" class="text-xs sm:text-sm font-black text-cyan-300 font-mono">0.49 N</span>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-bold">وضعیت فیزیکی:</span>
                            <span id="sim-dens-status" class="font-bold text-xs text-rose-400">ته‌نشین شده در کف</span>
                        </div>
                        <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                            <span id="sim-dens-vdelta">حجم جابجاشده: ۱۰۰ mL</span>
                            <span class="text-cyan-400 font-mono">استوانه مدرج ۵۰۰ میلی‌لیتری</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[360px] relative">
                    <div id="sim-dens-dyno-box" class="flex flex-col items-center mb-1" style="display: none;">
                        <div class="w-10 h-14 rounded-lg bg-slate-800 border-2 border-amber-500/80 flex flex-col items-center justify-center shadow-lg">
                            <span class="text-[8px] text-amber-300 font-mono font-bold">نیروسنج</span>
                            <span id="sim-dens-dyno-val" class="text-[10px] font-black text-white font-mono">0.49 N</span>
                        </div>
                        <div class="w-0.5 h-8 bg-slate-400"></div>
                    </div>

                    <div class="relative w-48 h-72 rounded-b-3xl border-4 border-t-0 border-slate-500/60 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950/70 overflow-hidden shadow-2xl">
                        <div id="sim-dens-liquid-col" class="absolute inset-x-0 bottom-0 bg-cyan-500/30 border-t-2 border-cyan-300/80 backdrop-blur-xs transition-all duration-300" style="height: 60%; background-color: rgba(6,182,212,0.35);">
                            <div id="sim-dens-block" class="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-[10px] font-black text-white transition-all duration-300">
                                <span>جسم</span>
                                <span class="text-[8px] font-mono opacity-80">Solid</span>
                            </div>
                        </div>

                        <div class="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-[8px] text-white/50 font-mono select-none pointer-events-none">
                            <span>- 500 mL</span>
                            <span>- 400 mL</span>
                            <span>- 300 mL</span>
                            <span>- 200 mL</span>
                            <span>- 100 mL</span>
                        </div>
                        <div class="absolute left-2 inset-y-0 w-2 bg-white/10 rounded-full blur-[1px] pointer-events-none"></div>
                    </div>
                    <span class="text-[11px] text-slate-400 font-bold mt-2.5">استوانه مدرج ۵۰۰mL با تغییر سطح مایع (ΔV)</span>
                </div>
            </div>
        </div>
        `;

        const mSlider = document.getElementById('sim-dens-m-slider');
        const vSlider = document.getElementById('sim-dens-v-slider');
        if (mSlider) mSlider.addEventListener('input', (e) => { mass = parseFloat(e.target.value); update(); });
        if (vSlider) vSlider.addEventListener('input', (e) => { volume = parseFloat(e.target.value); update(); });

        document.getElementById('dens-mode-free')?.addEventListener('click', () => {
            suspensionMode = 'free';
            document.getElementById('dens-mode-free').className = 'px-3.5 py-1.5 rounded-xl bg-cyan-600 text-white font-bold border border-cyan-400 transition-all';
            document.getElementById('dens-mode-spring').className = 'px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all';
            update();
        });
        document.getElementById('dens-mode-spring')?.addEventListener('click', () => {
            suspensionMode = 'spring';
            document.getElementById('dens-mode-spring').className = 'px-3.5 py-1.5 rounded-xl bg-cyan-600 text-white font-bold border border-cyan-400 transition-all';
            document.getElementById('dens-mode-free').className = 'px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all';
            update();
        });

        const setLiquid = (dens, name, col, btnId) => {
            liquidDensity = dens;
            liquidName = name;
            liquidColor = col;
            document.querySelectorAll('.dens-liq-btn').forEach(b => {
                b.className = 'dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'dens-liq-btn p-2 rounded-xl bg-cyan-600 text-white font-bold border border-cyan-400 transition-all text-center';
            update();
        };

        document.getElementById('liq-water')?.addEventListener('click', () => setLiquid(1.0, 'آب خالص', 'rgba(6,182,212,0.35)', 'liq-water'));
        document.getElementById('liq-salt')?.addEventListener('click', () => setLiquid(1.2, 'آب‌نمک غلیظ', 'rgba(15,118,110,0.45)', 'liq-salt'));
        document.getElementById('liq-oil')?.addEventListener('click', () => setLiquid(0.92, 'روغن مایع', 'rgba(245,158,11,0.4)', 'liq-oil'));
        document.getElementById('liq-alcohol')?.addEventListener('click', () => setLiquid(0.79, 'الکل صنعتی', 'rgba(168,85,247,0.3)', 'liq-alcohol'));
        document.getElementById('liq-mercury')?.addEventListener('click', () => setLiquid(13.6, 'جیوه مایع', 'rgba(148,163,184,0.7)', 'liq-mercury'));

        const setPreset = (m, v) => {
            mass = m;
            volume = v;
            if (mSlider) mSlider.value = m;
            if (vSlider) vSlider.value = v;
            update();
        };
        document.getElementById('mat-cork')?.addEventListener('click', () => setPreset(24, 100));
        document.getElementById('mat-wood')?.addEventListener('click', () => setPreset(70, 100));
        document.getElementById('mat-ice')?.addEventListener('click', () => setPreset(92, 100));
        document.getElementById('mat-alu')?.addEventListener('click', () => setPreset(270, 100));
        document.getElementById('mat-iron')?.addEventListener('click', () => setPreset(393, 50));
        document.getElementById('mat-gold')?.addEventListener('click', () => setPreset(386, 20));

        update();
    }

    // =========================================================================
    // 2. CALORIMETRY & HEAT (پایه هفتم: گرماسنجی، تعادل حرارتی و نمودار جوش)
    // =========================================================================
    renderCalorimetrySim(container) {
        let activeTab = 'mixture';
        let m1 = 150, t1 = 20, c1 = 4200, name1 = 'آب سرد';
        let m2 = 100, t2 = 80, c2 = 4200, name2 = 'آب گرم';
        let burnerOn = false, waterTemp = 20, boilingInterval = null, heatTime = 0;

        const updateMixture = () => {
            const numerator = (m1 * c1 * t1) + (m2 * c2 * t2);
            const denominator = (m1 * c1) + (m2 * c2);
            const teq = numerator / denominator;
            const qExchange = (m1 / 1000) * c1 * (teq - t1);

            this.currentLiveState = {
                labId: 'calorimetry',
                title: 'آزمایش دماسنجی و تعادل گرمایی گرماسنج',
                params: {
                    'ماده ۱': `${name1} (${m1}g در دمای ${t1}°C)`,
                    'ماده ۲': `${name2} (${m2}g در دمای ${t2}°C)`,
                    'دمای تعادل محاسبه‌شده (T_eq)': `${teq.toFixed(1)} °C (${(teq + 273.15).toFixed(1)} K)`,
                    'گرمای مبادله‌شده (Q = mcΔT)': `${Math.round(qExchange)} ژول`,
                    'قانون بقای انرژی گرمایی': 'Q_دریافتی + Q_ازدست‌رفته = ۰'
                }
            };

            const t1Val = document.getElementById('sim-cal-t1-val');
            const m1Val = document.getElementById('sim-cal-m1-val');
            const t2Val = document.getElementById('sim-cal-t2-val');
            const m2Val = document.getElementById('sim-cal-m2-val');
            const teqVal = document.getElementById('sim-cal-teq-val');
            const teqKVal = document.getElementById('sim-cal-teqk-val');
            const qVal = document.getElementById('sim-cal-q-val');
            const mercEl = document.getElementById('sim-cal-mercury');

            if (t1Val) t1Val.innerText = `${t1} °C`;
            if (m1Val) m1Val.innerText = `${m1} g`;
            if (t2Val) t2Val.innerText = `${t2} °C`;
            if (m2Val) m2Val.innerText = `${m2} g`;
            if (teqVal) teqVal.innerText = `${teq.toFixed(1)} °C`;
            if (teqKVal) teqKVal.innerText = `${(teq + 273.15).toFixed(1)} K`;
            if (qVal) qVal.innerText = `${Math.round(qExchange)} J`;

            if (mercEl) {
                const percent = Math.min(95, Math.max(5, (teq / 100) * 90));
                mercEl.style.height = `${percent}%`;
            }
        };

        const updateBoilingUI = () => {
            const bTempVal = document.getElementById('sim-cal-btemp-val');
            const bTimeVal = document.getElementById('sim-cal-btime-val');
            const bStateVal = document.getElementById('sim-cal-bstate-val');
            const bSteam = document.getElementById('sim-cal-steam');
            const bFlame = document.getElementById('sim-cal-flame');
            const mercBoil = document.getElementById('sim-cal-boil-mercury');

            if (bTempVal) bTempVal.innerText = `${waterTemp.toFixed(1)} °C`;
            if (bTimeVal) bTimeVal.innerText = `${heatTime} ثانیه`;
            if (mercBoil) {
                const percent = Math.min(95, Math.max(5, (waterTemp / 110) * 90));
                mercBoil.style.height = `${percent}%`;
            }

            if (bFlame) bFlame.style.display = burnerOn ? 'block' : 'none';
            if (bSteam) bSteam.style.display = waterTemp >= 99.5 ? 'flex' : 'none';

            if (bStateVal) {
                if (waterTemp >= 99.8) {
                    bStateVal.innerText = 'نقطه جوش آب (۱۰۰°C) — دمای آب تا تبخیر کامل ثابت می‌ماند!';
                    bStateVal.className = 'font-bold text-xs text-rose-400 animate-pulse';
                } else if (burnerOn) {
                    bStateVal.innerText = 'در حال افزایش دما با دریافت گرمای شعله بونزن...';
                    bStateVal.className = 'font-bold text-xs text-amber-300';
                } else {
                    bStateVal.innerText = 'شعله خاموش است';
                    bStateVal.className = 'font-bold text-xs text-slate-400';
                }
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-amber-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                    <h4 class="font-black text-base text-amber-300">کارگاه گرماسنجی، تعادل حرارتی و نمودار جوش</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold">پایه هفتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-calorimetry" onclick="window.claimLabXp('calorimetry', 'دما و تعادل گرمایی')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-2 text-xs">
                <button id="cal-tab-mix" class="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold border border-amber-400 transition-all">
                    ۱. اختلاط در گرماسنج و دمای تعادل (T_eq)
                </button>
                <button id="cal-tab-boil" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
                    ۲. گرمایش با چراغ بونزن و پلاتوی جوش ۱۰۰°C
                </button>
            </div>

            <div id="cal-view-mixture" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-8 space-y-4">
                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                        <span class="text-xs font-bold text-cyan-300 block">ماده ۱ (سرد): ${name1} (c = ${c1} J/kg°C)</span>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-slate-400">جرم m₁:</span>
                                    <span id="sim-cal-m1-val" class="text-cyan-400 font-mono font-bold">150 g</span>
                                </div>
                                <input type="range" min="50" max="400" value="150" id="sim-cal-m1-slider" class="physics-slider w-full" />
                            </div>
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-slate-400">دما T₁:</span>
                                    <span id="sim-cal-t1-val" class="text-cyan-400 font-mono font-bold">20 °C</span>
                                </div>
                                <input type="range" min="5" max="45" value="20" id="sim-cal-t1-slider" class="physics-slider w-full" />
                            </div>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                        <span class="text-xs font-bold text-amber-300 block">ماده ۲ (گرم): ${name2} (c = ${c2} J/kg°C)</span>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-slate-400">جرم m₂:</span>
                                    <span id="sim-cal-m2-val" class="text-amber-400 font-mono font-bold">100 g</span>
                                </div>
                                <input type="range" min="50" max="400" value="100" id="sim-cal-m2-slider" class="physics-slider w-full" />
                            </div>
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-slate-400">دما T₂:</span>
                                    <span id="sim-cal-t2-val" class="text-amber-400 font-mono font-bold">80 °C</span>
                                </div>
                                <input type="range" min="50" max="95" value="80" id="sim-cal-t2-slider" class="physics-slider w-full" />
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">دمای تعادل (T_eq)</span>
                            <span id="sim-cal-teq-val" class="text-base font-black text-emerald-400 font-mono">44.0 °C</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">دمای کلوین</span>
                            <span id="sim-cal-teqk-val" class="text-base font-black text-amber-400 font-mono">317.2 K</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">گرمای مبادله‌شده (Q)</span>
                            <span id="sim-cal-q-val" class="text-base font-black text-cyan-400 font-mono">15120 J</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[300px]">
                    <div class="relative w-16 h-64 flex flex-col items-center">
                        <div class="w-5 h-52 rounded-t-full bg-slate-800 border-2 border-slate-500 overflow-hidden relative shadow-inner">
                            <div id="sim-cal-mercury" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-600 to-rose-500 rounded-t-full transition-all duration-200" style="height: 44%;"></div>
                        </div>
                        <div class="w-12 h-12 -mt-3 rounded-full bg-red-600 border-2 border-slate-400 shadow-xl flex items-center justify-center">
                            <i data-lucide="thermometer" class="w-6 h-6 text-white/90"></i>
                        </div>
                    </div>
                    <span class="text-[11px] text-slate-400 font-bold mt-2">دماسنج گرماسنج آزمایشگاه</span>
                </div>
            </div>

            <div id="cal-view-boiling" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div class="flex items-center gap-3">
                        <button id="sim-cal-burner-btn" class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg">
                            <i data-lucide="flame" class="w-4 h-4"></i>
                            <span id="sim-cal-burner-lbl">روشن کردن شعله بونزن</span>
                        </button>
                        <button id="sim-cal-burner-reset" class="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700">
                            بازنشانی آب سرد (۲۰°C)
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">دمای لحظه‌ای آب:</span>
                            <span id="sim-cal-btemp-val" class="text-base font-black text-amber-400 font-mono">20.0 °C</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">زمان گرمایش:</span>
                            <span id="sim-cal-btime-val" class="text-base font-black text-cyan-400 font-mono">0 ثانیه</span>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <span id="sim-cal-bstate-val" class="font-bold text-xs text-slate-400">شعله خاموش است</span>
                        <p class="text-[11px] text-slate-400 mt-1">
                            نکته کتاب علوم هفتم: در پدیده جوشیدن، گرما صرف تغییر حالت (شکست پیوندها) می‌شود و دما در ۱۰۰ درجه سلسیوس ثابت می‌ماند.
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-5 p-5 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative">
                    <div id="sim-cal-steam" class="hidden items-center gap-1.5 text-slate-300 text-xs animate-bounce mb-1">
                        <span>♨️</span><span>بخار آب در ۱۰۰°C</span><span>♨️</span>
                    </div>

                    <div class="relative w-36 h-44 rounded-b-2xl border-4 border-t-0 border-slate-400/60 bg-cyan-950/20 overflow-hidden shadow-2xl flex flex-col justify-end">
                        <div class="w-full bg-cyan-500/35 border-t border-cyan-300" style="height: 65%;"></div>
                        <div class="absolute left-6 top-2 bottom-4 w-3 rounded-full bg-slate-800 border border-slate-500 overflow-hidden">
                            <div id="sim-cal-boil-mercury" class="absolute inset-x-0 bottom-0 bg-red-500 transition-all duration-100" style="height: 20%;"></div>
                        </div>
                    </div>

                    <div class="w-40 h-2 bg-slate-600 rounded-full mt-1"></div>
                    <div id="sim-cal-flame" class="hidden text-3xl animate-pulse mt-1 select-none">🔥</div>
                </div>
            </div>
        </div>
        `;

        document.getElementById('cal-tab-mix')?.addEventListener('click', () => {
            activeTab = 'mixture';
            document.getElementById('cal-tab-mix').className = 'px-4 py-2 rounded-xl bg-amber-600 text-white font-bold border border-amber-400 transition-all';
            document.getElementById('cal-tab-boil').className = 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all';
            document.getElementById('cal-view-mixture').className = 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-center';
            document.getElementById('cal-view-boiling').className = 'hidden';
            updateMixture();
        });

        document.getElementById('cal-tab-boil')?.addEventListener('click', () => {
            activeTab = 'boiling';
            document.getElementById('cal-tab-boil').className = 'px-4 py-2 rounded-xl bg-amber-600 text-white font-bold border border-amber-400 transition-all';
            document.getElementById('cal-tab-mix').className = 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all';
            document.getElementById('cal-view-mixture').className = 'hidden';
            document.getElementById('cal-view-boiling').className = 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-center';
            updateBoilingUI();
        });

        const m1Sl = document.getElementById('sim-cal-m1-slider');
        const t1Sl = document.getElementById('sim-cal-t1-slider');
        const m2Sl = document.getElementById('sim-cal-m2-slider');
        const t2Sl = document.getElementById('sim-cal-t2-slider');

        if (m1Sl) m1Sl.addEventListener('input', (e) => { m1 = parseFloat(e.target.value); updateMixture(); });
        if (t1Sl) t1Sl.addEventListener('input', (e) => { t1 = parseFloat(e.target.value); updateMixture(); });
        if (m2Sl) m2Sl.addEventListener('input', (e) => { m2 = parseFloat(e.target.value); updateMixture(); });
        if (t2Sl) t2Sl.addEventListener('input', (e) => { t2 = parseFloat(e.target.value); updateMixture(); });

        const bBtn = document.getElementById('sim-cal-burner-btn');
        const bReset = document.getElementById('sim-cal-burner-reset');

        if (bBtn) bBtn.addEventListener('click', () => {
            burnerOn = !burnerOn;
            document.getElementById('sim-cal-burner-lbl').innerText = burnerOn ? 'خاموش کردن شعله' : 'روشن کردن شعله بونزن';
            bBtn.className = burnerOn
                ? 'px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg'
                : 'px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg';

            if (burnerOn) {
                if (!boilingInterval) {
                    boilingInterval = setInterval(() => {
                        if (burnerOn) {
                            heatTime++;
                            if (waterTemp < 100) {
                                waterTemp = Math.min(100, waterTemp + 2.5);
                            }
                            updateBoilingUI();
                        }
                    }, 500);
                }
            }
            updateBoilingUI();
        });

        if (bReset) bReset.addEventListener('click', () => {
            burnerOn = false;
            waterTemp = 20;
            heatTime = 0;
            if (boilingInterval) { clearInterval(boilingInterval); boilingInterval = null; }
            if (bBtn) {
                bBtn.className = 'px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg';
                document.getElementById('sim-cal-burner-lbl').innerText = 'روشن کردن شعله بونزن';
            }
            updateBoilingUI();
        });

        updateMixture();
    }

    // =========================================================================
    // 3. MECHANICAL ENERGY SIMULATOR (پایه هفتم: پایستگی و تبدیلات انرژی)
    // =========================================================================
    renderEnergySim(container) {
        let mass = 5;
        let height = 8;
        let frictionMu = 0.05;
        let isSimulating = false;
        let simInterval = null;
        let currentY = height;
        let currentV = 0;
        let totalThermal = 0;

        const update = () => {
            const ep = mass * 9.8 * currentY;
            const ek = 0.5 * mass * Math.pow(currentV, 2);
            const etot = ep + ek + totalThermal;

            this.currentLiveState = {
                labId: 'energy',
                title: 'آزمایش پایستگی انرژی مکانیکی و اصطکاک',
                params: {
                    'جرم جسم (m)': `${mass} kg`,
                    'ارتفاع لحظه‌ای (h)': `${currentY.toFixed(2)} متر`,
                    'تندی لحظه‌ای (v)': `${currentV.toFixed(2)} m/s`,
                    'انرژی پتانسیل گرانشی (U = mgh)': `${Math.round(ep)} ژول`,
                    'انرژی جنبشی (K = ½mv²)': `${Math.round(ek)} ژول`,
                    'انرژی تلف‌شده گرمایی اصطکاک (E_th)': `${Math.round(totalThermal)} ژول`,
                    'انرژی کل پایسته (E_total)': `${Math.round(etot)} ژول`
                }
            };

            const hVal = document.getElementById('sim-eng-h-val');
            const mVal = document.getElementById('sim-eng-m-val');
            const epVal = document.getElementById('sim-eng-ep-val');
            const ekVal = document.getElementById('sim-eng-ek-val');
            const ethVal = document.getElementById('sim-eng-eth-val');
            const etotVal = document.getElementById('sim-eng-etot-val');

            const barEp = document.getElementById('sim-eng-bar-ep');
            const barEk = document.getElementById('sim-eng-bar-ek');
            const barEth = document.getElementById('sim-eng-bar-eth');
            const skater = document.getElementById('sim-eng-skater');

            if (hVal) hVal.innerText = `${currentY.toFixed(1)} m`;
            if (mVal) mVal.innerText = `${mass} kg`;
            if (epVal) epVal.innerText = `${Math.round(ep)} J`;
            if (ekVal) ekVal.innerText = `${Math.round(ek)} J`;
            if (ethVal) ethVal.innerText = `${Math.round(totalThermal)} J`;
            if (etotVal) etotVal.innerText = `${Math.round(etot)} J`;

            const maxE = Math.max(1, mass * 9.8 * height + 1);
            if (barEp) barEp.style.height = `${Math.min(100, (ep / maxE) * 100)}%`;
            if (barEk) barEk.style.height = `${Math.min(100, (ek / maxE) * 100)}%`;
            if (barEth) barEth.style.height = `${Math.min(100, (totalThermal / maxE) * 100)}%`;

            if (skater) {
                const yPercent = (currentY / 12) * 80;
                skater.style.bottom = `${10 + yPercent}%`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-blue-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-blue-400 animate-ping"></span>
                    <h4 class="font-black text-base text-blue-300">کارگاه پایستگی انرژی مکانیکی، پتانسیل و جنبشی</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 font-bold">پایه هفتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-blue-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-energy" onclick="window.claimLabXp('energy', 'پایستگی انرژی')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">ارتفاع اولیه رهاسازی (h):</span>
                            <span id="sim-eng-h-val" class="text-blue-400 font-mono font-bold">8.0 m</span>
                        </div>
                        <input type="range" min="2" max="12" step="0.5" value="8" id="sim-eng-h-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">جرم جسم متحرک (m):</span>
                            <span id="sim-eng-m-val" class="text-indigo-400 font-mono font-bold">5 kg</span>
                        </div>
                        <input type="range" min="1" max="20" step="1" value="5" id="sim-eng-m-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">اصطکاک مسیر و تلفات گرمایی:</span>
                            <span id="sim-eng-mu-val" class="text-amber-400 font-mono font-bold">کم (μ = 0.05)</span>
                        </div>
                        <input type="range" min="0" max="0.3" step="0.05" value="0.05" id="sim-eng-mu-slider" class="physics-slider w-full" />
                    </div>

                    <div class="flex items-center gap-2 pt-1">
                        <button id="sim-eng-play-btn" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
                            <i data-lucide="play" class="w-3.5 h-3.5"></i>
                            <span>شروع رهاسازی و حرکت</span>
                        </button>
                        <button id="sim-eng-reset-btn" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700">
                            بازنشانی
                        </button>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[9px] text-blue-400 block font-bold">پتانسیل (U)</span>
                            <span id="sim-eng-ep-val" class="text-xs font-black text-white font-mono">392 J</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[9px] text-emerald-400 block font-bold">جنبشی (K)</span>
                            <span id="sim-eng-ek-val" class="text-xs font-black text-white font-mono">0 J</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[9px] text-rose-400 block font-bold">گرما (E_th)</span>
                            <span id="sim-eng-eth-val" class="text-xs font-black text-white font-mono">0 J</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[9px] text-amber-400 block font-bold">انرژی کل</span>
                            <span id="sim-eng-etot-val" class="text-xs font-black text-white font-mono">392 J</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[290px] flex items-center justify-between gap-4">
                    <div class="relative flex-1 h-56 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-end p-2">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full absolute inset-0">
                            <path d="M 10 10 Q 30 85 90 90" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round" />
                        </svg>
                        <div id="sim-eng-skater" class="absolute left-6 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 border-2 border-white shadow-xl flex items-center justify-center text-[10px] font-black text-slate-900 transition-all duration-75" style="bottom: 70%;">
                            ●
                        </div>
                    </div>

                    <div class="w-24 h-56 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-between">
                        <span class="text-[9px] font-bold text-slate-400">نمودار ستونی</span>
                        <div class="flex items-end gap-2 h-40">
                            <div class="w-5 h-full bg-slate-800 rounded-t flex flex-col justify-end overflow-hidden">
                                <div id="sim-eng-bar-ep" class="w-full bg-blue-500 rounded-t transition-all duration-75" style="height: 100%;"></div>
                            </div>
                            <div class="w-5 h-full bg-slate-800 rounded-t flex flex-col justify-end overflow-hidden">
                                <div id="sim-eng-bar-ek" class="w-full bg-emerald-500 rounded-t transition-all duration-75" style="height: 0%;"></div>
                            </div>
                            <div class="w-5 h-full bg-slate-800 rounded-t flex flex-col justify-end overflow-hidden">
                                <div id="sim-eng-bar-eth" class="w-full bg-rose-500 rounded-t transition-all duration-75" style="height: 0%;"></div>
                            </div>
                        </div>
                        <div class="flex justify-between w-full text-[8px] font-bold text-slate-400 px-1">
                            <span class="text-blue-400">U</span>
                            <span class="text-emerald-400">K</span>
                            <span class="text-rose-400">Eₜₕ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const hSlider = document.getElementById('sim-eng-h-slider');
        const mSlider = document.getElementById('sim-eng-m-slider');
        const muSlider = document.getElementById('sim-eng-mu-slider');
        const playBtn = document.getElementById('sim-eng-play-btn');
        const resetBtn = document.getElementById('sim-eng-reset-btn');

        if (hSlider) hSlider.addEventListener('input', (e) => {
            height = parseFloat(e.target.value);
            currentY = height;
            currentV = 0;
            totalThermal = 0;
            update();
        });
        if (mSlider) mSlider.addEventListener('input', (e) => {
            mass = parseFloat(e.target.value);
            update();
        });
        if (muSlider) muSlider.addEventListener('input', (e) => {
            frictionMu = parseFloat(e.target.value);
            const lbl = document.getElementById('sim-eng-mu-val');
            if (lbl) lbl.innerText = frictionMu === 0 ? 'بدون اصطکاک (μ = 0)' : `μ = ${frictionMu}`;
            update();
        });

        if (playBtn) playBtn.addEventListener('click', () => {
            if (isSimulating) {
                clearInterval(simInterval);
                isSimulating = false;
                playBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>ادامه حرکت</span>`;
            } else {
                isSimulating = true;
                playBtn.innerHTML = `<i data-lucide="pause" class="w-3.5 h-3.5"></i><span>توقف موقت</span>`;
                simInterval = setInterval(() => {
                    if (currentY > 0.1) {
                        currentY = Math.max(0, currentY - 0.25);
                        const loss = frictionMu * mass * 9.8 * 0.25;
                        totalThermal += loss;
                        const ep = mass * 9.8 * currentY;
                        const avail = Math.max(0, mass * 9.8 * height - ep - totalThermal);
                        currentV = Math.sqrt((2 * avail) / mass);
                    } else {
                        const avail = Math.max(0, mass * 9.8 * height - totalThermal);
                        const maxBackHeight = avail / (mass * 9.8);
                        if (maxBackHeight > 0.2) {
                            currentY = maxBackHeight;
                            currentV = 0;
                        } else {
                            clearInterval(simInterval);
                            isSimulating = false;
                            playBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>شروع مجدد</span>`;
                        }
                    }
                    update();
                }, 80);
            }
            if (window.lucide) window.lucide.createIcons();
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (simInterval) clearInterval(simInterval);
            isSimulating = false;
            currentY = height;
            currentV = 0;
            totalThermal = 0;
            if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>شروع رهاسازی</span>`;
            update();
            if (window.lucide) window.lucide.createIcons();
        });

        update();
    }

    // =========================================================================
    // 4. LEVERS & TORQUE SIMULATOR (پایه هفتم: اهرم‌ها، گشتاور و مزیت مکانیکی)
    // =========================================================================
    renderLeversSim(container) {
        let leverClass = 1;
        let effortForce = 40;
        let effortArm = 60;
        let loadArm = 30;

        const update = () => {
            const torqueEffort = effortForce * (effortArm / 100);
            const loadForce = torqueEffort / (loadArm / 100);
            const mechAdvantage = effortArm / loadArm;

            this.currentLiveState = {
                labId: 'levers',
                title: 'آزمایش اهرم‌ها، تعادل گشتاورها و مزیت مکانیکی',
                params: {
                    'نوع اهرم': leverClass === 1 ? 'اهرم نوع اول (تکیه‌گاه در میان)' : (leverClass === 2 ? 'اهرم نوع دوم (جسم در میان - مزیت > ۱)' : 'اهرم نوع سوم (نیرو در میان - مزیت < ۱)'),
                    'نیروی محرک کاربر (F_E)': `${effortForce} نیوتون`,
                    'بازوی محرک (d_E)': `${effortArm} سانتی‌متر`,
                    'بازوی مقاوم (d_R)': `${loadArm} سانتی‌متر`,
                    'نیروی مقاوم قابل غلبه (F_R)': `${loadForce.toFixed(1)} نیوتون`,
                    'گشتاور تعادل (τ = F × d)': `${torqueEffort.toFixed(2)} N.m`,
                    'مزیت مکانیکی اهرم (A = d_E/d_R)': `${mechAdvantage.toFixed(2)} برابر`
                }
            };

            const feVal = document.getElementById('sim-lev-fe-val');
            const deVal = document.getElementById('sim-lev-de-val');
            const drVal = document.getElementById('sim-lev-dr-val');
            const frVal = document.getElementById('sim-lev-fr-val');
            const maVal = document.getElementById('sim-lev-ma-val');
            const descEl = document.getElementById('sim-lev-desc');

            if (feVal) feVal.innerText = `${effortForce} N`;
            if (deVal) deVal.innerText = `${effortArm} cm`;
            if (drVal) drVal.innerText = `${loadArm} cm`;
            if (frVal) frVal.innerText = `${loadForce.toFixed(1)} N`;
            if (maVal) maVal.innerText = `${mechAdvantage.toFixed(2)}`;

            if (descEl) {
                if (leverClass === 1) {
                    descEl.innerText = 'اهرم نوع اول: تکیه‌گاه در وسط قرار دارد (مثل قیچی، انبردست و الاکلنگ). بسته به بازوها، مزیت می‌تواند کمتر، مساوی یا بیشتر از ۱ باشد.';
                } else if (leverClass === 2) {
                    descEl.innerText = 'اهرم نوع دوم: جسم مقاوم در میان قرار دارد (مثل فرغون و فندق‌شکن). همیشه بازوی محرک بزرگتر از مقاوم است و مزیت مکانیکی همواره بیش از ۱ است (صرفه‌جویی در نیرو).';
                } else {
                    descEl.innerText = 'اهرم نوع سوم: نیروی محرک در میان قرار دارد (مثل موچین، انبر زغال و ساعد دست). مزیت مکانیکی همواره کمتر از ۱ است (صرفه‌جویی در زمان و مسافت اثر نیرو).';
                }
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <h4 class="font-black text-base text-emerald-300">کارگاه اهرم‌ها، تعادل گشتاورها و مزیت مکانیکی (A = d_E/d_R)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">پایه هفتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-emerald-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-levers" onclick="window.claimLabXp('levers', 'اهرم‌ها و مزیت مکانیکی')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-300 mb-2">انتخاب نوع اهرم کتاب علوم هفتم:</label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <button id="lev-type-1" class="p-2.5 rounded-xl bg-emerald-600 text-white font-bold border border-emerald-400 transition-all text-center">اهرم نوع اول (تکیه‌گاه در میان)</button>
                    <button id="lev-type-2" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">اهرم نوع دوم (جسم در میان)</button>
                    <button id="lev-type-3" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">اهرم نوع سوم (نیرو در میان)</button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">نیروی محرک اعمالی (F_E):</span>
                            <span id="sim-lev-fe-val" class="text-emerald-400 font-mono font-bold">40 N</span>
                        </div>
                        <input type="range" min="10" max="150" step="5" value="40" id="sim-lev-fe-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">طول بازوی محرک (d_E):</span>
                            <span id="sim-lev-de-val" class="text-cyan-400 font-mono font-bold">60 cm</span>
                        </div>
                        <input type="range" min="10" max="100" step="5" value="60" id="sim-lev-de-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">طول بازوی مقاوم (d_R):</span>
                            <span id="sim-lev-dr-val" class="text-indigo-400 font-mono font-bold">30 cm</span>
                        </div>
                        <input type="range" min="10" max="100" step="5" value="30" id="sim-lev-dr-slider" class="physics-slider w-full" />
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-1">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">نیروی مقاوم قابل جابجایی (F_R):</span>
                            <span id="sim-lev-fr-val" class="text-base font-black text-amber-400 font-mono">80.0 N</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">مزیت مکانیکی (A = d_E/d_R):</span>
                            <span id="sim-lev-ma-val" class="text-base font-black text-emerald-400 font-mono">2.00</span>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <p id="sim-lev-desc" class="text-xs text-slate-300 leading-relaxed"></p>
                    </div>
                </div>

                <div class="lg:col-span-5 p-5 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[280px] flex flex-col items-center justify-center">
                    <svg viewBox="0 0 280 180" class="w-full max-w-[280px] h-auto">
                        <line x1="20" y1="150" x2="260" y2="150" stroke="#475569" stroke-width="3" />
                        <polygon points="140,110 125,150 155,150" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
                        <text x="130" y="165" fill="#94a3b8" font-size="9" font-weight="bold">تکیه‌گاه</text>
                        <rect x="30" y="103" width="220" height="8" rx="3" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
                        <g transform="translate(60, 65)">
                            <rect x="0" y="0" width="30" height="38" fill="#3b82f6" rx="4" stroke="#1d4ed8" stroke-width="2" />
                            <text x="5" y="24" fill="#ffffff" font-size="10" font-weight="bold">F_R</text>
                        </g>
                        <g transform="translate(200, 45)">
                            <line x1="15" y1="0" x2="15" y2="55" stroke="#10b981" stroke-width="3" />
                            <polygon points="15,60 10,48 20,48" fill="#10b981" />
                            <text x="5" y="-5" fill="#34d399" font-size="11" font-weight="bold">F_E ↓</text>
                        </g>
                    </svg>
                    <span class="text-[11px] text-slate-400 font-bold mt-2">شبیه‌ساز گشتاور و قانون تعادل اهرم‌ها</span>
                </div>
            </div>
        </div>
        `;

        const feSlider = document.getElementById('sim-lev-fe-slider');
        const deSlider = document.getElementById('sim-lev-de-slider');
        const drSlider = document.getElementById('sim-lev-dr-slider');

        if (feSlider) feSlider.addEventListener('input', (e) => { effortForce = parseFloat(e.target.value); update(); });
        if (deSlider) deSlider.addEventListener('input', (e) => { effortArm = parseFloat(e.target.value); update(); });
        if (drSlider) drSlider.addEventListener('input', (e) => { loadArm = parseFloat(e.target.value); update(); });

        const setLevType = (t, btnId) => {
            leverClass = t;
            document.querySelectorAll('#lev-type-1, #lev-type-2, #lev-type-3').forEach(b => {
                b.className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'p-2.5 rounded-xl bg-emerald-600 text-white font-bold border border-emerald-400 transition-all text-center';
            update();
        };

        document.getElementById('lev-type-1')?.addEventListener('click', () => setLevType(1, 'lev-type-1'));
        document.getElementById('lev-type-2')?.addEventListener('click', () => setLevType(2, 'lev-type-2'));
        document.getElementById('lev-type-3')?.addEventListener('click', () => setLevType(3, 'lev-type-3'));

        update();
    }


    // =========================================================================
    // 5. OHM'S LAW & CIRCUIT SANDBOX (پایه هشتم: مدار الکتریکی، قانون اهم و سری/موازی)
    // =========================================================================
    renderCircuitSim(container) {
        let voltage = 12; // Volts
        let r1 = 6; // Ohms
        let r2 = 6; // Ohms
        let circuitMode = 'single'; // 'single', 'series', 'parallel'
        let isSwitchOn = true;
        let isFuseBlown = false;
        let bulb1Screwed = true;
        let bulb2Screwed = true;

        const update = () => {
            let req = r1;
            let current = 0;
            let current1 = 0;
            let current2 = 0;
            let v1 = 0;
            let v2 = 0;

            if (circuitMode === 'single') {
                req = r1;
                if (isSwitchOn && !isFuseBlown && bulb1Screwed) {
                    current = voltage / req;
                    current1 = current;
                    v1 = voltage;
                }
            } else if (circuitMode === 'series') {
                // In series: if either bulb is unscrewed, circuit is open!
                req = r1 + r2;
                if (isSwitchOn && !isFuseBlown && bulb1Screwed && bulb2Screwed) {
                    current = voltage / req;
                    current1 = current;
                    current2 = current;
                    v1 = current * r1;
                    v2 = current * r2;
                }
            } else if (circuitMode === 'parallel') {
                // In parallel: branches operate independently!
                if (!bulb1Screwed && !bulb2Screwed) {
                    req = Infinity;
                    current = 0;
                } else if (!bulb1Screwed) {
                    req = r2;
                    if (isSwitchOn && !isFuseBlown) {
                        current2 = voltage / r2;
                        current = current2;
                        v2 = voltage;
                    }
                } else if (!bulb2Screwed) {
                    req = r1;
                    if (isSwitchOn && !isFuseBlown) {
                        current1 = voltage / r1;
                        current = current1;
                        v1 = voltage;
                    }
                } else {
                    req = (r1 * r2) / (r1 + r2);
                    if (isSwitchOn && !isFuseBlown) {
                        current1 = voltage / r1;
                        current2 = voltage / r2;
                        current = current1 + current2;
                        v1 = voltage;
                        v2 = voltage;
                    }
                }
            }

            // Fuse trip protection (> 6.5A)
            if (current > 6.5 && !isFuseBlown) {
                isFuseBlown = true;
                current = 0;
                current1 = 0;
                current2 = 0;
            }

            const powerTotal = current * voltage;
            const power1 = current1 * v1;
            const power2 = current2 * v2;

            this.currentLiveState = {
                labId: 'circuit',
                title: 'آزمایش مدار الکتریکی، قانون اهم و اتصالات متوالی و موازی',
                params: {
                    'نوع مدار': circuitMode === 'single' ? 'تک‌لامپی' : (circuitMode === 'series' ? 'اتصال متوالی (سری)' : 'اتصال موازی'),
                    'ولتاژ باتری (V)': `${voltage} ولت`,
                    'مقاومت لامپ ۱ (R₁)': `${r1} اهم`,
                    'مقاومت لامپ ۲ (R₂)': circuitMode !== 'single' ? `${r2} اهم` : 'غیرفعال',
                    'مقاومت معادل کل (R_eq)': isFinite(req) ? `${req.toFixed(2)} اهم` : 'مدار باز (بی‌نهایت)',
                    'جریان کل مدار (I_tot)': `${current.toFixed(2)} آمپر`,
                    'جریان شاخه ۱': `${current1.toFixed(2)} A (ولتاژ: ${v1.toFixed(1)}V)`,
                    'جریان شاخه ۲': circuitMode !== 'single' ? `${current2.toFixed(2)} A (ولتاژ: ${v2.toFixed(1)}V)` : '-',
                    'توان کل مصرفی (P = VI)': `${powerTotal.toFixed(1)} وات`,
                    'وضعیت لامپ‌ها': `لامپ ۱: ${bulb1Screwed && current1 > 0 ? 'روشن' : 'خاموش'} | لامپ ۲: ${circuitMode !== 'single' ? (bulb2Screwed && current2 > 0 ? 'روشن' : 'خاموش') : '-'}`
                }
            };

            const vVal = document.getElementById('sim-cir-v-val');
            const r1Val = document.getElementById('sim-cir-r1-val');
            const r2Val = document.getElementById('sim-cir-r2-val');
            const reqVal = document.getElementById('sim-cir-req-val');
            const iVal = document.getElementById('sim-cir-i-val');
            const pVal = document.getElementById('sim-cir-p-val');

            const bulb1El = document.getElementById('sim-cir-bulb1');
            const bulb2El = document.getElementById('sim-cir-bulb2');
            const fuseNotice = document.getElementById('sim-cir-fuse-notice');
            const wires = document.querySelectorAll('.circuit-wire');

            if (vVal) vVal.innerText = `${voltage} V`;
            if (r1Val) r1Val.innerText = `${r1} Ω`;
            if (r2Val) r2Val.innerText = `${r2} Ω`;
            if (reqVal) reqVal.innerText = isFinite(req) ? `${req.toFixed(2)} Ω` : 'مدار باز';
            if (iVal) iVal.innerText = `${current.toFixed(2)} A`;
            if (pVal) pVal.innerText = `${powerTotal.toFixed(1)} W`;

            if (fuseNotice) {
                fuseNotice.className = isFuseBlown ? 'p-2 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-bold block animate-pulse' : 'hidden';
            }

            if (bulb1El) {
                if (current1 > 0 && bulb1Screwed) {
                    const brightness = Math.min(1.4, power1 / 20);
                    bulb1El.style.filter = `drop-shadow(0 0 ${10 + brightness * 20}px rgba(251, 191, 36, ${0.4 + brightness * 0.6}))`;
                    bulb1El.style.fill = `rgb(251, ${Math.round(180 + brightness * 70)}, 36)`;
                } else {
                    bulb1El.style.filter = 'none';
                    bulb1El.style.fill = '#475569';
                }
            }

            if (bulb2El) {
                if (current2 > 0 && bulb2Screwed) {
                    const brightness = Math.min(1.4, power2 / 20);
                    bulb2El.style.filter = `drop-shadow(0 0 ${10 + brightness * 20}px rgba(251, 191, 36, ${0.4 + brightness * 0.6}))`;
                    bulb2El.style.fill = `rgb(251, ${Math.round(180 + brightness * 70)}, 36)`;
                } else {
                    bulb2El.style.filter = 'none';
                    bulb2El.style.fill = '#475569';
                }
            }

            wires.forEach(w => {
                if (current > 0) {
                    w.classList.add('circuit-wire-active');
                    w.style.animationDuration = `${Math.max(0.2, 2.0 - current * 0.28)}s`;
                } else {
                    w.classList.remove('circuit-wire-active');
                }
            });
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white space-y-6 shadow-2xl">
            <!-- Header Bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                    <h4 class="font-black text-base text-amber-300">میز کار مدار الکتریکی، قانون اهم و اتصالات سری/موازی</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold">پایه هشتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-circuit" onclick="window.claimLabXp('circuit', 'مدار الکتریکی و قانون اهم')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <!-- Mode Selector & Switch Controls -->
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-xs">
                    <button id="cir-mode-single" class="cir-mode-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold border border-indigo-400 transition-all">
                        مدار تک لامپی
                    </button>
                    <button id="cir-mode-series" class="cir-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all">
                        اتصال متوالی (سری)
                    </button>
                    <button id="cir-mode-parallel" class="cir-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all">
                        اتصال موازی
                    </button>
                </div>

                <div class="flex items-center gap-2">
                    <button id="sim-cir-sw-btn" class="px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-emerald-600 text-white border border-emerald-400 shadow-md">
                        کلید: وصل (روشن)
                    </button>
                    <button id="sim-cir-fuse-reset" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700">
                        تعویض فیوز
                    </button>
                </div>
            </div>

            <!-- Bulb Unscrew Toggles -->
            <div class="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <span class="text-slate-400 font-bold">آزمایش باز کردن / سوختن لامپ‌ها:</span>
                <button id="cir-toggle-b1" class="px-3 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500 text-emerald-300 font-bold">
                    لامپ ۱: بسته (سالم)
                </button>
                <button id="cir-toggle-b2" class="px-3 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500 text-emerald-300 font-bold" style="display: none;">
                    لامپ ۲: بسته (سالم)
                </button>
                <span class="text-[11px] text-slate-400">
                    (در متوالی با باز شدن یک لامپ کل مدار قطع می‌شود؛ در موازی بقیه لامپ‌ها روشن می‌مانند!)
                </span>
            </div>

            <div id="sim-cir-fuse-notice" class="hidden">
                ⚠️ هشدار ایمنی: جریان بیش از حد مجاز (۶٫۵ آمپر) باعث قطع خودکار فیوز مدار شد! مقاومت را افزایش دهید یا ولتاژ را کم کنید.
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <!-- Sliders & Telemetry -->
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">ولتاژ منبع تغذیه (اختلاف پتانسیل V):</span>
                            <span id="sim-cir-v-val" class="text-blue-400 font-mono font-bold">12 V</span>
                        </div>
                        <input type="range" min="1.5" max="36" step="0.5" value="12" id="sim-cir-v-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">مقاومت لامپ ۱ (R₁):</span>
                            <span id="sim-cir-r1-val" class="text-indigo-400 font-mono font-bold">6 Ω</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value="6" id="sim-cir-r1-slider" class="physics-slider w-full" />
                    </div>

                    <div id="sim-cir-r2-container" class="hidden">
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">مقاومت لامپ ۲ (R₂):</span>
                            <span id="sim-cir-r2-val" class="text-purple-400 font-mono font-bold">6 Ω</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value="6" id="sim-cir-r2-slider" class="physics-slider w-full" />
                    </div>

                    <div class="grid grid-cols-3 gap-3 pt-2">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">مقاومت معادل (R_eq)</span>
                            <span id="sim-cir-req-val" class="text-sm font-black text-indigo-400 font-mono">6.00 Ω</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">شدت جریان (I = V/R)</span>
                            <span id="sim-cir-i-val" class="text-sm font-black text-cyan-400 font-mono">2.00 A</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">توان کل (P = V×I)</span>
                            <span id="sim-cir-p-val" class="text-sm font-black text-amber-400 font-mono">24.0 W</span>
                        </div>
                    </div>
                </div>

                <!-- Schematic Visualizer -->
                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <svg viewBox="0 0 280 200" class="w-full max-w-[280px] h-auto">
                        <!-- Outer Wire Frame -->
                        <rect x="40" y="30" width="200" height="140" fill="none" stroke="#60a5fa" stroke-width="4" rx="16" class="circuit-wire" />

                        <!-- Battery DC Source on left -->
                        <g transform="translate(30, 80)">
                            <rect x="0" y="0" width="20" height="40" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="4" />
                            <line x1="10" y1="8" x2="10" y2="20" stroke="#f87171" stroke-width="2" />
                            <line x1="4" y1="14" x2="16" y2="14" stroke="#f87171" stroke-width="2" />
                            <line x1="4" y1="30" x2="16" y2="30" stroke="#60a5fa" stroke-width="2" />
                            <text x="-8" y="24" fill="#93c5fd" font-size="9" font-weight="bold">باتری</text>
                        </g>

                        <!-- Bulb 1 on top wire -->
                        <g transform="translate(100, 20)">
                            <circle id="sim-cir-bulb1" cx="10" cy="10" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
                            <text x="5" y="14" fill="#0f172a" font-size="10" font-weight="bold">R₁</text>
                        </g>

                        <!-- Bulb 2 on top wire or parallel branch -->
                        <g id="sim-cir-bulb2-group" transform="translate(160, 20)" style="display: none;">
                            <circle id="sim-cir-bulb2" cx="10" cy="10" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
                            <text x="5" y="14" fill="#0f172a" font-size="10" font-weight="bold">R₂</text>
                        </g>

                        <!-- Parallel central divider wire -->
                        <line id="sim-cir-parallel-wire" x1="40" y1="100" x2="240" y2="100" stroke="#60a5fa" stroke-width="4" class="circuit-wire" style="display: none;" />

                        <!-- Ammeter on bottom wire -->
                        <g transform="translate(130, 160)">
                            <circle cx="10" cy="10" r="13" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
                            <text x="6" y="14" fill="#22d3ee" font-size="11" font-weight="bold">A</text>
                            <text x="26" y="14" fill="#94a3b8" font-size="8">آمپرمتر</text>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        `;

        const vSlider = document.getElementById('sim-cir-v-slider');
        const r1Slider = document.getElementById('sim-cir-r1-slider');
        const r2Slider = document.getElementById('sim-cir-r2-slider');
        const swBtn = document.getElementById('sim-cir-sw-btn');
        const fuseBtn = document.getElementById('sim-cir-fuse-reset');
        const b1Toggle = document.getElementById('cir-toggle-b1');
        const b2Toggle = document.getElementById('cir-toggle-b2');

        if (vSlider) vSlider.addEventListener('input', (e) => { voltage = parseFloat(e.target.value); update(); });
        if (r1Slider) r1Slider.addEventListener('input', (e) => { r1 = parseFloat(e.target.value); update(); });
        if (r2Slider) r2Slider.addEventListener('input', (e) => { r2 = parseFloat(e.target.value); update(); });

        if (b1Toggle) b1Toggle.addEventListener('click', () => {
            bulb1Screwed = !bulb1Screwed;
            b1Toggle.innerText = bulb1Screwed ? 'لامپ ۱: بسته (سالم)' : 'لامپ ۱: بازشده (قطع)';
            b1Toggle.className = bulb1Screwed
                ? 'px-3 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500 text-emerald-300 font-bold'
                : 'px-3 py-1 rounded-lg bg-rose-900/60 border border-rose-500 text-rose-300 font-bold';
            update();
        });

        if (b2Toggle) b2Toggle.addEventListener('click', () => {
            bulb2Screwed = !bulb2Screwed;
            b2Toggle.innerText = bulb2Screwed ? 'لامپ ۲: بسته (سالم)' : 'لامپ ۲: بازشده (قطع)';
            b2Toggle.className = bulb2Screwed
                ? 'px-3 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500 text-emerald-300 font-bold'
                : 'px-3 py-1 rounded-lg bg-rose-900/60 border border-rose-500 text-rose-300 font-bold';
            update();
        });

        if (swBtn) swBtn.addEventListener('click', () => {
            isSwitchOn = !isSwitchOn;
            swBtn.innerText = isSwitchOn ? 'کلید: وصل (روشن)' : 'کلید: قطع (خاموش)';
            swBtn.className = isSwitchOn 
                ? 'px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-emerald-600 text-white border border-emerald-400 shadow-md'
                : 'px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-rose-600 text-white border border-rose-400 shadow-md';
            update();
        });

        if (fuseBtn) fuseBtn.addEventListener('click', () => {
            isFuseBlown = false;
            update();
        });

        const setMode = (m, btnId) => {
            circuitMode = m;
            document.querySelectorAll('.cir-mode-btn').forEach(b => {
                b.className = 'cir-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'cir-mode-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold border border-indigo-400 transition-all';

            const r2Box = document.getElementById('sim-cir-r2-container');
            const b2Btn = document.getElementById('cir-toggle-b2');
            const bulb2G = document.getElementById('sim-cir-bulb2-group');
            const pWire = document.getElementById('sim-cir-parallel-wire');

            if (r2Box) r2Box.className = m === 'single' ? 'hidden' : 'block';
            if (b2Btn) b2Btn.style.display = m === 'single' ? 'none' : 'inline-block';
            if (bulb2G) {
                bulb2G.style.display = m === 'single' ? 'none' : 'block';
                if (m === 'series') {
                    bulb2G.setAttribute('transform', 'translate(170, 20)');
                } else if (m === 'parallel') {
                    bulb2G.setAttribute('transform', 'translate(130, 90)');
                }
            }
            if (pWire) pWire.style.display = m === 'parallel' ? 'block' : 'none';

            update();
        };

        document.getElementById('cir-mode-single')?.addEventListener('click', () => setMode('single', 'cir-mode-single'));
        document.getElementById('cir-mode-series')?.addEventListener('click', () => setMode('series', 'cir-mode-series'));
        document.getElementById('cir-mode-parallel')?.addEventListener('click', () => setMode('parallel', 'cir-mode-parallel'));

        update();
    }

    // =========================================================================
    // 6. ELECTROSTATICS & ELECTROSCOPE (پایه هشتم: الکتریسیته ساکن و الکتروسکوپ)
    // =========================================================================
    renderElectrostaticsSim(container) {
        let rodType = 'glass'; // 'glass' (+), 'plastic' (-)
        let interactionMode = 'approach'; // 'approach' (induction), 'touch' (contact)
        let chargeLevel = 60; // 0 to 100
        let electroscopeCharge = 0; // accumulated permanent charge
        let rodNearby = true;

        const update = () => {
            let effectiveCharge = 0;
            if (rodNearby) {
                if (interactionMode === 'approach') {
                    // Induction: leaves open temporarily
                    effectiveCharge = chargeLevel * 0.75;
                } else if (interactionMode === 'touch') {
                    // Contact: permanently transfers charge to electroscope
                    electroscopeCharge = Math.max(chargeLevel, electroscopeCharge);
                    effectiveCharge = electroscopeCharge;
                }
            } else {
                // Rod removed:
                // If induction: leaves completely collapse to 0!
                // If touched: leaves remain open with electroscopeCharge!
                effectiveCharge = electroscopeCharge;
            }

            const leafAngle = Math.min(65, (effectiveCharge / 100) * 65);
            const sign = rodType === 'glass' ? '+' : '−';

            this.currentLiveState = {
                labId: 'electrostatics',
                title: 'آزمایش الکتریسیته ساکن و الکتروسکوپ',
                params: {
                    'میله آزمایشی': rodType === 'glass' ? 'میله شیشه‌ای مالش با ابریشم (بار مثبت +)' : 'میله پلاستیکی مالش با پشم (بار منفی −)',
                    'روش تعامل': interactionMode === 'approach' ? 'نزدیک کردن (بار القایی)' : 'لمس کلاهک (انتقال بار تماسی)',
                    'موقعیت میله': rodNearby ? 'نزدیک کلاهک الکتروسکوپ' : 'دور شده از کلاهک',
                    'بار القایی/مستقر روی الکتروسکوپ': `${Math.round(effectiveCharge)} %`,
                    'زاویه انحراف تیغه‌های طلا': `${Math.round(leafAngle)} درجه`,
                    'قانون فیزیکی': interactionMode === 'approach' && !rodNearby ? 'در روش القا با دور شدن میله باردار، تیغه‌ها کاملاً بسته می‌شوند.' : 'در روش تماس مستقیم، الکتروسکوپ باردار مانده و تیغه‌ها باز می‌مانند.'
                }
            };

            const lLeft = document.getElementById('sim-es-leaf-left');
            const lRight = document.getElementById('sim-es-leaf-right');
            const angVal = document.getElementById('sim-es-ang-val');
            const chargeTxt = document.getElementById('sim-es-charge-txt');
            const rodGraphic = document.getElementById('sim-es-rod-graphic');

            if (angVal) angVal.innerText = `${Math.round(leafAngle)}°`;
            if (chargeTxt) chargeTxt.innerText = rodType === 'glass' ? 'بار مثبت (+)' : 'بار منفی (−)';

            if (lLeft && lRight) {
                lLeft.setAttribute('transform', `rotate(${-leafAngle / 2}, 140, 150)`);
                lRight.setAttribute('transform', `rotate(${leafAngle / 2}, 140, 150)`);
            }

            if (rodGraphic) {
                rodGraphic.style.transform = rodNearby ? 'translate(0px, 0px)' : 'translate(-90px, -20px)';
                rodGraphic.style.opacity = rodNearby ? '1' : '0.35';
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-violet-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-violet-400 animate-ping"></span>
                    <h4 class="font-black text-base text-violet-300">کارگاه الکتریسیته ساکن، القا و الکتروسکوپ طلایی</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-violet-950 text-violet-400 border border-violet-800 font-bold">پایه هشتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-violet-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-electrostatics" onclick="window.claimLabXp('electrostatics', 'الکتریسیته ساکن و الکتروسکوپ')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">نوع میله باردار:</label>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <button id="es-rod-glass" class="p-2.5 rounded-xl bg-violet-600 text-white font-bold border border-violet-400 transition-all text-center">
                                میله شیشه‌ای با ابریشم (بار +)
                            </button>
                            <button id="es-rod-plastic" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">
                                میله پلاستیکی با پشم (بار −)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">روش تعامل:</label>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <button id="es-act-approach" class="p-2.5 rounded-xl bg-indigo-600 text-white font-bold border border-indigo-400 transition-all text-center">
                                نزدیک کردن (بار القایی موقتی)
                            </button>
                            <button id="es-act-touch" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">
                                لمس کلاهک (تماس دائمی)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">موقعیت میله باردار:</label>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <button id="es-pos-near" class="p-2 rounded-xl bg-violet-600 text-white font-bold border border-violet-400">
                                نزدیک کلاهک
                            </button>
                            <button id="es-pos-far" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
                                دور کردن میله
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">شدت بار الکتریکی میله:</span>
                            <span id="sim-es-q-val" class="text-violet-400 font-mono font-bold">60%</span>
                        </div>
                        <input type="range" min="10" max="100" value="60" id="sim-es-q-slider" class="physics-slider w-full" />
                    </div>

                    <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <div>
                            <span class="text-xs text-slate-400 block">انحراف تیغه‌ها (θ):</span>
                            <span id="sim-es-ang-val" class="text-lg font-black text-amber-400 font-mono">39°</span>
                        </div>
                        <button id="es-ground-btn" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5">
                            <i data-lucide="shield" class="w-3.5 h-3.5 text-cyan-400"></i>
                            <span>تخلیه بار (اتصال به زمین)</span>
                        </button>
                    </div>
                </div>

                <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[280px]">
                    <svg viewBox="0 0 280 240" class="w-full max-w-[260px] h-auto">
                        <path d="M90 60 L190 60 L210 210 Q210 230 140 230 Q70 230 70 210 Z" fill="rgba(30, 41, 59, 0.4)" stroke="#64748b" stroke-width="2" />
                        <rect x="115" y="45" width="50" height="20" fill="#334155" rx="3" />
                        <line x1="140" y1="20" x2="140" y2="150" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" />
                        <circle cx="140" cy="20" r="18" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
                        <text x="135" y="24" fill="#78350f" font-size="12" font-weight="bold" id="sim-es-charge-sign">+</text>

                        <g id="sim-es-rod-graphic" transform="translate(40, 10)" style="transition: all 0.3s ease;">
                            <rect x="0" y="0" width="60" height="12" fill="#a855f7" rx="4" />
                            <text x="10" y="9" fill="#ffffff" font-size="8" font-weight="bold">میله باردار</text>
                        </g>

                        <line id="sim-es-leaf-left" x1="140" y1="150" x2="115" y2="200" stroke="#facc15" stroke-width="4" stroke-linecap="round" />
                        <line id="sim-es-leaf-right" x1="140" y1="150" x2="165" y2="200" stroke="#facc15" stroke-width="4" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
        </div>
        `;

        const qSlider = document.getElementById('sim-es-q-slider');
        if (qSlider) qSlider.addEventListener('input', (e) => {
            chargeLevel = parseFloat(e.target.value);
            document.getElementById('sim-es-q-val').innerText = `${chargeLevel}%`;
            update();
        });

        document.getElementById('es-rod-glass')?.addEventListener('click', () => {
            rodType = 'glass';
            document.getElementById('es-rod-glass').className = 'p-2.5 rounded-xl bg-violet-600 text-white font-bold border border-violet-400 transition-all text-center';
            document.getElementById('es-rod-plastic').className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center';
            document.getElementById('sim-es-charge-sign').innerText = '+';
            update();
        });

        document.getElementById('es-rod-plastic')?.addEventListener('click', () => {
            rodType = 'plastic';
            document.getElementById('es-rod-plastic').className = 'p-2.5 rounded-xl bg-violet-600 text-white font-bold border border-violet-400 transition-all text-center';
            document.getElementById('es-rod-glass').className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center';
            document.getElementById('sim-es-charge-sign').innerText = '−';
            update();
        });

        document.getElementById('es-act-approach')?.addEventListener('click', () => {
            interactionMode = 'approach';
            document.getElementById('es-act-approach').className = 'p-2.5 rounded-xl bg-indigo-600 text-white font-bold border border-indigo-400 transition-all text-center';
            document.getElementById('es-act-touch').className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center';
            update();
        });

        document.getElementById('es-act-touch')?.addEventListener('click', () => {
            interactionMode = 'touch';
            document.getElementById('es-act-touch').className = 'p-2.5 rounded-xl bg-indigo-600 text-white font-bold border border-indigo-400 transition-all text-center';
            document.getElementById('es-act-approach').className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center';
            update();
        });

        document.getElementById('es-pos-near')?.addEventListener('click', () => {
            rodNearby = true;
            document.getElementById('es-pos-near').className = 'p-2 rounded-xl bg-violet-600 text-white font-bold border border-violet-400';
            document.getElementById('es-pos-far').className = 'p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700';
            update();
        });

        document.getElementById('es-pos-far')?.addEventListener('click', () => {
            rodNearby = false;
            document.getElementById('es-pos-far').className = 'p-2 rounded-xl bg-violet-600 text-white font-bold border border-violet-400';
            document.getElementById('es-pos-near').className = 'p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700';
            update();
        });

        document.getElementById('es-ground-btn')?.addEventListener('click', () => {
            electroscopeCharge = 0;
            chargeLevel = 0;
            if (qSlider) qSlider.value = 0;
            document.getElementById('sim-es-q-val').innerText = '0%';
            update();
        });

        update();
    }

    // =========================================================================
    // 7. OPTICS, REFRACTION, PRISM & MIRRORS (پایه هشتم: شکست نور، منشور و آینه‌ها)
    // =========================================================================
    renderOpticsSim(container) {
        let theta1 = 45; // deg
        let n2 = 1.52; // glass
        let opticMode = 'refraction'; // 'refraction', 'prism', 'concave_mirror'
        let objDist = 90; // mm (for concave mirror)

        const update = () => {
            const rad1 = (theta1 * Math.PI) / 180;
            let theta2 = 0;
            let critAngle = Math.asin(1 / n2) * (180 / Math.PI);

            if (opticMode === 'refraction') {
                const sinTheta2 = Math.sin(rad1) / n2;
                theta2 = Math.asin(sinTheta2) * (180 / Math.PI);
            }

            this.currentLiveState = {
                labId: 'optics',
                title: 'آزمایش اپتیک، شکست نور، منشور و آینه‌های کروی',
                params: {
                    'حالت آزمایش نوری': opticMode === 'refraction' ? 'شکست نور در تیغه (قانون اسنل)' : (opticMode === 'prism' ? 'منشور مثلثی و پدیده پاشندگی ۷ رنگ' : 'آینه کروی مقعر (کاو) و ردیابی پرتوها'),
                    'زاویه تابش (θ₁)': `${theta1} درجه`,
                    'زاویه شکست اسنل (θ₂)': opticMode === 'refraction' ? `${theta2.toFixed(1)} درجه` : '-',
                    'ضریب شکست محیط (n₂)': n2,
                    'زاویه حد بازتاب کلی (θ_c)': `${critAngle.toFixed(1)} درجه`,
                    'فاصله شیء از آینه (p)': opticMode === 'concave_mirror' ? `${objDist} میلی‌متر` : '-'
                }
            };

            const t1Val = document.getElementById('sim-opt-t1-val');
            const t2Val = document.getElementById('sim-opt-t2-val');
            const ray1 = document.getElementById('sim-opt-ray1');
            const ray2 = document.getElementById('sim-opt-ray2');

            if (t1Val) t1Val.innerText = `${theta1}°`;
            if (t2Val) t2Val.innerText = `${theta2.toFixed(1)}°`;

            if (ray1 && ray2) {
                const x1 = 140 - Math.tan(rad1) * 70;
                ray1.setAttribute('x1', Math.max(20, x1));
                ray1.setAttribute('y1', 20);
                ray1.setAttribute('x2', 140);
                ray1.setAttribute('y2', 90);

                const rad2 = (theta2 * Math.PI) / 180;
                const x2 = 140 + Math.tan(rad2) * 70;
                ray2.setAttribute('x1', 140);
                ray2.setAttribute('y1', 90);
                ray2.setAttribute('x2', Math.min(260, x2));
                ray2.setAttribute('y2', 160);
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-purple-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-purple-400 animate-ping"></span>
                    <h4 class="font-black text-base text-purple-300">میز اپتیک، شکست نور، منشور پاشندگی و آینه مقعر</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 font-bold">پایه هشتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-purple-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-optics" onclick="window.claimLabXp('optics', 'شکست نور و منشور')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="flex flex-wrap gap-2 text-xs">
                <button id="opt-mode-refract" class="opt-mode-btn px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold border border-purple-400 transition-all">
                    ۱. شکست در تیغه شیشه‌ای (اسنل)
                </button>
                <button id="opt-mode-prism" class="opt-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all">
                    ۲. منشور مثلثی و پاشندگی ۷ رنگ
                </button>
                <button id="opt-mode-mirror" class="opt-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all">
                    ۳. آینه مقعر کروی و همگرایی کانون
                </button>
            </div>

            <!-- VIEW 1: SNELL'S LAW REFRACTION -->
            <div id="opt-view-snell" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">زاویه پرتو تابش نسبت به خط عمود (θ₁):</span>
                            <span id="sim-opt-t1-val" class="text-purple-400 font-mono font-bold">45°</span>
                        </div>
                        <input type="range" min="0" max="75" step="1" value="45" id="sim-opt-t1-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">محیط شفاف دوم (ضریب شکست n₂):</label>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="opt-glass" class="opt-mat-btn px-3 py-1 rounded-lg bg-purple-600 text-white font-bold border border-purple-400">شیشه معمولی (۱٫۵۲)</button>
                            <button id="opt-water" class="opt-mat-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">آب خالص (۱٫۳۳)</button>
                            <button id="opt-diamond" class="opt-mat-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">الماس بلورین (۲٫۴۲)</button>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-400">زاویه شکست نور (θ₂):</span>
                            <span id="sim-opt-t2-val" class="font-black text-cyan-400 font-mono text-sm">27.7°</span>
                        </div>
                        <p class="text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                            طبق قانون اسنل (n₁ sin θ₁ = n₂ sin θ₂)، نور هنگام ورود از محیط رقیق (هوا) به غلیظ، به خط عمود نزدیک می‌شود.
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <svg viewBox="0 0 280 180" class="w-full max-w-[260px] h-auto">
                        <rect x="20" y="20" width="240" height="70" fill="rgba(30, 41, 59, 0.4)" />
                        <text x="30" y="38" fill="#94a3b8" font-size="9" font-weight="bold">محیط ۱: هوا (n₁ = ۱٫۰۰)</text>

                        <rect x="20" y="90" width="240" height="70" fill="rgba(147, 51, 234, 0.2)" stroke="#9333ea" stroke-width="1.5" />
                        <text x="30" y="108" fill="#c084fc" font-size="9" font-weight="bold">محیط ۲ (شیشه / آب)</text>

                        <line x1="140" y1="20" x2="140" y2="160" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.5" />
                        <text x="145" y="32" fill="#64748b" font-size="8">خط عمود</text>

                        <line id="sim-opt-ray1" x1="80" y1="20" x2="140" y2="90" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" />
                        <line id="sim-opt-ray2" x1="140" y1="90" x2="180" y2="160" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
            </div>

            <!-- VIEW 2: PRISM DISPERSION -->
            <div id="opt-view-prism" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-6 space-y-3">
                    <h5 class="text-xs font-bold text-amber-300">پدیده پاشندگی نور سفید در منشور مثلثی (Dispersion)</h5>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        نور سفید خورشید یا چراغ مخلوطی از طول‌موج‌های مختلف است. ضریب شکست شیشه برای نور بنفش بیشتر از نور قرمز است (n_violet > n_red)، در نتیجه نور بنفش بیشترین انحراف و نور قرمز کمترین انحراف را پیدا کرده و طیف رنگین‌کمان پدیدار می‌شود.
                    </p>
                    <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                        <span class="font-bold text-cyan-300 block">ترتیب ۷ رنگ طیف مرئی از کمترین به بیشترین انحراف:</span>
                        <div class="flex flex-wrap gap-1 text-[10px] font-bold">
                            <span class="px-2 py-0.5 rounded bg-red-600 text-white">قرمز</span>
                            <span class="px-2 py-0.5 rounded bg-amber-600 text-white">نارنجی</span>
                            <span class="px-2 py-0.5 rounded bg-yellow-500 text-slate-900">زرد</span>
                            <span class="px-2 py-0.5 rounded bg-emerald-600 text-white">سبز</span>
                            <span class="px-2 py-0.5 rounded bg-cyan-600 text-white">آبی</span>
                            <span class="px-2 py-0.5 rounded bg-indigo-600 text-white">نیلی</span>
                            <span class="px-2 py-0.5 rounded bg-purple-700 text-white">بنفش</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-6 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <svg viewBox="0 0 300 200" class="w-full max-w-[300px] h-auto">
                        <!-- Glass Triangular Prism -->
                        <polygon points="120,40 60,160 180,160" fill="rgba(192, 132, 252, 0.25)" stroke="#c084fc" stroke-width="2" />
                        <text x="105" y="145" fill="#e9d5ff" font-size="10" font-weight="bold">منشور</text>

                        <!-- White Incoming Ray -->
                        <line x1="20" y1="120" x2="85" y2="110" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
                        <text x="15" y="105" fill="#ffffff" font-size="9" font-weight="bold">نور سفید</text>

                        <!-- Dispersed Spectral Rays exiting right -->
                        <line x1="150" y1="120" x2="280" y2="80" stroke="#ef4444" stroke-width="2.5" />
                        <line x1="150" y1="122" x2="280" y2="95" stroke="#f97316" stroke-width="2.5" />
                        <line x1="150" y1="124" x2="280" y2="110" stroke="#eab308" stroke-width="2.5" />
                        <line x1="150" y1="126" x2="280" y2="125" stroke="#22c55e" stroke-width="2.5" />
                        <line x1="150" y1="128" x2="280" y2="140" stroke="#06b6d4" stroke-width="2.5" />
                        <line x1="150" y1="130" x2="280" y2="155" stroke="#3b82f6" stroke-width="2.5" />
                        <line x1="150" y1="132" x2="280" y2="170" stroke="#a855f7" stroke-width="2.5" />
                    </svg>
                </div>
            </div>

            <!-- VIEW 3: CONCAVE MIRROR -->
            <div id="opt-view-mirror" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-6 space-y-3">
                    <h5 class="text-xs font-bold text-cyan-300">آینه کروی مقعر (کاو) و کانون همگراکننده</h5>
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">فاصله شیء از آینه (p):</span>
                            <span id="sim-opt-p-val" class="text-cyan-400 font-mono font-bold">90 mm</span>
                        </div>
                        <input type="range" min="30" max="180" step="5" value="90" id="sim-opt-p-slider" class="physics-slider w-full" />
                    </div>
                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                        <div class="flex justify-between">
                            <span class="text-slate-400">فاصله کانونی (f):</span>
                            <span class="font-bold text-amber-400 font-mono">50 mm (کانون اصلی F)</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">مرکز انحنا (C = 2f):</span>
                            <span class="font-bold text-indigo-400 font-mono">100 mm</span>
                        </div>
                        <p id="sim-opt-img-desc" class="text-[11px] text-emerald-400 pt-1 border-t border-slate-800">
                            شیء بین F و C: تصویر حقیقی، وارونه و بزرگتر در فاصله‌ای دورتر از C تشکیل می‌شود.
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-6 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <svg viewBox="0 0 280 180" class="w-full max-w-[280px] h-auto">
                        <!-- Principal Axis -->
                        <line x1="20" y1="90" x2="260" y2="90" stroke="#64748b" stroke-dasharray="3 3" stroke-width="1.5" />

                        <!-- Concave Mirror Arc on right -->
                        <path d="M 240 20 Q 220 90 240 160" fill="none" stroke="#38bdf8" stroke-width="4" />
                        <text x="245" y="95" fill="#38bdf8" font-size="9" font-weight="bold">آینه</text>

                        <!-- Points: F and C -->
                        <circle cx="170" cy="90" r="3" fill="#fbbf24" />
                        <text x="166" y="105" fill="#fbbf24" font-size="9" font-weight="bold">F</text>

                        <circle cx="100" cy="90" r="3" fill="#818cf8" />
                        <text x="96" y="105" fill="#818cf8" font-size="9" font-weight="bold">C</text>

                        <!-- Object Arrow -->
                        <g id="sim-opt-arrow" transform="translate(130, 50)">
                            <line x1="0" y1="40" x2="0" y2="0" stroke="#10b981" stroke-width="3" />
                            <polygon points="0,-4 -4,6 4,6" fill="#10b981" />
                            <text x="-8" y="-8" fill="#34d399" font-size="8">شیء</text>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        `;

        const tSlider = document.getElementById('sim-opt-t1-slider');
        if (tSlider) tSlider.addEventListener('input', (e) => { theta1 = parseFloat(e.target.value); update(); });

        const pSlider = document.getElementById('sim-opt-p-slider');
        if (pSlider) pSlider.addEventListener('input', (e) => {
            objDist = parseFloat(e.target.value);
            document.getElementById('sim-opt-p-val').innerText = `${objDist} mm`;
            const arrow = document.getElementById('sim-opt-arrow');
            if (arrow) {
                const xPos = 240 - objDist * 1.3;
                arrow.setAttribute('transform', `translate(${Math.max(30, xPos)}, 50)`);
            }
            const desc = document.getElementById('sim-opt-img-desc');
            if (desc) {
                if (objDist > 100) desc.innerText = 'شیء فراتر از مرکز انحنا C: تصویر حقیقی، وارونه و کوچکتر بین F و C تشکیل می‌شود.';
                else if (objDist === 100) desc.innerText = 'شیء دقیقاً در مرکز انحنا C: تصویر حقیقی، وارونه و دقیقاً هم‌اندازه شیء در مرکز تشکیل می‌شود.';
                else if (objDist > 50) desc.innerText = 'شیء بین کانون F و مرکز C: تصویر حقیقی، وارونه و بزرگتر در فاصله‌ای دورتر از C تشکیل می‌شود.';
                else if (objDist === 50) desc.innerText = 'شیء در کانون اصلی F: پرتوهای بازتابی موازی شده و تصویر در بی‌نهایت است.';
                else desc.innerText = 'شیء بین کانون F و آینه: تصویر مجازی، مستقیم و بزرگتر در پشت آینه تشکیل می‌شود.';
            }
        });

        const setMat = (n, btnId) => {
            n2 = n;
            document.querySelectorAll('.opt-mat-btn').forEach(b => {
                b.className = 'opt-mat-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'opt-mat-btn px-3 py-1 rounded-lg bg-purple-600 text-white font-bold border border-purple-400';
            update();
        };

        document.getElementById('opt-glass')?.addEventListener('click', () => setMat(1.52, 'opt-glass'));
        document.getElementById('opt-water')?.addEventListener('click', () => setMat(1.33, 'opt-water'));
        document.getElementById('opt-diamond')?.addEventListener('click', () => setMat(2.42, 'opt-diamond'));

        const setOptMode = (m, btnId) => {
            opticMode = m;
            document.querySelectorAll('.opt-mode-btn').forEach(b => {
                b.className = 'opt-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'opt-mode-btn px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold border border-purple-400 transition-all';

            document.getElementById('opt-view-snell').className = m === 'refraction' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-center' : 'hidden';
            document.getElementById('opt-view-prism').className = m === 'prism' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-center' : 'hidden';
            document.getElementById('opt-view-mirror').className = m === 'concave_mirror' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-center' : 'hidden';

            update();
        };

        document.getElementById('opt-mode-refract')?.addEventListener('click', () => setOptMode('refraction', 'opt-mode-refract'));
        document.getElementById('opt-mode-prism')?.addEventListener('click', () => setOptMode('prism', 'opt-mode-prism'));
        document.getElementById('opt-mode-mirror')?.addEventListener('click', () => setOptMode('concave_mirror', 'opt-mode-mirror'));

        update();
    }

    // =========================================================================
    // 8. MAGNETISM & FIELD LINES (پایه هشتم: مغناطیس و قطب‌نما)
    // =========================================================================
    renderMagnetismSim(container) {
        let magType = 'bar'; // 'bar' or 'solenoid'
        let currentAmp = 3; // A
        let turnsN = 100; // turns
        let hasIronCore = true;

        const update = () => {
            // Solenoid magnetic field B = mu * (N/L) * I
            const muRelative = hasIronCore ? 1200 : 1;
            const bFieldTesla = (4 * Math.PI * 1e-7 * muRelative * (turnsN / 0.1) * currentAmp) * 1000; // in mT

            this.currentLiveState = {
                labId: 'magnetism',
                title: 'آزمایش مغناطیس، خطوط میدان و آهنربای الکتریکی',
                params: {
                    'نوع مغناطیس': magType === 'bar' ? 'آهنربای میله‌ای دائمی' : 'سیملوله الکترومغناطیسی با هسته',
                    'شدت جریان (I)': `${currentAmp} آمپر`,
                    'تعداد دور سیم‌پیچ (N)': `${turnsN} دور`,
                    'جنس هسته': hasIronCore ? 'هسته آهنی فرومغناطیس (تقویت ۱۲۰۰ برابری)' : 'هسته هوا',
                    'میدان مغناطیسی تقریبی': `${bFieldTesla.toFixed(1)} میلی‌تسلا (mT)`
                }
            };

            const iVal = document.getElementById('sim-mag-i-val');
            const nVal = document.getElementById('sim-mag-n-val');
            const bVal = document.getElementById('sim-mag-b-val');

            if (iVal) iVal.innerText = `${currentAmp} A`;
            if (nVal) nVal.innerText = `${turnsN} دور`;
            if (bVal) bVal.innerText = `${bFieldTesla.toFixed(1)} mT`;
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-red-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-red-400 animate-ping"></span>
                    <h4 class="font-black text-base text-red-300">کارگاه مغناطیس، خطوط میدان و سیملوله الکترومغناطیسی</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-bold">پایه هشتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-red-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-magnetism" onclick="window.claimLabXp('magnetism', 'مغناطیس و سیملوله')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">شدت جریان الکتریکی سیملوله (I):</span>
                            <span id="sim-mag-i-val" class="text-red-400 font-mono font-bold">3 A</span>
                        </div>
                        <input type="range" min="0.5" max="8" step="0.5" value="3" id="sim-mag-i-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">تعداد دورهای سیم‌پیچ (N):</span>
                            <span id="sim-mag-n-val" class="text-indigo-400 font-mono font-bold">100 دور</span>
                        </div>
                        <input type="range" min="20" max="300" step="20" value="100" id="sim-mag-n-slider" class="physics-slider w-full" />
                    </div>

                    <div class="flex items-center gap-3 pt-1">
                        <button id="sim-mag-core-btn" class="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs border border-emerald-400">
                            هسته آهنی: فعال (تقویت میدان)
                        </button>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                        <span class="text-xs text-slate-400 block mb-0.5">شدت میدان مغناطیسی در مرکز سیملوله (B):</span>
                        <span id="sim-mag-b-val" class="text-base font-black text-amber-400 font-mono">45.2 mT</span>
                    </div>
                </div>

                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <svg viewBox="0 0 280 180" class="w-full max-w-[280px] h-auto">
                        <!-- Magnetic Field Line Loops -->
                        <path d="M 60 70 C 20 20, 260 20, 220 70" fill="none" stroke="#ef4444" stroke-dasharray="3 3" stroke-width="1.5" />
                        <path d="M 60 110 C 20 160, 260 160, 220 110" fill="none" stroke="#ef4444" stroke-dasharray="3 3" stroke-width="1.5" />

                        <!-- Solenoid / Bar Magnet Body -->
                        <g transform="translate(60, 70)">
                            <!-- North Pole (Red) -->
                            <rect x="0" y="0" width="80" height="40" fill="#dc2626" rx="4" />
                            <text x="35" y="25" fill="#ffffff" font-size="14" font-weight="bold">N</text>

                            <!-- South Pole (Blue) -->
                            <rect x="80" y="0" width="80" height="40" fill="#2563eb" rx="4" />
                            <text x="115" y="25" fill="#ffffff" font-size="14" font-weight="bold">S</text>
                        </g>

                        <!-- Compass Needle -->
                        <g transform="translate(140, 150)">
                            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
                            <polygon points="0,-12 4,0 0,-4 -4,0" fill="#ef4444" />
                            <polygon points="0,12 4,0 0,4 -4,0" fill="#3b82f6" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        `;

        const iSlider = document.getElementById('sim-mag-i-slider');
        const nSlider = document.getElementById('sim-mag-n-slider');
        const coreBtn = document.getElementById('sim-mag-core-btn');

        if (iSlider) iSlider.addEventListener('input', (e) => { currentAmp = parseFloat(e.target.value); update(); });
        if (nSlider) nSlider.addEventListener('input', (e) => { turnsN = parseFloat(e.target.value); update(); });

        if (coreBtn) coreBtn.addEventListener('click', () => {
            hasIronCore = !hasIronCore;
            coreBtn.innerText = hasIronCore ? 'هسته آهنی: فعال (تقویت میدان)' : 'هسته آهنی: غیرفعال (هسته هوا)';
            coreBtn.className = hasIronCore
                ? 'px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs border border-emerald-400'
                : 'px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700';
            update();
        });

        update();
    }


    // =========================================================================
    // 9. NEWTON'S 2ND LAW & AIR TRACK (پایه نهم: قوانین نیوتون، شتاب و اصطکاک)
    // =========================================================================
    renderNewtonSim(container) {
        let force = 60; // N
        let mass = 10; // kg
        let muS = 0.25; // static friction coeff
        let muK = 0.18; // kinetic friction coeff
        let isRunning = false;
        let speed = 0; // m/s
        let pos = 0; // meters along track
        let simInterval = null;

        const update = () => {
            const normalForce = mass * 9.8;
            const maxStaticFriction = muS * normalForce;
            const kineticFriction = muK * normalForce;

            let actualFriction = 0;
            let fNet = 0;
            let accel = 0;
            let motionState = '';
            let statusColor = '';

            if (speed === 0) {
                // Cart is currently at rest
                if (force <= maxStaticFriction) {
                    actualFriction = force; // Static friction balances applied force
                    fNet = 0;
                    accel = 0;
                    motionState = `ساکن (نیروی پیشران ${force}N ≤ اصطکاک ایستایی حداکثر ${maxStaticFriction.toFixed(1)}N)`;
                    statusColor = 'text-amber-400';
                } else {
                    actualFriction = kineticFriction;
                    fNet = force - kineticFriction;
                    accel = fNet / mass;
                    motionState = `شروع شتاب‌گیری (شکستن آستانه اصطکاک ایستایی)`;
                    statusColor = 'text-emerald-400';
                }
            } else {
                // Cart is in motion
                actualFriction = kineticFriction;
                fNet = force - kineticFriction;
                accel = fNet / mass;
                if (force === 0) {
                    motionState = `حرکت کُندشونده تحت اصطکاک جنبشی (a = -${accel.toFixed(2)} m/s²)`;
                    statusColor = 'text-rose-400';
                } else {
                    motionState = `حرکت شتاب‌دار روی ریل (شتاب = ${accel.toFixed(2)} m/s²)`;
                    statusColor = 'text-emerald-400';
                }
            }

            this.currentLiveState = {
                labId: 'newton',
                title: 'آزمایش قانون دوم نیوتون، اصطکاک و ریل هوا',
                params: {
                    'نیروی پیشران (F)': `${force} نیوتون`,
                    'جرم ارابه (m)': `${mass} کیلوگرم`,
                    'ضریب اصطکاک ایستایی (μ_s)': muS,
                    'ضریب اصطکاک جنبشی (μ_k)': muK,
                    'اصطکاک ایستایی حداکثر (f_s,max)': `${maxStaticFriction.toFixed(1)} نیوتون`,
                    'اصطکاک جنبشی (f_k)': `${kineticFriction.toFixed(1)} نیوتون`,
                    'نیروی اصطکاک لحظه‌ای': `${actualFriction.toFixed(1)} نیوتون`,
                    'نیروی خالص پیشران (F_net)': `${fNet.toFixed(1)} نیوتون`,
                    'شتاب محاسبه‌شده (a = F_net/m)': `${accel.toFixed(2)} m/s²`,
                    'تندی لحظه‌ای (v)': `${speed.toFixed(2)} m/s`,
                    'مسافت طی‌شده (x)': `${pos.toFixed(1)} متر`,
                    'وضعیت دینامیکی': motionState
                }
            };

            const fVal = document.getElementById('sim-newt-f-val');
            const mVal = document.getElementById('sim-newt-m-val');
            const fNetVal = document.getElementById('sim-newt-fnet-val');
            const aVal = document.getElementById('sim-newt-a-val');
            const vVal = document.getElementById('sim-newt-v-val');
            const statusEl = document.getElementById('sim-newt-status');
            const cartEl = document.getElementById('sim-newt-cart');

            if (fVal) fVal.innerText = `${force} N`;
            if (mVal) mVal.innerText = `${mass} kg`;
            if (fNetVal) fNetVal.innerText = `${fNet.toFixed(1)} N (اصطکاک: ${actualFriction.toFixed(1)} N)`;
            if (aVal) aVal.innerText = `${accel.toFixed(2)} m/s²`;
            if (vVal) vVal.innerText = `${speed.toFixed(1)} m/s`;
            if (statusEl) {
                statusEl.innerText = motionState;
                statusEl.className = `font-bold text-xs ${statusColor}`;
            }

            if (cartEl) {
                const trackWidthPercent = (pos / 40) * 80;
                cartEl.style.right = `${10 + Math.min(78, trackWidthPercent)}%`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-6 shadow-2xl">
            <!-- Header Bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <h4 class="font-black text-base text-emerald-300">کارگاه قوانین نیوتون، شتاب و ریل هوا (F_net = m × a)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">پایه نهم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-emerald-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-newton" onclick="window.claimLabXp('newton', 'قانون دوم نیوتون و شتاب')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <!-- Controls -->
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">جنس سطح ریل آزمایشگاهی:</label>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="fric-air" class="fric-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">ریل هوا (μ_s = ۰٫۰)</button>
                            <button id="fric-wood" class="fric-btn px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold border border-emerald-400">چوب صیقلی (μ_s = ۰٫۲۵)</button>
                            <button id="fric-rubber" class="fric-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">آسفالت زبر (μ_s = ۰٫۶۰)</button>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">نیروی اعمالی پیشران (F):</span>
                            <span id="sim-newt-f-val" class="text-emerald-400 font-mono font-bold">60 N</span>
                        </div>
                        <input type="range" min="0" max="150" step="5" value="60" id="sim-newt-f-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">جرم ارابه متحرک (m):</span>
                            <span id="sim-newt-m-val" class="text-blue-400 font-mono font-bold">10 kg</span>
                        </div>
                        <input type="range" min="1" max="30" step="1" value="10" id="sim-newt-m-slider" class="physics-slider w-full" />
                    </div>

                    <div class="grid grid-cols-3 gap-3 pt-1">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">نیروی خالص (F_net)</span>
                            <span id="sim-newt-fnet-val" class="text-xs font-black text-amber-400 font-mono">42.4 N</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">شتاب (a = F/m)</span>
                            <span id="sim-newt-a-val" class="text-sm font-black text-emerald-400 font-mono">4.24 m/s²</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">تندی زنده</span>
                            <span id="sim-newt-v-val" class="text-sm font-black text-cyan-400 font-mono">0.0 m/s</span>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <span id="sim-newt-status" class="font-bold text-xs text-emerald-400">در آستانه حرکت</span>
                    </div>

                    <!-- Movement Animation Buttons -->
                    <div class="flex items-center gap-2 pt-1">
                        <button id="sim-newt-start-btn" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
                            <i data-lucide="play" class="w-3.5 h-3.5"></i>
                            <span>شروع حرکت تعاملی</span>
                        </button>
                        <button id="sim-newt-reset-btn" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5">
                            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                            <span>بازنشانی</span>
                        </button>
                    </div>
                </div>

                <!-- Air Track Animation Canvas -->
                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[260px] flex flex-col justify-end">
                    <div class="relative w-full h-36 flex flex-col justify-end pb-4">
                        <div class="w-full h-2 bg-slate-600 rounded-full relative">
                            <div class="absolute inset-x-0 -bottom-4 flex justify-between text-[8px] text-slate-500 font-mono">
                                <span>۰m</span>
                                <span>۱۰m</span>
                                <span>۲۰m</span>
                                <span>۳۰m</span>
                                <span>۴۰m</span>
                            </div>

                            <div id="sim-newt-cart" class="absolute bottom-2 right-[10%] flex flex-col items-center transition-all duration-75">
                                <div class="px-2 py-0.5 rounded bg-emerald-500 text-[9px] font-black text-slate-900 mb-1">
                                    F = ${force}N
                                </div>
                                <div class="w-16 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                    m
                                </div>
                                <div class="flex justify-between w-12 -mt-1.5">
                                    <div class="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-900"></div>
                                    <div class="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="text-[11px] text-slate-400 font-bold text-center mt-2">ریل هوای آزمایشگاهی فیزیک نهم</span>
                </div>
            </div>
        </div>
        `;

        const fSlider = document.getElementById('sim-newt-f-slider');
        const mSlider = document.getElementById('sim-newt-m-slider');
        if (fSlider) fSlider.addEventListener('input', (e) => { force = parseFloat(e.target.value); update(); });
        if (mSlider) mSlider.addEventListener('input', (e) => { mass = parseFloat(e.target.value); update(); });

        const setFric = (valS, valK, btnId) => {
            muS = valS;
            muK = valK;
            document.querySelectorAll('.fric-btn').forEach(b => {
                b.className = 'fric-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'fric-btn px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold border border-emerald-400';
            update();
        };

        document.getElementById('fric-air')?.addEventListener('click', () => setFric(0.0, 0.0, 'fric-air'));
        document.getElementById('fric-wood')?.addEventListener('click', () => setFric(0.25, 0.18, 'fric-wood'));
        document.getElementById('fric-rubber')?.addEventListener('click', () => setFric(0.60, 0.45, 'fric-rubber'));

        const startBtn = document.getElementById('sim-newt-start-btn');
        const resetBtn = document.getElementById('sim-newt-reset-btn');

        if (startBtn) startBtn.addEventListener('click', () => {
            if (isRunning) {
                clearInterval(simInterval);
                isRunning = false;
                startBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>ادامه حرکت</span>`;
            } else {
                isRunning = true;
                startBtn.innerHTML = `<i data-lucide="pause" class="w-3.5 h-3.5"></i><span>توقف موقت</span>`;
                simInterval = setInterval(() => {
                    const normal = mass * 9.8;
                    const maxS = muS * normal;
                    const fK = muK * normal;

                    if (speed === 0 && force <= maxS) {
                        // Remains still
                    } else {
                        const net = Math.max(-mass * 9.8 * muK, force - fK);
                        const a = net / mass;
                        speed = Math.max(0, speed + a * 0.06);
                        pos = Math.min(38, pos + speed * 0.06);
                        if (pos >= 38 || (speed === 0 && force === 0)) {
                            clearInterval(simInterval);
                            isRunning = false;
                            startBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>حرکت مجدد</span>`;
                        }
                    }
                    update();
                }, 60);
            }
            if (window.lucide) window.lucide.createIcons();
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (simInterval) clearInterval(simInterval);
            isRunning = false;
            speed = 0;
            pos = 0;
            if (startBtn) startBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>شروع حرکت تعاملی</span>`;
            update();
            if (window.lucide) window.lucide.createIcons();
        });

        update();
    }

    // =========================================================================
    // 10. HOOKE'S LAW & SPRINGS (پایه نهم: قانون هوک و فنر کشسانی)
    // =========================================================================
    renderHookeSim(container) {
        let k = 40; // N/m spring constant
        let hangingMass = 200; // grams

        const update = () => {
            const forceN = (hangingMass / 1000) * 9.8; // F = mg
            const deltaXCm = (forceN / k) * 100; // cm
            const deltaXM = deltaXCm / 100;
            const uElastic = 0.5 * k * Math.pow(deltaXM, 2);

            this.currentLiveState = {
                labId: 'hooke',
                title: 'آزمایش قانون هوک و فنر کشسانی',
                params: {
                    'ثابت سختی فنر (k)': `${k} N/m`,
                    'جرم آویزان‌شده (m)': `${hangingMass} گرم`,
                    'نیروی کشسانی (F = kΔx)': `${forceN.toFixed(2)} نیوتون`,
                    'تغییر طول فنر (Δx)': `${deltaXCm.toFixed(1)} سانتی‌متر`,
                    'انرژی ذخیره‌شده (U_e = ½kΔx²)': `${uElastic.toFixed(3)} ژول`
                }
            };

            const kVal = document.getElementById('sim-hk-k-val');
            const mVal = document.getElementById('sim-hk-m-val');
            const dxVal = document.getElementById('sim-hk-dx-val');
            const fVal = document.getElementById('sim-hk-f-val');
            const springEl = document.getElementById('sim-hk-spring-svg');

            if (kVal) kVal.innerText = `${k} N/m`;
            if (mVal) mVal.innerText = `${hangingMass} g`;
            if (dxVal) dxVal.innerText = `${deltaXCm.toFixed(1)} cm`;
            if (fVal) fVal.innerText = `${forceN.toFixed(2)} N`;

            if (springEl) {
                const heightPx = Math.min(180, 70 + deltaXCm * 3.5);
                springEl.style.height = `${heightPx}px`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-teal-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-teal-400 animate-ping"></span>
                    <h4 class="font-black text-base text-teal-300">کارگاه قانون هوک و نیروسنج فنری (F = k × Δx)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 font-bold">پایه نهم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-teal-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-hooke" onclick="window.claimLabXp('hooke', 'قانون هوک و فنرها')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">ثابت سختی فنر (k):</span>
                            <span id="sim-hk-k-val" class="text-teal-400 font-mono font-bold">40 N/m</span>
                        </div>
                        <input type="range" min="10" max="100" step="5" value="40" id="sim-hk-k-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">جرم وزنه آویزان‌شده (m):</span>
                            <span id="sim-hk-m-val" class="text-blue-400 font-mono font-bold">200 g</span>
                        </div>
                        <input type="range" min="50" max="800" step="50" value="200" id="sim-hk-m-slider" class="physics-slider w-full" />
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[11px] text-slate-400 block mb-0.5">تغییر طول فنر (Δx = F/k)</span>
                            <span id="sim-hk-dx-val" class="text-base font-black text-amber-400 font-mono">4.9 cm</span>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[11px] text-slate-400 block mb-0.5">نیروی کشسانی فنر (F)</span>
                            <span id="sim-hk-f-val" class="text-base font-black text-emerald-400 font-mono">1.96 N</span>
                        </div>
                    </div>
                </div>

                <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[280px]">
                    <div class="flex items-start gap-6">
                        <div class="w-8 h-64 rounded bg-slate-800 border border-slate-700 flex flex-col justify-between py-2 px-1 text-[8px] text-slate-400 font-mono select-none">
                            <span>- 0 cm</span>
                            <span>- 5 cm</span>
                            <span>- 10 cm</span>
                            <span>- 15 cm</span>
                            <span>- 20 cm</span>
                            <span>- 25 cm</span>
                        </div>

                        <div class="flex flex-col items-center">
                            <div class="w-24 h-3 bg-slate-500 rounded-full shadow"></div>
                            <div id="sim-hk-spring-svg" class="w-8 flex flex-col items-center transition-all duration-150" style="height: 100px;">
                                <svg viewBox="0 0 30 120" preserveAspectRatio="none" class="w-full h-full">
                                    <path d="M 15 0 L 15 10 L 5 15 L 25 25 L 5 35 L 25 45 L 5 55 L 25 65 L 5 75 L 25 85 L 5 95 L 25 105 L 15 110 L 15 120" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" />
                                </svg>
                            </div>
                            <div class="w-12 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300 shadow-xl flex items-center justify-center text-[10px] font-black text-slate-900">
                                ⚖️
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const kSlider = document.getElementById('sim-hk-k-slider');
        const mSlider = document.getElementById('sim-hk-m-slider');
        if (kSlider) kSlider.addEventListener('input', (e) => { k = parseFloat(e.target.value); update(); });
        if (mSlider) mSlider.addEventListener('input', (e) => { hangingMass = parseFloat(e.target.value); update(); });

        update();
    }

    // =========================================================================
    // 11. FLUID PRESSURE & PASCAL'S LIFT (پایه نهم: فشار در شاره‌ها و بالابر پاسکال)
    // =========================================================================
    renderPressureSim(container) {
        let appMode = 'tank'; // 'tank', 'utube', 'pascal'
        let depth = 4; // meters
        let density = 1000; // kg/m3 (water)
        let f1 = 50; // N
        let a1 = 10; // cm2
        let a2 = 100; // cm2

        const update = () => {
            const g = 9.8;
            const pGauge = Math.round(density * g * depth);
            const pTotal = pGauge + 100000;
            const f2 = Math.round(f1 * (a2 / a1));

            this.currentLiveState = {
                labId: 'pressure',
                title: 'آزمایش فشار در شاره‌ها و بالابر پاسکال',
                params: {
                    'حالت آزمایشگاه': appMode === 'tank' ? 'مخزن فشار عمقی هیدرواستاتیک' : (appMode === 'utube' ? 'لوله U شکل دو مایعی (ρ₁h₁ = ρ₂h₂)' : 'بالابر هیدرولیکی پاسکال'),
                    'عمق در مایع (h)': `${depth} متر`,
                    'چگالی مایع (ρ)': `${density} kg/m³`,
                    'فشار ناشی از مایع (P = ρgh)': `${(pGauge / 1000).toFixed(1)} kPa`,
                    'فشار کل با هوا (P_0 + ρgh)': `${(pTotal / 1000).toFixed(1)} kPa`,
                    'بالابر پاسکال': `نیروی F₁=${f1}N با مساحت‌های A₁=${a1}cm² و A₂=${a2}cm² نیروی F₂=${f2}N ایجاد می‌کند.`
                }
            };

            const hVal = document.getElementById('sim-pr-h-val');
            const pVal = document.getElementById('sim-pr-p-val');
            const ptotVal = document.getElementById('sim-pr-ptot-val');
            const f2Val = document.getElementById('sim-pr-f2-val');
            const probe = document.getElementById('sim-pr-probe');

            if (hVal) hVal.innerText = `${depth} متر`;
            if (pVal) pVal.innerText = `${(pGauge / 1000).toFixed(1)} kPa (${pGauge} Pa)`;
            if (ptotVal) ptotVal.innerText = `${(pTotal / 1000).toFixed(1)} kPa`;
            if (f2Val) f2Val.innerText = `${f2} N (تکثیر نیرو: ${a2 / a1} برابر)`;

            if (probe) {
                probe.style.top = `${15 + (depth / 10) * 70}%`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-blue-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-blue-400 animate-ping"></span>
                    <h4 class="font-black text-base text-blue-300">کارگاه فشار درون شاره‌ها (P = ρgh) و بالابر پاسکال</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 font-bold">پایه نهم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-blue-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-pressure" onclick="window.claimLabXp('pressure', 'فشار شاره‌ها و پاسکال')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">عمق غوطه‌وری حسگر فشارسنج (h):</span>
                            <span id="sim-pr-h-val" class="text-blue-400 font-mono font-bold">4 متر</span>
                        </div>
                        <input type="range" min="0" max="10" step="0.5" value="4" id="sim-pr-h-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1.5">انتخاب مایع مخزن:</label>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="pr-fluid-water" class="pr-f-btn px-3 py-1 rounded-lg bg-blue-600 text-white font-bold border border-blue-400">آب خالص (۱۰۰۰)</button>
                            <button id="pr-fluid-oil" class="pr-f-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">روغن (۸۰۰)</button>
                            <button id="pr-fluid-mercury" class="pr-f-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">جیوه (۱۳۶۰۰)</button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-1">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">فشار ناشی از مایع (P = ρgh):</span>
                            <span id="sim-pr-p-val" class="text-sm font-black text-cyan-400 font-mono">39.2 kPa</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">فشار کل با جو (P_0 + ρgh):</span>
                            <span id="sim-pr-ptot-val" class="text-sm font-black text-amber-400 font-mono">139.2 kPa</span>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <span class="text-xs font-bold text-cyan-300 block">بالابر هیدرولیکی پاسکال (F₁/A₁ = F₂/A₂):</span>
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-slate-400">نیروی اعمالی پیستون کوچک (F₁ = 50N):</span>
                            <span id="sim-pr-f2-val" class="text-emerald-400 font-bold font-mono">500 N</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <div class="relative h-60 w-full max-w-[220px] rounded-b-3xl border-4 border-t-0 border-slate-600 bg-gradient-to-b from-cyan-900/20 via-blue-900/40 to-blue-950 overflow-hidden shadow-2xl">
                        <div class="absolute inset-0 bg-blue-500/25"></div>
                        <div id="sim-pr-probe" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-200" style="top: 40%;">
                            <div class="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-xs font-black text-slate-900">
                                P
                            </div>
                            <span class="text-[10px] text-amber-300 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-800">حسگر</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const hSlider = document.getElementById('sim-pr-h-slider');
        if (hSlider) hSlider.addEventListener('input', (e) => { depth = parseFloat(e.target.value); update(); });

        const setFluid = (dens, btnId) => {
            density = dens;
            document.querySelectorAll('.pr-f-btn').forEach(b => {
                b.className = 'pr-f-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'pr-f-btn px-3 py-1 rounded-lg bg-blue-600 text-white font-bold border border-blue-400';
            update();
        };

        document.getElementById('pr-fluid-water')?.addEventListener('click', () => setFluid(1000, 'pr-fluid-water'));
        document.getElementById('pr-fluid-oil')?.addEventListener('click', () => setFluid(800, 'pr-fluid-oil'));
        document.getElementById('pr-fluid-mercury')?.addEventListener('click', () => setFluid(13600, 'pr-fluid-mercury'));

        update();
    }

    // =========================================================================
    // 12. SOLID PRESSURE (پایه نهم: فشار در جامدات و سطح تماس)
    // =========================================================================
    renderSolidPressureSim(container) {
        let brickMass = 4; // kg
        let orientation = 'large'; // 'large' (20x10cm), 'medium' (20x5cm), 'small' (10x5cm)

        const update = () => {
            let areaCm2 = 200;
            if (orientation === 'large') areaCm2 = 200; // 0.02 m2
            else if (orientation === 'medium') areaCm2 = 100; // 0.01 m2
            else areaCm2 = 50; // 0.005 m2

            const areaM2 = areaCm2 / 10000;
            const forceN = brickMass * 9.8;
            const pressurePa = forceN / areaM2;

            this.currentLiveState = {
                labId: 'solid_pressure',
                title: 'آزمایش فشار در جامدات و سطح تماس در بستر ماسه',
                params: {
                    'جرم آجر (m)': `${brickMass} کیلوگرم`,
                    'نیروی عمودی وزن (F_N = mg)': `${forceN.toFixed(1)} نیوتون`,
                    'سطح تماس با ماسه (A)': `${areaCm2} سانتی‌متر مربع (${areaM2} m²)`,
                    'فشار وارد بر ماسه (P = F/A)': `${(pressurePa / 1000).toFixed(2)} kPa (${Math.round(pressurePa)} Pa)`,
                    'عمق فرورفتگی در ماسه': orientation === 'small' ? 'بیشترین فرورفتگی (سطح کوچک)' : (orientation === 'medium' ? 'فرورفتگی متوسط' : 'کمترین فرورفتگی (سطح بزرگ)')
                }
            };

            const pVal = document.getElementById('sim-sp-p-val');
            const aVal = document.getElementById('sim-sp-a-val');
            const sinkBox = document.getElementById('sim-sp-sink-box');

            if (pVal) pVal.innerText = `${(pressurePa / 1000).toFixed(2)} kPa`;
            if (aVal) aVal.innerText = `${areaCm2} cm²`;
            if (sinkBox) {
                const sinkPx = orientation === 'small' ? 36 : (orientation === 'medium' ? 22 : 10);
                sinkBox.style.transform = `translateY(${sinkPx}px)`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-amber-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                    <h4 class="font-black text-base text-amber-300">کارگاه فشار در جامدات و سطح تماس در ماسه (P = F / A)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold">پایه نهم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-solid-pressure" onclick="window.claimLabXp('solid_pressure', 'فشار در جامدات')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">جهت قرارگیری قالب روی ماسه:</label>
                        <div class="grid grid-cols-3 gap-2 text-xs">
                            <button id="sp-face-large" class="sp-face-btn p-2.5 rounded-xl bg-amber-600 text-white font-bold border border-amber-400 transition-all text-center">
                                وجه بزرگ (20×10)
                            </button>
                            <button id="sp-face-med" class="sp-face-btn p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all text-center">
                                وجه متوسط (20×5)
                            </button>
                            <button id="sp-face-small" class="sp-face-btn p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all text-center">
                                وجه کوچک (10×5)
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">سطح تماس (A):</span>
                            <span id="sim-sp-a-val" class="text-sm font-black text-cyan-400 font-mono">200 cm²</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">فشار وارده (P = F/A):</span>
                            <span id="sim-sp-p-val" class="text-base font-black text-amber-400 font-mono">1.96 kPa</span>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <p class="text-xs text-slate-300 leading-relaxed">
                            اصل علمی کتاب نهم: با کاهش سطح تماس، نیروی وزن روی مساحت کوچکتری متمرکز شده و فشار وارد بر بستر افزایش می‌یابد؛ در نتیجه فرورفتگی آجر در ماسه عمیق‌تر می‌شود.
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <div class="w-64 h-52 relative flex flex-col justify-end">
                        <!-- Sand Box -->
                        <div class="w-full h-24 bg-amber-800/40 border-t-2 border-amber-600/70 rounded-b-2xl relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-900/50 to-transparent"></div>
                            <span class="absolute bottom-2 right-3 text-[10px] text-amber-400 font-mono">بستر ماسه نرم</span>
                        </div>

                        <!-- Sinking Brick -->
                        <div id="sim-sp-sink-box" class="absolute left-1/2 -translate-x-1/2 bottom-20 transition-all duration-300 flex flex-col items-center">
                            <div class="w-24 h-12 rounded-lg bg-gradient-to-br from-red-600 to-amber-700 border-2 border-amber-400 shadow-xl flex items-center justify-center text-xs font-black text-white">
                                آجر (۴kg)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const setOrient = (o, btnId) => {
            orientation = o;
            document.querySelectorAll('.sp-face-btn').forEach(b => {
                b.className = 'sp-face-btn p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all text-center';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'sp-face-btn p-2.5 rounded-xl bg-amber-600 text-white font-bold border border-amber-400 transition-all text-center';
            update();
        };

        document.getElementById('sp-face-large')?.addEventListener('click', () => setOrient('large', 'sp-face-large'));
        document.getElementById('sp-face-med')?.addEventListener('click', () => setOrient('medium', 'sp-face-med'));
        document.getElementById('sp-face-small')?.addEventListener('click', () => setOrient('small', 'sp-face-small'));

        update();
    }

    // =========================================================================
    // 13. MECHANICAL WAVES & SOUND (پایه نهم: امواج مکانیکی، صوت و تشدید)
    // =========================================================================
    renderWavesSim(container) {
        let waveFreq = 2.5; // Hz
        let amplitude = 20; // mm
        let tension = 50; // N

        const update = () => {
            const waveSpeed = Math.sqrt(tension / 0.05); // v = sqrt(T / mu)
            const wavelength = waveSpeed / waveFreq;

            this.currentLiveState = {
                labId: 'waves',
                title: 'آزمایش امواج مکانیکی و صوت',
                params: {
                    'بسامد نوسان (f)': `${waveFreq} هرتز (Hz)`,
                    'دامنه نوسان (A)': `${amplitude} میلی‌متر`,
                    'کشش طناب (T)': `${tension} نیوتون`,
                    'تندی انتشار موج (v = λf)': `${waveSpeed.toFixed(1)} m/s`,
                    'طول موج (λ)': `${wavelength.toFixed(2)} متر`
                }
            };

            const fVal = document.getElementById('sim-wav-f-val');
            const aVal = document.getElementById('sim-wav-a-val');
            const vVal = document.getElementById('sim-wav-v-val');
            const lVal = document.getElementById('sim-wav-l-val');

            if (fVal) fVal.innerText = `${waveFreq} Hz`;
            if (aVal) aVal.innerText = `${amplitude} mm`;
            if (vVal) vVal.innerText = `${waveSpeed.toFixed(1)} m/s`;
            if (lVal) lVal.innerText = `${wavelength.toFixed(2)} m`;
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                    <h4 class="font-black text-base text-cyan-300">کارگاه امواج مکانیکی، صوت و رابطه (v = λ × f)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">پایه نهم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-waves" onclick="window.claimLabXp('waves', 'امواج مکانیکی و صوت')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">بسامد منبع نوسان (f):</span>
                            <span id="sim-wav-f-val" class="text-cyan-400 font-mono font-bold">2.5 Hz</span>
                        </div>
                        <input type="range" min="0.5" max="5" step="0.5" value="2.5" id="sim-wav-f-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">دامنه نوسان (A):</span>
                            <span id="sim-wav-a-val" class="text-indigo-400 font-mono font-bold">20 mm</span>
                        </div>
                        <input type="range" min="5" max="40" step="5" value="20" id="sim-wav-a-slider" class="physics-slider w-full" />
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">تندی انتشار موج (v):</span>
                            <span id="sim-wav-v-val" class="text-base font-black text-amber-400 font-mono">31.6 m/s</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <span class="text-[10px] text-slate-400 block mb-0.5">طول موج حاصله (λ):</span>
                            <span id="sim-wav-l-val" class="text-base font-black text-emerald-400 font-mono">12.65 m</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[240px]">
                    <svg viewBox="0 0 280 140" class="w-full max-w-[280px] h-auto">
                        <line x1="20" y1="70" x2="260" y2="70" stroke="#475569" stroke-dasharray="3 3" stroke-width="1" />
                        <path d="M 20 70 Q 50 30 80 70 T 140 70 T 200 70 T 260 70" fill="none" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
        </div>
        `;

        const fSlider = document.getElementById('sim-wav-f-slider');
        const aSlider = document.getElementById('sim-wav-a-slider');

        if (fSlider) fSlider.addEventListener('input', (e) => { waveFreq = parseFloat(e.target.value); update(); });
        if (aSlider) aSlider.addEventListener('input', (e) => { amplitude = parseFloat(e.target.value); update(); });

        update();
    }


    // =========================================================================
    // 14. PHET INTERACTIVE SANDBOX INTEGRATION
    // =========================================================================
    renderPhetSim(container, labDef) {
        const slug = labDef.phetSlug || 'density';
        const phetUrl = `https://phet.colorado.edu/sims/html/${slug}/latest/${slug}_all.html`;

        container.innerHTML = `
        <div class="rounded-3xl bg-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col">
            <div class="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <h4 class="font-black text-sm text-indigo-300">محیط شبیه‌ساز بین‌المللی PhET: ${labDef.title}</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">HTML5 Sandbox</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.toggleIframeFullscreen('phet-iframe-wrapper')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="maximize" class="w-3.5 h-3.5"></i>
                        <span>تمام‌صفحه</span>
                    </button>
                    <button onclick="window.physicsSimulators.reloadIframe('phet-sim-iframe')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
                        <span>بارگذاری مجدد</span>
                    </button>
                    <button id="claim-lab-xp-${labDef.id}" onclick="window.claimLabXp('${labDef.id}', '${labDef.title}')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div id="phet-iframe-wrapper" class="relative w-full h-[580px] bg-slate-950">
                <iframe id="phet-sim-iframe" src="${phetUrl}" class="w-full h-full border-0" allow="fullscreen" loading="lazy"></iframe>
            </div>
        </div>
        `;
    }

    toggleIframeFullscreen(wrapperId) {
        const el = document.getElementById(wrapperId);
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(err => console.warn(err));
        } else {
            document.exitFullscreen();
        }
    }

    reloadIframe(iframeId) {
        const iframe = document.getElementById(iframeId);
        if (iframe) iframe.src = iframe.src;
    }

    // =========================================================================
    // 15. FREE WORKBENCH INSTRUMENT TOOLBOX MODAL
    // =========================================================================
    openLabToolboxModal(initialTab = 'caliper') {
        const modalId = 'quantum-lab-toolbox-modal';
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/30 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow">
                        <i data-lucide="wrench" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-sm sm:text-base text-white">جعبه ابزار آزاد میز کار فیزیکدان</h3>
                        <p class="text-[10px] text-slate-400">ابزارهای دقیق اندازه‌گیری و سنجش آزمایشگاهی</p>
                    </div>
                </div>
                <button onclick="document.getElementById('${modalId}').remove()" class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Tab Buttons -->
            <div class="grid grid-cols-4 gap-1 p-2 bg-slate-950/50 border-b border-slate-800 text-xs font-bold">
                <button onclick="window.physicsSimulators.renderToolboxTab('caliper')" id="tb-tab-caliper" class="p-2 rounded-xl text-center transition-all bg-cyan-600 text-white font-bold">
                    📏 کولیس ورنیه
                </button>
                <button onclick="window.physicsSimulators.renderToolboxTab('stopwatch')" id="tb-tab-stopwatch" class="p-2 rounded-xl text-center text-slate-400 hover:text-white transition-all">
                    ⏱️ کرونومتر
                </button>
                <button onclick="window.physicsSimulators.renderToolboxTab('multimeter')" id="tb-tab-multimeter" class="p-2 rounded-xl text-center text-slate-400 hover:text-white transition-all">
                    ⚡ مولتی‌متر
                </button>
                <button onclick="window.physicsSimulators.renderToolboxTab('report')" id="tb-tab-report" class="p-2 rounded-xl text-center text-slate-400 hover:text-white transition-all">
                    📝 گزارش کار
                </button>
            </div>

            <!-- Mount Content Area -->
            <div id="toolbox-tab-mount" class="p-5 overflow-y-auto flex-1"></div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        this.renderToolboxTab(initialTab);
    }

    renderToolboxTab(tab) {
        const mount = document.getElementById('toolbox-tab-mount');
        if (!mount) return;

        ['caliper', 'stopwatch', 'multimeter', 'report'].forEach(t => {
            const btn = document.getElementById(`tb-tab-${t}`);
            if (btn) {
                btn.className = t === tab
                    ? 'p-2 rounded-xl text-center transition-all bg-cyan-600 text-white font-bold shadow'
                    : 'p-2 rounded-xl text-center text-slate-400 hover:text-white transition-all';
            }
        });

        if (tab === 'caliper') this.renderCaliperTool(mount);
        else if (tab === 'stopwatch') this.renderStopwatchTool(mount);
        else if (tab === 'multimeter') this.renderMultimeterTool(mount);
        else if (tab === 'report') this.renderReportTool(mount);

        if (window.lucide) window.lucide.createIcons();
    }

    renderCaliperTool(container) {
        let readingMm = 24.6; // mm

        const updateCaliper = () => {
            const mainScaleMm = Math.floor(readingMm);
            const vernierFraction = Math.round((readingMm - mainScaleMm) * 10);

            const readVal = document.getElementById('sim-calip-val');
            const mainVal = document.getElementById('sim-calip-main');
            const vernVal = document.getElementById('sim-calip-vern');
            const jaw = document.getElementById('sim-calip-jaw');

            if (readVal) readVal.innerText = `${readingMm.toFixed(1)} mm (${(readingMm / 10).toFixed(2)} cm)`;
            if (mainVal) mainVal.innerText = `${mainScaleMm} mm`;
            if (vernVal) vernVal.innerText = `خط ${vernierFraction} ورنیه (۰٫${vernierFraction} mm)`;

            if (jaw) {
                const pxOffset = (readingMm / 50) * 160;
                jaw.style.transform = `translateX(${pxOffset}px)`;
            }
        };

        container.innerHTML = `
        <div class="space-y-4 text-xs">
            <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                    <span class="text-slate-400 block text-[11px]">مقدار خوانده‌شده از کولیس با دقت ۰٫۱ میلی‌متر:</span>
                    <span id="sim-calip-val" class="text-lg font-black text-cyan-300 font-mono">24.6 mm</span>
                </div>
                <div class="text-right text-[11px] text-slate-400">
                    <div>خط‌کش اصلی: <span id="sim-calip-main" class="text-white font-bold">24 mm</span></div>
                    <div>انطباق ورنیه: <span id="sim-calip-vern" class="text-amber-400 font-bold">۰٫۶ mm</span></div>
                </div>
            </div>

            <!-- Jaw Slider Control -->
            <div>
                <label class="block text-slate-300 font-bold mb-1">تنظیم دهانه کولیس (۰ تا ۵۰ میلی‌متر):</label>
                <input type="range" min="0" max="50" step="0.1" value="24.6" id="sim-calip-slider" class="physics-slider w-full" />
            </div>

            <!-- Fine Step Buttons -->
            <div class="flex items-center justify-center gap-2 pt-1">
                <button id="calip-sub-1" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">- 1 mm</button>
                <button id="calip-sub-01" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">- 0.1 mm</button>
                <button id="calip-add-01" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">+ 0.1 mm</button>
                <button id="calip-add-1" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">+ 1 mm</button>
            </div>

            <!-- Caliper Visualizer -->
            <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                <div class="relative w-80 h-32 flex flex-col justify-center">
                    <!-- Fixed Caliper Body & Main Scale -->
                    <div class="w-full h-8 bg-slate-400 border border-slate-600 rounded flex items-center justify-between px-2 text-[7px] text-slate-900 font-mono select-none">
                        <span>| 0</span><span>| 10</span><span>| 20</span><span>| 30</span><span>| 40</span><span>| 50mm</span>
                    </div>
                    <!-- Fixed Left Jaw -->
                    <div class="absolute left-0 top-0 bottom-4 w-4 bg-slate-500 rounded-b-xl border border-slate-700"></div>

                    <!-- Movable Vernier Jaw -->
                    <div id="sim-calip-jaw" class="absolute left-4 top-2 bottom-0 flex flex-col items-start transition-all duration-75">
                        <div class="w-4 h-24 bg-cyan-600 rounded-b-xl border border-cyan-400 shadow-xl"></div>
                        <div class="w-16 h-6 -mt-16 ml-3 bg-slate-800 border border-cyan-400 rounded flex items-center justify-around text-[6px] text-cyan-300 font-mono px-1">
                            <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const slider = document.getElementById('sim-calip-slider');
        if (slider) slider.addEventListener('input', (e) => {
            readingMm = parseFloat(e.target.value);
            updateCaliper();
        });

        document.getElementById('calip-sub-1')?.addEventListener('click', () => { readingMm = Math.max(0, readingMm - 1); if (slider) slider.value = readingMm; updateCaliper(); });
        document.getElementById('calip-sub-01')?.addEventListener('click', () => { readingMm = Math.max(0, readingMm - 0.1); if (slider) slider.value = readingMm; updateCaliper(); });
        document.getElementById('calip-add-01')?.addEventListener('click', () => { readingMm = Math.min(50, readingMm + 0.1); if (slider) slider.value = readingMm; updateCaliper(); });
        document.getElementById('calip-add-1')?.addEventListener('click', () => { readingMm = Math.min(50, readingMm + 1); if (slider) slider.value = readingMm; updateCaliper(); });

        updateCaliper();
    }

    renderStopwatchTool(container) {
        const updateSwDisplay = () => {
            const timeEl = document.getElementById('sw-time-display');
            if (!timeEl) return;
            const ms = Math.floor((this.stopwatchState.elapsed % 1000) / 10);
            const totalSec = Math.floor(this.stopwatchState.elapsed / 1000);
            const s = totalSec % 60;
            const m = Math.floor(totalSec / 60);

            const pad = (n) => String(n).padStart(2, '0');
            timeEl.innerText = `${pad(m)}:${pad(s)}.${pad(ms)}`;
        };

        const renderLaps = () => {
            const list = document.getElementById('sw-laps-list');
            if (!list) return;
            if (this.stopwatchState.laps.length === 0) {
                list.innerHTML = `<span class="text-[11px] text-slate-500 text-center block py-2">هیچ دور زمانی ثبت نشده است</span>`;
                return;
            }
            list.innerHTML = this.stopwatchState.laps.map((lap, idx) => `
                <div class="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                    <span class="text-slate-400">دور ${idx + 1}</span>
                    <span class="text-cyan-400 font-mono font-bold">${lap}</span>
                </div>
            `).join('');
        };

        container.innerHTML = `
        <div class="space-y-5 text-center">
            <!-- Digital Display -->
            <div class="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-inner">
                <span id="sw-time-display" class="font-mono text-4xl sm:text-5xl font-black text-cyan-300 tracking-wider">
                    00:00.00
                </span>
            </div>

            <!-- Control Buttons -->
            <div class="flex items-center justify-center gap-2.5 text-xs">
                <button id="sw-btn-start" class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md">
                    <i data-lucide="${this.stopwatchState.running ? 'pause' : 'play'}" class="w-4 h-4"></i>
                    <span>${this.stopwatchState.running ? 'توقف' : 'شروع'}</span>
                </button>
                <button id="sw-btn-lap" class="px-4 py-2.5 rounded-2xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold flex items-center gap-1.5 shadow-md">
                    <i data-lucide="flag" class="w-4 h-4"></i>
                    <span>ثبت دور (Lap)</span>
                </button>
                <button id="sw-btn-reset" class="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700">
                    بازنشانی
                </button>
            </div>

            <!-- Lap Times Table -->
            <div class="text-right p-3 rounded-2xl bg-slate-950 border border-slate-800 max-h-36 overflow-y-auto">
                <span class="text-[10px] text-slate-400 font-bold block mb-1">رکوردهای ثبت‌شده (Laps):</span>
                <div id="sw-laps-list"></div>
            </div>
        </div>
        `;

        updateSwDisplay();
        renderLaps();

        const startBtn = document.getElementById('sw-btn-start');
        const lapBtn = document.getElementById('sw-btn-lap');
        const resetBtn = document.getElementById('sw-btn-reset');

        if (startBtn) startBtn.addEventListener('click', () => {
            if (this.stopwatchState.running) {
                clearInterval(this.stopwatchState.interval);
                this.stopwatchState.running = false;
                startBtn.className = 'px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md';
                startBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i><span>شروع</span>`;
            } else {
                this.stopwatchState.running = true;
                const startTime = performance.now() - this.stopwatchState.elapsed;
                this.stopwatchState.interval = setInterval(() => {
                    this.stopwatchState.elapsed = performance.now() - startTime;
                    updateSwDisplay();
                }, 30);
                startBtn.className = 'px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow-md';
                startBtn.innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i><span>توقف</span>`;
            }
            if (window.lucide) window.lucide.createIcons();
        });

        if (lapBtn) lapBtn.addEventListener('click', () => {
            const timeEl = document.getElementById('sw-time-display');
            if (timeEl) {
                this.stopwatchState.laps.unshift(timeEl.innerText);
                renderLaps();
            }
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (this.stopwatchState.interval) clearInterval(this.stopwatchState.interval);
            this.stopwatchState.running = false;
            this.stopwatchState.elapsed = 0;
            this.stopwatchState.laps = [];
            updateSwDisplay();
            renderLaps();
            if (startBtn) {
                startBtn.className = 'px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md';
                startBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i><span>شروع</span>`;
            }
            if (window.lucide) window.lucide.createIcons();
        });
    }

    renderMultimeterTool(container) {
        container.innerHTML = `
        <div class="space-y-4 text-xs">
            <!-- Digital Multimeter Housing -->
            <div class="p-5 rounded-3xl bg-slate-950 border-2 border-yellow-500/60 shadow-2xl space-y-4">
                <!-- LCD Screen -->
                <div class="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
                    <span class="text-[10px] text-emerald-400 font-mono font-bold">DC AUTO</span>
                    <span id="mm-display-val" class="font-mono text-3xl font-black text-emerald-300">
                        12.00 V
                    </span>
                    <span class="text-xs text-emerald-400 font-mono font-bold">HOLD</span>
                </div>

                <!-- Dial Selector -->
                <div>
                    <label class="block text-slate-300 font-bold mb-2">سلکتور حالت اندازه‌گیری مولتی‌متر:</label>
                    <div class="grid grid-cols-4 gap-2 text-xs">
                        <button onclick="document.getElementById('mm-display-val').innerText = '12.00 V'" class="p-2.5 rounded-xl bg-yellow-600 text-slate-950 font-black text-center shadow">
                            V (ولتاژ DC)
                        </button>
                        <button onclick="document.getElementById('mm-display-val').innerText = '2.00 A'" class="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-center font-bold">
                            A (جریان DC)
                        </button>
                        <button onclick="document.getElementById('mm-display-val').innerText = '6.00 Ω'" class="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-center font-bold">
                            Ω (مقاومت)
                        </button>
                        <button onclick="document.getElementById('mm-display-val').innerText = '0.0 Ω (BEEP)'" class="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-center font-bold">
                            🔊 تست اتصال
                        </button>
                    </div>
                </div>

                <!-- Probe Leads -->
                <div class="flex items-center justify-center gap-6 pt-2">
                    <div class="flex items-center gap-2">
                        <span class="w-3.5 h-3.5 rounded-full bg-red-600 shadow-md"></span>
                        <span class="text-[11px] text-slate-400">پراب مثبت (قرمز)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 shadow-md"></span>
                        <span class="text-[11px] text-slate-400">پراب منفی / COM (مشکی)</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    renderReportTool(container) {
        const live = this.currentLiveState || {};
        const title = live.title || 'آزمایش فیزیک';
        const params = live.params || {};

        let paramRows = '';
        for (const [k, v] of Object.entries(params)) {
            paramRows += `<tr><td class="p-2 border border-slate-700 font-bold text-slate-300">${k}</td><td class="p-2 border border-slate-700 text-cyan-300 font-mono font-bold">${v}</td></tr>`;
        }

        container.innerHTML = `
        <div class="space-y-4 text-xs">
            <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <h5 class="font-bold text-cyan-300 mb-1">داده‌های استخراج‌شده از آزمایش جاری: ${title}</h5>
                <table class="w-full border-collapse border border-slate-700 text-[11px] mt-2">
                    ${paramRows || '<tr><td colspan="2" class="p-3 text-center text-slate-500">ابتدا یک آزمایش را اجرا کنید تا داده‌ها ثبت شوند</td></tr>'}
                </table>
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">مشاهدات و تحلیل علمی شما از این آزمایش:</label>
                <textarea id="logbook-observations" rows="3" placeholder="نتایج به دست آمده و تحلیل روابط فیزیکی را اینجا تایپ کنید..."
                    class="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-500"></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button onclick="window.physicsSimulators.printReport()" class="btn-duo-green text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md">
                    <i data-lucide="printer" class="w-4 h-4"></i>
                    <span>چاپ و دانلود گزارش آزمایش (PDF)</span>
                </button>
            </div>
        </div>
        `;
    }

    copyStateToLogbook() {
        this.openLabToolboxModal('report');
    }

    printReport() {
        const live = this.currentLiveState || {};
        const title = live.title || 'گزارش کار آزمایشگاه فیزیک';
        const params = live.params || {};
        const obsEl = document.getElementById('logbook-observations');
        const obs = obsEl ? obsEl.value : '';
        const user = window.store?.currentUser || {};

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('لطفاً اجازه باز شدن پنجره چاپ را در مرورگر فعال فرمایید.');
            return;
        }

        let rowsHtml = '';
        for (const [k, v] of Object.entries(params)) {
            rowsHtml += `<tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; background: #f8fafc;">${k}</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${v}</td></tr>`;
        }

        printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body { font-family: Tahoma, 'Vazirmatn', sans-serif; direction: rtl; padding: 30px; color: #0f172a; line-height: 1.6; }
                .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
                .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; }
                th { background: #f1f5f9; text-align: right; }
                .box { border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px; margin-bottom: 20px; min-height: 80px; }
                @media print { button { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>انجمن فیزیک شهید بهشتی دو — گزارش کار آزمایشگاه</h2>
                <h3>${title}</h3>
            </div>
            <div class="meta">
                <span>دانش‌آموز: ${user.display_name || user.full_name || 'دانش‌آموز فیزیک'}</span>
                <span>پایه تحصیلی: ${user.grade_title_fa || 'دوره اول متوسطه'}</span>
                <span>تاریخ: ${new Date().toLocaleDateString('fa-IR')}</span>
            </div>
            <h4>۱. داده‌ها و متغیرهای ثبت‌شده در آزمایش:</h4>
            <table>
                <thead><tr><th>پارامتر فیزیکی</th><th>مقدار اندازه‌گیری‌شده</th></tr></thead>
                <tbody>${rowsHtml || '<tr><td colspan="2">داده‌ای ثبت نشد</td></tr>'}</tbody>
            </table>
            <h4>۲. تحلیل نتایج، مشاهدات و نتیجه‌گیری:</h4>
            <div class="box">
                ${obs ? obs.replace(/\n/g, '<br>') : 'مشاهدات تجربی به صورت کامل با روابط تئوری کتاب درسی فیزیک انطباق دارد.'}
            </div>
            <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px;">
                <span>امضای آزمایشگر: _________________</span>
                <span>تأیید دبیر فیزیک: _________________</span>
            </div>
            <script>
                window.onload = function() { window.print(); };
            </script>
        </body>
        </html>
        `);
        printWindow.document.close();
    }
}

// Global instance
window.physicsSimulators = new PhysicsSimulators();

// Gamification XP Award Handler
window.claimLabXp = async function(simType, labTitleFa) {
    if (!window.api || !window.api.token) {
        if (window.openAuthModal) window.openAuthModal('login');
        return;
    }
    const btn = document.getElementById(`claim-lab-xp-${simType}`);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>`;
    }
    try {
        const res = await window.api.recordLabActivity(simType, labTitleFa, 20);
        if (btn) {
            btn.className = 'px-3.5 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-default';
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i><span>امتیاز ثبت شد (+۲۰ XP)</span>`;
            if (window.lucide) window.lucide.createIcons();
        }
        if (window.store && window.store.showXpToast) {
            window.store.showXpToast(res.xp_awarded || 20, `آزمایشگاه ${labTitleFa}`);
        }
        if (window.store && window.store.refreshUser) {
            await window.store.refreshUser();
        }
    } catch (err) {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>تلاش مجدد ثبت</span>`;
        }
        console.warn('Lab XP claim error:', err);
    }
};
