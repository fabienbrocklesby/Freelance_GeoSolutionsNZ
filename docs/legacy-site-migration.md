# Legacy Site Migration (No Admin Access)

Use the public site and public Strapi endpoints to extract current live content without old admin access.

## Why this works

`https://geosolutions.nz` currently exposes public Strapi REST endpoints for:

- `/api/projects`
- `/api/teams`
- `/api/documents`
- `/api/heroes`

The remaining singleton text blocks (`about`, `services`, `site settings`) are extracted from the homepage HTML as a fallback.

## Run the exporter

From the repository root:

```bash
node scripts/export-legacy-site.mjs --out-dir migration-output/legacy-site-export
```

Or via Make (recommended):

```bash
make migrate-export-local
```

Production profile:

```bash
make migrate-export-prod
```

Optional flags:

- `--base-url https://geosolutions.nz`
- `--page-size 100`
- `--timeout-ms 30000`
- `--skip-media` (skip downloading files/images)

## Import into your new Strapi

Create a Strapi API token in your new admin (`Settings -> API Tokens`) with full access to content and upload.

Preview actions first:

```bash
node scripts/import-legacy-to-strapi.mjs \
  --seed migration-output/legacy-site-export/strapi-seed.legacy.json \
  --strapi-url https://your-new-strapi-domain \
  --dry-run
```

Or via Make:

```bash
make migrate-import-local-dry
make migrate-import-prod-dry
```

Run the real import:

```bash
STRAPI_API_TOKEN=your_token_here \
node scripts/import-legacy-to-strapi.mjs \
  --seed migration-output/legacy-site-export/strapi-seed.legacy.json \
  --strapi-url https://your-new-strapi-domain
```

Or via Make:

```bash
make migrate-import-local
make migrate-import-prod
```

Optional flags:

- `--media-dir migration-output/legacy-site-export/media`
- `--media-map migration-output/legacy-site-export/media-download-results.json`
- `--skip-media` (import text/data only)
- `--timeout-ms 30000`

## Environment variables (local + production)

These are now supported by both scripts and Make targets:

- `LEGACY_SITE_URL`
- `MIGRATION_OUTPUT_DIR`
- `MIGRATION_SEED_PATH`
- `MIGRATION_MEDIA_DIR`
- `MIGRATION_MEDIA_MAP_PATH`
- `MIGRATION_PAGE_SIZE`
- `MIGRATION_TIMEOUT_MS`
- `MIGRATION_STRAPI_URL`
- `MIGRATION_STRAPI_TOKEN`
- `MIGRATION_EXPORT_ARGS` (extra exporter flags)
- `MIGRATION_IMPORT_ARGS` (extra importer flags)

Set local defaults in `.env.development` and production defaults in `.env.vps`.

## Output files

The script writes to your chosen `--out-dir`:

- `strapi-seed.legacy.json`: Strapi-ready payload mapped to your current content types.
- `raw/`: raw endpoint responses and homepage HTML snapshot.
- `media-manifest.json`: all media URLs referenced by content.
- `media/`: downloaded media files.
- `media-download-results.json`: download status for each media URL.
- `migration-report.md`: summary counts and manual follow-up items.

## What is mapped automatically

- `api::hero.hero`
- `api::about.about`
- `api::services-page.services-page`
- `api::site-setting.site-setting`
- `api::team.team`
- `api::project.project`
- `api::document.document`

## Manual follow-up

- Announcement banner and testimonials are not publicly available and are not auto-filled.
- Team bios are not present on the legacy public site, so they are left blank.
- After import, verify rich text formatting and media assignment in Strapi admin.
