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
 * | Curseur + champ + onde      | inactif  | inactif        | ContactCursor.tsx |
 * | Réaction par caractère      | inactif  | inactif        | interne HeroMotion|
 * | Magnétisme de la figure     | inactif  | inactif        | interne HeroMotion|
 * | Magnétisme CTA + liens nav  | inactif  | inactif        | magnetic()        |
 * | Continuité loader → ×       | actif    | inactif**      | interne HeroMotion|
 * | Parallaxe au défilement     | ACTIF    | inactif        | parallax()        |
 * | État courant (aria-current) | actif    | actif          | aucune            |
 * | Menu plein écran            | actif    | actif***       | aucune            |
 * | Indicateur de défilement    | actif    | statique       | ScrollCue.tsx     |
 *
 *   * le drapeau de session est posé quand même, sinon la galerie attendrait
 *     un événement jamais émis.
 *  ** aucun événement n'est émis, donc rien à prolonger : l'état au repos du
 *     logotype est déjà l'état final.
 * *** il s'ouvre et se ferme, sans révélation séquentielle — la règle globale
 *     de `globals.css` ramène les durées d'animation à ~0.
 *
 * Deux lignes demandent une décision plutôt qu'une lecture :
 *
 * 1. **La parallaxe reste active au doigt** (décision V1). Elle suit le
 *    DÉFILEMENT, pas le pointeur : la gater sur `hasFinePointer()` la
 *    perdrait sur tablette sans que rien ne le justifie.
 * 2. **L'état courant et le menu survivent à reduced-motion.** Ce sont des
 *    informations de navigation, pas des effets ; les couper priverait de
 *    repères précisément les personnes qui ont demandé moins de mouvement.
 *
 * `HeroMotion` est la seule ligne où « le composant est monté » ne veut pas
 * dire « tous ses effets tournent » : il monte sous `!prefersReducedMotion()`
 * seul, et porte `hasFinePointer()` À L'INTÉRIEUR, sur la réaction par
 * caractère et le magnétisme de la figure. Cela se vérifie en lisant le code —
 * à l'écran, un effet inerte et un composant absent se ressemblent.
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

/** Le curseur ne se monte que sur un pointeur fin. Sur un écran tactile il n'a
 *  rien à suivre, et le marqueur CSS de la Phase 2 porte déjà l'idée. */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(pointer: fine)').matches;
}

type Connection = { saveData?: boolean };

/**
 * Sonde réelle, pas une déduction : un navigateur avec WebGL désactivé (ou un
 * contexte refusé par le pilote) ne dit rien d'autre nulle part. Un canvas
 * jetable, jamais attaché au DOM — la sonde ne coûte rien au-delà de sa propre
 * création. Phase 06 : c'est ce refus qui remplace le loader par « rien »
 * plutôt que par une version dégradée (décision D9).
 */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Décide si le morceau 3D a le droit de se charger. Refus, dans l'ordre du
 * coût pour la personne : mode économie de données (elle paie son forfait),
 * peu de mémoire (l'onglet se fait tuer), petit écran (le morceau pèse plus
 * que la page qu'il décore), pas de WebGL (rien à monter de toute façon).
 *
 * `deviceMemory` et `saveData` n'existent pas partout ; leur ABSENCE ne vaut
 * pas refus, sinon Safari et Firefox ne verraient jamais la 3D.
 */
export function allows3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  if (window.innerWidth < 1024) return false;

  const nav = navigator as Navigator & {
    connection?: Connection;
    deviceMemory?: number;
  };
  if (nav.connection?.saveData === true) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;
  if (!hasWebGL()) return false;

  return true;
}
