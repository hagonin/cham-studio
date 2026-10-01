import { describe, expect, it } from 'vitest';
import {
  GESTURE,
  classifyMove,
  dragOffset,
  slotFor,
  swipeStep,
  wrapIndex,
} from '../lib/gallery/carousel';

/**
 * Ces tests remplacent ceux de l'ancienne galerie WebGL : celle-ci dessinait des
 * plans dans une scène 3D et dérivait leurs positions d'un écart continu ; le
 * dessin tourne trois panneaux CSS entre des emplacements discrets, en boucle.
 * Ce qui reste à garder, c'est ce qui peut se tromper en silence : la boucle, et
 * les seuils du geste qui décident si la page défile encore sous le doigt.
 */
describe('emplacements des panneaux', () => {
  const slots = (current: number, count = 3) =>
    Array.from({ length: count }, (_, index) => slotFor(index, current, count));

  it('pose le projet ouvert au centre, ses voisins de part et d’autre', () => {
    expect(slots(1)).toEqual([-1, 0, 1]);
  });

  it('boucle : le dernier passe à gauche du premier', () => {
    expect(slots(0)).toEqual([0, 1, -1]);
    expect(slots(2)).toEqual([1, -1, 0]);
  });

  it('place toujours exactement un panneau au centre', () => {
    for (const count of [2, 3, 5]) {
      for (let current = 0; current < count; current += 1) {
        const centred = Array.from({ length: count }, (_, i) =>
          slotFor(i, current, count),
        );
        expect(centred.filter((slot) => slot === 0)).toHaveLength(1);
      }
    }
  });

  it('avec deux projets, le voisin est à gauche', () => {
    expect(slots(0, 2)).toEqual([0, -1]);
    expect(slots(1, 2)).toEqual([-1, 0]);
  });

  it('numérote 2, 3… au-delà de trois projets (le CSS les cache)', () => {
    expect(slots(0, 5)).toEqual([0, 1, 2, 3, -1]);
  });
});

describe('boucle des rangs', () => {
  it('revient au début après le dernier, à la fin avant le premier', () => {
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(-4, 3)).toBe(2);
  });

  it('ne produit pas NaN sur une liste vide', () => {
    expect(wrapIndex(1, 0)).toBe(0);
  });
});

describe('geste du pointeur', () => {
  it('attend tant que le mouvement est petit', () => {
    expect(classifyMove(3, 2, false)).toBe('pending');
    expect(classifyMove(GESTURE.CAPTURE_X, 0, false)).toBe('pending');
  });

  it('prend le geste au-delà de 8px à l’horizontale', () => {
    expect(classifyMove(GESTURE.CAPTURE_X + 1, 2, false)).toBe('horizontal');
  });

  it('abandonne un mouvement vertical : la page doit défiler sous le doigt', () => {
    // La panne qu'on empêche : un carrousel qui avale le défilement vertical sur
    // écran tactile. Un pavé tactile ne la reproduit pas.
    expect(classifyMove(2, GESTURE.CANCEL_Y + 1, false)).toBe('cancel');
    expect(classifyMove(-5, 40, false)).toBe('cancel');
  });

  it('teste la verticale AVANT la prise : plus vertical qu’horizontal abandonne même au-delà de 8px', () => {
    expect(classifyMove(10, 30, false)).toBe('cancel');
  });

  it('ne rend pas le geste une fois pris : il reste horizontal jusqu’au relâchement', () => {
    expect(classifyMove(10, 200, true)).toBe('horizontal');
  });

  it('ne l’abandonne pas sous 12px de vertical', () => {
    expect(classifyMove(2, GESTURE.CANCEL_Y, false)).toBe('pending');
  });
});

describe('relâchement du glissé', () => {
  it('tourne vers l’avant à gauche, vers l’arrière à droite', () => {
    expect(swipeStep(-60)).toBe(1);
    expect(swipeStep(60)).toBe(-1);
  });

  it('ne tourne pas sous le seuil : c’est un clic dont la main a bougé', () => {
    expect(swipeStep(GESTURE.TURN_X)).toBe(0);
    expect(swipeStep(-GESTURE.TURN_X)).toBe(0);
    expect(swipeStep(0)).toBe(0);
  });

  it('ne tourne qu’un panneau, quelle que soit la longueur du geste', () => {
    expect(swipeStep(-900)).toBe(1);
    expect(swipeStep(900)).toBe(-1);
  });

  it('borne le suivi de la scène pendant le glissé', () => {
    expect(dragOffset(100)).toBeCloseTo(45, 5);
    expect(dragOffset(10_000)).toBe(GESTURE.DRAG_MAX);
    expect(dragOffset(-10_000)).toBe(-GESTURE.DRAG_MAX);
    expect(dragOffset(0)).toBe(0);
  });
});
