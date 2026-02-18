SHELL := /bin/bash

.PHONY: help local-install local-db-up local-db-down local-db-logs local-db-ps local-db-shell local-db-reset \
	local-api local-client local-dev local-stop \
	vps-up vps-down vps-logs vps-ps vps-rebuild vps-deploy-main \
	backup-r2 install-backup-cron \
	prod-up prod-down prod-logs prod-ps prod-rebuild \
	migrate-export migrate-export-local migrate-export-prod \
	migrate-import-dry migrate-import migrate-import-local-dry migrate-import-local migrate-import-prod-dry migrate-import-prod migrate-import-prod-once

help:
	@echo "GeoSolutions commands"
	@echo ""
	@echo "Local development (host frontend + host backend + Docker Postgres):"
	@echo "  make local-install   Install dependencies for api and client"
	@echo "  make local-db-up     Start local Postgres container"
	@echo "  make local-db-down   Stop local Postgres container"
	@echo "  make local-db-logs   Follow local Postgres logs"
	@echo "  make local-db-ps     Show local Postgres status"
	@echo "  make local-db-shell  Open psql shell in local Postgres container"
	@echo "  make local-db-reset  Remove local Postgres volume"
	@echo "  make local-api       Run Strapi on host (loads .env.development)"
	@echo "  make local-client    Run Astro on host"
	@echo "  make local-dev       Start local Postgres then run Strapi + Astro on host"
	@echo "  make local-stop      Stop local Postgres"
	@echo ""
	@echo "VPS production (Strapi + Postgres + Caddy):"
	@echo "  make vps-up          Build and start VPS stack"
	@echo "  make vps-down        Stop VPS stack"
	@echo "  make vps-logs        Follow VPS logs"
	@echo "  make vps-ps          Show VPS stack status"
	@echo "  make vps-rebuild     Rebuild VPS images and restart"
	@echo "  make vps-deploy-main Pull latest main branch on VPS and deploy"
	@echo "  make backup-r2       Backup Postgres + uploads to Cloudflare R2"
	@echo "  make install-backup-cron Install daily cron job for backups"
	@echo ""
	@echo "Backward-compatible aliases:"
	@echo "  make prod-up|prod-down|prod-logs|prod-ps|prod-rebuild"
	@echo ""
	@echo "Legacy migration (export from old site + import to new Strapi):"
	@echo "  make migrate-export-local     Export legacy data using .env.development"
	@echo "  make migrate-export-prod      Export legacy data using .env.vps"
	@echo "  make migrate-import-local-dry Dry-run import into local Strapi"
	@echo "  make migrate-import-local     Import into local Strapi"
	@echo "  make migrate-import-prod-dry  Dry-run import into production Strapi"
	@echo "  make migrate-import-prod      Import into production Strapi"
	@echo "  make migrate-import-prod-once Import into production Strapi only once (guarded)"
	@echo "  make migrate-export           Alias of migrate-export-local"
	@echo "  make migrate-import-dry       Alias of migrate-import-local-dry"
	@echo "  make migrate-import           Alias of migrate-import-local"

local-install:
	cd api && npm install
	cd client && npm install

local-db-up:
	docker compose --env-file .env.development -f docker-compose.dev.yml up -d postgres

local-db-down:
	docker compose --env-file .env.development -f docker-compose.dev.yml down

local-db-logs:
	docker compose --env-file .env.development -f docker-compose.dev.yml logs -f postgres

local-db-ps:
	docker compose --env-file .env.development -f docker-compose.dev.yml ps

local-db-shell:
	docker compose --env-file .env.development -f docker-compose.dev.yml exec postgres psql -U $${DATABASE_USERNAME:-strapi} -d $${DATABASE_NAME:-strapi}

local-db-reset:
	docker compose --env-file .env.development -f docker-compose.dev.yml down -v

local-api:
	@set -a; source .env.development; set +a; cd api && npm run develop

local-client:
	cd client && npm run dev -- --host 0.0.0.0 --port 4321

local-dev:
	./scripts/local-dev.sh

local-stop:
	docker compose --env-file .env.development -f docker-compose.dev.yml down

vps-up:
	./scripts/vps-up.sh

vps-down:
	./scripts/vps-down.sh

vps-logs:
	./scripts/vps-logs.sh

vps-ps:
	docker compose --env-file .env.vps -f docker-compose.yml ps

vps-rebuild:
	docker compose --env-file .env.vps -f docker-compose.yml build --no-cache
	docker compose --env-file .env.vps -f docker-compose.yml up -d

vps-deploy-main:
	./scripts/vps-deploy-main.sh

backup-r2:
	./scripts/backup-postgres-to-r2.sh

install-backup-cron:
	./scripts/install-backup-cron.sh

