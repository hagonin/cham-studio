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
  home: {
    status: {
      availability: 'Available for new projects',
      replyTime: 'Reply within 24h',
      clockLabel: 'Local time in Montpellier',
    },
    hero: {
      title: 'Sites and tools that make people want to write to you.',
      lead: 'Independent studio in Montpellier, France. I design and I build — same person from the first sketch to launch.',
      cta: 'Talk about your project',
    },
    situations: {
      title: 'Where are you?',
      items: [
        { text: 'I have nothing online and I am losing clients.', service: 'vitrine' },
        { text: 'My business has no recognisable image.', service: 'identite' },
        {
          text: 'I run my business on a spreadsheet that is buckling.',
          service: 'application',
        },
        { text: 'My site exists but it no longer converts.', service: 'refonte' },
      ],
    },
    services: {
      title: 'Services',
      deliverablesLabel: 'What you get',
      // « Sur devis » : « on request » plutôt que « quotation », qui sonne
      // administratif à un lecteur anglophone.
      quoteOnRequest: 'On request',
      open: 'Expand',
      close: 'Collapse',
    },
    approach: {
      problem: 'Problem',
      solution: 'Solution',
      title: 'One person, from the first sketch to launch',
      body: 'No handover between a design studio and a development agency: the hand that draws is the hand that codes. What is promised is what ships, because nobody else has to interpret it.',
    },
    contact: {
      title: 'Let us talk about your project',
      body: 'Describe in a few lines what you want to build. I reply within 24 hours, in English or in French.',
      cta: 'Write to the studio',
    },
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
