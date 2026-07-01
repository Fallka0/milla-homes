import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PropertyFilters } from "@/components/property-filters";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";
import { getPublicProperties, localizeProperties } from "@/lib/properties";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];

  return {
    title: copy.propertiesPage.title,
    description: copy.propertiesPage.text,
    alternates: { canonical: "/properties" },
    openGraph: {
      title: `${copy.propertiesPage.title} · Milla Homes`,
      description: copy.propertiesPage.text,
      url: "/properties",
      type: "website",
    },
  };
}

export default async function PropertiesPage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const [rawProperties, authState] = await Promise.all([getPublicProperties(), getAdminAuthState()]);
  const properties = localizeProperties(rawProperties, locale);
  const adminLocale = resolveAdminLocale(locale);

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader
        adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined}
        compact
        currentLocale={locale}
        languageLabel={copy.languageLabel}
        nav={copy.nav}
      />

      <section className="section-heading properties-intro">
        <p className="eyebrow">{copy.propertiesPage.eyebrow}</p>
        <h1>{copy.propertiesPage.title}</h1>
        <p>{copy.propertiesPage.text}</p>
      </section>

      <PropertyFilters copy={copy} locale={locale} properties={properties} />
      <SiteFooter copy={copy} />
    </main>
  );
}
