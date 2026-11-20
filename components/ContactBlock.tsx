import { site } from '@/content/site';
import { MOUNTED_SECTIONS, sectionHref } from '@/lib/sections';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import { ContactForm } from './ContactForm';
import { ContactMotion } from './ContactMotion';
import { LetterLine } from './LetterLine';
import { RollLabel, bracketLink, rollLink } from './RollLabel';
import styles from './ContactBlock.module.css';

// L'ordre du pied de page est celui du dessin (à propos, services, travaux),
// pas celui de la barre. « travaux » n'y figure que si la section est montée.
const FOOTER_PAGES = ['about', 'services', 'work'] as const;

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
export function ContactBlock({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { contact } = dict.home;
  const { footer } = contact;
  const pages = FOOTER_PAGES.filter((key) => MOUNTED_SECTIONS.includes(key));

  return (
    <section className={styles.section} aria-labelledby="contact-title" data-contact>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>{contact.eyebrow}</p>
        <h2 id="contact-title" className={styles.title}>
          <LetterLine text={contact.title.first} />
          <span className={styles.bridge}>{contact.title.bridge}</span>
          <LetterLine text={contact.title.second} />
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
              <a
                key={key}
                href={sectionHref(key)}
                className={rollLink}
                aria-label={dict.nav[key]}
              >
                <RollLabel text={dict.nav[key]} />
              </a>
            ))}
          </nav>
          <address>
            {site.postalCode} {site.city[locale]}
          </address>
        </div>
        <div className={styles.spread} data-spread>
          {site.social.map(({ label, href }) => (
            <a
              key={label}
              className={`${rollLink} ${bracketLink} ${styles.socialLink}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} ${footer.newTab}`}
            >
              <RollLabel text={label} />
            </a>
          ))}
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
