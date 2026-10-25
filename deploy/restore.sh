#!/usr/bin/env bash
# ==============================================================================
# Database & Media Restoration Script for Linux VPS
# Physics Association Platform - Shahid Beheshti 2 High School
# ==============================================================================

set -euo pipefail

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 /path/to/physics_backup_YYYYMMDD_HHMMSS.tar.gz"
    exit 1
fi

ARCHIVE_PATH="$1"

if [ ! -f "${ARCHIVE_PATH}" ]; then
    echo "Error: Backup file does not exist: ${ARCHIVE_PATH}"
    exit 1
fi

TEMP_RESTORE_DIR="/tmp/physics_restore_$$"
mkdir -p "${TEMP_RESTORE_DIR}"

trap 'rm -rf "${TEMP_RESTORE_DIR}"' EXIT

# Source environment variables if .env exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

DB_CONTAINER="${DB_CONTAINER:-physics_postgres_prod}"
DB_USER="${POSTGRES_USER:-physics_user}"
DB_NAME="${POSTGRES_DB:-physics_db}"

echo "=========================================================="
echo " RESTORING PHYSICS PLATFORM FROM BACKUP"
echo " Archive: ${ARCHIVE_PATH}"
echo "=========================================================="
read -p "Are you sure you want to overwrite the current database and media? (y/N): " CONFIRM
if [[ "${CONFIRM}" != "y" && "${CONFIRM}" != "Y" ]]; then
    echo "Restoration aborted."
    exit 0
fi

echo "[1/3] Unpacking backup archive..."
tar -xzf "${ARCHIVE_PATH}" -C "${TEMP_RESTORE_DIR}"
BACKUP_FOLDER=$(find "${TEMP_RESTORE_DIR}" -mindepth 1 -maxdepth 1 -type d | head -n 1)

# Restore Database
if [ -f "${BACKUP_FOLDER}/database.sql" ]; then
    echo "[2/3] Restoring PostgreSQL database..."
    if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
        docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d postgres -c \
            "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();" || true
        docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}" < "${BACKUP_FOLDER}/database.sql"
        echo "PostgreSQL database restored successfully."
    else
        echo "Note: PostgreSQL container ${DB_CONTAINER} is not running; skipped SQL dump restore."
    fi
fi

if [ -f "${BACKUP_FOLDER}/physics_platform.db" ]; then
    echo "Restoring SQLite database to physics_platform.db..."
    cp "${BACKUP_FOLDER}/physics_platform.db" "$(dirname "$0")/../physics_platform.db"
    echo "SQLite database restored successfully."
fi

# Restore Media Data
if [ -f "${BACKUP_FOLDER}/media_data.tar.gz" ]; then
    echo "[3/3] Restoring media files and textbooks..."
    tar -xzf "${BACKUP_FOLDER}/media_data.tar.gz" -C "$(dirname "$0")/../"
    echo "Media files restored successfully."
fi

echo "=========================================================="
echo " Restoration completed successfully!"
echo " Recommended: Restart the app container with: docker compose restart app"
echo "=========================================================="
