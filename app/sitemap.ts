import type { MetadataRoute } from 'next';
import { PUBLISHED, SITE_URL, localeHref } from '@/lib/i18n/config';
import { workSectionIsReady } from '@/content/projects';

/**
 * Les routes du site, hors préfixe de locale (slugs identiques, F7).
 *
 * `/projects` n'y figure que lorsque la section travaux a de quoi paraître :
 * annoncer au moteur une page dont le contenu principal manque revient à la
 * faire juger sur ce qui n'y est pas. La même condition pilote son `noindex`.
 */
function routes(): string[] {
  return workSectionIsReady() ? ['', 'projects'] : [''];
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
