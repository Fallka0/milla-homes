"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateBookingStatusAction } from "@/app/admin/(dashboard)/bookings/actions";
import { type AdminBookingCopy } from "@/lib/booking-copy";
import { type BookingRecord, type BookingStatus } from "@/lib/bookings";

type DashboardPendingToursProps = {
  bookingsHref: string;
  copy: AdminBookingCopy;
  locale: string;
  tours: BookingRecord[];
};

function formatDate(value: string, locale: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DashboardPendingTours({ bookingsHref, copy, locale, tours }: DashboardPendingToursProps) {
  const router = useRouter();
  const [isMutating, startMutate] = useTransition();
  const [error, setError] = useState(false);

  function handleStatusChange(bookingId: string, status: BookingStatus) {
    setError(false);

    startMutate(async () => {
      const result = await updateBookingStatusAction(bookingId, status);

      if (result.error) {
        setError(true);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="admin-card admin-pending-tours-card">
      <div className="admin-card-header">
        <div>
          <p className="eyebrow">{copy.pending.eyebrow}</p>
          <h2>{copy.pending.title}</h2>
        </div>
        <Link className="table-link" href={bookingsHref}>
          {copy.navLabel}
        </Link>
      </div>

      {error ? (
        <p className="form-status error" role="alert">
          {copy.errors.generic}
        </p>
      ) : null}

      <div className="admin-inquiry-list">
        {tours.map((tour) => (
          <article className="admin-inquiry-card" key={tour.id}>
            <div className="admin-inquiry-topline">
              <strong>{tour.clientName}</strong>
              <span>
                {formatDate(tour.startDate, locale)}
                {tour.tourTime ? ` · ${tour.tourTime}` : ""}
              </span>
            </div>
            <div className="admin-inquiry-meta">
              <span><strong>{copy.form.property}:</strong> {tour.propertyTitle ?? "—"}</span>
              {tour.clientEmail ? <span>{tour.clientEmail}</span> : null}
              {tour.clientPhone ? <span>{tour.clientPhone}</span> : null}
            </div>
            {tour.notes ? <p className="admin-inquiry-message">{tour.notes}</p> : null}
            <div className="admin-inquiry-actions">
              <button
                className="button button-primary"
                disabled={isMutating}
                onClick={() => handleStatusChange(tour.id, "confirmed")}
                type="button"
              >
                {copy.pending.confirm}
              </button>
              <button
                className="button button-secondary"
                disabled={isMutating}
                onClick={() => handleStatusChange(tour.id, "declined")}
                type="button"
              >
                {copy.pending.decline}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
