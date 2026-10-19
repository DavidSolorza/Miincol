import React, { useState } from 'react';
import { useTeamAudit } from '../application/useTeamAudit';
import { AuditLogItem } from './auditModal/AuditLogItem';
import { History, X, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  leaderName: string;
}

export const TeamAuditModal: React.FC<Props> = ({ isOpen, onClose, teamId, teamName, leaderName }) => {
  const { logs, telemetry } = useTeamAudit(teamId, leaderName);
  const [filter, setFilter] = useState<'all' | 'login' | 'activity' | 'note'>('all');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filter === 'login') return log.actionType === 'login';
    if (filter === 'activity') return log.actionType.startsWith('activity_') || log.actionType.startsWith('objective_');
    if (filter === 'note') return log.actionType.startsWith('note_');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-2xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200/90 flex flex-col max-h-[85vh] overflow-hidden animate-slideUp">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-xl text-white shadow-2xs bg-gradient-to-br from-[#8B251E] to-[#E67324]">
              <History className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-stone-900 truncate">Bitácora de Telemetría y Monitoreo</h3>
              <p className="text-[11px] text-stone-500 truncate">{teamName} &bull; Líder: <strong className="text-stone-700">{leaderName}</strong></p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-2 bg-stone-50/80 border-b border-stone-200/60 flex items-center justify-between text-[11px] flex-wrap gap-2">
          <span>Último acceso registrado: <strong className="text-stone-800">{telemetry.lastLoginFormatted}</strong></span>
          <div className="flex items-center gap-1">
            {(['all', 'login', 'activity', 'note'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                  filter === tab ? 'bg-stone-900 text-white shadow-2xs' : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {tab === 'all' ? 'Todos' : tab === 'login' ? 'Ingresos' : tab === 'activity' ? 'Actividades' : 'Notas'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-stone-50 border border-dashed border-stone-200 space-y-2">
              <ShieldAlert className="w-7 h-7 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-stone-600">No hay registros de auditoría para este filtro</p>
            </div>
          ) : (
            filteredLogs.map((log) => <AuditLogItem key={log.id} log={log} />)
          )}
        </div>
      </div>
    </div>
  );
};
