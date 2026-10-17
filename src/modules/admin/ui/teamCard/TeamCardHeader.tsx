import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { Pencil, ArrowUpRight, MapPin, Users, User, AlertTriangle, AlertOctagon, ShieldCheck } from 'lucide-react';

interface Props {
  team: TeamSupervisionSummary;
  themeColor: string;
  onEdit?: () => void;
  onInspect?: () => void;
}

export const TeamCardHeader: React.FC<Props> = ({ team, themeColor, onEdit, onInspect }) => {
  const badgeConfig = {
    Optimo: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', icon: ShieldCheck, label: 'Operación Estable' },
    Atención: { bg: 'bg-amber-50 text-amber-900 border-amber-200', dot: 'bg-amber-500', icon: AlertTriangle, label: 'Requiere Atención' },
    Crítico: { bg: 'bg-rose-50 text-rose-900 border-rose-200', dot: 'bg-rose-600', icon: AlertOctagon, label: 'Alerta Territorial' },
  }[team.healthStatus] || { bg: 'bg-stone-50 text-stone-800 border-stone-200', dot: 'bg-stone-500', icon: ShieldCheck, label: 'Estado' };

  const StatusIcon = badgeConfig.icon;

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between gap-2">
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

        <div className="flex items-center gap-1 text-stone-400 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1 rounded-md hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              title="Editar misión"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onInspect && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onInspect(); }}
              className="p-1 rounded-md hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
              title="Supervisar plan"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-extrabold text-[15px] text-stone-900 font-['Outfit'] truncate group-hover:text-[#8B251E] transition">
        {team.name}
      </h3>

      <div className="flex items-center justify-between text-[11px] text-stone-500 gap-2">
        <span className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 text-[#E67324] shrink-0" />
          <span className="truncate">{team.region}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <Users className="w-3 h-3 text-stone-400" />
          <span>{team.membersCount} obreros</span>
        </span>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium truncate">
        <User className="w-3 h-3 text-stone-400 shrink-0" />
        <span className="text-stone-400">Líder:</span>
        <span className="font-bold text-stone-800 truncate">{team.leader}</span>
      </div>
    </div>
  );
};
