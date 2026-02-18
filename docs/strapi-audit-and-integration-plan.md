# GeoSolutions: Strapi Audit & Integration Plan

> **Audit Date:** January 2026  
> **Project Status:** Dormant ~18 months  
> **Stack:** Astro 4.x (SSR) + Strapi 4.25.5 + PostgreSQL 16 + Docker

---

## Executive Summary

This audit documents a geotechnical consultancy website built with:

- **Frontend:** Astro 4.12 with TailwindCSS/DaisyUI, server-rendered (Node adapter)
- **Backend:** Strapi 4.25.5 headless CMS with PostgreSQL
- **Deployment:** Docker Compose with three services (postgres, strapi, astro-app)

### Current State

- **5 Strapi content types** exist: Team, Project, Document, Email, Hero
- **REST API** is used exclusively (no GraphQL plugin detected)
- **3 dynamic sections** pull from Strapi: Hero banner, Team members, Projects, Publications (Documents)
- **4 sections are hard-coded** in Astro: About Us, Services (intro + task list), Footer tagline, Contact info

### Key Findings

| Item              | Status                                                               |
| ----------------- | -------------------------------------------------------------------- |
| Staff ordering    | **Not implemented** – Team lacks an `order` field                    |
| About Us content  | **Hard-coded** in `client/src/components/About.astro`                |
| Services content  | **Hard-coded** in `client/src/components/Services.astro`             |
| Task list         | **Hard-coded** as JS array in `Services.astro`                       |
| Footer tagline    | **Hard-coded** in `client/src/components/Footer.astro`               |
| Rich text editing | **Not used** – all Strapi fields are `string` or `text` (plain text) |

---

### Repo File Tree (Full)

```
GeoSolutions/
├── .env
├── .gitignore
├── docker-compose.yml
├── ecosystem.config.js
├── api/
│   ├── .dockerignore
│   ├── .editorconfig
│   ├── .env
│   ├── .env.example
│   ├── .eslintignore
│   ├── .eslintrc
│   ├── .gitignore
│   ├── .strapi/
│   │   └── client/
│   │       ├── index.html
│   │       └── index.js
│   ├── .strapi-updater.json
│   ├── Dockerfile
│   ├── jsconfig.json
│   ├── package.json
│   ├── README.md
│   ├── config/
│   │   ├── admin.js
│   │   ├── api.js
│   │   ├── database.js
│   │   ├── middlewares.js
│   │   ├── plugins.js
│   │   └── server.js
│   ├── database/
│   │   └── migrations/
│   ├── public/
│   │   ├── robots.txt
│   │   └── uploads/
│   │       └── .gitkeep
│   ├── src/
│   │   ├── index.js
│   │   ├── admin/
│   │   │   ├── app.example.js
│   │   │   └── webpack.config.example.js
│   │   └── api/
│   │       ├── document/
│   │       │   ├── content-types/
│   │       │   │   └── document/
│   │       │   │       └── schema.json
│   │       │   ├── controllers/
│   │       │   │   └── document.js
│   │       │   ├── routes/
│   │       │   │   └── document.js
│   │       │   └── services/
│   │       │       └── document.js
│   │       ├── email/
│   │       │   ├── content-types/
│   │       │   │   └── email/
│   │       │   │       ├── lifecycles.js
│   │       │   │       └── schema.json
│   │       │   ├── controllers/
│   │       │   │   └── email.js
│   │       │   ├── routes/
│   │       │   │   └── email.js
│   │       │   └── services/
│   │       │       └── email.js
│   │       ├── hero/
│   │       │   ├── content-types/
│   │       │   │   └── hero/
│   │       │   │       └── schema.json
│   │       │   ├── controllers/
│   │       │   │   └── hero.js
│   │       │   ├── routes/
│   │       │   │   └── hero.js
│   │       │   └── services/
│   │       │       └── hero.js
│   │       ├── project/
│   │       │   ├── content-types/
│   │       │   │   └── project/
│   │       │   │       └── schema.json
│   │       │   ├── controllers/
│   │       │   │   └── project.js
│   │       │   ├── routes/
│   │       │   │   └── project.js
│   │       │   └── services/
│   │       │       └── project.js
│   │       └── team/
│   │           ├── content-types/
│   │           │   └── team/
│   │           │       └── schema.json
│   │           ├── controllers/
│   │           │   └── team.js
│   │           ├── routes/
│   │           │   └── team.js
│   │           └── services/
│   │               └── team.js
│   └── types/
│       └── generated/
│           ├── components.d.ts
│           └── contentTypes.d.ts
├── client/
│   ├── .dockerignore
│   ├── .env
│   ├── .gitignore
│   ├── .vscode/
│   │   ├── extensions.json
│   │   └── launch.json
│   ├── astro.config.mjs
│   ├── Dockerfile
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.mjs
│   ├── tsconfig.json
│   ├── public/
│   │   ├── css/
│   │   │   ├── aos.css
│   │   │   └── styles.css
│   │   ├── images/
│   │   │   └── logo.webp
│   │   └── js/
│   │       ├── aos.js
│   │       ├── contact.js
│   │       └── navbar.js
│   └── src/
│       ├── env.d.ts
│       ├── components/
│       │   ├── About.astro
│       │   ├── Contact.astro
│       │   ├── Footer.astro
│       │   ├── Hero.astro
│       │   ├── Navbar.astro
│       │   ├── Services.astro
│       │   └── Team.astro
│       ├── layouts/
│       │   └── DefaultLayout.astro
│       ├── pages/
│       │   ├── index.astro
│       │   ├── projects/
│       │   │   ├── index.astro
│       │   │   └── [id].astro
│       │   └── publications/
│       │       └── index.astro
│       └── utils/
│           └── api.js
└── docs/
    └── strapi-audit-and-integration-plan.md
```

---

### Packages and Tooling

#### API (Strapi Backend) - `api/package.json`

**Dependencies:**

