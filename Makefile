# GeoSolutions Makefile
# Development and production helpers for Docker Compose

.PHONY: help dev-up dev-down dev-logs dev-logs-astro dev-logs-strapi dev-rebuild dev-reset \
        prod-up prod-down prod-logs prod-rebuild db-seed dev-up-seed db-export db-import

# Default target
help:
	@echo "GeoSolutions - Development & Production Commands"
	@echo ""
	@echo "Development (hot reload):"
	@echo "  make dev-up          Start dev environment with hot reload"
	@echo "  make dev-up-seed     Start dev environment and auto-seed sample data"
	@echo "  make dev-down        Stop dev environment"
	@echo "  make dev-logs        Follow all dev logs"
	@echo "  make dev-logs-astro  Follow Astro dev logs"
	@echo "  make dev-logs-strapi Follow Strapi dev logs"
	@echo "  make dev-rebuild     Rebuild dev containers (no cache)"
	@echo "  make dev-reset       Stop dev and remove volumes (fresh start)"
	@echo "  make dev-ps          Show dev container status"
	@echo ""
	@echo "Database:"
	@echo "  make db-seed         Seed database with sample data"
	@echo "  make db-export       Export current data for seeding"
	@echo "  make db-import       Import seed data into Strapi"
	@echo "  make db-backup       Backup PostgreSQL database"
	@echo "  make db-shell        Open PostgreSQL shell"
	@echo ""
	@echo "Production:"
	@echo "  make prod-up         Start production environment"
	@echo "  make prod-down       Stop production environment"
	@echo "  make prod-logs       Follow production logs"
	@echo "  make prod-rebuild    Rebuild production containers (no cache)"
	@echo "  make prod-ps         Show production container status"
	@echo ""
	@echo "URLs:"
	@echo "  Astro:        http://localhost:4321"
	@echo "  Strapi Admin: http://localhost:1337/admin"
	@echo "  Strapi API:   http://localhost:1337/api"

# =====================
# Development Commands
# =====================

dev-up:
	docker compose -f docker-compose.dev.yml up -d --build
	@echo ""
	@echo "✓ Dev environment starting..."
	@echo "  Astro:        http://localhost:4321"
	@echo "  Strapi Admin: http://localhost:1337/admin"
	@echo ""
	@echo "Run 'make dev-logs' to follow logs"

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-logs-astro:
	docker compose -f docker-compose.dev.yml logs -f astro

dev-logs-strapi:
	docker compose -f docker-compose.dev.yml logs -f strapi

dev-rebuild:
	docker compose -f docker-compose.dev.yml build --no-cache
	docker compose -f docker-compose.dev.yml up -d

dev-reset:
	docker compose -f docker-compose.dev.yml down -v
	@echo "✓ Dev volumes removed. Run 'make dev-up' for fresh start."

dev-ps:
	docker compose -f docker-compose.dev.yml ps

dev-shell-strapi:
	docker compose -f docker-compose.dev.yml exec strapi sh

dev-shell-astro:
	docker compose -f docker-compose.dev.yml exec astro sh

# =====================
# Production Commands
# =====================

prod-up:
	docker compose up -d --build

prod-down:
	docker compose down

prod-logs:
	docker compose logs -f

prod-rebuild:
	docker compose build --no-cache
	docker compose up -d

prod-ps:
	docker compose ps

# =====================
# Database Commands
# =====================

db-backup:
	@mkdir -p backups
	docker compose -f docker-compose.dev.yml exec postgres pg_dump -U strapi strapi > backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "✓ Database backed up to backups/"

db-shell:
	docker compose -f docker-compose.dev.yml exec postgres psql -U strapi -d strapi

# Seed the database with sample data (for development)
db-seed:
	@echo "🌱 Seeding database with sample data..."
	docker compose -f docker-compose.dev.yml exec -e SEED_DATABASE=true strapi node scripts/seed.js
	@echo ""
	@echo "✓ Database seeded! Next steps:"
	@echo "  1. Go to Strapi Admin: http://localhost:1337/admin"
	@echo "  2. Upload images for Hero, Team members, and Projects"
	@echo "  3. Refresh the frontend: http://localhost:4321"

# Start dev environment with auto-seeding enabled
dev-up-seed:
	SEED_DATABASE=true docker compose -f docker-compose.dev.yml up -d --build
	@echo ""
	@echo "✓ Dev environment starting with auto-seed enabled..."
	@echo "  Astro:        http://localhost:4321"
	@echo "  Strapi Admin: http://localhost:1337/admin"
	@echo ""
	@echo "Run 'make dev-logs' to follow logs"

# Export current Strapi data for seeding (requires strapi-plugin-import-export-entries)
db-export:
	@mkdir -p api/data/seed
	docker compose -f docker-compose.dev.yml exec strapi npm run strapi export -- --no-encrypt -f /opt/app/data/seed/export
	@echo "✓ Data exported to api/data/seed/"

# Import seed data into Strapi
db-import:
	docker compose -f docker-compose.dev.yml exec strapi npm run strapi import -- -f /opt/app/data/seed/export.tar.gz
	@echo "✓ Data imported from api/data/seed/"
