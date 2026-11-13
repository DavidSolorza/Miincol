import type { SystemRoleId, PermissionKey, RolePermissionsMatrix } from './security.types';

export type PermissionConstraintType = 'protected' | 'restricted' | 'configurable';

export interface PermissionConstraintResult {
  type: PermissionConstraintType;
  effectiveValue: boolean;
  reason?: string;
}

export function getRolePermissionConstraint(
  roleId: SystemRoleId,
  permKey: PermissionKey,
  configuredValue = false,
): PermissionConstraintResult {
  // 1. Coordinador de Equipos (national_director): Privilegios raíz de seguridad y supervisión protegidos
  if (roleId === 'national_director') {
    if (
      permKey === 'security.roles.manage' ||
      permKey === 'audit.history.view' ||
      permKey === 'reports.national.view' ||
      permKey === 'pdm.view'
    ) {
      return {
        type: 'protected',
        effectiveValue: true,
        reason: 'Privilegio raíz institucional protegido para el Coordinador Nacional.',
      };
    }
    return { type: 'configurable', effectiveValue: configuredValue };
  }

  // 2. Director General (director_general): Observador pasivo, prohibición estricta de mutación
  if (roleId === 'director_general') {
    if (
      permKey === 'pdm.activities.edit' ||
      permKey === 'pdm.activities.delete' ||
      permKey === 'pdm.objectives.manage' ||
      permKey === 'team.members.manage' ||
      permKey === 'security.roles.manage'
    ) {
      return {
        type: 'restricted',
        effectiveValue: false,
        reason: 'Rol institucional de supervisión pasiva: mutaciones operativas restringidas.',
      };
    }
    return { type: 'configurable', effectiveValue: configuredValue };
  }

  // 3. Usuario de Equipo (team_member): Personal operativo en campo
  if (roleId === 'team_member') {
    if (
      permKey === 'security.roles.manage' ||
      permKey === 'audit.history.view' ||
      permKey === 'reports.national.view' ||
      permKey === 'pdm.objectives.manage' ||
      permKey === 'team.members.manage'
    ) {
      return {
        type: 'restricted',
        effectiveValue: false,
        reason: 'Privilegio de nivel directivo o territorial fuera del alcance del usuario de equipo.',
      };
    }
    return { type: 'configurable', effectiveValue: configuredValue };
  }

  // 4. Líder de Equipo (team_leader): Responsable pastoral local
  if (roleId === 'team_leader') {
    if (
      permKey === 'security.roles.manage' ||
      permKey === 'reports.national.view' ||
      permKey === 'audit.history.view'
    ) {
      return {
        type: 'restricted',
        effectiveValue: false,
        reason: 'Administración de seguridad y telemetría nacional reservadas a la Coordinación.',
      };
    }
    return { type: 'configurable', effectiveValue: configuredValue };
  }

  return { type: 'configurable', effectiveValue: configuredValue };
}

export function normalizeRolePermissions(matrix: RolePermissionsMatrix): RolePermissionsMatrix {
  const roles: SystemRoleId[] = ['team_member', 'team_leader', 'director_general', 'national_director'];
  const next = { ...matrix } as RolePermissionsMatrix;
  for (const role of roles) {
    next[role] = { ...(next[role] || {}) } as Record<PermissionKey, boolean>;
    for (const permKey of Object.keys(next[role]) as PermissionKey[]) {
      const c = getRolePermissionConstraint(role, permKey, !!next[role][permKey]);
      next[role][permKey] = c.effectiveValue;
    }
  }
  return next;
}
