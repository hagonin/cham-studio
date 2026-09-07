import type { MetadataRoute } from 'next';
import { PUBLISHED, SITE_URL, localeHref } from '@/lib/i18n/config';
import { projectsNewestFirst } from '@/content/projects';

/**
 * Les routes du site, hors préfixe de locale (slugs identiques, F7).
 *
 * L'index `/projects` a disparu : les travaux vivent sur la page unique. Les
 * ÉTUDES DE CAS gardent leur propre route, une par projet réel.
 *
 * La liste DÉRIVE du contenu au lieu d'être écrite ici : `projects` est vide en
 * production tant qu'aucune étude n'est publiée, donc le sitemap est correct
 * avant comme après, sans second endroit à modifier le jour où elles arrivent.
 */
function routes(): string[] {
  return ['', ...projectsNewestFirst().map((project) => project.slug)];
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
