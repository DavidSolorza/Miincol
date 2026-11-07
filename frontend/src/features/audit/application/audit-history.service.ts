import { Injectable, signal, computed } from '@angular/core';
import type { TeamAuditLog, AuditActionType } from '../domain/audit.types';
import { getStoredAuditLogs } from './auditStorage';
import { INITIAL_AUDIT_LOGS_BY_TEAM } from './initialAuditLogs';

@Injectable({ providedIn: 'root' })
export class AuditHistoryService {
  readonly logs = signal<TeamAuditLog[]>(this.loadAllLogs());
  readonly searchTerm = signal('');
  readonly selectedTeamId = signal('ALL');
  readonly selectedActionType = signal<string>('ALL');

  private loadAllLogs(): TeamAuditLog[] {
    const all: TeamAuditLog[] = [];
    const teamIds = Object.keys(INITIAL_AUDIT_LOGS_BY_TEAM);
    for (const tid of teamIds) {
      all.push(...getStoredAuditLogs(tid));
    }
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  readonly filteredLogs = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const tid = this.selectedTeamId();
    const act = this.selectedActionType();

    return this.logs().filter((l) => {
      const matchTeam = tid === 'ALL' || l.teamId === tid;
      const matchAct = act === 'ALL' || l.actionType === act;
      const matchSearch =
        !q ||
        l.userName.toLowerCase().includes(q) ||
        (l.teamName && l.teamName.toLowerCase().includes(q)) ||
        l.title.toLowerCase().includes(q) ||
        l.detail.toLowerCase().includes(q) ||
        (l.fieldModified && l.fieldModified.toLowerCase().includes(q)) ||
        (l.newValue && l.newValue.toLowerCase().includes(q));

      return matchTeam && matchAct && matchSearch;
    });
  });

  readonly changeLogs = computed(() =>
    this.filteredLogs().filter((l) => l.actionType !== 'login' && l.previousValue !== undefined)
  );

  readonly loginLogs = computed(() =>
    this.filteredLogs().filter((l) => l.actionType === 'login')
  );

  readonly totalChangesCount = computed(() =>
    this.logs().filter((l) => l.actionType !== 'login' && l.previousValue !== undefined).length
  );

  readonly totalLoginsCount = computed(() =>
    this.logs().filter((l) => l.actionType === 'login').length
  );

  refresh(): void {
    this.logs.set(this.loadAllLogs());
  }
}

