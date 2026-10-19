import type { PhasePlan } from '../../domain/plan.types';

export const encarnacionPhase: PhasePlan = {
  phaseId: 'encarnacion',
  phaseName: 'Encarnación y Convivencia Comunitaria',
  startDate: '2026-06-01',
  teamName: 'Misión Wayuu - Alta Guajira',
  teamLeader: 'Pr. David Morales',
  teamMembers: ['David Morales', 'Carlos Pushaina', 'Dra. Ruth Mendoza', 'Marcela Uriana'],
  objectives: [
    {
      number: 1,
      title: 'Instalación y Vida Cotidiana en Territorio',
      description: 'Vivir bajo las costumbres locales, compartir tareas del hogar y pastoreo de subsistencia.',
      activities: [
        {
          id: 'act-enc-1', objectiveNumber: 1, stage: 'Convivencia Activa',
          description: 'Participación en faenas de siembra tradicional y pastoreo con familias anfitrionas',
          currentSituation: 'Proceso de aclimatación al clima desértico extremo.',
          mediumTermGoal: 'Integración espontánea en la dinámica comunitaria.',
          longTermGoal: 'Testimonio vivo de encarnación pastoral sincera.',
          responsible: 'David Morales', frequency: 'Semanal', timesPerYear: 36,
          startDate: '2026-06-01', endDate: '2026-12-01', totalWeeks: 26, remainingWeeks: 20,
          unitBudget: 50000, totalBudget: 1800000, state: 'Pendiente', obstacles: 'Adaptación física a la escasez hídrica.',
        },
      ],
    },
    {
      number: 2,
      title: 'Servicio Práctico de Salud y Acompañamiento Social',
      description: 'Atención primaria humanitaria y capacitación en higiene preventiva.',
      activities: [
        {
          id: 'act-enc-2', objectiveNumber: 2, stage: 'Salud Comunitaria',
          description: 'Consultas de enfermería y entrega de kits de primeros auxilios',
          currentSituation: 'Puesto de salud estatal más cercano a 4 horas de distancia.',
          mediumTermGoal: 'Atención médica mensual a 80 familias wayuu.',
          longTermGoal: 'Red comunitaria de promotores de salud autóctonos.',
          responsible: 'Dra. Ruth Mendoza', frequency: 'Quincenal', timesPerYear: 20,
          startDate: '2026-06-15', endDate: '2026-12-15', totalWeeks: 26, remainingWeeks: 22,
          unitBudget: 250000, totalBudget: 5000000, state: 'Pendiente', obstacles: 'Abastecimiento de medicamentos básicos.',
        },
      ],
    },
    {
      number: 3,
      title: 'Construcción de Lazos Afectivos y Relaciones de Paz',
      description: 'Acompañamiento a familias en momentos de duelo, resolución pacífica de conflictos y festividades.',
      activities: [
        {
          id: 'act-enc-3', objectiveNumber: 3, stage: 'Relaciones de Confianza',
          description: 'Visitas domiciliarias de escucha y bendición a las enramadas familiares',
          currentSituation: 'Familias con heridas históricas frente a instituciones externas.',
          mediumTermGoal: '50 familias visitadas con diálogo genuino.',
          longTermGoal: 'Paz comunitaria y reconciliación familiar.',
          responsible: 'Marcela Uriana', frequency: 'Semanal', timesPerYear: 24,
          startDate: '2026-07-01', endDate: '2026-12-30', totalWeeks: 26, remainingWeeks: 24,
          unitBudget: 40000, totalBudget: 960000, state: 'Pendiente', obstacles: 'Distancias entre enramadas en desierto.',
        },
      ],
    },
    {
      number: 4,
      title: 'Evaluación y Proyección hacia la Proclamación',
      description: 'Revisión con el comité nacional de Misincol para transición a Evangelización.',
      activities: [
        {
          id: 'act-enc-4', objectiveNumber: 4, stage: 'Auditoría Ministerial',
          description: 'Retiro evaluativo de equipo y redacción de informe de encarnación',
          currentSituation: 'Necesidad de evaluar salud física y espiritual de los misioneros.',
          mediumTermGoal: 'Informe completo con recomendaciones estratégicas.',
          longTermGoal: 'Transición sólida hacia la siembra de la palabra.',
          responsible: 'David Morales', frequency: 'Semestral', timesPerYear: 2,
          startDate: '2026-08-01', endDate: '2026-12-15', totalWeeks: 20, remainingWeeks: 18,
          unitBudget: 600000, totalBudget: 1200000, state: 'Pendiente', obstacles: 'Coordinación de agendas con la directiva.',
        },
      ],
    },
  ],
};
