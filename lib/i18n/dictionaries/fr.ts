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
