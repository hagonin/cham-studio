/**
 * Remplit un gabarit de phrase (`{title}`, `{n}`…) : la phrase s'écrit en entier
 * dans chaque langue, sans collage de morceaux. Un seul passage sur le GABARIT :
 * une valeur qui contient elle-même `{x}` n'est jamais réinterprétée, ce qui
 * compte pour le texte qu'une personne a tapé dans un formulaire.
 */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}
