import { createHash } from "node:crypto";

import { type PublicLocale } from "@/lib/public-copy";
import {
  listingModes,
  propertyFeatureOptions,
  propertyStatuses,
  propertyTypes,
  rentalPeriodOptions,
  rentPricePeriods,
  type PropertyContentFields,
  type PropertyContentTranslations,
  type ListingMode,
  type PropertyFeature,
  type PropertyRecord,
  type PropertyStatus,
  type PropertyType,
  type RentalPeriodOption,
  type RentPricePeriod,
} from "@/lib/property-shared";
import { createAdminClient } from "@/lib/supabase/server";

const propertyTranslationVersion = "v2-per-field-language-detection";

type PropertyRow = {
  availability_end: string | null;
  availability_start: string | null;
  bathrooms: number | string | null;
  bedrooms: number | string | null;
  content_translation_source_hash: string | null;
  content_translations: PropertyContentTranslations | null;
  created_at: string | null;
  description: string | null;
  featured: boolean | null;
  features: string[] | null;
  gallery_urls: string[] | null;
  id: string;
  interior_sqm: number | string | null;
  internal_notes: string | null;
  listing_mode: string | null;
  location: string | null;
  main_image_url: string | null;
  plot_sqm: number | string | null;
  price_eur: number | string | null;
  reference_code: string | null;
  rent_price_eur: number | string | null;
  rent_price_period: string | null;
  rental_periods: string[] | null;
  short_description: string | null;
  slug: string | null;
  status: string | null;
  title: string | null;
  property_type: string | null;
  updated_at: string | null;
};

export const sampleProperties: PropertyRecord[] = [
  {
    id: "sample-la-mata-apartment",
    referenceCode: "VR-101",
    title: "Sea-view apartment near La Mata beach",
    slug: "sea-view-apartment-la-mata",
    location: "La Mata, Torrevieja",
    priceEuro: 289000,
    rentPriceEuro: 1850,
    rentPricePeriod: "week",
    bedrooms: 3,
    bathrooms: 2,
    interiorSqm: 96,
    plotSqm: null,
    type: "apartment",
    listingMode: "both",
    status: "available",
    featured: true,
    features: ["sea_view", "terrace", "air_conditioning", "furnished"],
    internalNotes: "Strong fit for summer rentals. Owner prefers 48h notice before viewings.",
    rentalPeriods: ["weekly", "seasonal"],
    availabilityStart: "2026-05-01",
    availabilityEnd: "2026-09-30",
    shortDescription:
      "Bright three-bedroom apartment with open terrace, sea views, and easy walking distance to the beach.",
    description:
      "This bright apartment combines an airy living area, generous terrace, and a practical three-bedroom layout ideal for buyers looking for a turnkey coastal base in La Mata. It is close to the promenade, restaurants, and everyday services.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    contentTranslations: {
      en: {
        title: "Sea-view apartment near La Mata beach",
        shortDescription:
          "Bright three-bedroom apartment with open terrace, sea views, and easy walking distance to the beach.",
        description:
          "This bright apartment combines an airy living area, generous terrace, and a practical three-bedroom layout ideal for buyers looking for a turnkey coastal base in La Mata. It is close to the promenade, restaurants, and everyday services.",
      },
    },
    createdAt: "2026-04-20T08:00:00.000Z",
    updatedAt: "2026-04-20T08:00:00.000Z",
  },
  {
    id: "sample-villa-los-balcones",
    referenceCode: "VR-102",
    title: "Detached villa with pool in Los Balcones",
    slug: "detached-villa-los-balcones",
    location: "Los Balcones, Torrevieja",
    priceEuro: 525000,
    rentPriceEuro: null,
    rentPricePeriod: null,
    bedrooms: 4,
    bathrooms: 3,
    interiorSqm: 184,
    plotSqm: 420,
    type: "villa",
    listingMode: "sale",
    status: "available",
    featured: true,
    features: ["pool", "garden", "garage", "air_conditioning"],
    internalNotes: "Owners flexible on closing timeline. Highlight family layout in viewings.",
    rentalPeriods: [],
    availabilityStart: null,
    availabilityEnd: null,
    shortDescription:
      "Detached family villa with private pool, spacious outdoor areas, and a layout that works year-round.",
    description:
      "Designed for buyers who want extra space and privacy, this detached villa in Los Balcones offers generous indoor living, a separate dining area, private pool, and room for entertaining outside.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    contentTranslations: {
      en: {
        title: "Detached villa with pool in Los Balcones",
        shortDescription:
          "Detached family villa with private pool, spacious outdoor areas, and a layout that works year-round.",
        description:
          "Designed for buyers who want extra space and privacy, this detached villa in Los Balcones offers generous indoor living, a separate dining area, private pool, and room for entertaining outside.",
      },
    },
    createdAt: "2026-04-19T08:00:00.000Z",
    updatedAt: "2026-04-19T08:00:00.000Z",
  },
  {
    id: "sample-penthouse-punta-prima",
    referenceCode: "VR-103",
    title: "Modern penthouse close to Punta Prima",
    slug: "modern-penthouse-punta-prima",
    location: "Punta Prima, Orihuela Costa",
    priceEuro: 349000,
    rentPriceEuro: 1650,
    rentPricePeriod: "month",
    bedrooms: 2,
    bathrooms: 2,
    interiorSqm: 88,
    plotSqm: null,
    type: "penthouse",
    listingMode: "both",
    status: "reserved",
    featured: false,
    features: ["terrace", "sea_view", "lift", "tourist_license"],
    internalNotes: "Investor profile. Keep rental yield figures ready for follow-ups.",
    rentalPeriods: ["monthly", "long_term"],
    availabilityStart: "2026-10-01",
    availabilityEnd: "2027-03-31",
    shortDescription:
      "Modern top-floor home with strong rental appeal, generous sunlight, and quick access to the coast.",
    description:
      "A clean-lined penthouse positioned for both lifestyle buyers and second-home investors. The property offers a functional open plan, sunny terraces, and convenient access to Punta Prima and Torrevieja.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],
    contentTranslations: {
      en: {
        title: "Modern penthouse close to Punta Prima",
        shortDescription:
          "Modern top-floor home with strong rental appeal, generous sunlight, and quick access to the coast.",
        description:
          "A clean-lined penthouse positioned for both lifestyle buyers and second-home investors. The property offers a functional open plan, sunny terraces, and convenient access to Punta Prima and Torrevieja.",
      },
    },
    createdAt: "2026-04-18T08:00:00.000Z",
    updatedAt: "2026-04-18T08:00:00.000Z",
  },
];

