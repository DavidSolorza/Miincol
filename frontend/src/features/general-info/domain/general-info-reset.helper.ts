import type {
  TeamGeneralInfo,
  FieldMinistryMetrics,
  MinisterialTrainingMetrics,
  ChurchDevelopmentMetrics,
} from './general-info.types';

// Retorna metricas de campo en cero para comenzar un nuevo ciclo
export function createCleanFieldMetrics(): FieldMinistryMetrics {
  return {
    firstTimeContactedCount: 0,
    interestedInGospelCount: 0,
    heardGospelCount: 0,
    seekingGodCount: 0,
    gospelResponseOpportunitiesCount: 0,
    newBelieversCount: 0,
    baptizedCount: 0,
    regularBibleStudyParticipantsCount: 0,
    personalMentorshipCount: 0,
    newGroupsMeetingInYearCount: 0,
  };
}

// Retorna contadores limpios de entrenamiento ministerial
export function createCleanMinisterialTraining(): MinisterialTrainingMetrics {
  return {
    practicalMinisterialTrainingCount: 0,
    otherAreasTrainingCount: 0,
    pastoralPracticalTrainingCount: 0,
    biblicalTrainingCount: 0,
    newChurchesPlantingTrainingCount: 0,
  };
}

// Retorna contadores limpios de desarrollo de iglesias
export function createCleanChurchDevelopment(): ChurchDevelopmentMetrics {
  return {
    groupsWithChurchPerspectiveCount: 0,
    finalChurchesCount: 0,
    firstGenChurchesCount: 0,
    secondGenChurchesCount: 0,
    thirdGenChurchesCount: 0,
    lostFirstGenChurchesCount: 0,
    lostSecondGenChurchesCount: 0,
    lostThirdGenChurchesCount: 0,
  };
}

// Genera el estado limpio para la transicion al nuevo anio ministerial
export function createCleanCycleState(nextYear: number, current: TeamGeneralInfo): Partial<TeamGeneralInfo> {
  return {
    teamData: {
      ...current.teamData,
      year: nextYear,
      isYearClosed: false,
    },
    fieldMetrics: createCleanFieldMetrics(),
    ministerialTraining: createCleanMinisterialTraining(),
    churchDevelopment: createCleanChurchDevelopment(),
    budgetBreakdown: {
      ...current.budgetBreakdown,
      executedTotalBudget: 0,
    },
  };
}

