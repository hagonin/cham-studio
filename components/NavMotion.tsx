'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Le comportement de la nav, sans rien rendre. `SectionNav` reste serveur.
 *
 * Deux responsabilités, et une seule est du mouvement :
 * 1. `aria-current` sur le lien de la section à l'écran. C'est un ÉTAT, pas une
 *    animation : il n'est donc pas gardé par `prefers-reduced-motion`. Une
 *    barre collante qui ne dit pas où l'on est vaut moins que pas de barre.
 * 2. L'ouverture du menu plein écran, avec Escape, piège de focus et
 *    restitution du focus au bouton.
 *
 * Le défilement n'est PAS réimplémenté ici : `MotionProvider` intercepte déjà
 * tout `a[href^="#"]`. Le menu ne fait que se fermer — un second chemin de
 * défilement serait un second endroit où perdre le focus.
 *
 * L'observateur passe par ScrollTrigger et non par IntersectionObserver :
 * Lenis pilote déjà `ScrollTrigger.update`, un second observateur lirait des
 * positions désynchronisées du défilement lissé.
 */
export function NavMotion() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('[data-nav]');
    const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
    const menu = document.getElementById('nav-menu');
    if (!nav || !toggle || !menu) return;

    const links = [...menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];

    /* --- État de section courante ------------------------------------------
       Un déclencheur par section, sur des plages qui ne se CHEVAUCHENT pas :
       la même ligne de référence (45 % de la fenêtre) sert de début et de fin,
       donc exactement une section est active à la fois — jamais deux, jamais
       un clignotement entre les deux. */
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];
    let firstSection: Element | null = null;

    for (const link of links) {
      const heading = document.querySelector<HTMLElement>(
        link.getAttribute('href') ?? '',
      );
      const section = heading?.closest('section');
      if (!section) continue;
      firstSection ??= section;

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (!self.isActive) return;
            for (const other of links) other.removeAttribute('aria-current');
            link.setAttribute('aria-current', 'true');
          },
        }),
      );
    }

    // Le lien courant n'est JAMAIS retiré en sortant d'une section : toutes les
    // sections de la page ne sont pas ancrées (le bloc « approche » ne l'est
    // pas), et les effacer au passage laisserait la barre sans état au beau
    // milieu de la page. Le dernier repère atteint tient jusqu'au suivant.
    //
    // Une seule exception, et c'est celle-ci : au-dessus de la première
    // section ancrée — le hero — personne n'est courant, parce que le hero
    // n'est pas une destination de la nav.
    if (firstSection) {
      triggers.push(
        ScrollTrigger.create({
          trigger: firstSection,
          start: 'top 45%',
          onLeaveBack: () => {
            for (const link of links) link.removeAttribute('aria-current');
          },
        }),
      );
    }

    /* --- Menu plein écran --------------------------------------------------- */
    let open = false;
    // Le piège inclut le bouton et le sélecteur de locale : tout ce qui est
    // visible pendant que le menu couvre l'écran, et rien d'autre.
    const focusablesIn = () =>
      [...nav.querySelectorAll<HTMLElement>('a[href], button')].filter(
        (element) => element.offsetParent !== null,
      );

    function setOpen(next: boolean) {
      open = next;
      toggle!.setAttribute('aria-expanded', String(next));
      toggle!.textContent = next
        ? (toggle!.dataset.labelClose ?? '')
        : (toggle!.dataset.labelOpen ?? '');
      nav!.dataset.open = String(next);
      // Le défilement de la page derrière un menu plein écran donne un
      // deuxième contenu qui bouge sous le premier.
      document.body.style.overflow = next ? 'hidden' : '';
      if (!next) toggle!.focus();
    }

    function onToggleClick() {
      setOpen(!open);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      // Piège de focus : sans lui, la tabulation continue derrière le menu,
      // sur des liens que personne ne voit.
      const focusables = focusablesIn();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // Le clic sur une ancre ferme le menu — il ne défile pas lui-même.
    function onMenuClick(event: MouseEvent) {
      if (!open) return;
      if ((event.target as Element | null)?.closest('a[href^="#"]')) setOpen(false);
    }

    // Élargir la fenêtre au-delà de 40rem fait disparaître le bouton avec sa
    // requête média — sans cette ligne, le menu se refermerait tout seul mais
    // le verrou de défilement resterait posé sur une page qu'on ne peut plus
    // débloquer, faute de bouton pour le faire.
    function onResize() {
      if (open && toggle!.offsetParent === null) setOpen(false);
    }

    toggle.addEventListener('click', onToggleClick);
    menu.addEventListener('click', onMenuClick);
    document.addEventListener('keydown', onKeyDown);
    addEventListener('resize', onResize);

    return () => {
      toggle.removeEventListener('click', onToggleClick);
      menu.removeEventListener('click', onMenuClick);
      document.removeEventListener('keydown', onKeyDown);
      removeEventListener('resize', onResize);
      for (const trigger of triggers) trigger.kill();
      // Un menu démonté ouvert laisserait la page bloquée sans rien pour la
      // débloquer : l'état de défilement du corps est rendu dans tous les cas.
      document.body.style.overflow = '';
    };
  }, []);

  return null;
}
