import sys
import getpass
from app.database import SessionLocal, Base, engine
import app.models
from app.models.user import User
from app.services.auth import hash_password
from app.seed.curriculum_seed import seed_base_system
from app.seed.question_bank import seed_complete_curriculum_and_questions, validate_all_chapters_content

def create_admin():
    """Interactive CLI command to create the initial administrator securely"""
    print("==================================================")
    print("سامانه انجمن فیزیک شهید بهشتی دو دوره اول")
    print("ایجاد حساب کاربری مدیر ارشد سامانه (Super Admin)")
    print("==================================================")

    db = SessionLocal()
    Base.metadata.create_all(bind=engine)

    username = input("نام کاربری مدیر (پیش‌فرض: admin): ").strip() or "admin"
    email = input("آدرس ایمیل مدیر: ").strip() or "admin@physics-beheshti.ir"
    full_name = input("نام و نام خانوادگی مدیر: ").strip() or "مدیر انجمن فیزیک"

    existing = db.query(User).filter(User.username == username).first()
    if existing:
        print(f"خطا: کاربری با نام «{username}» قبلاً در سامانه ثبت شده است.")
        db.close()
        return

    password = getpass.getpass("رمز عبور مدیر (حداقل ۸ کاراکتر): ")
    if len(password) < 8:
        print("خطا: رمز عبور باید حداقل ۸ کاراکتر باشد.")
        db.close()
        return

    confirm_password = getpass.getpass("تکرار رمز عبور مدیر: ")
    if password != confirm_password:
        print("خطا: رمزهای عبور وارد شده یکسان نیستند.")
        db.close()
        return

    admin = User(
        username=username,
        email=email,
        full_name=full_name,
        display_name="مدیر انجمن فیزیک",
        hashed_password=hash_password(password),
        role="admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("حساب کاربری مدیر با موفقیت ایجاد شد.")
    db.close()

def seed_database():
    """Seeds base system, curriculum, and all 360 questions"""
    print("شروع مقداردهی اولیه پایگاه داده انجمن فیزیک...")
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)
    seed_base_system(db)
    stats = seed_complete_curriculum_and_questions(db)
    print("نتیجه مقداردهی پایگاه داده:", stats)
    db.close()

def bootstrap_admin(force_reset: bool = False):
    """Bootstraps default setup admin (admin/admin with must_change_password=True) safely preserving custom accounts"""
    print("==================================================")
    print("سامانه انجمن فیزیک: راه‌اندازی حساب مدیر پیش‌فرض")
    print("==================================================")
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)

    admin = db.query(User).filter(User.username == "admin").first()
    if admin:
        if force_reset:
            admin.hashed_password = hash_password("admin")
            admin.must_change_password = True
            db.commit()
            print("حساب مدیر پیش‌فرض با نام 'admin' و رمز 'admin' مجدداً تنظیم شد (تغییر رمز در اولین ورود اجباری است).")
        else:
            print("حساب مدیر 'admin' از قبل در پایگاه داده وجود دارد و حفظ گردید.")
            print("(برای بازنشانی به admin/admin اولیه، از سوئیچ --reset استفاده فرمایید)")
    else:
        admin = User(
            username="admin",
            email="admin@physics-beheshti.ir",
            full_name="مدیر انجمن فیزیک شهید بهشتی دو دوره اول",
            display_name="مدیر انجمن فیزیک",
            hashed_password=hash_password("admin"),
            role="admin",
            is_active=True,
            must_change_password=True
        )
        db.add(admin)
        db.commit()
        print("حساب کاربری مدیر پیش‌فرض با موفقیت ایجاد شد:")
        print("نام کاربری: admin")
        print("رمز عبور: admin")
        print("وضعیت: تغییر رمز در اولین ورود اجباری است (must_change_password = True)")
    db.close()

def run_validation():
    """Runs automated chapter question compliance validation across all 45 curriculum chapters"""
    print("شروع ارزیابی جامع انطباق سؤالات فصل‌های آموزشی (تمامی ۴۵ فصل کتب درسی)...")
    db = SessionLocal()
    reports = validate_all_chapters_content(db, physics_core_only=False)
    all_ok = True
    for r in reports:
        status_str = "منطبق (OK)" if r.is_fully_compliant else "ناقص (FAILED)"
        print(f"پایه {r.grade_number} فصل {r.chapter_number} [{r.chapter_title_fa}]: "
              f"چهارگزینه‌ای: {r.actual_valid_mcq_count}/20 - تشریحی: {r.actual_valid_written_count}/10 - وضعیت: {status_str}")
        if not r.is_fully_compliant:
            all_ok = False

    print("==================================================")
    print(f"نتیجه نهایی اعتبارسنجی: {'تأیید کامل (PASS)' if all_ok else 'رد شد (FAIL)'}")
    db.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd == "create-admin":
            create_admin()
        elif cmd in ("bootstrap-admin", "bootstrap_admin", "init-admin"):
            reset = "--reset" in sys.argv or "-r" in sys.argv
            bootstrap_admin(force_reset=reset)
        elif cmd == "seed":
            seed_database()
        elif cmd in ("validate", "validate-content", "validate_content"):
            run_validation()
        else:
            print("دستور نامعتبر. دستورات مجاز: bootstrap-admin, create-admin, seed, validate")
    else:
        print("استفاده: python -m app.cli [bootstrap-admin | create-admin | seed | validate]")
