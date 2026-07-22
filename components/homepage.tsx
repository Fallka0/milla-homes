import type { CSSProperties } from "react";
import Link from "next/link";

import { ContactActions } from "@/components/contact-actions";
import { PublicHeader } from "@/components/public-header";
import { PropertyCard } from "@/components/property-card";
import { ReactBitsMasonry } from "@/components/react-bits-masonry";
import { SiteFooter } from "@/components/site-footer";
import { regions, regionSlugs } from "@/lib/regions";
import { getPropertyPreviewImageUrl, type PropertyRecord } from "@/lib/property-shared";
import { type PublicCopy, type PublicLocale } from "@/lib/public-copy";

const heroArrowIcon = (
  <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 17L17 7M17 7H9M17 7V15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

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
  const heroImage =
    getPropertyPreviewImageUrl(featuredProperties[0]) ?? regions[regionSlugs[0]]?.imageUrl ?? fallbackPreviewImage;
  const coveragePills = regionSlugs
    .slice(0, 5)
    .map((slug) => regions[slug].localeContent[currentLocale].areaLabel);
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

      <section className="hero-v2">
        <div
          className="hero-billboard"
          style={{ "--hero-image": `url("${heroImage}")` } as CSSProperties}
        >
          <div className="hero-billboard-inner">
            <div className="hero-billboard-copy">
              <p className="eyebrow eyebrow-on-dark">{copy.hero.eyebrow}</p>
              <h1>{copy.hero.title}</h1>
              <p className="hero-billboard-text">{copy.hero.text}</p>
            </div>
            <form className="hero-search" action="/properties" method="get" role="search">
              <input
                type="text"
                name="q"
                placeholder={copy.filters.searchPlaceholder}
                aria-label={copy.filters.search}
              />
              <button type="submit" className="button button-primary">
                {copy.buttons.browseProperties}
              </button>
            </form>
          </div>
        </div>

        <div className="hero-cta-row">
          <Link className="hero-cta-card" href="/properties">
            <span>{copy.buttons.browseProperties}</span>
            <span className="hero-cta-arrow" aria-hidden>
              {heroArrowIcon}
            </span>
          </Link>
          <Link className="hero-cta-card" href="/sell-or-rent">
            <span>{copy.nav.owner}</span>
            <span className="hero-cta-arrow" aria-hidden>
              {heroArrowIcon}
            </span>
          </Link>
          <Link className="hero-cta-card" href="/guides/buying">
            <span>{copy.nav.guide}</span>
            <span className="hero-cta-arrow" aria-hidden>
              {heroArrowIcon}
            </span>
          </Link>
        </div>

        <div className="hero-coverage">
          <span className="hero-coverage-label">{copy.neighborhoods.eyebrow}</span>
          {coveragePills.map((label) => (
            <span className="hero-coverage-pill" key={label}>
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading compact neighborhood-heading">
          <p className="eyebrow">{copy.neighborhoods.eyebrow}</p>
          <h3>{copy.neighborhoods.title}</h3>
        </div>
        <div className="neighborhood-grid">
          {regionSlugs.map((slug) => {
            const region = regions[slug];
            const content = region.localeContent[currentLocale];

            return (
              <Link className="neighborhood-card-link" href={`/regions/${slug}`} key={slug}>
                <article
                  className="neighborhood-card"
                  style={{ "--neighborhood-image": `url("${region.imageUrl}")` } as CSSProperties}
                >
                  <div className="neighborhood-card-content">
                    <p className="eyebrow">{content.areaLabel}</p>
                    <h3>{content.title}</h3>
                    <p>{content.highlights[0]}</p>
                    <span className="neighborhood-card-arrow" aria-hidden>
                      <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7 17L17 7M17 7H9M17 7V15"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                  </div>
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

      <SiteFooter copy={copy} locale={currentLocale} />
    </main>
  );
}