| Package                               | Version | Purpose                                  |
| ------------------------------------- | ------- | ---------------------------------------- |
| `@strapi/strapi`                      | 4.25.5  | Core Strapi CMS framework                |
| `@strapi/plugin-cloud`                | 4.25.5  | Strapi Cloud integration                 |
| `@strapi/plugin-i18n`                 | 4.25.5  | Internationalization support             |
| `@strapi/plugin-users-permissions`    | 4.25.5  | User authentication and permissions      |
| `@strapi/provider-email-sendgrid`     | ^4.25.5 | SendGrid email provider for contact form |
| `pg`                                  | 8.8.0   | PostgreSQL database driver               |
| `react`                               | ^18.0.0 | React (required by Strapi admin)         |
| `react-dom`                           | ^18.0.0 | React DOM (required by Strapi admin)     |
| `react-router-dom`                    | 5.3.4   | React Router (required by Strapi admin)  |
| `strapi-plugin-import-export-entries` | ^1.23.1 | Import/export content entries            |
| `styled-components`                   | 5.3.3   | CSS-in-JS (required by Strapi admin)     |

**No devDependencies defined.**

**Key Config Files:**

| File                        | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `api/config/database.js`    | Multi-database support (SQLite, MySQL, PostgreSQL) |
| `api/config/server.js`      | Server host/port configuration                     |
| `api/config/admin.js`       | Admin panel JWT secrets and flags                  |
| `api/config/plugins.js`     | SendGrid email + import-export-entries config      |
| `api/config/middlewares.js` | Strapi middleware stack                            |
| `api/config/api.js`         | REST API defaults (pagination limits)              |
| `api/jsconfig.json`         | JavaScript/TypeScript compiler options             |

**Strapi Plugins Configured (in `api/config/plugins.js`):**

1. **Email (SendGrid):** Configured with `SENDGRID_API_KEY` env var
2. **Import-Export-Entries:** Enabled for content migration

---

#### Client (Astro Frontend) - `client/package.json`

**Dependencies:**

| Package              | Version | Purpose                            |
| -------------------- | ------- | ---------------------------------- |
| `astro`              | ^4.12.2 | Core Astro framework               |
| `@astrojs/node`      | ^8.3.2  | Node.js SSR adapter                |
| `@astrojs/tailwind`  | ^5.1.0  | Tailwind CSS integration for Astro |
| `tailwindcss`        | ^3.4.6  | Tailwind CSS framework             |
| `@tailwindcss/forms` | ^0.5.7  | Tailwind plugin for form styling   |
| `dotenv`             | ^16.4.5 | Environment variable loading       |

**Dev Dependencies:**

| Package       | Version  | Purpose                      |
| ------------- | -------- | ---------------------------- |
| `@types/node` | ^22.0.0  | TypeScript types for Node.js |
| `daisyui`     | ^4.12.10 | DaisyUI component library    |

**Key Config Files:**

| File                         | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| `client/astro.config.mjs`    | Astro config: SSR mode, Node adapter, Tailwind integration |
| `client/tailwind.config.mjs` | Tailwind config: content paths, DaisyUI theme, plugins     |
| `client/tsconfig.json`       | TypeScript config (extends Astro base)                     |

**Tailwind Configuration Details (`client/tailwind.config.mjs`):**

- **Content paths:** `./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}`
- **DaisyUI theme:** Custom `defaultTheme` with:
  - `primary: #2db875` (green)
  - `secondary: #f3a1a0` (pink)
  - `accent: #3a4a6a` (dark blue)
  - `neutral: #f0f4f8` (light gray)
  - `base-100: #ffffff` (white)
- **Plugins:** `daisyui`, `@tailwindcss/forms`

**Astro Configuration Details (`client/astro.config.mjs`):**

- **Output:** `server` (SSR mode)
- **Adapter:** `@astrojs/node` in standalone mode
- **Integrations:** `@astrojs/tailwind`

**Note:** No PostCSS config file exists; Tailwind is integrated via the `@astrojs/tailwind` integration which handles PostCSS internally.

---

## Current Strapi Content Types (Verified)

All content types are defined in `api/src/api/**/content-types/**/schema.json`.

| Content Type | Kind       | Schema Path                                               | Fields                                                                                                                                                             | Relations | Draft/Publish | Frontend Usage                                                                                                                                                   |
| ------------ | ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Team**     | Collection | `api/src/api/team/content-types/team/schema.json`         | `name` (string), `role` (string), `email` (email), `image` (media)                                                                                                 | None      | Yes           | [`client/src/components/Team.astro`](client/src/components/Team.astro)                                                                                           |
| **Project**  | Collection | `api/src/api/project/content-types/project/schema.json`   | `title` (string, required), `description` (text, required), `thumbnail` (media), `beforePhoto` (media), `afterPhoto` (media), `startDate` (date), `endDate` (date) | None      | Yes           | [`client/src/pages/projects/index.astro`](client/src/pages/projects/index.astro), [`client/src/pages/projects/[id].astro`](client/src/pages/projects/[id].astro) |
| **Document** | Collection | `api/src/api/document/content-types/document/schema.json` | `title` (string), `description` (text), `file` (media), `url` (string)                                                                                             | None      | Yes           | [`client/src/pages/publications/index.astro`](client/src/pages/publications/index.astro)                                                                         |
| **Email**    | Collection | `api/src/api/email/content-types/email/schema.json`       | `Name` (string, required), `Subject` (string, required), `FromEmail` (email, required), `Message` (text, required), `File` (media), `FileName` (string)            | None      | Yes           | [`client/src/components/Contact.astro`](client/src/components/Contact.astro) via [`client/public/js/contact.js`](client/public/js/contact.js)                    |
| **Hero**     | Collection | `api/src/api/hero/content-types/hero/schema.json`         | `Banner` (media)                                                                                                                                                   | None      | Yes           | [`client/src/components/Hero.astro`](client/src/components/Hero.astro)                                                                                           |

### Detailed Schema Breakdown

#### Team (`api/src/api/team/content-types/team/schema.json`)

```json
{
  "kind": "collectionType",
  "collectionName": "teams",
  "attributes": {
    "name": { "type": "string" },
    "role": { "type": "string" },
    "image": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images", "files", "videos", "audios"]
    },
    "email": { "type": "email" }
  }
}
```

