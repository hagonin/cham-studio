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
  // Décision 17 : le titre est écrit en deux mots dans chaque locale
  // (« Derrière Chạm » / « Behind Chạm ») — la coupure en deux lignes n'a donc
  // rien à connaître de la langue.
  const [firstWord, ...rest] = about.title.split(' ');

  return (
    <section data-reveal className={styles.block} aria-labelledby="about-title">
      <ContactMarker label={dict.brand.name} />
      <h2 id="about-title" className={styles.title}>
        <span className={styles.titleLine}>{firstWord}</span>
        <span className={styles.titleLine}>{rest.join(' ')}</span>
      </h2>

      {/* IDEA ──●── PRODUCT : le motif du canevas. Il porte les prises du
          scrub (`data-contact-*`) — le seul `data-contact-line` du site, comme
          le veut son sélecteur singulier. Sans JS, il rend son état JOINT. */}
      <figure className={styles.figure} aria-label={about.diagram.label}>
        <div className={styles.line} data-contact-line>
          <span data-contact-end>{about.diagram.idea}</span>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.dot} data-contact-dot aria-hidden="true" />
          <span className={styles.rule} aria-hidden="true" />
          <span data-contact-end>{about.diagram.product}</span>
        </div>
      </figure>

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
