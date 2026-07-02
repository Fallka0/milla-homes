"use client";

import Link from "next/link";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { type PublicLocale } from "@/lib/public-copy";
import { getAdminSiteUrl } from "@/lib/site-urls";

type PublicHeaderProps = {
  adminLabel?: string;
  compact?: boolean;
  currentLocale: PublicLocale;
  languageLabel: string;
  nav: {
    home: string;
    properties: string;
    guide: string;
  };
};

export function PublicHeader({
  adminLabel,
  compact = false,
  currentLocale,
  languageLabel,
  nav,
}: PublicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuLabel = isMenuOpen ? "Close navigation menu" : "Open navigation menu";

  return (
    <header className={`public-header ${compact ? "compact-header" : ""}`}>
      <Link className="brand-link" href="/">
        <BrandLogo priority={compact} />
      </Link>

      <button
        className={`mobile-menu-toggle ${isMenuOpen ? "is-open" : ""}`}
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="public-navigation"
        aria-label={menuLabel}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`header-actions ${isMenuOpen ? "menu-open" : ""}`} id="public-navigation">
        <nav className="primary-nav" aria-label="Primary">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            {nav.home}
          </Link>
          <Link href="/properties" onClick={() => setIsMenuOpen(false)}>
            {nav.properties}
          </Link>
          <Link href="/guides/buying" onClick={() => setIsMenuOpen(false)}>
            {nav.guide}
          </Link>
          {adminLabel ? (
            <Link href={getAdminSiteUrl("/admin")} onClick={() => setIsMenuOpen(false)}>
              {adminLabel}
            </Link>
          ) : null}
        </nav>
        <LanguageSwitcher currentLocale={currentLocale} label={languageLabel} />
      </div>
    </header>
  );
}
