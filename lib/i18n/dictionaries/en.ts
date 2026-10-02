import type { Dictionary } from './fr';

/**
 * Cette locale est publiée (`PUBLISHED` dans config.ts). Le texte de la page est
 * celui du dessin, mot pour mot ; le reste (l'estimateur de prix, hors page)
 * est un premier jet qu'une seconde personne n'a pas relu.
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
    menu: 'Menu',
    close: 'Close',
    scroll: 'Scroll',
  },
  brand: {
    name: 'Chạm',
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
      eyebrow: [
        'CHẠM / VERB / TO TOUCH',
        'AN IDEA BECOMES A PRODUCT THROUGH CONNECTION',
      ],
      contactLabel: 'Make contact',
      title: ['A human touch,', 'from idea to product'],
      intro: {
        lead: 'Chạm is where design and technology come together to turn early ideas into meaningful digital products.',
        body: 'I work across the full product journey - shaping the concept, designing the experience and interface, building the product, and taking it through to launch.',
      },
      scrollLabel: 'Scroll to section 2 of 5',
      collab: 'AVAILABLE FOR COLLABORATION',
    },
    touchPhilosophy: {
      meta: ['02 / 05', 'DESIGN × CODE', 'MOVE · SCROLL · TOUCH'],
      hint: 'MOVE CLOSER. PUSH THE WORDS.',
      lines: [
        'I DESIGN THOUGHTFUL',
        'INTERFACES AND BUILD THEM',
        'INTO REAL PRODUCTS.',
        'YOU DON’T ONLY READ CHẠM.',
        'YOU TOUCH IT.',
      ],
    },
    about: {
      eyebrow: ['03 · ABOUT ME', 'DESIGN × CODE'],
      title: ['I build where visual craft', 'meets what’s under the hood.'],
      lede: 'I build web interfaces and applications where the visual craft matters as much as what happens under the hood. The detail that makes a page pleasant to use interests me as much as the code that runs it.',
      photoLead: {
        tag: 'PHOTO 01 · IN THE MAKING',
        caption: 'A moment from the process — sketching, prototyping, or building.',
      },
      photoPair: ['PHOTO 02 · COLLABORATION', 'PHOTO 03 · IN CONTEXT'],
      now: {
        eyebrow: 'NOW · ONGOING',
        line: ['Learning is part', 'of the practice.'],
        paragraph:
          'Since then I keep learning, on both the dev and design sides, because the field moves fast — and that’s part of the fun. What drives me is building solutions that genuinely serve the people using them, with clean code and a polished interface.',
        tooling:
          'Day to day, I work with agentic AI tools to move faster, from prototype to refactoring, without ever losing control of code quality and architecture.',
        chips: ['CLAUDE CODE', 'CODEX', 'ANTIGRAVITY'],
      },
      invite: {
        eyebrow: ['THE NEXT CHAPTER', 'COULD BE OURS.'],
        headline: ['Meaningful work.', 'Ambitious ideas.', 'Clear communication.'],
        paragraph:
          'I’m keen to collaborate on projects that have meaning and ambition, with clear communication at every step. If that’s yours,',
        link: 'get in touch',
      },
    },
    work: {
      meta: ['04 / 05', 'SELECTED WORKS', 'DESIGN × CODE'],
      carouselLabel: 'Selected project previews. Drag or use arrow keys to explore.',
      hint: 'DRAG TO EXPLORE',
      unfold: '[ UNFOLD + ]',
      fold: '[ FOLD − ]',
      previous: 'Previous project',
      next: 'Next project',
      select: 'Select {title}',
      unfoldLabel: 'Unfold {title} project details',
      foldLabel: 'Fold {title} project details',
      announceOpen: '{n} of {total}: {title}. Details open.',
      announceClosed: '{n} of {total}: {title}. Select to unfold details.',
      title: 'Selected works',
      lead: ['A few selected projects.', 'From the first idea to the working product.'],
      explore: 'EXPLORE THE INTERFACE ↗',
      enlarge: 'Enlarge {title} preview',
      lightbox: 'Project preview',
      close: 'CLOSE ×',
      closeLabel: 'Close preview',
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
      eyebrow: 'LET’S START THE CONVERSATION',
      title: {
        first: 'GREAT IDEAS',
        bridge: 'START WITH',
        second: 'A HUMAN TOUCH',
      },
      form: {
        name: 'YOUR NAME*',
        phone: 'PHONE',
        optional: '(OPTIONAL)',
        email: 'YOUR EMAIL*',
        message: 'HOW CAN I HELP YOU?*',
        budgetLegend: 'PROJECT BUDGET (EUR)',
        budget: [
          { label: 'UNDER 5K', value: 'Under €5k' },
          { label: '5K–10K', value: '€5–10k' },
          { label: '10K+', value: '€10k+' },
          { label: 'TO DISCUSS', value: 'To discuss' },
        ],
        submit: 'DISCUSS THE PROJECT',
        note: 'Opens your email app with your project details. Nothing is sent automatically.',
        ready: 'Your email draft is ready. Review and send it in your email app.',
        retry: 'Open email draft',
        draft: {
          subject: 'Project enquiry — {name}',
          body: 'Hello CHẠM,\n\n{message}\n\nName: {name}\nEmail: {email}\nPhone: {phone}\nProject budget: {budget}',
          noPhone: 'Not provided',
        },
      },
      footer: {
        direct: 'A conversation is a good place to start.',
        navLabel: 'Footer navigation',
        tagline: [
          'Thoughtful interfaces.',
          'Working products.',
          'Design × fullstack development.',
        ],
        spread: ['[ DESIGN ]', '[ CODE ]'],
        backToTop: '[ BACK TO TOP ↑ ]',
        meta: ['DESIGN × CODE', 'DESIGNED & BUILT BY CHẠM'],
        rights: 'CHẠM. ALL RIGHTS RESERVED.',
        signature: 'CHẠM.',
      },
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
