import { describe, expect, it } from 'vitest';
import { fitLines } from '../lib/touch/fit';

/**
 * Une police fictive à chasse fixe : chaque caractère mesure 50 à 100px. Les
 * vraies largeurs viennent du canevas ; ce qui doit tenir ici, c'est la règle —
 * la plus grande taille qui tient, et des coupures qui ne déplacent ni l'ordre
 * des mots ni leur couleur.
 */
const mono = (text: string) => text.length * 50;

describe('la phrase de la scène tactile', () => {
  it('garde les lignes entières sur un écran en largeur et prend toute la largeur', () => {
    // « AAAA BBBB » mesure 450 à 100px : 900px de large la portent à 200px.
    // Coupée, elle monterait à 293px dans cette hauteur — en largeur, on ne coupe pas.
    expect(fitLines(['AAAA BBBB', 'CC'], mono, { width: 900, height: 880 }, 1)).toEqual(
      {
        size: 200,
        rows: [
          { text: 'AAAA BBBB', line: 0 },
          { text: 'CC', line: 1 },
        ],
      },
    );
  });

  it('laisse la hauteur plafonner la taille, interligne compris', () => {
    // 2 rangées × 1,5 sur 300px : 100px, bien que la largeur en permette 200.
    expect(
      fitLines(['AAAA BBBB', 'CC'], mono, { width: 900, height: 300 }, 1.5).size,
    ).toBe(100);
  });

  it('coupe aux espaces sur un écran en hauteur, chaque rangée gardant sa ligne', () => {
    // Entière, la ligne plafonnerait à 66px sur 300px ; coupée, elle monte à 150px.
    expect(fitLines(['AAAA BBBB', 'CC'], mono, { width: 300, height: 900 }, 1)).toEqual(
      {
        size: 150,
        rows: [
          { text: 'AAAA', line: 0 },
          { text: 'BBBB', line: 0 },
          { text: 'CC', line: 1 },
        ],
      },
    );
  });

  it('ne joint jamais deux lignes, même quand elles tiendraient sur une rangée', () => {
    // À 550px, « A B » (150 à 100px) mesurerait 825px : il tiendrait dans 1000.
    const { rows } = fitLines(['A', 'B'], mono, { width: 1000, height: 1100 }, 1);
    expect(rows.map((row) => row.text)).toEqual(['A', 'B']);
  });
});
