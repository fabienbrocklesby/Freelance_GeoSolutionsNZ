# GeoSolutions Refactor Implementation Guide

> **Created:** 2 February 2026  
> **Purpose:** Step-by-step prompts for Copilot-assisted refactor  
> **Estimated Time:** 1-2 hours total

---

## Overview

This guide contains ready-to-paste prompts for each stage of the refactor. Open a fresh Copilot chat for each stage.

### Execution Order

```
┌─────────────────────────────────────────────────────┐
│  PARALLEL (run simultaneously)                       │
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │
│  │ Stage 1   │  │ Stage 2   │  │ Stage 3       │   │
│  │ Team Order│  │ About     │  │ Site Settings │   │
│  └───────────┘  └───────────┘  └───────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  SEQUENTIAL                                          │
│  ┌───────────────┐                                  │
│  │ Stage 4       │                                  │
│  │ Services Page │                                  │
│  └───────────────┘                                  │
│           ↓                                         │
│  ┌───────────────┐                                  │
│  │ Stage 5       │                                  │
│  │ Hero Convert  │                                  │
│  └───────────────┘                                  │
└─────────────────────────────────────────────────────┘
```

---

## Stage 1: Team Order Field

**Model:** Claude Sonnet 4.5  
**Dependencies:** None  
**Files Modified:** 2  
**Files Created:** 0

### Prompt

```
Add an `order` field to the Team content type in this Strapi 4.25.5 project and update the Astro frontend to use it.

## Requirements

### 1. Strapi Schema Change
Modify `api/src/api/team/content-types/team/schema.json`:
- Add an `order` field of type `integer` with default `0` and minimum `0`
- Follow Strapi 4.x schema conventions exactly

### 2. Astro Component Update
Modify `client/src/components/Team.astro`:
- Add `&sort=order:asc` to the fetch URL
- Wrap the fetch in try/catch with proper error handling
- Add fallback behavior if API fails (display empty state or log error, don't crash)
- Keep existing mapping logic intact
- No comments unless absolutely necessary for clarity

## Style Requirements
- No TypeScript
- No unnecessary comments
- Follow existing code patterns in the project
- Strapi schema must be valid JSON (no trailing commas)
```

### Verification

After completion:

1. Restart Strapi to apply schema change
2. Check Strapi admin – Team should have new "order" field
3. Set order values on existing team members
4. Verify frontend displays team in correct order

---

## Stage 2: About Single Type

**Model:** Claude Opus 4.5  
**Dependencies:** None  
**Files Modified:** 1  
**Files Created:** 5

### Prompt

```
Create a new "About" Single Type in Strapi 4.25.5 and connect it to the Astro frontend.

## Requirements

### 1. Create Strapi Single Type
Create the full content type structure at `api/src/api/about/`:

Directory structure needed:
```

api/src/api/about/
├── content-types/
│ └── about/
│ └── schema.json
├── controllers/
│ └── about.js
├── routes/
│ └── about.js
└── services/
└── about.js

```

Schema requirements:
- Kind: `singleType`
- Collection name: `about`
- Singular name: `about`
- Plural name: `abouts`
- Display name: `About`
- Draft and publish: enabled
- Single field: `content` of type `richtext`, required

Controllers, routes, and services should use Strapi 4.x core factory pattern:
- Controller: `const { createCoreController } = require('@strapi/strapi').factories;`
- Service: `const { createCoreService } = require('@strapi/strapi').factories;`
- Route: `const { createCoreRouter } = require('@strapi/strapi').factories;`

### 2. Update Astro Component
Modify `client/src/components/About.astro`:
- Fetch from `/api/about` (no populate needed)
- Wrap in try/catch with error handling
- Keep the existing hard-coded content as fallback if API fails or returns empty
- Render rich text content using `set:html` directive
- Maintain existing styling and AOS animations

## Fallback Content (use exactly this text):
"We are a specialised geotechnical consultancy, covering projects and sites all around the Top of the South Island and look after both the residential and commercial building sectors. We're a local business and aim to look after our clients so that they tell all their friends. Word-of-mouth referrals are our favourite jobs! Talk to us now and find out how we can help."

## Style Requirements
- No TypeScript
- No unnecessary comments
- Follow Strapi 4.x conventions exactly
- Valid JSON schemas (no trailing commas)
```

### Verification

After completion:

1. Restart Strapi
2. Go to Settings → Roles → Public → About → Enable `find`
3. Create About content in Strapi admin with the fallback text
4. Publish the content
5. Verify frontend displays the content

---

