import { services } from '@/content/services';
import { ServiceItem } from './ServiceItem';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import styles from './ServiceList.module.css';

/** Composant serveur : seuls les accordéons descendent côté client. */
export function ServiceList({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section data-reveal className={styles.block} aria-labelledby="services-title">
      <h2 id="services-title" className={styles.title}>
        {dict.home.services.title}
      </h2>
      <p className={styles.indicative}>{dict.pricing.indicative}</p>
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
