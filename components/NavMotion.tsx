'use client';

import { useEffect } from 'react';

/**
 * Le comportement de la barre, sans rien rendre : `SectionNav` reste serveur.
 * C'est celui de `navigation.js` du prototype, règle pour règle :
 * 1. `aria-current="location"` sur le lien de la section à l'écran — la
 *    dernière dont le haut est passé au-dessus de 160px, et « contact » une
 *    fois le bas de page atteint. C'est un ÉTAT, pas une animation : il n'est
 *    donc pas gardé par `prefers-reduced-motion`. Au-dessus de la première
 *    section, personne n'est courant : le hero n'est pas une destination.
 * 2. Le menu sous 800px : Échap referme et rend le focus au bouton, tout clic sur
 *    un lien de la barre referme, et élargir la fenêtre au-delà de 800px referme
 *    aussi.
 *
 * Le menu est un `<details>` : il s'ouvre, se ferme et change de libellé SANS ce
 * composant, qui n'ajoute que les trois fermetures ci-dessus. Sans JavaScript, ou
 * avant l'hydratation, le menu fonctionne ; il reste ouvert après un clic sur un
 * lien, jusqu'à ce que la personne le referme.
 *
 * Le défilement n'est PAS réimplémenté ici : `MotionProvider` intercepte déjà
 * tout `a[href^="#"]`. Le menu est un panneau, pas une modale : il ne bloque ni
 * le défilement ni le focus, comme dans le dessin.
 */
export function NavMotion() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-nav]');
    const menu = header?.querySelector<HTMLDetailsElement>('[data-menu]');
    if (!header || !menu) return;

    /* --- Menu ------------------------------------------------------------- */
    const close = () => {
      menu.open = false;
    };
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest('a')) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !menu.open) return;
      close();
      menu.querySelector('summary')?.focus();
    };
    const wide = matchMedia('(min-width: 801px)');
    const onWide = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    header.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    wide.addEventListener('change', onWide);

    /* --- Section courante -------------------------------------------------- */
    const links = [...header.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]')];
    const entries = links.flatMap((link) => {
      const heading = document.querySelector<HTMLElement>(link.hash);
      const node = heading?.closest('section') ?? heading;
      return node ? [{ link, node }] : [];
    });
    const contact = links.find((link) => link.hash === '#contact-title');

    let scheduled = false;
    const update = () => {
      scheduled = false;
      let active: HTMLAnchorElement | undefined;
      const byPosition = [...entries].sort(
        (a, b) =>
          a.node.getBoundingClientRect().top - b.node.getBoundingClientRect().top,
      );
      for (const { link, node } of byPosition) {
        if (node.getBoundingClientRect().top <= 160) active = link;
      }
      if (
        scrollY > 0 &&
        scrollY + innerHeight >= document.documentElement.scrollHeight - 4
      ) {
        active = contact;
      }
      // Les liens existent deux fois (barre en ligne et panneau) : on marque
      // ceux qui pointent sur la section courante, dans l'un comme dans l'autre.
      for (const link of links) {
        if (active && link.hash === active.hash)
          link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();

    return () => {
      header.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
      wide.removeEventListener('change', onWide);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);

  return null;
}
