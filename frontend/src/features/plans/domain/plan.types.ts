export type PhaseType = 'investigacion' | 'encarnacion' | 'evangelizacion' | 'entrenamiento' | 'autocuidado';
export type ActivityState = 'Pendiente' | 'Iniciado' | 'En Proceso' | 'Completado';
export type EssentialArea = 'Investigación' | 'Encarnación' | 'Evangelización' | 'Entrenamiento' | 'Autocuidado';
export type AreaLevel = string;

export type ActivityStage =
  | 'Contacto'
  | 'Comunicar'
  | 'Respuesta'
  | 'Reunirse'
  | 'Consolidar'
  | 'Liderazgo'
  | 'Desarrollo eclesial'
  | 'Auto-cuidado'
  | 'General';

export const STAGES_BY_AREA: Record<EssentialArea, readonly ActivityStage[]> = {
  Investigación: ['Contacto'],
  Encarnación: ['Contacto', 'Comunicar', 'Respuesta'],
  Evangelización: ['Respuesta', 'Reunirse', 'Consolidar'],
  Entrenamiento: ['Consolidar', 'Liderazgo', 'Desarrollo eclesial'],
  Autocuidado: ['Auto-cuidado'],
};

export const PHASE_TO_AREA: Record<PhaseType, EssentialArea> = {
  investigacion: 'Investigación',
  encarnacion: 'Encarnación',
  evangelizacion: 'Evangelización',
  entrenamiento: 'Entrenamiento',
  autocuidado: 'Autocuidado',
};

export interface Activity {
  id: string;
  state: ActivityState;
  stage: string;
  objectiveNumber: number;
  description: string;
  currentSituation: string;
  essentialArea?: EssentialArea;
  areaLevel?: AreaLevel;
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
  totalBudget: number;
  monthlyBudget?: Record<number, number>; // Desglose presupuestal por mes (1 a 12)
  obstacles?: string;
}

export interface SpecialExpense {
  id: string;
  teamId: string;
  objectiveNumber?: number;
  name: string;
  description: string;
  budget: number;
  area: string;
  createdAt?: string;
}

export interface Objective {
  number: number;
  title: string;
  description: string;
  essentialArea?: EssentialArea;
  stage?: string;
  areaLevel?: AreaLevel;
  mediumTermGoal?: string;
  longTermGoal?: string;
  shortTermGoal?: string;
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
  isLocked?: boolean;
  status?: 'DRAFT' | 'FINISHED';
  currentYear?: number;
  isYearClosed?: boolean;
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
