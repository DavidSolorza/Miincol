import type { PhasePlan, PhaseType } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { PASTOS_PLANS_BY_PHASE } from './pastosPlanData';

// Mapa de nombres legibles por cada identificador de fase ministerial
export const PHASE_NAMES_MAP: Record<PhaseType, string> = {
  investigacion: '1. Investigación',
  encarnacion: '2. Encarnación',
  evangelizacion: '3. Evangelización',
  entrenamiento: '4. Entrenamiento',
  autocuidado: '5. Autocuidado',
};

// Genera un conjunto de planes personalizados a partir de la plantilla base para un equipo nuevo
export const createCustomPlanForTeam = (
  teamId: string,
  teamData?: Partial<TeamSupervisionSummary>
): Record<string, PhasePlan> => {
  const teamName = teamData?.name || `Misión ${teamId}`;
  const teamLeader = teamData?.leader || 'Pastor Líder';
  const teamMembers =
    teamData?.members && teamData.members.length > 0
      ? teamData.members
      : [teamLeader, 'Obrero de campo'];
  const ethnicity = teamData?.ethnicity || 'Indígena';
  const region = teamData?.region || 'Territorio ancestral';

  const base: Record<string, PhasePlan> = JSON.parse(JSON.stringify(INITIAL_PLANS_BY_PHASE));

  Object.keys(base).forEach((key) => {
    base[key].teamName = teamName;
    base[key].teamLeader = teamLeader;
    base[key].teamMembers = teamMembers;

    if (base[key].objectives && base[key].objectives[0]) {
      base[key].objectives[0].description = `Diagnóstico situacional, inmersión y mapeo de comunidades en el pueblo ${ethnicity} en ${region}.`;
    }
  });

  return base;
};

// Obtiene los planes de un equipo desde localStorage o retorna su plantilla predeterminada
export const getPlansForTeam = (
  teamId: string,
  teamData?: Partial<TeamSupervisionSummary>
): Record<string, PhasePlan> => {
  try {
    const storageKey = `misincol_pdm_plans_${teamId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Error al leer planes para equipo:', teamId, e);
  }

  if (teamId === 'team-wayuu') return INITIAL_PLANS_BY_PHASE;
  if (teamId === 'team-pastos') return PASTOS_PLANS_BY_PHASE;
  return createCustomPlanForTeam(teamId, teamData);
};
