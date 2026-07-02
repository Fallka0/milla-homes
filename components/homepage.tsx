import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { ContactActions } from "@/components/contact-actions";
import { PublicHeader } from "@/components/public-header";
import { PropertyCard } from "@/components/property-card";
import { ReactBitsMasonry } from "@/components/react-bits-masonry";
import { SiteFooter } from "@/components/site-footer";
import { regions, regionSlugs } from "@/lib/regions";
import { formatOptionalPrice, formatPrice, getPropertyPreviewImageUrl, type PropertyRecord } from "@/lib/property-shared";
import {
  getLocalizedListingModeLabel,
  getLocalizedRentPricePeriodLabel,
  type PublicCopy,
  type PublicLocale,
} from "@/lib/public-copy";

type HomepageProps = {
  adminLabel?: string;
  copy: PublicCopy;
  currentLocale: PublicLocale;
  featuredProperties: PropertyRecord[];
  latestProperties: PropertyRecord[];
};

const masonryHeights = [300, 420, 340, 390, 460, 320];

export function Homepage({ adminLabel, copy, currentLocale, featuredProperties, latestProperties }: HomepageProps) {
  const fallbackPreviewImage = "/logos/verdant-seal.svg";
  const masonryItems = latestProperties.map((property, index) => ({
    id: property.id,
    img: getPropertyPreviewImageUrl(property) ?? fallbackPreviewImage,
    title: property.title,
    url: `/properties/${property.slug}`,
    height: masonryHeights[index % masonryHeights.length],
  }));

  return (
    <main className="site-shell section-stack" data-locale={currentLocale} lang={currentLocale}>
      <PublicHeader
        adminLabel={adminLabel}
        compact
        currentLocale={currentLocale}
        languageLabel={copy.languageLabel}
        nav={copy.nav}
      />

      <section className="homepage-intro">
        <div className="hero-panel homepage-hero-panel">
          <div className="section-heading homepage-hero-copy">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <div className="hero-actions">
              <Link className="button button-primary hero-primary-button" href="/properties">
                {copy.buttons.browseProperties}
              </Link>
              <ContactActions
                callLabel={copy.buttons.callNow}
                whatsappLabel={copy.buttons.whatsapp}
                whatsappMessage={copy.contact.whatsappMessage}
              />
            </div>
          </div>

          <aside className="hero-side-card">
            <p className="eyebrow">{copy.propertyMeta.featuredSnapshot}</p>
            {featuredProperties[0] ? (
              <>
                <Link className="hero-side-image-link" href={`/properties/${featuredProperties[0].slug}`}>
                  <Image
                    className="hero-side-image"
                    src={getPropertyPreviewImageUrl(featuredProperties[0]) ?? fallbackPreviewImage}
                    alt={featuredProperties[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    priority
                  />
                </Link>
                <h2>{featuredProperties[0].title}</h2>
                <p>{featuredProperties[0].shortDescription}</p>
                <div className="hero-side-facts">
                  <span>{featuredProperties[0].location}</span>
                  <span>{getLocalizedListingModeLabel(currentLocale, featuredProperties[0].listingMode)}</span>
                  <span>
                    {featuredProperties[0].bedrooms} {copy.propertyMeta.bedroomsShort} •{" "}
                    {featuredProperties[0].bathrooms} {copy.propertyMeta.bathroomsShort}
                  </span>
                </div>
                <div className="price-stack hero-price-stack">
                  {(featuredProperties[0].listingMode === "sale" || featuredProperties[0].listingMode === "both") ? (
                    <strong className="price-tag">{formatPrice(featuredProperties[0].priceEuro)}</strong>
                  ) : null}
                  {(featuredProperties[0].listingMode === "rent" || featuredProperties[0].listingMode === "both") &&
                  featuredProperties[0].rentPriceEuro ? (
                    <span className="rent-price-tag">
                      {formatOptionalPrice(featuredProperties[0].rentPriceEuro)}{" "}
                      {featuredProperties[0].rentPricePeriod
                        ? getLocalizedRentPricePeriodLabel(currentLocale, featuredProperties[0].rentPricePeriod)
                        : ""}
                    </span>
                  ) : null}
                </div>
                <Link className="button button-ghost" href={`/properties/${featuredProperties[0].slug}`}>
                  {copy.buttons.viewListing}
                </Link>
              </>
            ) : (
              <>
                <h2>{copy.coverage.title}</h2>
                <p>{copy.coverage.summary}</p>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-heading compact neighborhood-heading">
          <p className="eyebrow">{copy.neighborhoods.eyebrow}</p>
          <h3>{copy.neighborhoods.title}</h3>
        </div>
        <div className="neighborhood-grid">
          {copy.neighborhoods.cards.map((card, index) => {
            const slug = regionSlugs[index];
            if (!slug) {
              return null;
            }
            const region = regions[slug];

            return (
              <Link className="neighborhood-card-link" href={`/regions/${slug}`} key={slug}>
                <article
                  className="neighborhood-card"
                  style={{ "--neighborhood-image": `url("${region.imageUrl}")` } as CSSProperties}
                >
                  <p className="eyebrow">{card.area}</p>
                  <h3>{card.title}</h3>
                  <p>{card.summary}</p>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-heading with-action">
          <div>
            <p className="eyebrow">{copy.propertyMeta.featuredSnapshot}</p>
            <h2>{copy.propertyMeta.updatedListings}</h2>
          </div>
          <Link className="button button-secondary" href="/properties">
            {copy.buttons.seeAllProperties}
          </Link>
        </div>

        <div className="property-grid">
          {featuredProperties.map((property) => (
            <PropertyCard
              bathroomsLabel={copy.propertyMeta.bathroomsShort}
              bedroomsLabel={copy.propertyMeta.bedroomsShort}
              buttonLabel={copy.buttons.viewDetails}
              key={property.id}
              locale={currentLocale}
              property={property}
            />
          ))}
        </div>
      </section>

      <section className="section contact-section">
        <div className="contact-copy">
          <p className="eyebrow">{copy.contact.eyebrow}</p>
          <h2>{copy.contact.title}</h2>
        </div>

        <div className="market-panel">
          <h3>{copy.contact.panelTitle}</h3>
          <ContactActions
            callLabel={copy.buttons.callNow}
            className="contact-actions"
            whatsappLabel={copy.buttons.whatsapp}
            whatsappMessage={copy.contact.whatsappMessage}
          />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">{copy.testimonials.eyebrow}</p>
          <h2>{copy.testimonials.title}</h2>
        </div>

        <div className="testimonial-grid">
          {copy.testimonials.items.map((item) => (
            <article className="testimonial-card" key={`${item.name}-${item.role}`}>
              <div className="testimonial-stars" aria-label={`${item.rating} / 5`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={index < item.rating ? "is-filled" : ""} aria-hidden>
                    ★
                  </span>
                ))}
              </div>
              <p className="testimonial-quote">{item.quote}</p>
              <div className="testimonial-meta">
                <span className="testimonial-avatar" aria-hidden>
                  {item.name.replace(/[^\p{L}]/gu, " ").trim().charAt(0)}
                </span>
                <span className="testimonial-person">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading with-action">
          <div>
            <p className="eyebrow">{copy.masonry.eyebrow}</p>
            <h2>{copy.masonry.title}</h2>
          </div>
          <Link className="button button-ghost button-wide" href="/properties">
            {copy.buttons.openListings}
          </Link>
        </div>

        <div className="masonry-desktop">
          <ReactBitsMasonry items={masonryItems} />
        </div>

        <div className="masonry-mobile-fallback">
          <div className="property-grid">
            {latestProperties.map((property) => (
              <PropertyCard
                bathroomsLabel={copy.propertyMeta.bathroomsShort}
                bedroomsLabel={copy.propertyMeta.bedroomsShort}
                buttonLabel={copy.buttons.viewDetails}
                key={property.id}
                locale={currentLocale}
                property={property}
              />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter copy={copy} />
    </main>
  );
}
