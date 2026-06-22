// Client-safe data layer for the window-sheet generator.
//
// IMPORTANT: this module must stay free of server-only imports (no next/headers,
// no Supabase server client) so it can be bundled into the client tool. The
// PropertyRecord -> SheetProperty mapping that needs server helpers lives in
// `lib/window-sheets-server.ts`.

import { formatPrice } from "@/lib/property-shared";

export type WindowSheetPreset = "poster" | "gallery" | "boutique";

// The exact shape the WindowSheet component (and reference/sampleProperty.js) expects.
export type SheetProperty = {
  status: string; // badge text, e.g. "En venta" | "En alquiler"
  location: string; // e.g. "Punta Prima · Torrevieja"
  title: string;
  price: string; // formatted, e.g. "240.000 €" (€ kept on the same line by the component)
  beds: number;
  baths: number;
  area: number; // built m²
  desc: string;
  phone: string;
  web: string;
  listingUrl: string; // encoded into the QR
  photos: string[]; // ordered; photos[0] is the hero
};

// Lightweight item for the searchable listing picker.
export type SheetListItem = {
  id: string;
  slug: string;
  title: string;
  location: string;
  reference: string;
};

// One sheet to render/print.
export type WindowSheetJob = {
  slug: string;
  preset: WindowSheetPreset;
  sheet: SheetProperty;
};

export const DEFAULT_PHONE = "+34 652 679 443";
export const DEFAULT_WEB = "milla-homes.com";

export const PRINT_STORAGE_KEY = "mh-window-sheets-print";

export const WINDOW_SHEET_PRESETS: { id: WindowSheetPreset; label: string }[] = [
  { id: "poster", label: "Póster sereno" },
  { id: "gallery", label: "Galería" },
  { id: "boutique", label: "Boutique enmarcada" },
];

export function formatSheetPrice(value: number) {
  // formatPrice yields "240.000 €" — matches the brief's example exactly.
  return formatPrice(value);
}

const rentPeriodSuffix: Record<string, string> = {
  night: "/noche",
  week: "/semana",
  month: "/mes",
};

// Maps the listing's sale/rent mode into the Spanish badge + a formatted price string.
export function sheetPriceAndStatus(input: {
  listingMode: string;
  priceEuro: number;
  rentPriceEuro: number | null;
  rentPricePeriod: string | null;
}): { status: string; price: string } {
  if (input.listingMode === "rent" && input.rentPriceEuro) {
    const suffix = input.rentPricePeriod ? rentPeriodSuffix[input.rentPricePeriod] ?? "" : "";
    return { status: "En alquiler", price: `${formatSheetPrice(input.rentPriceEuro)}${suffix}` };
  }

  return { status: "En venta", price: formatSheetPrice(input.priceEuro) };
}

export function blankSheet(): SheetProperty {
  return {
    status: "En venta",
    location: "",
    title: "",
    price: "",
    beds: 0,
    baths: 0,
    area: 0,
    desc: "",
    phone: DEFAULT_PHONE,
    web: DEFAULT_WEB,
    listingUrl: "",
    photos: [],
  };
}

// Default filename (without extension) for a single exported sheet.
export function sheetFileName(slug: string, preset: WindowSheetPreset) {
  const safeSlug = (slug || "ficha").replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return `milla-homes-${safeSlug || "ficha"}-${preset}`;
}
