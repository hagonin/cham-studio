'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PUBLISHED, locales, swapLocale, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './LangSwitch.module.css';

/**
 * Le sélecteur préserve la route : depuis /fr/travaux/ on arrive sur
 * /en/travaux/, pas sur l'accueil. Les slugs sont identiques d'une locale à
 * l'autre (F7), donc l'échange se fait sur le premier segment.
 *
 * Aucune redirection selon l'IP : elle piège les moteurs et les personnes en
 * déplacement, et on ne peut pas la désactiver depuis la page.
 */
export function LangSwitch({ current, dict }: { current: Locale; dict: Dictionary }) {
  const pathname = usePathname();

  // Une seule locale publiée : le sélecteur n'a rien à proposer.
  if (PUBLISHED.length < 2) return null;

  return (
    <nav className={styles.switch} aria-label={dict.langSwitch.label}>
      {locales
        .filter((locale) => PUBLISHED.includes(locale))
        .map((locale) => (
          <Link
            key={locale}
            href={swapLocale(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            className="contact-link"
            aria-current={locale === current ? 'true' : undefined}
          >
            {dict.langSwitch[locale]}
          </Link>
        ))}
    </nav>
  );
}
