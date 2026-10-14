import { useState, useMemo, useEffect } from 'react';
import type {
  TeamSupervisionSummary,
  NationalKpis,
  CreateTeamDto,
  TeamHealthStatus,
} from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';

const STORAGE_KEY_TEAMS = 'misincol_teams_v2';

export const INITIAL_NATIONAL_TEAMS: TeamSupervisionSummary[] = [
  {
    id: 'team-wayuu',
    slug: 'team-wayuu',
    name: 'Misión Wayuu - Alta Guajira',
    ethnicity: 'Wayuu',
    region: 'Uribia, Manaure y Nazaret',
    department: 'La Guajira (Caribe)',
    leader: 'Pr. David Morales',
    leaderPhone: '+57 312 458 9201',
    membersCount: 4,
    members: ['David Morales', 'Carlos Pushaina', 'Dra. Ruth Mendoza', 'Marcela Uriana'],
    currentPhaseId: 'investigacion',
    currentPhaseName: '1. Investigación',
    progressPercentage: 45,
    totalBudget: 14900000,
    executedBudget: 6705000,
    totalActivities: 6,
    completedActivities: 2,
    inProgressActivities: 3,
    pendingActivities: 1,
    themeColor: '#8B251E', // Misincol Terracota
    accessPin: 'wayuu2026',
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
    slug: 'team-nasa',
    name: 'Misión Nasa - Tierradentro',
    ethnicity: 'Nasa (Páez)',
    region: 'Belalcázar, Inzá y Mosoco',
    department: 'Cauca (Andina)',
    leader: 'Pr. Marcos Chocué',
    leaderPhone: '+57 320 812 4433',
    membersCount: 3,
    members: ['Marcos Chocué', 'Aída Secue', 'Santiago Ramos'],
    currentPhaseId: 'encarnacion',
    currentPhaseName: '2. Encarnación',
    progressPercentage: 68,
    totalBudget: 18200000,
    executedBudget: 12376000,
    totalActivities: 8,
    completedActivities: 5,
    inProgressActivities: 2,
    pendingActivities: 1,
    themeColor: '#10B981', // Verde Selva Andina
    accessPin: 'nasa2026',
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
    slug: 'team-embera',
    name: 'Misión Emberá Chamí - Risaralda',
    ethnicity: 'Emberá',
    region: 'Resguardo Gitó Dokabú, Pueblo Rico',
    department: 'Risaralda (Pacífico/Andina)',
    leader: 'Pr. Daniel Guasaruka',
    leaderPhone: '+57 314 670 1198',
    membersCount: 3,
    members: ['Daniel Guasaruka', 'Claudia Nariquiamo', 'Esteban Forastero'],
    currentPhaseId: 'evangelizacion',
    currentPhaseName: '3. Evangelización',
    progressPercentage: 75,
    totalBudget: 16800000,
    executedBudget: 12600000,
    totalActivities: 7,
    completedActivities: 5,
    inProgressActivities: 2,
    pendingActivities: 0,
    themeColor: '#8B5CF6', // Violeta Montaña
    accessPin: 'embera2026',
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
    slug: 'team-arhuaco',
    name: 'Misión Iku - Sierra Nevada',
    ethnicity: 'Arhuaco (Iku)',
    region: 'Nabusímake y cuenca río San Sebastián',
    department: 'Cesar / Magdalena (Caribe)',
    leader: 'Pr. Eliécer Torres',
    leaderPhone: '+57 311 905 3280',
    membersCount: 3,
    members: ['Eliécer Torres', 'Misael Izquierdo', 'Lucía Villafaña'],
    currentPhaseId: 'investigacion',
    currentPhaseName: '1. Investigación',
    progressPercentage: 33,
    totalBudget: 12500000,
    executedBudget: 4125000,
    totalActivities: 5,
    completedActivities: 1,
    inProgressActivities: 3,
    pendingActivities: 1,
    themeColor: '#D97706', // Oro Cálido Ancestral
    accessPin: 'arhuaco2026',
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
    slug: 'team-nukak',
    name: 'Misión Nukak Makú - Selva de Guaviare',
    ethnicity: 'Nukak',
    region: 'Charras, Caño Regente y El Retorno',
    department: 'Guaviare (Amazonía)',
    leader: 'Pr. Samuel Caicedo',
    leaderPhone: '+57 318 722 0945',
    membersCount: 4,
    members: ['Samuel Caicedo', 'Dra. Elena Cruz', 'Mateo Beltrán', 'Yamid Peñaloza'],
    currentPhaseId: 'encarnacion',
    currentPhaseName: '2. Encarnación',
    progressPercentage: 20,
    totalBudget: 21000000,
    executedBudget: 4200000,
    totalActivities: 6,
    completedActivities: 1,
    inProgressActivities: 2,
    pendingActivities: 3,
    themeColor: '#0D9488', // Verde Agua Profunda
    accessPin: 'nukak2026',
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

const PHASE_NAMES_MAP: Record<PhaseType, string> = {
  investigacion: '1. Investigación',
  encarnacion: '2. Encarnación',
  evangelizacion: '3. Evangelización',
  entrenamiento: '4. Entrenamiento',
  autocuidado: '5. Autocuidado',
};

export const useAdminDashboard = () => {
  // Carga reactiva de equipos desde localStorage
  const [teams, setTeams] = useState<TeamSupervisionSummary[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TEAMS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error al cargar equipos de almacenamiento local:', e);
    }
    return INITIAL_NATIONAL_TEAMS;
  });

  // Guardar en localStorage cuando cambie el listado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
    } catch (e) {
      console.warn('Error al persistir equipos en almacenamiento local:', e);
    }
  }, [teams]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [phaseFilter, setPhaseFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Filtrado reactivo de equipos
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        team.name.toLowerCase().includes(search) ||
        team.leader.toLowerCase().includes(search) ||
        team.ethnicity.toLowerCase().includes(search) ||
        team.region.toLowerCase().includes(search) ||
        team.department.toLowerCase().includes(search);

      const matchPhase = phaseFilter === 'ALL' || team.currentPhaseId === phaseFilter;
      const matchStatus = statusFilter === 'ALL' || team.healthStatus === statusFilter;
      const matchDepartment =
        departmentFilter === 'ALL' ||
        team.department.toLowerCase().includes(departmentFilter.toLowerCase());

      return matchSearch && matchPhase && matchStatus && matchDepartment;
    });
  }, [teams, searchTerm, phaseFilter, statusFilter, departmentFilter]);

  // Cálculo dinámico de KPIs a Nivel Nacional
  const nationalKpis: NationalKpis = useMemo(() => {
    let totalMissionaries = 0;
    let totalNationalBudget = 0;
    let totalExecutedBudget = 0;
    let totalActivities = 0;
    let completedActivities = 0;
    let activeCriticalAlerts = 0;
    let totalProgressSum = 0;

    teams.forEach((team) => {
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

    const totalTeams = teams.length;
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
  }, [teams]);

  // CRUD 1: Crear nuevo equipo / misión
  const handleCreateTeam = (dto: CreateTeamDto) => {
    const slug =
      dto.slug?.trim() ||
      'team-' +
        dto.ethnicity
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

    const members = dto.members && dto.members.length > 0 ? dto.members : [dto.leader];

    const newTeam: TeamSupervisionSummary = {
      id: slug,
      slug,
      name: dto.name,
      ethnicity: dto.ethnicity,
      region: dto.region,
      department: dto.department,
      leader: dto.leader,
      leaderPhone: dto.leaderPhone,
      membersCount: members.length,
      members,
      currentPhaseId: dto.currentPhaseId,
      currentPhaseName: PHASE_NAMES_MAP[dto.currentPhaseId] || '1. Investigación',
      progressPercentage: 0,
      totalBudget: dto.totalBudget,
      executedBudget: 0,
      totalActivities: 4,
      completedActivities: 0,
      inProgressActivities: 1,
      pendingActivities: 3,
      themeColor: dto.themeColor || '#8B251E',
      accessPin: dto.accessPin?.trim() || `${slug.replace(/^team-/, '')}2026`,
      healthStatus: dto.healthStatus || 'Optimo',
      lastUpdate: 'Justo ahora',
      activeInitiatives: [
        {
          title: `Diagnóstico y acercamiento inicial con pueblo ${dto.ethnicity}`,
          responsible: dto.leader,
          state: 'En Proceso',
        },
        {
          title: `Establecimiento de base operativa en ${dto.region}`,
          responsible: dto.leader,
          state: 'Pendiente',
        },
      ],
      criticalAlert: dto.criticalAlertMessage
        ? {
            type: dto.criticalAlertType || 'Logística',
            message: dto.criticalAlertMessage,
            reportedAt: 'Reportada hoy',
          }
        : undefined,
    };

    setTeams((prev) => [newTeam, ...prev]);
    return newTeam;
  };

  // CRUD 2: Actualizar equipo existente
  const handleUpdateTeam = (teamId: string, updates: Partial<TeamSupervisionSummary>) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId || t.slug === teamId) {
          const merged = { ...t, ...updates, lastUpdate: 'Justo ahora' };
          if (updates.currentPhaseId) {
            merged.currentPhaseName =
              PHASE_NAMES_MAP[updates.currentPhaseId] || merged.currentPhaseName;
          }
          if (updates.members) {
            merged.membersCount = updates.members.length;
          }
          return merged;
        }
        return t;
      })
    );
  };

  // CRUD 3: Eliminar equipo
  const handleDeleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId && t.slug !== teamId));
  };

  // Cambio rápido de fase (inline selector)
  const handlePhaseChange = (teamId: string, newPhaseId: PhaseType) => {
    handleUpdateTeam(teamId, {
      currentPhaseId: newPhaseId,
      currentPhaseName: PHASE_NAMES_MAP[newPhaseId],
    });
  };

  // Cambio rápido de salud operativa
  const handleStatusChange = (teamId: string, newStatus: TeamHealthStatus) => {
    handleUpdateTeam(teamId, { healthStatus: newStatus });
  };

  // Restablecer catálogo inicial
  const resetToDefaults = () => {
    setTeams(INITIAL_NATIONAL_TEAMS);
    localStorage.removeItem(STORAGE_KEY_TEAMS);
  };

  return {
    teams: filteredTeams,
    allTeams: teams,
    allTeamsCount: teams.length,
    nationalKpis,
    searchTerm,
    setSearchTerm,
    phaseFilter,
    setPhaseFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    handleCreateTeam,
    handleUpdateTeam,
    handleDeleteTeam,
    handlePhaseChange,
    handleStatusChange,
    resetToDefaults,
  };
};
