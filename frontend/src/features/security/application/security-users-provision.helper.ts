import type { SystemUser } from '../domain/security-users.types';
import type { TeamSupervisionSummary, CreateTeamDto } from '../../admin/domain/admin.types';
import type { SystemRoleId } from '../domain/security.types';

const ROLE_RANK: Record<SystemRoleId, number> = {
  team_member: 1,
  team_leader: 2,
  director_general: 3,
  national_director: 4,
};

function formatEmail(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') + '@misincol.org';
}

function isLeaderMatch(u: SystemUser, team: TeamSupervisionSummary, leaderEmail: string, cleanLeader: string): boolean {
  if (leaderEmail && u.email.toLowerCase() === leaderEmail) return true;
  if (u.teamId === team.id && (u.role === 'team_leader' || u.role === 'national_director' || u.role === 'director_general')) return true;
  const uName = u.fullName.trim().toLowerCase();
  if (cleanLeader && (uName === cleanLeader || (cleanLeader.includes('hugo') && uName.includes('hugo')))) return true;
  return false;
}

export function resolveTeamUsersToProvision(
  team: TeamSupervisionSummary,
  current: SystemUser[],
  dto?: CreateTeamDto
): SystemUser[] {
  const toAdd: SystemUser[] = [];
  const explicitLeaderEmail = dto?.leaderEmail?.trim().toLowerCase() || team.leaderEmail?.trim().toLowerCase();
  const leaderEmail = explicitLeaderEmail || (team.leader ? formatEmail(team.leader) : '');
  const cleanLeader = team.leader ? team.leader.trim().toLowerCase() : '';
  const isHugoOrPastos = team.id === 'team-pastos' || cleanLeader.includes('hugo');

  const existingLeader = current.find((u) => isLeaderMatch(u, team, leaderEmail, cleanLeader));

  if (existingLeader) {
    if (team.leader) existingLeader.fullName = team.leader;
    if (explicitLeaderEmail) existingLeader.email = explicitLeaderEmail;
    else if (!existingLeader.email) existingLeader.email = leaderEmail;
    existingLeader.teamId = team.id;
    existingLeader.teamName = team.name;
    const currentRank = ROLE_RANK[existingLeader.role] || 0;
    if (isHugoOrPastos) {
      existingLeader.role = 'national_director';
    } else if (currentRank < ROLE_RANK['team_leader']) {
      existingLeader.role = 'team_leader';
    }
    if (team.leaderPhone) existingLeader.phone = team.leaderPhone;
  } else if (team.leader) {
    toAdd.push({
      id: 'usr-' + Date.now() + '-ldr',
      fullName: team.leader,
      email: leaderEmail,
      role: isHugoOrPastos ? 'national_director' : 'team_leader',
      teamId: team.id,
      teamName: team.name,
      territory: team.department ? `${team.department} • ${team.region}` : team.region,
      phone: team.leaderPhone || '',
    });
  }

  const membersList = (dto?.membersWithAccounts && dto.membersWithAccounts.length > 0)
    ? dto.membersWithAccounts
    : (team.membersWithAccounts || []);

  if (membersList.length > 0) {
    membersList.forEach((m, idx) => {
      const email = m.email.trim().toLowerCase();
      if (!email) return;
      const existing = current.find((u) => u.email.toLowerCase() === email);
      if (existing) {
        if (m.fullName) existing.fullName = m.fullName.trim();
        existing.teamId = team.id;
        existing.teamName = team.name;
        if ((ROLE_RANK[existing.role] || 0) < ROLE_RANK['team_member']) existing.role = 'team_member';
      } else if (!toAdd.some((u) => u.email.toLowerCase() === email)) {
        toAdd.push({
          id: 'usr-' + Date.now() + '-m' + idx,
          fullName: m.fullName.trim(),
          email,
          role: 'team_member',
          teamId: team.id,
          teamName: team.name,
          territory: team.department ? `${team.department} • ${team.region}` : team.region,
        });
      }
    });
  } else if (team.members && team.members.length > 0) {
    team.members.forEach((memName, idx) => {
      if (!memName || (cleanLeader && memName.toLowerCase() === cleanLeader)) return;
      const exists = current.some((u) => u.fullName.toLowerCase() === memName.toLowerCase());
      if (!exists && !toAdd.some((u) => u.fullName.toLowerCase() === memName.toLowerCase())) {
        toAdd.push({
          id: 'usr-' + Date.now() + '-m' + idx,
          fullName: memName,
          email: formatEmail(memName),
          role: 'team_member',
          teamId: team.id,
          teamName: team.name,
          territory: team.department ? `${team.department} • ${team.region}` : team.region,
        });
      }
    });
  }

  return [...toAdd, ...current];
}
