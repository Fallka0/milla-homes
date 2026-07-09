import type { Metadata } from "next";
import { cookies } from "next/headers";

import { notFound } from "next/navigation";

import { ContactActions } from "@/components/contact-actions";
import { ImageCarousel } from "@/components/image-carousel";
import { InquiryForm } from "@/components/inquiry-form";
import { PropertyCard } from "@/components/property-card";
import { PropertyDetailMap } from "@/components/property-detail-map";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { SavePropertyButton } from "@/components/save-property-button";
import { SharePropertyButton } from "@/components/share-property-button";
import { TourBookingForm } from "@/components/tour-booking-form";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { tourBookingCopy } from "@/lib/booking-copy";
import { getAdminAuthState } from "@/lib/auth";
import {
  getLocalizedListingModeLabel,
  getLocalizedPropertyFeatureLabel,
  getLocalizedRentPricePeriodLabel,
  getLocalizedRentalPeriodLabel,
  getLocalizedPropertyStatusLabel,
  getLocalizedPropertyTypeLabel,
  publicCopy,
  resolvePublicLocale,
} from "@/lib/public-copy";
import { getListingCoordinates, resolveZoneName } from "@/lib/geo";
import { formatOptionalPrice, formatPrice, getPropertyPreviewImageUrl } from "@/lib/property-shared";
import { getPropertyBySlug, getPublicProperties, localizeProperty } from "@/lib/properties";
import { getCanonicalUrl, getOpenGraphLocale, truncateSeoDescription } from "@/lib/seo";

export const dynamic = "force-dynamic";

function normalizeComparableText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function formatListingDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

type PropertyDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property not found | Milla Homes",
    };
  }

  const localizedProperty = localizeProperty(property, locale);
  const title = `${localizedProperty.title} | Milla Homes`;
  const description = truncateSeoDescription(localizedProperty.shortDescription || localizedProperty.description);
  const canonicalUrl = getCanonicalUrl(`/properties/${localizedProperty.slug}`);
  const previewImage = getPropertyPreviewImageUrl(localizedProperty);

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
      images: previewImage
        ? [
            {
              alt: localizedProperty.title,
              url: previewImage,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: previewImage ? [previewImage] : undefined,
    },
  };
}

const locationCopyByLocale: Record<string, { eyebrow: string; note: string }> = {
  en: { eyebrow: "Location", note: "Approximate area shown. Exact address provided on request." },
  es: { eyebrow: "Ubicación", note: "Zona aproximada. Dirección exacta facilitada bajo petición." },
  ru: { eyebrow: "Расположение", note: "Показан примерный район. Точный адрес — по запросу." },
  de: { eyebrow: "Lage", note: "Ungefähre Umgebung. Genaue Adresse auf Anfrage." },
};

