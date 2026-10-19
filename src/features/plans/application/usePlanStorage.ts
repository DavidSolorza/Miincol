import { useState, useEffect } from 'react';
import type { PhasePlan } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { getPlansForTeam } from './teamPhaseMetrics';

export const usePlanStorage = (
  teamId: string = 'team-wayuu',
  teamData?: Partial<TeamSupervisionSummary>
) => {
  const storageKey = `misincol_pdm_plans_${teamId}`;
  const [allPlans, setAllPlans] = useState<Record<string, PhasePlan>>(() =>
    getPlansForTeam(teamId, teamData)
  );

  useEffect(() => {
    setAllPlans(getPlansForTeam(teamId, teamData));
  }, [teamId, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(allPlans));
    } catch (e) {
      console.warn('No se pudo guardar en almacenamiento local:', e);
    }
  }, [allPlans, storageKey]);

  const resetToDefaults = () => {
    localStorage.removeItem(storageKey);
    setAllPlans(getPlansForTeam(teamId, teamData));
  };

  return { allPlans, setAllPlans, resetToDefaults };
};
