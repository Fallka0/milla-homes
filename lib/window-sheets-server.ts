// Server-only mapping from Supabase PropertyRecord -> SheetProperty.
// Pulls in lib/properties (Supabase service client + next/headers), so it must
// never be imported from a client component — doing so fails the client build.
import { getAdminProperties, localizeProperty } from "@/lib/properties";
import { isVideoAssetUrl, type PropertyRecord } from "@/lib/property-shared";
import { getPublicSiteUrl } from "@/lib/site-urls";
import {
  DEFAULT_PHONE,
  DEFAULT_WEB,
  sheetPriceAndStatus,
  type SheetListItem,
  type SheetProperty,
} from "@/lib/window-sheets";

// Ordered, de-duplicated image URLs: hero (main_image_url) first, then gallery.
function collectPhotos(record: PropertyRecord): string[] {
  const ordered = [record.mainImageUrl, ...record.galleryUrls].filter(
    (url): url is string => Boolean(url) && !isVideoAssetUrl(url),
  );

  return Array.from(new Set(ordered));
}

export function mapRecordToSheet(record: PropertyRecord): SheetProperty {
  // Spanish content: prefer the es translation, fall back to the base fields.
  const localized = localizeProperty(record, "es");
  const { status, price } = sheetPriceAndStatus({
    listingMode: record.listingMode,
    priceEuro: record.priceEuro,
    rentPriceEuro: record.rentPriceEuro,
    rentPricePeriod: record.rentPricePeriod,
  });

  return {
    status,
    location: localized.location,
    title: localized.title,
    price,
    beds: record.bedrooms,
    baths: record.bathrooms,
    area: record.interiorSqm ?? 0,
    desc: localized.shortDescription || localized.description,
    phone: DEFAULT_PHONE,
    web: DEFAULT_WEB,
    listingUrl: getPublicSiteUrl(`/properties/${record.slug}`),
    photos: collectPhotos(record),
  };
}

export type WindowSheetData = {
  listings: SheetListItem[];
  sheetsById: Record<string, SheetProperty>;
};

// Everything the client tool needs: the picker list + a pre-mapped sheet per
// listing so auto-fill and batch export are instant (no per-select round trip).
export async function getWindowSheetData(): Promise<WindowSheetData> {
  const records = await getAdminProperties();

  const listings: SheetListItem[] = [];
  const sheetsById: Record<string, SheetProperty> = {};

  for (const record of records) {
    listings.push({
      id: record.id,
      slug: record.slug,
      title: record.title,
      location: record.location,
      reference: record.referenceCode,
    });
    sheetsById[record.id] = mapRecordToSheet(record);
  }

  return { listings, sheetsById };
}
