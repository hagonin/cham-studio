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
import { MOUNTED_SECTIONS, SECTION_KEYS } from '../lib/sections';
import { formatPrice } from '../lib/i18n/format';
import { SITE_URL } from '../lib/i18n/config';
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
  it('publie le français et l’anglais', () => {
    expect(PUBLISHED).toEqual(['fr', 'en']);
    expect(isPublished('en')).toBe(true);
  });

  it('met les locales publiées en index, follow', () => {
    expect(robotsFor('en')).toEqual({ index: true, follow: true });
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

/**
 * La copie de la page est ÉCRITE dans les deux langues (`copy-fr.md`), pas
 * traduite mot à mot. `tsc` garantit que chaque clé existe des deux côtés ; il
 * ne dit rien d'une valeur laissée en anglais, vide, ou d'un gabarit `{title}`
 * qui diffère d'une langue à l'autre — et c'est ce qui se perd en silence quand
 * plus de cent chaînes arrivent d'un coup.
 */
describe('copie française', () => {
  const flatten = (value: unknown, path = '', out: Record<string, string> = {}) => {
    if (typeof value === 'string') out[path] = value;
    else if (Array.isArray(value))
      value.forEach((inner, i) => flatten(inner, `${path}[${i}]`, out));
    else if (value && typeof value === 'object')
      for (const [key, inner] of Object.entries(value))
        flatten(inner, path ? `${path}.${key}` : key, out);
    return out;
  };
  const fr = flatten(getDictionary('fr'));
  const en = flatten(getDictionary('en'));

  it('remplit chaque chaîne dans les deux langues', () => {
    for (const [path, text] of Object.entries(fr)) {
      expect(text.trim().length, `fr ${path}`).toBeGreaterThan(0);
      expect((en[path] ?? '').trim().length, `en ${path}`).toBeGreaterThan(0);
    }
  });

  it('garde les mêmes gabarits {x} d’une langue à l’autre', () => {
    const tokens = (text: string) =>
      [...text.matchAll(/\{(\w+)\}/g)]
        .map((match) => match[1])
        .sort()
        .join(',');
    for (const path of Object.keys(fr)) {
      expect(tokens(fr[path]), path).toBe(tokens(en[path]));
    }
  });

  // Seules ces chaînes sont identiques dans les deux langues, et chacune l'est
  // pour une raison : verrou de marque, numéro de section, nom d'outil, nom
  // propre, ou mot qui s'écrit pareil. Une nouvelle chaîne identique n'entre pas
  // ici par défaut : quelqu'un décide que c'est voulu.
  const SAME_ON_PURPOSE = new Set([
    'nav.services',
    'nav.menu',
    'brand.name',
    'brand.positioning',
    'footer.location',
    'langSwitch.fr',
    'langSwitch.en',
    'home.touchPhilosophy.meta[0]',
    'home.touchPhilosophy.meta[1]',
    'home.about.eyebrow[1]',
    'home.about.photoPair[0]',
    'home.about.now.chips[0]',
    'home.about.now.chips[1]',
    'home.about.now.chips[2]',
    'home.work.meta[0]',
    'home.work.meta[2]',
    'home.contact.footer.spread[0]',
    'home.contact.footer.spread[1]',
    'home.contact.footer.meta[0]',
    'home.contact.footer.signature',
    'pricing.estimator.scales.simple',
    'pricing.estimator.scales.standard',
    'pricing.estimator.designs.signature',
  ]);

  it('n’a pas de chaîne recopiée de l’anglais', () => {
    const copied = Object.keys(fr).filter((path) => fr[path] === en[path]);
    expect(copied.filter((path) => !SAME_ON_PURPOSE.has(path))).toEqual([]);
  });

  it('ne garde pas dans la liste une chaîne qui a fini par être traduite', () => {
    // Une liste d'exceptions qui ne rétrécit jamais finit par tout laisser passer.
    for (const path of SAME_ON_PURPOSE) {
      expect(fr[path], path).toBe(en[path]);
    }
  });

  // « ? ! : ; » et les guillemets prennent une espace fine insécable en
  // français. Une espace simple laisse le signe tomber seul en début de ligne,
  // ce que la mise en page à 390px rend visible. Le brouillon d'e-mail est un
  // texte brut : il garde l'espace simple du deck.
  it('met une espace insécable avant ? ! : ; dans la copie de la page', () => {
    const plainTextEmail = 'home.contact.form.draft.body';
    const offenders = Object.keys(fr).filter(
      (path) =>
        path.startsWith('home.') &&
        path !== plainTextEmail &&
        /[^\s\u00a0\u202f] [?!:;»]|« /.test(fr[path]),
    );
    expect(offenders).toEqual([]);
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

// Une ancre vers un titre absent défile vers rien, et la page répond 200 :
// aucun test de route ne l'attrape. La garde est donc ici, sur la liste des
// sections — `about` et `work` n'entrent qu'aux phases 03 et 05.
describe('navigation de section', () => {
  it('n’ancre que des sections réellement montées', () => {
    for (const key of MOUNTED_SECTIONS) {
      expect(SECTION_KEYS).toContain(key);
    }
  });

  // L'ordre est celui du dessin : la personne avant la preuve. Il remplace
  // l'ancien « preuve d'abord » et vit à deux endroits — cette liste et le JSX
  // de `app/[locale]/page.tsx` — qui doivent bouger ensemble. Les numéros
  // affichés à l'écran (02 / 05, 03, 04 / 05) en dépendent. Il n'y a plus de
  // section « process » : ses prestations sont le bloc `services`.
  it('suit l’ordre du dessin', () => {
    expect([...SECTION_KEYS]).toEqual(['about', 'work', 'services', 'contact']);
  });

  it('nomme chaque section dans les deux locales', () => {
    for (const locale of locales) {
      const { nav } = getDictionary(locale);
      expect(nav.label.trim().length, locale).toBeGreaterThan(0);
      expect(nav.contactMe.trim().length, locale).toBeGreaterThan(0);
      expect(nav.logoLabel.trim().length, locale).toBeGreaterThan(0);
      for (const key of SECTION_KEYS) {
        expect(nav[key].trim().length, `${locale}/${key}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('sitemap', () => {
  // L'index /projects a été retiré : la page unique porte les travaux. Aucune
  // route [locale]/[slug] n'existe encore pour les études de cas, donc le
  // sitemap ne doit annoncer que l'accueil tant que cette page n'est pas là.
  it('n’annonce que l’accueil', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}${localeHref('fr')}`);
    expect(urls.some((url) => url.endsWith('/projects/'))).toBe(false);
    expect(urls).toHaveLength(PUBLISHED.length);
  });

  it('expose toutes les locales publiées', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}${localeHref('en')}`);
  });
});
