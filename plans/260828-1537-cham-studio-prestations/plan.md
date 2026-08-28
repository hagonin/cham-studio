---
title: "Chạm Studio — bilingual services page"
description: "Greenfield Next.js build of cham-studio.fr /prestations: monochrome design system, FR/EN routing, scroll recadrage, pricing estimator, FR legal pages."
status: pending
priority: P1
effort: "48-62h"
branch: main
tags: [nextjs, i18n, design-system, accessibility, freelance-site]
created: 2026-08-28
---

# Chạm Studio — bilingual services page

## Overview

Greenfield. Repo is empty. Build `cham-studio.fr` starting with the page that
carries revenue: `/[locale]/prestations`. Validated prototype exists as an
Artifact (monochrome warm-neutral, Archivo Narrow + JetBrains Mono, single
`clip-path` motion primitive, seal-red dấu nặng as the only colour, estimator).
This plan ports it to production and adds what a prototype cannot hold:
real routing, real i18n, real images, real legal pages, real tests.

Brand: **Chạm** (Vietnamese, "to touch" / "to carve"). Domain `cham-studio.fr`
at OVH. Operator: auto-entrepreneur in France, invoices EUR, franchise en base
de TVA. Primary market FR, secondary EN. No Vietnamese on the site except the
brand name.

## Goals

| # | Goal | Priority |
|---|------|----------|
| 1 | `/fr/prestations` + `/en/prestations` live, server-rendered, correct `hreflang` | P1 |
| 2 | Design tokens with machine-verified WCAG AA contrast | P1 |
| 3 | Estimator pricing as a pure, unit-tested function | P1 |
| 4 | FR legal pages present before any traffic | P1 |
| 5 | Lighthouse ≥95 / CLS ~0 / axe zero critical | P1 |
| 6 | Scroll recadrage that degrades cleanly on Firefox | P2 |
| 7 | Real project + portrait imagery replacing placeholders | P2 |

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Setup & Foundations](./phase-01-start.md) | Pending | 4h |
| 2 | [Design System & Tokens](./phase-02-design-system-tokens.md) | Pending | 5h |
| 3 | [i18n Routing & Content](./phase-03-i18n-routing-content.md) | Pending | 7h |
| 4 | [Prestations Page](./phase-04-prestations-page.md) | Pending | 8h |
| 5 | [Homepage](./phase-09-homepage.md) | Pending | 6h |
| 6 | [Media & Scroll Recadrage](./phase-05-media-scroll-recadrage.md) | Pending | 5h |
| 7 | [Estimator & Pricing](./phase-06-estimator-pricing.md) | Pending | 5h |
| 8 | [Legal & Compliance FR](./phase-07-legal-compliance-fr.md) | Pending | 6h |
| 9 | [QA & Deploy](./phase-08-qa-deploy.md) | Pending | 7h |

File numbers are stable identifiers; the `#` column is execution order. Phase 09
(Homepage) was added after the validation interview and runs after Phase 4.

## Dependencies

- Phase 3 blocks 4 (content dictionaries feed the page).
- Phase 6 is independent of 4-5; can run in parallel.
- Phase 7 needs SIRET + a decision on published address (domiciliation).
- Phase 5 needs assets from the user; placeholders unblock everything else.

## Decisions already settled

| Decision | Value | Why |
|---|---|---|
| Languages | FR default, EN secondary | Primary market France; brand explained in EN too |
| Currency | EUR only | Auto-entrepreneur invoices EUR; USD adds FX + accounting cost |
| Palette | Warm monochrome + one seal red | Reference-adjacent but not its cool grey; single colour is the brand mark |
| Slugs | Same slug in both locales | 6-page site; a route map would add drift risk for no SEO gain (F7) |
| Contact | `mailto:` link, no backend | No form service = no RGPD sub-processor to declare, no server to secure (F5) |
| CI | Full: axe + grep gates + Lighthouse | Performance is part of the pitch; it must not regress silently (F10) |
| Hosting | **OVH, static export** (`output: 'export'`) | One French supplier, one invoice. No server logic on this site, so a managed Node runtime would be pure overhead |
| Domain | `cham-studio.fr` — **purchased at OVH** | Confirmed by user 2026-08-28 |
| Analytics | **Google Analytics 4** | Chosen for completeness. Cost: a CNIL-compliant consent banner becomes mandatory, and GA must not fire before consent |
| Case studies | Real projects only | The three in the prototype were invented for the mockup. They do not ship |
| Motion | One primitive: `clip-path` cut | Cursor/magnetic/tilt/parallax were rejected as portfolio defaults |
| Fonts | Archivo Narrow / Archivo / JetBrains Mono — **three, confirmed** | Verified vietnamese subset; dedicated condensed beats a variable width axis (F8 rejected) |
| CSS | Plain CSS + tokens, no framework | Token system is small and unusual; Tailwind adds noise, not leverage |
| Contact address | `contact@cham-studio.fr` only | No personal phone or personal email published |
| Location shown | Montpellier, France | Display surfaces only; legal page needs the full postal address |
| Found imagery | Never | Work cards make specific outcome claims; a non-owned image under them misrepresents. Real visuals or no section (F4) |

