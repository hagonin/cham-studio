import type { Dictionary } from './fr';

/**
 * ATTENTION — PREMIER JET, PAS DE LA COPIE. Cette locale n'est pas publiée
 * (`PUBLISHED` dans config.ts) tant qu'une seconde personne ne l'a pas relue.
 *
 * L'anglais est ADAPTÉ, pas traduit : le français s'appuie sur un vocabulaire
 * de marché — « devis », « mentions légales », « TVA non applicable » — qui ne
 * veut rien dire pour un acheteur non français.
 *
 * `satisfies Dictionary` : une clé manquante échoue au build.
 */
export const en = {
  meta: {
    title: 'Chạm Studio — web design and development',
    description:
      'Independent studio in Montpellier, France. Marketing sites, brand identities and web applications, designed and built end to end.',
  },
  nav: {
    services: 'Services',
    work: 'Work',
    contact: 'Contact',
    skipToContent: 'Skip to content',
  },
  brand: {
    name: 'Chạm',
    meaning: 'to touch, to make contact',
  },
  footer: {
    location: 'Montpellier, France',
    // « Mentions légales » est une obligation française sans équivalent exact ;
    // « Legal notice » est l'adaptation la plus lisible pour un lecteur anglophone.
    legalNotice: 'Legal notice',
    privacy: 'Privacy',
    rights: 'All rights reserved',
  },
  langSwitch: {
    label: 'Change language',
    fr: 'Français',
    en: 'English',
  },
  pricing: {
    indicative: 'Indicative 2026 rates',
    from: 'From',
    estimate: 'Estimate',
  },
  notFound: {
    title: 'Page not found',
    body: 'This address does not lead anywhere.',
    back: 'Back to the homepage',
  },
} satisfies Dictionary;
