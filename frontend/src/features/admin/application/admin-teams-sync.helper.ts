import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('misincol_auth_token') : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch { /* ignore */ }
  return headers;
}

export function syncTeamCreatedToBackend(team: TeamSupervisionSummary, dto: CreateTeamDto): void {
  if (typeof fetch === 'undefined') return;
  const leaderEmail = dto.leaderEmail?.trim().toLowerCase() ||
    `${team.leader.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '')}@misincol.org`;
  const membersWithAccounts = dto.membersWithAccounts || team.membersWithAccounts || [];

  fetch('/api/teams', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: team.name, location: `${team.department} - ${team.region}`, population: 10000,
      evangelicaCongregations: 1, evangelicalsCount: 50, totalBudget: team.totalBudget,
      leader: team.leader, leaderEmail, accessPin: team.accessPin,
      membersWithAccounts, currentPhaseId: team.currentPhaseId,
    }),
  }).catch(() => {});

  fetch('/api/notifications/team-created', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      teamName: team.name, ethnicity: team.ethnicity, location: `${team.department} • ${team.region}`,
      leader: team.leader, leaderEmail, accessPin: team.accessPin, totalBudget: team.totalBudget,
      membersWithAccounts,
    }),
  }).catch(() => {});
}

export function syncTeamDeletedToBackend(team: TeamSupervisionSummary): void {
  if (typeof fetch === 'undefined') return;
  fetch(`/api/teams/${team.id}`, { method: 'DELETE', headers: getAuthHeaders() }).catch(() => {});
  fetch('/api/notifications/team-deleted', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      teamName: team.name, leaderName: team.leader, deletedBy: 'Dirección Nacional',
    }),
  }).catch(() => {});
}

