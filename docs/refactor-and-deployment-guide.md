# GeoSolutions Code Refactor & Production Deployment Guide

> **Created:** 2 February 2026  
> **Purpose:** Modernize codebase, implement proper standards, deploy to production with Cloudflare Tunnel  
> **Estimated Time:** 2-3 hours

---

## Model Selection Guide

| Model                 | Best For                                                           | Use When                                                      |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Claude Opus 4.5**   | Complex architecture, critical decisions, multi-file understanding | Production configs, security-sensitive code, layout systems   |
| **Claude Sonnet 4.5** | Balanced code generation, component refactoring, pattern following | Repetitive refactors with clear patterns, standard components |
| **GPT-5.2-codex**     | Boilerplate, config files, Dockerfiles, CI/CD workflows            | Infrastructure code, YAML/JSON configs, environment templates |

---

## Overview

This guide transforms the GeoSolutions codebase from a quickly-developed prototype into production-ready code following Astro and Strapi best practices, then deploys it securely using Cloudflare Tunnel.

### What We're Doing

| Phase       | Stages    | Description                                                  |
| ----------- | --------- | ------------------------------------------------------------ |
| **Phase 1** | 1.1 - 1.7 | Client code refactor (API client, constants, all components) |
| **Phase 2** | 2.1 - 2.2 | Docker configuration (prod + dev compose, Dockerfiles, env)  |
| **Phase 3** | 3.1       | Cloudflare Tunnel setup                                      |
| **Phase 4** | 4.1       | VPS setup + deployment + DB migration                        |
| **Phase 5** | 5.1 - 5.2 | Cleanup + verification (+ optional CI/CD)                    |

**Total: 11 stages** (down from 18)

### Architecture

```
Cloudflare (DNS + SSL + CDN + DDoS Protection)
                    ↓
            Cloudflare Tunnel
                    ↓
        DigitalOcean VPS ($12-24/mo)
        ├── cloudflared (tunnel daemon)
        ├── Docker Compose
        │   ├── postgres:5432 (internal)
        │   ├── strapi:1337 (internal)
        │   └── astro:4321 (internal)
        └── Volumes (uploads, database)
```

---

## Pre-Flight Checklist

- [ ] Backup current codebase: `git add -A && git commit -m "pre-refactor backup"`
- [ ] Docker running locally
- [ ] Cloudflare account with domain configured
- [ ] DigitalOcean VPS ready (Ubuntu 22.04+ recommended)

---

# Phase 1: Client Code Refactor

## Stage 1.1: Create Centralized API Client

**Model:** Claude Sonnet 4.5  
**Why:** Clear pattern, straightforward utility functions - Sonnet handles this efficiently  
**Time:** 5 minutes

### Prompt

```
I need you to create a centralized API client for my Astro project that fetches from Strapi.

Create the file `client/src/lib/api.js` with:

1. A `fetchAPI(endpoint)` function that:
   - Uses `import.meta.env.PUBLIC_API_URL` as base URL
   - Fetches from `/api/{endpoint}`
   - Returns null on error (no throwing)
   - Handles network failures gracefully

2. A `getImageUrl(path)` function that:
   - Uses `import.meta.env.PUBLIC_IMAGE_URL` as base
   - Returns empty string if path is undefined/null
   - Handles both relative paths and full URLs

3. Export constants for API_URL and IMAGE_URL

Requirements:
- No TypeScript (plain JavaScript)
- No comments unless absolutely necessary
- Clean, self-documenting code
- ESM exports
```

### Expected Output

```javascript
// client/src/lib/api.js
const API_URL = import.meta.env.PUBLIC_API_URL;
const IMAGE_URL = import.meta.env.PUBLIC_IMAGE_URL;

async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_URL}/api/${endpoint}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_URL}${path}`;
}

export { fetchAPI, getImageUrl, API_URL, IMAGE_URL };
```

---

## Stage 1.2: Create Constants File

**Model:** GPT-5.2-codex  
**Why:** Pure boilerplate/config generation - codex excels at structured data  
**Time:** 3 minutes

### Prompt

```
Create `client/src/lib/constants.js` with default/fallback values for all Strapi content.

