/**
 * Le passage de témoin entre le rideau d'ouverture et ce qui l'attend : la
 * séquence du contact du hero (`HeroContact`), qui jouée plus tôt se déroulerait
 * tout entière derrière lui.
 *
 * Le drapeau de session est posé à la DISMISSION du rideau, jamais à son
 * montage : quelqu'un qui recharge pendant l'animation le revoit. Il est aussi
 * posé quand le rideau REFUSE de se jouer (reduced-motion, ancre dans l'URL,
 * page déjà défilée) : l'arrivée est faite, le rideau ne reviendra pas à la page
 * suivante de la même visite.
 */
import { prefersReducedMotion } from './prefs';

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

/**
 * Le rideau va-t-il se jouer ? C'est la porte du dessin (`intro-loader.js`) :
 * pas sous reduced-motion, pas quand l'URL porte un ancre (arriver sur
 * `/#contact` ne doit pas imposer quatre secondes devant la section demandée),
 * pas quand la page est déjà défilée — plus le « une fois par session » du
 * dépôt.
 *
 * UN SEUL arbitre, lu par le rideau ET par ce qui l'attend (la séquence du
 * contact dans le hero) : deux copies de la règle divergeraient, et le hero
 * attendrait alors un événement que le rideau, lui, n'a jamais prévu d'émettre.
 * À lire AVANT que le rideau ne pose son drapeau.
 */
export function loaderWillPlay(): boolean {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion() || window.location.hash || window.scrollY > 80)
    return false;
  return !loaderAlreadyShown();
}
