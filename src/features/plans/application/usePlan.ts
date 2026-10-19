import { useState, useMemo } from 'react';
import type { PhasePlan, Activity, PhaseType, PlanMetrics } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { calculatePlanMetrics } from './planCalculations';
import { applyUpdateActivity, applyAddActivity, applyDeleteActivity } from './planActivityActions';
import { applyUpdateObjective, applyAddObjective, applyDeleteObjective } from './planObjectiveActions';
import { usePlanStorage } from './usePlanStorage';

import { logPlanAudit, logActivityUpdateAudit } from './planAuditHelper';

export const usePlan = (
  defaultPhaseId: PhaseType = 'investigacion',
  teamId: string = 'team-wayuu',
  teamData?: Partial<TeamSupervisionSummary>
) => {
  const [activePhaseId, setActivePhaseId] = useState<PhaseType>(defaultPhaseId);
  const { allPlans, setAllPlans, resetToDefaults } = usePlanStorage(teamId, teamData);
  const leader = teamData?.leader || 'Líder';

  const plan: PhasePlan = useMemo(
    () => allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId],
    [allPlans, activePhaseId]
  );

  const updateActivity = (activityId: string, updatedFields: Partial<Activity>) => {
    setAllPlans((prev) => ({
      ...prev,
      [activePhaseId]: applyUpdateActivity(prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId], activityId, updatedFields),
    }));
    logActivityUpdateAudit(teamId, leader, updatedFields, activePhaseId);
  };

  const addActivity = (objNum: 1 | 2 | 3 | 4, newAct: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => {
    setAllPlans((prev) => ({
      ...prev,
      [activePhaseId]: applyAddActivity(prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId], objNum, newAct),
    }));
    logPlanAudit(teamId, leader, 'activity_add', 'Agregó nueva actividad', newAct.description.slice(0, 40), activePhaseId);
  };

  const deleteActivity = (activityId: string) => {
    setAllPlans((prev) => ({
      ...prev,
      [activePhaseId]: applyDeleteActivity(prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId], activityId),
    }));
    logPlanAudit(teamId, leader, 'activity_delete', 'Eliminó actividad', `Actividad eliminada de fase ${activePhaseId}`, activePhaseId);
  };

  const updateObjective = (objNum: 1 | 2 | 3 | 4, updates: { title?: string; description?: string }) => {
    setAllPlans((prev) => ({
      ...prev,
      [activePhaseId]: applyUpdateObjective(prev[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId], objNum, updates),
    }));
    logPlanAudit(teamId, leader, 'objective_update', 'Modificó objetivo PDM', updates.title || `Objetivo ${objNum}`, activePhaseId);
  };

  const addObjective = (newObj: { title: string; description: string }): 1 | 2 | 3 | 4 | null => {
    const cur = allPlans[activePhaseId] || INITIAL_PLANS_BY_PHASE[activePhaseId];
    const result = applyAddObjective(cur, newObj);
    if (!result) return null;
    setAllPlans((prev) => ({ ...prev, [activePhaseId]: result.updatedPlan }));
    logPlanAudit(teamId, leader, 'objective_add', 'Agregó objetivo PDM', newObj.title, activePhaseId);
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
