import sqlite3
import os

db_paths = ["physics_platform.db", "backend/physics_platform.db"]
for db_path in db_paths:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cols = [col[1] for col in cur.execute("PRAGMA table_info(ai_provider_configs)").fetchall()]
        new_cols = [
            ("tutoring_model", "VARCHAR(64) DEFAULT 'gpt-4o-mini'"),
            ("grading_model", "VARCHAR(64) DEFAULT 'gpt-4o-mini'"),
            ("generation_model", "VARCHAR(64) DEFAULT 'gpt-4o-mini'"),
            ("explanation_model", "VARCHAR(64) DEFAULT 'gpt-4o-mini'")
        ]
        for col_name, col_type in new_cols:
            if col_name not in cols:
                cur.execute(f"ALTER TABLE ai_provider_configs ADD COLUMN {col_name} {col_type}")
                print(f"Added {col_name} to {db_path}")
        conn.commit()
        conn.close()

print("AI config migration finished successfully.")
