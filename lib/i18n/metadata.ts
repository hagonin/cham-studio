import type { Metadata } from 'next';
import {
  PUBLISHED,
  SITE_URL,
  defaultLocale,
  isPublished,
  localeHref,
  type Locale,
} from './config';

/**
 * Tant qu'une seule locale est publiée, AUCUNE annotation hreflang n'est émise.
 *
 * Un couple réciproque qui pointe vers une page `noindex` est pire que pas de
 * couple du tout : Google écarte la grappe et peut se méfier de l'annotation
 * le jour où EN passe en ligne. L'absence est l'état sûr.
 */
export function buildAlternates(
  published: readonly Locale[],
  locale: Locale,
  path = '',
): Metadata['alternates'] {
  const canonical = localeHref(locale, path);
  if (published.length < 2) return { canonical };

  const languages: Record<string, string> = {};
  for (const one of published) languages[one] = localeHref(one, path);
  // FR est la locale par défaut, donc x-default.
  languages['x-default'] = localeHref(defaultLocale, path);

  return { canonical, languages };
}

export function alternatesFor(locale: Locale, path = ''): Metadata['alternates'] {
  return buildAlternates(PUBLISHED, locale, path);
}

/** Une locale non publiée ne doit ni être indexée ni être suivie. */
export function robotsFor(locale: Locale): Metadata['robots'] {
  return isPublished(locale)
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

export function metadataFor(
  locale: Locale,
  path: string,
  base: { title: string; description: string },
): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: base.title,
    description: base.description,
    alternates: alternatesFor(locale, path),
    robots: robotsFor(locale),
  };
}
