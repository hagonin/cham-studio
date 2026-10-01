import { projectsNewestFirst } from '@/content/projects';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { WorkGallery } from './WorkGallery';

/**
 * La section « travaux » : le serveur choisit la langue de chaque projet, le
 * composant client (`WorkGallery`) porte l'interaction. Toute la copie part dans
 * le HTML servi — la scène, les trois fiches de détail — donc la section se lit
 * sans JavaScript.
 *
 * L'ordre est celui de `projectsNewestFirst()` : le plus récent d'abord, dérivé de
 * `year`. C'est aussi celui du dessin (IMIN, Conversation Copilot, Airsen).
 */
export function WorkSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const projects = projectsNewestFirst().map((project) => ({
    slug: project.slug,
    title: project.title[locale],
    role: project.role[locale],
    description: project.summary[locale],
    cover: {
      src: project.cover.src,
      width: project.cover.width,
      height: project.cover.height,
      alt: project.cover.alt[locale],
    },
  }));

  return <WorkGallery projects={projects} copy={dict.home.work} />;
}
