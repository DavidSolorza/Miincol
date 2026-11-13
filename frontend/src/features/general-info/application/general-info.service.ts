import { Injectable, signal, computed } from '@angular/core';
import type {
  TeamGeneralInfo, TeamMemberContact, GeneralTeamData, FieldMinistryMetrics,
  MinisterialTrainingMetrics, ChurchDevelopmentMetrics, PillarBudgetBreakdown,
} from '../domain/general-info.types';
import { createDefaultGeneralInfo } from '../domain/general-info-defaults';
import { archiveYearCycle, backupPdmPlansSnapshot } from '../domain/general-info-history.helper';
import { createCleanCycleState } from '../domain/general-info-reset.helper';
import { syncGlobalMinisterialYear } from '../domain/general-info-year.helper';
import { serviceBus } from '../../../core/bus';

const STORAGE_PREFIX = 'misincol_general_info_v3_';

@Injectable({ providedIn: 'root' })
export class GeneralInfoService {
  readonly currentInfo = signal<TeamGeneralInfo>(createDefaultGeneralInfo('team-wayuu'));

  readonly totalBudget = computed(() => {
    const b = this.currentInfo().budgetBreakdown;
    return b.investigacionBudget + b.encarnacionBudget + b.evangelizacionBudget + b.entrenamientoBudget + b.autocuidadoBudget;
  });

  readonly budgetExecutionPercentage = computed(() => {
    const tot = this.totalBudget(), exec = this.currentInfo().budgetBreakdown.executedTotalBudget || 0;
    return tot > 0 ? Math.min(100, Math.round((exec / tot) * 100)) : 0;
  });

  loadTeamInfo(teamId: string, teamName?: string, leader?: string, teamMembers?: string[]): void {
    const key = `${STORAGE_PREFIX}${teamId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as TeamGeneralInfo;
        if (!parsed.annualMetricsHistory) {
          parsed.annualMetricsHistory = createDefaultGeneralInfo(teamId, teamName, leader, teamMembers).annualMetricsHistory;
        }
        this.currentInfo.set(parsed);
        return;
      }
    } catch { /* ignore */ }
    const fresh = createDefaultGeneralInfo(teamId, teamName, leader, teamMembers);
    this.currentInfo.set(fresh);
    this.persist(teamId, fresh);
  }

  updateTeamData(data: Partial<GeneralTeamData>): void {
    this.updateAndPersist({ teamData: { ...this.currentInfo().teamData, ...data } });
  }

  updateFieldMetrics(metrics: Partial<FieldMinistryMetrics>): void {
    this.updateAndPersist({ fieldMetrics: { ...this.currentInfo().fieldMetrics, ...metrics } });
  }

  updateMinisterialTraining(training: Partial<MinisterialTrainingMetrics>): void {
    this.updateAndPersist({ ministerialTraining: { ...this.currentInfo().ministerialTraining, ...training } });
  }

  updateChurchDevelopment(dev: Partial<ChurchDevelopmentMetrics>): void {
    this.updateAndPersist({ churchDevelopment: { ...this.currentInfo().churchDevelopment, ...dev } });
  }

  updateEssentials(essentials: string[]): void {
    this.updateAndPersist({ essentialsToDevelop: essentials });
  }

  updateBudgetBreakdown(budget: Partial<PillarBudgetBreakdown>): void {
    this.updateAndPersist({ budgetBreakdown: { ...this.currentInfo().budgetBreakdown, ...budget } });
  }

  setActiveYear(year: number): void {
    const cur = this.currentInfo();
    this.updateAndPersist({ teamData: { ...cur.teamData, year, isYearClosed: false } });
    serviceBus.publish('ui:toast', {
      title: `Año Ministerial Ajustado a ${year}`,
      message: `El ciclo activo de la misión ahora es ${year}.`,
      type: 'info',
      duration: 3000,
    });
  }

  setGlobalActiveYear(year: number): void {
    syncGlobalMinisterialYear(STORAGE_PREFIX, year);
    this.setActiveYear(year);
  }

  closeYear(): void {
    const cur = this.currentInfo();
    const history = archiveYearCycle(cur);
    backupPdmPlansSnapshot(cur.teamId, cur.teamData.year);
    this.updateAndPersist({ teamData: { ...cur.teamData, isYearClosed: true }, annualMetricsHistory: history });
    serviceBus.publish('ui:toast', {
      title: `Año ${cur.teamData.year} Cerrado`,
      message: 'Datos y planes archivados exitosamente.',
      type: 'success',
      duration: 3000,
    });
  }

  startNewYear(nextYear: number): void {
    const cur = this.currentInfo();
    const history = archiveYearCycle(cur);
    backupPdmPlansSnapshot(cur.teamId, cur.teamData.year);
    const cleanState = createCleanCycleState(nextYear, cur);
    this.updateAndPersist({ ...cleanState, annualMetricsHistory: history });
    serviceBus.publish('cycle:year_changed', { teamId: cur.teamId, closingYear: cur.teamData.year, nextYear });
    serviceBus.publish('ui:toast', {
      title: `Ciclo ${nextYear} Inicializado`,
      message: 'Período limpio listo para nueva planificación.',
      type: 'success',
      duration: 3000,
    });
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
  }

  private updateAndPersist(partial: Partial<TeamGeneralInfo>): void {
    this.currentInfo.update((prev) => {
      const next = { ...prev, ...partial, updatedAt: new Date().toISOString() };
      this.persist(prev.teamId, next);
      return next;
    });
  }

  private persist(teamId: string, info: TeamGeneralInfo): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${teamId}`, JSON.stringify(info));
    } catch { /* ignore */ }
  }
}
