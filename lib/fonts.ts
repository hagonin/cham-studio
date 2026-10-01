import {
  Archivo_Narrow,
  JetBrains_Mono,
  Schibsted_Grotesk,
  Spline_Sans_Mono,
} from 'next/font/google';

// Le sous-ensemble « vietnamese » n'est pas décoratif : sans lui le dấu nặng de
// « Chạm » retombe sur une police système et la marque se lit faux.
//
// Schibsted Grotesk (texte et titres) et Spline Sans Mono (étiquettes, liens de
// la barre) sont les polices du dessin, mais n'ont AUCUN sous-ensemble
// vietnamien : le « ạ » n'y existe pas. Aucune ne doit donc être la seule
// police d'un mot qui contient « Chạm ». Archivo Narrow (le wordmark) et
// JetBrains Mono le couvrent ; c'est ce que vérifie le garde-fou de CI (plage
// u+1ea0-1ef9 dans le CSS construit). JetBrains Mono est AUSSI une police du
// dessin — la méta de la scène tactile — et sert de repli au « ạ » des
// étiquettes en Spline Sans Mono. Sofia Sans Condensed, Instrument Serif et
// Archivo (chasse normale) ne sont pas chargées et ne doivent pas revenir
// porter la marque.
//
// next/font exige des arguments littéraux : le sous-ensemble est répété à
// dessein plutôt que factorisé dans une constante.
export const display = Archivo_Narrow({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-display',
});

// `adjustFontFallback: false` : par défaut next/font ajoute, derrière la
// police, une police locale (Arial) sans `unicode-range`. Elle intercepterait
// le « ạ » avant que la pile `--font-sans-stack` n'atteigne Archivo Narrow, et
// le glyphe viendrait d'une police système qui dépend de l'appareil. Sans elle,
// le « ạ » retombe sur Archivo Narrow, chargée et identique partout. Contrepartie
// assumée : pendant le `swap`, la mesure de repli n'est plus ajustée. Même
// raison pour `mono` ci-dessous.
export const sans = Schibsted_Grotesk({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans',
  adjustFontFallback: false,
});

export const mono = Spline_Sans_Mono({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-mono',
  adjustFontFallback: false,
});

export const monoAlt = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-mono-alt',
});

export const fontVariables = [
  display.variable,
  sans.variable,
  mono.variable,
  monoAlt.variable,
].join(' ');