const similarCopyByLocale: Record<string, { eyebrow: string; title: string }> = {
  en: { eyebrow: "Keep exploring", title: "Similar properties" },
  es: { eyebrow: "Sigue explorando", title: "Propiedades similares" },
  ru: { eyebrow: "Продолжить просмотр", title: "Похожие объекты" },
  de: { eyebrow: "Weiter entdecken", title: "Ähnliche Immobilien" },
};

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const locationCopy = locationCopyByLocale[locale] ?? locationCopyByLocale.en;
  const similarCopy = similarCopyByLocale[locale] ?? similarCopyByLocale.en;
  const { slug } = await params;
  const [property, allPublicProperties, authState] = await Promise.all([
    getPropertyBySlug(slug),
    getPublicProperties(),
    getAdminAuthState(),
  ]);
  const adminLocale = resolveAdminLocale(locale);

  if (!property) {
    notFound();
  }

  const localizedProperty = localizeProperty(property, locale);

  // Rank other listings by shared area, then type, then listing mode, so the
  // strip surfaces the most relevant nearby homes first.
  const currentZone = resolveZoneName(localizedProperty.location);
  const similarProperties = allPublicProperties
    .filter((item) => item.id !== localizedProperty.id)
    .map((item) => {
      const localized = localizeProperty(item, locale);
      const zone = resolveZoneName(localized.location);
      let score = 0;
      if (currentZone && zone === currentZone) score += 3;
      if (localized.type === localizedProperty.type) score += 2;
      if (localized.listingMode === localizedProperty.listingMode) score += 1;
      return { localized, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.localized);

  const heroSummary = localizedProperty.shortDescription || localizedProperty.description;
  const shouldShowFullDescription =
    Boolean(localizedProperty.description) &&
    normalizeComparableText(localizedProperty.description) !== normalizeComparableText(heroSummary);

  const gallery = [localizedProperty.mainImageUrl, ...localizedProperty.galleryUrls];
  const previewImage = getPropertyPreviewImageUrl(localizedProperty);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: localizedProperty.title,
    description: normalizeComparableText(localizedProperty.description || heroSummary),
    image: previewImage ? [previewImage] : undefined,
    url: getCanonicalUrl(`/properties/${localizedProperty.slug}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: localizedProperty.location,
      addressCountry: "ES",
    },
    numberOfBathroomsTotal: localizedProperty.bathrooms,
    numberOfBedrooms: localizedProperty.bedrooms,
    floorSize: localizedProperty.interiorSqm
      ? {
          "@type": "QuantitativeValue",
          unitCode: "MTK",
          value: localizedProperty.interiorSqm,
        }
      : undefined,
    offers:
      localizedProperty.listingMode === "rent" && localizedProperty.rentPriceEuro
        ? {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price: localizedProperty.rentPriceEuro,
            priceCurrency: "EUR",
            url: getCanonicalUrl(`/properties/${localizedProperty.slug}`),
          }
        : {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price: localizedProperty.priceEuro,
            priceCurrency: "EUR",
            url: getCanonicalUrl(`/properties/${localizedProperty.slug}`),
          },
  };

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicHeader
        adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined}
        compact
        currentLocale={locale}
        languageLabel={copy.languageLabel}
        nav={copy.nav}
      />

      <section className="detail-spotlight">
        <ImageCarousel copy={copy} images={gallery} title={localizedProperty.title} />

        <div className="property-detail-hero">
          <div className="section-heading">
            <p className="eyebrow">{localizedProperty.location}</p>
            <h1>{localizedProperty.title}</h1>
            <p>{heroSummary}</p>
            <div className="detail-hero-meta">
              <span className={`pill status-${localizedProperty.status}`}>
                {getLocalizedPropertyStatusLabel(locale, localizedProperty.status)}
              </span>
              <span className="pill pill-secondary">
                {getLocalizedListingModeLabel(locale, localizedProperty.listingMode)}
              </span>
              <span className="pill pill-secondary">
                {getLocalizedPropertyTypeLabel(locale, localizedProperty.type)}
              </span>
            </div>
          </div>
          <aside className="detail-price-card">
            <div className="detail-card-actions">
              <SavePropertyButton locale={locale} showSavedLink slug={localizedProperty.slug} />
              <SharePropertyButton locale={locale} title={localizedProperty.title} />
            </div>
            {(localizedProperty.listingMode === "sale" || localizedProperty.listingMode === "both") ? (
              <div className="detail-price-block">
                <span>{copy.detail.salePrice}</span>
                <strong>{formatPrice(localizedProperty.priceEuro)}</strong>
              </div>
            ) : null}
            {(localizedProperty.listingMode === "rent" || localizedProperty.listingMode === "both") && localizedProperty.rentPriceEuro ? (
              <div className="detail-price-block">
                <span>{copy.detail.rentPrice}</span>
                <strong>
                  {formatOptionalPrice(localizedProperty.rentPriceEuro)}{" "}
                  {localizedProperty.rentPricePeriod ? getLocalizedRentPricePeriodLabel(locale, localizedProperty.rentPricePeriod) : ""}
                </strong>
              </div>
            ) : null}
            <ContactActions
              callLabel={copy.buttons.callNow}
              className="contact-actions detail-contact-actions"
              whatsappLabel={copy.buttons.whatsapp}
              whatsappMessage={`${copy.contact.whatsappMessage} ${localizedProperty.title}`}
            />
          </aside>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-main">
          <div className="fact-grid">
            <article className="fact-card">
              <span>{copy.detail.type}</span>
              <strong>{getLocalizedPropertyTypeLabel(locale, localizedProperty.type)}</strong>
            </article>
            <article className="fact-card">
              <span>{copy.detail.listingMode}</span>
              <strong>{getLocalizedListingModeLabel(locale, localizedProperty.listingMode)}</strong>
            </article>
            <article className="fact-card">
              <span>{copy.detail.bedrooms}</span>
              <strong>{localizedProperty.bedrooms}</strong>
            </article>
            <article className="fact-card">
              <span>{copy.detail.bathrooms}</span>
              <strong>{localizedProperty.bathrooms}</strong>
            </article>
            {localizedProperty.interiorSqm ? (
              <article className="fact-card">
                <span>{copy.detail.interior}</span>
                <strong>{localizedProperty.interiorSqm} m²</strong>
              </article>
            ) : null}
            {localizedProperty.plotSqm ? (
              <article className="fact-card">
                <span>{copy.detail.plot}</span>
                <strong>{localizedProperty.plotSqm} m²</strong>
              </article>
            ) : null}
            {(localizedProperty.listingMode === "rent" || localizedProperty.listingMode === "both") && localizedProperty.availabilityStart ? (
              <article className="fact-card">
                <span>{copy.detail.availability}</span>
                <strong>
                  {formatListingDate(localizedProperty.availabilityStart, locale)}
                  {localizedProperty.availabilityEnd ? ` - ${formatListingDate(localizedProperty.availabilityEnd, locale)}` : ""}
                </strong>
              </article>
            ) : null}
          </div>

          <article className="detail-copy-card">
            <p className="eyebrow">{copy.detail.listingOverview}</p>
            <h2>{copy.detail.whyPause}</h2>
            <p>{heroSummary}</p>
            {shouldShowFullDescription ? <p>{localizedProperty.description}</p> : null}
            {localizedProperty.features.length > 0 ? (
              <>
                <p className="eyebrow">{copy.detail.features}</p>
                <div className="detail-feature-pills">
                  {localizedProperty.features.map((feature) => (
                    <span className="pill pill-secondary" key={feature}>
                      {getLocalizedPropertyFeatureLabel(locale, feature)}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
            {localizedProperty.rentalPeriods.length > 0 ? (
              <>
                <p className="eyebrow">{copy.detail.rentalPeriods}</p>
                <div className="detail-feature-pills">
                  {localizedProperty.rentalPeriods.map((period) => (
                    <span className="pill pill-secondary" key={period}>
                      {getLocalizedRentalPeriodLabel(locale, period)}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </article>

          <article className="detail-copy-card detail-location-card">
            <p className="eyebrow">{locationCopy.eyebrow}</p>
            <h2>{localizedProperty.location}</h2>
            <PropertyDetailMap
              center={getListingCoordinates({ id: localizedProperty.id, location: localizedProperty.location })}
              label={`${locationCopy.eyebrow}: ${localizedProperty.location}`}
            />
            <p className="detail-location-note">{locationCopy.note}</p>
          </article>
        </div>

        <aside className="detail-sidebar">
          <div className="tour-card">
            <p className="eyebrow">{tourBookingCopy[locale].eyebrow}</p>
            <h2>{tourBookingCopy[locale].title}</h2>
            <p className="tour-card-intro">{tourBookingCopy[locale].intro}</p>
            <TourBookingForm copy={tourBookingCopy[locale]} locale={locale} propertyId={localizedProperty.id} />
          </div>
          <div className="sticky-card">
            <p className="eyebrow">{copy.detail.requestInfo}</p>
            <h2>{copy.detail.requestTitle}</h2>
            <ContactActions
              callLabel={copy.buttons.callNow}
              className="contact-actions sticky-contact-actions"
              whatsappLabel={copy.buttons.whatsapp}
              whatsappMessage={`${copy.contact.whatsappMessage} ${localizedProperty.title}`}
            />
            <InquiryForm
              copy={copy}
              locale={locale}
              property={{
                id: localizedProperty.id,
                location: localizedProperty.location,
                title: localizedProperty.title,
              }}
            />
          </div>
        </aside>
      </section>

      {similarProperties.length > 0 ? (
        <section className="section detail-similar">
          <div className="section-heading compact">
            <p className="eyebrow">{similarCopy.eyebrow}</p>
            <h2>{similarCopy.title}</h2>
          </div>
          <div className="property-grid">
            {similarProperties.map((similar) => (
              <PropertyCard
                bathroomsLabel={copy.propertyMeta.bathroomsShort}
                bedroomsLabel={copy.propertyMeta.bedroomsShort}
                buttonLabel={copy.buttons.viewDetails}
                key={similar.id}
                locale={locale}
                property={similar}
              />
            ))}
          </div>
        </section>
      ) : null}

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
