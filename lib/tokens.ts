/**
 * Miroir des jetons de app/globals.css, pour les tests.
 * Toute divergence entre ce fichier et la feuille de style fait échouer
 * tests/tokens.test.ts : le miroir ne peut pas dériver en silence.
 */

export const colors = {
  paper: '#f5f3f0',
  panel: '#eae7e2',
  'panel-2': '#dfdbd4',
  ink: '#121110',
  'ink-2': '#4a4642',
  mute: '#666059',
  rule: '#d2cdc5',
  'rule-s': '#8c857c',
  seal: '#d93a2b',
} as const;

export type ColorToken = keyof typeof colors;

/** Rôle d'un couple : le seuil WCAG dépend de l'usage, pas de la couleur. */
export type ContrastRole = 'text' | 'ui';

export const thresholds: Record<ContrastRole, number> = {
  text: 4.5, // AA, texte de taille courante
  ui: 3, // AA, bordure ou élément d'interface porteur de sens
};

export type ContrastPair = {
  fg: ColorToken;
  bg: ColorToken;
  role: ContrastRole;
  note: string;
};

/**
 * Les couples réellement utilisés. `--rule` (décoratif) et `--seal` (marque,
 * jamais du texte) n'y figurent pas : ils ne portent aucune information.
 * `--rule-s` n'est listé que sur `--paper` — il tombe à 2.96:1 sur `--panel`,
 * donc les bordures interactives restent sur le fond papier.
 */
export const contrastPairs: ContrastPair[] = [
  { fg: 'ink', bg: 'paper', role: 'text', note: 'texte courant' },
  { fg: 'ink-2', bg: 'paper', role: 'text', note: 'texte secondaire' },
  { fg: 'mute', bg: 'paper', role: 'text', note: 'légendes, méta' },
  { fg: 'ink', bg: 'panel', role: 'text', note: 'texte sur carte' },
  { fg: 'ink-2', bg: 'panel', role: 'text', note: 'texte secondaire sur carte' },
  { fg: 'mute', bg: 'panel', role: 'text', note: 'méta sur carte' },
  { fg: 'ink', bg: 'panel-2', role: 'text', note: 'texte sur panneau appuyé' },
  { fg: 'ink-2', bg: 'panel-2', role: 'text', note: 'secondaire sur panneau appuyé' },
  { fg: 'mute', bg: 'panel-2', role: 'text', note: 'méta sur panneau appuyé' },
  { fg: 'rule-s', bg: 'paper', role: 'ui', note: 'bordure interactive' },
  { fg: 'ink', bg: 'paper', role: 'ui', note: 'anneau de focus' },
];

/** Canal linéarisé, sRGB → luminance (WCAG 2.x). */
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = channel(parseInt(h.slice(0, 2), 16));
  const g = channel(parseInt(h.slice(2, 4), 16));
  const b = channel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: string, bg: string): number {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Plancher typographique : 12px. Aucun clamp ne descend en dessous. */
export const MIN_FONT_REM = 0.75;
