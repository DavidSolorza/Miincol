import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { SyncCoordinatorService } from './sync-coordinator.service';
import { OutboxQueueService } from './outbox-queue.service';
import { NetworkStatusService } from './network-status.service';
import { httpClient } from '../../http/httpClient';
import type { OutboxMutation } from '../domain/offline.types';

describe('SyncCoordinatorService (Unit Tests)', () => {
  let coordinator: SyncCoordinatorService;
  let mockPending: OutboxMutation[];
  let markSuccessSpy: ReturnType<typeof vi.fn>;
  let markFailedSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPending = [
      {
        id: 'outbox-1',
        entityType: 'activity',
        entityId: 'act-1',
        action: 'CREATE',
        endpoint: '/activities',
        method: 'POST',
        payload: { title: 'Visita pastoral' },
        clientCreatedAt: new Date().toISOString(),
        attempts: 0,
        status: 'pending',
      },
    ];

    markSuccessSpy = vi.fn(async () => {});
    markFailedSpy = vi.fn(async () => {});

    const mockOutbox = {
      pendingCount: vi.fn(() => mockPending.length),
      getPending: vi.fn(async () => mockPending),
      markSyncing: vi.fn(async () => {}),
      markSuccess: markSuccessSpy,
      markFailed: markFailedSpy,
    };

    const mockNetwork = {
      isOnline: vi.fn(() => true),
    };

    const injector = createEnvironmentInjector([
      { provide: OutboxQueueService, useValue: mockOutbox },
      { provide: NetworkStatusService, useValue: mockNetwork },
    ], null as unknown as import('@angular/core').EnvironmentInjector);

    coordinator = runInInjectionContext(injector, () => new SyncCoordinatorService());
  });

  it('debe despachar la mutacion via httpClient y marcar exito al recibir 200 OK', async () => {
    vi.spyOn(httpClient, 'post').mockResolvedValueOnce({ success: true });

    const synced = await coordinator.syncNow();
    expect(synced).toBe(1);
    expect(httpClient.post).toHaveBeenCalledWith('/activities', { title: 'Visita pastoral' });
    expect(markSuccessSpy).toHaveBeenCalledWith('outbox-1');
  });

  it('debe marcar fallo y detener el lote si httpClient falla', async () => {
    vi.spyOn(httpClient, 'post').mockRejectedValueOnce(new Error('Network error 503'));

    const synced = await coordinator.syncNow();
    expect(synced).toBe(0);
    expect(markFailedSpy).toHaveBeenCalledWith('outbox-1', 'Network error 503');
  });
});
