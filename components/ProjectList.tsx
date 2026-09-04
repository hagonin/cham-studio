import { projectsNewestFirst } from '@/content/projects';
import { ProjectRow } from './ProjectRow';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import styles from './ProjectList.module.css';

/**
 * Composant serveur : la liste est figée au build, rien n'a besoin du client.
 *
 * L'appelant décide si la section paraît (`workSectionIsReady`). Ce composant
 * ne rend pas d'état vide : une section « travaux » sans travaux n'informe
 * personne et occupe la place de ce qui manque.
 */
export function ProjectList({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.work.projects;
  const projects = projectsNewestFirst();

  return (
    <section className={styles.block} aria-labelledby="work-title">
      <h2 id="work-title" className={styles.title}>
        {copy.title}
      </h2>
      <p className={styles.framing}>{copy.framing}</p>
      <ol className={styles.list}>
        {projects.map((project, index) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={index}
            locale={locale}
            dict={dict}
          />
        ))}
      </ol>
    </section>
  );
}