**Missing:** No `order` field for controlling display order.

#### Project (`api/src/api/project/content-types/project/schema.json`)

```json
{
  "kind": "collectionType",
  "collectionName": "projects",
  "attributes": {
    "title": { "type": "string", "required": true },
    "description": { "type": "text", "required": true },
    "thumbnail": { "type": "media", "multiple": false },
    "beforePhoto": { "type": "media", "multiple": false },
    "afterPhoto": { "type": "media", "multiple": false },
    "startDate": { "type": "date" },
    "endDate": { "type": "date" }
  }
}
```

#### Document (`api/src/api/document/content-types/document/schema.json`)

```json
{
  "kind": "collectionType",
  "collectionName": "documents",
  "attributes": {
    "title": { "type": "string" },
    "description": { "type": "text" },
    "file": { "type": "media", "multiple": false },
    "url": { "type": "string" }
  }
}
```

**Note:** Supports both file uploads and external URLs.

#### Email (`api/src/api/email/content-types/email/schema.json`)

```json
{
  "kind": "collectionType",
  "collectionName": "emails",
  "attributes": {
    "Name": { "type": "string", "required": true },
    "Subject": { "type": "string", "required": true },
    "FromEmail": { "type": "email", "required": true },
    "Message": { "type": "text", "required": true },
    "File": { "type": "media", "multiple": false },
    "FileName": { "type": "string" }
  }
}
```

**Lifecycle Hook:** `api/src/api/email/content-types/email/lifecycles.js` sends email via SendGrid after record creation.

#### Hero (`api/src/api/hero/content-types/hero/schema.json`)

```json
{
  "kind": "collectionType",
  "collectionName": "heroes",
  "attributes": {
    "Banner": { "type": "media", "multiple": false }
  }
}
```

**Issue:** Defined as Collection Type but used as Single Type (only `data[0]` fetched).

### Strapi Components

**Directory:** `api/src/components/`

**Status:** No components defined. The `api/src/components/` directory does not exist in the codebase. All content types use flat field structures without reusable components.

### Unused Content Types

All 5 content types are actively used by the frontend:

| Content Type | Used By                                       | Verification                           |
| ------------ | --------------------------------------------- | -------------------------------------- |
| Team         | `Team.astro`                                  | Fetches `/api/teams?populate=image`    |
| Project      | `projects/index.astro`, `projects/[id].astro` | Fetches `/api/projects?populate=...`   |
| Document     | `publications/index.astro`                    | Fetches `/api/documents?populate=file` |
| Email        | `contact.js`                                  | POSTs to `/api/emails`                 |
| Hero         | `Hero.astro`                                  | Fetches `/api/heroes?populate=Banner`  |

---

### Frontend Data Fetching Map

#### Environment Variables

Environment variables are read from `process.env` in Astro components during SSR:

| Variable                  | Defined In                          | Used In                            | Purpose                  |
| ------------------------- | ----------------------------------- | ---------------------------------- | ------------------------ |
| `PUBLIC_API_URL`          | `client/.env`, `docker-compose.yml` | Hero, Team, Projects, Publications | Strapi API base URL      |
| `PUBLIC_IMAGE_URL`        | `client/.env`, `docker-compose.yml` | Hero, Team, Projects               | Image URL prefix         |
| `PUBLIC_FILE_URL`         | `client/.env`, `docker-compose.yml` | Contact, Publications              | File download URL prefix |
| `PUBLIC_BACKEND_BASE_URL` | `client/src/utils/api.js`           | Unused (dead code)                 | Alternative base URL     |

**Note:** `client/src/utils/api.js` exports `BASE_URL` but it's not imported anywhere in the codebase. This appears to be dead code.

#### Fetch Helper

**No centralized fetch helper exists.** Each component performs inline `fetch()` calls directly.

#### Data Fetching Table

| Component/Page     | File Path                                   | Fetch Method     | Endpoint                | Populate                           | Sorting                       | Fallback Behavior              |
| ------------------ | ------------------------------------------- | ---------------- | ----------------------- | ---------------------------------- | ----------------------------- | ------------------------------ |
| **Hero**           | `client/src/components/Hero.astro`          | Inline `fetch()` | `GET /api/heroes`       | `Banner`                           | None                          | None (will crash if API fails) |
| **Team**           | `client/src/components/Team.astro`          | Inline `fetch()` | `GET /api/teams`        | `image`                            | None (DB order)               | None (will crash if API fails) |
| **Projects List**  | `client/src/pages/projects/index.astro`     | Inline `fetch()` | `GET /api/projects`     | `thumbnail,beforePhoto,afterPhoto` | Client-side by `endDate` desc | None (will crash if API fails) |
| **Project Detail** | `client/src/pages/projects/[id].astro`      | Inline `fetch()` | `GET /api/projects/:id` | `thumbnail,beforePhoto,afterPhoto` | N/A                           | None (will crash if API fails) |
| **Publications**   | `client/src/pages/publications/index.astro` | Inline `fetch()` | `GET /api/documents`    | `file`                             | Client-side `.reverse()`      | None (will crash if API fails) |
| **Contact Form**   | `client/public/js/contact.js`               | `fetch()` in JS  | `POST /api/emails`      | N/A                                | N/A                           | Shows error message in UI      |

#### Detailed Fetch Code References

**Hero.astro (lines 6-9):**

```javascript
const response = await fetch(`${apiUrl}/api/heroes?populate=Banner`);
const { data } = await response.json();
const publicHero = data[0]; // Only uses first item
```

**Team.astro (lines 4-7):**

```javascript
const response = await fetch(`${apiUrl}/api/teams?populate=image`);
const { data } = await response.json();
const teamMembers = data.map((project) => ({...}));
```

**projects/index.astro (lines 7-20):**

```javascript
const response = await fetch(
  `${apiUrl}/api/projects?populate=thumbnail,beforePhoto,afterPhoto`
);
const { data } = await response.json();
let projects = data.map((project) => ({...}));
projects = projects.sort(
  (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
);
```

**projects/[id].astro (lines 6-10):**

