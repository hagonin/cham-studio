import { type Project } from './types';

/**
 * RÉSERVE DE DÉVELOPPEMENT — ne part jamais en production.
 *
 * `content/projects.ts` ne charge cette liste que sous `NODE_ENV`
 * `development`, c'est-à-dire `pnpm dev` seul : les tests (`test`) et le build
 * (`production`) voient une liste vide, donc les gardes existantes restent
 * vertes et la section travaux ne peut pas s'afficher en ligne avec des
 * visuels de réserve (F4).
 *
 * CE QUI A CHANGÉ : les TEXTES sont désormais RÉELS — vrais projets, vrais
 * rôles, vrais slugs. Seules les IMAGES restent de réserve, parce qu'elles
 * n'existent pas encore. On ne juge pas un rythme de page sur du faux texte :
 * la longueur d'un résumé décide de la composition, et un lorem ipsum ment sur
 * cette longueur. Le prix de ce choix est la perte du premier filet (les slugs
 * `exemple-*`), ce qui est assumé : le filet qui compte est celui de la CI.
 *
 * Deux filets restent, et ce sont les deux qui bloquent réellement :
 *  1. les `alt` contiennent `ph-label`, la chaîne que la garde CI cherche dans
 *     `.next/server/app/` — si cette liste fuitait dans un build, la CI échoue
 *     au lieu de publier ;
 *  2. `projects.ts` reste `[]` hors `pnpm dev`, donc rien de tout ceci n'a de
 *     chemin vers la production.
 *
 * Pour passer un projet en réel : le déplacer dans `projects.ts`, remplacer le
 * visuel et réécrire l'`alt`. Le build échoue tant qu'il reste `ph-label`.
 * La section n'apparaît qu'à DEUX projets réels (`MIN_PROJECTS_TO_PUBLISH`) :
 * une liste d'un seul élément se lit comme un abandon, pas comme une sélection.
 *
 * Ordre : `projectsNewestFirst()` trie sur `year`, jamais à la main. IMIN et
 * Conversation Copilot partagent 2026 ; `sort` étant stable, c'est l'ordre de
 * ce tableau qui départage — d'où IMIN en premier, le seul des trois dont le
 * travail est public et vérifiable.
 */
export const devProjects: Project[] = [
  {
    slug: 'imin',
    year: 2026,
    cover: {
      src: '/work/ph-cover-01.png',
      width: 1600,
      height: 1000,
      alt: { fr: 'ph-label réserve 01', en: 'ph-label placeholder 01' },
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
      src: '/work/ph-cover-02.png',
      width: 1600,
      height: 1000,
      alt: { fr: 'ph-label réserve 02', en: 'ph-label placeholder 02' },
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
      src: '/work/ph-cover-03.png',
      width: 1600,
      height: 1000,
      alt: { fr: 'ph-label réserve 03', en: 'ph-label placeholder 03' },
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
