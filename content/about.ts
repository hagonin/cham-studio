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
      fr: 'J’ai découvert le développement web à 17 ans, en bricolant mes premières pages. La curiosité d’abord : changer une ligne, rafraîchir, et voir une idée devenir quelque chose d’utilisable.',
      en: 'I first touched web development at 17, tinkering with my early pages. Curiosity came first: change a line, refresh, and watch an idea become something you could use.',
    },
  },
  {
    year: '2021',
    label: { fr: 'UN MÉTIER PREND FORME', en: 'A CAREER TAKES SHAPE' },
    body: {
      fr: 'Une formation intensive et des projets menés jusqu’au bout ont fait de cette curiosité un vrai choix de carrière. C’est là qu’une passion est devenue une pratique.',
      en: 'Intensive training and projects carried all the way through turned that curiosity into a real career choice. This was the point where a passion became a practice.',
    },
  },
];
