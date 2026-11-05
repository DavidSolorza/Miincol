import type { PhasePlan, Objective, EssentialArea, AreaLevel } from '../domain/plan.types';

// Modifica campos de un objetivo específico (título, descripción, área esencial, nivel, metas)
export const applyUpdateObjective = (
  currentPlan: PhasePlan,
  objectiveNumber: number,
  updates: Partial<Objective>
): PhasePlan => {
  const updatedObjectives = currentPlan.objectives.map((obj) => {
    if (obj.number !== objectiveNumber) return obj;
    return {
      ...obj,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : obj.title,
      description: updates.description !== undefined ? updates.description.trim() : obj.description,
      shortTermGoal: updates.shortTermGoal !== undefined ? updates.shortTermGoal.trim() : obj.shortTermGoal,
      mediumTermGoal: updates.mediumTermGoal !== undefined ? updates.mediumTermGoal.trim() : obj.mediumTermGoal,
      longTermGoal: updates.longTermGoal !== undefined ? updates.longTermGoal.trim() : obj.longTermGoal,
    };
  });

  return { ...currentPlan, objectives: updatedObjectives };
};

// Agrega un nuevo objetivo con autoenumeración dinámica (1..4)
export const applyAddObjective = (
  currentPlan: PhasePlan,
  newObj: {
    title: string;
    description: string;
    essentialArea?: EssentialArea;
    areaLevel?: AreaLevel;
    stage?: string;
    shortTermGoal?: string;
    mediumTermGoal?: string;
    longTermGoal?: string;
  }
): { updatedPlan: PhasePlan; nextNumber: 1 | 2 | 3 | 4 } | null => {
  if (currentPlan.objectives.length >= 4) return null;

  const nextNumber = (currentPlan.objectives.length + 1) as 1 | 2 | 3 | 4;
  const createdObjective: Objective = {
    number: nextNumber,
    title: newObj.title.trim() || `Objetivo #${nextNumber}`,
    description: newObj.description.trim(),
    essentialArea: newObj.essentialArea,
    areaLevel: newObj.areaLevel,
    stage: newObj.stage?.trim(),
    shortTermGoal: newObj.shortTermGoal?.trim(),
    mediumTermGoal: newObj.mediumTermGoal?.trim(),
    longTermGoal: newObj.longTermGoal?.trim(),
    activities: [],
  };

  const merged = [...currentPlan.objectives, createdObjective].map((o, idx) => ({
    ...o,
    number: (idx + 1) as 1 | 2 | 3 | 4,
    activities: o.activities.map((a) => ({ ...a, objectiveNumber: idx + 1 })),
  }));

  return { updatedPlan: { ...currentPlan, objectives: merged }, nextNumber };
};

// Elimina un objetivo y renombra dinámicamente los índices restantes (2 -> 1, 3 -> 2, etc.)
export const applyDeleteObjective = (
  currentPlan: PhasePlan,
  objectiveNumber: number
): PhasePlan | null => {
  if (currentPlan.objectives.length <= 1) return null;

  const filtered = currentPlan.objectives
    .filter((o) => o.number !== objectiveNumber)
    .map((o, idx) => ({
      ...o,
      number: (idx + 1) as 1 | 2 | 3 | 4,
      activities: o.activities.map((a) => ({ ...a, objectiveNumber: idx + 1 })),
    }));

  return { ...currentPlan, objectives: filtered };
};
