import { type Project } from './types';

/**
 * Les trois projets, avec leurs vrais visuels. Le texte (rôle, description, légende
 * de l'image) est celui du DESSIN, mot pour mot ; les récits plus longs de chaque
 * projet (chiffres, pile technique) restent dans l'historique git.
 * Plus de réserve : le fichier
 * `projects.dev.ts` a disparu avec le dernier visuel manquant. Le jour où un
 * quatrième projet attendra son image, le motif se relit dans l'historique —
 * un fichier mort au dépôt aurait pourri avant d'être utile.
 *
 * La section travaux ne paraît qu'à partir de DEUX projets (F4) : une liste
 * d'un seul élément se lit comme un abandon, pas comme une sélection. Le
 * seuil est franchi, donc la section entre dans `MOUNTED_SECTIONS`, la nav
 * gagne son ancre et la route entre au sitemap — sans interrupteur ailleurs.
 *
 * L'ordre écrit ici ne décide de rien : `projectsNewestFirst()` trie sur
 * `year`. IMIN et Copilot partagent 2026 ; `sort` étant stable, c'est l'ordre
 * de ce tableau qui les départage.
 */
const realProjects: Project[] = [
  {
    slug: 'imin',
    year: 2026,
    cover: {
      src: '/work/imin.png',
      width: 1707,
      height: 1067,
      alt: {
        fr: 'Découverte d’événements et fiche détaillée sur mobile',
        en: 'Event discovery and event details on mobile',
      },
    },
    title: { fr: 'IMIN Event', en: 'IMIN Event' },
    role: {
      fr: 'DESIGN PRODUIT / DÉVELOPPEMENT FULLSTACK',
      en: 'PRODUCT DESIGN / FULLSTACK DEVELOPMENT',
    },
    summary: {
      fr: 'Du premier parcours utilisateur au produit qui fonctionne. Une expérience événementielle façonnée par le design et le code.',
      en: 'From the first user flow to the working product. An event experience shaped through design and code.',
    },
    stack: ['Flutter', 'Dart', 'Riverpod', 'Material 3', 'Firebase'],
    url: 'https://apps.apple.com/fr/app/imin-event/id6742787345',
  },
  {
    slug: 'conversation-copilot',
    year: 2026,
    cover: {
      src: '/work/copilot.png',
      width: 1707,
      height: 1067,
      alt: {
        fr: 'Aperçu de l’interface Conversation Copilot',
        en: 'Conversation Copilot interface preview',
      },
    },
    title: { fr: 'Conversation Copilot', en: 'Conversation Copilot' },
    role: {
      fr: 'DESIGN D’INTERFACE / DÉVELOPPEMENT',
      en: 'INTERFACE DESIGN / DEVELOPMENT',
    },
    summary: {
      fr: 'Une interface pour des conversations plus claires. Comment un design réfléchi fait entrer l’IA dans le travail de tous les jours.',
      en: 'An interface for clearer conversations. Exploring how considered design brings AI into everyday work.',
    },
    stack: ['React', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL', 'Deepgram'],
  },
  {
    slug: 'airsen',
    year: 2025,
    cover: {
      src: '/work/airsen.png',
      width: 1707,
      height: 1067,
      alt: {
        fr: 'Aperçu de l’application web Airsen',
        en: 'Airsen web application preview',
      },
    },
    title: { fr: 'Airsen', en: 'Airsen' },
    role: {
      fr: 'UX / APPLICATION WEB',
      en: 'UX / WEB APPLICATION',
    },
    summary: {
      fr: 'Une application web explorée par l’expérience utilisateur, le design d’interface et le souci du détail.',
      en: 'A web application explored through user experience, interface design, and attention to detail.',
    },
    stack: ['Java', 'Spring Boot', 'Angular', 'MariaDB', 'Redis', 'Docker'],
  },
];

export const projects: Project[] = realProjects;

export const MIN_PROJECTS_TO_PUBLISH = 2;

export function workSectionIsReady(): boolean {
  return projects.length >= MIN_PROJECTS_TO_PUBLISH;
}

/**
 * Les entrées de la maquette portaient des slugs `exemple-*`. Le risque n'est
 * pas théorique : il s'est déjà produit une fois, dans le prototype. Un slug
 * de réserve qui atteint la production annonce un résultat qui n'existe pas.
 */
const PLACEHOLDER_SLUG = /exemple|placeholder|nom-du-projet|lorem|todo/i;

export function placeholderSlugs(list: readonly Project[] = projects): string[] {
  return list.filter((p) => PLACEHOLDER_SLUG.test(p.slug)).map((p) => p.slug);
}

/** Ordre d'affichage : le plus récent d'abord, dérivé de `year`. Trier à la
 *  main invite à réordonner pour flatter, et la liste ment dès la deuxième
 *  édition. `slice` parce que `sort` mute, et le module est partagé.
 *
 *  La liste est un paramètre pour que le tri se teste sur des données : sans
 *  cela, `projects` étant vide, la garde ne serait vérifiée que le jour où
 *  elle compte. */
export function projectsNewestFirst(list: readonly Project[] = projects): Project[] {
  return list.slice().sort((a, b) => b.year - a.year);
}
