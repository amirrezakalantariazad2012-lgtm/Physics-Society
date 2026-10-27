/**
 * Physics Laboratory Simulators Catalog & Interactive Workbench
 * Physics Society of Shahid Beheshti 2 (Grades 7, 8, 9)
 * Official Standalone Offline PhET Simulations (University of Colorado)
 * Full Alignment with Iranian Ministry & SAMPAD Science Textbooks
 */

const SIMULATOR_CATALOG = [
    // =========================================================================
    // GRADE 7 (پایه هفتم) — کتاب وزارتی و تکمیلی سمپاد
    // =========================================================================
    {
        id: 'density',
        title: 'چگالی، حجم جابه‌جاشده و شناوری ارشمیدس',
        grade: 7,
        gradeKey: 'grade_7',
        gradeTitle: 'پایه هفتم',
        gradeLabel: 'پایه هفتم',
        category: 'ماده و اندازه‌گیری',
        topic: 'فصل ۲: اندازه‌گیری و چگالی',
        ministryBook: 'کتاب وزارتی علوم هفتم — فصل ۲ (اندازه‌گیری در علوم و ابزارهای آن)',
        sampadBook: 'کتاب تکمیلی سمپاد هفتم — فصل ۲ (محاسبه چگالی، غوطه‌وری و ارشمیدس)',
        icon: 'flask-conical',
        desc: 'محاسبه دقیق چگالی با ترازو و استوانه مدرج به روش جابه‌جایی مایع، قانون شناوری ارشمیدس، مقایسه چگالی اجسام با مایعات مختلف (آب، روغن، بنزین و جیوه) و وزن ظاهری.',
        description: 'محاسبه دقیق چگالی با ترازو و استوانه مدرج به روش جابه‌جایی مایع، قانون شناوری ارشمیدس، مقایسه چگالی اجسام با مایعات مختلف (آب، روغن، بنزین و جیوه) و وزن ظاهری.',
        formula: '\\rho = \\frac{m}{V} \\quad , \\quad F_b = \\rho_{\\text{fluid}} \\cdot V_{\\text{submerged}} \\cdot g',
        badge: 'وزارتی و سمپاد هفتم — اندازه‌گیری تجربی',
        goals: [
            'اندازه‌گیری حجم اجسام نامنظم به روش جابه‌جایی آب در استوانه مدرج',
            'آزمودن شرایط سه‌گانه شناوری، غوطه‌وری در عمق و ته‌نشینی بر اساس نسبت چگالی جسم به مایع',
            'محاسبه نیروی شناوری ارشمیدس و تغییر وزن ظاهری جسم درون شاره'
        ],
        experimentSteps: [
            'از منوی بالای شبیه‌ساز، حالت «مقدماتی» یا «اجسام سفارشی» را انتخاب کنید.',
            'جرم جسم (m) و حجم آن (V) را با استفاده از لغزنده‌ها تغییر دهید و چگالی را طبق فرمول ρ = m/V محاسبه کنید.',
            'جسم را با موس به درون استوانه آب کشیده و حجم مایع جابه‌جاشده را یادداشت نمایید.',
            'چگالی مایع را از آب (۱ g/cm³) به روغن یا گلیسیرین تغییر داده و وضعیت شناوری جسم را بررسی کنید.'
        ],
        misconceptions: 'اشتباه رایج: جسم سنگین‌تر همیشه در آب فرو می‌رود! در حالی که شناوری یا ته‌نشینی تنها به «چگالی» وابسته است نه جرم کل (قایق غول‌پیکر فولادی شناور می‌ماند چون چگالی میانگین آن کمتر از آب است).',
        localFile: 'density.html',
        localUrl: '/simulators/phet/density.html',
        phetSlug: 'density'
    },
    {
        id: 'energy-skate',
        title: 'پایستگی و تبدیل‌های انرژی مکانیکی (اسکیت‌پارک)',
        grade: 7,
        gradeKey: 'grade_7',
        gradeTitle: 'پایه هفتم',
        gradeLabel: 'پایه هفتم',
        category: 'کار و انرژی',
        topic: 'فصل ۸: انرژی و تبدیل‌های آن',
        ministryBook: 'کتاب وزارتی علوم هفتم — فصل ۸ (انرژی و تبدیل‌های آن)',
        sampadBook: 'کتاب تکمیلی سمپاد هفتم — فصل ۸ (کار، انرژی جنبشی، پتانسیل گرانشی و اصطکاک)',
        icon: 'activity',
        desc: 'تبدیل مداوم انرژی پتانسیل گرانشی به انرژی جنبشی و بالعکس در طول پیست اسکیت، اثر اصطکاک بر تلفات گرمایی و اثبات پایستگی کامل انرژی کل مکانیکی.',
        description: 'تبدیل مداوم انرژی پتانسیل گرانشی به انرژی جنبشی و بالعکس در طول پیست اسکیت، اثر اصطکاک بر تلفات گرمایی و اثبات پایستگی کامل انرژی کل مکانیکی.',
        formula: 'E_M = K + U_g = \\frac{1}{2}mv^2 + mgh = \\text{ثابت} \\quad (\\Delta E_M = -W_f)',
        badge: 'وزارتی و سمپاد هفتم — پایستگی انرژی',
        goals: [
            'مشاهده تبدیل انرژی پتانسیل به جنبشی در نقطه اوج و کف دره مسیر نوسان اسکیت‌باز',
            'اثبات ثابت ماندن انرژی کل در غیاب اصطکاک با نمودارهای میله‌ای و دایره‌ای برخط',
            'بررسی نقش نیروی اصطکاک در تبدیل تدریجی انرژی مکانیکی به انرژی گرمایی (درونی)'
        ],
        experimentSteps: [
            'تیک «نمودار میله‌ای» و «نمودار دایره‌ای انرژی» را در نوار ابزار شبیه‌ساز فعال کنید.',
            'اسکیت‌باز را با درگ کردن به بالاترین نقطه پیست ببرید و رها کنید.',
            'تغییرات ستون‌های انرژی جنبشی (سبز) و پتانسیل گرانشی (آبی) را در نقاط مختلف رصد کنید.',
            'اصطکاک را فعال کرده و تبدیل شدن انرژی مکانیکی به انرژی حرارتی (قرمز) را تحلیل نمایید.'
        ],
        misconceptions: 'اشتباه رایج: انرژی هنگام توقف ناشی از اصطکاک نابود می‌شود! خیر، انرژی طبق اصل پایستگی از فرم مکانیکی به فرم گرمایی (جنبش مولکولی) دگرگون شده است.',
        localFile: 'energy-skate-park.html',
        localUrl: '/simulators/phet/energy-skate-park.html',
        phetSlug: 'energy-skate-park-basics'
    },
    {
        id: 'energy-forms',
        title: 'صورت‌های انرژی، دما و تعادل گرمایی',
        grade: 7,
        gradeKey: 'grade_7',
        gradeTitle: 'پایه هفتم',
        gradeLabel: 'پایه هفتم',
        category: 'گرما و ترمودینامیک',
        topic: 'فصل ۱۰: گرما و بهینه‌سازی مصرف انرژی',
        ministryBook: 'کتاب وزارتی علوم هفتم — فصل ۹ و ۱۰ (منابع انرژی، گرما و بهینه‌سازی مصرف)',
        sampadBook: 'کتاب تکمیلی سمپاد هفتم — فصل ۱۰ (دمای تعادل، ظرفیت گرمایی و تبادل حرارت)',
        icon: 'flame',
        desc: 'آزمایش دماسنجی و تبادل حرارت بین اجسام مختلف (آهن، آجر، آب، روغن)، ظرفیت گرمایی ویژه و بررسی گذار فاز و بسته‌های انرژی حرارتی.',
        description: 'آزمایش دماسنجی و تبادل حرارت بین اجسام مختلف (آهن، آجر، آب، روغن)، ظرفیت گرمایی ویژه و بررسی گذار فاز و بسته‌های انرژی حرارتی.',
        formula: 'Q = mc\\Delta T \\quad , \\quad T_{eq} = \\frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2}',
        badge: 'وزارتی و سمپاد هفتم — گرما و انرژی',
        goals: [
            'مشاهده شارش خودبه‌خودی انرژی گرمایی از جسم گرم‌تر به جسم سردتر تا برقراری تعادل حرارتی',
            'مقایسه آهنگ افزایش دمای آب و روغن با ظرفیت گرمایی ویژه متفاوت',
            'ردیابی بسته‌های انرژی (Energy Chunks) درون ساختار ماده با دماسنج‌های دقیق'
        ],
        experimentSteps: [
            'گزینه «Energy Symbols» (نمادهای انرژی) را فعال کنید تا بسته‌های E درون اجسام دیده شوند.',
            'دماسنج‌ها را روی بلوک آهنی و ظرف آب قرار دهید.',
            'چراغ بونزن را زیر آب و آهن روشن کنید و سرعت بالا رفتن دما را با یکدیگر مقایسه نمایید.',
            'بلوک آهن داغ را به داخل ظرف آب خنک منتقل کرده و دمای تعادل نهایی هر دو را رصد کنید.'
        ],
        misconceptions: 'اشتباه رایج: دما و گرما هم‌معنی هستند! دما میانگین انرژی جنبشی ذرات است، در حالی که گرما مقدار انرژی منتقل‌شده به علت اختلاف دما است.',
        localFile: 'energy-forms.html',
        localUrl: '/simulators/phet/energy-forms.html',
        phetSlug: 'energy-forms-and-changes'
    },

    // =========================================================================
    // GRADE 8 (پایه هشتم) — کتاب وزارتی و تکمیلی سمپاد
    // =========================================================================
    {
        id: 'circuit-dc',
        title: 'کیت ساخت مدارهای الکتریکی DC (قانون اهم و اتصالات سری/موازی)',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'الکتریسیته جاری',
        topic: 'فصل ۹: الکتریسیته جاری و مدار',
        ministryBook: 'کتاب وزارتی علوم هشتم — فصل ۹ (الکتریسیته جاری، اختلاف پتانسیل، جریان و مقاومت)',
        sampadBook: 'کتاب تکمیلی سمپاد هشتم — فصل ۹ (قانون اهم، مدارهای سری و موازی و قوانین کیرشهف)',
        icon: 'zap',
        desc: 'آزمایشگاه کامل الکترونیک DC: باتری، سیم، لامپ، مقاومت، کلید، فیوز، آمپرمتر غیرتماسی، ولت‌متر، اثبات قانون اهم (V=IR) و تحلیل تخصصی مدارهای متوالی و موازی.',
        description: 'آزمایشگاه کامل الکترونیک DC: باتری، سیم، لامپ، مقاومت، کلید، فیوز، آمپرمتر غیرتماسی، ولت‌متر، اثبات قانون اهم (V=IR) و تحلیل تخصصی مدارهای متوالی و موازی.',
        formula: 'V = IR \\quad , \\quad R_{\\text{series}} = R_1 + R_2 \\quad , \\quad \\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2}',
        badge: 'وزارتی و سمپاد هشتم — مدارهای الکتریکی',
        goals: [
            'اثبات تجربی قانون اهم با تغییر ولتاژ باتری و ثبت جریان عبوری از آمپرمتر',
            'مقایسه مقاومت معادل در آرایش متوالی (سری) و موازی',
            'بررسی استقلال شاخه‌ها در اتصال موازی در برابر قطع کل مدار با سوختن یک لامپ در اتصال متوالی'
        ],
        experimentSteps: [
            'از پالت قطعات، یک باتری، دو تکه سیم، یک لامپ و یک کلید را به میز کار بیاورید و حلقه ببندید.',
            'کلید را ببندید تا روشنایی لامپ و حرکت الکترون‌ها را مشاهده کنید.',
            'ولت‌متر را به دو سر لامپ وصل کرده و ولتاژ را اندازه بگیرید، سپس آمپرمتر را در مسیر قرار دهید.',
            'یک لامپ دوم را یک‌بار به صورت متوالی (سری) و بار دیگر به صورت موازی به مدار بیفزایید و تفاوت درخشش و جریان را ثبت کنید.'
        ],
        misconceptions: 'اشتباه رایج: جریان الکتریکی در لامپ‌ها مصرف شده و کم می‌شود! خیر، شدت جریان بار در سرتاسر یک شاخه ثابت است و تنها انرژی الکتریکی به نور و گرما تبدیل می‌شود.',
        localFile: 'circuit-dc.html',
        localUrl: '/simulators/phet/circuit-dc.html',
        phetSlug: 'circuit-construction-kit-dc'
    },
    {
        id: 'balloons-static',
        title: 'الکتریسیته ساکن، بار الکتریکی و القای بار',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'الکتریسیته ساکن',
        topic: 'فصل ۹: بار الکتریکی و القا',
        ministryBook: 'کتاب وزارتی علوم هشتم — فصل ۹ (بار الکتریکی، روش‌های باردار کردن و تخلیه بار)',
        sampadBook: 'کتاب تکمیلی سمپاد هشتم — فصل ۹ (الکتریسیته ساکن، قانون کولن و القای بار الکتریکی)',
        icon: 'sparkles',
        desc: 'باردار کردن بادکنک از طریق مالش با پلیور پشمی (انتقال الکترون‌ها)، القای بار در دیوار عایق و چسبیدن بادکنک، جاذبه بارهای ناهمنام و دافعه بارهای هم‌نام.',
        description: 'باردار کردن بادکنک از طریق مالش با پلیور پشمی (انتقال الکترون‌ها)، القای بار در دیوار عایق و چسبیدن بادکنک، جاذبه بارهای ناهمنام و دافعه بارهای هم‌نام.',
        formula: 'F_e = k \\frac{|q_1 q_2|}{r^2} \\quad , \\quad \\Delta q_{\\text{sweater}} = -\\Delta q_{\\text{balloon}}',
        badge: 'وزارتی و سمپاد هشتم — الکتریسیته ساکن',
        goals: [
            'درک جابه‌جایی الکترون‌ها (بارهای منفی) حین اصطکاک و ثابت ماندن پروتون‌ها در هسته',
            'مشاهده پدیده القای بار الکتریکی و دوقطبی شدن مولکول‌های سطح دیوار',
            'آزمودن رانش دو بادکنک با بارهای هم‌نام منفی'
        ],
        experimentSteps: [
            'گزینه «نمایش تمام بارها» را انتخاب کنید تا بارهای مثبت و منفی روی بادکنک، لباس و دیوار نمایان شوند.',
            'بادکنک را روی لباس پشمی بمالید و انتقال الکترون‌ها به بادکنک را بررسی کنید.',
            'بادکنک باردار منفی را رها کنید تا ببینید چگونه به سمت لباس دارای بار خالص مثبت کشیده می‌شود.',
            'بادکنک را به آرامی به دیوار نزدیک کنید و عقب‌نشینی بارهای منفی سطح دیوار (قطبش القایی) را رصد کنید.'
        ],
        misconceptions: 'اشتباه رایج: پروتون‌ها در اثر مالش از جسمی به جسم دیگر می‌روند! پروتون‌ها در هسته اتم محبوسند؛ این تنها الکترون‌های مدار خارجی هستند که منتقل می‌شوند.',
        localFile: 'balloons-static.html',
        localUrl: '/simulators/phet/balloons-static.html',
        phetSlug: 'balloons-and-static-electricity'
    },
    {
        id: 'bending-light',
        title: 'شکست نور، قانون اسنل و پاشندگی در منشور',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'نور و اپتیک',
        topic: 'فصل ۱۵: شکست نور و منشور',
        ministryBook: 'کتاب وزارتی علوم هشتم — فصل ۱۵ (شکست نور، سرعت نور در ماده و منشور)',
        sampadBook: 'کتاب تکمیلی سمپاد هشتم — فصل ۱۵ (قانون اسنل، ضریب شکست، زاویه حد و بازتاب کلی)',
        icon: 'eye',
        desc: 'تحلیل دقیق زاویه‌ای شکست پرتو لیزر در گذار از هوا به آب و شیشه، اثبات قانون اسنل (n₁sinθ₁ = n₂sinθ₂)، زاویه حد، بازتاب داخلی کلی و تجزیه نور سفید در منشور.',
        description: 'تحلیل دقیق زاویه‌ای شکست پرتو لیزر در گذار از هوا به آب و شیشه، اثبات قانون اسنل (n₁sinθ₁ = n₂sinθ₂)، زاویه حد، بازتاب داخلی کلی و تجزیه نور سفید در منشور.',
        formula: 'n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2 \\quad , \\quad \\sin \\theta_c = \\frac{n_2}{n_1} \\quad (n_1 > n_2)',
        badge: 'وزارتی و سمپاد هشتم — اپتیک موجی',
        goals: [
            'اثبات زاویه‌ای قانون اسنل با نقاله دقیق و محاسبه ضریب شکست ماده مجهول',
            'کشف تجربی زاویه حد در عبور از محیط غلیظ به رقیق و وقوع بازتاب داخلی کلی',
            'مشاهده پاشندگی نور سفید به طیف پیوسته رنگین‌کمان در منشور مثلثی'
        ],
        experimentSteps: [
            'چراغ لیزری را روشن کنید و نقاله را در محل برخورد پرتو با خط مرزی قرار دهید.',
            'زاویه تابش (θ₁) و زاویه شکست (θ₂) را اندازه گرفته و نسبت sinθ₁/sinθ₂ را با ضریب شکست مقایسه کنید.',
            'محیط بالا را آب (n=1.33) و محیط پایین را هوا (n=1.0) قرار دهید و زاویه تابش را آرام افزایش دهید تا پدیده بازتاب کلی رخ دهد.',
            'به تب «Prisms» رفته، منشور مثلثی بگذارید و چشمه نور سفید را روشن نمایید تا پاشندگی به ۷ رنگ رنگین‌کمان پدیدار گردد.'
        ],
        misconceptions: 'اشتباه رایج: نور همیشه هنگام عبور از مرز دو ماده می‌شکند! اگر زاویه تابش صفر درجه باشد (تابش عمود بر سطح)، پرتو بدون انحراف زاویه‌ای مستقیماً عبور می‌کند هرچند سرعت آن تغییر می‌یابد.',
        localFile: 'bending-light.html',
        localUrl: '/simulators/phet/bending-light.html',
        phetSlug: 'bending-light'
    },
    {
        id: 'geometric-optics',
        title: 'نور هندسی، آینه‌ها و عدسی‌ها (تشکیل تصویر)',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'نور و اپتیک',
        topic: 'فصل ۱۴ و ۱۵: نور و عدسی‌ها',
        ministryBook: 'کتاب وزارتی علوم هشتم — فصل ۱۴ و ۱۵ (نور، آینه‌های مقعر/محدب و عدسی‌های همگرا/واگرا)',
        sampadBook: 'کتاب تکمیلی سمپاد هشتم — فصل ۱۴ (کانون، رسم پرتوها، فرمول گاوس ۱/f = ۱/p + ۱/q و بزرگنمایی)',
        icon: 'sun',
        desc: 'ردیابی پرتوهای هندسی نور در عدسی‌های همگرا و واگرا و آینه‌ها، فاصله کانونی، موقعیت شیء و تصویر، تصویر حقیقی/مجازی، وارونه/مستقیم و بزرگنمایی.',
        description: 'ردیابی پرتوهای هندسی نور در عدسی‌های همگرا و واگرا و آینه‌ها، فاصله کانونی، موقعیت شیء و تصویر، تصویر حقیقی/مجازی، وارونه/مستقیم و بزرگنمایی.',
        formula: '\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{q} \\quad , \\quad m = -\\frac{q}{p} = \\frac{h\'}{h}',
        badge: 'وزارتی و سمپاد هشتم — نور هندسی',
        goals: [
            'مشاهده تشکیل تصویر حقیقی (وارونه) و مجازی (مستقیم) با تغییر فاصله شیء تا کانون',
            'تحلیل پرتوهای ویژه (پرتو موازی محور اصلی، پرتو گذرا از مرکز نوری و پرتو کانون)',
            'اثبات رابطه معکوس فواصل کانونی و تصویر با فرمول تحلیلی گاوس'
        ],
        experimentSteps: [
            'عدسی همگرا را در مرکز صفحه قرار دهید و نقطه کانون (F) را مشخص کنید.',
            'شیء (شمع یا مداد) را در فاصله‌ای دورتر از دو برابر فاصله کانونی (p > 2f) قرار دهید و تصویر را بررسی کنید.',
            'شیء را به تدریج به عدسی نزدیک کرده و نحوه بزرگ‌تر شدن تصویر و دور شدن آن را یادداشت کنید.',
            'شیء را بین کانون و عدسی ببرید (p < f) تا تشکیل تصویر مجازی، مستقیم و بزرگ‌تر در پشت شیء را مشاهده نمایید.'
        ],
        misconceptions: 'اشتباه رایج: تصویر مجازی را می‌توان روی پرده تشکیل داد! تصویر مجازی از امتداد فرضی پرتوها به دست می‌آید و بدون ابزار نوری یا چشم مستقیماً روی پرده دیده نمی‌شود.',
        localFile: 'geometric-optics.html',
        localUrl: '/simulators/phet/geometric-optics.html',
        phetSlug: 'geometric-optics'
    },
    {
        id: 'faradays-law',
        title: 'مغناطیس، خطوط میدان و القای الکترومغناطیسی فارادی',
        grade: 8,
        gradeKey: 'grade_8',
        gradeTitle: 'پایه هشتم',
        gradeLabel: 'پایه هشتم',
        category: 'مغناطیس و القا',
        topic: 'فصل ۱۰: مغناطیس و الکترومغناطیس',
        ministryBook: 'کتاب وزارتی علوم هشتم — فصل ۱۰ (مغناطیس، قطب‌های آهنربا و آهنربای الکتریکی)',
        sampadBook: 'کتاب تکمیلی سمپاد هشتم — فصل ۱۰ (میدان مغناطیسی، قانون القای فارادی و جهت جریان القایی)',
        icon: 'compass',
        desc: 'آهنربای میله‌ای، قطب‌نما و خطوط بردار میدان مغناطیسی، حرکت آهنربا درون سیم‌پیچ و تولید جریان الکتریکی القایی (ژنراتور) و انحراف عقربه ولت‌متر.',
        description: 'آهنربای میله‌ای، قطب‌نما و خطوط بردار میدان مغناطیسی، حرکت آهنربا درون سیم‌پیچ و تولید جریان الکتریکی القایی (ژنراتور) و انحراف عقربه ولت‌متر.',
        formula: '\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t} \\quad , \\quad \\Phi_B = B \\cdot A \\cos \\theta',
        badge: 'وزارتی و سمپاد هشتم — الکترومغناطیس',
        goals: [
            'ردیابی بردار میدان مغناطیسی در نقاط اطراف آهنربا به کمک عقربه قطب‌نما',
            'اثبات وابستگی جریان القایی به تندی حرکت آهنربا و تعداد دورهای سیم‌پیچ',
            'مشاهده تغییر قطبیت و جهت جریان القایی با تغییر قطب N و S آهنربا'
        ],
        experimentSteps: [
            'آهنربای میله‌ای را به آرامی به سمت سیم‌پیچ ۴ دور حرکت دهید و انحراف ولت‌متر و روشنایی لامپ را ببینید.',
            'آهنربا را با تندی بسیار بالا وارد و خارج کنید تا افزایش ولتاژ القایی را بسنجید.',
            'سیم‌پیچ ۲ دور را امتحان کنید و ولتاژ تولیدی را با سیم‌پیچ ۴ دور مقایسه نمایید.',
            'آهنربا را درون سیم‌پیچ کاملاً ساکن نگه دارید و ببینید آیا ولتاژی القا می‌شود یا خیر.'
        ],
        misconceptions: 'اشتباه رایج: حضور آهنربای بسیار قوی در کنار سیم‌پیچ همواره برق تولید می‌کند! خیر، تنها «تغییر» شار مغناطیسی برحسب زمان است که نیروی محرکه القایی ایجاد می‌کند (آهنربای ساکن هیچ برقی تولید نمی‌کند).',
        localFile: 'faradays-law.html',
        localUrl: '/simulators/phet/faradays-law.html',
        phetSlug: 'faradays-law'
    },

    // =========================================================================
    // GRADE 9 (پایه نهم) — کتاب وزارتی و تکمیلی سمپاد
    // =========================================================================
    {
        id: 'forces-motion',
        title: 'نیرو، شتاب و قوانین نیوتون (دینامیک نیوتونی)',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'حرکت و دینامیک',
        topic: 'فصل ۴ و ۵: حرکت و قوانین نیوتون',
        ministryBook: 'کتاب وزارتی علوم نهم — فصل ۴ (حرکت چیست؟) و فصل ۵ (نیرو و قوانین نیوتون)',
        sampadBook: 'کتاب تکمیلی سمپاد نهم — فصل ۴ و ۵ (تندی، شتاب، قانون اول، دوم و سوم نیوتون و اصطکاک)',
        icon: 'move',
        desc: 'آزمایش جامع دینامیک: نیروی خالص، شتاب متحرک (a = F/m)، آستانه اصطکاک ایستایی (fs,max = μsN)، اصطکاک جنبشی و تحلیل همزمان نمودار تندی برحسب زمان.',
        description: 'آزمایش جامع دینامیک: نیروی خالص، شتاب متحرک (a = F/m)، آستانه اصطکاک ایستایی (fs,max = μsN)، اصطکاک جنبشی و تحلیل همزمان نمودار تندی برحسب زمان.',
        formula: 'F_{\\text{net}} = m \\cdot a \\quad , \\quad f_{s,\\max} = \\mu_s N \\quad , \\quad f_k = \\mu_k N',
        badge: 'وزارتی و سمپاد نهم — دینامیک نیوتونی',
        goals: [
            'آزمودن تجربی قانون دوم نیوتون و رابطه مستقیم شتاب با نیرو و عکس آن با جرم',
            'درک عینی آستانه حرکت و تمایز اصطکاک ایستایی با اصطکاک جنبشی روی جعبه',
            'تحلیل قانون اول نیوتون (لختی) و تداوم حرکت با سرعت ثابت در غیاب اصطکاک'
        ],
        experimentSteps: [
            'تب «اصطکاک» (Friction) را از منوی پایین انتخاب کنید.',
            'تیک «نیروها»، «مقدار نیرو»، «جرم‌ها» و «تندی‌سنج» را فعال کنید.',
            'نیروی دست را به آرامی افزایش دهید و ببینید تا قبل از رسیدن به آستانه حرکت، نیروی اصطکاک دقیقاً برابر نیروی اعمالی شماست.',
            'پس از شروع حرکت، اصطکاک را صفر کنید و مشاهده نمایید جسم بدون نیاز به هیچ نیرویی تا ابد با تندی ثابت به حرکت ادامه می‌دهد.'
        ],
        misconceptions: 'اشتباه رایج: برای تداوم حرکت با سرعت ثابت نیاز به نیروی مداوم است! این دیدگاه ارسطویی اشتباه است؛ طبق قانون اول نیوتون اگر برآیند نیروها صفر باشد متحرک با سرعت ثابت به مسیرش ادامه می‌دهد.',
        localFile: 'forces-motion.html',
        localUrl: '/simulators/phet/forces-motion.html',
        phetSlug: 'forces-and-motion-basics'
    },
    {
        id: 'hookes-law',
        title: 'قانون هوک، فنر کشسانی و انرژی پتانسیل کشسانی',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'کشسانی و فنر',
        topic: 'فصل ۵: نیروی کشسانی و فنر',
        ministryBook: 'کتاب وزارتی علوم نهم — فصل ۵ (نیروی کشسانی فنر و دینامومتر)',
        sampadBook: 'کتاب تکمیلی سمپاد نهم — فصل ۵ (قانون هوک F=kΔx، فنرهای متوالی و موازی و انرژی کشسانی)',
        icon: 'git-commit',
        desc: 'رابطه خطی نیروی فنر با تغییر طول (F = kΔx)، محاسبه ثابت سختی فنر (k)، انرژی ذخیره‌شده کشسانی و مقایسه دو فنر در آرایش‌های مختلف.',
        description: 'رابطه خطی نیروی فنر با تغییر طول (F = kΔx)، محاسبه ثابت سختی فنر (k)، انرژی ذخیره‌شده کشسانی و مقایسه دو فنر در آرایش‌های مختلف.',
        formula: 'F = k \\Delta x \\quad , \\quad U_e = \\frac{1}{2} k (\\Delta x)^2',
        badge: 'وزارتی و سمپاد نهم — کشسانی فنر',
        goals: [
            'اثبات تناسب مستقیم تغییر طول فنر با نیروی وارد بر آن طبق قانون هوک',
            'تعیین سختی فنر (k) از شیب نمودار نیرو برحسب تغییر طول',
            'محاسبه انرژی پتانسیل کشسانی ذخیره‌شده در فنر فشرده یا کشیده‌شده'
        ],
        experimentSteps: [
            'گزینه‌های «Applied Force»، «Displacement» و «Equilibrium Position» را علامت بزنید.',
            'نیروی اعمال‌شده را با کشیدن لغزنده تغییر دهید و تغییر طول (Δx) را با خط‌کش اندازه بگیرید.',
            'ثابت سختی فنر (k) را تغییر دهید و مشاهده کنید فنر ضخیم‌تر به نیروی بسیار بیشتری برای تغییر طول نیاز دارد.',
            'به تب «Energy» بروید و نمودار سهمی شکل انرژی ذخیره‌شده برحسب جابه‌جایی را بررسی کنید.'
        ],
        misconceptions: 'اشتباه رایج: اگر فنر را دو برابر بکشیم، انرژی ذخیره‌شده دو برابر می‌شود! خیر، انرژی کشسانی با «توان دوم» تغییر طول متناسب است؛ بنابراین با دو برابر شدن کشیدگی، انرژی ۴ برابر می‌شود.',
        localFile: 'hookes-law.html',
        localUrl: '/simulators/phet/hookes-law.html',
        phetSlug: 'hookes-law'
    },
    {
        id: 'masses-springs',
        title: 'نوسانگر وزنه و فنر در گرانش‌های مختلف (زمین، ماه، مشتری)',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'نوسان و ارتعاش',
        topic: 'فصل ۵: نوسان، دوره تناوب و گرانش',
        ministryBook: 'کتاب وزارتی علوم نهم — فصل ۵ (وزن و گرانش زمین و اجرام آسمانی)',
        sampadBook: 'کتاب تکمیلی سمپاد نهم — فصل ۵ (حرکت هماهنگ ساده، دوره تناوب فنر T = 2π√(m/k) و تعیین جرم مجهول)',
        icon: 'orbit',
        desc: 'آزمایش حرکت نوسانی وزنه و فنر، محاسبه دوره تناوب با کرونومتر، تعیین جرم‌های مجهول رنگی و مقایسه نوسان در میدان گرانش زمین، کره ماه، مشتری و سیاره مجهول X.',
        description: 'آزمایش حرکت نوسانی وزنه و فنر، محاسبه دوره تناوب با کرونومتر، تعیین جرم‌های مجهول رنگی و مقایسه نوسان در میدان گرانش زمین، کره ماه، مشتری و سیاره مجهول X.',
        formula: 'T = 2\\pi \\sqrt{\\frac{m}{k}} \\quad , \\quad F_g = m \\cdot g \\quad (g_{\\text{Moon}} = 1.62 , g_{\\text{Jupiter}} = 24.8)',
        badge: 'وزارتی و سمپاد نهم — نوسان و گرانش',
        goals: [
            'سنجش وابستگی دوره تناوب نوسان به جرم و ثابت فنر و استقلال آن از شتاب گرانش',
            'تعیین جرم وزنه‌های مجهول با اندازه‌گیری کشیدگی حالت تعادل در گرانش زمین',
            'بررسی پایستگی انرژی مکانیکی بین پتانسیل کشسانی، گرانشی و جنبشی در طول نوسان'
        ],
        experimentSteps: [
            'وزنه ۱۰۰ گرمی را از فنر آویزان کرده و خط‌کش را در کنار آن قرار دهید.',
            'نوسان را در حالت زمین اجرا کرده و دوره تناوب یک رفت و برگشت را با کرونومتر بسنجید.',
            'گرانش را روی «Moon» (ماه) بگذارید و ببینید نقطه تعادل تغییر می‌کند اما زمان دوره تناوب یکسان می‌ماند.',
            'وزنه علامت سوال قرمز را آویزان کرده و جرم آن را با مقایسه کشیدگی فنر محاسبه نمایید.'
        ],
        misconceptions: 'اشتباه رایج: دوره تناوب فنر در ماه کندتر از زمین است چون جاذبه ماه کمتر است! دوره تناوب فنر T=2π√(m/k) مستقل از g است (برعکس آونگ ساده).',
        localFile: 'masses-springs.html',
        localUrl: '/simulators/phet/masses-springs.html',
        phetSlug: 'masses-and-springs'
    },
    {
        id: 'under-pressure',
        title: 'فشار در شاره‌ها، فشار جو و اصل پاسکال (هیدرولیک)',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'فشار و شاره‌ها',
        topic: 'فصل ۸: فشار مایعات و هیدرواستاتیک',
        ministryBook: 'کتاب وزارتی علوم نهم — فصل ۸ (فشار در جامدات، مایعات، فشار جو و اصل پاسکال)',
        sampadBook: 'کتاب تکمیلی سمپاد نهم — فصل ۸ (هیدرواستاتیک P=ρgh، لوله‌های مرتبط U شکل و بالابر هیدرولیکی)',
        icon: 'droplets',
        desc: 'اندازه‌گیری فشار مایعات با فشارسنج متحرک در اعماق مختلف، بررسی اثر چگالی مایع (آب، بنزین، عسل)، فشار اتمسفر جو و اصل پاسکال در لوله‌های مرتبط.',
        description: 'اندازه‌گیری فشار مایعات با فشارسنج متحرک در اعماق مختلف، بررسی اثر چگالی مایع (آب، بنزین، عسل)، فشار اتمسفر جو و اصل پاسکال در لوله‌های مرتبط.',
        formula: 'P = \\rho g h \\quad , \\quad P_{\\text{total}} = P_0 + \\rho g h \\quad , \\quad \\frac{F_1}{A_1} = \\frac{F_2}{A_2}',
        badge: 'وزارتی و سمپاد نهم — هیدرواستاتیک',
        goals: [
            'اثبات رابطه خطی فشار شاره با عمق (P = ρgh) و استقلال فشار از شکل ظرف',
            'بررسی اثر چگالی مایع بر مقدار فشار در عمق معین',
            'مشاهده کاربرد اصل پاسکال در انتقال یکنواخت فشار در مایعات محبوس'
        ],
        experimentSteps: [
            'شیر آب را باز کنید تا استخر پر شود و خط‌کش عمق‌سنج را فعال کنید.',
            'فشارسنج را از روی قفسه برداشته و در عمق‌های ۱، ۲ و ۳ متری قرار دهید و داده‌ها را ثبت کنید.',
            'چگالی مایع را از آب به عسل (چگال‌تر) و بنزین (سبک‌تر) تغییر دهید و فشار را بسنجید.',
            'کلید جو (Atmosphere) را خاموش کنید تا تنها فشار هیدرواستاتیک ناشی از خود مایع دیده شود.'
        ],
        misconceptions: 'اشتباه رایج: فشار در کف یک ظرف پهن بیشتر از کف یک لوله باریک با همان ارتفاع آب است! خیر، فشار شاره ساکن صرفاً به عمق (h) و چگالی (ρ) وابسته است و شکل یا پهنای ظرف اثری ندارد.',
        localFile: 'under-pressure.html',
        localUrl: '/simulators/phet/under-pressure.html',
        phetSlug: 'under-pressure'
    },
    {
        id: 'balancing-act',
        title: 'اهرم‌ها، گشتاور نیرو و تعادل دورانی (ماشین‌های ساده)',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'ماشین‌های ساده',
        topic: 'فصل ۹: ماشین‌ها و اهرم‌ها',
        ministryBook: 'کتاب وزارتی علوم نهم — فصل ۹ (ماشین‌های ساده، اهرم‌ها، قرقره‌ها و مزیت مکانیکی)',
        sampadBook: 'کتاب تکمیلی سمپاد نهم — فصل ۹ (گشتاور نیرو τ=F·d، تعادل دورانی Στ=0، اهرم نوع ۱، ۲ و ۳)',
        icon: 'scale',
        desc: 'آزمایشگاه کامل اهرم‌ها: تعادل دورانی (گشتاور ساعتگرد = گشتاور پادساعتگرد)، تغییر موقعیت وزنه‌ها نسبت به تکیه‌گاه، مزیت مکانیکی و بازی هیجان‌انگیز تعادل جرم‌های مجهول.',
        description: 'آزمایشگاه کامل اهرم‌ها: تعادل دورانی (گشتاور ساعتگرد = گشتاور پادساعتگرد)، تغییر موقعیت وزنه‌ها نسبت به تکیه‌گاه، مزیت مکانیکی و بازی هیجان‌انگیز تعادل جرم‌های مجهول.',
        formula: '\\Sigma \\tau = 0 \\implies F_1 \\cdot d_1 = F_2 \\cdot d_2 \\quad , \\quad A = \\frac{R}{E} = \\frac{d_E}{d_R}',
        badge: 'وزارتی و سمپاد نهم — ماشین‌های ساده',
        goals: [
            'تحلیل شرایط تعادل دورانی اهرم و برابری حاصل‌ضرب نیرو در بازوی محرک و مقاوم',
            'بررسی افزایش مزیت مکانیکی با افزایش فاصله نیروی محرک تا تکیه‌گاه',
            'تعیین جرم اجسام مجهول با ایجاد تعادل مکانیکی روی اهرم'
        ],
        experimentSteps: [
            'تیک «خط‌کش» و «نشانگر زاویه» را در ابزار فعال کنید.',
            'یک وزنه ۱۰ کیلوگرمی را در فاصله ۱ متری سمت راست قرار دهید.',
            'یک وزنه ۵ کیلوگرمی بردارید و بیابید در چه فاصله‌ای از سمت چپ باید قرار گیرد تا اهرم کاملاً افقی و در تعادل بماند.',
            'پایه‌های نگهدارنده را بردارید تا صحت برابری گشتاورها (۱۰ × ۱ = ۵ × ۲) را تماشا کنید.'
        ],
        misconceptions: 'اشتباه رایج: برای تعادل، جرم دو طرف همیشه باید مساوی باشد! خیر، گشتاور (حاصل‌ضرب وزن در فاصله تا تکیه‌گاه) باید برابر باشد؛ بنابراین یک وزنه کوچک در فاصله دور می‌تواند وزنه سنگین نزدیک را متعادل سازد.',
        localFile: 'balancing-act.html',
        localUrl: '/simulators/phet/balancing-act.html',
        phetSlug: 'balancing-act'
    },
    {
        id: 'wave-on-a-string',
        title: 'امواج مکانیکی، صوت، بسامد و تشدید (طناب نوسانگر)',
        grade: 9,
        gradeKey: 'grade_9',
        gradeTitle: 'پایه نهم',
        gradeLabel: 'پایه نهم',
        category: 'امواج و ارتعاشات',
        topic: 'فصل ۴ و ۵: امواج مکانیکی و صوت',
        ministryBook: 'کتاب وزارتی علوم نهم — بخش تکمیلی حرکت نوسانی و صوت',
        sampadBook: 'کتاب تکمیلی سمپاد نهم — بخش پیشرفته امواج مکانیکی (تندی، بسامد، طول موج v=λf و امواج ساکن)',
        icon: 'radio',
        desc: 'انتشار امواج عرضی در طناب، رابطه تندی با بسامد و طول موج (v = λf)، بازتاب از انتهای ثابت و آزاد، میرایی، کشش طناب و ایجاد هماهنگ‌ها و امواج ساکن.',
        description: 'انتشار امواج عرضی در طناب، رابطه تندی با بسامد و طول موج (v = λf)، بازتاب از انتهای ثابت و آزاد، میرایی، کشش طناب و ایجاد هماهنگ‌ها و امواج ساکن.',
        formula: 'v = \\lambda \\cdot f \\quad , \\quad v = \\sqrt{\\frac{T}{\\mu}} \\quad , \\quad f_n = n \\frac{v}{2L}',
        badge: 'وزارتی و سمپاد نهم — امواج و صوت',
        goals: [
            'مشاهده انتشار موج عرضی و حرکت عمودی ذره‌های طناب نسبت به جهت پیشروی موج',
            'تحلیل رابطه معکوس طول موج با بسامد در تندی ثابت انتشار (v = λf)',
            'مشاهده تفاوت بازتاب فاز از انتهای بسته (وارونه‌شدن تپ) و انتهای باز (بازتاب هم‌فاز)'
        ],
        experimentSteps: [
            'حالت شبیه‌ساز را از «Manual» به «Oscillate» (نوسان خودکار) تغییر دهید.',
            'تیک «Rulers» (خط‌کش) و «Timer» (تایمر) را فعال کنید.',
            'بسامد (Frequency) را تغییر دهید و تأثیر آن را بر تعداد موج‌ها و طول موج رصد نمایید.',
            'کشش طناب (Tension) را بین کم و زیاد جابه‌جا کنید و تغییر چشمگیر در تندی انتشار موج را مشاهده کنید.'
        ],
        misconceptions: 'اشتباه رایج: با افزایش فرکانس منبع، سرعت انتشار موج در طناب زیاد می‌شود! سرعت انتشار موج صرفاً به ویژگی‌های محیط (جنس و کشش طناب) بستگی دارد نه فرکانس منبع. با افزایش فرکانس، طول موج کوچک می‌شود تا v ثابت بماند.',
        localFile: 'wave-on-a-string.html',
        localUrl: '/simulators/phet/wave-on-a-string.html',
        phetSlug: 'wave-on-a-string'
    }
];

