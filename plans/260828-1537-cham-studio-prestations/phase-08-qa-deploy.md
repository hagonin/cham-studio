---
title: "Phase 8: QA & Deploy"
status: todo
---

# Phase 8: QA & Deploy

## Context
Parent: [plan.md](./plan.md). Depends on all prior phases.

## Overview
Date 2026-08-28 · P1 · 5h. Gates before traffic. The buyer for this page is a
French business that may well open PageSpeed on the person they are about to
hire — performance is part of the pitch, not an afterthought.

## Key Insights
- The prototype's a11y defects (contrast 2.71:1, 11.2px type, sub-24px nav
  targets) were invisible by eye and obvious to a script. Automate the checks
  that catch this class of bug.
- Firefox is the compatibility risk, not Safari: scroll-driven CSS is still
  flagged there. Test it explicitly rather than assuming graceful degradation.

## Requirements
- [ ] axe-core in CI on both locales: zero critical/serious
- [ ] Lighthouse CI budget: perf ≥95 mobile, a11y 100, CLS < 0.02
- [ ] Manual matrix: Chrome, Safari, Firefox × desktop, 375px
- [ ] Reduced-motion pass
- [ ] Keyboard-only pass across the whole page
- [ ] Grep gates: no personal phone/email, no placeholder SIRET, `--seal` once
- [ ] Build gate: zero `ph-label` placeholders in production output (F4)
- [ ] `sitemap.xml` + `robots.txt` covering both locales

## Architecture
GitHub Actions: `pnpm verify` (lint, tsc, unit) → build → Playwright + axe →
Lighthouse CI. Vercel preview per PR; production on `main`.

## Related code files
`.github/workflows/ci.yml`, `tests/a11y.spec.ts`, `lighthouserc.json`.

## Implementation Steps
1. Playwright + `@axe-core/playwright` over `/fr/prestations`, `/en/...`, legal pages.
2. Lighthouse CI with the budget above.
3. Grep gate script for the three forbidden-string classes.
4. Manual browser matrix, Firefox first.
5. Sitemap/robots; verify `hreflang` reciprocity with a crawler.
6. Ship; verify DNS, HTTPS, and that `contact@` receives.

## Todo
- [ ] axe in CI, both locales
- [ ] Lighthouse budget enforced
- [ ] grep gates
- [ ] browser matrix incl. Firefox
- [ ] keyboard-only pass
- [ ] sitemap + robots + hreflang crawl
- [ ] production deploy verified

## Success Criteria
CI green on all gates. Manual matrix shows no break. `contact@cham-studio.fr`
receives a test message sent from outside.

## Risk Assessment
- **Lighthouse budget fails on the fonts.** Three families is a deliberate,
  confirmed choice (F8 rejected — the dedicated condensed cut beats a variable
  width axis). So the fix is not fewer families: subset aggressively, self-host,
  `font-display: swap`, preload only the display face used above the fold, and
  claw the budget back elsewhere (images, JS) before touching typography.
- **CI a11y passes but real screen-reader UX is poor.** axe catches maybe half.
  Budget one manual VoiceOver pass.

## Security Considerations
Verify no source maps expose local paths; confirm `.env` never committed;
security headers (CSP, HSTS) via `next.config` before launch.

## Next steps
Post-launch: `/à-propos`, `/réalisations` case studies, FAQ, "what I don't take".