```javascript
const response = await fetch(
  `${apiUrl}/api/projects/${id}?populate=thumbnail,beforePhoto,afterPhoto`
);
const { data } = await response.json();
const { attributes: project } = data;
```

**publications/index.astro (lines 5-18):**

```javascript
const response = await fetch(`${apiUrl}/api/documents?populate=file`);
const { data } = await response.json();
const documents = data.map((document) => ({...})).reverse();
```

**contact.js (lines 28-34):**

```javascript
fetch(`${apiUrl}/api/emails`, {
  method: "POST",
  body: formData,
});
```

---

## Repo Overview

```
GeoSolutions/
├── api/                      # Strapi 4.25.5 backend
│   ├── Dockerfile
│   ├── package.json
│   ├── config/               # Strapi configuration
│   │   ├── admin.js
│   │   ├── api.js
│   │   ├── database.js       # Multi-DB support (postgres configured)
│   │   ├── middlewares.js
│   │   ├── plugins.js        # SendGrid email + import-export-entries
│   │   └── server.js
│   ├── src/
│   │   └── api/              # Content type definitions
│   │       ├── document/
│   │       ├── email/
│   │       ├── hero/
│   │       ├── project/
│   │       └── team/
│   └── public/uploads/       # Media storage (volume-mounted)
├── client/                   # Astro 4.12 frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── astro.config.mjs      # SSR mode with Node adapter
│   ├── tailwind.config.mjs   # DaisyUI theme
│   └── src/
│       ├── components/       # UI components
│       ├── layouts/
│       ├── pages/            # Routes
│       └── utils/api.js      # (minimal – just BASE_URL export)
├── docker-compose.yml        # Orchestration
├── ecosystem.config.js       # PM2 config (alternative to Docker)
└── .env                      # Root env file (not committed – .env.example exists)
```

---

## Hard-coded Content Inventory

### 1. About Us Section

**File:** `client/src/components/About.astro`  
**Lines:** 8-13

```html
<p class="text-center max-w-2xl mx-auto">
  We are a specialised geotechnical consultancy, covering projects and sites all
  around the Top of the South Island and look after both the residential and
  commercial building sectors. We're a local business and aim to look after our
  clients so that they tell all their friends. Word-of-mouth referrals are our
  favourite jobs! Talk to us now and find out how we can help.
</p>
```

### 2. Services Section – Intro Text

**File:** `client/src/components/Services.astro`  
**Lines:** 21-29

```html
<p class="text-lg mb-8">
  GeoSolutions provides specialist geotechnical services to assist you with your
  building project. You may need to provide a Geotech report to accompany your
  application for resource consent for a subdivision or would like a foundation
  assessment for a new cellphone tower. We will help you establish an
  appropriate and cost-effective investigation for your project and then walk
  you through the process through to consent application. We usually need to
  double check the plans before application, may need to answer questions during
  the consent application and will almost certainly need to check the ground
  conditions during construction.
</p>
```

### 3. Services Section – Task List

**File:** `client/src/components/Services.astro`  
**Lines:** 2-13

```javascript
const services = [
  "Site and soil investigations",
  "Landslip damage assessment and remediation",
  "Subdivision geotechnical assessments (urban and rural)",
  "Liquefaction assessment",
  "Establishment of fault location",
  "Earthworks design, supervision & certification",
  "Natural disaster insurance assessment",
  "Geotechnical peer review services and expert opinions",
  "On-site wastewater disposal suitability assessment",
  "Geotechnical site certification",
];
```

### 4. Footer Tagline ("Our focus…")

**File:** `client/src/components/Footer.astro`  
**Lines:** 9-12

```html
<p>
  Our focus is on the private sector market in the communities in and around the
  top of the South Island, New Zealand. (Nelson Tasman)
</p>
```

### 5. Contact Information

**File:** `client/src/components/Contact.astro`  
**Lines:** 23-32

```html
<p class="text-lg mb-4">
  Mobile: <a href="tel:+64278986000" class="text-blue-600">027 898 6000</a>
  <br />
  <a href="mailto:admin@geosolutions.nz" class="text-blue-600"
    >admin@geosolutions.nz</a
  >
  <br />
  <a href="mailto:sally@geosolutions.nz" class="text-blue-600"
    >sally@geosolutions.nz</a
  >
</p>
```

---

## Deployment Overview

### Docker Compose Services

| Service     | Image                          | Port      | Purpose             |
| ----------- | ------------------------------ | --------- | ------------------- |
| `postgres`  | postgres:16                    | 5432:5432 | PostgreSQL database |
| `strapi`    | Built from `api/Dockerfile`    | 1337:1337 | Strapi CMS backend  |
| `astro-app` | Built from `client/Dockerfile` | 4321:4321 | Astro SSR frontend  |

### Network Configuration

- All services on `strapi` bridge network
- Astro connects to Strapi via internal Docker DNS (`http://strapi:1337`)
- External image URLs use `http://localhost:1337` (needs adjustment for production)

### Environment Variables (from docker-compose.yml)

**Strapi container:**

```
DATABASE_CLIENT, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME,
DATABASE_USERNAME, DATABASE_PASSWORD, JWT_SECRET, ADMIN_JWT_SECRET,
APP_KEYS, NODE_ENV, SENDGRID_API_KEY
```

**Astro container:**

```
PUBLIC_API_URL=http://strapi:1337
PUBLIC_IMAGE_URL=http://localhost:1337
PUBLIC_FILE_URL=http://localhost:1337
```

### Volumes

- `postgres-data`: Persistent database storage
- `./api/public/uploads`: Media file storage (bind mount)
- `./api/config`, `./api/src`: Strapi code (bind mount for development)

### Alternative: PM2 (ecosystem.config.js)

The repo also contains PM2 configuration for running without Docker in cluster mode.

---

## Proposed Strapi Model Additions

### 1. About Page (Single Type)

**Rationale:** Single Type is appropriate – there's only one "About Us" section.

**Schema:**

```json
{
  "kind": "singleType",
  "collectionName": "about",
  "info": {
    "singularName": "about",
    "pluralName": "abouts",
    "displayName": "About"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "content": {
      "type": "richtext",
      "required": true
    }
  }
}
```

