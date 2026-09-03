# Chạm Studio

Site de `cham-studio.fr` — Next.js en export statique, hébergé chez OVH.

## Développement

```bash
pnpm install
pnpm dev          # http://localhost:3000/fr
pnpm build        # génère out/
pnpm verify       # lint + typecheck
```

## Architecture

Export statique (`output: 'export'`) : **pas de runtime Node**, donc pas de
middleware, pas de SSR, pas d'ISR. La redirection `/` → `/fr` est faite par
`public/.htaccess`, servi par Apache chez OVH.

Les locales sont `fr` (défaut) et `en`, générées par `generateStaticParams`.
`<html lang>` est rendu au build, pas par JavaScript.

## Déploiement

Automatique à chaque push sur `main` via `.github/workflows/deploy.yml`.
Le transfert utilise `lftp` en FTPS — aucune action tierce.

### Secrets à créer

Dans **Settings → Secrets and variables → Actions**, ajoutez :

| Secret | Contenu |
|---|---|
| `OVH_FTP_HOST` | hôte FTP fourni par OVH |
| `OVH_FTP_USER` | identifiant FTP |
| `OVH_FTP_PASSWORD` | mot de passe FTP |
| `OVH_FTP_PATH` | chemin de la racine web, ex. `/www` |

Ces valeurs se récupèrent dans l'espace client OVH → Hébergements → FTP-SSH.
**Ne les mettez jamais dans un fichier du dépôt.**

> ⚠️ Le déploiement utilise `mirror --delete` : tout fichier présent sur le
> serveur mais absent de `out/` est supprimé. `OVH_FTP_PATH` doit donc pointer
> uniquement sur la racine web de ce site.

## Plan d'implémentation

Le plan de build (9 phases, revue adverse incluse) vit dans `plans/`, hors dépôt.
