---
title: "Phase 2: Design System & Tokens"
status: todo
---

# Phase 2: Design System & Tokens

## Context

Parent: [plan.md](./plan.md). Depends on Phase 1. Blocks Phases 4-6.

## Overview

Date 2026-08-28 · Priority P1 · Effort 5h.
Port the prototype's token set, but with contrast enforced by a test rather
than by eye. The prototype shipped a real AA failure (`--mute` at 2.71:1)
that only surfaced when measured — the test exists to stop that recurring.

## Key Insights

- Measured values (prototype v6, verified): ink/paper 17.03:1,
  ink-2/paper 8.44:1, mute/paper 5.61:1, rule-s/paper 3.29:1, seal/paper 4.13:1.
- `--rule` (1.43:1) is retained **only** for decorative separators. Interactive
  component borders use `--rule-s`. This distinction is deliberate; do not
  collapse the two tokens.
- Type floor is 12px. The prototype originally bottomed out at 11.2px.
- `--seal` is used exactly once in the stylesheet. That is the design rule,
  and it is cheap to assert in CI.

## Requirements

- [ ] Tokens in `globals.css` under `:root`
- [ ] Type scale with 12px minimum at the low end of every clamp
- [ ] `cut` motion primitive + `prefers-reduced-motion` static fallback
- [ ] Visible `:focus-visible` on every interactive element
- [ ] Contrast unit test over the token pairs
- [ ] Single-colour assertion: `--seal` referenced once

## Architecture

Single-theme by intent (warm light). No dark mode: the design commits to one
world and `--seal` only reads correctly on the light ground. Document this so a
future contributor does not "add dark mode" and silently break the contrast set.

Tokens:
```
--paper #F5F3F0  --panel #EAE7E2  --panel-2 #DFDBD4
--ink #121110    --ink-2 #4A4642  --mute #666059
--rule #D2CDC5 (decorative)       --rule-s #8C857C (interactive borders)
--seal #D93A2B  (brand mark only — never text)
--cut cubic-bezier(.85,0,.15,1)
```

## Related code files

`app/globals.css`, `lib/tokens.ts` (mirror for tests), `tests/contrast.test.ts`.

## Implementation Steps

1. Write tokens to `globals.css`; mirror the hex values in `lib/tokens.ts`.
2. Write `contrast.test.ts`: relative luminance + ratio, table of
   (fg, bg, threshold, role), assert every row.
3. Add a stylelint rule or a grep test asserting `var(--seal)` count === 1.
4. Implement `.cut` / `.cut-up` and the reduced-motion block.
5. Type scale as clamps; assert lower bound ≥ 0.75rem in the test.

## Todo

- [ ] tokens.css + tokens.ts
- [ ] contrast.test.ts covering text pairs (4.5:1) and UI borders (3:1)
- [ ] seal-single-use assertion
- [ ] cut primitive + reduced-motion fallback
- [ ] focus-visible baseline
- [ ] type-scale floor test

## Success Criteria

Contrast test green. Seal assertion green. Toggling reduced-motion in devtools
produces a fully static, fully legible page.

## Risk Assessment

- **Someone adds dark mode later** and the contrast table no longer applies.
  Mitigate: comment in `globals.css` stating single-theme intent; test asserts
  against the light ground only.
- **`--seal` creeps into text.** Mitigate: assertion + comment.

## Security Considerations

None.

## Next steps

Phase 3 — routing and content.
