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
    expect(contrastRatio(colors.line, colors.paper)).toBeLessThan(thresholds.ui);
  });

  // --rule-s a disparu : --mute passe le 3:1 sur papier, donc la bordure
  // interactive et le micro-libellé sont le même jeton. Ce qui reste à garder,
  // c'est qu'on ne peut pas les confondre avec le filet décoratif.
  it('--mute porte la bordure interactive : il passe le 3:1 là où --rule échoue', () => {
    expect(contrastRatio(colors.muted, colors.paper)).toBeGreaterThanOrEqual(
      thresholds.ui,
    );
    expect(contrastRatio(colors.line, colors.paper)).toBeLessThan(thresholds.ui);
  });

  // Les deux jetons qui changent de rôle selon le fond. Sur papier ils sont des
  // éléments d'interface ; les poser comme texte y est une régression.
  it('--muted et --touch ne sont du texte que sur le fond encre', () => {
    for (const token of ['muted', 'touch'] as const) {
      expect(contrastRatio(colors[token], colors.paper)).toBeLessThan(thresholds.text);
      expect(contrastRatio(colors[token], colors.ink)).toBeGreaterThanOrEqual(
        thresholds.text,
      );
    }
  });
});