**Location:** `api/src/api/about/content-types/about/schema.json`

**API Endpoint:** `GET /api/about`

**Editor UX:** Uses Strapi's built-in rich text editor (WYSIWYG with basic formatting).

---

### 2. Services Page (Single Type with Component)

**Rationale:** Single Type for the page content. Use a repeatable component for the task list to allow ordering.

**Component Schema (ServiceItem):**

```json
{
  "collectionName": "components_content_service_items",
  "info": {
    "displayName": "Service Item",
    "icon": "bulletList"
  },
  "attributes": {
    "label": {
      "type": "string",
      "required": true,
      "maxLength": 200
    }
  }
}
```

**Location:** `api/src/components/content/service-item.json`

**Services Single Type Schema:**

```json
{
  "kind": "singleType",
  "collectionName": "services_page",
  "info": {
    "singularName": "services-page",
    "pluralName": "services-pages",
    "displayName": "Services Page"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "introText": {
      "type": "richtext",
      "required": true
    },
    "serviceItems": {
      "type": "component",
      "repeatable": true,
      "component": "content.service-item"
    }
  }
}
```

**Location:** `api/src/api/services-page/content-types/services-page/schema.json`

**API Endpoint:** `GET /api/services-page?populate=serviceItems`

**Editor UX:**

- Rich text editor for intro paragraph
- Drag-and-drop reorderable list for services
- Each service item is a simple text field

---

### 3. Site Settings (Single Type) – For Footer Tagline

**Rationale:** Group global site settings (footer text, potentially contact info later) in one place.

**Schema:**

```json
{
  "kind": "singleType",
  "collectionName": "site_settings",
  "info": {
    "singularName": "site-setting",
    "pluralName": "site-settings",
    "displayName": "Site Settings"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "footerTagline": {
      "type": "text",
      "required": true
    }
  }
}
```

**Location:** `api/src/api/site-setting/content-types/site-setting/schema.json`

**API Endpoint:** `GET /api/site-setting`

**Editor UX:** Simple text area, no draft mode (changes publish immediately).

---

### 4. Team – Add Order Field

**Modification to existing schema:**

Add to `api/src/api/team/content-types/team/schema.json`:

```json
"order": {
  "type": "integer",
  "default": 0,
  "min": 0
}
```

**Migration:** Existing team members will get `order: 0` (or null). Sort ascending, ties fall back to creation order.

**API Change:** Frontend should sort by `order` or request `?sort=order:asc`

---

### 5. Convert Hero to Single Type (Recommended)

**Current Issue:** Hero is a Collection Type but only `data[0]` is used.

**Recommendation:** Convert to Single Type for clarity.

**Schema (if converting):**

```json
{
  "kind": "singleType",
  "collectionName": "hero",
  "info": {
    "singularName": "hero",
    "pluralName": "heroes",
    "displayName": "Hero"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "Banner": {
      "type": "media",
      "multiple": false,
      "required": true,
      "allowedTypes": ["images"]
    }
  }
}
```

**Migration:** Export current hero entry, delete collection type, create single type, re-import image.

---

## Frontend Integration Plan

### Phase 1: Add Order Field to Team (Low Risk)

**Files to modify:**

1. `api/src/api/team/content-types/team/schema.json` – Add `order` field
2. `client/src/components/Team.astro` – Add sorting logic

**Step-by-step:**

1. **Add order field to schema** (in Strapi schema.json)
2. **Restart Strapi** to apply schema change
3. **Set order values** in Strapi admin for existing team members
4. **Update Team.astro:**

   Change line 7 from:

   ```javascript
   const response = await fetch(`${apiUrl}/api/teams?populate=image`);
   ```

   To:

   ```javascript
   const response = await fetch(
     `${apiUrl}/api/teams?populate=image&sort=order:asc`
   );
   ```

**Fallback:** If `order` is null/0, items display in creation order (existing behavior).

---

### Phase 2: About Us from Strapi (Low Risk)

**Files to modify:**

1. Create `api/src/api/about/` – New Single Type
2. `client/src/components/About.astro` – Fetch from API

**Step-by-step:**

1. **Create About content type** in Strapi (Single Type with `richtext` content field)
2. **Set permissions** in Settings → Roles → Public → About → find (check)
3. **Copy existing About text** into Strapi admin
4. **Update About.astro:**

```astro
---
const apiUrl = process.env.PUBLIC_API_URL;
let aboutContent = null;

try {
  const response = await fetch(`${apiUrl}/api/about`);
  if (response.ok) {
    const { data } = await response.json();
    aboutContent = data?.attributes?.content;
  }
} catch (e) {
  console.error('Failed to fetch About content:', e);
}

// Fallback content if Strapi unavailable
const fallbackContent = `We are a specialised geotechnical consultancy...`;
const displayContent = aboutContent || fallbackContent;
---

<section id="about" class="py-16 text-gray-600" data-aos="slide-right" data-aos-duration="750" data-aos-once="true">
  <h2 class="text-3xl text-center mb-8">About Us</h2>
  <div class="text-center max-w-2xl mx-auto prose" set:html={displayContent} />
</section>
```

**Fallback:** If API fails, hardcoded fallback text displays.

---

### Phase 3: Services Page from Strapi (Medium Risk)

**Files to modify:**

1. Create `api/src/components/content/service-item.json` – New component
2. Create `api/src/api/services-page/` – New Single Type
3. `client/src/components/Services.astro` – Fetch from API

**Step-by-step:**

1. **Create component folder:** `api/src/components/content/`
2. **Create service-item.json component**
3. **Create Services Page Single Type** (with `introText` richtext + `serviceItems` repeatable component)
4. **Restart Strapi**
5. **Set permissions** for Services Page (find)
6. **Migrate content:**
   - Copy intro paragraph into `introText`
   - Add each service item to `serviceItems` array
7. **Update Services.astro:**

