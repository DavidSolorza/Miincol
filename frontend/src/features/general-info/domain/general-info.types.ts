export interface TeamMemberContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  location?: string;
}

export interface GeneralTeamData {
  teamName: string;
  year: number;
  isYearClosed?: boolean;
  population: string;
  territory: string;
  teamLeader: string;
  leaderPhone?: string;
  evangelicalCongregationsCount: number;
  evangelicalBelieversCount: number;
  members: TeamMemberContact[];
}

export interface FieldMinistryMetrics {
  firstTimeContactedCount: number;
  interestedInGospelCount: number;
  heardGospelCount: number;
  seekingGodCount: number;
  gospelResponseOpportunitiesCount: number;
  newBelieversCount: number;
  baptizedCount: number;
  regularBibleStudyParticipantsCount: number;
  personalMentorshipCount: number;
  newGroupsMeetingInYearCount: number;
}

export interface MinisterialTrainingMetrics {
  practicalMinisterialTrainingCount: number;
  otherAreasTrainingCount: number;
  pastoralPracticalTrainingCount: number;
  biblicalTrainingCount: number;
  newChurchesPlantingTrainingCount: number;
}

export interface ChurchDevelopmentMetrics {
  groupsWithChurchPerspectiveCount: number;
  finalChurchesCount: number;
  firstGenChurchesCount: number;
  secondGenChurchesCount: number;
  thirdGenChurchesCount: number;
  lostFirstGenChurchesCount: number;
  lostSecondGenChurchesCount: number;
  lostThirdGenChurchesCount: number;
}

export interface PillarBudgetBreakdown {
  investigacionBudget: number;
  encarnacionBudget: number;
  evangelizacionBudget: number;
  entrenamientoBudget: number;
  autocuidadoBudget: number;
  executedTotalBudget?: number;
}

export interface TeamGeneralInfo {
  teamId: string;
  teamData: GeneralTeamData;
  essentialsToDevelop: string[];
  fieldMetrics: FieldMinistryMetrics;
  ministerialTraining: MinisterialTrainingMetrics;
  churchDevelopment: ChurchDevelopmentMetrics;
  budgetBreakdown: PillarBudgetBreakdown;
  annualMetricsHistory?: Record<number, {
    fieldMetrics: FieldMinistryMetrics;
    training: MinisterialTrainingMetrics;
    church: ChurchDevelopmentMetrics;
  }>;
  updatedAt: string;
}
