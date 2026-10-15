import type { PhasePlan, Objective } from '../domain/plan.types';

export const applyUpdateObjective = (
  currentPlan: PhasePlan,
  objectiveNumber: 1 | 2 | 3 | 4,
  updates: { title?: string; description?: string }
): PhasePlan => {
  const updatedObjectives = currentPlan.objectives.map((obj) => {
    if (obj.number !== objectiveNumber) return obj;
    return {
      ...obj,
      title: updates.title !== undefined ? updates.title.trim() : obj.title,
      description: updates.description !== undefined ? updates.description.trim() : obj.description,
    };
  });

  return { ...currentPlan, objectives: updatedObjectives };
};

export const applyAddObjective = (
  currentPlan: PhasePlan,
  newObj: { title: string; description: string }
): { updatedPlan: PhasePlan; nextNumber: 1 | 2 | 3 | 4 } | null => {
  if (currentPlan.objectives.length >= 4) return null;

  const usedNumbers = new Set(currentPlan.objectives.map((o) => o.number));
  const availableNumbers: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
  const nextNumber = availableNumbers.find((n) => !usedNumbers.has(n));

  if (!nextNumber) return null;

  const createdObjective: Objective = {
    number: nextNumber,
    title: newObj.title.trim() || `Objetivo #${nextNumber}`,
    description: newObj.description.trim(),
    activities: [],
  };

  const mergedObjectives = [...currentPlan.objectives, createdObjective].sort(
    (a, b) => a.number - b.number
  );

  return {
    updatedPlan: { ...currentPlan, objectives: mergedObjectives },
    nextNumber,
  };
};

export const applyDeleteObjective = (
  currentPlan: PhasePlan,
  objectiveNumber: 1 | 2 | 3 | 4
): PhasePlan | null => {
  if (currentPlan.objectives.length <= 1) return null;

  const filtered = currentPlan.objectives.filter((o) => o.number !== objectiveNumber);
  return { ...currentPlan, objectives: filtered };
};
