import { sendTourRequestAdminEmail } from "@/lib/booking-email";
import { isValidIsoDate } from "@/lib/bookings";
import { getPublicProperties, localizeProperty } from "@/lib/properties";
import { formatOptionalPrice, formatPrice } from "@/lib/property-shared";
import { type PublicLocale } from "@/lib/public-copy";
import { createAdminClient } from "@/lib/supabase/server";

const languageNames: Record<PublicLocale, string> = {
  en: "English",
  es: "Spanish",
  uk: "Ukrainian",
  ru: "Russian",
  de: "German",
};

function priceLine(property: ReturnType<typeof localizeProperty>): string {
  const parts: string[] = [];
  if (property.listingMode === "sale" || property.listingMode === "both") {
    parts.push(`sale ${formatPrice(property.priceEuro)}`);
  }
  if ((property.listingMode === "rent" || property.listingMode === "both") && property.rentPriceEuro) {
    parts.push(`rent ${formatOptionalPrice(property.rentPriceEuro)}/${property.rentPricePeriod ?? "month"}`);
  }
  return parts.join(" · ") || "price on request";
}

function describeProperty(property: ReturnType<typeof localizeProperty>): string {
  return [
    `Title: ${property.title}`,
    `Reference: ${property.referenceCode}`,
    `Location: ${property.location}`,
    `Type: ${property.type}`,
    `Listing: ${property.listingMode} (${priceLine(property)})`,
    `Bedrooms: ${property.bedrooms} · Bathrooms: ${property.bathrooms}`,
    property.interiorSqm ? `Interior: ${property.interiorSqm} m²` : null,
    property.plotSqm ? `Plot: ${property.plotSqm} m²` : null,
    property.features.length ? `Features: ${property.features.join(", ")}` : null,
    property.availabilityStart ? `Available from: ${property.availabilityStart}` : null,
    `Description: ${property.description || property.shortDescription}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export type ConciergeContext = {
  property: { id: string; title: string } | null;
  systemPrompt: string;
};

export async function buildConciergeContext(
  propertyId: string,
  locale: PublicLocale,
): Promise<ConciergeContext> {
  const properties = await getPublicProperties();
  const current = properties.find((p) => p.id === propertyId) ?? null;
  const localizedCurrent = current ? localizeProperty(current, locale) : null;

  const catalog = properties
    .filter((p) => p.id !== propertyId)
    .slice(0, 30)
    .map((p) => {
      const lp = localizeProperty(p, locale);
      return `- ${lp.title} — ${lp.location}, ${lp.bedrooms}bd/${lp.bathrooms}ba, ${priceLine(lp)} [/properties/${lp.slug}]`;
    })
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);

  const systemPrompt = [
    "You are the digital concierge for Milla Homes, a boutique estate agency on the Costa Blanca (Torrevieja, Spain).",
    "Help the visitor warmly and briefly. Keep replies to 2–4 short sentences.",
    "",
    "STRICT RULES — follow exactly:",
    `- Reply ONLY in ${languageNames[locale]}.`,
    "- Use ONLY the property data and catalog below. NEVER invent or guess prices, sizes, availability, fees, taxes, or legal facts.",
    "- If the answer is not in the data, say you'll connect them with a Milla Homes agent — do not make anything up.",
    "- To arrange a visit, offer to book a viewing, collect the visitor's name, email, a preferred date (format YYYY-MM-DD) and optional time, then call the book_viewing tool.",
    "- Never say a viewing is confirmed unless the book_viewing tool has returned success.",
    `- Today's date is ${today}. Do not book dates in the past.`,
    "",
    localizedCurrent ? "THIS PROPERTY:" : "No specific property is in context; help generally from the catalog.",
    localizedCurrent ? describeProperty(localizedCurrent) : "",
    "",
    "OTHER AVAILABLE LISTINGS (for suggestions, link with the given path):",
    catalog || "(none)",
  ].join("\n");

  return {
    property: localizedCurrent ? { id: localizedCurrent.id, title: localizedCurrent.title } : null,
    systemPrompt,
  };
}

export type BookViewingArgs = {
  date: string;
  email: string;
  name: string;
  notes?: string;
  phone?: string;
  time?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createTourFromConcierge(
  propertyId: string,
  locale: PublicLocale,
  args: BookViewingArgs,
): Promise<{ booked: boolean; reason?: string }> {
  const name = args.name?.trim();
  const email = args.email?.trim().toLowerCase();
  const date = args.date?.trim();

  if (!name || !email || !date) {
    return { booked: false, reason: "Missing name, email or date." };
  }
  if (!emailPattern.test(email) || !isValidIsoDate(date)) {
    return { booked: false, reason: "Invalid email or date format (use YYYY-MM-DD)." };
  }
  if (date < new Date().toISOString().slice(0, 10)) {
    return { booked: false, reason: "That date is in the past." };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { booked: false, reason: "Booking is temporarily unavailable." };
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, title")
    .eq("id", propertyId)
    .single();

  if (propertyError || !property) {
    return { booked: false, reason: "Property not found." };
  }

  const { error } = await supabase.from("bookings").insert({
    property_id: property.id,
    type: "tour",
    status: "pending",
    client_name: name,
    client_email: email,
    client_phone: args.phone?.trim() || null,
    start_date: date,
    end_date: date,
    tour_time: args.time?.trim() || null,
    notes: `[Booked via AI concierge] ${args.notes?.trim() ?? ""}`.trim(),
    source: "client",
    locale,
  });

  if (error) {
    return { booked: false, reason: "Could not save the booking." };
  }

  const emailResult = await sendTourRequestAdminEmail({
    clientEmail: email,
    clientName: name,
    clientPhone: args.phone?.trim() ?? "",
    locale,
    notes: `Booked via AI concierge. ${args.notes?.trim() ?? ""}`.trim(),
    propertyTitle: (property.title as string | null) ?? "Unknown property",
    tourDate: date,
    tourTime: args.time?.trim() ?? "",
  });

  if (!emailResult.ok && emailResult.reason !== "missing-config") {
    console.error("Concierge booking saved, email failed:", emailResult.reason);
  }

  return { booked: true };
}