const localizedSamplePropertyContent: Partial<
  Record<
    PublicLocale,
    Record<
      string,
      {
        description: string;
        shortDescription: string;
        title: string;
      }
    >
  >
> = {
  es: {
    "sample-la-mata-apartment": {
      title: "Apartamento con vistas al mar cerca de la playa de La Mata",
      shortDescription:
        "Luminoso apartamento de tres dormitorios con terraza abierta, vistas al mar y cómoda distancia a pie de la playa.",
      description:
        "Este apartamento luminoso combina una zona de estar amplia, una terraza generosa y una distribución práctica de tres dormitorios, ideal para compradores que buscan una base costera lista para entrar a vivir en La Mata. Está cerca del paseo marítimo, restaurantes y servicios diarios.",
    },
    "sample-villa-los-balcones": {
      title: "Villa independiente con piscina en Los Balcones",
      shortDescription:
        "Villa familiar independiente con piscina privada, amplios espacios exteriores y una distribución cómoda todo el año.",
      description:
        "Pensada para compradores que buscan más espacio y privacidad, esta villa independiente en Los Balcones ofrece amplias zonas interiores, comedor separado, piscina privada y espacio exterior para recibir invitados.",
    },
    "sample-penthouse-punta-prima": {
      title: "Ático moderno cerca de Punta Prima",
      shortDescription:
        "Vivienda moderna en la última planta con buena proyección de alquiler, mucha luz y acceso rápido a la costa.",
      description:
        "Un ático de líneas limpias pensado tanto para compradores de estilo de vida como para quienes buscan una segunda residencia. La propiedad ofrece una distribución abierta funcional, terrazas soleadas y acceso cómodo a Punta Prima y Torrevieja.",
    },
  },
  ru: {
    "sample-la-mata-apartment": {
      title: "Апартаменты с видом на море рядом с пляжем Ла Мата",
      shortDescription:
        "Светлая квартира с тремя спальнями, открытой террасой, видом на море и удобной пешей дорогой до пляжа.",
      description:
        "Эти светлые апартаменты объединяют просторную гостиную, большую террасу и удобную планировку с тремя спальнями. Это хороший вариант для покупателей, которым нужна готовая к проживанию база у моря в Ла Мата. Рядом находятся набережная, рестораны и все повседневные сервисы.",
    },
    "sample-villa-los-balcones": {
      title: "Отдельная вилла с бассейном в Лос Балконес",
      shortDescription:
        "Семейная вилла с частным бассейном, просторными внешними зонами и планировкой для круглогодичного проживания.",
      description:
        "Эта отдельная вилла в Лос Балконес подойдет покупателям, которым нужны пространство и приватность. Внутри много жилой площади, есть отдельная столовая зона, частный бассейн и удобные открытые пространства для отдыха и встреч.",
    },
    "sample-penthouse-punta-prima": {
      title: "Современный пентхаус рядом с Пунта Прима",
      shortDescription:
        "Современное жилье на верхнем этаже с хорошим арендным потенциалом, большим количеством света и быстрым доступом к побережью.",
      description:
        "Современный пентхаус для тех, кто ищет комфортное жилье у моря или вторую резиденцию. В объекте предусмотрены удобная открытая планировка, солнечные террасы и быстрый доступ к Пунта Прима и Торревьехе.",
    },
  },
  de: {
    "sample-la-mata-apartment": {
      title: "Apartment mit Meerblick nahe dem Strand von La Mata",
      shortDescription:
        "Helles Apartment mit drei Schlafzimmern, offener Terrasse, Meerblick und kurzem Fußweg zum Strand.",
      description:
        "Dieses helle Apartment verbindet einen luftigen Wohnbereich, eine großzügige Terrasse und einen praktischen Grundriss mit drei Schlafzimmern. Es eignet sich ideal für Käufer, die in La Mata ein sofort nutzbares Zuhause an der Küste suchen. Promenade, Restaurants und tägliche Besorgungen sind schnell erreichbar.",
    },
    "sample-villa-los-balcones": {
      title: "Freistehende Villa mit Pool in Los Balcones",
      shortDescription:
        "Freistehende Familienvilla mit privatem Pool, großzügigen Außenflächen und einem Grundriss für das ganze Jahr.",
      description:
        "Für Käufer, die mehr Platz und Privatsphäre suchen, bietet diese freistehende Villa in Los Balcones großzügige Wohnflächen, einen separaten Essbereich, einen privaten Pool und viel Raum im Außenbereich.",
    },
    "sample-penthouse-punta-prima": {
      title: "Modernes Penthouse nahe Punta Prima",
      shortDescription:
        "Modernes Zuhause im obersten Geschoss mit guter Vermietbarkeit, viel Licht und schnellem Zugang zur Küste.",
      description:
        "Ein klar gestaltetes Penthouse für Lifestyle-Käufer und Zweitwohnsitz-Interessenten. Die Immobilie bietet einen funktionalen offenen Grundriss, sonnige Terrassen und eine bequeme Anbindung an Punta Prima und Torrevieja.",
    },
  },
};

