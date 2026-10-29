import type { PhasePlan, Activity } from '../domain/plan.types';
import { calculateWeeks } from '../../../shared/utils/formatters';

// Funciones puras para crear, actualizar y eliminar actividades dentro de un plan
// Actualiza una actividad existente, recalculando presupuesto, semanas o cambio de objetivo
export const applyUpdateActivity = (
  currentPlan: PhasePlan,
  activityId: string,
  updatedFields: Partial<Activity>
): PhasePlan => {
  let currentActivity: Activity | null = null;
  for (const obj of currentPlan.objectives) {
    const found = obj.activities.find((a) => a.id === activityId);
    if (found) {
      currentActivity = found;
      break;
    }
  }

  if (!currentActivity) return currentPlan;

  const merged: Activity = { ...currentActivity, ...updatedFields };

  // Recalcula el presupuesto total si cambió el valor unitario o las repeticiones
  if ('unitBudget' in updatedFields || 'timesPerYear' in updatedFields) {
    const unit = typeof merged.unitBudget === 'number' ? merged.unitBudget : 0;
    const times = typeof merged.timesPerYear === 'number' ? merged.timesPerYear : 0;
    merged.totalBudget = Math.max(0, unit * times);
  }

  // Recalcula las semanas totales y restantes si cambiaron las fechas
  if ('startDate' in updatedFields || 'endDate' in updatedFields) {
    const { totalWeeks, remainingWeeks } = calculateWeeks(merged.startDate, merged.endDate);
    merged.totalWeeks = totalWeeks;
    merged.remainingWeeks = remainingWeeks;
  }

  const targetObjectiveNumber = merged.objectiveNumber || currentActivity.objectiveNumber;

  // Si se movió a un objetivo diferente, actualiza las listas de ambos objetivos
  if (targetObjectiveNumber !== currentActivity.objectiveNumber) {
    const updatedObjectives = currentPlan.objectives.map((obj) => {
      if (obj.number === currentActivity!.objectiveNumber) {
        return { ...obj, activities: obj.activities.filter((a) => a.id !== activityId) };
      }
      if (obj.number === targetObjectiveNumber) {
        return { ...obj, activities: [merged, ...obj.activities] };
      }
      return obj;
    });
    return { ...currentPlan, objectives: updatedObjectives };
  }

  // Actualización en el mismo objetivo original
  const updatedObjectives = currentPlan.objectives.map((obj) => {
    const updatedActivities = obj.activities.map((act) => {
      if (act.id !== activityId) return act;
      return merged;
    });
    return { ...obj, activities: updatedActivities };
  });

  return { ...currentPlan, objectives: updatedObjectives };
};

// Inserta una nueva actividad al inicio de la lista del objetivo correspondiente
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

// Elimina una actividad por su identificador de todos los objetivos del plan
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
