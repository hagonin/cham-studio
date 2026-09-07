'use client';

import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { colors } from '@/lib/tokens';
import styles from './CanvasHost.module.css';

/**
 * L'UNIQUE Canvas du site (phase 06, option A retenue dans le plan) : un hôte
 * partagé plutôt qu'un Canvas par morceau 3D, pour ne jamais payer deux
 * contextes WebGL à la fois. Sans scène, il ne rend RIEN — pas de canvas au
 * repos, pas de frame consommée. `frameloop="demand"` ne redessine que si la
 * scène le demande elle-même via `invalidate()` (voir `LoaderScene.tsx`).
 *
 * Le loader est aujourd'hui son seul appelant ; une éventuelle galerie
 * (phase 07) passerait sa propre scène par la même prop, sans toucher cet
 * hôte.
 */
export default function CanvasHost({ scene }: { scene: ReactNode }) {
  if (!scene) return null;

  return (
    <div className={styles.host}>
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, 4], fov: 42 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={[colors.paper]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        {scene}
      </Canvas>
    </div>
  );
}
