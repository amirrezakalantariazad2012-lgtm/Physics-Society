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

function getLabUrl(simId, role = 'student') {
    const info = getLabInfo(simId);
    const buster = Date.now();
    return `/simulators/phet/${info.file}?v=${buster}&live=1&role=${role}`;
}

class LiveLabComponent {
    constructor() {
        this.currentRoom = null;
        this.socket = null;
        this.userRole = 'student'; // 'teacher' or 'student'
        this.userName = 'دانش‌آموز';
        this.currentSimId = 'motion-1d';
        this.isStudentLocked = true;
        this.isLaserActive = false;
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
                        <span>پخش زنده و همگام ۲۸ آزمایشگاه فیزیک سمپاد (Live Physics Classroom)</span>
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
                        آزمایشگاه زنده دبیر و کلاس‌های تعاملی برخط فیزیک
                    </h1>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                        دبیران گرامی با یک کلیک می‌توانند بین ۲۸ آزمایشگاه تعاملی سوئیچ کرده، دستگاه‌های آزمایشگاهی را به طور زنده کنترل کنند، با لیزر پوینتر مفاهیم را تدریس نمایند و کوییزهای برخط مفهومی برگزار کنند.
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
                    ${rooms.map(r => {
                        const lab = getLabInfo(r.sim_id);
                        return `
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
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">نام دبیر / ارائه‌دهنده:</label>
                            <input id="create-room-teacher" type="text" value="${this.userName}" 
                                class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">جستجوی سریع آزمایشگاه (از بین ۲۸ آزمایشگاه):</label>
                            <input id="create-room-search" type="text" placeholder="مثال: کولن، اسکیت، فشار، مدار..." 
                                oninput="window.liveLab.filterCreateLabs(this.value)"
                                class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                        </div>
                    </div>

                    <!-- Grade Filter Tabs -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label class="font-bold text-slate-700 dark:text-slate-300">انتخاب آزمایشگاه پایه:</label>
                            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px]">
                                <button onclick="window.liveLab.filterGradeTab(0)" id="grade-tab-0" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold bg-white dark:bg-slate-700 text-blue-600 dark:text-sky-300 shadow-sm">همه (۲۸)</button>
                                <button onclick="window.liveLab.filterGradeTab(7)" id="grade-tab-7" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold text-slate-600 dark:text-slate-400">پایه هفتم (۵)</button>
                                <button onclick="window.liveLab.filterGradeTab(8)" id="grade-tab-8" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold text-slate-600 dark:text-slate-400">پایه هشتم (۸)</button>
                                <button onclick="window.liveLab.filterGradeTab(9)" id="grade-tab-9" class="grade-filter-btn px-2.5 py-1 rounded-lg font-bold text-slate-600 dark:text-slate-400">پایه نهم (۱۵)</button>
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
                            <span>ایجاد و شروع پخش زنده</span>
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
            card.classList.remove('border-slate-200', 'dark:border-slate-800');
        }
        const hiddenInp = document.getElementById('selected-create-sim-id');
        if (hiddenInp) hiddenInp.value = simId;
        const info = getLabInfo(simId);
        const preview = document.getElementById('selected-lab-preview-name');
        if (preview) {
            preview.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i><span>انتخاب شده: ${info.title}</span>`;
            if (window.lucide) window.lucide.createIcons();
        }
    }

    filterGradeTab(grade) {
        document.querySelectorAll('.grade-filter-btn').forEach(btn => {
            btn.classList.remove('bg-white', 'dark:bg-slate-700', 'text-blue-600', 'dark:text-sky-300', 'shadow-sm');
            btn.classList.add('text-slate-600', 'dark:text-slate-400');
        });
        const activeBtn = document.getElementById(`grade-tab-${grade}`);
        if (activeBtn) {
            activeBtn.classList.add('bg-white', 'dark:bg-slate-700', 'text-blue-600', 'dark:text-sky-300', 'shadow-sm');
            activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
        }
        document.querySelectorAll('.create-lab-card').forEach(card => {
            const cardGrade = Number(card.getAttribute('data-grade'));
            if (grade === 0 || cardGrade === grade) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    filterCreateLabs(query) {
        const q = (query || '').trim().toLowerCase();
        document.querySelectorAll('.create-lab-card').forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            if (!q || title.includes(q)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    async submitCreateRoom() {
        const title = document.getElementById('create-room-title')?.value?.trim();
        const simId = document.getElementById('selected-create-sim-id')?.value || 'motion-1d';
        const teacher = document.getElementById('create-room-teacher')?.value?.trim() || this.userName;
        const labInfo = getLabInfo(simId);

        if (!title) {
            alert('لطفاً عنوان و موضوع جلسه آزمایش را وارد فرمایید.');
            return;
        }

        try {
            const res = await fetch('/api/live-lab/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    sim_id: simId, 
                    sim_title: labInfo.title,
                    teacher_name: teacher, 
                    grade: labInfo.grade 
                })
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
        this.currentSimId = details.sim_id || 'motion-1d';
        this.isStudentLocked = (details.is_locked !== undefined) ? details.is_locked : true;
        this.isLaserActive = false;
        this.lastSyncTime = Date.now() / 1000;
        this.votedPollIndex = null;

        const currentLab = getLabInfo(this.currentSimId);
        const iframeSrc = getLabUrl(this.currentSimId, this.userRole);

        container.innerHTML = `
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5 font-sans">
            <!-- Room Header Strip -->
            <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <span class="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse shadow-md shadow-rose-500/50"></span>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h2 class="font-black text-sm sm:text-base text-slate-900 dark:text-white" id="live-header-room-title">${details.title}</h2>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold">
                                پخش زنده برخط
                            </span>
                            <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold font-mono">
                                ${details.room_code}
                            </span>
                        </div>
                        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span class="font-medium text-blue-600 dark:text-teal-400">مدرس: ${details.teacher_name}</span>
                            <span>•</span>
                            <span id="live-participants-badge" class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${details.viewers_count} دانش‌آموز متصل</span>
                            <span>•</span>
                            <span id="live-active-sim-badge" class="text-slate-600 dark:text-slate-300 font-bold">${currentLab.title}</span>
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

                    <!-- Share Classroom & QR Modal Button -->
                    <button onclick="window.liveLab.openShareModal()" 
                        class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
                        <span>اشتراک‌گذاری و QR</span>
                    </button>

                    <button onclick="window.store.setView('live-lab')" 
                        class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-1.5">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                        <span>خروج از کلاس</span>
                    </button>
                </div>
            </div>

            <!-- Main Live Stage (Viewport + Telemetry + Classroom Sidebar) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                <!-- Left Column (8 cols): Synchronized Simulator Viewport & Educational Telemetry -->
                <div class="lg:col-span-8 space-y-4">
                    
                    <!-- Live Simulator Frame Container -->
                    <div id="live-stage-wrapper" class="relative w-full h-[540px] sm:h-[620px] rounded-2xl bg-white border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden select-none">
                        
                        <!-- Teacher Controls Toolbar Overlay (When Teacher) -->
                        ${this.userRole === 'teacher' ? `
                        <div class="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur text-white border border-slate-700 text-xs shadow-xl">
                            <div class="flex items-center gap-2 font-bold text-emerald-400">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>شما کنترل‌کننده پخش زنده این جلسه هستید</span>
                            </div>
                            <div class="flex items-center flex-wrap gap-2">
                                <!-- Switch Laboratory Live -->
                                <button onclick="window.liveLab.openSimSwitcherModal()" 
                                    class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-[11px] flex items-center gap-1.5 shadow-sm">
                                    <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                                    <span>🔄 تعویض آزمایشگاه (${ALL_LABORATORIES.length})</span>
                                </button>

                                <!-- Toggle Student Lock -->
                                <button onclick="window.liveLab.toggleStudentLock()" 
                                    id="btn-toggle-student-lock"
                                    class="px-2.5 py-1.5 rounded-lg ${this.isStudentLocked ? 'bg-amber-600 hover:bg-amber-500' : 'bg-slate-700 hover:bg-slate-600'} font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="${this.isStudentLocked ? 'lock' : 'unlock'}" class="w-3 h-3"></i>
                                    <span id="btn-lock-text">${this.isStudentLocked ? 'قفل دانش‌آموز: فعال' : 'اجازه آزمایش آزاد'}</span>
                                </button>

                                <!-- Laser Pointer Mode -->
                                <button onclick="window.liveLab.toggleLaserMode()" 
                                    id="btn-toggle-laser"
                                    class="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="sparkles" class="w-3 h-3"></i>
                                    <span id="btn-laser-text">🔦 لیزر تدریس</span>
                                </button>

                                <button onclick="window.liveLab.promptAddTeacherNote()" class="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="edit-3" class="w-3 h-3"></i>
                                    <span>نکته تخته</span>
                                </button>
                                <button onclick="window.liveLab.promptStartPoll()" class="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-[11px] flex items-center gap-1">
                                    <i data-lucide="help-circle" class="w-3 h-3"></i>
                                    <span>طرح پرسش</span>
                                </button>
                            </div>
                        </div>
                        ` : `
                        <!-- Student Mode Banner -->
                        <div id="student-lock-banner" class="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur text-white text-[11px] font-bold border border-slate-700 flex items-center gap-1.5 shadow">
                            <span class="w-2 h-2 rounded-full ${this.isStudentLocked ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse"></span>
                            <span id="student-lock-status-text">${this.isStudentLocked ? '🔒 تخته در دست دبیر است' : '🔓 امکان تعامل آزاد با آزمایشگاه فعال است'}</span>
                        </div>
                        `}

                        <!-- Glowing Laser Pointer Element -->
                        <div id="live-laser-pointer" class="hidden absolute pointer-events-none z-40 w-5 h-5 rounded-full bg-rose-600 shadow-xl shadow-rose-500 ring-4 ring-rose-400/70 -translate-x-1/2 -translate-y-1/2 transition-all duration-75"></div>

                        <!-- Transparent Laser Capture Surface (Active when teacher turns on laser mode) -->
                        <div id="teacher-laser-capture" class="hidden absolute inset-0 z-20 cursor-crosshair bg-transparent"></div>

                        <!-- Student Interaction Blocker Layer (Active when isStudentLocked is true for student) -->
                        <div id="student-interaction-blocker" class="${(this.userRole === 'student' && this.isStudentLocked) ? '' : 'hidden'} absolute inset-0 z-10 bg-transparent"></div>

                        <!-- Iframe Viewport Loading PhET Simulator -->
                        <iframe 
                            id="live-sync-iframe"
                            src="${iframeSrc}"
                            class="w-full h-full border-0 bg-white"
                            allow="fullscreen"
                            loading="eager">
                        </iframe>
                    </div>

                    <!-- Dynamic Educational Context Bar (نوار تحلیل و فرمول‌های آزمایش فعال) -->
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
                    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                            <h3 class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                <i data-lucide="clipboard-list" class="w-4 h-4 text-teal-500"></i>
                                <span>تخته نکات و فرمول‌های دبیر</span>
                            </h3>
                            ${this.userRole === 'teacher' ? `
                            <button onclick="window.liveLab.clearTeacherNotes()" class="text-[10px] text-rose-500 hover:underline">
                                پاک کردن همه
                            </button>
                            ` : ''}
                        </div>
                        <div id="live-teacher-notes-list" class="space-y-2 max-h-48 overflow-y-auto">
                            ${(details.teacher_notes || []).map(n => `
                            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                                ${n}
                            </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Live Academic Chat Card -->
                    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
                        <div class="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                <i data-lucide="message-square" class="w-4 h-4 text-blue-500"></i>
                                <span>گفتگوی علمی کلاس</span>
                            </span>
                            <span class="text-[10px] text-slate-400">انتقال سریع پیام‌ها</span>
                        </div>

                        <!-- Chat Messages Feed -->
                        <div id="live-chat-messages-container" class="flex-1 p-3 space-y-2 overflow-y-auto">
                            ${(details.chat_history || []).map(msg => this.formatChatMessageHtml(msg)).join('')}
                        </div>

                        <!-- Chat Input Bar -->
                        <div class="p-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                            <input id="live-chat-input" type="text" placeholder="پیام علمی یا سوال خود را بنویسید..." 
                                onkeydown="if(event.key==='Enter') window.liveLab.sendChatMessage()"
                                class="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-blue-500">
                            <button onclick="window.liveLab.sendChatMessage()" 
                                class="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:scale-105">
                                <i data-lucide="send" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Live Laboratory Switcher Modal (For Teachers) -->
        <div id="live-lab-switcher-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <div class="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans">
                <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i data-lucide="repeat" class="w-5 h-5 text-blue-500"></i>
                        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">
                            تغییر آنی آزمایشگاه زنده (اشتراک‌گذاری در کلاس)
                        </h3>
                    </div>
                    <button onclick="window.liveLab.closeSimSwitcherModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <div class="p-4 space-y-3 flex-1 overflow-y-auto">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <p class="text-xs text-slate-500">با انتخاب هر آزمایشگاه، تصویر صفحه تمامی دانش‌آموزان به صورت زنده و بلادرنگ به آزمایشگاه جدید تغییر می‌یابد:</p>
                        <input id="switcher-search-input" type="text" placeholder="جستجو بین ۲۸ آزمایشگاه..." 
                            oninput="window.liveLab.filterSwitcherLabs(this.value)"
                            class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-48 outline-none focus:border-blue-500">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto p-1">
                        ${ALL_LABORATORIES.map(lab => `
                        <div onclick="window.liveLab.changeSimulator('${lab.id}')"
                            data-title="${lab.title}"
                            class="switcher-lab-card p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 cursor-pointer transition-all space-y-1.5 ${lab.id === this.currentSimId ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/70 ring-2 ring-blue-400' : ''}">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${lab.grade === 9 ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : lab.grade === 8 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'}">
                                    ${lab.gradeLabel}
                                </span>
                                ${lab.id === this.currentSimId ? '<span class="text-[10px] text-blue-600 dark:text-sky-400 font-bold">آزمایشگاه فعال</span>' : ''}
                            </div>
                            <h4 class="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">${lab.title}</h4>
                            <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate">${lab.topic}</p>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <div class="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
                    <button onclick="window.liveLab.closeSimSwitcherModal()" class="px-4 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800">
                        بستن
                    </button>
                </div>
            </div>
        </div>

        <!-- Share Classroom Link & QR Code Modal -->
        <div id="live-lab-share-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-center font-sans">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 class="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <i data-lucide="share-2" class="w-4 h-4 text-blue-500"></i>
                        <span>اشتراک‌گذاری مستقیم کلاس</span>
                    </h3>
                    <button onclick="window.liveLab.closeShareModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- QR Code Display -->
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 inline-block shadow-inner">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/#live-lab/' + details.room_code)}" 
                        alt="QR Code" class="w-44 h-44 rounded-xl mx-auto shadow-sm">
                    <span class="text-[10px] text-slate-500 dark:text-slate-400 block mt-2">اسکن با دوربین گوشی یا تبلت جهت ورود آنی</span>
                </div>

                <!-- Direct URL with Copy Button -->
                <div class="space-y-1.5 text-right">
                    <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300">لینک اختصاصی کلاس:</label>
                    <div class="flex items-center gap-1.5">
                        <input id="share-class-url-input" type="text" readonly 
                            value="${window.location.origin}/#live-lab/${details.room_code}"
                            class="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono outline-none">
                        <button onclick="window.liveLab.copyShareUrl()" 
                            class="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow flex items-center gap-1 whitespace-nowrap">
                            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                            <span>کپی</span>
                        </button>
                    </div>
                </div>

                <div class="pt-2 text-center">
                    <span class="text-xs text-slate-500">شناسه کلاس: <strong class="font-mono text-sm text-blue-600 dark:text-sky-400">${details.room_code}</strong></span>
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) window.renderMathInPage(document.getElementById('live-educational-card'));

        this.simIframe = document.getElementById('live-sync-iframe');
        this.laserOverlay = document.getElementById('live-laser-pointer');

        if (details.active_poll) {
            this.renderPollUI(details.active_poll, details.poll_votes || {});
        }

        // Connect WebSocket and Listeners
        this.connectWebSocket(details.room_code);
        this.setupIframeMessageBridge();
        this.setupLaserCaptureSurface();
        this.startSyncPoller(details.room_code);
    }

    openShareModal() {
        const m = document.getElementById('live-lab-share-modal');
        if (m) m.classList.remove('hidden');
    }

    closeShareModal() {
        const m = document.getElementById('live-lab-share-modal');
        if (m) m.classList.add('hidden');
    }

    copyShareUrl() {
        const inp = document.getElementById('share-class-url-input');
        if (inp) {
            inp.select();
            navigator.clipboard.writeText(inp.value);
            alert('لینک مستقیم کلاس کپی شد:\n' + inp.value);
        }
    }

    openSimSwitcherModal() {
        const m = document.getElementById('live-lab-switcher-modal');
        if (m) m.classList.remove('hidden');
    }

    closeSimSwitcherModal() {
        const m = document.getElementById('live-lab-switcher-modal');
        if (m) m.classList.add('hidden');
    }

    filterSwitcherLabs(query) {
        const q = (query || '').trim().toLowerCase();
        document.querySelectorAll('.switcher-lab-card').forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            if (!q || title.includes(q)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    async changeSimulator(newSimId) {
        const lab = getLabInfo(newSimId);
        this.closeSimSwitcherModal();

        // 1. Send via WebSocket if open
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'change_simulator',
                sim_id: newSimId,
                sim_title: lab.title
            }));
        }

        // 2. Fallback REST
        if (this.currentRoom) {
            fetch(`/api/live-lab/rooms/${this.currentRoom.room_code}/change-simulator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sim_id: newSimId, sim_title: lab.title })
            }).catch(e => console.warn(e));
        }

        // 3. Switch locally immediately
        this.switchSimulatorLocally(newSimId, lab.title);
    }

    switchSimulatorLocally(newSimId, newSimTitle) {
        this.currentSimId = newSimId;
        const lab = getLabInfo(newSimId);

        // Update iframe source
        if (this.simIframe) {
            this.simIframe.src = getLabUrl(newSimId, this.userRole);
        }

        // Update active badge
        const badge = document.getElementById('live-active-sim-badge');
        if (badge) badge.textContent = lab.title;

        // Update Educational Context Card
        const gradeEl = document.getElementById('edu-lab-grade');
        const titleEl = document.getElementById('edu-lab-title');
        const topicEl = document.getElementById('edu-lab-topic');
        const formulaEl = document.getElementById('edu-lab-formula');
        const goalsEl = document.getElementById('edu-lab-goals');
        const miscEl = document.getElementById('edu-lab-misconception');

        if (gradeEl) gradeEl.textContent = lab.gradeLabel;
        if (titleEl) titleEl.textContent = lab.title;
        if (topicEl) topicEl.textContent = lab.topic;
        if (formulaEl) {
            formulaEl.innerHTML = `$$${lab.formula}$$`;
            if (window.renderMathInPage) window.renderMathInPage(formulaEl);
        }
        if (goalsEl) goalsEl.textContent = lab.goals;
        if (miscEl) miscEl.textContent = lab.misconception;

        // Audio and notification toast
        if (window.store && window.store.playSound) window.store.playSound('correct');
        this.showToast(`🔬 آزمایشگاه زنده به «${lab.title}» تغییر یافت.`);
    }

    toggleStudentLock() {
        this.isStudentLocked = !this.isStudentLocked;

        // Send event via WebSocket
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'toggle_lock',
                is_locked: this.isStudentLocked
            }));
        } else if (this.currentRoom) {
            fetch(`/api/live-lab/rooms/${this.currentRoom.room_code}/toggle-lock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_locked: this.isStudentLocked })
            }).catch(e => console.warn(e));
        }

        this.applyStudentLockUI(this.isStudentLocked);
    }

    applyStudentLockUI(isLocked) {
        this.isStudentLocked = isLocked;
        // Teacher button
        const btn = document.getElementById('btn-toggle-student-lock');
        const txt = document.getElementById('btn-lock-text');
        if (btn && txt) {
            if (isLocked) {
                btn.className = 'px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-[11px] flex items-center gap-1';
                txt.textContent = 'قفل دانش‌آموز: فعال';
            } else {
                btn.className = 'px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-[11px] flex items-center gap-1';
                txt.textContent = 'اجازه آزمایش آزاد';
            }
        }

        // Student blocker layer
        const blocker = document.getElementById('student-interaction-blocker');
        if (blocker) {
            if (this.userRole === 'student' && isLocked) {
                blocker.classList.remove('hidden');
            } else {
                blocker.classList.add('hidden');
            }
        }

        // Student status text
        const statusText = document.getElementById('student-lock-status-text');
        if (statusText) {
            statusText.textContent = isLocked ? '🔒 تخته در دست دبیر است' : '🔓 امکان تعامل آزاد با آزمایشگاه فعال است';
        }
    }

    toggleLaserMode() {
        this.isLaserActive = !this.isLaserActive;
        const btn = document.getElementById('btn-toggle-laser');
        const txt = document.getElementById('btn-laser-text');
        const capture = document.getElementById('teacher-laser-capture');

        if (this.isLaserActive) {
            if (btn) btn.className = 'px-2.5 py-1.5 rounded-lg bg-rose-500 ring-2 ring-rose-300 font-bold text-[11px] flex items-center gap-1';
            if (txt) txt.textContent = '🔦 در حال اشاره با لیزر...';
            if (capture) capture.classList.remove('hidden');
        } else {
            if (btn) btn.className = 'px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-[11px] flex items-center gap-1';
            if (txt) txt.textContent = '🔦 لیزر تدریس';
            if (capture) capture.classList.add('hidden');
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'laser_pointer', active: false }));
            }
        }
    }

    setupLaserCaptureSurface() {
        const capture = document.getElementById('teacher-laser-capture');
        if (!capture) return;

        let lastSendTime = 0;
        capture.addEventListener('mousemove', (e) => {
            if (!this.isLaserActive || this.userRole !== 'teacher') return;
            const now = Date.now();
            if (now - lastSendTime < 35) return; // ~30 fps throttle
            lastSendTime = now;

            const rect = capture.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

            // Move local laser
            if (this.laserOverlay) {
                this.laserOverlay.style.left = `${x * 100}%`;
                this.laserOverlay.style.top = `${y * 100}%`;
                this.laserOverlay.classList.remove('hidden');
            }

            // Broadcast via WebSocket
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: 'laser_pointer',
                    x: x,
                    y: y,
                    active: true
                }));
            }
        });

        capture.addEventListener('mouseleave', () => {
            if (this.laserOverlay) this.laserOverlay.classList.add('hidden');
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'laser_pointer', active: false }));
            }
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white border border-slate-700 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce';
        toast.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span><span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
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
            } catch (err) {
                console.error('[LiveLab] Error parsing WebSocket message:', err);
            }
        };

        this.socket.onclose = () => {
            console.log('[LiveLab] WebSocket disconnected. Fast polling will maintain synchronization.');
        };
    }

    setupIframeMessageBridge() {
        window.addEventListener('message', (event) => {
            if (!event.data || typeof event.data !== 'object') return;
            const msg = event.data;

            if (msg.type === 'TEACHER_SIM_STATE_UPDATE' && this.userRole === 'teacher') {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: 'state_update',
                        payload: msg.payload
                    }));
                }
            }

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

    startSyncPoller(roomCode) {
        if (this.syncPoller) clearInterval(this.syncPoller);
        this.syncPoller = setInterval(async () => {
            if (!this.currentRoom) return;
            try {
                const res = await fetch(`/api/live-lab/rooms/${roomCode}/sync?since=${this.lastSyncTime}`);
                if (res.ok) {
                    const data = await res.json();
                    this.lastSyncTime = Date.now() / 1000;

                    // Simulator changed check
                    if (data.sim_id && data.sim_id !== this.currentSimId) {
                        this.switchSimulatorLocally(data.sim_id, data.sim_title);
                    }

                    // Lock changed check
                    if (data.is_locked !== undefined && data.is_locked !== this.isStudentLocked) {
                        this.applyStudentLockUI(data.is_locked);
                    }

                    // Chat messages
                    if (Array.isArray(data.new_messages) && data.new_messages.length > 0) {
                        data.new_messages.forEach(m => this.appendChatMessage(m));
                    }

                    // Notes
                    if (Array.isArray(data.teacher_notes)) {
                        this.refreshNotesList(data.teacher_notes);
                    }

                    // Poll
                    if (data.active_poll) {
                        this.renderPollUI(data.active_poll, data.poll_votes || {});
                    }
                }
            } catch (err) {
                // silent
            }
        }, 1200);
    }

    handleIncomingSocketMessage(data) {
        const type = data.type;

        // 1. Welcome or State Sync
        if (type === 'welcome') {
            if (data.sim_id && data.sim_id !== this.currentSimId) {
                this.switchSimulatorLocally(data.sim_id, data.sim_title);
            }
            if (data.is_locked !== undefined) {
                this.applyStudentLockUI(data.is_locked);
            }
            if (data.notes && Array.isArray(data.notes)) {
                this.refreshNotesList(data.notes);
            }
            if (data.active_poll) {
                this.renderPollUI(data.active_poll, data.poll_votes || {});
            }
        }

        // 2. Simulator Changed (Teacher switched experiment)
        if (type === 'simulator_changed') {
            this.switchSimulatorLocally(data.sim_id, data.sim_title);
        }

        // 3. Lock Toggled
        if (type === 'lock_toggled') {
            this.applyStudentLockUI(data.is_locked);
        }

        // 4. Viewers count update
        if (data.viewers_count !== undefined) {
            const badge = document.getElementById('live-participants-badge');
            if (badge) {
                badge.textContent = `${data.viewers_count} دانش‌آموز متصل`;
            }
        }

        // 5. Laser Pointer
        if (type === 'laser_pointer' && this.laserOverlay) {
            if (data.active === false) {
                this.laserOverlay.classList.add('hidden');
            } else {
                this.laserOverlay.style.left = `${(data.x || 0.5) * 100}%`;
                this.laserOverlay.style.top = `${(data.y || 0.5) * 100}%`;
                this.laserOverlay.classList.remove('hidden');
            }
        }

        // 6. Teacher Note Added
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

        // 7. Notes Cleared
        if (type === 'notes_cleared') {
            const notesList = document.getElementById('live-teacher-notes-list');
            if (notesList) {
                notesList.innerHTML = '<p class="text-slate-400 text-[11px] py-2 text-center">هنوز یادداشتی از سوی دبیر ارسال نشده است.</p>';
            }
        }

        // 8. Poll Started
        if (type === 'poll_started') {
            this.votedPollIndex = null;
            this.renderPollUI(data, data.votes || {});
            if (window.store && window.store.playSound) window.store.playSound('correct');
        }

        // 9. Poll Update
        if (type === 'poll_update') {
            this.updatePollBars(data.votes || {}, data.total || 0);
        }

        // 10. Student Raised Hand
        if (type === 'student_raised_hand') {
            this.appendChatMessage({
                sender: 'سامانه سمپاد',
                role: 'system',
                message: `✋ دانش‌آموز «${data.sender}» اجازه گرفت / دست بلند کرد.`
            });
            if (this.userRole === 'teacher' && window.store && window.store.playSound) {
                window.store.playSound('wrong');
            }
        }

        // 11. Chat Message
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
        const q = prompt('متن پرسش کلاسی را وارد فرمایید:', 'اگر جرم دو برابر شود، دوره تناوب آونگ ساده چه تغییری می‌کند؟');
        if (!q || !q.trim()) return;
        const opt1 = prompt('گزینه ۱:', 'تغییری نمی‌کند (مستقل از جرم است)') || 'تغییری نمی‌کند (مستقل از جرم است)';
        const opt2 = prompt('گزینه ۲:', 'دو برابر می‌شود') || 'دو برابر می‌شود';
        const opt3 = prompt('گزینه ۳:', 'نصف می‌شود') || 'نصف می‌شود';
        const opt4 = prompt('گزینه ۴:', 'رادیکال ۲ برابر می‌شود') || 'رادیکال ۲ برابر می‌شود';

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
