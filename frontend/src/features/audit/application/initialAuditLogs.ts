import type { TeamAuditLog } from '../domain/audit.types';

export const INITIAL_AUDIT_LOGS_BY_TEAM: Record<string, TeamAuditLog[]> = {};

export const getInitialAuditLogs = (_teamId: string, _leaderName = 'Líder de Misión'): TeamAuditLog[] => {
  return [];
};
