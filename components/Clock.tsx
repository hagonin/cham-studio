'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';

/**
 * L'heure du serveur de build n'est pas celle du visiteur : rendre une valeur
 * côté serveur produirait une divergence d'hydratation à chaque chargement.
 * Le serveur ne rend donc rien, et `useEffect` remplit après montage.
 *
 * Le fuseau est nommé (`Europe/Paris`), pas un décalage : Montpellier est à
 * GMT+1 l'hiver et GMT+2 l'été, et un décalage écrit en dur est faux la moitié
 * de l'année.
 */
export function Clock({ locale, label }: { locale: Locale; label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [locale]);

  // `suppressHydrationWarning` n'est pas nécessaire : le serveur et le premier
  // rendu client produisent tous deux la même valeur vide.
  return (
    <span aria-label={label}>
      <time suppressHydrationWarning>{time ?? ''}</time>
    </span>
  );
}
