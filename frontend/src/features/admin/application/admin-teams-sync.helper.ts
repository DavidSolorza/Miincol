import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { httpClient } from '../../../core/http/httpClient';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('misincol_auth_token') : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch { /* ignore */ }
  return headers;
}

export function syncTeamCreatedToBackend(team: TeamSupervisionSummary, dto: CreateTeamDto): void {
  const leaderEmail = dto.leaderEmail?.trim().toLowerCase() ||
    `${team.leader.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '')}@misincol.org`;
  const membersWithAccounts = dto.membersWithAccounts || team.membersWithAccounts || [];
  const headers = getAuthHeaders();

  httpClient.post('/teams', {
    name: team.name, location: `${team.department} - ${team.region}`, population: 10000,
    evangelicaCongregations: 1, evangelicalsCount: 50, totalBudget: team.totalBudget,
    leader: team.leader, leaderEmail, accessPin: team.accessPin,
    membersWithAccounts, currentPhaseId: team.currentPhaseId,
  }, { headers }).catch(() => {});

  httpClient.post('/notifications/team-created', {
    teamName: team.name, ethnicity: team.ethnicity, location: `${team.department} • ${team.region}`,
    leader: team.leader, leaderEmail, accessPin: team.accessPin, totalBudget: team.totalBudget,
    membersWithAccounts,
  }, { headers }).catch(() => {});
}

export function syncTeamDeletedToBackend(team: TeamSupervisionSummary): void {
  const headers = getAuthHeaders();
  httpClient.delete(`/teams/${team.id}`, { headers }).catch(() => {});
  httpClient.post('/notifications/team-deleted', {
    teamName: team.name, leaderName: team.leader, deletedBy: 'Dirección Nacional',
  }, { headers }).catch(() => {});
}

