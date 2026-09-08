'use client';

import { useEffect, useState } from 'react';
import { CanvasHostSlot } from './CanvasHostSlot';
import { LoaderScene } from './LoaderScene';
import { allows3D } from '@/lib/motion/prefs';
import { LOADER_DONE_EVENT, LOADER_SESSION_KEY } from '@/lib/motion/loader-gate';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './Loader.module.css';

const ARRIVE_MS = 2100;
const DISMISS_MS = 2400;

/**
 * Le chargeur 3D (décision owner, phase 06) : un point de contact avant le
 * hero, jamais une porte. Le HTML du hero est déjà complet dans le DOM servi
 * — ce composant ne fait qu'ajouter un rideau qui se retire de lui-même, y
 * compris si le Canvas échoue à monter (la minuterie ne dépend d'aucun signal
 * venu de `CanvasHostSlot`).
 *
 * `allows3D()` refuse déjà le reduced-motion, <1024px, l'économie de données,
 * la mémoire faible et (depuis cette phase) l'absence de WebGL : un refus ne
 * dégrade jamais vers une version 2D, il saute directement au contenu (D9).
 *
 * Session-once : le drapeau se pose à la DISMISSION, pas au montage — une
 * personne qui quitte pendant l'animation la reverra à son retour.
 */
export function Loader({ dict }: { dict: Dictionary }) {
  const [phase, setPhase] = useState<'hidden' | 'active' | 'leaving'>('hidden');

  useEffect(() => {
    if (!allows3D()) return;
    if (sessionStorage.getItem(LOADER_SESSION_KEY)) return;

    setPhase('active');
    const arrive = setTimeout(() => setPhase('leaving'), ARRIVE_MS);
    const dismiss = setTimeout(() => {
      sessionStorage.setItem(LOADER_SESSION_KEY, '1');
      setPhase('hidden');
      // La galerie attend ce signal pour monter SON canvas : tant que celui-ci
      // vit, il n'y a pas de place pour un second contexte WebGL.
      window.dispatchEvent(new Event(LOADER_DONE_EVENT));
    }, DISMISS_MS);

    return () => {
      clearTimeout(arrive);
      clearTimeout(dismiss);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`${styles.overlay} ${phase === 'leaving' ? styles.leaving : ''}`}
      aria-hidden="true"
    >
      <CanvasHostSlot scene={<LoaderScene />} />
      <span className={styles.mark}>{dict.brand.name}</span>
    </div>
  );
}
