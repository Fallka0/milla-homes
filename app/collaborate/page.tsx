import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { collaborateContent } from "@/lib/collaborate-content";
import { getPhoneHref, getWhatsAppHref } from "@/lib/contact";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const content = collaborateContent[locale];
  const title = `${content.titleLead} ${content.titleAccent}`;

  return {
    title: content.eyebrow,
    description: content.intro,
    alternates: { canonical: "/collaborate" },
    openGraph: {
      title: `${title} · Milla Homes`,
      description: content.intro,
      url: "/collaborate",
      type: "website",
    },
  };
}

export default async function CollaboratePage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const content = collaborateContent[locale];
  const adminLocale = resolveAdminLocale(locale);
  const authState = await getAdminAuthState();

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader
        adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined}
        compact
        currentLocale={locale}
        languageLabel={copy.languageLabel}
        nav={copy.nav}
      />

      <article className="collaborate-page">
        <header className="collaborate-hero">
          <p className="eyebrow eyebrow-on-dark">{content.eyebrow}</p>
          <h1>
            {content.titleLead} <em>{content.titleAccent}</em>
          </h1>
          <p className="collaborate-hero-intro">{content.intro}</p>
          <div className="collaborate-hero-actions">
            <Link
              className="button button-primary"
              href={getWhatsAppHref(copy.contact.whatsappMessage)}
              rel="noreferrer"
              target="_blank"
            >
              {content.ctaPrimary}
            </Link>
            <Link className="button button-ghost collaborate-ghost" href="/contact">
              {content.ctaSecondary}
            </Link>
          </div>
        </header>

        <section className="section collaborate-benefits" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">{content.benefitsEyebrow}</p>
            <h2>{content.benefitsTitle}</h2>
          </div>
          <div className="collaborate-benefit-grid">
            {content.benefits.map((benefit, index) => (
              <article className="collaborate-benefit-card" key={benefit.title}>
                <span className="collaborate-benefit-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section collaborate-how" data-reveal>
          <div className="section-heading">
            <p className="eyebrow">{content.howEyebrow}</p>
            <h2>{content.howTitle}</h2>
          </div>
          <ol className="collaborate-steps">
            {content.steps.map((step, index) => (
              <li key={step.title}>
                <span className="collaborate-step-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" data-reveal>
          <div className="contact-dark-card collaborate-closing">
            <h3>{content.closingTitle}</h3>
            <p>{content.closingBody}</p>
            <div className="collaborate-closing-actions">
              <Link className="button" href={getPhoneHref()}>
                {copy.buttons.callNow}
              </Link>
              <Link
                className="button collaborate-closing-whatsapp"
                href={getWhatsAppHref(copy.contact.whatsappMessage)}
                rel="noreferrer"
                target="_blank"
              >
                {copy.buttons.whatsapp}
              </Link>
            </div>
          </div>
        </section>
      </article>

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
