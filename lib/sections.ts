import { workSectionIsReady } from '@/content/projects';

/**
 * Les sections ancrables de la page unique, et celles qui y sont RÉELLEMENT
 * montées aujourd'hui.
 *
 * Dans un `.ts` et non dans le composant : les tests importent ces listes, et
 * un fichier `.tsx` ne se parse pas sous Vitest (`jsx: preserve` pour Next).
 * Même raison que `lib/motion/cursor.ts` — la logique qui doit se vérifier vit
 * à part du rendu.
 *
 * L'écart entre les deux listes est le sujet : une ancre vers un titre absent
 * défile vers rien, et la page répond quand même 200, donc aucun test de route
 * ne l'attrape. `work` n'entre dans `MOUNTED` que quand `workSectionIsReady()`
 * dit oui, exactement la condition qui monte le `<h2 id="work-title">` dans
 * `app/[locale]/page.tsx`. Deux listes dérivées de la même source ne peuvent
 * pas diverger — une constante écrite à la main, elle, se serait désynchronisée
 * au premier vrai projet. `scripts/check-html.mjs` vérifie le résultat sur le
 * HTML construit : chaque ancre de la nav a son titre.
 *
 * Aucune section n'est montée « en attente » avec un titre vide : un titre sans
 * contenu occupe la place de ce qui manque, exactement ce que
 * `content/projects.ts` refuse pour la liste des travaux.
 *
 * ORDRE = celui du dessin : à propos → travaux → prestations → contact. Le hero
 * et la scène tactile n'ont pas d'ancre de nav, donc ne figurent pas ici. La
 * personne vient avant la preuve ; l'ancien ordre (preuve, offre, méthode,
 * personne en dernier) est abandonné, parce que le dessin le contredit.
 * `services` est le bloc de `Process.tsx` (`<h2 id="services-title">`) : il n'y
 * a plus de section « méthode » à part.
 *
 * Cet ordre vit à deux endroits, qui doivent bouger ensemble : cette liste (la
 * nav) et le JSX de `app/[locale]/page.tsx`. Les numéros que le dessin affiche
 * à l'écran — 02 / 05 sur la scène tactile, 03 pour « à propos », 04 / 05 pour
 * les travaux — l'ENCODENT sans en être dérivés : changer l'ordre les périme en
 * silence.
 */
export const SECTION_KEYS = ['about', 'work', 'services', 'contact'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const MOUNTED_SECTIONS: readonly SectionKey[] = SECTION_KEYS.filter(
  (key) => key !== 'work' || workSectionIsReady(),
);
