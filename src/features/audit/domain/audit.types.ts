export type AuditActionType =
  | 'login'
  | 'activity_add'
  | 'activity_update'
  | 'activity_delete'
  | 'objective_update'
  | 'objective_add'
  | 'note_add'
  | 'note_delete'
  | 'report_generate';

export interface TeamAuditLog {
  id: string;
  teamId: string;
  userName: string;
  actionType: AuditActionType;
  title: string;
  detail: string;
  phaseId?: string;
  timestamp: string; // ISO 8601
}

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
