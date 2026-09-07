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
 * ne l'attrape. `about` a rejoint `MOUNTED` en phase 03 ; `work` suit en phase 05,
 * en même temps que son `<h2 id="work-title">`.
 *
 * Aucune section n'est montée « en attente » avec un titre vide : un titre sans
 * contenu occupe la place de ce qui manque, exactement ce que
 * `content/projects.ts` refuse pour la liste des travaux.
 *
 * Ordre = décision 16 (`hero → work → services → process → about → contact`,
 * `hero` hors nav car sans ancre). `process` a rejoint `MOUNTED` avec lui en
 * même temps que `<h2 id="process-title">` (`Process.tsx`).
 */
export const SECTION_KEYS = ['work', 'services', 'process', 'about', 'contact'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const MOUNTED_SECTIONS: readonly SectionKey[] = ['services', 'process', 'about', 'contact'];
