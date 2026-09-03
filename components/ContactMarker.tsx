import styles from './ContactMarker.module.css';

type Props = {
  /** Texte à droite du point. Omis, le marqueur reste un filet rompu. */
  label?: string;
};

/**
 * ──────●────── CHẠM
 *
 * Le point de contact de la marque, en CSS seul : pas de JavaScript, même
 * rendu au doigt et à la souris. Le curseur de la Phase 10 prolonge cette idée,
 * il ne l'introduit pas.
 */
export function ContactMarker({ label }: Props) {
  return (
    <div className={styles.marker} role="presentation">
      <span className={styles.line} />
      <span className={styles.dot} />
      <span className={styles.line} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
