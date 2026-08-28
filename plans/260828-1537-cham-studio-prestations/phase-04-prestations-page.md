---
title: "Phase 4: Prestations Page"
status: todo
---

# Phase 4: Prestations Page

## Context
Parent: [plan.md](./plan.md). Depends on Phases 2 and 3.

## Overview
Date 2026-08-28 · P1 · 8h. The revenue page. Port the validated prototype
structure: status bar → hero → situations → services accordion → work cards →
three-layer overlap → estimator → contact.

## Key Insights
- The accordion is the conversion surface. Prototype decision stands: one click
  opens everything, three layers stagger in. Hiding "not included" behind extra
  clicks costs more than it gains.
- Services are named by the client's problem, not by technology. That framing
  is the differentiator versus the two reference sites reviewed.
- Situations block routes a visitor straight to the matching service — keep the
  link, it is the page's only real navigation.
- Uppercase for labels and short headings only. French accented capitals in
  running text hurt legibility.

## Requirements
- [ ] Server components by default; client only for accordion + estimator
- [ ] Accordion: real `<button aria-expanded>` + `aria-controls`, keyboard operable
- [ ] `grid-template-rows: 0fr → 1fr` for height (no JS measurement)
- [ ] Heading order h1→h2→h3, no skips
- [ ] Uppercase confined to labels; assert no `text-transform:uppercase` on `<p>`
- [ ] Status bar: availability, reply time, live Montpellier clock (derive the
      UTC offset, do not hardcode GMT+1 — it is GMT+2 half the year)
- [ ] **Replace the three invented case studies** with real projects supplied by
      the user. No result figure ships unless it was actually measured.

## Architecture
`components/` : `StatusBar`, `Hero`, `Situations`, `ServiceList`,
`ServiceItem` (client), `WorkCards`, `OverlapDiagram`, `Estimator` (client),
`ContactBlock`. Section data comes from the dictionary, not hardcoded JSX.

## Related code files
`app/[locale]/prestations/page.tsx`, `components/*`, `lib/i18n/dictionaries/*`.

## Implementation Steps
1. Page shell + section order, all copy from dictionary.
2. `ServiceItem` accordion with a11y attributes and the cut hover inversion.
3. Situations → service anchor + open-on-arrival.
4. Overlap diagram: three multiply-blended discs, buttons with `aria-label`.
5. Clock via `Intl.DateTimeFormat` `Europe/Paris`, hydration-safe
   (render placeholder on server, fill on mount).

## Todo
- [ ] page shell from dictionary
- [ ] accordion + a11y + hover inversion
- [ ] situations → service linking
- [ ] overlap diagram keyboard-operable
- [ ] hydration-safe clock
- [ ] heading-order + uppercase assertions

## Success Criteria
Keyboard alone can open every service and operate the diagram. axe clean.
No hydration mismatch warning in console.

## Risk Assessment
- **Clock causes hydration mismatch** (server time ≠ client time). Mitigate:
  render nothing server-side, populate in `useEffect`.
- **Accordion animation on `grid-template-rows`** is unsupported in very old
  browsers → content still visible, just unanimated. Acceptable.

## Security Considerations
None — no user input on this page except the estimator (Phase 6).

## Next steps
Phases 5 and 6 in parallel.
