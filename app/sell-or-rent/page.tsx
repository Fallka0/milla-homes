import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { ArrowUpRight } from "@/components/arrow-up-right";
import { OwnerLeadForm } from "@/components/owner-lead-form";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { getWhatsAppHref } from "@/lib/contact";
import { ownerPageContent } from "@/lib/owner-page-content";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const content = ownerPageContent[locale];
  return { title: content.title, description: content.intro, alternates: { canonical: "/sell-or-rent" }, openGraph: { title: `${content.title} · Milla Homes`, description: content.intro, url: "/sell-or-rent", type: "website" } };
}

export default async function SellOrRentPage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const content = ownerPageContent[locale];
  const adminLocale = resolveAdminLocale(locale);
  const authState = await getAdminAuthState();

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined} compact currentLocale={locale} languageLabel={copy.languageLabel} nav={copy.nav} />

      <article className="owner-page">
        <header className="owner-hero">
          <div><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p>{content.intro}</p></div>
          <div className="owner-intent-list" aria-label={content.choicesTitle}><span>01 · {content.sell}</span><span>02 · {content.longRent}</span><span>03 · {content.holidayRent}</span></div>
        </header>

        <section className="owner-options" data-reveal aria-labelledby="owner-options-title">
          <div className="owner-section-heading"><p className="eyebrow">{content.eyebrow}</p><h2 id="owner-options-title">{content.choicesTitle}</h2></div>
          <div className="owner-option-grid">{content.choices.map((choice, index) => <article key={choice.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{choice.title}</h3><p>{choice.body}</p></article>)}</div>
        </section>

        <section className="owner-process" data-reveal aria-labelledby="owner-process-title">
          <div className="owner-section-heading"><p className="eyebrow">{content.processEyebrow}</p><h2 id="owner-process-title">{content.processTitle}</h2></div>
          <ol>{content.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
        </section>

        <section className="owner-form-section" data-reveal aria-labelledby="owner-form-title">
          <div className="owner-form-copy"><p className="eyebrow">{content.formEyebrow}</p><h2 id="owner-form-title">{content.formTitle}</h2><p>{content.formIntro}</p><Link href={getWhatsAppHref(copy.contact.whatsappMessage)} rel="noreferrer" target="_blank">{content.reassurance} <ArrowUpRight /></Link></div>
          <OwnerLeadForm content={content} copy={copy} locale={locale} />
        </section>
      </article>

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
