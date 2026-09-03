import { Clock } from './Clock';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { site } from '@/content/site';
import styles from './StatusBar.module.css';

/** Composant serveur : seule l'horloge a besoin du client. */
export function StatusBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { status } = dict.home;

  return (
    <div className={styles.bar}>
      <span>{status.availability}</span>
      <span>{status.replyTime}</span>
      <span className={styles.right}>
        {site.city[locale]} <Clock locale={locale} label={status.clockLabel} />
      </span>
    </div>
  );
}
