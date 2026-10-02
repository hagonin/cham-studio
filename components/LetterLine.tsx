import { Fragment } from 'react';
import styles from './LetterLine.module.css';

/**
 * Une ligne de titre géante, lettre par lettre, rendue côté SERVEUR (`contact.js`
 * du prototype les découpe en JS). Partagée par le titre de la section contact
 * et la ligne « À propos » du bas du hero ; `revealLettersOnScroll`
 * (`lib/motion/reveal.ts`) les fait descendre au défilement.
 *
 * Les lettres sont en `aria-hidden` et le vrai texte est posé hors écran
 * (`.sr-only` global) : `aria-label` n'est pas permis sur un `<span>`, et des
 * lettres isolées ne doivent pas arriver aux lecteurs d'écran en fragments.
 * Les lettres d'un mot restent groupées (`.word`, sans coupure) : une ligne ne
 * se brise qu'entre deux mots.
 */
export function LetterLine({ text }: { text: string }) {
  return (
    <span className={styles.reveal} data-title-line>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? ' ' : null}
          <span className={styles.word}>
            {[...word].map((char, position) => (
              <span
                key={position}
                className={styles.letter}
                data-letter
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
