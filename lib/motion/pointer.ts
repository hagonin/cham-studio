import { gsap } from 'gsap';
import { hasFinePointer, prefersReducedMotion } from './prefs';

/**
 * Les primitives du geste de contact, partagées par le hero (phase 03) et la
 * nav (phase 04). Rien ici ne connaît un composant : ce sont des fonctions
 * pures et des fabriques à cible unique, chacune rendant son nettoyage
 * (convention de `magnetic.ts`).
 *
 * `stateFor` (`cursor.ts`) n'est PAS dupliqué : la réaction de proximité par
 * caractère est une seconde MESURE de distance, pas un second état de curseur.
 */

/** Rayon de la réaction par caractère, en pixels. */
export const CHAR_RADIUS = 120;
/** Déplacement et échelle maximaux d'un caractère au contact. Translation et
 *  échelle seulement — pas d'inclinaison ni de `letter-spacing` : un logotype
 *  qui se déforme cesse d'être lisible avant d'être joli. */
export const MAX_CHAR_SHIFT = 6;
export const MAX_CHAR_SCALE = 1.12;
/** Déplacement de la couche de parallaxe la plus profonde, en pixels. */
export const MAX_PARALLAX_SHIFT = 24;
/** Plafond de nœuds d'onde simultanés par hôte : sans lui, un pointeur agité
 *  laisse une fuite DOM que rien ne signale. */
const MAX_RIPPLES = 6;

/**
 * Chute de proximité : 1 au contact, 0 au rayon et au-delà, décroissante.
 * PURE et testée — c'est la seule logique du système de pointeur qui puisse se
 * tromper en silence (un caractère resté déplacé loin du pointeur).
 */
export function falloff(distance: number, radius = CHAR_RADIUS): number {
  if (!(distance > 0)) return 1;
  if (distance >= radius) return 0;
  return 1 - distance / radius;
}

/**
 * Une onde à l'endroit du contact. Un `<span>` créé par `createElement`,
 * jamais par chaîne, animé puis RETIRÉ du DOM dans `onComplete`.
 *
 * `x`/`y` sont des coordonnées écran (celles de `PointerEvent`) : elles sont
 * converties ici, l'appelant n'a pas à connaître la position de l'hôte.
 */
export function ripple(
  host: HTMLElement,
  {
    x,
    y,
    strong = false,
    className,
  }: { x: number; y: number; strong?: boolean; className?: string },
): void {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  if (host.querySelectorAll('[data-ripple]').length >= MAX_RIPPLES) return;

  const box = host.getBoundingClientRect();
  const size = strong ? 72 : 44;
  const node = document.createElement('span');
  node.dataset.ripple = '';
  if (className) node.className = className;
  Object.assign(node.style, {
    position: 'absolute',
    left: `${x - box.left}px`,
    top: `${y - box.top}px`,
    width: `${size}px`,
    height: `${size}px`,
    margin: `${-size / 2}px 0 0 ${-size / 2}px`,
    borderRadius: '50%',
    pointerEvents: 'none',
  });
  host.appendChild(node);

  gsap.fromTo(
    node,
    { scale: 0.2, opacity: strong ? 0.6 : 0.45 },
    {
      scale: 2,
      opacity: 0,
      duration: strong ? 0.8 : 0.6,
      ease: 'power2.out',
      onComplete: () => node.remove(),
    },
  );
}

/**
 * Parallaxe au défilement. UN SEUL ScrollTrigger scrubbé pour toutes les
 * couches : un déclencheur par élément multiplie le coût pour un effet que
 * personne ne distingue.
 *
 * Porte volontairement `prefersReducedMotion()` SEUL, sans `hasFinePointer()`
 * (décision V1 du plan) : la parallaxe au défilement marche au doigt, la priver
 * du tactile serait la perdre sur tablette sans raison.
 *
 * `depth` va de 0 (immobile) à 1 (couche la plus profonde). Toutes les couches
 * partagent le déclencheur de la PREMIÈRE : elles doivent appartenir au même
 * bloc. Deux blocs distincts demandent deux appels.
 */
export function parallax(layers: Array<[HTMLElement, number]>): () => void {
  if (prefersReducedMotion() || layers.length === 0) return () => {};

  const trigger = layers[0][0].parentElement ?? layers[0][0];
  const timeline = gsap.timeline({
    scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: true },
  });

  for (const [element, depth] of layers) {
    timeline.fromTo(
      element,
      { y: 0 },
      { y: depth * MAX_PARALLAX_SHIFT, ease: 'none', duration: 1 },
      0,
    );
  }

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}
