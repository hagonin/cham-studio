import type { L10n } from './types';

/**
 * La chronologie du bloc « à propos » : des enregistrements structurés (année,
 * libellé, texte), donc dans `content/` avec les deux locales DANS chaque
 * enregistrement, pas dans le dictionnaire, qui ne porte que de la prose.
 * Une chaîne manquante dans une langue échoue au build.
 */
export type TimelineEntry = {
  year: string;
  label: L10n;
  body: L10n;
};

export const timeline: readonly TimelineEntry[] = [
  {
    year: '2017',
    label: { fr: 'LES PREMIÈRES PAGES', en: 'THE FIRST PAGES' },
    body: {
      fr: 'J’ai commencé à coder à 17 ans, en bricolant mes premières pages. Aujourd’hui, quand je dessine un écran, je sais déjà comment il sera construit. Vous ne recevez pas une belle maquette impossible à livrer.',
      en: 'I started coding at 17, tinkering with my first pages. Today, when I design a screen, I already know how it will be built. You won’t get a beautiful mockup that can’t ship.',
    },
  },
  {
    year: '2021',
    label: { fr: 'UN MÉTIER PREND FORME', en: 'A CAREER TAKES SHAPE' },
    body: {
      fr: 'Une formation intensive, puis des projets menés jusqu’au bout, seule ou à la tête d’une équipe. J’y ai appris ce qui compte le plus pour un client\u202f: finir, c’est-à-dire tester, corriger et livrer, pas seulement prototyper.',
      en: 'Intensive training, then projects carried all the way through, on my own or leading a team. That’s where I learned what matters most to a client: finishing. Testing, fixing and shipping, not just prototyping.',
    },
  },
];
