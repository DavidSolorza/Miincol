import { describe, it, expect } from 'vitest';
import { resolveTeamUsersToProvision } from './security-users-provision.helper';
import type { SystemUser } from '../domain/security-users.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';

describe('security-users-provision.helper', () => {
  const pastosTeam: TeamSupervisionSummary = {
    id: 'team-pastos',
    name: 'Misión Pastos',
    ethnicity: 'Pastos',
    region: 'Nariño - Cumbal',
    department: 'Nariño',
    leader: 'Pr. Hugo Solorza',
    leaderEmail: 'hudisapastos@misincol.org',
    leaderPhone: '+57 312 000 0000',
    members: ['Hugo', 'Diana'],
    currentPhaseId: 'investigacion',
  };

  const wayuuTeam: TeamSupervisionSummary = {
    id: 'team-wayuu',
    name: 'Misión Wayúu',
    ethnicity: 'Wayúu',
    region: 'Alta Guajira',
    department: 'La Guajira',
    leader: 'Pr. David Morales',
    leaderEmail: 'david.morales@misincol.org',
    leaderPhone: '+57 310 000 0000',
    members: ['Pr. David Morales'],
    currentPhaseId: 'investigacion',
  };

  it('debe asignar el rol más alto (national_director) a Hugo como Coordinador de equipos y líder', () => {
    const existingUsers: SystemUser[] = [];
    const result = resolveTeamUsersToProvision(pastosTeam, existingUsers);
    const hugo = result.find((u) => u.teamId === 'team-pastos');

    expect(hugo).toBeDefined();
    expect(hugo?.role).toBe('national_director');
    expect(hugo?.teamId).toBe('team-pastos');
  });

  it('debe asignar team_leader para un nuevo líder territorial estándar', () => {
    const existingUsers: SystemUser[] = [];
    const result = resolveTeamUsersToProvision(wayuuTeam, existingUsers);
    const leader = result.find((u) => u.email === 'david.morales@misincol.org');

    expect(leader).toBeDefined();
    expect(leader?.role).toBe('team_leader');
    expect(leader?.teamId).toBe('team-wayuu');
  });
});
