#!/usr/bin/env node
// Verifies that every shareable property page produces a rich link-preview card.
//
// It fetches the *served HTML* — no JavaScript, exactly what WhatsApp's and
// Telegram's scrapers see — pulls the Open Graph and Twitter tags out of it, then
// downloads the preview image and measures the real bytes and pixel dimensions.
//
//   npm run check:previews                        # against localhost:3000
//   npm run check:previews -- --base=https://milla-homes.com
//   npm run check:previews -- --slug=villa-marina-cabo-roig
//
// Exits non-zero if anything would break a preview, so it can gate a deploy.

import { readFile } from "node:fs/promises";

const MAX_IMAGE_BYTES = 300 * 1024; // WhatsApp silently drops images above ~300KB.
const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 630;

const REQUIRED_TAGS = [
  "og:title",
  "og:description",
  "og:image",
  "og:url",
  "og:type",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
];

function parseArgs(argv) {
  const args = { base: "http://localhost:3000", slug: null };

  for (const entry of argv.slice(2)) {
    const [key, value] = entry.replace(/^--/, "").split("=");
    if (key === "base" && value) args.base = value.replace(/\/+$/, "");
    if (key === "slug" && value) args.slug = value;
  }

  return args;
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Pulls <meta property=... content=...> and <meta name=... content=...> pairs. */
export function extractMetaTags(html) {
  const head = html.slice(0, html.indexOf("</head>") + 7 || html.length);
  const tags = new Map();

  for (const match of head.matchAll(/<meta\s+[^>]*>/gi)) {
    const tag = match[0];
    const key = /(?:property|name)=["']([^"']+)["']/i.exec(tag)?.[1];
    const content = /content=["']([^"']*)["']/i.exec(tag)?.[1];

    if (key && content !== undefined && !tags.has(key)) {
      tags.set(key, decodeEntities(content));
    }
  }

  return tags;
}

function extractHtmlLang(html) {
  return /<html[^>]*\blang=["']([^"']+)["']/i.exec(html)?.[1] ?? null;
}

function extractHreflangs(html) {
  const found = new Map();

  for (const match of html.matchAll(/<link\s+[^>]*rel=["']alternate["'][^>]*>/gi)) {
    const tag = match[0];
    const lang = /hreflang=["']([^"']+)["']/i.exec(tag)?.[1];
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];

    if (lang && href) found.set(lang.toLowerCase(), decodeEntities(href));
  }

  return found;
}

/** Minimal dimension readers for the formats a preview image can plausibly be. */
export function readImageSize(buffer) {
  // PNG
  if (buffer.length >= 24 && buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // JPEG — walk the segment markers to the first start-of-frame.
  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;

    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);

      if (isStartOfFrame) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }

      offset += 2 + length;
    }
  }

  // WebP (VP8X / VP8 / VP8L)
  if (buffer.length > 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buffer.toString("ascii", 12, 16);

    if (chunk === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }

    if (chunk === "VP8 ") {
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    }
  }

  return null;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

async function checkPage(base, path, expectedLocale) {
  const url = `${base}${path}`;
  const problems = [];
  const notes = [];

  const response = await fetch(url, {
    redirect: "follow",
    // Introduce ourselves the way the real scrapers do.
    headers: { "user-agent": "WhatsApp/2.23 facebookexternalhit/1.1" },
  });

  if (!response.ok) {
    return { url, problems: [`HTTP ${response.status}`], notes, card: null };
  }

  const html = await response.text();
  const tags = extractMetaTags(html);

  for (const tag of REQUIRED_TAGS) {
    if (!tags.get(tag)) problems.push(`missing ${tag}`);
  }

  const htmlLang = extractHtmlLang(html);
  if (htmlLang !== expectedLocale) {
    problems.push(`<html lang> is "${htmlLang}", expected "${expectedLocale}"`);
  }

  const hreflangs = extractHreflangs(html);
  for (const locale of ["es", "en", "ru", "de", "x-default"]) {
    if (!hreflangs.has(locale)) problems.push(`missing hreflang ${locale}`);
  }

  const ogImage = tags.get("og:image");
  let imageSummary = "—";

  if (ogImage) {
    if (!ogImage.startsWith("https://")) {
      problems.push(`og:image is not an absolute https URL (${ogImage})`);
    } else {
      try {
        const imageResponse = await fetch(ogImage);

        if (!imageResponse.ok) {
          problems.push(`og:image returned HTTP ${imageResponse.status}`);
        } else {
          const buffer = Buffer.from(await imageResponse.arrayBuffer());
          const size = readImageSize(buffer);
          const contentType = imageResponse.headers.get("content-type") ?? "unknown";

          imageSummary = `${formatBytes(buffer.length)} ${size ? `${size.width}x${size.height}` : "?"} ${contentType}`;

          if (buffer.length > MAX_IMAGE_BYTES) {
            problems.push(`og:image is ${formatBytes(buffer.length)}, over the ${formatBytes(MAX_IMAGE_BYTES)} limit`);
          }

          if (size && (size.width !== EXPECTED_WIDTH || size.height !== EXPECTED_HEIGHT)) {
            problems.push(`og:image is ${size.width}x${size.height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
          }

          if (!contentType.startsWith("image/")) {
            problems.push(`og:image content-type is "${contentType}"`);
          }
        }
      } catch (error) {
        problems.push(`og:image could not be fetched: ${error.message}`);
      }
    }
  }

  const ogUrl = tags.get("og:url");
  if (ogUrl && !ogUrl.startsWith("https://")) {
    problems.push(`og:url is not absolute https (${ogUrl})`);
  }

  return {
    url,
    problems,
    notes,
    card: {
      title: tags.get("og:title") ?? "",
      description: tags.get("og:description") ?? "",
      image: imageSummary,
      type: tags.get("og:type") ?? "",
      twitterCard: tags.get("twitter:card") ?? "",
    },
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const properties = JSON.parse(await readFile(new URL("../data/share-properties.json", import.meta.url), "utf8"));
  const locales = ["en", "es", "ru", "de"];
  const selected = args.slug ? properties.filter((property) => property.slug === args.slug) : properties;

  if (selected.length === 0) {
    console.error(`No property matched --slug=${args.slug}`);
    process.exit(1);
  }

  console.log(`Checking link previews against ${args.base}\n`);

  let failures = 0;

  for (const property of selected) {
    for (const locale of locales) {
      const path = locale === "en" ? `/p/${property.slug}` : `/p/${property.slug}/${locale}`;
      let result;

      try {
        result = await checkPage(args.base, path, locale);
      } catch (error) {
        console.log(`✗ ${path}\n    could not be fetched: ${error.message}\n`);
        failures += 1;
        continue;
      }

      const ok = result.problems.length === 0;
      if (!ok) failures += 1;

      console.log(`${ok ? "✓" : "✗"} ${path}`);

      if (result.card) {
        console.log(`    title       ${result.card.title}`);
        console.log(`    description ${result.card.description.slice(0, 90)}${result.card.description.length > 90 ? "…" : ""}`);
        console.log(`    image       ${result.card.image}`);
        console.log(`    type        og:${result.card.type} / twitter:${result.card.twitterCard}`);
      }

      for (const problem of result.problems) {
        console.log(`    ! ${problem}`);
      }

      console.log("");
    }
  }

  const total = selected.length * locales.length;

  if (failures > 0) {
    console.log(`${failures} of ${total} pages would not preview correctly.`);
    process.exit(1);
  }

  console.log(`All ${total} pages preview correctly.`);
}

// Only run as a CLI, so the helpers above stay importable from a test.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
