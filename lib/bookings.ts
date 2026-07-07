import { createAdminClient } from "@/lib/supabase/server";

export const bookingTypes = ["rent", "tour"] as const;
export type BookingType = (typeof bookingTypes)[number];

export const bookingStatuses = ["pending", "confirmed", "declined", "cancelled"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];

export type BookingRecord = {
  clientEmail: string | null;
  clientName: string;
  clientPhone: string | null;
  createdAt: string;
  endDate: string;
  id: string;
  locale: string | null;
  notes: string;
  propertyId: string;
  propertyTitle: string | null;
  source: "admin" | "client";
  startDate: string;
  status: BookingStatus;
  tourTime: string | null;
  type: BookingType;
};

type BookingRow = {
  client_email: string | null;
  client_name: string | null;
  client_phone: string | null;
  created_at: string | null;
  end_date: string;
  id: string;
  locale: string | null;
  notes: string | null;
  properties: { title: string | null } | null;
  property_id: string;
  source: string | null;
  start_date: string;
  status: string | null;
  tour_time: string | null;
  type: string | null;
};

const bookingSelect =
  "id, property_id, type, status, client_name, client_email, client_phone, start_date, end_date, tour_time, notes, source, locale, created_at, properties(title)";

function normalizeBookingRow(row: BookingRow): BookingRecord {
  return {
    clientEmail: row.client_email,
    clientName: row.client_name ?? "",
    clientPhone: row.client_phone,
    createdAt: row.created_at ?? new Date(0).toISOString(),
    endDate: row.end_date,
    id: row.id,
    locale: row.locale,
    notes: row.notes ?? "",
    propertyId: row.property_id,
    propertyTitle: row.properties?.title ?? null,
    source: row.source === "client" ? "client" : "admin",
    startDate: row.start_date,
    status: bookingStatuses.includes(row.status as BookingStatus)
      ? (row.status as BookingStatus)
      : "pending",
    tourTime: row.tour_time,
    type: row.type === "tour" ? "tour" : "rent",
  };
}

export async function getAdminBookings(): Promise<BookingRecord[]> {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(bookingSelect)
    .order("start_date", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as unknown as BookingRow[]).map(normalizeBookingRow);
}

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  const supabase = createAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return normalizeBookingRow(data as unknown as BookingRow);
}

// Rent ranges are check-in inclusive / check-out exclusive, matching the
// exclusion constraint in the bookings migration.
export async function findConfirmedRentOverlap(
  propertyId: string,
  startDate: string,
  endDate: string,
  excludeBookingId?: string,
): Promise<BookingRecord | null> {
  const supabase = createAdminClient();

  if (!supabase) {
    return null;
  }

  let query = supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("property_id", propertyId)
    .eq("type", "rent")
    .eq("status", "confirmed")
    .lt("start_date", endDate)
    .gt("end_date", startDate)
    .limit(1);

  if (excludeBookingId) {
    query = query.neq("id", excludeBookingId);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return null;
  }

  return normalizeBookingRow(data[0] as unknown as BookingRow);
}

export function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}
