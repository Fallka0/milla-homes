import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { cookies } from "next/headers";

import { publicCopy, resolvePublicLocale } from "@/lib/public-copy";
import { publicSiteUrl } from "@/lib/site-urls";
import { MobileContactBar } from "@/components/mobile-contact-bar";

import "./globals.css";

// DM Sans as the base body font — applied directly as className so it's
// baked into the SSR HTML, no CSS variable race on first paint.
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Cormorant Garamond for headings — exposed as a CSS variable so heading
// rules in globals.css can reference it via var(--font-display).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
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
    // cormorant.variable puts --font-display on <html> for heading CSS rules
    // dmSans.className applies DM Sans directly — no variable indirection needed
    <html lang={locale} className={cormorant.variable}>
      <body className={dmSans.className}>
        {children}
        <MobileContactBar callLabel={copy.buttons.callNow} contactLabel={copy.nav.contact} whatsappLabel={copy.buttons.whatsapp} whatsappMessage={copy.contact.whatsappMessage} />
      </body>
    </html>
  );
}
