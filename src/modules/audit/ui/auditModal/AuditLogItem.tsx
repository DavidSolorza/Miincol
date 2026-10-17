import React from 'react';
import type { TeamAuditLog } from '../../domain/audit.types';
import { formatTimeHour } from '../../application/auditStorage';
import { LogIn, CheckSquare, PlusCircle, Trash2, Edit3, NotebookPen, FileText } from 'lucide-react';

const ACTION_CONFIG = {
  login: { label: 'Ingreso', icon: LogIn, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  activity_update: { label: 'Actividad Editada', icon: Edit3, bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  activity_add: { label: 'Actividad Creada', icon: PlusCircle, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  activity_delete: { label: 'Actividad Eliminada', icon: Trash2, bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  objective_update: { label: 'Objetivo Editado', icon: CheckSquare, bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  objective_add: { label: 'Objetivo Creado', icon: PlusCircle, bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  note_add: { label: 'Nota / Agenda', icon: NotebookPen, bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  note_delete: { label: 'Nota Eliminada', icon: Trash2, bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  report_generate: { label: 'Informe PDM', icon: FileText, bg: 'bg-stone-50 text-stone-700 border-stone-200' },
};

export const AuditLogItem: React.FC<{ log: TeamAuditLog }> = ({ log }) => {
  const config = ACTION_CONFIG[log.actionType] || ACTION_CONFIG.login;
  const Icon = config.icon;

  return (
    <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:bg-white hover:shadow-xs transition space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.bg}`}>
            <Icon className="w-2.5 h-2.5" />
            <span>{config.label}</span>
          </span>
          <span className="font-bold text-stone-800">{log.title}</span>
        </div>
        <span className="text-[11px] font-mono text-stone-400 shrink-0">{formatTimeHour(log.timestamp)}</span>
      </div>
      <p className="text-xs text-stone-600 pl-0.5">{log.detail}</p>
      <div className="text-[10px] text-stone-400 pl-0.5 pt-0.5 flex items-center justify-between">
        <span>Usuario: <strong className="text-stone-700">{log.userName}</strong></span>
        {log.phaseId && <span className="bg-stone-200/60 px-1.5 py-0.5 rounded text-stone-600 font-semibold uppercase text-[9px]">Fase {log.phaseId}</span>}
      </div>
    </div>
  );
};
