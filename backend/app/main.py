import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from app.config import settings
from app.database import engine, Base, SessionLocal
import app.models
from app.routers import auth, curriculum, exams, competitions, gamification, admin, system, ai
from app.seed.curriculum_seed import seed_base_system
from app.seed.question_bank import seed_complete_curriculum_and_questions

from app.services.schema_sync import auto_sync_schema

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and all schema columns are synchronized
    try:
        auto_sync_schema(engine)
    except Exception as ex:
        print(f"[SchemaSync Notice]: {ex}")
        Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        from app.models.curriculum import Chapter
        ch_count = db.query(Chapter).count()
        if ch_count == 0:
            seed_base_system(db)
            seed_complete_curriculum_and_questions(db)
    except Exception as ex:
        print(f"Startup seed notice: {ex}")
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title="سامانه جامع انجمن فیزیک شهید بهشتی دو دوره اول",
    description="سامانه جامع انجمن فیزیک شهید بهشتی دو دوره اول (پایه‌های هفتم، هشتم و نهم)",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

import time
import threading
from collections import defaultdict

# ==========================================
# PUBLIC SECURITY & RATE LIMITING SUITE
# ==========================================

class SlidingWindowRateLimiter:
    """Thread-safe in-memory rate limiter protecting public endpoints against DDoS & brute-force"""
    def __init__(self):
        self._lock = threading.Lock()
        self._requests = defaultdict(list)
        self._last_cleanup = time.time()

    def is_allowed(self, client_ip: str, path: str) -> tuple[bool, int]:
        now = time.time()
        with self._lock:
            # Periodic cleanup of stale IP records every 60 seconds
            if now - self._last_cleanup > 60:
                cutoff = now - 120
                for ip in list(self._requests.keys()):
                    self._requests[ip] = [(t, p) for t, p in self._requests[ip] if t > cutoff]
                    if not self._requests[ip]:
                        del self._requests[ip]
                self._last_cleanup = now

            recent = [(t, p) for t, p in self._requests[client_ip] if t > now - 60]
            self._requests[client_ip] = recent

            # Stricter limit on authentication (anti-brute force: max 15 attempts/minute)
            if path in ("/api/auth/login", "/api/auth/register"):
                auth_attempts = sum(1 for t, p in recent if p in ("/api/auth/login", "/api/auth/register"))
                if auth_attempts >= 15:
                    return False, 60

            # Stricter limit on AI tutoring endpoints (max 30 queries/minute)
            if path.startswith("/api/ai/"):
                ai_queries = sum(1 for t, p in recent if p.startswith("/api/ai/"))
                if ai_queries >= 30:
                    return False, 60

            # General API limit: max 180 requests/minute per client IP
            if len(recent) >= 180:
                return False, 60

            self._requests[client_ip].append((now, path))
            return True, 0

rate_limiter = SlidingWindowRateLimiter()

import logging
import traceback

logger = logging.getLogger("physics_society.core")

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    """Prevents worker crashes by catching unhandled exceptions and returning structured JSON"""
    logger.error(f"[Unhandled Error at {request.method} {request.url.path}]: {str(exc)}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "خطای غیرمنتظره در سرور رخ داده است. لطفاً چند لحظه بعد تلاش کنید.",
            "path": request.url.path
        }
    )

# 1. Security Headers & Caching Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    
    # Static & Simulator Caching for instant sub-second lab loads
    if request.url.path.startswith("/simulators") or request.url.path.startswith("/static/assets"):
        response.headers["Cache-Control"] = "public, max-age=86400, stale-while-revalidate=604800"

    # Inject comprehensive CSP supporting PhET WebWorkers, Audio, and offline simulations
    if not request.url.path.startswith("/api/docs") and not request.url.path.startswith("/api/redoc"):
        response.headers["Content-Security-Policy"] = (
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://cdn.tailwindcss.com https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://unpkg.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; "
            "img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net; "
            "media-src 'self' data: blob:; "
            "worker-src 'self' blob: data:; "
            "child-src 'self' blob: data:; "
            "connect-src 'self' https://openrouter.ai https://api.openai.com; frame-src 'self' data: blob:; frame-ancestors 'self';"
        )
    return response

# 2. Rate Limiting Middleware (Anti-DDoS Shield)
@app.middleware("http")
async def rate_limiting_middleware(request: Request, call_next):
    # Bypass during automated test runner execution
    if os.getenv("PYTEST_CURRENT_TEST") or settings.APP_ENV == "testing":
        return await call_next(request)

    path = request.url.path
    if path.startswith("/api") and not path.startswith("/api/docs") and not path.startswith("/api/openapi.json"):
        client_ip = request.client.host if request.client else "127.0.0.1"
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()

        allowed, retry_after = rate_limiter.is_allowed(client_ip, path)
        if not allowed:
            return JSONResponse(
                status_code=429,
                content={"detail": "تعداد درخواست‌های ارسالی شما بیش از حد مجاز است. لطفاً ۶۰ ثانیه شکیبا باشید."},
                headers={"Retry-After": str(retry_after)}
            )

    return await call_next(request)

# 3. Payload Size Limiting Middleware (Memory Protection)
@app.middleware("http")
async def check_payload_size(request: Request, call_next):
    cl_header = request.headers.get("content-length")
    if cl_header:
        try:
            cl = int(cl_header)
            # Allow up to settings.MAX_UPLOAD_SIZE_MB (default 50MB)
            max_bytes = getattr(settings, "MAX_UPLOAD_SIZE_MB", 50) * 1024 * 1024
            if cl > max_bytes:
                return JSONResponse(status_code=413, content={"detail": f"حجم داده‌های ارسالی بیش از سقف مجاز است (حداکثر {settings.MAX_UPLOAD_SIZE_MB} مگابایت)."})
        except ValueError:
            pass
    return await call_next(request)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(system.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(curriculum.router, prefix="/api")
app.include_router(exams.router, prefix="/api")
app.include_router(competitions.router, prefix="/api")
app.include_router(gamification.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

# Uploaded files directory for study materials & notes (Persisted in volume data/uploads)
uploads_dir = os.path.abspath(settings.UPLOAD_DIR)
os.makedirs(os.path.join(uploads_dir, "materials"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Static files for frontend
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    simulators_dir = os.path.join(frontend_dir, "simulators")
    if os.path.exists(simulators_dir):
        app.mount("/simulators", StaticFiles(directory=simulators_dir), name="simulators")

    # Serve index.html for root and SPA client routes
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Do not intercept /api, /uploads, or /simulators routes
        if full_path.startswith("api") or full_path.startswith("uploads") or full_path.startswith("simulators"):
            return JSONResponse(status_code=404, content={"detail": "مسیریابی نامعتبر در API یا فایل یافت نشد."})
        
        file_candidate = os.path.join(frontend_dir, full_path)
        if os.path.isfile(file_candidate):
            return FileResponse(file_candidate)
        
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return JSONResponse(status_code=404, content={"detail": "صفحه مورد نظر یافت نشد."})
