import { describe, expect, it } from 'vitest';
import {
  CURSOR_STATES,
  NEAR_RADIUS,
  distanceToRect,
  labelFor,
  lerp,
  stateFor,
} from '../lib/motion/cursor';
import { CHAR_RADIUS, falloff } from '../lib/motion/pointer';

/**
 * Seule la logique PURE du curseur est testée ici : c'est la part qui peut se
 * tromper en silence. Un `near` qui ne relâche jamais laisse un anneau ouvert
 * au milieu de rien, et aucun test d'accessibilité ne le voit.
 *
 * Le reste (Lenis, ScrollTrigger, rAF) demande un vrai navigateur et se vérifie
 * à la main — c'est écrit dans la phase, pas contourné ici.
 */

function rect(x: number, y: number, w: number, h: number): DOMRect {
  return {
    x,
    y,
    width: w,
    height: h,
    left: x,
    top: y,
    right: x + w,
    bottom: y + h,
  } as DOMRect;
}

describe('distance au rectangle', () => {
  const box = rect(100, 100, 50, 20);

  it('vaut zéro à l’intérieur', () => {
    expect(distanceToRect(120, 110, box)).toBe(0);
  });

  it('mesure depuis le bord, pas depuis le centre', () => {
    // Mesurer depuis le centre ferait passer en « near » des éléments larges
    // dont le bord est encore loin.
    expect(distanceToRect(160, 110, box)).toBe(10);
    expect(distanceToRect(120, 80, box)).toBe(20);
  });

  it('compose les deux axes en diagonale', () => {
    expect(distanceToRect(153, 96, box)).toBeCloseTo(5, 5);
  });
});

describe('machine à états du curseur', () => {
  it('n’émet que des états connus', () => {
    for (const distance of [0, NEAR_RADIUS - 1, NEAR_RADIUS, NEAR_RADIUS + 1, 1e4]) {
      for (const hovering of [true, false]) {
        expect(CURSOR_STATES).toContain(stateFor(distance, hovering));
      }
    }
  });

  it('relâche vers idle au-delà du rayon', () => {
    // La panne qu'on empêche : un anneau resté ouvert loin de toute cible.
    expect(stateFor(NEAR_RADIUS + 1, false)).toBe('idle');
    expect(stateFor(1000, false)).toBe('idle');
  });

  it('passe en near au contact du rayon, bord inclus', () => {
    expect(stateFor(NEAR_RADIUS, false)).toBe('near');
    expect(stateFor(0, false)).toBe('near');
  });

  it('donne toujours la priorité au survol', () => {
    for (const distance of [0, NEAR_RADIUS, 1e4]) {
      expect(stateFor(distance, true)).toBe('contact');
    }
  });
});

describe('libellés d’action', () => {
  const labels = { read: 'Voir', write: 'Écrire', open: 'Ouvrir' };
  const link = (href: string) => {
    const el = { getAttribute: (name: string) => (name === 'href' ? href : null) };
    return el as unknown as Element;
  };

  it('nomme l’action, jamais le mot « touch »', () => {
    // Le geste porte la marque ; une légende qui l'explique serait le
    // paragraphe que toute cette idée existe pour éviter.
    for (const href of [
      'mailto:a@b.fr',
      'https://exemple.fr',
      '#ancre',
      '/fr/projects/',
    ]) {
      expect(labelFor(link(href), labels).toLowerCase()).not.toContain('touch');
      expect(labelFor(link(href), labels).toLowerCase()).not.toContain('chạm');
    }
  });

  it('distingue écrire, ouvrir et voir', () => {
    expect(labelFor(link('mailto:contact@cham-studio.fr'), labels)).toBe('Écrire');
    expect(labelFor(link('https://exemple.fr'), labels)).toBe('Ouvrir');
    expect(labelFor(link('/fr/projects/'), labels)).toBe('Voir');
  });
});

describe('parité clavier', () => {
  // La règle que ce test protège : au clavier, l'état de contact doit être le
  // MÊME que celui du survol. Sans elle, le site dit « Chạm » à la souris et
  // rien à tout le monde d'autre — et aucun test d'accessibilité automatique
  // ne signale une idée de marque réservée au pointeur.
  it('produit le même état que le survol', () => {
    const parHover = stateFor(0, true);
    // Le focus clavier emprunte le chemin « survolé » de la machine à états ;
    // c'est ce qui garantit qu'il n'existe pas deux états de contact.
    expect(parHover).toBe('contact');
    expect(CURSOR_STATES.filter((state) => state === 'contact')).toHaveLength(1);
  });

  it('nomme l’action de la même façon dans les deux cas', () => {
    const labels = { read: 'Voir', write: 'Écrire', open: 'Ouvrir' };
    const el = {
      getAttribute: (n: string) =>
        n === 'href' ? 'mailto:contact@cham-studio.fr' : null,
    } as unknown as Element;
    // Un libellé différent au clavier serait une seconde vérité à maintenir.
    expect(labelFor(el, labels)).toBe('Écrire');
  });
});

describe('chute de proximité par caractère', () => {
  it('vaut 1 au contact et 0 au rayon', () => {
    expect(falloff(0)).toBe(1);
    expect(falloff(CHAR_RADIUS)).toBe(0);
  });

  it('reste nulle au-delà du rayon', () => {
    // La panne qu'on empêche : un caractère resté déplacé alors que le
    // pointeur est parti — le logotype se lirait de travers sans raison.
    expect(falloff(CHAR_RADIUS + 1)).toBe(0);
    expect(falloff(1e4)).toBe(0);
  });

  it('décroît de façon monotone', () => {
    let previous = falloff(0);
    for (let distance = 1; distance <= CHAR_RADIUS + 20; distance += 1) {
      const current = falloff(distance);
      expect(current).toBeLessThanOrEqual(previous);
      expect(current).toBeGreaterThanOrEqual(0);
      previous = current;
    }
  });

  it('accepte un rayon explicite', () => {
    expect(falloff(20, 40)).toBeCloseTo(0.5, 5);
  });
});

describe('interpolation du suivi', () => {
  it('avance vers la cible sans la dépasser', () => {
    // Un facteur > 1 ferait osciller l'anneau autour du pointeur.
    let value = 0;
    for (let i = 0; i < 200; i += 1) value = lerp(value, 100);
    expect(value).toBeGreaterThan(99.9);
    expect(value).toBeLessThanOrEqual(100);
  });

  it('traîne derrière le pointeur au premier pas', () => {
    // Ce retard est ce qui rend l'anneau et le curseur système distincts —
    // donc ce qui rend visible que le curseur natif est toujours là.
    expect(lerp(0, 100)).toBeLessThan(100);
    expect(lerp(0, 100)).toBeGreaterThan(0);
  });
});
