import { useState, useMemo } from 'react';
import type { TeamSupervisionSummary, NationalKpis } from '../domain/admin.types';

export const NATIONAL_TEAMS_DATA: TeamSupervisionSummary[] = [
  {
    id: 'team-wayuu',
    name: 'Misión Wayuu - Alta Guajira',
    ethnicity: 'Wayuu',
    region: 'Uribia, Manaure y Nazaret',
    department: 'La Guajira (Caribe)',
    leader: 'Pr. David Morales',
    leaderPhone: '+57 312 458 9201',
    membersCount: 4,
    currentPhaseId: 'investigacion',
    currentPhaseName: '1. Investigación ',
    progressPercentage: 45,
    totalBudget: 14900000,
    executedBudget: 6705000,
    totalActivities: 6,
    completedActivities: 2,
    inProgressActivities: 3,
    pendingActivities: 1,
    activeInitiatives: [
      {
        title: 'Visita exploratoria y diálogo con palabreros en 5 rancherías',
        responsible: 'David Morales & Carlos Pushaina',
        state: 'En Proceso',
      },
      {
        title: 'Sesiones de aprendizaje e inmersión en Wayuunaiki',
        responsible: 'Marcela Uriana',
        state: 'En Proceso',
      },
      {
        title: 'Brigada de tamizaje nutricional y pozos de agua subterránea',
        responsible: 'Dra. Ruth Mendoza',
        state: 'Pendiente',
      },
    ],
    criticalAlert: {
      type: 'Salud',
      message: 'Escasez severa de agua potable en 3 rancherías del norte; pozos artesanales salobres.',
      reportedAt: 'Hace 2 días',
    },
    healthStatus: 'Atención',
    lastUpdate: 'Hoy, 09:30 AM',
  },
  {
    id: 'team-nasa',
    name: 'Misión Nasa - Tierradentro',
    ethnicity: 'Nasa (Páez)',
    region: 'Belalcázar, Inzá y Mosoco',
    department: 'Cauca (Andina)',
    leader: 'Pr. Marcos Chocué',
    leaderPhone: '+57 320 812 4433',
    membersCount: 3,
    currentPhaseId: 'encarnacion',
    currentPhaseName: '2. Encarnación ',
    progressPercentage: 68,
    totalBudget: 18200000,
    executedBudget: 12376000,
    totalActivities: 8,
    completedActivities: 5,
    inProgressActivities: 2,
    pendingActivities: 1,
    activeInitiatives: [
      {
        title: 'Participación en mingas comunitarias de cosecha de café',
        responsible: 'Marcos Chocué',
        state: 'Completado',
      },
      {
        title: 'Capacitación en primeros auxilios a guardias indígenas',
        responsible: 'Aída Secue',
        state: 'En Proceso',
      },
      {
        title: 'Círculo de oración y diálogo en lengua Nasa Yuwe',
        responsible: 'Santiago Ramos',
        state: 'En Proceso',
      },
    ],
    criticalAlert: {
      type: 'Logística',
      message: 'Deslizamientos en la Transversal del Libertador retrasan entrega de insumos médicos.',
      reportedAt: 'Hace 4 horas',
    },
    healthStatus: 'Atención',
    lastUpdate: 'Ayer, 05:15 PM',
  },
  {
    id: 'team-embera',
    name: 'Misión Emberá Chamí - Risaralda',
    ethnicity: 'Emberá',
    region: 'Resguardo Gitó Dokabú, Pueblo Rico',
    department: 'Risaralda (Pacífico/Andina)',
    leader: 'Pr. Daniel Guasaruka',
    leaderPhone: '+57 314 670 1198',
    membersCount: 3,
    currentPhaseId: 'evangelizacion',
    currentPhaseName: '3. Evangelización ',
    progressPercentage: 75,
    totalBudget: 16800000,
    executedBudget: 12600000,
    totalActivities: 7,
    completedActivities: 5,
    inProgressActivities: 2,
    pendingActivities: 0,
    activeInitiatives: [
      {
        title: 'Círculos nocturnos de relatos orales bíblicos en Emberá',
        responsible: 'Daniel Guasaruka',
        state: 'En Proceso',
      },
      {
        title: 'Composición de cánticos de alabanza con flautas y tambores nativos',
        responsible: 'Claudia Nariquiamo',
        state: 'Completado',
      },
      {
        title: 'Preparación de candidatos para primer bautismo comunitario',
        responsible: 'Esteban Forastero',
        state: 'En Proceso',
      },
    ],
    healthStatus: 'Optimo',
    lastUpdate: 'Hoy, 08:00 AM',
  },
  {
    id: 'team-arhuaco',
    name: 'Misión Iku - Sierra Nevada',
    ethnicity: 'Arhuaco (Iku)',
    region: 'Nabusímake y cuenca río San Sebastián',
    department: 'Cesar / Magdalena (Caribe)',
    leader: 'Pr. Eliécer Torres',
    leaderPhone: '+57 311 905 3280',
    membersCount: 3,
    currentPhaseId: 'investigacion',
    currentPhaseName: '1. Investigación ',
    progressPercentage: 33,
    totalBudget: 12500000,
    executedBudget: 4125000,
    totalActivities: 5,
    completedActivities: 1,
    inProgressActivities: 3,
    pendingActivities: 1,
    activeInitiatives: [
      {
        title: 'Diálogo con autoridades tradicionales y Mamos de la Sierra',
        responsible: 'Eliécer Torres',
        state: 'En Proceso',
      },
      {
        title: 'Glosario de conceptos de espiritualidad en lengua Iku',
        responsible: 'Misael Izquierdo',
        state: 'En Proceso',
      },
    ],
    criticalAlert: {
      type: 'Institucional',
      message: 'Pendiente asamblea general de cabildo gobernador para aval de permanencia médica.',
      reportedAt: 'Hace 3 días',
    },
    healthStatus: 'Atención',
    lastUpdate: 'Hace 2 días',
  },
  {
    id: 'team-nukak',
    name: 'Misión Nukak Makú - Selva de Guaviare',
    ethnicity: 'Nukak',
    region: 'Charras, Caño Regente y El Retorno',
    department: 'Guaviare (Amazonía)',
    leader: 'Pr. Samuel Caicedo',
    leaderPhone: '+57 318 722 0945',
    membersCount: 4,
    currentPhaseId: 'encarnacion',
    currentPhaseName: '2. Encarnación ',
    progressPercentage: 20,
    totalBudget: 21000000,
    executedBudget: 4200000,
    totalActivities: 6,
    completedActivities: 1,
    inProgressActivities: 2,
    pendingActivities: 3,
    activeInitiatives: [
      {
        title: 'Acompañamiento en brigadas de vacunación y bioseguridad',
        responsible: 'Samuel Caicedo & Dra. Elena Cruz',
        state: 'En Proceso',
      },
      {
        title: 'Primeros registros de comunicación básica no invasiva',
        responsible: 'Mateo Beltrán',
        state: 'En Proceso',
      },
    ],
    criticalAlert: {
      type: 'Seguridad',
      message: 'Alta vulnerabilidad inmunológica y presencia de actores irregulares en ríos aledaños.',
      reportedAt: 'Urgente - Ayer',
    },
    healthStatus: 'Crítico',
    lastUpdate: 'Hoy, 07:15 AM',
  },
];

