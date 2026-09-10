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

/**
 * `sessionStorage` lève une `SecurityError` en navigation privée stricte ou
 * derrière certaines politiques d'iframe. Une lecture qui échoue redevient
 * « pas encore vu » (le rideau rejoue, sans casser la page) ; une écriture
 * qui échoue est ignorée (on perd juste le « une fois par session »).
 */
export function loaderAlreadyShown(): boolean {
  try {
    return sessionStorage.getItem(LOADER_SESSION_KEY) !== null;
  } catch {
    return false;
  }
}

export function markLoaderShown(): void {
  try {
    sessionStorage.setItem(LOADER_SESSION_KEY, '1');
  } catch {
    // Session non persistée : rien à faire de plus, voir la note ci-dessus.
  }
}

/** Le loader a-t-il déjà rendu la main dans cette session ? */
export function canvasIsFree(): boolean {
  if (typeof window === 'undefined') return false;
  return loaderAlreadyShown();
}
