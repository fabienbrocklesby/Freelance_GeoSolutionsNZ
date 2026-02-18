# GeoSolutions: Additional Improvements

> **Context:** Core refactor complete in 30 mins. Budget allows for significant additional value.  
> **Goal:** Make Strapi feel like a proper CMS upgrade, improve site quality.

---

## Quick Wins (15-30 mins each)

### 1. Contact Information in Strapi

**Current:** Hard-coded in `Contact.astro` (phone, emails)  
**Improvement:** Add to Site Settings single type

```
Fields to add:
- phoneNumber (string)
- primaryEmail (email)
- secondaryEmail (email)
```

**Value:** Client can update contact info without developer

---

### 2. Custom Strapi Admin Branding

**Current:** Default Strapi branding  
**Improvement:** Custom logo, favicon, and colors in admin panel

```
Files:
- api/src/admin/app.js (create from app.example.js)
- Add GeoSolutions logo to admin
- Set primary color to match brand (#2db875)
```

**Value:** Feels like their own system, not generic CMS

---

### 3. SEO Meta Fields on All Content Types

**Current:** No SEO fields  
**Improvement:** Add to Projects, Documents, and page single types

```
Fields to add (as component for reuse):
- metaTitle (string, max 60)
- metaDescription (text, max 160)
- ogImage (media)
```

**Value:** Better Google rankings, professional social sharing

---

### 4. Navigation Menu in Strapi

**Current:** Hard-coded in `Navbar.astro`  
**Improvement:** Editable navigation items

```
New content type: Navigation
- items (repeatable component)
  - label (string)
  - url (string)
  - order (integer)
  - openInNewTab (boolean)
```

**Value:** Client can add/remove/reorder menu items

---

### 5. Social Links in Strapi

**Current:** Not present (or hard-coded if any)  
**Improvement:** Add to Site Settings

```
Fields:
- facebookUrl (string)
- linkedinUrl (string)
- instagramUrl (string)
```

**Value:** Easy social profile management

---

## Medium Effort (30-60 mins each)

### 6. Project Categories/Tags

**Current:** Projects have no categorization  
**Improvement:** Add filterable categories

```
New content type: Project Category
- name (string)
- slug (string)

Add relation to Project:
- category (many-to-one with Project Category)
```

**Frontend:** Filter projects by category on projects page

**Value:** Better organization as portfolio grows

---

### 7. Testimonials Section

**Current:** Doesn't exist  
**Improvement:** New content type + frontend section

```
New content type: Testimonial
- quote (text, required)
- author (string)
- company (string)
- image (media)
- order (integer)
- featured (boolean)
```

**Value:** Social proof, builds trust with potential clients

---

### 8. Call-to-Action Banners

**Current:** No CTAs except contact section  
**Improvement:** Configurable CTA component

```
New content type: CTA Banner (Single Type)
- heading (string)
- subheading (text)
- buttonText (string)
- buttonUrl (string)
- enabled (boolean)
```

**Value:** Promote specific services, seasonal offers

---

### 9. FAQ Section

**Current:** Doesn't exist  
**Improvement:** New content type + frontend section

```
New content type: FAQ
- question (string, required)
- answer (richtext, required)
- category (string)
- order (integer)
```

**Frontend:** Accordion-style FAQ section with schema.org markup

**Value:** Reduces support inquiries, great for SEO

---

### 10. Image Gallery for Projects

**Current:** Projects have beforePhoto/afterPhoto only  
**Improvement:** Add gallery component

```
Add to Project schema:
- gallery (media, multiple: true)
```

**Frontend:** Lightbox gallery on project detail pages

**Value:** Better project showcasing

---

## Performance & SEO (30-60 mins total)

### 11. Performance Optimizations

- [ ] Add image lazy loading attributes
- [ ] Preload critical fonts
- [ ] Add `<link rel="preconnect">` for Strapi domain
- [ ] Minify inline CSS/JS
- [ ] Add service worker for offline support (optional)

### 12. SEO Enhancements

- [ ] Add `robots.txt` to Astro public folder
- [ ] Generate `sitemap.xml` (Astro has integration)
- [ ] Add canonical URLs to all pages
- [ ] Add Open Graph meta tags
- [ ] Add Twitter Card meta tags
- [ ] Add JSON-LD structured data for:
  - Organization
  - LocalBusiness
  - Service
  - FAQPage (if FAQ added)

### 13. Accessibility Improvements

- [ ] Audit color contrast ratios
- [ ] Add skip-to-content link
- [ ] Ensure all images have alt text (enforce in Strapi)
- [ ] Add ARIA labels where needed
- [ ] Keyboard navigation testing

---

## Admin Experience (15-30 mins each)

### 14. Content Preview Links

**Improvement:** Add preview button in Strapi admin that opens frontend

```
Strapi customization to add "View on site" links
```

**Value:** Editors can quickly check their changes

---

### 15. Required Field Indicators

**Improvement:** Add helpful descriptions to all Strapi fields

```
Example:
- description: "Displayed on the homepage. Keep under 200 characters."
```

**Value:** Reduces confusion, fewer support questions

---

### 16. Media Library Organization

**Improvement:** Set up folder structure in Strapi media library

```
Folders:
- Team Photos
- Project Images
- Documents
- Site Assets
```

**Value:** Easier to find and manage uploads

---

### 17. User Roles Setup

**Current:** Probably just one admin  
**Improvement:** Create Editor role with limited permissions

```
Editor role:
- Can edit content
- Cannot delete content types
- Cannot access settings
```

**Value:** Safe for staff to use without breaking things

---

## Documentation & Training

### 18. Admin User Guide

**Create:** Simple PDF or markdown guide

```
Contents:
- How to log in
- How to edit each section
- How to upload images (with size recommendations)
- How to publish/unpublish
- Common mistakes to avoid
```

**Value:** Client independence, fewer support calls

---

### 19. Content Style Guide

**Create:** Guidelines for consistent content

```
Contents:
- Image dimensions for each area
- Recommended text lengths
- Tone of voice guidelines
```

**Value:** Professional, consistent content

---

## Recommendation Priority

### Must Do (High Value, Low Effort)

1. ✅ Contact Information in Strapi
2. ✅ Custom Strapi Admin Branding
3. ✅ SEO Meta Fields
4. ✅ Performance Optimizations
5. ✅ Admin User Guide

### Should Do (High Value, Medium Effort)

6. ⭐ Testimonials Section
7. ⭐ FAQ Section
8. ⭐ Navigation Menu in Strapi
9. ⭐ Social Links

### Nice to Have (If Time Permits)

10. Project Categories
11. Image Gallery
12. CTA Banners
13. User Roles Setup

---

## Estimated Additional Time

| Category              | Items   | Time Estimate    |
| --------------------- | ------- | ---------------- |
| Quick Wins            | 5 items | 1.5-2.5 hours    |
| Medium Effort         | 5 items | 2.5-5 hours      |
| Performance/SEO       | All     | 1-2 hours        |
| Admin Experience      | 4 items | 1-2 hours        |
| Documentation         | 2 items | 1-2 hours        |
| **Total if all done** |         | **7-13.5 hours** |

---

## My Recommendations

For $1250 NZD, I'd implement:

1. **Contact Info in Strapi** (makes Site Settings complete)
2. **Custom Admin Branding** (huge perceived value)
3. **SEO Meta Component** (professional touch)
4. **Sitemap + robots.txt** (SEO basics)
5. **Testimonials Section** (new feature, high value)
6. **Admin User Guide** (empowers client)

This would take ~3-4 hours additional and deliver significant visible value.
