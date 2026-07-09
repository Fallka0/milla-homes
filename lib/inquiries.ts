import { createAdminClient } from "@/lib/supabase/server";

export const inquiryStatuses = ["new", "contacted", "closed"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export type InquiryRecord = {
  createdAt: string;
  email: string;
  id: string;
  message: string;
  name: string;
  phone: string | null;
  propertyId: string | null;
  propertyTitle: string | null;
  status: InquiryStatus;
  timeline: string | null;
};

type InquiryRow = {
  created_at: string | null;
  email: string | null;
  id: string;
  message: string | null;
  name: string | null;
  phone: string | null;
  property_id: string | null;
  property_title: string | null;
  status?: string | null;
  timeline: string | null;
};

function normalizeInquiryRow(row: InquiryRow): InquiryRecord {
  return {
    createdAt: row.created_at ?? new Date(0).toISOString(),
    email: row.email ?? "",
    id: row.id,
    message: row.message ?? "",
    name: row.name ?? "",
    phone: row.phone,
    propertyId: row.property_id,
    propertyTitle: row.property_title,
    status: inquiryStatuses.includes(row.status as InquiryStatus) ? (row.status as InquiryStatus) : "new",
    timeline: row.timeline,
  };
}

const baseColumns = "id, name, email, phone, timeline, message, property_id, property_title, created_at";

export async function getAdminInquiries(limit = 20): Promise<InquiryRecord[]> {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select(`${baseColumns}, status`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!error && data) {
    return (data as InquiryRow[]).map(normalizeInquiryRow);
  }

  // Fall back gracefully if the status column hasn't been migrated yet.
  const fallback = await supabase
    .from("inquiries")
    .select(baseColumns)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (fallback.error || !fallback.data) {
    return [];
  }

  return (fallback.data as InquiryRow[]).map(normalizeInquiryRow);
}
