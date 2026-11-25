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
    year: '2008',
    label: { fr: 'MON PREMIER SITE', en: 'MY FIRST WEBSITE' },
    body: {
      fr: 'À 17 ans, avec mes deux camarades, j’ai construit mon premier site pour le concours Design & Build Website\u202f: infos de l’école, vie étudiante et musique. Nous avons remporté le deuxième prix.',
      en: 'At 17, with my two classmates, I built my first website for the Design & Build Website competition: school information, student life and music. We won second prize.',
    },
  },
  {
    year: '2021',
    label: { fr: 'LE RETOUR AU CODE', en: 'BACK TO CODE' },
    body: {
      fr: 'Je dessine des écrans que je sais construire. Cours de HTML, CSS et PHP à WIS Montpellier en 2017. Retour au code en 2021\u202f: Python, une application de gestion d’élèves, un bootcamp front-end en mini-projets. Vous ne recevez pas une belle maquette impossible à livrer.',
      en: 'I design screens I know how to build. A 2017 HTML, CSS and PHP course at WIS Montpellier. Back to code in 2021: Python, a school student-management app, a front-end bootcamp of mini-projects. You won’t get a beautiful mockup that can’t ship.',
    },
  },
];

/**
 * Les trois photos des cadres du bloc « à propos », déjà recadrées en 3:2.
 * `position` est le point focal pour `object-fit: cover` : les cadres changent
 * de proportion selon l'écran (≈1,4 sur ordinateur, ≈1,2 pour la grande photo
 * et ≈2,3 pour les petites sur téléphone), et ce point garde le visage dans le
 * cadre quand l'image est rognée.
 */
export type AboutPhoto = {
  src: string;
  position: string;
  alt: L10n;
};

export const photos: { lead: AboutPhoto; pair: readonly [AboutPhoto, AboutPhoto] } = {
  lead: {
    src: '/about/desk-sketchbook.webp',
    position: '70% 40%',
    alt: {
      fr: 'À son bureau, elle esquisse des wireframes dans un carnet, avec une maquette et du code sur les écrans',
      en: 'At her desk, sketching wireframes in a notebook, with a mockup and code on the screens',
    },
  },
  pair: [
    {
      src: '/about/user-flow.webp',
      position: '32% 22%',
      alt: {
        fr: 'Elle explique un parcours utilisateur devant un tableau blanc couvert de notes adhésives',
        en: 'Explaining a user flow at a whiteboard covered in sticky notes',
      },
    },
    {
      src: '/about/in-context.webp',
      position: '70% 8%',
      alt: {
        fr: 'Dans un café, elle teste une application sur son téléphone',
        en: 'In a café, testing an app on her phone',
      },
    },
  ],
};
