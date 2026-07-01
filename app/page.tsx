import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Homepage } from "@/components/homepage";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";
import { getFeaturedProperties, getLatestPublicProperties, localizeProperties } from "@/lib/properties";
import { getPropertyPreviewImageUrl } from "@/lib/property-shared";
import { motherPhoneNumber } from "@/lib/contact";
import { getCanonicalUrl, getOpenGraphLocale } from "@/lib/seo";
import { getPublicSiteUrl, publicSiteUrl } from "@/lib/site-urls";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const [featuredProperty] = localizeProperties(await getFeaturedProperties(1), locale);
  const featuredPreviewImage = featuredProperty ? getPropertyPreviewImageUrl(featuredProperty) ?? "/logos/verdant-seal.svg" : null;

  return {
    title: copy.seo.title,
    description: copy.seo.description,
    alternates: {
      canonical: getCanonicalUrl("/"),
    },
    openGraph: {
      title: copy.seo.ogTitle,
      description: copy.seo.ogDescription,
      url: getCanonicalUrl("/"),
      siteName: "Milla Homes",
      locale: getOpenGraphLocale(locale),
      type: "website",
      images: featuredPreviewImage && featuredProperty
        ? [
            {
              alt: featuredProperty.title,
              url: featuredPreviewImage,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.seo.ogTitle,
      description: copy.seo.ogDescription,
      images: featuredPreviewImage ? [featuredPreviewImage] : undefined,
    },
  };
}

export default async function Home() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const [rawFeaturedProperties, rawLatestProperties, authState] = await Promise.all([
    getFeaturedProperties(3),
    getLatestPublicProperties(6),
    getAdminAuthState(),
  ]);
  const adminLocale = resolveAdminLocale(locale);
  const featuredProperties = localizeProperties(rawFeaturedProperties, locale);
  const latestProperties = localizeProperties(rawLatestProperties, locale);

  // Site-wide business identity for search engines (rich results, knowledge panel).
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Milla Homes",
    url: publicSiteUrl,
    image: getPublicSiteUrl("/logos/mh-logo.png"),
    logo: getPublicSiteUrl("/logos/mh-logo.png"),
    telephone: motherPhoneNumber,
    priceRange: "€€",
    areaServed: [
      "Torrevieja",
      "Orihuela Costa",
      "La Zenia",
      "Cabo Roig",
      "Guardamar del Segura",
      "Pilar de la Horadada",
      "Costa Blanca",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Torrevieja",
      addressRegion: "Alicante",
      addressCountry: "ES",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Homepage
      adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined}
      copy={publicCopy[locale]}
      currentLocale={locale}
      featuredProperties={featuredProperties}
      latestProperties={latestProperties}
    />
    </>
  );
}
