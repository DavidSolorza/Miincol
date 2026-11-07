// Tipos de acción auditables dentro del Plan de Desarrollo Ministerial
export type AuditActionType =
  | 'login'
  | 'activity_add'
  | 'activity_update'
  | 'activity_delete'
  | 'objective_update'
  | 'objective_add'
  | 'note_add'
  | 'note_delete'
  | 'report_generate'
  | 'role_update'
  | 'security_update';

// Estructura de un registro individual en la bitácora de auditoría del equipo
export interface TeamAuditLog {
  id: string;
  teamId: string;
  teamName?: string;
  userName: string;
  userRole?: string;
  actionType: AuditActionType;
  title: string;
  detail: string;
  fieldModified?: string;
  previousValue?: string;
  newValue?: string;
  phaseId?: string;
  timestamp: string; // ISO 8601
  ipAddress?: string;
}

// Resumen consolidado de telemetría y último acceso de un equipo misionero
export interface TeamTelemetrySummary {
  teamId: string;
  lastLoginAt: string;
  lastLoginFormatted: string;
  isRecentLogin: boolean; // Menos de 24 horas
  lastActionTitle: string;
  lastActionDetail: string;
  lastActionAt: string;
  lastActionType: AuditActionType;
  totalActionsCount: number;
}
