// Self-hosted fonts: the FacturaSheet uses the literal families "Cormorant
// Garamond" and "Mulish". Google Fonts is blocked by the site CSP
// (font-src 'self' data:), so register them locally via @fontsource.
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/600.css";
import "@fontsource/mulish/700.css";
import "@fontsource/mulish/800.css";
import "@/components/facturas/facturas.css";

import { requireAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function FacturasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Same admin gate the rest of /admin uses (Supabase Auth + ADMIN_EMAILS).
  await requireAdminUser();

  return <>{children}</>;
}
