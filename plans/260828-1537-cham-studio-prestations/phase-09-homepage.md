---
title: "Phase 9: Homepage"
status: todo
---

# Phase 9: Homepage

## Context
Parent: [plan.md](./plan.md). Added after the validation interview. Depends on
Phases 2-4 (tokens, i18n, page components). Execution order: 5th.

## Overview
Date 2026-08-28 · P1 · 6h. The original plan built `/prestations` and declared
`app/[locale]/page.tsx` in its architecture without any phase owning it — a
site whose root is empty cannot launch. This phase closes that gap.

## Key Insights
- The homepage does **not** repeat the services page. It answers three things
  in one screen: what you build, for whom, and what it costs to start.
- Everything reusable already exists after Phase 4: status bar, hero pattern,
  the cut primitive, service summary cards, contact block. This phase is
  composition, not new invention.
- Root redirect is `.htaccess`, not middleware — static export has none.

## Requirements
- [ ] `/fr` and `/en` render a real homepage, not a redirect
- [ ] Value proposition above the fold, no image, LCP is text
- [ ] Three services in summary, each linking to its anchor in `/prestations`
- [ ] One primary CTA repeated (same as the services page)
- [ ] Availability + reply-time status bar shared with `/prestations`
- [ ] `.htaccess` sends `/` → `/fr`

## Architecture
Reuses `StatusBar`, `Hero`, `ContactBlock` from Phase 4. New: `ServiceSummary`
(condensed three-card grid) and `Approach` (the three-layer overlap, reduced).
Copy lives in the same typed dictionaries as everything else.

## Related code files
`app/[locale]/page.tsx`, `components/ServiceSummary.tsx`, `.htaccess`,
`lib/i18n/dictionaries/*`.

## Implementation Steps
1. Page composition from existing components.
2. Write homepage copy in both dictionaries (FR first, EN adapted).
3. `ServiceSummary`: three cards, price floor read from `BASE` so it cannot
   drift from the services page or the estimator.
4. `.htaccess` root redirect; verify no loop and that `/en` is reachable.
5. Metadata: title, description, OpenGraph, `hreflang` pair.

## Todo
- [ ] page.tsx composed from existing components
- [ ] FR homepage copy
- [ ] EN homepage copy (proofread before go-live, per F2)
- [ ] ServiceSummary reading floors from BASE
- [ ] `.htaccess` root redirect verified
- [ ] metadata + OpenGraph + hreflang

## Success Criteria
`cham-studio.fr` serves a real homepage in both locales. Price floors shown here
match `/prestations` and the estimator, because all three read `BASE`.

## Risk Assessment
- **Homepage duplicates the services page** and dilutes both. Mitigate: the
  homepage summarises and links; it never restates the included/excluded lists.
- **Copy debt**: two more pages of bilingual text. Mitigate: keep it short —
  a homepage that says less converts better than one that repeats.

## Security Considerations
None beyond the rest of the site. No forms, no user input.

## Next steps
Phase 6 (media), then 7-9.
