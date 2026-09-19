import { describe, expect, it } from 'vitest';
import {
  MAX_DEPTH,
  MAX_TILT,
  SPACING,
  SWIPE_MIN,
  pageAfterSwipe,
  turnPage,
  scrollProgress,
  slotAt,
} from '@/lib/gallery/layout';

/**
 * Le livre se feuillette : chaque page se place selon son écart avec la page
 * ouverte. Ces tests tiennent la composition — page ouverte droite au centre,
 * voisines tournées vers elle — quel que soit l'écart, y compris pendant
 * qu'une page tourne (écart fractionnaire).
 */
describe('emplacements du livre', () => {
  it('garde la page ouverte droite, au centre, sans recul', () => {
    expect(slotAt(0)).toEqual({ x: 0, z: 0, rotationY: 0 });
  });

  it('reste symétrique de part et d’autre de la page ouverte', () => {
    for (const offset of [0.3, 1, 2]) {
      const left = slotAt(-offset);
      const right = slotAt(offset);
      expect(left.x).toBeCloseTo(-right.x);
      expect(left.z).toBeCloseTo(right.z);
      expect(left.rotationY).toBeCloseTo(-right.rotationY);
    }
  });

  it('écarte les pages de SPACING, sans trou ni chevauchement', () => {
    for (const offset of [-2, -1, 0, 1]) {
      expect(slotAt(offset + 1).x - slotAt(offset).x).toBeCloseTo(SPACING);
    }
  });

  it('tourne les pages voisines VERS la page ouverte', () => {
    // À gauche (x < 0) la rotation est positive, donc la face regarde à droite.
    expect(slotAt(-1).rotationY).toBeGreaterThan(0);
    expect(slotAt(1).rotationY).toBeLessThan(0);
  });

  it('ne dépasse jamais l’inclinaison ni le recul maximum', () => {
    for (const offset of [-5, -1.5, -0.4, 0.7, 3]) {
      expect(Math.abs(slotAt(offset).rotationY)).toBeLessThanOrEqual(MAX_TILT);
      expect(Math.abs(slotAt(offset).z)).toBeLessThanOrEqual(MAX_DEPTH);
    }
  });

  it('passe continûment d’un emplacement à l’autre pendant qu’une page tourne', () => {
    const halfway = slotAt(0.5);
    expect(halfway.rotationY).toBeCloseTo(-MAX_TILT / 2);
    expect(halfway.z).toBeCloseTo(-MAX_DEPTH / 2);
  });
});

describe('glisser pour tourner une page', () => {
  it('ignore un mouvement plus court que le seuil : c’est un clic', () => {
    expect(pageAfterSwipe(1, SWIPE_MIN - 1, 3)).toBe(1);
    expect(pageAfterSwipe(1, -(SWIPE_MIN - 1), 3)).toBe(1);
  });

  it('avance vers la gauche, recule vers la droite', () => {
    expect(pageAfterSwipe(1, -SWIPE_MIN, 3)).toBe(2);
    expect(pageAfterSwipe(1, SWIPE_MIN, 3)).toBe(0);
  });

  it('ne tourne qu’une page, quelle que soit la longueur du geste', () => {
    expect(pageAfterSwipe(0, -2000, 3)).toBe(1);
  });

  it('reste en place aux deux bouts du livre', () => {
    expect(pageAfterSwipe(0, SWIPE_MIN * 2, 3)).toBe(0);
    expect(pageAfterSwipe(2, -SWIPE_MIN * 2, 3)).toBe(2);
  });

  it('ne produit pas de page négative sur un livre vide', () => {
    expect(pageAfterSwipe(0, -SWIPE_MIN * 2, 0)).toBe(0);
    expect(turnPage(0, 1, 0)).toBe(0);
  });

  it('borne les boutons comme le geste', () => {
    expect(turnPage(2, 1, 3)).toBe(2);
    expect(turnPage(0, -1, 3)).toBe(0);
    expect(turnPage(1, 1, 3)).toBe(2);
  });
});

describe('avancement au défilement', () => {
  it('vaut 0 tant que la section est sous le viewport', () => {
    expect(scrollProgress(1000, 600, 800)).toBe(0);
  });

  it('vaut 1 une fois la section entièrement passée', () => {
    expect(scrollProgress(-1400, 600, 800)).toBe(1);
  });

  it('progresse de façon monotone entre les deux', () => {
    const steps = [800, 600, 400, 200, 0, -200, -400].map((top) =>
      scrollProgress(top, 600, 800),
    );
    for (let i = 1; i < steps.length; i += 1) {
      expect(steps[i]).toBeGreaterThan(steps[i - 1]);
    }
  });

  it('ne divise pas par zéro sur un viewport nul', () => {
    expect(scrollProgress(0, 0, 0)).toBe(0);
  });
});
