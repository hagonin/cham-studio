---
title: "Phase 3: i18n Routing & Content"
status: todo
---

# Phase 3: i18n Routing & Content

## Context
Parent: [plan.md](./plan.md). Depends on Phase 1. **Blocks Phase 4.**

## Overview
Date 2026-08-28 · P1 · 7h. Real locale routing. The prototype used a
client-side `data-en` swap — adequate to demo, wrong for production: Google
indexes one language, and pre-JS screen readers read the wrong `lang`.

## Key Insights
- FR is the default locale and `x-default`. EN is **adapted, not translated**:
  the FR copy leans on French market vocabulary (`devis`, `mentions légales`,
  `TVA non applicable`) that has no meaning to a non-FR buyer.
- 132 strings already drafted in both languages in the prototype — reuse, do
  not re-translate.
- **Slugs are identical in both locales** (`/fr/prestations`, `/en/prestations`).
  A localised slug map was considered and rejected: six pages, two locales, and
  the map is a drift risk that breaks the hreflang cluster for no SEO gain. (F7)
- The 132 EN strings drafted in the prototype are a **first draft, not copy**.
  They ship only after a second reader. (F2)

## Requirements
- [ ] `app/[locale]/` with `generateStaticParams` for `fr` | `en`
- [ ] `<html lang>` rendered server-side
- [ ] Reciprocal `hreflang` + `x-default` via `generateMetadata` / `alternates`
- [ ] Typed dictionaries; missing key = build error, not silent fallback
- [ ] Locale-aware `Intl.NumberFormat` (`1 200 €` fr / `1,200 €` en)
- [ ] Language switcher preserves the current route, does not bounce to home
- [ ] No IP-based auto-redirect (SEO + UX); at most a dismissible hint

## Architecture
```
lib/i18n/
  config.ts        # locales, defaultLocale (no route map — same slugs)
  dictionaries/fr.ts  en.ts     # typed, same shape enforced by TS
  getDictionary.ts
```
Dictionary shape typed off `fr.ts`; `en.ts` declared `satisfies Dictionary` so a
missing key fails `tsc`.

## Related code files
`app/[locale]/layout.tsx`, `middleware.ts`, `lib/i18n/*`, `components/LangSwitch.tsx`.

## Implementation Steps
1. `config.ts`: locales, default `fr`. Same slug in both locales.
2. Dictionaries from the prototype's FR/EN pairs.
3. `layout.tsx` sets `lang`, loads fonts, renders `alternates.languages`.
4. Root redirect `/` → `/fr` via `.htaccess` — static export has no middleware.
   No geo sniffing. Verify the rule cannot loop.
5. `LangSwitch`: `<Link>` to the mirrored route of the current page.
6. Number/date formatting helper bound to locale.

## Todo
- [ ] locale config (same slugs both locales)
- [ ] fr.ts / en.ts typed dictionaries
- [ ] server-rendered lang + hreflang + x-default
- [ ] `.htaccess` root redirect (no middleware in static export)
- [ ] route-preserving switcher
- [ ] locale-aware number format
- [ ] **EN copy proofread by a second reader** — blocks EN go-live

## Success Criteria
View-source on both locales shows correct `lang` and reciprocal `hreflang`.
Deleting a key from `en.ts` fails the build. Switching language on
`/fr/prestations` lands on the EN equivalent of that page, not home.

## Risk Assessment
- **Non-reciprocal hreflang** → Google ignores the whole cluster. Mitigate:
  generate both sides from one route map; assert in a test.
- **Unreviewed EN ships.** Mitigate: proofreading is a checklist item gating the
  EN locale, not a nice-to-have.

## Security Considerations
Locale param must be validated against the allow-list before use in any path —
untrusted segment otherwise reaches the filesystem/dictionary lookup.

## Next steps
Phase 4.
