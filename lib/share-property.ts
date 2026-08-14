import sharePropertiesData from "@/data/share-properties.json";

// Shareable property pages (/p/[slug]) are deliberately independent of the
// Supabase-backed catalogue under /properties. Everything an agent sends to a
// buyer lives in one hand-edited JSON file so there is no CMS, no database
// round trip, and no admin screen between writing a listing and sharing it.

export const shareLocales = ["es", "en", "ru", "de"] as const;

export type ShareLocale = (typeof shareLocales)[number];

// The language served at the bare /p/[slug] URL. Every other language lives at
// /p/[slug]/<locale>, and this one is the canonical + x-default target.
export const defaultShareLocale: ShareLocale = "en";

export function isShareLocale(value: string): value is ShareLocale {
  return shareLocales.includes(value as ShareLocale);
}

/**
 * The root layout renders <html lang>, but it sits above the [lang] segment and
 * cannot read it. proxy.ts resolves the locale from the path and forwards it on
 * this header so the document language matches the content the buyer is reading.
 */
export const shareLocaleHeaderName = "x-milla-share-locale";

/** Locale for a /p/... pathname, or null when the path is not a share page. */
export function getShareLocaleFromPathname(pathname: string): ShareLocale | null {
  const match = /^\/p\/[^/]+(?:\/([^/]+))?\/?$/.exec(pathname);

  if (!match) {
    return null;
  }

  const segment = match[1];

  if (!segment) {
    return defaultShareLocale;
  }

  return isShareLocale(segment) ? segment : null;
}

export function resolveShareLocale(value?: string | null): ShareLocale {
  return value && isShareLocale(value) ? value : defaultShareLocale;
}

/** Every user-facing string is hand-written once per language. */
export type ShareLocalizedText = Record<ShareLocale, string>;

export type SharePoolKind = "private" | "communal" | "none";

/**
 * Facts shown in the key-facts row. Numbers only — the units and labels are
 * localized in lib/share-copy.ts so the JSON never repeats them.
 */
export type SharePropertyFacts = {
  bathrooms: number;
  bedrooms: number;
  /** Interior built area in m². */
  builtSqm: number;
  /** Plot area in m². `null` for apartments and anything without a plot. */
  plotSqm: number | null;
  pool: SharePoolKind;
  /** Walking distance to the nearest beach, in metres. Rendered as m or km. */
  beachDistanceMeters: number;
};

export type SharePropertyAgent = {
  name: string;
  /**
   * Absolute https URL or a path under /public — square crops look best. Set it
   * to null and the page renders the agent's initials instead, which is the
   * right choice until a real headshot exists.
   */
  photoUrl: string | null;
  /** E.164, digits and a leading +. Drives both the WhatsApp and tel: links. */
  phone: string;
};

/** The per-language content block. All four are required — no fallbacks. */
export type SharePropertyContent = {
  title: string;
  town: string;
  shortDescription: string;
};

export type ShareProperty = {
  /** URL segment: /p/<slug>. Lowercase, hyphenated, never changes once shared. */
  slug: string;
  /** Reference shown on the page and prefilled into the WhatsApp message. */
  reference: string;
  priceEuro: number;
  /**
   * Gallery image URLs, main image first. Sized variants are derived from these
   * at render time (see lib/share-images.ts), so store the largest original.
   */
  images: string[];
  /**
   * Optional override for the link-preview image. Leave it out and the main
   * gallery image is cropped to 1200x630 automatically; set it when the main
   * photo does not survive a landscape crop.
   */
  ogImage?: string;
  facts: SharePropertyFacts;
  agent: SharePropertyAgent;
  content: Record<ShareLocale, SharePropertyContent>;
  /** ISO date, used for sitemap lastModified. */
  updatedAt: string;
};

const shareProperties = sharePropertiesData as ShareProperty[];

export function getShareProperties(): ShareProperty[] {
  return shareProperties;
}

export function getSharePropertyBySlug(slug: string): ShareProperty | null {
  return shareProperties.find((property) => property.slug === slug) ?? null;
}

export function getSharePropertyContent(property: ShareProperty, locale: ShareLocale) {
  return property.content[locale];
}

/**
 * Canonical path for a property in a given language. The default language sits
 * at the bare /p/[slug] so the link an agent copies is as short as possible.
 */
export function getSharePropertyPath(slug: string, locale: ShareLocale) {
  return locale === defaultShareLocale ? `/p/${slug}` : `/p/${slug}/${locale}`;
}

export function formatSharePrice(priceEuro: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(priceEuro);
}

/** Metres under 1 km, otherwise one decimal of a kilometre. */
export function formatBeachDistance(meters: number, locale: ShareLocale) {
  if (meters < 1000) {
    return `${new Intl.NumberFormat(locale).format(meters)} m`;
  }

  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(meters / 1000)} km`;
}

export function formatShareArea(sqm: number, locale: ShareLocale) {
  return `${new Intl.NumberFormat(locale).format(sqm)} m²`;
}
