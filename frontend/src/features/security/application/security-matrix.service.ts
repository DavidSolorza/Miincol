import { Injectable, signal, inject } from '@angular/core';
import type { RolePermissionsMatrix, SystemRoleId, PermissionKey } from '../domain/security.types';
import { DEFAULT_ROLE_PERMISSIONS_MATRIX } from './securityDefaults';
import { getRolePermissionConstraint, normalizeRolePermissions } from '../domain/security-constraints.helper';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { serviceBus } from '../../../core/bus';
import { httpClient } from '../../../core/http/httpClient';

const STORAGE_KEY = 'misincol_security_matrix_v1';

@Injectable({ providedIn: 'root' })
export class SecurityMatrixService {
  private readonly toast = inject(ToastService);
  readonly matrix = signal<RolePermissionsMatrix>(this.loadMatrix());
  readonly isSaving = signal<boolean>(false);

  constructor() {
    this.syncFromBackend();
  }

  private async syncFromBackend(): Promise<void> {
    try {
      const res = await httpClient.get<{ matrix: RolePermissionsMatrix }>('/security/matrix');
      if (res?.matrix) {
        const normalized = normalizeRolePermissions(res.matrix);
        this.matrix.set(normalized);
        this.persist(normalized);
      }
    } catch { /* Usar respaldo de localStorage */ }
  }

  private loadMatrix(): RolePermissionsMatrix {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: RolePermissionsMatrix = {
          team_member: { ...DEFAULT_ROLE_PERMISSIONS_MATRIX.team_member, ...parsed.team_member },
          team_leader: { ...DEFAULT_ROLE_PERMISSIONS_MATRIX.team_leader, ...parsed.team_leader },
          director_general: { ...DEFAULT_ROLE_PERMISSIONS_MATRIX.director_general, ...parsed.director_general },
          national_director: { ...DEFAULT_ROLE_PERMISSIONS_MATRIX.national_director, ...parsed.national_director },
        };
        return normalizeRolePermissions(merged);
      }
    } catch { /* fallback */ }
    return normalizeRolePermissions(DEFAULT_ROLE_PERMISSIONS_MATRIX);
  }

  hasPermission(role: SystemRoleId, perm: PermissionKey): boolean {
    const configured = !!this.matrix()[role]?.[perm];
    return getRolePermissionConstraint(role, perm, configured).effectiveValue;
  }

  togglePermission(role: SystemRoleId, perm: PermissionKey): void {
    const configured = !!this.matrix()[role]?.[perm];
    const constraint = getRolePermissionConstraint(role, perm, configured);

    if (constraint.type !== 'configurable') {
      const title = constraint.type === 'protected' ? 'Privilegio Protegido' : 'Restricción de Perfil';
      this.toast.toast.warning(constraint.reason || 'Restricción de gobernanza.', title);
      return;
    }

    this.matrix.update((prev) => {
      const updatedRole = { ...prev[role], [perm]: !configured };
      const next = normalizeRolePermissions({ ...prev, [role]: updatedRole });
      this.persist(next);
      return next;
    });

    serviceBus.publish('ui:toast', {
      title: 'Permiso Modificado',
      message: `El permiso [${perm}] ha sido modificado. Recuerda pulsar "Guardar Matriz".`,
      type: 'info',
      duration: 2000,
    });
  }

  async saveMatrixToBackend(): Promise<boolean> {
    this.isSaving.set(true);
    try {
      const normalized = normalizeRolePermissions(this.matrix());
      this.persist(normalized);
      await httpClient.put('/security/matrix', { matrix: normalized });
      this.toast.toast.success('Matriz guardada con éxito en el servidor y almacenamiento local', 'Seguridad');
      return true;
    } catch (err: any) {
      this.toast.toast.warning('Guardado localmente. (Servidor no disponible: ' + (err.message || 'error') + ')', 'Aviso');
      return false;
    } finally {
      this.isSaving.set(false);
    }
  }

  resetToDefaults(): void {
    this.toast.confirmAction({
      title: '¿Restablecer Matriz de Permisos?',
      message: 'Se restaurarán los privilegios por defecto para todos los roles respetando las restricciones de gobernanza.',
      confirmLabel: 'Restablecer',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: async () => {
        const resetMatrix = normalizeRolePermissions(DEFAULT_ROLE_PERMISSIONS_MATRIX);
        this.matrix.set(resetMatrix);
        await this.saveMatrixToBackend();
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
