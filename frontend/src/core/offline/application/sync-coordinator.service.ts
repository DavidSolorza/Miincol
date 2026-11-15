import { Injectable, inject, signal } from '@angular/core';
import { OutboxQueueService } from './outbox-queue.service';
import { NetworkStatusService } from './network-status.service';
import { httpClient } from '../../http/httpClient';
import { serviceBus } from '../../bus';
import type { OutboxMutation } from '../domain/offline.types';

@Injectable({ providedIn: 'root' })
export class SyncCoordinatorService {
  private readonly outbox = inject(OutboxQueueService);
  private readonly network = inject(NetworkStatusService);

  readonly isSyncing = signal<boolean>(false);
  readonly lastSyncAt = signal<string | null>(null);

  constructor() {
    this.initAutoSync();
  }

  private initAutoSync(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.syncNow().catch(() => {});
    });

    serviceBus.subscribe('pdm:plan_persisted', () => {
      if (this.network.isOnline() && !this.isSyncing()) {
        setTimeout(() => this.syncNow().catch(() => {}), 150);
      }
    });

    setInterval(() => {
      if (this.network.isOnline() && this.outbox.pendingCount() > 0 && !this.isSyncing()) {
        this.syncNow().catch(() => {});
      }
    }, 5000);
  }

  async syncNow(): Promise<number> {
    if (this.isSyncing() || !this.network.isOnline()) return 0;
    this.isSyncing.set(true);

    let syncedCount = 0;
    try {
      const pending = await this.outbox.getPending();
      for (const mutation of pending) {
        const success = await this.dispatchMutation(mutation);
        if (success) {
          syncedCount++;
        } else {
          break; // Detener lote para preservar orden FIFO si hay fallo de red
        }
      }

      if (syncedCount > 0) {
        this.lastSyncAt.set(new Date().toISOString());
        serviceBus.publish('ui:toast', {
          title: 'Sincronización Completada',
          message: `${syncedCount} cambio(s) enviados exitosamente al servidor.`,
          type: 'success',
        });
      }
    } finally {
      this.isSyncing.set(false);
    }
    return syncedCount;
  }

  private async dispatchMutation(mutation: OutboxMutation): Promise<boolean> {
    await this.outbox.markSyncing(mutation.id);
    try {
      if (mutation.method === 'POST') {
        await httpClient.post(mutation.endpoint, mutation.payload);
      } else if (mutation.method === 'PATCH') {
        await httpClient.patch(mutation.endpoint, mutation.payload);
      } else if (mutation.method === 'PUT') {
        await httpClient.put(mutation.endpoint, mutation.payload);
      } else if (mutation.method === 'DELETE') {
        await httpClient.delete(mutation.endpoint);
      }
      await this.outbox.markSuccess(mutation.id);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error de sincronización';
      await this.outbox.markFailed(mutation.id, message);
      return false;
    }
  }
}

