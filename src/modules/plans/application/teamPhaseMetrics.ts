import type { PhaseType } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { PHASE_NAMES_MAP, getPlansForTeam, createCustomPlanForTeam } from './teamPlanLoader';

export { PHASE_NAMES_MAP, getPlansForTeam, createCustomPlanForTeam };

export interface TeamPhaseMetrics {
  currentPhaseId: PhaseType;
  currentPhaseName: string;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  pendingActivities: number;
  progressPercentage: number;
  totalBudget: number;
  executedBudget: number;
  activeInitiatives: Array<{
    title: string;
    responsible: string;
    state: 'Pendiente' | 'En Proceso' | 'Completado';
    objectiveNumber: 1 | 2 | 3 | 4;
    stage?: string;
  }>;
}

export const getTeamPhaseMetrics = (
  teamId: string,
  phaseId: PhaseType,
  teamData?: Partial<TeamSupervisionSummary>
): TeamPhaseMetrics => {
  const allPlans = getPlansForTeam(teamId, teamData);
  const phasePlan = allPlans[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];

  if (!phasePlan) {
    return {
      currentPhaseId: phaseId,
      currentPhaseName: PHASE_NAMES_MAP[phaseId] || '1. Investigación',
      totalActivities: 0,
      completedActivities: 0,
      inProgressActivities: 0,
      pendingActivities: 0,
      progressPercentage: 0,
      totalBudget: 0,
      executedBudget: 0,
      activeInitiatives: [],
    };
  }

  const objectives = phasePlan.objectives || [];
  const allActs = objectives.flatMap((o) =>
    (o.activities || []).map((a) => ({
      ...a,
      objNum: (o.number as 1 | 2 | 3 | 4) || 1,
    }))
  );

  const totalActivities = allActs.length;
  const completedActivities = allActs.filter((a) => a.state === 'Completado').length;
  const inProgressActivities = allActs.filter((a) => a.state === 'En Proceso').length;
  const pendingActivities = allActs.filter((a) => a.state === 'Pendiente').length;
  const progressPercentage =
    totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const totalBudget = allActs.reduce((sum, a) => sum + (Number(a.totalBudget) || 0), 0);
  const executedBudget = allActs
    .filter((a) => a.state === 'Completado')
    .reduce((sum, a) => sum + (Number(a.totalBudget) || 0), 0);

  const activeInitiatives = allActs.map((a) => ({
    title: a.description,
    responsible: a.responsible,
    state: a.state as 'Pendiente' | 'En Proceso' | 'Completado',
    objectiveNumber: a.objNum,
    stage: a.stage,
  }));

  return {
    currentPhaseId: phaseId,
    currentPhaseName: PHASE_NAMES_MAP[phaseId] || phasePlan.phaseName,
    totalActivities,
    completedActivities,
    inProgressActivities,
    pendingActivities,
    progressPercentage,
    totalBudget,
    executedBudget,
    activeInitiatives,
  };
};
