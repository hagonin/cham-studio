'use client';

import { useEffect, useRef } from 'react';
import { LOADER_DONE_EVENT, loaderWillPlay } from '@/lib/motion/loader-gate';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import styles from './Hero.module.css';

/**
 * Le bouton de contact du logotype, et la séquence qu'il joue (`hero-contact.js`
 * du prototype) : les deux mots s'approchent, un point orange paraît à leur
 * rencontre puis s'efface, et le × revient. La séquence est en CSS pur
 * (`Hero.module.css`) ; ce composant ne fait qu'AJOUTER un attribut sur le hero
 * pour la lancer, et la rejouer au clic.
 *
 * L'état de repos est l'état final : sans JavaScript, ou sous reduced-motion, le
 * × est là et rien ne bouge — la séquence ne révèle jamais de contenu.
 *
 * Elle attend le rideau d'ouverture. Jouée plus tôt, elle se déroulerait tout
 * entière derrière lui et personne ne la verrait. L'attente passe par
 * `loaderWillPlay()`, le même arbitre que le rideau : si celui-ci ne se joue
 * pas, la séquence part tout de suite plutôt que d'attendre un événement qui ne
 * viendra pas. Une minuterie de repli, un peu au-delà de celle du rideau
 * (6,5 s), garantit qu'aucune attente ne s'éternise.
 */
export function HeroContact({ label }: { label: string }) {
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = button.current?.closest<HTMLElement>('[data-hero]');
    if (!hero) return;

    // Idempotent : l'événement du rideau ET la minuterie de repli peuvent tous
    // deux arriver ; la séquence ne part qu'une fois, et la minuterie tombe dès
    // que l'événement l'a lancée.
    let started = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if (started) return;
      started = true;
      clearTimeout(fallback);
      window.removeEventListener(LOADER_DONE_EVENT, start);
      void document.fonts.ready.then(() => play(hero));
    };

    if (loaderWillPlay()) {
      window.addEventListener(LOADER_DONE_EVENT, start);
      fallback = setTimeout(start, 7000);
    } else {
      start();
    }

    return () => {
      started = true;
      clearTimeout(fallback);
      window.removeEventListener(LOADER_DONE_EVENT, start);
    };
  }, []);

  return (
    <button
      ref={button}
      type="button"
      className={styles.contact}
      aria-label={label}
      onClick={() => {
        const hero = button.current?.closest<HTMLElement>('[data-hero]');
        if (hero) play(hero);
      }}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.cross} aria-hidden="true">
        ×
      </span>
    </button>
  );
}

/** Retire puis repose l'attribut, avec un reflux entre les deux : c'est ce qui
 *  fait repartir l'animation de zéro quand elle est déjà en cours. */
function play(hero: HTMLElement) {
  if (prefersReducedMotion()) return;
  hero.removeAttribute('data-playing');
  void hero.offsetWidth;
  hero.setAttribute('data-playing', 'true');
}
