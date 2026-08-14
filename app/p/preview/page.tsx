import { notFound } from "next/navigation";

import { buildOgImageUrl } from "@/lib/share-images";
import { buildShareOgDescription, buildShareOgTitle } from "@/lib/share-metadata";
import {
  getShareProperties,
  getSharePropertyPath,
  shareLocales,
  type ShareLocale,
  type ShareProperty,
} from "@/lib/share-property";
import { getPublicSiteUrl } from "@/lib/site-urls";

// A local mock-up of the WhatsApp link card, so the exact title, description and
// image can be eyeballed before a link goes to a real buyer. Development only —
// this is the one page that lists every property, and it must never be public.
//
// It renders from the same helpers that generateMetadata uses, so what is shown
// here is what goes into the tags. For proof from the served HTML rather than
// from the source, run `npm run check:previews`.
export const dynamic = "force-dynamic";

function PreviewCard({ locale, property }: { locale: ShareLocale; property: ShareProperty }) {
  const url = getPublicSiteUrl(getSharePropertyPath(property.slug, locale));

  return (
    <article className="preview-card">
      <p className="preview-card-locale">{locale.toUpperCase()}</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- mirroring the raw og:image */}
      <img alt="" className="preview-card-image" src={buildOgImageUrl(property.ogImage ?? property.images[0])} />
      <div className="preview-card-body">
        <p className="preview-card-title">{buildShareOgTitle(property, locale)}</p>
        <p className="preview-card-description">{buildShareOgDescription(property, locale)}</p>
        <p className="preview-card-host">{new URL(url).host}</p>
      </div>
      <a className="preview-card-link" href={getSharePropertyPath(property.slug, locale)}>
        {getSharePropertyPath(property.slug, locale)}
      </a>
    </article>
  );
}

export default function SharePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const properties = getShareProperties();

  return (
    <main className="preview-page">
      <header className="preview-header">
        <h1>Link preview check</h1>
        <p>
          How each shareable page will appear as a WhatsApp or Telegram card. Development only. Run{" "}
          <code>npm run check:previews</code> to verify the tags and image size from the served HTML.
        </p>
      </header>

      {properties.map((property) => (
        <section className="preview-property" key={property.slug}>
          <h2>
            {property.reference} · {property.slug}
          </h2>
          <div className="preview-grid">
            {shareLocales.map((locale) => (
              <PreviewCard key={locale} locale={locale} property={property} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
