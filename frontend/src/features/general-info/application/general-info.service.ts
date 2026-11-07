import { Injectable, signal, computed } from '@angular/core';
import type { TeamGeneralInfo, TeamMemberContact, GeneralTeamData, FieldMinistryMetrics, MinisterialTrainingMetrics, ChurchDevelopmentMetrics, PillarBudgetBreakdown } from '../domain/general-info.types';
import { serviceBus } from '../../../core/bus';

const STORAGE_PREFIX = 'misincol_general_info_v3_';

function buildDefaultMembers(leader: string, teamMembers?: string[]): TeamMemberContact[] {
  const clean = leader.replace(/^(pr\.|pastor|hna\.|hno\.)\s+/i, '').trim().toLowerCase();
  const list = teamMembers && teamMembers.length > 0 ? teamMembers : [leader, 'Aída Secue', 'Santiago Ramos'];
  return list.map((name, i) => ({
    id: `m_${i + 1}`,
    name: (name.toLowerCase().includes(clean) || clean.includes(name.toLowerCase())) ? leader : name,
    role: i === 0 ? 'Líder Pastoral' : (i === 1 ? 'Obrera Misionera / Salud' : 'Evangelista / Discipulado'),
    phone: `+57 31${i} 450 ${1000 + i * 111}`,
  }));
}

function createDefaultGeneralInfo(teamId: string, teamName = 'Misión Territorial', leader = 'Líder en Campo', teamMembers?: string[]): TeamGeneralInfo {
  return {
    teamId,
    teamData: {
      teamName, year: 2026, isYearClosed: false, population: '120.000', territory: 'Cumbal, Nariño',
      teamLeader: leader, leaderPhone: '+57 312 450 1234', evangelicalCongregationsCount: 4, evangelicalBelieversCount: 400,
      members: buildDefaultMembers(leader, teamMembers),
    },
    essentialsToDevelop: ['1. Liderazgo', '2. Desarrollo Eclesial'],
    fieldMetrics: {
      firstTimeContactedCount: 15, interestedInGospelCount: 6, heardGospelCount: 4, seekingGodCount: 2,
      gospelResponseOpportunitiesCount: 2, newBelieversCount: 2, baptizedCount: 0,
      regularBibleStudyParticipantsCount: 45, personalMentorshipCount: 12, newGroupsMeetingInYearCount: 1,
    },
    ministerialTraining: {
      practicalMinisterialTrainingCount: 10, otherAreasTrainingCount: 0, pastoralPracticalTrainingCount: 3,
      biblicalTrainingCount: 9, newChurchesPlantingTrainingCount: 0,
    },
    churchDevelopment: {
      groupsWithChurchPerspectiveCount: 1, finalChurchesCount: 1, firstGenChurchesCount: 1,
      secondGenChurchesCount: 0, thirdGenChurchesCount: 0, lostFirstGenChurchesCount: 0,
      lostSecondGenChurchesCount: 0, lostThirdGenChurchesCount: 0,
    },
    budgetBreakdown: {
      investigacionBudget: 0, encarnacionBudget: 0, evangelizacionBudget: 0,
      entrenamientoBudget: 11210000, autocuidadoBudget: 0, executedTotalBudget: 4500000,
    },
    updatedAt: new Date().toISOString(),
  };
}

@Injectable({ providedIn: 'root' })
export class GeneralInfoService {
  readonly currentInfo = signal<TeamGeneralInfo>(createDefaultGeneralInfo('team-wayuu'));

  readonly totalBudget = computed(() => {
    const b = this.currentInfo().budgetBreakdown;
    return b.investigacionBudget + b.encarnacionBudget + b.evangelizacionBudget + b.entrenamientoBudget + b.autocuidadoBudget;
  });

  readonly budgetExecutionPercentage = computed(() => {
    const tot = this.totalBudget();
    const exec = this.currentInfo().budgetBreakdown.executedTotalBudget || 0;
    return tot > 0 ? Math.min(100, Math.round((exec / tot) * 100)) : 0;
  });

  loadTeamInfo(teamId: string, teamName?: string, leader?: string, teamMembers?: string[]): void {
    const key = `${STORAGE_PREFIX}${teamId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        this.currentInfo.set(JSON.parse(saved));
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

  closeYear(): void {
    this.updateTeamData({ isYearClosed: true });
  }

  startNewYear(nextYear: number): void {
    this.updateTeamData({ year: nextYear, isYearClosed: false });
  }

  addMember(member: Omit<TeamMemberContact, 'id'>): void {
    const id = `m_${Date.now()}`;
    const members = [...this.currentInfo().teamData.members, { ...member, id }];
    this.updateTeamData({ members });
  }

  removeMember(memberId: string): void {
    const members = this.currentInfo().teamData.members.filter((m) => m.id !== memberId);
    this.updateTeamData({ members });
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
      serviceBus.publish('ui:toast', { title: 'Información General Guardada', message: 'Datos sincronizados.', type: 'success', duration: 2000 });
    } catch { /* ignore */ }
  }
}
