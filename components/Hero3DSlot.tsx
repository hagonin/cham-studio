'use client';

import dynamic from 'next/dynamic';

/**
 * La frontière client du moment 3D. Elle existe pour une seule raison : Next 15
 * refuse `ssr: false` dans un composant serveur, or c'est exactement ce qu'il
 * faut ici — Three ne doit jamais entrer dans le bundle serveur.
 *
 * Ce fichier ne contient donc aucune logique : `Hero3D` se garde lui-même
 * (intersection, mémoire, économie de données, largeur, reduced-motion) avant
 * de monter le moindre canvas.
 */
const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

export function Hero3DSlot() {
  return <Hero3D />;
}
