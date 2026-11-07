import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { SecurityMatrixService } from '../application/security-matrix.service';
import { SecurityUsersService } from '../application/security-users.service';
import { AdminDashboardService } from '../../admin/application/admin-dashboard.service';
import { SecurityRolesHeaderComponent } from './components/security-roles-header.component';
import { SecurityMatrixTableComponent } from './components/security-matrix-table.component';
import { SecurityUsersTableComponent } from './components/security-users-table.component';
import type { CreateSystemUserDto } from '../domain/security-users.types';

@Component({
  selector: 'app-security-roles-view',
  standalone: true,
  imports: [SecurityRolesHeaderComponent, SecurityMatrixTableComponent, SecurityUsersTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-4 max-w-full overflow-x-hidden animate-fadeIn select-none">
      <app-security-roles-header
        [activeTab]="activeTab()"
        (tabChanged)="activeTab.set($event)"
        (resetDefaults)="securitySvc.resetToDefaults()"
      />

      @if (activeTab() === 'matrix') {
        <app-security-matrix-table
          [matrix]="securitySvc.matrix()"
          (toggle)="securitySvc.togglePermission($event.role, $event.perm)"
        />
      } @else {
        <app-security-users-table
          [users]="usersSvc.users()"
          [teams]="dashboardSvc.allTeams()"
          (roleChanged)="usersSvc.updateUserRole($event.userId, $event.newRole)"
          (userSaved)="handleUserSaved($event)"
          (userDeleted)="handleUserDeleted($event)"
        />
      }
    </div>
  `,
})
export class SecurityRolesViewComponent {
  readonly securitySvc = inject(SecurityMatrixService);
  readonly usersSvc = inject(SecurityUsersService);
  readonly dashboardSvc = inject(AdminDashboardService);
  readonly activeTab = signal<'matrix' | 'users'>('matrix');

  handleUserSaved(payload: { id?: string; data: CreateSystemUserDto }): void {
    if (payload.id) {
      this.usersSvc.updateUser(payload.id, payload.data);
      return;
    }
    const user = this.usersSvc.createUser(payload.data);
    if (payload.data.teamId && (payload.data.role === 'team_member' || payload.data.role === 'team_leader')) {
      const team = this.dashboardSvc.allTeams().find((t) => t.id === payload.data.teamId);
      if (team && !team.members.includes(user.fullName)) {
        this.dashboardSvc.handleUpdateTeam(team.id, { members: [...team.members, user.fullName] });
      }
    }
  }

  handleUserDeleted(userId: string): void {
    this.usersSvc.deleteUser(userId);
  }
}
