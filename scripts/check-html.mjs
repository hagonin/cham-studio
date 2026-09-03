/**
 * Vérifications sur le HTML RÉELLEMENT EXPORTÉ, pas sur le source.
 *
 * Ces règles ne peuvent pas se tester en unitaire : elles portent sur ce que
 * le navigateur reçoit une fois le CSS Modules haché et les composants rendus.
 * Lancé par `pnpm check:html`, après le build, et en CI.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
const failures = [];
const fail = (message) => failures.push(message);

function walk(dir, extension) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path, extension);
    return path.endsWith(extension) ? [path] : [];
  });
}

const pages = walk(OUT, '.html');
const css = walk(join(OUT, '_next/static/css'), '.css')
  .map((path) => readFileSync(path, 'utf8'))
  .join('');

if (pages.length === 0) fail('aucune page exportée — le build a-t-il tourné ?');

// --- Ordre des titres -------------------------------------------------------
// Un niveau sauté (h2 → h4) casse la navigation par titres des lecteurs
// d'écran, et rien à l'écran ne le signale.
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  if (levels.length === 0) continue;

  const h1s = levels.filter((level) => level === 1).length;
  if (h1s !== 1) fail(`${page} : ${h1s} <h1>, il en faut exactement un`);

  let previous = levels[0];
  for (const level of levels.slice(1)) {
    if (level > previous + 1) fail(`${page} : saut de titre h${previous} → h${level}`);
    previous = level;
  }
}

// --- Majuscules ------------------------------------------------------------
// Les capitales accentuées nuisent à la lisibilité en français : les
// majuscules restent aux libellés courts, jamais au texte courant.
const uppercaseClasses = new Set();
for (const [, selector] of css.matchAll(
  /([^{}]+)\{[^{}]*text-transform:\s*uppercase[^{}]*\}/g,
)) {
  for (const [, className] of selector.matchAll(/\.([A-Za-z0-9_-]+)/g)) {
    uppercaseClasses.add(className);
  }
}
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const [, attributes] of html.matchAll(/<p\b([^>]*)>/g)) {
    const classes = /class="([^"]*)"/.exec(attributes)?.[1]?.split(/\s+/) ?? [];
    const offender = classes.find((name) => uppercaseClasses.has(name));
    if (offender) fail(`${page} : <p class="${offender}"> est en majuscules`);
  }
}

// --- Accordéon accessible ---------------------------------------------------
for (const page of pages.filter((path) => /\/(fr|en)\/index\.html$/.test(path))) {
  const html = readFileSync(page, 'utf8');
  const triggers = [...html.matchAll(/<button[^>]*aria-expanded="[^"]*"[^>]*>/g)];
  if (triggers.length === 0) fail(`${page} : aucun déclencheur <button aria-expanded>`);
  for (const [trigger] of triggers) {
    if (!trigger.includes('aria-controls')) {
      fail(`${page} : un aria-expanded sans aria-controls`);
    }
  }

  // --- Lisible sans JavaScript ---------------------------------------------
  // Le bloc approche doit être complet dans le DOM servi : aucune animation ne
  // révèle de contenu, et les robots ne défilent pas.
  if (!/id="approach-title"/.test(html)) fail(`${page} : bloc approche absent du DOM`);
  const proseLength = (html.match(/<p[^>]*>([^<]{40,})<\/p>/g) ?? []).length;
  if (proseLength === 0) fail(`${page} : aucune prose rendue côté serveur`);
}

if (failures.length > 0) {
  for (const message of failures) console.error(`::error::${message}`);
  process.exit(1);
}
console.log(`HTML vérifié : ${pages.length} pages, aucune anomalie.`);
