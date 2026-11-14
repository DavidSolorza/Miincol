import { describe, it, expect, vi } from 'vitest';
import { verifyAuthCredentials } from './verifyAuthCredentials';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';

describe('verifyAuthCredentials (Email Login & Strict Validation)', () => {
  const team: TeamSupervisionSummary = {
    id: 'team-embera', name: 'Misión Émbera', ethnicity: 'Émbera', region: 'Pacífico', department: 'Chocó',
    leader: 'Pr. Carlos Mosquera', leaderPhone: '+57 310 111', leaderEmail: 'carlos.mosquera@misincol.org',
    membersCount: 2, members: ['Pr. Carlos Mosquera', 'Sandra Mena'],
    membersWithAccounts: [{ fullName: 'Sandra Mena', email: 'sandra.mena@misincol.org', roleInTeam: 'Educadora' }],
    currentPhaseId: 'investigacion', currentPhaseName: '1. Inv', progressPercentage: 10, totalBudget: 15000000,
    executedBudget: 0, totalActivities: 4, completedActivities: 0, inProgressActivities: 1, pendingActivities: 3,
    themeColor: '#8B251E', accessPin: 'embera2026', healthStatus: 'Optimo', activeInitiatives: [], lastUpdate: 'Hoy',
  };
  const mockTeams = [team];

  it('debe autenticar al Coordinador de Equipos con correo institucional y clave predefinida', () => {
    vi.useFakeTimers();
    const onAdminSuccess = vi.fn();
    verifyAuthCredentials({
      activeTab: 'admin', identifier: 'director@misincol.org', password: 'director2026',
      allTeams: mockTeams, onAdminSuccess, onTeamSuccess: vi.fn(), onError: vi.fn(), onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onAdminSuccess).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('debe autenticar al líder de equipo utilizando su correo y PIN del equipo', () => {
    vi.useFakeTimers();
    const onTeamSuccess = vi.fn();
    verifyAuthCredentials({
      activeTab: 'team', identifier: 'carlos.mosquera@misincol.org', password: 'embera2026',
      allTeams: mockTeams, onAdminSuccess: vi.fn(), onTeamSuccess, onError: vi.fn(), onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onTeamSuccess).toHaveBeenCalledWith(team);
    vi.useRealTimers();
  });

  it('debe autenticar al integrante con su correo institucional', () => {
    vi.useFakeTimers();
    const onMemberSuccess = vi.fn();
    verifyAuthCredentials({
      activeTab: 'team', identifier: 'sandra.mena@misincol.org', password: 'embera2026',
      allTeams: mockTeams, onAdminSuccess: vi.fn(), onTeamSuccess: vi.fn(), onMemberSuccess, onError: vi.fn(), onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onMemberSuccess).toHaveBeenCalledWith(team, 'Sandra Mena');
    vi.useRealTimers();
  });

  it('debe rechazar formato de correo inválido', () => {
    vi.useFakeTimers();
    const onError = vi.fn();
    verifyAuthCredentials({
      activeTab: 'team', identifier: 'invalido@sin-punto', password: '123',
      allTeams: mockTeams, onAdminSuccess: vi.fn(), onTeamSuccess: vi.fn(), onError, onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onError).toHaveBeenCalledWith(expect.stringContaining('formato del correo electrónico no es válido'));
    vi.useRealTimers();
  });

  it('debe rechazar correo que no existe en la base de datos', () => {
    vi.useFakeTimers();
    const onError = vi.fn();
    verifyAuthCredentials({
      activeTab: 'team', identifier: 'desconocido@gmail.com', password: '123',
      allTeams: mockTeams, onAdminSuccess: vi.fn(), onTeamSuccess: vi.fn(), onError, onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onError).toHaveBeenCalledWith(expect.stringContaining('no se encuentra registrado en la base de datos'));
    vi.useRealTimers();
  });

  it('debe rechazar contraseña incorrecta', () => {
    vi.useFakeTimers();
    const onError = vi.fn();
    verifyAuthCredentials({
      activeTab: 'admin', identifier: 'director@misincol.org', password: 'erronea',
      allTeams: mockTeams, onAdminSuccess: vi.fn(), onTeamSuccess: vi.fn(), onError, onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onError).toHaveBeenCalledWith(expect.stringContaining('Contraseña incorrecta'));
    vi.useRealTimers();
  });

  it('debe autenticar al líder de equipo con PIN sin distinguir mayúsculas y minúsculas', () => {
    vi.useFakeTimers();
    const onTeamSuccess = vi.fn();
    verifyAuthCredentials({
      activeTab: 'team', identifier: 'carlos.mosquera@misincol.org', password: 'Embera2026',
      allTeams: mockTeams, onAdminSuccess: vi.fn(), onTeamSuccess, onError: vi.fn(), onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onTeamSuccess).toHaveBeenCalledWith(team);
    vi.useRealTimers();
  });

  it('debe permitir autenticación bivalente a un líder territorial promovido a Coordinador Nacional', () => {
    localStorage.setItem(
      'misincol_system_users_v1',
      JSON.stringify([{ email: 'carlos.mosquera@misincol.org', role: 'national_director', teamId: 'team-embera' }])
    );
    vi.useFakeTimers();
    const onAdminSuccess = vi.fn();
    verifyAuthCredentials({
      activeTab: 'admin', identifier: 'carlos.mosquera@misincol.org', password: 'director2026',
      allTeams: mockTeams, onAdminSuccess, onTeamSuccess: vi.fn(), onError: vi.fn(), onDone: vi.fn(),
    });
    vi.runAllTimers();
    expect(onAdminSuccess).toHaveBeenCalledWith(team);
    vi.useRealTimers();
  });
});
