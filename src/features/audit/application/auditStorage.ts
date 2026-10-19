import type { TeamAuditLog, TeamTelemetrySummary } from '../domain/audit.types';
import { getInitialAuditLogs } from './initialAuditLogs';

export const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} d`;
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
};

export const formatTimeHour = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const hour = date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
  return isToday ? `Hoy, ${hour}` : `${date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}, ${hour}`;
};

export const getStoredAuditLogs = (teamId: string, leaderName = 'Líder'): TeamAuditLog[] => {
  try {
    const raw = localStorage.getItem(`misincol_audit_logs_${teamId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return getInitialAuditLogs(teamId, leaderName);
};

export const saveAuditLogs = (teamId: string, logs: TeamAuditLog[]): void => {
  try {
    localStorage.setItem(`misincol_audit_logs_${teamId}`, JSON.stringify(logs.slice(0, 50)));
  } catch (err) {
    console.warn('Error al guardar log de auditoría:', err);
  }
};

export const appendAuditLog = (
  teamId: string,
  entry: Omit<TeamAuditLog, 'id' | 'timestamp'>,
  leaderName = 'Líder'
): TeamAuditLog => {
  const logs = getStoredAuditLogs(teamId, leaderName);
  const newLog: TeamAuditLog = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newLog, ...logs];
  saveAuditLogs(teamId, updated);
  return newLog;
};

export const calculateTeamTelemetry = (teamId: string, leaderName = 'Líder'): TeamTelemetrySummary => {
  const logs = getStoredAuditLogs(teamId, leaderName);
  const lastLogin = logs.find((l) => l.actionType === 'login');
  const lastAction = logs.find((l) => l.actionType !== 'login') || logs[0];
  const lastLoginAt = lastLogin?.timestamp || logs[0]?.timestamp || new Date().toISOString();
  const diffHours = (Date.now() - new Date(lastLoginAt).getTime()) / 3600000;

  return {
    teamId,
    lastLoginAt,
    lastLoginFormatted: formatTimeHour(lastLoginAt),
    isRecentLogin: diffHours <= 24,
    lastActionTitle: lastAction?.title || 'Sin actividad registrada',
    lastActionDetail: lastAction?.detail || 'No se han reportado movimientos',
    lastActionAt: lastAction ? formatRelativeTime(lastAction.timestamp) : 'Sin fecha',
    lastActionType: lastAction?.actionType || 'login',
    totalActionsCount: logs.length,
  };
};
