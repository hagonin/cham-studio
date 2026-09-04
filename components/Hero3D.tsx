'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { allows3D } from '@/lib/motion/prefs';
import { colors } from '@/lib/tokens';
import styles from './Hero3D.module.css';

/**
 * LE moment 3D du site, et le seul. Sur `/[locale]/projects`, où la personne a
 * déjà décidé de regarder du métier — jamais sur la page qui vend, dont le
 * budget ne le supporterait pas.
 *
 * Chargé par `next/dynamic` avec `ssr: false`, à l'intersection, et seulement
 * si `allows3D()` : pas en économie de données, pas sous 4 Go de mémoire, pas
 * sous 1024 px, pas en reduced-motion. Le refus est silencieux — il n'y a rien
 * à remplacer, le bloc est décoratif.
 *
 * Three est importé par ses entrées tree-shakées (`import type { Mesh }`,
 * primitives JSX de R3F), jamais `import * as THREE`.
 */
function Dot() {
  const mesh = useRef<Mesh>(null);

  // La même idée que partout : deux choses qui se rejoignent. Ici une sphère
  // qui respire autour de son point de contact, pas une démonstration de moteur.
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.18;
    mesh.current.position.y = Math.sin(t * 0.6) * 0.08;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshStandardMaterial color={colors.seal} flatShading roughness={0.55} />
    </mesh>
  );
}

export default function Hero3D() {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = holder.current;
    if (!node || !allows3D()) return;

    // À l'intersection : le morceau ne se paie que s'il est regardé.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={holder} className={styles.holder} aria-hidden="true">
      {visible ? (
        <Canvas camera={{ position: [0, 0, 4], fov: 42 }} dpr={[1, 1.5]}>
          <color attach="background" args={[colors.paper]} />
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 4, 5]} intensity={1.6} />
          <Dot />
        </Canvas>
      ) : null}
    </div>
  );
}
