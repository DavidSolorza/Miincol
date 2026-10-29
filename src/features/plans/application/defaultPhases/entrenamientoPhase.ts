import type { PhasePlan } from '../../domain/plan.types';

// Configuración inicial del plan y objetivos para la fase de Entrenamiento y Discipulado
export const entrenamientoPhase: PhasePlan = {
  phaseId: 'entrenamiento',
  phaseName: 'Entrenamiento y Discipulado de Líderes Locales',
  startDate: '2027-08-01',
  teamName: 'Misión Wayuu - Alta Guajira',
  teamLeader: 'Pr. David Morales',
  teamMembers: ['David Morales', 'Carlos Pushaina', 'Marcela Uriana'],
  objectives: [
    {
      number: 1,
      title: 'Escuela Bíblica Itinerante Indígena (EBII)',
      description: 'Formación teológica modular y pastoral contextualizada para pastores y ancianos wayuu.',
      activities: [
        {
          id: 'act-tr-1', objectiveNumber: 1, stage: 'Formación Teológica',
          description: 'Módulos bimensuales de teología bíblica aplicada y liderazgo pastoral',
          currentSituation: 'Falta de formación bíblica formal adaptada al idioma.',
          mediumTermGoal: '20 líderes capacitados en interpretación bíblica básica.',
          longTermGoal: 'Pastores locales capaces de enseñar fielmente las Escrituras.',
          responsible: 'David Morales & Carlos Pushaina', frequency: 'Bimensual', timesPerYear: 6,
          startDate: '2027-08-15', endDate: '2028-06-30', totalWeeks: 45, remainingWeeks: 45,
          unitBudget: 900000, totalBudget: 5400000, state: 'Pendiente', obstacles: 'Hospedaje y alimentación de alumnos.',
        },
      ],
    },
    {
      number: 2,
      title: 'Desarrollo de Mayordomía y Sostenibilidad Comunitaria',
      description: 'Enseñanza sobre proyectos productivos sostenibles (artesanías, caprinos, huertas solares).',
      activities: [
        {
          id: 'act-tr-2', objectiveNumber: 2, stage: 'Emprendimiento Sostenible',
          description: 'Taller de economía solidaria y venta justa de mochilas y tejidos tradicionales',
          currentSituation: 'Intermediarios pagan precios muy bajos por el arte ancestral.',
          mediumTermGoal: 'Cooperativa de 30 artesanas creyentes con canal de venta directa.',
          longTermGoal: 'Autosostenibilidad financiera de los obreros pastorales autóctonos.',
          responsible: 'Marcela Uriana', frequency: 'Mensual', timesPerYear: 10,
          startDate: '2027-09-01', endDate: '2028-06-30', totalWeeks: 43, remainingWeeks: 43,
          unitBudget: 300000, totalBudget: 3000000, state: 'Pendiente', obstacles: 'Logística de envío y materiales.',
        },
      ],
    },
    {
      number: 3,
      title: 'Mentoría Persona a Persona para Futuros Palabreros de Fe',
      description: 'Discipulado intensivo en vida de oración, carácter cristiano y resolución pacífica.',
      activities: [
        {
          id: 'act-tr-3', objectiveNumber: 3, stage: 'Discipulado Uno a Uno',
          description: 'Jornadas de mentoría semanal con 6 candidatos a ancianos locales',
          currentSituation: 'Líderes jóvenes requieren acompañamiento paternal en la fe.',
          mediumTermGoal: 'Madurez espiritual y testimonio irreprensible en sus clanes.',
          longTermGoal: 'Gobierno de la iglesia en manos de ancianos wayuu consagrados.',
          responsible: 'Carlos Pushaina', frequency: 'Semanal', timesPerYear: 40,
          startDate: '2027-09-15', endDate: '2028-07-15', totalWeeks: 43, remainingWeeks: 43,
          unitBudget: 60000, totalBudget: 2400000, state: 'Pendiente', obstacles: 'Diferencias generacionales.',
        },
      ],
    },
    {
      number: 4,
      title: 'Evaluación de Salida y Traspaso de Liderazgo',
      description: 'Diseño del plan de salida responsable del equipo misionero pionero.',
      activities: [
        {
          id: 'act-tr-4', objectiveNumber: 4, stage: 'Traspaso Misionero',
          description: 'Elaboración de actas de posesión y entrega de administración a la iglesia local',
          currentSituation: 'Necesidad de evitar la dependencia paternalista del misionero.',
          mediumTermGoal: 'Iglesia local dirigiendo su propio plan de desarrollo ministerial.',
          longTermGoal: 'Iglesia indígena misionera enviando obreros a otras etnias.',
          responsible: 'David Morales', frequency: 'Trimestral', timesPerYear: 4,
          startDate: '2028-01-15', endDate: '2028-10-31', totalWeeks: 41, remainingWeeks: 41,
          unitBudget: 400000, totalBudget: 1600000, state: 'Pendiente', obstacles: 'Temor inicial a asumir costos.',
        },
      ],
    },
  ],
};
