import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LOADER_SESSION_KEY,
  loaderAlreadyShown,
  loaderWillPlay,
  markLoaderShown,
} from '../lib/motion/loader-gate';

/**
 * La porte du rideau d'ouverture : UN seul arbitre, lu par le rideau ET par la
 * séquence du contact du hero, qui attend l'événement que le rideau émet. Si
 * les deux lisaient des règles différentes, le hero attendrait un événement que
 * le rideau n'a jamais prévu d'émettre — et rien à l'écran ne le signalerait.
 *
 * Les tests tournent sous Node : `window` et `sessionStorage` sont simulés.
 */
function visit({
  reducedMotion = false,
  hash = '',
  scrollY = 0,
  alreadyShown = false,
  storageBlocked = false,
}: {
  reducedMotion?: boolean;
  hash?: string;
  scrollY?: number;
  alreadyShown?: boolean;
  storageBlocked?: boolean;
} = {}) {
  const store = new Map<string, string>();
  if (alreadyShown) store.set(LOADER_SESSION_KEY, '1');
  vi.stubGlobal('window', {
    location: { hash },
    scrollY,
    matchMedia: () => ({ matches: reducedMotion }),
  });
  // `sessionStorage` lève une SecurityError en navigation privée stricte.
  vi.stubGlobal(
    'sessionStorage',
    storageBlocked
      ? {
          getItem: () => {
            throw new Error('SecurityError');
          },
          setItem: () => {
            throw new Error('SecurityError');
          },
        }
      : {
          getItem: (key: string) => store.get(key) ?? null,
          setItem: (key: string, value: string) => void store.set(key, value),
        },
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('porte du rideau', () => {
  it('se joue à la première visite, en haut de page', () => {
    visit();
    expect(loaderWillPlay()).toBe(true);
  });

  it('ne se joue pas sous reduced-motion', () => {
    visit({ reducedMotion: true });
    expect(loaderWillPlay()).toBe(false);
  });

  it('ne se joue pas quand l’URL porte une ancre', () => {
    // Arriver sur /#contact ne doit pas imposer quatre secondes devant la
    // section demandée.
    visit({ hash: '#contact-title' });
    expect(loaderWillPlay()).toBe(false);
  });

  it('ne se joue pas quand la page est déjà défilée', () => {
    visit({ scrollY: 81 });
    expect(loaderWillPlay()).toBe(false);
  });

  it('se joue encore à 80px de défilement : le seuil est strict', () => {
    visit({ scrollY: 80 });
    expect(loaderWillPlay()).toBe(true);
  });

  it('ne se rejoue pas dans la même session', () => {
    visit({ alreadyShown: true });
    expect(loaderAlreadyShown()).toBe(true);
    expect(loaderWillPlay()).toBe(false);
  });

  it('pose le drapeau de session une fois le rideau passé', () => {
    visit();
    expect(loaderWillPlay()).toBe(true);
    markLoaderShown();
    expect(loaderAlreadyShown()).toBe(true);
    expect(loaderWillPlay()).toBe(false);
  });

  it('rejoue sans casser quand le stockage de session est bloqué', () => {
    // Une lecture qui échoue redevient « pas encore vu » ; une écriture qui
    // échoue est ignorée : on perd le « une fois par session », pas la page.
    visit({ storageBlocked: true });
    expect(loaderAlreadyShown()).toBe(false);
    expect(loaderWillPlay()).toBe(true);
    expect(() => markLoaderShown()).not.toThrow();
  });

  it('ne joue jamais côté serveur', () => {
    vi.unstubAllGlobals();
    expect(loaderWillPlay()).toBe(false);
  });
});
