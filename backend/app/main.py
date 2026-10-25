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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed default curriculum if empty
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
    title="QUANTUM CUT API",
    description="پلتفرم آموزشی، یادگیری تعاملی، آزمون‌ساز هوشمند و مسابقات لیگ فیزیک (پایه‌های هفتم، هشتم و نهم)",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

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

# Static files for frontend
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    # Serve index.html for root and SPA client routes
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Do not intercept /api routes
        if full_path.startswith("api"):
            return JSONResponse(status_code=404, content={"detail": "مسیریابی نامعتبر در API"})
        
        file_candidate = os.path.join(frontend_dir, full_path)
        if os.path.isfile(file_candidate):
            return FileResponse(file_candidate)
        
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return JSONResponse(status_code=404, content={"detail": "صفحه مورد نظر یافت نشد."})
