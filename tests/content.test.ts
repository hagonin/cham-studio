import { describe, expect, it } from 'vitest';
import { locales } from '../lib/i18n/config';
import { SERVICE_KEYS, type L10n } from '../content/types';
import { services } from '../content/services';
import {
  projects,
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
      expect(project.cover.startsWith('/'), project.slug).toBe(true);
      expect(everyLocaleFilled(project.title), project.slug).toBe(true);
      expect(everyLocaleFilled(project.summary), project.slug).toBe(true);
    }
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
