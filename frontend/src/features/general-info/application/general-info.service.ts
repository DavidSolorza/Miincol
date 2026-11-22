import { Injectable, signal, computed } from '@angular/core';
import type {
  TeamGeneralInfo, TeamMemberContact, GeneralTeamData, FieldMinistryMetrics,
  MinisterialTrainingMetrics, ChurchDevelopmentMetrics, PillarBudgetBreakdown,
} from '../domain/general-info.types';
import { createDefaultGeneralInfo } from '../domain/general-info-defaults';
import { archiveYearCycle, backupPdmPlansSnapshot } from '../domain/general-info-history.helper';
import { createCleanCycleState } from '../domain/general-info-reset.helper';
import { syncGlobalMinisterialYear } from '../domain/general-info-year.helper';
import { computePillarBudgetsFromPlans } from '../domain/general-pillar-budget.helper';
import { syncGeneralInfoToBackend, fetchRemoteGeneralInfo } from './general-info-sync.helper';
import { serviceBus } from '../../../core/bus';

const STORAGE_PREFIX = 'misincol_general_info_v3_';
const GLOBAL_YEAR_KEY = 'misincol_global_ministerial_year';

function getStoredGlobalYear(): number {
  try {
    const s = typeof localStorage !== 'undefined' ? localStorage.getItem(GLOBAL_YEAR_KEY) : null;
    if (s) {
      const parsed = parseInt(s, 10);
      if (!isNaN(parsed) && parsed >= 2024 && parsed <= 2040) return parsed;
    }
  } catch { /* ignore */ }
  return 2026;
}

@Injectable({ providedIn: 'root' })
export class GeneralInfoService {
  readonly activeGlobalYear = signal<number>(getStoredGlobalYear());
  readonly currentInfo = signal<TeamGeneralInfo>(this.createInitialInfo());

  private createInitialInfo(): TeamGeneralInfo {
    const info = createDefaultGeneralInfo('nacional');
    info.teamData.year = this.activeGlobalYear();
    return info;
  }

  readonly totalBudget = computed(() => {
    const b = this.currentInfo().budgetBreakdown;
    return b.investigacionBudget + b.encarnacionBudget + b.evangelizacionBudget + b.entrenamientoBudget + b.autocuidadoBudget;
  });

  readonly budgetExecutionPercentage = computed(() => {
    const tot = this.totalBudget(), exec = this.currentInfo().budgetBreakdown.executedTotalBudget || 0;
    return tot > 0 ? Math.min(100, Math.round((exec / tot) * 100)) : 0;
  });

