import type { PhasePlan, PlanMetrics, Objective, Activity } from './plan.types';

// Calculador jerarquico con POO y metodos puros para agregacion de metricas de planes PDM
export class HierarchicalPlanCalculator {
  // Suma recursiva del presupuesto de todas las actividades de un objetivo
  static calculateObjectiveBudget(objective: Objective): number {
    return objective.activities.reduce((acc, act) => acc + (Number(act.totalBudget) || 0), 0);
  }

  // Suma jerarquica del presupuesto total de una fase
  static calculatePhaseBudget(phase: PhasePlan): number {
    return phase.objectives.reduce((acc, obj) => acc + this.calculateObjectiveBudget(obj), 0);
  }

  // Suma jerarquica del presupuesto planeado a traves de todos los pilares
  static calculateGlobalPlannedBudget(allPlans: Record<string, PhasePlan>): number {
    return Object.values(allPlans).reduce((acc, phase) => acc + this.calculatePhaseBudget(phase), 0);
  }

  // Conteo de actividades y estado de ejecucion de una fase
  static calculateActivitiesSummary(phase: PhasePlan): {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    progressPercentage: number;
  } {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;

    phase.objectives.forEach((obj) => {
      obj.activities.forEach((act) => {
        total += 1;
        if (act.state === 'Completado') completed += 1;
        else if (act.state === 'En Proceso') inProgress += 1;
        else pending += 1;
      });
    });

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, pending, progressPercentage };
  }

  // Consolida las metricas completas requeridas por la vista PDM
  static calculatePhaseMetrics(phase: PhasePlan): PlanMetrics {
    const totalBudget = this.calculatePhaseBudget(phase);
    const summary = this.calculateActivitiesSummary(phase);
    let totalRemainingWeeks = 0;

    phase.objectives.forEach((obj) => {
      obj.activities.forEach((act) => {
        totalRemainingWeeks += Number(act.remainingWeeks) || 0;
      });
    });

    return {
      totalBudget,
      totalActivities: summary.total,
      completedActivities: summary.completed,
      inProgressActivities: summary.inProgress,
      pendingActivities: summary.pending,
      progressPercentage: summary.progressPercentage,
      totalRemainingWeeks,
    };
  }
}

