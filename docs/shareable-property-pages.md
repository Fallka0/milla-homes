# Shareable property pages (`/p/[slug]`)

One link an agent can paste into WhatsApp instead of a wall of text and forwarded
photos. The link lives on the millahomes domain so the buyer recognises the
agency before they tap.

These pages are deliberately separate from the Supabase-backed catalogue under
`/properties`: no database, no CMS, no admin screen. Everything is a hand-edited
JSON file in the repo.

## URLs

| URL | Language |
| --- | --- |
| `/p/villa-marina-cabo-roig` | English (canonical, `x-default`) |
| `/p/villa-marina-cabo-roig/es` | Spanish |
| `/p/villa-marina-cabo-roig/ru` | Russian |
| `/p/villa-marina-cabo-roig/de` | German |

`/p/<slug>/en` permanently redirects to the short URL, so each page has exactly
one address per language. All four are declared as `hreflang` alternates of one
another and listed in `sitemap.xml`.

Send the buyer the link in their own language — the page does not guess.

## Editing a property

Everything lives in [`data/share-properties.json`](../data/share-properties.json).
The shape is defined and documented in
[`lib/share-property.ts`](../lib/share-property.ts) (`ShareProperty`), so a typo
in a field name fails `npm run build` rather than reaching a buyer.

```jsonc
{
  "slug": "villa-marina-cabo-roig",   // the URL; never change it once shared
  "reference": "MH-2041",             // shown on the page, prefilled into WhatsApp
  "priceEuro": 795000,                // a number, no separators or symbol
  "images": [                         // main image first — it is the preview card
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  ],
  // "ogImage": "https://…"           // optional: use when the main photo does
                                      // not survive a 1200x630 landscape crop
  "facts": {
    "bedrooms": 4,
    "bathrooms": 3,
    "builtSqm": 245,
    "plotSqm": 640,                   // null for apartments
    "pool": "private",                // "private" | "communal" | "none"
    "beachDistanceMeters": 450        // rendered as "450 m" or "1,2 km"
  },
  "agent": {
    "name": "Milla Fernández",
    "photoUrl": "/agents/milla-fernandez.svg",  // null renders initials instead
    "phone": "+34652679443"           // drives the WhatsApp link
  },
  "content": {                        // all four languages, hand-written
    "es": { "title": "…", "town": "…", "shortDescription": "…" },
    "en": { … }, "ru": { … }, "de": { … }
  },
  "updatedAt": "2026-07-20"           // sitemap lastModified
}
```

There is no machine translation anywhere in this path. If a language is missing
from `content`, TypeScript will not compile.

### Shared copy

- **"How rent-to-own works"** — [`lib/rent-to-own.ts`](../lib/rent-to-own.ts).
  One source file, identical on all ten pages. Edit once, every page changes.
- **Interface labels** (key-fact names, buttons, WhatsApp message) —
  [`lib/share-copy.ts`](../lib/share-copy.ts).

### Photos

The current JSON points at Unsplash placeholders. Replace them with real photos —
either Supabase Storage URLs (the same bucket the admin panel uploads to) or any
https URL.

Store the **largest** version you have. Sized variants are derived at render time
by [`lib/share-images.ts`](../lib/share-images.ts), which rewrites the URL to use
the host's own resize API (Unsplash `?w=`, Supabase `/render/image/`). This is
why `next.config.ts` can keep `images.unoptimized` and still serve responsive
images: the photo host does the resizing, not Vercel's image optimizer.

Agent photos go in `public/agents/`. The two files there now are monogram
placeholders — drop in a real square headshot and point `photoUrl` at it.

## Verifying the link preview before you send it

This is the part that decides whether the feature works, so check it rather than
assume it.

### 1. Automated check

```bash
npm run build && npm start          # or: npm run dev
npm run check:previews              # against localhost:3000
```

Against production:

```bash
npm run check:previews -- --base=https://milla-homes.com
npm run check:previews -- --base=https://milla-homes.com --slug=villa-marina-cabo-roig
```

It fetches each page the way a scraper does — plain HTTP, no JavaScript — and
checks that:

- `og:title`, `og:description`, `og:image`, `og:url`, `og:type` and the four
  `twitter:*` tags are present **in the served HTML**;
- `og:image` is an absolute `https://` URL that really loads;
- the image is exactly **1200x630** and **under 300KB** (WhatsApp silently drops
  images above roughly that size — the card degrades to a bare link);
- `<html lang>` matches the language of the page;
- all four `hreflang` alternates plus `x-default` are present.

It prints the card contents it found and exits non-zero on any failure, so it can
gate a deploy.

### 2. Visual check

With the dev server running, open **http://localhost:3000/p/preview**. It renders
every property in every language as a WhatsApp-style card, built from the same
helpers `generateMetadata` uses. This page returns 404 in production.

### 3. Real client check

Before sending to an actual buyer, paste the link into your own "Message
yourself" chat in WhatsApp, and into Telegram's Saved Messages.

Both cache previews per URL, so if you paste a link, then fix the photo, the old
card sticks around. To force a refresh, append a throwaway query string
(`?v=2`) — it does not change what the page renders.

## Performance notes

The target is LCP under 2 s for a buyer on 4G.

- The pages render from an in-memory array — no database call on the request path.
- `next.config.ts` sets `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`
  on `/p/*`, so the CDN serves them from the edge.
- The first photo is `fetchpriority="high"`, `loading="eager"`; the rest are lazy.
- The gallery is a CSS scroll-snap strip, not a carousel library. Swiping is the
  browser's own momentum scrolling, and no JavaScript is needed to see or reach
  any photo.
- The collapsible section is a native `<details>` — no JavaScript either.
- The gallery `<img>` has a fixed `aspect-ratio`, so the layout never shifts while
  the photo loads.

The only client-side JavaScript on the page is the gallery counter/arrows and the
copy-reference button; neither is on the LCP path.

### Why these render per request rather than at build time

`<html lang>` is emitted by the root layout, which sits above the `[lang]`
segment and cannot see it. `proxy.ts` resolves the locale from the path and
forwards it on a request header, which means the render has to happen per
request. The CDN cache above makes that equivalent to a static file for real
visitors, and the Open Graph tags are server-rendered either way — which is what
scrapers actually depend on.

## Deliberately out of scope

No login, no dashboard, no analytics, no cookie banner, no search or filtering,
no public listing index, no Inmovilla integration, no multi-agency support.
