"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/lib/auth";
import { sendTourConfirmationEmail } from "@/lib/booking-email";
import {
  bookingStatuses,
  findConfirmedRentOverlap,
  getBookingById,
  isValidIsoDate,
  type BookingStatus,
} from "@/lib/bookings";
import { createAdminClient } from "@/lib/supabase/server";

export type BookingActionError = "generic" | "invalid-dates" | "missing-fields" | "overlap";

export type BookingActionResult = {
  error?: BookingActionError;
};

export type CreateBookingInput = {
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  endDate: string;
  notes: string;
  propertyId: string;
  startDate: string;
  tourTime: string;
  type: string;
};

const EXCLUSION_VIOLATION = "23P01";

function getConfiguredAdminClient() {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error("Supabase service role key is missing.");
  }

  return supabase;
}

export async function createBookingAction(input: CreateBookingInput): Promise<BookingActionResult> {
  await requireAdminUser();
  const supabase = getConfiguredAdminClient();

  const type = input.type === "tour" ? "tour" : "rent";
  const clientName = input.clientName.trim();
  const propertyId = input.propertyId.trim();
  const startDate = input.startDate.trim();
  const endDate = type === "tour" ? startDate : input.endDate.trim();

  if (!clientName || !propertyId || !startDate || !endDate) {
    return { error: "missing-fields" };
  }

  if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) {
    return { error: "invalid-dates" };
  }

  if (type === "rent" && endDate <= startDate) {
    return { error: "invalid-dates" };
  }

  if (type === "rent") {
    const overlap = await findConfirmedRentOverlap(propertyId, startDate, endDate);

    if (overlap) {
      return { error: "overlap" };
    }
  }

  const { error } = await supabase.from("bookings").insert({
    property_id: propertyId,
    type,
    status: "confirmed",
    client_name: clientName,
    client_email: input.clientEmail.trim() || null,
    client_phone: input.clientPhone.trim() || null,
    start_date: startDate,
    end_date: endDate,
    tour_time: type === "tour" ? input.tourTime.trim() || null : null,
    notes: input.notes.trim(),
    source: "admin",
  });

  if (error) {
    return { error: error.code === EXCLUSION_VIOLATION ? "overlap" : "generic" };
  }

  revalidatePath("/admin/bookings");

  return {};
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
): Promise<BookingActionResult> {
  await requireAdminUser();
  const supabase = getConfiguredAdminClient();

  if (!bookingStatuses.includes(status)) {
    return { error: "generic" };
  }

  const booking = await getBookingById(bookingId);

  if (!booking) {
    return { error: "generic" };
  }

  if (status === "confirmed" && booking.type === "rent") {
    const overlap = await findConfirmedRentOverlap(
      booking.propertyId,
      booking.startDate,
      booking.endDate,
      booking.id,
    );

    if (overlap) {
      return { error: "overlap" };
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) {
    return { error: error.code === EXCLUSION_VIOLATION ? "overlap" : "generic" };
  }

  if (
    status === "confirmed" &&
    booking.type === "tour" &&
    booking.source === "client" &&
    booking.clientEmail
  ) {
    const emailResult = await sendTourConfirmationEmail({
      clientEmail: booking.clientEmail,
      clientName: booking.clientName,
      locale: booking.locale ?? "en",
      propertyTitle: booking.propertyTitle ?? "",
      tourDate: booking.startDate,
      tourTime: booking.tourTime ?? "",
    });

    if (!emailResult.ok && emailResult.reason !== "missing-config") {
      console.error("Tour confirmed, but confirmation email failed.", emailResult.reason);
    }
  }

  revalidatePath("/admin/bookings");

  return {};
}

export async function deleteBookingAction(bookingId: string): Promise<BookingActionResult> {
  await requireAdminUser();
  const supabase = getConfiguredAdminClient();

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);

  if (error) {
    return { error: "generic" };
  }

  revalidatePath("/admin/bookings");

  return {};
}
