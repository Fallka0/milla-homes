import Image from "next/image";
import Link from "next/link";
import { SavePropertyButton } from "@/components/save-property-button";

import {
  getLocalizedListingModeLabel,
  type PublicLocale,
  getLocalizedRentPricePeriodLabel,
  getLocalizedPropertyStatusLabel,
  getLocalizedPropertyTypeLabel,
} from "@/lib/public-copy";
import {
  formatPrice,
  formatOptionalPrice,
  getPropertyPreviewImageUrl,
  isVideoAssetUrl,
  type PropertyRecord,
} from "@/lib/property-shared";

type PropertyCardProps = {
  bathroomsLabel: string;
  bedroomsLabel: string;
  buttonLabel: string;
  locale: PublicLocale;
  property: PropertyRecord;
};

const bedIcon = (
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 18v2M21 18v2M3 13V7M7 11V9a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const bathIcon = (
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2M7 19l-1 2M18 19l1 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const areaIcon = (
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 4h16v16H4V4Zm0 6h4M4 15h4M14 20v-4M9 20v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function PropertyCard({
  bathroomsLabel,
  bedroomsLabel,
  buttonLabel,
  locale,
  property,
}: PropertyCardProps) {
  const hasSalePrice = property.listingMode === "sale" || property.listingMode === "both";
  const hasRentPrice =
    (property.listingMode === "rent" || property.listingMode === "both") && Boolean(property.rentPriceEuro);
  const previewImageUrl = getPropertyPreviewImageUrl(property);
  const previewVideoUrl = !previewImageUrl && isVideoAssetUrl(property.mainImageUrl) ? property.mainImageUrl : null;

  return (
    <div className="property-card-shell">
      <Link className="property-card-link" href={`/properties/${property.slug}`} aria-label={`${property.title} — ${buttonLabel}`}>
      <article className="property-card">
        <div className="property-image-wrap">
          {previewImageUrl ? (
            <Image
              className="property-image"
              src={previewImageUrl}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : previewVideoUrl ? (
            <video
              aria-label={property.title}
              className="property-video-preview"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              src={previewVideoUrl}
            />
          ) : (
            <Image
              className="property-image"
              src="/logos/verdant-seal.svg"
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="property-badges">
            <span className={`pill status-${property.status}`}>{getLocalizedPropertyStatusLabel(locale, property.status)}</span>
            <span className="pill pill-secondary">{getLocalizedListingModeLabel(locale, property.listingMode)}</span>
            <span className="pill pill-secondary">{getLocalizedPropertyTypeLabel(locale, property.type)}</span>
          </div>
        </div>

        <div className="property-card-body">
          <div className="property-card-topline">
            <span>{property.location}</span>
          </div>
          <h3>{property.title}</h3>
          <div className="property-meta">
            <span>{bedIcon}{property.bedrooms} {bedroomsLabel}</span>
            <span>{bathIcon}{property.bathrooms} {bathroomsLabel}</span>
            {property.interiorSqm ? <span>{areaIcon}{property.interiorSqm} m²</span> : null}
          </div>

        <div className="property-card-footer">
          <div className="price-stack">
            <div className={`price-line ${hasRentPrice ? "price-line-dual" : "price-line-single"}`}>
              {hasSalePrice ? (
                <strong className="price-tag">{formatPrice(property.priceEuro)}</strong>
              ) : null}
                {hasRentPrice ? (
                  <span className="price-tag rent-price-inline">
                    {formatOptionalPrice(property.rentPriceEuro)}{" "}
                    {property.rentPricePeriod ? getLocalizedRentPricePeriodLabel(locale, property.rentPricePeriod) : ""}
                  </span>
                ) : (
                  <span aria-hidden="true" className="price-tag rent-price-inline rent-price-tag-placeholder">
                    &nbsp;
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
      </Link>
      <SavePropertyButton locale={locale} slug={property.slug} />
    </div>
  );
}
