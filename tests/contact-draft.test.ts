import { describe, expect, it } from 'vitest';
import { buildMailto } from '../lib/contact/draft';
import { fill } from '../lib/i18n/fill';
import { getDictionary } from '../lib/i18n/getDictionary';
import { locales } from '../lib/i18n/config';
import { site } from '../content/site';

const copy = {
  subject: 'Project enquiry — {name}',
  body: 'Hello,\n\n{message}\n\nName: {name}\nPhone: {phone}\nBudget: {budget}',
  noPhone: 'Not provided',
};
const fields = {
  name: 'Ada',
  email: 'ada@example.org',
  message: 'A site',
  phone: '',
  budget: 'To discuss',
};

/** Découpe le `mailto:` comme le fait une messagerie, pour juger le texte reçu. */
function open(href: string) {
  const url = new URL(href);
  return {
    to: url.pathname,
    subject: url.searchParams.get('subject'),
    body: url.searchParams.get('body'),
  };
}

describe('gabarit de phrase', () => {
  it('remplit les accolades', () => {
    expect(fill('{n} sur {total}', { n: 2, total: 3 })).toBe('2 sur 3');
  });

  it('ne réinterprète pas une valeur qui ressemble à un gabarit', () => {
    // Le texte tapé par une personne passe dans le gabarit : une valeur « {phone} »
    // ne doit pas être remplacée par le champ suivant.
    expect(fill('{a}|{b}', { a: '{b}', b: 'x' })).toBe('{b}|x');
  });

  it('laisse vide une clé absente plutôt que d’écrire « undefined »', () => {
    expect(fill('a{missing}b', {})).toBe('ab');
  });
});

describe('brouillon mailto', () => {
  it('écrit au studio, avec le nom dans l’objet', () => {
    const draft = open(buildMailto(site.email, copy, fields));
    expect(draft.to).toBe(site.email);
    expect(draft.subject).toBe('Project enquiry — Ada');
  });

  it('garde les retours à la ligne du corps', () => {
    const draft = open(buildMailto(site.email, copy, fields));
    expect(draft.body).toBe(
      'Hello,\n\nA site\n\nName: Ada\nPhone: Not provided\nBudget: To discuss',
    );
  });

  it('dit « non renseigné » quand le téléphone est vide', () => {
    expect(open(buildMailto(site.email, copy, fields)).body).toContain(
      'Phone: Not provided',
    );
    expect(
      open(buildMailto(site.email, copy, { ...fields, phone: '06 00 00 00 00' })).body,
    ).toContain('Phone: 06 00 00 00 00');
  });

  it('ne laisse pas un & # ? du message couper le corps du brouillon', () => {
    const message = 'Prix & délais #1 ? ok';
    const draft = open(buildMailto(site.email, copy, { ...fields, message }));
    expect(draft.body).toContain(message);
    expect(draft.body).toContain('Budget: To discuss');
  });

  it('ne réinterprète pas un gabarit tapé dans le message', () => {
    const draft = open(
      buildMailto(site.email, copy, { ...fields, message: '{phone}' }),
    );
    expect(draft.body).toContain('\n\n{phone}\n\n');
  });
});

describe('copie du brouillon dans chaque langue', () => {
  it('porte tous les champs que le formulaire recueille', () => {
    for (const locale of locales) {
      const { draft } = getDictionary(locale).home.contact.form;
      for (const key of ['name', 'email', 'message', 'phone', 'budget']) {
        expect(draft.body, `${locale} : {${key}}`).toContain(`{${key}}`);
      }
      expect(draft.subject, locale).toContain('{name}');
      expect(draft.noPhone.trim().length, locale).toBeGreaterThan(0);
    }
  });
});
