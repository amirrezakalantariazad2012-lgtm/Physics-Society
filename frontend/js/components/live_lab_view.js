/**
 * QUANTUM CUT — Academic Live Physics Laboratory & Synchronized Classroom Broadcasting
 * Supports live broadcasting and real-time switching across ALL 28 Physics Laboratories (Grades 7, 8, 9 & SAMPAD).
 * Powered by Starlette WebSockets with SQLite WAL cross-worker event bus, universal laser pointer, student lock, and live polls.
 */

const ALL_LABORATORIES = [
    // ==========================================
    // GRADE 7 (پایه هفتم)
    // ==========================================
    {
        id: "density",
        title: "چگالی، حجم جابه‌جاشده و شناوری ارشمیدس",
        grade: 7,
        gradeLabel: "پایه هفتم",
        file: "density.html",
        formula: "\\rho = \\frac{m}{V} \\quad , \\quad F_b = \\rho_{\\text{fluid}} \\cdot V_{\\text{submerged}} \\cdot g",
        topic: "فصل ۲: اندازه‌گیری در علوم و ابزارهای آن",
        desc: "محاسبه دقیق چگالی با ترازو و استوانه مدرج به روش جابه‌جایی مایع، قانون شناوری ارشمیدس و بررسی شرایط سه‌گانه شناوری، غوطه‌وری و ته‌نشینی.",
        goals: "۱. اندازه‌گیری حجم اجسام نامنظم با جابه‌جایی آب • ۲. درک اینکه شناوری به چگالی وابسته است نه جرم کل",
        misconception: "بدفهمی رایج: اجسام سنگین همیشه فرو می‌روند! (خیر، شناوری تنها به چگالی ماده بستگی دارد نه وزن کل).",
        icon: "flask-conical",
        color: "blue"
    },
    {
        id: "energy-skate-park",
        title: "پایستگی و تبدیل‌های انرژی مکانیکی (اسکیت‌پارک)",
        grade: 7,
        gradeLabel: "پایه هفتم",
        file: "energy-skate-park.html",
        formula: "E_M = K + U_g = \\frac{1}{2}mv^2 + mgh = \\text{ثابت} \\quad (\\Delta E_M = -W_f)",
        topic: "فصل ۸: انرژی و تبدیل‌های آن",
        desc: "تبدیل مداوم انرژی پتانسیل گرانشی به انرژی جنبشی و بالعکس در طول پیست اسکیت، اثر اصطکاک بر تلفات گرمایی و اثبات پایستگی کامل انرژی کل مکانیکی.",
        goals: "۱. مشاهده تبدیل متقابل انرژی پتانسیل و جنبشی • ۲. تحلیل نقش اصطکاک در تولید گرمای درونی",
        misconception: "بدفهمی رایج: انرژی هنگام توقف ناشی از اصطکاک نابود می‌شود! (خیر، به انرژی گرمایی جنبش مولکول‌ها دگرگون شده است).",
        icon: "activity",
        color: "teal"
    },
    {
        id: "energy-forms",
        title: "صورت‌های انرژی، دما و تعادل گرمایی",
        grade: 7,
        gradeLabel: "پایه هفتم",
        file: "energy-forms.html",
        formula: "Q = mc\\Delta T \\quad , \\quad T_{eq} = \\frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2}",
        topic: "فصل ۱۰: گرما و بهینه‌سازی مصرف انرژی",
        desc: "آزمایش دماسنجی و تبادل حرارت بین اجسام مختلف (آهن، آجر، آب، روغن)، ظرفیت گرمایی ویژه و بسته‌های انرژی حرارتی.",
        goals: "۱. شارش خودبه‌خودی گرما از دمای بالاتر به پایین‌تر • ۲. مقایسه ظرفیت گرمایی آب و سایر مواد",
        misconception: "بدفهمی رایج: دما و گرما یک مفهوم هستند! (دما میانگین انرژی جنبشی است و گرما انرژی مبادله‌شده).",
        icon: "flame",
        color: "amber"
    },
    {
        id: "pendulum-lab",
        title: "آزمایشگاه آونگ ساده، زمان‌سنجی و شتاب گرانش",
        grade: 7,
        gradeLabel: "پایه هفتم",
        file: "pendulum-lab.html",
        formula: "T = 2\\pi \\sqrt{\\frac{L}{g}} \\quad , \\quad f = \\frac{1}{T}",
        topic: "فصل ۲ و ۸: اندازه‌گیری زمان و نوسانگرها",
        desc: "اندازه‌گیری دوره تناوب آونگ با طول نخ متغیر، زاویه رهاسازی، جرم وزنه و اندازه‌گیری شتاب گرانش محلی.",
        goals: "۱. اثبات مستقل بودن دوره تناوب از جرم وزنه • ۲. رابطه مستقیم دوره نوسان با جذر طول نخ (L)",
        misconception: "بدفهمی رایج: وزنه سنگین‌تر آونگ را سریع‌تر می‌چرخاند! (در زوایای کوچک دوره تناوب مستقل از جرم است).",
        icon: "timer",
        color: "indigo"
    },
    {
        id: "states-of-matter-basics",
        title: "حالت‌های ماده، جنبش مولکولی و گذار فاز",
        grade: 7,
        gradeLabel: "پایه هفتم",
        file: "states-of-matter-basics.html",
        formula: "Q = mL_f \\quad , \\quad Q = mL_v",
        topic: "فصل ۳: ماده و جنبش ذرات",
        desc: "کاوش ساختار میکروسکوپی گاز، مایع و جامد (نئون، آرگون، اکسیژن و آب) تحت تغییرات دما و فشار ظرف.",
        goals: "۱. مشاهده ربایش و جنبش ذرات در سه حالت ماده • ۲. درک پدیده انبساط و تغییر فاصله میان‌مولکولی",
        misconception: "بدفهمی رایج: فاصله بین ذرات گاز و مایع یکسان است! (فاصله مولکول‌ها در گاز بسیار بیشتر است).",
        icon: "boxes",
        color: "sky"
    },

    // ==========================================
    // GRADE 8 (پایه هشتم)
    // ==========================================
    {
        id: "circuit-dc",
        title: "کیت ساخت مدارهای الکتریکی DC (قانون اهم و مدار سری/موازی)",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "circuit-dc.html",
        formula: "V = IR \\quad , \\quad R_{\\text{series}} = R_1 + R_2 \\quad , \\quad \\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2}",
        topic: "فصل ۹: الکتریسیته و قانون اهم",
        desc: "ساخت مدار با باتری، لامپ، سیم و کلید، اندازه‌گیری ولتاژ با ولت‌سنج و شدت جریان با آمپرسنج و مقاومت معادل.",
        goals: "۱. اثبات رابطه خطی ولتاژ و جریان (V=IR) • ۲. تحلیل تفاوت جریان در مدارهای متوالی و موازی",
        misconception: "بدفهمی رایج: جریان با عبور از لامپ مصرف و کم می‌شود! (جریان پایسته است؛ انرژی الکتریکی به نور و گرما تبدیل می‌شود).",
        icon: "zap",
        color: "amber"
    },
    {
        id: "balloons-static",
        title: "الکتریسیته ساکن، بار الکتریکی و القای بار",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "balloons-static.html",
        formula: "F_e = k \\frac{|q_1 q_2|}{r^2} \\quad , \\quad \\Delta q_1 = -\\Delta q_2",
        topic: "فصل ۹: بارهای الکتریکی ساکن",
        desc: "مالش بادکنک به ژاکت پشمی، انتقال الکترون‌ها، ایجاد بار خالص منفی و ربایش اجسام خنثی با پدیده القای الکترواستاتیک.",
        goals: "۱. مشاهده پایستگی بار الکتریکی در مالش • ۲. درک سازوکار جذب بادکنک باردار به دیوار خنثی",
        misconception: "بدفهمی رایج: بار مثبت (پروتون) جابه‌جا می‌شود! (فقط الکترون‌های آزاد انتقال می‌یابند).",
        icon: "sparkles",
        color: "yellow"
    },
    {
        id: "bending-light",
        title: "شکست نور، قانون اسنل و پاشندگی در منشور",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "bending-light.html",
        formula: "n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2 \\quad , \\quad n = \\frac{c}{v}",
        topic: "فصل ۱۵: شکست نور و منشور",
        desc: "تابش پرتو لیزر تک‌رنگ و نور سفید به آب، شیشه و هوا، تغییر سرعت سیر نور، زاویه حد و بازتاب کلی.",
        goals: "۱. بررسی انحراف پرتو هنگام ورود به محیط غلیظ‌تر • ۲. آزمایش پدیده بازتاب داخلی کلی و زاویه حد",
        misconception: "بدفهمی رایج: بسامد نور با شکست تغییر می‌کند! (بسامد ثابت می‌ماند و طول موج و سرعت تغییر می‌کنند).",
        icon: "sun",
        color: "sky"
    },
    {
        id: "geometric-optics",
        title: "نور هندسی، آینه‌ها و عدسی‌ها (تشکیل تصویر)",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "geometric-optics.html",
        formula: "\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{q} \\quad , \\quad m = -\\frac{q}{p} = \\frac{h'}{h}",
        topic: "فصل ۱۴ و ۱۵: نور، آینه‌ها و عدسی‌های همگرا/واگرا",
        desc: "رسم پرتوهای تابش شاخص در عدسی همگرا، بررسی تصاویر حقیقی و مجازی، فاصله کانونی و تغییرات بزرگنمایی.",
        goals: "۱. ردیابی ۳ پرتو شاخص نوری • ۲. تعیین مرز کانون (F) و تشکیل تصویر وارونه حقیقی یا مستقیم مجازی",
        misconception: "بدفهمی رایج: اگر نیمی از عدسی پوشانده شود، نیمی از تصویر تشکیل نمی‌شود! (کل تصویر با شدت نور کمتر دیده می‌شود).",
        icon: "eye",
        color: "violet"
    },
    {
        id: "faradays-law",
        title: "مغناطیس، خطوط میدان و القای الکترومغناطیسی فارادی",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "faradays-law.html",
        formula: "\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t} \\quad , \\quad \\Phi_B = B \\cdot A \\cos \\theta",
        topic: "فصل ۱۰: مغناطیس و آهنربای الکتریکی",
        desc: "حرکت دادن آهنربای میله‌ای درون سیم‌پیچ و القای ولتاژ لحظه‌ای، جهت جریان القایی طبق قانون لنز و ولت‌سنج صفرمرکز.",
        goals: "۱. اثبات تولید الکتریسیته تنها هنگام تغییر شار مغناطیسی • ۲. رابطه بزرگی ولتاژ القایی با تندی حرکت آهنربا",
        misconception: "بدفهمی رایج: آهنربای ساکن درون سیم‌پیچ جریان دائم تولید می‌کند! (فقط «حرکت نسبی» جریان القا می‌کند).",
        icon: "magnet",
        color: "emerald"
    },
    {
        id: "coulombs-law",
        title: "آزمایشگاه قانون کولن و برهم‌کنش بارهای نقطه‌ای",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "coulombs-law.html",
        formula: "F_e = k \\frac{|q_1 q_2|}{r^2} \\quad (k = 8.99 \\times 10^9 \\, \\text{N}\\cdot\\text{m}^2/\\text{C}^2)",
        topic: "فصل ۹: الکتریسیته و نیروی الکتریکی سمپاد",
        desc: "تغییر بارهای q1 و q2 از منفی تا مثبت، تغییر فاصله دو بار با خط‌کش میلی‌متری و رسم بردارهای کنش و واکنش نیوتون.",
        goals: "۱. بررسی رابطه عکس مجذوری نیرو با فاصله (1/r²) • ۲. مشاهده برابری اندازه نیروی عمل و عکس‌العمل",
        misconception: "بدفهمی رایج: بار بزرگتر نیروی بیشتری بر بار کوچکتر وارد می‌کند! (طبق قانون سوم نیوتون نیروها همواره هم‌اندازه‌اند).",
        icon: "layers",
        color: "cyan"
    },
    {
        id: "charges-and-fields",
        title: "بارها، خطوط میدان الکتریکی و سطوح هم‌پتانسیل",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "charges-and-fields.html",
        formula: "\\vec{E} = k \\frac{q}{r^2} \\hat{r} \\quad , \\quad V = k \\frac{q}{r}",
        topic: "فصل ۹ سمپاد: نقشه میدان الکتریکی و سطوح هم‌پتانسیل",
        desc: "چیدمان بارهای مثبت و منفی، رسم خطوط میدان الکتریکی برداری، حسگرهای سنجش ولتاژ و سطوح هم‌پتانسیل.",
        goals: "۱. مشاهده خروج خطوط میدان از بار مثبت و ورود به بار منفی • ۲. عمود بودن خطوط میدان بر سطوح هم‌پتانسیل",
        misconception: "بدفهمی رایج: خطوط میدان الکتریکی مسیر حرکت بارها را نشان می‌دهند! (مسیر تنها در صورت سکون بار در امتداد خط راست با خط میدان منطبق است).",
        icon: "radio",
        color: "rose"
    },
    {
        id: "blackbody-spectrum",
        title: "طیف تابش جسم سیاه و دمای ستارگان",
        grade: 8,
        gradeLabel: "پایه هشتم",
        file: "blackbody-spectrum.html",
        formula: "\\lambda_{\\max} T = b \\quad , \\quad I = \\sigma T^4",
        topic: "فصل ۱۰: نگاهی به فضا، طیف نور و دمای ستارگان",
        desc: "طیف‌سنجی تابش گرمایی اجسام در دماهای مختلف (از لامپ و زمین تا خورشید و ستارگان داغ سیروس)، قانون وین و استفان-بولتزمن.",
        goals: "۱. درک رابطه رنگ ستاره با دمای سطحی آن • ۲. بررسی افزایش شدید توان تابشی با توان چهارم دما",
        misconception: "بدفهمی رایج: ستاره‌های قرمز داغ‌ترین هستند! (ستاره‌های آبی و سفید بسیار داغ‌تر از ستاره‌های سرخ هستند).",
        icon: "globe",
        color: "orange"
    },

    // ==========================================
    // GRADE 9 & SAMPAD (پایه نهم و سمپاد)
    // ==========================================
    {
        id: "motion-1d",
        title: "حرکت خط راست: مکان، سرعت، شتاب و معادلات سمپاد",
        grade: 9,
        gradeLabel: "پایه نهم و سمپاد",
        file: "kinematics-1d.html",
        formula: "x(t) = \\frac{1}{2}at^2 + v_0t + x_0 \\quad , \\quad v^2 - v_0^2 = 2a\\Delta x \\quad , \\quad v = at + v_0",
        topic: "فصل ۴: حرکت چیست؟ و معادلات شتاب ثابت سمپاد",
        desc: "شبیه‌ساز رسمی و سفید حرکت خط راست سمپاد با خط‌کش مقیاس‌دار، بردار سرعت و شتاب، ثبت همزمان ۳ نمودار x-t، v-t و a-t و ردیابی حرکت تندشونده و کندشونده.",
        goals: "۱. تفکیک شفاف مسافت از بردار جابه‌جایی • ۲. درک شرط تندشوندگی (هم‌علامت بودن a و v) • ۳. تحلیل شیب نمودار x-t به عنوان سرعت لحظه‌ای",
        misconception: "بدفهمی رایج: شتاب منفی همیشه به معنای کاهش سرعت است! (اگر سرعت نیز منفی باشد، جسم در جهت منفی تندشونده حرکت می‌کند).",
        icon: "move",
        color: "blue"
    },
    {
        id: "forces-motion",
        title: "نیرو، شتاب و قوانین حرکت نیوتون (دینامیک)",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "forces-motion.html",
        formula: "\\Sigma \\vec{F} = m \\vec{a} \\quad , \\quad f_k = \\mu_k N \\quad , \\quad W = mg",
        topic: "فصل ۵: نیرو و قوانین حرکت نیوتون",
        desc: "آزمودن قانون اول (لختی)، قانون دوم (F=ma) و قانون سوم (کنش و واکنش)، نیروی اصطکاک ایستایی و جنبشی روی سطوح مختلف یخ و چوب.",
        goals: "۱. اثبات رابطه شتاب با برآیند نیروها نه نیروی منفرد • ۲. آزمایش نیروی اصطکاک آستانه حرکت",
        misconception: "بدفهمی رایج: حرکت نیازمند اعمال نیروی مداوم است! (طبق قانون اول، متحرک بدون اصطکاک تا ابد با تندی ثابت ادامه مسیر می‌دهد).",
        icon: "play-circle",
        color: "rose"
    },
    {
        id: "hookes-law",
        title: "قانون هوک، فنر کشسانی و انرژی پتانسیل کشسانی",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "hookes-law.html",
        formula: "F = k \\Delta x \\quad , \\quad U_e = \\frac{1}{2} k (\\Delta x)^2",
        topic: "فصل ۵: نیروها و قانون هوک",
        desc: "اعمال نیرو به فنر با ثابت‌های سختی متفاوت، اندازه‌گیری تغییر طول با خط‌کش، بررسی بازگشت فنر و رسم نمودار نیرو برحسب تغییر طول.",
        goals: "۱. اثبات رابطه خطی نیرو و تغییر طول فنر • ۲. محاسبه ضریب سختی فنر (k) از شیب نمودار",
        misconception: "بدفهمی رایج: ثابت سختی فنر با افزایش نیرو زیاد می‌شود! (ثابت سختی ویژگی ساختاری فنر است و مستقل از نیروی اعمالی است).",
        icon: "git-commit",
        color: "teal"
    },
    {
        id: "masses-springs",
        title: "نوسانگر وزنه و فنر در گرانش‌های مختلف (زمین، ماه، مشتری)",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "masses-springs.html",
        formula: "T = 2\\pi \\sqrt{\\frac{m}{k}} \\quad , \\quad F_g = mg",
        topic: "فصل ۵: وزن و نیروی گرانش در سیارات",
        desc: "آویزان کردن وزنه‌ها به فنرها، آزمایش نوسانات در گرانش زمین (9.8)، ماه (1.62)، مشتری (24.8) و فضای بی‌وزنی با زمان‌سنج.",
        goals: "۱. درک تفاوت جرم با وزن در اجرام آسمانی • ۲. پایستگی انرژی مکانیکی در نوسان فنر",
        misconception: "بدفهمی رایج: در ماه جرم جسم کمتر از زمین است! (جرم مقدار ماده است و هرگز تغییر نمی‌کند؛ تنها وزن تغییر می‌یابد).",
        icon: "sliders",
        color: "cyan"
    },
    {
        id: "under-pressure",
        title: "فشار در شاره‌ها، فشار جو و اصل پاسکال (هیدرولیک)",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "under-pressure.html",
        formula: "P = \\rho g h \\quad , \\quad P_{\\text{total}} = P_0 + \\rho g h \\quad , \\quad \\frac{F_1}{A_1} = \\frac{F_2}{A_2}",
        topic: "فصل ۸: فشار و آثار آن",
        desc: "اندازه‌گیری فشار در اعماق مایعات مختلف، اثر چگالی، فشارسنگ‌ها، اتمسفر زمین و اثبات اصل پاسکال در لوله‌های مرتبط.",
        goals: "۱. اثبات اینکه فشار مایع فقط به عمق و چگالی وابسته است نه شکل ظرف • ۲. درک سازوکار بالابر هیدرولیکی پاسکال",
        misconception: "بدفهمی رایج: فشار در ظرف پهن‌تر بیشتر از ظرف باریک در همان عمق است! (فشار شاره مستقل از مساحت ظرف است).",
        icon: "compass",
        color: "sky"
    },
    {
        id: "balancing-act",
        title: "اهرم‌ها، گشتاور نیرو و تعادل دورانی (ماشین‌های ساده)",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "balancing-act.html",
        formula: "F_1 \\cdot d_1 = F_2 \\cdot d_2 \\quad , \\quad A = \\frac{R}{E} = \\frac{d_E}{d_R}",
        topic: "فصل ۹: ماشین‌ها و مزیت مکانیکی اهرم‌ها",
        desc: "قرار دادن وزنه‌ها در فواصل مختلف از تکیه‌گاه، برقراری تعادل الاکلنگ، مفهوم گشتاور نیرو و محاسبه مزیت مکانیکی.",
        goals: "۱. شرط تعادل دورانی اهرم (حاصلضرب نیرو در بازو) • ۲. درک اینکه با افزایش بازوی محرک، نیروی کمتری لازم است",
        misconception: "بدفهمی رایج: ماشین‌ها کار یا انرژی را افزایش می‌دهند! (ماشین‌ها کار را ذخیره یا آسان می‌کنند اما کار خروجی هرگز از ورودی بیشتر نیست).",
        icon: "scale",
        color: "amber"
    },
    {
        id: "wave-on-a-string",
        title: "امواج مکانیکی، صوت، بسامد و تشدید (طناب نوسانگر)",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "wave-on-a-string.html",
        formula: "v = \\lambda \\cdot f \\quad , \\quad v = \\sqrt{\\frac{T}{\\mu}} \\quad , \\quad f_n = n \\frac{v}{2L}",
        topic: "فصل ۴ سمپاد: حرکت موجی و ارتعاش",
        desc: "ایجاد پالس و امواج سینوسی مداوم روی طناب، دامنه، بسامد، کشش طناب، بازتاب از انتهای بسته و باز و تولید موج ایستاده.",
        goals: "۱. مشاهده انتقال انرژی توسط موج بدون انتقال ماده • ۲. تحلیل رابطه عکس بسامد و طول‌موج (v=λf)",
        misconception: "بدفهمی رایج: با افزایش بسامد تندی انتشار موج بیشتر می‌شود! (تندی موج تنها به ویژگی‌های محیط یعنی کشش و چگالی خطی طناب وابسته است).",
        icon: "rss",
        color: "violet"
    },
    {
        id: "projectile-motion",
        title: "حرکت پرتابه‌ها، زاویه پرتاب و برد در گرانش‌های مختلف",
        grade: 9,
        gradeLabel: "پایه نهم و سمپاد",
        file: "projectile-motion.html",
        formula: "R = \\frac{v_0^2 \\sin(2\\theta)}{g} \\quad , \\quad H = \\frac{v_0^2 \\sin^2\\theta}{2g} \\quad , \\quad t = \\frac{2v_0 \\sin\\theta}{g}",
        topic: "فصل ۴ سمپاد: حرکت دوبعدی پرتابی",
        desc: "شلیک توپ با زوایای مختلف، مقاومت هوا، جرم پرتابه و دستیابی به ماکزیمم برد در زاویه ۴۵ درجه.",
        goals: "۱. تفکیک حرکت افقی یکنواخت از حرکت عمودی شتاب‌دار • ۲. اثبات برابری برد برای زوایای متمم (مانند ۳۰ و ۶۰ درجه)",
        misconception: "بدفهمی رایج: در نقطه اوج پرتابه شتاب صفر می‌شود! (در تمام طول پرواز شتاب رو به پایین برابر با g است و فقط مولفه قائم سرعت صفر می‌شود).",
        icon: "navigation",
        color: "rose"
    },
    {
        id: "collision-lab",
        title: "برخوردها، پایستگی تکانه و انرژی جنبشی",
        grade: 9,
        gradeLabel: "پایه نهم و سمپاد",
        file: "collision-lab.html",
        formula: "m_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}'_1 + m_2 \\vec{v}'_2 \\quad , \\quad K = \\frac{1}{2}mv^2",
        topic: "فصل ۵ سمپاد: اندازه حرکت (تکانه) و برخورد کشسان",
        desc: "برخورد اجسام با جرم‌های مختلف روی سطح بدون اصطکاک در یک بعد و دو بعد، بررسی پایستگی تکانه کل و تلفات انرژی در برخوردهای ناکشسان.",
        goals: "۱. مشاهده اصل پایستگی تکانه خطی در غیاب نیروهای خارجی • ۲. تمایز برخورد کاملاً کشسان از ناکشسان",
        misconception: "بدفهمی رایج: در تمام برخوردها انرژی جنبشی پایسته است! (فقط در برخورد کشسان انرژی جنبشی پایسته است؛ اما تکانه همیشه پایسته می‌ماند).",
        icon: "circle-dot",
        color: "indigo"
    },
    {
        id: "calculus-grapher",
        title: "تحلیل نمودارهای حرکت، شیب و جابه‌جایی (سینماتیک)",
        grade: 9,
        gradeLabel: "پایه نهم و سمپاد",
        file: "calculus-grapher.html",
        formula: "v(t) = \\frac{dx}{dt} = \\text{شیب} \\quad , \\quad a(t) = \\frac{dv}{dt} \\quad , \\quad \\Delta x = \\int v\\,dt = \\text{مساحت}",
        topic: "فصل ۴ سمپاد: مفهوم شیب مماس و مساحت زیر نمودار",
        desc: "رسم دستی نمودار موقعیت، مشاهده تشکیل لحظه‌ای نمودار شیب (مشتق سرعت) و محاسبه مساحت هندسی زیر منحنی سرعت (انتگرال جابه‌جایی).",
        goals: "۱. درک شهودی مفهوم مشتق و انتگرال در فیزیک مکانیک • ۲. تسلط بر ارتباط هندسی نمودارهای سه‌گانه حرکتی",
        misconception: "بدفهمی رایج: اگر سرعت جسم صفر باشد جابه‌جایی هم صفر است! (سرعت لحظه‌ای شیب نمودار است و با مکان کل اشتباه گرفته نشود).",
        icon: "trending-up",
        color: "blue"
    },
    {
        id: "vector-addition",
        title: "بردار جابه‌جایی، جمع برداری و مؤلفه‌ها (سینماتیک)",
        grade: 9,
        gradeLabel: "پایه نهم و سمپاد",
        file: "vector-addition.html",
        formula: "\\vec{R} = \\vec{A} + \\vec{B} \\quad , \\quad |\\vec{R}| = \\sqrt{R_x^2 + R_y^2} \\quad , \\quad \\theta = \\arctan\\left(\\frac{R_y}{R_x}\\right)",
        topic: "فصل ۴: کمیت‌های برداری و تفکیک مؤلفه‌ها",
        desc: "رسم بردارها روی صفحه شطرنجی دو بعدی، روش مثلثی و متوازی‌الاضلاع جمع بردارها، تجزیه به مؤلفه‌های x و y و بزرگی بردار برآیند.",
        goals: "۱. یادگیری تجزیه هندسی بردارها به مؤلفه‌های قائم • ۲. درک اینکه جمع برداری متفاوت از جمع جبری اعداد نرده‌ای است",
        misconception: "بدفهمی رایج: اندازه برآیند همیشه جمع اندازه دو بردار است! (|R| تنها در صورت هم‌جهت بودن بردارها برابر با |A|+|B| است).",
        icon: "compass",
        color: "emerald"
    },
    {
        id: "gravity-and-orbits",
        title: "گرانش عمومی، مدارهای کپلری و فضاپیما",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "gravity-and-orbits.html",
        formula: "F_g = G \\frac{m_1 m_2}{r^2} \\quad , \\quad v_{\\text{orbit}} = \\sqrt{\\frac{GM}{r}} \\quad , \\quad T = 2\\pi \\sqrt{\\frac{r^3}{GM}}",
        topic: "فصل ۱۰: نگاهی به فضا و حرکت مداری ماه و زمین",
        desc: "بررسی مدار زمین، ماه، خورشید و ماهواره‌های فضایی، نیروی جاذبه گرانشی و بردار سرعت مداری و چگونگی پرتاب ماهواره‌ها به فضا.",
        goals: "۱. مشاهده سقوط دائمی فضاپیما حول زمین • ۲. اثر جرم خورشید و فاصله سیاره بر دوره گردش مداری",
        misconception: "بدفهمی رایج: در مدار زمین جاذبه صفر است! (گرانش در مدار ایستگاه فضایی حدود ۹۰٪ زمین است اما چون فضاپیما در حال سقوط آزاد است فضانوردان بی‌وزنی حس می‌کنند).",
        icon: "orbit",
        color: "violet"
    },
    {
        id: "my-solar-system",
        title: "کاوشگر منظومه شمسی و گرانش چندجرمی",
        grade: 9,
        gradeLabel: "پایه نهم و سمپاد",
        file: "my-solar-system.html",
        formula: "\\vec{F}_i = \\sum_{j \\ne i} G \\frac{m_i m_j}{r_{ij}^2} \\hat{r}_{ij} \\quad , \\quad E_{\\text{total}} = K + U_g = \\text{ثابت}",
        topic: "فصل ۱۰: نگاهی به فضا، سیارات و منظومه شمسی",
        desc: "چیدمان ستاره‌ها، سیارات و قمرها در سامانه چندجسمی، تماشای مدارهای پایدار بیضوی، اثر قلاب‌سنگی گرانشی و آشوب مداری.",
        goals: "۱. درک اثر متقابل گرانشی چند سیاره بر یکدیگر • ۲. کشف شرایط پایداری مدارهای سیاره‌ای",
        misconception: "بدفهمی رایج: مدار سیارات دایره کامل است! (طبق قانون اول کپلر تمام مدارها بیضی‌هایی هستند که خورشید در یکی از کانون‌های آن است).",
        icon: "globe",
        color: "sky"
    },
    {
        id: "gravity-force-lab-basics",
        title: "قانون گرانش عمومی نیوتون بین دو جرم آسمانی",
        grade: 9,
        gradeLabel: "پایه نهم",
        file: "gravity-force-lab-basics.html",
        formula: "F = G \\frac{m_1 m_2}{r^2} \\quad (G = 6.674 \\times 10^{-11} \\, \\text{N}\\cdot\\text{m}^2/\\text{kg}^2)",
        topic: "فصل ۱۰: نیروی جاذبه عمومی نیوتون",
        desc: "سنجش اندازه نیروی جاذبه بین دو جرم غول‌پیکر با تغییر اندازه جرم و فاصله آن‌ها با متر و تایید رابطه عکس مجذوری نیوتون.",
        goals: "۱. درک رابطه مستقیم نیرو با حاصلضرب جرم‌ها • ۲. مشاهده تضعیف شدید نیرو با افزایش فاصله",
        misconception: "بدفهمی رایج: نیروی گرانش فقط برای اجرام آسمانی وجود دارد! (هر دو جسم دارای جرم در عالم بر یکدیگر نیروی گرانش وارد می‌کنند).",
        icon: "disc",
        color: "blue"
    },
    {
        id: "keplers-laws",
        title: "قوانین سه‌گانه کپلر در حرکت مداری سیارات",
        grade: 9,
        gradeLabel: "پایه نهم و سمپاد",
        file: "keplers-laws.html",
        formula: "\\frac{T^2}{a^3} = \\frac{4\\pi^2}{GM} \\quad , \\quad \\frac{dA}{dt} = \\frac{L}{2m} = \\text{ثابت}",
        topic: "فصل ۱۰ سمپاد: قوانین کپلر و مدارات بیضوی",
        desc: "کاوش قانون اول (مدارهای بیضوی)، قانون دوم (جاروب مساحت‌های مساوی در زمان‌های مساوی) و قانون سوم (نسبت توان دوم دوره به مکعب نیم‌قطر بزرگ).",
        goals: "۱. مشاهده افزایش تندی سیاره در حضیض خورشیدی • ۲. اثبات نسبت ثابت T²/a³ برای کلیه سیارات منظومه شمسی",
        misconception: "بدفهمی رایج: سرعت سیاره در تمام مدار یکنواخت است! (سیاره در نزدیک‌ترین نقطه به خورشید بیشترین تندی را دارد).",
        icon: "orbit",
        color: "amber"
    }
];

