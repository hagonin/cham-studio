export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

/**
 * Les locales réellement publiées.
 *
 * Ajouter `'en'` ici bascule d'un seul geste : les routes indexables, les
 * annotations hreflang et les entrées de sitemap. Il n'y a pas de second
 * endroit à ne pas oublier — c'est tout l'intérêt du tableau.
 *
 * Les deux langues sont publiées. L'anglais de la page est celui du dessin,
 * mot pour mot ; ce qui reste d'un premier jet non relu (l'estimateur de
 * prix, hors page) ne doit pas être monté tel quel : une traduction non relue
 * coûte plus cher en crédibilité qu'une langue absente.
 */
export const PUBLISHED: Locale[] = ['fr', 'en'];

/** Le segment vient de l'URL : jamais de lookup avant cette validation. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isPublished(locale: Locale): boolean {
  return PUBLISHED.includes(locale);
}

/**
 * La copie des dictionnaires est-elle la copie définitive ?
 *
 * `true` : la copie du dessin est en place dans les deux langues (le français
 * vient du deck `copy-fr.md`, dont chaque cellule a été retrouvée dans les
 * dictionnaires) et le propriétaire l'a approuvée. Ce drapeau ne casse pas le
 * build — il rend l'état visible. Il repasse à `false` si de la copie non
 * relue entre dans les dictionnaires, et ne se rétablit qu'à la relecture.
 */
export const COPY_CONFIRMED = true;

export const SITE_URL = 'https://cham-studio.fr';

/** URL absolue d'une route dans une locale. Slugs identiques d'une locale à
 *  l'autre (F7) : pas de table de correspondance, donc pas de dérive. */
export function localeHref(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/|\/$/g, '');
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

/**
 * Route miroir dans une autre locale. Le sélecteur de langue doit rester sur
 * la page courante : renvoyer à l'accueil fait perdre le contexte et se lit
 * comme un bug.
 */
export function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) segments[0] = target;
  else segments.unshift(target);
  return `/${segments.join('/')}/`;
}
