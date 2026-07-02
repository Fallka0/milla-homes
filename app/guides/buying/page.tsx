import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { publicCopy, resolvePublicLocale, type PublicLocale } from "@/lib/public-copy";
import { getPublicSiteUrl } from "@/lib/site-urls";

export const dynamic = "force-dynamic";

type GuideContent = {
  title: string;
  intro: string;
  steps: Array<{ title: string; body: string }>;
  costs: { title: string; intro: string; items: string[] };
  faq: Array<{ q: string; a: string }>;
};

const guideContent: Partial<Record<PublicLocale, GuideContent>> & { en: GuideContent } = {
  en: {
    title: "Buying property in Spain — a simple guide",
    intro:
      "Buying on the Costa Blanca is straightforward once you know the steps. Here is the process we guide our clients through, from first viewing to picking up the keys.",
    steps: [
      { title: "1. Get your NIE", body: "The NIE is your Spanish foreigner's tax number, required for any purchase. We can point you to the fastest way to obtain it, in person or through a lawyer with power of attorney." },
      { title: "2. Open a Spanish bank account", body: "You'll need a local account to pay utilities, taxes and the property itself. It's a quick process with your passport and NIE." },
      { title: "3. Appoint an independent lawyer", body: "An independent Spanish lawyer checks the property is debt-free, correctly registered and legally sound, and handles due diligence on your behalf." },
      { title: "4. Reserve the property", body: "A reservation contract and small deposit (typically €3,000–€6,000) takes the property off the market while checks are completed." },
      { title: "5. Sign the private purchase contract", body: "Usually within 2–4 weeks you sign the private contract and pay around 10% of the price. Completion date and terms are agreed here." },
      { title: "6. Complete at the notary", body: "On completion you sign the title deed (escritura) before a notary, pay the balance, and receive the keys. The deed is then registered in your name." },
    ],
    costs: {
      title: "Costs to budget for",
      intro: "On top of the purchase price, allow roughly 11–13% for taxes and fees:",
      items: [
        "Transfer tax (ITP) on resale homes — 10% in the Valencia region",
        "VAT (IVA) 10% + stamp duty on new-build homes",
        "Notary and land registry fees",
        "Independent lawyer's fee (typically ~1% + VAT)",
        "Optional mortgage set-up costs if financing",
      ],
    },
    faq: [
      { q: "Can non-residents buy property in Spain?", a: "Yes. There are no restrictions on non-residents (including non-EU buyers) purchasing property in Spain. You'll need an NIE number to complete." },
      { q: "How long does the process take?", a: "From reservation to completion it's usually 4–8 weeks for a resale property, depending on checks and whether a mortgage is involved." },
      { q: "Do I need to be in Spain to buy?", a: "Not necessarily. Much of the process can be handled by an independent lawyer acting under power of attorney if you can't be present." },
      { q: "What extra costs should I expect?", a: "Budget around 11–13% of the purchase price for taxes, notary, registry and legal fees." },
    ],
  },
  es: {
    title: "Comprar una vivienda en España — guía sencilla",
    intro:
      "Comprar en la Costa Blanca es sencillo cuando conoces los pasos. Este es el proceso que acompañamos con nuestros clientes, desde la primera visita hasta la entrega de llaves.",
    steps: [
      { title: "1. Obtén tu NIE", body: "El NIE es tu número de identificación de extranjero, imprescindible para comprar. Te indicamos la vía más rápida para conseguirlo, en persona o mediante un abogado con poder notarial." },
      { title: "2. Abre una cuenta bancaria española", body: "Necesitarás una cuenta local para pagar suministros, impuestos y la propia vivienda. Es un trámite rápido con pasaporte y NIE." },
      { title: "3. Contrata un abogado independiente", body: "Un abogado independiente comprueba que la vivienda está libre de cargas, correctamente registrada y en orden legal, gestionando toda la diligencia por ti." },
      { title: "4. Reserva la vivienda", body: "Un contrato de reserva y una pequeña señal (normalmente 3.000–6.000 €) retiran la vivienda del mercado mientras se completan las comprobaciones." },
      { title: "5. Firma el contrato de arras", body: "Normalmente en 2–4 semanas se firma el contrato privado y se paga en torno al 10% del precio, fijando fecha y condiciones." },
      { title: "6. Firma ante notario", body: "En la firma otorgas la escritura ante notario, pagas el resto y recibes las llaves. Después se inscribe a tu nombre en el registro." },
    ],
    costs: {
      title: "Costes a prever",
      intro: "Además del precio de compra, calcula aproximadamente un 11–13% en impuestos y gastos:",
      items: [
        "Impuesto de transmisiones (ITP) en segunda mano — 10% en la Comunidad Valenciana",
        "IVA 10% + AJD en obra nueva",
        "Gastos de notaría y registro de la propiedad",
        "Honorarios del abogado independiente (normalmente ~1% + IVA)",
        "Gastos de constitución de hipoteca si financias",
      ],
    },
    faq: [
      { q: "¿Pueden comprar los no residentes en España?", a: "Sí. No hay restricciones para no residentes (incluidos compradores de fuera de la UE). Solo necesitas el NIE para firmar." },
      { q: "¿Cuánto tarda el proceso?", a: "De la reserva a la firma suelen ser 4–8 semanas en segunda mano, según las comprobaciones y si hay hipoteca." },
      { q: "¿Debo estar en España para comprar?", a: "No necesariamente. Gran parte del proceso puede gestionarlo un abogado con poder notarial si no puedes estar presente." },
      { q: "¿Qué gastos adicionales debo prever?", a: "Calcula alrededor del 11–13% del precio para impuestos, notaría, registro y honorarios legales." },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const content = guideContent[locale] ?? guideContent.en;

  return {
    title: content.title,
    description: content.intro,
    alternates: { canonical: "/guides/buying" },
    openGraph: { title: `${content.title} · Milla Homes`, description: content.intro, url: "/guides/buying", type: "article" },
  };
}

export default async function BuyingGuidePage() {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];
  const adminLocale = resolveAdminLocale(locale);
  const authState = await getAdminAuthState();
  const content = guideContent[locale] ?? guideContent.en;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
    url: getPublicSiteUrl("/guides/buying"),
  };

  return (
    <main className="site-shell section-stack" data-locale={locale} lang={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PublicHeader
        adminLabel={authState.status === "authorized" ? adminCopy[adminLocale].layout.adminLabel : undefined}
        compact
        currentLocale={locale}
        languageLabel={copy.languageLabel}
        nav={copy.nav}
      />

      <section className="properties-intro-minimal">
        <h1>{content.title}</h1>
      </section>

      <section className="guide-steps">
        {content.steps.map((step) => (
          <article className="guide-step" key={step.title}>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section className="guide-costs">
        <h2>{content.costs.title}</h2>
        <p>{content.costs.intro}</p>
        <ul>
          {content.costs.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="guide-faq">
        <h2>FAQ</h2>
        {content.faq.map((item) => (
          <details className="guide-faq-item" key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="section-heading with-action guide-cta">
        <div>
          <p className="eyebrow">{copy.coverage.eyebrow}</p>
          <h2>{copy.contact.panelTitle}</h2>
        </div>
        <Link className="button button-secondary" href="/properties">
          {copy.buttons.browseProperties}
        </Link>
      </section>

      <SiteFooter copy={copy} />
    </main>
  );
}