function getLabInfo(simId) {
    if (!simId) simId = 'motion-1d';
    const found = ALL_LABORATORIES.find(l => l.id === simId || l.file === simId || l.file === `${simId}.html`);
    return found || ALL_LABORATORIES[13]; // default motion-1d
}

const LIVE_LAB_ASSET_VER = '2.1';

function getLabUrl(simId, role = 'student') {
    const info = getLabInfo(simId);
    return `/simulators/phet/${info.file}?v=${LIVE_LAB_ASSET_VER}&role=${role}`;
}


class LiveLabComponent {
    constructor() {
        this.currentRoom = null;
        this.socket = null;
        this.sessionId = null;
        this.userRole = 'student'; // 'teacher' or 'student'
        this.userName = 'دانش‌آموز';
        this.currentSimId = 'motion-1d';
        this.isStudentLocked = true;
        this.isStreaming = false;
        this.localStream = null;
        this.micStream = null;
        this.isMicMuted = true;
        this.peerConnections = new Map(); // studentSessionId -> RTCPeerConnection
        this.studentPeerConnection = null;
        this.fallbackTimer = null;
        this.activeViewMode = 'stream'; // 'stream' or 'solo'
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.isLaserActive = false;
        this.simIframe = null;
        this.laserOverlay = null;
        this.pingTimer = null;
        this.syncPoller = null;
        this.lastSyncTime = 0;
        this.votedPollIndex = null;
        this.hasVideoAudioTrack = false;
    }

