import { Archivo, Archivo_Narrow, JetBrains_Mono } from 'next/font/google';

// Le sous-ensemble « vietnamese » n'est pas décoratif : sans lui le dấu nặng de
// « Chạm » retombe sur une police système et la marque se lit faux.
// Ces trois familles sont vérifiées comme couvrant ce sous-ensemble ;
// Sofia Sans Condensed, Spline Sans Mono et Instrument Serif ne le couvrent pas
// et ne doivent pas être substituées ici.
// next/font exige des arguments littéraux : le sous-ensemble est répété à
// dessein plutôt que factorisé dans une constante.
export const display = Archivo_Narrow({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-display',
});

export const sans = Archivo({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
});

export const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-mono',
});

export const fontVariables = [display.variable, sans.variable, mono.variable].join(' ');
