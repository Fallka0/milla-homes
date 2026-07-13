import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { InquiryForm } from "@/components/inquiry-form";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { contactContent } from "@/lib/company-pages";
import { getPhoneHref, getWhatsAppHref, motherPhoneDisplay, officeAddressDisplay } from "@/lib/contact";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const content = contactContent[locale];
  return { title: content.title, description: content.intro, alternates: { canonical: "/contact" }, openGraph: { title: `${content.title} · Milla Homes`, description: content.intro, url: "/contact", type: "website" } };
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const content = contactContent[locale];
  const adminLocale = resolveAdminLocale(locale);
  const authState = await getAdminAuthState();

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined} compact currentLocale={locale} languageLabel={copy.languageLabel} nav={copy.nav} />

      <article className="contact-page">
        <header className="company-hero contact-page-hero"><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}</h1><p>{content.intro}</p></header>

        <section className="contact-methods">
          <Link href={getPhoneHref()}><span className="contact-method-number">01</span><div><h2>{content.callTitle}</h2><p>{content.callText}</p><strong>{motherPhoneDisplay}</strong></div><span className="contact-method-arrow" aria-hidden>↗</span></Link>
          <Link href={getWhatsAppHref(copy.contact.whatsappMessage)} rel="noreferrer" target="_blank"><span className="contact-method-number">02</span><div><h2>{content.whatsappTitle}</h2><p>{content.whatsappText}</p><strong>WhatsApp</strong></div><span className="contact-method-arrow" aria-hidden>↗</span></Link>
          <Link href="/office"><span className="contact-method-number">03</span><div><h2>{content.visitTitle}</h2><p>{content.visitText}</p><strong>{officeAddressDisplay}</strong></div><span className="contact-method-arrow" aria-hidden>↗</span></Link>
        </section>

        <section className="contact-form-section">
          <div className="company-section-heading"><p className="eyebrow">{content.formEyebrow}</p><h2>{content.formTitle}</h2><p>{content.formText}</p><span>{content.availability}</span></div>
          <InquiryForm copy={copy} locale={locale} />
        </section>
      </article>

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
