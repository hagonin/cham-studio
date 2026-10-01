'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Le mouvement de la section contact (`contact.js` du prototype), sans rien
 * rendre : `ContactBlock` reste un composant serveur et toute sa copie est dans
 * le HTML servi. Trois gestes :
 *
 * - les lettres du titre descendent à leur place en SUIVANT le défilement
 *   (`scrub`), elles ne se jouent pas une fois pour toutes ;
 * - le formulaire apparaît en fondu ;
 * - la signature du pied de page monte lettre à lettre, lissée sur cinq
 *   secondes. Son départ est calculé sur la hauteur du pied de page lui-même :
 *   un départ fixe la laisserait hors écran sur un écran peu haut. C'est une
 *   FONCTION, que ScrollTrigger relit à chaque recalage.
 *
 * L'année est celle du visiteur, comme le dessin ; le HTML porte celle du build.
 * Sous `prefers-reduced-motion: reduce` aucun mouvement ne s'exécute : tout reste
 * visible, tel que servi.
 */
export function ContactMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-contact]');
    if (!section) return;

    const year = section.querySelector('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());

    const form = section.querySelector('form');
    const footer = section.querySelector<HTMLElement>('footer');

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      for (const line of section.querySelectorAll('[data-title-line]')) {
        gsap.fromTo(
          line.querySelectorAll('[data-letter]'),
          { yPercent: -120 },
          {
            yPercent: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: { each: 0.05, from: 'center' },
            scrollTrigger: {
              trigger: line,
              start: 'top 100%',
              end: 'bottom 30%',
              scrub: true,
            },
          },
        );
      }

      if (form) {
        gsap.fromTo(
          form,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 85%' },
          },
        );
      }

      if (!footer) return;
      const footerStart = () =>
        `top ${Math.max(innerHeight * 0.3, innerHeight - footer.offsetHeight + 160)}px`;
      gsap.fromTo(
        footer.querySelectorAll('[data-signature] [data-letter]'),
        { yPercent: 150 },
        {
          yPercent: 0,
          ease: 'power2.out',
          stagger: { each: 0.03, from: 'center' },
          scrollTrigger: {
            trigger: footer,
            start: footerStart,
            end: 'bottom bottom',
            scrub: 5,
          },
        },
      );
      const spread = footer.querySelector('[data-spread]');
      if (spread) {
        gsap.fromTo(
          spread,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.5,
            scrollTrigger: { trigger: footer, start: footerStart },
          },
        );
      }
      const bottom = footer.querySelector('[data-bottom]');
      if (bottom) {
        gsap.fromTo(
          bottom,
          { opacity: 0 },
          {
            opacity: 1,
            delay: 0.8,
            duration: 1.5,
            scrollTrigger: { trigger: footer, start: footerStart },
          },
        );
      }
    });
    // La police change la hauteur des lignes, donc celle du pied de page.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => media.revert();
  }, []);

  return null;
}
