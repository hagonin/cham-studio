import Link from 'next/link';
import { PUBLISHED, locales, localeHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import { SECTION_KEYS, type SectionKey } from '@/lib/sections';
import styles from './SectionNav.module.css';

/**
 * La navigation de la page unique (D6). Elle remplace `LangSwitch`, dont le
 * retour anticipé `PUBLISHED.length < 2` ne rendait plus rien du tout : ici la
 * locale courante reste visible, l'autre est inerte tant qu'elle n'est pas
 * publiée. Une personne doit voir que le site existe en deux langues même
 * quand elle ne peut pas encore basculer.
 *
 * Les ancres pointent sur les `<h2 id="*-title">` DÉJÀ en place, pas sur des
 * `id` posés sur les `<section>` : `scrollToAnchor` déplace alors le focus sur
 * un vrai titre, ce qu'un conteneur ne permet pas.
 *
 * L'interception du clic appartient à `MotionProvider` (`lib/motion/lenis.ts`),
 * qui écoute déjà `a[href^="#"]`. Rien à ajouter ici : un second chemin de
 * défilement serait un second endroit où le focus peut se perdre.
 *
 * Composant serveur. L'état « section courante » demanderait un observateur au
 * défilement ; il n'est pas là, et son absence ne coûte rien tant que la barre
 * n'est pas collante.
 */

export function SectionNav({
  locale,
  dict,
  sections,
}: {
  locale: Locale;
  dict: Dictionary;
  sections: readonly SectionKey[];
}) {
  const { nav } = dict;
  const items = SECTION_KEYS.filter((key) => sections.includes(key)).map((key) => ({
    href: `#${key}-title`,
    label: nav[key],
  }));

  return (
    <nav className={styles.nav} aria-label={nav.label}>
      <Link href={localeHref(locale)} className={styles.wordmark}>
        {dict.brand.name}
      </Link>

      <ul className={styles.sections}>
        {items.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className={styles.link}>
              {label}
            </a>
          </li>
        ))}
      </ul>

      <p className={styles.locales}>
        {locales.map((code, index) => {
          const current = code === locale;
          const published = PUBLISHED.includes(code);
          return (
            <span key={code}>
              {index > 0 ? <span aria-hidden="true"> / </span> : null}
              {published && !current ? (
                <Link
                  href={localeHref(code)}
                  hrefLang={code}
                  lang={code}
                  className={styles.link}
                >
                  {code.toUpperCase()}
                </Link>
              ) : (
                <span
                  className={current ? styles.current : styles.inert}
                  aria-current={current ? 'true' : undefined}
                >
                  {code.toUpperCase()}
                </span>
              )}
            </span>
          );
        })}
      </p>
    </nav>
  );
}
