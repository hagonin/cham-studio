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
    const alternates = buildAlternates(['fr'], 'fr', 'travaux');
    expect(alternates?.languages).toBeUndefined();
    expect(alternates?.canonical).toBe('/fr/travaux/');
  });

  it('émet des couples réciproques dès que deux locales sont publiées', () => {
    const frSide = buildAlternates(['fr', 'en'], 'fr', 'travaux');
    const enSide = buildAlternates(['fr', 'en'], 'en', 'travaux');

    // Réciprocité : chaque côté annonce exactement les mêmes cibles.
    expect(frSide?.languages).toEqual(enSide?.languages);
    expect(frSide?.languages).toEqual({
      fr: '/fr/travaux/',
      en: '/en/travaux/',
      'x-default': '/fr/travaux/',
    });
    expect(frSide?.canonical).toBe('/fr/travaux/');
    expect(enSide?.canonical).toBe('/en/travaux/');
  });

  it('prend le français comme x-default', () => {
    expect(defaultLocale).toBe('fr');
  });
});

describe('routes', () => {
  it('garde le même slug dans les deux locales (F7)', () => {
    expect(localeHref('fr', 'travaux')).toBe('/fr/travaux/');
    expect(localeHref('en', 'travaux')).toBe('/en/travaux/');
  });

  it('ramène la racine d’une locale à son segment', () => {
    expect(localeHref('fr')).toBe('/fr/');
  });

  it('conserve la page courante au changement de langue', () => {
    // Le critère de la Phase 3 : depuis /fr/travaux on arrive sur /en/travaux,
    // pas sur l'accueil.
    expect(swapLocale('/fr/travaux/', 'en')).toBe('/en/travaux/');
    expect(swapLocale('/fr/', 'en')).toBe('/en/');
    expect(swapLocale('/fr/mentions-legales/', 'en')).toBe('/en/mentions-legales/');
  });

  it('préfixe un chemin sans locale plutôt que d’écraser un segment', () => {
    expect(swapLocale('/travaux/', 'fr')).toBe('/fr/travaux/');
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
