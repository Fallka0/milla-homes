"use client";

import { FormEvent, useState } from "react";

import type { OwnerPageContent } from "@/lib/owner-page-content";
import type { PublicCopy, PublicLocale } from "@/lib/public-copy";

type OwnerLeadFormProps = {
  content: OwnerPageContent;
  copy: PublicCopy;
  locale: PublicLocale;
};

type FormStatus = { message: string; type: "error" | "idle" | "success" };

const initialStatus: FormStatus = { message: "", type: "idle" };

export function OwnerLeadForm({ content, copy, locale }: OwnerLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(initialStatus);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const intent = String(formData.get("intent") ?? "");
    const location = String(formData.get("location") ?? "");
    const propertyType = String(formData.get("propertyType") ?? "");
    const bedrooms = String(formData.get("bedrooms") ?? "");
    const targetPrice = String(formData.get("targetPrice") ?? "");
    const timing = String(formData.get("timing") ?? "");
    const notes = String(formData.get("notes") ?? "");

    const message = [
      `Owner property enquiry`,
      `${content.form.intent}: ${intent}`,
      `${content.form.location}: ${location}`,
      `${content.form.propertyType}: ${propertyType}`,
      `${content.form.bedrooms}: ${bedrooms || "—"}`,
      `${content.form.targetPrice}: ${targetPrice || "—"}`,
      `${content.form.timing}: ${timing || "—"}`,
      `${content.form.notes}: ${notes || "—"}`,
    ].join("\n");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: formData.get("company"),
          email: formData.get("email"),
          locale,
          message,
          name: formData.get("name"),
          phone: formData.get("phone"),
          propertyTitle: `Owner lead · ${intent} · ${location}`,
          timeline: timing,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!response.ok) {
        setStatus({ type: "error", message: data.error ?? copy.inquiry.error });
        return;
      }

      form.reset();
      setStatus({ type: "success", message: data.message ?? copy.inquiry.success });
    } catch {
      setStatus({ type: "error", message: copy.inquiry.error });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="owner-lead-form" onSubmit={handleSubmit}>
      <div className="form-honeypot" aria-hidden="true">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="owner-form-grid">
        <label>{content.form.intent}<select name="intent" required><option value="sale">{content.sell}</option><option value="long-term-rent">{content.longRent}</option><option value="holiday-rent">{content.holidayRent}</option></select></label>
        <label>{content.form.location}<input name="location" placeholder={content.form.locationPlaceholder} required /></label>
        <label>{content.form.propertyType}<input name="propertyType" placeholder={content.form.propertyTypePlaceholder} required /></label>
        <label>{content.form.bedrooms}<input min="0" name="bedrooms" type="number" inputMode="numeric" /></label>
        <label>{content.form.targetPrice}<input name="targetPrice" placeholder={content.form.targetPricePlaceholder} /></label>
        <label>{content.form.timing}<input name="timing" placeholder={content.form.timingPlaceholder} /></label>
        <label>{content.form.name}<input autoComplete="name" name="name" required /></label>
        <label>{content.form.email}<input autoComplete="email" name="email" type="email" required /></label>
        <label>{content.form.phone}<input autoComplete="tel" name="phone" type="tel" /></label>
        <label className="full-width">{content.form.notes}<textarea name="notes" placeholder={content.form.notesPlaceholder} rows={5} /></label>
      </div>

      <button aria-busy={isSubmitting} className={`button button-primary submit-button ${isSubmitting ? "is-loading" : ""}`} disabled={isSubmitting} type="submit">
        {isSubmitting ? <><span aria-hidden="true" className="loading-spinner" /><span>{copy.buttons.sending}</span></> : content.form.submit}
      </button>
      <p className={`form-status ${status.type}`} aria-live="polite">{status.message}</p>
    </form>
  );
}
