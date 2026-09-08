import { projectsNewestFirst } from '@/content/projects';
import { ProjectList } from './ProjectList';
import { Gallery3DSlot } from './Gallery3DSlot';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';

/**
 * La section travaux, composée côté SERVEUR.
 *
 * C'est la seule composition possible : `Gallery3DSlot` est un composant
 * client, et un composant client ne peut pas importer son repli serveur. En
 * plaçant les deux ici, « WebGL absent ⇒ contenu complet » devient vrai PAR
 * CONSTRUCTION, au lieu de dépendre d'une branche qu'il faudrait maintenir.
 *
 * L'ordre compte : la scène d'abord, la liste ensuite. La 3D crée l'espace,
 * le HTML porte l'information.
 */
export function WorkSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const covers = projectsNewestFirst().map((project) => project.cover.src);

  return (
    <>
      <Gallery3DSlot covers={covers} />
      <ProjectList locale={locale} dict={dict} />
    </>
  );
}
