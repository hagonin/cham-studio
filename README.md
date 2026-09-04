# Chạm Studio

Site de `cham-studio.fr` — Next.js, hébergé sur Vercel. Le domaine reste chez
OVH (registrar uniquement) ; son DNS pointe vers Vercel.

## Développement

```bash
pnpm install
pnpm dev          # http://localhost:3000/fr
pnpm build        # génère .next/
pnpm verify       # lint + typecheck + tests
```

## Architecture

Runtime Node complet (middleware, SSR, ISR disponibles si besoin), même si les
pages restent aujourd'hui entièrement statiques (SSG via `generateStaticParams`).
La redirection `/` → `/fr` est faite par `redirects()` dans `next.config.mjs`,
pas par un fichier serveur.

Les locales sont `fr` (défaut) et `en`, générées par `generateStaticParams`.
`<html lang>` est rendu au build, pas par JavaScript.

## Déploiement

Vercel est branché directement sur ce dépôt GitHub : chaque push sur `main` se
déploie en production, chaque pull request obtient une preview. Il n'y a rien
à configurer côté GitHub Actions pour le déploiement lui-même.

`.github/workflows/ci.yml` fait uniquement la vérification (lint, types,
tests, build, contrôles HTML) sur push et pull request.

### Configuration Vercel

1. **vercel.com → Add New → Project**, importer `hagonin/cham-studio`.
2. Garder les réglages par défaut (framework détecté : Next.js).
3. **Settings → Domains**, ajouter `cham-studio.fr` : Vercel indique les
   enregistrements DNS à créer.
4. Dans l'espace client OVH → nom de domaine → Zone DNS, pointer le domaine
   vers Vercel selon ces enregistrements (A/ALIAS pour la racine, CNAME pour
   `www` si utilisé).

## Plan d'implémentation

Le plan de build (9 phases, revue adverse incluse) vit dans `plans/`, hors dépôt.
