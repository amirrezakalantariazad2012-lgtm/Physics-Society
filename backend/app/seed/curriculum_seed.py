import os
from sqlalchemy.orm import Session
from app.models.user import User, StudentProfile
from app.models.curriculum import Grade, Book, Chapter, Topic, Lesson, Exercise, TextbookSource
from app.models.gamification import Level, Badge
from app.models.system import ApplicationSetting, AIProviderConfig
from app.services.auth import hash_password
from app.config import settings

def seed_base_system(db: Session):
    """Initializes Grades, Books, Badges, Levels, Settings, and Admin Account"""
    # 1. Levels
    levels_data = [
        (1, "دانش‌پژوه مقدماتی", 0, "seedling"),
        (2, "کاوشگر نیرو و حرکت", 100, "compass"),
        (3, "پژوهشگر انرژی", 250, "zap"),
        (4, "استاد الکتریسیته", 500, "battery-charging"),
        (5, "متخصص نور و امواج", 900, "sun"),
        (6, "فیزیک‌دان تجربی", 1500, "atom"),
        (7, "محقق ارشد فیزیک", 2300, "award"),
        (8, "استاد مکانیک کوانتوم", 3500, "shield"),
        (9, "نخبه فیزیک کوانتوم", 5000, "crown"),
    ]
    for lvl_num, title, min_xp, icon in levels_data:
        existing = db.query(Level).filter(Level.level_number == lvl_num).first()
        if not existing:
            db.add(Level(level_number=lvl_num, title_fa=title, min_xp=min_xp, badge_icon=icon))

    # 2. Badges
    badges_data = [
        ("first_lesson", "گام نخستین", "تکمیل اولین درس تعاملی فیزیک", "footprints", "curriculum", 30, "first_lesson", 1),
        ("perfect_practice", "دقت آزمایشگاهی", "پاسخ کاملاً صحیح به تمام تمرین‌های یک درس", "target", "curriculum", 50, "perfect_practice", 1),
        ("streak_3", "استمرار علمی", "سه روز متوالی یادگیری در پلتفرم QUANTUM CUT", "flame", "streak", 40, "streak_3", 3),
        ("streak_7", "مشعل‌دار فیزیک", "هفت روز متوالی استمرار مطالعه فیزیک", "zap", "streak", 100, "streak_7", 7),
        ("chapter_master", "تسلط بر فصل", "تکمیل تمام درس‌ها و قبولی در ارزیابی فصل", "check-check", "curriculum", 80, "chapter_master", 1),
        ("competition_participant", "مبارز علمی", "ارسال پاسخ در مسابقات و لیگ‌های QUANTUM CUT", "trophy", "competition", 60, "competition_participant", 1),
        ("xp_500", "نشان مدار کوانتومی", "کسب ۵۰۰ امتیاز تجربه (XP) در سامانه", "star", "general", 100, "xp_500", 500),
    ]
    for code, title, desc, icon, cat, xp, crit, thresh in badges_data:
        existing = db.query(Badge).filter(Badge.code == code).first()
        if not existing:
            db.add(Badge(
                code=code, title_fa=title, description_fa=desc, icon=icon,
                category=cat, xp_bonus=xp, criteria_type=crit, criteria_threshold=thresh
            ))

    # 3. Grades
    grades_info = [
        (7, "پایه هفتم", "آموزش اندازه‌گیری در علوم تجربی، انرژی و تبدیل‌های آن، منابع انرژی و گرما"),
        (8, "پایه هشتم", "آموزش الکتریسیته ساکن و جاری، مغناطیس، نور و بازتاب، شکست نور و عدسی‌ها"),
        (9, "پایه نهم", "آموزش حرکت و سرعت، نیرو و قوانین نیوتون، فشار در جامدات و شاره‌ها، ماشین‌ها و قرقره‌ها"),
    ]
    grade_map = {}
    for num, title, desc in grades_info:
        g = db.query(Grade).filter(Grade.number == num).first()
        if not g:
            g = Grade(number=num, title_fa=title, description_fa=desc)
            db.add(g)
            db.commit()
            db.refresh(g)
        grade_map[num] = g

    # 4. Books (2 books per grade: Standard national textbook & Sampad supplementary)
    books_data = [
        # Grade 7
        (7, "g7_b1", "علوم تجربی هفتم (کتاب رسمی)", "standard", "وزارت آموزش و پرورش", "1404-1405", "haftom-olom-tajrobi-1405.pdf"),
        (7, "g7_b2", "علوم تجربی هفتم تکمیلی تیزهوشان (سمپاد)", "sampad", "سازمان ملی پرورش استعدادهای درخشان", "1404-1405", "C104-1.pdf"),
        # Grade 8
        (8, "g8_b1", "علوم تجربی هشتم (کتاب رسمی)", "standard", "وزارت آموزش و پرورش", "1404-1405", "hashtom-olom-tajrobi-1405.pdf"),
        (8, "g8_b2", "علوم تجربی هشتم تکمیلی تیزهوشان (سمپاد)", "sampad", "سازمان ملی پرورش استعدادهای درخشان", "1404-1405", "C824.pdf"),
        # Grade 9
        (9, "g9_b1", "علوم تجربی نهم (کتاب رسمی)", "standard", "وزارت آموزش و پرورش", "1404-1405", "nohom-olom-tajrobi-1405.pdf"),
        (9, "g9_b2", "علوم تجربی نهم تکمیلی تیزهوشان (سمپاد)", "sampad", "سازمان ملی پرورش استعدادهای درخشان", "1404-1405", "C134-1.pdf"),
    ]

    book_map = {}
    for g_num, code, title, b_type, pub, yr, fname in books_data:
        b = db.query(Book).filter(Book.code == code).first()
        if not b:
            b = Book(
                grade_id=grade_map[g_num].id,
                code=code,
                title_fa=title,
                book_type=b_type,
                publisher_fa=pub,
                academic_year=yr
            )
            db.add(b)
            db.commit()
            db.refresh(b)
        book_map[code] = b

        # Link textbook source record if file exists in data/textbooks
        local_pdf_path = os.path.join(settings.TEXTBOOK_DIR, f"{code}.pdf")
        if os.path.exists(local_pdf_path):
            existing_source = db.query(TextbookSource).filter(TextbookSource.book_id == b.id).first()
            if not existing_source:
                sz = os.path.getsize(local_pdf_path)
                src = TextbookSource(
                    book_id=b.id,
                    source_url=f"local://{fname}",
                    original_filename=fname,
                    stored_path=local_pdf_path,
                    file_size_bytes=sz,
                    page_count=100,
                    status="completed"
                )
                db.add(src)

    # 5. AI Provider Config
    active_ai = db.query(AIProviderConfig).first()
    if not active_ai:
        db.add(AIProviderConfig(
            provider_name=settings.AI_PROVIDER,
            api_key_masked="***",
            api_key_encrypted=settings.AI_API_KEY,
            base_url=settings.AI_BASE_URL,
            model_name=settings.AI_MODEL,
            timeout_seconds=settings.AI_TIMEOUT_SECONDS,
            max_retries=settings.AI_MAX_RETRIES,
            is_active=True
        ))

    # 6. Admin Account (QUANTUM CUT & compatibility admin)
    admin_qc = db.query(User).filter(User.username == "QUANTUM CUT").first()
    if not admin_qc:
        admin_qc = User(
            username="QUANTUM CUT",
            email="admin@quantumcut.ir",
            hashed_password=hash_password("QUANTUM CUT"),
            role="admin",
            full_name="مدیر ارشد QUANTUM CUT",
            display_name="QUANTUM CUT",
            is_active=True,
            must_change_password=False
        )
        db.add(admin_qc)
    else:
        admin_qc.hashed_password = hash_password("QUANTUM CUT")
        admin_qc.must_change_password = False

    admin_legacy = db.query(User).filter(User.username == "admin").first()
    if not admin_legacy:
        admin_legacy = User(
            username="admin",
            email="system_admin@beheshti2.ir",
            hashed_password=hash_password("AdminPhysics1405!"),
            role="admin",
            full_name="مدیر سامانه انجمن فیزیک شهید بهشتی دو",
            display_name="مدیر سامانه",
            is_active=True,
            must_change_password=False
        )
        db.add(admin_legacy)
    else:
        admin_legacy.hashed_password = hash_password("AdminPhysics1405!")
        admin_legacy.must_change_password = False

    # 7. Sample Verified Student Account for direct testing
    student = db.query(User).filter(User.username == "student_beheshti").first()
    if not student:
        student = User(
            username="student_beheshti",
            email="student@beheshti2.ir",
            hashed_password=hash_password("Student1405!"),
            role="student",
            full_name="امیررضا علوی (دانش‌آموز پایه هفتم)",
            display_name="امیررضا",
            is_active=True
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        profile = StudentProfile(
            user_id=student.id,
            grade_id=grade_map[7].id,
            student_number="70214",
            total_xp=150,
            current_level=2,
            current_streak=3,
            max_streak=5,
            bio="علاقه‌مند به المپیاد فیزیک و مکانیک کلاسیک"
        )
        db.add(profile)

    db.commit()
    print("Base system, grades, books, badges, and accounts seeded successfully!")
    return grade_map, book_map
