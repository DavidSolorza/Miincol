import type { PhasePlan, PhaseType } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { PASTOS_PLANS_BY_PHASE } from './pastosPlanData';

export const PHASE_NAMES_MAP: Record<PhaseType, string> = {
  investigacion: '1. Investigación',
  encarnacion: '2. Encarnación',
  evangelizacion: '3. Evangelización',
  entrenamiento: '4. Entrenamiento',
  autocuidado: '5. Autocuidado',
};

// Genera un conjunto de planes en blanco para un equipo recién creado (0 objetivos para empezar a llenar)
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

  const base: Record<string, PhasePlan> = JSON.parse(JSON.stringify(INITIAL_PLANS_BY_PHASE));

  Object.keys(base).forEach((key) => {
    base[key].teamName = teamName;
    base[key].teamLeader = teamLeader;
    base[key].teamMembers = teamMembers;
    base[key].objectives = []; // PDM completamente limpio y en blanco para inicializar desde cero
  });

  try {
    localStorage.setItem(`misincol_pdm_plans_${teamId}`, JSON.stringify(base));
  } catch { /* ignore */ }

  return base;
};

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

  return createCustomPlanForTeam(teamId, teamData);
};
