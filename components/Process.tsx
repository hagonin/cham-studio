import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './Process.module.css';

/**
 * Décision 27 : une ligne continue à cinq points de contact, jamais cinq
 * figures séparées. Le filet vertical (`styles.steps::before`) tient le rôle
 * de la ligne ; chaque point d'étape est déjà à son état FINAL (rempli,
 * couleur de contact) — l'amélioration progressive n'anime que la façon dont
 * il y arrive, comme `.frame img` (`app/globals.css`) pour le recadrage.
 *
 * Composant serveur, aucun JavaScript : `data-contact-line` n'est pas repris
 * ici (`MotionProvider.tsx` n'en sélectionne qu'un seul, et le motif de
 * `ContactLine` n'est censé apparaître qu'une fois sur le site).
 */
export function Process({ dict }: { dict: Dictionary }) {
  const { process } = dict.home;
  const [titleFirst, titleRest] = process.title;

  return (
    <section data-reveal className={styles.block} aria-labelledby="process-title">
      <h2 id="process-title" className={styles.title}>
        <span className={styles.titleLine}>{titleFirst}</span>
        <span className={styles.titleLine}>{titleRest}</span>
      </h2>

      <ol className={styles.steps}>
        {process.steps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.marker} aria-hidden="true">
              <span className={styles.markerNum}>0{index + 1}</span>
              <span className={styles.markerDot} />
            </span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepBody}>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
