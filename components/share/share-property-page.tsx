import Link from "next/link";

import { RentToOwnPanel } from "@/components/share/rent-to-own-panel";
import { ShareGallery } from "@/components/share/share-gallery";
import { ShareLanguageSwitcher } from "@/components/share/share-language-switcher";
import { ShareReference } from "@/components/share/share-reference";
import { ShareWhatsAppBar } from "@/components/share/share-whatsapp-bar";
import { shareCopy } from "@/lib/share-copy";
import { buildSharePropertyJsonLd } from "@/lib/share-metadata";
import {
  formatBeachDistance,
  formatShareArea,
  formatSharePrice,
  type ShareLocale,
  type ShareProperty,
} from "@/lib/share-property";

type SharePropertyPageProps = {
  locale: ShareLocale;
  property: ShareProperty;
};

function AgentAvatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (!photoUrl) {
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return (
      <span aria-hidden="true" className="share-agent-photo share-agent-initials">
        {initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see lib/share-images.ts
    <img alt="" className="share-agent-photo" height="64" loading="lazy" src={photoUrl} width="64" />
  );
}

export function SharePropertyPage({ locale, property }: SharePropertyPageProps) {
  const copy = shareCopy[locale];
  const content = property.content[locale];
  const { facts } = property;

  const keyFacts = [
    { label: copy.facts.bedrooms, value: String(facts.bedrooms) },
    { label: copy.facts.bathrooms, value: String(facts.bathrooms) },
    { label: copy.facts.built, value: formatShareArea(facts.builtSqm, locale) },
    {
      label: copy.facts.plot,
      value: facts.plotSqm === null ? copy.notApplicable : formatShareArea(facts.plotSqm, locale),
    },
    { label: copy.facts.pool, value: copy.poolValues[facts.pool] },
    { label: copy.facts.beach, value: formatBeachDistance(facts.beachDistanceMeters, locale) },
  ];

  return (
    <main className="share-page" lang={locale}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSharePropertyJsonLd(property, locale)) }}
      />

      <header className="share-header">
        <Link className="share-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element -- see lib/share-images.ts */}
          <img
            alt="Milla Homes"
            className="share-brand-logo"
            height="36"
            src="/logos/milla-homes-logo.png"
            width="36"
          />
          <span className="share-brand-name">Milla Homes</span>
        </Link>
        <ShareLanguageSwitcher currentLocale={locale} slug={property.slug} />
      </header>

      <ShareGallery copy={copy} images={property.images} title={content.title} />

      <section className="share-intro">
        <h1 className="share-title">{content.title}</h1>
        <p className="share-price">{formatSharePrice(property.priceEuro)}</p>
        <p className="share-town">{content.town}</p>
      </section>

      <section className="share-facts" aria-label={copy.facts.heading}>
        <h2 className="share-section-heading share-facts-heading">{copy.facts.heading}</h2>
        <dl className="share-facts-grid">
          {keyFacts.map((fact) => (
            <div className="share-fact" key={fact.label}>
              <dt className="share-fact-label">{fact.label}</dt>
              <dd className="share-fact-value">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="share-description">
        <h2 className="share-section-heading">{copy.description.heading}</h2>
        <p className="share-description-body">{content.shortDescription}</p>
      </section>

      <RentToOwnPanel locale={locale} />

      <section className="share-agent">
        <h2 className="share-section-heading">{copy.agent.heading}</h2>
        <div className="share-agent-card">
          <AgentAvatar name={property.agent.name} photoUrl={property.agent.photoUrl} />
          <div className="share-agent-details">
            <p className="share-agent-name">{property.agent.name}</p>
            <p className="share-agent-role">{copy.agent.role}</p>
          </div>
        </div>
      </section>

      <ShareReference copy={copy} reference={property.reference} />

      <ShareWhatsAppBar
        copy={copy}
        phone={property.agent.phone}
        reference={property.reference}
        title={content.title}
      />
    </main>
  );
}
