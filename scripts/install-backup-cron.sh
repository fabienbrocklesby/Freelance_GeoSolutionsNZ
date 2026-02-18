#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.vps}"
BACKUP_ENV_FILE="${BACKUP_ENV_FILE:-$ROOT_DIR/.env.backup}"
CRON_SCHEDULE="${BACKUP_CRON_SCHEDULE:-30 2 * * *}"
CRON_LOG_FILE="${BACKUP_CRON_LOG_FILE:-/var/log/geosolutions-backup.log}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  exit 1
fi

if [[ ! -f "$BACKUP_ENV_FILE" ]]; then
  echo "Missing backup env file: $BACKUP_ENV_FILE"
  exit 1
fi

entry="$CRON_SCHEDULE cd \"$ROOT_DIR\" && ENV_FILE=\"$ENV_FILE\" BACKUP_ENV_FILE=\"$BACKUP_ENV_FILE\" \"$ROOT_DIR/scripts/backup-postgres-to-r2.sh\" >> \"$CRON_LOG_FILE\" 2>&1"

existing="$(crontab -l 2>/dev/null || true)"
filtered="$(printf '%s\n' "$existing" | grep -v 'backup-postgres-to-r2.sh' || true)"

{
  printf '%s\n' "$filtered"
  printf '%s\n' "$entry"
} | crontab -

echo "Installed cron backup job: $CRON_SCHEDULE"
echo "Log file: $CRON_LOG_FILE"
