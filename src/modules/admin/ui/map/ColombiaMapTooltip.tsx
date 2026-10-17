import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { ArrowRight, User, MapPin, X } from 'lucide-react';

interface Props {
  team: TeamSupervisionSummary | null;
  onClose: () => void;
  onInspect: (teamId: string) => void;
}

export const ColombiaMapTooltip: React.FC<Props> = ({ team, onClose, onInspect }) => {
  if (!team) return null;
  const color = team.themeColor || '#8B251E';

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-200/90 animate-fadeIn z-20">
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <h4 className="font-extrabold text-xs text-stone-900 truncate font-['Outfit']">
            {team.name}
          </h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-2 space-y-1 text-[11px] text-stone-600">
        <div className="flex items-center gap-1 text-stone-500 truncate">
          <MapPin className="w-3 h-3 text-[#E67324] shrink-0" />
          <span className="truncate">{team.region} ({team.department})</span>
        </div>
        <div className="flex items-center gap-1 text-stone-700 truncate">
          <User className="w-3 h-3 text-stone-400 shrink-0" />
          <span>Líder: <strong>{team.leader}</strong></span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-stone-400 font-semibold block uppercase">Avance</span>
          <span className="text-xs font-black text-stone-900">{team.progressPercentage}%</span>
        </div>

        <button
          type="button"
          onClick={() => onInspect(team.id)}
          className="px-2.5 py-1 rounded-lg text-white font-bold text-[11px] transition flex items-center gap-1 shadow-xs cursor-pointer hover:brightness-110"
          style={{ backgroundColor: color }}
        >
          <span>Supervisar</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
