/**
 * DÉCOUPLÉ DE L'OFFRE (décisions 8 et 13). L'estimateur n'est plus monté et
 * l'offre publiée est passée à trois engagements ; ce modèle garde les quatre
 * clés sur lesquelles ses tests ont été écrits. Les rebrancher sur
 * `ServiceKey` ferait bouger un modèle démontré par une décision commerciale,
 * et casserait `tests/pricing.test.ts` sans que personne ne regarde la page.
 */
export const PRICING_KEYS = ['vitrine', 'identite', 'application', 'refonte'] as const;
export type PricingKey = (typeof PRICING_KEYS)[number];

/**
 * Libellés du modèle, pour lui seul. Ils vivaient dans `content/services.ts`
 * du temps où l'offre publiée et les clés tarifaires étaient les mêmes ; elles
 * ne le sont plus. Les reprendre depuis l'offre ferait dépendre un modèle
 * démonté de décisions commerciales qui bougent sans lui.
 */
export const PRICING_LABELS: Record<PricingKey, Record<'fr' | 'en', string>> = {
  vitrine: { fr: 'Site vitrine', en: 'Marketing site' },
  identite: { fr: 'Identité', en: 'Brand identity' },
  application: { fr: 'Application web', en: 'Web application' },
  refonte: { fr: 'Refonte', en: 'Redesign' },
};

/**
 * Le modèle tarifaire. Fonction pure, aucune connaissance du DOM : les deux
 * pannes du prototype (un bas de fourchette SOUS le plancher annoncé, une
 * durée qui doublait le délai promis sur la carte) ne se voyaient pas à l'œil.
 * Elles se voient en arithmétique, donc elles se verrouillent par un test
 * exhaustif — voir tests/pricing.test.ts.
 */

/** `false` tant que l'exploitante n'a pas validé les chiffres. Les planchers
 *  ci-dessous viennent d'un benchmark, pas d'une décision : `scripts/
 *  check-prices.mjs` (branché en `prebuild`) bloque la mise en PRODUCTION tant
 *  que ce drapeau est faux, et laisse passer dev et préversion. */
export const PRICES_CONFIRMED = false;

/**
 * Planchers en euros, nets — franchise en base de TVA, donc le prix affiché est
 * le prix payé. `content/services.ts` lit ces valeurs, donc une carte ne peut
 * pas afficher un plancher que l'estimateur ignore.
 *
 * Le type autorise `null` : un chiffre non arrêté vaut `null`, JAMAIS `0` — un
 * zéro est un prix, une absence n'en est pas un. Même règle que `site.legal`.
 *
 * Chiffres du benchmark 2026 (reports/pricing-benchmark-2026-09-04.md), PAS
 * encore validés par l'exploitante : d'où `PRICES_CONFIRMED` à `false`, qui les
 * laisse visibles en préversion et bloque la mise en production.
 */
export const BASE: Record<PricingKey, number | null> = {
  vitrine: 1500,
  identite: 1200,
  application: 6000,
  refonte: 1800,
};

export const SCALES = ['simple', 'standard', 'etendu'] as const;
export type Scale = (typeof SCALES)[number];

export const DESIGN_LEVELS = ['sobre', 'surMesure', 'signature'] as const;
export type DesignLevel = (typeof DESIGN_LEVELS)[number];

export const FEATURES = [
  'multilingue',
  'cms',
  'ecommerce',
  'reservation',
  'compte',
  'integration',
] as const;
export type Feature = (typeof FEATURES)[number];

export type Config = {
  type: PricingKey;
  scale: Scale;
  design: DesignLevel;
  features: readonly Feature[];
};

export type Range = { lo: number; hi: number };
export type Weeks = { w1: number; w2: number };

/** Table des planchers. Paramétrable UNIQUEMENT pour que le test puisse
 *  exercer la branche « chiffre non arrêté » avec une table à `null` : c'est
 *  l'état qui reviendra si une prestation est ajoutée sans son tarif. Aucun
 *  appelant applicatif ne la passe. */
export type BaseTable = Record<PricingKey, number | null>;

/* --- Coefficients ---------------------------------------------------------
   Hypothèse commerciale issue d'un échantillon de DEUX sites, pas un tarif
   validé. Le test exhaustif prouve la cohérence interne, pas la justesse du
   prix. Voir plan.md → « Assumptions to revisit ». */

