import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { toolGroups } from '@/content/tools';
import { MaskedLines } from './MaskedLines';
import { ServicesMotion } from './ServicesMotion';
import styles from './Process.module.css';

/**
 * LE bloc de prestations de la page : les trois disciplines du dessin
 * (`dict.home.process`; `index.html`, `services.css` et `services.js` du
 * prototype), sous `<h2 id="services-title">` — l'ancre que la nav cible pour
 * « services » (`lib/sections.ts`). Le nom du composant est resté celui de
 * l'ancien bloc « méthode » ; son contenu est celui du dessin.
 *
 * Composant SERVEUR : toute la copie est dans le HTML servi, le titre déjà
 * découpé en mots (`MaskedLines`). `ServicesMotion` ne rend rien et n'ajoute que
 * le mouvement. Les rangées portent `data-quiet` : c'est ce que `revealQuiet`
 * fait entrer, l'une après l'autre, quand la liste arrive.
 *
 * Les index sont des `<span>` et les titres des `<h3>` : le `<h2>` de la section
 * les précède, aucun niveau n'est sauté (`check:html`).
 *
 * Sous la liste, les outils (`content/tools.ts`) : un `<h3>` au niveau des
 * disciplines, un `<h4>` par groupe. Le logo est décoratif (`aria-hidden`) ; le
 * nom visible est le nom accessible. Pas de `data-quiet` ici : le bloc ne fait
 * pas partie de la liste que `revealQuiet` anime, il reste tel que livré.
 */
export function Process({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { process } = dict.home;

  return (
    <section className={styles.section} aria-labelledby="services-title" data-services>
      <h2
        id="services-title"
        className={styles.heading}
        aria-label={process.title.join(' ')}
        data-words
      >
        <MaskedLines lines={process.title} />
      </h2>

      <ol className={styles.list} data-list>
        {process.steps.map((step, index) => (
          <li key={step.title} className={styles.row} data-quiet>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.body}</p>
          </li>
        ))}
      </ol>

      <div className={styles.tools}>
        <h3 className={styles.toolsTitle}>{process.tools.title}</h3>
        {toolGroups.map((group) => (
          <div key={group.label.en} className={styles.toolGroup}>
            <h4 className={styles.toolGroupLabel}>{group.label[locale]}</h4>
            <ul className={styles.toolList}>
              {group.tools.map(({ name, icon }) => {
                const label = typeof name === 'string' ? name : name[locale];
                return (
                  <li key={label} className={styles.tool}>
                    {icon ? (
                      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                        <path d={icon.path} />
                      </svg>
                    ) : null}
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <ServicesMotion />
    </section>
  );
}
