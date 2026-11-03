# راهنمای جامع استقرار روی سرور لینوکس (Linux VPS Deployment Guide)
## انجمن علمی فیزیک دبیرستان استعدادهای درخشان شهید بهشتی ۲

این سند فرآیند گام‌به‌گام راه‌اندازی، پیکربندی امنیتی، اخذ گواهینامه SSL و فعال‌سازی نسخه‌برداری پشتیبان خودکار سامانه روی یک سرور مجازی لینوکس (VPS) را تشریح می‌کند.

---

## ۱. مشخصات پیشنهادی سرور (Server Requirements)

| قطعه | حداقل مشخصات (Minimum) | مشخصات پیشنهادی (Recommended) |
| :--- | :--- | :--- |
| **سیستم‌عامل** | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| **پردازنده (CPU)** | ۲ هسته (۲ vCPU) | ۴ هسته |
| **حافظه رم (RAM)** | ۲ گیگابایت | ۴ گیگابایت (جهت اجرای روان دیتابیس و کش) |
| **دیسک (Storage)** | ۲۰ گیگابایت SSD | ۴۰ گیگابایت NVMe |
| **شبکه و پورت‌ها** | پورت‌های ۸۰ (HTTP) و ۴۴۳ (HTTPS) و ۲۲ (SSH) باز | آدرس IP ثابت اختصاصی |

---

## ۲. آماده‌سازی اولیه سرور لینوکس

پس از اتصال به سرور از طریق SSH:

```bash
# بروزرسانی مخازن لینوکس
sudo apt update && sudo apt upgrade -y

# نصب ابزارهای موردنیاز و داکر
sudo apt install -y curl git ufw fail2ban ca-certificates apt-transport-https

# نصب Docker و پلاگین Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# پیکربندی دیوار آتشین (UFW Firewall)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## ۳. انتقال کدها و تنظیم متغیرهای محیطی

```bash
# کلون کردن پروژه در مسیر /opt/physics-society
cd /opt
sudo git clone <آدرس_مخزن_گیت> physics-society
cd physics-society

# ایجاد فایل پیکربندی عملیاتی .env
cp .env.example .env

# ایجاد یک کلید امنیتی ۶۴ کاراکتری تصادفی
openssl rand -hex 32
```

فایل `.env` را با دستور `nano .env` ویرایش کرده و متغیرهای زیر را تنظیم نمایید:
```ini
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=مقدار_تولید_شده_توسط_openssl
POSTGRES_DB=physics_db
POSTGRES_USER=physics_admin
POSTGRES_PASSWORD=رمز_بسیار_قوی_پایگاه_داده_اینجا
AI_PROVIDER=mock   # یا openai / deepseek / ollama
AI_API_KEY=کلید_هوش_مصنوعی_شما
```

---

## ۴. اجرای سرویس‌ها با Docker Compose

```bash
cd /opt/physics-society/deploy

# ساخت و راه‌اندازی کانتینرها در پس‌زمینه
docker compose up -d --build

# بررسی وضعیت کانتینرها (باید هر سه سرویس db, app, nginx در حالت Up یا healthy باشند)
docker compose ps
```

برای تست سلامت سرویس از داخل سرور:
```bash
curl http://localhost/api/health
```
پاسخ دریافتی باید `{"status":"healthy","database_connected":true,...}` باشد.

---

## ۵. فعال‌سازی رایگان SSL با Let's Encrypt

برای فعال‌سازی HTTPS بر روی دامنه مدرسه (مثلاً `physics.beheshti2.ir`):

```bash
# اجرای اسکریپت خودکار PHP با ذکر دامنه و ایمیل مسئول IT مدرسه
php deploy/ssl.php physics.beheshti2.ir admin@beheshti2.ir
```

این اسکریپت گواهی‌نامه ۴۰۹۶ بیتی RSA را از سرورهای Let's Encrypt دریافت کرده و در ولوم امن `physics_certbot_conf` قرار داده و Nginx را مجدداً لود می‌کند.

---

## ۶. ورود مدیر سامانه و بررسی محتوا در سرور

پس از راه‌اندازی، حساب مدیر اولیه مستقیماً با اطلاعات زیر در دیتابیس فعال است:
- نام کاربری: `admin` یا `QUANTUM CUT`
- رمز عبور: `QUANTUM CUT`

تست سلامت و اعتبارسنجی پوشش بانک سوالات و آزمون‌ها:
```bash
php backend/tests/test_suite.php
```

---

## ۷. زمان‌بندی پشتیبان‌گیری خودکار (Automated Cron Backup)

جهت جلوگیری از هرگونه از دست رفتن داده‌ها، اسکریپت `deploy/backup.php` به صورت خودکار از دیتابیس SQLite/MySQL و فایل‌های درسی دامپ گرفته، فشرده‌سازی کرده و نسخه‌های قدیمی‌تر از ۱۴ روز را حذف می‌کند.

اسکریپت را به عنوان تسک زمان‌بندی‌شده روزانه در Cron لینوکس یا سی‌پنل ثبت کنید:
```bash
# باز کردن ویرایشگر کرون روت
sudo crontab -e
```
خط زیر را برای اجرای هر شب ساعت ۰۳:۰۰ بامداد اضافه کنید:
```cron
0 3 * * * php /opt/physics-society/deploy/backup.php >> /var/log/physics_backup.log 2>&1
```

### بازیابی نسخه پشتیبان (Disaster Recovery):
در صورت بروز نقص فنی یا نیاز به بازگردانی داده‌ها:
```bash
php deploy/restore.php /var/backups/physics_platform/physics_backup_20261021_030000.tar.gz
```

---

## ۸. پایش، مشاهده لاگ‌ها و عیب‌یابی (Monitoring & Troubleshooting)

- **مشاهده لاگ‌های زنده برنامه:**
  ```bash
  docker compose logs -f app
  ```
- **مشاهده لاگ‌های Nginx:**
  ```bash
  docker compose logs -f nginx
  ```
- **مشاهده وضعیت منابع مصرفی:**
  ```bash
  docker stats
  ```
- **راه‌اندازی مجدد سرویس پایتون:**
  ```bash
  docker compose restart app
  ```
