import { Fragment } from 'react';
import styles from './MaskedLines.module.css';

/**
 * Les lignes d'un titre, mot à mot, rendues côté SERVEUR : le texte est dans le
 * HTML servi et se lit sans JavaScript. Le mouvement (`revealWords` dans
 * `lib/motion/reveal.ts`) n'agit que sur les `<span>` internes de `[data-mask]`.
 *
 * Le conteneur DOIT porter `aria-label` avec le texte entier : les mots sont en
 * `aria-hidden`, et ne doivent pas arriver aux technologies d'assistance en
 * fragments.
 */
export function MaskedLines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span key={line} className={styles.line}>
          {line
            .trim()
            .split(/\s+/)
            .map((word, index) => (
              <Fragment key={index}>
                {index > 0 ? ' ' : null}
                <span className={styles.word} data-mask aria-hidden="true">
                  <span>{word}</span>
                </span>
              </Fragment>
            ))}
        </span>
      ))}
    </>
  );
}
