import { type Project } from './types';

/**
 * VIDE PAR CHOIX. Les trois études de cas du prototype étaient inventées pour
 * la maquette et ne partent pas en production.
 *
 * La page /projects ne s'affiche qu'à partir de deux projets réels avec leurs
 * visuels (F4) : une liste d'un seul élément se lit comme un abandon, pas
 * comme une sélection.
 */
export const projects: Project[] = [];

export const MIN_PROJECTS_TO_PUBLISH = 2;

export function workSectionIsReady(): boolean {
  return projects.length >= MIN_PROJECTS_TO_PUBLISH;
}
