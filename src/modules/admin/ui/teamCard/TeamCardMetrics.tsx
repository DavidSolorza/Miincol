import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import type { PhaseType } from '../../../plans/domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { MapPin, User, Users, ChevronDown } from 'lucide-react';

const PHASES_LIST: { id: PhaseType; name: string }[] = [
  { id: 'investigacion', name: '1. Investigación' },
  { id: 'encarnacion', name: '2. Encarnación' },
  { id: 'evangelizacion', name: '3. Evangelización' },
  { id: 'entrenamiento', name: '4. Entrenamiento' },
  { id: 'autocuidado', name: '5. Autocuidado' },
];

interface Props {
  team: TeamSupervisionSummary;
  selectedPhaseId: PhaseType;
  onPhaseSelect: (phaseId: PhaseType) => void;
  themeColor: string;
}

export const TeamCardMetrics: React.FC<Props> = ({ team, selectedPhaseId, onPhaseSelect, themeColor }) => {
  return (
    <div className="space-y-2 text-xs text-stone-600">
      <div className="flex items-center justify-between text-[11px] text-stone-500">
        <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-[#E67324] shrink-0" />{team.region}</span>
        <span className="flex items-center gap-1 shrink-0"><Users className="w-3 h-3 text-stone-400" />{team.membersCount} obreros</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-stone-700 font-medium truncate">
        <User className="w-3 h-3 text-stone-400 shrink-0" />
        <span className="text-stone-500">Líder:</span>
        <span className="font-bold text-stone-800 truncate">{team.leader}</span>
      </div>

      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Fase PDM</span>
        <div className="relative inline-block">
          <select
            value={selectedPhaseId}
            onChange={(e) => onPhaseSelect(e.target.value as PhaseType)}
            className="text-[11px] font-bold text-stone-800 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 pr-6 rounded-lg appearance-none cursor-pointer border border-stone-200/80"
          >
            {PHASES_LIST.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-stone-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="font-semibold text-stone-600">Avance de Fase</span>
          <span className="font-bold text-stone-900">{team.progressPercentage}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${team.progressPercentage}%`, backgroundColor: themeColor }} />
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] pt-1 text-stone-500">
        <span>Presupuesto Anual:</span>
        <span className="font-bold text-stone-800 font-mono">{formatCurrencyCOP(team.totalBudget)}</span>
      </div>
    </div>
  );
};
