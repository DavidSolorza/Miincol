import { useState, useMemo, useEffect } from 'react';
import type { TeamSupervisionSummary, CreateTeamDto, TeamHealthStatus } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { getTeamPhaseMetrics, PHASE_NAMES_MAP } from '../../plans/application/teamPhaseMetrics';
import { INITIAL_NATIONAL_TEAMS } from './initialTeams';
import { calculateNationalKpis } from './adminKpiCalculations';

export { INITIAL_NATIONAL_TEAMS };

const STORAGE_KEY = 'misincol_teams_v2';

export const useAdminDashboard = () => {
  const [teams, setTeams] = useState<TeamSupervisionSummary[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: TeamSupervisionSummary[] = JSON.parse(stored);
        const hasPastos = parsed.some((t) => t.id === 'team-pastos' || t.slug === 'team-pastos');
        const list = hasPastos ? parsed : [...parsed, INITIAL_NATIONAL_TEAMS.find((t) => t.id === 'team-pastos')!];
        return list.map((t) => ({ ...t, ...getTeamPhaseMetrics(t.id, t.currentPhaseId, t) }));
      }
    } catch (e) {
      console.warn('Error al cargar equipos:', e);
    }
    return INITIAL_NATIONAL_TEAMS.map((t) => ({ ...t, ...getTeamPhaseMetrics(t.id, t.currentPhaseId, t) }));
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch (e) {
      console.warn('Error al persistir equipos:', e);
    }
  }, [teams]);

  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const s = searchTerm.toLowerCase();
      const matchSearch = t.name.toLowerCase().includes(s) || t.leader.toLowerCase().includes(s) || t.ethnicity.toLowerCase().includes(s) || t.region.toLowerCase().includes(s) || t.department.toLowerCase().includes(s);
      const matchPhase = phaseFilter === 'ALL' || t.currentPhaseId === phaseFilter;
      const matchStatus = statusFilter === 'ALL' || t.healthStatus === statusFilter;
      const matchDept = departmentFilter === 'ALL' || t.department.toLowerCase().includes(departmentFilter.toLowerCase());
      return matchSearch && matchPhase && matchStatus && matchDept;
    });
  }, [teams, searchTerm, phaseFilter, statusFilter, departmentFilter]);

  const nationalKpis = useMemo(() => calculateNationalKpis(teams), [teams]);

  const handleCreateTeam = (dto: CreateTeamDto) => {
    const slug = dto.slug?.trim() || 'team-' + dto.ethnicity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const members = dto.members && dto.members.length > 0 ? dto.members : [dto.leader];
    const newTeam: TeamSupervisionSummary = {
      id: slug, slug, name: dto.name, ethnicity: dto.ethnicity, region: dto.region, department: dto.department, leader: dto.leader, leaderPhone: dto.leaderPhone,
      membersCount: members.length, members, currentPhaseId: dto.currentPhaseId, currentPhaseName: PHASE_NAMES_MAP[dto.currentPhaseId] || '1. Investigación',
      progressPercentage: 0, totalBudget: dto.totalBudget, executedBudget: 0, totalActivities: 4, completedActivities: 0, inProgressActivities: 1, pendingActivities: 3,
      themeColor: dto.themeColor || '#8B251E', accessPin: dto.accessPin?.trim() || `${slug.replace(/^team-/, '')}2026`, healthStatus: dto.healthStatus || 'Optimo', lastUpdate: 'Justo ahora',
      activeInitiatives: [{ title: `Diagnóstico inicial con pueblo ${dto.ethnicity}`, responsible: dto.leader, state: 'En Proceso' }],
      criticalAlert: dto.criticalAlertMessage ? { type: dto.criticalAlertType || 'Logística', message: dto.criticalAlertMessage, reportedAt: 'Reportada hoy' } : undefined,
    };
    setTeams((prev) => [newTeam, ...prev]);
    return newTeam;
  };

  const handleUpdateTeam = (teamId: string, updates: Partial<TeamSupervisionSummary>) => {
    setTeams((prev) => prev.map((t) => {
      if (t.id === teamId || t.slug === teamId) {
        const merged = { ...t, ...updates, lastUpdate: 'Justo ahora' };
        if (updates.currentPhaseId) merged.currentPhaseName = PHASE_NAMES_MAP[updates.currentPhaseId] || merged.currentPhaseName;
        if (updates.members) merged.membersCount = updates.members.length;
        return merged;
      }
      return t;
    }));
  };

  const handleDeleteTeam = (teamId: string) => setTeams((prev) => prev.filter((t) => t.id !== teamId && t.slug !== teamId));
  const handlePhaseChange = (id: string, phase: PhaseType) => handleUpdateTeam(id, { ...getTeamPhaseMetrics(id, phase, teams.find((t) => t.id === id || t.slug === id)) });
  const handleStatusChange = (id: string, status: TeamHealthStatus) => handleUpdateTeam(id, { healthStatus: status });
  const resetToDefaults = () => { setTeams(INITIAL_NATIONAL_TEAMS); localStorage.removeItem(STORAGE_KEY); };

  return {
    teams: filteredTeams, allTeams: teams, allTeamsCount: teams.length, nationalKpis,
    searchTerm, setSearchTerm, phaseFilter, setPhaseFilter, statusFilter, setStatusFilter, departmentFilter, setDepartmentFilter,
    handleCreateTeam, handleUpdateTeam, handleDeleteTeam, handlePhaseChange, handleStatusChange, resetToDefaults,
  };
};
