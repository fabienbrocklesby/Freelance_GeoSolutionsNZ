#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";

const DEFAULT_STRAPI_URL =
  process.env.MIGRATION_STRAPI_URL ||
  process.env.STRAPI_URL ||
  process.env.STRAPI_PUBLIC_URL ||
  "http://localhost:1337";
const DEFAULT_TIMEOUT_MS = Number.parseInt(process.env.MIGRATION_TIMEOUT_MS || "30000", 10);

const SINGLE_TYPES = [
  { uid: "api::hero.hero", endpoint: "hero", mediaFields: ["Banner"] },
  { uid: "api::about.about", endpoint: "about", mediaFields: [] },
  { uid: "api::services-page.services-page", endpoint: "services-page", mediaFields: [] },
  { uid: "api::site-setting.site-setting", endpoint: "site-setting", mediaFields: [] },
];

const COLLECTION_TYPES = [
  {
    uid: "api::team.team",
    endpoint: "teams",
    mediaFields: ["image"],
    uniqueCandidates: ["email", "name"],
  },
  {
    uid: "api::project.project",
    endpoint: "projects",
    mediaFields: ["thumbnail", "beforePhoto", "afterPhoto"],
    uniqueCandidates: ["title"],
  },
  {
    uid: "api::document.document",
    endpoint: "documents",
    mediaFields: ["file"],
    uniqueCandidates: ["url", "title"],
  },
];

function printHelp() {
  console.log(`Usage: node scripts/import-legacy-to-strapi.mjs [options]

Options:
  --seed <path>          Path to strapi-seed.legacy.json
  --strapi-url <url>     Strapi URL (default: ${DEFAULT_STRAPI_URL})
  --token <token>        Strapi API token (or set MIGRATION_STRAPI_TOKEN / STRAPI_API_TOKEN)
  --media-dir <path>     Local media folder fallback (default: <seed-dir>/media)
  --media-map <path>     media-download-results.json (default: <seed-dir>/media-download-results.json)
  --skip-media           Do not upload media fields
  --dry-run              Print intended actions without writing to Strapi
  --timeout-ms <ms>      HTTP timeout in ms (default: ${DEFAULT_TIMEOUT_MS})
  --help, -h             Show help
`);
}

function parseArgs(argv) {
  const options = {
    seedPath: path.resolve(
      process.cwd(),
      process.env.MIGRATION_SEED_PATH || "migration-output/legacy-site-export/strapi-seed.legacy.json",
    ),
    strapiUrl: DEFAULT_STRAPI_URL,
    token: process.env.MIGRATION_STRAPI_TOKEN || process.env.STRAPI_API_TOKEN || "",
    mediaDir: "",
    mediaMapPath: "",
    skipMedia: false,
    dryRun: false,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--seed":
        options.seedPath = path.resolve(process.cwd(), argv[++i]);
        break;
      case "--strapi-url":
        options.strapiUrl = argv[++i];
        break;
      case "--token":
        options.token = argv[++i];
        break;
      case "--media-dir":
        options.mediaDir = path.resolve(process.cwd(), argv[++i]);
        break;
      case "--media-map":
        options.mediaMapPath = path.resolve(process.cwd(), argv[++i]);
        break;
      case "--skip-media":
        options.skipMedia = true;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--timeout-ms":
        options.timeoutMs = Number.parseInt(argv[++i], 10);
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1000) {
    throw new Error("--timeout-ms must be >= 1000");
  }

  if (!options.mediaDir) {
    if (process.env.MIGRATION_MEDIA_DIR) {
      options.mediaDir = path.resolve(process.cwd(), process.env.MIGRATION_MEDIA_DIR);
    }
  }
  if (!options.mediaDir) {
    options.mediaDir = path.resolve(path.dirname(options.seedPath), "media");
  }
  if (!options.mediaMapPath) {
    if (process.env.MIGRATION_MEDIA_MAP_PATH) {
      options.mediaMapPath = path.resolve(process.cwd(), process.env.MIGRATION_MEDIA_MAP_PATH);
    }
  }
  if (!options.mediaMapPath) {
    options.mediaMapPath = path.resolve(path.dirname(options.seedPath), "media-download-results.json");
  }

  return options;
}

