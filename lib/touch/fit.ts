/**
 * La phrase de la scène tactile, mise à la taille de l'écran (décision du
 * 2026-10-15 : le texte couvre la scène, avec plus d'air entre les lignes).
 *
 * Renvoie la plus grande taille de police, en px entiers, à laquelle les lignes
 * tiennent dans `box`, et les rangées à dessiner. Chaque ligne source reste un
 * retour forcé : elle porte sa couleur et la chute « ON LE TOUCHE. ».
 *
 * Sur un écran en largeur, les cinq lignes du dessin restent entières. Sur un
 * écran en hauteur (téléphone, tablette debout), une ligne trop longue se coupe
 * à ses espaces : sans cela, la ligne la plus longue fixait la taille à ~28px
 * sur 390px de large, et la phrase n'occupait qu'un cinquième de la hauteur.
 *
 * `widthAt100` mesure un texte à 100px selon la règle de la mise en page : tout
 * y est proportionnel à la taille, une seule mesure sert donc à toutes.
 *
 * Pure, et dans un `.ts` : Vitest ne parse pas le `.tsx` (même raison que
 * `lib/gallery/carousel.ts`).
 */
export type Row = { text: string; line: number };

export function fitLines(
  lines: readonly string[],
  widthAt100: (text: string) => number,
  box: { width: number; height: number },
  leading: number,
): { size: number; rows: Row[] } {
  const canWrap = box.width < box.height;
  const wrap = (limit: number): Row[] =>
    lines.flatMap((line, index) => {
      const rows: string[] = [];
      for (const word of line.split(' ')) {
        const last = rows.length - 1;
        if (last >= 0 && widthAt100(`${rows[last]} ${word}`) <= limit)
          rows[last] += ` ${word}`;
        else rows.push(word);
      }
      return rows.map((text) => ({ text, line: index }));
    });

  // Le plafond : cinq rangées au moins, donc jamais plus grand que cette taille.
  // On descend d'un pixel à la fois ; le premier qui tient est le plus grand.
  const ceiling = Math.floor(box.height / (Math.max(1, lines.length) * leading));
  for (let size = ceiling; size > 1; size -= 1) {
    const rows = wrap(canWrap ? (box.width * 100) / size : Infinity);
    const widest = Math.max(...rows.map((row) => widthAt100(row.text)));
    if (
      rows.length * size * leading <= box.height &&
      (widest * size) / 100 <= box.width
    )
      return { size, rows };
  }
  return { size: 1, rows: wrap(Infinity) };
}
