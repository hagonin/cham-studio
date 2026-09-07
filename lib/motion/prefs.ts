/**
 * Les préférences qui décident SI la Phase 10 s'exécute. Isolées ici, sans
 * import de GSAP ni de Lenis : ce sont les seules décisions du système de
 * mouvement qui se testent sans navigateur, et ce sont celles qui, prises à
 * l'envers, cassent l'accessibilité.
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