```astro
---
const apiUrl = process.env.PUBLIC_API_URL;

let servicesData = null;
try {
  const response = await fetch(`${apiUrl}/api/services-page?populate=serviceItems`);
  if (response.ok) {
    const { data } = await response.json();
    servicesData = data?.attributes;
  }
} catch (e) {
  console.error('Failed to fetch Services content:', e);
}

// Fallback data
const fallbackIntro = `GeoSolutions provides specialist geotechnical services...`;
const fallbackServices = [
  "Site and soil investigations",
  "Landslip damage assessment and remediation",
  // ... rest of list
];

const introText = servicesData?.introText || fallbackIntro;
const services = servicesData?.serviceItems?.map(item => item.label) || fallbackServices;
---
```

**Fallback:** Full hardcoded fallback if API unavailable.

---

### Phase 4: Footer Tagline from Strapi (Low Risk)

**Files to modify:**

1. Create `api/src/api/site-setting/` – New Single Type
2. `client/src/components/Footer.astro` – Fetch from API

**Step-by-step:**

1. **Create Site Settings Single Type** (with `footerTagline` text field)
2. **Set permissions** (find)
3. **Copy existing tagline** into Strapi
4. **Update Footer.astro:**

```astro
---
const currentYear = new Date().getFullYear();
const apiUrl = process.env.PUBLIC_API_URL;

let tagline = null;
try {
  const response = await fetch(`${apiUrl}/api/site-setting`);
  if (response.ok) {
    const { data } = await response.json();
    tagline = data?.attributes?.footerTagline;
  }
} catch (e) {
  console.error('Failed to fetch site settings:', e);
}

const fallbackTagline = "Our focus is on the private sector market in the communities in and around the top of the South Island, New Zealand. (Nelson Tasman)";
const displayTagline = tagline || fallbackTagline;
---
```

**Fallback:** Hardcoded tagline if API unavailable.

---

## Migration Plan

### Pre-Migration Checklist

- [ ] Backup PostgreSQL database: `docker exec postgres pg_dump -U strapi strapi > backup.sql`
- [ ] Backup `api/public/uploads/` directory
- [ ] Document current team member order (screenshot Strapi admin)
- [ ] Test site is working in current state

### Step 1: Schema Migrations (Strapi)

1. **Add Team order field:**

   ```bash
   # Edit api/src/api/team/content-types/team/schema.json
   # Add: "order": { "type": "integer", "default": 0, "min": 0 }
   ```

2. **Create component directory and service-item.json:**

   ```bash
   mkdir -p api/src/components/content
   # Create service-item.json with label field
   ```

3. **Create new content types:**

   - About (Single Type)
   - Services Page (Single Type)
   - Site Settings (Single Type)

4. **Restart Strapi:**
   ```bash
   docker-compose restart strapi
   ```

### Step 2: Permissions Setup

In Strapi Admin → Settings → Roles → Public:

| Content Type  | find         | findOne      |
| ------------- | ------------ | ------------ |
| About         | ✓            | -            |
| Services Page | ✓            | -            |
| Site Setting  | ✓            | -            |
| Team          | ✓ (existing) | ✓ (existing) |

### Step 3: Content Migration

1. **About content:**

   - Navigate to Content Manager → About
   - Paste the About Us paragraph from `About.astro`
   - Save and Publish

2. **Services Page content:**

   - Navigate to Content Manager → Services Page
   - Paste intro paragraph into `introText`
   - Add each service as a component entry in `serviceItems`
   - Save and Publish

3. **Site Settings:**

   - Navigate to Content Manager → Site Settings
   - Paste footer tagline
   - Save

4. **Team order:**
   - Edit each Team member
   - Set `order` field (1, 2, 3, etc.)
   - Save each entry

### Step 4: Frontend Updates

Deploy in this order:

1. **Team.astro** – Add `&sort=order:asc` to fetch URL
2. **About.astro** – Add API fetch with fallback
3. **Footer.astro** – Add API fetch with fallback
4. **Services.astro** – Add API fetch with fallback

Each change can be deployed independently with fallback behavior.

---

## Testing Plan

### Local Testing

1. **Start services:**

   ```bash
   docker-compose up --build
   ```

2. **Verify Strapi admin:**

   - Access http://localhost:1337/admin
   - Confirm all content types appear
   - Confirm content is saved correctly

3. **Verify API endpoints:**

   ```bash
   curl http://localhost:1337/api/about
   curl http://localhost:1337/api/services-page?populate=serviceItems
   curl http://localhost:1337/api/site-setting
   curl http://localhost:1337/api/teams?sort=order:asc
   ```

4. **Verify frontend:**
   - Access http://localhost:4321
   - Confirm About section displays Strapi content
   - Confirm Services section displays Strapi content
   - Confirm Team is ordered correctly
   - Confirm Footer tagline displays correctly

### Fallback Testing

1. **Stop Strapi:** `docker-compose stop strapi`
2. **Verify frontend:** Site should display fallback content without errors
3. **Check console:** No uncaught errors, only logged warnings

### Regression Testing

- [ ] Homepage loads correctly
- [ ] All sections display (Hero, About, Services, Team, Contact)
- [ ] Navigation works (all links functional)
- [ ] Projects page lists all projects
- [ ] Individual project pages load
- [ ] Publications page lists all documents
- [ ] Contact form submits successfully
- [ ] Mobile responsive layout works

### Production Pre-Deploy

- [ ] Update `PUBLIC_IMAGE_URL` and `PUBLIC_FILE_URL` for production domain
- [ ] Verify SSL/HTTPS configuration
- [ ] Test with production API URL
- [ ] Verify CORS settings if domains differ

---

## Risks & Edge Cases

| Risk                                         | Impact                             | Likelihood | Mitigation                                                   |
| -------------------------------------------- | ---------------------------------- | ---------- | ------------------------------------------------------------ |
| **Strapi API unavailable**                   | Frontend displays fallback content | Medium     | Implement try/catch with fallback in all components          |
| **Rich text XSS vulnerability**              | Security issue                     | Low        | Use `set:html` carefully; Strapi sanitizes by default        |
| **Order field breaks existing Team display** | Team members hidden                | Low        | Default `order: 0` ensures all items display; sort is stable |
| **Component schema errors**                  | Strapi won't start                 | Medium     | Test schema changes in development first                     |
| **Database migration fails**                 | Data loss                          | Low        | Backup before changes; schema changes are additive           |
| **Docker image cache issues**                | Old code runs                      | Medium     | Use `--no-cache` flag when rebuilding                        |
| **Environment variable mismatch**            | API calls fail                     | Medium     | Verify env vars match between local and production           |
| **Strapi version incompatibility**           | Upgrade breaks plugins             | N/A        | No upgrade planned; stay on 4.25.5                           |

