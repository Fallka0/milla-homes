import {
  type ListingMode,
  type PropertyFeature,
  type PropertyRecord,
  type PropertyType,
  type RentPricePeriod,
} from "@/lib/property-shared";
import { createAdminClient } from "@/lib/supabase/server";

const importUserAgent =
  "Mozilla/5.0 (compatible; VerdantRealtyImporter/1.0; +https://github.com/Fallka0/verdant-realty)";
const bucketName = "property-images";
const maxImageSizeBytes = 8 * 1024 * 1024;

const ignoredImagePatterns = [
  /\/new\/app\/images\/nofoto\.jpg/i,
  /\/escaparatecliente\/index\.php/i,
  /\/escaparate\/certificado\/ce\.php/i,
];

export type ImportedPropertyPayload = {
  notes: string[];
  property: PropertyRecord;
  provider: "dropbox" | "generic" | "idealista" | "inmovilla";
  resolvedUrl: string;
  sourceUrl: string;
};

export async function importPropertyFromUrl(rawUrl: string): Promise<ImportedPropertyPayload> {
  const sourceUrl = normalizeSourceUrl(rawUrl);

  if (!isInmovillaUrl(sourceUrl)) {
    return importGenericPropertyFromUrl(sourceUrl);
  }

  const resolvedUrl = await resolveInmovillaPropertyUrl(sourceUrl);
  const [markdown, html] = await Promise.all([
    fetchReaderMarkdown(resolvedUrl),
    fetchText(resolvedUrl).catch(() => ""),
  ]);

  if (/Propiedad no disponible/i.test(markdown)) {
    throw new Error("This property is no longer publicly available in the source system.");
  }

  // Two very different Inmovilla layouts: the agent CRM "ficha" (structured,
  // labelled fields) and the client-facing "escaparate" (free-flowing prose).
  // The /escaparatecliente/ page — which the info-home.link wrapper points at —
  // is the prose format, so it needs the prose parser; the labelled parser
  // finds none of its fields and produces an empty draft.
  const imported = resolvedUrl.includes("/escaparatecliente/")
    ? parseInmovillaEscaparate({
        html,
        markdown,
        resolvedUrl,
        sourceUrl: sourceUrl.toString(),
      })
    : parseInmovillaMarkdown({
        html,
        markdown,
        resolvedUrl,
        sourceUrl: sourceUrl.toString(),
      });

  return mirrorImportedImages(imported);
}

function normalizeSourceUrl(rawUrl: string) {
  let candidate = rawUrl.trim();

  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  const url = new URL(candidate);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Please paste a public HTTP or HTTPS property link.");
  }

  return url;
}

function isInmovillaUrl(url: URL) {
  const hostname = url.hostname.toLowerCase();

  return hostname.includes("info-home.link") || hostname.includes("inmovilla.com");
}

function getGenericProvider(url: URL): ImportedPropertyPayload["provider"] {
  const hostname = url.hostname.toLowerCase();

  if (hostname.includes("dropbox.com")) {
    return "dropbox";
  }

  if (hostname.includes("idealista.")) {
    return "idealista";
  }

  return "generic";
}

async function importGenericPropertyFromUrl(sourceUrl: URL) {
  const resolvedUrl = sourceUrl.toString();
  const [htmlResult, markdownResult] = await Promise.allSettled([
    fetchText(resolvedUrl),
    fetchReaderMarkdown(resolvedUrl),
  ]);
  const html = htmlResult.status === "fulfilled" ? htmlResult.value : "";
  const markdown = markdownResult.status === "fulfilled" ? markdownResult.value : "";

  if (!html && !markdown) {
    if (sourceUrl.hostname.toLowerCase().includes("idealista.")) {
      throw new Error("Idealista blocked the importer request with anti-bot protection. Paste another public source or import the details manually.");
    }

    throw new Error("The source page could not be fetched.");
  }

  if (/Target URL returned error 403|requiring CAPTCHA|Forbidden/i.test(markdown)) {
    throw new Error("The source page blocked the importer request with anti-bot protection.");
  }

  const imported = parseGenericPropertyPage({
    html,
    markdown,
    provider: getGenericProvider(sourceUrl),
    resolvedUrl,
    sourceUrl: sourceUrl.toString(),
  });

  return mirrorImportedImages(imported);
}

async function resolveInmovillaPropertyUrl(sourceUrl: URL) {
  // crm.inmovilla.com/.../escaparatecliente/ is the real property sheet — parse
  // it directly.
  if (sourceUrl.pathname.includes("/escaparatecliente/")) {
    return sourceUrl.toString();
  }

  // info-home.link/cliente/ (and bare share links) are thin wrapper pages whose
  // entire body is a single <iframe> pointing at the real crm.inmovilla.com
  // escaparate. Follow that iframe to the actual property sheet.
  const html = await fetchText(sourceUrl.toString());
  // Match the iframe src with either single or double quotes (the wrapper uses
  // an uppercase SRC attribute, so keep the case-insensitive flag).
  const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);

  if (iframeMatch?.[1]) {
    const target = new URL(iframeMatch[1], sourceUrl);
    // The iframe URL carries a per-request cache-buster (&x=<timestamp>). Left
    // in, every import hits a unique URL and the reader re-renders from scratch,
    // frequently capturing the half-loaded skeleton instead of the finished
    // page. Dropping it lets the reader serve a stable, fully-rendered result.
    target.searchParams.delete("x");
    return target.toString();
  }

  if (/Propiedad no disponible/i.test(html)) {
    throw new Error("This property is no longer publicly available in the source system.");
  }

  // Last resort: parse the page we already fetched even without an iframe.
  return sourceUrl.toString();
}

