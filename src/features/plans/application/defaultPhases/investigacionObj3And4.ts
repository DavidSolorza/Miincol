import type { Objective } from '../../domain/plan.types';

export const investigacionObj3And4: Objective[] = [
  {
    number: 3,
    title: 'Articulación Interinstitucional y Redes de Apoyo',
    description: 'Establecimiento de alianzas con autoridades indígenas y líderes locales.',
    activities: [
      {
        id: 'act-301', objectiveNumber: 3, stage: 'Relaciones Institucionales',
        description: 'Reuniones de concertación con asociaciones de autoridades tradicionales de Uribia',
        currentSituation: 'Poco conocimiento previo del alcance de MISINCOL.',
        mediumTermGoal: 'Firma de memorando de entendimiento.',
        longTermGoal: 'Alianza permanente de cooperación.',
        responsible: 'David Morales', frequency: 'Bimensual', timesPerYear: 5,
        startDate: '2026-02-20', endDate: '2026-10-30', totalWeeks: 36, remainingWeeks: 24,
        unitBudget: 280000, totalBudget: 1400000, state: 'En Proceso', obstacles: 'Trámites burocráticos.',
      },
    ],
  },
  {
    number: 4,
    title: 'Planificación Operativa y Presupuestaria de Siguiente Fase',
    description: 'Evaluación de viabilidad de radicación permanente y estructuración de la fase de Encarnación.',
    activities: [
      {
        id: 'act-401', objectiveNumber: 4, stage: 'Logística de Vivienda',
        description: 'Búsqueda de predio o enramada para centro misionero de permanencia',
        currentSituation: 'Hospedaje temporal en cabecera municipal con altos costos.',
        mediumTermGoal: 'Aprobación de la asamblea comunitaria.',
        longTermGoal: 'Hogar misionero integrado pacíficamente a la ranchería.',
        responsible: 'Carlos Pushaina & David Morales', frequency: 'Mensual', timesPerYear: 6,
        startDate: '2026-04-01', endDate: '2026-09-30', totalWeeks: 26, remainingWeeks: 18,
        unitBudget: 450000, totalBudget: 2700000, state: 'Pendiente', obstacles: 'Disponibilidad de agua dulce.',
      },
    ],
  },
];
