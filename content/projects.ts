import { type Project } from './types';

/**
 * Les trois projets, avec leurs vrais visuels. Le texte des cartes (rôle,
 * description, légende de l'image) est celui du DESSIN, mot pour mot. L'étude de
 * cas (`caseStudy`) et la pile (`stack`) viennent des réponses de l'owner,
 * réécrites par langue et validées : rien n'y est ajouté. Le français porte
 * l'espace fine insécable (`\u202f`) avant « ; » et dans « 35 000 ».
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
    stack: [
      'Flutter',
      'Dart',
      'Riverpod',
      'Node.js',
      'Redis',
      'Firebase',
      'Material 3',
    ],
    url: 'https://apps.apple.com/fr/app/imin-event/id6742787345',
    caseStudy: {
      problem: {
        fr: 'Do&go avait déjà son application événementielle sur iOS, Android et le web. Mais l’interface paraissait brute et datée, l’ergonomie n’avait jamais vraiment été pensée, et les mises à jour ramenaient régulièrement leur lot d’erreurs.',
        en: 'Do&go’s event app was already live on iOS, Android and the web. The interface looked raw and dated, the UX had never been properly thought through, and updates kept bringing errors back.',
      },
      approach: {
        fr: 'J’ai repris seule le design dans Figma, en posant un design system, puis je l’ai intégré moi-même en Flutter\u202f; l’équipe a relu la maquette. En parallèle, nous avons mis en place à plusieurs des tests, des mesures de performance et un back-office web pour suivre l’application et repérer les erreurs d’une version à l’autre.',
        en: 'I handled the redesign on my own: Figma first, with a design system, then the Flutter build, which I also did myself. The team reviewed the design. Alongside that, we built tests, benchmarks and a web admin dashboard together, so we could monitor the app and catch errors between releases.',
      },
      result: {
        fr: 'L’application, refondue et refactorisée, est en pleine phase de tests avant sa mise à jour. Les premiers retours parlent d’une interface plus agréable et d’une expérience améliorée.',
        en: 'The redesigned and refactored app is now going through extensive testing before the update ships. Early feedback says the interface is nicer and the experience has improved.',
      },
      designTools: ['Figma', 'Design system'],
    },
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
    stack: ['React', 'TypeScript', 'Python (FastAPI)', 'PostgreSQL', 'Deepgram'],
    caseStudy: {
      problem: {
        fr: 'Un outil que je me suis construit, surtout pour mes réunions. Les solutions existantes ne couvraient pas tout ce dont j’avais besoin, et leur ergonomie laissait à désirer.',
        en: 'A tool I built for myself, mostly for meetings. The existing options were missing features I needed, and their UI and UX got in the way.',
      },
      approach: {
        fr: 'Comme j’en suis à la fois la conceptrice et la seule utilisatrice, je passe directement de l’idée au concept, puis au code. Pour la transcription en temps réel, j’ai choisi d’afficher un maximum d’erreurs plutôt que de les cacher. Quand quelque chose casse, je vois tout de suite quoi corriger. Un mois de travail jusqu’ici, et le chantier continue.',
        en: 'Since I’m both the designer and the only user, I go straight from idea to concept to code. For real-time transcription, I show as many errors as possible instead of hiding them, so when something breaks I know right away what to fix. One month in, and still going.',
      },
      result: {
        fr: 'Pas encore en production. L’application est en phase de test et je n’ai pas encore de chiffres à partager.',
        en: 'Not in production yet. The app is still being tested, and there are no numbers to share so far.',
      },
      designTools: ['Figma', 'Design system'],
    },
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
    stack: [
      'Java 21',
      'Spring Boot',
      'Angular',
      'TypeScript',
      'MariaDB',
      'Redis',
      'Docker',
    ],
    caseStudy: {
      problem: {
        fr: 'Les informations sur la qualité de l’air sont éparpillées entre trois API. Airsen les trie et les rassemble dans une seule application, avec une carte interactive de plus de 35\u202f000 communes, des alertes personnalisables et un forum communautaire.',
        en: 'Air-quality data is spread across three different APIs. Airsen filters it, keeps what’s useful and puts it in one app: an interactive map of 35,000+ French municipalities, alerts you can customize, and a community forum.',
      },
      approach: {
        fr: 'J’ai encadré une équipe de trois développeurs. Tout l’enjeu UX était de rendre lisible une information très dense, sur des écrans concrets. Passer d’abord par Figma, avec un design system, a aidé l’équipe à cerner le périmètre avant d’écrire la moindre ligne de code.',
        en: 'I was team lead for three developers. The main UX problem was density: a lot of information that still had to read clearly on real screens. Starting in Figma, with a design system, gave the team a clear view of the scope before anyone wrote code.',
      },
      result: {
        fr: 'Pas encore lancée. L’application est toujours en développement.',
        en: 'Not launched yet. The app is still in development.',
      },
      designTools: ['Figma', 'Design system'],
    },
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
