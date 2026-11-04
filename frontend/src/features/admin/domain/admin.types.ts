// Contratos y tipos de dominio para supervisión nacional, misiones territoriales y KPIs
import type { PhaseType } from '../../plans/domain/plan.types';

export type TeamHealthStatus = 'Optimo' | 'Atención' | 'Crítico'; // Estado de salud operativa del equipo

export interface TeamInitiative {
  title: string;
  responsible: string;
  state: 'Pendiente' | 'En Proceso' | 'Completado';
  objectiveNumber?: 1 | 2 | 3 | 4;
  objectiveTitle?: string;
  stage?: string;
}

export interface TeamSupervisionSummary { // Resumen consolidado de supervisión por equipo misionero
  id: string;
  slug?: string;
  name: string;
  ethnicity: string;
  region: string;
  department: string;
  leader: string;
  leaderPhone: string;
  membersCount: number;
  members?: string[];
  currentPhaseId: PhaseType;
  currentPhaseName: string;
  progressPercentage: number;
  totalBudget: number;
  executedBudget: number;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  pendingActivities: number;
  themeColor: string;
  activeInitiatives: TeamInitiative[];
  criticalAlert?: {
    type: 'Logística' | 'Salud' | 'Seguridad' | 'Institucional';
    message: string;
    reportedAt: string;
  };
  healthStatus: TeamHealthStatus;
  coordinates?: { lat: number; lng: number };
  lastUpdate: string;
  accessPin?: string;
}

export interface CreateTeamDto { // DTO para registrar o actualizar una misión territorial
  name: string;
  ethnicity: string;
  region: string;
  department: string;
  leader: string;
  leaderPhone: string;
  members?: string[];
  currentPhaseId: PhaseType;
  totalBudget: number;
  themeColor: string;
  healthStatus: TeamHealthStatus;
  slug?: string;
  criticalAlertMessage?: string;
  criticalAlertType?: 'Logística' | 'Salud' | 'Seguridad' | 'Institucional';
  coordinates?: { lat: number; lng: number };
  accessPin?: string;
}

export interface NationalKpis { // Indicadores clave de desempeño (KPIs) consolidados a nivel nacional
  totalTeams: number;
  totalMissionaries: number;
  totalNationalBudget: number;
  totalExecutedBudget: number;
  nationalAverageProgress: number;
  activeCriticalAlerts: number;
  totalActivities: number;
  completedActivities: number;
}
