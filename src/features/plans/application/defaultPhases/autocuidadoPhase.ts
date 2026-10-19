import type { PhasePlan } from '../../domain/plan.types';

export const autocuidadoPhase: PhasePlan = {
  phaseId: 'autocuidado',
  phaseName: 'Autocuidado Integral y Sostenibilidad del Obrero',
  startDate: '2026-03-01',
  teamName: 'Misión Wayuu - Alta Guajira',
  teamLeader: 'Pr. David Morales',
  teamMembers: ['David Morales', 'Carlos Pushaina', 'Dra. Ruth Mendoza', 'Marcela Uriana'],
  objectives: [
    {
      number: 1,
      title: 'Salud Física y Descanso Preventivo del Equipo',
      description: 'Garantizar chequeos médicos periódicos, adecuada hidratación y pausas activas contra el estrés.',
      activities: [
        {
          id: 'act-ac-1', objectiveNumber: 1, stage: 'Salud Preventiva',
          description: 'Chequeo médico integral de control y reposo de 5 días fuera del territorio',
          currentSituation: 'Exposición continua a calor superior a 38°C y desgaste físico severo.',
          mediumTermGoal: 'Cero casos de deshidratación severa o agotamiento crónico (burnout).',
          longTermGoal: 'Misioneros saludables y con longevidad ministerial en campo.',
          responsible: 'Dra. Ruth Mendoza', frequency: 'Trimestral', timesPerYear: 4,
          startDate: '2026-03-10', endDate: '2026-12-10', totalWeeks: 39, remainingWeeks: 28,
          unitBudget: 650000, totalBudget: 2600000, state: 'En Proceso', obstacles: 'Resistencia a detener labores.',
        },
      ],
    },
    {
      number: 2,
      title: 'Cuidado Emocional y Retiros Espirituales',
      description: 'Tiempos de silencio, oración comunitaria, consejería y renovación pastoral.',
      activities: [
        {
          id: 'act-ac-2', objectiveNumber: 2, stage: 'Renovación Espiritual',
          description: 'Retiro trimestral de oración y desahogo pastoral con capellán externo',
          currentSituation: 'Cargas espirituales pesadas y soledad geográfica.',
          mediumTermGoal: 'Fortalecimiento de la salud emocional de cada integrante del equipo.',
          longTermGoal: 'Vida espiritual vibrante y unidad fraterna inquebrantable.',
          responsible: 'David Morales', frequency: 'Trimestral', timesPerYear: 4,
          startDate: '2026-03-20', endDate: '2026-11-30', totalWeeks: 36, remainingWeeks: 25,
          unitBudget: 450000, totalBudget: 1800000, state: 'En Proceso', obstacles: 'Coordinación de vuelos para el capellán.',
        },
      ],
    },
    {
      number: 3,
      title: 'Protección Familiar y Educación de los Hijos',
      description: 'Acompañamiento a cónyuges y procesos pedagógicos de los hijos de los misioneros.',
      activities: [
        {
          id: 'act-ac-3', objectiveNumber: 3, stage: 'Familia Misionera',
          description: 'Fondo de apoyo para tutorías virtuales y materiales educativos de los niños',
          currentSituation: 'Escuelas rurales lejanas y con baja cobertura de bachillerato.',
          mediumTermGoal: 'Los hijos avanzan con normalidad en su calendario escolar oficial.',
          longTermGoal: 'Familias misioneras consolidadas y felices de servir en territorio.',
          responsible: 'Marcela Uriana', frequency: 'Mensual', timesPerYear: 10,
          startDate: '2026-02-15', endDate: '2026-11-30', totalWeeks: 41, remainingWeeks: 29,
          unitBudget: 350000, totalBudget: 3500000, state: 'En Proceso', obstacles: 'Conectividad a internet intermitente.',
        },
      ],
    },
    {
      number: 4,
      title: 'Fondo de Emergencia y Respaldo Territorial',
      description: 'Asegurar caja menor y seguro de evacuación médica para contingencias en territorio.',
      activities: [
        {
          id: 'act-ac-4', objectiveNumber: 4, stage: 'Seguridad y Evacuación',
          description: 'Suscripción a servicio de ambulancia y fondo de contingencias médicas',
          currentSituation: 'La Guajira presenta riesgos de mordeduras de ofidios y accidentes viales.',
          mediumTermGoal: 'Protocolo de evacuación médica probado y operativo en menos de 2 horas.',
          longTermGoal: 'Tranquilidad y cobertura integral para todo el equipo en campo.',
          responsible: 'David Morales', frequency: 'Anual', timesPerYear: 1,
          startDate: '2026-02-01', endDate: '2026-12-31', totalWeeks: 48, remainingWeeks: 32,
          unitBudget: 2400000, totalBudget: 2400000, state: 'Completado', obstacles: 'Cobertura de señal celular.',
        },
      ],
    },
  ],
};
