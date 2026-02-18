#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = process.env.LEGACY_SITE_URL || "https://geosolutions.nz";
const DEFAULT_PAGE_SIZE = Number.parseInt(process.env.MIGRATION_PAGE_SIZE || "100", 10);
const DEFAULT_TIMEOUT_MS = Number.parseInt(process.env.MIGRATION_TIMEOUT_MS || "30000", 10);

const COLLECTION_ENDPOINTS = [
  { endpoint: "projects", uid: "api::project.project", mediaFields: ["thumbnail", "beforePhoto", "afterPhoto"] },
  { endpoint: "teams", uid: "api::team.team", mediaFields: ["image"] },
  { endpoint: "documents", uid: "api::document.document", mediaFields: ["file"] },
  { endpoint: "heroes", uid: "api::hero.hero", mediaFields: ["Banner"] },
];

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    outDir: path.resolve(
      process.cwd(),
      process.env.MIGRATION_OUTPUT_DIR || path.join("migration-output", "legacy-site-export"),
    ),
    pageSize: DEFAULT_PAGE_SIZE,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    downloadMedia: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--base-url":
        options.baseUrl = argv[++i];
        break;
      case "--out-dir":
        options.outDir = path.resolve(process.cwd(), argv[++i]);
        break;
      case "--page-size":
        options.pageSize = Number.parseInt(argv[++i], 10);
        break;
      case "--timeout-ms":
        options.timeoutMs = Number.parseInt(argv[++i], 10);
        break;
      case "--skip-media":
        options.downloadMedia = false;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(options.pageSize) || options.pageSize < 1) {
    throw new Error("--page-size must be a positive integer");
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1000) {
    throw new Error("--timeout-ms must be >= 1000");
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/export-legacy-site.mjs [options]

Options:
  --base-url <url>      Legacy site URL (default: ${DEFAULT_BASE_URL})
  --out-dir <path>      Output directory (default: migration-output/legacy-site-export)
  --page-size <number>  API pagination size (default: ${DEFAULT_PAGE_SIZE})
  --timeout-ms <ms>     HTTP timeout in ms (default: ${DEFAULT_TIMEOUT_MS})
  --skip-media          Skip media file downloads
  --help, -h            Show this help
`);
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GeoSolutions-Legacy-Exporter/1.0",
        Accept: "*/*",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson(url, timeoutMs) {
  const response = await fetchWithTimeout(url, timeoutMs);
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${url}: ${body.slice(0, 300)}`);
  }
  return response.json();
}

async function fetchText(url, timeoutMs) {
  const response = await fetchWithTimeout(url, timeoutMs);
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${url}: ${body.slice(0, 300)}`);
  }
  return response.text();
}

async function fetchCollection(baseUrl, endpoint, pageSize, timeoutMs) {
  const items = [];
  const pages = [];
  let page = 1;

  while (true) {
    const url = new URL(`/api/${endpoint}`, baseUrl);
    url.searchParams.set("pagination[page]", String(page));
    url.searchParams.set("pagination[pageSize]", String(pageSize));
    url.searchParams.set("populate", "*");

    const response = await fetchWithTimeout(url, timeoutMs);
    if (response.status === 404 || response.status === 403) {
      return {
        ok: false,
        status: response.status,
        endpoint,
        error: await response.text().catch(() => ""),
      };
    }
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} for ${url}: ${body.slice(0, 300)}`);
    }

    const payload = await response.json();
    const pageItems = Array.isArray(payload.data) ? payload.data : [];
    items.push(...pageItems);
    pages.push(payload);

    const pagination = payload.meta?.pagination;
    if (!pagination || pagination.page >= pagination.pageCount) {
      return {
        ok: true,
        status: response.status,
        endpoint,
        items,
        meta: {
          ...pagination,
          fetchedTotal: items.length,
          fetchedPages: pages.length,
        },
        pages,
      };
    }
    page += 1;
  }
}

function decodeHtmlEntities(text) {
  if (!text) return "";
  const named = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#39;": "'",
    "&nbsp;": " ",
  };

  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, num) => String.fromCharCode(Number.parseInt(num, 10)))
    .replace(/&(amp|lt|gt|quot|nbsp);|&#39;/g, (m) => named[m] ?? m);
}

function normalizeWhitespace(value) {
  return value
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ *\n */g, "\n")
    .trim();
}

