import { describe, it, expect, beforeEach } from 'vitest';
import { serviceBus } from './ServiceBus';

describe('ServiceBus', () => {
  beforeEach(() => {
    serviceBus.clear();
  });

  it('debe emitir y recibir eventos de ciclo de vida de equipos', async () => {
    const received: string[] = [];

    serviceBus.subscribe('team:created', (payload) => {
      received.push(`created:${payload.teamId}`);
    });
    serviceBus.subscribe('team:updated', (payload) => {
      received.push(`updated:${payload.teamId}`);
    });
    serviceBus.subscribe('team:deleted', (payload) => {
      received.push(`deleted:${payload.teamId}`);
    });

    serviceBus.publish('team:created', { teamId: 'team-pastos', name: 'Pastos', leader: 'Hugo' });
    serviceBus.publish('team:updated', { teamId: 'team-pastos', updates: { name: 'Pastos Editada' } });
    serviceBus.publish('team:deleted', { teamId: 'team-pastos' });

    await new Promise((r) => queueMicrotask(r));

    expect(received).toEqual([
      'created:team-pastos',
      'updated:team-pastos',
      'deleted:team-pastos',
    ]);
  });

  it('debe procesar eventos de actividades y cambio de fase', async () => {
    let switchedPhase = '';
    let updatedActivityId = '';

    serviceBus.subscribe('pdm:phase_switch', (payload) => {
      switchedPhase = payload.phaseId;
    });
    serviceBus.subscribe('activity:updated', (payload) => {
      updatedActivityId = payload.activityId;
    });

    serviceBus.publish('pdm:phase_switch', { phaseId: 'evangelizacion' });
    serviceBus.publish('activity:updated', {
      activityId: 'act-123',
      teamId: 'team-wayuu',
      phaseId: 'evangelizacion',
      updatedFields: { state: 'Completado' },
    });

    await new Promise((r) => queueMicrotask(r));

    expect(switchedPhase).toBe('evangelizacion');
    expect(updatedActivityId).toBe('act-123');
  });

  it('debe permitir desuscribirse limpiamente', async () => {
    let callCount = 0;
    const sub = serviceBus.subscribe('team:select', () => {
      callCount++;
    });

    serviceBus.publish('team:select', { teamId: 'team-1' });
    await new Promise((r) => queueMicrotask(r));
    expect(callCount).toBe(1);

    sub.unsubscribe();
    serviceBus.publish('team:select', { teamId: 'team-2' });
    await new Promise((r) => queueMicrotask(r));
    expect(callCount).toBe(1);
  });
});
