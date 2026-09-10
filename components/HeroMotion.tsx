'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CHAR_RADIUS,
  MAX_CHAR_SCALE,
  MAX_CHAR_SHIFT,
  falloff,
} from '@/lib/motion/pointer';
import { LOADER_DONE_EVENT } from '@/lib/motion/loader-gate';
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion/prefs';

/**
 * Le mouvement du hero, sans rien rendre. `Hero.tsx` reste un composant
 * SERVEUR : toute la copie est dans le HTML servi, et ce fichier ne fait que
 * décider comment elle bouge. JS coupé, hydratation ratée ou reduced-motion
 * laissent la composition exactement telle qu'elle est peinte.
 *
 * Deux portes, et elles ne sont PAS la même (décision V1 du plan) :
 * - `prefersReducedMotion()` refuse tout, y compris la parallaxe ;
 * - `hasFinePointer()` ne refuse QUE ce qui suit un pointeur — la réaction par
 *   caractère. La parallaxe au défilement marche au doigt ; la gater ici la
 *   perdrait sur tablette sans raison. Elle est d'ailleurs câblée ailleurs,
 *   par `MotionProvider` via `[data-parallax]`, pour ne rester qu'un seul
 *   ScrollTrigger pour toute la page.
 */
export function HeroMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const cleanups: Array<() => void> = [];

    /* --- Continuité loader → × ---------------------------------------------
       OPTIONNELLE PAR CONSTRUCTION. L'événement n'est émis que si le loader
       s'est monté ; sans lui, le × est déjà à sa place. C'est un bonus posé
       sur un état correct, jamais une condition d'affichage. */
    function onLoaderDone(event: Event) {
      const from = (event as CustomEvent<{ x: number; y: number } | null>).detail;
      if (!from) return;

      for (const target of document.querySelectorAll<HTMLElement>('[data-hero-contact]')) {
        const box = target.getBoundingClientRect();
        // `from` et non `to` : l'état au repos reste l'état final, donc un
        // tween qui n'arrive jamais ne laisse rien de travers.
        gsap.from(target, {
          x: from.x - (box.left + box.width / 2),
          y: from.y - (box.top + box.height / 2),
          duration: 0.7,
          ease: 'power3.out',
          immediateRender: false,
        });
      }
    }
    window.addEventListener(LOADER_DONE_EVENT, onLoaderDone, { once: true });
    cleanups.push(() => window.removeEventListener(LOADER_DONE_EVENT, onLoaderDone));

    if (hasFinePointer()) {
      const zone = document.querySelector<HTMLElement>('[data-ripple-zone]');
      const contact = document.querySelector<HTMLElement>('[data-hero-contact]');
      const chars = [...document.querySelectorAll<HTMLElement>('[data-char]')];

      if (zone && chars.length > 0) {
        // Un `quickTo` par caractère et par propriété, créé UNE fois : le
        // recréer à chaque mouvement annulerait tout l'intérêt de quickTo.
        const quick = chars.map((char) => ({
          x: gsap.quickTo(char, 'x', { duration: 0.5, ease: 'power3' }),
          y: gsap.quickTo(char, 'y', { duration: 0.5, ease: 'power3' }),
          scale: gsap.quickTo(char, 'scale', { duration: 0.5, ease: 'power3' }),
        }));

        // Centres en coordonnées DOCUMENT, comme dans ContactCursor : en
        // coordonnées écran il faudrait les relire à chaque défilement, donc à
        // peu près à chaque frame.
        let centers: Array<{ x: number; y: number }> = [];
        function cacheCenters() {
          const { scrollX, scrollY } = window;
          centers = chars.map((char) => {
            const box = char.getBoundingClientRect();
            return {
              x: box.left + box.width / 2 + scrollX,
              y: box.top + box.height / 2 + scrollY,
            };
          });
        }
        cacheCenters();

        function onMove(event: PointerEvent) {
          const px = event.clientX + window.scrollX;
          const py = event.clientY + window.scrollY;
          for (const [index, center] of centers.entries()) {
            const dx = px - center.x;
            const dy = py - center.y;
            const weight = falloff(Math.hypot(dx, dy), CHAR_RADIUS);
            if (weight === 0) {
              quick[index].x(0);
              quick[index].y(0);
              quick[index].scale(1);
              continue;
            }
            // Les caractères vont VERS le pointeur : c'est un contact, pas une
            // répulsion. Translation et échelle seulement — une inclinaison
            // rendrait le logotype illisible avant de le rendre joli.
            const distance = Math.hypot(dx, dy) || 1;
            quick[index].x((dx / distance) * MAX_CHAR_SHIFT * weight);
            quick[index].y((dy / distance) * MAX_CHAR_SHIFT * weight);
            quick[index].scale(1 + (MAX_CHAR_SCALE - 1) * weight);
          }
        }

        function onLeave() {
          for (const target of quick) {
            target.x(0);
            target.y(0);
            target.scale(1);
          }
          contact?.setAttribute('data-state', 'idle');
        }
        function onEnter() {
          contact?.setAttribute('data-state', 'contact');
        }

        zone.addEventListener('pointermove', onMove);
        zone.addEventListener('pointerenter', onEnter);
        zone.addEventListener('pointerleave', onLeave);
        addEventListener('resize', cacheCenters);
        ScrollTrigger.addEventListener('refresh', cacheCenters);

        cleanups.push(() => {
          zone.removeEventListener('pointermove', onMove);
          zone.removeEventListener('pointerenter', onEnter);
          zone.removeEventListener('pointerleave', onLeave);
          removeEventListener('resize', cacheCenters);
          ScrollTrigger.removeEventListener('refresh', cacheCenters);
          onLeave();
        });
      }
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
