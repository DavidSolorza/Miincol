import type { PhasePlan, PlanMetrics } from '../domain/plan.types';
import { HierarchicalPlanCalculator } from '../domain/hierarchical-plan.calculator';

// Delega el calculo de metricas consolidadas al calculador jerarquico (POO & DRY)
export const calculatePlanMetrics = (plan: PhasePlan): PlanMetrics => {
  return HierarchicalPlanCalculator.calculatePhaseMetrics(plan);
};

// Calcula el presupuesto total planeado a traves de todos los pilares
export const calculateTotalPlannedBudget = (allPlans: Record<string, PhasePlan>): number => {
  return HierarchicalPlanCalculator.calculateGlobalPlannedBudget(allPlans);
};
