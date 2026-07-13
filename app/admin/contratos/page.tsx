import { cookies } from "next/headers";
import Link from "next/link";

import { ContratosTool, type ContratoToolLocale } from "@/components/contratos/contratos-tool";
import { resolveAdminLocale } from "@/lib/admin-copy";

export const dynamic = "force-dynamic";

const PAGE_COPY: Record<ContratoToolLocale, { eyebrow: string; title: string; body: string; back: string }> = {
  es: {
    eyebrow: "Milla Homes · Herramienta interna",
    title: "Contratos",
    body: "Alquiler de temporada, alquiler de vivienda, reserva o arras: elige el tipo, rellena las partes y los importes, y exporta un PDF A4 listo para firmar. Puedes añadir versiones en inglés, ruso o alemán.",
    back: "← Volver al panel",
  },
  en: {
    eyebrow: "Milla Homes · Internal tool",
    title: "Contracts",
    body: "Seasonal rental, residential rental, reservation or arras: pick the type, fill in the parties and amounts, and export a print-ready A4 PDF. You can add English, Russian or German versions.",
    back: "← Back to dashboard",
  },
  ru: {
    eyebrow: "Milla Homes · Внутренний инструмент",
    title: "Договоры",
    body: "Сезонная аренда, долгосрочная аренда, резервирование или задаток: выберите тип, заполните стороны и суммы и экспортируйте готовый PDF формата A4. Можно добавить версии на английском, русском или немецком.",
    back: "← Назад в панель",
  },
};

export default async function ContratosPage() {
  const cookieStore = await cookies();
  const adminLocale = resolveAdminLocale(cookieStore.get("verdant-locale")?.value);
  // The admin switcher offers en/es/ru; anything else falls back to Spanish.
  const locale: ContratoToolLocale =
    adminLocale === "ru" ? "ru" : adminLocale === "en" ? "en" : "es";
  const copy = PAGE_COPY[locale];

  return (
    <div className="fac-page" lang={locale}>
      <header className="fac-header">
        <div>
          <p className="fac-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.body}</p>
        </div>
        <Link className="fac-back" href="/admin">
          {copy.back}
        </Link>
      </header>

      <ContratosTool locale={locale} />
    </div>
  );
}
