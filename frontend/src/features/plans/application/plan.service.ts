import { Injectable, signal, computed, inject } from '@angular/core';
import type { PhasePlan, Activity, PhaseType, PlanMetrics, Objective, EssentialArea, AreaLevel } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { calculatePlanMetrics, calculateTotalPlannedBudget } from './planCalculations';
import { applyUpdateActivity, applyAddActivity, applyDeleteActivity } from './planActivityActions';
import { applyUpdateObjective, applyAddObjective, applyDeleteObjective } from './planObjectiveActions';
import { getPlansForTeam } from './teamPhaseMetrics';
import { logPlanAudit, logActivityUpdateAudit } from './planAuditHelper';
import { cleanPlansForNewYear } from './planCycleReset';
import { serviceBus } from '../../../core/bus';
import { OutboxQueueService } from '../../../core/offline/application/outbox-queue.service';
import { queueActivityMutation, queueObjectiveMutation } from './plan-outbox.helper';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly outbox = inject(OutboxQueueService);
  readonly activePhaseId = signal<PhaseType>('investigacion');
  readonly activeTeamId = signal<string>('team-wayuu');
  readonly activeLeader = signal<string>('Líder');
  readonly pendingAssignee = signal<string | null>(null);
  readonly allPlans = signal<Record<string, PhasePlan>>(getPlansForTeam('team-wayuu'));

  constructor() {
    serviceBus.subscribe('cycle:year_changed', (evt) => {
      if (evt.teamId === this.activeTeamId()) this.persistPlans(cleanPlansForNewYear(this.allPlans()));
    });
  }

  readonly plan = computed<PhasePlan>(() => this.allPlans()[this.activePhaseId()] || INITIAL_PLANS_BY_PHASE[this.activePhaseId()]);
  readonly metrics = computed<PlanMetrics>(() => calculatePlanMetrics(this.plan()));
  readonly teamTotalBudget = signal<number>(11210000);
  readonly remainingTeamBudget = computed(() => Math.max(0, this.teamTotalBudget() - calculateTotalPlannedBudget(this.allPlans())));

  loadTeamPlans(teamId: string, teamData?: Partial<TeamSupervisionSummary>): void {
    this.activeTeamId.set(teamId);
    this.activeLeader.set(teamData?.leader || 'Líder');
    if (teamData?.totalBudget) this.teamTotalBudget.set(teamData.totalBudget);
    this.allPlans.set(getPlansForTeam(teamId, teamData));
  }

  private persistPlans(updated: Record<string, PhasePlan>): void {
    this.allPlans.set(updated);
    try { localStorage.setItem(`misincol_pdm_plans_${this.activeTeamId()}`, JSON.stringify(updated)); }
    catch (e) { console.warn('Error al guardar planes localmente:', e); }
  }

  switchPhase(phaseId: PhaseType): void { this.activePhaseId.set(phaseId); }

  updateActivity(activityId: string, updatedFields: Partial<Activity>): void {
    const phaseId = this.activePhaseId(), prev = this.allPlans(), cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    this.persistPlans({ ...prev, [phaseId]: applyUpdateActivity(cur, activityId, updatedFields) });
    queueActivityMutation(this.outbox, 'UPDATE', activityId, this.activeTeamId(), phaseId, updatedFields);
    logActivityUpdateAudit(this.activeTeamId(), this.activeLeader(), updatedFields, phaseId);
  }

  addActivity(objNum: 1 | 2 | 3 | 4, newAct: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>): void {
    const phaseId = this.activePhaseId(), prev = this.allPlans(), cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    const updatedPlan = applyAddActivity(cur, objNum, newAct);
    this.persistPlans({ ...prev, [phaseId]: updatedPlan });
    const createdAct = updatedPlan.objectives.find((o) => o.number === objNum)?.activities[0];
    queueActivityMutation(this.outbox, 'CREATE', createdAct?.id || `act-${Date.now()}`, this.activeTeamId(), phaseId, createdAct);
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'activity_add', 'Agregó nueva actividad', newAct.description.slice(0, 40), phaseId);
  }

  deleteActivity(activityId: string): void {
    const phaseId = this.activePhaseId(), prev = this.allPlans(), cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    this.persistPlans({ ...prev, [phaseId]: applyDeleteActivity(cur, activityId) });
    queueActivityMutation(this.outbox, 'DELETE', activityId, this.activeTeamId(), phaseId);
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'activity_delete', 'Eliminó actividad', `Actividad eliminada de fase ${phaseId}`, phaseId);
  }

  updateObjective(objNum: number, updates: Partial<Objective>): void {
    const phaseId = this.activePhaseId(), prev = this.allPlans(), cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    this.persistPlans({ ...prev, [phaseId]: applyUpdateObjective(cur, objNum, updates) });
    queueObjectiveMutation(this.outbox, 'UPDATE', objNum, this.activeTeamId(), phaseId, updates);
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'objective_update', 'Modificó objetivo PDM', updates.title || `Objetivo ${objNum}`, phaseId);
  }

  addObjective(newObj: { title: string; description: string; essentialArea?: EssentialArea; areaLevel?: AreaLevel; stage?: string; shortTermGoal?: string; mediumTermGoal?: string; longTermGoal?: string }): 1 | 2 | 3 | 4 | null {
    const phaseId = this.activePhaseId(), prev = this.allPlans(), cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    const result = applyAddObjective(cur, newObj);
    if (!result) return null;
    this.persistPlans({ ...prev, [phaseId]: result.updatedPlan });
    queueObjectiveMutation(this.outbox, 'CREATE', result.nextNumber, this.activeTeamId(), phaseId, newObj);
    logPlanAudit(this.activeTeamId(), this.activeLeader(), 'objective_add', 'Agregó objetivo PDM', newObj.title, phaseId);
    return result.nextNumber;
  }

  deleteObjective(objNum: number): boolean {
    const phaseId = this.activePhaseId(), prev = this.allPlans(), cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    const updated = applyDeleteObjective(cur, objNum);
    if (!updated) return false;
    this.persistPlans({ ...prev, [phaseId]: updated });
    queueObjectiveMutation(this.outbox, 'DELETE', objNum, this.activeTeamId(), phaseId);
    return true;
  }

  resetToDefaults(teamData?: Partial<TeamSupervisionSummary>): void {
    const teamId = this.activeTeamId();
    localStorage.removeItem(`misincol_pdm_plans_${teamId}`);
    this.allPlans.set(getPlansForTeam(teamId, teamData));
  }
}
