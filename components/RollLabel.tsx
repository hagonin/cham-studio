import type { CSSProperties } from 'react';
import styles from './RollLabel.module.css';

/**
 * Le défilement de lettres de la barre du dessin, partagé : la barre
 * (`SectionNav`) et les liens externes du pied de page (`ContactBlock`) doivent
 * s'animer à l'identique, donc le balisage et le CSS vivent ici une seule fois.
 *
 * Le lien porte `rollLink` (capitales et défilement au survol et au focus) ;
 * `bracketLink`, posé en plus, ajoute les crochets qui entrent au survol (la
 * barre et les liens sociaux, pas les liens de page du pied de page). Le
 * libellé est dupliqué, l'original sort par le haut et le double monte du bas.
 * Chaque lettre porte son rang `--i`, qui décale son départ. Les lettres sont
 * cachées aux lecteurs d'écran : elles ne se lisent pas une à une, donc le lien
 * porte son nom accessible en `aria-label` (jamais sur un `<span>`).
 */
export const rollLink = styles.link;
export const bracketLink = styles.brackets;

function Letters({ text }: { text: string }) {
  return (
    <>
      {[...text].map((char, index) => (
        <span key={index} style={{ '--i': index } as CSSProperties}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </>
  );
}

export function RollLabel({ text }: { text: string }) {
  return (
    <span className={styles.window} aria-hidden="true">
      <span className={styles.original}>
        <Letters text={text} />
      </span>
      <span className={styles.clone}>
        <Letters text={text} />
      </span>
    </span>
  );
}
