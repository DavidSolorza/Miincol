import { describe, it, expect, beforeEach } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { AppSessionService } from './app-session.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import type { TeamSupervisionSummary } from '../../features/admin/domain/admin.types';

describe('AppSessionService (Default View Tests)', () => {
  let service: AppSessionService;

  const mockTeam: TeamSupervisionSummary = {
    id: 'team-wayuu',
    name: 'Misión Wayuu - Alta Guajira',
    ethnicity: 'Wayuu',
    region: 'La Guajira',
    department: 'La Guajira',
    leader: 'Pr. David Morales',
    leaderPhone: '+57 300 000 0000',
    membersCount: 1,
    members: ['David Morales'],
    currentPhaseId: 'investigacion',
    currentPhaseName: '1. Investigación',
    progressPercentage: 50,
    totalBudget: 10000000,
    executedBudget: 5000000,
    totalActivities: 4,
    completedActivities: 2,
    inProgressActivities: 1,
    pendingActivities: 1,
    themeColor: '#8B251E',
    activeInitiatives: [],
    healthStatus: 'Optimo',
    lastUpdate: 'Ayer',
  };

  beforeEach(() => {
    localStorage.clear();
    const injector = createEnvironmentInjector([ToastService], null as unknown as import('@angular/core').EnvironmentInjector);
    service = runInInjectionContext(injector, () => new AppSessionService());
  });

  it('debe iniciar la vista activa en "general" por defecto para sesiones no-admin', () => {
    expect(service.activeView()).toBe('general');
  });

  it('debe conmutar la vista activa a "general" cuando un equipo inicia sesión', () => {
    service.handleTeamLogin(mockTeam);
    expect(service.activeView()).toBe('general');
    expect(service.activeTeamId()).toBe('team-wayuu');
    expect(service.session()?.role).toBe('team');
  });

  it('debe conmutar la vista activa a "general" cuando un integrante inicia sesión', () => {
    service.handleMemberLogin(mockTeam, 'David Morales');
    expect(service.activeView()).toBe('general');
    expect(service.activeTeamId()).toBe('team-wayuu');
    expect(service.session()?.role).toBe('member');
  });

  it('debe conmutar la vista activa a "general" cuando el director general inicia sesión', () => {
    service.handleDirectorGeneralLogin('Pastor Director');
    expect(service.activeView()).toBe('general');
    expect(service.session()?.role).toBe('director_general');
  });

  it('debe conmutar la vista activa a "general" cuando el administrador inspecciona un equipo', () => {
    service.handleAdminLogin();
    expect(service.activeView()).toBe('superadmin');

    service.handleInspectTeamFromAdmin('team-wayuu', [mockTeam]);
    expect(service.activeView()).toBe('general');
    expect(service.isAdminPreview()).toBe(true);
    expect(service.activeTeamId()).toBe('team-wayuu');
  });

  it('debe volver al tablero nacional "superadmin" al salir del modo inspección', () => {
    service.handleAdminLogin();
    service.handleInspectTeamFromAdmin('team-wayuu', [mockTeam]);
    expect(service.activeView()).toBe('general');

    service.handleBackToAdmin();
    expect(service.activeView()).toBe('superadmin');
    expect(service.isAdminPreview()).toBe(false);
  });
});
