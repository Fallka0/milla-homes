"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { PublicLocale } from "@/lib/public-copy";

export const savedPropertiesStorageKey = "milla-homes-saved-properties";
export const savedPropertiesChangedEvent = "milla-homes-saved-properties-changed";

const labels: Record<PublicLocale, { add: string; remove: string; view: string }> = {
  en: { add: "Save property", remove: "Remove from saved", view: "View saved properties" },
  es: { add: "Guardar propiedad", remove: "Quitar de guardadas", view: "Ver propiedades guardadas" },
  de: { add: "Immobilie speichern", remove: "Aus gespeicherten entfernen", view: "Gespeicherte Immobilien ansehen" },
  ru: { add: "Сохранить объект", remove: "Удалить из сохранённых", view: "Открыть сохранённые объекты" },
};

export function readSavedPropertySlugs() {
  try {
    const stored = JSON.parse(localStorage.getItem(savedPropertiesStorageKey) ?? "[]");
    return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

type SavePropertyButtonProps = {
  locale: PublicLocale;
  showSavedLink?: boolean;
  slug: string;
};

export function SavePropertyButton({ locale, showSavedLink = false, slug }: SavePropertyButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => setSaved(readSavedPropertySlugs().includes(slug)), [slug]);

  function toggleSaved() {
    const current = readSavedPropertySlugs();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    localStorage.setItem(savedPropertiesStorageKey, JSON.stringify(next));
    setSaved(next.includes(slug));
    window.dispatchEvent(new CustomEvent(savedPropertiesChangedEvent));
  }

  return (
    <div className={`save-property-control ${showSavedLink ? "save-property-control-detail" : ""}`}>
      <button aria-pressed={saved} aria-label={saved ? labels[locale].remove : labels[locale].add} className="save-property-button" onClick={toggleSaved} type="button">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20.4 4.4 13A5.2 5.2 0 0 1 12 5.9 5.2 5.2 0 0 1 19.6 13Z" /></svg>
        {showSavedLink ? <span>{saved ? labels[locale].remove : labels[locale].add}</span> : null}
      </button>
      {showSavedLink && saved ? <Link href="/saved">{labels[locale].view} <span aria-hidden>↗</span></Link> : null}
    </div>
  );
}
