// Función pura que calcula los KPIs nacionales (misioneros, presupuesto, avance y alertas)
import type { TeamSupervisionSummary, NationalKpis } from '../domain/admin.types';

export const calculateNationalKpis = (teams: TeamSupervisionSummary[]): NationalKpis => { // Agrega métricas de todos los equipos activos
  let totalMissionaries = 0;
  let totalNationalBudget = 0;
  let totalExecutedBudget = 0;
  let totalActivities = 0;
  let completedActivities = 0;
  let activeCriticalAlerts = 0;
  let totalProgressSum = 0;

  teams.forEach((team) => {
    totalMissionaries += team.membersCount;
    totalNationalBudget += team.totalBudget;
    totalExecutedBudget += team.executedBudget;
    totalActivities += team.totalActivities;
    completedActivities += team.completedActivities;
    totalProgressSum += team.progressPercentage;
    if (team.criticalAlert) activeCriticalAlerts += 1;
  });

  const totalTeams = teams.length;
  const nationalAverageProgress = totalTeams > 0 ? Math.round(totalProgressSum / totalTeams) : 0;

  return {
    totalTeams,
    totalMissionaries,
    totalNationalBudget,
    totalExecutedBudget,
    nationalAverageProgress,
    activeCriticalAlerts,
    totalActivities,
    completedActivities,
  };
};
