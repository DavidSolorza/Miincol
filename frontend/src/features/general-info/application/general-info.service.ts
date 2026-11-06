import { Injectable, signal, computed } from '@angular/core';
import type { TeamGeneralInfo, TeamMemberContact, GeneralTeamData, FieldMinistryMetrics, PillarBudgetBreakdown } from '../domain/general-info.types';
import { serviceBus } from '../../../core/bus';

const STORAGE_PREFIX = 'misincol_general_info_';

function buildDefaultMembers(leader: string, teamMembers?: string[]): TeamMemberContact[] {
  const clean = leader.replace(/^(pr\.|pastor|hna\.|hno\.)\s+/i, '').trim().toLowerCase();
  const list = teamMembers && teamMembers.length > 0 ? teamMembers : [leader, 'Aída Secue', 'Santiago Ramos'];
  return list.map((name, i) => {
    const isLead = name.toLowerCase().includes(clean) || clean.includes(name.toLowerCase());
    return {
      id: `m_${i + 1}`,
      name: isLead ? leader : name,
      role: isLead ? 'Líder Pastoral' : (i === 1 ? 'Obrera Misionera / Salud' : 'Evangelista / Discipulado'),
      phone: `+57 31${i} 450 ${1000 + i * 111}`,
    };
  });
}

function createDefaultGeneralInfo(teamId: string, teamName = 'Misión Territorial', leader = 'Líder en Campo', teamMembers?: string[]): TeamGeneralInfo {
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
      members: buildDefaultMembers(leader, teamMembers),
    },
    fieldMetrics: {
      firstTimeContactedCount: 120, interestedInGospelCount: 45, heardGospelCount: 80,
      seekingGodCount: 30, gospelResponseOpportunitiesCount: 25, newBelieversCount: 14,
      baptizedCount: 6, regularBibleStudyParticipantsCount: 22, personalMentorshipCount: 8,
      newGroupsMeetingInYearCount: 3, ministerialTrainingCount: 5, biblicalTrainingCount: 12,
      pastoralPracticalTrainingCount: 4, otherAreasTrainingCount: 6,
      newGroupsWithChurchPerspectiveCount: 2, finalChurchesCount: 1, churchGenerationsCount: 2,
    },
    budgetBreakdown: {
      investigacionBudget: 2500000, encarnacionBudget: 3200000, evangelizacionBudget: 4800000,
      entrenamientoBudget: 3100000, autocuidadoBudget: 1900000,
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

  loadTeamInfo(teamId: string, teamName?: string, leader?: string, teamMembers?: string[]): void {
    const key = `${STORAGE_PREFIX}${teamId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: TeamGeneralInfo = JSON.parse(saved);
        const hasPlaceholder = parsed.teamData.members.some((m) => m.name === 'Obrero Misionero');
        const countMismatch = !!teamMembers?.length && parsed.teamData.members.length < teamMembers.length;
        if (hasPlaceholder || countMismatch) {
          parsed.teamData.members = buildDefaultMembers(leader || parsed.teamData.teamLeader, teamMembers);
          this.persist(teamId, parsed);
        }
        this.currentInfo.set(parsed);
        return;
      }
    } catch { /* ignore fallback */ }
    const fresh = createDefaultGeneralInfo(teamId, teamName, leader, teamMembers);
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

