import type { L10n } from './types';

/**
 * Identité de l'exploitant. Les champs légaux restent `null` tant que les
 * valeurs réelles ne sont pas fournies : un SIRET fictif est déjà interdit par
 * la garde CI, et `null` empêche d'en écrire un « provisoirement ».
 * La Phase 7 les remplit et ne peut pas se conclure sans eux.
 */
export const site = {
  name: 'Chạm Studio',
  /** Seule adresse publiée. Ni téléphone ni email personnel — garde CI. */
  email: 'contact@cham-studio.fr',
  /** Surfaces d'affichage : la ville suffit. L'adresse postale complète
   *  n'apparaît que sur les mentions légales. */
  city: { fr: 'Montpellier, France', en: 'Montpellier, France' } satisfies L10n,
  legal: {
    postalAddress: null as string | null,
    siret: null as string | null,
    statut: null as string | null,
  },
} as const;

export function legalIdentityIsComplete(): boolean {
  const { postalAddress, siret, statut } = site.legal;
  return Boolean(postalAddress && siret && statut);
}
