/**
 * La logique PURE du carrousel de projets : ni DOM, ni React, ni GSAP. C'est la
 * part qui peut se tromper en silence — un seuil à l'envers fait du carrousel un
 * piège à défilement sur écran tactile, et aucun test d'accessibilité ne le voit.
 * Le rendu, lui, se juge à l'œil et dans un vrai navigateur.
 *
 * Elle reprend `selected-work.js` du prototype, constante pour constante. Le
 * carrousel BOUCLE : après le dernier projet vient le premier.
 */

/** Les seuils du geste, en pixels. */
export const GESTURE = {
  /** Au-delà, un mouvement horizontal prend le geste (et le pointeur). */
  CAPTURE_X: 8,
  /** Au-delà, un mouvement plus vertical qu'horizontal l'abandonne : la page doit
   *  continuer de défiler sous le doigt. */
  CANCEL_Y: 12,
  /** Distance horizontale qui tourne une page au relâchement. */
  TURN_X: 45,
  /** Part du mouvement du doigt que la scène suit pendant le glissé. */
  DRAG_FACTOR: 0.45,
  /** Plafond du suivi, de chaque côté. */
  DRAG_MAX: 180,
} as const;

/** Ramène un rang dans `[0, count)`, en bouclant dans les deux sens. */
export function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

/**
 * L'emplacement d'un panneau : 0 au centre (le projet ouvert), -1 à gauche, 1 à
 * droite. Il se DÉRIVE de l'écart avec le projet ouvert, pas du rang du projet :
 * le dernier de la boucle passe à gauche du premier. Avec plus de trois projets,
 * les suivants prennent 2, 3… — le CSS ne style que -1, 0 et 1 et cache les autres.
 */
export function slotFor(index: number, current: number, count: number): number {
  const offset = (index - current + count) % count;
  return offset === count - 1 ? -1 : offset;
}

export type GestureVerdict = 'pending' | 'horizontal' | 'cancel';

/**
 * Que fait-on d'un mouvement du pointeur depuis son appui ? Une fois le geste pris
 * (`captured`), il reste horizontal jusqu'au relâchement. Avant, la verticale est
 * testée EN PREMIER : un mouvement plus vertical qu'horizontal et de plus de 12px
 * abandonne le geste, même s'il a déjà dépassé 8px de côté.
 */
export function classifyMove(
  dx: number,
  dy: number,
  captured: boolean,
): GestureVerdict {
  if (captured) return 'horizontal';
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > GESTURE.CANCEL_Y) return 'cancel';
  if (Math.abs(dx) > GESTURE.CAPTURE_X) return 'horizontal';
  return 'pending';
}

/** Le décalage que la scène prend pendant un glissé de `dx` pixels. */
export function dragOffset(dx: number): number {
  return Math.max(
    -GESTURE.DRAG_MAX,
    Math.min(GESTURE.DRAG_MAX, dx * GESTURE.DRAG_FACTOR),
  );
}

/** Le pas d'un glissé relâché à `dx` : +1 vers la gauche (on avance, comme une
 *  page qu'on tourne), -1 vers la droite, 0 en deçà du seuil. */
export function swipeStep(dx: number): -1 | 0 | 1 {
  if (Math.abs(dx) <= GESTURE.TURN_X) return 0;
  return dx < 0 ? 1 : -1;
}
