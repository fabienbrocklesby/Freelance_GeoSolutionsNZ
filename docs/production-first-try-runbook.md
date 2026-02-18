# GeoSolutions Production Runbook (Cloudflare Pages + VPS)

This runbook is tailored to this repository and is designed for a clean DigitalOcean droplet setup with repeatable deploys.

## 1. Target architecture

- Astro frontend: Cloudflare Pages (`/client`)
- Strapi API: Docker on VPS (`/api`)
- PostgreSQL: Docker on VPS
- TLS and reverse proxy: Caddy in Docker
- Domain DNS: Cloudflare
- Backups: PostgreSQL + Strapi uploads to Cloudflare R2

Important for this repo:

- Normal deploys use `make vps-up` only.
- Legacy content import is separate and must be run once with `make migrate-import-prod-once`.
- CI deploy never calls migration/import commands.

## 2. Minimum droplet specs

Use this minimum for reliable first deploy/build:

- Ubuntu 24.04 LTS
- 2 vCPU
- 4 GB RAM
- 80 GB SSD
- 1 static IPv4

If you expect heavier admin usage/media growth, start at 4 vCPU / 8 GB RAM.

## 3. Prepare domain and Cloudflare

Use these records in Cloudflare DNS:

- `A` record `api` -> `YOUR_DROPLET_IP` (set to DNS-only for first TLS issuance)
- Pages custom domain records for root and `www` (managed by Pages onboarding)

Cloudflare SSL/TLS mode should be `Full (strict)` after certs are active.

## 4. Bootstrap a fresh droplet

SSH to droplet and run:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git make jq awscli ufw fail2ban

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker

# Node.js 20 (needed for migration scripts in this repo)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Basic firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 5. Clone and configure repo on droplet

```bash
cd /opt
sudo mkdir -p geosolutions && sudo chown -R "$USER":"$USER" geosolutions
cd geosolutions
git clone <YOUR_REPO_URL> .

cp .env.vps.example .env.vps
cp .env.backup.example .env.backup
```

Set real values in `.env.vps`:

- `API_DOMAIN=api.yourdomain.com`
- `ACME_EMAIL=you@yourdomain.com`
- Strong secrets: `APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`
- DB credentials
- `STRAPI_PUBLIC_URL=https://api.yourdomain.com`
- `CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://<pages-project>.pages.dev`

Generate secrets (example):

```bash
openssl rand -base64 32
```

## 6. First backend deploy

```bash
cd /opt/geosolutions
make vps-up
```

This now:

- Builds and starts `postgres`, `strapi`, `caddy`
- Waits for Strapi health endpoint
- Fails fast if health check does not pass

Verify:

```bash
curl -I https://api.yourdomain.com/_health
```

Open admin:

- `https://api.yourdomain.com/admin`

If TLS does not issue on first attempt, keep `api` DNS record as DNS-only until health is good, then re-enable proxy if you want.

## 7. One-time legacy migration/import

This is intentionally separate from deploy.

1. Create Strapi API token in admin:
- `Settings -> API Tokens`
- Full access for import phase

2. Set token in `.env.vps`:
- `MIGRATION_STRAPI_TOKEN=...`

3. Export legacy data:

```bash
make migrate-export-prod
```

4. Dry run import:

```bash
make migrate-import-prod-dry
```

5. Real import (guarded to run once):

```bash
make migrate-import-prod-once
```

Guard behavior:

- Creates `.deploy-state/migrate-import-prod.done`
- Refuses repeat import unless `FORCE_MIGRATION_IMPORT=true`

## 8. Cloudflare Pages (Astro)

Create/Configure Pages project:

- Framework: `Astro`
- Root directory: `client`
- Build command: `npm ci && npm run build`
- Output directory: `dist`

Pages environment variables:

- `PUBLIC_API_URL=https://api.yourdomain.com`
- `PUBLIC_IMAGE_URL=https://api.yourdomain.com`
- `PUBLIC_FILE_URL=https://api.yourdomain.com`
- `PUBLIC_SITE_URL=https://yourdomain.com`

