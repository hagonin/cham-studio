'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealLettersOnScroll } from '@/lib/motion/reveal';

/**
 * Le mouvement du bas du hero, sans rien rendre : `Hero` reste un composant
 * serveur. Deux gestes, liés tous deux à la barre de défilement (ils se
 * rejouent à l'envers quand on remonte) :
 *
 * - la ligne « À propos » descend lettre à lettre, comme le titre contact ;
 * - le cercle de l'indicateur suit le défilement le long de son trait. On écrit
 *   la progression dans `--progress` (0 → 1) plutôt que d'animer `transform`
 *   directement : le survol pousse le cercle avec `translate`, une AUTRE
 *   propriété, et les deux s'additionnent au lieu de s'écraser.
 *
 * Plage du cercle : de l'entrée du lien à l'écran à sa sortie. L'indicateur est
 * sous la ligne de flottaison au chargement (938px sur 900px de haut, mesuré le
 * 2026-10-02) ; une plage calée sur le haut de la page le ferait bouger hors de
 * vue.
 *
 * Sous reduced-motion rien ne s'exécute : les lettres restent à leur place, le
 * cercle en haut du trait.
 */
export function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (!hero) return;
    const scrollLink = hero.querySelector<HTMLElement>('[data-scroll-indicator]');

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      for (const line of hero.querySelectorAll('[data-title-line]'))
        revealLettersOnScroll(line);

      if (!scrollLink) return;
      ScrollTrigger.create({
        trigger: scrollLink,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) =>
          scrollLink.style.setProperty('--progress', self.progress.toFixed(3)),
      });
      return () => scrollLink.style.removeProperty('--progress');
    });
    // La police change la hauteur des lignes : les positions se recalent.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => media.revert();
  }, []);

  return null;
}
