import Link from "next/link";

import { getPhoneHref, getWhatsAppHref, motherPhoneDisplay } from "@/lib/contact";
import { type PublicCopy, type PublicLocale } from "@/lib/public-copy";

type SiteFooterProps = {
  copy: PublicCopy;
  locale: PublicLocale;
};

type FooterContent = {
  areas: string;
  company: string;
  contact: string;
  directLine: string;
  explore: string;
  guide: string;
  response: string;
  saved: string;
  whatsapp: string;
};

const footerContent: Record<PublicLocale, FooterContent> = {
  en: { areas: "Area guides", company: "Milla Homes", contact: "Contact", directLine: "Direct line", explore: "Property", guide: "Buying guide", response: "Calls and WhatsApp are the quickest way to reach us.", saved: "Saved properties", whatsapp: "Start a WhatsApp chat" },
  es: { areas: "Guías de zonas", company: "Milla Homes", contact: "Contacto", directLine: "Línea directa", explore: "Propiedades", guide: "Guía de compra", response: "La forma más rápida de contactar es por teléfono o WhatsApp.", saved: "Propiedades guardadas", whatsapp: "Abrir WhatsApp" },
  de: { areas: "Gebietsführer", company: "Milla Homes", contact: "Kontakt", directLine: "Direkte Rufnummer", explore: "Immobilien", guide: "Kaufratgeber", response: "Am schnellsten erreichen Sie uns telefonisch oder über WhatsApp.", saved: "Gespeicherte Immobilien", whatsapp: "WhatsApp-Chat starten" },
  ru: { areas: "Гиды по районам", company: "Milla Homes", contact: "Контакты", directLine: "Прямой номер", explore: "Недвижимость", guide: "Гид покупателя", response: "Быстрее всего связаться с нами по телефону или WhatsApp.", saved: "Сохранённые объекты", whatsapp: "Написать в WhatsApp" },
};

export function SiteFooter({ copy, locale }: SiteFooterProps) {
  const content = footerContent[locale];

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <Link className="footer-wordmark" href="/">Milla Homes</Link>
          <p>{copy.footer.blurb}</p>
          <span className="footer-location">Torrevieja · Costa Blanca</span>
        </div>

        <nav className="site-footer-column" aria-label={content.explore}>
          <h2>{content.explore}</h2>
          <Link href="/properties">{copy.footer.browseLabel}</Link>
          <Link href="/sell-or-rent">{copy.nav.owner}</Link>
          <Link href="/saved">{content.saved}</Link>
          <Link href="/guides/buying">{content.guide}</Link>
        </nav>

        <nav className="site-footer-column" aria-label={content.areas}>
          <h2>{content.areas}</h2>
          <Link href="/regions/torrevieja">Torrevieja</Link>
          <Link href="/regions/la-mata">La Mata</Link>
          <Link href="/regions/orihuela-costa">Orihuela Costa</Link>
          <Link href="/regions/guardamar-del-segura">Guardamar</Link>
        </nav>

        <nav className="site-footer-column" aria-label={content.company}>
          <h2>{content.company}</h2>
          <Link href="/about">{copy.nav.about}</Link>
          <Link href="/contact">{copy.nav.contact}</Link>
          <Link href="/guides/buying">{copy.nav.guide}</Link>
        </nav>

        <div className="site-footer-column site-footer-contact">
          <h2>{content.contact}</h2>
          <span>{content.directLine}</span>
          <Link className="footer-phone" href={getPhoneHref()}>{motherPhoneDisplay}</Link>
          <Link className="footer-whatsapp" href={getWhatsAppHref(copy.contact.whatsappMessage)} rel="noreferrer" target="_blank">{content.whatsapp} <span aria-hidden>↗</span></Link>
          <p>{content.response}</p>
        </div>
      </div>

      <div className="site-footer-meta">
        <span>{copy.footer.copyright} · {new Date().getFullYear()}</span>
        <span>Homes along the Costa Blanca</span>
      </div>
    </footer>
  );
}
