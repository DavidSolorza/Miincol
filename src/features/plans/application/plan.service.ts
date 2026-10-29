import { Injectable, signal, computed } from '@angular/core';
import type { PhasePlan, Activity, PhaseType, PlanMetrics } from '../domain/plan.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { INITIAL_PLANS_BY_PHASE } from './mockPlanData';
import { calculatePlanMetrics } from './planCalculations';
import { applyUpdateActivity, applyAddActivity, applyDeleteActivity } from './planActivityActions';
import { applyUpdateObjective, applyAddObjective, applyDeleteObjective } from './planObjectiveActions';
import { getPlansForTeam } from './teamPhaseMetrics';
import { logPlanAudit, logActivityUpdateAudit } from './planAuditHelper';

// Servicio de aplicación que gestiona el estado reactivo de planes, objetivos y actividades PDM
@Injectable({ providedIn: 'root' })
export class PlanService {
  readonly activePhaseId = signal<PhaseType>('investigacion'); // Fase ministerial activa actualmente
  readonly activeTeamId = signal<string>('team-wayuu'); // Identificador del equipo misionero activo
  readonly activeLeader = signal<string>('Líder'); // Nombre del líder del equipo activo
  readonly allPlans = signal<Record<string, PhasePlan>>(getPlansForTeam('team-wayuu')); // Mapa de planes por fase

  // Plan correspondiente a la fase activa seleccionada
  readonly plan = computed<PhasePlan>(() => {
    const phaseId = this.activePhaseId();
    return this.allPlans()[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
  });

  // Métricas calculadas automáticamente para el plan activo
  readonly metrics = computed<PlanMetrics>(() => calculatePlanMetrics(this.plan()));

  // Carga los planes de un equipo específico en el estado reactivo
  loadTeamPlans(teamId: string, teamData?: Partial<TeamSupervisionSummary>): void {
    this.activeTeamId.set(teamId);
    this.activeLeader.set(teamData?.leader || 'Líder');
    this.allPlans.set(getPlansForTeam(teamId, teamData));
  }

  // Persiste los planes actualizados en memoria y en localStorage
  private persistPlans(updated: Record<string, PhasePlan>): void {
    this.allPlans.set(updated);
    const storageKey = `misincol_pdm_plans_${this.activeTeamId()}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('No se pudo guardar en almacenamiento local:', e);
    }
  }

  // Cambia la fase activa del plan ministerial
  switchPhase(phaseId: PhaseType): void {
    this.activePhaseId.set(phaseId);
  }

  // Actualiza los campos de una actividad existente y registra auditoría
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

  // Agrega una nueva actividad al objetivo indicado y registra auditoría
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

  // Elimina una actividad de la fase actual y registra auditoría
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

  // Actualiza título o descripción de un objetivo estratégico y registra auditoría
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

  // Crea un nuevo objetivo estratégico en la fase actual (máximo 4)
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

  // Elimina un objetivo estratégico si existe más de uno en la fase
  deleteObjective(objNum: 1 | 2 | 3 | 4): boolean {
    const phaseId = this.activePhaseId();
    const prev = this.allPlans();
    const cur = prev[phaseId] || INITIAL_PLANS_BY_PHASE[phaseId];
    const updated = applyDeleteObjective(cur, objNum);
    if (!updated) return false;
    this.persistPlans({ ...prev, [phaseId]: updated });
    return true;
  }

  // Restablece los planes del equipo activo a sus valores predeterminados
  resetToDefaults(teamData?: Partial<TeamSupervisionSummary>): void {
    const teamId = this.activeTeamId();
    localStorage.removeItem(`misincol_pdm_plans_${teamId}`);
    this.allPlans.set(getPlansForTeam(teamId, teamData));
  }
}

