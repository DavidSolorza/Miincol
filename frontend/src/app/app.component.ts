import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';
import { AdminDashboardService } from '../features/admin/application/admin-dashboard.service';
import { AppSessionService } from './auth/app-session.service';
import { LoginViewComponent } from '../features/auth/infrastructure/login-view.component';
import { AppWorkspaceComponent } from './ui/app-workspace.component';
import type { MissionaryTeam } from '../features/auth/domain/auth.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastContainerComponent, LoginViewComponent, AppWorkspaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!sessionService.session()) {
      <app-login-view
        [allTeams]="dashboardService.allTeams()"
        (adminSuccess)="sessionService.handleAdminLogin($event)"
        (directorGeneralSuccess)="sessionService.handleDirectorGeneralLogin()"
        (teamSuccess)="sessionService.handleTeamLogin($event.team, $event.isNationalAdmin)"
        (memberSuccess)="sessionService.handleMemberLogin($event.team, $event.memberName)"
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
  readonly dashboardService = inject(AdminDashboardService);
  readonly sessionService = inject(AppSessionService);

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

  readonly activeTeamSummary = computed(() => {
    const id = this.sessionService.activeTeamId();
    const teams = this.dashboardService.allTeams();
    return teams.find((t) => t.id === id || t.slug === id) || teams[0];
  });

  readonly activeTeam = computed<MissionaryTeam>(() => {
    const id = this.sessionService.activeTeamId();
    const teams = this.mappedTeams();
    return (
      teams.find((t) => t.id === id) ||
      teams[0] || {
        id: '',
        name: 'Coordinación Nacional',
        ethnicity: 'Nacional',
        region: 'Colombia',
        leader: 'Hugo Solorza',
        members: ['Hugo Solorza'],
        themeColor: '#8B251E',
      }
    );
  });
}
