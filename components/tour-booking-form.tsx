"use client";

import { FormEvent, useState } from "react";

import { type TourBookingCopy } from "@/lib/booking-copy";
import { type PublicLocale } from "@/lib/public-copy";

type TourBookingFormProps = {
  copy: TourBookingCopy;
  locale: PublicLocale;
  propertyId: string;
};

type SubmissionState = {
  message: string;
  type: "error" | "idle" | "success";
};

const initialState: SubmissionState = {
  message: "",
  type: "idle",
};

export function TourBookingForm({ copy, locale, propertyId }: TourBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(initialState);
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmission(initialState);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          locale,
          phone: formData.get("phone"),
          notes: formData.get("notes"),
          propertyId,
          tourDate: formData.get("tourDate"),
          tourTime: formData.get("tourTime"),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        setSubmission({
          type: "error",
          message: data.error ?? copy.error,
        });
        setIsSubmitting(false);
        return;
      }

      form.reset();
      setSubmission({
        type: "success",
        message: data.message ?? copy.success,
      });
    } catch {
      setSubmission({
        type: "error",
        message: copy.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-honeypot" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          {copy.fullName}
          <input name="name" type="text" required />
        </label>
        <label>
          {copy.email}
          <input name="email" type="email" required />
        </label>
        <label>
          {copy.phone}
          <input name="phone" type="tel" />
        </label>
        <label>
          {copy.date}
          <input name="tourDate" type="date" min={today} required />
        </label>
        <label>
          {copy.time}
          <input name="tourTime" type="text" placeholder={copy.timePlaceholder} />
        </label>
        <label className="full-width">
          {copy.notes}
          <textarea name="notes" placeholder={copy.notesPlaceholder} rows={3} />
        </label>
      </div>
      <button
        aria-busy={isSubmitting}
        className={`button button-primary submit-button ${isSubmitting ? "is-loading" : ""}`}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span aria-hidden="true" className="loading-spinner" />
            <span>{copy.submitting}</span>
          </>
        ) : (
          copy.submit
        )}
      </button>
      <p className={`form-status ${submission.type}`} aria-live="polite">
        {submission.message}
      </p>
    </form>
  );
}
