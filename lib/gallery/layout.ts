/**
 * La géométrie de la galerie, en logique pure : ni Three, ni DOM, ni rAF.
 * C'est la seule partie du morceau 3D qui se vérifie sans navigateur, et
 * c'est celle qui, prise à l'envers, casse la composition — le rendu, lui,
 * se juge à l'œil (même partage que `lib/motion/cursor.ts`).
 *
 * DÉCISION : un emplacement se DÉRIVE de l'écart avec la page ouverte, pas
 * du rang du projet. La galerie se feuillette comme un livre : la page ouverte
 * est au centre, droite, et ses voisines s'inclinent vers elle. Le même calcul
 * sert pour deux projets, trois ou dix, et l'écart peut être fractionnaire
 * pendant qu'une page tourne — c'est ce qui rend l'animation continue.
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
 * L'emplacement d'une page à `offset` pages de la page ouverte : 0 au centre,
 * négatif à gauche, positif à droite. Au-delà d'une page d'écart, l'écran
 * continue de s'éloigner sur X mais ne tourne ni ne recule plus : les pages
 * lointaines restent parallèles à leurs voisines au lieu de pivoter hors champ.
 */
export function slotAt(offset: number): Slot {
  const ratio = Math.min(Math.max(offset, -1), 1);
  // `+ 0` normalise le zéro négatif : `-Math.abs(0)` vaut `-0`, qui se
  // propagerait jusqu'à Three et ferait échouer toute comparaison stricte
  // sur la page ouverte.
  return {
    x: offset * SPACING + 0,
    z: -Math.abs(ratio) * MAX_DEPTH + 0,
    // Signe inverse du côté : la page de droite se tourne vers la gauche.
    rotationY: -ratio * MAX_TILT + 0,
  };
}

/** Distance minimale, en pixels, pour qu'un glissé tourne une page. En deçà,
 *  c'est un clic dont la main a bougé, pas un geste. */
export const SWIPE_MIN = 48;

/**
 * La page ouverte après un glissé horizontal de `dx` pixels. Le souris, le
 * doigt et le pavé tactile passent tous par ici : un seul seuil, un seul sens.
 * Vers la gauche (dx < 0) on avance, comme on tourne une page. Aux deux bouts
 * du livre on reste en place — boucler ferait traverser tout l'écran à une
 * page pour revenir au début.
 */
export function pageAfterSwipe(active: number, dx: number, count: number): number {
  if (Math.abs(dx) < SWIPE_MIN) return active;
  return turnPage(active, dx < 0 ? 1 : -1, count);
}

/** Une page vers l'avant (+1) ou vers l'arrière (-1), bornée au livre. Les
 *  boutons du livre passent par ici, le glissé aussi. */
export function turnPage(active: number, step: 1 | -1, count: number): number {
  if (count <= 0) return active;
  return Math.min(Math.max(active + step, 0), count - 1);
}

/** L'identifiant HTML de la ligne d'un projet. `ProjectRow` le pose, le livre
 *  s'en sert pour déplier la bonne ligne : un seul endroit pour le former. */
export function projectRowId(slug: string): string {
  return `project-${slug}`;
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
