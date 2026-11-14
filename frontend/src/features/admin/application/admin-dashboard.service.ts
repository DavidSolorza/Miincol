import { Injectable, signal, computed, effect, inject } from '@angular/core';
import type { TeamSupervisionSummary, TeamHealthStatus, CreateTeamDto } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { calculateNationalKpis } from './adminKpiCalculations';
import { getTeamPhaseMetrics, PHASE_NAMES_MAP, createCustomPlanForTeam } from '../../plans/application/teamPhaseMetrics';
import { SecurityUsersService } from '../../security/application/security-users.service';
import { syncTeamCreatedToBackend, syncTeamDeletedToBackend } from './admin-teams-sync.helper';
import { httpClient } from '../../../core/http/httpClient';

const STORAGE_KEY = 'misincol_admin_teams';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly securityUsersSvc = inject(SecurityUsersService);
  readonly allTeams = signal<TeamSupervisionSummary[]>(this.loadInitialTeams());
  readonly searchTerm = signal('');
  readonly phaseFilter = signal<string>('ALL');
  readonly statusFilter = signal<string>('ALL');
  readonly departmentFilter = signal<string>('ALL');

  readonly teams = computed(() => {
    const s = this.searchTerm().trim().toLowerCase(), pf = this.phaseFilter(), sf = this.statusFilter(), df = this.departmentFilter();
    return this.allTeams().filter((t) => {
      const matchSearch = !s || (t.name || '').toLowerCase().includes(s) ||
        (t.leader || '').toLowerCase().includes(s) ||
        (t.ethnicity || '').toLowerCase().includes(s) ||
        (t.region || '').toLowerCase().includes(s) ||
        (t.department || '').toLowerCase().includes(s) ||
        (t.leaderEmail || '').toLowerCase().includes(s) ||
        (t.slug || '').toLowerCase().includes(s) ||
        (t.members || []).some((m) => (m || '').toLowerCase().includes(s));
      return matchSearch && (pf === 'ALL' || t.currentPhaseId === pf) && (sf === 'ALL' || t.healthStatus === sf) && (df === 'ALL' || (t.department || '').toLowerCase().includes(df.toLowerCase()));
    });
  });

  readonly nationalKpis = computed(() => calculateNationalKpis(this.allTeams()));

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.allTeams()));
      } catch (e) {
        console.warn('Error al persistir equipos:', e);
      }
    });
    this.syncFromBackend();
  }

  private async syncFromBackend(): Promise<void> {
    try {
      const teams = await httpClient.get<TeamSupervisionSummary[]>('/teams');
      if (Array.isArray(teams)) {
        const mapped = teams.map((t) => ({
          ...t,
          members: t.members && t.members.length > 0 ? t.members : [t.leader],
          ...getTeamPhaseMetrics(t.id, t.currentPhaseId, t),
        }));
        this.allTeams.set(mapped);
        mapped.forEach((t) => this.securityUsersSvc.ensureTeamLeaderAndMembers(t));
      }
    } catch { /* Usar estado local si el backend no responde */ }
  }

  private loadInitialTeams(): TeamSupervisionSummary[] {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed: TeamSupervisionSummary[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t) => ({
            ...t,
            members: (t.members && t.members.length > 0) ? t.members : [t.leader],
            ...getTeamPhaseMetrics(t.id, t.currentPhaseId, t),
          }));
        }
      }
    } catch (e) {
      console.warn('Error al cargar equipos:', e);
    }
    return [];
  }

  handleCreateTeam(dto: CreateTeamDto): TeamSupervisionSummary {
    const slug = dto.slug?.trim() || `team-${dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const newTeam: TeamSupervisionSummary = {
      id: slug, slug, name: dto.name, ethnicity: dto.ethnicity, region: dto.region, department: dto.department,
      leader: dto.leader, leaderPhone: dto.leaderPhone, leaderEmail: dto.leaderEmail,
      membersCount: dto.members ? dto.members.length : 1, members: dto.members || [dto.leader],
      membersWithAccounts: dto.membersWithAccounts || [], currentPhaseId: dto.currentPhaseId,
      currentPhaseName: PHASE_NAMES_MAP[dto.currentPhaseId] || '1. Investigación',
      progressPercentage: 0, totalBudget: dto.totalBudget, executedBudget: 0,
      totalActivities: 0, completedActivities: 0, inProgressActivities: 0, pendingActivities: 0,
      themeColor: dto.themeColor || '#8B251E', accessPin: dto.accessPin?.trim() || `${slug.replace(/^team-/, '')}2026`,
      healthStatus: dto.healthStatus || 'Optimo', lastUpdate: 'Justo ahora', activeInitiatives: [],
      criticalAlert: dto.criticalAlertMessage ? { type: dto.criticalAlertType || 'Logística', message: dto.criticalAlertMessage, reportedAt: 'Reportada hoy' } : undefined,
    };
    createCustomPlanForTeam(newTeam.id, newTeam);
    this.allTeams.update((prev) => [newTeam, ...prev]);
    this.securityUsersSvc.ensureTeamLeaderAndMembers(newTeam, dto);
    syncTeamCreatedToBackend(newTeam, dto);
    return newTeam;
  }

  handleUpdateTeam(teamId: string, updates: Partial<TeamSupervisionSummary> & Partial<CreateTeamDto>) {
    this.allTeams.update((prev) =>
      prev.map((t) => {
        if (t.id === teamId || t.slug === teamId) {
          const merged = { ...t, ...updates, lastUpdate: 'Justo ahora' };
          if (updates.currentPhaseId) merged.currentPhaseName = PHASE_NAMES_MAP[updates.currentPhaseId] || merged.currentPhaseName;
          if (updates.members) merged.membersCount = updates.members.length;
          this.securityUsersSvc.ensureTeamLeaderAndMembers(merged, updates as CreateTeamDto);
          return merged;
        }
        return t;
      })
    );
  }

  handleDeleteTeam(teamId: string) {
    const target = this.allTeams().find((t) => t.id === teamId || t.slug === teamId);
    this.allTeams.update((prev) => prev.filter((t) => t.id !== teamId && t.slug !== teamId));
    if (target) syncTeamDeletedToBackend(target);
  }

  handlePhaseChange(id: string, phase: PhaseType) {
    const target = this.allTeams().find((t) => t.id === id || t.slug === id);
    this.handleUpdateTeam(id, { ...getTeamPhaseMetrics(id, phase, target) });
  }

  handleStatusChange(id: string, status: TeamHealthStatus) {
    this.handleUpdateTeam(id, { healthStatus: status });
  }
}
