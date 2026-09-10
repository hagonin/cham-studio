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
  // dire ; ce qui compte est qu'il reste un ÉTAT. Il ne tient que 3.24:1 sur
  // papier, donc il ne peut pas poser la couleur d'un texte au repos.
  it('ne pose --touch comme couleur qu’au sein d’un état', () => {
    const colored = [
      ...declarations.matchAll(/([^{}]*)\{[^{}]*color:\s*var\(--touch\)/g),
    ];
    for (const [, selector] of colored) {
      expect(selector).toMatch(
        /:hover|:focus|:active|aria-current|aria-expanded|\[data-state/,
      );
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

  // Les deux groupes de l'échelle et le vide entre eux : le corps s'arrête où
  // l'affichage commence, sans palier intermédiaire. Un jeton ajouté dans
  // l'intervalle referme l'écart qui fait la mise en page — la garde le dit.
  it('garde l’écart entre le corps et l’affichage', () => {
    const ceiling = (token: string) => {
      const rule = declarations.match(new RegExp(`--${token}:\\s*([^;]+);`))?.[1] ?? '';
      const values = [...rule.matchAll(/([\d.]+)rem/g)].map((m) => Number(m[1]));
      return Math.max(...values);
    };
    const floor = (token: string) => {
      const rule = declarations.match(new RegExp(`--${token}:\\s*([^;]+);`))?.[1] ?? '';
      return Number(rule.match(/([\d.]+)rem/)?.[1]);
    };
    expect(ceiling('text')).toBeLessThan(floor('display-s'));
  });

  it('plancher typographique : aucun clamp ne descend sous 12px', () => {
    const clamps = [...css.matchAll(/clamp\(\s*([\d.]+)rem/g)].map((m) => Number(m[1]));
    expect(clamps.length).toBeGreaterThan(0);
    for (const floor of clamps) {
      expect(floor).toBeGreaterThanOrEqual(MIN_FONT_REM);
    }
  });
});
