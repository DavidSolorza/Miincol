import type { PillarBudgetBreakdown } from './general-info.types';
import { getPlansForTeam } from '../../plans/application/teamPlanLoader';

// Calcula dinámicamente el presupuesto por pilar sumando las actividades reales de cada fase PDM
export function computePillarBudgetsFromPlans(teamId: string): PillarBudgetBreakdown {
  const plans = getPlansForTeam(teamId);

  const getPhaseBudget = (phaseKey: string): number => {
    const objs = plans[phaseKey]?.objectives || [];
    return objs
      .flatMap((o) => o.activities || [])
      .reduce((sum, a) => sum + (Number(a.totalBudget) || 0), 0);
  };

  const getPhaseExecuted = (phaseKey: string): number => {
    const objs = plans[phaseKey]?.objectives || [];
    return objs
      .flatMap((o) => o.activities || [])
      .filter((a) => a.state === 'Completado')
      .reduce((sum, a) => sum + (Number(a.totalBudget) || 0), 0);
  };

  const investigacionBudget = getPhaseBudget('investigacion');
  const encarnacionBudget = getPhaseBudget('encarnacion');
  const evangelizacionBudget = getPhaseBudget('evangelizacion');
  const entrenamientoBudget = getPhaseBudget('entrenamiento');
  const autocuidadoBudget = getPhaseBudget('autocuidado');
  const executedTotalBudget =
    getPhaseExecuted('investigacion') +
    getPhaseExecuted('encarnacion') +
    getPhaseExecuted('evangelizacion') +
    getPhaseExecuted('entrenamiento') +
    getPhaseExecuted('autocuidado');

  return {
    investigacionBudget,
    encarnacionBudget,
    evangelizacionBudget,
    entrenamientoBudget,
    autocuidadoBudget,
    executedTotalBudget,
  };
}
