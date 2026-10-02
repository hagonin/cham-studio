/**
 * Le passage de témoin entre le rideau d'ouverture et ce qui l'attend : la
 * séquence du contact du hero (`HeroContact`), qui jouée plus tôt se déroulerait
 * tout entière derrière lui.
 *
 * Exactement le dessin (`intro-loader.js`) : le rideau rejoue à chaque
 * chargement, sans mémoire de session.
 */
import { prefersReducedMotion } from './prefs';

/** Émis sur `window` quand le loader libère le canvas. */
export const LOADER_DONE_EVENT = 'cham:loader-done';

/**
 * Le rideau va-t-il se jouer ? C'est la porte du dessin (`intro-loader.js`) :
 * pas sous reduced-motion, pas quand l'URL porte un ancre (arriver sur
 * `/#contact` ne doit pas imposer quatre secondes devant la section demandée),
 * pas quand la page est déjà défilée.
 *
 * UN SEUL arbitre, lu par le rideau ET par ce qui l'attend (la séquence du
 * contact dans le hero) : deux copies de la règle divergeraient, et le hero
 * attendrait alors un événement que le rideau, lui, n'a jamais prévu d'émettre.
 */
export function loaderWillPlay(): boolean {
  if (typeof window === 'undefined') return false;
  return !prefersReducedMotion() && !window.location.hash && window.scrollY <= 80;
}

/**
 * Le texte du script inline posé en tout premier dans `<body>` (voir
 * `app/[locale]/layout.tsx`, via `next/script` en stratégie
 * `beforeInteractive`) : lui seul décide, AVANT la première peinture, si le
 * rideau va se jouer, en posant `html[data-intro="playing"]` — l'attribut du
 * dessin. `Loader.tsx` ne refait jamais ce calcul : il se contente de lire cet
 * attribut, sinon les deux pourraient répondre différemment selon l'instant où
 * chacun tourne.
 *
 * Il tourne hors bundle (avant React, avant l'hydratation), donc il répète les
 * mêmes trois conditions que `loaderWillPlay()` plutôt que de l'appeler.
 * `tests/loader-gate.test.ts` vérifie que les deux s'accordent sur le même jeu
 * de scénarios : c'est ce qui tient lieu de garde-fou contre la divergence.
 */
export function loaderGateScript(): string {
  return `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return}catch(e){}if(location.hash||scrollY>80)return;document.documentElement.dataset.intro='playing'})();`;
}
