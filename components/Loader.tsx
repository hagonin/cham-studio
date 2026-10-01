'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  LOADER_DONE_EVENT,
  loaderWillPlay,
  markLoaderShown,
} from '@/lib/motion/loader-gate';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './Loader.module.css';

/**
 * Le rideau d'ouverture du dessin (`intro-loader.js`), séquence pour séquence :
 * deux formes s'approchent, se rejoignent en un point de contact orange, émettent
 * deux ondes, révèlent le mot CHẠM, puis un masque circulaire s'ouvre DEPUIS le
 * point de contact sur la page. Environ 3,9 s.
 *
 * Jamais une porte. Le HTML du hero est déjà complet dans le DOM servi ; ce
 * composant n'ajoute qu'un rideau, monté côté client, qui se retire de lui-même.
 * Une minuterie de 6,5 s le retire même si la séquence est interrompue : « un
 * loader qui peut se bloquer est un site blanc ». Le rideau n'est pas dans le
 * HTML serveur, donc rien ne le met entre un lecteur sans JavaScript et la page.
 *
 * La porte est `loaderWillPlay()` (reduced-motion, ancre dans l'URL, page déjà
 * défilée, une fois par session). Quand elle refuse, le drapeau de session est
 * posé quand même : la galerie attend ce signal, et un rideau qui ne se monte
 * pas ne l'émettra jamais.
 *
 * `immediateRender: false` sur les ondes est PORTEUR : GSAP applique l'état de
 * départ d'un `fromTo` à la construction de la ligne de temps, pas au décalage
 * du tween. Sans lui, les deux ondes se peignent à 0,7 d'opacité dès la
 * première image, bien avant le contact.
 */
export function Loader({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderWillPlay()) {
      // Posé MÊME en refusant : la visite a commencé, le rideau ne doit pas
      // revenir à la page suivante.
      markLoaderShown();
      return;
    }
    setActive(true);
  }, []);

  useEffect(() => {
    const root = overlay.current;
    if (!active || !root) return;

    const one = (name: string) => root.querySelector<HTMLElement>(`.${styles[name]}`)!;
    const parallax = one('parallax');
    const left = one('left');
    const right = one('right');
    const dot = one('dot');
    const ripples = [...root.querySelectorAll<HTMLElement>(`.${styles.ripple}`)];
    const word = one('word');

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(safety);
      removeEventListener('pointermove', onPointer);
      markLoaderShown();
      setActive(false);
      window.dispatchEvent(new CustomEvent(LOADER_DONE_EVENT));
    };

    // Les formes suivent le pointeur d'un peu loin : un décalage lissé, pas
    // une poursuite. Au doigt il n'y a rien à suivre.
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      gsap.to(parallax, {
        x: (event.clientX / innerWidth - 0.5) * 24,
        y: (event.clientY / innerHeight - 0.5) * 18,
        duration: 1.1,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    // Le filet de sécurité : le rideau ne survit jamais à 6,5 s.
    const safety = setTimeout(finish, 6500);
    addEventListener('pointermove', onPointer);

    const travel = Math.min(298, innerWidth * 0.34);
    const timeline = gsap
      .timeline({ onComplete: finish, onInterrupt: finish })
      .set(left, { x: -travel })
      .set(right, { x: travel })
      .to([left, right], { x: 0, duration: 1.65, ease: 'power2.inOut' }, 0.15)
      .to([left, right], { opacity: 0, duration: 0.15 }, 1.8)
      .fromTo(
        dot,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' },
        1.8,
      )
      .fromTo(
        ripples,
        { scale: 0.35, opacity: 0.7 },
        {
          scale: 9,
          opacity: 0,
          duration: 1.2,
          stagger: 0.14,
          ease: 'power2.out',
          immediateRender: false,
        },
        1.85,
      )
      .fromTo(
        word,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        2,
      )
      // La page se révèle À TRAVERS le point de contact : un masque radial, pas
      // un fondu. C'est toute l'idée de la section.
      .to(
        root,
        {
          '--reveal': `${Math.hypot(innerWidth, innerHeight)}px`,
          duration: 1.15,
          ease: 'power3.inOut',
        },
        2.75,
      );

    return () => {
      clearTimeout(safety);
      removeEventListener('pointermove', onPointer);
      timeline.kill();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={overlay} className={styles.overlay} aria-hidden="true">
      <p className={styles.label}>{dict.loader.label}</p>
      <p className={styles.note}>{dict.loader.note}</p>
      <div className={styles.parallax}>
        <div className={styles.stage}>
          <i className={`${styles.form} ${styles.left}`} />
          <i className={`${styles.form} ${styles.right}`} />
          <span className={styles.dot} />
          <span className={styles.ripple} />
          <span className={styles.ripple} />
          <b className={styles.word}>{dict.brand.name.toUpperCase()}</b>
        </div>
      </div>
    </div>
  );
}
