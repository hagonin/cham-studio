import { describe, expect, it } from 'vitest';
import { locales } from '../lib/i18n/config';
import { SERVICE_KEYS, type L10n, type Project } from '../content/types';
import { services } from '../content/services';
import {
  projects,
  projectsNewestFirst,
  placeholderSlugs,
  workSectionIsReady,
  MIN_PROJECTS_TO_PUBLISH,
} from '../content/projects';
import { site, legalIdentityIsComplete } from '../content/site';

/** Une chaîne vide passe le typage mais pas la relecture : on vérifie les deux. */
function everyLocaleFilled(value: L10n): boolean {
  return locales.every((locale) => value[locale].trim().length > 0);
}

describe('services', () => {
  it('couvre exactement les quatre clés de l’offre', () => {
    expect(services.map((service) => service.key)).toEqual([...SERVICE_KEYS]);
  });

  it('remplit les deux locales de chaque champ de prose', () => {
    for (const service of services) {
      expect(everyLocaleFilled(service.title), service.key).toBe(true);
      expect(everyLocaleFilled(service.summary), service.key).toBe(true);
      for (const deliverable of service.deliverables) {
        expect(everyLocaleFilled(deliverable), service.key).toBe(true);
      }
    }
  });

  it('n’affiche aucun plancher tarifaire inventé', () => {
    // Les quatre chiffres ne sont pas arrêtés. `null` est l'état honnête ;
    // la Phase 6 les renseigne et ajoute la garde PRICES_CONFIRMED.
    for (const service of services) {
      expect(service.from === null || service.from > 0).toBe(true);
    }
  });
});

describe('projects', () => {
  it('ne publie la section qu’à partir de deux projets réels (F4)', () => {
    expect(workSectionIsReady()).toBe(projects.length >= MIN_PROJECTS_TO_PUBLISH);
  });

  it('exige une image possédée et les deux locales pour chaque projet', () => {
    for (const project of projects) {
      expect(project.cover.src.startsWith('/'), project.slug).toBe(true);
      expect(everyLocaleFilled(project.title), project.slug).toBe(true);
      expect(everyLocaleFilled(project.role), project.slug).toBe(true);
      expect(everyLocaleFilled(project.summary), project.slug).toBe(true);
      expect(everyLocaleFilled(project.cover.alt), project.slug).toBe(true);
    }
  });

  // Sans dimensions, le navigateur ne réserve pas la place et la page saute au
  // chargement de l'image. CLS ~0 est un objectif P1.
  it('donne à chaque visuel ses dimensions', () => {
    for (const project of projects) {
      expect(project.cover.width, project.slug).toBeGreaterThan(0);
      expect(project.cover.height, project.slug).toBeGreaterThan(0);
    }
  });

  // La maquette portait des slugs `exemple-*`. La garde est là parce que la
  // panne s'est déjà produite, pas par principe.
  it('ne laisse passer aucun slug de réserve', () => {
    expect(placeholderSlugs()).toEqual([]);
  });

  it('n’attribue pas deux fois le même slug', () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

/**
 * `projects` est vide par choix, donc les gardes ci-dessus passent à vide.
 * Les vérifier sur des données montées pour l'occasion prouve la LOGIQUE
 * maintenant, au lieu de la découvrir le jour où les vrais projets arrivent.
 */
describe('gardes de la liste de projets, sur données', () => {
  const stub = (slug: string, year: number): Project => ({
    slug,
    year,
    cover: { src: `/${slug}.jpg`, width: 1200, height: 800, alt: { fr: 'a', en: 'a' } },
    title: { fr: 'a', en: 'a' },
    role: { fr: 'a', en: 'a' },
    summary: { fr: 'a', en: 'a' },
    stack: ['React'],
  });

  it('ordonne du plus récent au plus ancien', () => {
    const list = [stub('un', 2024), stub('deux', 2026), stub('trois', 2025)];
    expect(projectsNewestFirst(list).map((p) => p.year)).toEqual([2026, 2025, 2024]);
  });

  it('ne trie pas la liste reçue sur place', () => {
    const list = [stub('un', 2024), stub('deux', 2026)];
    projectsNewestFirst(list);
    expect(list.map((p) => p.slug)).toEqual(['un', 'deux']);
  });

  it('repère un slug de réserve, quelle que soit la casse', () => {
    const list = [stub('vrai-projet', 2026), stub('Exemple-Deux', 2025)];
    expect(placeholderSlugs(list)).toEqual(['Exemple-Deux']);
  });
});

describe('identité du site', () => {
  it('ne publie que l’adresse de contact du studio', () => {
    expect(site.email).toBe('contact@cham-studio.fr');
    expect(JSON.stringify(site)).not.toMatch(/outlook\.fr|\+33/);
  });

  it('laisse l’identité légale incomplète tant que les valeurs manquent', () => {
    // Le test décrit l'état réel : il bascule tout seul le jour où la Phase 7
    // renseigne adresse, SIRET et statut.
    expect(legalIdentityIsComplete()).toBe(
      Boolean(site.legal.postalAddress && site.legal.siret && site.legal.statut),
    );
    expect(site.legal.siret).not.toBe('000 000 000 00000');
  });
});
