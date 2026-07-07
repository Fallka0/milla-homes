import { cookies } from "next/headers";

import { BookingsManager } from "@/components/admin/bookings-manager";
import { resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminBookingCopy } from "@/lib/booking-copy";
import { getAdminBookings } from "@/lib/bookings";
import { getAdminProperties } from "@/lib/properties";
import { getPropertyPreviewImageUrl } from "@/lib/property-shared";

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
      properties={properties.map((property) => ({
        id: property.id,
        imageUrl: getPropertyPreviewImageUrl(property),
        location: property.location,
        referenceCode: property.referenceCode,
        title: property.title,
      }))}
    />
  );
}
