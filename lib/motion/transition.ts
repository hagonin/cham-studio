import { gsap } from 'gsap';
import { getLenis } from './lenis';

/**
 * La transition entre les deux routes. Trois choses, dans cet ordre
 * d'importance — et l'animation est la moins importante des trois :
 *
 * 1. Le FOCUS va au `<h1>` de la nouvelle page. Sans cela, une navigation
 *    client laisse le focus sur le lien cliqué, dans un document qui n'existe
 *    plus : au clavier, la page suivante commence nulle part.
 * 2. Le DÉFILEMENT revient à zéro. Lenis a repris la restauration de position
 *    au navigateur (`scrollRestoration = 'manual'`) ; sans remise à zéro
 *    explicite, la nouvelle page s'ouvre au milieu.
 * 3. Le contenu ARRIVE dans la coupe `contact`. Il n'est jamais révélé par
 *    elle : `immediateRender: false` garantit que l'état de départ n'est écrit
 *    qu'au moment d'animer, donc un script en échec laisse la page entière.
 *
 * Les deux premières ne dépendent PAS de `prefers-reduced-motion` : ce sont des
 * corrections d'accessibilité que Lenis a rendues nécessaires, pas des effets.
 */
export function playPageTransition(content: HTMLElement, animate: boolean): void {
  // Remise à zéro immédiate : une transition de défilement par-dessus une
  // transition de page donnerait deux mouvements pour un seul événement.
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);

  const heading = content.querySelector<HTMLHeadingElement>('h1');
  if (heading) {
    // `tabIndex = -1` : un titre n'est pas focalisable par défaut. `-1` le rend
    // focalisable au script sans l'ajouter à l'ordre de tabulation.
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }

  // `animate` ne commande QUE l'animation. Le focus et la remise à zéro
  // ci-dessus se font dans tous les cas : sous reduced-motion, une personne
  // navigue au clavier exactement comme les autres, et lui retirer la gestion
  // du focus en même temps que le mouvement serait la panne que cette
  // préférence est censée éviter.
  if (!animate) return;

  gsap.fromTo(
    content,
    { clipPath: 'inset(0 0 100% 0)' },
    {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.62,
      ease: 'power4.inOut',
      immediateRender: false,
      // La propriété est nettoyée en fin de course : laissée en place, elle
      // rognerait un menu ou une infobulle qui déborderait plus tard.
      clearProps: 'clipPath',
    },
  );
}
