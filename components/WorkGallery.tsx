'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  classifyMove,
  dragOffset,
  slotFor,
  swipeStep,
  wrapIndex,
} from '@/lib/gallery/carousel';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import { fill } from '@/lib/i18n/fill';
import styles from './WorkGallery.module.css';

export type WorkCover = { src: string; width: number; height: number; alt: string };

export type WorkProject = {
  slug: string;
  title: string;
  role: string;
  description: string;
  cover: WorkCover;
};

/** Les libellés de la section. Ceux qui portent `{title}`, `{n}` ou `{total}` sont
 *  des gabarits : la phrase s'écrit dans chaque langue, sans collage de morceaux. */
export type WorkCopy = {
  meta: string[];
  carouselLabel: string;
  hint: string;
  unfold: string;
  fold: string;
  previous: string;
  next: string;
  select: string;
  unfoldLabel: string;
  foldLabel: string;
  announceOpen: string;
  announceClosed: string;
  title: string;
  lead: string[];
  explore: string;
  enlarge: string;
  lightbox: string;
  close: string;
  closeLabel: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * La section « travaux » du dessin (`index.html`, `selected-work.css`,
 * `selected-work.js` du prototype) : une scène sombre où trois panneaux tournent
 * en CSS 3D, puis un bloc éditorial dont le détail du projet ouvert se déplie.
 *
 * C'est du CSS 3D, pas du WebGL : des `<img>` dans des boutons, donc de vrais
 * éléments accessibles. Le projet ouvert est au centre ; cliquer le panneau
 * central déplie ses détails, cliquer un voisin l'ouvre ; les boutons, les
 * flèches du clavier et le glissé horizontal tournent la boucle. Un glissé
 * VERTICAL n'est jamais pris : la page continue de défiler (`lib/gallery/carousel.ts`).
 *
 * Sans JavaScript, ou avant l'hydratation, toute la copie est dans le HTML servi :
 * les trois fiches de détail sont visibles et dépliées. L'amélioration
 * (`enhanced`) ne fait que les replier et n'en montrer qu'une.
 *
 * Accessibilité du dessin, toute conservée : la scène est une région
 * `carousel` ; chaque panneau change de nom avec l'état ; le panneau ouvert porte
 * `aria-current` ; une région `status` annonce chaque changement UNE fois ; les
 * détails repliés sont `inert` et `aria-hidden`. `aria-expanded` va avec
 * `aria-controls` (`check-html.mjs` l'exige).
 */
export function WorkGallery({
  projects,
  copy,
}: {
  projects: WorkProject[];
  copy: WorkCopy;
}) {
  const count = projects.length;
  const [current, setCurrent] = useState(Math.min(1, count - 1));
  const [expanded, setExpanded] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [lightbox, setLightbox] = useState<WorkCover | null>(null);

  const viewport = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    horizontal: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => setEnhanced(true), []);

  // La page vient de changer de hauteur (un détail se déplie ou change) : les
  // déclencheurs de révélation plus bas se recalent, une fois la transition finie.
  useEffect(() => {
    if (!enhanced) return;
    gsap.registerPlugin(ScrollTrigger);
    const timer = setTimeout(
      () => ScrollTrigger.refresh(),
      prefersReducedMotion() ? 0 : 750,
    );
    return () => clearTimeout(timer);
  }, [enhanced, current, expanded]);

  const announce = (index: number, open: boolean) => {
    setAnnouncement(
      fill(open ? copy.announceOpen : copy.announceClosed, {
        n: index + 1,
        total: count,
        title: projects[index].title,
      }),
    );
  };

  const select = (index: number) => {
    const next = wrapIndex(index, count);
    scene.current?.style.setProperty('--drag-x', '0px');
    setCurrent(next);
    announce(next, expanded);
  };

  const toggleDetails = () => {
    const next = !expanded;
    setExpanded(next);
    announce(current, next);
  };

  const onPanelClick = (index: number, event: React.MouseEvent) => {
    if (suppressClick.current) {
      event.preventDefault();
      return;
    }
    if (index === current) toggleDetails();
    else select(index);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(current + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Escape' && expanded) {
      setExpanded(false);
      announce(current, false);
    }
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    if (event.button !== 0 || !event.isPrimary) return;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      horizontal: false,
    };
    suppressClick.current = false;
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const dx = event.clientX - g.x;
    const dy = event.clientY - g.y;
    const verdict = classifyMove(dx, dy, g.horizontal);
    if (verdict === 'cancel') {
      gesture.current = null;
      return;
    }
    if (verdict === 'horizontal' && !g.horizontal) {
      g.horizontal = true;
      viewport.current?.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (g.horizontal) {
      suppressClick.current = true;
      if (!prefersReducedMotion()) {
        scene.current?.style.setProperty('--drag-x', `${dragOffset(dx)}px`);
      }
    }
  };

  const finishGesture = (event: ReactPointerEvent, cancel = false) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const dx = event.clientX - g.x;
    gesture.current = null;
    setDragging(false);
    if (viewport.current?.hasPointerCapture(event.pointerId)) {
      viewport.current.releasePointerCapture(event.pointerId);
    }
    scene.current?.style.setProperty('--drag-x', '0px');
    const step = cancel || !g.horizontal ? 0 : swipeStep(dx);
    if (step !== 0) select(current + step);
    // Le clic qui suit un glissé est avalé ; on lève la garde au tour suivant.
    if (g.horizontal) setTimeout(() => (suppressClick.current = false), 0);
  };

  const openLightbox = (cover: WorkCover) => {
    setLightbox(cover);
    dialog.current?.showModal();
  };

  const active = projects[current];

  return (
    <section
      className={`${styles.section} ${enhanced ? styles.enhanced : ''}`}
      aria-labelledby="work-title"
    >
      <div className={styles.stage}>
        <div className={styles.meta}>
          <span>{copy.meta[0]}</span>
          <span>{copy.meta[1]}</span>
          <span>{copy.meta[2]}</span>
        </div>

        <div
          ref={viewport}
          className={`${styles.viewport} ${dragging ? styles.dragging : ''}`}
          role="region"
          aria-roledescription="carousel"
          aria-label={copy.carouselLabel}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => finishGesture(event)}
          onPointerCancel={(event) => finishGesture(event, true)}
        >
          <div ref={scene} className={styles.scene}>
            {projects.map((project, index) => (
              <button
                key={project.slug}
                className={styles.panel}
                data-slot={slotFor(index, current, count)}
                type="button"
                aria-label={
                  index === current
                    ? fill(expanded ? copy.foldLabel : copy.unfoldLabel, {
                        title: project.title,
                      })
                    : fill(copy.select, { title: project.title })
                }
                aria-current={index === current ? 'true' : undefined}
                onClick={(event) => onPanelClick(index, event)}
              >
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  width={project.cover.width}
                  height={project.cover.height}
                  sizes="(max-width: 47.5rem) 61vw, min(27vw, 420px)"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <span className={styles.hint}>{copy.hint}</span>
          <button
            className={styles.toggle}
            type="button"
            aria-expanded={expanded}
            aria-controls="project-details"
            onClick={toggleDetails}
          >
            <span className={styles.counter}>
              {pad(current + 1)} / {pad(count)}
            </span>
            <span>{active.title.toLocaleUpperCase()}</span>
            <span className={styles.toggleLabel}>
              {expanded ? copy.fold : copy.unfold}
            </span>
          </button>
          <div className={styles.arrows}>
            <button
              className={styles.prev}
              type="button"
              aria-label={copy.previous}
              onClick={() => select(current - 1)}
            >
              ←
            </button>
            <button
              className={styles.next}
              type="button"
              aria-label={copy.next}
              onClick={() => select(current + 1)}
            >
              →
            </button>
          </div>
        </div>
        <span className={styles.announcement} role="status" aria-live="polite">
          {announcement}
        </span>
      </div>

      <div className={styles.editorial}>
        <div className={styles.workHeading}>
          <h2 id="work-title">{copy.title}</h2>
          <p>
            {copy.lead[0]}
            <br />
            {copy.lead[1]}
          </p>
        </div>
        <div
          className={`${styles.details} ${expanded ? styles.open : ''}`}
          id="project-details"
          inert={enhanced && !expanded}
          aria-hidden={enhanced ? !expanded : undefined}
        >
          <div className={styles.detailsInner}>
            {projects.map((project, index) => (
              <article
                key={project.slug}
                className={styles.detail}
                hidden={enhanced && index !== current}
                aria-labelledby={`project-title-${index}`}
              >
                <div className={styles.detailCopy}>
                  <span className={styles.number}>{pad(index + 1)}</span>
                  <h3 id={`project-title-${index}`}>{project.title}</h3>
                  <p className={styles.role}>{project.role}</p>
                  <p className={styles.description}>{project.description}</p>
                </div>
                <button
                  className={styles.enlarge}
                  type="button"
                  aria-label={fill(copy.enlarge, { title: project.title })}
                  onClick={() => openLightbox(project.cover)}
                >
                  <Image
                    src={project.cover.src}
                    alt={project.cover.alt}
                    width={project.cover.width}
                    height={project.cover.height}
                    sizes="(max-width: 47.5rem) 90vw, 40vw"
                  />
                  <span>{copy.explore}</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={copy.lightbox}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        onClose={() => setLightbox(null)}
      >
        <button
          className={styles.lightboxClose}
          type="button"
          aria-label={copy.closeLabel}
          onClick={() => dialog.current?.close()}
        >
          {copy.close}
        </button>
        {lightbox ? (
          <Image
            src={lightbox.src}
            alt={lightbox.alt}
            width={lightbox.width}
            height={lightbox.height}
            sizes="(max-width: 1280px) 94vw, 1200px"
          />
        ) : null}
      </dialog>
    </section>
  );
}
