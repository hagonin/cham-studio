import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * `Loader.tsx` appelait `styles.left` / `styles.right` alors que
 * `Loader.module.css` n'a jamais eu de règle `.left` / `.right` : CSS Modules
 * exporte `undefined` pour un nom absent, sans erreur de build ni de type (ce
 * dépôt n'a pas de déclarations CSS Modules typées). Ce test rejoue ce bug sur
 * tout `components/` et `app/` : chaque `styles.x` d'un composant doit
 * correspondre à une classe réellement définie dans le `.module.css` qu'il
 * importe.
 *
 * `ContactBlock.footer` et `SectionNav.current` ont la même absence mais sont
 * des crochets de style inertes (aucun effet visuel ou comportemental connu) :
 * hors du périmètre du rideau d'ouverture, donc mis en liste blanche plutôt que
 * corrigés ici.
 */
const ALLOWED_MISSING: Record<string, string[]> = {
  'components/ContactBlock.tsx': ['footer'],
  'components/ContactForm.tsx': ['footer'],
  'components/SectionNav.tsx': ['current'],
};

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.tsx') ? [full] : [];
  });
}

function cssClassNames(css: string): Set<string> {
  return new Set([...css.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]));
}

describe('usages de styles.x', () => {
  const root = process.cwd();
  const files = [...walk(join(root, 'components')), ...walk(join(root, 'app'))];

  for (const file of files) {
    const relPath = relative(root, file);
    const source = readFileSync(file, 'utf8');
    const importMatch = source.match(
      /import\s+styles\s+from\s+'(\.\/[^']+\.module\.css)'/,
    );
    if (!importMatch) continue;

    it(`${relPath} : chaque styles.x existe dans son .module.css`, () => {
      const cssPath = join(dirname(file), importMatch[1]);
      const classNames = cssClassNames(readFileSync(cssPath, 'utf8'));
      const used = new Set(
        [...source.matchAll(/styles\.([a-zA-Z_]\w*)/g)].map((m) => m[1]),
      );
      const allowed = new Set(ALLOWED_MISSING[relPath] ?? []);
      const missing = [...used].filter(
        (name) => !classNames.has(name) && !allowed.has(name),
      );
      expect(missing).toEqual([]);
    });
  }
});
