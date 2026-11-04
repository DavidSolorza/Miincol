import { appendAuditLog } from '../../audit/application/auditStorage';
import { serviceBus } from '../../../core/bus';
import type { Activity } from '../domain/plan.types';

// Helpers para registrar y publicar eventos de auditoría sobre planes y actividades PDM
// Registra un evento de auditoría en almacenamiento y lo emite en el bus de eventos
export const logPlanAudit = (
  teamId: string,
  leaderName: string,
  actionType: 'activity_add' | 'activity_update' | 'activity_delete' | 'objective_update' | 'objective_add',
  title: string,
  detail: string,
  phaseId?: string
) => {
  appendAuditLog(teamId, { teamId, userName: leaderName, actionType, title, detail, phaseId }, leaderName);
  serviceBus.publish('audit:log', { teamId, userName: leaderName, actionType, title, detail, phaseId });
};

// Construye el detalle descriptivo del cambio en una actividad y registra su auditoría
export const logActivityUpdateAudit = (
  teamId: string,
  leaderName: string,
  fields: Partial<Activity>,
  phaseId: string
) => {
  let detail = 'Actualizó detalles de actividad';
  if (fields.state) detail = `Cambió estado a "${fields.state}"`;
  else if (fields.totalBudget !== undefined) detail = `Actualizó presupuesto a $${fields.totalBudget.toLocaleString('es-CO')} COP`;
  else if (fields.responsible) detail = `Asignó responsable: ${fields.responsible}`;
  else if (fields.description) detail = `Modificó descripción: ${fields.description.slice(0, 35)}...`;

  logPlanAudit(teamId, leaderName, 'activity_update', 'Modificó actividad PDM', detail, phaseId);
};
