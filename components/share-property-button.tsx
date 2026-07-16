"use client";

import { useEffect, useRef, useState } from "react";

import type { PublicLocale } from "@/lib/public-copy";

const labels: Record<
  PublicLocale,
  { share: string; copied: string; failed: string }
> = {
  en: { share: "Share", copied: "Link copied", failed: "Copy failed" },
  es: { share: "Compartir", copied: "Enlace copiado", failed: "No se pudo copiar" },
  de: { share: "Teilen", copied: "Link kopiert", failed: "Kopieren fehlgeschlagen" },
  ru: { share: "Поделиться", copied: "Ссылка скопирована", failed: "Не удалось скопировать" },
  uk: { share: "Поділитися", copied: "Посилання скопійовано", failed: "Не вдалося скопіювати" },
};

type ShareStatus = "idle" | "copied" | "failed";

type SharePropertyButtonProps = {
  locale: PublicLocale;
  title: string;
};

export function SharePropertyButton({ locale, title }: SharePropertyButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  function flash(next: Exclude<ShareStatus, "idle">) {
    setStatus(next);

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    resetTimer.current = setTimeout(() => setStatus("idle"), 2200);
  }

  async function handleShare() {
    const url = window.location.href;

    // Native share sheet (mobile and some desktops). Ignore user cancellation.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      flash("copied");
    } catch {
      flash("failed");
    }
  }

  const label =
    status === "copied"
      ? labels[locale].copied
      : status === "failed"
        ? labels[locale].failed
        : labels[locale].share;

  return (
    <button
      aria-label={labels[locale].share}
      className="save-property-button share-property-button"
      onClick={handleShare}
      type="button"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
      </svg>
      <span aria-live="polite">{label}</span>
    </button>
  );
}