async function fetchReaderMarkdown(targetUrl: string) {
  // targetUrl already carries its own scheme (https://…). The reader expects the
  // full URL appended directly; prefixing another scheme produced a malformed
  // "http://https://…" that the reader could not resolve.
  const readerUrl = `https://r.jina.ai/${targetUrl}`;

  return fetchText(readerUrl, {
    headers: {
      "User-Agent": importUserAgent,
      Accept: "text/plain,text/markdown;q=0.9,*/*;q=0.8",
    },
  });
}

async function fetchText(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": importUserAgent,
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`The source request failed with status ${response.status}.`);
  }

  return response.text();
}

async function mirrorImportedImages(imported: ImportedPropertyPayload) {
  const imageUrls = [imported.property.mainImageUrl, ...imported.property.galleryUrls];

  try {
    await ensureImageBucket();
  } catch {
    return {
      ...imported,
      notes: [
        ...imported.notes,
        "Imported images could not be copied into storage and still use the original source URLs.",
      ],
    };
  }

  const mirrorResults = await Promise.all(
    imageUrls.map(async (imageUrl) => ({
      originalUrl: imageUrl,
      mirroredUrl: await uploadImportedImage({
        imageUrl,
        referenceCode: imported.property.referenceCode,
        referer: imported.resolvedUrl,
        title: imported.property.title,
      }).catch(() => null),
    })),
  );
  const mirroredUrls = mirrorResults.map((result) => result.mirroredUrl ?? result.originalUrl);
  const failedCount = mirrorResults.filter((result) => !result.mirroredUrl).length;

  return {
    ...imported,
    notes: [
      ...imported.notes,
      failedCount > 0
        ? `${failedCount} imported image${failedCount === 1 ? "" : "s"} could not be copied into storage and still use the original source URL.`
        : null,
    ].filter((note): note is string => Boolean(note)),
    property: {
      ...imported.property,
      galleryUrls: mirroredUrls.slice(1),
      mainImageUrl: mirroredUrls[0] ?? imported.property.mainImageUrl,
    },
  };
}

// An image URL we already control (or a local asset) never needs mirroring.
function isSelfHostedImageUrl(url: string) {
  return !/^https?:\/\//i.test(url) || /\.supabase\.co\//i.test(url);
}

// Copy any externally-hosted image URLs (e.g. pasted Inmovilla gallery links)
// into our own storage so they render through next/image's allow-list and don't
// depend on the source staying up or permitting hotlinks. Falls back to the
// original URL for anything that can't be mirrored.
export async function mirrorExternalImageUrls(
  urls: string[],
  input: { referenceCode: string; title: string },
): Promise<string[]> {
  const clean = urls.map((url) => url.trim()).filter(Boolean);

  if (!clean.some((url) => !isSelfHostedImageUrl(url))) {
    return clean;
  }

  try {
    await ensureImageBucket();
  } catch {
    return clean;
  }

  return Promise.all(
    clean.map(async (url) => {
      if (isSelfHostedImageUrl(url)) {
        return url;
      }

      let referer = url;
      try {
        referer = new URL(url).origin;
      } catch {
        // keep the raw URL as referer
      }

      const mirrored = await uploadImportedImage({
        imageUrl: url,
        referenceCode: input.referenceCode,
        referer,
        title: input.title,
      }).catch(() => null);

      return mirrored ?? url;
    }),
  );
}

