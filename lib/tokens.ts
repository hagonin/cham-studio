/**
 * Miroir des jetons de app/globals.css, pour les tests.
 * Toute divergence entre ce fichier et la feuille de style fait échouer
 * tests/tokens.test.ts : le miroir ne peut pas dériver en silence.
 *
 * Les couleurs sont AUSSI lues par du code qui ne voit pas les variables CSS
 * (le canevas de TouchPhilosophy) : elles s'importent d'ici, jamais recopiées.
 */

export const colors = {
  // Fonds
  paper: '#f0eee8',
  'paper-2': '#f6f4ef',
  ink: '#11110f',
  'ink-gallery': '#111110',
  'ink-deep': '#0d0d0c',
  // Texte sur papier, du plus sombre au plus clair
  'ink-2': '#292925',
  'grey-1': '#4e4b45',
  'grey-2': '#615d55',
  'grey-3': '#706c63',
  'grey-4': '#7e7b73',
  'grey-5': '#807b72',
  muted: '#8b8880',
  'grey-6': '#9a978e',
  // Clair sur fond sombre
  dim: '#9d9a95',
  'dim-2': '#aaa79f',
  'paper-warm': '#f3f0ea',
  nav: '#efefef',
  blush: '#e8c6b8',
  'paper-80': '#f0eee8cc',
  // Filets et aplats
  line: '#d5d7cf',
  'line-2': '#c9c6bd',
  'line-3': '#cac6bc',
  'line-4': '#d5d1c5',
  'line-5': '#b4afa3',
  'line-dark': '#383832',
  track: '#343430',
  photo: '#dcd9d0',
  // Accents
  touch: '#e55235',
  'touch-hot': '#ef4b2f',
} as const;

export type ColorToken = keyof typeof colors;

/** Rôle d'un couple : le seuil WCAG dépend de l'usage, pas de la couleur. */
export type ContrastRole = 'text' | 'ui';

export const thresholds: Record<ContrastRole, number> = {
  text: 4.5, // AA, texte de taille courante
  ui: 3, // AA, bordure ou élément d'interface porteur de sens
};

/** AA, grand texte : 24 px et plus, ou 18,66 px et plus en graisse ≥ 600. */
export const largeTextThreshold = 3;

export type ContrastPair = {
  fg: ColorToken;
  bg: ColorToken;
  role: ContrastRole;
  /** Le texte du couple est « grand » au sens WCAG, à TOUTES les largeurs. */
  large?: boolean;
  note: string;
  /**
   * Présent si et seulement si le couple échoue tel que dessiné. Dit pourquoi on
   * le garde : le seuil, lui, ne bouge jamais. tests/contrast.test.ts refuse un
   * échec sans exemption ET une exemption sur un couple qui passe.
   */
  exemption?: string;
};

export function thresholdFor(pair: ContrastPair): number {
  return pair.role === 'text' && !pair.large ? thresholds.text : largeTextThreshold;
}

/**
 * Les couples réellement utilisés par le dessin, sur chaque fond. Les filets
 * (`line*`, `track`) n'y figurent pas : ils ne portent aucune information, et
 * tests/contrast.test.ts vérifie qu'ils restent sous 3:1.
 *
 * Trois jetons changent de rôle selon le fond, et c'est tout l'intérêt du
 * tableau : `muted` est une bordure sur papier et redevient du texte sur encre ;
 * `touch` est un état sur papier et du texte lisible sur encre ; `touch-hot`
 * fait l'anneau de focus sur papier comme sur encre. Poser `muted` ou `touch`
 * comme paragraphe sur papier fait échouer ce fichier.
 *
 * Le menu mobile passe le `nav` sur encre. Hors menu, l'en-tête est en
 * `mix-blend-mode: difference` : sa couleur s'inverse avec ce qu'il survole, ce
 * qui ne se mesure pas comme un couple fixe.
 */
