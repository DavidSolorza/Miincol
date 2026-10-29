import type { TeamAuditLog } from '../domain/audit.types';

// Funciones auxiliares para generar marcas de tiempo relativas hacia atrás
const subMinutes = (mins: number) => new Date(Date.now() - mins * 60 * 1000).toISOString();
const subHours = (hrs: number) => new Date(Date.now() - hrs * 3600 * 1000).toISOString();
const subDays = (days: number) => new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();

// Registros iniciales de auditoría preconfigurados por equipo territorial
export const INITIAL_AUDIT_LOGS_BY_TEAM: Record<string, TeamAuditLog[]> = {
  'team-wayuu': [
    {
      id: 'log-wayuu-1', teamId: 'team-wayuu', userName: 'Pr. David Morales', actionType: 'activity_update',
      title: 'Actualizó estado de actividad', detail: 'Marcó "Mapeo de clanes y rancherías" como En Proceso',
      phaseId: 'investigacion', timestamp: subMinutes(28),
    },
    {
      id: 'log-wayuu-2', teamId: 'team-wayuu', userName: 'Pr. David Morales', actionType: 'login',
      title: 'Ingreso al portal', detail: 'Inicio de sesión territorial desde Uribia', timestamp: subHours(1.5),
    },
    {
      id: 'log-wayuu-3', teamId: 'team-wayuu', userName: 'Pr. David Morales', actionType: 'note_add',
      title: 'Nota en agenda territorial', detail: 'Registró idea: "Taller de salud comunitaria y filtros de agua"',
      timestamp: subDays(1),
    },
  ],
  'team-nasa': [
    {
      id: 'log-nasa-1', teamId: 'team-nasa', userName: 'Pr. Manuel Chocué', actionType: 'activity_update',
      title: 'Modificó presupuesto de actividad', detail: 'Ajustó presupuesto de transporte veredal a $1.200.000 COP',
      phaseId: 'investigacion', timestamp: subHours(4),
    },
    {
      id: 'log-nasa-2', teamId: 'team-nasa', userName: 'Pr. Manuel Chocué', actionType: 'login',
      title: 'Ingreso al portal', detail: 'Inicio de sesión desde Toribío', timestamp: subHours(4.2),
    },
  ],
  'team-embera': [
    {
      id: 'log-embera-1', teamId: 'team-embera', userName: 'Pr. Wilson Domicó', actionType: 'note_add',
      title: 'Nota en agenda territorial', detail: 'Anotó petición: "Oración por paso seguro en cuenca del río"',
      timestamp: subHours(8),
    },
    {
      id: 'log-embera-2', teamId: 'team-embera', userName: 'Pr. Wilson Domicó', actionType: 'login',
      title: 'Ingreso al portal', detail: 'Inicio de sesión desde Quibdó', timestamp: subHours(8.5),
    },
  ],
  'team-pastos': [
    {
      id: 'log-pastos-1', teamId: 'team-pastos', userName: 'Pr. Segundo Cuaspud', actionType: 'activity_add',
      title: 'Agregó nueva iniciativa PDM', detail: 'Iniciativa: "Círculo de la palabra con mayores del resguardo"',
      phaseId: 'investigacion', timestamp: subHours(2),
    },
    {
      id: 'log-pastos-2', teamId: 'team-pastos', userName: 'Pr. Segundo Cuaspud', actionType: 'login',
      title: 'Ingreso al portal', detail: 'Inicio de sesión desde Cumbal', timestamp: subHours(2.5),
    },
  ],
  'team-nukak': [
    {
      id: 'log-nukak-1', teamId: 'team-nukak', userName: 'Pr. Camilo Gómez', actionType: 'login',
      title: 'Ingreso al portal', detail: 'Conexión satelital intermitente desde San José del Guaviare',
      timestamp: subDays(2),
    },
  ],
  'team-arhuaco': [
    {
      id: 'log-arhuaco-1', teamId: 'team-arhuaco', userName: 'Pr. Hermes Torres', actionType: 'report_generate',
      title: 'Generación de informe PDM', detail: 'Descargó informe ejecutivo de la fase Investigación',
      phaseId: 'investigacion', timestamp: subHours(5),
    },
    {
      id: 'log-arhuaco-2', teamId: 'team-arhuaco', userName: 'Pr. Hermes Torres', actionType: 'login',
      title: 'Ingreso al portal', detail: 'Inicio de sesión desde Nabusímake', timestamp: subHours(6),
    },
  ],
};

// Retorna la bitácora inicial de un equipo o crea un evento de ingreso por defecto
export const getInitialAuditLogs = (teamId: string, leaderName = 'Líder de Misión'): TeamAuditLog[] => {
  return INITIAL_AUDIT_LOGS_BY_TEAM[teamId] || [
    {
      id: `log-${teamId}-init`, teamId, userName: leaderName, actionType: 'login',
      title: 'Ingreso al portal', detail: 'Sesión activa de equipo territorial', timestamp: subHours(3),
    },
  ];
};
