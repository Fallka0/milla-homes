import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { aboutContent } from "@/lib/company-pages";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";
import { regions, regionSlugs } from "@/lib/regions";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const content = aboutContent[locale];
  return { title: content.title, description: content.intro, alternates: { canonical: "/about" }, openGraph: { title: `${content.title} · Milla Homes`, description: content.intro, url: "/about", type: "website" } };
}

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const content = aboutContent[locale];
  const adminLocale = resolveAdminLocale(locale);
  const authState = await getAdminAuthState();

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined} compact currentLocale={locale} languageLabel={copy.languageLabel} nav={copy.nav} />

      <article className="company-page">
        <header className="company-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </header>

        <section className="company-story">
          <div className="company-section-heading"><p className="eyebrow">{content.storyEyebrow}</p><h2>{content.storyTitle}</h2></div>
          <div className="company-story-copy">{content.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>

        <section className="company-values">
          {content.values.map((value, index) => <article key={value.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{value.title}</h2><p>{value.body}</p></article>)}
        </section>

        <section className="company-areas">
          <div className="company-section-heading"><p className="eyebrow">{content.areasEyebrow}</p><h2>{content.areasTitle}</h2></div>
          <div className="company-area-links">{regionSlugs.map((slug) => <Link href={`/regions/${slug}`} key={slug}>{regions[slug].localeContent[locale].areaLabel}<span aria-hidden>↗</span></Link>)}</div>
        </section>

        <section className="company-page-cta"><div><h2>{content.ctaTitle}</h2><p>{content.ctaText}</p></div><Link className="button button-primary" href="/contact">{copy.nav.contact}</Link></section>
      </article>

      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
