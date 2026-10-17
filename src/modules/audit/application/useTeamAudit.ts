import { useState, useEffect, useCallback } from 'react';
import type { TeamAuditLog, TeamTelemetrySummary, AuditActionType } from '../domain/audit.types';
import { getStoredAuditLogs, calculateTeamTelemetry, appendAuditLog } from './auditStorage';
import { serviceBus } from '../../../core/bus';

export const useTeamAudit = (teamId: string, leaderName = 'Líder') => {
  const [logs, setLogs] = useState<TeamAuditLog[]>(() => getStoredAuditLogs(teamId, leaderName));
  const [telemetry, setTelemetry] = useState<TeamTelemetrySummary>(() =>
    calculateTeamTelemetry(teamId, leaderName)
  );

  const refresh = useCallback(() => {
    setLogs(getStoredAuditLogs(teamId, leaderName));
    setTelemetry(calculateTeamTelemetry(teamId, leaderName));
  }, [teamId, leaderName]);

  useEffect(() => {
    refresh();
  }, [teamId, refresh]);

  useEffect(() => {
    const sub = serviceBus.subscribe('audit:log', (payload) => {
      if (payload.teamId === teamId) {
        refresh();
      }
    });
    return () => sub.unsubscribe();
  }, [teamId, refresh]);

  const logEvent = useCallback(
    (actionType: AuditActionType, title: string, detail: string, phaseId?: string) => {
      appendAuditLog(teamId, { teamId, userName: leaderName, actionType, title, detail, phaseId }, leaderName);
      serviceBus.publish('audit:log', { teamId, userName: leaderName, actionType, title, detail, phaseId });
      refresh();
    },
    [teamId, leaderName, refresh]
  );

  return { logs, telemetry, refresh, logEvent };
};
