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

  // La règle de design : la couleur marque le contact. Deux usages nommés — le
  // point du marqueur et l'état interactif. Un troisième la vide de son sens.
  it('référence --seal exactement deux fois', () => {
    expect(declarations.match(/var\(--seal\)/g) ?? []).toHaveLength(2);
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

  it('plancher typographique : aucun clamp ne descend sous 12px', () => {
    const clamps = [...css.matchAll(/clamp\(\s*([\d.]+)rem/g)].map((m) => Number(m[1]));
    expect(clamps.length).toBeGreaterThan(0);
    for (const floor of clamps) {
      expect(floor).toBeGreaterThanOrEqual(MIN_FONT_REM);
    }
  });
});
