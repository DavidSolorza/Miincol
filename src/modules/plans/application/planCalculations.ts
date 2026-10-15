import type { PhasePlan, PlanMetrics } from '../domain/plan.types';

export const calculatePlanMetrics = (plan: PhasePlan): PlanMetrics => {
  let totalBudget = 0;
  let totalActivities = 0;
  let completedActivities = 0;
  let inProgressActivities = 0;
  let pendingActivities = 0;
  let totalRemainingWeeks = 0;

  plan.objectives.forEach((obj) => {
    obj.activities.forEach((act) => {
      totalActivities += 1;
      totalBudget += act.totalBudget || 0;
      totalRemainingWeeks += act.remainingWeeks || 0;

      if (act.state === 'Completado') {
        completedActivities += 1;
      } else if (act.state === 'En Proceso') {
        inProgressActivities += 1;
      } else {
        pendingActivities += 1;
      }
    });
  });

  const progressPercentage =
    totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  return {
    totalBudget,
    totalActivities,
    completedActivities,
    inProgressActivities,
    pendingActivities,
    progressPercentage,
    totalRemainingWeeks,
  };
};
