import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { timeline } from '@/content/about';
import { AboutMotion } from './AboutMotion';
import { MaskedLines } from './MaskedLines';
import styles from './AboutBlock.module.css';

// Le tracé de l'icône des cadres photo, tel que le dessin le définit.
const IMAGE_ICON_PATH =
  'M2.60449 1.20313q-0.50586 0.08545-0.87842 0.43749-0.36914 0.34863-0.50927 0.86475-0.02734 0.08545-0.02735 0.71436l-0.01367 3.78027 0.01367 3.78027q0 0.62891 0.02735 0.71436 0.14014 0.48877 0.46826 0.82031 0.33154 0.32813 0.82031 0.46826 0.08545 0.02734 0.71436 0.02735l3.78027 0.01367 3.78027-0.01367q0.62891 0 0.71436-0.02735 0.48877-0.14014 0.81689-0.46826 0.33154-0.33154 0.47168-0.82031 0.02734-0.08545 0.02735-0.71436l0.01367-3.78027-0.01367-3.78027q0-0.62891-0.02735-0.71436-0.12646-0.48877-0.458-0.81689-0.32813-0.33154-0.80323-0.47168l-0.14013-0.04102-4.32715 0q-4.3374 0-4.4502 0.02734z m8.70899 1.17578q0.2085 0.09912 0.30761 0.30761l0.04102 0.09912 0.01367 4.54932-0.46142-0.44775q-0.46143-0.46143-0.61524-0.56055-0.2666-0.18115-0.5332-0.24951-0.16748-0.04443-0.42041-0.04444-0.25293 0-0.43408 0.04444-0.33496 0.06836-0.64258 0.30762-0.11279 0.08203-2.71729 2.68652l-2.60449 2.60449-0.16748 0q-0.22217 0-0.3418-0.04101-0.11963-0.04443-0.23242-0.14014-0.06836-0.07178-0.12646-0.18115l-0.04102-0.09913 0-8.42871 0.04102-0.09912q0.07178-0.14014 0.18798-0.229 0.11963-0.09229 0.25977-0.11963 0.08545 0 4.22803 0l4.15967 0 0.09912 0.04102z m-6.34375 1.14843q-0.3623 0.05811-0.69385 0.2837-0.32813 0.22217-0.52295 0.52978-0.2666 0.46143-0.24609 0.97412 0.02051 0.50928 0.31445 0.93652 0.29395 0.42725 0.78613 0.62208 0.43408 0.16748 0.89551 0.10595 0.46143-0.06494 0.82373-0.35205 0.36572-0.28711 0.54688-0.71777 0.12646-0.32471 0.12646-0.65967 0-0.33496-0.12646-0.64258-0.18115-0.43408-0.54004-0.72119-0.35547-0.28711-0.8169-0.35889-0.28027-0.04102-0.54687 0z m0.5332 1.20313q0.18115 0.08545 0.2666 0.2666 0.02734 0.05811 0.04102 0.09912 0.01367 0.04102 0.01367 0.15381 0 0.11279-0.01367 0.15381-0.01367 0.04102-0.04102 0.09912-0.09912 0.18115-0.2666 0.28027-0.08545 0.04102-0.25293 0.04102-0.16748 0-0.25293-0.04102-0.16748-0.09912-0.2666-0.28027-0.02734-0.05811-0.04102-0.09912-0.01367-0.04102-0.01367-0.15381 0-0.11279 0.01367-0.15381 0.01367-0.04102 0.04102-0.09912 0.11279-0.22217 0.36572-0.30762 0.04102-0.01367 0.18115-0.00683 0.14014 0.00684 0.22559 0.04785z m4.36816 2.50879q0.08203 0.04102 0.93653 0.90918l0.86816 0.85449-0.01367 2.21142-0.04102 0.09913q-0.14014 0.27685-0.43408 0.33496-0.09912 0.02734-3.19238 0.02734l-3.07959 0 2.17041-2.18408q2.18408-2.18408 2.23877-2.21143 0.11279-0.07178 0.2666-0.07861 0.15381-0.00684 0.28027 0.0376z';

