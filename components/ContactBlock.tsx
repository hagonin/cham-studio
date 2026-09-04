import Image from 'next/image';
import { site } from '@/content/site';
import { ContactMarker } from './ContactMarker';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import styles from './ContactBlock.module.css';

/**
 * `mailto:` et rien d'autre. Un formulaire imposerait un service tiers, donc
 * un sous-traitant à déclarer au RGPD et un point d'entrée à protéger — pour
 * un site de deux pages, le lien fait le même travail sans rien de tout ça.
 */
export function ContactBlock({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { contact } = dict.home;
  const { portrait } = site;

  return (
    <section data-reveal className={styles.block} aria-labelledby="contact-title">
      <ContactMarker label={dict.brand.name} />
      <h2 id="contact-title" className={styles.title}>
        {contact.title}
      </h2>
      <p className={styles.body}>{contact.body}</p>
      <a
        className={`${styles.cta} contact-link`}
        href={`mailto:${site.email}`}
        data-magnetic
      >
        {contact.cta} — {site.email}
      </a>
      {/* Rien à afficher tant que la photo n'existe pas : pas de cadre vide,
          pas de silhouette générique. Le portrait est en 4:5, d'où le ratio
          surchargé sur `.frame`. */}
      {portrait ? (
        <span className={`${styles.portrait} frame`}>
          <Image
            src={portrait.src}
            alt={portrait.alt[locale]}
            width={portrait.width}
            height={portrait.height}
            sizes="(max-width: 60rem) 60vw, 20rem"
            loading="lazy"
          />
        </span>
      ) : null}
    </section>
  );
}
