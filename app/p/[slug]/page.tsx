import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SharePropertyPage } from "@/components/share/share-property-page";
import { buildSharePropertyMetadata } from "@/lib/share-metadata";
import { defaultShareLocale, getSharePropertyBySlug } from "@/lib/share-property";

// Rendered per request, then held at the CDN edge by the Cache-Control header in
// next.config.ts — so a buyer on 4G is still served from a nearby cache. It is
// not prerendered because <html lang> depends on the request path (see
// proxy.ts), and content comes from a checked-in JSON file, so a render is a
// lookup in an in-memory array. The Open Graph tags are produced on the server
// either way, which is the part scrapers depend on.

type SharePropertyRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SharePropertyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getSharePropertyBySlug(slug);

  if (!property) {
    return { title: "Milla Homes" };
  }

  return buildSharePropertyMetadata(property, defaultShareLocale);
}

export default async function SharePropertyRoute({ params }: SharePropertyRouteProps) {
  const { slug } = await params;
  const property = getSharePropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return <SharePropertyPage locale={defaultShareLocale} property={property} />;
}
