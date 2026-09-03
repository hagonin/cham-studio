import { describe, expect, it } from 'vitest';
import { colors, contrastPairs, contrastRatio, thresholds } from '../lib/tokens';

// Le prototype a expédié un vrai échec AA (--mute à 2.71:1) que seule une
// mesure a révélé. Ce test existe pour que cela ne se reproduise pas à l'œil.
describe('contraste des jetons (WCAG AA, fond clair unique)', () => {
  for (const pair of contrastPairs) {
    const min = thresholds[pair.role];
    it(`${pair.fg} sur ${pair.bg} (${pair.note}) ≥ ${min}:1`, () => {
      const ratio = contrastRatio(colors[pair.fg], colors[pair.bg]);
      expect(ratio).toBeGreaterThanOrEqual(min);
    });
  }

  it('--rule reste décoratif : il échoue au 3:1 et ne doit porter aucun sens', () => {
    expect(contrastRatio(colors.rule, colors.paper)).toBeLessThan(thresholds.ui);
  });

  it('--rule-s et --rule ne sont pas interchangeables', () => {
    expect(colors['rule-s']).not.toBe(colors.rule);
  });
});
