import type { PhasePlan } from '../../domain/plan.types';

// Configuración inicial del plan y objetivos para la fase de Evangelización Contextualizada
export const evangelizacionPhase: PhasePlan = {
  phaseId: 'evangelizacion',
  phaseName: 'Evangelización Contextualizada',
  startDate: '2027-01-15',
  teamName: 'Misión Wayuu - Alta Guajira',
  teamLeader: 'Pr. David Morales',
  teamMembers: ['David Morales', 'Carlos Pushaina', 'Dra. Ruth Mendoza', 'Marcela Uriana'],
  objectives: [
    {
      number: 1,
      title: 'Historias Bíblicas Orales (Cronología Bíblica)',
      description: 'Transmisión oral contextualizada del mensaje de salvación a través de relatos tradicionales.',
      activities: [
        {
          id: 'act-ev-1', objectiveNumber: 1, stage: 'Tradición Oral',
          description: 'Círculos nocturnos de narración bíblica alrededor del fogón',
          currentSituation: 'Cultura altamente oral; el 85% de la población no lee en papel.',
          mediumTermGoal: '30 historias del Antiguo y Nuevo Testamento memorizadas por líderes locales.',
          longTermGoal: 'Movimiento natural de reproducción de historias bíblicas en rancherías.',
          responsible: 'Carlos Pushaina', frequency: 'Semanal', timesPerYear: 45,
          startDate: '2027-01-20', endDate: '2027-11-30', totalWeeks: 45, remainingWeeks: 45,
          unitBudget: 50000, totalBudget: 2250000, state: 'Pendiente', obstacles: 'Viento nocturno e iluminación.',
        },
      ],
    },
    {
      number: 2,
      title: 'Música y Expresión Artística Indígena',
      description: 'Composición de alabanzas utilizando instrumentos tradicionales (Kásha, Talira).',
      activities: [
        {
          id: 'act-ev-2', objectiveNumber: 2, stage: 'Canto Autóctono',
          description: 'Talleres de composición de canciones espirituales en ritmos wayuu',
          currentSituation: 'Uso predominante de música foránea no representativa.',
          mediumTermGoal: 'Cancionero con 15 cánticos autóctonos grabados en audio.',
          longTermGoal: 'Alabanza que exalta a Dios desde la identidad cultural indígena.',
          responsible: 'Marcela Uriana', frequency: 'Mensual', timesPerYear: 10,
          startDate: '2027-02-01', endDate: '2027-10-31', totalWeeks: 39, remainingWeeks: 39,
          unitBudget: 120000, totalBudget: 1200000, state: 'Pendiente', obstacles: 'Equipos de grabación portátil.',
        },
      ],
    },
    {
      number: 3,
      title: 'Grupos Familiares de Oración en las Rancherías',
      description: 'Reuniones de enramada para intercesión por enfermos y estudio de la Palabra.',
      activities: [
        {
          id: 'act-ev-3', objectiveNumber: 3, stage: 'Comunión',
          description: 'Reuniones de oración y comunión familiar en 3 rancherías fijas',
          currentSituation: 'Apertura de hogares respetados para recibir la palabra de vida.',
          mediumTermGoal: 'Consolidación de 3 grupos familiares autónomos.',
          longTermGoal: 'Comunidad de creyentes que se reúne bajo liderazgo wayuu.',
          responsible: 'David Morales', frequency: 'Semanal', timesPerYear: 48,
          startDate: '2027-02-15', endDate: '2027-12-15', totalWeeks: 43, remainingWeeks: 43,
          unitBudget: 40000, totalBudget: 1920000, state: 'Pendiente', obstacles: 'Desplazamientos en pastoreo.',
        },
      ],
    },
    {
      number: 4,
      title: 'Bautismos y Primeros Frutos de la Fe',
      description: 'Celebración y compromiso público de los nuevos discípulos.',
      activities: [
        {
          id: 'act-ev-4', objectiveNumber: 4, stage: 'Testimonio Público',
          description: 'Encuentro bautismal comunitario en el mar o represa comunitaria',
          currentSituation: 'Personas interesadas en sellar su pacto con Dios.',
          mediumTermGoal: 'Bautismo de 15 creyentes adultos con respaldo familiar.',
          longTermGoal: 'Establecimiento formal de la iglesia indígena local.',
          responsible: 'David Morales', frequency: 'Semestral', timesPerYear: 2,
          startDate: '2027-06-01', endDate: '2027-12-01', totalWeeks: 26, remainingWeeks: 26,
          unitBudget: 500000, totalBudget: 1000000, state: 'Pendiente', obstacles: 'Logística de transporte.',
        },
      ],
    },
  ],
};
