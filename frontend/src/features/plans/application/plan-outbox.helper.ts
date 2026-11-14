import type { OutboxQueueService } from '../../../core/offline/application/outbox-queue.service';
import type { Activity, Objective, PhaseType } from '../domain/plan.types';

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

  outbox.enqueue({
    entityType: 'activity',
    entityId: activityId,
    action,
    endpoint,
    method,
    payload: { ...(data || {}), id: activityId, teamId, phaseId },
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

  outbox.enqueue({
    entityType: 'objective',
    entityId: `obj-${teamId}-${phaseId}-${objNum}`,
    action,
    endpoint,
    method,
    payload: { ...(data || {}), objectiveNumber: objNum, teamId, phaseId },
  }).catch(() => {});
}
