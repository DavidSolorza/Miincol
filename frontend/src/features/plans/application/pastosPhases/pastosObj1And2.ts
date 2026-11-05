import type { Objective } from '../../domain/plan.types';

// Datos iniciales de los objetivos 1 y 2 para la fase de Entrenamiento de la Misión Pastos
export const pastosObj1And2: Objective[] = [
  {
    number: 1,
    title: 'Identificación y Ejercicio de Dones y Delegación Ministerial',
    description: 'Facilitar a los creyentes los espacios para identificar y ejercer dones: Enseñanza, dirección, alabanza.',
    activities: [
      {
        id: 'act-pastos-12', objectiveNumber: 1, stage: 'Liderazgo',
        description: 'Generar espacios para la enseñanza bíblica, grupo de oración, alabanza en la comunidad de fe.',
        currentSituation: 'Espacios definidos por reuniones dominicales y en semana.',
        mediumTermGoal: '40% de los creyentes involucrados al primer semestre.',
        longTermGoal: '60% de los creyentes de manera activa.',
        responsible: 'Hugo Solorza', frequency: 'constante', timesPerYear: 10,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 7,
        unitBudget: 0, totalBudget: 0, state: 'En Proceso', obstacles: 'Tiempo disponible.',
      },
      {
        id: 'act-pastos-13', objectiveNumber: 1, stage: 'Liderazgo',
        description: 'Delegar al liderazgo de la iglesia la dirección y desarrollo de estudios.',
        currentSituation: 'Todavía hay temor en asumir responsabilidades.',
        mediumTermGoal: 'Planeación del primer semestre con acompañamiento.',
        longTermGoal: 'Planeación del segundo semestre realizada por el liderazgo.',
        responsible: 'Hugo Solorza', frequency: 'semestral', timesPerYear: 2,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 7,
        unitBudget: 0, totalBudget: 0, state: 'En Proceso', obstacles: '',
      },
      {
        id: 'act-pastos-14', objectiveNumber: 1, stage: 'Liderazgo',
        description: 'Capacitar a maestras de niños, expositores, alabanza, tesorero y secretaria.',
        currentSituation: 'Se hace necesario dar capacitación afín a cada ministerio.',
        mediumTermGoal: 'Herramientas básicas entregadas.', longTermGoal: 'Ministerios autónomos.',
        responsible: 'Hugo Solorza', frequency: 'mensual', timesPerYear: 10,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 20,
        unitBudget: 50000, totalBudget: 500000, state: 'Completado', obstacles: '',
      },
    ],
  },
  {
    number: 2,
    title: 'Crecimiento Integral y Sana Convivencia Eclesial',
    description: 'Desarrollar actividades que fortalezcan el crecimiento integral (visitas, evangelismo, oración).',
    activities: [
      {
        id: 'act-pastos-18', objectiveNumber: 2, stage: 'Liderazgo',
        description: 'Fomentar espacio semanal para estudio bíblico familiar dirigido por el padre.',
        currentSituation: 'No hay hábito de estudio bíblico en los hogares.',
        mediumTermGoal: 'Mitad de la iglesia realiza estudio bíblico familiar en julio.',
        longTermGoal: 'Totalidad de la iglesia realiza estudio bíblico familiar.',
        responsible: 'Diana Viera', frequency: 'Constante', timesPerYear: 10,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 20,
        unitBudget: 0, totalBudget: 0, state: 'Pendiente', obstacles: '',
      },
      {
        id: 'act-pastos-20', objectiveNumber: 2, stage: 'Liderazgo',
        description: 'Mantener plan de visitas pastorales para acercamiento entre hermanos.',
        currentSituation: 'Visitas poco comunes por factores culturales.',
        mediumTermGoal: 'Mejorar relaciones, orar juntos y sobrellevar cargas.',
        longTermGoal: 'Crecimiento y fortalecimiento relacional.',
        responsible: 'Diana Viera', frequency: 'Diaria', timesPerYear: 10,
        startDate: '2026-02-22', endDate: '2026-12-16', totalWeeks: 42, remainingWeeks: 9,
        unitBudget: 2000, totalBudget: 660000, state: 'En Proceso', obstacles: '',
      },
      {
        id: 'act-pastos-21', objectiveNumber: 2, stage: 'Liderazgo',
        description: 'Transporte para visitas y reuniones a las afueras de Cumbal.',
        currentSituation: 'Recorridos en carro o moto según clima.',
        mediumTermGoal: 'Cobertura rural garantizada.', longTermGoal: 'Presencia continua en veredas.',
        responsible: 'Hugo Solorza', frequency: 'Mensual', timesPerYear: 10,
        startDate: '2026-02-10', endDate: '2026-12-02', totalWeeks: 42, remainingWeeks: 20,
        unitBudget: 300000, totalBudget: 3300000, state: 'Pendiente', obstacles: '',
      },
    ],
  },
];
