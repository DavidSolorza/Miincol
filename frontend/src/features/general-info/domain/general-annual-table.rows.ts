import type { FieldMinistryMetrics } from './general-info.types';

export interface TableMetricRowDef {
  key: keyof FieldMinistryMetrics;
  label: string;
  section?: string;
  default2025: number;
}

export const ANNUAL_TABLE_ROWS: TableMetricRowDef[] = [
  {
    key: 'firstTimeContactedCount',
    label: 'Personas contactadas por primera vez',
    section: '1. Contacto Inicial',
    default2025: 10,
  },
  {
    key: 'interestedInGospelCount',
    label: 'Personas interesadas en el evangelio',
    default2025: 4,
  },
  {
    key: 'seekingGodCount',
    label: 'De los que escucharon, ¿cuántos buscan a Dios?',
    section: '2. Comunicando',
    default2025: 1,
  },
  {
    key: 'gospelResponseOpportunitiesCount',
    label: 'Tuvieron la oportunidad de responder a Cristo',
    default2025: 1,
  },
  {
    key: 'newBelieversCount',
    label: 'Creyeron el mensaje del Evangelio',
    section: '3. Respondiendo',
    default2025: 1,
  },
  {
    key: 'baptizedCount',
    label: 'Creyentes que fueron bautizados',
    default2025: 0,
  },
  {
    key: 'regularBibleStudyParticipantsCount',
    label: 'Personas en estudios bíblicos regulares',
    section: '4. Consolidando',
    default2025: 30,
  },
  {
    key: 'personalMentorshipCount',
    label: 'Personas mentoreadas personalmente',
    default2025: 8,
  },
];

