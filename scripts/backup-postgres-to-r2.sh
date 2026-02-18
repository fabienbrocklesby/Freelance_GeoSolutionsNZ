#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.vps}"
BACKUP_ENV_FILE="${BACKUP_ENV_FILE:-$ROOT_DIR/.env.backup}"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  exit 1
fi

if [[ ! -f "$BACKUP_ENV_FILE" ]]; then
  echo "Missing backup env file: $BACKUP_ENV_FILE"
  echo "Copy $ROOT_DIR/.env.backup.example to $ROOT_DIR/.env.backup and set values."
  exit 1
fi

for cmd in docker aws tar; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Required command not found: $cmd"
    exit 1
  fi
done

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
# shellcheck disable=SC1090
source "$BACKUP_ENV_FILE"
set +a

required_vars=(
  DATABASE_USERNAME
  DATABASE_NAME
  R2_ACCOUNT_ID
  R2_BUCKET
  R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY
)

for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing required variable: $var"
    exit 1
  fi
done

running_services="$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps --status running --services || true)"
for service in postgres strapi; do
  if ! grep -qx "$service" <<<"$running_services"; then
    echo "Service '$service' is not running. Start stack first with: make vps-up"
    exit 1
  fi
done

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_root="${BACKUP_WORK_DIR:-/tmp/geosolutions-backups}"
work_dir="$backup_root/$timestamp"
mkdir -p "$work_dir"

db_dump_path="$work_dir/postgres.dump"
uploads_archive_path="$work_dir/uploads.tar.gz"
manifest_path="$work_dir/manifest.json"

echo "Creating Postgres backup..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -Fc >"$db_dump_path"

echo "Creating Strapi uploads backup..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T strapi \
  sh -lc 'tar -czf - -C /opt/app/public uploads' >"$uploads_archive_path"

endpoint="${R2_ENDPOINT:-https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com}"
prefix="${R2_PREFIX:-geosolutions/prod}"
backup_key_prefix="${prefix%/}/$timestamp"

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="${R2_REGION:-auto}"

postgres_size="$(wc -c <"$db_dump_path" | tr -d ' ')"
uploads_size="$(wc -c <"$uploads_archive_path" | tr -d ' ')"

cat >"$manifest_path" <<JSON
{
  "timestamp": "$timestamp",
  "database": {
    "name": "$DATABASE_NAME",
    "user": "$DATABASE_USERNAME",
    "format": "pg_dump_custom",
    "bytes": $postgres_size,
    "file": "postgres.dump"
  },
  "uploads": {
    "bytes": $uploads_size,
    "file": "uploads.tar.gz"
  }
}
JSON

echo "Uploading backup to Cloudflare R2..."
aws --endpoint-url "$endpoint" s3 cp "$db_dump_path" "s3://$R2_BUCKET/$backup_key_prefix/postgres.dump"
aws --endpoint-url "$endpoint" s3 cp "$uploads_archive_path" "s3://$R2_BUCKET/$backup_key_prefix/uploads.tar.gz"
aws --endpoint-url "$endpoint" s3 cp "$manifest_path" "s3://$R2_BUCKET/$backup_key_prefix/manifest.json"

echo "Backup uploaded to: s3://$R2_BUCKET/$backup_key_prefix/"

if [[ "${KEEP_LOCAL_BACKUPS:-false}" != "true" ]]; then
  rm -rf "$work_dir"
  echo "Removed local backup files from $work_dir"
else
  echo "Kept local backup files in $work_dir"
fi
