import type { TeamSupervisionSummary } from '../../../admin/domain/admin.types';

// Construye una entidad de equipo completa y segura cuando allTeams aún no se ha sincronizado
export function buildFallbackTeam(
  teamId: string,
  user?: { fullName?: string; email?: string },
  fallbackEmail?: string
): TeamSupervisionSummary {
  const leaderName = user?.fullName || 'Hugo Solorza';
  const leaderEmail = user?.email || fallbackEmail || 'hudisapastos@misincol.org';
  const isPastos = teamId.toLowerCase().includes('pastos') || leaderEmail.toLowerCase().includes('pastos');

  return {
    id: teamId,
    slug: teamId,
    name: isPastos ? 'Pastos' : `Misión ${teamId}`,
    ethnicity: isPastos ? 'Pastos' : 'Territorial',
    region: isPastos ? 'Cumbal y Chiles' : 'Colombia',
    department: isPastos ? 'Nariño' : 'Nariño',
    leader: leaderName,
    leaderEmail,
    leaderPhone: '+57 ',
    membersCount: 1,
    members: [leaderName],
    membersWithAccounts: [{ fullName: leaderName, email: leaderEmail, roleInTeam: 'Líder Pastoral' }],
    currentPhaseId: 'investigacion',
    currentPhaseName: '1. Investigación',
    progressPercentage: 0,
    totalBudget: 15000000,
    executedBudget: 0,
    totalActivities: 0,
    completedActivities: 0,
    inProgressActivities: 0,
    pendingActivities: 0,
    themeColor: '#8B251E',
    accessPin: '',
    healthStatus: 'Optimo',
    activeInitiatives: [],
    lastUpdate: 'Hoy',
  };
}

