'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { startLenis, stopLenis, scrollToAnchor } from '@/lib/motion/lenis';
import { revealOnScroll } from '@/lib/motion/reveal';
import { scrubContactLine } from '@/lib/motion/contactline';
import { magnetic } from '@/lib/motion/magnetic';
import { parallax } from '@/lib/motion/pointer';
import { playPageTransition } from '@/lib/motion/transition';
import { prefersReducedMotion } from '@/lib/motion/prefs';

/**
 * La frontière client du système de mouvement. Elle ne rend RIEN : tout le
 * contenu est déjà dans le HTML serveur, et ce composant ne fait que décider
 * comment il arrive. Un échec de ce script laisse une page ordinaire, lisible.
 *
 * Tous les ScrollTrigger naissent dans un `gsap.context()` révoqué au
 * démontage. Sans cela, chaque navigation client laisse ses déclencheurs
 * derrière elle et le défilement se dégrade à mesure que la session dure.
 */
export function MotionProvider() {
  const pathname = usePathname();
  // La première visite n'est pas une transition : le HTML serveur est déjà là,
  // le rejouer ferait clignoter une page qui était complète.
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const content = document.getElementById('content');
    // Le focus et le défilement sont repris dans tous les cas ; seule la coupe
    // dépend de la préférence de mouvement.
    if (content) playPageTransition(content, !prefersReducedMotion());
  }, [pathname]);

  useEffect(() => {
    // Reduced-motion : ni Lenis, ni ScrollTrigger, ni magnétisme. Les états
    // finaux sont déjà ceux du HTML — il n'y a rien à remettre en place.
    if (prefersReducedMotion()) return;

    // `registerPlugin` vit dans startLenis() : une seule inscription, un seul
    // endroit à corriger si l'ordre d'initialisation change.
    startLenis();

    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
      if (reveals.length > 0) revealOnScroll(reveals);

      const line = document.querySelector<HTMLElement>('[data-contact-line]');
      if (line) scrubContactLine(line);

      for (const cta of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
        cleanups.push(magnetic(cta));
      }

      // Un SEUL appel pour toutes les couches : `parallax()` n'ouvre qu'un
      // ScrollTrigger. La profondeur est déclarée dans le markup
      // (`data-parallax="0.6"`), pas ici — le composant sait ce qui est au fond.
      const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')].map(
        (layer) =>
          [layer, Number(layer.dataset.parallax) || 0] as [HTMLElement, number],
      );
      if (layers.length > 0) cleanups.push(parallax(layers));
    });

    // Lenis avale le comportement natif de `#ancre` : le lien d'évitement et
    // les ancres de section de la nav défileraient sans emmener le focus.
    function onAnchorClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash === '#') return;
      event.preventDefault();
      scrollToAnchor(hash);
      history.replaceState(null, '', hash);
    }
    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      for (const cleanup of cleanups) cleanup();
      context.revert();
      stopLenis();
    };
  }, []);

  return null;
}
