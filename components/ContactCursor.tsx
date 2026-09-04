'use client';

import { useEffect, useRef, useState } from 'react';
import {
  INTERACTIVE,
  distanceToRect,
  labelFor,
  lerp,
  stateFor,
  type CursorState,
} from '@/lib/motion/cursor';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion/prefs';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './ContactCursor.module.css';

/**
 * L'anneau de contact. Il AUGMENTE le curseur système, il ne le remplace pas :
 * `cursor: none` est interdit dans tout le projet et vérifié en CI.
 *
 * Ne se monte que sur pointeur fin et hors reduced-motion. Sur tout le reste,
 * l'idée de contact vit déjà dans le marqueur CSS de la Phase 2 et dans l'état
 * `.contact-link` — c'est pour cela que ceux-là sont partis les premiers.
 *
 * Un seul élément, `position: fixed`, déplacé par `translate3d` dans une boucle
 * rAF interpolée. Aucun état React par mouvement de souris : le curseur ne
 * re-rend jamais l'arbre.
 */
export function ContactCursor({ dict }: { dict: Dictionary }) {
  const [mounted, setMounted] = useState(false);
  const ring = useRef<HTMLDivElement>(null);
  const labelNode = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const node = ring.current;
    const labelEl = labelNode.current;
    if (!node || !labelEl) return;

    const labels = dict.motion.cursor;
    const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
    const drawn = { ...pointer };
    let state: CursorState = 'idle';
    let hovered: Element | null = null;
    let focused: Element | null = null;

    // Les rectangles sont CACHÉS, en coordonnées DOCUMENT (rect + scroll) et
    // non écran. Stockés en coordonnées écran, il faudrait les recalculer à
    // chaque défilement — soit à peu près à chaque frame, ce qui ferait de ce
    // curseur décoratif le pire coût de script du site. En coordonnées
    // document ils ne bougent qu'au redimensionnement.
    let rects: Array<{ el: Element; rect: DOMRect }> = [];
    function cacheRects() {
      const { scrollX, scrollY } = window;
      rects = [...document.querySelectorAll(INTERACTIVE)].map((el) => {
        const box = el.getBoundingClientRect();
        return {
          el,
          rect: new DOMRect(box.x + scrollX, box.y + scrollY, box.width, box.height),
        };
      });
    }
    cacheRects();

    function setState(next: CursorState) {
      if (next === state) return;
      state = next;
      node!.dataset.state = next;
    }

    // Un seul `pointermove` délégué, contre les rectangles en cache.
    function onMove(event: PointerEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      // Le pointeur passe en coordonnées document pour rencontrer le cache.
      const px = event.clientX + window.scrollX;
      const py = event.clientY + window.scrollY;
      let nearest = Number.POSITIVE_INFINITY;
      for (const { rect } of rects) {
        nearest = Math.min(nearest, distanceToRect(px, py, rect));
      }

      const over = (event.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      hovered = over;
      // Un élément focalisé au clavier garde la main : bouger la souris ne doit
      // pas éteindre le point rempli que le contour de focus annonce encore.
      if (focused && !over) return;
      setState(stateFor(nearest, Boolean(over)));
      labelEl!.textContent = over ? labelFor(over, labels) : '';
    }

    function onDown() {
      if (hovered) setState('release');
    }
    function onUp() {
      setState(hovered ? 'contact' : 'idle');
    }

    /**
     * PARITÉ CLAVIER — pas une option. Sans elle, le site dit « Chạm » à la
     * souris et rien à tout le monde d'autre : l'idée de marque deviendrait
     * réservée au pointeur.
     *
     * `:focus-visible` et non `:focus` : un clic donne aussi le focus, et
     * l'anneau sauterait alors sur l'élément cliqué au lieu de suivre le
     * pointeur. On ne réagit qu'au focus que le navigateur juge visible,
     * c'est-à-dire au clavier.
     */
    function onFocusIn(event: FocusEvent) {
      const target = (event.target as Element | null)?.closest?.(INTERACTIVE);
      if (!target || !target.matches(':focus-visible')) return;

      // L'anneau se pose sur l'élément focalisé : le point rempli apparaît là
      // où le contour de focus l'annonce, jamais ailleurs.
      const box = target.getBoundingClientRect();
      pointer.x = box.left + box.width / 2;
      pointer.y = box.top + box.height / 2;
      focused = target;
      setState('contact');
      labelEl!.textContent = labelFor(target, labels);
    }

    function onFocusOut() {
      focused = null;
      if (!hovered) {
        setState('idle');
        labelEl!.textContent = '';
      }
    }

    let frame = 0;
    function tick() {
      drawn.x = lerp(drawn.x, pointer.x);
      drawn.y = lerp(drawn.y, pointer.y);
      node!.style.transform = `translate3d(${drawn.x}px, ${drawn.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    // Invalidé au redimensionnement et au refresh de ScrollTrigger, comme
    // prévu — pas au défilement : les rectangles sont en coordonnées document.
    addEventListener('resize', cacheRects);
    ScrollTrigger.addEventListener('refresh', cacheRects);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      removeEventListener('resize', cacheRects);
      ScrollTrigger.removeEventListener('refresh', cacheRects);
    };
  }, [mounted, dict]);

  if (!mounted) return null;

  return (
    <div ref={ring} className={styles.ring} data-state="idle" aria-hidden="true">
      {/* Deux couches : `ring` porte la POSITION (translate3d, réécrit à
          chaque frame), `face` porte l'ÉTAT (échelle, couleur). Séparées,
          l'une n'écrase pas l'autre. */}
      <span className={styles.face}>
        <span ref={labelNode} className={styles.label} />
      </span>
    </div>
  );
}
