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
            <span>{property.bedrooms} {bedroomsLabel}</span>
            <span>{property.bathrooms} {bathroomsLabel}</span>
            {property.interiorSqm ? <span>{property.interiorSqm} m²</span> : null}
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
