/**
 * Le passage de témoin entre les deux scènes 3D du site.
 *
 * `CanvasHost` promet UN SEUL contexte WebGL à la fois, et cette promesse
 * n'était tenue que par hasard : le loader vit dans `app/[locale]/layout.tsx`,
 * la galerie dans la page, et les deux lisaient `allows3D()` chacun de leur
 * côté. Sur une première visite qualifiante, les deux canvas coexistaient
 * pendant les 2,4 s du loader — deux contextes, exactement ce que l'hôte
 * partagé existe pour éviter, et un risque réel là où la limite de contextes
 * concurrents est basse.
 *
 * Le drapeau de session est posé à la DISMISSION du loader, jamais à son
 * montage : quelqu'un qui recharge pendant l'animation le revoit, et la
 * galerie attend de nouveau son tour.
 */
export const LOADER_SESSION_KEY = 'cham-loader-shown';

/** Émis sur `window` quand le loader libère le canvas. */
export const LOADER_DONE_EVENT = 'cham:loader-done';

/** Le loader a-t-il déjà rendu la main dans cette session ? */
export function canvasIsFree(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(LOADER_SESSION_KEY) !== null;
}
