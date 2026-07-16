export const propertyStatuses = ["draft", "available", "reserved", "sold"] as const;
export const listingModes = ["sale", "rent", "both"] as const;
export const rentPricePeriods = ["night", "week", "month"] as const;
export const rentalPeriodOptions = ["nightly", "weekly", "monthly", "seasonal", "long_term"] as const;
export const propertyTypes = [
  "apartment",
  "villa",
  "townhouse",
  "penthouse",
  "bungalow",
  "finca",
] as const;
export const propertyFeatureOptions = [
  "sauna",
  "pool",
  "sea_view",
  "garage",
  "parking",
  "terrace",
  "garden",
  "lift",
  "furnished",
  "air_conditioning",
  "heating",
  "gated_community",
  "pet_friendly",
  "new_build",
  "tourist_license",
] as const;

// Canonical location list — grouped for a nice <select> with <optgroup>s, and
// the single source of truth for both the admin form and the public filters so
// filtering is exact instead of fuzzy substring matching. Edit freely.
export const propertyLocationGroups = [
  {
    label: "Torrevieja",
    options: [
      "Centro",
      "Playa del Cura",
      "Los Locos",
      "La Mata",
      "Torreblanca",
      "Los Balcones",
      "Aguas Nuevas",
      "El Chaparral",
      "Punta Prima",
    ],
  },
  {
    label: "Orihuela Costa",
    options: ["Orihuela Costa", "La Zenia", "Cabo Roig"],
  },
  {
    label: "Otras zonas",
    options: ["Guardamar del Segura", "Pilar de la Horadada"],
  },
] as const;

export const propertyLocations = propertyLocationGroups.flatMap((group) => group.options) as readonly string[];

export type PropertyStatus = (typeof propertyStatuses)[number];
export type ListingMode = (typeof listingModes)[number];
export type RentPricePeriod = (typeof rentPricePeriods)[number];
export type RentalPeriodOption = (typeof rentalPeriodOptions)[number];
export type PropertyType = (typeof propertyTypes)[number];
export type PropertyFeature = (typeof propertyFeatureOptions)[number];
export type PropertyContentFields = {
  description: string;
  shortDescription: string;
  title: string;
};

export type PropertyContentTranslations = Partial<Record<"en" | "es" | "uk" | "ru" | "de", PropertyContentFields>>;

export type PropertyRecord = {
  availabilityEnd: string | null;
  availabilityStart: string | null;
  bathrooms: number;
  bedrooms: number;
  contentTranslations: PropertyContentTranslations;
  createdAt: string;
  description: string;
  featured: boolean;
  features: PropertyFeature[];
  galleryUrls: string[];
  id: string;
  interiorSqm: number | null;
  internalNotes: string;
  listingMode: ListingMode;
  location: string;
  mainImageUrl: string;
  plotSqm: number | null;
  priceEuro: number;
  referenceCode: string;
  rentPriceEuro: number | null;
  rentPricePeriod: RentPricePeriod | null;
  rentalPeriods: RentalPeriodOption[];
  shortDescription: string;
  slug: string;
  status: PropertyStatus;
  title: string;
  type: PropertyType;
  updatedAt: string;
};

const videoAssetExtensions = new Set(["m4v", "mov", "mp4", "ogg", "webm"]);

export function isVideoAssetUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split(".").pop()?.toLowerCase();

    return Boolean(extension && videoAssetExtensions.has(extension));
  } catch {
    const sanitizedUrl = url.split("?")[0] ?? "";
    const extension = sanitizedUrl.split(".").pop()?.toLowerCase();

    return Boolean(extension && videoAssetExtensions.has(extension));
  }
}

export function getPropertyPreviewImageUrl(property: Pick<PropertyRecord, "galleryUrls" | "mainImageUrl">) {
  if (property.mainImageUrl && !isVideoAssetUrl(property.mainImageUrl)) {
    return property.mainImageUrl;
  }

  return property.galleryUrls.find((url) => !isVideoAssetUrl(url)) ?? null;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatOptionalPrice(value: number | null) {
  return value === null ? null : formatPrice(value);
}

export function getPropertyTypeLabel(type: PropertyType) {
  return {
    apartment: "Apartment",
    villa: "Villa",
    townhouse: "Townhouse",
    penthouse: "Penthouse",
    bungalow: "Bungalow",
    finca: "Finca",
  }[type];
}

export function getPropertyStatusLabel(status: PropertyStatus) {
  return {
    draft: "Draft",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
  }[status];
}
