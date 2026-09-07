'use client';

import { useId, useState } from 'react';
import { site } from '@/content/site';
import {
  DESIGN_LEVELS,
  PRICING_KEYS,
  PRICING_LABELS,
  FEATURES,
  SCALES,
  duration,
  priceRange,
  type Config,
  type DesignLevel,
  type Feature,
  type PricingKey,
  type Scale,
} from '@/lib/pricing/model';
import { formatPrice } from '@/lib/i18n/format';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import type { Locale } from '@/lib/i18n/config';
import styles from './Estimator.module.css';

/**
 * Composant client : il porte l'état d'un formulaire, ce que le rendu serveur
 * ne peut pas faire. Même exception que ServiceItem.
 *
 * Le calcul n'est PAS ici — `lib/pricing/model.ts` est pur et testé sur ses
 * 2304 configurations. Ce fichier ne fait qu'afficher.
 *
 * Tant que les planchers ne sont pas arrêtés, `priceRange` rend `null` et le
 * bloc affiche « sur devis ». Aucune branche « prix à zéro » n'existe : un
 * zéro s'afficherait comme un prix.
 */
export function Estimator({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.pricing.estimator;
  const groupId = useId();

  const [type, setType] = useState<PricingKey>('vitrine');
  const [scale, setScale] = useState<Scale>('standard');
  const [design, setDesign] = useState<DesignLevel>('sobre');
  const [features, setFeatures] = useState<Feature[]>([]);

  const cfg: Config = { type, scale, design, features };
  const range = priceRange(cfg);
  const { w1, w2 } = duration(cfg);

  const serviceTitle = (key: PricingKey) => PRICING_LABELS[key][locale];

  const priceLine = range
    ? `${formatPrice(locale, range.lo)} – ${formatPrice(locale, range.hi)}`
    : dict.home.services.quoteOnRequest;
  const durationLine = `${w1} – ${w2} ${copy.weeks}`;

  // Le lien mailto est construit au rendu, sur l'état courant : il n'y a rien
  // à soumettre, donc pas de <form> ni d'action à intercepter.
  const body = [
    copy.mailIntro,
    '',
    `${copy.typeLegend} ${serviceTitle(type)}`,
    `${copy.scaleLegend} ${copy.scales[scale]}`,
    `${copy.designLegend} ${copy.designs[design]}`,
    `${copy.featuresLegend} ${
      features.length === 0
        ? '—'
        : features.map((feature) => copy.features[feature]).join(', ')
    }`,
    '',
    `${copy.resultLabel} : ${priceLine}`,
    `${copy.durationLabel} : ${durationLine}`,
  ].join('\n');
  const href = `mailto:${site.email}?subject=${encodeURIComponent(
    copy.mailSubject,
  )}&body=${encodeURIComponent(body)}`;

  function toggleFeature(feature: Feature) {
    setFeatures((current) =>
      current.includes(feature)
        ? current.filter((kept) => kept !== feature)
        : // On garde l'ordre canonique de FEATURES : sans cela, deux personnes
          // cochant les mêmes options envoient deux emails différents.
          FEATURES.filter((known) => known === feature || current.includes(known)),
    );
  }

  return (
    <section data-reveal className={styles.block} aria-labelledby="estimator-title">
      <h2 id="estimator-title" className={styles.title}>
        {copy.title}
      </h2>
      <p className={styles.lead}>{copy.lead}</p>

      <div className={styles.inputs}>
        <fieldset className={styles.group}>
          <legend className={styles.legend}>{copy.typeLegend}</legend>
          {PRICING_KEYS.map((key) => (
            <label
              key={key}
              className={styles.choice}
              htmlFor={`${groupId}-type-${key}`}
            >
              <input
                type="radio"
                id={`${groupId}-type-${key}`}
                name={`${groupId}-type`}
                checked={type === key}
                onChange={() => setType(key)}
              />
              {serviceTitle(key)}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{copy.scaleLegend}</legend>
          {SCALES.map((value) => (
            <label
              key={value}
              className={styles.choice}
              htmlFor={`${groupId}-scale-${value}`}
            >
              <input
                type="radio"
                id={`${groupId}-scale-${value}`}
                name={`${groupId}-scale`}
                checked={scale === value}
                onChange={() => setScale(value)}
              />
              {copy.scales[value]}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{copy.designLegend}</legend>
          {DESIGN_LEVELS.map((value) => (
            <label
              key={value}
              className={styles.choice}
              htmlFor={`${groupId}-design-${value}`}
            >
              <input
                type="radio"
                id={`${groupId}-design-${value}`}
                name={`${groupId}-design`}
                checked={design === value}
                onChange={() => setDesign(value)}
              />
              {copy.designs[value]}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>{copy.featuresLegend}</legend>
          {FEATURES.map((feature) => (
            <label
              key={feature}
              className={styles.choice}
              htmlFor={`${groupId}-feature-${feature}`}
            >
              <input
                type="checkbox"
                id={`${groupId}-feature-${feature}`}
                checked={features.includes(feature)}
                onChange={() => toggleFeature(feature)}
              />
              {copy.features[feature]}
            </label>
          ))}
        </fieldset>
      </div>

      {/* `polite` : le résultat change à chaque clic, `assertive` couperait la
          lecture en cours à chaque fois. */}
      <div className={styles.result} aria-live="polite">
        <p className={styles.figure}>
          <span className={styles.resultLabel}>{copy.resultLabel}</span>
          <span className={styles.amount}>{priceLine}</span>
        </p>
        <p className={styles.figure}>
          <span className={styles.resultLabel}>{copy.durationLabel}</span>
          <span className={styles.amount}>{durationLine}</span>
        </p>
        <p className={styles.notice}>
          {dict.pricing.indicative} — {copy.notAQuote}
        </p>
      </div>

      <a className={`${styles.cta} contact-link`} href={href}>
        {copy.cta}
      </a>
    </section>
  );
}
