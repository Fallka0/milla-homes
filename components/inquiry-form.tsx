"use client";

import { FormEvent, useState } from "react";

import { type PublicCopy, type PublicLocale } from "@/lib/public-copy";

type InquiryFormProps = {
  copy: PublicCopy;
  locale: PublicLocale;
  property?: {
    id: string;
    location: string;
    title: string;
  };
};

type InquiryMode = "general" | "viewing";

type SubmissionState = {
  message: string;
  type: "error" | "idle" | "success";
};

const initialState: SubmissionState = {
  message: "",
  type: "idle",
};

export function InquiryForm({ copy, locale, property }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryMode, setInquiryMode] = useState<InquiryMode>("general");
  const [message, setMessage] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submission, setSubmission] = useState(initialState);

  function getViewingTemplate() {
    if (!property) {
      return "";
    }

    return copy.inquiry.requestViewingTemplate
      .replace("{title}", property.title)
      .replace("{location}", property.location);
  }

  function handleModeChange(nextMode: InquiryMode) {
    setInquiryMode(nextMode);
    setTimeline("");
    setMessage(nextMode === "viewing" ? getViewingTemplate() : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmission(initialState);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/inquiries", {
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
          message,
          propertyId: property?.id,
          propertyTitle: property?.title,
          timeline: inquiryMode === "viewing" ? timeline : "",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        setSubmission({
          type: "error",
          message: data.error ?? copy.inquiry.error,
        });
        setIsSubmitting(false);
        return;
      }

      form.reset();
      setMessage(inquiryMode === "viewing" ? getViewingTemplate() : "");
      setTimeline("");
      setSubmission({
        type: "success",
        message: data.message ?? copy.inquiry.success,
      });
    } catch {
      setSubmission({
        type: "error",
        message: copy.inquiry.error,
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
      {property ? (
        <div className="inquiry-context">
          <p className="eyebrow">{copy.inquiry.propertyInquiry}</p>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
        </div>
      ) : null}
      {property ? <div className="inquiry-mode-toggle" role="tablist" aria-label={copy.inquiry.typeLabel}>
        <button
          aria-pressed={inquiryMode === "general"}
          className={`inquiry-mode-button${inquiryMode === "general" ? " active" : ""}`}
          onClick={() => handleModeChange("general")}
          type="button"
        >
          {copy.inquiry.generalInquiry}
        </button>
        <button
          aria-pressed={inquiryMode === "viewing"}
          className={`inquiry-mode-button${inquiryMode === "viewing" ? " active" : ""}`}
          onClick={() => handleModeChange("viewing")}
          type="button"
        >
          {copy.inquiry.requestViewing}
        </button>
      </div> : null}
      <div className="form-grid">
        <label>
          {copy.inquiry.fullName}
          <input name="name" type="text" placeholder={copy.inquiry.yourName} required />
        </label>
        <label>
          {copy.inquiry.email}
          <input name="email" type="email" placeholder={copy.inquiry.emailPlaceholder} required />
        </label>
        <label>
          {copy.inquiry.phone}
          <input name="phone" type="tel" placeholder={copy.inquiry.optional} />
        </label>
        {inquiryMode === "viewing" ? (
          <label>
            {copy.inquiry.timeline}
            <input
              name="timeline"
              onChange={(event) => setTimeline(event.target.value)}
              placeholder={copy.inquiry.timelinePlaceholder}
              type="text"
              value={timeline}
            />
          </label>
        ) : null}
        <label className="full-width">
          {copy.inquiry.message}
          <textarea
            name="message"
            onChange={(event) => setMessage(event.target.value)}
            placeholder={inquiryMode === "viewing" ? copy.inquiry.requestViewingPlaceholder : property
              ? `${copy.inquiry.messagePlaceholder} ${property.title}.`
              : copy.inquiry.messagePlaceholder}
            rows={5}
            value={message}
            required
          />
        </label>
      </div>
      <button
        aria-busy={isSubmitting}
        aria-label={isSubmitting ? copy.inquiry.sendingAria : inquiryMode === "viewing" ? copy.inquiry.requestViewing : copy.buttons.sendInquiry}
        className={`button button-primary submit-button ${isSubmitting ? "is-loading" : ""}`}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span aria-hidden="true" className="loading-spinner" />
            <span>{copy.buttons.sending}</span>
            <span className="sr-only">{copy.inquiry.sendingAria}</span>
          </>
        ) : (
          inquiryMode === "viewing" ? copy.inquiry.requestViewing : copy.buttons.sendInquiry
        )}
      </button>
      <p className={`form-status ${submission.type}`} aria-live="polite">
        {submission.message}
      </p>
    </form>
  );
}
