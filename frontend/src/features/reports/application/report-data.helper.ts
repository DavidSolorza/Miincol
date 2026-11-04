import type { PhasePlan, Activity } from '../../plans/domain/plan.types';

// Resumen de un objetivo estratégico con el conteo de sus actividades y presupuesto
export interface ReportObjectiveSummary {
  number: number;
  title: string;
  description: string;
  totalBudget: number;
  activitiesCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  activities: Activity[];
}

// Modelo de datos completo requerido para renderizar e imprimir el informe ejecutivo
export interface ReportData {
  teamName: string;
  teamLeader: string;
  teamMembers: string[];
  phaseName: string;
  startDate: string;
  totalBudget: number;
  totalActivities: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  progressPercentage: number;
  objectivesSummary: ReportObjectiveSummary[];
  generatedAt: string;
}

// Construye y consolida todas las métricas presupuestales y de avance a partir de un PhasePlan
export const buildReportData = (plan: PhasePlan): ReportData => {
  let totalBudget = 0;
  let totalActivities = 0;
  let completedCount = 0;
  let inProgressCount = 0;
  let pendingCount = 0;

  const objectivesSummary: ReportObjectiveSummary[] = plan.objectives.map((obj) => {
    const objBudget = obj.activities.reduce((sum, a) => sum + (a.totalBudget || 0), 0);
    const objCompleted = obj.activities.filter((a) => a.state === 'Completado').length;
    const objInProgress = obj.activities.filter((a) => a.state === 'En Proceso').length;
    const objPending = obj.activities.filter((a) => a.state === 'Pendiente').length;

    totalBudget += objBudget;
    totalActivities += obj.activities.length;
    completedCount += objCompleted;
    inProgressCount += objInProgress;
    pendingCount += objPending;

    return {
      number: obj.number,
      title: obj.title,
      description: obj.description,
      totalBudget: objBudget,
      activitiesCount: obj.activities.length,
      completedCount: objCompleted,
      inProgressCount: objInProgress,
      pendingCount: objPending,
      activities: obj.activities,
    };
  });

  const progressPercentage =
    totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;

  return {
    teamName: plan.teamName,
    teamLeader: plan.teamLeader,
    teamMembers: plan.teamMembers,
    phaseName: plan.phaseName,
    startDate: plan.startDate,
    totalBudget,
    totalActivities,
    completedCount,
    inProgressCount,
    pendingCount,
    progressPercentage,
    objectivesSummary,
    generatedAt: new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
};

