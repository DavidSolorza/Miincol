import { Injectable, signal, inject } from '@angular/core';
import type { RolePermissionsMatrix, SystemRoleId, PermissionKey } from '../domain/security.types';
import { DEFAULT_ROLE_PERMISSIONS_MATRIX } from './securityDefaults';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { serviceBus } from '../../../core/bus';

const STORAGE_KEY = 'misincol_security_matrix_v1';

@Injectable({ providedIn: 'root' })
export class SecurityMatrixService {
  private readonly toast = inject(ToastService);
  readonly matrix = signal<RolePermissionsMatrix>(this.loadMatrix());

  private loadMatrix(): RolePermissionsMatrix {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          team_member: { ...DEFAULT_ROLE_PERMISSIONS_MATRIX.team_member, ...parsed.team_member },
          team_leader: { ...DEFAULT_ROLE_PERMISSIONS_MATRIX.team_leader, ...parsed.team_leader },
          national_director: { ...DEFAULT_ROLE_PERMISSIONS_MATRIX.national_director, ...parsed.national_director },
        };
      }
    } catch { /* fallback to default */ }
    return DEFAULT_ROLE_PERMISSIONS_MATRIX;
  }

  hasPermission(role: SystemRoleId, perm: PermissionKey): boolean {
    return !!this.matrix()[role]?.[perm];
  }

  togglePermission(role: SystemRoleId, perm: PermissionKey): void {
    if (role === 'national_director' && (perm === 'security.roles.manage' || perm === 'audit.history.view')) {
      this.toast.toast.warning('No es posible deshabilitar permisos raíz para el Director Nacional.', 'Seguridad');
      return;
    }

    this.matrix.update((prev) => {
      const currentVal = !!prev[role]?.[perm];
      const updatedRole = { ...prev[role], [perm]: !currentVal };
      const next = { ...prev, [role]: updatedRole };
      this.persist(next);
      return next;
    });

    serviceBus.publish('ui:toast', {
      title: 'Permiso Actualizado',
      message: `El permiso [${perm}] ha sido modificado para el rol.`,
      type: 'info',
      duration: 2000,
    });
  }

  resetToDefaults(): void {
    this.toast.confirmAction({
      title: '¿Restablecer Matriz de Permisos?',
      message: 'Se restaurarán los privilegios por defecto para todos los roles.',
      confirmLabel: 'Restablecer',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: () => {
        this.matrix.set(DEFAULT_ROLE_PERMISSIONS_MATRIX);
        this.persist(DEFAULT_ROLE_PERMISSIONS_MATRIX);
        this.toast.toast.success('Matriz restaurada a los valores predeterminados.', 'Seguridad');
      },
    });
  }

  private persist(matrix: RolePermissionsMatrix): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
    } catch { /* ignore */ }
  }
}

