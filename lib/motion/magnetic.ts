import { gsap } from 'gsap';
import { hasFinePointer, prefersReducedMotion } from './prefs';

/**
 * Attraction magnétique sur les appels à l'action principaux, et sur eux seuls.
 *
 * L'effet est POINTEUR PAR NATURE : il ne peut donc jamais être la seule
 * affordance d'une action. Chaque cible garde son état de focus visible et son
 * libellé hors survol — ce fichier n'ajoute que du déplacement.
 *
 * Rend sa propre fonction de nettoyage : sans elle, une navigation client
 * laisse des écouteurs sur des nœuds détachés.
 *
 * `strength` et `release` sont paramétrables plutôt que dupliqués dans une
 * seconde fonction magnétique : la figure du hero demande un retour pondéré
 * (~0,9 s), les CTA gardent la relâche vive d'origine. Les valeurs par défaut
 * sont celles d'avant, l'appel `magnetic(el)` existant est inchangé.
 */
export function magnetic(
  element: HTMLElement,
  { strength = 0.28, release: releaseDuration = 0.4 } = {},
): () => void {
  if (!hasFinePointer() || prefersReducedMotion()) return () => {};

  const quickX = gsap.quickTo(element, 'x', {
    duration: releaseDuration,
    ease: 'power3',
  });
  const quickY = gsap.quickTo(element, 'y', {
    duration: releaseDuration,
    ease: 'power3',
  });

  function onMove(event: PointerEvent) {
    const rect = element.getBoundingClientRect();
    quickX((event.clientX - (rect.left + rect.width / 2)) * strength);
    quickY((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function release() {
    quickX(0);
    quickY(0);
  }

  element.addEventListener('pointermove', onMove);
  element.addEventListener('pointerleave', release);
  // Le focus clavier ne déplace rien : l'élément doit être là où le contour de
  // focus l'annonce, sinon le contour désigne un endroit vide.
  element.addEventListener('blur', release);

  return () => {
    element.removeEventListener('pointermove', onMove);
    element.removeEventListener('pointerleave', release);
    element.removeEventListener('blur', release);
    release();
  };
}
