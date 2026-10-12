import {
  siFigma,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons';
import type { L10n } from './types';

/**
 * Les outils listés sous les prestations, tels que l'owner les a arrêtés
 * (2026-10-12) — rien d'autre. Les marques ne se traduisent pas (`string`) ; les
 * pratiques, si (`L10n`). Une pratique n'a pas de logo : `icon` absent.
 *
 * Les icônes sont importées une à une : `Process` est un composant serveur, donc
 * seuls ces six tracés partent dans le HTML, et aucun octet de `simple-icons`
 * n'atteint le JavaScript client. Une icône mal nommée échoue à `tsc`.
 */
export type Tool = { name: string | L10n; icon?: SimpleIcon };
export type ToolGroup = { label: L10n; tools: Tool[] };

export const toolGroups: ToolGroup[] = [
  {
    label: { fr: 'Design', en: 'Design' },
    tools: [
      { name: 'Figma', icon: siFigma },
      { name: { fr: 'Prototypage', en: 'Prototyping' } },
      { name: 'Design systems' },
    ],
  },
  {
    label: { fr: 'Code', en: 'Code' },
    tools: [
      { name: 'React', icon: siReact },
      { name: 'Next.js', icon: siNextdotjs },
      { name: 'Node.js', icon: siNodedotjs },
      { name: 'TypeScript', icon: siTypescript },
      { name: 'Tailwind CSS', icon: siTailwindcss },
    ],
  },
];
