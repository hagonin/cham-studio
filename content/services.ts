import { BASE } from '@/lib/pricing/model';
import { type Service } from './types';

/**
 * Les quatre `from` DÉRIVENT de `BASE` (`lib/pricing/model.ts`) : un plancher
 * retapé ici pourrait diverger de l'estimateur affiché sur la même page.
 *
 * PLANCHERS NON VALIDÉS : ils viennent d'un benchmark, pas d'une décision.
 * `PRICES_CONFIRMED` reste `false` et bloque la mise en production — ils sont
 * donc visibles en dev et en préversion, jamais en ligne.
 */
export const services: Service[] = [
  {
    key: 'vitrine',
    title: { fr: 'Site vitrine', en: 'Marketing site' },
    summary: {
      fr: 'Un site qui présente une activité et donne envie de vous écrire.',
      en: 'A site that presents the business and makes people want to write to you.',
    },
    deliverables: [
      { fr: 'Arborescence et contenus', en: 'Structure and content' },
      { fr: 'Design sur mesure', en: 'Bespoke design' },
      { fr: 'Développement et mise en ligne', en: 'Build and launch' },
    ],
    from: BASE.vitrine,
  },
  {
    key: 'identite',
    title: { fr: 'Identité', en: 'Brand identity' },
    summary: {
      fr: 'Un nom, une typographie, une palette : de quoi être reconnaissable.',
      en: 'A name, a typeface, a palette — enough to be recognisable.',
    },
    deliverables: [
      { fr: 'Recherche et direction', en: 'Research and direction' },
      { fr: 'Logotype et déclinaisons', en: 'Logotype and variants' },
      { fr: 'Guide d’usage', en: 'Usage guide' },
    ],
    from: BASE.identite,
  },
  {
    key: 'application',
    title: { fr: 'Application web', en: 'Web application' },
    summary: {
      fr: 'Un outil métier sur mesure, pensé pour les gens qui s’en servent.',
      en: 'A bespoke internal tool, designed around the people who use it.',
    },
    deliverables: [
      { fr: 'Cadrage fonctionnel', en: 'Scoping' },
      { fr: 'Interface et parcours', en: 'Interface and flows' },
      { fr: 'Développement et reprise', en: 'Build and handover' },
    ],
    from: BASE.application,
  },
  {
    key: 'refonte',
    title: { fr: 'Refonte', en: 'Redesign' },
    summary: {
      fr: 'Un site existant remis d’aplomb : lisibilité, vitesse, conversion.',
      en: 'An existing site set straight: legibility, speed, conversion.',
    },
    deliverables: [
      { fr: 'Audit de l’existant', en: 'Audit of what exists' },
      { fr: 'Reprise du contenu', en: 'Content migration' },
      { fr: 'Refonte et bascule', en: 'Rebuild and switchover' },
    ],
    from: BASE.refonte,
  },
];