This file should export objects containing fallback values used when Strapi API calls fail.
These should match the structure expected by components.

Include defaults for:
- Hero section (heading, subheading, buttons)
- Site settings (phone, email, address, footer tagline)
- About section
- Services page
- SEO defaults

Requirements:
- No TypeScript
- No comments
- Use object exports grouped by feature
- Values should be sensible fallbacks, not placeholder text
```

### Expected Output

```javascript
// client/src/lib/constants.js
export const heroDefaults = {
  heading: "Welcome to <strong>GeoSolutions</strong>",
  subheading: "Specialist Geotechnical Consultancy",
  buttonText: "Contact Us",
  buttonUrl: "#contact",
  buttonEnabled: true,
  buttonText2: "Our Services",
  buttonUrl2: "#services",
  buttonEnabled2: true,
};

export const siteDefaults = {
  footerTagline: "Your trusted geotechnical partner",
  phoneNumber: "",
  primaryEmail: "",
  secondaryEmail: "",
  address: "",
};

export const seoDefaults = {
  metaTitle: "GeoSolutions - Geotechnical Consultancy",
  metaDescription:
    "Professional geotechnical engineering and consultancy services.",
};

export const aboutDefaults = {
  title: "About Us",
  content: "",
};

export const servicesDefaults = {
  title: "Our Services",
  description: "",
};
```

---

## Stage 1.3: Refactor Hero Component

**Model:** Claude Sonnet 4.5  
**Why:** Component refactoring with clear pattern - Sonnet's sweet spot  
**Time:** 5 minutes

### Prompt

```
Refactor my Hero.astro component to use the centralized API client.

Current location: `client/src/components/Hero.astro`

The refactored component should:
1. Import `fetchAPI` and `getImageUrl` from `../lib/api.js`
2. Import `heroDefaults` from `../lib/constants.js`
3. Fetch from "hero?populate=Banner"
4. Use defaults when API returns null
5. Parse markdown in heading/subheading with `marked.parseInline()`
6. Use Astro's `getImage` for banner optimization
7. Support two CTA buttons with enable/disable toggles

Remove:
- Inline environment variable access (use the lib functions)
- Duplicate image URL construction logic
- Any unnecessary comments

Keep:
- All current styling and structure
- AOS animations
- Gradient overlay

The component should fail gracefully - if Strapi is down, show defaults.
```

---

## Stage 1.4: Refactor Core Page Components (Contact, Team, About)

**Model:** Claude Sonnet 4.5  
**Why:** Three components with identical refactoring pattern - batch for efficiency  
**Time:** 8 minutes

### Prompt

```
Refactor these three Astro components to use the centralized API client.
All files are in `client/src/components/`.

**1. Contact.astro**
- Import from `../lib/api.js` and `../lib/constants.js`
- Fetch site settings from "site-setting"
- Display phone, email, address from Strapi
- Fix mixed process.env and import.meta.env usage
- Fall back to siteDefaults if API fails
- Keep all current form functionality and styling

**2. Team.astro**
- Import from `../lib/api.js`
- Fetch from "teams?populate=image&sort=order:asc"
- Use `getImageUrl()` for all image URLs instead of manual construction
- Handle empty/null responses - show nothing if no team members
- Keep current card layout

**3. About.astro**
- Import from `../lib/api.js` and `../lib/constants.js`
- Fetch from "about?populate=*"
- Render markdown content with `marked`
- Fall back to aboutDefaults if API fails
- Keep existing styling

For all components:
- Remove direct environment variable access
- Remove hardcoded image URL construction like `${import.meta.env.PUBLIC_IMAGE_URL}${path}`
- Use `getImageUrl(path)` instead
- No comments unless absolutely necessary
- Graceful degradation when Strapi is down
```

---

## Stage 1.5: Refactor Content Components (Projects, Services)

**Model:** Claude Sonnet 4.5  
**Why:** Two content-heavy components with similar patterns  
**Time:** 6 minutes

### Prompt

```
Refactor these two Astro components to use the centralized API client.
All files are in `client/src/components/`.

