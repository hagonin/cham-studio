'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import { LOADER_DONE_EVENT, LOADER_SESSION_KEY } from '@/lib/motion/loader-gate';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './Loader.module.css';

const ARRIVE_MS = 1500;
const DISMISS_MS = 1800;

/**
 * Le rideau de contact avant le hero, jamais une porte. Le HTML du hero est
 * déjà complet dans le DOM servi — ce composant ne fait qu'ajouter un rideau
 * qui se retire de lui-même, y compris si GSAP échoue : la dismission est un
 * `setTimeout`, elle ne dépend d'aucun callback d'animation (« un loader qui
 * peut se bloquer est un site blanc »).
 *
 * DOM et non WebGL (R2) : la séquence — deux cercles qui convergent, un point
 * plein, des ondes — tient en six nœuds transformés. Plus de coût de montage
 * d'un contexte 3D à couvrir, d'où un refus réduit à la seule raison qui reste
 * valable, `prefers-reduced-motion`. Le seuil des 1024 px de `allows3D()` visait
 * ce coût-là : il ne s'applique plus ici.
 *
 * Session-once : le drapeau se pose à la DISMISSION, pas au montage — une
 * personne qui quitte pendant l'animation la reverra à son retour.
 */
export function Loader({ dict }: { dict: Dictionary }) {
  const [phase, setPhase] = useState<'hidden' | 'active' | 'leaving'>('hidden');
  const overlay = useRef<HTMLDivElement>(null);
  const point = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Le drapeau se pose MÊME en refusant : `Gallery3DSlot` attend cet
      // événement dès qu'il n'est pas encore posé, et sa propre porte n'est
      // plus la même que la nôtre. Sans cette ligne, une machine que
      // `allows3D()` accepterait resterait à attendre un loader jamais monté.
      sessionStorage.setItem(LOADER_SESSION_KEY, '1');
      return;
    }
    if (sessionStorage.getItem(LOADER_SESSION_KEY)) return;

    setPhase('active');
    const arrive = setTimeout(() => setPhase('leaving'), ARRIVE_MS);
    const dismiss = setTimeout(() => {
      // Position du contact AVANT de démonter : la phase 03 prolonge ce point
      // vers le × du logotype, et le nœud n'existe plus une frame plus tard.
      const box = point.current?.getBoundingClientRect();
      sessionStorage.setItem(LOADER_SESSION_KEY, '1');
      setPhase('hidden');
      // La galerie attend ce signal pour peindre : rien à dessiner sous un
      // rideau opaque, et son canvas coûte plus cher que la séquence.
      window.dispatchEvent(
        new CustomEvent(LOADER_DONE_EVENT, {
          detail: box
            ? { x: box.left + box.width / 2, y: box.top + box.height / 2 }
            : null,
        }),
      );
    }, DISMISS_MS);

    return () => {
      clearTimeout(arrive);
      clearTimeout(dismiss);
    };
  }, []);

  // Le rideau est monté (`active` ou `leaving`) : la séquence, elle, ne se joue
  // qu'une fois. Dépendre de `phase` relancerait cet effet au passage en
  // `leaving` et la révocation replacerait les cercles à leur point de départ,
  // en pleine ouverture du rideau.
  const mounted = phase !== 'hidden';

  useEffect(() => {
    const root = overlay.current;
    if (!mounted || !root) return;

    const q = (name: string) => Array.from(root.querySelectorAll(`.${name}`));
    const timeline = gsap
      .timeline()
      // Les deux cercles arrivent des bords du cadre. `x` seul : aucune
      // recomposition de mise en page par frame.
      .fromTo(
        q(styles.dot),
        { x: (i: number) => (i === 0 ? '-22vw' : '22vw') },
        { x: 0, duration: 1, ease: 'power3.out' },
        0,
      )
      // Ils s'effacent au profit du point unique : le contact remplace les deux
      // termes, il ne s'y ajoute pas.
      .to(q(styles.dot), { scale: 0, opacity: 0, duration: 0.15 }, 1)
      .to(q(styles.point), { scale: 1, duration: 0.25, ease: 'expo.out' }, 1)
      // Les ondes reprennent la courbe de l'ancienne scène 3D
      // (scale 0,2 → 2 ; opacité 0,45 → 0), décalées pour lire comme un écho.
      .fromTo(
        q(styles.ring),
        { scale: 0.2, opacity: 0.45 },
        { scale: 2, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12 },
        1,
      )
      .to(q(styles.mark), { opacity: 1, duration: 0.3, ease: 'power3.out' }, 1.05);

    return () => {
      timeline.kill();
    };
  }, [mounted]);

  if (phase === 'hidden') return null;

  return (
    <div
      ref={overlay}
      className={`${styles.overlay} ${phase === 'leaving' ? styles.leaving : ''}`}
      aria-hidden="true"
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span ref={point} className={styles.point} />
      <span className={styles.ring} />
      <span className={styles.ring} />
      <span className={styles.ring} />
      <span className={styles.mark}>{dict.brand.name}</span>
    </div>
  );
}
