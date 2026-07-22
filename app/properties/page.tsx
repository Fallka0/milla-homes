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

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const [rawProperties, authState, params] = await Promise.all([
    getPublicProperties(),
    getAdminAuthState(),
    searchParams,
  ]);
  const properties = localizeProperties(rawProperties, locale);
  const adminLocale = resolveAdminLocale(locale);
  const initialSearch = typeof params.q === "string" ? params.q : "";

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader
        adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined}
        compact
        currentLocale={locale}
        languageLabel={copy.languageLabel}
        nav={copy.nav}
      />

      <section className="properties-intro-minimal">
        <h1>{copy.propertiesPage.title}</h1>
      </section>

      <PropertyFilters copy={copy} locale={locale} properties={properties} initialSearch={initialSearch} />
      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
