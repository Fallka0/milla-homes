import { cookies } from "next/headers";

import { BookingsManager } from "@/components/admin/bookings-manager";
import { resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminBookingCopy } from "@/lib/booking-copy";
import { getAdminBookings } from "@/lib/bookings";
import { getAdminProperties } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const cookieStore = await cookies();
  const locale = resolveAdminLocale(cookieStore.get("verdant-locale")?.value);
  const copy = getAdminBookingCopy(locale);
  const [bookings, properties] = await Promise.all([getAdminBookings(), getAdminProperties()]);

  return (
    <BookingsManager
      bookings={bookings}
      copy={copy}
      locale={locale}
      properties={properties.map((property) => ({ id: property.id, title: property.title }))}
    />
  );
}
