/**
 * QUANTUM CUT — Advanced Interactive Physics Laboratory & Open-Source Workbench
 * Covers Grade 7, 8, and 9 Iranian National Curriculum & SAMPAD Physics.
 * 
 * Includes:
 * 1. Native High-Precision Interactive Physics Simulators
 * 2. Embedded Open-Source PhET HTML5 Interactive Sandboxes
 * 3. Physicist's Free Workbench Toolkit (Caliper, Scale, Stopwatch, Multimeter, Thermometer)
 * 4. Printable Lab Experiment Report Generator (PDF/Print)
 */

class PhysicsSimulators {
    constructor() {
        this.activeSimulators = {};
        this.currentLiveState = {};
        this.animationFrames = {};
        this.stopwatchData = {
            running: false,
            startTime: 0,
            elapsed: 0,
            interval: null,
            laps: []
        };

        // Complete Catalog of Labs mapped to Grade 7, 8, and 9
        this.catalog = [
            // -------------------------------------------------------------
            // GRADE 7 (پایه هفتم)
            // -------------------------------------------------------------
            {
                id: 'density',
                grade: 7,
                gradeTitle: 'پایه هفتم',
                title: 'چگالی، استوانه مدرج و اصل ارشمیدس',
                topic: 'اندازه‌گیری و چگالی مواد',
                icon: 'droplets',
                badge: 'فیزیک هفتم — فصل ۲',
                phetUrl: 'https://phet.colorado.edu/sims/html/density/latest/density_all.html',
                desc: 'بررسی جرم، حجم، چگالی مایعات گوناگون، روش استوانه مدرج برای محاسبه حجم اجسام نامنظم، و شرایط شناوری، غوطه‌وری و ته‌نشینی.',
                formula: '\\rho = \\frac{m}{V} \\quad , \\quad F_B = \\rho_{liquid} \\cdot V_{sub} \\cdot g',
                goals: [
                    'درک رابطه مستقیم چگالی با جرم و رابطه معکوس آن با حجم',
                    'مقایسه چگالی جامد با چگالی مایع (شرط شناوری: ρ_جسم < ρ_مایع)',
                    'کار با استوانه مدرج و محاسبه حجم از طریق جابجایی مایع'
                ]
            },
            {
                id: 'calorimetry',
                grade: 7,
                gradeTitle: 'پایه هفتم',
                title: 'دما، دماسنجی و تبادل حرارتی',
                topic: 'دما و گرما',
                icon: 'thermometer',
                badge: 'فیزیک هفتم — فصل ۱۰',
                phetUrl: 'https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html',
                desc: 'تبدیل زنده مقیاس‌های دماسنجی سلسیوس، کلوین و فارنهایت، حرارت دادن با چراغ بونزن، و محاسبه دمای تعادل گرمایی هنگام مخلوط کردن مایعات.',
                formula: 'T(K) = \\theta(^{\\circ}C) + 273.15 \\quad , \\quad Q = mc\\Delta T',
                goals: [
                    'آشنایی با نقاط ثابت دماسنجی (انجماد، جوش، صفر مطلق)',
                    'محاسبه دمای تعادل در اختلاط بدون تلفات حرارتی',
                    'بررسی اثر گرمای ویژه بر میزان تغییرات دما'
                ]
            },
            {
                id: 'energy',
                grade: 7,
                gradeTitle: 'پایه هفتم',
                title: 'تبدیل و پایستگی انرژی مکانیکی',
                topic: 'انرژی و تبدیلات آن',
                icon: 'activity',
                badge: 'فیزیک هفتم — فصل ۸',
                phetUrl: 'https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_all.html',
                desc: 'مشاهده تبدیل انرژی پتانسیل گرانشی به انرژی جنبشی و انرژی تلف‌شده اصطکاکی روی پیست اسکیت با نمودارهای میله‌ای زنده.',
                formula: 'E_{total} = U + K = mgh + \\frac{1}{2}mv^2',
                goals: [
                    'درک قانون پایستگی انرژی مکانیکی در غیاب اصطکاک',
                    'رابطه مستقیم انرژی پتانسیل با جرم و ارتفاع اولیه',
                    'محاسبه سرعت نهایی جسم در پایین‌ترین نقطه پیست'
                ]
            },
            {
                id: 'levers',
                grade: 7,
                gradeTitle: 'پایه هفتم',
                title: 'تعادل، اهرم‌ها و گشتاور نیرو',
                topic: 'نیرو و اهرم‌ها',
                icon: 'scale',
                badge: 'فیزیک هفتم — فصل ۹',
                phetUrl: 'https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html',
                desc: 'قرار دادن وزنه‌های گوناگون در فاصله‌های مختلف از تکیه‌گاه، بررسی شرط تعادل افقی الاکلنگ و قانون گشتاورها.',
                formula: '\\tau = F \\cdot d \\quad , \\quad m_1 \\cdot d_1 = m_2 \\cdot d_2',
                goals: [
                    'بررسی اثر بازوی نیرو در چرخش و گشتاور',
                    'برقراری تعادل مکانیکی اهرم با وزنه‌های نابرابر در فواصل مختلف',
                    'مزیت مکانیکی اهرم‌ها در انجام کارهای سنگین'
                ]
            },

            // -------------------------------------------------------------
            // GRADE 8 (پایه هشتم)
            // -------------------------------------------------------------
            {
                id: 'circuit',
                grade: 8,
                gradeTitle: 'پایه هشتم',
                title: 'کارگاه مدار الکتریکی و قانون اهم',
                topic: 'الکتریسیته جاری و مدار',
                icon: 'zap',
                badge: 'فیزیک هشتم — فصل ۹',
                phetUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_all.html',
                desc: 'میز کار تعاملی بستن مدارهای الکتریکی، اتصال متوالی (سری) و موازی، کلید قطع/وصل، فیوز محافظ جریان، و ولتمتر و آمپرمتر دیجیتال.',
                formula: 'V = I \\cdot R \\quad , \\quad P = V \\cdot I = I^2 R',
                goals: [
                    'تحقیق تجربی رابطه خطی ولتاژ و شدت جریان (قانون اهم)',
                    'مقایسه مقاومت معادل در اتصال متوالی (جمع) و موازی (کاهش)',
                    'نقش فیوز در پیشگیری از خطرات اتصال کوتاه'
                ]
            },
            {
                id: 'electrostatics',
                grade: 8,
                gradeTitle: 'پایه هشتم',
                title: 'الکتریسیته ساکن و الکتروسکوپ طلایی',
                topic: 'بار الکتریکی و پدیده‌ها',
                icon: 'sparkles',
                badge: 'فیزیک هشتم — فصل ۹',
                phetUrl: 'https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_all.html',
                desc: 'باردار کردن میله‌های شیشه‌ای و پلاستیکی از طریق مالش با ابریشم و پشم، روش القای الکترواستاتیک و لمس، مشاهده انحراف تیغه‌ها و اتصال به زمین.',
                formula: 'F_e = k \\frac{|q_1 q_2|}{r^2}',
                goals: [
                    'شناخت انواع بارهای الکتریکی مثبت و منفی و نیروی رانش/ربایش',
                    'تفاوت باردار کردن به روش القا در مقابل روش تماس',
                    'نحوه کارکرد الکتروسکوپ در تشخیص نوع و وجود بار'
                ]
            },
            {
                id: 'optics',
                grade: 8,
                gradeTitle: 'پایه هشتم',
                title: 'اپتیک، آینه‌ها، شکست نور و منشور',
                topic: 'نور و بازتاب و شکست',
                icon: 'eye',
                badge: 'فیزیک هشتم — فصل ۱۴ و ۱۵',
                phetUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html',
                desc: 'شبیه‌سازی بازتاب در آینه تخت و مقعر با کانون نوری، شکست نور در تیغه متوازی‌السطوح با قانون اسنل، و تجزیه نور سفید در منشور به رنگین‌کمان.',
                formula: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad , \\quad \\hat{i} = \\hat{r}',
                goals: [
                    'اثبات برابری زاویه تابش و بازتاب نسبت به خط عمود',
                    'رفتار نور هنگام عبور از محیط رقیق به غلیظ و نزدیک شدن به عمود',
                    'تجزیه نور در منشور ناشی از وابستگی ضریب شکست به طول موج'
                ]
            },
            {
                id: 'magnetism',
                grade: 8,
                gradeTitle: 'پایه هشتم',
                title: 'مغناطیس، خطوط میدان و قطب‌نما',
                topic: 'میدان‌های مغناطیسی',
                icon: 'compass',
                badge: 'فیزیک هشتم — فصل ۱۰',
                phetUrl: 'https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_all.html',
                desc: 'آهنربای میله‌ای دو قطبی (N و S)، قطب‌نمای متحرک در فضا، و پاشیدن براده‌های آهن برای مصورسازی خطوط میدان مغناطیسی.',
                formula: '\\vec{B} \\text{ lines emerge from N and enter S}',
                goals: [
                    'شناخت قطب‌های مغناطیسی و قانون جاذبه ناهم‌نام و دافعه هم‌نام',
                    'جهت‌گیری عقربه مغناطیسی در راستای خطوط میدان',
                    'بررسی پیوستگی و تقاطع نداشتن خطوط میدان مغناطیسی'
                ]
            },

            // -------------------------------------------------------------
            // GRADE 9 (پایه نهم)
            // -------------------------------------------------------------
            {
                id: 'newton',
                grade: 9,
                gradeTitle: 'پایه نهم',
                title: 'قوانین حرکت نیوتون، شتاب و اصطکاک',
                topic: 'نیرو و شتاب دینامیکی',
                icon: 'gauge',
                badge: 'فیزیک نهم — فصل ۵',
                phetUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
                desc: 'ارابه روی ریل هوا با شبیه‌سازی حرکت واقعی زمان، تنظیم نیروی پیشران، ضریب اصطکاک سطوح مختلف، کیلومترشمار و سرعت‌سنج عقربه‌ای.',
                formula: 'F_{net} = m \\cdot a \\quad , \\quad f_k = \\mu_k \\cdot m \\cdot g',
                goals: [
                    'بررسی تجربی رابطه مستقیم شتاب با نیروی خالص و معکوس با جرم',
                    'اثر نیروی اصطکاک جنبشی در کاهش شتاب متحرک',
                    'تحلیل همزمان نمودارهای سرعت-زمان و شتاب-زمان'
                ]
            },
            {
                id: 'hooke',
                grade: 9,
                gradeTitle: 'پایه نهم',
                title: 'قانون هوک و نیروسنج فنری کشسانی',
                topic: 'نیرو و انرژی کشسانی',
                icon: 'maximize-2',
                badge: 'فیزیک نهم — فصل ۵',
                phetUrl: 'https://phet.colorado.edu/sims/html/hookes-law/latest/hookes-law_all.html',
                desc: 'فنر آزمایشگاهی معلق با خط‌کش میلی‌متری، آویزان کردن وزنه‌های کالیبره، تعیین سختی فنر (k) و محاسبه انرژی پتانسیل کشسانی.',
                formula: 'F = k \\cdot \\Delta x \\quad , \\quad U_e = \\frac{1}{2}k(\\Delta x)^2',
                goals: [
                    'تحقیق رابطه خطی نیروی کشسانی با تغییر طول فنر',
                    'محاسبه شیب خط نمودار نیرو-تغییر طول به عنوان ثابت سختی فنر',
                    'انرژی ذخیره‌شده در فنر کشیده شده'
                ]
            },
            {
                id: 'pressure',
                grade: 9,
                gradeTitle: 'پایه نهم',
                title: 'فشار در شاره‌ها، لوله U شکل و اصل پاسکال',
                topic: 'فشار و شاره‌ها',
                icon: 'waves',
                badge: 'فیزیک نهم — فصل ۸',
                phetUrl: 'https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_all.html',
                desc: 'سه آزمایشگاه جامع: سنجش فشار در اعماق مایعات گوناگون، لوله U شکل دو مایعی غیرقابل اختلاط، و بالابر هیدرولیکی پاسکال.',
                formula: 'P = P_0 + \\rho g h \\quad , \\quad \\frac{F_1}{A_1} = \\frac{F_2}{A_2}',
                goals: [
                    'وابستگی فشار مایعات صرفاً به عمق، چگالی و شتاب گرانش',
                    'هم‌ترازی فشار در لوله‌های U شکل برای مایعات مختلف',
                    'تکثیر نیرو در بالابرهای هیدرولیکی بر پایه اصل پاسکال'
                ]
            },
            {
                id: 'solid_pressure',
                grade: 9,
                gradeTitle: 'پایه نهم',
                title: 'فشار جامدات و اثر سطح تماس',
                topic: 'فشار جامدات',
                icon: 'layers',
                badge: 'فیزیک نهم — فصل ۸',
                phetUrl: 'https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_all.html',
                desc: 'بلوک با ابعاد مختلف روی بستر ماسه و اسفنج، چرخش روی وجوه سه‌گانه و مشاهده عمق فرورفتگی متناسب با فشار وارد بر سطح.',
                formula: 'P = \\frac{F}{A} = \\frac{m \\cdot g}{A}',
                goals: [
                    'درک رابطه معکوس سطح تماس با فشار در نیروی ثابت',
                    'بررسی پدیده‌های روزمره (چاقوی تیز، پوتین‌های برفی، پای فیل)',
                    'محاسبه یکای پاسکال (N/m²) در هندسه‌های مختلف'
                ]
            },
            {
                id: 'waves',
                grade: 9,
                gradeTitle: 'پایه نهم',
                title: 'انتشار امواج مکانیکی و فرکانس نوسان',
                topic: 'موج و نوسان',
                icon: 'activity',
                badge: 'فیزیک نهم — فصل ۱۵',
                phetUrl: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_all.html',
                desc: 'نوسان‌ساز هارمونیک، تغییر بسامد، دامنه و تندی انتشار موج در طناب، و اندازه‌گیری طول موج با خط‌کش مجازی.',
                formula: 'v = \\lambda \\cdot f \\quad , \\quad T = \\frac{1}{f}',
                goals: [
                    'تعریف طول موج، دامنه نوسان و بسامد (فرکانس)',
                    'رابطه مستقیم تندی انتشار با طول موج و بسامد',
                    'مشاهده انتقال انرژی بدون انتقال ماده'
                ]
            }
        ];
    }

