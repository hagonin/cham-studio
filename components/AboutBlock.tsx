import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import Image from 'next/image';
import { photos, timeline, type AboutPhoto } from '@/content/about';
import { AboutMotion } from './AboutMotion';
import { MaskedLines } from './MaskedLines';
import styles from './AboutBlock.module.css';

/**
 * Le bloc « à propos » du dessin (`index.html`, `about.css`, `about.js` du
 * prototype) : quatre blocs empilés — l'ouverture, l'origine (photos et
 * chronologie), le présent, l'invitation sur fond sombre.
 *
 * Composant SERVEUR : toute la copie est dans le HTML servi, y compris les
 * titres déjà découpés en mots (`MaskedLines`). `AboutMotion` ne rend rien et
 * n'ajoute que le mouvement.
 *
 * Les trois cadres photo gardent la hauteur et le contour du dessin ; la photo
 * (`content/about.ts`) les remplit en `object-fit: cover`, avec un point focal
 * par image pour que le visage reste visible quand le cadre change de forme.
 *
 * `id="about-title"` est l'ancre de la nav ET ce que `check-html.mjs` cherche
 * pour affirmer que le bloc est dans le HTML servi : ne pas le déplacer.
 * Les années de la chronologie sont des <span>, pas des titres : la section a
 * son <h2>, et un <h3> ici entrerait en concurrence avec les titres de projet.
 */
function Photo({
  photo,
  locale,
  sizes,
}: {
  photo: AboutPhoto;
  locale: Locale;
  sizes: string;
}) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt[locale]}
      fill
      sizes={sizes}
      className={styles.photoImage}
      style={{ objectPosition: photo.position }}
    />
  );
}

export function AboutBlock({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { about } = dict.home;

  return (
    <section className={styles.section} aria-labelledby="about-title" data-about>
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
            <Photo
              photo={photos.lead}
              locale={locale}
              sizes="(max-width: 56.25rem) 100vw, 46vw"
            />
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
          {photos.pair.map((photo) => (
            <figure key={photo.src} className={styles.photo} data-quiet>
              <div className={styles.photoFrame}>
                <Photo
                  photo={photo}
                  locale={locale}
                  sizes="(max-width: 32.5rem) 100vw, 23vw"
                />
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
          <p className={styles.nowDetail} data-quiet>
            {about.now.design}
          </p>
          <p className={styles.nowDetail} data-quiet>
            {about.now.tooling}
          </p>
        </div>
      </div>

      <div className={styles.invite} data-block>
        <p className={styles.inviteEyebrow} data-quiet>
          {about.invite.eyebrow[0]}
          <br />
          {about.invite.eyebrow[1]}
        </p>
        <div className={styles.inviteStatement}>
          {/* Un <p> ne peut pas porter `aria-label` (ARIA interdit de nommer un
              paragraphe) et ses mots sont en `aria-hidden` : sans texte réel, la
              phrase serait muette pour un lecteur d'écran. Le dessin fait ce
              choix ; ici le texte entier est posé en clair, hors écran. */}
          <p className={styles.inviteHeadline} data-words>
            <span className={styles.srOnly}>{about.invite.headline.join(' ')}</span>
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
