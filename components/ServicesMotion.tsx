'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealQuiet, revealWords } from '@/lib/motion/reveal';

/**
 * Le mouvement du bloc de prestations (`services.js` du prototype), sans rien
 * rendre : `Process` reste un composant serveur. Deux gestes, les mêmes que
 * « à propos » : le titre monte mot à mot, puis les rangées entrent doucement,
 * déclenchées par la LISTE (`top 85%`) et non chacune par la sienne.
 *
 * Sous `prefers-reduced-motion: reduce` rien ne s'exécute : titre et rangées
 * restent tels que le HTML les a livrés.
 */
export function ServicesMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-services]');
    if (!section) return;
    const heading = section.querySelector('[data-words]');
    const list = section.querySelector('[data-list]');

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (heading) revealWords(heading);
      if (list) revealQuiet(list, 'top 85%');
    });
    // La police change la hauteur des lignes : les positions se recalent.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => media.revert();
  }, []);

  return null;
}
