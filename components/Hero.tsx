import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { site } from '@/content/site';
import { HeroContact } from './HeroContact';
import { HeroMotion } from './HeroMotion';
import { LetterLine } from './LetterLine';
import styles from './Hero.module.css';

/**
 * Le hero du dessin, et rien d'autre (`index.html`, `hero-contact.css`,
 * `navigation.css` du prototype) : une ligne de repères, le logotype
 * DESIGN × CODE avec son bouton de contact, le portrait remonté sous les mots,
 * la phrase, son chapeau et son paragraphe, l'adresse de collaboration et
 * l'indicateur de défilement, puis la ligne « À propos ».
 *
 * Composant SERVEUR : toute la copie est dans le HTML servi, et le seul nœud
 * client (`HeroContact`) ne porte que la séquence du bouton. JS coupé,
 * hydratation ratée ou reduced-motion laissent la composition exactement telle
 * qu'elle est peinte.
 *
 * Le logotype n'est PAS le titre de la page : c'est un nom. Le <h1> est la
 * phrase plus bas, qui dit ce que fait ce site — un document dont le titre est
 * une marque n'annonce rien à qui ne la connaît pas. Un seul <h1> par page
 * (`check-html.mjs`), et aucun niveau sauté.
 *
 * Le portrait reste un `next/image` dans le cadre partagé `.frame`, qui verrouille
 * le ratio AVANT le chargement (pas de décalage de mise en page) ; le dessin, lui,
 * utilise un fond CSS. Le recadrage animé de `.frame` est neutralisé ici : le
 * dessin cadre l'image au centre, et l'image ne bouge pas.
 */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { hero } = dict.home;
  const { portrait } = site;
  const [before, after] = dict.brand.positioning.split('×');
  // Le « × » est la charnière du logotype : un dictionnaire qui l'omet casserait
  // `after.trim()` avec un message qui ne dit pas où chercher. Un contenu
  // manquant doit rater fort, pas produire une page à moitié rendue.
  if (after === undefined) {
    throw new Error(
      `dict.brand.positioning doit contenir « × » : "${dict.brand.positioning}"`,
    );
  }
  const [eyebrowLeft, eyebrowRight] = hero.eyebrow;
  const [titleFirst, titleRest] = hero.title;

  return (
    <section className={styles.hero} data-hero>
      <div className={styles.eyebrow}>
        <span>{eyebrowLeft}</span>
        <span className={styles.eyebrowRight}>{eyebrowRight}</span>
      </div>

      <div className={styles.wordmark}>
        <span className={`${styles.word} ${styles.wordLeft}`}>{before.trim()}</span>
        <HeroContact label={hero.contactLabel} />
        <span className={`${styles.word} ${styles.wordRight}`}>{after.trim()}</span>
      </div>

      <div className={styles.portrait}>
        {portrait ? (
          <span className={`${styles.portraitFrame} frame`}>
            <Image
              src={portrait.src}
              alt={portrait.alt[locale]}
              width={portrait.width}
              height={portrait.height}
              sizes="(max-width: 43.75rem) 216px, 262px"
              loading="lazy"
            />
          </span>
        ) : null}
      </div>

      <div className={styles.intro}>
        <h1 className={styles.claim}>
          {titleFirst}
          <br />
          {titleRest}
        </h1>
        <div className={styles.copy}>
          <p className={styles.lead}>{hero.intro.lead}</p>
          <p className={styles.paragraph}>{hero.intro.body}</p>
        </div>
      </div>

      {/* Le bas du hero (décision du 2026-10-02, d'après le site d'Olha
          Lazarieva) : l'adresse de collaboration et l'indicateur à droite, puis
          « À propos » en lettres géantes, qui descendent au défilement. */}
      <div className={styles.outro}>
        <a className={styles.collab} href={`mailto:${site.email}`}>
          <span className={styles.collabLabel}>
            {hero.collab}
            <span className={styles.collabArrow} aria-hidden="true">
              ↗
            </span>
          </span>
          <span className={styles.collabEmail}>{site.email}</span>
        </a>
        <a
          className={styles.scroll}
          href="#touch"
          aria-label={hero.scrollLabel}
          data-scroll-indicator
        >
          <span>{dict.nav.scroll}</span>
          <span className={styles.scrollTrack} aria-hidden="true">
            <i />
          </span>
        </a>
      </div>

      {/* Un lien, pas un titre : la section garde son <h2 id="about-title">,
          et l'ordre des titres de la page ne bouge pas (`check:html`). */}
      <a className={styles.aboutLine} href="#about-title">
        <LetterLine text={dict.nav.about} />
      </a>

      <HeroMotion />
    </section>
  );
}
