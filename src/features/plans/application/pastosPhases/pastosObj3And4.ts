import type { Objective } from '../../domain/plan.types';

export const pastosObj3And4: Objective[] = [
  {
    number: 3,
    title: 'Herramientas de Análisis Bíblico y Liderazgo Autónomo',
    description: 'Brindar y reforzar herramientas necesarias (análisis bíblico, narrativa, elaboración de estudios).',
    activities: [
      {
        id: 'act-pastos-24', objectiveNumber: 3, stage: 'Desarrollo Eclesial',
        description: 'Fortalecer el uso de herramientas para estudio y enseñanza bíblica con 10 líderes.',
        currentSituation: 'Grupo de 10 hermanos que lideran la iglesia.',
        mediumTermGoal: '2 talleres sobre estudio de las escrituras en primer semestre.',
        longTermGoal: '2 talleres más en el segundo semestre.',
        responsible: 'Hugo Solorza', frequency: 'Mensual', timesPerYear: 10,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 20,
        unitBudget: 0, totalBudget: 0, state: 'En Proceso', obstacles: '',
      },
      {
        id: 'act-pastos-28', objectiveNumber: 3, stage: 'Liderazgo',
        description: 'PROYECTO ESPECIAL: Retiro familiar para fortalecer relaciones intrafamiliares y oxigenación.',
        currentSituation: 'Necesidad de renovación espiritual y descanso en comunidad.',
        mediumTermGoal: 'Retiro planificado.', longTermGoal: 'Familias unidas.',
        responsible: 'Diana Viera', frequency: '1', timesPerYear: 1,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 20,
        unitBudget: 0, totalBudget: 6000000, state: 'Pendiente', obstacles: '',
      },
    ],
  },
  {
    number: 4,
    title: 'Plan de Trabajo Evangelístico y Nuevos Grupos',
    description: 'Establecer plan de trabajo evangelístico para iniciar al menos 4 nuevos grupos durante el año.',
    activities: [
      {
        id: 'act-pastos-30', objectiveNumber: 4, stage: 'Liderazgo',
        description: 'Visitas y relaciones de confianza en veredas apartadas (Panán, Chiles, Boyera, San Diego).',
        currentSituation: 'Lugares apartados sin grupo de estudio directo.',
        mediumTermGoal: 'Acercamiento a 4 comunidades.', longTermGoal: 'Grupos bíblicos sembrados.',
        responsible: 'Hugo Solorza', frequency: 'Mensual', timesPerYear: 10,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 20,
        unitBudget: 0, totalBudget: 0, state: 'Pendiente', obstacles: '',
      },
      {
        id: 'act-pastos-32', objectiveNumber: 4, stage: 'Liderazgo',
        description: 'Actividades en hogares para acercar a nuevas personas (mujeres, padres de familia).',
        currentSituation: 'Necesidad de mayor apertura en los hogares.',
        mediumTermGoal: 'Reuniones mensuales activas.', longTermGoal: 'Crecimiento de la iglesia.',
        responsible: 'Hugo Solorza', frequency: 'Mensual', timesPerYear: 10,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 20,
        unitBudget: 30000, totalBudget: 300000, state: 'Pendiente', obstacles: '',
      },
    ],
  },
];