Attach `yourdomain.com` and `www.yourdomain.com` in Pages custom domains.

## 9. Rebuild Pages when Strapi content changes

With current Astro config (`output: server`), most Strapi updates are fetched at runtime and appear without rebuild.

If you still want forced Pages rebuilds on content changes:

1. Create a Cloudflare Pages Deploy Hook in your Pages project settings.
2. In Strapi admin: `Settings -> Webhooks -> Create webhook`.
3. URL = that Deploy Hook URL.
4. Enable events:
- `entry.create`
- `entry.update`
- `entry.delete`
- `entry.publish`
- `entry.unpublish`
- `media.create`
- `media.update`
- `media.delete`

This gives automatic frontend redeploy on Strapi edits.

## 10. CI/CD: deploy Strapi on `main`

This repo now includes:

- `.github/workflows/deploy-strapi.yml`
- `scripts/vps-deploy-main.sh`

Behavior:

- On push to `main`, workflow SSHes to droplet
- Pulls latest `main`
- Runs `make vps-up`
- Does not run migration/import targets

Add GitHub repo secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_APP_DIR` (example `/opt/geosolutions`)
- Optional: `VPS_PORT`

Also ensure the VPS clone can `git pull` non-interactively (SSH deploy key or HTTPS credential helper already configured on server).

## 11. Backups to Cloudflare R2

This repo now includes:

- `scripts/backup-postgres-to-r2.sh`
- `scripts/install-backup-cron.sh`
- `.env.backup.example`

Configure `.env.backup` with R2 credentials, then run a test backup:

```bash
make backup-r2
```

Install daily cron backup (default `02:30 UTC`):

```bash
make install-backup-cron
```

Backup contents per run:

- Postgres dump (`pg_dump -Fc`)
- Strapi uploads archive (`uploads.tar.gz`)
- Manifest JSON

Set lifecycle retention on the R2 bucket (for example: daily backups kept 30-90 days).

## 12. Restore procedure (disaster recovery)

From an R2 backup set (`postgres.dump`, `uploads.tar.gz`):

```bash
# Download files locally on VPS first (example)
aws --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com s3 cp s3://<BUCKET>/<PREFIX>/<STAMP>/postgres.dump ./postgres.dump
aws --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com s3 cp s3://<BUCKET>/<PREFIX>/<STAMP>/uploads.tar.gz ./uploads.tar.gz

# Load runtime vars
set -a && source .env.vps && set +a

# Restore database
cat ./postgres.dump | docker compose --env-file .env.vps -f docker-compose.yml exec -T postgres \
  pg_restore -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" --clean --if-exists

# Restore uploads
docker compose --env-file .env.vps -f docker-compose.yml exec -T strapi sh -lc 'rm -rf /opt/app/public/uploads/*'
cat ./uploads.tar.gz | docker compose --env-file .env.vps -f docker-compose.yml exec -T strapi \
  sh -lc 'tar -xzf - -C /opt/app/public'

# Restart services
make vps-up
```

## 13. Safe operations checklist

- Never run `docker compose down -v` in production.
- Never include `make migrate-import-prod*` in CI/CD.
- Keep `.env.vps` and `.env.backup` only on server, never committed.
- Test restore quarterly in a staging droplet.
- Keep Strapi and Postgres image tags current and patch monthly.

Useful commands:

- `make vps-ps`
- `make vps-logs`
- `make vps-down`
- `make vps-up`
- `make backup-r2`

## 14. Fast failure recovery

- API unhealthy after deploy:
  - `make vps-logs`
  - Verify `.env.vps` secrets and `CORS_ALLOWED_ORIGINS`
  - Verify `API_DOMAIN` DNS resolves to droplet
- TLS not issuing:
  - Temporarily set `api` DNS record to DNS-only
  - Re-run `make vps-up`
- CI deploy fails over SSH:
  - Verify `VPS_*` GitHub secrets
  - Ensure repo path exists and `scripts/vps-deploy-main.sh` is executable on VPS
- Backup upload fails:
  - Verify `.env.backup` credentials and bucket
  - Verify endpoint format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
