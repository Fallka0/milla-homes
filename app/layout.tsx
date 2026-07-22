import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";
import { publicSiteUrl } from "@/lib/site-urls";
import { MobileContactFab } from "@/components/mobile-contact-fab";
import { RevealController } from "@/components/reveal-controller";

import "./globals.css";

// Hanken Grotesk is the base UI + body font — a clean modern grotesque in the
// spirit of huspy's type. Applied directly as className so it's baked into the
// SSR HTML (no variable race on first paint) and also exposed as --font-sans so
// heading rules in globals.css can reference it.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

// Cormorant Garamond is reserved for the big brand-moment headlines (hero,
// region/company/owner heroes) — exposed as --font-serif. Everything else uses
// the grotesque, matching huspy's "serif for the hero, sans for the UI" system.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  title: {
    default: "Milla Homes · Property for sale & rent in Torrevieja and the Costa Blanca",
    template: "%s · Milla Homes",
  },
  description:
    "Milla Homes is a boutique estate agency for Torrevieja and the Costa Blanca — homes for sale and rent with calm guidance, clear presentation, and concierge-level care.",
  applicationName: "Milla Homes",
  keywords: [
    "Torrevieja property",
    "Costa Blanca real estate",
    "homes for sale Torrevieja",
    "apartments for rent Costa Blanca",
    "Orihuela Costa property",
    "La Zenia apartments",
    "Guardamar property",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Milla Homes",
    url: publicSiteUrl,
    title: "Milla Homes · Property for sale & rent in Torrevieja and the Costa Blanca",
    description:
      "Boutique estate agency for Torrevieja and the Costa Blanca — homes for sale and rent with calm guidance and clear presentation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milla Homes · Torrevieja & Costa Blanca property",
    description: "Homes for sale and rent on the Costa Blanca, presented with calm, clear guidance.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = resolvePublicLocale(cookieStore.get("verdant-locale")?.value);
  const copy = publicCopy[locale];

  return (
    // --font-serif (Cormorant) + --font-sans (Hanken Grotesk) are exposed on
    // <html>; Hanken's className also applies it as the baked-in base font.
    <html lang={locale} className={`${cormorant.variable} ${hankenGrotesk.variable}`}>
      <body className={hankenGrotesk.className}>
        {children}
        <RevealController />
        <MobileContactFab callLabel={copy.buttons.callNow} whatsappLabel={copy.buttons.whatsapp} whatsappMessage={copy.contact.whatsappMessage} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
