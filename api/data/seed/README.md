# Strapi Seed Data

This folder contains seed data for development environments.

## How to Export (after setting up content manually once)

1. Go to Strapi Admin Panel → Content Manager
2. For each content type (Hero, Team, Project, Document):
   - Click the content type
   - Select all entries
   - Click "Export" (provided by strapi-plugin-import-export-entries)
   - Export as JSON with media
   - Save the file here as `{content-type}.json`

Or use the CLI:

```bash
# Inside the api container
npm run strapi export -- --no-encrypt -f data/seed/export
```

## How to Import (for new dev environments)

### Option 1: Via Admin Panel

1. Go to Strapi Admin Panel → Content Manager
2. Click "Import" for each content type
3. Upload the corresponding JSON file

### Option 2: Via CLI

```bash
# Inside the api container
npm run strapi import -- -f data/seed/export.tar.gz
```

### Option 3: Run the seed script (recommended)

```bash
# From repo root
make seed-db
```

## Required Content for Frontend

The frontend requires at minimum:

### Hero (1 entry)

- Banner: Image file (hero background)

### Team (1+ entries)

- name: String
- role: String
- image: Team member photo
- email: Optional

### Project (1+ entries)

- title: String
- description: Text
- thumbnail: Project thumbnail image
- beforePhoto: Before image
- afterPhoto: After image
- startDate: Date
- endDate: Date

### Document (optional, for /publications)

- title: String
- description: Text
- file: PDF/document OR url: External link
