/**
 * Le curseur de contact. Quatre états, un seul élément, un seul attribut
 * `data-state`.
 *
 * `cursor: none` est INTERDIT — masquer le curseur système écrase les réglages
 * de taille et de contraste dont dépendent des personnes malvoyantes ou à
 * mobilité réduite, et aucun test automatique ne voit la perte. L'anneau suit
 * le vrai pointeur ; le curseur de l'OS reste au-dessus.
 */

export const CURSOR_STATES = ['idle', 'near', 'contact', 'release'] as const;
export type CursorState = (typeof CURSOR_STATES)[number];

/** Rayon de vigilance autour d'un élément actionnable, en pixels. */
export const NEAR_RADIUS = 80;

/** Sélecteur unique des cibles : ce qui est actionnable, rien d'autre. */
export const INTERACTIVE = 'a[href], button:not([disabled]), input, [role="button"]';

export type Target = { rect: DOMRect; label: string };

/**
 * Décide l'état à partir de la distance. Fonction PURE et exportée pour être
 * testée : c'est la seule logique du curseur qui puisse se tromper en silence,
 * et un `near` qui ne relâche jamais laisse un anneau ouvert au milieu de rien.
 */
export function stateFor(distance: number, hovering: boolean): CursorState {
  if (hovering) return 'contact';
  return distance <= NEAR_RADIUS ? 'near' : 'idle';
}

/** Distance du point au rectangle, 0 à l'intérieur. Le carré n'est pas
 *  utilisé : la comparaison se fait contre un rayon en pixels, lisible. */
export function distanceToRect(x: number, y: number, rect: DOMRect): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

/**
 * Le libellé nomme l'ACTION dans la langue de la page — VOIR, ÉCRIRE, OUVRIR —
 * jamais le mot anglais « touch ». C'est le geste qui porte la marque ; une
 * légende qui l'explique serait précisément le paragraphe que toute cette idée
 * existe pour éviter.
 */
export function labelFor(
  element: Element,
  labels: { read: string; write: string; open: string },
): string {
  const href = element.getAttribute('href') ?? '';
  if (href.startsWith('mailto:')) return labels.write;
  if (href.startsWith('http')) return labels.open;
  return labels.read;
}

/** Interpolation du suivi. Assez bas pour que l'anneau traîne visiblement
 *  derrière le pointeur système — c'est ce décalage qui rend les deux
 *  distincts, donc qui rend évident que le curseur natif est toujours là. */
export const LERP = 0.18;

export function lerp(from: number, to: number, amount = LERP): number {
  return from + (to - from) * amount;
}
