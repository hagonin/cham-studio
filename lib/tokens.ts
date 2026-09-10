/**
 * Miroir des jetons de app/globals.css, pour les tests.
 * Toute divergence entre ce fichier et la feuille de style fait échouer
 * tests/tokens.test.ts : le miroir ne peut pas dériver en silence.
 */

export const colors = {
  paper: '#f2f0ea',
  ink: '#111111',
  'ink-2': '#42433d',
  muted: '#8a8a84',
  line: '#cbc9c3',
  touch: '#e4502c',
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
 * Les couples réellement utilisés, sur les DEUX fonds. `--rule` (décoratif)
 * n'y figure pas : il ne porte aucune information.
 *
 * Deux couples changent de rôle selon le fond, et c'est tout l'intérêt du
 * tableau : `--mute` est une bordure sur papier (3.02:1, sous le seuil texte)
 * et redevient du texte sur encre (5.39:1) ; `--touch` est un état sur papier
 * (3.24:1) et du texte lisible sur encre (5.03:1). Poser l'un des deux comme
 * paragraphe sur papier fait échouer ce fichier.
 */
export const contrastPairs: ContrastPair[] = [
  // Fond papier
  { fg: 'ink', bg: 'paper', role: 'text', note: 'texte courant' },
  { fg: 'ink-2', bg: 'paper', role: 'text', note: 'texte secondaire, descriptions' },
  {
    fg: 'muted',
    bg: 'paper',
    role: 'ui',
    note: 'micro-libellés mono, bordure interactive',
  },
  {
    fg: 'touch',
    bg: 'paper',
    role: 'ui',
    note: 'état : survol, courant, point de contact',
  },
  { fg: 'ink', bg: 'paper', role: 'ui', note: 'anneau de focus' },

  // Fond encre
  { fg: 'paper', bg: 'ink', role: 'text', note: 'texte courant sur fond sombre' },
  { fg: 'muted', bg: 'ink', role: 'text', note: 'secondaire sur fond sombre' },
  { fg: 'touch', bg: 'ink', role: 'text', note: 'accent lisible sur fond sombre' },
  { fg: 'paper', bg: 'ink', role: 'ui', note: 'anneau de focus sur fond sombre' },
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
