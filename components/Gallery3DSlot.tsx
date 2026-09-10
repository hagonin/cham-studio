'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CanvasHostSlot } from './CanvasHostSlot';
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
 * La scène est chargée DYNAMIQUEMENT, et c'est structurel, pas cosmétique :
 * un import statique met Three (~240 ko) dans le bundle de la page pour tout
 * le monde, y compris les téléphones qu'`allows3D()` refuse. Un site qui
 * affirme une compétence d'ingénierie et pèse un quart de méga de plus sur
 * mobile pour un décor a contredit son propre argument.
 */
const GalleryScene = dynamic(() => import('./GalleryScene'), { ssr: false });
export function Gallery3DSlot({ covers }: { covers: readonly string[] }) {
  const anchor = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!allows3D() || covers.length === 0) return;
    if (canvasIsFree()) {
      setEnabled(true);
      return;
    }

    const onLoaderDone = () => setEnabled(true);
    window.addEventListener(LOADER_DONE_EVENT, onLoaderDone, { once: true });
    return () => window.removeEventListener(LOADER_DONE_EVENT, onLoaderDone);
  }, [covers.length]);

  if (!enabled) return null;

  return (
    <div ref={anchor} className={styles.stage} aria-hidden="true">
      <CanvasHostSlot
        background={colors.ink}
        scene={
          <Suspense fallback={null}>
            <GalleryScene covers={covers} anchor={anchor} />
          </Suspense>
        }
      />
    </div>
  );
}
