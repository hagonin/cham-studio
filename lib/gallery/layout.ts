/**
 * La géométrie de la galerie, en logique pure : ni Three, ni DOM, ni rAF.
 * C'est la seule partie du morceau 3D qui se vérifie sans navigateur, et
 * c'est celle qui, prise à l'envers, casse la composition — le rendu, lui,
 * se juge à l'œil (même partage que `lib/motion/cursor.ts`).
 *
 * DÉCISION : les emplacements se DÉRIVENT du nombre de projets, ils ne sont
 * pas écrits pour trois. La production en publie deux aujourd'hui
 * (Conversation Copilot attend son visuel) et en publiera trois ensuite ; une
 * composition écrite pour trois se serait affichée de travers entre-temps, et
 * le jour du troisième visuel il aurait fallu re-régler la caméra.
 */

export type Slot = {
  /** Position horizontale, centrée sur 0. */
  x: number;
  /** Profondeur : les écrans de bord reculent, celui du centre reste devant. */
  z: number;
  /** Rotation autour de Y, en radians. Les bords se tournent VERS le centre. */
  rotationY: number;
};

/** Écart horizontal entre deux écrans, en unités de scène. Réglé pour que
 *  TROIS écrans tiennent dans le champ au point le plus proche de la course
 *  caméra : au-delà, les écrans de bord sortent du cadre. */
export const SPACING = 2.5;
/** Rotation maximale d'un écran de bord (~20°, la valeur du canvas). */
export const MAX_TILT = 0.35;
/** Recul maximal d'un écran de bord. */
export const MAX_DEPTH = 0.8;

/**
 * Les emplacements, du plus à gauche au plus à droite, symétriques autour de
 * zéro. Un seul projet ⇒ un écran centré, droit, sans recul : le cas dégénéré
 * doit rester correct, sinon la galerie ne peut pas s'afficher tant que la
 * liste n'est pas complète.
 */
export function slotsFor(count: number): Slot[] {
  if (count <= 0) return [];

  const half = (count - 1) / 2;
  // Sur un seul écran, `half` vaut 0 : diviser par lui donnerait NaN.
  const extent = half === 0 ? 1 : half;

  return Array.from({ length: count }, (_, index) => {
    const offset = index - half; // négatif à gauche, positif à droite
    const ratio = offset / extent; // -1 … 1
    // `+ 0` normalise le zéro négatif : `-Math.abs(0)` vaut `-0`, qui se
    // propagerait jusqu'à Three et ferait échouer toute comparaison stricte
    // sur l'écran du centre.
    return {
      x: offset * SPACING + 0,
      z: -Math.abs(ratio) * MAX_DEPTH + 0,
      // Signe inverse du côté : l'écran de droite se tourne vers la gauche.
      rotationY: -ratio * MAX_TILT + 0,
    };
  });
}

/**
 * L'avancement de la section dans le viewport, 0 avant l'entrée, 1 après la
 * sortie. C'est l'entrée du mouvement : la caméra DÉRIVE du défilement, elle
 * n'est jamais déclenchée par lui — rien ne doit surprendre l'œil (règle
 * reprise du recadrage CSS de `ProjectRow`).
 */
export function scrollProgress(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
): number {
  const travel = viewportHeight + rectHeight;
  if (travel <= 0) return 0;
  const raw = (viewportHeight - rectTop) / travel;
  return Math.min(Math.max(raw, 0), 1);
}
