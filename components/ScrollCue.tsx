'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import styles from './ScrollCue.module.css';

/**
 * L'indicateur de défilement sous le hero : SCROLL, un trait, un point qui
 * descend le trait au fil du défilement.
 *
 * Entièrement DÉCORATIF (`aria-hidden`) : il n'annonce rien qu'un lecteur
 * d'écran ne sache déjà, et sous reduced-motion il reste simplement immobile en
 * haut de son rail — l'état de repos est l'état correct, il n'y a pas de repli
 * à écrire.
 *
 * Le point est scrubbé par UN ScrollTrigger : la position du point est celle du
 * défilement, pas une boucle qui tourne pour elle-même.
 */
export function ScrollCue({ label }: { label: string }) {
  const rail = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = rail.current;
    if (!node || prefersReducedMotion()) return;

    const dot = node.querySelector<HTMLElement>(`.${styles.dot}`);
    if (!dot) return;

    // La course s'arrête un point avant le bas : un point à cheval sur
    // l'extrémité du trait se lit comme un débordement, pas comme une fin.
    const travel = node.offsetHeight - dot.offsetHeight;
    const tween = gsap.fromTo(
      dot,
      { y: 0 },
      {
        y: travel,
        ease: 'none',
        scrollTrigger: { trigger: node, start: 'top 80%', end: '+=60%', scrub: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <span className={styles.cue} aria-hidden="true">
      <span className={styles.label}>{label}</span>
      <span ref={rail} className={styles.rail}>
        <span className={styles.dot} />
      </span>
    </span>
  );
}
