import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { adminCopy, adminLocales, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminBookingCopy } from "@/lib/booking-copy";
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
        <div className="admin-topbar-bar">
          <div className="admin-brand-block">
            <BrandLogo />
            <div className="admin-brand-text">
              <p className="eyebrow">{copy.layout.adminLabel}</p>
              <h1>{copy.layout.title}</h1>
            </div>
          </div>

          <div className="admin-topbar-utility">
            <LanguageSwitcher currentLocale={locale} label={copy.languageLabel} locales={adminLocales} />
            <SignOutButton label={copy.layout.signOut} />
          </div>
        </div>

        <AdminNav
          ariaLabel={copy.layout.adminLabel}
          items={[
            { href: getAdminSiteUrl("/admin"), label: copy.layout.dashboard },
            { href: getAdminSiteUrl("/admin/properties/new"), label: copy.layout.newListing },
            { href: getAdminSiteUrl("/admin/bookings"), label: getAdminBookingCopy(locale).navLabel },
            { href: getAdminSiteUrl("/admin/window-sheets"), label: "Fichas escaparate" },
            { href: getAdminSiteUrl("/admin/facturas"), label: "Facturas" },
            { external: true, href: getPublicSiteUrl("/properties"), label: copy.layout.viewSite },
          ]}
        />
      </header>

      {children}
    </main>
  );
}
