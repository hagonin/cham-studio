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
    label: 'Sections de la page',
    about: 'À propos',
    services: 'Prestations',
    work: 'Travaux',
    process: 'Méthode',
    contact: 'Contact',
    skipToContent: 'Aller au contenu',
  },
  brand: {
    name: 'Chạm',
    // « Chạm » : toucher, entrer en contact. La marque explique le geste, pas
    // l'inverse — cette ligne reste courte partout où elle apparaît.
    meaning: 'toucher, entrer en contact',
    // Verrou de marque, pas de la prose : identique dans les deux locales. Le
    // « × » est le point de contact des deux métiers — c'est lui, et lui seul,
    // qui porte la couleur dans le hero.
    positioning: 'Design × Code',
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
   * COPIE PROVISOIRE — voir `COPY_CONFIRMED` dans config.ts.
   * Les 132 chaînes rédigées dans le prototype n'étaient pas disponibles ;
   * celles-ci tiennent la forme et la mise en page. Elles se remplacent sans
   * toucher au code : la structure est déjà typée.
   */
  home: {
    status: {
      availability: 'Disponible pour de nouveaux projets',
      replyTime: 'Réponse sous 24 h',
      clockLabel: 'Heure locale à Montpellier',
    },
    hero: {
      // La proposition de valeur est au-dessus de la ligne de flottaison et
      // sans image : le LCP est du texte, donc il est déjà chargé.
      // Décision 18. « Du premier écran à la mise en ligne » est ÉCRIT en
      // français, pas traduit de l'anglais (décision 17) : « écran » est plus
      // concret que « interaction », et « mise en ligne » est le registre du
      // site quand « deployment » est celui de l'ingénierie — d'où « mise en
      // production » dans la ligne suivante, pour tenir les deux.
      title: 'Du premier écran à la mise en ligne.',
      // DÉCISION 19 — LIGNE PORTEUSE, PAS DE L'ACCOMPAGNEMENT.
      // Le titre ne contient aucune première personne : c'est ici, et nulle
      // part ailleurs dans le hero, qu'une personne apparaît. Si le hero doit
      // être resserré, cette ligne est la DERNIÈRE à couper — sans elle le
      // bloc énonce une portée que personne n'assume, exactement la voix
      // passive que docs/positioning.md §6 interdit.
      lead: 'Je conçois et je développe des produits numériques pensés pour durer : une interface claire, un code fiable, une mise en production maîtrisée.',
      cta: 'Parler de votre projet',
      // La phrase de marque. Elle dit le GESTE, jamais la traduction du mot :
      // tests/i18n.test.ts vérifie que le sens de « Chạm » n'est écrit qu'une
      // fois sur le site, dans le bloc « à propos ».
      tagline: 'On ne fait pas que lire Chạm. On le touche.',
      studio: 'Studio indépendant',
      // Cartouche de la figure, dans la langue des planches techniques.
      figureLabel: 'Fig. 01',
      // Le périmètre — PAS une barre de compétences : ni niveau, ni
      // pourcentage, ni logo. Ce que la liste dit, les projets le prouvent.
      expertise: [
        'UI / UX Design',
        'Développement front-end',
        'Produits full-stack',
        'Intégration IA',
      ],
    },
    services: {
      title: 'Prestations',
      deliverablesLabel: 'Ce qui est livré',
      quoteOnRequest: 'Sur devis',
      open: 'Déplier',
      close: 'Replier',
    },
    approach: {
      // ContactLine : PROBLÈME ──────●────── SOLUTION. Le bloc doit se lire
      // entièrement sans JavaScript, dans son état joint.
      problem: 'Problème',
      solution: 'Solution',
      title: 'Une seule personne, du premier croquis à la mise en ligne',
      body: 'Pas de relais entre un studio de design et une agence de développement : le geste qui dessine est celui qui code. Ce qui est promis est ce qui est livré, parce que personne d’autre n’a à l’interpréter.',
    },
    process: {
      // Décision 27 : une ligne continue à cinq points de contact, jamais
      // cinq figures séparées. Le titre tient sur deux lignes, comme
      // « Derrière / Chạm » — deux éléments distincts, pas une phrase coupée.
      title: ['Comment', 'je travaille'],
      steps: [
        {
          title: 'Découvrir',
          body: 'Comprendre l’activité, les utilisateurs, les contraintes et les objectifs.',
        },
        {
          title: 'Définir',
          body: 'Clarifier le périmètre, les priorités, les parcours et l’orientation technique.',
        },
        {
          title: 'Concevoir',
          body: 'Construire la structure, l’interface, les interactions et le prototype.',
        },
        {
          title: 'Développer',
          body: 'Développer le produit et intégrer les services back-end.',
        },
        {
          title: 'Livrer',
          body: 'Déployer, valider, itérer et accompagner le lancement.',
        },
      ],
    },
    contact: {
      title: 'Parlons de votre projet',
      body: 'Décrivez en quelques lignes ce que vous voulez faire. Je réponds sous 24 h, en français ou en anglais.',
      cta: 'Écrire au studio',
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
  work: {
    meta: {
      title: 'Travaux — Chạm Studio',
      description:
        'Projets personnels, conçus et développés de bout en bout. Studio indépendant à Montpellier.',
    },
    title: 'Ce que j’ai construit',
    lead: 'Des projets personnels, menés du premier croquis à la mise en ligne.',
    projects: {
      title: 'Travaux',
      // Nommer la taille désamorce la question. Ne jamais laisser entendre
      // qu'il s'agit de missions clientes : c'est faux, et cela s'apprend.
      framing:
        'Peu de projets, chacun terminé. Ce sont des travaux personnels — ils montrent comment je conçois et comment je code, pas une liste de références.',
      roleLabel: 'Rôle',
      yearLabel: 'Année',
      stackLabel: 'Outils',
      visit: 'Voir le projet',
    },
    about: {
      title: 'Derrière Chạm',
      // Trois lignes, pas un CV. La page vend une façon de penser ; le CV vend
      // un parcours. Ni historique d'emploi ni barres de compétences.
      creed: [
        'Une seule personne, du croquis à la mise en ligne.',
        'Ce qui est promis est ce qui est livré.',
        'Rien en ligne qui ne soit lisible sans JavaScript.',
      ],
      // La seule occurrence du sens de la marque sur le site. Le test
      // tests/i18n.test.ts vérifie qu'elle contient bien brand.meaning.
      meaning:
        'Chạm est un mot vietnamien : toucher, entrer en contact. C’est ce qu’un site doit faire avant tout le reste.',
      body: [
        'Je conçois et je développe seule, ce qui supprime l’endroit où les projets se perdent d’habitude : la transmission entre celui qui dessine et celui qui code. Il n’y a rien à réinterpréter, donc rien à négocier en cours de route.',
        'Je travaille en petit nombre et je termine. Un site livré à moitié ne rapporte rien à personne, et je préfère refuser un projet que le rendre incomplet.',
      ],
    },
  },
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
  /**
   * Libellés du curseur de contact (Phase 10). Ils nomment l'ACTION dans la
   * langue de la page — jamais le mot « touch ». C'est le geste qui porte la
   * marque ; une légende qui l'explique serait le paragraphe que toute cette
   * idée existe pour éviter.
   */
  motion: {
    cursor: {
      read: 'Voir',
      write: 'Écrire',
      open: 'Ouvrir',
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
