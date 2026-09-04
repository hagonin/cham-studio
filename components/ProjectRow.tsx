import Image from 'next/image';
import type { Project } from '@/content/types';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { formatYear } from '@/lib/i18n/format';
import styles from './ProjectRow.module.css';

/**
 * Une entrée, la même forme pour toutes : rang, titre, rôle, année, résumé,
 * outils, visuel. Une structure uniforme se parcourt ; une structure qui varie
 * selon ce que chaque projet a de flatteur se lit comme un argumentaire.
 *
 * Aucun chiffre de résultat ici. Un projet personnel n'en a en général pas, et
 * ne rien dire vaut mieux que d'inventer.
 */
export function ProjectRow({
  project,
  index,
  locale,
  dict,
}: {
  project: Project;
  index: number;
  locale: Locale;
  dict: Dictionary;
}) {
  const copy = dict.work.projects;
  const { cover } = project;

  return (
    <li className={styles.row}>
      {/* Le rang est décoratif : il ordonne l'œil, il n'ajoute rien à la
          lecture vocale, qui annonce déjà « élément 1 sur n ». */}
      <span className={styles.index} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className={styles.body}>
        <h3 className={styles.title}>{project.title[locale]}</h3>

        {/* Libellés au-dessus des valeurs : une <dl> les rattache, ce qu'une
            suite de <span> laisse à la mise en page seule. */}
        <dl className={styles.meta}>
          <div className={styles.metaPair}>
            <dt className={styles.metaLabel}>{copy.roleLabel}</dt>
            <dd className={styles.metaValue}>{project.role[locale]}</dd>
          </div>
          <div className={styles.metaPair}>
            <dt className={styles.metaLabel}>{copy.yearLabel}</dt>
            <dd className={styles.metaValue}>
              <time dateTime={String(project.year)}>
                {formatYear(locale, project.year)}
              </time>
            </dd>
          </div>
        </dl>

        <p className={styles.summary}>{project.summary[locale]}</p>

        {/* Les outils ne sont pas traduits — React reste React. */}
        <span className={styles.stackLabel} id={`${project.slug}-stack`}>
          {copy.stackLabel}
        </span>
        <ul className={styles.stack} aria-labelledby={`${project.slug}-stack`}>
          {project.stack.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>

        {project.url ? (
          <a
            className={`${styles.link} contact-link`}
            href={project.url}
            rel="noreferrer"
          >
            {copy.visit}
          </a>
        ) : null}
      </div>

      {/* Le cadre porte le ratio et le débordement ; l'image porte le
          recadrage. Séparer les deux est ce qui rend l'effet gratuit en
          disposition : le cadre ne bouge jamais. Voir `.frame` dans
          globals.css. */}
      <span className={`${styles.frame} frame`}>
        {/* `width`/`height` viennent de la donnée : le navigateur réserve la
            place avant le chargement, donc la page ne saute pas.

            Le premier visuel est le candidat LCP de la page : le charger en
            `lazy` comme les autres reviendrait à attendre la mise en page pour
            seulement commencer à le demander. Les suivants restent paresseux. */}
        <Image
          className={styles.cover}
          src={cover.src}
          alt={cover.alt[locale]}
          width={cover.width}
          height={cover.height}
          sizes="(max-width: 60rem) 100vw, 32rem"
          priority={index === 0}
        />
      </span>
    </li>
  );
}
