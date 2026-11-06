import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { SecurityMatrixService } from '../application/security-matrix.service';
import { SecurityUsersService } from '../application/security-users.service';
import { SecurityRolesHeaderComponent } from './components/security-roles-header.component';
import { SecurityMatrixTableComponent } from './components/security-matrix-table.component';
import { SecurityUsersTableComponent } from './components/security-users-table.component';

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
          (roleChanged)="usersSvc.updateUserRole($event.userId, $event.newRole)"
        />
      }
    </div>
  `,
})
export class SecurityRolesViewComponent {
  readonly securitySvc = inject(SecurityMatrixService);
  readonly usersSvc = inject(SecurityUsersService);
  readonly activeTab = signal<'matrix' | 'users'>('matrix');
}
