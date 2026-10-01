import { fill } from '@/lib/i18n/fill';

export type DraftCopy = { subject: string; body: string; noPhone: string };

export type DraftFields = {
  name: string;
  email: string;
  message: string;
  phone: string;
  budget: string;
};

/**
 * Le brouillon `mailto:` du formulaire de contact — rien n'est envoyé : la
 * messagerie de la personne s'ouvre avec le texte déjà écrit (décision du
 * 2026-09-30, comme le dessin).
 *
 * Ce qui peut se tromper en silence, et que `tests/contact-draft.test.ts`
 * garde : un `&`, un `#` ou un `?` dans le message qui couperait le corps du
 * brouillon, des retours à la ligne perdus, un téléphone vide qui laisserait
 * « Téléphone : » nu.
 */
export function buildMailto(
  email: string,
  copy: DraftCopy,
  fields: DraftFields,
): string {
  const values = { ...fields, phone: fields.phone || copy.noPhone };
  const subject = encodeURIComponent(fill(copy.subject, values));
  const body = encodeURIComponent(fill(copy.body, values));
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
