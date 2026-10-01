import { Fragment } from 'react';
import { site } from '@/content/site';
import { MOUNTED_SECTIONS } from '@/lib/sections';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import { ContactForm } from './ContactForm';
import { ContactMotion } from './ContactMotion';
import styles from './ContactBlock.module.css';

// L'ordre du pied de page est celui du dessin (à propos, services, travaux),
// pas celui de la barre. « travaux » n'y figure que si la section est montée.
const FOOTER_PAGES = ['about', 'services', 'work'] as const;

/**
 * Une ligne du titre, lettre par lettre, rendue côté SERVEUR (`contact.js` du
 * prototype les découpe en JS). Les lettres sont en `aria-hidden` et le vrai
 * texte est posé hors écran : `aria-label` n'est pas permis sur un `<span>`, et
 * des lettres isolées ne doivent pas arriver aux lecteurs d'écran en fragments.
 * Les lettres d'un mot restent groupées (`.word`, sans coupure) : une ligne ne
 * se brise qu'entre deux mots.
 */
function TitleLine({ text }: { text: string }) {
  return (
    <span className={styles.reveal} data-title-line>
      <span className={styles.srOnly}>{text}</span>
      {text.split(' ').map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? ' ' : null}
          <span className={styles.word}>
            {[...word].map((char, position) => (
              <span
                key={position}
                className={styles.letter}
                data-letter
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * La section contact et le pied de page du dessin (`index.html`, `contact.css`,
 * `contact.js` du prototype) : le titre en trois temps, le formulaire, puis le
 * pied de page — adresse, liens, signature géante.
 *
 * Composant SERVEUR : toute la copie est dans le HTML servi. `ContactForm`
 * (client) fait le brouillon `mailto:` ; `ContactMotion` (client, ne rend rien)
 * n'ajoute que le mouvement et l'année du visiteur.
 *
 * Le pied de page du dessin est DANS la section. Le pied de page de la mise en
 * page (le lieu et l'heure locale, `app/[locale]/layout.tsx`) vient après elle :
 * le dessin n'en a pas, le propriétaire l'a gardé.
 *
 * `id="contact-title"` est l'ancre de la nav (`lib/sections.ts`) : ne pas le
 * déplacer. L'accroche (`eyebrow`) est un `<p>` dont le texte est écrit en
 * capitales : la garde `check:html` refuse une capitale posée par le CSS sur un
 * `<p>`, pas du texte déjà en capitales.
 */
export function ContactBlock({ dict }: { dict: Dictionary }) {
  const { contact } = dict.home;
  const { footer } = contact;
  const pages = FOOTER_PAGES.filter((key) => MOUNTED_SECTIONS.includes(key));

  return (
    <section className={styles.section} aria-labelledby="contact-title" data-contact>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>{contact.eyebrow}</p>
        <h2 id="contact-title" className={styles.title}>
          <TitleLine text={contact.title.first} />
          <span className={styles.bridge}>{contact.title.bridge}</span>
          <TitleLine text={contact.title.second} />
        </h2>
      </div>

      <ContactForm copy={contact.form} email={site.email} />

      <footer className={styles.footer} data-footer>
        <div className={styles.direct}>
          <p>{footer.direct}</p>
          <a href={`mailto:${site.email}`}>
            {site.email} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className={styles.middle}>
          <nav className={styles.pages} aria-label={footer.navLabel}>
            {pages.map((key) => (
              <a key={key} href={`#${key}-title`}>
                {dict.nav[key]}
              </a>
            ))}
          </nav>
          <p>
            {footer.tagline[0]}
            <br />
            {footer.tagline[1]}
            <br />
            {footer.tagline[2]}
          </p>
        </div>
        <div className={styles.spread} data-spread>
          <span>{footer.spread[0]}</span>
          <span>{footer.spread[1]}</span>
          <a href="#top">{footer.backToTop}</a>
        </div>
        <div className={styles.signature} data-signature>
          <span className={styles.srOnly}>{footer.signature}</span>
          {[...footer.signature].map((char, position) => (
            <span
              key={position}
              className={styles.signatureLetter}
              data-letter
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </div>
        <div className={styles.bottom} data-bottom>
          <span>{footer.meta[0]}</span>
          <span>{footer.meta[1]}</span>
          <span>
            © <span data-year>{new Date().getFullYear()}</span> {footer.rights}
          </span>
        </div>
      </footer>

      <ContactMotion />
    </section>
  );
}
