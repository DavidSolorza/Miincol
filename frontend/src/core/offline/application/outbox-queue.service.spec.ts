import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { OutboxQueueService } from './outbox-queue.service';
import { IndexedDbService } from '../infrastructure/indexed-db.service';
import type { OutboxMutation } from '../domain/offline.types';

describe('OutboxQueueService (Unit Tests)', () => {
  let service: OutboxQueueService;
  let mockStorage: Map<string, OutboxMutation>;

  beforeEach(() => {
    mockStorage = new Map<string, OutboxMutation>();

    const mockDb = {
      put: vi.fn(async (_store: string, item: OutboxMutation) => {
        mockStorage.set(item.id, item);
      }),
      get: vi.fn(async (_store: string, id: string) => {
        return mockStorage.get(id);
      }),
      getAll: vi.fn(async () => {
        return Array.from(mockStorage.values());
      }),
      delete: vi.fn(async (_store: string, id: string) => {
        mockStorage.delete(id);
      }),
    };

    const injector = createEnvironmentInjector([
      { provide: IndexedDbService, useValue: mockDb },
    ], null as unknown as import('@angular/core').EnvironmentInjector);

    service = runInInjectionContext(injector, () => new OutboxQueueService());
  });

  it('debe encolar una mutacion con estado pending y UUID generado', async () => {
    const mutation = await service.enqueue({
      entityType: 'activity',
      entityId: 'act-123',
      action: 'CREATE',
      endpoint: '/activities',
      method: 'POST',
      payload: { name: 'Reunión de oración' },
    });

    expect(mutation.id).toBeDefined();
    expect(mutation.id.startsWith('outbox-')).toBe(true);
    expect(mutation.status).toBe('pending');
    expect(mutation.attempts).toBe(0);
  });

  it('debe marcar exito y remover la mutacion de la cola outbox', async () => {
    const mutation = await service.enqueue({
      entityType: 'report',
      entityId: 'rep-456',
      action: 'CREATE',
      endpoint: '/reports',
      method: 'POST',
      payload: { summary: 'Informe campo' },
    });

    await service.markSuccess(mutation.id);
    const pending = await service.getPending();
    expect(pending.some((m) => m.id === mutation.id)).toBe(false);
  });

  it('debe incrementar intentos y marcar failed ante un error', async () => {
    const mutation = await service.enqueue({
      entityType: 'objective',
      entityId: 'obj-789',
      action: 'UPDATE',
      endpoint: '/objectives/obj-789',
      method: 'PATCH',
      payload: { target: 'Nueva meta' },
    });

    await service.markFailed(mutation.id, 'Timeout de conexión');
    const stored = mockStorage.get(mutation.id);

    expect(stored?.status).toBe('failed');
    expect(stored?.attempts).toBe(1);
    expect(stored?.errorMessage).toBe('Timeout de conexión');
  });
});
