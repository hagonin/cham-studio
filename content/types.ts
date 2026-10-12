import type { Locale } from '@/lib/i18n/config';

/**
 * Les deux locales vivent DANS chaque enregistrement, pas dans deux fichiers
 * parallèles. Deux fichiers dérivent ; un enregistrement ne peut pas. Ajouter
 * un projet est une seule édition, et une chaîne EN manquante échoue au build
 * au lieu d'apparaître en blanc en production.
 */
export type L10n = Record<Locale, string>;

/**
 * L'offre, en trois ENGAGEMENTS et non plus en quatre livrables.
 *
 * `vitrine · identite · application · refonte` nommaient ce qui sort de
 * l'atelier ; ces trois-là nomment ce pour quoi on est engagée. Une personne
 * arrive en se disant « il me faut un MVP », jamais « il me faut une vitrine ».
 *
 * Les clés de tarification n'en dérivent pas : l'estimateur (`PricingKey`,
 * retiré tant que les tarifs restent provisoires) vivait à part pour la même
 * raison — coupler une offre publiée à un modèle démonté ferait bouger l'un
 * pour l'autre.
 */
export const SERVICE_KEYS = ['mvp', 'websites', 'improvement'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export type Service = {
  key: ServiceKey;
  title: L10n;
  summary: L10n;
  deliverables: L10n[];
  /** Plancher indicatif en euros. `null` PARTOUT depuis la décision 7 : aucun
   *  chiffre n'est publié, les lignes affichent « Sur devis ». Le champ reste
   *  typé `number | null` — la décision est commerciale, pas structurelle, et
   *  la rouvrir ne doit pas demander une migration de type.
   *  `tests/content.test.ts` vérifie que les trois valent bien `null`. */
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
  /** Non traduit — React reste React. Rendu dans l'étude de cas, liste « Code ». */
  stack: string[];
  url?: string;
  /** Optionnel : sans lui, la fiche n'a pas de bouton « étude de cas ». */
  caseStudy?: CaseStudy;
};

/**
 * L'étude de cas d'un projet, ouverte en modale depuis sa fiche. Trois
 * rubriques de prose, puis la rubrique « Stack tech & design » en deux LISTES :
 * `designTools` ici, `stack` sur le projet. Les réponses de l'owner sont des
 * listes, pas des phrases — aucune prose à inventer pour les relier.
 * `tests/content.test.ts` échoue sur une rubrique vide dans une locale.
 */
export type CaseStudy = {
  problem: L10n;
  approach: L10n;
  result: L10n;
  /** Non traduit, comme `stack`. */
  designTools: string[];
};