## Assumptions to revisit

Not settled. Recorded here so nobody mistakes a green test for a validated price.

| Assumption | Basis | Review trigger |
|---|---|---|
| Price coefficients (BASE, FEAT, DES) | Benchmark of **two** French freelance sites | After the first 3 real quotes (F1) |
| −12% / +18% asymmetric range | Commercial judgement, room to negotiate up | Same trigger |
| Duration coefficients | Aligned to the service cards, not to measured delivery | After the first completed project |

Public pages carry a **"tarifs indicatifs 2026"** line so prices can move without
looking inconsistent to a prospect who returns later.

## Critical path

1. **Published-address decision — PARTIALLY RESOLVED.** City confirmed:
   **Montpellier, France**, used on all display surfaces (status bar, contact
   block). Still open: the **full postal address** required on `mentions
   légales` (LCEN asks for the operator's address, not just the city). Home
   address vs domiciliation service remains the decision, still owned by user,
   still blocks Phase 7 and therefore launch. (F3)
2. Real project visuals — at least 2 of 3, else the work section ships removed. (F4)

## Success Criteria

- [ ] Both locales server-render with correct `<html lang>` and reciprocal `hreflang` + `x-default`
- [ ] Contrast test passes for every token pair used on text (AA 4.5:1) and UI border (3:1)
- [ ] Pricing function passes property test across all 2304 configuration combinations
- [ ] axe-core: zero critical/serious on both locales
- [ ] Lighthouse mobile ≥95 perf, 100 a11y; CLS < 0.02
- [ ] Firefox (no scroll-driven CSS): page renders static, no visual break
- [ ] No personal phone/email in the built output (grep gate in CI)
- [ ] EN copy proofread by a second reader before the EN locale goes live (F2)
- [ ] Work section ships only with ≥2 of 3 real project visuals (F4)

## Open Questions

1. Full postal address for `mentions légales` — home or domiciliation? City is
   settled (Montpellier); the street address is not. Critical path, Phase 1.
2. Do real project screenshots exist? Gate defined in Phase 5/8: ≥2 of 3 or the
   section is removed from the launch build.
3. ~~Localised slugs?~~ Resolved: same slug both locales.
4. Who proofreads the EN copy — paid review or a second reader?
5. Which OVH hosting offer? Static export runs on the cheapest shared plan.
6. Which three real projects replace the invented case studies, and do measured
   results exist for them?

## Red Team Review

### Session — 2026-08-28
**Findings:** 12 · after user review: 7 applied (3 modified), 5 rejected · 0 Critical, 5 High, 7 Medium
**Method note:** repo empty → lenses applied to plan artifacts, not code. See
`reports/debate-2026-08-28.md` for the stated deviation.

| # | Finding | Severity | Disposition | Applies to |
|---|---------|----------|-------------|------------|
| 1 | Pricing coefficients = sample of two, filed as "settled" | High | Accept (modified: + public notice) | Phase 6 + this file |
| 2 | EN copy unreviewed, treated as production-ready | High | Accept | Phase 3 |
| 3 | Launch blocked on unassigned address decision | High | Accept | Phase 1 / 7 |
| 4 | "Launch" undefined when assets never arrive | High | Accept (modified: ≥2 of 3) | Phase 5 / 8 |
| 5 | No spam/rate-limit commitment on sole contact channel | High | Accept (modified: `mailto:`, no backend) | Phase 6 / 7 |
| 6 | Repo not a git repo; frontmatter claims `branch: main` | Medium | Accept | Phase 1 |
| 7 | Localised slugs = unneeded complexity at this size | Medium | Accept | Phase 3 |
| 8 | Three font families decided too late to change cheaply | Medium | **Reject** — three confirmed | — |
| 9 | Effort optimistic, Phase 3 especially | Medium | **Reject** — F7 removed the cause | — |
| 10 | Full CI stack heavier than it returns | Medium | **Reject** — full CI kept | — |
| 11 | Estimator built before any traffic | Medium | Reject | — |
| 12 | Scroll recadrage ignores non-supporting 16% | Medium | Reject | — |
