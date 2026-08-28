---
title: "Phase 5: Media & Scroll Recadrage"
status: todo
---

# Phase 5: Media & Scroll Recadrage

## Context
Parent: [plan.md](./plan.md). Depends on Phase 4. **Needs assets from user.**

## Overview
Date 2026-08-28 · P2 · 5h. Images plus the one scroll effect. Classic parallax
was explicitly rejected; this is a crop shift inside a fixed frame — nothing
moves relative to the page, so there is no layout shift and no floaty feel.

## Key Insights
- Scroll-driven CSS is **not Baseline**: Chrome/Edge 115+, Safari 26+, but
  Firefox still behind a flag as of FF 152 (June 2026). ~84% global. Must be
  progressive enhancement, never load-bearing.
- Reference site keeps images in **full colour** inside a monochrome interface.
  Same rule here: the UI is grey, the work is not. `--seal` remains the only
  colour Chạm itself produces.
- Portrait belongs at the contact block, not the hero — a face above the fold
  delays the value proposition and hurts LCP.

## Requirements
- [ ] 3 project frames 16:10, 1 portrait 4:5
- [ ] Static export → `images.unoptimized: true`; generate AVIF/WebP at build
      time (sharp script), not via the Next.js image server
- [ ] Explicit dimensions, `loading="lazy"` below fold
- [ ] `aspect-ratio` locks so CLS stays ~0 with or without images
- [ ] Recadrage behind `@supports (animation-timeline: view())` **and**
      `prefers-reduced-motion: no-preference`
- [ ] Descriptive `alt` naming the outcome, not the medium
- [ ] Labelled placeholders are **development-only**: production ships the work
      section with ≥2 of 3 real visuals, or the section is removed (F4)
- [ ] **No stock or found imagery, ever.** The work cards carry specific outcome
      claims ("98/100 Lighthouse"); an image that is not the actual project
      misrepresents the work and is a licensing exposure. Real screenshots only.

## Architecture
`components/Frame.tsx` — ratio prop, renders `<Image>` or placeholder.
Animation lives in CSS, not JS. No scroll listener anywhere in this phase.

## Related code files
`components/Frame.tsx`, `app/globals.css`, `public/work/*`.

## Implementation Steps
1. `Frame` with ratio variants and placeholder fallback.
2. `@keyframes recadrage` + guarded `animation-timeline: view()`.
3. Asset spec handed to user: 1600×1000 ×3, 800×1000 ×1.
4. Swap placeholders as assets arrive; alt text written per image.
5. Verify Firefox: static, correctly cropped, no gap.

## Todo
- [ ] Frame component + ratio lock
- [ ] guarded recadrage keyframes
- [ ] asset spec delivered to user
- [ ] alt text for each image
- [ ] Firefox + reduced-motion visual check

## Success Criteria
CLS < 0.02 with images and with placeholders. Firefox shows static frames with
no visual break. Reduced-motion shows no movement.

## Risk Assessment
- **Assets never arrive.** Gate: ≥2 of 3 real visuals or the work section is cut
  from the launch build. Placeholders never reach production — three hatched grey
  rectangles read as abandoned to the exact buyer this page targets. (F4)
- **Colour images fight the monochrome system** if screenshots are garish.
  Mitigate: choose calm screenshots; do not desaturate (that kills the proof).

## Security Considerations
Strip EXIF (location) from the portrait before publishing.

## Next steps
Phase 8.