**1. Projects.astro**
- Import from `../lib/api.js`
- Fetch from "projects?populate=thumbnail&sort=createdAt:desc"
- Use `getImageUrl()` for thumbnail URLs
- Handle empty project list - show nothing or placeholder
- Link to individual project pages at `/projects/[slug]`
- Keep current grid layout and hover effects

**2. Services.astro**
- Import from `../lib/api.js` and `../lib/constants.js`
- Fetch from "services-page?populate=services"
- Display title, description, and service items
- Each service item has: title, description, icon (Lucide icon name)
- Fall back to servicesDefaults if API fails
- Keep current styling

For both:
- Remove direct environment variable access
- Use centralized API functions
- No unnecessary comments
```

---

## Stage 1.6: Refactor Optional Components (Testimonials, Announcement)

**Model:** Claude Sonnet 4.5  
**Why:** Conditional components that may not render - similar logic  
**Time:** 6 minutes

### Prompt

```
Refactor these two conditional Astro components.
Both should completely hide when their content is disabled or empty.
All files are in `client/src/components/`.

**1. Testimonials.astro**
- Import from `../lib/api.js`
- Fetch from "testimonials?populate=avatar&filters[featured][$eq]=true"
- Use `getImageUrl()` for avatar images
- Only render section if featured testimonials exist (check array length)
- Display in carousel or grid layout
- Show nothing if no featured testimonials

**2. AnnouncementBanner.astro**
- Import from `../lib/api.js`
- Fetch from "announcement"
- Only render if `enabled` is true
- Support dismissible with localStorage (key: "announcement-dismissed-{id}")
- Parse message with `marked.parseInline()`
- Apply backgroundColor and textColor from API
- Optional linkText/linkUrl for CTA button

For both:
- Return empty fragment if conditions not met
- Use centralized API functions
- No unnecessary comments
```

---

## Stage 1.7: Update Layout with SEO

**Model:** Claude Opus 4.5  
**Why:** Complex multi-concern component - SEO, meta tags, props merging, global data  
**Time:** 8 minutes

### Prompt

```
Update `client/src/layouts/Layout.astro` to fetch global SEO and site settings from Strapi.

The layout should:
1. Import from `../lib/api.js` and `../lib/constants.js`
2. Accept props for page-specific overrides:
   - title: string (optional)
   - description: string (optional)
   - ogImage: string (optional)
   - noIndex: boolean (optional, default false)

3. Fetch site-wide defaults from "site-setting?populate=seo.ogImage"

4. Merge logic: page props override site defaults override constants

5. Include complete meta tags:
   - <title>{finalTitle}</title>
   - <meta name="description">
   - <link rel="canonical" href={Astro.url}>
   - og:title, og:description, og:image, og:url, og:type
   - twitter:card, twitter:title, twitter:description, twitter:image

6. Use `Astro.url` for canonical and og:url
7. Use `getImageUrl()` for og:image

Keep existing:
- All current head content (fonts, styles, etc.)
- Body structure and slot
- Any existing scripts

The layout must work even if Strapi is completely down.
```

---

# Phase 2: Docker Configuration

## Stage 2.1: Production Docker Setup (Compose + Dockerfiles)

**Model:** Claude Opus 4.5  
**Why:** Production infrastructure - security critical, multiple interdependent files  
**Time:** 10 minutes

### Prompt

```
Create production-ready Docker configuration for deployment with Cloudflare Tunnel.
Update/create these files:

**1. docker-compose.yml** (production)
Services:
- postgres:16-alpine
  - Health check with pg_isready
  - Named volume for data persistence
  - No exposed ports

- strapi (build from ./api)
  - Depends on postgres (healthy)
  - Health check on /_health
  - Named volume for uploads
  - All env vars from .env file

