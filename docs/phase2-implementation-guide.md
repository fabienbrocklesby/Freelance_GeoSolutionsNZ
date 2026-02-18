# GeoSolutions Phase 2: Enhanced CMS & SEO

> **Created:** 2 February 2026  
> **Purpose:** Additional value delivery - admin branding, SEO, testimonials  
> **Estimated Time:** 2-3 hours total

---

## Overview

Phase 2 focuses on making Strapi feel like a custom CMS for GeoSolutions and adding professional SEO/content features.

### Execution Order

```
┌─────────────────────────────────────────────────────┐
│  PARALLEL (run simultaneously)                       │
│  ┌───────────────┐  ┌───────────────┐              │
│  │ Stage 1       │  │ Stage 2       │              │
│  │ Admin Brand   │  │ Contact Info  │              │
│  └───────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  PARALLEL                                            │
│  ┌───────────────┐  ┌───────────────┐              │
│  │ Stage 3       │  │ Stage 4       │              │
│  │ SEO Component │  │ Sitemap/Robot │              │
│  └───────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  PARALLEL                                            │
│  ┌───────────────┐  ┌───────────────┐              │
│  │ Stage 5       │  │ Stage 7       │              │
│  │ Testimonials  │  │ Announcement  │              │
│  └───────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  SEQUENTIAL                                          │
│  ┌───────────────┐                                  │
│  │ Stage 8       │                                  │
│  │ Hero Content  │                                  │
│  └───────────────┘                                  │
│           ↓                                         │
│  ┌───────────────┐                                  │
│  │ Stage 6       │                                  │
│  │ Admin Guide   │                                  │
│  └───────────────┘                                  │
│           ↓                                         │
│  ┌───────────────┐                                  │
│  │ Stage 9       │                                  │
│  │ Update Docs   │                                  │
│  └───────────────┘                                  │
└─────────────────────────────────────────────────────┘
```

---

## Stage 1: Custom Admin Branding & Full Theme

**Model:** Claude Sonnet 4.5  
**Dependencies:** None  
**Files Modified:** 0  
**Files Created:** 4

### Prompt

````
Customize the Strapi 4.25.5 admin panel with GeoSolutions branding and a complete custom color theme for both light and dark modes.

## Requirements

### 1. Create Admin App Configuration
Create `api/src/admin/app.js` with:
- Custom auth (login) logo
- Custom menu (sidebar) logo
- Custom favicon
- Complete custom theme for BOTH light and dark modes
- Disable Strapi tutorials and release notifications

### 2. Create Extensions Directory and Add Logo Files
Create `api/src/admin/extensions/` directory.

For the logos, create placeholder references - the actual image files will need to be added manually. Use these paths:
- `api/src/admin/extensions/logo.png` (main logo for sidebar, ~200x50px recommended)
- `api/src/admin/extensions/auth-logo.png` (login page logo, ~300x100px recommended)
- `api/src/admin/extensions/favicon.png` (16x16 or 32x32)

### 3. Complete Theme Colors
Use these GeoSolutions brand colors as the base:
- Primary: #2db875 (green)
- Primary dark: #259962
- Accent: #3a4a6a (dark blue)

Configure BOTH light AND dark themes with full color overrides:

**Light Theme:**
```js
light: {
  colors: {
    primary100: "#e8f7f0",
    primary200: "#b8e6d1",
    primary500: "#3ec98a",
    primary600: "#2db875",
    primary700: "#259962",
    buttonPrimary500: "#3ec98a",
    buttonPrimary600: "#2db875",
  },
},
```

**Dark Theme (make it feel modern, not default Strapi purple):**
```js
dark: {
  colors: {
    primary100: "#1a3d2e",
    primary200: "#245c42",
    primary500: "#3ec98a",
    primary600: "#2db875",
    primary700: "#259962",
    neutral0: "#151515",
    neutral100: "#1a1a1a",
    neutral150: "#202020",
    neutral200: "#2a2a2a",
    neutral300: "#3a3a3a",
    neutral400: "#4a4a4a",
    neutral500: "#6a6a6a",
    neutral600: "#8a8a8a",
    neutral700: "#aaaaaa",
    neutral800: "#cccccc",
    neutral900: "#eaeaea",
    neutral1000: "#ffffff",
    buttonPrimary500: "#3ec98a",
    buttonPrimary600: "#2db875",
    buttonNeutral0: "#ffffff",
  },
},
```

