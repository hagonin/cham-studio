import type { MetadataRoute } from 'next';
import { PUBLISHED, SITE_URL, localeHref } from '@/lib/i18n/config';

/** Les routes du site, hors préfixe de locale (slugs identiques, F7). */
const ROUTES = ['', 'projects'];

// L'export statique n'a pas de runtime : la route doit être déclarée figée,
// sinon Next la traite comme dynamique et refuse de l'exporter.
export const dynamic = 'force-static';

/**
 * Le sitemap dérive de `PUBLISHED` comme les hreflang et le `noindex` :
 * une locale non publiée n'y figure pas, et il n'y a pas de second endroit à
 * mettre à jour le jour de la bascule.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLISHED.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE_URL}${localeHref(locale, route)}`,
      lastModified: new Date(),
    })),
  );
}
