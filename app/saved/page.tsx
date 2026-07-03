import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PublicHeader } from "@/components/public-header";
import { SavedProperties } from "@/components/saved-properties";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { getPublicProperties, localizeProperties } from "@/lib/properties";
import { publicCopy, resolvePublicLocale, type PublicLocale } from "@/lib/public-copy";

export const dynamic = "force-dynamic";

const content: Record<PublicLocale, { title: string; intro: string; emptyTitle: string; emptyText: string }> = {
  en: { title: "Saved properties", intro: "A private shortlist stored on this device. No account required.", emptyTitle: "Your shortlist is ready when you are.", emptyText: "Use the heart on any property to keep it here while you compare." },
  es: { title: "Propiedades guardadas", intro: "Una selección privada guardada en este dispositivo. No necesitas cuenta.", emptyTitle: "Tu selección estará aquí cuando la necesites.", emptyText: "Usa el corazón de cualquier propiedad para guardarla mientras comparas." },
  de: { title: "Gespeicherte Immobilien", intro: "Eine private Auswahl auf diesem Gerät. Kein Konto erforderlich.", emptyTitle: "Ihre Auswahl wartet hier auf Sie.", emptyText: "Speichern Sie Immobilien mit dem Herz, während Sie vergleichen." },
  ru: { title: "Сохранённые объекты", intro: "Личная подборка хранится на этом устройстве. Аккаунт не нужен.", emptyTitle: "Ваша подборка будет ждать здесь.", emptyText: "Нажмите на сердце у объекта, чтобы сохранить его для сравнения." },
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  return { title: content[locale].title, description: content[locale].intro, robots: { index: false, follow: true } };
}

export default async function SavedPage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const pageCopy = content[locale];
  const [properties, authState] = await Promise.all([getPublicProperties(), getAdminAuthState()]);
  const adminLocale = resolveAdminLocale(locale);

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined} compact currentLocale={locale} languageLabel={copy.languageLabel} nav={copy.nav} />
      <header className="saved-page-header"><p className="eyebrow">{pageCopy.title}</p><h1>{pageCopy.title}</h1><p>{pageCopy.intro}</p></header>
      <SavedProperties copy={copy} emptyText={pageCopy.emptyText} emptyTitle={pageCopy.emptyTitle} locale={locale} properties={localizeProperties(properties, locale)} />
      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
