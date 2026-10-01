import { services } from '@/content/services';
import { ServiceItem } from './ServiceItem';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import styles from './ServiceList.module.css';

/**
 * Composant serveur : seuls les accordéons descendent côté client.
 *
 * NON MONTÉ sur la page : le dessin n'a qu'un bloc de prestations, rendu par
 * `Process` sous le même `id="services-title"`. Le monter à côté de lui
 * dupliquerait cet `id` ; `page.tsx` dit pourquoi il reste au dépôt.
 */
export function ServiceList({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section data-reveal className={styles.block} aria-labelledby="services-title">
      <h2 id="services-title" className={styles.title}>
        {dict.home.services.title}
      </h2>
      {/* « Tarifs indicatifs » n'a de sens que si une ligne affiche un plancher ;
          tant que tout est « Sur devis », la mention promettrait des chiffres
          qui n'existent pas. */}
      {services.some((service) => service.from !== null) && (
        <p className={styles.indicative}>{dict.pricing.indicative}</p>
      )}
      <ul className={styles.list}>
        {services.map((service) => (
          <ServiceItem
            key={service.key}
            service={service}
            locale={locale}
            dict={dict}
          />
        ))}
      </ul>
    </section>
  );
}