function normalizeUrl(baseUrl) {
  return baseUrl.replace(/\/$/, "");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function mimeFromFileName(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".txt": "text/plain",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
  };
  return map[ext] || "application/octet-stream";
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

class StrapiClient {
  constructor({ baseUrl, token, timeoutMs }) {
    this.baseUrl = normalizeUrl(baseUrl);
    this.token = token;
    this.timeoutMs = timeoutMs;
  }

  async request(method, apiPath, { json, formData } = {}) {
    const url = `${this.baseUrl}${apiPath}`;
    const headers = {
      Accept: "application/json",
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    if (json) headers["Content-Type"] = "application/json";

    const response = await fetchWithTimeout(
      url,
      {
        method,
        headers,
        body: json ? JSON.stringify(json) : formData || undefined,
      },
      this.timeoutMs,
    );

    const text = await response.text();
    const parsed = text ? safeJsonParse(text) : null;

    if (!response.ok) {
      const message =
        parsed?.error?.message ||
        parsed?.message ||
        text.slice(0, 300) ||
        `HTTP ${response.status}`;
      throw new Error(`${method} ${apiPath} failed (${response.status}): ${message}`);
    }

    return parsed;
  }
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clampText(value, maxLength) {
  if (typeof value !== "string") return value;
  if (value.length <= maxLength) return value;
  if (maxLength <= 3) return value.slice(0, maxLength);
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function sanitizeSeoFields(payload) {
  if (!payload || typeof payload !== "object" || !payload.seo || typeof payload.seo !== "object") {
    return 0;
  }
  let clamped = 0;
  const originalTitle = payload.seo.metaTitle;
  const originalDescription = payload.seo.metaDescription;
  payload.seo.metaTitle = clampText(payload.seo.metaTitle, 60);
  payload.seo.metaDescription = clampText(payload.seo.metaDescription, 160);
  if (typeof originalTitle === "string" && payload.seo.metaTitle !== originalTitle) clamped += 1;
  if (typeof originalDescription === "string" && payload.seo.metaDescription !== originalDescription) clamped += 1;
  return clamped;
}

function pickUniqueField(entry, candidates) {
  for (const key of candidates) {
    const value = entry[key];
    if (typeof value === "string" && value.trim()) return { key, value: value.trim() };
  }
  return null;
}

async function findExistingCollectionEntry(client, endpoint, uniqueField) {
  if (!uniqueField) return null;

  const url = new URL(`/api/${endpoint}`, `${client.baseUrl}/`);
  url.searchParams.set("pagination[pageSize]", "1");
  url.searchParams.set("fields[0]", "id");
  url.searchParams.set("publicationState", "preview");
  url.searchParams.set(`filters[${uniqueField.key}][$eq]`, uniqueField.value);

  const response = await client.request("GET", `${url.pathname}${url.search}`);
  const row = Array.isArray(response?.data) ? response.data[0] : null;
  return row?.id ?? null;
}

async function loadSeed(seedPath) {
  const raw = await fs.readFile(seedPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed?.data || typeof parsed.data !== "object") {
    throw new Error(`Invalid seed file: ${seedPath}`);
  }
  return parsed;
}

async function loadMediaMap(mediaMapPath, seedDir) {
  if (!(await fileExists(mediaMapPath))) return new Map();
  const parsed = JSON.parse(await fs.readFile(mediaMapPath, "utf8"));
  const rows = Array.isArray(parsed?.files) ? parsed.files : [];
  const byUrl = new Map();

  for (const row of rows) {
    if (row?.status !== "downloaded" || !row?.url || !row?.file) continue;
    byUrl.set(row.url, path.resolve(seedDir, row.file));
  }
  return byUrl;
}

async function readMediaSource(media, options, mediaMapByUrl) {
  const mediaUrl = media?.url;
  if (!mediaUrl) return null;

  const mapped = mediaMapByUrl.get(mediaUrl);
  if (mapped && (await fileExists(mapped))) {
    const buffer = await fs.readFile(mapped);
    return { buffer, fileName: path.basename(mapped), source: mapped };
  }

  const baseName = path.basename(new URL(mediaUrl).pathname);
  const mediaDirCandidate = path.resolve(options.mediaDir, baseName);
  if (await fileExists(mediaDirCandidate)) {
    const buffer = await fs.readFile(mediaDirCandidate);
    return { buffer, fileName: baseName, source: mediaDirCandidate };
  }

  const response = await fetchWithTimeout(
    mediaUrl,
    {
      headers: {
        Accept: "*/*",
      },
    },
    options.timeoutMs,
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Download failed (${response.status}) for ${mediaUrl}: ${text.slice(0, 200)}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, fileName: baseName || media.name || "upload.bin", source: mediaUrl };
}

async function uploadMediaIfNeeded(client, media, context, state) {
  if (!media?.url) return null;
  if (state.options.skipMedia) return null;

  if (state.uploadByUrl.has(media.url)) {
    return state.uploadByUrl.get(media.url);
  }

  if (state.options.dryRun) {
    state.summary.mediaPlanned += 1;
    return null;
  }

  const mediaSource = await readMediaSource(media, state.options, state.mediaMapByUrl);
  if (!mediaSource) return null;

  const form = new FormData();
  const contentType = mimeFromFileName(mediaSource.fileName);
  const blob = new Blob([mediaSource.buffer], { type: contentType });
  form.append("files", blob, mediaSource.fileName);

  const uploaded = await client.request("POST", "/api/upload", { formData: form });
  const id = Array.isArray(uploaded) && uploaded.length > 0 ? uploaded[0].id : null;
  if (!id) {
    throw new Error(`Upload returned no file id for ${context.uid}.${context.field}`);
  }

  state.uploadByUrl.set(media.url, id);
  state.summary.mediaUploaded += 1;
  return id;
}

async function normalizeEntryForWrite(entry, mediaFields, uid, state, client) {
  const payload = deepClone(entry);
  delete payload.id;
  state.summary.seoClamped += sanitizeSeoFields(payload);

  for (const field of mediaFields) {
    if (!(field in payload)) continue;
    const media = payload[field];
    if (!media) {
      payload[field] = null;
      continue;
    }

    const mediaId = await uploadMediaIfNeeded(client, media, { uid, field }, state);
    payload[field] = mediaId;
  }

  return payload;
}

async function upsertSingleTypes(seed, client, state) {
  for (const type of SINGLE_TYPES) {
    const rows = seed.data[type.uid] || [];
    if (rows.length === 0) continue;

    const entry = rows[0];
    const payload = await normalizeEntryForWrite(entry, type.mediaFields, type.uid, state, client);

    if (state.options.dryRun) {
      console.log(`[dry-run] PUT /api/${type.endpoint}`);
      state.summary.singleUpdated += 1;
      continue;
    }

    await client.request("PUT", `/api/${type.endpoint}`, { json: { data: payload } });
    console.log(`Updated single type: ${type.uid}`);
    state.summary.singleUpdated += 1;
  }
}

async function upsertCollections(seed, client, state) {
  for (const type of COLLECTION_TYPES) {
    const rows = seed.data[type.uid] || [];
    for (const row of rows) {
      const payload = await normalizeEntryForWrite(row, type.mediaFields, type.uid, state, client);
      const uniqueField = pickUniqueField(payload, type.uniqueCandidates);
      const uniqueDescription = uniqueField ? `${uniqueField.key}="${uniqueField.value}"` : "no unique field";

      if (state.options.dryRun) {
        console.log(`[dry-run] UPSERT /api/${type.endpoint} (${uniqueDescription})`);
        state.summary.collectionPlanned += 1;
        continue;
      }

      const existingId = await findExistingCollectionEntry(client, type.endpoint, uniqueField);
      if (existingId) {
        await client.request("PUT", `/api/${type.endpoint}/${existingId}`, { json: { data: payload } });
        console.log(`Updated ${type.uid} id=${existingId} (${uniqueDescription})`);
        state.summary.collectionUpdated += 1;
      } else {
        await client.request("POST", `/api/${type.endpoint}`, { json: { data: payload } });
        console.log(`Created ${type.uid} (${uniqueDescription})`);
        state.summary.collectionCreated += 1;
      }
    }
  }
}

// Actions to enable on the Public role.
// Each entry: [plugin_uid, controller, action]
const PUBLIC_PERMISSIONS = [
  // Core content - single types
  ["api::hero", "hero", "find"],
  ["api::about", "about", "find"],
  ["api::services-page", "services-page", "find"],
  ["api::site-setting", "site-setting", "find"],
  // Core content - collection types
  ["api::team", "team", "find"],
  ["api::team", "team", "findOne"],
  ["api::project", "project", "find"],
  ["api::project", "project", "findOne"],
  ["api::document", "document", "find"],
  ["api::document", "document", "findOne"],
  ["api::testimonial", "testimonial", "find"],
  ["api::testimonial", "testimonial", "findOne"],
  // Upload plugin (needed for media)
  ["plugin::upload", "content-api", "find"],
  ["plugin::upload", "content-api", "findOne"],
];

async function configurePublicPermissions(client, dryRun) {
  console.log("\nConfiguring public role permissions...");

  if (dryRun) {
    console.log("  [dry-run] Would enable the following public permissions:");
    for (const [plugin, controller, action] of PUBLIC_PERMISSIONS) {
      console.log(`    ${plugin}.${controller}.${action}`);
    }
    return;
  }

  // Fetch all roles to find the Public role id
  const rolesData = await client.request("GET", "/api/users-permissions/roles");
  const publicRole = (rolesData?.roles || []).find((r) => r.type === "public");
  if (!publicRole) {
    console.warn("  Could not find Public role — skipping permissions config.");
    return;
  }

  // Fetch the full role with its current permissions
  const roleData = await client.request("GET", `/api/users-permissions/roles/${publicRole.id}`);
  const currentPermissions = roleData?.role?.permissions || {};

  // Deep-clone so we can mutate safely
  const updatedPermissions = JSON.parse(JSON.stringify(currentPermissions));

  for (const [plugin, controller, action] of PUBLIC_PERMISSIONS) {
    if (!updatedPermissions[plugin]) updatedPermissions[plugin] = { controllers: {} };
    if (!updatedPermissions[plugin].controllers[controller]) {
      updatedPermissions[plugin].controllers[controller] = {};
    }
    updatedPermissions[plugin].controllers[controller][action] = { enabled: true, policy: "" };
  }

  await client.request("PUT", `/api/users-permissions/roles/${publicRole.id}`, {
    json: { permissions: updatedPermissions },
  });

  console.log(`  Enabled ${PUBLIC_PERMISSIONS.length} public permissions on role id=${publicRole.id}.`);
}

function validateOptions(options) {
  if (options.dryRun) return;
  if (!options.token) {
    throw new Error("Missing Strapi API token. Pass --token or set STRAPI_API_TOKEN.");
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  validateOptions(options);

  const seed = await loadSeed(options.seedPath);
  const seedDir = path.dirname(options.seedPath);
  const mediaMapByUrl = await loadMediaMap(options.mediaMapPath, seedDir);

  const client = new StrapiClient({
    baseUrl: options.strapiUrl,
    token: options.token,
    timeoutMs: options.timeoutMs,
  });

  const state = {
    options,
    mediaMapByUrl,
    uploadByUrl: new Map(),
    summary: {
      singleUpdated: 0,
      collectionCreated: 0,
      collectionUpdated: 0,
      collectionPlanned: 0,
      mediaUploaded: 0,
      mediaPlanned: 0,
      seoClamped: 0,
    },
  };

  console.log(`Import seed: ${options.seedPath}`);
  console.log(`Target Strapi: ${options.strapiUrl}`);
  if (options.dryRun) console.log("Mode: dry-run (no writes)");

  await upsertSingleTypes(seed, client, state);
  await upsertCollections(seed, client, state);
  await configurePublicPermissions(client, options.dryRun);

  console.log("\nImport summary:");
  console.log(`- Single types updated: ${state.summary.singleUpdated}`);
  console.log(`- Collection created: ${state.summary.collectionCreated}`);
  console.log(`- Collection updated: ${state.summary.collectionUpdated}`);
  if (options.dryRun) {
    console.log(`- Collection planned: ${state.summary.collectionPlanned}`);
    console.log(`- Media planned: ${state.summary.mediaPlanned}`);
  } else {
    console.log(`- Media uploaded: ${state.summary.mediaUploaded}`);
  }
  console.log(`- SEO fields clamped: ${state.summary.seoClamped}`);
}

main().catch((error) => {
  console.error("Import failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
