import type { MetadataRoute } from 'next';
import { PUBLISHED, SITE_URL, localeHref } from '@/lib/i18n/config';

/**
 * Les routes du site, hors préfixe de locale (slugs identiques, F7).
 *
 * L'index `/projects` a disparu : les travaux vivent sur la page unique.
 *
 * Pas d'expansion par slug de projet ici : `content/projects.ts` a du contenu
 * réel mais aucune route `[locale]/[slug]` n'existe encore pour le servir —
 * l'annoncer au sitemap enverrait Google sur des 404. Reprendre la dérivation
 * depuis `projectsNewestFirst()` le jour où cette route existe.
 */
function routes(): string[] {
  return [''];
}

// Rien ici ne dépend de la requête : la route est déclarée figée pour être
// rendue au build plutôt qu'à chaque visite.
export const dynamic = 'force-static';

/**
 * Le sitemap dérive de `PUBLISHED` comme les hreflang et le `noindex` :
 * une locale non publiée n'y figure pas, et il n'y a pas de second endroit à
 * mettre à jour le jour de la bascule.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLISHED.flatMap((locale) =>
    routes().map((route) => ({
      url: `${SITE_URL}${localeHref(locale, route)}`,
      lastModified: new Date(),
    })),
  );
}
