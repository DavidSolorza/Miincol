import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import type { OutboxQueueService } from '../../../core/offline/application/outbox-queue.service';
import { httpClient } from '../../../core/http/httpClient';

const ALLOWED_TEAM_KEYS = new Set([
  'name', 'location', 'population', 'evangelicaCongregations', 'evangelicalsCount',
  'leader', 'leaderEmail', 'leaderPhone', 'accessPin', 'ethnicity', 'region',
  'department', 'currentPhaseId', 'totalBudget', 'executedBudget', 'themeColor',
  'healthStatus', 'members', 'membersWithAccounts',
]);

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('misincol_auth_token') : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch { /* ignore */ }
  return headers;
}

export function syncTeamCreatedToBackend(team: TeamSupervisionSummary, dto: CreateTeamDto, outbox?: OutboxQueueService): void {
  const leaderEmail = dto.leaderEmail?.trim().toLowerCase() ||
    `${team.leader.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '')}@misincol.org`;
  const membersWithAccounts = (dto.membersWithAccounts || team.membersWithAccounts || []).map((m) => ({
    fullName: m.fullName?.trim() || '', email: m.email?.trim().toLowerCase() || '',
    roleInTeam: m.roleInTeam?.trim() || 'Misionero de Campo',
  }));
  const headers = getAuthHeaders();
  const payload = {
    name: team.name, ethnicity: team.ethnicity, region: team.region, department: team.department,
    location: team.department && team.region ? `${team.department} - ${team.region}` : (team.department || team.region || team.name),
    population: 10000, evangelicaCongregations: 1, evangelicalsCount: 50,
    totalBudget: Number(team.totalBudget) || 15000000, leader: team.leader, leaderEmail,
    leaderPhone: team.leaderPhone, themeColor: team.themeColor,
    healthStatus: team.healthStatus || 'Optimo', accessPin: team.accessPin,
    membersWithAccounts, currentPhaseId: team.currentPhaseId,
  };

  if (outbox) {
    outbox.enqueue({ entityType: 'team', entityId: team.id, action: 'CREATE', endpoint: '/teams', method: 'POST', payload })
      .then((m) => {
        httpClient.post('/teams', payload, { headers })
          .then(() => {
            outbox.markSuccess(m.id);
            httpClient.post('/notifications/team-created', {
              teamName: team.name, ethnicity: team.ethnicity, location: `${team.department} • ${team.region}`,
              leader: team.leader, leaderEmail, accessPin: team.accessPin, totalBudget: team.totalBudget, membersWithAccounts,
            }, { headers }).catch(() => {});
          }).catch(() => {});
      }).catch(() => {});
  } else {
    httpClient.post('/teams', payload, { headers })
      .then(() => {
        httpClient.post('/notifications/team-created', {
          teamName: team.name, ethnicity: team.ethnicity, location: `${team.department} • ${team.region}`,
          leader: team.leader, leaderEmail, accessPin: team.accessPin, totalBudget: team.totalBudget, membersWithAccounts,
        }, { headers }).catch(() => {});
      }).catch(() => {});
  }
}

export function syncTeamUpdatedToBackend(
  teamId: string,
  updates: Partial<TeamSupervisionSummary> & Partial<CreateTeamDto>,
  outbox?: OutboxQueueService
): void {
  const headers = getAuthHeaders();
  const payload: Record<string, any> = {};
  for (const [k, v] of Object.entries(updates)) {
    if (ALLOWED_TEAM_KEYS.has(k) && v !== undefined) payload[k] = v;
  }
  if (updates.department || updates.region) {
    payload.location = `${updates.department || ''} - ${updates.region || ''}`;
  }

  if (outbox) {
    outbox.enqueue({ entityType: 'team', entityId: teamId, action: 'UPDATE', endpoint: `/teams/${teamId}`, method: 'PUT', payload })
      .then((m) => {
        httpClient.put(`/teams/${teamId}`, payload, { headers })
          .then(() => outbox.markSuccess(m.id))
          .catch(() => {
            if (updates.slug && updates.slug !== teamId) {
              httpClient.put(`/teams/${updates.slug}`, payload, { headers })
                .then(() => outbox.markSuccess(m.id)).catch(() => {});
            }
          });
      }).catch(() => {});
  } else {
    httpClient.put(`/teams/${teamId}`, payload, { headers }).catch(() => {
      if (updates.slug && updates.slug !== teamId) {
        httpClient.put(`/teams/${updates.slug}`, payload, { headers }).catch(() => {});
      }
    });
  }
}

export function syncTeamDeletedToBackend(team: TeamSupervisionSummary, outbox?: OutboxQueueService): void {
  const headers = getAuthHeaders();
  if (outbox) {
    outbox.enqueue({ entityType: 'team', entityId: team.id, action: 'DELETE', endpoint: `/teams/${team.id}`, method: 'DELETE', payload: {} })
      .then((m) => {
        httpClient.delete(`/teams/${team.id}`, { headers }).then(() => outbox.markSuccess(m.id)).catch(() => {});
      }).catch(() => {});
  } else {
    httpClient.delete(`/teams/${team.id}`, { headers }).catch(() => {});
  }
  httpClient.post('/notifications/team-deleted', {
    teamName: team.name, leaderName: team.leader, deletedBy: 'Dirección Nacional',
  }, { headers }).catch(() => {});
}
