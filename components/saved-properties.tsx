"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PropertyCard } from "@/components/property-card";
import { readSavedPropertySlugs, savedPropertiesChangedEvent } from "@/components/save-property-button";
import type { PropertyRecord } from "@/lib/property-shared";
import type { PublicCopy, PublicLocale } from "@/lib/public-copy";

type SavedPropertiesProps = {
  copy: PublicCopy;
  copiedLabel: string;
  emptyText: string;
  emptyTitle: string;
  locale: PublicLocale;
  properties: PropertyRecord[];
  shareLabel: string;
  sharedSlugs: string[];
};

export function SavedProperties({ copiedLabel, copy, emptyText, emptyTitle, locale, properties, shareLabel, sharedSlugs }: SavedPropertiesProps) {
  const isSharedView = sharedSlugs.length > 0;
  const [savedSlugs, setSavedSlugs] = useState<string[] | null>(isSharedView ? sharedSlugs : null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isSharedView) return;
    const update = () => setSavedSlugs(readSavedPropertySlugs());
    update();
    window.addEventListener(savedPropertiesChangedEvent, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(savedPropertiesChangedEvent, update);
      window.removeEventListener("storage", update);
    };
  }, [isSharedView]);

  async function shareShortlist() {
    if (!savedSlugs?.length) return;
    const url = new URL("/saved", window.location.origin);
    url.searchParams.set("properties", savedSlugs.slice(0, 20).join(","));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (savedSlugs === null) return <div className="saved-properties-loading" aria-busy="true" />;
  const savedProperties = properties.filter((property) => savedSlugs.includes(property.slug));

  if (savedProperties.length === 0) {
    return <section className="saved-empty"><h2>{emptyTitle}</h2><p>{emptyText}</p><Link className="button button-primary" href="/properties">{copy.buttons.browseProperties}</Link></section>;
  }

  return (
    <>
      {!isSharedView ? <div className="saved-page-actions"><button className="button button-secondary" onClick={shareShortlist} type="button">{copied ? copiedLabel : shareLabel}</button></div> : null}
      <section className="property-grid saved-property-grid">
        {savedProperties.map((property) => <PropertyCard bathroomsLabel={copy.propertyMeta.bathroomsShort} bedroomsLabel={copy.propertyMeta.bedroomsShort} buttonLabel={copy.buttons.viewDetails} key={property.id} locale={locale} property={property} />)}
      </section>
    </>
  );
}
