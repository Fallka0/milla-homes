import type { Metadata } from "next";

import { getOpenGraphLocale, truncateSeoDescription } from "@/lib/seo";
import { buildOgImageUrl, ogImageHeight, ogImageWidth } from "@/lib/share-images";
import { getPublicSiteUrl } from "@/lib/site-urls";
import {
  defaultShareLocale,
  formatSharePrice,
  getSharePropertyPath,
  shareLocales,
  type ShareLocale,
  type ShareProperty,
} from "@/lib/share-property";

// Everything a link-preview scraper reads is assembled here and returned from
// `generateMetadata`, so the tags land in the server-rendered <head>. WhatsApp
// and Telegram do not execute JavaScript — anything injected on the client is
// invisible to them.

/** og:title carries the price, because that is what makes the card worth tapping. */
export function buildShareOgTitle(property: ShareProperty, locale: ShareLocale) {
  const content = property.content[locale];

  return `${content.title} · ${formatSharePrice(property.priceEuro)}`;
}

export function buildShareOgDescription(property: ShareProperty, locale: ShareLocale) {
  const content = property.content[locale];

  return truncateSeoDescription(`${content.town} · ${content.shortDescription}`);
}

function buildLanguageAlternates(slug: string) {
  const languages = Object.fromEntries(
    shareLocales.map((locale) => [locale, getPublicSiteUrl(getSharePropertyPath(slug, locale))]),
  ) as Record<ShareLocale, string>;

  return {
    ...languages,
    "x-default": getPublicSiteUrl(getSharePropertyPath(slug, defaultShareLocale)),
  };
}

export function buildSharePropertyMetadata(property: ShareProperty, locale: ShareLocale): Metadata {
  const content = property.content[locale];
  const canonicalUrl = getPublicSiteUrl(getSharePropertyPath(property.slug, locale));
  const ogTitle = buildShareOgTitle(property, locale);
  const ogDescription = buildShareOgDescription(property, locale);
  const ogImage = buildOgImageUrl(property.ogImage ?? property.images[0]);

  return {
    title: `${content.title} · ${content.town}`,
    description: ogDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(property.slug),
    },
    openGraph: {
      type: "website",
      siteName: "Milla Homes",
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      locale: getOpenGraphLocale(locale),
      alternateLocale: shareLocales
        .filter((alternate) => alternate !== locale)
        .map((alternate) => getOpenGraphLocale(alternate)),
      images: [
        {
          url: ogImage,
          width: ogImageWidth,
          height: ogImageHeight,
          type: "image/jpeg",
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    other: {
      // WhatsApp reads the reference straight off the card for some clients and
      // it costs nothing to make the listing code machine-readable.
      "property:reference": property.reference,
    },
  };
}

export function buildSharePropertyJsonLd(property: ShareProperty, locale: ShareLocale) {
  const content = property.content[locale];

  return {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: content.title,
    description: content.shortDescription,
    url: getPublicSiteUrl(getSharePropertyPath(property.slug, locale)),
    image: [buildOgImageUrl(property.ogImage ?? property.images[0])],
    identifier: property.reference,
    numberOfBedrooms: property.facts.bedrooms,
    numberOfBathroomsTotal: property.facts.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      unitCode: "MTK",
      value: property.facts.builtSqm,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: content.town,
      addressRegion: "Alicante",
      addressCountry: "ES",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: property.priceEuro,
      priceCurrency: "EUR",
      url: getPublicSiteUrl(getSharePropertyPath(property.slug, locale)),
    },
  };
}