const SCALE_FACTOR: Record<Scale, number> = {
  simple: 1,
  standard: 1.35,
  etendu: 1.8,
};

const DESIGN_FACTOR: Record<DesignLevel, number> = {
  sobre: 1,
  surMesure: 1.25,
  signature: 1.5,
};

/** Part du plancher ajoutée par fonctionnalité. Additif, pas multiplicatif :
 *  six options multiplicatives feraient exploser le haut de fourchette. */
const FEATURE_SHARE: Record<Feature, number> = {
  multilingue: 0.15,
  cms: 0.2,
  ecommerce: 0.35,
  reservation: 0.25,
  compte: 0.3,
  integration: 0.2,
};

/** Fourchette asymétrique −12 % / +18 %. DÉCISION COMMERCIALE : elle laisse de
 *  la marge pour négocier vers le haut. Ce n'est pas un bug de symétrie. */
const LOW = 0.88;
const HIGH = 1.18;

const WEEKS_FACTOR: Record<Scale, number> = {
  simple: 1,
  standard: 1.4,
  etendu: 1.9,
};

const WEEKS_BASE: Record<PricingKey, number> = {
  vitrine: 3,
  identite: 2,
  application: 6,
  refonte: 4,
};

const WEEKS_DESIGN: Record<DesignLevel, number> = {
  sobre: 0,
  surMesure: 0.5,
  signature: 1,
};

const WEEKS_PER_FEATURE = 0.5;

/** Arrondi AU-DESSUS au multiple de 50. Vers le haut, jamais vers le bas :
 *  arrondir le bas de fourchette vers le bas le ferait passer sous le plancher
 *  annoncé par la carte — exactement la panne du prototype. */
function roundUp50(value: number): number {
  return Math.ceil(value / 50) * 50;
}

function multiplier(cfg: Config): number {
  const extra = cfg.features.reduce((sum, feature) => sum + FEATURE_SHARE[feature], 0);
  return SCALE_FACTOR[cfg.scale] * DESIGN_FACTOR[cfg.design] * (1 + extra);
}

/**
 * Toujours calculable : la durée ne dépend d'aucun tarif. C'est la raison pour
 * laquelle elle est séparée du prix — un objet à moitié nul obligerait chaque
 * appelant à le déballer.
 */
export function duration(cfg: Config): Weeks {
  const raw =
    WEEKS_BASE[cfg.type] * WEEKS_FACTOR[cfg.scale] +
    WEEKS_DESIGN[cfg.design] +
    cfg.features.length * WEEKS_PER_FEATURE;
  const w1 = Math.round(raw);
  return { w1, w2: Math.max(w1 + 1, Math.round(w1 * 1.25)) };
}

/**
 * `null` quand le plancher du type n'est pas arrêté. Le composant rend alors
 * l'état « sur devis » : il n'a aucune branche « prix à zéro » à écrire.
 */
export function priceRange(cfg: Config, base: BaseTable = BASE): Range | null {
  const floor = base[cfg.type];
  if (floor === null) return null;

  const mid = floor * multiplier(cfg);
  return {
    // Le plancher annoncé sur la carte est un plancher : la fourchette ne
    // passe jamais dessous, quelle que soit la configuration.
    lo: Math.max(roundUp50(mid * LOW), floor),
    hi: roundUp50(mid * HIGH),
  };
}

/** Toutes les configurations possibles — 4 × 3 × 3 × 64 = 2304. Exporté parce
 *  que le test exhaustif et le modèle doivent énumérer le MÊME espace : une
 *  énumération recopiée dans le test cesserait de couvrir une option ajoutée
 *  ici sans que rien n'échoue. */
export function allConfigs(): Config[] {
  const subsets: Feature[][] = [[]];
  for (const feature of FEATURES) {
    for (const subset of [...subsets]) subsets.push([...subset, feature]);
  }

  const configs: Config[] = [];
  for (const type of PRICING_KEYS) {
    for (const scale of SCALES) {
      for (const design of DESIGN_LEVELS) {
        for (const features of subsets) {
          configs.push({ type, scale, design, features });
        }
      }
    }
  }
  return configs;
}
