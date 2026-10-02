'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LOADER_DONE_EVENT } from '@/lib/motion/loader-gate';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './Loader.module.css';

/**
 * Le rideau d'ouverture du dessin (`intro-loader.js`), séquence pour séquence :
 * deux formes s'approchent, se rejoignent en un point de contact orange, émettent
 * deux ondes, révèlent le mot CHẠM, puis un masque circulaire s'ouvre DEPUIS le
 * point de contact sur la page. Environ 3,9 s.
 *
 * Jamais une porte. Le HTML du hero est déjà complet dans le DOM servi ; ce
 * composant est toujours dans le HTML servi lui aussi (sinon il apparaîtrait
 * après la première peinture, APRÈS le hero), mais cache l'overlay par défaut
 * en CSS (`Loader.module.css`). Une minuterie de 6,5 s le retire même si la
 * séquence est interrompue : « un loader qui peut se bloquer est un site blanc ».
 *
 * La porte (reduced-motion, ancre dans l'URL, page déjà défilée) est déjà
 * tranchée avant que ce composant ne s'hydrate, par le script inline de
 * `app/[locale]/layout.tsx` (`loaderGateScript()`), qui pose
 * `html[data-intro="playing"]` avant la première peinture. Ce composant ne
 * fait QUE lire cet attribut, jamais `loaderWillPlay()` lui-même : les deux
 * pourraient sinon répondre différemment selon l'instant où chacun tourne.
 * Sans JavaScript, l'attribut n'apparaît jamais, donc l'overlay reste caché.
 *
 * `immediateRender: false` sur les ondes est PORTEUR : GSAP applique l'état de
 * départ d'un `fromTo` à la construction de la ligne de temps, pas au décalage
 * du tween. Sans lui, les deux ondes se peignent à 0,7 d'opacité dès la
 * première image, bien avant le contact.
 */
export function Loader({ dict }: { dict: Dictionary }) {
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = overlay.current;
    if (!root || document.documentElement.dataset.intro !== 'playing') return;

    // Échoue fort plutôt que de renvoyer un `undefined` silencieux : un nom
    // sans classe correspondante dans `Loader.module.css` est un bug de ce
    // composant, pas un cas à tolérer (voir `tests/css-modules.test.ts`).
    const one = (name: string) => {
      const el = root.querySelector<HTMLElement>(`.${styles[name]}`);
      if (!el) throw new Error(`Loader: aucun élément pour "${name}"`);
      return el;
    };
    const parallax = one('parallax');
    // Par ORDRE plutôt que par des noms « left » / « right », absents du CSS
    // module : les deux formes recevaient la même classe `undefined`, et
    // `one()` ne renvoyait que la première pour les deux noms.
    const [left, right] = root.querySelectorAll<HTMLElement>(`.${styles.form}`);
    const dot = one('dot');
    const ripples = [...root.querySelectorAll<HTMLElement>(`.${styles.ripple}`)];
    const word = one('word');

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(safety);
      removeEventListener('pointermove', onPointer);
      // Repose la page sur la porte d'avant-peinture pour la visite suivante.
      delete document.documentElement.dataset.intro;
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
  }, []);

  return (
    <div ref={overlay} className={styles.overlay} aria-hidden="true">
      <p className={styles.label}>{dict.loader.label}</p>
      <p className={styles.note}>{dict.loader.note}</p>
      <div className={styles.parallax}>
        <div className={styles.stage}>
          <i className={styles.form} />
          <i className={styles.form} />
          <span className={styles.dot} />
          <span className={styles.ripple} />
          <span className={styles.ripple} />
          <b className={styles.word}>{dict.brand.name.toUpperCase()}</b>
        </div>
      </div>
    </div>
  );
}
