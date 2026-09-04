import { type Project } from './types';
import { devProjects } from './projects.dev';

/**
 * Vide en production, par choix. Les études de cas du prototype étaient
 * inventées pour la maquette et ne partent pas en ligne.
 *
 * La section travaux ne s'affiche qu'à partir de deux projets réels avec leurs
 * visuels (F4) : une liste d'un seul élément se lit comme un abandon, pas
 * comme une sélection. Tant que le compte n'y est pas, la page existe, la
 * section n'y est pas, et la route sort du sitemap.
 *
 * `NODE_ENV` vaut `development` sous `pnpm dev` seul : ni les tests
 * (`test`) ni le build (`production`) ne voient la réserve, donc les gardes
 * de ce fichier restent vertes et la section ne peut pas s'afficher en ligne
 * avec des travaux inventés. Next remplace `process.env.NODE_ENV` à la
 * compilation, donc la branche morte — et l'import avec elle — disparaît du
 * bundle de production.
 */
export const projects: Project[] =
  process.env.NODE_ENV === 'development' ? devProjects : [];

export const MIN_PROJECTS_TO_PUBLISH = 2;

export function workSectionIsReady(): boolean {
  return projects.length >= MIN_PROJECTS_TO_PUBLISH;
}

/**
 * Les entrées de la maquette portaient des slugs `exemple-*`. Le risque n'est
 * pas théorique : il s'est déjà produit une fois, dans le prototype. Un slug
 * de réserve qui atteint la production annonce un résultat qui n'existe pas.
 */
const PLACEHOLDER_SLUG = /exemple|placeholder|nom-du-projet|lorem|todo/i;

export function placeholderSlugs(list: readonly Project[] = projects): string[] {
  return list.filter((p) => PLACEHOLDER_SLUG.test(p.slug)).map((p) => p.slug);
}

/** Ordre d'affichage : le plus récent d'abord, dérivé de `year`. Trier à la
 *  main invite à réordonner pour flatter, et la liste ment dès la deuxième
 *  édition. `slice` parce que `sort` mute, et le module est partagé.
 *
 *  La liste est un paramètre pour que le tri se teste sur des données : sans
 *  cela, `projects` étant vide, la garde ne serait vérifiée que le jour où
 *  elle compte. */
export function projectsNewestFirst(list: readonly Project[] = projects): Project[] {
  return list.slice().sort((a, b) => b.year - a.year);
}
