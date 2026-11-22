import type { PhasePlan, Objective, Activity, PhaseType, EssentialArea, ActivityState } from '../domain/plan.types';
import { httpClient } from '../../../core/http/httpClient';

export interface RemoteObjective {
  id: string;
  teamId: string;
  pillarId: string;
  dynamicPosition: number;
  title: string;
  description: string;
  essentialArea?: string;
  stage?: string;
  level?: string;
  shortTermGoal?: string;
  mediumTermGoal?: string;
  longTermGoal?: string;
}

export interface RemoteActivity {
  id: string;
  objectiveId: string;
  description: string;
  status: 'Pendiente' | 'En Proceso' | 'Completado';
  essentialArea?: string;
  stage?: string;
  areaLevel?: string;
  unitBudget?: number;
  timesPerYear?: number;
  totalBudget?: number;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  responsible: string;
  currentSituation?: string;
  shortTermGoal?: string;
  mediumTermGoal?: string;
  longTermGoal?: string;
}

function matchesTeam(candidateTeamId: string, targetTeamId: string): boolean {
  if (!candidateTeamId || !targetTeamId) return false;
  const c = candidateTeamId.toLowerCase().replace(/^team-/, '');
  const t = targetTeamId.toLowerCase().replace(/^team-/, '');
  return c === t || candidateTeamId === targetTeamId;
}

function mapRemoteActivityToLocal(act: RemoteActivity, objNum: number): Activity {
  const unitBudget = Number(act.unitBudget) || 0;
  const times = Number(act.timesPerYear) || 1;
  const total = act.totalBudget !== undefined ? Number(act.totalBudget) : unitBudget * times;

  return {
    id: act.id,
    state: act.status as ActivityState,
    stage: act.stage || 'General',
    objectiveNumber: objNum,
    description: act.description || 'Sin descripción',
    currentSituation: act.currentSituation || '',
    essentialArea: act.essentialArea as EssentialArea | undefined,
    areaLevel: act.areaLevel,
    shortTermGoal: act.shortTermGoal || '',
    mediumTermGoal: act.mediumTermGoal || '',
    longTermGoal: act.longTermGoal || '',
    responsible: act.responsible || 'Responsable',
    frequency: act.frequency || 'Mensual',
    timesPerYear: times,
    startDate: act.startDate || '2026-01-01',
    endDate: act.endDate || '2026-12-31',
    totalWeeks: 52,
    remainingWeeks: 52,
    unitBudget,
    totalBudget: total,
  };
}

export async function fetchRemotePlansForTeam(
  teamId: string,
  basePlans: Record<string, PhasePlan>
): Promise<Record<string, PhasePlan> | null> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('misincol_auth_token') : null;
  if (!token) return null;

  try {
    const [allObjs, allActs] = await Promise.all([
      httpClient.get<RemoteObjective[]>('/objectives').catch(() => [] as RemoteObjective[]),
      httpClient.get<RemoteActivity[]>('/activities').catch(() => [] as RemoteActivity[]),
    ]);

    const teamObjs = (allObjs || []).filter((o) => matchesTeam(o.teamId, teamId));
    const teamActs = (allActs || []).filter((a) =>
      matchesTeam(a.objectiveId, teamId) || teamObjs.some((o) => o.id === a.objectiveId)
    );

    if (teamObjs.length === 0 && teamActs.length === 0) return null;

    const cloned: Record<string, PhasePlan> = JSON.parse(JSON.stringify(basePlans));

    for (const phaseKey of Object.keys(cloned)) {
      const phaseId = phaseKey.toLowerCase();
      const phaseObjs = teamObjs
        .filter((o) => (o.pillarId || '').toLowerCase() === phaseId)
        .sort((a, b) => (a.dynamicPosition || 1) - (b.dynamicPosition || 1));

      if (phaseObjs.length > 0) {
        cloned[phaseKey].objectives = phaseObjs.map((o, idx) => {
          const objNum = idx + 1;
          const actsForObj = teamActs.filter(
            (a) => a.objectiveId === o.id || a.objectiveId.includes(`phase-${phaseId}-obj-${objNum}`)
          );

          return {
            number: objNum,
            title: o.title,
            description: o.description || '',
            essentialArea: o.essentialArea as EssentialArea | undefined,
            stage: o.stage,
            areaLevel: o.level,
            shortTermGoal: o.shortTermGoal,
            mediumTermGoal: o.mediumTermGoal,
            longTermGoal: o.longTermGoal,
            activities: actsForObj.map((a) => mapRemoteActivityToLocal(a, objNum)),
          };
        });
      }
    }

    return cloned;
  } catch (err) {
    console.warn('[PlanRemoteSync] No fue posible sincronizar planes remotos:', err);
    return null;
  }
}
