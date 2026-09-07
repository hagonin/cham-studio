import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { site } from '@/content/site';
import styles from './Hero.module.css';

/**
 * Pas d'image porteuse : le LCP est le titre, donc il est peint dès la première
 * passe. Le h1 est le seul de la page — la suite descend en h2 puis h3, sans
 * saut.
 *
 * AUCUN `data-reveal` ici, volontairement : le titre est le LCP et ne doit
 * jamais être animé depuis une opacité nulle ni attendre un échange de police
 * pour devenir visible. Seul l'appel à l'action est magnétique.
 *
 * La composition tient les deux mots aux bords et pose la figure entre eux : le
 * « × » NOMME le contact, la figure le MONTRE, au même endroit. C'est aussi la
 * seule occurrence de la couleur de marque dans ce bloc.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { hero } = dict.home;
  const [before, after] = dict.brand.positioning.split('×');

  return (
    <section className={styles.hero}>
      {/* Bandeau de repères : l'identité à gauche, le cadre à droite. Le SENS
          de « Chạm » n'y figure pas — tests/i18n.test.ts vérifie qu'il n'est
          écrit qu'à un seul endroit du site, le bloc « à propos ». Ici, la
          prononciation suffit à poser le mot. */}
      <div className={styles.meta}>
        <span className={styles.metaBlock}>
          <span className={styles.pron}>/tʃam/</span>
        </span>
        <span className={`${styles.metaBlock} ${styles.metaRight}`}>
          {hero.studio}
          <br />
          {site.city[locale]}
        </span>
      </div>

      {/* UN SEUL <h1> : `check-html.mjs` en exige exactement un par page. Le nom
          et la position tiennent donc dans le même titre, le second en
          <span> — deux <h1> feraient échouer le gate, et un <h2> pour
          « Design × Code » sauterait un niveau avant les titres de section. */}
      <h1 className={styles.title}>
        <span className={styles.name}>{dict.brand.name}</span>

        <span className={styles.positioning}>
          <span className={styles.word}>{before.trim()}</span>

          {/* Décoratif, donc `aria-hidden` : le nom accessible reste
            « Design × Code ». Deux champs qui se recouvrent et se touchent en
            un point — pas un portrait : `content/site.ts` interdit un visage
            au-dessus de la ligne de flottaison (LCP) et `site.portrait` vaut
            `null` tant que la photo n'existe pas. SVG inline : rien à charger,
            donc rien qui retarde le texte ni décale la mise en page. */}
          <span className={styles.figure} aria-hidden="true">
            <svg viewBox="0 0 230 230" role="presentation" focusable="false">
              <circle cx="86" cy="115" r="62" className={styles.ring} />
              <circle cx="144" cy="115" r="62" className={styles.ring} />
              <circle cx="86" cy="115" r="44" className={styles.ringFaint} />
              <circle cx="144" cy="115" r="44" className={styles.ringFaint} />
              <circle cx="115" cy="115" r="5" className={styles.point} />
            </svg>
            <span className={styles.figureLabel}>{hero.figureLabel}</span>
          </span>

          <span className={styles.contact}>×</span>
          <span className={styles.word}>{after.trim()}</span>
        </span>
      </h1>

      {/* Le périmètre, en une ligne de filets sous le titre. Ni niveau, ni
          pourcentage, ni logo : ce que la liste annonce, les projets le
          prouvent. */}
      <ul className={styles.scope}>
        {hero.expertise.map((item) => (
          <li key={item} className={styles.scopeItem}>
            {item}
          </li>
        ))}
      </ul>

      <div className={styles.statement}>
        <p className={styles.claim}>{hero.title}</p>
        {/* DÉCISION 19. Le titre au-dessus n'a pas de première personne : cette
            ligne est le SEUL endroit du hero où quelqu'un apparaît. Elle n'est
            pas de l'accompagnement — sans elle le bloc énonce une portée que
            personne n'assume, la voix passive que docs/positioning.md §6
            interdit. Dernière ligne à couper si le hero doit être resserré. */}
        <p className={styles.lead}>{hero.lead}</p>
        <p className={styles.tagline}>{hero.tagline}</p>
        <a
          className={`${styles.cta} contact-link`}
          href={`mailto:${site.email}`}
          data-magnetic
        >
          {hero.cta}
        </a>
      </div>
    </section>
  );
}
