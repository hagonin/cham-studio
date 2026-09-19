'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasHostSlot } from './CanvasHostSlot';
import {
  pageAfterSwipe,
  projectRowId,
  SWIPE_MIN,
  turnPage,
} from '@/lib/gallery/layout';
import { getLenis } from '@/lib/motion/lenis';
import { allows3D } from '@/lib/motion/prefs';
import { LOADER_DONE_EVENT, canvasIsFree } from '@/lib/motion/loader-gate';
import { colors } from '@/lib/tokens';
import styles from './Gallery3DSlot.module.css';

/**
 * La frontière entre le HTML canonique et son enrichissement 3D.
 *
 * `allows3D()` décide, et son refus ne dégrade jamais vers une version 2D :
 * il ne monte RIEN (D9). Reduced-motion, moins de 1024 px, économie de
 * données, mémoire faible, WebGL absent — dans tous ces cas la section reste
 * exactement ce que le serveur a rendu, sans interface d'erreur.
 *
 * Le test se fait après le montage, jamais au rendu : `allows3D()` lit
 * `window`, et le HTML servi doit être identique pour tout le monde.
 *
 * Le montage ATTEND que le loader ait rendu la main (`lib/motion/loader-gate`).
 * Le loader est un rideau opaque monté par le layout qui enveloppe cette page :
 * monter le canvas avant sa dismission, c'est charger les textures et faire
 * tourner une boucle de rendu sous une surface que personne ne voit. Les deux
 * portes ne sont plus les mêmes (le loader ne refuse que sur reduced-motion),
 * d'où le drapeau posé jusque dans sa branche de refus : sans lui, cette
 * attente n'aurait pas de fin.
 *
 * `Suspense` est ici et non dans `CanvasHost` : c'est `GalleryScene` qui
 * suspend, en chargeant ses textures, et l'hôte ne doit rien savoir de ses
 * scènes.
 *
 * Le livre : on le feuillette (glisser à la souris, au doigt ou au pavé
 * tactile, ou les flèches HTML), et un clic sur une page déplie SA ligne dans
 * la liste servie juste dessous. Tant que le livre est monté, les lignes
 * restent repliées et une seule paraît à la fois. S'il ne monte pas, rien de
 * cela n'existe : la liste complète reste celle du serveur.
 *
 * La scène est chargée DYNAMIQUEMENT, et c'est structurel, pas cosmétique :
 * un import statique met Three (~240 ko) dans le bundle de la page pour tout
 * le monde, y compris les téléphones qu'`allows3D()` refuse. Un site qui
 * affirme une compétence d'ingénierie et pèse un quart de méga de plus sur
 * mobile pour un décor a contredit son propre argument.
 */
const GalleryScene = dynamic(() => import('./GalleryScene'), { ssr: false });

export type BookItem = { slug: string; cover: string; title: string };
export type BookLabels = {
  hint: string;
  previous: string;
  next: string;
  open: string;
  close: string;
};

/** Silence, en ms, qui clôt un geste au pavé tactile. Son inertie émet des
 *  dizaines d'événements après que les doigts ont quitté le pavé. */
const GESTURE_GAP = 180;
/** Marge, en px, laissée sous une ligne dépliée quand on la ramène à l'écran. */
const BREATHING = 24;

/**
 * Défile juste assez pour que la ligne dépliée soit entière à l'écran, sans
 * jamais la pousser sous la barre de navigation. Le moins possible : le livre
 * doit rester en vue pour continuer à feuilleter.
 */