### Edge Case Handling

1. **Empty content:** If editor clears content in Strapi, frontend should handle gracefully

   - About: Display fallback or hide section
   - Services: Display fallback list or hide section
   - Footer: Display fallback tagline

2. **Missing team images:** Current code assumes `image.data.attributes.url` exists

   - Add null check: `project.attributes.image?.data?.attributes?.url || '/images/placeholder.jpg'`

3. **Deleted content types:** If API returns 404, fallback should activate
   - Frontend handles with try/catch and fallback content

---

## Local Development Quickstart

### Prerequisites

- **Docker Desktop** (v20.10+) with Docker Compose v2
- **Node.js** 18.x or 20.x (only needed for non-Docker development)
- **Git** for cloning the repository

### Environment Variables

#### Root `.env` (for Docker Compose)

Create `.env` in project root based on these required variables:

```env
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=admin1234

# Strapi secrets (generate unique values)
JWT_SECRET=your-jwt-secret-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Email
SENDGRID_API_KEY=your-sendgrid-api-key

# Environment
NODE_ENV=development
```

**Reference:** See `api/.env.example` for Strapi-specific variables.

#### Client `.env` (`client/.env`)

```env
PUBLIC_API_URL=http://localhost:1337
PUBLIC_IMAGE_URL=http://localhost:1337
PUBLIC_FILE_URL=http://localhost:1337
```

**Note:** When running with Docker, the Astro container uses `http://strapi:1337` for internal API calls (set in `docker-compose.yml`).

### Docker Commands

#### Start all services (recommended)

```bash
# Build and start all containers
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

#### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f strapi
docker compose logs -f astro-app
```

#### Stop services

```bash
docker compose down

# Remove volumes (WARNING: deletes database data)
docker compose down -v
```

#### Rebuild a specific service

```bash
docker compose build --no-cache strapi
docker compose up -d strapi
```

### Non-Docker Development

If running without Docker (not recommended due to database setup complexity):

#### API (Strapi)

```bash
cd api
npm install
npm run develop
```

**Note:** Requires PostgreSQL running locally or SQLite configuration in `api/config/database.js`.

#### Client (Astro)

```bash
cd client
npm install
npm run dev
```

### Service URLs

| Service            | URL                         | Purpose                      |
| ------------------ | --------------------------- | ---------------------------- |
| **Astro Frontend** | http://localhost:4321       | Public website               |
| **Strapi Admin**   | http://localhost:1337/admin | CMS admin panel              |
| **Strapi API**     | http://localhost:1337/api   | REST API                     |
| **PostgreSQL**     | localhost:5432              | Database (for direct access) |

### First-Time Setup

1. **Start services:** `docker compose up --build`
2. **Wait for Strapi:** First build takes 2-5 minutes; watch logs for "Strapi started"
3. **Create admin user:** Navigate to http://localhost:1337/admin and register
4. **Set permissions:** Go to Settings → Roles → Public and enable `find` for all content types
5. **Add content:** Create Team members, Projects, Documents, and Hero entries
6. **View site:** Navigate to http://localhost:4321

### Common Issues and Fixes

| Issue                            | Cause                                   | Fix                                                              |
| -------------------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| **Port 1337 already in use**     | Another Strapi or service running       | `docker compose down` or `lsof -i :1337` to find process         |
| **Port 5432 already in use**     | Local PostgreSQL running                | Stop local PostgreSQL or change port in `docker-compose.yml`     |
| **Strapi won't start**           | Database not ready                      | Wait 30s and check logs; PostgreSQL needs time to initialize     |
| **"Cannot find module" errors**  | Node modules not installed in container | `docker compose build --no-cache strapi`                         |
| **Astro fetch errors**           | Strapi not running or wrong URL         | Verify Strapi is running; check `PUBLIC_API_URL`                 |
| **Images not loading**           | Wrong `PUBLIC_IMAGE_URL`                | For Docker: use `http://localhost:1337` (not internal DNS)       |
| **Database connection refused**  | Wrong DATABASE_HOST                     | In Docker: use `postgres` (service name); local: use `localhost` |
| **Permission denied on uploads** | Volume ownership issues                 | `sudo chown -R $USER:$USER api/public/uploads`                   |

### Useful Development Commands

```bash
# Access Strapi container shell
docker compose exec strapi sh

# Access PostgreSQL
docker compose exec postgres psql -U strapi -d strapi

# Backup database
docker compose exec postgres pg_dump -U strapi strapi > backup.sql

# Restore database
cat backup.sql | docker compose exec -T postgres psql -U strapi strapi

# View running containers
docker compose ps

# Check container resource usage
docker stats
```

---

## Deployment / Operations Notes

### Deployment Architecture

The project supports two deployment methods:

#### 1. Docker Compose (Primary)

**Config file:** `docker-compose.yml`

| Service     | Container Name   | Image Source                   | Internal Port | External Port | Network  |
| ----------- | ---------------- | ------------------------------ | ------------- | ------------- | -------- |
| `postgres`  | (auto-generated) | `postgres:16`                  | 5432          | 5432          | `strapi` |
| `strapi`    | `strapi`         | Built from `api/Dockerfile`    | 1337          | 1337          | `strapi` |
| `astro-app` | (auto-generated) | Built from `client/Dockerfile` | 4321          | 4321          | `strapi` |

**Service-to-Service Communication:**

- Astro → Strapi: `http://strapi:1337` (Docker internal DNS)
- Strapi → PostgreSQL: `postgres:5432` (Docker internal DNS)
- External access uses `localhost:<port>`

**Volume Mounts:**

