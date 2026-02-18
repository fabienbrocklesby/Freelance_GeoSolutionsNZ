# GeoSolutions

Deployment topology:

- Frontend: Cloudflare Pages (`/client`)
- Backend: Strapi on VPS (`/api`)
- Database: Postgres on VPS (Docker)

Runtime baseline:

- Node.js 20.x for local frontend/backend
- Docker + Docker Compose for local Postgres and VPS services

## Quick Commands

- Local dev (host frontend/backend, Docker Postgres):
  - `cp .env.development.example .env.development`
  - `make local-install`
  - `make local-dev`

- VPS deployment (Strapi + Postgres + Caddy):
  - `cp .env.vps.example .env.vps`
  - `make vps-up`

Full runbook: `docs/cloudflare-pages-vps-deployment.md`

Production-first runbook (VPS + CI + R2 backups): `docs/production-first-try-runbook.md`
