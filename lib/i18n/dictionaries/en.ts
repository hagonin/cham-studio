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
    label: 'Main navigation',
    // L'étiquette du wordmark, qui ramène en haut de page.
    logoLabel: 'CHẠM — back to top',
    about: 'About me',
    work: 'Works',
    services: 'Services',
    contact: 'Connect',
    // Le bouton de la barre : même cible que « Connect », hors de la liste.
    contactMe: 'Contact me',
    skipToContent: 'Skip to content',
    top: 'Back to top',
    menu: 'Menu',
    close: 'Close',
    scroll: 'Scroll',
  },
  brand: {
    name: 'Chạm',
    meaning: 'to touch, to make contact',
    positioning: 'Design × Code',
  },
  loader: {
    label: 'chạm \u00a0 / verb / \u00a0 to touch.',
    note: 'APPROACH \u00a0·\u00a0 CONTACT \u00a0·\u00a0 REVEAL',
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
      clockLabel: 'Local time in Montpellier',
    },
    hero: {
      // La phrase du dessin, reprise telle quelle : c'est le <h1> de la page.
      title: 'A human touch, from idea to product.',
      // DECISION 19 — LOAD-BEARING, NOT SUPPORTING COPY. The headline carries
      // no first person, so this is the only place someone appears in the
      // hero. Last thing cut if the hero is tightened.
      lead: 'I design and develop digital products that feel considered, work reliably and are ready for real users.',
      cta: 'Talk about your project',
      tagline: 'You don’t only read Chạm. You touch it.',
      studio: 'Independent studio',
      figureLabel: 'Fig. 01',
      expertise: [
        'UI/UX Design',
        'Front-end development',
        'Full-stack products',
        'AI integration',
      ],
    },
    touchPhilosophy: {
      label: 'Design × code',
      hint: 'Move closer. Touch the words.',
      lines: [
        'I DESIGN THOUGHTFUL',
        'INTERFACES AND BUILD',
        'THEM INTO REAL PRODUCTS.',
        'YOU DON’T ONLY READ CHẠM.',
        'YOU TOUCH IT.',
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
    process: {
      title: ['From first thought', 'to final detail.'],
      steps: [
        {
          title: 'Product & UX design',
          body: 'Flows, prototypes, and interfaces shaped around how people actually use a product.',
        },
        {
          title: 'Fullstack development',
          body: 'Responsive frontends, APIs, and the systems that turn a considered design into a working product.',
        },
        {
          title: 'Interaction & refinement',
          body: 'Motion, accessibility, and the small responses that make an interface feel considered.',
        },
      ],
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
      book: {
        hint: 'Swipe',
        previous: 'Previous project',
        next: 'Next project',
      },
    },
    about: {
      title: 'Behind Chạm',
      diagram: {
        label: 'One person, from idea to product.',
        idea: 'Idea',
        product: 'Product',
      },
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
  motion: {
    cursor: {
      read: 'View',
      write: 'Write',
      open: 'Open',
    },
  },
  notFound: {
    title: 'Page not found',
    body: 'This address does not lead anywhere.',
    back: 'Back to the homepage',
  },
} satisfies Dictionary;
