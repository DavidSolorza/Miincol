import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SecurityMatrixService } from '../application/security-matrix.service';
import { SecurityRolesHeaderComponent } from './components/security-roles-header.component';
import { SecurityMatrixTableComponent } from './components/security-matrix-table.component';

@Component({
  selector: 'app-security-roles-view',
  standalone: true,
  imports: [SecurityRolesHeaderComponent, SecurityMatrixTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-4 max-w-full overflow-x-hidden animate-fadeIn select-none">
      <app-security-roles-header
        (resetDefaults)="securitySvc.resetToDefaults()"
      />

      <app-security-matrix-table
        [matrix]="securitySvc.matrix()"
        (toggle)="securitySvc.togglePermission($event.role, $event.perm)"
      />
    </div>
  `,
})
export class SecurityRolesViewComponent {
  readonly securitySvc = inject(SecurityMatrixService);
}
