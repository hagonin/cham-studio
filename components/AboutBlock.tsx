import { ContactMarker } from './ContactMarker';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './AboutBlock.module.css';

/**
 * Pas un CV. La page vend une façon de penser ; un CV vend un parcours — pas
 * d'historique d'emploi, pas de barres de compétences.
 *
 * Placé APRÈS les travaux : la preuve d'abord, la personne ensuite.
 *
 * C'est ici, et nulle part ailleurs, que le sens du mot « Chạm » est écrit.
 * Dans le hero il occuperait la ligne qui doit vendre ; ici il explique un
 * geste que le visiteur a déjà vu à l'œuvre.
 */
export function AboutBlock({ dict }: { dict: Dictionary }) {
  const { about } = dict.work;

  return (
    <section className={styles.block} aria-labelledby="about-title">
      <ContactMarker label={dict.brand.name} />
      <h2 id="about-title" className={styles.title}>
        {about.title}
      </h2>

      {/* Le credo : des affirmations courtes, pas des puces d'agence. */}
      <ul className={styles.creed}>
        {about.creed.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <p className={styles.meaning}>{about.meaning}</p>
      {about.body.map((paragraph) => (
        <p key={paragraph} className={styles.body}>
          {paragraph}
        </p>
      ))}
    </section>
  );
}
