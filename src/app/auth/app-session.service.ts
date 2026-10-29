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
  readonly activeView = signal<'plans' | 'superadmin'>(
    this.session()?.role === 'admin' ? 'superadmin' : 'plans'
  );

  constructor() {
    serviceBus.subscribe('team:select', ({ teamId }) => this.activeTeamId.set(teamId));
    serviceBus.subscribe('ui:view_change', ({ view }) => {
      if (view === 'dashboard' || view === 'supervision') {
        this.isAdminPreview.set(false);
        this.activeView.set('superadmin');
      } else {
        this.activeView.set('plans');
      }
    });
  }

  private loadInitialSession(): AuthSession | null {
    try {
      const s = localStorage.getItem(STORAGE_KEY_AUTH);
      if (!s) return null;
      const parsed: AuthSession = JSON.parse(s);
      if (parsed.role === 'admin') {
        parsed.userName = 'Coordinador de Equipos';
      }
      return parsed;
    } catch {
      return null;
    }
  }

  handleAdminLogin(): void {
    const newSession: AuthSession = { role: 'admin', userName: 'Coordinador de Equipos' };
    this.session.set(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch { /* ignore */ }
    this.activeView.set('superadmin');
    this.isAdminPreview.set(false);
    this.toastService.toast.success('Sesión iniciada como Coordinador de Equipos', 'Bienvenido');
  }

  handleTeamLogin(team: TeamSupervisionSummary): void {
    const newSession: AuthSession = { role: 'team', teamId: team.id, userName: team.leader };
    this.session.set(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch { /* ignore */ }
    const logPayload = {
      teamId: team.id,
      userName: team.leader,
      actionType: 'login' as const,
      title: 'Ingreso al portal',
      detail: `Inicio de sesión territorial de ${team.leader}`,
    };
    appendAuditLog(team.id, logPayload, team.leader);
    serviceBus.publish('audit:log', logPayload);
    this.activeTeamId.set(team.id);
    this.activeView.set('plans');
    this.isAdminPreview.set(false);
    this.toastService.toast.success(`Bienvenido equipo ${team.name}`, 'Sesión Iniciada');
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
    this.activeView.set('plans');
    const targetTeam = allTeams.find((t) => t.id === teamId || t.slug === teamId);
    this.toastService.toast.info(`Supervisando misión: ${targetTeam?.name || 'Equipo'}`, 'Modo Supervisión');
  }

  handleBackToAdmin(): void {
    this.isAdminPreview.set(false);
    this.activeView.set('superadmin');
    this.toastService.toast.info('Regresando al Tablero de Supervisión Nacional', 'Supervisión');
  }
}
