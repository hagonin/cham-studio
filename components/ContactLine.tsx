import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './ContactLine.module.css';

/**
 * PROBLÈME ──────●────── SOLUTION.
 *
 * Le bloc approche, dans le geste de la marque : deux extrémités qui se
 * rejoignent. Il remplace le diagramme de disques du prototype — même
 * explication, un vocabulaire de moins.
 *
 * L'ÉTAT AU REPOS EST L'ÉTAT JOINT. Les deux libellés et la prose sont dans le
 * DOM, visibles, sans JavaScript : la Phase 10 anime la façon dont les
 * extrémités arrivent, elle ne révèle rien. Une métaphore à moitié tracée est
 * pire que pas de métaphore, et les robots ne défilent pas.
 *
 * Apparaît une seule fois sur le site : répété, un énoncé devient un tic.
 */
export function ContactLine({ dict }: { dict: Dictionary }) {
  const { approach } = dict.home;

  return (
    <section className={styles.block} aria-labelledby="approach-title">
      <div className={styles.line} data-contact-line>
        {/* `data-contact-*` : prises du scrub de la Phase 10. Elles ne
            décrivent rien de visuel — sans JS, la ligne rend son état JOINT. */}
        <span className={styles.end} data-contact-end>
          {approach.problem}
        </span>
        <span className={styles.rule} aria-hidden="true" />
        <span className={styles.dot} data-contact-dot aria-hidden="true" />
        <span className={styles.rule} aria-hidden="true" />
        <span className={styles.end} data-contact-end>
          {approach.solution}
        </span>
      </div>
      <h2 id="approach-title" className={styles.title}>
        {approach.title}
      </h2>
      <p className={styles.body}>{approach.body}</p>
    </section>
  );
}
