/**
 * Source de vérité de la forme du dictionnaire. `en.ts` est typé contre ce
 * fichier : une clé manquante côté anglais casse `tsc`, elle ne retombe pas
 * silencieusement sur le français.
 *
 * Ici, de la prose uniquement. Les données structurées — services, prix,
 * projets — vivent dans `content/` : un projet n'est pas une chaîne traduite.
 */
export const fr = {
  meta: {
    title: 'Chạm Studio — design et développement web',
    description:
      'Studio indépendant à Montpellier. Sites vitrines, identités et applications web, conçus et développés de bout en bout.',
  },
  nav: {
    label: 'Navigation principale',
    // L'étiquette du wordmark, qui ramène en haut de page.
    logoLabel: 'CHẠM — retour en haut',
    about: 'À propos',
    work: 'Projets',
    services: 'Services',
    contact: 'Contact',
    // Le bouton de la barre : même cible que « Contact », hors de la liste.
    contactMe: 'Écrivez-moi',
    skipToContent: 'Aller au contenu',
    // Le bouton porte les deux libellés : c'est le MÊME bouton qui bascule,
    // pas deux commandes. `aria-expanded` dit l'état, le libellé dit l'action.
    menu: 'Menu',
    close: 'Fermer',
    // L'indicateur sous le hero. Décoratif, mais VISIBLE : donc dans la langue
    // de la page, pas un « scroll » anglais posé sur une page française.
    scroll: 'Défiler',
  },
  brand: {
    name: 'Chạm',
    // Verrou de marque, pas de la prose : identique dans les deux locales. Le
    // « × » est le point de contact des deux métiers — c'est lui, et lui seul,
    // qui porte la couleur dans le hero.
    positioning: 'Design × Code',
  },
  // Le rideau d'ouverture. Les espaces insécables sont ceux du dessin : ils
  // tiennent les barres obliques et les points médians à distance de lecture.
  loader: {
    label: 'chạm \u00a0 / verbe / \u00a0 toucher.',
    note: 'APPROCHE \u00a0·\u00a0 CONTACT \u00a0·\u00a0 RÉVÉLATION',
  },
  footer: {
    location: 'Montpellier, France',
    legalNotice: 'Mentions légales',
    privacy: 'Confidentialité',
    rights: 'Tous droits réservés',
  },
  langSwitch: {
    label: 'Changer de langue',
    fr: 'Français',
    en: 'English',
  },
  /**
   * COPIE APPROUVÉE — voir `COPY_CONFIRMED` dans config.ts.
   * L'anglais de la page est celui du dessin, mot pour mot ; le français est
   * celui du deck `copy-fr.md`, écrit et non traduit. Les textes se remplacent
   * sans toucher au code : la structure est déjà typée.
   */
  home: {
    status: {
      clockLabel: 'Heure locale à Montpellier',
    },
    hero: {
      // Le hero du dessin, et rien d'autre : une ligne de repères, le logotype
      // DESIGN × CODE avec son bouton de contact, le portrait, la phrase et son
      // paragraphe, l'indicateur de défilement. Les libellés en capitales sont
      // LITTÉRAUX (copy-fr.md), pour que « Chạm » y garde son « Ạ ».
      eyebrow: ['CHẠM / VERBE / TOUCHER', 'UNE IDÉE DEVIENT UN PRODUIT AU CONTACT.'],
      contactLabel: 'Établir le contact',
      // La phrase du dessin : c'est le <h1> de la page, sur deux lignes.
      title: ['Une touche humaine,', 'de l’idée au produit.'],
      intro:
        'Chạm, c’est ma pratique, à la croisée de l’UX, du design et du développement fullstack. Des interfaces réfléchies. Des produits qui fonctionnent.',
      scrollLabel: 'Aller à la section 2 sur 5',
    },
    touchPhilosophy: {
      // La scène tactile du dessin (copy-fr.md). Le numéro « 02 / 05 » encode la
      // place de la section dans la page (voir `lib/sections.ts`) sans en être
      // dérivé : changer l'ordre le périme. Les lignes sont rendues dans un
      // <h2> — texte réel dans le HTML servi — puis reprises par le canevas.
      meta: ['02 / 05', 'DESIGN × CODE', 'BOUGER · DÉFILER · TOUCHER'],
      hint: 'APPROCHEZ. POUSSEZ LES MOTS.',
      lines: [
        'JE CONÇOIS DES INTERFACES',
        'RÉFLÉCHIES ET J’EN FAIS',
        'DE VRAIS PRODUITS.',
        'ON NE FAIT PAS QUE LIRE CHẠM.',
        'ON LE TOUCHE.',
      ],
    },
    about: {
      // Le bloc « à propos » du dessin (copy-fr.md). Le numéro « 03 » encode la
      // place de la section dans la page (voir `lib/sections.ts`) sans en être
      // dérivé. Les libellés en capitales sont LITTÉRAUX. La chronologie vit
      // dans `content/about.ts` : ce sont des enregistrements, pas de la prose.
      eyebrow: ['03 · À PROPOS', 'DESIGN × CODE'],
      title: ['Je construis là où le visuel', 'rencontre ce qui tourne sous le capot.'],
      lede: 'Je conçois des interfaces et des applications web où le soin visuel compte autant que ce qui se passe sous le capot. Le détail qui rend une page agréable à utiliser m’intéresse autant que le code qui la fait tourner.',
      photoLead: {
        tag: 'PHOTO 01 · EN FABRICATION',
        caption: 'Un moment du processus — esquisser, prototyper ou construire.',
      },
      photoPair: ['PHOTO 02 · COLLABORATION', 'PHOTO 03 · EN SITUATION'],
      now: {
        eyebrow: 'MAINTENANT · EN COURS',
        line: ['Apprendre fait partie', 'de la pratique.'],
        paragraph:
          'Depuis, je continue d’apprendre, côté dev comme côté design, parce que le domaine bouge vite — et ça fait partie du plaisir. Ce qui me motive, c’est de construire des solutions vraiment utiles aux personnes qui s’en servent, avec un code propre et une interface soignée.',
        tooling:
          'Au quotidien, je travaille avec des outils d’IA agentique pour aller plus vite, du prototype au refactoring, sans jamais perdre la main sur la qualité du code et l’architecture.',
        chips: ['CLAUDE CODE', 'CODEX', 'ANTIGRAVITY'],
      },
      invite: {
        eyebrow: ['LE PROCHAIN CHAPITRE', 'POURRAIT ÊTRE LE NÔTRE.'],
        headline: [
          'Un travail qui a du sens.',
          'Des idées ambitieuses.',
          'Une communication claire.',
        ],
        paragraph:
          'J’ai envie de collaborer sur des projets qui ont du sens et de l’ambition, avec une communication claire à chaque étape. Si c’est le vôtre,',
        link: 'écrivez-moi',
      },
    },
    work: {
      // La section « travaux » du dessin (copy-fr.md). Les gabarits portent
      // `{title}`, `{n}` et `{total}` : la phrase s'écrit en entier dans chaque
      // langue. Les libellés en capitales sont LITTÉRAUX. Le « 04 » encode la
      // place de la section dans la page (voir `lib/sections.ts`).
      meta: ['04 / 05', 'PROJETS CHOISIS', 'DESIGN × CODE'],
      carouselLabel:
        'Aperçus des projets choisis. Faites glisser ou utilisez les flèches pour explorer.',
      hint: 'GLISSER POUR EXPLORER',
      unfold: '[ DÉPLIER + ]',
      fold: '[ REPLIER − ]',
      previous: 'Projet précédent',
      next: 'Projet suivant',
      select: 'Sélectionner {title}',
      unfoldLabel: 'Déplier les détails du projet {title}',
      foldLabel: 'Replier les détails du projet {title}',
      announceOpen: '{n} sur {total}\u202f: {title}. Détails ouverts.',
      announceClosed:
        '{n} sur {total}\u202f: {title}. Sélectionnez pour déplier les détails.',
      title: 'Projets choisis',
      lead: [
        'Quelques projets choisis.',
        'De la première idée au produit qui fonctionne.',
      ],
      explore: 'EXPLORER L’INTERFACE ↗',
      enlarge: 'Agrandir l’aperçu de {title}',
      lightbox: 'Aperçu du projet',
      close: 'FERMER ×',
      closeLabel: 'Fermer l’aperçu',
    },
    services: {
      title: 'Prestations',
      deliverablesLabel: 'Ce qui est livré',
      quoteOnRequest: 'Sur devis',
      open: 'Déplier',
      close: 'Replier',
    },
    process: {
      // Le bloc « prestations » du dessin : trois disciplines, pas les offres de
      // `content/services.ts`, qui n'ont plus de place sur la page. Le composant
      // s'appelle encore `Process`. Le titre tient sur deux lignes, comme
      // « Derrière / Chạm » — deux éléments distincts, pas une phrase coupée.
      title: ['De la première idée', 'au dernier détail.'],
      steps: [
        {
          title: 'Design produit et UX',
          body: 'Des parcours, des prototypes et des interfaces pensés pour la façon dont on utilise vraiment un produit.',
        },
        {
          title: 'Développement fullstack',
          body: 'Des interfaces responsives, des API et les systèmes qui font d’un design réfléchi un produit qui fonctionne.',
        },
        {
          title: 'Interaction et finitions',
          body: 'Le mouvement, l’accessibilité et les petites réactions qui rendent une interface attentive.',
        },
      ],
    },
    contact: {
      // La section contact et son pied de page, tels que le dessin les écrit
      // (copy-fr.md). Les libellés en capitales sont LITTÉRAUX : un `<p>` en
      // majuscules par le CSS est refusé par `check:html`, et des capitales
      // accentuées ne se calculent pas, elles s'écrivent. Les flèches « ↗ » sont
      // décoratives et vivent dans le balisage, pas ici. Les gabarits du brouillon
      // portent `{name}`, `{email}`, `{message}`, `{phone}` et `{budget}` ; les
      // `value` des boutons radio voyagent dans ce brouillon, donc ils sont
      // localisés eux aussi. Le dernier choix du budget est celui coché d'office.
      eyebrow: 'ENGAGEONS LA CONVERSATION',
      title: {
        first: 'LES GRANDES IDÉES',
        bridge: 'COMMENCENT PAR',
        second: 'UNE TOUCHE HUMAINE',
      },
      form: {
        name: 'VOTRE NOM*',
        phone: 'TÉLÉPHONE',
        optional: '(FACULTATIF)',
        email: 'VOTRE E-MAIL*',
        message: 'COMMENT PUIS-JE VOUS AIDER\u202f?*',
        budgetLegend: 'BUDGET DU PROJET (EUR)',
        budget: [
          { label: 'MOINS DE 5 K€', value: 'Moins de 5 k€' },
          { label: '5–10 K€', value: '5–10 k€' },
          { label: '10 K€ ET +', value: '10 k€ et plus' },
          { label: 'À DISCUTER', value: 'À discuter' },
        ],
        submit: 'PARLONS DU PROJET',
        note: 'Ouvre votre messagerie avec les détails de votre projet. Rien n’est envoyé automatiquement.',
        ready:
          'Votre brouillon est prêt. Relisez-le et envoyez-le depuis votre messagerie.',
        retry: 'Ouvrir le brouillon',
        draft: {
          subject: 'Demande de projet — {name}',
          body: 'Bonjour CHẠM,\n\n{message}\n\nNom : {name}\nE-mail : {email}\nTéléphone : {phone}\nBudget du projet : {budget}',
          noPhone: 'Non renseigné',
        },
      },
      footer: {
        direct: 'Une conversation, c’est un bon début.',
        navLabel: 'Navigation de pied de page',
        tagline: [
          'Des interfaces réfléchies.',
          'Des produits qui fonctionnent.',
          'Design × développement fullstack.',
        ],
        spread: ['[ DESIGN ]', '[ CODE ]'],
        backToTop: '[ HAUT DE PAGE ↑ ]',
        meta: ['DESIGN × CODE', 'CONÇU ET DÉVELOPPÉ PAR CHẠM'],
        rights: 'CHẠM. TOUS DROITS RÉSERVÉS.',
        signature: 'CHẠM.',
      },
    },
  },
  /**
   * La page /projects. Son travail est la PREUVE : les projets d'abord, la
   * personne ensuite. Une page intitulée d'après son auteur invite à passer.
   *
   * Le cadrage est la décision de design : des projets personnels, présentés
   * comme petits et terminés, se lisent comme un choix. Les mêmes projets
   * gonflés pour ressembler à des missions clientes se lisent comme du vide.
   */
  pricing: {
    // Les coefficients reposent sur un échantillon de deux : la mention rend le
    // provisoire visible au prospect plutôt qu'à nous seuls.
    indicative: 'Tarifs indicatifs 2026',
    from: 'À partir de',
    estimate: 'Estimation',
    /**
     * L'estimateur. Les intitulés des prestations ne sont PAS ici : ils
     * viennent de `content/services.ts`, sinon la même prestation porterait
     * deux noms sur la même page.
     */
    estimator: {
      title: 'Estimer votre projet',
      lead: 'Quatre questions pour un ordre de grandeur. Le résultat part par email avec votre configuration.',
      typeLegend: 'Quelle prestation ?',
      scaleLegend: 'Quelle ampleur ?',
      designLegend: 'Quel niveau de design ?',
      featuresLegend: 'Fonctionnalités',
      scales: {
        simple: 'Simple',
        standard: 'Standard',
        etendu: 'Étendu',
      },
      designs: {
        sobre: 'Sobre',
        surMesure: 'Sur mesure',
        signature: 'Signature',
      },
      features: {
        multilingue: 'Plusieurs langues',
        cms: 'Contenus modifiables',
        ecommerce: 'Vente en ligne',
        reservation: 'Prise de rendez-vous',
        compte: 'Comptes utilisateurs',
        integration: 'Connexion à un outil existant',
      },
      resultLabel: 'Estimation',
      durationLabel: 'Délai',
      weeks: 'semaines',
      // Le résultat doit se lire comme une estimation, pas comme un devis :
      // c'est la mention qui empêche la confusion, pas la fourchette.
      notAQuote:
        'Estimation indicative, pas un devis. Le prix définitif est arrêté après un échange.',
      cta: 'Envoyer cette configuration',
      mailSubject: 'Estimation — Chạm Studio',
      mailIntro: 'Bonjour, voici la configuration estimée sur le site :',
    },
  },
  notFound: {
    title: 'Page introuvable',
    body: 'Cette adresse ne mène nulle part.',
    back: 'Retour à l’accueil',
  },
};

// Pas de `as const` : le dictionnaire décrit une FORME, pas un jeu de valeurs.
// Avec des types littéraux, `en.ts` devrait répéter mot pour mot le français.
export type Dictionary = typeof fr;
