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
  work: {
    meta: {
      title: 'Work — Chạm Studio',
      description:
        'Personal projects, designed and built end to end. Independent studio in Montpellier, France.',
    },
    title: 'What I have built',
    lead: 'Personal projects, carried from the first sketch to launch.',
    projects: {
      title: 'Work',
      framing:
        'Few projects, each one finished. These are personal builds — they show how I design and how I code, not a client list.',
      roleLabel: 'Role',
      yearLabel: 'Year',
      stackLabel: 'Tools',
      visit: 'View the project',
    },
    about: {
      title: 'Behind Chạm',
      creed: [
        'One person, from sketch to launch.',
        'What is promised is what ships.',
        'Nothing goes live that cannot be read without JavaScript.',
      ],
      meaning:
        'Chạm is a Vietnamese word: to touch, to make contact. That is what a site has to do before it does anything else.',
      body: [
        'I design and build alone, which removes the place where projects usually get lost: the handover between the person drawing and the person coding. There is nothing to reinterpret, so there is nothing to renegotiate halfway through.',
        'I take few projects and I finish them. A half-delivered site earns nobody anything, and I would rather turn work down than hand it over incomplete.',
      ],
    },
  },
  pricing: {
    indicative: 'Indicative 2026 rates',
    from: 'From',
    estimate: 'Estimate',
    estimator: {
      title: 'Estimate your project',
      lead: 'Four questions for a ballpark. The result goes out by email with your configuration.',
      typeLegend: 'Which service?',
      scaleLegend: 'How large?',
      designLegend: 'How much design?',
      featuresLegend: 'Features',
      scales: {
        simple: 'Simple',
        standard: 'Standard',
        etendu: 'Extended',
      },
      designs: {
        sobre: 'Plain',
        surMesure: 'Bespoke',
        signature: 'Signature',
      },
      features: {
        multilingue: 'Several languages',
        cms: 'Editable content',
        ecommerce: 'Online sales',
        reservation: 'Appointment booking',
        compte: 'User accounts',
        integration: 'Connection to an existing tool',
      },
      resultLabel: 'Estimate',
      durationLabel: 'Timeline',
      weeks: 'weeks',
      notAQuote:
        'An indicative estimate, not a quote. The final price is settled after a conversation.',
      cta: 'Send this configuration',
      mailSubject: 'Estimate — Chạm Studio',
      mailIntro: 'Hello, here is the configuration estimated on the site:',
    },
  },
  notFound: {
    title: 'Page not found',
    body: 'This address does not lead anywhere.',
    back: 'Back to the homepage',
  },
} satisfies Dictionary;