export function localizeProperty(property: PropertyRecord, locale: PublicLocale): PropertyRecord {
  const translated = property.contentTranslations[locale];

  if (translated) {
    return {
      ...property,
      ...translated,
    };
  }

  const localized = localizedSamplePropertyContent[locale]?.[property.id];

  if (!localized) {
    return property;
  }

  return {
    ...property,
    ...localized,
  };
}

export function localizeProperties(properties: PropertyRecord[], locale: PublicLocale) {
  return properties.map((property) => localizeProperty(property, locale));
}

function coerceNumber(value: number | string | null) {
  if (value === null || value === "") {
    return null;
  }

  const numeric = Number(value);

  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeContentTranslations(
  value: PropertyContentTranslations | null,
  baseContent: PropertyContentFields,
): PropertyContentTranslations {
  const translations = value ?? {};

  return {
    en: {
      title: translations.en?.title?.trim() || baseContent.title,
      shortDescription: translations.en?.shortDescription?.trim() || baseContent.shortDescription,
      description: translations.en?.description?.trim() || baseContent.description,
    },
    es: translations.es,
    ru: translations.ru,
    de: translations.de,
  };
}

function normalizePropertyRow(row: PropertyRow): PropertyRecord {
  const type = row.property_type;
  const status = row.status;
  const listingMode = row.listing_mode;
  const isRentListing = listingMode === "rent" || listingMode === "both";
  const rentPriceEuro = coerceNumber(row.rent_price_eur);
  // Older rent listings were saved without a period; monthly is the default.
  const rentPricePeriod =
    row.rent_price_period ?? (isRentListing && rentPriceEuro ? "month" : null);
  const baseContent = {
    title: row.title ?? "Untitled property",
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
  };

  return {
    id: row.id,
    availabilityEnd: row.availability_end,
    availabilityStart: row.availability_start,
    referenceCode: row.reference_code ?? "VR-000",
    title: baseContent.title,
    slug: row.slug ?? "untitled-property",
    location: row.location ?? "Torrevieja",
    priceEuro: coerceNumber(row.price_eur) ?? 0,
    bedrooms: coerceNumber(row.bedrooms) ?? 0,
    bathrooms: coerceNumber(row.bathrooms) ?? 0,
    interiorSqm: coerceNumber(row.interior_sqm),
    internalNotes: row.internal_notes ?? "",
    listingMode: listingModes.includes(listingMode as ListingMode) ? (listingMode as ListingMode) : "sale",
    plotSqm: coerceNumber(row.plot_sqm),
    type: propertyTypes.includes(type as PropertyType) ? (type as PropertyType) : "apartment",
    status: propertyStatuses.includes(status as PropertyStatus)
      ? (status as PropertyStatus)
      : "draft",
    featured: Boolean(row.featured),
    features: (row.features ?? []).filter((feature): feature is PropertyFeature =>
      propertyFeatureOptions.includes(feature as PropertyFeature),
    ),
    shortDescription: baseContent.shortDescription,
    description: baseContent.description,
    mainImageUrl: row.main_image_url ?? sampleProperties[0].mainImageUrl,
    galleryUrls: row.gallery_urls ?? [],
    rentPriceEuro,
    rentPricePeriod: rentPricePeriods.includes(rentPricePeriod as RentPricePeriod)
      ? (rentPricePeriod as RentPricePeriod)
      : null,
    rentalPeriods: (row.rental_periods ?? []).filter((period): period is RentalPeriodOption =>
      rentalPeriodOptions.includes(period as RentalPeriodOption),
    ),
    contentTranslations: normalizeContentTranslations(row.content_translations, baseContent),
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function sortProperties(properties: PropertyRecord[]) {
  return [...properties].sort((left, right) => {
    if (left.featured !== right.featured) {
      return left.featured ? -1 : 1;
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}

async function getPropertiesFromDatabase() {
  const supabase = createAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  return (data as PropertyRow[]).map(normalizePropertyRow);
}

export async function getPublicProperties() {
  const properties = (await getPropertiesFromDatabase()) ?? sampleProperties;

  return sortProperties(
    properties.filter((property) => property.status === "available" || property.status === "reserved"),
  );
}

export async function getFeaturedProperties(limit = 3) {
  const properties = await getPublicProperties();
  const featured = properties.filter((property) => property.featured);

  return (featured.length > 0 ? featured : properties).slice(0, limit);
}

export async function getLatestPublicProperties(limit = 6) {
  const properties = await getPublicProperties();

  return properties.slice(0, limit);
}

export async function getPropertyBySlug(slug: string) {
  const properties = await getPublicProperties();

  return properties.find((property) => property.slug === slug) ?? null;
}

export async function getAdminProperties() {
  const properties = (await getPropertiesFromDatabase()) ?? sampleProperties;

  return sortProperties(properties);
}

export async function getAdminPropertyById(id: string) {
  const properties = await getAdminProperties();

  return properties.find((property) => property.id === id) ?? null;
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

function parseIntegerField(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseGalleryUrls(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseStringArray(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parsePropertyFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const referenceCode = String(formData.get("referenceCode") ?? "").trim().toUpperCase();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const galleryUrls = parseGalleryUrls(formData.get("galleryUrls"));
  const mainImageUrl = String(formData.get("mainImageUrl") ?? "").trim() || galleryUrls[0] || "";
  const slug = slugify(rawSlug || title) || slugify(referenceCode) || `property-${Date.now()}`;
  const typeValue = String(formData.get("type") ?? "apartment");
  const listingModeValue = String(formData.get("listingMode") ?? "sale");
  const rentPricePeriodValue = String(formData.get("rentPricePeriod") ?? "");
  const statusValue = String(formData.get("status") ?? "draft");
  const features = parseStringArray(formData.get("features")).filter((feature): feature is PropertyFeature =>
    propertyFeatureOptions.includes(feature as PropertyFeature),
  );
  const rentalPeriods = parseStringArray(formData.get("rentalPeriods")).filter((period): period is RentalPeriodOption =>
    rentalPeriodOptions.includes(period as RentalPeriodOption),
  );
  const listingMode = listingModes.includes(listingModeValue as ListingMode) ? listingModeValue : "sale";
  const rentPriceEuro = parseIntegerField(formData.get("rentPriceEuro"));
  // Rent listings default to a monthly period so the public price is never ambiguous.
  const rentPricePeriod = rentPricePeriods.includes(rentPricePeriodValue as RentPricePeriod)
    ? rentPricePeriodValue
    : (listingMode === "rent" || listingMode === "both") && rentPriceEuro
      ? "month"
      : null;

  return {
    availability_end: String(formData.get("availabilityEnd") ?? "").trim() || null,
    availability_start: String(formData.get("availabilityStart") ?? "").trim() || null,
    reference_code: referenceCode,
    title,
    slug,
    location: String(formData.get("location") ?? "").trim(),
    price_eur: parseIntegerField(formData.get("priceEuro")) ?? 0,
    bedrooms: parseIntegerField(formData.get("bedrooms")) ?? 0,
    bathrooms: parseIntegerField(formData.get("bathrooms")) ?? 0,
    interior_sqm: parseIntegerField(formData.get("interiorSqm")),
    internal_notes: String(formData.get("internalNotes") ?? "").trim(),
    listing_mode: listingMode,
    plot_sqm: parseIntegerField(formData.get("plotSqm")),
    property_type: propertyTypes.includes(typeValue as PropertyType)
      ? typeValue
      : "apartment",
    status: propertyStatuses.includes(statusValue as PropertyStatus) ? statusValue : "draft",
    featured: formData.get("featured") === "on",
    features,
    rent_price_eur: rentPriceEuro,
    rent_price_period: rentPricePeriod,
    rental_periods: rentalPeriods,
    short_description: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    main_image_url: mainImageUrl,
    gallery_urls: galleryUrls,
    updated_at: new Date().toISOString(),
  };
}

export function buildPropertyContentFromInput(input: ReturnType<typeof parsePropertyFormData>): PropertyContentFields {
  return {
    title: input.title,
    shortDescription: input.short_description,
    description: input.description,
  };
}

export function buildPropertyContentFromRecord(property: PropertyRecord): PropertyContentFields {
  return {
    title: property.title,
    shortDescription: property.shortDescription,
    description: property.description,
  };
}

export function createPropertyContentHash(content: PropertyContentFields) {
  return createHash("sha256")
    .update(JSON.stringify({ content, propertyTranslationVersion }))
    .digest("hex");
}

export function validatePropertyInput(input: ReturnType<typeof parsePropertyFormData>) {
  const missingFields = [
    !input.reference_code ? "reference" : null,
    !input.title ? "title" : null,
    !input.slug ? "slug" : null,
    !input.location ? "location" : null,
    !input.main_image_url ? "main image" : null,
  ].filter(Boolean);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}.`);
  }

  if ((input.listing_mode === "rent" || input.listing_mode === "both") && !input.rent_price_eur) {
    throw new Error("Missing required fields: rent price.");
  }

  if ((input.listing_mode === "rent" || input.listing_mode === "both") && !input.availability_start) {
    throw new Error("Missing required fields: rent availability start.");
  }
}
