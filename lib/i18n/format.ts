import type { Locale } from './config';

/** `1 200 €` en fr, `€1,200` en en — le placement du symbole diffère et
 *  Intl le sait ; ne pas concaténer le symbole à la main. */
export function formatPrice(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB').format(value);
}

export function formatYear(locale: Locale, year: number): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
  }).format(new Date(Date.UTC(year, 0, 1)));
}
