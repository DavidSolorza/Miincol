import type { TeamAuditLog } from '../domain/audit.types';

const subMinutes = (mins: number) => new Date(Date.now() - mins * 60 * 1000).toISOString();
const subHours = (hrs: number) => new Date(Date.now() - hrs * 3600 * 1000).toISOString();
const subDays = (days: number) => new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();

export const INITIAL_AUDIT_LOGS_BY_TEAM: Record<string, TeamAuditLog[]> = {
  'team-wayuu': [
    {
      id: 'log-wayuu-1', teamId: 'team-wayuu', teamName: 'Misión Wayúu - Alta Guajira', userName: 'Pr. David Morales', userRole: 'Líder equipo',
      actionType: 'activity_update', title: 'Actualizó estado de actividad', detail: 'Mapeo de clanes y rancherías en territorio',
      fieldModified: 'Estado de Actividad', previousValue: 'Pendiente', newValue: 'En Proceso', phaseId: 'investigacion', timestamp: subMinutes(28),
    },
    {
      id: 'log-wayuu-2', teamId: 'team-wayuu', teamName: 'Misión Wayúu - Alta Guajira', userName: 'Pr. David Morales', userRole: 'Líder equipo',
      actionType: 'login', title: 'Ingreso al portal', detail: 'Inicio de sesión territorial desde Uribia (IP 190.14.22.8)', timestamp: subHours(1.5), ipAddress: '190.14.22.8',
    },
    {
      id: 'log-wayuu-3', teamId: 'team-wayuu', teamName: 'Misión Wayúu - Alta Guajira', userName: 'Pr. David Morales', userRole: 'Líder equipo',
      actionType: 'activity_update', title: 'Modificó presupuesto de actividad', detail: 'Ajuste de presupuesto anual en transporte veredal',
      fieldModified: 'Presupuesto Total', previousValue: '$ 1.200.000', newValue: '$ 1.800.000', phaseId: 'investigacion', timestamp: subDays(1),
    },
  ],
  'team-nasa': [
    {
      id: 'log-nasa-1', teamId: 'team-nasa', teamName: 'Misión Nasa - Tierradentro', userName: 'Aída Secue', userRole: 'Usuario equipo',
      actionType: 'activity_update', title: 'Actualizó estado de actividad', detail: 'Visita pastoral comunitaria a familias de la vereda',
      fieldModified: 'Estado de Actividad', previousValue: 'Pendiente', newValue: 'Completado', phaseId: 'investigacion', timestamp: subMinutes(50),
    },
    {
      id: 'log-nasa-2', teamId: 'team-nasa', teamName: 'Misión Nasa - Tierradentro', userName: 'Pr. Marcos Chocué', userRole: 'Líder equipo',
      actionType: 'login', title: 'Ingreso al portal', detail: 'Inicio de sesión desde Toribío (IP 181.48.91.14)', timestamp: subHours(4), ipAddress: '181.48.91.14',
    },
  ],
  'team-pastos': [
    {
      id: 'log-pastos-1', teamId: 'team-pastos', teamName: 'Misión Pastos - Nariño', userName: 'Pr. Camilo Canticus', userRole: 'Líder equipo',
      actionType: 'objective_update', title: 'Modificó meta de objetivo', detail: 'Ampliación de meta de mediano plazo en Cumbal',
      fieldModified: 'Meta Mediano Plazo', previousValue: '1 círculo de oración', newValue: '3 círculos de oración y consejería familiar', timestamp: subHours(6),
    },
    {
      id: 'log-pastos-2', teamId: 'team-pastos', teamName: 'Misión Pastos - Nariño', userName: 'Hno. Jairo Guanga', userRole: 'Usuario equipo',
      actionType: 'login', title: 'Ingreso al portal', detail: 'Inicio de sesión territorial desde Cumbal (IP 190.158.12.3)', timestamp: subHours(7), ipAddress: '190.158.12.3',
    },
  ],
  'team-embera': [
    {
      id: 'log-embera-1', teamId: 'team-embera', teamName: 'Misión Emberá - Alto San Juan', userName: 'Pr. Elkin Ismare', userRole: 'Líder equipo',
      actionType: 'login', title: 'Ingreso al portal', detail: 'Conexión desde Tadó (IP 186.84.110.5)', timestamp: subHours(12), ipAddress: '186.84.110.5',
    },
  ],
  'team-arhuaco': [
    {
      id: 'log-arhuaco-1', teamId: 'team-arhuaco', teamName: 'Misión Arhuaco - Sierra Nevada', userName: 'Pr. José Izquierdo', userRole: 'Líder equipo',
      actionType: 'login', title: 'Ingreso al portal', detail: 'Inicio de sesión desde Nabusímake (IP 181.54.20.90)', timestamp: subHours(18), ipAddress: '181.54.20.90',
    },
  ],
};

export const getInitialAuditLogs = (teamId: string, leaderName = 'Líder de Misión'): TeamAuditLog[] => {
  return INITIAL_AUDIT_LOGS_BY_TEAM[teamId] || [
    {
      id: `log-${teamId}-init`, teamId, userName: leaderName, actionType: 'login',
      title: 'Ingreso al portal', detail: 'Sesión activa de equipo territorial', timestamp: subHours(3),
    },
  ];
};
