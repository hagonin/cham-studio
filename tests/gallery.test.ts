import { describe, expect, it } from 'vitest';
import {
  MAX_DEPTH,
  MAX_TILT,
  SPACING,
  scrollProgress,
  slotsFor,
} from '@/lib/gallery/layout';

/**
 * La production publie DEUX projets et en publiera trois : les deux comptes
 * doivent tenir sans re-réglage. C'est la raison d'être de `slotsFor`, donc
 * c'est ce que ces tests vérifient en premier.
 */
describe('emplacements de la galerie', () => {
  it('ne rend rien sans projet', () => {
    expect(slotsFor(0)).toEqual([]);
    expect(slotsFor(-1)).toEqual([]);
  });

  it('centre un projet unique, droit et sans recul', () => {
    expect(slotsFor(1)).toEqual([{ x: 0, z: 0, rotationY: 0 }]);
  });

  it('reste symétrique autour de zéro, quel que soit le compte', () => {
    for (const count of [2, 3, 4, 5]) {
      const xs = slotsFor(count).map((slot) => slot.x);
      const sum = xs.reduce((total, x) => total + x, 0);
      expect(sum, `${count} écrans`).toBeCloseTo(0);
    }
  });

  it('écarte les écrans de SPACING, sans trou ni chevauchement', () => {
    const xs = slotsFor(4).map((slot) => slot.x);
    for (let i = 1; i < xs.length; i += 1) {
      expect(xs[i] - xs[i - 1]).toBeCloseTo(SPACING);
    }
  });

  it('tourne les écrans de bord VERS le centre', () => {
    const [left, , right] = slotsFor(3);
    // À gauche (x < 0) la rotation est positive, donc la face regarde à droite.
    expect(left.x).toBeLessThan(0);
    expect(left.rotationY).toBeGreaterThan(0);
    expect(right.x).toBeGreaterThan(0);
    expect(right.rotationY).toBeLessThan(0);
  });

  it('laisse l’écran du centre droit quand il y en a un', () => {
    expect(slotsFor(3)[1]).toEqual({ x: 0, z: 0, rotationY: 0 });
  });

  it('ne dépasse jamais l’inclinaison ni le recul maximum', () => {
    for (const count of [2, 3, 5, 8]) {
      for (const slot of slotsFor(count)) {
        expect(Math.abs(slot.rotationY)).toBeLessThanOrEqual(MAX_TILT);
        expect(Math.abs(slot.z)).toBeLessThanOrEqual(MAX_DEPTH);
      }
    }
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
