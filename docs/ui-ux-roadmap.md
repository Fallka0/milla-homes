# Milla Homes UI/UX Roadmap

This roadmap prioritizes improvements by business value, user value, technical dependency, and implementation risk. Each phase should be shipped and measured before the next large feature begins.

## Phase 1 — Owner acquisition funnel

Goal: create a second lead source by helping owners enquire about selling or renting their property.

### Step 1: Foundation

- [x] Define the owner journey: sell, long-term rent, or holiday rent.
- [x] Reuse the existing inquiry API and admin inquiry list.
- [x] Avoid promising valuation, legal, rental-management, or marketing services that have not been confirmed.
- [ ] Confirm Milla Homes’ actual owner services, fees, service area, and response time.

### Step 2: Public page

- [x] Add `/sell-or-rent` with localized metadata and copy.
- [x] Explain the process in four concise stages.
- [x] Add trust-building content and a clear professional-advice boundary.
- [x] Add the page to the public header, footer, and sitemap.

### Step 3: Valuation enquiry form

- [x] Capture intent, location, property type, bedrooms, approximate price, timing, contact details, and notes.
- [x] Submit structured details through the existing inquiry endpoint.
- [x] Include spam protection, loading, success, and error states.
- [x] Provide phone and WhatsApp fallbacks.
- [ ] Verify keyboard navigation and mobile form layout.

### Step 4: Operational follow-through

- [ ] Add an inquiry source/type field to the database so owner leads can be filtered.
- [ ] Add an owner-lead badge and structured property details to the admin dashboard.
- [ ] Define response ownership and an internal follow-up checklist.
- [ ] Measure page views, form starts, successful submissions, and WhatsApp clicks.

### Step 5: Media uploads — only after storage policy is agreed

- [ ] Define accepted formats, size limits, retention, access control, and deletion policy.
- [ ] Add optional image/document uploads to Supabase Storage.
- [ ] Add consent copy and a privacy notice before collecting owner media.
- [ ] Show uploaded media safely in the admin dashboard.

## Phase 2 — Persistent mobile contact

Goal: make the highest-intent actions reachable without covering content.

1. [x] Add a bottom mobile bar with Call, WhatsApp, and Enquire actions.
2. [x] Hide it near the footer and while forms are focused.
3. [x] Respect safe-area insets and avoid blocking browser controls.
4. Track calls and WhatsApp clicks.
5. Test on narrow iPhone and Android viewports.

## Phase 3 — Saved properties and shareable shortlist

Goal: help visitors return to and discuss a smaller group of homes.

1. [x] Add a save control to property cards and detail pages.
2. [x] Store anonymous saves locally before requiring an account.
3. [x] Add a `/saved` page with empty and unavailable-property states.
4. Create a shareable shortlist URL with opaque identifiers.
5. Add expiry and privacy rules for shared lists.

## Phase 4 — Property comparison

Goal: make tradeoffs between two or three homes easier to understand.

1. Allow up to three properties in a comparison tray.
2. Compare price, area, property type, bedrooms, bathrooms, size, features, and availability.
3. Highlight differences without declaring a universal “winner.”
4. Add mobile horizontal scrolling and accessible table semantics.
5. Link comparison selections into an enquiry.

## Phase 5 — Search recovery and discovery

Goal: prevent filtered searches from becoming dead ends.

1. Improve empty states with nearby regions and relaxed-filter suggestions.
2. Add recently viewed properties stored locally.
3. Preserve listing filters when returning from a property detail page.
4. Add relevant nearby properties to detail pages.
5. Review search analytics to identify missing inventory and confusing filters.

## Phase 6 — Viewing scheduler

Goal: collect usable viewing preferences without pretending to offer real-time availability.

1. Ask for preferred dates, time windows, remote/in-person preference, and flexibility.
2. Present requests as preferences, not confirmed appointments.
3. Add timezone-aware confirmation copy.
4. Store viewing requests distinctly in the admin dashboard.
5. Add calendar integration only when staff workflow is defined.

## Phase 7 — Buying cost calculator

Goal: turn the buying guide into a practical planning tool.

1. Ask for resale/new-build, price, region, mortgage use, and buyer circumstances.
2. Source rates from official guidance and show a last-reviewed date.
3. Display ranges and assumptions rather than false precision.
4. Include legal and tax disclaimers.
5. Link the estimate into a property enquiry without storing financial data unnecessarily.

## Phase 8 — Owner dashboard

Goal: give active owners a transparent view of their listing and enquiries.

1. Confirm authentication, roles, and access-control requirements.
2. Show listing status, media, viewing requests, and enquiry summaries.
3. Add owner-requested edits with an approval workflow.
4. Add activity history and notification preferences.
5. Complete a security and privacy review before launch.

## Phase 9 — Trust, compliance, and business identity

Goal: support higher lead volume responsibly.

1. Add verified business email, address, opening hours, and social profiles.
2. Add privacy and cookie pages reviewed for the actual data flow.
3. Document retention and deletion rules for inquiries and uploads.
4. Add consent where required; avoid decorative cookie banners that do nothing.
5. Review accessibility, metadata, structured data, and broken links each release.

## Release checklist for every phase

- [ ] English, Spanish, German, and Russian copy complete.
- [ ] Desktop, tablet, and mobile layout verified.
- [ ] Keyboard and screen-reader basics verified.
- [ ] Empty, loading, success, and error states covered.
- [ ] Metadata and sitemap updated where relevant.
- [ ] ESLint, TypeScript, and production build checks pass.
- [ ] Existing user changes and unrelated files remain untouched.
