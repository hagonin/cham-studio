import type { Dictionary } from '@/lib/i18n/getDictionary';
import { site } from '@/content/site';
import styles from './Hero.module.css';

/**
 * Pas d'image : le LCP est le titre, donc il est peint dès la première passe.
 * Le h1 est le seul de la page — la suite descend en h2 puis h3, sans saut.
 *
 * AUCUN `data-reveal` ici, volontairement : le titre est le LCP et ne doit
 * jamais être animé depuis une opacité nulle ni attendre un échange de police
 * pour devenir visible. Seul l'appel à l'action est magnétique.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const { hero } = dict.home;

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>{hero.title}</h1>
      <p className={styles.lead}>{hero.lead}</p>
      <a
        className={`${styles.cta} contact-link`}
        href={`mailto:${site.email}`}
        data-magnetic
      >
        {hero.cta}
      </a>
    </section>
  );
}
