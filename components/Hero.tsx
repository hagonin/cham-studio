import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { site } from '@/content/site';
import { HeroMotion } from './HeroMotion';
import styles from './Hero.module.css';

/**
 * Le mot du logotype, découpé caractère par caractère AU RENDU SERVEUR.
 *
 * Découper après hydratation viderait le HTML servi que
 * `scripts/check-html.mjs` inspecte, et laisserait le logotype sans mouvement
 * possible tant que le JS n'a pas répondu. Les `<span>` restent enfants du
 * MÊME élément : les lecteurs d'écran concatènent les nœuds texte d'un même
 * nœud, donc le nom accessible demeure « DESIGN × CODE » et non une épellation.
 * Si une vérification VoiceOver montre le contraire, le repli est écrit dans la
 * phase 03 (aria-hidden sur les caractères + un unique frère `sr-only`).
 *
 * Le découpage ne sort JAMAIS de ces deux mots : appliqué à de la prose il
 * casserait la césure et l'équilibrage des lignes.
 */
function SplitWord({ word }: { word: string }) {
  return (
    <span className={styles.word}>
      {[...word].map((char, index) => (
        <span key={`${char}-${index}`} data-char className={styles.char}>
          {char}
        </span>
      ))}
    </span>
  );
}

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
 * « × » NOMME le contact, la figure le MONTRE, au même endroit. La couleur de
 * marque n'apparaît que là : le point de la figure au repos, et le « × »
 * uniquement pendant qu'on touche le logotype — --touch ne tient pas le
 * contraste d'un texte au repos.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { hero } = dict.home;
  const [before, after] = dict.brand.positioning.split('×');
  // Le « × » est la charnière du logotype (voir plus haut) : un dictionnaire
  // qui l'omet casserait `after.trim()` avec un message qui ne dit pas où
  // chercher. Un contenu manquant doit rater fort, pas produire une page à
  // moitié rendue (voir CLAUDE.md, « contenu qui ne doit jamais partir »).
  if (after === undefined) {
    throw new Error(
      `dict.brand.positioning doit contenir « × » : "${dict.brand.positioning}"`,
    );
  }

  return (
    <section className={styles.hero}>
      {/* Bandeau de repères : l'identité à gauche, le cadre à droite. Le SENS
          de « Chạm » n'y figure pas — tests/i18n.test.ts vérifie qu'il n'est
          écrit qu'à un seul endroit du site, le bloc « à propos ». Ici, la
          prononciation suffit à poser le mot. */}
      <div className={styles.meta} data-parallax="0.2">
        <span className={styles.metaBlock}>
          <span className={styles.pron}>/tʃam/</span>
        </span>
        <span className={`${styles.metaBlock} ${styles.metaRight}`}>
          {hero.studio}
          <br />
          {site.city[locale]}
        </span>
      </div>

      {/* Le bloc de marque n'est PAS le titre de la page : c'est un logotype.
          Le <h1> est la phrase qui dit ce que fait ce site, plus bas — un
          document dont le titre est un nom de marque n'annonce rien à qui ne
          connaît pas la marque, et docs/positioning.md §2 fait de cette
          phrase le message, pas de « Chạm ».
          Reste un seul <h1> par page (`check-html.mjs`), et aucun niveau
          sauté : les titres de section restent en <h2>. */}
      {/* `data-parallax` porte la PROFONDEUR, pas l'effet : `MotionProvider`
          ramasse toutes les couches marquées et n'ouvre qu'un ScrollTrigger
          pour l'ensemble. Le <h1> n'en porte jamais — il est le LCP, et le
          décaler au défilement le ferait mesurer comme un élément animé. */}
      <p className={styles.title} data-parallax="0.08">
        {/* Zone d'onde : le pointeur laisse un cercle là où il touche le
            logotype. `position: relative` est donc obligatoire ici — les nœuds
            d'onde sont positionnés en absolu par rapport à cette boîte. */}
        <span className={styles.positioning} data-ripple-zone>
          <SplitWord word={before.trim()} />

          {/* Le × est la charnière : c'est le point du loader arrivé à
              destination. `data-state` lui donne --touch au contact seulement
              (voir le module CSS). */}
          <span className={styles.contact} data-hero-contact data-state="idle">
            ×
          </span>
          <SplitWord word={after.trim()} />
        </span>
      </p>

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
        {/* LE titre de la page. Il était en <p> : la phrase qui porte tout le
            positionnement n'entrait alors dans aucun plan du document, ni pour
            un lecteur d'écran ni pour un moteur. */}
        <h1 className={styles.claim}>{hero.title}</h1>
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

      {/* Le seul nœud client du hero, et il ne rend RIEN : il s'attache aux
          nœuds ci-dessus. Sans lui, `Hero` deviendrait un composant client et
          toute cette copie sortirait du HTML servi. Motif de MotionProvider. */}
      <HeroMotion />
    </section>
  );
}
