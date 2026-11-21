import type { OutboxQueueService } from '../../../core/offline/application/outbox-queue.service';
import type { Activity, Objective, PhaseType } from '../domain/plan.types';

const VALID_STAGES_BY_AREA: Record<string, string[]> = {
  Investigación: ['Contacto'],
  Encarnación: ['Contacto', 'Comunicar', 'Respuesta'],
  Evangelización: ['Respuesta', 'Reunirse', 'Consolidar'],
  Entrenamiento: ['Consolidar', 'Liderazgo', 'Desarrollo eclesial'],
  Autocuidado: ['Auto-cuidado'],
  'Auto-cuidado': ['Auto-cuidado'],
};

export function resolveValidStage(area: string, stage?: string): string {
  const allowed = VALID_STAGES_BY_AREA[area] || ['Contacto'];
  if (stage && allowed.includes(stage)) return stage;
  return allowed[0] || 'Contacto';
}

export function queueActivityMutation(
  outbox: OutboxQueueService,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  activityId: string,
  teamId: string,
  phaseId: PhaseType,
  data?: Partial<Activity>
): void {
  const method = action === 'CREATE' ? 'POST' : action === 'UPDATE' ? 'PATCH' : 'DELETE';
  const endpoint = action === 'CREATE' ? '/activities' : `/activities/${activityId}`;

  const payload: Record<string, any> = {};
  if (action === 'CREATE') {
    const area = data?.essentialArea || 'Investigación';
    payload.objectiveId = `team-${teamId}-phase-${phaseId}-obj-1`;
    payload.description = data?.description || 'Nueva actividad';
    payload.status = data?.status || 'Pendiente';
    payload.essentialArea = area;
    payload.stage = resolveValidStage(area, data?.stage);
    payload.areaLevel = data?.areaLevel || 'Pionera';
    payload.unitBudget = Number(data?.unitBudget) || 0;
    payload.timesPerYear = Number(data?.timesPerYear) || 1;
    payload.startDate = data?.startDate || '2026-01-01';
    payload.endDate = data?.endDate || '2026-12-31';
    payload.responsible = data?.responsible || 'Líder Pastoral';
    if (data?.frequency) payload.frequency = data.frequency;
    if (data?.currentSituation) payload.currentSituation = data.currentSituation;
  } else if (action === 'UPDATE' && data) {
    if (data.description !== undefined) payload.description = data.description;
    if (data.status !== undefined) payload.status = data.status;
    if (data.essentialArea !== undefined) payload.essentialArea = data.essentialArea;
    if (data.stage !== undefined || data.essentialArea !== undefined) {
      const area = data.essentialArea || 'Investigación';
      payload.stage = resolveValidStage(area, data.stage);
    }
    if (data.areaLevel !== undefined) payload.areaLevel = data.areaLevel;
    if (data.unitBudget !== undefined) payload.unitBudget = Number(data.unitBudget);
    if (data.timesPerYear !== undefined) payload.timesPerYear = Number(data.timesPerYear);
    if (data.startDate !== undefined) payload.startDate = data.startDate;
    if (data.endDate !== undefined) payload.endDate = data.endDate;
    if (data.responsible !== undefined) payload.responsible = data.responsible;
  }

  outbox.enqueue({
    entityType: 'activity',
    entityId: activityId,
    action,
    endpoint,
    method,
    payload,
  }).catch(() => {});
}

export function queueObjectiveMutation(
  outbox: OutboxQueueService,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  objNum: number,
  teamId: string,
  phaseId: PhaseType,
  data?: Partial<Objective>
): void {
  const method = action === 'CREATE' ? 'POST' : action === 'UPDATE' ? 'PATCH' : 'DELETE';
  const endpoint = action === 'CREATE' ? '/objectives' : `/objectives/team-${teamId}-phase-${phaseId}-obj-${objNum}`;

  const payload: Record<string, any> = {};
  if (action === 'CREATE') {
    const area = data?.essentialArea || 'Investigación';
    payload.teamId = teamId;
    payload.pillarId = phaseId;
    payload.title = data?.title || `Objetivo Estratégico #${objNum}`;
    payload.description = data?.description || 'Descripción del objetivo';
    payload.essentialArea = area;
    payload.stage = resolveValidStage(area, data?.stage);
    if (data?.areaLevel) payload.level = data.areaLevel;
    if (data?.shortTermGoal) payload.shortTermGoal = data.shortTermGoal;
    if (data?.mediumTermGoal) payload.mediumTermGoal = data.mediumTermGoal;
    if (data?.longTermGoal) payload.longTermGoal = data.longTermGoal;
  } else if (action === 'UPDATE' && data) {
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.essentialArea !== undefined) payload.essentialArea = data.essentialArea;
    if (data.stage !== undefined || data.essentialArea !== undefined) {
      const area = data.essentialArea || 'Investigación';
      payload.stage = resolveValidStage(area, data.stage);
    }
    if (data.areaLevel !== undefined) payload.level = data.areaLevel;
    if (data.shortTermGoal !== undefined) payload.shortTermGoal = data.shortTermGoal;
    if (data.mediumTermGoal !== undefined) payload.mediumTermGoal = data.mediumTermGoal;
    if (data.longTermGoal !== undefined) payload.longTermGoal = data.longTermGoal;
  }

  outbox.enqueue({
    entityType: 'objective',
    entityId: `obj-${teamId}-${phaseId}-${objNum}`,
    action,
    endpoint,
    method,
    payload,
  }).catch(() => {});
}
