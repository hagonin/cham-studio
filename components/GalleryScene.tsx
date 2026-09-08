'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { type Group, SRGBColorSpace, TextureLoader } from 'three';
import { scrollProgress, slotsFor } from '@/lib/gallery/layout';

/** Hauteur d'un écran en unités de scène. La largeur en découle : les visuels
 *  sont tous au même rapport 1,6:1 (garde : `tests/content.test.ts`), et c'est
 *  ce qui permet à la composition de tenir — des rapports mélangés ne
 *  s'équilibrent pas en profondeur.
 *
 *  La valeur est bornée par la LARGEUR, pas par la hauteur : le bandeau est
 *  large et court, et trois écrans côte à côte doivent tenir dedans au point
 *  le plus proche de la course caméra. À 0,9 ils occupaient moins d'un tiers
 *  de la hauteur et la bande lisait comme un vide avec des vignettes dedans. */
const PLANE_H = 1.35;
const PLANE_W = PLANE_H * 1.6;
/** Course de la caméra le long de Z, du début à la fin du défilement. */
const TRAVEL = 1.2;
/** Vitesse de rattrapage vers la cible. Le mouvement DÉRIVE du défilement,
 *  mais sans lissage il colle au pixel et devient nerveux. */
const EASE = 0.08;

/**
 * Trois écrans suspendus à des profondeurs différentes, traversés lentement
 * par la caméra au défilement. Le sol sombre et cette scène sont les DEUX
 * moments signature du site — le loader et celui-ci — et il n'y en a pas de
 * troisième : leur force tient à ce qu'ils soient rares.
 *
 * La scène ne porte AUCUNE information : les titres, rôles, années et liens
 * vivent dans le HTML servi juste dessous (`ProjectList`). Le canvas est
 * `aria-hidden` et n'est jamais le seul chemin vers un projet.
 *
 * `invalidate()` sous `frameloop="demand"` : la scène ne redessine que
 * lorsqu'elle bouge ET qu'elle est visible. Hors écran, plus aucun appel,
 * donc plus aucune frame — c'est la pause réelle que l'ancien `Hero3D`
 * n'avait jamais (il ne faisait que retarder son premier montage).
 */
export default function GalleryScene({
  covers,
  anchor,
}: {
  covers: readonly string[];
  anchor: RefObject<HTMLElement | null>;
}) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  // `useLoader` met en cache par URL : les mêmes fichiers que la liste HTML,
  // donc le navigateur les a déjà. Aucun second jeu de visuels (règle du plan).
  const textures = useLoader(TextureLoader, [...covers]);
  useEffect(() => {
    for (const texture of textures) texture.colorSpace = SRGBColorSpace;
  }, [textures]);

  const slots = useMemo(() => slotsFor(covers.length), [covers.length]);

  const target = useRef(0);
  const current = useRef(0);
  const visible = useRef(false);

  useEffect(() => {
    const element = anchor.current;
    if (!element) return;

    const read = () => {
      const rect = element.getBoundingClientRect();
      target.current = scrollProgress(rect.top, rect.height, window.innerHeight);
    };

    // Observer VIVANT : il ne se déconnecte pas après le premier passage.
    // C'est lui qui suspend le rendu quand la section sort du champ.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          read();
          invalidate();
        }
      },
      { rootMargin: '10%' },
    );
    observer.observe(element);

    const onScroll = () => {
      if (!visible.current) return;
      read();
      invalidate();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    read();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [anchor, invalidate]);

  useFrame((state) => {
    if (!visible.current || !group.current) return;

    const delta = target.current - current.current;
    current.current += delta * EASE;
    group.current.position.z = (current.current - 0.5) * TRAVEL;

    // Tant que le rattrapage n'est pas terminé, redemander une frame. Une fois
    // posé, plus rien : le défilement suivant relancera la boucle.
    if (Math.abs(delta) > 0.0005) state.invalidate();
  });

  return (
    <group ref={group}>
      {slots.map((slot, index) => (
        <mesh
          key={covers[index]}
          position={[slot.x, 0, slot.z]}
          rotation={[0, slot.rotationY, 0]}
        >
          <planeGeometry args={[PLANE_W, PLANE_H]} />
          <meshBasicMaterial map={textures[index]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
