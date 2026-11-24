import type { Dictionary } from '@/lib/i18n/getDictionary';
import { FaqMotion } from './FaqMotion';
import styles from './Faq.module.css';

/**
 * Les questions qu'un client se pose avant d'écrire, sous
 * `<h2 id="faq-title">`, entre les prestations et le contact.
 *
 * Composant SERVEUR, sans script ni mouvement : chaque question est un
 * `<details>` natif, qui s'ouvre au clavier et sans JavaScript, et dont la
 * réponse est dans le HTML servi. Le `<summary>` ne contient que le texte de la
 * question (un titre à l'intérieur perdrait son rôle de titre) ; le marqueur
 * « + / − » est décoratif (`aria-hidden`), dessiné en CSS.
 *
 * Hors de `SECTION_KEYS` et sans numéro : voir `lib/sections.ts`. Aucun
 * `aria-expanded` ici, donc rien à apparier avec `aria-controls` (`check:html`).
 */
export function Faq({ dict }: { dict: Dictionary }) {
  const { faq } = dict.home;

  return (
    <section className={styles.section} aria-labelledby="faq-title" data-faq>
      <h2 id="faq-title" className={styles.heading}>
        {faq.title}
      </h2>
      {/* role="list" : Safari/VoiceOver retire la sémantique de liste d'un `<ul>` sans puces. */}
      <ul className={styles.list} role="list">
        {faq.items.map(({ question, answer }) => (
          <li key={question}>
            <details className={styles.item}>
              <summary className={styles.question}>
                {question}
                <span className={styles.marker} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{answer}</p>
            </details>
          </li>
        ))}
      </ul>
      <FaqMotion />
    </section>
  );
}
