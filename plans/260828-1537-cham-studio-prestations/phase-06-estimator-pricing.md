---
title: "Phase 6: Estimator & Pricing"
status: todo
---

# Phase 6: Estimator & Pricing

## Context
Parent: [plan.md](./plan.md). Depends on Phases 2-3. Parallel with 4-5.

## Overview
Date 2026-08-28 · P1 · 5h. Four inputs → price range + duration. This is the
page's strongest differentiator: the two reference sites either publish a flat
"from X €" or three budget buttons. A working estimator also demonstrates the
product-building skill being sold.

## Key Insights
- The prototype shipped two real defects, both caught by arithmetic rather than
  by looking: (a) the low end fell **below** the advertised floor
  (1 100 € shown under a "from 1 200 €" card); (b) duration inflated to
  "15 à 20 semaines" against a card promising "6 à 10". Both fixed; the fix
  must be locked by tests, because the failure mode is silent.
- Verified: all 2304 combinations now produce lo ≥ floor, hi > lo, w2 > w1,
  max duration 19 weeks.
- Range is deliberately asymmetric (−12% / +18%) to leave room when quoting.
  Commercial decision, not a bug — documented so nobody "fixes" it.
- **The coefficients are an assumption, not a validated price.** They come from a
  benchmark of two sites. The 2304-combination test proves internal consistency
  only. See `plan.md` → Assumptions to revisit. Public pages carry a
  "tarifs indicatifs 2026" line so prices can move later. (F1)

## Requirements
- [ ] Pricing as a pure function in `lib/pricing/`, zero DOM knowledge
- [ ] Exhaustive test over all 2304 combinations asserting the invariants
- [ ] Estimator output consistent with every service card on the same page
- [ ] `aria-live="polite"` on the result
- [ ] Real `<fieldset>/<legend>`, real `<label for>`, 44px touch targets
- [ ] Result copy states clearly: estimate, not a quote

## Architecture
```ts
// lib/pricing/model.ts
export const BASE = { vitrine:1200, metier:5000, boutique:6000, ia:2000 }
export function estimate(cfg: Config): { lo:number; hi:number; w1:number; w2:number }
```
Card floors derive from `BASE` — one source of truth, so a price change cannot
desynchronise the cards from the estimator.

## Related code files
`lib/pricing/model.ts`, `lib/pricing/model.test.ts`, `components/Estimator.tsx`.

## Implementation Steps
1. Port the corrected coefficient tables.
2. `estimate()` pure; clamp `lo` to `BASE[type]`; `w2 = max(w1+1, round(wk*1.25))`.
3. Exhaustive test: 4 types × 3 scales × 3 design levels × 64 feature subsets.
   Assert lo ≥ floor, hi > lo, w2 > w1, and duration ≤ a sane ceiling.
4. Service cards read their displayed floor from `BASE`.
5. Estimator UI; on submit, open a **`mailto:` with the configuration in the body**.
   Decided: no form service, therefore no backend to secure and no RGPD
   sub-processor to declare in the privacy page. (F5)
6. Obfuscate the address in markup (assemble in JS from parts) — the trade-off
   accepted with `mailto:` is harvesting, and this is the cheap mitigation.
7. Add the "tarifs indicatifs 2026" notice beside the estimator output. (F1)

## Todo
- [ ] pricing model + types
- [ ] 2304-combination invariant test
- [ ] cards derive floors from BASE
- [ ] accessible form controls
- [ ] `mailto:` handoff carrying the configuration
- [ ] address obfuscated in markup
- [ ] "tarifs indicatifs 2026" notice

## Success Criteria
Test suite green. No configuration displays a price below its card's advertised
floor. Changing a `BASE` value updates card and estimator together.

## Risk Assessment
- **Prices treated as a quote by a client.** Mitigate: explicit disclaimer in
  both languages, and the range never collapses to a single number.
- **Coefficients edited without running tests.** Mitigate: test is part of
  `pnpm verify`, which gates CI.

## Security Considerations
`mailto:` means no server, no stored prospect data, no sub-processor — the most
private option available and the reason it was chosen over a form. Accepted
trade-off: the address gets harvested; mitigated by markup obfuscation and
mailbox-side filtering. Revisit only if spam volume actually costs a lead.

## Next steps
Phase 8.
