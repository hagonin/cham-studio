/**
 * Les préférences qui décident SI le mouvement s'exécute. Isolées ici, sans
 * import de GSAP ni de Lenis : ce sont les seules décisions du système de
 * mouvement qui se testent sans navigateur, et ce sont celles qui, prises à
 * l'envers, cassent l'accessibilité.
 *
 * ── ÉTAT DES PORTES ────────────────────────────────────────────────────────
 * Le risque n'a jamais été qu'une porte manque : c'est qu'elles DIVERGENT, et
 * qu'une combinaison (pointeur grossier sur grand écran, par exemple) laisse
 * un effet à moitié monté que personne n'a regardé. D'où ce tableau, ici et
 * pas dans un plan : il se lit à côté des fonctions qu'il décrit.
 *
 * | Système                     | coarse   | reduced-motion | Porte             |
 * |-----------------------------|----------|----------------|-------------------|
 * | Loader                      | actif    | inactif*       | Loader.tsx        |
 * | Magnétisme des CTA          | inactif  | inactif        | magnetic()        |
 * | Séquence du contact (hero)  | actif    | inactif        | HeroContact.tsx   |
 * | Scène tactile (canevas)     | actif    | inactif        | TouchPhilosophy   |
 * | État courant (aria-current) | actif    | actif          | aucune            |
 * | Menu déplié (sous 800px)    | actif    | actif          | aucune            |
 *
 *   * le drapeau de session est posé quand même, sinon la galerie attendrait
 *     un événement jamais émis. La séquence du contact attend ce même événement,
 *     et ne le fait que si `loaderWillPlay()` dit que le rideau va se jouer.
 *
 * Une ligne demande une décision plutôt qu'une lecture : **l'état courant et
 * le menu survivent à reduced-motion.** Ce sont des informations de navigation,
 * pas des effets ; les couper priverait de repères précisément les personnes
 * qui ont demandé moins de mouvement.
 *
 * Aucune porte n'écoute le CHANGEMENT de préférence : toutes lisent au
 * montage. Activer reduced-motion en cours de session ne retire donc rien
 * avant la navigation suivante. C'est un choix uniforme, et l'uniformité est
 * ce qui compte : quatre systèmes qui réagiraient différemment au même
 * changement seraient impossibles à vérifier.
 */

/** `reduce` ne veut pas dire « plus vite » : il veut dire AUCUN mouvement.
 *  Pas de Lenis, pas de ScrollTrigger, pas de 3D — les états finaux, direct. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Ce qui suit le pointeur (le magnétisme des CTA) ne se monte que sur un
 *  pointeur fin. Sur un écran tactile il n'a rien à suivre. */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(pointer: fine)').matches;
}
