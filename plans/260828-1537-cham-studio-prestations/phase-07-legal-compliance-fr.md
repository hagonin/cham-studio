---
title: "Phase 7: Legal & Compliance FR"
status: todo
---

# Phase 7: Legal & Compliance FR

## Context
Parent: [plan.md](./plan.md). Independent. **Blocks public launch.**

## Overview
Date 2026-08-28 · P1 · 4h. A professional site operated from France carries
publication obligations. This phase is scoped as *build the pages and surface
the decisions*; the content must be confirmed by the user's accountant or a
legal source. Nothing here is legal advice.

## Key Insights
- Both reference sites treat legal pages as a **selling point** — "mentions
  légales and privacy policy included" appears in their service lists, because
  French clients know it is an obligation they would otherwise carry.
- The address question is the real blocker: an auto-entrepreneur working from
  home would otherwise publish their home address. Domiciliation services and
  coworking addresses are the usual answers. Decide before launch, not after.
- The `TVA non applicable, art. 293 B du CGI` line is both an invoicing
  obligation and a commercial advantage for non-VAT-registered clients: the
  displayed price is the price paid. Verify the current threshold applies —
  the rules moved recently.

## Requirements
- [ ] `/[locale]/mentions-legales`
- [ ] `/[locale]/confidentialite` (RGPD)
- [ ] `/[locale]/cgv`
- [ ] TVA line next to every published price
- [ ] **GA4 → CNIL-compliant consent banner is mandatory.** No GA hit before
      consent; refusing must be as easy as accepting. Confirm the current CNIL
      position on GA4 with a legal source — this is the one item on the site
      where being wrong carries a fine.
- [ ] Legal pages reachable from the footer on every page

## Architecture
Static MDX or plain server components; no client JS. Same locale routing as the
rest of the site.

## Related code files
`app/[locale]/(legal)/*`, `components/Footer.tsx`.

## Implementation Steps
1. Build the three routes and footer links.
2. Fill mentions légales: identity, statut, SIRET, **full postal address**
   (city is Montpellier; street address pending the domiciliation decision),
   contact email, host name and address.
3. Privacy: simplified by the `mailto:` decision — no form, no collection, no
   sub-processor to name. State plainly what is and is not collected. (F5)
4. CGV: scope, revision rounds, payment terms, code ownership, warranty.
5. GA4: consent-gated loading, banner with equal weight on accept and refuse,
   and a privacy section naming Google as recipient plus the transfer basis.

## Todo
- [ ] three legal routes + footer links
- [ ] address decision **received from Phase 1** (started there, critical path)
- [ ] SIRET inserted
- [ ] host details inserted
- [ ] TVA line beside prices
- [ ] GA4 consent gate verified: zero network call before consent

## Success Criteria
All three pages reachable in both locales from any page. No placeholder text
(`000 000 000 00000`) remains in production output — assert with a grep gate.

## Risk Assessment
- **Launching with placeholder SIRET** is worse than having no page. Mitigate:
  CI grep gate blocking the placeholder string.
- **Publishing the home address** by default. Mitigate: the decision is started
  in Phase 1 as a critical-path item, not discovered here. This phase still
  cannot close without it. (F3)

## Security Considerations
Legal pages publish real identity data by obligation. Keep it to what is
required; publish no phone number and no personal email — `contact@` only.

## Next steps
Phase 8.
