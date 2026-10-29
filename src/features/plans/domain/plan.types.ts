/**
 * Modelo de Dominio Puro (DDD) para el Plan de Desarrollo Ministerial (PDM)
 * Capa de Dominio: Cero dependencias externas.
 */

// Tipos de fases ministeriales disponibles en el PDM
export type PhaseType = 'investigacion' | 'encarnacion' | 'evangelizacion' | 'entrenamiento' | 'autocuidado';

// Estados posibles de ejecución de una actividad
export type ActivityState = 'Pendiente' | 'En Proceso' | 'Completado';

// Entidad de dominio que representa una actividad ministerial
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

// Entidad que agrupa un objetivo estratégico y sus actividades asociadas
export interface Objective {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  activities: Activity[];
}

// Estructura completa del plan ministerial para una fase específica
export interface PhasePlan {
  phaseId: PhaseType;
  phaseName: string;
  startDate: string;
  teamName: string;
  teamMembers: string[];
  teamLeader: string;
  objectives: Objective[];
}

// Indicadores y métricas consolidadas de avance y presupuesto de un plan
export interface PlanMetrics {
  totalBudget: number;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  pendingActivities: number;
  progressPercentage: number;
  totalRemainingWeeks: number;
}
