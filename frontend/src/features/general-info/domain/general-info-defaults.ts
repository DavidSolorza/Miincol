import type { TeamGeneralInfo, TeamMemberContact } from './general-info.types';

export function buildDefaultMembers(leader: string, teamMembers?: string[]): TeamMemberContact[] {
  const clean = leader.replace(/^(pr\.|pastor|hna\.|hno\.)\s+/i, '').trim().toLowerCase();
  const list = teamMembers && teamMembers.length > 0 ? teamMembers : [leader, 'Aída Secue', 'Santiago Ramos'];
  return list.map((name, i) => ({
    id: `m_${i + 1}`,
    name: (name.toLowerCase().includes(clean) || clean.includes(name.toLowerCase())) ? leader : name,
    role: i === 0 ? 'Líder Pastoral' : (i === 1 ? 'Obrera Misionera / Salud' : 'Evangelista / Discipulado'),
    phone: `+57 31${i} 450 ${1000 + i * 111}`,
  }));
}

export function createDefaultGeneralInfo(teamId: string, teamName = 'Misión Territorial', leader = 'Líder en Campo', teamMembers?: string[]): TeamGeneralInfo {
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
    annualMetricsHistory: {
      2025: {
        year: 2025,
        closedAt: '2025-12-31T23:59:59.000Z',
        fieldMetrics: {
          firstTimeContactedCount: 10, interestedInGospelCount: 4, heardGospelCount: 2, seekingGodCount: 1,
          gospelResponseOpportunitiesCount: 1, newBelieversCount: 1, baptizedCount: 0,
          regularBibleStudyParticipantsCount: 30, personalMentorshipCount: 8, newGroupsMeetingInYearCount: 0,
        },
        training: { practicalMinisterialTrainingCount: 6, otherAreasTrainingCount: 0, pastoralPracticalTrainingCount: 2, biblicalTrainingCount: 5, newChurchesPlantingTrainingCount: 0 },
        church: { groupsWithChurchPerspectiveCount: 0, finalChurchesCount: 1, firstGenChurchesCount: 1, secondGenChurchesCount: 0, thirdGenChurchesCount: 0, lostFirstGenChurchesCount: 0, lostSecondGenChurchesCount: 0, lostThirdGenChurchesCount: 0 },
        budgetBreakdown: { investigacionBudget: 0, encarnacionBudget: 0, evangelizacionBudget: 0, entrenamientoBudget: 10000000, autocuidadoBudget: 0, executedTotalBudget: 9800000 },
        essentialsToDevelop: ['1. Liderazgo'],
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

