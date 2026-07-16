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

const content: Record<PublicLocale, { title: string; intro: string; sharedIntro: string; emptyTitle: string; emptyText: string; share: string; copied: string }> = {
  en: { title: "Saved properties", intro: "A private shortlist stored on this device. No account required.", sharedIntro: "A shared shortlist containing public property listings only.", emptyTitle: "Your shortlist is ready when you are.", emptyText: "Use the heart on any property to keep it here while you compare.", share: "Copy shareable link", copied: "Link copied" },
  es: { title: "Propiedades guardadas", intro: "Una selección privada guardada en este dispositivo. No necesitas cuenta.", sharedIntro: "Una selección compartida que solo contiene anuncios públicos.", emptyTitle: "Tu selección estará aquí cuando la necesites.", emptyText: "Usa el corazón de cualquier propiedad para guardarla mientras comparas.", share: "Copiar enlace", copied: "Enlace copiado" },
  de: { title: "Gespeicherte Immobilien", intro: "Eine private Auswahl auf diesem Gerät. Kein Konto erforderlich.", sharedIntro: "Eine geteilte Auswahl, die nur öffentliche Immobilienangebote enthält.", emptyTitle: "Ihre Auswahl wartet hier auf Sie.", emptyText: "Speichern Sie Immobilien mit dem Herz, während Sie vergleichen.", share: "Teilbaren Link kopieren", copied: "Link kopiert" },
  uk: { title: "Збережені об'єкти", intro: "Особиста добірка зберігається на цьому пристрої. Обліковий запис не потрібен.", sharedIntro: "Спільна добірка містить лише публічні оголошення.", emptyTitle: "Ваша добірка чекатиме тут.", emptyText: "Натисніть на сердечко біля об'єкта, щоб зберегти його для порівняння.", share: "Скопіювати посилання", copied: "Посилання скопійовано" },
  ru: { title: "Сохранённые объекты", intro: "Личная подборка хранится на этом устройстве. Аккаунт не нужен.", sharedIntro: "Общая подборка содержит только публичные объявления.", emptyTitle: "Ваша подборка будет ждать здесь.", emptyText: "Нажмите на сердце у объекта, чтобы сохранить его для сравнения.", share: "Скопировать ссылку", copied: "Ссылка скопирована" },
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  return { title: content[locale].title, description: content[locale].intro, robots: { index: false, follow: true } };
}

type SavedPageProps = { searchParams: Promise<{ properties?: string }> };

export default async function SavedPage({ searchParams }: SavedPageProps) {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const pageCopy = content[locale];
  const [properties, authState] = await Promise.all([getPublicProperties(), getAdminAuthState()]);
  const requestedSlugs = (await searchParams).properties?.split(",").map((slug) => slug.trim()).filter(Boolean).slice(0, 20) ?? [];
  const validSlugs = new Set(properties.map((property) => property.slug));
  const sharedSlugs = requestedSlugs.filter((slug) => validSlugs.has(slug));
  const adminLocale = resolveAdminLocale(locale);

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <PublicHeader adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined} compact currentLocale={locale} languageLabel={copy.languageLabel} nav={copy.nav} />
      <header className="saved-page-header"><p className="eyebrow">{pageCopy.title}</p><h1>{pageCopy.title}</h1><p>{sharedSlugs.length ? pageCopy.sharedIntro : pageCopy.intro}</p></header>
      <SavedProperties copiedLabel={pageCopy.copied} copy={copy} emptyText={pageCopy.emptyText} emptyTitle={pageCopy.emptyTitle} locale={locale} properties={localizeProperties(properties, locale)} shareLabel={pageCopy.share} sharedSlugs={sharedSlugs} />
      <SiteFooter copy={copy} locale={locale} />
    </main>
  );
}
