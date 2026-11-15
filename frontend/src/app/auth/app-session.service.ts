import { Injectable, signal, inject } from '@angular/core';
import type { TeamSupervisionSummary } from '../../features/admin/domain/admin.types';
import { type AuthSession, STORAGE_KEY_AUTH } from './appSession.types';
import { ToastService } from '../../shared/components/toast/toast.service';
import { serviceBus } from '../../core/bus';
import { appendAuditLog } from '../../features/audit/application/auditStorage';

@Injectable({ providedIn: 'root' })
export class AppSessionService {
  private readonly toastService = inject(ToastService);

  readonly session = signal<AuthSession | null>(this.loadInitialSession());
  readonly activeTeamId = signal<string>(this.session()?.teamId || 'team-wayuu');
  readonly isAdminPreview = signal<boolean>(false);
  readonly activeView = signal<'plans' | 'general' | 'superadmin' | 'security' | 'audit'>(
    this.session()?.role === 'admin' ? 'superadmin' : 'general'
  );

  constructor() {
    serviceBus.subscribe('team:select', ({ teamId }) => this.activeTeamId.set(teamId));
    serviceBus.subscribe('ui:view_change', ({ view }) => {
      if (view === 'dashboard' || view === 'supervision') {
        this.isAdminPreview.set(false);
        this.activeView.set('superadmin');
      } else if (view === 'security') {
        this.isAdminPreview.set(false);
        this.activeView.set('security');
      } else if (view === 'audit') {
        this.isAdminPreview.set(false);
        this.activeView.set('audit');
      } else {
        this.activeView.set('plans');
      }
    });
  }

  private loadInitialSession(): AuthSession | null {
    try {
      const s = localStorage.getItem(STORAGE_KEY_AUTH);
      if (!s) return null;
      return JSON.parse(s);
    } catch {
      return null;
    }
  }

  handleAdminLogin(teamContext?: TeamSupervisionSummary): void {
    const newSession: AuthSession = {
      role: 'admin',
      teamId: teamContext?.id,
      userName: teamContext ? `${teamContext.leader} (Coordinador y Líder)` : 'Coordinador de Equipos',
    };
    this.session.set(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch { /* ignore */ }
    if (teamContext?.id) this.activeTeamId.set(teamContext.id);
    this.activeView.set('superadmin');
    this.isAdminPreview.set(false);
    this.toastService.toast.success(
      teamContext ? `Bienvenido ${teamContext.leader} (Acceso Nacional)` : 'Sesión iniciada como Coordinador de Equipos',
      'Bienvenido'
    );
  }

  handleDirectorGeneralLogin(name = 'Director General'): void {
    const newSession: AuthSession = { role: 'director_general', userName: name };
    this.session.set(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch { /* ignore */ }
    this.activeView.set('general');
    this.isAdminPreview.set(false);
    this.toastService.toast.success(`Bienvenido ${name} (Director General)`, 'Sesión Iniciada');
  }

  handleTeamLogin(team?: TeamSupervisionSummary, isNationalAdmin = false): void {
    if (!team) return;
    const role = isNationalAdmin ? 'admin' : 'team';
    const newSession: AuthSession = {
      role,
      teamId: team.id,
      userName: isNationalAdmin ? `${team.leader} (Coordinador y Líder)` : team.leader,
    };
    this.session.set(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch { /* ignore */ }
    const logPayload = {
      teamId: team.id,
      userName: team.leader,
      actionType: 'login' as const,
      title: 'Ingreso al portal',
      detail: `Inicio de sesión territorial de ${team.leader}${isNationalAdmin ? ' (Rol Nacional)' : ''}`,
    };
    appendAuditLog(team.id, logPayload, team.leader);
    serviceBus.publish('audit:log', logPayload);
    this.activeTeamId.set(team.id);
    this.activeView.set('general');
    this.isAdminPreview.set(false);
    this.toastService.toast.success(
      isNationalAdmin ? `Bienvenido ${team.leader} (Misión ${team.name} • Rol Nacional)` : `Bienvenido equipo ${team.name}`,
      'Sesión Iniciada'
    );
  }

  handleMemberLogin(team?: TeamSupervisionSummary, memberName = 'Usuario'): void {
    if (!team) return;
    const newSession: AuthSession = { role: 'member', teamId: team.id, userName: memberName };
    this.session.set(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch { /* ignore */ }
    this.activeTeamId.set(team.id);
    this.activeView.set('general');
    this.isAdminPreview.set(false);
    this.toastService.toast.success(`Bienvenido(a) ${memberName} (Usuario de Equipo)`, 'Sesión Iniciada');
  }

  handleLogout(): void {
    this.session.set(null);
    this.isAdminPreview.set(false);
    try { localStorage.removeItem(STORAGE_KEY_AUTH); } catch { /* ignore */ }
    this.toastService.toast.info('Has cerrado la sesión correctamente', 'Sesión Finalizada');
  }

  handleInspectTeamFromAdmin(teamId: string, allTeams: TeamSupervisionSummary[]): void {
    this.activeTeamId.set(teamId);
    this.isAdminPreview.set(true);
    this.activeView.set('general');
    const targetTeam = allTeams.find((t) => t.id === teamId || t.slug === teamId);
    this.toastService.toast.info(`Supervisando misión: ${targetTeam?.name || 'Equipo'}`, 'Modo Supervisión');
  }

  handleBackToAdmin(): void {
    this.isAdminPreview.set(false);
    this.activeView.set('superadmin');
    this.toastService.toast.info('Regresando al Tablero de Supervisión Nacional', 'Supervisión');
  }
}
