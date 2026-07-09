# Milla Homes → Multi-Tenant Real-Estate SaaS — Platform Plan

> Status: **Exploring** (no platform code started yet). This doc captures the direction so we
> can pick it up later without re-deriving everything.
> Last updated: 2026-07-09.

## 1. Vision
Turn the Milla Homes site (built for Nick's mother's agency) into a productized offering:
sell branded real-estate **websites + built-in CRM** to real-estate agencies, run them all
from one platform, and give Nick (the developer) a central dashboard to see analytics across
every client site.

## 2. Decisions locked (2026-07-09)
- **Architecture:** Shared **multi-tenant SaaS** — one codebase, one database, `tenant_id`
  on every row, Postgres RLS for isolation, per-tenant branding + custom domains.
- **Go-to-market:** **Done-for-you** — Nick builds and onboards each agency (high touch,
  higher price per client). Self-serve sign-up is a *later* possibility, not now.
- **Scale ambition:** **Just exploring** — a few bespoke agencies to validate the idea.
  Implication: build the *thin* multi-tenant MVP, defer heavy SaaS infra (self-serve billing,
  automated provisioning) until there are paying clients.
- **Milla Homes becomes tenant #1** of the multi-tenant schema, with zero visible change for
  Nick's mother during the refactor.

## 3. What we already have (the moat — reusable as-is)
The current app is essentially a complete real-estate product. Reusable across tenants:
- Public site: listings, property detail (with map, mortgage calculator, similar properties,
  share/save), regions, guides, contact, sell-or-rent (owner leads).
- Admin: property CRUD, bookings/tours calendar, inquiry mini-CRM (new/contacted/closed),
  window-sheets (fichas escaparate), facturas (invoices).
- **Inmovilla import pipeline** (`inmovilla*.patch`, `lib/property-import.ts`) — ingest from
  the Spanish portal software agencies already use. This is a genuine competitive differentiator
  for the Spanish market; most template shops can't do it.
- i18n (EN/ES/RU/DE public, EN/ES/RU admin), Supabase (Postgres/Auth/Storage), Vercel hosting,
  Vercel Analytics + Speed Insights, transactional email (nodemailer/SMTP).

Productizing is mostly **wrapping** work, not rebuilding the product.

## 4. Target architecture (Model B — shared multi-tenant)
- Single Next.js app deployed once on Vercel.
- `tenants` table is the root of everything.
- Incoming hostname → tenant resolution in middleware (`proxy.ts` / middleware).
- Per-tenant branding, copy, contact details, locales, domains stored as tenant config.
- Postgres **RLS** policies keyed by tenant + membership for hard data isolation.
- Use **Vercel for Platforms** for per-agency custom domains (built exactly for this).

## 5. Single-tenant assumptions to unwind (concrete, file-level)
These are the places the current code assumes exactly one agency:
- **Auth:** global `ADMIN_EMAILS` env allowlist (`lib/auth.ts`) → replace with per-tenant
  **memberships** (users belong to an agency, with roles: owner/agent).
- **Branding hardcoded/env:** "Milla Homes" strings, phone/WhatsApp in `lib/contact.ts`,
  base URLs in `lib/site-urls.ts`, colors/copy in `app/globals.css` + copy files → move to
  per-tenant config (DB row + a config resolver).
- **Data tables:** `properties`, `inquiries`, `bookings`, window-sheets, facturas → add
  `tenant_id` FK + RLS policies. Every query scoped by tenant.
- **Storage:** Supabase storage → per-tenant folders/prefixes (or buckets).
- **Domains:** one site URL today → custom domain per agency.
- **Emails:** single SMTP + `INQUIRY_EMAIL_TO` → per-tenant inbox/reply-to (and ideally
  per-tenant sending identity).
- **SEO:** sitemap/robots/canonical assume one host → generate per tenant host.

## 6. Data model changes (sketch)
- `tenants` (id, slug, name, status, plan, created_at).
- `tenant_domains` (tenant_id, hostname, is_primary, verified).
- `tenant_config` (tenant_id, branding json: logo, colors, contact, locales, copy overrides).
- `memberships` (tenant_id, user_id, role).
- Add `tenant_id` to: `properties`, `inquiries`, `bookings`, window-sheets, facturas.
- RLS: every tenant table filtered by `tenant_id` ∈ current user's memberships; service-role
  path (server actions) sets tenant context explicitly.

## 7. Developer analytics app (for Nick)
Two layers — do both:
1. **Own your event data.** Don't rely only on Vercel Analytics (per-project, hard to
   aggregate across clients via API). Log lightweight events into a central table keyed by
   tenant: page view, inquiry created, tour requested, booking confirmed, etc. Then Nick owns
   cross-client reporting AND can resell each agency *their* numbers as a feature.
2. **Super-admin dashboard.** A protected route group in the same app (or a small separate
   Next app on the same Supabase) showing per-agency traffic, leads, conversion, plan/billing,
   and health. Trivial under Model B (all data co-located); would be painful under a
   template-per-client model (N databases).

## 8. Business / ops layer (mostly deferred while "exploring")
- **Billing:** Stripe subscriptions (setup fee + monthly), plan tiers, feature gating. Defer
  until first paying client; done-for-you can invoice manually at first.
- **Provisioning:** flow to create a tenant, seed content, connect a domain, invite the
  agency admin. Manual/scripted at first; automate later.
- **Legal/compliance:** Nick becomes a **data processor** for agencies' client PII → GDPR
  data-processing agreements, cookie consent, terms. Matters in the EU/Spain.
- **Support & updates:** SLA expectations once people pay.

## 9. Phased roadmap
1. **Multi-tenant foundation** — `tenants` + `tenant_id` + RLS + tenant config + hostname
   resolution. Migrate Milla Homes to tenant #1 with no visible change.
2. **Central event logging + super-admin analytics dashboard.**
3. **Tenant provisioning + custom domains** (Vercel for Platforms).
4. **Stripe billing + plan gating** (when there's demand).
5. **Onboarding polish** — sign a new agency in an afternoon.
6. (Optional, later) **Self-serve sign-up.**

## 10. Open questions to revisit before building
- Per-tenant Supabase project vs shared DB with RLS? (Plan assumes shared + RLS; revisit if
  a client demands hard DB-level isolation.)
- Theming depth: shared design with config (colors/logo/copy) vs bespoke per-client templates?
- Email deliverability per tenant (shared sender vs per-agency domain auth).
- Pricing model: one-off build + monthly CRM/hosting? Setup fee size?
- How much of facturas/window-sheets is Spain-specific vs generalizable to other markets?

## 11. Tech notes
- **Vercel for Platforms** handles multi-tenant custom domains + wildcard subdomains.
- **Supabase RLS** is the isolation backbone — get policies right before onboarding real
  agencies (multiple agencies' client PII in one DB).
- Middleware/`proxy.ts` is the natural place for hostname→tenant resolution.
- Keep Milla Homes fully working throughout — it's the reference tenant and a live client.
