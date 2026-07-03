"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PropertyCard } from "@/components/property-card";
import { readSavedPropertySlugs, savedPropertiesChangedEvent } from "@/components/save-property-button";
import type { PropertyRecord } from "@/lib/property-shared";
import type { PublicCopy, PublicLocale } from "@/lib/public-copy";

type SavedPropertiesProps = {
  copy: PublicCopy;
  emptyText: string;
  emptyTitle: string;
  locale: PublicLocale;
  properties: PropertyRecord[];
};

export function SavedProperties({ copy, emptyText, emptyTitle, locale, properties }: SavedPropertiesProps) {
  const [savedSlugs, setSavedSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    const update = () => setSavedSlugs(readSavedPropertySlugs());
    update();
    window.addEventListener(savedPropertiesChangedEvent, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(savedPropertiesChangedEvent, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (savedSlugs === null) return <div className="saved-properties-loading" aria-busy="true" />;
  const savedProperties = properties.filter((property) => savedSlugs.includes(property.slug));

  if (savedProperties.length === 0) {
    return <section className="saved-empty"><h2>{emptyTitle}</h2><p>{emptyText}</p><Link className="button button-primary" href="/properties">{copy.buttons.browseProperties}</Link></section>;
  }

  return (
    <section className="property-grid saved-property-grid">
      {savedProperties.map((property) => <PropertyCard bathroomsLabel={copy.propertyMeta.bathroomsShort} bedroomsLabel={copy.propertyMeta.bedroomsShort} buttonLabel={copy.buttons.viewDetails} key={property.id} locale={locale} property={property} />)}
    </section>
  );
}
