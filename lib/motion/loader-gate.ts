/**
 * Le passage de témoin entre le rideau et la galerie 3D.
 *
 * Le loader n'est plus WebGL : il n'y a plus de course entre deux contextes à
 * arbitrer. Ce qui reste vrai, c'est qu'il est OPAQUE et qu'il vit dans
 * `app/[locale]/layout.tsx`, au-dessus de la page — monter la galerie pendant
 * qu'il couvre l'écran, c'est payer un canvas, ses textures et son
 * `requestAnimationFrame` pour dessiner sous un rideau que personne ne
 * traverse. La galerie attend donc que la voie soit libre, pas qu'un contexte
 * se libère.
 *
 * Le drapeau de session est posé à la DISMISSION du loader, jamais à son
 * montage : quelqu'un qui recharge pendant l'animation le revoit, et la
 * galerie attend de nouveau son tour. Il est aussi posé quand le loader REFUSE
 * de se monter (reduced-motion) : les deux portes ne sont plus la même, et une
 * galerie qui attendrait un événement jamais émis resterait vide.
 */
export const LOADER_SESSION_KEY = 'cham-loader-shown';

/** Émis sur `window` quand le loader libère le canvas. */
export const LOADER_DONE_EVENT = 'cham:loader-done';

/** Le loader a-t-il déjà rendu la main dans cette session ? */
export function canvasIsFree(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(LOADER_SESSION_KEY) !== null;
}
