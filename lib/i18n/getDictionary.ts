import { fr, type Dictionary } from './dictionaries/fr';
import { en } from './dictionaries/en';
import type { Locale } from './config';

// Import statique plutôt que dynamique : l'export statique n'a pas de runtime,
// tout est de toute façon figé au build, et un objet indexé se type mieux.
const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
