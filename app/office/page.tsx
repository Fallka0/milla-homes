import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { PropertyDetailMap } from "@/components/property-detail-map";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { officeContent } from "@/lib/company-pages";
import {
  getOfficeMapsHref,
  getPhoneHref,
  getWhatsAppHref,
  motherPhoneDisplay,
  officeAddressCity,
  officeAddressStreet,
  officeMapCenter,
} from "@/lib/contact";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";

export const dynamic = "force-dynamic";

const galleryPhotos = [
  { src: "/office/office-desk.jpg", wide: true },
  { src: "/office/office-front-desk.jpg", wide: true },
  { src: "/office/office-lounge.jpg", wide: false },
  { src: "/office/office-street.jpg", wide: false },
  { src: "/office/office-square.jpg", wide: false },
];

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const content = officeContent[locale];
  return { title: content.title, description: content.intro, alternates: { canonical: "/office" }, openGraph: { title: `${content.title} · Milla Homes`, description: content.intro, url: "/office", type: "website" } };
}

export default async function OfficePage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const content = officeContent[locale];
  const adminLocale = resolveAdminLocale(locale);
  const authState = await getAdminAuthState();

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined} compact currentLocale={locale} languageLabel={copy.languageLabel} nav={copy.nav} />

      <article className="company-page office-page">
        <header className="company-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </header>

        <section className="office-gallery-section">
          <div className="company-section-heading"><p className="eyebrow">{content.galleryEyebrow}</p><h2>{content.galleryTitle}</h2></div>
          <div className="office-gallery">
            {galleryPhotos.map((photo, index) => (
              <figure className={photo.wide ? "office-gallery-wide" : undefined} key={photo.src}>
                <Image alt={content.galleryAlts[index]} height={1800} src={photo.src} width={1350} priority={index < 2} />
              </figure>
            ))}
          </div>
        </section>

        <section className="company-story office-visit">
          <div className="company-section-heading"><p className="eyebrow">{content.visitEyebrow}</p><h2>{content.visitTitle}</h2><p>{content.visitText}</p></div>
          <div className="office-visit-details">
            <div className="office-address-card">
              <span className="office-address-label">{content.addressLabel}</span>
              <p className="office-address-lines">{officeAddressStreet}<br />{officeAddressCity}</p>
              <a className="button button-primary" href={getOfficeMapsHref()} rel="noreferrer" target="_blank">{content.mapsCta} <span aria-hidden>↗</span></a>
            </div>
            <PropertyDetailMap center={officeMapCenter} label={content.mapLabel} radius={60} zoom={16} />
            <p className="office-map-note">{content.mapNote}</p>
          </div>
        </section>

        <section className="company-story office-parking">
          <div className="company-section-heading"><p className="eyebrow">{content.parkingEyebrow}</p><h2>{content.parkingTitle}</h2></div>
          <div className="company-story-copy">{content.parkingText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>

        <section className="company-page-cta">
          <div><h2>{content.ctaTitle}</h2><p>{content.ctaText}</p></div>
          <div className="office-cta-actions">
            <Link className="button button-primary" href={getPhoneHref()}>{motherPhoneDisplay}</Link>
            <Link className="button button-primary" href={getWhatsAppHref(copy.contact.whatsappMessage)} rel="noreferrer" target="_blank">WhatsApp <span aria-hidden>↗</span></Link>
          </div>
        </section>
      </article>

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
