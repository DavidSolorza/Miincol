import type { PhasePlan, Activity } from '../domain/plan.types';

export const applyUpdateActivity = (
  currentPlan: PhasePlan,
  activityId: string,
  updatedFields: Partial<Activity>
): PhasePlan => {
  const updatedObjectives = currentPlan.objectives.map((obj) => {
    const updatedActivities = obj.activities.map((act) => {
      if (act.id !== activityId) return act;
      const merged = { ...act, ...updatedFields };
      if ('unitBudget' in updatedFields || 'timesPerYear' in updatedFields) {
        const unit = typeof merged.unitBudget === 'number' ? merged.unitBudget : 0;
        const times = typeof merged.timesPerYear === 'number' ? merged.timesPerYear : 0;
        merged.totalBudget = Math.max(0, unit * times);
      }
      return merged;
    });
    return { ...obj, activities: updatedActivities };
  });

  return { ...currentPlan, objectives: updatedObjectives };
};

export const applyAddActivity = (
  currentPlan: PhasePlan,
  objectiveNumber: 1 | 2 | 3 | 4,
  newActivity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>
): PhasePlan => {
  const unit = Number(newActivity.unitBudget) || 0;
  const times = Number(newActivity.timesPerYear) || 1;
  const createdActivity: Activity = {
    ...newActivity,
    id: `act-${Date.now()}`,
    objectiveNumber,
    unitBudget: unit,
    timesPerYear: times,
    totalBudget: unit * times,
  };

  const updatedObjectives = currentPlan.objectives.map((obj) => {
    if (obj.number === objectiveNumber) {
      return { ...obj, activities: [createdActivity, ...obj.activities] };
    }
    return obj;
  });

  return { ...currentPlan, objectives: updatedObjectives };
};

export const applyDeleteActivity = (
  currentPlan: PhasePlan,
  activityId: string
): PhasePlan => {
  const updatedObjectives = currentPlan.objectives.map((obj) => ({
    ...obj,
    activities: obj.activities.filter((act) => act.id !== activityId),
  }));

  return { ...currentPlan, objectives: updatedObjectives };
};