/**
 * Le bloc « à propos » du dessin (`index.html`, `about.css`, `about.js` du
 * prototype) : quatre blocs empilés — l'ouverture, l'origine (photos et
 * chronologie), le présent, l'invitation sur fond sombre.
 *
 * Composant SERVEUR : toute la copie est dans le HTML servi, y compris les
 * titres déjà découpés en mots (`MaskedLines`). `AboutMotion` ne rend rien et
 * n'ajoute que le mouvement.
 *
 * Les trois cadres photo sont des emplacements VOULUS par le dessin, qui garde
 * des cadres plutôt que d'inventer des images. Ils ne portent pas la chaîne
 * `ph-label` que la CI refuse : celle-là garde un autre cas, un emplacement
 * d'image non rempli par oubli. Une vraie photo remplace le contenu du cadre, et
 * rien d'autre ne change.
 *
 * `id="about-title"` est l'ancre de la nav ET ce que `check-html.mjs` cherche
 * pour affirmer que le bloc est dans le HTML servi : ne pas le déplacer.
 * Les années de la chronologie sont des <span>, pas des titres : la section a
 * son <h2>, et un <h3> ici entrerait en concurrence avec les titres de projet.
 */
export function AboutBlock({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { about } = dict.home;

  return (
    <section className={styles.section} aria-labelledby="about-title" data-about>
      <svg className={styles.iconDefs} aria-hidden="true" focusable="false">
        <defs>
          <symbol id="about-image-icon" viewBox="0 0 14 14">
            <path fill="currentColor" d={IMAGE_ICON_PATH} />
          </symbol>
        </defs>
      </svg>

      <div data-block>
        <p className={styles.eyebrow} data-quiet>
          {about.eyebrow[0]}
          <br />
          {about.eyebrow[1]}
        </p>
        <h2
          id="about-title"
          className={styles.heading}
          aria-label={about.title.join(' ')}
          data-words
        >
          <MaskedLines lines={about.title} />
        </h2>
        <div className={styles.lede}>
          <p data-quiet>{about.lede}</p>
        </div>
      </div>

      <div className={styles.origin} data-block>
        <figure className={`${styles.photo} ${styles.photoLead}`} data-quiet>
          <div className={styles.photoFrame} data-size="lead">
            <svg className={styles.photoIcon} aria-hidden="true" focusable="false">
              <use href="#about-image-icon" />
            </svg>
            <span className={styles.photoTag}>{about.photoLead.tag}</span>
          </div>
          <figcaption>{about.photoLead.caption}</figcaption>
        </figure>
        <ol className={styles.timeline}>
          {timeline.map((entry) => (
            <li key={entry.year} className={styles.entry} data-quiet>
              <div className={styles.entryHead}>
                <span className={styles.entryYear}>{entry.year}</span>
                <span className={styles.entryLabel}>{entry.label[locale]}</span>
              </div>
              <p>{entry.body[locale]}</p>
            </li>
          ))}
        </ol>
        <div className={styles.photoPair}>
          {about.photoPair.map((tag) => (
            <figure key={tag} className={styles.photo} data-quiet>
              <div className={styles.photoFrame}>
                <svg className={styles.photoIcon} aria-hidden="true" focusable="false">
                  <use href="#about-image-icon" />
                </svg>
                <span className={styles.photoTag}>{tag}</span>
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className={styles.now} data-block>
        <div className={styles.nowLabel} data-quiet>
          <p className={styles.eyebrow}>{about.now.eyebrow}</p>
          <p className={styles.nowLine}>
            {about.now.line[0]}
            <br />
            {about.now.line[1]}
          </p>
        </div>
        <div className={styles.nowStatement}>
          <p className={styles.nowParagraph} data-quiet>
            {about.now.paragraph}
          </p>
          <p className={styles.nowTooling} data-quiet>
            {about.now.tooling}
          </p>
          <ul className={styles.chips} data-quiet>
            {about.now.chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.invite} data-block>
        <p className={styles.inviteEyebrow} data-quiet>
          {about.invite.eyebrow[0]}
          <br />
          {about.invite.eyebrow[1]}
        </p>
        <div className={styles.inviteStatement}>
          <p
            className={styles.inviteHeadline}
            aria-label={about.invite.headline.join(' ')}
            data-words
          >
            <MaskedLines lines={about.invite.headline} />
          </p>
          <p className={styles.inviteParagraph} data-quiet>
            {about.invite.paragraph}{' '}
            <a href="#contact-title">
              {about.invite.link} <span aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
      </div>

      <AboutMotion />
    </section>
  );
}
