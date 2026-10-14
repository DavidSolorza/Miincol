import { useState, useMemo, useEffect } from 'react';
import type { PhasePlan, Objective, Activity, PhaseType, PlanMetrics } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { PASTOS_PLANS_BY_PHASE } from './pastosPlanData';

// Generador de plantillas PDM aisladas para nuevos equipos
const createCustomPlanForTeam = (
  teamId: string,
  teamData?: Partial<TeamSupervisionSummary>
): Record<string, PhasePlan> => {
  const teamName = teamData?.name || `Misión ${teamId}`;
  const teamLeader = teamData?.leader || 'Pastor Líder';
  const teamMembers =
    teamData?.members && teamData.members.length > 0
      ? teamData.members
      : [teamLeader, 'Obrero de campo'];
  const ethnicity = teamData?.ethnicity || 'Indígena';
  const region = teamData?.region || 'Territorio ancestral';

  const base: Record<string, PhasePlan> = JSON.parse(JSON.stringify(INITIAL_PLANS_BY_PHASE));

  Object.keys(base).forEach((key) => {
    base[key].teamName = teamName;
    base[key].teamLeader = teamLeader;
    base[key].teamMembers = teamMembers;

    // Adaptar textos del primer objetivo al pueblo indígena correspondiente
    if (base[key].objectives && base[key].objectives[0]) {
      base[key].objectives[0].description = `Diagnóstico situacional, inmersión y mapeo de comunidades en el pueblo ${ethnicity} en ${region}.`;
    }
  });

  return base;
};

