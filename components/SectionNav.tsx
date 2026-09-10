import Link from 'next/link';
import { PUBLISHED, locales, localeHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import { SECTION_KEYS, type SectionKey } from '@/lib/sections';
import { NavMotion } from './NavMotion';
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
 * Composant serveur — et il le reste. La barre est devenue COLLANTE, ce qui
 * rend l'observateur de section nécessaire (une barre qui reste à l'écran doit
 * dire où l'on est) et le masquage mobile intenable (masquer les ancres d'une
 * barre visible en permanence, c'est une perte visible). Les deux vivent dans
 * `NavMotion`, un enfant client qui ne rend rien : le balisage, les libellés et
 * les ancres restent dans le HTML servi, donc utilisables sans JavaScript.
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
    <nav className={styles.nav} aria-label={nav.label} data-nav>
      <Link href={localeHref(locale)} className={styles.wordmark}>
        {dict.brand.name}
      </Link>

      {/* `aria-controls` n'est pas une formalité : `check-html.mjs` fait
          échouer le build sur un `aria-expanded` qui n'en a pas. Le bouton est
          rendu par le serveur avec l'état FERMÉ — c'est l'état sans JS, et sans
          JS les ancres restent atteignables autrement (le menu n'est masqué que
          sous 40rem, où la liste redevient visible dès que le CSS s'applique).
          Les deux libellés voyagent en `data-*` : le composant client bascule
          le texte sans avoir à connaître la langue de la page. */}
      <button
        type="button"
        className={styles.toggle}
        aria-expanded="false"
        aria-controls="nav-menu"
        data-nav-toggle
        data-label-open={nav.menu}
        data-label-close={nav.close}
      >
        {nav.menu}
      </button>

      <ul id="nav-menu" className={styles.sections}>
        {items.map(({ href, label }) => (
          <li key={href} className={styles.item}>
            {/* `data-magnetic` porte ici sa FORCE : 0,08, presque rien —
                l'attraction d'un CTA (0,28) sur une barre collante ferait
                vibrer la ligne entière au passage du pointeur. Le câblage est
                celui de MotionProvider, il n'y a pas de second chemin. */}
            <a href={href} className={styles.link} data-magnetic="0.08">
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

      <NavMotion />
    </nav>
  );
}
