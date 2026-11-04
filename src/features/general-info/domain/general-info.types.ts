/**
 * Modelo de Dominio Puro para la Información General Macro de Equipos
 * Basado en la estructura oficial de la hoja de cálculo de campo.
 */

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
  population: string;
  territory: string;
  teamLeader: string;
  evangelicalCongregationsCount: number;
  evangelicalBelieversCount: number;
  members: TeamMemberContact[];
}

export interface FieldMinistryMetrics {
  firstTimeContactedCount: number; // Personas contactadas por 1ra vez
  interestedInGospelCount: number; // Personas interesadas en el evangelio
  heardGospelCount: number; // Personas que escucharon el evangelio
  seekingGodCount: number; // Personas que están buscando a Dios
  gospelResponseOpportunitiesCount: number; // Oportunidades de responder
  newBelieversCount: number; // Creyentes que creyeron
  baptizedCount: number; // Creyentes bautizados
  regularBibleStudyParticipantsCount: number; // Personas en estudios bíblicos regulares
  personalMentorshipCount: number; // Mentorías personales
  newGroupsMeetingInYearCount: number; // Nuevos grupos reuniéndose
  ministerialTrainingCount: number; // Entrenamiento ministerial
  biblicalTrainingCount: number; // Entrenamiento bíblico
  pastoralPracticalTrainingCount: number; // Entrenamiento pastoral práctico
  otherAreasTrainingCount: number; // Entrenamiento en otras áreas
  newGroupsWithChurchPerspectiveCount: number; // Nuevos grupos con perspectiva de iglesia
  finalChurchesCount: number; // Número final de iglesias
  churchGenerationsCount: number; // Generaciones de iglesias
}

export interface PillarBudgetBreakdown {
  investigacionBudget: number;
  encarnacionBudget: number;
  evangelizacionBudget: number;
  entrenamientoBudget: number;
  autocuidadoBudget: number;
}

export interface TeamGeneralInfo {
  teamId: string;
  teamData: GeneralTeamData;
  fieldMetrics: FieldMinistryMetrics;
  budgetBreakdown: PillarBudgetBreakdown;
  updatedAt: string;
}