class PhysicsSimulators {
    constructor() {
        this.catalog = SIMULATOR_CATALOG;
        this.currentLiveState = null;
        this.activeSimId = null;
        this.stopwatchState = { running: false, elapsed: 0, interval: null, laps: [] };
    }

    resolveSimId(type) {
        if (!type) return 'density';
        const raw = String(type).trim().toLowerCase();
        
        // Exact match
        if (this.catalog.some(s => s.id === raw)) return raw;

        // Legacy aliases
        const aliasMap = {
            'calorimetry': 'energy-forms',
            'energy': 'energy-skate',
            'levers': 'balancing-act',
            'circuit': 'circuit-dc',
            'electrostatics': 'balloons-static',
            'optics': 'bending-light',
            'magnetism': 'faradays-law',
            'newton': 'forces-motion',
            'hooke': 'hookes-law',
            'pressure': 'under-pressure',
            'solid_pressure': 'under-pressure',
            'waves': 'wave-on-a-string'
        };
        if (aliasMap[raw]) return aliasMap[raw];

        return 'density';
    }

    getSimulatorForLesson(lessonId, chapterTitle = '') {
        let title = '';
        if (lessonId && typeof lessonId === 'object') {
            title = ((lessonId.title || '') + ' ' + (lessonId.chapter_title || '') + ' ' + (lessonId.description || '')).toLowerCase();
        } else {
            title = ((lessonId || '') + ' ' + (chapterTitle || '')).toLowerCase();
        }

        if (title.includes('چگالی') || title.includes('ارشمیدس') || title.includes('شناوری') || title.includes('استوانه')) return 'density';
        if (title.includes('دما') || title.includes('گرما') || title.includes('حرارت') || title.includes('گرماسنج') || title.includes('کالری')) return 'energy-forms';
        if (title.includes('انرژی') || title.includes('پایستگی') || title.includes('جنبشی') || title.includes('پتانسیل') || title.includes('اسکیت')) return 'energy-skate';
        if (title.includes('اهرم') || title.includes('گشتاور') || title.includes('ماشین') || title.includes('قرقره') || title.includes('تعادل')) return 'balancing-act';
        if (title.includes('مدار') || title.includes('جریان') || title.includes('اهم') || title.includes('ولتاژ') || title.includes('مقاومت')) return 'circuit-dc';
        if (title.includes('ساکن') || title.includes('بار') || title.includes('الکتروسکوپ') || title.includes('القا') || title.includes('بادکنک')) return 'balloons-static';
        if (title.includes('شکست') || title.includes('منشور') || title.includes('اسنل') || title.includes('زاویه حد')) return 'bending-light';
        if (title.includes('آینه') || title.includes('عدسی') || title.includes('کانون') || title.includes('اپتیک') || title.includes('تصویر')) return 'geometric-optics';
        if (title.includes('مغناطیس') || title.includes('آهنربا') || title.includes('فارادی') || title.includes('الکترومغناطیس')) return 'faradays-law';
        if (title.includes('حرکت') || title.includes('تندی') || title.includes('سرعت') || title.includes('شتاب') || title.includes('نیوتون')) return 'forces-motion';
        if (title.includes('هوک') || title.includes('کشسانی')) return 'hookes-law';
        if (title.includes('نوسان') || title.includes('آونگ') || title.includes('فنر') || title.includes('تناوب')) return 'masses-springs';
        if (title.includes('فشار') || title.includes('پاسکال') || title.includes('هیدرولیک') || title.includes('مانومتر') || title.includes('شاره')) return 'under-pressure';
        if (title.includes('موج') || title.includes('صوت') || title.includes('بسامد') || title.includes('طول موج') || title.includes('رزونانس')) return 'wave-on-a-string';

        return 'density';
    }

