'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { type ThreeEvent, useFrame, useLoader, useThree } from '@react-three/fiber';
import { type Group, type Mesh, SRGBColorSpace, TextureLoader } from 'three';
import { SWIPE_MIN, scrollProgress, slotAt } from '@/lib/gallery/layout';

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
/** Vitesse d'une page qui tourne. Plus vive que la dérive au défilement : ici
 *  la personne a fait un geste et attend une réponse. */
const TURN_EASE = 0.14;
/** En deçà, un rattrapage est terminé : on pose la valeur et la boucle s'arrête. */
const SETTLED = 0.0005;

/**
 * Trois écrans suspendus à des profondeurs différentes, traversés lentement
 * par la caméra au défilement. Le sol sombre et cette scène sont les DEUX
 * moments signature du site — le loader et celui-ci — et il n'y en a pas de
 * troisième : leur force tient à ce qu'ils soient rares.
 *
 * Les écrans se feuillettent comme les pages d'un livre : la page ouverte
 * (`active`) est au centre, ses voisines s'inclinent vers elle. Un clic sur un
 * écran le signale à `onPick` ; c'est `Gallery3DSlot` qui décide ce qu'il
 * ouvre. La scène ne porte toujours AUCUNE information : titres, rôles,
 * années et liens restent dans le HTML servi dessous (`ProjectList`), et le
 * canvas est `aria-hidden` — les boutons HTML du livre sont le chemin clavier.
 *
 * `invalidate()` sous `frameloop="demand"` : la scène ne redessine que
 * lorsqu'elle bouge ET qu'elle est visible. Hors écran, plus aucun appel,
 * donc plus aucune frame — c'est la pause réelle que l'ancien `Hero3D`
 * n'avait jamais (il ne faisait que retarder son premier montage).
 */
export default function GalleryScene({
  covers,
  active,
  onPick,
  anchor,
}: {
  covers: readonly string[];
  active: number;
  onPick: (index: number) => void;
  anchor: RefObject<HTMLElement | null>;
}) {
  const group = useRef<Group>(null);
  const pages = useRef<(Mesh | null)[]>([]);
  const invalidate = useThree((state) => state.invalidate);

  // `useLoader` met en cache par URL : les mêmes fichiers que la liste HTML,
  // donc le navigateur les a déjà. Aucun second jeu de visuels (règle du plan).
  const textures = useLoader(TextureLoader, [...covers]);
  useEffect(() => {
    for (const texture of textures) texture.colorSpace = SRGBColorSpace;
  }, [textures]);

  // La page demandée, et la page AFFICHÉE qui la rattrape en flottant : c'est
  // l'écart fractionnaire entre les deux qui fait tourner la page.
  const wanted = useRef(active);
  const shown = useRef(active);
  useEffect(() => {
    wanted.current = active;
    invalidate();
  }, [active, invalidate]);

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
    // Les pages se placent AVANT la porte de visibilité : la toute première
    // frame les trouverait sinon empilées à l'origine.
    const turning = wanted.current - shown.current;
    shown.current =
      Math.abs(turning) < SETTLED
        ? wanted.current
        : shown.current + turning * TURN_EASE;
    pages.current.forEach((mesh, index) => {
      if (!mesh) return;
      const slot = slotAt(index - shown.current);
      mesh.position.set(slot.x, 0, slot.z);
      mesh.rotation.y = slot.rotationY;
    });

    if (!visible.current || !group.current) return;

    const delta = target.current - current.current;
    current.current += delta * EASE;
    group.current.position.z = (current.current - 0.5) * TRAVEL;

    // Tant qu'un rattrapage n'est pas terminé, redemander une frame. Une fois
    // posé, plus rien : le défilement ou le geste suivant relancera la boucle.
    if (Math.abs(delta) > SETTLED || Math.abs(turning) > SETTLED) state.invalidate();
  });

  const pick = (event: ThreeEvent<MouseEvent>, index: number) => {
    // Un glissé se termine lui aussi par un clic. Même seuil que le geste :
    // en deçà c'est un clic, au-delà c'était une page qu'on tournait.
    if (event.delta >= SWIPE_MIN) return;
    event.stopPropagation();
    onPick(index);
  };

  // Le curseur change au survol d'une page : c'est le seul indice, à l'œil,
  // qu'un écran s'ouvre au clic. L'attribut vit sur la scène HTML, le CSS fait
  // le reste.
  const hover = (on: boolean) => anchor.current?.toggleAttribute('data-hover', on);

  return (
    <group ref={group}>
      {covers.map((cover, index) => (
        <mesh
          key={cover}
          ref={(mesh) => {
            pages.current[index] = mesh;
          }}
          onClick={(event) => pick(event, index)}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
        >
          <planeGeometry args={[PLANE_W, PLANE_H]} />
          <meshBasicMaterial map={textures[index]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
