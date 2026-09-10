import { readFileSync } from 'node:fs';

/**
 * Empêche un déploiement de PRODUCTION sur des tarifs provisoires.
 *
 * La garde vise la production, pas la CI : `PRICES_CONFIRMED` est `false`
 * aujourd'hui et le restera jusqu'à ce que les quatre chiffres soient arrêtés.
 * La faire échouer en CI rendrait chaque PR rouge sans rien protéger — c'est
 * la mise en ligne qui est le risque, pas la branche.
 *
 * On lit la SOURCE plutôt que le build : `PRICES_CONFIRMED` n'est référencé
 * par aucun composant, donc il ne survit pas au tree-shaking et ne se trouve
 * pas dans .next/.
 */
const source = readFileSync(
  new URL('../lib/pricing/model.ts', import.meta.url),
  'utf8',
);
const confirmed = /export const PRICES_CONFIRMED = true;/.test(source);

if (process.env.VERCEL_ENV === 'production' && !confirmed) {
  console.error(
    '::error::tarifs provisoires — PRICES_CONFIRMED est false, pas de mise en production',
  );
  process.exit(1);
}

console.log(confirmed ? 'Tarifs arrêtés.' : 'Tarifs provisoires (hors production).');
