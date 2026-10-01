import type { Dictionary } from '@/lib/i18n/getDictionary';
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
 */
export function Process({ dict }: { dict: Dictionary }) {
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

      <ServicesMotion />
    </section>
  );
}
