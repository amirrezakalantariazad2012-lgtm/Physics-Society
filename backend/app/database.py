from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings

# Setup connect_args based on DB dialect
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine_kwargs = {
    "connect_args": connect_args,
    "pool_pre_ping": True,
}
if not settings.DATABASE_URL.startswith("sqlite"):
    engine_kwargs.update({
        "pool_size": 20,
        "max_overflow": 10,
        "pool_timeout": 30,
        "pool_recycle": 1800,
    })

engine = create_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

# Enable foreign keys for SQLite
if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

def run_db_migrations(target_engine):
    """Safely apply schema additions to existing SQLite or Postgres databases"""
    try:
        with target_engine.connect() as conn:
            if str(target_engine.url).startswith("sqlite"):
                res = conn.execute(text("PRAGMA table_info(users)"))
                cols = [row[1] for row in res.fetchall()]
                if cols and "must_change_password" not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT 0"))
                    conn.commit()
    except Exception:
        pass

# Ensure migrations on startup
run_db_migrations(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