export const contrastPairs: ContrastPair[] = [
  // Fond papier
  { fg: 'ink', bg: 'paper', role: 'text', note: 'texte courant' },
  {
    fg: 'ink-2',
    bg: 'paper',
    role: 'text',
    note: 'texte secondaire, descriptions, légendes',
  },
  { fg: 'grey-1', bg: 'paper', role: 'text', note: 'description de projet' },
  {
    fg: 'grey-2',
    bg: 'paper',
    role: 'text',
    note: 'chapô des travaux, bouton agrandir',
  },
  { fg: 'grey-3', bg: 'paper', role: 'text', note: 'notes du formulaire' },
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
  {
    fg: 'touch',
    bg: 'paper',
    role: 'text',
    large: true,
    note: 'années de la chronologie (36 px, graisse 600)',
  },
  {
    fg: 'touch-hot',
    bg: 'paper',
    role: 'ui',
    note: 'anneau de focus, point de contact du héros',
  },
  {
    fg: 'touch-hot',
    bg: 'paper',
    role: 'text',
    large: true,
    note: 'croix du héros au survol (86 px)',
  },
  { fg: 'ink', bg: 'paper', role: 'ui', note: 'anneau de focus, filet des champs' },
  {
    fg: 'ink',
    bg: 'photo',
    role: 'text',
    note: 'texte posé sur le cadre photo de remplacement',
  },
  { fg: 'ink', bg: 'paper-2', role: 'text', note: 'boîte de visualisation agrandie' },

  // Fond papier — échecs portés tels que dessinés (décision 2 du plan)
  {
    fg: 'grey-4',
    bg: 'paper',
    role: 'text',
    note: 'chapô « à propos » (20 px, graisse 400)',
    exemption:
      'Porté tel que dessiné : le chapô est un texte courant (20 px, graisse 400) et le dessin le pose en #7e7b73.',
  },
  {
    fg: 'grey-4',
    bg: 'paper',
    role: 'text',
    note: 'paragraphe « maintenant » (24 px à 1440 px, 18 px à 390 px)',
    exemption:
      'Grand texte seulement à partir de 1437 px de large, là où le clamp atteint 24 px. Au-dessous il descend à 18 px, un texte courant.',
  },
  {
    fg: 'grey-4',
    bg: 'photo',
    role: 'text',
    note: 'étiquette du cadre photo (10 px)',
    exemption:
      'Porté tel que dessiné : l’étiquette d’un emplacement photo, remplacée avec le vrai cliché.',
  },
  {
    fg: 'grey-5',
    bg: 'paper',
    role: 'text',
    note: 'numéro et rôle de projet (11 px mono)',
    exemption:
      'Porté tel que dessiné : numéro d’ordre et rôle du projet, en #807b72 sur papier.',
  },
  {
    fg: 'muted',
    bg: 'paper',
    role: 'text',
    note: 'ligne et outillage « maintenant », pastilles (11–17 px)',
    exemption:
      'Porté tel que dessiné : #8b8880 sur papier ne tient pas le 4,5:1 à ces tailles, y compris pour le paragraphe d’outillage (17 px), qui est du texte courant.',
  },
  {
    fg: 'grey-6',
    bg: 'photo',
    role: 'ui',
    note: 'icône du cadre photo (14 px)',
    exemption:
      'Icône décorative du cadre photo de remplacement (aria-hidden dans le dessin) : elle ne porte aucun sens.',
  },

  // Fond encre
  { fg: 'paper', bg: 'ink', role: 'text', note: 'texte courant sur fond sombre' },
  { fg: 'muted', bg: 'ink', role: 'text', note: 'secondaire sur fond sombre' },
  { fg: 'touch', bg: 'ink', role: 'text', note: 'accent lisible sur fond sombre' },
  {
    fg: 'touch-hot',
    bg: 'ink',
    role: 'text',
    note: 'dernière ligne de la scène tactile',
  },
  {
    fg: 'dim',
    bg: 'ink',
    role: 'text',
    note: 'méta, énoncé et indice de la scène tactile',
  },
  {
    fg: 'paper-warm',
    bg: 'ink',
    role: 'text',
    note: 'énoncé et compteur de la scène tactile',
  },
  { fg: 'nav', bg: 'ink', role: 'text', note: 'menu mobile ouvert' },
  { fg: 'paper', bg: 'ink', role: 'ui', note: 'anneau de focus sur fond sombre' },

  // Fond galerie et fond invitation
  { fg: 'paper', bg: 'ink-gallery', role: 'text', note: 'compteur courant, flèches' },
  {
    fg: 'dim-2',
    bg: 'ink-gallery',
    role: 'text',
    note: 'méta, indice, compteur (10 px)',
  },
  {
    fg: 'touch-hot',
    bg: 'ink-gallery',
    role: 'ui',
    note: 'anneau de focus des panneaux',
  },
  { fg: 'paper', bg: 'ink-deep', role: 'text', note: 'titre et liens de l’invitation' },
  {
    fg: 'paper-80',
    bg: 'ink-deep',
    role: 'text',
    note: 'paragraphe de l’invitation (translucide)',
  },
  { fg: 'blush', bg: 'ink-deep', role: 'text', note: 'sur-titre de l’invitation' },
];

/** `#rrggbbaa` composé sur `bg` ; un `#rrggbb` opaque passe tel quel. */
function flatten(fg: string, bg: string): string {
  const f = fg.replace('#', '');
  if (f.length !== 8) return fg;
  const alpha = parseInt(f.slice(6, 8), 16) / 255;
  const b = bg.replace('#', '');
  const mixed = [0, 2, 4].map((i) => {
    const value =
      parseInt(f.slice(i, i + 2), 16) * alpha +
      parseInt(b.slice(i, i + 2), 16) * (1 - alpha);
    return Math.round(value).toString(16).padStart(2, '0');
  });
  return `#${mixed.join('')}`;
}

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
  const a = relativeLuminance(flatten(fg, bg));
  const b = relativeLuminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Plancher des tailles FLUIDES : 12px. Aucun clamp ne descend en dessous. */
export const MIN_FONT_REM = 0.75;

/**
 * Plancher des étiquettes à taille FIXE : 9px, le plus petit que le dessin
 * emploie. Un palier d'étiquette plus petit n'a pas de modèle dans le dessin.
 */
export const MIN_LABEL_REM = 0.5625;
