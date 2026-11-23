import { describe, it, expect } from 'vitest';
import {
  deduplicateTeams,
  mergeBackendTeams,
  sanitizeLoadedStorageTeams,
} from './admin-teams-deduplication.helper';
import { pastosTeam } from './initialTeams/pastosTeam';
import { wayuuTeam } from './initialTeams/wayuuTeam';
import type { TeamSupervisionSummary } from '../domain/admin.types';

describe('admin-teams-deduplication.helper', () => {
  it('debe mantener equipos únicos sin modificarlos', () => {
    const list = [pastosTeam, wayuuTeam];
    const result = deduplicateTeams(list);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('team-pastos');
    expect(result[1].id).toBe('team-wayuu');
  });

  it('debe eliminar duplicados priorizando la entidad canónica team-', () => {
    const duplicatePastos: TeamSupervisionSummary = {
      ...pastosTeam,
      id: 'pastos01',
      slug: 'pastos01',
      totalBudget: 0,
      ethnicity: 'Pastos',
    };

    const list = [duplicatePastos, pastosTeam];
    const result = deduplicateTeams(list);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('team-pastos');
  });

  it('debe fusionar datos del backend respetando entidades en outbox', () => {
    const backendTeams: TeamSupervisionSummary[] = [
      { ...pastosTeam, name: 'Misión Pastos Remota' },
      wayuuTeam,
    ];
    const currentList: TeamSupervisionSummary[] = [
      { ...pastosTeam, name: 'Misión Pastos Local Pendiente' },
      wayuuTeam,
    ];
    const pending = new Set<string>(['team-pastos']);

    const result = mergeBackendTeams(backendTeams, currentList, pending);
    expect(result.length).toBe(2);
    const pastos = result.find((t) => t.id === 'team-pastos');
    expect(pastos?.name).toBe('Misión Pastos Local Pendiente');
  });

  it('debe sanitizar almacenamiento local y eliminar pruebas huérfanas', () => {
    const storedWithDuplicates: TeamSupervisionSummary[] = [
      pastosTeam,
      { ...pastosTeam, id: 'pastos-test-clone', slug: 'pastos01' },
      wayuuTeam,
    ];

    const result = sanitizeLoadedStorageTeams(storedWithDuplicates, [pastosTeam, wayuuTeam]);
    expect(result.length).toBe(2);
    expect(result.map((t) => t.id)).toEqual(['team-pastos', 'team-wayuu']);
  });
});
