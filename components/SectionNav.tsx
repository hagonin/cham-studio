import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PUBLISHED, locales, localeHref, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import { SECTION_KEYS, type SectionKey } from '@/lib/sections';
import { NavMotion } from './NavMotion';
import styles from './SectionNav.module.css';

/**
 * La barre du dessin, reprise telle quelle (`navigation.css`, `navigation.js`
 * du prototype) : un `<header>` fixe, qui se mélange au fond (`difference`),
 * le wordmark, quatre liens à lettres qui défilent au survol, le bouton de
 * contact, et sous 800px un bouton MENU qui déplie les liens.
 *
 * Deux écarts, et seulement ces deux-là. Le dessin n'a pas de sélecteur de
 * langue ; le site existe en deux langues, il reste donc dans la barre (et dans
 * le menu sous 800px, faute de place). Et la barre passe SOUS le loader, dont
 * l'empilement est plus bas que les 100 du dessin.
 *
 * Les ancres pointent sur les `<h2 id="*-title">` DÉJÀ en place, pas sur des
 * `id` posés sur les `<section>` : `scrollToAnchor` déplace alors le focus sur
 * un vrai titre, ce qu'un conteneur ne permet pas. L'interception du clic
 * appartient à `MotionProvider` (`lib/motion/lenis.ts`), qui écoute déjà
 * `a[href^="#"]` : un second chemin de défilement serait un second endroit où
 * le focus peut se perdre.
 *
 * Composant serveur. Le balisage, les libellés, les lettres et les ancres sont
 * dans le HTML servi, donc utilisables sans JavaScript ; `NavMotion` (un enfant
 * client qui ne rend rien) ajoute l'état « section courante » et le menu.
 */

/**
 * Un libellé en lettres séparées. Chacune porte son rang `--i`, qui décale son
 * départ dans le défilement au survol. Le lien porte le libellé en `aria-label`
 * et cache ces lettres aux lecteurs d'écran : elles ne se lisent pas une à une.
 */
function Letters({ text }: { text: string }) {
  return (
    <>
      {[...text].map((char, index) => (
        <span key={index} style={{ '--i': index } as CSSProperties}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </>
  );
}

/**
 * La locale courante reste visible, l'autre est inerte tant qu'elle n'est pas
 * publiée : une personne doit voir que le site existe en deux langues même
 * quand elle ne peut pas encore basculer.
 */
function Locales({ locale, className }: { locale: Locale; className: string }) {
  return (
    <div className={className}>
      {locales.map((code, index) => {
        const current = code === locale;
        const published = PUBLISHED.includes(code);
        return (
          <span key={code}>
            {index > 0 ? <span aria-hidden="true"> / </span> : null}
            {published && !current ? (
              <Link href={localeHref(code)} hrefLang={code} lang={code}>
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
    </div>
  );
}

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
    <header className={styles.header} data-nav>
      <Link
        href={localeHref(locale)}
        className={styles.logo}
        aria-label={nav.logoLabel}
      >
        {dict.brand.name}
      </Link>

      <nav className={styles.siteNav} id="site-navigation" aria-label={nav.label}>
        {items.map(({ href, label }) => (
          <a key={href} href={href} className={styles.navLink} aria-label={label}>
            <span className={styles.navWindow} aria-hidden="true">
              <span className={styles.navOriginal}>
                <Letters text={label} />
              </span>
              <span className={styles.navClone}>
                <Letters text={label} />
              </span>
            </span>
          </a>
        ))}
        <Locales locale={locale} className={styles.localesMenu} />
      </nav>

      {/* Même cible que « contact » dans la liste, mais hors d'elle : il reste
          visible quand les liens passent derrière le bouton de menu. Hors du
          `<nav>`, `NavMotion` ne lui pose jamais `aria-current`. La flèche est
          décorative. */}
      {sections.includes('contact') && (
        <a href="#contact-title" className={styles.navContact}>
          {nav.contactMe} <span aria-hidden="true">↗</span>
        </a>
      )}

      <Locales locale={locale} className={styles.locales} />

      {/* `aria-controls` n'est pas une formalité : `check-html.mjs` fait
          échouer le build sur un `aria-expanded` qui n'en a pas. Le bouton est
          rendu avec l'état FERMÉ — c'est l'état sans JS, et sans JS les liens
          restent atteignables (le menu n'est masqué que sous 800px, où la liste
          redevient visible dès que le CSS s'applique). Les deux libellés
          voyagent en `data-*` : le composant client bascule le texte sans avoir
          à connaître la langue de la page. */}
      <button
        type="button"
        className={styles.navToggle}
        aria-expanded="false"
        aria-controls="site-navigation"
        data-nav-toggle
        data-label-open={nav.menu}
        data-label-close={nav.close}
      >
        {nav.menu}
      </button>

      <NavMotion />
    </header>
  );
}
