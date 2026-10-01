import { describe, expect, it } from 'vitest';
import {
  colors,
  contrastPairs,
  contrastRatio,
  thresholdFor,
  thresholds,
} from '../lib/tokens';

// Le prototype a expédié un vrai échec AA (--mute à 2.71:1) que seule une
// mesure a révélé. Ce test existe pour que cela ne se reproduise pas à l'œil.
//
// Le dessin pose des textes sous le 4,5:1 (chapô, paragraphes, outillage). La
// décision est prise — le dessin gagne — mais le SEUIL ne bouge pas : un couple
// qui échoue porte une `exemption` écrite dans lib/tokens.ts, et ce fichier
// exige les deux moitiés du contrat. Un échec sans exemption est une
// régression ; une exemption sur un couple qui passe est périmée et doit
// tomber, sinon le tableau cesse de dire la vérité.
describe('contraste des jetons (WCAG AA, papier et fonds encre)', () => {
  for (const pair of contrastPairs) {
    const min = thresholdFor(pair);
    const ratio = () => contrastRatio(colors[pair.fg], colors[pair.bg]);
    const label = `${pair.fg} sur ${pair.bg} (${pair.note})`;

    if (pair.exemption) {
      it(`${label} échoue tel que dessiné, sous ${min}:1 — exemption`, () => {
        expect(ratio()).toBeLessThan(min);
        expect(pair.exemption?.length).toBeGreaterThan(0);
      });
    } else {
      it(`${label} ≥ ${min}:1`, () => {
        expect(ratio()).toBeGreaterThanOrEqual(min);
      });
    }
  }

  // Les filets sont décoratifs : ils échouent au 3:1 et ne doivent porter aucun
  // sens. Le dessin en a cinq sur papier et deux sur encre ; tous restent sous
  // le seuil, sinon l'un d'eux est devenu une bordure et doit changer de jeton.
  it('les filets restent décoratifs : ils échouent au 3:1 sur leur fond', () => {
    for (const token of ['line', 'line-2', 'line-3', 'line-4', 'line-5'] as const) {
      expect(contrastRatio(colors[token], colors.paper), token).toBeLessThan(
        thresholds.ui,
      );
    }
    for (const token of ['line-dark', 'track'] as const) {
      expect(contrastRatio(colors[token], colors.ink), token).toBeLessThan(
        thresholds.ui,
      );
    }
  });

  // --muted porte la bordure interactive : il passe le 3:1 là où les filets
  // échouent. Ce qui reste à garder, c'est qu'on ne peut pas les confondre.
  it('--muted porte la bordure interactive : il passe le 3:1 là où --line échoue', () => {
    expect(contrastRatio(colors.muted, colors.paper)).toBeGreaterThanOrEqual(
      thresholds.ui,
    );
    expect(contrastRatio(colors.line, colors.paper)).toBeLessThan(thresholds.ui);
  });

  // Les deux jetons qui changent de rôle selon le fond. Sur papier ils sont des
  // éléments d'interface ; les poser comme texte courant y est une régression.
  it('--muted et --touch ne sont du texte courant que sur le fond encre', () => {
    for (const token of ['muted', 'touch'] as const) {
      expect(contrastRatio(colors[token], colors.paper)).toBeLessThan(thresholds.text);
      expect(contrastRatio(colors[token], colors.ink)).toBeGreaterThanOrEqual(
        thresholds.text,
      );
    }
  });

  // --grey-4 est plus sombre que --muted mais ne remplit pas son second rôle :
  // sur encre il passe sous le 4,5:1. C'est la raison pour laquelle --muted est
  // #8b8880 et non #7e7b73, alors que les deux figurent dans le dessin.
  it('--muted, et non --grey-4, est le gris qui tient le texte courant sur encre', () => {
    expect(contrastRatio(colors.muted, colors.ink)).toBeGreaterThanOrEqual(
      thresholds.text,
    );
    expect(contrastRatio(colors['grey-4'], colors.ink)).toBeLessThan(thresholds.text);
  });

  // --paper-80 est translucide : la mesure le compose sur son fond, sinon elle
  // le prendrait pour un blanc plein et surestimerait son contraste.
  it('mesure un texte translucide composé sur son fond', () => {
    expect(contrastRatio('#ffffff80', '#000000')).toBeCloseTo(
      contrastRatio('#808080', '#000000'),
      5,
    );
    expect(contrastRatio(colors['paper-80'], colors['ink-deep'])).toBeLessThan(
      contrastRatio(colors.paper, colors['ink-deep']),
    );
  });
});
