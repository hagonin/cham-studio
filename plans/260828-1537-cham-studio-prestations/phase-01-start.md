---
title: "Phase 1: Setup & Foundations"
status: todo
---

# Phase 1: Setup & Foundations

## Context

Parent: [plan.md](./plan.md). No dependencies. Repo currently empty
(`ls` → nothing). Everything below is greenfield.

## Overview

Date 2026-08-28 · Priority P1 · Effort 4h · Impl status: not started.
Stand up Next.js, fonts, tooling, and the deploy target so later phases have
somewhere to land.

## Key Insights

- Empty repo means no existing conventions to honour — set them here, once.
- Fonts are a hard constraint, not a preference: the brand name `Chạm` needs
  a Vietnamese subset. Verified available: Archivo Narrow, Archivo,
  JetBrains Mono. Verified **unavailable**: Sofia Sans Condensed,
  Spline Sans Mono, Instrument Serif — do not substitute these in.
- Domain `cham-studio.fr` free at check time; `cham.fr` taken since 1999.

## Requirements

- [ ] Next.js (App Router) + TypeScript strict
- [ ] `next/font` self-hosting the three families (confirmed at three — F8 rejected), `latin` + `latin-ext` + `vietnamese` subsets
- [ ] ESLint + Prettier + `tsc --noEmit` in CI
- [ ] OVH hosting configured; `next.config` → `output: 'export'`
- [ ] Domain `cham-studio.fr` (already purchased at OVH) pointed at the hosting
- [ ] `contact@cham-studio.fr` mailbox live

## Architecture

```
app/
  [locale]/
    layout.tsx        # sets <html lang>, loads fonts
    page.tsx
    prestations/page.tsx
  globals.css         # tokens only
lib/
  i18n/               # dictionaries + locale helpers
  pricing/            # pure estimator
components/
```

No CSS framework. Tokens in `globals.css`, component styles as CSS Modules.

## Related code files

None yet — this phase creates them.

## Implementation Steps

0. `git init`, `.gitignore` (incl. `.env*`), first commit, remote. The plan
   frontmatter claims `branch: main`; make that true before anything else. (F6)
0b. **Published address — city settled, street address not.** Display surfaces
   show "Montpellier, France". `mentions légales` needs a full postal address:
   decide home vs domiciliation service. Non-code, longest lead time, and
   Phase 7 (which blocks launch) cannot close without it. Owner: user. (F3)
1. `pnpm create next-app` — App Router, TS, no Tailwind, ESLint yes.
2. Configure `next/font/google` for the three families. Verify `Chạm` renders
   with the dấu nặng at 9rem in Chrome, Safari, Firefox.
3. Add `tsconfig` strict, Prettier, and a `pnpm verify` script
   (`lint && tsc --noEmit && test`).
4. OVH hosting + DNS for `cham-studio.fr` (already owned). Set
   `output: 'export'` in `next.config`. Consequences to carry through the whole
   build: **no middleware, no SSR, no ISR**, and `next/image` needs
   `unoptimized: true` plus build-time optimisation. Root redirect `/` → `/fr`
   becomes an `.htaccess` rule.
5. Enable OVH mailbox or forwarder for `contact@`.

## Todo

- [ ] `git init` + .gitignore + first commit + remote
- [ ] **Full postal address decided** (home vs domiciliation) — critical path
      (city already settled: Montpellier, France)
- [ ] Scaffold Next.js app
- [ ] Wire three font families with vietnamese subset
- [ ] Visual check: dấu nặng renders in all 3 browsers at display size
- [ ] Lint/format/typecheck script
- [ ] OVH hosting + DNS + `.htaccess` root redirect
- [ ] `contact@cham-studio.fr` sends and receives

## Success Criteria

`pnpm verify` green. `https://cham-studio.fr` serves the app over HTTPS.
`Chạm` renders correctly at 9rem in Chrome, Safari and Firefox.

## Risk Assessment

- **Font fallback silently drops the diacritic.** Mitigate: explicit subset
  config plus a manual visual check, not just "it looks fine".
- **DNS propagation** can take hours; do it early, not on launch day.

## Security Considerations

No secrets in this phase. Ensure `.env*` is gitignored from commit one.

## Next steps

Phase 2 — tokens.
