'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { buildMailto } from '@/lib/contact/draft';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './ContactBlock.module.css';

type Copy = Dictionary['home']['contact']['form'];

/**
 * Le formulaire du dessin. Il n'envoie RIEN nulle part : il construit un
 * brouillon `mailto:`, l'ouvre, et garde un lien de secours dans la région
 * `status` (décision du 2026-09-30 ; un vrai point d'entrée serait un autre
 * chantier, avec sa validation et son sous-traitant RGPD). La note visible dit
 * la même chose à la personne : « rien n'est envoyé automatiquement ».
 *
 * `action`, `method` et `encType` ne servent qu'SANS JavaScript, ou avant
 * l'hydratation : sans eux, valider le formulaire le soumettrait en GET et
 * écrirait le nom, l'e-mail et le message dans l'URL. Avec eux, la messagerie
 * s'ouvre comme dans le cas normal, et rien ne passe par l'adresse de la page.
 *
 * `reportValidity()` : la validation native a déjà parlé avant ce gestionnaire,
 * mais l'appel garde le comportement du dessin si un navigateur la saute.
 */
export function ContactForm({ copy, email }: { copy: Copy; email: string }) {
  const [draft, setDraft] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? '');
    const href = buildMailto(email, copy.draft, {
      name: field('name'),
      email: field('email'),
      message: field('message'),
      phone: field('phone'),
      budget: field('budget'),
    });
    setDraft(href);
    window.location.href = href;
  };

  return (
    <form
      className={styles.form}
      action={`mailto:${email}`}
      method="post"
      encType="text/plain"
      onSubmit={onSubmit}
    >
      <label>
        {copy.name}
        <input name="name" autoComplete="name" required maxLength={120} />
      </label>
      <label>
        {copy.phone} <span className={styles.optional}>{copy.optional}</span>
        <input name="phone" type="tel" autoComplete="tel" maxLength={60} />
      </label>
      <label>
        {copy.email}
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
        />
      </label>
      <label>
        {copy.message}
        <textarea name="message" rows={3} required maxLength={3000} />
      </label>
      <fieldset>
        <legend>{copy.budgetLegend}</legend>
        <div className={styles.budget}>
          {copy.budget.map((option, index) => (
            <label key={option.value}>
              <input
                type="radio"
                name="budget"
                value={option.value}
                defaultChecked={index === copy.budget.length - 1}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button className={styles.submit} type="submit">
        {copy.submit} <span aria-hidden="true">↗</span>
      </button>
      <p className={styles.note}>{copy.note}</p>
      <p className={styles.status} role="status">
        {draft ? (
          <>
            {copy.ready} <a href={draft}>{copy.retry} ↗</a>
          </>
        ) : null}
      </p>
    </form>
  );
}
