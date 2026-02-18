# Cloudflare Pages + VPS Deployment Runbook

For the full production version with CI/CD and R2 backups, see `docs/production-first-try-runbook.md`.

This project is now structured for:

- Frontend on **Cloudflare Pages** (Astro + Cloudflare adapter)
- Backend on **VPS** (Strapi in Docker)
- Database on **VPS** (Postgres in Docker)
- Local development with **host frontend/backend + Docker Postgres only**

## Prerequisites

- Node.js 20.x
- Docker + Docker Compose
- Cloudflare account with:
  - a Pages project for the frontend
  - DNS management for your domain

## 1. Local Development (Host app, Docker Postgres)

1. Create a local env file:
```bash
cp .env.development.example .env.development
```
2. Fill real secrets in `.env.development` (`APP_KEYS`, `JWT_SECRET`, etc.).
3. Install dependencies:
```bash
make local-install
```
4. Start local stack:
```bash
make local-dev
```

What `make local-dev` does:
- Starts Postgres from `docker-compose.dev.yml`
- Runs Strapi on host (`http://localhost:1337`)
- Runs Astro on host (`http://localhost:4321`)

Useful local commands:
- `make local-db-up`
- `make local-db-down`
- `make local-db-reset`
- `make local-stop`

## 2. VPS Backend Deployment (Strapi + Postgres + Caddy)

1. On the VPS, copy env template:
```bash
cp .env.vps.example .env.vps
```
2. Set required values in `.env.vps`:
- `API_DOMAIN` (example: `api.example.com`)
- `ACME_EMAIL`
- Strapi secrets (`APP_KEYS`, `JWT_SECRET`, etc.)
- DB credentials
- `CORS_ALLOWED_ORIGINS` with your frontend domains

3. Point DNS to VPS:
- In Cloudflare DNS, create `A` record `api` -> `VPS_IP`
- Keep proxy enabled if desired

4. Start VPS stack:
```bash
make vps-up
```

5. Verify:
```bash
curl -I https://api.example.com/_health
```
- Strapi admin: `https://api.example.com/admin`

Useful VPS commands:
- `make vps-logs`
- `make vps-ps`
- `make vps-down`

## 3. Cloudflare Pages Frontend Deployment

In Cloudflare Pages project settings:

- Framework preset: `Astro`
- Root directory: `client`
- Build command: `npm ci && npm run build`
- Build output directory: `dist`

Set Pages environment variables:

- `PUBLIC_API_URL=https://api.example.com`
- `PUBLIC_IMAGE_URL=https://api.example.com`
- `PUBLIC_FILE_URL=https://api.example.com`
- `PUBLIC_SITE_URL=https://example.com`

Then attach your custom domain in Pages (example: `example.com` / `www.example.com`).

## 4. CORS Checklist

Browser-side API requests happen from the contact form, so keep these origins in `CORS_ALLOWED_ORIGINS`:

- Production frontend domain(s), for example:
  - `https://example.com`
  - `https://www.example.com`
- Optional preview domain:
  - `https://your-project.pages.dev`

After changing CORS values, restart backend:
```bash
make vps-up
```

## 5. Operational Notes

- Frontend uses `PUBLIC_API_URL` consistently (server + browser fetches).
- Strapi trusts proxy and uses `STRAPI_PUBLIC_URL` for canonical public URL behavior behind reverse proxy.
- VPS compose file only runs backend concerns (`postgres`, `strapi`, `caddy`).