### 4. App.js Structure
Follow Strapi 4.x admin customization pattern exactly:

```js
import AuthLogo from "./extensions/auth-logo.png";
import MenuLogo from "./extensions/logo.png";
import favicon from "./extensions/favicon.png";

export default {
  config: {
    auth: {
      logo: AuthLogo,
    },
    head: {
      favicon: favicon,
    },
    menu: {
      logo: MenuLogo,
    },
    theme: {
      light: {
        colors: {
          primary100: "#e8f7f0",
          primary200: "#b8e6d1",
          primary500: "#3ec98a",
          primary600: "#2db875",
          primary700: "#259962",
          buttonPrimary500: "#3ec98a",
          buttonPrimary600: "#2db875",
        },
      },
      dark: {
        colors: {
          primary100: "#1a3d2e",
          primary200: "#245c42",
          primary500: "#3ec98a",
          primary600: "#2db875",
          primary700: "#259962",
          neutral0: "#151515",
          neutral100: "#1a1a1a",
          neutral150: "#202020",
          neutral200: "#2a2a2a",
          neutral300: "#3a3a3a",
          neutral400: "#4a4a4a",
          neutral500: "#6a6a6a",
          neutral600: "#8a8a8a",
          neutral700: "#aaaaaa",
          neutral800: "#cccccc",
          neutral900: "#eaeaea",
          neutral1000: "#ffffff",
          buttonPrimary500: "#3ec98a",
          buttonPrimary600: "#2db875",
          buttonNeutral0: "#ffffff",
        },
      },
    },
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap() {},
};
```

## Important Notes

- After creating these files, you'll need to rebuild the Strapi admin: `npm run build` inside the api folder
- The actual logo images need to be added manually (PNG format)
- Keep the existing api/src/admin/app.example.js as reference
- The dark theme uses neutral grays instead of Strapi's default purple-ish darks
- Both themes use the GeoSolutions green as the primary accent

## Style Requirements

- No TypeScript
- No unnecessary comments
- Follow Strapi 4.x admin customization conventions exactly
````

### Verification

After completion:

1. Add actual logo PNG files to `api/src/admin/extensions/`
2. Run `npm run build` in api folder (or rebuild Docker)
3. Restart Strapi
4. Verify login page shows custom logo
5. Verify sidebar shows custom logo
6. Verify browser tab shows custom favicon
7. Toggle between light/dark mode in Strapi - both should show green accents
8. Dark mode should have clean gray backgrounds, not purple

---

## Stage 1.5: Complete Dark Theme Customization

**Model:** Claude Sonnet 4.5  
**Dependencies:** Stage 1 complete  
**Files Modified:** 1  
**Files Created:** 0

### Prompt

````
Update the existing Strapi admin app.js to add a complete custom dark theme with modern gray colors instead of Strapi's default purple-ish dark mode.

## Current State
`api/src/admin/app.js` already exists with light theme customization and logo imports.

## Requirements

### Update the theme configuration
Modify `api/src/admin/app.js` to add a complete `dark` theme configuration alongside the existing `light` theme.

