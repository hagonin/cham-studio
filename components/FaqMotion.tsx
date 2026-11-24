'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Recale les déclencheurs de défilement quand une réponse de la FAQ s'ouvre ou
 * se ferme, sans rien rendre : `Faq` reste un composant serveur.
 *
 * Un `<details>` qui s'ouvre change la hauteur de la page, mais ScrollTrigger ne
 * recalcule ses positions qu'au redimensionnement et au chargement des polices.
 * Ouvrir des réponses, recaler (rotation de l'écran), puis les refermer
 * laisserait les déclencheurs du pied de page (liens, signature) au-delà du
 * défilement maximal : ces éléments resteraient à opacité 0.
 *
 * `toggle` ne remonte pas dans l'arbre : on l'écoute en phase de CAPTURE sur la
 * section. Sous `prefers-reduced-motion` aucun déclencheur n'est créé, donc
 * `refresh()` ne fait rien. Sans JavaScript, les `<details>` restent natifs.
 */
export function FaqMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-faq]');
    if (!section) return;
    const refresh = () => ScrollTrigger.refresh();
    section.addEventListener('toggle', refresh, true);
    return () => section.removeEventListener('toggle', refresh, true);
  }, []);

  return null;
}