  loadTeamInfo(teamId: string, teamName?: string, leader?: string, teamMembers?: string[]): void {
    const key = `${STORAGE_PREFIX}${teamId}`, dynamicBudget = computePillarBudgetsFromPlans(teamId);
    let initial: TeamGeneralInfo;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        initial = JSON.parse(saved) as TeamGeneralInfo;
        if (!initial.annualMetricsHistory) initial.annualMetricsHistory = createDefaultGeneralInfo(teamId, teamName, leader, teamMembers).annualMetricsHistory;
        if (!initial.teamData?.year) initial.teamData.year = this.activeGlobalYear();
      } else {
        initial = createDefaultGeneralInfo(teamId, teamName, leader, teamMembers);
        initial.teamData.year = this.activeGlobalYear();
      }
    } catch {
      initial = createDefaultGeneralInfo(teamId, teamName, leader, teamMembers);
      initial.teamData.year = this.activeGlobalYear();
    }
    initial.budgetBreakdown = dynamicBudget;
    this.currentInfo.set(initial);
    this.persist(teamId, initial);
    fetchRemoteGeneralInfo(teamId, this.activeGlobalYear()).then((r) => {
      if (r && this.currentInfo().teamId === teamId) this.updateAndPersist(r);
    }).catch(() => {});
  }

  updateTeamData(data: Partial<GeneralTeamData>): void { this.updateAndPersist({ teamData: { ...this.currentInfo().teamData, ...data } }); }
  updateFieldMetrics(metrics: Partial<FieldMinistryMetrics>): void { this.updateAndPersist({ fieldMetrics: { ...this.currentInfo().fieldMetrics, ...metrics } }); }
  updateMinisterialTraining(training: Partial<MinisterialTrainingMetrics>): void { this.updateAndPersist({ ministerialTraining: { ...this.currentInfo().ministerialTraining, ...training } }); }
  updateChurchDevelopment(dev: Partial<ChurchDevelopmentMetrics>): void { this.updateAndPersist({ churchDevelopment: { ...this.currentInfo().churchDevelopment, ...dev } }); }
  updateEssentials(essentials: string[]): void { this.updateAndPersist({ essentialsToDevelop: essentials }); }
  updateBudgetBreakdown(budget: Partial<PillarBudgetBreakdown>): void { this.updateAndPersist({ budgetBreakdown: { ...this.currentInfo().budgetBreakdown, ...budget } }); }

  setActiveYear(year: number): void {
    this.activeGlobalYear.set(year);
    try { localStorage.setItem(GLOBAL_YEAR_KEY, year.toString()); } catch { /* ignore */ }
    const cur = this.currentInfo();
    this.updateAndPersist({ teamData: { ...cur.teamData, year, isYearClosed: false } });
    serviceBus.publish('ui:toast', {
      title: `Año Ministerial Ajustado a ${year}`,
      message: `El ciclo activo de la misión ahora es ${year}.`,
      type: 'info', duration: 3000,
    });
  }

  setGlobalActiveYear(year: number): void {
    this.activeGlobalYear.set(year);
    try { localStorage.setItem(GLOBAL_YEAR_KEY, year.toString()); } catch { /* ignore */ }
    syncGlobalMinisterialYear(STORAGE_PREFIX, year);
    this.setActiveYear(year);
  }

  closeYear(): void {
    const cur = this.currentInfo();
    const history = archiveYearCycle(cur);
    backupPdmPlansSnapshot(cur.teamId, cur.teamData.year);
    this.updateAndPersist({ teamData: { ...cur.teamData, isYearClosed: true }, annualMetricsHistory: history });
    serviceBus.publish('ui:toast', { title: `Año ${cur.teamData.year} Cerrado`, message: 'Datos y planes archivados exitosamente.', type: 'success', duration: 3000 });
  }

  startNewYear(nextYear: number): void {
    const cur = this.currentInfo();
    const history = archiveYearCycle(cur);
    backupPdmPlansSnapshot(cur.teamId, cur.teamData.year);
    const cleanState = createCleanCycleState(nextYear, cur);
    this.updateAndPersist({ ...cleanState, annualMetricsHistory: history });
    serviceBus.publish('cycle:year_changed', { teamId: cur.teamId, closingYear: cur.teamData.year, nextYear });
    serviceBus.publish('ui:toast', { title: `Ciclo ${nextYear} Inicializado`, message: 'Período limpio listo para nueva planificación.', type: 'success', duration: 3000 });
  }

  addMember(member: Omit<TeamMemberContact, 'id'>): void {
    const members = [...this.currentInfo().teamData.members, { ...member, id: `m_${Date.now()}` }];
    this.updateTeamData({ members });
  }

  removeMember(memberId: string): void {
    const members = this.currentInfo().teamData.members.filter((m) => m.id !== memberId);
    this.updateTeamData({ members });
  }

  saveCurrentInfo(): void {
    const cur = this.currentInfo();
    this.persist(cur.teamId, cur);
    syncGeneralInfoToBackend(cur).catch(() => {});
  }

  private updateAndPersist(partial: Partial<TeamGeneralInfo>): void {
    this.currentInfo.update((prev) => {
      const next = { ...prev, ...partial, updatedAt: new Date().toISOString() };
      this.persist(prev.teamId, next);
      return next;
    });
  }

  private persist(teamId: string, info: TeamGeneralInfo): void {
    try { localStorage.setItem(`${STORAGE_PREFIX}${teamId}`, JSON.stringify(info)); } catch { /* ignore */ }
  }
}
