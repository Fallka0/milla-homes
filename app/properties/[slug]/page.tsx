import type { Metadata } from "next";
import { cookies } from "next/headers";

import { notFound } from "next/navigation";

import { ContactActions } from "@/components/contact-actions";
import { ImageCarousel } from "@/components/image-carousel";
import { InquiryForm } from "@/components/inquiry-form";
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
import { formatOptionalPrice, formatPrice, getPropertyPreviewImageUrl } from "@/lib/property-shared";
import { getPropertyBySlug, localizeProperty } from "@/lib/properties";
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

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const { slug } = await params;
  const [property, authState] = await Promise.all([getPropertyBySlug(slug), getAdminAuthState()]);
  const adminLocale = resolveAdminLocale(locale);

  if (!property) {
    notFound();
  }

  const localizedProperty = localizeProperty(property, locale);
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

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