- astro (build from ./client)
  - Build args for PUBLIC_* vars
  - Depends on strapi
  - Runtime env for API URL (internal: http://strapi:1337)

- cloudflared
  - Image: cloudflare/cloudflared:latest
  - Command: tunnel --no-autoupdate run
  - TUNNEL_TOKEN from env
  - Depends on astro, strapi

All services: restart: unless-stopped, no exposed ports

**2. client/Dockerfile** (multi-stage)
- Builder stage: node:20-alpine, npm ci, build with PUBLIC_* args
- Runtime stage: node:20-alpine, non-root user, copy dist + node_modules
- ENV: HOST=0.0.0.0, PORT=4321, NODE_ENV=production
- CMD: node ./dist/server/entry.mjs

**3. api/Dockerfile** (multi-stage)
- Builder stage: node:20-alpine + build deps (vips-dev, gcc, etc.), npm ci, build
- Runtime stage: node:20-alpine + vips only, non-root user
- ENV: NODE_ENV=production
- CMD: npm start

Requirements:
- No nginx (Cloudflare Tunnel handles routing)
- No ports exposed to host
- Security: non-root users in containers
- Efficiency: multi-stage builds, alpine images
```

---

## Stage 2.2: Development Docker + Environment Template

**Model:** GPT-5.2-codex  
**Why:** Config files and templates - codex's strength  
**Time:** 5 minutes

### Prompt

```
Create development Docker configuration and environment template.

**1. docker-compose.dev.yml**
- Override production compose for local development
- Expose ports: postgres:5432, strapi:1337, astro:4321
- Mount source code for hot reload:
  - ./api/src:/opt/app/src
  - ./api/config:/opt/app/config
  - ./client/src:/app/src
  - ./client/public:/app/public
- No cloudflared service
- Use .env.development or inline dev values

**2. .env.example**
Sections with comments:
```

# ===================

# Database

# ===================

DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=change_this_secure_password

# ===================

# Strapi Secrets (generate with: openssl rand -base64 32)

# ===================

APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=

# ===================

# Public URLs

# ===================

PUBLIC_API_URL=https://yourdomain.com
PUBLIC_IMAGE_URL=https://yourdomain.com
PUBLIC_SITE_URL=https://yourdomain.com

# ===================

# Cloudflare Tunnel

# ===================

CLOUDFLARE_TUNNEL_TOKEN=

# ===================

# Email (SendGrid)

# ===================

SENDGRID_API_KEY=

```

Make the .env.example self-documenting with clear placeholder values.
```

2. Expose ports for local access:
   - postgres: 5432
   - strapi: 1337
   - astro: 4321
3. Mount source code as volumes for hot reload
4. Use development environment variables
5. No cloudflared service needed locally

For Strapi, mount:

- ./api/src:/opt/app/src
- ./api/config:/opt/app/config

For Astro, mount:

- ./client/src:/app/src
- ./client/public:/app/public

Override commands to use dev mode where applicable.

```

---

## Stage 2.3: Optimize Astro Dockerfile

**Model:** GPT-5.2-codex
**Why:** Dockerfile optimization is config-heavy - codex excels at infrastructure code
**Time:** 5 minutes

### Prompt

```

Rewrite `client/Dockerfile` with multi-stage build optimization.

Requirements:

1. Multi-stage build (builder + runtime)
2. Use node:20-alpine for small image size
3. Accept build args for PUBLIC\_\* env vars
4. Copy only necessary files to runtime stage
5. Set proper HOST and PORT environment
6. Run as non-root user for security
7. Use npm ci for reproducible builds

Build stage:

- Install all dependencies
- Copy source
- Run build

Runtime stage:

- Copy only dist folder and production node_modules
- Set NODE_ENV=production
- Expose port 4321
- CMD to run the server entry

Target final image size: <200MB

````

### Expected Output

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

ARG PUBLIC_API_URL
ARG PUBLIC_IMAGE_URL
ARG PUBLIC_SITE_URL

ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_IMAGE_URL=$PUBLIC_IMAGE_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

RUN addgroup -g 1001 -S nodejs && adduser -S astro -u 1001

WORKDIR /app

COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./

USER astro

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
````

---

## Stage 2.4: Optimize Strapi Dockerfile

**Model:** GPT-5.2-codex  
**Why:** Same as Astro Dockerfile - infrastructure optimization  
**Time:** 5 minutes

### Prompt

```
Rewrite `api/Dockerfile` with multi-stage build optimization.

Requirements:
1. Multi-stage build (builder + runtime)
2. Use node:20-alpine
3. Install build dependencies only in builder stage (vips, etc.)
4. Copy only built files to runtime
5. Run as non-root user
6. Install only production dependencies in runtime

Build stage:
- Install build tools (gcc, vips-dev, etc.)
- npm ci (all deps)
- npm run build

Runtime stage:
- Install only runtime deps (vips)
- Copy built admin and node_modules
- Set NODE_ENV=production
- Expose 1337

Target final image size: <500MB (Strapi is larger due to admin panel)
```

---

## Stage 2.5: Create Environment Template

**Model:** GPT-5.2-codex  
**Why:** Template/boilerplate generation - codex's strength  
**Time:** 3 minutes

### Prompt

```
Create `.env.example` with all required environment variables.

Include sections for:
1. Database configuration
2. Strapi secrets (APP_KEYS, JWT secrets, etc.)
3. Public URLs (API, Image, Site)
4. Cloudflare Tunnel token
5. SendGrid API key
6. Node environment

Add brief inline comments explaining each variable.
Use placeholder values that make it clear what format is expected.

Example format:
DATABASE_PASSWORD=change_this_secure_password_here
APP_KEYS=key1,key2,key3,key4  # Generate with: openssl rand -base64 32
```

---

# Phase 3: Cloudflare Tunnel Setup

## Stage 3.1: Create Cloudflare Tunnel (Manual)

**Model:** N/A - Manual Steps  
**Time:** 10 minutes

### Instructions

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select your domain

2. **Navigate to Zero Trust**
   - Click "Zero Trust" in left sidebar
   - Or go to https://one.dash.cloudflare.com

3. **Create Tunnel**
   - Go to Networks → Tunnels
   - Click "Create a tunnel"
   - Select "Cloudflared" connector
   - Name it: `geosolutions-production`

4. **Get Tunnel Token**
   - After creation, copy the token
   - Save to `.env` as `CLOUDFLARE_TUNNEL_TOKEN`

5. **Configure Public Hostnames**

   | Public Hostname     | Service            | Path        |
   | ------------------- | ------------------ | ----------- |
   | geosolutions.nz     | http://astro:4321  | /\*         |
   | www.geosolutions.nz | http://astro:4321  | /\*         |
   | geosolutions.nz     | http://strapi:1337 | /api/\*     |
   | geosolutions.nz     | http://strapi:1337 | /admin/\*   |
   | geosolutions.nz     | http://strapi:1337 | /uploads/\* |

6. **Save** - Tunnel shows "Healthy" once cloudflared connects

---

# Phase 4: Server Setup & Deployment

## Stage 4.1: VPS Setup + Deploy + Database Migration (Manual)

**Model:** N/A - Terminal Commands  
**Time:** 20 minutes

### Part 1: VPS Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker + Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo apt install docker-compose-plugin -y

# Verify
docker --version && docker compose version

# Create app directory
sudo mkdir -p /opt/geosolutions
sudo chown $USER:$USER /opt/geosolutions

# Firewall (SSH only - Cloudflare Tunnel uses outbound)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable
```

### Part 2: Deploy Application

```bash
# Local: push to git
git add -A && git commit -m "Production ready" && git push origin main

# VPS: clone and configure
cd /opt/geosolutions
git clone https://github.com/your-repo/geosolutions.git .
cp .env.example .env
nano .env  # Fill in all production values

# Build and start
docker compose build
docker compose up -d

# Verify
docker compose ps
docker compose logs -f
```

### Part 3: Database Migration (if needed)

```bash
# Local: Export
docker exec postgres-dev pg_dump -U strapi strapi > backup.sql

# Transfer
scp backup.sql user@your-vps-ip:/opt/geosolutions/

# VPS: Import
docker exec -i geosolutions-postgres-1 psql -U strapi strapi < backup.sql
```

---

# Phase 5: Cleanup & Verification

## Stage 5.1: Cleanup + Final Testing

**Model:** N/A - Manual  
**Time:** 10 minutes

### Files to Delete

```bash
rm ecosystem.config.js
rm api/src/admin/app.example.js 2>/dev/null
rm api/src/admin/webpack.config.example.js 2>/dev/null
rm client/src/utils/api.js 2>/dev/null

# Update .gitignore
echo -e ".env\n.env.local\n.env.production" >> .gitignore
```

### Verification Checklist

**Local:**

- [ ] `docker compose -f docker-compose.dev.yml up` works
- [ ] Astro loads at localhost:4321
- [ ] Strapi admin loads at localhost:1337/admin
- [ ] All components fetch data correctly
- [ ] Fallbacks work when Strapi is stopped

**Production:**

- [ ] Site loads at https://geosolutions.nz
- [ ] SSL certificate is valid (Cloudflare)
- [ ] Strapi admin accessible at /admin
- [ ] API endpoints respond at /api/\*
- [ ] Images load from /uploads/\*
- [ ] Contact form submits successfully
- [ ] All pages render without errors

### Security Checklist

- [ ] No ports exposed on VPS (check with `sudo netstat -tlnp`)
- [ ] Firewall only allows SSH
- [ ] .env not in git repository
- [ ] Strapi admin has strong password
- [ ] Database password is unique and strong

---

## Stage 5.3: Set Up Automated Deployments (Optional)

**Model:** GPT-5.2-codex  
**Why:** GitHub Actions YAML workflow - CI/CD config is codex territory  
**Time:** 10 minutes

### Prompt

```
Create a GitHub Actions workflow for automated deployment.

File: `.github/workflows/deploy.yml`

The workflow should:
1. Trigger on push to main branch
2. SSH into the VPS
3. Pull latest code
4. Rebuild and restart containers
5. Run health checks
6. Notify on failure (optional)

Use GitHub Secrets for:
- VPS_HOST
- VPS_USER
- VPS_SSH_KEY

Include a manual trigger option for emergency deploys.
Keep it simple - no complex CI/CD, just pull and restart.
```

---

# Quick Reference

## Common Commands

```bash
# Development
docker compose -f docker-compose.dev.yml up
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml logs -f astro

# Production
docker compose up -d
docker compose down
docker compose logs -f
docker compose restart astro
docker compose exec strapi npm run strapi -- transfer

# Database
docker compose exec postgres psql -U strapi strapi
docker compose exec postgres pg_dump -U strapi strapi > backup.sql

# Troubleshooting
docker compose ps
docker compose logs strapi --tail 100
docker exec -it geosolutions-astro-1 sh
```

## Environment Variables Quick Reference

| Variable                | Example                     | Used By          |
| ----------------------- | --------------------------- | ---------------- |
| DATABASE_USERNAME       | strapi                      | postgres, strapi |
| DATABASE_PASSWORD       | secure_password             | postgres, strapi |
| DATABASE_NAME           | strapi                      | postgres, strapi |
| APP_KEYS                | base64,base64,base64,base64 | strapi           |
| ADMIN_JWT_SECRET        | base64_string               | strapi           |
| JWT_SECRET              | base64_string               | strapi           |
| PUBLIC_API_URL          | https://geosolutions.nz     | astro            |
| PUBLIC_IMAGE_URL        | https://geosolutions.nz     | astro            |
| CLOUDFLARE_TUNNEL_TOKEN | eyJ...                      | cloudflared      |

---

## Rollback Procedure

If deployment fails:

```bash
# On VPS
cd /opt/geosolutions

# Revert to previous commit
git log --oneline -5  # Find previous good commit
git checkout <commit-hash>

# Rebuild
docker compose build
docker compose up -d

# Or restore database backup
docker exec -i geosolutions-postgres-1 psql -U strapi strapi < backup.sql
```

---

## Support Contacts

- **Cloudflare Status:** https://www.cloudflarestatus.com
- **DigitalOcean Status:** https://status.digitalocean.com
- **Docker Docs:** https://docs.docker.com
- **Strapi Docs:** https://docs.strapi.io
- **Astro Docs:** https://docs.astro.build
