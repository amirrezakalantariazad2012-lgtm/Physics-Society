#!/usr/bin/env bash
# ==============================================================================
# Automated Database & Media Backup Script for Linux VPS
# Physics Association Platform - Shahid Beheshti 2 High School
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/physics_platform}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="physics_backup_${TIMESTAMP}"
TARGET_DIR="${BACKUP_DIR}/${BACKUP_NAME}"

# Source environment variables if .env exists in parent directory
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

DB_CONTAINER="${DB_CONTAINER:-physics_postgres_prod}"
DB_USER="${POSTGRES_USER:-physics_user}"
DB_NAME="${POSTGRES_DB:-physics_db}"

echo "=========================================================="
echo " Starting Backup for Physics Association Platform"
echo " Timestamp: ${TIMESTAMP}"
echo "=========================================================="

mkdir -p "${TARGET_DIR}"

# 1. Database Backup (Supports both PostgreSQL container and SQLite file)
echo "[1/3] Creating database backup..."
if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    echo "Dumping PostgreSQL database from container ${DB_CONTAINER}..."
    docker exec "${DB_CONTAINER}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists > "${TARGET_DIR}/database.sql"
    echo "PostgreSQL database dump complete (${TARGET_DIR}/database.sql)."
fi

if [ -f "$(dirname "$0")/../physics_platform.db" ]; then
    echo "Backing up local SQLite database physics_platform.db..."
    sqlite3 "$(dirname "$0")/../physics_platform.db" ".backup '${TARGET_DIR}/physics_platform.db'" || cp "$(dirname "$0")/../physics_platform.db" "${TARGET_DIR}/physics_platform.db"
    echo "SQLite backup complete (${TARGET_DIR}/physics_platform.db)."
fi

# 2. Backup Textbook & Uploaded Files
echo "[2/3] Archiving media files and uploaded textbooks..."
if [ -d "$(dirname "$0")/../data" ]; then
    tar -czf "${TARGET_DIR}/media_data.tar.gz" -C "$(dirname "$0")/.." data/
fi

# 3. Create Compressed Archive
echo "[3/3] Compressing complete backup package..."
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" -C "${BACKUP_DIR}" "${BACKUP_NAME}"
rm -rf "${TARGET_DIR}"

echo "=========================================================="
echo " Backup successfully created:"
echo " ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo " Size: $(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)"
echo "=========================================================="

# 4. Cleanup old backups (keep 14 days)
echo "Pruning backups older than 14 days..."
find "${BACKUP_DIR}" -name "physics_backup_*.tar.gz" -type f -mtime +14 -delete
echo "Backup process finished."