function bringIntoView(row: HTMLElement) {
  const { top, bottom } = row.getBoundingClientRect();
  const overflow = bottom + BREATHING - window.innerHeight;
  if (overflow <= 0) return;
  const navBottom =
    document.querySelector('[data-nav]')?.getBoundingClientRect().bottom ?? 0;
  const delta = Math.min(overflow, top - navBottom - BREATHING);
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(window.scrollY + delta);
  else window.scrollBy({ top: delta, behavior: 'smooth' });
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Gallery3DSlot({
  items,
  labels,
}: {
  items: readonly BookItem[];
  labels: BookLabels;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const count = items.length;
  // Le livre s'ouvre au milieu : c'est la composition d'origine — trois pages
  // en vue, la page centrale droite.
  const [active, setActive] = useState(() => Math.floor((count - 1) / 2));
  const [open, setOpen] = useState(false);
  // Posé par le geste d'ouverture, consommé une fois la ligne dépliée : on ne
  // défile que parce que la personne a demandé à voir, jamais en feuilletant.
  const scrollPending = useRef(false);

  useEffect(() => {
    if (!allows3D() || count === 0) return;
    if (canvasIsFree()) {
      setEnabled(true);
      return;
    }

    const onLoaderDone = () => setEnabled(true);
    window.addEventListener(LOADER_DONE_EVENT, onLoaderDone, { once: true });
    return () => window.removeEventListener(LOADER_DONE_EVENT, onLoaderDone);
  }, [count]);

  // Les lignes de la liste suivent le livre. Elles sont rendues par le
  // SERVEUR : on les replie par l'attribut `hidden`, qui les retire aussi de
  // l'arbre d'accessibilité, et on les rend toutes au démontage.
  useEffect(() => {
    if (!enabled) return;
    const rows = items.map((item) => document.getElementById(projectRowId(item.slug)));
    const list = rows[0]?.parentElement;
    list?.setAttribute('data-book', '');
    rows.forEach((row, index) =>
      row?.toggleAttribute('hidden', !(open && index === active)),
    );

    // La page vient de changer de hauteur : les déclencheurs de révélation
    // plus bas, et les zones mises en cache par le curseur, se recalent.
    ScrollTrigger.refresh();
    const row = rows[active];
    if (scrollPending.current && open && row) bringIntoView(row);
    scrollPending.current = false;

    return () => {
      list?.removeAttribute('data-book');
      rows.forEach((row) => row?.removeAttribute('hidden'));
    };
  }, [enabled, open, active, items]);

  // Les gestes. Écouteurs natifs et non props React : `wheel` doit être NON
  // passif pour pouvoir annuler le « page précédente » du navigateur, ce que
  // React ne permet pas.
  useEffect(() => {
    const stage = anchor.current;
    if (!enabled || !stage) return;

    let startX: number | null = null;
    const down = (event: PointerEvent) => {
      // Les boutons du livre ont leur propre clic : y appuyer n'est pas un geste.
      if (!event.isPrimary || (event.target as Element).closest('button')) return;
      startX = event.clientX;
    };
    // Écouté sur `window` : un glissé à la souris finit souvent hors de la scène.
    const up = (event: PointerEvent) => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      startX = null;
      setActive((page) => pageAfterSwipe(page, dx, count));
    };
    // Le doigt est parti défiler la page à la verticale (`touch-action: pan-y`).
    const cancel = () => {
      startX = null;
    };

    // Pavé tactile : deux doigts à l'horizontale arrivent en `wheel`. On cumule,
    // on tourne UNE page, puis on attend le silence avant le geste suivant.
    let sum = 0;
    let spent = false;
    let quiet: number | undefined;
    const wheel = (event: WheelEvent) => {
      // Vertical : c'est le défilement de la page, on n'y touche pas.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        sum = 0;
        spent = false;
      }, GESTURE_GAP);
      if (spent) return;
      // Doigts vers la gauche ⇒ deltaX positif ⇒ page suivante, comme au glissé.
      sum -= event.deltaX;
      if (Math.abs(sum) < SWIPE_MIN) return;
      spent = true;
      const dx = sum;
      setActive((page) => pageAfterSwipe(page, dx, count));
    };

    stage.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    stage.addEventListener('wheel', wheel, { passive: false });
    return () => {
      stage.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      stage.removeEventListener('wheel', wheel);
      window.clearTimeout(quiet);
    };
  }, [enabled, count]);

  if (!enabled) return null;

  const current = items[active];
  const reveal = (index: number) => {
    scrollPending.current = true;
    setActive(index);
    setOpen(true);
  };

  return (
    <div ref={anchor} className={styles.stage}>
      <div className={styles.canvas} aria-hidden="true">
        <CanvasHostSlot
          background={colors.ink}
          scene={
            <Suspense fallback={null}>
              <GalleryScene
                covers={items.map((item) => item.cover)}
                active={active}
                onPick={reveal}
                anchor={anchor}
              />
            </Suspense>
          }
        />
      </div>

      {/* Le chemin clavier et lecteur d'écran du livre : le canvas est muet,
          ces boutons font tout ce que font le glissé et le clic. */}
      <div className={styles.controls}>
        <span className={styles.hint} aria-hidden="true">
          {labels.hint}
        </span>

        {/* `aria-live` : au clavier, le focus reste sur la flèche ; sans
            annonce, la page change sans que rien ne le dise. */}
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={projectRowId(current.slug)}
          aria-live="polite"
          onClick={() => (open ? setOpen(false) : reveal(active))}
        >
          <span className={styles.counter}>
            {pad(active + 1)} / {pad(count)}
          </span>
          <span>{current.title}</span>
          <span className={styles.state}>{open ? labels.close : labels.open}</span>
        </button>

        {/* `aria-disabled` et non `disabled` : un bouton désactivé perd le
            focus, qui retomberait sur <body> au bout du livre. */}
        <div className={styles.turns}>
          <button
            type="button"
            className={styles.turn}
            aria-label={labels.previous}
            aria-disabled={active === 0}
            onClick={() => setActive((page) => turnPage(page, -1, count))}
          >
            ←
          </button>
          <button
            type="button"
            className={styles.turn}
            aria-label={labels.next}
            aria-disabled={active === count - 1}
            onClick={() => setActive((page) => turnPage(page, 1, count))}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
