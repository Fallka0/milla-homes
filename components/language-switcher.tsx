"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { publicLocales, type PublicLocale } from "@/lib/public-copy";

type LanguageSwitcherProps = {
  currentLocale: PublicLocale;
  label: string;
  locales?: PublicLocale[];
};

const shortLabels: Record<PublicLocale, string> = {
  en: "EN",
  es: "ES",
  uk: "UA",
  de: "DE",
  ru: "RU",
};

const nativeNames: Record<PublicLocale, string> = {
  en: "English",
  es: "Español",
  uk: "Українська",
  de: "Deutsch",
  ru: "Русский",
};

export function LanguageSwitcher({
  currentLocale,
  label,
  locales = [...publicLocales],
}: LanguageSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`language-switcher ${isOpen ? "is-open" : ""}`} ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={label}
        className="language-trigger"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="language-globe"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a13.5 13.5 0 0 1 3.5 9 13.5 13.5 0 0 1-3.5 9 13.5 13.5 0 0 1-3.5-9A13.5 13.5 0 0 1 12 3Z" />
        </svg>
        <span>{shortLabels[currentLocale]}</span>
        <span aria-hidden="true" className="language-chevron">
          ▾
        </span>
      </button>

      {isOpen ? (
        <div aria-label={label} className="language-menu" role="menu">
          {locales.map((locale) => (
            <button
              key={locale}
              aria-checked={locale === currentLocale}
              className={`language-option ${locale === currentLocale ? "active" : ""}`}
              onClick={() => {
                document.cookie = `verdant-locale=${locale}; path=/; max-age=31536000; samesite=lax`;
                setIsOpen(false);
                router.refresh();
              }}
              role="menuitemradio"
              type="button"
            >
              <span className="language-option-name">{nativeNames[locale]}</span>
              <span className="language-option-code">{shortLabels[locale]}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
