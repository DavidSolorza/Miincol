import { Injectable, signal, computed } from '@angular/core';
import type { PhasePlan, Activity, PhaseType, PlanMetrics } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { calculatePlanMetrics } from './planCalculations';
import { applyUpdateActivity, applyAddActivity, applyDeleteActivity } from './planActivityActions';
import { applyUpdateObjective, applyAddObjective, applyDeleteObjective } from './planObjectiveActions';
import { getPlansForTeam } from './teamPhaseMetrics';
import { logPlanAudit, logActivityUpdateAudit } from './planAuditHelper';

@Injectable({ providedIn: 'root' })
export class PlanService {
  readonly activePhaseId = signal<PhaseType>('investigacion');
  readonly activeTeamId = signal<string>('team-wayuu');
  readonly activeLeader = signal<string>('Líder');
  readonly allPlans = signal<Record<string, PhasePlan>>(getPlansForTeam('team-wayuu'));

  readonly plan = computed<PhasePlan>(() => {
    const phaseId = this.activePhaseId();
    return this.allPlans()[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
  });

  readonly metrics = computed<PlanMetrics>(() => calculatePlanMetrics(this.plan()));

  loadTeamPlans(teamId: string, teamData?: Partial<TeamSupervisionSummary>): void {
    this.activeTeamId.set(teamId);
    this.activeLeader.set(teamData?.leader || 'Líder');
    this.allPlans.set(getPlansForTeam(teamId, teamData));
  }

  private persistPlans(updated: Record<string, PhasePlan>): void {
    this.allPlans.set(updated);
    const storageKey = `misincol_pdm_plans_${this.activeTeamId()}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('No se pudo guardar en almacenamiento local:', e);
    }
  }

  switchPhase(phaseId: PhaseType): void {
    this.activePhaseId.set(phaseId);
  }

  updateActivity(activityId: string, updatedFields: Partial<Activity>): void {
    const phaseId = this.activePhaseId();
    const prev = this.allPlans();
    const cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    this.persistPlans({
      ...prev,
      [phaseId]: applyUpdateActivity(cur, activityId, updatedFields),
    });
    logActivityUpdateAudit(this.activeTeamId(), this.activeLeader(), updatedFields, phaseId);
  }

  addActivity(objNum: 1 | 2 | 3 | 4, newAct: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>): void {
    const phaseId = this.activePhaseId();
    const prev = this.allPlans();
    const cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    this.persistPlans({
      ...prev,
      [phaseId]: applyAddActivity(cur, objNum, newAct),
    });
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'activity_add', 'Agregó nueva actividad', newAct.description.slice(0, 40), phaseId);
  }

  deleteActivity(activityId: string): void {
    const phaseId = this.activePhaseId();
    const prev = this.allPlans();
    const cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    this.persistPlans({
      ...prev,
      [phaseId]: applyDeleteActivity(cur, activityId),
    });
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'activity_delete', 'Eliminó actividad', `Actividad eliminada de fase ${phaseId}`, phaseId);
  }

  updateObjective(objNum: 1 | 2 | 3 | 4, updates: { title?: string; description?: string }): void {
    const phaseId = this.activePhaseId();
    const prev = this.allPlans();
    const cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    this.persistPlans({
      ...prev,
      [phaseId]: applyUpdateObjective(cur, objNum, updates),
    });
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'objective_update', 'Modificó objetivo PDM', updates.title || `Objetivo ${objNum}`, phaseId);
  }

  addObjective(newObj: { title: string; description: string }): 1 | 2 | 3 | 4 | null {
    const phaseId = this.activePhaseId();
    const prev = this.allPlans();
    const cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    const result = applyAddObjective(cur, newObj);
    if (!result) return null;
    this.persistPlans({ ...prev, [phaseId]: result.updatedPlan });
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'objective_add', 'Agregó objetivo PDM', newObj.title, phaseId);
    return result.nextNumber;
  }

  deleteObjective(objNum: 1 | 2 | 3 | 4): boolean {
    const phaseId = this.activePhaseId();
    const prev = this.allPlans();
    const cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    const updated = applyDeleteObjective(cur, objNum);
    if (!updated) return false;
    this.persistPlans({ ...prev, [phaseId]: updated });
    return true;
  }

  resetToDefaults(teamData?: Partial<TeamSupervisionSummary>): void {
    const teamId = this.activeTeamId();
    localStorage.removeItem(`misincol_pdm_plans_${teamId}`);
    this.allPlans.set(getPlansForTeam(teamId, teamData));
  }
}

