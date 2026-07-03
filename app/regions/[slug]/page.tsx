import type { CSSProperties } from "react";

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PropertyCard } from "@/components/property-card";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { getRegionBySlug, regionSlugs, type RegionSlug } from "@/lib/regions";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";
import { getPublicProperties, localizeProperties } from "@/lib/properties";
import { getCanonicalUrl, getOpenGraphLocale, truncateSeoDescription } from "@/lib/seo";

export const dynamic = "force-dynamic";

type RegionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return regionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const { slug } = await params;
  const region = getRegionBySlug(slug as RegionSlug);

  if (!region) {
    return {
      title: "Region not found | Milla Homes",
    };
  }

  const content = region.localeContent[locale];
  const title = `${content.areaLabel} real estate | Milla Homes`;
  const description = truncateSeoDescription(content.body);
  const canonicalUrl = getCanonicalUrl(`/regions/${region.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Milla Homes",
      locale: getOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          alt: content.areaLabel,
          url: region.imageUrl,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [region.imageUrl],
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const { slug } = await params;
  const region = getRegionBySlug(slug as RegionSlug);

  if (!region) {
    notFound();
  }

  const [rawProperties, authState] = await Promise.all([getPublicProperties(), getAdminAuthState()]);
  const properties = localizeProperties(rawProperties, locale).filter(region.matchLocation);
  const adminLocale = resolveAdminLocale(locale);
  const content = region.localeContent[locale];

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader
        adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined}
        compact
        currentLocale={locale}
        languageLabel={copy.languageLabel}
        nav={copy.nav}
      />

      <section
        className="region-hero"
        style={{ "--region-image": `url("${region.imageUrl}")` } as CSSProperties}
      >
        <div className="region-hero-copy">
          <p className="eyebrow">{content.areaLabel}</p>
          <h1>{content.title}</h1>
          <p>{content.body}</p>
          <a className="region-credit" href={region.imageSourceUrl} rel="noreferrer" target="_blank">
            {content.areaLabel} photo via {region.imageCreditLabel}
          </a>
        </div>
      </section>

      <section className="region-page">
        <div className="region-content-grid">
          <article className="region-copy-card">
            <p className="eyebrow">{copy.coverage.eyebrow}</p>
            <h2>{content.areaLabel}</h2>
            <p>{content.body}</p>
          </article>

          <aside className="region-highlight-card">
            <p className="eyebrow">{copy.detail.listingOverview}</p>
            <h2>{copy.neighborhoods.title}</h2>
            <ul className="region-highlights">
              {content.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="section-heading with-action">
          <div>
            <p className="eyebrow">{content.areaLabel}</p>
            <h2>{copy.filters.availableInventory}</h2>
            <p>
              {properties.length} {copy.filters.results}
            </p>
          </div>
          <Link className="button button-secondary" href="/properties">
            {copy.buttons.seeAllProperties}
          </Link>
        </div>

        <div className="region-listing-stack">
          {properties.length > 0 ? (
            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard
                  bathroomsLabel={copy.propertyMeta.bathroomsShort}
                  bedroomsLabel={copy.propertyMeta.bedroomsShort}
                  buttonLabel={copy.buttons.viewDetails}
                  key={property.id}
                  locale={locale}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <h3>{copy.filters.emptyTitle}</h3>
              <p>{copy.filters.emptyBody}</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
