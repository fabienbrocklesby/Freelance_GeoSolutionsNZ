#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.vps}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  echo "Copy $ROOT_DIR/.env.vps.example to $ROOT_DIR/.env.vps and set real values first."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${API_DOMAIN:-}" && -z "${STRAPI_PUBLIC_URL:-}" ]]; then
  echo "Set API_DOMAIN or STRAPI_PUBLIC_URL in $ENV_FILE before deploying."
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required for post-deploy health checks."
  exit 1
fi

docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/docker-compose.yml" up -d --build
docker compose --env-file "$ENV_FILE" -f "$ROOT_DIR/docker-compose.yml" ps

HEALTH_BASE_URL="${STRAPI_PUBLIC_URL:-https://${API_DOMAIN}}"
HEALTH_URL="${HEALTH_BASE_URL%/}/_health"

echo "Waiting for Strapi health endpoint: $HEALTH_URL"
for _ in {1..60}; do
  if curl --fail --silent --show-error "$HEALTH_URL" >/dev/null; then
    echo "Strapi is healthy."
    exit 0
  fi
  sleep 2
done

echo "Strapi did not become healthy in time. Check logs with: make vps-logs"
exit 1