function stripHtml(fragment) {
  if (!fragment) return "";
  const withBreaks = fragment
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n");
  const withoutTags = withBreaks
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  return normalizeWhitespace(decodeHtmlEntities(withoutTags));
}

function extractSection(html, sectionId) {
  const pattern = new RegExp(`<section[^>]*id=["']${escapeRegExp(sectionId)}["'][^>]*>[\\s\\S]*?<\\/section>`, "i");
  return html.match(pattern)?.[0] ?? "";
}

function extractFirstTagText(fragment, tag) {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = fragment.match(pattern);
  return stripHtml(match?.[1] ?? "");
}

function extractAllTagText(fragment, tag) {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const values = [];
  let match = pattern.exec(fragment);
  while (match) {
    const text = stripHtml(match[1]);
    if (text) values.push(text);
    match = pattern.exec(fragment);
  }
  return values;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toAbsoluteUrl(url, baseUrl) {
  if (!url) return null;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return null;
  }
}

function toMedia(rawMedia, baseUrl) {
  const media = rawMedia?.data?.attributes;
  if (!media) return null;
  return cleanObject({
    name: media.name,
    alternativeText: media.alternativeText ?? null,
    caption: media.caption ?? null,
    width: media.width ?? null,
    height: media.height ?? null,
    url: toAbsoluteUrl(media.url, baseUrl),
  });
}

function cleanObject(value) {
  if (Array.isArray(value)) {
    return value.map(cleanObject).filter((item) => item !== undefined);
  }
  if (value && typeof value === "object") {
    const cleanedEntries = Object.entries(value)
      .map(([key, val]) => [key, cleanObject(val)])
      .filter(([, val]) => val !== undefined);
    return Object.fromEntries(cleanedEntries);
  }
  if (value === undefined) return undefined;
  return value;
}

