import { describe, expect, it } from 'vitest';
import {
  PUBLISHED,
  defaultLocale,
  isLocale,
  isPublished,
  locales,
  localeHref,
  swapLocale,
} from '../lib/i18n/config';
import { buildAlternates, robotsFor } from '../lib/i18n/metadata';
import { getDictionary } from '../lib/i18n/getDictionary';
import { formatPrice } from '../lib/i18n/format';
import { SITE_URL } from '../lib/i18n/config';
import { workSectionIsReady } from '../content/projects';
import sitemap from '../app/sitemap';

describe('validation de la locale', () => {
  it('rejette tout segment hors liste blanche', () => {
    expect(isLocale('fr')).toBe(true);
    expect(isLocale('de')).toBe(false);
    // Le segment vient de l'URL : il ne doit jamais atteindre un lookup brut.
    expect(isLocale('../../etc/passwd')).toBe(false);
  });
});

describe('publication des locales', () => {
  it('ne publie que le français pour l’instant', () => {
    expect(PUBLISHED).toEqual(['fr']);
    expect(isPublished('en')).toBe(false);
  });

  it('met les locales non publiées en noindex, nofollow', () => {
    expect(robotsFor('en')).toEqual({ index: false, follow: false });
    expect(robotsFor('fr')).toEqual({ index: true, follow: true });
  });
});

describe('hreflang', () => {
  // Un couple réciproque pointant vers une page noindex fait écarter la grappe
  // entière par Google. Tant qu'une seule locale est publiée, on n'annote pas.
  it('n’émet aucune alternative avec une seule locale publiée', () => {
    const alternates = buildAlternates(['fr'], 'fr', 'projects');
    expect(alternates?.languages).toBeUndefined();
    expect(alternates?.canonical).toBe('/fr/projects/');
  });

  it('émet des couples réciproques dès que deux locales sont publiées', () => {
    const frSide = buildAlternates(['fr', 'en'], 'fr', 'projects');
    const enSide = buildAlternates(['fr', 'en'], 'en', 'projects');

    // Réciprocité : chaque côté annonce exactement les mêmes cibles.
    expect(frSide?.languages).toEqual(enSide?.languages);
    expect(frSide?.languages).toEqual({
      fr: '/fr/projects/',
      en: '/en/projects/',
      'x-default': '/fr/projects/',
    });
    expect(frSide?.canonical).toBe('/fr/projects/');
    expect(enSide?.canonical).toBe('/en/projects/');
  });

  it('prend le français comme x-default', () => {
    expect(defaultLocale).toBe('fr');
  });
});

describe('routes', () => {
  it('garde le même slug dans les deux locales (F7)', () => {
    expect(localeHref('fr', 'projects')).toBe('/fr/projects/');
    expect(localeHref('en', 'projects')).toBe('/en/projects/');
  });

  it('ramène la racine d’une locale à son segment', () => {
    expect(localeHref('fr')).toBe('/fr/');
  });

  it('conserve la page courante au changement de langue', () => {
    // Le critère de la Phase 3 : depuis /fr/projects on arrive sur /en/projects,
    // pas sur l'accueil.
    expect(swapLocale('/fr/projects/', 'en')).toBe('/en/projects/');
    expect(swapLocale('/fr/', 'en')).toBe('/en/');
    expect(swapLocale('/fr/mentions-legales/', 'en')).toBe('/en/mentions-legales/');
  });

  it('préfixe un chemin sans locale plutôt que d’écraser un segment', () => {
    expect(swapLocale('/projects/', 'fr')).toBe('/fr/projects/');
  });
});

describe('dictionnaires', () => {
  it('expose la même forme dans les deux locales', () => {
    const shape = (value: unknown): unknown =>
      value && typeof value === 'object'
        ? Object.fromEntries(
            Object.entries(value as Record<string, unknown>)
              .map(([key, inner]) => [key, shape(inner)])
              .sort(),
          )
        : typeof value;

    expect(shape(getDictionary('en'))).toEqual(shape(getDictionary('fr')));
  });

  it('est réellement traduit, pas recopié', () => {
    expect(getDictionary('en').nav.work).not.toBe(getDictionary('fr').nav.work);
  });
});

describe('formats localisés', () => {
  it('formate les montants selon la locale', () => {
    // Espaces insécables côté français : on compare les chiffres, pas l'espace.
    expect(formatPrice('fr', 1200).replace(/\s/g, ' ')).toBe('1 200 €');
    expect(formatPrice('en', 1200)).toBe('€1,200');
  });
});

describe('couverture', () => {
  it('construit toutes les locales, publiées ou non', () => {
    expect(locales).toEqual(['fr', 'en']);
  });
});

/**
 * La page /projects. Deux règles s'y croisent : le sens de la marque n'est
 * écrit qu'à un seul endroit du site, et une page dont le contenu principal
 * manque ne s'annonce pas au moteur.
 */
describe('page travaux', () => {
  it('écrit le sens de la marque dans la prose « à propos », dans les deux locales', () => {
    for (const locale of locales) {
      const dict = getDictionary(locale);
      // La phrase est rédigée à la main pour se lire ; la garde vérifie
      // qu'elle porte bien le sens déclaré dans `brand`, plutôt qu'une
      // seconde définition qui dériverait de la première.
      expect(dict.work.about.meaning, locale).toContain(dict.brand.meaning);
    }
  });

  it('n’écrit ce sens que là — jamais dans le hero', () => {
    for (const locale of locales) {
      const dict = getDictionary(locale);
      expect(JSON.stringify(dict.home), locale).not.toContain(dict.brand.meaning);
    }
  });

  it('remplit la copie de la page dans les deux locales', () => {
    for (const locale of locales) {
      const { work } = getDictionary(locale);
      for (const line of [work.title, work.lead, work.projects.framing]) {
        expect(line.trim().length, locale).toBeGreaterThan(0);
      }
      expect(work.about.creed.length, locale).toBeGreaterThan(0);
      expect(work.about.body.length, locale).toBeGreaterThan(0);
    }
  });
});

describe('sitemap', () => {
  it('n’annonce /projects que lorsque la section travaux peut paraître', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}${localeHref('fr')}`);
    expect(urls.some((url) => url.endsWith('/projects/'))).toBe(workSectionIsReady());
  });

  it('n’expose aucune locale non publiée', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.includes('/en/'))).toBe(false);
  });
});
