import type { PhaseType } from '../../plans/domain/plan.types';

export type TeamHealthStatus = 'Optimo' | 'Atención' | 'Crítico';

export interface TeamSupervisionSummary {
  id: string;
  name: string;
  ethnicity: string;
  region: string;
  department: string;
  leader: string;
  leaderPhone: string;
  membersCount: number;
  currentPhaseId: PhaseType;
  currentPhaseName: string;
  progressPercentage: number;
  totalBudget: number;
  executedBudget: number;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  pendingActivities: number;
  activeInitiatives: {
    title: string;
    responsible: string;
    state: 'Pendiente' | 'En Proceso' | 'Completado';
  }[];
  criticalAlert?: {
    type: 'Logística' | 'Salud' | 'Seguridad' | 'Institucional';
    message: string;
    reportedAt: string;
  };
  healthStatus: TeamHealthStatus;
  lastUpdate: string;
}

export interface NationalKpis {
  totalTeams: number;
  totalMissionaries: number;
  totalNationalBudget: number;
  totalExecutedBudget: number;
  nationalAverageProgress: number;
  activeCriticalAlerts: number;
  totalActivities: number;
  completedActivities: number;
}
