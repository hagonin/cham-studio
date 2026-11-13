'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { drawRowsOnScroll, revealWords } from '@/lib/motion/reveal';

/**
 * Le mouvement du bloc de prestations, sans rien rendre : `Process` reste un
 * composant serveur. Deux gestes : le titre monte mot à mot (`services.js` du
 * prototype), puis chaque rangée se trace en suivant le défilement — son filet
 * court de gauche à droite, son texte monte avec lui, et remonter la page le
 * rembobine (décision du 2026-10-15, à la place de l'entrée douce du dessin).
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
      if (list) drawRowsOnScroll(list);
    });
    // La police change la hauteur des lignes : les positions se recalent.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => media.revert();
  }, []);

  return null;
}
