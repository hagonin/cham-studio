'use client';

import { useEffect, useState } from 'react';
import { scrollToAnchor } from '@/lib/motion/lenis';
import styles from './ScrollTopButton.module.css';

/**
 * Remonte à `#content`, la cible du lien d'évitement (`layout.tsx`) : même
 * fonction testée que les ancres de nav, donc le focus suit le défilement au
 * lieu de rester perdu en bas de page.
 *
 * Apparaît après un écran de défilement — avant ça, remonter n'a rien à faire.
 */
export function ScrollTopButton({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={visible}
      aria-label={label}
      onClick={() => scrollToAnchor('#content')}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
