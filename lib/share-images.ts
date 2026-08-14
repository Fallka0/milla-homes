import { getPublicSiteUrl } from "@/lib/site-urls";

// next.config.ts sets `images.unoptimized`, so next/image will not resize
// anything for us. Instead we ask the origin that already hosts the photo to do
// the work: Unsplash and Supabase Storage both expose a resize API on the URL.
// That gives real responsive srcsets and a correctly sized preview image
// without spending Vercel image-optimizer quota.

/** Widths offered to the browser for the gallery. Tuned for phones on 4G. */
export const galleryWidths = [640, 828, 1080, 1440, 1920] as const;

/** WhatsApp and Telegram both expect a 1.91:1 card image. */
export const ogImageWidth = 1200;
export const ogImageHeight = 630;

type ResizeOptions = {
  width: number;
  height?: number;
  quality: number;
  /** Force JPEG output. Link-preview scrapers are the only consumer of this. */
  forceJpeg?: boolean;
};

function isUnsplashUrl(url: URL) {
  return url.hostname === "images.unsplash.com";
}

function isSupabaseStorageUrl(url: URL) {
  return url.hostname.endsWith(".supabase.co") && url.pathname.includes("/storage/v1/object/public/");
}

function resizeUnsplash(url: URL, { width, height, quality, forceJpeg }: ResizeOptions) {
  const resized = new URL(url.toString());

  resized.searchParams.set("w", String(width));

  if (height) {
    resized.searchParams.set("h", String(height));
  }

  resized.searchParams.set("fit", "crop");
  resized.searchParams.set("q", String(quality));

  if (forceJpeg) {
    // `auto=format` would hand WebP to some clients. Scrapers are happiest with
    // a plain JPEG, so the preview image opts out of content negotiation.
    resized.searchParams.delete("auto");
    resized.searchParams.set("fm", "jpg");
  } else {
    resized.searchParams.set("auto", "format");
  }

  return resized.toString();
}

function resizeSupabase(url: URL, { width, height, quality }: ResizeOptions) {
  const resized = new URL(url.toString());

  resized.pathname = resized.pathname.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  resized.searchParams.set("width", String(width));

  if (height) {
    resized.searchParams.set("height", String(height));
  }

  resized.searchParams.set("resize", "cover");
  resized.searchParams.set("quality", String(quality));

  return resized.toString();
}

/**
 * Returns `source` resized by its own origin, or unchanged when the host has no
 * resize API (local files under /public, for instance).
 */
export function buildResizedImageUrl(source: string, options: ResizeOptions) {
  let url: URL;

  try {
    url = new URL(source, getPublicSiteUrl());
  } catch {
    return source;
  }

  if (isUnsplashUrl(url)) {
    return resizeUnsplash(url, options);
  }

  if (isSupabaseStorageUrl(url)) {
    return resizeSupabase(url, options);
  }

  return source;
}

export function buildGallerySrcSet(source: string) {
  const candidates = galleryWidths.map(
    (width) => `${buildResizedImageUrl(source, { width, quality: 72 })} ${width}w`,
  );
  const first = candidates[0]?.split(" ")[0] ?? source;

  // When the host has no resize API every candidate collapses to the same URL,
  // and an all-identical srcset is worse than none at all.
  const isUseful = new Set(candidates.map((candidate) => candidate.split(" ")[0])).size > 1;

  return {
    src: buildResizedImageUrl(source, { width: 1080, quality: 72 }) || first,
    srcSet: isUseful ? candidates.join(", ") : undefined,
  };
}

/**
 * Absolute https URL for the link-preview card: 1200x630 JPEG, quality tuned to
 * land comfortably under WhatsApp's ~300KB ceiling. Verify with
 * `npm run check:previews`, which measures the real transferred bytes.
 */
export function buildOgImageUrl(source: string) {
  const resized = buildResizedImageUrl(source, {
    width: ogImageWidth,
    height: ogImageHeight,
    quality: 70,
    forceJpeg: true,
  });

  if (resized.startsWith("https://")) {
    return resized;
  }

  // Local /public asset — make it absolute, which og:image requires.
  return getPublicSiteUrl(resized.startsWith("/") ? resized : `/${resized}`);
}