    /**
     * Determines which simulator to mount for a given lesson
     */
    getSimulatorForLesson(lesson) {
        if (!lesson) return null;
        const slug = (lesson.slug || '').toLowerCase();
        const title = (lesson.title_fa || '').toLowerCase();
        const simType = (lesson.simulator_type || '').toLowerCase();

        if (simType && simType !== 'none') {
            if (simType === 'gravity') return 'newton';
            if (simType === 'thermodynamics') return 'calorimetry';
            if (this.catalog.some(c => c.id === simType)) return simType;
        }

        if (slug.includes('density') || slug.includes('volume') || title.includes('چگالی') || title.includes('اندازه‌گیری')) return 'density';
        if (slug.includes('circuit') || slug.includes('electricity') || slug.includes('current') || title.includes('الکتریسیته') || title.includes('مدار') || title.includes('اهم')) return 'circuit';
        if (slug.includes('newton') || slug.includes('force') || slug.includes('motion') || title.includes('نیرو') || title.includes('حرکت') || title.includes('شتاب')) return 'newton';
        if (slug.includes('pressure') || slug.includes('fluid') || title.includes('فشار') || title.includes('شاره')) return 'pressure';
        if (slug.includes('light') || slug.includes('refraction') || slug.includes('lens') || slug.includes('optics') || title.includes('نور') || title.includes('شکست') || title.includes('عدسی') || title.includes('آینه')) return 'optics';
        if (slug.includes('heat') || slug.includes('temp') || title.includes('دما') || title.includes('گرما')) return 'calorimetry';
        if (slug.includes('energy') || title.includes('انرژی')) return 'energy';
        if (slug.includes('lever') || title.includes('اهرم') || title.includes('گشتاور')) return 'levers';
        if (slug.includes('static') || slug.includes('electro') || title.includes('ساکن') || title.includes('الکتروسکوپ')) return 'electrostatics';
        if (slug.includes('magnet') || title.includes('مغناطیس') || title.includes('آهنربا')) return 'magnetism';
        if (slug.includes('spring') || slug.includes('hooke') || title.includes('فنر') || title.includes('هوک')) return 'hooke';
        if (slug.includes('wave') || title.includes('موج') || title.includes('نوسان')) return 'waves';

        return null;
    }

    /**
     * Mounts a simulator into a DOM element
     */
    mount(type, containerId, mode = 'native') {
        const el = document.getElementById(containerId);
        if (!el) return;

        // Cleanup any active animation loops
        if (this.animationFrames[containerId]) {
            cancelAnimationFrame(this.animationFrames[containerId]);
            delete this.animationFrames[containerId];
        }

        if (mode === 'phet') {
            const labDef = this.catalog.find(c => c.id === type) || this.catalog[0];
            this.renderPhetSim(el, labDef);
            return;
        }

        // Native Simulators
        switch (type) {
            case 'density':
                this.renderDensitySim(el);
                break;
            case 'calorimetry':
                this.renderCalorimetrySim(el);
                break;
            case 'energy':
                this.renderEnergySim(el);
                break;
            case 'levers':
                this.renderLeversSim(el);
                break;
            case 'circuit':
                this.renderCircuitSim(el);
                break;
            case 'electrostatics':
                this.renderElectrostaticsSim(el);
                break;
            case 'optics':
                this.renderOpticsSim(el);
                break;
            case 'magnetism':
                this.renderMagnetismSim(el);
                break;
            case 'newton':
                this.renderNewtonSim(el);
                break;
            case 'hooke':
                this.renderHookeSim(el);
                break;
            case 'pressure':
                this.renderPressureSim(el);
                break;
            case 'solid_pressure':
                this.renderSolidPressureSim(el);
                break;
            case 'waves':
                this.renderWavesSim(el);
                break;
            default:
                this.renderDensitySim(el);
        }

        if (window.renderMathInPage) {
            setTimeout(() => window.renderMathInPage(el), 50);
        }
        if (window.lucide) {
            setTimeout(() => window.lucide.createIcons(), 50);
        }
    }

