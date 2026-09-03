import type { ServiceKey } from '@/content/types';

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
    services: 'Prestations',
    work: 'Travaux',
    contact: 'Contact',
    skipToContent: 'Aller au contenu',
  },
  brand: {
    name: 'Chạm',
    // « Chạm » : toucher, entrer en contact. La marque explique le geste, pas
    // l'inverse — cette ligne reste courte partout où elle apparaît.
    meaning: 'toucher, entrer en contact',
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
      title: 'Des sites et des outils qui donnent envie d’écrire.',
      lead: 'Studio indépendant à Montpellier. Je conçois et je développe — même personne du premier croquis à la mise en ligne.',
      cta: 'Parler de votre projet',
    },
    situations: {
      title: 'Où en êtes-vous ?',
      // Chaque situation mène à la prestation correspondante : c'est la seule
      // navigation interne de la page.
      // Typé sur ServiceKey : une situation ne peut pas pointer vers une
      // prestation qui n'existe pas.
      items: [
        { text: 'Je n’ai rien en ligne et je perds des clients.', service: 'vitrine' },
        { text: 'Mon activité n’a pas d’image reconnaissable.', service: 'identite' },
        {
          text: 'Je gère mon métier dans un tableur qui craque.',
          service: 'application',
        },
        { text: 'Mon site existe mais il ne convertit plus.', service: 'refonte' },
      ] as { text: string; service: ServiceKey }[],
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
    contact: {
      title: 'Parlons de votre projet',
      body: 'Décrivez en quelques lignes ce que vous voulez faire. Je réponds sous 24 h, en français ou en anglais.',
      cta: 'Écrire au studio',
    },
  },
  pricing: {
    // Les coefficients reposent sur un échantillon de deux : la mention rend le
    // provisoire visible au prospect plutôt qu'à nous seuls.
    indicative: 'Tarifs indicatifs 2026',
    from: 'À partir de',
    estimate: 'Estimation',
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