async function uploadImportedImage(input: {
  imageUrl: string;
  referenceCode: string;
  referer: string;
  title: string;
}) {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role key is missing.");
  }

  const response = await fetch(input.imageUrl, {
    headers: {
      "User-Agent": importUserAgent,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: input.referer,
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`The image request failed with status ${response.status}.`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";

  if (!/^image\/(?:avif|gif|jpe?g|png|webp)$/.test(contentType)) {
    throw new Error("The imported image URL did not return an image.");
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.byteLength > maxImageSizeBytes) {
    throw new Error("The imported image is larger than the storage upload limit.");
  }

  const extension = getImageExtension(input.imageUrl, contentType);
  const folderName = [input.referenceCode, input.title].map(slugify).filter(Boolean).join("-") || "imported-property";
  const fileName = `${folderName}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabase.storage.from(bucketName).upload(fileName, buffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(fileName);

  return publicUrl;
}

async function ensureImageBucket() {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role key is missing.");
  }

  const { data: bucket } = await supabase.storage.getBucket(bucketName);

  if (!bucket) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: maxImageSizeBytes,
      allowedMimeTypes: ["image/avif", "image/jpeg", "image/png", "image/webp", "image/gif"],
    });

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  if (!bucket.public) {
    const { error } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: maxImageSizeBytes,
      allowedMimeTypes: ["image/avif", "image/jpeg", "image/png", "image/webp", "image/gif"],
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}

function getImageExtension(imageUrl: string, contentType: string) {
  const fromUrl = new URL(imageUrl).pathname.split(".").pop()?.toLowerCase();

  if (fromUrl && /^(avif|gif|jpe?g|png|webp)$/.test(fromUrl)) {
    return fromUrl === "jpeg" ? "jpg" : fromUrl;
  }

  const fromType = contentType.split("/").pop()?.toLowerCase() ?? "jpg";

  if (fromType === "jpeg") {
    return "jpg";
  }

  return /^(avif|gif|jpg|png|webp)$/.test(fromType) ? fromType : "jpg";
}

function parseInmovillaMarkdown(input: {
  html: string;
  markdown: string;
  resolvedUrl: string;
  sourceUrl: string;
}): ImportedPropertyPayload {
  const { html, markdown, resolvedUrl, sourceUrl } = input;
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const referenceCode = extractReferenceCode(markdown) ?? "IMPORT";
  const title = extractTitle(lines);
  const description = extractDescription(markdown, title);
  const shortDescription = extractShortDescription(description, title);
  const type = mapPropertyType(findValueAfterLabel(lines, "Tipo"));
  const location =
    findValueAfterLabel(lines, "Zona") ??
    findHeaderLocation(lines) ??
    "Costa Blanca";
  const bedrooms = extractNumberAfterLabel(lines, "Habitaciones") ?? 0;
  const bathrooms = extractNumberAfterLabel(lines, "Baños") ?? 0;
  const usableSqm = extractSquareMetersAfterLabel(lines, "Sup. Útil");
  const builtSqm = extractSquareMetersAfterLabel(lines, "Sup. construida");
  const plotSqm = extractSquareMetersAfterLabel(lines, "Sup. Parcela");
  const salePrice = extractPriceBetween(lines, "Venta", "Alquilar") ?? 0;
  const rentPrice = extractPriceBetween(lines, "Alquilar", "Traspaso");
  const listingMode = deriveListingMode(salePrice, rentPrice);
  const images = mergeImageUrls(
    extractHtmlImageUrls(html, resolvedUrl),
    extractMarkdownImageUrls(markdown),
  );

  if (!title) {
    throw new Error("We could not extract a property title from that source.");
  }

  // Some Inmovilla client portals render their photo gallery entirely in the
  // browser (the server HTML only carries the "nofoto" placeholder), so a
  // server-side fetch legitimately finds no images. Rather than dead-failing,
  // import the text we do have and let the user add photos manually.
  const hasImages = images.length > 0;
  const mainImageUrl = images[0] ?? "/logos/verdant-seal.svg";

  const features = inferFeatures(markdown);
  const generatedContent = generateImportedPropertyContent({
    bathrooms,
    bedrooms,
    features,
    interiorSqm: usableSqm ?? builtSqm,
    listingMode,
    location,
    priceEuro: salePrice,
    rentPriceEuro: rentPrice,
    sourceDescription: description,
    sourceTitle: title,
    type,
  });

  const property = createImportedPropertyRecord({
    bathrooms,
    bedrooms,
    description: generatedContent.description,
    features,
    galleryUrls: hasImages ? images.slice(1) : [],
    interiorSqm: usableSqm ?? builtSqm,
    listingMode,
    location,
    mainImageUrl,
    plotSqm,
    priceEuro: salePrice,
    referenceCode,
    rentPriceEuro: rentPrice,
    rentPricePeriod: rentPrice ? inferRentPricePeriod(lines) : null,
    shortDescription: generatedContent.shortDescription || shortDescription,
    title: generatedContent.title,
    type,
  });

  const notes = [
    `Imported from ${resolvedUrl}`,
    !hasImages
      ? "No photos could be extracted automatically (this portal loads its gallery with JavaScript). Add the photos manually before publishing."
      : null,
    listingMode !== "sale" && !property.availabilityStart
      ? "Rental availability dates still need to be filled in before saving."
      : null,
  ].filter((note): note is string => Boolean(note));

  return {
    notes,
    property,
    provider: "inmovilla",
    resolvedUrl,
    sourceUrl,
  };
}

// The client-facing Inmovilla "escaparate" page is marketing prose, not a
// labelled data sheet. We pull the headline + body text the reader returns and
// mine the figures (rooms / baths / m² / price / town / features) out of the
// running text, then let the shared content generator build the draft copy.
function parseInmovillaEscaparate(input: {
  html: string;
  markdown: string;
  resolvedUrl: string;
  sourceUrl: string;
}): ImportedPropertyPayload {
  const { html, markdown, resolvedUrl, sourceUrl } = input;

  // Everything the reader rendered, after its "Markdown Content:" header.
  const body = markdown.split(/Markdown Content:\s*/i)[1] ?? markdown;
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\[[^\]]+\]\([^)]+\)/g, "").trim())
    .filter(Boolean)
    .filter((paragraph) => !/^(Title:|URL Source:)/i.test(paragraph))
    // Drop link/URL-only lines so the cliente token can never leak into the copy.
    .filter((paragraph) => !/^https?:\/\//i.test(paragraph));

  // The page sometimes comes back as its empty, un-hydrated template: blank "-"
  // fields, the "marcar como vendida" confirm-dialog string as the heading, and
  // a dash for the description. That means the reader grabbed the page before
  // its JavaScript filled in the data — importing it would produce nonsense, so
  // bail with a clear, actionable message instead.
  const meaningfulText = paragraphs
    .join(" ")
    .replace(/[-–—¡!¿?·\s]/g, "")
    .trim();
  const looksLikeSkeleton =
    /¿?Confirmas que quieres marcar/i.test(body) ||
    /Habitaciones\s*-/i.test(body) ||
    meaningfulText.length < 80;

  if (looksLikeSkeleton) {
    throw new Error(
      "The source page didn't finish loading its details (it loads them with JavaScript). Please try importing again in a few seconds, or enter the details manually.",
    );
  }

  // The headline is the first substantial line; the rest is the description.
  const title = paragraphs.find((paragraph) => paragraph.length > 10) ?? "";
  const description = paragraphs.filter((paragraph) => paragraph !== title).join("\n\n");

  if (!title) {
    throw new Error("We could not extract a property title from that source.");
  }

  // Mine figures from a sanitised copy: strip every URL and any long digit run
  // (e.g. the cliente token "…26201138060459946056M…") so they can't be misread
  // as m² or price.
  const proseForFigures = `${title}\n${description}`
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\b\d{7,}\b/g, " ");

  // Figures out of the prose. Allow a few descriptive words between the number
  // and its noun ("3 amplios dormitorios", "2 baños completos").
  const bedrooms =
    matchLeadingCount(proseForFigures, "dormitorios?|habitaciones?") ??
    extractLabeledNumber(proseForFigures, ["dormitorios", "habitaciones", "bedrooms"]) ??
    0;
  const bathrooms =
    matchLeadingCount(proseForFigures, "ba[nñ]os?|aseos?") ??
    extractLabeledNumber(proseForFigures, ["baños", "banos", "aseos", "bathrooms"]) ??
    0;
  // Cap m² to a sane range — anything outside it is a mis-parse, not a property.
  const rawSqm = extractSquareMeters(proseForFigures);
  const interiorSqm = rawSqm && rawSqm > 0 && rawSqm <= 100_000 ? rawSqm : null;
  // Cap price too: ignore absurd values (token noise) and the placeholder 0.
  const rawPrice = extractPrice(proseForFigures);
  const priceEuro = rawPrice && rawPrice >= 1_000 && rawPrice <= 100_000_000 ? rawPrice : 0;
  const rentPriceEuro = inferRentPrice(proseForFigures);
  const listingMode = deriveListingMode(priceEuro, rentPriceEuro);
  const location = extractGenericLocation(title, description) ?? "Costa Blanca";
  const type = mapPropertyType(`${title} ${description}`);
  const features = inferFeaturesFromProse(`${title} ${description}`);
  const images = mergeImageUrls(
    extractHtmlImageUrls(html, resolvedUrl),
    extractMarkdownImageUrls(markdown),
  );
  const hasImages = images.length > 0;
  const mainImageUrl = images[0] ?? "/logos/verdant-seal.svg";

  // Keep the source's own (professional, Spanish) headline and body verbatim —
  // the draft-copy generator would replace them with generic English text.
  const shortDescription = truncateText(
    description.split(/\n{2,}/).find((paragraph) => paragraph.length > 60) ?? description,
    220,
  );

  const property = createImportedPropertyRecord({
    bathrooms,
    bedrooms,
    description,
    features,
    galleryUrls: hasImages ? images.slice(1) : [],
    interiorSqm,
    listingMode,
    location,
    mainImageUrl,
    plotSqm: null,
    priceEuro,
    referenceCode: createReferenceCodeFromUrl(resolvedUrl),
    rentPriceEuro,
    rentPricePeriod: rentPriceEuro ? "month" : null,
    shortDescription,
    title,
    type,
  });

  const notes = [
    `Imported from ${resolvedUrl}`,
    !hasImages
      ? "No photos could be extracted automatically (this portal loads its gallery with JavaScript). Add the photos manually before publishing."
      : null,
    priceEuro === 0 && !rentPriceEuro
      ? "No price was found in the source text — set it manually before publishing."
      : null,
  ].filter((note): note is string => Boolean(note));

  return {
    notes,
    property,
    provider: "inmovilla",
    resolvedUrl,
    sourceUrl,
  };
}

// Feature detection tuned for free prose (unlike inferFeatures, which is built
// for the labelled CRM sheet where "garaje" appears even when absent). Here a
// bare mention in the marketing copy means the property has it.
function inferFeaturesFromProse(text: string): PropertyFeature[] {
  const normalized = normalizeText(text);
  const matchers: Array<[PropertyFeature, RegExp]> = [
    ["pool", /piscina|pool/],
    ["garage", /garaje|plaza de garaje|garage/],
    ["parking", /aparcamiento|parking|plaza de aparcamiento/],
    ["terrace", /terraza|solarium|balcon/],
    ["garden", /jardin|garden/],
    ["lift", /ascensor|lift/],
    ["furnished", /amueblad|furnished/],
    ["air_conditioning", /aire acondicionado|climatizacion|climatizado/],
    ["heating", /calefaccion|bomba de calor|heating/],
    // Only genuine view claims — avoid "restaurantes frente al mar" style noise.
    ["sea_view", /vistas? al mar|primera linea de playa|frontline/],
    ["new_build", /obra nueva|nueva construccion|new build/],
    ["tourist_license", /licencia turistica|tourist licen[sc]e/],
    ["gated_community", /urbanizacion (privada|cerrada)|gated community/],
    ["sauna", /\bsauna\b/],
    ["pet_friendly", /pet.?friendly|se admiten mascotas|admite mascotas/],
  ];

  return matchers.filter(([, pattern]) => pattern.test(normalized)).map(([feature]) => feature);
}

// "3 amplios dormitorios" / "2 baños completos" → the leading number, allowing
// up to two adjectives between the digit and the noun.
function matchLeadingCount(text: string, nounPattern: string) {
  const match = text.match(new RegExp(`(\\d+)\\s+(?:[\\p{L}]+\\s+){0,2}(?:${nounPattern})`, "iu"));

  return match ? Number(match[1]) : null;
}

function parseGenericPropertyPage(input: {
  html: string;
  markdown: string;
  provider: ImportedPropertyPayload["provider"];
  resolvedUrl: string;
  sourceUrl: string;
}): ImportedPropertyPayload {
  const { html, markdown, provider, resolvedUrl, sourceUrl } = input;
  const fullText = htmlToText(`${html}\n${markdown}`);
  const metaTitle = getMetaContent(html, "og:title") ?? getTitleTag(html) ?? getMarkdownTitle(markdown);
  const title = cleanTitle(metaTitle) || createFallbackTitle(new URL(resolvedUrl));
  const metaDescription =
    getMetaContent(html, "og:description") ??
    getMetaContent(html, "description") ??
    getMarkdownDescription(markdown) ??
    title;
  const description = truncateText(metaDescription, 1200);
  const images = mergeImageUrls(
    extractHtmlImageUrls(html, resolvedUrl),
    extractMarkdownImageUrls(markdown),
  );
  const mainImageUrl = images[0] ?? "/logos/verdant-seal.svg";
  const priceEuro = extractPrice(fullText) ?? 0;
  const rentPriceEuro = inferRentPrice(fullText);
  const listingMode = deriveListingMode(priceEuro, rentPriceEuro);
  const bedrooms = extractLabeledNumber(fullText, ["bedroom", "bedrooms", "bed", "beds", "habitaciones", "dormitorios"]) ?? 0;
  const bathrooms = extractLabeledNumber(fullText, ["bathroom", "bathrooms", "bath", "baths", "baños", "banos"]) ?? 0;
  const interiorSqm = extractSquareMeters(fullText);
  const location = extractGenericLocation(title, description) ?? "Costa Blanca";
  const type = mapPropertyType(`${title} ${description}`);
  const features = inferFeatures(fullText);
  const generatedContent = generateImportedPropertyContent({
    bathrooms,
    bedrooms,
    features,
    interiorSqm,
    listingMode,
    location,
    priceEuro,
    rentPriceEuro,
    sourceDescription: description,
    sourceTitle: title,
    type,
  });

  const property = createImportedPropertyRecord({
    bathrooms,
    bedrooms,
    description: generatedContent.description,
    features,
    galleryUrls: images.slice(1),
    interiorSqm,
    listingMode,
    location,
    mainImageUrl,
    plotSqm: null,
    priceEuro,
    referenceCode: createReferenceCodeFromUrl(resolvedUrl),
    rentPriceEuro,
    rentPricePeriod: rentPriceEuro ? "month" : null,
    shortDescription: generatedContent.shortDescription,
    title: generatedContent.title,
    type,
  });

  const notes = [
    `Imported from ${resolvedUrl}`,
    provider === "dropbox"
      ? "Dropbox folder imports usually include media only. Review and complete property details before publishing."
      : null,
    images.length === 0
      ? "No public source images were found. A placeholder image was used."
      : null,
  ].filter((note): note is string => Boolean(note));

  return {
    notes,
    property,
    provider,
    resolvedUrl,
    sourceUrl,
  };
}

type ImportedContentFacts = {
  bathrooms: number;
  bedrooms: number;
  features: PropertyFeature[];
  interiorSqm: number | null;
  listingMode: ListingMode;
  location: string;
  priceEuro: number;
  rentPriceEuro: number | null;
  sourceDescription: string;
  sourceTitle: string | null;
  type: PropertyType;
};

function generateImportedPropertyContent(facts: ImportedContentFacts) {
  const sourceText = htmlToText(`${facts.sourceTitle ?? ""}. ${facts.sourceDescription}`);
  const typeLabel = getImportedPropertyTypeLabel(facts.type);
  const featureLabels = facts.features.map(getImportedFeatureLabel);
  const qualityPrefix = inferQualityPrefix(sourceText);
  const titleParts = [
    qualityPrefix,
    facts.bedrooms > 0 ? `${facts.bedrooms}-bedroom` : null,
    typeLabel,
    facts.location ? `in ${facts.location}` : null,
  ].filter((item): item is string => Boolean(item));
  const title = titleParts.join(" ").replace(/\s+/g, " ").trim() || cleanTitle(facts.sourceTitle) || "Imported property";
  const detailFacts = [
    facts.bedrooms > 0 ? `${facts.bedrooms} bedroom${facts.bedrooms === 1 ? "" : "s"}` : null,
    facts.bathrooms > 0 ? `${facts.bathrooms} bathroom${facts.bathrooms === 1 ? "" : "s"}` : null,
    facts.interiorSqm ? `${facts.interiorSqm} m2 interior` : null,
  ].filter((item): item is string => Boolean(item));
  const priceLine = facts.listingMode === "rent" && facts.rentPriceEuro
    ? `available to rent from ${formatImportedPrice(facts.rentPriceEuro)}`
    : facts.priceEuro > 0
      ? `listed for ${formatImportedPrice(facts.priceEuro)}`
      : "ready for review";
  const featureSentence = featureLabels.length > 0
    ? `Standout features include ${formatList(featureLabels.slice(0, 5))}.`
    : "The listing has been imported for review with the available source details.";
  const sourceSummary = cleanSourceDescription(facts.sourceDescription, facts.sourceTitle);
  const shortDescription = truncateText(
    [
      `${title} ${priceLine}.`,
      detailFacts.length > 0 ? `It includes ${formatList(detailFacts)}.` : null,
      featureLabels[0] ? `Highlights include ${formatList(featureLabels.slice(0, 3))}.` : null,
    ].filter((item): item is string => Boolean(item)).join(" "),
    220,
  );
  const description = [
    `${title} is a ${typeLabel} ${facts.location ? `in ${facts.location}` : "on the Costa Blanca"} ${priceLine}.`,
    detailFacts.length > 0
      ? `The imported details show ${formatList(detailFacts)}, giving the draft a practical starting point for qualification and presentation.`
      : "The imported source did not expose a full room breakdown, so the draft should be reviewed before publishing.",
    featureSentence,
    sourceSummary
      ? `Source notes: ${sourceSummary}`
      : "Review the original source link and complete any missing lifestyle, condition, community, and availability details before publishing.",
  ].join("\n\n");

  return {
    description,
    features: facts.features,
    shortDescription,
    title,
  };
}

function inferQualityPrefix(text: string) {
  const normalized = normalizeText(text);

  if (/renovated|reformad|reform|capitalnogo|modern|nuevo|new build|obra nueva/.test(normalized)) {
    return "Renovated";
  }

  if (/luxury|lux|premium|exclusive/.test(normalized)) {
    return "Luxury";
  }

  if (/sea view|vistas al mar|sea-view|frontline|beachfront/.test(normalized)) {
    return "Sea-view";
  }

  return "Imported";
}

function getImportedPropertyTypeLabel(type: PropertyType) {
  return {
    apartment: "apartment",
    bungalow: "bungalow",
    finca: "finca",
    penthouse: "penthouse",
    townhouse: "townhouse",
    villa: "villa",
  }[type];
}

function getImportedFeatureLabel(feature: PropertyFeature) {
  return {
    air_conditioning: "air conditioning",
    furnished: "furnishing",
    garage: "garage parking",
    garden: "garden space",
    gated_community: "a gated community",
    heating: "heating",
    lift: "lift access",
    new_build: "new-build condition",
    parking: "parking",
    pet_friendly: "pet-friendly potential",
    pool: "a pool",
    sauna: "sauna facilities",
    sea_view: "sea views",
    terrace: "a terrace",
    tourist_license: "tourist licence potential",
  }[feature];
}

function formatImportedPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "EUR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatList(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function cleanSourceDescription(description: string, title: string | null) {
  const cleaned = htmlToText(description)
    .replace(title ?? "", "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || cleaned.length < 40) {
    return "";
  }

  return truncateText(cleaned, 420);
}

function createImportedPropertyRecord(input: {
  bathrooms: number;
  bedrooms: number;
  description: string;
  features: PropertyFeature[];
  galleryUrls: string[];
  interiorSqm: number | null;
  listingMode: ListingMode;
  location: string;
  mainImageUrl: string;
  plotSqm: number | null;
  priceEuro: number;
  referenceCode: string;
  rentPriceEuro: number | null;
  rentPricePeriod: RentPricePeriod | null;
  shortDescription: string;
  title: string;
  type: PropertyType;
}): PropertyRecord {
  const now = new Date().toISOString();

  return {
    availabilityEnd: null,
    availabilityStart: null,
    bathrooms: input.bathrooms,
    bedrooms: input.bedrooms,
    contentTranslations: {
      en: {
        description: input.description,
        shortDescription: input.shortDescription,
        title: input.title,
      },
    },
    createdAt: now,
    description: input.description,
    featured: false,
    features: input.features,
    galleryUrls: input.galleryUrls,
    id: `imported-${Date.now()}`,
    interiorSqm: input.interiorSqm,
    internalNotes: "",
    listingMode: input.listingMode,
    location: input.location,
    mainImageUrl: input.mainImageUrl,
    plotSqm: input.plotSqm,
    priceEuro: input.priceEuro,
    referenceCode: input.referenceCode,
    rentPriceEuro: input.rentPriceEuro,
    rentPricePeriod: input.rentPricePeriod,
    rentalPeriods: [],
    shortDescription: input.shortDescription,
    slug: slugify(input.title),
    status: "draft",
    title: input.title,
    type: input.type,
    updatedAt: now,
  };
}

function extractReferenceCode(markdown: string) {
  return markdown.match(/Ref:\s*([^\n]+)/i)?.[1]?.trim() ?? null;
}

function extractTitle(lines: string[]) {
  const refIndex = lines.findIndex((line) => line.startsWith("Ref:"));

  if (refIndex >= 0) {
    for (let index = refIndex + 1; index < lines.length; index += 1) {
      const candidate = lines[index];

      if (!candidate || isNoiseLine(candidate)) {
        continue;
      }

      return candidate;
    }
  }

  return null;
}

function extractDescription(markdown: string, title: string | null) {
  const match = markdown.match(/### Descripción([\s\S]+?)(?:Marcar como vendida|Modificar Precio Cambiado|$)/i);
  const block = match?.[1]?.trim();

  if (!block) {
    return title ?? "";
  }

  const cleanedLines = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line !== title)
    .filter((line) => !/^!\[Image /i.test(line))
    .filter((line) => !/^📩/u.test(line));

  return cleanedLines.join("\n\n").trim();
}

function extractShortDescription(description: string, title: string | null) {
  const paragraphs = description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => paragraph !== title)
    .filter((paragraph) => !paragraph.startsWith("🏡"))
    .filter((paragraph) => !paragraph.startsWith("📍"))
    .filter((paragraph) => !paragraph.startsWith("•"));

  return paragraphs[0] ?? title ?? "";
}

function findValueAfterLabel(lines: string[], label: string) {
  const regex = new RegExp(`^${escapeForRegExp(label)}\\s+(.+)$`, "i");

  for (const line of lines) {
    const match = line.match(regex);

    if (match?.[1] && !/^(No indicado|-)+$/i.test(match[1].trim())) {
      return match[1].trim();
    }
  }

  return null;
}

function findHeaderLocation(lines: string[]) {
  const refIndex = lines.findIndex((line) => line.startsWith("Ref:"));

  if (refIndex < 0) {
    return null;
  }

  let seenTitle = false;

  for (let index = refIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (isNoiseLine(line)) {
      continue;
    }

    if (!seenTitle) {
      seenTitle = true;
      continue;
    }

    if (isHeaderValueCandidate(line)) {
      return line;
    }
  }

  return null;
}

function isHeaderValueCandidate(line: string) {
  return (
    !/€/.test(line) &&
    !/^Venta$/i.test(line) &&
    !/^Alquilar$/i.test(line) &&
    !/^Traspaso$/i.test(line) &&
    !/^\d+%$/.test(line) &&
    !/^(Buen estado|A reformar|Obra nueva|Reservada|Vendida)$/i.test(line)
  );
}

function isNoiseLine(line: string) {
  return /^!\[Image /i.test(line) || /^#+\s/.test(line);
}

function extractNumberAfterLabel(lines: string[], label: string) {
  const value = findValueAfterLabel(lines, label);
  const match = value?.match(/(\d+)/);

  return match ? Number(match[1]) : null;
}

function extractSquareMetersAfterLabel(lines: string[], label: string) {
  const value = findValueAfterLabel(lines, label);

  if (!value || /No indicado/i.test(value)) {
    return null;
  }

  const match = value.match(/(\d+(?:[.,]\d+)?)/);

  return match ? Number(match[1].replace(",", ".")) : null;
}

function extractPriceBetween(lines: string[], startLabel: string, endLabel: string) {
  const startIndex = lines.findIndex((line) => line === startLabel);

  if (startIndex < 0) {
    return null;
  }

  const endIndex = lines.findIndex((line, index) => index > startIndex && line === endLabel);
  const block = lines.slice(startIndex + 1, endIndex > startIndex ? endIndex : undefined);
  const prices = block
    .flatMap((line) =>
      Array.from(line.matchAll(/(\d[\d.]*)\s*€/g), (match) =>
        Number(match[1].replace(/\./g, "")),
      ),
    )
    .filter((value) => Number.isFinite(value) && value > 0);

  return prices.at(-1) ?? null;
}

function inferRentPricePeriod(lines: string[]): RentPricePeriod | null {
  const monthHint = lines.find((line) => /^-?\s*€\/mes$/i.test(line) || /mes/i.test(line));

  if (monthHint) {
    return "month";
  }

  return null;
}

function inferRentPrice(text: string) {
  if (!/\b(rent|rental|alquiler|alquilar)\b/i.test(text)) {
    return null;
  }

  return extractPrice(text);
}

function deriveListingMode(salePrice: number, rentPrice: number | null): ListingMode {
  if (salePrice > 0 && rentPrice) {
    return "both";
  }

  if (rentPrice) {
    return "rent";
  }

  return "sale";
}

function extractMarkdownImageUrls(markdown: string) {
  const matches = Array.from(markdown.matchAll(/!\[Image \d+\]\((https?:\/\/[^)\s]+)\)/g), (match) => match[1]);
  return dedupeImageUrls(matches);
}

function extractHtmlImageUrls(html: string, baseUrl: string) {
  if (!html) {
    return [];
  }

  const candidates = [
    ...extractAttributeImageUrls(html),
    ...extractJsonImageUrls(html),
    ...extractSrcsetImageUrls(html),
    ...extractCssImageUrls(html),
    ...extractEscapedImageUrls(html),
  ];

  return dedupeImageUrls(candidates.flatMap((url) => normalizeImageCandidate(url, baseUrl)));
}

function extractJsonImageUrls(html: string) {
  return Array.from(
    html.matchAll(/(?:&quot;|["'])(?:url|image|imageUrl|src|full)(?:&quot;|["'])\s*:\s*(?:&quot;|["'])(https?:\\?\/\\?\/.*?\.(?:avif|gif|jpe?g|png|webp)(?:\?[^"'&<]*)?)(?:&quot;|["'])/gi),
    (match) => match[1],
  );
}

function extractAttributeImageUrls(html: string) {
  return Array.from(
    html.matchAll(
      /\b(?:src|href|data-src|data-original|data-lazy|data-full|data-image|data-url)=["']([^"']+)["']/gi,
    ),
    (match) => match[1],
  );
}

function extractSrcsetImageUrls(html: string) {
  return Array.from(html.matchAll(/\b(?:srcset|data-srcset)=["']([^"']+)["']/gi), (match) => match[1])
    .flatMap((srcset) => srcset.split(","))
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function extractCssImageUrls(html: string) {
  return Array.from(html.matchAll(/url\((["']?)([^"')]+)\1\)/gi), (match) => match[2]);
}

function extractEscapedImageUrls(html: string) {
  return Array.from(html.matchAll(/https?:\\?\/\\?\/[^"'\\\s<>)]+/gi), (match) => match[0]);
}

function normalizeImageCandidate(candidate: string, baseUrl: string) {
  const decoded = decodeHtmlEntities(candidate)
    .replace(/\\\//g, "/")
    .split(/["'<>\s]/)[0]
    .replace(/,$/, "")
    .trim();

  if (
    !decoded ||
    decoded.startsWith("data:") ||
    decoded.startsWith("blob:") ||
    decoded.startsWith("#")
  ) {
    return [];
  }

  try {
    const url = new URL(decoded, baseUrl);
    url.hash = "";
    return [url.toString()];
  } catch {
    return [];
  }
}

function getMetaContent(html: string, key: string) {
  const escapedKey = escapeForRegExp(key);
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapedKey}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtmlEntities(match[1]).trim();
    }
  }

  return null;
}

function getTitleTag(html: string) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];

  return title ? decodeHtmlEntities(title).replace(/\s+/g, " ").trim() : null;
}

function getMarkdownTitle(markdown: string) {
  return markdown.match(/^Title:\s*(.+)$/im)?.[1]?.trim() ?? null;
}

function getMarkdownDescription(markdown: string) {
  const content = markdown.split(/Markdown Content:\s*/i)[1] ?? markdown;
  const paragraph = content
    .split(/\n{2,}/)
    .map((item) => item.replace(/\[[^\]]+\]\([^)]+\)/g, "").trim())
    .find((item) => item.length > 40 && !/^!?\[/.test(item));

  return paragraph ?? null;
}

function cleanTitle(value: string | null) {
  return (value ?? "")
    .replace(/\s+[|–-]\s+(idealista|Dropbox|Navasaez|Beach Home Lux|EspanaTour).*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function createFallbackTitle(url: URL) {
  const pathPart = url.pathname
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/[-_]+/g, " ");

  return pathPart || `${url.hostname} import`;
}

function truncateText(value: string, maxLength: number) {
  const normalized = htmlToText(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function htmlToText(value: string) {
  return decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPrice(text: string) {
  const match =
    text.match(/(?:€|EUR)\s*([0-9][0-9.,\s]*)/i) ??
    text.match(/([0-9][0-9.,\s]*)\s*(?:€|EUR)/i);

  if (!match?.[1]) {
    return null;
  }

  const value = Number(match[1].replace(/\s/g, "").replace(/\.(?=\d{3})/g, "").replace(",", "."));

  return Number.isFinite(value) ? Math.round(value) : null;
}

function extractLabeledNumber(text: string, labels: string[]) {
  const labelPattern = labels.map(escapeForRegExp).join("|");
  const beforeLabel = text.match(new RegExp(`(\\d+)\\s*(?:${labelPattern})`, "i"));
  const afterLabel = text.match(new RegExp(`(?:${labelPattern})\\D{0,20}(\\d+)`, "i"));
  const value = beforeLabel?.[1] ?? afterLabel?.[1];

  return value ? Number(value) : null;
}

function extractSquareMeters(text: string) {
  const match =
    text.match(/(?:built|constructed|area|superficie|sup\.?\s*construida|área construida)\D{0,30}(\d+(?:[.,]\d+)?)\s*m(?:2|²)?/i) ??
    text.match(/(\d+(?:[.,]\d+)?)\s*m(?:2|²)/i);

  return match?.[1] ? Number(match[1].replace(",", ".")) : null;
}

function extractGenericLocation(title: string, description: string) {
  const text = `${title}. ${description}`;
  const match =
    text.match(/\b(?:in|en)\s+([A-ZÁÉÍÓÚÑ][\p{L}\s-]{2,50})(?:[.,|-]|$)/u) ??
    text.match(/\b(Torrevieja|Orihuela Costa|Guardamar del Segura|Cala de Finestrat|Finestrat|Alicante|Costa Blanca)\b/i);

  return match?.[1]?.trim() ?? null;
}

function createReferenceCodeFromUrl(value: string) {
  const url = new URL(value);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const lastPart = pathParts.at(-1) ?? url.hostname;
  const compact = lastPart.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(-10);

  return `IMP-${compact || Date.now()}`;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function mergeImageUrls(...groups: string[][]) {
  return dedupeImageUrls(groups.flat());
}

function dedupeImageUrls(urls: string[]) {
  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    if (!isImportableImageUrl(url)) {
      continue;
    }

    if (seen.has(url)) {
      continue;
    }

    seen.add(url);
    deduped.push(url);
  }

  return deduped;
}

function isImportableImageUrl(url: string) {
  if (ignoredImagePatterns.some((pattern) => pattern.test(url))) {
    return false;
  }

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();

    return (
      /\.(?:avif|gif|jpe?g|png|webp)$/i.test(pathname) ||
      /\/(?:fotos?|images?|imagenes?|photos?)\//i.test(pathname)
    );
  } catch {
    return false;
  }
}

function mapPropertyType(value: string | null): PropertyType {
  const normalized = normalizeText(value);

  if (/adosad|townhouse/i.test(normalized)) {
    return "townhouse";
  }

  if (/villa|chalet/i.test(normalized)) {
    return "villa";
  }

  if (/atico|[áa]tico|penthouse/i.test(normalized)) {
    return "penthouse";
  }

  if (/bungalow|bungal[oó]/i.test(normalized)) {
    return "bungalow";
  }

  if (/finca/i.test(normalized)) {
    return "finca";
  }

  return "apartment";
}

function inferFeatures(markdown: string): PropertyFeature[] {
  const normalized = normalizeText(markdown);
  const featureMatchers: Array<[PropertyFeature, RegExp]> = [
    ["pool", /\bpiscina\b|\bpool\b/],
    ["garage", /\bgaraje\b.*\bsi\b|\bgarage\b/],
    ["parking", /\bparking\b.*\bsi\b/],
    ["terrace", /\bterraza\b|\bsolarium\b|\bsolárium\b|\bterrace\b|\bbalcon\b|\bbalc[oó]n\b/],
    ["garden", /\bjardin\b|\bjard[ií]n\b|\bgarden\b/],
    ["lift", /\bascensor\b|\blift\b/],
    ["furnished", /\bamueblada\b|\bamueblado\b|\bfurnished\b/],
    ["air_conditioning", /\baire acondicionado\b|\bair conditioning\b/],
    ["heating", /\bcalefaccion\b|\bcalefacci[oó]n\b|\bheating\b|\bbomba de calor\b/],
  ];

  return featureMatchers
    .filter(([, pattern]) => pattern.test(normalized))
    .map(([feature]) => feature);
}

function normalizeText(value: string | null) {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
