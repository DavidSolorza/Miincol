// Contratos de tipos para el motor Offline-First y Patrón Outbox
export type OutboxAction = 'CREATE' | 'UPDATE' | 'DELETE';

export type OutboxStatus = 'pending' | 'syncing' | 'failed' | 'conflict' | 'dead_letter';

export type OutboxEntityType = 'team' | 'objective' | 'activity' | 'report' | 'note' | 'user';

export interface OutboxMutation {
  id: string;
  entityType: OutboxEntityType;
  entityId: string;
  action: OutboxAction;
  endpoint: string;
  method: 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  payload: Record<string, unknown>;
  clientCreatedAt: string;
  attempts: number;
  lastAttemptAt?: string;
  status: OutboxStatus;
  errorMessage?: string;
}

export type StoreName = 'outbox' | 'teams' | 'objectives' | 'activities' | 'reports' | 'notes';

export interface SyncStatusState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt?: string;
  error?: string;
}

