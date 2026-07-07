"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  createBookingAction,
  deleteBookingAction,
  updateBookingStatusAction,
  type BookingActionError,
} from "@/app/admin/(dashboard)/bookings/actions";
import { type AdminBookingCopy } from "@/lib/booking-copy";
import { type BookingRecord, type BookingStatus } from "@/lib/bookings";

type PropertyOption = {
  id: string;
  imageUrl: string | null;
  location: string;
  referenceCode: string;
  title: string;
};

type PropertyPickerModalProps = {
  copy: AdminBookingCopy["picker"];
  onClose: () => void;
  onSelect: (propertyId: string) => void;
  properties: PropertyOption[];
  selectedId: string;
};

function PropertyPickerModal({ copy, onClose, onSelect, properties, selectedId }: PropertyPickerModalProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const query = search.trim().toLowerCase();
  const results = query
    ? properties.filter((property) =>
        [property.title, property.referenceCode, property.location]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : properties;

  return (
    <div className="property-picker-overlay" onClick={onClose} role="presentation">
      <div
        aria-label={copy.title}
        aria-modal="true"
        className="property-picker-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="property-picker-head">
          <h3>{copy.title}</h3>
          <button className="button button-secondary" onClick={onClose} type="button">
            {copy.close}
          </button>
        </div>
        <input
          autoFocus
          className="property-picker-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder={copy.searchPlaceholder}
          type="search"
          value={search}
        />
        {results.length > 0 ? (
          <div className="property-picker-grid">
            {results.map((property) => (
              <button
                className={`property-picker-card${property.id === selectedId ? " selected" : ""}`}
                key={property.id}
                onClick={() => {
                  onSelect(property.id);
                  onClose();
                }}
                type="button"
              >
                <span className="property-picker-thumb">
                  {property.imageUrl ? (
                    <Image
                      alt=""
                      fill
                      sizes="(max-width: 560px) 45vw, 180px"
                      src={property.imageUrl}
                    />
                  ) : null}
                </span>
                <strong>{property.title}</strong>
                <span className="property-picker-meta">
                  {property.referenceCode} · {property.location}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="property-picker-empty">{copy.empty}</p>
        )}
      </div>
    </div>
  );
}

type BookingsManagerProps = {
  bookings: BookingRecord[];
  copy: AdminBookingCopy;
  locale: string;
  properties: PropertyOption[];
};

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

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

function buildMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  // Monday-first grid: getDay() is 0 for Sunday.
  const leadingDays = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - leadingDays);
  const weeks: { date: Date; inMonth: boolean; iso: string }[][] = [];

  for (let week = 0; week < 6; week += 1) {
    const days: { date: Date; inMonth: boolean; iso: string }[] = [];

    for (let day = 0; day < 7; day += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + week * 7 + day);
      days.push({
        date,
        inMonth: date.getMonth() === month,
        iso: toIsoDate(date),
      });
    }

    weeks.push(days);
  }

  return weeks;
}

function bookingCoversDay(booking: BookingRecord, isoDay: string) {
  if (booking.type === "tour") {
    return booking.startDate === isoDay;
  }

  return isoDay >= booking.startDate && isoDay <= booking.endDate;
}

const emptyForm = {
  clientEmail: "",
  clientName: "",
  clientPhone: "",
  endDate: "",
  notes: "",
  propertyId: "",
  startDate: "",
  tourTime: "",
  type: "rent",
};

export function BookingsManager({ bookings, copy, locale, properties }: BookingsManagerProps) {
  const router = useRouter();
  const today = toIsoDate(new Date());
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const [propertyFilter, setPropertyFilter] = useState("");
  const [showPast, setShowPast] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [formError, setFormError] = useState<BookingActionError | null>(null);
  const [listError, setListError] = useState<BookingActionError | null>(null);
  const [isSubmitting, startSubmit] = useTransition();
  const [isMutating, startMutate] = useTransition();

  const propertyTitleById = useMemo(
    () => new Map(properties.map((property) => [property.id, property.title])),
    [properties],
  );

  const selectedProperty = properties.find((property) => property.id === form.propertyId) ?? null;

  const visibleBookings = useMemo(
    () =>
      propertyFilter
        ? bookings.filter((booking) => booking.propertyId === propertyFilter)
        : bookings,
    [bookings, propertyFilter],
  );

  const calendarBookings = useMemo(
    () =>
      visibleBookings.filter(
        (booking) => booking.status === "confirmed" || booking.status === "pending",
      ),
    [visibleBookings],
  );

  const pendingTours = useMemo(
    () => bookings.filter((booking) => booking.type === "tour" && booking.status === "pending"),
    [bookings],
  );

  const listBookings = useMemo(() => {
    const items = showPast
      ? visibleBookings
      : visibleBookings.filter((booking) => booking.endDate >= today);

    return [...items].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [visibleBookings, showPast, today]);

  const weeks = useMemo(
    () => buildMonthGrid(viewDate.year, viewDate.month),
    [viewDate.year, viewDate.month],
  );

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(viewDate.year, viewDate.month, 1),
  );

  function shiftMonth(delta: number) {
    setViewDate((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { month: next.getMonth(), year: next.getFullYear() };
    });
  }

  function propertyLabel(booking: BookingRecord) {
    return booking.propertyTitle ?? propertyTitleById.get(booking.propertyId) ?? "—";
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    startSubmit(async () => {
      const result = await createBookingAction({
        clientEmail: form.clientEmail,
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        endDate: form.endDate,
        notes: form.notes,
        propertyId: form.propertyId,
        startDate: form.startDate,
        tourTime: form.tourTime,
        type: form.type,
      });

      if (result.error) {
        setFormError(result.error);
        return;
      }

      setForm(emptyForm);
      router.refresh();
    });
  }

  function handleStatusChange(bookingId: string, status: BookingStatus) {
    setListError(null);

    startMutate(async () => {
      const result = await updateBookingStatusAction(bookingId, status);

      if (result.error) {
        setListError(result.error);
        return;
      }

      router.refresh();
    });
  }

  function handleDelete(bookingId: string) {
    if (!window.confirm(copy.actions.deleteConfirm)) {
      return;
    }

    setListError(null);

    startMutate(async () => {
      const result = await deleteBookingAction(bookingId);

      if (result.error) {
        setListError(result.error);
        return;
      }

      router.refresh();
    });
  }

  const errorText = (error: BookingActionError) => {
    switch (error) {
      case "invalid-dates":
        return copy.errors.invalidDates;
      case "missing-fields":
        return copy.errors.missingFields;
      case "overlap":
        return copy.errors.overlap;
      default:
        return copy.errors.generic;
    }
  };

  return (
    <section className="admin-grid">
      {pendingTours.length > 0 ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <p className="eyebrow">{copy.pending.eyebrow}</p>
              <h2>{copy.pending.title}</h2>
            </div>
          </div>
          <div className="admin-inquiry-list">
            {pendingTours.map((booking) => (
              <article className="admin-inquiry-card" key={booking.id}>
                <div className="admin-inquiry-topline">
                  <strong>{booking.clientName}</strong>
                  <span>
                    {formatDate(booking.startDate, locale)}
                    {booking.tourTime ? ` · ${booking.tourTime}` : ""}
                  </span>
                </div>
                <div className="admin-inquiry-meta">
                  <span><strong>{copy.form.property}:</strong> {propertyLabel(booking)}</span>
                  {booking.clientEmail ? <span><strong>Email:</strong> {booking.clientEmail}</span> : null}
                  {booking.clientPhone ? <span><strong>Tel:</strong> {booking.clientPhone}</span> : null}
                </div>
                {booking.notes ? <p className="admin-inquiry-message">{booking.notes}</p> : null}
                <div className="admin-inquiry-actions">
                  <button
                    className="button button-primary"
                    disabled={isMutating}
                    onClick={() => handleStatusChange(booking.id, "confirmed")}
                    type="button"
                  >
                    {copy.pending.confirm}
                  </button>
                  <button
                    className="button button-secondary"
                    disabled={isMutating}
                    onClick={() => handleStatusChange(booking.id, "declined")}
                    type="button"
                  >
                    {copy.pending.decline}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">{copy.form.eyebrow}</p>
            <h2>{copy.form.title}</h2>
          </div>
        </div>
        <form className="booking-form" onSubmit={handleCreate}>
          <div className="booking-form-grid">
            <label>
              {copy.form.type}
              <select
                onChange={(event) => setForm({ ...form, type: event.target.value })}
                value={form.type}
              >
                <option value="rent">{copy.typeLabels.rent}</option>
                <option value="tour">{copy.typeLabels.tour}</option>
              </select>
            </label>
            <label className="property-picker-field">
              {copy.form.property}
              <button
                className={`property-picker-trigger${form.propertyId ? " has-value" : ""}`}
                onClick={() => setPickerOpen(true)}
                type="button"
              >
                {selectedProperty ? (
                  <>
                    <span className="property-picker-trigger-thumb">
                      {selectedProperty.imageUrl ? (
                        <Image alt="" fill sizes="48px" src={selectedProperty.imageUrl} />
                      ) : null}
                    </span>
                    <span className="property-picker-trigger-text">
                      <strong>{selectedProperty.title}</strong>
                      <span>{selectedProperty.referenceCode} · {selectedProperty.location}</span>
                    </span>
                    <span className="property-picker-trigger-hint">{copy.picker.change}</span>
                  </>
                ) : (
                  copy.picker.choose
                )}
              </button>
            </label>
            <label>
              {form.type === "tour" ? copy.form.tourDate : copy.form.startDate}
              <input
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                required
                type="date"
                value={form.startDate}
              />
            </label>
            {form.type === "tour" ? (
              <label>
                {copy.form.tourTime}
                <input
                  onChange={(event) => setForm({ ...form, tourTime: event.target.value })}
                  placeholder={copy.form.optional}
                  type="text"
                  value={form.tourTime}
                />
              </label>
            ) : (
              <label>
                {copy.form.endDate}
                <input
                  min={form.startDate || undefined}
                  onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                  required
                  type="date"
                  value={form.endDate}
                />
              </label>
            )}
            <label>
              {copy.form.clientName}
              <input
                onChange={(event) => setForm({ ...form, clientName: event.target.value })}
                required
                type="text"
                value={form.clientName}
              />
            </label>
            <label>
              {copy.form.clientEmail}
              <input
                onChange={(event) => setForm({ ...form, clientEmail: event.target.value })}
                placeholder={copy.form.optional}
                type="email"
                value={form.clientEmail}
              />
            </label>
            <label>
              {copy.form.clientPhone}
              <input
                onChange={(event) => setForm({ ...form, clientPhone: event.target.value })}
                placeholder={copy.form.optional}
                type="tel"
                value={form.clientPhone}
              />
            </label>
            <label className="booking-form-notes">
              {copy.form.notes}
              <input
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder={copy.form.optional}
                type="text"
                value={form.notes}
              />
            </label>
          </div>
          <div className="booking-form-footer">
            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? copy.form.submitting : copy.form.submit}
            </button>
            {formError ? (
              <p className="form-status error" role="alert">
                {errorText(formError)}
              </p>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-card-header booking-calendar-header">
          <div>
            <p className="eyebrow">{copy.calendar.eyebrow}</p>
            <h2>{copy.calendar.title}</h2>
          </div>
          <div className="booking-calendar-controls">
            <select
              aria-label={copy.form.property}
              onChange={(event) => setPropertyFilter(event.target.value)}
              value={propertyFilter}
            >
              <option value="">{copy.calendar.allProperties}</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
            <div className="booking-month-nav">
              <button
                aria-label={copy.calendar.prevMonth}
                className="button button-secondary"
                onClick={() => shiftMonth(-1)}
                type="button"
              >
                ‹
              </button>
              <strong className="booking-month-label">{monthLabel}</strong>
              <button
                aria-label={copy.calendar.nextMonth}
                className="button button-secondary"
                onClick={() => shiftMonth(1)}
                type="button"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="booking-calendar">
          <div className="booking-calendar-weekdays">
            {copy.calendar.weekdays.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          {weeks.map((week) => (
            <div className="booking-calendar-week" key={week[0].iso}>
              {week.map((day) => {
                const entries = calendarBookings.filter((booking) =>
                  bookingCoversDay(booking, day.iso),
                );

                return (
                  <div
                    className={`booking-calendar-day${day.inMonth ? "" : " outside"}${
                      day.iso === today ? " today" : ""
                    }`}
                    key={day.iso}
                  >
                    <span className="booking-day-number">{day.date.getDate()}</span>
                    <div className="booking-day-entries">
                      {entries.map((booking) => (
                        <span
                          className={`booking-chip ${booking.type}${
                            booking.status === "pending" ? " pending" : ""
                          }`}
                          key={booking.id}
                          title={`${propertyLabel(booking)} · ${booking.clientName}`}
                        >
                          {booking.clientName}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="booking-legend">
          <span className="booking-chip rent">{copy.typeLabels.rent}</span>
          <span className="booking-chip tour">{copy.typeLabels.tour}</span>
          <span className="booking-chip tour pending">{copy.statusLabels.pending}</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header booking-calendar-header">
          <div>
            <p className="eyebrow">{copy.list.eyebrow}</p>
            <h2>{copy.list.title}</h2>
          </div>
          <label className="booking-past-toggle">
            <input
              checked={showPast}
              onChange={(event) => setShowPast(event.target.checked)}
              type="checkbox"
            />
            {copy.list.pastToggle}
          </label>
        </div>

        {listError ? (
          <p className="form-status error" role="alert">
            {errorText(listError)}
          </p>
        ) : null}

        {listBookings.length > 0 ? (
          <div className="admin-inquiry-list">
            {listBookings.map((booking) => (
              <article className="admin-inquiry-card" key={booking.id}>
                <div className="admin-inquiry-topline">
                  <strong>
                    {propertyLabel(booking)}
                  </strong>
                  <span>
                    {formatDate(booking.startDate, locale)}
                    {booking.type === "rent"
                      ? ` – ${formatDate(booking.endDate, locale)}`
                      : booking.tourTime
                        ? ` · ${booking.tourTime}`
                        : ""}
                  </span>
                </div>
                <div className="admin-inquiry-meta">
                  <span className={`booking-chip ${booking.type}`}>
                    {copy.typeLabels[booking.type]}
                  </span>
                  <span className={`booking-status status-${booking.status}`}>
                    {copy.statusLabels[booking.status]}
                  </span>
                  <span><strong>{copy.form.clientName}:</strong> {booking.clientName}</span>
                  {booking.clientEmail ? <span>{booking.clientEmail}</span> : null}
                  {booking.clientPhone ? <span>{booking.clientPhone}</span> : null}
                </div>
                {booking.notes ? <p className="admin-inquiry-message">{booking.notes}</p> : null}
                <div className="admin-inquiry-actions">
                  {booking.status === "pending" ? (
                    <>
                      <button
                        className="button button-primary"
                        disabled={isMutating}
                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                        type="button"
                      >
                        {copy.actions.confirm}
                      </button>
                      <button
                        className="button button-secondary"
                        disabled={isMutating}
                        onClick={() => handleStatusChange(booking.id, "declined")}
                        type="button"
                      >
                        {copy.actions.decline}
                      </button>
                    </>
                  ) : null}
                  {booking.status === "confirmed" ? (
                    <button
                      className="button button-secondary"
                      disabled={isMutating}
                      onClick={() => handleStatusChange(booking.id, "cancelled")}
                      type="button"
                    >
                      {copy.actions.cancel}
                    </button>
                  ) : null}
                  <button
                    className="button button-secondary booking-delete"
                    disabled={isMutating}
                    onClick={() => handleDelete(booking.id)}
                    type="button"
                  >
                    {copy.actions.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <p>{copy.list.empty}</p>
          </div>
        )}
      </div>

      {isPickerOpen ? (
        <PropertyPickerModal
          copy={copy.picker}
          onClose={() => setPickerOpen(false)}
          onSelect={(propertyId) => setForm((current) => ({ ...current, propertyId }))}
          properties={properties}
          selectedId={form.propertyId}
        />
      ) : null}
    </section>
  );
}