export const usePlan = (
  defaultPhaseId: PhaseType = 'investigacion',
  teamId: string = 'team-wayuu',
  teamData?: Partial<TeamSupervisionSummary>
) => {
  const [activePhaseId, setActivePhaseId] = useState<PhaseType>(defaultPhaseId);
  const storageKey = `misincol_pdm_plans_${teamId}`;

  // Carga inicial desde localStorage por equipo si existe, o genera plantilla aislada
  const [allPlans, setAllPlans] = useState<Record<string, PhasePlan>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error al cargar plan de localStorage para equipo:', teamId, e);
    }

    if (teamId === 'team-wayuu') {
      return INITIAL_PLANS_BY_PHASE;
    }
    if (teamId === 'team-pastos') {
      return PASTOS_PLANS_BY_PHASE;
    }
    return createCustomPlanForTeam(teamId, teamData);
  });

  // Re-sincronizar planes cuando cambie el teamId
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setAllPlans(JSON.parse(saved));
        return;
      }
    } catch {
      // Ignorar fallback
    }

    if (teamId === 'team-wayuu') {
      setAllPlans(INITIAL_PLANS_BY_PHASE);
    } else if (teamId === 'team-pastos') {
      setAllPlans(PASTOS_PLANS_BY_PHASE);
    } else {
      setAllPlans(createCustomPlanForTeam(teamId, teamData));
    }
  }, [teamId, storageKey]);

  // Guardar en localStorage cada vez que cambien los planes del equipo
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(allPlans));
    } catch (e) {
      console.warn('No se pudo guardar en almacenamiento local:', e);
    }
  }, [allPlans, storageKey]);

  // Plan activo actual
  const plan: PhasePlan = useMemo(() => {
    return allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
  }, [allPlans, activePhaseId]);

  // Actualizar una actividad específica con un solo clic (Inline edit)
  const updateActivity = (activityId: string, updatedFields: Partial<Activity>) => {
    setAllPlans((prev) => {
      const currentPlan = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      const updatedObjectives = currentPlan.objectives.map((obj) => {
        const updatedActivities = obj.activities.map((act) => {
          if (act.id === activityId) {
            const merged = { ...act, ...updatedFields };

            // Recálculo automático de presupuesto total si cambia el unitario o las veces por año
            if ('unitBudget' in updatedFields || 'timesPerYear' in updatedFields) {
              const unit = typeof merged.unitBudget === 'number' ? merged.unitBudget : 0;
              const times = typeof merged.timesPerYear === 'number' ? merged.timesPerYear : 0;
              merged.totalBudget = Math.max(0, unit * times);
            }

            return merged;
          }
          return act;
        });
        return { ...obj, activities: updatedActivities };
      });

      return {
        ...prev,
        [activePhaseId]: {
          ...currentPlan,
          objectives: updatedObjectives,
        },
      };
    });
  };

  // Agregar una nueva actividad dentro de un objetivo específico
  const addActivity = (
    objectiveNumber: 1 | 2 | 3 | 4,
    newActivity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>
  ) => {
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

    setAllPlans((prev) => {
      const currentPlan = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      const updatedObjectives = currentPlan.objectives.map((obj) => {
        if (obj.number === objectiveNumber) {
          return {
            ...obj,
            activities: [createdActivity, ...obj.activities],
          };
        }
        return obj;
      });

      return {
        ...prev,
        [activePhaseId]: {
          ...currentPlan,
          objectives: updatedObjectives,
        },
      };
    });
  };

  // Eliminar una actividad
  const deleteActivity = (activityId: string) => {
    setAllPlans((prev) => {
      const currentPlan = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      const updatedObjectives = currentPlan.objectives.map((obj) => {
        return {
          ...obj,
          activities: obj.activities.filter((act) => act.id !== activityId),
        };
      });

      return {
        ...prev,
        [activePhaseId]: {
          ...currentPlan,
          objectives: updatedObjectives,
        },
      };
    });
  };

  // Actualizar título y/o descripción de un objetivo estratégico existente
  const updateObjective = (
    objectiveNumber: 1 | 2 | 3 | 4,
    updates: { title?: string; description?: string }
  ) => {
    setAllPlans((prev) => {
      const currentPlan = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      const updatedObjectives = currentPlan.objectives.map((obj) => {
        if (obj.number === objectiveNumber) {
          return {
            ...obj,
            title: updates.title !== undefined ? updates.title.trim() : obj.title,
            description: updates.description !== undefined ? updates.description.trim() : obj.description,
          };
        }
        return obj;
      });

      return {
        ...prev,
        [activePhaseId]: {
          ...currentPlan,
          objectives: updatedObjectives,
        },
      };
    });
  };

  // Crear un nuevo objetivo estratégico (Cota Máxima: 4 objetivos por fase)
  const addObjective = (newObj: { title: string; description: string }): 1 | 2 | 3 | 4 | null => {
    const currentPlan = allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
    if (currentPlan.objectives.length >= 4) {
      console.warn('Límite alcanzado: Máximo 4 objetivos permitidos por fase ministerial.');
      return null;
    }

    // Encontrar el primer número disponible entre 1, 2, 3, 4
    const usedNumbers = new Set(currentPlan.objectives.map((o) => o.number));
    const availableNumbers: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
    const nextNumber = availableNumbers.find((n) => !usedNumbers.has(n));

    if (!nextNumber) {
      return null;
    }

    const createdObjective: Objective = {
      number: nextNumber,
      title: newObj.title.trim() || `Objetivo #${nextNumber}`,
      description: newObj.description.trim(),
      activities: [],
    };

    setAllPlans((prev) => {
      const planToUpdate = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      const mergedObjectives = [...planToUpdate.objectives, createdObjective].sort(
        (a, b) => a.number - b.number
      );

      return {
        ...prev,
        [activePhaseId]: {
          ...planToUpdate,
          objectives: mergedObjectives,
        },
      };
    });

    return nextNumber;
  };

  // Eliminar un objetivo estratégico (Mínimo debe existir 1 por fase)
  const deleteObjective = (objectiveNumber: 1 | 2 | 3 | 4): boolean => {
    const currentPlan = allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
    if (currentPlan.objectives.length <= 1) {
      console.warn('Regla de negocio: Debe existir al menos 1 objetivo estratégico por fase.');
      return false;
    }

    setAllPlans((prev) => {
      const planToUpdate = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      const filtered = planToUpdate.objectives.filter((o) => o.number !== objectiveNumber);

      return {
        ...prev,
        [activePhaseId]: {
          ...planToUpdate,
          objectives: filtered,
        },
      };
    });

    return true;
  };

  // Cambiar de fase
  const switchPhase = (phaseId: PhaseType) => {
    setActivePhaseId(phaseId);
  };

  // Resetear a los datos iniciales
  const resetToDefaults = () => {
    if (teamId === 'team-wayuu') {
      setAllPlans(INITIAL_PLANS_BY_PHASE);
    } else if (teamId === 'team-pastos') {
      setAllPlans(PASTOS_PLANS_BY_PHASE);
    } else {
      setAllPlans(createCustomPlanForTeam(teamId, teamData));
    }
    localStorage.removeItem(storageKey);
  };

  // Métricas y KPIs de la Fase Actual
  const metrics: PlanMetrics = useMemo(() => {
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
  }, [plan]);

  return {
    plan,
    allPlans,
    activePhaseId,
    metrics,
    switchPhase,
    updateActivity,
    addActivity,
    deleteActivity,
    updateObjective,
    addObjective,
    deleteObjective,
    resetToDefaults,
  };
};
