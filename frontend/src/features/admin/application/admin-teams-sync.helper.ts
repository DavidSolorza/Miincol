import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
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

export function syncTeamCreatedToBackend(team: TeamSupervisionSummary, dto: CreateTeamDto): void {
  const leaderEmail = dto.leaderEmail?.trim().toLowerCase() ||
    `${team.leader.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '')}@misincol.org`;
  const membersWithAccounts = (dto.membersWithAccounts || team.membersWithAccounts || []).map((m) => ({
    fullName: m.fullName?.trim() || '',
    email: m.email?.trim().toLowerCase() || '',
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

  httpClient.post('/teams', payload, { headers })
    .then(() => {
      httpClient.post('/notifications/team-created', {
        teamName: team.name, ethnicity: team.ethnicity,
        location: `${team.department} • ${team.region}`, leader: team.leader,
        leaderEmail, accessPin: team.accessPin, totalBudget: team.totalBudget,
        membersWithAccounts,
      }, { headers }).catch((e) => console.warn('Aviso de creación enviado con advertencia:', e));
    })
    .catch((err) => console.error('Error al persistir equipo en base de datos central:', err));
}

export function syncTeamUpdatedToBackend(
  teamId: string,
  updates: Partial<TeamSupervisionSummary> & Partial<CreateTeamDto>
): void {
  const headers = getAuthHeaders();
  const payload: Record<string, any> = {};
  for (const [k, v] of Object.entries(updates)) {
    if (ALLOWED_TEAM_KEYS.has(k) && v !== undefined) payload[k] = v;
  }
  if (updates.department || updates.region) {
    payload.location = `${updates.department || ''} - ${updates.region || ''}`;
  }
  httpClient.put(`/teams/${teamId}`, payload, { headers }).catch(() => {
    if (updates.slug && updates.slug !== teamId) {
      httpClient.put(`/teams/${updates.slug}`, payload, { headers }).catch(() => {});
    }
  });
}

export function syncTeamDeletedToBackend(team: TeamSupervisionSummary): void {
  const headers = getAuthHeaders();
  httpClient.delete(`/teams/${team.id}`, { headers }).catch(() => {});
  httpClient.post('/notifications/team-deleted', {
    teamName: team.name, leaderName: team.leader, deletedBy: 'Dirección Nacional',
  }, { headers }).catch(() => {});
}
