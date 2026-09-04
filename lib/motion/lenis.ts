import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './prefs';

/**
 * Lenis en singleton. C'est la dépendance la plus RISQUÉE de la phase, pas la
 * plus lourde : elle remplace le défilement natif, donc elle casse les ancres,
 * `scrollIntoView`, la recherche du navigateur, le suivi du focus au clavier et
 * la restauration de position tant que chacun n'est pas repris à la main.
 *
 * Deux instances se battraient pour le même scroll : d'où le singleton.
 */
let instance: Lenis | null = null;
let ticker: ((time: number) => void) | null = null;

export function getLenis(): Lenis | null {
  return instance;
}

export function startLenis(): Lenis | null {
  // Sous reduced-motion, le défilement natif reste en place. Ce n'est pas un
  // Lenis « plus rapide » : c'est pas de Lenis du tout.
  if (prefersReducedMotion()) return null;
  if (instance) return instance;

  gsap.registerPlugin(ScrollTrigger);

  instance = new Lenis({
    // Intensité basse, volontairement : le scroll-jacking appuyé date le site,
    // et personne ne vient pour la sensation de la molette.
    lerp: 0.12,
    // Ni accrochage de section ni distance de molette détournée.
    wheelMultiplier: 1,
    // Le défilement au clavier reste natif : Lenis l'interpole, mais la touche
    // continue de déplacer le focus, ce qui est le point.
    smoothWheel: true,
  });

  // Une seule horloge. Sans ce couplage, les animations liées au défilement
  // dérivent d'une frame par rapport à la position réelle du scroll.
  instance.on('scroll', ScrollTrigger.update);
  ticker = (time: number) => instance?.raf(time * 1000);
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  // La restauration de position du navigateur suppose un scroll natif ; avec
  // Lenis elle atterrit à côté. On la reprend à la main.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  return instance;
}

export function stopLenis(): void {
  if (ticker) gsap.ticker.remove(ticker);
  ticker = null;
  instance?.destroy();
  instance = null;
}

/**
 * Amène une ancre à l'écran EN DÉPLAÇANT AUSSI LE FOCUS. Lenis mange le
 * comportement natif de `#ancre` ; sans cette reprise, le lien d'évitement
 * défile mais laisse le focus derrière, ce qu'aucun test automatique ne voit.
 */
export function scrollToAnchor(hash: string): void {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const focus = () => {
    // `preventScroll` : le focus ne doit pas re-défiler par-dessus Lenis.
    if (target.tabIndex < 0) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  };

  if (instance) instance.scrollTo(target, { onComplete: focus });
  else {
    target.scrollIntoView();
    focus();
  }
}
