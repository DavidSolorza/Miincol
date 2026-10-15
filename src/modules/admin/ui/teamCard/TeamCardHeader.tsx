import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { Pencil, Trash2, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface Props {
  team: TeamSupervisionSummary;
  themeColor: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TeamCardHeader: React.FC<Props> = ({ team, themeColor, onEdit, onDelete }) => {
  const badgeConfig = {
    Optimo: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', icon: ShieldCheck, label: 'Operación Estable' },
    Atención: { bg: 'bg-amber-50 text-amber-900 border-amber-200', dot: 'bg-amber-500', icon: AlertTriangle, label: 'Requiere Atención' },
    Crítico: { bg: 'bg-rose-50 text-rose-900 border-rose-200', dot: 'bg-rose-600', icon: AlertOctagon, label: 'Alerta Territorial' },
  }[team.healthStatus] || { bg: 'bg-stone-50 text-stone-800 border-stone-200', dot: 'bg-stone-500', icon: ShieldCheck, label: 'Estado Desconocido' };

  const StatusIcon = badgeConfig.icon;

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: themeColor }} />
      <div className="flex items-start justify-between gap-2 pt-0.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs font-['Outfit']"
              style={{ backgroundColor: themeColor }}
            >
              {team.ethnicity}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeConfig.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot}`} />
              <StatusIcon className="w-3 h-3" />
              <span>{badgeConfig.label}</span>
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-stone-900 mt-1 truncate font-['Outfit'] group-hover:text-[#8B251E] transition">
            {team.name}
          </h3>
        </div>

        <div className="flex items-center gap-0.5 opacity-90 group-hover:opacity-100 transition shrink-0">
          {onEdit && (
            <button type="button" onClick={onEdit} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer" title="Editar misión">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => { if (window.confirm(`¿Eliminar la misión "${team.name}"?`)) onDelete(); }}
              className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Eliminar misión"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
