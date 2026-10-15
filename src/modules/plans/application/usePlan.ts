import { useState, useMemo } from 'react';
import type { PhasePlan, Activity, PhaseType, PlanMetrics } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { calculatePlanMetrics } from './planCalculations';
import { applyUpdateActivity, applyAddActivity, applyDeleteActivity } from './planActivityActions';
import { applyUpdateObjective, applyAddObjective, applyDeleteObjective } from './planObjectiveActions';
import { usePlanStorage } from './usePlanStorage';

export const usePlan = (
  defaultPhaseId: PhaseType = 'investigacion',
  teamId: string = 'team-wayuu',
  teamData?: Partial<TeamSupervisionSummary>
) => {
  const [activePhaseId, setActivePhaseId] = useState<PhaseType>(defaultPhaseId);
  const { allPlans, setAllPlans, resetToDefaults } = usePlanStorage(teamId, teamData);

  const plan: PhasePlan = useMemo(
    () => allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId],
    [allPlans, activePhaseId]
  );

  const updateActivity = (activityId: string, updatedFields: Partial<Activity>) => {
    setAllPlans((prev) => {
      const cur = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      return { ...prev, [activePhaseId]: applyUpdateActivity(cur, activityId, updatedFields) };
    });
  };

  const addActivity = (
    objNum: 1 | 2 | 3 | 4,
    newAct: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>
  ) => {
    setAllPlans((prev) => {
      const cur = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      return { ...prev, [activePhaseId]: applyAddActivity(cur, objNum, newAct) };
    });
  };

  const deleteActivity = (activityId: string) => {
    setAllPlans((prev) => {
      const cur = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      return { ...prev, [activePhaseId]: applyDeleteActivity(cur, activityId) };
    });
  };

  const updateObjective = (
    objNum: 1 | 2 | 3 | 4,
    updates: { title?: string; description?: string }
  ) => {
    setAllPlans((prev) => {
      const cur = prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
      return { ...prev, [activePhaseId]: applyUpdateObjective(cur, objNum, updates) };
    });
  };

  const addObjective = (newObj: { title: string; description: string }): 1 | 2 | 3 | 4 | null => {
    const cur = allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
    const result = applyAddObjective(cur, newObj);
    if (!result) return null;
    setAllPlans((prev) => ({ ...prev, [activePhaseId]: result.updatedPlan }));
    return result.nextNumber;
  };

  const deleteObjective = (objNum: 1 | 2 | 3 | 4): boolean => {
    const cur = allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
    const updated = applyDeleteObjective(cur, objNum);
    if (!updated) return false;
    setAllPlans((prev) => ({ ...prev, [activePhaseId]: updated }));
    return true;
  };

  const metrics: PlanMetrics = useMemo(() => calculatePlanMetrics(plan), [plan]);

  return {
    plan,
    allPlans,
    activePhaseId,
    metrics,
    switchPhase: (phaseId: PhaseType) => setActivePhaseId(phaseId),
    updateActivity,
    addActivity,
    deleteActivity,
    updateObjective,
    addObjective,
    deleteObjective,
    resetToDefaults,
  };
};
