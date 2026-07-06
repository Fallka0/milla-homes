import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { adminCopy, adminLocales, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminAuthState } from "@/lib/auth";
import { getAdminSiteUrl, getPublicSiteUrl } from "@/lib/site-urls";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [authState, cookieStore] = await Promise.all([getAdminAuthState(), cookies()]);
  const locale = resolveAdminLocale(cookieStore.get("verdant-locale")?.value);
  const copy = adminCopy[locale];

  if (authState.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (authState.status === "unauthorized") {
    redirect("/admin/login?reason=unauthorized");
  }

  if (authState.status === "missing-config") {
    return (
      <main className="admin-shell" lang={locale}>
        <div className="setup-card">
          <h1>{copy.layout.missingConfigTitle}</h1>
          <p>{copy.layout.missingConfigBody}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell" lang={locale}>
      <header className="admin-topbar">
        <div className="admin-brand-block">
          <BrandLogo />
          <p className="eyebrow">{copy.layout.adminLabel}</p>
          <h1>{copy.layout.title}</h1>
        </div>

        <div className="admin-topbar-actions">
          <nav className="primary-nav" aria-label={copy.layout.adminLabel}>
            <Link href={getAdminSiteUrl("/admin")}>{copy.layout.dashboard}</Link>
            <Link href={getAdminSiteUrl("/admin/properties/new")}>{copy.layout.newListing}</Link>
            <Link href={getAdminSiteUrl("/admin/window-sheets")}>Fichas escaparate</Link>
            <Link href={getAdminSiteUrl("/admin/facturas")}>Facturas</Link>
            <Link href={getPublicSiteUrl("/properties")}>{copy.layout.viewSite}</Link>
          </nav>
          <LanguageSwitcher currentLocale={locale} label={copy.languageLabel} locales={adminLocales} />
          <SignOutButton label={copy.layout.signOut} />
        </div>
      </header>

      {children}
    </main>
  );
}
