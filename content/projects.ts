import { type Project } from './types';

/**
 * Les trois projets, avec leurs vrais visuels. Plus de réserve : le fichier
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
        fr: 'Trois écrans de l’application IMIN : la fiche d’un groupe, la liste des événements et le détail d’un événement avec les réponses des membres.',
        en: 'Three IMIN screens: a group page, the event list, and an event detail with each member’s response.',
      },
    },
    title: { fr: 'IMIN Event', en: 'IMIN Event' },
    role: {
      fr: 'Refonte d’interface et développement',
      en: 'Interface redesign and development',
    },
    summary: {
      fr: 'Une application de gestion de présence pour clubs, associations et équipes, en ligne sur iOS et Android depuis trois ans. J’ai refait son interface — système de design, bibliothèque de composants, 44 écrans — dans un produit qui avait déjà ses utilisateurs.',
      en: 'An attendance app for clubs, associations and teams, live on iOS and Android for three years. I rebuilt its interface — a design system, a component library and 44 screens — inside a product that already had users.',
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
        fr: 'Le panneau de capture audio de Conversation Copilot : choix du micro, langue de transcription, case « résumé local uniquement » et niveaux séparés pour les deux voix.',
        en: 'Conversation Copilot’s audio capture panel: microphone choice, transcription language, a “local summary only” checkbox, and separate level meters for the two voices.',
      },
    },
    title: { fr: 'Conversation Copilot', en: 'Conversation Copilot' },
    role: {
      fr: 'Conception et développement, en solo',
      en: 'Design and development, solo',
    },
    summary: {
      fr: 'Un assistant temps réel pour les appels visio : il transcrit les deux voix, répond à partir de mes propres notes, et garde sur un modèle local tout ce qui est marqué confidentiel. Construit pour un seul utilisateur — moi — et mesuré dès le premier jour.',
      en: 'A real-time assistant for video calls: it transcribes both sides, answers from my own notes, and keeps anything marked confidential on a local model. Built for one user — me — and measured from the first day.',
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
        fr: 'La carte d’Airsen sur Clermont-Ferrand : indice de qualité de l’air à 2 (moyen) et graphique des polluants détectés, à côté de la carte de la commune.',
        en: 'Airsen’s map over Clermont-Ferrand: an air quality index of 2 (moderate) and a chart of detected pollutants, beside the commune map.',
      },
    },
    title: { fr: 'Airsen', en: 'Airsen' },
    role: {
      fr: 'Conception UI/UX et développement full-stack',
      en: 'UI/UX design and full-stack development',
    },
    summary: {
      fr: 'Une plateforme de qualité de l’air et de météo qui couvre toutes les communes françaises, y compris les 15 000 sans station de mesure. Construite à trois développeurs ; j’ai conçu l’interface et pris en charge la carte, l’authentification et le système d’alertes. Toujours en développement.',
      en: 'An air quality and weather platform covering every French commune, including the 15,000 with no monitoring station of their own. Built with two other developers; I designed the interface and owned the map, authentication and the alerting system. Still in development.',
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
