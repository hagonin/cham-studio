import { type Service } from './types';

/**
 * Trois ENGAGEMENTS, pas quatre livrables (décision 13, `docs/positioning.md`
 * §3). Ce qu'on peut confier, dans les mots de la personne qui le confie.
 *
 * AUCUN CHIFFRE (décision 7). Les trois `from` valent `null`, donc les lignes
 * affichent `dict.home.services.quoteOnRequest`. Un plancher public sur un
 * portfolio visé à l'international ancre bas et négocie à la place de
 * l'exploitante ; la conversation est le produit. `tests/content.test.ts`
 * garde l'invariant — c'est ce qui remplace l'ancienne garde `check-prices`.
 *
 * Ce fichier n'importe plus `BASE` : le modèle tarifaire existe toujours et
 * reste testé, mais il n'alimente plus rien d'affiché.
 *
 * Les deux locales sont ÉCRITES, pas traduites (décision 17). L'anglais vise
 * une personne qui cherche quelqu'un de responsable de bout en bout ; le
 * français, une personne qui hésite entre une indépendante et une agence.
 */
export const services: Service[] = [
  {
    key: 'mvp',
    title: { fr: 'MVP et développement produit', en: 'MVP & product development' },
    summary: {
      fr: 'De l’idée à un produit qui tourne.',
      en: 'From idea to a working product.',
    },
    deliverables: [
      { fr: 'Structuration du produit', en: 'Product structure' },
      { fr: 'Conception de l’expérience', en: 'Core experience design' },
      { fr: 'Front, back et API', en: 'Frontend, backend and APIs' },
      { fr: 'Authentification et base de données', en: 'Authentication and database' },
      { fr: 'Mise en production', en: 'Deployment' },
    ],
    from: null,
  },
  {
    key: 'websites',
    title: { fr: 'Sites produit et vitrine', en: 'Product & marketing websites' },
    summary: {
      fr: 'Des sites faits pour expliquer, convaincre et convertir.',
      en: 'Sites built to explain, convince and convert.',
    },
    deliverables: [
      { fr: 'Architecture de l’information', en: 'Information architecture' },
      { fr: 'Design d’interface responsive', en: 'Responsive interface design' },
      { fr: 'Développement front', en: 'Frontend development' },
      { fr: 'CMS et fondations SEO', en: 'CMS and SEO foundations' },
      { fr: 'Performance et mesure', en: 'Performance and analytics' },
    ],
    from: null,
  },
  {
    key: 'improvement',
    title: {
      fr: 'Amélioration et intégrations',
      en: 'Product improvement & integrations',
    },
    summary: {
      fr: 'Améliorer ce qui existe déjà.',
      en: 'Improve what already exists.',
    },
    deliverables: [
      { fr: 'Nouvelles fonctionnalités', en: 'Feature development' },
      { fr: 'Refonte d’interface', en: 'Interface redesign' },
      { fr: 'Intégrations d’API', en: 'API integrations' },
      // L'IA est UNE capacité parmi d'autres, jamais la spécialité affichée :
      // un portfolio « développeur IA » de plus se confond avec les autres.
      { fr: 'Fonctionnalités IA et automatisations', en: 'AI features and automation' },
      { fr: 'Gains de performance', en: 'Performance improvements' },
    ],
    from: null,
  },
];