| Volume                  | Container Path             | Purpose                        |
| ----------------------- | -------------------------- | ------------------------------ |
| `postgres-data` (named) | `/var/lib/postgresql/data` | Persistent database storage    |
| `./api/config`          | `/opt/app/config`          | Strapi config (dev hot-reload) |
| `./api/src`             | `/opt/app/src`             | Strapi source (dev hot-reload) |
| `./api/public/uploads`  | `/opt/app/public/uploads`  | Media file storage             |

#### 2. PM2 Cluster Mode (Alternative)

**Config file:** `ecosystem.config.js`

For running on a single server without Docker:

| App Name | Script      | Working Directory | Port | Cluster Mode          |
| -------- | ----------- | ----------------- | ---- | --------------------- |
| `strapi` | `npm start` | `./api`           | 1337 | Yes (`max` instances) |
| `astro`  | `npm start` | `./client`        | 4321 | Yes (`max` instances) |

**Logs location:** `./logs/` directory

**PM2 Commands:**

```bash
# Start all apps
pm2 start ecosystem.config.js

# View status
pm2 status

# View logs
pm2 logs

# Restart all
pm2 restart all

# Stop all
pm2 stop all
```

### Dockerfile Details

#### Strapi (`api/Dockerfile`)

- **Base image:** `node:20.15.1-alpine`
- **Build dependencies:** gcc, autoconf, automake, vips-dev, python3 (for native modules)
- **Working directory:** `/opt/app`
- **Build step:** `npm run build` (compiles Strapi admin panel)
- **Startup command:** `npm run develop` (dev mode with auto-reload)

**Production adjustment needed:** Change `CMD ["npm", "run", "develop"]` to `CMD ["npm", "run", "start"]`

#### Astro (`client/Dockerfile`)

- **Base image:** `node:lts`
- **Working directory:** `/app`
- **Build step:** `npm run build` (generates `./dist/server/entry.mjs`)
- **Startup command:** `node ./dist/server/entry.mjs` (SSR server)
- **Exposed port:** 4321

### Production Considerations

1. **Environment URLs:** Update `PUBLIC_IMAGE_URL` and `PUBLIC_FILE_URL` to production domain (not `localhost`)

2. **HTTPS:** Add reverse proxy (nginx/Traefik) for SSL termination

3. **Secrets:** Generate new values for all JWT/API secrets in production

4. **Database:** Consider managed PostgreSQL (DigitalOcean, AWS RDS) for production

5. **Media storage:** Consider S3-compatible storage for uploads in production

6. **CORS:** Update `api/config/middlewares.js` if frontend and API are on different domains

### Health Checks

```bash
# Check Strapi API
curl -I http://localhost:1337/api/teams

# Check Astro SSR
curl -I http://localhost:4321

# Check PostgreSQL
docker compose exec postgres pg_isready -U strapi
```

---

## Appendix: Key File Paths

### Strapi (Backend)

| Purpose         | Path                                                      |
| --------------- | --------------------------------------------------------- |
| Main config     | `api/config/`                                             |
| Database config | `api/config/database.js`                                  |
| Plugins config  | `api/config/plugins.js`                                   |
| Team schema     | `api/src/api/team/content-types/team/schema.json`         |
| Project schema  | `api/src/api/project/content-types/project/schema.json`   |
| Document schema | `api/src/api/document/content-types/document/schema.json` |
| Email schema    | `api/src/api/email/content-types/email/schema.json`       |
| Hero schema     | `api/src/api/hero/content-types/hero/schema.json`         |
| Email lifecycle | `api/src/api/email/content-types/email/lifecycles.js`     |
| Dockerfile      | `api/Dockerfile`                                          |
| Package.json    | `api/package.json`                                        |
| Env example     | `api/.env.example`                                        |

### Astro (Frontend)

| Purpose            | Path                                        |
| ------------------ | ------------------------------------------- |
| Main layout        | `client/src/layouts/DefaultLayout.astro`    |
| Homepage           | `client/src/pages/index.astro`              |
| Projects list      | `client/src/pages/projects/index.astro`     |
| Project detail     | `client/src/pages/projects/[id].astro`      |
| Publications       | `client/src/pages/publications/index.astro` |
| Hero component     | `client/src/components/Hero.astro`          |
| About component    | `client/src/components/About.astro`         |
| Services component | `client/src/components/Services.astro`      |
| Team component     | `client/src/components/Team.astro`          |
| Contact component  | `client/src/components/Contact.astro`       |
| Footer component   | `client/src/components/Footer.astro`        |
| Navbar component   | `client/src/components/Navbar.astro`        |
| Contact form JS    | `client/public/js/contact.js`               |
| Astro config       | `client/astro.config.mjs`                   |
| Tailwind config    | `client/tailwind.config.mjs`                |
| Dockerfile         | `client/Dockerfile`                         |
| Package.json       | `client/package.json`                       |

### Infrastructure

| Purpose        | Path                   |
| -------------- | ---------------------- |
| Docker Compose | `docker-compose.yml`   |
| PM2 config     | `ecosystem.config.js`  |
| Root env       | `.env` (not committed) |

---

## Uncertainties & Verification Points

1. **Production URL configuration:** The docker-compose.yml uses `localhost` for image URLs. Need to verify what URLs are used in production deployment.

   - **Verify:** Check DigitalOcean droplet environment variables

2. **Strapi permissions:** Cannot verify current Public role permissions without running Strapi.

   - **Verify:** Start Strapi and check Settings → Roles → Public

3. **Database state:** Cannot verify actual content without database access.

   - **Verify:** Run `docker-compose up` and check Strapi admin

4. **Upload storage:** Media files are bind-mounted. Verify uploads persist correctly.

   - **Verify:** Check `api/public/uploads/` directory contents

5. **SendGrid configuration:** Email sending is configured but cannot verify API key validity.

   - **Verify:** Check `.env` file and test contact form

6. **Strapi admin credentials:** Unknown without `.env` file or database access.
   - **Verify:** Check production environment or reset password

---

_Document generated: January 2026_  
_Last repo activity: ~18 months prior_