prod-up: vps-up
prod-down: vps-down
prod-logs: vps-logs
prod-ps: vps-ps
prod-rebuild: vps-rebuild

migrate-export-local:
	@set -a; [ -f .env ] && source .env; [ -f .env.development ] && source .env.development; set +a; \
	node scripts/export-legacy-site.mjs \
		--base-url "$${LEGACY_SITE_URL:-https://geosolutions.nz}" \
		--out-dir "$${MIGRATION_OUTPUT_DIR:-migration-output/legacy-site-export}" \
		--page-size "$${MIGRATION_PAGE_SIZE:-100}" \
		--timeout-ms "$${MIGRATION_TIMEOUT_MS:-30000}" \
		$${MIGRATION_EXPORT_ARGS:-}

migrate-export-prod:
	@set -a; [ -f .env ] && source .env; [ -f .env.vps ] && source .env.vps; set +a; \
	node scripts/export-legacy-site.mjs \
		--base-url "$${LEGACY_SITE_URL:-https://geosolutions.nz}" \
		--out-dir "$${MIGRATION_OUTPUT_DIR:-migration-output/legacy-site-export}" \
		--page-size "$${MIGRATION_PAGE_SIZE:-100}" \
		--timeout-ms "$${MIGRATION_TIMEOUT_MS:-30000}" \
		$${MIGRATION_EXPORT_ARGS:-}

migrate-import-local-dry:
	@set -a; [ -f .env ] && source .env; [ -f .env.development ] && source .env.development; set +a; \
	MIG_SEED="$${MIGRATION_SEED_PATH:-$${MIGRATION_OUTPUT_DIR:-migration-output/legacy-site-export}/strapi-seed.legacy.json}"; \
	node scripts/import-legacy-to-strapi.mjs \
		--seed "$$MIG_SEED" \
		--strapi-url "$${MIGRATION_STRAPI_URL:-$${STRAPI_PUBLIC_URL:-http://localhost:1337}}" \
		--timeout-ms "$${MIGRATION_TIMEOUT_MS:-30000}" \
		--dry-run \
		$${MIGRATION_IMPORT_ARGS:-}

migrate-import-local:
	@set -a; [ -f .env ] && source .env; [ -f .env.development ] && source .env.development; set +a; \
	MIG_SEED="$${MIGRATION_SEED_PATH:-$${MIGRATION_OUTPUT_DIR:-migration-output/legacy-site-export}/strapi-seed.legacy.json}"; \
	node scripts/import-legacy-to-strapi.mjs \
		--seed "$$MIG_SEED" \
		--strapi-url "$${MIGRATION_STRAPI_URL:-$${STRAPI_PUBLIC_URL:-http://localhost:1337}}" \
		--token "$${MIGRATION_STRAPI_TOKEN:-$${STRAPI_API_TOKEN:-}}" \
		--timeout-ms "$${MIGRATION_TIMEOUT_MS:-30000}" \
		$${MIGRATION_IMPORT_ARGS:-}

migrate-import-prod-dry:
	@set -a; [ -f .env ] && source .env; [ -f .env.vps ] && source .env.vps; set +a; \
	MIG_SEED="$${MIGRATION_SEED_PATH:-$${MIGRATION_OUTPUT_DIR:-migration-output/legacy-site-export}/strapi-seed.legacy.json}"; \
	node scripts/import-legacy-to-strapi.mjs \
		--seed "$$MIG_SEED" \
		--strapi-url "$${MIGRATION_STRAPI_URL:-$${STRAPI_PUBLIC_URL:-http://localhost:1337}}" \
		--timeout-ms "$${MIGRATION_TIMEOUT_MS:-30000}" \
		--dry-run \
		$${MIGRATION_IMPORT_ARGS:-}

migrate-import-prod:
	@set -a; [ -f .env ] && source .env; [ -f .env.vps ] && source .env.vps; set +a; \
	MIG_SEED="$${MIGRATION_SEED_PATH:-$${MIGRATION_OUTPUT_DIR:-migration-output/legacy-site-export}/strapi-seed.legacy.json}"; \
	node scripts/import-legacy-to-strapi.mjs \
		--seed "$$MIG_SEED" \
		--strapi-url "$${MIGRATION_STRAPI_URL:-$${STRAPI_PUBLIC_URL:-http://localhost:1337}}" \
		--token "$${MIGRATION_STRAPI_TOKEN:-$${STRAPI_API_TOKEN:-}}" \
		--timeout-ms "$${MIGRATION_TIMEOUT_MS:-30000}" \
		$${MIGRATION_IMPORT_ARGS:-}

migrate-import-prod-once:
	./scripts/migrate-import-prod-once.sh

migrate-export: migrate-export-local
migrate-import-dry: migrate-import-local-dry
migrate-import: migrate-import-local
