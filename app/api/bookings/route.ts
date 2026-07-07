import { NextResponse } from "next/server";

import { sendTourRequestAdminEmail } from "@/lib/booking-email";
import { tourBookingCopy } from "@/lib/booking-copy";
import { isValidIsoDate } from "@/lib/bookings";
import { resolvePublicLocale } from "@/lib/public-copy";
import { consumeInquiryRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";

type TourRequestPayload = {
  company?: string;
  email?: string;
  locale?: string;
  name?: string;
  notes?: string;
  phone?: string;
  propertyId?: string;
  tourDate?: string;
  tourTime?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeInput(payload: TourRequestPayload) {
  return {
    company: payload.company?.trim() ?? "",
    email: payload.email?.trim().toLowerCase() ?? "",
    locale: resolvePublicLocale(payload.locale),
    name: payload.name?.trim() ?? "",
    notes: payload.notes?.trim() ?? "",
    phone: payload.phone?.trim() ?? "",
    propertyId: payload.propertyId?.trim() ?? "",
    tourDate: payload.tourDate?.trim() ?? "",
    tourTime: payload.tourTime?.trim() ?? "",
  };
}

export async function POST(request: Request) {
  let payload: TourRequestPayload;

  try {
    payload = (await request.json()) as TourRequestPayload;
  } catch {
    return NextResponse.json({ error: "Please send valid JSON." }, { status: 400 });
  }

  const input = normalizeInput(payload);
  const copy = tourBookingCopy[input.locale];

  if (input.company) {
    return NextResponse.json({ message: copy.success });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rateLimit = consumeInquiryRateLimit(`tour:${ip}:${input.email || "anonymous"}`);

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));

    return NextResponse.json(
      { error: copy.rateLimited },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      },
    );
  }

  if (!input.name || !input.email || !input.propertyId || !input.tourDate) {
    return NextResponse.json({ error: copy.error }, { status: 400 });
  }

  if (!emailPattern.test(input.email) || !isValidIsoDate(input.tourDate)) {
    return NextResponse.json({ error: copy.error }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  if (input.tourDate < today) {
    return NextResponse.json({ error: copy.error }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: copy.error }, { status: 503 });
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, title")
    .eq("id", input.propertyId)
    .single();

  if (propertyError || !property) {
    return NextResponse.json({ error: copy.error }, { status: 400 });
  }

  const { error } = await supabase.from("bookings").insert({
    property_id: property.id,
    type: "tour",
    status: "pending",
    client_name: input.name,
    client_email: input.email,
    client_phone: input.phone || null,
    start_date: input.tourDate,
    end_date: input.tourDate,
    tour_time: input.tourTime || null,
    notes: input.notes,
    source: "client",
    locale: input.locale,
  });

  if (error) {
    return NextResponse.json({ error: copy.error }, { status: 500 });
  }

  const emailResult = await sendTourRequestAdminEmail({
    clientEmail: input.email,
    clientName: input.name,
    clientPhone: input.phone,
    locale: input.locale,
    notes: input.notes,
    propertyTitle: (property.title as string | null) ?? "Unknown property",
    tourDate: input.tourDate,
    tourTime: input.tourTime,
  });

  if (!emailResult.ok && emailResult.reason !== "missing-config") {
    console.error("Tour request saved, but email delivery failed.", emailResult.reason);
  }

  return NextResponse.json({ message: copy.success });
}
