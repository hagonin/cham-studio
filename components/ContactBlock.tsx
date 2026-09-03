import { site } from '@/content/site';
import { ContactMarker } from './ContactMarker';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './ContactBlock.module.css';

/**
 * `mailto:` et rien d'autre. Un formulaire imposerait un service tiers, donc
 * un sous-traitant à déclarer au RGPD et un point d'entrée à protéger — pour
 * un site de deux pages, le lien fait le même travail sans rien de tout ça.
 */
export function ContactBlock({ dict }: { dict: Dictionary }) {
  const { contact } = dict.home;

  return (
    <section className={styles.block} aria-labelledby="contact-title">
      <ContactMarker label={dict.brand.name} />
      <h2 id="contact-title" className={styles.title}>
        {contact.title}
      </h2>
      <p className={styles.body}>{contact.body}</p>
      <a className={`${styles.cta} contact-link`} href={`mailto:${site.email}`}>
        {contact.cta} — {site.email}
      </a>
    </section>
  );
}
