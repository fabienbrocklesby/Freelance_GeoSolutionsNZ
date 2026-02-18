#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.development}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  echo "Copy $ROOT_DIR/.env.development.example to $ROOT_DIR/.env.development and update values."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

echo "Starting local Postgres container..."
docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/docker-compose.dev.yml" up -d postgres

echo "Waiting for Postgres to become healthy..."
POSTGRES_READY=false
for _ in {1..30}; do
  if docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/docker-compose.dev.yml" exec -T postgres \
    pg_isready -U "${DATABASE_USERNAME:-strapi}" -d "${DATABASE_NAME:-strapi}" >/dev/null 2>&1; then
    POSTGRES_READY=true
    break
  fi
  sleep 1
done

if [[ "$POSTGRES_READY" != "true" ]]; then
  echo "Postgres did not become ready in time."
  exit 1
fi

echo "Starting Strapi and Astro on host..."
cleanup() {
  kill "${API_PID:-0}" "${CLIENT_PID:-0}" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

(
  cd "$ROOT_DIR/api"
  npm run develop
) &
API_PID=$!

(
  cd "$ROOT_DIR/client"
  npm run dev -- --host 0.0.0.0 --port "${FRONTEND_PORT:-4321}"
) &
CLIENT_PID=$!

wait "$API_PID" "$CLIENT_PID"