    mount(type, containerId, mode = 'native') {
        const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        if (!container) return;

        const simId = this.resolveSimId(type);
        this.activeSimId = simId;
        const sim = this.catalog.find(s => s.id === simId) || this.catalog[0];

        this.currentLiveState = {
            labId: sim.id,
            title: sim.title,
            grade: sim.gradeTitle,
            params: {
                'عنوان آزمایش': sim.title,
                'پایه تحصیلی': sim.gradeTitle,
                'سرفصل وزارتی': sim.ministryBook,
                'سرفصل تکمیلی سمپاد': sim.sampadBook,
                'رابطه تحلیلی حاکم': sim.formula,
                'وضعیت استقرار': 'شبیه‌ساز رسمی و آفلاین PhET دانشگاه کلرادو'
            }
        };

        const isDuoPoint = container.id === 'duo-sim-mount-point';
        const frameHeight = isDuoPoint ? 'h-[500px]' : 'h-[640px] sm:h-[720px]';

        container.innerHTML = `
        <div id="sim-master-card" class="rounded-3xl bg-slate-900 border border-teal-500/30 overflow-hidden shadow-2xl flex flex-col space-y-0 transition-all">
            <!-- Sleek Control Toolbar -->
            <div class="p-3.5 sm:p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h3 class="font-extrabold text-sm sm:text-base text-white">${sim.title}</h3>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold">
                                بومی و آفلاین (بدون فیلترشکن)
                            </span>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                                ${sim.gradeTitle}
                            </span>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span class="text-teal-400 font-medium">${sim.ministryBook}</span>
                            <span>•</span>
                            <span class="text-amber-400 font-medium">${sim.sampadBook}</span>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons: Fullscreen, Standalone External Tab, Reload, Claim XP, Tools -->
                <div class="flex items-center flex-wrap gap-1.5 sm:gap-2">
                    <button onclick="window.physicsSimulators.openInStandaloneTab('${sim.localUrl}')" 
                        title="باز کردن در صفحه جداگانه / پنجره تمام‌صفحه مستقل برای نمایش روی تخته هوشمند"
                        class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all shadow hover:border-teal-500/50">
                        <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                        <span>پنجره مستقل</span>
                    </button>

                    <button onclick="window.physicsSimulators.toggleFullscreen('sim-viewport-frame-wrapper')" 
                        title="نمایش تمام‌صفحه"
                        class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all">
                        <i data-lucide="maximize" class="w-3.5 h-3.5"></i>
                        <span>تمام‌صفحه</span>
                    </button>

                    <button onclick="window.physicsSimulators.reloadActiveFrame()" 
                        title="راه‌اندازی مجدد شبیه‌ساز"
                        class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all">
                        <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
                    </button>

                    <button onclick="window.physicsSimulators.openLabToolboxModal('caliper')" 
                        title="جعبه ابزار آزمایشگاهی (کولیس، کرونومتر، مولتی‌متر)"
                        class="px-3 py-1.5 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all">
                        <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                        <span>جعبه ابزار</span>
                    </button>

                    <button id="claim-lab-xp-${sim.id}" 
                        onclick="window.claimLabXp('${sim.id}', '${sim.title}')" 
                        class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <!-- Standalone IFrame Viewport (100% Offline, Same-Origin) -->
            <div id="sim-viewport-frame-wrapper" class="relative w-full ${frameHeight} bg-slate-950 flex flex-col justify-center items-center overflow-hidden">
                <iframe 
                    id="sim-active-iframe"
                    src="${sim.localUrl}" 
                    title="${sim.title}"
                    class="w-full h-full border-0 select-none bg-slate-950"
                    allow="fullscreen; autoplay; accelerometer; gyroscope"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    loading="eager">
                </iframe>
            </div>

            <!-- Bottom Multi-Tab Educational Panel -->
            <div class="p-4 sm:p-6 bg-slate-950/70 border-t border-slate-800 space-y-4">
                <!-- Tab Selector -->
                <div class="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3 text-xs font-bold">
                    <button onclick="window.physicsSimulators.switchInfoTab('steps')" id="sim-tab-btn-steps" 
                        class="px-3.5 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black shadow flex items-center gap-1.5 transition-all">
                        <i data-lucide="list-ordered" class="w-3.5 h-3.5"></i>
                        <span>دستور کار و سناریوی آزمایش</span>
                    </button>
                    <button onclick="window.physicsSimulators.switchInfoTab('formula')" id="sim-tab-btn-formula" 
                        class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all">
                        <i data-lucide="sigma" class="w-3.5 h-3.5"></i>
                        <span>روابط و فرمول‌های حاکم</span>
                    </button>
                    <button onclick="window.physicsSimulators.switchInfoTab('logbook')" id="sim-tab-btn-logbook" 
                        class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                        <span>دفترچه ثبت مشاهدات</span>
                    </button>
                    <button onclick="window.physicsSimulators.switchInfoTab('misconceptions')" id="sim-tab-btn-misconceptions" 
                        class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all">
                        <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>تله‌های تستی و اشتباهات رایج</span>
                    </button>
                </div>

                <!-- Tab Content 1: Steps -->
                <div id="sim-info-tab-steps" class="space-y-3 text-xs">
                    <h5 class="text-sm font-bold text-teal-300">مراحل پیشنهادی انجام آزمایش برای یادگیری کامل:</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${sim.experimentSteps.map((step, idx) => `
                        <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                            <span class="w-6 h-6 rounded-xl bg-teal-900/60 text-teal-400 border border-teal-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                                ${idx + 1}
                            </span>
                            <p class="text-slate-300 leading-relaxed text-[11px]">${step}</p>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Tab Content 2: Formulas -->
                <div id="sim-info-tab-formula" class="hidden space-y-3 text-xs">
                    <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
                        <span class="text-[11px] text-slate-400 block mb-1">رابطه ریاضی و فیزیکی حاکم بر این پدیده:</span>
                        <div class="katex-ltr-container text-base sm:text-lg text-cyan-300">
                            $$${sim.formula}$$
                        </div>
                    </div>
                    <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
                        <strong>اهداف آموزشی منطبق بر کتب درسی:</strong>
                        <ul class="mt-2 space-y-1.5">
                            ${sim.goals.map(g => `
                            <li class="flex items-center gap-2">
                                <i data-lucide="check" class="w-3.5 h-3.5 text-teal-400 shrink-0"></i>
                                <span>${g}</span>
                            </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Tab Content 3: Logbook -->
                <div id="sim-info-tab-logbook" class="hidden space-y-3 text-xs">
                    <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <label class="block font-bold text-teal-300 text-xs">یادداشت داده‌ها، اندازه‌گیری‌ها و نتیجه‌گیری آزمایش:</label>
                        <textarea id="live-lab-notes-input" rows="3" placeholder="برای نمونه: چگالی آب را ۱ اندازه گرفتم، با افزایش جرم چگالی تغییر نکرد و فقط حجم متناسب با آن بالا رفت..."
                            class="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:border-teal-400"></textarea>
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] text-slate-400">یادداشت شما در فایل چاپی گزارش کار ثبت خواهد شد.</span>
                            <button onclick="window.physicsSimulators.saveLogbookNote()" class="btn-duo-green text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow">
                                <i data-lucide="save" class="w-3.5 h-3.5"></i>
                                <span>ذخیره در دفترچه گزارش کار</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tab Content 4: Misconceptions -->
                <div id="sim-info-tab-misconceptions" class="hidden space-y-3 text-xs">
                    <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 leading-relaxed text-[11px]">
                        <div class="flex items-center gap-2 font-black text-amber-300 text-xs mb-1.5">
                            <i data-lucide="alert-circle" class="w-4 h-4"></i>
                            <span>تله آزمون‌های سمپاد و سوءتفاهم مفهومی متداول:</span>
                        </div>
                        <p>${sim.misconceptions}</p>
                    </div>
                </div>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
        if (window.renderMathInPage) setTimeout(() => window.renderMathInPage(container), 50);
    }

    switchInfoTab(targetTab) {
        ['steps', 'formula', 'logbook', 'misconceptions'].forEach(t => {
            const btn = document.getElementById(`sim-tab-btn-${t}`);
            const content = document.getElementById(`sim-info-tab-${t}`);
            if (btn && content) {
                if (t === targetTab) {
                    btn.className = 'px-3.5 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black shadow flex items-center gap-1.5 transition-all';
                    content.classList.remove('hidden');
                } else {
                    btn.className = 'px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all';
                    content.classList.add('hidden');
                }
            }
        });
        if (window.lucide) window.lucide.createIcons();
        if (targetTab === 'formula' && window.renderMathInPage) {
            window.renderMathInPage(document.getElementById('sim-info-tab-formula'));
        }
    }

    openInStandaloneTab(url) {
        if (!url) return;
        window.open(url, '_blank');
    }

    toggleFullscreen(elementId) {
        const el = document.getElementById(elementId) || document.getElementById('sim-master-card');
        if (!el) return;

        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    reloadActiveFrame() {
        const iframe = document.getElementById('sim-active-iframe');
        if (iframe) {
            const currentSrc = iframe.src;
            iframe.src = '';
            setTimeout(() => { iframe.src = currentSrc; }, 50);
        }
    }

    saveLogbookNote() {
        const input = document.getElementById('live-lab-notes-input');
        if (!input) return;
        const val = input.value.trim();
        if (!val) {
            alert('لطفاً ابتدا چند خط یادداشت یا نتیجه‌گیری آزمایش را بنویسید.');
            return;
        }
        if (!this.currentLiveState) this.currentLiveState = {};
        if (!this.currentLiveState.params) this.currentLiveState.params = {};
        this.currentLiveState.params['مشاهدات و یادداشت آزمایشگر'] = val;
        alert('یادداشت شما با موفقیت در گزارش کار آزمایش ذخیره شد. می‌توانید از جعبه ابزار دکمه چاپ گزارش کار را بزنید.');
    }

    // =========================================================================
    // LAB INSTRUMENT TOOLBOX MODAL (CALIPER, STOPWATCH, MULTIMETER, REPORT)
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
            <div class="p-5 rounded-3xl bg-slate-950 border-2 border-yellow-500/60 shadow-2xl space-y-4">
                <div class="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
                    <span class="text-[10px] text-emerald-400 font-mono font-bold">DC AUTO</span>
                    <span id="mm-display-val" class="font-mono text-3xl font-black text-emerald-300">
                        12.00 V
                    </span>
                    <span class="text-xs text-emerald-400 font-mono font-bold">HOLD</span>
                </div>

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
                    ${paramRows || '<tr><td colspan="2" class="p-3 text-center text-slate-500">ابتدا یک آزمایش را انتخاب کنید</td></tr>'}
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
                <h2>دبیرستان استعدادهای درخشان شهید بهشتی دو — گزارش کار آزمایشگاه فیزیک</h2>
                <h3>${title}</h3>
            </div>
            <div class="meta">
                <span>دانش‌آموز: ${user.display_name || user.full_name || 'دانش‌آموز فیزیک'}</span>
                <span>پایه تحصیلی: ${user.grade_title_fa || 'دوره اول متوسطه'}</span>
                <span>تاریخ: ${new Date().toLocaleDateString('fa-IR')}</span>
            </div>
            <h4>۱. داده‌ها، سرفصل و متغیرهای ثبت‌شده در آزمایش:</h4>
            <table>
                <thead><tr><th>پارامتر فیزیکی / متغیر</th><th>مقدار / وضعیت</th></tr></thead>
                <tbody>${rowsHtml || '<tr><td colspan="2">داده‌ای ثبت نشد</td></tr>'}</tbody>
            </table>
            <h4>۲. تحلیل نتایج، مشاهدات و نتیجه‌گیری علمی:</h4>
            <div class="box">
                ${obs ? obs.replace(/\\n/g, '<br>') : 'مشاهدات تجربی به صورت کامل با روابط تئوری کتاب درسی فیزیک وزارتی و سمپاد انطباق دارد.'}
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

// Global singleton instance
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
