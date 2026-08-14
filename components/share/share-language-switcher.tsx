import { shareCopy } from "@/lib/share-copy";
import { getSharePropertyPath, shareLocales, type ShareLocale } from "@/lib/share-property";

type ShareLanguageSwitcherProps = {
  currentLocale: ShareLocale;
  slug: string;
};

// Plain anchors, not <Link>. Each language is a separate document with its own
// `lang` attribute and canonical URL; a client-side navigation would swap the
// content while leaving <html lang> pointing at the previous language.
export function ShareLanguageSwitcher({ currentLocale, slug }: ShareLanguageSwitcherProps) {
  return (
    <nav aria-label={shareCopy[currentLocale].languageLabel} className="share-languages">
      {shareLocales.map((locale) => {
        const isCurrent = locale === currentLocale;

        return (
          <a
            aria-current={isCurrent ? "true" : undefined}
            aria-label={shareCopy[locale].languageName}
            className={`share-language${isCurrent ? " is-active" : ""}`}
            href={getSharePropertyPath(slug, locale)}
            hrefLang={locale}
            key={locale}
            lang={locale}
            title={shareCopy[locale].languageName}
          >
            {shareCopy[locale].languageCode}
          </a>
        );
      })}
    </nav>
  );
}
