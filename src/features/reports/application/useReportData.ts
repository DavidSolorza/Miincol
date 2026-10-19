import { useMemo } from 'react';
import type { PhasePlan } from '../../plans/domain/plan.types';

export const useReportData = (plan: PhasePlan) => {
  return useMemo(() => {
    let totalBudget = 0;
    let totalActivities = 0;
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;

    const objectivesSummary = plan.objectives.map((obj) => {
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
  }, [plan]);
};
