import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SharePropertyPage } from "@/components/share/share-property-page";
import { buildSharePropertyMetadata } from "@/lib/share-metadata";
import { defaultShareLocale, getSharePropertyBySlug, isShareLocale } from "@/lib/share-property";

// See the note in ../page.tsx on why these render per request and are cached at
// the edge rather than prerendered.

type ShareLocalizedRouteProps = {
  params: Promise<{ lang: string; slug: string }>;
};

// The default language lives at the bare /p/[slug]; next.config.ts permanently
// redirects /p/[slug]/en there so the page never gains a second address, and the
// route below treats "en" as not-found for anything that slips past the redirect.

export async function generateMetadata({ params }: ShareLocalizedRouteProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const property = getSharePropertyBySlug(slug);

  if (!property || !isShareLocale(lang)) {
    return { title: "Milla Homes" };
  }

  return buildSharePropertyMetadata(property, lang);
}

export default async function ShareLocalizedRoute({ params }: ShareLocalizedRouteProps) {
  const { lang, slug } = await params;
  const property = getSharePropertyBySlug(slug);

  if (!property || !isShareLocale(lang) || lang === defaultShareLocale) {
    notFound();
  }

  return <SharePropertyPage locale={lang} property={property} />;
}
