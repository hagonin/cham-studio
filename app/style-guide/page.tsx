import { colors } from '@/lib/tokens';
import { fontVariables } from '@/lib/fonts';
import '../globals.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

/**
 * Page interne, hors segment `[locale]` comme `not-found.tsx` : elle n'a pas
 * de locale à lire et ne doit pas être indexée. Les valeurs viennent de
 * `lib/tokens.ts`, pas d'une liste dupliquée ici — le même garde-fou que la
 * feuille de style empêche les deux de diverger.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

const typeScale = [
  { label: '--label', value: 'var(--label)' },
  { label: '--text-s', value: 'var(--text-s)' },
  { label: '--text', value: 'var(--text)' },
  { label: '--display-s', value: 'var(--display-s)' },
  { label: '--display-m', value: 'var(--display-m)' },
  { label: '--display-xl', value: 'var(--display-xl)' },
] as const;

const spacingScale = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => `--space-${step}`);
const spacing = ['--gutter', '--page', ...spacingScale] as const;
const motion = ['--contact', '--contact-duration'] as const;

export default function StyleGuide() {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <main>
          <h1 className={styles.section}>Style guide</h1>

          <section className={styles.section}>
            <h2>Couleurs</h2>
            <ul className={styles.swatches}>
              {Object.entries(colors).map(([name, hex]) => (
                <li key={name} className={styles.swatch}>
                  <div className={styles.swatchColor} style={{ background: hex }} />
                  <span className={styles.swatchLabel}>
                    --{name} {hex}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Échelle typographique</h2>
            {typeScale.map(({ label, value }) => (
              <div key={label} className={styles.typeRow}>
                <span className={styles.typeLabel}>{label}</span>
                <p style={{ fontSize: value }}>Chạm — le point de contact</p>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Espacement et mouvement</h2>
            <ul className={styles.tokenList}>
              {[...spacing, ...motion].map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </section>
        </main>
      </body>
    </html>
  );
}