## Stage 3: Site Settings Single Type

**Model:** Claude Sonnet 4.5  
**Dependencies:** None  
**Files Modified:** 1  
**Files Created:** 5

### Prompt

```
Create a "Site Setting" Single Type in Strapi 4.25.5 for the footer tagline and connect it to the Astro frontend.

## Requirements

### 1. Create Strapi Single Type
Create the full content type structure at `api/src/api/site-setting/`:

Directory structure:
```

api/src/api/site-setting/
├── content-types/
│ └── site-setting/
│ └── schema.json
├── controllers/
│ └── site-setting.js
├── routes/
│ └── site-setting.js
└── services/
└── site-setting.js

```

Schema requirements:
- Kind: `singleType`
- Collection name: `site_settings`
- Singular name: `site-setting`
- Plural name: `site-settings`
- Display name: `Site Setting`
- Draft and publish: disabled (changes publish immediately)
- Field: `footerTagline` of type `text`, required

Use Strapi 4.x core factory pattern for controller, service, and router.

### 2. Update Astro Component
Modify `client/src/components/Footer.astro`:
- Fetch from `/api/site-setting`
- Wrap in try/catch with error handling
- Keep existing hard-coded tagline as fallback
- Maintain existing layout and year calculation

## Fallback Tagline:
"Our focus is on the private sector market in the communities in and around the top of the South Island, New Zealand. (Nelson Tasman)"

## Style Requirements
- No TypeScript
- No unnecessary comments
- Follow Strapi 4.x conventions exactly
```

### Verification

After completion:

1. Restart Strapi
2. Go to Settings → Roles → Public → Site Setting → Enable `find`
3. Add the tagline in Strapi admin
4. Save (auto-publishes since draftAndPublish is false)
5. Verify footer displays the tagline

---

## Stage 4: Services Page with Component

**Model:** Claude Opus 4.5  
**Dependencies:** Stages 1-3 complete (for pattern consistency)  
**Files Modified:** 1  
**Files Created:** 7

### Prompt

```
Create a "Services Page" Single Type with a repeatable component for service items in Strapi 4.25.5, and connect it to the Astro frontend.

## Requirements

### 1. Create Strapi Component
Create a reusable component at `api/src/components/content/service-item.json`:

First create the directory structure:
```

api/src/components/
└── content/
└── service-item.json

```

Component schema:
- Collection name: `components_content_service_items`
- Display name: `Service Item`
- Icon: `bulletList`
- Single field: `label` of type `string`, required, maxLength 200

### 2. Create Strapi Single Type
Create the full content type structure at `api/src/api/services-page/`:

Directory structure:
```

api/src/api/services-page/
├── content-types/
│ └── services-page/
│ └── schema.json
├── controllers/
│ └── services-page.js
├── routes/
│ └── services-page.js
└── services/
└── services-page.js

```

Schema requirements:
- Kind: `singleType`
- Collection name: `services_page`
- Singular name: `services-page`
- Plural name: `services-pages`
- Display name: `Services Page`
- Draft and publish: enabled
- Fields:
  - `introText`: type `richtext`, required
  - `serviceItems`: type `component`, repeatable `true`, component `content.service-item`

Use Strapi 4.x core factory pattern for controller, service, and router.

### 3. Update Astro Component
Modify `client/src/components/Services.astro`:
- Fetch from `/api/services-page?populate=serviceItems`
- Wrap in try/catch with error handling
- Keep existing hard-coded content as complete fallback
- Extract service labels from `serviceItems` array
- Render `introText` as rich text with `set:html`
- Maintain existing grid layout and AOS animations

## Fallback Content

Intro text:
"GeoSolutions provides specialist geotechnical services to assist you with your building project. You may need to provide a Geotech report to accompany your application for resource consent for a subdivision or would like a foundation assessment for a new cellphone tower. We will help you establish an appropriate and cost-effective investigation for your project and then walk you through the process through to consent application. We usually need to double check the plans before application, may need to answer questions during the consent application and will almost certainly need to check the ground conditions during construction."

Services list:
1. Site and soil investigations
2. Landslip damage assessment and remediation
3. Subdivision geotechnical assessments (urban and rural)
4. Liquefaction assessment
5. Establishment of fault location
6. Earthworks design, supervision & certification
7. Natural disaster insurance assessment
8. Geotechnical peer review services and expert opinions
9. On-site wastewater disposal suitability assessment
10. Geotechnical site certification

## Style Requirements
- No TypeScript
- No unnecessary comments
- Follow Strapi 4.x conventions exactly
- Component schema must follow Strapi component conventions
```

