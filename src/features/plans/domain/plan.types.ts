/**
 * Modelo de Dominio Puro (DDD) para el Plan de Desarrollo Ministerial (PDM)
 * Capa de Dominio: Cero dependencias externas.
 */

export type PhaseType = 'investigacion' | 'encarnacion' | 'evangelizacion' | 'entrenamiento' | 'autocuidado';

export type ActivityState = 'Pendiente' | 'En Proceso' | 'Completado';

export interface Activity {
  id: string;
  state: ActivityState;
  stage: string;
  objectiveNumber: 1 | 2 | 3 | 4;
  description: string;
  currentSituation: string;
  shortTermGoal?: string;
  mediumTermGoal: string;
  longTermGoal: string;
  responsible: string;
  frequency: string;
  timesPerYear: number;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  remainingWeeks: number;
  unitBudget: number;
  totalBudget: number; // Calculado automáticamente: unitBudget * timesPerYear
  obstacles: string;
}

export interface Objective {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  activities: Activity[];
}

export interface PhasePlan {
  phaseId: PhaseType;
  phaseName: string;
  startDate: string;
  teamName: string;
  teamMembers: string[];
  teamLeader: string;
  objectives: Objective[];
}

export interface PlanMetrics {
  totalBudget: number;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  pendingActivities: number;
  progressPercentage: number;
  totalRemainingWeeks: number;
}
