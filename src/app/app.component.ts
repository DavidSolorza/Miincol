import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';
import { AdminDashboardService } from '../features/admin/application/admin-dashboard.service';
import { AppSessionService } from './auth/app-session.service';
import { LoginViewComponent } from '../features/auth/infrastructure/login-view.component';
import { AppWorkspaceComponent } from './ui/app-workspace.component';
import type { MissionaryTeam } from '../features/auth/domain/auth.types';

// Componente raíz (<app-root>): alterna entre la pantalla de Login y el área de trabajo principal
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastContainerComponent, LoginViewComponent, AppWorkspaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!sessionService.session()) {
      <app-login-view
        [allTeams]="dashboardService.allTeams()"
        (adminSuccess)="sessionService.handleAdminLogin()"
        (teamSuccess)="sessionService.handleTeamLogin($event)"
      />
    } @else {
      <app-workspace
        [activeTeam]="activeTeam()"
        [activeTeamSummary]="activeTeamSummary()"
        [mappedTeams]="mappedTeams()"
      />
    }
    <app-toast-container />
  `,
})
export class AppComponent {
  // Servicios globales de supervisión y sesión activa
  readonly dashboardService = inject(AdminDashboardService);
  readonly sessionService = inject(AppSessionService);

  // Transforma el resumen de supervisión en el listado de equipos misioneros para selectores y vistas
  readonly mappedTeams = computed<MissionaryTeam[]>(() =>
    this.dashboardService.allTeams().map((t) => ({
      id: t.id,
      name: t.name,
      ethnicity: t.ethnicity,
      region: t.region,
      leader: t.leader,
      members: t.members && t.members.length > 0 ? t.members : [t.leader],
      themeColor: t.themeColor,
      leaderPhone: t.leaderPhone,
    }))
  );

  // Obtiene el resumen de supervisión del equipo actualmente seleccionado
  readonly activeTeamSummary = computed(() => {
    const id = this.sessionService.activeTeamId();
    const teams = this.dashboardService.allTeams();
    return teams.find((t) => t.id === id || t.slug === id) || teams[0];
  });

  // Resuelve la entidad completa del equipo activo con respaldo por defecto (Wayuu)
  readonly activeTeam = computed<MissionaryTeam>(() => {
    const id = this.sessionService.activeTeamId();
    const teams = this.mappedTeams();
    return (
      teams.find((t) => t.id === id) ||
      teams[0] || {
        id: 'team-wayuu',
        name: 'Misión Wayuu - Alta Guajira',
        ethnicity: 'Wayuu',
        region: 'La Guajira',
        leader: 'Pr. David Morales',
        members: ['David Morales'],
        themeColor: '#8B251E',
      }
    );
  });
}