The dark theme should use clean neutral grays (not Strapi's default purple-tinted darks) with GeoSolutions green accents:

```js
dark: {
  colors: {
    primary100: "#1a3d2e",
    primary200: "#245c42",
    primary500: "#3ec98a",
    primary600: "#2db875",
    primary700: "#259962",
    neutral0: "#151515",
    neutral100: "#1a1a1a",
    neutral150: "#202020",
    neutral200: "#2a2a2a",
    neutral300: "#3a3a3a",
    neutral400: "#4a4a4a",
    neutral500: "#6a6a6a",
    neutral600: "#8a8a8a",
    neutral700: "#aaaaaa",
    neutral800: "#cccccc",
    neutral900: "#eaeaea",
    neutral1000: "#ffffff",
    buttonPrimary500: "#3ec98a",
    buttonPrimary600: "#2db875",
    buttonNeutral0: "#ffffff",
  },
},
````

Add this `dark` object inside the existing `theme` object, right after the `light` configuration.

## Style Requirements

- No TypeScript
- No unnecessary comments
- Keep all existing configuration intact
- Just add the dark theme colors

```

### Verification
After completion:
1. Run `npm run build` in api folder (or `docker-compose exec strapi npm run build`)
2. Restart Strapi
3. In Strapi admin, click your profile icon (bottom left)
4. Toggle to dark mode
5. Verify dark mode has clean gray backgrounds with green accents
6. Verify it no longer looks like default Strapi purple

---
## Stage 2: Contact Information in Site Settings

**Model:** Claude Sonnet 4.5
**Dependencies:** None (builds on existing Site Setting)
**Files Modified:** 2
**Files Created:** 0

### Prompt

```

Extend the existing Site Setting single type in Strapi 4.25.5 to include contact information, and update the Astro frontend to use it.

## Current State

Site Setting already exists at `api/src/api/site-setting/` with a `footerTagline` field.

## Requirements

### 1. Update Strapi Schema

Modify `api/src/api/site-setting/content-types/site-setting/schema.json` to add:

- `phoneNumber` (string)
- `primaryEmail` (email)
- `secondaryEmail` (email)
- `address` (text, for multi-line address if needed)

Keep the existing `footerTagline` field.

### 2. Update Astro Contact Component

Modify `client/src/components/Contact.astro`:

- Fetch from `/api/site-setting`
- Use the contact info from Strapi
- Keep existing hard-coded values as fallback
- Maintain existing form and styling

## Fallback Values

- Phone: 027 898 6000
- Primary Email: admin@geosolutions.nz
- Secondary Email: sally@geosolutions.nz

## Style Requirements

- No TypeScript
- No unnecessary comments
- Strapi schema must be valid JSON (no trailing commas)
- Maintain existing Contact.astro structure and form functionality

```

### Verification
After completion:
1. Restart Strapi
2. Go to Content Manager → Site Setting
3. Add phone number and email addresses
4. Save
5. Verify Contact section displays the Strapi values

---

## Stage 3: SEO Meta Component

**Model:** Claude Opus 4.5
**Dependencies:** None
**Files Modified:** 3
**Files Created:** 1

### Prompt

```

Create a reusable SEO component in Strapi 4.25.5 and add it to Projects, Documents, and page single types.

## Requirements

### 1. Create SEO Component

Create `api/src/components/shared/seo.json`:

```
api/src/components/
└── shared/
    └── seo.json
```

Component schema:

- Collection name: `components_shared_seo`
- Display name: `SEO`
- Icon: `search`
- Fields:
  - `metaTitle` (string, maxLength 60)
  - `metaDescription` (text, maxLength 160)
  - `ogImage` (media, single image, optional)

### 2. Add SEO Component to Content Types

Modify these existing schemas to add the SEO component:

**Project** (`api/src/api/project/content-types/project/schema.json`):
Add `seo` field of type `component`, component `shared.seo`, not repeatable

**Document** (`api/src/api/document/content-types/document/schema.json`):
Add `seo` field of type `component`, component `shared.seo`, not repeatable

**About** (`api/src/api/about/content-types/about/schema.json`):
Add `seo` field of type `component`, component `shared.seo`, not repeatable

### 3. Update Astro Layout for SEO

Modify `client/src/layouts/DefaultLayout.astro` to:

- Accept optional SEO props (metaTitle, metaDescription, ogImage)
- Render proper meta tags in <head>
- Include Open Graph tags (og:title, og:description, og:image)
- Include Twitter Card tags

### 4. Update Project Detail Page

Modify `client/src/pages/projects/[id].astro` to:

- Populate the `seo` component in the fetch: `?populate=thumbnail,beforePhoto,afterPhoto,seo,seo.ogImage`
- Pass SEO data to DefaultLayout

## SEO Meta Tag Structure

```html
<title>{metaTitle || pageTitle} | GeoSolutions</title>
<meta name="description" content="{metaDescription || defaultDescription}" />
<meta property="og:title" content="{metaTitle || pageTitle}" />
<meta
  property="og:description"
  content="{metaDescription || defaultDescription}"
/>
<meta property="og:image" content="{ogImage || defaultOgImage}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

## Default Values

- Default description: "GeoSolutions - Specialist geotechnical consultancy in Nelson Tasman, New Zealand"
- Site name: "GeoSolutions"

## Style Requirements

- No TypeScript
- No unnecessary comments
- Follow Strapi component conventions exactly
- Valid JSON schemas (no trailing commas)

```

### Verification
After completion:
1. Restart Strapi
2. Check Project content type has SEO section
3. Add SEO data to a project
4. Publish
5. View project page source - verify meta tags appear

---

## Stage 4: Sitemap and robots.txt

**Model:** Claude Sonnet 4.5
**Dependencies:** None
**Files Modified:** 2
**Files Created:** 1

### Prompt

```

Add sitemap generation and robots.txt to the Astro frontend for SEO.

## Requirements

### 1. Install and Configure Sitemap Integration

The astro config is at `client/astro.config.mjs`.

Add the @astrojs/sitemap integration:

- Import sitemap from '@astrojs/sitemap'
- Add to integrations array
- Set the site URL (use environment variable or placeholder)

Updated config should look like:

```js
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import "dotenv/config";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://geosolutions.nz",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [tailwind(), sitemap()],
});
```

### 2. Create Dynamic robots.txt

Create `client/src/pages/robots.txt.js` (API route that generates robots.txt):

```js
const getRobotsTxt = (sitemapURL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`;

export async function GET({ site }) {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL.href), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
```

### 3. Add Environment Variable

Note: `PUBLIC_SITE_URL` should be added to:

- `client/.env` for local dev
- Docker environment for production

## Style Requirements

- No TypeScript
- No unnecessary comments
- Follow Astro conventions exactly

```

### Verification
After completion:
1. Install the sitemap package: `npm install @astrojs/sitemap` in client folder
2. Restart Astro
3. Visit `/robots.txt` - should show robots content with sitemap URL
4. Visit `/sitemap-index.xml` - should show sitemap
5. Check sitemap includes all pages

---

## Stage 5: Testimonials Section

**Model:** Claude Opus 4.5
**Dependencies:** Stages 1-4 complete (for pattern consistency)
**Files Modified:** 1
**Files Created:** 6

### Prompt

```

Create a Testimonials content type in Strapi 4.25.5 and a new frontend section to display them.

## Requirements

### 1. Create Strapi Collection Type

Create the full content type structure at `api/src/api/testimonial/`:

Directory structure:

```
api/src/api/testimonial/
├── content-types/
│   └── testimonial/
│       └── schema.json
├── controllers/
│   └── testimonial.js
├── routes/
│   └── testimonial.js
└── services/
    └── testimonial.js
```

Schema requirements:

- Kind: `collectionType`
- Collection name: `testimonials`
- Singular name: `testimonial`
- Plural name: `testimonials`
- Display name: `Testimonial`
- Draft and publish: enabled
- Fields:
  - `quote` (text, required) - The testimonial text
  - `author` (string, required) - Person's name
  - `company` (string) - Company/role
  - `image` (media, single, images only) - Optional photo
  - `order` (integer, default 0, min 0) - Display order
  - `featured` (boolean, default false) - Show on homepage

Use Strapi 4.x core factory pattern for controller, service, and router.

### 2. Create Astro Component

Create `client/src/components/Testimonials.astro`:

- Fetch from `/api/testimonials?populate=image&filters[featured][$eq]=true&sort=order:asc`
- Display in a responsive grid or carousel style
- Show quote, author name, company
- Show image if available (circular avatar style)
- Handle empty state gracefully (hide section if no testimonials)
- Add AOS animations consistent with other sections
- Use DaisyUI card or similar styling

### 3. Add to Homepage

Modify `client/src/pages/index.astro`:

- Import Testimonials component
- Add between Team and Contact sections (or appropriate location)

## Component Design

```html
<section id="testimonials" class="py-16 bg-base-200">
  <h2 class="text-3xl text-center mb-8">What Our Clients Say</h2>
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Testimonial cards -->
    </div>
  </div>
</section>
```

Each testimonial card:

- Quote text (with quotation marks styling)
- Author avatar (if image exists) or initials placeholder
- Author name
- Company/role in lighter text

## Style Requirements

- No TypeScript
- No unnecessary comments
- Follow existing component patterns in the project
- Use DaisyUI classes where appropriate
- Responsive design (1 col mobile, 2 col tablet, 3 col desktop)

```

### Verification
After completion:
1. Restart Strapi
2. Go to Settings → Roles → Public → Testimonial → Enable `find`
3. Create 2-3 testimonials in Strapi admin
4. Mark them as featured
5. Publish
6. Verify testimonials section appears on homepage

---

## Stage 6: Admin User Guide (PDF/Markdown)

**Model:** Claude Sonnet 4.5
**Dependencies:** All previous stages complete
**Files Modified:** 0
**Files Created:** 1

### Prompt

```

Create a comprehensive admin user guide for GeoSolutions Strapi CMS.

## Requirements

Create `docs/admin-user-guide.md` with the following sections:

### 1. Getting Started

- How to access the admin panel (URL)
- Login process
- Dashboard overview
- Navigation explanation

### 2. Content Types Overview

Explain each content type and what it controls:

- **About**: Homepage about section (rich text)
- **Services Page**: Services intro and list items
- **Site Setting**: Footer tagline, contact info
- **Hero**: Homepage banner image
- **Team**: Staff members with photos and order
- **Projects**: Portfolio items with before/after photos
- **Documents**: Publications/downloadable files
- **Testimonials**: Client quotes for homepage

### 3. How to Edit Content

Step-by-step for each common task:

- Editing text content
- Uploading images (with size recommendations)
- Reordering items (using order field)
- Publishing vs saving draft
- Using rich text editor

### 4. Image Guidelines

Recommended sizes:

- Hero banner: 1920x600px
- Team photos: 400x400px (square)
- Project thumbnails: 800x600px
- Testimonial avatars: 200x200px
- Document icons: N/A (auto-generated)

File formats:

- Photos: JPG or WebP (best quality/size)
- Logos: PNG (for transparency)
- Max file size: 5MB recommended

### 5. SEO Best Practices

- Using meta titles (under 60 characters)
- Writing meta descriptions (under 160 characters)
- Adding alt text to images

### 6. Common Tasks

Quick reference for:

- Adding a new team member
- Adding a new project
- Changing contact information
- Adding a testimonial
- Updating the hero image

### 7. Troubleshooting

- Content not appearing: Check if published
- Images not loading: Check file size/format
- Changes not showing: May need page refresh

## Style Requirements

- Clear, non-technical language
- Include screenshots placeholders: `[Screenshot: description]`
- Use numbered steps for procedures
- Use tables where appropriate
- Friendly, helpful tone

````

### Output
The guide will be created at `docs/admin-user-guide.md`.

After creation, you can:
1. Convert to PDF using a markdown-to-PDF tool
2. Add actual screenshots
3. Share with the client

---

## Stage 7: Announcement Banner

**Model:** Claude Sonnet 4.5
**Dependencies:** None
**Files Modified:** 3
**Files Created:** 5

### Prompt

```
Create an Announcement Banner system in Strapi 4.25.5 that allows the client to display promotional messages, holiday closures, or warnings at the top of the website.

## Requirements

### 1. Create Strapi Single Type
Create the full content type structure at `api/src/api/announcement/`:

Directory structure:
```
api/src/api/announcement/
├── content-types/
│   └── announcement/
│       └── schema.json
├── controllers/
│   └── announcement.js
├── routes/
│   └── announcement.js
└── services/
    └── announcement.js
```

Schema requirements:
- Kind: `singleType`
- Collection name: `announcement`
- Singular name: `announcement`
- Plural name: `announcements`
- Display name: `Announcement Banner`
- Draft and publish: disabled (changes apply immediately)
- Fields:
  - `enabled` (boolean, default false) - Toggle banner on/off
  - `message` (text, required) - The announcement text
  - `linkText` (string) - Optional button/link text (e.g., "Learn more")
  - `linkUrl` (string) - Optional URL for the link
  - `backgroundColor` (enumeration: "info", "warning", "error", "success") - Banner style
  - `dismissible` (boolean, default true) - Allow users to close the banner

Use Strapi 4.x core factory pattern for controller, service, and router.

### 2. Create Astro Component
Create `client/src/components/AnnouncementBanner.astro`:

- Fetch from `/api/announcement`
- Only render if `enabled` is true
- Display message with optional link
- Style based on `backgroundColor` value using DaisyUI alert classes:
  - info = alert-info (blue)
  - warning = alert-warning (yellow)
  - error = alert-error (red)
  - success = alert-success (green)
- If dismissible, add close button (uses localStorage to remember dismissal for session)
- Fixed position at top of page, above navbar
- Include client-side JS for dismiss functionality

### 3. Add to Layout
Modify `client/src/layouts/DefaultLayout.astro`:
- Import AnnouncementBanner component
- Add it at the very top of the body, before everything else

### 4. Update Documentation
Update the Strapi documentation plugin to include the new Announcement Banner content type with:
- Field descriptions
- Usage examples

## Component Design
```html
<div id="announcement-banner" class="alert alert-{type} rounded-none fixed top-0 left-0 right-0 z-50">
  <span>{message}</span>
  {linkText && linkUrl && (
    <a href={linkUrl} class="link link-hover font-semibold">{linkText}</a>
  )}
  {dismissible && (
    <button onclick="dismissBanner()" class="btn btn-ghost btn-sm">✕</button>
  )}
</div>
```

## Style Requirements
- No TypeScript
- No unnecessary comments
- Follow existing component patterns
- Banner should push content down, not overlay it
- Smooth animation when dismissed
```

### Verification
After completion:
1. Restart Strapi
2. Go to Settings → Roles → Public → Announcement → Enable `find`
3. Enable the banner and add a test message
4. Save
5. Verify banner appears on website
6. Test dismiss functionality
7. Test different background colors

---

## Stage 8: Editable Hero Content

**Model:** Claude Opus 4.5
**Dependencies:** Stage 5 (Hero already converted to Single Type)
**Files Modified:** 2
**Files Created:** 0

### Prompt

```
Extend the existing Hero single type in Strapi 4.25.5 to include editable text content and button configuration, and update the Astro frontend.

## Current State
Hero single type already exists at `api/src/api/hero/` with a `Banner` media field.

## Requirements

### 1. Update Strapi Schema
Modify `api/src/api/hero/content-types/hero/schema.json` to add:
- `heading` (string) - Main headline text
- `subheading` (text) - Secondary text/tagline
- `buttonText` (string) - CTA button label
- `buttonUrl` (string) - CTA button link URL
- `buttonEnabled` (boolean, default true) - Show/hide the button

Keep the existing `Banner` media field.

### 2. Update Astro Hero Component
Modify `client/src/components/Hero.astro`:
- Fetch the new fields along with Banner
- Display heading and subheading from Strapi
- Render button with configurable text and URL
- Keep existing fallback values:
  - Heading: "GeoSolutions"
  - Subheading: "Specialist Geotechnical Consultancy"
  - Button text: "Contact Us"
  - Button URL: "#contact"
- Maintain existing styling and image handling

### 3. Update Documentation
Update the Strapi documentation plugin to reflect the new Hero fields with:
- Field descriptions and character limits
- Examples of good headlines

## Fallback Values
- Heading: "GeoSolutions"
- Subheading: "Specialist Geotechnical Consultancy"
- Button Text: "Contact Us"
- Button URL: "#contact"

## Style Requirements
- No TypeScript
- No unnecessary comments
- Strapi schema must be valid JSON (no trailing commas)
- Maintain existing Hero.astro styling
```

### Verification
After completion:
1. Restart Strapi
2. Go to Content Manager → Hero
3. Add heading, subheading, and button text
4. Save and publish
5. Verify hero section displays the new content
6. Test button links correctly

---

## Stage 9: Update Documentation Plugin

**Model:** Claude Sonnet 4.5
**Dependencies:** Stages 7-8 complete
**Files Modified:** 1+
**Files Created:** 0

### Prompt

```
Update the Strapi documentation plugin to include all new content types and fields added in Phase 2.

## Requirements

### 1. Find and Update Plugin Documentation
Locate the documentation plugin files (likely in `api/src/plugins/` or similar) and update to include:

### 2. New Content Types to Document

**Announcement Banner**
| Field | Type | Description |
|-------|------|-------------|
| enabled | Boolean | Toggle the banner on/off site-wide |
| message | Text | The announcement message to display |
| linkText | String | Optional call-to-action link text |
| linkUrl | String | URL for the optional link |
| backgroundColor | Enum | Banner style: info (blue), warning (yellow), error (red), success (green) |
| dismissible | Boolean | Allow visitors to close the banner |

**Usage Examples:**
- Holiday closure: "We're closed Dec 25-Jan 2. Emergency contact: 027 898 6000"
- Promotion: "Free site assessments this month!" with link to contact
- Warning: "Weather delays may affect current projects"

**Testimonial**
| Field | Type | Description |
|-------|------|-------------|
| quote | Text | The testimonial text |
| author | String | Client's name |
| company | String | Company or role |
| image | Media | Optional profile photo (200x200px) |
| order | Integer | Display order (lower = first) |
| featured | Boolean | Show on homepage |

### 3. Updated Content Types

**Hero** (updated fields)
| Field | Type | Description |
|-------|------|-------------|
| Banner | Media | Hero background image (1920x600px recommended) |
| heading | String | Main headline (keep under 50 chars) |
| subheading | Text | Secondary tagline (keep under 100 chars) |
| buttonText | String | CTA button label |
| buttonUrl | String | Button destination URL |
| buttonEnabled | Boolean | Show/hide the button |

**Site Setting** (updated fields)
| Field | Type | Description |
|-------|------|-------------|
| footerTagline | Text | Footer description text |
| phoneNumber | String | Contact phone number |
| primaryEmail | Email | Main contact email |
| secondaryEmail | Email | Secondary contact email |
| address | Text | Physical address |

### 4. SEO Component
| Field | Type | Description |
|-------|------|-------------|
| metaTitle | String | Page title for search engines (max 60 chars) |
| metaDescription | Text | Page description for search engines (max 160 chars) |
| ogImage | Media | Image for social media sharing |

**Added to:** Projects, Documents, About

## Style Requirements
- Clear, consistent formatting
- Include character limits where relevant
- Add practical usage examples
- Non-technical language for client understanding
```

### Verification
After completion:
1. Review documentation plugin output
2. Verify all new content types are documented
3. Check field descriptions are clear
4. Ensure examples are helpful

---

## Post-Phase 2 Checklist

### Strapi Admin
- [ ] Custom logo appears on login page
- [ ] Custom logo appears in sidebar
- [ ] Green brand color visible in UI
- [ ] All new content types accessible
- [ ] Permissions set for Public role

### Content Setup
- [ ] Contact info entered in Site Setting
- [ ] At least one testimonial created and featured
- [ ] SEO data added to key pages
- [ ] Hero text and button configured
- [ ] Announcement banner tested (can leave disabled)

### Frontend
- [ ] Contact section shows Strapi data
- [ ] Testimonials section displays
- [ ] robots.txt accessible
- [ ] Sitemap generates correctly
- [ ] Meta tags appear in page source
- [ ] Hero displays custom heading/subheading/button
- [ ] Announcement banner shows when enabled
- [ ] Announcement dismiss works correctly

### Documentation
- [ ] Admin guide created
- [ ] Documentation plugin updated with all new content types
- [ ] Screenshots added (optional)
- [ ] Guide shared with client

---

## Package Installation Summary

Before starting, install these in the client folder:

```bash
cd client
npm install @astrojs/sitemap
````

No additional packages needed for Strapi.

---

## Environment Variables to Add

### client/.env

```
PUBLIC_SITE_URL=https://geosolutions.nz
```

### docker-compose.yml (for production)

Add to astro-app environment:

```
PUBLIC_SITE_URL=https://geosolutions.nz
```

---

## Troubleshooting

### Admin branding not appearing

- Run `npm run build` in api folder after adding files
- Restart Strapi completely
- Check image paths are correct

### Sitemap not generating

- Ensure `site` is set in astro.config.mjs
- Check PUBLIC_SITE_URL environment variable
- Sitemap only includes static routes in SSR mode

### SEO component not showing in Strapi

- Ensure `api/src/components/shared/` directory exists
- Check component path in schema: `shared.seo`
- Restart Strapi after creating components

### Testimonials not displaying

- Check Public role has `find` permission for Testimonial
- Ensure testimonials are marked as `featured: true`
- Ensure testimonials are published

### Announcement banner not appearing

- Check Public role has `find` permission for Announcement
- Ensure `enabled` is set to `true` in Strapi
- Check browser console for fetch errors
- Clear localStorage if testing dismiss functionality

### Hero content not updating

- Ensure Hero is published (if draftAndPublish enabled)
- Check the fetch includes new fields in populate
- Verify fallback logic isn't overriding Strapi values

---

## Final Delivery Checklist

- [ ] All stages completed and tested
- [ ] Actual logo files added to Strapi admin
- [ ] Admin guide reviewed and screenshots added
- [ ] Client walkthrough scheduled
- [ ] Handover documentation complete
