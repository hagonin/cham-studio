import { describe, expect, it } from 'vitest';
import {
  BASE,
  FEATURES,
  PRICING_KEYS,
  PRICES_CONFIRMED,
  allConfigs,
  duration,
  priceRange,
  type BaseTable,
} from '../lib/pricing/model';

/** Plafond de durée hérité du prototype : il annonçait « 15 à 20 semaines »
 *  sous une carte qui en promettait 6 à 10. 19 est la borne du modèle corrigé. */
const MAX_WEEKS = 19;

const configs = allConfigs();

function label(cfg: (typeof configs)[number]): string {
  return `${cfg.type}/${cfg.scale}/${cfg.design}/[${cfg.features.join(',')}]`;
}

describe('espace des configurations', () => {
  it('couvre les 2304 combinaisons', () => {
    // 4 types × 3 ampleurs × 3 niveaux de design × 64 sous-ensembles.
    expect(configs).toHaveLength(PRICING_KEYS.length * 3 * 3 * 2 ** FEATURES.length);
    expect(configs).toHaveLength(2304);
  });

  it('n’énumère pas deux fois la même configuration', () => {
    const seen = new Set(configs.map(label));
    expect(seen.size).toBe(configs.length);
  });
});

describe('invariants tarifaires, sur les planchers expédiés', () => {
  it('ne descend jamais sous le plancher annoncé par la carte', () => {
    // La panne du prototype : 1 100 € affichés sous une carte « à partir de
    // 1 200 € ». Silencieuse — elle ne se voit qu'en comparant les deux.
    for (const cfg of configs) {
      const range = priceRange(cfg);
      expect(range, label(cfg)).not.toBeNull();
      expect(range!.lo, label(cfg)).toBeGreaterThanOrEqual(BASE[cfg.type]!);
    }
  });

  it('garde une fourchette, jamais un point', () => {
    for (const cfg of configs) {
      const { lo, hi } = priceRange(cfg)!;
      expect(hi, label(cfg)).toBeGreaterThan(lo);
    }
  });

  it('monte quand la configuration monte', () => {
    // Une option cochée ne doit pas pouvoir faire BAISSER le prix : c'est le
    // genre d'inversion qu'un coefficient mal signé produit sans rien casser.
    for (const cfg of configs) {
      if (cfg.features.length === 0) continue;
      const lighter = { ...cfg, features: cfg.features.slice(0, -1) };
      expect(priceRange(cfg)!.hi, label(cfg)).toBeGreaterThanOrEqual(
        priceRange(lighter)!.hi,
      );
    }
  });

  it('reste dans un ordre de grandeur défendable', () => {
    // Garde-fou d'AMPLITUDE, pas de justesse : le modèle multiplie jusqu'à
    // ×6,6, donc une vitrine tout coché frôle les cinq chiffres. Ce test ne dit
    // pas que le prix est juste — il échoue si un coefficient part en vrille.
    // Voir reports/pricing-benchmark-2026-09-04.md, point 2.
    for (const cfg of configs) {
      expect(priceRange(cfg)!.hi / BASE[cfg.type]!, label(cfg)).toBeLessThanOrEqual(8);
    }
  });
});

describe('invariants de durée', () => {
  it('donne une fourchette croissante et bornée', () => {
    // La durée ne dépend d'aucun tarif : elle vaut aussi bien à planchers nuls.
    for (const cfg of configs) {
      const { w1, w2 } = duration(cfg);
      expect(w1, label(cfg)).toBeGreaterThan(0);
      expect(w2, label(cfg)).toBeGreaterThan(w1);
      expect(w2, label(cfg)).toBeLessThanOrEqual(MAX_WEEKS);
    }
  });
});

describe('prestation sans tarif arrêté', () => {
  const noPrices: BaseTable = {
    vitrine: null,
    identite: null,
    application: null,
    refonte: null,
  };

  it('rend « sur devis » plutôt qu’un zéro', () => {
    // `0` passerait le typage et s'afficherait « 0 € ». `null` ne s'affiche pas.
    // C'est l'état qui reviendra le jour où une prestation est ajoutée sans
    // son plancher : la branche doit rester exercée.
    for (const cfg of configs) {
      expect(priceRange(cfg, noPrices), label(cfg)).toBeNull();
      expect(duration(cfg).w1, label(cfg)).toBeGreaterThan(0);
    }
  });

  it('n’écrit jamais un plancher à zéro', () => {
    for (const key of PRICING_KEYS) {
      const floor = BASE[key];
      expect(floor === null || floor > 0, key).toBe(true);
    }
  });
});

describe('découplage du modèle', () => {
  // REMPLACE « lie les cartes à BASE » : les cartes ne lisent plus BASE, et la
  // garde qui vérifiait leur cohérence n'a plus d'objet. L'invariant qui la
  // remplace — les trois prestations valent `null` — vit dans
  // tests/content.test.ts, au plus près de ce qu'il protège.
  it('garde ses propres clés, indépendantes de l’offre publiée', () => {
    expect(PRICING_KEYS).toEqual(['vitrine', 'identite', 'application', 'refonte']);
  });

  it('garde les tarifs hors production tant qu’ils ne sont pas validés', () => {
    // Chiffres issus d'un benchmark, pas d'une décision de l'exploitante.
    // `scripts/check-prices.mjs` s'appuie sur ce drapeau.
    expect(PRICES_CONFIRMED).toBe(false);
  });
});
