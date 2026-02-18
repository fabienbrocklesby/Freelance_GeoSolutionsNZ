#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MARKER_DIR="${MIGRATION_STATE_DIR:-$ROOT_DIR/.deploy-state}"
MARKER_FILE="${MIGRATION_MARKER_FILE:-$MARKER_DIR/migrate-import-prod.done}"

if [[ -f "$MARKER_FILE" && "${FORCE_MIGRATION_IMPORT:-false}" != "true" ]]; then
  echo "Migration import is already marked as completed: $MARKER_FILE"
  echo "Refusing to run again. Set FORCE_MIGRATION_IMPORT=true only if intentional."
  exit 1
fi

cd "$ROOT_DIR"
make migrate-import-prod

mkdir -p "$MARKER_DIR"
date -u +"%Y-%m-%dT%H:%M:%SZ" >"$MARKER_FILE"

echo "Migration import completed and marked at: $MARKER_FILE"
