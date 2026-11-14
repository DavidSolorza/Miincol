import { Injectable, inject, signal } from '@angular/core';
import { IndexedDbService } from '../infrastructure/indexed-db.service';
import type { OutboxMutation } from '../domain/offline.types';

@Injectable({ providedIn: 'root' })
export class OutboxQueueService {
  private readonly db = inject(IndexedDbService);
  readonly pendingCount = signal<number>(0);

  constructor() {
    this.refreshPendingCount();
  }

  async enqueue(data: {
    entityType: OutboxMutation['entityType'];
    entityId: string;
    action: OutboxMutation['action'];
    endpoint: string;
    method: OutboxMutation['method'];
    payload: Record<string, unknown>;
  }): Promise<OutboxMutation> {
    const mutation: OutboxMutation = {
      id: `outbox-${crypto.randomUUID()}`,
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      endpoint: data.endpoint,
      method: data.method,
      payload: data.payload,
      clientCreatedAt: new Date().toISOString(),
      attempts: 0,
      status: 'pending',
    };

    await this.db.put('outbox', mutation);
    await this.refreshPendingCount();
    return mutation;
  }

  async getPending(): Promise<OutboxMutation[]> {
    try {
      const all = await this.db.getAll<OutboxMutation>('outbox');
      return all
        .filter((m) => m.status === 'pending' || m.status === 'failed')
        .sort((a, b) => new Date(a.clientCreatedAt).getTime() - new Date(b.clientCreatedAt).getTime());
    } catch {
      return [];
    }
  }

  async markSyncing(id: string): Promise<void> {
    const mutation = await this.db.get<OutboxMutation>('outbox', id);
    if (!mutation) return;
    mutation.status = 'syncing';
    mutation.lastAttemptAt = new Date().toISOString();
    await this.db.put('outbox', mutation);
  }

  async markSuccess(id: string): Promise<void> {
    await this.db.delete('outbox', id);
    await this.refreshPendingCount();
  }

  async markFailed(id: string, error: string): Promise<void> {
    const mutation = await this.db.get<OutboxMutation>('outbox', id);
    if (!mutation) return;
    mutation.status = 'failed';
    mutation.attempts += 1;
    mutation.errorMessage = error;
    mutation.lastAttemptAt = new Date().toISOString();
    await this.db.put('outbox', mutation);
    await this.refreshPendingCount();
  }

  async refreshPendingCount(): Promise<number> {
    try {
      const pending = await this.getPending();
      this.pendingCount.set(pending.length);
      return pending.length;
    } catch {
      this.pendingCount.set(0);
      return 0;
    }
  }
}
