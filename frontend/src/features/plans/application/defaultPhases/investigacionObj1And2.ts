import type { Objective } from '../../domain/plan.types';

// Datos predeterminados de los objetivos 1 y 2 para la fase de Investigación (Misión Wayuu)
export const investigacionObj1And2: Objective[] = [
  {
    number: 1,
    title: 'Mapeo Demográfico y Social de Rancherías',
    description: 'Levantamiento censal, mapeo de clanes familiares y detección de necesidades primarias de agua, nutrición y educación.',
    activities: [
      {
        id: 'act-101', objectiveNumber: 1, stage: 'Diagnóstico Territorial',
        description: 'Visita exploratoria y diálogo con autoridades tradicionales (palabreros) en 5 rancherías',
        currentSituation: 'Falta de censos actualizados y dispersión geográfica severa.',
        mediumTermGoal: 'Relación de confianza sólida con líderes locales y permisos comunitarios.',
        longTermGoal: 'Apertura integral al acompañamiento ministerial y social en 15 comunidades.',
        responsible: 'David Morales & Carlos Pushaina', frequency: 'Mensual', timesPerYear: 12,
        startDate: '2026-02-15', endDate: '2026-12-15', totalWeeks: 44, remainingWeeks: 30,
        unitBudget: 350000, totalBudget: 4200000, state: 'En Proceso',
        obstacles: 'Estado de las trochas durante temporada de lluvias y dialectos locales.',
      },
      {
        id: 'act-102', objectiveNumber: 1, stage: 'Salud y Nutrición',
        description: 'Brigada de tamizaje nutricional y diagnóstico de acceso a fuentes de agua subterránea',
        currentSituation: 'Severa escasez de agua potable; pozos artesanales salobres.',
        mediumTermGoal: 'Informe geo-referenciado de 8 pozos y estado nutricional de 120 niños.',
        longTermGoal: 'Establecimiento de filtro de agua comunitario y centro de atención primaria.',
        responsible: 'Dra. Ruth Mendoza', frequency: 'Trimestral', timesPerYear: 4,
        startDate: '2026-03-01', endDate: '2026-11-30', totalWeeks: 39, remainingWeeks: 27,
        unitBudget: 850000, totalBudget: 3400000, state: 'Pendiente',
        obstacles: 'Requerimiento de vehículos 4x4 y cadenas de frío para insumos médicos.',
      },
    ],
  },
  {
    number: 2,
    title: 'Comprensión Lingüística y Cosmovisión Wayuunaiki',
    description: 'Inmersión cultural, registro de terminología espiritual y estudio comparativo de cosmovisión ancestral.',
    activities: [
      {
        id: 'act-201', objectiveNumber: 2, stage: 'Estudio Lingüístico',
        description: 'Sesiones de aprendizaje e inmersión en Wayuunaiki con maestros bilingües nativos',
        currentSituation: 'Equipo misionero posee dominio básico (30%) de la lengua materna.',
        mediumTermGoal: 'Alcanzar fluidez conversacional intermedia (nivel B1) en 9 meses.',
        longTermGoal: 'Predicación y consejería pastoral directa en Wayuunaiki sin intérprete.',
        responsible: 'Marcela Uriana & David Morales', frequency: 'Semanal', timesPerYear: 40,
        startDate: '2026-02-10', endDate: '2026-11-20', totalWeeks: 40, remainingWeeks: 26,
        unitBudget: 75000, totalBudget: 3000000, state: 'En Proceso',
        obstacles: 'Disponibilidad de maestros en temporada de pastoreo de caprinos.',
      },
      {
        id: 'act-202', objectiveNumber: 2, stage: 'Etnografía Espiritual',
        description: 'Documentación de relatos orales sobre Maleiwa y conceptos de mediación espiritual',
        currentSituation: 'Falta de material etnográfico contextualizado para el equipo misionero.',
        mediumTermGoal: 'Glosario de 150 términos teológicos con equivalencias culturales respetuosas.',
        longTermGoal: 'Publicación de guía pedagógica ministerial para nuevos obreros en territorio.',
        responsible: 'Carlos Pushaina', frequency: 'Bimensual', timesPerYear: 6,
        startDate: '2026-03-15', endDate: '2026-10-15', totalWeeks: 30, remainingWeeks: 20,
        unitBudget: 200000, totalBudget: 1200000, state: 'Completado',
        obstacles: 'Reserva inicial de algunos ancianos respetables de la casta.',
      },
    ],
  },
];