export const useAdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [phaseFilter, setPhaseFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Filtrado de equipos
  const filteredTeams = useMemo(() => {
    return NATIONAL_TEAMS_DATA.filter((team) => {
      const matchSearch =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.ethnicity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPhase = phaseFilter === 'ALL' || team.currentPhaseId === phaseFilter;
      const matchStatus = statusFilter === 'ALL' || team.healthStatus === statusFilter;
      const matchDepartment =
        departmentFilter === 'ALL' || team.department.toLowerCase().includes(departmentFilter.toLowerCase());

      return matchSearch && matchPhase && matchStatus && matchDepartment;
    });
  }, [searchTerm, phaseFilter, statusFilter, departmentFilter]);

  // Cálculo dinámico de KPIs a Nivel Nacional
  const nationalKpis: NationalKpis = useMemo(() => {
    let totalMissionaries = 0;
    let totalNationalBudget = 0;
    let totalExecutedBudget = 0;
    let totalActivities = 0;
    let completedActivities = 0;
    let activeCriticalAlerts = 0;
    let totalProgressSum = 0;

    NATIONAL_TEAMS_DATA.forEach((team) => {
      totalMissionaries += team.membersCount;
      totalNationalBudget += team.totalBudget;
      totalExecutedBudget += team.executedBudget;
      totalActivities += team.totalActivities;
      completedActivities += team.completedActivities;
      totalProgressSum += team.progressPercentage;
      if (team.criticalAlert) {
        activeCriticalAlerts += 1;
      }
    });

    const totalTeams = NATIONAL_TEAMS_DATA.length;
    const nationalAverageProgress =
      totalTeams > 0 ? Math.round(totalProgressSum / totalTeams) : 0;

    return {
      totalTeams,
      totalMissionaries,
      totalNationalBudget,
      totalExecutedBudget,
      nationalAverageProgress,
      activeCriticalAlerts,
      totalActivities,
      completedActivities,
    };
  }, []);

  return {
    teams: filteredTeams,
    allTeamsCount: NATIONAL_TEAMS_DATA.length,
    nationalKpis,
    searchTerm,
    setSearchTerm,
    phaseFilter,
    setPhaseFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
  };
};
