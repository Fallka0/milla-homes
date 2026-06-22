// Self-hosted fonts: the WindowSheet uses the literal families "Cormorant
// Garamond" and "Mulish". Google Fonts is blocked by the site CSP
// (font-src 'self' data:), so register them locally via @fontsource.
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/500.css";
import "@fontsource/mulish/600.css";
import "@fontsource/mulish/700.css";
import "@fontsource/mulish/800.css";
import "@/components/window-sheets/window-sheets.css";

import { requireAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function WindowSheetsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Same admin gate the rest of /admin uses (Supabase Auth + ADMIN_EMAILS).
  await requireAdminUser();

  return <>{children}</>;
}