function truncate(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return text.slice(0, maxLength);
  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

function decodeCloudflareEmail(encoded) {
  if (!encoded || encoded.length < 4) return null;
  const key = Number.parseInt(encoded.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < encoded.length; i += 2) {
    const byte = Number.parseInt(encoded.slice(i, i + 2), 16);
    out += String.fromCharCode(byte ^ key);
  }
  return out.includes("@") ? out : null;
}

function extractHomepageData(homeHtml, baseUrl) {
  const heroSection = extractSection(homeHtml, "hero");
  const aboutSection = extractSection(homeHtml, "about");
  const servicesSection = extractSection(homeHtml, "services");
  const teamSection = extractSection(homeHtml, "team");
  const contactSection = extractSection(homeHtml, "contact");
  const footerSection = homeHtml.match(/<div id=["']footer["'][\s\S]*?<\/footer>/i)?.[0] ?? "";

  const heroBackgroundMatch = heroSection.match(/background-image:\s*url\('([^']+)'\)/i);
  const heroButtonMatch = heroSection.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
  const phoneMatch = contactSection.match(/href=["']tel:([^"']+)["']/i);
  const mailtoMatches = [...contactSection.matchAll(/mailto:([^"'\s]+)/gi)].map((m) => decodeHtmlEntities(m[1]).trim());
  const cfEmailMatches = [...contactSection.matchAll(/data-cfemail=["']([0-9a-f]+)["']/gi)];
  const decodedCfEmails = cfEmailMatches
    .map((m) => decodeCloudflareEmail(m[1]))
    .filter(Boolean);
  const uniqueEmails = [...new Set([...mailtoMatches, ...decodedCfEmails])];

  const mapSrc = contactSection.match(/<iframe[^>]*src=["']([^"']+)["']/i)?.[1];
  let mapQuery = "";
  if (mapSrc) {
    try {
      const mapUrl = new URL(decodeHtmlEntities(mapSrc));
      mapQuery = (mapUrl.searchParams.get("q") ?? "").replace(/\+/g, " ").trim();
    } catch {
      mapQuery = "";
    }
  }

  const aboutText = extractFirstTagText(aboutSection, "p");
  const serviceParagraphs = extractAllTagText(servicesSection, "p");
  const serviceItems = extractAllTagText(servicesSection, "li")
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .filter(Boolean);
  const teamNames = extractAllTagText(teamSection, "h3");
  const footerParagraphs = extractAllTagText(footerSection, "p");

  return {
    hero: {
      heading: extractFirstTagText(heroSection, "h1"),
      subheading: extractFirstTagText(heroSection, "h2"),
      buttonText: stripHtml(heroButtonMatch?.[2] ?? ""),
      buttonUrl: heroButtonMatch?.[1] ?? "",
      bannerUrlFromHtml: toAbsoluteUrl(heroBackgroundMatch?.[1] ?? "", baseUrl),
    },
    about: {
      content: aboutText,
    },
    services: {
      introText: serviceParagraphs[0] ?? "",
      serviceItems,
    },
    team: {
      displayOrderNames: teamNames,
    },
    siteSetting: {
      phoneNumber: decodeHtmlEntities(phoneMatch?.[1] ?? ""),
      primaryEmail: uniqueEmails[0] ?? "",
      secondaryEmail: uniqueEmails[1] ?? "",
      address: decodeHtmlEntities(mapQuery),
      footerTagline: footerParagraphs[1] ?? "",
    },
    contactRawEmails: uniqueEmails,
  };
}

function makeHeroEntry(heroItem, homepageData, baseUrl) {
  const raw = heroItem?.attributes ?? {};
  const banner = toMedia(raw.Banner, baseUrl) ?? cleanObject({
    name: homepageData.hero.bannerUrlFromHtml
      ? path.basename(new URL(homepageData.hero.bannerUrlFromHtml).pathname)
      : "hero-banner.jpg",
    alternativeText: "Hero banner",
    url: homepageData.hero.bannerUrlFromHtml,
  });

  return cleanObject({
    id: heroItem?.id ?? 1,
    Banner: banner,
    heading: homepageData.hero.heading,
    subheading: homepageData.hero.subheading,
    buttonText: homepageData.hero.buttonText,
    buttonUrl: homepageData.hero.buttonUrl,
    buttonEnabled: Boolean(homepageData.hero.buttonText && homepageData.hero.buttonUrl),
    buttonText2: "",
    buttonUrl2: "",
    buttonEnabled2: false,
    publishedAt: raw.publishedAt ?? new Date().toISOString(),
  });
}

function makeProjectEntries(projectItems, baseUrl) {
  return projectItems.map((item) => {
    const raw = item.attributes ?? {};
    const description = normalizeWhitespace(raw.description ?? "");
    return cleanObject({
      id: item.id,
      title: raw.title ?? "",
      description,
      startDate: raw.startDate ?? null,
      endDate: raw.endDate ?? null,
      thumbnail: toMedia(raw.thumbnail, baseUrl),
      beforePhoto: toMedia(raw.beforePhoto, baseUrl),
      afterPhoto: toMedia(raw.afterPhoto, baseUrl),
      seo: {
        metaTitle: truncate(raw.title ?? "", 60),
        metaDescription: truncate(description, 160),
      },
      publishedAt: raw.publishedAt ?? new Date().toISOString(),
    });
  });
}

function makeTeamEntries(teamItems, homepageData, baseUrl) {
  const orderByName = new Map();
  homepageData.team.displayOrderNames.forEach((name, index) => {
    orderByName.set(name.toLowerCase(), index);
  });

  const rows = teamItems.map((item, idx) => {
    const raw = item.attributes ?? {};
    const name = (raw.name ?? "").trim();
    const order = orderByName.get(name.toLowerCase()) ?? idx;
    return cleanObject({
      id: item.id,
      name,
      role: raw.role ?? "",
      email: raw.email ?? "",
      image: toMedia(raw.image, baseUrl),
      bio: "",
      order,
      publishedAt: raw.publishedAt ?? new Date().toISOString(),
    });
  });

  return rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function makeDocumentEntries(documentItems, baseUrl) {
  return documentItems.map((item) => {
    const raw = item.attributes ?? {};
    const title = raw.title ?? "";
    const description = normalizeWhitespace(raw.description ?? "");
    return cleanObject({
      id: item.id,
      title,
      description,
      file: toMedia(raw.file, baseUrl),
      url: raw.url ?? "",
      seo: {
        metaTitle: truncate(title, 60),
        metaDescription: truncate(description, 160),
      },
      publishedAt: raw.publishedAt ?? new Date().toISOString(),
    });
  });
}

function collectMediaManifest(seedPayload) {
  const mediaEntries = [];
  const data = seedPayload.data;

  const mediaMap = {
    "api::hero.hero": ["Banner"],
    "api::project.project": ["thumbnail", "beforePhoto", "afterPhoto"],
    "api::team.team": ["image"],
    "api::document.document": ["file"],
  };

  for (const [uid, fields] of Object.entries(mediaMap)) {
    const entries = data[uid] ?? [];
    entries.forEach((entry, index) => {
      fields.forEach((field) => {
        const media = entry[field];
        if (!media?.url) return;
        mediaEntries.push({
          uid,
          entryId: entry.id ?? index + 1,
          field,
          name: media.name ?? "",
          url: media.url,
        });
      });
    });
  }

  return mediaEntries;
}

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadMediaAssets(mediaManifest, outDir, timeoutMs) {
  const mediaDir = path.join(outDir, "media");
  await fs.mkdir(mediaDir, { recursive: true });

  const uniqueByUrl = new Map();
  for (const item of mediaManifest) {
    if (!uniqueByUrl.has(item.url)) uniqueByUrl.set(item.url, item);
  }

  const results = [];
  let downloaded = 0;
  let failed = 0;

  for (const [url, source] of uniqueByUrl.entries()) {
    try {
      const urlPathName = new URL(url).pathname;
      const rawFileName = path.basename(urlPathName) || "file.bin";
      const fileName = safeFileName(rawFileName);

      let destination = path.join(mediaDir, fileName);
      let suffix = 1;
      while (await fileExists(destination)) {
        const parsed = path.parse(fileName);
        destination = path.join(mediaDir, `${parsed.name}_${suffix}${parsed.ext}`);
        suffix += 1;
      }

      const response = await fetchWithTimeout(url, timeoutMs);
      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${message.slice(0, 200)}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(destination, buffer);
      downloaded += 1;

      results.push({
        status: "downloaded",
        uid: source.uid,
        entryId: source.entryId,
        field: source.field,
        url,
        file: path.relative(outDir, destination),
        bytes: buffer.length,
      });
    } catch (error) {
      failed += 1;
      results.push({
        status: "failed",
        uid: source.uid,
        entryId: source.entryId,
        field: source.field,
        url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { downloaded, failed, files: results };
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function buildReport({
  options,
  fetchedCollections,
  seedPayload,
  homepageData,
  warnings,
  mediaDownloadSummary,
}) {
  const lines = [];
  lines.push("# Legacy Site Export Report");
  lines.push("");
  lines.push(`- Source: ${options.baseUrl}`);
  lines.push(`- Exported at (UTC): ${new Date().toISOString()}`);
  lines.push(`- Output directory: ${options.outDir}`);
  lines.push("");
  lines.push("## Extracted Records");
  lines.push("");

  const keys = [
    "api::hero.hero",
    "api::about.about",
    "api::services-page.services-page",
    "api::site-setting.site-setting",
    "api::team.team",
    "api::project.project",
    "api::document.document",
  ];
  keys.forEach((uid) => {
    const count = (seedPayload.data[uid] ?? []).length;
    lines.push(`- ${uid}: ${count}`);
  });

  lines.push("");
  lines.push("## Source Endpoint Status");
  lines.push("");
  fetchedCollections.forEach((collection) => {
    if (collection.ok) {
      lines.push(`- /api/${collection.endpoint}: OK (${collection.items.length} records)`);
    } else {
      lines.push(`- /api/${collection.endpoint}: unavailable (HTTP ${collection.status})`);
    }
  });

  lines.push("");
  lines.push("## Media Download");
  lines.push("");
  if (mediaDownloadSummary) {
    lines.push(`- Downloaded files: ${mediaDownloadSummary.downloaded}`);
    lines.push(`- Failed files: ${mediaDownloadSummary.failed}`);
  } else {
    lines.push("- Skipped (`--skip-media` used)");
  }

  lines.push("");
  lines.push("## Manual Follow-up");
  lines.push("");
  lines.push("- Confirm `about.content` line breaks and wording after import.");
  lines.push("- Review `services-page.serviceItems` ordering and labels in Strapi.");
  lines.push("- Review team bios (not present on legacy site, left blank).");
  lines.push("- Announcement banner and testimonials were not publicly available and are not auto-filled.");
  lines.push("- Re-upload downloaded files if your import path does not preserve media links automatically.");

  if (homepageData.contactRawEmails.length > 0) {
    lines.push("");
    lines.push("## Extracted Contact Emails");
    lines.push("");
    homepageData.contactRawEmails.forEach((email) => lines.push(`- ${email}`));
  }

  if (warnings.length > 0) {
    lines.push("");
    lines.push("## Warnings");
    lines.push("");
    warnings.forEach((warning) => lines.push(`- ${warning}`));
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const warnings = [];

  await fs.mkdir(options.outDir, { recursive: true });

  const fetchedCollections = [];
  for (const collection of COLLECTION_ENDPOINTS) {
    const result = await fetchCollection(options.baseUrl, collection.endpoint, options.pageSize, options.timeoutMs);
    fetchedCollections.push(result);
    await writeJson(path.join(options.outDir, "raw", `${collection.endpoint}.json`), result);
  }

  const homeHtml = await fetchText(new URL("/", options.baseUrl), options.timeoutMs);
  await fs.writeFile(path.join(options.outDir, "raw", "homepage.html"), homeHtml, "utf8");
  const homepageData = extractHomepageData(homeHtml, options.baseUrl);
  await writeJson(path.join(options.outDir, "raw", "homepage-extracted.json"), homepageData);

  const projects = fetchedCollections.find((row) => row.endpoint === "projects")?.items ?? [];
  const teams = fetchedCollections.find((row) => row.endpoint === "teams")?.items ?? [];
  const documents = fetchedCollections.find((row) => row.endpoint === "documents")?.items ?? [];
  const heroes = fetchedCollections.find((row) => row.endpoint === "heroes")?.items ?? [];

  if (projects.length === 0) warnings.push("No projects found from /api/projects.");
  if (teams.length === 0) warnings.push("No teams found from /api/teams.");
  if (documents.length === 0) warnings.push("No documents found from /api/documents.");
  if (heroes.length === 0) warnings.push("No heroes found from /api/heroes. Hero banner fallback used from homepage HTML.");

  const seedPayload = cleanObject({
    version: 2,
    source: {
      baseUrl: options.baseUrl,
      extractedAt: new Date().toISOString(),
      strategy: "API-first (Strapi public endpoints) with homepage HTML fallback for singleton text blocks.",
    },
    data: {
      "api::hero.hero": [makeHeroEntry(heroes[0], homepageData, options.baseUrl)],
      "api::about.about": [
        {
          id: 1,
          content: homepageData.about.content,
          seo: {
            metaTitle: "About GeoSolutions",
            metaDescription: truncate(homepageData.about.content, 160),
          },
          publishedAt: new Date().toISOString(),
        },
      ],
      "api::services-page.services-page": [
        {
          id: 1,
          introText: homepageData.services.introText,
          serviceItems: homepageData.services.serviceItems.map((label) => ({ label })),
          publishedAt: new Date().toISOString(),
        },
      ],
      "api::site-setting.site-setting": [
        {
          id: 1,
          footerTagline: homepageData.siteSetting.footerTagline,
          phoneNumber: homepageData.siteSetting.phoneNumber,
          primaryEmail: homepageData.siteSetting.primaryEmail,
          secondaryEmail: homepageData.siteSetting.secondaryEmail,
          address: homepageData.siteSetting.address,
        },
      ],
      "api::team.team": makeTeamEntries(teams, homepageData, options.baseUrl),
      "api::project.project": makeProjectEntries(projects, options.baseUrl),
      "api::document.document": makeDocumentEntries(documents, options.baseUrl),
    },
  });

  await writeJson(path.join(options.outDir, "strapi-seed.legacy.json"), seedPayload);

  const mediaManifest = collectMediaManifest(seedPayload);
  await writeJson(path.join(options.outDir, "media-manifest.json"), mediaManifest);

  let mediaDownloadSummary = null;
  if (options.downloadMedia) {
    mediaDownloadSummary = await downloadMediaAssets(mediaManifest, options.outDir, options.timeoutMs);
    await writeJson(path.join(options.outDir, "media-download-results.json"), mediaDownloadSummary);
  }

  const report = buildReport({
    options,
    fetchedCollections,
    seedPayload,
    homepageData,
    warnings,
    mediaDownloadSummary,
  });
  await fs.writeFile(path.join(options.outDir, "migration-report.md"), report, "utf8");

  console.log(`Export complete.
- Output: ${options.outDir}
- Projects: ${projects.length}
- Teams: ${teams.length}
- Documents: ${documents.length}
- Hero records: ${heroes.length}
- Media files queued: ${mediaManifest.length}
`);
}

main().catch((error) => {
  console.error("Export failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
