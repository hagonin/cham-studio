import type { Locale } from '@/lib/i18n/config';

/**
 * Les deux locales vivent DANS chaque enregistrement, pas dans deux fichiers
 * parallèles. Deux fichiers dérivent ; un enregistrement ne peut pas. Ajouter
 * un projet est une seule édition, et une chaîne EN manquante échoue au build
 * au lieu d'apparaître en blanc en production.
 */
export type L10n = Record<Locale, string>;

/** Les quatre prestations sont la source unique de l'offre : la grille de la
 *  page et les clés de tarification en dérivent (Phase 6). */
export const SERVICE_KEYS = ['vitrine', 'identite', 'application', 'refonte'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export type Service = {
  key: ServiceKey;
  title: L10n;
  summary: L10n;
  deliverables: L10n[];
  /** Plancher indicatif en euros. `null` tant que le chiffre n'est pas arrêté :
   *  un prix inventé est pire qu'un prix absent. */
  from: number | null;
};

/**
 * Le visuel d'un projet. Les dimensions sont OBLIGATOIRES : sans elles le
 * navigateur ne réserve pas la place avant le chargement et la page saute —
 * or CLS ~0 est un objectif P1, pas une préférence.
 *
 * `alt` est traduit. Une image de projet porte une information ; la décrire en
 * français à un lecteur anglophone revient à ne pas la décrire.
 */
export type Cover = {
  /** Chemin sous /public. Aucune image trouvée ailleurs : une carte de projet
   *  affirme un résultat, une image non possédée la dément. */
  src: string;
  width: number;
  height: number;
  alt: L10n;
};

export type Project = {
  slug: string;
  year: number;
  cover: Cover;
  title: L10n;
  role: L10n;
  summary: L10n;
  /** Non traduit — React reste React. */
  stack: string[];
  url?: string;
};
