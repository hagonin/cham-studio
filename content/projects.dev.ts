import { type Project } from './types';

/**
 * RÉSERVE DE DÉVELOPPEMENT — ne part jamais en production.
 *
 * `content/projects.ts` ne charge cette liste que sous `NODE_ENV`
 * `development`, c'est-à-dire `pnpm dev` seul : les tests (`test`) et le build
 * (`production`) voient une liste vide, donc les gardes existantes restent
 * vertes et la section travaux ne peut pas s'afficher en ligne avec des
 * travaux inventés (F4).
 *
 * Trois filets, dans cet ordre :
 *  1. les slugs commencent par `exemple-`, ce que `placeholderSlugs()` repère ;
 *  2. les `alt` contiennent `ph-label`, la chaîne que la garde CI cherche dans
 *     `.next/server/app/` — si jamais cette liste fuitait dans un build, la CI
 *     échoue au lieu de publier ;
 *  3. les visuels sont des rectangles gris étiquetés, illisibles comme preuve.
 *
 * Pour passer un projet en réel : le déplacer dans `projects.ts`, changer le
 * slug, remplacer le visuel et réécrire l'`alt`. Le build échoue tant qu'il
 * reste une trace de réserve.
 */
export const devProjects: Project[] = [
  {
    slug: 'exemple-un',
    year: 2026,
    cover: {
      src: '/work/ph-cover-01.png',
      width: 1600,
      height: 1000,
      alt: { fr: 'ph-label réserve 01', en: 'ph-label placeholder 01' },
    },
    title: { fr: 'Premier projet', en: 'First project' },
    role: { fr: 'Conception et développement', en: 'Design and development' },
    summary: {
      fr: 'Texte de réserve. Décrire ici ce que le projet fait et pour qui, en deux phrases, sans chiffre inventé.',
      en: 'Placeholder text. Describe what the project does and for whom, in two sentences, with no invented figures.',
    },
    stack: ['Next.js', 'TypeScript'],
  },
  {
    slug: 'exemple-deux',
    year: 2025,
    cover: {
      src: '/work/ph-cover-02.png',
      width: 1600,
      height: 1000,
      alt: { fr: 'ph-label réserve 02', en: 'ph-label placeholder 02' },
    },
    title: { fr: 'Deuxième projet', en: 'Second project' },
    role: { fr: 'Conception et développement', en: 'Design and development' },
    summary: {
      fr: 'Texte de réserve. Le second projet est celui qui fait exister la section : sous deux, elle ne s’affiche pas.',
      en: 'Placeholder text. The second project is what makes the section exist: below two, it does not render.',
    },
    stack: ['React', 'CSS Modules'],
  },
  {
    slug: 'exemple-trois',
    year: 2024,
    cover: {
      src: '/work/ph-cover-03.png',
      width: 1600,
      height: 1000,
      alt: { fr: 'ph-label réserve 03', en: 'ph-label placeholder 03' },
    },
    title: { fr: 'Troisième projet', en: 'Third project' },
    role: { fr: 'Développement', en: 'Development' },
    summary: {
      fr: 'Texte de réserve. Trois entrées suffisent à juger le rythme de la liste et le recadrage au défilement.',
      en: 'Placeholder text. Three entries are enough to judge the list rhythm and the scroll recadrage.',
    },
    stack: ['TypeScript', 'Vitest'],
  },
];
