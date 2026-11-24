import { type Project } from './types';

/**
 * Les trois projets, avec leurs vrais visuels. Le texte des cartes (rôle,
 * description, légende de l'image) est celui du DESSIN, mot pour mot, sauf Homecook,
 * absent du dessin : son texte vient des réponses de l'owner. L'étude de
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
 * `year`. Homecook (2023) passe en dernier.
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
    links: [
      {
        kind: 'appStore',
        href: 'https://apps.apple.com/fr/app/imin-event/id6742787345',
      },
    ],
    caseStudy: {
      problem: {
        fr: 'Do&go avait déjà son application événementielle sur iOS, Android et le web. Mais l’interface paraissait brute et datée, l’ergonomie n’avait jamais vraiment été pensée, et les mises à jour ramenaient régulièrement leur lot d’erreurs.',
        en: 'Do&go’s event app was already live on iOS, Android and the web. The interface looked raw and dated, the UX had never been properly thought through, and updates kept bringing errors back.',
      },
      contribution: {
        fr: 'L’équipe avait déjà publié IMIN. J’ai proposé et mené la refonte de l’interface pour qu’elle paraisse plus professionnelle. J’ai construit un tableau de bord d’administration avec de nombreux graphiques, puis écrit les tests et mis en place leur automatisation, côté back-end et front-end, avec Swagger et Postman, ainsi que des tests de performance pour le back-end et le front-end. Le reste de l’application est le travail de l’équipe existante.',
        en: 'The team had already released IMIN. I proposed and carried out a redesign of the interface to make it look more professional. I built an admin dashboard with many charts, then wrote the tests and set up test automation for the backend and the frontend with Swagger and Postman, plus benchmark tests for both. The rest of the app is the existing team’s work.',
      },
      approach: {
        fr: 'J’ai repris seule le design dans Figma, en posant un design system, puis je l’ai intégré moi-même en Flutter\u202f; l’équipe a relu la maquette. En parallèle, nous avons mis en place à plusieurs des tests, des mesures de performance et un back-office web pour suivre l’application et repérer les erreurs d’une version à l’autre.',
        en: 'I handled the redesign on my own: Figma first, with a design system, then the Flutter build, which I also did myself. The team reviewed the design. Alongside that, we built tests, benchmarks and a web admin dashboard together, so we could monitor the app and catch errors between releases.',
      },
      result: {
        fr: 'Le tableau de bord d’administration fonctionne, avec ses graphiques, et les tests sont en place dans le back-office.',
        en: 'The admin dashboard works, charts included, and the tests are set up in the back-office.',
      },
      designTools: ['Figma', 'Design system'],
    },
  },
  {
    slug: 'homecook',
    year: 2023,
    cover: {
      src: '/work/homecook.png',
      width: 1707,
      height: 1067,
      alt: {
        fr: 'Page d’accueil de l’application Homecook\u202f: recherche, menu de navigation et carrousel de recettes',
        en: 'Home page of the Homecook app: search bar, navigation menu and recipe carousel',
      },
    },
    title: { fr: 'Homecook', en: 'Homecook' },
    role: {
      fr: 'DÉVELOPPEMENT BACKEND / API',
      en: 'BACKEND / API DEVELOPMENT',
    },
    summary: {
      fr: 'Une application de recettes réalisée à deux. J’ai développé le backend et l’API.',
      en: 'A recipe app built as a pair. I developed the backend and the API.',
    },
    stack: ['Django REST', 'Next.js'],
    links: [
      { kind: 'demo', href: 'https://homecook-iota.vercel.app/' },
      { kind: 'code', href: 'https://github.com/hagonin/Recipe-Django-NextJs' },
    ],
    caseStudy: {
      problem: {
        fr: 'Une application de recettes, construite à deux avec un autre développeur.',
        en: 'A recipe app, built with one other developer.',
      },
      contribution: {
        fr: 'J’ai développé le backend et l’API. L’interface visible sur l’image est le travail de l’autre développeur.',
        en: 'I developed the backend and the API. The interface shown in the image is the other developer’s work.',
      },
      approach: {
        fr: 'J’ai construit l’API en Django REST, utilisée par le front en Next.js.',
        en: 'I built the API with Django REST, used by the Next.js frontend.',
      },
      result: {
        fr: 'L’application est en ligne et utilisable\u202f: la démo répond.',
        en: 'The app is online and usable: the demo responds.',
      },
      designTools: ['REST API'],
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
    links: [
      {
        kind: 'code',
        href: 'https://github.com/Diginamic-Fil-rouge/Airsen-springboot-angular',
      },
    ],
    caseStudy: {
      problem: {
        fr: 'Airsen est le projet fil rouge de ma formation CDA chez Diginamic, réalisé en équipe de trois. Les informations sur la qualité de l’air sont éparpillées entre trois API. Airsen les trie et les rassemble dans une seule application, avec une carte interactive de plus de 35\u202f000 communes, des alertes personnalisables et un forum communautaire.',
        en: 'Airsen is the capstone project of my CDA training at Diginamic, built in a team of three. Air-quality data is spread across three different APIs. Airsen filters it, keeps what’s useful and puts it in one app: an interactive map of 35,000+ French municipalities, alerts you can customize, and a community forum.',
      },
      contribution: {
        fr: 'J’ai réalisé les wireframes et organisé le travail de l’équipe dans GitHub Projects.',
        en: 'I made the wireframes and organized the team’s work in GitHub Projects.',
      },
      approach: {
        fr: 'Tout l’enjeu UX était de rendre lisible une information très dense, sur des écrans concrets. Passer d’abord par Figma, avec un design system, a aidé l’équipe à cerner le périmètre avant d’écrire la moindre ligne de code.',
        en: 'The main UX problem was density: a lot of information that still had to read clearly on real screens. Starting in Figma, with a design system, gave the team a clear view of the scope before anyone wrote code.',
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