    // =========================================================================
    // 1. DENSITY & BUOYANCY SIMULATOR (پایه هفتم: چگالی، استوانه مدرج و ارشمیدس)
    // =========================================================================
    renderDensitySim(container) {
        let mass = 150; // g
        let volume = 100; // cm3
        let liquidDensity = 1.0; // g/cm3 (pure water)
        let liquidName = 'آب خالص';

        const update = () => {
            const solidDensity = mass / volume; // g/cm3
            const solidDensityKg = Math.round(solidDensity * 1000);
            const liquidDensityKg = Math.round(liquidDensity * 1000);

            // Immersion physics
            let submergedPercent = 0;
            let statusText = '';
            let statusColor = '';
            let blockYPercent = 20; // top offset in beaker

            if (solidDensity < liquidDensity - 0.01) {
                submergedPercent = Math.min(99, Math.round((solidDensity / liquidDensity) * 100));
                statusText = `شناور روی سطح مایع (نیروی شناوری = وزن جسم)`;
                statusColor = 'text-cyan-400';
                blockYPercent = 18 - (100 - submergedPercent) * 0.12;
            } else if (solidDensity <= liquidDensity + 0.01) {
                submergedPercent = 100;
                statusText = `غوطه‌ور معلق در مایع (چگالی جسم = چگالی مایع)`;
                statusColor = 'text-amber-400';
                blockYPercent = 48;
            } else {
                submergedPercent = 100;
                statusText = `ته‌نشین شده در کف ظرف (وزن جسم > نیروی شناوری ارشمیدس)`;
                statusColor = 'text-rose-400';
                blockYPercent = 76;
            }

            // Displaced volume
            const displacedVolume = Math.round((submergedPercent / 100) * volume);
            const buoyantForceN = ((displacedVolume * liquidDensity / 1000) * 9.8).toFixed(2);
            const weightN = ((mass / 1000) * 9.8).toFixed(2);

            // Store current state for lab report generator
            this.currentLiveState = {
                labId: 'density',
                title: 'آزمایش چگالی و اصل شناوری ارشمیدس',
                params: {
                    'مایع آزمایشی': `${liquidName} (ρ = ${liquidDensity} g/cm³)`,
                    'جرم جسم (m)': `${mass} گرم`,
                    'حجم جسم (V)': `${volume} سانتی‌متر مکعب`,
                    'چگالی جسم (ρ = m/V)': `${solidDensity.toFixed(2)} g/cm³ (${solidDensityKg} kg/m³)`,
                    'حجم جابجا شده (ΔV)': `${displacedVolume} mL`,
                    'نیروی شناوری ارشمیدس (F_B)': `${buoyantForceN} نیوتون`,
                    'نیروی وزن (W)': `${weightN} نیوتون`,
                    'وضعیت فیزیکی': statusText
                }
            };

            // Update DOM
            const mVal = document.getElementById('sim-dens-m-val');
            const vVal = document.getElementById('sim-dens-v-val');
            const dVal = document.getElementById('sim-dens-d-val');
            const fbVal = document.getElementById('sim-dens-fb-val');
            const statusEl = document.getElementById('sim-dens-status');
            const blockEl = document.getElementById('sim-dens-block');
            const vDeltaEl = document.getElementById('sim-dens-vdelta');

            if (mVal) mVal.innerText = `${mass} g`;
            if (vVal) vVal.innerText = `${volume} cm³`;
            if (dVal) dVal.innerText = `${solidDensity.toFixed(2)} g/cm³ (${solidDensityKg} kg/m³)`;
            if (fbVal) fbVal.innerText = `${buoyantForceN} N (وزن: ${weightN} N)`;
            if (vDeltaEl) vDeltaEl.innerText = `حجم مایع جابجاشده: ${displacedVolume} mL`;
            if (statusEl) {
                statusEl.innerText = statusText;
                statusEl.className = `font-bold text-xs ${statusColor}`;
            }
            if (blockEl) {
                blockEl.style.top = `${blockYPercent}%`;
                const scale = Math.min(1.3, Math.max(0.7, 0.7 + (volume / 500) * 0.6));
                blockEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
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

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <!-- Left Column: Controls & Presets -->
                <div class="lg:col-span-7 space-y-5">
                    <!-- Liquid Selector -->
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">انتخاب مایع درون ظرف:</label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <button id="liq-water" class="dens-liq-btn p-2 rounded-xl bg-cyan-600 text-white font-bold border border-cyan-400 transition-all text-center">
                                آب خالص (۱٫۰۰)
                            </button>
                            <button id="liq-salt" class="dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">
                                آب‌نمک غلیظ (۱٫۲۰)
                            </button>
                            <button id="liq-oil" class="dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">
                                روغن مایع (۰٫۹۲)
                            </button>
                            <button id="liq-alcohol" class="dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">
                                الکل صنعتی (۰٫۷۹)
                            </button>
                        </div>
                    </div>

                    <!-- Material Presets -->
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">اجسام نمونه کتاب درسی هفتم:</label>
                        <div class="flex flex-wrap gap-1.5 text-xs">
                            <button id="mat-cork" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">چوب‌پنبه (۰٫۲۴)</button>
                            <button id="mat-wood" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">چوب راش (۰٫۷۰)</button>
                            <button id="mat-ice" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">یخ (۰٫۹۲)</button>
                            <button id="mat-alu" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">آلومینیوم (۲٫۷۰)</button>
                            <button id="mat-iron" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">آهن (۷٫۸۷)</button>
                            <button id="mat-gold" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">طلا (۱۹٫۳)</button>
                        </div>
                    </div>

                    <!-- Sliders -->
                    <div class="space-y-4 pt-1">
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

                    <!-- Calculated Telemetry Cards -->
                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                            <span class="text-[11px] text-slate-400 block mb-0.5">چگالی محاسبه‌شده (ρ = m/V):</span>
                            <span id="sim-dens-d-val" class="text-sm font-black text-amber-400 font-mono">1.50 g/cm³</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                            <span class="text-[11px] text-slate-400 block mb-0.5">نیروی شناوری ارشمیدس:</span>
                            <span id="sim-dens-fb-val" class="text-sm font-black text-emerald-400 font-mono">0.98 N</span>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-slate-400 font-bold">وضعیت فیزیکی جسم:</span>
                            <span id="sim-dens-status" class="font-bold text-xs text-rose-400">ته‌نشین شده</span>
                        </div>
                        <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                            <span id="sim-dens-vdelta">حجم مایع جابجاشده: ۱۰۰ mL</span>
                            <span class="text-cyan-400">روش استوانه مدرج (ΔV)</span>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Visual Physics Apparatus (Graduated Cylinder & Beaker) -->
                <div class="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[340px]">
                    <div class="relative w-48 h-72 rounded-b-3xl border-4 border-t-0 border-slate-500/50 bg-gradient-to-b from-transparent via-cyan-950/20 to-blue-950/50 overflow-hidden shadow-2xl">
                        <!-- Liquid Column -->
                        <div id="sim-dens-liquid-col" class="absolute inset-x-0 bottom-0 top-[20%] bg-cyan-500/25 border-t-2 border-cyan-300/80 backdrop-blur-xs transition-colors duration-300">
                            <!-- Graduation ticks -->
                            <div class="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-[8px] text-cyan-200/50 font-mono select-none">
                                <span>- 500 mL</span>
                                <span>- 400 mL</span>
                                <span>- 300 mL</span>
                                <span>- 200 mL</span>
                                <span>- 100 mL</span>
                            </div>

                            <!-- Floating/Sinking Solid Block -->
                            <div id="sim-dens-block" class="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-[10px] font-black text-white transition-all duration-300">
                                <span>جسم</span>
                                <span class="text-[8px] font-mono opacity-80">Solid</span>
                            </div>
                        </div>

                        <!-- Glass reflections -->
                        <div class="absolute left-1 inset-y-0 w-2 bg-white/10 rounded-full blur-[1px]"></div>
                    </div>
                    <span class="text-[11px] text-slate-400 font-bold mt-3">استوانه مدرج ۵۰۰ میلی‌لیتری آزمایشگاه</span>
                </div>
            </div>
        </div>
        `;

        // Event Listeners
        const mSlider = document.getElementById('sim-dens-m-slider');
        const vSlider = document.getElementById('sim-dens-v-slider');
        if (mSlider) mSlider.addEventListener('input', (e) => { mass = parseFloat(e.target.value); update(); });
        if (vSlider) vSlider.addEventListener('input', (e) => { volume = parseFloat(e.target.value); update(); });

        // Liquid buttons
        const setLiquid = (dens, name, btnId) => {
            liquidDensity = dens;
            liquidName = name;
            document.querySelectorAll('.dens-liq-btn').forEach(b => {
                b.className = 'dens-liq-btn p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'dens-liq-btn p-2 rounded-xl bg-cyan-600 text-white font-bold border border-cyan-400 transition-all text-center';
            update();
        };

        document.getElementById('liq-water')?.addEventListener('click', () => setLiquid(1.0, 'آب خالص', 'liq-water'));
        document.getElementById('liq-salt')?.addEventListener('click', () => setLiquid(1.2, 'آب‌نمک غلیظ', 'liq-salt'));
        document.getElementById('liq-oil')?.addEventListener('click', () => setLiquid(0.92, 'روغن مایع', 'liq-oil'));
        document.getElementById('liq-alcohol')?.addEventListener('click', () => setLiquid(0.79, 'الکل صنعتی', 'liq-alcohol'));

        // Solid presets
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
    // 2. CALORIMETRY & HEAT SIMULATOR (پایه هفتم: دما، دماسنجی و تبادل حرارتی)
    // =========================================================================
    renderCalorimetrySim(container) {
        let tempC = 25; // Celsius
        let m1 = 100; // g of water 1
        let t1 = 20; // °C
        let m2 = 100; // g of water 2
        let t2 = 80; // °C

        const update = () => {
            const tempK = (tempC + 273.15).toFixed(1);
            const tempF = (tempC * 1.8 + 32).toFixed(1);
            const teq = ((m1 * t1 + m2 * t2) / (m1 + m2)).toFixed(1);

            this.currentLiveState = {
                labId: 'calorimetry',
                title: 'آزمایش دماسنجی و تعادل گرمایی',
                params: {
                    'دمای سلسیوس (θ)': `${tempC} °C`,
                    'دمای کلوین (T)': `${tempK} K`,
                    'دمای فارنهایت (F)': `${tempF} °F`,
                    'ظرف ۱ (آب سرد)': `${m1}g در دمای ${t1}°C`,
                    'ظرف ۲ (آب گرم)': `${m2}g در دمای ${t2}°C`,
                    'دمای تعادل محاسبه‌شده (T_eq)': `${teq} °C`
                }
            };

            const cVal = document.getElementById('sim-cal-c-val');
            const kVal = document.getElementById('sim-cal-k-val');
            const fVal = document.getElementById('sim-cal-f-val');
            const teqVal = document.getElementById('sim-cal-teq-val');
            const mercEl = document.getElementById('sim-cal-mercury');

            if (cVal) cVal.innerText = `${tempC} °C`;
            if (kVal) kVal.innerText = `${tempK} K`;
            if (fVal) fVal.innerText = `${tempF} °F`;
            if (teqVal) teqVal.innerText = `${teq} °C`;

            if (mercEl) {
                const percent = Math.min(95, Math.max(5, ((tempC + 20) / 140) * 100));
                mercEl.style.height = `${percent}%`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-amber-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                    <h4 class="font-black text-base text-amber-300">کارگاه دماسنجی چندمقیاسی و تعادل گرمایی (Q = mcΔT)</h4>
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

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <!-- Controls -->
                <div class="lg:col-span-8 space-y-5">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">دمای اندازه‌گیری‌شده دماسنج (سلسیوس °C):</span>
                            <span id="sim-cal-c-val" class="text-amber-400 font-mono font-bold">25 °C</span>
                        </div>
                        <input type="range" min="-20" max="120" step="1" value="25" id="sim-cal-slider" class="physics-slider w-full" />
                    </div>

                    <!-- 3 Scales Display -->
                    <div class="grid grid-cols-3 gap-3">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[11px] text-slate-400 block mb-0.5">سلسیوس (°C)</span>
                            <span id="sim-cal-c-disp" class="text-base font-black text-cyan-400 font-mono">۲۵ °C</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[11px] text-slate-400 block mb-0.5">کلوین (SI)</span>
                            <span id="sim-cal-k-val" class="text-base font-black text-amber-400 font-mono">298.2 K</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[11px] text-slate-400 block mb-0.5">فارنهایت (°F)</span>
                            <span id="sim-cal-f-val" class="text-base font-black text-purple-400 font-mono">77.0 °F</span>
                        </div>
                    </div>

                    <!-- Calorimetry Mixture Lab -->
                    <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <h5 class="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <i data-lucide="flame" class="w-4 h-4 text-amber-400"></i>
                            <span>شبیه‌ساز اختلاط مایعات و دمای تعادل (Calorimeter)</span>
                        </h5>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <label class="text-slate-400 block mb-1">ظرف ۱ (آب سرد): m₁ = 100g, T₁ = 20°C</label>
                                <input type="range" min="10" max="40" value="20" id="sim-cal-t1" class="physics-slider w-full" />
                            </div>
                            <div>
                                <label class="text-slate-400 block mb-1">ظرف ۲ (آب گرم): m₂ = 100g, T₂ = 80°C</label>
                                <input type="range" min="50" max="95" value="80" id="sim-cal-t2" class="physics-slider w-full" />
                            </div>
                        </div>
                        <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                            <span class="text-slate-400">دمای تعادل مخلوط (Q_تلفات = ۰):</span>
                            <span id="sim-cal-teq-val" class="text-emerald-400 font-black text-base font-mono">50.0 °C</span>
                        </div>
                    </div>
                </div>

                <!-- Thermometer Graphic -->
                <div class="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[300px]">
                    <div class="relative w-16 h-64 flex flex-col items-center">
                        <!-- Stem -->
                        <div class="w-5 h-52 rounded-t-full bg-slate-800 border-2 border-slate-500 overflow-hidden relative shadow-inner">
                            <div id="sim-cal-mercury" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-600 to-rose-500 rounded-t-full transition-all duration-200" style="height: 35%;"></div>
                        </div>
                        <!-- Bulb -->
                        <div class="w-12 h-12 -mt-3 rounded-full bg-red-600 border-2 border-slate-400 shadow-xl flex items-center justify-center">
                            <i data-lucide="thermometer" class="w-6 h-6 text-white/90"></i>
                        </div>
                    </div>
                    <span class="text-[11px] text-slate-400 font-bold mt-2">دماسنج الکلی/جیوه‌ای</span>
                </div>
            </div>
        </div>
        `;

        const sSlider = document.getElementById('sim-cal-slider');
        const t1Slider = document.getElementById('sim-cal-t1');
        const t2Slider = document.getElementById('sim-cal-t2');

        if (sSlider) sSlider.addEventListener('input', (e) => {
            tempC = parseFloat(e.target.value);
            const cDisp = document.getElementById('sim-cal-c-disp');
            if (cDisp) cDisp.innerText = `${tempC} °C`;
            update();
        });
        if (t1Slider) t1Slider.addEventListener('input', (e) => { t1 = parseFloat(e.target.value); update(); });
        if (t2Slider) t2Slider.addEventListener('input', (e) => { t2 = parseFloat(e.target.value); update(); });

        update();
    }

    // =========================================================================
    // 3. ENERGY TRANSFORMATION SIMULATOR (پایه هفتم: تبدیلات و پایستگی انرژی)
    // =========================================================================
    renderEnergySim(container) {
        let heightM = 15; // meters
        let massKg = 5; // kg
        let curHeightM = 15;

        const update = () => {
            const g = 9.8;
            const totalEnergy = massKg * g * heightM;
            const u = massKg * g * curHeightM;
            const k = Math.max(0, totalEnergy - u);
            const speed = Math.sqrt((2 * k) / massKg);

            this.currentLiveState = {
                labId: 'energy',
                title: 'آزمایش تبدیل و پایستگی انرژی مکانیکی',
                params: {
                    'ارتفاع اولیه (h₀)': `${heightM} متر`,
                    'ارتفاع فعلی (h)': `${curHeightM} متر`,
                    'جرم متحرک (m)': `${massKg} کیلوگرم`,
                    'انرژی پتانسیل گرانشی (U = mgh)': `${Math.round(u)} ژول (J)`,
                    'انرژی جنبشی (K = 1/2 mv²)': `${Math.round(k)} ژول (J)`,
                    'انرژی مکانیکی کل (E = U + K)': `${Math.round(totalEnergy)} ژول (J)`,
                    'سرعت لحظه‌ای (v)': `${speed.toFixed(2)} متر بر ثانیه`
                }
            };

            const hVal = document.getElementById('sim-en-h-val');
            const mVal = document.getElementById('sim-en-m-val');
            const curHVal = document.getElementById('sim-en-curh-val');
            const uBar = document.getElementById('sim-en-u-bar');
            const kBar = document.getElementById('sim-en-k-bar');
            const speedVal = document.getElementById('sim-en-v-val');

            if (hVal) hVal.innerText = `${heightM} m`;
            if (mVal) mVal.innerText = `${massKg} kg`;
            if (curHVal) curHVal.innerText = `${curHeightM} m`;
            if (speedVal) speedVal.innerText = `${speed.toFixed(1)} m/s (${Math.round(speed * 3.6)} km/h)`;

            const uPercent = Math.round((u / totalEnergy) * 100);
            const kPercent = Math.round((k / totalEnergy) * 100);

            if (uBar) {
                uBar.style.width = `${uPercent}%`;
                uBar.innerText = `U: ${Math.round(u)} J (${uPercent}%)`;
            }
            if (kBar) {
                kBar.style.width = `${kPercent}%`;
                kBar.innerText = `K: ${Math.round(k)} J (${kPercent}%)`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <h4 class="font-black text-base text-emerald-300">کارگاه پایستگی و تبدیلات انرژی پتانسیل و جنبشی</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">پایه هفتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-emerald-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-energy" onclick="window.claimLabXp('energy', 'تبدیلات و پایستگی انرژی')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div class="space-y-5">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">ارتفاع اولیه رهاسازی (h₀):</span>
                            <span id="sim-en-h-val" class="text-emerald-400 font-mono font-bold">15 m</span>
                        </div>
                        <input type="range" min="5" max="30" value="15" id="sim-en-h-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">جرم متحرک (m):</span>
                            <span id="sim-en-m-val" class="text-blue-400 font-mono font-bold">5 kg</span>
                        </div>
                        <input type="range" min="1" max="20" value="5" id="sim-en-m-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">موقعیت در مسیر فرود (ارتفاع لحظه‌ای h):</span>
                            <span id="sim-en-curh-val" class="text-amber-400 font-mono font-bold">15 m</span>
                        </div>
                        <input type="range" min="0" max="15" value="15" id="sim-en-curh-slider" class="physics-slider w-full" />
                    </div>
                </div>

                <!-- Energy Bars Graphic -->
                <div class="space-y-4 p-5 rounded-3xl bg-slate-950/80 border border-slate-800">
                    <span class="text-xs font-bold text-slate-300 block mb-2">توزیع زنده انرژی مکانیکی:</span>
                    <div>
                        <span class="text-[11px] text-blue-400 font-bold block mb-1">انرژی پتانسیل گرانشی (U = mgh):</span>
                        <div class="w-full bg-slate-800 rounded-xl h-6 overflow-hidden">
                            <div id="sim-en-u-bar" class="h-full bg-blue-500 font-mono text-[10px] text-white flex items-center justify-center transition-all duration-150" style="width: 100%;">
                                U: 735 J (100%)
                            </div>
                        </div>
                    </div>

                    <div>
                        <span class="text-[11px] text-emerald-400 font-bold block mb-1">انرژی جنبشی حرکتی (K = ½mv²):</span>
                        <div class="w-full bg-slate-800 rounded-xl h-6 overflow-hidden">
                            <div id="sim-en-k-bar" class="h-full bg-emerald-500 font-mono text-[10px] text-white flex items-center justify-center transition-all duration-150" style="width: 0%;">
                                K: 0 J (0%)
                            </div>
                        </div>
                    </div>

                    <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span class="text-xs text-slate-400">تندی سرعت‌سنج (v = √(2gΔh)):</span>
                        <span id="sim-en-v-val" class="text-base font-black text-amber-400 font-mono">0.0 m/s (0 km/h)</span>
                    </div>
                </div>
            </div>
        </div>
        `;

        const hSlider = document.getElementById('sim-en-h-slider');
        const mSlider = document.getElementById('sim-en-m-slider');
        const curHSlider = document.getElementById('sim-en-curh-slider');

        if (hSlider) hSlider.addEventListener('input', (e) => {
            heightM = parseFloat(e.target.value);
            if (curHSlider) {
                curHSlider.max = heightM;
                curHSlider.value = heightM;
                curHeightM = heightM;
            }
            update();
        });
        if (mSlider) mSlider.addEventListener('input', (e) => { massKg = parseFloat(e.target.value); update(); });
        if (curHSlider) curHSlider.addEventListener('input', (e) => { curHeightM = parseFloat(e.target.value); update(); });

        update();
    }

    // =========================================================================
    // 4. LEVERS & TORQUE SIMULATOR (پایه هفتم: اهرم‌ها و گشتاور)
    // =========================================================================
    renderLeversSim(container) {
        let m1 = 20; // kg left
        let d1 = 2; // m left
        let m2 = 10; // kg right
        let d2 = 4; // m right

        const update = () => {
            const tau1 = m1 * d1;
            const tau2 = m2 * d2;
            const diff = tau1 - tau2;

            let balanceStatus = '';
            let balanceColor = '';
            let tiltAngle = 0;

            if (Math.abs(diff) < 0.5) {
                balanceStatus = 'کاملاً در حال تعادل افقی (m₁d₁ = m₂d₂)';
                balanceColor = 'text-emerald-400';
                tiltAngle = 0;
            } else if (diff > 0) {
                balanceStatus = 'متمایل به سمت چپ (گشتاور چپ بیشتر است)';
                balanceColor = 'text-amber-400';
                tiltAngle = -Math.min(15, diff * 0.4);
            } else {
                balanceStatus = 'متمایل به سمت راست (گشتاور راست بیشتر است)';
                balanceColor = 'text-purple-400';
                tiltAngle = Math.min(15, Math.abs(diff) * 0.4);
            }

            this.currentLiveState = {
                labId: 'levers',
                title: 'آزمایش اهرم‌ها و تعادل گشتاور',
                params: {
                    'سمت چپ': `${m1}kg در فاصله ${d1}m (گشتاور: ${tau1} N.m)`,
                    'سمت راست': `${m2}kg در فاصله ${d2}m (گشتاور: ${tau2} N.m)`,
                    'وضعیت اهرم': balanceStatus
                }
            };

            const t1El = document.getElementById('sim-lev-t1');
            const t2El = document.getElementById('sim-lev-t2');
            const statEl = document.getElementById('sim-lev-status');
            const beamEl = document.getElementById('sim-lev-beam');

            if (t1El) t1El.innerText = `${tau1} N.m`;
            if (t2El) t2El.innerText = `${tau2} N.m`;
            if (statEl) {
                statEl.innerText = balanceStatus;
                statEl.className = `font-bold text-xs ${balanceColor}`;
            }
            if (beamEl) {
                beamEl.style.transform = `rotate(${tiltAngle}deg)`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-indigo-400 animate-ping"></span>
                    <h4 class="font-black text-base text-indigo-300">کارگاه تعادل مکانیکی اهرم و قانون گشتاورها (m₁d₁ = m₂d₂)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">پایه هفتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-indigo-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-levers" onclick="window.claimLabXp('levers', 'اهرم‌ها و تعادل گشتاور')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <!-- Controls -->
                <div class="space-y-4">
                    <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                        <span class="text-xs font-bold text-amber-300 block">وزنه سمت چپ (بازوی ۱):</span>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <label class="text-slate-400 block mb-1">جرم وزنه (m₁): <span id="sim-lev-m1-val">20</span> kg</label>
                                <input type="range" min="5" max="50" step="5" value="20" id="sim-lev-m1" class="physics-slider w-full" />
                            </div>
                            <div>
                                <label class="text-slate-400 block mb-1">فاصله از تکیه‌گاه (d₁): <span id="sim-lev-d1-val">2</span> m</label>
                                <input type="range" min="1" max="5" step="0.5" value="2" id="sim-lev-d1" class="physics-slider w-full" />
                            </div>
                        </div>
                        <div class="text-[11px] text-slate-400">گشتاور چپ: <span id="sim-lev-t1" class="font-bold text-amber-400 font-mono">40 N.m</span></div>
                    </div>

                    <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                        <span class="text-xs font-bold text-cyan-300 block">وزنه سمت راست (بازوی ۲):</span>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <label class="text-slate-400 block mb-1">جرم وزنه (m₂): <span id="sim-lev-m2-val">10</span> kg</label>
                                <input type="range" min="5" max="50" step="5" value="10" id="sim-lev-m2" class="physics-slider w-full" />
                            </div>
                            <div>
                                <label class="text-slate-400 block mb-1">فاصله از تکیه‌گاه (d₂): <span id="sim-lev-d2-val">4</span> m</label>
                                <input type="range" min="1" max="5" step="0.5" value="4" id="sim-lev-d2" class="physics-slider w-full" />
                            </div>
                        </div>
                        <div class="text-[11px] text-slate-400">گشتاور راست: <span id="sim-lev-t2" class="font-bold text-cyan-400 font-mono">40 N.m</span></div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                        <span class="text-xs text-slate-400">وضعیت پایداری:</span>
                        <span id="sim-lev-status" class="font-bold text-xs text-emerald-400">کاملاً در حال تعادل</span>
                    </div>
                </div>

                <!-- Seesaw Visualization -->
                <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
                    <div class="relative w-full max-w-[320px] h-36 flex flex-col items-center justify-center">
                        <!-- Pivoting Beam -->
                        <div id="sim-lev-beam" class="w-full h-4 bg-gradient-to-r from-amber-600 via-slate-400 to-cyan-600 rounded-full shadow-lg relative transition-transform duration-300 origin-center flex items-center justify-between px-4">
                            <!-- Left Weight -->
                            <div class="w-8 h-8 rounded-lg bg-amber-500 border border-amber-300 -translate-y-6 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-md">
                                m₁
                            </div>
                            <!-- Fulcrum Center Marker -->
                            <div class="w-2 h-2 rounded-full bg-white"></div>
                            <!-- Right Weight -->
                            <div class="w-8 h-8 rounded-lg bg-cyan-500 border border-cyan-300 -translate-y-6 flex items-center justify-center text-[10px] font-black text-slate-900 shadow-md">
                                m₂
                            </div>
                        </div>

                        <!-- Triangular Fulcrum -->
                        <div class="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-slate-500 mt-0 shadow-lg"></div>
                        <div class="w-28 h-2 bg-slate-600 rounded-full mt-1"></div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const m1El = document.getElementById('sim-lev-m1');
        const d1El = document.getElementById('sim-lev-d1');
        const m2El = document.getElementById('sim-lev-m2');
        const d2El = document.getElementById('sim-lev-d2');

        if (m1El) m1El.addEventListener('input', (e) => { m1 = parseFloat(e.target.value); document.getElementById('sim-lev-m1-val').innerText = m1; update(); });
        if (d1El) d1El.addEventListener('input', (e) => { d1 = parseFloat(e.target.value); document.getElementById('sim-lev-d1-val').innerText = d1; update(); });
        if (m2El) m2El.addEventListener('input', (e) => { m2 = parseFloat(e.target.value); document.getElementById('sim-lev-m2-val').innerText = m2; update(); });
        if (d2El) d2El.addEventListener('input', (e) => { d2 = parseFloat(e.target.value); document.getElementById('sim-lev-d2-val').innerText = d2; update(); });

        update();
    }

    // =========================================================================
    // 5. OHM'S LAW & CIRCUIT SIMULATOR (پایه هشتم: مدار الکتریکی و قانون اهم)
    // =========================================================================
    renderCircuitSim(container) {
        let voltage = 12; // Volts
        let r1 = 6; // Ohms
        let r2 = 6; // Ohms
        let circuitMode = 'single'; // 'single', 'series', 'parallel'
        let isSwitchOn = true;
        let isFuseBlown = false;

        const update = () => {
            let req = r1;
            if (circuitMode === 'series') {
                req = r1 + r2;
            } else if (circuitMode === 'parallel') {
                req = (r1 * r2) / (r1 + r2);
            }

            let current = 0;
            if (isSwitchOn && !isFuseBlown) {
                current = voltage / req;
            }

            // Check Fuse Trip (> 4.5 Amperes)
            if (current > 4.5 && !isFuseBlown) {
                isFuseBlown = true;
                current = 0;
            }

            const power = current > 0 ? voltage * current : 0;

            this.currentLiveState = {
                labId: 'circuit',
                title: 'آزمایش مدار الکتریکی و قانون اهم',
                params: {
                    'حالت مدار': circuitMode === 'single' ? 'تک لامپی' : (circuitMode === 'series' ? 'اتصال متوالی (سری)' : 'اتصال موازی'),
                    'ولتاژ باتری (V)': `${voltage} ولت`,
                    'مقاومت ۱ (R₁)': `${r1} اهم`,
                    'مقاومت ۲ (R₂)': circuitMode !== 'single' ? `${r2} اهم` : 'غیرفعال',
                    'مقاومت معادل کل (R_eq)': `${req.toFixed(2)} اهم`,
                    'شدت جریان کل (I = V/R)': `${current.toFixed(2)} آمپر`,
                    'توان کل مصرفی (P = VI)': `${power.toFixed(1)} وات`,
                    'وضعیت کلید و فیوز': isFuseBlown ? 'فیوز سوخته (اتصال کوتاه/اضافه بار)' : (isSwitchOn ? 'کلید وصل' : 'کلید قطع')
                }
            };

            const vVal = document.getElementById('sim-cir-v-val');
            const r1Val = document.getElementById('sim-cir-r1-val');
            const r2Val = document.getElementById('sim-cir-r2-val');
            const reqVal = document.getElementById('sim-cir-req-val');
            const iVal = document.getElementById('sim-cir-i-val');
            const pVal = document.getElementById('sim-cir-p-val');
            const bulb = document.getElementById('sim-cir-bulb');
            const fuseNotice = document.getElementById('sim-cir-fuse-notice');
            const wires = document.querySelectorAll('.circuit-wire');

            if (vVal) vVal.innerText = `${voltage} V`;
            if (r1Val) r1Val.innerText = `${r1} Ω`;
            if (r2Val) r2Val.innerText = `${r2} Ω`;
            if (reqVal) reqVal.innerText = `${req.toFixed(2)} Ω`;
            if (iVal) iVal.innerText = `${current.toFixed(2)} A`;
            if (pVal) pVal.innerText = `${power.toFixed(1)} W`;

            if (fuseNotice) {
                fuseNotice.className = isFuseBlown ? 'p-2 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-bold block animate-pulse' : 'hidden';
            }

            if (bulb) {
                if (current > 0) {
                    const brightness = Math.min(1.2, power / 30);
                    bulb.style.filter = `drop-shadow(0 0 ${12 + brightness * 25}px rgba(251, 191, 36, ${0.4 + brightness * 0.6}))`;
                    bulb.style.fill = `rgb(251, ${Math.round(180 + brightness * 70)}, 36)`;
                } else {
                    bulb.style.filter = 'none';
                    bulb.style.fill = '#475569';
                }
            }

            wires.forEach(w => {
                if (current > 0) {
                    w.classList.add('circuit-wire-active');
                    w.style.animationDuration = `${Math.max(0.25, 2.0 - current * 0.35)}s`;
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

            <div id="sim-cir-fuse-notice" class="hidden">
                ⚠️ هشدار ایمنی: جریان بیش از حد مجاز (۴٫۵ آمپر) باعث قطع خودکار فیوز مدار شد! مقاومت را افزایش دهید یا ولتاژ را کم کنید.
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

                        <!-- Battery DC Source -->
                        <g transform="translate(30, 80)">
                            <rect x="0" y="0" width="20" height="40" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="4" />
                            <line x1="10" y1="8" x2="10" y2="20" stroke="#f87171" stroke-width="2" />
                            <line x1="4" y1="14" x2="16" y2="14" stroke="#f87171" stroke-width="2" />
                            <line x1="4" y1="30" x2="16" y2="30" stroke="#60a5fa" stroke-width="2" />
                            <text x="-6" y="24" fill="#93c5fd" font-size="9" font-weight="bold">باتری</text>
                        </g>

                        <!-- Bulb 1 -->
                        <g transform="translate(130, 20)">
                            <circle id="sim-cir-bulb" cx="10" cy="10" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
                            <text x="5" y="14" fill="#0f172a" font-size="10" font-weight="bold">R₁</text>
                        </g>

                        <!-- Ammeter -->
                        <g transform="translate(230, 80)">
                            <circle cx="10" cy="20" r="14" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
                            <text x="6" y="24" fill="#22d3ee" font-size="11" font-weight="bold">A</text>
                            <text x="28" y="24" fill="#94a3b8" font-size="9">آمپرمتر</text>
                        </g>

                        <!-- Voltmeter Connected Parallel across Bulb -->
                        <g transform="translate(120, 65)">
                            <line x1="10" y1="0" x2="10" y2="20" stroke="#f59e0b" stroke-dasharray="2 2" stroke-width="1.5" />
                            <line x1="30" y1="0" x2="30" y2="20" stroke="#f59e0b" stroke-dasharray="2 2" stroke-width="1.5" />
                            <circle cx="20" cy="30" r="12" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
                            <text x="16" y="34" fill="#fbbf24" font-size="10" font-weight="bold">V</text>
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

        if (vSlider) vSlider.addEventListener('input', (e) => { voltage = parseFloat(e.target.value); update(); });
        if (r1Slider) r1Slider.addEventListener('input', (e) => { r1 = parseFloat(e.target.value); update(); });
        if (r2Slider) r2Slider.addEventListener('input', (e) => { r2 = parseFloat(e.target.value); update(); });

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
            if (r2Box) r2Box.className = m === 'single' ? 'hidden' : 'block';
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
        let electroscopeCharge = 0; // accumulated charge

        const update = () => {
            let effectiveCharge = 0;
            if (interactionMode === 'approach') {
                effectiveCharge = (chargeLevel * 0.7);
            } else if (interactionMode === 'touch') {
                effectiveCharge = Math.max(chargeLevel, electroscopeCharge);
                electroscopeCharge = effectiveCharge;
            }

            const leafAngle = Math.min(65, (effectiveCharge / 100) * 65);
            const sign = rodType === 'glass' ? '+' : '−';

            this.currentLiveState = {
                labId: 'electrostatics',
                title: 'آزمایش الکتریسیته ساکن و الکتروسکوپ',
                params: {
                    'میله آزمایشی': rodType === 'glass' ? 'میله شیشه‌ای مالش با ابریشم (بار مثبت +)' : 'میله پلاستیکی مالش با پشم (بار منفی −)',
                    'روش اثر': interactionMode === 'approach' ? 'نزدیک کردن (القا)' : 'لمس کلاهک (تماس مستقیم)',
                    'شدت بار الکتریکی': `${chargeLevel} %`,
                    'زاویه انحراف تیغه‌های طلا': `${Math.round(leafAngle)} درجه`
                }
            };

            const lLeft = document.getElementById('sim-es-leaf-left');
            const lRight = document.getElementById('sim-es-leaf-right');
            const angVal = document.getElementById('sim-es-ang-val');
            const chargeTxt = document.getElementById('sim-es-charge-txt');

            if (angVal) angVal.innerText = `${Math.round(leafAngle)}°`;
            if (chargeTxt) chargeTxt.innerText = rodType === 'glass' ? 'بار مثبت (+)' : 'بار منفی (−)';

            if (lLeft && lRight) {
                lLeft.setAttribute('transform', `rotate(${-leafAngle / 2}, 140, 150)`);
                lRight.setAttribute('transform', `rotate(${leafAngle / 2}, 140, 150)`);
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
                <!-- Controls -->
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
                        <label class="block text-xs font-bold text-slate-300 mb-2">روش تعامل با الکتروسکوپ:</label>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <button id="es-act-approach" class="p-2.5 rounded-xl bg-indigo-600 text-white font-bold border border-indigo-400 transition-all text-center">
                                نزدیک کردن به کلاهک (القا)
                            </button>
                            <button id="es-act-touch" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-center">
                                لمس کلاهک (تماس مستقیم)
                            </button>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">میزان بار الکتریکی القایی:</span>
                            <span id="sim-es-q-val" class="text-violet-400 font-mono font-bold">60%</span>
                        </div>
                        <input type="range" min="10" max="100" value="60" id="sim-es-q-slider" class="physics-slider w-full" />
                    </div>

                    <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <div>
                            <span class="text-xs text-slate-400 block">زاویه انحراف تیغه‌ها (θ):</span>
                            <span id="sim-es-ang-val" class="text-lg font-black text-amber-400 font-mono">39°</span>
                        </div>
                        <button id="es-ground-btn" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5">
                            <i data-lucide="shield" class="w-3.5 h-3.5 text-cyan-400"></i>
                            <span>تخلیه بار (اتصال به زمین)</span>
                        </button>
                    </div>
                </div>

                <!-- Electroscope Visualizer -->
                <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[280px]">
                    <svg viewBox="0 0 280 240" class="w-full max-w-[260px] h-auto">
                        <!-- Glass Flask Jar -->
                        <path d="M90 60 L190 60 L210 210 Q210 230 140 230 Q70 230 70 210 Z" fill="rgba(30, 41, 59, 0.4)" stroke="#64748b" stroke-width="2" />

                        <!-- Rubber Insulator Stopper -->
                        <rect x="115" y="45" width="50" height="20" fill="#334155" rx="3" />

                        <!-- Brass Rod -->
                        <line x1="140" y1="20" x2="140" y2="150" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" />

                        <!-- Brass Cap Top -->
                        <circle cx="140" cy="20" r="18" fill="#fbbf24" stroke="#d97706" stroke-width="2" />
                        <text x="135" y="24" fill="#78350f" font-size="12" font-weight="bold" id="sim-es-charge-sign">+</text>

                        <!-- Moving Charged Rod Indicator -->
                        <g id="sim-es-rod-graphic" transform="translate(40, 10)">
                            <rect x="0" y="0" width="60" height="12" fill="#a855f7" rx="4" />
                            <text x="10" y="9" fill="#ffffff" font-size="8" font-weight="bold">میله باردار</text>
                        </g>

                        <!-- Gold Leaves -->
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
    // 7. OPTICS, REFRACTION & PRISM SIMULATOR (پایه هشتم: اپتیک، شکست نور و منشور)
    // =========================================================================
    renderOpticsSim(container) {
        let theta1 = 45; // deg
        let n2 = 1.52; // glass
        let opticMode = 'refraction'; // 'refraction', 'flat_mirror', 'prism'

        const update = () => {
            const rad1 = (theta1 * Math.PI) / 180;
            let theta2 = 0;

            if (opticMode === 'refraction') {
                const sinTheta2 = Math.sin(rad1) / n2;
                theta2 = Math.asin(sinTheta2) * (180 / Math.PI);
            } else if (opticMode === 'flat_mirror') {
                theta2 = theta1; // Angle of incidence = Angle of reflection
            } else if (opticMode === 'prism') {
                theta2 = theta1 * 0.7; // Dispersion demo
            }

            this.currentLiveState = {
                labId: 'optics',
                title: 'آزمایش اپتیک، بازتاب و شکست نور',
                params: {
                    'حالت آزمایش نوری': opticMode === 'refraction' ? 'شکست نور در تیغه (قانون اسنل)' : (opticMode === 'flat_mirror' ? 'بازتاب در آینه تخت' : 'تجزیه نور در منشور'),
                    'زاویه تابش (θ₁)': `${theta1} درجه`,
                    'زاویه شکست یا بازتاب (θ₂)': `${theta2.toFixed(1)} درجه`,
                    'ضریب شکست محیط دوم (n₂)': n2
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

                if (opticMode === 'flat_mirror') {
                    // Reflection bounces up
                    const x2 = 140 + Math.tan(rad1) * 70;
                    ray2.setAttribute('x1', 140);
                    ray2.setAttribute('y1', 90);
                    ray2.setAttribute('x2', Math.min(260, x2));
                    ray2.setAttribute('y2', 20);
                } else {
                    // Refraction penetrates into medium
                    const rad2 = (theta2 * Math.PI) / 180;
                    const x2 = 140 + Math.tan(rad2) * 70;
                    ray2.setAttribute('x1', 140);
                    ray2.setAttribute('y1', 90);
                    ray2.setAttribute('x2', Math.min(260, x2));
                    ray2.setAttribute('y2', 160);
                }
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-purple-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-purple-400 animate-ping"></span>
                    <h4 class="font-black text-base text-purple-300">میز اپتیک، بازتاب آینه‌ها، شکست نور و منشور (اسنل)</h4>
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

            <!-- Optical Apparatus Mode Buttons -->
            <div class="flex flex-wrap gap-2 text-xs">
                <button id="opt-mode-refract" class="opt-mode-btn px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold border border-purple-400 transition-all">
                    شکست در تیغه شیشه‌ای (قانون اسنل)
                </button>
                <button id="opt-mode-mirror" class="opt-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all">
                    آینه تخت (قانون بازتاب)
                </button>
                <button id="opt-mode-prism" class="opt-mode-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all">
                    منشور مثلثی (تجزیه رنگین‌کمان)
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <!-- Controls -->
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">زاویه پرتو تابش نسبت به خط عمود (θ₁):</span>
                            <span id="sim-opt-t1-val" class="text-purple-400 font-mono font-bold">45°</span>
                        </div>
                        <input type="range" min="0" max="75" step="1" value="45" id="sim-opt-t1-slider" class="physics-slider w-full" />
                    </div>

                    <div id="sim-opt-mat-box">
                        <label class="block text-xs font-bold text-slate-300 mb-2">محیط شفاف دوم (ضریب شکست n₂):</label>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="opt-glass" class="opt-mat-btn px-3 py-1 rounded-lg bg-purple-600 text-white font-bold border border-purple-400">شیشه معمولی (۱٫۵۲)</button>
                            <button id="opt-water" class="opt-mat-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">آب خالص (۱٫۳۳)</button>
                            <button id="opt-diamond" class="opt-mat-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">الماس بلورین (۲٫۴۲)</button>
                        </div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                        <div class="flex justify-between text-xs">
                            <span class="text-slate-400">زاویه حاصله (شکست / بازتاب θ₂):</span>
                            <span id="sim-opt-t2-val" class="font-black text-cyan-400 font-mono text-sm">27.7°</span>
                        </div>
                        <p class="text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                            طبق قانون اسنل، پرتو نور در ورود از محیط رقیق‌تر (هوا) به غلیظ‌تر به خط عمود نزدیک می‌شود.
                        </p>
                    </div>
                </div>

                <!-- Ray Visualizer SVG -->
                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px]">
                    <svg viewBox="0 0 280 180" class="w-full max-w-[260px] h-auto">
                        <!-- Upper Medium (Air) -->
                        <rect x="20" y="20" width="240" height="70" fill="rgba(30, 41, 59, 0.4)" />
                        <text x="30" y="38" fill="#94a3b8" font-size="9 font-bold">محیط ۱: هوا (n₁ = ۱٫۰۰)</text>

                        <!-- Lower Medium -->
                        <rect x="20" y="90" width="240" height="70" fill="rgba(147, 51, 234, 0.2)" stroke="#9333ea" stroke-width="1.5" />
                        <text x="30" y="108" fill="#c084fc" font-size="9" font-weight="bold">محیط ۲</text>

                        <!-- Normal Line -->
                        <line x1="140" y1="20" x2="140" y2="160" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.5" />
                        <text x="145" y="32" fill="#64748b" font-size="8">خط عمود</text>

                        <!-- Incident Ray (Yellow) -->
                        <line id="sim-opt-ray1" x1="80" y1="20" x2="140" y2="90" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" />

                        <!-- Refracted/Reflected Ray (Cyan) -->
                        <line id="sim-opt-ray2" x1="140" y1="90" x2="180" y2="160" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
            </div>
        </div>
        `;

        const tSlider = document.getElementById('sim-opt-t1-slider');
        if (tSlider) tSlider.addEventListener('input', (e) => { theta1 = parseFloat(e.target.value); update(); });

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
            update();
        };

        document.getElementById('opt-mode-refract')?.addEventListener('click', () => setOptMode('refraction', 'opt-mode-refract'));
        document.getElementById('opt-mode-mirror')?.addEventListener('click', () => setOptMode('flat_mirror', 'opt-mode-mirror'));
        document.getElementById('opt-mode-prism')?.addEventListener('click', () => setOptMode('prism', 'opt-mode-prism'));

        update();
    }

    // =========================================================================
    // 8. MAGNETISM & FIELD LINES (پایه هشتم: مغناطیس و قطب‌نما)
    // =========================================================================
    renderMagnetismSim(container) {
        let compassAngle = 45; // degrees around magnet
        let showIronFilings = false;

        const update = () => {
            // Compass needle angle tangential to dipole field
            const rad = (compassAngle * Math.PI) / 180;
            const needleAngle = compassAngle * 1.5;

            this.currentLiveState = {
                labId: 'magnetism',
                title: 'آزمایش خطوط میدان مغناطیسی و قطب‌نما',
                params: {
                    'موقعیت قطب‌نما': `زاویه ${compassAngle} درجه دور آهنربا`,
                    'جهت‌گیری عقربه مغناطیسی': `${Math.round(needleAngle)} درجه`,
                    'نمایش براده‌های آهن': showIronFilings ? 'فعال' : 'غیرفعال'
                }
            };

            const needle = document.getElementById('sim-mag-needle');
            const posVal = document.getElementById('sim-mag-pos-val');
            const filingsEl = document.getElementById('sim-mag-filings');

            if (posVal) posVal.innerText = `${compassAngle}°`;
            if (needle) needle.setAttribute('transform', `rotate(${needleAngle}, 60, 60)`);
            if (filingsEl) filingsEl.style.opacity = showIronFilings ? '0.75' : '0';
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-blue-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-blue-400 animate-ping"></span>
                    <h4 class="font-black text-base text-blue-300">کارگاه آهنربای میله‌ای، قطب‌نما و براده‌های آهن</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 font-bold">پایه هشتم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-blue-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-magnetism" onclick="window.claimLabXp('magnetism', 'مغناطیس و خطوط میدان')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <!-- Controls -->
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">موقعیت زاویه‌ای قطب‌نما در اطراف آهنربا:</span>
                            <span id="sim-mag-pos-val" class="text-blue-400 font-mono font-bold">45°</span>
                        </div>
                        <input type="range" min="0" max="360" step="5" value="45" id="sim-mag-slider" class="physics-slider w-full" />
                    </div>

                    <div class="flex items-center gap-3">
                        <button id="sim-mag-filings-btn" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all">
                            <i data-lucide="sparkles" class="w-4 h-4 text-cyan-400"></i>
                            <span>پاشیدن براده‌های آهن</span>
                        </button>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                        خطوط میدان مغناطیسی همواره از قطب شمال (N) خارج شده و به قطب جنوب (S) وارد می‌شوند. قطب‌نما در هر نقطه مماس بر خط میدان جهت‌گیری می‌کند.
                    </div>
                </div>

                <!-- Magnet Visualizer -->
                <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[260px] relative overflow-hidden">
                    <!-- Iron filings background SVG overlay -->
                    <div id="sim-mag-filings" class="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 flex items-center justify-center">
                        <svg viewBox="0 0 280 200" class="w-full h-full">
                            <path d="M 60 100 Q 140 20 220 100 Q 140 180 60 100" fill="none" stroke="rgba(148, 163, 184, 0.35)" stroke-width="1.5" stroke-dasharray="3 3" />
                            <path d="M 40 100 Q 140 -20 240 100 Q 140 220 40 100" fill="none" stroke="rgba(148, 163, 184, 0.25)" stroke-width="1.5" stroke-dasharray="3 3" />
                        </svg>
                    </div>

                    <div class="relative flex flex-col items-center">
                        <!-- Bar Magnet -->
                        <div class="flex w-48 h-12 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-600">
                            <div class="w-1/2 bg-red-600 text-white font-black flex items-center justify-center text-sm">
                                N (شمال)
                            </div>
                            <div class="w-1/2 bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                                S (جنوب)
                            </div>
                        </div>

                        <!-- Movable Compass -->
                        <div class="mt-8 flex items-center gap-2">
                            <svg viewBox="0 0 120 120" class="w-16 h-16">
                                <circle cx="60" cy="60" r="54" fill="#0f172a" stroke="#475569" stroke-width="3" />
                                <g id="sim-mag-needle">
                                    <polygon points="60,20 54,60 66,60" fill="#ef4444" />
                                    <polygon points="60,100 54,60 66,60" fill="#3b82f6" />
                                    <circle cx="60" cy="60" r="5" fill="#f8fafc" />
                                </g>
                            </svg>
                            <span class="text-xs text-slate-400 font-bold">عقربه قطب‌نما</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const s = document.getElementById('sim-mag-slider');
        if (s) s.addEventListener('input', (e) => { compassAngle = parseFloat(e.target.value); update(); });

        const fBtn = document.getElementById('sim-mag-filings-btn');
        if (fBtn) fBtn.addEventListener('click', () => {
            showIronFilings = !showIronFilings;
            fBtn.className = showIronFilings
                ? 'px-4 py-2 rounded-xl bg-cyan-600 text-white border border-cyan-400 text-xs font-bold flex items-center gap-2 transition-all'
                : 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all';
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
        let mu = 0.15; // friction coeff
        let isRunning = false;
        let speed = 0; // m/s
        let pos = 0; // meters along track
        let simInterval = null;

        const update = () => {
            const friction = Math.round(mu * mass * 9.8);
            const fNet = Math.max(0, force - friction);
            const accel = fNet / mass;

            this.currentLiveState = {
                labId: 'newton',
                title: 'آزمایش قانون دوم نیوتون و اصطکاک',
                params: {
                    'نیروی پیشران (F)': `${force} نیوتون`,
                    'جرم ارابه (m)': `${mass} کیلوگرم`,
                    'ضریب اصطکاک سطح (μ)': mu,
                    'نیروی اصطکاک (f_k = μmg)': `${friction} نیوتون`,
                    'نیروی خالص (F_net)': `${fNet} نیوتون`,
                    'شتاب محاسبه‌شده (a = F_net/m)': `${accel.toFixed(2)} m/s²`,
                    'تندی لحظه‌ای (v)': `${speed.toFixed(1)} m/s`,
                    'مسافت طی‌شده (x)': `${pos.toFixed(1)} متر`
                }
            };

            const fVal = document.getElementById('sim-newt-f-val');
            const mVal = document.getElementById('sim-newt-m-val');
            const fNetVal = document.getElementById('sim-newt-fnet-val');
            const aVal = document.getElementById('sim-newt-a-val');
            const vVal = document.getElementById('sim-newt-v-val');
            const cartEl = document.getElementById('sim-newt-cart');

            if (fVal) fVal.innerText = `${force} N`;
            if (mVal) mVal.innerText = `${mass} kg`;
            if (fNetVal) fNetVal.innerText = `${fNet} N (اصطکاک: ${friction} N)`;
            if (aVal) aVal.innerText = `${accel.toFixed(2)} m/s²`;
            if (vVal) vVal.innerText = `${speed.toFixed(1)} m/s`;

            if (cartEl) {
                const trackWidthPercent = (pos / 40) * 80;
                cartEl.style.right = `${10 + Math.min(75, trackWidthPercent)}%`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 text-white space-y-6 shadow-2xl">
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
                    <!-- Surface Presets -->
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">جنس سطح ریل (ضریب اصطکاک μ):</label>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button id="fric-air" class="fric-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">ریل هوا (μ = ۰٫۰۰)</button>
                            <button id="fric-wood" class="fric-btn px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold border border-emerald-400">چوب صیقلی (μ = ۰٫۱۵)</button>
                            <button id="fric-rubber" class="fric-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">آسفالت (μ = ۰٫۴۵)</button>
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
                            <span id="sim-newt-fnet-val" class="text-xs font-black text-amber-400 font-mono">45 N</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">شتاب (a = F/m)</span>
                            <span id="sim-newt-a-val" class="text-sm font-black text-emerald-400 font-mono">4.50 m/s²</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">تندی زنده</span>
                            <span id="sim-newt-v-val" class="text-sm font-black text-cyan-400 font-mono">0.0 m/s</span>
                        </div>
                    </div>

                    <!-- Movement Animation Buttons -->
                    <div class="flex items-center gap-2 pt-2">
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

                <!-- Air Track Animation Canvas/Box -->
                <div class="lg:col-span-5 p-4 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[260px] flex flex-col justify-end">
                    <div class="relative w-full h-36 flex flex-col justify-end pb-4">
                        <!-- Air Track Rail -->
                        <div class="w-full h-2 bg-slate-600 rounded-full relative">
                            <!-- Graduation Marks -->
                            <div class="absolute inset-x-0 -bottom-4 flex justify-between text-[8px] text-slate-500 font-mono">
                                <span>۰m</span>
                                <span>۱۰m</span>
                                <span>۲۰m</span>
                                <span>۳۰m</span>
                                <span>۴۰m</span>
                            </div>

                            <!-- Cart Element -->
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

        const setFric = (val, btnId) => {
            mu = val;
            document.querySelectorAll('.fric-btn').forEach(b => {
                b.className = 'fric-btn px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'fric-btn px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold border border-emerald-400';
            update();
        };

        document.getElementById('fric-air')?.addEventListener('click', () => setFric(0.0, 'fric-air'));
        document.getElementById('fric-wood')?.addEventListener('click', () => setFric(0.15, 'fric-wood'));
        document.getElementById('fric-rubber')?.addEventListener('click', () => setFric(0.45, 'fric-rubber'));

        const startBtn = document.getElementById('sim-newt-start-btn');
        const resetBtn = document.getElementById('sim-newt-reset-btn');

        if (startBtn) startBtn.addEventListener('click', () => {
            isRunning = !isRunning;
            startBtn.innerHTML = isRunning 
                ? `<i data-lucide="pause" class="w-3.5 h-3.5"></i><span>توقف حرکت</span>`
                : `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>ادامه حرکت</span>`;
            if (window.lucide) window.lucide.createIcons();

            if (isRunning && !simInterval) {
                simInterval = setInterval(() => {
                    const friction = mu * mass * 9.8;
                    const fNet = Math.max(0, force - friction);
                    const accel = fNet / mass;
                    speed += accel * 0.05;
                    pos += speed * 0.05;
                    if (pos > 38) {
                        isRunning = false;
                        clearInterval(simInterval);
                        simInterval = null;
                        startBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>شروع حرکت</span>`;
                        if (window.lucide) window.lucide.createIcons();
                    }
                    update();
                }, 50);
            } else if (!isRunning && simInterval) {
                clearInterval(simInterval);
                simInterval = null;
            }
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            isRunning = false;
            if (simInterval) { clearInterval(simInterval); simInterval = null; }
            speed = 0;
            pos = 0;
            if (startBtn) {
                startBtn.innerHTML = `<i data-lucide="play" class="w-3.5 h-3.5"></i><span>شروع حرکت تعاملی</span>`;
                if (window.lucide) window.lucide.createIcons();
            }
            update();
        });

        update();
    }

    // =========================================================================
    // 10. HOOKE'S LAW & SPRINGS (پایه نهم: قانون هوک و نیروسنج فنری)
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

                <!-- Hanging Spring Visualizer -->
                <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex items-center justify-center min-h-[280px]">
                    <div class="flex items-start gap-6">
                        <!-- Millimeter Ruler -->
                        <div class="w-8 h-64 rounded bg-slate-800 border border-slate-700 flex flex-col justify-between py-2 px-1 text-[8px] text-slate-400 font-mono select-none">
                            <span>- 0 cm</span>
                            <span>- 5 cm</span>
                            <span>- 10 cm</span>
                            <span>- 15 cm</span>
                            <span>- 20 cm</span>
                            <span>- 25 cm</span>
                        </div>

                        <!-- Stand & Hanging Spring -->
                        <div class="flex flex-col items-center">
                            <div class="w-24 h-3 bg-slate-500 rounded-full shadow"></div>
                            <!-- Coiled Spring SVG -->
                            <div id="sim-hk-spring-svg" class="w-8 flex flex-col items-center transition-all duration-150" style="height: 100px;">
                                <svg viewBox="0 0 30 120" preserveAspectRatio="none" class="w-full h-full">
                                    <path d="M 15 0 L 15 10 L 5 15 L 25 25 L 5 35 L 25 45 L 5 55 L 25 65 L 5 75 L 25 85 L 5 95 L 25 105 L 15 110 L 15 120" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" />
                                </svg>
                            </div>
                            <!-- Hanging Weight -->
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
        let depth = 4; // meters
        let density = 1000; // kg/m3 (water)
        let f1 = 50; // N applied on piston 1
        let a1 = 10; // cm2
        let a2 = 100; // cm2

        const update = () => {
            const g = 9.8;
            const pGauge = Math.round(density * g * depth);
            const pTotal = pGauge + 100000;
            const f2 = Math.round(f1 * (a2 / a1));

            this.currentLiveState = {
                labId: 'pressure',
                title: 'آزمایش فشار در شاره‌ها و اصل پاسکال',
                params: {
                    'عمق در مایع (h)': `${depth} متر`,
                    'چگالی مایع (ρ)': `${density} kg/m³`,
                    'فشار ناشی از مایع (P = ρgh)': `${(pGauge / 1000).toFixed(1)} kPa`,
                    'فشار کل با احتساب هوا (P_0 + ρgh)': `${(pTotal / 1000).toFixed(1)} kPa`,
                    'بالابر هیدرولیکی پاسکال': `نیروی F₁=${f1}N با مساحت‌های A₁=${a1}cm² و A₂=${a2}cm² نیروی F₂=${f2}N ایجاد می‌کند.`
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
                <!-- Controls -->
                <div class="lg:col-span-7 space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">عمق غوطه‌وری حسگر فشارسنج (h):</span>
                            <span id="sim-pr-h-val" class="text-blue-400 font-mono font-bold">4 متر</span>
                        </div>
                        <input type="range" min="0" max="10" step="0.5" value="4" id="sim-pr-h-slider" class="physics-slider w-full" />
                    </div>

                    <!-- Fluid Selector -->
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

                    <!-- Pascal Principle Mini Bench -->
                    <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <span class="text-xs font-bold text-cyan-300 block">بالابر هیدرولیکی پاسکال (F₁/A₁ = F₂/A₂):</span>
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-slate-400">نیروی اعمالی پیستون کوچک (F₁ = 50N):</span>
                            <span id="sim-pr-f2-val" class="text-emerald-400 font-bold font-mono">500 N</span>
                        </div>
                    </div>
                </div>

                <!-- Deep Tank Visualizer -->
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
    // 12. SOLID PRESSURE & SURFACE CONTACT (پایه نهم: فشار جامدات و سطح مقطع)
    // =========================================================================
    renderSolidPressureSim(container) {
        let blockMass = 8; // kg (W = 80 N)
        let face = 'large'; // 'large' (20x40), 'medium' (10x40), 'small' (10x20)

        const update = () => {
            const weightN = blockMass * 9.8;
            let areaM2 = 0.08;
            let faceFa = 'وجه بزرگ (۲۰×۴۰ سانتی‌متر)';
            let sinkDepthMm = 4;

            if (face === 'large') {
                areaM2 = 0.08; // 800 cm2
                faceFa = 'وجه بزرگ (۲۰×۴۰ سانتی‌متر)';
                sinkDepthMm = 4;
            } else if (face === 'medium') {
                areaM2 = 0.04; // 400 cm2
                faceFa = 'وجه متوسط (۱۰×۴۰ سانتی‌متر)';
                sinkDepthMm = 8;
            } else if (face === 'small') {
                areaM2 = 0.02; // 200 cm2
                faceFa = 'وجه کوچک (۱۰×۲۰ سانتی‌متر)';
                sinkDepthMm = 16;
            }

            const pressurePa = Math.round(weightN / areaM2);

            this.currentLiveState = {
                labId: 'solid_pressure',
                title: 'آزمایش فشار جامدات و اثر سطح تماس',
                params: {
                    'وجه قرارگیری بلوک': faceFa,
                    'مساحت سطح تماس (A)': `${(areaM2 * 10000)} cm² (${areaM2} m²)`,
                    'نیروی وزن عمودی (F = mg)': `${weightN.toFixed(1)} نیوتون`,
                    'فشار ایجاد شده (P = F/A)': `${pressurePa} پاسکال (Pa)`,
                    'عمق فرورفتگی در اسفنج': `${sinkDepthMm} میلی‌متر`
                }
            };

            const pVal = document.getElementById('sim-sp-p-val');
            const aVal = document.getElementById('sim-sp-a-val');
            const dVal = document.getElementById('sim-sp-d-val');
            const blockVisual = document.getElementById('sim-sp-block-visual');

            if (pVal) pVal.innerText = `${pressurePa} Pa`;
            if (aVal) aVal.innerText = `${areaM2 * 10000} cm² (${areaM2} m²)`;
            if (dVal) dVal.innerText = `${sinkDepthMm} mm`;

            if (blockVisual) {
                blockVisual.style.transform = `translateY(${sinkDepthMm * 2}px)`;
            }
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-purple-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-purple-400 animate-ping"></span>
                    <h4 class="font-black text-base text-purple-300">کارگاه فشار جامدات و اثر مساحت سطح تماس (P = F / A)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 font-bold">پایه نهم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-purple-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-solid-pressure" onclick="window.claimLabXp('solid_pressure', 'فشار جامدات')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-2">انتخاب وجه قرارگیری بلوک ۸ کیلوگرمی:</label>
                        <div class="grid grid-cols-3 gap-2 text-xs">
                            <button id="sp-face-large" class="sp-btn p-2.5 rounded-xl bg-purple-600 text-white font-bold border border-purple-400 text-center">
                                وجه بزرگ (۸۰۰cm²)
                            </button>
                            <button id="sp-face-med" class="sp-btn p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center">
                                وجه متوسط (۴۰۰cm²)
                            </button>
                            <button id="sp-face-small" class="sp-btn p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center">
                                وجه کوچک (۲۰۰cm²)
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3 pt-2">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">سطح تماس (A)</span>
                            <span id="sim-sp-a-val" class="text-xs font-black text-cyan-400 font-mono">800 cm²</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">فشار (P = F/A)</span>
                            <span id="sim-sp-p-val" class="text-xs font-black text-amber-400 font-mono">980 Pa</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">عمق فرورفتگی</span>
                            <span id="sim-sp-d-val" class="text-xs font-black text-rose-400 font-mono">4 mm</span>
                        </div>
                    </div>
                </div>

                <!-- Indentation Graphic -->
                <div class="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-end min-h-[220px]">
                    <div class="relative w-full max-w-[260px] h-32 flex flex-col justify-end">
                        <div id="sim-sp-block-visual" class="w-32 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-800 border-2 border-purple-400 shadow-xl flex items-center justify-center text-xs font-bold mx-auto transition-transform duration-300">
                            بلوک ۸kg
                        </div>
                        <!-- Soft Sponge Surface -->
                        <div class="w-full h-8 bg-amber-900/60 border-t-2 border-amber-600 rounded-b-xl flex items-center justify-center text-[10px] text-amber-300 font-bold">
                            بستر اسفنجی / ماسه‌ای
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const setFace = (f, btnId) => {
            face = f;
            document.querySelectorAll('.sp-btn').forEach(b => {
                b.className = 'sp-btn p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-center';
            });
            const btn = document.getElementById(btnId);
            if (btn) btn.className = 'sp-btn p-2.5 rounded-xl bg-purple-600 text-white font-bold border border-purple-400 text-center';
            update();
        };

        document.getElementById('sp-face-large')?.addEventListener('click', () => setFace('large', 'sp-face-large'));
        document.getElementById('sp-face-med')?.addEventListener('click', () => setFace('medium', 'sp-face-med'));
        document.getElementById('sp-face-small')?.addEventListener('click', () => setFace('small', 'sp-face-small'));

        update();
    }

    // =========================================================================
    // 13. WAVES & HARMONIC OSCILLATION (پایه نهم: انتشار امواج مکانیکی)
    // =========================================================================
    renderWavesSim(container) {
        let freq = 1.5; // Hz
        let amp = 25; // px
        let speed = 60; // px/s

        const update = () => {
            const lambda = (speed / freq).toFixed(1);
            const period = (1 / freq).toFixed(2);

            this.currentLiveState = {
                labId: 'waves',
                title: 'آزمایش امواج مکانیکی و فرکانس',
                params: {
                    'بسامد / فرکانس (f)': `${freq} هرتز (Hz)`,
                    'دامنه نوسان (A)': `${amp} پیکسل`,
                    'تندی انتشار (v)': `${speed} cm/s`,
                    'طول موج (λ = v/f)': `${lambda} cm`,
                    'دوره تناوب (T = 1/f)': `${period} ثانیه`
                }
            };

            const fVal = document.getElementById('sim-wv-f-val');
            const aVal = document.getElementById('sim-wv-a-val');
            const lVal = document.getElementById('sim-wv-l-val');
            const tVal = document.getElementById('sim-wv-t-val');

            if (fVal) fVal.innerText = `${freq} Hz`;
            if (aVal) aVal.innerText = `${amp} px`;
            if (lVal) lVal.innerText = `${lambda} cm`;
            if (tVal) tVal.innerText = `${period} s`;
        };

        container.innerHTML = `
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 text-white space-y-6 shadow-2xl">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                    <h4 class="font-black text-base text-cyan-300">کارگاه انتشار امواج مکانیکی در طناب و فرکانس (v = λ × f)</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">پایه نهم</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.copyStateToLogbook()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                        <i data-lucide="clipboard-copy" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>ثبت در گزارش</span>
                    </button>
                    <button id="claim-lab-xp-waves" onclick="window.claimLabXp('waves', 'امواج مکانیکی و فرکانس')" class="btn-duo-green text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">فرکانس نوسان‌ساز (بسامد f):</span>
                            <span id="sim-wv-f-val" class="text-cyan-400 font-mono font-bold">1.5 Hz</span>
                        </div>
                        <input type="range" min="0.5" max="4.0" step="0.1" value="1.5" id="sim-wv-f-slider" class="physics-slider w-full" />
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-1.5">
                            <span class="text-slate-300">دامنه نوسان (Amplitude):</span>
                            <span id="sim-wv-a-val" class="text-blue-400 font-mono font-bold">25 px</span>
                        </div>
                        <input type="range" min="10" max="45" step="1" value="25" id="sim-wv-a-slider" class="physics-slider w-full" />
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">طول موج (λ = v/f)</span>
                            <span id="sim-wv-l-val" class="text-sm font-black text-emerald-400 font-mono">40.0 cm</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                            <span class="text-[10px] text-slate-400 block mb-0.5">دوره تناوب (T = 1/f)</span>
                            <span id="sim-wv-t-val" class="text-sm font-black text-amber-400 font-mono">0.67 s</span>
                        </div>
                    </div>
                </div>

                <!-- Animated Wave Canvas -->
                <div class="p-4 rounded-3xl bg-slate-950/70 border border-slate-800 min-h-[220px] flex items-center justify-center">
                    <canvas id="sim-wave-canvas" width="280" height="150" class="w-full max-w-[280px] h-auto"></canvas>
                </div>
            </div>
        </div>
        `;

        const fSlider = document.getElementById('sim-wv-f-slider');
        const aSlider = document.getElementById('sim-wv-a-slider');
        if (fSlider) fSlider.addEventListener('input', (e) => { freq = parseFloat(e.target.value); update(); });
        if (aSlider) aSlider.addEventListener('input', (e) => { amp = parseFloat(e.target.value); update(); });

        // Wave animation canvas loop
        const canvas = document.getElementById('sim-wave-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let t = 0;
            const animateWave = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth = 3;

                // Centerline
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
                ctx.beginPath();
                ctx.moveTo(0, 75);
                ctx.lineTo(280, 75);
                ctx.stroke();

                // Sinusoidal wave
                ctx.setLineDash([]);
                ctx.strokeStyle = '#22d3ee';
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x++) {
                    const y = 75 + Math.sin((x / (speed / freq) * 2 * Math.PI) - t * freq * 2 * Math.PI) * amp;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                t += 0.016;
                this.animationFrames['sim-wave-canvas'] = requestAnimationFrame(animateWave);
            };
            animateWave();
        }

        update();
    }

    // =========================================================================
    // 14. PHET OPEN-SOURCE HTML5 SIMULATION VIEWER
    // =========================================================================
    renderPhetSim(container, labDef) {
        container.innerHTML = `
        <div class="rounded-3xl bg-slate-900 border border-cyan-500/30 overflow-hidden shadow-2xl space-y-0">
            <!-- PhET Sandbox Header -->
            <div class="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
                <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                    <div>
                        <div class="flex items-center gap-2">
                            <h4 class="font-black text-sm sm:text-base text-cyan-300">${labDef.title}</h4>
                            <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">سندباکس PhET اوپن‌سورس</span>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-0.5">شبیه‌ساز رسمی و متن‌باز دانشگاه کلرادو بولدر — آزادی کامل در دستکاری ابزارها</p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button onclick="window.physicsSimulators.toggleIframeFullscreen('phet-iframe-wrapper')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all" title="تمام صفحه">
                        <i data-lucide="maximize" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>تمام صفحه</span>
                    </button>
                    <button onclick="window.physicsSimulators.reloadIframe('phet-sim-iframe')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all" title="بارگذاری مجدد">
                        <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>بازنشانی</span>
                    </button>
                    <button onclick="window.claimLabXp('${labDef.id}', '${labDef.title}')" class="btn-duo-green text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-105">
                        <i data-lucide="zap" class="w-3.5 h-3.5 fill-current"></i>
                        <span>ثبت آزمایش (+۲۰ XP)</span>
                    </button>
                </div>
            </div>

            <!-- Responsive iFrame Wrapper -->
            <div id="phet-iframe-wrapper" class="relative w-full aspect-video sm:aspect-[16/9] min-h-[480px] sm:min-h-[620px] bg-slate-950">
                <iframe id="phet-sim-iframe" src="${labDef.phetUrl}" class="w-full h-full border-0 rounded-b-3xl" allowfullscreen allow="fullscreen; autoplay; gamepad"></iframe>
            </div>
        </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    toggleIframeFullscreen(wrapperId) {
        const el = document.getElementById(wrapperId);
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(err => console.warn(err));
        } else {
            document.exitFullscreen().catch(err => console.warn(err));
        }
    }

    reloadIframe(iframeId) {
        const iframe = document.getElementById(iframeId);
        if (iframe) {
            const src = iframe.src;
            iframe.src = '';
            setTimeout(() => { iframe.src = src; }, 50);
        }
    }

    // =========================================================================
    // 15. FREE WORKBENCH INSTRUMENT TOOLBOX MODAL (جعبه ابزار آزاد فیزیکدان)
    // =========================================================================
    openLabToolboxModal(initialTab = 'caliper') {
        const modalId = 'quantum-lab-toolbox-modal';
        let modal = document.getElementById(modalId);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
        <div class="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                        <i data-lucide="wrench" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-extrabold text-sm sm:text-base text-white">جعبه ابزار آزاد آزمایشگاه فیزیک</h3>
                        <p class="text-[10px] text-slate-400">ابزارهای دقیق اندازه‌گیری و سنجش مستقل برای کلیه آزمایش‌ها</p>
                    </div>
                </div>
                <button onclick="document.getElementById('${modalId}').remove()" class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Tab Buttons -->
            <div class="grid grid-cols-4 gap-1 p-2 bg-slate-950/50 border-b border-slate-800 shrink-0 text-xs font-bold">
                <button onclick="window.physicsSimulators.renderToolboxTab('caliper')" id="tb-tab-caliper" class="p-2 rounded-xl text-center transition-all bg-cyan-600 text-white">
                    📏 کولیس و خط‌کش
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
                    ? 'p-2 rounded-xl text-center transition-all bg-cyan-600 text-white font-bold'
                    : 'p-2 rounded-xl text-center text-slate-400 hover:text-white transition-all font-bold';
            }
        });

        if (tab === 'caliper') {
            this.renderCaliperTool(mount);
        } else if (tab === 'stopwatch') {
            this.renderStopwatchTool(mount);
        } else if (tab === 'multimeter') {
            this.renderMultimeterTool(mount);
        } else if (tab === 'report') {
            this.renderReportTool(mount);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    renderCaliperTool(container) {
        let readingMm = 24.6;
        container.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <span class="text-xs text-slate-300 font-bold">کولیس ورنیه دیجیتال با دقت ۰٫۱ میلی‌متر:</span>
                <span id="caliper-disp" class="text-xl font-black font-mono text-cyan-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-700">
                    ۲۴٫۶ mm
                </span>
            </div>

            <div>
                <input type="range" min="0" max="100" step="0.1" value="24.6" id="caliper-slider" class="physics-slider w-full" />
                <div class="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0 mm</span>
                    <span>25 mm</span>
                    <span>50 mm</span>
                    <span>75 mm</span>
                    <span>100 mm</span>
                </div>
            </div>

            <!-- Vernier Caliper SVG Schematic -->
            <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 340 100" class="w-full max-w-[320px] h-auto">
                    <!-- Main Beam -->
                    <rect x="20" y="20" width="280" height="24" fill="#334155" stroke="#64748b" stroke-width="1.5" rx="3" />
                    <!-- Fixed Jaw -->
                    <polygon points="20,20 20,90 35,90 35,44 45,20" fill="#475569" stroke="#64748b" stroke-width="1.5" />
                    <!-- Sliding Jaw -->
                    <g id="caliper-slider-jaw" transform="translate(68, 0)">
                        <rect x="0" y="16" width="45" height="32" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" rx="2" />
                        <polygon points="0,48 0,90 15,90 15,48" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
                        <text x="8" y="36" fill="#38bdf8" font-size="9" font-mono font-bold">LCD</text>
                    </g>
                </svg>
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
                کولیس ورنیه برای اندازه‌گیری دقیق قطر داخلی لوله‌ها، قطر خارجی گوی‌ها و ضخامت تیغه‌های آزمایشگاهی استفاده می‌شود.
            </p>
        </div>
        `;

        const s = document.getElementById('caliper-slider');
        if (s) s.addEventListener('input', (e) => {
            readingMm = parseFloat(e.target.value);
            const d = document.getElementById('caliper-disp');
            if (d) d.innerText = `${readingMm.toFixed(1)} mm`;
            const jaw = document.getElementById('caliper-slider-jaw');
            if (jaw) {
                const tx = 20 + (readingMm / 100) * 200;
                jaw.setAttribute('transform', `translate(${tx}, 0)`);
            }
        });
    }

    renderStopwatchTool(container) {
        container.innerHTML = `
        <div class="space-y-4 text-center">
            <div id="sw-display" class="text-4xl sm:text-5xl font-black font-mono text-amber-400 py-4 px-6 rounded-3xl bg-slate-950 border border-slate-800 tracking-wider">
                00:00.00
            </div>

            <div class="flex items-center justify-center gap-3">
                <button id="sw-start-btn" class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md">
                    <i data-lucide="play" class="w-4 h-4"></i>
                    <span>شروع / مکث</span>
                </button>
                <button id="sw-lap-btn" class="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5">
                    <i data-lucide="flag" class="w-4 h-4 text-cyan-400"></i>
                    <span>ثبت دور (Lap)</span>
                </button>
                <button id="sw-reset-btn" class="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5">
                    <i data-lucide="rotate-ccw" class="w-4 h-4 text-rose-400"></i>
                    <span>ریست</span>
                </button>
            </div>

            <div id="sw-laps-box" class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 max-h-36 overflow-y-auto text-right">
                <span class="text-slate-500 block text-[10px] text-center">لیست دورهای ثبت‌شده تایمر آزمایشگاهی</span>
            </div>
        </div>
        `;

        const disp = document.getElementById('sw-display');
        const startBtn = document.getElementById('sw-start-btn');
        const lapBtn = document.getElementById('sw-lap-btn');
        const resetBtn = document.getElementById('sw-reset-btn');
        const lapsBox = document.getElementById('sw-laps-box');

        const formatTime = (ms) => {
            const m = Math.floor(ms / 60000);
            const s = Math.floor((ms % 60000) / 1000);
            const cs = Math.floor((ms % 1000) / 10);
            return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
        };

        if (startBtn) startBtn.addEventListener('click', () => {
            if (!this.stopwatchData.running) {
                this.stopwatchData.running = true;
                this.stopwatchData.startTime = Date.now() - this.stopwatchData.elapsed;
                this.stopwatchData.interval = setInterval(() => {
                    this.stopwatchData.elapsed = Date.now() - this.stopwatchData.startTime;
                    if (disp) disp.innerText = formatTime(this.stopwatchData.elapsed);
                }, 20);
            } else {
                this.stopwatchData.running = false;
                clearInterval(this.stopwatchData.interval);
                this.stopwatchData.interval = null;
            }
        });

        if (lapBtn) lapBtn.addEventListener('click', () => {
            if (this.stopwatchData.elapsed > 0) {
                const lapTime = formatTime(this.stopwatchData.elapsed);
                const count = lapsBox.children.length;
                const p = document.createElement('div');
                p.className = 'flex justify-between items-center py-1 border-b border-slate-800 font-mono text-cyan-300';
                p.innerHTML = `<span>دور ${count}</span><span>${lapTime}</span>`;
                lapsBox.appendChild(p);
            }
        });

        if (resetBtn) resetBtn.addEventListener('click', () => {
            this.stopwatchData.running = false;
            if (this.stopwatchData.interval) clearInterval(this.stopwatchData.interval);
            this.stopwatchData.interval = null;
            this.stopwatchData.elapsed = 0;
            if (disp) disp.innerText = '00:00.00';
            if (lapsBox) lapsBox.innerHTML = '<span class="text-slate-500 block text-[10px] text-center">لیست دورهای ثبت‌شده تایمر آزمایشگاهی</span>';
        });
    }

    renderMultimeterTool(container) {
        container.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <span class="text-xs text-slate-300 font-bold">مولتی‌متر دیجیتال کالیبره‌شده:</span>
                <span class="text-2xl font-black font-mono text-emerald-400 px-4 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                    ۱۲٫۰۰ V
                </span>
            </div>

            <div class="grid grid-cols-3 gap-2 text-xs font-bold">
                <button class="p-2.5 rounded-xl bg-emerald-600 text-white border border-emerald-400 text-center">
                    ولتاژ DC (V)
                </button>
                <button class="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-center">
                    شدت جریان (A)
                </button>
                <button class="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-center">
                    مقاومت (Ω)
                </button>
            </div>

            <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>پروب قرمز (قطب مثبت +): اتصال به ورودی V/Ω</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-slate-400"></span>
                    <span>پروب مشکی (زمین / منفی −): اتصال به پورت COM</span>
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
            paramRows += `<tr><td class="p-2 border border-slate-700 font-bold text-slate-300">${k}</td><td class="p-2 border border-slate-700 font-mono text-cyan-300">${v}</td></tr>`;
        }

        container.innerHTML = `
        <div class="space-y-4 text-xs">
            <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <h5 class="font-bold text-cyan-300 mb-1">داده‌های استخراج‌شده از آزمایش جاری: ${title}</h5>
                <table class="w-full border-collapse border border-slate-700 text-[11px] mt-2">
                    ${paramRows || '<tr><td colspan="2" class="p-3 text-center text-slate-500">هنوز آزمایشی اجرا نشده است</td></tr>'}
                </table>
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">مشاهدات و تحلیل علمی شما:</label>
                <textarea id="logbook-observations" rows="3" placeholder="نتایج به دست آمده و علت انطباق یا عدم انطباق با تئوری را شرح دهید..." class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"></textarea>
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
        const user = window.store.currentUser || {};

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('لطفاً اجازه باز شدن پنجره چاپ را در مرورگر فعال فرمایید.');
            return;
        }

        let rowsHtml = '';
        for (const [k, v] of Object.entries(params)) {
            rowsHtml += `<tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${k}</td><td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace;">${v}</td></tr>`;
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
                .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; }
                th { background: #f1f5f9; text-align: right; }
                .box { border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
                @media print { button { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>انجمن فیزیک شهید بهشتی دو — گزارش کار آزمایشگاه</h2>
                <h3>${title}</h3>
            </div>
            <div class="meta">
                <span>دانش‌آموز: ${user.display_name || 'دانش‌آموز فیزیک'}</span>
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
                ${obs ? obs.replace(/\n/g, '<br>') : 'مشاهدات تجربی به صورت کامل با تئوری علمی مطابقت دارد.'}
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
        btn.innerHTML = `<span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> در حال ثبت...`;
    }
    try {
        const res = await window.api.recordLabActivity(simType, labTitleFa, 20);
        if (btn) {
            btn.className = 'px-3.5 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-md';
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i><span>✓ ثبت شد (+${res.xp_awarded || 20} XP)</span>`;
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