### Verification

After completion:

1. Restart Strapi
2. Go to Settings → Roles → Public → Services Page → Enable `find`
3. Create Services Page content in admin
4. Add intro text and all 10 service items
5. Publish
6. Verify frontend displays correctly

---

## Stage 5: Convert Hero to Single Type

**Model:** Claude Opus 4.5  
**Dependencies:** All previous stages complete  
**Files Modified:** 2  
**Files Created:** 0 (replacing existing)

### Prompt

```
Convert the Hero content type from Collection Type to Single Type in Strapi 4.25.5 and update the Astro frontend.

## Current State
- Hero is defined as `collectionType` at `api/src/api/hero/`
- Frontend only uses `data[0]` (first item)
- This is semantically incorrect - Hero should be a Single Type

## Requirements

### 1. Modify Strapi Schema
Update `api/src/api/hero/content-types/hero/schema.json`:
- Change `kind` from `collectionType` to `singleType`
- Keep collection name as `heroes` (for database compatibility)
- Update singular/plural names appropriately
- Keep the `Banner` media field exactly as is
- Enable draft and publish

The controller, service, and routes at:
- `api/src/api/hero/controllers/hero.js`
- `api/src/api/hero/services/hero.js`
- `api/src/api/hero/routes/hero.js`

Should already use core factories which work for both collection and single types - verify they use the factory pattern and update if needed.

### 2. Update Astro Component
Modify `client/src/components/Hero.astro`:
- Change fetch URL from `/api/heroes` to `/api/hero` (singular for single type)
- Update response handling: Single types return `data` directly, not `data[0]`
- Add try/catch with error handling
- Add fallback behavior (could show a default gradient or placeholder)
- Keep existing image processing logic with `getImage()`
- Maintain existing styling

## Important Notes
- After this change, existing Hero data in the database will need to be re-entered via Strapi admin
- The API endpoint changes from `/api/heroes` to `/api/hero`
- Single type response structure is `{ data: { id, attributes: { Banner: {...} } } }` not an array

## Style Requirements
- No TypeScript
- No unnecessary comments
- Follow Strapi 4.x conventions exactly
```

### Verification

After completion:

1. Restart Strapi (may show warnings about data migration)
2. Go to Settings → Roles → Public → Hero → Enable `find`
3. Upload a banner image in Hero single type
4. Publish
5. Verify frontend displays the hero banner

### Migration Note

If you have existing hero data you want to preserve:

1. Before making changes, note the current banner image URL
2. After conversion, re-upload the same image to the new Single Type
3. Or use the import-export-entries plugin to export/import

---

## Post-Implementation Checklist

After all stages complete:

### Strapi Admin Setup

- [ ] All new content types visible in Content Manager
- [ ] Public role has `find` permission for: About, Site Setting, Services Page, Hero
- [ ] All content entered and published

### Content Migration

- [ ] About content copied from hard-coded text
- [ ] Site Settings tagline entered
- [ ] Services Page intro text entered
- [ ] All 10 service items added
- [ ] Hero banner uploaded
- [ ] Team members have order values set

### Frontend Verification

- [ ] Homepage loads without errors
- [ ] About section displays Strapi content
- [ ] Services section displays intro + all items
- [ ] Team displays in correct order
- [ ] Footer shows tagline
- [ ] Hero banner displays

### Fallback Testing

- [ ] Stop Strapi: `docker-compose stop strapi`
- [ ] Verify site loads with fallback content
- [ ] No console errors (only warnings)
- [ ] Restart Strapi: `docker-compose start strapi`

### Final Cleanup

- [ ] Remove any dead code (check `client/src/utils/api.js` - may be unused)
- [ ] Test contact form still works
- [ ] Test projects and publications pages
- [ ] Commit all changes with descriptive message

---

## Troubleshooting

### "Content type not found" after restart

- Strapi needs a full restart, not just hot reload
- Run `docker-compose restart strapi` or stop/start

### API returns 403 Forbidden

- Permissions not set: Settings → Roles → Public → [Content Type] → Enable `find`

### Component not recognized

- Ensure `api/src/components/content/` folder exists
- Check component path in schema matches: `content.service-item`
- Restart Strapi after creating components

### Single Type returns empty

- Content not published (if draftAndPublish enabled)
- Check Strapi admin → Content Manager → [Type] → Publish button

### Frontend shows fallback despite API working

- Check browser console for fetch errors
- Verify `PUBLIC_API_URL` environment variable is set
- For Docker: internal calls use `http://strapi:1337`
