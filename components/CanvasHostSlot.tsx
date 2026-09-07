'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';

/**
 * La frontière client de l'hôte 3D. Elle existe pour une seule raison : Next
 * 15 refuse `ssr: false` dans un composant serveur, or c'est exactement ce
 * qu'il faut ici — Three ne doit jamais entrer dans le bundle serveur.
 */
const CanvasHost = dynamic(() => import('./CanvasHost'), { ssr: false });

export function CanvasHostSlot({ scene }: { scene: ReactNode }) {
  return <CanvasHost scene={scene} />;
}
