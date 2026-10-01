'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealQuiet, revealWords } from '@/lib/motion/reveal';

/**
 * Le mouvement du bloc « à propos » (`about.js` du prototype), sans rien
 * rendre : `AboutBlock` reste un composant serveur et toute sa copie est dans
 * le HTML servi. Deux gestes seulement : les titres montent mot à mot, le reste
 * entre doucement, bloc par bloc.
 *
 * `matchMedia` : sous `prefers-reduced-motion: reduce` rien ne s'exécute, et
 * les quatre blocs restent pleinement visibles, sans transformation. Il
 * révoque aussi les déclencheurs au démontage.
 */
export function AboutMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-about]');
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      for (const heading of section.querySelectorAll('[data-words]'))
        revealWords(heading);
      for (const block of section.querySelectorAll('[data-block]')) revealQuiet(block);
    });
    // La police change la hauteur des lignes : les positions se recalent.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => media.revert();
  }, []);

  return null;
}
