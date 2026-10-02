import { afterEach, describe, expect, it, vi } from 'vitest';
import { loaderGateScript, loaderWillPlay } from '../lib/motion/loader-gate';

/**
 * La porte du rideau d'ouverture : UN seul arbitre, lu par le rideau ET par la
 * séquence du contact du hero, qui attend l'événement que le rideau émet. Si
 * les deux lisaient des règles différentes, le hero attendrait un événement que
 * le rideau n'a jamais prévu d'émettre — et rien à l'écran ne le signalerait.
 *
 * Les tests tournent sous Node : `window` et `document` sont simulés.
 */
function visit({
  reducedMotion = false,
  hash = '',
  scrollY = 0,
}: {
  reducedMotion?: boolean;
  hash?: string;
  scrollY?: number;
} = {}) {
  vi.stubGlobal('window', {
    location: { hash },
    scrollY,
    matchMedia: () => ({ matches: reducedMotion }),
  });
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

  it('ne joue jamais côté serveur', () => {
    vi.unstubAllGlobals();
    expect(loaderWillPlay()).toBe(false);
  });
});

/**
 * `loaderGateScript()` tourne hors bundle, avant l'hydratation : il répète les
 * conditions de `loaderWillPlay()` plutôt que de l'appeler. Ce test rejoue le
 * même script, dans un faux DOM, sur le même jeu de scénarios que ci-dessus, et
 * compare les deux verdicts — c'est la garde contre une divergence silencieuse
 * entre les deux copies de la porte.
 */
function playsAccordingToScript({
  reducedMotion = false,
  hash = '',
  scrollY = 0,
}: {
  reducedMotion?: boolean;
  hash?: string;
  scrollY?: number;
} = {}): boolean {
  const documentElement = { dataset: {} as Record<string, string> };
  const fakeWindow = {
    location: { hash },
    scrollY,
    matchMedia: () => ({ matches: reducedMotion }),
    document: { documentElement },
  };
  // Le script attend `matchMedia`, `location`, `scrollY` et `document` en
  // portée globale, comme dans un vrai `<script>` inline.
  const run = new Function(
    'matchMedia',
    'location',
    'scrollY',
    'document',
    loaderGateScript(),
  );
  run(
    fakeWindow.matchMedia,
    fakeWindow.location,
    fakeWindow.scrollY,
    fakeWindow.document,
  );
  return documentElement.dataset.intro === 'playing';
}

describe('script inline de la porte', () => {
  const scenarios = [
    { name: 'première visite, en haut de page', input: {} },
    { name: 'reduced-motion', input: { reducedMotion: true } },
    { name: 'ancre dans l’URL', input: { hash: '#contact-title' } },
    { name: 'page déjà défilée', input: { scrollY: 81 } },
    { name: 'exactement 80px de défilement', input: { scrollY: 80 } },
  ];

  it.each(scenarios)('s’accorde avec loaderWillPlay() : $name', ({ input }) => {
    visit(input);
    const fromTs = loaderWillPlay();
    const fromScript = playsAccordingToScript(input);
    expect(fromScript).toBe(fromTs);
  });
});
