import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { colors, MIN_FONT_REM } from '../lib/tokens';

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');
// Les commentaires nomment les règles qu'ils décrivent : les retirer évite
// qu'une explication déclenche la garde qu'elle explique.
const declarations = css.replace(/\/\*[\s\S]*?\*\//g, '');

describe('globals.css', () => {
  it('déclare chaque jeton de couleur avec la valeur du miroir TypeScript', () => {
    for (const [name, hex] of Object.entries(colors)) {
      expect(css).toContain(`--${name}: ${hex};`);
    }
  });

  // Remplace la garde « --seal exactement deux fois », retirée avec le jeton :
  // l'accent apparaît désormais à de nombreux endroits (le ×, les repères, la
  // ligne de contact, l'état courant). Compter les usages ne veut plus rien
  // dire ; ce qui compte est qu'il reste un ÉTAT — ou un GRAND texte. Le
  // dessin colore en accent les années de la chronologie (36px, graisse 600) :
  // 3.24:1 sur papier, sous le 4,5:1 du texte courant mais au-dessus du 3:1 du
  // grand texte. Une règle peut donc poser la couleur d'un texte au repos
  // seulement si elle fixe aussi une taille d'affichage (`--display-*`) ; un
  // paragraphe ou un libellé en accent reste refusé.
  it('ne pose --touch comme couleur qu’au sein d’un état ou à une taille d’affichage', () => {
    const colored = [
      ...declarations.matchAll(
        /([^{}]*)\{([^{}]*color:\s*var\(--touch(?:-hot)?\)[^{}]*)\}/g,
      ),
    ];
    for (const [, selector, body] of colored) {
      const isState =
        /:hover|:focus|:active|aria-current|aria-expanded|\[data-state/.test(selector);
      const isDisplaySize = /font-size:\s*var\(--display-/.test(body);
      expect(isState || isDisplaySize, selector.trim()).toBe(true);
    }
  });

  // Masquer le curseur système écrase des réglages d'accessibilité de l'OS et
  // aucune vérification automatique ne rattrape la perte. La Phase 10 s'appuie
  // sur cette garde.
  it('n’utilise jamais cursor: none', () => {
    expect(declarations).not.toMatch(/cursor:\s*none/);
  });

  it('conserve un état de focus visible', () => {
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:/);
  });

  it('fournit la primitive « contact » et son repli sans animation', () => {
    expect(css).toContain('@keyframes contact-in');
    expect(css).toContain('prefers-reduced-motion');
  });

  // L'ancienne garde protégeait un VIDE : le corps s'arrêtait où l'affichage
  // commençait, sans palier entre les deux. Le dessin comble ce vide (24 à
  // 46px), donc l'assertion serait fausse et elle est retirée. Ce qui reste
  // vrai, et que cette garde protège à la place : l'échelle est ordonnée. Un
  // palier dont le plafond dépasse celui du suivant est un palier mal placé
  // ou mal réglé, et deux paliers qui se croisent ne se hiérarchisent plus.
  it('ordonne l’échelle : chaque plafond finit au plus haut que le précédent', () => {
    const scale = [
      'label',
      'text-s',
      'text',
      'text-l',
      'display-2xs',
      'display-xs',
      'display-s',
      'display-m',
      'display-xl',
    ];
    const ceiling = (token: string) => {
      const rule = declarations.match(new RegExp(`--${token}:\\s*([^;]+);`))?.[1] ?? '';
      const values = [...rule.matchAll(/([\d.]+)rem/g)].map((m) => Number(m[1]));
      return Math.max(...values);
    };
    const ceilings = scale.map(ceiling);
    for (const [index, value] of ceilings.entries()) {
      expect(value, scale[index]).toBeGreaterThan(0);
      if (index > 0)
        expect(value, scale[index]).toBeGreaterThanOrEqual(ceilings[index - 1]);
    }
  });

  it('plancher typographique : aucun clamp ne descend sous 12px', () => {
    const clamps = [...css.matchAll(/clamp\(\s*([\d.]+)rem/g)].map((m) => Number(m[1]));
    expect(clamps.length).toBeGreaterThan(0);
    for (const floor of clamps) {
      expect(floor).toBeGreaterThanOrEqual(MIN_FONT_REM);
    }
  });
});
