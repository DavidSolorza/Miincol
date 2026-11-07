export type SystemRoleId = 'team_member' | 'team_leader' | 'national_director';

export type PermissionKey =
  | 'pdm.view'
  | 'pdm.activities.edit'
  | 'pdm.activities.delete'
  | 'pdm.objectives.manage'
  | 'team.tasks.assign'
  | 'team.members.manage'
  | 'notes.manage'
  | 'reports.team.export'
  | 'reports.national.view'
  | 'audit.history.view'
  | 'security.roles.manage';

export type PermissionCategory =
  | 'Planes PDM'
  | 'Equipo y Tareas'
  | 'Reportes y Notas'
  | 'Seguridad y Auditoría';

export interface SystemRoleDef {
  id: SystemRoleId;
  name: string;
  badge: string;
  badgeClass: string;
  description: string;
  targetUser: string;
}

export interface PermissionDef {
  key: PermissionKey;
  label: string;
  category: PermissionCategory;
  description: string;
}

export type RolePermissionsMatrix = Record<SystemRoleId, Record<PermissionKey, boolean>>;

export const SYSTEM_ROLES: SystemRoleDef[] = [
  {
    id: 'team_member',
    name: 'Usuario equipo',
    badge: 'Campo',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Miembro del equipo misionero en territorio.',
    targetUser: 'Obrero / Evangelista',
  },
  {
    id: 'team_leader',
    name: 'Líder equipo',
    badge: 'Territorial',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    description: 'Pastor a cargo del PDM de la misión local.',
    targetUser: 'Líder Pastoral',
  },
  {
    id: 'national_director',
    name: 'Director nacional',
    badge: 'Nacional',
    badgeClass: 'bg-stone-900 text-stone-100 border-stone-800',
    description: 'Coordinador general con acceso a supervisión y seguridad.',
    targetUser: 'Administrador / Director',
  },
];

export const SYSTEM_PERMISSIONS: PermissionDef[] = [
  {
    key: 'pdm.view',
    label: 'Visualizar Planes PDM',
    category: 'Planes PDM',
    description: 'Acceso de lectura a las fases y objetivos de la misión.',
  },
  {
    key: 'pdm.activities.edit',
    label: 'Crear / Editar Iniciativas',
    category: 'Planes PDM',
    description: 'Modificación de metas, fechas y avance de actividades.',
  },
  {
    key: 'pdm.activities.delete',
    label: 'Eliminar Actividades',
    category: 'Planes PDM',
    description: 'Remover actividades existentes en la fase activa.',
  },
  {
    key: 'pdm.objectives.manage',
    label: 'Gestionar Objetivos (Máx 4)',
    category: 'Planes PDM',
    description: 'Creación, edición o eliminación directa de objetivos.',
  },
  {
    key: 'team.tasks.assign',
    label: 'Asignar Tareas a Integrantes',
    category: 'Equipo y Tareas',
    description: 'Vincular tareas a miembros específicos del equipo.',
  },
  {
    key: 'team.members.manage',
    label: 'Gestionar Integrantes (Crear / Eliminar)',
    category: 'Equipo y Tareas',
    description: 'Agregar o remover integrantes de la conformación de equipo.',
  },
  {
    key: 'notes.manage',
    label: 'Notas y Agenda Territorial',
    category: 'Reportes y Notas',
    description: 'Creación y fijación de apuntes, ideas y motivos de oración.',
  },
  {
    key: 'reports.team.export',
    label: 'Generar Informe Territorial PDM',
    category: 'Reportes y Notas',
    description: 'Exportación ejecutiva del plan del equipo local.',
  },
  {
    key: 'reports.national.view',
    label: 'Supervisión y KPIs Nacionales',
    category: 'Reportes y Notas',
    description: 'Monitoreo consolidado de todas las misiones del país.',
  },
  {
    key: 'audit.history.view',
    label: 'Historial de Ingresos y Auditoría',
    category: 'Seguridad y Auditoría',
    description: 'Consulta de bitácoras de acceso y telemetría por usuario.',
  },
  {
    key: 'security.roles.manage',
    label: 'Gestión de Roles y Matriz de Permisos',
    category: 'Seguridad y Auditoría',
    description: 'Administración de la matriz de seguridad del sistema.',
  },
];

