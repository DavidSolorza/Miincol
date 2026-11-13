import { describe, it, expect, beforeEach } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { SecurityUsersService } from './security-users.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import type { TeamSupervisionSummary, CreateTeamDto } from '../../admin/domain/admin.types';

describe('SecurityUsersService (Member Accounts Provisioning Tests)', () => {
  let service: SecurityUsersService;

  beforeEach(() => {
    localStorage.clear();
    const injector = createEnvironmentInjector([ToastService], null as unknown as import('@angular/core').EnvironmentInjector);
    service = runInInjectionContext(injector, () => new SecurityUsersService());
  });

  const baseTeam: TeamSupervisionSummary = {
    id: 'team-curripaco',
    name: 'Misión Curripaco',
    ethnicity: 'Curripaco',
    region: 'Amazonía',
    department: 'Guainía',
    leader: 'Pastor Samuel Gómez',
    leaderPhone: '+57 311 000 0000',
    membersCount: 2,
    members: ['Pastor Samuel Gómez', 'Lucía Bernal'],
    currentPhaseId: 'investigacion',
    currentPhaseName: '1. Investigación',
    progressPercentage: 0,
    totalBudget: 12000000,
    executedBudget: 0,
    totalActivities: 4,
    completedActivities: 0,
    inProgressActivities: 1,
    pendingActivities: 3,
    themeColor: '#8B251E',
    activeInitiatives: [],
    healthStatus: 'Optimo',
    lastUpdate: 'Justo ahora',
  };

  it('debe registrar el líder y los integrantes con sus correos exactos cuando se envían en el DTO', () => {
    const dto: CreateTeamDto = {
      name: 'Misión Curripaco',
      ethnicity: 'Curripaco',
      region: 'Amazonía',
      department: 'Guainía',
      leader: 'Pastor Samuel Gómez',
      leaderPhone: '+57 311 000 0000',
      leaderEmail: 'samuel.gomez@misincol.org',
      currentPhaseId: 'investigacion',
      totalBudget: 12000000,
      themeColor: '#8B251E',
      healthStatus: 'Optimo',
      membersWithAccounts: [
        { fullName: 'Lucía Bernal', email: 'lucia.bernal@misincol.org', roleInTeam: 'Promotora de Salud' },
      ],
    };

    service.ensureTeamLeaderAndMembers(baseTeam, dto);

    const users = service.users();
    const leaderUser = users.find((u) => u.email === 'samuel.gomez@misincol.org');
    expect(leaderUser).toBeDefined();
    expect(leaderUser?.fullName).toBe('Pastor Samuel Gómez');
    expect(leaderUser?.role).toBe('team_leader');
    expect(leaderUser?.teamId).toBe('team-curripaco');

    const memberUser = users.find((u) => u.email === 'lucia.bernal@misincol.org');
    expect(memberUser).toBeDefined();
    expect(memberUser?.fullName).toBe('Lucía Bernal');
    expect(memberUser?.role).toBe('team_member');
    expect(memberUser?.teamId).toBe('team-curripaco');
  });

  it('debe actualizar el correo y nombre del líder existente sin duplicarlo', () => {
    service.ensureTeamLeaderAndMembers(baseTeam, { leaderEmail: 'antiguo.lider@misincol.org' } as any);

    const updatedTeam = { ...baseTeam, leader: 'Nuevo Pastor Curripaco', leaderEmail: 'nuevo.lider@misincol.org' };
    service.ensureTeamLeaderAndMembers(updatedTeam);

    const leader = service.users().find((u) => u.teamId === 'team-curripaco' && u.role === 'team_leader');
    expect(leader).toBeDefined();
    expect(leader?.email).toBe('nuevo.lider@misincol.org');
    expect(leader?.fullName).toBe('Nuevo Pastor Curripaco');
  });
});
