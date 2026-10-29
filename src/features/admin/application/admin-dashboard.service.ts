import { Injectable, signal, computed, effect } from '@angular/core';
import type { TeamSupervisionSummary, CreateTeamDto, TeamHealthStatus } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { getTeamPhaseMetrics, PHASE_NAMES_MAP } from '../../plans/application/teamPhaseMetrics';
import { INITIAL_NATIONAL_TEAMS } from './initialTeams';
import { calculateNationalKpis } from './adminKpiCalculations';

const STORAGE_KEY = 'misincol_teams_v2';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  readonly allTeams = signal<TeamSupervisionSummary[]>(this.loadInitialTeams());
  readonly searchTerm = signal('');
  readonly phaseFilter = signal('ALL');
  readonly statusFilter = signal('ALL');
  readonly departmentFilter = signal('ALL');

  readonly teams = computed(() => {
    const s = this.searchTerm().toLowerCase();
    const pf = this.phaseFilter();
    const sf = this.statusFilter();
    const df = this.departmentFilter();

    return this.allTeams().filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(s) ||
        t.leader.toLowerCase().includes(s) ||
        t.ethnicity.toLowerCase().includes(s) ||
        t.region.toLowerCase().includes(s) ||
        t.department.toLowerCase().includes(s);
      const matchPhase = pf === 'ALL' || t.currentPhaseId === pf;
      const matchStatus = sf === 'ALL' || t.healthStatus === sf;
      const matchDept = df === 'ALL' || t.department.toLowerCase().includes(df.toLowerCase());
      return matchSearch && matchPhase && matchStatus && matchDept;
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
  }

  private loadInitialTeams(): TeamSupervisionSummary[] {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed: TeamSupervisionSummary[] = JSON.parse(stored);
        const hasPastos = parsed.some((t) => t.id === 'team-pastos' || t.slug === 'team-pastos');
        const list = hasPastos ? parsed : [...parsed, INITIAL_NATIONAL_TEAMS.find((t) => t.id === 'team-pastos')!];
        return list.map((t) => {
          const init = INITIAL_NATIONAL_TEAMS.find((it) => it.id === t.id || it.slug === t.slug);
          return { ...t, coordinates: t.coordinates || init?.coordinates, ...getTeamPhaseMetrics(t.id, t.currentPhaseId, t) };
        });
      }
    } catch (e) {
      console.warn('Error al cargar equipos:', e);
    }
    return INITIAL_NATIONAL_TEAMS.map((t) => ({ ...t, ...getTeamPhaseMetrics(t.id, t.currentPhaseId, t) }));
  }

  handleCreateTeam(dto: CreateTeamDto): TeamSupervisionSummary {
    const slug =
      dto.slug?.trim() ||
      'team-' +
        dto.ethnicity
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
    const members = dto.members && dto.members.length > 0 ? dto.members : [dto.leader];
    const newTeam: TeamSupervisionSummary = {
      id: slug,
      slug,
      name: dto.name,
      ethnicity: dto.ethnicity,
      region: dto.region,
      department: dto.department,
      leader: dto.leader,
      leaderPhone: dto.leaderPhone,
      membersCount: members.length,
      members,
      currentPhaseId: dto.currentPhaseId,
      currentPhaseName: PHASE_NAMES_MAP[dto.currentPhaseId] || '1. Investigación',
      progressPercentage: 0,
      totalBudget: dto.totalBudget,
      executedBudget: 0,
      totalActivities: 4,
      completedActivities: 0,
      inProgressActivities: 1,
      pendingActivities: 3,
      themeColor: dto.themeColor || '#8B251E',
      accessPin: dto.accessPin?.trim() || `${slug.replace(/^team-/, '')}2026`,
      healthStatus: dto.healthStatus || 'Optimo',
      lastUpdate: 'Justo ahora',
      activeInitiatives: [{ title: `Diagnóstico inicial con pueblo ${dto.ethnicity}`, responsible: dto.leader, state: 'En Proceso' }],
      criticalAlert: dto.criticalAlertMessage
        ? { type: dto.criticalAlertType || 'Logística', message: dto.criticalAlertMessage, reportedAt: 'Reportada hoy' }
        : undefined,
    };
    this.allTeams.update((prev) => [newTeam, ...prev]);
    return newTeam;
  }

  handleUpdateTeam(teamId: string, updates: Partial<TeamSupervisionSummary>) {
    this.allTeams.update((prev) =>
      prev.map((t) => {
        if (t.id === teamId || t.slug === teamId) {
          const merged = { ...t, ...updates, lastUpdate: 'Justo ahora' };
          if (updates.currentPhaseId) merged.currentPhaseName = PHASE_NAMES_MAP[updates.currentPhaseId] || merged.currentPhaseName;
          if (updates.members) merged.membersCount = updates.members.length;
          return merged;
        }
        return t;
      })
    );
  }

  handleDeleteTeam(teamId: string) {
    this.allTeams.update((prev) => prev.filter((t) => t.id !== teamId && t.slug !== teamId));
  }

  handlePhaseChange(id: string, phase: PhaseType) {
    const target = this.allTeams().find((t) => t.id === id || t.slug === id);
    this.handleUpdateTeam(id, { ...getTeamPhaseMetrics(id, phase, target) });
  }

  handleStatusChange(id: string, status: TeamHealthStatus) {
    this.handleUpdateTeam(id, { healthStatus: status });
  }
}

