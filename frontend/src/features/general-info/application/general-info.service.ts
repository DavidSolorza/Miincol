import { Injectable, signal, computed } from '@angular/core';
import type { TeamGeneralInfo, TeamMemberContact, GeneralTeamData, FieldMinistryMetrics, PillarBudgetBreakdown } from '../domain/general-info.types';
import { serviceBus } from '../../../core/bus';

const STORAGE_PREFIX = 'misincol_general_info_';

function createDefaultGeneralInfo(teamId: string, teamName = 'Misión Territorial', leader = 'Líder en Campo'): TeamGeneralInfo {
  return {
    teamId,
    teamData: {
      teamName,
      year: 2026,
      population: 'Territorio Indígena',
      territory: 'Colombia',
      teamLeader: leader,
      evangelicalCongregationsCount: 1,
      evangelicalBelieversCount: 25,
      members: [
        { id: 'm1', name: leader, role: 'Líder Pastoral', phone: '+57 300 000 0000', email: 'lider@misincol.org', location: 'Campo' },
        { id: 'm2', name: 'Obrero Misionero', role: 'Evangelista', phone: '+57 310 000 0000', email: 'campo@misincol.org', location: 'Sede' },
      ],
    },
    fieldMetrics: {
      firstTimeContactedCount: 120,
      interestedInGospelCount: 45,
      heardGospelCount: 80,
      seekingGodCount: 30,
      gospelResponseOpportunitiesCount: 25,
      newBelieversCount: 14,
      baptizedCount: 6,
      regularBibleStudyParticipantsCount: 22,
      personalMentorshipCount: 8,
      newGroupsMeetingInYearCount: 3,
      ministerialTrainingCount: 5,
      biblicalTrainingCount: 12,
      pastoralPracticalTrainingCount: 4,
      otherAreasTrainingCount: 6,
      newGroupsWithChurchPerspectiveCount: 2,
      finalChurchesCount: 1,
      churchGenerationsCount: 2,
    },
    budgetBreakdown: {
      investigacionBudget: 2500000,
      encarnacionBudget: 3200000,
      evangelizacionBudget: 4800000,
      entrenamientoBudget: 3100000,
      autocuidadoBudget: 1900000,
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

  loadTeamInfo(teamId: string, teamName?: string, leader?: string): void {
    const key = `${STORAGE_PREFIX}${teamId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        this.currentInfo.set(JSON.parse(saved));
        return;
      }
    } catch { /* ignore fallback */ }
    const fresh = createDefaultGeneralInfo(teamId, teamName, leader);
    this.currentInfo.set(fresh);
    this.persist(teamId, fresh);
  }

  updateTeamData(data: Partial<GeneralTeamData>): void {
    this.currentInfo.update((prev) => {
      const next = { ...prev, teamData: { ...prev.teamData, ...data }, updatedAt: new Date().toISOString() };
      this.persist(prev.teamId, next);
      return next;
    });
  }

  updateFieldMetrics(metrics: Partial<FieldMinistryMetrics>): void {
    this.currentInfo.update((prev) => {
      const next = { ...prev, fieldMetrics: { ...prev.fieldMetrics, ...metrics }, updatedAt: new Date().toISOString() };
      this.persist(prev.teamId, next);
      return next;
    });
  }

  updateBudgetBreakdown(budget: Partial<PillarBudgetBreakdown>): void {
    this.currentInfo.update((prev) => {
      const next = { ...prev, budgetBreakdown: { ...prev.budgetBreakdown, ...budget }, updatedAt: new Date().toISOString() };
      this.persist(prev.teamId, next);
      return next;
    });
  }

  addMember(member: Omit<TeamMemberContact, 'id'>): void {
    const id = `m_${Date.now()}`;
    this.currentInfo.update((prev) => {
      const next = {
        ...prev,
        teamData: { ...prev.teamData, members: [...prev.teamData.members, { ...member, id }] },
        updatedAt: new Date().toISOString(),
      };
      this.persist(prev.teamId, next);
      return next;
    });
  }

  removeMember(memberId: string): void {
    this.currentInfo.update((prev) => {
      const next = {
        ...prev,
        teamData: { ...prev.teamData, members: prev.teamData.members.filter((m) => m.id !== memberId) },
        updatedAt: new Date().toISOString(),
      };
      this.persist(prev.teamId, next);
      return next;
    });
  }

  private persist(teamId: string, info: TeamGeneralInfo): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${teamId}`, JSON.stringify(info));
      serviceBus.publish('ui:toast', {
        title: 'Información General Guardada',
        message: 'Datos macro sincronizados en almacenamiento local.',
        type: 'success',
        duration: 2500,
      });
    } catch { /* ignore */ }
  }
}

