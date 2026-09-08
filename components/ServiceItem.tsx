'use client';

import { useEffect, useId, useState } from 'react';
import type { Service } from '@/content/types';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import { formatPrice } from '@/lib/i18n/format';
import styles from './ServiceItem.module.css';

/**
 * La surface de conversion. Un clic ouvre tout : cacher « ce qui n'est pas
 * inclus » derrière un clic de plus coûte plus qu'il ne rapporte.
 *
 * Vrai `<button aria-expanded aria-controls>` — donc utilisable au clavier et
 * annoncé correctement, ce qu'un `<div onClick>` ne fait pas.
 *
 * La hauteur est animée par `grid-template-rows: 0fr → 1fr` : pas de mesure en
 * JavaScript, donc pas de saut au premier rendu. Sur un navigateur qui ne
 * l'anime pas, le contenu s'affiche d'un coup — il reste lisible.
 */
export function ServiceItem({
  service,
  locale,
  dict,
}: {
  service: Service;
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerId = `${panelId}-trigger`;
  const anchor = `service-${service.key}`;

  // Arrivée sur `#service-<clé>` : la prestation visée s'ouvre. L'ancre reste
  // une URL partageable depuis l'extérieur — le bloc « situations » qui s'en
  // servait n'existe plus, la ligne reste atteignable directement.
  // Le lien fonctionne sans cela ; c'est un supplément, pas la condition.
  useEffect(() => {
    if (window.location.hash === `#${anchor}`) setOpen(true);
    const onHash = () => {
      if (window.location.hash === `#${anchor}`) setOpen(true);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [anchor]);

  const { services: copy } = dict.home;

  return (
    <li className={styles.item} id={anchor}>
      <h3 className={styles.heading}>
        <button
          type="button"
          id={triggerId}
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          <span className={styles.name}>{service.title[locale]}</span>
          <span className={styles.price}>
            {/* Le plancher vient de content/services.ts, jamais retapé dans la
                copie : la page et l'estimateur ne peuvent pas diverger. */}
            {service.from === null
              ? copy.quoteOnRequest
              : `${dict.pricing.from} ${formatPrice(locale, service.from)}`}
          </span>
          <span className={styles.state} aria-hidden="true">
            {open ? copy.close : copy.open}
          </span>
        </button>
      </h3>
      {/* `region` sans nom accessible n'est pas navigable ; le panneau emprunte
          celui de son déclencheur. */}
      <div
        className={styles.panel}
        data-open={open}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
      >
        <div className={styles.panelInner}>
          <p className={styles.summary}>{service.summary[locale]}</p>
          {/* Libellé, donc en majuscules — et donc pas un <p> : les capitales
              sont réservées aux libellés courts. `aria-labelledby` rattache la
              liste à son intitulé, ce qu'un paragraphe voisin ne fait pas. */}
          <span className={styles.deliverablesLabel} id={`${panelId}-deliverables`}>
            {copy.deliverablesLabel}
          </span>
          <ul
            className={styles.deliverables}
            aria-labelledby={`${panelId}-deliverables`}
          >
            {service.deliverables.map((deliverable) => (
              <li key={deliverable.fr}>{deliverable[locale]}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}
