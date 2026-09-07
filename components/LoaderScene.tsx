'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Mesh, type MeshBasicMaterial } from 'three';
import { colors } from '@/lib/tokens';

// La séquence dessinée dans le plan, en secondes depuis le montage.
const CONTACT_T = 1.6;
const DISMISS_T = 2.4;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Deux points ouverts aux bords du cadre se rejoignent sur une ease lente
 * (0 → 1,6 s), puis s'effacent au profit d'un point d'accent unique et de
 * deux anneaux qui s'étendent (1,6 s → coupure). C'est le seul accent avant
 * le hero : les deux points de convergence restent neutres (`--line`)
 * jusqu'au contact.
 *
 * `invalidate()` se rappelle lui-même à chaque frame tant que la séquence
 * tourne : sous `frameloop="demand"` (CanvasHost), un `useFrame` qui ne le
 * fait pas ne dessine qu'une image et se fige (règle 9, phase 06).
 */
export function LoaderScene() {
  const leftDot = useRef<Mesh>(null);
  const rightDot = useRef<Mesh>(null);
  const contactDot = useRef<Mesh>(null);
  const ringAMesh = useRef<Mesh>(null);
  const ringAMat = useRef<MeshBasicMaterial>(null);
  const ringBMesh = useRef<Mesh>(null);
  const ringBMat = useRef<MeshBasicMaterial>(null);
  const start = useRef<number | null>(null);

  useFrame((state) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - start.current;

    const convergeT = easeOutCubic(Math.min(elapsed / CONTACT_T, 1));
    const x = 2.2 * (1 - convergeT);
    leftDot.current?.position.setX(-x);
    rightDot.current?.position.setX(x);

    const arrived = elapsed >= CONTACT_T;
    const popT = arrived ? Math.min((elapsed - CONTACT_T) / 0.15, 1) : 0;
    leftDot.current?.scale.setScalar(1 - popT);
    rightDot.current?.scale.setScalar(1 - popT);
    contactDot.current?.scale.setScalar(popT);

    if (arrived) {
      for (const [mesh, mat, delay] of [
        [ringAMesh.current, ringAMat.current, 0],
        [ringBMesh.current, ringBMat.current, 0.12],
      ] as const) {
        if (!mesh || !mat) continue;
        const t = Math.max(0, Math.min((elapsed - CONTACT_T - delay) / 0.6, 1));
        mesh.scale.setScalar(0.2 + t * 1.8);
        mat.opacity = 0.45 * (1 - t);
      }
    }

    if (elapsed < DISMISS_T) state.invalidate();
  });

  return (
    <group>
      <mesh ref={leftDot}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={colors.line} />
      </mesh>
      <mesh ref={rightDot}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={colors.line} />
      </mesh>
      <mesh ref={contactDot} scale={0}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={colors.touch} />
      </mesh>
      <mesh ref={ringAMesh} scale={0}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial
          ref={ringAMat}
          color={colors.touch}
          transparent
          opacity={0}
          side={DoubleSide}
        />
      </mesh>
      <mesh ref={ringBMesh} scale={0}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial
          ref={ringBMat}
          color={colors.touch}
          transparent
          opacity={0}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}
