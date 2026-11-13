import type { PhasePlan } from '../domain/plan.types';

// Limpia las actividades de los planes para iniciar un nuevo ciclo anual
export function cleanPlansForNewYear(currentPlans: Record<string, PhasePlan>): Record<string, PhasePlan> {
  const result: Record<string, PhasePlan> = {};
  Object.entries(currentPlans).forEach(([phaseKey, phase]) => {
    result[phaseKey] = {
      ...phase,
      totalBudget: 0,
      objectives: phase.objectives.map((obj) => ({
        ...obj,
        totalBudget: 0,
        activities: [],
      })),
    };
  });
  return result;
}