    getEffectiveUser() {
        if (!window.store) return null;
        return window.store.currentUser || window.store.user || null;
    }

    isTeacherOrAdmin(user) {
        if (!user) return false;
        const role = (user.role || '').toLowerCase();
        return role === 'teacher' || role === 'admin' || role === 'curator' || role === 'manager';
    }

    async render(container, roomCode = null) {
        const user = this.getEffectiveUser();
        const isPresenter = this.isTeacherOrAdmin(user);
        this.userRole = isPresenter ? 'teacher' : 'student';
        this.userName = user ? (user.full_name || user.name || user.username || (isPresenter ? 'دبیر فیزیک سمپاد' : 'دانش‌آموز')) : (isPresenter ? 'دبیر فیزیک سمپاد' : 'دانش‌آموز');

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
                        <span>پخش زنده و میت کلاسی ۲۸ آزمایشگاه فیزیک سمپاد (Google Meet Classroom)</span>
                    </div>

                    ${this.userRole === 'teacher' ? `
                    <button onclick="window.liveLab.openCreateModal()" 
                        class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>شروع جلسه زنده تدریس آزمایشگاهی (ویژه دبیران)</span>
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
                        میت تعاملی و پخش زنده آزمایشگاه‌های فیزیک
                    </h1>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                        دبیران گرامی می‌توانند در یک محیط مشابه Google Meet تمام ۲۸ آزمایشگاه فیزیک پایه‌های هفتم، هشتم و نهم سمپاد را به طور زنده با کیفیت Full HD و ۶۰ فریم بر ثانیه به اشتراک بگذارند. دانش‌آموزان تک‌تک آزمایش‌ها، اتصالات مدار و نمودارها را به صورت زنده و همگام مشاهده می‌کنند.
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
                        <i data-lucide="radio" class="w-4 h-4 text-rose-500 animate-pulse"></i>
                        <span>جلسات زنده و در حال برگزاری (${rooms.length})</span>
                    </span>
                    <button onclick="window.liveLab.renderLobby(document.getElementById('app-main-content'))" class="text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                        <i data-lucide="refresh-cw" class="w-3 h-3"></i>
                        <span>بروزرسانی</span>
                    </button>
                </div>

                ${rooms.length === 0 ? `
                <div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3">
                    <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <i data-lucide="tv" class="w-6 h-6"></i>
                    </div>
                    <h3 class="font-bold text-sm text-slate-800 dark:text-slate-200">در حال حاضر هیچ پخش زنده‌ای فعال نیست</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        دبیران گرامی می‌توانند با کلیک بر روی دکمه «شروع جلسه زنده تدریس»، کلاس آنلاین ۲۸ آزمایشگاه را آغاز کنند.
                    </p>
                </div>
                ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${rooms.map(r => {
                        const lab = getLabInfo(r.sim_id);
                        return `
                        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3 relative overflow-hidden group">
                            <div class="flex items-center justify-between">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${r.is_streaming ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} text-[11px] font-bold">
                                    <span class="w-2 h-2 rounded-full ${r.is_streaming ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}"></span>
                                    <span>${r.is_streaming ? 'در حال پخش زنده' : 'آماده برگزاری'}</span>
                                </span>
                                <span class="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">${r.room_code}</span>
                            </div>

                            <div>
                                <h3 class="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">${r.title}</h3>
                                <div class="mt-2 text-[11px] text-blue-600 dark:text-sky-400 font-bold flex items-center gap-1">
                                    <i data-lucide="flask-conical" class="w-3.5 h-3.5"></i>
                                    <span>${lab.title}</span>
                                </div>
                                <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <i data-lucide="user-check" class="w-3.5 h-3.5 text-blue-500"></i>
                                    <span>${r.teacher_name}</span>
                                    <span>•</span>
                                    <span>${lab.gradeLabel}</span>
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
                        `;
                    }).join('')}
                </div>
                `}
            </div>
        </div>

        <!-- Create Classroom Modal with Full 28 Lab Browser -->
        <div id="live-lab-create-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <div class="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans">
                <!-- Modal Header -->
                <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <span class="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">
                            ایجاد پخش زنده آزمایشگاه‌های فیزیک سمپاد
                        </h3>
                    </div>
                    <button onclick="window.liveLab.closeCreateModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Modal Body (Scrollable) -->
                <div class="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                    <div>
                        <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">عنوان و موضوع جلسه تدریس:</label>
                        <input id="create-room-title" type="text" placeholder="مثال: اثبات شتاب ثابت و نمودارهای حرکت خط راست سمپاد" 
                            class="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 font-sans text-xs sm:text-sm">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">نام دبیر / مدرس ارائه‌دهنده:</label>
                            <input id="create-room-teacher" type="text" value="${this.userName}" 
                                class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">پایه تحصیلی هدف:</label>
                            <select id="create-room-grade" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                                <option value="9" selected>پایه نهم (سینماتیک، دینامیک، فشار و نجوم)</option>
                                <option value="8">پایه هشتم (الکتریسیته، مغناطیس و شکست نور)</option>
                                <option value="7">پایه هفتم (اندازه‌گیری، چگالی، گرما و انرژی)</option>
                            </select>
                        </div>
                    </div>

                    <!-- 28 Laboratories Browser -->
                    <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div class="flex items-center justify-between">
                            <label class="font-bold text-slate-700 dark:text-slate-300">انتخاب آزمایشگاه آغازین از بین ۲۸ آزمایشگاه رسمی:</label>
                            <div class="flex items-center gap-1 text-[11px]">
                                <button onclick="window.liveLab.filterGradeTab(0)" id="grade-tab-0" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold bg-blue-600 text-white">همه (۲۸)</button>
                                <button onclick="window.liveLab.filterGradeTab(7)" id="grade-tab-7" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold text-slate-600 dark:text-slate-400">پایه هفتم (۴)</button>
                                <button onclick="window.liveLab.filterGradeTab(8)" id="grade-tab-8" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold text-slate-600 dark:text-slate-400">پایه هشتم (۸)</button>
                                <button onclick="window.liveLab.filterGradeTab(9)" id="grade-tab-9" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold text-slate-600 dark:text-slate-400">پایه نهم (۱۶)</button>
                            </div>
                        </div>

                        <!-- Lab Cards Grid -->
                        <div id="create-modal-labs-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                            ${ALL_LABORATORIES.map((lab, idx) => `
                            <div onclick="window.liveLab.selectCreateLab('${lab.id}')" 
                                id="create-lab-card-${lab.id}"
                                data-grade="${lab.grade}"
                                data-title="${lab.title}"
                                class="create-lab-card p-3 rounded-xl border text-right cursor-pointer transition-all ${idx === 13 
                                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-400' 
                                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'}">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${lab.grade === 9 ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : lab.grade === 8 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'}">
                                        ${lab.gradeLabel}
                                    </span>
                                    <span class="text-[10px] text-slate-400 font-mono">${lab.file}</span>
                                </div>
                                <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">${lab.title}</h4>
                                <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${lab.topic}</p>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                    <input type="hidden" id="selected-create-sim-id" value="motion-1d">
                </div>

                <!-- Modal Footer -->
                <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                    <span id="selected-lab-preview-name" class="text-xs font-bold text-blue-600 dark:text-sky-400 flex items-center gap-1.5">
                        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>
                        <span>انتخاب شده: حرکت خط راست: مکان، سرعت، شتاب و معادلات سمپاد</span>
                    </span>
                    <div class="flex items-center gap-2">
                        <button onclick="window.liveLab.closeCreateModal()" class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800">انصراف</button>
                        <button onclick="window.liveLab.submitCreateRoom()" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                            <i data-lucide="radio" class="w-4 h-4"></i>
                            <span>ایجاد و ورود به کلاس</span>
                        </button>
                    </div>
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

    selectCreateLab(simId) {
        document.querySelectorAll('.create-lab-card').forEach(el => {
            el.classList.remove('border-blue-500', 'bg-blue-50/80', 'dark:bg-blue-950/60', 'ring-2', 'ring-blue-400');
            el.classList.add('border-slate-200', 'dark:border-slate-800');
        });
        const card = document.getElementById(`create-lab-card-${simId}`);
        if (card) {
            card.classList.add('border-blue-500', 'bg-blue-50/80', 'dark:bg-blue-950/60', 'ring-2', 'ring-blue-400');
        }
        const input = document.getElementById('selected-create-sim-id');
        if (input) input.value = simId;
        const info = getLabInfo(simId);
        const preview = document.getElementById('selected-lab-preview-name');
        if (preview && info) {
            preview.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i><span>انتخاب شده: ${info.title}</span>`;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    filterGradeTab(grade) {
        document.querySelectorAll('.grade-filter-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('text-slate-600', 'dark:text-slate-400');
        });
        const activeBtn = document.getElementById(`grade-tab-${grade}`);
        if (activeBtn) {
            activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
            activeBtn.classList.add('bg-blue-600', 'text-white');
        }

        document.querySelectorAll('.create-lab-card').forEach(card => {
            const cardGrade = parseInt(card.getAttribute('data-grade'));
            if (grade === 0 || cardGrade === grade) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    async submitCreateRoom() {
        const titleInput = document.getElementById('create-room-title');
        const teacherInput = document.getElementById('create-room-teacher');
        const gradeInput = document.getElementById('create-room-grade');
        const simInput = document.getElementById('selected-create-sim-id');

        const title = titleInput ? titleInput.value.trim() : '';
        if (!title) {
            alert('لطفاً عنوان جلسه تدریس را وارد نمایید.');
            return;
        }

        const simId = simInput ? simInput.value : 'motion-1d';
        const lab = getLabInfo(simId);

        try {
            const res = await fetch('/api/live-lab/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    sim_id: simId,
                    sim_title: lab.title,
                    grade: gradeInput ? parseInt(gradeInput.value) : 9,
                    teacher_name: teacherInput ? teacherInput.value.trim() : 'دبیر فیزیک سمپاد'
                })
            });

            if (res.ok) {
                const data = await res.json();
                this.closeCreateModal();
                window.store.setView('live-lab', { id: data.room.room_code });
            } else {
                alert('خطا در ایجاد کلاس. لطفاً مجدداً تلاش فرمایید.');
            }
        } catch (e) {
            console.error('Error creating live room:', e);
            alert('اتصال به سرور برقرار نشد.');
        }
    }

    joinFromInput() {
        const inp = document.getElementById('quick-room-code-input');
        const code = inp ? inp.value.trim().toUpperCase() : '';
        if (code) {
            window.store.setView('live-lab', { id: code });
        }
    }

    async joinRoom(container, roomCode) {
        this.currentRoom = roomCode;
        let details = null;
        try {
            const res = await fetch(`/api/live-lab/rooms/${roomCode}`);
            if (res.ok) {
                details = await res.json();
            }
        } catch (e) {
            console.warn('Could not fetch room details:', e);
        }

        if (!details) {
            container.innerHTML = `
            <div class="max-w-md mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <i data-lucide="alert-triangle" class="w-6 h-6"></i>
                </div>
                <h3 class="font-bold text-slate-800 dark:text-white">کلاس یافت نشد</h3>
                <p class="text-xs text-slate-500">شناسه کلاس نامعتبر است یا جلسه به اتمام رسیده است.</p>
                <button onclick="window.store.setView('live-lab')" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">بازگشت به فهرست کلاس‌ها</button>
            </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        this.currentSimId = details.sim_id || 'motion-1d';
        this.isStudentLocked = details.is_locked !== undefined ? Boolean(details.is_locked) : true;
        this.isStreaming = Boolean(details.is_streaming);

        // Ensure both admin and teacher roles receive full presenter host privileges
        const user = this.getEffectiveUser();
        const isPresenter = this.isTeacherOrAdmin(user) || (user && (user.full_name === details.teacher_name || user.username === details.teacher_name));
        if (isPresenter) {
            this.userRole = 'teacher';
            if (user) {
                this.userName = user.full_name || user.name || user.username || 'دبیر فیزیک سمپاد';
            }
        }

        const currentLab = getLabInfo(this.currentSimId);

        container.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4 font-sans">
            
            <!-- Classroom Header & Meet Control Bar -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <span class="w-3.5 h-3.5 rounded-full ${this.isStreaming ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}"></span>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">${details.title}</h2>
                            <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">${details.room_code}</span>
                        </div>
                        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span class="flex items-center gap-1">
                                <i data-lucide="user-check" class="w-3.5 h-3.5 text-blue-500"></i>
                                <span>دبیر: <b>${details.teacher_name}</b></span>
                            </span>
                            <span>•</span>
                            <span id="room-active-lab-name" class="font-bold text-blue-600 dark:text-sky-400">${currentLab.title}</span>
                            <span>•</span>
                            <span class="flex items-center gap-1 font-mono">
                                <i data-lucide="users" class="w-3.5 h-3.5 text-emerald-500"></i>
                                <span id="header-viewers-count">${details.viewers_count}</span> نفر آنلاین
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center flex-wrap gap-2">
                    ${this.userRole === 'teacher' ? `
                    <!-- Teacher Live Streaming Action Button (Google Meet) -->
                    <button id="btn-main-stream" onclick="window.liveLab.toggleScreenBroadcast()" 
                        class="px-4 py-2 rounded-xl ${this.isStreaming ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} font-bold text-xs shadow-md flex items-center gap-2 transition-all">
                        <i data-lucide="${this.isStreaming ? 'video-off' : 'video'}" class="w-4 h-4"></i>
                        <span id="main-stream-btn-text">${this.isStreaming ? '⏹️ توقف اشتراک تصویر' : '🖥️ شروع اشتراک زنده آزمایشگاه (Meet)'}</span>
                    </button>

                    <!-- Switch Laboratory Button (All 28 Labs) -->
                    <button onclick="window.liveLab.openSimSwitcherModal()" 
                        class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5">
                        <i data-lucide="repeat" class="w-4 h-4"></i>
                        <span>🧪 تعویض آزمایشگاه (${ALL_LABORATORIES.length})</span>
                    </button>
                    ` : `
                    <!-- Student Stream Status Pill -->
                    <span id="student-stream-badge" class="px-3 py-1.5 rounded-xl ${this.isStreaming ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'} font-bold text-xs flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full ${this.isStreaming ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}"></span>
                        <span id="student-stream-badge-text">${this.isStreaming ? '🔴 در حال تماشای زنده تدریس دبیر' : '⚪ در انتظار اشتراک تصویر دبیر'}</span>
                    </span>

                    <!-- Student View Mode Toggle (Stream vs Solo) -->
                    <div id="student-view-mode-group" class="${this.isStudentLocked ? 'opacity-60 pointer-events-none' : ''} flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                        <button onclick="window.liveLab.setStudentViewMode('stream')" id="mode-btn-stream" 
                            class="px-2.5 py-1 rounded-lg ${this.activeViewMode === 'stream' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                            📺 تصویر زنده دبیر
                        </button>
                        <button onclick="window.liveLab.setStudentViewMode('solo')" id="mode-btn-solo" 
                            class="px-2.5 py-1 rounded-lg ${this.activeViewMode === 'solo' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                            🧪 کار انفرادی
                        </button>
                    </div>
                    `}

                    <!-- Fullscreen & Share -->
                    <button onclick="window.liveLab.toggleFullscreen()" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700" title="تمام‌صفحه">
                        <i data-lucide="maximize" class="w-4 h-4"></i>
                    </button>

                    <button onclick="window.liveLab.openShareModal()" class="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
                        <span>اشتراک</span>
                    </button>

                    <button onclick="window.store.setView('live-lab')" class="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-1.5">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>خروج</span>
                    </button>
                </div>
            </div>

            <!-- Main Stage (Left 8 cols: Video/Workbench, Right 4 cols: Classroom Sidecar) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                <!-- Left Column (8 cols): Google Meet Cinema Screen or Laboratory Workbench -->
                <div class="lg:col-span-8 space-y-4">
                    
                    <div id="live-stage-wrapper" class="relative w-full h-[540px] sm:h-[640px] rounded-2xl bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden select-none flex items-center justify-center">
                        
                        <!-- Teacher Controls Toolbar (Inside Stage) -->
                        ${this.userRole === 'teacher' ? `
                        <div class="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 backdrop-blur text-white border border-slate-700 text-xs shadow-xl">
                            <div class="flex items-center gap-2 font-bold ${this.isStreaming ? 'text-rose-400' : 'text-slate-400'}">
                                <span class="w-2.5 h-2.5 rounded-full ${this.isStreaming ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}"></span>
                                <span id="teacher-stream-indicator">${this.isStreaming ? 'پخش زنده ۶۰ فریم فعال است' : 'آماده اشتراک تصویر'}</span>
                            </div>

                            <div class="flex items-center flex-wrap gap-1.5">
                                <!-- Record Button -->
                                <button onclick="window.liveLab.toggleRecording()" id="btn-stage-record" 
                                    class="px-2.5 py-1 rounded-lg ${this.isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'} font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="disc" class="w-3.5 h-3.5"></i>
                                    <span id="record-text">${this.isRecording ? 'توقف ضبط' : 'ضبط ویدیو'}</span>
                                </button>

                                <!-- Toggle Student Lock -->
                                <button onclick="window.liveLab.toggleStudentLock()" 
                                    id="btn-toggle-student-lock"
                                    class="px-2.5 py-1 rounded-lg ${this.isStudentLocked ? 'bg-amber-600 hover:bg-amber-500' : 'bg-slate-800 hover:bg-slate-700'} font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="${this.isStudentLocked ? 'lock' : 'unlock'}" class="w-3 h-3"></i>
                                    <span id="btn-lock-text">${this.isStudentLocked ? 'قفل کلاس: فعال' : 'آزمایش آزاد'}</span>
                                </button>

                                <!-- Laser Pointer Mode -->
                                <button onclick="window.liveLab.toggleLaserMode()" 
                                    id="btn-toggle-laser"
                                    class="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="sparkles" class="w-3 h-3"></i>
                                    <span id="btn-laser-text">🔦 لیزر تدریس</span>
                                </button>

                                <button onclick="window.liveLab.promptAddTeacherNote()" class="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="plus" class="w-3 h-3"></i>
                                    <span>نکته تخته</span>
                                </button>

                                <button onclick="window.liveLab.promptStartPoll()" class="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="help-circle" class="w-3 h-3"></i>
                                    <span>کوییز کلاسی</span>
                                </button>
                            </div>
                        </div>

                        <!-- Teacher Laboratory Workbench (Interactive iframe) -->
                        <iframe id="live-sim-iframe" 
                            src="${getLabUrl(this.currentSimId, 'teacher')}" 
                            class="w-full h-full border-0 rounded-2xl bg-white" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            loading="eager">
                        </iframe>

                        <!-- Laser Pointer Overlay Surface -->
                        <canvas id="live-laser-canvas" class="absolute inset-0 z-20 pointer-events-none w-full h-full"></canvas>
                        ` : `
                        <!-- Student Meet Stage -->
                        <div id="student-stream-viewport" class="relative w-full h-full flex items-center justify-center bg-slate-950">
                            
                            <!-- Live WebRTC Video Element (Google Meet Feed) -->
                            <video id="live-meet-video" autoplay playsinline muted 
                                class="${this.isStreaming && this.activeViewMode === 'stream' ? 'block' : 'hidden'} w-full h-full object-contain bg-slate-950"></video>
                            
                            <!-- Live Canvas Mirror (Direct real-time simulation broadcast) -->
                            <canvas id="live-auto-mirror-canvas" 
                                class="${this.isStreaming && this.activeViewMode === 'stream' ? 'block' : 'hidden'} w-full h-full object-contain bg-slate-900 rounded-2xl shadow-inner"></canvas>
                            
                            <!-- Live Fallback Canvas (Instant frame snapshot receiver) -->
                            <canvas id="live-fallback-canvas" 
                                class="hidden w-full h-full object-contain bg-slate-950"></canvas>

                            <!-- Student Solo Mode iframe (Available only when unlocked) -->
                            <iframe id="live-sim-iframe" 
                                src="${getLabUrl(this.currentSimId, 'student')}" 
                                class="${this.activeViewMode === 'solo' && !this.isStudentLocked ? 'block' : 'hidden'} w-full h-full border-0 bg-white" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                loading="eager">
                            </iframe>

                            <!-- Virtual Classroom Waiting Lounge (Shown when stream is not yet broadcasting) -->
                            <div id="stream-waiting-lounge" class="${!this.isStreaming && this.activeViewMode === 'stream' ? 'flex' : 'hidden'} flex-col items-center justify-center p-8 text-center text-white space-y-4 max-w-lg">
                                <div class="relative">
                                    <div class="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                                        <i data-lucide="video" class="w-10 h-10 animate-pulse"></i>
                                    </div>
                                    <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                                </div>
                                <h3 class="font-extrabold text-lg text-white">کلاس فیزیک زنده سمپاد در حال برگزاری است</h3>
                                <p class="text-xs text-slate-400 leading-relaxed">
                                    دبیر محترم (${details.teacher_name}) در حال آماده‌سازی آزمایشگاه است.<br>
                                    به محض شروع اشتراک تصویر، پخش زنده به صورت خودکار با کیفیت Full HD در این قاب نمایش داده خواهد شد.
                                </p>
                                <div class="flex items-center gap-3 pt-2">
                                    <span class="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[11px] font-mono font-bold flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                        <span>سرور سمپاد آنلاین • پینگ &lt; 5ms</span>
                                    </span>
                                    <span class="px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono">
                                        حاضرین: <span id="lounge-viewers-count">${details.viewers_count}</span> نفر
                                    </span>
                                </div>
                            </div>

                            <!-- Student Interaction Lock Blocker (When in Solo mode and Teacher locks) -->
                            <div id="student-lock-blocker" class="${this.isStudentLocked && this.activeViewMode === 'solo' ? 'flex' : 'hidden'} absolute inset-0 z-20 flex-col items-center justify-center p-6 text-center bg-slate-950/85 backdrop-blur-sm text-white space-y-3">
                                <div class="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                                    <i data-lucide="lock" class="w-6 h-6"></i>
                                </div>
                                <h3 class="font-bold text-sm">توجه کلاسی: آزمایشگاه قفل شد</h3>
                                <p class="text-xs text-slate-300 max-w-sm leading-relaxed">دبیر محترم دسترسی به آزمایشگاه انفرادی را قفل نمودند. لطفاً تصویر زنده تدریس را دنبال فرمایید.</p>
                                <button onclick="window.liveLab.setStudentViewMode('stream')" class="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs">تماشای تصویر زنده دبیر</button>
                            </div>

                            <!-- Laser Pointer Overlay Surface for Student -->
                            <canvas id="live-laser-canvas" class="absolute inset-0 z-20 pointer-events-none w-full h-full"></canvas>
                        </div>
                        `}
                    </div>

                    <!-- Dynamic Educational Context Bar (نوار تحلیل و فرمول‌های علمی آزمایشگاه فعال) -->
                    <div id="live-educational-card" class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3 font-sans">
                        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                            <div class="flex items-center gap-2">
                                <span id="edu-lab-grade" class="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                                    ${currentLab.gradeLabel}
                                </span>
                                <h3 id="edu-lab-title" class="font-extrabold text-sm text-slate-900 dark:text-white">
                                    ${currentLab.title}
                                </h3>
                            </div>
                            <span id="edu-lab-topic" class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                ${currentLab.topic}
                            </span>
                        </div>

                        <!-- KaTeX Formula Display -->
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-center">
                            <span class="text-[10px] text-slate-400 block mb-1 font-mono">رابطه علمی حاکم بر این آزمایشگاه (FORMULA MATRIX):</span>
                            <div id="edu-lab-formula" class="text-sm sm:text-base font-bold text-sky-600 dark:text-sky-300 academic-mono katex-ltr-container" dir="ltr">
                                $$${currentLab.formula}$$
                            </div>
                        </div>

                        <!-- Objectives & Misconceptions Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div class="p-3 rounded-xl bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-700/60 space-y-1">
                                <span class="font-bold text-blue-700 dark:text-sky-300 block">🎯 اهداف آموزشی آزمایش:</span>
                                <p id="edu-lab-goals" class="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">${currentLab.goals}</p>
                            </div>
                            <div class="p-3 rounded-xl bg-rose-50/50 dark:bg-slate-800/40 border border-rose-100 dark:border-slate-700/60 space-y-1">
                                <span class="font-bold text-rose-700 dark:text-rose-300 block">⚠️ هشدار بدفهمی رایج علمی:</span>
                                <p id="edu-lab-misconception" class="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">${currentLab.misconception}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (4 cols): Classroom Sidecar (Chalkboard Notes, Live Poll, Academic Chat) -->
                <div class="lg:col-span-4 space-y-4">
                    
                    <!-- Live Quick Poll Card (If active) -->
                    <div id="live-poll-card" class="${details.active_poll ? '' : 'hidden'} p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/70 shadow-sm space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-200">
                                <i data-lucide="help-circle" class="w-4 h-4 text-amber-500"></i>
                                <span>پرسش فوری دبیر (کوییز کلاسی)</span>
                            </span>
                            <span id="live-poll-total" class="text-[10px] font-mono text-amber-700 dark:text-amber-300 font-bold">۰ پاسخ</span>
                        </div>
                        <p id="live-poll-question" class="text-xs font-bold text-slate-900 dark:text-white leading-relaxed"></p>
                        <div id="live-poll-options" class="space-y-1.5"></div>
                    </div>

                    <!-- Teacher Live Chalkboard Notes Card -->
                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <i data-lucide="file-text" class="w-4 h-4 text-indigo-500"></i>
                                <span>تخته یادداشت‌های دبیر</span>
                            </span>
                            ${this.userRole === 'teacher' ? `
                            <button onclick="window.liveLab.clearTeacherNotes()" class="text-[10px] text-rose-500 hover:underline">پاک کردن همه</button>
                            ` : ''}
                        </div>
                        <div id="teacher-notes-list" class="space-y-2 max-h-48 overflow-y-auto text-xs pr-1">
                            ${(!details.notes || details.notes.length === 0) ? `
                            <p class="text-[11px] text-slate-400 text-center py-3">یادداشتی ثبت نشده است.</p>
                            ` : details.notes.map(n => `
                            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                                ${n}
                            </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Classroom Academic Chat -->
                    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[340px] overflow-hidden">
                        <div class="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                            <span class="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                                <i data-lucide="message-square" class="w-4 h-4 text-blue-500"></i>
                                <span>گفتگوی علمی کلاس</span>
                            </span>
                            <button onclick="window.liveLab.sendRaiseHand()" class="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                                <span>✋ اجازه گرفتن</span>
                            </button>
                        </div>

                        <!-- Chat Messages Container -->
                        <div id="live-chat-messages" class="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                            <div class="text-[10px] text-slate-400 text-center py-2">
                                به گفتگوی برخط کلاس فیزیک سمپاد خوش آمدید.
                            </div>
                        </div>

                        <!-- Chat Input Box -->
                        <div class="p-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850">
                            <input id="live-chat-input" type="text" placeholder="پیام یا پرسش علمی خود را بنویسید..." 
                                onkeydown="if(event.key==='Enter') window.liveLab.sendChatMessage()"
                                class="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs font-sans">
                            <button onclick="window.liveLab.sendChatMessage()" class="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                <i data-lucide="send" class="w-3.5 h-3.5 rotate-180"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Simulator Switcher Modal (All 28 Laboratories) -->
        <div id="live-sim-switcher-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <div class="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans">
                <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i data-lucide="repeat" class="w-5 h-5 text-blue-500"></i>
                        <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            تغییر فوری آزمایشگاه تدریس (تمام ۲۸ آزمایشگاه فیزیک سمپاد)
                        </h3>
                    </div>
                    <button onclick="window.liveLab.closeSimSwitcherModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                
                <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850 text-xs">
                    <input id="switcher-search-input" type="text" placeholder="جستجو بر اساس نام آزمایشگاه یا مبحث درسی..." 
                        oninput="window.liveLab.filterSwitcherLabs(this.value)"
                        class="flex-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none">
                    <div class="flex items-center gap-1 font-bold">
                        <button onclick="window.liveLab.filterSwitcherGrade(0)" id="switch-tab-0" class="switch-grade-tab px-2.5 py-1 rounded-lg bg-blue-600 text-white">همه (۲۸)</button>
                        <button onclick="window.liveLab.filterSwitcherGrade(7)" id="switch-tab-7" class="switch-grade-tab px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400">هفتم (۴)</button>
                        <button onclick="window.liveLab.filterSwitcherGrade(8)" id="switch-tab-8" class="switch-grade-tab px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400">هشتم (۸)</button>
                        <button onclick="window.liveLab.filterSwitcherGrade(9)" id="switch-tab-9" class="switch-grade-tab px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400">نهم و سمپاد (۱۶)</button>
                    </div>
                </div>

                <div id="switcher-labs-grid" class="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 overflow-y-auto flex-1 max-h-[50vh]">
                    ${ALL_LABORATORIES.map(lab => `
                    <div onclick="window.liveLab.changeSimulator('${lab.id}')" 
                        data-grade="${lab.grade}"
                        data-title="${lab.title}"
                        data-topic="${lab.topic}"
                        class="switcher-lab-card p-3 rounded-xl border text-right cursor-pointer transition-all ${lab.id === this.currentSimId 
                            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-400' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/40'}">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full ${lab.grade === 9 ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : lab.grade === 8 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'}">
                                ${lab.gradeLabel}
                            </span>
                            <span class="text-[9px] text-slate-400 font-mono">${lab.file}</span>
                        </div>
                        <h4 class="font-bold text-xs text-slate-900 dark:text-white truncate">${lab.title}</h4>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${lab.topic}</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Share Classroom Modal -->
        <div id="live-share-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 font-sans text-center">
                <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                    <i data-lucide="share-2" class="w-6 h-6"></i>
                </div>
                <div>
                    <h3 class="font-extrabold text-base text-slate-900 dark:text-white">اشتراک‌گذاری کلاس با دانش‌آموزان</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">شناسه و نشانی این کلاس را برای حضور همزمان دانش‌آموزان ارسال فرمایید:</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-mono font-black text-lg text-blue-600 dark:text-sky-400">
                    ${details.room_code}
                </div>
                <div class="flex items-center gap-2">
                    <input id="share-url-input" type="text" readonly value="${window.location.origin}/#live-lab/${details.room_code}" 
                        class="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono outline-none">
                    <button onclick="window.liveLab.copyShareUrl()" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">کپی لینک</button>
                </div>
                <button onclick="window.liveLab.closeShareModal()" class="w-full py-2 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800">بستن</button>
            </div>
        </div>
        `;

        this.simIframe = document.getElementById('live-sim-iframe');
        this.laserOverlay = document.getElementById('live-laser-canvas');

        if (window.lucide) window.lucide.createIcons();
        if (window.renderScientificFormulas) {
            setTimeout(window.renderScientificFormulas, 60);
        }

        // Initialize Live WebSocket & Bridge
        this.connectWebSocket(roomCode);
        this.setupLaserCaptureSurface();
        this.setupIframeMessageBridge();
        this.startSyncPoller(roomCode);

        if (this.userRole === 'teacher' && this.simIframe) {
            this.hookTeacherSimulator(this.simIframe);
        }

        if (details.active_poll) {
            this.renderPollUI(details.active_poll, details.poll_votes || {});
        }
    }

    // =========================================================================
    // GOOGLE MEET VIDEO & SCREEN BROADCAST ENGINE (Full HD 60fps WebRTC)
    // =========================================================================

    async toggleScreenBroadcast() {
        if (this.isStreaming) {
            this.stopScreenBroadcast();
        } else {
            await this.startScreenBroadcast();
        }
    }

    async startScreenBroadcast() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: "browser",
                    frameRate: { ideal: 30, max: 30 },
                    width: { ideal: 1280, max: 1280 },
                    height: { ideal: 720, max: 720 },
                    cursor: "always"
                },
                audio: false
            });

            this.localStream = stream;
            this.isStreaming = true;

            // Handle when teacher stops sharing via browser bar
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.onended = () => {
                    this.stopScreenBroadcast();
                };
            }

            // Notify classroom via WebSocket
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: "stream_started",
                    stream_type: "screen",
                    has_audio: false
                }));
            }

            this.updateTeacherStreamUI(true);
            this.startFallbackFrameCapture();
            this.showToast("اشتراک زنده صفحه و آزمایشگاه آغاز شد! همه دانش‌آموزان به صورت زنده تصویر شما را مشاهده می‌کنند.");
        } catch (err) {
            console.error("Screen share error:", err);
            if (err.name !== "NotAllowedError") {
                this.showToast("خطا در آغاز اشتراک تصویر: " + err.message);
            }
        }
    }

    stopScreenBroadcast() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(t => t.stop());
            this.localStream = null;
        }
        if (this.fallbackTimer) {
            clearInterval(this.fallbackTimer);
            this.fallbackTimer = null;
        }

        // Close all peer connections
        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();

        this.isStreaming = false;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: "stream_stopped" }));
        }

        this.updateTeacherStreamUI(false);
        this.showToast("پخش زنده متوقف شد.");
    }

    updateTeacherStreamUI(active) {
        const btn = document.getElementById('btn-main-stream');
        const txt = document.getElementById('main-stream-btn-text');
        const indicator = document.getElementById('teacher-stream-indicator');
        if (btn && txt) {
            if (active) {
                btn.className = "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all animate-pulse";
                txt.textContent = "⏹️ توقف اشتراک تصویر";
            } else {
                btn.className = "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all";
                txt.textContent = "🖥️ شروع اشتراک زنده آزمایشگاه (Meet)";
            }
        }
        if (indicator) {
            indicator.textContent = active ? "پخش زنده ۶۰ فریم فعال است" : "آماده اشتراک تصویر";
        }
        if (window.lucide) window.lucide.createIcons();
    }

    // Audio / Microphone: disabled per institutional request (Voice is not needed)
    async toggleMicrophone() {
        return;
    }

    updateMicUI(active) {
        return;
    }

    // WebRTC: Teacher handling student connection request
    async handleStudentStreamRequest(studentSessionId, studentName) {
        if (!this.localStream) return;
        // Limit P2P WebRTC mesh connections to at most 3 peers to avoid freezing the teacher's browser with 150 concurrent viewers
        // All 150+ students receive real-time updates via WebSocket canvas mirror + synchronized local 60 FPS simulator iframe!
        if (this.peerConnections.size >= 3) {
            return;
        }
        try {
            if (this.peerConnections.has(studentSessionId)) {
                this.peerConnections.get(studentSessionId).close();
            }

            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            });

            this.peerConnections.set(studentSessionId, pc);

            // Add all video & audio tracks
            this.localStream.getTracks().forEach(track => {
                pc.addTrack(track, this.localStream);
            });

            // ICE Candidate dispatch
            pc.onicecandidate = (event) => {
                if (event.candidate && this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: "webrtc_ice",
                        candidate: event.candidate,
                        target_session_id: studentSessionId
                    }));
                }
            };

            const offer = await pc.createOffer({
                offerToReceiveVideo: false,
                offerToReceiveAudio: false
            });
            await pc.setLocalDescription(offer);

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: "webrtc_offer",
                    offer: offer,
                    target_session_id: studentSessionId
                }));
            }
        } catch (err) {
            console.error("WebRTC offer creation error:", err);
        }
    }

    // WebRTC: Student handling teacher offer
    async handleWebRTCOffer(offer, teacherSessionId) {
        try {
            if (this.studentPeerConnection) {
                this.studentPeerConnection.close();
            }

            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            });
            this.studentPeerConnection = pc;

            pc.ontrack = (event) => {
                const videoEl = document.getElementById('live-meet-video');
                if (videoEl && event.streams && event.streams[0]) {
                    videoEl.srcObject = event.streams[0];
                    videoEl.muted = true;
                    videoEl.play().catch(() => {});
                    this.showVideoScreen(true);
                }
            };

            pc.onicecandidate = (event) => {
                if (event.candidate && this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: "webrtc_ice",
                        candidate: event.candidate,
                        target_session_id: teacherSessionId
                    }));
                }
            };

            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: "webrtc_answer",
                    answer: answer,
                    target_session_id: teacherSessionId
                }));
            }
        } catch (err) {
            console.error("WebRTC student answer error:", err);
        }
    }

    // WebRTC: Teacher handling student answer
    async handleWebRTCAnswer(answer, studentSessionId) {
        const pc = this.peerConnections.get(studentSessionId);
        if (pc) {
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (err) {
                console.error("WebRTC remote description error:", err);
            }
        }
    }

    // WebRTC: Handling ICE Candidate
    async handleICECandidate(candidate, senderSessionId) {
        const pc = this.userRole === 'teacher' 
            ? this.peerConnections.get(senderSessionId) 
            : this.studentPeerConnection;
        if (pc && candidate) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.warn("Could not add ICE candidate:", e);
            }
        }
    }

    requestStreamFromTeacher() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: "request_stream" }));
        }
    }

    unmuteVideo() {
        // Voice is not required
    }

    showVideoScreen(hasStream) {
        const video = document.getElementById('live-meet-video');
        const canvas = document.getElementById('live-auto-mirror-canvas');
        const lounge = document.getElementById('stream-waiting-lounge');
        const badge = document.getElementById('student-stream-badge');
        const badgeText = document.getElementById('student-stream-badge-text');

        if (this.activeViewMode === 'stream') {
            if (hasStream) {
                if (lounge) lounge.classList.add('hidden');
                if (video && video.srcObject) {
                    video.classList.remove('hidden');
                    if (canvas) canvas.classList.add('hidden');
                } else if (canvas) {
                    canvas.classList.remove('hidden');
                    if (video) video.classList.add('hidden');
                }
            } else {
                if (lounge) lounge.classList.remove('hidden');
                if (video) video.classList.add('hidden');
                if (canvas) canvas.classList.add('hidden');
            }
        }

        if (badge && badgeText) {
            if (hasStream) {
                badge.className = "px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold text-xs flex items-center gap-1.5";
                badgeText.textContent = "🔴 در حال تماشای زنده تدریس دبیر";
            } else {
                badge.className = "px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5";
                badgeText.textContent = "⚪ در انتظار اشتراک تصویر دبیر";
            }
        }
    }

    // Ultra-reliable Canvas Snapshot Fallback (Medium Quality 480p, Ultra-Fast Delivery)
    startFallbackFrameCapture() {
        if (this.fallbackTimer) clearInterval(this.fallbackTimer);
        const hiddenVideo = document.createElement('video');
        hiddenVideo.srcObject = this.localStream;
        hiddenVideo.muted = true;
        hiddenVideo.play().catch(() => {});

        const canvas = document.createElement('canvas');
        canvas.width = 854;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');

        this.fallbackTimer = setInterval(() => {
            if (!this.isStreaming || !this.localStream) {
                clearInterval(this.fallbackTimer);
                return;
            }
            try {
                if (hiddenVideo.readyState >= 2) {
                    ctx.drawImage(hiddenVideo, 0, 0, 854, 480);
                    const frame = canvas.toDataURL('image/jpeg', 0.45);
                    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                        this.socket.send(JSON.stringify({
                            type: "stream_frame",
                            frame: frame
                        }));
                    }
                }
            } catch (e) {}
        }, 250); // 4.0 FPS (Instant lightweight delivery under all network conditions)
    }

    renderFallbackFrame(frameData) {
        if (!frameData) return;
        const lounge = document.getElementById('stream-waiting-lounge');
        if (lounge) lounge.classList.add('hidden');

        const video = document.getElementById('live-meet-video');
        if (video && !video.srcObject) {
            video.classList.add('hidden');
        }

        // Render to live-auto-mirror-canvas or fallbackCanvas
        let canvas = document.getElementById('live-auto-mirror-canvas') || document.getElementById('live-fallback-canvas');
        if (!canvas) {
            const viewport = document.getElementById('student-stream-viewport');
            if (viewport) {
                canvas = document.createElement('canvas');
                canvas.id = 'live-auto-mirror-canvas';
                canvas.className = "w-full h-full object-contain bg-slate-900 rounded-2xl shadow-inner";
                const laser = document.getElementById('live-laser-canvas');
                if (laser && laser.parentNode) {
                    laser.parentNode.insertBefore(canvas, laser);
                } else {
                    viewport.appendChild(canvas);
                }
            }
        }

        if (canvas && this.activeViewMode === 'stream') {
            canvas.classList.remove('hidden');
            if (!this._mirrorImg) {
                this._mirrorImg = new Image();
            }
            this._mirrorImg.onload = () => {
                if (canvas.width !== this._mirrorImg.width || canvas.height !== this._mirrorImg.height) {
                    canvas.width = this._mirrorImg.width;
                    canvas.height = this._mirrorImg.height;
                }
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this._mirrorImg, 0, 0);
            };
            this._mirrorImg.src = frameData;

            // Update student status badge
            const badge = document.getElementById('student-stream-badge');
            const badgeText = document.getElementById('student-stream-badge-text');
            if (badge && badgeText) {
                badge.className = "px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center gap-1.5";
                badgeText.textContent = "🔴 پخش زنده لحظه‌ای آزمایشگاه دبیر (فعال)";
            }
        }
    }

    // Student View Mode Toggle (Stream vs Solo)
    setStudentViewMode(mode) {
        if (this.isStudentLocked && mode === 'solo') {
            this.showToast("آزمایشگاه توسط دبیر قفل است. لطفاً تدریس زنده را دنبال کنید.");
            return;
        }

        this.activeViewMode = mode;
        const btnStream = document.getElementById('mode-btn-stream');
        const btnSolo = document.getElementById('mode-btn-solo');
        const video = document.getElementById('live-meet-video');
        const fallback = document.getElementById('live-fallback-canvas');
        const lounge = document.getElementById('stream-waiting-lounge');
        const iframe = document.getElementById('live-sim-iframe');

        if (btnStream && btnSolo) {
            if (mode === 'stream') {
                btnStream.className = "px-2.5 py-1 rounded-lg bg-blue-600 text-white shadow-sm";
                btnSolo.className = "px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
                if (iframe) iframe.classList.add('hidden');
                if (this.isStreaming) {
                    if (video) video.classList.remove('hidden');
                    if (lounge) lounge.classList.add('hidden');
                } else {
                    if (video) video.classList.add('hidden');
                    if (fallback) fallback.classList.add('hidden');
                    if (lounge) lounge.classList.remove('hidden');
                }
            } else {
                btnSolo.className = "px-2.5 py-1 rounded-lg bg-blue-600 text-white shadow-sm";
                btnStream.className = "px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
                if (video) video.classList.add('hidden');
                if (fallback) fallback.classList.add('hidden');
                if (lounge) lounge.classList.add('hidden');
                if (iframe) iframe.classList.remove('hidden');
            }
        }
    }

    // Local WebM Video Recording
    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        if (!this.localStream) {
            this.showToast("لطفاً ابتدا اشتراک تصویر آزمایشگاه را فعال نمایید.");
            return;
        }

        try {
            this.recordedChunks = [];
            this.mediaRecorder = new MediaRecorder(this.localStream, { mimeType: 'video/webm;codecs=vp9' });
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.recordedChunks.push(e.data);
            };
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `SAMPAD-Physics-Lab-${Date.now()}.webm`;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast("ویدیوی ضبط‌شده آزمایشگاه آماده و دانلود شد!");
            };
            this.mediaRecorder.start(1000);
            this.isRecording = true;

            const recBtn = document.getElementById('btn-stage-record');
            const recTxt = document.getElementById('record-text');
            if (recBtn && recTxt) {
                recBtn.className = "px-2.5 py-1 rounded-lg bg-rose-600 text-white animate-pulse font-bold text-[11px] flex items-center gap-1";
                recTxt.textContent = "توقف ضبط";
            }
            this.showToast("ضبط ویدیویی جلسه تدریس آغاز شد.");
        } catch (err) {
            console.error("Recording error:", err);
            this.showToast("امکان ضبط در این مرورگر وجود ندارد.");
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            const recBtn = document.getElementById('btn-stage-record');
            const recTxt = document.getElementById('record-text');
            if (recBtn && recTxt) {
                recBtn.className = "px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1";
                recTxt.textContent = "ضبط ویدیو";
            }
        }
    }

    toggleFullscreen() {
        const stage = document.getElementById('live-stage-wrapper');
        if (!stage) return;
        if (!document.fullscreenElement) {
            stage.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }

    // =========================================================================
    // 28 LABORATORIES SWITCHER ENGINE (Fast Switching Across All Experiments)
    // =========================================================================

    openSimSwitcherModal() {
        const m = document.getElementById('live-sim-switcher-modal');
        if (m) m.classList.remove('hidden');
    }

    closeSimSwitcherModal() {
        const m = document.getElementById('live-sim-switcher-modal');
        if (m) m.classList.add('hidden');
    }

    filterSwitcherLabs(query) {
        const q = (query || '').toLowerCase().trim();
        document.querySelectorAll('.switcher-lab-card').forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const topic = (card.getAttribute('data-topic') || '').toLowerCase();
            if (!q || title.includes(q) || topic.includes(q)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    filterSwitcherGrade(grade) {
        document.querySelectorAll('.switch-grade-tab').forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('text-slate-600', 'dark:text-slate-400');
        });
        const activeBtn = document.getElementById(`switch-tab-${grade}`);
        if (activeBtn) {
            activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
            activeBtn.classList.add('bg-blue-600', 'text-white');
        }

        document.querySelectorAll('.switcher-lab-card').forEach(card => {
            const cardGrade = parseInt(card.getAttribute('data-grade'));
            if (grade === 0 || cardGrade === grade) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    async changeSimulator(newSimId) {
        const lab = getLabInfo(newSimId);
        this.closeSimSwitcherModal();

        // 1. Send to server via WebSocket
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: "change_simulator",
                sim_id: newSimId,
                sim_title: lab.title
            }));
        }

        // 2. Also persist via REST endpoint
        if (this.currentRoom) {
            fetch(`/api/live-lab/rooms/${this.currentRoom}/change-simulator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sim_id: newSimId, sim_title: lab.title })
            }).catch(() => {});
        }

        // 3. Update local display immediately
        this.switchSimulatorLocally(newSimId, lab.title);
        this.showToast(`آزمایشگاه به «${lab.title}» تغییر یافت.`);
    }

    switchSimulatorLocally(newSimId, newSimTitle) {
        this.currentSimId = newSimId;
        const lab = getLabInfo(newSimId);

        // Update iframe if exists
        const iframe = document.getElementById('live-sim-iframe');
        if (iframe) {
            iframe.src = getLabUrl(newSimId, this.userRole);
            if (this.userRole === 'teacher') {
                setTimeout(() => this.hookTeacherSimulator(iframe), 400);
            }
        }

        // Update header & educational cards
        const headerName = document.getElementById('room-active-lab-name');
        if (headerName) headerName.textContent = lab.title;

        const gradeEl = document.getElementById('edu-lab-grade');
        if (gradeEl) gradeEl.textContent = lab.gradeLabel;

        const titleEl = document.getElementById('edu-lab-title');
        if (titleEl) titleEl.textContent = lab.title;

        const topicEl = document.getElementById('edu-lab-topic');
        if (topicEl) topicEl.textContent = lab.topic;

        const goalsEl = document.getElementById('edu-lab-goals');
        if (goalsEl) goalsEl.textContent = lab.goals;

        const miscEl = document.getElementById('edu-lab-misconception');
        if (miscEl) miscEl.textContent = lab.misconception;

        const formulaEl = document.getElementById('edu-lab-formula');
        if (formulaEl) {
            formulaEl.innerHTML = `$$${lab.formula}$$`;
            if (window.renderScientificFormulas) {
                setTimeout(window.renderScientificFormulas, 40);
            }
        }
    }

    // =========================================================================
    // STUDENT INTERACTION LOCK & TEACHER CONTROLS
    // =========================================================================

    toggleStudentLock() {
        const nextState = !this.isStudentLocked;
        this.isStudentLocked = nextState;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: "toggle_lock",
                is_locked: nextState
            }));
        }

        if (this.currentRoom) {
            fetch(`/api/live-lab/rooms/${this.currentRoom}/toggle-lock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_locked: nextState })
            }).catch(() => {});
        }

        this.applyStudentLockUI(nextState);
        this.showToast(nextState ? "آزمایشگاه برای دانش‌آموزان قفل شد (تصویر زنده اجباری)." : "اجازه آزمایش آزاد به دانش‌آموزان داده شد.");
    }

    applyStudentLockUI(isLocked) {
        this.isStudentLocked = isLocked;
        const btn = document.getElementById('btn-toggle-student-lock');
        const txt = document.getElementById('btn-lock-text');
        if (btn && txt) {
            if (isLocked) {
                btn.className = "px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-[11px] flex items-center gap-1";
                txt.textContent = "قفل کلاس: فعال";
            } else {
                btn.className = "px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-[11px] flex items-center gap-1";
                txt.textContent = "آزمایش آزاد";
            }
        }

        const modeGroup = document.getElementById('student-view-mode-group');
        if (modeGroup && this.userRole === 'student') {
            if (isLocked) {
                modeGroup.classList.add('opacity-60', 'pointer-events-none');
                this.setStudentViewMode('stream');
            } else {
                modeGroup.classList.remove('opacity-60', 'pointer-events-none');
            }
        }
    }

    // Laser Pointer Mode
    toggleLaserMode() {
        this.isLaserActive = !this.isLaserActive;
        const btn = document.getElementById('btn-toggle-laser');
        const txt = document.getElementById('btn-laser-text');
        if (btn && txt) {
            if (this.isLaserActive) {
                btn.className = "px-2.5 py-1 rounded-lg bg-rose-500 ring-2 ring-rose-300 font-bold text-[11px] flex items-center gap-1";
                txt.textContent = "🔴 لیزر فعال است";
                this.showToast("نشانگر لیزری فعال شد. موس خود را روی شبیه‌ساز حرکت دهید.");
            } else {
                btn.className = "px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-[11px] flex items-center gap-1";
                txt.textContent = "🔦 لیزر تدریس";
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({ type: "laser_pointer", active: false }));
                }
            }
        }
    }

    setupLaserCaptureSurface() {
        const stage = document.getElementById('live-stage-wrapper');
        const canvas = document.getElementById('live-laser-canvas');
        if (!stage || !canvas) return;

        const resizeCanvas = () => {
            canvas.width = stage.clientWidth;
            canvas.height = stage.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        if (this.userRole === 'teacher') {
            stage.addEventListener('mousemove', (e) => {
                if (!this.isLaserActive) return;
                const rect = stage.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                this.renderLaserDot(x, y);

                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    const now = Date.now();
                    if (now - this.lastSyncTime > 40) {
                        this.lastSyncTime = now;
                        this.socket.send(JSON.stringify({
                            type: "laser_pointer",
                            x: x,
                            y: y,
                            active: true
                        }));
                    }
                }
            });

            stage.addEventListener('mouseleave', () => {
                if (this.isLaserActive && this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({ type: "laser_pointer", active: false }));
                }
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }

    renderLaserDot(nx, ny) {
        const canvas = document.getElementById('live-laser-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const x = nx * canvas.width;
        const y = ny * canvas.height;

        // Outer glow
        const grad = ctx.createRadialGradient(x, y, 2, x, y, 28);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
        grad.addColorStop(0.4, 'rgba(239, 68, 68, 0.5)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fill();

        // Sharp bright center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Modal helpers
    openShareModal() {
        const m = document.getElementById('live-share-modal');
        if (m) m.classList.remove('hidden');
    }

    closeShareModal() {
        const m = document.getElementById('live-share-modal');
        if (m) m.classList.add('hidden');
    }

    copyShareUrl() {
        const inp = document.getElementById('share-url-input');
        if (inp) {
            inp.select();
            navigator.clipboard.writeText(inp.value).then(() => {
                this.showToast("نشانی کلاس کپی شد!");
            });
        }
    }

    showToast(message) {
        if (window.appToast) {
            window.appToast.success(message);
        } else {
            console.log("[LIVE LAB]", message);
        }
    }

    cleanupSession() {
        if (this.socket) {
            this.socket.close();
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
        if (this.fallbackTimer) {
            clearInterval(this.fallbackTimer);
            this.fallbackTimer = null;
        }
        if (this.localStream) {
            this.localStream.getTracks().forEach(t => t.stop());
            this.localStream = null;
        }
        if (this.micStream) {
            this.micStream.getAudioTracks().forEach(t => t.stop());
            this.micStream = null;
        }
        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();
        if (this.studentPeerConnection) {
            this.studentPeerConnection.close();
            this.studentPeerConnection = null;
        }
    }

    // =========================================================================
    // WEBSOCKET REAL-TIME COMMUNICATIONS
    // =========================================================================

    connectWebSocket(roomCode) {
        if (this.socket) {
            this.socket.close();
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/live-lab/ws/${roomCode}?role=${this.userRole}&name=${encodeURIComponent(this.userName)}`;

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log(`[LIVE LAB WS] Connected to room ${roomCode}`);
            // Heartbeat ping every 10 seconds
            this.pingTimer = setInterval(() => {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({ type: "ping" }));
                }
            }, 10000);
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleIncomingSocketMessage(data);
            } catch (err) {
                console.warn("[LIVE LAB WS] Parse error:", err);
            }
        };

        this.socket.onclose = () => {
            console.log("[LIVE LAB WS] Disconnected.");
        };
    }

    setupIframeMessageBridge() {
        window.addEventListener('message', (event) => {
            const msg = event.data;
            if (!msg || typeof msg !== 'object') return;

            if (msg.type === 'TEACHER_SIM_STATE_UPDATE' && this.userRole === 'teacher') {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: "state_update",
                        payload: msg.payload || {}
                    }));
                }
            }

            if (msg.type === 'TEACHER_LASER_MOVE' && this.userRole === 'teacher') {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: "laser_pointer",
                        x: msg.x,
                        y: msg.y,
                        active: true
                    }));
                }
            }
        });
    }

    hookTeacherSimulator(iframe) {
        if (!iframe) return;
        try {
            const attachListeners = () => {
                try {
                    const iDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (!iDoc) return;
                    const relayAction = (type, e) => {
                        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
                        const rect = iframe.getBoundingClientRect();
                        const x = rect.width ? (e.clientX - rect.left) / rect.width : 0;
                        const y = rect.height ? (e.clientY - rect.top) / rect.height : 0;
                        this.socket.send(JSON.stringify({
                            type: 'sim_interaction',
                            action: type,
                            x: Math.max(0, Math.min(1, x)),
                            y: Math.max(0, Math.min(1, y)),
                            timestamp: Date.now()
                        }));
                    };
                    iDoc.addEventListener('pointerdown', (e) => relayAction('down', e), { passive: true });
                    iDoc.addEventListener('pointerup', (e) => relayAction('up', e), { passive: true });
                } catch (e) {
                    // Sandboxed or cross-origin PhET frame handled via canvas mirror or postMessage
                }
            };

            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                attachListeners();
            } else {
                iframe.addEventListener('load', attachListeners);
            }
        } catch (e) {
            console.debug('hookTeacherSimulator notice:', e);
        }
    }

    handleSimInteraction(data) {
        if (!data) return;
        if (data.x !== undefined && data.y !== undefined) {
            this.renderLaserDot(data.x, data.y);
        }
        const iframe = document.getElementById('live-sim-iframe');
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage({
                    type: 'SIM_REMOTE_ACTION',
                    payload: data
                }, '*');
            } catch (e) {}
        }
    }

    startSyncPoller(roomCode) {
        if (this.syncPoller) clearInterval(this.syncPoller);
        this.syncPoller = setInterval(async () => {
            if (!this.currentRoom) return;
            try {
                const res = await fetch(`/api/live-lab/rooms/${roomCode}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.sim_id && data.sim_id !== this.currentSimId) {
                        this.switchSimulatorLocally(data.sim_id, data.sim_title);
                    }
                    if (data.is_locked !== undefined && data.is_locked !== this.isStudentLocked) {
                        this.applyStudentLockUI(data.is_locked);
                    }
                    if (data.is_streaming !== undefined && data.is_streaming !== this.isStreaming) {
                        this.isStreaming = Boolean(data.is_streaming);
                        if (this.userRole === 'student') {
                            this.showVideoScreen(this.isStreaming);
                            if (this.isStreaming) this.requestStreamFromTeacher();
                        }
                    }
                    const badge = document.getElementById('header-viewers-count');
                    if (badge && data.viewers_count !== undefined) {
                        badge.textContent = data.viewers_count;
                    }
                }
            } catch (e) {}
        }, 5000);
    }

    handleIncomingSocketMessage(data) {
        const type = data.type;

        if (type === 'welcome') {
            this.sessionId = data.session_id;
            this.isStreaming = Boolean(data.is_streaming);
            if (data.initial_frame && this.userRole === 'student') {
                this.renderFallbackFrame(data.initial_frame);
            }

            if (data.sim_id && data.sim_id !== this.currentSimId) {
                this.switchSimulatorLocally(data.sim_id, data.sim_title);
            }
            if (data.is_locked !== undefined) {
                this.applyStudentLockUI(data.is_locked);
            }
            if (data.active_poll) {
                this.renderPollUI(data.active_poll, data.poll_votes || {});
            }

            // If student joined and teacher is streaming, request feed immediately
            if (this.userRole === 'student' && this.isStreaming) {
                this.showVideoScreen(true);
                this.requestStreamFromTeacher();
            }
        }

        // Live Meet Stream Events
        else if (type === 'stream_started') {
            this.isStreaming = true;
            if (this.userRole === 'student') {
                this.showVideoScreen(true);
                this.requestStreamFromTeacher();
                this.showToast("دبیر پخش زنده آزمایشگاه را آغاز کرد!");
            }
        }

        else if (type === 'stream_stopped') {
            this.isStreaming = false;
            if (this.userRole === 'student') {
                this.showVideoScreen(false);
                if (this.studentPeerConnection) {
                    this.studentPeerConnection.close();
                    this.studentPeerConnection = null;
                }
                this.showToast("پخش زنده پایان یافت.");
            }
        }

        else if (type === 'request_stream' && this.userRole === 'teacher') {
            this.handleStudentStreamRequest(data.student_session_id, data.student_name);
        }

        else if (type === 'webrtc_offer' && this.userRole === 'student') {
            this.handleWebRTCOffer(data.offer, data.sender_session_id);
        }

        else if (type === 'webrtc_answer' && this.userRole === 'teacher') {
            this.handleWebRTCAnswer(data.answer, data.sender_session_id);
        }

        else if (type === 'webrtc_ice') {
            this.handleICECandidate(data.candidate, data.sender_session_id);
        }

        else if (type === 'stream_frame' && this.userRole === 'student') {
            this.renderFallbackFrame(data.frame);
        }

        else if (type === 'sim_interaction' && this.userRole === 'student') {
            this.handleSimInteraction(data);
        }

        else if (type === 'simulator_changed') {
            this.switchSimulatorLocally(data.sim_id, data.sim_title);
        }

        else if (type === 'lock_toggled') {
            this.applyStudentLockUI(data.is_locked);
        }

        else if (type === 'user_joined' || type === 'user_left' || type === 'pong') {
            if (data.viewers_count !== undefined) {
                const badge = document.getElementById('header-viewers-count');
                if (badge) badge.textContent = data.viewers_count;
                const loungeCnt = document.getElementById('lounge-viewers-count');
                if (loungeCnt) loungeCnt.textContent = data.viewers_count;
            }
            if (type === 'user_joined' && data.name) {
                this.appendChatMessage({ sender: 'سیستم', role: 'system', message: `${data.name} وارد کلاس شد.` });
            }
        }

        else if (type === 'laser_pointer') {
            if (data.active === false) {
                const canvas = document.getElementById('live-laser-canvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            } else {
                this.renderLaserDot(data.x, data.y);
            }
        }

        else if (type === 'teacher_note_added') {
            const notesList = document.getElementById('teacher-notes-list');
            if (notesList && data.note) {
                const p = notesList.querySelector('p');
                if (p) p.remove();
                const div = document.createElement('div');
                div.className = "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed text-[11px] animate-fadeIn";
                div.textContent = data.note;
                notesList.prepend(div);
            }
        }

        else if (type === 'notes_cleared') {
            const notesList = document.getElementById('teacher-notes-list');
            if (notesList) {
                notesList.innerHTML = '<p class="text-[11px] text-slate-400 text-center py-3">یادداشتی ثبت نشده است.</p>';
            }
        }

        else if (type === 'poll_started') {
            this.votedPollIndex = null;
            this.renderPollUI({ question: data.question, options: data.options }, data.votes || {});
        }

        else if (type === 'poll_update') {
            this.updatePollBars(data.votes, data.total);
        }

        else if (type === 'student_raised_hand') {
            this.appendChatMessage({
                sender: data.sender,
                role: 'hand',
                message: '✋ دست خود را برای پرسش علمی بالا برد.'
            });
            if (this.userRole === 'teacher') {
                this.showToast(`✋ ${data.sender} اجازه صحبت خواست.`);
            }
        }

        else if (type === 'chat_message') {
            this.appendChatMessage(data);
        }
    }

    // Classroom Polls
    renderPollUI(pollData, votes) {
        const card = document.getElementById('live-poll-card');
        const qEl = document.getElementById('live-poll-question');
        const optsContainer = document.getElementById('live-poll-options');
        const totalEl = document.getElementById('live-poll-total');

        if (!card || !qEl || !optsContainer) return;
        card.classList.remove('hidden');
        qEl.textContent = pollData.question;

        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
        if (totalEl) totalEl.textContent = `${totalVotes} پاسخ`;

        optsContainer.innerHTML = pollData.options.map((opt, idx) => {
            const voteCount = votes[idx] || 0;
            const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
            const isVoted = this.votedPollIndex === idx;

            return `
            <button onclick="window.liveLab.submitVote(${idx})" 
                class="w-full relative overflow-hidden p-2.5 rounded-xl border ${isVoted ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-100/50 dark:bg-amber-950/60' : 'border-amber-200 dark:border-amber-900/80 bg-white dark:bg-slate-900 hover:bg-amber-50/50'} text-right transition-all flex items-center justify-between text-xs font-bold">
                <div class="absolute inset-y-0 right-0 bg-amber-400/20 dark:bg-amber-500/20 pointer-events-none transition-all duration-500" style="width: ${pct}%"></div>
                <span class="relative z-10 text-slate-800 dark:text-slate-100 truncate">${opt}</span>
                <span class="relative z-10 text-[10px] font-mono text-amber-700 dark:text-amber-300 mr-2">${pct}٪ (${voteCount})</span>
            </button>
            `;
        }).join('');
    }

    updatePollBars(votes, total) {
        const totalEl = document.getElementById('live-poll-total');
        if (totalEl) totalEl.textContent = `${total} پاسخ`;
        const buttons = document.querySelectorAll('#live-poll-options button');
        buttons.forEach((btn, idx) => {
            const count = votes[idx] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const bar = btn.querySelector('.pointer-events-none');
            const pctSpan = btn.querySelectorAll('span')[1];
            if (bar) bar.style.width = `${pct}%`;
            if (pctSpan) pctSpan.textContent = `${pct}٪ (${count})`;
        });
    }

    submitVote(optionIdx) {
        this.votedPollIndex = optionIdx;
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: "poll_vote",
                option_index: optionIdx
            }));
        }
        if (this.currentRoom) {
            fetch(`/api/live-lab/rooms/${this.currentRoom}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ option_index: optionIdx })
            }).catch(() => {});
        }
    }

    sendRaiseHand() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: "raise_hand" }));
            this.showToast("دست شما بالا برده شد.");
        }
    }

    appendChatMessage(data) {
        const chatContainer = document.getElementById('live-chat-messages');
        if (!chatContainer) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = "p-2 rounded-xl text-xs space-y-0.5 " + 
            (data.role === 'teacher' ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800' :
             data.role === 'system' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 text-center text-[10px]' :
             data.role === 'hand' ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200' :
             'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800');

        if (data.role !== 'system') {
            msgDiv.innerHTML = `
            <div class="flex items-center justify-between font-bold text-[10px]">
                <span class="${data.role === 'teacher' ? 'text-blue-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}">${data.sender}</span>
                <span class="text-slate-400 font-mono">${data.time || ''}</span>
            </div>
            <p class="text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed">${data.message}</p>
            `;
        } else {
            msgDiv.textContent = data.message;
        }

        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    sendChatMessage() {
        const inp = document.getElementById('live-chat-input');
        const text = inp ? inp.value.trim() : '';
        if (text) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: "chat_message",
                    message: text
                }));
            }
            inp.value = '';
        }
    }

    promptAddTeacherNote() {
        const note = prompt("نکته یا معادله تخته را وارد نمایید:");
        if (note && note.trim()) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: "teacher_note",
                    note: note.trim()
                }));
            }
        }
    }

    clearTeacherNotes() {
        if (confirm("آیا از پاک کردن تمامی یادداشت‌های تخته اطمینان دارید؟")) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: "clear_notes" }));
            }
        }
    }

    promptStartPoll() {
        const q = prompt("صورت سوال کوییز مفهومی را وارد نمایید:");
        if (!q || !q.trim()) return;
        const opt1 = prompt("گزینه ۱:");
        const opt2 = prompt("گزینه ۲:");
        const opt3 = prompt("گزینه ۳ (اختیاری):");
        const opt4 = prompt("گزینه ۴ (اختیاری):");

        const options = [opt1, opt2, opt3, opt4].filter(o => o && o.trim());
        if (options.length >= 2) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: "start_poll",
                    question: q.trim(),
                    options: options
                }));
            }
        } else {
            alert("حداقل دو گزینه برای نظرسنجی الزامی است.");
        }
    }
}

window.liveLab = new LiveLabComponent();
