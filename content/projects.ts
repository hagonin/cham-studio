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
        fr: 'L’équipe avait déjà publié IMIN. J’ai proposé et mené la refonte de l’interface, puis redessiné le tableau de bord d’administration et ajouté de nombreux graphiques. J’ai écrit seule les tests back-end et leur automatisation (Swagger, Postman), ainsi que les tests de performance du back-end et du tableau de bord. Les tests de l’interface, nous les avons faits avec l’équipe. Le reste de l’application est le travail de l’équipe existante.',
        en: 'The team had already released IMIN. I proposed and led the interface redesign, then redesigned the admin dashboard and added many charts. I wrote the backend tests and their automation alone (Swagger, Postman), plus benchmark tests for the backend and the dashboard. We did the interface tests with the team. The rest of the app is the existing team’s work.',
      },
      approach: {
        fr: 'J’ai repris seule le design dans Figma, en posant un design system, puis je l’ai intégré en Flutter\u202f; l’équipe a relu la maquette. Un back-office web, avec les tests de l’interface faits à plusieurs, sert à suivre l’application et à repérer les erreurs d’une version à l’autre.',
        en: 'I handled the redesign on my own: Figma first, with a design system, then the Flutter build. The team reviewed the design. A web admin dashboard, with interface tests we wrote together, lets us monitor the app and catch errors between releases.',
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
      fr: 'Une application de recettes réalisée à deux. J’ai développé le back-end et l’API.',
      en: 'A recipe app built as a pair. I developed the backend and the API.',
    },
    stack: ['Django REST', 'Next.js'],
    links: [
      { kind: 'demo', href: 'https://homecook-iota.vercel.app/' },
      { kind: 'code', href: 'https://github.com/hagonin/Recipe-Django-NextJs' },
    ],
    caseStudy: {
      problem: {
        fr: 'Une application de recettes, construite avec un autre développeur\u202f: on y partage des recettes, on les note, on les commente et on les met en favoris.',
        en: 'A recipe app, built with one other developer: you share recipes, rate them, review them and bookmark them.',
      },
      contribution: {
        fr: 'J’ai développé le back-end et l’API. L’autre développeur a réalisé l’interface que montre l’image.',
        en: 'I developed the backend and the API. The other developer built the interface shown in the image.',
      },
      approach: {
        fr: 'J’ai construit l’API en Django REST, utilisée par le front en Next.js.',
        en: 'I built the API with Django REST, used by the Next.js frontend.',
      },
      result: {
        fr: 'L’application est en ligne, sa démo est accessible et l’API publie sa documentation Swagger.',
        en: 'The app is online, its demo is accessible and the API publishes its Swagger documentation.',
      },
      designTools: [],
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
        fr: 'J’ai réalisé les wireframes avec Lovable et organisé le travail de l’équipe dans GitHub Projects.',
        en: 'I made the wireframes with Lovable and organized the team’s work in GitHub Projects.',
      },
      approach: {
        fr: 'Le défi UX était de rendre lisible une information très dense, sur des écrans concrets. Les wireframes, puis Figma avec un design system, ont aidé l’équipe à cerner le périmètre avant d’écrire du code.',
        en: 'The main UX problem was density: a lot of information that still had to read clearly on real screens. The wireframes, then Figma with a design system, gave the team a clear view of the scope before anyone wrote code.',
      },
      result: {
        fr: 'L’application fonctionne\u202f; il reste à la mettre en ligne.',
        en: 'The app works; it still has to be put online.',
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
