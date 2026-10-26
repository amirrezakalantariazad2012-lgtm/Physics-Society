from sqlalchemy import inspect, text
from app.database import Base

def auto_sync_schema(engine):
    """
    Automatically detects missing tables and columns between SQLAlchemy models
    and the active PostgreSQL/SQLite database, and performs safe ADD COLUMN IF NOT EXISTS.
    """
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    
    with engine.begin() as conn:
        is_pg = (conn.dialect.name == "postgresql")
        for mapper in Base.registry.mappers:
            t_name = mapper.local_table.name
            if t_name not in existing_tables:
                continue
            existing_cols = {c["name"] for c in inspector.get_columns(t_name)}
            for col in mapper.local_table.columns:
                if col.name not in existing_cols:
                    col_type = col.type.compile(dialect=conn.dialect)
                    default_clause = ""
                    if col.server_default is not None:
                        default_clause = f" DEFAULT {col.server_default.arg}"
                    elif col.default is not None and hasattr(col.default, "arg"):
                        val = col.default.arg
                        if isinstance(val, bool):
                            default_clause = f" DEFAULT {'true' if val else 'false'}"
                        elif isinstance(val, (int, float)):
                            default_clause = f" DEFAULT {val}"
                        elif isinstance(val, str):
                            default_clause = f" DEFAULT '{val}'"
                    
                    if is_pg:
                        sql = f'ALTER TABLE "{t_name}" ADD COLUMN IF NOT EXISTS "{col.name}" {col_type}{default_clause}'
                    else:
                        sql = f'ALTER TABLE "{t_name}" ADD COLUMN "{col.name}" {col_type}{default_clause}'
                    try:
                        conn.execute(text(sql))
                        print(f"[SchemaSync] Successfully added missing column {t_name}.{col.name}")
                    except Exception as e:
                        print(f"[SchemaSync] Notice adding {t_name}.{col.name}: {e}")
